## 1、Atlas的基本概述

谈到数据治理，自然离不开元数据。元数据(Metadata)，用一句话定义就是：**描述数据的数据**。元数据打通了数据源、数据仓库、数据应用，记录了数据从产生到消费的全过程。因此，数据治理的核心就是`元数据管理`。

数据的真正价值在于数据驱动决策，通过数据指导运营。通过数据驱动的方法判断趋势，帮住我们发现问题，继而推动创新或产生新的解决方案。随着企业数据爆发式增长，数据体量越来越难以估量，我们很难说清楚**我们到底拥有哪些数据，这些数据从哪里来，到哪里去，发生了什么变化，应该如何使用它们**。因此**元数据管理(数据治理)**成为企业级数据湖不可或缺的重要组成部分。

可惜很长一段时间内，市面都没有成熟的数据治理解决方案。直到2015年，Hortonworks终于坐不住了，约了一众小伙伴公司倡议：咱们开始整个数据治理方案吧。然后，包含**数据分类、集中策略引擎、数据血缘、安全和生命周期管理功**能的Atlas应运而生。(PS：另一个应用的较多的元数据开源项目是Linkedin 在2016年新开源的项目：`WhereHows`)Atlas目前最新的版本为2018年9月18日发布的`1.0.0`版本。

Atlas 是一个可伸缩和可扩展的核心基础治理服务集合 ，使企业能够有效地和高效地满足 Hadoop 中的合规性要求，并允许与整个企业数据生态系统的集成。

Apache Atlas为组织提供开放式元数据管理和治理功能，用以构建其数据资产目录，对这些资产进行分类和管理，并为数据科学家，数据分析师和数据治理团队提供围绕这些数据资产的协作功能。



## 2、Atlas的架构概述

![architecture](atlas元数据管理.assets/architecture.png)



### Core：核心模块

核心模块当中又包含以下几大模块：

#### Type System：类型系统

Atlas允许用户**为要管理的元数据对象定义模型**。 该模型由称为“类型”的定义组成。 称为“实体”的“类型”实例代表所管理的实际元数据对象。 **类型系统是允许用户定义和管理类型和实体的组件**。 开箱即用的Atlas管理的所有元数据对象（例如，像Hive表一样）均使用类型进行建模，并表示为实体。 为了在Atlas中存储新类型的元数据，需要了解类型系统组件的概念。

#### Graph Engine：图形引擎

在内部，**Atlas保留使用Graph模型管理的元数据对象**。这种方法提供了极大的灵活性，并可以有效处理元数据对象之间的丰富关系。图引擎组件负责在Atlas类型系统的类型和实体以及基础图持久性模型之间进行转换。除了管理图形对象之外，图形引擎还为元数据对象创建适当的索引，以便可以高效地搜索它们。Atlas使用JanusGraph存储元数据对象。

#### Ingest / Export：提取/导出

**“提取”组件允许将元数据添加到Atlas**。同样，**导出组件将Atlas检测到的元数据更改公开为事件**。消费者可以使用这些更改事件来实时响应元数据更改

### Integration：元数据管理集成模块

**用户可以使用两种方法在Atlas中管理元数据：**

#### API：

Atlas的所有功能都通过REST API向最终用户公开，该API允许创建，更新和删除类型和实体。它也是查询和发现Atlas管理的类型和实体的主要机制。

#### Messaging：

除了API，**用户还可以选择使用基于Kafka的消息传递接口与Atlas集成**。这对于将元数据对象传达给Atlas以及从Atlas消耗元数据更改事件（用于构建应用程序）都是很有用的。如果有人希望使用与Atlas的松散耦合集成，以实现更好的可伸缩性，可靠性等，则该消息传递接口特别有用。Atlas使用Apache Kafka作为通知服务器，用于挂钩和元数据通知事件的下游使用者之间的通信。这些事件由钩子和Atlas编写，涉及不同的Kafka主题。

### Metadata Sources元数据源

Atlas支持与许多现成的元数据源集成。将来还将添加更多集成。当前，Atlas支持从以下来源提取和管理元数据：

- [HBase](http://atlas.apache.org/#/HookHBase)
- [Hive](http://atlas.apache.org/#/HookHive)
- [Sqoop](http://atlas.apache.org/#/HookSqoop)
- [Storm](http://atlas.apache.org/#/HookStorm)
- [Kafka](http://atlas.apache.org/#/HookKafka)

集成意味着两件事：**Atlas原生定义了一些元数据模型来表示这些组件的对象。**Atlas提供了一些组件，可以从这些组件（实时或在某些情况下为批处理模式）中提取元数据对象

### APPS 应用领域

Atlas管理的元数据被各种应用程序使用，以满足许多治理用例。

**Atlas Admin UI**：此组件是一个基于Web的应用程序，允许数据管理员和科学家发现和注释元数据。这里最重要的是搜索界面和类似SQL的查询语言，可用于查询Atlas管理的元数据类型和对象。管理员界面使用Atlas的REST API来构建其功能。

**基于标签的策略**：[Apache Ranger](http://ranger.apache.org/)是针对Hadoop生态系统的高级安全管理解决方案，与各种Hadoop组件广泛集成。通过与Atlas集成，Ranger使安全管理员可以定义元数据驱动的安全策略以进行有效的管理。Ranger是Atlas通知的元数据更改事件的使用者。



## 3、Atlas的编译

Atlas这个软件框架在官网http://atlas.apache.org/#/ 上面没有给我们提供线程的二进制安装包，只提供了源码包，所以需要我们自己去对源码包进行编译，编译源码包的过程比较简单，但是由于网络原因等，会造成我们一直编译不通过。所以我们知道如何编译Atlas即可，不用自己动手去编译（一般由于网络原因，也会编译不通过的）

### 第一步：安装jdk

**注意**：Atlas1.x及以上的版本的编译，必须使用jdk版本高于jdk-8u151的版本，我们这里选择使用jdk-8u231这个版本即可，只要版本高于8u151的都行。

linux下面安装jdk的步骤省略

### 第二步：安装maven

maven的版本尽量选择高一点的版本，这里选择使用3.6.x的版本都行，具体我这里使用的是3.6.2的版本来进行编译，没有问题

linux安装maven步骤省略

### 第三步：下载源码准备编译

我们这里使用1.2.0（如果hbase是1.x版本，则只能使用Atlas-1.x版本）这个版本来进行编译，下载Atlas的源码，然后解压，进行编译即可

统一linux的软件下载以及软件编译目录

```shell
定义软件下载目录
mkdir  -p  /kkb/soft  
定义软件安装目录
mkdir -p /kkb/install

下载Atlas的软件安装包
cd /kkb/soft
wget  https://www.apache.org/dyn/closer.cgi/atlas/1.2.0/apache-atlas-1.2.0-sources.tar.gz

解压源码安装包
tar -zxf apache-atlas-1.2.0-sources.tar.gz  -C /kkb/install/

准备进行编译
cd /kkb/install/apache-atlas-sources-1.2.0/
export MAVEN_OPTS="-Xms2g -Xmx2g"
使用以下命令进行编译 表示使用外部的hbase与solr
mvn clean package -DskipTests -Pdist,external-hbase-solr

如果要使用Atlas内嵌的HBase与solr，那么我们可以执行以下命令进行编译
mvn clean package -DskipTests -Pdist,embedded-hbase-solr

```

编译好的安装包路径位于

```
/kkb/install/apache-atlas-sources-1.2.0/distro/targe
```

这个路径下，获取到以下这个压缩包即可

![1586062930734](atlas元数据管理.assets/1586062930734.png)



编译过程中稍微注意下：需要下载一个包linux-x64-57_binding.node  这个包很难下载下来，我们可以给手动下载下来，然后放到编译linux机器的的/root/.npm/node-sass/4.13.1 这个路径下即可



## 4、Atlas的安装与前置环境准备

Atlas是用于做元数据管理的，可以用于来集成各种框架的元数据管理，例如可以用来集成hbase，集成solr，集成kafka，集成hive等，所以我们需要提前安装好hbase，solr，kafka，hive等框架，我们这里主要用于集成kafka，hbase，hive等这几个框架。所以我们需要提前启动kafka，启动hbase，以及启动hive的hiveserver2以及metastore服务等

### 安装并启动zookeeper服务

安装好zookeeper之后并启动zookeeper

### 安装并启动hadoop服务

安装好hadoop，我们这里使用的版本是CDH5.14.2这个版本

### 安装启动hbase服务

安装好hbase，并启动hbase的服务，我们这里使用的hbase的版本是CDH5.14.2

### 安装启动hive的服务

安装好hive

### 安装并启动好solr集群服务

Atlas需要一个搜索引擎服务作为Atlas的数据搜索服务，可以使用solrCloud或者使用Elasticsearch都行，我们这里选择使用SolrCloud作为Atlas的集群搜索服务，所以我们需要安装SolrCloud服务，我们这里选择使用solr5.5.2这个版本

#### 第一步：下载solr安装包并解压

下载solr5.5.2安装包，并上传到**node01服务器**的/kkb/soft路径下

```shell
cd  /kkb/soft
tar -zxf solr-5.5.2.tgz -C /kkb/install/
```

#### 第二步：修改solr配置文件

node01执行以下命令修改solr配置文件

```shell
cd /kkb/install/solr-5.5.2/bin
 
vim solr.in.sh
 
ZK_HOST="node01:2181,node02:2181,node03:2181"
SOLR_HOST="node01"
```

#### 第三步：分发安装包

分发solr安装包到node02与node03服务器

node01执行以下命令分发solr安装包到node02与node03服务器

```
cd /kkb/install/
scp -r solr-5.5.2/ node02:/kkb/install
scp -r solr-5.5.2/ node03:/kkb/install
```

#### 第四步：单独修改node02与node03配置文件

node02执行以下命令修改 SOLR_HOST配置项

```shell
cd /kkb/install/solr-5.5.2/bin/
vim solr.in.sh
 
SOLR_HOST="node02"
```

node03执行以下命令修改 SOLR_HOST配置项

```shell
cd /kkb/install/solr-5.5.2/bin/
vim solr.in.sh

SOLR_HOST="node03"
```

#### 第五步：启动solr服务

三台机器启动solr服务

三台机器执行以下命令启动solr服务

```shell
cd /kkb/install/solr-5.5.2/
bin/solr start
```

#### 第六步：浏览器页面访问

浏览器页面访问

http://node01:8983/solr/#/

出现cloud选项，证明solr集群安装成功

![1586183061746](atlas元数据管理.assets/1586183061746.png)



### :1st_place_medal:安装Atlas集成其他框架



#### Atlas集成HBase服务

##### 第一步：上传压缩包并解压

上传Atlas编译之后的安装包并进行解压

将Atlas的安装包上传到**node03服务器**的/kkb/soft路径下，然后进行解压

```
cd /kkb/soft
tar -zxf apache-atlas-1.2.0-bin.tar.gz -C /kkb/install/
```

##### 第二步：修改atlas-application.properties 更改Atlas存储数据主机名

修改Atlas的存储数据主机名

node03执行以下命令修改Atlas连接zk的地址

```shell
cd /kkb/install/apache-atlas-1.2.0/conf
vim atlas-application.properties 

atlas.graph.storage.hostname=node01:2181,node02:2181,node03:2181
```

##### 第三步：修改Atlas与HBase集成文件

修改Atlas与HBase的集成配置文件

node03执行以下命令，修改Atlas连接hbase的配置文件夹路径

```shell
直接通过链接的方式即可，将hbase的配置文件夹conf目录，链接到Atlas对应hbase的配置文件夹下
ln -s /kkb/install/hbase-1.2.0-cdh5.14.2/conf /kkb/install/apache-atlas-1.2.0/conf/hbase/conf

在Atlas的conf目录下的hbase文件夹下面创建一个连接文件夹，连接到hbase的conf配置文件
```

##### 第四步：修改atlas-env.sh配置文件

修改atlas-env.sh添加hbase配置路径

node03执行以下命令修改JAVA_HOME以及修改HBASE_CONF_DIR路径

```shell
修改atlas-env.sh 添加hbase的配置文件的路径
cd /kkb/install/apache-atlas-1.2.0/conf/
vim atlas-env.sh 

#修改java环境变量
export JAVA_HOME=/kkb/install/jdk1.8.0_141
#添加这一行配置项
export HBASE_CONF_DIR=/kkb/install/apache-atlas-1.2.0/conf/hbase/conf
```

#### Atlas集成Solr服务

##### 第一步：修改Atlas配置文件 atlas-application.properties 

node03执行以下命令修改Atlas的配置文件 atlas-application.properties 

```shell
cd /kkb/install/apache-atlas-1.2.0/conf/
vim atlas-application.properties 

atlas.graph.index.search.backend=solr
atlas.graph.index.search.solr.zookeeper-url=node01:2181,node02:2181,node03:2181
atlas.graph.index.search.solr.mode=http   #打开注释
atlas.graph.index.search.solr.http-urls=http://node01:8983/solr

```

##### 第二步：拷贝atlas配置文件到solr里面去

将Atlas自带的solr配置文件拷贝到node03服务器的Solr安装目录下

```shell
cp -r /kkb/install/apache-atlas-1.2.0/conf/solr /kkb/install/solr-5.5.2/
重命名文件夹名称
cd /kkb/install/solr-5.5.2/
mv solr/ atlas_conf
```

##### 第三步：同步拷贝后的配置文件到node01与node02

同步node01服务器的配置文件到node01和node02

```
node01执行以下命令进行同步
cd /kkb/install/solr-5.5.2/
scp -r atlas_conf/ node01:/kkb/install/solr-5.5.2/
scp -r atlas_conf/ node02:/kkb/install/solr-5.5.2/
```

##### 第四步：创建solr的collection

在solrCloud模式下，启动solr，并创建collection

node01执行以下命令来创建collection（确保solr已经开启）

```shell
cd /kkb/install/solr-5.5.2/
bin/solr create -c vertex_index -d /kkb/install/solr-5.5.2/atlas_conf/ -shards 3 -replicationFactor 2       
bin/solr create -c edge_index -d  /kkb/install/solr-5.5.2/atlas_conf -shards 3 -replicationFactor 2

bin/solr create -c fulltext_index -d /kkb/install/solr-5.5.2/atlas_conf -shards 3 -replicationFactor 2

```

-shards 3：表示该集合分片数为3

-replicationFactor 2：表示每个分片数都有2个备份

vertex_index、edge_index、fulltext_index：表示集合名称

注意：如果需要删除vertex_index、edge_index、fulltext_index等collection可以执行如下命令。

```
cd /kkb/install/solr-5.5.2/
bin/solr delete -c ${collection_name}
```

验证创建collection成功

浏览器页面访问http://node01:8983/solr/#/~cloud看到以下效果证明创建成功



![1586184687785](atlas元数据管理.assets/1586184687785.png)



#### Atlas集成Kafka服务

##### 第一步：修改Atlas配置文件 atlas-application.properties 

修改Atlas配置文件atlas-application.properties

**node03执行**以下命令修改配置文件内容

```shell
cd /kkb/install/apache-atlas-1.2.0/conf
vim atlas-application.properties


atlas.notification.embedded=false
atlas.kafka.zookeeper.connect=node01:2181,node02:2181,node03:2181
atlas.kafka.bootstrap.servers=node01:9092,node02:9092,node03:9092
atlas.kafka.zookeeper.session.timeout.ms=4000
atlas.kafka.zookeeper.connection.timeout.ms=2000
atlas.kafka.enable.auto.commit=true
```

##### 第二步：创建kafka的topic

创建kafka的topic

Atlas与kafka集成需要创建两个topic，这两个topic的名字配置在atlas-application.properties这个配置文件里面

```
atlas.notification.topics=ATLAS_HOOK,ATLAS_ENTITIES
```

**node01执行**以下命令创建这两个topic

```shell
[hadoop@node01 ~]$ sh ./bin/kafkaCluster.sh start

kafka-topics.sh --zookeeper node01:2181,node02:2181,node03:2181 --create --replication-factor 2 --partitions 3 --topic ATLAS_HOOK

kafka-topics.sh --zookeeper node01:2181,node02:2181,node03:2181 --create --replication-factor 2 --partitions 3 --topic ATLAS_ENTITIES
```

#### Atlas集成hive服务

##### 第一步：修改Atlas配置文件 atlas-application.properties 

修改Atlas配置文件atlas-application.properties

node03执行以下命令修改配置文件内容

```shell
cd /kkb/install/apache-atlas-1.2.0/conf
vim atlas-application.properties

#手动添加以下配置，这些配置在配置文件里面没有，需要我们自己手动添加
########## Hive Hook Configs #######
atlas.hook.hive.synchronous=false
atlas.hook.hive.numRetries=3
atlas.hook.hive.queueSize=10000
atlas.cluster.name=primary

```

##### 第二步：添加配置文件放到jar包里面去

将atlas-application.properties配置文件添加到atlas-plugin-classloader-1.2.0.jar包

**node03执行**以下命令，将atlas-application.properties这个配置文件添加到atlas-plugin-classloader-1.2.0.jar这个jar包

```shell
sudo yum -y install zip
cd /kkb/install/apache-atlas-1.2.0/conf
 zip -u  /kkb/install/apache-atlas-1.2.0/hook/hive/atlas-plugin-classloader-1.2.0.jar  atlas-application.properties
```

##### 第三步：拷贝配置文件到hive的conf目录下

node03执行以下命令，将atlas-application.properties配置文件，拷贝到hive的conf目录下

```sh
cd /kkb/install/apache-atlas-1.2.0/conf/
cp atlas-application.properties /kkb/install/hive-1.1.0-cdh5.14.2/conf/  
```

##### 第四步：修改hive-env.sh配置外部jar包

node03执行以下命令修改hive-env.sh添加外部jar包

```shell
cd /kkb/install/hive-1.1.0-cdh5.14.2/conf
vim hive-env.sh 

export HIVE_AUX_JARS_PATH=/kkb/install/apache-atlas-1.2.0/hook/hive
```

##### 第五步：修改hive-site.xml

修改hive-site.xml配置文件

node03执行以下命令修改hive的配置文件hive-site.xml

```xml
cd /kkb/install/hive-1.1.0-cdh5.14.2/conf
vim hive-site.xml 

<property>
      <name>hive.exec.post.hooks</name> 		<value>org.apache.atlas.hive.hook.HiveHook,org.apache.hadoop.hive.ql.hooks.LineageLogger</value>
</property>
```

#### Atlas其他配置选项

##### 第一步：修改Atlas的主机名

 node03执行以下命令，修改配置文件atlas-application.properties

```shell
cd /kkb/install/apache-atlas-1.2.0/conf/
vim atlas-application.properties

atlas.rest.address=http://node03:21000
atlas.audit.hbase.zookeeper.quorum=node01:2181,node02:2181,node03:2181
```

##### 第二步：修改Atlas的日志配置文件

node03执行以下命令修改atlas的日志服务配置文件atlas-log4j.xml

```shell
cd /kkb/install/apache-atlas-1.2.0/conf
vim atlas-log4j.xml

以下配置在文件当中已经存在，只不过被注释掉了，直接打开即可

<appender name="perf_appender" class="org.apache.log4j.DailyRollingFileAppender">
        <param name="file" value="${atlas.log.dir}/atlas_perf.log" />
        <param name="datePattern" value="'.'yyyy-MM-dd" />
        <param name="append" value="true" />
        <layout class="org.apache.log4j.PatternLayout">
            <param name="ConversionPattern" value="%d|%t|%m%n" />
        </layout>
    </appender>

    <logger name="org.apache.atlas.perf" additivity="false">
        <level value="debug" />
        <appender-ref ref="perf_appender" />
    </logger>
```

## 5、Atlas启动服务并访问页面

node03执行以下命令启动Atlas的服务（确保hive/hbase/zk/hadoop/solr都开启了）

```shell
cd /kkb/install/apache-atlas-1.2.0
bin/atlas_start.py
```

浏览器页面访问：

http://node03:21000/#!/search   注意：访问web页面后，不能立刻登录，要等一会

```
用户名：admin

密码：admin
```

<img src="atlas元数据管理.assets/image-20200521185752050.png" alt="image-20200521185752050" style="zoom:50%;" />

## 6、导入hive元数据到Atlas当中来

将hive元数据导入到Atlas当中来进行管理

### 第一步：node03配置hive环境变量

node03执行以下命令，配置hive的环境变量

```sh
sudo vim /etc/profile

export HIVE_HOME=/kkb/install/hive-1.1.0-cdh5.14.2
export PATH=:$HIVE_HOME/bin:$PATH

source /etc/profile
```

### 第二步：验证hive功能正常

node03执行以下命令进入hive客户端，如果hive功能正常即可

```shell
[hadoop@node03 hive]$ cd /kkb/install/hive-1.1.0-cdh5.14.2/
[hadoop@node03 hive-1.1.0-cdh5.14.2]$ hive
hive (default)> show databases;
```

### 第三步：导入hive元数据到atlas

node03执行以下命令导入hive元数据

```
cd /kkb/install/apache-atlas-1.2.0/
bin/import-hive.sh 
```

导入过程中会报以下错误

```
Exception in thread "main" java.lang.NoClassDefFoundError: com/fasterxml/jackson/jaxrs/json/JacksonJaxbJsonProvider
        at org.apache.atlas.AtlasBaseClient.getClient(AtlasBaseClient.java:270)
        at org.apache.atlas.AtlasBaseClient.initializeState(AtlasBaseClient.java:453)
        at org.apache.atlas.AtlasBaseClient.initializeState(AtlasBaseClient.java:448)
        at org.apache.atlas.AtlasBaseClient.<init>(AtlasBaseClient.java:132)
        at org.apache.atlas.AtlasClientV2.<init>(AtlasClientV2.java:82)
        at org.apache.atlas.hive.bridge.HiveMetaStoreBridge.main(HiveMetaStoreBridge.java:131)
Caused by: java.lang.ClassNotFoundException: com.fasterxml.jackson.jaxrs.json.JacksonJaxbJsonProvider
        at java.net.URLClassLoader.findClass(URLClassLoader.java:381)
        at java.lang.ClassLoader.loadClass(ClassLoader.java:424)
        at sun.misc.Launcher$AppClassLoader.loadClass(Launcher.java:335)
        at java.lang.ClassLoader.loadClass(ClassLoader.java:357)
        ... 6 more
```



### 第四步：拷贝jar包解决以上错误

缺少jar包，导致以上错误，需要我们手动拷贝几个jar包到atlas的hook目录下即可

```shell
cd /kkb/install/apache-atlas-1.2.0/server/webapp/atlas/WEB-INF/lib
cp jackson-jaxrs-base-2.9.9.jar jackson-jaxrs-json-provider-2.9.9.jar jackson-module-jaxb-annotations-2.9.9.jar  /kkb/install/apache-atlas-1.2.0/hook/hive/atlas-hive-plugin-impl/
```



### 第五步：重新导入元数据

重新导入hive元数据信息到atlas当中来

```
cd /kkb/install/apache-atlas-1.2.0/
bin/import-hive.sh 

出现以下信息，证明导入成功
Using Hive configuration directory [/kkb/install/hive-1.1.0-cdh5.14.2/conf]
Log file for import is /kkb/install/apache-atlas-1.2.0/logs/import-hive.log
log4j:WARN No such property [maxFileSize] in org.apache.log4j.PatternLayout.
log4j:WARN No such property [maxBackupIndex] in org.apache.log4j.PatternLayout.
Enter username for atlas :- admin
Enter password for atlas :- 
Hive Meta Data imported successfully!!!
```

![1587518503593](atlas元数据管理.assets/1587518503593.png)



### 第六步：浏览器页面访问浏览元数据信息

直接浏览器页面访问

http://node03:21000/#!/search/searchResult?type=hive_db&searchType=basic

![image-20200521190752884](atlas元数据管理.assets/image-20200521190752884.png)

就可以看到我们的元数据信息了

## 7、使用azkaban来实现我们的任务调度并查看血缘管理

### 第一步：在node03服务器上面创建mysql数据库表

```sql
CREATE DATABASE /*!32312 IF NOT EXISTS*/`game_center2` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `game_center2`;

/*Table structure for table `res_active_users` */

DROP TABLE IF EXISTS `res_active_users`;

CREATE TABLE `res_active_users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `plat_id` VARCHAR(16) DEFAULT NULL,
  `channel_id` VARCHAR(16) DEFAULT NULL,
  `event_date` VARCHAR(16) DEFAULT NULL,
  `new_users` VARCHAR(16) DEFAULT NULL,
  `old_users` VARCHAR(16) DEFAULT NULL,
  `all_users` VARCHAR(16) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=INNODB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8;

/*Table structure for table `res_channel_num` */

DROP TABLE IF EXISTS `res_channel_num`;

CREATE TABLE `res_channel_num` (
  `login_date` VARCHAR(64) DEFAULT NULL,
  `channel_id` VARCHAR(64) DEFAULT NULL,
  `device_num` VARCHAR(64) DEFAULT NULL,
  `reg_user` VARCHAR(64) DEFAULT NULL,
  `active_users` VARCHAR(64) DEFAULT NULL,
  `play_once_users` VARCHAR(64) DEFAULT NULL,
  `pay_users` VARCHAR(64) DEFAULT NULL,
  `pay_user` VARCHAR(64) DEFAULT NULL,
  `pay_money` VARCHAR(64) DEFAULT NULL
) ENGINE=INNODB DEFAULT CHARSET=utf8;

/*Table structure for table `res_channel_num_temp` */

DROP TABLE IF EXISTS `res_channel_num_temp`;

CREATE TABLE `res_channel_num_temp` (
  `login_date` VARCHAR(64) DEFAULT NULL,
  `channel_id` VARCHAR(64) DEFAULT NULL,
  `device_num` VARCHAR(64) DEFAULT NULL,
  `reg_user` VARCHAR(64) DEFAULT NULL,
  `active_users` VARCHAR(64) DEFAULT NULL,
  `play_once_users` VARCHAR(64) DEFAULT NULL,
  `pay_users` VARCHAR(64) DEFAULT NULL,
  `pay_user` VARCHAR(64) DEFAULT NULL,
  `pay_money` VARCHAR(64) DEFAULT NULL
) ENGINE=INNODB DEFAULT CHARSET=utf8;
```

### 第二步：将我们的数据上传

将我们需要执行的数据上传到node03服务器的/kkb/datas/gamecenter 这个路径下

### 第三步：使用azkaban执行调度任务

使用azkaban来调度执行我们的任务

![1587565757231](atlas元数据管理.assets/1587565757231.png)

### 第四步：atlas当中查看血缘关系

查看表之间的血缘关系

![1587565884322](atlas元数据管理.assets/1587565884322.png)

查看字段之间的血缘关系

![1587565940545](atlas元数据管理.assets/1587565940545.png)























