## 基于kylin的预计算实现实时数据统计

## 1、kylin的基本介绍

Apache Kylin 是一个开源的**分布式存储引擎**，最初由 eBay 开发贡献至开源 社区。它**提供 Hadoop 之上的 SQL 查询接口**及**多维分析（OLAP）能力**以支持大规模数据，能够处理 TB 乃至 PB 级别的分析任务，能够**在亚秒级查询巨大的 Hive 表，并支持高并发。**                             

#### 1.1、为什么要使用kylin

自从 10 年前 Hadoop 诞生以来，大数据的存储和批处理问题均得到了妥善解 决，而如何高速地分析数据也就成为了下一个挑战。于是各式各样的“**SQL on Hadoop**”技术应运而生，其中以 Hive 为代表，**Impala、Presto、Phoenix、Drill、 SparkSQL** 等紧随其后。它们的主要技术是“大规模并行处理”（Massive Parallel Processing，MPP）和“列式存储”（Columnar Storage）。 

大规模并行处理可以调动多台机器一起进行并行计算，用线性增加的资源来换取计算时间的线性下降。列式存储则将记录按列存放，这样做不仅可以在访问 时只读取需要的列，还可以利用存储设备擅长连续读取的特点，大大提高读取的速率。这两项关键技术使得 Hadoop 上的 SQL 查询速度从小时提高到了分钟。 然而分钟级别的查询响应仍然离交互式分析的现实需求还很远。分析师敲入查询指令，按下回车，还需要去倒杯咖啡，静静地等待查询结果。得到结果之后 才能根据情况调整查询，再做下一轮分析。如此反复，一个具体的场景分析常常 需要几小时甚至几天才能完成，效率低下。 

这是因为**大规模并行处理和列式存储虽然提高了计算和存储的速度**，但并**没有改变查询问题本身的时间复杂度**，也没有改变查询时间与数据量成线性增长的 关系这一事实。假设查询 1 亿条记录耗时 1 分钟，那么查询 10 亿条记录就需 10分钟，100 亿条记录就至少需要 1 小时 40 分钟。 当然，可以用很多的优化技术缩短查询的时间，比如更快的存储、更高效的压缩算法，等等，但总体来说，查询性能与数据量呈线性相关这一点是无法改变 的。虽然大规模并行处理允许十倍或百倍地扩张计算集群，以期望保持分钟级别 的查询速度，但购买和部署十倍或百倍的计算集群又怎能轻易做到，更何况还有 高昂的硬件运维成本。 另外，对于分析师来说，完备的、经过验证的数据模型比分析性能更加重要， 直接访问纷繁复杂的原始数据并进行相关分析其实并不是很友好的体验，特别是 在超大规模的数据集上，分析师将更多的精力花在了等待查询结果上，而不是在更加重要的建立领域模型上。

#### 1.2、kylin的使用场景

(1) 假如你的数据存储于 Hadoop 的 HDFS 分布式文件系统中，并且**使用 Hive 来基于 HDFS 构建数据仓库系统**，并进行数据分析，但是数据量巨大， 比如 PB 级别； 

(2) 同时也**使用 HBase 来进行数据的存储和利于 HBase 的行键实现数据 的快速查询；** 

(3) 数据分析平台的数据量逐日累积增加； 

(4) 对于**数据分析的维度大概 10 个左右**。 如果类似于上述的场景，那么非常适合使用 Apache Kylin 来做大数据的**多维分析**。 

#### 1.3、kylin如何解决海量数据的查询问题

Apache Kylin 的初衷就是要解决千亿条、万亿条记录的秒级查询问 题，其中的关键就是要**打破查询时间随着数据量成线性增长的这个规律**。仔细思考大数据 OLAP，可以注意到两个事实。

大数据查询要的一般是统计结果，是多条记录经过聚合函数计算后的统计值。原始的记录则不是必需的，或者访问频率和概率都极低。 

聚合是按维度进行的，由于业务范围和分析需求是有限的，有意义的维度聚合组合也是相对有限的，一般不会随着数据的膨胀而增长。 

基于以上两点，我们可以得到一个新的思路——**“预计算”**。应尽量多地预先计算聚合结果，在查询时刻应尽量使用预算的结果得出查询结果，从而避免直接扫描可能无限增长的原始记录。 

举例来说，使用如下的 SQL 来查询 10 月 1 日那天销量最高的商品：

 ![image-20200517182207699](kylin.assets/image-20200517182207699.png)

用传统的方法时需要扫描所有的记录，再找到 10 月 1 日的销售记录，然后按商品聚合销售额，最后排序返回。假如 10 月 1 日有 1 亿条交易，那么查询必须读取并累计至少 1 亿条记录，且这个查询速度会随将来销量的增加而逐步下降。如果日交易量提高一倍到 2 亿，那么查询执行的时间可能也会增加一倍。 而使用**预计算的方法则会事先按维度[sell_date ， item] 计 算 sum(sell_amount）**并存储下来，在查询时找到 10 月 1 日的销售商品就可以直接排序返回了。读取的记录数最大不会超过维度[sell_date，item]的组合数。显 然这个数字将远远小于实际的销售记录，比如 10 月 1 日的 1 亿条交易包含了 100万条商品，那么预计算后就只有 100 万条记录了，是原来的百分之一。并且这些 记录已经是按商品聚合的结果，因此又省去了运行时的聚合运算。从未来的发展 来看，查询速度只会随日期和商品数目的增长而变化，与销售记录的总数不再有 直接联系。假如日交易量提高一倍到 2 亿，但只要商品的总数不变，那么预计算 的结果记录总数就不会变，查询的速度也不会变。 

**==预计算==”就是 Kylin 在“大规模并行处理”和“列式存储”之外，提供给大数据分析的第三个关键技术。**

 

## 2、Kylin前置基础知识了解

#### 1、数据仓库、OLAP 与 BI

##### 数据仓库

数据仓库，英文名称 Data Warehouse，简称 DW。《数据仓库》一书中的定义 为：数据仓库就是面向主题的、集成的、相对稳定的、随时间不断变化（不同时 间）的数据集合，用以支持经营管理中的决策制定过程、数据仓库中的数据面向 主题，与传统数据库面向应用相对应。

利用数据仓库的方式存放的资料，具有一旦存入，便不会随时间发生变动的 特性，此外，存入的资料必定包含时间属性，通常一个数据仓库中会含有大量的 历史性资料，并且它可利用特定的分析方式，从其中发掘出特定的资讯。 

##### OLAP

1、OLAP的基本概念

OLAP（**Online Analytical Process**），**联机分析处理**，以多维度的方式分 析数据，而且能够弹性地提供上卷（Roll-up）、下钻（Drill-down）和切片（Slice） 等操作，它是呈现集成性决策信息的方法，多用于决策支持系统、商务智能或数 据仓库。其主要的功能在于方便大规模数据分析及统计计算，可对决策提供参考 和支持。与之相区别的是联机交易处理（OLTP），联机交易处理，更侧重于基本 的、日常的事务处理，包括数据的增删改查。

OLAP 需要以大量历史数据为基础，再配合上时间点的差异，对多维 度及汇整型的信息进行复杂的分析。 

OLAP 需要用户有主观的信息需求定义，因此系统效率较佳。

OLAP 的概念，在实际应用中存在广义和狭义两种不同的理解方式。广义上 的理解与字面上的意思相同，泛指一切不会对数据进行更新的分析处理。但更多的情况下 **OLAP 被理解为其狭义上的含义，即与多维分析相关，基于立方体（Cube） 计算而进行的分析。** 

![image-20200517183041655](kylin.assets/image-20200517183041655.png)

OLAP（online analytical processing）是一种软件技术，它使分析人员能够迅速、一致、交互地从各个方面观察信息，以达到深入理解数据的目的。从各方面观察信息，也就是从不同的维度分析数据，因此OLAP也成为多维分析。 

2、OLAP的类型

也可以分为ROLAP和MOLAP

![image-20200517183054000](kylin.assets/image-20200517183054000.png)

3、OLAP CUBE

![image-20200517183148242](kylin.assets/image-20200517183148242.png)

4、CUBE与 Cuboid

![image-20200517183227924](kylin.assets/image-20200517183227924.png)

##### BI

BI（Business Intelligence），即商务智能，指用现代数据仓库技术、在线分析技术、数据挖掘和数据展现技术进行数据分析以实现商业价值。

#### 2、事实表与维度表

**事实表（Fact Table）是指存储有事实记录的表**，如系统日志、销售记录等； 事实表的记录在不断地动态增长，所以它的体积通常远大于其他表。 

**维度表（Dimension Table）或维表，有时也称查找表（Lookup Table）**，是 分析事实的一种角度，是与事实表相对应的一种表；它保存了维度的属性值，可 以跟事实表做关联；相当于将事实表上经常重复出现的属性抽取、规范出来用一 张表进行管理。常见的维度表有：日期表（存储与日期对应的周、月、季度等的 属性）、地点表（包含国家、省／州、城市等属性）等。使用维度表有诸多好处， 具体如下。 

·缩小了事实表的大小。 

·便于维度的管理和维护，增加、删除和修改维度的属性，不必对事实表的大量记录进行改动。 

·维度表可以为多个事实表重用，以减少重复工作。 

#### 3、维度与度量

维度是指审视数据的角度，它通常是数据记录的一个属性，例如时间、地点 等。 

度量是基于数据所计算出来的考量值；它通常是一个数值，如总销售额、不 同的用户数等。 分析人员往往要结合若干个维度来审查度量值，以便在其中找到变化规律。 在一个 SQL 查询中，Group By 的属性通常就是维度，而所计算的值则是度量。 如下面的示例：

![image-20200517183248951](kylin.assets/image-20200517183248951.png)

 在上面的这个查询中，part_dt 和 lstg_site_id 是维度，sum（price）和 

count（distinct seller_id）是度量。

![image-20200517183242655](kylin.assets/image-20200517183242655.png)

#### 4、数据仓库建模常用手段方式

##### 星型模型：

星形模型中有**一张事实表**，以及零个或**多个维度表**；事实表与维度表通过主 键外键相关联，维度表之间没有关联，就像很多星星围绕在一个恒星周围，故取 名为星形模型。 

![image-20200517183351773](kylin.assets/image-20200517183351773.png)

##### 雪花模型：

若将星形模型中**某些维度的表再做规范，抽取成更细的维度表**，然后让维度表之间也进行关联，那么这种模型称为雪花模型。

 ![image-20200517183400500](kylin.assets/image-20200517183400500.png)

##### 星座模式：

星座模式是星型模式延伸而来，星型模式是基于一张事实表的，而星座模式是**基于多张事实表**的，而且**共享维度信息**。

前面介绍的两种维度建模方法都是多维表对应单事实表，但**在很多时候维度空间内的事实表不止一个，而一个维表也可能被多个事实表用到**。在业务发展后期，绝大部分维度建模都采用的是星座模式。

 ![image-20200517183457540](kylin.assets/image-20200517183457540.png)

**注意：Kylin 只支持星形模型的数据集**

#### 5、数据立方体

Cube（或 Data Cube），即**数据立方体**，是一种常用于数据分析与索引的技术；它可以对原始数据建立多维度索引。通过 Cube 对数据进行分析，可以大大 加快数据的查询效率。 

Cuboid 在 Kylin 中特指在某一种维度组合下所计算的数据。 给定一个数据模型，我们可以**对其上的所有维度进行组合**。对于 N 个维度来说，组合的所有可能性共有 **2 的 N 次方种**。对于每一种维度的组合，将度量做聚合运算，然后将运算的结果保存为一个物化视图，称为 Cuboid。 

**所有维度组合的 Cuboid 作为一个整体，被称为 Cube**。所以简单来说，一**个 Cube 就是许多按维度聚合的物化视图的集合。**

下面来列举一个具体的例子。假定有一个电商的销售数据集，其中维度包括 时间（Time）、商品（Item）、地点（Location）和供应商（Supplier），度量为销 售额（GMV）。那么所有维度的组合就有 2 的 4 次方 =16 种，比如一维度（1D） 的组合有[Time]、[Item]、[Location]、[Supplier]4 种；二维度（2D）的组合 有[Time，Item]、[Time，Location]、[Time、Supplier]、[Item，Location]、 [Item，Supplier]、[Location，Supplier]6 种；三维度（3D）的组合也有 4 种； 最后零维度（0D）和四维度（4D）的组合各有 1 种，总共就有 16 种组合。

 ![image-20200517183709150](kylin.assets/image-20200517183709150.png)

#### 6、Kylin的工作原理

**Apache Kylin 的工作原理就是对数据模型做 Cube 预计算**，并利用计算的结果加速查询，具体工作过程如下。 

1）指定数据模型，定义维度和度量。 

2）预计算 Cube，计算所有 Cuboid 并保存为物化视图。 

3）执行查询时，读取 Cuboid，运算，产生查询结果。 

由于 ==Kylin 的查询过程不会扫描原始记录==，而是**通过预计算预先完成表的关联、聚合等复杂运算，并利用预计算的结果来执行查询**，因此相比非预计算的查 询技术，其速度一般要快一到两个数量级，并且这点在超大的数据集上优势更明 显。当数据集达到千亿乃至万亿级别时，Kylin 的速度甚至可以超越其他非预计算技术 1000 倍以上。 

#### 7、Kylin的体系架构

Apache Kylin 系统可以分为**在线查询**和**离线构建**两部分，技术架构如图所 示，在线查询的模块主要处于上半区，而离线构建则处于下半区。 

![image-20200517183920822](kylin.assets/image-20200517183920822.png)

1）REST Server

**REST Server是一套面向应用程序开发的入口点，**旨在**实现针对Kylin平台的应用开发工作**。 此类应用程序可以提供查询、获取结果、触发cube构建任务、获取元数据以及获取用户权限等等。另外可以通过Restful接口实现SQL查询。

2）查询引擎（Query Engine）

当cube准备就绪后，查询引擎就能够获取并解析用户查询。它随后会与系统中的其它组件进行交互，从而向用户返回对应的结果。 

3）路由器（Routing）

在最初设计时曾考虑过**将Kylin不能执行的查询引导去Hive中继续执行**，但在实践后发现Hive与Kylin的速度差异过大，导致用户无法对查询的速度有一致的期望，很可能大多数查询几秒内就返回结果了，而有些查询则要等几分钟到几十分钟，因此体验非常糟糕。最后这个路由功能在发行版中**默认关闭**。

4）元数据管理工具（Metadata）

Kylin是一款元数据驱动型应用程序。元数据管理工具是一大关键性组件，用于对**保存在Kylin当中的所有元数据进行管理**，其中**包括最为重要的cube元数据**。其它全部组件的正常运作都需以元数据管理工具为基础。 ==Kylin的元数据存储在hbase中==。 

5）任务引擎（Cube Build Engine）

这套引擎的设计目的在于处理所有离线任务，其中包括shell脚本、Java API以及Map Reduce任务等等。任务引擎对Kylin当中的全部任务加以管理与协调，从而确保每一项任务都能得到切实执行并解决其间出现的故障。

#### 8、Kylin特点

Kylin的主要特点包括支持**SQL接口、支持超大规模数据集、亚秒级响应、可伸缩性、高吞吐率、BI工具集成**等。

1）标准SQL接口：Kylin是以标准的SQL作为对外服务的接口。

2）支持超大数据集：Kylin对于大数据的支撑能力可能是目前所有技术中最为领先的。早在2015年eBay的生产环境中就能支持百亿记录的秒级查询，之后在移动的应用场景中又有了千亿记录秒级查询的案例。

3）亚秒级响应：Kylin拥有优异的查询相应速度，这点得益于预计算，很多复杂的计算，比如连接、聚合，在离线的预计算过程中就已经完成，这大大降低了查询时刻所需的计算量，提高了响应速度。

4）可伸缩性和高吞吐率：单节点Kylin可实现每秒70个查询，还可以搭建Kylin的集群。

5）BI工具集成

Kylin可以与现有的BI工具集成，具体包括如下内容。

ODBC：与Tableau、Excel、PowerBI等工具集成

JDBC：与Saiku、BIRT等Java工具集成

RestAPI：与JavaScript、Web网页集成

Kylin开发团队还贡献了**Zepplin**的插件，也可以使用Zepplin来访问Kylin服务。

## 3、Kylin的环境安装

1）官网地址

http://kylin.apache.org/cn/

2）官方文档

http://kylin.apache.org/cn/docs/

3）下载地址

http://kylin.apache.org/cn/download/

#### 单节点服务模式安装

kylin的运行环境分为**单机模式**和**集群模式**，单机模式只需要在任意一台机器安装一台kylin服务即可，集群模式可以在所有机器上面都安装，然后所有机器的kylin组成集群

**kylin的服务安装需要依赖于 zookeeper，hdfs，yarn，hive，hbase等各种服务**，在安装kylin之前需要保证我们的zookeeper，hdfs，yarn，hive以及hbase的服务都是正常的

| 主机名  服务      | Node01           | Node02         | Node03         |
| ----------------- | ---------------- | -------------- | -------------- |
| zookeeper         | QuorumPeerMain   | QuorumPeerMain | QuorumPeerMain |
| hdfs              | namenode         |                |                |
| secondaryNameNode |                  |                |                |
| DataNode          | DataNode         | DataNode       |                |
| Yarn              | ResourceManager  |                |                |
| NodeManager       | NodeManager      | NodeManager    |                |
| MapReduce         | JobHistoryServer |                |                |
| HBase             | HMaster          |                |                |
| HRegionServer     | HRegionServer    | HRegionServer  |                |
| Hive              |                  |                | HiveServer2    |
|                   |                  | MetaStore      |                |

 

##### 第一步：下载kylin安装包上传并解压

kylin安装包下载地址为

[http://mirrors.tuna.tsinghua.edu.cn/apache/kylin/apache-kylin-2.6.3/apache-kylin-2.6.3-bin-cdh57.tar.gz](http://mirrors.tuna.tsinghua.edu.cn/apache/kylin/apache-kylin-2.6.3/apache-kylin-2.6.3-bin-cdh57.tar.gz)

将安装包上传到node03服务器的/kkb/soft路径下，并解压到/kkb/install

node03执行以下命令，进行解压

```sh
cd /kkb/soft

tar -zxf apache-kylin-2.6.3-bin-cdh57.tar.gz -C /kkb/install/
```

 

##### 第二步：node03服务器开发环境变量配置

node03服务器添加以下环境变量：

```
sudo vim /etc/profile
```

```sh
export JAVA_HOME=/kkb/install/jdk1.8.0_141
export PATH=:$JAVA_HOME/bin:$PATH

export HADOOP_HOME=/kkb/install/hadoop-2.6.0-cdh5.14.2
export PATH=:$HADOOP_HOME/bin:$PATH

export HBASE_HOME=/kkb/install/hbase-1.2.0-cdh5.14.2
export PATH=:$HBASE_HOME/bin:$PATH

export HIVE_HOME=/kkb/install/hive-1.1.0-cdh5.14.2
export PATH=:$HIVE_HOME/bin:$PATH

export HCAT_HOME=/kkb/install/hive-1.1.0-cdh5.14.2
export PATH=:$HCAT_HOME/hcatalog:$PATH

export KYLIN_HOME=/kkb/install/apache-kylin-2.6.3-bin-cdh57
export PATH=:$KYLIN_HOME/bin:$PATH

export dir=/kkb/install/apache-kylin-2.6.3-bin-cdh57/bin
export PATH=$dir:$PATH

```

更改完了环境变量，记得**source /etc/profile** 生效

##### 第三步：node03启动kylin服务

node03执行以下命令启动kylin服务

```sh
cd /kkb/install/apache-kylin-2.6.3-bin-cdh57
bin/kylin.sh start
```

##### 第四步：浏览器访问kylin服务

浏览器界面访问kylin服务

http://node03.kaikeba.com:7070/kylin/

用户名：ADMIN

密码：KYLIN

#### kylin的集群环境安装

单节点的kylin环境，主要用于我们方便测试学习，**实际工作当中，我们主要还是使用kylin的集群模式来进行开发**，接下来我们就来看一下kylin的集群模式该如何运行

- **Kylin的实例是无状态的，运行时的状态保存在Hbase的元数据中（kylin.metadata.url指定）**
- 只要每个实例都指向读取共同的元数据就可以完成集群的部署（即元数据共享）
- 对于每个实例，都必须指定实例运行的模式（**kylin.server.mode**），共有3种模式
  -  job 只能运行job引擎
  -  query 只能运行查询引擎
  -  all 既可以运行job 又可以运行query

query模式下只支持sql查询，不执行cube的构建等相关操作。 特别注意：**kylin集群中只能有一个实例运行job引擎，其他必须是query模式。**

 ![image-20200517184514502](kylin.assets/image-20200517184514502.png)

##### 集群模式重要配置参数介绍

当kylin以集群模式运行的时候，会存在多个运行实例，可以通过conf/kylin.properties中两个参数进行设置

```
kylin.server.cluster-servers
```

列出所有rest  web  Servers，使得实例之间进行同步，比如设置为：

```sh
kylin.server.cluster-servers=node01:7070,node02:7070,node03:7070
```

```sh
kylin.server.mode
```

确保一个实例配置的是all或者job,其他都必须是query模式。

##### 第一步：将node03服务器的kylin安装包分发到其他机器

将node03服务器/kkb/install路径下的kylin的安装包分发到其他服务器上面去

node03执行以下命令停止kylin服务，然后将kylin安装包分发到其他服务器上面去

```sh
cd /kkb/install/apache-kylin-2.6.3-bin-cdh57
bin/kylin.sh stop
cd /kkb/install/
scp -r apache-kylin-2.6.3-bin-cdh57/ node02:$PWD
scp -r apache-kylin-2.6.3-bin-cdh57/ node01:$PWD
```

##### 第二步：三台机器修改kylin配置文件kylin.properties

三台服务器分别修改kylin配置文件kylin.properties

node01服务器修改配置文件

```sh
cd /kkb/install/apache-kylin-2.6.3-bin-cdh57/conf/

vim kylin.properties
```

```sh
kylin.metadata.url=kylin_metadata@hbase

kylin.env.hdfs-working-dir=/kylin

kylin.server.mode=query

kylin.server.cluster-servers=node01:7070,node02:7070,node03:7070

kylin.storage.url=hbase

kylin.job.retry=2

kylin.job.max-concurrent-jobs=10

kylin.engine.mr.yarn-check-interval-seconds=10

kylin.engine.mr.reduce-input-mb=500

kylin.engine.mr.max-reducer-number=500

kylin.engine.mr.mapper-input-rows=1000000
```

node02服务器修改配置文件

```
cd /kkb/install/apache-kylin-2.6.3-bin-cdh57/conf/

vim kylin.properties
```

```
kylin.metadata.url=kylin_metadata@hbase

kylin.env.hdfs-working-dir=/kylin

kylin.server.mode=query

kylin.server.cluster-servers=node01:7070,node02:7070,node03:7070

kylin.storage.url=hbase

kylin.job.retry=2

kylin.job.max-concurrent-jobs=10

kylin.engine.mr.yarn-check-interval-seconds=10

kylin.engine.mr.reduce-input-mb=500

kylin.engine.mr.max-reducer-number=500

kylin.engine.mr.mapper-input-rows=1000000
```

node03服务器修改配置文件

```
cd /kkb/install/apache-kylin-2.6.3-bin-cdh57/conf/

vim kylin.properties
```

```sh
kylin.metadata.url=kylin_metadata@hbase

kylin.env.hdfs-working-dir=/kylin

kylin.server.mode=all

kylin.server.cluster-servers=node01:7070,node02:7070,node03:7070

kylin.storage.url=hbase

kylin.job.retry=2

kylin.job.max-concurrent-jobs=10

kylin.engine.mr.yarn-check-interval-seconds=10

kylin.engine.mr.reduce-input-mb=500

kylin.engine.mr.max-reducer-number=500

kylin.engine.mr.mapper-input-rows=1000000
```

##### 第三步：三台机器配置环境变量

三台机器编辑/etc/profile，添加环境变量

注意：需要将hive的安装文件夹，每一台机器都拷贝

```
sudo vim /etc/profile
```

```sh
export JAVA_HOME=/kkb/install/jdk1.8.0_141
export PATH=:$JAVA_HOME/bin:$PATH

export HADOOP_HOME=/kkb/install/hadoop-2.6.0-cdh5.14.2
export PATH=:$HADOOP_HOME/bin:$PATH

export HBASE_HOME=/kkb/install/hbase-1.2.0-cdh5.14.2
export PATH=:$HBASE_HOME/bin:$PATH

export HIVE_HOME=/kkb/install/hive-1.1.0-cdh5.14.2
export PATH=:$HIVE_HOME/bin:$PATH

export HCAT_HOME=/kkb/install/hive-1.1.0-cdh5.14.2
export PATH=:$HCAT_HOME/hcatalog:$PATH

export KYLIN_HOME=/kkb/install/apache-kylin-2.6.3-bin-cdh57
export PATH=:$KYLIN_HOME/bin:$PATH

export dir=/kkb/install/apache-kylin-2.6.3-bin-cdh57/bin
export PATH=$dir:$PATH

export HBASE_CLASSPATH=/kkb/install/hbase-1.2.0-cdh5.14.2
export PATH=:$HBASE_CLASSPATH:$PATH
```

##### 第四步：三台机器启动kylin服务

三台机器执行以下命令启动kylin服务

```sh
cd /kkb/soft/apache-kylin-2.6.3-bin-cdh57

bin/kylin.sh start
```

##### 第五步：node02安装nginx实现请求负载均衡

注意：nginx的安装需要使用root用户来进行安装

在node02服务器上面安装nginx服务，实现请求负载均衡

将nginx的安装包上传到/kkb/soft路径下，然后解压，并对nginx的配置文件进行配置，然后启动nginx服务即可

1、解压nginx压缩吧

```sh
cd /kkb/soft/

tar -zxf nginx-1.8.1.tar.gz -C /kkb/install/
```

2、编译nginx

```sh
yum -y install gcc pcre-devel zlib-devel openssl openssl-devel

cd /kkb/install/nginx-1.8.1/

./configure --prefix=/usr/local/nginx 

make

make install
```

3、修改nginx的配置文件

node02执行以下命令修改nginx的配置文件

```
cd /usr/local/nginx/conf

vim nginx.conf
```

添加以下内容

在nginx.conf配置文件的最后一个 “}” 上面一行，添加以下内容

```sh
upstream kaikeba {
		least_conn;
		server 192.168.52.100:7070 weight=8;
		server 192.168.52.110:7070 weight=7;
		server 192.168.52.120:7070 weight=7;
	}
	server {
		listen 8066;
		server_name localhost;
		location / {
		proxy_pass http://kaikeba;
		}
	}
```

4、nginx的启动与停止命令

nginx的启动命令，node02执行以下命令启动nginx服务

```sh
cd /usr/local/nginx/

sbin/nginx -c conf/nginx.conf
```

nginx的停止命令，node02执行以下命令停止nginx服务

```sh
cd /usr/local/nginx/

sbin/nginx -s stop
```

##### 第六步：浏览器界面访问

http://node02:8066/kylin/

访问这个网址，就可以实现负载均衡

## 4、kylin的入门使用

我们kylin环境安装成功之后，我们就可以在hive当中创建数据库以及数据库表，然后通过kylin来实现数据的查询

#### 第一步：创建hive数据库以及表并加载以下数据

   dept.txt

```
10	ACCOUNTING	1700
20	RESEARCH	1800
30	SALES	1900
40	OPERATIONS	1700
```

 emp.txt

```
7369	SMITH	CLERK	7902	1980-12-17	800.00		20
7499	ALLEN	SALESMAN	7698	1981-2-20	1600.00	300.00	30
7521	WARD	SALESMAN	7698	1981-2-22	1250.00	500.00	30
7566	JONES	MANAGER	7839	1981-4-2	2975.00		20
7654	MARTIN	SALESMAN	7698	1981-9-28	1250.00	1400.00	30
7698	BLAKE	MANAGER	7839	1981-5-1	2850.00		30
7782	CLARK	MANAGER	7839	1981-6-9	2450.00		10
7788	SCOTT	ANALYST	7566	1987-4-19	3000.00		20
7839	KING	PRESIDENT		1981-11-17	5000.00		10
7844	TURNER	SALESMAN	7698	1981-9-8	1500.00	0.00	30
7876	ADAMS	CLERK	7788	1987-5-23	1100.00		20
7900	JAMES	CLERK	7698	1981-12-3	950.00		30
7902	FORD	ANALYST	7566	1981-12-3	3000.00		20
7934	MILLER	CLERK	7782	1982-1-23	1300.00		10
```

将以上两份文件上传到node03服务器的/kkb/install路径下，然后执行以下命令，创建hive数据库以及数据库表，并加载数据

```sh
cd /kkb/install/hive-1.1.0-cdh5.14.2/
bin/beeline
```

创建数据库并使用该数据库

```
create database kylin_hive;
use kylin_hive;
```

（1）创建部门表

```sql
create external table if not exists kylin_hive.dept(
deptno int,
dname string,
loc int )
row format delimited fields terminated by '\t';
```

（2）创建员工表

```sql
create external table if not exists kylin_hive.emp(
empno int,
ename string,
job string,
mgr int,
hiredate string, 
sal double, 
comm double,
deptno int)
row format delimited fields terminated by '\t';
```

（3）查看创建的表

```
jdbc:hive2://node03:10000> show tables;
OK
tab_name
dept
emp
```

（4）向外部表中导入数据导入数据

```sh
load data local inpath '/kkb/install/dept.txt' into table kylin_hive.dept;

load data local inpath '/kkb/install/emp.txt' into table kylin_hive.emp;
```

查询结果

```sql
jdbc:hive2://node03:10000> select * from emp;

jdbc:hive2://node03:10000> select * from dept;
```

#### 第二步：访问kylin浏览器界面，并创建project

直接在浏览器界面访问

http://node02:8066/kylin/login 并登录kylin，用户名 ADMIN，密码KYLIN

点击页面 + 号，来创建工程

 ![image-20200517190609013](kylin.assets/image-20200517190609013.png)

输入工程名称以及工程描述

 ![image-20200517190617219](kylin.assets/image-20200517190617219.png)

为工程添加数据源

 ![image-20200517190622757](kylin.assets/image-20200517190622757.png)

添加数据源表

 ![image-20200517190632936](kylin.assets/image-20200517190632936.png)

 

 

#### 第三步：为kylin添加models

1、回到models页面

 ![image-20200517190644289](kylin.assets/image-20200517190644289.png)

2、添加new models

 ![image-20200517190653120](kylin.assets/image-20200517190653120.png)

3、填写model name之后，继续下一步

 ![image-20200517190701917](kylin.assets/image-20200517190701917.png)

 

4、选择事实表

这里就选择emp作为事实表

 ![image-20200517190708253](kylin.assets/image-20200517190708253.png)

5、添加维度表

添加我们的DEPT作为维度表，并选择我们的join方式，以及join连接字段

 ![image-20200517190716967](kylin.assets/image-20200517190716967.png)

 ![image-20200517190722369](kylin.assets/image-20200517190722369.png)

6、选择聚合维度信息

 ![image-20200517190733295](kylin.assets/image-20200517190733295.png)

7、选择度量信息

 ![image-20200517190742655](kylin.assets/image-20200517190742655.png)

8、添加分区信息及过滤条件之后“Save”

 ![image-20200517190750272](kylin.assets/image-20200517190750272.png)

 

#### 第四步：通过kylin来构建cube

前面我们已经创建了project和我们的models，接下来我们就来构建我们的cube

1、页面添加，创建一个new cube

 ![image-20200517190803016](kylin.assets/image-20200517190803016.png)

2、选择我们的model以及cube name

 ![image-20200517190814920](kylin.assets/image-20200517190814920.png)

3、添加我们的自定义维度

 ![image-20200517190823895](kylin.assets/image-20200517190823895.png)

 ![image-20200517190829323](kylin.assets/image-20200517190829323.png)

4、添加统计维度

 ![image-20200517190839342](kylin.assets/image-20200517190839342.png)

 ![image-20200517190844397](kylin.assets/image-20200517190844397.png)

5、设置多个分区cube合并信息

因为我们这里是全量统计，不涉及多个分区cube进行合并，所以不用设置历史多个cube进行合并

 ![image-20200517190857979](kylin.assets/image-20200517190857979.png)

 

6、高级设置

高级设置我们这里暂时也不做任何设置，后续再单独详细讲解

 ![image-20200517190906595](kylin.assets/image-20200517190906595.png)

7、额外的其他的配置属性，这里也暂时不做配置

 ![image-20200517190914329](kylin.assets/image-20200517190914329.png)

8、完成，保存配置

 ![image-20200517190921767](kylin.assets/image-20200517190921767.png)

 

 

#### 第五步：构建我们的cube

将我们的cube进行构建

 ![image-20200517190929289](kylin.assets/image-20200517190929289.png)

 ![image-20200517190934544](kylin.assets/image-20200517190934544.png)



#### 第六步：对我们的数进行查询

前面构建好了我们的cube之后，接下来我们就可以对我们的数据进行分析

```sql
SELECT DEPT.DNAME ,SUM(EMP.SAL) FROM EMP INNER JOIN DEPT ON DEPT.DEPTNO = EMP.DEPTNO GROUP BY DEPT.DNAME
```

 ![image-20200517190955889](kylin.assets/image-20200517190955889.png)

我们会发现，数据的查询速度非常快，马上就可以产出结果了，通过kylin的与计算，已经将我们各种可能性的结果都获取到了，我们这里直接就可以得到我们计算完成的结果，所以结果非常快就能计算出来

## 5、kylin的构建流程

![image-20200517191101431](kylin.assets/image-20200517191101431.png)

 ![image-20200517191125653](kylin.assets/image-20200517191125653.png)

 ![image-20200517191140526](kylin.assets/image-20200517191140526.png)

![image-20200517191159208](kylin.assets/image-20200517191159208.png)

![image-20200517191222219](kylin.assets/image-20200517191222219.png)

![image-20200517191254446](kylin.assets/image-20200517191254446.png)

## 6、cube构建算法

#### 1、逐层构建算法

![image-20200517191324488](kylin.assets/image-20200517191324488.png)

我们知道，一个N维的Cube，是由1个N维子立方体、N个(N-1)维子立方体、N*(N-1)/2个(N-2)维子立方体、......、N个1维子立方体和1个0维子立方体构成，总共有2^N个子立方体组成，在逐层算法中，按维度数逐层减少来计算，每个层级的计算（除了第一层，它是从原始数据聚合而来），是基于它上一层级的结果来计算的。比如，[Group by A, B]的结果，可以基于[Group by A, B, C]的结果，通过去掉C后聚合得来的；这样可以减少重复计算；当 0维度Cuboid计算出来的时候，整个Cube的计算也就完成了。

每一轮的计算都是一个MapReduce任务，且串行执行；一个N维的Cube，至少需要N次MapReduce Job。

 ![image-20200517191358353](kylin.assets/image-20200517191358353.png)

 

**算法优点：**

1）此算法充分利用了MapReduce的优点，处理了中间复杂的排序和shuffle工作，故而算法代码清晰简单，易于维护；

2）受益于Hadoop的日趋成熟，此算法非常稳定，即便是集群资源紧张时，也能保证最终能够完成。

**算法缺点：**

1）当Cube有比较多维度的时候，所需要的MapReduce任务也相应增加；由于Hadoop的任务调度需要耗费额外资源，特别是集群较庞大的时候，反复递交任务造成的额外开销会相当可观；

2）由于Mapper逻辑中并未进行聚合操作，所以每轮MR的shuffle工作量都很大，导致效率低下。

3）对HDFS的读写操作较多：由于每一层计算的输出会用做下一层计算的输入，这些Key-Value需要写到HDFS上；当所有计算都完成后，Kylin还需要额外的一轮任务将这些文件转成HBase的HFile格式，以导入到HBase中去；

总体而言，该算法的效率较低，尤其是当Cube维度数较大的时候。

 

 

#### 2、快速构建算法

 ![image-20200517191413553](kylin.assets/image-20200517191413553.png)

也被称作“逐段”(By Segment) 或“逐块”(By Split) 算法，从1.5.x开始引入该算法，该算法的主要思想是，每个Mapper将其所分配到的数据块，计算成一个完整的小Cube 段（包含所有Cuboid）。每个Mapper将计算完的Cube段输出给Reducer做合并，生成大Cube，也就是最终结果。如图所示解释了此流程。

 <img src="kylin.assets/image-20200517191503083.png" alt="image-20200517191503083" style="zoom:50%;" />

 ![image-20200517191532953](kylin.assets/image-20200517191532953.png)

与旧算法相比，快速算法主要有两点不同：

1） Mapper会利用内存做预聚合，算出所有组合；Mapper输出的每个Key都是不同的，这样会减少输出到Hadoop MapReduce的数据量，Combiner也不再需要；

2）一轮MapReduce便会完成所有层次的计算，减少Hadoop任务的调配。

## 7、cube构建的优化

从之前章节的介绍可以知道，在没有采取任何优化措施的情况下，Kylin会对每一种维度的组合进行预计算，每种维度的组合的预计算结果被称为Cuboid。假设有4个维度，我们最终会有24 =16个Cuboid需要计算。

但在现实情况中，用户的维度数量一般远远大于4个。假设用户有10 个维度，那么没有经过任何优化的Cube就会存在210 =1024个Cuboid；而如果用户有20个维度，那么Cube中总共会存在220 =1048576个Cuboid。虽然每个Cuboid的大小存在很大的差异，但是单单想到Cuboid的数量就足以让人想象到这样的Cube对构建引擎、存储引擎来说压力有多么巨大。因此，在构建维度数量较多的Cube时，尤其要注意Cube的剪枝优化（即减少Cuboid的生成）。

#### 1 使用衍生维度（derived dimension）

衍生维度用于在有效维度内将维度表上的非主键维度排除掉，并使用维度表的主键（其实是事实表上相应的外键）来替代它们。Kylin会在底层记录维度表主键与维度表其他维度之间的映射关系，以便在查询时能够动态地将维度表的主键“翻译”成这些非主键维度，并进行实时聚合。

 ![image-20200517191626182](kylin.assets/image-20200517191626182.png)

![image-20200517191644993](kylin.assets/image-20200517191644993.png)

虽然衍生维度具有非常大的吸引力，但这也并不是说所有维度表上的维度都得变成衍生维度，如果从维度表主键到某个维度表维度所需要的聚合工作量非常大，则不建议使用衍生维度。

#### 2 使用聚合组（Aggregation group）

聚合组（Aggregation Group）是一种强大的剪枝工具。聚合组假设一个Cube的所有维度均可以根据业务需求划分成若干组（当然也可以是一个组），由于同一个组内的维度更可能同时被同一个查询用到，因此会表现出更加紧密的内在关联。每个分组的维度集合均是Cube所有维度的一个子集，不同的分组各自拥有一套维度集合，它们可能与其他分组有相同的维度，也可能没有相同的维度。每个分组各自独立地根据自身的规则贡献出一批需要被物化的Cuboid，所有分组贡献的Cuboid的并集就成为了当前Cube中所有需要物化的Cuboid的集合。不同的分组有可能会贡献出相同的Cuboid，构建引擎会察觉到这点，并且保证每一个Cuboid无论在多少个分组中出现，它都只会被物化一次。

对于每个分组内部的维度，用户可以使用如下三种可选的方式定义，它们之间的关系，具体如下。

1）强制维度（Mandatory），如果一个维度被定义为强制维度，那么这个分组产生的所有Cuboid中每一个Cuboid都会包含该维度。每个分组中都可以有0个、1个或多个强制维度。如果根据这个分组的业务逻辑，则相关的查询一定会在过滤条件或分组条件中，因此可以在该分组中把该维度设置为强制维度。

 <img src="kylin.assets/image-20200517191715031.png" alt="image-20200517191715031" style="zoom: 33%;" />

2）层级维度（Hierarchy），每个层级包含两个或更多个维度。假设一个层级中包含D1，D2…Dn这n个维度，那么在该分组产生的任何Cuboid中， 这n个维度只会以（），（D1），（D1，D2）…（D1，D2…Dn）这n+1种形式中的一种出现。每个分组中可以有0个、1个或多个层级，不同的层级之间不应当有共享的维度。如果根据这个分组的业务逻辑，则多个维度直接存在层级关系，因此可以在该分组中把这些维度设置为层级维度。

 <img src="kylin.assets/image-20200517191744975.png" alt="image-20200517191744975" style="zoom:33%;" />

3）联合维度（Joint），每个联合中包含两个或更多个维度，如果某些列形成一个联合，那么在该分组产生的任何Cuboid中，这些联合维度要么一起出现，要么都不出现。每个分组中可以有0个或多个联合，但是不同的联合之间不应当有共享的维度（否则它们可以合并成一个联合）。如果根据这个分组的业务逻辑，多个维度在查询中总是同时出现，则可以在该分组中把这些维度设置为联合维度。

 ![image-20200517191805721](kylin.assets/image-20200517191805721.png)

这些操作可以在Cube Designer的Advanced Setting中的Aggregation Groups区域完成，如下图所示。

![image-20200517191825598](kylin.assets/image-20200517191825598.png)

聚合组的设计非常灵活，甚至可以用来描述一些极端的设计。假设我们的业务需求非常单一，只需要某些特定的Cuboid，那么可以创建多个聚合组，每个聚合组代表一个Cuboid。具体的方法是在聚合组中先包含某个Cuboid所需的所有维度，然后把这些维度都设置为强制维度。这样当前的聚合组就只能产生我们想要的那一个Cuboid了。

再比如，有的时候我们的Cube中有一些基数非常大的维度，如果不做特殊处理，它就会和其他的维度进行各种组合，从而产生一大堆包含它的Cuboid。包含高基数维度的Cuboid在行数和体积上往往非常庞大，这会导致整个Cube的膨胀率变大。如果根据业务需求知道这个高基数的维度只会与若干个维度（而不是所有维度）同时被查询到，那么就可以通过聚合组对这个高基数维度做一定的“隔离”。我们把这个高基数的维度放入一个单独的聚合组，再把所有可能会与这个高基数维度一起被查询到的其他维度也放进来。这样，这个高基数的维度就被“隔离”在一个聚合组中了，所有不会与它一起被查询到的维度都没有和它一起出现在任何一个分组中，因此也就不会有多余的Cuboid产生。这点也大大减少了包含该高基数维度的Cuboid的数量，可以有效地控制Cube的膨胀率。

 

#### 3 并发粒度优化

当Segment中某一个Cuboid的大小超出一定的阈值时，系统会将该Cuboid的数据分片到多个分区中，以实现Cuboid数据读取的并行化，从而优化Cube的查询速度。具体的实现方式如下：构建引擎根据Segment估计的大小，以及参数“kylin.hbase.region.cut”的设置决定Segment在存储引擎中总共需要几个分区来存储，如果存储引擎是HBase，那么分区的数量就对应于HBase中的Region数量。kylin.hbase.region.cut的默认值是5.0，单位是GB，也就是说对于一个大小估计是50GB的Segment，构建引擎会给它分配10个分区。用户还可以通过设置kylin.hbase.region.count.min（默认为1）和kylin.hbase.region.count.max（默认为500）两个配置来决定每个Segment最少或最多被划分成多少个分区。

 ![image-20200517191834083](kylin.assets/image-20200517191834083.png)

由于每个Cube的并发粒度控制不尽相同，因此建议在Cube Designer 的Configuration Overwrites（上图所示）中为每个Cube量身定制控制并发粒度的参数。假设将把当前Cube的kylin.hbase.region.count.min设置为2，kylin.hbase.region.count.max设置为100。这样无论Segment的大小如何变化，它的分区数量最小都不会低于2，最大都不会超过100。相应地，这个Segment背后的存储引擎（HBase）为了存储这个Segment，也不会使用小于两个或超过100个的分区。我们还调整了默认的kylin.hbase.region.cut，这样50GB的Segment基本上会被分配到50个分区，相比默认设置，我们的Cuboid可能最多会获得5倍的并发量。

#### 4 Row Key优化

Kylin会把所有的维度按照顺序组合成一个完整的Rowkey，并且按照这个Rowkey升序排列Cuboid中所有的行。

设计良好的Rowkey将更有效地完成数据的查询过滤和定位，减少IO次数，提高查询速度，维度在rowkey中的次序，对查询性能有显著的影响。

Row key的设计原则如下：

**1**）被用作where过滤的维度放在前边。

 ![image-20200517191901619](kylin.assets/image-20200517191901619.png)

2）基数大的维度放在基数小的维度前边。

 ![image-20200517191936187](kylin.assets/image-20200517191936187.png)

#### 5、增量cube构建

我们前面可以构建全量cube，也可以实现增量cube的构建，就是通过分区表的分区时间字段来进行怎量构建

1、     更改model

 ![image-20200517191958093](kylin.assets/image-20200517191958093.png)

 ![image-20200517192006763](kylin.assets/image-20200517192006763.png)

 2、更改cube

![image-20200517192018144](kylin.assets/image-20200517192018144.png)

![image-20200517192100273](kylin.assets/image-20200517192100273.png)



## 8、备份以及恢复kylin的元数据信息

Kylin组织它所有的元数据(包括cube descriptions and instances, projects, inverted index description and instances,jobs, tables and dictionaries)作为一个层次的文件系统。

然而，Kylin使用HBase来进行存储，而不是普通的文件系统。

我们可以从Kylin的配置文件kylin.properties中查看到：

\### The metadata store in hbase

kylin.metadata.url=kylin_metadata@hbase

表示Kylin的元数据被保存在HBase的kylin_metadata表中。

 

Kylin自身提供了元数据的备份程序，我们可以执行程序看一下帮助信息：

 

```
bin/metastore.sh

usage: metastore.sh backup

metastore.sh fetch DATA

metastore.sh reset

metastore.sh refresh-cube-signature

metastore.sh restore PATH_TO_LOCAL_META

metastore.sh list RESOURCE_PATH

metastore.sh cat RESOURCE_PATH

metastore.sh remove RESOURCE_PATH

metastore.sh clean [--delete true]

 
```

备份元数据

bin/metastore.sh backup

 

恢复元数据

bin/metastore.sh reset

 

接着，上传备份的元数据到Kylin的元数据中

bin/metastore.sh restore $KYLIN_HOME/meta_backups/meta_xxxx_xx_xx_xx_xx_xx

等待操作成功，用户在页面点击Reload Metadata按钮对元数据缓存进行刷新，即可看到最新的元数据

 

## 9、kylin的垃圾清理

当kylin运行一段时间后，有很多数据因为不在使用就变成了垃圾数据，这些数据占据着HDFS HBase等资源，当积累到一定程度会对集群性能产生影响。

 

清理元数据

清理元数据指从kylin元数据中清理掉无用的资源。比如字典表的快照变得无用了。

步骤：

检查哪些资源可以清理，这一步不会删除任何东西：

bin/metastore.sh clean

这会列出所有可以被清理的资源供用户核对，并不会实际上进行删除。

在上述命令中 添加 --delete true .这样就会清理掉晚一点资源，注意操作前最好备份一下元数据

bin/metastore.sh clean --delete true

清理存储器数据

\1. 检查哪些资源需要被清理，这个操作不会删除任何内容：

${KYLIN_HOME}/bin/kylin.sh org.apache.kylin.storage.hbase.util.StorageCleanupJob --delete

false

\2. 根据上面的输出结果，挑选一两个资源看看是否是不再需要的。接着，在上面的命令基础上添加“–

delete true”选项，开始执行清理操作，命令执行完成后，中间的HDFS文件和HTables表就被删除了。

 

${KYLIN_HOME}/bin/kylin.sh org.apache.kylin.storage.hbase.util.StorageCleanupJob --delete

true

 

## 10、BI工具集成

http://kylin.apache.org/cn/docs/howto/howto_use_restapi.html

官方文档使用说明

 

可以与Kylin结合使用的可视化工具很多，例如：

ODBC：与Tableau、Excel、PowerBI等工具集成

JDBC：与Saiku、BIRT等Java工具集成

RestAPI：与JavaScript、Web网页集成

Kylin开发团队还贡献了Zepplin的插件，也可以使用Zepplin来访问Kylin服务。

#### 1、JDBC

1）新建项目并导入依赖

```<dependencies>     <dependency>         <groupId>org.apache.kylin</groupId>         <artifactId>kylin-jdbc</artifactId>         <version>2.5.1</version>     </dependency> </dependencies> <build>     <plugins>         <!-- 限制jdk版本插件 -->         <plugin>             <groupId>org.apache.maven.plugins</groupId>             <artifactId>maven-compiler-plugin</artifactId>             <version>3.0</version>             <configuration>                 <source>1.8</source>                 <target>1.8</target>                 <encoding>UTF-8</encoding>             </configuration>         </plugin>     </plugins> </build>```

 

2）编码

**package** com.kkb.kylin;

 **import** java.sql.Connection;
 **import** java.sql.DriverManager;
 **import** java.sql.PreparedStatement;
 **import** java.sql.ResultSet;

 **public class** KylinJdbc {
   **public static void** main(String[] args) **throws** Exception {

     *//Kylin_JDBC* *驱动**

\*     String KYLIN_DRIVER = **"org.apache.kylin.jdbc.Driver"**;

     *//Kylin_URL

\*     String KYLIN_URL = **"jdbc:kylin://node02:8066/kylin_hive"**;

     *//Kylin**的用户名**

\*     String KYLIN_USER = **"ADMIN"**;

     *//Kylin**的密码**

\*     String KYLIN_PASSWD = **"KYLIN"**;

     *//**添加驱动信息**

\*     Class.*forName*(KYLIN_DRIVER);

     *//**获取连接**

\*     Connection connection = DriverManager.*getConnection*(KYLIN_URL, KYLIN_USER, KYLIN_PASSWD);

     *//**预编译**SQL

\*     PreparedStatement ps = connection.prepareStatement(**"SELECT** *sum***(sal) FROM emp group by deptno"**);

     *//**执行查询**

\*     ResultSet resultSet = ps.executeQuery();

     *//**遍历打印**

\*     **while** (resultSet.next()) {
       System.***out\***.println(resultSet.getInt(1));
     }
   }
 }

 

3）结果展示

 

 

 

## 11、使用kylin来分析我们Hbase当中的数据

前面我们已经通过flink将数据介入到了hbase当中去了，那么我们接下来就可以通过hive整合hbase，将hbase当中的数据映射到hive表当中来，然后通过kylin来对hive当中的数据进行预分析，实现实时数仓的统计功能

#### 第一步：拷贝hbase的五个jar包到hive的lib目录下

将我们HBase的五个jar包拷贝到hive的lib目录下

hbase的jar包都在/kkb/install/hbase-1.2.0-cdh5.14.2/lib

我们需要拷贝五个jar包名字如下

hbase-client-1.2.0-cdh5.14.2.jar        

hbase-hadoop2-compat-1.2.0-cdh5.14.2.jar 

hbase-hadoop-compat-1.2.0-cdh5.14.2.jar 

hbase-it-1.2.0-cdh5.14.2.jar  

hbase-server-1.2.0-cdh5.14.2.jar

我们直接在node03执行以下命令，通过创建软连接的方式来进行jar包的依赖

 

ln -s /kkb/install/hbase-1.2.0-cdh5.14.2/lib/hbase-client-1.2.0-cdh5.14.2.jar       /kkb/install/hive-1.1.0-cdh5.14.2/lib/hbase-client-1.2.0-cdh5.14.2.jar       

ln -s /kkb/install/hbase-1.2.0-cdh5.14.2/lib/hbase-hadoop2-compat-1.2.0-cdh5.14.2.jar   /kkb/install/hive-1.1.0-cdh5.14.2/lib/hbase-hadoop2-compat-1.2.0-cdh5.14.2.jar       

ln -s /kkb/install/hbase-1.2.0-cdh5.14.2/lib/hbase-hadoop-compat-1.2.0-cdh5.14.2.jar    /kkb/install/hive-1.1.0-cdh5.14.2/lib/hbase-hadoop-compat-1.2.0-cdh5.14.2.jar      

ln -s /kkb/install/hbase-1.2.0-cdh5.14.2/lib/hbase-it-1.2.0-cdh5.14.2.jar   /kkb/install/hive-1.1.0-cdh5.14.2/lib/hbase-it-1.2.0-cdh5.14.2.jar        

ln -s /kkb/install/hbase-1.2.0-cdh5.14.2/lib/hbase-server-1.2.0-cdh5.14.2.jar     /kkb/install/hive-1.1.0-cdh5.14.2/lib/hbase-server-1.2.0-cdh5.14.2.jar   

#### 第二步：修改hive的配置文件

编辑node03服务器上面的hive的配置文件hive-site.xml添加以下两行配置

cd /kkb/install/hive-1.1.0-cdh5.14.2/conf

vim hive-site.xml

 

```
     <property>

​        <name>hive.zookeeper.quorum</name>

​        <value>node01,node02,node03</value>

​    </property>

 

​     <property>

​        <name>hbase.zookeeper.quorum</name>

​        <value>node01,node02,node03</value>

​    </property>
```
 

 

#### 第三步：修改hive-env.sh配置文件添加以下配置

cd /kkb/install/hive-1.1.0-cdh5.14.2/conf

vim hive-env.sh

 

export HADOOP_HOME=/kkb/install/hadoop-2.6.0-cdh5.14.2

export HBASE_HOME=/kkb/install/hbase-1.2.0-cdh5.14.2/

export HIVE_CONF_DIR=/kkb/install/hive-1.1.0-cdh5.14.2/conf

 

#### 第四步：创建hive表，映射hbase当中的数据

进入hive客户端，创建hive映射表，映射hbase当中的两张表数据

 

create database hive_hbase;

use hive_hbase;

CREATE external TABLE hive_hbase.data_goods(goodsId int ,goodsName   string ,sellingPrice string ,productPic  string ,productBrand string ,productfbl  string ,productNum  string ,productUrl  string ,productFrom  string ,goodsStock  int , appraiseNum  int) 

STORED BY 'org.apache.hadoop.hive.hbase.HBaseStorageHandler' WITH SERDEPROPERTIES 

("hbase.columns.mapping" = ":key,f1:goodsName  ,f1:sellingPrice ,f1:productPic  ,f1:productBrand ,f1:productfbl  ,f1:productNum  ,f1:productUrl  ,f1:productFrom ,f1:goodsStock  ,  f1:appraiseNum") 

TBLPROPERTIES("hbase.table.name" ="flink:data_goods");

 

CREATE external TABLE hive_hbase.data_orders(orderId int,orderNo string ,userId int,goodId int ,goodsMoney decimal(11,2) ,realTotalMoney decimal(11,2) ,payFrom     int      ,province    string    ,createTime   timestamp ) 

STORED BY 'org.apache.hadoop.hive.hbase.HBaseStorageHandler' WITH SERDEPROPERTIES 

("hbase.columns.mapping" = ":key, f1:orderNo , f1:userId    ,  f1:goodId    ,  f1:goodsMoney  ,f1:realTotalMoney,f1:payFrom    ,f1:province,f1:createTime") 

TBLPROPERTIES("hbase.table.name" ="flink:data_orders");

 

#### 第五步：在kylin当中对我们hive的数据进行多维度分析

直接登录kylin的管理界面，对我们hive当中的数据进行多维度分析

 