## impala课前准备

安装好hive以及hadoop运行环境，并正常启动hadoop以及hive的

## 离线任务处理流程概述

离线任务的大致流程：数据采集-->HDFS存储-->ETL清洗数据-->构建数据仓库-->web界面数据展示。离线处理大致示意图如下：

![离线任务处理流程](impala.assets/离线任务处理流程.png)

前面我们学习了一些离线处理的框架：

- flume-->日志数据的采集
- sqoop-->数据导入导出工具
- mapreduce-->数据清洗工作
- hive-->数据仓库的构建
- azkaban-->实现定时任务
- echarts/highcharts-->数据报表展示（还没学）

hive是一个数据仓库工具，底层的执行引擎是mapreduce，查询速度比较慢，是较早的一个sql on hadoop的工具。

现在，我们要学习另一个sql on hadoop的工具，叫做impala，impala可以完全替代hive，而且速度很快。

## imala基本介绍

impala是cloudera提供的一款高效率的sql查询工具，提供实时的查询效果，官方测试性能比hive快10到100倍，其sql查询比sparkSQL还要更加快速，号称是当前大数据领域最快的查询sql工具，impala是参照谷歌的新三篇论文（Caffeine、Pregel、Dremel）当中的Dremel实现而来，其中旧三篇论文分别是（BigTable，GFS，MapReduce）分别对应HBase、HDFS以及MapReduce

impala是基于hive并使用**内存**进行计算，兼顾数据仓库，具有实时，批处理，多并发等优点

## impala与hive的关系

impala是基于hive的大数据分析查询引擎，直接使用hive的元数据库metadata，意味着impala元数据都存储在hive的metastore当中，并且impala兼容hive的绝大多数sql语法。所以需要安装impala的话，必须先安装hive，保证hive安装成功，并且还需要启动hive的metastore服务。

Hive的元数据信息存储在mysql表上，impala要访问hive的元数据库metadata，不是直接访问mysql表的，而是先通过hive，再访问mysql表的。（前提是开启了Hive的对外元数据访问服务——metastore）

<img src="impala.assets/image-20200330145129427.png" alt="image-20200330145129427" style="zoom: 80%;" />

## impala的优点/缺点

优点：

1. impala比较快，非常快，特别快，因为所有的计算都可以放入内存当中进行完成，只要你内存足够大

2. 摈弃了MR的计算，改用C++来实现，有针对性的硬件优化

3. 具有数据仓库的特性，对hive的原有数据做数据分析

4. 支持ODBC，jdbc远程访问

缺点：

1. 基于内存计算，对内存依赖性较大

2. 改用C++编写，意味着维护难度增大

3. 基于hive，与hive共存亡，紧耦合

4. 稳定性不如hive，不存在数据丢失的情况


## impala的架构

impala是一个主从架构，架构模块如下：

- impala-statestore：主节点，状态存储区，sql语句执行的状态都在这里看

- impalas-catalog：主节点，元数据管理区
- impala-server(impalad)：从节点，启动的守护进程，执行我们的sql查询计划，官方建议impalad与所有的datanode装在一起，可以通过hadoop的短路读取特性实现数据的快速查询

![img](impala.assets/clip_image002.png)



## impala的执行计划

**查询执行**

impalad分为frontend和backend两个层次， frondend用java实现（通过JNI嵌入impalad），负责查询计划生成， 而backend用C++实现， 负责查询执行。

frontend生成查询计划分为两个阶段：

（1）生成单机查询计划，单机执行计划与关系数据库执行计划相同，所用查询优化方法也类似。

（2）生成分布式查询计划。 根据单机执行计划， 生成真正可执行的分布式执行计划，降低数据移动， 尽量把数据和计算放在一起。

![http://www.aboutyun.com/data/attachment/forum/201507/27/134940kb7luw6ix8in3w3s.png](impala.assets/clip_image004.jpg)

上图是SQL查询例子， 该SQL的目标是在三表join的基础上算聚集， 并按照聚集列排序取topN。

impala的查询优化器支持代价模型： 利用表和分区的cardinality，每列的distinct值个数等统计数据， impala可估算执行计划代价， 并生成较优的执行计划。 上图左边是frontend查询优化器生成的单机查询计划， 与传统关系数据库不同， 单机查询计划不能直接执行， 必须转换成如图右半部分所示的分布式查询计划。 该分布式查询计划共分成6个segment（图中彩色无边框圆角矩形）， 每个segment是可以被单台服务器独立执行的计划子树。

## impala/SPARK/hive对比

|      | HIVE                                       | SPARK                                                        | Impala                                                       |
| ---- | ------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 概要 | Hive是老牌的SQL-on-hadoop解决方案          | spark上的交互式SQL解决方案提供DataFrame API做为SQL补充，方便实现ETL、分析、机器学习等复杂逻辑。 | hadoop上交互式的MPP SQL引擎                                  |
| 容错 | 强，中间结果落盘，容错能力强，最细粒度容错 | 较强，基于数据血缘关系的数据恢复                             | 弱，遇到问题时，需要重做查询                                 |
| 性能 | 慢，MR启动慢，中间结果落盘                 | 较快，基于RDD模型，DAG执行基于代价的查询优化内存基于列存储编译执行（生成Java字节码）Java实现 | 快，MPP架构基于代价的查询优化，JOIN优化LLVM查询，编译C++实现向量执行引擎，可使用SSE指令列存IO本地化资源管理器优化（LLAM） |

 注释：落盘——写到磁盘中？

## impala的安装（TODO）

#### 安装方式的选择

由于大部分的软件框架，CDH都提供了压缩包的安装方式，但是由于impala有部分代码使用C++编写，所以impala在安装包的选择上面，cloudera公司没有提供tar包的安装方式，只提供了rpm的安装方式，我们可以通过下载rpm包来进行安装。注意：rpm包是linux操作系统上面的一种安装压缩包

由于impala没有提供tar包供我们进行安装，只提供了rpm包，所以我们在安装impala的时候，需要使用rpm包来进行安装，rpm包只有cloudera公司提供了，所以我们去cloudera公司网站进行下载rpm包即可，但是另外一个问题，impala的rpm包依赖非常多的其他的rpm包，可以一个个的将依赖找出来，也可以将所有的rpm包下载下来，制作成我们本地yum源来进行安装。我们选择这个方式安装impala。

#### 拓展：yum命令的实质

当执行一个命令：yum install xxx时，首先会去配置文件里查找rmp仓库的地址，然后通过某种网络协议去对应的rmp仓下载rpm包。因此，要制作自己的本地yum源来安装东西，我们只需执行以下3步：

1. 制作rpm本地仓库
2. 写一个配置文件，指定rpm本地仓库的地址
3. 安装httpd服务：yum -y install httpd

![image-20200331002442077](impala.assets/image-20200331002442077.png)

#### 制作自己的本地yum源

###### 制作rpm本地仓库

下载所有的rpm包，下载地址：http://archive.cloudera.com/cdh5/repo-as-tarball/5.14.2/cdh5.14.2-centos7.tar.gz

<img src="impala.assets/image-20200330161714919.png" alt="image-20200330161714919" style="zoom: 67%;" />

将我们下载好的压缩包cdh5.14.2-centos7.tar.gz，上传到node03服务器的/kkb/soft路径下，并进行解压：

```sh
cd /kkb/soft
rz #文件大于4G，可能要使用security Fx上传
[hadoop@node03 soft]$ tar -zxvf cdh5.14.2-centos7.tar.gz
```

###### 安装并启动httpd服务

```sh
[hadoop@node03 ~]$ sudo yum  -y install httpd
[hadoop@node03 ~]$ sudo systemctl start httpd.service

#验证是否启动httpd了:
[hadoop@node03 soft]$ ps -ef|grep httpd
root      49419      1  0 00:37 ?        00:00:00 /usr/sbin/httpd -DFOREGROUND
apache    49420  49419  0 00:37 ?        00:00:00 /usr/sbin/httpd -DFOREGROUND
apache    49421  49419  0 00:37 ?        00:00:00 /usr/sbin/httpd -DFOREGROUND
apache    49422  49419  0 00:37 ?        00:00:00 /usr/sbin/httpd -DFOREGROUND
apache    49423  49419  0 00:37 ?        00:00:00 /usr/sbin/httpd -DFOREGROUND
apache    49424  49419  0 00:37 ?        00:00:00 /usr/sbin/httpd -DFOREGROUND
hadoop    49427  49040  0 00:37 pts/0    00:00:00 grep --color=auto httpd
```

###### 创建yum配置文件

镜像源是centos当中下载相关软件的地址，选用第三台机器作为镜像源的服务端，node03机器上执行以下命令：

```sh
cd /etc/yum.repos.d
sudo vim localimp.repo 

[localimp]
name=localimp
baseurl=http://node03/cdh5.14.2/
gpgcheck=0
enabled=1
```

###### 创建apache httpd的读取链接

启动httpd服务后，在/var/www/html/上的文件都可以通过http访问到，因此我们要在/var/www/html/路径下，创建本地rpm仓库的软链接。

```
sudo ln -s /kkb/soft/cdh/5.14.2 /var/www/html/cdh5.14.2
```

###### web页面访问本地yum源

访问地址：http://node03/cdh5.14.2，出现下面这个界面表示本地yum源制作成功

<img src="impala.assets/image-20200331005620914.png" alt="image-20200331005620914" style="zoom:67%;" />

###### 分发配置文件

将node03制作好的localimp配置文件发放到所有需要安装impala的节点上去

```sh
cd /etc/yum.repos.d/
[hadoop@node03 yum.repos.d]$ sudo scp localimp.repo  node02:/etc/yum.repos.d/
[hadoop@node03 yum.repos.d]$ sudo scp localimp.repo  node01:/etc/yum.repos.d/
```



#### 开始安装impala

安装规划如下，以node03作为主节点，node02/node01作为从节点。

| 服务名称           | node01 | node02 | node03 |
| ------------------ | ------ | ------ | ------ |
| impala-catalog     | ×      | ×      | 安装   |
| impala-state-store | ×      | ×      | 安装   |
| impala-server      | 安装   | 安装   | 安装   |

```sh
#主节点node03执行以下命令进行安装
sudo yum  install  impala -y
sudo yum install impala-server -y
sudo yum install impala-state-store  -y
sudo yum install impala-catalog  -y
sudo yum  install  impala-shell -y

#从节点node01与node02安装以下服务
sudo yum install impala-server -y
```

补充：

在这一步时，遇到过一个错误：http://node03/cdh5.14.2/repodata/repomd.xml: [Errno 14] HTTP Error 404 - Not Found，是因为我们制作本地rpm仓库的时候，解压出来的文件没有包含repodata文件夹，也不知道怎么没有的，但是重新rz将缺失的repodata文件夹上传就可以解决了。

<img src="impala.assets/image-20200331015723512.png" alt="image-20200331015723512" style="zoom:67%;" />

#### node03修改hive-site.xml

node03机器修改hive-site.xml内容如下

hive-site.xml配置

```xml
vim /kkb/install/hive-1.1.0-cdh5.14.2/conf/hive-site.xml
添加以下三个配置属性

<property>
	<name>hive.server2.thrift.bind.host</name>
 	<value>node03</value>
</property>
 <property>
     <name>hive.metastore.uris</name>
     <value>thrift://node03:9083</value>
 </property>
<property>
    <name>hive.metastore.client.socket.timeout</name>
    <value>3600</value>
 </property>
```

注意：hive.server2.thrift.bind.host可能本来就存在，可以不用添加。

#### 拷贝hive安装包

之前只是在node03安装了hive，需要将hive的安装包，拷贝到所有的服务器上面都保存一份，因为impala需要引用hive的安装目录下面的一些依赖的jar包。

```sh
cd /kkb/install/
[hadoop@node03 install]$ scp -r hive-1.1.0-cdh5.14.2/ node02:/kkb/install/
[hadoop@node03 install]$ scp -r hive-1.1.0-cdh5.14.2/ node01:/kkb/install/
```

#### node01/02/03修改hdfs-site.xml（疑点）

所有的节点创建目录：

```sh
sudo mkdir -p /var/run/hdfs-sockets
sudo chown -R  hadoop:hadoop   /var/run/hdfs-sockets/
```

修改所有节点的hdfs-site.xml添加以下配置，修改完之后重启hdfs集群生效

```xml
vim  /kkb/install/hadoop-2.6.0-cdh5.14.2/etc/hadoop/hdfs-site.xml

<property>
    <name>dfs.client.read.shortcircuit</name>
    <value>true</value>
</property>

<property>
     <name>dfs.domain.socket.path</name>
     <value>/var/run/hdfs-sockets/dn</value>
</property>

<property>
    <name>dfs.client.file-block-storage-locations.timeout.millis</name>
    <value>10000</value>
</property>
<property>
     <name>dfs.datanode.hdfs-blocks-metadata.enabled</name>
     <value>true</value>
</property>
```

#### 重启hdfs

重启hdfs文件系统，node01服务器上面执行以下命令：

```sh
cd /kkb/install/hadoop-2.6.0-cdh5.14.2/

sbin/stop-dfs.sh
sbin/start-dfs.sh
```

#### 创建hadoop与hive的配置文件的连接

所有节点，在impala的配置目录/etc/impala/conf创建core-site.xml，hdfs-site.xml以及hive-site.xml配置文件的软链接：

```sh
sudo ln -s /kkb/install/hadoop-2.6.0-cdh5.14.2/etc/hadoop/core-site.xml /etc/impala/conf/core-site.xml

sudo ln -s /kkb/install/hadoop-2.6.0-cdh5.14.2/etc/hadoop/hdfs-site.xml /etc/impala/conf/hdfs-site.xml

sudo ln -s /kkb/install/hive-1.1.0-cdh5.14.2/conf/hive-site.xml /etc/impala/conf/hive-site.xml 
```

#### 修改impala的配置文件

所有节点：更改impala默认配置文件以及添加mysql的连接驱动包

```sh
sudo vim /etc/default/impala

IMPALA_CATALOG_SERVICE_HOST=node03
IMPALA_STATE_STORE_HOST=node03

## 所有节点创建mysql的驱动包的软连接
sudo mkdir -p /usr/share/java
sudo ln -s /kkb/install/hive-1.1.0-cdh5.14.2/lib/mysql-connector-java-5.1.38.jar /usr/share/java/mysql-connector-java.jar
```

#### 修改bigtop的java路径

所有节点：修改bigtop的java_home路径

```sh
sudo vim /etc/default/bigtop-utils

export JAVA_HOME=/kkb/install/jdk1.8.0_141
```

## 启动impala服务

启动node03的hive的metastore服务：

```sh
cd  /kkb/install/hive-1.1.0-cdh5.14.2

[hadoop@node03 ~]$ nohup hive --service metastore &
[hadoop@node03 ~]$ nohup hive --service hiveserver2 &
```

注意：一定要保证mysql的服务正常启动，否则metastore的服务不能够启动,查看mysql是否开启的方式如下：

```ruby
/bin/systemctl status mysqld.service
```

主节点node03启动以下三个服务进程

```sh
sudo service impala-state-store start
sudo service impala-catalog start
sudo service impala-server start

#关闭方式如下：
sudo service impala-state-store stop
sudo service impala-catalog stop
sudo service impala-server stop
```

从节点启动node01与node02启动impala-server

```sh
sudo service  impala-server  start
```

三台机器可以通过以下命令，查看impala进程是否存在

```sh
ps -ef | grep impala
```

 注意：启动之后所有关于impala的日志默认都在/var/log/impala 这个路径下，node03机器上面应该有三个进程，node02与node01机器上面只有一个进程，如果进程个数不对，去对应目录下查看报错日志

## 浏览器页面访问

访问impalad的管理界面

http://node03:25000/

访问statestored的管理界面

http://node03:25010/

访问catalog的管理界面

http://node03:25020



## impala-shell的外部命令

impala-shell外部命令是指不需要进入到impala-shell中即可执行的命令。

#### -h  查看帮助文档

impala-shell外部命令的常用option是:

- -q:不进入impala-shell客户端，直接执行sql语句
- -f:执行sql脚本文件
- -r:刷新元数据

```sh
[hadoop@node03 ~]$ impala-shell -h
Options:
  -h, --help            show this help message and exit
  -q QUERY, --query=QUERY
                        Execute a query without the shell [default: none]
  -f QUERY_FILE, --query_file=QUERY_FILE
                        Execute the queries in the query file, delimited by ;.
                        If the argument to -f is "-", then queries are read
                        from stdin and terminated with ctrl-d. [default: none]
  -r, --refresh_after_connect
                        Refresh Impala catalog after connecting
                        [default: False]
```

#### -r  刷新整个元数据

数据量大的时候，比较消耗服务器性能

```sh
impala-shell -r
```

#### -v  查看对应版本

查看impala-shell的版本

```sh
[hadoop@node03 ~]$ impala-shell -v
Impala Shell v2.11.0-cdh5.14.2 (ed85dce) built on Tue Mar 27 13:39:48 PDT 2018
```

#### -f  执行sql脚本

```sh
cd /kkb/install
vim impala-shell.sql

select * from course.score;


#通过-f 参数来执行执行的查询文件
impala-shell -f impala-shell.sql
```

#### -p  显示查询计划

```sh
impala-shell -f impala-shell.sql -p
```

#### 9.1.2、impala-shell的内部命令行参数语法

进入impala-shell命令行之后可以执行的语法

##### help命令

帮助文档

##### connect命令

connect  hostname 连接到某一台机器上面去执行

##### refresh 命令

refresh dbname.tablename  增量刷新，刷新某一张表的元数据，主要用于刷新hive当中数据表里面的数据改变的情况

```
refresh course.score;
```

##### invalidate  metadata 命令：

```
invalidate  metadata
全量刷新，性能消耗较大，主要用于hive当中新建数据库或者数据库表的时候来进行刷新
```

 

##### explain 命令：

用于查看sql语句的执行计划

```
explain select * from course.score;

explain的值可以设置成0,1,2,3等几个值，其中3级别是最高的，可以打印出最全的信息

set explain_level=3;
```



##### profile命令：

执行sql语句之后执行，可以打印出更加详细的执行步骤，

主要用于查询结果的查看，集群的调优等

```
select * from course.score;

profile;
```

注意:在hive窗口当中插入的数据或者新建的数据库或者数据库表，在impala当中是不可直接查询到的，需要刷新数据库，在impala-shell当中插入的数据，在impala当中是可以直接查询到的，不需要刷新数据库，其中使用的就是catalog这个服务的功能实现的，catalog是impala1.2版本之后增加的模块功能，主要作用就是同步impala之间的元数据

### 2、创建数据库

impala-shell进入到impala的交互窗口

#### 2.1、查看所有数据库

show databases;

#### 2.2、创建与删除数据库

创建数据库

```
CREATE DATABASE IF NOT EXISTS mydb1;
drop database  if exists  mydb;
```

创建数据库表并指定数据库表数据存放hdfs的位置（与hive建表语法类似）

```
hdfs dfs -mkdir -p /input/impala

create  external table  t3(id int ,name string ,age int )  row  format  delimited fields terminated  by  '\t' location  '/input/impala/external';
```



### 3、 创建数据库表

```
创建student表

CREATE TABLE IF NOT EXISTS mydb1.student (name STRING, age INT, contact INT );

创建employ表

create table employee (Id INT, name STRING, age INT,address STRING, salary BIGINT);
```

 

#### 3.1、 数据库表中插入数据

```
insert into employee (ID,NAME,AGE,ADDRESS,SALARY)VALUES (1, 'Ramesh', 32, 'Ahmedabad', 20000 );
insert into employee values (2, 'Khilan', 25, 'Delhi', 15000 );
Insert into employee values (3, 'kaushik', 23, 'Kota', 30000 );
Insert into employee values (4, 'Chaitali', 25, 'Mumbai', 35000 );
Insert into employee values (5, 'Hardik', 27, 'Bhopal', 40000 );
Insert into employee values (6, 'Komal', 22, 'MP', 32000 );
```

数据的覆盖

```
Insert overwrite employee values (1, 'Ram', 26, 'Vishakhapatnam', 37000 );
执行覆盖之后，表中只剩下了这一条数据了

另外一种建表语句

create table customer as select * from employee;

```

#### 3.2、 数据的查询

```
select * from employee;

select name,age from employee;
```

 

#### 3.3、 删除表

```
DROP table  mydb1.employee;
```

 

#### 3.4、 清空表数据

```
truncate  employee;
```



#### 3.5、 查看视图数据

```
select * from employee_view;
```



### 4、 order  by语句

基础语法

```
select * from table_name ORDER BY col_name [ASC|DESC] [NULLS FIRST|NULLS LAST]
Select * from employee ORDER BY id asc;
```

 

### 5、group  by  语句

```
Select name, sum(salary) from employee Group BY name;
```

 

### 6、 having 语句

基础语法

```
select * from table_name ORDER BY col_name [ASC|DESC] [NULLS FIRST|NULLS LAST]

按年龄对表进行分组，并选择每个组的最大工资，并显示大于20000的工资

select max(salary) from employee group by age having max(salary) > 20000;

```

### 7、 limit语句

```
select * from employee order by id limit 4;
```

## 8、impala当中的数据表导入几种方式

第一种方式，通过load  hdfs的数据到impala当中去

```
create table user(id int ,name string,age int ) row format delimited fields terminated by "\t";

准备数据user.txt并上传到hdfs的 /user/impala路径下去

1	hello	15
2	zhangsan	20
3	lisi	30
4	wangwu	50
```

加载数据

```
load data inpath '/user/impala/' into table user;
```

查询加载的数据

```
select  *  from  user;

如果查询不不到数据，那么需要刷新一遍数据表

refresh  user;
```

 

第二种方式：

```
create  table  user2   as   select * from  user;
```

第三种方式：

insert  into  不推荐使用 因为会产生大量的小文件

千万不要把impala当做一个数据库来使用

第四种：

```
insert  into  select  用的比较多
```

## 9、impala的java开发

在实际工作当中，因为impala的查询比较快，所以可能有会使用到impala来做数据库查询的情况，我们可以通过java代码来进行操作impala的查询

### 第一步：导入jar包

```
  <repositories>
        <repository>
            <id>cloudera</id>
            <url>https://repository.cloudera.com/artifactory/cloudera-repos/</url>
        </repository>
        <repository>
            <id>central</id>
            <url>http://repo1.maven.org/maven2/</url>
            <releases>
                <enabled>true</enabled>
            </releases>
            <snapshots>
                <enabled>false</enabled>
            </snapshots>
        </repository>
    </repositories>
    <dependencies>
        <dependency>
            <groupId>org.apache.hadoop</groupId>
            <artifactId>hadoop-common</artifactId>
            <version>2.6.0-cdh5.14.2</version>
        </dependency>
        <dependency>
            <groupId>org.apache.hive</groupId>
            <artifactId>hive-common</artifactId>
            <version>1.1.0-cdh5.14.2</version>
        </dependency>
        <dependency>
            <groupId>org.apache.hive</groupId>
            <artifactId>hive-metastore</artifactId>
            <version>1.1.0-cdh5.14.2</version>
        </dependency>
        <dependency>
            <groupId>org.apache.hive</groupId>
            <artifactId>hive-service</artifactId>
            <version>1.1.0-cdh5.14.2</version>
        </dependency>
        <dependency>
            <groupId>org.apache.hive</groupId>
            <artifactId>hive-jdbc</artifactId>
            <version>1.1.0-cdh5.14.2</version>
        </dependency>
        <dependency>
            <groupId>org.apache.hive</groupId>
            <artifactId>hive-exec</artifactId>
            <version>1.1.0-cdh5.14.2</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/org.apache.thrift/libfb303 -->
        <dependency>
            <groupId>org.apache.thrift</groupId>
            <artifactId>libfb303</artifactId>
            <version>0.9.0</version>
            <type>pom</type>
        </dependency>
        <!-- https://mvnrepository.com/artifact/org.apache.thrift/libthrift -->
        <dependency>
            <groupId>org.apache.thrift</groupId>
            <artifactId>libthrift</artifactId>
            <version>0.9.0</version>
            <type>pom</type>
        </dependency>
        <dependency>
            <groupId>org.apache.httpcomponents</groupId>
            <artifactId>httpclient</artifactId>
            <version>4.2.5</version>
        </dependency>
        <dependency>
            <groupId>org.apache.httpcomponents</groupId>
            <artifactId>httpcore</artifactId>
            <version>4.2.5</version>
        </dependency>
    </dependencies>

```

### 第二步：impala的java代码查询开发

```
public class ImpalaJdbc {
     public static void main(String[] args) throws Exception {
     //定义连接驱动类，以及连接url和执行的sql**语句     
	 String driver = "org.apache.hive.jdbc.HiveDriver";
     String driverUrl = "jdbc:hive2://192.168.52.120:21050/mydb1;auth=noSasl";
     String sql = "select * from student";
 
     //通过反射加载数据库连接驱动*    
	 Class.forName(driver);
     Connection connection = DriverManager.getConnection(driverUrl);
     PreparedStatement preparedStatement = connection.prepareStatement(sql);
     ResultSet resultSet = preparedStatement.executeQuery();
     //通过查询，得到数据一共有多少列     
	 int col = resultSet.getMetaData().getColumnCount();
     //遍历结果集     
	 while (resultSet.next()){
         for(int i=1;i<=col;i++){
             System.out.print(resultSet.getString(i)+"\t");
         }
         System.out.print("\n");
     }
     preparedStatement.close();
     connection.close();
 }
 }
```

 

 





