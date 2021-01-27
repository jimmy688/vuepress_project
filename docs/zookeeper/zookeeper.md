## zookeeper安装部署

注意事项：**三台机器一定要保证时钟同步**

#### 1.1 下载zookeeeper的压缩包，下载网址如下

- http://archive.cloudera.com/cdh5/cdh/5/

- 我们在这个网址下载我们使用的zk版本为[zookeeper-3.4.5-cdh5.14.2.tar.gz](http://archive.cloudera.com/cdh5/cdh/5/zookeeper-3.4.5-cdh5.14.2.tar.gz)

- 下载完成之后，上传到我们的`node01`的`/kkb/soft`路径下准备进行安装

#### 1.2 解压

- `node01`执行以下命令解压`zookeeper`的压缩包到`node01`服务器的`/kkb/install`路径下去，然后准备进行安装

```shell
cd /kkb/soft

tar -zxvf zookeeper-3.4.5-cdh5.14.2.tar.gz  -C /kkb/install/
```



#### 1.3 修改配置文件

- 第一台机器修改配置文件

```shell
cd /kkb/install/zookeeper-3.4.5-cdh5.14.2/conf

cp zoo_sample.cfg zoo.cfg

mkdir -p /kkb/install/zookeeper-3.4.5-cdh5.14.2/zkdatas
```

- 用`vim  zoo.cfg`修改文件，修改如下属性值

```shell
dataDir=/kkb/install/zookeeper-3.4.5-cdh5.14.2/zkdatas

autopurge.snapRetainCount=3

autopurge.purgeInterval=1

#文件末尾增加如下三行
server.1=node01:2888:3888
server.2=node02:2888:3888
server.3=node03:2888:3888
```



#### 1.4 添加myid配置

- 在第一台机器的/kkb/install/zookeeper-3.4.5-cdh5.14.2/zkdatas/这个路径下创建一个文件，文件名为myid ,文件内容为1

```shell
echo 1 >  /kkb/install/zookeeper-3.4.5-cdh5.14.2/zkdatas/myid
```

 

#### 1.5 安装包分发并修改myid的值

- 第一台机器上面执行以下两个命令

```shell
scp -r /kkb/install/zookeeper-3.4.5-cdh5.14.2/ node02:/kkb/install/

scp -r /kkb/install/zookeeper-3.4.5-cdh5.14.2/ node03:/kkb/install/
```

- 第二台机器上修改myid的值为2；直接在第二台机器任意路径执行以下命令

```shell
echo 2 > /kkb/install/zookeeper-3.4.5-cdh5.14.2/zkdatas/myid
```

- 第三台机器上修改myid的值为3；直接在第三台机器任意路径执行以下命令

```shell
echo 3 > /kkb/install/zookeeper-3.4.5-cdh5.14.2/zkdatas/myid
```



 #### 1.6 配置环境变量

- 三台节点都配置/etc/profile文件

```shell
export ZK_HOME=/kkb/install/zookeeper-3.4.5-cdh5.14.2
export PATH=$PATH:$ZK_HOME/bin
```

- 三台节点，让新添环境变量生效（hadoop用户下执行）

```shell
source /etc/profile
```



#### 1.7 三台机器启动zookeeper服务

- 三台机器启动zookeeper服务；这个命令三台机器都要执行

```shell
zkServer.sh start
```

-  查看启动状态

```
zkServer.sh status
```

> 一个zkServer的状态要么是follower，要么是leader
>
> 三个节点中，一个节点为leader，另外两个为follower，类似下图

![](zookeeper.assets/Image201910221141.png)

![](zookeeper.assets/Image201910221141 (2).png)

- jps每个服务器上有一个**QuorumPeerMain**进程

![](zookeeper.assets/Image201911010943.png)

#### 1.8 如何关闭zookeeper集群

- 三个节点运行

```shell
zkServer.sh stop
```

> **注意：**关闭虚拟机前，要在每个zookeeper服务器中使用zkServer.sh stop命令，关闭zookeeper服务器
>
> 否则，可能集群出问题



## HA集群搭建（TODO）

#### 集群规划

>  说明：
>
>  - 集群共5个节点，主机名分别是node01、node02、node03、node04、node05
>
>  - 初始启动集群
>    - node01上运行active namenode即主namenode；node02上运行standby namenode即从namenode
>    - node04上运行主resourcemanager；node05上运行从resourcemanager

- 每个节点运行的进程如下表

| 机器名 | 运行进程                                                    |
| ------ | =====================---------------- |
| node01 | NameNode/zkfc/Zookeeper/Journalnode/DataNode/NodeManager    |
| node02 | NameNode/zkfc/Zookeeper/Journalnode/DataNode/NodeManager    |
| node03 | Zookeeper/Journalnode/DataNode/NodeManager/JobHistoryServer |
| node04 | ResourceManager                                             |
| node05 | ResourceManager                                             |

####  虚拟机环境准备

- 准备**5台**虚拟机
- 在做五节点`hadoop HA`集群搭建之前，要求先完成**每台**虚拟机的**基本环境准备**
  - 每个节点都要做好“在`node01`上开始解压`hadoop`的`tar.gz`包之前的环境配置”
  - 主要包括如下步骤（**三节点Hadoop集群搭建时已讲解过，不再赘述**）
    - windows|mac安装VMWare虚拟化软件
    - VMWare下安装CenoOS7
    - 虚拟机关闭防火墙
    - 禁用selinux
    - 配置虚拟网卡
    - 配置虚拟机网络
    - 安装JDK
    - 配置时间同步
    - 修改主机名
    - 修改ip地址
    - 修改/etc/hosts
    - 各节点免密钥登陆
    - 重启虚拟机



#### 安装ZooKeeper集群

`Hadoop`高可用集群需要使用`ZooKeeper`集群做分布式协调；所以**先安装ZooKeeper集群**

- 在`node01、node02、node03`上安装`ZooKeeper`集群



#### node01安装hadoop

**注意：**

①3.1到3.8在**node01**上操作

②**此文档使用普通用户操作，如hadoop**

③**hadoop安装到用户主目录下，如/kkb/install**

**请根据自己的实际情况修改**



##### 3.1 解压hadoop压缩包

- hadoop压缩包hadoop-2.6.0-cdh5.14.2_after_compile.tar.gz上传到node01的/kkb/soft路径中

- 解压hadoop压缩包到/kkb/install

```shell
#解压hadoop压缩包到/kkb/install
[hadoop@node01 ~]$ cd
[hadoop@node01 ~]$ cd /kkb/soft/
[hadoop@node01 soft]$ tar -xzvf hadoop-2.6.0-cdh5.14.2_after_compile.tar.gz -C /kkb/install/
```


##### 3.2 修改hadoop-env.sh

- 进入hadoop配置文件路径$HADOOP_HOME/etc/hadoop

```shell
[hadoop@node01 soft]$ cd /kkb/install/hadoop-2.6.0-cdh5.14.2/
[hadoop@node01 hadoop-2.6.0-cdh5.14.2]$ cd etc/hadoop/
```

- 修改hadoop-env.sh，修改JAVA_HOME值为jdk解压路径；保存退出

```shell
export JAVA_HOME=/kkb/install/jdk1.8.0_141
```

> 注意：JAVA_HOME值修改为**自己jdk的实际目录**

##### 3.3 修改core-site.xml

> **注意：**
>
> **情况一：值/kkb/install/hadoop-2.6.0-cdh5.14.2/tmp根据实际情况修改**
>
> **情况二：值node01:2181,node02:2181,node03:2181根据实际情况修改，修改成安装了zookeeper的虚拟机的主机名**

```xml
<configuration>
	<!-- 指定hdfs的nameservice id为ns1 -->
	<property>
		<name>fs.defaultFS</name>
		<value>hdfs://ns1</value>
	</property>
	<!-- 指定hadoop临时文件存储的基目录 -->
	<property>
		<name>hadoop.tmp.dir</name>
		<value>/kkb/install/hadoop-2.6.0-cdh5.14.2/tmp</value>
	</property>
	<!-- 指定zookeeper地址，ZKFailoverController使用 -->
	<property>
		<name>ha.zookeeper.quorum</name>
		<value>node01:2181,node02:2181,node03:2181</value>
	</property>
</configuration>
```

##### 3.4 修改hdfs-site.xml

> **注意：**
>
> **情况一：属性值qjournal://node01:8485;node02:8485;node03:8485/ns1中的主机名，修改成实际安装zookeeper的虚拟机的主机名**
>
> **情况二：属性值/kkb/install/hadoop-2.6.0-cdh5.14.2/journal中”/kkb/install/hadoop-2.6.0-cdh5.14.2”替换成实际hadoop文件夹的路径**
>
> **情况三：属性值/home/hadoop/.ssh/id_rsa中/home/hadoop根据实际情况替换**

```xml
<configuration>
	<!--指定hdfs的nameservice列表，多个之前逗号分隔；此处只有一个ns1，需要和core-site.xml中的保持一致 -->
	<property>
		<name>dfs.nameservices</name>
		<value>ns1</value>
	</property>
	<!-- ns1下面有两个NameNode，分别是nn1，nn2 -->
	<property>
		<name>dfs.ha.namenodes.ns1</name>
		<value>nn1,nn2</value>
	</property>
	<!-- nn1的RPC通信地址 -->
	<property>
		<name>dfs.namenode.rpc-address.ns1.nn1</name>
		<value>node01:8020</value>
	</property>
	<!-- nn1的http通信地址,web访问地址 -->
	<property>
		<name>dfs.namenode.http-address.ns1.nn1</name>
		<value>node01:50070</value>
	</property>
	<!-- nn2的RPC通信地址 -->
	<property>
		<name>dfs.namenode.rpc-address.ns1.nn2</name>
		<value>node02:8020</value>
	</property>
	<!-- nn2的http通信地址,web访问地址 -->
	<property>
		<name>dfs.namenode.http-address.ns1.nn2</name>
		<value>node02:50070</value>
	</property>
	<!-- 指定NameNode的元数据在JournalNode上的存放位置 -->
	<property>
		<name>dfs.namenode.shared.edits.dir</name>
		<value>qjournal://node01:8485;node02:8485;node03:8485/ns1</value>
	</property>
	<!-- 指定JournalNode在本地磁盘存放数据的位置 -->
	<property>
		<name>dfs.journalnode.edits.dir</name>
		<value>/kkb/install/hadoop-2.6.0-cdh5.14.2/journal</value>
	</property>
	<!-- 开启NameNode失败自动切换 -->
	<property>
		<name>dfs.ha.automatic-failover.enabled</name>
		<value>true</value>
	</property>
	<!-- 此类决定哪个namenode是active，切换active和standby -->
	<property>
		<name>dfs.client.failover.proxy.provider.ns1</name>
		<value>org.apache.hadoop.hdfs.server.namenode.ha.ConfiguredFailoverProxyProvider</value>
	</property>
	<!-- 配置隔离机制方法，多个机制用换行分割，即每个机制暂用一行-->
	<property>
		<name>dfs.ha.fencing.methods</name>
		<value>
		sshfence
		shell(/bin/true)
		</value>
	</property>
	<!-- 使用sshfence隔离机制时需要ssh免密登陆到目标机器 -->
	<property>
		<name>dfs.ha.fencing.ssh.private-key-files</name>
		<value>/home/hadoop/.ssh/id_rsa</value>
	</property>
	<!-- 配置sshfence隔离机制超时时间 -->
	<property>
		<name>dfs.ha.fencing.ssh.connect-timeout</name>
		<value>30000</value>
	</property>
</configuration>
```

##### 3.5 修改mapred-site.xml

- 重命名文件

```shell
[hadoop@node01 hadoop]$ mv mapred-site.xml.template mapred-site.xml
```

- 修改mapred-site.xml

```xml
<configuration>
	<!-- 指定运行mr job的运行时框架为yarn -->
	<property>
		<name>mapreduce.framework.name</name>
		<value>yarn</value>
	</property>
    <!-- MapReduce JobHistory Server IPC host:port -->
	<property>
		<name>mapreduce.jobhistory.address</name>
		<value>node03:10020</value>
	</property>
	<!-- MapReduce JobHistory Server Web UI host:port -->
	<property>
		<name>mapreduce.jobhistory.webapp.address</name>
		<value>node03:19888</value>
	</property>
</configuration>
```

##### 3.6 修改yarn-site.xml

> **注意：**
>
> **情况一：属性yarn.resourcemanager.hostname.rm1的值node04根据实际情况替换**
>
> **情况二：属性yarn.resourcemanager.hostname.rm2的值node05根据实际情况替换**
>
> **情况三：属性值node01:2181,node02:2181,node03:2181根据实际情况替换；替换成实际安装zookeeper的虚拟机的主机名**

```xml
<configuration>
    <!-- 是否启用日志聚合.应用程序完成后,日志汇总收集每个容器的日志,这些日志移动到文件系统,例如HDFS. -->
	<!-- 用户可以通过配置"yarn.nodemanager.remote-app-log-dir"、"yarn.nodemanager.remote-app-log-dir-suffix"来确定日志移动到的位置 -->
	<!-- 用户可以通过应用程序时间服务器访问日志 -->
	<!-- 启用日志聚合功能，应用程序完成后，收集各个节点的日志到一起便于查看 -->
	<property>
			<name>yarn.log-aggregation-enable</name>
			<value>true</value>
	</property>
	<!-- 开启RM高可靠 -->
	<property>
		<name>yarn.resourcemanager.ha.enabled</name>
		<value>true</value>
	</property>
	<!-- 指定RM的cluster id为yrc，意为yarn cluster -->
	<property>
		<name>yarn.resourcemanager.cluster-id</name>
		<value>yrc</value>
	</property>
	<!-- 指定RM的名字 -->
	<property>
		<name>yarn.resourcemanager.ha.rm-ids</name>
		<value>rm1,rm2</value>
	</property>
	<!-- 指定第一个RM的地址 -->
	<property>
		<name>yarn.resourcemanager.hostname.rm1</name>
		<value>node04</value>
	</property>
    <!-- 指定第二个RM的地址 -->
	<property>
		<name>yarn.resourcemanager.hostname.rm2</name>
		<value>node05</value>
	</property>
    <!-- 配置第一台机器的resourceManager通信地址 -->
	<!--客户端通过该地址向RM提交对应用程序操作-->
	<property>
		<name>yarn.resourcemanager.address.rm1</name>
		<value>node04:8032</value>
	</property>
	<!--向RM调度资源地址--> 
	<property>
		<name>yarn.resourcemanager.scheduler.address.rm1</name>
		<value>node04:8030</value>
	</property>
	<!--NodeManager通过该地址交换信息-->
	<property>
		<name>yarn.resourcemanager.resource-tracker.address.rm1</name>
		<value>node04:8031</value>
	</property>
	<!--管理员通过该地址向RM发送管理命令-->
	<property>
		<name>yarn.resourcemanager.admin.address.rm1</name>
		<value>node04:8033</value>
	</property>
	<!--RM HTTP访问地址,查看集群信息-->
	<property>
		<name>yarn.resourcemanager.webapp.address.rm1</name>
		<value>node04:8088</value>
	</property>
	<!-- 配置第二台机器的resourceManager通信地址 -->
	<property>
		<name>yarn.resourcemanager.address.rm2</name>
		<value>node05:8032</value>
	</property>
	<property>
		<name>yarn.resourcemanager.scheduler.address.rm2</name>
		<value>node05:8030</value>
	</property>
	<property>
		<name>yarn.resourcemanager.resource-tracker.address.rm2</name>
		<value>node05:8031</value>
	</property>
	<property>
		<name>yarn.resourcemanager.admin.address.rm2</name>
		<value>node05:8033</value>
	</property>
	<property>
		<name>yarn.resourcemanager.webapp.address.rm2</name>
		<value>node05:8088</value>
	</property>
    <!--开启resourcemanager自动恢复功能-->
	<property>
		<name>yarn.resourcemanager.recovery.enabled</name>
		<value>true</value>
	</property>	
    <!--在node4上配置rm1,在node5上配置rm2,注意：一般都喜欢把配置好的文件远程复制到其它机器上，但这个在YARN的另一个机器上一定要修改，其他机器上不配置此项-->
	<!--
    <property>       
		<name>yarn.resourcemanager.ha.id</name>
		<value>rm1</value>
	   <description>If we want to launch more than one RM in single node, we need this configuration</description>
	</property>
	-->
	<!--用于持久存储的类。尝试开启-->
	<property>
		<name>yarn.resourcemanager.store.class</name>
		<!-- 基于zookeeper的实现 -->
		<value>org.apache.hadoop.yarn.server.resourcemanager.recovery.ZKRMStateStore</value>
	</property>
    <!-- 单个任务可申请最少内存，默认1024MB -->
	<property>
		<name>yarn.scheduler.minimum-allocation-mb</name>
		<value>512</value>
	</property>
	<!--多长时间聚合删除一次日志 此处-->
	<property>
		<name>yarn.log-aggregation.retain-seconds</name>
		<value>2592000</value><!--30 day-->
	</property>
	<!--时间在几秒钟内保留用户日志。只适用于如果日志聚合是禁用的-->
	<property>
		<name>yarn.nodemanager.log.retain-seconds</name>
		<value>604800</value><!--7 day-->
	</property>
	<!-- 指定zk集群地址 -->
	<property>
		<name>yarn.resourcemanager.zk-address</name>
		<value>node01:2181,node02:2181,node03:2181</value>
	</property>
    <!-- 逗号隔开的服务列表，列表名称应该只包含a-zA-Z0-9_,不能以数字开始-->
	<property>
		<name>yarn.nodemanager.aux-services</name>
		<value>mapreduce_shuffle</value>
	</property>
</configuration>
```

##### 3.7 修改slaves

> node01、node02、node03上运行了datanode、nodemanager，所以修改slaves内容**替换**为：

```shell
node01
node02
node03
```

#### node01上分发hadoop文件夹

> 拷贝到`node02~node05`

```shell
[hadoop@node01 hadoop]$ scp -r /kkb/install/hadoop-2.6.0-cdh5.14.2/ node02:/kkb/install/
[hadoop@node01 hadoop]$ scp -r /kkb/install/hadoop-2.6.0-cdh5.14.2/ node03:/kkb/install/
[hadoop@node01 hadoop]$ scp -r /kkb/install/hadoop-2.6.0-cdh5.14.2/ node04:/kkb/install/
[hadoop@node01 hadoop]$ scp -r /kkb/install/hadoop-2.6.0-cdh5.14.2/ node05:/kkb/install/
```

#### 修改node04/05RM的yarn-site.xml

- 在**node04**上，找到属性`yarn.resourcemanager.ha.id`去除注释①、②

```shell
[hadoop@node04 ~]$ cd /kkb/install/hadoop-2.6.0-cdh5.14.2/etc/hadoop
[hadoop@node04 hadoop]$ vim yarn-site.xml 
```

![](zookeeper.assets/Image201909232016.png)

- 在**node05**上
  - 找到属性`yarn.resourcemanager.ha.id`去除注释**①、②**
  - **③**修改成rm2

```shell
[hadoop@node05 ~]$ cd /kkb/install/hadoop-2.6.0-cdh5.14.2/etc/hadoop/
[hadoop@node05 hadoop]$ vim yarn-site.xml
```

![](zookeeper.assets/Image201909232022.png)

- 修改后，结果如下

![](zookeeper.assets/Image201909232024.png)

#### 配置hadoop环境变量

- **node01到node05五个节点都配置环境变量**

```shell
#将hadoop添加到环境变量中
vim /etc/profile
```

- 添加内容如下（注意：若HADOOP_HOME已经存在，则修改）：

```shell
export HADOOP_HOME=/kkb/install/hadoop-2.6.0-cdh5.14.2/
export PATH=$PATH:$HADOOP_HOME/bin:$HADOOP_HOME/sbin
```

- 编译文件，使新增环境变量生效

```shell
source /etc/profile
```

#### 启动与初始化hadoop集群

>  **注意：**严格按照下面的步骤 先检查各台hadoop环境变量是否设置好

#### 启动zookeeper集群

>  注意：根据zookeeper实际安装情况，启动zookeeper

分别在node01、node02、node03上启动zookeeper

```shell
zkServer.sh start
```

#查看状态：一个为leader，另外两个为follower

```shell
zkServer.sh status
```

#### 启动HDFS

##### 4.2.1 格式化ZK

> 在**node01**上执行即可
>
> - 集群有两个namenode，分别在node01、node02上
>
> - 每个namenode对应一个zkfc进程；
>
> - 在主namenode node01上格式化zkfc

```shell
hdfs zkfc -formatZK
```

##### 4.2.2 启动journalnode

- 在**node01**上执行
  - 会启动node01、node02、node03上的journalnode
  - 因为使用的是hadoop-daemon**s**.sh

```shell
hadoop-daemons.sh start journalnode
```

- 运行jps命令检验，node01、node02、node03上多了JournalNode进程

#####  4.2.3 格式化HDFS

- 在node01上执行
- 根据集群规划node01、node02上运行namenode；所以**只在主namenode节点**即node01上执行命令:
  - 此命令慎用；只在集群搭建（初始化）时使用一次；
  - 一旦再次使用，会将HDFS上之前的数据格式化删除掉

```shell
hdfs namenode -format
```

- 下图表示格式化成功

![](zookeeper.assets/Image201909241056.png)

##### 4.2.4 初始化元数据、启动主NN

- node01上执行（主namenode）

```shell
hdfs namenode -initializeSharedEdits -force
#启动HDFS
start-dfs.sh
```

##### 4.2.5 同步元数据信息、启动从NN

- **node02**上执行（从namenode）
- 同步元数据信息，并且设置node02上namenode为standBy状态

```shell
hdfs namenode -bootstrapStandby
hadoop-daemon.sh start namenode
```

##### 4.2.5 JPS查看进程

- node01上

![](zookeeper.assets/Image201909241118.png)

- node02上

![](zookeeper.assets/Image201909241119.png)

- node03上

![](zookeeper.assets/Image201909241120.png)

#### 启动YARN

##### 4.6.1 **主resourcemanager**

- **node04**上执行（**主resourcemanager**）
  - 把namenode和resourcemanager部署在不同节点，是因为性能问题，因为他们都要占用大量资源
  - 坑：在node04上启动yarn之前，先依次从node04 ssh远程连接到node01、node02、node03、node04、node05；因为初次ssh时，需要交互，输入yes，回车

```shell
start-yarn.sh
```

##### 4.6.2 从resourcemanager

- 在从resourcemanager即**node05**上启动rm

```shell
yarn-daemon.sh start resourcemanager
```

##### 4.6.3 查看resourceManager状态

- node04上，它的resourcemanager的Id是rm1

```shell
yarn rmadmin -getServiceState rm1
```

- node05上，它的resourcemanager的Id是rm2

```shell
yarn rmadmin -getServiceState rm2
```

#### 启动JobHistory

- **node03**上执行

```shell
mr-jobhistory-daemon.sh start historyserver
```



#### 验证集群是否可用

##### 5.1 验证HDFS HA

###### 5.1.1 访问WEB UI

> node01、node02一主一备

```html
http://node01:50070
```

![](zookeeper.assets/Image201907271415.png)

```
http://node02:50070
```

![](zookeeper.assets/Image201907271416.png)

###### 5.1.2 模拟主备切换

- 在主namenode节点，运行

```shell
hadoop-daemon.sh stop namenode
```

- 访问之前为"备namenode"的WEB UI；发现状态更新为active

- 或者使用命令查看状态

```shell
hdfs haadmin -getServiceState nn2
```

![](zookeeper.assets/Image201907271417.png)

- 启动刚才手动停掉的namenode

```shell
hadoop-daemon.sh start namenode
```

- 访问它的WEB UI，发现状态更新为standby

- 或者使用命令查看状态

```
hdfs haadmin -getServiceState nn1
```

![](zookeeper.assets/Image201907271419.png)

##### 5.2 验证Yarn HA

> node04、node05主备切换

###### 5.2.1 访问WEB UI

- node04浏览器访问

```
http://node04:8088/cluster/cluster
```

![](zookeeper.assets/Image201907271519.png)

- node05浏览器访问

```
http://node05:8088/cluster/cluster
```

![](zookeeper.assets/Image201907271520.png)

###### 5.2.2 模拟主备切换

- 在主resourcemanager节点，运行

```shell
yarn-daemon.sh stop resourcemanager
```

- 访问之前为"备resourcemanager"的WEB UI；发现状态更新为active

- 或者命令查看状态

```shell
yarn rmadmin -getServiceState rm2
```

![](zookeeper.assets/Image201907271524.png)

- 启动刚才手动停掉的resourcemanager

```shell
yarn-daemon.sh start resourcemanager
```

- 访问它的WEB UI，发现状态更新为standby

- 或者命令查看状态

```shell
yarn rmadmin -getServiceState rm1
```

![](zookeeper.assets/Image201907271526.png)

###### 5.2.3 运行MR示例

- 运行一下hadoop示例中的WordCount程序：

```shell
hadoop fs -put /kkb/install/hadoop-2.6.0-cdh5.14.2/LICENSE.txt /
hadoop jar /kkb/install/hadoop-2.6.0-cdh5.14.2/share/hadoop/mapreduce/hadoop-mapreduce-examples-2.6.0-cdh5.14.2.jar wordcount /LICENSE.txt /w0727
```



#### 集群常用命令

##### 关闭Hadoop HA集群

> 正确指令执行顺序如下

- 主namenode上运行

```shell
stop-dfs.sh
```

- 主resoucemanager上运行

```shell
stop-yarn.sh
```

- 从resoucemanager上运行

```shell
yarn-daemon.sh stop resourcemanager
```

- 关闭zookeeper集群；每个zk服务器运行

```shell
zkServer.sh stop
```

##### 常用命令

- 单独启动namenode

```shell
hadoop-daemon.sh start namenode
```

- 单独启动datanode

```shell
hadoop-daemon.sh start datanode
```

- 单独启动journalnode

```shell
hadoop-daemon.sh start journalnode
```

- 启动zookeeper

```shell
./zkServer.sh start
```

- 启动hdfs

```shell
start-dfs.sh
```

- 启动yarn

```shell
start-yarn.sh
```

- 单独启动resorucemanager

```shell
yarn-daemon.sh start resouremanger
```

- 查看namenode状态（namenode1）

```shell
hdfs haadmin -getServiceState nn1
```

- 查看resourcemanager状态（resourcemanager2）

```shell
yarn rmadmin -getServiceState rm2
```

## zookeeper学习目标

1. 学会`ZooKeeper`的基本使用：命令行、`Java`编程
2. 理解`ZooKeeper watcher`监听器工作原理：注册、监听事件、回调函数（考点）
3. 能独立描述出`ZooKeeper`选举过程（难点、考点）
4. 理解、并讲述客户端从`ZooKeeper`读写的过程（考点）

## ZooKeeper介绍

- `Zookeeper`是一个分布式协调框架，是`Google`的`Chubby`的一个开源实现版。

- `ZooKeeper`是一个开源的**主从架构**的分布式框架，`leader`为主；`follower`为从，为其他的分布式框架**提供协调服务（service）**。

- `Zookeeper` 作为一个分布式的服务框架

  - 它提供类似于`linux`文件系统（有**目录节点树**）的简版文件系统来存储数据
  - `Zookeeper` 维护和**监控**存储的数据的**状态变化**，通过监控这些数据状态的变化，从而达到基于数据的集群管理
  - 主要用来解决分布式集群中应用系统的**一致性**问题

  **hadoop生态圈：**

![](zookeeper.assets/Image201906091839.png)

![](zookeeper.assets/zkservice.jpg)

## 为什么要用ZooKeeper

- 分布式框架多个独立的程序协同工作比较复杂

  - **开发人员容易花较多的精力实现如何使多个程序协同工作的逻辑**
  - 导致没有时间更好的思考实现程序本身的逻辑
  - 或者开发人员对程序间的协同工作关注不够，造成协调问题
  - 且这个分布式框架中协同工作的逻辑是共性的需求

- ZooKeeper简单易用，能够很好的解决分布式框架在运行中，出现的各种协调问题。

  - 比如**集群`master`主备切换、节点的上下线感知、统一命名服务、状态同步服务、集群管理、分布式应用配置管理**等等

  

## zkCli命令行操作Zookeeper集群

###### zookeeper脚本存放路径

```
/kkb/install/zookeeper-3.4.5-cdh5.14.2/bin
```

###### zookeeper启动与关闭

特别注意，启动zk集群的时候每个节点都要执行启动命令，否则报错。

```shell
## 启动ZooKeeper集群；在ZooKeeper集群中的每个节点执行此命令
${ZK_HOME}/bin/zkServer.sh start
## 停止ZooKeeper集群（每个节点执行以下命令）
${ZK_HOME}/bin/zkServer.sh stop
## 查看集群状态（每个节点执行此命令）
${ZK_HOME}/bin/zkServer.sh status
```

###### 客户端连接zkServer服务器

```shell
## 使用ZooKeeper自带的脚本，连接ZooKeeper的服务器
zkCli.sh -server node01:2181,node02:2181,node03:2181

## -server选项后指定参数node01:2181,node02:2181,node03:2181
#客户端会随机的连接三个服务器中的一个
```

###### 查看通信端口

查看`${ZK_HOME}/conf/zoo.cfg`配置文件：

```shell
vi /kkb/install/zookeeper-3.4.5-cdh5.14.2/conf/zoo.cfg

## The number of milliseconds of each tick
tickTime=2000 #集群进行通信的基本时间单位，2000毫秒

## The number of ticks that the initial 
## synchronization phase can take
initLimit=10  #集在启动的时候初始化的最长时间： 10*2000毫秒

## The number of ticks that can pass between 
## sending a request and getting an acknowledgement
syncLimit=5  #主节点与从节点进行通信的时间

## the directory where the snapshot is stored.
## do not use /tmp for storage, /tmp here is just 
## example sakes.
dataDir=/kkb/install/zookeeper-3.4.5-cdh5.14.2/zkdatas
#往zk集群读写数据的路径，每个zk服务器都有这个路径

## the port at which the clients will connect
clientPort=2181  #客户端与集群通信的端口

## the maximum number of client connections.
## increase this if you need to handle more clients
#maxClientCnxns=60
#
## Be sure to read the maintenance section of the 
## administrator guide before turning on autopurge.
#
## http://zookeeper.apache.org/doc/current/zookeeperAdmin.html#sc_maintenance
#
## The number of snapshots to retain in dataDir
autopurge.snapRetainCount=3  #快照默认保存多少个
## Purge task interval in hours
## Set to "0" to disable auto purge feature
autopurge.purgeInterval=1  #每隔1小时清理以下快照

server.1=node01:2888:3888  
server.2=node02:2888:3888 
server.3=node03:2888:3888
#上面的1、2、3是服务器的id号，2888是zk集群内部各个服务器之间的通信端口，3888是用于选举的端口
```

###### 查看支持的命令

```shell
[zk: node01:2181,node02:2181,node03:2181(CLOSED) 2] help
ZooKeeper -server host:port cmd args
        stat path [watch]  #查看path节点状态（可设置watcher)
        set path data [version] #查看节点数据
        ls path [watch] #查看节点有哪些子节点（可设置watcher）
        delquota [-n|-b] path
        ls2 path [watch] #查看节点有哪些子节点、状态、相当于ls+stat(可设置watcher)
        setAcl path acl #设置访问控制列表
        setquota -n|-b val path
        history  #查看session中，输入过的命令
        redo cmdno
        printwatches on|off
        delete path [version] #删除节点
        sync path
        listquota path
        rmr path  #删除节点
        get path [watch] #获得节点各种数据（可设置watcher）
        create [-s] [-e] path data acl #创建节点并设置数据
        addauth scheme auth
        quit #退出命令行
        getAcl path
        close #关闭session
        connect host:port  #连接zookeeper集群服务器
```

###### 常用命令

注意：`zk`集群的每个服务器的文件系统的内容都是一致的，比如说，往`node01`上的`zk`服务器的文件系统写入数据，那么`node02`和`node03`上的`zk`服务器的文件系统也会写入相同的数据。（原理后面会讲）

```shell
#查看ZooKeeper根目录/下的文件列表
ls /
```

```shell
#创建节点，并指定数据
create /kkb	krystal #创建节点的时候一定要指定数据
```

```shell
#获得某节点的数据
get /kkb

krystal
cZxid = 0x300000007
ctime = Tue Feb 18 00:26:33 CST 2020
mZxid = 0x300000007
mtime = Tue Feb 18 00:26:33 CST 2020
pZxid = 0x300000007
cversion = 0
dataVersion = 0
aclVersion = 0
ephemeralOwner = 0x0
dataLength = 7
numChildren = 0
```

```shell
#修改节点的数据
set /kkb kkb01

#删除节点
delete /kkb
```



## Java API编程（重点 ）

### 原生API编程

比较复杂

### curator编程

`Curator`对`ZooKeeper`的`api`做了封装，提供简单易用的`api`。它的风格是`Curator`链式编程，可以参考《使用`curator`做`zk`编程》。[Curator官网]( http://curator.apache.org/ )：http://curator.apache.org/

#### 创建Maven工程

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>org.example</groupId>
    <artifactId>MyZookeeper</artifactId>
    <version>1.0-SNAPSHOT</version>
    <dependencies>
        <dependency>
            <groupId>org.apache.zookeeper</groupId>
            <artifactId>zookeeper</artifactId>
            <version>3.4.13</version>
        </dependency>
        <dependency>
            <groupId>org.apache.curator</groupId>
            <artifactId>curator-recipes</artifactId>
            <version>4.2.0</version>
        </dependency>
        <dependency>
            <groupId>org.apache.curator</groupId>
            <artifactId>curator-framework</artifactId>
            <version>4.2.0</version>
        </dependency>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
            <scope>compile</scope>
        </dependency>
        <dependency>
            <groupId>org.testng</groupId>
            <artifactId>testng</artifactId>
            <version>RELEASE</version>
        </dependency>
        <dependency>
            <groupId>log4j</groupId>
            <artifactId>log4j</artifactId>
            <version>1.2.17</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <source>8</source>
                    <target>8</target>
                </configuration>
            </plugin>
        </plugins>
    </build>

</project>
```

#### 案例1

```java
package com.jimmy.day04;

import org.apache.curator.framework.CuratorFramework;
import org.apache.curator.framework.CuratorFrameworkFactory;
import org.apache.curator.framework.recipes.cache.ChildData;
import org.apache.curator.framework.recipes.cache.TreeCache;
import org.apache.curator.framework.recipes.cache.TreeCacheEvent;
import org.apache.curator.framework.recipes.cache.TreeCacheListener;
import org.apache.curator.retry.RetryNTimes;
import org.apache.zookeeper.CreateMode;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

public class CuratorClientDemo {
    //设置要连接的zookeeper的服务器
    private static final String ZK_ADDRESS = "node01:2181,node02:2181,node03:2181";
    //设置要操作zk节点ZNode
    private static final String ZK_PATH = "/zk_test";
    private static final String ZK_PATH01 = "/beijing/goddess/anzhulababy";

    static CuratorFramework client = null;

    @Before
    //初始化，建立连接，运行@Test方法之前就会执行这个方法
    public void init() {
        //客户端会随机连接某个zk服务器，如果连接失败，就会重新尝试连接到另一个服务器
        //设置重试连接策略，失败重试次数；10,每次休眠（重试间隔）5000毫秒
        RetryNTimes retryPolicy = new RetryNTimes(10, 5000);

        //获得客户端对象，参数1：指定连接的服务器集端口列表；参数2：重试策略
        client = CuratorFrameworkFactory.newClient(ZK_ADDRESS, retryPolicy);
        //启动客户端，连接到zk集群
        client.start();

        System.out.println("zk client start successfully!");
    }

    //运行@Test方法后才会执行该方法
    @After
    //关闭连接
    public void clean() {
        System.out.println("close session");
        client.close();
    }

    //运行@Before方法之后执行这个方法
    @Test
    // 创建永久节点
    public void createPersistentZNode() throws Exception {
        String zNodeData = "火辣的";

        ///a/b/c
        client.create().
                creatingParentsIfNeeded().          //如果父目录不存在，则创建
                withMode(CreateMode.PERSISTENT).    //创建永久节点
                forPath("/beijing/goddess/anzhulababy", zNodeData.getBytes());//指定路径及节点数据
    }

    @Test
    // 创建临时节点
    public void createEphemeralZNode() throws Exception {
        String zNodeData2 = "流星雨";
        client.create().
                creatingParentsIfNeeded().
                withMode(CreateMode.EPHEMERAL). //ɪˈfemərəl
                forPath("/beijing/star", zNodeData2.getBytes());

        Thread.sleep(10000);
    }

    @Test
    //查询znode数据
    public void queryZNodeData() throws Exception {
        // 查询列表
        print("ls", "/");
        print(client.getChildren().forPath("/"));

        //查询节点数据
        print("get", ZK_PATH);
        if(client.checkExists().forPath(ZK_PATH) != null) {//判断znode是否存在
            print(client.getData().forPath(ZK_PATH));//如果存在则获得znode的数据
        } else {
            System.out.println("节点不存在");
        }
    }

    @Test
    public void modifyZNodeData() throws Exception {
        //修改前的数据
        print(client.getData().forPath(ZK_PATH));

        String data2 = "welcome to jumanji";
        print("set", ZK_PATH, data2);

        // 修改节点数据
        client.setData().forPath(ZK_PATH, data2.getBytes());
        print("get", ZK_PATH);
        //修改后的数据
        print(client.getData().forPath(ZK_PATH));
    }

    @Test
    public void deleteZNode() throws Exception {
        // 删除节点
        print("delete", ZK_PATH);
        client.delete().forPath(ZK_PATH);

        print("ls", "/");
        print(client.getChildren().forPath("/"));
    }

    @Test
    //监听ZNode
    public void watchZNode() throws Exception {

        //cache: TreeCache\PathChildrenCache\DataCache
        //设置节点的cache缓存对象
        TreeCache treeCache = new TreeCache(client, "/zk_test");
        //设置监听器
        treeCache.getListenable().addListener(new TreeCacheListener() {
            //处理过程：
            @Override
            public void childEvent(CuratorFramework client, TreeCacheEvent event) throws Exception {
                ChildData data = event.getData();
                if (data != null) {
                    switch (event.getType()) {
                        case NODE_ADDED://添加了节点
                            System.out.println("NODE_ADDED : " + data.getPath() + "  数据:" + new String(data.getData()));
                            break;
                        case NODE_REMOVED://节点被删除了
                            System.out.println("NODE_REMOVED : " + data.getPath() + "  数据:" + new String(data.getData()));
                            break;
                        case NODE_UPDATED://数据被更新了
                            System.out.println("NODE_UPDATED : " + data.getPath() + "  数据:" + new String(data.getData()));
                            break;
                        default:
                            break;
                    }
                } else {
                    System.out.println("data is null : " + event.getType());
                }
            }
        });

        //开始监听
        treeCache.start();
        Thread.sleep(30000);
        //关闭cache
        System.out.println("关闭treeCache");
        treeCache.close();
    }

    public static void main(String[] args) throws Exception {
        CuratorClientDemo ccd=new CuratorClientDemo();
        ccd.init();
        ccd.createPersistentZNode();
        ccd.createEphemeralZNode();
        ccd.queryZNodeData();
        ccd.modifyZNodeData();
        ccd.deleteZNode();
        ccd.watchZNode();
        ccd.clean();
    }

    private static void print(String... cmds) {
        StringBuilder text = new StringBuilder("$ ");
        for (String cmd : cmds) {
            text.append(cmd).append(" ");
        }
        System.out.println(text.toString());
    }

    private static void print(Object result) {
        System.out.println(
                result instanceof byte[]
                        ? new String((byte[]) result)
                        : result);
    }
}
```

**补充：**

```java
@Before – 表示在任意使用@Test注解标注的public void方法执行之前执行
@After – 表示在任意使用@Test注解标注的public void方法执行之后执行
@Test – 使用该注解标注的public void方法会表示为一个测试方法
```



#### 案例2：另一中监听器

```java
package com.jimmy.day04;

import org.apache.curator.framework.CuratorFramework;
import org.apache.curator.framework.CuratorFrameworkFactory;
import org.apache.curator.framework.recipes.cache.PathChildrenCache;
import org.apache.curator.framework.recipes.cache.PathChildrenCacheEvent;
import org.apache.curator.framework.recipes.cache.PathChildrenCacheListener;
import org.apache.curator.retry.RetryNTimes;
import org.apache.curator.utils.ZKPaths;

public class CuratorWatcherDemo {
    /**
     * Zookeeper info
     */
    private static final String ZK_ADDRESS = "note01:2181,node02:2181,node03:2181";
    private static final String ZK_PATH = "/zktest";

    public static void main(String[] args) throws Exception {
        // 1.Connect to zk
        CuratorFramework client = CuratorFrameworkFactory.newClient(
                ZK_ADDRESS,
                new RetryNTimes(10, 5000)
        );
        client.start();
        System.out.println("zk client start successfully!");

        //path cache
        ///zktest/b/a
        PathChildrenCache pathCache = new PathChildrenCache(client, ZK_PATH, true);
        //只能监听ZK_PATH对应节点下一级目录的子节点的变化内容
        // 即只能监听/ZK_PATH/node1的变化，而不能监听/ZK_PATH/node1/node2 的变化
        
        //Listener for PathChildrenCache changes
        PathChildrenCacheListener listener = new PathChildrenCacheListener() {
            @Override
            public void childEvent(CuratorFramework client, PathChildrenCacheEvent event) throws Exception {
                switch (event.getType()) {
                    case CHILD_ADDED: {
                        System.out.println("Node added: " + ZKPaths.getNodeFromPath(event.getData().getPath()));
                        break;
                    }

                    case CHILD_UPDATED: {
                        System.out.println("Node changed: " + ZKPaths.getNodeFromPath(event.getData().getPath()));
                        break;
                    }

                    case CHILD_REMOVED: {
                        System.out.println("Node removed: " + ZKPaths.getNodeFromPath(event.getData().getPath()));
                        break;
                    }
                    default:
                        break;
              java  }
            }
        };

        //添加监听器
        pathCache.getListenable().addListener(listener);

        //开启缓存
        pathCache.start(PathChildrenCache.StartMode.BUILD_INITIAL_CACHE);
        System.out.println("Register zk pathCache successfully!");

        Thread.sleep(60000);
        //关闭缓存
        pathCache.close();

        //关闭zk连接
        client.close();
    }
}
```

## Zookeeper基本概念和操作(TODO)

> 分布式通信有几种方式
>
> 1、直接通过网络连接的方式进行通信
>
> 2、通过共享存储的方式，来进行通信或数据的传输
>
> ZooKeeper使用第二种方式，提供分布式协调服务

## ZooKeeper数据结构

`ZooKeeper`主要由以下三个部分实现

1. 简版文件系统(`Znode`)：基于类似于文件系统的**目录节点树**方式的数据存储
2. 原语：可简单理解成ZooKeeper的基本的命令
3. 通知机制(`Watcher`)。

**watcher示意图：**

![image-20200218003759092](zookeeper.assets/image-20200218003759092.png)



## Zookeeper数据节点ZNode

在`Zookeeper`里，我们不把文件系统的目录称为目录，而是称为节点`ZNode`。

**`ZNode` 分为四类：**

|            | 持久节点    | 临时节点       |
| ---------- | ----------- | -------------- |
| 非有序节点 | `create`    | `create -e`    |
| 有序节点   | `create -s` | `create -s -e` |

#### 持久节点

持久节点在会话结束之后，还会依然存在`zk`文件系统里。

```shell
## 创建持久节点/zk_test，并设置数据my_data
create /zk_test my_data
## 持久节点，只有显示的调用命令，才能删除永久节点
delete /zk_test
```

#### 临时节点

临时节点的生命周期跟客户端会话`session`绑定，**一旦会话失效，临时节点被删除**。

```shell
## client1上创建临时节点
create -e /tmp tmpdata

## client2上查看client1创建的临时节点
ls /

## client1断开连接
close

## client2上观察现象，发现临时节点被自动删除
ls /
```

#### 非有序节点

通过上面的方式创建的节点，**默认都是非有序的**。

#### 有序节点

`ZNode`也可以设置为有序节点，主要是为了避免多个客户端写入同名称的文件导致文件重名的情况。防止多个不同的客户端在同一目录下，创建同名`ZNode`，由于重名，导致创建失败。

![image-20200218005827323](zookeeper.assets/image-20200218005827323.png)

一旦节点被标记上这个属性，那么在这个节点被创建时，`ZooKeeper` 就会自动在其节点后面追加上一个整型数字。这个整数是一个由父节点维护的自增数字。

创建有序节点，使用`-s`选项：`create -s` ：

```shell
## 创建持久、有序节点
create -s /test01 test01-data
## Created /test010000000009
```


## 会话（Session)

#### 什么是会话

- 客户端要对`ZooKeeper`集群进行读写操作，得先与某一`ZooKeeper`服务器建立**TCP长连接**；**此TCP长连接称为建立一个会话`Session`。**

- 每个会话有超时时间：`SessionTimeout`
  - 当客户端与集群建立会话后，如果超过`SessionTimeout`时间，两者间没有通信，会话超时

#### 会话的特点

- 客户端打开一个`Session`中的请求以FIFO（先进先出）的顺序执行；
  - 比如，客户端`client01`与集群建立会话后，先发出一个`create`请求，再发出一个`get`请求。那么在执行时，会先执行`create`，再执行`ge`t
- 若打开两个`Session`，无法保证`Session`间的请求按照`FIFO`策略执行；只能保证一个`session`中的请求的按照`FIFO`策略执行。

#### 会话的生命周期

会话的生命周期

- 未建立连接
- 正在连接
- 已连接
- 关闭连接

![](zookeeper.assets/Image201905311514.png)

## 请求

- 读写请求
  - 写请求：通过客户端向`ZooKeeper`集群中写数据
  - 读请求：通过客户端从`ZooKeeper`集群中读数据

![ZooKeeper官网架构图](zookeeper.assets/zkservice.jpg)

## 事务zxid

客户端的写请求，会对`ZooKeeper`中的数据做出更改；如增删改的操作。**每次写请求，都会生成一次事务。**每个事务有一个全局唯一的事务`ID`，用 `ZXID` 表示；全局自增

#### 事务的特点：ACID

> 1. 原子性（`Atomicity`）：事务是一个不可分割的工作单位，事务中的操作要么都发生，要么都不发生。
> 2. 一致性（`Consistency`）：一致性是指事务执行结束后，数据库的完整性约束没有被破坏，事务执行的前后都是合法的数据状态。
> 3. 隔离性（`Isolation`）：隔离性是多个用户并发访问数据库时，数据库为每一个用户开启的事务，不能被其他事务的操作数据所干扰，多个并发事务之间要相互隔离。
> 4. 持久性（`Durability`）：持久性是指一个事务一旦被提交，它对数据库中数据的改变就是永久性的，接下来即使数据库发生故障也不应该对其有任何影响。
>
> **原子性示意图：**
>
> ![image-20200218014020278](zookeeper.assets/image-20200218014020278.png)
>
> **持久性的理解：**
>
> 操作前A：800，B：200
>
> 操作后A：600，B：400
>
> 如果在操作前（事务还没有提交）服务器宕机或者断电，那么重启数据库以后，数据状态应该为
>
> A：800，B：200
>
> 如果在操作后（事务已经提交）服务器宕机或者断电，那么重启数据库以后，数据状态应该为
>
> A：600，B：400
>
> 

#### ZXID的结构：

- 通常是一个64位的数字。由**epoch+counter（累加器）**组成
- `epoch`、`counter`各32位

![](zookeeper.assets/Image201906140813.png)

## Watcher：监视与通知 

#### 为什么要有Watcher？

首先思考一个问题：客户端如何获取`ZooKeeper`服务器上的**最新数据**？

- **方式一**：轮询

  `ZooKeeper`以远程服务的方式，被客户端访问；客户端以轮询的方式获得`znode`数据，效率会比较低（代价比较大）

![](zookeeper.assets/Image201905291811.png)

- **方式二**：基于通知的机制

  客户端在`znode`上注册一个`Watcher`监视器，当`znode`上数据出现变化，`watcher`监测到此变化，通知客户端，然后客户端就可以获取最新数据。

![](zookeeper.assets/Image201905291818.png)

可以看到，通过第二种`watcher`的方式，明显比第一种方法效率高。

#### 什么是Watcher?

- **客户端在服务器端，注册的事件监听器**；
- `watcher`用于监听`znode`上的某些事件
  - 比如`znode`数据修改、节点增删等；
  - 当监听到事件后，`watcher`会触发通知客户端

#### 如何设置Watcher

> 注意：**Watcher是一个单次触发的操作,被触发过一次后就时效了**

- 可以设置`watcher`的命令如下：

```shell
stat path [watch]  #查看path节点状态（可设置watcher)
ls path [watch] #查看节点有哪些子节点（可设置watcher）
ls2 path [watch] #查看节点有哪些子节点、状态、相当于ls+stat(可设置watcher)
get path [watch] #获得节点各种数据（可设置watcher）
```

##### 示例1：使用ls path [watch]设置监听器

```shell
#设置监测子节点有没有变化的监听器：

#node01 上执行
create /zk_test krystal #创建节点
ls /zk_test watch  #设置监听器

#node02 上执行
create /zk_test/dir01 dir01-data

#观察node-01上变化
[zk: node-01:2181,node-02:2181,node-03:2181(CONNECTED) 87] 
WATCHER::

WatchedEvent state:SyncConnected type:NodeChildrenChanged path:/zk_test

#node02 上执行
create /zk_test/dir02 dir01-data

#再观察node-01上变化，此时没有变化，因为监听器触发过后就失效了
```

##### **示例2**：使用get path [watch]设置监听器

```shell
#监控节点数据的变化的监听器；
#node02上
get /zk_test watch

#node03上
set /zk_test "junk01"
#观察node2上cli的输出，检测到变化
```

##### **示例3**：节点上下线监控

```shell
#在client1操作
## 创建临时节点

create -e /zk_tmp tmp-data
```

```shell
## 在client2操作
## 在/zk_tmp注册监听器
ls /zk_tmp watch
```

```shell
#在client1操作
## 模拟节点下线
close
```

观察`client2`

```shell
WATCHER::

WatchedEvent state:SyncConnected type:NodeDeleted path:/zk_tmp
```

**上下线感知原理：**

1. 节点`1`（`client1`）创建临时节点
2. 节点2（`client2`）在临时节点，注册监听器`watcher`
3. 当`client1`与zk集群断开连接，临时节点会被删除
4. `watcher`发送消息，通知`client2`，临时节点被删除的事件
5. 注意： 节点1时某分布式集群的节点，而临时节点是说zookeeper服务器文件系统的一个目录

**用到的zk特性：Watcher+临时节点**。通过这种方式，**检测和被检测系统不需要直接关联（如client1与client2）**，而是通过ZK上的某个节点进行关联，大大减少了系统**耦合**。

![image-20200218022634477](zookeeper.assets/image-20200218022634477.png)

## ZooKeeper工作原理

- `ZooKeeper`使用原子广播协议叫做`Zab(ZooKeeper Automic Broadcast)`协议
- `Zab`协议有两种模式
  - **恢复模式（选主）**：因为`ZooKeeper`也是主从架构；当`ZooKeeper`集群没有主的角色leader时，从众多服务器中选举`leader`时，处于此模式。
  - **广播模式（同步）**：当集群有了`leader`后，客户端向`ZooKeeper`集群读写数据时，集群处于此模式。
- 为了保证事务的顺序一致性，`ZooKeeper`采用了递增的事务`id`号（`zxid`）来标识事务，所有提议（`proposal`）都有`zxid`

## HDFS HA方案原理（重点）

#### 监听器的重要逻辑

- 关于ZooKeeper监听器有三个重要的逻辑：

  - **注册**：客户端向`ZooKeeper`集群注册监听器
  - **监听事件**：监听器负责监听特定的事件
  - **回调函数**：当监听器监听到事件的发生后，调用**注册监听器时**定义的回调函数。

> **函数大致类型：**
>
> - 主函数：相当于整个程序的引擎，调度各个函数按序执行
> - 回调函数：一个独立的功能函数，如写文件函数
> - 中间函数：一个介于主函数和回调函数之间的函数，登记回调函数，通知主函数，起到一个桥梁的作用
>
> **回调函数**就是一个通过[函数指针](https://baike.baidu.com/item/函数指针/2674905)调用的函数。如果你把函数的[指针](https://baike.baidu.com/item/指针/2878304)（地址）作为[参数传递](https://baike.baidu.com/item/参数传递/9019335)给另一个函数，当这个指针被用来调用其所指向的函数时，我们就说这是回调函数。回调函数不是由该函数的实现方直接调用，而是在特定的事件或条件发生时由另外的一方调用的，用于对该事件或条件进行响应。

#### 监听器逻辑的类比举例

- 为了便于理解，举例：旅客住店无房可住的情况

  - 一哥们去酒店办理入住，但是被告知目前无空房
  - 这哥们告诉客服：你给我记住了，帮我留意一下有没有空出的房间，如果有，及时通知我（**类似注册监听器，监听特定事件**）
  - 将近12点，有房客退房，有空闲的房间（**事件**）
  - 客服发现有空房（**监听到事件**）
  - 及时通知这哥们
  - 这哥们收到通知后，**做一些事**，比如马上从附近酒吧赶回酒店（**调用回调函数**）

  ![](zookeeper.assets/Image201910242342.png)

#### HDFS HA原理（难点）

> 关键逻辑：
>
> ①监听器：**注册、监听事件、回调函数**
>
> ②共享存储：**JournalNode**   

- 在`Hadoop 1.x`版本，`HDFS`集群的`NameNode`一直存在单点故障问题：
  - 集群只存在一个`NameNode`节点，它维护了`HDFS`所有的元数据信息
  - 当该节点所在服务器宕机或者服务不可用，整个`HDFS`集群处于不可用状态

- `Hadoop 2.x`版本提出了高可用 (`High Availability`, `HA`) 解决方案

> HDFS HA方案，主要分两部分：
>
> ①元数据同步
>
> ②主备切换

##### 元数据同步原理

- 在同一个`HDFS`集群，运行两个互为主备的`NameNode`节点。
- 一台为主`Namenode`节点，处于`Active`状态，一台为备`NameNode`节点，处于`Standby`状态。
- 其中只有`Active NameNode`对外提供读写服务，`Standby NameNode`会根据`Active NameNode`的状态变化，在必要时**切换**成`Active`状态。
- **JournalNode集群**
  - 在主备切换过程中，新的`Active NameNode`必须确保与原`Active NamNode`元数据同步完成，才能对外提供服务
  - 所以用`JournalNode`集群作为共享存储系统；
  - 当客户端对`HDFS`做操作，会在`Active NameNode中edits.log`文件中作日志记录，同时日志记录也会写入`JournalNode`集群；负责存储`HDFS`新产生的元数据
  - 当有新数据写入`JournalNode`集群时，`Standby NameNode`能监听到此情况，将新数据同步过来
  - `Active NameNode`(写入)和`Standby NameNode(`读取)实现元数据同步
  - 另外，所有`datanode`会向两个主备`namenode`做`block report`

**元数据同步示意图：**

![](zookeeper.assets/Image201905211519.png)



##### 主备切换原理

![](zookeeper.assets/Image201909200732.png)

- **ZKFC涉及角色**

  - 每个`NameNode`节点上各有一个`ZKFC`进程
  - `ZKFC`即`ZKFailoverController`，作为独立进程存在，负责控制`NameNode`的主备切换
  - `ZKFC`会监控`NameNode`的健康状况，当发现`Active NameNode`异常时，通过`Zookeeper`集群进行`namenode`主备选举，完成`Active`和`Standby`状态的切换
    - `ZKFC`在启动时，同时会初始化`HealthMonitor`和`ActiveStandbyElector`服务
    - `ZKFC`同时会向`HealthMonitor`和`ActiveStandbyElector`注册相应的回调方法（如上图的①回调、②回调）
    - **HealthMonitor**定时调用`NameNode`的`HAServiceProtocol RPC`接口(monitorHealth和`getServiceStatus`)，监控`NameNode`的健康状态，并向`ZKFC`反馈
    - **ActiveStandbyElector**接收`ZKFC`的选举请求，通过`Zookeeper`自动完成`namenode`主备选举
    - 选举完成后回调`ZKFC`的主备切换方法对`NameNode`进行`Active`和`Standby`状态的切换

- **主备选举过程：**

  - //---------------------------启动`hadoop`和`zookeeper`集群，进行选举-----------------------//
  - 启动两个`NameNode`、`ZKFC`，此时不知道哪个是主`NameNode`、哪个备`NameNode`。
  - 两个`ZKFC`通过各自`ActiveStandbyElector`发起`NameNode`的主备选举，这个过程利用`Zookeeper`的写一致性和临时节点机制实现
  - 当发起一次**主备**选举时，`ActiveStandbyElector`会尝试在`Zookeeper`创建临时节点`/hadoop-ha/${dfs.nameservices}/ActiveStandbyElectorLock`，`Zookeeper`的写一致性保证最终只会有一个`ActiveStandbyElector`创建成功
  - `ActiveStandbyElector`从`ZooKeeper`获得选举结果
  - 创建成功的 `ActiveStandbyElector`回调`ZKFC`的回调方法②，把选举结果返回给`ZKFC`，`ZKFC`从而将对应的`NameNode`切换为`Active NameNode`状态
  - 而创建失败的`ActiveStandbyElector`也会回调ZKFC的回调方法②，将对应的`NameNode`切换为`Standby NameNode`状态
  - 不管是否选举成功，所有`ActiveStandbyElector`都会在`ActiveStandbyElectorLock`临时节点上注册一个`Watcher`监听器，来监听这个节点的状态变化事件
  - //-------------------------------------`namenode`出现异常，进行主备切换---------------------//
  - 如果`Active NameNode`对应的`HealthMonitor`检测到`NameNode`状态异常时，调用回调函数1，通知对应的`ZKFC`。
  - `ZKFC`会调用 `ActiveStandbyElector` 方法，删除在`Zookeeper上`创建的临时节点`ActiveStandbyElectorLock`（或者`ActvieStandbyElector`与`ZooKeeper`的`session`断开，临时节点也会被删除，但有可能此时原`Active NameNode`仍然是`active`状态，会出现下面说得脑裂问题）
  - 此时，`Standby NameNode`的`ActiveStandbyElector`注册的`Watcher`就会监听到此节点的 `NodeDeleted`事件。
  - 收到这个事件后，此`standby NameNode`对应的`ActiveStandbyElector`再次发起主备选举，成功创建临时节点`ActiveStandbyElectorLock`，如果创建成功，则`Standby NameNode`被选举为`Active NameNode`（过程同上）

- **如何防止脑裂**

  - 脑裂

    在分布式系统中双主现象又称为脑裂，由于`Zookeeper`的“假死”、长时间的垃圾回收或其它原因都可能导致双`Active NameNode`现象，此时两个`NameNode`都可以对外提供服务，无法保证数据一致性

  - 隔离

    对于生产环境，这种情况的出现是毁灭性的，必须通过自带的**隔离（Fencing）**机制预防此类情况

  - 原理

    - //-----------------------------正常断开`Session`------------------------------------//

    - `ActiveStandbyElector`成功创建`ActiveStandbyElectorLock`临时节点后，会创建另一个`ActiveBreadCrumb`持久节点

    - `ActiveBreadCrumb`持久节点保存了`Active NameNode`的地址信息。

    - 当`Active NameNode`在正常的状态下断开`Zookeeper Session`，会一并删除临时节点`ActiveStandbyElectorLock`、持久节点`ActiveBreadCrumb`

    - //-----------------------------非正常断开`Session`------------------------------------//

    - 但是如果`ActiveStandbyElector`在异常的状态下关闭`Zookeeper Session`，那么`ActiveStandbyElectorLock`临时节点会被删掉，持久节点`ActiveBreadCrumb`会保留下来，`NameNode`**还处于active状态**。或者由于`active NameNode`与`ZooKeeper`通信不畅导致，也会导致这种情况出现。

    - 此时`standby NameNode`监测到这种情况，成功创建临时节点，选举成功，当这个`NameNode`将由`standy`变成`active`状态之前，会发现上一个`Active NameNode`遗留下来的`ActiveBreadCrumb`节点，那么会回调`ZKFC`的方法对旧的`Active NameNode`进行`fencing`隔离

    - //-------------------------------------进行隔离=====================//

      ①首先`ZKFC`会尝试调用旧`Active NameNode`的`HAServiceProtocol RPC`接口的`transitionToStandby`方法，看能否将其状态切换为`Standby`。

      ②如果`transitionToStandby`方法切换状态失败，那么就需要执行`Hadoop`自带的隔离措施，`Hadoop`目前主要提供两种隔离措施：
      `sshfence：SSH to the Active NameNode and kill the process；`
      `shellfence：run an arbitrary shell command to fence the Active NameNode`

      //=====================--成功`fencing`后---------------------------------//

      ③只有成功地`fencing`之后，选主成功的`ActiveStandbyElector`才会回调`ZKFC`的`becomeActive`方法`transitionToActive`将对应的`NameNode`切换为`Active`，开始对外提供服务

## ZooKeeper之攘其外（重点）

#### Zookeeper工作原理回顾

- `ZooKeeper`使用原子广播协议`Zab(ZooKeeper Automic Broadcast)`，保证分布式一致性
- 协议`Zab`协议有两种模式，它们分别是
 - ①**恢复模式（选主）**：因为`ZooKeeper`也是主从架构；当`ZooKeeper`集群没有主的角色`leader`时，从众多服务器中选举`leader`时，处于此模式；主要处理内部矛盾，我们称之为**安其内**
 - ②**广播模式（同步）**：当集群有了`leader`后，客户端向`ZooKeeper`集群读写数据时，集群处于此模式；主要处理外部矛盾，我们称之为**攘其外**
- 事务
 - 为了保证事务的顺序一致性，`ZooKeeper`采用了递增的事务`id`号（`zxid`）来标识事务，所有提议（`proposal`）都有`zxid`
 - 每次事务的提交，必须符合`quorum`ˈkwɔːrəm多数派

#### ZooKeeper集群架构图

- `ZooKeeper`集群也是主从架构
  - 主角色：`leader`
  - 从角色：`follower`或`observer`；统称为`learner`

![](zookeeper.assets/zkservice-1581885316200.jpg)



- 客户端与ZK集群交互，主要分两大类操作，读与写。

####  读操作原理

![](zookeeper.assets/Image201910251149.png)

- 常见的读取操作，如`ls /`查看目录；`get /zktest`查询`ZNode`数据

- 读操作

  - 客户端先与某个`ZK`服务器建立`Session`

  - 然后，直接从此`ZK`服务器读取数据，并返回客户端即可

  - 关闭`Session`

#### 写操作原理

- 写操作比较复杂，先举个生活中的例子：去银行存钱
  - 银行柜台共有5个桂圆姐姐，编程从①到⑤，其中①②④⑤是**下属follower**，③是**领导leader**
  - 有两个客户
  - 客户①找到桂圆①，说：昨天少给我存了1000万，现在需要给我加进去
  - 桂圆①说，对不起先生，我没有这么大的权限，请你稍等一下，我向领导**leader**③汇报一下
  - 领导③收到消息后，为了做出英明的决策，要征询下属的意见(**proposal**)①②④⑤
  - 只要有**过半数quorum**（5/2+1=3，包括`leader`自己）同意，则`leader`做出决定(**commit**)，同意此事
  - `leader`告知所有下属`follower`，你们都记下此事生效
  - 桂圆①答复客户①，说已经给您账号里加了1000万。

**示意图如下：**

![](zookeeper.assets/Image2019061212537.png)



- 客户端写操作

  - ①客户端向`zk`集群写入数据，如`create /kkb`；与一个`follower`建立`Session`连接，从节点`follower01`
  - ②`follower`将写请求转发给`leader`
  - ③`leader`收到消息后，发出**proposal提案**（创建`/kkb`），每个`follower`先**记录下**要创建`/kkb`
  - ④若超过**半数quorum**（包括`leader`自己）同意提案，则`leader`提交**commit提案**，`leader`本地创建`/kkb`节点`ZNode`
  - ⑤`leader`通知所有`follower`，也就是`commit`提案；`follower`各自在本地创建`/kkb`
  - ⑥`follower01`响应`client`

  注意：如果第一步直接就连接到了`leader`，则直接跳到第三步。

**示意图如下：**

![](zookeeper.assets/Image201910251203.png)

![image-20200218065532250](zookeeper.assets/image-20200218065532250.png)

> 补充：
>
> - `zookeeper`集群有个特点，服务器的个数是奇数个：3、5、7...
>
>   如果存活的服务器超过半数，那么zookeeper集群就可以正常对外服务
>
> - 假如有个`follower`因为网络不畅等问题，导致还没有写入某节点，如果这时候有客户端刚好连接上了这个`follower`，并访问该节点。那么此时就会调用`client.sync()`方法进行同步，客户端会等待`follower`与`leader`进行通信同步节点，同步完成后就可以提供服务了。



## ZooKeeper之安其内（重点）

- `leader`很重要？
- 如果没有`leader`怎么办？
  - 开始选举新的`leader`

- **ZooKeeper服务器四种状态：**
  - `looking`：服务器处于寻找`Leader`群首的状态

  - `leading`：服务器作为群首时的状态

  - `following`：服务器作为`follower`跟随者时的状态

  - `observing`：服务器作为观察者时的状态

- `leader`选举分**两种情况**
  - 全新集群`leader`选举

  - 非全新集群`leader`选举

#### 全新集群leader选举

![](zookeeper.assets/Image201906130749.png)

  - 以3台机器组成的`ZooKeeper`集群为例 

  - 选举前提：集群中过**半数**（多数派`quorum`）`Server`启动后，才能选举出`Leader`；

    - 此处`quorum`数是多少？`3/2+1=2`
    - 即`quorum`=集群服务器数除以2，再加1

  - 理解`leader`选举前，先了解几个概念

    - `obeserver`不参与选举，但能够响应`client`的读写请求。

    - 选举过程中，每个`server`需发出投票；投票信息**vote信息**结构为`(sid, zxid)`，`sid`是`serverid`,`zxid`是事务`id`。

      全新集群，`server1~3`初始投票信息分别为：

      ​	server1 ->  **(1, 0)**
      ​	​server2 ->  **(2, 0)**
      ​	server3 ->  **(3, 0)**

    - **leader选举公式**：

      ​	server1 vote信息 `(sid1,zxid1)`

      ​	server2 vote信息 `(sid2,zxid2)`

      ​	**①zxid大的server胜出；**

      ​	**②若zxid相等，再根据判断sid判断，sid大的胜出**

  - 选举`leader`流程：

    > 假设按照ZK1、ZK2、ZK3的依次启动

    - 启动`ZK1`后，投票给自己，`vote`信息`(1,0)`，没有过半数，选举不出`leader`

    - 再启动`ZK2`；`ZK1`和`ZK2`票投给自己及其他服务器；`ZK1`的投票为`(1, 0)`，`ZK2`的投票为`(2, 0)`

    - 处理投票。每个`server`将收到的多个投票做处理
      - 如`ZK1`上：`ZK1`投给自己的票`(1,0)`与`ZK2`传过来的票`(2,0)`比较；
      - 利用**leader选举公式**，因为`zxid`都为`0`，相等；所以判断`sid`最大值；2>1；`(2,0)`胜出；`ZK1`更新自己的投票为`(2, 0)`
      - `ZK2`也是如此逻辑，`ZK2`更新自己的投票为`(2,0)`

    - **再次发起投票**
      - `ZK1`、`ZK2`上的投票都是`(2,0)`
      - 发起投票后，`ZK1`上有一个自己的票`(2,0`)和一票来自ZK2的票`(2,0)`，这两票都选`ZK2`为`leader`
      - `ZK2`上有一个自己的票`(2,0)`和一票来自`ZK1`的票`(2,0)`，这两票都选`ZK2`为`leader`
      - 统计投票。`server`统计投票信息，是否有半数`server`投同一个服务器为`leader`；
        - `ZK2`当选2票；多数
      - 改变服务器状态。确定`Leader`后，各服务器更新自己的状态
        - 更改ZK2状态从`looking`到`leading`，为`Leader`
        - 更改`ZK1`状态从`looking`到`following`，为`Follower`

    - 当`ZK3`启动时，发现已有`Leader`，不再选举，直接从`LOOKING`改为`FOLLOWING`

#### 非全新集群leader选举

![](zookeeper.assets/Image201906131101.png)

- `follwer`隔一定时间就会向`leader`发送心跳，如果l`eader`挂掉以后，`follower`的心跳就收不到响应了，超过一定时间后，所有`follower`就开始重新选举。
- 选举原理同上比较`zxid、sid`
- 不再赘述



## ZAB算法（难点考点 ）

#### 仲裁quorum

- 什么是仲裁`quorum`？

  - 发起`proposal`时，只要多数派同意，即可生效

- 为什么要仲裁？

  - 多数据派不需要所有的服务器都响应，`proposal`就能生效
  - 且能提高集群的响应速度

- `quorum`数如何选择？
  -    **集群节点数 / 2 + 1**
  -    如3节点的集群：`quorum`数=`3/2+1=2`

#### 网络分区、脑裂

  - 网络分区：网络通信故障，集群被分成了2部分

  - 脑裂：

    - 原`leader`处于一个分区；
    - 另外一个分区选举出新的`leader` 
    - 集群出现`2`个`leader`

#### ZAB算法介绍

`ZAB`算法由`raft`算法发展而来，`PAXOS`算法 -> `RAFT`算法 -> `ZAB`算法，这三个算法都可以用来解决分布式领域一致性的问题。

#### ZAB与RAFT的区别

ZAB与raft很相似，但是有以下区别：

1、`zab`心跳从`follower`到`leader`；`raft`从`leader`到`follower`

2、`zab`任期叫`epoch`ˈ；`raft`叫`term`。  `epoch`--->ˈiːpɒk

#### epoch

一开始，`epoch`=1，第一任`leader`挂了之后，就会有第二任`leader`，此时`epoch`=2，这个就叫`epoch`,理解为纪元或者任期即可。

查看当前`epoch`的值：

- 方式1：查看/kkb/install/zookeeper-3.4.5-cdh5.14.2/zkdatas/version-2/currentEpoch文件的内容

- 方式2：通过某个事务来查看。

  ![image-20200218064209321](zookeeper.assets/image-20200218064209321.png)

#### RAFT算法

[raft算法动图地址](http://thesecretlivesofdata.com/raft/#replication)，**以`RAFT`算法动图为例，分析ZAB算法**

##### 动图帮助说明

<img src="zookeeper.assets/image-20200219174111921.png" alt="image-20200219174111921" style="zoom: 50%;" />

<img src="zookeeper.assets/image-20200219174402918.png" alt="image-20200219174402918" style="zoom:50%;" />

<img src="zookeeper.assets/image-20200219174549695.png" alt="image-20200219174549695" style="zoom:50%;" />

<img src="zookeeper.assets/image-20200219174725526.png" alt="image-20200219174725526" style="zoom: 50%;" />



##### 阶段一：leader election



```
1. //=====================--------选举过程=====================-------//
2. 在`RAFT`协议里有两个`timeout`，第一个`timeout`是`election timeout`，第二个是`heartbeat timeout`。
3. `election timeout`是`followe`r等待变成`candidate`的时长（超过这个时长，`follower`就变成`candidate`）。
4. `election timeout`是随机生成的，在150毫秒到300毫秒间，每个`follower`的`election timeout`都可能不同。
5. 事先过了`election timeout`的服务器会从`follower`变成`cnadidate`状态，并且开启新的一轮选举。比如说视频中的`Node A`。
6. `Node A` 会给自己投票。然后发送投票请求给其它的服务器（`Node B`、`Node C`)。
7. 如果收到投票请求的服务器还没有投过票，就会为该`candidate Node A`投票。（如果为其它`candidate`投过票了，就不会为该`NodeA` `candidate`投票了。）
8. 投票后的每个服务器都会重置自己的`election timeout`。
9. 一旦一个`candidate`得到了超过半数的投票，就会变成`leader`。
10. `leader`开始发送`Append Entries`信息给每个`follower`。
11. 这些`Append Entries`信息每隔`heartbeat timeout `时间就会发送一次。每个`follower`都会对这些信息进行响应，且会重置`heartbeat timeout`。
12. //=====================第一任`leader`挂了，重新选举=====================-//
13. `leader`的任期会一直持续下去，直到某一个`follower`超过`heartbeat timeout`时长依然没有接收到来自`leader`的心跳信息，该`follower`就会变成`candidate`。
14. 比如视频中的`NodeA`停掉了，`Node C`获得过半的投票数后变成了新一任`leader`。过半数投票产生`leader`的机制可以保证每次任期都只有一个`leader`。
15. //=====================-同一时间有两个`candidate`的情况=====================//、
16. 假如有四个服务器`Node ABCD`，两个`candidate`，即 `NodeB NodeC`同一时间竞选同一个任期的`leader`。两个`candidate`都会为自己投票，并向所有的`follower`发送投票请求。
17. 然后`NodeA`首先收到`NodeB candidate`的投票请求，而`NodeD`首先收到的是`NodeC candidate`的投票请求，那么这样的话，`candidateB`和`candidateC`都是拥有两票。票数相同，都没有过半，导致新一轮的`leader`的选举即将开始。
18. 新一轮选举，率先到达`electin timeout`的的`follower`（视频中的`NodeA NodeC`）同时变成了`candidate`。
19. 如此循环，直到只产生了一个`leader`。
```

##### 阶段二：Log Replication（复制）




1. 如果集群有一个`leader`后，那么以后集群内所有的改变，都要复制到集群的所有其它节点（服务器）。
2. 这个要通过集群的心跳，使用`Append Entries`信息来完成。
3. //--------------------------------将某节点数据设置为5=====================------//
4. 一个客户端向`leader`发送了一个更改的请求。比如说`set...5`，设置某个节点的值为5。
5. 这个更改会被记录到`leader`的`log`日志文件里。
6. 这些更改会通过`leader`下一轮的心跳发送给所有的`follower`。`followers`收到心跳后，返回心跳给`leader`进行响应，告知`leader`已经把要进行的更改记录下来了。
7. 一旦超过半数的`follower`告知了`leader`，`leader`的对应节点的值就改成了`5`，那么一个`entry`会被提交 ?，同时会向`client`客户端响应：更改完成。
8. `follower`再一次收到`leader`心跳时，将节点值改为5，提交`log entry`。
9. 如果要将该节点的数据加`2`，步骤跟上述一样，最终集群的该节点的值都变为了`7`。
10. //----------------------------------脑裂现象=====================-------------------------//
11. 假设集群有5个服务器。假如因为网络问题，`AB`服务器与`CDE`服务器之间不能通信了，集群分成了两部分。一开始`Node B`是`leader`。
12. 由于通信问题，`C`服务器超过`heartbeat timeout`时长没有收到l`eader`的心跳。C会变成`candidate`，经过`DE`投票过后，`Node C`也变成了`leader`。此时集群有两个`leader`，B和C。
13. 一个客户端向`NodeB leader`发送更改某节点值为`3`的请求。`leader`通过心跳告知向所有`follower`发起更改提议，因为没有收到超过集群半数的`follower`的响应。导致`leader NodeB`的`log entry`始终是`uncommited`的状态。
14. 另一个客户端向`NodeC leader`发送请求，更改刚才同一个节点的值为`8`的请求，`leader NodeC`通过心跳告知所有`follower`，超过半数响应，更改成功。`log entry`为`committed`状态，`leader` 响应客户端。
15. //-------------------------------------网络修复好后=====================---------------//
16. `leader NodeB`看到更高任期的`leader`，进行让步，退让`leader`，变为`follower`。
17. `NodeB NodeA`将会回滚网络恢复前留下来的`uncommited entry`。然后匹配`leader`新的`log`。
18. 最后，我们的集群再次实现了一致性。

> **补充：**
>
> 当`leader`收到一条`command`请求后，就把它加入自己的`log`中作为新的`entry`，然后给其他服务器发出`AppendEntries PRC`进行日志复制。一旦`entry`被**安全的复制**了，`leader`就可以把这条`entry`给`apply`到状态机了，并给客户端返回结果。如果`follower`响应慢或者宕机了，`leader`会一直发送`RPC`直到所有`follower`都存储了`entry`。





## ZooKeeper服务器个数

- 仲裁模式下，服务器个数最好为奇数个。**why?**


![](zookeeper.assets/Image201906131311.png)

  - 5节点的比6节点的集群
    - 成本更低，但是容灾能力一样
    - `quorum`小，响应快

#### 12.2 ZooKeeper状态同步

完成`leader`选举后，`zk`就进入`ZooKeeper`之间状态同步过程

1. `leader`构建**NEWLEADER**封包，包含`leader`中最大的`zxid`值；广播给其它`follower`
2. `follower`收到后，如果自己的最大`zxid`小于leader的，则需要与`leader`状态同步；否则不需要
3. `leader`给需要同步的每个`follower`创建**LearnerHandler**线程，负责数据同步请求
4. `leader`主线程等待`LearnHandler`线程处理结果
5. 只有多数`follower`完成同步，`leader`才开始对外服务，响应写请求
6. `LearnerHandler`线程处理逻辑
   1. `LearnerHandler`接收`follower`发送过来的封包**FOLLOWERINFO**，包含此`follower`最大`zxid`（代称`f-max-zxid`）
   2. 将`f-max-zxid`与`leader`最大`zxid`（代称`l-max-zxid`）进行比较
   3. 若相等，说明当前`follower`是最新的
   4. 另外，若在判断期间，看有没有新提交的`proposal`
      1. 如果有，那么会发送**DIFF**封包将有差异的数据同步过去。同时将`follower`没有的数据逐个发送**COMMIT**封包给`follower`要求记录下来.
      2. 如果`follower`数据`id`更大,那么会发送`TRUNC`封包告知截除（删除）多余数据.
      3. 如果这一阶段内没有提交的提议值,直接发送`SNAP`封包将快照同步发送给`follower`.
   5. 以上消息完毕之后,`leader`发送**UPTODATE**封包告知`follower`当前数据就是最新的了
   6. `leader`再次发送**NEWLEADER**封包宣称自己是`leader`,等待`follower`的响应，循环上述过程。

![](zookeeper.assets/Image201906140856.png)

## 分布式锁

##### 原理

之前我们学习过编程当中的锁的概念。怎么用`Zookeeper`实现分布式锁？

看下图，有很三个`client`客户端，都要访问`data`，但是同一个时间只能允许一个客户端访问。

1. 三个`client`都争抢访问`data`数据，三个客户端都发送`creat -s -e /locker/node_data`命令，尝试在`locker`节点下创建一个临时有序子节点。
2. 三个客户端都创建好节点之后，那么每个客户端都会对自己创建的节点进行判断，判断自己节点的的后缀编号是不是最小的，**节点最小编号对应的客户端将获得先访问`data`的权限。加锁**。
3. 另外两个客户端就会对比自己对应节点编号小的节点进行监听，比如`client2`监听`node_1,``clent3`监听`node_2`。
4. 当`client1`访问完数据后，会把流关闭掉，客户端关闭会话`session`，然后`node_1`节点就会被删除掉。
5. 此时`client2`监听到`node_1`被删除了，重新判断自己创建的临时节点`node_2`是否是列表中最小编号的。
6. 判断为是后，`client2`获得访问`data`权限，开始访问。
7. 如此循环即可，保证同一时间点只有一个客户端在访问`data`。

![image-20200219154004216](zookeeper.assets/image-20200219154004216.png)

```shell
create -s -e /locker/node_ ndata
```

##### 代码实现（TODO，未消化）

```java
package com.jimmy.day05;

import org.apache.log4j.BasicConfigurator;
import org.apache.log4j.Logger;
import org.apache.zookeeper.*;
import org.apache.zookeeper.data.Stat;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CountDownLatch;

public class DistributedLock implements Watcher {
    //定义会话的超时时间
    private final static int SESSION_TIME = 30000;

    private int threadId;
    private ZooKeeper zk = null;
    private String selfPath;
    private String waitPath;
    private String LOG_PREFIX_OF_THREAD;
    private static final int SESSION_TIMEOUT = 10000;
    private static final String GROUP_PATH = "/disLocks";
    private static final String SUB_PATH = "/disLocks/sub";
    private static final String CONNECTION_STRING = "node01:2181,node02:2181,node03:2181";

    private static final int THREAD_NUM = 10;

    //确保连接zk成功；
    private CountDownLatch connectedSemaphore = new CountDownLatch(1);

    //确保所有线程运行结束；semaphore信号
    private static final CountDownLatch threadSemaphore = new CountDownLatch(THREAD_NUM);

    private static final Logger LOG = Logger.getLogger(DistributedLock.class);

    //构造方法
    public DistributedLock(int id) {
        this.threadId = id;
        LOG_PREFIX_OF_THREAD = "【第" + threadId + "个线程】";
    }

    //程序入口
    public static void main(String[] args) {
        //多个线程中zk是否是同一个对象？
        BasicConfigurator.configure();
        for (int i = 0; i < THREAD_NUM; i++) {
            final int threadId = i + 1;
            new Thread() {
                @Override
                public void run() {
                    try {
                        DistributedLock dc = new DistributedLock(threadId);
                        //连接zookeeper集群
                        dc.createConnection(CONNECTION_STRING, SESSION_TIMEOUT);
                        System.out.println("3、在createConnection中，线程等待结束，向下执行");
                        //GROUP_PATH不存在的话，由一个线程创建即可；
                        synchronized (threadSemaphore) {
                            dc.createPath(GROUP_PATH, "该节点由线程" + threadId + "创建", true);
                        }
                        //获得锁
                        dc.getLock();
                    } catch (Exception e) {
                        LOG.error("【第" + threadId + "个线程】 抛出的异常：");
                        e.printStackTrace();
                    }
                }
            }.start();
        }
        try {
            threadSemaphore.await();
            LOG.info("所有线程运行结束!");
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    /**
     * 获取锁
     *
     * @return
     */
    private void getLock() throws KeeperException, InterruptedException {
        //创建临时有序节点
        selfPath = zk.create(SUB_PATH, null, ZooDefs.Ids.OPEN_ACL_UNSAFE, CreateMode.EPHEMERAL_SEQUENTIAL);
        LOG.info(LOG_PREFIX_OF_THREAD + "创建锁路径:" + selfPath);

        if (checkMinPath()) {//判断当前线程，创建的临时节点，时候是编号最小的；如果是，表示此线程可获得锁
            getLockSuccess();
        }
    }

    /**
     * 创建节点
     *
     * @param path 节点path
     * @param data 初始数据内容
     * @return
     */
    public boolean createPath(String path, String data, boolean needWatch) throws KeeperException, InterruptedException {
        if (zk.exists(path, needWatch) == null) {
            LOG.warn(LOG_PREFIX_OF_THREAD + "节点创建成功, Path: "
                    + this.zk.create(path,
                    data.getBytes(),
                    ZooDefs.Ids.OPEN_ACL_UNSAFE,
                    CreateMode.PERSISTENT)
                    + ", content: " + data);
        }
        return true;
    }

    /**
     * 创建ZK连接
     *
     * @param connectString  ZK服务器地址列表
     * @param sessionTimeout Session超时时间
     */
    public void createConnection(String connectString, int sessionTimeout) throws IOException, InterruptedException {
        zk = new ZooKeeper(connectString, sessionTimeout, this);
        System.out.println("1、创建连接，并等待");
        //CountDownLatch
        connectedSemaphore.await();
        System.out.println("2、创建连接后，等待结束；理应执行3、");
    }

    /**
     * 获取锁成功
     */
    public void getLockSuccess() throws KeeperException, InterruptedException {
        if (zk.exists(this.selfPath, false) == null) {
            LOG.error(LOG_PREFIX_OF_THREAD + "本节点已不在了...");
            return;
        }
        LOG.info(LOG_PREFIX_OF_THREAD + "获取锁成功，赶紧干活！");
        Thread.sleep(2000);
        LOG.info(LOG_PREFIX_OF_THREAD + "删除本节点：" + selfPath);
        //删除本节点
        zk.delete(this.selfPath, -1);
        //释放zk连接
        releaseConnection();
        //threadSemaphore数字递减；达到零后，让等待的线程继续执行
        threadSemaphore.countDown();
    }

    /**
     * 关闭ZK连接
     */
    public void releaseConnection() {
        if (this.zk != null) {
            try {
                this.zk.close();
            } catch (InterruptedException e) {
            }
        }
        LOG.info(LOG_PREFIX_OF_THREAD + "释放连接");
    }

    /**
     * 检查自己创建的临时节点是不是最小的节点
     *
     * @return
     */
    public boolean checkMinPath() throws KeeperException, InterruptedException {
        //获得所有子节点的路径
        List<String> subNodes = zk.getChildren(GROUP_PATH, false);
        //对子节点列表做排序
        Collections.sort(subNodes);

        //获得当前线程创建的临时节点，在子节点列表中排第几？
        int index = subNodes.indexOf(selfPath.substring(GROUP_PATH.length() + 1));
        switch (index) {
            case -1: {
                LOG.error(LOG_PREFIX_OF_THREAD + "本节点已不在了..." + selfPath);
                return false;
            }
            //当前线程创建的临时节点是最小的节点
            case 0: {
                LOG.info(LOG_PREFIX_OF_THREAD + "子节点中，我果然是老大" + selfPath);
                //获得锁
                return true;
            }
            default: {
                //找到比自己编号小，紧邻的临时节点
                this.waitPath = GROUP_PATH + "/" + subNodes.get(index - 1);
                LOG.info(LOG_PREFIX_OF_THREAD + "获取子节点中，排在我前面的" + waitPath);
                try {
                    //注册监听器
                    zk.getData(waitPath, true, new Stat());
                    //没有获得锁
                    return false;
                } catch (KeeperException e) {
                    if (zk.exists(waitPath, false) == null) {
                        LOG.info(LOG_PREFIX_OF_THREAD + "子节点中，排在我前面的" + waitPath + "已失踪，幸福来得太突然?");
                        //回调自己
                        return checkMinPath();
                    } else {
                        throw e;
                    }
                }
            }
        }
    }

    //回调函数
    public void process(WatchedEvent event) {
        if (event == null) {
            return;
        }
        Event.KeeperState keeperState = event.getState();
        Event.EventType eventType = event.getType();
        //Event.KeeperState.SyncConnected =>> The client is in the connected state 客户端处于连接状态
        if (Event.KeeperState.SyncConnected == keeperState) {
            if (Event.EventType.None == eventType) {//客户端连接上zkServer后，执行此分支
                LOG.info(LOG_PREFIX_OF_THREAD + "成功连接上ZK服务器");
                //connectedSemaphore数字递减；达到零后，让等待的线程继续执行
                System.out.println("4、createConnection后，客户端成功连接zkServer");
                connectedSemaphore.countDown();
                System.out.println("5、CountDownLatch: connectedSemaphore 递减为0；理应执行 -> 2、创建连接后，等待结束");
            } else if (event.getType() == Event.EventType.NodeDeleted && event.getPath().equals(waitPath)) {
                LOG.info(LOG_PREFIX_OF_THREAD + "收到情报，排我前面的家伙已挂，我是不是可以出山了？");
                try {
                    if (checkMinPath()) {
                        getLockSuccess();
                    }
                } catch (KeeperException e) {
                    e.printStackTrace();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        } else if (Event.KeeperState.Disconnected == keeperState) {
            LOG.info(LOG_PREFIX_OF_THREAD + "与ZK服务器断开连接");
        } else if (Event.KeeperState.AuthFailed == keeperState) {
            LOG.info(LOG_PREFIX_OF_THREAD + "权限检查失败");
        } else if (Event.KeeperState.Expired == keeperState) {
            LOG.info(LOG_PREFIX_OF_THREAD + "会话失效");
        }
    }
}
```

## ZooKeeper应用场景

1. `NameNode`使用`ZooKeeper`实现高可用.
2. `Yarn ResourceManager`使用`ZooKeeper`实现高可用.
3. 利用`ZooKeeper`对`HBase`集群做高可用配置
4. `kafka`使用`ZooKeeper`
   - 保存消息消费信息比如`offset`.
   - 用于检测崩溃
   - 主题`topic`发现
   - 保持主题的生产和消费状态

**ZooKeeper应用场景图：**

![](zookeeper.assets/20170221224856838.png)

## 扩展阅读

[follower与leader状态同步](https://www.cnblogs.com/hadoop-dev/p/5946870.html)

[主备切换示例](https://blog.csdn.net/u010670689/article/details/78054945)

## 访问控制ACL

- 参考《访问控制ACL》

## 题库 - 本堂课知识点（TODO）

1. 假设五台ZooKeeper服务器组成的全新集群，分别为zk1,zk2,zk3,zk4,zk5，sid分别为1、2、3、4、5，依次启动zk1,zk2,zk3,zk4,zk5。问哪台是leader，为什么这台是leader?
2. 同一个客户端同时发起多次请求操作时ZooKeeper内部是如何操作的？多个客户端同时发起多个请求时又是如何操作的？
3. 自己编写代码，完成zookeeper原生API下的增加节点、删除节点、修改节点等操作；其中一个自定义的方法要用到监听器
4. 使用curator API完成增加节点、删除节点、修改节点等操作；其中一个自定义的方法要用到监听器

## Zookeeper总结

![](zookeeper.assets/Image201909181457.png)

![](zookeeper.assets/Image201909201440.png)





















