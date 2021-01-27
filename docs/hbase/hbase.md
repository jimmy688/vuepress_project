## HBase集群安装部署

事先要安装好3节点的hadoop和zookeeper集群

#### 准备安装包

- 下载安装包并上传到**node01服务器**

- 安装包下载地址：

  http://archive.cloudera.com/cdh5/cdh/5/hbase-1.2.0-cdh5.14.2.tar.gz

  ![image-20200228025204531](hbase.assets/image-20200228025204531.png)

- 将安装包上传到node01服务器/kkb/soft路径下，并进行解压

```shell
[hadoop@node01 ~]$ cd /kkb/soft/
[hadoop@node01 soft]$ tar -xzvf hbase-1.2.0-cdh5.14.2.tar.gz -C /kkb/install/
```

#### 修改HBase配置文件

##### hbase-env.sh

- 修改文件

```shell
[hadoop@node01 soft]$ cd /kkb/install/hbase-1.2.0-cdh5.14.2/conf/
[hadoop@node01 conf]$ vim hbase-env.sh
```

- 修改如下两项内容，值如下

```shell
export JAVA_HOME=/kkb/install/jdk1.8.0_141
export HBASE_MANAGES_ZK=false
## 修改为false的原因是hbase运行过程中，元数据存储在zookeeper中，而我们需要使用自己搭建的外部zookeeper集群。
```

![](hbase.assets/Image201911071657.png)

![](hbase.assets/Image201911071702.png)

##### hbase-site.xml

- 修改文件

```shell
[hadoop@node01 conf]$ vim hbase-site.xml
```

- 内容如下

```xml
<configuration>
	<property>
        <!--hbase数据，最终存储在hdfs的路径-->
		<name>hbase.rootdir</name>
		<value>hdfs://node01:8020/hbase</value>  
	</property>
	<property>
        <!--以分布式模式来运行hbase-->
		<name>hbase.cluster.distributed</name>
		<value>true</value>
	</property>
	<!-- 0.98后的新变动，之前版本没有.port,hbase的master默认端口为60000 -->
	<property>
		<name>hbase.master.port</name>
		<value>16000</value>
	</property>
	<property>
        <!--hbase运行要与zookeeper集群配合，这里指定zookeeper的服务器-->
		<name>hbase.zookeeper.quorum</name>
		<value>node01,node02,node03</value>
	</property>
    <!-- 客户端与zk集群通信的端口，此属性可省略，默认值就是2181 -->
	<property>
		<name>hbase.zookeeper.property.clientPort</name>
		<value>2181</value>
	</property>
	<property>
		<name>hbase.zookeeper.property.dataDir</name>
		<value>/kkb/install/zookeeper-3.4.5-cdh5.14.2/zkdatas</value>
	</property>
    <!-- 此属性可省略，默认值就是/hbase -->
	<property>
        <!--hbase的元数据存储在zookeeper集群的节点位置-->
		<name>zookeeper.znode.parent</name>
		<value>/hbase</value>
	</property>
</configuration>
```

##### regionservers

- 修改文件

```shell
[hadoop@node01 conf]$ vim regionservers
```

- 指定HBase集群的从节点；原内容清空，添加如下三行

```properties
node01
node02
node03
```

##### back-masters

- 创建back-masters配置文件，里边包含备份HMaster节点的主机名，每个机器独占一行，实现HMaster的高可用

```shell
[hadoop@node01 conf]$ vim backup-masters
```

- 将node02作为备份的HMaster节点，问价内容如下

```properties
node02
```

#### 分发安装包

- 将node01上的HBase安装包，拷贝到其他机器上

```shell
[hadoop@node01 conf]$ cd /kkb/install
[hadoop@node01 install]$ scp -r hbase-1.2.0-cdh5.14.2/ node02:$PWD
[hadoop@node01 install]$ scp -r hbase-1.2.0-cdh5.14.2/ node03:$PWD
```

#### 创建软连接

- **注意：三台机器**均做如下操作

- 因为HBase集群需要读取hadoop的core-site.xml、hdfs-site.xml的配置文件信息，所以我们==三台机器==都要执行以下命令，在相应的目录创建这两个配置文件的软连接

```shell
ln -s /kkb/install/hadoop-2.6.0-cdh5.14.2/etc/hadoop/core-site.xml  /kkb/install/hbase-1.2.0-cdh5.14.2/conf/core-site.xml

ln -s /kkb/install/hadoop-2.6.0-cdh5.14.2/etc/hadoop/hdfs-site.xml  /kkb/install/hbase-1.2.0-cdh5.14.2/conf/hdfs-site.xml
```

- 执行完后，出现如下效果，以node01为例

![](hbase.assets/Image201911071738.png)

#### 添加HBase环境变量

- **注意：三台机器**均执行以下命令，添加环境变量

```shell
sudo vim /etc/profile
```

- 文件末尾添加如下内容

```shell
export HBASE_HOME=/kkb/install/hbase-1.2.0-cdh5.14.2
export PATH=$PATH:$HBASE_HOME/bin
```

- 重新编译/etc/profile，让环境变量生效

```shell
source /etc/profile
```

#### HBase的启动与停止

- **需要提前启动HDFS及ZooKeeper集群**

- 第一台机器node01（HBase主节点）执行以下命令，启动HBase集群

```shell
[hadoop@node01 ~]$ start-hbase.sh
```

- 启动完后，jps查看HBase相关进程

  node01、node02上有进程HMaster、HRegionServer

  node03上有进程HRegionServer

- 警告提示：HBase启动的时候会产生一个警告，这是因为jdk7与jdk8的问题导致的，如果linux服务器安装jdk8就会产生这样的一个警告

![xx](hbase.assets/xx.png)

- 可以注释掉**所有机器**的hbase-env.sh当中的

  “HBASE_MASTER_OPTS”和“HBASE_REGIONSERVER_OPTS”配置 来解决这个问题。

  不过警告不影响我们正常运行，可以不用解决

- 我们也可以执行以下命令，单节点启动相关进程

```shell
#HMaster节点上启动HMaster命令
hbase-daemon.sh start master

#启动HRegionServer命令
hbase-daemon.sh start regionserver
```

#### 访问WEB页面

- 浏览器页面访问

  http://node01:60010

![](hbase.assets/Image201911071810.png)

#### 停止HBase集群

- 停止HBase集群的正确顺序
- node01上运行

```shell
[hadoop@node01 ~]$ stop-hbase.sh
```

- 若需要关闭虚拟机，则还需要关闭ZooKeeper、Hadoop集群




## HBase是什么

- [漫画学习HBase----最易懂的Hbase架构原理解析](<http://developer.51cto.com/art/201904/595698.htm>)
- HBase学习的推荐书籍1：《HBase企业应用开发实战》 稍微有点老，比较基础
- HBase学习的推荐书籍2：《HBase原理与实战》 比较深，hbase committer写的书

#### HBase的概念

- 通俗理解：HBase-->H+Base-->Hadoop+database-->hbase是Hadoop的数据库系统。

* HBase基于Google的BigTable论文，是建立的==HDFS==之上，提供**高可靠性**、**高性能**、**列存储**、**可伸缩**、**实时读写**的分布式数据库系统（非关系型）。
* hbase的数据存储在hdfs上。
* 在需要实时读写随机访问超大规模数据集时，可以使用HBase。



#### 回顾hdfs的优缺点

##### 优点

(1) 高容错性

(2) 适合批处理

(3) 适合大数据处理

(4) 流式数据访问

(5) 可构建在廉价机器上

##### 缺点

(1) 不适合低延时数据访问

(2) 无法高效的对大量小文件进行存储

(3) 不支持并发写入、不支持文件随机修改(不擅长随机读写)



#### HBase的特点

- ==**低时延**==
  - 支持低时延数据访问，ms级响应

* ==**海量存储**==
  * 可以存储大批量的数据
* ==**列式存储**==
  * HBase表的数据是基于列族进行存储的，列族是在列的方向上的划分。null的数据，不占据磁盘空间。
* ==**极易扩展**==
  * 底层依赖HDFS，当磁盘空间不足的时候，只需要动态增加datanode节点就可以了
  * 可以通过增加服务器来对集群的存储进行扩容
* ==**高并发**==
  * 支持高并发的读写请求，有很高的写数据吞吐量，写数据很快。
* ==**存储稀疏表**==
  * 稀疏主要是针对HBase列的灵活性，在列族中，你可以指定任意多的列，在列数据为空的情况下，是不会占用存储空间的。
* ==**数据的多版本**==
  - HBase表中的数据可以有多个版本值，默认情况下是根据版本号去区分，版本号就是插入数据的时间戳
* ==**数据类型单一**==
  * 所有的数据在HBase中是以==字节数组==进行存储



## HBase表的数据模型（重点）

![image-20200227170919531](hbase.assets/image-20200227170919531.png)

#### 2.1 rowkey行键

- table的主键，table中的记录(行）存储在hbase后，按照rowkey 的字典顺序进行排序。
- Row key行键可以是任意字符串(最大长度是 64KB，实际应用中长度一般为 10-100bytes)

#### 2.2 Column Family列族

- 列族或列簇
- HBase表中的每个列，都归属与某个列族
- 列族是表的schema(纲要) 的一部分(而列不是)，即建表时至少指定一个列族。一般一个表不超过2个列族。
- 比如创建一张表，名为`user`，有两个列族，分别是`info`和`data`，建表语句`create 'user', 'info', 'data'`

#### 2.3 Column列

- 列肯定是表的某一列族下的一个列，用`列族名:列名`表示，如`info`列族下的`name`列，表示为`info:name`
- 属于某一个ColumnFamily,类似于我们mysql当中创建的具体的列
- 创建表的时候，不需要指定列族有哪些列，在表中添加数据的时候，再自定义列及对应的值。

#### 2.4 cell单元格

- 指定row key行键、列族、列，就可以确定的一个cell单元格

- cell中的数据是没有类型的，全部是以字节数组进行存储

![](hbase.assets/Image201911072218.png)

#### 2.5 Timestamp时间戳

- 可以对表中的Cell多次赋值，每次赋值操作时的时间戳timestamp，可看成Cell值的版本号version number
- 即一个Cell可以有多个版本的值



## HBase整体架构

![image-20200227173753006](hbase.assets/image-20200227173753006.png)

#### Client客户端

* Client是操作HBase集群的入口
  * 对于管理类的操作，如表的增、删、改操纵，Client通过RPC与HMaster通信完成
  * 对于表数据的读写操作，Client通过RPC与RegionServer交互，读写数据
* Client类型：
  * HBase shell
  * Java编程接口
  * Thrift、Avro、Rest等等

#### ZooKeeper集群

* 作用
  * 实现了HMaster的高可用，多HMaster间进行主备选举

  * 保存了HBase的元数据信息meta表，提供了HBase表中region的寻址入口的线索数据

  * 对HMaster和HRegionServer实现了监控

#### HMaster

* HBase集群也是主从架构，HMaster是主的角色，是老大
* 主要负责Table表和Region的相关管理工作：
* 管理Client对Table的增删改的操作，如CREATE、ALTER、DROP等
  * 在Region分裂后，负责新Region分配到指定的HRegionServer上
  * 管理HRegionServer间的负载均衡，迁移region分布。（当某个HRegionServer节点的Region过多时，迁移部分region到其它HRegionServer节点上）
  * 当HRegionServer宕机后，负责其上的region的迁移

#### HRegionServer

* HBase集群中从的角色，是小弟
* HRegionServer节点可以存储HBase的数据，以Region为单元进行存储。(当然，数据存储的底层是在hdfs上)
* 作用

  * 响应客户端的读写数据请求,如SELECT、UPDATE、INSERT、DELETE等。
  * 负责管理一系列的Region
  * 切分在运行过程中变大的region

#### Region

* HBase集群中分布式存储的最小单元
* 一个Region对应一个Table表的部分数据
* Region会进行分裂，因为往一个Region写数据过程中，如果写的数据过多，导致Region过大，不方便以后的数据读写。
* 企业生产中，建议一个HregionServer有20-200个region,每个region在5-30G区间。



## HBase shell 命令--基本操作

#### 查看Hbase的命令

```sh
## 查看hbase拥有的命令
[hadoop@node01 install]$ hbase
Usage: hbase [<options>] <command> [<args>]
Options:
  --config DIR    Configuration direction to use. Default: ./conf
  --hosts HOSTS   Override the list in 'regionservers' file
  --auth-as-server Authenticate to ZooKeeper using servers configuration

Commands:
Some commands take arguments. Pass no args or -h for usage.
  shell           Run the HBase shell
  hbck            Run the hbase 'fsck' tool
  snapshot        Create a new snapshot of a table
  snapshotinfo    Tool for dumping snapshot information
  wal             Write-ahead-log analyzer
  hfile           Store file analyzer
  zkcli           Run the ZooKeeper shell
  upgrade         Upgrade hbase
  master          Run an HBase HMaster node
  regionserver    Run an HBase HRegionServer node
  zookeeper       Run a Zookeeper server
  rest            Run an HBase REST server
  thrift          Run the HBase Thrift server
  thrift2         Run the HBase Thrift2 server
  clean           Run the HBase clean up script
  classpath       Dump hbase CLASSPATH
  mapredcp        Dump CLASSPATH entries required by mapreduce
  pe              Run PerformanceEvaluation
  ltt             Run LoadTestTool
  version         Print the version
  CLASSNAME       Run the class named CLASSNAME
```

#### 进入HBase客户端命令操作界面

- node01(任意一个节点都可以）执行以下命令，进入HBase的shell客户端

```shell
cd /kkb/install/hbase-1.2.0-cdh5.14.2/
bin/hbase shell

#如果配置了hbase环境变量，直接使用以下方式即可：
hbase shell
#我们已经配了
```

#### help 帮助命令

###### 使用help查看hbase包含的命令

```sh
HBase(main):001:0> help
HBase Shell, version 1.2.0-cdh5.14.2, rUnknown, Tue Mar 27 13:31:54 PDT 2018
Type 'help "COMMAND"', (e.g. 'help "get"' -- the quotes are necessary) for help on a specific command.
Commands are grouped. Type 'help "COMMAND_GROUP"', (e.g. 'help "general"') for help on a command group.

COMMAND GROUPS: 
  Group name: general  #基本操作命令
  Commands: status, table_help, version, whoami

  Group name: ddl  #ddl相关操作命令
  Commands: alter, alter_async, alter_status, create, describe, disable, disable_all, drop, drop_all, enable, enable_all, exists, get_table, is_disabled, is_enabled, list, locate_region, show_filters

  Group name: namespace
  Commands: alter_namespace, create_namespace, describe_namespace, drop_namespace, list_namespace, list_namespace_tables

  Group name: dml #dml相关操作命令
  Commands: append, count, delete, deleteall, get, get_counter, get_splits, incr, put, scan, truncate, truncate_preserve

  Group name: tools  #工具相关操作命令
  Commands: assign, balance_switch, balancer, balancer_enabled, catalogjanitor_enabled, catalogjanitor_run, catalogjanitor_switch, close_region, compact, compact_mob, compact_rs, flush, major_compact, major_compact_mob, merge_region, move, normalize, normalizer_enabled, normalizer_switch, split, trace, unassign, wal_roll, zk_dump

  Group name: replication  ## 副本相关操作命令
  Commands: add_peer, append_peer_tableCFs, disable_peer, disable_table_replication, enable_peer, enable_table_replication, get_peer_config, list_peer_configs, list_peers, list_replicated_tables, remove_peer, remove_peer_tableCFs, set_peer_tableCFs, show_peer_tableCFs, update_peer_config

  Group name: snapshots #快照相关操作命令
  Commands: clone_snapshot, delete_all_snapshot, delete_snapshot, list_snapshots, restore_snapshot, snapshot

  Group name: configuration
  Commands: update_all_config, update_config

  Group name: quotas
  Commands: list_quotas, set_quota

  Group name: security #安全相关操作命令
  Commands: grant, list_security_capabilities, revoke, user_permission

  Group name: procedures
  Commands: abort_procedure, list_procedures

  Group name: visibility labels
  Commands: add_labels, clear_auths, get_auths, list_labels, set_auths, set_visibility

  Group name: rsgroup
  Commands: add_rsgroup, balance_rsgroup, get_rsgroup, get_server_rsgroup, get_table_rsgroup, list_rsgroups, move_servers_rsgroup, move_tables_rsgroup, remove_rsgroup
```

###### 使用help查看具体命令的使用方法

```sh
hbase(main):072:0> help 'put'
Put a cell 'value' at specified table/row/column and optionally
timestamp coordinates.  To put a cell value into table 'ns1:t1' or 't1'
at row 'r1' under column 'c1' marked with the time 'ts1', do:

  hbase> put 'ns1:t1', 'r1', 'c1', 'value'
  hbase> put 't1', 'r1', 'c1', 'value'
  hbase> put 't1', 'r1', 'c1', 'value', ts1
  hbase> put 't1', 'r1', 'c1', 'value', {ATTRIBUTES=>{'mykey'=>'myvalue'}}
  hbase> put 't1', 'r1', 'c1', 'value', ts1, {ATTRIBUTES=>{'mykey'=>'myvalue'}}
  hbase> put 't1', 'r1', 'c1', 'value', ts1, {VISIBILITY=>'PRIVATE|SECRET'}

The same commands also can be run on a table reference. Suppose you had a reference
t to table 't1', the corresponding command would be:

  hbase> t.put 'r1', 'c1', 'value', ts1, {ATTRIBUTES=>{'mykey'=>'myvalue'}}
```



#### create 创建表

- 创建user表，包含info、data两个列族
- 使用create命令

```sh
## 第一种方式:
HBase(main):010:0> create 'user', 'info', 'data'
#user是表名，info和data是列族名称。

#第二种方式:
HBase(main):010:0> create 'user', {NAME => 'info', VERSIONS => '3'},{NAME => 'data'}
## user是表名
## {NAME => 'info', VERSIONS => '3'}是一个名称为info，数据的版本个数为3的列族
## {NAME => 'data'}也是一个列族
## NAME和VERSION必须写成大写！！！！！！！否则报错。
```

#### list 查看有哪些表

- 查看当前数据库中有哪些表

```sh
hbase(main):001:0> list
TABLE                                                                                 user                                                                                   1 row(s) in 0.2340 seconds

=> ["user"]
```

#### put 插入数据操作

- 向表中插入数据
- 使用put命令，语法格式：put 表 行键 列族:列 值 

```sh
#向user表中插入信息，row key为rk0001，列族info中添加名为name的列，值为zhangsan
HBase(main):011:0> put 'user', 'rk0001', 'info:name', 'zhangsan'

#向user表中插入信息，row key为rk0001，列族info中添加名为gender的列，值为female
HBase(main):012:0> put 'user', 'rk0001', 'info:gender', 'female'

#向user表中插入信息，row key为rk0001，列族info中添加名为age的列，值为20
HBase(main):013:0> put 'user', 'rk0001', 'info:age', 20

#向user表中插入信息，row key为rk0001，列族info中添加名为pic的列，值为picture
HBase(main):014:0> put 'user', 'rk0001', 'info:pic', 'picture'

#向user表中插入信息，row key为rk0001，列族data中添加名为passwd的列，值为123456
HBase(main):015:0> put 'user', 'rk0001', 'data:passwd', '123456'
```

## Hbase shell命令--查询数据操作

#### 使用get命令（按指定RowKey获取唯一一条记录)

##### 通过rowkey进行查询一整行

- 获取user表中row key为rk0001的所有信息（即所有cell的数据）
- 使用get命令

```sh
hbase(main):014:0> get 'user', 'rk0001'
COLUMN                                         CELL                                   
 data:passwd                                   timestamp=1582805625140, value=123456 
 info:age                                      timestamp=1582805615189, value=20     
 info:gender                                   timestamp=1582805610807, value=female 
 info:name                                     timestamp=1582805606706, value=zhangsan
 info:pic                                      timestamp=1582805619167, value=picture 

## 可以看到，以下数据是按字典顺序排序的
 data:passwd
 info:age
 info:gender
 info:name
 info:pic
## 以下是时间戳
timestamp=1582805625140, value=123456 
timestamp=1582805615189, value=20     
timestamp=1582805610807, value=female 
timestamp=1582805606706, value=zhangsan
timestamp=1582805619167, value=picture
```

##### 查看rowkey下某个列族的信息

- 获取user表中row key为rk0001，info列族的所有信息

```sh
hbase(main):015:0> get 'user','rk0001','info'
COLUMN                                         CELL                                   
 info:age                                      timestamp=1582805615189, value=20     
 info:gender                                   timestamp=1582805610807, value=female 
 info:name                                     timestamp=1582805606706, value=zhangsan
 info:pic                                      timestamp=1582805619167, value=picture 
```

##### 查看rowkey指定列族指定字段的值

- 获取user表中row key为rk0001，info列族的name、age列的信息

```shell
hbase(main):016:0> get 'user','rk0001','info:name'
COLUMN                                         CELL                                   
 info:name                                     timestamp=1582805606706, value=zhangsan
```

##### 查看rowkey指定多个列族的信息

- 获取user表中row key为rk0001，info、data列族的信息

```shell
HBase(main):018:0> get 'user', 'rk0001', 'info', 'data'
COLUMN                                         CELL                                   
 data:passwd                                   timestamp=1582805625140, value=123456 
 info:age                                      timestamp=1582805615189, value=20     
 info:gender                                   timestamp=1582805610807, value=female 
 info:name                                     timestamp=1582805606706, value=zhangsan
 info:pic                                      timestamp=1582805619167, value=picture 

#或者你也可以这样写
HBase(main):019:0> get 'user', 'rk0001', {COLUMN => ['info', 'data']}


#或者你也可以这样写，也行
hbase(main):019:0> get 'user', 'rk0001', {COLUMN => ['info:name', 'data:passwd']}
COLUMN                                         CELL                                   
 data:passwd                                   timestamp=1582805625140, value=123456 
 info:name                                     timestamp=1582805606706, value=zhangsan
```

##### 指定rowkey与列值过滤器查询

- 获取user表中row key为rk0001，cell的值为zhangsan的信息

```shell
hbase(main):026:0> get 'user','rk0001',{FILTER => "ValueFilter(=,'binary:zhangsan')"}
COLUMN                  CELL                                                           
 info:name              timestamp=1582805606706, value=zhangsan    

## 特别注意ValueFilter的V是大写的！！！
```

##### 指定rowkey与列名模糊查询

- 获取user表中row key为rk0001，列标识符中含有a的信息

```shell
hbase(main):028:0> get 'user','rk0001',{FILTER =>"QualifierFilter(=,'substring:a')"}
COLUMN                  CELL                                                        
 data:passwd            timestamp=1582805625140, value=123456                       
 info:age               timestamp=1582805615189, value=20                           
 info:name              timestamp=1582805606706, value=zhangsan                     


## 继续插入一批数据
HBase(main):032:0> put 'user', 'rk0002', 'info:name', 'fanbingbing'
HBase(main):033:0> put 'user', 'rk0002', 'info:gender', 'female'
HBase(main):034:0> put 'user', 'rk0002', 'info:nationality', '中国'
hbase(main):035:0> get 'user', 'rk0002', {FILTER => "ValueFilter(=, 'binary:中国')"}
COLUMN                  CELL                                                        
 info:nationality       timestamp=1582809090676, value=\xE4\xB8\xAD\xE5\x9B\xBD    
```

##### 查看指定第几个版本的数据

```sh
#查看第5个版本的数据
hbase(main):025:0> get 'versionTTL_test','rk001',{COLUMN=>'f1:age',VERSION=>5}
COLUMN                           CELL                                                 f1:age                          timestamp=1583522558368, value=krystal5                                                                                                   
1 row(s) in 0.0220 seconds
```

##### 查看多个版本的数据

```shell
#查看最新5个版本的数据
hbase(main):026:0> get 'versionTTL_test','rk001',{COLUMN=>'f1:age',VERSIONS=>5}
COLUMN                          CELL                                   
f1:age                          timestamp=1583522558368, value=krystal5              f1:age                          timestamp=1583522558362, value=krystal4 
f1:age                          timestamp=1583522558346, value=krystal3               f1:age                          timestamp=1583522558341, value=krystal2             
f1:age                          timestamp=1583522558335, value=krystal1 
```

修改版本个数的方法：

```
hbase是一个多版本的管理系统，在0.96的版本之前默认每个列是3个version，在hbase 0.96之后每个列是1个version
alter 'hbase1',{NAME=>'cf',VERSIONS=>3}
```



#### 使用scan命令（按指定的条件获取一批记录）

##### 查询所有行的数据

- 查询user表中的所有信息
- 使用scan命令

```sh
HBase(main):032:0>  scan 'user'
ROW                     COLUMN+CELL                                              
 rk0001                 column=data:passwd, timestamp=1582805625140, value=123456
 rk0001                 column=info:age, timestamp=1582805615189, value=20       
 rk0001                 column=info:gender, timestamp=1582805610807, value=female
 rk0001                 column=info:name, timestamp=1582805606706, value=zhangsan
 rk0001                 column=info:pic, timestamp=1582805619167, value=picture  
```



##### 列族查询

- 查询user表中列族为info的信息

```sh
scan 'user', {COLUMNS => 'info'}
ROW                     COLUMN+CELL                                                   
 rk0001                 column=data:passwd, timestamp=1582805625140, value=123456  

#当某些列的值删除后，具体的数据并不会马上从存储文件中删除,查询的时候，不显示被删除的数据,如果要查询已经被删除的数据，添加RAW=>true
scan 'user', {COLUMNS => 'info', RAW => true, VERSIONS => 5}
scan 'user', {COLUMNS => 'info', RAW => true, VERSIONS => 3}
```

##### 多列族查询

- 查询user表中列族为info和data的信息

```sh
hbase(main):038:0> scan 'user', {COLUMNS => ['info', 'data']}
ROW                 COLUMN+CELL                                                   
 rk0001             column=data:passwd, timestamp=1582805625140, value=123456     
 rk0001             column=info:age, timestamp=1582805615189, value=20             
 rk0001             column=info:gender, timestamp=1582805610807, value=female     
 rk0001             column=info:name, timestamp=1582805606706, value=zhangsan     
 rk0001             column=info:pic, timestamp=1582805619167, value=picture       
 rk0002             column=info:gender, timestamp=1582809086308, value=female     
 rk0002             column=info:name, timestamp=1582809082232, value=fanbingbing   
 rk0002             column=info:nationality, timestamp=1582809090676, value=\xE4\xB8\x
                        AD\xE5\x9B\xBD  
```

##### 指定列族与某个列名查询

- 查询user表中列族为info、列标示符为name的信息

```shell
scan 'user',{COLUMNS=>'info:name'}
ROW                     COLUMN+CELL                                                   
 rk0001                 column=info:name, timestamp=1582805606706, value=zhangsan     
 rk0002                 column=info:name, timestamp=1582809082232, value=fanbingbing  
```

- 查询info:name列、data:passwd列的数据

```sh
scan 'user',{COLUMNS=>['info:name','data:passwd']}
ROW                     COLUMN+CELL                                                   
 rk0001                 column=data:passwd, timestamp=1582805625140, value=123456    
 rk0001                 column=info:name, timestamp=1582805606706, value=zhangsan     
 rk0002                 column=info:name, timestamp=1582809082232, value=fanbingbing 
```

- 查询user表中列族为info、列标示符为name的信息,并且版本最新的5个

```sh
scan 'user',{COLUMNS=>'info:name',VERSION=>5}
ROW                     COLUMN+CELL                                                   
 rk0001                 column=info:name, timestamp=1582805606706, value=zhangsan     
 rk0002                 column=info:name, timestamp=1582809082232, value=fanbingbing   
```

##### 指定多个列族与按照数据值模糊查询

- 查询user表中列族为info和data且列标示符中含有ag字符的信息

```sh
scan 'user',{COLUMNS=>'info',FILTER=>"(QualifierFilter(=,'substring:ag'))"}
ROW                     COLUMN+CELL                                                   
 rk0001                 column=info:age, timestamp=1582805615189, value=20     
```

##### 指定rowkey的范围查询

- 查询user表中列族为info，rk范围是[rk0001, rk0002)的数据,注意是左闭右开。

```sh
scan 'user',{COLUMNS=>'info',STARTROW=>'rk0001',ENDROW=>'rk0002'}
ROW                     COLUMN+CELL                                                   
 rk0001                 column=info:age, timestamp=1582805615189, value=20             
 rk0001                 column=info:gender, timestamp=1582805610807, value=female     
 rk0001                 column=info:name, timestamp=1582805606706, value=zhangsan     
 rk0001                 column=info:pic, timestamp=1582805619167, value=picture      
```

##### 指定rowkey模糊查询

- 查询user表中row key以rk字符开头的数据

```sh
hbase(main):001:0> scan 'user',{FILTER=>"PrefixFilter('rk')"}
ROW                     COLUMN+CELL                                                   
 rk0001                 column=data:passwd, timestamp=1582805625140, value=123456     
 rk0001                 column=info:age, timestamp=1582805615189, value=20             
 rk0001                 column=info:gender, timestamp=1582805610807, value=female     
 rk0001                 column=info:name, timestamp=1582805606706, value=zhangsan     
 rk0001                 column=info:pic, timestamp=1582805619167, value=picture       
 rk0002                 column=info:gender, timestamp=1582809086308, value=female     
 rk0002                 column=info:name, timestamp=1582809082232, value=fanbingbing   
 rk0002                 column=info:nationality, timestamp=1582809090676, value=\xE4\xB8\x
                        AD\xE5\x9B\xBD  
```

##### 指定数据版本的范围查询

- 查询user表中指定范围的数据,左闭右开。

```SH
scan 'user',{TIMERANGE=>[1582805606706,1582805619167]}
ROW                     COLUMN+CELL                                                   
 rk0001                 column=info:age, timestamp=1582805615189, value=20             
 rk0001                 column=info:gender, timestamp=1582805610807, value=female     
 rk0001                 column=info:name, timestamp=1582805606706, value=zhangsan  
```



## 更新数据操作

##### 更新数据值

- 更新操作同插入操作一模一样，只不过有数据就更新，没数据就添加
- 使用put命令

##### 更新版本号

- 将user表的f1列族版本数改为5

```
HBase(main):050:0> alter 'user', NAME => 'info', VERSIONS => 5
```

## 删除数据以及删除表操作

##### 指定rowkey以及列名进行删除

- 删除user表row key为rk0001，列标示符为info:name的数据

```sh
HBase(main):045:0> delete 'user', 'rk0001', 'info:name'
```

##### 指定rowkey，列名以及版本号进行删除

- 删除user表row key为rk0001，列标示符为info:name，timestamp为1392383705316的数据

```sh
delete 'user', 'rk0001', 'info:name', 1582809082232
```

##### 删除一个列族

- 删除一个列族：

```sh
alter 'user', NAME => 'info', METHOD => 'delete' 

## 或 

alter 'user', 'delete' => 'info'
```

##### 清空表数据

```ruby
HBase(main):017:0> truncate 'user'
```

##### 删除表

- 首先需要先让该表为disable状态，使用命令：

```sh
HBase(main):049:0> disable 'user'
```

- 然后使用drop命令删除这个表

```sh
 HBase(main):050:0> drop 'user'
```

注意：如果直接drop表，会报错：Drop the named table. Table must first be disabled

 

## HBase的高级shell管理命令

#### status--显示服务器状态

- 例如：显示服务器状态

```sh
hbase(main):028:0> status 'node01'
1 active master, 1 backup masters, 3 servers, 0 dead, 1.0000 average load
```

#### whoami--显示hbase用户

- 显示HBase当前用户，例如：

```sh
hbase(main):029:0> whoami
hadoop (auth:SIMPLE)
    groups: hadoop
```

#### list--显示所有表

- 显示当前所有的表

```sh
hbase(main):030:0> list
TABLE                                                                                
user                                                                                   
1 row(s) in 0.0140 seconds

=> ["user"]
```

#### count--统计记录数

- 统计指定表的记录数，例如：

```sh
hbase(main):050:0> scan 'user'
ROW                     COLUMN+CELL                                                   
 rk0001                 column=data:d1, timestamp=1582825327219, value=520             
 rk0001                 column=info:name, timestamp=1582825159368, value=jimmy         
 rk0002                 column=info:name, timestamp=1582825183959, value=krystal       
 rk0003                 column=data:d1, timestamp=1582825350048, value=1314           
 rk0003                 column=info:name, timestamp=1582825254931, value=god           


hbase(main):051:0> count 'user'
3 row(s) in 0.0210 seconds

=> 3
```

#### describe--显示表结构

- 展示表结构信息

```sh
hbase(main):054:0> describe 'user'
Table user is ENABLED                                                                     
user                                                                                      
COLUMN FAMILIES DESCRIPTION                                                               
{NAME => 'data', BLOOMFILTER => 'ROW', VERSIONS => '1', IN_MEMORY => 'false', KEEP_DELETED
_CELLS => 'FALSE', DATA_BLOCK_ENCODING => 'NONE', TTL => 'FOREVER', COMPRESSION => 'NONE',
 MIN_VERSIONS => '0', BLOCKCACHE => 'true', BLOCKSIZE => '65536', REPLICATION_SCOPE => '0'
}                                                                                         
{NAME => 'info', BLOOMFILTER => 'ROW', VERSIONS => '1', IN_MEMORY => 'false', KEEP_DELETED
_CELLS => 'FALSE', DATA_BLOCK_ENCODING => 'NONE', TTL => 'FOREVER', COMPRESSION => 'NONE',
 MIN_VERSIONS => '0', BLOCKCACHE => 'true', BLOCKSIZE => '65536', REPLICATION_SCOPE => '0'
}                
```

#### exists--判断表是否存在

- 检查表是否存在，适用于表量特别多的情况

```sh
hbase(main):056:0> exists 'user'
Table user does exist     
```

#### is_enabled/is_disabled--判断是否启用/禁用表

- 检查表是否启用或禁用

```sh
hbase(main):060:0> is_enabled 'user'
true                                                                                   
0 row(s) in 0.0220 seconds

hbase(main):062:0> is_disabled 'user'
false                                                                                 
0 row(s) in 0.0090 seconds
```

#### alter--增加/删除列族

- **为当前表增加列族：**

```sh
hbase(main):064:0> alter 'user', NAME => 'CF2', VERSIONS => 2

hbase(main):065:0> describe 'user'
Table user is ENABLED                                                                     
user                                                                                      
COLUMN FAMILIES DESCRIPTION                                                               
{NAME => 'CF2', BLOOMFILTER => 'ROW', VERSIONS => '1', IN_MEMORY => 'false', KEEP_DELETED_
CELLS => 'FALSE', DATA_BLOCK_ENCODING => 'NONE', TTL => 'FOREVER', COMPRESSION => 'NONE', 
MIN_VERSIONS => '0', BLOCKCACHE => 'true', BLOCKSIZE => '65536', REPLICATION_SCOPE => '0'}
{NAME => 'data', BLOOMFILTER => 'ROW', VERSIONS => '1', IN_MEMORY => 'false', KEEP_DELETED
_CELLS => 'FALSE', DATA_BLOCK_ENCODING => 'NONE', TTL => 'FOREVER', COMPRESSION => 'NONE',
 MIN_VERSIONS => '0', BLOCKCACHE => 'true', BLOCKSIZE => '65536', REPLICATION_SCOPE => '0'
}                                                                                         
{NAME => 'info', BLOOMFILTER => 'ROW', VERSIONS => '1', IN_MEMORY => 'false', KEEP_DELETED
_CELLS => 'FALSE', DATA_BLOCK_ENCODING => 'NONE', TTL => 'FOREVER', COMPRESSION => 'NONE',
 MIN_VERSIONS => '0', BLOCKCACHE => 'true', BLOCKSIZE => '65536', REPLICATION_SCOPE => '0'
}                         
```

- **为当前表删除列族：**

```
HBase(main):002:0>  alter 'user', 'delete' => 'CF2'
```

#### disable/enable--启动/禁用表

- 禁用一张表/启用一张表

```
HBase> disable 'user'
HBase> enable 'user'
```

#### drop--删除表

- 删除一张表，记得在删除表之前必须先禁用

#### truncate

- 禁用表-删除表-创建表



## HBase的JavaAPI操作（重点）

- HBase是一个分布式的NoSql数据库，在实际工作当中，我们一般都可以通过JavaAPI来进行各种数据的操作，包括创建表，以及数据的增删改查等等。在工作当中，大多数情况是使用编程，而不是使用hbase shell命令，但是，在做一些快速测试的时候，还是shell命令更高效点。

#### 创建maven工程

- 讲如下内容作为maven工程中pom.xml的repositories的内容
- 自动导包（需要从cloudera仓库下载，耗时较长，耐心等待)
- 创建一个测试类，路径：src/test/java/MyTestClass.java

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
            <groupId>org.apache.hbase</groupId>
            <artifactId>hbase-client</artifactId>
            <version>1.2.0-cdh5.14.2</version>
        </dependency>
        <dependency>
            <groupId>org.apache.hbase</groupId>
            <artifactId>hbase-server</artifactId>
            <version>1.2.0-cdh5.14.2</version>
        </dependency>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.testng</groupId>
            <artifactId>testng</artifactId>
            <version>6.14.3</version>
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
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-shade-plugin</artifactId>
                <version>2.2</version>
                <executions>
                    <execution>
                        <phase>package</phase>
                        <goals>
                            <goal>shade</goal>
                        </goals>
                        <configuration>
                            <filters>
                                <filter>
                                    <artifact>*:*</artifact>
                                    <excludes>
                                        <exclude>META-INF/*.SF</exclude>
                                        <exclude>META-INF/*.DSA</exclude>
                                        <exclude>META-INF/*/RSA</exclude>
                                    </excludes>
                                </filter>
                            </filters>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
```

#### 创建myuser表

- 创建myuser表，此表有两个列族f1和f2

```java
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.HColumnDescriptor;
import org.apache.hadoop.hbase.HTableDescriptor;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.Admin;
import org.apache.hadoop.hbase.client.Connection;
import org.apache.hadoop.hbase.client.ConnectionFactory;
import org.junit.Test;

import java.io.IOException;


public class MyTestClass {
    @Test
    public void createTable() throws IOException {
        //连接HBase集群不需要指定HBase主节点的ip地址和端口号:
        Configuration conf= HBaseConfiguration.create();
        //指定hbase对应的zookeeper集群,2181是客户端与zookeeper集群连接的端口号
        conf.set("hbase.zookeeper.quorum","node01:2181,node02:2181,node03:2181");

        //创建客户端与hbase的连接对象
        Connection conne=ConnectionFactory.createConnection(conf);

        //获取admin对象
        Admin am=conne.getAdmin();

        //指定表名
        TableName tName= TableName.valueOf("myuser");
        HTableDescriptor htds=new HTableDescriptor(tName);
        //指定表的列族
        //public HColumnDescriptor(final String familyName)
        htds.addFamily(new HColumnDescriptor("f1"));
        htds.addFamily(new HColumnDescriptor("f2"));

        //使用admin对象创建表
        am.createTable(htds);

        //释放资源
        am.close();
        conne.close();
    }
}

```

补充说明：

```
    //查看源码后发现:
    //void createTable(HTableDescriptor desc) throws IOException; 此方法需要HTableDescriptor对象作为参数
    //HTableDescriptor类有构造方法: public HTableDescriptor(final TableName name),此构造方法需要TableName对象
    //TableName类有生成TableName对象的方法：public static TableName valueOf(String name)
    //运行过程中出现了小报错，因为之前不小心移动了windows上的hadoop安装文件夹，导致出现winutils错误，把文件弄回来就解决了，然后重新启动一下IDEA，参考连接：https://blog.csdn.net/abc50319/article/details/80284741
```

<img src="hbase.assets/image-20200624230846544.png" alt="image-20200624230846544" style="zoom:50%;" />



查看创建表的相关源码的方法（关联hbase源码包,将课件中的hbase-1.2.0-cdh5.14.2-src.tar.gz文件解压即可得到源码包）

<video src='E:\LearningAll\8-HadoopEcosystem-Video\md视频\createTable.mp4'/>
#### 向表中添加数据(一行)

```java
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.Connection;
import org.apache.hadoop.hbase.client.ConnectionFactory;
import org.apache.hadoop.hbase.client.Put;
import org.apache.hadoop.hbase.client.Table;
import org.apache.hadoop.hbase.util.Bytes;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;

public class MyTestClass2 {
   //创建实例变量
    private Connection cone;
    private Table table1;
    private String tName="myuser";

    //建立连接,并获取要添加数据的表的Table对象
    @Before
    public void initTable() throws IOException {
        Configuration conf= HBaseConfiguration.create();
        conf.set("hbase.zookeeper.quorum","node01:2181,node02:2181,node03:2181");
        cone= ConnectionFactory.createConnection(conf);
        table1=cone.getTable(TableName.valueOf(tName));
    }
    @Test
    public void addData() throws IOException {
        /*创建Put对象
        Put没有无参构造,有参构造传入的参数可是字节数组
        数组内容是要修改的数据的行键rowkey的值*/
        Put put1=new Put("00001".getBytes());

        /*添加数据：
        public Put addColumn(byte [] family, byte [] qualifier, byte [] value) */
        put1.addColumn("f1".getBytes(),"age".getBytes(), Bytes.toBytes(18));
        put1.addColumn("f1".getBytes(),"name".getBytes(),"krystal".getBytes());
        put1.addColumn("f1".getBytes(),"id".getBytes(),Bytes.toBytes(25));
        put1.addColumn("f1".getBytes(),"adress".getBytes(),Bytes.toBytes("地球人"));
        table1.put(put1);

    }
    //关闭资源
    @After
    public void closeResource() throws IOException {
        table1.close();
        cone.close();
    }
}

```

观察效果:

```sh
hbase(main):010:0> scan 'myuser'
ROW                 COLUMN+CELL                                                   
 00001              column=f1:adress, timestamp=1582836163648, value=\xE5\x9C\xB0\xE7\
                        x90\x83\xE4\xBA\xBA                                           
 00001              column=f1:age, timestamp=1582836163648, value=\x00\x00\x00\x12 
 00001              column=f1:id, timestamp=1582836163648, value=\x00\x00\x00\x19 
 00001              column=f1:name, timestamp=1582836163648, value=krystal  
```

#### 向表中批量添加数据（多行）

```java
    /**
     * hbase的批量插入数据
     */
    @Test
    public void batchInsert() throws IOException {
        //创建put对象，并指定rowkey
        Put put = new Put("0002".getBytes());
        //f1
        put.addColumn("f1".getBytes(),"id".getBytes(),Bytes.toBytes(1));
        put.addColumn("f1".getBytes(),"name".getBytes(),Bytes.toBytes("曹操"));
        put.addColumn("f1".getBytes(),"age".getBytes(),Bytes.toBytes(30));
        //f2
        put.addColumn("f2".getBytes(),"sex".getBytes(),Bytes.toBytes("1"));
        put.addColumn("f2".getBytes(),"address".getBytes(),Bytes.toBytes("沛国谯县"));
        put.addColumn("f2".getBytes(),"phone".getBytes(),Bytes.toBytes("16888888888"));
        put.addColumn("f2".getBytes(),"say".getBytes(),Bytes.toBytes("helloworld"));

        Put put2 = new Put("0003".getBytes());
        put2.addColumn("f1".getBytes(),"id".getBytes(),Bytes.toBytes(2));
        put2.addColumn("f1".getBytes(),"name".getBytes(),Bytes.toBytes("刘备"));
        put2.addColumn("f1".getBytes(),"age".getBytes(),Bytes.toBytes(32));
        put2.addColumn("f2".getBytes(),"sex".getBytes(),Bytes.toBytes("1"));
        put2.addColumn("f2".getBytes(),"address".getBytes(),Bytes.toBytes("幽州涿郡涿县"));
        put2.addColumn("f2".getBytes(),"phone".getBytes(),Bytes.toBytes("17888888888"));
        put2.addColumn("f2".getBytes(),"say".getBytes(),Bytes.toBytes("talk is cheap , show me the code"));

        Put put3 = new Put("0004".getBytes());
        put3.addColumn("f1".getBytes(),"id".getBytes(),Bytes.toBytes(3));
        put3.addColumn("f1".getBytes(),"name".getBytes(),Bytes.toBytes("孙权"));
        put3.addColumn("f1".getBytes(),"age".getBytes(),Bytes.toBytes(35));
        put3.addColumn("f2".getBytes(),"sex".getBytes(),Bytes.toBytes("1"));
        put3.addColumn("f2".getBytes(),"address".getBytes(),Bytes.toBytes("下邳"));
        put3.addColumn("f2".getBytes(),"phone".getBytes(),Bytes.toBytes("12888888888"));
        put3.addColumn("f2".getBytes(),"say".getBytes(),Bytes.toBytes("what are you 弄啥嘞！"));

        Put put4 = new Put("0005".getBytes());
        put4.addColumn("f1".getBytes(),"id".getBytes(),Bytes.toBytes(4));
        put4.addColumn("f1".getBytes(),"name".getBytes(),Bytes.toBytes("诸葛亮"));
        put4.addColumn("f1".getBytes(),"age".getBytes(),Bytes.toBytes(28));
        put4.addColumn("f2".getBytes(),"sex".getBytes(),Bytes.toBytes("1"));
        put4.addColumn("f2".getBytes(),"address".getBytes(),Bytes.toBytes("四川隆中"));
        put4.addColumn("f2".getBytes(),"phone".getBytes(),Bytes.toBytes("14888888888"));
        put4.addColumn("f2".getBytes(),"say".getBytes(),Bytes.toBytes("出师表你背了嘛"));

        Put put5 = new Put("0006".getBytes());
        put5.addColumn("f1".getBytes(),"id".getBytes(),Bytes.toBytes(5));
        put5.addColumn("f1".getBytes(),"name".getBytes(),Bytes.toBytes("司马懿"));
        put5.addColumn("f1".getBytes(),"age".getBytes(),Bytes.toBytes(27));
        put5.addColumn("f2".getBytes(),"sex".getBytes(),Bytes.toBytes("1"));
        put5.addColumn("f2".getBytes(),"address".getBytes(),Bytes.toBytes("哪里人有待考究"));
        put5.addColumn("f2".getBytes(),"phone".getBytes(),Bytes.toBytes("15888888888"));
        put5.addColumn("f2".getBytes(),"say".getBytes(),Bytes.toBytes("跟诸葛亮死掐"));


        Put put6 = new Put("0007".getBytes());
        put6.addColumn("f1".getBytes(),"id".getBytes(),Bytes.toBytes(5));
        put6.addColumn("f1".getBytes(),"name".getBytes(),Bytes.toBytes("xiaobubu—吕布"));
        put6.addColumn("f1".getBytes(),"age".getBytes(),Bytes.toBytes(28));
        put6.addColumn("f2".getBytes(),"sex".getBytes(),Bytes.toBytes("1"));
        put6.addColumn("f2".getBytes(),"address".getBytes(),Bytes.toBytes("内蒙人"));
        put6.addColumn("f2".getBytes(),"phone".getBytes(),Bytes.toBytes("15788888888"));
        put6.addColumn("f2".getBytes(),"say".getBytes(),Bytes.toBytes("貂蝉去哪了"));

        List<Put> listPut = new ArrayList<Put>();
        listPut.add(put);
        listPut.add(put2);
        listPut.add(put3);
        listPut.add(put4);
        listPut.add(put5);
        listPut.add(put6);

        table.put(listPut);
    }
```

查看效果：

```sh
hbase(main):011:0> scan 'myuser'
ROW                     COLUMN+CELL                                                       
 00001                  column=f1:adress, timestamp=1582836163648, value=\xE5\x9C\xB0\xE7\
                        x90\x83\xE4\xBA\xBA                                               
 00001                  column=f1:age, timestamp=1582836163648, value=\x00\x00\x00\x12    
 00001                  column=f1:id, timestamp=1582836163648, value=\x00\x00\x00\x19     
 00001                  column=f1:name, timestamp=1582836163648, value=krystal            
 0002                   column=f1:age, timestamp=1582837532912, value=\x00\x00\x00\x1E    
 0002                   column=f1:id, timestamp=1582837532912, value=\x00\x00\x00\x01     
 0002                   column=f1:name, timestamp=1582837532912, value=\xE6\x9B\xB9\xE6\x9
                        3\x8D                                                             
 0002                   column=f2:address, timestamp=1582837532912, value=\xE6\xB2\x9B\xE5
                        \x9B\xBD\xE8\xB0\xAF\xE5\x8E\xBF                                  
 0002                   column=f2:phone, timestamp=1582837532912, value=16888888888       
 0002                   column=f2:say, timestamp=1582837532912, value=helloworld          
 0002                   column=f2:sex, timestamp=1582837532912, value=1                   
 0003                   column=f1:age, timestamp=1582837532912, value=\x00\x00\x00        
 0003                   column=f1:id, timestamp=1582837532912, value=\x00\x00\x00\x02     
 0003                   column=f1:name, timestamp=1582837532912, value=\xE5\x88\x98\xE5\xA
                        4\x87                                                             
 0003                   column=f2:address, timestamp=1582837532912, value=\xE5\xB9\xBD\xE5
                        \xB7\x9E\xE6\xB6\xBF\xE9\x83\xA1\xE6\xB6\xBF\xE5\x8E\xBF          
 0003                   column=f2:phone, timestamp=1582837532912, value=17888888888       
 0003                   column=f2:say, timestamp=1582837532912, value=talk is cheap , show
                         me the code                                                      
 0003                   column=f2:sex, timestamp=1582837532912, value=1                   
 0004                   column=f1:age, timestamp=1582837532912, value=\x00\x00\x00##       
 0004                   column=f1:id, timestamp=1582837532912, value=\x00\x00\x00\x03     
 0004                   column=f1:name, timestamp=1582837532912, value=\xE5\xAD\x99\xE6\x9
                        D\x83                                                             
 0004                   column=f2:address, timestamp=1582837532912, value=\xE4\xB8\x8B\xE9
                        \x82\xB3                                                          
 0004                   column=f2:phone, timestamp=1582837532912, value=12888888888       
 0004                   column=f2:say, timestamp=1582837532912, value=what are you \xE5\xB
                        C\x84\xE5\x95\xA5\xE5\x98\x9E\xEF\xBC\x81                         
 0004                   column=f2:sex, timestamp=1582837532912, value=1                   
 0005                   column=f1:age, timestamp=1582837532912, value=\x00\x00\x00\x1C    
 0005                   column=f1:id, timestamp=1582837532912, value=\x00\x00\x00\x04     
 0005                   column=f1:name, timestamp=1582837532912, value=\xE8\xAF\xB8\xE8\x9
                        1\x9B\xE4\xBA\xAE                                                 
 0005                   column=f2:address, timestamp=1582837532912, value=\xE5\x9B\x9B\xE5
                        \xB7\x9D\xE9\x9A\x86\xE4\xB8\xAD                                  
 0005                   column=f2:phone, timestamp=1582837532912, value=14888888888       
 0005                   column=f2:say, timestamp=1582837532912, value=\xE5\x87\xBA\xE5\xB8
                        \x88\xE8\xA1\xA8\xE4\xBD\xA0\xE8\x83\x8C\xE4\xBA\x86\xE5\x98\x9B  
 0005                   column=f2:sex, timestamp=1582837532912, value=1                   
 0006                   column=f1:age, timestamp=1582837532912, value=\x00\x00\x00\x1B    
 0006                   column=f1:id, timestamp=1582837532912, value=\x00\x00\x00\x05     
 0006                   column=f1:name, timestamp=1582837532912, value=\xE5\x8F\xB8\xE9\xA
                        9\xAC\xE6\x87\xBF                                                 
 0006                   column=f2:address, timestamp=1582837532912, value=\xE5\x93\xAA\xE9
                        \x87\x8C\xE4\xBA\xBA\xE6\x9C\x89\xE5\xBE\x85\xE8\x80\x83\xE7\xA9\x
                        B6                                                                
 0006                   column=f2:phone, timestamp=1582837532912, value=15888888888       
 0006                   column=f2:say, timestamp=1582837532912, value=\xE8\xB7\x9F\xE8\xAF
                        \xB8\xE8\x91\x9B\xE4\xBA\xAE\xE6\xAD\xBB\xE6\x8E\x90              
 0006                   column=f2:sex, timestamp=1582837532912, value=1                   
 0007                   column=f1:age, timestamp=1582837532912, value=\x00\x00\x00\x1C    
 0007                   column=f1:id, timestamp=1582837532912, value=\x00\x00\x00\x05     
 0007                   column=f1:name, timestamp=1582837532912, value=xiaobubu\xE2\x80\x9
                        4\xE5\x90\x95\xE5\xB8\x83                                         
 0007                   column=f2:address, timestamp=1582837532912, value=\xE5\x86\x85\xE8
                        \x92\x99\xE4\xBA\xBA                                              
 0007                   column=f2:phone, timestamp=1582837532912, value=15788888888       
 0007                   column=f2:say, timestamp=1582837532912, value=\xE8\xB2\x82\xE8\x9D
                        \x89\xE5\x8E\xBB\xE5\x93\xAA\xE4\xBA\x86                          
 0007                   column=f2:sex, timestamp=1582837532912, value=1                   
```

#### Get查询

- 按照rowkey进行查询，获取所有列的所有值
- 查询主键rowkey为0003的人

```java
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.Cell;
import org.apache.hadoop.hbase.CellUtil;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.*;
import org.apache.hadoop.hbase.util.Bytes;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class MyTestClass3 {
    //创建实例变量
    private Connection cone;
    private Table table1;
    private String tName="myuser";

    //建立连接,并获取要添加数据的表的Table对象
    @Before
    public void initTable() throws IOException {
        Configuration conf= HBaseConfiguration.create();
        conf.set("hbase.zookeeper.quorum","node01:2181,node02:2181,node03:2181");
        cone= ConnectionFactory.createConnection(conf);
        table1=cone.getTable(TableName.valueOf(tName));
    }
    @Test
    public void getData() throws IOException {
        //获取Get对象，指定要查询的rowkey（行范围）
        Get get1=new Get(Bytes.toBytes("0003"));
        //指定查询的列范围：
        get1.addFamily("f1".getBytes());  //查询f1列族的所有列
        get1.addColumn("f2".getBytes(),"phone".getBytes());  //查询f2列族的phone字段

        //获取Result对象
        Result rs=table1.get(get1);

        //获取查询结果的集合（每个单元格的集合）
        List<Cell> cells=rs.listCells();

        //遍历cells
        for(Cell c:cells){
            //获取某单元格的信息（所属列族，所属字段，所属行键，单元格的值）
            //这些信息通过CellUtil类的静态方法来获得
            //用字节数组把这些信息存起来，用于等下打印
            byte [] family_name= CellUtil.cloneFamily(c); //列族
            byte [] col_name=CellUtil.cloneQualifier(c);  //列名
            byte [] rowkey_name=CellUtil.cloneRow(c); //行键
            byte [] cell_value=CellUtil.cloneValue(c); //值

            //打印该单元格的信息
            System.out.print(Bytes.toString(family_name)+"\t");
            System.out.print(Bytes.toString(col_name)+"\t");
            System.out.print(Bytes.toString(rowkey_name)+"\t");
            //对字段名（列名）是的进行判断,age和id的值是int类型
            if("age".equals(Bytes.toString(col_name)) || "id".equals
               (Bytes.toString(col_name))){
                System.out.println(Bytes.toInt(cell_value));
            }else {
                System.out.println(Bytes.toString(cell_value));
            }
        }
    }

    @After
    public void closeResource() throws IOException {
        table1.close();
        cone.close();
    }
}
```

运行输出结果如下：

```shell
f1	age	0003	32
f1	id	0003	2
f1	name	0003	刘备
f2	phone	0003	17888888888
```





#### Scan查询1--没控制数据量

```java
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.Cell;
import org.apache.hadoop.hbase.CellUtil;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.*;
import org.apache.hadoop.hbase.util.Bytes;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class MyTestClass3 {
    //创建实例变量
    private Connection cone;
    private Table table1;
    private String tName="myuser";

    //建立连接,并获取要添加数据的表的Table对象
    @Before
    public void initTable() throws IOException {
        Configuration conf= HBaseConfiguration.create();
        conf.set("hbase.zookeeper.quorum","node01:2181,node02:2181,node03:2181");
        cone= ConnectionFactory.createConnection(conf);
        table1=cone.getTable(TableName.valueOf(tName));
    }
    @Test
    public void scanData() throws IOException {
        //获取Scan对象，没有指定startRow和stopRow,进行全表扫描
        Scan scan1=new Scan();
        //指定查询的列范围：
        scan1.addFamily("f1".getBytes());  //查询f1列族的所有列
        scan1.addColumn("f2".getBytes(),"phone".getBytes());  //查询f2列族的phone字段

        //获取ResultScanner对象,该对象有着表里所有的数据，是多条数据
        ResultScanner rsc=table1.getScanner(scan1);


        //遍历ResultScanner的每一条数据(一行)，每一条数据都都是封装在Result对象里了
        for(Result rs:rsc){
            //获取一条数据的单元格集合
            List<Cell> cells=rs.listCells();
            //遍历单元格集合
            for(Cell c:cells){
                byte [] family_name= CellUtil.cloneFamily(c); //列族
                byte [] col_name=CellUtil.cloneQualifier(c);  //列名
                byte [] rowkey_name=CellUtil.cloneRow(c); //行键
                byte [] cell_value=CellUtil.cloneValue(c); //值

                //打印该单元格的信息
                System.out.print(Bytes.toString(family_name)+"\t");
                System.out.print(Bytes.toString(col_name)+"\t");
                System.out.print(Bytes.toString(rowkey_name)+"\t");
                //对字段名（列名）是的进行判断,age和id的值是int类型
                if("age".equals(Bytes.toString(col_name)) || "id".equals
                   (Bytes.toString(col_name))){
                    System.out.println(Bytes.toInt(cell_value));
                }else {
                    System.out.println(Bytes.toString(cell_value));
                }
            }
        }
    }

    @After
    public void closeResource() throws IOException {
        table1.close();
        cone.close();
    }
}
```

运行输出结果如下：

```shell
f1	adress	00001	地球人
f1	age	00001	18
f1	id	00001	25
f1	name	00001	krystal
f1	age	0002	30
f1	id	0002	1
f1	name	0002	曹操
f2	phone	0002	16888888888
f1	age	0003	32
f1	id	0003	2
f1	name	0003	刘备
f2	phone	0003	17888888888
f1	age	0004	35
f1	id	0004	3
f1	name	0004	孙权
f2	phone	0004	12888888888
f1	age	0005	28
f1	id	0005	4
f1	name	0005	诸葛亮
f2	phone	0005	14888888888
f1	age	0006	27
f1	id	0006	5
f1	name	0006	司马懿
f2	phone	0006	15888888888
f1	age	0007	28
f1	id	0007	5
f1	name	0007	xiaobubu—吕布
f2	phone	0007	15788888888
```

#### Scan查询2--控制数据量

控制参数解释：

1. scan1.setCacheBlocks(true);如果该参数为true，表明我们客户端从HBase拉取数据过来后，会将这些数据放到缓存里，下一次客户端再次查询时，如果缓存里有需要的数据就不从HBase拉取数据了，缓存里没有才会去HBase拿数据

2. scan1.setCaching(3); 一次读取的最大数据量，以Result为单位

3. scan1.setBatch(2);控制一个Result中包含cell(单元格)的最大数量

   ![image-20200228064430264](hbase.assets/image-20200228064430264.png)

4. scan1.setMaxResultSize(1024);控制单次RPC操作拿到的结果集(Result集)的最大字节数。（客户端缓存的最大字节数）

5. scan1.setMaxVersions(2);获得每个cell的最新n个版本的值

```java
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.Cell;
import org.apache.hadoop.hbase.CellUtil;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.*;
import org.apache.hadoop.hbase.util.Bytes;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class MyTestClass3 {
    //创建实例变量
    private Connection cone;
    private Table table1;
    private String tName="myuser";

    //建立连接,并获取要添加数据的表的Table对象
    @Before
    public void initTable() throws IOException {
        Configuration conf= HBaseConfiguration.create();
        conf.set("hbase.zookeeper.quorum","node01:2181,node02:2181,node03:2181");
        cone= ConnectionFactory.createConnection(conf);
        table1=cone.getTable(TableName.valueOf(tName));
    }
    @Test
    public void scanData() throws IOException {
        //获取Scan对象，没有指定startRow和stopRow,进行全表扫描
        Scan scan1=new Scan();
        //指定查询的列范围：
        scan1.addFamily("f1".getBytes());  //查询f1列族的所有列
        scan1.addColumn("f2".getBytes(),"phone".getBytes());  //查询f2列族的phone字段

        //指定查询的行范围：
        scan1.setStartRow("0003".getBytes());
        scan1.setStopRow("0007".getBytes());

        //控制一次读取的数据量为3个result
        scan1.setCaching(3);
        //控制一个Result中包含cell(单元格)的最大数量
        scan1.setBatch(2);
        //将结果缓存
        scan1.setCacheBlocks(true);
        //控制单次RPC操作拿到的结果集(Result集)的最大大小
        scan1.setMaxResultSize(1024);
        //获得每个cell的最新n个版本的值
        scan1.setMaxVersions(2);

        //获取ResultScanner对象,该对象有着表里所有的数据，是多条数据
        ResultScanner rsc=table1.getScanner(scan1);


        //遍历ResultScanner的每一条数据(一行)，每一条数据都都是封装在Result对象里了
        for(Result rs:rsc){
            //获取一条数据的单元格集合
            List<Cell> cells=rs.listCells();
            //遍历单元格集合
            for(Cell c:cells){
                byte [] family_name= CellUtil.cloneFamily(c); //列族
                byte [] col_name=CellUtil.cloneQualifier(c);  //列名
                byte [] rowkey_name=CellUtil.cloneRow(c); //行键
                byte [] cell_value=CellUtil.cloneValue(c); //值

                //打印该单元格的信息
                System.out.print(Bytes.toString(family_name)+"\t");
                System.out.print(Bytes.toString(col_name)+"\t");
                System.out.print(Bytes.toString(rowkey_name)+"\t");
                //对字段名（列名）是的进行判断,age和id的值是int类型
                if("age".equals(Bytes.toString(col_name)) || "id".equals
                   (Bytes.toString(col_name))){
                    System.out.println(Bytes.toInt(cell_value));
                }else {
                    System.out.println(Bytes.toString(cell_value));
                }
            }
        }
    }

    @After
    public void closeResource() throws IOException {
        table1.close();
        cone.close();
    }
}

```

运行输出结果如下：

```shell
f1	age	0003	32
f1	id	0003	2
f1	name	0003	刘备
f2	phone	0003	17888888888
f1	age	0004	35
f1	id	0004	3
f1	name	0004	孙权
f2	phone	0004	12888888888
f1	age	0005	28
f1	id	0005	4
f1	name	0005	诸葛亮
f2	phone	0005	14888888888
f1	age	0006	27
f1	id	0006	5
f1	name	0006	司马懿
f2	phone	0006	15888888888
```

#### 拓展：JAVA比较器

java的比较器主要分为两种，第一种是实现Comparable接口的内部比较器，第二种是实现Comparator接口的外部比较器。

Comparabel接口的部分源码如下：

```java
public interface Comparable<T> {
    public int compareTo(T o);
}
```

Comparator接口的部分源码如下：

```java
public interface Comparator<T> {
    int compare(T o1, T o2);
}
```

###### 内部比较器--Comparable接口

Comparable接口位于java.lang包下。

当需要对某个类(可以是自己定义的)的对象进行排序时候，则需要实现Comparable这个接口，然后重写compareTo方法。我们的类实现这个接口和重写方法后，就可以使用Array.sort()对这个类的实例对象数组进行排序，或者使用Collection.sort对这个类的对象List集合进行排序。我们需要在compareTo方法里定义我们的排序规则。注意：自定义类的时候最好重写顶级父类Object的toString()方法。

案例1：内部比较器

```java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class Employee implements Comparable<Employee> { //这里记得要指定泛型
    private String name;
    private int id;
    private long salary;

    public Employee(String name, int id, long salary) {
        this.name = name;
        this.id = id;
        this.salary = salary;
    }

    @Override
    public int compareTo(Employee o) {
        if (this.salary > o.salary) {
            return (1);
        } else if (this.salary < o.salary) {
            return (-1);
        } else {
            return (0);
        }
    }
    //默认的toString()方法，调用顶级父类Object的toString()方法
//    @Override
//    public String toString() {
//        return super.toString();
//    }

    //super.toString()，父类Object的toString源码如下，该方法默认返回类名和hashCode相关信息
//    public String toString() {
//        return getClass().getName() + "@" + Integer.toHexString(hashCode());
//    }

    //重写toString()方法

    @Override
    public String toString() {
        return (this.name+"\t"+this.id+"\t"+this.salary);
    }
}

class RunClass {
    public static void main(String[] args) {
        Employee[] ems = {
                new Employee("zhansan", 23522, 20000),
                new Employee("lisi", 23436, 24000),
                new Employee("laowang", 235634, 10000)
        };
        System.out.println("===============使用Arrays.sort()来进行排序");
        //排序前
        for(Employee e:ems){
            System.out.println(e.toString());
        }
        Arrays.sort(ems);
        System.out.println("==============");
        //排序后
        for(Employee e:ems){
            System.out.println(e.toString());
        }

        System.out.println("===============使用Arrays.sort()来进行排序");
        List<Employee> myList=new ArrayList<Employee>();
        myList.add(new Employee("zhansan", 23522, 20000));
        myList.add(new Employee("lisi", 23436, 24000));
        myList.add(new Employee("lisi", 23436, 24000));
        //排序前
        for(Employee e:ems){
            System.out.println(e.toString());
        }
        Collections.sort(myList);
        System.out.println("==============");
        //排序后
        for(Employee e:ems){
            System.out.println(e.toString());
        }

    }
}
```

运行输出结果如下：

```java
===============使用Arrays.sort()来进行排序
zhansan	23522	20000
lisi	23436	24000
laowang	235634	10000
==============
laowang	235634	10000
zhansan	23522	20000
lisi	23436	24000
===============使用Arrays.sort()来进行排序
laowang	235634	10000
zhansan	23522	20000
lisi	23436	24000
==============
laowang	235634	10000
zhansan	23522	20000
lisi	23436	24000
```

###### 外部比较器--Comparator接口

Comparatro接口位于java.util包下。

Comparator接口是一个跟Comparable接口功能很相近的比较器。比较大的区别是，实现该接口的类一般是一个独立的类。详情看代码：

```java
import java.util.*;

class Employee{
    private String name;
    private int age;
    private long salary;
    public Employee(String name,int age,long salary){
        this.salary=salary;
        this.name=name;
        this.age=age;
    }

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }

    public long getSalary() {
        return salary;
    }

    @Override
    public String toString() {
        return this.name+"\t"+this.age+"\t"+this.salary;
    }
}
//创建年龄比较器：
class AgeComparator implements Comparator<Employee>{

    @Override
    public int compare(Employee o1, Employee o2) {
        if (o1.getAge()>o2.getAge()){
            return 1;
        }else if(o1.getAge()<o2.getAge()){
            return -1;
        }else {
            return 0;
        }
    }
}
//创建薪水比较器：
class SalaryComparator implements Comparator<Employee>{

    @Override
    public int compare(Employee o1, Employee o2) {
        if (o1.getSalary() > o2.getSalary()) {
            return 1;
        } else if (o1.getSalary() < o2.getSalary()) {
            return -1;
        } else {
            return 0;
        }
    }
}

class RunClass {
    public static void main(String[] args) {
        Employee[] ems = {
                new Employee("zhansan", 26, 30000),
                new Employee("lisi",14, 24000),
                new Employee("laowang",40, 10000)
        };
        System.out.println("===============使用薪水比较器来进行排序");
        //排序前
        for(Employee e:ems){
            System.out.println(e.toString());
        }
        Arrays.sort(ems,new SalaryComparator());  //使用薪水比较器进行排序
        System.out.println("==============");
        //排序后
        for(Employee e:ems){
            System.out.println(e.toString());
        }

        System.out.println("===============使用年龄比较器来进行排序");
        List<Employee> myList=new ArrayList<Employee>();
        myList.add(new Employee("zhansan", 23522, 20000));
        myList.add(new Employee("lisi", 23436, 24000));
        myList.add(new Employee("lisi", 23436, 24000));
        //排序前
        for(Employee e:ems){
            System.out.println(e.toString());
        }
        Collections.sort(myList,new AgeComparator()); //使用年龄比较器进行排序

        System.out.println("==============");
        //排序后
        for(Employee e:ems){
            System.out.println(e.toString());
        }

    }
}
```

运行输出结果如下：

```java
===============使用薪水比较器来进行排序
zhansan	26	30000
lisi	14	24000
laowang	40	10000
==============
laowang	40	10000
lisi	14	24000
zhansan	26	30000
===============使用年龄比较器来进行排序
laowang	40	10000
lisi	14	24000
zhansan	26	30000
==============
laowang	40	10000
lisi	14	24000
zhansan	26	30000
```

###### 内部与外部比较器的区别：

如果定义一个类的时候，没有考虑到排序的问题，即没有实现Comparable接口,那么就可以通过实现Comparator接口来来进行自定义排序。Comparator可以方便使用不同的排序规则，更加灵活一点。

#### HBase过滤器查询（难点）

##### HBase过滤器Filter

- 过滤器的作用是在服务端判断数据是否满足条件，然后只将满足条件的数据返回给客户端

- 过滤器的类型很多，但是可以分为两大类
  - ==比较过滤器==
  - ==专用过滤器==

##### Hbase比较过滤器的比较器（指定比较机制）：

从上面的java比较器学习中，可以发现，比较器就是一个提供排序和比较规则的东西。那么HBase的比较器搭配HBase过滤器使用，就是一个HBase的比较过滤器。

```java
BinaryComparator  按字节索引顺序比较指定字节数组，采用Bytes.compareTo(byte[])
BinaryPrefixComparator 跟前面相同，只是比较左端前缀的数据是否相同
NullComparator 判断给定的是否为空
BitComparator 按位比较
RegexStringComparator 提供一个正则的比较器，仅支持 EQUAL 和非EQUAL
SubstringComparator 判断提供的子串是否出现在中
```

上面代码块中的比较器的父类都是ByteArrayComparable类，ByteArrayComparable类的包的位置信息：org.apache.hadoop.hbase.filter.ByteArrayComparable。

ByteArrayComparable类实现了来自java的java.lang.Comparable接口。

![](hbase.assets/Image201911111059.png)

##### HBase过滤器的比较运算符：

通过比较器，我们就指定了过滤器的比较机制，有可能还欠一样东西，那就是比较运行符。比如说如果过滤器的比较器是BinaryComparator，那么过滤器就会通过字节索引顺序比较指定字节数组，然后我们的比较运算符是LESS，我们HBase就会查询到符合小于条件的那部分数据。

```java
LESS  <
LESS_OR_EQUAL <=
EQUAL =
NOT_EQUAL <>
GREATER_OR_EQUAL >=
GREATER >
NO_OP 排除所有
```

##### 比较过滤器CompareFilter

CompareFilter是一个比较过滤器，它的子类有：

1. ValueFilter  （列值过滤器）
2. QualifierFilter  （列过滤器）
3. DependentColunmFilter
4. FamilyFilter  （列族过滤器）
5. RowFilter (rowkey过滤器)

##### RowFilter--rowkey过滤器

案例需求：通过RowFilter过滤比rowKey 0003小的所有值出来。

```java
package com.jimmy.hbase01;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.Cell;
import org.apache.hadoop.hbase.CellUtil;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.*;
import org.apache.hadoop.hbase.filter.BinaryComparator;
import org.apache.hadoop.hbase.filter.CompareFilter;
import org.apache.hadoop.hbase.filter.RowFilter;
import org.apache.hadoop.hbase.util.Bytes;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.util.List;


public class MyRowFilter {
    private Connection cone;
    private Table t1;
    private String t_name = "myuser";

    @Before
    public void initTablel() throws IOException {
        Configuration conf = HBaseConfiguration.create();
        conf.set("hbase.zookeeper.quorum", "node01:2181,node02:2181,node03:2181");
        cone = ConnectionFactory.createConnection(conf);
        t1 = cone.getTable(TableName.valueOf(t_name));
    }

    @Test
    public void rowFilter() throws IOException {
        Scan sc = new Scan();
        //创建比较器对象
        BinaryComparator bComp = new BinaryComparator("0003".getBytes());
        //创建rowkey比较过滤器对象，并把比较器对象作为参数传进去
        //过滤掉rowkey比0003小的数据
        RowFilter rF = new RowFilter(CompareFilter.CompareOp.LESS, bComp); 
        //为Scan对象设置过滤器
        sc.setFilter(rF);
        //获取ResultScanner对象
        ResultScanner resultSc = t1.getScanner(sc);
        //遍历ResultScanner对象(对象里面是一个个的Result)
        System.out.println("family_name\t\tqualifier_name\t\trowkey\t\tvalue");
        for (Result i : resultSc) {
            List<Cell> cells = i.listCells();
            //遍历cells
            for (Cell j:cells){
                byte[] family_name= CellUtil.cloneFamily(j);
                byte[] qualifier_name=CellUtil.cloneQualifier(j);
                byte[] rowkey=CellUtil.cloneRow(j);
                byte[] value=CellUtil.cloneValue(j);
                System.out.print(Bytes.toString(family_name)+"\t\t\t\t");
                System.out.print(Bytes.toString(qualifier_name)+"\t\t\t\t");
                System.out.print(Bytes.toString(rowkey)+"\t\t\t\t");
                if("age".equals(Bytes.toString(qualifier_name)) || "id".equals
                   (Bytes.toString(qualifier_name))){
                    System.out.println(Bytes.toInt(value));
                }else {
                    System.out.println(Bytes.toString(value));
                }
            }
        }
    }

    @After
    public void closeResource() {
		t1.close();
        cone.close();
    }
}
```

运行输出结果如下：

```java
family_name		qualifier_name		rowkey		value
f1				adress				00001				地球人
f1				age				00001				18
f1				id				00001				25
f1				name				00001				krystal
f1				age				0002				30
f1				id				0002				1
f1				name				0002				曹操
f2				address				0002				沛国谯县
f2				phone				0002				16888888888
f2				say				0002				helloworld
f2				sex				0002				1
```



##### FamilyFilter--列族过滤器

案例需求：查询列族名包含f2的所有列族下面的数据

```JAVA
package com.jimmy.hbase01;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.Cell;
import org.apache.hadoop.hbase.CellUtil;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.*;
import org.apache.hadoop.hbase.filter.*;
import org.apache.hadoop.hbase.util.Bytes;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.util.List;


public class MyFilter {
    private Connection cone;
    private Table t1;
    private String t_name = "myuser";

    @Before
    public void initTablel() throws IOException {
        Configuration conf = HBaseConfiguration.create();
        conf.set("hbase.zookeeper.quorum", "node01:2181,node02:2181,node03:2181");
        cone = ConnectionFactory.createConnection(conf);
        t1 = cone.getTable(TableName.valueOf(t_name));
    }

    @Test
    public void fFilter() throws IOException {
        Scan sc = new Scan();
        //创建比较器对象
        SubstringComparator subC = new SubstringComparator("f2");
        //创建FamilyFilter比较过滤器对象，并把比较器对象作为参数传进去
        //查询包含子字符串f2的列族
        FamilyFilter fF = new FamilyFilter(CompareFilter.CompareOp.EQUAL, subC);
        //为Scan对象设置过滤器
        sc.setFilter(fF);
        //获取ResultScanner对象
        ResultScanner resultSc = t1.getScanner(sc);
        //遍历ResultScanner对象(对象里面是一个个的Result)
        System.out.println("family_name\t\tqualifier_name\t\trowkey\t\tvalue");
        for (Result i : resultSc) {
            List<Cell> cells = i.listCells();
            //遍历cells
            for (Cell j:cells){
                byte[] family_name= CellUtil.cloneFamily(j);
                byte[] qualifier_name=CellUtil.cloneQualifier(j);
                byte[] rowkey=CellUtil.cloneRow(j);
                byte[] value=CellUtil.cloneValue(j);
                System.out.print(Bytes.toString(family_name)+"\t\t\t\t");
                System.out.print(Bytes.toString(qualifier_name)+"\t\t\t\t");
                System.out.print(Bytes.toString(rowkey)+"\t\t\t\t");
                if("age".equals(Bytes.toString(qualifier_name)) || "id".equals
                   (Bytes.toString(qualifier_name))){
                    System.out.println(Bytes.toInt(value));
                }else {
                    System.out.println(Bytes.toString(value));
                }
            }
        }
    }

    @After
    public void closeResource() {

    }
}
```

运行输出结果如下：

```java
family_name		qualifier_name		rowkey		value
f2				address				0002				沛国谯县
f2				phone				0002				16888888888
f2				say				0002				helloworld
f2				sex				0002				1
f2				address				0003				幽州涿郡涿县
f2				phone				0003				17888888888
f2				say				0003				talk is cheap , show me the code
f2				sex				0003				1
f2				address				0004				下邳
f2				phone				0004				12888888888
f2				say				0004				what are you 弄啥嘞！
f2				sex				0004				1
f2				address				0005				四川隆中
f2				phone				0005				14888888888
f2				say				0005				出师表你背了嘛
f2				sex				0005				1
f2				address				0006				哪里人有待考究
f2				phone				0006				15888888888
f2				say				0006				跟诸葛亮死掐
f2				sex				0006				1
f2				address				0007				内蒙人
f2				phone				0007				15788888888
f2				say				0007				貂蝉去哪了
f2				sex				0007				1
```



##### QualifierFilter--列过滤器

案例需求：只查询列名包含`name`的列的值

```java
package com.jimmy.hbase01;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.Cell;
import org.apache.hadoop.hbase.CellUtil;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.*;
import org.apache.hadoop.hbase.filter.*;
import org.apache.hadoop.hbase.util.Bytes;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.util.List;


public class MyFilter {
    private Connection cone;
    private Table t1;
    private String t_name = "myuser";

    @Before
    public void initTablel() throws IOException {
        Configuration conf = HBaseConfiguration.create();
        conf.set("hbase.zookeeper.quorum", "node01:2181,node02:2181,node03:2181");
        cone = ConnectionFactory.createConnection(conf);
        t1 = cone.getTable(TableName.valueOf(t_name));
    }

    @Test
    public void qFilter() throws IOException {
        Scan sc = new Scan();
        //创建比较器对象
        SubstringComparator subC = new SubstringComparator("name");
        //创建QualifierFilter比较过滤器对象，并把比较器对象作为参数传进去
        QualifierFilter qF = new QualifierFilter(CompareFilter.CompareOp.EQUAL, subC);
        //为Scan对象设置过滤器
        sc.setFilter(qF);
        //获取ResultScanner对象
        ResultScanner resultSc = t1.getScanner(sc);
        //遍历ResultScanner对象(对象里面是一个个的Result)
        System.out.println("family_name\t\tqualifier_name\t\trowkey\t\tvalue");
        for (Result i : resultSc) {
            List<Cell> cells = i.listCells();
            //遍历cells
            for (Cell j:cells){
                byte[] family_name= CellUtil.cloneFamily(j);
                byte[] qualifier_name=CellUtil.cloneQualifier(j);
                byte[] rowkey=CellUtil.cloneRow(j);
                byte[] value=CellUtil.cloneValue(j);
                System.out.print(Bytes.toString(family_name)+"\t\t\t\t");
                System.out.print(Bytes.toString(qualifier_name)+"\t\t\t\t");
                System.out.print(Bytes.toString(rowkey)+"\t\t\t\t");
                if("age".equals(Bytes.toString(qualifier_name)) || "id".
                   equals(Bytes.toString(qualifier_name))){
                    System.out.println(Bytes.toInt(value));
                }else {
                    System.out.println(Bytes.toString(value));
                }
            }
        }
    }

    @After
    public void closeResource() {

    }
}

```

运行输出结果如下：

```java
family_name		qualifier_name		rowkey		value
f1				name				00001				krystal
f1				name				0002				曹操
f1				name				0003				刘备
f1				name				0004				孙权
f1				name				0005				诸葛亮
f1				name				0006				司马懿
f1				name				0007				xiaobubu—吕布
```



##### ValueFilter--列值过滤器

案例需求：查询所有列当中包含8的数据

```java
package com.jimmy.hbase01;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.Cell;
import org.apache.hadoop.hbase.CellUtil;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.*;
import org.apache.hadoop.hbase.filter.*;
import org.apache.hadoop.hbase.util.Bytes;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.util.List;


public class MyFilter {
    private Connection cone;
    private Table t1;
    private String t_name = "myuser";

    @Before
    public void initTablel() throws IOException {
        Configuration conf = HBaseConfiguration.create();
        conf.set("hbase.zookeeper.quorum", "node01:2181,node02:2181,node03:2181");
        cone = ConnectionFactory.createConnection(conf);
        t1 = cone.getTable(TableName.valueOf(t_name));
    }

    @Test
    public void vFilter() throws IOException {
        Scan sc = new Scan();
        //创建比较器对象
        SubstringComparator subC = new SubstringComparator("8");
        //创建ValueFilter比较过滤器对象，并把比较器对象作为参数传进去
        ValueFilter vF= new ValueFilter(CompareFilter.CompareOp.EQUAL, subC);
        //为Scan对象设置过滤器
        sc.setFilter(vF);
        //获取ResultScanner对象
        ResultScanner resultSc = t1.getScanner(sc);
        //遍历ResultScanner对象(对象里面是一个个的Result)
        System.out.println("family_name\t\tqualifier_name\t\trowkey\t\tvalue");
        for (Result i : resultSc) {
            List<Cell> cells = i.listCells();
            //遍历cells
            for (Cell j:cells){
                byte[] family_name= CellUtil.cloneFamily(j);
                byte[] qualifier_name=CellUtil.cloneQualifier(j);
                byte[] rowkey=CellUtil.cloneRow(j);
                byte[] value=CellUtil.cloneValue(j);
                System.out.print(Bytes.toString(family_name)+"\t\t\t\t");
                System.out.print(Bytes.toString(qualifier_name)+"\t\t\t\t");
                System.out.print(Bytes.toString(rowkey)+"\t\t\t\t");
                if("age".equals(Bytes.toString(qualifier_name)) || "id".
                   equals(Bytes.toString(qualifier_name))){
                    System.out.println(Bytes.toInt(value));
                }else {
                    System.out.println(Bytes.toString(value));
                }
            }
        }
    }

    @After
    public void closeResource() {

    }
}

```

运行输出结果如下：

```java
family_name		qualifier_name		rowkey		value
f2				phone				0002				16888888888
f2				phone				0003				17888888888
f2				phone				0004				12888888888
f2				phone				0005				14888888888
f2				phone				0006				15888888888
f2				phone				0007				15788888888
```



##### 专用过滤器使用

###### SingleColumnValueFilter--单列值过滤器

SingleColumnValueFilter会返回满足条件的cell的所在行的所有cell的值。经测试，貌似如果没有满足条件的cell就会返回所有行每一个cell的值。

案例需求：查询名字为刘备的数据

```java
package com.jimmy.hbase01;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.Cell;
import org.apache.hadoop.hbase.CellUtil;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.*;
import org.apache.hadoop.hbase.filter.*;
import org.apache.hadoop.hbase.util.Bytes;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.util.List;


public class MyFilter {
    private Connection cone;
    private Table t1;
    private String t_name = "myuser";

    @Before
    public void initTablel() throws IOException {
        Configuration conf = HBaseConfiguration.create();
        conf.set("hbase.zookeeper.quorum", "node01:2181,node02:2181,node03:2181");
        cone = ConnectionFactory.createConnection(conf);
        t1 = cone.getTable(TableName.valueOf(t_name));
    }

    @Test
    public void singleFilter() throws IOException {
        Scan sc = new Scan();
        SingleColumnValueFilter scvF=new SingleColumnValueFilter("f1".getBytes(),
                   "name".getBytes(), CompareFilter.CompareOp.EQUAL,"刘备".getBytes());
        //为Scan对象设置过滤器
        sc.setFilter(scvF);
        //获取ResultScanner对象
        ResultScanner resultSc = t1.getScanner(sc);
        //遍历ResultScanner对象(对象里面是一个个的Result)
        System.out.println("family_name\t\tqualifier_name\t\trowkey\t\tvalue");
        for (Result i : resultSc) {
            List<Cell> cells = i.listCells();
            //遍历cells
            for (Cell j:cells){
                byte[] family_name= CellUtil.cloneFamily(j);
                byte[] qualifier_name=CellUtil.cloneQualifier(j);
                byte[] rowkey=CellUtil.cloneRow(j);
                byte[] value=CellUtil.cloneValue(j);
                System.out.print(Bytes.toString(family_name)+"\t\t\t\t");
                System.out.print(Bytes.toString(qualifier_name)+"\t\t\t\t");
                System.out.print(Bytes.toString(rowkey)+"\t\t\t\t");
                if("age".equals(Bytes.toString(qualifier_name)) || "id".
                   equals(Bytes.toString(qualifier_name))){
                    System.out.println(Bytes.toInt(value));
                }else {
                    System.out.println(Bytes.toString(value));
                }
            }
        }
    }

    @After
    public void closeResource() {

    }
}

```

运行输出结果如下：

```java
family_name		qualifier_name		rowkey		value
f1				age				0003				32
f1				id				0003				2
f1				name				0003				刘备
f2				address				0003				幽州涿郡涿县
f2				phone				0003				17888888888
f2				say				0003				talk is cheap , show me the code
f2				sex				0003				1
```



###### SingleColumnValueExcludeFilter

SingleColumnValueExcludeFilter**与**SingleColumnValueFilter相反，会排除掉指定的列，其他的列全部返回

###### PrefixFilter--rowkey前缀过滤器

- 查询以00开头的所有前缀的rowkey

```java
package com.jimmy.hbase01;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.Cell;
import org.apache.hadoop.hbase.CellUtil;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.*;
import org.apache.hadoop.hbase.filter.*;
import org.apache.hadoop.hbase.util.Bytes;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.util.List;


public class MyFilter {
    private Connection cone;
    private Table t1;
    private String t_name = "myuser";

    @Before
    public void initTablel() throws IOException {
        Configuration conf = HBaseConfiguration.create();
        conf.set("hbase.zookeeper.quorum", "node01:2181,node02:2181,node03:2181");
        cone = ConnectionFactory.createConnection(conf);
        t1 = cone.getTable(TableName.valueOf(t_name));
    }

    @Test
    public void preRowFilter() throws IOException {
        Scan sc = new Scan();
        PrefixFilter pF=new PrefixFilter("00".getBytes());
        //为Scan对象设置过滤器
        sc.setFilter(pF);
        //获取ResultScanner对象
        ResultScanner resultSc = t1.getScanner(sc);
        //遍历ResultScanner对象(对象里面是一个个的Result)
        System.out.println("family_name\t\tqualifier_name\t\trowkey\t\tvalue");
        for (Result i : resultSc) {
            List<Cell> cells = i.listCells();
            //遍历cells
            for (Cell j:cells){
                byte[] family_name= CellUtil.cloneFamily(j);
                byte[] qualifier_name=CellUtil.cloneQualifier(j);
                byte[] rowkey=CellUtil.cloneRow(j);
                byte[] value=CellUtil.cloneValue(j);
                System.out.print(Bytes.toString(family_name)+"\t\t\t\t");
                System.out.print(Bytes.toString(qualifier_name)+"\t\t\t\t");
                System.out.print(Bytes.toString(rowkey)+"\t\t\t\t");
                if("age".equals(Bytes.toString(qualifier_name)) || "id".
                   equals(Bytes.toString(qualifier_name))){
                    System.out.println(Bytes.toInt(value));
                }else {
                    System.out.println(Bytes.toString(value));
                }
            }
        }
    }

    @After
    public void closeResource() {

    }
}

```

运行输出结果如下:

```java
family_name		qualifier_name		rowkey		value
f1				adress				00001				地球人
f1				age				00001				18
f1				id				00001				25
f1				name				00001				krystal
f1				age				0002				30
f1				id				0002				1
f1				name				0002				曹操
f2				address				0002				沛国谯县
f2				phone				0002				16888888888
f2				say				0002				helloworld
f2				sex				0002				1
f1				age				0003				32
f1				id				0003				2
f1				name				0003				刘备
f2				address				0003				幽州涿郡涿县
f2				phone				0003				17888888888
f2				say				0003				talk is cheap , show me the code
f2				sex				0003				1
f1				age				0004				35
f1				id				0004				3
f1				name				0004				孙权
f2				address				0004				下邳
f2				phone				0004				12888888888
f2				say				0004				what are you 弄啥嘞！
f2				sex				0004				1
f1				age				0005				28
f1				id				0005				4
f1				name				0005				诸葛亮
f2				address				0005				四川隆中
f2				phone				0005				14888888888
f2				say				0005				出师表你背了嘛
f2				sex				0005				1
f1				age				0006				27
f1				id				0006				5
f1				name				0006				司马懿
f2				address				0006				哪里人有待考究
f2				phone				0006				15888888888
f2				say				0006				跟诸葛亮死掐
f2				sex				0006				1
f1				age				0007				28
f1				id				0007				5
f1				name				0007				xiaobubu—吕布
f2				address				0007				内蒙人
f2				phone				0007				15788888888
f2				say				0007				貂蝉去哪了
f2				sex				0007				1
```



###### PageFilter--分页过滤器

什么叫分页？我们先来看一下百度的分页：

![image-20200301054024321](hbase.assets/image-20200301054024321.png)

在HBase当中，也是存在着分页的。

示例：假如每2行作为一页，那么就会按照下图进行分页。如果要访问第一页的数据，那么直接设置过滤器，从表的第一行开始访问，访问一个页的大小（2行）的数据即可。但是如果要访问中间页数的数据，比如说第3页的数据，那么首先要获取第3页的起始行键（即第5行），然后设置过滤器进行访问一个页大小的数据。

怎么知道第5行是第3页的其实行键？5=（3-1）*2+1，3是第几页，2是每页的行数。

<img src="hbase.assets/image-20200302145240373.png" alt="image-20200302145240373" style="zoom: 67%;" />

案例：通过pageFilter实现分页过滤器

```java
package com.jimmy.hbase01;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.Cell;
import org.apache.hadoop.hbase.CellUtil;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.*;
import org.apache.hadoop.hbase.filter.*;
import org.apache.hadoop.hbase.util.Bytes;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;


public class MyFilter {
    private Connection cone;
    private Table t1;
    private String t_name = "myuser";


    @Before
    public void initTablel() throws IOException {
        Configuration conf = HBaseConfiguration.create();
        conf.set("hbase.zookeeper.quorum", "node01:2181,node02:2181,node03:2181");
        cone = ConnectionFactory.createConnection(conf);
        t1 = cone.getTable(TableName.valueOf(t_name));
    }

    private int pageNum=3; //设置要读取第几页的数据
    private int pageSize=2;//设置每页有多少条数据
    @Test
    public void rowFilter() throws IOException {
        Scan sc=new Scan();
        if(pageNum==1){
            //设置一次RPC拿到的最大数据量
            sc.setMaxResultSize(pageSize);
            //设置第一页的起始行键,hbase的默认开始行键是""
            sc.setStartRow("".getBytes());
            //获取过滤器对象，并设置要读取的行数（pageSize)
            // public PageFilter(final long pageSize)
            PageFilter pageF=new PageFilter(pageSize);
            //设置过滤器
            sc.setFilter(pageF);
            //打印
            hbaseU.printResult(t1,sc);
        }else{
            //假如访问第3页，知道了要从第5行开始读取数据
            //但是我们还不知道第5行的行键名称，这时候就要获取行键信息
            String startRow="";
//          sc.setStartRow("".getBytes()); 
            //上面这行可以不用写，如果不指定startRow， 默认从第一行开始读取
            int scanDatas=(pageNum-1)*pageSize+1;
            sc.setMaxResultSize(scanDatas);
            PageFilter pageF=new PageFilter(scanDatas);
            sc.setFilter(pageF);
            ResultScanner rScanner=t1.getScanner(sc);
            for (Result rs:rScanner){
                byte[]row=rs.getRow(); //获取rowkey数组
                startRow=Bytes.toString(row);
                //循环遍历获取的数组，最后一条数据的rowkey就是我们需要的起始rowkey
            }
            //获取rowkey名称后，开始读取第三页的数据
            sc.setStartRow(startRow.getBytes());
            sc.setMaxResultSize(pageSize); //设置我们要扫描多少条数据
            PageFilter pageF2=new PageFilter(pageSize);
            sc.setFilter(pageF2);
            hbaseU.printResult(t1,sc);
        }

    }

    @After
    public void closeResource() {
        
    }
}
```

```java
package com.jimmy.hbase01;

import org.apache.hadoop.hbase.Cell;
import org.apache.hadoop.hbase.CellUtil;
import org.apache.hadoop.hbase.client.Result;
import org.apache.hadoop.hbase.client.ResultScanner;
import org.apache.hadoop.hbase.client.Scan;
import org.apache.hadoop.hbase.client.Table;
import org.apache.hadoop.hbase.util.Bytes;

import java.io.IOException;
import java.util.List;

public class hbaseU{
    public static void printResult(Table t1, Scan sc) throws IOException {
        //获取ResultScanner对象
        ResultScanner resultSc = t1.getScanner(sc);
        //遍历ResultScanner对象(对象里面是一个个的Result)
        System.out.println("family_name\t\tqualifier_name\t\trowkey\t\tvalue");
        for (Result i : resultSc) {
            List<Cell> cells = i.listCells();
            //遍历cells
            for (Cell j:cells){
                byte[] family_name= CellUtil.cloneFamily(j);
                byte[] qualifier_name=CellUtil.cloneQualifier(j);
                byte[] rowkey=CellUtil.cloneRow(j);
                byte[] value=CellUtil.cloneValue(j);
                System.out.print(Bytes.toString(family_name)+"\t\t\t\t");
                System.out.print(Bytes.toString(qualifier_name)+"\t\t\t\t");
                System.out.print(Bytes.toString(rowkey)+"\t\t\t\t");
                if("age".equals(Bytes.toString(qualifier_name)) || "id".
                        equals(Bytes.toString(qualifier_name))){
                    System.out.println(Bytes.toInt(value));
                }else {
                    System.out.println(Bytes.toString(value));
                }
            }
        }
    }

}

```

运行输出结果如下：

```java
family_name		qualifier_name		rowkey		value
f1				age				0005				28
f1				id				0005				4
f1				name				0005				诸葛亮
f2				address				0005				四川隆中
f2				phone				0005				14888888888
f2				say				0005				出师表你背了嘛
f2				sex				0005				1
f1				age				0006				27
f1				id				0006				5
f1				name				0006				司马懿
f2				address				0006				哪里人有待考究
f2				phone				0006				15888888888
f2				say				0006				跟诸葛亮死掐
f2				sex				0006				1
```

##### 多过滤器综合查询FilterList

需求：使用SingleColumnValueFilter查询f1列族，name为刘备的数据，并且同时满足rowkey的前缀以00开头的数据（PrefixFilter）

```java
//创建过滤器列表FilterList即可实现多个过滤器综合查询
@Test
public  void filterList() throws IOException {
    Scan scan = new Scan();
    SingleColumnValueFilter singleColumnValueFilter = new SingleColumnValueFilter
("f1".getBytes(), "name".getBytes(), CompareFilter.CompareOp.EQUAL, "刘备".getBytes());
    PrefixFilter prefixFilter = new PrefixFilter("00".getBytes());
    FilterList filterList = new FilterList();
    filterList.addFilter(singleColumnValueFilter);
    filterList.addFilter(prefixFilter);
    scan.setFilter(filterList);
    ResultScanner scanner = table.getScanner(scan);
    printlReult(scanner);}
```

#### HBase的删除操作

##### 根据rowkey删除数据

- 删除rowkey为003的数据

```java
    @Test
    public void DeleteData() throws IOException {
        Delete d1=new Delete("0003".getBytes());
        t1.delete(d1);
    }
```

##### 删除表

```java
package com.jimmy.hbase01;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.*;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import java.io.IOException;

public class MyFilter {
    private Connection cone;
    private Table t1;
    private String t_name = "myuser";


    @Before
    public void initTablel() throws IOException {
        Configuration conf = HBaseConfiguration.create();
        conf.set("hbase.zookeeper.quorum", "node01:2181,node02:2181,node03:2181");
        cone = ConnectionFactory.createConnection(conf);
        t1 = cone.getTable(TableName.valueOf(t_name));
    }

    @Test
    public void DeleteData() throws IOException {
        //获取admin对象，用于表的删除
        Admin am=cone.getAdmin();
        //禁用表
        am.disableTable(TableName.valueOf(t_name));
        //删除表
        am.deleteTable(TableName.valueOf(t_name));
    }

    @After
    public void closeResource() throws IOException {
        t1.close();
        cone.close();
    }
}
```



## HBase的数据存储原理

![image-20200303015726371](hbase.assets/image-20200303015726371.png)

1. Hbase有多个Hregionserver，是专门用于保存数据的节点。每个regionserver主要由3部分组成：Hlog,bockcache,region。region可以有多个，用于保存表的部分数据，并且一个region只会保存一个表的数据。
2. 假如client进行操作：create 'user','info','data',有两个列族。那么会在Hlog上记录操作信息，并在这个表对应的region就会产生两个store文件，分别用来存储两个不同列族的数据。有多少个列族就会有多少个store。
3. 每一个store里面都有一个memstore，memstore是一块内存区域，写入的数据会写入里面进行缓冲，再把数据刷到磁盘。
4. 当client进行写入数据时，比如进行 put 'user','rk0001','info:age',18等操作。首先会在Hlog记录操作，然后往对应的memstore写入数据。每当memstore写满128m，都会将数据溢写到storeFile中。因此可能会产生多个storeFile。storeFile最终存储到HDFS文件系统中，作为HFile文件。StoreFile其实是HFile的抽象对象，可说store等于HFile。每次memstore刷写数据到磁盘，都会生成对应的一个新的HFile文件。

![region](hbase.assets/region.png)



## HBase建表流程

<img src="hbase.assets/image-20200303133100858.png" alt="image-20200303133100858" style="zoom:67%;" />

1. client进行RPC调用HMaster，说要创建表'myuser'。
2. HMaster收到信息后，根据HRegionServer的心跳汇报的磁盘使用等情况，决定表的第一个region放在哪个HRegionServer节点，然后告知该节点创建region。
3. HBase有个叫做hbase:meta的表，这个表专门用于存储整个hbase集群中有哪些表，每个表有哪些region,每个region的rowkey范围（region中的数据是按照rowkey进行排序的），这些region存在哪些HRegionServer节点上。
4. 既然hbase meta表存储着每个表和region的相关信息，那么HMaster在刚才'myuser'表的region创建好后，就会跟zookeeper进行通信，获得hbase meta表在哪个HregionServer节点的信息，HMaster收到响应后，就往hbase meta表写入'myuser'的表和region的相关元数据信息。
5. ------------上面就是建表的主要流程，接下来简单看一下client查询表的流程。-------------
6. client要查询数据，如进行get操作。那么client先与zookeeper进行通信，获得Hbase meta表的位置，然后跟hbase meta表所在的HregionServer节点进行通信，HregionServer返回要查询的表的元数据信息给客户端。
7. 客户端收到表的region位置等信息后，开始跟从对应的HregionServer查询数据。

```sh
[zk: node01:2181,node02:2181,node03:2181(CONNECTED) 2] ls /hbase
[replication, meta-region-server, rs, splitWAL, backup-masters, table-lock, flush-table-proc, region-in-transition, online-snapshot, master, running, recovering-regions, draining, namespace, hbaseid, table]
[zk: node01:2181,node02:2181,node03:2181(CONNECTED) 3] get /hbase/meta-region-server
�regionserver:60020͇����ĬPBUF

node03�������.
cZxid = 0xb0000009b
ctime = Tue Mar 03 13:35:42 CST 2020
mZxid = 0xb0000009b
mtime = Tue Mar 03 13:35:42 CST 2020
pZxid = 0xb0000009b
cversion = 0
dataVersion = 0
aclVersion = 0
ephemeralOwner = 0x0
dataLength = 60
numChildren = 0
```



## HBase读数据流程

![image-20200303153349193](hbase.assets/image-20200303153349193.png)

> 说明：HBase集群，只有一张meta表，此表只有一个region，该region数据保存在一个HRegionServer上

HBase读数据详细流程:

1、客户端首先与zk进行连接；从zk找到meta表的region位置，即meta表的数据存储在某一HRegionServer上；客户端与此HRegionServer建立连接，然后读取meta表中的数据；meta表中存储了所有用户表的region信息，我们可以通过scan 'hbase:meta'来查看meta表信息

2、根据要查询的namespace、表名和rowkey信息。找到写入数据对应的region信息

3、找到这个region对应的regionServer，然后发送请求

4、查找并定位到对应的region

5、先从memstore查找数据，如果没有，再从BlockCache上读取。

6、如果BlockCache中也没有找到，再到StoreFile(HFile)上进行读取

7、从storeFile中读取到数据之后，不是直接把结果数据返回给客户端，而是把数据先写入到BlockCache中，目的是为了加快后续的查询；然后在返回结果给客户端。

补充：

HBase上Regionserver的内存分为两个部分

* 一部分作为Memstore，主要用来写；
* 另一部分作为BlockCache，主要用于读数据；



## HBase写数据流程

![image-20200303140520209](hbase.assets/image-20200303140520209.png)

![image-20200303015726371](hbase.assets/image-20200303015726371-1610882044630.png)

Hbase写数据详细流程：

1. 假如客户端进行写操作：put 'user', 'rk0001', 'data:passwd', '123456'。client首先与zookeeper通信找到meta表的region位置。
2. client从对应的HregionServer节点读取meta表中的数据，根据namespace、表名和rowkey信息获得要往哪个region写入数据，这个region存在在哪个HregionServer节点等信息。
3. 找到这个region对应的regionServer，然后发送请求
4. 把数据分别写到HLog（write ahead log）和memstore各一份
5. memstore达到阈值后把数据刷到磁盘，生成storeFile文件。storeFile文件数目达到一定阈值后，会发出一个操作，将多个小的storeFile合并成一个大的storeFile。
6. storeFile作为HFile存到hdfs中，默认情况下，每隔7天，会将store下的HFile合并成一个达到HFile。
7. 删除HLog中的历史数据

补充：

```sh
1、HLog（write ahead log）：
	也称为WAL意为Write ahead log，即预写日志，类似mysql中的binlog,用来做灾难恢复时用，
	HLog记录数据的所有变更,一旦数据修改，就可以从log中进行恢复。
2、触发大合并的时候会对数据进行溢写清理:
	delete的数据会被删除
	cell存在最大版本数，超过最大版本数的老数据会被删除
	建表的时候可以指定列族和列的数据有效期ttl(time to live),超过有效期的数据会被删除
	
3、如果管理员想要释放磁盘空间的话，可以执行大文件合并。
	大文件合并，会占用的资源很多，会影响线上的正常业务的执行。
	一般会将大文件合并的自动启动关闭。
	一般是进行人为的文件大合并，并且是找一个空闲的时间来触发，比如午夜。
4、在合并之前，删除的数据、ttl到期的数据、超过版本数的数据都还存储在文件中
	这些待定删除的数据被打了一个墓碑标记tomb,查询的时候，这些数据默认是不会被查询出来
	如果要查询这些待删除的数据，可使用get...{RAW=>true}方法
5、删除、更新等操作也看出是写操作
	如delete 'user','rk0001','info:age'，流程跟上面的写流程基本一样。
	也会向Hlog和memstore写数据，并做了标记，如type='delete'.
	删除和更新的操作在大合并的时候才会正式生效。
6、往memstore写入数据的时候，是异步的。
	当数据写入memstore完成后，会立即向客户端响应完成，并不需要等待flush到storeFile。
7、不断写入数据，那么region也会不断变大。
	当region达到一定大小时，region会下线，然后一分为二(如region01,region02)，再上线。
	HMaster控制着region的迁移，可能会将region02迁移到其它的HregionServer节点。
	region迁移后，对应的HFile也会指向新的位置。
8、blockcache是一个内存空间，用于缓存block数据，加快查询速度
```



## HBase的flush机制

![](hbase.assets/hbase-split-compaction.png)

#### Flush触发条件

##### memstore级别限制

当Region中任意一个MemStore的大小达到了上限（hbase.hregion.memstore.flush.size，默认128MB），会触发Memstore刷新。

```xml
<property>
	<name>hbase.hregion.memstore.flush.size</name>
	<value>134217728</value>
</property>
```

  ##### region级别限制

当Region中所有Memstore的大小总和达到了上限（hbase.hregion.memstore.block.multiplier * hbase.hregion.memstore.flush.size，默认 2* 128M = 256M），会触发memstore刷新。

因此，企业中，一张表一般不适用过多的列族，通常使用一两个列族，如果列族过多会导致Memstore过多，从而Memstore的大小总和过快达到上限，从而频繁flush。

比如说某个表有5个列族，那么该表的region就会有5个对应的memstore,假如memstore1大小为40M，memstore2大小为50M，memstore3大小为40M，memstore4为80M，memstore5为50M，那么5个memstore已经超过256M，会触发flush，但是可看到很多Memstore还远没有达到128M就会开始进行flush，这样会导致flush过于频繁。

```xml
<property>
	<name>hbase.hregion.memstore.flush.size</name>
	<value>134217728</value>
</property>
<property>
	<name>hbase.hregion.memstore.block.multiplier</name>
	<value>2</value>
</property>   
```

##### Region Server级别限制

<img src="hbase.assets/image-20200303175749870.png" alt="image-20200303175749870" style="zoom:67%;" />

1. 低水位阈值：hbase.regionserver.global.memstore.size.lower.limit*hbase.regionserver.global.memstore.size
2. 高水位阈值：hbase.regionserver.global.memstore.size
3. 当一个Region Server中所有Memstore的大小总和超过低水位阈值,RegionServer开始强制flush。先Flush Memstore最大的Region，再执行次大的，依次执行；
4. 如果写入速度大于flush写出的速度，导致总MemStore大小超过高水位阈值（默认为JVM内存的40%），此时RegionServer会阻塞更新并强制执行flush，直到总MemStore大小低于低水位阈值

```xml
<property>
	<name>hbase.regionserver.global.memstore.size.lower.limit</name>
	<value>0.95</value>  <!--默认为0.95-->
</property>
<property>
	<name>hbase.regionserver.global.memstore.size</name>
	<value>0.4</value>  <!--默认为JVM内存的40%-->
</property>
```

##### HLog数量上限

当一个Region Server中HLog数量达到上限（可通过参数hbase.regionserver.maxlogs配置）时，系统会选取最早的一个HLog对应的一个或多个Region进行flush

##### 定期刷新Memstore

默认周期为1小时，确保Memstore不会长时间没有持久化。为避免所有的MemStore在同一时间都进行flush导致的问题，定期的flush操作有20000左右的随机延时。

##### 手动flush

用户可以通过shell命令flush ‘tablename’或者flush ‘region name’分别对一个表或者一个Region进行flush。

#### flush的流程

<img src="hbase.assets/image-20200303193630021.png" alt="image-20200303193630021" style="zoom:67%;" />

为了减少flush过程对读写的影响，将整个flush过程分为三个阶段：

- prepare阶段：遍历当前Region中所有的Memstore，将Memstore中当前数据集CellSkipListSet做一个**快照snapshot**；然后再新建一个CellSkipListSet。后期写入的数据都会写入新的CellSkipListSet中。prepare阶段需要加一把updateLock对**写请求阻塞**，结束之后会释放该锁。因为此阶段没有任何费时操作，因此持锁时间很短。

- flush阶段：遍历所有Memstore，将prepare阶段生成的snapshot持久化为**临时文件**，临时文件会统一放到目录.tmp下。这个过程因为涉及到磁盘IO操作，因此相对比较耗时。
- commit阶段：遍历所有Memstore，将flush阶段生成的临时文件移到指定的ColumnFamily列族目录下，针对HFile生成对应的storefile和Reader，把storefile添加到HStore的storefiles列表中，最后再**清空**prepare阶段生成的snapshot。



## HBase的Compact合并机制

hbase为了==防止小文件过多==，以保证查询效率，hbase需要在必要的时候将这些小的store file合并成相对较大的store file，这个过程就称之为compaction。

在hbase中主要存在两种类型的compaction合并

- **==minor compaction 小合并==**
- **==major compaction 大合并==**

##### minor compaction 小合并

- 在将Store中多个HFile合并为一个HFile

  在这个过程中会选取一些小的、相邻的StoreFile将他们合并成一个更大的StoreFile，对于超过了TTL的数据、更新的数据、删除的数据仅仅只是做了标记。并没有进行物理删除，一次Minor Compaction的结果是更少并且更大的StoreFile。这种合并的触发频率很高。

- minor compaction触发条件由以下几个参数共同决定：

~~~xml
<!--表示至少需要三个满足条件的store file时，minor compaction才会启动-->
<property>
	<name>hbase.hstore.compactionThreshold</name>
	<value>3</value>
</property>

<!--表示一次minor compaction中最多选取10个store file-->
<property>
	<name>hbase.hstore.compaction.max</name>
	<value>10</value>
</property>

<!--默认值为128m,
表示文件大小小于该值的store file 一定会加入到minor compaction的合并队列中
-->
<property>
	<name>hbase.hstore.compaction.min.size</name>
	<value>134217728</value>
</property>

<!--默认值为LONG.MAX_VALUE，
表示文件大小大于该值的store file 一定会被minor compaction排除-->
<property>
	<name>hbase.hstore.compaction.max.size</name>
	<value>9223372036854775807</value>
</property>
~~~

##### major compaction 大合并

* 合并Store中所有的HFile为一个HFile

  将所有的StoreFile合并成一个StoreFile，这个过程还会清理三类无意义数据：被删除的数据、TTL过期数据、版本号超过设定版本号的数据。合并频率比较低，默认**7天**执行一次，并且性能消耗非常大，建议生产关闭(设置为0)，在应用空闲时间手动触发。一般可以是手动控制进行合并，防止出现在业务高峰期。

* major compaction触发时间条件

  ~~~xml
  <!--默认值为7天进行一次大合并，-->
  <property>
  	<name>hbase.hregion.majorcompaction</name>
  	<value>604800000</value>
  </property>
  ~~~

* 手动触发

  ~~~ruby
  ##使用major_compact命令
  major_compact tableName
  ~~~





## HBase表的预分区

当一个table刚被创建的时候，Hbase默认的分配一个region给table。也就是说这个时候，所有的读写请求都会访问到同一个regionServer的同一个region中，这个时候就达不到负载均衡的效果了，集群中的其他regionServer就可能会处于比较空闲的状态。

解决这个问题可以用**pre-splitting**,在创建table的时候就配置好，生成多个region。

#### 为何要预分区？

* 增加数据读写效率
* 负载均衡，防止数据倾斜
* 方便集群容灾调度region
* 优化Map数量

#### 预分区原理

每一个region维护着startRow与endRowKey，如果加入的数据符合某个region维护的rowKey范围，则该数据交给这个region维护。

#### 手动指定预分区

###### 第一种方式

~~~ruby
create 'person4','info1','info2',SPLITS => ['1000','2000','3000','4000']
~~~

![image-20200303234203452](hbase.assets/image-20200303234203452.png)

###### 第二种方式

把分区规则创建于文 件中

~~~shell
cd /kkb/install

vim split.txt
aaa
bbb
ccc
ddd
~~~

~~~ruby
create 'student','info',SPLITS_FILE => '/kkb/install/split.txt'
~~~

![image-20200304004041457](hbase.assets/image-20200304004041457.png)	

###### 第二种方式：HexStringSplit 算法

HexStringSplit会将数据从“00000000”到“FFFFFFFF”之间的数据长度按照**n等分**之后算出每一段的其实rowkey和结束rowkey，以此作为拆分点。F代表16。

```ruby
create 'mytable', 'base_info',' extra_info',
	{NUMREGIONS => 15, SPLITALGO => 'HexStringSplit'}
```

![image-20200304004604791](hbase.assets/image-20200304004604791.png)



## region 合并

Region的合并不是为了性能,  而是出于维护的目的。比如删除了大量的数据 ,这个时候每个Region都变得很小 ,存储多个Region就浪费了 ,这个时候可以把Region合并起来，进而可以减少一些Region服务器节点 

##### 通过Merge类冷合并Region

执行冷合并前，需要先关闭hbase集群

<img src="hbase.assets/image-20200304005038768.png" alt="image-20200304005038768" style="zoom:67%;" />

需求：把上图的mytable表中的红色圈中的2个region数据进行合并：

```
mytable,33333333,1583253866373.f85b459590423c9e9d5f29ea5fb23330.
mytable,66666666,1583253866373.6af63a7d0706f8e769ddeb71c7cea5a2.
```

这里通过org.apache.hadoop.hbase.util.Merge类来实现，**不需要**进入hbase shell（需关闭hbase)

```sh
[hadoop@node01 ~]$ hbase org.apache.hadoop.hbase.util.Merge 
	mytable mytable,33333333,1583253866373.f85b459590423c9e9d5f29ea5fb23330. 
	mytable,66666666,1583253866373.6af63a7d0706f8e769ddeb71c7cea5a2.
```

查看Web界面

![image-20200304010107932](hbase.assets/image-20200304010107932.png)



##### 通过online_merge热合并Region

热合并不需要关闭hbase集群，在线进行合并

与冷合并不同的是，online_merge的传参是Region的hash值，而Region的hash值就是Region名称的最后那段在两个.之间的字符串部分。

<img src="hbase.assets/image-20200304010452038.png" alt="image-20200304010452038" style="zoom: 100%;" />

需求：需要上图student表中的2个region数据进行合并

```ruby
hbase(main):002:0> merge_region 'dcd55c9012c34576d3174b3330f9fbd5',
	'e7266b717cbaa203da9bd69462db625b'
```

查看Web界面

![image-20200304010837262](hbase.assets/image-20200304010837262.png)



## region的切分策略

- region中存储的是一张表的数据，当region中的数据条数过多的时候，会直接影响查询效率.
- 当region过大的时候，hbase会将region拆分为两个region , 这也是Hbase的一个优点 .
- HBase的region split策略一共有以下6种：

#### ConstantSizeRegionSplitPolicy

- 0.94版本前，HBase region的默认切分策略

- 当region中**最大的store**大小超过某个阈值(hbase.hregion.max.filesize=10G)之后就会触发切分，一个region等分为2个region。
- 但是在生产线上这种切分策略却有相当大的弊端：
  - 切分策略对于大表和小表没有明显的区分。
  - 阈值(hbase.hregion.max.filesize)设置较大对大表比较友好，但是小表就有可能不会触发分裂，极端情况下可能就1个，形成热点，这对业务来说并不是什么好事。
  - 如果设置较小则对小表友好，但一个大表就会在整个集群产生大量的region，这对于集群的管理、资源使用、failover来说都不是一件好事。


#### IncreasingToUpperBoundRegionSplitPolicy

- 0.94版本~2.0版本默认切分策略

- 总体看和ConstantSizeRegionSplitPolicy思路相同

  - 一个region中最大的store大小大于设置阈值就会触发切分。
  - 但是这个阈值并不像ConstantSizeRegionSplitPolicy是一个固定的值，而是会在一定条件下不断调整，调整规则和region所属表在当前regionserver上的region个数有关系.

- region split阈值的计算公式是：

  - 设regioncount：是region所属表在当前regionserver上的region的个数

  - 阈值 = regioncount^3 * 128M * 2，当然阈值并不会无限增长，最大不超过MaxRegionFileSize（10G）；当region中最大的store的大小达到该阈值的时候进行region split

  - 例如：
    第一次split阈值 = 1^3 * 256 = 256MB 
    第二次split阈值 = 2^3 * 256 = 2048MB 
    第三次split阈值 = 3^3 * 256 = 6912MB 
    第四次split阈值 = 4^3 * 256 = 16384MB > 10GB，因此取较小的值10GB 
    后面每次split的size都是10GB了

  - 特点

    - 相比ConstantSizeRegionSplitPolicy，可以自适应大表、小表；
    - 在集群规模比较大的情况下，对大表的表现比较优秀
    - 但是，它并不完美，小表可能产生大量的小region，分散在各regionserver上

#### SteppingSplitPolicy

- 2.0版本默认切分策略
- 相比 IncreasingToUpperBoundRegionSplitPolicy 简单了一些
- region切分的阈值依然和待分裂region所属表在当前regionserver上的region个数有关系
  - 如果region个数等于1，切分阈值为flush size 128M * 2
  - 否则为MaxRegionFileSize。
- 这种切分策略对于大集群中的大表、小表会比 IncreasingToUpperBoundRegionSplitPolicy 更加友好，小表不会再产生大量的小region，而是适可而止。

#### KeyPrefixRegionSplitPolicy

  - 根据rowKey的前缀对数据进行分区，这里是指定rowKey的前多少位作为前缀，比如rowKey都是16位的，指定前5位是前缀，那么前5位相同的rowKey在相同的region中。

#### DelimitedKeyPrefixRegionSplitPolicy

  - 保证相同前缀的数据在同一个region中，例如rowKey的格式为：userid_eventtype_eventid，指定的分隔符delimiter为 _ ，则split的的时候会确保userid相同的数据在同一个region中。


#### DisabledRegionSplitPolicy

  * 不启用自动拆分, 需要指定手动拆分

## HBase集成MapReduce（重点 难点）

HBase表中的数据最终都是存储在HDFS上，HBase天生的支持MR的操作，我们可以通过MR直接处理HBase表中的数据，并且MR可以将处理后的结果直接存储到HBase表中。

参考地址：<http://hbase.apache.org/book.html#mapreduce>

#### 实战一：HBase表-->HBase表

##### 实战需求

读取HBase当中myuser这张表的f1:name、f1:age数据，将数据写入到另外一张myuser2表的f1列族里面去。

<img src="hbase.assets/image-20200304023432342.png" alt="image-20200304023432342" style="zoom:67%;" />

##### 第一步：创建myuser2表

**注意：**列族的名字要与myuser表的列族名字相同

```ruby
hbase(main):010:0> create 'myuser2','f1'
```

##### 第二步：创建maven工程

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
            <groupId>org.apache.hbase</groupId>
            <artifactId>hbase-client</artifactId>
            <version>1.2.0-cdh5.14.2</version>
        </dependency>
        <dependency>
            <groupId>org.apache.hbase</groupId>
            <artifactId>hbase-server</artifactId>
            <version>1.2.0-cdh5.14.2</version>
        </dependency>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.testng</groupId>
            <artifactId>testng</artifactId>
            <version>6.14.3</version>
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
                    <!--    <verbal>true</verbal>-->
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-shade-plugin</artifactId>
                <version>2.2</version>
                <executions>
                    <execution>
                        <phase>package</phase>
                        <goals>
                            <goal>shade</goal>
                        </goals>
                        <configuration>
                            <filters>
                                <filter>
                                    <artifact>*:*</artifact>
                                    <excludes>
                                        <exclude>META-INF/*.SF</exclude>
                                        <exclude>META-INF/*.DSA</exclude>
                                        <exclude>META-INF/*/RSA</exclude>
                                    </excludes>
                                </filter>
                            </filters>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
```

##### 第三步：自定义map类

```java
package com.jimmy.HBase;

import org.apache.hadoop.hbase.Cell;
import org.apache.hadoop.hbase.CellUtil;
import org.apache.hadoop.hbase.client.Put;
import org.apache.hadoop.hbase.client.Result;
import org.apache.hadoop.hbase.io.ImmutableBytesWritable;
import org.apache.hadoop.hbase.mapreduce.TableMapper;
import org.apache.hadoop.hbase.util.Bytes;
import org.apache.hadoop.io.Text;

import java.io.IOException;

//KOUT,VOUT是Text(行键),Put(一行中除了行键的单元格)
public class HBaseReadMapper extends TableMapper<Text, Put>{
    //ImmutableBytesWritable key是读取的表的一行数据的行键，一行数据调用一次map()方法
    //Result value是一行中除了行键的值
    //Context context是输出KOUT，VOUT
    @Override
    protected void map(ImmutableBytesWritable key, Result value, Context context) throws IOException, InterruptedException {
        //获得rowkey的字节数组
        byte[]rowByteArr=key.get();
        //字节数组转为字符串，得到行键
        String rowStr= Bytes.toString(rowByteArr);
        //将行键作为KOUT
        Text text_kout=new Text(rowStr);

        //利用行键字节数组构建Put对象
        //Put对象是用来装一行中除了行键的其它单元格
        Put put=new Put(rowByteArr);
        //获取一行的其它Cell
        Cell[] cells=value.rawCells();
        //循环遍历Cell,输出f1列族的name和age列的Cell
        for(Cell c:cells){
            //获取当前Cell的列族
            byte[]family_byte= CellUtil.cloneFamily(c);
            String family_Str=Bytes.toString(family_byte);
            //判断当前列族是否是f1
            if("f1".equals(family_Str)){
                //获取当前列名
                byte[]qualifier_byte=CellUtil.cloneQualifier(c);
                String qualifier_Str=Bytes.toString(qualifier_byte);
                //判断当前Cell的列是否是name或者age
                if("name".equals(qualifier_Str) || "age".equals(qualifier_Str)){
                    //把Cell对象装到Put对象里
                    put.add(c);
                }
            }
        }
        context.write(text_kout,put);
    }
}

```

##### 第四步：自定义reduce类

```java
package com.jimmy.HBase;

import org.apache.hadoop.hbase.client.Put;
import org.apache.hadoop.hbase.io.ImmutableBytesWritable;
import org.apache.hadoop.hbase.mapreduce.TableReducer;
import org.apache.hadoop.io.Text;

import java.io.IOException;

public class HBaseWriteReducer extends TableReducer<Text, Put, ImmutableBytesWritable>{
    @Override
    protected void reduce(Text key, Iterable<Put> values, Context context) throws IOException, InterruptedException {
        //获取rowkey,将Text对象转为ImmutableBytesWritable对象
        ImmutableBytesWritable immtbw=new ImmutableBytesWritable();
        immtbw.set(key.toString().getBytes());

        //遍历Put对象，输出KOUT,VOUT
        for(Put put:values){
            context.write(immtbw,put);
        }
    }
}
```

##### 第五步：自定义main入口类

```java
package com.jimmy.HBase;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.conf.Configured;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.Put;
import org.apache.hadoop.hbase.client.Scan;
import org.apache.hadoop.hbase.mapreduce.TableMapReduceUtil;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.util.Tool;
import org.apache.hadoop.util.ToolRunner;


public class HBaseMR extends Configured implements Tool {
    @Override
    public int run(String[] args) throws Exception {
        Job job=Job.getInstance(super.getConf());
        job.setJarByClass(HBaseMR.class);

        //设置使用的TableMapper类
        TableMapReduceUtil.initTableMapperJob(TableName.valueOf("myuser"),new Scan(),HBaseReadMapper.class, Text.class, Put.class,job);
        //设置使用的TableReducer类
        TableMapReduceUtil.initTableReducerJob("myuser2",HBaseWriteReducer.class,job);

        boolean b=job.waitForCompletion(true);
        return b?0:1;
    }

    public static void main(String[] args) throws Exception {
        Configuration conf= HBaseConfiguration.create();
        conf.set("hbase.zookeeper.quorum","node01:2181,node02:2181,node03:2181");
        int exitCode= ToolRunner.run(conf,new HBaseMR(),args);
        System.exit(exitCode);
    }
}
```

##### 第六步：本地运行或打成jar包提交到集群中运行

~~~shell
hadoop jar hbase_day03-1.0-SNAPSHOT.jar com.kaikeba.hbase.demo01.HBaseMR
~~~

##### 查看效果

```sh
hbase(main):006:0> scan 'myuser2'
ROW                                             COLUMN+CELL                                                                                                                               
 00001                                          column=f1:age, timestamp=1582836163648, value=\x00\x00\x00\x12                                                                            
 00001                                          column=f1:name, timestamp=1582836163648, value=krystal                                                                                    
 0002                                           column=f1:age, timestamp=1582837532912, value=\x00\x00\x00\x1E                                                                            
 0002                                           column=f1:name, timestamp=1582837532912, value=\xE6\x9B\xB9\xE6\x93\x8D                                                                   
 0004                                           column=f1:age, timestamp=1582837532912, value=\x00\x00\x00##                                                                               
 0004                                           column=f1:name, timestamp=1582837532912, value=\xE5\xAD\x99\xE6\x9D\x83                                                                   
 0005                                           column=f1:age, timestamp=1582837532912, value=\x00\x00\x00\x1C                                                                            
 0005                                           column=f1:name, timestamp=1582837532912, value=\xE8\xAF\xB8\xE8\x91\x9B\xE4\xBA\xAE                                                       
 0006                                           column=f1:age, timestamp=1582837532912, value=\x00\x00\x00\x1B                                                                            
 0006                                           column=f1:name, timestamp=1582837532912, value=\xE5\x8F\xB8\xE9\xA9\xAC\xE6\x87\xBF                                                       
 0007                                           column=f1:age, timestamp=1582837532912, value=\x00\x00\x00\x1C                                                                            
 0007                                           column=f1:name, timestamp=1582837532912, value=xiaobubu\xE2\x80\x94\xE5\x90\x95\xE5\xB8\x83                                               
6 row(s) in 0.1110 seconds

```



#### 实战二：hdfs-->HBase

##### 实战需求

读取hdfs上面某个文件的的数据，写入到hbase的myuser2表里面去。

![image-20200304024124478](hbase.assets/image-20200304024124478.png)

##### 第一步：准备数据文件


```shell
cd /tmp/
vim user.txt
0007	zhangsan	18
0008	lisi	25
0009	wangwu	20
```

将文件上传到hdfs的路径下面去

```shell
hdfs dfs -mkdir /hbase_input_data
hdfs dfs -put /tmp/user.txt /hbase_input_data
```

##### 第二步：定义MapReduce逻辑、组装类和main方法

使用创建内部类的方法，定义reduce逻辑、组装类、main()方法。

 ~~~java
package com.jimmy.HBase;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.conf.Configured;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.client.Put;
import org.apache.hadoop.hbase.io.ImmutableBytesWritable;
import org.apache.hadoop.hbase.mapreduce.TableMapReduceUtil;
import org.apache.hadoop.hbase.mapreduce.TableMapper;
import org.apache.hadoop.hbase.mapreduce.TableReducer;
import org.apache.hadoop.hbase.util.Bytes;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.util.Tool;
import org.apache.hadoop.util.ToolRunner;

import java.io.IOException;

public class HbaseCombat {
    //Mapper类作为内部类时，一定要声明为static
    public static class MyMapper extends Mapper<LongWritable,Text,Text,NullWritable>{
        @Override
        protected void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException {
            context.write(value,NullWritable.get());
        }
    }
    //作为内部类时，一定要声明为static
    public static class MyTableReducer extends TableReducer<Text,NullWritable,ImmutableBytesWritable>{
        @Override
        protected void reduce(Text key, Iterable<NullWritable> values, Context context) throws IOException, InterruptedException {
            String[] strArr=key.toString().split("\t");
            Put put=new Put(Bytes.toBytes(strArr[0]));
            put.addColumn("f1".getBytes(),"name".getBytes(),strArr[1].getBytes());
            put.addColumn("f1".getBytes(),"age".getBytes(),strArr[2].getBytes());

            context.write(new ImmutableBytesWritable(Bytes.toBytes(strArr[0])),put);
        }
    }
    public static class Assem extends Configured implements Tool{
        @Override
        public int run(String[] args) throws Exception {
            Job job=Job.getInstance(super.getConf());
            job.setJarByClass(HbaseCombat.class);
            //设置输入类的输入文件路径
            FileInputFormat.addInputPath(job,new Path("hdfs://node01:8020/hbase_input_data"));
            //设置要使用的Mapper类以及输出键值对类型
            job.setMapperClass(MyMapper.class);
            job.setMapOutputKeyClass(Text.class);
            job.setMapOutputValueClass(NullWritable.class);
            //设置要使用的TableReducer类,设置的表必须是已经存在的表
            TableMapReduceUtil.initTableReducerJob("myuser2",MyTableReducer.class,job);
            //设置ReduceTask个数为1
            job.setNumReduceTasks(1);
            boolean b=job.waitForCompletion(true);
            return b?0:1;
        }
    }
    public static void main(String[] args) throws Exception {
        Configuration conf= HBaseConfiguration.create();
        conf.set("hbase.zookeeper.quorum","node01:2181,node02:2181,node03:2181");
        int exitCode= ToolRunner.run(conf,new Assem(),args);
    }
}
 ~~~

```sh
hbase(main):019:0> scan 'myuser2'
ROW                                             COLUMN+CELL                                                                                                                               
 00001                                          column=f1:age, timestamp=1582836163648, value=\x00\x00\x00\x12                                                                            
 00001                                          column=f1:name, timestamp=1582836163648, value=krystal                                                                                    
 0002                                           column=f1:age, timestamp=1582837532912, value=\x00\x00\x00\x1E                                                                            
 0002                                           column=f1:name, timestamp=1582837532912, value=\xE6\x9B\xB9\xE6\x93\x8D                                                                   
 0004                                           column=f1:age, timestamp=1582837532912, value=\x00\x00\x00##                                                                               
 0004                                           column=f1:name, timestamp=1582837532912, value=\xE5\xAD\x99\xE6\x9D\x83                                                                   
 0005                                           column=f1:age, timestamp=1582837532912, value=\x00\x00\x00\x1C                                                                            
 0005                                           column=f1:name, timestamp=1582837532912, value=\xE8\xAF\xB8\xE8\x91\x9B\xE4\xBA\xAE                                                       
 0006                                           column=f1:age, timestamp=1582837532912, value=\x00\x00\x00\x1B                                                                            
 0006                                           column=f1:name, timestamp=1582837532912, value=\xE5\x8F\xB8\xE9\xA9\xAC\xE6\x87\xBF                                                       
 0007                                           column=f1:age, timestamp=1583310181335, value=18                                                                                          
 0007                                           column=f1:name, timestamp=1583310181335, value=zhangsan                                                                                   
 0008                                           column=f1:age, timestamp=1583310181335, value=25                                                                                          
 0008                                           column=f1:name, timestamp=1583310181335, value=lisi                                                                                       
 0009                                           column=f1:age, timestamp=1583310181335, value=20                                                                                          
 0009                                           column=f1:name, timestamp=1583310181335, value=wangwu                                                                                     
```

##### 第三步：打成jar包提交到集群中运行

~~~shell
hadoop jar hbase_day03-1.0-SNAPSHOT.jar com.kaikeba.hbase.demo02.HDFS2HBase
~~~



#### 实战三：hdfs-->HBase (bulkload)

加载hdfs的数据到HBase表当中去的方式多种多样，我们可以使用实战2中的HBase的javaAPI或者使用sqoop将我们的数据写入或者导入到HBase当中去，但是这些方式慢且导入的过程的占用Region资源，导致效率低下。这时候我们可以使用bulkload的方式来加载数据,这种方式可以提高加载大量数据的速度。

bulkload方式就是通过MR的程序，将hdfs中的数据直接转换成HBase的最终存储格式HFile，然后直接load数据到HBase当中去即可。

bulk[bʌlk] -->主体; 大部分; (大) 体积; 大(量); 巨大的体重(或重量、形状、身体等);

<img src="hbase.assets/image-20200304202840242.png" alt="image-20200304202840242" style="zoom:67%;" />

HBase数据正常写流程回顾

![image-20200304182702175](hbase.assets/image-20200304182702175.png)

bulkload方式的处理示意图

![image-20200304202418195](hbase.assets/image-20200304202418195.png)

##### 实战需求

通过bulkload的方式批量加载数据到HBase表中，将我们hdfs的/hbase_input_data路径的数据文件，转换成HFile格式，然后load到myuser2这张表里面去。

##### 第一步：自定义map类

```java
package com.jimmy.HBase03;

import org.apache.hadoop.hbase.client.Put;
import org.apache.hadoop.hbase.io.ImmutableBytesWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

import java.io.IOException;

public class BulkLoadMapper extends Mapper<LongWritable, Text,ImmutableBytesWritable,Put> {
    @Override
    protected void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException {
        String[]strArr=value.toString().split("\t");
        ImmutableBytesWritable immtbw=new ImmutableBytesWritable(strArr[0].getBytes());
        Put put=new Put(strArr[0].getBytes());
        put.addColumn("f1".getBytes(),"name".getBytes(),strArr[1].toString().getBytes());
        put.addColumn("f1".getBytes(),"age".getBytes(),strArr[2].toString().getBytes());
        context.write(immtbw,put);
    }
}
```

##### 第二部：定义组装类和Main()方法

```java
package com.jimmy.HBase03;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.conf.Configured;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.Connection;
import org.apache.hadoop.hbase.client.ConnectionFactory;
import org.apache.hadoop.hbase.client.Put;
import org.apache.hadoop.hbase.client.Table;
import org.apache.hadoop.hbase.io.ImmutableBytesWritable;
import org.apache.hadoop.hbase.mapreduce.HFileOutputFormat2;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.util.Tool;
import org.apache.hadoop.util.ToolRunner;

public class HBaseBulkLoad extends Configured implements Tool{
    @Override
    public int run(String[] args) throws Exception {
        Job job=Job.getInstance(super.getConf());
        job.setJarByClass(HBaseBulkLoad.class);

        //设置Map逻辑的输入路径（默认输入类为TextInputFormat)
        FileInputFormat.addInputPath(job,new Path("hdfs://node01:8020/hbase_input_data"));

        job.setMapperClass(BulkLoadMapper.class);
        job.setMapOutputKeyClass(ImmutableBytesWritable.class);
        job.setMapOutputValueClass(Put.class);

        //设置输出类
        job.setOutputFormatClass(HFileOutputFormat2.class);
        //设置输出路径
        HFileOutputFormat2.setOutputPath(job,new Path("hdfs://node01:8020/hbase_out_data"));

        //配置MapReduce作业，以执行增量加载到给定表中
        //使得MapReduce可以向myuser2表中增量增加数据：
        Connection conne= ConnectionFactory.createConnection(super.getConf());
        Table myTable=conne.getTable(TableName.valueOf("myuser2"));
        HFileOutputFormat2.configureIncrementalLoad(job,myTable,conne.getRegionLocator(TableName.valueOf("myuser2")));

        boolean b=job.waitForCompletion(true);
        return b?0:1;
    }

    public static void main(String[] args) throws Exception {
        Configuration conf= HBaseConfiguration.create();
        conf.set("hbase.zookeeper.quorum","node01:2181,node02:2181,node03:2181");
        int exitCode= ToolRunner.run(conf,new HBaseBulkLoad(),args);
        System.exit(exitCode);
    }
}
```

##### 第三步：本地运行或jar包提交到集群中运行

~~~shell
hadoop jar hbase_day03-1.0-SNAPSHOT.jar com.kaikeba.hbase.demo03.HBaseBulkLoad
~~~

##### 第四步：查看生成的HFile文件

![image-20200304212926221](hbase.assets/image-20200304212926221.png)

##### 第五步：加载HFile文件到hbase表中

####### 方式1：代码加载

~~~java
package com.jimmy.HBase03;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.Admin;
import org.apache.hadoop.hbase.client.Connection;
import org.apache.hadoop.hbase.client.ConnectionFactory;
import org.apache.hadoop.hbase.client.Table;
import org.apache.hadoop.hbase.mapreduce.LoadIncrementalHFiles;

import java.io.IOException;

public class LoadData{
    public static void main(String[] args) throws Exception {
        Configuration conf= HBaseConfiguration.create();
        conf.set("hbase.zookeeper.quorum","node01:2181,node02:2181,node03:2181");
        //创建Connection对象
        Connection conne=ConnectionFactory.createConnection(conf);
        //获取Admin管理对象
        Admin am=conne.getAdmin();
        //获取Table对象
        Table myTable=conne.getTable(TableName.valueOf("myuser2"));
        //获取LoadIncrementalHFiles对象
        LoadIncrementalHFiles load=new LoadIncrementalHFiles(conf);
        //加载HFile文件中数据到表
        load.doBulkLoad(new Path("hdfs://node01:8020/hbase_out_data"),am,myTable,conne.getRegionLocator(TableName.valueOf("myuser2")));
    }
}
~~~

####### 方式2：命令加载

先将hbase的jar包添加到hadoop的classpath路径下

```shell
[hadoop@node01 tmp]$ export HBASE_HOME=/kkb/install/hbase-1.2.0-cdh5.14.2/
[hadoop@node01 tmp]$ export HADOOP_HOME=/kkb/install/hadoop-2.6.0-cdh5.14.2/
[hadoop@node01 tmp]$ export HADOOP_CLASSPATH=`${HBASE_HOME}/bin/hbase mapredcp`
```

运行命令

```shell
yarn jar /kkb/install/hbase-1.2.0-cdh5.14.2/lib/hbase-server-1.2.0-cdh5.14.2.jar   
completebulkload /hbase_out_data myuser2

#/kkb/install/hbase-1.2.0-cdh5.14.2/lib/hbase-server-1.2.0-cdh5.14.2.jar是系统自带的jar包
#completebulkload是jar包的主类
#/hbase_out_data是HFile文件路径
#myuser2是要加载HFile数据的表名
```

##### 第六步：查看加载的效果

可以看到时间戳发生了变化。

![image-20200304214754596](hbase.assets/image-20200304214754596.png)



## HBase集成Hive（重点）

Hive提供了与HBase的集成，使得能够在HBase表上使用hive sql 语句进行查询、插入操作以及进行Join和Union等复杂查询，同时也可以将hive表中的数据映射到Hbase中

#### HBase与Hive的对比

##### Hive

- 数据仓库

  Hive的本质其实就相当于将HDFS中已经存储的文件在Mysql中做了一个双射关系，以方便使用HQL去管理查询。

- 用于数据分析、清洗                

  Hive适用于离线的数据分析和清洗，延迟较高

- 基于HDFS、MapReduce

  Hive存储的数据依旧在DataNode上，编写的HQL语句终将是转换为MapReduce代码执行。（不要钻不需要执行MapReduce代码的情况的牛角尖）

##### HBase

- 数据库

  是一种面向列存储的非关系型数据库。

- 用于存储结构化和非结构话的数据

  适用于单表非关系型数据的存储，不适合做关联查询，类似JOIN等操作。

- 基于HDFS

  数据持久化存储的体现形式是Hfile，存放于DataNode中，被ResionServer以region的形式进行管理。

- 延迟较低，接入在线业务使用

  面对大量的企业数据，HBase可以直线单表大量数据的存储，同时提供了高效的数据访问速度。

###### 总结：Hive与HBase

- Hive和Hbase是两种基于Hadoop的不同技术，Hive是一种类SQL的引擎，并且运行MapReduce任务，Hbase是一种在Hadoop之上的NoSQL 的Key/vale数据库。这两种工具是可以同时使用的。就像用Google来搜索，用FaceBook进行社交一样，Hive可以用来进行统计查询，HBase可以用来进行实时查询，数据也可以从Hive写到HBase，或者从HBase写回Hive。

#### HBase与Hive的整合配置

为什么要进行整合配置？看下图：

<img src="hbase.assets/image-20200304235841132.png" alt="image-20200304235841132" style="zoom:67%;" />

##### 第一步：拷贝jar包(创建软链接)

在Hive的lib目录下创建HBase的五个jar包的软链接

hbase的jar包都在/kkb/install/hbase-1.2.0-cdh5.14.2/lib目录下，我们需要拷贝五个jar包名字如下：

```
hbase-client-1.2.0-cdh5.14.2.jar                  
hbase-hadoop2-compat-1.2.0-cdh5.14.2.jar 
hbase-hadoop-compat-1.2.0-cdh5.14.2.jar  
hbase-it-1.2.0-cdh5.14.2.jar    
hbase-server-1.2.0-cdh5.14.2.jar
```

直接在node03执行以下命令，通过创建软连接的方式来进行jar包的依赖

```shell
ln -s /kkb/install/hbase-1.2.0-cdh5.14.2/lib/hbase-client-1.2.0-cdh5.14.2.jar /kkb/install/hive-1.1.0-cdh5.14.2/lib/hbase-client-1.2.0-cdh5.14.2.jar   
ln -s /kkb/install/hbase-1.2.0-cdh5.14.2/lib/hbase-hadoop2-compat-1.2.0-cdh5.14.2.jar /kkb/install/hive-1.1.0-cdh5.14.2/lib/hbase-hadoop2-compat-1.2.0-cdh5.14.2.jar             
ln -s /kkb/install/hbase-1.2.0-cdh5.14.2/lib/hbase-hadoop-compat-1.2.0-cdh5.14.2.jar  /kkb/install/hive-1.1.0-cdh5.14.2/lib/hbase-hadoop-compat-1.2.0-cdh5.14.2.jar            
ln -s /kkb/install/hbase-1.2.0-cdh5.14.2/lib/hbase-it-1.2.0-cdh5.14.2.jar /kkb/install/hive-1.1.0-cdh5.14.2/lib/hbase-it-1.2.0-cdh5.14.2.jar    
ln -s /kkb/install/hbase-1.2.0-cdh5.14.2/lib/hbase-server-1.2.0-cdh5.14.2.jar   /kkb/install/hive-1.1.0-cdh5.14.2/lib/hbase-server-1.2.0-cdh5.14.2.jar  
```

##### 第二步：修改hive的配置文件

编辑node03服务器上面的hive的配置文件hive-site.xml

```shell
cd /kkb/install/hive-1.1.0-cdh5.14.2/conf
vim hive-site.xml
```

添加以下两个属性的配置

```xml
	<property>
		<name>hive.zookeeper.quorum</name>
		<value>node01,node02,node03</value>
	</property>
	<property>
		<name>hbase.zookeeper.quorum</name>
		<value>node01,node02,node03</value>
	</property>
```

##### 第三步：修改hive-env.sh配置文件

```shell
cd /kkb/install/hive-1.1.0-cdh5.14.2/conf
vim hive-env.sh
```

添加以下配置

```shell
HADOOP_HOME=/kkb/install/hadoop-2.6.0-cdh5.14.2/
export HBASE_HOME=/kkb/install/hbase-1.2.0-cdh5.14.2
export HIVE_CONF_DIR=/kkb/install/hive-1.1.0-cdh5.14.2/conf
```

<img src="hbase.assets/image-20200305000557525.png" alt="image-20200305000557525" style="zoom: 80%;" />

#### Hive与HBase整合案例1

##### 案例需求

将hive表分析结果保存到hbase表当中去。

##### 案例分析

实现思路如下：

<img src="hbase.assets/image-20200305020558336.png" alt="image-20200305020558336" style="zoom:67%;" />

##### 第一步：hive当中建表

```sh
[hadoop@node03 ~]$ nohup hive -service hiveserver2 &
[hadoop@node03 ~]$ beeline
beeline> !connect jdbc:hive2://node03:10000!connect

#或者进入hive shell来进行以下操作也是可以的
```

```sql
create database hive_hbase_test;
use hive_hbase_test;

create external table if not exists score(id int,cname string,score int) row format delimited fields terminated by '\t' stored as textfile;
```

##### 第二步：准备数据并加载到hive表

node03执行以下命令，创建数据文件

```shell
cd /kkb/install/hivedatas
vim hive-hbase.txt
```

文件内容如下

```
1	zhangsan	80
2	lisi	60
3	wangwu	30
4	zhaoliu	70
```

加载数据到hive表

```sql
#加载数据:
0: jdbc:hive2://node03:10000> load data local inpath '/kkb/install/hivedatas/hive-hbase.txt' into table score;

#查看表数据:
0: jdbc:hive2://node03:10000> select * from course_score;
+------------------+---------------------+---------------------+--+
| course_score.id  | course_score.cname  | course_score.score  |
+------------------+---------------------+---------------------+--+
| 1                | zhangsan            | 80                  |
| 2                | lisi                | 60                  |
| 3                | wangwu              | 30                  |
| 4                | zhaoliu             | 70                  |
+------------------+---------------------+---------------------+--+
```

##### 第三步：创建hive管理表与HBase进行映射

我们可以创建一个hive的管理表与hbase当中的表进行映射，hive管理表当中的数据，都会存储到hbase上面去。

```sql
create table score2(id int,cname string,score int) 
stored by 'org.apache.hadoop.hive.hbase.HBaseStorageHandler'  
with serdeproperties("hbase.columns.mapping" = "cf:name,cf:score") tblproperties("hbase.table.name" = "hbase_score");

-- 通过HBaseStorageHandler方式来进行存储
-- "hbase.columns.mapping" = "cf:name,cf:score"  代表hive表中的cname和score列分别对应hbase表中的name和score列
-- "hbase.table.name" = "hbase_score" 代表hive的这张表映射到hbase中的hbase_score表。
-- id默认缺省对应hbase表中的rowkey

#期间，出现了一些问题:FAILED: Execution Error, return code 1 from org.apache.hadoop.hive.ql.exec.DDLTask. org/apache/hadoop/hive/hbase/HiveHBaseTableInputFormat,
最终是关闭hadoop\zk\hbase\hive，然后重启解决了
```

通过insert  overwrite select  插入数据

```sql
insert overwrite table course.hbase_score select id,cname,score from course.score;
```

##### 第四步：查看效果

查看Hive中的表score2

```sql
0: jdbc:hive2://node03:10000> show tables;
+-----------+--+
| tab_name  |
+-----------+--+
| score     |
| score2    |
+-----------+--+

0: jdbc:hive2://node03:10000> select * from score2;
+------------+---------------+---------------+--+
| score2.id  | score2.cname  | score2.score  |
+------------+---------------+---------------+--+
| 1          | zhangsan      | 80            |
| 2          | lisi          | 60            |
| 3          | wangwu        | 30            |
| 4          | zhaoliu       | 70            |
+------------+---------------+---------------+--+
```

进入hbase的客户端查看表hbase_score，并查看当中的数据

```ruby
hbase(main):001:0> list
TABLE                      
hbase_score                
mytable                    
myuser                     
myuser2                    
person2                    
person3                    
person4                    
student                    
t1                         
t2                         
t5                         
test01                     
user                       
13 row(s) in 0.2800 seconds

=> ["hbase_score", "mytable", "myuser", "myuser2", "person2", "person3", "person4", "student", "t1", "t2", "t5", "test01", "user"]

hbase(main):003:0> scan 'hbase_score'
ROW                           COLUMN+CELL                                     
 1                            column=cf:name, timestamp=1583373496020, value=zhangsan
 1                            column=cf:score, timestamp=1583373496020, value=80     
 2                            column=cf:name, timestamp=1583373496020, value=lisi    
 2                            column=cf:score, timestamp=1583373496020, value=60     
 3                            column=cf:name, timestamp=1583373496020, value=wangwu  
 3                            column=cf:score, timestamp=1583373496020, value=30     
 4                            column=cf:name, timestamp=1583373496020, value=zhaoliu 
 4                            column=cf:score, timestamp=1583373496020, value=70     
```



#### Hive与HBase整合案例2

##### 案例需求

创建hive外部表，映射HBase当中已有的表模型

##### 第一步：HBase中建表并加载数据

```ruby
hbase shell

## 创建一张表
create 'hbase_hive_score',{ NAME =>'cf'}
## 通过put插入数据到hbase表
put 'hbase_hive_score','1','cf:name','zhangsan'
put 'hbase_hive_score','1','cf:score', '95'
put 'hbase_hive_score','2','cf:name','lisi'
put 'hbase_hive_score','2','cf:score', '96'
put 'hbase_hive_score','3','cf:name','wangwu'
put 'hbase_hive_score','3','cf:score', '97'
```

##### 第二步：Hive中建外部表，映射HBase中的表及字段

创建Hive表，与hbase的hbase_hive_score表进行映射。

```sql
CREATE external TABLE hbase2hive(id int, name string, score int) 
STORED BY 'org.apache.hadoop.hive.hbase.HBaseStorageHandler' 
WITH SERDEPROPERTIES ("hbase.columns.mapping" = ":key,cf:name,cf:score") TBLPROPERTIES("hbase.table.name" ="hbase_hive_score");
```

查看hive表hbase2hive

```sql
select * from hbase2hive;
+----------------+------------------+-------------------+--+
| hbase2hive.id  | hbase2hive.name  | hbase2hive.score  |
+----------------+------------------+-------------------+--+
| 1              | zhangsan         | 95                |
| 2              | lisi             | 96                |
| 3              | wangwu           | 97                |
+----------------+------------------+-------------------+--+
```

## HBase表的rowkey设计（重点）

rowkey设计有三大原则。长度以及散列原则都是为了解决热点问题。

#### rowkey长度原则

- rowkey是一个二进制码流，可以是任意字符串，最大长度64kb，实际应用中一般为10-100bytes，以byte[]形式保存，一般设计成定长。

* 建议尽可能短；但是也不能太短，否则rowkey前缀重复的概率增大，会出现热点问题。
* 设计过长会降低memstore内存的利用率和HFile存储数据的效率。

#### rowkey散列原则

- 建议将rowkey的高位作为**散列字段**，这样将提高数据均衡分布在每个RegionServer，以实现负载均衡的几率。
- 如果没有散列字段，首字段直接是时间信息。所有的数据都会集中在一个RegionServer上，这样在数据检索的时候负载会集中在个别的RegionServer上，造成热点问题，会降低查询效率。	

#### rowkey唯一原则

- 必须在设计上保证其唯一性，rowkey是按照字典顺序排序存储的
- 因此，设计rowkey的时候，要充分利用这个排序的特点，可以将经常读取的数据存储到一块，将最近可能会被访问的数据放到一块

#### 应用场景实例

下图为电信上网详单数据，保存在HBase的一个应用场景,HBase能胜任快速响应的任务。

![2019-10-16_112336](hbase.assets/2019-10-16_112336.png)

![2019-10-16_112157](hbase.assets/2019-10-16_112157.png)



![2019-10-16_112529](hbase.assets/2019-10-16_112529.png)



## HBase表的热点（重点）

#### 什么是热点

hbase的数据是按照row key进行排序后存储的，而检索habse的记录首先要通过row key来定位数据行。当大量的client访问hbase集群的一个或少数几个节点，造成少数region server的读/写请求过多、负载过大，而其他region server负载却很小，就造成了“热点”现象。

#### 热点的解决方案

##### 预分区

预分区的目的让表的数据可以均衡的分散在集群中，而不是默认只有一个region分布在集群的一个节点上。

##### 加盐             

这里所说的加盐不是密码学中的加盐，而是在rowkey的前面增加随机数，具体就是给rowkey分配一个随机前缀以使得它和之前的rowkey的开头不同

##### 哈希

哈希会使同一行永远用一个前缀加盐。哈希也可以使负载分散到整个集群，但是读却是可以预测的。使用确定的哈希可以让客户端重构完整的rowkey，可以使用get操作准确获取某一个行数据。

~~~sh
rowkey=MD5(username).subString(0,10)+时间戳	
~~~

##### 反转

反转固定长度或者数字格式的rowkey。这样可以使得rowkey中经常改变的部分（最没有意义的部分）放在前面。

这样可以有效的随机rowkey，但是牺牲了rowkey的有序性。

~~~
电信公司：
移动-----------> 136xxxx9301  ----->1039xxxx631
				136xxxx1234  
				136xxxx2341 
电信
联通

user表
rowkey    name    age   sex    address
		  lisi1    21     m       beijing
		  lisi2    22     m       beijing
		  lisi3    25     m       beijing
		  lisi4    30     m       beijing
		  lisi5    40     f       shanghai
		  lisi6    50     f       tianjin
	          
需求：后期想经常按照居住地和年龄进行查询？	
rowkey= address+age+随机数
        beijing21+随机数
        beijing22+随机数
        beijing25+随机数
        beijing30+随机数
   
rowkey= address+age+随机数
~~~

## Phoenix安装部署

##### 安装准备

需要先安装好hbase集群，phoenix只是一个工具，只需要在一台机器上安装就可以了，这里我们选择node02服务器来进行安装一台即可

##### 下载安装包

下载地址：http://archive.apache.org/dist/phoenix/

这里我们使用的版本是：apache-phoenix-4.14.0-cdh5.14.2-bin.tar.gz

##### 上传解压

将安装包上传到node02服务器的/kkb/soft路径下，然后进行解压

```shell
cd /kkb/soft/
tar -zxf apache-phoenix-4.14.0-cdh5.14.2-bin.tar.gz  -C /kkb/install/
```

##### 修改配置

####### 拷贝jar包到各节点的hbase的lib目录下

将phoenix目录下的phoenix-4.8.2-HBase-1.2-server.jar、phoenix-core-4.8.2-HBase-1.2.jar拷贝到各个 hbase的lib目录下。

node02执行以下命令，将两个jar包拷贝到hbase的lib目录下

```shell
cd /kkb/install/apache-phoenix-4.14.0-cdh5.14.2-bin

scp phoenix-4.14.0-cdh5.14.2-server.jar phoenix-core-4.14.0-cdh5.14.2.jar node01:/kkb/install/hbase-1.2.0-cdh5.14.2/lib/ 

scp phoenix-4.14.0-cdh5.14.2-server.jar phoenix-core-4.14.0-cdh5.14.2.jar node02:/kkb/install/hbase-1.2.0-cdh5.14.2/lib/ 

scp phoenix-4.14.0-cdh5.14.2-server.jar phoenix-core-4.14.0-cdh5.14.2.jar node03:/kkb/install/hbase-1.2.0-cdh5.14.2/lib/ 
```

####### 拷贝hbase、hadoop配置文件到phoenix/ing目录下

将hbase的配置文件hbase-site.xml、 hadoop下的配置文件core-site.xml、hdfs-site.xml放到phoenix/bin/下，替换phoenix原来的配置文件。

只在node02执行以下命令，进行拷贝配置文件

```shell
cp /kkb/install/hadoop-2.6.0-cdh5.14.2/etc/hadoop/core-site.xml  /kkb/install/apache-phoenix-4.14.0-cdh5.14.2-bin/bin/

cp /kkb/install/hadoop-2.6.0-cdh5.14.2/etc/hadoop/hdfs-site.xml  /kkb/install/apache-phoenix-4.14.0-cdh5.14.2-bin/bin/

cp /kkb/install/hbase-1.2.0-cdh5.14.2/conf/hbase-site.xml  /kkb/install/apache-phoenix-4.14.0-cdh5.14.2-bin/bin/
```

####### 重启hbase集群，使Phoenix的jar包生效。

记得要先启动hadoop集群、zookeeper集群

node01执行以下命令来重启hbase的集群

```shell
cd /kkb/install/hbase-1.2.0-cdh5.14.2/
bin/stop-hbase.sh 
bin/start-hbase.sh 
```

##### 验证是否成功

在phoenix/bin下输入命令, 进入到命令行，接下来就可以操作了

==node02执行==以下命令，进入phoenix客户端

~~~sh
 cd /kkb/install/apache-phoenix-4.14.0-cdh5.14.2-bin/
 
 [hadoop@node02 apache-phoenix-4.14.0-cdh5.14.2-bin]$ bin/sqlline.py node01:2181
Setting property: [incremental, false]
Setting property: [isolation, TRANSACTION_READ_COMMITTED]
issuing: !connect jdbc:phoenix:node01:2181 none none org.apache.phoenix.jdbc.PhoenixDriver
Connecting to jdbc:phoenix:node01:2181
SLF4J: Class path contains multiple SLF4J bindings.
SLF4J: Found binding in [jar:file:/kkb/install/apache-phoenix-4.14.0-cdh5.14.2-bin/phoenix-4.14.0-cdh5.14.2-client.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: Found binding in [jar:file:/kkb/install/hadoop-2.6.0-cdh5.14.2/share/hadoop/common/lib/slf4j-log4j12-1.7.5.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: See http://www.slf4j.org/codes.html#multiple_bindings for an explanation.
SLF4J: Actual binding is of type [org.slf4j.impl.Log4jLoggerFactory]
20/03/05 12:04:53 WARN util.NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applicable
Connected to: Phoenix (version 4.14)
Driver: PhoenixEmbeddedDriver (version 4.14)
Autocommit status: true
Transaction isolation: TRANSACTION_READ_COMMITTED
Building list of tables and columns for tab-completion (set fastconnect to true to skip)...
133/133 (100%) Done
Done
sqlline version 1.2.0
0: jdbc:phoenix:node01:2181> 
~~~

## Phoenix使用

Phoenix是一个HBase框架，可以通过SQL的方式来操作HBase。

Phoenix是构建在HBase上的一个SQL层，是内嵌在HBase中的JDBC驱动，能够让用户使用标准的JDBC来操作HBase。

Phoenix使用JAVA语言进行编写，其查询引擎 会将SQL查询语句转换成一个或多个HBase Scanner，且并行执行生成标准的JDBC结果集



### 批处理方式

通过/bin/psql.py命令批量加载csv数据到表中，这是单线程加载的。psql方式适合几十MB的数据量。如果有更大的数据量，使用HBase与MapReduce的整合方式更好。

表本身存在时，语法格式：bin/psql.py -t EXAMPLE localhost data.csv，-t后面是表名，localhost是HBase的所在主节点。

表不存在时，语法格式：./psql.py localhost:2222 XXX.sql(建表) XXX.csv(数据) XXX.sql(查询） 

##### 实例1：表不存在情况

node02执行以下命令创建create_user_phoenix.sql文件，内容如下

~~~mysql
mkdir -p /tmp/phoenixsql
cd /tmp/phoenixsql/
vim user_phoenix.sql

create table if not exists user_phoenix (state varchar(10) NOT NULL,  city varchar(20) NOT NULL, population BIGINT  CONSTRAINT my_pk PRIMARY KEY (state, city));

#CONSTRAINT是联合主键的意思，一般命名带pk
#主键不能有空值，且是唯一的不重复的。
#使用联合主键是因为使用单个字段作为主键时，有可能会重复。
~~~

node02执行以下命令，创建user_phoenix.csv数据文件。

csv文件的命名一定要跟上面create语句中的表名(user_phoenix)一致！！！！！！！！

~~~shell
cd /tmp/phoenixsql/
vim user_phoenix.csv  

NY,New York,8143197
CA,Los Angeles,3844829
IL,Chicago,2842518
TX,Houston,2016582
PA,Philadelphia,1463281
AZ,Phoenix,1461575
TX,San Antonio,1256509
CA,San Diego,1255540
TX,Dallas,1213825
CA,San Jose,912332
~~~

创建user_phoenix_query.sql文件

~~~sql
cd /kkb/install/phoenixsql
vim user_phoenix_query.sql

select state as "userState",count(city) as "City Count",sum(population) as "Population Sum" FROM user_phoenix GROUP BY state; 
~~~

执行sql语句

~~~sh
cd /kkb/install/phoenixsql

[hadoop@node02 phoenixsql]$ /kkb/install/apache-phoenix-4.14.0-cdh5.14.2-bin/bin/psql.py  node01:2181 create_user_phoenix.sql user_phoenix.csv  user_phoenix_query.sql

userState           City Count                           Population sum 
---------- ------------------- ------------------------------------------- 
AZ                       1                                  1461575 
CA                       3                                  6012701 
IL                       1                                  2842518 
NY                       1                                  8143197 
PA                       1                                  1463281 
TX                       3                                  4486916 
~~~

到hbase查看，是否建立了user_phoenix表。

从下图可以看到，hbase上多了一个user_phoenix表，而且表名是大写的。这是因为Phoenix是大小写敏感的，并且所有命令都是大写,如果你建的表名没有用双引号括起来，那么无论你输入的是大写还是小写，建立出来的表名都是大写的。若想建立出包含小写的表名和字段名，请把表名或者字段名用双引号括起来。 

<img src="hbase.assets/image-20200305152748223.png" alt="image-20200305152748223" style="zoom:80%;" />

### 命令行方式

##### 进入命令行

~~~sh
/kkb/install/apache-phoenix-4.14.0-cdh5.14.2-bin/bin/sqlline.py node01:2181
sqlline version 1.2.0
0: jdbc:phoenix:node01:2181> 
~~~

##### 退出命令行

phoenix的命令都需要一个感叹号。

~~~
!quit
~~~

##### 查看phoenix的所有命令

```ruby
0: jdbc:phoenix:node01:2181> !help
!all                Execute the specified SQL against all the current
                    connections
!autocommit         Set autocommit mode on or off
!batch              Start or execute a batch of statements
!brief              Set verbose mode off
!call               Execute a callable statement
!close              Close the current connection to the database
!closeall           Close all current open connections
!columns            List all the columns for the specified table
!commit             Commit the current transaction (if autocommit is off)
!connect            Open a new connection to the database.
!dbinfo             Give metadata information about the database
!describe           Describe a table
!dropall            Drop all tables in the current database
!exportedkeys       List all the exported keys for the specified table
!go                 Select the current connection
!help               Print a summary of command usage
!history            Display the command history
!importedkeys       List all the imported keys for the specified table
!indexes            List all the indexes for the specified table
!isolation          Set the transaction isolation for this connection
!list               List the current connections
!manual             Display the SQLLine manual
!metadata           Obtain metadata information
!nativesql          Show the native SQL for the specified statement
!outputformat       Set the output format for displaying results
                    (table,vertical,csv,tsv,xmlattrs,xmlelements)
!primarykeys        List all the primary keys for the specified table
!procedures         List all the procedures
!properties         Connect to the database specified in the properties file(s)
!quit               Exits the program
!reconnect          Reconnect to the database
!record             Record all output to the specified file
!rehash             Fetch table and column names for command completion
!rollback           Roll back the current transaction (if autocommit is off)
!run                Run a script from the specified file
!save               Save the current variabes and aliases
!scan               Scan for installed JDBC drivers
!script             Start saving a script to a file
!set                Set a sqlline variable

Variable        Value      Description
=============== ========== ================================
autoCommit      true/false Enable/disable automatic
                           transaction commit
autoSave        true/false Automatically save preferences
color           true/false Control whether color is used
                           for display
fastConnect     true/false Skip building table/column list
                           for tab-completion
force           true/false Continue running script even
                           after errors
headerInterval  integer    The interval between which
                           headers are displayed
historyFile     path       File in which to save command
                           history. Default is
                           $HOME/.sqlline/history (UNIX,
                           Linux, Mac OS),
                           $HOME/sqlline/history (Windows)
incremental     true/false Do not receive all rows from
                           server before printing the first
                           row. Uses fewer resources,
                           especially for long-running
                           queries, but column widths may
                           be incorrect.
isolation       LEVEL      Set transaction isolation level
maxColumnWidth  integer    The maximum width to use when
                           displaying columns
maxHeight       integer    The maximum height of the
                           terminal
maxWidth        integer    The maximum width of the
                           terminal
numberFormat    pattern    Format numbers using
                           DecimalFormat pattern
outputFormat    table/vertical/csv/tsv Format mode for
                           result display
propertiesFile  path       File from which SqlLine reads
                           properties on startup; default is
                           $HOME/.sqlline/sqlline.properties
                           (UNIX, Linux, Mac OS),
                           $HOME/sqlline/sqlline.properties
                           (Windows)
rowLimit        integer    Maximum number of rows returned
                           from a query; zero means no
                           limit
showElapsedTime true/false Display execution time when
                           verbose
showHeader      true/false Show column names in query
                           results
showNestedErrs  true/false Display nested errorssh
showWarnings    true/false Display connection warnings
silent          true/false Be more silent
timeout         integer    Query timeout in seconds; less
                           than zero means no timeout
trimScripts     true/false Remove trailing spaces from
                           lines read from script files
verbose         true/false Show verbose error messages and
                           debug info
!sql                Execute a SQL command
!tables             List all the tables in the database
!typeinfo           Display the type map for the current connection
!verbose            Set verbose mode on
```

##### 实例：在Phoenix建立HBase的映射表

通过Phoenix创建一个表之后，HBase端会自动存在该表，因为Phoenix就是用来操控HBase的。但是在Hbase端创建一个表，在Phoenix端是找不到该表的。因此，我们这里演示一下，在Hbase创建表后，如何在phoenix端建立映射表。

在node01进入hbase客户端，创建一个普通表employee，并且有两个列族 company 和family。

~~~ruby
hbase(main):001:0> create 'employee','company','family'
~~~

数据准备

~~~ruby
put 'employee','row1','company:name','ted'
put 'employee','row1','company:position','worker'
put 'employee','row1','family:tel','13600912345'
put 'employee','row1','family:age','18'
put 'employee','row2','company:name','michael'
put 'employee','row2','company:position','manager'
put 'employee','row2','family:tel','1894225698'
put 'employee','row2','family:age','20'
~~~

node02进入到phoenix的客户端，然后创建映射表。创建映射表的时候，要特别注意大小写关系。因为在HBase中创建映射表的时候，使用了小写，因此下面的sql语句的表名和字段名等大部分都使用了双引号。

~~~mysql
/kkb/install/apache-phoenix-4.14.0-cdh5.14.2-bin/bin/sqlline.py node01:2181

0: jdbc:phoenix:node01:2181> CREATE TABLE IF NOT EXISTS "employee" ("no" VARCHAR(10) NOT NULL PRIMARY KEY, "company"."name" VARCHAR(30),"company"."position" VARCHAR(20), "family"."tel" VARCHAR(20), "family"."age" VARCHAR(20)) column_encoded_bytes=0;

0: jdbc:phoenix:node01:2181> select * from "employee";
+-------+----------+-----------+--------------+------+
|  no   |   name   | position  |     tel      | age  |
+-------+----------+-----------+--------------+------+
| row1  | ted      | worker    | 13600912345  | 18   |
| row2  | michael  | manager   | 1894225698   | 20   |
+-------+----------+-----------+--------------+------+

0: jdbc:phoenix:node01:2181> select * from "employee" where "tel" = '13600912345';
+-------+-------+-----------+--------------+------+
|  no   | name  | position  |     tel      | age  |
+-------+-------+-----------+--------------+------+
| row1  | ted   | worker    | 13600912345  | 18   |
+-------+-------+-----------+--------------+------+
## '13600912345'要使用单引号

0: jdbc:phoenix:node01:2181> select * from "employee" where "age" = '18';
+-------+-------+-----------+--------------+------+
|  no   | name  | position  |     tel      | age  |
+-------+-------+-----------+--------------+------+
| row1  | ted   | worker    | 13600912345  | 18   |
+-------+-------+-----------+--------------+------+
## '18'要使用单引号
~~~



### GUI方式(TODO)

通过dbeaver来连接phoenix。dbeaver下载地址：https://dbeaver.io/download/

#### 第一步：下载HBase配置文件和phoenix的jar包

通过dbeaver来连接phoenix需要两个文件，phoenix-4.14.0-cdh5.14.2-client.jar和hbase-site.xml

从node02的phoenix的安装目录，获取第一个文件

```shell
[hadoop@node02 ~]$ sz /kkb/install/apache-phoenix-4.14.0-cdh5.14.2-bin/phoenix-4.14.0-cdh5.14.2-client.jar
## 自动下载到了windows的C:\Users\97464\Downloads目录下
```

从hbase的安装配置文件路径，获取hbase-site.xml这个文件

```sh
[hadoop@node02 ~]$ sz /kkb/install/hbase-1.2.0-cdh5.14.2/conf/hbase-site.xml 
```

#### 第二步：拷贝HBase配置文件到jar包

双击phoenix-4.14.0-cdh5.14.2-client.jar这个文件，使用win rar解压软件打开。

将hbase-site.xml放到phoenix-4.14.0-cdh5.14.2-client.jar这个jar包里面去

![image-20200305163948645](hbase.assets/image-20200305163948645.png)



#### 第三步：通过dbeaver去连接phoenix



![1571282405612](hbase.assets/1571282405612.png)

![1571282452922](hbase.assets/1571282452922.png)

![1571282684917](hbase.assets/1571282684917.png)

- 注意：如果连接不上，可能不是操作配置的问题，有可能是因为dbeaver软件的问题，将dbeaver软件重启几次试试看

#### 第四步：创建数据库表，并实现sql进行操作

直接在phoenix当中通过sql语句的方式来创建表。

```sql
CREATE TABLE IF NOT EXISTS US_POPULATION (
      state CHAR(2) NOT NULL,
      city VARCHAR NOT NULL,
      population BIGINT
      CONSTRAINT my_pk PRIMARY KEY (state, city));

UPSERT INTO US_POPULATION (state, city, population) values ('NY','New York',8143197);
UPSERT INTO US_POPULATION (state, city, population) values ('CA','Los Angeles',3844829);

SELECT * FROM US_POPULATION WHERE population > 8000000;
```

### JDBC调用方式(TODO)

创建maven工程并导入jar包

~~~xml
<dependencies>
    <dependency>
        <groupId>org.apache.phoenix</groupId>
        <artifactId>phoenix-core</artifactId>
        <version>4.14.0-cdh5.14.2</version>
    </dependency>
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.12</version>
    </dependency>
    <dependency>
        <groupId>org.testng</groupId>
        <artifactId>testng</artifactId>
        <version>6.14.3</version>
    </dependency>
    </dependencies>
    <build>
        <plugins>
            <!-- 限制jdk版本插件 -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.0</version>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                    <encoding>UTF-8</encoding>
                </configuration>
            </plugin>
        </plugins>
    </build>
~~~

代码开发

~~~java
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;
import java.sql.*;

public class PhoenixSearch {
    private Connection connection;
    private Statement statement;
    private ResultSet rs;
    
    @BeforeTest
    public void init() throws SQLException {
        //定义phoenix的连接url地址
        String url="jdbc:phoenix:node01:2181";
        connection = DriverManager.getConnection(url);
        //构建Statement对象
        statement = connection.createStatement();
    }
    @Test
    public void queryTable() throws SQLException {
        //定义查询的sql语句，注意大小写
        String sql="select * from US_POPULATION";
        //执行sql语句
        try {
            rs=statement.executeQuery(sql);
            while(rs.next()){
                System.out.println("state:"+rs.getString("state"));
                System.out.println("city:"+rs.getString("city"));
                System.out.println("population:"+rs.getInt("population"));
                System.out.println("-------------------------");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }finally {
            if(connection!=null){
                connection.close();
            }
        }
    }
}
~~~



## Phoenix构建二级索引

#### 为什么需要用二级索引？

对于HBase而言，如果想精确地定位到某行记录，唯一的办法是通过rowkey来查询。如果不通过rowkey来查找数据，就必须逐行地比较每一列的值，即全表扫瞄。

对于较大的表，全表扫描的代价是不可接受的。但是，很多情况下，需要从多个角度查询数据。

- 例如，在定位某个人的时候，可以通过姓名、身份证号、学籍号等不同的角度来查询
- 要想把这么多角度的数据都放到rowkey中几乎不可能（业务的灵活性不允许，对rowkey长度的要求也不允许）。
- 所以需要secondary index（二级索引）来完成这件事。secondary index的原理很简单,就是把要查询的字段作为rowkey,把原先的rowkey作为value,形成一个索引表，查询该字段的某个值数据的时候首先去索引表查询该字段，因为该字段是索引表的rowkey，因此查询很快，查询到之后，就获得了原先的表的对应rowkey,再重新定位到原表的该rowkey，从而达到快速查询的目的。但是如果自己维护的话则会麻烦一些。
- 现在，Phoenix已经提供了对HBase secondary index的支持。

![](hbase.assets/二级索引思想.png)

#### 全局索引与本地索引

##### Global Indexing全局索引

- Global indexing，全局索引，适用于读多写少的业务场景。
- 使用Global indexing在写数据的时候开销很大，因为所有对数据表的更新操作（DELETE, UPSERT VALUES and UPSERT SELECT），都会引起索引表的更新，而索引表是分布在不同的数据节点上的，跨节点的数据传输带来了较大的性能消耗。
- 在读数据的时候Phoenix会选择索引表来降低查询消耗的时间。
- 在默认情况下如果想查询的字段不是索引字段的话索引表不会被使用，也就是说不会带来查询速度的提升。

##### Local Indexing本地索引

- Local indexing，本地索引，适用于写操作频繁以及空间受限制的场景。
- 与Global indexing一样，Phoenix会自动判定在进行查询的时候是否使用索引。
- 使用Local indexing时，索引表的数据和数据表的数据存放在相同的服务器中，这样避免了在写操作的时候往不同服务器的索引表中写索引带来的额外开销。
- 使用Local indexing的时候即使查询的字段不是索引字段索引表也会被使用，这会带来查询速度的提升，这点跟Global indexing不同。对于Local Indexing，一个数据表的所有索引数据都存储在一个单一的独立的可共享的表中。

#### 不可变索引与可变索引

##### immutable index不可变索引

- immutable index，不可变索引，适用于数据只增加不更新并且按照时间先后顺序存储（time-series data）的场景，如保存日志数据或者事件数据等。
- 不可变索引的存储方式是write one，append only。
- 当在Phoenix使用create table语句时指定IMMUTABLE_ROWS = true表示该表上创建的索引将被设置为不可变索引。
- 不可变索引分为Global immutable index和Local immutable index两种。
- Phoenix默认情况下如果在create table时不指定IMMUTABLE_ROW = true时，表示该表为mutable。

##### mutable index可变索引(默认)

- mutable index，可变索引，适用于数据有增删改的场景。
- Phoenix默认情况创建的索引都是可变索引，除非在create table的时候显式地指定IMMUTABLE_ROWS = true。
- 可变索引同样分为Global mutable index和Local mutable index两种。

#### 配置HBase支持Phoenix二级索引

##### 修改配置文件

如果要启用phoenix的二级索引功能，需要修改配置文件hbase-site.xml。（每一个节点都要修改）

```
vim /kkb/install/hbase-1.2.0-cdh5.14.2/conf/hbase-site.xml
```

```xml
<!-- 添加配置 -->
<property>
	<name>hbase.regionserver.wal.codec</name>
	<value>org.apache.hadoop.hbase.regionserver.wal.IndexedWALEditCodec</value>
</property>
<property>
   <name>hbase.region.server.rpc.scheduler.factory.class</name>
   <value>org.apache.hadoop.hbase.ipc.PhoenixRpcSchedulerFactory</value>
</property>
<property>
		<name>hbase.rpc.controllerfactory.class</name>
		<value>org.apache.hadoop.hbase.ipc.controller.ServerRpcControllerFactory</value>
</property>
```

##### 重启hbase

完成上述修改后重启hbase集群使配置生效。

```sh
stop-hbase.sh
start-hbase.sh
```



#### 准备实战数据

##### 在phoenix中创建表

首先，在phoenix中创建一个user表。

```sql
[hadoop@node02 ~]$ /kkb/install/apache-phoenix-4.14.0-cdh5.14.2-bin/bin/sqlline.py node01:2181

0: jdbc:phoenix:node01:2181> create  table user (
"session_id" varchar(100) not null primary key, 
"f"."cookie_id" varchar(100), 
"f"."visit_time" varchar(100), 
"f"."user_id" varchar(100), 
"f"."age" varchar(100), 
"f"."sex" varchar(100), 
"f"."visit_url" varchar(100), 
"f"."visit_os" varchar(100), 
"f"."browser_name" varchar(100),
"f"."visit_ip" varchar(100), 
"f"."province" varchar(100),
"f"."city" varchar(100),
"f"."page_id" varchar(100), 
"f"."goods_id" varchar(100),
"f"."shop_id" varchar(100)) column_encoded_bytes=0;
```

##### 导入测试数据

将资料当中的user50w.csv 这个文件上传到node02的/tmp/ 这个路径下, 该CSV文件中有50万条记录。

在node02执行以下命令，导入这50W条的测试数据。

```shell
[hadoop@node02 tmp]$ /kkb/install/apache-phoenix-4.14.0-cdh5.14.2-bin/bin/psql.py -t USER node01:2181 /tmp/user50w.csv
```

```sql
0: jdbc:phoenix:node01:2181> select * from USER limit 3;
+---------------------------------------+---------------------+--------------------
|              session_id               |      cookie_id      |      visit_time    
+---------------------------------------+---------------------+--------------------
| 000036bd-9ede-4d2e-aac4-110b1924c35d  | 000036bd-9ede-4d2e  | 2016-12-10 07:59:14
| 00003aa1-aacd-4f48-8057-148d8012abcf  | 00003aa1-aacd-4f48  | 2016-12-10 08:25:57
| 0000417b-4412-445e-8431-4d9d7459ff40  | 0000417b-4412-445e  | 2016-12-10 09:57:18
+---------------------------------------+---------------------+--------------------

--+--------------------+------+---------+------------+-----------+-----------
  |      user_id       | age  |   sex   | visit_url  | visit_os  | browser_na
--+--------------------+------+---------+------------+-----------+-----------
  | 06fefc79-1-415367  | 24   | female  | i.jsp      | Unix      | Safari    
  | 6ef12440-c-392389  | 13   | male    | g.jsp      | Unix      | Firefox   
  | b705afce-2-147636  | 66   | female  | b.jsp      | Linux     | IE        
--+--------------------+------+---------+------------+-----------+-----------


----+------------------+-+
me  |     visit_ip     | |
----+------------------+-+
    | 123.233.112.235  | |
    | 36.62.27.138     | |
    | 210.27.13.6      | |
----+------------------+-+
```





#### 实战1:Global Indexing测试

##### 添加二级索引前：

在为表USER创建secondary index之前，先看看查询一条数据所需的时间。在node02服务器，进入phoenix的客户端，然后执行以下sql语句，查询数据，查看耗费时间。

从下面可以看到，耗时8.157s。

```shell
0: jdbc:phoenix:node01:2181> select * from user where "cookie_id" = '99738fd1-2084-44e9';
+---------------------------------------+---------------------+----------------------+
|              session_id               |      cookie_id      |      visit_time      |
+---------------------------------------+---------------------+----------------------+
| 99738fd1-2084-44e9-90b7-3cd43d36d0f0  | 99738fd1-2084-44e9  | 2016-12-10 08:51:11  |
+---------------------------------------+---------------------+----------------------+

--------------------+------+---------+------------+-----------+
      user_id       | age  |   sex   | visit_url  | visit_os  |
--------------------+------+---------+------------+-----------+
 371e963d-c-487065  | 47   | female  | i.jsp      | Linux     |
--------------------+------+---------+------------+-----------+

---------------+-----------------+--+
 browser_name  |    visit_ip     |  |
---------------+-----------------+--+
 Chrome        | 106.86.176.113  |  |
---------------+-----------------+--+
1 row selected (8.157 seconds)
```

我们可以通过explain来查看执行逻辑计划,从下图可以看到，先进行了全表扫描再通过过滤器来筛选出目标数据，显示这种查询方式效率是很低的。

```sql
## 语法格式：EXPLAIN sql语句。
0: jdbc:phoenix:node01:2181> explain select * from user where "cookie_id" = '99738fd1-2084-44e9';
```

![image-20200305181311235](hbase.assets/image-20200305181311235.png)



##### 添加二级索引后：

进入到phoenix的客户端，然后执行以下命令对cookie_id列创建索引。

```sql
0: jdbc:phoenix:node01:2181> create index USER_COOKIE_ID_INDEX on USER ("f"."cookie_id"); 
## USER_COOKIE_ID_INDEX是用来作为索引表的名称，自己随便定义

#可以看到，多了一个索引表 USER_COOKIE_ID_INDEX
0: jdbc:phoenix:node01:2181> !tables
+------------+--------------+-----------------------+---------------+----------+
| TABLE_CAT  | TABLE_SCHEM  |      TABLE_NAME       |  TABLE_TYPE   | REMARKS  |
+------------+--------------+-----------------------+---------------+----------+
|            |              | USER_COOKIE_ID_INDEX  | INDEX         |          |
|            | SYSTEM       | CATALOG               | SYSTEM TABLE  |          |
|            | SYSTEM       | FUNCTION              | SYSTEM TABLE  |          |
|            | SYSTEM       | LOG                   | SYSTEM TABLE  |          |
|            | SYSTEM       | SEQUENCE              | SYSTEM TABLE  |          |
|            | SYSTEM       | STATS                 | SYSTEM TABLE  |          |
|            |              | USER                  | TABLE         |          |
|            |              | USER_PHOENIX          | TABLE         |          |
|            |              | employee              | TABLE         |          |
+------------+--------------+-----------------------+---------------+----------+

#查看索引表数据:
0: jdbc:phoenix:node01:2181> select * from USER_COOKIE_ID_INDEX limit 5;
+---------------------+---------------------------------------+
|     f:cookie_id     |              :session_id              |
+---------------------+---------------------------------------+
| 000036bd-9ede-4d2e  | 000036bd-9ede-4d2e-aac4-110b1924c35d  |
| 00003aa1-aacd-4f48  | 00003aa1-aacd-4f48-8057-148d8012abcf  |
| 0000417b-4412-445e  | 0000417b-4412-445e-8431-4d9d7459ff40  |
| 0000a391-4fd8-44bd  | 0000a391-4fd8-44bd-9970-da721fbe860d  |
| 0000ce5e-3121-4da9  | 0000ce5e-3121-4da9-8ffb-19c9a3621548  |
+---------------------+---------------------------------------+
```

再次执行查询"cookie_id"='99738fd1-2084-44e9'的数据记录

```sql
0: jdbc:phoenix:node01:2181> select "cookie_id" from user where "cookie_id" = '99738fd1-2084-44e9';
+---------------------+
|      cookie_id      |
+---------------------+
| 99738fd1-2084-44e9  |
+---------------------+
1 row selected (0.031 seconds)
```

从上面代码块可以看到，同样的查询语句，但是创建了二级索引后，查询时间由8.157秒左右减少到了0.031s，达到毫秒级别。

查看执行计划,可以看到SCAN OVER USER_COOKIE_ID_IND的字眼，表明先扫描了索引表。

```sql
0: jdbc:phoenix:node01:2181> explain select "cookie_id" from user where "cookie_id" = '99738fd1-2084-44e9';
+------------------------------------------------------------------------------+
|                                                  PLAN                        |
+------------------------------------------------------------------------------+
| CLIENT 1-CHUNK PARALLEL 1-WAY ROUND ROBIN RANGE SCAN OVER USER_COOKIE_ID_IND |
|     SERVER FILTER BY FIRST KEY ONLY                                          |
+------------------------------------------------------------------------------+
```

##### 注意事项

对于全局索引，select语句所带的字段必须包含在覆盖索引内，否则查询不会用到索引表。如下：

例子1：虽然cookie_id是索引字段，但age不是索引字段，所以不会使用到索引。

```sql
0: jdbc:phoenix:node01:2181> select "cookie_id","age" from user where "cookie_id"='99738fd1-2084-44e9';
+---------------------+------+
|      cookie_id      | age  |
+---------------------+------+
| 99738fd1-2084-44e9  | 47   |
+---------------------+------+
1 row selected (2.909 seconds)


0: jdbc:phoenix:node01:2181> explain select "cookie_id","age" from user where "cookie_id"='99738fd1-2084-44e9';
+------------------------------------------------------------------------------+
|                                            PLAN                              |
+------------------------------------------------------------------------------+
| CLIENT 2-CHUNK 289067 ROWS 314572810 BYTES PARALLEL 1-WAY ROUND ROBIN FULL S |
|     SERVER FILTER BY f."cookie_id" = '99738fd1-2084-44e9'                    |
+------------------------------------------------------------------------------+
2 rows selected (0.024 seconds)
```



#### 实战2:Local Indexing测试

##### 添加二级索引前：

查看普通查询时间，3.569 seconds,再看到执行计划，是FULL SCAN,先进行了全表扫描再通过过滤器来筛选出目标数据。

```sql
0: jdbc:phoenix:node01:2181> select * from user where "user_id"='371e963d-c-487065';
+---------------------------------------+---------------------+----------------+
|              session_id               |      cookie_id      |      visit_tim |
+---------------------------------------+---------------------+----------------+
| 99738fd1-2084-44e9-90b7-3cd43d36d0f0  | 99738fd1-2084-44e9  | 2016-12-10 08: |
+---------------------------------------+---------------------+----------------+
1 row selected (3.569 seconds)


0: jdbc:phoenix:node01:2181> explain select * from user where "user_id"='371e963d-c-4
+------------------------------------------------------------------------------------
|                                          PLAN                                      
+------------------------------------------------------------------------------------
| CLIENT 1-CHUNK PARALLEL 1-WAY ROUND ROBIN RANGE SCAN OVER USER [1,'371e963d-c-48706
|     SERVER FILTER BY FIRST KEY ONLY                                                
+------------------------------------------------------------------------------------
```



##### 添加二级索引后：

本地索引要加local关键字，index前面不加关键字就是全局索引。

```sql
create local index USER_USER_ID_INDEX on USER ("f"."user_id");
```

再次执行查询"user_id"='371e963d-c-487065'的数据记录,时间缩减至了0.351 seconds，毫秒级别。

```sql
0: jdbc:phoenix:node01:2181> select * from user where "user_id"='371e963d-c-487065';
+---------------------------------------+---------------------+--------------------+
|              session_id               |      cookie_id      |      user_id       |
+---------------------------------------+---------------------+--------------------+
| 99738fd1-2084-44e9-90b7-3cd43d36d0f0  | 99738fd1-2084-44e9  | 371e963d-c-487065  |
+---------------------------------------+---------------------+--------------------+
1 row selected (0.351 seconds)

0: jdbc:phoenix:node01:2181> explain select * from user where "user_id"='371e963d-c-487065';
+------------------------------------------------------------------------------------
|                                          PLAN                                      
+------------------------------------------------------------------------------------
| CLIENT 1-CHUNK PARALLEL 1-WAY ROUND ROBIN RANGE SCAN OVER USER [1,'371e963d-c-48706
|     SERVER FILTER BY FIRST KEY ONLY                                                
+------------------------------------------------------------------------------------
```

##### 注意事项

对于本地索引，查询的字段不包含在索引表中，也可以使用索引表。

```sql
0: jdbc:phoenix:node01:2181> select "user_id","age","sex" from user where "user_id"='371e963d-c-487065';
+--------------------+------+---------+
|      user_id       | age  |   sex   |
+--------------------+------+---------+
| 371e963d-c-487065  | 47   | female  |
+--------------------+------+---------+
1 row selected (0.045 seconds)
```

```sql
0: jdbc:phoenix:node01:2181> explain select "user_id","age","sex" from user where "user_id"='371e963d-c-487065';
+------------------------------------------------------------------------------------
|                                          PLAN                                      
+------------------------------------------------------------------------------------
| CLIENT 1-CHUNK PARALLEL 1-WAY ROUND ROBIN RANGE SCAN OVER USER [1,'371e963d-c-48706
|     SERVER FILTER BY FIRST KEY ONLY                                                
+------------------------------------------------------------------------------------
```



#### 如何确保查询使用二级索引

要想让一个查询使用index，有三种方式实现。

###### 第一种方式：创建覆盖索引

如果在某次查询中，查询项或者查询条件中包含除被索引列之外的列（主键MY_PK除外）。默认情况下，该查询会触发full table scan（全表扫描），但是使用covered index覆盖索引则可以避免全表扫描。

创建包含某个字段的覆盖索引,创建方式如下：

```sql
create index USER_COOKIE_ID_AGE_INDEX on USER ("f"."cookie_id") include("f"."age");


#查询索引表数据: 可以看到，比一般的索引表多出了一列，在这里是f:age
0: jdbc:phoenix:node01:2181> select * from USER_COOKIE_ID_AGE_INDEX limit 5;
+---------------------+---------------------------------------+--------+
|     f:cookie_id     |              :session_id              | f:age  |
+---------------------+---------------------------------------+--------+
| 000036bd-9ede-4d2e  | 000036bd-9ede-4d2e-aac4-110b1924c35d  | 24     |
| 00003aa1-aacd-4f48  | 00003aa1-aacd-4f48-8057-148d8012abcf  | 13     |
| 0000417b-4412-445e  | 0000417b-4412-445e-8431-4d9d7459ff40  | 66     |
| 0000a391-4fd8-44bd  | 0000a391-4fd8-44bd-9970-da721fbe860d  | 36     |
| 0000ce5e-3121-4da9  | 0000ce5e-3121-4da9-8ffb-19c9a3621548  | 9      |
+---------------------+---------------------------------------+--------+
```

执行语句，查询数据

```sql
#查询的字段中包含索引的列，查询条件也包含索引的列时，查询会用到索引表
0: jdbc:phoenix:node01:2181> select "age" from user where "cookie_id"='99738fd1-2084-44e9';
+------+
| age  |
+------+
| 47   |
+------+
1 row selected (0.058 seconds)

## 查询的字段包含了不再索引表中的列，如下面中的sex，不会用索引表。
0: jdbc:phoenix:node01:2181> select "age","sex" from user where "cookie_id"='99738fd1-2084-44e9';
+------+---------+
| age  |   sex   |
+------+---------+
| 47   | female  |
+------+---------+
1 row selected (2.747 seconds)
```



###### 第二种方式：在查询中使用index

在select和column_name之间加上/\*+ Index(<表名> <index表名>)*/，通过这种方式强制使用索引。

```sql
0: jdbc:phoenix:node01:2181> select /*+ index(user,USER_COOKIE_ID_AGE_INDEX) */ "age" from user where "cookie_id"='99738fd1-2084-44e9';
+------+
| age  |
+------+
| 47   |
+------+
1 row selected (0.041 seconds)

0: jdbc:phoenix:node01:2181> explain select /*+ index(user,USER_COOKIE_ID_AGE_INDEX) */ "age" from user where "cookie_id"='99738fd1-2084-44e9';
+------------------------------------------------------------------------------+
|                                                    PLAN                      |
+------------------------------------------------------------------------------+
| CLIENT 1-CHUNK PARALLEL 1-WAY ROUND ROBIN RANGE SCAN OVER USER_COOKIE_ID_AGE |
+------------------------------------------------------------------------------+
```

当用户明确知道表中数据较少且符合检索条件时才适用，此时的性能才是最佳的。



###### 第三种方式：使用本地索引 (创建Local Indexing 索引)

- 详细见上面



#### 索引重建

Phoenix的索引重建是把索引表清空后重新装配数据。

```sql
alter index USER_COOKIE_ID_INDEX on user rebuild;
```

#### 删除索引

删除某个表的某张索引，语法: drop index 索引名称 on 表名

```sql
drop index USER_COOKIE_ID_INDEX on user;
```

如果表中的一个索引列被删除，则索引也将被自动删除。

如果删除的是覆盖索引上的列，则此列将从覆盖索引中被自动删除。

#### 索引性能调优

- 一般来说，索引已经很快了，不需要特别的优化。
- 这里也提供了一些方法，让你在面对特定的环境和负载的时候可以进行一些调优。下面的这些需要在hbase-site.xml文件中设置，针对所有的服务器。

```
1. index.builder.threads.max 
创建索引时，使用的最大线程数。 
默认值: 10。

2. index.builder.threads.keepalivetime 
创建索引的创建线程池中线程的存活时间，单位：秒。 
默认值: 60

3. index.writer.threads.max 
写索引表数据的写线程池的最大线程数。 
更新索引表可以用的最大线程数，也就是同时可以更新多少张索引表，数量最好和索引表的数量一致。 
默认值: 10

4. index.writer.threads.keepalivetime 
索引写线程池中，线程的存活时间，单位：秒。
默认值：60
 
5. hbase.htable.threads.max 
每一张索引表可用于写的线程数。 
默认值: 2,147,483,647

6. hbase.htable.threads.keepalivetime 
索引表线程池中线程的存活时间，单位：秒。 
默认值: 60

7. index.tablefactory.cache.size 
允许缓存的索引表的数量。 
增加此值，可以在写索引表时不用每次都去重复的创建htable，这个值越大，内存消耗越多。 
默认值: 10

8. org.apache.phoenix.regionserver.index.handler.count 
处理全局索引写请求时，可以使用的线程数。 
默认值: 30
```

## HBase协处理器

#### 为什么要有协处理器？

官网文档(<http://hbase.apache.org/book.html#cp>)

Hbase 作为列族数据库最经常被人诟病的特性包括：

- 无法轻易建立“二级索引”
- 难以执行求和、计数、排序等操作。比如，在旧版本的(<0.92)Hbase 中，统计数据表的总行数，需要使用 Counter 方法，执行一次 MapReduce Job 才能得到。

- 虽然 HBase 在数据存储层中集成了MapReduce，能够有效用于数据表的分布式计算。然而在很多情况下，做一些简单的相加或者聚合计算的时候， 如果直接将计算过程**放置在server端**，能够减少通讯开销，从而获得很好的性能提升。
- 于是， HBase 在 0.92 之后引入了协处理器(coprocessors)，实现一 些激动人心的新特性：能够轻易建立二次索引、复杂过滤器(谓词下推)以及访问控制等。

#### 协处理器简单介绍

利用协处理器，用户可以编写运行在 HBase Server 端的代码。协处理器允许用户在region服务器上运行自己的代码，允许用户执行region级别的操作，并且可以使用与RDBMS中触发器(trigger)类似的功能。

Endpoint 协处理器类似传统数据库中的存储过程，客户端可以调用这些 Endpoint 协处理器执行一段 Server 端代码，并将 Server 端代码的结果返回给客户端进一步处理，最常见的用法就是进行聚集操作。如果没有协处理器，当用户需要找出一张表中的最大数据，即 max 聚合操作，就必须进行全表扫描，在客户端代码内遍历扫描结果，并执行求最大值的操作。这样的方法无法利用底层集群的并发能力，而将所有计算都集中到 Client 端统一执行，势必效率低下。利用 Coprocessor，用户可以将求最大值的代码部署到 HBase Server 端，HBase 将利用底层 cluster 的多个节点并发执行求最大值的操作。即在每个 Region 范围内执行求最大值的代码，将每个 Region 的最大值在 Region Server 端计算出，仅仅将该 max 值返回给客户端。在客户端进一步将多个 Region 的最大值进一步处理而找到其中的最大值。这样整体的执行效率就会提高很多。

另外一种协处理器叫做 Observer Coprocessor，这种协处理器类似于传统数据库中的触发器，当发生某些事件的时候这类协处理器会被 Server 端调用。Observer Coprocessor 就是一些散布在 HBase Server 端代码中的 hook 钩子，在固定的事件发生时被调用。比如：put 操作之前有钩子函数 prePut，该函数在 put 操作执行前会被 Region Server 调用；在 put 操作之后则有 postPut 钩子函数。

#### 协处理器类型

协处理器框架提供了一些类，用户可以通过继承这些类来扩展自己的功能。主要分为两大类：observer和endpoint。

##### observer协处理器

Observer 类似于传统数据库中的触发器trigger，当发生某些事件的时候这类协处理器会被Server端调用。Observer Coprocessor就是一些散布在HBase Server端代码中的 hook 钩子，在固定的事件发生时被调用。

比如： put 操作之前有钩子函数 prePut，该函数在put操作执行前会被Region Server调用；在 put 操作之后则有 postPut 钩子函数。假设preput()是一个清空函数，那么经过preput后，在region上put的时候，就不会有数据被插入。那么postput()也可以在put之后执行某一些操作。

<img src="hbase.assets/image-20200306131541683.png" alt="image-20200306131541683" style="zoom: 67%;" />

以 HBase0.92 版本为例，它提供了三种observer观察者接口：

- RegionObserver：提供客户端的数据操纵事件钩子： Get、 Put、 Delete、 Scan 等。
- WALObserver：提供 WAL 相关操作钩子。
- MasterObserver：提供 DDL类型的操作钩子。如创建、删除、修改数据表等。
- 到 0.96 版本又新增一个 RegionServerObserver

![](hbase.assets/Image201911151202.png)



下图是以 RegionObserver 为例子讲解 Observer 这种协处理器的原理：

![1122015-20170511100919222-711579099](hbase.assets/1122015-20170511100919222-711579099.png)

##### endpoint协处理器

- Endpoint协处理器类似传统数据库中的存储过程，客户端可以调用这些 Endpoint 协处理器执行一段 Server 端代码，并将 Server 端代码的结果返回给客户端进一步处理
- 最常见的用法就是进行聚集操作。
  - 如果没有协处理器，当用户需要找出一张表中的最大数据，即max 聚合操作，就必须进行全表扫描，在客户端代码内遍历扫描结果，并执行求最大值的操作。这样的方法无法利用底层集群的并发能力，而将所有计算都集中到 Client 端统一执行，势必效率低下。
  - 利用 Coprocessor，用户可以将求最大值的代码部署到 HBase Server 端，HBase将利用底层cluster 的多个节点并发执行求最大值的操作。即在每个 Region范围内执行求最大值的代码，将每个 Region 的最大值在 Region Server 端计算出，仅仅将该max值返回给客户端。在客户端进一步将多个Region的最大值进一步处理而找到其中的最大值。这样整体的执行效率就会提高很多

endpoint示意图：

<img src="hbase.assets/image-20200306033214108.png" alt="image-20200306033214108" style="zoom: 67%;" />

##### 两种协处理器的总结

- Observer允许集群在正常的客户端操作过程中可以有不同的行为表现
- Endpoint允许扩展集群的能力，对客户端应用开放新的运算命令
- observer类似于 RDBMS 中的触发器，主要在服务端工作
- endpoint类似于 RDBMS 中的存储过程，主要在 client 端工作
- observer可以实现权限管理、优先级设置、监控、 ddl 控制、 二级索引等功能
- endpoint可以实现 min、 max、 avg、 sum、 distinct、 group by等功能



#### 协处理器加载方式  

协处理器的加载方式有两种

- 静态加载方式（ Static Load）；静态加载的协处理器称之为 System Coprocessor
- 动态加载方式 （ Dynamic Load）；动态加载的协处理器称 之为 Table Coprocessor

##### 静态加载（不常用）

静态加载是通过修改 hbase-site.xml 这个文件来实现， 如启动全局 aggregation，能过操纵所有的表数据。只需要在hbase-site.xml里面添加以下配置即可

注意：修改完配置之后需要**重启HBase集群**,这就是静态加载不常用的原因，因为企业中一般不允许停掉集群。

如下，静态加载RegionObserver和endpoint

```xml
<property>
	<name>hbase.coprocessor.region.classes</name>
	<value>org.apache.hadoop.hbase.coprocessor.AggregateImplementation</value>
</property>
```

- 为所有table加载了一个 cp class协处理器的类；此外可以用” ,”分割加载多个 class
- 另外，属性hbase.coprocessor.wal.classes用于加载WALObservers
- 属性hbase.coprocessor.master.classes用于加载MasterObservers

##### 动态加载

两种方式：①通过hbase shell；②通过编程

若要实现启用表aggregation，只对特定的表生效。

####### 动态加载方式一：通过 HBase Shell 来实现。

disable 指定表。

```ruby
hbase> disable 'mytable'
```

添加 aggregation

```ruby
hbase> alter 'mytable', METHOD => 'table_att', 'Coprocessor'=>'hdfs://<namenode>:<port>/
user/<hadoop-user>/coprocessor.jar| org.myname.hbase.Coprocessor.RegionObserverExample|1073741823|
arg1=1,arg2=2'

#table_att表示要修改table属性
#'Coprocessor'表示属性的名称
## hdfs://<namenode>:<port>/user/<hadoop-user>/coprocessor.jar表示协处理器的jar包在hdfs上的位置
#org.myname.hbase.Coprocessor.RegionObserverExample表示协处理器的类
#1073741823表示权值，因为协处理器可以有多个，那么这个值就是判断谁先执行谁后执行，是可选参数
#arg1=1,arg2=2，表示要传入到类的参数，是可选参数
#Coprocessor属性的值是通过 | 来进行分隔的。
```

重启指定表 

```ruby
hbase> enable 'mytable'
```

####### 动态加载方式二：通过编码

```java
...
Path path = new Path("hdfs://coprocessor_path");
TableDescriptor hTableDescriptor = new HTableDescriptor(tableName);
hTableDescriptor.addCoprocessor(RegionObserverExample.class.getCanonicalName(), path, Coprocessor.PRIORITY_USER, null);
...
//协处理器名称：RegionObserverExample.class.getCanonicalName()
//协处理器jar包在hdfs的位置
//权值
//参数：null
```

#### 卸载协处理器

```sql
disable 'test'
alter 'test',METHOD=>'table_att_unset',NAME=>'coprocessor$1'
enable 'test'


#coprocessor$1是协处理器名称
```

#### Observer协处理器实战

<img src="hbase.assets/xdfsdfsdf.png" alt="xdfsdfsdf" style="zoom:70%;" />

##### 实战需求：

通过协处理器Observer实现每次向hbase当中一张表插入数据时，都将数据复制一份保存到另外一张表当中去；但是只取第一张表当中的部分列数据，保存到第二张表当中去。

在下面实战中，是将第一张表的info列族的age列复制到第二个表。

##### 第一步：创建两张表

```ruby
hbase(main):053:0> create 'proc1','info'
```

```ruby
hbase(main):054:0> create 'proc2','info'
```

##### 第二步：创建maven工程

创建maven工程所用的repositories、dependencies、plugins跟之前的一样

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
            <groupId>org.apache.hbase</groupId>
            <artifactId>hbase-client</artifactId>
            <version>1.2.0-cdh5.14.2</version>
        </dependency>
        <dependency>
            <groupId>org.apache.hbase</groupId>
            <artifactId>hbase-server</artifactId>
            <version>1.2.0-cdh5.14.2</version>
        </dependency>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.testng</groupId>
            <artifactId>testng</artifactId>
            <version>6.14.3</version>
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
                    <!--    <verbal>true</verbal>-->
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-shade-plugin</artifactId>
                <version>2.2</version>
                <executions>
                    <execution>
                        <phase>package</phase>
                        <goals>
                            <goal>shade</goal>
                        </goals>
                        <configuration>
                            <filters>
                                <filter>
                                    <artifact>*:*</artifact>
                                    <excludes>
                                        <exclude>META-INF/*.SF</exclude>
                                        <exclude>META-INF/*.DSA</exclude>
                                        <exclude>META-INF/*/RSA</exclude>
                                    </excludes>
                                </filter>
                            </filters>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
```

##### 第三步：开发协处理器

协处理器的顶级接口是Coprocessor,被RegionServer等接口或类所继承，我们的实战要使用region级别的协处理器，因此我们选用实现了RegionServer接口的BaseRegionObserver类来开发协处理器，BaseRegionObserver类有很多方法，如preput(),postput(),preflush(),postflush()等等。

我们的实战需求是在给一张表插入数据时，将特定部分的数据复制到另一张表，因此我们只需要继承BaseRegionObserver类然后重写preput()方法即可。

![image-20200306165129234](hbase.assets/image-20200306165129234.png)

```java
package com.jimmy;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.Cell;
import org.apache.hadoop.hbase.CellUtil;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.*;
import org.apache.hadoop.hbase.coprocessor.BaseRegionObserver;
import org.apache.hadoop.hbase.coprocessor.ObserverContext;
import org.apache.hadoop.hbase.coprocessor.RegionCoprocessorEnvironment;
import org.apache.hadoop.hbase.regionserver.wal.WALEdit;

import java.io.IOException;
import java.util.List;

public class MyCoprocessor extends BaseRegionObserver {
    /**
     *
     * @param e 协处理器环境对象
     * @param put  put操作时的数据
     * @param edit
     * @param durability
     * @throws IOException
     */
    @Override
    public void prePut(ObserverContext<RegionCoprocessorEnvironment> e, Put put, WALEdit edit, Durability durability) throws IOException {
        //连接HBase
        Configuration conf= HBaseConfiguration.create();
        conf.set("hbase.zookeeper.quorum","node01:2181,node02:2181,node03:2181");
        Connection conne= ConnectionFactory.createConnection(conf);

        //获取Put对象中包含的info列族age列的数据
        List<Cell> cells=put.get("info".getBytes(),"age".getBytes());
        Cell versionLastCell=cells.get(0); //进一步获取最新版本的数据

        //获取要插入的另一个表proc2
        Table t2=conne.getTable(TableName.valueOf("proc2"));

        //往proc2中插入数据:
        Put putProc2=new Put(put.getRow()); //从上面的put对象获取行键并创建另一个Put对象
        putProc2.add(versionLastCell);//跟下面这行代码等价
        //putProc2.addColumn("info".getBytes(),"age".getBytes(), CellUtil.cloneValue(versionLastCell));
        t2.put(putProc2);

        //关闭资源
        t2.close();
        conne.close();
    }
}

```

##### 第四步：上传jar包到HDFS

```shell
cd /tmp/
rz
hdfs dfs -mkdir /CoprocessorData
hdfs dfs -put /tmp/original-MyCoprocessor-1.0-SNAPSHOT.jar /CoprocessorData
```

##### 第五步：挂载协处理器jar包到proc1表

查看还没加载协处理器前的proc1表的属性：

```ruby
hbase(main):001:0> describe 'proc1'
Table proc1 is ENABLED                                                          
proc1                                                                           
COLUMN FAMILIES DESCRIPTION                                                     
{NAME => 'info', BLOOMFILTER => 'ROW', VERSIONS => '1', IN_MEMORY => 'false', KE
EP_DELETED_CELLS => 'FALSE', DATA_BLOCK_ENCODING => 'NONE', TTL => 'FOREVER', CO
MPRESSION => 'NONE', MIN_VERSIONS => '0', BLOCKCACHE => 'true', BLOCKSIZE => '65
536', REPLICATION_SCOPE => '0'}                                                 
```

加载协处理器到proc1表并查看属性,可以看到多了一个属性TABLE_ATTRIBUTES => {coprocessor$1

```sh
hbase(main):002:0> alter 'proc1' ,METHOD=>'table_att','Coprocessor'=>'hdfs://node01:8020/CoprocessorData/original-MyCoprocessor-1.0-SNAPSHOT.jar|com.jimmy.MyCoprocessor|1001|'


hbase(main):003:0> describe 'proc1'
Table proc1 is ENABLED                                                          
proc1, {TABLE_ATTRIBUTES => {coprocessor$1 => 'hdfs://node01:8020/CoprocessorDat
a/original-MyCoprocessor-1.0-SNAPSHOT.jar|com.jimmy.MyCoprocessor|1001|'}       
COLUMN FAMILIES DESCRIPTION                                                     
{NAME => 'info', BLOOMFILTER => 'ROW', VERSIONS => '1', IN_MEMORY => 'false', KE
EP_DELETED_CELLS => 'FALSE', DATA_BLOCK_ENCODING => 'NONE', TTL => 'FOREVER', CO
MPRESSION => 'NONE', MIN_VERSIONS => '0', BLOCKCACHE => 'true', BLOCKSIZE => '65
536', REPLICATION_SCOPE => '0'} 
```



##### 第六步：向proc1表添加数据

第一种方式，通过hbase shell插入数据

```sh
put 'proc1', 'rk0001', 'info:name', 'zhangsan'
put 'proc1', 'rk0001', 'info:gender', 'female'
put 'proc1', 'rk0001', 'info:age', 20
put 'proc1', 'rk0002', 'info:age', 22
put 'proc1', 'rk0001', 'info:passwd', '123456'
```

第二种方式，通过javaAPI插入数据

```java
package com.jimmy;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.Connection;
import org.apache.hadoop.hbase.client.ConnectionFactory;
import org.apache.hadoop.hbase.client.Put;
import org.apache.hadoop.hbase.client.Table;
import org.apache.hadoop.hbase.util.Bytes;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class PutData {
    public void put() throws IOException {
        Configuration conf= HBaseConfiguration.create();
        conf.set("hbase.zookeeper.quorum","node01:2181,node02:2181,node03:2181");
        Connection conne= ConnectionFactory.createConnection(conf);
        Table t1=conne.getTable(TableName.valueOf("proc1"));

        Put rk0001_put=new Put("rk0001".getBytes());
      rk0001_put.addColumn("info".getBytes(),"name".getBytes(),"zhangsan".getBytes());
      rk0001_put.addColumn("info".getBytes(),"gender".getBytes(),"female".getBytes());
      rk0001_put.addColumn("info".getBytes(),"age".getBytes(),Bytes.toBytes(20));
      rk0001_put.addColumn("info".getBytes(),"passwd".getBytes(),"123456".getBytes());

     	Put rk0002_put=new Put("rk0002".getBytes());
        rk0002_put.addColumn("info".getBytes(),"age".getBytes(),Bytes.toBytes(22));

        List<Put> puts=new ArrayList<>();
        puts.add(rk0001_put);
        puts.add(rk0002_put);
        t1.put(puts);
        
        t1.close();
        conne.close();
    }
}

```

##### 第七步：查看proc1与proc2表的数据

可以看到，上面步骤往proc1表插入数据的同时，也往proc2表插入了数据，并且只插入info列族age列的数据。这就是我们定义的协处理器类的重写prePut()方法的作用。

```sh
hbase(main):001:0> scan 'proc1'
ROW                   COLUMN+CELL                                               
 rk0001               column=info:age, timestamp=1583487671939, value=20        
 rk0001               column=info:gender, timestamp=1583487657073, value=female 
 rk0001               column=info:name, timestamp=1583487650422, value=zhangsan 
 rk0001               column=info:passwd, timestamp=1583487684867, value=123456 
 rk0002               column=info:age, timestamp=1583487677828, value=22        
2 row(s) in 0.3000 seconds

hbase(main):002:0> scan 'proc2'
ROW                   COLUMN+CELL                                               
 rk0001               column=info:age, timestamp=1583487671883, value=20        
 rk0002               column=info:age, timestamp=1583487677812, value=22        
2 row(s) in 0.0880 seconds
```

##### 第七步：卸载协处理器

如果需要卸载我们的协处理器，那么进入hbase的shell命令行，执行以下命令即可

```ruby
disable 'proc1'
alter 'proc1', METHOD=>'table_att_unset', NAME=>'coprocessor$1'
enable 'proc1'
```



## HBase的数据备份（了解）

#### 基于HBase提供的类对表进行备份

####### 全量备份

（1）从hbase表导出数据到HDFS备份文件

~~~shell
[hadoop@node01 tmp]$ hbase org.apache.hadoop.hbase.mapreduce.Export myuser /hbase_data/myuser_bak

[hadoop@node01 tmp]$ hdfs dfs -ls /hbase_data
drwxr-xr-x   - hadoop supergroup          0 2020-03-06 18:17 /hbase_data/myuser_bak

[hadoop@node01 tmp]$ hdfs dfs -ls /hbase_data/myuser_bak
-rw-r--r--   3 hadoop supergroup   0 2020-03-06 18:17 /hbase_data/myuser_bak/_SUCCESS
-rw-r--r--   3 hadoop supergroup   1696 2020-03-06 18:17 /hbase_data/myuser_bak/part-m-00000
~~~

（2）从数据备份文件导入数据到hbase表

```ruby
## 创建一个表，并将myuser表的备份数据导入到该表，因为myuser表有两个列族，'f1','f2'，因此我们也要创建对应的列族
hbase(main):002:0> create 'bak_test','f1','f2'

#导入备份数据到新表
[hadoop@node01 tmp]$ hbase org.apache.hadoop.hbase.mapreduce.Driver import bak_test /hbase_data/myuser_bak/* 


#从下面可以看到，’bak_test'表本来时空的，后来从备份文件导入了数据。
hbase(main):001:0> get 'bak_test','0002','f1'
COLUMN                CELL                                                      
 f1:age               timestamp=1582837532912, value=\x00\x00\x00\x1E           
 f1:id                timestamp=1582837532912, value=\x00\x00\x00\x01           
 f1:name              timestamp=1582837532912, value=\xE6\x9B\xB9\xE6\x93\x8D
```



####### 增量备份

以上都是对数据进行了全量备份，后期也可以实现表的**增量数据备份**，增量备份跟全量备份操作差不多，只不过要在后面加上时间戳。

例如：HBase数据导出到HDFS

~~~
hbase org.apache.hadoop.hbase.mapreduce.Export test /hbase_data/test_bak_increment 开始时间戳  结束时间戳
~~~


#### 基于snapshot快照对表进行备份（常用）

通过snapshot快照的方式实现HBase数据的迁移和拷贝。这种方式比较常用，效率高，也是最为推荐的数据迁移方式。 Snapshot 相关操作（export 除外）的实现并不涉及到对 table 实际数据的拷贝，而是仅仅拷贝一些元数据。

HBase的snapshot其实就是一组==metadata==信息的集合（文件列表），通过这些metadata信息的集合，就能将表的数据回滚到snapshot那个时刻的数据。

* 首先我们要了解一下所谓的HBase的LSM类型的系统结构，我们知道在HBase中，数据是先写入到Memstore中，当Memstore中的数据达到一定条件，就会flush到HDFS中，形成HFile，后面就不允许原地修改或者删除了。
* 如果要更新或者删除的话，只能追加写入新文件。既然数据写入以后就不会在发生原地修改或者删除，这就是snapshot做文章的地方。做snapshot的时候，只需要给快照表对应的所有文件创建好指针（元数据集合），恢复的时候只需要根据这些指针找到对应的文件进行恢复就Ok。这是原理的最简单的描述，下图是描述快照时候的简单流程：	

![snapshot](hbase.assets/snapshot.png)



#### 快照实战

创建表的snapshot

~~~
hbase(main):002:0> snapshot 'myuser','myuser_snapshot1'
~~~

查看HBase存在的snapshot

  ~~~
hbase(main):003:0> list_snapshots
SNAPSHOT              TABLE + CREATION TIME                                     
 myuser_snapshot1     myuser (Fri Mar 06 20:08:42 +0800 2020)  
  ~~~

查找以my开头的snapshot

```
hbase(main):005:0> list_snapshots 'my.*'
SNAPSHOT              TABLE + CREATION TIME                                     
 myuser_snapshot1     myuser (Fri Mar 06 20:08:42 +0800 2020)   
```

将myuser表恢复到snapshot状态

ps:这里需要对表进行disable操作，先把表置为不可用状态，然后在进行进行restore_snapshot的操作

```
disable 'myuser'
restore_snapshot 'myuser_snapshot1'
enable 'myuser'
```

删除snapshot

  ~~~
delete_snapshot 'snapshotName'
  ~~~

迁移 snapshot

  ~~~
  hbase org.apache.hadoop.hbase.snapshot.ExportSnapshot \
  -snapshot snapshotName  \
  -copy-from hdfs://src-hbase-root-dir/hbase \
  -copy-to hdfs://dst-hbase-root-dir/hbase \
  -mappers 1 \
  -bandwidth 1024
  
  例如：
  hbase org.apache.hadoop.hbase.snapshot.ExportSnapshot \
  -snapshot test  \
  -copy-from hdfs://node01:8020/hbase \
  -copy-to hdfs://node01:8020/hbase1 \
  -mappers 1 \
  -bandwidth 1024
  ~~~

注意：这种方式用于将快照表迁移到==另外一个集群==的时候使用，使用MR进行数据的拷贝，速度很快，使用的时候记得设置好bandwidth参数，以免由于网络打满导致的线上业务故障。

将snapshot使用bulkload的方式导入

  ~~~
  hbase org.apache.hadoop.hbase.mapreduce.LoadIncrementalHFiles \
  hdfs://dst-hbase-root-dir/hbase/archive/datapath/tablename/filename \
  tablename
  
  例如：
  创建一个新表
  create 'newTest','f1','f2'
  hbase org.apache.hadoop.hbase.mapreduce.LoadIncrementalHFiles hdfs://node01:8020/hbase1/archive/data/default/test/6325fabb429bf45c5dcbbe672225f1fb newTest
  ~~~



## HBase二级索引

![hbase寻址](hbase.assets/hbase寻址.png)

- HBase表后期按照rowkey查询性能是最高的。rowkey就相当于hbase表的一级索引
- 但是在实际的工作中，我们做的查询基本上都是按照一定的条件进行查找，无法事先知道满足这些条件的rowkey是什么
- 正常是可以通过hbase过滤器去实现。但是效率非常低，这是由于查询的过程中需要在底层进行大量的文件扫描。
- HBase的二级索引
  - 为了HBase的数据查询更高效、适应更多的场景，诸如使用==非rowkey字段检索==也能做到秒级响应，或者支持各个字段进行模糊查询和多字段组合查询等， 因此需要在HBase上面构建二级索引， 以满足现实中更复杂多样的业务需求。
  - hbase的二级索引其本质就是==建立HBase表中列与行键之间的映射关系==。
  - 以空间换时间，提高查询的效率



![](hbase.assets/二级索引思想-1583432325441.png)

- 构建hbase二级索引方案
  - MapReduce方案 
  - Hbase Coprocessor(协处理器)方案 
  - Solr+hbase方案
  - ES+hbase方案
  - Phoenix+hbase方案(参见附件，phoenix安装部署使用文档)

## HBase的namespace

### namespace基本介绍

在HBase中，namespace命名空间指对一组表的逻辑分组，类似RDBMS中的database，方便对表在业务上划分。

Apache HBase从0.98.0, 0.95.2两个版本号开始支持namespace级别的授权操作，HBase**全局管理员**能够创建、改动和回收namespace的授权。

如HBase的元数据存放的表属于hbase组，要查询该表，方式如下：

```ruby
scan 'hbase:meta'
```

/hbase/data是hbase存储数据的核心目录。查看该目录可以发现两个默认预置的命名空间：default、hbase。在hbase中创建的表默认属于default这个命名空间逻辑组。hbase的元数据信息表meta属于‘hbase’这个命名空间逻辑组。

![image-20200306214324739](hbase.assets/image-20200306214324739.png)

![image-20200306214814412](hbase.assets/image-20200306214814412.png)



### namespace的作用

1. 配额管理：限制一个namespace可以使用的资源，比如说可以包含多少个region和table等等。
2. 命名空间安全管理：提供了另一个层面的多租户安全管理
3. Region服务器组：一个命名或一张表，可以被固定到一组RegionServers上（只能存放到某几个RegionServer)，从而保证了数据隔离性

### namespace的基本操作

创建命名空间

```ruby
create_namespace 'nametest'
```

查看命名空间信息

```ruby
hbase(main):007:0> describe_namespace 'nametest'
DESCRIPTION                                                                     
{NAME => 'nametest'} 
```

列出所有命名空间

```ruby
hbase(main):008:0> list_namespace
NAMESPACE                                                                       
default                                                                         
hbase                                                                           
nametest 
```

在指定命名空间下创建表

```ruby
hbase(main):009:0> create 'nametest:table1','family1'
```

列出命名空间下的所有表

```ruby
hbase(main):010:0> list_namespace_tables 'nametest'
TABLE                                                                           
table1 
```

删除命名空间（命名空间必须是空的,因此首先要删除命名空间里的表）

```ruby
hbase(main):002:0> disable 'nametest:table1'
0 row(s) in 2.6410 seconds

hbase(main):003:0> drop 'nametest:table1'
0 row(s) in 1.3330 seconds

hbase(main):004:0> drop_namespace 'nametest'
0 row(s) in 0.0410 seconds
```





## HBase的数据版本的确界以及TTL

### 数据的确界

- 在HBase当中，我们可以为数据设置上界和下界，其实就是定义数据的历史版本保留多少个，通过自定义历史版本保存的数量，我们可以实现数据多个历史版本的数据查询

- 版本的下界
  - 默认的版本下界是0，即禁用。row版本使用的最小数目是与生存时间（TTL Time To Live）相结合的，并且我们根据实际需求可以有0或更多的版本，使用0，即只有1个版本的值写入cell。

- 版本的上界
  - 之前默认的版本上界是3，也就是一个row保留3个版本（基于时间戳的插入）。
  - 该值不要设计的过大，一般的业务不会超过100。如果cell中存储的数据版本号超过了上界，再次插入数据时，最新的值会将最老的值覆盖。（现版本已默认为1）

查看多个版本数据的语法：

```sh
get 'tablename','rowkey',{COLUMN=>'Familyname:colname',VERSIONS=>5}
```

### 数据的TTL

- 在实际工作当中经常会遇到有些数据过了一段时间我们可能就不需要了，那么这时候我们可以使用定时任务去定时的删除这些数据
- 或者我们也可以使用Hbase的TTL（Time  To  Live）功能，让我们的数据定期的会进行清除

- 使用代码来设置数据的确界以及设置数据的TTL如下

##  案例：数据版本&TTL

##### 案例需求

创建一个叫versionTTL_test的表，设置TTL为10s，设置最小版本数为3，设置最大版本数为5，往同一个cell插入6个版本的数据，不同版本的数据分别为krystal0，krystal1，krystal2，krystal3，krystal4，krystal5。

创建完表后，快速立马查看表的多个版本的数据。查看完后，隔10s后再次查看表的数据。比较两次查询的结果。

##### 第一步：创建maven工程

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
        <groupId>org.apache.hbase</groupId>
        <artifactId>hbase-client</artifactId>
        <version>1.2.0-cdh5.14.2</version>
    </dependency>
    <dependency>
        <groupId>org.apache.hbase</groupId>
        <artifactId>hbase-server</artifactId>
        <version>1.2.0-cdh5.14.2</version>
    </dependency>
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.12</version>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.testng</groupId>
        <artifactId>testng</artifactId>
        <version>6.14.3</version>
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
                <!--    <verbal>true</verbal>-->
            </configuration>
        </plugin>
        <!--将我们其他用到的一些jar包全部都打包进来  -->
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
                        <minimizeJar>false</minimizeJar>
                    </configuration>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

##### 第二步：代码开发

```java
package com.jimmy.vt;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.HColumnDescriptor;
import org.apache.hadoop.hbase.HTableDescriptor;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.*;
import org.apache.hadoop.hbase.util.Bytes;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class MyVersionTTL {
    public static void fun() throws IOException, InterruptedException {
        Configuration conf= HBaseConfiguration.create();
        conf.set("hbase.zookeeper.quorum","node01:2181,node02:2181,node03:2181");
        Connection conne= ConnectionFactory.createConnection(conf);

        TableName t_name=TableName.valueOf("versionTTL_test");
        Admin am=conne.getAdmin();
        //判断表是否存在
        if(!(am.tableExists(t_name))){
            //获取描述表的对象
            HTableDescriptor htds=new HTableDescriptor(t_name);
            //获取描述列的对象
            HColumnDescriptor f1=new HColumnDescriptor("f1");
            //在描述列的对象上设置版本
            f1.setMinVersions(3);
            f1.setMaxVersions(5);
            //在描述列的对象上设置TTL
            f1.setTimeToLive(10);  //以秒为单位
            //添加列族
            htds.addFamily(f1);
            //建表
            am.createTable(htds);
        }

        //---------插入多个版本数据---------------
        //获取表对象
        Table t1=conne.getTable(t_name);
        for (int i = 0; i <6 ; i++) {
            Put put_i=new Put("rk001".getBytes());
            put_i.addColumn("f1".getBytes(),"age".getBytes(),("krystal"+String.valueOf(i)).getBytes());
            t1.put(put_i);
        }
        //释放资源
        t1.close();
        conne.close();
    }

    public static void main(String[] args) throws IOException, InterruptedException {
        MyVersionTTL.fun();
    }
}

```

##### 第三步：查看表数据

运行完上面代码块后，立马执行查询语句，查询结果如下:

```sh
hbase(main):032:0> get 'versionTTL_test','rk001',{COLUMN=>'f1:age',VERSIONS=>5}
COLUMN                          CELL                                   
 f1:age                         timestamp=1583525066857, value=krystal5
 f1:age                         timestamp=1583525066854, value=krystal4
 f1:age                         timestamp=1583525066850, value=krystal3
 f1:age                         timestamp=1583525066846, value=krystal2
 f1:age                         timestamp=1583525066833, value=krystal1
```

运行完上面代码块后，隔10s后再次执行查询语句，查询结果如下:

```sh
hbase(main):033:0> get 'versionTTL_test','rk001',{COLUMN=>'f1:age',VERSIONS=>5}
COLUMN                          CELL                                   
 f1:age                         timestamp=1583525066857, value=krystal5
 f1:age                         timestamp=1583525066854, value=krystal4
 f1:age                         timestamp=1583525066850, value=krystal3
```

从两次不同时间的查询结果可以发现，第二次查询虽然指定了要查询最新5个版本的数据，也只查到了3条数据。这是因为设置了TTL为10s，10s后，插入的数据都失效了。

那既然都失效了，为什么还能查到3个版本的数据，这是因为我们设置了最小版本数为3，因此，始终会有3个版本的数据被保留住。

##### 拓展：整合第二第三步(插入+多版本查询)

```java
package com.jimmy.vt;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.*;
import org.apache.hadoop.hbase.client.*;
import org.apache.hadoop.hbase.util.Bytes;

import java.io.IOException;

public class MyVersionTTL {
    public static void fun() throws IOException, InterruptedException {
        Configuration conf= HBaseConfiguration.create();
        conf.set("hbase.zookeeper.quorum","node01:2181,node02:2181,node03:2181");
        Connection conne= ConnectionFactory.createConnection(conf);

        TableName t_name=TableName.valueOf("versionTTL_test");
        Admin am=conne.getAdmin();
        //判断表是否存在
        if(!(am.tableExists(t_name))){
            //获取描述表的对象
            HTableDescriptor htds=new HTableDescriptor(t_name);
            //获取描述列的对象
            HColumnDescriptor f1=new HColumnDescriptor("f1");
            //在描述列的对象上设置版本
            f1.setMinVersions(3);
            f1.setMaxVersions(5);
            //在描述列的对象上设置TTL
            f1.setTimeToLive(10);  //以秒为单位
            //添加列族
            htds.addFamily(f1);
            //建表
            am.createTable(htds);
        }

        //---------插入多个版本数据1---------------
        //获取表对象
        Table t1=conne.getTable(t_name);
        for (int i = 0; i <6 ; i++) {
            Put put_i=new Put("rk001".getBytes());
            put_i.addColumn("f1".getBytes(),"age".getBytes(),("krystal"+String.valueOf(i)).getBytes());
            t1.put(put_i); //多次put才是插入多个版本数据
        }

        //----------查询多版本数据----------------
        for (int i = 0; i <2 ; i++) {
            Get get1=new Get("rk001".getBytes());
            //设置查询所有版本的数据：
            get1.setMaxVersions();
            Result rs=t1.get(get1);
            Cell[]cells=rs.rawCells();  //这里记得使用rawCells()，否则查不了多版本数据
            for (Cell c:cells){
                System.out.println(Bytes.toString(CellUtil.cloneValue(c)));
            }
            System.out.println("========================");
            Thread.sleep(15000); //单位为毫秒，即15s
        }

        //释放资源
        t1.close();
        conne.close();
    }

    public static void main(String[] args) throws IOException, InterruptedException {
        MyVersionTTL.fun();
    }
}

```

运行输出结果如下：

```sh
krystal5
krystal4
krystal3
krystal2
krystal1
========================
krystal5
krystal4
krystal3
========================
```



##  HBase微博实战案例

#### 案例需求及分析

微博用户关系示意图：

<img src="hbase.assets/image-20200307045017299.png" alt="image-20200307045017299" style="zoom:67%;" />

微博用户的主要行为（案例需求）：

1. 发微博
2. 关注别人
3. 取消关注
4. 获得（查看）关注的人的微博内容

根据用户的主要行为，得到要建立的表：

1. 发微博---》建表1，存放用户发微博的内容
2. 关注别人&取消关注---》建表2，存放用户间的关系（关注了什么人，粉丝有谁）
3. 获得（查看）关注的人的微博内容---》建表3，存放每个用户的关注的人发布的微博内容信息



表1设计：存放微博内容

1. 表名:WEIBO_CONTENT
2. rowkey: 用户的uid+时间戳(单单uid不行，因为一个用户可以发多条微博)
3. 列族：info
4. 列:info:title（存放标题）,info:content（存放内容）,info:pic（存放图片链接）
5. version：一个版本即可

![image-20200307050820897](hbase.assets/image-20200307050820897.png)

表2设计：存放用户关系

1. 表名：WEIBO_RELATIONS
2. rowkey:用户的uid
3. 列族:follows(存放关注的用户的列)，fans(存放粉丝的列)
4. 列：因为关注的用户数量以及粉丝数量都是动态变化的，且列值要存储用户uid,因此我们干脆直接使用用户uid作为列名。每个rowkey对应的列的数量是根据关注的用户数量和粉丝数量动态变化的。
5. version：两个列族都是1

![image-20200308010016908](hbase.assets/image-20200308010016908.png)



表3设计：获得关注的人发送的微博

表名:WEIBO_RECEIVE_CONTENT

rowkey:用户的uid

列族:f1, 一个列族就可以，

列:以用户的uid作为列名，用户发送的微博对应的rowkey（uid+时间戳）作为列值。每个rowkey对应的列的数量是根据关注的用户数量和粉丝数量动态变化的。

version：设置为100个版本

![image-20200308010215305](hbase.assets/image-20200308010215305.png)



#### 第一步：创建maven工程

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
        <groupId>org.apache.hbase</groupId>
        <artifactId>hbase-client</artifactId>
        <version>1.2.0-cdh5.14.2</version>
    </dependency>
    <dependency>
        <groupId>org.apache.hbase</groupId>
        <artifactId>hbase-server</artifactId>
        <version>1.2.0-cdh5.14.2</version>
    </dependency>
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.12</version>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.testng</groupId>
        <artifactId>testng</artifactId>
        <version>6.14.3</version>
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
                <!--    <verbal>true</verbal>-->
            </configuration>
        </plugin>
        <!--将我们其他用到的一些jar包全部都打包进来  -->
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
                        <minimizeJar>false</minimizeJar>
                    </configuration>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

#### 第二步：拷贝配置文件到maven工程

将node01服务器的三个配置文件，分别是core-site.xml、hdfs-site.xml、hbase-site.xml这三个配置文件，拷贝到maven工程的resources资源目录下。

```sh
[hadoop@node01 ~]$ sz /kkb/install/hbase-1.2.0-cdh5.14.2/conf/core-site.xml 
[hadoop@node01 ~]$ sz /kkb/install/hbase-1.2.0-cdh5.14.2/conf/hdfs-site.xml 
[hadoop@node01 ~]$ sz /kkb/install/hbase-1.2.0-cdh5.14.2/conf/hbase-site.xml 
```

![image-20200308021654302](hbase.assets/image-20200308021654302.png)

#### 第三步：创建工具类

自己创建的MyHBaseUtils工具类包含的方法：

1. 获取Connection对象
2. 创建命名空间
3. 创建微博内容表WEIBO_CONTENT
4. 创建微博用户关系表WEIBO_RELATIONS
5. 创建微博用户接收关注用户发送的微博表WEIBO_RECEIVE_CONTENT

```java
package com.jimmy.weibo;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.*;
import org.apache.hadoop.hbase.client.*;

import java.io.IOException;

public class MyHBaseUtils {
    //定义获取Connection对象的方法，提高代码复用率
    public static Connection getConnection() throws IOException {
        Configuration conf= HBaseConfiguration.create();
        conf.set("hbase.zookeeper.quorum","node01:2181,node02:2181,node03:2181");
        Connection conne=ConnectionFactory.createConnection(conf);
        return conne;
    }
    //创建命名空间并定义表名
    public static void createNameSpace() throws IOException {
        Connection conne=MyHBaseUtils.getConnection();
        Admin am=conne.getAdmin();
        //创建一个名为weibo的命名空间
        NamespaceDescriptor nsds=NamespaceDescriptor.create("weibo").addConfiguration("creator","jimmy").build();
        am.createNamespace(nsds);
        am.close();
        conne.close();
    }
    //定义创建WEIBO_CONTENT表的方法
    public static void createTableContent(TableName tableName) throws IOException {
        Connection conne=MyHBaseUtils.getConnection();
        Admin am=conne.getAdmin();
        if(!(am.tableExists(tableName))){
            HTableDescriptor htds=new HTableDescriptor(tableName);
            HColumnDescriptor colDes=new HColumnDescriptor("info");
            colDes.setMinVersions(1);
            colDes.setMaxVersions(1);
            colDes.setBlockCacheEnabled(true);//开启块缓存,保持着每个HFile数据块的startKey
            //colDes.setBlocksize(64*1024); 设置块大小，加载到内存当中的数据块越小，随机查找性能更好,越大，连续读性能更好
            htds.addFamily(colDes);
            am.createTable(htds);
        }
        am.close();
        conne.close();
    }
    //定义创建WEIBO_RELATIONS表的方法
    public static void createTableRelations(TableName tableName) throws IOException {
        Connection conne=MyHBaseUtils.getConnection();
        Admin am=conne.getAdmin();
        if(!(am.tableExists(tableName))){
            HTableDescriptor htds=new HTableDescriptor(tableName);

            HColumnDescriptor colDes1=new HColumnDescriptor("follows");
            colDes1.setMinVersions(1);
            colDes1.setMaxVersions(1);
            colDes1.setBlockCacheEnabled(true);

            HColumnDescriptor colDes2=new HColumnDescriptor("fans");
            colDes2.setMinVersions(1);
            colDes2.setMaxVersions(1);
            colDes2.setBlockCacheEnabled(true);

            htds.addFamily(colDes1);
            htds.addFamily(colDes2);
            am.createTable(htds);
        }
        am.close();
        conne.close();
    }
    //定义创建WEIBO_RECEIVE_CONTENT表的方法
    public static void createTableReceive(TableName tableName) throws IOException {
        Connection conne=MyHBaseUtils.getConnection();
        Admin am=conne.getAdmin();
        if(!(am.tableExists(tableName))){
            HTableDescriptor htds=new HTableDescriptor(tableName);
            HColumnDescriptor colDes=new HColumnDescriptor("f1");
            colDes.setMinVersions(1000);
            colDes.setMaxVersions(1000);
            colDes.setBlockCacheEnabled(true);//开启块缓存,保持着每个HFile数据块的startKey
            //colDes.setBlocksize(64*1024); 设置块大小，加载到内存当中的数据块越小，随机查找性能更好,越大，连续读性能更好
            htds.addFamily(colDes);
            am.createTable(htds);
        }
        am.close();
        conne.close();
    }
}

```

#### 第四步：创建发送微博类

发送微博类包含一个方法：发送微博。

```java
package com.jimmy.weibo;

import org.apache.hadoop.hbase.Cell;
import org.apache.hadoop.hbase.CellUtil;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.*;
import org.apache.hadoop.hbase.util.Bytes;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class Post {
    //定义发布微博的方法,发布微博要做3件事情
    //1、将微博内容的数据添加到WEIBO_CONTENT表
    //2、找出发送微博的人的粉丝（到WEIBO_RELATIONS表找）
    //3、粉丝获得微博内容（添加数据到WEIBO_RECEIVE_CONTENT表）
    public static void PosthWeibo(TableName t_CONTENT, TableName t_RELATIONS, TableName t_RECEIVE, String uid, String...title_content_pic) throws IOException {
        //1、将微博内容的数据添加到WEIBO_CONTENT表
        Connection conne=MyHBaseUtils.getConnection();
        Table WEIBO_CONTENT=conne.getTable(t_CONTENT);
        String rowkeySTR=uid+ "_"+System.currentTimeMillis();//构建rowkey
        Put put1=new Put(rowkeySTR.getBytes());
        if(title_content_pic.length<3){
            WEIBO_CONTENT.close();
            conne.close();
        }
        put1.addColumn("info".getBytes(),"title".getBytes(),title_content_pic[0].getBytes());
        put1.addColumn("info".getBytes(),"content".getBytes(),title_content_pic[1].getBytes());
        put1.addColumn("info".getBytes(),"pic".getBytes(),title_content_pic[2].getBytes());
        WEIBO_CONTENT.put(put1);


        //2、找出发送微博的人的粉丝（到WEIBO_RELATIONS表找）
        Table WEIBO_RELATIONS=conne.getTable(t_RELATIONS);
        Get get1=new Get(uid.getBytes());
        get1.addFamily("fans".getBytes());
        Result rs=WEIBO_RELATIONS.get(get1);
        if(rs.isEmpty()){
            WEIBO_RELATIONS.close();
            WEIBO_CONTENT.close();
            conne.close();
            return;
        }
        Cell[] cells=rs.rawCells();
        List<String> fansList=new ArrayList<String>();
        for(Cell c:cells){
            String a= Bytes.toString(CellUtil.cloneValue(c));
            fansList.add(a);
        }


        //3、粉丝获得微博内容（添加数据到WEIBO_RECEIVE_CONTENT表）
        Table WEIBO_RECEIVE=conne.getTable(t_RECEIVE);
        List<Put> puts=new ArrayList<>();
        for (String f:fansList){
            Put put=new Put(f.getBytes());
            put.addColumn("f1".getBytes(),uid.getBytes(),rowkeySTR.getBytes());
            puts.add(put);
        }
        WEIBO_RECEIVE.put(puts);


        //释放资源
        WEIBO_CONTENT.close();
        WEIBO_RECEIVE.close();
        WEIBO_RELATIONS.close();
        conne.close();
    }
}

```

#### 第五步：创建关注取关类

该类主要包含两个方法：关注与取关。

```java
package com.jimmy.weibo;

import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.*;
import org.apache.hadoop.hbase.filter.PrefixFilter;
import org.apache.hadoop.hbase.util.Bytes;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class FollowAndCancel{
    //定义关注微博的方法，要做3件事情
    //1、给对应用户添加关注的人，给被关注的人添加粉丝（往关系表两个列族分别插入列和数据）
    //2、获取用户新关注的人发送的微博（去CONTENT表获取rowkey)
    //3、将新关注的人发送的微博rowkey等数据添加到RECEIVE表
    public static void follow(TableName tNameRelations,TableName tNameContent,TableName tNameReceive,String uid,String...users) throws IOException {
        //1、给对应用户添加关注的人，给被关注的人添加粉丝（两个列族分别插入列和数据）
        Connection conne=MyHBaseUtils.getConnection();
        Table relations_t=conne.getTable(tNameRelations);
        Put putFollows=new Put(uid.getBytes());
        List<Put> putFansList=new ArrayList<>();
        for(String u:users){
            putFollows.addColumn("follows".getBytes(),u.getBytes(),u.getBytes());

            Put put=new Put(u.getBytes());
            put.addColumn("fans".getBytes(),uid.getBytes(),uid.getBytes());
            putFansList.add(put);
        }
        relations_t.put(putFollows);
        relations_t.put(putFansList);

        //2、获取用户新关注的人发送的微博（去CONTENT表获取rowkey)
        //因为CONTENT表的rowkey构成是uid+时间戳,因此我们可以设置一个前缀过滤器
        Table content_t=conne.getTable(tNameContent);
        Scan scan=new Scan();
        List<byte[]> rowkeyContentList=new ArrayList<>();
        for(String s:users){
            PrefixFilter preF=new PrefixFilter((s+"_").getBytes());
            scan.setFilter(preF);
            ResultScanner rsScanner=content_t.getScanner(scan);
            if(null==rsScanner){
                continue;
            }
            for(Result rs:rsScanner){
                byte[] rowkeyContent=rs.getRow();
                rowkeyContentList.add(rowkeyContent);
            }
        }

        //3、将新关注的人发送的微博rowkey等数据添加到RECEIVE表
        Table receive_t=conne.getTable(tNameReceive);
        if(rowkeyContentList.size()>0){
            Put put1=new Put(uid.getBytes());
            for (byte[] b:rowkeyContentList){
                String rowkey= Bytes.toString(b);
                String[] split=rowkey.split("_");
                put1.addColumn("f1".getBytes(),split[0].getBytes(),b);
            }
            receive_t.put(put1);
        }

        //释放资源：
        receive_t.close();
        content_t.close();
        relations_t.close();
        conne.close();
    }

    //取消关注需要做3件事情：
    //1、修改关系表(删除关注用户及删除粉丝）
    //2、修改receive表（删除取消了关注的用户发送的微博）
    public static void cancel(TableName tNameRelations,TableName tNameReceive,String uid,String...users) throws IOException {
        //1、修改关系表
        Connection conne=MyHBaseUtils.getConnection();
        Table relations_t=conne.getTable(tNameRelations);
        Delete del=new Delete(uid.getBytes());
        //删除关注的用户
        for (String u:users){
            del.addColumn("follows".getBytes(),u.getBytes());
        }
        relations_t.delete(del);
        //删除粉丝
        for (String u:users){
            Delete del2=new Delete(u.getBytes());
            del2.addColumn("fans".getBytes(),uid.getBytes());
            relations_t.delete(del2);
        }


        //2、修改receive表（删除取消了关注的用户发送的微博）
        Table receive_t=conne.getTable(tNameReceive);
        Delete del3=new Delete(uid.getBytes());
        for (String s:users){
            del3.addColumn("f1".getBytes(),s.getBytes());
        }
        receive_t.delete(del3);


        //释放资源：
        receive_t.close();
        relations_t.close();
        conne.close();
    }
}

```



#### 第六步：查看效果1(建表，关注)

首先执行下列代码，查看效果。

```java
package com.jimmy.weibo;

import org.apache.hadoop.hbase.TableName;

import java.io.IOException;

public class TestClass {
    public static final TableName content=TableName.valueOf("weibo:WEIBO_CONTENT");
    public static final TableName relations=TableName.valueOf("weibo:WEIBO_RELATIONS");
    public static final TableName receive=TableName.valueOf("weibo:WEIBO_RECEIVE_CONTENT");
    public static void main(String[] args) throws IOException {
        //创建命名空间weibo
        MyHBaseUtils.createNameSpace();
        //创建三个表
        MyHBaseUtils.createTableContent(content);
        MyHBaseUtils.createTableRelations(relations);
        MyHBaseUtils.createTableReceive(receive);
        //关注别人
        // 1关注2，5
        // 4关注3
        FollowAndCancel.follow(relations,content,receive,"1","2","5");
        FollowAndCancel.follow(relations,content,receive,"4","3");

    }
}

```

```ruby
hbase(main):001:0> list
TABLE                      
...                     
...         
weibo:WEIBO_CONTENT        
weibo:WEIBO_RECEIVE_CONTENT
weibo:WEIBO_RELATIONS      
```

```sh
hbase(main):002:0> scan 'weibo:WEIBO_RELATIONS'
ROW                                COLUMN+CELL                               
 1                                 column=follows:2, timestamp=1583617161481, value=2 
 1                                 column=follows:5, timestamp=1583617161481, value=5 
 2                                 column=fans:1, timestamp=1583617161506, value=1    
 3                                 column=fans:4, timestamp=1583617161599, value=4    
 4                                 column=follows:3, timestamp=1583617161589, value=3 
 5                                 column=fans:1, timestamp=1583617161506, value=1    
```

```sh
hbase(main):003:0> scan 'weibo:WEIBO_RECEIVE_CONTENT'
ROW                                             COLUMN+CELL
```

```sh
hbase(main):004:0> scan 'weibo:WEIBO_RECEIVE_CONTENT'
ROW                                             COLUMN+CELL
```

#### 第七步：查看效果2（发微博）

在查看效果1中的代码块运行的基础上，继续运行下列代码，然后继续查看效果。

```java
package com.jimmy.weibo;

import org.apache.hadoop.hbase.TableName;

import java.io.IOException;

public class TestClass {
    public static final TableName content=TableName.valueOf("weibo:WEIBO_CONTENT");
    public static final TableName relations=TableName.valueOf("weibo:WEIBO_RELATIONS");
    public static final TableName receive=TableName.valueOf("weibo:WEIBO_RECEIVE_CONTENT");
    public static void main(String[] args) throws IOException {
        Post.PosthWeibo(content,relations,receive,"5","湖人VS雄鹿","今天湖人赢了雄鹿","http://zhiboba.com");

    }
}
```

```sh
hbase(main):006:0> scan 'weibo:WEIBO_CONTENT'
ROW                     COLUMN+CELL                                                   
5_1583618326620     column=info:content, timestamp=1583618329612, value=\xE4\xBB\x8A\xE5\xA4\xA9\xE6\xB9\x96\xE4\xBA\xBA\xE8\xB5\xA2\xE4\xBA\x86\xE9\x9B\x84\xE9\xB9\xBF                                                                                                                                
5_1583618326620     column=info:pic, timestamp=1583618329612, value=http://zhiboba.com                                                                        
5_1583618326620     column=info:title, timestamp=1583618329612, value=\xE6\xB9\x96\xE4\xBA\xBAVS\xE9\x9B\x84\xE9\xB9\xBF                              
```

```sh
hbase(main):005:0> scan 'weibo:WEIBO_RECEIVE_CONTENT'
ROW                  COLUMN+CELL                           
1                    column=f1:5, timestamp=1583618329639, value=5_1583618326620
```

#### 第八步：查看效果3（取关)

在查看效果2中的代码块运行的基础上，继续运行下列代码，然后继续查看效果。

```java
package com.jimmy.weibo;

import org.apache.hadoop.hbase.TableName;

import java.io.IOException;

public class TestClass {
    public static final TableName content=TableName.valueOf("weibo:WEIBO_CONTENT");
    public static final TableName relations=TableName.valueOf("weibo:WEIBO_RELATIONS");
    public static final TableName receive=TableName.valueOf("weibo:WEIBO_RECEIVE_CONTENT");
    public static void main(String[] args) throws IOException {
        //uid为1的用户取关5用户
        FollowAndCancel.cancel(relations,receive,"1","5");
    }
}

```

```sh
#取关前:
hbase(main):005:0> scan 'weibo:WEIBO_RECEIVE_CONTENT'
ROW                  COLUMN+CELL                           
1                    column=f1:5, timestamp=1583618329639, value=5_1583618326620

#取关后:
hbase(main):007:0> scan 'weibo:WEIBO_RECEIVE_CONTENT'
ROW                                             COLUMN+CELL
0 row(s) in 0.0210 seconds
```

```sh
#取关前:
hbase(main):002:0> scan 'weibo:WEIBO_RELATIONS'
ROW                                COLUMN+CELL                               
 1                                 column=follows:2, timestamp=1583617161481, value=2 
 1                                 column=follows:5, timestamp=1583617161481, value=5 
 2                                 column=fans:1, timestamp=1583617161506, value=1    
 3                                 column=fans:4, timestamp=1583617161599, value=4    
 4                                 column=follows:3, timestamp=1583617161589, value=3 
 5                                 column=fans:1, timestamp=1583617161506, value=1    


#取关后:
hbase(main):009:0> scan 'weibo:WEIBO_RELATIONS'
ROW                         COLUMN+CELL                                       
 1                          column=follows:2, timestamp=1583617161481, value=2
 2                          column=fans:1, timestamp=1583617161506, value=1   
 3                          column=fans:4, timestamp=1583617161599, value=4   
 4                          column=follows:3, timestamp=1583617161589, value=3
```

#### 案例功能拓展（TODO）

1. 创建一个用来获取指定uid用户关注的所有用户发送的微博
2. 修改发送微博类（发送微博可以有标题，可以没有标题，可以有图片，也可以没有图片）。



## 拓展：布隆过滤器

#### 缓存穿透

以Redis数据库为例，我们经常会把数据放进缓存中，有查询请求进来的时候，优先去缓存中查询，没有再到数据库查询。这样看起来很好，但是思考一个问题：如果有大量的请求进来，而且请求的数据内容都是不存在的，缓存中没有就会去数据库找，那么大量的请求就会导致数据库的压力快速上升，甚至导致奔溃。这就是缓存穿透。

如果服务器的内存足够大，那么使用HashMap是一个不错的解决方案，理论上时间复杂度可以达到O(1)。但是如果数据的大小已经远远超出了服务器的内存，就无法再使用HashMap来解决。

此时，布隆过滤器就出场了，它能够缓解这个问题（只能缓解）。布隆过滤器能够使得快速判断请求的数据内容存不存在，然后快速做出响应。

#### 布隆过滤器

布隆过滤器是一个叫做“布隆”的人提出来的，本质是一个概率型数据结构，是一个很长的二进制向量，这个向量存放的要么是0，要么是1。

![image-20200303163348963](hbase.assets/image-20200303163348963.png)

**布隆过滤器的特点是高效地插入和查询，能够快速告诉你“某个数据一定不存在或者可能存在”。**

当我们添加一个数据时候，如baidu。那我们要映射baidu这个值到布隆过滤器中，即使用多个不同的Hash哈希函数生成多个hash值（这里以3个为例子），并将每个生成的哈希值指向的bit位置的值改为1，假如“baidu”这个值得哈希函数返回了1、4、7。

![image-20200303164853566](hbase.assets/image-20200303164853566.png)

我们再存一个值“Tecent”，如果哈希函数返回3、4、8的话，图继续变为：

![image-20200303165031784](hbase.assets/image-20200303165031784.png)

因此，从上面可以知道，添加的数据根本没有在布隆过滤器存放完整的数据，只是运用一系列随机映射函数计算出位置，然后填充值1。而且我们看到，“baidu”和“Tecent”两个值得哈希函数都返回了4。

现在呢，我们要查询“Alibaba”这个数据存不存在，就会运行同样得hash计算方式得到这个数据的信息存放在哪几个bit中，然后查看其中的bit值，如果全部3个bit中的值都为1，就代表Alibaba这个值可能存在，但是会返回存在，这时候就有可能出现了误判。如果有一个bit中的值不是1，就代表Alibaba这个值一定不存在,返回的也是不存在，这时候没有误判。	

为什么3个bit的值都是1的时候，只是代表数据可能存在？因为三个bit值都为1有可能是其它数据经过计算方式在同样的bit位置填充了1。这个很好理解：我们要判断一个对象是否相等，仅仅判断它们的哈希值是否相等是不行的。也就是说布隆过滤器只能判断数据是否一定不存在，而无法判断数据是否一定存在

#### 布隆过滤器的优缺点

优点：存放的不是完整的数据，占用的内存很小，而且查询和插入数据的速度很快。

缺点：随着数据的增加，误判率会增加。不能判断数据是否一定存在。布隆过滤器不支持删除（因为不同的数据可能往同一个bit位置写入1）。

在实际开发中，要添加大量数据时，仅仅10几位的长度的布隆过滤器是不够用的。使用更长的二进制向量，以及使用更多的随机映射函数（哈希函数）都能够降低误判率。

#### 布隆过滤器的使用场景

利用布隆过滤器减少磁盘 IO 或者网络请求，因为一旦一个值必定不存在的话，我们可以不用进行后续昂贵的查询请求。

- **网页爬虫对URL的去重**，避免爬取相同的URL地址。
- **垃圾邮件过滤**，从数十亿个垃圾邮件列表中判断某邮箱是否是垃圾邮箱。
- **解决数据库缓存击穿**，黑客攻击服务器时，会构建大量不存在于缓存中的key向服务器发起请求，在数据量足够大的时候，频繁的数据库查询会导致挂机。
- **秒杀系统**，查看用户是否重复购买。
- hbase的rowkey的布隆过滤器



## 拓展：跳跃表（TODO）

https://blog.csdn.net/qpzkobe/article/details/80056807

https://www.cnblogs.com/Leo_wl/p/11557614.html

https://www.sohu.com/a/293236470_298038

## 拓展：LSM(TODO)