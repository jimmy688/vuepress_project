## hue的基本介绍

HUE-->Hadoop User Experience

Hue是一个开源的Apache Hadoop UI系统，由Cloudera Desktop演化而来，最后Cloudera公司将其贡献给Apache基金会的Hadoop社区，它是基于Python Web框架Django实现的。

通过使用Hue我们可以在浏览器端的Web控制台上与Hadoop集群进行交互来分析处理数据，例如操作HDFS上的数据，运行MapReduce Job，执行Hive的SQL语句，浏览HBase数据库等等。

## HUE帮助学习链接

Site: http://gethue.com/

Github: https://github.com/cloudera/hue

Reviews: [https://review.cloudera.org](https://review.cloudera.org/)

## Hue的架构

![1571452158221](hue.assets/1571452158221.png)

## hue核心功能

hue的核心功能如下：

- SQL编辑器，支持Hive, Impala, MySQL, Oracle, PostgreSQL, SparkSQL, Solr SQL, Phoenix…

- 搜索引擎Solr的各种图表

- Spark和Hadoop的友好界面支持

- 支持调度系统Apache Oozie，可进行workflow的编辑、查看


HUE提供的这些功能相比Hadoop生态各组件提供的界面更加友好，但是一些需要debug的场景可能还是需要使用原生系统才能更加深入的找到错误的原因。

HUE中查看Oozie workflow时，也可以很方便的看到整个workflow的DAG图，不过在最新版本中已经将DAG图去掉了，只能看到workflow中的action列表和他们之间的跳转关系，想要看DAG图的仍然可以使用oozie原生的界面系统查看。（hue可以很好地整合oozie)

详细功能如下：

1，访问HDFS和文件浏览 

2，通过web调试和开发hive以及数据结果展示 

3，查询solr和结果展示，报表生成 

4，通过web调试和开发impala交互式SQL Query 

5，spark调试和开发 

7，oozie任务的开发，监控，和工作流协调调度 

8，Hbase数据查询和修改，数据展示 

9，Hive的元数据（metastore）查询 

10，MapReduce任务进度查看，日志追踪 

11，创建和提交MapReduce，Streaming，Java job任务 

12，Sqoop2的开发和调试 

13，Zookeeper的浏览和编辑 

14，数据库（MySQL，PostGres，SQlite，Oracle）的查询和展示 

一句话总结：Hue是一个友好的界面集成框架，可以集成我们各种学习过的以及将要学习的框架，一个界面就可以做到查看以及执行所有的框架

## 拓展：安装notepad远程编辑linux的插件

插件--》插件管理--》可用--》安装NppFTP

![image-20200404142752920](hue.assets/image-20200404142752920.png)

连接linux：

![image-20200404142950715](hue.assets/image-20200404142950715.png)

<img src="hue.assets/image-20200404143658685.png" alt="image-20200404143658685"  />



<img src="hue.assets/image-20200404143543804.png" alt="image-20200404143543804"  />	

## Hue的安装

Hue的安装支持多种方式，包括rpm包的方式进行安装，tar.gz包的方式进行安装以及cloudera  manager的方式来进行安装等，我们这里使用tar.gz包的方式来进行安装

#### 第一步：下载解压安装包

Hue的压缩包的下载地址：

http://archive.cloudera.com/cdh5/cdh/5/

我们这里使用的是CDH5.14.2这个对应的版本，具体下载地址为

http://archive.cloudera.com/cdh5/cdh/5/hue-3.9.0-cdh5.14.2.tar.gz

下载然后上传到node03服务器的/kkb/soft路径下

```sh
cd /kkb/soft
[hadoop@node03 soft]$ tar -zxvf hue-3.9.0-cdh5.14.2.tar.gz -C /kkb/install/
```

#### 第二步：联网安装各种必须的依赖包

```sh
sudo yum install ant asciidoc cyrus-sasl-devel cyrus-sasl-gssapi cyrus-sasl-plain gcc gcc-c++ krb5-devel libffi-devel libxml2-devel libxslt-devel make  mysql mysql-devel openldap-devel python-devel sqlite-devel gmp-devel libffi  gcc gcc-c++ kernel-devel openssl-devel gmp-devel openldap-devel
```

#### 第三步：修改配置文件

```sh
cd /kkb/install/hue-3.9.0-cdh5.14.2/desktop/conf

vim  hue.ini
#通用配置

[desktop]
    secret_key=jFE93j;2[290-eiw.KEiwN2s3['d;/.q[eIW^y#e=+Iei*@Mn<qW5o
    http_host=node03.kaikeba.com
    is_hue_4=true
    time_zone=Asia/Shanghai
    server_user=hadoop
    server_group=hadoop
    default_user=hadoop
    default_hdfs_superuser=hadoop

#配置使用mysql作为hue的存储数据库,大概在hue.ini的587行左右

[[database]]
    engine=mysql
    host=node03.kaikeba.com
    port=3306
    user=root
    password=123456
    name=hue
```

#### 第四步：创建mysql数据库

在node03登录mysql

```sh
mysql -u root -p
```

创建hue数据库

```sql
mysql> create database hue default character set utf8 default collate utf8_general_ci;
```

注意：实际工作中，还需要为hue这个数据库创建对应的用户，并分配权限，我这就不创建了，所以下面这一步不用执行了

```sql
set global validate_password_policy=LOW;
set global validate_password_length=6;
grant all on hue.* to 'hue'@'%' identified by 'hue123';
```

#### 第五步：编译

node03服务器执行以下命令准备进行编译

```sh
cd /kkb/install/hue-3.9.0-cdh5.14.2
sudo make apps
```

#### 第六步：linux系统添加普通用户hue

node03执行以下命令，创建普通用户

```sh
sudo useradd hue
sudo passwd hue

#密码设置为了hue
```

## 启动hue进程

node03执行以下命令启动hue

```sh
cd /kkb/install/hue-3.9.0-cdh5.14.2
sudo build/env/bin/supervisor  #这是前台启动
```

web页面访问：http://node03:8888

第一次访问的时候，需要设置管理员用户和密码

我们这里的管理员的用户名与密码尽量保持与我们安装hadoop的用户名和密码一致，

我们安装hadoop的用户名与密码分别是hadoop,hadoop

初次登录使用hadoop,密码为hadoop

进入之后发现我们的hue页面报错了，这个错误主要是因为hive的原因，因为我们的hue与hive集成的时候出错了，所以我们需要配置我们的hue与hive进行集成，接下里就看看我们的hue与hive以及hadoop如何进行集成





## hue与HDFS及yarn集成

#### 第一步：更改所有hadoop节点的core-site.xml

记得更改完core-site.xml之后一定要重启hdfs与yarn集群

三台机器更改core-site.xml

```xml
vi /kkb/install/hadoop-2.6.0-cdh5.14.2/etc/hadoop/core-site.xml

<property>
	<name>hadoop.proxyuser.hadoop.hosts</name>
	<value>*</value>
</property>

<property>
	<name>hadoop.proxyuser.hadoop.groups</name>
	<value>*</value>
</property> 
```



#### 第二步：更改所有hadoop节点的hdfs-site.xml

所有服务器更改hdfs-site.xml添加以下配置

```xml
vi /kkb/install/hadoop-2.6.0-cdh5.14.2/etc/hadoop/hdfs-site.xml 

<property>
	<name>dfs.webhdfs.enabled</name>
	<value>true</value>
</property>
```

#### 第三步：重启hadoop集群

在node01机器上面执行以下命令

```sh
cd /kkb/install/hadoop-2.6.0-cdh5.14.2

sbin/stop-dfs.sh
sbin/start-dfs.sh
sbin/stop-yarn.sh
sbin/start-yarn.sh
```

#### 第四步：停止hue的服务，配置hue.ini

停止hue的服务，然后进入到以下路径，重新配置hue.ini这个配置文件。（使用notepad编辑也行）

```sh
cd /kkb/install/hue-3.9.0-cdh5.14.2/desktop/conf

vim hue.ini

#配置我们的hue与hdfs集成]]
[[hdfs_clusters]]
	[[[default]]]
        fs_defaultfs=hdfs://node01:8020
        webhdfs_url=http://node01:50070/webhdfs/v1
        hadoop_hdfs_home=/kkb/install/hadoop-2.6.0-cdh5.14.2 #自己添加
        hadoop_bin=/kkb/install/hadoop-2.6.0-cdh5.14.2/bin   #自己添加
        hadoop_conf_dir=/kkb/install/hadoop-2.6.0-cdh5.14.2/etc/hadoop

#配置我们的hue与yarn集成

[[yarn_clusters]]

    [[[default]]]
    
      resourcemanager_host=node01
      resourcemanager_port=8032
      submit_to=True
      resourcemanager_api_url=http://node01:8088
      history_server_api_url=http://node01:19888

```

#### 第五步：启动hue的服务

node03执行以下命令进行重新启动hue的服务

```
cd /kkb/install/hue-3.9.0-cdh5.14.2/
build/env/bin/supervisor
```

#### 第六步：web访问hue

<img src="hue.assets/image-20200404160352030.png" alt="image-20200404160352030" style="zoom:80%;" />



## hue与hive集成

如果需要配置hue与hive的集成，我们需要启动hive的metastore服务以及hiveserver2服务（impala需要hive的metastore服务，hue需要hvie的hiveserver2服务）

#### 更改hue的配置hue.ini

停止hue的服务，然后重新编辑修改hue.ini这个配置文件

修改hue.ini

```sh
cd /kkb/install/hue-3.9.0-cdh5.14.2/desktop/conf
vim hue.ini

[beeswax]
    hive_server_host=node03
    hive_server_port=10000
    hive_conf_dir=/kkb/install/hive-1.1.0-cdh5.14.2/conf
    server_conn_timeout=120
    auth_username=hadoop
    auth_password=hadoop
  
[metastore]

  #允许使用hive创建数据库表等操作
  enable_new_create_table=true

```

#### 启动hive服务

去node03机器上启动hive的metastore以及hiveserver2服务

```sh
cd /kkb/install/hive-1.1.0-cdh5.14.2/conf
nohup bin/hive --service metastore &
nohup bin/hive --service hiveserver2 &
```

#### 重启hue

node03执行以下命令进行重新启动hue的服务

```
cd /kkb/install/hue-3.9.0-cdh5.14.2/
build/env/bin/supervisor
```

## hue与impala的集成(TODO)

停止hue的服务进程

修改hue.ini配置文件

```sh
cd /kkb/install/hue-3.9.0-cdh5.14.2/desktop/conf
vim hue.ini

[impala]

  server_host=node03
  server_port=21050
  impala_conf_dir=/etc/impala/conf
```

然后node03执行以下命令，重新启动hue的服务即可

```sh
cd /kkb/install/hue-3.9.0-cdh5.14.2/
build/env/bin/supervisor
```



## hue与mysql集成

找到databases 这个选项，将这个选项下面的mysql注释给打开，然后配置mysql即可,大概在1547行

停止hue的服务，然后修改hue.ini

```sh
cd /kkb/install/hue-3.9.0-cdh5.14.2/desktop/conf
vim hue.ini

[[[mysql]]]
    nice_name="My SQL DB"
    engine=mysql
    host=node03
    port=3306
    user=root
    password=123456
```

更改完了配置，重新启动hue的服务

```
cd /kkb/install/hue-3.9.0-cdh5.14.2/
build/env/bin/supervisor
```

## 待解决问题（TODO）

1. hue的web界面的mysql语句不能出现中文，出现中文就报错。

<img src="hue.assets/image-20200406141311787.png" alt="image-20200406141311787" style="zoom:80%;" />

## hue与hbase集成

##### 第一步：修改hue.ini

停止hue的服务，然后继续修改hue的配置文件hue.ini

```sh
cd /kkb/install/hue-3.9.0-cdh5.14.2/desktop/conf

vim hue.ini

[hbase]
  hbase_clusters=(Cluster|node01:9090)
  hbase_conf_dir=/kkb/install/hbase-1.2.0-cdh5.14.2/conf
```

 

##### 第二步：启动hbase的thrift server服务

第一台机器执行以下命令启动hbase的thriftserver

```sh
[hadoop@node01 ~]$ start-hbase.sh
[hadoop@node01 ~]$ hbase-daemon.sh start thrift

#cd /kkb/install/hbase-1.2.0-cdh5.14.2
#bin/start-hbase.sh 
#bin/hbase-daemon.sh start thrift  
```

 

##### 第三步：启动hue

第三台机器执行以下命令启动hue

```sh
cd /kkb/install/hue-3.9.0-cdh5.14.2/

build/env/bin/supervisor
```

##### 第四步：页面访问

http://node03:8888/hue/













































