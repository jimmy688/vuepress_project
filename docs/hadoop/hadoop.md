---
title: hadoop
sidebar: true
---

# test11

## test

## 文档说明

每一个一级标题下的内容要用到的资料都在对应的文件夹里。

简称说明：

- `nn:namenode`
- `dn：datanode`
- `mr:mapreduce`

## 问题集中点

##### 怎么分析运行mapreduce的输出？怎么查看maptask的个数？

        File System Counters
                FILE: Number of bytes read=27379042
                FILE: Number of bytes written=54749207
                FILE: Number of read operations=0
                FILE: Number of large read operations=0
                FILE: Number of write operations=0
                HDFS: Number of bytes read=22373326
                HDFS: Number of bytes written=471497
                HDFS: Number of read operations=60
                HDFS: Number of large read operations=0
                HDFS: Number of write operations=14
        Job Counters 
                Launched map tasks=2
                Launched reduce tasks=1
                Other local map tasks=2
                Total time spent by all maps in occupied slots (ms)=0
                Total time spent by all reduces in occupied slots (ms)=0
                TOTAL_LAUNCHED_UBERTASKS=3
                NUM_UBER_SUBMAPS=2
                NUM_UBER_SUBREDUCES=1
                Total time spent by all map tasks (ms)=3083
                Total time spent by all reduce tasks (ms)=2590
                Total vcore-milliseconds taken by all map tasks=0
                Total vcore-milliseconds taken by all reduce tasks=0
                Total megabyte-milliseconds taken by all map tasks=0
                Total megabyte-milliseconds taken by all reduce tasks=0
        Map-Reduce Framework
                Map input records=561438
                Map output records=1132650
                Map output bytes=11424180
                Map output materialized bytes=13689492
                Input split bytes=294
                Combine input records=0
                Combine output records=0
                Reduce input groups=11
                Reduce shuffle bytes=13689492
                Reduce input records=1132650
                Reduce output records=11
                Spilled Records=2265300
                Shuffled Maps =2
                Failed Shuffles=0
                Merged Map outputs=2
                GC time elapsed (ms)=395
                CPU time spent (ms)=4250
                Physical memory (bytes) snapshot=798105600
                Virtual memory (bytes) snapshot=9082486784
                Total committed heap usage (bytes)=500576256
        Shuffle Errors
                BAD_ID=0
                CONNECTION=0
                IO_ERROR=0
                WRONG_LENGTH=0
                WRONG_MAP=0
                WRONG_REDUCE=0
        File Input Format Counters 
                Bytes Read=0
        File Output Format Counters 
                Bytes Written=151





## Hadoop发展起源

1. `Hadoop`最早起源于`Nutch`。`Nutch`的设计目标是构建一个大型的全网搜索引擎，包括网页抓取、索引、查询等功能，但随着抓取网页数量的增加，遇到了严重的可扩展性问题——如何解决数十亿网页的存储和索引问题。

2. 2003年、2004年谷歌发表的两篇论文为该问题提供了可行的解决方案。

   ——分布式文件系统（`GFS`），可用于处理海量网页的存储

   ——分布式计算框架`MAPREDUCE`，可用于处理海量网页的索引计算问题。

3. `Nutch`的开发人员利用`Java`完成了相应的开源实现`HDFS`和`MAPREDUCE`，并从`Nutch`中剥离成为独立项目`HADOOP`，到2008年1月，`HADOOP`成为`Apache`顶级项目(同年，`cloudera`公司成立)，迎来了它的快速发展期。

4. `Hadoop`作者`Doug Cutting`

![img](hadoop.assets/clip_image004-1581252376193.jpg)

5. Apache Lucene是一个文本搜索系统库

6. Apache Nutch作为前者的一部分，主要包括web爬虫、全文检索；2003年“谷歌分布式文件系统GFS”论文，2004年开源版本HDFS

7. 2004年“谷歌MapReduce”论文，2005年Nutch开源版MapReduce



狭义上来说，hadoop就是单独指代hadoop这个软件

广义上来说，hadoop指代大数据的一个**生态圈**，包括很多其他的软件

![img](hadoop.assets/clip_image002-1581252376192.png)

> **老师话语：**
>
> 当时**doug cutting**花了2年的业余时间，写了几十万行的代码，做一个叫做lucene nutch的项目，主要做网络爬虫，从网上爬取海量的网页，存储起来，做一些索引，然后过程中他的团队遇到了两个问题：
>
> - 第一问题：数据量太大，存储面临困难
> - 第二个问题：数据量太大，做索引，肯定要计算，面临挑战
>
> 然后呢，2003 和2004年，google分别发布了两篇论文：
>
> - GFS 论文 ——> 给了他团队灵感，利用Java实现了这篇分布式文件系统的论文 NFS
>
>   一开始叫做NFS，是因为是给Nutch这个项目用的。
>
> - MapReduce论文 -> MapReduce 
>
> NFS + MapReduce 后来将俩者从项目中抽离了出来，=》 形成了现在的hadoop框架

## Hadoop版本

##### hadoop的发展版本

- `0.x`系列版本：hadoop当中最早的一个开源版本，在此基础上演变而来的1.x以及2.x的版本
- `1.x`版本系列：hadoop版本当中的第二代开源版本，主要修复0.x版本的一些bug等
- `2.x`版本系列：架构产生重大变化，**引入了yarn平台**等许多新特性，也是现在生产环境当中使用最多的版本。**前使用的比较多的还是2.x** ，比如2.6 2.7 2.8，很多公司都避免过于激进。
- `3.x`版本系列：在2.x版本的基础上，引入了一些hdfs的新特性等，且已经发布了稳定版本，未来公司的使用趋势

##### hadoop生产环境版本选择

Hadoop三大发行版本：**Apache、Cloudera、Hortonworks**。

Apache版本最原始（最基础）的版本，对于入门学习最好。

Cloudera在大型互联网企业中用的较多。

Hortonworks文档较好。

###### **Apache Hadoop**

- 官网地址：http://hadoop.apache.org/releases.html
- 下载地址：https://archive.apache.org/dist/hadoop/common/

###### **Cloudera Hadoop** 

- 官网地址：https://www.cloudera.com/downloads/cdh/5-10-0.html
- 下载地址：http://archive-primary.cloudera.com/cdh5/cdh/5/

> （1）2008年成立的Cloudera是最早将Hadoop商用的公司，为合作伙伴提供Hadoop的商用解决方案，主要是包括支持、咨询服务、培训。
>
> （2）2009年Hadoop的创始人Doug Cutting也加盟Cloudera公司。Cloudera产品主要为CDH，Cloudera Manager，Cloudera Support
>
> （3）CDH是Cloudera的Hadoop发行版，完全开源，**比Apache Hadoop在兼容性，安全性，稳定性上有所增强。**
>
> （4）Cloudera Manager是集群的软件分发及管理监控平台，可以在几个小时内部署好一个Hadoop集群，并对集群的节点及服务进行实时监控。Cloudera Support即是对Hadoop的技术支持。
>
> （5）Cloudera的标价为每年每个节点4000美元。Cloudera开发并贡献了可实时处理大数据的Impala项目。

###### **Hortonworks Hadoop**

- 官网地址：https://hortonworks.com/products/data-center/hdp/
- 下载地址：https://hortonworks.com/downloads/#data-platform

> （1）2011年成立的Hortonworks是雅虎与硅谷风投公司Benchmark Capital合资组建。
>
> （2）公司成立之初就吸纳了大约25名至30名专门研究Hadoop的雅虎工程师，上述工程师均在2005年开始协助雅虎开发Hadoop，贡献了Hadoop80%的代码。
>
> （3）雅虎工程副总裁、雅虎Hadoop开发团队负责人Eric Baldeschwieler出任Hortonworks的首席执行官。
>
> （4）Hortonworks的主打产品是Hortonworks Data Platform（HDP），也同样是100%开源的产品，HDP除常见的项目外还包括了Ambari，一款开源的安装和管理系统。
>
> （5）HCatalog，一个元数据管理系统，HCatalog现已集成到Facebook开源的Hive中。Hortonworks的Stinger开创性的极大的优化了Hive项目。Hortonworks为入门提供了一个非常好的，易于使用的沙盒。
>
> （6）Hortonworks开发了很多增强特性并提交至核心主干，这使得Apache Hadoop能够在包括Window Server和Windows Azure在内的Microsoft Windows平台上本地运行。定价以集群为基础，每10个节点每年为12500美元。
>
> 注意：**Hortonworks已经与Cloudera公司合并**

**使用情况：**

- 中小企业：大部分用`cloudera`版本
- 大型公司：有使用`cloudera`，也有使用`apache hadoop（进行源代码开发）`

## hadoop的运行模式

Hadoop运行模式包括：本地模式、伪分布式模式以及完全分布式模式。

Hadoop官方网站：http://hadoop.apache.org/

##### 1、 本地运行模式

无需任何守护进程，所有的程序都运行在同一个JVM上执行。在独立模式下调试MR程序非常高效方便。所以一般该模式主要是在学习或者开发阶段调试使用

##### 2、 伪分布式运行模式

 Hadoop守护进程运行在本地机器上，模拟一个小规模的集群，换句话说，可以配置一台机器的Hadoop集群,伪分布式是完全分布式的一个特例。

##### 3、完全分布式运行模式（==开发重点==）

Hadoop守护进程运行在一个集群上，需要使用多台机器来实现完全分布式服务的安装

## Hadoop架构模块

![image-20200209212756841](hadoop.assets/image-20200209212756841.png)

## hdfs功能详解

`HDFS（hadoop distributed filesystem)由四部分组成，HDFS Client、NameNode、DataNode和Secondary NameNode。HDFS是一个主/从（Mater/Slave）体系结构，HDFS集群拥有一个NameNode和一些DataNode。NameNode管理文件系统的元数据，DataNode存储实际的数据。

> **HDFS客户端：就是客户端。**
>
> 1、提供一些命令来管理、访问 HDFS，比如启动或者关闭HDFS。
>
> 2、与 DataNode 交互，读取或者写入数据；读取时，要与 NameNode 交互，获取文件的位置信息；写入 HDFS 的时候，**Client 将文件切分成 一个一个的Block，然后进行存储**。
>
> 
>
> **NameNode：即Master，**
>
> 1、管理 HDFS 的名称空间。
>
> 2、管理数据块（`Block`）映射信息
>
> 3、配置副本策略
>
> 4、处理客户端读写请求。
>
> 
>
> **DataNode：**
>
> **就是Slave。NameNode 下达命令，DataNode 执行实际的操作。**
>
> 1、存储实际的数据块。
>
> 2、执行数据块的读/写操作。
>
> 
>
> **Secondary NameNode：**
>
> **并非 NameNode 的热备。当NameNode 挂掉的时候，它并不能马上替换 NameNode 并提供服务。**
>
> 1、辅助 NameNode，分担其工作量。
>
> 2、定期合并 fsimage和fsedits，并推送给NameNode。
>
> 3、在紧急情况下，可辅助恢复 NameNode。

​    

## hdfs的架构详细剖析

HDFS分布式文件系统也是一个主从架构，主节点是我们的namenode，负责管理整个集群以及维护集群的元数据信息，从节点datanode，主要负责文件数据存储：

1）HDFS集群包括，NameNode和DataNode以及Secondary Namenode。

2）NameNode负责管理整个文件系统的元数据，以及每一个路径（文件）所对应的数据块信息。

3）DataNode 负责管理用户的文件数据块，每一个数据块都可以在多个datanode上存储多个副本。

4）Secondary NameNode用来监控HDFS状态的辅助后台程序，每隔一段时间获取HDFS元数据的快照。最主要作用是辅助namenode管理元数据信息

![img](hadoop.assets/clip_image002-1581260528092.jpg)

- heartbeats是心跳的意思，每次启动hdfs,datanode都会通过心跳向namenode汇报自己的存储情况，
- balancing是平衡的意思，表示namenode合适分配块的存储位置，使每个节点负载均衡

#### namenode与datanode

 **Namenode与Datanode的关系图示：**

![image-20200209215609892](hadoop.assets/image-20200209215609892.png)

**NameNode与Datanode的总结概述**

![image-20200209223101423](hadoop.assets/image-20200209223101423.png)

#### **hdfs文件系统容量大小**

hdfs文件系统容量大小约等于各个服务器的容量大小之和得到，为什么是约等于？因为每个服务器都要留部分空间给自身系统等东西，不能全部用来做hdfs的容量。

​     ![image-20200209215327357](hadoop.assets/image-20200209215327357.png)

#### **hdfs存储方式---block**

![image-20200209222846250](hadoop.assets/image-20200209222846250.png)

**hdfs的数据以block块的形式进统一存储管理**，每个block块默认最多可以存储128M的文件，**如果有一个文件大小为1KB，也是要占用一个block块，但是实际占用磁盘空间还是1KB大小**，类似于有一个水桶可以装128斤的水，但是我只装了1斤的水，那么我的水桶里面水的重量就是1斤，而不是128斤。除了些<u>用不可分割算法进行压缩的文件</u>不可被切分外，几乎所有文件都可以被切割。

每个block块的元数据大小大概为150字节

所有的文件都是以block块的方式存放在HDFS文件系统当中，block块的大小可以通过hdfs-site.xml当中的配置文件进行指定:

```xml
<property>
    <name>dfs.block.size</name>
    <value>块大小 以字节为单位</value> <!--只写数值就可以-->
</property>
```

**抽象成数据块的好处：**

- 一个文件有可能大于集群中任意一个磁盘 
  10T*3/128 = xxx块 2T，2T，2T 文件方式存—–>多个block块，这些block块属于一个文件
- 使用块抽象而不是文件可以简化存储子系统
- 块非常适合用于数据备份进而提供数据容错能力和可用性

**hdfs的副本因子**

为了保证block块的安全性，也就是数据的安全性，文件默认保存三个副本，我们可以更改副本数以提高数据的安全性，在hdfs-site.xml当中修改以下配置属性，即可更改文件的副本数：

```xml
<property>
	<name>dfs.replication</name>
	<value>3</value>
</property>
<!--修改之后，之前保存的文件的副本数保持不变，之后存入的文件的副本数会发生变化-->
```

**块缓存**

通常DataNode从磁盘中读取块，但**对于访问频繁的文件，其对应的块可能被缓存在DataNode的内存中**，以堆外块缓存的形式存在。默认情况下，一个块仅缓存在一个DataNode的内存中，当然可以针对每个文件配置DataNode的数量。作业调度器通过在缓存块的DataNode上运行任务，可以利用块缓存的优势提高读操作的性能。

- 例如：  连接（join）操作中使用的一个小的查询表就是块缓存的一个很好的候选。 
  用户或应用通过在缓存池中增加一个cache directive来告诉namenode需要缓存哪些文件及存多久。**缓存池（cache pool）是一个拥有管理缓存权限和资源使用的管理性分组。**

#### hdfs的文件权限验证

hdfs的文件权限机制与linux系统的文件权限机制类似：r:read  w:write x:execute 

![image-20200209232222446](hadoop.assets/image-20200209232222446.png)

**删除一个文件需要的是具有该文件所在目录的写权限，而不是具有该文件的写权限，文件的写权限只能够修改文件内容**，HDFS文件权限的目的，防止好人做错事，而不是阻止坏人做坏事。HDFS相信你告诉我你是谁，你就是谁

**通过shell修改hdfs系统文件的权限和所有者：**

```
hdfs dfs -chown /文件
hdfs dfs -chmode /文件
```

#### hdfs的端口号

查看core-site.xml配置文件，可以看到hdfs文件系统的端口号是8020

```xml
<property>
    <name>fs.defaultFS</name>
    <value>hdfs://node01:8020</value>
</property>
```



## hdfs的优缺点 

##### hdfs的优点

**(1) 高容错性**

   1) 数据自动保存多个副本。它通过增加副本的形式，提高容错性。

   2) 某一个副本丢失以后，它可以自动恢复，这是由 HDFS 内部机制实现的，我们不必关心。

**(2) 适合批处理**

   1) 它是通过移动计算而不是移动数据。

   2) 它会把数据位置暴露给计算框架。

**(3) 适合大数据处理**

   1) 数据规模：能够处理数据规模达到 GB、TB、甚至PB级别的数据。

   2) 文件规模：能够处理百万规模以上的文件数量，数量相当之大。

   3) 节点规模：能够处理10K节点的规模。

**(4) 流式数据访问**

   1) 一次写入，多次读取，不能修改，只能追加。

   2) 它能保证数据的一致性。

**(5) 可构建在廉价机器上**

   1) 它通过多副本机制，提高可靠性。

   2) 它提供了容错和恢复机制。比如某一个副本丢失，可以通过其它副本来恢复。

##### hdfs的缺点

**(1) 不适合低延时数据访问；**

   1) 比如毫秒级的来存储数据，这是不行的，它做不到。

   2) 它适合高吞吐率的场景，就是在某一时间内写入大量的数据。但是它在低延时的情况下是不行的，比如毫秒级以内读取数据，这样它是很难做到的。

改进策略：使用Hbase

**(2) 无法高效的对大量小文件进行存储**

   1) 存储大量小文件的话，它会占用 NameNode大量的内存来存储文件、目录和块信息。这样是不可取的，因为NameNode的内存总是有限的。

   2) 小文件存储的寻道时间会超过读取时间，它违反了HDFS的设计目标。 改进策略

**(3) 不支持并发写入、不支持文件随机修改**

   1) 一个文件只能有一个写，不允许多个线程同时写。（支持并发读取）

   2) 仅支持数据 append（追加），不支持文件的随机修改。

## hdfs的shell命令操作

hdfs的shell命令操作的主要类型：

1、对hdfs的操作命令

2、获得一些配置相关的命令

3、管理员相关的命令

4、文件系统检查相关的命令

##### hdfs命令（对hdfs的基础操作）

HDFS命令有两种风格，hadoop fs开头的和hdfs dfs开头的，两种命令均可使用，效果相同。

**1.如何查看hdfs或hadoop子命令的帮助信息，如ls子命令**

```sh
hdfs dfs -help ls

hadoop fs -help ls #两个命令等价
```

**2.查看hdfs文件系统中指定目录的文件列表。对比linux命令ls**

```sh
hdfs dfs -ls /
hadoop fs -ls /
hdfs dfs -ls -R /
```

**3.在hdfs文件系统中创建文件**

```sh
hdfs dfs -touchz /edits.txt
```

**4.向HDFS文件中追加内容**

```sh
hadoop fs -appendToFile edit1.xml /edits.txt 
#将本地磁盘当前目录的edit1.xml内容追加到HDFS根目录 的edits.txt文件
```

**5.查看HDFS文件内容**

```sh
hdfs dfs -cat /edits.txt
```

**6.从本地路径上传文件至HDFS**

```sh
#用法：hdfs dfs -put /本地路径 /hdfs路径
hdfs dfs -put /linux本地磁盘文件 /hdfs路径文件

hdfs dfs -copyFromLocal /linux本地磁盘文件 /hdfs路径文件 
#跟put作用一样

hdfs dfs -moveFromLocal /linux本地磁盘文件 /hdfs路径文件 
#跟put作用一样，只不过，源文件被拷贝成功后，会被删除
```

**7. 在hdfs文件系统中下载文件**

```sh
hdfs dfs -get /hdfs路径 /本地路径

hdfs dfs -copyToLocal /hdfs路径 /本地路径 #根get作用一样
```

**8.** **在hdfs文件系统中创建目录**

```sh
hdfs dfs -mkdir /shell
```

**9.** **在hdfs文件系统中删除文件**

```sh
hdfs dfs -rm /edits.txt

hdfs dfs -rm -r /shell
```

**10.** **在hdfs文件系统中修改文件名称（也可以用来移动文件到目录）**

```sh
hdfs dfs -mv /xcall.sh /call.sh

hdfs dfs -mv /call.sh /shell
```

**11.** **在hdfs中拷贝文件到目录**

```sh
hdfs dfs -cp /xrsync.sh /shell
```

**12.** **递归删除目录**

```sh
hdfs dfs -rmr /shell
```

**13.** **列出本地文件的内容（默认是hdfs文件系统）**

```sh
hdfs dfs -ls file:///home/hadoop/
```

**14. 查找文件**

 linux find命令

```sh
find . -name 'edit*'
```

HDFS find命令

```sh
hadoop fs -find / -name part-r-00000 ## 在HDFS根目录中，查找part-r-00000文件
```

**15.总结**

- 输入hadoop fs 或hdfs dfs，回车，查看所有的HDFS命令
- 学会举一反三，许多命令与linux命令有很大的相似性
- 学会使用help,查看命令使用说明：hadoop fs -help ls
- 绝大多数的大数据框架的命令，也有类似的help信息

##### hdfs与getconf结合（获取配置信息）

**1.获取NameNode的节点名称（可能有多个）**

```sh
hdfs getconf -namenodes
```

**2. 获取hdfs配置信息**

```sh
hdfs getconf -confKey dfs.namenode.fs-limits.min-block-size

hdfs getconf -confKey dfs.blocksize
```

用相同命令可获取其他的属性值

**3. 查找hdfs的NameNode的RPC地址**

`RPC(RemoteProcedureCall,远程过程调用)`

```sh
hdfs getconf -nnRpcAddresses
```



##### hdfs与dfsadmin结合（管理员相关命令）

**1.** **同样要学会借助帮助信息**

```sh
hdfs dfsadmin -help safemode
```

**2. 查看hdfs dfsadmin的帮助信息**

```
hdfs dfsadmin
```

**3.** **查看当前的模式**

```sh
hdfs dfsadmin -safemode get
```

**4. 进入/退出安全模式**

```sh
hdfs dfsadmin -safemode enter ## 进入安全模式

hdfs dfsadmin -safemode leave #退出安全模式
```

##### hdfs与fsck结合（系统检查）

**fsck指令显示HDFS块信息**

```
 hdfs fsck /02-041-0029.mp4 -files -blocks -locations ## 查看文件02-041-0029.mp4的块信息
```

##### 其他命令

**1.** **检查压缩库本地安装情况**

```
hadoop checknative
```

**2.** **格式化名称节点（慎用，一般只在初次搭建集群，使用一次；格式化成功后，不要再使用）**

```sh
hadoop namenode -format
```

3. **执行自定义jar包**

```sh
hadoop jar /kkb/install/hadoop-2.6.0-cdh5.14.2/share/hadoop/

mapreduce/hadoop-mapreduce-examples-2.6.0-cdh5.14.2.jar pi 10 10
```

 

## hdfs的安全模式

安全模式是HDFS所处的一种特殊状态，在这种状态下，文件系统**只接受读数据请求，而不接受删除、修改等变更请求**。在NameNode主节点启动时，HDFS首先进入安全模式，DataNode在启动的时候会向namenode汇报可用的block等状态（通过心跳heartbeat向namenode汇报，如果**99%的block的块的副本数>=1**，就可以退出安全模式），当整个系统达到安全标准时，HDFS自动离开安全模式。

**如果HDFS处于安全模式下，则文件block不能进行任何的副本复制操作**，因此达到最小的副本数量要求是基于datanode启动时的状态来判定的，启动时不会再做任何复制（从而达到最小副本数量要求），hdfs集群刚启动的时候，**默认30s**的时间是出于安全期的，只有过了30s之后，集群脱离了安全期，然后才可以对集群进行操作

**通过shell命令进入和退出安全模式：**

```sh
[hadoop@node01 hadoop]$ hdfs dfsadmin -safemode

Usage: hdfs dfsadmin [-safemode enter | leave | get | wait]
```

 

## hdfs的JavaAPI开发

#### windows安装hadoop

- 解压CDH版本的在windows系统上运行的Hadoop安装包，解压路径**不能有中文或者空格**

<img src="hadoop.assets/image-20200209143225472.png" alt="image-20200209143225472" style="zoom: 80%;" />

- 在windows当中配置hadoop环境变量
- 将hadoop.dll文件拷贝到C:\Windows\System32

#### 创建Maven工程并导入jar包

由于cdh版本的所有的软件涉及版权的问题，所以并**没有将所有的jar包托管到maven仓库当中去**，而是托管在了CDH自己的服务器上面，所以我们默认去maven的仓库下载不到，需要自己手动的添加repository去CDH仓库进行下载，以下两个地址是官方文档说明，请仔细查阅

- https://www.cloudera.com/documentation/enterprise/release-notes/topics/cdh_vd_cdh5_maven_repo.html

- https://www.cloudera.com/documentation/enterprise/release-notes/topics/cdh_vd_cdh5_maven_repo_514x.html

下面以IDEA为例：

1. 创建Maven工程
2. 在IDEA将本地仓库设置为我们存放repository这个文件的路径
3. 将Maven工程的pom.xml文件，添加内容，如下：

```xml
<repositories>
    <repository>
        <id>cloudera</id>
        <url>https://repository.cloudera.com/artifactory/cloudera-repos/</url>
    </repository>
</repositories>
<dependencies>
    <dependency>
        <groupId>org.apache.hadoop</groupId>
        <artifactId>hadoop-client</artifactId>
        <version>2.6.0-mr1-cdh5.14.2</version>
    </dependency>
    <dependency>
        <groupId>org.apache.hadoop</groupId>
        <artifactId>hadoop-common</artifactId>
        <version>2.6.0-cdh5.14.2</version>
    </dependency>
    <dependency>
        <groupId>org.apache.hadoop</groupId>
        <artifactId>hadoop-hdfs</artifactId>
        <version>2.6.0-cdh5.14.2</version>
    </dependency>

    <dependency>
        <groupId>org.apache.hadoop</groupId>
        <artifactId>hadoop-mapreduce-client-core</artifactId>
        <version>2.6.0-cdh5.14.2</version>
    </dependency>
    <!-- https://mvnrepository.com/artifact/junit/junit -->
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.11</version>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.testng</groupId>
        <artifactId>testng</artifactId>
        <version>RELEASE</version>
    </dependency>
</dependencies>
<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.0</version>
            <configuration>
                <source>1.8</source>
                <target>1.8</target>
                <encoding>UTF-8</encoding>
                <!--   <verbal>true</verbal>-->
            </configuration>
        </plugin>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-shade-plugin</artifactId>
            <version>2.4.3</version>
            <executions>
                <execution>
                    <phase>package</phase>
                    <goals>
                        <goal>shade</goal>
                    </goals>
                    <configuration>
                        <minimizeJar>true</minimizeJar>
                    </configuration>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

#### API操作

首先要开启虚拟机，保证hdfs集群的正常开启状态

###### 案例1：在hdfs集群文件系统创建目录

```Java
//src/main/java/T1.java
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;

import java.io.IOException;

public class T1{
    public static void main(String[] args) {
        HdfsApi a=new HdfsApi();
        try {
            a.mkdirToHdfs();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
class HdfsApi{
    public void mkdirToHdfs() throws IOException{
        //创建配置对象
        Configuration conf=new Configuration();
        //设置配置对象
        conf.set("fs.defaultFS","hdfs://node01:8020");//第一个参数是名字，第二个参数是值
        //通过conf新建hdfs文件系统对象
        FileSystem fs=FileSystem.get(conf);
        //新建目录
        fs.mkdirs(new Path("/kobe"));//传入的是一个Path对象
        //关闭
        fs.close();
    }
}
/*
解释： "fs.defaultFS","hdfs://node01:8020"
fs.defaultFS的意思可以通过查看Hadoop官网查看core-default.xml帮助文档了解：https://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-common/core-default.xml
从文档信息可以了解到fs.default的意思是:The name of the default file system.(默认文件系统名称)
*/
```

**补充**：新建hdfs文件系统对象不一定通过上面那种方法，还可以通过下列这种方式:

```java
Configuration conf = new Configuration();
FileSystem fs = FileSystem.get(new URI("hdfs://node01:8020"), conf);
//传入URI对象
```



###### 案例2：windows本地文件-->hdfs文件系统

```Java
//src/main/java/T1.java
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;

import java.io.IOException;

public class T1{
    public static void main(String[] args) {
        HdfsApi b=new HdfsApi();
        try {
            b.localToHdfs();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
class HdfsApi{
    public void localToHdfs() throws IOException{
        Configuration conf=new Configuration();
        conf.set("fs.defaultFS","hdfs://node01:8020"); 
        FileSystem fs=FileSystem.get(conf);
        fs.copyFromLocalFile(new Path("file:///F://test//aa.txt"),new Path("hdfs://node01:8020//kobe"));
        fs.close();
    }
}
```

###### 案例2：从hdfs下载到windows本地

```java
//src/main/java/T1.java
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;

import java.io.IOException;

public class T1{
    public static void main(String[] args) {
        HdfsApi c=new HdfsApi();
        try {
            c.downFromHdfs();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
class HdfsApi{
    public void downFromHdfs() throws IOException{
        Configuration conf=new Configuration();
        conf.set("fs.defaultFS","hdfs://node01:8020");
        FileSystem fs=FileSystem.get(conf);
        fs.copyToLocalFile(new Path("hdfs://node01:8020//kobe//aa.txt"),new Path("file:///F://test"));
        //需要保证windows本地目录的存在file:///F://test
        fs.close();
    }
}
```

###### 案例4：删除hdfs的文件或目录

```Java
//src/main/java/T1.java
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;

import java.io.IOException;

public class T1{
    public static void main(String[] args) {
        HdfsApi c=new HdfsApi();
        try {
            c.deleteFile();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
class HdfsApi{
    public void deleteFile() throws IOException{
        Configuration conf=new Configuration();
        conf.set("fs.defaultFS","hdfs://node01:8020");
        FileSystem fs=FileSystem.get(conf);
        fs.delete(new Path("hdfs://node01:8020//first"),true);
        //第二个参数为true的意思是支持递归多层级删除
        fs.close();
    }
}
```

###### 案例5：重命名hdfs的文件或目录

```Java
//src/main/java/T1.java
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;

import java.io.IOException;

public class T1{
    public static void main(String[] args) {
        HdfsApi d=new HdfsApi();
        try {
            d.renameFile();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
class HdfsApi{
    public void renameFile() throws IOException{
        Configuration conf=new Configuration();
        conf.set("fs.defaultFS","hdfs://node01:8020");
        FileSystem fs=FileSystem.get(conf);
        fs.rename(new Path("hdfs://node01:8020//IDEA.txt"),new Path("hdfs://node01:8020//James.txt"));
        fs.close();
    }
}
```

###### 案例6：查看hdfs某目录下所有文件的相关信息

```Java
//src/main/java/T1.java
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.*;

import java.io.IOException;

public class T1{
    public static void main(String[] args) {
        HdfsApi f=new HdfsApi();
        try {
            f.ListFileInfo();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
class HdfsApi{
    public void ListFileInfo() throws IOException {
        Configuration conf=new Configuration();
        conf.set("fs.defaultFS","hdfs://node01:8020");
        FileSystem fs=FileSystem.get(conf);
        RemoteIterator<LocatedFileStatus> lf=fs.listFiles(new Path("hdfs://node01:8020//"),true);
        //第二个参数为true表明支持递归多层级
        while(lf.hasNext()){
            LocatedFileStatus status=lf.next();
            System.out.println(status.getPath().getName()); //打印文件名称
            System.out.println(status.getPath()); //打印文件路径
            System.out.println(status.getLen()); //打印文件长度
            System.out.println(status.getPermission()); //打印文件权限
            System.out.println(status.getGroup()); //打印分组情况
            BlockLocation [] bks=status.getBlockLocations(); //获取块信息
            for (BlockLocation a:bks){
                System.out.print("块信息: "+a+" : "+"块所在主机节点："); //打印块信息，不换行
                String []hosts=a.getHosts(); //获取块存在的主机节点
                for (String b:hosts){
                    System.out.println(b+" ");  //打印块存在的主机节点
                }
            }

            System.out.println("-------------------------------");
        }
    }
}
/*运行结果格式大致如下：
edits.txt
hdfs://node01:8020/edits.txt
19
rw-r--r--
supergroup
块信息: 0,19,node03 : 块所在主机节点：node03 
-------------------------------
hJ.txt
hdfs://node01:8020/hJ.txt
19
rw-r--r--
supergroup
块信息: 0,19,node03 : 块所在主机节点：node03 
*/
```

###### 案例7：通过IO流上传本地文件到hdfs

```java
//src/main/java/T1.java
import org.apache.commons.io.IOUtils;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.*;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

public class T1{
    public static void main(String[] args) {
        HdfsApi g=new HdfsApi();
        File inputPath=new File("F://test//em.txt"); //这里注意：一定不要加file:///
        Path outputPath=new Path("hdfs://node01:8020//em3.txt");
        try {
            g.ioLocalToHdfs1(inputPath,outputPath);
            g.ioLocalToHdfs2(inputPath,outputPath);
            //上面两个方法的效果一样
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
class HdfsApi{
    //方法1：使用IOUtils工具类
    public void ioLocalToHdfs1(File inputPath, Path outputPath) throws IOException {
        Configuration conf=new Configuration();
        conf.set("fs.defaultFS","hdfs://node01:8020");
        FileSystem fs=FileSystem.get(conf);
        //创建输入流
        FileInputStream fis=new FileInputStream(inputPath);
        //利用hdfs文件系统对象创建输出流
        FSDataOutputStream fos=fs.create(outputPath);
        //流对拷：
        IOUtils.copy(fis,fos);
        //关闭资源：
        IOUtils.closeQuietly(fos);
        IOUtils.closeQuietly(fis);
        fs.close();
    }
    //方法2：不使用IOUtils工具类
    public void ioLocalToHdfs2(File inputPath, Path outputPath) throws IOException {
        Configuration conf=new Configuration();
        conf.set("fs.defaultFS","hdfs://node01:8020");
        FileSystem fs=FileSystem.get(conf);
        FileInputStream fis=new FileInputStream(inputPath);
        FSDataOutputStream fos=fs.create(outputPath); //使用create方法
        byte[] bArr=new byte[100];
        int len;
        while ((len=fis.read(bArr))!=-1){
            fos.write(bArr,0,len);
        }
        fos.close();
        fis.close();
        fs.close();
    }
}
```

案例8：通过`IO`流从`hdfs`下载文件到本地

```Java
//src/main/java/T1.java
import org.apache.commons.io.IOUtils;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.*;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

public class T1{
    public static void main(String[] args) {
        HdfsApi g=new HdfsApi();
        Path inputPath=new Path("hdfs://node01:8020//em3.txt"); 
        File outputPath=new File("F://test//em4.txt");
        try {
            g.ioHdfsToLocal(inputPath,outputPath);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
class HdfsApi{
    public void ioHdfsToLocal(Path inputPath, File outputPath) throws IOException {
        Configuration conf=new Configuration();
        conf.set("fs.defaultFS","hdfs://node01:8020");
        FileSystem fs=FileSystem.get(conf);
        //创建输入输出流
        FSDataInputStream fis=fs.open(inputPath); //使用open方法
        FileOutputStream fos=new FileOutputStream(outputPath);
        IOUtils.copy(fis,fos);
        IOUtils.closeQuietly(fos);
        IOUtils.closeQuietly(fis);
        fs.close();
    }
}
```

###### 案例8：`IO`流实现小文件合并

意思是：将本地文件系统某一个目录下的所有小文件合并并上传到`hdfs`系统，要合并的目录下的小文件不能是目录，下面案例是把本地某目录下的所有`.txt`文件合并，**合并效果是把小文件的内容合并**。

```Java
//src/main/java/T1.java
import org.apache.commons.io.IOUtils;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.*;
import java.io.IOException;

public class T1{
    public static void main(String[] args) {
        HdfsApi g=new HdfsApi();
        Path inputPath=new Path("hdfs://node01:8020//test2.rar");
        Path outputPath=new Path("F://test//");
        try {
            g.mergeFile(inputPath,outputPath);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
class HdfsApi{
    public void mergeFile(Path outputPath,Path a) throws IOException {
        //创建hdfs文件系统对象
        Configuration conf=new Configuration();
        conf.set("fs.defaultFS","hdfs://node01:8020");
        FileSystem fs=FileSystem.get(conf);
        //创建输出流：
        FSDataOutputStream fos=fs.create(outputPath);
        //创建本地文件系统对象
        LocalFileSystem lfs=FileSystem.getLocal(new Configuration());
        //读取本地文件
        FileStatus [] fstatus=lfs.listStatus(a);
        //循环读取到的所有本地文件，并循环创建输入流，再进行流对拷
        for(FileStatus i:fstatus){
            Path localPath=i.getPath();
            //创建输入流，通过本地文件系统对象lfs的open方法创建
            FSDataInputStream fis=lfs.open(localPath);

            //流对拷：
            IOUtils.copy(fis,fos);

            //关闭输入流资源：
            IOUtils.closeQuietly(fis);
        }
        //关闭资源：
        IOUtils.closeQuietly(fos);
        lfs.close();
        fs.close();
    }
}
```

## :rainbow:hdfs写入流程（面试重点）

#### 一个文件上传到hdfs文件系统的简略过程

![image-20200210025442931](hadoop.assets/image-20200210025442931.png)

1）客户端通过Distributed FileSystem模块向NameNode请求上传文件，NameNode检查目标文件是否已存在，父目录是否存在。

2）NameNode返回是否可以上传。

3）客户端请求第一个 Block上传到哪几个DataNode服务器上。

4）NameNode返回3个DataNode节点，分别为dn1、dn2、dn3。

5）客户端通过FSDataOutputStream模块请求dn1上传数据，dn1收到请求会继续调用dn2，然后dn2调用dn3，将这个通信管道建立完成。

6）dn1、dn2、dn3逐级应答客户端。

7）客户端开始往dn1上传第一个Block（先从磁盘读取数据放到一个本地内存缓存），**以Packet为单位**，dn1收到一个Packet就会传给dn2，dn2传给dn3；dn1每传一个packet会放入一个应答队列等待应答。

8）当一个Block传输完成之后，客户端再次请求NameNode上传第二个Block到服务器。（重复执行3-7步）。

#### 一个文件上传到hdfs文件系统的详细过程

![image-20200210025743058](hadoop.assets/image-20200210025743058.png)

1. hdfs client客户端调用DistributedFileSystem.create()方法，这个方法会通过RPC（远程过程调用）的方式调用namenode的create()方法
2. namenode在hdfs文件系统创建一个空文件，并将这一个操作记录在edits.log文件中（因为创建空文件产生了新的元数据）。
3. 如果namenode.create()方法没有抛出异常，就会返回给客户端一个FSDataInputStream输出流对象，FSDataInputStream类是对DFSOutputStream类的一个包装。
4. 有了DFSOutputStream输出流对象后，客户端就调用方法DFSOutputStream.write()方法，这个方法会通过RPC的方式调用namenode的addBlock()方法，向namenode申请上传一个数据块。
5. 调用addBlock()方法无异常后，namenode就会返回给客户端一个LocatedBlock对象，这个对象包含的主要信息是：这个block要存储在哪三个datanode节点上。
   （每次启动hdfs集群，每个datanode就会通过心跳方式向namenode汇报节点磁盘使用率，然后namenode就可以通过使用情况来决定block存在哪里）
6. 客户端根据namenode返回的块将要存放的位置信息，建立数据流管道pipeline。
7. 输出流DFSOutputSream开始读取block的数据，然后把数据写到一个叫做chunk的文件，当chunk文件写满512字节后，就会调用关于crc32的校验方法来进行数据校验，生成一个4字节的checksum校验文件。（这就是为什么JavaApi操作hdfs文件系统会生成一个.crc文件）（为什么做校验？）
8. 校验后，客户端就将chunk+chumksum两个文件共516字节存放到一个有64KB容量的package里。package包括三部分（header、checksums、DATA），checksums专门用来存放校验文件，DATA专门用来存放数据。
9. 当package存满64KB时，就会将package传到一个data queue数据队列（可以看成一个个package的队列）里，
10. 然后将数据队列里的每个package按顺序沿着建立的数据流管道传到第1个datanode节点，再从第1个节点传到第2个节点，再从第2个节点传到第3个节点。
11. 每个datanode节点接受到package之后，就会对package进行数据校验，根据数据产生新的校验值，判断新的校验值和传过来的校验值是否匹配。校验正确的结果ACK是反着pipeline方向 返回来的，datanode3--->datanode2-->datanode1。如果校验通过的话，传输就成功了。（每个datanode传输情况都正常，ACK才能返回给客户端）
12. **当前正在发送**的package不只是沿着数据流管道传到datanode节点，还会被存放到一个ack queue队列里。如果package传输成功的话，就会删除ack queue队列里的该package。如果不成功的话就将ack queue里的package取出来放到data queue的末尾，等待重新传输到datanode。
13. 如果这个文件还有其它的块block，则重新执行上面的4-11步骤，直到文件传输完成。
14. 文件传输完成后，datanode就会通过RPC远程调用namenode的blockReceivedAndDelete()，然后namenode就会更新内存中block和datanode的映射关系，更新文件和block的映射关系。
15. 最后关闭pipeline数据流管道，关闭数据流DFSOutputStream.close()，客户端远程调用namenode的complete()方法，告知上传完成。

> **补充：**
>
> - 为什么做校验？因为是网络传输，可能数据传输会出现异常什么的，需要保证数据的完整和正确性。
>
>   循环冗余校验（Cyclic Redundancy Check， CRC）是一种根据网络数据包或计算机文件等数据**产生简短固定位数校验码**的一种信道编码基技术，主要用来检测或校验数据传输或者保存后可能出现的错误。
>
>   CRC32:  CRC本身是“冗余校验码”的意思，CRC32则表示会产生一个32bit（4字节）的校验值。由于CRC32产生校验值时源数据块的每一个bit（位）都参与了计算，所以**数据块中即使只有1bit的数据发生了变化，也会得到不同的CRC32值.**
>
> - 什么是ACK？
>
>   ACK (Acknowledge character）即是确认字符，在数据通信中，接收站发给发送站的一种传输类控制字符。表示发来的数据已确认接收无误。
>
> - block沿着数据流管道传输的好处在哪？为什么不将块的数据分3个方向分别同时传输到不同的datanode节点？
>
>   因为沿着数据流管道传输可以将传数据的压力分配到不同的datanode节点，减少客户端负荷，效率更高。
>
> - 校验失败后，package重写放到data queue的末尾，并不会打乱文件的写入，**每个package都有一个seqno序号**，对号入座即可。

#### 容错机制（重新传输机制）

![image-20200210043617401](hadoop.assets/image-20200210043617401.png)

在上面的详细过程中，我们说，如果数据传输出错的话要重新传输，那重新传输的机制是怎样的？比如说，一个package通过一个数据流管道：datanode1--->datanode2--->datanode3来进行传输，如果datanode1和datanode3数据都没问题，就只有datanode2的数据传输有问题（如dn2挂了或者通信不畅了等问题），要怎么解决？

1. 因为datanode2的package有问题，导致校验结果失败，客户端会将ack queue队列中的所有package放回到data queue末尾，准备重新传输该package
2. 放回到data queue末尾后，客户端会RPC远程调用namenode的updataBlockForPipeline()方法，从而为当前block生成新的版本（实际上就是生成新的时间戳）。会从pipeline管道中删除datanode2。
3. 客户端再RPC调用namenode的getAdditionalDatanode()方法，namenode返回给客户端一个新的datanode，比如说datanode4。
4. 输出流将datanode1、datanode3、datanode4形成新的pipeline管道，并更新datanode1和datanode2中的block版本，把DN1或者DN3中更新后的block复制到DN4中，管道就重新建立好了。
5. DFSOutputStream远程调用namenode的updatePipeline()方法更新元数据。
6. 开始沿着新管道重新传输未完成的package。

datanode2的故障排除并重启后，会通过心跳与namenode进行通信，namenode发现datanode2上有些block的间戳是老的，datanode2就会将对应的这些block删除。

## :rainbow:hdfs读取流程（面试重点）

#### 大致过程

<img src="hadoop.assets/image-20200210043130930.png" alt="image-20200210043130930" style="zoom:130%;" />

1）客户端通过Distributed FileSystem向NameNode请求下载文件，NameNode通过查询元数据，找到文件块所在的DataNode地址。

2）挑选一台DataNode（**就近原则**，然后随机）服务器，请求读取数据。

3）DataNode开始传输数据给客户端（从磁盘里面读取数据输入流，以Packet为单位来做校验）。

4）客户端以Packet为单位接收，先在本地缓存，然后写入目标文件。

注意：读取一个文件不能并发读写（不能一次性读多个该文件的block），但是可以一次性读多个文件。

> 补充：如何判断客户端距离文件的某个block存放的datanode最近是谁？
>
> <img src="hadoop.assets/image-20200210050244654.png" alt="image-20200210050244654" style="zoom:80%;" />
>
> 从上图可以看到，文件的某个块的三个副本存放在了两个不同的机架上，其中有一个block的datanode节点服务器和客户端所在服务器是在同一台机架上的，很明显block1离客户端最近，因为如果读取block2和block3需要经过层层交换机。

#### 容错机制

- 情况1，假如客户端从datanode1下载文件过程中，dn1挂掉了，客户端就会告知namenode：dn1挂掉了，然后客户端尝试从文件的block存放的另一个datanode节点下载数据。
- 情况2，假如客户端从datanode1下载文件过程中，dn1出现了**位衰减**的问题，客户端收到package后也是需要进行校验，若校验不通过，也会告知namenode：dn1有问题了，然后客户端尝试从文件的block存放的另一个datanode节点下载数据。
- 情况3，package校验不通过不一定是位衰减等问题，有可能是网络传输的问题。因此，package校验不通过不会直接换节点传输，而是**首先进行重试（重新传输）**，如果校验结果再次不通过，客户端才会告诉namenode，节点出问题了。

## :rainbow:NameNode和SecondaryNameNode的工作机制

#### 如何快速检索元数据？

NameNode主要负责集群当中的元数据信息管理，而且元数据信息需要经常随机访问，因为元数据信息必须高效的检索，那么如何保证namenode快速检索呢？？元数据信息保存在哪里能够快速检索呢？？如何保证元数据的持久安全呢？？

为了保证元数据信息的快速检索，那么我们就必须将**元数据存放在内存当**中，因为在内存当中元数据信息能够最快速的检索，那么随着元数据信息的增多（每个block块大概占用150字节的元数据信息），内存的消耗也会越来越多。

#### 如何保证元数据持久性？

如果所有的元数据信息都存放内存，服务器断电，内存当中所有数据都消失，为了保证元数据的安全持久，Hadoop集群一开始格式化后就生成了一个edits.log文件和FSImage文件。**FSImage是namenode内存中的元数据的镜像文件（备份文件），edits.log文件是记录用户操作信息的日志文件**，edits.log文件和FSImage文件都是存放在磁盘里的。

<img src="hadoop.assets/image-20200210173211095.png" alt="image-20200210173211095" style="zoom: 67%;" />

客户端访问hdfs时，操作信息会存到edits.log一份，同时操作产生的元数据也会更新到namenode内存中，fsimage会不定期读取内存中的元数据来更新自己（fsimage每次更新都会生成新的edites.log文件，以后的操作信息将存放到新的edites.log文件）。

若namenode挂掉了，内存中的元数据就会丢失，客户端不能够访问hdfs了。namenode重启时就会从FSImage文件中读取元数据，并回放edits.log日志文件中的用户操作，从而恢复namenode内存中的元数据。用户就可以再次访问hdfs（**实际上这段恢复元数据的时间是不可取的，这段时间客户不能访问hdfs**）

FSImage随着时间推移，会不断更新文件里的元数据，必然越来越膨胀，FSImage的操作变得越来越难，edits信息也会越来越大，为了解决edits文件膨胀的问题，hadoop当中引入了secondaryNamenode来专门做fsimage与edits文件的合并

#### SecondaryNameNode出场了（重点）

##### NN与SNN合作的简略过程

![image-20200210202003874](hadoop.assets/image-20200210202003874.png)

**1、namenode工作机制**

1. 第一次启动namenode格式化后，创建fsimage和edits文件。如果不是第一次启动，直接加载编辑日志和镜像文件到内存。
2. 客户端对元数据进行增删改的请求
3. namenode记录操作日志，更新滚动日志。
4. namenode在内存中对数据进行增删改查

**2、Secondary NameNode工作**

1. Secondary NameNode询问namenode是否需要checkpoint。直接带回namenode是否检查结果。
2. Secondary NameNode请求执行checkpoint。
3. namenode滚动正在写的edits日志
4. 将滚动前的编辑日志和镜像文件拷贝到Secondary NameNode
5. Secondary NameNode加载编辑日志和镜像文件到内存，并合并。
6. 生成新的镜像文件fsimage.chkpoint
7. 拷贝fsimage.chkpoint到namenode
8. namenode将fsimage.chkpoint重新命名成fsimage

##### NN与SNN合作的详细过程

![image-20200210191507559](hadoop.assets/image-20200210191507559.png)

1. 客户端对hdfs进行的增删改等操作都对应一个事务，每个事务对应一个id,id是递增的。client操作hdfs时，操作完成会把元数据写入namenode的内存中，也会把**新增的操作**写入磁盘的edits_inprogress_1日志文件中，_1代表所有新增的操作对应的第一个事务的id号。
2. 当checkpoint的时候，namenode会将edits_inprogress_1打包成edits_1-14文件，1-14代表这个文件包含id号为1到14的所有事务。同时还会将根据edits_inprogress_1日志生成新的空的edits_inprogress_15日志文件。15代表新的操作的事务id号将从15开始递增。
3. edits_inprogress_15将会充当起edits_inprogress_1的角色，即新增的操作会写入15这个日志文件中。
4. SecondaryNameNode会将fsimage_0和edits_1-14拉过去（通过http get方式），对edits_1-14中的操作进行回放，把fsimage_0和edits_1-14合并成新的fsimage_14.ckpt文件。
5. 合并完成后，SecondaryNameNode会将fsimage_14.ckpt传回给NameNode，然后再把fsimage_14.ckpt重命名为fsimage_14。fsimage_14不会替换fsimage_0文件，但是会替换它的角色。
6. 再次checkpoint的时候，又会重复上述步骤。

> **补充：**
>
> - 怎么判断要不要checkpoint？**checkpoint的条件是什么**？
>
>   SecondaryNameNode大约每隔一分钟就会查看是否要进行checkpoint，checkpoint的条件是**是否距离上次合并过了1小时或者事务条数是否达到100万条**。
>
>   可以在集群中设置下列三个参数的值来修改checkpoint时机：
>
>   - dfs.namenode.checkpoint.period  3600  ---》距离上次合并过了1小时会进行checkpoint
>   - dfs.namenode.checkpoint.txns 1000000  ----》hdfs操作达到100万次会进行合并
>   - dfs.namenode.checkpoint.check.period  60  --》每隔一分钟检查hdfs的edits的事务数
>
> - 加入SecondaryNameNode有什么作用？
>
>   - 这样可以保证edits日志文件的记录数始终很少，不会膨胀。
>   - 大大提高了NameNode的恢复速度
>
> - 加入SecondaryNameNode后，还有什么问题没有解决？
>
>   加入SNN后，并不能解决NameNode一挂掉就停止对外服务的问题，要解决这个问题可以使用ha高可用方案和Zookeeper
>
> - 对hdfs的操作都放在edits中，为什么不放在fsimage中呢？
>
>   因为fsimage是namenode的完整的镜像，内容很大，如果每次都加载到内存的话生成树状拓扑结构，这是非常耗内存和CPU。
>
>   fsimage内容包含了namenode管理下的所有datanode中文件及文件block及block所在的datanode的元数据信息。随着edits内容增大，就需要在一定时间点和fsimage合并。



#### FSImage与edits详解

所有的元数据信息都保存在了FsImage与Eidts文件当中，这两个文件就记录了所有的数据的元数据信息，元数据信息的保存目录配置在了hdfs-site.xml当中

```xml
<property>
  <name>dfs.namenode.name.dir</name>
  <value>file:///kkb/install/hadoop-2.6.0-cdh5.14.2/hadoopDatas/namenodeDatas</value>
</property>
<property>
   <name>dfs.namenode.edits.dir</name>
   <value>file:///kkb/install/hadoop-2.6.0-cdh5.14.2/hadoopDatas/dfs/nn/edits</value>
</property>
```

**查看FSimage文件当中的文件信息**

- 官方查看文档：[http://archive.cloudera.com/cdh5/cdh/5/hadoop-2.6.0-cdh5.14.2/hadoop-project-dist/hadoop-hdfs/HdfsImageViewer.html](http://archive.cloudera.com/cdh5/cdh/5/hadoop-2.6.0-cdh5.14.0/hadoop-project-dist/hadoop-hdfs/HdfsImageViewer.html)

- 使用命令 `hdfs oiv` 

```sh
cd /kkb/install/hadoop-2.6.0-cdh5.14.2/hadoopDatas/namenodeDatas/current

hdfs oiv -i fsimage_0000000000000000864  -o hello.xml -p XML
	-i fsimage_0000000000000000864 #代表inputFile输入文件
	-o hello.xml  #代表outputFile，根据fsimage文件生成hello.xml
	-p XML  #代表文件的打开格式为xml格式
```

**查看edits当中的文件信息**

- 官方查看文档：[http://archive.cloudera.com/cdh5/cdh/5/hadoop-2.6.0-cdh5.14.2/hadoop-project-dist/hadoop-hdfs/HdfsEditsViewer.html](http://archive.cloudera.com/cdh5/cdh/5/hadoop-2.6.0-cdh5.14.0/hadoop-project-dist/hadoop-hdfs/HdfsEditsViewer.html)

- 查看命令 `hdfs oev`

```sh
cd /kkb/install/hadoop-2.6.0-cdh5.14.2/hadoopDatas/dfs/nn/edits/current
hdfs oev -i edits_0000000000000000865-0000000000000000866  -o myedit.xml -p XML
vi myedit.xml
```



#### NameNode元数据信息多目录配置

为了保证元数据的安全性，我们一般都是先确定好我们的磁盘挂载目录，将元数据的磁盘做`RAID1`(备份磁盘的中的元数据文件所在的目录，即`namenode`本地目录)

> `RAID1`的意思是通过磁盘数据镜像实现数据冗余，**在成对的独立磁盘上产生互为备份的数据**。当原始数据繁忙时，可直接从镜像拷贝中读取数据，因此RAID 1可以提高读取性能。
>
> `RAID1`是硬盘中单位成本最高的，但提供了很高的数据安全性和可用性，当一个硬盘失效时，系统可以自动切换到镜像硬盘上读/写，并且不需要重组失效的数据。

`namenode`的本地目录可以配置成多个，且每个目录存放内容相同，增加了可靠性。可通过  `hdfs-site.xml`配置文件设置：

```xml
<property>
   <name>dfs.namenode.name.dir</name>
   <value>file:///kkb/install/.../hadoopDatas/namenodeDatas,file:///....</value>
</property>
<!--用逗号隔开多个目录-->
```



#### NameNode故障恢复(了解就行)

在我们的secondaryNamenode对namenode当中的fsimage和edits进行合并的时候，每次都会先将namenode的fsimage与edits文件拷贝一份过来，所以fsimage与edits文件在secondarNamendoe当中也会保存有一份，如果namenode的fsimage与edits文件损坏，那么我们可以将secondaryNamenode当中的fsimage与edits拷贝过去给namenode继续使用，只不过有可能会丢失一部分数据。这里涉及到几个配置选项

- namenode保存fsimage的配置路径

```xml
<property>
   <name>dfs.namenode.name.dir</name>
   <value>file:///kkb/install/hadoop-2.6.0-cdh5.14.2/hadoopDatas/namenodeDatas</value>
</property>
```

- namenode保存edits文件的配置路径

```xml
<property>
  <name>dfs.namenode.edits.dir</name>
  <value>file:///kkb/install/hadoop-2.6.0-cdh5.14.2/hadoopDatas/dfs/nn/edits</value>
</property>
```

- secondaryNamenode保存fsimage文件的配置路径

```xml
<property>
   <name>dfs.namenode.checkpoint.dir</name>
   <value>file:///kkb/install/hadoop-2.6.0-cdh5.14.2/hadoopDatas/dfs/snn/name</value>
</property>
```

- secondaryNamenode保存edits文件的配置路径

```xml
<property>
    <name>dfs.namenode.checkpoint.edits.dir</name>
    <value>file:///kkb/install/hadoop-2.6.0-cdh5.14.2/hadoopDatas/dfs/nn/snn/edits</value>
</property> 
```

如果namenode当中的fsimage文件损坏或者丢失，我们可以从secondaryNamenode当中拷贝过去放到对应的路径下即可。**具体的步骤如下**：

##### 第一步：杀死namenode进程

使用jps查看namenode进程号，然后**直接使用kill -9 进程号杀死namenode进程**

```
[hadoop@node01 servers]## jps
127156 QuorumPeerMain
127785 ResourceManager
17688 NameNode
127544 SecondaryNameNode
127418 DataNode
128365 JobHistoryServer
19036 Jps
127886 NodeManager
[hadoop@node01 servers]## kill -9 17688
```

##### 第二步：删除namenode的fsimage与edits文件

`namenode`所在机器执行以下命令，删除`fsimage`与edits文件

删除`fsimage`与`edits`文件

```
rm -rf /kkb/install/hadoop-2.6.0-cdh5.14.2/hadoopDatas/namenodeDatas/*
rm -rf /kkb/install/hadoop-2.6.0-cdh5.14.2/hadoopDatas/dfs/nn/edits/*
```

##### 第三步：拷贝fsimage与edits文件

将`secondaryNameNode`所在机器的`fsimage`与`edits`文件拷贝到`namenode`所在的`fsimage`与`edits`文件夹下面去，由于我的`secondaryNameNode`与`namenode`安装在同一台机器，都在`node01`上面，`node01`执行以下命令进行拷贝

```
cp -r /kkb/install/hadoop-2.6.0-cdh5.14.2/hadoopDatas/dfs/snn/name/* /kkb/install/hadoop-2.6.0-cdh5.14.2/hadoopDatas/namenodeDatas/

cp -r /kkb/install/hadoop-2.6.0-cdh5.14.2/hadoopDatas/dfs/nn/snn/edits/* /kkb/install/hadoop-2.6.0-cdh5.14.2/hadoopDatas/dfs/nn/edits
```

##### 第四步：启动namenode

`node01`服务器执行以下命令启动`namenode`

```
cd hadoop-2.6.0-cdh5.14.2/
sbin/hadoop-daemon.sh start namenode
```

##### 第五步：浏览器页面正常访问

使用50070端口查看是否正常，http://node01:50070/explorer.html#/

## datanode详解

#### datanode工作机制

1）一个数据块在datanode上以文件形式存储在磁盘上，包括两个文件，一个是数据本身，一个是元数据。元数据包括数据块的长度，块数据的校验和，以及时间戳。

2）DataNode启动后向namenode注册，通过后，周期性（1小时）的向namenode上报所有的块信息。

3）心跳是每3秒一次，心跳返回结果带有namenode给该datanode的命令如复制块数据到另一台机器，或删除某个数据块。如果超过10分钟没有收到某个datanode的心跳，则认为该节点不可用。

4）集群运行中可以安全加入和退出一些机器

#### 数据完整性(校验)

1）当DataNode读取block的时候，它会计算checksum

2）如果计算后的checksum，与block创建时值不一样，说明block已经损坏。

3）client读取其他DataNode上的block.

4）datanode在其文件创建后周期验证checksum

#### datanode掉线时限参数设置

datanode进程死亡或者网络故障造成datanode无法与namenode通信，namenode不会立即把该节点判定为死亡，要经过一段时间，这段时间暂称作超时时长。**HDFS默认的超时时长为10分钟+30秒**。如果定义超时时间为timeout，则超时时长的计算公式为：

```sh
timeout = 2 * dfs.namenode.heartbeat.recheck-interval + 10 * dfs.heartbeat.interval
```

而默认的dfs.namenode.heartbeat.recheck-interval 大小为5分钟，dfs.heartbeat.interval默认为3秒。如果想要修改这两个参数的默认大小，可通过  hdfs-site.xml 配置文件来修改。

heartbeat.recheck.interval的单位为毫秒，dfs.heartbeat.interval的单位为秒。

```xml
<property>
    <name>dfs.namenode.heartbeat.recheck-interval</name>
    <value>300000</value>
</property>
<property>
    <name> dfs.heartbeat.interval </name>
    <value>3</value>
</property>
```

#### DataNode的目录结构

和namenode不同的是，datanode的存储目录（在服务器本地文件系统的位置）是初始阶段自动创建的，不需要额外格式化。

datanode的存储目录在`hdfs-site.xml`里设置:

```xml
<property>
   <name>dfs.datanode.data.dir</name>
   <value>file:///kkb/install/hadoop-2.6.0-cdh5.14.2/hadoopDatas/datanodeDatas</value>
</property>
```

在`/kkb/install/hadoop-2.6.0-cdh5.14.2/hadoopDatas/datanodeDatas/current`这个目录下查看版本号

```
[root@node01 current]## cat VERSION

#Thu Mar 14 07:58:46 CST 2019

storageID=DS-47bcc6d5-c9b7-4c88-9cc8-6154b8a2bf39

clusterID=CID-dac2e9fa-65d2-4963-a7b5-bb4d0280d3f4

cTime=0

datanodeUuid=c44514a0-9ed6-4642-b3a8-5af79f03d7a4

storageType=DATA_NODE

layoutVersion=-56
```

具体解释

（1）storageID：存储id号

（2）clusterID：集群id，全局唯一（这个就是为什么重新格式化hdfs会出错的原因，因为集群id不一致）

（3）cTime属性标记了datanode存储系统的创建时间，对于刚刚格式化的存储系统，这个属性为0；但是在文件系统升级之后，该值会更新到新的时间戳。

（4）datanodeUuid：datanode的唯一识别码

（5）storageType：存储类型

（6）layoutVersion是一个负整数。通常只有HDFS增加新特性时才会更新这个版本号。

#### Datanode多目录配置

`datanode`也可以**配置成多个目录，每个目录存储的数据不一样（这里不是说添加副本数）**。修改`hdfs-site.xml`配置文件即可：

```xml
<!-- 定义dataNode数据存储的节点位置，实际工作中，一般先确定磁盘的挂载目录，然后多个目录用，进行分割 -->
<property>
   <name>dfs.datanode.data.dir</name>
   <value>file:///kkb/.../hadoopDatas/datanodeDatas,file:///...</value>
</property>
```

## 小文件治理

思考一个问题：无论存储大文件还是小文件，都会产生元数据，如果有很多小文件，是否划算？

不划算，每个文件、目录、块都大概有`150`字节的元数据，文件数量的限制也由namenode内存大小决定，如果小文件过多则会造成namenode的压力过大，且HDFS能存储的数据总量也会变小。

小文件治理的方式，之前已经使用JavaAPI方式演示过，下面讲解其它方式。

#### HAR文件方案

HAR文件方案的本质是启动Mapreduce程序，所以**需要启动yarn**                     

通过命令即可完成：

```sh
hadoop archive -archiveName <NAME>.har -p <parent path> [-r <replication factor>]<src>* <dest>
/*
-archiveName <NAME>.har： 归档文件（许多小文件形成的一个大文件）
-p <parent path>：小文件的父级目录
[-r <replication factor>]：可选，副本个数
<src>* <dest>：归档文件存放的路径
*/
```

案例：

第一步：创建归档文件

```sh
cd /kkb/install/hadoop-2.6.0-cdh5.14.2/bin
hadoop archive -archiveName myhar.har -p /user/hadoop /user
```

第二步：查看归档文件内容

```sh
[hadoop@node01 bin]$ hdfs dfs -ls -R har:///myhar.har/
-rw-r--r--   3 hadoop supergroup          0 2020-02-10 23:34 har:///myhar.har/k1.txt
-rw-r--r--   3 hadoop supergroup          0 2020-02-10 23:34 har:///myhar.har/k2.txt
-rw-r--r--   3 hadoop supergroup          0 2020-02-10 23:35 har:///myhar.har/k3.txt
[hadoop@node01 bin]$ hdfs dfs -ls -R /myhar.har
-rw-r--r--   3 hadoop supergroup          0 2020-02-10 23:35 /myhar.har/_SUCCESS
-rw-r--r--   3 hadoop supergroup        326 2020-02-10 23:35 /myhar.har/_index
-rw-r--r--   3 hadoop supergroup         23 2020-02-10 23:35 /myhar.har/_masterindex
-rw-r--r--   3 hadoop supergroup          0 2020-02-10 23:35 /myhar.har/part-0
//所有小文件的内容合并形成了part-0文件
```

<img src="hadoop.assets/image-20200211002720377.png" alt="image-20200211002720377" style="zoom: 80%;" />

第三步：解压归档文件

```
hdfs dfs -mkdir -p /user/har

hdfs dfs -cp har:///user/myhar.har/* /user/har/
```



#### Sequence Files方案

##### SequenceFile是什么？

`SequenceFile`文件，主要由一条条`record`记录组成；每个`record`是键值对形式的，`SequenceFile`文件可以作为小文件的存储容器。每条`record`保存一个小文件的内容。

小文件名作为当前`record`的键，小文件的内容作为当前`record`的值。

<img src="hadoop.assets/image-20200211015538055.png" alt="image-20200211015538055" style="zoom:67%;" />

例如有`10000`个`100KB`的小文件，可以编写程序将这些文件内容放到一个`SequenceFile`文件。

一个`SequenceFile`是可分割的，所以`MapReduce`可将`SequenceFile`文件切分成块，每一块独立操作。

##### SequenceFile的详细结构

- 一个`SequenceFile`首先有一个`4`字节的`header`（文件版本号）
- 接着是若干`record`记录
- 记录间会**随机的插入一些同步点**`sync marker`，用于方便定位到记录边界。（同步点的作用就是如果位移点不在一个`record`的开始处，就会调用`sync`方法把位移点移到下一个`record`的开始处。）

##### 压缩SequenceFile文件的方式

不像`HAR`，`SequenceFile`支持压缩。记录的结构取决于是否启动压缩，支持两类压缩：

- 不压缩`NONE`方式以及压缩`RECORD`

![image-20200211021723789](hadoop.assets/image-20200211021723789.png)

- 压缩`BLOCK`
  - 一次性压缩多条`record`记录。
  - 每一个新块`Block`开始处都需要插入同步点
  - 在大多数情况下，以`block`（注意：指的是`SequenceFile`中的`block`）为单位进行压缩是最好的选择，因为一个`block`包含多条记录，利用`record`间的相似性进行压缩，压缩效率更高

![image-20200211021735243](hadoop.assets/image-20200211021735243.png)

 

##### 案例1：向SequenceFile写入数据

把已有的数据转存为`SequenceFile`比较慢。比起先写小文件，再将小文件写入`SequenceFile`，一个更好的选择是直接将数据写入一个`SequenceFile`文件，省去小文件作为中间媒介.

下列代码主要步骤是创建`SequenceFile.Writer`类的对象，然后使用该对象的`append()`方法

```java
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IOUtils;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.SequenceFile;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.io.compress.BZip2Codec;
import java.io.IOException;

public class T1 {
    //模拟数据源
    private static final String[] DATA = {
        "I love you krystal","i love you kob3","lakers champion","hahahahhahaha"};

    public static void main(String[] args) throws IOException {
        //创建hadoop配置文件对象
        Configuration conf = new Configuration();
        //conf.set("fs.defaultFS","hdfs://node01:8020");
        //-->此行可写可不写，可能是默认调用系统的一些资源
        
        /*创建向SequenceFile文件写入数据时的一些选项,
        为等会创建SequenceFile.Writer对象提供参数*/
        
        //要写入的SequenceFile的路径
        SequenceFile.Writer.Option pathOption    
            = SequenceFile.Writer.file(new Path("hdfs://node01:8020//Seq1"));
        //record的key类型选项
        SequenceFile.Writer.Option keyOption    
            = SequenceFile.Writer.keyClass(IntWritable.class);
        //record的value类型选项
        SequenceFile.Writer.Option valueOption   
            = SequenceFile.Writer.valueClass(Text.class);
        
        //SequenceFile压缩方式：NONE | RECORD | BLOCK三选一

        //方案一：RECORD压缩、不指定压缩算法
        SequenceFile.Writer.Option compressOption  
            = SequenceFile.Writer.compression(SequenceFile.CompressionType.RECORD);
        
        SequenceFile.Writer writer = SequenceFile.createWriter(conf, pathOption, 				keyOption, valueOption, compressOption);


/*			//方案二：BLOCK压缩、不指定压缩算法
            SequenceFile.Writer.Option compressOption  = SequenceFile.Writer.compression(SequenceFile.CompressionType.BLOCK);
            SequenceFile.Writer writer = SequenceFile.createWriter(conf, pathOption, keyOption, valueOption, compressOption);

		  	//方案三：使用BLOCK压缩、指定压缩算法：BZip2Codec；压缩耗时间
            BZip2Codec codec = new BZip2Codec();
            codec.setConf(conf);
            SequenceFile.Writer.Option compressAlgorithm = SequenceFile.Writer.compression(SequenceFile.CompressionType.RECORD, codec);
            //创建写数据的Writer实例
            SequenceFile.Writer writer = SequenceFile.createWriter(conf, pathOption, keyOption, valueOption, compressAlgorithm);
*/

        //因为SequenceFile每个record是键值对的
        //指定key类型,value类型：
        IntWritable key = new IntWritable();  
        Text value = new Text(); 
        //IntWritable是Java的int类型的对应Hadoop的的可序列化类型
        //Text是Java的String类型的对应Hadoop的可序列化类型
        
        for (int i = 0; i < DATA.length; i++) {
            //分别设置key、value值
            key.set(i);
            value.set(DATA[i]);

            System.out.printf("[%s]\t%s\t%s\n", writer.getLength(), key, value);
            //在SequenceFile末尾追加内容
            writer.append(key, value);
        }
        //关闭流
        IOUtils.closeStream(writer);
    }
}
```

##### 案例2：查看SequenceFile的内容

**shell命令方式**

```sh
  hadoop fs -text /writeSequenceFile
```

**JavaApi方式**

```java
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IOUtils;
import org.apache.hadoop.io.SequenceFile;
import org.apache.hadoop.io.Writable;
import org.apache.hadoop.util.ReflectionUtils;
import java.io.IOException;

public class T1 {    
    public static void main(String[] args) throws IOException {
        Configuration conf = new Configuration();
        
        //创建Reader对象，赋初值为null
        SequenceFile.Reader reader = null;

        try {
            //读取SequenceFile的Reader的路径选项
            SequenceFile.Reader.Option pathOption = SequenceFile.Reader.file(new Path("hdfs://node01:8020/writeSequenceFile"));

            //实例化Reader对象
            reader = new SequenceFile.Reader(conf, pathOption);
            
            //根据反射，求出key类型（hadoop对应的什么类型的可序列化类型）
            Writable key = (Writable)
                ReflectionUtils.newInstance(reader.getKeyClass(), conf);
            //根据反射，求出value类型
            Writable value = (Writable)
                ReflectionUtils.newInstance(reader.getValueClass(),conf);
            
            long position = reader.getPosition();
            System.out.println(position);
            
            while (reader.next(key, value)) {
                String syncSeen = reader.syncSeen() ? "*" : "";
                System.out.printf("[%s%s]\t%s\t%s\n", position, syncSeen, key, value);
                position = reader.getPosition(); 
                // beginning of next record定位到下一个record
            }
        } finally {
            //关闭资源
            IOUtils.closeStream(reader);
        }
    }
}
```

## 多个集群之间的数据拷贝

在我们实际工作当中，极有可能会遇到将测试集群的数据拷贝到生产环境集群，或者将生产环境集群的数据拷贝到测试集群，那么就需要我们在**多个集群之间进行数据的远程拷贝**，`hadoop`自带也有命令可以帮我们实现这个功能

1、本地文件拷贝`scp`

```sh
cd /kkb/soft

scp -r jdk-8u141-linux-x64.tar.gz hadoop@node02:/kkb/soft
```

2、集群之间的数据拷贝`distcp`

```sh
cd /kkb/install/hadoop-2.6.0-cdh5.14.2/

bin/hadoop distcp hdfs://node01:8020/jdk-8u141-linux-x64.tar.gz hdfs://cluster2:8020/
```

## hdfs快照snapShot管理(了解就行)

快照顾名思义，就是相当于对我们的`hdfs`文件系统做一个备份，我们可以**通过快照对我们指定的文件夹设置备份**，但是添加快照之后，并不会立即复制所有文件，而是指向同一个文件。当写入发生时，才会产生新文件。快照的管理一般是运维人员来做。

##### 快照使用基本语法

**开启快照权限：**

1、开启指定目录的快照功能（创建快照之前要执行次步骤）

```sh
hdfs dfsadmin -allowSnapshot 路径 
```

 2、禁用指定目录的快照功能（**默认就是禁用状态**）

```sh
 hdfs dfsadmin -disallowSnapshot 路径
```

**创建快照：** 

3、给某个路径创建快照`snapshot`

```sh
 hdfs dfs -createSnapshot 路径
```

 4、指定快照名称进行创建快照`snapshot`

```sh
 hdfs dfs -createSanpshot 路径 名称  
```

 5、给快照重新命名

```sh
 hdfs dfs -renameSnapshot 路径 旧名称 新名称 
```

6、列出当前用户所有可快照目录

```sh
 hdfs lsSnapshottableDir 
```

 7、比较两个快照的目录不同之处

```sh
 hdfs snapshotDiff 路径1 路径2
```

 8、删除快照snapshot

```sh
 hdfs dfs -deleteSnapshot <path> <snapshotName>  
```

## hdfs回收站

任何一个文件系统，基本上都会有垃圾桶机制，也就是删除的文件，不会直接彻底清掉，我们一把都是将文件放置到垃圾桶当中去，过一段时间之后，自动清空垃圾桶当中的文件，这样对于文件的安全删除比较有保证，避免我们一些误操作，导致误删除文件或者数据

##### 可在`core-site.xml`配置两个参数

```xml
<property>
    <name>fs.trash.interval</name>
    <value>10080</value>
</property>
<property>
    <name>fs.trash.checkpoint.interval</name>
    <value>值</value>
</property>
```

 `fs.trash.interval`默认值为`0`，**`0`表示禁用回收站，不是0就表示启动了回收站**，这个代表回收站的文件的存活时间，过了这个时间文件就会被删掉。

`fs.trash.checkpoint.interval=0`默认值也为0，表示检查回收站的间隔时间。

 要求`fs .interval <=fs.trash.interval`。

通过`javaAPI`删除的数据，不会进入回收站，需要调用`moveToTrash()`方法才会进入回收站

```
 Trash trash = New Trash(conf);
 trash.moveToTrash(path); 
```

##### 查看回收站

回收站在集群的`/user/hadoop/.Trash/` 这个路径下

##### 恢复回收站数据

```java
hdfs dfs -mv trashFileDir  hdfsdir
//trashFileDir ：回收站的文件路径
//hdfsdir  ：将文件移动到hdfs的哪个路径下 
```

##### 清空回收站

```sh
 hdfs dfs -expunge
```

## Hadoop常用可序列化类型

`hadoop`没有沿用`java`当中基本的数据类型，而是自己进行封装了一套数据类型，其自己封装的类型与`java`的类型对应如下

表4-1 常用的数据类型对应的`Hadoop`数据序列化类型

| Java类型 | Hadoop   Writable类型 |
| :------: | :-------------------- |
| Boolean  | BooleanWritable       |
|   Byte   | ByteWritable          |
|   Int    | IntWritable           |
|  Float   | FloatWritable         |
|   Long   | LongWritable          |
|  Double  | DoubleWritable        |
|  String  | Text                  |
|   Map    | MapWritable           |
|  Array   | ArrayWritable         |
|  byte[]  | BytesWritable         |

- **序列化**就是把内存中的对象，转换成字节序列（或其他数据传输协议）以便于存储到磁盘（持久化）和网络传输。 
- **反序列化**就是将收到字节序列（或其他数据传输协议）或者是磁盘的持久化数据，转换成内存中的对象。

`Java` 的序列化（`Serializable`）是一个重量级序列化框架，一个对象被序列化后，会附带很多额外的信息（各种校验信息，header，继承体系…），不便于在网络中高效传输；所以，`hadoop` 自己开发了一套序列化机制（`Writable`），精简，高效。不用像 `java` 对象类一样传输多层的父子关系，需要哪个属性就传输哪个属性值，大大的减少网络传输的开销。 

## mapreduce核心思想

`MapReduce`是一个分布式运算程序的编程框架，是用户开发“基于`Hadoop`的数据分析应用”的核心框架。

`MapReduce`**核心功能是将用户编写的业务逻辑代码和自带默认组件整合成一个完整的分布式运算程序**，并发运行在一个`Hadoop`集群上。

`MapReduce`的**核心思想是“分而治之”**，适用于大量复杂的任务处理场景（大规模数据处理场景）。即使是发布过论文实现分布式计算的谷歌也只是现了这种思想，而不是自己原创。

- **Map负责“分”，**即把复杂的任务分解为若干个“简单的任务”来并行处理。可以进行拆分的前提是这些小任务可以并行计算，彼此间几乎没有依赖关系。

- **Reduce负责“合”**，即对`map`阶段的结果进行全局汇总。

这两个阶段合起来正是`MapReduce`思想的体现。

> **通俗解释：**　　
>
> 我们要数图书馆中的所有书。你数1号书架，我数2号书架。这就是“**Map**”。我们人越多，数书就越快。
>
> 现在我们到一起，把所有人的统计数加在一起。这就是“**Reduce**”。

## mapreduce编程模型

分而治之--->使用单台服务器无法计算或较短时间内计算出结果时，可**将大任务切分成一个个小的任务**，小任务分别在不同的服务器上并行的执行，最终再汇总每个小任务的结果。

![img](hadoop.assets/clip_image002-1581366396317.jpg)

`MapReduce`由两个阶段组成：

- `Map`阶段（切分成一个个小的任务）

  -  `map`阶段有一个**关键的`map()`方法**。
  -  此方法的输入和输出都是键值对。输出写入本地磁盘。

- `Reduce`阶段（汇总小任务的结果）

  - `reduce`阶段有一个**关键的`reduce()`方法**
  - 此方法的输入也是键值对（即`map`的输出（`kv`对））
  - 输出也是一系列键值对，结果最终写入`HDFS`

  ![image-20200211045328993](hadoop.assets/image-20200211045328993.png)



## :rainbow:mapreduce编程指导思想(八个步骤背下来)

`mapReduce`编程模型的总结：

`MapReduce`的开发一共有八个步骤其中`map`阶段分为`2`个步骤，`shuffle`阶段4个步骤，`reduce`阶段分为2个步骤

#### Map阶段2个步骤

第一步：设置`inputFormat`类，读取我们的数据，将数据切分成`key，value`对，输入到第二步

第二步：**自定义`map`逻辑**，处理我们第一步的输入数据，然后转换成新的`key`，`value`对进行输出

#### shuffle阶段4个步骤

第三步：对输出的`key`，`value`对进行分区。相同`key`的数据发送到同一个`reduce task`里面去，相同`key`合并，`value`形成一个集合

第四步：对不同分区的数据按照相同的`key`进行排序

第五步：对排序后的数据进行规约(`combine`操作)，降低数据的网络拷贝（可选步骤)

第六步：对排序后的数据进行分组，分组的过程中，将相同`key`的`value`放到一个集合当中

#### reduce阶段2个步骤

第七步：对多个`map`的任务进行合并，排序，**自定义`reduce`逻辑**，对输入的`key`，`value`对进行处理，转换成新的`key`，`value`对进行输出

第八步：设置`outputformat`将输出的`key`，`value`对数据进行保存到文件中

## Mapreduce编程实现案例1(wordcount)

#### 案例需求

现有数据格式如下，每一行数据之间都是使用逗号进行分割，**求取每个单词出现的次数**

```
 hello,hello
 world,world
 hadoop,hadoop
 hello,world
 hello,flume
 hadoop,hive
 hive,kafka
 flume,storm
 hive,oozie
```

#### 案例分析

- 确定`Map`阶段的输入和输出的键值对类型，以及确定`Reduce`阶段的输入和输出键值对类型

  从下图可以知道，`Map`阶段的输入和输出的键值对可序列化类型为：`<LongWritable,Text,Text,IntWritable>`

  `Reduce`阶段的输入和输出键值对类型为：

  `<Text,IntWritable,Text,IntWritable>`

![image-20200211162912930](hadoop.assets/image-20200211162912930.png)





#### 步骤1：创建Maven工程

给`pom.xml`文件添加以下坐标：

```xml
<repositories>
        <repository>
            <id>cloudera</id>
            <url>https://repository.cloudera.com/artifactory/cloudera-repos/</url>
        </repository>
    </repositories>
    <dependencies>
        <dependency>
            <groupId>org.apache.hadoop</groupId>
            <artifactId>hadoop-client</artifactId>
            <version>2.6.0-mr1-cdh5.14.2</version>
        </dependency>
        <dependency>
            <groupId>org.apache.hadoop</groupId>
            <artifactId>hadoop-common</artifactId>
            <version>2.6.0-cdh5.14.2</version>
        </dependency>
        <dependency>
            <groupId>org.apache.hadoop</groupId>
            <artifactId>hadoop-hdfs</artifactId>
            <version>2.6.0-cdh5.14.2</version>
        </dependency>

<dependency>
        <groupId>org.apache.hadoop</groupId>
        <artifactId>hadoop-mapreduce-client-core</artifactId>
        <version>2.6.0-cdh5.14.2</version>
    </dependency>
    <!-- https://mvnrepository.com/artifact/junit/junit -->
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.11</version>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.testng</groupId>
        <artifactId>testng</artifactId>
        <version>RELEASE</version>
        <scope>test</scope>
    </dependency>
</dependencies>
<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.0</version>
            <configuration>
                <source>1.8</source>
                <target>1.8</target>
                <encoding>UTF-8</encoding>
                <!--   <verbal>true</verbal>-->
            </configuration>
        </plugin>
        <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-shade-plugin</artifactId>
        <version>2.4.3</version>
        <executions>
            <execution>
                <phase>package</phase>
                <goals>
                    <goal>shade</goal>
                </goals>
                <configuration>
                    <minimizeJar>true</minimizeJar>
                </configuration>
            </execution>
        </executions>
    </plugin>

</plugins>

</build>
```

#### 步骤2：自定义map逻辑

创建一个继承`Mapper`类的子类，并重写`map()`方法。

```java
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;
import java.io.IOException;

//继承Mapper类，设定输入与输出键值对的泛型
public class MyMap extends Mapper<LongWritable,Text,Text,IntWritable> {
    Text text = new Text(); //text为要输出的keyout
    IntWritable intW = new IntWritable(1); //inW为要输出的valueout，将每个单词出现都记做1次
    //重写map方法，程序每读取一行数据，都会来调用以下map方法
    //key: KEYIN
    //value: VALUEIN
    // context： 上下文对象。承上启下，承接上面步骤发过来的数据，通过context将数据发送到下面的步骤里面去
    @Override
    protected void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException {
        //获取我们的一行数据
        String line = value.toString();  //Text类重写了toString()方法，作用是将value转换为字符串
        String[] split = line.split(","); //分割单词
        for (String word : split) {
            text.set(word);
            //通过context上下文对象将键值对输出到shuffle阶段
            context.write(text,intW);
        }
    }
}
```

#### 步骤3：自定义reduce逻辑

创建一个继承`Ruducer`类的子类，并重写`reduce()`方法。

```Java
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;

import java.io.IOException;
public class MyReduce extends Reducer<Text,IntWritable,Text,IntWritable> {

    @Override
    protected void reduce(Text key, Iterable<IntWritable> values, Context context) throws IOException, InterruptedException {
        int result = 0;
        for (IntWritable value : values) {
            //将我们的结果进行累加
            result += value.get();
        }
        //继续输出我们的数据
        IntWritable intWritable = new IntWritable(result);
        //将我们的数据输出
        context.write(key,intWritable);
    }
}
```

#### 步骤4：编写组装类

创建一个组装类来继承`Configured`类和实现`Tool`接口，并重写`run()`方法，`run()`方法用于将我们的8大步骤进行组装，每个步骤都是一个类。

```java
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.conf.Configured;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.lib.input.TextInputFormat;
import org.apache.hadoop.mapreduce.lib.output.TextOutputFormat;
import org.apache.hadoop.util.Tool;

public class Assem extends Configured implements Tool{
    /**
     * 实现Tool接口之后，需要实现一个run方法，
     * 这个run方法用于组装我们的程序的逻辑，其实就是组装八个步骤
     */
    @Override
    public int run(String[] args) throws Exception {
        //获取Job对象，组装我们的八个步骤
        //每一个步骤都是一个class类
        Configuration conf = super.getConf();
        Job job = Job.getInstance(conf, "mrdemo1");

        //实际工作当中，程序运行完成之后一般都是打包到集群上面去运行，打成一个jar包
        //如果要打包到集群上面去运行，必须添加以下设置
        job.setJarByClass(RunClass.class);

        //第一步：读取文件，解析成key,value对，k1:行偏移量 v1：一行文本内容
        job.setInputFormatClass(TextInputFormat.class);
        //指定我们去哪一个路径读取文件，该路径下的所有文件都会被读取
        TextInputFormat.addInputPath(job,new Path("file:///F://test2"));
        //如果改成这样：TextInputFormat.addInputPath(job,new Path(args[0]));
        //把jar包传到集群运行时就需要传递参数

        //第二步：自定义map逻辑，接受k1   v1 转换成为新的k2   v2输出
        job.setMapperClass(MyMap.class);
        //设置map阶段输出的key,value的类型，其实就是k2 v2的类型
        job.setMapOutputKeyClass(Text.class);
        job.setMapOutputValueClass(IntWritable.class);

        //第三步到六步：分区，排序，规约，分组都省略(使用默认逻辑)

        //第七步：自定义reduce逻辑
        job.setReducerClass(MyReduce.class);
        //设置key3 value3的类型
        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(IntWritable.class);
        //第八步：输出k3 v3 进行保存
        job.setOutputFormatClass(TextOutputFormat.class);
        //一定要注意，输出路径是需要不存在的，如果存在就报错
        TextOutputFormat.setOutputPath(job,new Path("file:///F://test2//outputResult")); //输出路径可以是本地路径或者hdfs路径
        //提交job任务
        boolean b = job.waitForCompletion(true);
        return b?0:1;
        /***
         * 第一步：读取文件，解析成key,value对，k1   v1
         * 第二步：自定义map逻辑，接受k1   v1 转换成为新的k2   v2输出
         * 第三步：分区。相同key的数据发送到同一个reduce里面去，key合并，value形成一个集合
         * 第四步：排序  对key2进行排序。字典顺序排序
         * 第五步：规约 combiner过程 调优步骤 可选
         * 第六步：分组
         * 第七步：自定义reduce逻辑接受k2   v2 转换成为新的k3   v3输出
         * 第八步：输出k3 v3 进行保存
         */
    }

}
```

#### 步骤5：编写程序入口类

```java
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.util.ToolRunner;

public class RunClass {
    public static void main(String[] args) throws Exception {
        Configuration conf = new Configuration();
        //提交run方法之后，得到一个程序的退出状态码
        int exitCode = ToolRunner.run(conf, new Assem(), args);
        //根据我们 程序的退出状态码，退出整个进程
        System.exit(exitCode);
    }
}
/*System.exit(int status)用法：
status为0时为正常退出程序，也就是结束当前正在运行中的java虚拟机。
status为非0的其他整数（包括负数，一般是1或者-1），表示非正常退出当前程序
*/
```

#### 运行效果

![image-20200211185708847](hadoop.assets/image-20200211185708847.png)

## Mapreduce的运行模式

#### 本地模式

我们的上面的**案例1的运行模式就是本地模式**，`mapreduce`程序是被提交给`LocalJobRunner`在本地以单进程的形式运行，**输入和输出路径既可以在本地文件系统，也可以在hdfs上**。

本地模式非常便于进行业务逻辑的`debug`，只要在`eclipse`或`IDEA`中打断点即可

怎样实现本地运行？

- 写一个程序，不要带集群的配置文件

- 设置参数值：`mapreduce.framework.name=local`
- 设置参数值：`yarn.resourcemanager.hostname=local`

本地模式运行代码设置：

```java
public class MainClass {
    public static void main(String[] args) throws Exception {
        Configuration conf = new Configuration();
        conf.set("mapreduce.framework.name","local");
        conf.set("yarn.resourcemanager.hostname","local");
        //上面这两行代码实际上不写也可以，值默认是local的。
        int exitCode = ToolRunner.run(conf, new Assem(), args);
        System.exit(exitCode);
    }
}
```

#### 集群运行模式

集群运行模式是将`mapreduce`程序提交给`yarn`集群，分发到很多的节点上并发执行，处理的数据和输出结果应该位于`hdfs`文件系统

提交程序给集群的实现步骤：

1、将程序打成`JAR`包

![image-20200211192022088](hadoop.assets/image-20200211192022088.png)

2、将`jar`包上传到`Linux`本地文件系统

3、通过`JavaApi`方式将**数据源**上传到`hdfs`文件系统（路径和程序中指定的一致）

4、在集群的任意一个节点上用`hadoop`或者`yarn`命令运行`jar`包。

```java
//运行语法：hadoop jar jar的包名  main方法所在的类的相对路径(不要.java后缀)  [参数1...参数2...]

hadoop jar Wordcount-1.0-SNAPSHOT.jar RunClass
或者
yarn jar Wordcount-1.0-SNAPSHOT.jar RunClass
```

**注意事项:**

程序中设定的输出路径不能事先存在，而且在填写`main`方法所在的类的相对路径时，要注意，如下图：

![image-20200211232846144](hadoop.assets/image-20200211232846144.png)

建议使用`copy Reference`，复制出来直接用，不用截取，不要使用`copy Path`。

## Mapreduce编程实现案例2(上下行)

`Writable`是`Hadoop`的序列化格式，`hadoop`定义了这样一个`Writable`接口。 一个类要支持可序列化只需实现这个接口即可。

另外`Writable`有一个子接口是`WritableComparable`，`writableComparable`是既可实现序列化，也可以对`key`进行比较，我们这里可以通过自定义`key`实现`WritableComparable`来实现我们的排序功能。

在企业开发中往往常用的基本序列化类型不能满足所有需求，比如在`Hadoop`框架内部传递一个`java bean`对象，那么该对象就需要实现序列化接口。

创建可序列化的`java bean`类的步骤：

1. 创建一个类，必须实现`Writable`接口
2. 重写`void write(DataOutput out)`方法，重写`void readFields(DataInput in)`方法
3. 重写`String toString()`方法
4. 为该类创建无参构造，反序列化时，反射需要调用空参构造函数

#### 案例需求

现有数据，内容如下，求取**每个手机号**的上行包之和，下行包之和，上行总流量之和，以及下行总流量之和。数据以制表符`\t`为分分隔符，第二列为手机号。

![image-20200212001352384](hadoop.assets/image-20200212001352384.png)

#### 案例分析

![image-20200212023337955](hadoop.assets/image-20200212023337955.png)

#### 步骤1：创建Maven工程

和`wordcount`案例`1`相同

#### 步骤2：定义javaBean类型的可序列化类

将上下行包和上下行流量这四个值包装在这个类里，该类要实现`Writable`接口，表示可序列化的。

```java
package com.bean;

import org.apache.hadoop.io.Writable;
import java.io.DataInput;
import java.io.DataOutput;
import java.io.IOException;

public class FlowBean implements Writable {
    private Integer upFlow; //上行包
    private Integer downFlow; //下行包
    private Integer upCountFlow; //上行流量总和
    private Integer downCountFlow; //下行流量总和

    //建立空的构造方法，反序列化时会用到
    public FlowBean() {

    }

    //序列化方法：
    @Override
    public void write(DataOutput out) throws IOException {
        //序列化的类型要跟源数据的数据类型一致，上下行包和流量总和的值都是int类型。
        out.writeInt(upFlow);
        out.writeInt(downFlow);
        out.writeInt(upCountFlow);
        out.writeInt(downCountFlow);
    }

    //反序列化方法:
    @Override
    public void readFields(DataInput in) throws IOException {
        //反序列化的类型也要跟源数据的数据类型一致
        //反序列化的顺序跟序列化的顺序必须完全一致！！！
        // 顺序是：upFlow->downFlow->upCountFlow->downCountFlow
        this.upFlow = in.readInt();
        this.downFlow = in.readInt();
        this.upCountFlow = in.readInt();
        this.downCountFlow = in.readInt();
    }

    //getter与setter
    public Integer getUpFlow() {
        return upFlow;
    }

    public void setUpFlow(Integer upFlow) {
        this.upFlow = upFlow;
    }

    public Integer getDownFlow() {
        return downFlow;
    }

    public void setDownFlow(Integer downFlow) {
        this.downFlow = downFlow;
    }

    public Integer getUpCountFlow() {
        return upCountFlow;
    }

    public void setUpCountFlow(Integer upCountFlow) {
        this.upCountFlow = upCountFlow;
    }

    public Integer getDownCountFlow() {
        return downCountFlow;
    }

    public void setDownCountFlow(Integer downCountFlow) {
        this.downCountFlow = downCountFlow;
    }


    @Override
    public String toString() {
        return "FlowBean{" +
                "upFlow=" + upFlow +
                ", downFlow=" + downFlow +
                ", upCountFlow=" + upCountFlow +
                ", downCountFlow=" + downCountFlow +
                '}';
    }
}

```

#### 步骤3：自定义map逻辑

```java
package com.bean;

import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;
import java.io.IOException;

//输入：LongWritable,Text
//输出：Text,FlowBean
//特别留意到，输出的键值对的值是我们自己定义的可序列类型FlowBean,里面包装了4个数据
public class MyMap extends Mapper<LongWritable,Text,Text,FlowBean> {
    private FlowBean flowBean ;
    private Text text;

    //重写setup方法，初始化的动作写在该方法里，一个map task运行前会执行一次该方法
    @Override
    protected void setup(Context context) throws IOException, InterruptedException {
        flowBean = new FlowBean();
        text = new Text();
    }

    @Override
    protected void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException {
        //切分一行的数据得到一个数组
        String[] split = value.toString().split("\t");
        //获取手机号以及那四个值：
        String phoneNum = split[1];
        String upFlow =split[6];
        String downFlow =split[7];
        String upCountFlow =split[8];
        String downCountFlow =split[9];

        //设置输出键值对的key的内容：
        text.set(phoneNum);
        //设置输出键值对的value内容：
        flowBean.setUpFlow(Integer.parseInt(upFlow));
        flowBean.setDownFlow(Integer.parseInt(downFlow));
        flowBean.setUpCountFlow(Integer.parseInt(upCountFlow));
        flowBean.setDownCountFlow(Integer.parseInt(downCountFlow));
        //承上启下，输出键值对到shuffle阶段：
        context.write(text,flowBean);
    }
}
```

#### 步骤4：自定义reduce逻辑

```java
package com.bean;

import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;
import java.io.IOException;

public class MyReduce extends Reducer<Text,FlowBean,Text,Text> {

    @Override
    protected void reduce(Text key, Iterable<FlowBean> values, Context context) throws IOException, InterruptedException {
        int upFlow = 0;
        int donwFlow = 0;
        int upCountFlow = 0;
        int downCountFlow = 0;
        for (FlowBean value : values) {
            upFlow += value.getUpFlow();
            donwFlow += value.getDownFlow();
            upCountFlow += value.getUpCountFlow();
            downCountFlow += value.getDownCountFlow();
        }
        context.write(key,new Text(upFlow +"\t" +  donwFlow + "\t" +  upCountFlow + "\t" + downCountFlow));
    }
}
```

#### 步骤5：创建组装类以及定义main方法

```java
package com.bean;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.conf.Configured;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.lib.input.TextInputFormat;
import org.apache.hadoop.mapreduce.lib.output.TextOutputFormat;
import org.apache.hadoop.util.Tool;
import org.apache.hadoop.util.ToolRunner;

public class Assem  extends Configured implements Tool {
    @Override
    public int run(String[] args) throws Exception {
        //获取job对象
        Job job = Job.getInstance(super.getConf(), "flowCount");
        //如果程序打包运行必须要设置这一句
        job.setJarByClass(Assem.class);


        job.setInputFormatClass(TextInputFormat.class);
        TextInputFormat.addInputPath(job,new Path("file:///..."));
        //TextInputFormat.addInputPath(job,new Path(args[0]));使用这个方式可以传入参数

        job.setMapperClass(MyMap.class);
        job.setMapOutputKeyClass(Text.class);
        job.setMapOutputValueClass(FlowBean.class);

        job.setReducerClass(MyReduce.class);
        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(Text.class);

        job.setOutputFormatClass(TextOutputFormat.class);
        TextOutputFormat.setOutputPath(job,new Path("file:///..."));
        //TextOutputFormat.setOutputPath(job,new Path(args[1]));使用这个方式可以传入参数

        boolean b = job.waitForCompletion(true);
        return b?0:1;
    }
	//程序入口：
    public static void main(String[] args) throws Exception {
        Configuration configuration = new Configuration();
        int run = ToolRunner.run(configuration, new Assem(), args);
        System.exit(run);
    }
}
```

## :rainbow_flag:Inputformat类

`InputFormat`是`mapreduce`当中用于处理数据输入的一个组件，是**最顶级的一个抽象父类**，主要用于解决各个地方的数据源的数据输入问题。其中`InputFormat`的`UML`类图可以通过`idea`进行查看（只有商业版本才有这个功能），如下图。

![image-20200212171237897](hadoop.assets/image-20200212171237897.png)



**查看类图的方式**：进行要查看的类的源码，点击菜单栏：`Navigate`---》`type Hierarchy`--》

![image-20200212171811141](hadoop.assets/image-20200212171811141.png)

### FileInputformat类

`FileInputFormat`类是`InputFormat`的一个子类，**如果需要操作`hdfs`上面的文件，基本上都是通过`FileInputFormat`类来实现的**，我们可以通过`FileInputFormat`来实现各种格式的文件操作，`FileInputFormat`的子实现类的`UML`类图如下：

​    ![image-20200212173217679](hadoop.assets/image-20200212173217679.png)                           

 **`FileInputFormat`的子类：**

| **类名**                  | 主要作用                                                     |
| ------------------------- | ------------------------------------------------------------ |
| `TextInputFormat`         | 读取文本文件                                                 |
| `CombineFileInputFormat`  | 在`MR`当中用于合并小文件，将多个小文件合并之后只需要启动一个`mapTask`进行运行 |
| `SequenceFileInputFormat` | 处理`SequenceFile`这种格式的数据                             |
| `KeyValueTextInputFormat` | 通过手动指定分隔符，将每一条数据解析成为`key，value`对类型   |
| `NLineInputFormat`        | 指定数据的行数作为一个切片                                   |
| `FixedLengthInputFormat`  | 从文件中读取固定宽度的二进制记录                             |

#### CombineTextInputFormat类

##### MapTask的个数由什么决定？--->切片

在运行我们的`MapReduce`程序的时候，我们可以清晰的看到会有多个`mapTask`的运行，那么`maptask`的个数究竟与什么有关，是不是`maptask`越多越好，或者说是不是`maptask`的个数越少越好呢？我们可以通过`MapReduce`的源码进行查看mapTask的个数究竟是如何决定的

在`MapReduce`当中，每个`mapTask`处理一个切片`split`的数据量，因此，**一个切片对应一个`maptask`**。                               

#####  切片是什么？

切片与`block`块的概念很像，但是`block`块是`HDFS`当中存储数据的单位，**切片`split`是`MapReduce`当中每个`MapTask`处理数据量的单位。**

- 一个切片对应一个`maptask`
- 一个`job`(事务)的`map`阶段的并行度有提交`job`时的切片数

- 切片默认大小`=BlockSize`
- 切片不考虑数据集整体，而是针对每一个文件单独切片
- 数据切片只是在逻辑上对输入进行分片，并不会在磁盘上将其切分成片进行存储

**案例：**

`hdfs`上面如果有以下两个文件，文件大小分别为`300M`和`12`M，那么会启动多少个`MapTask`？？？

```
file1.txt  300M

file2.txt  10M
```

经过`FileInputFormat`的切片机制运算后，形成的切片信息如下：

```java
file1.txt.split1-- 0~128M
file1.txt.split2-- 128~256M
file1.txt.split3-- 256~300M
file2.txt.split1-- 0~10M  //针对每一个文件单独切片，这个文件很小，但是会对应一个切片，一个maptask
//一共就会有四个切片，与我们block块的个数刚好相等
```

图解如下：

![image-20200213022841631](hadoop.assets/image-20200213022841631.png)

从上图可以看到，当切片大小为`100M`时，这个`Maptask2`，不仅从本节点`datanode2`读取数据，还要从`datanode2`读取数据，意味着要进行网络传输，所以**`maptask`所在节点一般最好跟所需的数据块的节点一致，合适的切片大小很关键**



##### 切片大小的设定

查看`FileInputFormat`的源码，点击`Navigate--->File Structure`，找到里面`getSplits`的方法，这个方法是获取所有的切片。

```java
public List<InputSplit> getSplits(JobContext job) throws IOException {
        long minSize = Math.max(this.getFormatMinSplitSize(), getMinSplitSize(job));
        long maxSize = getMaxSplitSize(job);
        List<InputSplit> splits = new ArrayList();
        ...
    	...
}
```

再找到`computeSplitSize()`，这个是切片大小的计算公式所在的方法：

```java
protected long computeSplitSize(long blockSize, long minSize, long maxSize) {
    return Math.max(minSize, Math.min(maxSize, blockSize));
    //Math.max(minSize, Math.min(maxSize, blockSize))这个就是切片计算公式
}
/*
计算公式中的minsize和maxsize分别是：
mapreduce.input.fileinputformat.split.minsize=1 //默认值为1 
mapreduce.input.fileinputformat.split.maxsize= Long.MAXValue //默认值Long.MAXValue(long类型的最大值) 
blockSize默认值为128M  
*/
```

![image-20200213031047043](hadoop.assets/image-20200213031047043.png)

切片默认`=blocksize128M`，从切片计算公式可以知道，**如果想要切片变成小于`128M`的就要将`maxsize`设置为小于`128M`的值，如果想要切片变成大于`128M`的就要将`minsize`设置为大于`128M`的值。**

```Java
//改变minsize大小的方法的源码：
public static void setMinInputSplitSize(Job job, long size) {
    job.getConfiguration().setLong("mapred.min.split.size", size);
}
//改变maxsize大小的方法的源码：
public static void setMaxInputSplitSize(Job job, long size) {
    job.getConfiguration().setLong("mapred.max.split.size", size);
}
```



##### 如何控制mapTask的个数

从上面知，一个很小的文件也会对应一个切片，从而占用一个`MapTask`。那如果有`1000`个小文件，每个小文件是`1kb-100MB`之间，那么我们启动`1000个`MapTask是否合适，该如何合理的控制`MapTas`k的个数？？？

如果需要控制`maptask`的个数，我们只需要调整`maxSize`和`minsize`这两个值，那么切片的大小就会改变，切片大小改变之后，`mapTask`的个数就会改变。 

但是，这种做法不能有效解决问题，最好将小文件进行合并规划处理，从而减少切片个数，减少`maptask`个数。



##### 案例：实现maptask个数控制(小文件合并)

框架默认的`TextInputFormat`切片机制是对任务按文件规划切片，不管文件多小，都会是一个单独的切片，都会交给一个`MapTask`，这样如果有大量小文件，就会产生大量的`MapTask`，处理效率极其低下。

`CombineTextInputFormat`**用于小文件过多的场景**，它可以**将多个小文件从==逻辑上==规划到一个切片中**，这样，多个小文件就可以交给一个`MapTask`处理。

##### 案例需求

有很多`0-20M`的小文件，要提交给集群计算处理，要保证`maptask`个数不要过多。

##### 案例分析

有太多小文件了，要通过`CombineTextInputFormat`将多个小文件从逻辑上规划到一个切片中。

首先要修改最大值`MaxInputSplitSize`，设置如下：

```Java
CombineTextInputFormat.setMaxInputSplitSize(job, 4194304);// 4m
```

注意：这个虚拟存储切片最大值最好根据实际的小文件大小情况来设置具体的值。详情应用看下面：

> **`CombineTextInputFormat`将多个小文件从逻辑上规划到一个切片中的详细过程（机制）：**
>
> **包括两个过程：**
>
> ​	**虚拟存储过程：**
>
> ​	将输入目录下所有文件大小，依次和设置的`setMaxInputSplitSize`值比较。
>
> - 如果输入文件大小不大于设置的最大值，逻辑上划分一个块。
> - 如果输入文件大于设置的最大值且大于两倍，那么以最大值切割一块，剩下的平分为两块；
> - 如果输入文件超过设置的最大值且不大于最大值`2`倍，此时将文件均分成`2`个虚拟存储块（平均分，防止出现太小切片）。
>
> - 例如，如果`setMaxInputSplitSize`的值为`4M`，输入文件大小为`8.02M`，则先逻辑上分成一个`4M`。剩余的大小为`4.02M`，如果按照`4M`逻辑划分，就会出现`0.02`M的小的虚拟存储文件，所以将剩余的4`.02M`文件切分成（`2.01M`和`2.01M`）两个文件。
>
> ​	**切片过程：**
>
> ​	判断虚拟存储的文件大小是否大于`setMaxInputSplitSize`值，大于等于则单独形成一个切片。
>
> ​	如果不大于则跟下一个虚拟存储文件进行合并，共同形成一个切片。
>
> ​	**示意图如下**
>
> ![image-20200213042641264](hadoop.assets/image-20200213042641264.png)



##### 案例实现

把前面的`wordCount`实战案例中代码拉过来，修改组装类的第一步的代码即可。

```Java
// job.setInputFormatClass(TextInputFormat.class);

job.setInputFormatClass(CombineTextInputFormat.class);
//设置我们的输入类型为CombineTextInputFormat

CombineTextInputFormat.setMaxInputSplitSize(job, 4194304);
//虚拟存储切片最大值设置4m，设置每个切片处理数据量为4M
```

打包运行，观察`mapTask`的个数

#### KeyValueTextInputFormat类

`KeyValueTextInputFormat`允许我们自己来定义分隔符，**通过分隔符来自定义我们输入的`key`和`value`**。

##### 案例需求

附件当中有下列这类型的数据，数据之间的分隔符为`@zolen@`  数据内容如下

```java
hello@zolen@ input datas today 
count@zolen@ hadoop spark
hello@zolen@ input some datas to test
```

要求将分隔符前面的内容作为输入键值对`key`,后面的作为输入键值对的`value`

期望最终的输出结果如下

```
hello  2
count  1
```

#####  案例分析

输入给map阶段的键值对可序列化类型为：`<Text,Text>`

`map`阶段输出的键值对的可序列化类型为：`<Text,LongWritable>`

![image-20200213053831014](hadoop.assets/image-20200213053831014.png)

##### 步骤1：自定义map逻辑

```Java
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;
import java.io.IOException;

public class KeyValueMapper extends Mapper<Text,Text,Text, LongWritable> {
    LongWritable outValue = new LongWritable(1);
    @Override
    protected void map(Text key, Text value, Context context) throws IOException, InterruptedException {
        context.write(key,outValue);

    }
}
```

##### 步骤2：自定义reduce逻辑

```Java
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;
import java.io.IOException;

public class KeyValueReducer extends Reducer<Text, LongWritable,Text,LongWritable> {


    @Override
    protected void reduce(Text key, Iterable<LongWritable> values, Context context) throws IOException, InterruptedException {
        long result = 0;
        for (LongWritable value : values) {
            long l = value.get();
            result += l;
        }

        context.write(key,new LongWritable(result));

    }
}
```

##### 步骤3：创建组装类和定义main方法

```Java
package com.jimmy.day02;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.lib.input.KeyValueLineRecordReader;
import org.apache.hadoop.mapreduce.lib.input.KeyValueTextInputFormat;
import org.apache.hadoop.mapreduce.lib.output.TextOutputFormat;

import java.io.IOException;

public class KeyValueMain  {

    public static void main(String[] args) throws IOException, ClassNotFoundException, InterruptedException {
        Configuration conf = new Configuration();
        //翻阅 KeyValueLineRecordReader 的源码，发现切割参数的配置
        conf.set("key.value.separator.in.input.line","@zolen@");
        Job job = Job.getInstance(conf);
        //第一步：读取文件，解析成为key，value对
        KeyValueTextInputFormat.addInputPath(job,new Path("file://F://test2"));

        job.setInputFormatClass(KeyValueTextInputFormat.class);
        //第二步：设置mapper类
        job.setMapperClass(KeyValueMapper.class);
        job.setMapOutputKeyClass(Text.class);
        job.setMapOutputValueClass(LongWritable.class);

        //第三步到第六步 分区，排序，规约，分组

        //第七步：设置reducer类
        job.setReducerClass(KeyValueReducer.class);
        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(LongWritable.class);

        //第八步：输出数据
        job.setOutputFormatClass(TextOutputFormat.class);
        TextOutputFormat.setOutputPath(job,new Path("file:///..."));
        boolean b = job.waitForCompletion(true);
        System.exit(0);

    }

}
```

 

#### NlineInputFormat类

`NLineInputFormat`允许我们自己**定义输入特定行数的内容作为一个切片数据**。比如说，某文件有下列17行数据，如果我们定义3行内容作为一个切片数据，就会有6个切片，对应有`6`个`maptask`，可打包到集群运行查看`maptask`个数。

```
hadoop spark kaikeba bigdata flink kafka mapreduce
hello world
hello flume
hadoop hive
hive kafka
flume storm
hive oozie
hello hello
world world
hadoop hadoop
hello world
hello flume
hadoop hive
hive kafka
flume storm
hive ooziehello hello
world world
```

##### 案例需求

将上面内容做词频统计，每输入3行内容作为一个切片数据。

##### 案例分析

跟`wordcount`案例没多大区别，只要稍微修改一下组装逻辑的代码即可。

##### 案例代码

`map`、`reduce`、组装逻辑都整合在了一个类里，有内部类。

```java
package com.jimmy.day03;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.mapreduce.lib.input.NLineInputFormat;
import org.apache.hadoop.mapreduce.lib.output.TextOutputFormat;

import java.io.IOException;

public class NLineMain {
    public static void main(String[] args) throws IOException, ClassNotFoundException, InterruptedException {
        Configuration configuration = new Configuration();
		
        Job job = Job.getInstance(configuration);
        job.setJarByClass(NLineMain.class);
		//设定输入类，设定3行为一个切片数据量
        NLineInputFormat.setNumLinesPerSplit(job,3);
        job.setInputFormatClass(NLineInputFormat.class);
        NLineInputFormat.addInputPath(job,new Path("file:///..."));

        //第二步：自定义mapper类
        job.setMapperClass(NLineMapper.class);
        job.setMapOutputKeyClass(Text.class);
        job.setMapOutputValueClass(LongWritable.class);

        //第三步到第六步  分区，排序，规约，分组
        job.setReducerClass(NLineReducer.class);
        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(LongWritable.class);
        job.setOutputFormatClass(TextOutputFormat.class);
        TextOutputFormat.setOutputPath(job,new Path("file:///..."));
        job.waitForCompletion(true);

    }

    public static class NLineMapper extends Mapper<LongWritable, Text,Text,LongWritable>{
        @Override
        protected void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException {
            String[] s = value.toString().split(" ");
            for (String s1 : s) {
                context.write(new Text(s1),new LongWritable(1));

            }
        }
    }

    public static class NLineReducer extends Reducer<Text,LongWritable,Text,LongWritable>{
        @Override
        protected void reduce(Text key, Iterable<LongWritable> values, Context context) throws IOException, InterruptedException {
            long result = 0L;
            for (LongWritable value : values) {
                result +=value.get();
            }
            context.write(key,new LongWritable(result));
        }
    }
}
```

打包到集群上运行时，从运行的输出信息可以看到，有6个`maptask`:

![image-20200213170111238](hadoop.assets/image-20200213170111238.png)

## 自定义Inputformat类

`mapreduce`框架当中已经给我们提供了很多的文件输入类，用于处理文件数据的输入，如果以上提供的文件数据类还不够用的话，我们也可以通过自定义`InputFormat`来实现文件数据的输入

#### 案例需求

现在有大量的小文件，我们通过自定义`InputFormat`实现将小文件的内容全部读取，然后输出成为一个`SequenceFile`格式的大文件，进行文件的合并。

#### 案例分析

案例需求的示意图如下：

![image-20200213173408994](hadoop.assets/image-20200213173408994.png)

> **自定义`inputformat`类要实现的读取数据效果是：**
>
> - 无论读取的文件是多大的，都是只对应一个切片，一个`maptask`，因此在自定义的`inputformat`类里要设置：文件不可被分割成多块多个切片来读取。
> - 一个`maptask`一次性读取某一个文件的所有内容，生成键值对，键值对的`value`是该文件的所有内容，可序列化类型是`BytesWritable`，键值对的`key`无所谓，设置为`NullWritable`即可。然后再把键值对传给`map()`处理。

> **参考`TestInputFormat`类：**
>
> - 继承了`FileInputFormat`类
>
> - 重写了`createRecordReader`方法，这个方法就是用来 按行读取 文件内容，返回一个键值对为`<LongWritable, Text>`类型的`record`的。==因此，我们的自定义类也要重写该方法==。
>
>   ```java
>   public RecordReader<LongWritable, Text> createRecordReader(InputSplit split, TaskAttemptContext context) {
>       String delimiter = context.getConfiguration().get("textinputformat.record.delimiter");
>       byte[] recordDelimiterBytes = null;
>       if (null != delimiter) {
>           recordDelimiterBytes = delimiter.getBytes();
>       }
>       return new LineRecordReader(recordDelimiterBytes); //从这里可知是按行读取
>       //仿照LineRecordReader类定义我们自己的类
>   }
>   ```
>
> - 因为我们的案例要求不是按行读取的，而是一次性读取一个文件的所有内容，返回的`record`的键值对类型为`<NullWritable,BytesWritable>`，`value`是一个文件的所有内容。==因此我们要仿照LineRecordReader类定义我们自己的RecordReader类==。
>
> - 重写了`isSplitable()`方法，该方法是用来确定文件是否可以被切分成多个分片用多个`maptask`执行的。==因此，我们也要重写该方法，并且我们案例要求不可切分，方法内容为return false==。

> **Map阶段逻辑：**
>
> ​		输入到Map阶段的键值对的类型是`<NullWritable,BytesWritable>`，就是我们们自定义的`InputFormat`读取文件生成的`kv`对。
>
> ​		`map`阶段输出的键值对类型为`<Text,BytesWritable>`--》<文件名，文件内容> 

#### 步骤1：定义自己的RecordReader类

仿照`LineRecordReader`类，创建一个类并继承`RecordReader`类，该类是用来读取文件的。

```java
package com.jimmy.day04;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FSDataInputStream;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.BytesWritable;
import org.apache.hadoop.io.IOUtils;
import org.apache.hadoop.io.NullWritable;

import org.apache.hadoop.mapreduce.InputSplit;
import org.apache.hadoop.mapreduce.RecordReader;
import org.apache.hadoop.mapreduce.TaskAttemptContext;
import org.apache.hadoop.mapreduce.lib.input.FileSplit;

import java.io.File;
import java.io.IOException;

public class MyRecordReader extends RecordReader {
    //设定要读取的分片
    private FileSplit fsplit;

    private Configuration conf;

    //设定变量，用来保存当前value
    private BytesWritable valueBtw;

    //初始化
    @Override
    public void initialize(InputSplit inputSplit, TaskAttemptContext taskAttemptContext) throws IOException, InterruptedException {
        fsplit=(FileSplit)inputSplit;
        conf=taskAttemptContext.getConfiguration();
        valueBtw= new BytesWritable();
    }

    //标记一下分片有没有被读取，默认是false;
    private boolean flag=false;
    //该方法作用是：RecordReader读取分片时，先判断是否有下一个kv对，有则将kv读出来，且返回true，无就返回false
    @Override
    public boolean nextKeyValue() throws IOException, InterruptedException {
        if (!flag){
            //获取分片数据长度
            long len=fsplit.getLength();
            //新建数组存放分片数据
            byte[] contentArr=new byte[(int)len];
            //获取分片位置
            Path path=fsplit.getPath();
            //获取hdfs文件系统
            FileSystem fs=path.getFileSystem(conf);
            //创建输入流
            FSDataInputStream instream=fs.open(path);
            //读取分片所有内容,把输入流输出到contentArr里，从第0个位置开始，读取长度为分片数据的长度
            IOUtils.readFully(instream,contentArr,0,(int)len);
            //设定键值对的value
            valueBtw.set(contentArr,0,(int)len);
            //防止再次读取
            flag=true;
            return true;
        }
        return false;
    }

    //获取当前的key
    @Override
    public Object getCurrentKey() throws IOException, InterruptedException {
        return NullWritable.get();
    }java

    //获取当前的value
    @Override
    public Object getCurrentValue() throws IOException, InterruptedException {
        return valueBtw;
    }

    //返回读取进度
    @Override
    public float getProgress() throws IOException, InterruptedException {
        return flag ? 1.0f : 0.0f;
    }

    //释放资源
    @Override
    public void close() throws IOException {

    }
}
```

#### 步骤2：定义自己的MyInputFormat类

```Java
package com.jimmy.day04;

import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.BytesWritable;
import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.mapreduce.InputSplit;
import org.apache.hadoop.mapreduce.JobContext;
import org.apache.hadoop.mapreduce.RecordReader;
import org.apache.hadoop.mapreduce.TaskAttemptContext;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import java.io.IOException;

public class MyInputFormat extends FileInputFormat <NullWritable,BytesWritable>{
    @Override
    public RecordReader<NullWritable, BytesWritable> createRecordReader(InputSplit inputSplit, TaskAttemptContext taskAttemptContext) throws IOException, InterruptedException {
        //新建对象
        MyRecordReader mrr=new MyRecordReader();
        //初始化
        mrr.initialize(inputSplit,taskAttemptContext);
        return mrr;
    }
	
    //文件不可有多个分片
    @Override
    protected boolean isSplitable(JobContext context, Path filename) {
        return false;
    }
}
```

#### 步骤3：定义map逻辑

```Java
package com.jimmy.day04;

import org.apache.hadoop.io.BytesWritable;
import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.lib.input.FileSplit;

import java.io.IOException;

public class MyMap extends Mapper<NullWritable, BytesWritable, Text,BytesWritable> {
    /**
     *
     * @param key
     * @param value :小文件的全部内容
     * @param context
     * @throws IOException
     * @throws InterruptedException
     */
    @Override
    protected void map(NullWritable key, BytesWritable value, Context context) throws IOException, InterruptedException {
        //获取切片
        FileSplit inputsplit=(FileSplit)context.getInputSplit();
        //获取文件名
        String name=inputsplit.getPath().getName();
        //输出键值对
        context.write(new Text(name),value);
    }
}
```

#### 步骤4：定义组装类和main()方法

```java
package com.jimmy.day04;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.conf.Configured;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.BytesWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.lib.output.SequenceFileOutputFormat;
import org.apache.hadoop.util.Tool;
import org.apache.hadoop.util.ToolRunner;

public class Assem extends Configured implements Tool {
    @Override
    public int run(String[] args) throws Exception {

        Job job = Job.getInstance(super.getConf(), "mergeSmallFile");
        job.setInputFormatClass(MyInputFormat.class);
        MyInputFormat.addInputPath(job,new Path("file:///F://test3"));


        job.setMapperClass(MyMap.class);
        job.setMapOutputKeyClass(Text.class);
        job.setMapOutputValueClass(BytesWritable.class);

        //没有reduce。但是要设置reduce的输出的k3   value3 的类型
        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(BytesWritable.class);

        //将我们的文件输出成为sequenceFile这种格式
        job.setOutputFormatClass(SequenceFileOutputFormat.class);

        SequenceFileOutputFormat.setOutputPath(job,new Path("file:///F://test2//divoutput2"));

        boolean b = job.waitForCompletion(true);
        return b?0:1;
    }

    public static void main(String[] args) throws Exception {
        int run = ToolRunner.run(new Configuration(), new Assem(), args);
        Sysjavatem.exit(run);
    }

}
```

## Mapreduce--分区（shuffle)

#### 分区partition

我们来回顾一下`mapreduce`编程指导思想中的第三个步骤（`shuffle`阶段的分区）：

- 第三步：对输出的`key`，`value`对进行分区：相同`key`的数据发送到同一个`reduce task`里面去，相同`key`合并，`value`形成一个集合。（这个分区的**"区"**本质是`reduce task`，将键值对数据分配到不同的`reduce task`)。分区是`map`端的组件。


示意图如下：

![image-20200214050641052](hadoop.assets/image-20200214050641052.png)

**分区的个数是多少？怎么知道某个`key`的数据要进入到那个分区？**

在`mapreduce`当中有一个抽象类叫做`Partitioner`，默认使用的实现类是`HashPartitioner`，我们可以通过`HashPartitioner`的源码，查看到分区的逻辑。

```java
public class HashPartitioner<K, V> extends Partitioner<K, V> {
    public HashPartitioner() {
    }
	//获取某个key的数据要进入分区：
    public int getPartition(K key, V value, int numReduceTasks) {
        return (key.hashCode() & 2147483647) % numReduceTasks;
        //numReduceTasks是指reducetask的个数
    }
}
```

从源码可知，分区公式为`(key.hashCode() & 2147483647) % numReduceTasks`，即对`numReduceTasks`的大小求余数。

假如说 `numReduceTasks=4`，则`(key.hashCode() & 2147483647) % numReduceTasks`的计算结果可能为`0，1，2，3`，因此，有4个分区。所以可以看到，分区的个数跟`reduce task`的个数是相一致的（从分区的作用就可以推测）。

因为`key.hashCode()`的存在，所以用户没法控制哪些`key`的数据进入哪些分区。**但是我们可以定义自己的分区逻辑。**

![image-20200214143828718](hadoop.assets/image-20200214143828718.png)

#### 案例需求

基于手机流量数据，实现将不同的手机号的数据划分到不同的文件里面去

```
135开头的手机号分到一个文件里面去，
136开头的手机号分到一个文件里面去，
137开头的手机号分到一个文件里面去，
138开头的手机号分到一个文件里面去，
139开头的手机号分到一个文件里面去，
其他开头的手机号分到一个文件里面去
```

#### 案例分析

要将不同手机号数据分到不同文件去，实际上就是分区，将手机号数据分到不同的`reducetask`处理，然后生成不同的`part-r-`输出文件。分区等价于将结果输出到不同的`part-r-`文件。

因此，我们要定义自己分区器（分区类），根据不同开头的手机号返回不同的分区。

要使用我们定义的分区器，还要在`job`驱动中，将分区器设置为我们自己定义的。

又因为分区个数跟`reducetask`个数是一致的，所以要根据分区逻辑设置相应个数的`reducetask`。

#### 步骤1：定义自己的分区逻辑

```Java
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Partitioner;

public class PartitionOwn extends Partitioner<Text, FlowBean> {

    @Override
    public int getPartition(Text text, FlowBean flowBean, int numPartitions) {
        String phoenNum = text.toString();
        if(null != phoenNum && !phoenNum.equals("")){
            if(phoenNum.startsWith("135")){
                return 0;
            }else if(phoenNum.startsWith("136")){
                return 1;
            }else if(phoenNum.startsWith("137")){
                return 2;
            }else if(phoenNum.startsWith("138")){
                return 3;
            }else if(phoenNum.startsWith("139")){
                return 4;
            }else {
                return 5;
            }
        }else{
            return 5;
        }
    }
}
```

#### 步骤2：定义`bean`类型的可序列化类型

```Java
import org.apache.hadoop.io.Writable;
import java.io.DataInput;
import java.io.DataOutput;
import java.io.IOException;

public class FlowBean implements Writable {
    private Integer  upFlow;
    private Integer  downFlow;
    private Integer  upCountFlow;
    private Integer  downCountFlow;
    /**
     * 序列化方法
     * @param out
     * @throws IOException
     */
    @Override
    public void write(DataOutput out) throws IOException {
        out.writeInt(upFlow);
        out.writeInt(downFlow);
        out.writeInt(upCountFlow);
        out.writeInt(downCountFlow);
    }

    /**
     * 反序列化方法
     * @param in
     * @throws IOException
     */
    @Override
    public void readFields(DataInput in) throws IOException {
        this.upFlow= in.readInt();
        this.downFlow= in.readInt();
        this.upCountFlow = in.readInt();
        this.downCountFlow =  in.readInt();
    }


    public Integer getUpFlow() {
        return upFlow;
    }

    public void setUpFlow(Integer upFlow) {
        this.upFlow = upFlow;
    }

    public Integer getDownFlow() {
        return downFlow;
    }

    public void setDownFlow(Integer downFlow) {
        this.downFlow = downFlow;
    }

    public Integer getUpCountFlow() {
        return upCountFlow;
    }

    public void setUpCountFlow(Integer upCountFlow) {
        this.upCountFlow = upCountFlow;
    }

    public Integer getDownCountFlow() {
        return downCountFlow;
    }

    public void setDownCountFlow(Integer downCountFlow) {
        this.downCountFlow = downCountFlow;
    }

    @Override
    public String toString() {
        return "FlowBean{" +
                "upFlow=" + upFlow +
                ", downFlow=" + downFlow +
                ", upCountFlow=" + upCountFlow +
                ", downCountFlow=" + downCountFlow +
                '}';
    }
}
```

#### 步骤3：定义map逻辑

```Java
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

import java.io.IOException;

public class FlowMapper extends Mapper<LongWritable,Text,Text,FlowBean> {
    private FlowBean flowBean ;
    private Text text;

    @Override
    protected void setup(Context context) throws IOException, InterruptedException {
        flowBean = new FlowBean();
        text = new Text();
    }

    @Override
    protected void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException {
        String[] split = value.toString().split("\t");
        String phoneNum = split[1];
        String upFlow =split[6];
        String downFlow =split[7];
        String upCountFlow =split[8];
        String downCountFlow =split[9];
        text.set(phoneNum);
        flowBean.setUpFlow(Integer.parseInt(upFlow));
        flowBean.setDownFlow(Integer.parseInt(downFlow));
        flowBean.setUpCountFlow(Integer.parseInt(upCountFlow));
        flowBean.setDownCountFlow(Integer.parseInt(downCountFlow));
        context.write(text,flowBean);

    }
}
```

#### 步骤4：定义reduce逻辑

```Java
package com.jimmy.day05;

import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;

import java.io.IOException;

public class FlowReducer  extends Reducer<Text,FlowBean,Text,Text> {

    @Override
    protected void reduce(Text key, Iterable<FlowBean> values, Context context) throws IOException, InterruptedException {
        int upFlow = 0;
        int donwFlow = 0;
        int upCountFlow = 0;
        int downCountFlow = 0;
        for (FlowBean value : values) {
            upFlow += value.getUpFlow();
            donwFlow += value.getDownFlow();
            upCountFlow += value.getUpCountFlow();
            downCountFlow += value.getDownCountFlow();
        }
        context.write(key,new Text(upFlow +"\t" +  donwFlow + "\t" +  upCountFlow + "\t" + downCountFlow));
    }
}
```

#### 步骤5：创建组装类和定义main()方法

```Java
package com.jimmy.day05;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.conf.Configured;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.lib.input.TextInputFormat;
import org.apache.hadoop.mapreduce.lib.output.TextOutputFormat;
import org.apache.hadoop.util.Tool;
import org.apache.hadoop.util.ToolRunner;

public class FlowMain  extends Configured implements Tool {
    @Override
    public int run(String[] args) throws Exception {
        //获取job对象
        Job job = Job.getInstance(super.getConf(), "flowCount");
        //如果程序打包运行必须要设置这一句
        job.setJarByClass(FlowMain.class);

        job.setInputFormatClass(TextInputFormat.class);
        TextInputFormat.addInputPath(job,new Path(args[0]));

        job.setMapperClass(FlowMapper.class);
        job.setMapOutputKeyClass(Text.class);
        job.setMapOutputValueClass(FlowBean.class);

        //关键代码：
        //设置要使用的分区类，这里指定我们自己定义的：
        job.setPartitionerClass(PartitionOwn.class);
        //设置reducetTask的个数，默认值是1；
        job.setNumReduceTasks(Integer.parseInt(args[2]));

        job.setReducerClass(FlowReducer.class);
        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(Text.class);
        job.setOutputFormatClass(TextOutputFormat.class);

        TextOutputFormat.setOutputPath(job,new Path(args[1]));
        boolean b = job.waitForCompletion(true);
        return b?0:1;
    }


    public static void main(String[] args) throws Exception {
        Configuration configuration = new Configuration();
        configuration.set("mapreduce.framework.name","local");
        configuration.set("yarn.resourcemanager.hostname","local");

        int run = ToolRunner.run(configuration, new FlowMain(), args);
        System.exit(run);
    }

}
```

#### 步骤6：运行

打包`jar`包到集群运行：

```
hadoop jar original-MrNline-1.0-SNAPSHOT.jar com.jimmy.day05.FlowMain /parinput /paroutput 6
```

可以看到运行输出了6个`part-r`文件

![image-20200214150152804](hadoop.assets/image-20200214150152804.png)

#### 思考问题

如果`reducetask`的个数，跟分区逻辑设置的分区个数不一致，会怎么样？思考下列两个问题：

- 如果手动指定`6`个分区，`reduceTask`个数设置为`3`个会出现什么情况

- 如果手动指定`6`个分区，`reduceTask`个数设置为`9`个会出现什么情况

实验：设置不同的`reducetask`个数来运行`jar`包

```java
hadoop jar original-MrNline-1.0-SNAPSHOT.jar com.jimmy.day05.FlowMain /parinput /paroutput2 3
//出错了，证明reducetask的个数不能少于分区个数
    
//---------------------------------------------------------------------------  
    
hadoop jar original-MrNline-1.0-SNAPSHOT.jar com.jimmy.day05.FlowMain /parinput /paroutput3 9
//成功运行，证明reducetask的个数可以大于分区个数
//程序运行成功后，生成了9个part-r-文件，但是part-r-00006到part-r-00008这三个文件，没有任何内容，为空。原因是分区个数小于reducetask个数时，有三个reducetask是不需要处理任何数据的，没有数据传进到那三个reducetask。
//因此，设置过多reducetask没有必要
```

#### ReduceTask并行度对Job执行的影响

`ReduceTask`的并行度个数会影响整个`Job`的执行并发度和执行效率，但与`MapTask`的并发数由切片数决定不同，`ReduceTask`数量的决定是可以直接手动设置：

```Java
// 默认值是1，手动设置为4
job.setNumReduceTasks(4);
```

下面有个实验：测试`ReduceTask`多少合适

（1）实验环境：`1`个`Master`节点，`16`个`Slave`节点：`CPU:8GHZ`，内存: `2G`,（数据量为`1GB`）

（2）实验结论：从下表可知道，`reducetask`不能太多，得不偿失，也不能太少，效率会较低下。

| **MapTask   =16** |      |      |      |      |      |      |      |      |      |      |
| ----------------- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| `ReduceTask`      | 1    | 5    | 10   | 15   | 16   | 20   | 25   | 30   | 45   | 60   |
| 总时间            | 892  | 146  | 110  | 92   | 88   | 100  | 128  | 101  | 145  | 104  |

## Mapreduce--排序（shuffle）

#### 排序

排序是`MapReduce`框架中最重要的操作之一。

**`MapTask`和`ReduceTask`均会对数据按照`key`进行排序。该操作属于`Hadoop`的默认行为。任何应用程序中的数据均会被排序，而不管逻辑上是否需要。**

默认排序是按照字典顺序排序，且实现该排序的方法是快速排序。

对于`MapTask`，它会将处理的结果暂时放到环形缓冲区中，当环形缓冲区使用率达到一定阈值后，再对缓冲区中的数据进行一次快速排序，并将这些有序数据溢写到磁盘上，而当数据处理完毕后，它会对磁盘上所有文件进行归并排序。

对于`ReduceTask`，它从每个`MapTask`上远程拷贝相应的数据文件，如果文件大小超过一定阈值，则溢写磁盘上，否则存储在内存中。如果磁盘上文件数目达到一定阈值，则进行一次归并排序以生成一个更大文件；如果内存中文件大小或者数目超过一定阈值，则进行一次合并后将数据溢写到磁盘上。当所有数据拷贝完毕后，`ReduceTask`统一对内存和磁盘上的所有数据进行一次归并排序。

#### 排序分类：

**1、部分排序**

`MapReduce`根据输入记录的键对数据集排序。保证输出的每个文件内部有序

 ![image-20200214155835465](hadoop.assets/image-20200214155835465.png)

**2、全排序**

最终输出结果只有一个文件，且文件内部有序。实现方式是只设置一个`ReduceTask`。但该方法在处理大型文件时效率极低，因为一台机器处理所有文件，完全丧失了`MapReduce`所提供的并行架构

 ![image-20200214160134203](hadoop.assets/image-20200214160134203.png)

**3、利用分区器实现全部排序**

![image-20200214160628304](hadoop.assets/image-20200214160628304.png)

**4、辅助排序**

在`Reduce`端对`key`进行分组。应用于：在接收的`key`为`bean`对象时，想让一个或几个字段相同（全部字段比较不相同）的`key`进入到同一个`reduce`方法时，可以采用分组排序。

**5、二次排序**

先按照`key`中的某个属性（值）进行排序，再按照`key`中的另一个属性（值）进行排序，这个叫二次排序。在自定义排序过程中，如果`compareTo`中的判断条件为两个即为二次排序。

####  案例需求

在前面的序列化当中在数据输出的时候，我们对上行流量，下行流量，上行总流量，下行总流量进行了汇总，汇总结果如下：

```Java
//手机号	上行流量 下行流量	上行总流量	下行总流量
13480253104	3	3	180	180
13502468823	57	102	7335	110349
13560439658	33	24	2034	5892
13600217502	18	138	1080	186852
13602846565	15	12	1938	2910
13660577991	24	9	6960	690
13719199419	4	0	240	0
13726230503	24	27	2481	24681
13760778710	2	2	120	120
13823070001	6	3	360	180
13826544101	4	0	264	0
13922314466	12	12	3008	3720
13925057413	69	63	11058	48243
13926251106	4	0	240	0
13926435656	2	4	132	1512
15013685858	28	27	3659	3538
15920133257	20	20	3156	2936
15989002119	3	3	1938	180
18211575961	15	12	1527	2106
18320173382	21	18	9531	2412
84138413	20	16	4116	1432
```

在上面的数据基础上，我们需要对下行流量，以及上行总流量进行排序，如果下行流量相等就按照上行总流量进行排序**（二次排序）**。

#### 步骤1：定义可序列化的java bean类

把手机手机号、上行流量、下行流量、上行总流量、下行总流量这5个数据封装到一个`Java bean`类中，该类要实现`WritableComparable`接口，表示既是可序列的，又是可排序的。实现该接口后，要重写`compareTo()`方法，用于排序。

```Java
import org.apache.hadoop.io.WritableComparable;
import java.io.DataInput;
import java.io.DataOutput;
import java.io.IOException;

//Writable表示可序列化，Comparable表示可排序
public class FlowSortBean implements WritableComparable<FlowSortBean> {
    private String phone;
    private Integer  upFlow;
    private Integer  downFlow;
    private Integer  upCountFlow;
    private Integer  downCountFlow;


    //重写compareTo方法，用于排序
    @Override
    public int compareTo(FlowSortBean o) {
        int i = this.downCountFlow.compareTo(o.downCountFlow);
        if(i == 0){
            //升序：
            i = this.upCountFlow.compareTo(o.upCountFlow);
            //降序：
            //i = -this.upCountFlow.compareTo(o.upCountFlow);
        }
        return i;
    }

    @Override
    public void write(DataOutput out) throws IOException {
        out.writeUTF(phone);
        out.writeInt(upFlow);
        out.writeInt(downFlow);
        out.writeInt(upCountFlow);
        out.writeInt(downCountFlow);

    }

    @Override
    public void readFields(DataInput in) throws IOException {
        this.phone = in.readUTF();
        this.upFlow= in.readInt();
        this.downFlow= in.readInt();
        this.upCountFlow = in.readInt();
        this.downCountFlow =  in.readInt();

    }

    @Override
    public String toString() {
        return  phone + "\t" + upFlow + "\t" +downFlow + "\t" + upCountFlow + "\t" + downCountFlow ;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Integer getUpFlow() {
        return upFlow;
    }

    public void setUpFlow(Integer upFlow) {
        this.upFlow = upFlow;
    }

    public Integer getDownFlow() {
        return downFlow;
    }

    public void setDownFlow(Integer downFlow) {
        this.downFlow = downFlow;
    }

    public Integer getUpCountFlow() {
        return upCountFlow;
    }

    public void setUpCountFlow(Integer upCountFlow) {
        this.upCountFlow = upCountFlow;
    }

    public Integer getDownCountFlow() {
        return downCountFlow;
    }

    public void setDownCountFlow(Integer downCountFlow) {
        this.downCountFlow = downCountFlow;
    }
}
```

#### 步骤2：定义map逻辑

```java
package com.jimmy.day06;

import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

import java.io.IOException;

/**
 * LongWritable：行偏移量
 * Text： 一行的内容
 * FlowSortBean：封装了手机号等5个数据的自己定义的类的对象
 * NullWritable：无
 */
public class FlowSortMapper extends Mapper<LongWritable,Text,FlowSortBean, NullWritable> {

    private FlowSortBean flowSortBean;

    //初始化：
    @Override
    protected void setup(Context context) throws IOException, InterruptedException {
        flowSortBean = new FlowSortBean();
    }

    @Override
    protected void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException {
        String[] split = value.toString().split("\t");
        flowSortBean.setPhone(split[0]);
        flowSortBean.setUpFlow(Integer.parseInt(split[1]));
        flowSortBean.setDownFlow(Integer.parseInt(split[2]));
        flowSortBean.setUpCountFlow(Integer.parseInt(split[3]));
        flowSortBean.setDownCountFlow(Integer.parseInt(split[4]));
        context.write(flowSortBean,NullWritable.get());

    }
}
```

#### 步骤3：定义reduce逻辑

```Java
package com.jimmy.day06;

import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.mapreduce.Reducer;
import java.io.IOException;

public class FlowSortReducer extends Reducer<FlowSortBean, NullWritable,FlowSortBean,NullWritable> {

    @Override
    protected void reduce(FlowSortBean key, Iterable<NullWritable> values, Context context) throws IOException, InterruptedException {
       context.write(key, NullWritable.get());

    }
}
```

#### 步骤4：定义组装类和main()方法

```Java
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.conf.Configured;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.lib.input.TextInputFormat;
import org.apache.hadoop.mapreduce.lib.output.TextOutputFormat;
import org.apache.hadoop.util.Tool;
import org.apache.hadoop.util.ToolRunner;

public class FlowSortMain extends Configured implements Tool {
    @Override
    public int run(String[] args) throws Exception {
        //获取job对象
        Job job = Job.getInstance(super.getConf(), "flowSort");
        //如果程序打包运行必须要设置这一句
        job.setJarByClass(FlowSortMain.class);
        job.setInputFormatClass(TextInputFormat.class);
        TextInputFormat.addInputPath(job,new Path("file:///F://test3//"));

        job.setMapperClass(FlowSortMapper.class);
        job.setMapOutputKeyClass(FlowSortBean.class);
        job.setMapOutputValueClass(NullWritable.class);

        job.setReducerClass(FlowSortReducer.class);
        job.setOutputKeyClass(FlowSortBean.class);
        job.setOutputValueClass(NullWritable.class);

        job.setOutputFormatClass(TextOutputFormat.class);
        TextOutputFormat.setOutputPath(job,new Path("file:///F://test2//sortoutput"));
        boolean b = job.waitForCompletion(true);

        return b?0:1;
    }


    public static void main(String[] args) throws Exception {
        Configuration configuration = new Configuration();
        int run = ToolRunner.run(configuration, new FlowSortMain(), args);
        System.exit(run);
    }

}
```

#### 运行输出结果

```java
13719199419	4	0	240	0
13826544101	4	0	264	0
13760778710	2	2	120	120
13480253104	3	3	180	180
13823070001	6	3	360	180
15989002119	3	3	1938	180
13660577991	24	9	6960	690
84138413	20	16	4116	1432
13926435656	2	4	132	1512
18211575961	15	12	1527	2106
18320173382	21	18	9531	2412
13602846565	15	12	1938	2910
15920133257	20	20	3156	2936
15013685858	28	27	3659	3538
13922314466	12	12	3008	3720
13560439658	33	24	2034	5892
13726230503	24	27	2481	24681
13925057413	69	63	11058	48243
13502468823	57	102	7335	110349
13600217502	18	138	1080	186852
```



## Mapreduce--规约（shuffle）

#### Conbiner规约

- `Combiner`是`MR`程序中`Mapper`和`Reducer`之外的一种组件。
- `Combiner`本质上是一个`reduce`，因为它的父类是`Reducer`。
- `Combiner`和`Reducer`的区别在于运行的位置
  - `Combiner`是在每一个`maptask`所在的节点运行
  - `Reducer`是接收全局所有`mapper`的输出结果
- `combiner`的作用是对每一个`maptask`的输出进行局部合并汇总，以减少网络传输量
- `combiner`能够应用的前提是不能影响最终的业务逻辑，而且`Combiner`的输出`kv`对要跟`Reducer`的输入`kv`对的类型对应起来。

**规约效果示意图（以词频统计为例）：**

![image-20200214174518065](hadoop.assets/image-20200214174518065.png)

如果没有规约的处理阶段，将是下面的情形：

![image-20200214174722238](hadoop.assets/image-20200214174722238.png)

#### 案例需求

对于我们前面的`wordCount`单词计数统计，我们加上`Combiner`过程，实现`map`端的数据进行汇总之后，再发送到`reduce`端，减少数据的网络拷贝。

#### 步骤1：自定义Combiner类

```Java
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;
import java.io.IOException;

public class MyCombiner extends Reducer<Text, IntWritable,Text,IntWritable> {

    @Override
    protected void reduce(Text key, Iterable<IntWritable> values, Context context) throws IOException, InterruptedException {
        //合并求和：
        int sum=0;
        for (IntWritable value:values){
            sum+=value.get();
        }
        context.write(key,new IntWritable(sum));
    }
}
```

#### 步骤2：自定义map逻辑

```Java
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;
import java.io.IOException;


public class MyMap extends Mapper<LongWritable,Text,Text,IntWritable> {
    Text text = new Text();
    IntWritable intW = new IntWritable(1);

    @Override
    protected void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException {
        String line = value.toString();
        String[] split = line.split(",");
        for (String word : split) {
            text.set(word);
            context.write(text,intW);
        }
    }
}
```

#### 步骤3：自定义reduce逻辑

```Java
package com.jimmy.day07;

import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;

import java.io.IOException;
public class MyReduce extends Reducer<Text,IntWritable,Text,IntWritable> {

    @Override
    protected void reduce(Text key, Iterable<IntWritable> values, Context context) throws IOException, InterruptedException {
        int result = 0;
        for (IntWritable value : values) {
            result += value.get();
        }
        IntWritable intWritable = new IntWritable(result);
        context.write(key,intWritable);
    }
}
```

#### 步骤4：定义组装类和main()方法

```Java
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.conf.Configured;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.lib.input.TextInputFormat;
import org.apache.hadoop.mapreduce.lib.output.TextOutputFormat;
import org.apache.hadoop.util.Tool;
import org.apache.hadoop.util.ToolRunner;

public class Assem extends Configured implements Tool{

    @Override
    public int run(String[] args) throws Exception {
        Configuration conf = super.getConf();
        Job job = Job.getInstance(conf, "mrdemo1");

        job.setJarByClass(Assem.class);

        job.setInputFormatClass(TextInputFormat.class);
        TextInputFormat.addInputPath(job,new Path("file:///F://test3//"));

        job.setMapperClass(MyMap.class);
        job.setMapOutputKeyClass(Text.class);
        job.setMapOutputValueClass(IntWritable.class);

        //设定规约类为自己定义的类
        job.setCombinerClass(MyCombiner.class);


        job.setReducerClass(MyReduce.class);
        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(IntWritable.class);

        job.setOutputFormatClass(TextOutputFormat.class);
        TextOutputFormat.setOutputPath(job,new Path("file:///F://test2//outr"));

        boolean b = job.waitForCompletion(true);
        return b?0:1;

    }

    public static void main(String[] args) throws Exception {
        Configuration conf=new Configuration();
        int exitCode= ToolRunner.run(conf,new Assem(),args);
    }

}
```

#### 运行结果

部分运行输出信息如下：

![image-20200214195953985](hadoop.assets/image-20200214195953985.png)

从上图可以看出，规约前`record`键值对的个数是`1132702`，规约后输出的`record`键值对个数为`73`，极大地减少了要传输地键值对数，减少了网络传输。



## Mapreduce--分组（shuffle）

`GroupingComparator`是`mapreduce`当中**`reduce`端的一个功能组件**，主要的作用是决定哪些数据作为一组，调用一次`reduce`的逻辑**，默认是每个不同的`key`，作为多个不同的组**，每个组调用一次`reduce`逻辑，我们可以自定义`GroupingComparator`实现不同的`key`作为同一个组，调用一次`reduce`逻辑。

注意：这里说的是每个组调用一次`reduce`逻辑，可以理解为调用一次`reduc()`方法，但不要理解为一个`reducetask`。

**分组示意图：**

![image-20200214214852712](hadoop.assets/image-20200214214852712.png)

#### 案例需求

现在有订单数据如下：

| 订单id        | 商品id | 成交金额 |
| ------------- | ------ | -------- |
| Order_0000001 | Pdt_01 | 222.8    |
| Order_0000001 | Pdt_05 | 25.8     |
| Order_0000002 | Pdt_03 | 522.8    |
| Order_0000002 | Pdt_04 | 122.4    |
| Order_0000002 | Pdt_05 | 722.4    |
| Order_0000003 | Pdt_01 | 222.8    |

现在需要求取**每个订单**当中金额最大的商品`id`。(不是所有订单）

#### 案例分析

![image-20200214223131951](hadoop.assets/image-20200214223131951.png)

#### 步骤1：创建可序列化可排序的Java bean类

该类是用来封装订单`id`、商品`id`、成交金额这三个数据的。

```Java
package com.jimmy.day08;

import org.apache.hadoop.io.WritableComparable;

import java.io.DataInput;
import java.io.DataOutput;
import java.io.IOException;

public class OrderBean implements WritableComparable<OrderBean> {

    private String orderId;
    private Double price ;
    private String productId;

    @Override
    public int compareTo(OrderBean o) {
        //注意：如果是不同的订单之间，金额不需要排序，没有可比性
        int orderIdCompare = this.orderId.compareTo(o.orderId);
        if(orderIdCompare == 0){
            //比较金额，按照金额进行排序
            int priceCompare = this.price.compareTo(o.price);
            return -priceCompare;
        }else{
            //如果订单号不同，没有可比性，直接返回订单号的排序即可
            return orderIdCompare;
        }

    }

    /**
     * 序列化方法
     * @param out
     * @throws IOException
     */
    @Override
    public void write(DataOutput out) throws IOException {
        out.writeUTF(orderId);
        out.writeUTF(productId);
        out.writeDouble(price);

    }

    /**
     * 反序列化方法
     * @param in
     * @throws IOException
     */
    @Override
    public void readFields(DataInput in) throws IOException {
        this.orderId = in.readUTF();
        this.productId=in.readUTF();
        this.price = in.readDouble();

    }


    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    @Override
    public String toString() {
        return (orderId + "\t" +  productId + "\t" + price);
    }
}

```

#### 步骤2：定义自己的分区类

定义分区类，使用`orderId`作为分区的条件，保证相同的`orderId`进入到同一个`reduceTask`里面去。

这里要注意：虽然进行分区后能够保证相同`orderId`的数据进入到同一个`reduceTask`里面去，但是不能保证一个`reduceTask`里只有一种`orderId`的数据，有可能有不同`orderId`的数据。

因此，进行分区后，还要需要定义我们自己的分组类，使`orderId`相同的数据调用一次`reduce()`方法。

```Java
package com.jimmy.day08;

import org.apache.hadoop.io.DoubleWritable;
import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.mapreduce.Partitioner;

public class GroupPartition extends Partitioner<OrderBean, NullWritable> {
    @Override
    public int getPartition(OrderBean orderBean, NullWritable nullw, int numReduceTasks) {
        //(key.hashCode() & Integer.MAX_VALUE) % numReduceTasks;

        //注意这里：使用orderId作为分区的条件，来进行判断，保证相同的orderId进入到同一个reduceTask里面去
        return (orderBean.getOrderId().hashCode() & Integer.MAX_VALUE) % numReduceTasks;
    }
}

```

#### 步骤3：定义自己的分组类

该类要继承`WritableComparator`接口，表示可序列化和可比较的。重写`compare()`方法

```java
package com.jimmy.day08;

import org.apache.hadoop.io.WritableComparable;
import org.apache.hadoop.io.WritableComparator;

import java.util.SortedMap;

/**
 * 第六步：自定义分组逻辑
 * Writable表示可序列化，Comparator表示可比较
 */
public class MyGroup extends WritableComparator {

    /**
     * 覆写默认构造器，通过反射，构造OrderBean对象
     * 通过反射来构造OrderBean对象
     * 接受到的key2  是orderBean类型，我们就需要告诉分组，以OrderBean接受我们的参数
     */
    public MyGroup(){
        //调用父类WritableComparator的有参构造方法，得到一个OrderBean对象
        super(OrderBean.class,true);
    }

    /**
     * compare方法接受到两个参数，这两个参数其实就是我们前面传过来的OrderBean
     * @param a
     * @param b
     * @return
     */
    @Override
    public int compare(WritableComparable a, WritableComparable b) {
        //类型强转：
        OrderBean first = (OrderBean) a;
        OrderBean second = (OrderBean) b;

        //以orderId作为比较条件，判断哪些orderid相同作为同一组
        return first.getOrderId().compareTo(second.getOrderId());
    }
}

```

#### 步骤4：自定义map逻辑

```Java
package com.jimmy.day08;

import org.apache.hadoop.io.DoubleWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

import java.io.IOException;

public class GroupMapper extends Mapper<LongWritable,Text,OrderBean,NullWritable> {

    @Override
    protected void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException {
        String[] split = value.toString().split("\t");
        OrderBean odb = new OrderBean();
        odb.setOrderId(split[0]);
        odb.setProductId(split[1]);
        odb.setPrice(Double.valueOf(split[2]));
        context.write(odb, NullWritable.get());
    }
}

```

#### 步骤5：自定义reduce逻辑

```Java
package com.jimmy.day08;

import org.apache.hadoop.io.DoubleWritable;
import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;

import java.io.IOException;

public class GroupReducer extends Reducer<OrderBean,NullWritable, Text,NullWritable> {

    @Override
    protected void reduce(OrderBean key, Iterable<NullWritable> values, Context context) throws IOException, InterruptedException {
        Text text=new Text();
        text.set(key.getProductId());
        context.write(text,NullWritable.get());
    }
}
```

####  步骤6：定义组装类和Main方法

```Java
package com.jimmy.day08;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.conf.Configured;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.DoubleWritable;
import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.lib.input.TextInputFormat;
import org.apache.hadoop.mapreduce.lib.output.TextOutputFormat;
import org.apache.hadoop.util.Tool;
import org.apache.hadoop.util.ToolRunner;

public class GroupMain extends Configured implements Tool {
    @Override
    public int run(String[] args) throws Exception {
        //获取job对象
        Job job = Job.getInstance(super.getConf(), "group");
        //第一步：读取文件，解析成为key，value对
        job.setInputFormatClass(TextInputFormat.class);
        TextInputFormat.addInputPath(job,new Path("file:///F://test4//"));

        //第二步：自定义map逻辑
        job.setMapperClass(GroupMapper.class);
        job.setMapOutputKeyClass(OrderBean.class);
        job.setMapOutputValueClass(NullWritable.class);

        //第三步：分区
        job.setPartitionerClass(GroupPartition.class);

        //第四步：排序  已经做了

        //第五步：规约  combiner  省掉

        //第六步：分组   自定义分组逻辑
        job.setGroupingComparatorClass(MyGroup.class);

        //第七步：设置reduce逻辑
        job.setReducerClass(GroupReducer.class);
        job.setOutputKeyClass(OrderBean.class);
        job.setOutputValueClass(NullWritable.class);

        //第八步：设置输出路径
        job.setOutputFormatClass(TextOutputFormat.class);
        TextOutputFormat.setOutputPath(job,new Path("file:///F://test2//groupoutput"));


        boolean b = job.waitForCompletion(true);


        return b?0:1;
    }

    public static void main(String[] args) throws Exception {
        Configuration configuration = new Configuration();
        int run = ToolRunner.run(new Configuration(), new GroupMain(), args);
        System.exit(run);
    }

}
```

#### 案例拓展：

**如何求每个分组（根据orderId分组）当中的top2的订单等信息？？？**

输出格式：

```
Order_0000001	Pdt_01	222.8	222.8
Order_0000001	Pdt_05	25.8	25.8
Order_0000002	Pdt_05	822.4	822.4
Order_0000002	Pdt_04	522.4	522.4
```

##### 修改map逻辑

```java
package com.jimmy.day09;

import org.apache.hadoop.io.DoubleWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

import java.io.IOException;

public class MyMap extends Mapper<LongWritable,Text, OrderBean, DoubleWritable> {

    @Override
    protected void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException {
        String[] split = value.toString().split("\t");
        OrderBean odb = new OrderBean();
        odb.setOrderId(split[0]);
        odb.setProductId(split[1]);
        odb.setPrice(Double.valueOf(split[2]));

        //输出kv对：(orderBean , price)
        context.write(odb, new DoubleWritable(Double.valueOf(split[2])));
    }
}
```

##### 修改reduce逻辑

```Java
package com.jimmy.day09;

import org.apache.hadoop.io.DoubleWritable;
import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;

import java.io.IOException;

public class MyReduce extends Reducer<OrderBean, DoubleWritable, OrderBean,DoubleWritable> {

    @Override
    protected void reduce(OrderBean key, Iterable<DoubleWritable> values, Context context) throws IOException, InterruptedException {
        //需要对我们集合只输出两个值
        int i = 0;
        for (DoubleWritable value : values) {
            if(i<2){
                context.write(key,value);
                i ++;
            }else{
                break;
            }
        }
    }
}
```

##### 修改分区逻辑

```Java
package com.jimmy.day09;

import org.apache.hadoop.io.DoubleWritable;
import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.mapreduce.Partitioner;

public class MyPartition extends Partitioner<OrderBean, DoubleWritable> {
    @Override
    public int getPartition(OrderBean orderBean, DoubleWritable dw, int numReduceTasks) {
        //(key.hashCode() & Integer.MAX_VALUE) % numReduceTasks;

        //注意这里：使用orderId作为分区的条件，来进行判断，保证相同的orderId进入到同一个reduceTask里面去
        return (orderBean.getOrderId().hashCode() & Integer.MAX_VALUE) % numReduceTasks;
    }
}
```

##### 修改组装类

```Java
package com.jimmy.day09;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.conf.Configured;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.DoubleWritable;
import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.lib.input.TextInputFormat;
import org.apache.hadoop.mapreduce.lib.output.TextOutputFormat;
import org.apache.hadoop.util.Tool;
import org.apache.hadoop.util.ToolRunner;

public class RunClass extends Configured implements Tool {
    @Override
    public int run(String[] args) throws Exception {
        //获取job对象
        Job job = Job.getInstance(super.getConf(), "group");
        //第一步：读取文件，解析成为key，value对
        job.setInputFormatClass(TextInputFormat.class);
        TextInputFormat.addInputPath(job,new Path("file:///F://test4//"));

        //第二步：自定义map逻辑
        job.setMapperClass(MyMap.class);
        job.setMapOutputKeyClass(OrderBean.class);
        job.setMapOutputValueClass(DoubleWritable.class);

        //第三步：分区
        job.setPartitionerClass(MyPartition.class);

        //第四步：排序  已经做了

        //第五步：规约  combiner  省掉

        //第六步：分组   自定义分组逻辑
        job.setGroupingComparatorClass(MyGroup.class);

        //第七步：设置reduce逻辑
        job.setReducerClass(MyReduce.class);
        job.setOutputKeyClass(OrderBean.class);
        job.setOutputValueClass(DoubleWritable.class);

        //第八步：设置输出路径
        job.setOutputFormatClass(TextOutputFormat.class);
        TextOutputFormat.setOutputPath(job,new Path("file:///F://test2//groupoutput4"));


        boolean b = job.waitForCompletion(true);


        return b?0:1;
    }

    public static void main(String[] args) throws Exception {
        Configuration configuration = new Configuration();
        int run = ToolRunner.run(new Configuration(), new RunClass(), args);
        System.exit(run);
    }

}
```

## 自定义OutputFormat类

思考一个问题：我们前面编程的时候可以发现，一个`reducetask`默认会把结果输出到一个文件。那如果我们想要**让一个`reducetask`的结果分类输出到不同文件中**，要怎么实现，我们可以通过自定义`outputformat`类来解决。

#### 案例需求

现在有一些订单的评论数据，需求，将**订单的好评与其他评论（中评、差评）进行区分开来，将最终的数据分开到不同的文件夹下面**去，数据内容参见资料文件夹，其中数据第十个字段表示好评，中评，差评。**0：好评**，1：中评，2：差评

**部分数据如下：**

```sh
1	2018-03-15 22:29:06	2018-03-15 22:29:06	我想再来一个	\N	1	3	hello	来就来吧	0	2018-03-14 22:29:03
2	2018-03-15 22:42:08	2018-03-15 22:42:08	好的	\N	1	1	添加一个吧	说走咱就走啊	0	2018-03-14 22:42:04
3	2018-03-15 22:55:21	2018-03-15 22:55:21	haobuhao	\N	1	1	nihao		0	2018-03-24 22:55:17
4	2018-03-23 11:15:28	2018-03-23 11:15:28	店家很好 非常好	\N	1	3	666	谢谢	0	2018-03-23 11:15:20
5	2018-03-23 14:52:48	2018-03-23 14:53:22	a'da'd	\N	0	4	da'd's	打打操作	0	2018-03-22 14:52:42
6	2018-03-23 14:53:52	2018-03-23 14:53:52	达到	\N	1	4	1313	13132131	0	2018-03-07 14:30:38
7	2018-03-23 14:54:29	2018-03-23 14:54:29	321313	\N	1	4	111	1231231	1	2018-03-06 14:54:24
```

#### 案例分析

要将订单数据根据评论分类输出到不同的文件中，有两种做法：

1. 第一种方法：设置`reducetask`个数为`2`，将好评订单数据与其它评论的订单数据通过分区输出到两个不同的`reducetask`，然后就可以输出不同文件了
2. 第二种方法：使用一个`reducetask`即可，通过自定义`outputformat`即可分类输出数据到不同文件。
3. 这两种方法的效果是一样的。我们来演示一下第二种方法。

#### 步骤1：自定义OutputFormat类

```Java
package com.jimmy.day10;

import org.apache.hadoop.fs.FSDataOutputStream;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.RecordWriter;
import org.apache.hadoop.mapreduce.TaskAttemptContext;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

import java.io.IOException;

//outputformat类的泛型要跟reduce的输出泛型相一致
//Text:订单数据
//NullWritable：无
public class MyOutputFormat extends FileOutputFormat<Text, NullWritable> {
    //重写getRecordWriter()方法，用来获取我们自己定义的RecordWriter
    @Override
    public RecordWriter<Text, NullWritable> getRecordWriter(TaskAttemptContext taskAttemptContext) throws IOException, InterruptedException {
        //创建hdfs文件系统对象
        FileSystem fs=FileSystem.get(taskAttemptContext.getConfiguration());
        //创建两个输出流
        Path goodPath=new Path("file:///F://test2//myof//good.txt");
        Path badPath=new Path("file:///F://test2//myof//bad.txt");
        FSDataOutputStream goodStream=fs.create(goodPath);
        FSDataOutputStream badStream=fs.create(badPath);
        //返回一个RecordWriter
        return new MyRecordWriter(goodStream,badStream);
    }
}
```

#### 步骤2：定义RecordWriter类

```Java
package com.jimmy.day10;

import org.apache.hadoop.fs.FSDataOutputStream;
import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.RecordWriter;
import org.apache.hadoop.mapreduce.TaskAttemptContext;

import java.io.IOException;

//该类的泛型要跟MyOutputFormat的泛型一致
public class MyRecordWriter extends RecordWriter<Text, NullWritable> {
    //创建两个输入流：
    private FSDataOutputStream goodStream=null;
    private FSDataOutputStream badStream=null;
    //创建有参构造方法，传入两个输出流
    public MyRecordWriter(FSDataOutputStream goodStream,FSDataOutputStream badStream){
        this.goodStream=goodStream;
        this.badStream=badStream;
    }
    //重写write方法，text是当前行内容
    @Override
    public void write(Text text, NullWritable nullWritable) throws IOException, InterruptedException {
        if(text.toString().split("\t")[9].equals("0")){
            goodStream.write(text.toString().getBytes());
            goodStream.write("\r\n".getBytes());
        }else{
            badStream.write(text.toString().getBytes());
            badStream.write("\r\n".getBytes());
        }
    }

    //释放资源
    @Override
    public void close(TaskAttemptContext taskAttemptContext) throws IOException, InterruptedException {
        if(badStream !=null){ //badStream初始值为null,如果这里badStream不为null,证明流已经开启，关闭流
            badStream.close();
        }
        if (goodStream != null) {
            goodStream.close();
        }
    }
}
```

#### 步骤3：定义map逻辑

```Java
package com.jimmy.day10;

import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

import java.io.IOException;

public class MyMap extends Mapper<LongWritable, Text,Text, NullWritable> {
    Text kout=new Text();
    @Override
    protected void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException {
        kout=value;
        context.write(kout,NullWritable.get());
    }
}
```

#### 步骤4：定义reduce逻辑

```Java
package com.jimmy.day10;

import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;

import java.io.IOException;

public class MyReduce extends Reducer<Text, NullWritable,Text,NullWritable> {
    @Override
    protected void reduce(Text key, Iterable<NullWritable> values, Context context) throws IOException, InterruptedException {
        context.write(key,NullWritable.get());
    }
}
```

#### 步骤5：定义组装类和main()方法

```Java
package com.jimmy.day10;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.conf.Configured;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.lib.input.TextInputFormat;
import org.apache.hadoop.util.Tool;
import org.apache.hadoop.util.ToolRunner;

public class Assem extends Configured implements Tool {

    @Override
    public int run(String[] args) throws Exception {
        //获取Hadoop配置对象
        Configuration conf = super.getConf();
        //获取job实例
        Job job = Job.getInstance(conf, "MyOutputFormat");
        //设置jar包打包
        job.setJarByClass(Assem.class);
        //设置输入类：
        job.setInputFormatClass(TextInputFormat.class);
        //设置输入路径
        TextInputFormat.addInputPath(job, new Path("file:///F://test5"));
        //设置mapper类
        job.setMapperClass(MyMap.class);
        //设置mapper类输出的kv对类型
        job.setMapOutputKeyClass(Text.class);
        job.setMapOutputValueClass(NullWritable.class);
        //设置输出类：
        job.setOutputFormatClass(MyOutputFormat.class);
        //设置输出路径:
        MyOutputFormat.setOutputPath(job, new Path("file:///F://test2//myof"));
        //设置要使用的Reducer类
        job.setReducerClass(MyReduce.class);
        // 设置reduce输出的kv对类型：
        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(NullWritable.class);

        //获取事务的信息
        //true表示将运行进度等信息及时输出给用户，false的话只是等待作业结束
        boolean a = job.waitForCompletion(true);
        return a ? 0 : 1;
    }
    //定义main方法
    public static void main(String[] args) throws Exception {
        Configuration conf=new Configuration();
        int exitCode= ToolRunner.run(conf,new Assem(),args);
        System.exit(exitCode);
    }
}
```

#### 运行结果：

![image-20200215121359595](hadoop.assets/image-20200215121359595.png)

## MapTask工作机制（重点）

![image-20200215162509280](hadoop.assets/image-20200215162509280.png)

![image-20200215125724100](hadoop.assets/image-20200215125724100.png)

**Read阶段--》Map阶段--》Collect阶段--》spill阶段--》Combine阶段**

#### Read阶段

有个文件`hello.txt`大小为`200M`，客户端首先获取待处理文件信息，然后根据参数配置，形成一个任务分配的规划。

再调用`submit()`方法，把要执行的`jar`包、`Job.xml`(`Job`信息)、`Job.split`（分片信息）等提交到hdfs集群。

然后把程序提交到`yarn`集群运行，yarn会生成一个`MrAppMaster`（一个进程），用来控制`maptask`和`reducetask`的启动。因为分片信息已经提交到`hdfs`集群，那`MrAppMaster`就会去获取分片信息，计算出`Maptask`数量。`MapTask`通过用户编写的`RecordReader`，从输入`InputSplit`中解析出一个个`key/value`。

#### Map阶段

该节点主要是将解析出的`key/value`交给用户编写`map()`函数处理，并产生一系列新的`key/value`。

#### Collect收集阶段

在用户编写`map()`函数中，当数据处理完成后，一般会调用`OutputCollector.collect()`输出结果。在该函数内部，它会将生成的`key/value`分区（调用`Partitioner`），并写入一个**环形内存缓冲区**中。环形缓冲区的默认大小是`100M`。

#### Spill阶段：即“溢写”

当环形缓冲区满`80%`后，就会打开流，`MapReduce`会将数据写到本地文件系统磁盘上，**生成一个临时文件**，然后关闭流。当环形缓冲区再次满`80%`后，又会打开流，开始溢写。因此，有可能生成多个临时文件。

需要注意的是，**将数据写入本地磁盘之前**，先要对数据**进行一次本地排序，并在必要时对数据进行规约、压缩、分区等操作**。

> 溢写阶段详情：
>
> 步骤1：利用快速排序算法对缓存区内的数据进行排序，排序方式是，先按照分区编号`Partition`进行排序，然后按照`key`进行排序。这样，经过排序后，**数据以分区为单位聚集在一起，且同一分区内所有数据按照key有序。**
>
> 步骤2：按照分区编号由小到大依次将每个分区中的数据写入任务工作目录下的临时文件`output/spillN.out`（`N`表示当前溢写次数）中。如果用户设置了`Combiner`，则写入文件之前，对每个分区中的数据进行一次聚集操作。
>
> 步骤3：将分区数据的元信息写到内存索引数据结构`SpillRecord`中，其中每个分区的元信息包括在临时文件中的偏移量、压缩前数据大小和压缩后数据大小。如果当前内存索引大小超过`1MB`，则将内存索引写到文件`output/spillN.out.index`中。

#### Combine阶段

当所有数据处理完成后，`MapTask`对所有临时文件进行一次合并，以确保最终只会生成一个数据文件。

当所有数据处理完后，`MapTask`会将所有临时文件合并成一个大文件，并保存到文件`output/file.out`中，同时生成相应的索引文件`output/file.out.index`。

在进行文件合并过程中，`MapTask`以分区为单位进行合并。对于某个分区，它将采用**多轮递归合并**的方式。每轮合并`io.sort.factor（`默认10）个文件，并将产生的文件重新加入待合并列表中，对文件排序后，重复以上过程，直到最终得到一个大文件。

**让每个`MapTask`最终只生成一个数据文件，可避免同时打开大量文件和同时读取大量小文件产生的随机读取带来的开销。**

## ReduceTask工作机制（重点）

![image-20200215133122963](hadoop.assets/image-20200215133122963.png)

#### Copy阶段

`ReduceTask`从各个`MapTask`上远程拷贝一片数据，并针对某一片数据，如果其大小超过一定阈值，则写到磁盘（`hdfs`文件系统）上，否则直接放到内存中。

#### Merge阶段

在远程拷贝数据的同时，`ReduceTask`启动了两个后台线程**分别对内存和磁盘上的文件进行合并**，以防止内存使用过多或磁盘上文件过多。

#### Sort阶段

按照`MapReduce`语义，用户编写`reduce()`函数的输入数据是按`key`进行聚集的一组数据，如`（hello,Iterable(1,1,1,1))`。

为了将`key`相同的数据聚在一起，`Hadoop`采用了基于排序的策略。由于各个`MapTask`已经实现对自己的处理结果进行了局部排序，因此，**`ReduceTask`只需对所有数据进行一次归并排序即可**。

#### Reduce阶段

`reduce()`函数将计算结果写到`HDFS`上。默认是使用`TextOutputFormat`类来写。

## MapReduce完整流程

第一步：读取文件，解析成为`key，value`对

第二步：自定义map逻辑接受`k1,v1`，转换成为新的k2,v2输出

第三步：分区`Partition`。将相同`key`的数据发送到同一个`reduce`里面去

第四步：排序，`map`阶段分区内的数据进行排序

第五步：`combiner`。调优过程，对数据进行`map`阶段的合并

第六步：将环形缓冲区的数据进行溢写到本地磁盘小文件

第七步：归并排序，对本地磁盘溢写小文件进行归并排序

第八步：等待`reduceTask`启动线程来进行拉取数据

第九步：`reduceTask`启动线程拉取属于自己分区的数据

第十步：从`mapTask`拉取回来的数据继续进行归并排序

第十一步：进行`groupingComparator`分组操作

第十二步：调用`reduce`逻辑，写出数据

第十三步：通过`outputFormat`进行数据输出，写到文件，一个`reduceTask`对应一个文件

## shuffle当中的数据压缩

#### 为什么要压缩？

在`shuffle`阶段，可以看到数据通过大量的拷贝，**从`map`阶段输出的数据，都要通过网络拷贝，发送到`reduce`阶段**，这一过程中，涉及到大量的网络`IO`，如果数据能够进行压缩，那么数据的发送量就会少得多，而且也不会占用那么多本地磁盘空间。

压缩步骤大致处于`mapreduce`流程中的位置：`input`--》`mapper`--》`shuffle`--》`partitioner、sort、combiner、`==【compress】==、`group`--》`reducer`--》`output`

那么如何配置`hadoop`的文件压缩呢，以及`hadoop`当中的文件压缩支持哪些压缩算法呢？？

#### hadoop当中支持的压缩算法

文件压缩有两大好处，节约磁盘空间，加速数据在网络和磁盘上的传输

我们可以使用`bin/hadoop checknative` 来查看我们编译之后的`hadoop`支持的各种压缩，如果出现`openssl`为`false`，那么就在线安装一下依赖包

```java
[hadoop@node01 ~]$ hadoop checknative
20/02/15 13:55:55 INFO bzip2.Bzip2Factory: Successfully loaded & initialized native-bzip2 library system-native
20/02/15 13:55:55 INFO zlib.ZlibFactory: Successfully loaded & initialized native-zlib library
Native library checking:
hadoop:  true /kkb/install/hadoop-2.6.0-cdh5.14.2/lib/native/libhadoop.so.1.0.0
zlib:    true /lib64/libz.so.1
snappy:  true /lib64/libsnappy.so.1
lz4:     true revision:10301
bzip2:   true /lib64/libbz2.so.1
openssl: true /lib64/libcrypto.so
```

可以看到，**我们的`hadoop`经过编译后已经支持所有的压缩格式了**，剩下的问题就是我们该如何选择使用这些压缩格式来对我们的`MapReduce`程序进行压缩。

**压缩格式详情如下：**

| **压缩格式** | **工具** | **算法**  | **文件扩展名** | **是否可切分** |
| ------------ | -------- | --------- | -------------- | -------------- |
| `DEFLATE`    | 无       | `DEFLATE` | `.deflate`     | 否             |
| `Gzip`       | `gzip`   | `DEFLATE` | `.gz`          | 否             |
| `bzip2`      | `bzip2`  | `bzip2`   | `bz2`          | 是             |
| `LZO`        | `lzop`   | `LZO`     | `.lzo`         | 否             |
| `LZ4`        | 无       | `LZ4`     | `.lz4`         | 否             |
| `Snappy`     | 无       | `Snappy`  | `.snappy`      | 否             |

从上图可以看到，上面有些压缩算法是不支持切分的，所以，无论压缩后的压缩文件有没有大于`128M`，这个压缩文件都只会被当作 一个切片处理。

**各种压缩算法对应使用的java类：**

| **压缩格式** | **对应使用的java类**                         |
| ------------ | -------------------------------------------- |
| `DEFLATE`    | `org.apache.hadoop.io.compress.DeFaultCodec` |
| `gzip`       | `org.apache.hadoop.io.compress.GZipCodec`    |
| `bzip2`      | `org.apache.hadoop.io.compress.BZip2Codec`   |
| `LZO`        | `com.hadoop.compression.lzo.LzopCodec`       |
| `LZ4`        | `org.apache.hadoop.io.compress.Lz4Codec`     |
| `Snappy`     | `org.apache.hadoop.io.compress.SnappyCodec`  |

 **常见的压缩速率比较:**

| **压缩算法** | **原始文件大小** | **压缩后的文件大小** | **压缩速度** | **解压缩速度** |
| ------------ | ---------------- | -------------------- | ------------ | -------------- |
| gzip         | 8.3GB            | 1.8GB                | 17.5MB/s     | 58MB/s         |
| bzip2        | 8.3GB            | 1.1GB                | 2.4MB/s      | 9.5MB/s        |
| LZO-bset     | 8.3GB            | 2GB                  | 4MB/s        | 60.6MB/s       |
| LZO          | 8.3GB            | 2.9GB                | **135 MB/s** | 410 MB/s       |
| snappy       | 8.3GB            | 1.8GB                | **172MB/s**  | 409MB/s        |

==常用的压缩算法主要有`LZO`和`snappy`==

#### 开启压缩的方式

###### 方式一：在main()方法中进行设置

```java
//设置我们的map阶段的压缩
Configuration conf = new Configuration();
conf.set("mapreduce.map.output.compress","true");
conf.set("mapreduce.map.output.compress.codec","org.apache.hadoop.io.compress.SnappyCodec");

//设置我们的reduce阶段的压缩
conf.set("mapreduce.output.fileoutputformat.compress","true");
conf.set("mapreduce.output.fileoutputformat.compress.type","RECORD");
//上面这行代码只有在输出文件的格式是SequenceFile时才会起作用
conf.set("mapreduce.output.fileoutputformat.compress.codec","org.apache.hadoop.io.compress.SnappyCodec");
```

 

###### 方式二：修改mapred-site.xml

我们可以修改`mapred-site.xml`配置文件，然后重启集群，以便对**所有的**`mapreduce`任务进行压缩

**对`map`输出数据进行压缩：**

```xml
<property>
	<name>mapreduce.map.output.compress</name>
	<value>true</value>
</property>
<property>
	<name>mapreduce.map.output.compress.codec</name>
	<value>org.apache.hadoop.io.compress.SnappyCodec</value>
</property> 
```

**对`reduce`输出数据进行压缩：**

```xml
<property>    
	<name>mapreduce.output.fileoutputformat.compress</name>
	<value>true</value>
</property>
<property>    
	<name>mapreduce.output.fileoutputformat.compress.type</name>
	<value>RECORD</value>
</property>
<property>    
	<name>mapreduce.output.fileoutputformat.compress.codec</name>
	<value>org.apache.hadoop.io.compress.SnappyCodec</value> 
</property>
```

**所有节点都要修改mapred-site.xml，修改完成之后记得重启集群**

#### 案例运行

把分区例子拿到集群运行，并修改`mapred-site.xml`，使得对`reduce`的输出进行压缩。运行后的输出文件如下，可以看到，`part-r-`文件的后缀时`.snappy`

![image-20200215154403743](hadoop.assets/image-20200215154403743.png)



## MapReduce当中的计数器

#### 计数器

计数器是收集作业统计信息的有效手段之一，用于质量控制或应用级统计。**计数器还可辅助诊断系统故障**。如果需要将日志信息传输到`map` 或`reduce` 任务， 更好的方法通常是看能否用一个计数器值来记录某一特定事件的发生。对于大型分布式作业而言，使用计数器更为方便。除了因为获取计数器值比输出日志更方便，还有根据计数器值统计特定事件的发生次数要比分析一堆日志文件容易得多。

`hadoop`内置计数器列表

| MapReduce任务计数器      | org.apache.hadoop.mapreduce.TaskCounter                      |
| ------------------------ | ------------------------------------------------------------ |
| 文件系统计数器           | org.apache.hadoop.mapreduce.FileSystemCounter                |
| `FileInputFormat`计数器  | org.apache.hadoop.mapreduce.lib.input.FileInputFormatCounter |
| `FileOutputFormat`计数器 | org.apache.hadoop.mapreduce.lib.output.FileOutputFormatCounter |
| 作业计数器               | org.apache.hadoop.mapreduce.JobCounter                       |

#### 自定义计数器

##### 通过context上下文对象获取计数器

通过`context`上下文对象，**在`map`端使用计数器**进行统计

```java
public class SortMapper extends Mapper<LongWritable,Text,PairWritable,IntWritable> {
 
   private PairWritable mapOutKey = new PairWritable();
   private IntWritable mapOutValue = new IntWritable();
 
   @Override
   public void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException {
	 //自定义我们的计数器，这里实现了统计map数据数据的条数
     Counter counter = context.getCounter("MR_COUNT", "MapRecordCounter");
     //第一个参数是自己定义的计数器组名，第二个参数是自己定义计数器名称
     counter.increment(1L);
 
     String lineValue = value.toString();
     String[] strs = lineValue.split("\t");
 
     //设置组合key和value ==> <(key,value),value>
     mapOutKey.set(strs[0], Integer.valueOf(strs[1]));
     mapOutValue.set(Integer.valueOf(strs[1]));
     context.write(mapOutKey, mapOutValue);
   }
 }
```

##### 通过enum枚举类型来定义计数器

```java
//统计reduce端数据的输入的key有多少个，对应的value有多少个

public class SortReducer extends Reducer<PairWritable,IntWritable,Text,IntWritable> {

   private Text outPutKey = new Text();
   public static enum Counter{
     REDUCE_INPUT_RECORDS, REDUCE_INPUT_VAL_NUMS,
   }
   @Override
   public void reduce(PairWritable key, Iterable<IntWritable> values, Context context) throws IOException, InterruptedException {
     context.getCounter(Counter.REDUCE_INPUT_RECORDS).increment(1L);
     //迭代输出
     for(IntWritable value : values) {
       context.getCounter(Counter.REDUCE_INPUT_VAL_NUMS\*).increment(1L);
       outPutKey.set(key.getFirst());
       context.write(outPutKey, value);
     }
   }
 }
```

## Mapreduce当中的join操作

#### 案例需求

订单数据表`t_order`： 

| **id** | **date** | **pid** | **amount** |
| ------ | -------- | ------- | ---------- |
| 1001   | 20150710 | P0001   | 2          |
| 1002   | 20150710 | P0002   | 3          |
| 1002   | 20150710 | P0003   | 3          |
| 1003   | 20150812 | P0003   | 1          |

商品信息表`t_product`

| pid   | **pname** | **category_id** | **price** |
| ----- | --------- | --------------- | --------- |
| P0001 | 小米5     | 1000            | 2000      |
| P0002 | 锤子T1    | 1000            | 3000      |
| P0003 | iphone11  | 5000            | 8000      |

假如数据量巨大，两表的数据是以文件的形式存储在`HDFS`中，需要用`mapreduce`程序来实现一下`SQL`查询运算：

```sql
select  a.id,a.date,b.name,b.category_id,b.price from t_order a join t_product  b on a.pid = b.id  
```

将`pid`相同的数据进行关联合并

![image-20200215222159339](hadoop.assets/image-20200215222159339.png)

#### 案例分析

特别要注意，从上图中可以看出，一个`pid`可能出现在不同的`id`订单中，所以**商品信息对订单是一对多的关系**，这个问题要解决。

进行`join`操作，可以在`map`端，也可以在`reduce`端。

#### reduce端的join操作

通过将关联的条件`pid`作为`map`输出的`key`，将两表**满足`join`条件的数据**并**携带数据所来源的文件信息**，发往同一个`reduce task`（默认的分区逻辑就是相同的`key`的数据会进入同一个`reducetask)`，然后在`reduce`端中进行数据的串联 。

将`pid`作为`key`后，根据默认的分组逻辑，相同`key(pid)`的数据作为一组，会调用一次`reduce()`。

![image-20200215230620944](hadoop.assets/image-20200215230620944.png)

##### 步骤1：定义map逻辑

```java
package com.jimmy.day03;

import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.lib.input.FileSplit;

import java.io.IOException;

public class ReduceJoinMapper extends Mapper<LongWritable,Text,Text,Text> {

    //现在我们读取了两个文件，我们要确定读取到的内容是商品信息还是订单信息
    //因此可以有以下两种逻辑：
    @Override
    protected void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException {

        //第一种逻辑, 通过文件名判断:
        //切割数据：
        String[]split=value.toString().split(",");
        //获取文件的切片:
        FileSplit inputSplit = (FileSplit) context.getInputSplit();
        //获取文件名称
        String name = inputSplit.getPath().getName();
        if(name.equals("orders.txt")){
            context.write(new Text(split[2]),value);
        }else{
            context.write(new Text(split[0]),value);
        }

        //=========================================

        //第二种逻辑，判断文件内容是否以"p"开头
        /*
        String[] split = value.toString().split(",");
        if( value.toString().startsWith("p")){
            context.write(new Text(split[0]),value);
        }else{
            context.write(new Text(split[2]),value);
        }
         */
        
        /*第一种逻辑更靠谱，因为通过文件内容是否以p开头的话，
        如果p为大写或者p前面有空格就识别不出来是商品信息了
         */
    }
}
```

##### 步骤2：定义reduce逻辑

定义`reduce`逻辑的时候，特别注意一个商品信息可能对应多个订单（一个商品可能别个人买）。因此，需要创建一个订单数组来保存订单信息，再遍历订单数组进行`join`操作。

```java
package com.jimmy.day03;

import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;

import java.io.IOException;
import java.util.ArrayList;

public class ReduceJoinReducer extends Reducer<Text,Text,Text,NullWritable> {
    @Override
    protected void reduce(Text key, Iterable<Text> values, Context context) throws IOException, InterruptedException {
        //按照默认的分组逻辑，相同的key(pid)的数据作为一组，调用一次reduce()方法
        ArrayList<String> orderInfoList=new ArrayList<String>();
        String productInfo = "";

        for (Text value : values) {
           if( value.toString().startsWith("p")){
               //获取商品信息
               productInfo = value.toString();
           }else{
               //把订单信息添加到订单数组中
               orderInfoList.add(value.toString());
           }
        }
        //遍历订单信息数组：
        for(String odInfo:orderInfoList){
            //进行join操作：
            context.write(new Text(odInfo + "\t" +  productInfo), NullWritable.get());
        }

    }
}
```

##### 步骤3：定义组装类和main方法

```java
package com.jimmy.day03;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.conf.Configured;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.lib.input.TextInputFormat;
import org.apache.hadoop.mapreduce.lib.output.TextOutputFormat;
import org.apache.hadoop.util.Tool;
import org.apache.hadoop.util.ToolRunner;

public class ReduceJoinMain  extends Configured implements Tool {
    @Override
    public int run(String[] args) throws Exception {
        //获取job对象
        Job job = Job.getInstance(super.getConf(), "reduceJoin");
        //第一步：读取文件
        job.setInputFormatClass(TextInputFormat.class);
        TextInputFormat.addInputPath(job,new Path("file:///F://test4//"));
        //第二步：设置自定义mapper逻辑

        job.setMapperClass(ReduceJoinMapper.class);
        job.setMapOutputKeyClass(Text.class);
        job.setMapOutputValueClass(Text.class);
        //分区，排序，规约，分组 省略
        //第七步：设置reduce逻辑
        job.setReducerClass(ReduceJoinReducer.class);
        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(NullWritable.class);
        //第八步：设置输出数据路径
        job.setOutputFormatClass(TextOutputFormat.class);
        TextOutputFormat.setOutputPath(job, new Path("file:///F://test4//output"));
        boolean b = job.waitForCompletion(true);
        return b?0:1;
    }

    public static void main(String[] args) throws Exception {
        int run = ToolRunner.run(new Configuration(), new ReduceJoinMain(), args);
        System.exit(run);
    }
}
```

##### 运行结果

![image-20200215231452372](hadoop.assets/image-20200215231452372.png)

#### map端的join操作

上面的`reduce`端的`join`操作已经满足了我们的需求，为什么要使用`map`端来进行`join`操作。

![image-20200215233715296](hadoop.assets/image-20200215233715296.png)

观察上图，假设`reducetask`不只有一个。

假如有某个商品是爆款，订单数量非常多。那么按照默认分区逻辑，相同的商品`pid`的订单数据或者商品数据，会进入同一个`reducetask`,如果还是使用`reduce`端的`join`操作方法的话，会导致要处理爆款商品相关`join`操作的`reducetask`所在节点压力非常大，**出现了数据倾斜的问题**。这时候就可以利用`map`端进行`join`操作，解决该问题。

##### 解决数据倾斜问题的原理

假如有两个`maptask`，则这两个`maptask`都只会读取数据量很大的订单信息数据，数据量小的商品信息数据会被添加到**分布式缓冲**中，添加方法在通过`main`方法来调用。添加到分布式缓存后，在`maptask`开始运行之前，会调用`mapper`类里面的`setup()`方法，该方法是用来初始化的，通过该方法我们就可以将分布式缓存中的数据加载到每个`maptask`节点上，然后每个`maptask`开始进行`join`操作，最后输出出去，`reduce`逻辑不再需要定义了。

![image-20200216000507952](hadoop.assets/image-20200216000507952.png)

##### 使用情形

适用于关联表中有小表的情形；

可以将小表分发到所有的`map`节点，这样，**`map`节点就可以在本地对自己所读到的大表数据进行`join`并输出最终结果**，可以大大提高`join`操作的并发度，加快处理速度。

##### 步骤1：定义map逻辑

重写`setup()`方法，将分布式缓存中的数据加载到每个`mapask`节点上，然后定义`map()`逻辑进行`join`操作。

```java
package com.jimmy.day02;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.filecache.DistributedCache;
import org.apache.hadoop.fs.FSDataInputStream;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URI;
import java.util.HashMap;
import java.util.Map;

public class MapJoinMapper extends Mapper<LongWritable,Text,Text,NullWritable> {
    private Map<String,String>  pdtsMap ;


    /**
     * 初始化方法，只在程序启动调用一次
     * @param context
     * @throws IOException
     * @throws InterruptedException
     */
    @Override
    protected void setup(Context context) throws IOException, InterruptedException {

        pdtsMap = new HashMap<String, String>();

        Configuration configuration = context.getConfiguration();

        //获取到所有的缓存文件，但是现在只有一个缓存文件，是不是数组都无所谓
        URI[] cacheFiles = DistributedCache.getCacheFiles(configuration);
        //获取到 了我们放进去的缓存文件
        URI cacheFile = cacheFiles[0];

        //获取FileSystem
        FileSystem fileSystem = FileSystem.get(cacheFile, configuration);
        //读取文件，获取到输入流。这里面装的都是商品表的数据
        FSDataInputStream fsDataInputStream = fileSystem.open(new Path(cacheFile));

        /**
         * p0001,xiaomi,1000,2
         p0002,appale,1000,3
         p0003,samsung,1000,4
         */
        //包装成缓冲流，获取到BufferedReader 之后就可以一行一行的读取数据
        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(fsDataInputStream));
        String line =null;
        while((line = bufferedReader.readLine()) != null){
            String[] split = line.split(",");
            pdtsMap.put(split[0],line);
        }

    }

    @Override
    protected void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException {
        String[] split = value.toString().split(",");
        //获取订单表的商品id
        String pid = split[2];

        //获取商品表的数据
        String pdtsLine = pdtsMap.get(pid);
java
        context.write(new Text(value.toString()+"\t" +  pdtsLine), NullWritable.get());



    }
}
```

##### 步骤2：定义组装类和main方法

```java
package com.jimmy.day02;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.conf.Configured;
import org.apache.hadoop.filecache.DistributedCache;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.lib.input.TextInputFormat;
import org.apache.hadoop.mapreduce.lib.output.TextOutputFormat;
import org.apache.hadoop.util.Tool;
import org.apache.hadoop.util.ToolRunner;

import java.net.URI;

public class MapJoinMain extends Configured implements Tool {
    @Override
    public int run(String[] args) throws Exception {
        URI uri = new URI("hdfs://node01:8020/cache/pdts.txt");
        Configuration conf = super.getConf();
        //添加缓存文件
        DistributedCache.addCacheFile(uri,conf);
        //获取job对象
        Job job = Job.getInstance(conf, "mapJoin");
        //读取文件，解析成为key，value对
        job.setInputFormatClass(TextInputFormat.class);
        TextInputFormat.addInputPath(job,new Path("file:///..."));
        job.setMapperClass(MapJoinMapper.class);
        job.setMapOutputKeyClass(Text.class);
        job.setMapOutputValueClass(NullWritable.class);

        //没有reducer逻辑，不用设置了
        job.setOutputFormatClass(TextOutputFormat.class);
        TextOutputFormat.setOutputPath(job,new Path("file:///..."));



        boolean b = job.waitForCompletion(true);


        return b?0:1;
    }java

    public static void main(String[] args) throws Exception {
        int run = ToolRunner.run(new Configuration(), new MapJoinMain(), args);
        System.exit(run);
    }

}
```

## yarn介绍

`yarn(Yet Another Resource Negotiator)`是一个新的资源管理器，`hadoop2.0`的时候开始引入`yarn`，引入`yarn`是为了分离`hadoop`的资源管理和计算组件。`yarn`是一个通用的管理框架，在`yarn`上不仅仅可以运行`Mapreduce`，还可以支持其它的分布式计算模式。

![image-20200216015155653](hadoop.assets/image-20200216015155653.png)

![image-20200216015301198](hadoop.assets/image-20200216015301198.png)

## yarn架构

类似`HDFS`，`YARN`也是经典的**主从（master/slave）架构**

- `YARN`服务由一个`ResourceManager`（`RM`）和多个`NodeManager`（`NM`）构成。
- `ResourceManager`为主节点（`master`）。
- `NodeManager`为从节点（`slave`）。

![image-20200216051626413](hadoop.assets/image-20200216051626413.png)

##  ResourceManager(RM)

**ResourceManager是YARN中主的角色**

- `RM`是一个全局的资源管理器，集群只有一个对外提供服务
- 负责整个系统的资源管理和分配
- 包括处理客户端请求
- 启动/监控 `ApplicationMaster`
- 监控 `NodeManager`、资源的分配与调度

**ResourceManager主要由两个组件构成（了解就行）：**

- 调度器（`Scheduler`）

- 应用程序管理器（`Applications Manager`，`ASM`）

**调度器`Scheduler:`**

- 调度器根据容量、队列等限制条件（如每个队列分配一定的资源，最多执行一定数量的作业等），将系统中的资源分配给各个正在运行的应用程序。

- 需要注意的是，该调度器是一个“纯调度器”

- 它**不从事任何与具体应用程序相关的工作**，比如不负责监控或者跟踪应用的执行状态等，也不负责重新启动因应用执行失败或者硬件故障而产生的失败任务，这些均交由应用程序相关的`ApplicationMaster`完成。
- 调度器**仅根据各个应用程序的资源需求进行资源分配**，而**资源分配单位用一个抽象概念“资源容器”**（`Resource Container`，简称`Container`）表示，`Container`是一个动态资源分配单位，它将内存、`CPU`、磁盘、网络等资源封装在一起，从而限定每个任务使用的资源量。

**应用程序管理器Applications Manager，ASM**

- 应用程序管理器主要负责管理整个系统中所有应用程序

- 接收job的提交请求

- 为应用分配第一个 `Container` 来运行 `ApplicationMaster`，包括应用程序提交、与调度器协商资源以启动 `ApplicationMaster`、监控 `ApplicationMaster` 运行状态并在失败时重新启动它等

## NodeManager(NM)

**NodeManager 是YARN中的 slave角色**

- 每个计算节点，运行一个`NodeManager`进程；通过心跳（每秒 `yarn.resourcemanager.nodemanagers.heartbeat-interval-ms` ）上报节点的资源状态(磁盘，内存，cpu等使用信息)
- `NodeManager`它负责接收 `ResourceManager` 的资源分配请求，分配具体的 `Container` 给应用。
- 负责监控并报告 `Container` 使用信息给 `ResourceManager`。

**Nodemanager功能：**

- `NodeManager` 监控本节点上的资源使用情况和各个 `Container` 的运行状态（`cpu`和内存等资源）
- 接收及处理来自 `ResourceManager` 的命令请求，分配 `Container` 给应用的某个任务；
- 定时地向`ResourceManager`汇报以确保整个集群平稳运行，`RM` 通过收集每个 `NodeManager` 的报告信息来追踪整个集群健康状态的，而 `NodeManager` 负责监控自身的健康状态；
- 处理来自 `ApplicationMaster` 的请求；
- 管理着所在节点每个 `Container` 的生命周期；
- 管理每个节点上的日志；
- 当一个节点启动时，它会向 `ResourceManager` 进行注册并告知 `ResourceManager` 自己有多少资源可用。
- 在运行期，通过 `NodeManager` 和 `ResourceManager` 协同工作，这些信息会不断被更新并保障整个集群发挥出最佳状态。
- **`NodeManager` 只负责管理自身的 `Container`，它并不知道运行在它上面应用的信息。负责管理应用信息的组件是 `ApplicationMaster`**

## Container

#### Container 是什么？

- `Container`是`YARN` 中的资源抽象， `YARN`以`Container`为单位分配资源。**本质是`JVM`。**

- `Container`封装了某个节点上的多维度资源，如内存、CPU、磁盘、网络。

- 当 `ApplicationMaster`向 `ResourceManager` 申请资源时，`ResourceManager` 为 `ApplicationMaster` 返回的资源便是用 `Container` 表示的。

- `YARN` 会为每个任务分配一个 `Container`，且该任务只能使用该 `Container` 中描述的资源。
- 任何一个 `job` 或 `application` 必须运行在一个或多个 `Container` 中。

#### **Container功能**

-  对`task`环境的抽象；
-  描述一系列信息；
-  任务运行资源的集合（`cpu`、内存、`io`等）；
-  任务运行环境

####  **Container 和NodeManager节点的关系**

- 一个`NodeManager`节点可运行多个 `Container`

- 但一个 `Container` 不会跨节点。
- 在 `Yarn` 框架中，`ResourceManager` 只负责告诉 `ApplicationMaster` 哪些 `Containers` 可以用，`ApplicationMaster` 还需要去找 `NodeManager` 请求分配具体的 `Container`。

#### **注意事项**

- `Container` 是一个动态资源划分单位，是**根据应用程序的需求动态生成的**。

- **目前为止，`YARN` 仅支持 `CPU` 和内存两种资源**，且使用了轻量级资源隔离机制 `Cgroups` 进行资源隔离。

## ApplicationMaster

**功能：**

- 获得数据分片；
- 为应用程序申请资源并进一步分配给内部任务（`TASK`）；
- 任务监控与容错；

- 负责协调来自`ResourceManager`的资源，并通过`NodeManager`监视容器的执行和资源使用情况。

`ApplicationMaster` 与 `ResourceManager` 之间的通信是整个 `Yarn` 应用从提交到运行的最核心部分，是 `Yarn` 对整个集群进行动态资源管理的根本步骤。

`Yarn` 的动态性，就是来源于多个`Application` 的 `ApplicationMaster` 动态地和 `ResourceManager` 进行沟通，不断地申请、释放、再申请、再释放资源的过程。

## JobHistoryServer 

`JobHistoryServer` (作业历史服务) 记录在`yarn`中调度的作业历史运行情况情况，可以通过历史任务日志服务器来查看`hadoop`的历史任务，出现错误都应该第一时间来查看日志日志

#### 配置历史日志服务

##### 第一步：修改mapred-site.xml

`node01`执行以下命令修改`mapred-site.xml`

```
cd /kkb/install/hadoop-2.6.0-cdh5.14.2/etc/hadoop
vim mapred-site.xml
```

```xml
<property>
  <name>mapreduce.jobhistory.address</name>
  <value>node01:10020</value>
</property>
<property>
  <name>mapreduce.jobhistory.webapp.address</name>
  <value>node01:19888</value>
</property>
```

注意：如果已经存在以上两项配置，那么就不需要再进行配置了

##### 第二步：修改yan-site.xml

```
cd /kkb/install/hadoop-2.6.0-cdh5.14.2/etc/hadoop
vim yarn-site.xml
```

```xml
<property>
  <name>yarn.log-aggregation-enable</name>
  <value>true</value>
</property>

<!-- 多长时间聚合删除一次日志 此处 -->

<property>
  <name>yarn.log-aggregation.retain-seconds</name>
  <value>2592000</value><!--30 day-->
</property>

<!-- 时间在几秒钟内保留用户日志。只适用于如果日志聚合是禁用的 -->

<property>
  <name>yarn.nodemanager.log.retain-seconds</name>
  <value>604800</value><!-- 7 day -->
</property>

<!-- 指定文件压缩类型用于压缩汇总日志 -->

<property>
  <name>yarn.nodemanager.log-aggregation.compression-type</name>
  <value>gz</value>
</property>

<!-- nodemanager本地文件存储目录 -->

<property>
  <name>yarn.nodemanager.local-dirs</name>
  <value>/kkb/install/hadoop-2.6.0-cdh5.14.2/hadoopDatas/yarn/local</value>
</property>

<!-- resourceManager 保存最大的任务完成个数 -->

<property>
  <name>yarn.resourcemanager.max-completed-applications</name>
  <value>1000</value>
</property>
```

##### 第三步：将修改后的文件同步到其他机器上面去

`node01`服务器执行以下命令，将修改后的文件同步发送到其他服务器上面去

```
cd /kkb/install/hadoop-2.6.0-cdh5.14.2/etc/hadoop

scp mapred-site.xml yarn-site.xml node02:$PWD

scp mapred-site.xml yarn-site.xml node03:$PWD
```

##### 第四步：重启yarn以及jobhistory服务

node01执行以下命令重启yarn以及jobhistory服务

```
cd /kkb/install/hadoop-2.6.0-cdh5.14.2

sbin/start-yarn.sh

sbin/mr-jobhistory-daemon.sh start historyserver 
```

## Timeline Server 

用来写日志服务数据 , 一般来写与第三方结合的日志服务数据(比如`spark`等)

**它是对`jobhistoryserver`功能的有效补充，`jobhistoryserver`只能对`mapreduce`类型的作业信息进行记录**

它记录除了`jobhistoryserver`能够对作业运行过程中信息进行记录之外

还记录更细粒度的信息，比如任务在哪个队列中运行，运行任务时设置的用户是哪个用户。

根据官网的解释`jobhistoryserver`只能记录`mapreduce`应用程序的记录，`timelineserver`功能更强大,但不是替代`jobhistory`，两者是功能间的互补关系

## yarn工作机制

#### 大致过程

![image-20200216050627615](hadoop.assets/image-20200216050627615.png)

1. MR程序提交到客户端所在的节点。
2. YarnRunner向ResourceManager申请一个Application。
3. RM将该应用程序的资源路径返回给YarnRunner。
4. 该程序将运行所需资源提交到HDFS上。
5. 程序资源提交完毕后，申请运行mrAppMaster。
6. RM将用户的请求初始化成一个Task。
7. 其中一个NodeManager领取到Task任务。
8. 该NodeManager创建容器Container，并产生MRAppmaster。
9. Container从HDFS上拷贝资源到本地。
10. MRAppmaster向RM 申请运行MapTask资源。
11. RM将运行MapTask任务分配给另外两个NodeManager，另两个NodeManager分别领取任务并创建容器。
12. MR向两个接收到任务的NodeManager发送程序启动脚本，这两个NodeManager分别启动MapTask，MapTask对数据分区排序。
13. MrAppMaster等待所有MapTask运行完毕后，向RM申请容器，运行ReduceTask。
14. ReduceTask向MapTask获取相应分区的数据。
15. 程序运行完毕后，MR会向RM申请注销自己。

#### 详细过程

![image-20200216051015959](hadoop.assets/image-20200216051015959.png)

1. `MR`程序（可以理解成`jar`包）提交到客户端所在的节点，MR程序里面有一个`Job.waitforcompletion()`方法，这个方法会生成一个`jobsummiter`实例对象，然后这个过程还会通过`jobsummiter`调用`runJob()`方法。
2. 客户端与`ResourceManager`进行通信，调用`getApplication()`方法申请一个应用，RM收到申请后，返回分配给客户端一个`applicaion id`。
3. 客户端判断`MR`程序的输入路径是否存在，若不存在则报错。然后客户端会计算分片信息，比如根据文件大小得到要多少个分片。
   4. 上述操作无误后，客户端把`Job`资源提交到`hdfs`。`Job`资源包括`jar`包、`job`的配置信息（`job.xml`)、分片信息。
4. 客户端`summit`提交 `job`，`RM`收到提交后，根据各个`NodeManager`上运行的资源状况向某个`NM`节点发送启动容器的请求，该`NM`收到`RM`的请求会启动一个容器`Container`。然后在该容器上启动一个`MRAppMaster`进程（进程运行在`JVM`虚拟机里）。
5. `MRAppMaster`进行初始化，生成一些对象，用于记录`task`的完成情况。
6. `MRAppMaster`从`hdfs`获取分片信息（得知`maptask`个数）以及`reducetask`个数。
7. `MRAppMaster`向`RM`申请资源，启动容器，用于运行`task`。`MRAppMaster`会优先为`Maptask`申请资源。`RM`会返回要在哪几个`Nodemanager`开启容器、这个容器有多少资源等信息。
8. `MRAppMaster`与`RM`返回的所有`NM`节点，进行通信。`NM`收到信息后，就会在本地启动容器。
9. 在容器内启用`YarnChild`类，从`hdfs`拉取`job.ja`r包、配置信息等一些运行`task`的资源。然后每个容器就可以启动一个`maptask`了。
10. 接下来`maptask`运行的过程，就跟我们前面的学的`maptask`工作机制一样了。
11. 当整个`job`中的`maptask`的进程达到`5%`的时候，`MRAppMaster`就开始向`RM`为`reducetask`申请资源，启动容器。（每个`Maptask`运行过程都会向`MRAppMaster`上报进度信息，进度信息可看成是已经输入的数据占所有数据的百分比）
12. 然后`RM`再次返回要开启容器的`NM`节点信息，`MRAppMaster`再跟这些`NM`通信，`NM`启动容器，启用`YarnChild`，最后开启`reducetask`。
13. `reducetask`要从完成`100%`进度的`maptask`的所在节点拷贝数据过来自身所在节点。（`maptask`会向`MRAppMaster`上报进度信息，这些信息保存在`MRAppMaster`初始化生成的对象里，`reducetask`会不定期跟`MRAppMaster`通信，询问哪个`maptask`完成了）
14. 接下来`reducetask`的过程就跟我们前面学的`reducetask`工作机制一样了，最终会把输出结果保存到`hdfs`里。

#### **补充：**

- 每个`task`完成后，容器都会被释放掉。
- 每个`maptask`完成后，`maptask`在本地磁盘产生的临时文件都会被删除掉
- 程序运行完毕后，`MR`会向`RM`申请注销自己，`MRAppMaster`所在容器也会释放掉。
- 我们在运行MR程序的时候可以发现，会打印一些进度、计数器等信息出来，这是因为每个task在运行过程都会向`MRAppMaster`上报，如果在编写MR程序的时候，为`job.waitForCompletion();`传入参数`true`，客户端就会每隔几秒向`MRAppMaster`获取最新进度信息，取到就打印出来。
- `MRAppMaster`为`maptask`申请资源时，会把`maptask`的要使用的数据分片的所在节点信息一带发送给`RM`，如果分片所在的节点的资源是足够使用的话，`RM`会优先考虑这些`NM`节点，这样`maptask`运行直接从本地磁盘读数据就可以了，更高效点，这是**移动计算不移动数据**的思想。
- 企业生产当中，一般是一个节点（机器）同时运行`datanode+namanode`。效率更高点。
- 如果`task`运行失败，`MRAppMaster`会知道，并会为`task`重新申请资源容器，且优先考虑其它的`NM`节点，每个`task`有`4`次重试机会,如果超过`4`次,整个`job`失败。
- `MRAppMaster`会向`RM`发送心跳，如果超过一定时间，`RM`没有收到心跳，会判断`MRAppMaster`挂掉了。如果`MRAppMaster`运行失败，会启动一个新容器，运行`MRAppMaster`。新的`MRAppMaster`可以得知之前的`task`完成情况，因为启用了历史日志服务，任务完成情况会记录在内。
- `maptask`和`reducetask`的进度等信息都会保存在`MRAppMaster`初始化产生的对象里。
- 每个`job`对应一个`MRAppMaster`。

## yarn的任务调度器

资源调度器是`YARN`最核心的组件之一，是一个插拔式的服务组件，负责整个集群资源的管理和分配。YARN提供了三种可用的资源调度器：FIFO、Capacity Scheduler、Fair Scheduler。

#### 先进先出调度器（FIFO）

`FIFO`按照先到先得的原则，进行分配资源。这种调度器已经基本**被淘汰了**，因为比如说`job1`运行完成需要24小时，`job2`运行完成只需要1分钟，但是`job2`依然需要等`job1`运行完成才可以开始运行，效率很低。

![image-20200216051214661](hadoop.assets/image-20200216051214661.png)                  

#### 容量调度器（Capacity Scheduler）

 `apache`版本的`Hadoop`默认使用容量容量调度器。容量解决了FIFO调度器效率低下的问题，但依然是要以队列为基础的。

因此，首先要设计容量调度器资源分配队列，通过`xml`文件配置这些信息。假如有个资源分配队列如下：

![image-20200216183901319](hadoop.assets/image-20200216183901319.png)

集群`60%`的资源分配给`dev`队列，集群`40%`的资源分配给`prod`队列，`dev`队列的资源专门给开发组的任务分配，`prod`队列的资源专门给生产组的任务分配。

现在有个`job1`要运行，把它放在`spark`队列里运行，除了`spark`队列，现在其它队列都没有`job`要运行。在spark队列内部使用`FIFO`调度策略，还有其它`job`进入`spark`队列的话，就在`job1`后排队等待。如果`spark`队列的资源足够`job1`运行 ，直接运行就行。如果`spark`队列资源不够`job1`运行，`spark`会弹性占用`hdp`队列的资源，从而`spark`拥有集群`60%`的资源，`hdp`h队列拥有0%资源。如果`60%`还是不够，则`spark`队列会继续扩张资源，但是不能无底洞地扩张，我们可以设置个上限，比如`75%`。

**扩张前：**

![image-20200216184201871](hadoop.assets/image-20200216184201871.png)

**扩展后：**

![image-20200216190012943](hadoop.assets/image-20200216190012943.png)

#### 公平调度器（Fair Scheduler）

 `cdh`版本的`hadoop`默认使用公平调度器。公平调度器也是以队列为基础。

##### **单个队列里的公平：**

假如说`job1`一开始分配到了某个队列里`100%`的资源，如果后来`job2`后来也进入该队列，则`job2`会先等待`job1`一小段时间，让`job1`释放该队列`50%`的资源给`job2`。如果后来`job2`运行完成了，但是`job1`依旧没运行完，则`job1`又会重新占用该队列所有的资源。示意图如下：

![image-20200216203812431](hadoop.assets/image-20200216203812431.png)

#####  **队列间的公平：**

 假设有`AB`两个队列，一开始`job1`进入队列`A`，队列`B`此时没有`job，`那么`job1`不仅会占用队列`A`的所有资源，还有占用`B`的所有资源。接着，`job2`也提交上来了，`job2`首先会等待小会，让`job1`释放`50%`的资源，然后再利用这些资源开始运行。后来，`job3`也提交上来了，`job3`也首先会等待`job1`释放`50%`的资源，然后再利用这些资源开始运行。

可以看到，这个过程，`job1`和`job2`是平分对半资源，后来`job3`进入后，`job2`又和`job3`平分资源。所以说，`job1`被分配到的资源是最多的，紧接着是`job2`和`job3`。

![image-20200216205357255](hadoop.assets/image-20200216205357255.png)

##### 优先级：

从上面可知，先进入队列里先运行的`job`会享受到更多的资源，那么如果一个队列里有多个`job`，谁会被优先运行？

在资源有限情况下，每个`job`理想情况下获得的计算资源与实际获得的计算资源存在一种差距，这个差距就叫做**缺额**。同一个队列里，`job`的资源缺额越大，越先获得资源优先执行，但**每个job都会分配到资源**，确保公平，因此可以看到多个作业同时运行。这个是`Fair`模式，如果想要某个队列使用`FIFO`策略调度，可以进行设置。

![image-20200216203933427](hadoop.assets/image-20200216203933427.png)

#### hadoop默认队列

前面我们看到了`hadoop`当中有各种资源调度形式，当前`hadoop`的任务提交，默认提交到`default`队列里面去了，将所有的任务都提交到`default`队列，我们**在实际工作当中，可以通过划分队列的形式，对不同的用户，划分不同的资源，让不同的用户的任务，提交到不同的队列里面去，实现资源的隔离**

 通过**8088**端口（node:8088）查看：

![image-20200216213243450](hadoop.assets/image-20200216213243450.png)

#### 资源隔离

资源隔离目前有2种，静态隔离和动态隔离。

**静态隔离**

所谓静态隔离是以**服务隔离**，是通过`cgroups（LINUX control groups)` 功能来支持的。比如`HADOOP`服务包含`HDFS, HBASE, YARN`等等，那么我们固定的设置比例，`HDFS:20%, HBASE:40%, YARN：40%`， 系统会帮我们根据整个集群的CPU，内存，`IO`数量来分割资源，先提一下，**`IO`是无法分割的，所以只能说当遇到IO问题时根据比例由谁先拿到资源，CPU和内存是预先分配好的。**

上面这种按照比例固定分割就是静态分割了，仔细想想，这种做法弊端太多，假设我按照一定的比例预先分割好了，但是如果我晚上主要跑`mapreduce`, 白天主要是`HBASE`工作，这种情况怎么办？ 静态分割无法很好的支持，缺陷太大。

 **动态隔离**

动态隔离只要是**针对 `YARN`以及`impala`**, 所谓动态只是相对静态来说，**其实也不是动态**。 先说`YARN`， 在`HADOOP`整个环境，主要服务有哪些？ `mapreduce`（这里再提一下，`mapreduce`是应用，`YARN`是框架，搞清楚这个概念），`HBASE, HIVE，SPARK，HDFS，IMPALA`， 实际上主要的大概这些，很多人估计会表示不赞同，`oozie, ES, storm , kylin，flink`等等这些和`YARN`离的太远了，不依赖`YARN`的资源服务，而且这些服务都是单独部署就`OK`，关联性不大。 所以主要和`YARN`有关也就是`HIVE, SPARK，Mapreduce`。这几个服务也正式目前用的最多的（`HBASE`用的也很多，但是和`YARN`没啥关系）。

根据上面的描述，大家应该能理解为什么所谓的动态隔离主要是针对`YARN`。好了，既然`YARN`占的比重这么多，那么如果能很好的对`YARN`进行资源隔离，那也是不错的。如果我有3个部分都需要使用HADOOP，那么我希望能根据不同部门设置资源的优先级别，实际上也是根据比例来设置，建立3个`queue name`, 开发部们`30%`，数据分析部分`50%`，运营部门`20%`。 

设置了比例之后，再**提交`JOB`的时候设置`mapreduce.queue.name`，那么`JOB`就会进入指定的队列里面**。 非常可惜的是，如果你指定了一个不存在的队列，`JOB`仍然可以执行，这个是目前无解的，默认提交`JOB`到`YARN`的时候，规则是`root.users.username` ， 队列不存在，会自动以这种格式生成队列名称。 队列设置好之后，再通过`ACL`来控制谁能提交或者`KIll job`。

**隔离方式选择**

从上面2种资源隔离来看，没有哪一种做的很好，如果非要选一种，我会选取后者，隔离YARN资源， 第**一种固定分割服务的方式实在支持不了现在的业务**。



#### 自定义队列

需求：现在一个集群当中，可能有多个用户都需要使用，例如开发人员需要提交任务，测试人员需要提交任务，以及其他部门工作同事也需要提交任务到集群上面去，对于我们多个用户同时提交任务，我们可以通过配置`yarn`的多用户资源隔离来进行实现

##### 第一步：node01编辑yarn-site.xml

`node01`修改`yarn-site.xml`添加以下配置

```
cd /kkb/install/hadoop-2.6.0-cdh5.14.2/etc/hadoop

vim yarn-site.xml
```

```xml
<!-- 指定我们的任务调度使用fairScheduler的调度方式 -->
<property>
  <name>yarn.resourcemanager.scheduler.class</name>
 <value>org.apache.hadoop.yarn.server.resourcemanager.scheduler.fair.FairScheduler</value>
</property>
<!-- 指定我们的任务调度的配置文件路径 -->
<property>
  <name>yarn.scheduler.fair.allocation.file</name>
  <value>/kkb/install/hadoop-2.6.0-cdh5.14.2/etc/hadoop/fair-scheduler.xml</value>
</property>
<!-- 是否启用资源抢占，如果启用，那么当该队列资源使用
yarn.scheduler.fair.preemption.cluster-utilization-threshold 这么多比例的时候，就从其他空闲队列抢占资源
 -->
<property>
  <name>yarn.scheduler.fair.preemption</name>
  <value>true</value>
</property>
<property>
  <name>yarn.scheduler.fair.preemption.cluster-utilization-threshold</name>
  <value>0.8f</value>
</property>
<!-- 默认提交到default队列 -->
<property>
  <name>yarn.scheduler.fair.user-as-default-queue</name>
  <value>true</value>
  <description>default is True</description>
</property>
<!-- 如果提交一个任务没有到任何的队列，是否允许创建一个新的队列，设置false不允许 -->
<property>
  <name>yarn.scheduler.fair.allow-undeclared-pools</name>
  <value>false</value>
  <description>default is True</description>
</property>
```

##### 第二步：node01添加fair-scheduler.xml配置文件

`node01`执行以下命令，添加`faie-scheduler.xml`的配置文件

```
cd /kkb/install/hadoop-2.6.0-cdh5.14.2/etc/hadoop

vim fair-scheduler.xml
```

复制下列内容到集群配置文件的时候，特别注意有没有全部复制了，之前就因为漏复制了一点内容，导致`ResourceManager`启动不了。

```xml
<?xml version="1.0"?>

<allocations>
<!-- users max running apps -->
<userMaxAppsDefault>30</userMaxAppsDefault>

<!-- 定义我们的队列 -->
<queue name="root">
  <minResources>512mb,4vcores</minResources>
  <maxResources>102400mb,100vcores</maxResources>
  <maxRunningApps>100</maxRunningApps>
  <weight>1.0</weight>
  <schedulingMode>fair</schedulingMode>
  <aclSubmitApps> </aclSubmitApps>
  <aclAdministerApps> </aclAdministerApps>
  <queue name="default">
    <minResources>512mb,4vcores</minResources>
    <maxResources>30720mb,30vcores</maxResources>
    <maxRunningApps>100</maxRunningApps>
    <schedulingMode>fair</schedulingMode>
    <weight>1.0</weight>
    <!-- 所有的任务如果不指定任务队列，都提交到default队列里面来 -->
    <aclSubmitApps>*</aclSubmitApps>
  </queue>
<!--
weight:资源池权重

aclSubmitApps:允许提交任务的用户名和组；
格式为： 用户名 用户组
当有多个用户时候，格式为：用户名1,用户名2 用户名1所属组,用户名2所属组

aclAdministerApps:允许管理任务的用户名和组；
格式同上。
 -->
  <queue name="hadoop">
    <minResources>512mb,4vcores</minResources>
    <maxResources>20480mb,20vcores</maxResources>
    <maxRunningApps>100</maxRunningApps>
    <schedulingMode>fair</schedulingMode>
    <weight>2.0</weight>
    <aclSubmitApps>hadoop hadoop</aclSubmitApps>
    <aclAdministerApps>hadoop hadoop</aclAdministerApps>
  </queue>
  <queue name="develop">
    <minResources>512mb,4vcores</minResources>
    <maxResources>20480mb,20vcores</maxResources>
    <maxRunningApps>100</maxRunningApps>
    <schedulingMode>fair</schedulingMode>
    <weight>1</weight>
    <aclSubmitApps>develop develop</aclSubmitApps>
    <aclAdministerApps>develop develop</aclAdministerApps>
  </queue>
  <queue name="test1">
    <minResources>512mb,4vcores</minResources>
    <maxResources>20480mb,20vcores</maxResources>
    <maxRunningApps>100</maxRunningApps>
    <schedulingMode>fair</schedulingMode>
    <weight>1.5</weight>
    <aclSubmitApps>test1,hadoop,develop test1</aclSubmitApps>
    <aclAdministerApps>test1 group_businessC,supergroup</aclAdministerApps>
  </queue>
</queue>
</allocations>
```

##### 第三步：将修改后的配置文件拷贝到其他机器上

将`node01`修改后的`yarn-site.xml`和`fair-scheduler.xml`配置文件分发到其他服务器上面去

```
cd /kkb/install/hadoop-2.6.0-cdh5.14.2/etc/hadoop

[root@node01 hadoop]## scp yarn-site.xml fair-scheduler.xml node02:$PWD

[root@node01 hadoop]## scp yarn-site.xml fair-scheduler.xml node03:$PWD
```

##### 第四步：重启yarn集群

修改完`yarn-site.xml`配置文件之后，重启`yarn`集群，`node01`执行以下命令进行重启

```
[root@node01 hadoop]## cd /kkb/install/hadoop-2.6.0-cdh5.14.2/

[root@node01 hadoop-2.6.0-cdh5.14.2]## sbin/stop-yarn.sh
[root@node01 hadoop-2.6.0-cdh5.14.2]## sbin/start-yarn.sh
```

重新登陆node01:80088，可以看到，已经新增了几个队列。

![image-20200216231805711](hadoop.assets/image-20200216231805711.png)

#### 指定任务提交的队列

**指定mapreduce任务的提交队列：**

修改代码，添加我们`mapreduce`任务需要提交到哪一个队列里面去

```java
//在组装类的run方法里添加以下内容：
Configuration configuration = new Configuration();
configuration.set("mapred.job.queue.name", "develop"); //第二个参数是要指定的队列名称
```

**指定hive任务的提交队列：**

`hive-site.xml`

```xml
<property>
  <name>mapreduce.job.queuename</name>
  <value>test1</value>
</property>
```

**指定spark任务提交的队列**

1- 脚本方式

`--queue hadoop`

2- 代码方式

`saprkConf.set("yarn,spark.queue", "develop")`

## hadoop的企业级调优

#### HDFS参数调优hdfs-site.xml

(1) 设置参数`dfs.namenode.handler.count`

```java
dfs.namenode.handler.count=20 * log2(Cluster Size)
//该参数用来调整namenode处理客户端的线程数，根据20 * log2(Cluster Size)这个公式来估计即可，Cluster Size是集群的NameNode节点个数
```

比如集群规模为8台时，此参数设置为`60=20*log2(8)`

`NameNode`有一个工作线程池，用来处理不同`DataNode`的并发心跳以及客户端并发的元数据操作。对于大集群或者有大量客户端的集群来说，通常需要增大参数`dfs.namenode.handler.count`的默认值10。设置该值的一般原则是将其设置为集群大小的自然对数乘以`20`，即`20`log`N`，`N`为集群大小。

（2）编辑日志存储路径`dfs.namenode.edits.dir`设置与镜像文件存储路径`dfs.namenode.name.dir`尽量分开，达到最低写入延迟。

（3）元数据信息`fsimage`多目录冗余存储配置

#### YARN参数调优yarn-site.xml

**根据实际调整每个节点和单个任务申请内存值**

（1）`yarn.nodemanager.resource.memory-mb`

表示该节点上`YARN`可使用的物理内存总量，默认是8192（MB），注意，如果你的节点内存资源不够8GB，则需要调减小这个值，而`YARN`不会智能的探测节点的物理内存总量。

（2）`yarn.scheduler.maximum-allocation-mb`

单个任务可申请的最多物理内存量，默认是8192（MB）。

**Hadoop宕机**

（1）如果`MR`造成系统宕机。此时要控制`Yarn`同时运行的任务数，和每个任务申请的最大内存。调整参数：`yarn.scheduler.maximum-allocation-mb`（单个任务可申请的最多物理内存量，默认是8192MB）

（2）如果写入文件过量造成`NameNode`宕机。那么调高`Kafka`的存储大小，控制从`Kafka`到`HDFS`的写入速度。高峰期的时候用`Kafka`进行缓存，高峰期过去数据同步会自动跟上。

#### mapreduce运行慢的主要原因

1、计算机性能出现瓶颈：

- `CPU`、内存、磁盘健康、网络

2、I/O`操作需要优化`：

- 数据倾斜
- `Map`和`Reduce`数目设置不合理
- `map`运行时间太长、导致`reduce`等待太久
- 小文件过多
- 大量的不可分块的超大文件
- Spill溢写次数过多
- Merge次数过多等

#### mapreduce的优化方法

`MapReduce`优化方法主要从六个方面考虑：数据输入、`Map`阶段、`Reduce`阶段、`IO`传输、数据倾斜问题和常用的调优参数。

##### 数据输入阶段

- 合并小文件
- 采用`CombineTextInputFormat`作为输入类，解决输入端大量小文件场景

 

##### MapTask运行阶段

- 减少溢写`Spill`次数:

  通过调整`io.sort.mb`参数来增大环形缓冲区大小，通过调整`sort.spill.percent`参数增大达到溢写条件的百分比。

- 减少合并`Merge`次数:

  通过调整io.sort.factor参数，增大Merge的文件数目，从而减少合并次数。

- 在`Map`之后，不影响业务逻辑的前提下，优先考虑进行规约`Combine`处理，减少`I/O`的使用

##### ReduceTask运行阶段

- 合理设置Maptask和reducetask个数，不能太少不能太多。

  太少会导致task等待，延长处理时间

  太多会导致Maptask与reducetask间竞争资源，造成处理超时等错误

- 设置`Maptask`、`Reducetask`的共存时间：

  我们知道，在`Maptask`任务完成`5%`后，集群就开始启动`reducetask`，那么我们把5%调为更小的值的话，`reducetask`就启动得更快，可以提早把`reducetask`要使用地资源通过网络拉取过来，`maptask`和`reducetask`的共存时间就更长了。

- 能不用`Reducetas`k就不使用`Reducetask`

  因为`reduce`连接数据集的时候会产生大量的网络消耗。

- 合理设置`Reduce`端的`Buffer`

  在`reducetask`的`copy`阶段，`ReduceTask`从各个`MapTask`上远程拷贝一片数据，并针对某一片数据，如果其大小超过一定阈值，则写到磁盘（`hdfs`文件系统）上，否则直接放到内存`Buffer`中。如果数据写到了磁盘上，我们`reduce`是直接从磁盘读数据来运行任务的，效率较低。

  那么我们可以设置`mapreduce.reduce.input.buffer.percent`参数来指定`Buffer`中的一定比例的数据可以直接给`reduce`任务使用。但是要合理设置，以免占用过多内存资源。

  ![image-20200217031403739](hadoop.assets/image-20200217031403739.png)

##### IO传输阶段

- 压缩数据，减少数据量
- 使用SequenceFile二进制文件 

##### 数据倾斜问题

- 数据频率倾斜：某个区域数据量远远大于其它区域
- 数据大小倾斜：部分记录的大小远远大于平均值

**解决方法：**

方法1：抽样和范围分区，原理示意图如下：

方法2：自定义分区

方法3：进行规约`Combine`

方法4：采用`map join`，避免使用`reduce join`

 **抽样和范围分区的原理示意图如下：**

![image-20200217033905846](hadoop.assets/image-20200217033905846.png)

##### 常用的调优参数

###### 资源相关参数

以下参数是在用户自己的`Mapreduce`应用程序中配置就可以生效（`mapred-default.xml`）

| 配置参数                                      | 参数说明                                                     |
| --------------------------------------------- | ------------------------------------------------------------ |
| mapreduce.map.memory.mb                       | 一个MapTask可使用的资源上限（单位:MB），默认为1024。如果MapTask实际使用的资源量超过该值，则会被强制杀死。 |
| mapreduce.reduce.memory.mb                    | 一个ReduceTask可使用的资源上限（单位:MB），默认为1024。如果ReduceTask实际使用的资源量超过该值，则会被强制杀死。 |
| mapreduce.map.cpu.vcores                      | 每个MapTask可使用的最多cpu core数目，默认值: 1               |
| mapreduce.reduce.cpu.vcores                   | 每个ReduceTask可使用的最多cpu core数目，默认值: 1            |
| mapreduce.reduce.shuffle.parallelcopies       | 每个Reduce去Map中取数据的并行数。默认值是5                   |
| mapreduce.reduce.shuffle.merge.percent        | Buffer中的数据达到多少比例开始写入磁盘。默认值0.66           |
| mapreduce.reduce.shuffle.input.buffer.percent | Buffer大小占Reduce可用内存的比例。默认值0.7                  |
| mapreduce.reduce.input.buffer.percent         | 指定多少比例的内存用来存放Buffer中的数据，默认值是0.0        |

以下参数应该在`YARN`启动之前就配置在服务器的配置文件中才能生效（`yarn-default.xml`）

| 配置参数                                 | 参数说明                                        |
| ---------------------------------------- | ----------------------------------------------- |
| yarn.scheduler.minimum-allocation-mb     | 给应用程序Container分配的最小内存，默认值：1024 |
| yarn.scheduler.maximum-allocation-mb     | 给应用程序Container分配的最大内存，默认值：8192 |
| yarn.scheduler.minimum-allocation-vcores | 每个Container申请的最小CPU核数，默认值：1       |
| yarn.scheduler.maximum-allocation-vcores | 每个Container申请的最大CPU核数，默认值：32      |
| yarn.nodemanager.resource.memory-mb      | 给Containers分配的最大物理内存，默认值：8192    |

###### Shuffle性能优化的关键参数

应在YARN启动之前就配置好（`mapred-default.xml`）

| 配置参数                         | 参数说明                          |
| -------------------------------- | --------------------------------- |
| mapreduce.task.io.sort.mb        | Shuffle的环形缓冲区大小，默认100m |
| mapreduce.map.sort.spill.percent | 环形缓冲区溢出的阈值，默认80%     |

###### 容错相关参数(MapReduce性能优化)

| 配置参数                     | 参数说明                                                     |
| ---------------------------- | ------------------------------------------------------------ |
| mapreduce.map.maxattempts    | 每个Map Task最大重试次数，一旦重试参数超过该值，则认为Map Task运行失败，默认值：4。 |
| mapreduce.reduce.maxattempts | 每个Reduce Task最大重试次数，一旦重试参数超过该值，则认为Map Task运行失败，默认值：4。 |
| mapreduce.task.timeout       | Task超时时间，经常需要设置的一个参数，该参数表达的意思为：如果一个Task在一定时间内没有任何进入，即不会读取新的数据，也没有输出数据，则认为该Task处于Block状态，可能是卡住了，也许永远会卡住，为了防止因为用户程序永远Block住不退出，则强制设置了一个该超时时间（单位毫秒），默认是600000。如果你的程序对每条输入数据的处理时间过长（比如会访问数据库，通过网络拉取数据等），建议将该参数调大，该参数过小常出现的错误提示是“AttemptID:attempt_14267829456721_123456_m_000224_0  Timed out after 300 secsContainer killed by the ApplicationMaster.”。 |

 

## hdfs小文件解决方案总结

#### 小文件的问题弊端

`HDFS`上每个文件都要在`NameNode`上建立一个索引，这个索引的大小约为`150byte`，这样当小文件比较多的时候，就会产生很多的索引文件，一方面会大量占用`NameNode`的内存空间，另一方面就是索引文件过大使得索引速度变慢。

#### 小文件的解决方案

小文件的优化无非以下几种方式：

（1）在数据采集的时候，就将小文件或小批数据合成大文件再上传`HDFS`。

（2）在业务处理之前，在`HDFS`上使用`MapReduce`程序对小文件进行合并。

（3）在`MapReduce`处理时，可采用`CombineTextInputFormat`提高效率。

- `Hadoop archive`

  小文件打包成一个文件

- `Sequence File`

  二进制的key/value组成的文件，用来将大批小文件合并成一个大文件

- `CombineFileInputFormat`

  一个输入类，可以将多个文件合并成一个分片

- 开启`JVM`重用

  对于大量小文件的`Job`,可以开启`JVM`重用，大约会减少15%的运行时间。

  原理：一个`map`运行在一个JVM上（可看成容器的JVM？），该`map`在`JVM`上运行完毕后，JVM继续运行其它map。

  将参数`mapreduce.job.jvm.numtasks`的值设为`10-20`之间即可。

  JVM重用机制示意图如下：

![image-20200217041652352](hadoop.assets/image-20200217041652352.png)