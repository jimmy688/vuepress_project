## CentOS 7安装MySQL5.7版本

##### 安装mysql

###### 下载并安装mysql官方的yum源

若是在学完Hadoop、ZooKeeper课程后，接着要学习Hive课程时，需要先安装mysql，安装到第三个节点node03上。在CentOS 7中默认安装有MariaDB，这个是MySQL的分支；但还是要安装MySQL，而且安装完成之后会直接覆盖掉MariaDB。

- 使用root用户
- 进入/kkb/soft目录，并安装wget软件

```shell
[hadoop@node03 ~]$ su root
[root@node03 hadoop]## cd /kkb/soft/
[root@node03 soft]## yum -y install wget
```

> 出现`Installed`!字样，表示成功安装

- 使用`wget`命令下载`mysql`的`rpm`包

```shell
[root@node03 soft]## wget -i -c http://dev.mysql.com/get/mysql57-community-release-el7-10.noarch.rpm
```

> -i 指定输入文件
>
> -c 表示断点续传

###### 安装mysql

```sh
[root@node03 soft]## yum -y install mysql57-community-release-el7-10.noarch.rpm
```

![](hive.assets/Image201910301549.png)

- 安装mysql server

  这步可能会花些时间，需要在线下载，视网速而定；然后再安装；安装完成后就会覆盖掉之前的mariadb

```shell
[root@node03 soft]## yum -y install mysql-community-server
```

![](hive.assets/Image201910301601.png)



##### 设置mysql

###### 启动mysql服务

- 首先启动MySQL服务

```shell
[root@node03 soft]## systemctl start mysqld.service
```

- 查看mysql启动状态

```
[root@node03 soft]## systemctl status mysqld.service
```

下图active（running）表示mysql服务已启动

![](hive.assets/Image201910301608.png)

###### 修改密码

- 此时MySQL已经开始正常运行，不过要登陆MySQL，还得先找出此时mysql的root用户的临时密码

  如下命令可以在日志文件中找出临时密码

```shell
[root@node03 hadoop]## grep "password" /var/log/mysqld.log
```

- 注意：==不同人的临时密码不一样，根据自己的实际情况而定==，可以查看到我的临时密码为

```
fHy3Su:&REkh
```

![](hive.assets/Image201910301623.png)

- 使用临时密码，登陆`mysql`客户端

```sql
[root@node03 hadoop]## mysql -uroot -p
```

- 设置密码策略为LOW，此策略只检查密码的长度

```sql
set global validate_password_policy=LOW;
```

![](hive.assets/Image201910301634.png)

> 关键字“`Query OK`”表示，`sql`语句执行成功

- 设置密码最小长度

```sql
set global validate_password_length=6;
```

![](hive.assets/Image201910301639.png)

- 修改`mysql`的`root`用户，本地登陆的密码为`123456`

```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY '123456';
```

- 开启`mysql`的远程连接权限

```sql
grant all privileges  on  *.* to 'root'@'%' identified by '123456' with grant option;
flush privileges;
```

- 若不再需要使用`mysql`命令行，可以退出

```sql
exit
```



##### mysql的卸载

==注意：mysql安装有问题的，才做此步骤==

- 上面我们在CentOS 7当中已经安装好了5.7版本的mysql服务；
- 如果以后我们不需要mysql了，或者mysql安装失败了需要重新安装，那么我们需要将mysql卸载掉
- ==使用root用户==

###### 4.1 停止mysql服务

```shell
[root@node03 hadoop]## systemctl stop mysqld.service
```

###### 4.2 列出已安装的mysql相关的包

- 有两种方式，都可以，任选其一

  方式一

```shell
[root@node03 hadoop]## yum list installed mysql*
```

![](hive.assets/Image201910311059.png)

​		方式二

```shell
[root@node03 hadoop]## rpm -qa | grep -i mysql
```

![](hive.assets/Image201910311055.png)

###### 4.3 卸载mysql包

- 卸载rpm包，使用rpm -e --nodeps方式卸载，后边依次加入上图的①~⑥的包名，包名之间有空格

  > 注意：==根据自己的实际情况，指定包名进行卸载==

```shell
[root@node03 hadoop]## rpm -e --nodeps mysql57-community-release-el7-10.noarch mysql-community-common-5.7.28-1.el7.x86_64 mysql-community-client-5.7.28-1.el7.x86_64 mysql-community-libs-compat-5.7.28-1.el7.x86_64 mysql-community-libs-5.7.28-1.el7.x86_64 mysql-community-server-5.7.28-1.el7.x86_64
```

- 卸载完后，用两个命令再次确认，mysql相关的包已经被卸载

  > 注意：确保mysql卸载干净，再继续往下操作

```shell
[root@node03 hadoop]## rpm -qa | grep -i mysql
[root@node03 hadoop]## yum list installed mysql*
```

![](hive.assets/Image201910311128.png)

###### 4.4 删除mysql残留文件

- 查看mysql相关目录

```shell
[root@node03 hadoop]## find / -name mysql
```

> 根据自己的实际情况，删除find出来的目录

![](hive.assets/Image201910311202.png)

```shell
[root@node03 hadoop]## rm -rf /var/lib/mysql/
[root@node03 hadoop]## rm -rf /usr/share/mysql/
[root@node03 hadoop]## rm -rf /etc/selinux/targeted/active/modules/100/mysql
```

- 另外删除文件：

```shell
[root@node03 hadoop]## rm -rf /root/.mysql_history
[root@node03 hadoop]## rm -f /var/log/mysqld.log
```

## Hive安装部署

### 安装前准备

1. 安装好对应版本的`hadoop`集群（三节点），并启动`hadoop`的`HDFS`以及`YARN`服务
2. `Node03`安装了`MySQL`服务，并启动`MySQL`的服务

### 安装注意事项

注意`hive`就是==一个构建数据仓库的工具==，只需要在==一台服务器上==安装就可以了，不需要在多台服务器上安装。 此处以安装到`node03`为例；

使用==hadoop普通用户==操作

### 安装步骤

##### 准备安装包

* 通过浏览器下载`hive`的安装包

  * http://archive.cloudera.com/cdh5/cdh/5/hive-1.1.0-cdh5.14.2.tar.gz

* 上传安装包到`node03`服务器中的`/kkb/soft`路径下

##### 解压安装包

* 解压安装包到指定的规划目录`/kkb/install`

  ```shell
  [hadoop@node03 ~]$ cd /kkb/soft/
  [hadoop@node03 soft]$ tar -xzvf hive-1.1.0-cdh5.14.2.tar.gz -C /kkb/install/
  ```

##### 修改配置文件

###### 修改==配置文件hive-env.sh==

- 进入到`Hive`的安装目录下的`conf`文件夹中

```shell
[hadoop@node03 soft]$ cd /kkb/install/hive-1.1.0-cdh5.14.2/conf/
```

- 重命名`hive-env.sh.template`

```shell
[hadoop@node03 conf]$ mv hive-env.sh.template hive-env.sh
```

- 修改`hive-env.sh`

```shell
[hadoop@node03 conf]$ vim hive-env.sh 
```

- 如下，修改此文件中`HADOOP_HOME`、`HIVE_CONF_DIR`的值（根据自己机器的实际情况配置）

```shell
#配置HADOOP_HOME路径
HADOOP_HOME=/kkb/install/hadoop-2.6.0-cdh5.14.2/

#配置HIVE_CONF_DIR路径
export HIVE_CONF_DIR=/kkb/install/hive-1.1.0-cdh5.14.2/conf
```

![](hive.assets/Image201911011509.png)

###### 修改==配置文件hive-site.xml==

* `conf`目录下默认没有此文件，`vim`创建即可

```shell
[hadoop@node03 conf]$ vim hive-site.xml
```

- 文件内容如下

```xml
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
<configuration>
    	<!--指定元数据存储在mysql的哪个数据库里-->
        <property>
                <name>javax.jdo.option.ConnectionURL</name>
                <value>jdbc:mysql://node03:3306/hive?createDatabaseIfNotExist=true&amp;characterEncoding=latin1&amp;useSSL=false</value>
        </property>

        <property>
                <name>javax.jdo.option.ConnectionDriverName</name>
                <value>com.mysql.jdbc.Driver</value>
        </property>
        <property>
                <name>javax.jdo.option.ConnectionUserName</name>
                <value>root</value>
        </property>
        <property>
                <name>javax.jdo.option.ConnectionPassword</name>
                <value>123456</value>
        </property>
        <property>
                <name>hive.cli.print.current.db</name>
                <value>true</value>
        </property>
        <property>
                <name>hive.cli.print.header</name>
            <value>true</value>
        </property>
    	<property>
                <name>hive.server2.thrift.bind.host</name>
                <value>node03</value>
        </property>
</configuration>
```

###### 修改日志配置文件hive-log4j.properties

创建`hive`日志存储目录

```sh
[hadoop@node03 conf]$ mkdir -p /kkb/install/hive-1.1.0-cdh5.14.2/logs/
```

重命名生成文件`hive-log4j.properties`

```shell
[hadoop@node03 conf]$ pwd
/kkb/install/hive-1.1.0-cdh5.14.2/conf
[hadoop@node03 conf]$ mv hive-log4j.properties.template hive-log4j.properties
[hadoop@node03 conf]$ vim hive-log4j.properties ## 修改文件
```

修改此文件的`hive.log.dir`属性的值

  ```sh
#更改以下内容，设置我们的hive的日志文件存放的路径，便于排查问题
hive.log.dir=/kkb/install/hive-1.1.0-cdh5.14.2/logs/
  ```

![](hive.assets/Image201911011631.png)

##### 拷贝mysql驱动包

- 上传`mysql`驱动包，如`mysql-connector-java-5.1.38.jar`到`/kkb/soft`目录中

- 由于运行`hive`时，需要向`mysql`数据库中读写元数据，所以==需要将mysql的驱动包上传到hive的lib目录下==

```shell
[hadoop@node03 ~]$ cd /kkb/soft/
[hadoop@node03 soft]$ cp mysql-connector-java-5.1.38.jar /kkb/install/hive-1.1.0-cdh5.14.2/lib/
```

##### 配置Hive环境变量

- 切换到`root`用户下

```shell
[hadoop@node03 soft]$ su root
Password:
```

- 打开`/etc/profile`文件

```shell
[root@node03 soft]## vim /etc/profile
```

- 末尾添加如下内容

```properties
export HIVE_HOME=/kkb/install/hive-1.1.0-cdh5.14.2
export PATH=$PATH:$HIVE_HOME/bin
```

- 切换回hadoop用户，并source

```shell
[root@node03 soft]## su - hadoop
[hadoop@node03 soft]$ source /etc/profile
```

##### 验证安装

- ==hadoop集群已启动==
- ==mysql服务已启动==
- 在`node03`上任意目录启动`hive cli`命令行客户端

```shell
[hadoop@node03 ~]$ hive
```

- 查看有哪些数据库

```
show databases;
```

![](hive.assets/Image201912101710.png)

- 说明`hive`安装成功
- 退出`cli`

```sql
quit;
```



## Hive学习前的准备

1. 安装好对应版本的`hadoop`集群（3节点），并启动`hadoop`的`HDFS`以及`YARN`服务
2. `MySQL`安装部署及讲解视频。
3. `Hive`安装部署及讲解视频。
4. `Hive`的`DDL`操作预习及讲解视频。



## 数据仓库

##### 数据仓库的基本概念

- 数据仓库的英文名称为`Data Warehouse`，可简写为`DW`或`DWH`。

- 数据仓库的目的是构建**面向分析**的集成化数据环境，为企业提供决策支持（`Decision Support`）。它出于分析性报告和决策支持的目的而创建。

- 数据仓库本身并不“生产”任何数据，同时自身也不需要“消费”任何的数据，数据来源于外部，并且开放给外部应用，这也是为什么叫“仓库”，而不叫“工厂”的原因。

##### 数据仓库的主要特征

- 数据仓库是面向主题的（`Subject-Oriented`）、集成的（`Integrated`）、非易失的（`Non-Volatile`）和时变的（`Time-Variant` ）数据集合，用以支持管理决策。
  - 面向主题：数仓构建时，主要看我们所要分析的业务，然后将相关业务（主题）的数据汇聚到数仓里。
  - 集成性：将所有数据源中于主题相关的数据，汇聚在一起。
  - 非易失性：数据一旦进入数仓，基本不会做修改。
  - 时变性：数仓中数据分析的手段（工具）会变

##### 数据仓库与数据库区别 

- 数据库与数据仓库的区别实际讲的是`OLTP` 与 `OLAP` 的区别。 

- 操作型处理，叫联机事务处理 `OLTP`（`On-Line Transaction Processing`），也可以称面向交易的处理系统，它是针对具体业务在数据库联机的日常操作，通常对少数记录进行查询、修改。用户较为关心操作的响应时间、数据的安全性、完整性和并发支持的用户数等问题。传统的数据库系统作为数据管理的主要手段，主要用于操作型处理`OLTP`。 

- 分析型处理，叫联机分析处理 `OLAP`（`On-Line Analytical Processing`），一般针对某些主题的历史数据进行分析，支持管理决策。

- 首先要明白，数据仓库的出现，并不是要取代数据库，数仓也不是大型的数据库。

  - 数据库是面向事务的设计，数据仓库是面向主题设计的。

  - 数据库一般存储业务数据，数据仓库存储的一般是历史数据。

  - **数据库**设计是尽量避免冗余，一般针对某一业务应用进行设计；比如一张简单的`User`表，记录用户名、密码等简单数据即可，符合业务应用，但是不符合分析；**数据仓库**在设计是有意引入冗余，依照分析需求，分析维度、分析指标进行设计。

  - 数据库是为捕获数据而设计，数据仓库是为分析数据而设计。

    - 以银行业务为例。数据库是事务系统的数据平台，客户在银行做的每笔交易都会写入数据库，被记录下来，这里，可以简单地理解为用数据库记账。数据仓库是分析系统的数据平台，它从事务系统获取数据，并做汇总、加工，为决策者提供决策的依据。比如，某银行某分行一个月发生多少交易，该分行当前存款余额是多少。如果存款又多，消费交易又多，那么该地区就有必要设立ATM了。 

    - 显然，银行的交易量是巨大的，通常以百万甚至千万次来计算。事务系统是实时的，这就要求时效性，客户存一笔钱需要几十秒是无法忍受的，这就要求数据库只能存储很短一段时间的数据。而分析系统是事后的，它要提供**关注时间段内**所有的有效数据。这些数据是海量的，汇总计算起来也要慢一些，但是，只要能够提供有效的分析数据就达到目的了。 

  - 数据仓库，是在数据库已经大量存在的情况下，为了进一步挖掘数据资源、为了决策需要而产生的，它决不是所谓的“大型数据库”。

##### 数据仓库分层架构

- 按照数据流入流出的过程，数据仓库架构可分为三层——**源数据层**、**数据仓库层**、**数据应用层。**                            

- 数据仓库的数据来源于不同的源数据，并提供多样的数据应用，数据自下而上流入数据仓库后向上层开放应用，而数据仓库只是中间集成化数据管理的一个平台。

- **源数据层（贴源层）（ODS）**：此层数据无任何更改，直接沿用外围系统数据结构和数据，不对外开放；为临时存储层，是接口数据的临时存储区域，为后一步的数据处理做准备。

- **数据仓库层（`DW`）**：也称为细节层，DW层的数据应该是一致的、准确的、干净的数据，即对源系统数据进行了清洗（去除了杂质）后的数据。

- **数据应用层（数据展示层）（`DA`或`APP`）**：前端应用直接读取的数据源；根据报表、专题分析需求而计算生成的数据。

- 数据仓库从各数据源获取数据及在数据仓库内的数据转换和流动都可以认为是`ETL`（抽取`Extra`, 转化`Transfer`, 装载`Load`）的过程，`ETL`是数据仓库的流水线，也可以认为是数据仓库的血液，它维系着数据仓库中数据的新陈代谢，而数据仓库日常的管理和维护工作的大部分精力就是保持ETL的正常和稳定。

- 为什么要对数据仓库分层？

  - 用空间换时间，通过大量的预处理来提升应用系统的用户体验（效率），因此数据仓库会存在大量冗余的数据；不分层的话，如果源业务系统的业务规则发生变化将会影响整个数据清洗过程，工作量巨大。
- 通过数据分层管理可以简化数据清洗的过程，因为把原来一步的工作分到了多个步骤去完成，相当于把一个复杂的工作拆成了多个简单的工作，把一个大的黑盒变成了一个白盒，每一层的处理逻辑都相对简单和容易理解，这样我们比较容易保证每一个步骤的正确性，当数据发生错误的时候，往往我们只需要局部调整某个步骤即可。

> **通俗理解：**
>
> - 贴源层（`ODS`）:用于保管原始数据
> - 数据仓库层（`DW`）: 主要用于数据分析，主要工作都在这一层，主要写`hql（hive quere language)`
> - 数据展示层 (`app`)：将上边分析的结构在此层展示。



## Hive的概念

Hive是基于`Hadoop`的一个数据仓库工具

- ==可以将结构化的数据文件映射为一张数据库中的表==，并提供类`SQL`查询功能。

- 其本质是将`SQL`转换为`MapReduce`的任务进行运算，底层由HDFS来提供数据的存储支持，说白了`hive`可以理解为一个将`SQL`转换为`MapReduce`任务的工具，甚至更进一步可以说hive就是一个MapReduce的客户端。

![](hive.assets/Snipaste_2019-07-10_23-23-31.png)

![image-20200222030244998](hive.assets/image-20200222030244998.png)

## Hive与数据库的区别

![](hive.assets/2018040319335283.png)

- Hive 具有 SQL 数据库的外表，但应用场景完全不同。

- ==Hive 只适合用来做海量离线数据统计分析，也就是数据仓库==。

## Hive的优缺点

- ==优点==
  - **操作接口采用类SQL语法**，提供快速开发的能力（简单、容易上手）。

  - **避免了去写MapReduce**，减少开发人员的学习成本。

  - **Hive支持用户自定义函数**，用户可以根据自己的需求来实现自己的函数。

- ==缺点==

  - **Hive 的查询延迟很严重**

  - **Hive 不支持事务**

## Hive架构原理![](hive.assets/2019-07-11_11-08-35.png)

- 1、用户接口：`Client`

  - `CLI（hive shell）`

  - `JDBC/ODBC`(`java`访问`hive`)--》启动`hiveserver2`，通过`jdbc`协议访问`hive`，`hiveserver2`支持高并发。

  - `WEBUI`（浏览器访问`hive`）

- 2、元数据：`Metastore`

  - 元数据包括：表名、表所属的数据库（默认是`default`）、表的拥有者、列/分区字段、表的类型（是否是外部表）、表的数据所在目录等；

  - 元数据默认存储在自带的`derby`数据库中，==推荐使用MySQL存储Metastore==。

  - 我们安装`hive`时，在配置文件里设置了元数据保存在`node03`的`mysql`的某个数据库里。如下：

    ```xml
    <property>
        <name>javax.jdo.option.ConnectionURL</name
        <value>jdbc:mysql://node03:3306/hive?createDatabaseIfNotExist=true&amp;characterEncoding=latin1&amp;useSSL=false</value>
    </property>
    ```

    ![image-20200222032619327](hive.assets/image-20200222032619327.png)

  

- 3、`Hadoop`集群

  - 使用`HDFS`进行存储，使用`MapReduce`进行计算。

- 4、`Driver`：驱动器

  - 解析器（`SQL Parser`） 

    - 将`SQL`字符串转换成抽象语法树`AST`

    - 对`AST`进行语法分析，比如表是否存在、字段是否存在、`SQL`语义是否有误

  - 编译器（`Physical Plan`）：将`AST`编译生成逻辑执行计划

  - 优化器（`Query Optimizer`）：对逻辑执行计划进行优化

  - 执行器（`Execution`）：把逻辑执行计划转换成可以运行的物理计划。对于`Hive`来说默认就是`mapreduce`任务

![hive1](hive.assets/hive1.png)



## Hive的交互方式 

- Hive的交互方式主要有三种

- 使用`Hive`之前：

  - ==先启动hadoop集群==：因为`hql`语句会被编译成`MR`任务提交到集群运行；`hive`表数据一般存储在`HDFS`上

  - ==mysql服务==：因为对`hive`操作过程中，需要访问`mysql`中存储元数据的库及表

#### Hive交互shell（过时了）

- 在任意路径运行`hive`

```shell
[hadoop@node03 ~]$ hive
```

![](hive.assets/Image201912101741.png)

#### Hive JDBC服务（企业中使用）

##### 第一步：启动hiveserver2服务

`Hive`的`hiveserver2`服务本质上是实现了`JDBC`的接口，所以我们可以以各种方式使用`JDBC`连接它，在终端可以使用`beeline`，连接`Hive`的`server`，用法和`hive shell`一致。

有两种方式启动`hiveserver2`服务：前台启动与后台启动方式二选一，前台启动会有输出到控制台，后台启动不会有输出到控制台。

- 前台启动

```shell
[hadoop@node03 ~]$ hive --service hiveserver2 
```

  - 后台启动（推荐使用）

```shell
[hadoop@node03 ~]$ nohup hive --service hiveserver2 &
#或者
[hadoop@node03 ~]$ nohup hive --service hiveserver2 2>&1
```

![](hive.assets/Image201912101745.png)

##### 第二步：beeline连接hiveserver2服务

若是前台启动`hiveserver2`，请再开启一个新会话窗口，然后使用`beeline`连接`hiveserver2`。`hiveserver2`的服务端口默认是`10000`


```
[hadoop@node03 ~]$ beeline
beeline> !connect jdbc:hive2://node03:10000
```

`hive`用户名写`hadoop`即可，关键是这个用户要有对`hdfs`操作的权限，密码为空即可。

![](hive.assets/Image201912101749.png)

##### 查看帮助信息

```shell
0: jdbc:hive2://node03:10000> help
```

![](hive.assets/Image201912101754.png)

##### 退出

使用`!quit`进行退出。

```shell
0: jdbc:hive2://node03:10000> !quit
Closing: 0: jdbc:hive2://node03:10000
[hadoop@node03 ~]$
```

##### 关闭hiveserver2

```sql
## jps查看hiveserver2进程号
kill -9 进程号
```



#### Hive的命令（不需要进入hive shell)

##### 第一种方式：hive  -e hql语句

使用 `–e` 参数来直接执行`hql`语句

```shell
[hadoop@node03 ~]$ hive -e "show databases"
```

##### 第二种方式：hive  -f  sql文件

使用 `–f`参数执行包含`hql`语句的文件

`node03`执行以下命令准备`hive`执行脚本

```shell
[hadoop@node03 ~]$ vim hive.sql
```

文件内容如下

```sql
create database if not exists myhive;
```

通过以下命令来执行我们的`hive`脚本

```shell
[hadoop@node03 ~]$ hive -f hive.sql
```

查看效果，成功执行`hql`语句，创建`myhive`数据库

![image-20200222041116597](hive.assets/image-20200222041116597.png)



#### 查看创建的数据库存放到hdfs的位置

登录到`node03`的`mysql`，查看元数据，从而获知我们创建的数据库放到`hdfs`哪里了。

> 登录`mysql`的时候使用`root`用户，密码为`123456`。
>
> 为什么使用`root`用户？因为我们安装`hive`的时候，在配置文件里面已经指定是`root`用户了。
>
> ```xml
> <property>
>  <name>javax.jdo.option.ConnectionUserName</name>
>  <value>root</value>
> </property>
> <property>
>  <name>javax.jdo.option.ConnectionPassword</name>
>  <value>123456</value>
> </property>
> ```
>
> 如果没有`root`用户的权限怎么办？能不能换个`mysql`用户登录？
>
> 答案是可以的，解决方法如下，首先使用`mysql`的`root`用户登录`mysql`，然后添加一个普通用户，比如说，用户名为`jimmy`，密码为`123456`，最后修改`hive`的配置文件内容：
>
> ```xml
> <property>
>  <name>javax.jdo.option.ConnectionUserName</name>
>  <value>jimmy</value>
> </property>
> <property>
>  <name>javax.jdo.option.ConnectionPassword</name>
>  <value>123456</value>
> </property>
> ```
>
> 最后，还要给普通用户`jimmy`配置一些权限：
>
> ```sql
> grant all privileges  on  hive.* to 'jimmy'@'%' identified by '123456' with grant option;
> flush privileges;
> ```
>
> 

**查看元数据方式：**

1. 选择使用里面的`hive`数据库：`use hive;`
2. 查看`hive`数据库里面的`DBS`表：`select　* from DBS;`
3. 查看元数据信息，可看到：`hdfs://node01:8020/user/hive/warehouse/myhive.db`就是我们创建的数据库在`hdfs`中的位置，而且创建用户显示是`hadoop`。
4. 数据库在`HDFS`上的默认存储路径是==/user/hive/warehouse/数据库名.db==

```sql
mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| hive               |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
5 rows in set (0.00 sec)

mysql> use hive
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
mysql> show tables;
+---------------------------+
| Tables_in_hive            |
+---------------------------+
| BUCKETING_COLS            |
| CDS                       |
| COLUMNS_V2                |
| DATABASE_PARAMS           |
| DBS                       |
| FUNCS                     |
| FUNC_RU                   |
| GLOBAL_PRIVS              |
| PARTITIONS                |
| PARTITION_KEYS            |
| PARTITION_KEY_VALS        |
| PARTITION_PARAMS          |
| PART_COL_STATS            |
| ROLES                     |
| SDS                       |
| SD_PARAMS                 |
| SEQUENCE_TABLE            |
| SERDES                    |
| SERDE_PARAMS              |
| SKEWED_COL_NAMES          |
| SKEWED_COL_VALUE_LOC_MAP  |
| SKEWED_STRING_LIST        |
| SKEWED_STRING_LIST_VALUES |
| SKEWED_VALUES             |
| SORT_COLS                 |
| TABLE_PARAMS              |
| TAB_COL_STATS             |
| TBLS                      |
| VERSION                   |
+---------------------------+
29 rows in set (0.00 sec)

mysql> select * from DBS;
+-------+-----------------------+--------------------------------------------------+---------+------------+------------+
| DB_ID | DESC                  | DB_LOCATION_URI                                  | NAME    | OWNER_NAME | OWNER_TYPE |
+-------+-----------------------+--------------------------------------------------+---------+------------+------------+
|     1 | Default Hive database | hdfs://node01:8020/user/hive/warehouse           | default | public     | ROLE       |
|     6 | NULL                  | hdfs://node01:8020/user/hive/warehouse/myhive.db | myhive  | hadoop     | USER       |
+-------+-----------------------+--------------------------------------------------+---------+------------+------------+
2 rows in set (0.00 sec)
```

```shell
[hadoop@node01 ~]$ hdfs dfs -ls /user/hive/warehouse/
Found 1 items
drwxr-xr-x   - hadoop supergroup 0 2020-02-22 11:56 /user/hive/warehouse/myhive.db
```

## Hive客户端JDBC操作

#### 启动hiveserver2

`node03`执行以下命令启动`hiveserver2`的服务端

```shell
cd /kkb/install/hive-1.1.0-cdh5.14.2/
nohup bin/hive --service hiveserver2 2>&1 &
```

#### 引入依赖

- 创建`maven`工程，引入依赖

```xml
   <repositories>
        <repository>
            <id>cloudera</id>
            <url>https://repository.cloudera.com/artifactory/cloudera-repos/</url>
        </repository>
    </repositories>
    <dependencies>
        <dependency>
            <groupId>org.apache.hive</groupId>
            <artifactId>hive-exec</artifactId>
            <version>1.1.0-cdh5.14.2</version>
        </dependency>
        <dependency>
            <groupId>org.apache.hive</groupId>
            <artifactId>hive-jdbc</artifactId>
            <version>1.1.0-cdh5.14.2</version>
        </dependency>
        <dependency>
            <groupId>org.apache.hive</groupId>
            <artifactId>hive-cli</artifactId>
            <version>1.1.0-cdh5.14.2</version>
        </dependency>
        <dependency>
            <groupId>org.apache.hadoop</groupId>
            <artifactId>hadoop-common</artifactId>
            <version>2.6.0-cdh5.14.2</version>
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
                    <!--    <verbal>true</verbal>-->
                </configuration>
            </plugin>
        </plugins>
    </build>
```

#### 代码开发

```java
import java.sql.*;

public class HiveJDBC {
    private static String url="jdbc:hive2://192.168.52.120:10000/myhive";
    public static void main(String[] args) throws Exception {
        Class.forName("org.apache.hive.jdbc.HiveDriver");
        //获取数据库连接
        Connection connection = DriverManager.getConnection(url, "hadoop","");
        //定义查询的sql语句
        String sql="select * from stu";
        try {
            PreparedStatement ps = connection.prepareStatement(sql);
            ResultSet rs = ps.executeQuery();
            while (rs.next()){
                //获取id字段值
                int id = rs.getInt(1);
                //获取deptid字段
                String name = rs.getString(2);
                System.out.println(id+"\t"+name);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```





## Hive的数据类型

#### 基本数据类型

|    类型名称    |              描述               |    举例    |
| :------------: | :-----------------------------: | :--------: |
|    boolean     |           true/false            |    true    |
|    tinyint     |        1字节的有符号整数        |     1      |
|    smallint    |        2字节的有符号整数        |     1      |
|  ==**int**==   |        4字节的有符号整数        |     1      |
| **==bigint==** |        8字节的有符号整数        |     1      |
|     float      |        4字节单精度浮点数        |    1.0     |
| **==double==** |        8字节单精度浮点数        |    1.0     |
| **==string==** |        字符串(不设长度)         |   “abc”    |
|    varchar     | 字符串（1-65355长度，超长截断） |   “abc”    |
|   timestamp    |             时间戳              | 1563157873 |
|      date      |              日期               |  20190715  |

#### 复合数据类型

| 类型名称 |                             描述                             |        举例         |
| :------: | :----------------------------------------------------------: | :-----------------: |
| `array`  | 一组**有序**的字段，**字段类型必须相同** array(元素1，元素2) |  `Array（1,2,3）`   |
|  `map`   |         一组**无序**的**键值对** `map(k1,v1,k2,v2)`          | `Map(‘a’,1,'b',2)`  |
| `struct` | 一组命名的字段，**字段类型可以不同** `struct(元素1，元素2)`  | `Struct('a',1,2,0)` |

- `array`类型的字段的元素访问方式
  - 通过下标获取元素，下标从`0`开始
  - 如获取第一个元素
    - `array[0]`

- `map`类型字段的元素访问方式
  - 通过键获取值
  - 如获取`a`这个`key`对应的`value`
    - `map['a']`

- `struct`类型字段的元素获取方式
  - 定义一个字段`c`的类型为`struct{a int, b string}`
  - 获取`a`和`b`的值
    - 使用`c.a` 和`c.b` 获取其中的元素值
  - 这里可以把这种类型看成是一个对象
- 示例：创建一张表，包含了`array、map、struct`类型的字段

```sql
create table complex(
         col1 array<int>,
         col2 map<string,int>,
         col3 struct<a:string,b:int,c:double>
)
```

## Hive官网（学会查找帮助）

平时工作中，要多查看[Hive官方文档](<https://cwiki.apache.org/confluence/display/Hive/Home>)

`hive`官网：https://hive.apache.org/

`Hql`使用帮助：https://cwiki.apache.org/confluence/display/Hive/LanguageManual

## Hive的DDL操作--数据库

下列的所有操作默认使用`beeline`方式。

##### 创建数据库

```sql
create database db1;
## 或者
create database if not exists db1;
```

##### 显示所有数据库

```sql
0: jdbc:hive2://node03:10000> show databases;
+----------------+--+
| database_name  |
+----------------+--+
| db1            |
| default        |
| myhive         |
+----------------+--+
```

##### 查询数据库	

```sql
0: jdbc:hive2://node03:10000> show databases like 'db*';
+----------------+--+
| database_name  |
+----------------+--+
| db1            |
+----------------+--+
1 row selected (0.064 seconds)
```

##### 查看数据库详情

```sql
0: jdbc:hive2://node03:10000> desc db1;
Error: Error while compiling statement: FAILED: SemanticException [Error 10001]: Table not found db1 (state=42S02,code=10001)
0: jdbc:hive2://node03:10000> desc database db1;
+----------+----------+------------------------------------------------+-------------+-------------+-------------+--+
| db_name  | comment  |                    location                    | owner_name  | owner_type  | parameters  |
+----------+----------+------------------------------------------------+-------------+-------------+-------------+--+
| db1      |          | hdfs://node01:8020/user/hive/warehouse/db1.db  | hadoop      | USER        |             |
+----------+----------+------------------------------------------------+-------------+-------------+-------------+--+
1 row selected (0.048 seconds)
```

##### 显示数据库更详细信息

```sql
desc database extended db1;
```

##### 切换当前数据库

```sql
use db_hive;
```

##### 删除数据库

```sql
#删除为空的数据库
drop database db_hive;

#如果删除的数据库不存在，最好采用if exists 判断数据库是否存在
drop database if exists db_hive;

#如果数据库中有表存在，这里需要使用cascade强制删除数据库
drop database if exists db_hive cascade;
```

## Hive的DDL操作--表

使用帮助的官网地址：https://cwiki.apache.org/confluence/display/Hive/LanguageManual+DDL

#### 建表语法介绍

```sql
CREATE [EXTERNAL] TABLE [IF NOT EXISTS] table_name 
[(col_name data_type [COMMENT col_comment], ...)] 
[COMMENT table_comment] 
[PARTITIONED BY (col_name data_type [COMMENT col_comment], ...)] 分区
[CLUSTERED BY (col_name, col_name, ...) 分桶
[SORTED BY (col_name [ASC|DESC], ...)] INTO num_buckets BUCKETS] 
[ROW FORMAT row_format]  row format delimited fields terminated by “分隔符”
[STORED AS file_format] 
[LOCATION hdfs_path]
```

字段解释说明

- `CREATE TABLE`	创建一个指定名字的表
- `EXTERNAL`       创建一个外部表，在建表的同时指定一个指向实际数据的路径（`LOCATION`），指定表的数据保存在哪里。
- `COMMENT`       为表和列添加注释
- `PARTITIONED BY`    创建分区表
- `CLUSTERED BY`    创建分桶表
- `SORTED BY`    按照字段排序（一般不常用）
- `ROW FORMAT`    指定每一行中字段的分隔符，`hive`默认使用`'\001'`非打印字符作为分隔符
  - r`ow format delimited fields terminated by ‘\t’`
- `STORED AS`    指定存储文件类型
  - 常用的存储文件类型：`SEQUENCEFILE`（二进制序列文件）、`TEXTFILE`（文本）、`ORCFILE`（列式存储格式文件）
  - 如果文件数据是纯文本，可以使用`STORED AS TEXTFILE`。如果数据需要压缩，使用 `STORED AS SEQUENCEFILE`
- `LOCATION`    指定表在`HDFS上`的存储位置。

示例：创建内部表并指定字段之间的分隔符，指定文件的存储格式。

```sql
use db1;

create table if not exists t1(id int, name string)
row format delimited fields terminated by '\t' 
stored as textfile;
```



#### 创建内部表

##### 第一种方法

使用**标准的建表语句**直接建表

```sql
use myhive;
create table stu(id int, name string);

#可以通过insert into向hive表当中插入数据，但是不建议工作当中这么做；因为每个insert语句转换成mr后会生成一个文件
insert into stu(id,name) values(1,"zhangsan");

0: jdbc:hive2://node03:10000> select * from stu;
+---------+-----------+--+
| stu.id  | stu.name  |
+---------+-----------+--+
| 1       | zhangsan  |
+---------+-----------+--+
1 row selected (0.224 seconds)
```

##### 第二种方法

**查询建表法**：通过`AS` 查询语句完成建表，将子查询的结果存入新表里

```sql
create table if not exists myhive.stu1 as select id, name from stu;
#将select id, name from stu的结果存入到myhive.stu1表了

#表中有数据
0: jdbc:hive2://node03:10000> select * from	 stu2;
+----------+------------+--+
| stu2.id  | stu2.name  |
+----------+------------+--+
| 1        | zhangsan   |
+----------+------------+--+
1 row selected (0.117 seconds)
```

##### 第三种方法

**`like`建表法**：根据存在的表的结构来创建表

```sql
create table if not exists myhive.stu2 like stu;

#表中没有数据
0: jdbc:hive2://node03:10000> select * fro	m stu3;
+----------+------------+--+
| stu3.id  | stu3.name  |
+----------+------------+--+
+----------+------------+--+
No rows selected (0.113 seconds)
```

#### 查看表的结构

```sql
0: jdbc:hive2://node03:10000> desc stu;
+-----------+------------+----------+--+
| col_name  | data_type  | comment  |
+-----------+------------+----------+--+
| id        | int        |          |
| name      | string     |          |
+-----------+------------+----------+--+
2 rows selected (0.113 seconds)
```

#### 查询表的详情

```sql
0: jdbc:hive2://node03:10000> desc formatted stu;
+-------------------------------+----------------------------------------------------+
|           col_name            |                     data_type                      |
+-------------------------------+----------------------------------------------------+
| ## col_name                    | data_type                                          |
|                               | NULL                                               |
| id                            | int                                                |
| name                          | string                                             |
|                               | NULL                                               |
| ## Detailed Table Information  | NULL                                               |
| Database:                     | myhive                                             |
| Owner:                        | hadoop                                             |
| CreateTime:                   | Sat Feb 22 14:05:26 CST 2020                       |
| LastAccessTime:               | UNKNOWN                                            |
| Protect Mode:                 | None                                               |
| Retention:                    | 0                                                  |
| Location:                     | hdfs://node01:8020/user/hive/warehouse/myhive.db/stu
| Table Type:                   | MANAGED_TABLE                                      |
| Table Parameters:             | NULL                                               |
|                               | COLUMN_STATS_ACCURATE                              |
|                               | numFiles                                           |
|                               | numRows                                            |
|                               | rawDataSize                                        |
|                               | totalSize                                          |
|                               | transient_lastDdlTime                              |
|                               | NULL                                               |
| ## Storage Information         | NULL                                               |
| SerDe Library:                | org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe |
| InputFormat:                  | org.apache.hadoop.mapred.TextInputFormat           |
| OutputFormat:                 | org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutput
| Compressed:                   | No                                                 |
| Num Buckets:                  | -1                                                 |
| Bucket Columns:               | []                                                 |
| Sort Columns:                 | []                                                 |
| Storage Desc Params:          | NULL                                               |
|                               | serialization.format                               |
+-------------------------------+----------------------------------------------------+

#我们可以看到一行：Table Type: | MANAGED_TABLE ，表明该表是内部表，内部表又叫管理表。
```



#### 创建外部表

**外部表：**

- 外部表因为是指定其他的`hdfs`路径的数据加载到表当中来
- 所以`hive`表会认为自己不完全独占这份数据，所以删除`hive`表的时候，数据仍然存放在`hdfs`当中，不会删掉。
- 为什么使用？因为，有时候这份数据不仅仅你的团队在用，有可能其它团队也要用，因此为了防止数据被删除，要使用外部表。
- 一般情况下：`ods`层是贴源层，建的表一般使用外部表，而`dw`层，表是属于自己的，可以使用内部表。

**创建外部表：**

- 创建外部表的时候需要加上**==external==** 关键字
- `location`字段可以指定，也可以不指定
  - 指定就是数据存放的具体目录
  - 不指定就是使用默认目录 ==/user/hive/warehouse==

```sql
create external table t_teacher (t_id string, t_name string) 
row format delimited fields terminated by "\t";
```

```sql
0: jdbc:hive2://node03:10000> desc formatted t_teacher;
+-------------------------------+----------------------------------------------------+
|           col_name            |                     data_type                      |
+-------------------------------+----------------------------------------------------+
| ## col_name                    | data_type                                          |
|                               | NULL                                               |
| t_id                          | string                                             |
| t_name                        | string                                             |
|                               | NULL                                               |
| ## Detailed Table Information  | NULL                                               |
| Database:                     | db1                                                |
| Owner:                        | hadoop                                             |
| CreateTime:                   | Sat Feb 22 17:56:08 CST 2020                       |
| LastAccessTime:               | UNKNOWN                                            |
| Protect Mode:                 | None                                               |
| Retention:                    | 0                                                  |
| Location:                     | hdfs://node01:8020/user/hive/warehouse/db1.db/t_teac
| Table Type:                   | EXTERNAL_TABLE                                     |
| Table Parameters:             | NULL                                               |
|                               | EXTERNAL                                           |
|                               | transient_lastDdlTime                              |
|                               | NULL                                               |
| ## Storage Information         | NULL                                               |
| SerDe Library:                | org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe |
| InputFormat:                  | org.apache.hadoop.mapred.TextInputFormat           |
| OutputFormat:                 | org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutput
| Compressed:                   | No                                                 |
| Num Buckets:                  | -1                                                 |
| Bucket Columns:               | []                                                 |
| Sort Columns:                 | []                                                 |
| Storage Desc Params:          | NULL                                               |
|                               | field.delim                                        |
|                               | serialization.format                               |
+-------------------------------+----------------------------------------------------+
29 rows selected (0.084 seconds)

#Table Type:                   | EXTERNAL_TABLE   
```



#### 外部表加载数据

我们前面已经看到过通过`insert`的方式向内部表当中插入数据，外部表也可以通过`insert`的方式进行插入数据，**只不过`insert`的方式，我们一般都不推荐**

==实际工作当中我们都是使用`load`的方式来加载数据到内部表或者外部表==

`load`数据可以从本地文件系统加载或者也可以从`hdfs`上面的数据进行加载

###### 第一种方式：从本地文件系统加载到外部表中去

从本地文件系统加载数据到`teacher`表当中去

- 将我们附件当汇总的数据资料都上传到`node03`服务器的`/kkb/install/hivedatas`路径下面去

```shell
mkdir -p /kkb/install/hivedatas
```

- 将数据都上传到`/kkb/install/hivedatas`路径下
- 然后在`hive`客户端下执行以下操作

```shell
load data local inpath '/kkb/install/hivedatas/teacher.csv' into table myhive.teacher;
```

###### 第二种方式：从hdfs文件系统加载到外部表中去

从`hdfs`上面加载文件到`teacher`表里面去。

将`teacher.csv`文件上传到`hdfs`的`/kkb/hdfsload/hivedatas`路径下，注意，这种方式是将`hdfs`文件的数据剪切到表中，源文件会被删除。

```shell
cd /kkb/install/hivedatas
hdfs dfs -mkdir -p /kkb/hdfsload/hivedatas
hdfs dfs -put teacher.csv /kkb/hdfsload/hivedatas
## 在hive的客户端当中执行
load data inpath '/kkb/hdfsload/hivedatas' overwrite into table myhive.teacher;
#加上overrite关键字，会把原数据覆盖掉
```



#### 内部表与外部表的互相转换

- 1、内部表转换为外部表

```sql
#将stu内部表改为外部表
alter table stu set tblproperties('EXTERNAL'='TRUE');
```

- 2、外部表转换为内部表

```sql
#把teacher外部表改为内部表
alter table teacher set tblproperties('EXTERNAL'='FALSE');
```

#### 内部表与外部表的区别

- 1、建表语法的区别
  - 外部表在创建的时候需要加上==external==关键字

- 2、删除表之后的区别
  - 内部表删除后，表的元数据和真实数据都被删除了
  - 外部表删除后，仅仅只是把该表的元数据删除了，真实数据还在，后期还是可以恢复出来

###### 内部表与外部表的使用时机

- 内部表由于删除表的时候会同步删除`HDFS`的数据文件，所以确定如果一个表仅仅是你独占使用，其他人不使用的时候就可以创建内部表，如果一个表的文件数据，其他人也要使用，那么就创建外部表

- 一般外部表都是用在数据仓库的`ODS`层

- 内部表都是用在数据仓库的`DW`层

## hive的分区表

###### 分区表的理解

- 如果`hive`当中所有的数据都存入到一个文件夹下面，那么在使用`MR`计算程序的时候，读取一整个目录下面的所有文件来进行计算（全表扫描），就会变得特别慢，因为数据量太大了
- 实际工作当中一般都是计算前一天的数据，所以我们只需要将前一天的数据挑出来放到一个文件夹下面即可，专门去计算前一天的数据。
- 这样就可以使用`hive`当中的分区表，通过分文件夹的形式，将每一天的数据都分成为一个文件夹，然后我们计算数据的时候，通过指定前一天的文件夹即可只计算前一天的数据。
- 在大数据中，最常用的一种思想就是分治，我们可以把大的文件切割划分成一个个的小的文件，这样每次操作一个小的文件就会很容易了，同样的道理，在`hive`当中也是支持这种思想的，就是我们可以把大的数据，按照每天，或者每小时进行切分成一个个的小的文件，这样去操作小的文件就会容易得多了。
- 在文件系统上建立文件夹，把表的数据放在不同文件夹下面，加快查询速度。**示意图如下：**

![image-20200223014153794](hive.assets/image-20200223014153794.png)



###### 创建分区表语法

```sql
create table score(s_id string, c_id string, s_score int) partitioned by (month string) row format delimited fields terminated by '\t';
```

###### 创建一个表带多个分区

```sql
create table score2 (s_id string,c_id string, s_score int) partitioned by (year string, month string, day string) row format delimited fields terminated by '\t';
```

###### 加载数据到分区表特定的分区当中去

```sql
load data local inpath '/kkb/install/hivedatas/score.csv' into table score partition (month='201806');
```

`score.csv`文件内容如下。

```
01	01	80
01	02	90
01	03	99
02	01	70
02	02	60
02	03	80
03	01	80
03	02	80
03	03	80
04	01	50
04	02	30
04	03	20
05	01	76
05	02	87
06	01	31
06	03	34
07	02	89
07	03	98
```

###### 加载数据到多分区表当中去

```sql
load data local inpath '/kkb/install/hivedatas/score.csv' into table score2 partition(year='2018', month='06', day='01');
```

###### 查看表的分区

```sql
0: jdbc:hive2://node03:10000> show partitions score;
+---------------+--+
|   partition   |
+---------------+--+
| month=201806  |
+---------------+--+
1 row selected (0.096 seconds)

0: jdbc:hive2://node03:10000> show partitions score2;
+----------------------------+--+
|         partition          |
+----------------------------+--+
| year=2018/month=06/day=01  |
+----------------------------+--+
1 row selected (0.074 seconds)
```

###### 添加一个分区

使用add partition(xxx='xxx')关键字添加分区

```sql
0: jdbc:hive2://node03:10000> alter table score add partition (month='201805');
No rows affected (0.123 seconds)
0: jdbc:hive2://node03:10000> show partitions score;
+---------------+--+
|   partition   |
+---------------+--+
| month=201805  |
| month=201806  |
+---------------+--+
2 rows selected (0.084 seconds)
```

###### 同时添加多个分区

```sql
alter table score add partition(month='201804') partition(month = '201803');
```

 注意：添加分区之后就可以在`hdfs`文件系统当中看到表下面多了一个文件夹

![image-20200223015740174](hive.assets/image-20200223015740174.png)

![image-20200223020152320](hive.assets/image-20200223020152320.png)

###### 删除分区

```sql
alter table score drop partition(month = '201806');
```



## 外部分区表综合练习

###### **需求描述：**

- 现在有一个文件`score.csv`文件，里面有三个字段，分别是`s_id string, c_id string, s_score int`
- 字段都是使用 `\t`进行分割
- 存放在`hdfs`集群的这个目录下`/scoredatas/day=20180607`，这个文件每天都会生成，存放到对应的日期文件夹下面去
- 文件别人也需要公用，不能移动
- 请创建`hive`对应的表，并将数据加载到表中，进行数据统计分析，且删除表之后，数据不能删除

###### **需求实现:**

- `node03`执行以下命令，将数据上传到`hdfs`上面去

  将我们的`score.csv`上传到`node03`服务器的`/kkb/install/hivedatas`目录下，然后将`score.csv`文件上传到`HDFS`的`/scoredatas/day=20180607`目录上

```shell
cd /kkb/install/hivedatas/
hdfs dfs -mkdir -p /scoredatas/day=20180607
hdfs dfs -put score.csv /scoredatas/day=20180607/
## 这里切记切记！！！！！！！，不要写成/scoredatas/20180607，否则表的修复那一步会出错
## 因为下面建立外部分区表的时候，指定通过day string 来进行分区
```

- 创建外部分区表，并指定文件数据存放目录

```sql
create external table score5(s_id string, c_id string, s_score int) partitioned by (day string) row format delimited fields terminated by '\t' location '/scoredatas';
```

- 进行表的修复，说白了就是建立我们表与我们数据文件之间的一个关系映射，之前因为是用`load`来加载数据的，所有没有这一步。修复成功之后即可看到数据已经全部加载到表当中去了。

```sql
0: jdbc:hive2://node03:10000> msck repair table score5;
No rows affected (0.11 seconds)
0: jdbc:hive2://node03:10000> select * from score5;
+--------------+--------------+-----------------+-------------+--+
| score5.s_id  | score5.c_id  | score5.s_score  | score5.day  |
+--------------+--------------+-----------------+-------------+--+
| 01           | 01           | 80              | 20180607    |
| 01           | 02           | 90              | 20180607    |
| 01           | 03           | 99              | 20180607    |
| 02           | 01           | 70              | 20180607    |
| 02           | 02           | 60              | 20180607    |
| 02           | 03           | 80              | 20180607    |
| 03           | 01           | 80              | 20180607    |
| 03           | 02           | 80              | 20180607    |
| 03           | 03           | 80              | 20180607    |
| 04           | 01           | 50              | 20180607    |
| 04           | 02           | 30              | 20180607    |
| 04           | 03           | 20              | 20180607    |
| 05           | 01           | 76              | 20180607    |
| 05           | 02           | 87              | 20180607    |
| 06           | 01           | 31              | 20180607    |
| 06           | 03           | 34              | 20180607    |
| 07           | 02           | 89              | 20180607    |
| 07           | 03           | 98              | 20180607    |
+--------------+--------------+-----------------+-------------+--+
18 rows selected (0.165 seconds)
```



## hive的复合类型使用说明和实战

##### 1、参数说明

```sql
#创建表的时候可以指定每行数据的格式,如果使用的是复合数据类型，还需要指定复合数据类型中的元素分割符
ROW FORMAT DELIMITED 
	[FIELDS TERMINATED BY char [ESCAPED BY char]] 
	[COLLECTION ITEMS TERMINATED BY char]
	[MAP KEYS TERMINATED BY char] 
	[LINES TERMINATED BY char]
		
#其中这里 
FIELDS TERMINATED BY char 	         #指定每一行记录中字段的分割符
COLLECTION ITEMS TERMINATED BY char  #指定复合类型中多元素的分割符
MAP KEYS TERMINATED BY char         #指定map集合类型中每一个key/value之间的分隔符
LINES TERMINATED BY char            #指定每行记录的换行符，一般有默认 就是\n 
```

##### 2、Array类型

array中的数据为相同类型，例如，假如array A中元素['a','b','c']，则A[1]的值为'b'

准备数据文件

```sh
vi /tmp/t_array.txt  (字段空格分割)

1 zhangsan beijing,shanghai
2 lisi shanghai,tianjin
```

建表语法

```sql
create table t_array(
id string,
name string,
locations array<string>
) row format delimited fields terminated by ' ' collection items terminated by ',';
```

加载数据

```sql
load data local inpath '/tmp/t_array.txt' into table t_array;
```

查询数据

```sql
select id,name,locations[0],locations[1] from t_array;
+-----+-----------+-----------+-----------+--+
| id  |   name    |    _c2    |    _c3    |
+-----+-----------+-----------+-----------+--+
| 1   | zhangsan  | beijing   | shanghai  |
| 2   | lisi      | shanghai  | tianjin   |
+-----+-----------+-----------+-----------+--+
```

##### 3、Map类型

map类型中存储key/value类型的数据，后期可以通过["指定key名称"]访问

准备数据文件

```
vi /tmp/t_map.txt  (字段空格分割)

1 name:zhangsan#age:30
2 name:lisi#age:40
```

建表语法

```sql
create table t_map(
id string,
info map<string,string>
) row format delimited fields terminated by ' ' collection items terminated by '#' map keys terminated by ':';
```

加载数据

```sql
load data local inpath '/tmp/t_map.txt' into table t_map;
```

查询数据

```sql
select id, info['name'], info['age'] from t_map;
+-----+-----------+------+--+
| id  |    _c1    | _c2  |
+-----+-----------+------+--+
| 1   | zhangsan  | 30   |
| 2   | lisi      | 40   |
+-----+-----------+------+--+
```



##### 4、Struct类型

Struct可以存储不同类型的数据，例如c的类型为struct{a INT; b INT}，我们可以通过c.a来访问域a

准备数据文件

```
vi /tmp/t_struct.txt  (字段空格分割)

1 zhangsan:30:beijing
2 lisi:40:shanghai
```

建表语法

```sql
create table t_struct(
id string,
info struct<name:string, age:int,address:String>
) row format delimited fields terminated by ' ' collection items terminated by ':' ;
```

加载数据

```sql
load data local inpath '/tmp/t_struct.txt' into table t_struct;
```

查询数据

```sql
select id,info.name,info.age,info.address from t_struct;
+-----+-----------+------+-----------+--+
| id  |   name    | age  |  address  |
+-----+-----------+------+-----------+--+
| 1   | zhangsan  | 30   | beijing   |
| 2   | lisi      | 40   | shanghai  |
+-----+-----------+------+-----------+--+
```



## hive拓展点1

* `hive cli`命令窗口查看本地文件系统

  * 与操作本地文件系统类似，这里需要使用 ! (感叹号)，并且最后需要加上 ;(分号) 

  * 例如

    ```
    !ls /home;
    ```

    ![](hive.assets/Image201912111127.png)

* `hive cli`命令窗口查看`HDFS`文件系统

  * 与查看`HDFS`文件系统类似

  ```
    dfs -ls /user;
  ```

    ![](hive.assets/Image201912111128.png)

* `hive`的底层执行引擎有3种

  * `mapreduce`(默认)
  * `tez`（支持`DAG`作业的计算框架）`mr1-->mr2 -->mr3`
  * `spark`（基于内存的分布式计算框架）





## Hive的分桶表

##### 分桶表介绍

分区表是为了减少扫描量，提高效率，那分桶表是干嘛的？分桶表的作用也是一样，只不过会进一步会细化而已。

分桶将整个数据内容按照某列属性值去`hash`值进行区分，具有相同的`hash`值的结果的数据进入到同一个文件中。

**形象比喻：**

- `select * from t1 where id % 4 =0;`
- `select * from t1 where id % 4 =1;`
- `select * from t1 where id % 4 =2;`
- `select * from t1 where id % 4 =3;`

![image-20200223031549369](hive.assets/image-20200223031549369.png)

##### 分桶表原理

- 分桶是相对分区进行**更细粒**度的划分

  - `Hive`表或分区表可进一步的分桶

  - 分桶将整个数据内容按照某列取`hash`值，对桶的个数取模的方式决定该条记录（行）存放在哪个桶当中；具有相同`hash`值的数据进入到同一个文件中。

  - 比如按照`name`属性分为`3`个桶，就是对`name`属性值的`hash`值对`3`取摸，按照取模结果对数据分桶。
    - 取模结果为 **0** 的数据记录存放到一个文件
    - 取模结果为 **1** 的数据记录存放到一个文件
    - 取模结果为 **2** 的数据记录存放到一个文件

- 如果一个表既分区又分桶，则必须先分区再分桶。如下：

  ```sql
  CREATE TABLE user_info_bucketed(user_id BIGINT, firstname STRING, lastname STRING)
  COMMENT 'A bucketed copy of user_info'  
  PARTITIONED BY(ds STRING)
  CLUSTERED BY(user_id) INTO 256 BUCKETS;
  
  ```

#COMMENT是注释的意思，对表的注释

  ```sql
  
  

##### 分桶表作用

- 1、取样`sampling`更高效。没有分区的话需要扫描整个数据集。

- 2、提升某些查询操作效率，例如`map side join`



## 案例演示：创建分桶表

- 在创建分桶表之前要执行的命令
- `set hive.enforce.bucketing=true;` 开启对分桶表的支持
- `set mapreduce.job.reduces=4; `    设置与桶相同的`reduce`个数（默认只有一个`reduce`）

- 进入`hive`客户端然后执行以下命令

​```sql
use db1;
set hive.enforce.bucketing=true; #千万不要写成set db1.enforce.bucketing=true;
set mapreduce.job.reduces=4;  

-- 创建分桶表
create table user_buckets_demo3(id int, name string)
clustered by(id) into 4 buckets 
row format delimited fields terminated by '\t';

-- 创建普通表
create table user_demo(id int, name string)
row format delimited fields terminated by '\t';
  ```

- 准备数据文件 `buckets.txt`

```shell
#在linux当中执行以下命令
cd /kkb/install/hivedatas/
vim user_bucket.txt

1	anzhulababy1
2	anzhulababy2
3	anzhulababy3
4	anzhulababy4
5	anzhulababy5
6	anzhulababy6
7	anzhulababy7
8	anzhulababy8
9	anzhulababy9
10	anzhulababy10
```

- 加载数据到普通表 user_demo 中

```sql
load data local inpath '/kkb/install/hivedatas/user_bucket.txt'  overwrite into table user_demo; 
```

  - 加载数据到桶表user_buckets_demo中。==无法通过load将数据加载到分桶表里==。

```sql
insert into table user_buckets_demo select * from user_demo;
--或者：
insert overwrite table user_buckets_demo select * from user_demo;
```

- hdfs上查看表的数据目录

![image-20200223050913526](hive.assets/image-20200223050913526.png)

- 下载表的数据文件，查看分桶情况：

```shell
#经查看，表的数据文件的内容如下：

#000000_0文件内容：即第1个桶的内容
8	anzhulababy8
4	anzhulababy4

#000000_1文件内容：即第2个桶的内容
9	anzhulababy9
5	anzhulababy5
1	anzhulababy1

#000000_2文件内容：即第3个桶的内容
10	anzhulababy10
6	anzhulababy6
2	anzhulababy2

#000000_3文件内容：即第4个桶的内容
7	anzhulababy7
3	anzhulabab
```

- 抽样查询分桶表的数据

  tablesample抽样语句语法：tablesample(bucket  x  out  of  y)

  - x表示从第几个桶开始取数据(1,2,3,4....)
  - y与进行采样的桶数的个数、每个采样桶的采样比例有关；
  - 比如说表的总共记录数 (行数) 有`10`个，`x=2,y=5`，那么要抽取的桶数为总记录数为`10*(2/5)=4`，并且先从第二个桶（x=2）开始抽取。

```sql
-- tablesample(bucket 1 out of 2);
-- 需要采样的记录数为10*(1/2)=5
-- 先从第1个桶中取出数据
0: jdbc:hive2://node03:10000> select * from user_buckets_demo3 tablesample(bucket 1 out of 2);
+------------------------+--------------------------+--+
| user_buckets_demo3.id  | user_buckets_demo3.name  |
+------------------------+--------------------------+--+
| 8                      | anzhulababy8             |
| 4                      | anzhulababy4             |
| 10                     | anzhulababy10            |
| 6                      | anzhulababy6             |
| 2                      | anzhulababy2             |
+------------------------+--------------------------+--+
5 rows selected (0.059 seconds)


-- tablesample(bucket 1 out of 3);
-- 需要采样的记录数为10*(1/3)=3.3=3
-- 先从第1个桶中取出数据
0: jdbc:hive2://node03:10000> select * from user_buckets_demo3 tablesample(bucket 1 out of 3);
+------------------------+--------------------------+--+
| user_buckets_demo3.id  | user_buckets_demo3.name  |
+------------------------+--------------------------+--+
| 9                      | anzhulababy9             |
| 6                      | anzhulababy6             |
| 3                      | anzhulababy3             |
+------------------------+--------------------------+--+
3 rows selected (0.1 seconds)
```



## Hive数据导入

##### 1、直接向表中插入数据（强烈不推荐使用）

  ```sql
insert into table score3 partition(month ='201807') values ('001','002','100');
  ```

##### 2、通过load加载数据（必须掌握）

```sql
load data [local] inpath 'dataPath' overwrite | into table student [partition (partcol1=val1,…)]; 
```

```sql
load data local inpath '/kkb/install/hivedatas/score.csv' overwrite into table score3 partition(month='201806');
```

##### 3、通过查询加载数据（必须掌握）

```sql
create table score5 like score;
insert overwrite table score5 partition(month = '201806') select s_id,c_id,s_score from score;
```

##### 4、查询语句中创建表并加载数据（as select）

```sql
create table score6 as select * from score;
```

##### 5、创建表时指定location

使用这种方式导入数据时，如果表是分区表，则必须在最后一步进行表的修复（映射）`msck repair table ...`。

- 创建表，并指定在`hdfs`上的位置

```sql
create external table score7 (s_id string,c_id string,s_score int) row format delimited fields terminated by '\t' location '/myscore7';
```

- 上传数据到`hdfs`上，可以直接在`hive`客户端下面通过`dfs`命令来进行操作`hdfs`的数据

```shell
0: jdbc:hive2://node03:10000> dfs -mkdir -p /myscore7;
0: jdbc:hive2://node03:10000> dfs -put /kkb/install/hivedatas/score.csv /myscore7;
```

- 查询数据

```sql
select * from score7;
```

##### 6、export导出与import 导入 hive表数据（内部表操作）

```sql
hive (myhive)> create table teacher2 like teacher;
hive (myhive)> export table teacher to  '/kkb/teacher';
hive (myhive)> import table teacher2 from '/kkb/teacher';
```



## Hive数据导出

##### 1 insert 导出

- 将查询的结果导出到本地

```sql
insert overwrite local directory '/kkb/install/hivedatas/stu' select * from stu;
```

- 将查询的结果**格式化**导出到本地

```sql
insert overwrite local directory '/kkb/install/hivedatas/stu2' row format delimited fields terminated by ',' select * from stu;
```

- 将查询的结果导出到`HDFS`上==(没有local)==

```sql
insert overwrite directory '/kkb/hivedatas/stu' row format delimited fields terminated by  ','  select * from stu;
```

##### 2  Hive Shell 命令导出

- 基本语法：

  - `hive -e "sql语句"` >   `file`
  - `hive -f  sql文件`   >    `file`

```shell
## 输出重定向：
hive -e 'select * from myhive.stu;' > /kkb/install/hivedatas/student1.txt
```

##### 3 export导出到HDFS上

```sql
export table  myhive.stu to '/kkb/install/hivedatas/stuexport';
```



## Hive静态分区

- 表的分区字段的值需要开发人员手动给定

- 创建分区表

```sql
use db1;
create table order_partition(
order_number string,
order_price  double,
order_time string
)
partitioned BY(month string)  --特别注意这里，partitioned by的参数是我们自己定义的
row format delimited fields terminated by '\t';
```


- 准备数据

```shell
cd /kkb/install/hivedatas
vim order.txt 

10001	100	2019-03-02
10002	200	2019-03-02
10003	300	2019-03-02
10004	400	2019-03-03
10005	500	2019-03-03
10006	600	2019-03-03
10007	700	2019-03-04
10008	800	2019-03-04
10009	900	2019-03-04
```

- 加载数据到分区表

```sql
load data local inpath '/kkb/install/hivedatas/order.txt' overwrite into table order_partition partition(month='2019-03');
```

  - 查询结果数据，可以看到，查询`2019-3`的数据，会将所有数据都查出来，不符合我们的需求

```sql
select * from order_partition where month='2019-03';
#结果为：
+-----+-------+--------------+----------+ 
10001   100.0   2019-03-02      2019-03
10002   200.0   2019-03-02      2019-03
10003   300.0   2019-03-02      2019-03
10004   400.0   2019-03-03      2019-03
10005   500.0   2019-03-03      2019-03
10006   600.0   2019-03-03      2019-03
10007   700.0   2019-03-04      2019-03
10008   800.0   2019-03-04      2019-03
10009   900.0   2019-03-04      2019-03
+-----+-------+--------------+----------+ 
```


## Hive动态分区

动态分区：按照需求实现把数据自动导入到表的不同分区中，==不需要手动指定==

**需求：根据分区字段不同的值，自动将数据导入到分区表不同的分区中** 

- 创建表

```sql
--创建普通表/临时表
create table t_order(
    order_number string,
    order_price  double, 
    order_time   string
)row format delimited fields terminated by '\t';

--创建目标分区表
create table order_dynamic_partition(
    order_number string,
    order_price  double    
)partitioned BY(order_time string) --特别注意这里，partitioned by的参数是临时表中的某一个字段
row format delimited fields terminated by '\t';
```

- 准备数据

```shell
cd /kkb/install/hivedatas
vim order_partition.txt

10001	100	2019-03-02 
10002	200	2019-03-02
10003	300	2019-03-02
10004	400	2019-03-03
10005	500	2019-03-03
10006	600	2019-03-03
10007	700	2019-03-04
10008	800	2019-03-04
10009	900	2019-03-04
```

- 向普通表`t_order`加载数据

```sql
load data local inpath '/kkb/install/hivedatas/order_partition.txt' overwrite into table t_order;
```

- 动态加载数据到分区表中

```sql
-- 要想进行动态分区，需要设置参数
-- 开启动态分区功能
set hive.exec.dynamic.partition=true; 
-- 设置hive为非严格模式
set hive.exec.dynamic.partition.mode=nonstrict; 
insert into table order_dynamic_partition partition(order_time) select order_number, order_price, order_time from t_order;
```

- 查看分区

```sql
show partitions order_dynamic_partition;
```

![1569313506031](hive.assets/1569313506031.png)

总结，动态加载数据的步骤：

1. 创建一个普通表/临时表
2. 创建一个目标表，==目标表根据普通表的某个字段来分区==
3. 将数据load到临时表中去
4. 通过查询临时表将数据加载到目标表中去，特别注意：insert into table order_dynamic_partition **partition(order_time)** select order_number, order_price, order_time from t_order; 



## Hive修改表结构 

##### 修改表的名称

```sql
-- 修改表名称语法:
alter table  old_table_name  rename to  new_table_name;
```

```sql
alter table stu3 rename to stu4;
```

##### 增加/修改/替换列

- 查看表结构

```sql
desc stu4;
desc formatted stu4;
```

* [官网文档](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+DDL#LanguageManualDDL-AlterColumn)
* 增加列

```sql
hive> alter table stu4 add columns(address string);
```

* 修改列

```sql
hive> alter table stu4 change column address address_id int;
```



## Hive查询语法---基本查询

- 注意
  - SQL 语言==大小写不敏感==
  - SQL 可以写在一行或者多行
  - ==关键字不能被缩写也不能分行==
  - 各子句一般要分行写
  - 使用缩进提高语句的可读性

###### 5.1.1 查询全表和特定列

- 全表查询

```sql
select * from stu;
```

- 选择特定列查询

```sql
select id,name from stu;
```

###### 5.1.2 列起别名

- 重命名一个列

  - 紧跟列名，也可以在列名和别名之间加入关键字 ‘as’ 

- 案例实操

```sql
select id,name as stuName from stu;
```

###### 5.1.3 常用函数

- 求总行数（count）

```sql
 select count(*) cnt from score;
 
 --count(*)是对行数目进行计数，不论是否包含NULL值
 --count(column_name)是对列中不为空的行进行计数
 --使用groupby与count函数时，要注意，使用方式如下
 	--SELECT species, COUNT(*) FROM pet GROUP BY species;正确的
 	--SELECT owner, COUNT(*) FROM pet;错误的
 --使用COUNT( )，你不必检索整个表，如下面的sql语句：
 	SELECT species, sex, COUNT(*) FROM pet
    -> WHERE species = 'dog' OR species = 'cat'
    -> GROUP BY species, sex;
 --count(1)与count(*)的作用的相同的
```

- 求分数的最大值（max）

```sql
select max(s_score) from score;
```

- 求分数的最小值（min）

```sql
select min(s_score) from score;
```

- 求分数的总和（sum）

```sql
select sum(s_score) from score;
```

- 求分数的平均值（avg）

```sql
select avg(s_score) from score;
```

###### 5.1.4 limit 语句

- `imit`子句用于限制返回的行数。

```sql
 select  * from score limit 5;
```

###### 5.1.5 where 语句

- 使用 where 子句，将不满足条件的行过滤掉
- ==where 子句紧随from子句==
- 案例实操

```sql
select * from score where s_score > 60;
```

###### 5.1.6 算术运算符

| 运算符 | 描述           |
| ------ | -------------- |
| A+B    | A和B 相加      |
| A-B    | A减去B         |
| A*B    | A和B 相乘      |
| A/B    | A除以B         |
| A%B    | A对B取余       |
| A&B    | A和B按位取与   |
| A\|B   | A和B按位取或   |
| A^B    | A和B按位取异或 |
| ~A     | A按位取反      |

###### 5.1.7 比较运算符

|         操作符          | 支持的数据类型 |                             描述                             |
| :---------------------: | :------------: | :----------------------------------------------------------: |
|           A=B           |  基本数据类型  |             如果A等于B则返回true，反之返回false              |
|          `A<=>B`          |  基本数据类型  | 如果A和B都为NULL，则返回true，其他的和等号（=）操作符的结果一致，如果任一为NULL则结果为NULL |
|       `A<>B`, A!=B        |  基本数据类型  | A或者B为NULL则返回NULL；如果A不等于B，则返回true，反之返回false |
|           A<B           |  基本数据类型  | A或者B为NULL，则返回NULL；如果A小于B，则返回true，反之返回false |
|          A<=B           |  基本数据类型  | A或者B为NULL，则返回NULL；如果A小于等于B，则返回true，反之返回false |
|           A>B           |  基本数据类型  | A或者B为NULL，则返回NULL；如果A大于B，则返回true，反之返回false |
|          A>=B           |  基本数据类型  | A或者B为NULL，则返回NULL；如果A大于等于B，则返回true，反之返回false |
| A [NOT] BETWEEN B AND C |  基本数据类型  | 如果A，B或者C任一为NULL，则结果为NULL。如果A的值大于等于B而且小于或等于C，则结果为true，反之为false。如果使用NOT关键字则可达到相反的效果。 |
|        A IS NULL        |  所有数据类型  |           如果A等于NULL，则返回true，反之返回false           |
|      A IS NOT NULL      |  所有数据类型  |          如果A不等于NULL，则返回true，反之返回false          |
|    IN(数值1, 数值2)     |  所有数据类型  |                  使用 IN运算显示列表中的值                   |
|     A [NOT] LIKE B      |  STRING 类型   | B是一个SQL下的简单正则表达式，如果A与其匹配的话，则返回true；反之返回false。B的表达式说明如下：‘x%’表示A必须以字母‘x’开头，‘%x’表示A必须以字母’x’结尾，而‘%x%’表示A包含有字母’x’,可以位于开头，结尾或者字符串中间。如果使用NOT关键字则可达到相反的效果。like不是正则，而是通配符 |
|  A RLIKE B, A REGEXP B  |  STRING 类型   | B是一个正则表达式，如果A与其匹配，则返回true；反之返回false。匹配使用的是JDK中的正则表达式接口实现的，因为正则也依据其中的规则。例如，正则表达式必须和整个字符串A相匹配，而不是只需与其字符串匹配。 |

###### 5.1.8 逻辑运算符

|  操作符  |  操作  |                   描述                    |
| :------: | :----: | :---------------------------------------: |
| A AND  B | 逻辑并 |    如果A和B都是true则为true，否则false    |
| A  OR  B | 逻辑或 | 如果A或B或两者都是true则为true，否则false |
|  NOT  A  | 逻辑否 |      如果A为false则为true,否则false       |

## Hive查询语法---分组查询

###### 5.2.1 Group By 语句

- Group By语句通常会和==聚合函数==一起使用，按照一个或者多个列对结果进行分组，然后对每个组执行聚合操作。

- 案例实操：

  - 计算每个学生的平均分数

  ```sql
  select s_id, avg(s_score) from score group by s_id;
  ```

  - 计算每个学生最高的分数

  ```sql
  select s_id, max(s_score) from score group by s_id;
  ```

###### 5.2.2 Having语句

==having是group by后用来进一步过滤数据的。==

- having 与 where 不同点

  - where针对==表中的列发挥作用==，查询数据；==having针对查询结果中的列==发挥作用，筛选数据
  - where后面==不能写分组函数==，而having后面可以==使用分组函数==
  - having只用于group by分组统计语句

- 案例实操

  - 求每个学生的平均分数

  ```sql
  select s_id, avg(s_score) from score group by s_id;
  ```

  - 求每个学生平均分数大于60的人

  ```sql
  select s_id, avg(s_score) as avgScore from score group by s_id having avgScore > 60;
  ```

## Hive查询语法---连接查询（跨表）

#### 等值 join

- Hive支持通常的SQL JOIN语句，但是只支持等值连接，==不支持非等值连接==。

- 案例实操

  - 根据学生和成绩表，查询学生姓名对应的成绩

  ```sql
  select * from stu left join score on stu.id = score.s_id
  ```

#### 表的别名

- 好处

  - 使用别名可以简化查询。
  - 使用表名前缀可以提高执行效率。

- 案例实操：合并老师与课程表

  ```sql
  -- hive当中创建course表并加载数据
  create table course (c_id string, c_name string, t_id string) 
  row format delimited fields terminated by '\t';
  
  load data local inpath '/kkb/install/hivedatas/course.csv' overwrite into table course;
  
  select * from teacher t join course c on t.t_id = c.t_id;
  ```

#### 内连接 inner join

- 内连接：只有进行连接的两个表中都存在与连接条件相匹配的数据才会被保留下来。

  - join默认是inner  join

- 案例实操

  ```sql
  select * from teacher t inner join course c  on t.t_id = c.t_id;
  ```

#### 左外连接 left outer join

- 左外连接：

  - join操作符==左边表中==符合where子句的所有记录将会被返回。
  - 右边表的指定字段没有符合条件的值的话，那么就使用null值替代。

- 案例实操：查询老师对应的课程

  ```sql
   select * from teacher t left outer join course c on t.t_id = c.t_id;
  ```

#### 右外连接 right outer join

- 右外连接：

  - join操作符==右边表中==符合where子句的所有记录将会被返回。
  - 左边表的指定字段没有符合条件的值的话，那么就使用null值替代。

- 案例实操

  ```sql
   select * from teacher t right outer join course c on t.t_id = c.t_id;
  ```

#### 满外连接 full outer join

- 满外连接：

  - 将会返回==所有表中==符合where语句条件的所有记录。
  - 如果任一表的指定字段没有符合条件的值的话，那么就使用null值替代。

- 案例实操

  ```sql
  select * from teacher t full outer join course c on t.t_id = c.t_id;
  ```

#### 多表连接 

- **多个表使用join进行连接**

- ==注意：==连接 `n`个表，至少需要`n-1`个连接条件。例如：连接三个表，至少需要两个连接条件。

- 案例实操

  - 多表连接查询，查询老师对应的课程，以及对应的分数，对应的学生

  ```sql
  select * from teacher t 
  left join course c on t.t_id = c.t_id 
  left join score s on c.c_id = s.c_id 
  left join stu on s.s_id = stu.id;
  ```

#### 理解示意图

![image-20200223073048191](hive.assets/image-20200223073048191.png)



## Hive查询语法---排序

#### order by 全局排序

- 全局排序，只有一个reduce

- 使用 ORDER BY 子句排序

  - asc ( ascend) 升序 (默认)
  - desc (descend) 降序

- order by 子句在select语句的结尾

- 案例实操

  - 查询学生的成绩，并按照分数降序排列

  ```sql
  select * from score s order by s_score desc ;
  ```

#### 按照别名排序

- 按照学生分数的平均值排序

  ```sql
  select s_id, avg(s_score) avgscore from score group by s_id order by avgscore desc; 
  ```

#### 每个MapReduce内部排序（Sort By）局部排序

- `sort by`：每个`reducer`内部进行排序，对全局结果集来说不是排序。

![image-20200223074225295](hive.assets/image-20200223074225295.png)

- 设置`reduce`个数

  ```
  set mapreduce.job.reduces=3;
  ```

- 查看`reduce`的个数

  ```sql
  set mapreduce.job.reduces;
  ```

- 查询成绩按照成绩降序排列

  ```sql
  select * from score s sort by s.s_score;
  ```

- 将查询结果导入到文件中（按照成绩降序排列）

  ```sql
  insert overwrite local directory '/kkb/install/hivedatas/sort' select * from score s sort by s.s_score;
  ```

#### distribute by 分区排序

- `distribute by`：

  - 类似`MR`中`partition`，==采集`hash`算法，在map端将查询的结果中`hash`值相同的结果分发到对应的reduce文件中==。
  - 结合`sort by`使用。

- 注意

  - `Hive`要求 **distribute by** 语句要写在 **sort by** 语句之前。

- 案例实操

  - 先按照学生 `sid` 进行分区，再按照学生成绩进行排序

  - 设置`reduce`的个数

  ```sql
  set mapreduce.job.reduces=3;
  ```

    - 通过`distribute by`  进行数据的分区,，将不同的`sid` 划分到对应的`reduce`当中去

    ```sql
  insert overwrite local directory '/kkb/install/hivedatas/distribute' select * from score distribute by s_id sort by s_score;
    ```

#### cluster by

- 当`distribute by`和`sort by`字段相同时，可以使用`cluster by`方式代替

- 除了`distribute by` 的功能外，还会对该字段进行排序，所以`cluster by = distribute by + sort by`

  ```sql
  --以下两种写法等价
  insert overwrite local directory '/kkb/install/hivedatas/distribute_sort' select * from score distribute by s_score sort by s_score;
  
  insert overwrite local directory '/kkb/install/hivedatas/cluster' select * from score  cluster by s_score;
  ```




## Hive总结1

![](hive.assets/hive基础入门.png)

![](hive.assets/hive表的DDL和DML操作.png)

## 作业

* 1、创建一张`hive`的表，加载数据，最后把查询的结果数据导入到本地文件中
* 2、创建一张hive外部分区表，实现从一个已知的表中查询数据，动态插入到指定的分区中



## Hive可视化工具dbeaver

##### dbeaver基本介绍

- `dbeaver`是一个图形化的界面工具，专门用于与各种数据库的集成，通过`dbeaver`我们可以与各种数据库进行集成
- 通过图形化界面的方式来操作我们的数据库与数据库表，类似于我们的`sqlyog`或者`navicat`。

##### 下载dbeaver

- 我们可以直接从`github`上面下载我们需要的对应的安装包即可

​		https://github.com/dbeaver/dbeaver/releases

##### 安装dbeaver

- 这里我们使用的版本是`6.15`这个版本，下载`zip`的压缩包，直接解压就可以使用
- 然后双击目录`dbeaver-ce-6.1.5-win32.win32.x86_64\dbeaver`中的`dbeaver.exe`即可启动
- 双击`dbeaver.exe`

##### 启动`dbeaver`

启动的图形化界面如下，进行如图操作：

<img src="hive.assets/1569407489837.png" alt="1569407489837" style="zoom:80%;border:2px solid black" />

##### 配置我们的主机名与端口号

<img src="hive.assets/20181113110722636.png" alt="20181113110722636" style="zoom:80%;border:2px solid black" />

<img src="hive.assets/1569407697691.png" alt="1569407697691" style="zoom:140%;border:2px solid black" />

![](hive.assets/Image201912151603.png)

- 编辑`sql`语句

![](hive.assets/Image201912151606.png)

- 运行`sql`语句，查看结果

![image-20200223141845607](hive.assets/image-20200223141845607.png)

## Hive的参数传递

#### 查看hive的命令的参数

```shell
[hadoop@node03 ~]$ hive -help
usage: hive
 -d,--define <key=value>          Variable subsitution to apply to hive
                                  commands. e.g. -d A=B or --define A=B
    --database <databasename>     Specify the database to use
 -e <quoted-query-string>         SQL from command line
 -f <filename>                    SQL from files
 -H,--help                        Print help information
    --hiveconf <property=value>   Use value for given property
    --hivevar <key=value>         Variable subsitution to apply to hive
                                  commands. e.g. --hivevar A=B
 -i <filename>                    Initialization SQL file
 -S,--silent                      Silent mode in interactive shell
 -v,--verbose                     Verbose mode (echo executed SQL to the
                                  console)
```

![*](hive.assets/clip_image001-1582440565900.png)  语法结构

- `hive [-hiveconf x=y]* [<-i filename>]* [<-f filename>|<-e query-string>] [-S]`

- 说明：
  - `-i` 从文件初始化`HQL`。
  - `-e`从命令行执行指定的`HQL` 
  - `-f` 执行`HQL`脚本 
  - `-v` 输出执行的`HQL`语句到控制台 
  - -p `<port>` `connect to Hive Server on port number` 
  - `-hiveconf x=y Use this to set hive/hadoop configuration variables.`  设置`hive`运行时候的参数配置

#### Hive参数配置方式

`Hive`参数大全：[官网地址](https://cwiki.apache.org/confluence/display/Hive/Configuration+Properties)

开发`Hive`应用时，不可避免地需要设定`Hive`的参数。设定`Hive`的参数可以调优`HQL`代码的执行效率，或帮助定位问题。然而实践中经常遇到的一个问题是，为什么设定的参数没有起作用？这通常是错误的设定方式导致的。

##### 第一种方式：配置文件

`Hive`的配置文件包括

- 用户自定义配置文件：`$HIVE_CONF_DIR/hive-site.xml` 
- 默认配置文件：`$HIVE_CONF_DIR/hive-default.xml` 

- 用户自定义配置会覆盖默认配置。
- 另外，`Hive`也会读入`Hadoop`的配置，因为`Hive`是作为`Hadoop`的客户端启动的，`Hive`的配置会覆盖`Hadoop`的配置。配置文件的设定对本机启动的所有`Hive`进程都有效。

##### 第二种方式：命令行参数

启动`Hive`（启动`hive shell`客户端或`hiveServer`方式）时，可以在命令行添加`-hiveconf param=value`来设定参数，例如：

```shell
## 启动hive客户端方式 传递参数:
[hadoop@node03 ~]$ hive --hiveconf javax.jdo.option.ConnectionUserName=root
## 这一设定只对本次启动的Session有效!!!
```

```shell
## 启动hiveserver2方式 传递参数:
[hadoop@node03 ~]$ nohup hive --service hiveserver2 & --hiveconf javax.jdo.option.ConnectionUserName=root
## 对于这种Server方式的启动，对所有请求的Sessions都有效
```

通过`beeline`连接`hiveserver2`时也可以传递参数：

```shell
[hadoop@node03 ~]$ beeline --hiveconf javax.jdo.option.ConnectionUserName=root
```

##### 第三种方式：参数声明

进入`hive shell`客户端后，或者通过`beeline`连接`hiveserver2`后，可以在`HQL`中使用`SET`关键字设定参数，这种方式设置的参数都是`hiveconf`类型，例如：

```shell
## 进入hive shell后配置参数
hive (default)> set javax.jdo.option.ConnectionUserName=root;
## 这一设定的作用域是session级的。只对当前session有效
```

```sql
## beeline连接hiveserver2后，配置参数，设置mr中reduce个数
0: jdbc:hive2://node03:10000> set mapreduce.job.reduces=100;
## 这一设定的作用域是session级的。只对当前session有效
```

##### 参数配置的优先级

上述三种设定方式的优先级依次递增。

- 即参数声明覆盖命令行参数，命令行参数覆盖配置文件设定。
- 注意某些系统级的参数，例如`log4j`相关的设定，必须用前两种方式设定，因为那些参数的读取在`Session`建立以前已经完成了。

```
参数声明  >   命令行参数   >  配置文件参数（hive）
```

##### 第四种方式：使用变量传递参数

- 实际工作当中，我们一般都是将`hive`的`hql`语法开发完成之后，就写入到一个脚本里面去，然后定时的通过命令 `hive  -f`  去执行`hive`的语法即可
- 然后通过定义变量来传递参数到`hive`的脚本当中去，那么我们接下来就来看看如何使用`hive`来传递参数。

- `hive0.9`以及之前的版本是不支持传参
- `hive1.0`版本之后支持传参，语法格式是：  `hive -f` 传递参数

- 在`hive`当中我们一般可以使用`hivevar`或者`hiveconf`来进行参数的传递



#### 案例1：hiveconf

`hiveconf`用于定义`HIVE`**执行上下文的属性**(配置参数)，可覆盖覆盖`hive-site.xml（hive-default.xml）`中的参数值，如用户执行目录、日志打印级别、执行队列等。例如我们可以使用`hiveconf`来覆盖我们的`hive`属性配置。`hiveconf`配置的属性一般是`hive-default.xml`配置文件里有的。

获取`hiveconf`变量的值必须要使用`hiveconf`作为前缀参数，具体格式如下:

```sql
${hiveconf:key} 
```

```sql
0: jdbc:hive2://node03:10000> set my=80;  #仅对当前session有效，一旦!quit退出，my就会失效
No rows affected (0.015 seconds)
0: jdbc:hive2://node03:10000> set my;
+--------+--+
|  set   |
+--------+--+
| my=80  |
+--------+--+
1 row selected (0.017 seconds)

0: jdbc:hive2://node03:10000> use db1;
No rows affected (0.048 seconds)

0: jdbc:hive2://node03:10000> select * from score7_1;
+----------------+----------------+-------------------+-----------------+--+
| score7_1.s_id  | score7_1.c_id  | score7_1.s_score  | score7_1.month  |
+----------------+----------------+-------------------+-----------------+--+
| 01             | 01             | 80                | 201805          |
| 01             | 02             | 90                | 201805          |
| 01             | 03             | 99                | 201805          |
| 02             | 01             | 70                | 201805          |
| 02             | 02             | 60                | 201805          |
| 02             | 03             | 80                | 201805          |
| 03             | 01             | 80                | 201805          |
| 03             | 02             | 80                | 201805          |
| 03             | 03             | 80                | 201805          |
| 04             | 01             | 50                | 201805          |
| 04             | 02             | 30                | 201805          |
| 04             | 03             | 20                | 201805          |
| 05             | 01             | 76                | 201805          |
| 05             | 02             | 87                | 201805          |
| 06             | 01             | 31                | 201805          |
| 06             | 03             | 34                | 201805          |
| 07             | 02             | 89                | 201805          |
| 07             | 03             | 98                | 201805          |
+----------------+----------------+-------------------+-----------------+--+
18 rows selected (0.102 seconds)

0: jdbc:hive2://node03:10000> select * from score7_1 where s_score=${hiveconf:my};
+----------------+----------------+-------------------+-----------------+--+
| score7_1.s_id  | score7_1.c_id  | score7_1.s_score  | score7_1.month  |
+----------------+----------------+-------------------+-----------------+--+
| 01             | 01             | 80                | 201805          |
| 02             | 03             | 80                | 201805          |
| 03             | 01             | 80                | 201805          |
| 03             | 02             | 80                | 201805          |
| 03             | 03             | 80                | 201805          |
+----------------+----------------+-------------------+-----------------+--+

```

#### 案例2：hivevar

`hivevar`用于定义`HIVE`**运行时的变量**替换，类似于`JAVA`中的`“PreparedStatement”`，与`${key}`配合使用或者与 `${hivevar:key}`

获取`hivevar`变量的值可以不使用前缀`hivevar`，具体格式如下：

```sql
-- 使用前缀:
 ${hivevar:key}
-- 不使用前缀:
 ${key}
```

```sql
[hadoop@node03 ~]$ beeline --hivevar myscore=80;  #myscore仅对当前session有效

beeline> !connect jdbc:hive2://node03:10000

0: jdbc:hive2://node03:10000> use db1;
No rows affected (0.105 seconds)

0: jdbc:hive2://node03:10000> select * from score7_1 where s_score=${myscore};
+----------------+----------------+-------------------+-----------------+--+
| score7_1.s_id  | score7_1.c_id  | score7_1.s_score  | score7_1.month  |
+----------------+----------------+-------------------+-----------------+--+
| 01             | 01             | 80                | 201805          |
| 02             | 03             | 80                | 201805          |
| 03             | 01             | 80                | 201805          |
| 03             | 02             | 80                | 201805          |
| 03             | 03             | 80                | 201805          |
+----------------+----------------+-------------------+-----------------+--+
5 rows selected (0.247 seconds)
```



#### 案例3：define

`define`与`hivevar`用途完全一样，可以简写成“`-d`

```sql
[hadoop@node03 ~]$ hive -d myscore=90;  #myscore仅对当前session有效

hive (db1)> select * from score7_1 where s_score>${myscore};
OK
score7_1.s_id   score7_1.c_id   score7_1.s_score        score7_1.month
01      03      99      201805
07      03      98      201805
Time taken: 0.879 seconds, Fetched: 2 row(s)
```

#### 案例4：hive脚本实战

####### 第一步：创建表并加载数据

```sql
create external table score(s_id string,c_id string,s_score int) 
partitioned by(month string) 
row format delimited fields terminated by '\t';

load data local inpath '/kkb/install/hivedatas/score.csv' overwrite into table score partition(month='201805');

create external table student(s_id string, s_name string, s_birth string, s_sex string) 
row format delimitedfields terminated by '\t';

load data local inpath '/kkb/install/hivedatas/student.csv' overwrite into table student;

0: jdbc:hive2://node03:10000> select * from student;
+---------------+-----------------+------------------+----------------+--+
| student.s_id  | student.s_name  | student.s_birth  | student.s_sex  |
+---------------+-----------------+------------------+----------------+--+
| 01            | 赵雷              | 1990-01-01       | 男              |
| 02            | 钱电              | 1990-12-21       | 男              |
| 03            | 孙风              | 1990-05-20       | 男              |
| 04            | 李云              | 1990-08-06       | 男              |
| 05            | 周梅              | 1991-12-01       | 女              |
| 06            | 吴兰              | 1992-03-01       | 女              |
| 07            | 郑竹              | 1989-07-01       | 女              |
| 08            | 王菊              | 1990-01-20       | 女              |
+---------------+-----------------+------------------+----------------+--+
8 rows selected (0.093 seconds)

0: jdbc:hive2://node03:10000> select * from score;
+-------------+-------------+----------------+--------------+--+
| score.s_id  | score.c_id  | score.s_score  | score.month  |
+-------------+-------------+----------------+--------------+--+
| 01          | 01          | 80             | 201805       |
| 01          | 02          | 90             | 201805       |
| 01          | 03          | 99             | 201805       |
| 02          | 01          | 70             | 201805       |
| 02          | 02          | 60             | 201805       |
| 02          | 03          | 80             | 201805       |
| 03          | 01          | 80             | 201805       |
| 03          | 02          | 80             | 201805       |
| 03          | 03          | 80             | 201805       |
| 04          | 01          | 50             | 201805       |
| 04          | 02          | 30             | 201805       |
| 04          | 03          | 20             | 201805       |
| 05          | 01          | 76             | 201805       |
| 05          | 02          | 87             | 201805       |
| 06          | 01          | 31             | 201805       |
| 06          | 03          | 34             | 201805       |
| 07          | 02          | 89             | 201805       |
| 07          | 03          | 98             | 201805       |
+-------------+-------------+----------------+--------------+--+
18 rows selected (0.136 seconds)
```

####### 第二步：定义hive脚本

- 开发`hql`脚本，并使用`hiveconf`和`hivevar`进行参数传入

- `node03`执行以下命令定义`hql`脚本

```sql
cd /kkb/instal/hivedatas

vim hivevariable.hql

#使用脚本1：
use db1;  ## 脚本一定要加上这一行，否则会找不到表
select * from student left join score on student.s_id = score.s_id where score.month = ${hiveconf:month} and score.s_score > ${hivevar:s_score} and score.c_id = ${c_id}; 

#或者使用脚本2：
use db1;
select * from student st left join score sc on st.s_id = sc.s_id where sc.month = ${hiveconf:month} and sc.s_score > ${hivevar:s_score} and sc.c_id = ${c_id};
```

####### 第三步：调用hive脚本并传递参数

- `node03`执行以下命令，调用脚本2：

```sh
hive --hiveconf month=201905 --hivevar s_score=80 --hivevar c_id=03  -f /kkb/install/hivedatas/hivevariable.hql

st.s_id st.s_name  st.s_birth  st.s_sex   sc.s_id sc.c_id sc.s_score    sc.month
01      赵雷        1990-01-01      男      01         3       99         201805
07      郑竹        1989-07-01      女      07         3       98         201805
Time taken: 18.187 seconds, Fetched: 2 row(s)
```



## Hive的常用函数

#### 系统内置函数

```sql
#1．查看系统自带的函数
show functions;
#2．显示自带的函数的用法
desc function upper;
#3．详细显示自带的函数的用法
desc function extended upper;
```



#### 取整函数

###### 四舍五入round函数

- **语法**: `round(double a)`
- **返回值**: `BIGINT`
- **说明**: 返回`double`类型的整数值部分 （遵循四舍五入）

```sql
hive> select round(3.1415926) from tableName;
3
hive> select round(3.5) from tableName;
4
hive> create table tableName as select round(9542.158) from tableName;
```

###### 指定精度取整函数: round 

- **语法**: `round(double a, int d)`
- **返回值**: `DOUBLE`
- **说明**: 返回指定精度`d`的`double`类型

```sql
hive> select round(3.1415926, 4) from tableName;
3.1416
```

###### 向下取整函数: floor 

- **语法**: `floor(double a)`
- **返回值**: `BIGINT`
- **说明**: 返回等于或者小于该`double`变量的最大的整数

```sql
hive> select floor(3.1415926) from tableName;
3
hive> select floor(25) from tableName;
25
```

###### 向上取整函数: ceil 

- **语法**: `ceil(double a)`
- **返回值**: `BIGINT`
- **说明**: 返回等于或者大于该double变量的最小的整数

```sql
hive> select ceil(3.1415926) from tableName;
4
hive> select ceil(46) from tableName;
46
```

###### 向上取整函数: ceiling 

- **语法**: `ceiling(double a)`
- **返回值**: `BIGINT`
- **说明**: `与ceil`功能相同

```sql
hive> select ceiling(3.1415926) from tableName;
4
hive> select ceiling(46) from tableName;
46
```

##### 取随机数函数: rand

- **语法**: `rand(), rand(int seed)`
- **返回值**: `double`
- **说明**: 返回一个0到1范围内的随机数。如果指定种子seed，则会等到一个稳定的随机数序列

```sql
hive> select rand() from tableName;
0.5577432776034763
hive> select rand() from tableName;
0.6638336467363424
hive> select rand(100) from tableName;
0.7220096548596434
hive> select rand(100) from tableName;
0.7220096548596434
```

#### 日期函数

###### 1、UNIX时间戳转日期函数: from_unixtime  

- **语法**: `from_unixtime(bigint unixtime[, string format])`
- **返回值**: `string`
- **说明**: 转化`UNIX`时间戳（从`1970-01-01 00:00:00 UTC`到指定时间的秒数）到当前时区的时间格式

```sql
hive> select from_unixtime(1323308943, 'yyyyMMdd') from tableName;
20111208
```

###### 2、获取当前UNIX时间戳函数: unix_timestamp

- **语法**: `unix_timestamp()`
- **返回值**: `bigint`
- **说明**: 获得当前时区的`UNIX`时间戳

```sql
hive> select unix_timestamp() from tableName;
1323309615
```

###### 3、日期转UNIX时间戳函数: unix_timestamp 

- **语法**: unix_timestamp(string date)
- **返回值**: `bigint`
- **说明**: 转换格式为"yyyy-MM-dd HH:mm:ss"的日期到`UNIX`时间戳。如果转化失败，则返回`0`。

```sql
hive> select unix_timestamp('2011-12-07 13:01:03') from tableName;
1323234063
```

###### 4、指定格式日期转UNIX时间戳函数: unix_timestamp 

- **语法**: unix_timestamp(string date, string pattern)
- **返回值**: `bigint`
- **说明**: 转换`pattern`格式的日期到`UNIX`时间戳。如果转化失败，则返回`0`。

```sql
hive> select unix_timestamp('20111207 13:01:03','yyyyMMdd HH:mm:ss') from tableName;
1323234063
```

###### 5、日期时间转日期函数: to_date  

- **语法**: to_date(string datetime)
- **返回值**: `string`
- **说明**: 返回日期时间字段中的日期部分。

```sql
hive> select to_date('2011-12-08 10:03:01') from tableName;
2011-12-08
```

###### 6、日期转年函数: year 

- **语法**: year(string date)
- **返回值**: `int`
- **说明**: 返回日期中的年。

```sql
hive> select year('2011-12-08 10:03:01') from tableName;
2011
hive> select year('2012-12-08') from tableName;
2012
```

###### 7、日期转月函数: month 

- **语法**: month (string date)
- **返回值**: `int`
- **说明**: 返回`date`或`datetime`中的月份。

```sql
hive> select month('2011-12-08 10:03:01') from tableName;
12
hive> select month('2011-08-08') from tableName;
8
```

###### 8、日期转天函数: day 

- **语法**: day (string date)
- **返回值**: `int`
- **说明**: 返回日期中的天。

```sql
hive> select day('2011-12-08 10:03:01') from tableName;
8
hive> select day('2011-12-24') from tableName;
24
```

###### 9、日期转小时函数: hour 

- **语法**: hour (string date)
- **返回值**: `int`
- **说明**: 返回日期中的小时。

```sql
hive> select hour('2011-12-08 10:03:01') from tableName;
10
```

###### 10、日期转分钟函数: minute

- **语法**: minute (string date)
- **返回值**: `int`
- **说明**: 返回日期中的分钟。

```sql
hive> select minute('2011-12-08 10:03:01') from tableName;
3

-- second 返回秒
hive> select second('2011-12-08 10:03:01') from tableName;
1
```

###### 12、日期转周函数: weekofyear

- **语法**: weekofyear (string date)
- **返回值**: `int`
- **说明**: 返回日期在当前的周数。

```sql
hive> select weekofyear('2011-12-08 10:03:01') from tableName;
49
```

###### 13、日期比较函数: datediff 

- **语法**: datediff(string enddate, string startdate)
- **返回值**: `int`
- **说明**: 返回结束日期减去开始日期的天数。

```sql
hive> select datediff('2012-12-08','2012-05-09') from tableName;
213
```

###### 14、日期增加函数: date_add 

- **语法**: date_add(string startdate, int days)
- **返回值**: `string`
- **说明**: 返回开始日期startdate增加days天后的日期。

```sql
hive> select date_add('2012-12-08',10) from tableName;
2012-12-18
```

###### 15、日期减少函数: date_sub 

- **语法**: date_sub (string startdate, int days)
- **返回值**: `string`
- **说明**: 返回开始日期`startdate`减少`days`天后的日期。

```sql
hive> select date_sub('2012-12-08',10) from tableName;
2012-11-28
```

#### 条件函数（重点）

###### 1、If函数: if 

- **语法**: if(boolean testCondition, T valueTrue, T valueFalseOrNull)
- **返回值**: `T`
- **说明**: 当条件`testCondition`为`TRUE`时，返回`valueTrue`；否则返回`valueFalseOrNull`

```sql
hive> select if(1=2,100,200) from tableName;
200
hive> select if(1=1,100,200) from tableName;
100
```

###### 2、非空查找函数: COALESCE

- **语法**: COALESCE(T v1, T v2, …)
- **返回值**: T
- **说明**: 返回参数中的第一个非空值；如果所有值都为`NULL`，那么返回`NULL`

```sql
hive> select COALESCE(null,'100','50') from tableName;
100
```

###### 3、条件判断函数：CASE 

- **语法**: CASE a WHEN b THEN c [WHEN d THEN e]* [ELSE f] END
- **返回值**: T
- **说明**：如果a等于b，那么返回c；如果a等于d，那么返回e；否则返回f

```sql
hive> select case 100 when 50 then 'tom' when 100 then 'mary' else 'tim' end from tableName;
mary
hive> Select case 200 when 50 then 'tom' when 100 then 'mary' else 'tim' end from tableName;
tim
```

###### 4、条件判断函数：CASE

- **语法**: CASE WHEN a THEN b [WHEN c THEN d]* [ELSE e] END
- **返回值**: T
- **说明**：如果a为TRUE,则返回b；如果c为TRUE，则返回d；否则返回e

```sql
hive> select case when 1=2 then 'tom' when 2=2 then 'mary' else 'tim' end from tableName;
mary
hive> select case when 1=1 then 'tom' when 2=2 then 'mary' else 'tim' end from tableName;
tom
```

#### 字符串函数

###### 1、字符串长度函数：length

- **语法**: length(string A)
- **返回值**: `int`
- **说明**：返回字符串A的长度

```sql
hive> select length('abcedfg') from tableName;
```

###### 2、字符串反转函数：reverse

- **语法**: reverse(string A)
- **返回值**: `string`
- **说明**：返回字符串A的反转结果

```sql
hive> select reverse('abcedfg') from tableName;
gfdecba
```

###### 3、字符串连接函数：concat

- **语法**: concat(string A, string B…)
- **返回值**: `string`
- **说明**：返回输入字符串连接后的结果，支持任意个输入字符串

```sql
hive> select concat('abc','def','gh') from tableName;
abcdefgh
```

###### 4、字符串连接并指定字符串分隔符：concat_ws

- **语法**: concat_ws(string SEP, string A, string B…)
- **返回值**: `string`
- **说明**：返回输入字符串连接后的结果，SEP表示各个字符串间的分隔符

```sql
hive> select concat_ws(',','abc','def','gh') from tableName;
abc,def,gh
```

###### 5、字符串截取函数：substr

- **语法**: substr(string A, int start), substring(string A, int start)
- **返回值**: `string`
- **说明**：返回字符串A从start位置到结尾的字符串,位置索引从1开始。

```sql
hive> select substr('abcde',3) from tableName;
cde
hive> select substring('abcde',3) from tableName;
cde
hive> select substr('abcde',-1) from tableName;  （和ORACLE相同）
e
```

###### 6、字符串截取函数：substr, substring 

- **语法**: substr(string A, int start, int len),substring(string A, int start, int len)
- **返回值**: string
- **说明**：返回字符串`A`从`start`位置开始，长度为`len`的字符串

```sql
hive> select substr('abcde',3,2) from tableName;
cd
hive> select substring('abcde',3,2) from tableName;
cd
hive>select substring('abcde',-3,2) from tableName;
cd
```

###### 7、字符串转大写函数：upper, ucase  

- **语法**: `upper(string A) ucase(string A)`
- **返回值**: `string`
- **说明**：返回字符串`A`的大写格式

```sql
hive> select upper('abSEd') from tableName;
ABSED
hive> select ucase('abSEd') from tableName;
ABSED
```

###### 8、字符串转小写函数：lower, lcase  

- **语法**: lower(string A) lcase(string A)
- **返回值**: string
- **说明**：返回字符串`A`的小写格式

```sql
hive> select lower('abSEd') from tableName;
absed
hive> select lcase('abSEd') from tableName;
absed
```

###### 9、去空格函数：trim 

- **语法**: trim(string A)
- **返回值**: string
- **说明**：去除字符串两边的空格

```sql
hive> select trim(' ab c ') from tableName;
ab c
```

###### 10、url解析函数 parse_url

- **语法**:
  parse_url(string urlString, string partToExtract [, string keyToExtract])
- **返回值**: `string`
- **说明**：返回`URL`中指定的部分。partToExtract的有效值为：HOST, PATH,`
  `QUERY, REF, PROTOCOL, AUTHORITY, FILE, and USERINFO.
- HOST:主机
  - PATH:服务器上某资源的位置,通常有目录/子目录/文件名这样结构组成
- QUERY:查询，用于给动态网页传递参数，可有多个参数，用"&"符号隔开，每个参数的名和值用"="符号隔开
- PROTOCOL:URL 的协议部分,返回https或http

```sql
select parse_url('https://www.tableName.com/path1/p.php?k1=v1&k2=v2#Ref1', 'HOST') from t1;   #HOST必须使用大写
www.tableName.com 

select parse_url('https://www.tableName.com/path1/p.php?k1=v1&k2=v2#Ref1', 'QUERY', 'k1') from t1;
+------+--+
| _c0  |
+------+--+
| v1   |
+------+--+

select parse_url('https://www.tableName.com/path1/p.php?k1=v1&k2=v2#Ref1','REF') from t1;
+-------+--+
|  _c0  |
+-------+--+
| Ref1  |
+-------+--+

select parse_url('https://www.tableName.com/path1/p.php?k1=v1&k2=v2#Ref1','PROTOCOL') from t1;
+--------+--+
|  _c0   |
+--------+--+
| https  |
+--------+--+

select parse_url('https://www.tableName.com/path1/p.php?k1=v1&k2=v2#Ref1','FILE') from t1;
+---------------------------+--+
|            _c0            |
+---------------------------+--+
| /path1/p.php?k1=v1&k2=v2  |
+---------------------------+--+
```

###### 11、json解析  get_json_object 

- **语法**: `get_json_object(string json_string, string path)`
- **返回值**: `string`
- **说明**：解析`json`的字符串`json_string`,返回`path`指定的内容。如果输入的`json`字符串无效，那么返回`NULL`。

```sql
select  get_json_object('{"store":{"fruit":\[{"weight":8,"type":"apple"},{"weight":9,"type":"pear"}], "bicycle":{"price":19.95,"color":"red"} },"email":"amy@only_for_json_udf_test.net","owner":"amy"}','$.owner') from t1;
+------+--+
| _c0  |
+------+--+
| amy  |
+------+--+
```

![](hive.assets/Image201912171428.png)

###### 12、重复字符串函数：repeat 

- **语法**: `repeat(string str, int n)`
- **返回值**: `string`
- **说明**：返回重复`n`次后的`str`字符串

```sql
hive> select repeat('abc', 5) from tableName;
abcabcabcabcabc
```

###### 13、分割字符串函数: split   

- **语法**: `split(string str, string pat)`
- **返回值**: `array`
- **说明**: 按照`pat`字符串分割`str`，会返回分割后的字符串数组

```sql
hive> select split('abtcdtef','t') from tableName;
["ab","cd","ef"]
```

#### 集合统计函数

###### 1、个数统计函数: count  

- **语法**: count(*), count(expr), count(DISTINCT expr[, expr_.])
- **返回值**：`Int`
- **说明**: count(*)统计检索出的行的个数，包括NULL值的行；count(expr)返回指定字段的非空值的个数；count(DISTINCT expr[, expr_.])返回指定字段的不同的非空值的个数

```sql
hive> select count(*) from tableName;
20
hive> select count(distinct t) from tableName;
10
```

###### 2、总和统计函数: sum 

- **语法**: `sum(col), sum(DISTINCT col)`
- **返回值**: `double`
- **说明**: `sum(col)`统计结果集中`col`的相加的结果；`sum(DISTINCT col)`统计结果中col不同值相加的结果

```sql
hive> select sum(t) from tableName;
100
hive> select sum(distinct t) from tableName;
70
```

###### 3、平均值统计函数: avg   

- **语法**: `avg(col), avg(DISTINCT col)`
- **返回值**: `double`
- **说明**: `avg(col)`统计结果集中`col`的平均值；`avg(DISTINCT col)`统计结果中`col`不同值相加的平均值

```sql
hive> select avg(t) from tableName;
50
hive> select avg (distinct t) from tableName;
30
```

###### 4、最小值统计函数: min 

- **语法**: `min(col)`
- **返回值**: `double`
- **说明**: 统计结果集中`col`字段的最小值

```sql
hive> select min(t) from tableName;
20
```

###### 5、最大值统计函数: max  

- **语法**: `max(col)`
- **返回值**: `double`
- **说明**: 统计结果集中`col`字段的最大值

```sql
hive> select max(t) from tableName;
120
```

#### 复合类型构建函数

###### 1、Map类型构建: map  

- **语法**: map (key1, value1, key2, value2, …)
- **说明**：根据输入的`key`和`value`对构建map类型
- collection items terminated by ',' 表示键值对与键值对之间使用','进行分隔。
- map keys terminated by ':' 表示key与value间使用':'进行分隔。
- 构建map数据类型的语法：字段名 `map<string, int>`

```sql
-- 建表
create table score_map(name string, score map<string, int>)
row format delimited fields terminated by '\t' 
collection items terminated by ',' 
map keys terminated by ':';

-- 创建数据内容如下并加载数据
cd /kkb/install/hivedatas/
vim score_map.txt

zhangsan	数学:80,语文:89,英语:95
lisi	语文:60,数学:80,英语:99

-- 加载数据到hive表当中去
load data local inpath '/kkb/install/hivedatas/score_map.txt' overwrite into table score_map;

-- map结构数据访问：
-- 获取所有的value：
select name,map_values(score) from score_map;
+-----------+-------------+--+
|   name    |     _c1     |
+-----------+-------------+--+
| zhangsan  | [80,89,95]  |
| lisi      | [60,80,99]  |
+-----------+-------------+--+

-- 获取所有的key：
select name,map_keys(score) from score_map;
+-----------+-------------------+--+
|   name    |        _c1        |
+-----------+-------------------+--+
| zhangsan  | ["数学","语文","英语"]  |
| lisi      | ["语文","数学","英语"]  |
+-----------+-------------------+--+

-- 按照key来进行获取value值
select name,score["数学"]  from score_map;
+-----------+------+--+
|   name    | _c1  |
+-----------+------+--+
| zhangsan  | 80   |
| lisi      | 80   |
+-----------+------+--+

-- 查看map元素个数（键值对个数）
select name,size(score) from score_map;
+-----------+------+--+
|   name    | _c1  |
+-----------+------+--+
| zhangsan  | 3    |
| lisi      | 3    |
+-----------+------+--+

-- 构建一个map
select map(1, 'zs', 2, 'lisi');
+--------------------+--+
|        _c0         |
+--------------------+--+
| {1:"zs",2:"lisi"}  |
+--------------------+--+
```



###### 2、Struct类型构建: struct

- **语法**: struct(val1, val2, val3, …)
- **说明**：根据输入的参数构建结构体struct类型，似于C语言中的结构体，内部数据通过X.X来获取，假设我
- 数据格式是这样的，电影ABC，有1254人评价过，打分为7.4分

```sql
-- 创建struct表
create table movie_score(name string, info struct<number:int,score:float>)
row format delimited fields terminated by "\t"  
collection items terminated by ":"; 

-- 加载数据
cd /kkb/install/hivedatas/
vim struct.txt

-- 电影ABC，有1254人评价过，打分为7.4分
ABC	1254:7.4  
DEF	256:4.9  
XYZ	456:5.4

-- 加载数据
load data local inpath '/kkb/install/hivedatas/struct.txt' overwrite into table movie_score;

-- hive当中查询数据
select * from movie_score;
+-------------------+------------------------------+--+
| movie_score.name  |       movie_score.info       |
+-------------------+------------------------------+--+
| ABC               | {"number":1254,"score":7.4}  |
| DEF               | {"number":256,"score":4.9}   |
| XYZ               | {"number":456,"score":5.4}   |
+-------------------+------------------------------+--+


select info.number,round(info.score,1) from movie_score;
+---------+--------------------+--+
| number  |        _c1         |
+---------+--------------------+--+
| 1254    | 7.400000095367432  |
| 256     | 4.900000095367432  |
| 456     | 5.400000095367432  |
+---------+--------------------+--+

-- 构建一个struct
select struct(1, 'anzhulababy', 'moon', 1.68);
+----------------------------------------------------+--+
|                        _c0                         |
+----------------------------------------------------+--+
| {"col1":1,"col2":"anzhulababy","col3":"moon","col4":1.68} |
+----------------------------------------------------+--+
```



###### 3、```构建: array

- **语法**: array(val1, val2, …)
- **说明**：根据输入的参数构建array数组类型

```sql
hive> create table person(name string, work_locations array<string>)
ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
COLLECTION ITEMS TERMINATED BY ',';

-- 加载数据到person表当中去
cd /kkb/install/hivedatas/
vim person.txt

-- 数据内容格式如下
biansutao	beijing,shanghai,tianjin,hangzhou
linan	changchun,chengdu,wuhan

-- 加载数据
hive > load  data local inpath '/kkb/install/hivedatas/person.txt' overwrite into table person;

-- 查询所有数据数据
hive > select * from person;

-- 按照下表索引进行查询
hive > select work_locations[0] from person;

-- 查询所有集合数据
hive  > select work_locations from person; 

-- 查询元素个数
hive >  select size(work_locations) from person;   

-- 构建array
select array(1, 2, 1);
select array(1, 'a', 1.0);
select array(1, 2, 1.0);
```

#### 复合类型长度统计函数

###### 1、Map类型长度函数: `size(Map<k .V>)`

- **语法**: `size(Map<k .V>)`
- **返回值**: int
- **说明**: 返回map类型的长度

```sql
hive> select size(map(1, 'zs', 2, 'anzhulababy')) from tableName;
2
```

###### 2、```长度函数: `size(Array<T>)`

- **语法**: `size(Array<T>)`
- **返回值**: int
- **说明**: 返回```的长度

```sql
hive> select size(t) from arr_table2;
4
```

###### 3、类型转换函数  

- **类型转换函数**: cast
- **语法**: `cast(expr as <type>)`
- **返回值**: Expected "=" to follow "type"
- **说明**: 返回转换后的数据类型

```sql
hive> select cast('1' as bigint) from tableName;
1
```

#### 行转列案例

行转列：一行的某些字段进行组合等，形成了新的列。

###### 1、相关函数说明

- CONCAT(string A/col, string B/col…)：返回输入字符串连接后的结果，支持任意个输入字符串;

- CONCAT_WS(separator, str1, str2,...)：它是一个特殊形式的 CONCAT()。
  - 第一个参数剩余参数间的分隔符。分隔符可以是与剩余参数一样的字符串。如果分隔符是 NULL，返回值也将为 NULL。
  - 这个函数会跳过分隔符参数后的任何 NULL 和空字符串。分隔符将被加到被连接的字符串之间;

- COLLECT_SET(col)：函数只接受基本数据类型，它的主要作用是将某字段的值进行去重汇总，产生**array**类型字段。

###### 2、数据准备

- 数据准备

| name       | constellation | blood_type |
| ---------- | ------------- | ---------- |
| 孙悟空     | 白羊座        | A          |
| 老王       | 射手座        | A          |
| 宋宋       | 白羊座        | B          |
| 猪八戒     | 白羊座        | A          |
| 按住啦baby | 射手座        | A          |

###### 3、需求

把星座和血型一样的人归类到一起。结果如下：

```
射手座,A            老王|凤姐
白羊座,A            孙悟空|猪八戒
白羊座,B            宋宋
```

###### 4、创建表数据文件

node03服务器执行以下命令创建文件，注意数据使用\t进行分割

```shell
cd /kkb/install/hivedatas
vim constellation.txt
```

```
孙悟空	白羊座	A
老王	射手座	A
宋宋	白羊座	B       
猪八戒	白羊座	A
凤姐	射手座	A
```

###### 5、创建hive表并导入数据

- 创建hive表并加载数据

```sql
hive (hive_explode)> create table person_info(name string, constellation string,  blood_type string) row format delimited fields terminated by "\t";
```

- 加载数据

```sql
hive (hive_explode)> load data local inpath '/kkb/install/hivedatas/constellation.txt' into table person_info;
```

###### 6、按需求查询数据

```sql
#查询的需求如下：
射手座,A            老王|凤姐
白羊座,A            孙悟空|猪八戒
白羊座,B            宋宋


select * from person_info;
+-------------------+----------------------------+-------------------------+--+
| person_info.name  | person_info.constellation  | person_info.blood_type  |
+-------------------+----------------------------+-------------------------+--+
| 孙悟空               | 白羊座                        | A                       |
| 老王                | 射手座                        | A                       |
| 宋宋                | 白羊座                        | B                       |
| 猪八戒               | 白羊座                        | A                       |
| 凤姐                | 射手座                        | A                       |
+-------------------+----------------------------+-------------------------+--+

select p.name,concat(p.constellation,',',p.blood_type) c2 from person_info p;
+---------+---------------+--+
| p.name  |      c2       |
+---------+---------------+--+
| 孙悟空     | 白羊座,A         |
| 老王      | 射手座,A         |
| 宋宋      | 白羊座,B         |
| 猪八戒     | 白羊座,A         |
| 凤姐      | 射手座,A         |
+---------+---------------+--+
5 rows selected (0.154 seconds)
## 将上面的查询语句作为子查询的语句

select p.c2,concat_ws('|',collect_set(p.name)) names from (select name,concat(constellation,',',blood_type) c2 from person_info) p 
group by p.c2;
+---------------+----------+--+
|     p.c2      |  names   |
+---------------+----------+--+
| 射手座,A         | 老王|凤姐    |
| 白羊座,A         | 孙悟空|猪八戒  |
| 白羊座,B         | 宋宋       |
+---------------+----------+--+

#一定一定一定不要写成以下这样!!!!!
#select p.c2,concat_ws('|',collect_set(p.name)) names from (select p.name,concat(p.constellation,',',p.blood_type) c2 from person_info) p group by p.c2;

#是错误的语法： select p.name,concat(p.constellation,',',p.blood_type) c2 from person_info

#子查询要用括号()括起来！！！！！

```



#### explode函数

##### 案例1：使用explode拆分Map和Array字段数据

explode可以用于将hive一列中复杂的array或者map结构拆分成多行

####### 案例需求

```shell
## 现在有数据格式如下,字段之间使用\t分割
zhangsan	child1,child2,child3,child4	k1:v1,k2:v2
lisi	child5,child6,child7,child8	 k3:v3,k4:v4
```

需求如下：

```sql
-- 将所有的child进行拆开成为一列
+----------+--+
| mychild  |
+----------+--+
| child1   |
| child2   |
| child3   |
| child4   |
| child5   |
| child6   |
| child7   |
| child8   |
+----------+--+

-- 将map的key和value也进行拆开，成为如下结果
+-----------+-------------+--+
| mymapkey  | mymapvalue  |
+-----------+-------------+--+
| k1        | v1          |
| k2        | v2          |
| k3        | v3          |
| k4        | v4          |
+-----------+-------------+--+
```

####### 第一步：创建hive表

```sql
create table explode_t1(name string, children array<string>, address Map<string, string>) row format delimited fields terminated by '\t' collection items terminated by ','  map keys terminated by ':' stored as textFile;
```

####### 第二步：加载数据

- node03执行以下命令创建表数据文件

```sql
cd  /kkb/install/hivedatas/

vim maparray

-- 数据内容格式如下
zhangsan	child1,child2,child3,child4	k1:v1,k2:v2
lisi	child5,child6,child7,child8	k3:v3,k4:v4
```

- hive表当中加载数据

```sql
load data local inpath '/kkb/install/hivedatas/maparray' into table explode_t1;
```

####### 第三步：使用explode将hive当中数据拆开

- 将array当中的数据拆分开

```sql
select explode(children) as myChild from explode_t1;
+----------+--+
| mychild  |
+----------+--+
| child1   |
| child2   |
| child3   |
| child4   |
| child5   |
| child6   |
| child7   |
| child8   |
+----------+--+
```

- 将map当中的数据拆分开

```sql
select explode(address) as (myMapKey, myMapValue) from explode_t1;
+-----------+-------------+--+
| mymapkey  | mymapvalue  |
+-----------+-------------+--+
| k1        | v1          |
| k2        | v2          |
| k3        | v3          |
| k4        | v4          |
+-----------+-------------+--+
```

##### 案例2：使用explode拆分json字符串

- 需求：现在有一些数据格式如下：

```
a:shandong,b:beijing,c:hebei|1,2,3,4,5,6,7,8,9|[{"source":"7fresh","monthSales":4900,"userCount":1900,"score":"9.9"},{"source":"jd","monthSales":2090,"userCount":78981,"score":"9.8"},{"source":"jdmart","monthSales":6987,"userCount":1600,"score":"9.0"}]
```

- 其中字段与字段之间的分隔符是 | 

- 我们要解析得到所有的monthSales对应的值为以下这一列（行转列）

```
4900
2090
6987
```

####### 第一步：创建hive表

```sql
create table explode2(area string, goods_id string, sale_info string) ROW FORMAT DELIMITED FIELDS TERMINATED BY '|' STORED AS textfile;
```

####### 第二步：准备数据并加载数据

- 准备数据如下

```
a:shandong,b:beijing,c:hebei|1,2,3,4,5,6,7,8,9|
[{"source":"7fresh","monthSales":4900},
{"source":"jd","monthSales":2090},
{"source":"jdmart","monthSales":6987}]
```



```shell
cd /kkb/install/hivedatas

vim explode_json

a:shandong,b:beijing,c:hebei|1,2,3,4,5,6,7,8,9|[{"source":"7fresh","monthSales":4900,"userCount":1900,"score":"9.9"},{"source":"jd","monthSales":2090,"userCount":78981,"score":"9.8"},{"source":"jdmart","monthSales":6987,"userCount":1600,"score":"9.0"}]
```

- 加载数据到hive表当中去

```sql
load data local inpath '/kkb/install/hivedatas/explode_json' overwrite into table explode2;
```

####### 第三步：使用explode拆分Array

```sql
select explode(split(goods_id, ',')) as goods_id from explode2;
+-----------+--+
| goods_id  |
+-----------+--+
| 1         |
| 2         |
| 3         |
| 4         |
| 5         |
| 6         |
| 7         |
| 8         |
| 9         |
+-----------+--+
```

####### 第四步：使用explode拆解Map

```sql
select explode(split(area, ',')) as area from explode2;
+-------------+--+
|    area     |
+-------------+--+
| a:shandong  |
| b:beijing   |
| c:hebei     |
+-------------+--+
```

####### 第五步：拆解json字段

```sql
#思路解析：
#第一步，使用正则表达式，去除[{子字符串
select regexp_replace(sale_info,'\\[\\{','') from explode2;

#第二步，嵌套正则表达式，去除}]子字符串
select regexp_replace(regexp_replace(sale_info,'\\[\\{',''),'\\}\\]','') from explode2;
+----------------------------------------------------+----------------+
|                        _c0                         |                |   
+----------------------------------------------------+----------------+
| "source":"7fresh","monthSales":4900,"userCount":1900,"score":"9.9"},|   {"source":"jd","monthSales":2090,"userCount":78981,"score":"9.8"},   {"source":"jdmart","monthSales":6987,"userCount":1600,"score":"9.0"   |
+----------------------------------------------------+----------------+

#第三步，使用split进行分割，分隔符为 },{
#并使用explode进行拆分成多行
select explode(split(regexp_replace(regexp_replace(sale_info,'\\[\\{',''),'}]',''),'},\\{')) as sale_info from explode2;
+----------------------------------------------------+--+
|                     sale_info                      |
+----------------------------------------------------+--+
| "source":"7fresh","monthSales":4900,"userCount":1900,"score":"9.9" |
| "source":"jd","monthSales":2090,"userCount":78981,"score":"9.8" |
| "source":"jdmart","monthSales":6987,"userCount":1600,"score":"9.0" |
+----------------------------------------------------+--+

#第四步：使用get_json_object获取特定属性的值
hive (hive_explode)> select get_json_object(explode(split(regexp_replace(regexp_replace(sale_info,'\\[\\{',''),'}]',''),'},\\{')),'$.monthSales') as sale_info from explode2;

## 然后出现异常FAILED: SemanticException [Error 10081]: UDTF's are not supported outside the SELECT clause, nor nested in expressions
## UDTF explode不能写在别的函数内
```

select语句中，如果有explode函数，那么不能够查询两个字段及以上，如果想要实现多个字段，要结合lateral view使用。

```sql
select explode(split(area,',')) as area,good_id from explode2;
-- 会报错FAILED: SemanticException 1:40 Only a single expression in the SELECT clause is supported with UDTF's. Error encountered near token 'good_id'
-- 使用UDTF的时候，只支持一个字段，这时候就需要LATERAL VIEW出场了
```

#### 拓展：UDF

```shell
Hive中有三种UDF:
    1、用户定义函数(user-defined function)UDF；
    2、用户定义聚集函数（user-defined aggregate function，UDAF）；
    3、用户定义表生成函数（user-defined table-generating function，UDTF）。
======================================================================================

UDF操作作用于单个数据行，并且产生一个数据行作为输出。大多数函数都属于这一类（比如数学函数和字符串函数）。
UDAF 接受多个输入数据行，并产生一个输出数据行。像COUNT和MAX这样的函数就是聚集函数。
UDTF 操作作用于单个数据行，并且产生多个数据行-------一个表作为输出。lateral view explode()
简单来说：

UDF:返回对应值，一对一
UDAF：返回聚类值，多对一
UDTF：返回拆分值，一对多（explode就是一个udtf函数）
```

#### explode配合LATERAL  VIEW使用

lateral view用于和split、explode等UDTF一起使用的，能将一行数据拆分成多行数据，在此基础上可以对拆分的数据进行聚合

lateral view首先为原始表的每行调用UDTF，UDTF会把一行拆分成一行或者多行，lateral view在把结果组合，产生一个支持别名表的**虚拟表**。

####### 案例1：

```sql
#第一步，创建数据源
vim vim explode_json2
a:shandong,b:beijing,c:hebei|1,2,3,4,5,6,7,8,9|"jimmy"


#第二步：创建表
create table explode3(area string, goods_id string, sale_info string) ROW FORMAT DELIMITED FIELDS TERMINATED BY '|' STORED AS textfile;

#第三步：导入数据
load data local inpath '/kkb/install/hivedatas/explode_json' overwrite into table explode3;

#第四步：查看表
select * from explode3;
+-------------------------------+--------------------+---------------------+--+
|         explode3.area         | explode3.goods_id  | explode3.sale_info  |
+-------------------------------+--------------------+---------------------+--+
| a:shandong,b:beijing,c:hebei  | 1,2,3,4,5,6,7,8,9  | "jimmy"             |
+-------------------------------+--------------------+---------------------+--+

#第五步，结合explode与lateral view来使用,查询两个字段
select goods_id2, sale_info from explode3 LATERAL VIEW explode(split(goods_id, ','))goods as goods_id2;
+------------+------------+--+
| goods_id2  | sale_info  |
+------------+------------+--+
| 1          | "jimmy"    |
| 2          | "jimmy"    |
| 3          | "jimmy"    |
| 4          | "jimmy"    |
| 5          | "jimmy"    |
| 6          | "jimmy"    |
| 7          | "jimmy"    |
| 8          | "jimmy"    |
| 9          | "jimmy"    |
+------------+------------+--+

#goods只是虚拟表的一个别名，改成其它名称也行，不影响结果
#goods_id2是拆分一行产生的列（字段）的名称
```

####### 案例2：解决上面拆分json字段的问题

- explode配合lateral view查询多个字段

```sql
select goods_id2, sale_info from explode2 LATERAL VIEW explode(split(goods_id, ','))goods as goods_id2;
#goods只是虚拟表的一个别名，改成其它名称也行，不影响结果
#goods_id2是拆分一行产生的列（字段）的名称
```

- 其中explode2 LATERAL VIEW explode(split(goods_id,','))goods相当于一个虚拟表，该虚拟表与原表explode2的关系是笛卡尔积关联。
- 笛卡尔积通俗解释：假设集合A={a, b}，集合B={0, 1, 2}，则两个集合的笛卡尔积为{(a, 0), (a, 1), (a, 2), (b, 0), (b, 1), (b, 2)}。
- 也可以多重使用，如下，也是三个表笛卡尔积的结果

```sql
select goods_id2, sale_info, area2 from explode2
LATERAL VIEW explode(split(goods_id, ','))goods as goods_id2 
LATERAL VIEW explode(split(area,','))area as area2;
```

- 最终，我们可以通过下面的句子，把这个json格式的一行数据，完全转换成二维表的方式展现

```sql
select sale_info_1 from explode2  
LATERAL VIEW explode(split(regexp_replace(regexp_replace(sale_info,'\\[\\{',''),'}]',''),'},\\{'))sale_info as sale_info_1;
+----------------------------------------------------+--+
|                    sale_info_1                     |
+----------------------------------------------------+--+
| "source":"7fresh","monthSales":4900,"userCount":1900,"score":"9.9" |
| "source":"jd","monthSales":2090,"userCount":78981,"score":"9.8" |
| "source":"jdmart","monthSales":6987,"userCount":1600,"score":"9.0" |
+----------------------------------------------------+--+



select 
get_json_object(concat('{',sale_info_1,'}'),'$.source') as source, get_json_object(concat('{',sale_info_1,'}'),'$.monthSales') as monthSales, get_json_object(concat('{',sale_info_1,'}'),'$.userCount') as userCount,  get_json_object(concat('{',sale_info_1,'}'),'$.score') as score 
from explode2  
LATERAL VIEW explode(split(regexp_replace(regexp_replace(sale_info,'\\[\\{',''),'}]',''),'},\\{'))sale_info as sale_info_1;
+---------+-------------+------------+--------+--+
| source  | monthsales  | usercount  | score  |
+---------+-------------+------------+--------+--+
| 7fresh  | 4900        | 1900       | 9.9    |
| jd      | 2090        | 78981      | 9.8    |
| jdmart  | 6987        | 1600       | 9.0    |
+---------+-------------+------------+--------+--+
```

**总结：**

- Lateral View通常和UDTF一起出现，为了解决UDTF不允许在select字段的问题。 
- Multiple Lateral View可以实现类似笛卡尔乘积。 
- Outer关键字可以把不输出的UDTF的空结果，输出成NULL，防止丢失数据。



#### 列转行案例

###### 1、函数说明

- EXPLODE(col)：将hive一列中复杂的array或者map结构拆分成多行。

- LATERAL VIEW
  - 用法：LATERAL VIEW udtf(expression) tableAlias AS columnAlias
  - 解释：用于和split, explode等UDTF一起使用，它能够将一列数据拆成多行数据，在此基础上可以对拆分后的数据进行聚合。

###### 2、数据准备

- 数据内容如下，字段之间都是使用\t进行分割

```shell
cd /kkb/install/hivedatas

vim movie.txt

《疑犯追踪》	悬疑,动作,科幻,剧情
《Lie to me》	悬疑,警匪,动作,心理,剧情
《战狼2》	战争,动作,灾难
```

###### 3、需求

- 将电影分类中的数组数据展开。结果如下：

```
《疑犯追踪》	悬疑
《疑犯追踪》	动作
《疑犯追踪》	科幻
《疑犯追踪》	剧情
《Lie to me》	悬疑
《Lie to me》	警匪
《Lie to me》	动作
《Lie to me》	心理
《Lie to me》	剧情
《战狼2》	战争
《战狼2》	动作
《战狼2》	灾难
```

###### 4、创建hive表并导入数据

- 创建hive表

```sql
create table movie_info(movie string, category array<string>) 
row format delimited fields terminated by "\t" 
collection items terminated by ",";
```

- 加载数据

```sql
load data local inpath "/kkb/install/hivedatas/movie.txt" into table movie_info;
```

###### 5、按需求查询数据

```sql
select * from movie_info2;
+--------------------+-----------------------------+--+
| movie_info2.movie  |    movie_info2.category     |
+--------------------+-----------------------------+--+
| 《疑犯追踪》             | ["悬疑","动作","科幻","剧情"]       |
| 《Lie to me》        | ["悬疑","警匪","动作","心理","剧情"]  |
| 《战狼2》              | ["战争","动作","灾难"]            |
+--------------------+-----------------------------+--+


select movie, category_name from movie_info2 
lateral view explode(category) table_tmp as category_name;
+--------------+----------------+--+
|    movie     | category_name  |
+--------------+----------------+--+
| 《疑犯追踪》       | 悬疑             |
| 《疑犯追踪》       | 动作             |
| 《疑犯追踪》       | 科幻             |
| 《疑犯追踪》       | 剧情             |
| 《Lie to me》  | 悬疑             |
| 《Lie to me》  | 警匪             |
| 《Lie to me》  | 动作             |
| 《Lie to me》  | 心理             |
| 《Lie to me》  | 剧情             |
| 《战狼2》        | 战争             |
| 《战狼2》        | 动作             |
| 《战狼2》        | 灾难             |
+--------------+----------------+--+

#table_tmp改成其它名称也行，只是一个别名，自定义即可，不影响结果
```





#### reflect函数

reflect函数可以支持在sql中调用java中的自带函数，秒杀一切udf函数。

###### 1、使用java.lang.Math当中的Max求两列中最大值

- 创建hive表

```sql
create table test_udf(col1 int,col2 int) 
row format delimited fields terminated by ',';
```

- 准备数据并加载数据

```shell
cd /kkb/install/hivedatas
vim test_udf

1,2
4,3
6,4
7,5
5,6
```

- 加载数据

```sql
load data local inpath '/kkb/install/hivedatas/test_udf' overwrite into table test_udf;
```

- 使用java.lang.Math当中的Max求两列当中的最大值

```sql
select reflect("java.lang.Math","max", col1, col2) from test_udf;
```

###### 2、不同记录执行不同的java内置函数

- 创建hive表

```sql
create table test_udf2(class_name string, method_name string, col1 int, col2 int) row format delimited fields terminated by ',';
```

- 准备数据

```shell
vim test_udf2

java.lang.Math,min,1,2
java.lang.Math,max,2,3
```

- 加载数据

```sql
load data local inpath '/kkb/install/hivedatas/test_udf2' overwrite into table test_udf2;
```

- 执行查询

```sql
select reflect(class_name, method_name, col1, col2) from test_udf2;
+------+--+
| _c0  |
+------+--+
| 1    |
| 3    |
+------+--+
```

###### 3、判断是否为数字

- 使用apache commons中的函数，commons下的jar已经包含在hadoop的classpath中，所以可以直接使用。

- 使用方式如下：

```sql
select reflect("org.apache.commons.lang.math.NumberUtils", "isNumber", "123");
+-------+--+
|  _c0  |
+-------+--+
| true  |
+-------+--+
```

#### 分析函数—分组求topN

###### 1、分析函数的作用

- 对于一些比较复杂的数据求取过程，我们可能就要用到分析函数
- 分析函数主要用于==分组求topN或者求取百分比，或者进行数据的切片==等等，我们都可以使用分析函数来解决

###### 2、常用的分析函数

1、ROW_NUMBER()：

- 从1开始，按照顺序，给分组内的记录加序列；
  - 比如，按照pv降序排列，生成分组内每天的pv名次,ROW_NUMBER()的应用场景非常多
  - 再比如，获取分组内排序第一的记录;
  - 获取一个session中的第一条refer等。 

2、RANK() ：

- 生成数据项在分组中的排名，排名相等会在名次中留下空位 

3、DENSE_RANK() ：

- 生成数据项在分组中的排名，排名相等会在名次中不会留下空位 

4、CUME_DIST ：

- 小于等于当前值的行数/分组内总行数。比如，统计小于等于当前薪水的人数，所占总人数的比例 

5、PERCENT_RANK ：

- 分组内当前行的RANK值/分组内总行数

6、NTILE(n) ：

- 用于将分组数据按照顺序切分成n片，返回当前切片值
- 如果切片不均匀，默认增加第一个切片的分布。
- NTILE不支持ROWS BETWEEN，比如 NTILE(2) OVER(PARTITION BY cookieid ORDER BY createtime ROWS BETWEEN 3 PRECEDING AND CURRENT ROW)

7、分析函数的常用语法格式

- rank() over(partition by col1 order by col2)
- dense_rank() over(partition by col1 order by col2)
- row number over(partition by col1 order by col2)
- ...

###### 3、需求描述

- 现有数据内容格式如下，分别对应三个字段，cookieid，createtime ，pv
- 求取每个cookie访问pv前三名的数据记录(根据pv字段的大小进行选取前三名），其实就是分组求topN，求取每组当中的前三个值

```
cookie1,2015-04-10,1
cookie1,2015-04-11,5
cookie1,2015-04-12,7
cookie1,2015-04-13,3
cookie1,2015-04-14,2
cookie1,2015-04-15,4
cookie1,2015-04-16,4
cookie2,2015-04-10,2
cookie2,2015-04-11,3
cookie2,2015-04-12,5
cookie2,2015-04-13,6
cookie2,2015-04-14,3
cookie2,2015-04-15,9
cookie2,2015-04-16,7
```

####### 第一步：创建数据库表

- 在hive当中创建数据库表

```sql
CREATE EXTERNAL TABLE cookie_pv (
cookieid string,
createtime string, 
pv INT
) ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' ;
```

####### 第二步：准备数据并加载

- node03执行以下命令，创建数据，并加载到hive表当中去

```shell
cd /kkb/install/hivedatas
vim cookiepv.txt

cookie1,2015-04-10,1
cookie1,2015-04-11,5
cookie1,2015-04-12,7
cookie1,2015-04-13,3
cookie1,2015-04-14,2
cookie1,2015-04-15,4
cookie1,2015-04-16,4
cookie2,2015-04-10,2
cookie2,2015-04-11,3
cookie2,2015-04-12,5
cookie2,2015-04-13,6
cookie2,2015-04-14,3
cookie2,2015-04-15,9
cookie2,2015-04-16,7
```

- 加载数据到hive表当中去

```sql
load data local inpath '/kkb/install/hivedatas/cookiepv.txt' overwrite into table  cookie_pv;
```

####### 第三步：使用分析函数来求取每个cookie访问PV的前三条记录

```sql
select * from (
SELECT 
cookieid,
createtime,
pv,
RANK() OVER(PARTITION BY cookieid ORDER BY pv desc) AS rn1,
DENSE_RANK() OVER(PARTITION BY cookieid ORDER BY pv desc) AS rn2,
ROW_NUMBER() OVER(PARTITION BY cookieid ORDER BY pv DESC) AS rn3 
FROM cookie_pv 
) temp where temp.rn1 <= 3;
+----------------+------------------+----------+-----------+-----------+-----------+--+
| temp.cookieid  | temp.createtime  | temp.pv  | temp.rn1  | temp.rn2  | temp.rn3  |
+----------------+------------------+----------+-----------+-----------+-----------+--+
| cookie1        | 2015-04-12       | 7        | 1         | 1         | 1         |
| cookie1        | 2015-04-11       | 5        | 2         | 2         | 2         |
| cookie1        | 2015-04-16       | 4        | 3         | 3         | 3         |
| cookie1        | 2015-04-15       | 4        | 3         | 3         | 4         |
| cookie2        | 2015-04-15       | 9        | 1         | 1         | 1         |
| cookie2        | 2015-04-16       | 7        | 2         | 2         | 2         |
| cookie2        | 2015-04-13       | 6        | 3         | 3         | 3         |
+----------------+------------------+----------+-----------+-----------+-----------+--+
```

#### hive自定义函数

###### 1、自定义函数的基本介绍

- Hive 自带了一些函数，比如：max/min等，但是数量有限，自己可以通过自定义UDF来方便的扩展。

- 当Hive提供的内置函数无法满足你的业务处理需要时，此时就可以考虑使用用户自定义函数（UDF：user-defined function）

- 根据用户自定义函数类别分为以下三种：
  - UDF（User-Defined-Function） 一进一出
  - UDAF（User-Defined Aggregation Function）  聚集函数，多进一出，类似于：count/max/min

  - UDTF（User-Defined Table-Generating Functions） 一进多出，如lateral view explode()

​                如lateral view explode()

- 官方文档地址

  https://cwiki.apache.org/confluence/display/Hive/HivePlugins

- 编程步骤：

​        （1）继承org.apache.hadoop.hive.ql.UDF

​        （2）需要实现evaluate函数；evaluate函数支持重载；

- 注意事项

​        （1）UDF必须要有返回类型，可以返回null，但是返回类型不能为void；

​        （2）UDF中常用Text/LongWritable等类型，不推荐使用java类型；

######  2、自定义函数开发

####### 第一步：创建maven java 工程，并导入jar包

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
        <dependency>
            <groupId>org.apache.hive</groupId>
            <artifactId>hive-exec</artifactId>
            <version>1.1.0-cdh5.14.2</version>
        </dependency>
        <dependency>
            <groupId>org.apache.hive</groupId>
            <artifactId>hive-jdbc</artifactId>
            <version>1.1.0-cdh5.14.2</version>
        </dependency>
        <dependency>
            <groupId>org.apache.hive</groupId>
            <artifactId>hive-cli</artifactId>
            <version>1.1.0-cdh5.14.2</version>
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
                    <!--    <verbal>true</verbal>-->
                </configuration>
            </plugin>
        </plugins>
    </build>
```

####### 第二步：开发java类继承UDF，并重载evaluate 方法

```java
package com.kkb.udf.MyUDF;

public class MyUDF extends UDF {
     public Text evaluate(final Text s) {
         if (null == s) {
             return null;
         }
         //返回大写字母         
         return new Text(s.toString().toUpperCase());
     }
 }
```

####### 第三步：项目打包

- 使用maven的package进行打包
- 将我们打包好的jar包上传到node03服务器的/kkb/install/hive-1.1.0-cdh5.14.2/lib 这个路径下

####### 第四步：添加我们的jar包

- 重命名我们的jar包名称

```shell
cd /kkb/install/hive-1.1.0-cdh5.14.2/lib
mv original-day_hive_udf-1.0-SNAPSHOT.jar udf.jar
```

- hive的客户端添加我们的jar包

```sql
0: jdbc:hive2://node03:10000> add jar /kkb/install/hive-1.1.0-cdh5.14.2/lib/udf.jar;
```

####### 第五步：设置函数与我们的自定义函数关联

```sql
0: jdbc:hive2://node03:10000> create temporary function touppercase as 'com.kkb.udf.MyUDF';
```

####### 第六步：使用自定义函数

```sql
0: jdbc:hive2://node03:10000>select tolowercase('abc');
```

- hive当中如何创建永久函数

- 在hive当中添加临时函数，需要我们每次进入hive客户端的时候都需要添加以下，退出hive客户端临时函数就会失效，那么我们也可以创建永久函数来让其不会失效
- 创建永久函数

```sql
-- 1、指定数据库，将我们的函数创建到指定的数据库下面
0: jdbc:hive2://node03:10000>use myhive;

-- 2、使用add jar添加我们的jar包到hive当中来
0: jdbc:hive2://node03:10000>add jar /kkb/install/hive-1.1.0-cdh5.14.2/lib/udf.jar;

-- 3、查看我们添加的所有的jar包
0: jdbc:hive2://node03:10000>list jars;

-- 4、创建永久函数，与我们的函数进行关联
0: jdbc:hive2://node03:10000>create function myuppercase as 'com.kkb.udf.MyUDF';

-- 5、查看我们的永久函数
0: jdbc:hive2://node03:10000>show functions like 'my*';

-- 6、使用永久函数
0: jdbc:hive2://node03:10000>select myhive.myuppercase('helloworld');

-- 7、删除永久函数
0: jdbc:hive2://node03:10000>drop function myhive.myuppercase;

-- 8、查看函数
 show functions like 'my*';
```



#### Json数据解析UDF开发（作业）

- 有原始json数据格式内容如下：

```json
{"movie":"1193","rate":"5","timeStamp":"978300760","uid":"1"} 
{"movie":"661","rate":"3","timeStamp":"978302109","uid":"1"}
{"movie":"914","rate":"3","timeStamp":"978301968","uid":"1"}
{"movie":"3408","rate":"4","timeStamp":"978300275","uid":"1"}
{"movie":"2355","rate":"5","timeStamp":"978824291","uid":"1"}
{"movie":"1197","rate":"3","timeStamp":"978302268","uid":"1"}
{"movie":"1287","rate":"5","timeStamp":"978302039","uid":"1"}
```

- 需求：创建hive表，加载数据，使用自定义函数来解析json格式的数据，最后接的得到如下结果

| movie | rate | timestamp | uid  |
| :---: | :--: | :-------: | :--: |
| 1193  |  5   | 978300760 |  1   |
|  661  |  3   | 978302109 |  1   |
|  914  |  3   | 978301968 |  1   |
| 3408  |  4   | 978300275 |  1   |
| 2355  |  5   | 978824291 |  1   |
| 1197  |  3   | 978302268 |  1   |
| 1287  |  5   | 978302039 |  1   |

参考网页：https://blog.csdn.net/otengyue/article/details/70255202

 

## Hive表的数据压缩 

##### 数据的压缩说明

可使用以下三种标准对压缩方式进行评价

- 1、压缩比：压缩比越高，压缩后文件越小，所以压缩比越高越好
- 2、压缩时间：越快越好
- 3、已经压缩的格式文件是否可以再分割：可以分割的格式允许单一文件由多个Mapper程序处理，可以更好的并行化。比如说，一个300M的压缩文件上传到hdfs后，会被分成3个block，如果该压缩文件不支持切分的话，那么只会产生一个maptask，这个maptask将会处理全部的3个block。

- 常见压缩格式：

| 压缩方式 | 压缩比 | 压缩速度 | 解压缩速度 | 是否可分割 |
| :------: | :----: | :------: | :--------: | :--------: |
|   gzip   | 13.4%  | 21 MB/s  |  118 MB/s  |     否     |
|  bzip2   | 13.2%  | 2.4MB/s  |  9.5MB/s   |     是     |
|   lzo    | 20.5%  | 135 MB/s |  410 MB/s  |     是     |
|  snappy  | 22.2%  | 172 MB/s |  409 MB/s  |     否     |

- Hadoop编码/解码器方式

| 压缩格式 |             对应的编码/解码器              |
| :------: | :----------------------------------------: |
| DEFLATE  | org.apache.hadoop.io.compress.DefaultCodec |
|   Gzip   |  org.apache.hadoop.io.compress.GzipCodec   |
|  BZip2   |  org.apache.hadoop.io.compress.BZip2Codec  |
|   LZO    |     com.hadoop.compress.lzo.LzopCodec      |
|  Snappy  | org.apache.hadoop.io.compress.SnappyCodec  |

压缩性能的比较

| 压缩算法 | 原始文件大小 | 压缩文件大小 | 压缩速度 | 解压速度 |
| -------- | ------------ | ------------ | -------- | -------- |
| gzip     | 8.3GB        | 1.8GB        | 17.5MB/s | 58MB/s   |
| bzip2    | 8.3GB        | 1.1GB        | 2.4MB/s  | 9.5MB/s  |
| LZO      | 8.3GB        | 2.9GB        | 49.3MB/s | 74.6MB/s |

http://google.github.io/snappy/

On a single core of a Core i7 processor in 64-bit mode, Snappy compresses at about 250 MB/sec or more and decompresses at about 500 MB/sec or more.

##### 压缩配置参数

hadoop的压缩的默认配置信息，在hive-default.xml.template文件里都能看到，里面有每个参数的解释信息。

想要在Hadoop中启用压缩，可以配置如下参数（mapred-site.xml文件中）:

| 参数                                                 | 默认值                                                       | 阶段        | 建议                                         |
| ---------------------------------------------------- | ------------------------------------------------------------ | ----------- | -------------------------------------------- |
| io.compression.codecs      （在core-site.xml中配置） | org.apache.hadoop.io.compress.DefaultCodec,   org.apache.hadoop.io.compress.GzipCodec, org.apache.hadoop.io.compress.BZip2Codec,   org.apache.hadoop.io.compress.Lz4Codec | 输入压缩    | Hadoop使用文件扩展名判断是否支持某种编解码器 |
| mapreduce.map.output.compress                        | false                                                        | mapper输出  | 这个参数设为true启用压缩                     |
| mapreduce.map.output.compress.codec                  | org.apache.hadoop.io.compress.DefaultCodec                   | mapper输出  | 使用LZO、LZ4或snappy编解码器在此阶段压缩数据 |
| mapreduce.output.fileoutputformat.compress           | false                                                        | reducer输出 | 这个参数设为true启用压缩                     |
| mapreduce.output.fileoutputformat.compress.codec     | org.apache.hadoop.io.compress. DefaultCodec                  | reducer输出 | 使用标准工具或者编解码器，如gzip和bzip2      |
| mapreduce.output.fileoutputformat.compress.type      | RECORD                                                       | reducer输出 | SequenceFile输出使用的压缩类型：NONE和BLOCK  |

##### 开启Map输出阶段压缩

开启map输出阶段压缩可以减少job中map和Reduce task间数据传输量。具体配置如下：

**案例实操：**

```sql
-- 1）开启hive中间传输数据压缩功能
hive (default)>set hive.exec.compress.intermediate=true;

-- 2）开启mapreduce中map输出压缩功能
hive (default)>set mapreduce.map.output.compress=true;

-- 3）设置mapreduce中map输出数据的压缩方式
hive (default)>set mapreduce.map.output.compress.codec= org.apache.hadoop.io.compress.SnappyCodec;

-- 4）执行查询语句
   select count(1) from score;
```

中间传输的意思：一个hql语句中，可能产生多个mapreduce。比如说mr1--->mr2--->mr3--->最终结果，那么mr2处理的数据就是中间传输数据。

##### 开启Reduce输出阶段压缩

当Hive将输出写入到表中时，输出内容同样可以进行压缩。属性hive.exec.compress.output控制着这个功能。用户可能需要保持默认设置文件中的默认值false，这样默认的输出就是非压缩的纯文本文件了。用户可以通过在查询语句或执行脚本中设置这个值为true，来开启输出结果压缩功能。

**案例实操：**(只对当前session有效)

```sql
-- 1）开启hive最终输出数据压缩功能
hive (default)>set hive.exec.compress.output=true;

-- 2）开启mapreduce最终输出数据压缩
hive (default)>set mapreduce.output.fileoutputformat.compress=true;

-- 3）设置mapreduce最终数据输出压缩方式
hive (default)> set mapreduce.output.fileoutputformat.compress.codec = org.apache.hadoop.io.compress.SnappyCodec;

-- 4）设置mapreduce最终数据输出压缩为块压缩
hive (default)>set mapreduce.output.fileoutputformat.compress.type=BLOCK;

-- 5）测试一下输出结果是否是压缩文件
insert overwrite local directory '/kkb/install/hivedatas/score_export' row format delimited fields terminated by '\t' select * from score;

```

![image-20200225021213538](hive.assets/image-20200225021213538.png)

## Hive表的文件存储格式

Hive支持的存储数据的格式主要有：TEXTFILE（行式存储） 、SEQUENCEFILE(行式存储)、ORC（列式存储）、PARQUET（列式存储）。企业中使用orc较多。

##### 1、列式存储和行式存储

![img](hive.assets/clip_image002.jpg)

上图左边为逻辑表，右边第一个为行式存储，第二个为列式存储。

**行存储的特点：** 查询满足条件的一整行数据的时候，列存储则需要去每个聚集的字段找到对应的每个列的值，行存储只需要找到其中一个值，其余的值都在相邻地方，所以此时行存储查询的速度更快。select  *  

**列存储的特点：** 因为每个字段的数据聚集存储，在查询只需要少数几个字段的时候，能大大减少读取的数据量；每个字段的数据类型一定是相同的，列式存储可以针对性的设计更好的设计压缩算法。  select   某些字段效率更高

TEXTFILE和SEQUENCEFILE的存储格式都是基于行存储的；

ORC和PARQUET是基于列式存储的。

##### 2 、TEXTFILE格式

默认格式，数据不做压缩，磁盘开销大，数据解析开销大。可结合Gzip、Bzip2使用(系统自动检查，执行查询时自动解压)，但使用这种方式，hive不会对数据进行切分，从而无法对数据进行并行操作。

##### 3 、ORC格式（了解就行）

Orc (Optimized Row Columnar)是hive 0.11版里引入的新的存储格式。

可以看到每个Orc文件由1个或多个stripe组成，每个stripe250MB大小，这个Stripe实际相当于RowGroup概念，不过大小由4MB->250MB，这样能提升顺序读的吞吐率。每个Stripe里有三部分组成，分别是Index Data,Row Data,Stripe Footer：

![img](hive.assets/clip_image003.png)

一个orc文件可以分为若干个Stripe

一个stripe可以分为三个部分

indexData：某些列的索引数据

rowData :真正的数据存储

StripFooter：stripe的元数据信息

   1）Index Data：一个轻量级的index，默认是每隔1W行做一个索引。这里做的索引只是记录某行的各字段在Row Data中的offset。

​    2）Row Data：存的是具体的数据，先取部分行，然后对这些行按列进行存储。对每个列进行了编码，分成多个Stream来存储。

​    3）Stripe Footer：存的是各个stripe的元数据信息

每个文件有一个File Footer，这里面存的是每个Stripe的行数，每个Column的数据类型信息等；每个文件的尾部是一个PostScript，这里面记录了整个文件的压缩类型以及FileFooter的长度信息等。在读取文件时，会seek到文件尾部读PostScript，从里面解析到File Footer长度，再读FileFooter，从里面解析到各个Stripe信息，再读各个Stripe，即从后往前读。

##### 4 、PARQUET格式(了解就行)

Parquet是面向分析型业务的列式存储格式，由Twitter和Cloudera合作开发，2015年5月从Apache的孵化器里毕业成为Apache顶级项目。

Parquet文件是以二进制方式存储的，所以是不可以直接读取的，文件中包括该文件的数据和元数据，因此Parquet格式文件是自解析的。

通常情况下，在存储Parquet数据的时候会按照Block大小设置**行组**的大小，由于一般情况下每一个Mapper任务处理数据的最小单位是一个Block，这样可以把每一个行组由一个Mapper任务处理，增大任务执行并行度。Parquet文件的格式如下图所示。

![Parquet文件格式](hive.assets/clip_image005.jpg)

上图展示了一个Parquet文件的内容，一个文件中可以存储多个行组，文件的首位都是该文件的Magic Code，用于校验它是否是一个Parquet文件，Footer length记录了文件元数据的大小，通过该值和文件长度可以计算出元数据的偏移量，文件的元数据中包括每一个行组的元数据信息和该文件存储数据的Schema信息。除了文件中每一个行组的元数据，每一页的开始都会存储该页的元数据，在Parquet中，有三种类型的页：数据页、字典页和索引页。数据页用于存储当前行组中该列的值，字典页存储该列值的编码字典，每一个列块中最多包含一个字典页，索引页用来存储当前行组下该列的索引，目前Parquet中还不支持索引页。



##### 5、主流文件存储格式对比实验

从存储文件的压缩比和查询速度两个角度对比,使用stored as关键字来设置存储格式。

###### 存储文件的压缩比测试

测试数据 参见log.data 18.1M

####### 1）TextFile

（1）创建表，存储数据格式为TEXTFILE

```sql
use myhive;
create table log_text (
track_time string,
url string,
session_id string,
referer string,
ip string,
end_user_id string,
city_id string
)ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
STORED AS TEXTFILE ;
```

（2）向表中加载数据

```sql
load data local inpath '/kkb/install/hivedatas/log.data' into table log_text ;
```

（3）查看表中数据大小，大小为18.1M

```shell
dfs -du -h /user/hive/warehouse/db1.db/log_text;
+----------------------------------------------------+--+
|                     DFS Output                     |
+----------------------------------------------------+--+
| 18.1 M  54.4 M  /user/hive/warehouse/db1.db/log_text/log.data |
+----------------------------------------------------+--+
```

####### 2）ORC

（1）创建表，存储数据格式为ORC

```sql
create table log_orc(
track_time string,
url string,
session_id string,
referer string,
ip string,
end_user_id string,
city_id string)
ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
STORED AS orc ;
```

（2）向表中加载数据

```sql
insert into table log_orc select * from log_text ;
```

（3）查看表中数据大小,大小为2.8M

```shell
dfs -du -h /user/hive/warehouse/db1.db/log_orc;
+----------------------------------------------------+--+
|                     DFS Output                     |
+----------------------------------------------------+--+
| 2.8 M  8.3 M  /user/hive/warehouse/db1.db/log_orc/000000_0 |
+----------------------------------------------------+--+
```

orc这种存储格式，默认使用了zlib压缩方式来对数据进行压缩，所以数据会变成了2.8M，非常小

####### 3）Parquet

（1）创建表，存储数据格式为parquet

```sql
create table log_parquet(
track_time string,
url string,
session_id string,
referer string,
ip string,
end_user_id string,
city_id string)
ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
STORED AS PARQUET ;  
```

（2）向表中加载数据

```sql
insert into table log_parquet select * from log_text ;
```

（3）查看表中数据，大小为13.1M

```shell
dfs -du -h /user/hive/warehouse/db1.db/log_parquet;
+----------------------------------------------------+--+
|                     DFS Output                     |
+----------------------------------------------------+--+
| 13.1 M  39.3 M  /user/hive/warehouse/db1.db/log_parquet/000000_0 |
+----------------------------------------------------+--+
```

存储文件的压缩比总结：

```
ORC >  Parquet >  textFile
```



###### 存储文件的查询速度测试

```
1）TextFile
hive (default)> select count(*) from log_text;
_c0
100000
Time taken: 21.54 seconds, Fetched: 1 row(s)  

2）ORC
hive (default)> select count(*) from log_orc;
_c0
100000
Time taken: 20.867 seconds, Fetched: 1 row(s)  

3）Parquet
hive (default)> select count(*) from log_parquet; 
_c0
100000
Time taken: 22.922 seconds, Fetched: 1 row(s)

存储文件的查询速度总结：
ORC > TextFile > Parquet
```

## 存储和压缩结合

官网：https://cwiki.apache.org/confluence/display/Hive/LanguageManual+ORC

ORC存储方式的压缩信息如下，默认是使用ZLIB格式进行压缩：

| Key                      | Default    | Notes                                                        |
| ------------------------ | ---------- | ------------------------------------------------------------ |
| orc.compress             | ZLIB       | high level   compression (one of NONE, ZLIB, SNAPPY)         |
| orc.compress.size        | 262,144    | number of bytes in   each compression chunk                  |
| orc.stripe.size          | 67,108,864 | number of bytes in   each stripe                             |
| orc.row.index.stride     | 10,000     | number of rows   between index entries (must be >= 1000)     |
| orc.create.index         | true       | whether to create row   indexes                              |
| orc.bloom.filter.columns | ""         | comma separated list of column names for which bloom filter   should be created |
| orc.bloom.filter.fpp     | 0.05       | false positive probability for bloom filter (must >0.0 and   <1.0) |

##### 1）创建一个非压缩的的ORC存储方式

修改ORC的压缩方式要通过关键字tblproperties来修改，tblproperties允许我们开发者定义一些自己的键值对信息。

（1）建表语句

```sql
create table log_orc_none(
track_time string,
url string,
session_id string,
referer string,
ip string,
end_user_id string,
city_id string
)
ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
STORED AS orc tblproperties ("orc.compress"="NONE");
```

（2）插入数据

```sql
insert into table log_orc_none select * from log_text ;
```

（3）查看插入后数据,数据大小为7.7M

```shell
dfs -du -h /user/hive/warehouse/db1.db/log_orc_none;
+----------------------------------------------------+--+
|                     DFS Output                     |
+----------------------------------------------------+--+
| 7.7 M  23.2 M  /user/hive/warehouse/db1.db/log_orc_none/000000_0 |
+----------------------------------------------------+--+
```

##### 2）创建一个SNAPPY压缩的ORC存储方式

（1）建表语句

```sql
create table log_orc_snappy(
track_time string,
url string,
session_id string,
referer string,
ip string,
end_user_id string,
city_id string
)
ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
STORED AS orc tblproperties ("orc.compress"="SNAPPY");
```

（2）插入数据

```sql
insert into table log_orc_snappy select * from log_text ;
```

（3）查看插入后数据,数据大小为3.8M

```shell
dfs -du -h /user/hive/warehouse/myhive.db/log_orc_snappy ;
+----------------------------------------------------+--+
|                     DFS Output                     |
+----------------------------------------------------+--+
| 3.8 M  11.4 M  /user/hive/warehouse/db1.db/log_orc_snappy/000000_0 |
+----------------------------------------------------+--+
```

3）上一节中默认创建的ORC存储方式，导入数据后的大小为2.8M

```shell
dfs -du -h /user/hive/warehouse/db1.db/log_orc ;
+----------------------------------------------------+--+
|                     DFS Output                     |
+----------------------------------------------------+--+
| 2.8 M  8.3 M  /user/hive/warehouse/db1.db/log_orc/000000_0 |
+----------------------------------------------------+--+
```

比Snappy压缩的还小。原因是orc存储文件默认采用ZLIB压缩。比snappy压缩的小。

4）存储方式和压缩总结：

==在实际的项目开发当中，hive表的数据存储格式一般选择：orc或parquet。压缩方式一般选择snappy。==

## 企业实战

###### 1 通过MultiDelimitSerDe 解决多字符分割场景

- 1、创建表,指定分隔符为"##"

```sql
create database myhive;
use myhive;
create  table t1 (id String, name string)
row format serde 'org.apache.hadoop.hive.contrib.serde2.MultiDelimitSerDe'
WITH SERDEPROPERTIES ("field.delim"="##");

```

- 2、准备数据 t1.txt

```sql
cd /kkb/install/hivedatas
vim t1.txt


1##xiaoming
2##xiaowang
3##xiaozhang
```

- 3、加载数据

```sql
load data local inpath '/kkb/install/hivedatas/t1.txt' into table t1;
```

- 4、查询数据

```sql
0: jdbc:hive2://node1:10000> select * from t1;
+--------+------------+--+
| t1.id  |  t1.name   |
+--------+------------+--+
| 1      | xiaoming   |
| 2      | xiaowang   |
| 3      | xiaozhang  |
+--------+------------+--+
```

###### 2 通过RegexSerDe 解决多字符分割场景

- 1、创建表

```sql
create  table t2(id int, name string)
row format serde 'org.apache.hadoop.hive.serde2.RegexSerDe' 
WITH SERDEPROPERTIES ("input.regex" = "^(.*)\\#\\#(.*)$");  --参考java正则表达式即可
```

- 2、准备数据 t1.txt

```
1##xiaoming
2##xiaowang
3##xiaozhang
```

- 3、加载数据

```sql
load data local inpath '/kkb/install/hivedatas/t1.txt' into table t2;
```

- 4、查询数据

```sql
0: jdbc:hive2://node1:10000> select * from t2;
+--------+------------+--+
| t2.id  |  t2.name   |
+--------+------------+--+
| 1      | xiaoming   |
| 2      | xiaowang   |
| 3      | xiaozhang  |
+--------+------------+--+
```



## hive的企业级调优

##### 1、Fetch抓取

- Fetch抓取是指，Hive中对某些情况的**查询**可以不必使用MapReduce计算。

  - 例如：select * from score;
  - 在这种情况下，Hive可以简单地读取employee对应的存储目录下的文件，然后输出查询结果到控制台

- 在hive-default.xml.template文件中 hive.fetch.task.conversion默认是more，老版本hive默认是minimal，该属性修改为more以后，在全局查找、字段查找、limit查找等都不走mapreduce。

- 案例实操

  - 把 hive.fetch.task.conversion设置成none，然后执行查询语句，都会执行mapreduce程序

  ```sql
  set hive.fetch.task.conversion=none;
  select * from score;
  select s_id from score;
  select s_id from score limit 3;
  ```

  - 把hive.fetch.task.conversion设置成more，然后执行查询语句，如下查询方式都不会执行mapreduce程序。

  ```sql
  set hive.fetch.task.conversion=more;
  select * from score;
  select s_id from score;
  select s_id from score limit 3;
  ```

##### 2、本地模式

- 在Hive客户端测试时，默认情况下是启用hadoop的job模式,把任务提交到集群中运行，这样会导致计算非常缓慢；

- Hive可以通过本地模式在单台机器上处理任务。对于小数据集，执行时间可以明显被缩短。

- 示意图如下：

  <img src="hive.assets/image-20200225151252482.png" alt="image-20200225151252482" style="zoom:80%;" />

- 案例实操


```sql
--开启本地模式，并执行查询语句
set hive.exec.mode.local.auto=true;  //开启本地mr

--设置local mr的最大输入数据量，当输入数据量小于这个值时采用local  mr的方式，
--默认为134217728，即128M
set hive.exec.mode.local.auto.inputbytes.max=50000000;

--设置local mr的最大输入文件个数，当输入文件个数小于这个值时采用local mr的方式，
--默认为4
set hive.exec.mode.local.auto.input.files.max=5;


--执行查询的sql语句
select * from student cluster by s_id;
```

```sql
--关闭本地运行模式
set hive.exec.mode.local.auto=false;
select * from student cluster by s_id;
```



##### 3、表的优化

###### 小表、大表 join

- 将key相对分散，并且数据量小的表放在join的左边，hive会将小表进行缓存，这样可以有效减少内存溢出错误发生的几率。但是实际测试发现：新版的hive已经对小表 join 大表和大表 join 小表进行了优化。小表放在左边和右边已经没有明显区别。

- 再进一步，可以使用map join让小的维度表（1000条以下的记录条数）先进内存。在map端完成reduce。

- 多个表关联时，最好分拆成小段，避免大sql（否则无法控制中间Job）。a join b-->b join c

  ```sql
  select  count(distinct s_id)  from score;
  select count(s_id) from score group by s_id;  #在map端进行聚合，效率更高
  
  
  select  count(distinct s_id)  from score;
  select count(1) from (
      select count(1) from score group  by  s_id);  ## 
  ```

###### 大表 join 大表

- 1．空 key 过滤

  - 有时join超时是因为某些key对应的数据太多，而相同key对应的数据都会发送到相同的reducetask上，从而导致内存不够。

  - 此时我们应该仔细分析这些异常的key，很多情况下，这些key对应的数据是异常数据，我们需要在SQL语句中进行过滤掉这些数据。下面进行空key过滤的时候

  - 测试环境准备：

    ```sql
    ## 数据格式大致如下，第一个字段是id,
    1	20111230000005	57375476989eea12893c0c3811607bcf	奇艺高清	1	1	http://www.qiyi.com/
    2	20111230000005	66c5bb7774e31d0a22278249b26bc83a	凡人修仙传	3	1	http://www.booksky.org/BookDetail.aspx?BookID=1050804&Level=1
    3	20111230000007	b97920521c78de70ac38e3713f524b50	本本联盟	1	1	http://www.bblianmeng.com/
    ```

    ```sql
    use myhive;
    create table ori(id bigint, time bigint, uid string, keyword string, url_rank int, click_num int, click_url string) row format delimited fields terminated by '\t';
    
    create table nullidtable(id bigint, time bigint, uid string, keyword string, url_rank int, click_num int, click_url string) row format delimited fields terminated by '\t';
    
    create table jointable(id bigint, time bigint, uid string, keyword string, url_rank int, click_num int, click_url string) row format delimited fields terminated by '\t';
    
    ## 把没那么多id为null的数据加载进ori
    load data local inpath '/kkb/install/hivedatas/hive_big_table/*' into table ori; 
    ## 把很多id为null的数据加载进nullidtable
    load data local inpath '/kkb/install/hivedatas/hive_have_null_id/*' into table nullidtable;
    ```

    过滤空key与不过滤空key的结果比较

    ```sql
    #不过滤：
    INSERT OVERWRITE TABLE jointable
    SELECT a.* FROM nullidtable a JOIN ori b ON a.id = b.id;
    #结果：
    No rows affected (152.135 seconds)
    
    #过滤：
    INSERT OVERWRITE TABLE jointable
    SELECT a.* FROM (SELECT * FROM nullidtable WHERE id IS NOT NULL ) a JOIN ori b ON a.id = b.id;
    #结果：
    No rows affected (141.585 seconds)
    ```

- 2、空 key 转换

  - 有时虽然某个 key 为空对应的数据很多，但是相应的数据不是异常数据，必须要包含在 join 的结果中，此时我们可以表 a 中 key 为空的字段赋一个随机的值，使得数据随机均匀地分不到不同的 reducer 上。

  - 不随机分布：

    ```sql
    set hive.exec.reducers.bytes.per.reducer=32123456;
    set mapreduce.job.reduces=7;
    INSERT OVERWRITE TABLE jointable
    SELECT a.*
    FROM nullidtable a
    LEFT JOIN ori b ON CASE WHEN a.id IS NULL THEN 'hive' ELSE a.id END = b.id;
    No rows affected (41.668 seconds)  
    ```

  - 结果：这样的后果就是所有为null值的id全部都变成了相同的字符串，及其容易造成数据的倾斜（所有的key相同，相同key的数据依然会到同一个reduce当中去）

    为了解决这种情况，我们可以通过hive的rand函数，随记的给每一个为空的id赋上一个随机值，这样就不会造成数据倾斜。		

  - 随机分布：

    ```sql
    set hive.exec.reducers.bytes.per.reducer=32123456;
    set mapreduce.job.reduces=7;
    INSERT OVERWRITE TABLE jointable
    SELECT a.*
    FROM nullidtable a
    LEFT JOIN ori b ON CASE WHEN a.id IS NULL THEN concat('hive', rand()) ELSE a.id END = b.id;
    
    No rows affected (42.594 seconds)  
    ```

    


###### 大表join小表与小表join大表实测

需求：测试大表JOIN小表和小表JOIN大表的效率 （新的版本当中已经没有区别了，旧的版本当中需要使用小表）

（1）建大表、小表和JOIN后表的语句

```sql
create table bigtable(id bigint, time bigint, uid string, keyword string, url_rank int, click_num int, click_url string) row format delimited fields terminated by '\t';

create table smalltable(id bigint, time bigint, uid string, keyword string, url_rank int, click_num int, click_url string) row format delimited fields terminated by '\t';

create table jointable2(id bigint, time bigint, uid string, keyword string, url_rank int, click_num int, click_url string) row format delimited fields terminated by '\t';

```

（2）分别向大表和小表中导入数据

```sql
hive (default)> load data local inpath '/kkb/install/hivedatas/big_data' into table bigtable;

hive (default)> load data local inpath '/kkb/install/hivedatas/small_data' into table smalltable;
```

###### map  join 

- 如果不指定MapJoin 或者不符合 MapJoin的条件，那么Hive解析器会将Join操作转换成Common Join，即：在Reduce阶段完成join。容易发生数据倾斜。可以用 MapJoin 把小表全部加载到内存，在map端进行join，避免reducer处理,参考学习mpareduce时候的mapjoin,原理是一样的。

- 1、开启MapJoin参数设置


```sql
 --默认为true
set hive.auto.convert.join = true;
```

- 2、大表小表的阈值设置（默认25M一下认为是小表）

```sql
set hive.mapjoin.smalltable.filesize=26214400;
```

- 3、MapJoin工作机制

![xxx](hive.assets/xxx-1570506631515.jpg)

首先是Task A，它是一个Local Task（在客户端本地执行的Task），负责扫描小表b的数据，将其转换成一个HashTable的数据结构，并写入本地的文件中，之后将该文件加载到DistributeCache分布式缓存中。

接下来是Task B，该任务是一个没有Reduce的MR，启动MapTasks扫描大表a,在Map阶段，根据a的每一条记录去和DistributeCache中b表对应的HashTable关联，并直接输出结果。

由于MapJoin没有Reduce，所以由Map直接输出结果文件，有多少个Map Task，就有多少个结果文件。

**案例实操：**

（1）开启Mapjoin功能

```sql
set hive.auto.convert.join = true; 默认为true
```

（2）执行小表JOIN大表语句

```sql
INSERT OVERWRITE TABLE jointable2
SELECT b.id, b.time, b.uid, b.keyword, b.url_rank, b.click_num, b.click_url
FROM smalltable s
JOIN bigtable  b
ON s.id = b.id;

Time taken: 31.814 seconds
```

（3）执行大表JOIN小表语句

```
INSERT OVERWRITE TABLE jointable2
SELECT b.id, b.time, b.uid, b.keyword, b.url_rank, b.click_num, b.click_url
FROM bigtable  b
JOIN smalltable  s
ON s.id = b.id;

Time taken: 28.46 seconds
```



###### group By

默认情况下，Map阶段同一Key数据分发给一个reduce，当一个key数据过大时就倾斜了。

并不是所有的聚合操作都需要在Reduce端完成，很多聚合操作都可以先在Map端进行部分聚合，最后在Reduce端得出最终结果。

开启Map端聚合参数设置:

```sql
--是否在Map端进行聚合，默认为True
set hive.map.aggr = true;
--在Map端进行聚合操作的条目数目
set hive.groupby.mapaggr.checkinterval = 100000;
--有数据倾斜的时候进行负载均衡（默认是false）
set hive.groupby.skewindata = true;

当hive.groupby.skewindata选项设定为 true，生成的查询计划会有两个MR Job。第一个MR Job中，Map的输出结果会随机分布到Reduce中，每个Reduce做部分聚合操作，并输出结果，这样处理的结果是相同的Group By Key有可能被分发到不同的Reduce中，从而达到负载均衡的目的；第二个MR Job再根据预处理的数据结果按照Group By Key分布到Reduce中（这个过程可以保证相同的Group By Key被分布到同一个Reduce中），最后完成最终的聚合操作。
```

![image-20200225223900011](hive.assets/image-20200225223900011.png)

###### count(distinct) 

- 数据量小的时候无所谓，数据量大的情况下，由于count distinct 操作需要用一个reduce Task来完成，这一个Reduce需要处理的数据量太大，就会导致整个Job很难完成，一般count distinct使用先group by 再count的方式替换

  环境准备：

  

  ```sql
  create table bigtable(id bigint, time bigint, uid string, keyword string, url_rank int, click_num int, click_url string) row format delimited fields terminated by '\t';
  
  load data local inpath '/kkb/install/hivedatas/data/100万条大表数据（id除以10取整）/bigtable' into table bigtable;
  
  
  --每个reduce任务处理的数据量 默认256000000（256M）
   set hive.exec.reducers.bytes.per.reducer=32123456;
   
   select  count(distinct ip )  from log_text;
   
  --转换成:
   set hive.exec.reducers.bytes.per.reducer=32123456;
   select count(ip) from (select ip from log_text group by ip) t;
  
  --虽然会多用一个Job来完成，但在数据量大的情况下，这个绝对是值得的。
  ```

###### 笛卡尔积

- 尽量避免笛卡尔积，即避免join的时候不加on条件，或者无效的on条件
- Hive只能使用1个reducer来完成笛卡尔积。

##### 4、使用分区剪裁、列剪裁

尽可能早地过滤掉尽可能多的数据量，避免大量数据流入外层SQL。

**列剪裁**

- 只获取需要的列的数据，减少数据输入。

**分区裁剪**

- 分区在hive实质上是目录，分区裁剪可以方便直接地过滤掉大部分数据。

尽量使用**分区过滤**，少用select  *



案例环境准备：

```sql
create table ori(id bigint, time bigint, uid string, keyword string, url_rank int, click_num int, click_url string) row format delimited fields terminated by '\t';

create table bigtable(id bigint, time bigint, uid string, keyword string, url_rank int, click_num int, click_url string) row format delimited fields terminated by '\t';

load data local inpath '/home/admin/softwares/data/加递增id的原始数据/ori' into table ori;

load data local inpath '/home/admin/softwares/data/100万条大表数据（id除以10取整）/bigtable' into table bigtable;
```

先关联再Where：

```sql
SELECT a.id
FROM bigtable a
LEFT JOIN ori b ON a.id = b.id
WHERE b.id <= 10;
```

正确的写法是写在ON后面：先Where再关联

```sql
SELECT a.id
FROM ori a
LEFT JOIN bigtable b ON (a.id <= 10 AND a.id = b.id);
```

或者直接写成子查询：

```sql
SELECT a.id
FROM bigtable a
RIGHT JOIN (SELECT id
FROM ori
WHERE id <= 10
) b ON a.id = b.id;
```



##### 5、并行执行

- 把一个sql语句中没有相互依赖的阶段并行去运行。提高集群资源利用率

```sql
--开启并行执行
set hive.exec.parallel=true;
--同一个sql允许最大并行度，默认为8。
set hive.exec.parallel.thread.number=16;
```



##### 6、严格模式

- Hive提供了一个严格模式，可以防止用户执行那些可能意想不到的不好的影响的查询。

- 通过设置属性hive.mapred.mode值为默认是非严格模式**nonstrict** 。开启严格模式需要修改hive.mapred.mode值为**strict**，开启严格模式可以禁止3种类型的查询。

  ```sql
  --设置非严格模式（默认）
  set hive.mapred.mode=nonstrict;
  
  --设置严格模式
  set hive.mapred.mode=strict;
  ```

- （1）对于分区表，除非where语句中含有分区字段过滤条件来限制范围，否则不允许执行

  ```sql
  ## 设置严格模式下 执行select *语句报错； 非严格模式下是可以的
  0: jdbc:hive2://node03:10000> show partitions score;
  +---------------+--+
  |   partition   |
  +---------------+--+
  | month=201805  |
  +---------------+--+
  
  0: jdbc:hive2://node03:10000> select * from score; #报错
  Error: Error while compiling statement: FAILED: SemanticException [Error 10041]: No partition predicate found for Alias "score" Table "score" (state=42000,code=10041)
  
  0: jdbc:hive2://node03:10000> select * from score where month=201805;
  +-------------+-------------+----------------+--------------+--+
  | score.s_id  | score.c_id  | score.s_score  | score.month  |
  +-------------+-------------+----------------+--------------+--+
  | 01          | 01          | 80             | 201805       |
  | 01          | 02          | 90             | 201805       |
  | 01          | 03          | 99             | 201805       |
  | 02          | 01          | 70             | 201805       |
  | 02          | 02          | 60             | 201805       |
  | 02          | 03          | 80             | 201805       |
  | 03          | 01          | 80             | 201805       |
  | 03          | 02          | 80             | 201805       |
  | 03          | 03          | 80             | 201805       |
  | 04          | 01          | 50             | 201805       |
  | 04          | 02          | 30             | 201805       |
  | 04          | 03          | 20             | 201805       |
  | 05          | 01          | 76             | 201805       |
  | 05          | 02          | 87             | 201805       |
  | 06          | 01          | 31             | 201805       |
  | 06          | 03          | 34             | 201805       |
  | 07          | 02          | 89             | 201805       |
  | 07          | 03          | 98             | 201805       |
  +-------------+-------------+----------------+--------------+--+
  ```

- （2）对于使用了order by语句的查询，要求必须使用limit语句。因为order by是全局排序，只产生一个reducetask，是比较危险的,数据量可能很大。

  ```sql
  --设置严格模式下 执行sql语句报错； 非严格模式下是可以的
  select * from order_partition where month='2019-03' order by order_price; 
  
  异常信息：Error: Error while compiling statement: FAILED: SemanticException 1:61 In strict mode, if ORDER BY is specified, LIMIT must also be specified. Error encountered near token 'order_price'
  ```

- （3）限制笛卡尔积的查询

  - 严格模式下，避免出现笛卡尔积的查询



##### 7、JVM重用

- JVM重用是Hadoop调优参数的内容，其对Hive的性能具有非常大的影响，特别是对于很难避免小文件的场景或task特别多的场景，这类场景大多数执行时间都很短。

  Hadoop的默认配置通常是使用派生JVM来执行map和Reduce任务的。这时JVM的启动过程可能会造成相当大的开销，尤其是执行的job包含有成百上千task任务的情况。JVM重用可以使得JVM实例在同一个job中重新使用N次。N的值可以在Hadoop的mapred-site.xml文件中进行配置。通常在10-20之间，具体多少需要根据具体业务场景测试得出。

  ```
  <property>
    <name>mapreduce.job.jvm.numtasks</name>
    <value>10</value>
    <description>How many tasks to run per jvm. If set to -1, there is
    no limit. 
    </description>
  </property>
  
  ```

  我们也可以在hive当中通过

  ```
   set  mapred.job.reuse.jvm.num.tasks=10;
  ```

  这个设置来设置我们的jvm重用

  这个功能的缺点是，开启JVM重用将一直占用使用到的task插槽，以便进行重用，直到任务完成后才能释放。如果某个“不平衡的”job中有某几个reduce task执行的时间要比其他Reduce task消耗的时间多的多的话，那么保留的插槽就会一直空闲着却无法被其他的job使用，直到所有的task都结束了才会释放。

##### 8、推测执行

- 在分布式集群环境下，因为程序Bug（包括Hadoop本身的bug），负载不均衡或者资源分布不均等原因，会造成同一个job作业的多个任务之间运行速度不一致，有些任务的运行速度可能明显慢于其他任务（比如一个作业的某个任务进度只有50%，而其他所有任务已经运行完毕），则这些任务会拖慢作业的整体执行进度。为了避免这种情况发生，Hadoop采用了推测执行（Speculative Execution）机制，它根据一定的法则推测出“拖后腿”的任务，并为这样的任务启动一个备份任务，让该任务与原始任务同时处理同一份数据，并最终选用最先成功运行完成任务的计算结果作为最终结果。

  ![image-20200225233240867](hive.assets/image-20200225233240867.png)

  设置开启推测执行参数：Hadoop的mapred-site.xml文件中进行配置

```sql
<property>
  <name>mapreduce.map.speculative</name>
  <value>true</value>
  <description>If true, then multiple instances of some map tasks 
               may be executed in parallel.</description>
</property>

<property>
  <name>mapreduce.reduce.speculative</name>
  <value>true</value>
  <description>If true, then multiple instances of some reduce tasks 
               may be executed in parallel.</description>
</property>

```

不过hive本身也提供了配置项来控制reduce-side的推测执行：

```
  <property>
    <name>hive.mapred.reduce.tasks.speculative.execution</name>
    <value>true</value>
    <description>Whether speculative execution for reducers should be turned on. </description>
  </property>

```

关于调优这些推测执行变量，还很难给一个具体的建议。如果用户对于运行时的偏差非常敏感的话，那么可以将这些功能关闭掉。如果用户因为输入数据量很大而需要执行长时间的map或者Reduce task的话，那么启动推测执行造成的浪费是非常巨大大。



##### 9、压缩

​	参见数据的压缩

- Hive表中间数据压缩

  ```shell
  #设置为true为激活中间数据压缩功能，默认是false，没有开启
  set hive.exec.compress.intermediate=true;
  #设置中间数据的压缩算法
  set mapred.map.output.compression.codec= org.apache.hadoop.io.compress.SnappyCodec;
  
  ```

- Hive表最终输出结果压缩

  ```shell
  set hive.exec.compress.output=true;
  set mapred.output.compression.codec= 
  org.apache.hadoop.io.compress.SnappyCodec;
  ```

##### 10、使用EXPLAIN--执行计划（TODO）

有待其它时间继续深入理解explain执行计划

查看hql执行计划方法：

```sql
0: jdbc:hive2://node03:10000> expain select * from score where month=201805;
+----------------------------------------------------+--+
|                      Explain                       |
+----------------------------------------------------+--+
| STAGE DEPENDENCIES:                                |
|   Stage-0 is a root stage                          |
|                                                    |
| STAGE PLANS:                                       |
|   Stage: Stage-0                                   |
|     Fetch Operator                                 |
|       limit: -1                                    |
|       Processor Tree:                              |
|         TableScan                                  |
|           alias: score                             |
|           Statistics: Num rows: 1 Data size: 162 Basic stats: PARTIAL Column stats: NONE |
|           Select Operator                          |
|             expressions: s_id (type: string), c_id (type: string), s_score (type: int), '201805' (type: string) |
|             outputColumnNames: _col0, _col1, _col2, _col3 |
|             Statistics: Num rows: 1 Data size: 162 Basic stats: PARTIAL Column stats: NONE |
|             ListSink                               |
|                                                    |
+----------------------------------------------------+--+
```



##### 11、数据倾斜

###### 1 合理设置Map数

- 1)  通常情况下，作业会通过input的目录产生一个或者多个map任务。

  ```
  主要的决定因素有：input的文件总个数，input的文件大小，集群设置的文件块大小。
  
  举例：
  a)  假设input目录下有1个文件a，大小为780M，那么hadoop会将该文件a分隔成7个块（6个128m的块和1个12m的块），从而产生7个map数。
  b) 假设input目录下有3个文件a，b，c大小分别为10m，20m，150m，那么hadoop会分隔成4个块（10m，20m，128m，22m），从而产生4个map数。即，如果文件大于块大小(128m)，那么会拆分，如果小于块大小，则把该文件当成一个块。
  ```

- 2） 是不是map数越多越好？

  ```
    答案是否定的。如果一个任务有很多小文件（远远小于块大小128m），则每个小文件也会被当做一个块，用一个map任务来完成，而一个map任务启动和初始化的时间远远大于逻辑处理的时间，就会造成很大的资源浪费。而且，同时可执行的map数是受限的。
  ```

- 3） 是不是保证每个map处理接近128m的文件块，就高枕无忧了？

  ```
  答案也是不一定。比如有一个127m的文件，正常会用一个map去完成，但这个文件只有一个或者两个小字段，却有几千万的记录，如果map处理的逻辑比较复杂，用一个map任务去做，肯定也比较耗时。
  
  针对上面的问题2和3，我们需要采取两种方式来解决：即减少map数和增加map数；
  
  ```



###### 2 小文件合并

- 在map执行前合并小文件，减少map数：

- CombineHiveInputFormat 具有对小文件进行合并的功能（系统默认的格式）

  ```sql
  set mapred.max.split.size=112345600;
  set mapred.min.split.size.per.node=112345600;
  set mapred.min.split.size.per.rack=112345600;
  set hive.input.format= org.apache.hadoop.hive.ql.io.CombineHiveInputFormat;
  ```

  这个参数表示执行前进行小文件合并，前面三个参数确定合并文件块的大小，大于文件块大小128m的，按照128m来分隔，小于128m，大于100m的，按照100m来分隔，把那些小于100m的（包括小文件和分隔大文件剩下的），进行合并。

###### 3 复杂文件增加Map数

- 当input的文件都很大，任务逻辑复杂，map执行非常慢的时候，可以考虑增加Map数，来使得每个map处理的数据量减少，从而提高任务的执行效率。

- 增加map的方法为

  - 根据 ==computeSliteSize(Math.max(minSize,Math.min(maxSize,blocksize)))==公式
  - ==调整maxSize最大值==。让maxSize最大值低于blocksize就可以增加map的个数。

  ```
  mapreduce.input.fileinputformat.split.minsize=1 默认值为1
  
  mapreduce.input.fileinputformat.split.maxsize=Long.MAXValue 默认值Long.MAXValue因此，默认情况下，切片大小=blocksize 
  
  maxsize（切片最大值): 参数如果调到比blocksize小，则会让切片变小，而且就等于配置的这个参数的值。
  
  minsize(切片最小值): 参数调的比blockSize大，则可以让切片变得比blocksize还大。
  
  ```

  - 例如

  ```sql
  --设置maxsize大小为10M，也就是说一个fileSplit的大小为10M
  set mapreduce.input.fileinputformat.split.maxsize=10485760;
  ```



###### 4 合理设置Reduce数

- 1、调整reduce个数方法一

  - 1）每个Reduce处理的数据量默认是256MB

    ```sql
    set hive.exec.reducers.bytes.per.reducer=256000000;
    ```

  - 2) 每个任务最大的reduce数，默认为1009

    ```sql
    set hive.exec.reducers.max=1009;
    ```

  - 3) 计算reducer数的公式

    ```sql
    N=min(参数2，总输入数据量/参数1)
    ```

- 2、调整reduce个数方法二

  ```sql
  --设置每一个job中reduce个数
  set mapreduce.job.reduces=3;
  ```



- 3、reduce个数并不是越多越好

  - 过多的启动和初始化reduce也会消耗时间和资源；

  - 同时过多的reduce会生成很多个文件，也有可能出现小文件问题





## hive的综合案例实战

### 案例需求

统计youtube影音视频网站的常规指标，各种TopN指标：

--统计视频观看数Top10

--统计视频类别热度Top10

--统计视频观看数Top20所属类别

--统计视频观看数Top50所关联视频的所属类别Rank

--统计每个类别中的视频热度Top10

--统计每个类别中视频流量Top10

--统计上传视频最多的用户Top10以及他们上传的视频

--统计每个类别视频观看数Top10

### 项目表字段

##### 1．视频表

```sql
#数据字段情况大致如下：
LKh7zAJ4nwo	TheReceptionist	653	Entertainment	424	13021	4.34	1305	744	DjdA-5oKYFQ	NxTDlnOuybo	c-8VuICzXtU	DH56yrIO5nI	W1Uo5DQTtzc	E-3zXq_r4w0	1TCeoRPg5dE	yAr26YhuYNY	2ZgXx72XmoE	-7ClGo-YgZ0	vmdPOOd6cxI	KRHfMQqSHpk	pIMpORZthYw	1tUDzOp10pk	heqocRij5P0	_XIuvoH6rUg	LGVU5DsezE0	uO2kj6_D8B4	xiDqywcDQRM	uX81lMev6_o

fQShwYqGqsw	lonelygirl15	736	People & Blogs	133	151763	3.01	666	765	fQShwYqGqsw	LfAaY1p_2Is	5LELNIVyMqo	vW6ZpqXjCE4	vPUAf43vc-Q	ZllfQZCc2_M	it2d7LaU_TA	KGRx8TgZEeU	aQWdqI1vd6o	kzwa8NBlUeo	X3ctuFCCF5k	Ble9N2kDiGc	R24FONE2CDs	IAY5q60CmYY	mUd0hcEnHiU	6OUcp6UJ2bA	dv0Y_uoHrLc	8YoxhsUMlgA	h59nXANN-oo	113yn3sv0eo
```

| 字段          | 备注       | 详细描述               |
| ------------- | ---------- | ---------------------- |
| video id      | 视频唯一id | 11位字符串             |
| uploader      | 视频上传者 | 上传视频的用户名String |
| age           | 视频年龄   | 视频在平台上的整数天   |
| category      | 视频类别   | 上传视频指定的视频分类 |
| length        | 视频长度   | 整形数字标识的视频长度 |
| views         | 观看次数   | 视频被浏览的次数       |
| rate          | 视频评分   | 满分5分                |
| ratings       | 流量       | 视频的流量，整型数字   |
| conments      | 评论数     | 一个视频的整数评论数   |
| related   ids | 相关视频id | 相关视频的id，最多20个 |

##### 2．用户表

```sql
#数据字段情况大致如下：
barelypolitical	151	5106
bonk65	89	144
camelcars	26	674
cubskickass34	13	126
boydism08	32	50
```

| 字段     | 备注         | 字段类型 |
| -------- | ------------ | -------- |
| uploader | 上传者用户名 | string   |
| videos   | 上传视频数   | int      |
| friends  | 朋友数量     | int      |



### ETL原始数据清洗

通过观察原始数据形式，可以发现：

- 视频可以有多个所属分类category,如People & Blogs，每个所属分类用&符号分割，且分割的两边有空格字符
- 同时相关视频也是可以有多个元素，多个相关视频又用“\t”进行分割。
- 为了分析数据时方便对存在多个子元素的数据进行操作，我们首先进行数据重组清洗操作。即：将所有的类别用“&”分割，同时去掉两边空格，多个相关视频id也使用“&”进行分割。
- 视频的原始数据里，一行应该有至少9个字段。三件事情

因为我们的数据清洗工作主要有以下三件事情：

- 长度不够9的删掉。（视频数据里，一行数据不够9个字段的证明改行数据损坏掉，要删掉）
- 视频类别删掉空格
- 相关视频的分割符用&

#### 第一步：创建Maven工程

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

        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>5.1.38</version>
            <scope>compile</scope>
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
                    <!--    <verbal>true</verbal>-->
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
            <!--  <plugin>
                  <artifactId>maven-assembly-plugin </artifactId>
                  <configuration>
                      <descriptorRefs>
                          <descriptorRef>jar-with-dependencies</descriptorRef>
                      </descriptorRefs>
                      <archive>
                          <manifest>
                              <mainClass></mainClass>
                          </manifest>
                      </archive>
                  </configuration>
                  <executions>
                      <execution>
                          <id>make-assembly</id>
                          <phase>package</phase>
                          <goals>
                              <goal>single</goal>
                          </goals>
                      </execution>
                  </executions>
              </plugin>-->
        </plugins>
    </build>
```

#### 第二部：代码开发：ETLUtil

```java
public class VideoUtil {
    /**
     * 对我们的数据进行清洗的工作，
     * 数据切割，如果长度小于9 直接丢掉
     * 视频类别中间空格 去掉
     * 关联视频，使用 &  进行分割
     * @param line
     * @return
     * FM1KUDE3C3k  renetto	736	News & Politics	1063	9062	4.57	525	488	LnMvSxl0o0A&IKMtzNuKQso&Bq8ubu7WHkY&Su0VTfwia1w&0SNRfquDfZs&C72NVoPsRGw
     */
    public  static String washDatas(String line){
        if(null == line || "".equals(line)) {
            return null;
        }
        //判断数据的长度，如果小于9，直接丢掉
        String[] split = line.split("\t");
        if(split.length <9){
            return null;
        }
        //将视频类别空格进行去掉
        split[3] =  split[3].replace(" ","");
        StringBuilder builder = new StringBuilder();
        for(int i =0;i<split.length;i++){
            if(i <9){
                //这里面是前面八个字段
                builder.append(split[i]).append("\t");
            }else if(i >=9  && i < split.length -1){
                builder.append(split[i]).append("&");
            }else if( i == split.length -1){
                builder.append(split[i]);
            }
        }
        return  builder.toString();
    }
}
```

#### 第三步：代码开发：ETLMapper

```java
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;
import java.io.IOException;

public class VideoMapper extends Mapper<LongWritable,Text,Text,NullWritable> {
    private Text  key2 ;
    @Override
    protected void setup(Context context) throws IOException, InterruptedException {
        key2 = new Text();
    }
    @Override
    protected void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException {
        String s = VideoUtils.washDatas(value.toString());
        if(null != s ){
            key2.set(s);
            context.write(key2,NullWritable.get());
        }
    }
}
```

#### 第四步：代码开发：ETLRunner

```java
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

public class VideoMain extends Configured implements Tool {
    @Override
    public int run(String[] args) throws Exception {
        Job job = Job.getInstance(super.getConf(), "washDatas");
        job.setJarByClass(VideoMain.class);
        job.setInputFormatClass(TextInputFormat.class);
        TextInputFormat.addInputPath(job,new Path(args[0]));

        job.setMapperClass(VideoMapper.class);
        job.setMapOutputKeyClass(Text.class);
        job.setMapOutputValueClass(NullWritable.class);
        job.setOutputFormatClass(TextOutputFormat.class);
        TextOutputFormat.setOutputPath(job,new Path(args[1]));
        //注意，我们这里没有自定义reducer，会使用默认的reducer类
        //设置reduceTask为7，从而生成7个文件，便于后面表的数据加载
        job.setNumReduceTasks(7);
        boolean b = job.waitForCompletion(true);
        return b?0:1;
    }
    public static void main(String[] args) throws Exception {
        int run = ToolRunner.run(new Configuration(), new VideoMain(), args);
        System.exit(run);
    }
}
```

#### 第五步：打包jar包到集群运行

```sh
#上传jar包到集群任意节点，这里以node03节点为例
[hadoop@node03 hivedatas]$ rz 
	original-MyHive-1.0-SNAPSHOT.jar
	
#上传视频数据到linux本地，再从本地到hdfs
[hadoop@node03 hivedatas]$ mkdir videoData
[hadoop@node03 hivedatas]$ cd videoData
[hadoop@node03 videoData]$ rz
	0.txt  1.txt  2.txt  3.txt  4.txt
hdfs dfs -put videoData /

#上传用户数据到linux本地，再从本地到hdfs
[hadoop@node03 hivedatas]$ mkdir userData;cd userData
[hadoop@node03 userData]$ rz
	user.txt
hdfs dfs -put userData /

#运行jar包
[hadoop@node03 hivedatas]$ hadoop jar original-MyHive-1.0-SNAPSHOT.jar com.jimmy.ETL.VideoMain /videoData/ /videoOut
```



### 项目建表并加载数据

##### 创建普通表

接下来我们要建立分桶表，因为分桶表不能够直接通过load方式加载数据，因此我们首先要建立两个对应的普通表来为接下来分桶表加载数据做准备。普通表使用textfile格式进行存储。

####### youtubevideo_ori

```sql
set hive.enforce.bucketing=true;
set mapreduce.job.reduces=-1;

create database youtube;
use youtube;
create table youtubevideo_ori(
    videoId string, 
    uploader string, 
    age int, 
    category array<string>, 
    length int, 
    views int, 
    rate float, 
    ratings int, 
    comments int,
    relatedId array<string>)
row format delimited fields terminated by "\t"
collection items terminated by "&"
stored as textfile;
```

####### youtubevideo_user_ori

```sql
create table youtubevideo_user_ori(
    uploader string,
    videos int,
    friends int)
row format delimited fields terminated by "\t" 
stored as textfile;
```

##### 创建分桶表

####### youtubevideo_orc

```sql
create table youtubevideo_orc(
    videoId string, 
    uploader string, 
    age int, 
    category array<string>, 
    length int, 
    views int, 
    rate float, 
    ratings int, 
    comments int,
    relatedId array<string>)
clustered by (uploader) into 8 buckets 
row format delimited fields terminated by "\t" 
collection items terminated by "&" 
stored as orc;
```

####### youtubevideo_user_orc

```sql
create table youtubevideo_user_orc(
    uploader string,
    videos int,
    friends int)
clustered by (uploader) into 24 buckets 
row format delimited 
fields terminated by "\t" 
stored as orc;
```

#### 2、导入ETL之后的数据

youtubevideo_ori

```sql
load data inpath "/videoOut" into table youtubevideo_ori;
```

youtubevideo_user_ori：

```sql
load data inpath "/userData" into table youtubevideo_user_ori;
```

#### 3、向ORC表插入数据

youtubevideo_orc：

```sql
insert overwrite table youtubevideo_orc select * from youtubevideo_ori;
```

youtubevideo_user_orc：

```sql
insert into table youtubevideo_user_orc select * from youtubevideo_user_ori;
```

#### 4、查看表结构

```sql
0: jdbc:hive2://node03:10000> desc youtubevideo_orc;
+------------+----------------+----------+--+
|  col_name  |   data_type    | comment  |
+------------+----------------+----------+--+
| videoid    | string         |          |
| uploader   | string         |          |
| age        | int            |          |
| category   | array<string>  |          |
| length     | int            |          |
| views      | int            |          |
| rate       | float          |          |
| ratings    | int            |          |
| comments   | int            |          |
| relatedid  | array<string>  |          |
+------------+----------------+----------+--+
10 rows selected (0.084 seconds)
0: jdbc:hive2://node03:10000> desc youtubevideo_user_orc ;
+-----------+------------+----------+--+
| col_name  | data_type  | comment  |
+-----------+------------+----------+--+
| uploader  | string     |          |
| videos    | int        |          |
| friends   | int        |          |
+-----------+------------+----------+--+
```



### 业务分析

#### 1、统计视频观看数Top10的视频

思路：使用order by按照views字段做一个全局排序即可，同时我们设置只显示前10条。

```sql
select videoid,views
from youtubevideo_orc
order by views desc
limit 10;
+--------------+-----------+--+
|   videoid    |   views   |
+--------------+-----------+--+
| dMH0bHeiRNg  | 42513417  |
| 0XxI-hvPRRA  | 20282464  |
| 1dmVU08zVpA  | 16087899  |
| RB-wUgnyGv0  | 15712924  |
| QjA5faZF1A8  | 15256922  |
| -_CSo1gOd48  | 13199833  |
| 49IDp76kjPw  | 11970018  |
| tYnn51C3X_w  | 11823701  |
| pv5zWaTEVkI  | 11672017  |
| D2kJZOfq7zk  | 11184051  |
+--------------+-----------+--+
```

#### 2、统计视频类别热度Top10的类别

思路：

1) 即统计每个类别有多少个视频，显示出包含视频最多的前10个类别。

2) 我们需要按照类别group by聚合，然后count组内的videoId个数即可。

3) 因为当前表结构为：一个视频对应一个或多个类别。所以如果要group by类别，需要先将类别进行列转行(展开)，然后再进行count即可。

4) 最后按照热度排序，显示前10条。

```sql
select t1.category_col as category,count(t1.videoid) as hot
from
(select videoid,category_col
from youtubevideo_orc lateral view explode(category) t_cate as category_col) t1
group by t1.category_col
order by hot desc
limit 10;
+----------------+---------+--+
|    category    |   hot   |
+----------------+---------+--+
| Music          | 179049  |
| Entertainment  | 127674  |
| Comedy         | 87818   |
| Animation      | 73293   |
| Film           | 73293   |
| Sports         | 67329   |
| Gadgets        | 59817   |
| Games          | 59817   |
| Blogs          | 48890   |
| People         | 48890   |
+----------------+---------+--+
```

#### 3、统计出观看数最高的20个视频的所属类别以及类别包含Top20视频的个数

思路：

1) 先找到观看数最高的20个视频所属条目的所有信息，降序排列

2) 把这20条信息中的category分裂出来(列转行)

3) 最后查询视频分类名称和该分类下有多少个Top20的视频

####### 视频观看数最高的20个视频的所属类别

```sql
select videoid,views,category
from youtubevideo_orc
order by views desc
limit 20;
+--------------+-----------+---------------------+--+
|   videoid    |   views   |      category       |
+--------------+-----------+---------------------+--+
| dMH0bHeiRNg  | 42513417  | ["Comedy"]          |
| 0XxI-hvPRRA  | 20282464  | ["Comedy"]          |
| 1dmVU08zVpA  | 16087899  | ["Entertainment"]   |
| RB-wUgnyGv0  | 15712924  | ["Entertainment"]   |
| QjA5faZF1A8  | 15256922  | ["Music"]           |
| -_CSo1gOd48  | 13199833  | ["People","Blogs"]  |
| 49IDp76kjPw  | 11970018  | ["Comedy"]          |
| tYnn51C3X_w  | 11823701  | ["Music"]           |
| pv5zWaTEVkI  | 11672017  | ["Music"]           |
| D2kJZOfq7zk  | 11184051  | ["People","Blogs"]  |
| vr3x_RRJdd4  | 10786529  | ["Entertainment"]   |
| lsO6D1rwrKc  | 10334975  | ["Entertainment"]   |
| 5P6UU6m3cqk  | 10107491  | ["Comedy"]          |
| 8bbTtPL1jRs  | 9579911   | ["Music"]           |
| _BuRwH59oAo  | 9566609   | ["Comedy"]          |
| aRNzWyD7C9o  | 8825788   | ["UNA"]             |
| UMf40daefsI  | 7533070   | ["Music"]           |
| ixsZy2425eY  | 7456875   | ["Entertainment"]   |
| MNxwAU_xAMk  | 7066676   | ["Comedy"]          |
| RUCZJVJ_M8o  | 6952767   | ["Entertainment"]   |
+--------------+-----------+---------------------+--+
```

####### 视频观看数最高的20个视频的所属类别包含Top20视频的个数

```sql
select t2.category_col as category,count(t2.videoid) as hot_videos
from
(select videoid,category_col
from
(select videoid,views,category
from youtubevideo_orc
order by views desc
limit 20) t1 
lateral view explode(category) t_category as category_col) t2
group by t2.category_col
order by hot_videos desc;
+----------------+-------------+--+
|    category    | hot_videos  |
+----------------+-------------+--+
| Entertainment  | 6           |
| Comedy         | 6           |
| Music          | 5           |
| People         | 2           |
| Blogs          | 2           |
| UNA            | 1           |
+----------------+-------------+--+
```



#### 4、 统计观看数Top50的视频所关联的视频的所属类别Rank

```sql
#分析思路

#第一步，获取观看数前50的视频，select一定要有views，因为是根据views来排序的
select videoid,relatedid,views  
from youtubevideo_orc
order by views desc
limit 50

#第二步，获取每一个视频的关联视频
select explode(t1.relatedid) as videoid
from
(select videoid,relatedid,views  
from youtubevideo_orc
order by views desc
limit 50) t1


#第三步，对视频去重，再获取每一个视频的所属类型
select distinct(t2.videoid),t3.category
from
(select explode(t1.relatedid) as videoid
from
(select videoid,relatedid,views  
from youtubevideo_orc
order by views desc
limit 50) t1) t2 inner join youtubevideo_orc t3 on t3.videoid=t2.videoid

#第四步，展开视频所属类型
select videoid,category_col as category
from
(select distinct(t2.videoid),t3.category
from
(select explode(t1.relatedid) as videoid
from
(select videoid,relatedid,views  
from youtubevideo_orc
order by views desc
limit 50) t1) t2 inner join youtubevideo_orc t3 on t3.videoid=t2.videoid
) t4 lateral view explode(category)t_category as category_col
 
 
#第五步，进行分组，计数，排序
select count(t5.videoid) as hot,category
from
(select videoid,category_col as category
from
(select distinct(t2.videoid),t3.category
from
(select explode(t1.relatedid) as videoid
from
(select videoid,relatedid,views  
from youtubevideo_orc
order by views desc
limit 50) t1) t2 inner join youtubevideo_orc t3 on t3.videoid=t2.videoid
) t4 lateral view explode(category)t_category as category_col
) t5
group by category
order by hot desc;
+------+----------------+--+
| hot  |    category    |
+------+----------------+--+
| 232  | Comedy         |
| 216  | Entertainment  |
| 195  | Music          |
| 51   | Blogs          |
| 51   | People         |
| 47   | Film           |
| 47   | Animation      |
| 22   | News           |
| 22   | Politics       |
| 20   | Games          |
| 20   | Gadgets        |
| 19   | Sports         |
| 14   | Howto          |
| 14   | DIY            |
| 13   | UNA            |
| 12   | Places         |
| 12   | Travel         |
| 11   | Animals        |
| 11   | Pets           |
| 4    | Autos          |
| 4    | Vehicles       |
+------+----------------+--+
```



#### 5、统计每个类别中的视频热度Top10，以Music为例

###### 第一种做法：直接查询

```sql
select t1.category,t1.videoid,t1.views
from
(select videoid, category_col as category,views
from youtubevideo_orc lateral view explode (category) t_category as category_col
) t1 where t1.category="Music" 
order by views desc
limit 10;
+--------------+--------------+-----------+--+
| t1.category  |  t1.videoid  | t1.views  |
+--------------+--------------+-----------+--+
| Music        | QjA5faZF1A8  | 15256922  |
| Music        | tYnn51C3X_w  | 11823701  |
| Music        | pv5zWaTEVkI  | 11672017  |
| Music        | 8bbTtPL1jRs  | 9579911   |
| Music        | UMf40daefsI  | 7533070   |
| Music        | -xEzGIuY7kw  | 6946033   |
| Music        | d6C0bNDqf3Y  | 6935578   |
| Music        | HSoVKUVOnfQ  | 6193057   |
| Music        | 3URfWTEPmtE  | 5581171   |
| Music        | thtmaZnxk_0  | 5142238   |
+--------------+--------------+-----------+--+
```

###### 第二种做法：创建表

1) 要想统计Music类别中的视频热度Top10，需要先找到Music类别，那么就需要将category展开，所以可以创建一张表用于存放categoryId展开的数据。

2) 向category展开的表中插入数据。

3) 统计对应类别（Music）中的视频热度。

创建表类别表：

```sql
create table youtubevideo_category(
    videoId string, 
    uploader string, 
    age int, 
    categoryId string, 
    length int, 
    views int, 
    rate float, 
    ratings int, 
    comments int, 
    relatedId array<string>)
row format delimited 
fields terminated by "\t" 
collection items terminated by "&" 
stored as orc;
```

向类别表中插入数据：

```sql
insert into table youtubevideo_category  
    select 
        videoId,
        uploader,
        age,
        categoryId,
        length,
        views,
        rate,
        ratings,
        comments,
        relatedId 
    from 
        youtubevideo_orc lateral view explode(category) catetory as categoryId;

```

统计Music类别的Top10（也可以统计其他）

```sql
select 
    videoId, 
    views
from 
    youtubevideo_category 
where 
    categoryId = "Music" 
order by 
    views 
desc limit
    10;

```



#### 6、 统计每个类别中视频流量Top10，以Music为例

最终代码：

```sql
select t1.category,t1.videoid,t1.ratings
from
(select videoid, category_col as category,ratings
from youtubevideo_orc lateral view explode (category) t_category as category_col
) t1 where t1.category="Music" 
order by ratings desc
limit 10;
+--------------+--------------+-------------+--+
| t1.category  |  t1.videoid  | t1.ratings  |
+--------------+--------------+-------------+--+
| Music        | QjA5faZF1A8  | 120506      |
| Music        | pv5zWaTEVkI  | 42386       |
| Music        | UMf40daefsI  | 31886       |
| Music        | tYnn51C3X_w  | 29479       |
| Music        | 59ZX5qdIEB0  | 21481       |
| Music        | FLn45-7Pn2Y  | 21249       |
| Music        | -xEzGIuY7kw  | 20828       |
| Music        | HSoVKUVOnfQ  | 19803       |
| Music        | ARHyRI9_NB4  | 19243       |
| Music        | gg5_mlQOsUQ  | 19190       |
+--------------+--------------+-------------+--+
```

#### 7、 统计上传视频最多的用户Top10以及他们上传的观看次数在前20的视频

```sql
#第一步，找到上传视频最多的用户Top10
select uploader,videos
from youtubevideo_user_orc
order by videos desc
limit 10

#第二步，找到Top10用户上传的视频，并按照views排序、截取
select t2.videoid,t2.views,t2.ratings,t1.uploader,t1.videos
from
(select uploader,videos
from youtubevideo_user_orc
order by videos desc
limit 10) t1 join youtubevideo_orc t2 on t2.uploader=t1.uploader
order by views desc
limit 20;
```

#### 8、统计每个类别视频观看数Top10



```sql
select category_col,videoid,views,rankcol 
from
(select videoid,views,category_col,
rank() over(partition by category_col order by views desc) as rankcol
from youtubevideo_orc lateral view explode(category)t_category as category_col
) t1 where rankcol<=10;

+----------------+--------------+-----------+----------+--+
|  category_col  |   videoid    |   views   | rankcol  |
+----------------+--------------+-----------+----------+--+
| Animals        | 2GWPOPSXGYI  | 3660009   | 1        |
| Animals        | xmsV9R8FsDA  | 3164582   | 2        |
| Animals        | 12PsUW-8ge4  | 3133523   | 3        |
| Animals        | OeNggIGSKH8  | 2457750   | 4        |
| Animals        | WofFb_eOxxA  | 2075728   | 5        |
| Animals        | AgEmZ39EtFk  | 1999469   | 6        |
| Animals        | a-gW3RbJd8U  | 1836870   | 7        |
| Animals        | 8CL2hetqpfg  | 1646808   | 8        |
| Animals        | QmroaYVD_so  | 1645984   | 9        |
| Animals        | Sg9x5mUjbH8  | 1527238   | 10       |
| Animation      | sdUUx5FdySs  | 5840839   | 1        |
| Animation      | 6B26asyGKDo  | 5147533   | 2        |
| Animation      | H20dhY01Xjk  | 3772116   | 3        |
| Animation      | 55YYaJIrmzo  | 3356163   | 4        |
| Animation      | JzqumbhfxRo  | 3230774   | 5        |
| Animation      | eAhfZUZiwSE  | 3114215   | 6        |
| Animation      | h7svw0m-wO0  | 2866490   | 7        |
| Animation      | tAq3hWBlalU  | 2830024   | 8        |
| Animation      | AJzU3NjDikY  | 2569611   | 9        |
| Animation      | ElrldD02if0  | 2337238   | 10       |
| Autos          | RjrEQaG5jPM  | 2803140   | 1        |
| Autos          | cv157ZIInUk  | 2773979   | 2        |
| Autos          | Gyg9U1YaVk8  | 1832224   | 3        |
| Autos          | 6GNB7xT3rNE  | 1412497   | 4        |
| Autos          | tth9krDtxII  | 1347317   | 5        |
| Autos          | 46LQd9dXFRU  | 1262173   | 6        |
| Autos          | pdiuDXwgrjQ  | 1013697   | 7        |
| Autos          | kY_cDpENQLE  | 956665    | 8        |
| Autos          | YtxfbxGz1u4  | 942604    | 9        |
| Autos          | aCamHfJwSGU  | 847442    | 10       |
| Blogs          | -_CSo1gOd48  | 13199833  | 1        |
| Blogs          | D2kJZOfq7zk  | 11184051  | 2        |
| Blogs          | pa_7P5AbUww  | 5705136   | 3        |
| Blogs          | f4B-r8KJhlE  | 4937616   | 4        |
| Blogs          | LB84A3zcmVo  | 4866739   | 5        |
| Blogs          | tXNquTYnyg0  | 3613323   | 6        |
| Blogs          | EYppbbbSxjc  | 2896562   | 7        |
| Blogs          | LH7vrLlDZ6U  | 2615359   | 8        |
| Blogs          | bTV85fQhj0E  | 2192656   | 9        |
| Blogs          | eVFF98kNg8Q  | 1813803   | 10       |
| Comedy         | dMH0bHeiRNg  | 42513417  | 1        |
| Comedy         | 0XxI-hvPRRA  | 20282464  | 2        |
| Comedy         | 49IDp76kjPw  | 11970018  | 3        |
| Comedy         | 5P6UU6m3cqk  | 10107491  | 4        |
| Comedy         | _BuRwH59oAo  | 9566609   | 5        |
| Comedy         | MNxwAU_xAMk  | 7066676   | 6        |
| Comedy         | pYak2F1hUYA  | 6322117   | 7        |
| Comedy         | h0zAlXr1UOs  | 5826923   | 8        |
| Comedy         | C8rjr4jmWd0  | 5587299   | 9        |
| omedy         | R4cQ3BoHFas  | 5508079   | 10       |
.....
```







