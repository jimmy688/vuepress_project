## flume前言

在一个完整的离线大数据处理系统中，除了hdfs+mapreduce+hive组成分析系统的核心之外，还需要数据采集、结果数据导出、任务调度等不可或缺的辅助系统，而这些辅助工具在hadoop生态体系中都有便捷的开源框架，如图所示：

 

![img](flume.assets/clip_image002.jpg)

## flume概述

Flume是一个分布式、可靠、和高可用的海量日志采集、聚合和传输的系统（搬运工）。

Flume可以采集文件，socket数据包、文件、文件夹、kafka等各种形式源数据，又可以将采集到的数据(下沉sink)输出到HDFS、hbase、hive、kafka等众多外部存储系统中。

一般的采集需求，通过对flume的简单配置即可实现

Flume针对特殊场景也具备良好的自定义扩展能力

因此，flume可以适用于大部分的日常数据采集场景

 

## flume运行机制

Flume分布式系统中最核心的角色是agent，flume采集系统就是由一个个agent所连接起来形成

每一个agent相当于一个数据传递员，内部有三个组件：

1. Source：采集组件，用于跟数据源对接，以获取数据。
2. Sink：下沉组件，用于往下一级agent传递数据或者往最终存储系统传递数据。
3. Channel：传输通道组件，用于从source将数据传递到sink。

 

![img](flume.assets/clip_image004.jpg)

 



## Flume采集系统结构图

#### 简单结构

单个agent采集数据

![img](flume.assets/clip_image006.jpg)

#### 复杂结构

两个agent之间串联

![img](flume.assets/clip_image008.png)

多级agent之间串联

![img](flume.assets/clip_image010.jpg)

 

多级channel

![img](flume.assets/clip_image012.png)

 

## Flume的安装部署

Flume的安装非常简单，只需要解压即可，当然，前提是已有hadoop环境

上传安装包到数据源所在节点上，这里我们在第三台机器node03来进行安装,哪里需要就哪安装,随安随用。

```sh
cd /kkb/soft
rz
tar -zxvf flume-ng-1.6.0-cdh5.14.2.tar.gz -C /kkb/install/

cd /kkb/install/apache-flume-1.6.0-cdh5.14.2-bin/conf

cp flume-env.sh.template flume-env.sh
vim flume-env.sh

#设置java环境变量
export JAVA_HOME=/kkb/install/jdk1.8.0_141
```

查看flume的version

```

```

## Event概述

flume的核心是把数据从数据源（source）中收集过来，再将收集到的数据送到指定的目的地（sink）。为了保证传输的过程一定成功，在送到目的地之前，会先缓存数据（channel），待数据真正到达目的地（sink）后，flume再删除自己的缓存数据。

在整个数据的传输的过程中，流动的是event，即事务保证是在event级别进行的。那么什么是event呢？—–event将传输的数据进行封装，是flume传输数据的基本单位，如果是文本文件，通常是一行记录，event也是事务的基本单位。event从source，流向channel，再到sink，本身为一个**字节数组**，并可携带headers(头信息)信息。event代表着一个数据的最小完整单元，从外部数据源来，向外部的目的地去。

一个完整的event包括：event headers、event body、event信息(即文本文件中的单行记录)

![img](flume.assets/1295451-20181220094054936-1140552003.png)

## Flume帮助文档网址

Flume支持众多的source和sink类型，详细手册可参考官方文档：http://archive.cloudera.com/cdh5/cdh/5/flume-ng-1.6.0-cdh5.14.2/FlumeUserGuide.html

中文文档查看网址：https://flume.liyifeng.org/

查看文档时，特别注意，黑色加粗字体常表示为必须参数，如：

![image-20200310153359898](flume.assets/image-20200310153359898.png)

## Flume实战案例1：监听端口(TODO)

#### 案例需求

收集网络端口的数据，并将数据打印到linux的控制台上面

![image-20200310105909015](flume.assets/image-20200310105909015.png) 

#### 案例分析

source：监听网络端口

channel:连接source以及sink

sink:将数据打印到控制台

#### 第一步：开发配置文件

根据数据采集的需求配置采集方案，描述在配置文件中(文件名可任意自定义)

在flume的conf目录下新建一个配置文件（采集方案）

```sh
vim  /kkb/install/apache-flume-1.6.0-cdh5.14.2-bin/conf/netcat-logger.conf

## 定义这个agent中各组件的名字,a1是当前agent的名称
a1.sources = r1
a1.sinks = k1
a1.channels = c1

## 描述和配置source组件：r1
a1.sources.r1.type = netcat
a1.sources.r1.bind = 192.168.52.103 #监听node03节点的端口
a1.sources.r1.port = 44444

## 描述和配置sink组件：k1
a1.sinks.k1.type = logger

## 描述和配置channel组件，此处使用是内存缓存的方式
a1.channels.c1.type = memory
a1.channels.c1.capacity = 1000
a1.channels.c1.transactionCapacity = 100


## 描述和配置source channel  sink之间的连接关系
a1.sources.r1.channels = c1
a1.sinks.k1.channels = c1
```

 

#### 第二步：启动配置文件

在相应的节点上启动flume agent

前台启动：

```sh
cd /kkb/install/apache-flume-1.6.0-cdh5.14.2-bin/

[hadoop@node03 apache-flume-1.6.0-cdh5.14.2-bin]$ bin/flume-ng agent -c conf -f conf/netcat-logger.conf -n a1 -Dflume.root.logger=INFO,console

-c conf   #指定flume自身的配置文件所在目录
-f conf/netcat-logger.con  #指定我们所描述的采集方案
-n a1  #指定我们这个agent的名字
-Dflume.root.logger=INFO,console #是前台启动的意思
```

后台启动：

查看jps，其中的Application就代表flume进程：

```sh
cd /kkb/install/apache-flume-1.6.0-cdh5.14.2-bin/

[hadoop@node03 apache-flume-1.6.0-cdh5.14.2-bin]$ nohup bin/flume-ng agent -c conf -f conf/netcat-logger.conf -n a1 2>&1 &

[hadoop@node03 apache-flume-1.6.0-cdh5.14.2-bin]$ jps
12738 Application
7476 DataNode
11398 QuorumPeerMain
7596 NodeManager
11485 HRegionServer
12927 Jps
```



#### 第三步：安装telent准备测试

在node02机器上面安装telnet客户端，用于模拟数据的发送

```sh
sudo yum -y install telnet
telnet node03 44444  ## 使用telnet模拟数据发送
```

>  Telnet协议是[TCP/IP协议](https://baike.baidu.com/item/TCP%2FIP协议)族中的一员，是Internet远程登录服务的标准协议和主要方式。它为用户提供了在本地计算机上完成远程[主机](https://baike.baidu.com/item/主机/455151)工作的能力。在[终端](https://baike.baidu.com/item/终端/1903878)使用者的电脑上使用telnet程序，用它连接到[服务器](https://baike.baidu.com/item/服务器/100571)。[终端](https://baike.baidu.com/item/终端/1903878)使用者可以在telnet程序中输入命令，这些命令会在[服务器](https://baike.baidu.com/item/服务器/100571)上运行，就像直接在服务器的控制台上输入一样。可以在本地就能控制[服务器](https://baike.baidu.com/item/服务器/100571)。

 

 

## flume实战案例2：采集目录的新文件内容

#### 案例需求

采集需求：某服务器的某特定目录下，会不断产生新的文件，每当有新文件出现，就需要把文件采集到HDFS中去。

需求的结构示意图：

![img](flume.assets/clip_image016.png)

#### 案例分析

根据需求，需要定义以下3大要素：

> 1. 数据源组件，即source ——监控文件目录 : spooldir
>
>    spooldir特性：
>
>      1、监视一个目录，只要目录中出现新文件，就会采集文件中的内容
>
>      2、采集完成的文件，会被agent自动添加一个后缀：COMPLETED
>
>      3、所监视的目录中不允许重复出现相同文件名的文件
>
> 2. 下沉组件，即sink——HDFS文件系统 : hdfs sink
>
> 3. 通道组件，即channel——可用file channel 也可以用内存channel

文档查看思路指导(如何根据需求查看文档帮助):

> 1. 首先去Flume sources的子目录查找sources,因为我们的需求是监听文件目录,所以我们要找一个跟目录相关的source,最终找到了spooling directory source。http://flume.apache.org/FlumeUserGuide.html#spooling-directory-source
> 2. 然后去Flume sinks的子目录查找sinks,因为我们的需求是下沉到hdfs文件系统，所有我们要找一个跟hdfs相关的sinks，最终找到了HDFS sinks。http://flume.apache.org/FlumeUserGuide.html#hdfs-sink
> 3. channels的话，不需要查看文档，直接使用我们上面一个案例的memory channels就可以了。

怎么保证下沉到HDFS的文件的大小?如何避免在hdfs上产生小文件?有两种策略:

> 1. 基于时间的控制
>
>    使用hdfs sink时，时间控制的代码如下，下面的代码表示每隔10分钟会创建一个文件夹(注意：不是日志数据文件）。比如本案例中的文件夹：hdfs://node01:8020/spooldir/files/%y-%m-%d/%H%M/。
>    新的数据文件的将会存放到这个新创建的文件夹。
>
>    ```sh
>    a1.sinks.k1.hdfs.round = true
>    a1.sinks.k1.hdfs.roundValue = 10  #长度
>    a1.sinks.k1.hdfs.roundUnit = minute #时间单位
>    ```
>
> 2. 基于文件大小的控制
>
>    使用hdfs sink时，使用文件大小控制策略的代码如下。
>
>    ```sh
>    hdfs.rollInterval 30
>    #当前文件写入达到该值时间后触发滚动创建新文件（0表示不按照时间来分割文件），单位：秒
>    hdfs.rollSize 1024
>    #当前文件写入达到该大小后触发滚动创建新文件（0表示不根据文件大小来分割文件），单位：字节
>    hdfs.rollCount 10
>    #当前文件写入Event达到该数量后触发滚动创建新文件（0表示不根据 Event 数量来分割文件）
>    hdfs.idleTimeout 0
>    #关闭非活动文件的超时时间（0表示禁用自动关闭文件），单位：秒
>    hdfs.batchSize 100
>    #向 HDFS 写入内容时每次批量操作的 Event 数量
>    ```
>
>    - rollinterval代表hdfs sink间隔多长时间会将临时文件滚动生成最终目标文件。单位：s
>    - rollsize代表当临时文件达到该大小时滚动生成目标文件。单位：byte
>    - rollcount代表当events数据达到该数量的时候，将临时文件滚动生成目标文件。
>    - idleTimeout代表当目前被打开的临时文件在指定时间内，没有任何数据写入，则将临时文件关闭并重命名为目标文件（去掉.tmp后缀）
>    - batchsize代表批处理大小，number of events written to file before it is flushed to HDFS（写入当前文件的events数量达到bachsize时就刷新到hdfs创建文件，也可理解为每次往hdfs刷写多少event的数据）。
>    - .tmp临时文件和目标文件的区别是，临时文件可能会被陆续写入数据，而目标文件不会了，因此可通过控制临时文件滚动生成目标文件的条件来控制目标文件的大小。

#### 第一步：创建要监听的目录

```sh
mkdir -p /kkb/install/dirfile
```

#### 第二步：开发flume配置文件

配置文件编写：

```sh
cd /kkb/install/apache-flume-1.6.0-cdh5.14.2-bin/conf
vim spooldir.conf
```

内容如下：

```sh
## Name the components on this agent
a1.sources = r1
a1.sinks = k1
a1.channels = c1

## Describe/configure the source
#注意：不能往监控目中重复丢同名文件
a1.sources.r1.type = spooldir
a1.sources.r1.spoolDir = /kkb/install/dirfile
a1.sources.r1.fileHeader = true

## Describe the sink
a1.sinks.k1.type = hdfs
a1.sinks.k1.channel = c1
a1.sinks.k1.hdfs.path = hdfs://node01:8020/spooldir/files/%y-%m-%d/%H%M/
a1.sinks.k1.hdfs.filePrefix = events-
#时间控制
a1.sinks.k1.hdfs.round = true
a1.sinks.k1.hdfs.roundValue = 10
a1.sinks.k1.hdfs.roundUnit = minute
#文件控制，下面这种参数设置明显会生成较多小文件，需要加大参数才会避免这种情况
a1.sinks.k1.hdfs.rollInterval = 30
a1.sinks.k1.hdfs.rollSize = 20
a1.sinks.k1.hdfs.rollCount = 5
a1.sinks.k1.hdfs.batchSize = 1
a1.sinks.k1.hdfs.useLocalTimeStamp = true

#生成的文件类型，默认是Sequencefile，可用DataStream，即普通文本
a1.sinks.k1.hdfs.fileType = DataStream

## Use a channel which buffers events in memory
a1.channels.c1.type = memory
a1.channels.c1.capacity = 1000
a1.channels.c1.transactionCapacity = 100

## Bind the source and sink to the channel
a1.sources.r1.channels = c1
a1.sinks.k1.channel = c1
```

hdfs sink部分参数解释：

| Name            | Default   | Description                                               |
| :-------------- | :-------- | :-------------------------------------------------------- |
| **channel**     | –         |                                                           |
| **type**        | –         | The component type name, needs to be `hdfs`               |
| **hdfs.path**   | –         | HDFS directory path (eg hdfs://namenode/flume/webdata/)   |
| hdfs.filePrefix | FlumeData | Name prefixed to files created by Flume in hdfs directory |

Channel参数解释：

| Name               | Description                                         |
| ------------------ | --------------------------------------------------- |
| capacity           | 默认该通道中最大的可以存储的event数量               |
| trasactionCapacity | 每次最大可以从source中拿到或者送到sink中的event数量 |
| keep-alive         | event添加到通道中或者移出的允许时间                 |

#### 第三步：启动flume

```sh
[hadoop@node03 apache-flume-1.6.0-cdh5.14.2-bin]$ bin/flume-ng gent -c conf -f conf/spooldir.conf -n a1 2>&1 &
```

#### 第四步：在监听目录创建文件

特别注意文件不能重名，创建的文件如果重名，flume将会报错，并且一旦报错，flume将不能再使用，要重新开启agent实例。

创建的文件的内容，自己随意写一点上去。

创建完成，立马ls查看监听目录的文件。

```sh
cd /kkb/install/dirfile
[hadoop@node03 dirfile]$ vim hello.txt
[hadoop@node03 dirfile]$ ls
hello.txt.COMPLETED
```

#### 第五步：结果分析

从第四步的代码块可以看出，在监听目录新建的文件会被立马添加一个后缀.COMPLETED，表示文件已经被采集到channel中。

新建文件后的30s内，就在hdfs上出现了新的目录spooldir/files/20-03-11/0200,这个目录是通过flume配置文件的a1.sinks.k1.hdfs.path = hdfs://node01:8020/spooldir/files/%y-%m-%d/%H%M/来设置的的。这个目录下有一个.tmp的临时文件，存储着在监听目录新建的文件的数据。

![image-20200310180102254](flume.assets/image-20200310180102254.png)

在30s（a1.sinks.k1.hdfs.rollInterval = 30）后，.tmp后缀会被去掉，如下：

![image-20200310180150955](flume.assets/image-20200310180150955.png)



## flume实战案例3：采集文件的追加数据

#### 案例需求

比如业务系统使用log4j生成的日志，日志内容不断增加，需要把追加到日志文件中的数据实时采集到hdfs。

![img](flume.assets/clip_image018.png)

#### 需求分析

###### 确定source

对于文件的更新的追踪，可联想到linux的命令tail -f filename命令，这个命令会把 filename 文件里的最尾部的内容显示在屏幕上，并且不断刷新，只要 filename 更新就可以看到最新的文件内容。如下：

```sh
[hadoop@node03 dirfile]$ vim testf.txt
hello,this is jimmy

[hadoop@node03 dirfile]$ tail -f testf.txt 
hello,this is jimmy #一开始还没有下面一行，执行了命令echo $(date) >> testf.txt后才显示了
Thu Mar 12 00:21:23 CST 2020

#可以看到，执行tail -f命令后，显示文件内容的窗口会一直存在，而且会更新内容显示，直到ctrl+c终止。
```

那么，flume正好也有一个sources，叫做exec source，功能为：Exec source runs a given Unix command on start-up and expects that process to continuously produce data on standard out (stderr is simply discarded, unless property logStdErr is set to true). 

大致意思是，exec source会在启动时指定一个给定的Unix命令。那么我们就使用该exec source试一下。

exec source的必需参数如下：

| Property Name | Default | Description                               |
| :------------ | :------ | :---------------------------------------- |
| **channels**  | –       |                                           |
| **type**      | –       | The component type name, needs to be exec |
| **command**   | –       | The command to execute                    |

###### 确定sink

因为我们采集的数据还是放到hdfs上去，因此我们还是使用hdfs sink。

###### 确定channel

使用memory sink即可

#### 第一步：创建监听的文件夹

```
mkdir -p /kkb/install/taillogs/access_log
```

#### 第二步：写flume配置文件

node03开发配置文件：

```sh
cd /kkb/install/apache-flume-1.6.0-cdh5.14.2-bin/conf
vim tail-file.conf
```

配置文件内容如下：

```sh
#起名字
agent1.sources = source1
agent1.sinks = sink1
agent1.channels = channel1

#描述source
agent1.sources.source1.type = exec
agent1.sources.source1.command = tail -F /kkb/install/taillogs/access_log
agent1.sources.source1.channels = channel1

#configure host for source
#agent1.sources.source1.interceptors = i1
#agent1.sources.source1.interceptors.i1.type = host
#agent1.sources.source1.interceptors.i1.hostHeader = hostname

## Describe sink1
agent1.sinks.sink1.type = hdfs

#a1.sinks.k1.channel = c1
agent1.sinks.sink1.hdfs.path = hdfs://node01:8020/weblog/flume-collection/%y-%m-%d/%H-%M
agent1.sinks.sink1.hdfs.filePrefix = access_log
agent1.sinks.sink1.hdfs.maxOpenFiles = 5000
agent1.sinks.sink1.hdfs.batchSize= 100
agent1.sinks.sink1.hdfs.fileType = DataStream
agent1.sinks.sink1.hdfs.writeFormat =Text
agent1.sinks.sink1.hdfs.rollSize = 102400
agent1.sinks.sink1.hdfs.rollCount = 1000000
agent1.sinks.sink1.hdfs.rollInterval = 60
agent1.sinks.sink1.hdfs.round = true
agent1.sinks.sink1.hdfs.roundValue = 10
agent1.sinks.sink1.hdfs.roundUnit = minute
agent1.sinks.sink1.hdfs.useLocalTimeStamp = true

## Use a channel which buffers events in memory
agent1.channels.channel1.type = memory
agent1.channels.channel1.keep-alive = 120
agent1.channels.channel1.capacity = 500000
agent1.channels.channel1.transactionCapacity = 600


## Bind the source and sink to the channel
agent1.sources.source1.channels = channel1
agent1.sinks.sink1.channel = channel1
```

#### 第三步：启动flume

```sh
cd /kkb/install/apache-flume-1.6.0-cdh5.14.2-bin

[hadoop@node03 apache-flume-1.6.0-cdh5.14.2-bin]$ bin/flume-ng agent -c conf -f conf/tail-file.conf -n agent1 2>&1 &
```

#### 第四步：追加内容到监听文件

老师的做法：写脚本。

```sh
#写脚本
[hadoop@node03 dirfile]$ vim tail-file.sh

#!/bin/bash
while true
do
date >> /kkb/install/taillogs/access_log;
sleep 0.5;
done

#运行脚本
[hadoop@node03 dirfile]$ bash tail-file.sh  
```

我的做法：简单模仿追加数据

```sh
[hadoop@node03 dirfile]$ date >> /kkb/install/taillogs/access_log
```

#### 第五步：查看效果

一旦往监听文件追加内容，则会不断生成.tmp临时文件，满足刷写数据到hdfs的条件时就会刷写channel的数据到.tmp临时文件，当满足.tmp文件转成目标文件的条件时就会去掉.tmp后缀形成目标文件，然后生成下一个新的.tmp文件，新的数据将会刷写到新临时文件。如此过程不断循环，直到停止追加数据。

因此，.tmp文件并不一定是空的，可能为空，也可能不为空。

![image-20200311170720929](flume.assets/image-20200311170720929.png)



## flume面试问题

#### 问题1：

描述：在上面3个案例中，使用的channel都是memory channel,这个channel有个弊端，就是当flume宕机的时候，缓存在memory channel里面的数据会全部丢失。

解决：实际工作当中一般使用file channel，比较可靠。

#### 问题2：

描述：在实战案例2中，我们监听一个文件夹下面的所有文件的变化，案例中，文件夹下不能出现重名文件的，一旦出现，flume就会报错，而且该flume agent不会再工作。 

解决：flume的脆弱性使得我们需要监控flume是否报错。监控的方式有写脚本或者使用监控工具ganglia。

#### 问题3：

描述：flume的采集数据的频率要怎么控制？也就是多长时间放一次数据到hdfs上面去？

解决：两个方面，时间的滚动策略，以及文件大小的控制。可参考实战案例2中的案例分析。

#### 问题4：

描述：假如我们监听的是一个日志文件，这个文件每天都会生成新的日志。那么怎么判断一天的日志收集完成？

解决：比如说，今天正在刷写数据的日志文件命名为2020-02-17.log，而昨天的文件命名为2020-02-16.out，每天转点（晚上12点）后，.log文件就改成.out文件，然后新的.log文件，用来收集新的一天的数据（可类比去掉.tmp后缀）。这样可以保证一个文件只存放某一天的日志数据。

#### 问题5：

描述：sink一般只使用文件大小的控制策略？

解决：不是的，如果仅仅使用文件大小来控制，会有一个问题，两天的数据可能混到一个文件里面去了。

#### 问题6：

描述：flume抛异常，重启之后，原来已经是complete但还没发到hdfs的数据，丢失了吗？

解决：重启之后，channel会重新发送，只要channel里面的数据保存好了就不会丢失

#### 问题7：

描述：在实战案例3中，如果flume挂掉了（可以认为ctrl+c关掉），然后重启flume时，会产生脏数据，脏数据跟重启flume之前的数据有重叠。

![image-20200311175048826](flume.assets/image-20200311175048826.png)

脏数据内容如下，一共有10行数据：

![image-20200311175226213](flume.assets/image-20200311175226213.png)

解决：产生脏数据的原因，是因为exec source没有实现断点续传（FTP）的功能。当我们flume重启时，就会执行指定的tail -f filename命令来采集数据，tail -f 默认一次显示末尾的10行数据，所以采集到了10行脏数据。为此，flume1.7当中特地新增加一个source叫做tail-dir source，专门用于解决断点续传的问题。

注意：

- 我们安装的flume版本是1.6，但是因为我们的是CDH版，包含了apache1.7版本的特性，所以可以使用tail-dir source。
- 断点续传功能就是：比如说我采集一个文件的内容，会不断记录我采集到第几行了，如果flume挂掉，重新开启flume采集的时候，就会从记录的那行开始采集，这样就不会漏采集或者多采集。
- 实际工作当中监控文件或者文件夹都是使用tailDir Source

------

## flume实战案例4：实现断点续传

不管是上面的spoolDIr还是execSource dir都有一个缺陷就是没法实现断点续传的功能，为此在flume1.7当中特地新增加一个source叫做taildir source，专门用于解决断点续传的问题。

taildir source可以监控文件或者文件夹，允许我们使用正则表达式的方式来对我们的文件或者文件夹进行监听。

taildir source的参数如下，绿色为必需参数：

| Property Name                                          | Default                              | Description                                                  |
| :----------------------------------------------------- | :----------------------------------- | :----------------------------------------------------------- |
| channels                    | –                                    |                                                              |
| type                        | –                                    | The component type name, needs to be `TAILDIR`.              |
| filegroups                  | –                                    | Space-separated list of file groups. Each file group indicates a set of files to be tailed. |
| filegroups.`<filegroupName>` | –                                    | Absolute path of the file group. Regular expression (and not file system patterns) can be used for filename only. |
| positionFile                                           | ~/.flume/`<br />`taildir_position.json | 用来设定一个记录每个文件的绝对路径和最近一次读取位置inode的文件，这个文件是JSON格式。 |
| maxBatchCount                                          | Long.MAX_VLUE                        | 控制从同一文件连续读取的批次数。 如果source读取多个文件，并且其中一个文件的写入速度很快，则它可能会阻止其他文件被处理，因为繁忙文件将被无休止地读取。 在这种情况下，请降低此值。 |



#### 案例需求：

使用taildir source监听某个目录下的多个文件，并且实现文件的断点续传功能

#### 第一步：开发flume配置文件

```
cd /kkb/install/apache-flume-1.6.0-cdh5.14.2-bin/conf
vim tail-dir.conf
```

内容如下，部分配置解释如下：

- a1.sources.r1.filegroups = f1表示文件的组，可以定义多个组，如a1.sources.r1.filegroups = f1 f2

- a1.sources.r1.filegroups.f1 = /kkb/install/dirfile/.\*log.*  表示f1组，采集文件名包含log字符串的文件内容
- a1.sources.r1.positionFile = /kkb/install/apache-flume-1.6.0-cdh5.14.2-bin/taildir_position.json表示记录读取到哪一行数据等信息的保存路径

```sh
## Name the components on this agent
a1.sources = r1
a1.sinks = k1
a1.channels = c1

## Describe/configure the source
a1.sources.r1.type = TAILDIR
a1.sources.r1.positionFile = /kkb/install/apache-flume-1.6.0-cdh5.14.2-bin/taildir-position.json
a1.sources.r1.filegroups = f1
a1.sources.r1.filegroups.f1 = /kkb/install/dirfile/.*log.*
a1.sources.ri.maxBatchCount = 1000

## Describe the sink
a1.sinks.k1.type = hdfs
a1.sinks.k1.channel = c1
a1.sinks.k1.hdfs.path = hdfs://node01:8020/taildir/files/%y-%m-%d/%H%M/
a1.sinks.k1.hdfs.filePrefix = events-
a1.sinks.k1.hdfs.round = true
a1.sinks.k1.hdfs.roundValue = 10
a1.sinks.k1.hdfs.roundUnit = minute
a1.sinks.k1.hdfs.rollInterval = 3
a1.sinks.k1.hdfs.rollSize = 5000
a1.sinks.k1.hdfs.rollCount = 50000
a1.sinks.k1.hdfs.batchSize = 5000
a1.sinks.k1.hdfs.useLocalTimeStamp = true

#生成的文件类型，默认是Sequencefile，可用DataStream，则为普通文本
a1.sinks.k1.hdfs.fileType = DataStream

## Use a channel which buffers events in memory
a1.channels.c1.type = memory
a1.channels.c1.capacity = 1000
a1.channels.c1.transactionCapacity = 100

## Bind the source and sink to the channel
a1.sources.r1.channels = c1
a1.sinks.k1.channel = c1 
```

#### 第二步：启动flume

node03执行以下命令启动flume

```sh
cd /kkb/install/apache-flume-1.6.0-cdh5.14.2-bin

bin/flume-ng agent -c conf -f conf/tail-dir.conf -n a1 -Dflume.root.logger=INFO,console
```

####  第三步：在监听目录创建文件并追加数据

node03执行以下命令创建文件到指定文件夹下

```sh
mkdir /kkb/install/dirfile
echo "testlog"  >> /kkb/install/dirfile/file1.log
echo "testlog2" >> /kkb/install/dirfile/file1.log
echo "testlog3" >> /kkb/install/dirfile/file1.log
```

 

## flume实战案例5：两个agent级联

#### 案例需求

看下图，如果要收集web服务器中产生的日志到hadoop集群中，则需要进行网络传输。请模拟网路传输采集某台非本地机器产生的数据。

![image-20200311204635495](flume.assets/image-20200311204635495.png)

#### 案例分析

我们可以把hadoop的某台机器比作web服务器，如node02。那么node02就需要安装flume。这样就有两台机器（node02,node03)安装了flume。使用node02的flume监听node02的某个

确定node02的flume配置：

- source--->taildir source
- channel--->memory channel
- sink--->avro sink(要将数据从node02通过网络传输下沉到node03)

确定node03的flume配置：

- source--->avro source（node03要采集从node02传过来的数据）
- channel--->memory channel
- sink-->hdfs sink

avro source参数：

| Property Name | Default | Description                                 |
| :------------ | :------ | :------------------------------------------ |
| **channels**  | –       |                                             |
| **type**      | –       | The component type name, needs to be `avro` |
| **bind**      | –       | hostname or IP address to listen on         |
| **port**      | –       | Port ## to bind to                           |

avro sink参数:

| Property Name | Default | Description                                  |
| :------------ | :------ | :------------------------------------------- |
| **channel**   | –       |                                              |
| **type**      | –       | The component type name, needs to be `avro`. |
| **hostname**  | –       | The hostname or IP address to bind to.       |
| **port**      | –       | The port ## to listen on.                     |
| batch-size    | 100     | number of event to batch together for send.  |

注意事项：

在该案例中，node02的flume的avor sink和node03的avro source要注意ip地址（hostname)的值，要统一填写node03的ip地址192.168.52.103，因为node03是接收方。而且端口也要一致。

#### 第一步：node02安装flume

将node03机器上面的flume安装文件拷贝到node02机器上面去

```sh
[hadoop@node02 ~]$ cd /kkb/install/
[hadoop@node03 install]$ scp -r  apache-flume-1.6.0-cdh5.14.2-bin/ node02:$PWD
```

#### 第二步：node02开发flume配置文件

```sh
cd /kkb/install/apache-flume-1.6.0-cdh5.14.2-bin/conf
vim node02_test1.conf
```

内容如下：

注意事项：a1.sources.r1.positionFile = /kkb/install/apache-flume-1.6.0-cdh5.14.2-bin/avro-position.json中的avro-position.json的一定不要有下划线，命名有下划线的话很可能报错。

```sh
## Name the components on this agent
a1.sources = r1
a1.sinks = k1
a1.channels = c1

## Describe/configure the source
a1.sources.r1.type = TAILDIR
a1.sources.r1.positionFile = /kkb/install/apache-flume-1.6.0-cdh5.14.2-bin/avro-position.json
a1.sources.r1.filegroups = f1
a1.sources.r1.filegroups.f1 = /kkb/install/avro-dirfile/.*log.*
a1.sources.ri.maxBatchCount = 1000

## Describe the sink
#sink端的avro是一个数据发送者
a1.sinks = k1
a1.sinks.k1.type = avro
a1.sinks.k1.channel = c1
a1.sinks.k1.hostname = 192.168.52.103
a1.sinks.k1.port = 4141
a1.sinks.k1.batch-size = 10

## Use a channel which buffers events in memory
a1.channels.c1.type = memory
a1.channels.c1.capacity = 1000
a1.channels.c1.transactionCapacity = 100

## Bind the source and sink to the channel
a1.sources.r1.channels = c1
a1.sinks.k1.channel = c1
```

#### 第四步：node03开发flume配置文件

在node03机器上开发flume的配置文件

```sh
cd /kkb/install/apache-flume-1.6.0-cdh5.14.2-bin/conf
vim node03_test1.conf
```

 内容如下：

```sh
## Name the components on this agent
a1.sources = r1
a1.sinks = k1
a1.channels = c1

## Describe/configure the source
#source中的avro组件是一个接收者服务
a1.sources.r1.type = avro
a1.sources.r1.channels = c1
a1.sources.r1.bind = 192.168.52.103
a1.sources.r1.port = 4141

## Describe the sink
a1.sinks.k1.type = hdfs
a1.sinks.k1.hdfs.path = hdfs://node01:8020/avro/hdfs/%y-%m-%d/%H%M/
a1.sinks.k1.hdfs.filePrefix = events-
a1.sinks.k1.hdfs.round = true
a1.sinks.k1.hdfs.roundValue = 10
a1.sinks.k1.hdfs.roundUnit = minute
a1.sinks.k1.hdfs.rollInterval = 3
a1.sinks.k1.hdfs.rollSize = 20
a1.sinks.k1.hdfs.rollCount = 5
a1.sinks.k1.hdfs.batchSize = 1
a1.sinks.k1.hdfs.useLocalTimeStamp = true

#生成的文件类型，默认是Sequencefile，可用DataStream，则为普通文本
a1.sinks.k1.hdfs.fileType = DataStream

## Use a channel which buffers events in memory
a1.channels.c1.type = memory
a1.channels.c1.capacity = 1000
a1.channels.c1.transactionCapacity = 100

## Bind the source and sink to the channel
a1.sources.r1.channels = c1
a1.sinks.k1.channel = c1
```

#### 第三步：node02创建监听目录

```sh
[hadoop@node02 ~]$ mkdir /kkb/install/avro-dirfile
```

#### 第四步：顺序启动node02/03的flume

node03机器启动flume进程（先启动）

```sh
cd /kkb/install/apache-flume-1.6.0-cdh5.14.2-bin
bin/flume-ng agent -c conf -f conf/node03_test1.conf -n a1 -Dflume.root.logger=INFO,console 
```

node02机器启动flume进程（后启动）

```sh
cd /kkb/install/apache-flume-1.6.0-cdh5.14.2-bin/
bin/flume-ng agent -c conf -f conf/node02_test1.conf -n a1 -Dflume.root.logger=INFO,console 
```

#### 第五步：往node02监听目录写入文件

```sh
[hadoop@node02 install]$ cd /kkb/install/avro-dirfile/

[hadoop@node02 avro-dirfile]$ date >> krystal.log
[hadoop@node02 avro-dirfile]$ date >> krystal.log
[hadoop@node02 avro-dirfile]$ date >> krystal.log
```

## 思考问题：

如果有很多服务器，产生的日志都由一个机器的flume收集，那么一旦这个机器的flume挂掉了，将会损失重大，而且可能造成负载不均衡，接下来，就讲如何解决这个问题。

<img src="flume.assets/image-20200311230906170.png" alt="image-20200311230906170" style="zoom: 67%;" />



## flume实战案例6：高可用failover

#### 案例需求

搭建一个高可用的Flume NG集群，如下，一开始，node01采集的数据发送到node02(node03)上去，一旦node02(node03)挂掉了以后，就往node03(node02)上发送数据。

![image-20200312010453984](flume.assets/image-20200312010453984.png)

 

#### 案例分析

角色分配：

Flume的Agent和Collector分布如下表所示：

| 名称       | HOST   | 角色        |
| ---------- | ------ | ----------- |
| Agent1     | node01 | Web  Server |
| Collector1 | node02 | AgentMstr1  |
| Collector2 | node03 | AgentMstr2  |

Agent1数据分别流入到Collector1和Collector2，Flume NG本身提供了Failover机制，可以自动切换和恢复，从而实现高可用。

node01:

- source: taildir source
- channel:memory channel
- sink:avro sink

node02:

- source: avro source
- channel:memory channel
- sink:hdfs sink

node03:

- source: avro source
- channel:memory channel
- sink:hdfs sink

#### 第一步：node01安装flume

将node03或者node02的flume安装包拷贝到node01上去。

```sh
[hadoop@node02 install]$ cd /kkb/install
[hadoop@node02 install]$ scp -r apache-flume-1.6.0-cdh5.14.2-bin/ node01:/kkb/install/
```

####  第二步：node01开发flume配置文件

node01机器配置agent的配置文件

```sh
cd /kkb/install/apache-flume-1.6.0-cdh5.14.2-bin/conf

vim agent.conf
```

内容如下：

```sh
#agent1 name
agent1.channels = c1
agent1.sources = r1
agent1.sinks = k1 k2

#set channel
agent1.channels.c1.type = memory
agent1.channels.c1.capacity = 1000
agent1.channels.c1.transactionCapacity = 100



#agent1.sources.r1.type = exec
#agent1.sources.r1.command = tail -F /kkb/install/taillogs/access_log
agent1.sources.r1.channels = c1
agent1.sources.r1.type = TAILDIR
agent1.sources.r1.positionFile = /kkb/install/apache-flume-1.6.0-cdh5.14.2-bin/failover-position.json
agent1.sources.r1.filegroups = f1
agent1.sources.r1.filegroups.f1 = /kkb/install/failover-dirfile/.*log.*
agent1.sources.ri.maxBatchCount = 1000

agent1.sources.r1.interceptors = i1 i2
agent1.sources.r1.interceptors.i1.type = static
agent1.sources.r1.interceptors.i1.key = Type
agent1.sources.r1.interceptors.i1.value = LOGIN
agent1.sources.r1.interceptors.i2.type = timestamp

## set sink1
agent1.sinks.k1.channel = c1
agent1.sinks.k1.type = avro
agent1.sinks.k1.hostname = node02
agent1.sinks.k1.port = 52020

## set sink2
agent1.sinks.k2.channel = c1
agent1.sinks.k2.type = avro
agent1.sinks.k2.hostname = node03
agent1.sinks.k2.port = 52020

#set gruop
agent1.sinkgroups = g1
#set sink group
agent1.sinkgroups.g1.sinks = k1 k2

#set failover
agent1.sinkgroups.g1.processor.type = failover
agent1.sinkgroups.g1.processor.priority.k1 = 10
agent1.sinkgroups.g1.processor.priority.k2 = 1
agent1.sinkgroups.g1.processor.maxpenalty = 1000
```

部分参数解释如下：

- agent1.sinks = k1 k2，node01的flume要设置两个sink,分别下沉数据到node02/node03

- interceptors是拦截器，后面会讲。

- agent1.sinkgroups.g1.sinks = k1 k2，设置名为g1的sinkgroup的sinks为k1,k2

- Flume Sink Processors--->Sink groups allow users to group multiple sinks into one entity. Sink processors can be used to provide load balancing capabilities over all sinks inside the group or to achieve fail over from one sink to another in case of temporal failure. 这段话的意思是，sink groups允许我们将多个sink作为一个整体，而sink processors可以用于提供，对sink group内的所有sink进行负载均衡的功能，或者完成高可用的功能。

- flume sink processors的必需参数如下：

  | Property Name      | Default | Description                                                  |
  | :----------------- | :------ | :----------------------------------------------------------- |
  | **sinks**          | –       | Space-separated list of sinks that are participating in the group |
  | **processor.type** | default | The component type name, needs to be default, failover or load_balance |

- default sink processor accepts only a single sink. User is not forced to create processor (sink group) for single sinks.

- 代码块中的processor.type = failover表示使用failover sink机制，即高可用。

- failover sink参数如下：

  | Property Name           | Default | Description                                                  |
  | :---------------------- | :------ | :----------------------------------------------------------- |
  | **sinks**               | –       | Space-separated list of sinks that are participating in the group |
  | **processor.type**      | default | The component type name, needs to be failover。              |
  | **processor.priority.** | –       | Priority value. `<sinkName>` must be one of the sink instances associated with the current sink group A higher priority value Sink gets activated earlier. A larger absolute value indicates higher priority |
  | processor.maxpenalty    | 30000   | The maximum backoff period for the failed Sink (in millis)   |

- 代码块中的processor.priority.k1用来设置某个sink的权重，在该案例中，node01的数据将会优先使用权重高的sink来进行下沉数据。而不同的sink对应不同的主机（node02/node03)。

- processors的使用方法的example

  ```sh
  #agent named a1
  a1.sinkgroups = g1
  a1.sinkgroups.g1.sinks = k1 k2
  a1.sinkgroups.g1.processor.type = load_balance
  ```



#### 第三步：node02开发flume配置文件

node02机器修改配置文件

```sh
cd /kkb/install/apache-flume-1.6.0-cdh5.14.2-bin/conf
vim collector.conf
```

 内容如下：

```sh
#set Agent name
a1.sources = r1
a1.channels = c1
a1.sinks = k1

#set channel
a1.channels.c1.type = memory
a1.channels.c1.capacity = 1000
a1.channels.c1.transactionCapacity = 100

## other node,nna to nns
a1.sources.r1.type = avro
a1.sources.r1.bind = node02
a1.sources.r1.port = 52020
a1.sources.r1.interceptors = i1
a1.sources.r1.interceptors.i1.type = static
a1.sources.r1.interceptors.i1.key = Collector
a1.sources.r1.interceptors.i1.value = node02
a1.sources.r1.channels = c1

#set sink to hdfs
a1.sinks.k1.type=hdfs
a1.sinks.k1.hdfs.path= hdfs://node01:8020/flume/failover/
a1.sinks.k1.hdfs.fileType=DataStream
a1.sinks.k1.hdfs.writeFormat=TEXT
a1.sinks.k1.hdfs.rollInterval=10
a1.sinks.k1.channel=c1
a1.sinks.k1.hdfs.filePrefix=%Y-%m-%d
```

 

#### 第四步：node03开发flume配置文件

```sh
cd /kkb/install/apache-flume-1.6.0-cdh5.14.2-bin/conf
vim collector.conf
```

 内容如下：

```sh
#set Agent name
a1.sources = r1
a1.channels = c1
a1.sinks = k1

#set channel
a1.channels.c1.type = memory
a1.channels.c1.capacity = 1000
a1.channels.c1.transactionCapacity = 100

## other node,nna to nns
a1.sources.r1.type = avro
a1.sources.r1.bind = node03
a1.sources.r1.port = 52020
a1.sources.r1.interceptors = i1
a1.sources.r1.interceptors.i1.type = static
a1.sources.r1.interceptors.i1.key = Collector
a1.sources.r1.interceptors.i1.value = node03
a1.sources.r1.channels = c1

#set sink to hdfs
a1.sinks.k1.type=hdfs
a1.sinks.k1.hdfs.path= hdfs://node01:8020/flume/failover/
a1.sinks.k1.hdfs.fileType=DataStream
a1.sinks.k1.hdfs.writeFormat=TEXT
a1.sinks.k1.hdfs.rollInterval=10
a1.sinks.k1.channel=c1
a1.sinks.k1.hdfs.filePrefix=%Y-%m-%d
```

#### 第五步：node01创建监听目录

```sh
[hadoop@node01 ~]$ cd /kkb/install/failover-dirfile/
```

#### 第六步：顺序启动flume

node03机器上面启动flume

```sh
cd /kkb/install/apache-flume-1.6.0-cdh5.14.2-bin

[hadoop@node03 apache-flume-1.6.0-cdh5.14.2-bin]$ bin/flume-ng agent -n a1 -c conf -f conf/collector.conf -Dflume.root.logger=DEBUG,console
```

node02机器上面启动flume

```sh
cd /kkb/install/apache-flume-1.6.0-cdh5.14.2-bin

[hadoop@node02 apache-flume-1.6.0-cdh5.14.2-bin]$ bin/flume-ng agent -n a1 -c conf -f conf/collector.conf -Dflume.root.logger=DEBUG,console
```

node01机器上面启动flume

```sh
cd /kkb/install/apache-flume-1.6.0-cdh5.14.2-bin

[hadoop@node01 apache-flume-1.6.0-cdh5.14.2-bin]$ bin/flume-ng agent -n agent1 -c conf -f conf/agent.conf -Dflume.root.logger=DEBUG,console
```

#### 第七步：往监听目录写入数据 

开发用于写入数据的脚本：

```sh
[hadoop@node01 ~]$ mkdir /kkb/install/myShell  
[hadoop@node01 ~]$ cd /kkb/install/myShell/
[hadoop@node01 myShell]$ vim add.sh

#!/bin/bash
while true
do
date >> /kkb/install/failover-dirfile/failtoverTest.log;
sleep 0.5;
done
```

node01机器启动脚本

```sh
sh add.sh
```

注意：写入数据必须在开启flume之后，否则可能在启动node01上的flume时，会报小错。

#### 第八步：Failover测试（故障转移）

下面我们来测试下Flume NG集群的高可用（故障转移）。

场景如下：

我们在Agent1节点上传文件，由于node02上的Collector1的权重比node03的Collector2大，所以 Collector1优先采集从node01的flume下沉过来的数据，并上传到hdfs存储系统。

然后我们kill掉node02上的Collector1，此时将会由node03上的Collector2负责日志的采集上传工作，之后，我 们手动恢复Collector1节点的Flume服务，再次在Agent1上次文件，发现Collector1又恢复了优先级别的采集工作。



## flume实战案例7：负载均衡load balancer

负载均衡是用于解决一台机器(一个进程)无法解决所有请求而产生的一种算法。Load balancing Sink Processor 能够实现 load balance 功能，如下图Agent1 是一个路由节点，负责将 Channel 暂存的 Event 均衡到对应的多个 Sink组件上，而每个 Sink 组件分别连接到一个独立的 Agent 上，示例配置，如下所示：

![img](flume.assets/clip_image026.jpg)

#### 案例需求

实现负载均衡：

![image-20200312161423777](flume.assets/image-20200312161423777.png)

 

#### 案例分析

三台机器规划如下：

node01：采集数据，发送到node02和node03机器上去

node02：接收node01的部分数据

node03：接收node01的部分数据

#### 第一步：node01开发flume配置文件

node01服务器配置：

```sh
cd /kkb/install/apache-flume-1.6.0-cdh5.14.2-bin/conf

vim load_banlancer_client.conf
```

```sh
#agent name
a1.channels = c1
a1.sources = r1
a1.sinks = k1 k2

#set channel
a1.channels.c1.type = memory
a1.channels.c1.capacity = 1000
a1.channels.c1.transactionCapacity = 100

#set source
a1.sources.r1.channels = c1
a1.sources.r1.type = TAILDIR
a1.sources.r1.positionFile = /kkb/install/apache-flume-1.6.0-cdh5.14.2-bin/loadbalancer-position.json
a1.sources.r1.filegroups = f1
a1.sources.r1.filegroups.f1 = /kkb/install/loadbalancer-dirfile/.*log.*
a1.sources.ri.maxBatchCount = 1000
#a1.sources.r1.type = exec
#a1.sources.r1.command = tail -F /kkb/install/taillogs/access_log

## set sink1
a1.sinks.k1.channel = c1
a1.sinks.k1.type = avro
a1.sinks.k1.hostname = node02
a1.sinks.k1.port = 52020

## set sink2
a1.sinks.k2.channel = c1
a1.sinks.k2.type = avro
a1.sinks.k2.hostname = node03
a1.sinks.k2.port = 52020

#set gruop
a1.sinkgroups = g1
#set sink group
a1.sinkgroups.g1.sinks = k1 k2

#set processor
a1.sinkgroups.g1.processor.type = load_balance
a1.sinkgroups.g1.processor.backoff = true
a1.sinkgroups.g1.processor.selector = round_robin
a1.sinkgroups.g1.processor.selector.maxTimeOut=10000
```

部分参数解释如下：

- processor.type = load_balance表示使用Load balancing Sink Processor(负载均衡)

- Load balancing Sink Processor可设置的参数如下：

  | Property Name                 | Default     | Description                                                  |
  | :---------------------------- | :---------- | :----------------------------------------------------------- |
  | **processor.sinks**           | –           | Space-separated list of sinks that are participating in the group |
  | **processor.type**            | default     | The component type name, needs to be load_balance            |
  | processor.backoff             | false       | Should failed sinks be backed off exponentially.`<br />`失败的sink是否启用回退。 |
  | processor.selector            | round_robin | Selection mechanism. Must be either round_robin,random or FQCN of custom class that inherits from AbstractSinkSelector |
  | processor.selector.maxTimeOut | 30000       | Used by backoff selectors to limit exponential backoff (in milliseconds) |

- processor.selector表示选择机制，round_bin表示使用轮询方式（轮流使用node02,node03对应的sink)，random表示随机选择。

 

#### 第二步：node02开发flume配置文件

```
cd /kkb/install/apache-flume-1.6.0-cdh5.14.2-bin/conf

vim load_banlancer_server.conf
```

```sh
## Name the components on this agent
a1.sources = r1
a1.sinks = k1
a1.channels = c1

## Describe/configure the source
a1.sources.r1.type = avro
a1.sources.r1.channels = c1
a1.sources.r1.bind = node02
a1.sources.r1.port = 52020

## Describe the sink
a1.sinks.k1.type = logger
 
## Use a channel which buffers events in memory
a1.channels.c1.type = memory
a1.channels.c1.capacity = 1000
a1.channels.c1.transactionCapacity = 100

## Bind the source and sink to the channel
a1.sources.r1.channels = c1
a1.sinks.k1.channel = c1
```

 部分参数解释如下：

- a1.sinks.k1.type = logger，表示使用logger sink

- logger sink: Logs event at INFO level. Typically useful for testing/debugging purpose.翻译：在INFO级别记录logs evnet，logger sink对于测试/调试很有用处

- logger sink参数：

  | Property Name | Default | Description                                                  |
  | :------------ | :------ | :----------------------------------------------------------- |
  | **channel**   | –       |                                                              |
  | **type**      | –       | The component type name, needs to be logger |
  | maxBytesToLog | 16      | Maximum number of bytes of the Event body to log             |

- logger sink通常用于调试，它不会将采集的数据存放到文件系统中，而是输出到屏幕上（详情请看第六步）。

- logger sink默认将输出到屏幕的event body限制为16字节，从而避免屏幕充斥过多内容。如果要查看event的完整内容，则需要使用其它的sink。

#### 第三步：node03开发flume配置文件

node03服务器配置

```
cd /kkb/install/apache-flume-1.6.0-cdh5.14.2-bin/conf

vim load_banlancer_server.conf
```

```sh
## Name the components on this agent
a1.sources = r1
a1.sinks = k1
a1.channels = c1

## Describe/configure the source
a1.sources.r1.type = avro
a1.sources.r1.channels = c1
a1.sources.r1.bind = node03
a1.sources.r1.port = 52020

## Describe the sink
a1.sinks.k1.type = logger

## Use a channel which buffers events in memory
a1.channels.c1.type = memory
a1.channels.c1.capacity = 1000
a1.channels.c1.transactionCapacity = 100

## Bind the source and sink to the channel
a1.sources.r1.channels = c1
a1.sinks.k1.channel = c1
```

#### 第四步：node01创建监听目录

```
mkdir /kkb/install/loadbalancer-dirfile 
```

#### 第五步：启动flume服务

启动node03的flume服务

```
cd /kkb/install/apache-flume-1.6.0-cdh5.14.2-bin

bin/flume-ng agent -n a1 -c conf -f conf/load_banlancer_server.conf -Dflume.root.logger=DEBUG,console
```

启动node02的flume服务

```
cd /kkb/install/apache-flume-1.6.0-cdh5.14.2-bin

bin/flume-ng agent -n a1 -c conf -f conf/load_banlancer_server.conf -Dflume.root.logger=DEBUG,console
```

启动node01的flume服务

```
cd /kkb/install/apache-flume-1.6.0-cdh5.14.2-bin

bin/flume-ng agent -n a1 -c conf -f conf/load_banlancer_client.conf -Dflume.root.logger=DEBUG,console
```

#### 第六步：往监听目录写入数据

因为使用logger sink的原因，从node01上采集的数据将不会被存放到hdfs等地方，但是会输出到屏幕中。

```sh
[hadoop@node01 failover-dirfile]$ cd /kkb/install/loadbalancer-dirfile/
[hadoop@node01 loadbalancer-dirfile]$ date >> LBTest.log
```

node02或者node03的屏幕会收到INFO级别信息： 

```sh
2020-03-13 01:17:04,174 (New I/O worker #1) [DEBUG - org.apache.flume.source.AvroSource.appendBatch(AvroSource.java:387)] Avro source r1: Received avro event batch of 1 events.
2020-03-13 01:17:07,060 (SinkRunner-PollingRunner-DefaultSinkProcessor) [INFO - org.apache.flume.sink.LoggerSink.process(LoggerSink.java:95)] Event: { headers:{} body: 46 72 69 20 4D 61 72 20 31 33 20 30 31 3A 31 37 Fri Mar 13 01:17 }
```

####  注意事项

1. 使用负载均衡时，假设不使用logger sink的话，采集的数据不会全部存放到同一个文件中。比如从node01下沉到不同的机器（node02,node03)的数据，不会存放到一个文件，而是两个文件，node02/node03采集的数据分别对应一个文件。
2. 使用负载均衡时，日志数据的顺序会乱（因为存放到了不同文件）。
3. 使用负载均衡时，轮询机制并不是这条event使用node02采集，下一条event就一定会使用node03采集。而是每隔一段时间换node02采集，每隔一段时间又换node03来采集。
4. 在某台机器（比如node02)值班期间,node02宕机后，node01的flume就不会向node02发送数据了，转而向node03发送数据，因此使用load balancer负载均衡时，有着高可用的特性，避免丢失数据。
5. zookeeper能不能使flume变聪明,及时发现宕机等情况，避免数据丢失？可以的。flume启动时向zk注册一个临时节点，flume宕机后，zk的临时节点就会消失，然后监听zk的flume节点有哪些，就往哪里发送数据
6. 一个文件或目录可以被多个flume agent监听。
7. 高可用和负载均衡不可同时使用



## flume实战案例8：静态拦截器使用

#### 案例需求

A、B两台日志服务机器实时生产日志主要类型为access.log、nginx.log、web.log 

现在需要把A、B 机器中的access.log、nginx.log、web.log 采集汇总到C机器上然后统一收集到hdfs中。

日志数据在hdfs中的存放目录要求为：

- /source/logs/access/采集日期/**

- /source/logs/nginx/采集日期/**

- /source/logs/web/采集日期/**

从access.log采集的数据存放到路径：/source/logs/access/采集日期/

从nginx.log采集的数据存放到路径：/source/logs/nginx/采集日期/

从web.log采集的数据存放到路径：/source/logs/web/采集日期/

<img src="flume.assets/image-20200312230157343.png" alt="image-20200312230157343" style="zoom:67%;" />

#### 案例分析1

要存到采集的数据到对应的hdfs路径，那么怎么知道采集的数据来自哪个文件夹？是来自access.log还是nginx.log还是web.log?

这时候就要用到拦截器了。首先来了解下拦截器。

#### 深入了解拦截器

####### Flume Interceptors类型：

- [Timestamp Interceptor](http://flume.apache.org/FlumeUserGuide.html#timestamp-interceptor)时间戳拦截器
- [Host Interceptor](http://flume.apache.org/FlumeUserGuide.html#host-interceptor)主机拦截器
- [Static Interceptor](http://flume.apache.org/FlumeUserGuide.html#static-interceptor)静态拦截器
- [Remove Header Interceptor](http://flume.apache.org/FlumeUserGuide.html#remove-header-interceptor)
- [UUID Interceptor](http://flume.apache.org/FlumeUserGuide.html#uuid-interceptor)
- [Morphline Interceptor](http://flume.apache.org/FlumeUserGuide.html#morphline-interceptor)
- [Search and Replace Interceptor](http://flume.apache.org/FlumeUserGuide.html#search-and-replace-interceptor)
- [Regex Filtering Interceptor](http://flume.apache.org/FlumeUserGuide.html#regex-filtering-interceptor)
- [Regex Extractor Interceptor](http://flume.apache.org/FlumeUserGuide.html#regex-extractor-interceptor)

####### 我们来了解一下静态拦截器：

静态拦截器功能：Static interceptor allows user to append a static header with static value to all events.为所有的event添加一个带有静态值的静态头部。

静态拦截器的参数

| Property Name    | Default | Description                                                  |
| :--------------- | :------ | :----------------------------------------------------------- |
| **type**         | –       | The component type name, has to be static                    |
| preserveExisting | true    | If configured header already exists, should it be preserved - true or false |
| key              | key     | Name of header that should be created                        |
| value            | value   | Static value that should be created                          |

静态拦截器使用举例:Example for agent named a1:

```sh
a1.sources = r1
a1.channels = c1
a1.sources.r1.channels =  c1
a1.sources.r1.type = seq
a1.sources.r1.interceptors = i1
a1.sources.r1.interceptors.i1.type = static
a1.sources.r1.interceptors.i1.key = datacenter
a1.sources.r1.interceptors.i1.value = NEW_YORK
```

在上面的example中，给source添加了拦截器。可以通过%{datacenter}获得值NEW_YORK。这样，每个event就会都有一个带有特定值value的header(key)，我们就可以判断采集的event来自哪个source，即哪个文件。

在实际使用中，我们可以设定多个source，然后为每个source添加不同key,value的拦截器，我们就可以准确地将采集的数据存放到不同的目录中。

#### 案例分析2

了解了拦截器后，我们就可以分配机器的角色了：

<img src="flume.assets/image-20200313092227112.png" alt="image-20200313092227112" style="zoom:67%;" />

#### 第一步：node01/02开发flume配置文件

node01与node02服务器开发同样的flume的配置文件

```sh
cd /kkb/install/apache-flume-1.6.0-cdh5.14.2-bin/conf
vim intercepte1.conf
```

```sh
## Name the components on this agent
a1.sources = r1 r2 r3
a1.sinks = k1
a1.channels = c1

## Describe source r1
a1.sources.r1.type = TAILDIR
a1.sources.r1.positionFile = /kkb/install/apache-flume-1.6.0-cdh5.14.2-bin/position1.json
a1.sources.r1.filegroups = f1
a1.sources.r1.filegroups.f1 = /kkb/install/logsFile/access.log
a1.sources.ri.maxBatchCount = 1000

a1.sources.r1.interceptors = i1
a1.sources.r1.interceptors.i1.type = static
a1.sources.r1.interceptors.i1.key = type
a1.sources.r1.interceptors.i1.value = access

## Describe source r2
a1.sources.r2.type = TAILDIR
a1.sources.r2.positionFile = /kkb/install/apache-flume-1.6.0-cdh5.14.2-bin/position2.json
a1.sources.r2.filegroups = f2
a1.sources.r2.filegroups.f2 = /kkb/install/logsFile/nginx.log
a1.sources.r2.maxBatchCount = 1000

a1.sources.r2.interceptors = i2
a1.sources.r2.interceptors.i2.type = static
a1.sources.r2.interceptors.i2.key = type
a1.sources.r2.interceptors.i2.value = nginx

## Describe source r3
a1.sources.r3.type = TAILDIR
a1.sources.r3.positionFile = /kkb/install/apache-flume-1.6.0-cdh5.14.2-bin/position3.json
a1.sources.r3.filegroups = f3
a1.sources.r3.filegroups.f3 = /kkb/install/logsFile/web.log
a1.sources.r3.maxBatchCount = 1000

a1.sources.r3.interceptors = i3
a1.sources.r3.interceptors.i3.type = static
a1.sources.r3.interceptors.i3.key = type
a1.sources.r3.interceptors.i3.value = web

## Describe the sink
a1.sinks.k1.type = avro
a1.sinks.k1.hostname = node03
a1.sinks.k1.port = 41414

## Use a channel which buffers events in memory
a1.channels.c1.type = memory
a1.channels.c1.capacity = 20000
a1.channels.c1.transactionCapacity = 10000

## Bind the source and sink to the channel
a1.sources.r1.channels = c1
a1.sources.r2.channels = c1
a1.sources.r3.channels = c1
a1.sinks.k1.channel = c1
```

#### 第二步：node03开发flume配置文件

```
cd /kkb/install/apache-flume-1.6.0-cdh5.14.2-bin/conf

vim intercept2.conf
```

```sh
a1.sources = r1
a1.sinks = k1
a1.channels = c1

#定义source
a1.sources.r1.type = avro
a1.sources.r1.bind = 192.168.52.103
a1.sources.r1.port =41414

#添加时间拦截器
a1.sources.r1.interceptors = i1
a1.sources.r1.interceptors.i1.type = org.apache.flume.interceptor.TimestampInterceptor$Builder

#定义channels
a1.channels.c1.type = memory
a1.channels.c1.capacity = 20000
a1.channels.c1.transactionCapacity = 10000

#定义sink
a1.sinks.k1.type = hdfs
a1.sinks.k1.hdfs.path=hdfs://node01:8020/source/logs/%{type}/%Y%m%d
a1.sinks.k1.hdfs.filePrefix =events
a1.sinks.k1.hdfs.fileType = DataStream
a1.sinks.k1.hdfs.writeFormat = Text
#时间类型
a1.sinks.k1.hdfs.useLocalTimeStamp = true
#生成的文件不按条数生成
a1.sinks.k1.hdfs.rollCount = 0
#生成的文件按时间生成
a1.sinks.k1.hdfs.rollInterval = 30
#生成的文件按大小生成
a1.sinks.k1.hdfs.rollSize = 10485760
#批量写入hdfs的个数
a1.sinks.k1.hdfs.batchSize = 10000
#flume操作hdfs的线程数（包括新建，写入等）
a1.sinks.k1.hdfs.threadsPoolSize=10
#操作hdfs超时时间
a1.sinks.k1.hdfs.callTimeout=30000

#组装source、channel、sink
a1.sources.r1.channels = c1
a1.sinks.k1.channel = c1
```

注意：hdfs://node01:8020/source/logs/%{type}/%Y%m%d，这是实现案例功能的关键理解点，%{type}获取不同的值，从而实现数据分类存放。

#### 第三步：node01/02创建监听目录

```sh
mkdir /kkb/install/logsFile
```

#### 第四步：顺序启动服务

node03启动flume实现数据收集

```
cd /kkb/install/apache-flume-1.6.0-cdh5.14.2-bin
bin/flume-ng agent -c conf -f conf/intercept2.conf -name a1 -Dflume.root.logger=DEBUG,console
```

node01与node02启动flume实现数据监控

```
cd /kkb/install/apache-flume-1.6.0-cdh5.14.2-bin
bin/flume-ng agent -c conf -f conf/intercepte1.conf -name a1 -Dflume.root.logger=DEBUG,console
```

#### 第五步：往监听目录写数据

在node01与node02上面开发shell脚本，模拟数据生成

```
cd /kkb/install/shells
vim addLogData.sh 
```

```sh
#!/bin/bash

while true
do 
hostname >> /kkb/install/logsFile/access.log;
hostname >> /kkb/install/logsFile/web.log;
hostname >> /kkb/install/logsFile/nginx.log;
sh
sleep 0.5;
done
```

```sh
sh addLogData.sh 
```

 

## flume实战案例9：自定义拦截器

#### 案例需求：

在数据采集之后，通过flume的拦截器，实现不需要的数据过滤掉，并将指定的第一个字段进行加密，加密之后再往hdfs上面保存

**原始数据文件user.txt**

```sh
13901007610,male,30,sing,beijing
18600000035,male,40,dance,shanghai
13366666659,male,20,Swimming,wuhan
13801179888,female,18,dance,tianjin
18511111114,male,35,sing,beijing
13718428888,female,40,Foodie,shanghai
13901057088,male,50,Basketball,taiwan
13671057777,male,60,Bodybuilding,xianggang
```

**处理前后的数据对比：**

![img](flume.assets/clip_image032.png)



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
    <groupId>org.apache.flume</groupId>
    <artifactId>flume-ng-core</artifactId>
    <version>1.6.0-cdh5.14.2</version>
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
          <!--  <verbal>true</verbal>-->
        </configuration>
      </plugin>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-shade-plugin</artifactId>
        <version>3.1.1</version>
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
                    <exclude>META-INF/*.RSA</exclude>
                  </excludes>
                </filter>
              </filters>
             <transformers>
                <transformer implementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer">
                  <mainClass></mainClass>
                </transformer>
              </transformers>
            </configuration>
          </execution>
          </executions>
      </plugin>
    </plugins>
 </build> 
```

#### 第二步：自定义flume的拦截器

```java
package com.jimmy.day01;

import com.google.common.base.Charsets;
import org.apache.flume.Context;
import org.apache.flume.Event;
import org.apache.flume.interceptor.Interceptor;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;

public class MyInterceptor implements Interceptor {
    //指定需要加密的字段的index
    private final String encrypted_field_index;
    //指定需要删除的字段的index
    private final String out_index;
    public MyInterceptor(String encrypted_field_index,String out_index){
        this.encrypted_field_index=encrypted_field_index.trim();
        this.out_index=out_index.trim();
    }


    public void initialize() {

    }

    //定义单个event拦截逻辑:

    public Event intercept(Event event) {
        //判断event是否为空
        if (event == null) {
            return null;
        }
        try {
            //获取event的body,event.getBody()返回的是一个字节数组
            String line = new String(event.getBody(), Charsets.UTF_8);
            //获取字段的数组
            String[] fields = line.split(",");
            //初始化处理后的newline为""
            String newline = "";
            //循环遍历字段的数组，根据需求对某些字段进行处理
            for (int i = 0; i < fields.length; i++) {
                //13901007610,male,30,sing,beijing
                int encryptedField = Integer.parseInt(encrypted_field_index);
                int outField = Integer.parseInt(out_index);
                if (i == encryptedField) {
                    newline = newline+md5(fields[i]) + ",";
                } else if (i != outField) {
                    newline = newline + fields[i] + ",";
                }
            }
            newline=newline.substring(0,newline.length()-1);
            event.setBody(newline.getBytes(Charsets.UTF_8));
            return event;
        } catch (Exception e) {
            return event;
        }
    }

    //定义批量event的拦截逻辑:

    public List<Event> intercept(List<Event> events) {
        List<Event> mylist=new ArrayList<Event>();
        for (Event e:events){ 
            //特别注意上面的循环条件，写的是events，不是mylist,当初就因为这里不成功很多次。
            //调用上面定义的单个event的拦截方法
            Event e1=intercept(e);
            if(e1!=null){
                mylist.add(e1);
            }
        }
        return mylist;
    }


    public void close() {

    }

    //定义一个Builder类，用于返回一个新的MyInterceptor对象
    public static class MyBuilder implements Interceptor.Builder{
        private String encrypted_field_index;
        //指定需要删除的字段的index
        private String out_index;


        public Interceptor build() {
            return new MyInterceptor(encrypted_field_index,out_index);
        }


        public void configure(Context context) {
            this.encrypted_field_index=context.getString("encrypted_field_index","");
            this.out_index=context.getString("out_index","");
        }
    }

    //定义md5加密算法
    public static String md5(String plainText) {
        //定义一个字节数组
        byte[] secretBytes = null;
        try {
            // 生成一个MD5加密计算摘要
            MessageDigest md = MessageDigest.getInstance("MD5");
            //对字符串进行加密
            md.update(plainText.getBytes());
            //获得加密后的数据
            secretBytes = md.digest();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("没有md5这个算法！");
        }
        //将加密后的数据转换为16进制数字
        String md5code = new BigInteger(1, secretBytes).toString(16);// 16进制数字
        // 如果生成数字未满32位，需要前面补0
        for (int i = 0; i < 32 - md5code.length(); i++) {
            md5code = "0" + md5code;
        }
        return md5code;
    }

}

```

#### 第三步：打包jar包

将我们的拦截器代码打成jar包放到flume的lib目录下

```sh
[hadoop@node03 lib]$ rz
rz waiting to receive.
Starting zmodem transfer.  Press Ctrl+C to cancel.
Transferring original-MyIntercept-1.0-SNAPSHOT.jar...
  100%       4 KB       4 KB/sec    00:00:01       0 Errors 
```

#### 第四步：node03开发flume配置文件

node03开发flume的配置文件

```
cd /kkb/install/apache-flume-1.6.0-cdh5.14.2-bin/conf

vim testIc.conf
```

```sh
## Name the components on this agent
a1.sources = r1
a1.sinks = k1
a1.channels = c1

#配置source
a1.sources.r1.type = TAILDIR
a1.sources.r1.positionFile = /kkb/install/apache-flume-1.6.0-cdh5.14.2-bin/userP.json
a1.sources.r1.filegroups = f1
a1.sources.r1.filegroups.f1 = /kkb/install/flumeData/user.txt
a1.sources.ri.maxBatchCount = 1000

a1.sources.r1.channels = c1
a1.sources.r1.interceptors =i1
a1.sources.r1.interceptors.i1.type =com.jimmy.day01.MyInterceptor$MyBuilder
a1.sources.r1.interceptors.i1.encrypted_field_index=0
a1.sources.r1.interceptors.i1.out_index=3

#配置channel
a1.channels.c1.type = memory
a1.channels.c1.capacity = 1000
a1.channels.c1.transactionCapacity = 100

#配置sink
a1.sinks.k1.type = hdfs
a1.sinks.k1.channel = c1
a1.sinks.k1.hdfs.path = hdfs://node01:8020/CTM/%Y-%m-%d/%H%M
a1.sinks.k1.hdfs.filePrefix = events-
a1.sinks.k1.hdfs.round = true
a1.sinks.k1.hdfs.roundValue = 10
a1.sinks.k1.hdfs.roundUnit = minute
a1.sinks.k1.hdfs.rollInterval = 5
a1.sinks.k1.hdfs.rollSize = 50
a1.sinks.k1.hdfs.rollCount = 10
a1.sinks.k1.hdfs.batchSize = 100
a1.sinks.k1.hdfs.useLocalTimeStamp = true

#生成的文件类型，默认是Sequencefile，可用DataStream，则为普通文本
a1.sinks.k1.hdfs.fileType = DataStream
```

#### 第五步：创建监听目录

```sh
mkdir /kkb/install/flumeData/
```

#### 第六步：启动flume

```sh
cd /kkb/install/apache-flume-1.6.0-cdh5.14.2-bin

bin/flume-ng agent -c conf -f conf/testIc.conf -name a1 -Dflume.root.logger=DEBUG,console
```

#### 第七步：上传测试数据

测试数据如下

```sh
cd /kkb/install/flumeData
vim user.txt
13901007610,male,30,sing,beijing
18600000035,male,40,dance,shanghai
13366666659,male,20,Swimming,wuhan
13801179888,female,18,dance,tianjin
18511111114,male,35,sing,beijing
13718428888,female,40,Foodie,shanghai
13901057088,male,50,Basketball,taiwan
13671057777,male,60,Bodybuilding,xianggang
```

查看hfds的数据，格式如下，手机号被加密了，而且第四列被删掉了。

```
4333811059aa47e54a474f29e61665f7,male,30,beijing
```



## flume实战案例10：自定义source

官方提供的source类型已经很多，但是有时候并不能满足实际开发当中的需求，此时我们就需要根据实际需求自定义某些source。如：实时监控MySQL，从MySQL中获取数据传输到HDFS或者其他存储框架，所以此时需要我们自己实现MySQLSource。

官方也提供了自定义source的接口：

官网说明：https://flume.apache.org/FlumeDeveloperGuide.html#source

#### 案例需求：

自定义flume的source，实现从mysql数据库当中获取数据，并将数据打印到控制台上面来

#### 案例分析：

思考问题：

1. 每隔多长时间采集数据库表的数据一次？-->自己定义
2. 全表采集，还是记录上一次采集位置，下次接着采集？-->使用记录的方式

<img src="flume.assets/image-20200314010004629.png" alt="image-20200314010004629" style="zoom: 80%;" />

指导思想：

1. 第一步：使用jdbc去查询mysql的数据库，查询meta表
2. 第二步：通过meta表获取到id的值
3. 第三步：通过id的值去查询student表
4. 第四步：将查询的数据放到channel里面去
5. 第五步：更新meta表

官网的自定义source example如下:

从下面的example可知，自定义mysqlsource需要继承AbstractSource类并实现Configurable和PollableSource接口。

```java
public class MySource extends AbstractSource implements Configurable, PollableSource {
  private String myProp;

  @Override
  public void configure(Context context) {
    String myProp = context.getString("myProp", "defaultValue");

    // Process the myProp value (e.g. validation, convert to another type, ...)

    // Store myProp for later retrieval by process() method
    this.myProp = myProp;
  }

  @Override
  public void start() {
    // Initialize the connection to the external client
  }

  @Override
  public void stop () {
    // Disconnect from external client and do any additional cleanup
    // (e.g. releasing resources or nulling-out field values) ..
  }

  @Override
  public Status process() throws EventDeliveryException {
    Status status = null;

    try {
      // This try clause includes whatever Channel/Event operations you want to do

      // Receive new data
      Event e = getSomeData();

      // Store the Event into this Source's associated Channel(s)
      getChannelProcessor().processEvent(e);

      status = Status.READY;
    } catch (Throwable t) {
      // Log exception, handle individual exceptions as needed

      status = Status.BACKOFF;

      // re-throw all Errors
      if (t instanceof Error) {
        throw (Error)t;
      }
    } finally {
      txn.close();
    }
    return status;
  }
}
```



#### 第一步：创建mysql数据库表

在node03启动mysql，密码是123456

```sh
[hadoop@node03 ~]$ mysql -u root -p
## 123456
```

```sql
--创建一个数据库
CREATE DATABASE IF NOT EXISTS mysqlsource DEFAULT CHARACTER SET utf8 ;

--创建一个表，用户保存拉取目标表位置的信息
CREATE TABLE mysqlsource.flume_meta (
    source_tab varchar(255) NOT NULL,
    currentIndex varchar(255) NOT NULL,
    PRIMARY KEY (source_tab)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--插入数据
insert into mysqlsource.flume_meta(source_tab,currentIndex) values ('student','4');

--创建要拉取数据的表
CREATE TABLE mysqlsource.student(
    id int(11) NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

--向student表中添加测试数据
insert into mysqlsource.student(id,name) values (1,'zhangsan'),(2,'lisi'),(3,'wangwu'),(4,'zhaoliu'); 
```

```sql
mysql> select * from mysqlsource.student;
+----+----------+
| id | name     |
+----+----------+
|  1 | zhangsan |
|  2 | lisi     |
|  3 | wangwu   |
|  4 | zhaoliu  |
+----+----------+
```



#### 第二步：创建maven工程

```xml
<repositories>
        <repository>
            <id>cloudera</id>
            <url>https://repository.cloudera.com/artifactory/cloudera-repos/</url>
        </repository>
    </repositories>

    <dependencies>
        <dependency>
            <groupId>org.apache.flume</groupId>
            <artifactId>flume-ng-core</artifactId>
            <version>1.6.0-cdh5.14.2</version>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>5.1.38</version>
        </dependency>
        <dependency>
            <groupId>org.apache.commons</groupId>
            <artifactId>commons-lang3</artifactId>
            <version>3.6</version>
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
                    <!--  <verbal>true</verbal>-->
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-shade-plugin</artifactId>
                <version>3.1.1</version>
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
                                        <exclude>META-INF/*.RSA</exclude>
                                    </excludes>
                                </filter>
                            </filters>
                            <transformers>
                                <transformer implementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer">
                                    <mainClass></mainClass>
                                </transformer>
                            </transformers>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
```

#### 第三步：添加配置文件

在我们工程的resources目录下，添加jdbc.properties

```sh
dbDriver=com.mysql.jdbc.Driver
dbUrl=jdbc:mysql://node03:3306/mysqlsource?useUnicode=true&characterEncoding=utf-8
dbUser=root
dbPassword=123456
```

<img src="flume.assets/image-20200314000055952.png" alt="image-20200314000055952" style="zoom:67%;" />

![image-20200314000139384](flume.assets/image-20200314000139384.png)

#### 第四步：定义查询mysql的工具类

这个工具类提供了很多的查询方式。

```java
package com.jimmy.day01;

import org.apache.flume.Context;
import org.apache.flume.conf.ConfigurationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.*;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

public class QueryMysql {
    private static final Logger LOG = LoggerFactory.getLogger(QueryMysql.class);

    private int runQueryDelay,   //两次查询的时间间隔
            startFrom,            //开始id
            currentIndex,       //当前id
            recordSixe = 0,        //每次查询返回结果的条数
            maxRow;                //每次查询的最大条数

    private String table,          //要操作的表
            columnsToSelect,       //用户传入的查询的列
            customQuery,          //用户传入的查询语句
            query,                 //构建的查询语句
            defaultCharsetResultSet;//编码集

    //上下文，用来获取配置文件
    private Context context;

    //为定义的变量赋值（默认值），可在flume任务的配置文件中修改
    private static final int DEFAULT_QUERY_DELAY = 10000;
    private static final int DEFAULT_START_VALUE = 0;
    private static final int DEFAULT_MAX_ROWS = 2000;
    private static final String DEFAULT_COLUMNS_SELECT = "*";
    private static final String DEFAULT_CHARSET_RESULTSET = "UTF-8";

    private static Connection conn = null;
    private static PreparedStatement ps = null;
    private static String connectionURL, connectionUserName, connectionPassword;

    //加载静态资源
    static {
        Properties p = new Properties();
        try {
            p.load(QueryMysql.class.getClassLoader().getResourceAsStream("jdbc.properties"));
            connectionURL = p.getProperty("dbUrl");
            connectionUserName = p.getProperty("dbUser");
            connectionPassword = p.getProperty("dbPassword");
            Class.forName(p.getProperty("dbDriver"));
        } catch (Exception e) {
            LOG.error(e.toString());
        }
    }

    //获取JDBC连接
    private static Connection InitConnection(String url, String user, String pw) {
        try {
            Connection conn = DriverManager.getConnection(url, user, pw);
            if (conn == null)
                throw new SQLException();
            return conn;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    //构造方法
    QueryMysql(Context context) throws ParseException {
        //初始化上下文
        this.context = context;

        //有默认值参数：获取flume任务配置文件中的参数，读不到的采用默认值
        this.columnsToSelect = context.getString("columns.to.select", DEFAULT_COLUMNS_SELECT);
        this.runQueryDelay = context.getInteger("run.query.delay", DEFAULT_QUERY_DELAY);
        this.startFrom = context.getInteger("start.from", DEFAULT_START_VALUE);
        this.defaultCharsetResultSet = context.getString("default.charset.resultset", DEFAULT_CHARSET_RESULTSET);

        //无默认值参数：获取flume任务配置文件中的参数
        this.table = context.getString("table");
        this.customQuery = context.getString("custom.query");

        connectionURL = context.getString("connection.url");
        connectionUserName = context.getString("connection.user");
        connectionPassword = context.getString("connection.password");
        conn = InitConnection(connectionURL, connectionUserName, connectionPassword);

        //校验相应的配置信息，如果没有默认值的参数也没赋值，抛出异常
        checkMandatoryProperties();
        //获取当前的id
        currentIndex = getStatusDBIndex(startFrom);
        //构建查询语句
        query = buildQuery();
    }

    //校验相应的配置信息（表，查询语句以及数据库连接的参数）
    private void checkMandatoryProperties() {
        if (table == null) {
            throw new ConfigurationException("property table not set");
        }
        if (connectionURL == null) {
            throw new ConfigurationException("connection.url property not set");
        }
        if (connectionUserName == null) {
            throw new ConfigurationException("connection.user property not set");
        }
        if (connectionPassword == null) {
            throw new ConfigurationException("connection.password property not set");
        }
    }

    //构建sql语句
    private String buildQuery() {
        String sql = "";
        //获取当前id
        currentIndex = getStatusDBIndex(startFrom);
        LOG.info(currentIndex + "");
        if (customQuery == null) {
            sql = "SELECT " + columnsToSelect + " FROM " + table;
        } else {
            sql = customQuery;
        }
        StringBuilder execSql = new StringBuilder(sql);
        //以id作为offset
        if (!sql.contains("where")) {
            execSql.append(" where ");
            execSql.append("id").append(">").append(currentIndex);
            return execSql.toString();
        } else {
            int length = execSql.toString().length();
            return execSql.toString().substring(0, length - String.valueOf(currentIndex).length()) + currentIndex;
        }
    }

    //执行查询
    List<List<Object>> executeQuery() {
        try {
            //每次执行查询时都要重新生成sql，因为id不同
            customQuery = buildQuery();
            //存放结果的集合
            List<List<Object>> results = new ArrayList<>();
            if (ps == null) {
                //初始化PrepareStatement对象
                ps = conn.prepareStatement(customQuery);
            }
            ResultSet result = ps.executeQuery(customQuery);
            while (result.next()) {
                //存放一条数据的集合（多个列）
                List<Object> row = new ArrayList<>();
                //将返回结果放入集合
                for (int i = 1; i <= result.getMetaData().getColumnCount(); i++) {
                    row.add(result.getObject(i));
                }
                results.add(row);
            }
            LOG.info("execSql:" + customQuery + "\nresultSize:" + results.size());
            return results;
        } catch (SQLException e) {
            LOG.error(e.toString());
            // 重新连接
            conn = InitConnection(connectionURL, connectionUserName, connectionPassword);
        }
        return null;
    }

    //将结果集转化为字符串，每一条数据是一个list集合，将每一个小的list集合转化为字符串
    List<String> getAllRows(List<List<Object>> queryResult) {
        List<String> allRows = new ArrayList<>();
        if (queryResult == null || queryResult.isEmpty())
            return allRows;
        StringBuilder row = new StringBuilder();
        for (List<Object> rawRow : queryResult) {
            Object value = null;
            for (Object aRawRow : rawRow) {
                value = aRawRow;
                if (value == null) {
                    row.append(",");
                } else {
                    row.append(aRawRow.toString()).append(",");
                }
            }
            allRows.add(row.toString());
            row = new StringBuilder();
        }
        return allRows;
    }

    //更新offset元数据状态，每次返回结果集后调用。必须记录每次查询的offset值，为程序中断续跑数据时使用，以id为offset
    void updateOffset2DB(int size) {
        //以source_tab做为KEY，如果不存在则插入，存在则更新（每个源表对应一条记录）
        String sql = "insert into flume_meta(source_tab,currentIndex) VALUES('"
                + this.table
                + "','" + (recordSixe += size)
                + "') on DUPLICATE key update source_tab=values(source_tab),currentIndex=values(currentIndex)";
        LOG.info("updateStatus Sql:" + sql);
        execSql(sql);
    }

    //执行sql语句
    private void execSql(String sql) {
        try {
            ps = conn.prepareStatement(sql);
            LOG.info("exec::" + sql);
            ps.execute();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    //获取当前id的offset
    private Integer getStatusDBIndex(int startFrom) {
        //从flume_meta表中查询出当前的id是多少
        String dbIndex = queryOne("select currentIndex from flume_meta where source_tab='" + table + "'");
        if (dbIndex != null) {
            return Integer.parseInt(dbIndex);
        }
        //如果没有数据，则说明是第一次查询或者数据表中还没有存入数据，返回最初传入的值
        return startFrom;
    }

    //查询一条数据的执行语句(当前id)
    private String queryOne(String sql) {
        ResultSet result = null;
        try {
            ps = conn.prepareStatement(sql);
            result = ps.executeQuery();
            while (result.next()) {
                return result.getString(1);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    //关闭相关资源
    void close() {
        try {
            ps.close();
            conn.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    int getCurrentIndex() {
        return currentIndex;
    }

    void setCurrentIndex(int newValue) {
        currentIndex = newValue;
    }

    int getRunQueryDelay() {
        return runQueryDelay;
    }

    String getQuery() {
        return query;
    }

    String getConnectionURL() {
        return connectionURL;
    }

    private boolean isCustomQuerySet() {
        return (customQuery != null);
    }

    Context getContext() {
        return context;
    }

    public String getConnectionUserName() {
        return connectionUserName;
    }

    public String getConnectionPassword() {
        return connectionPassword;
    }

    String getDefaultCharsetResultSet() {
        return defaultCharsetResultSet;
    }
}

```

#### 第五步：自定义mysqlSource类

```java
package com.jimmy.day01;

import org.apache.flume.Context;
import org.apache.flume.Event;
import org.apache.flume.EventDeliveryException;
import org.apache.flume.PollableSource;
import org.apache.flume.conf.Configurable;
import org.apache.flume.event.SimpleEvent;
import org.apache.flume.source.AbstractSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class MySqlSource extends AbstractSource implements Configurable, PollableSource {

    //打印日志
    private static final Logger LOG = LoggerFactory.getLogger(MySqlSource.class);
    //定义sqlHelper
    private QueryMysql sqlSourceHelper;

    @Override
    public long getBackOffSleepIncrement() {
        return 0;
    }

    @Override
    public long getMaxBackOffSleepInterval() {
        return 0;
    }

    @Override
    public void configure(Context context) {
        //初始化
        try {
            sqlSourceHelper = new QueryMysql(context);
        } catch (ParseException e) {
            e.printStackTrace();
        }
    }

    /**
     * 接受mysql表中的数据
     *
     * @return
     * @throws EventDeliveryException
     */
    @Override
    public PollableSource.Status process() throws EventDeliveryException {
        try {
            //查询数据表
            List<List<Object>> result = sqlSourceHelper.executeQuery();
            //存放event的集合
            List<Event> events = new ArrayList<>();
            //存放event头集合
            HashMap<String, String> header = new HashMap<>();
            //如果有返回数据，则将数据封装为event
            if (!result.isEmpty()) {
                List<String> allRows = sqlSourceHelper.getAllRows(result);
                Event event = null;
                for (String row : allRows) {
                    event = new SimpleEvent();
                    event.setBody(row.getBytes());
                    event.setHeaders(header);
                    events.add(event);
                }
                //将event写入channel
                this.getChannelProcessor().processEventBatch(events);
                //更新数据表中的offset信息
                sqlSourceHelper.updateOffset2DB(result.size());
            }
            //等待时长
            Thread.sleep(sqlSourceHelper.getRunQueryDelay());
            return Status.READY;
        } catch (InterruptedException e) {
            LOG.error("Error procesing row", e);
            return Status.BACKOFF;
        }
    }

    @Override
    public synchronized void stop() {
        LOG.info("Stopping sql source {} ...", getName());
        try {
            //关闭资源
            sqlSourceHelper.close();
        } finally {
            super.stop();
        }
    }
}
```

#### 第六步：打包jar包

将我们开发的代码，打成jar包上传到flume的lib目录下

#### 第七步：开发flume的配置文件

开发flume的配置文件

```sh
cd /kkb/install/apache-flume-1.6.0-cdh5.14.2-bin/conf

vim mysqlsource.conf
```

```sh
## Name the components on this agent
a1.sources=r1
a1.sinks=k1
a1.channels=c1

## Describe/configure the source
a1.sources.r1.type=com.kaikeba.source.MySqlSource
a1.sources.r1.connection.url=jdbc:mysql://node03:3306/mysqlsource
a1.sources.r1.connection.user=root
a1.sources.r1.connection.password=123456
a1.sources.r1.table=student
a1.sources.r1.columns.to.select=*
a1.sources.r1.start.from=0
a1.sources.r1.run.query.delay=3000

## Describe the channel
a1.channels.c1.type=memory
a1.channels.c1.capacity=1000
a1.channels.c1.transactionCapacity=100

## Describe the sink
a1.sinks.k1.type=logger

## Bind the source and sink to the channel
a1.sources.r1.channels=c1 
a1.sinks.k1.channel=c1         
```

#### 第八步：启动flume

```sh
cd /kkb/install/apache-flume-1.6.0-cdh5.14.2-bin

bin/flume-ng agent -n a1 -c conf -f conf/mysqlsource.conf -Dflume.root.logger=info,console
```

启动flume时，因为数据库表mysqlsource.student中一开始有4条数据，因此下一次采集数据的时候是使用selece * from student where id>4来进行查询采集。

![image-20200314004017869](flume.assets/image-20200314004017869.png)

#### 第九步：再次为数据库表插入数据

```sql
mysql> insert into mysqlsource.student (id,name) values(5,"rose");
```

 再次插入一条数据是，id最大值变成了5,因此下一次采集数据的时候是使用selece * from student where id>5来进行查询采集。

![image-20200314004337737](flume.assets/image-20200314004337737.png)

#### 第十步：查看meta表

启动flume时，就生成了flume_meta表，flume_meta表记录了上一次采集的位置。

```sh
mysql> show tables;
+-----------------------+
| Tables_in_mysqlsource |
+-----------------------+
| flume_meta            |
| student               |
+-----------------------+
2 rows in set (0.00 sec)

mysql> select * from flume_meta;
+------------+--------------+
| source_tab | currentIndex |
+------------+--------------+
| student    | 5            |
+------------+--------------+
```

#### 注意

我们该案例采集数据库表的数据时，不是使用全表采集策略，而是使用记录上次采集的位置，然后下次接着该位置采集的策略，这个策略有个很大的弊端，就是：

如果已经采集过的数据，被进行了修改，那么我们采集到文件系统的数据就有部分是不正确的，过时的。

这时候我们就需要改用其它工具了，如sqoop，用sqoop可以很好的解决这个问题，sqoop是一个导入导出数据的工具。

## flume面试题2

- flume可不可以做到事务性？

可以的，在哪来做，在sink里面做，因为sink涉及到保存操作。

怎么做，自定义sink来实现就行了

flume自带的sink不可实现事务性

- 实际工作当中fluem的jvm的堆内存给了多大？

4 - 8G 左右

- 如何设置堆内存？

vim flume-env.sh

export JAVA_OPTS="-Xms4096m -Xmx4096m -Dcom.sun.management.jmxremote"

## flume实战案例11：自定义sink（TODO）

#### 案例需求

官方提供的sink类型已经很多，但是有时候并不能满足实际开发当中的需求，此时我们就需要根据实际需求自定义某些sink。如：需要把接受到的数据按照规则进行过滤之后写入到某张mysql表中，所以此时需要我们自己实现MySQLSink。

官方也提供了自定义sink的接口：

官网说明：https://flume.apache.org/FlumeDeveloperGuide.html#sink

#### 案例分析

根据官方说明自定义MysqlSink需要继承AbstractSink类并实现Configurable

指导思想：

```ruby
自定义sink   extends  AbstractSource
将接受到的数据，通过自定义sink，写入到mysql表当中去
从channel里面获取数据，获取到了数据之后，写入到mysql里面去
第一步：从channel里面去获取数据
第二步：打开jdbc连接
第三步：保存数据
第四步：关闭连接
```



#### 第一步：创建mysql数据库表

```sql
-- 创建一个数据库
CREATE DATABASE IF NOT EXISTS mysqlsource DEFAULT CHARACTER SET utf8 ;
USE mysqlsource;
-- 创建一个表，用户保存拉取目标表位置的信息
CREATE TABLE mysqlsource.flume2mysql (
    id INT(11) NOT NULL AUTO_INCREMENT,
    createTime VARCHAR(64) NOT NULL,
    content VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=INNODB DEFAULT CHARSET=utf8;
```

 

#### 第二步：定义mysqlSink类

```java
package com.jimmy.day01;

import org.apache.flume.conf.Configurable;
import org.apache.flume.*;
import org.apache.flume.sink.AbstractSink;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * 自定义MysqlSink
 */
public class MysqlSink extends AbstractSink implements Configurable {
    private String mysqlurl = "";
    private String username = "";
    private String password = "";
    private String tableName = "";

    Connection con = null;

    @Override
    public Status process(){
        Status status = null;
        // Start transaction
        Channel ch = getChannel();
        Transaction txn = ch.getTransaction();
        txn.begin();
        try
        {
            Event event = ch.take();

            if (event != null)
            {
                    //获取body中的数据
                    String body = new String(event.getBody(), "UTF-8");

                    //如果日志中有以下关键字的不需要保存，过滤掉
                if(body.contains("delete") || body.contains("drop") || body.contains("alert")){
                    status = Status.BACKOFF;
                }else {

                    //存入Mysql
                    SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                    String createtime = df.format(new Date());

                    PreparedStatement stmt = con.prepareStatement("insert into " + tableName + " (createtime, content) values (?, ?)");
                    stmt.setString(1, createtime);
                    stmt.setString(2, body);
                    stmt.execute();
                    stmt.close();
                    status = Status.READY;
                }
           }else {
                    status = Status.BACKOFF;
                }

            txn.commit();
        } catch (Throwable t){
            txn.rollback();
            t.getCause().printStackTrace();
            status = Status.BACKOFF;
        } finally{
            txn.close();
        }

        return status;
    }
    /**
     * 获取配置文件中指定的参数
     * @param context
     */
    @Override
    public void configure(Context context) {
        mysqlurl = context.getString("mysqlurl");
        username = context.getString("username");
        password = context.getString("password");
        tableName = context.getString("tablename");
    }    
    
    @Override
    public synchronized void start() {
        try{
              //初始化数据库连接
            con = DriverManager.getConnection(mysqlurl, username, password);
            super.start();
            System.out.println("finish start");
        }catch (Exception ex){
            ex.printStackTrace();
        }
    }
    
    @Override
    public synchronized void stop(){
        try{
            con.close();
        }catch(SQLException e) {
            e.printStackTrace();
        }
        super.stop();
    }

}

```

#### 第三步：打包jar包

将我们的代码打成jar包上传到flume的lib目录下

#### 第四步：开发flume的配置文件

```
cd /kkb/install/apache-flume-1.6.0-cdh5.14.2-bin/conf

vim mysqlsink.conf
```

```sh
a1.sources = r1
a1.sinks = k1
a1.channels = c1
#配置source
a1.sources.r1.type = exec
a1.sources.r1.command = tail -F /kkb/install/flumeData/data.log
a1.sources.r1.channels = c1

#配置channel
a1.channels.c1.type = memory
a1.channels.c1.capacity = 1000
a1.channels.c1.transactionCapacity = 100

#配置sink
a1.sinks.k1.channel = c1
a1.sinks.k1.type = com.kaikeba.sink.MysqlSink
a1.sinks.k1.mysqlurl=jdbc:mysql://node03:3306/mysqlsource?useSSL=false
a1.sinks.k1.username=root
a1.sinks.k1.password=123456
a1.sinks.k1.tablename=flume2mysql
```

 

#### 第五步：启动flume

```
cd /kkb/install/apache-flume-1.6.0-cdh5.14.2-bin

bin/flume-ng agent -n a1 -c conf -f conf/mysqlsink.conf -Dflume.root.logger=info,console
```

 

#### 第六步：创建文件验证数据进入mysql

创建文件，验证数据进入mysql数据库

```
mkdir -p /kkb/install/flumeData

echo "helloworld" >> /kkb/install/flumeData/data.log
```

##  flume使用注意说明

#### 注意启动脚本命名的书写

 agent 的名称别写错了，后台执行加上 nohup ... &

#### channel参数

capacity：默认该通道中最大的可以存储的event数量

trasactionCapacity：channel每次最大可以从source中拿到或者送到sink中的event数量

注意：capacity > trasactionCapacity

#### 日志采集到HDFS配置说明1（sink端）

```sh
#定义sink
 a1.sinks.k1.type = hdfs
 a1.sinks.k1.hdfs.path=hdfs://node01:8020/source/logs/%{type}/%Y%m%d
 a1.sinks.k1.hdfs.filePrefix =events
 a1.sinks.k1.hdfs.fileType = DataStream
 a1.sinks.k1.hdfs.writeFormat = Text
 #时间类型
 a1.sinks.k1.hdfs.useLocalTimeStamp = true
 #生成的文件不按条数生成
 a1.sinks.k1.hdfs.rollCount = 0
 #生成的文件按时间生成
 a1.sinks.k1.hdfs.rollInterval = 0
 #生成的文件按大小生成
 a1.sinks.k1.hdfs.rollSize = 10485760
 #批量写入hdfs的个数
 a1.sinks.k1.hdfs.batchSize = 10000
 #flume操作hdfs的线程数（包括新建，写入等）
 a1.sinks.k1.hdfs.threadsPoolSize=10
 #操作hdfs超时时间
 a1.sinks.k1.hdfs.callTimeout=30000
```

#### 日志采集到HDFS配置说明2（sink端）

| **hdfs.round**  | **false** | **Should the timestamp be rounded down (if true, affects all time based   escape sequences except %t)** |
| --------------- | --------- | ------------------------------------------------------------ |
| hdfs.roundValue | 1         | Rounded down to the highest multiple of this (in the  unit configured usinghdfs.roundUnit), less than current time. |
| hdfs.roundUnit  | second    | The unit of the  round down value - second, minute or hour.  |

- round： 默认值：false 是否启用时间上的”舍弃”，这里的”舍弃”，类似于”四舍五入”

- roundValue：默认值：1 时间上进行“舍弃”的值；

- roundUnit： 默认值：seconds时间上进行”舍弃”的单位，包含：second,minute,hour


**案例一：**

```ruby
 a1.sinks.k1.hdfs.path = /flume/events/%Y-%m-%d/%H:%M/%S
 a1.sinks.k1.hdfs.round = true
 a1.sinks.k1.hdfs.roundValue = 10
 a1.sinks.k1.hdfs.roundUnit = minute
```

当时间为2015-10-16 17:38:59时候，hdfs.path依然会被解析为：

```ruby
 /flume/events/2015-10-16/17:30/00
 /flume/events/2015-10-16/17:40/00
 /flume/events/2015-10-16/17:50/00
```

 因为设置的是舍弃10分钟内的时间，因此，该目录每10分钟新生成一个。

**案例二：**

```ruby
 a1.sinks.k1.hdfs.path = /flume/events/%Y-%m-%d/%H:%M/%S
 a1.sinks.k1.hdfs.round = true
 a1.sinks.k1.hdfs.roundValue = 10
 a1.sinks.k1.hdfs.roundUnit = second
```

 现象：10秒为时间梯度生成对应的目录，目录下面包括很多小文件！！！格式如下：

```ruby
 /flume/events/2016-07-28/18:45/10
 /flume/events/2016-07-28/18:45/20
 /flume/events/2016-07-28/18:45/30
 /flume/events/2016-07-28/18:45/40
 /flume/events/2016-07-28/18:45/50
 /flume/events/2016-07-28/18:46/10
 /flume/events/2016-07-28/18:46/20
 /flume/events/2016-07-28/18:46/30
 /flume/events/2016-07-28/18:46/40
 /flume/events/2016-07-28/18:46/50
```



#### 实现数据的断点续传

断点续传：当一个flume挂掉之后重启的时候还是可以接着上一次的数据继续收集

flume在1.7版本之前使用的监控一个文件（source exec）、监控一个目录（source spooldir）都无法直接实现，flume在1.7版本之后已经集成了该功能，其本质就是记录下每一次消费的位置，把消费信息的位置保存到文件中，后续程序挂掉了再重启的时候，可以接着上一次消费的数据位置继续拉取。

example:

```sh
a1.channels = ch1
a1.sources = s1
a1.sinks = hdfs-sink1
 
 #channel
 a1.channels.ch1.type = memory
 a1.channels.ch1.capacity=10000
 a1.channels.ch1.transactionCapacity=500
 
 #source
 a1.sources.s1.channels = ch1
 #监控一个目录下的多个文件新增的内容
 a1.sources.s1.type = taildir
 
 #通过 json 格式存下每个文件消费的偏移量，避免从头消费
 a1.sources.s1.positionFile = /kkb/install/flumeData/index/taildir_position.json
 a1.sources.s1.filegroups = f1 f2 f3 
 a1.sources.s1.filegroups.f1 = /home/hadoop/taillogs/access.log
 a1.sources.s1.filegroups.f2 = /home/hadoop/taillogs/nginx.log
 a1.sources.s1.filegroups.f3 = /home/hadoop/taillogs/web.log
 a1.sources.s1.headers.f1.headerKey = access
 a1.sources.s1.headers.f2.headerKey = nginx
 a1.sources.s1.headers.f3.headerKey = web
 a1.sources.s1.fileHeader = true
 
 #sink
 a1.sinks.hdfs-sink1.channel = ch1
 a1.sinks.hdfs-sink1.type = hdfs
 a1.sinks.hdfs-sink1.hdfs.path =hdfs://node01:8020/demo/data/%{headerKey}
 a1.sinks.hdfs-sink1.hdfs.filePrefix = event_data
 a1.sinks.hdfs-sink1.hdfs.fileSuffix = .log
 a1.sinks.hdfs-sink1.hdfs.rollSize = 1048576
 a1.sinks.hdfs-sink1.hdfs.rollInterval =20
 a1.sinks.hdfs-sink1.hdfs.rollCount = 10
 a1.sinks.hdfs-sink1.hdfs.batchSize = 1500
 a1.sinks.hdfs-sink1.hdfs.round = true
 a1.sinks.hdfs-sink1.hdfs.roundUnit = minute
 a1.sinks.hdfs-sink1.hdfs.threadsPoolSize = 25
 a1.sinks.hdfs-sink1.hdfs.fileType =DataStream
 a1.sinks.hdfs-sink1.hdfs.writeFormat = Text
 a1.sinks.hdfs-sink1.hdfs.callTimeout = 60000
```

运行后生成的 taildir_position.json文件信息如下：

```json
 [
 {"inode":102626782,"pos":123,"file":"/home/hadoop/taillogs/access.log"},{"inode":102626785,"pos":123,"file":"/home/hadoop/taillogs/web.log"},{"inode":102626786,"pos":123,"file":"/home/hadoop/taillogs/nginx.log"}
 ]
```

这里inode就是标记文件的，文件名称改变，这个iNode不会变，pos记录偏移量，file就是绝对路径

#### flume的header参数配置讲解

o  vim test-header.conf  

 

```sh
#配置信息test-header.conf
 a1.channels=c1
 a1.sources=r1
 a1.sinks=k1
 
 #source
 a1.sources.r1.channels=c1
 a1.sources.r1.type= spooldir
 a1.sources.r1.spoolDir= /home/hadoop/test
 a1.sources.r1.batchSize= 100
 a1.sources.r1.inputCharset= UTF-8
 
 #是否添加一个key,来存储目录下文件的绝对路径
 a1.sources.r1.fileHeader= true
 #指定存储目录下文件的绝对路径的key
 a1.sources.r1.fileHeaderKey= mm
 #是否添加一个key，来存储目录下的文件名称
 a1.sources.r1.basenameHeader= true
 #指定存储目录下文件的名称的key
 a1.sources.r1.basenameHeaderKey= nn
 
 #channel
 a1.channels.c1.type= memory
 a1.channels.c1.capacity=10000
 a1.channels.c1.transactionCapacity=500
 
 #sink
 a1.sinks.k1.type=logger
 a1.sinks.k1.channel=c1
```

准备数据文件，添加内容

```sh
/home/hadoop/test/abc.txt
/home/hadoop/test/def.txt
```

启动flume配置

```sh
bin/flume-ng agent -n a1 -c myconf -f myconf/test-header.conf -Dflume.root.logger=info,console
```

查看控制台

```sh
Event: { headers:{mm=/home/hadoop/test/abc.txt, nn=abc.txt} body: 68 65 6C 6C 6F 20 73 70 61 72 6B        hello spark }
 19/08/30 19:23:15 INFO sink.LoggerSink: Event: { headers:{mm=/home/hadoop/test/abc.txt, nn=abc.txt} body: 68 65 6C 6C 6F 20 68 61 64 6F 6F 70       hello hadoop }
```

 