## Flink简介

学习链接：[https://github.com/flink-china/flink-training-course#18-flink-table-api-%E7%BC%96%E7%A8%8B](https://github.com/flink-china/flink-training-course#18-flink-table-api-编程)

学习链接2：https://ververica.cn/developers/special-issue/

* Apache Flink® — Stateful Computations over Data dStreams
* Apache Flink 是一个分布式**大数据处理引擎**，可对**有界数据流**和**无界数据流**进行**有状态**的计算。Flink 能在所有常见集群环境中运行，并能以内存速度和任意规模进行计算
* 官网地址：http://flink.apache.org

![flink](flink.assets/flink.png)



##### 1.1 处理无界和有界数据

任何类型的数据都可以形成一种事件流。信用卡交易、传感器测量、机器日志、网站或移动应用程序上的用户交互记录，所有这些数据都形成一种流。

数据可以被作为==无界==或者==有界==流来处理。

```
(1) 无界流 

有定义流的开始，但没有定义流的结束。它们会无休止地产生数据。无界流的数据必须持续处理，即数据被摄取后需要立刻处理。我们不能等到所有数据都到达再处理，因为输入是无限的，在任何时候输入都不会完成。处理无界数据通常要求以特定顺序摄取事件，例如事件发生的顺序，以便能够推断结果的完整性。

(2) 有界流 

==有定义流的开始，也有定义流的结束==。有界流可以在摄取所有数据后再进行计算。有界流所有数据可以被排序，所以并不需要有序摄取。有界流处理通常被称为批处理
```

![bounded-unbounded](flink.assets/bounded-unbounded.png)

**Apache Flink 擅长处理无界和有界数据集** 精确的时间控制和状态化使得 Flink 的运行时(runtime)能够运行任何处理无界流的应用。有界流则由一些专为固定大小数据集特殊设计的算法和数据结构进行内部处理，产生了出色的性能。

通俗理解：**处理无界流--》实时处理，处理有界流--》批处理，Flink既能实现实时处理也能实现批处理。**

Flink的底层执行引擎是实时处理，为什么可以实现批处理？因为Flink把批处理看成实时处理的一个特例。

##### 1.2 部署应用到任意地方

Apache Flink 是一个分布式系统，它需要计算资源来执行应用程序。Flink 集成了所有常见的集群资源管理器，例如 [Hadoop YARN](https://hadoop.apache.org/docs/stable/hadoop-yarn/hadoop-yarn-site/YARN.html)、 [Apache Mesos](https://mesos.apache.org/) 和 [Kubernetes](https://kubernetes.io/)，但同时也可以作为独立集群运行。

```
	Flink 被设计为能够很好地工作在上述每个资源管理器中，这是通过资源管理器特定(resource-manager-specific)的部署模式实现的。Flink 可以采用与当前资源管理器相适应的方式进行交互。

	部署 Flink 应用程序时，Flink 会根据应用程序配置的并行性自动标识所需的资源，并从资源管理器请求这些资源。在发生故障的情况下，Flink 通过请求新资源来替换发生故障的容器。提交或控制应用程序的所有通信都是通过 REST 调用进行的，这可以简化 Flink 与各种环境中的集成
```

通俗理解：Flink跟spark一样，本质上都是一个计算框架或者计算逻辑，只需要给资源，就可以运行任务。

##### 1.3 运行任意规模应用

Flink 旨在任意规模上运行有状态流式应用。因此，应用程序被并行化为可能数千个任务，这些任务分布在集群中并发执行。所以应用程序能够充分利用无尽的 CPU、内存、磁盘和网络 IO。而且 Flink 很容易维护非常大的应用程序状态。其异步和增量的检查点算法对处理延迟产生最小的影响，同时保证精确一次状态的一致性。

```
Flink 用户报告了其生产环境中一些令人印象深刻的扩展性数字：
	每天处理数万亿的事件
	可以维护几TB大小的状态
	可以部署上千个节点的集群
```



##### 1.4 利用内存性能

有状态的 Flink 程序针对本地状态访问进行了优化。任务的==状态始终保留在内存中==，如果状态大小超过可用内存，则会保存在能高效访问的磁盘数据结构中。任务通过访问本地（通常在内存中）状态来进行所有的计算，从而==产生非常低的处理延迟==。Flink 通过定期和异步地对本地状态进行持久化存储来保证故障场景下精确一次的状态一致性。

![local-state](flink.assets/local-state.png)





## Flink 的应用场景

  ```
	在实际生产的过程中，大量数据在不断地产生，例如金融交易数据、互联网订单数据、 GPS 定位数据、传感器信号、移动终端产生的数据、通信信号数据等，以及我们熟悉的网络 流量监控、服务器产生的日志数据，这些数据最大的共同点就是实时从不同的数据源中产生， 然后再传输到下游的分析系统。针对这些数据类型主要包括实时智能推荐、复杂事件处理、 实时欺诈检测、实时数仓与 ETL 类型、流数据分析类型、实时报表类型等实时业务场景，而 Flink 对于这些类型的场景都有着非常好的支持。
  ```

1、实时智能推荐

```
	智能推荐会根据用户历史的购买行为，通过推荐算法训练模型，预测用户未来可能会购买的物品。对个人来说，推荐系统起着信息过滤的作用，对 Web/App 服务端来说，推荐系统起着满足用户个性化需求，提升用户满意度的作用。推荐系统本身也在飞速发展，除了算法 越来越完善，对时延的要求也越来越苛刻和实时化。利用 Flink 流计算帮助用户构建更加实 时的智能推荐系统，对用户行为指标进行实时计算，对模型进行实时更新，对用户指标进行 实时预测，并将预测的信息推送给 Wep/App 端，帮助用户获取想要的商品信息，另一方面也 帮助企业提升销售额，创造更大的商业价值。
```

2、复杂事件处理

对于复杂事件处理，比较常见的案例主要集中于工业领域，例如对车载传感器、机械设 备等实时故障检测，这些业务类型通常数据量都非常大，且对数据处理的时效性要求非常高。 通过利用 Flink 提供的 CEP（复杂事件处理）进行事件模式的抽取，同时应用 Flink 的 Sql 进行事件数据的转换，在流式系统中构建实时规则引擎，一旦事件触发报警规则，便立即将 告警结果传输至下游通知系统，从而实现对设备故障快速预警监测，车辆状态监控等目的。

3、实时欺诈检测

在金融领域的业务中，常常出现各种类型的欺诈行为，例如信用卡欺诈、信贷申请欺诈等，而如何保证用户和公司的资金安全，是来近年来许多金融公司及银行共同面对的挑战。 随着不法分子欺诈手段的不断升级，传统的反欺诈手段已经不足以解决目前所面临的问题。 以往可能需要几个小时才能通过交易数据计算出用户的行为指标，然后通过规则判别出具有 欺诈行为嫌疑的用户，再进行案件调查处理，在这种情况下资金可能早已被不法分子转移， 从而给企业和用户造成大量的经济损失。而运用 Flink 流式计算技术能够在毫秒内就完成对 欺诈判断行为指标的计算，然后实时对交易流水进行规则判断或者模型预测，这样一旦检测 出交易中存在欺诈嫌疑，则直接对交易进行实时拦截，避免因为处理不及时而导致的经济损失。

4、实时数仓与 ETL

结合离线数仓，通过利用流计算诸多优势和 SQL 灵活的加工能力，对流式数据进行实时 清洗、归并、结构化处理，为离线数仓进行补充和优化。另一方面结合实时数据 ETL 处理能力，利用有状态流式计算技术，可以尽可能降低企业由于在离线数据计算过程中调度逻辑的 复杂度，高效快速地处理企业需要的统计结果，帮助企业更好地应用实时数据所分析出来的结果。

5、流数据分析

​	实时计算各类数据指标，并利用实时结果及时调整在线系统相关策略，在各类内容投放、 无线智能推送领域有大量的应用。流式计算技术将数据分析场景实时化，帮助企业做到实时化分析 Web 应用或者 App 应用的各项指标，包括 App 版本分布情况、Crash 检测和分布等， 同时提供多维度用户行为分析，支持日志自主分析，助力开发者实现基于大数据技术的精细 化运营、提升产品质量和体验、增强用户黏性。

6、实时报表分析

​	实时报表分析是近年来很多公司采用的报表统计方案之一，其中最主要的应用便是实时 大屏展示。利用流式计算实时得出的结果直接被推送到前端应用，实时显示出重要指标的变 换情况。最典型的案例便是淘宝的双十一活动，每年双十一购物节，除疯狂购物外，最引人 注目的就是天猫双十一大屏不停跳跃的成交总额。在整个计算链路中包括从天猫交易下单购 买到数据采集、数据计算、数据校验，最终落到双十一大屏上展现的全链路时间压缩在 5 秒以内，顶峰计算性能高达数三十万笔订单/秒，通过多条链路流计算备份确保万无一失。 而在其他行业，企业也在构建自己的实时报表系统，让企业能够依托于自身的业务数据，快速提取出更多的数据价值，从而更好地服务于企业运行过程中。


## Flink基本技术栈

![1563615522100](flink.assets/1563615522100.png)

> 在flink整个软件架构体系中。同样遵循着分层的架构设计理念，在降低系统耦合度的同时，也为上层用户构建flink应用提供了丰富且友好的接口。

- [ ] ==API & libraries层==

```
作为分布式数据处理框架，fink同时提供了支撑流计算和批计算的接口，同时在此基础之上抽象出不同的应用类型的组件库。
如：基于流处理的CEP（复杂事件处理库）、SQL&Table库、FlinkML(机器学习库)、Gelly(图处理库)

有流式处理API，批处理API。流式处理的支持事件处理，表操作。批处理的，支持机器学习，图计算，也支持表操作。
```

- [ ] ==Runtime核心层==

```
该层主要负责对上层的接口提供基础服务，也就是flink分布式计算的核心实现。flink底层的执行引擎。
```

- [ ] ==物理部署层==

```
该层主要涉及到flink的部署模式，目前flink支持多种部署模式：
本地 local
集群 standalone/yarn
云 GCE/EC2  谷歌云、亚马逊云
kubenetes
```



## Flink基本架构

![flink运行原理](flink.assets/flink运行原理.png)

Flink 整个系统主要由两个组件组成，分别为 JobManager 和 TaskManager，Flink 架构也遵循 Master-Slave 架构设计原则，JobManager 为 Master 节点，TaskManager 为 Worker（Slave）节点。所有组件之间的通信都是借助于Akka Framework，包括任务的状态以及 Checkpoint 触发等信息。

Flink程序中的进程通信底层是Akka，它是基于scala语言开发的一个==轻量级的RPC通信框架==。

**Client** 

```
	客户端负责将任务提交到集群，与 JobManager 构建 Akka 连接，然后将任务提交JobManager，通过和 JobManager 之间进行交互获取任务执行状态。客户端提交任务可以采用CLI 方式或者通过使用 Flink WebUI 提交，也可以在应用程序中指定 JobManager 的 RPC 网络端口构建 ExecutionEnvironment 提交 Flink 应用。
```

**JobManager** 

```
	JobManager 负责整个 Flink 集群任务的调度以及资源的管理，从客户端中获取提交的应用，然后根据集群中 TaskManager 上 TaskSlot 的使用情况，为提交的应用分配相应的 TaskSlot 资源并命令 TaskManager 启动从客户端中获取的应用。
	
	JobManager 相当于整个集群的 Master 节点，且整个集群有且只有一个活跃的 JobManager ，负责整个集群的任务管理和资源管理。
	
	JobManager 和 TaskManager 之间通过 Actor System 进行通信，获取任务执行的情况并通过 Actor System 将应用的任务执行情况发送给客户端。同时在任务执行的过程中，Flink JobManager 会触发 Checkpoint 操作，每个 TaskManager 节点 收到 Checkpoint 触发指令后，完成 Checkpoint 操作，所有的 Checkpoint 协调过程都是在 Fink JobManager 中完成。
	
	当任务完成后，Flink 会将任务执行的信息反馈给客户端，并且释放掉 TaskManager 中的资源以供下一次提交任务使用。
```

**TaskManager** 

```
	TaskManager 相当于整个集群的 Slave 节点，负责具体的任务执行和对应任务在每个节点上的资源申请和管理。客户端通过将编写好的 Flink 应用编译打包，提交到 JobManager，然后 JobManager 会根据已注册在 JobManager 中 TaskManager 的资源情况，将任务分配给有资源的 TaskManager节点，然后启动并运行任务。
	TaskManager 从 JobManager 接收需要部署的任务，然后使用 Slot 资源启动 Task，建立数据接入的网络连接，接收数据并开始数据处理。同时 TaskManager 之间的数据交互都是通过数据流的方式进行的。
	可以看出，Flink 的任务运行其实是采用多线程的方式，这和 MapReduce 多 JVM 进行的方式有很大的区别，Flink 能够极大提高 CPU 使用效率，在多个任务和 Task 之间通过 TaskSlot 方式共享系统资源，每个 TaskManager 中通过管理多个 TaskSlot 资源池进行对资源进行有效管理。
```




## Flink的源码编译（了解）

我们可以对flink的源码进行编译，方便对我们各种hadoop的版本进行适配

参见：https://blog.csdn.net/h335146502/article/details/96483310

```shell
cd /kkb/soft
编译flink-shaded包
wget  https://github.com/apache/flink-shaded/archive/release-7.0.tar.gz
tar -zxvf flink-shaded-release-7.0.tar.gz -C /kkb/install/
cd /kkb/install/flink-shaded-release-7.0/
mvn clean install -DskipTests -Dhadoop.version=2.6.0-cdh5.14.2

编译flink源码
wget http://archive.apache.org/dist/flink/flink-1.9.2/flink-1.9.2-src.tgz

tar -zxf flink-1.9.2-src.tgz -C /kkb/install/
cd /kkb/install/flink-1.9.2/
mvn -T2C clean install -DskipTests -Dfast -Pinclude-hadoop -Pvendor-repos -Dhadoop.version=2.6.0-cdh5.14.2
```



## Local模式安装（了解）

1、安装jdk，配置JAVA_HOME，建议使用jdk1.8以上

2、安装包下载地址：

https://mirrors.tuna.tsinghua.edu.cn/apache/flink/flink-1.9.2/flink-1.9.2-bin-scala_2.11.tgz

3、直接上传安装包到服务器

4、解压安装包并配置环境变量

```shell
tar -zxf flink-1.9.2-bin-scala_2.11.tgz -C /kkb/install/

配置环境变量
sudo vim /etc/profile
export FLINK_HOME=/kkb/install/flink-1.9.2
export PATH=:$FLINK_HOME/bin:$PATH
```

5、启动服务

local模式，什么配置项都不需要配，直接启动服务器即可

```shell
cd /kkb/install/flink-1.9.2
#启动flink
bin/start-cluster.sh 
#停止flink
bin/stop-cluster.sh 
```

6、Web页面浏览

http://node01:8081



## Standalone模式安装

（1）集群规划 

| 主机名 | JobManager | TaskManager |
| :----- | ---------: | :---------: |
| node01 |         是 |     是      |
| node02 |         是 |     是      |
| node03 |            |     是      |

（2）依赖 

*  jdk1.8以上，配置JAVA_HOME
*  主机之间免密码

（3）安装步骤 

```shell
node01修改以下配置文件

(a) 修改conf/flink-conf.yaml

#jobmanager地址
jobmanager.rpc.address: node01
#使用zookeeper搭建高可用
high-availability: zookeeper
##存储JobManager的元数据到HDFS
high-availability.storageDir: hdfs://node01:8020/flink
high-availability.zookeeper.quorum: node01:2181,node02:2181,node03:2181


(b) 修改conf/slaves
node01
node02
node03

(c) 修改conf/masters
node01:8081
node02:8081


(d)上传flink-shaded-hadoop-2-uber-2.7.5-10.0.jar到flink的lib目录下
将flink-shaded-hadoop-2-uber-2.7.5-10.0.jar 这个jar包上传到flink的安装目录的lib下


(e) 拷贝到其他节点
scp -r /kkb/install/flink-1.9.2 node02:/kkb/install
scp -r /kkb/install/flink-1.9.2 node03:/kkb/install


(f)：node01(JobMananger)节点启动
cd /kkb/install/flink-1.9.2
bin/start-cluster.sh

#jps
#StandaloneSessionClusterEntrypoint-->JobManager
#TaskManagerRunner-->TaskManager

(g)：访问
http://node01:8081
http://node02:8081

(h)：关闭flink集群, 在主节点上执行
cd /kkb/install/flink-1.9.2
bin/stop-cluster.sh
```

 (4) StandAlone模式需要考虑的参数 

```sh
jobmanager.heap.mb：     		jobmanager节点可用的内存大小
taskmanager.heap.mb：    		taskmanager节点可用的内存大小
taskmanager.numberOfTaskSlots：   每台taskmanager节点可用的cpu数量,TaskSlot可以理解为资源
parallelism.default：             默认情况下任务的并行度
taskmanager.tmp.dirs：            taskmanager的临时数据存储目录
```

- task slot是task manager上的计算资源。默认一个Taskmanager 只有一个slot,由参数taskmanager.numberOfTaskSlots控制，一般来说，taskmanager上的slot的数量跟该节点的cpu核数成正比，一个cpu核数对应一个task slot，它会处理一个task。

（5）可以给Flink配置环境变量：

```
export FLINK_HOME=/kkb/install/flink-1.9.2
export PATH=:$FLINK_HOME/bin
```



## Flink on Yarn模式安装

**==工作中可能不安装flink集群，会较多使用Flink on Yarn模式。==**

1. 首先安装好Hadoop（yarn）
2. 上传一个flink的包到某一个节点，配置好hadoop的环境变量就可以了

flink on yarn有两种模式。

##### 内存集中管理模式【Yarn Session】

在Yarn中初始化一个Flink集群，开辟指定的资源，之后我们提交的Flink Job都在这个Flink yarn-session中，也就是说不管提交多少个job，这些job都会共用开始时在yarn中申请的资源。==这个Flink集群会常驻在Yarn集群中，占用的资源不会释放==，除非手动停止。

![1587522616288](flink.assets/yarn-session.png)



##### 内存Job管理模式【yarn-cluster 推荐使用】

在Yarn中，每次提交job都会创建一个新的Flink集群，任务之间相互独立，互不影响并且方便管理。==任务执行完成之后创建的集群也会消失==。

![1587522665015](flink.assets/yarn-cluster.png)



#####  yarn-session模式的任务提交

【yarn-session.sh(开辟资源) + flink run(提交任务)】

1、在flink目录启动yarn-session

```shell
bin/yarn-session.sh -n 2 -tm 1024 -s 1 -d

## -n 表示申请2个容器，
## -s 表示每个容器启动多少个slot
## -tm 表示每个TaskManager申请1024M内存
## -d 表示以后台程序方式运行
```

2、使用 flink 脚本提交任务

```shell
bin/flink run examples/batch/WordCount.jar \
-input  hdfs://node01:8020/words.txt \
-output hdfs://node01:8020/output/result.txt
```

3、停止任务

```shell
yarn application -kill application_1587024622720_0001
```

yarn-session.sh 脚本参数

```sh
用法:  
 必选  
   -n,--container <arg>   分配多少个yarn容器 (=taskmanager的数量)  
 可选  
   -D <arg>                        动态属性  
   -d,--detached                   独立运行  
   -jm,--jobManagerMemory <arg>    JobManager的内存 [in MB]  
   -nm,--name                     在YARN上为一个自定义的应用设置一个名字  
   -q,--query                      显示yarn中可用的资源 (内存, cpu核数)  
   -qu,--queue <arg>               指定YARN队列.  
   -s,--slots <arg>                每个TaskManager使用的slots数量  
   -tm,--taskManagerMemory <arg>   每个TaskManager的内存 [in MB]  
   -z,--zookeeperNamespace <arg>   针对HA模式在zookeeper上创建NameSpace 
   -id,--applicationId <yarnAppId> YARN集群上的任务id，附着到一个后台运行的yarn    session中
```



#####  yarn-cluster模式的任务提交

【flink run -m yarn-cluster (开辟资源+提交任务)】

1、启动集群，执行任务

```shell
bin/flink run -m yarn-cluster -yn 2 -yjm 1024 -ytm 1024 \
examples/batch/WordCount.jar \
-input hdfs://node01:8020/words.txt \
-output hdfs://node01:8020/output1

注意：client端必须要设置YARN_CONF_DIR或者HADOOP_CONF_DIR或者HADOOP_HOME环境变量，通过这个环境变量来读取YARN和HDFS的配置信息，否则启动会失败。
```

flink run  脚本参数

```sh
run [OPTIONS] <jar-file> <arguments>  
 "run" 操作参数:  
-c,--class <classname>  如果没有在jar包中指定入口类，则需要在这里通过这个参数指定  
-m,--jobmanager <host:port>  指定需要连接的jobmanager(主节点)地址，使用这个参数可以指定一个不同于配置文件中的jobmanager  
-p,--parallelism <parallelism>   指定程序的并行度。可以覆盖配置文件中的默认值。

默认查找当前yarn集群中已有的yarn-session信息中的jobmanager【/tmp/.yarn-properties-root】：
./bin/flink run ./examples/batch/WordCount.jar -input hdfs://hostname:port/hello.txt -output hdfs://hostname:port/result1

连接指定host和port的jobmanager：
./bin/flink run -m node01:1234 ./examples/batch/WordCount.jar -input hdfs://hostname:port/hello.txt -output hdfs://hostname:port/result1

启动一个新的yarn-session：
./bin/flink run -m yarn-cluster -yn 2 ./examples/batch/WordCount.jar -input hdfs://hostname:port/hello.txt -output hdfs://hostname:port/result1
注意：yarn session命令行的选项也可以使用./bin/flink 工具获得。它们都有一个y或者yarn的前缀
例如：./bin/flink run -m yarn-cluster -yn 2 ./examples/batch/WordCount.jar 

```



##### Flink on YARN集群部署

(1) flink on yarn运行原理

![flink运行原理](flink.assets/flink运行原理.png)



![FlinkOnYarn](flink.assets/FlinkOnYarn.png)

其实==Flink on YARN部署很简单，就是只要部署好hadoop集群即可，我们只需要部署一个Flink客户端，然后从flink客户端提交Flink任务即可==。类似于spark on yarn模式。

## Flink入门案例演示

##### 案例1：实时需求分析

案例需求：实时统计每隔1秒统计最近2秒单词出现的次数

###### 创建maven工程

```xml
 <properties>
        <flink.version>1.9.2</flink.version>
        <scala.version>2.11.8</scala.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-streaming-java_2.11</artifactId>
            <version>${flink.version}</version>
        </dependency>
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-streaming-scala_2.11</artifactId>
            <version>${flink.version}</version>
        </dependency>
        <dependency>
            <groupId>org.scala-lang</groupId>
            <artifactId>scala-library</artifactId>
            <version>2.11.8</version>
        </dependency>
    </dependencies>
    <build>
        <sourceDirectory>src/main/scala</sourceDirectory>
        <testSourceDirectory>src/test/scala</testSourceDirectory>
        <plugins>
            <plugin>
                <groupId>net.alchim31.maven</groupId>
                <artifactId>scala-maven-plugin</artifactId>
                <version>3.2.2</version>
                <executions>
                    <execution>
                        <goals>
                            <goal>compile</goal>
                            <goal>testCompile</goal>
                        </goals>
                        <configuration>
                            <args>
                                <arg>-dependencyfile</arg>
                                <arg>${project.build.directory}/.scala_dependencies</arg>
                            </args>
                        </configuration>
                    </execution>
                </executions>
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

###### 实时代码开发（scala版本）

```scala
import org.apache.flink.streaming.api.scala
import org.apache.flink.streaming.api.scala.{DataStream, StreamExecutionEnvironment}

object FlinkStream {

  def main(args: Array[String]): Unit = {
    //构建流处理的环境
    val env:StreamExecutionEnvironment=StreamExecutionEnvironment.getExecutionEnvironment
    //从socket获取数据
    val sourceStream:DataStream[String]=env.socketTextStream("node01",9999);
    //导入隐式转换的包，使用scala开发Flink程序时，这步是必要的
    import org.apache.flink.api.scala._
    //对数据进行处理
    val result=sourceStream
      .flatMap(_.split(" ")) //按照空格切分
      .map((_,1))  //每个单词计为1
      .keyBy(0) //按照下标为0的单词进行分组,0表示元组的第一位(下标为0）
      .sum(1)  //按照下标为1累加相同单词出现的次数

    result.print()
    //开启任务
    env.execute("FlinkStream") //随便取个名字即可
  }
}
```

###### 本地运行

1、启动socket服务

```
nc -lk 9999
```

2、启动flink程序

3、发送 socket 数据

发送第一次数据：

```java
hadoop flink

//结果显示为：
    6> (hadoop,1)  //前面打印的数字表示处理task的线程的id编号，默认有8个线程
	5> (flink,1)
```

发送第二次数据：

```java
hadoop flink spark

//结果显示为：
	1> (spark,1)
	6> (hadoop,2)
	5> (flink,2)
```

从两次发送数据后的输出结果可以看到，flink程序能够把之前的数据累加起来，如（hadoop,1) 变成了（hadoop,2),这个就是flink的定义中的有状态，中间结果被保存起来的。

###### 集群运行

程序还可以打成jar包提交到yarn中运行

1、打成jar包，并上传到任意一台服务器，本次以node02为例：

```java
cd /kkb/soft
rz  
    //original-MyFlink-1.0-SNAPSHOT.jar
```

2、开启netcat服务

```
nc -lk 9999
```

3、运行jar包

```sh
//flink run -m yarn-cluster -yn 2 -yjm 1024 -ytm 1024 -c com.kaikeba.demo1.FlinkStream //original-flink_study-1.0-SNAPSHOT.jar 

[hadoop@node02 soft]$ flink run -m yarn-cluster -yn 2 -yjm 1024 -ytm 1024 -c com.Flink.demo.FlinkStream original-MyFlink-1.0-SNAPSHOT.jar
    
//记得配置好flink的环境变量
//运行jar包的时候，出了不少错，如下：
    1、-yjm 1024  //给yjm分配的内存大小默认不能小于600M
    2、-ytm 1024  //给ytm分配的内存大小默认不能小于600M
//运行jar包的时候，要耐心等待，很可能出现不停打印 - Deployment took more than 60 seconds. Please check if the requested resources are available in the YARN cluster的情况，多等会就行了
//出现Could not retrieve the execution result.等错误时，可以尝试重启一下netcat服务。nc -lk 999
```

4、登录node01:8088查看yarn上运行的任务：

![image-20200503170027139](flink.assets/image-20200503170027139.png)

5、点击ApplicationMaster即可跳转到Flink界面：

![image-20200503170346189](flink.assets/image-20200503170346189.png)

![image-20200503170211963](flink.assets/image-20200503170211963.png)

###### 实时代码开发（java版本）

代码开发

```java
package com.kaikeba.demo1;

import org.apache.flink.api.common.functions.FlatMapFunction;
import org.apache.flink.streaming.api.datastream.*;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.apache.flink.streaming.api.windowing.time.Time;
import org.apache.flink.util.Collector;

/**
 * java代码开发实时统计每隔1秒统计最近2秒单词出现的次数
 */
public class WindowWordCountJava {
    public static void main(String[] args) throws Exception {

        //步骤一：获取流式处理环境
        StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();

        //步骤二：获取socket数据
        DataStreamSource<String> sourceDstream = env.socketTextStream("node01", 9999);


        //步骤三：对数据进行处理
        DataStream<WordCount> wordAndOneStream = sourceDstream.flatMap(new FlatMapFunction<String, WordCount>() {
            public void flatMap(String line, Collector<WordCount> collector) throws Exception {
                String[] words = line.split(" ");
                for (String word : words) {
                    collector.collect(new WordCount(word, 1L));
                }

            }
        });


DataStream<WordCount> resultStream = wordAndOneStream
      .keyBy("word")  //按照单词分组
      .timeWindow(Time.seconds(2), Time.seconds(1)) //每隔1s统计2s的数据
      .sum("count");   //按照count字段累加结果

  //步骤四：结果打印
  resultStream.print();

   //步骤五：任务启动
  env.execute("WindowWordCountJava");
    }


    public static class WordCount{
        public String word;
        public long count;
        //记得要有这个空构建
        public WordCount(){

        }
        public WordCount(String word,long count){
            this.word = word;
            this.count = count;
        }

        @Override
        public String toString() {
            return "WordCount{" +
                    "word='" + word + '\'' +
                    ", count=" + count +
                    '}';
        }

        }
}

```

发送socket数据

```shell
#在node01上执行命令，发送数据
nc -lk 9999
```


##### 案例2：离线需求分析

```
对文件进行单词计数，统计文件当中每个单词出现的次数。
```

###### 离线代码开发（scala）

```scala
package com.kaikeba.demo1

import org.apache.flink.api.scala.{ DataSet, ExecutionEnvironment}

/**
  * scala开发flink的批处理程序
  */
object FlinkFileCount {
  def main(args: Array[String]): Unit = {

     //todo:1、构建Flink的批处理环境
    val env: ExecutionEnvironment = ExecutionEnvironment.getExecutionEnvironment

    //todo:2、读取数据文件
    val fileDataSet: DataSet[String] = env.readTextFile("e:\\words.txt","GBK")

     import org.apache.flink.api.scala._

    //todo: 3、对数据进行处理
      val resultDataSet: AggregateDataSet[(String, Int)] = fileDataSet
                                                .flatMap(x=> x.split(" "))
                                                .map(x=>(x,1))
                                                .groupBy(0)
                                                .sum(1)

    //todo: 4、打印结果
        resultDataSet.print()

    //todo: 5、保存结果到文件
       resultDataSet.writeAsText("e:\\result")

       env.execute("FlinkFileCount")
  }
}

```

## Flink并行度&Slot&Task

​	Flink的每个TaskManager为集群提供slot。==每个task slot代表了TaskManager的一个固定大小的资源子集==。 slot的数量通常与每个TaskManager节点的可用CPU内核数成比例。==一般情况下你的slot数是你每个节点的cpu的核数==。

![1587211958715](flink.assets/1587211958715.png)

#### 并行度

一个Flink程序由多个任务组成(source、transformation和 sink)。 一个任务由多个并行的实例(线程)来执行， 一个任务的并行实例 (线程) 数目就被称为该任务的并行度。

#### 并行度的设置

* 一个任务的并行度设置可以从多个级别指定
  * Operator Level（算子级别）
  * Execution Environment Level（执行环境级别）
  * Client Level（客户端级别）
  * System Level（系统级别）
* 这些并行度的优先级为 
  * Operator Level > Execution Environment Level > Client Level > System Level



###### 1、算子级别

直接在算子后面设置即可，如下图，sum(1).setParallelism(5)-->设定sum()算子的并行度为5。

注意：keyBy等涉及宽依赖，会产生shuffle，这里说的算子不包括keyBy这些。

<img src="flink.assets/1574472860477.png" alt="1574472860477" style="zoom:150%;" />

###### 2、执行环境级别

<img src="flink.assets/1574472880358.png" alt="1574472880358" style="zoom:150%;" />

###### 3、客户端级别

并行度可以在客户端将job提交到Flink时设定，对于CLI客户端，可以通过-p参数指定并行度

```shell
bin/flink run -p 10 examples/batch/WordCount.jar
```

###### 4、系统级别

在系统级可以通过设置flink-conf.yaml文件中的parallelism.default属性来指定所有执行环境的默认并行度

```yaml
parallelism.default: 1
```



#### 并行度操作演示案例1

为了方便在本地测试观察任务并行度信息，可以在本地工程添加以下依赖

```xml
<dependency>
    <groupId>org.apache.flink</groupId>
    <artifactId>flink-runtime-web_2.11</artifactId>
    <version>${flink.version}</version>
</dependency>
```

注意：**获取程序的执行环境的方式发生变化了，改为使用createLocalEnvironmentWithWebUI()来获取执行环境**。

```Scala
import org.apache.flink.streaming.api.scala.StreamExecutionEnvironment

/**
  * 本地调试并行度
  */
object TestParallelism {
    def main(args: Array[String]): Unit = {
        
        //使用createLocalEnvironmentWithWebUI方法，构建本地流式处理环境
     	//createLocalEnvironmentWithWebUI()可以让你创建一个基于本地运行的web界面
        val env: StreamExecutionEnvironment = StreamExecutionEnvironment.createLocalEnvironmentWithWebUI()
        //执行环境级别
    	//environment.setParallelism(4)
       
        import org.apache.flink.api.scala._
		
        //接受socket数据
        val sourceStream = env.socketTextStream("node01", 9999)
        val countStream = sourceStream
            .flatMap(x => x.split(" "))
            .map(x => (x, 1))
            .keyBy(0)
            .sum(1)
        countStream.print()
        env.execute()
    }
}
```

观察**localhost:8081**界面

![image-20200504045731365](flink.assets/image-20200504045731365.png)

![image-20200504052308274](flink.assets/image-20200504052308274.png)

![image-20200504052335480](flink.assets/image-20200504052335480.png)

可以发现，没有手动设置并行度时，本次程序的运行一共有13个task，其中source为1个（默认为1个），FlatMap-->Map为6个，aggregation-->sink:print to Std:Out为6个，为6个的原因是因为我们的电脑是六核处理器，所以local运行模式时，默认使用6个。

#### 并行度操作演示案例2

```scala
import org.apache.flink.streaming.api.scala.StreamExecutionEnvironment

object TestParallelism {
    def main(args: Array[String]): Unit = {
        val env: StreamExecutionEnvironment = StreamExecutionEnvironment.createLocalEnvironmentWithWebUI()
        env.setParallelism(4)
        import org.apache.flink.api.scala._
        
        val sourceStream = env.socketTextStream("node01", 9999)
        val countStream = sourceStream
            .flatMap(x => x.split(" ")).setParallelism(5)
            .map(x => (x, 1))
            .keyBy(0)
            .sum(1)
        countStream.print()
        env.execute()
    }
}
```

观察**localhost:8081**界面

![image-20200504054551718](flink.assets/image-20200504054551718.png)

![image-20200504054650656](flink.assets/image-20200504054650656.png)

![image-20200504054706102](flink.assets/image-20200504054706102.png)

## DataStream 的编程模型 

DataStream 的编程模型包括四个部分：Environment、DataSource、Transformation、Sink

![1587215224155](flink.assets/1587215224155.png)

## Flink的DataSource数据源

##### 1、基于文件

```
readTextFile(path)
读取文本文件，文件遵循TextInputFormat读取规则，逐行读取并返回。
```

案例

```scala
package com.kaikeba.demo6

import org.apache.flink.streaming.api.scala.{DataStream, StreamExecutionEnvironment}
import org.apache.flink.streaming.api.windowing.time.Time

object StreamingSourceFromFile {

  def main(args: Array[String]): Unit = {

   //构建流处理的环境
      val env: StreamExecutionEnvironment = StreamExecutionEnvironment.getExecutionEnvironment

     //从socket获取数据
       val sourceStream: DataStream[String] = env.readTextFile("e:\\words.txt")

     //导入隐式转换的包
      import org.apache.flink.api.scala._
    //对数据进行处理

    val result: DataStream[(String, Int)] = sourceStream
                           .flatMap(x => x.split(" ")) //按照空格切分
                           .map(x => (x, 1))   //每个单词计为1
                           .keyBy(0)          //按照下标为0的单词进行分组
                           .sum(1)            //按照下标为1累加相同单词出现的1


    //保存结果
    result.writeAsText("e:\\result")

    //开启任务
     env.execute("FlinkStream")
  }
}

```


##### 2、基于socket

```
socketTextStream
从socker中读取数据，元素可以通过一个分隔符切开。
```

案例

```scala
package com.kaikeba.demo1

import org.apache.flink.api.java.tuple.Tuple
import org.apache.flink.streaming.api.scala.{DataStream, StreamExecutionEnvironment, WindowedStream}
import org.apache.flink.streaming.api.windowing.time.Time
import org.apache.flink.streaming.api.windowing.windows.TimeWindow

/**
  * 使用滑动窗口
  * 每隔1秒钟统计最近2秒钟的每个单词出现的次数
  */
object FlinkStream {

  def main(args: Array[String]): Unit = {
      //构建流处理的环境
      val env: StreamExecutionEnvironment = StreamExecutionEnvironment.getExecutionEnvironment

     //从socket获取数据
       val sourceStream: DataStream[String] = env.socketTextStream("node01",9999)

     //导入隐式转换的包
      import org.apache.flink.api.scala._
    //对数据进行处理

    val result: DataStream[(String, Int)] = sourceStream
                     .flatMap(x => x.split(" ")) //按照空格切分
                     .map(x => (x, 1))   //每个单词计为1
                    .keyBy(0)          //按照下标为0的单词进行分组
                    .sum(1)            //按照下标为1累加相同单词出现的1


    //对数据进行打印
    result.print()

    //开启任务
     env.execute("FlinkStream")
  }

}

```


##### 3、基于集合

```
fromCollection(Collection)
通过collection集合创建一个数据流，集合中的所有元素必须是相同类型的。
```

案例

```scala
package com.kaikeba.demo2

import org.apache.flink.streaming.api.scala.{DataStream, StreamExecutionEnvironment}


object StreamingSourceFromCollection {
  def main(args: Array[String]): Unit = {
    val environment: StreamExecutionEnvironment = StreamExecutionEnvironment.getExecutionEnvironment

    //导入隐式转换的包
    import org.apache.flink.api.scala._

     //准备数据源--数组
     val array = Array("hello world","world spark","flink test","spark hive","test")
     val fromArray: DataStream[String] = environment.fromCollection(array)

    //  val value: DataStream[String] = environment.fromElements("hello world")
     val resultDataStream: DataStream[(String, Int)] = fromArray
                                            .flatMap(x => x.split(" "))
                                            .map(x =>(x,1))
                                            .keyBy(0)
                                            .sum(1)

    //打印
    resultDataStream.print()

    //启动
    environment.execute()


  }
}

```


##### 4、自定义输入

```
addSource 
可以实现读取第三方数据源的数据
```

自定义**单并行度数据源**

- 继承SourceFunction来自定义单并行度source

代码开发

```scala
package com.kaikeba.demo2

import org.apache.flink.streaming.api.functions.source.SourceFunction
import org.apache.flink.streaming.api.scala.{DataStream, StreamExecutionEnvironment}

/**
  * 自定义单并行度source
  *
  */
object MySourceRun {
  def main(args: Array[String]): Unit = {
      
    val environment: StreamExecutionEnvironment = StreamExecutionEnvironment.getExecutionEnvironment
    import org.apache.flink.api.scala._
      
    val getSource: DataStream[Long] = environment.addSource(new MySource).setParallelism(1)
      
    val resultStream: DataStream[Long] = getSource.filter(x => x %2 ==0)
    resultStream.setParallelism(1).print()
      
    environment.execute()
  }
}

//继承SourceFunction来自定义单并行度source
class MySource extends SourceFunction[Long] {
  private var number = 1L
  private var isRunning = true

  override def run(sourceContext: SourceFunction.SourceContext[Long]): Unit = {
    while (isRunning){
      number += 1
      sourceContext.collect(number)
      Thread.sleep(1000)
    }
  }
  override def cancel(): Unit = {
    isRunning = false
  }
}
//运行结果为：
3
5
7
9
11
...
```

自定义**多并行度数据源**

- 继承ParallelSourceFunction来自定义多并行度的source，然后将匿名内部类传入addSource()方法中。

代码开发

```scala
package com.kaikeba.demo2

import org.apache.flink.streaming.api.functions.source.{ParallelSourceFunction, SourceFunction}
import org.apache.flink.streaming.api.scala.{DataStream, StreamExecutionEnvironment}

/**
  *
  * 多并行度的source
  */
object MyMultipartSourceRun {

  def main(args: Array[String]): Unit = {
     //构建流处理环境
    val environment: StreamExecutionEnvironment = StreamExecutionEnvironment.getExecutionEnvironment
    import org.apache.flink.api.scala._
    //添加source
    val getSource: DataStream[Long] = environment.addSource(new MultipartSource).setParallelism(2)
    //处理
    val resultStream: DataStream[Long] = getSource.filter(x => x %2 ==0)
    resultStream.setParallelism(2).print()
    environment.execute()
  }
}

//继承ParallelSourceFunction来自定义多并行度的source
class MultipartSource  extends ParallelSourceFunction[Long]{
  private var number = 1L
  private var isRunning = true


  override def run(sourceContext: SourceFunction.SourceContext[Long]): Unit = {
    while(isRunning){
      number +=1
      sourceContext.collect(number)
      Thread.sleep(1000)
    }

  }

  override def cancel(): Unit = {
    isRunning = false

  }
}


```

此外系统内置提供了一批connectors，连接器会提供对应的source支持

* [Apache Kafka](https://ci.apache.org/projects/flink/flink-docs-release-1.8/dev/connectors/kafka.html) (source/sink)  **后面重点分析**
* [Apache Cassandra](https://ci.apache.org/projects/flink/flink-docs-release-1.8/dev/connectors/cassandra.html) (sink)
* [Amazon Kinesis Streams](https://ci.apache.org/projects/flink/flink-docs-release-1.8/dev/connectors/kinesis.html) (source/sink)
* [Elasticsearch](https://ci.apache.org/projects/flink/flink-docs-release-1.8/dev/connectors/elasticsearch.html) (sink)
* [Hadoop FileSystem](https://ci.apache.org/projects/flink/flink-docs-release-1.8/dev/connectors/filesystem_sink.html) (sink)
* [RabbitMQ](https://ci.apache.org/projects/flink/flink-docs-release-1.8/dev/connectors/rabbitmq.html) (source/sink)
* [Apache NiFi](https://ci.apache.org/projects/flink/flink-docs-release-1.8/dev/connectors/nifi.html) (source/sink)
* [Twitter Streaming API](https://ci.apache.org/projects/flink/flink-docs-release-1.8/dev/connectors/twitter.html) (source)

## Flink的Sink数据目标

- writeAsText()：将元素以字符串形式逐行写入，这些字符串通过调用每个元素的toString()方法来获取
- print() / printToErr()：打印每个元素的toString()方法的值到标准输出或者标准错误输出流中
- 自定义输出addSink【kafka、redis】
- 我们可以通过sink算子，将我们的数据发送到指定的地方去，例如kafka或者redis或者hbase等等，前面我们已经使用过将数据打印出来调用print()方法，接下来我们来实现自定义sink将我们的数据发送到redis里面去
  - [Apache Kafka](https://ci.apache.org/projects/flink/flink-docs-release-1.9/dev/connectors/kafka.html) (source/sink)
  - [Apache Cassandra](https://ci.apache.org/projects/flink/flink-docs-release-1.9/dev/connectors/cassandra.html) (sink)
  - [Amazon Kinesis Streams](https://ci.apache.org/projects/flink/flink-docs-release-1.9/dev/connectors/kinesis.html) (source/sink)
  - [Elasticsearch](https://ci.apache.org/projects/flink/flink-docs-release-1.9/dev/connectors/elasticsearch.html) (sink)
  - [Hadoop FileSystem](https://ci.apache.org/projects/flink/flink-docs-release-1.9/dev/connectors/filesystem_sink.html) (sink)
  - [RabbitMQ](https://ci.apache.org/projects/flink/flink-docs-release-1.9/dev/connectors/rabbitmq.html) (source/sink)
  - [Apache NiFi](https://ci.apache.org/projects/flink/flink-docs-release-1.9/dev/connectors/nifi.html) (source/sink)
  - [Twitter Streaming API](https://ci.apache.org/projects/flink/flink-docs-release-1.9/dev/connectors/twitter.html) (source)
  - [Google PubSub](https://ci.apache.org/projects/flink/flink-docs-release-1.9/dev/connectors/pubsub.html) (source/sink)

#### 案例：Flink写数据到redis中

导入flink整合redis的jar包

```xml
<dependency>
    <groupId>org.apache.bahir</groupId>
    <artifactId>flink-connector-redis_2.11</artifactId>
    <version>1.0</version>
</dependency>
```

修改配置文件redis.conf

```sh
cd /kkb/install/redis-3.2.9
vi  redis.conf

	protected-mode yes ----> protected no
	bind 127.0.0.1 -----> bind 127.0.0.1 192.168.52.101
	
注意：启动redis时，指定一下redis.conf文件，如：
[hadoop@node01 src]$ ./redis-server /kkb/install/redis-3.2.9/redis.conf 
```

代码开发

```scala
import org.apache.flink.streaming.api.scala.{DataStream, StreamExecutionEnvironment}
import org.apache.flink.streaming.connectors.redis.RedisSink
import org.apache.flink.streaming.connectors.redis.common.config.FlinkJedisPoolConfig
import org.apache.flink.streaming.connectors.redis.common.mapper.{RedisCommand, RedisCommandDescription, RedisMapper}

/**
  * flink实时程序处理保存结果到redis中
  */
object Stream2Redis {

  def main(args: Array[String]): Unit = {
    //获取程序入口类
    val executionEnvironment: StreamExecutionEnvironment = StreamExecutionEnvironment.getExecutionEnvironment

    import org.apache.flink.api.scala._
    //组织数据
    val streamSource: DataStream[String] = executionEnvironment.fromElements("1 hadoop","2 spark","3 flink")
    //将数据包装成为key,value对形式的tuple
    val tupleValue: DataStream[(String, String)] = streamSource.map(x =>(x.split(" ")(0),x.split(" ")(1)))


    val builder = new FlinkJedisPoolConfig.Builder

    //设置redis客户端参数
    builder.setHost("node01")
    builder.setPort(6379)
    builder.setTimeout(5000)
    builder.setMaxTotal(50)
    builder.setMaxIdle(10)
    builder.setMinIdle(5)

    val config: FlinkJedisPoolConfig = builder.build()

    //获取redis  sink
    val redisSink = new RedisSink[Tuple2[String,String]](config,new MyRedisMapper)

    //使用我们自定义的sink
    tupleValue.addSink(redisSink)

    //执行程序
    executionEnvironment.execute("redisSink")
  }
}

//定义一个RedisMapper类
class MyRedisMapper  extends RedisMapper[Tuple2[String,String]]{

  override def getCommandDescription: RedisCommandDescription = {
      //设置要执行的Redis命令是SET，SET是Redis的插入命令
    new RedisCommandDescription(RedisCommand.SET)


  }
    //指定key
  override def getKeyFromData(data: (String, String)): String = {
    data._1

  }

  //指定value
  override def getValueFromData(data: (String, String)): String = {
    data._2

  }
}

```

启动redis，并执行程序，然后查看redis的key与value

```sh
127.0.0.1:6379> keys *
1) "2"
2) "1"
3) "3"
4) "jimmy"
127.0.0.1:6379> get 2
"spark"
127.0.0.1:6379> get 1
"hadoop"
127.0.0.1:6379> get 3
"flink"
```

## DataStream 转换算子

通过**从一个或多个 DataStream 生成新的 DataStream 的过程被称为 Transformation 操作**。在转换过程中，每种操作类型被定义为不同的 Operator, Flink 程序能够将多个 Transformation 组成一个 DataFlow 的拓扑。 

DataStream 官网转换算子操作：

<https://ci.apache.org/projects/flink/flink-docs-release-1.10/dev/stream/operators/index.html>


##### 1、map、filter

```scala
import org.apache.flink.streaming.api.scala.{DataStream, StreamExecutionEnvironment}

object MapFilter {

  def main(args: Array[String]): Unit = {
    val environment: StreamExecutionEnvironment = StreamExecutionEnvironment.getExecutionEnvironment
    import  org.apache.flink.api.scala._
    val sourceStream: DataStream[Int] = environment.fromElements(1,2,3,4,5,6)

    val mapStream: DataStream[Int] = sourceStream.map(x =>x*10)

    val resultStream: DataStream[Int] = mapStream.filter(x => x%2 ==0)
    resultStream.print()
    
    environment.execute()
  }
}

```

##### 2、flatMap、keyBy、sum

```scala
import org.apache.flink.streaming.api.scala.{DataStream, StreamExecutionEnvironment}
import org.apache.flink.streaming.api.windowing.time.Time

/**
  * 使用滑动窗口
  * 每隔1秒钟统计最近2秒钟的每个单词出现的次数
  */
object FlinkStream {

  def main(args: Array[String]): Unit = {
    //获取程序入口类
    val environment: StreamExecutionEnvironment = StreamExecutionEnvironment.getExecutionEnvironment

    //从socket当中获取数据
    val resultDataStream: DataStream[String] = environment.socketTextStream("node01",9999)


    //导入隐式转换的包
    import org.apache.flink.api.scala._


    //对数据进行计算操作
    val resultData: DataStream[(String, Int)] = resultDataStream
      .flatMap(x => x.split(" ")) //按照空格进行切分
      .map(x => (x, 1))  //程序出现一次记做1
      .keyBy(0)  //按照下标为0的单词进行统计
      .timeWindow(Time.seconds(2), Time.seconds(1)) //每隔一秒钟计算一次前两秒钟的单词出现的次数
      .sum(1)
    resultData.print()
    //执行程序
    environment.execute()
  }

}
```

##### 3、reduce

reduce是将输入的 KeyedStream 流通过 传 入 的 用 户 自 定 义 的 ReduceFunction 滚 动 地 进 行 数 据 聚 合 处 理


```scala
package com.kaikeba.demo3

import org.apache.flink.api.java.tuple.Tuple
import org.apache.flink.streaming.api.scala.{DataStream, KeyedStream, StreamExecutionEnvironment}

object ReduceStream {

  def main(args: Array[String]): Unit = {

    val environment: StreamExecutionEnvironment = StreamExecutionEnvironment.getExecutionEnvironment
    import  org.apache.flink.api.scala._
    val sourceStream: DataStream[(String,Int)] = environment
      	.fromElements(("a",1),("a",2),("b",2),("a",3),("c",2))  

    val keyByStream: KeyedStream[(String, Int), Tuple] = sourceStream.keyBy(0)  //按照第一位分组

   val resultStream: DataStream[(String, Int)] = keyByStream.reduce((t1,t2)=>(t1._1,t1._2+t2._2))

    resultStream.print()

    environment.execute()
  }
}
```

##### 4、union

把2个流的数据进行合并，**2个流的数据类型必须保持一致**

```scala
import org.apache.flink.streaming.api.scala.{DataStream, StreamExecutionEnvironment}

/**
  * union算子
  */
object UnionStream {
  def main(args: Array[String]): Unit = {
    val environment: StreamExecutionEnvironment = StreamExecutionEnvironment.getExecutionEnvironment

    import org.apache.flink.api.scala._
    val firstStream: DataStream[String] = environment.fromCollection(Array("hello spark","hello flink"))
    val secondStream: DataStream[String] = environment.fromCollection(Array("hadoop spark","hive flink"))
    //两个流合并成为一个流，必须保证两个流当中的数据类型是一致的
    val resultStream: DataStream[String] = firstStream.union(secondStream)

    resultStream.print()
    environment.execute()
  }
}
/*运行结果为：
6> hadoop spark
2> hello flink
1> hello spark
1> hive flink
*/
```

##### 5、connect

和union类似，但是只能连接两个流，**两个流的数据类型可以不同**

```scala
package com.kaikeba.demo3

import org.apache.flink.streaming.api.functions.co.CoFlatMapFunction
import org.apache.flink.streaming.api.scala.{ConnectedStreams, DataStream, StreamExecutionEnvironment}
import org.apache.flink.util.Collector

/**
  * 和union类似，但是只能连接两个流，两个流的数据类型可以不同，
  * 会对两个流中的数据应用不同的处理方法
  */
object ConnectStream {
  def main(args: Array[String]): Unit = {
    val environment: StreamExecutionEnvironment = StreamExecutionEnvironment.getExecutionEnvironment

    environment.setParallelism(1)

    import org.apache.flink.api.scala._
    val firstStream: DataStream[String] = environment.fromCollection(Array("hello world","spark flink"))

    val secondStream: DataStream[Int] = environment.fromCollection(Array(1,2,3,4))

    //调用connect方法连接多个DataStream
    val connectStream: ConnectedStreams[String, Int] = firstStream.connect(secondStream)

    val unionStream: DataStream[Any] = connectStream.map(x => x + "abc",y => y*2)
	
    //CoFlatMapFunction[String, Int, String]，前两个是输入类型，最后一个是返回类型
    val coFlatMapStream: DataStream[String] = connectStream.flatMap(new CoFlatMapFunction[String, Int, String] {
        //对第一个流中的数据操作
      override def flatMap1(value: String, out: Collector[String]): Unit = {
        out.collect(value.toUpperCase())
      }
        //对第二个流中的数据操作
      override def flatMap2(value: Int, out: Collector[String]): Unit = {
        out.collect( value * 2 + "")
      }
    })

    unionStream.print()
    coFlatMapStream.print()

    environment.execute()
  }
}
/*运行结果为：
2> SPARK FLINK
5> 8
3> 4
4> 6
2> 2
1> HELLO WORLD
5> 8
3> hello worldabc
4> spark flinkabc
3> 4
4> 6
2> 2
*/
```

CoFlatMapFunction的源代码是：

```java
@Public
public interface CoFlatMapFunction<IN1, IN2, OUT> extends Function, Serializable {
    void flatMap1(IN1 var1, Collector<OUT> var2) throws Exception;

    void flatMap2(IN2 var1, Collector<OUT> var2) throws Exception;
}
```



##### 6、split、select

根据规则把一个数据流切分为多个流

```scala
package com.kaikeba.demo3

/**
  *  根据规则把一个数据流切分为多个流
 应用场景：
  * 可能在实际工作中，源数据流中混合了多种类似的数据，多种类型的数据处理规则不一样，所以就可以在根据一定的规则，
  * 把一个数据流切分成多个数据流，这样每个数据流就可以使用不同的处理逻辑了
  */
import java.{lang, util}

import org.apache.flink.streaming.api.collector.selector.OutputSelector
import org.apache.flink.streaming.api.scala.{DataStream, SplitStream, StreamExecutionEnvironment}

object SplitAndSelect {
  def main(args: Array[String]): Unit = {
    val environment: StreamExecutionEnvironment = StreamExecutionEnvironment.getExecutionEnvironment

    environment.setParallelism(1)

    import org.apache.flink.api.scala._
      //构建DataStream
    val firstStream: DataStream[String] = environment.fromCollection(Array("hadoop hive","spark flink"))

    val selectStream: SplitStream[String] = firstStream.split(new OutputSelector[String] {
      override def select(value: String): lang.Iterable[String] = {
        var list = new util.ArrayList[String]()
        //如果包含hello字符串
        if (value.contains("hadoop")) {
          //存放到一个叫做first的stream里面去
            list.add("first")
        }else{
          //否则存放到一个叫做second的stream里面去
           list.add("second")
        }
        list
      }
    })
    //获取first这个stream
    selectStream.select("first").print()
    environment.execute()

  }
}
/*hadoop hive*/
```



##### 7、 重分区算子

==重算子允许我们对数据进行重新分区，或者解决数据倾斜等问题==

- Random Partitioning 

  - 随机分区
    -  根据均匀分布随机分配元素（类似于random.nextInt(5)，0 - 5 在概率上是均匀的）
    -  dataStream.shuffle()

- Rebalancing 

  - 均匀分区
    - 分区元素循环，每个分区创建相等的负载。数据发生倾斜的时候可以用于性能优化。
    - 对数据集进行再平衡，重分区，消除数据倾斜
    - dataStream.rebalance()

- Rescaling：

  - 跟rebalance有点类似，**但不是全局的**，这种方式仅发生在一个单一的节点，因此没有跨网络的数据传输。

    - dataStream.rescale()

- Custom partitioning：自定义分区

  - 自定义分区需要实现Partitioner接口  
    - dataStream.partitionCustom(partitioner, "someKey")
    - 或者dataStream.partitionCustom(partitioner, 0);

- Broadcasting：广播变量，后面详细讲解





###### 4.7.1 对filter之后的数据进行重新分区

```scala
package com.kaikeba.demo4

import org.apache.flink.api.common.functions.RichMapFunction
import org.apache.flink.streaming.api.scala.{DataStream, StreamExecutionEnvironment}

/**
  *  对filter之后的数据进行重新分区
  */
object FlinkPartition {

  def main(args: Array[String]): Unit = {
    val environment: StreamExecutionEnvironment = StreamExecutionEnvironment.getExecutionEnvironment

    import org.apache.flink.api.scala._

    
    val dataStream: DataStream[Int] = environment.fromCollection(1 to 100)

    val filterStream: DataStream[Int] = dataStream.filter(x => x>10)
      //.shuffle  //随机的重新分发数据,上游的数据，随机的发送到下游的分区里面去
      //.rescale
      .rebalance //对数据重新进行分区，涉及到shuffle的过程

    val resultStream: DataStream[(Int, Int)] = filterStream.map(new RichMapFunction[Int, (Int, Int)] {
      override def map(value: Int): (Int, Int) = {
         //获取任务id，以及value	
        (getRuntimeContext.getIndexOfThisSubtask, value)
      }
    })
    resultStream.print()
    environment.execute()
  }
}

```

RichMapFunction是一个富函数，源代码如下：

```java
@Public
public abstract class RichMapFunction<IN, OUT> extends AbstractRichFunction implements MapFunction<IN, OUT> {
    private static final long serialVersionUID = 1L;

    public RichMapFunction() {
    }

    public abstract OUT map(IN var1) throws Exception;
}
```



###### 4.7.2  自定义分区策略

如果以上的几种分区方式还没法满足我们的需求，我们还可以自定义分区策略来实现数据的分区

需求

- 自定义分区策略，实现不同分区的数据发送到不同分区里面去进行处理，将包含hello的字符串发送到一个分区里面去，其他的发送到另外一个分区里面去

定义分区类

```scala
import org.apache.flink.api.common.functions.Partitioner

class Mypartitioner extends Partitioner[String]{
  override def partition(key: String, numPartitions: Int): Int = {
    print("分区个数为 "+numPartitions)
    if(key.contains("hello")){
      0
    }else{
      1
    }
  }
}
```

定义分区class类

```scala
import org.apache.flink.streaming.api.scala.{DataStream, StreamExecutionEnvironment}

object FlinkCustomerPartition {
  def main(args: Array[String]): Unit = {
    val environment: StreamExecutionEnvironment = StreamExecutionEnvironment.getExecutionEnvironment
    import  org.apache.flink.api.scala._
    //获取dataStream
    val sourceStream: DataStream[String] = environment.fromElements("hello world","spark flink","hello world","hive hadoop")
    val rePartition: DataStream[String] = sourceStream.partitionCustom(new MyPartitioner,x => x +"")
    rePartition.map(x =>{
      println("数据的key为" +  x + "线程为" + Thread.currentThread().getId)
      x
    })
    rePartition.print()
    environment.execute()
  }
}
```

Partitioner的源码如下：

```java
public interface Partitioner<K> extends java.io.Serializable, Function {

	/**
	 * Computes the partition for the given key.
	 *
	 * @param key The key.
	 * @param numPartitions The number of partitions to partition into.
	 * @return The partition index.
	 */
	int partition(K key, int numPartitions);
}
```

## DataSet 转换算子

DataSet官网转换算子操作：

https://ci.apache.org/projects/flink/flink-docs-release-1.10/dev/batch/index.html#dataset-transformations

* Map
  * 输入一个元素，然后返回一个元素，中间可以做一些清洗转换等操作

* FlatMap
  * 输入一个元素，可以返回零个，一个或者多个元素

* MapPartition
  * 类似map，一次处理一个分区的数据【如果在进行map处理的时候需要获取第三方资源链接，建议使用MapPartition】

* Filter
  * 过滤函数，对传入的数据进行判断，符合条件的数据会被留下

* Reduce
  * 对数据进行聚合操作，结合当前元素和上一次reduce返回的值进行聚合操作，然后返回一个新的值

* Aggregate
  * sum、max、min等
* Distinct
  * 返回一个数据集中去重之后的元素，data.distinct()
* Join
  * 内连接
* OuterJoin
  * 外链接

* Cross
  * 获取两个数据集的笛卡尔积
* Union
  * 返回两个数据集的总和，数据类型需要一致
* First-n
  * 获取集合中的前N个元素
* Sort Partition
  * 在本地对数据集的所有分区进行排序，通过sortPartition()的链接调用来完成对多个字段的排序

**注意：对DataSet进行操作时，不需要代码：env.execute()**

##### 5.1 mapPartition

```scala
package com.kaikeba.demo7

import org.apache.flink.api.scala.{DataSet, ExecutionEnvironment}

import scala.collection.mutable.ArrayBuffer

object MapPartitionDataSet {
  def main(args: Array[String]): Unit = {
    val environment: ExecutionEnvironment = ExecutionEnvironment.getExecutionEnvironment
    import org.apache.flink.api.scala._

    val arrayBuffer = new ArrayBuffer[String]()
    arrayBuffer.+=("hello world1")
    arrayBuffer.+=("hello world2")
    arrayBuffer.+=("hello world3")
    arrayBuffer.+=("hello world4")
    val collectionDataSet: DataSet[String] = environment.fromCollection(arrayBuffer)

    val resultPartition: DataSet[String] = collectionDataSet.mapPartition(eachPartition => {
      eachPartition.map(eachLine => {
        val returnValue = eachLine + " result"
        returnValue
      })
    })
    resultPartition.print()

  }
}
/*
hello world1result
hello world2result
hello world3result
hello world4result
*/
```

##### 5.2 distinct

```scala
package com.kaikeba.demo7

import org.apache.flink.api.scala.ExecutionEnvironment

import scala.collection.mutable.ArrayBuffer

object DistinctDataSet {
  def main(args: Array[String]): Unit = {

    val environment: ExecutionEnvironment = ExecutionEnvironment.getExecutionEnvironment
    import org.apache.flink.api.scala._

    val arrayBuffer = new ArrayBuffer[String]()
    arrayBuffer.+=("hello world1")
    arrayBuffer.+=("hello world2")
    arrayBuffer.+=("hello world3")
    arrayBuffer.+=("hello world4")

    val collectionDataSet: DataSet[String] = environment.fromCollection(arrayBuffer)

    val dsDataSet: DataSet[String] = collectionDataSet.flatMap(x => x.split(" ")).distinct()
    dsDataSet.print()

  }
}
/*
world2
world1
world3
hello
world4
*/
```

##### 5.3 join

```scala
package com.kaikeba.demo7

import org.apache.flink.api.scala.ExecutionEnvironment

import scala.collection.mutable.ArrayBuffer

object JoinDataSet {

  def main(args: Array[String]): Unit = {

    val environment: ExecutionEnvironment = ExecutionEnvironment.getExecutionEnvironment

    import org.apache.flink.api.scala._
    val array1 = ArrayBuffer((1,"张三"),(2,"李四"),(3,"王五"))
    val array2 =ArrayBuffer((1,"18"),(2,"35"),(3,"42"))

    val firstDataStream: DataSet[(Int, String)] = environment.fromCollection(array1)
    val secondDataStream: DataSet[(Int, String)] = environment.fromCollection(array2)

    val joinResult: UnfinishedJoinOperation[(Int, String), (Int, String)] = firstDataStream.join(secondDataStream)

     //where指定左边流关联的字段 ，equalTo指定与右边流相同的字段
    val resultDataSet: DataSet[(Int, String, String)] = joinResult.where(0).equalTo(0).map(x => {
      (x._1._1, x._1._2, x._2._2)
    })

    resultDataSet.print()
  }
}
/*
(1,张三,18)
(2,李四,35)
(3,王五,42)
*/
```

##### 5.4 leftOuterJoin、rightOuterJoin

```scala
package com.kaikeba.demo7

import org.apache.flink.api.common.functions.JoinFunction
import org.apache.flink.api.scala.ExecutionEnvironment

import scala.collection.mutable.ArrayBuffer

object OutJoinDataSet {

  def main(args: Array[String]): Unit = {

    val environment: ExecutionEnvironment = ExecutionEnvironment.getExecutionEnvironment

    import org.apache.flink.api.scala._
    val array1 = ArrayBuffer((1,"张三"),(2,"李四"),(3,"王五"),(4,"张飞"))
    val array2 =ArrayBuffer((1,"18"),(2,"35"),(3,"42"),(5,"50"))

    val firstDataStream: DataSet[(Int, String)] = environment.fromCollection(array1)
    val secondDataStream: DataSet[(Int, String)] = environment.fromCollection(array2)

    //左外连接
    val leftOuterJoin: UnfinishedOuterJoinOperation[(Int, String), (Int, String)] = firstDataStream.leftOuterJoin(secondDataStream)

    //where指定左边流关联的字段 ，equalTo指定与右边流相同的字段
     val leftDataSet: JoinFunctionAssigner[(Int, String), (Int, String)] = leftOuterJoin.where(0).equalTo(0)

    //对关联的数据进行函数操作
    val leftResult: DataSet[(Int, String,String)] = leftDataSet.apply(new JoinFunction[(Int, String), (Int, String), (Int,String, String)] {
      override def join(left: (Int, String), right: (Int, String)): (Int, String, String) = {
        val result = if (right == null) {
          Tuple3[Int, String, String](left._1, left._2, "null")
        } else {
          Tuple3[Int, String, String](left._1, left._2, right._2)
        }
        result
      }
    })

    leftResult.print()


    //右外连接
    val rightOuterJoin: UnfinishedOuterJoinOperation[(Int, String), (Int, String)] = firstDataStream.rightOuterJoin(secondDataStream)

    //where指定左边流关联的字段 ，equalTo指定与右边流相同的字段
    val rightDataSet: JoinFunctionAssigner[(Int, String), (Int, String)] = rightOuterJoin.where(0).equalTo(0)

    //对关联的数据进行函数操作
    val rightResult: DataSet[(Int, String,String)] = rightDataSet.apply(new JoinFunction[(Int, String), (Int, String), (Int,String, String)] {
      override def join(left: (Int, String), right: (Int, String)): (Int, String, String) = {
        val result = if (left == null) {
          Tuple3[Int, String, String](right._1, right._2, "null")
        } else {
          Tuple3[Int, String, String](right._1, right._2, left._2)
        }
        result
      }
    })

    rightResult.print()
    
  }
}

/*
(1,张三,张三)
(4,张飞,null)
(2,李四,李四)
(3,王五,王五)
(1,张三,18)
(4,张飞,null)
(2,李四,35)
(3,王五,42)
*/
```



##### 5.5 cross

```scala
package com.kaikeba.demo7

import org.apache.flink.api.scala.ExecutionEnvironment

import scala.collection.mutable.ArrayBuffer

object CrossJoinDataSet {

  def main(args: Array[String]): Unit = {
    val environment: ExecutionEnvironment = ExecutionEnvironment.getExecutionEnvironment

    import org.apache.flink.api.scala._
    val array1 = ArrayBuffer((1,"张三"),(2,"李四"),(3,"王五"),(4,"张飞"))
    val array2 =ArrayBuffer((1,"18"),(2,"35"),(3,"42"),(5,"50"))

    val firstDataStream: DataSet[(Int, String)] = environment.fromCollection(array1)
    val secondDataStream: DataSet[(Int, String)] = environment.fromCollection(array2)

    //cross笛卡尔积
    val crossDataSet: CrossDataSet[(Int, String), (Int, String)] = firstDataStream.cross(secondDataStream)

     crossDataSet.print()
  }
}

```

##### 5.6 first-n 和 sortPartition

first()用来获取前几个元素。

```scala
package com.kaikeba.demo7

import org.apache.flink.api.common.operators.Order
import org.apache.flink.api.scala.ExecutionEnvironment

import scala.collection.mutable.ArrayBuffer

object TopNAndPartition {

  def main(args: Array[String]): Unit = {

    val environment: ExecutionEnvironment = ExecutionEnvironment.getExecutionEnvironment
    import org.apache.flink.api.scala._

     //数组
    val array = ArrayBuffer((1,"张三",10),(2,"李四",20),(3,"王五",30),(3,"赵6",40))

    val collectionDataSet: DataSet[(Int, String,Int)] = environment.fromCollection(array)

     //获取前3个元素
    collectionDataSet.first(3).print()
      

    collectionDataSet
      .groupBy(0) //按照第一个字段进行分组
      .sortGroup(2,Order.DESCENDING)  //按照第三个字段进行排序
      .first(1)  //获取每组的前一个元素
      .print()

    /**
      * 不分组排序，针对所有元素进行排序，第一个元素降序，第三个元素升序
      */
    collectionDataSet.sortPartition(0,Order.DESCENDING).sortPartition(2,Order.ASCENDING).print()


  }
}

```

##### 5.7 partition分区算子

这里主要涉及到2个分区算子：

1. partitionByHash
2. partitionByRange

```scala
package com.kaikeba.demo7

import org.apache.flink.api.scala.ExecutionEnvironment

import scala.collection.mutable.ArrayBuffer

object PartitionDataSet {

  def main(args: Array[String]): Unit = {

    val environment: ExecutionEnvironment = ExecutionEnvironment.getExecutionEnvironment
    import org.apache.flink.api.scala._


    val array = ArrayBuffer((1,"hello"),
                            (2,"hello"),
                            (2,"hello"),
                            (3,"hello"),
                            (3,"hello"),
                            (3,"hello"),
                            (4,"hello"),
                            (4,"hello"),
                            (4,"hello"),
                            (4,"hello"),
                            (5,"hello"),
                            (5,"hello"),
                            (5,"hello"),
                            (5,"hello"),
                            (5,"hello"),
                            (6,"hello"),
                            (6,"hello"),
                            (6,"hello"),
                            (6,"hello"),
                            (6,"hello"),
                            (6,"hello"))
    environment.setParallelism(2)

    val sourceDataSet: DataSet[(Int, String)] = environment.fromCollection(array)

       //partitionByHash:按照指定的字段hashPartitioner分区
     sourceDataSet.partitionByHash(0).mapPartition(eachPartition => {
         eachPartition.foreach(t=>{
 println("当前线程ID为" + Thread.currentThread().getId +"============="+t._1)
         })

        eachPartition
      }).print()


     //partitionByRange：按照指定的字段进行范围分区
    sourceDataSet.partitionByRange(x => x._1).mapPartition(eachPartition =>{
      eachPartition.foreach(t=>{
println("当前线程ID为" + Thread.currentThread().getId +"============="+t._1)
      })

      eachPartition

    }).print()


  }
}
```

## Flink的dataSet  connector介绍

查看官网：https://ci.apache.org/projects/flink/flink-docs-release-1.10/dev/batch/connectors.html

#### 文件系统connector

为了从文件系统读取数据，Flink内置了对以下文件系统的支持:

| 文件系统 | Schema     | 备注                       |
| -------- | ---------- | -------------------------- |
| HDFS     | hdfs://    | Hdfs文件系统               |
| S3       | s3://      | 通过hadoop文件系统实现支持 |
| MapR     | maprfs://  | 需要用户添加jar            |
| Alluxio  | alluxio:// | 通过hadoop文件系统实现     |

 注意：**Flink允许用户使用实现org.apache.hadoop.fs.FileSystem接口的任何文件系统**。例如S3、 Google Cloud Storage Connector for Hadoop、 Alluxio、 XtreemFS、 FTP等各种文件系统

**Flink与Apache Hadoop MapReduce接口兼容**，因此允许重用Hadoop MapReduce实现的代码：

1. 使用Hadoop Writable data type
2. ==使用任何Hadoop InputFormat作为DataSource==(flink内置HadoopInputFormat)
3. ==使用任何Hadoop OutputFormat作为DataSink==(flink内置HadoopOutputFormat)
4. 使用Hadoop Mapper作为FlatMapFunction
5. 使用Hadoop Reducer作为GroupReduceFunction

#### Flink集成Hbase之数据读取

Flink也可以直接与hbase进行集成，将hbase作为Flink的source和sink等

第一步：创建hbase表并插入数据

```shell
create 'hbasesource','f1'
put 'hbasesource','0001','f1:name','zhangsan'
put 'hbasesource','0001','f1:age','18'
```

 第二步：导入整合jar包

```xml
<repositories>
    <repository>
        <id>cloudera</id>
        <url>https://repository.cloudera.com/artifactory/cloudera-repos/</url>
    </repository>
</repositories>



<dependency>
    <groupId>org.apache.flink</groupId>
    <artifactId>flink-hadoop-compatibility_2.11</artifactId>
    <version>1.9.2</version>
</dependency>
<dependency>
    <groupId>org.apache.flink</groupId>
    <artifactId>flink-shaded-hadoop2</artifactId>
<!-- 暂时没有1.9.2这个版本 -->
    <version>1.7.2</version>
</dependency>
<dependency>
    <groupId>org.apache.flink</groupId>
    <artifactId>flink-hbase_2.11</artifactId>
    <version>1.9.2</version>
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

```

第三步：开发flink集成hbase读取hbase数据

```scala
package com.kaikeba.demo8

import org.apache.flink.addons.hbase.TableInputFormat
import org.apache.flink.api.scala.ExecutionEnvironment
import org.apache.flink.configuration.Configuration
import org.apache.hadoop.hbase.{Cell, HBaseConfiguration, HConstants, TableName}
import org.apache.hadoop.hbase.client._
import org.apache.hadoop.hbase.util.Bytes
import org.apache.flink.api.java.tuple

/**
  * flink从hbase表中读取数据
  */
object FlinkReadHBase {
  def main(args: Array[String]): Unit = {

        //获取批处理的环境
       val env: ExecutionEnvironment = ExecutionEnvironment.getExecutionEnvironment

        import org.apache.flink.api.scala._

       //通过InputFormat添加数据源
       val hbaseDataSet=env.createInput(new TableInputFormat[tuple.Tuple2[String, String]] {
        //初始化配置方法
        override def configure(parameters: Configuration): Unit = {
          val conf = HBaseConfiguration.create();
          conf.set(HConstants.ZOOKEEPER_QUORUM, "node01,node02,node03")
          conf.set(HConstants.ZOOKEEPER_CLIENT_PORT, "2181")
          val conn: Connection = ConnectionFactory.createConnection(conf)
          table = classOf[HTable].cast(conn.getTable(TableName.valueOf("hbasesource")))
          scan = new Scan() {
            addFamily(Bytes.toBytes("f1"))
          }

        }

        override def getTableName: String = {
          "hbasesource"
        }

        override def getScanner: Scan = {
          scan
        }

        //封装hbase表数据
        override def mapResultToTuple(result: Result): tuple.Tuple2[String, String]  = {
          //获取rowkey
          val rowkey: String = Bytes.toString(result.getRow)
          val rawCells: Array[Cell] = result.rawCells()
          val sb = new StringBuffer()
          for (cell <- rawCells) {
            val value = Bytes.toString(cell.getValueArray, cell.getValueOffset, cell.getValueLength)
            sb.append(value).append(",")
          }
          val valueString = sb.replace(sb.length() - 1, sb.length(), "").toString
          val tuple2 = new org.apache.flink.api.java.tuple.Tuple2[String, String]
          //给元素的下标赋值
          tuple2.setField(rowkey, 0)
          tuple2.setField(valueString, 1)
          tuple2

        }

    })
    hbaseDataSet.print()


  }
}
/*运行结果为：
(0001,18,zhangsan)
*/
```

#### Flink读取数据，然后写入hbase

Flink也可以集成Hbase实现将数据写入到Hbase里面去

1. 第一种：实现OutputFormat接口

2. 第二种：继承RichSinkFunction重写父类方法

```scala
package com.kaikeba.demo8

import java.util

import org.apache.flink.api.common.io.OutputFormat
import org.apache.flink.api.scala.ExecutionEnvironment
import org.apache.flink.configuration.Configuration
import org.apache.hadoop.hbase.client._
import org.apache.hadoop.hbase.util.Bytes
import org.apache.hadoop.hbase.{HBaseConfiguration, HConstants, TableName}

/**
  * flink写数据到hbase表中
  */
object FlinkWriteHBase {

  def main(args: Array[String]): Unit = {
    val environment: ExecutionEnvironment = ExecutionEnvironment.getExecutionEnvironment
    import org.apache.flink.api.scala._
     //准备数据
    val sourceDataSet: DataSet[String] = environment.fromElements("0002,lisi,28","0003,wangwu,30")
    //使用OutputFormat接口，写数据到hbase表中
    sourceDataSet.output(new HBaseOutputFormat)
    environment.execute()

  }
}

  //定义OutputFormat接口
  class HBaseOutputFormat extends OutputFormat[String]{
    val zkServer = "node01,node02,node03"
    val port = "2181"
    var conn: Connection = null

    override def configure(parameters: Configuration): Unit = {

    }

  override def open(taskNumber: Int, numTasks: Int): Unit = {
    val config: org.apache.hadoop.conf.Configuration = HBaseConfiguration.create
    config.set(HConstants.ZOOKEEPER_QUORUM, zkServer)
    config.set(HConstants.ZOOKEEPER_CLIENT_PORT, port)
    config.setInt(HConstants.HBASE_CLIENT_OPERATION_TIMEOUT, 30000)
    config.setInt(HConstants.HBASE_CLIENT_SCANNER_TIMEOUT_PERIOD, 30000)
    conn = ConnectionFactory.createConnection(config)
  }

  //写数据的方法
  override def writeRecord(record: String): Unit ={
    val tableName: TableName = TableName.valueOf("hbasesource")
    val cf1 = "f1"
    val array: Array[String] = record.split(",")
    val put: Put = new Put(Bytes.toBytes(array(0)))
    put.addColumn(Bytes.toBytes(cf1), Bytes.toBytes("name"), Bytes.toBytes(array(1)))
    put.addColumn(Bytes.toBytes(cf1), Bytes.toBytes("age"), Bytes.toBytes(array(2)))
    val puts = new util.ArrayList[Put]()

    puts.add(put)
    //设置缓存1m，当达到1m时数据会自动刷到hbase
    val params: BufferedMutatorParams = new BufferedMutatorParams(tableName)
    //设置缓存的大小
    params.writeBufferSize(1024 * 1024)
    val mutator: BufferedMutator = conn.getBufferedMutator(params)
    mutator.mutate(puts)
    mutator.flush()
    puts.clear()
  }

  override def close(): Unit ={
    if(null != conn){
      conn.close()
    }
  }


}
```

查看hbase：

```sh
hbase(main):005:0> scan 'hbasesource'
ROW                                     COLUMN+CELL                                                                                                        
 0001                                   column=f1:age, timestamp=1588834045161, value=18                                                                   
 0001                                   column=f1:name, timestamp=1588834041347, value=zhangsan                                                            
 0002                                   column=f1:age, timestamp=1588835998956, value=28                                                                   
 0002                                   column=f1:name, timestamp=1588835998956, value=lisi                                                                
 0003                                   column=f1:age, timestamp=1588835998997, value=30                                                                   
 0003                                   column=f1:name, timestamp=1588835998997, value=wangwu                                                              
3 row(s) in 0.0230 seconds
```



## Flink之广播变量

概念

```
	广播变量允许编程人员在每台机器上保持一个只读的缓存变量，而不是传送变量的副本给tasks
广播变量创建后，它可以运行在集群中的任何function上，而不需要多次传递给集群节点。另外需要记住，不应该修改广播变量，这样才能确保每个节点获取到的值都是一致的
	一句话解释，可以理解为是一个公共的共享变量，我们可以把一个dataset 数据集广播出去，然后不同的task在节点上都能够获取到，这个数据在每个节点上只会存在一份。
	如果不使用broadcast，则在每个节点中的每个task中都需要拷贝一份dataset数据集，比较浪费内存(也就是一个节点中可能会存在多份dataset数据)。
```

用法

```scala
（1）：初始化数据
DataSet<Integer> toBroadcast = env.fromElements(1, 2, 3)

（2）：广播数据
.withBroadcastSet(toBroadcast, "broadcastSetName");

（3）：获取数据
Collection<Integer> broadcastSet = getRuntimeContext().getBroadcastVariable("broadcastSetName");

注意：
a：广播出去的变量存在于每个节点的内存中，所以这个数据集不能太大。因为广播出去的数据，会常驻内存，除非程序执行结束
b：广播变量在初始化广播出去以后不支持修改，这样才能保证每个节点的数据都是一致的。
```

案例

```scala
package com.kaikeba.demo8

import org.apache.flink.api.common.functions.RichMapFunction
import org.apache.flink.api.scala.ExecutionEnvironment
import org.apache.flink.configuration.Configuration

import scala.collection.mutable.ArrayBuffer

/**
  * flink广播变量使用案例
  */
object FlinkBroadCast {
  def main(args: Array[String]): Unit = {
    val environment: ExecutionEnvironment = ExecutionEnvironment.getExecutionEnvironment

    import org.apache.flink.api.scala._

      //准备数据集
    val userInfo =ArrayBuffer(("zs", 10),("ls", 20),("ww", 30))

     //加载数据集构建DataSet--需要广播的数据
    val userDataSet: DataSet[(String, Int)] = environment.fromCollection(userInfo)

      //原始数据
      val data = environment.fromElements("zs","ls","ww")


     //在这里需要使用到RichMapFunction获取广播变量
    val result = data.map(new RichMapFunction[String,String] {

        //定义一个list集合，用户接受open方法中获取到的广播变量
        var listData: java.util.List[(String,Int)] = null

        //定义一个map集合，存储广播变量中的内容
        var allMap  = Map[String,Int]()

          //初始化方法  可以在open方法中获取广播变量数据
        override def open(parameters: Configuration): Unit ={
            //获取广播变量(broadcastMapName)的值
          listData= getRuntimeContext.getBroadcastVariable[(String,Int)]("broadcastMapName")
          val it = listData.iterator()
          while (it.hasNext){
            val tuple = it.next()
            allMap +=(tuple._1 -> tuple._2)
          }
        }

         //使用广播变量操作数据
        override def map(name: String): String = {
          val age = allMap.getOrElse(name,20)
          name+","+age
        }
      }).withBroadcastSet(userDataSet,"broadcastMapName")


    result.print()

  }
}

```

RichMapFunction是一个富函数类，源代码如下：

```java
@Public
public abstract class RichMapFunction<IN, OUT> extends AbstractRichFunction implements MapFunction<IN, OUT> {

	private static final long serialVersionUID = 1L;

	@Override
	public abstract OUT map(IN value) throws Exception;
}
```



## Flink之Counter（计数器/累加器）

概念

```
	Accumulator即累加器，与Mapreduce counter的应用场景差不多，都能很好地观察task在运行期间的数据变化，可以在Flink job任务中的算子函数中操作累加器，但是只能在任务执行结束之后才能获得累加器的最终结果。
	Counter是一个具体的累加器(Accumulator)实现IntCounter, LongCounter 和 DoubleCounter
```

用法

```scala
(1)：创建累加器
private IntCounter numLines = new IntCounter(); 

(2)：注册累加器
getRuntimeContext().addAccumulator("num-lines", this.numLines);

(3)：使用累加器
this.numLines.add(1); 

(4)：获取累加器的结果
myJobExecutionResult.getAccumulatorResult("num-lines")

```

案例

需求：通过计数器来实现统计文件当中Exception关键字出现的次数

```java
package com.kaikeba.demo8

import org.apache.flink.api.common.accumulators.LongCounter
import org.apache.flink.api.common.functions.RichMapFunction
import org.apache.flink.api.scala.ExecutionEnvironment
import org.apache.flink.configuration.Configuration

/**
  * 通过计数器来实现统计文件当中Exception关键字出现的次数
  */
object FlinkCounterAndAccumulator {

  def main(args: Array[String]): Unit = {

    val env=ExecutionEnvironment.getExecutionEnvironment
    import org.apache.flink.api.scala._

    //统计tomcat日志当中exception关键字出现了多少次
    val sourceDataSet: DataSet[String] = env.readTextFile("E:\\catalina.out")

      sourceDataSet.map(new RichMapFunction[String,String] {
         //创建累加器
        var counter=new LongCounter()

      override def open(parameters: Configuration): Unit = {
        //注册累加器
        getRuntimeContext.addAccumulator("my-accumulator",counter)
      }

        //实现业务逻辑
      override def map(value: String): String = {
        if(value.toLowerCase().contains("exception")){
          //满足条件累加器加1
          counter.add(1)
        }
        value
      }
    }).writeAsText("E:\\test")

    val job=env.execute()

    //获取累加器，并打印累加器的值
    val count=job.getAccumulatorResult[Long]("my-accumulator")
	
	//打印
    println(count)


  }

}

```

## 分布式缓存

概念

Flink提供了一个类似于hadoop分布式缓存，可以使用户在并行函数中很方便的读取本地文件。前面讲到的广播变量是将一些共享的数据**放在TaskManager内存中**，而Distribute cache是从外部加载一个文件/目录(例如hdfs)，然后分别**复制到每一个TaskManager的本地磁盘中**。

用法

```scala
(1)：使用Flink运行环境调用registerCachedFile注册一个分布式缓存
env.registerCachedFile("hdfs:///path/to/your/file", "hdfsFile")  

(2): 获取分布式缓存
File myFile = getRuntimeContext().getDistributedCache().getFile("hdfsFile");
```

案例

```scala
package com.kaikeba.demo8


import java.util

import org.apache.commons.io.FileUtils
import org.apache.flink.api.common.functions.RichMapFunction
import org.apache.flink.api.scala.ExecutionEnvironment
import org.apache.flink.configuration.Configuration

import scala.io.Source

/**
  * flink的分布式缓存使用
  */
object FlinkDistributedCache {

  def main(args: Array[String]): Unit = {

      val env = ExecutionEnvironment.getExecutionEnvironment
      import org.apache.flink.api.scala._

      //准备数据集
      val scoreDataSet  = env.fromElements((1, "语文", 50),(2, "数学", 60), (3, "英文", 80))

      //todo:1、注册分布式缓存文件
      env.registerCachedFile("E:\\distribute_cache_student.txt","student")

    //对成绩数据集进行map转换，将（学生ID, 学科, 分数）转换为（学生姓名，学科，分数）
    val result: DataSet[(String, String, Int)] = scoreDataSet.map(new RichMapFunction[(Int, String, Int), (String, String, Int)] {

      var list: List[(Int, String)] = _

      //初始化方法
      override def open(parameters: Configuration): Unit = {

        //获取分布式缓存的文件
        val file = getRuntimeContext.getDistributedCache.getFile("student")

        //获取文件的内容
         import scala.collection.JavaConverters._
         val listData: List[String] = FileUtils.readLines(file).asScala.toList
        //将文本转换为元组（学生ID，学生姓名)
        list = listData.map {
          line =>{
            val array = line.split(",")
            (array(0).toInt, array(1))
          }
        }

      }


      //在map方法中使用分布式缓存数据进行转换
      override def map(value: (Int, String, Int)): (String, String, Int) = {
        //获取学生id
        val studentId: Int = value._1
        val studentName: String = list.filter(x => studentId == x._1)(0)._2

        //封装结果返回
        // 将成绩数据(学生ID，学科，成绩) -> (学生姓名，学科，成绩)
        (studentName, value._2, value._3)

      }
    })

     result.print()


    }
}

```



## Flink的task之间传输数据方式以及Operator Chain

Operator是算子的意思。

#### 数据传输的方式

* forward strategy

  * 转发策略

  ```
  （1） 一个 task 的输出只发送给一个 task 作为输入
  （2） 如果两个 task 都在一个 JVM 中的话，那么就可以避免网络开销
  ```

![1587367817075](flink.assets/1587367817075.png)



* key-based strategy 

  * 基于键的策略

  ```sh
  （1）数据需要按照某个属性(我们称为 key)进行分组(或者说分区)
  （2）相同key的数据需要传输给同一个task，在一个task中进行处理
  ```

![1587368188020](flink.assets/1587368188020.png)

 

* broadcast strategy

  * 广播策略

  ```
  （1）数据随机的从一个task中传输给下一个operator所有的subtask。因为这种策略涉及数据复制和网络通信，所以成本相当高。
  ```

![1587368455285](flink.assets/1587368455285.png)



* random strategy

  * 随机策略

  ```
  （1）数据随机的从一个task中传输给下一个operator所有的subtask
  （2）保证数据能均匀的传输给所有的subtask,以便在任务之间均匀地分配负载
  ```

![1587368734607](flink.assets/1587368734607.png)

PS: 

 **转发与随机策略是基于key-based策略的**；转发策略和随机策略也可以看作是基于键的策略的变体，其中前者保存上游元组的键，而后者执行键的随机重新分配。

#### Operator Chain

概念

```
	operator chain是指将满足一定条件的operator链在一起，放在同一个task里面执行，是Flink任务优化的一种方式，在同一个task里面的operator的数据传输变成函数调用关系，它能减少线程之间的切换，减少消息的序列化/反序列化，减少数据在缓冲区的交换，减少了延迟的同时提高整体的吞吐量。
	
	常见的chain，例如：source->map->filter，这样的任务链可以chain在一起，那么其内部是如何决定是否能够chain在一起的呢？
```

Operator Chain的条件

```
（1） 数据传输策略是 forward strategy
（2） 在同一个TaskManager中运行
```

在我们的单词技术统计程序当中，设置对应的并行度，便会发生operator chain这个动作了

![1587380754504](flink.assets/1587380754504.png)

![1587380798047](flink.assets/1587380798047.png)

![1587380857265](flink.assets/1587380857265.png)

![1587378064113](flink.assets/1587378064113.png)



## Flink的State

##### 1.1 state概述

**Apache Flink® — Stateful Computations over Data Streams**

Flink 是一个默认就有状态的分析引擎，前面的WordCount 案例可以做到单词的数量的累加，其实是因为在内存中保证了每个单词的出现的次数，这些数据其实就是状态数据。但是如果一个 Task 在处理过程中挂掉了，那么它在内存中的状态都会丢失，所有的数据都需要重新计算。从容错和消息处理的语义（**At -least-once 和 Exactly-once**）上来说，Flink引入了State 和 CheckPoint。

State一般指一个具体的 Task/Operator 的状态，**State数据默认保存在 Java 的堆内存中**

回顾单词计数的例子

```scala
package com.kaikeba.demo1

import org.apache.flink.api.java.tuple.Tuple
import org.apache.flink.streaming.api.scala.{DataStream, StreamExecutionEnvironment, WindowedStream}
import org.apache.flink.streaming.api.windowing.time.Time
import org.apache.flink.streaming.api.windowing.windows.TimeWindow

/**
  * 使用滑动窗口
  * 每隔1秒钟统计最近2秒钟的每个单词出现的次数
  */
object FlinkStream {

  def main(args: Array[String]): Unit = {
      //构建流处理的环境
      val env: StreamExecutionEnvironment = StreamExecutionEnvironment.getExecutionEnvironment

  //从socket获取数据
val sourceStream: DataStream[String] = env.socketTextStream("node01",9999)
 //导入隐式转换的包
  import org.apache.flink.api.scala._
 
 //对数据进行处理
  val result: DataStream[(String, Int)] = sourceStream
                                .flatMap(x => x.split(" ")) //按照空格切分
                                .map(x => (x, 1))  //每个单词计为1
                                .keyBy(0)         //按照下标为0的单词进行分组
                                .sum(1)          //按照下标为1累加相同单词出现的1


    //对数据进行打印
    result.print()

    //开启任务
     env.execute("FlinkStream")
  }

}

```

输入

```
hadoop hadoop
hadoop
hive hadoop 
```

输出

```
8> (hadoop,1)
1> (hive,1)
8> (hadoop,2)
8> (hadoop,3)
8> (hadoop,4)
```

![1587390209212](flink.assets/state.png)



##### 1.2 stage类型

Flink中有两种基本类型的State, **Keyed State和Operator State**，他们两种都可以以两种形式存在：

* 原始状态(raw state)
  * 由算子自己管理数据结构，当触发Checkpoint操作过程中，Flink并不知道状态数据内部的数据结构，只是将数据转换成bytes数据存储在Checkpoints中，当从Checkpoints恢复任务时，算子自己再反序列化出状态的数据结构。
* 托管状态(managed state)
  * 由**Flink Runtime**控制和管理状态数据，并将状态数据转换成为内存的Hash tables或 RocksDB的对象存储，然后将这些数据通过内部的接口持久化到checkpoints中，任务异常时可以通过这些状态数据恢复任务。
  * **推荐使用ManagedState管理状态数据**，ManagedState更好的支持状态数据的重平衡以及更加完善的内存管理



###### 1.2.1  Operator State(算子状态)

* operator state是task级别的state，**说白了就是每个task对应一个state**
* Kafka Connector source中的每个分区（task）都需要记录消费的topic的partition和offset等信息。
* **operator state 只有一种托管状态：ValueState** 



![1587391007087](flink.assets/Operator State.png)

###### 1.2.2 keyed State(键控状态)

Keyed State：顾名思义就是基于KeyedStream上的状态，这个状态是跟特定的Key 绑定的。KeyedStream流上的**每一个Key，都对应一个State**。Flink针对 Keyed State 提供了以下可以保存State的数据结构.

**Keyed state托管状态有六种类型**：

1、==ValueState==

保存一个可以更新和检索的值（如上所述，每个值都对应到当前的输入数据的key，因此算子接收到的每个key都可能对应一个值）。 这个值可以通过update(T) 进行更新，通过 T value() 进行检索

2、==ListState==

保存一个元素的列表。可以往这个列表中追加数据，并在当前的列表上进行检索。可以通过 add(T) 或者` addAll(List<T>`) 进行添加元素，通过` Iterable<T> get()` 获得整个列表。还可以通过 `update(List<T>`) 覆盖当前的列表	。

3、==MapState==

​	维护了一个映射列表。 你可以添加键值对到状态中，也可以获得 反映当前所有映射的迭代器。使用 put(UK，UV) 或者 putAll(`Map<UK，UV>`) 添加映射。 使用 get(UK) 检索特定 key。 使用 entries()，keys() 和 values() 分别检索映射、 键和值的可迭代视图。

4、ReducingState

保存一个单值，表示添加到状态的所有值的聚合。接口与ListState类似，但**使用add(T) 增加元素，会使用提供的 ReduceFunction 进行聚合**。

5、AggregatingState

`AggregatingState<IN, OUT>`: 保留一个单值，表示添加到状态的所有值的聚合。和 ReducingState 相反的是, 聚合类型可能与 添加到状态的元素的类型不同。 接口与 ListState类似，**但使用 add(IN) 添加的元素会用指定的 AggregateFunction 进行聚合**

6、FoldingState

保留一个单值，表示添加到状态的所有值的聚合。 与ReducingState 相反，聚合类型可能与添加到状态的元素类型不同。接口与 ListState 类似，但使用 add（T）添加的元素会用指定的 FoldFunction 折叠成聚合值。在Flink1.4中弃用，未来版本将被完全删除。


![1587393629878](flink.assets/keyed State.png)



##### 1.3 Keyed State案例演示

###### 1.3.1 ValueState

* 作用

  * 保存一个可以更新和检索的值

* 需求

  * 使用valueState实现平均值求取

* 代码开发

  ```scala
  package com.kaikeba.keystate
  
  import org.apache.flink.api.common.functions.RichFlatMapFunction
  import org.apache.flink.api.common.state.{ValueState, ValueStateDescriptor}
  import org.apache.flink.configuration.Configuration
  import org.apache.flink.streaming.api.scala.StreamExecutionEnvironment
  import org.apache.flink.util.Collector
  
  /**
    * 使用valueState实现平均值求取
    */
  object ValueStateOperate {
    def main(args: Array[String]): Unit = {
      val env = StreamExecutionEnvironment.getExecutionEnvironment
      import org.apache.flink.api.scala._
  
        env.fromCollection(List(
          (1L, 3d),
          (1L, 5d),
          (1L, 7d),
          (1L, 4d),
          (1L, 2d)
        ))
          .keyBy(_._1)
          .flatMap(new CountWindowAverage())
          .print()
      env.execute()
    }
  }
  
  class CountWindowAverage extends RichFlatMapFunction[(Long, Double), (Long, Double)] {
    //定义ValueState类型的变量
    //Scala中必须要显式指定类成员默认值，如果你比较懒，可以用_让编译器自动帮你设置初始值
    private var sum: ValueState[(Long, Double)] = _
  
  
    override def open(parameters: Configuration): Unit = {
      //初始化获取历史状态的值
      sum = getRuntimeContext.getState(
        new ValueStateDescriptor[(Long, Double)]("average", classOf[(Long, Double)])
      )
    }
  
    override def flatMap(input: (Long, Double), out: Collector[(Long, Double)]): Unit = {
      // access the state value
      val tmpCurrentSum = sum.value
      // If it hasn't been used before, it will be null
      val currentSum = if (tmpCurrentSum != null) {
        tmpCurrentSum
      } else {
        (0L, 0d)
      }
      // update the count
      val newSum = (currentSum._1 + 1, currentSum._2 + input._2)
  
      // update the state
      sum.update(newSum)
  
      // if the count reaches 2, emit the average and clear the state
      if (newSum._1 >= 2) {
        out.collect((input._1, newSum._2 / newSum._1))
        //将状态清除
        //sum.clear()
      }
    }
  
  
  }
  /*运行结果：
  5> (1,4.0)
  5> (1,5.0)
  5> (1,4.75)
  5> (1,4.2)
  */
  ```


###### 1.3.2 ListState

* 作用

  * 用于保存每个key的历史数据数据成为一个列表

* 需求

  * 使用ListState求取数据平均值

* 代码开发

  ```scala
  package com.kaikeba.keystate
  
  import java.lang
  import java.util.Collections
  
  import org.apache.flink.api.common.functions.RichFlatMapFunction
  import org.apache.flink.api.common.state.{ListState, ListStateDescriptor}
  import org.apache.flink.configuration.Configuration
  import org.apache.flink.streaming.api.scala.StreamExecutionEnvironment
  import org.apache.flink.util.Collector
  
  /**
    * 使用ListState实现平均值求取
    * ListState<T> ：这个状态为每一个 key 保存集合的值
    *      get() 获取状态值
    *      add() / addAll() 更新状态值，将数据放到状态中
    *      clear() 清除状态
    */
  object ListStateOperate {
  
    def main(args: Array[String]): Unit = {
      val env = StreamExecutionEnvironment.getExecutionEnvironment
      import org.apache.flink.api.scala._
      env.fromCollection(List(
        (1L, 3d),
        (1L, 5d),
        (1L, 7d),
        (2L, 4d),
        (2L, 2d),
        (2L, 6d)
      )).keyBy(_._1)
        .flatMap(new CountWindowAverageWithList)
        .print()
      env.execute()
    }
  }
  
  
  
  class CountWindowAverageWithList extends RichFlatMapFunction[(Long,Double),(Long,Double)]{
    //定义我们历史所有的数据获取
    private var elementsByKey: ListState[(Long,Double)] = _
  
    override def open(parameters: Configuration): Unit = {
      //初始化获取历史状态的值，每个key对应的所有历史值，都存储在list集合里面了
      val listState = new ListStateDescriptor[(Long,Double)]("listState",classOf[(Long,Double)])
      elementsByKey = getRuntimeContext.getListState(listState)
  
    }
  
    override def flatMap(element: (Long, Double), out: Collector[(Long, Double)]): Unit = {
      //获取当前key的状态值
     val currentState: lang.Iterable[(Long, Double)] = elementsByKey.get()
  
      //如果初始状态为空，那么就进行初始化，构造一个空的集合出来，准备用于存储后续的数据
      if(currentState == null){
        elementsByKey.addAll(Collections.emptyList())
      }
      //添加元素
      elementsByKey.add(element)
      import scala.collection.JavaConverters._
      val allElements: Iterator[(Long, Double)] = elementsByKey.get().iterator().asScala
        
      val allElementList: List[(Long, Double)] = allElements.toList
      if(allElementList.size >= 3){
        var count = 0L
        var sum = 0d
        for(eachElement <- allElementList){
          count +=1
          sum += eachElement._2
        }
        out.collect((element._1,sum/count))
      }
    }
  }
  /*运行结果为：
  6> (2,4.0)
  5> (1,5.0)
  */
  ```



###### 1.3.3 MapState

* 作用

  * 用于将每个key对应的数据都保存成一个map集合

* 需求

  * 使用MapState求取每个key对应的平均值

* 代码开发

  ```scala
  package com.kaikeba.keystate
  
  import java.util.UUID
  
  import org.apache.flink.api.common.functions.RichFlatMapFunction
  import org.apache.flink.api.common.state.{MapState, MapStateDescriptor}
  import org.apache.flink.configuration.Configuration
  import org.apache.flink.streaming.api.scala.StreamExecutionEnvironment
  import org.apache.flink.util.Collector
  
  /**
    * 使用MapState求取每个key对应的平均值
    */
  object MapStateOperate {
  
    def main(args: Array[String]): Unit = {
  
  
      val env = StreamExecutionEnvironment.getExecutionEnvironment
      import org.apache.flink.api.scala._
      env.fromCollection(List(
        (1L, 3d),
        (1L, 5d),
        (1L, 7d),
        (2L, 4d),
        (2L, 2d),
        (2L, 6d)
      )).keyBy(_._1)
        .flatMap(new CountWithAverageMapState)
        .print()
      env.execute()
    }
  }
  
  class CountWithAverageMapState extends RichFlatMapFunction[(Long,Double),(Long,Double)]{
    private var mapState:MapState[String,Double] = _
  
    //初始化获取mapState对象
    override def open(parameters: Configuration): Unit = {
      val mapStateOperate = new MapStateDescriptor[String,Double]("mapStateOperate",classOf[String],classOf[Double])
      mapState = getRuntimeContext.getMapState(mapStateOperate)
    }
    override def flatMap(input: (Long, Double), out: Collector[(Long, Double)]): Unit = {
      //将相同的key对应的数据放到一个map集合当中去，就是这种对应  1 -> List[Map,Map,Map]
      //每次都构建一个map集合
      mapState.put(UUID.randomUUID().toString,input._2)
      import scala.collection.JavaConverters._
  
      //获取map集合当中所有的value，我们每次将数据的value给放到map的value里面去
      val listState: List[Double] = mapState.values().iterator().asScala.toList
      if(listState.size >=3){
        var count = 0L
        var sum = 0d
        for(eachState <- listState){
          count +=1
          sum += eachState
        }
        println("average"+ sum/count)
        out.collect(input._1,sum/count)
      }
    }
  }
  /*运行结果为：
  average5.0
  average4.0
  5> (1,5.0)
  6> (2,4.0)
  */
  ```

- 补充

  > UUID（Universally Unique Identifier）：通用唯一识别码，是一种软件建构的标准。
  >
  > **UUID 目的是让分布式系统中的所有元素，都能有唯一的辨识信息**，而不需要通过中央控制端来做辨识信息的指定。
  >
  > UUID是指在一台机器上生成的数字，它保证对在同一时空中的所有机器都是唯一的。

  

###### 1.3.4 ReducingState

* 作用

  * 用于数据的聚合

* 需求

  * 使用ReducingState求取每个key对应的平均值

* 代码开发

  ```scala
  package com.kaikeba.keystate
  
  import org.apache.flink.api.common.functions.{ReduceFunction, RichFlatMapFunction}
  import org.apache.flink.api.common.state.{ReducingState, ReducingStateDescriptor}
  import org.apache.flink.configuration.Configuration
  import org.apache.flink.streaming.api.scala.StreamExecutionEnvironment
  import org.apache.flink.util.Collector
  
  /**
    * ReducingState<T> ：这个状态为每一个 key 保存一个聚合之后的值
    * get() 获取状态值
    * add()  更新状态值，将数据放到状态中
    * clear() 清除状态
    */
  
  object ReduceingStateOperate {
    def main(args: Array[String]): Unit = {
      val env = StreamExecutionEnvironment.getExecutionEnvironment
      import org.apache.flink.api.scala._
      env.fromCollection(List(
        (1L, 3d),
        (1L, 5d),
        (1L, 7d),
        (2L, 4d),
        (2L, 2d),
        (2L, 6d)
      )).keyBy(_._1)
        .flatMap(new CountWithReduceingAverageStage)
        .print()
      env.execute()
    }
  }
  
  
  
  class CountWithReduceingAverageStage extends RichFlatMapFunction[(Long,Double),(Long,Double)]{
  
     //定义ReducingState
    private var reducingState:ReducingState[Double] = _
  
    //定义一个计数器
     var counter=0L
  
  
    override def open(parameters: Configuration): Unit = {
      
      val reduceSum = new ReducingStateDescriptor[Double]("reduceSum", new ReduceFunction[ Double] {
        override def reduce(value1: Double, value2: Double): Double = {
          value1+ value2
        }
      }, classOf[Double])
  
      //初始化获取mapState对象
      reducingState = getRuntimeContext.getReducingState[Double](reduceSum)
  
    }
    override def flatMap(input: (Long, Double), out: Collector[(Long, Double)]): Unit = {
      //计数器+1
      counter+=1
      //添加数据到reducingState
      reducingState.add(input._2)
  
      out.collect(input._1,reducingState.get()/counter)
    }
  }
  /*
  6> (2,4.0)
  5> (1,3.0)
  6> (2,3.0)
  5> (1,4.0)
  6> (2,4.0)
  5> (1,5.0)
  */
  ```

###### 1.3.5 AggregatingState

Aggregating  [ˈæɡrɪɡeɪtɪŋ]

* 作用

  * 将相同key的数据进行聚合

* 需求

  * 将相同key的数据聚合成为一个字符串

* 代码开发

  ```scala
  package com.kaikeba.keystate
  
  import org.apache.flink.api.common.functions.{AggregateFunction, RichFlatMapFunction}
  import org.apache.flink.api.common.state.{AggregatingState, AggregatingStateDescriptor}
  import org.apache.flink.configuration.Configuration
  import org.apache.flink.streaming.api.scala.StreamExecutionEnvironment
  import org.apache.flink.util.Collector
  
  /**
    * 将相同key的数据聚合成为一个字符串
    */
  object AggregrageStateOperate {
  
    def main(args: Array[String]): Unit = {
  
        val env = StreamExecutionEnvironment.getExecutionEnvironment
        import org.apache.flink.api.scala._
        env.fromCollection(List(
          (1L, 3d),
          (1L, 5d),
          (1L, 7d),
          (2L, 4d),
          (2L, 2d),
          (2L, 6d)
        )).keyBy(_._1)
          .flatMap(new AggregrageState)
          .print()
  
        env.execute()
      }
    }
  
    /**
      *   (1L, 3d),
          (1L, 5d),
          (1L, 7d),   把相同key的value拼接字符串：Contains+and+3+and+5+and+7
      */
    class AggregrageState extends RichFlatMapFunction[(Long,Double),(Long,String)]{
  
       //定义AggregatingState
      private var aggregateTotal:AggregatingState[Double, String] = _
  
      override def open(parameters: Configuration): Unit = {
        /**
          * name: String,
          * aggFunction: AggregateFunction[IN, ACC, OUT],
          * stateType: Class[ACC]
          */
        val aggregateStateDescriptor = new AggregatingStateDescriptor[Double, String, String]("aggregateState", new AggregateFunction[Double, String, String] {
           //创建一个初始值
          override def createAccumulator(): String = {
            "Contains"
          }
  
          //对数据进行累加
          override def add(value: Double, accumulator: String): String = {
            if ("Contains".equals(accumulator)) {
              accumulator + value
            }
  
            accumulator + "and" + value
          }
  
           //获取累加的结果
          override def getResult(accumulator: String): String = {
            accumulator
          }
  
          //数据合并的规则
          override def merge(a: String, b: String): String = {
            a + "and" + b
          }
        }, classOf[String])
        aggregateTotal = getRuntimeContext.getAggregatingState(aggregateStateDescriptor)
      }
  
      override def flatMap(input: (Long, Double), out: Collector[(Long, String)]): Unit = {
  
        aggregateTotal.add(input._2)
        out.collect(input._1,aggregateTotal.get())
      }
  
  
  }
  
  ```



##### 1.4  Operator State案例演示

* 需求
  * 实现每两条数据进行输出打印一次，不用区分数据的key
  * 这里使用ListState实现

```scala
package com.kaikeba.operatorstate

import org.apache.flink.streaming.api.functions.sink.SinkFunction
import org.apache.flink.streaming.api.scala.{DataStream, StreamExecutionEnvironment}

import scala.collection.mutable.ListBuffer

/**
  * 实现每两条数据进行输出打印一次，不用区分数据的key
  */
object OperatorListState {
  def main(args: Array[String]): Unit = {
    val env = StreamExecutionEnvironment.getExecutionEnvironment
    import org.apache.flink.api.scala._
    val sourceStream: DataStream[(String, Int)] = env.fromCollection(List(
        ("spark", 3),
        ("hadoop", 5),
        ("hive", 7),
        ("flume", 9)
    ))

    sourceStream.addSink(new OperateTaskState).setParallelism(1)

    env.execute()
  }

}

class OperateTaskState extends SinkFunction[(String,Int)]{
  //定义一个list 用于我们每两条数据打印一下
  private var listBuffer:ListBuffer[(String,Int)] = new ListBuffer[(String, Int)]

  override def invoke(value: (String, Int), context: SinkFunction.Context[_]): Unit = {
    listBuffer.+=(value)

    if(listBuffer.size ==2){
       println(listBuffer)

      //清空state状态
      listBuffer.clear()
    }
  }

}
/*运行结果：
ListBuffer((spark,3), (hadoop,5))
ListBuffer((hive,7), (flume,9))
*/
```

def invoke的作用： Writes the given value to the sink，源代码如下：

```java
default void invoke(IN value) throws Exception {}

	/**
	 * Writes the given value to the sink. This function is called for every record.
	 *
	 * <p>You have to override this method when implementing a {@code SinkFunction}, this is a
	 * {@code default} method for backward compatibility with the old-style method only.
	 *
	 * @param value The input record.
	 * @param context Additional context about the input record.
	 *
	 * @throws Exception This method may throw exceptions. Throwing an exception will cause the operation
	 *                   to fail and may trigger recovery.
	 */
```



## Flink的状态管理之State Backend

默认情况下，state会保存在taskmanager的内存中，checkpoint会存储在JobManager的内存中。**state 的存储和checkpoint的位置取决于State Backend的配置**。

==Flink一共提供了3种StateBackend==

* MemoryStateBackend	
  * 基于内存存储
* FsStateBackend
  * 基于文件系统存储
* RocksDBStateBackend
  * 基于数据库存储

可以通过  ==StreamExecutionEnvironment.setStateBackend(...)==来设置state存储的位置

##### 2.1 MemoryStateBackend

将数据持久化状态存储到内存当中，state数据保存在java堆内存中，执行checkpoint的时候，会把state的快照数据保存到jobmanager的内存中。**基于内存的state backend在生产环境下不建议使用**。

![1587460628502](flink.assets/MemoryStateBackend.png)

代码配置：

```scala
environment.setStateBackend(new MemoryStateBackend())
```



##### 2.2  FsStateBackend

state数据保存在taskmanager的内存中，执行checkpoint的时候，会把state的快照数据保存到配置的文件系统中。可以使用hdfs等分布式文件系统.

**FsStateBackend 适合场景：状态数据特别的多**，还有长时间的window算子等，它很安全，因为基于hdfs，所以数据有备份很安全。

![1587460786994](flink.assets/FSStateBackend.png)

代码配置：

```scala
environment.setStateBackend(new FsStateBackend("hdfs://node01:8020/flink/checkDir"))
```

##### 2.3  RocksDBStateBackend   

RocksDB介绍：

RocksDB使用一套日志结构的数据库引擎，**它是Flink中内置的第三方状态管理器**,为了更好的性能，这套引擎是用C++编写的。 Key和value是任意大小的字节流。RocksDB跟上面的都略有不同，它会在本地文件系统中维护状态，state会直接写入本地rocksdb中。同时它需要配置一个远端的filesystem uri（一般是HDFS），**在做checkpoint的时候，会把本地的数据直接复制到filesystem中**。fail over的时候从filesystem中恢复到本地RocksDB克服了state受内存限制的缺点，同时又能够持久化到远端文件系统中，**比较适合在生产中使用**.

![1587461111818](flink.assets/RocksDBStateBackend.png)

代码配置：导入jar包然后配置代码

```xml
<dependency>
    <groupId>org.apache.flink</groupId>
    <artifactId>flink-statebackend-rocksdb_2.11</artifactId>
    <version>1.9.2</version>
</dependency>
```

配置代码

```scala
environment.setStateBackend(new RocksDBStateBackend("hdfs://node01:8020/flink/checkDir",true))
```



##### 2.4  修改state-backend的两种方式

第一种：单任务调整

* 修改当前任务代码

```scala
env.setStateBackend(new FsStateBackend("hdfs://node01:8020/flink/checkDir"))
或者new MemoryStateBackend()
或者new RocksDBStateBackend(filebackend, true);【需要添加第三方依赖】
```

第二种：全局调整

* 修改flink-conf.yaml

```yaml
state.backend: filesystem
state.checkpoints.dir: hdfs://node01:8020/flink/checkDir
```

* 注意：state.backend的值可以是下面几种

```
(1) jobmanager    表示使用 MemoryStateBackend
(2) filesystem    表示使用 FsStateBackend
(3) rocksdb       表示使用 RocksDBStateBackend
```

## Flink的checkPoint保存数据实现容错

##### 3.1 checkPoint的基本概念

**为了保证state的容错性，Flink需要对state进行checkpoint。**

Checkpoint是Flink实现容错机制最核心的功能，它能够**根据配置周期性地基于Stream中各个Operator/task的状态来生成快照，从而将这些状态数据定期持久化存储下来**，当Flink程序一旦意外崩溃时，重新运行程序时可以有选择地从这些快照进行恢复，从而修正因为故障带来的程序数据异常。

##### 3.2  checkPoint的前提

* Flink的checkpoint机制可以与(stream和state)的持久化存储交互的前提
  * 1、持久化的source，它需要支持在一定时间内重放事件。这种sources的典型例子是持久化的消息队列（比如Apache Kafka，RabbitMQ等）或文件系统（比如HDFS，S3，GFS等）

  * 2、用于state的持久化存储，例如分布式文件系统（比如HDFS，S3，GFS等）

##### 3.3 Flink进行checkpoint步骤

- 暂停新数据的输入
- 等待流中on-the-fly的数据被处理干净，此时得到flink graph的一个snapshot
- 将所有Task中的State拷贝到State Backend中，如HDFS。此动作由各个Task Manager完成
- 各个Task Manager将Task State的位置上报给Job Manager，完成checkpoint
- 恢复数据的输入

如上所述，这里才需要“暂停输入  +  排干on-the-fly  数据”的操作，这样才能拿到同一时刻下所有subtask的state

##### 3.4  配置checkPoint

* **默认checkpoint功能是disabled的**，想要使用的时候需要先启用

* checkpoint开启之后**，默认的checkPointMode是Exactly-once**

* checkpoint的checkPointMode有两种
  * Exactly-once:    数据处理且只被处理一次
  * At-least-once：数据至少被处理一次

Exactly-once对于大多数应用来说是最合适的。At-least-once可能用在某些延迟超低的应用程序（始终延迟为几毫秒）。

要设置checkPoint，直接将下列内容粘贴到代码中即可。

```scala
//默认checkpoint功能是disabled的，想要使用的时候需要先启用
// 每隔1000 ms进行启动一个检查点【设置checkpoint的周期】
environment.enableCheckpointing(1000);
// 高级选项：
// 设置模式为exactly-once （这是默认值）
environment.getCheckpointConfig.setCheckpointingMode(CheckpointingMode.EXACTLY_ONCE);
// 确保检查点之间有至少500 ms的间隔【checkpoint最小间隔】
environment.getCheckpointConfig.setMinPauseBetweenCheckpoints(500);
// 检查点必须在一分钟内完成，或者被丢弃【checkpoint的超时时间】
environment.getCheckpointConfig.setCheckpointTimeout(60000);
// 同一时间只允许进行一个检查点
environment.getCheckpointConfig.setMaxConcurrentCheckpoints(1);
// 表示一旦Flink处理程序被cancel后，会保留Checkpoint数据，以便根据实际需要恢复到指定的Checkpoint【详细解释见备注】

/**
  * ExternalizedCheckpointCleanup.RETAIN_ON_CANCELLATION:表示一旦Flink处理程序被cancel后，会保留Checkpoint数据，以便根据实际需要恢复到指定的Checkpoint
  * ExternalizedCheckpointCleanup.DELETE_ON_CANCELLATION: 表示一旦Flink处理程序被cancel后，会删除Checkpoint数据，只有job执行失败的时候才会保存checkpoint
  */
environment.getCheckpointConfig.enableExternalizedCheckpoints(ExternalizedCheckpointCleanup.RETAIN_ON_CANCELLATION);

```

##### 3.5  重启策略概述

* Flink支持不同的重启策略，以在故障发生时控制作业如何重启，集群在启动时会伴随一个默认的重启策略，在没有定义具体重启策略时会使用该默认策略。
* 如果在工作提交时指定了一个重启策略，该策略会覆盖集群的默认策略，默认的重启策略可以通过 Flink 的配置文件 flink-conf.yaml 指定。配置参数 restart-strategy 定义了哪个策略被使用。
* 常用的重启策略
  * （1）固定间隔 (Fixed delay)
  * （2）失败率 (Failure rate)
  * （3）无重启 (No restart)
* **如果没有启用 checkpointing，则使用无重启 (no restart) 策略。** 
* 如果启用了 checkpointing，重启策略可以在==flink-conf.yaml==中配置，表示全局的配置。也可以在应用代码中动态指定，会覆盖全局配置
  * 但没有配置重启策略，则使用固定间隔 (fixed-delay) 策略， 尝试重启次数默认值是：Integer.MAX_VALUE，。

##### 3.6  重启策略配置实现

* 固定间隔 (Fixed delay)

```scala
第一种：全局配置 flink-conf.yaml
restart-strategy: fixed-delay
restart-strategy.fixed-delay.attempts: 3    
restart-strategy.fixed-delay.delay: 10 s

第二种：应用代码设置
	//重启次数、重启时间间隔
environment.setRestartStrategy(RestartStrategies.fixedDelayRestart(5,10000))

```

* 失败率 (Failure rate)

```scala
第一种：全局配置 flink-conf.yaml
restart-strategy: failure-rate
restart-strategy.failure-rate.max-failures-per-interval: 3
restart-strategy.failure-rate.failure-rate-interval: 5 min    //五分钟之内，不能超过3次重启失败
restart-strategy.failure-rate.delay: 10 s     //重启的时间间隔

第二种：应用代码设置
environment.setRestartStrategy(RestartStrategies.failureRateRestart(20, org.apache.flink.api.common.time.Time.seconds(10), org.apache.flink.api.common.time.Time.seconds(10)))

```

* 无重启 (No restart)

```scala
第一种：全局配置 flink-conf.yaml
restart-strategy: none

第二种：应用代码设置
environment.setRestartStrategy(RestartStrategies.noRestart())

```

## 案例：对state进行checkPoint

如果使用RocksDBStateBackend   的话，要添加依赖flink-statebackend-rocksdb_2.11，但是这里使用的是FsStateBackend，所以不需要。

```scala
import org.apache.flink.runtime.state.filesystem.FsStateBackend
import org.apache.flink.streaming.api.CheckpointingMode
import org.apache.flink.streaming.api.environment.CheckpointConfig.ExternalizedCheckpointCleanup
import org.apache.flink.streaming.api.scala.StreamExecutionEnvironment

object Demo16 {
  def main(args: Array[String]): Unit = {
    val environment=StreamExecutionEnvironment.getExecutionEnvironment
    import org.apache.flink.api.scala._
    environment.setStateBackend(new FsStateBackend("hdfs://node01:8020/stateStore"))
    //默认checkpoint功能是disabled的，想要使用的时候需要先启用
    // 每隔3000 ms进行启动一个检查点【设置checkpoint的周期】
    environment.enableCheckpointing(3000);
    // 高级选项：
    // 设置模式为exactly-once （这是默认值）
    environment.getCheckpointConfig.setCheckpointingMode(CheckpointingMode.EXACTLY_ONCE);
    // 确保检查点之间有至少500 ms的间隔【checkpoint最小间隔】
    environment.getCheckpointConfig.setMinPauseBetweenCheckpoints(500);
    // 检查点必须在一分钟内完成，或者被丢弃【checkpoint的超时时间】
    environment.getCheckpointConfig.setCheckpointTimeout(60000);
    // 同一时间只允许进行一个检查点
    environment.getCheckpointConfig.setMaxConcurrentCheckpoints(1);
    // 表示一旦Flink处理程序被cancel后，会保留Checkpoint数据，以便根据实际需要恢复到指定的Checkpoint【详细解释见备注】

    /**
     * ExternalizedCheckpointCleanup.RETAIN_ON_CANCELLATION:表示一旦Flink处理程序被cancel后，会保留Checkpoint数据，以便根据实际需要恢复到指定的Checkpoint
     * ExternalizedCheckpointCleanup.DELETE_ON_CANCELLATION: 表示一旦Flink处理程序被cancel后，会删除Checkpoint数据，只有job执行失败的时候才会保存checkpoint
     */
    environment.getCheckpointConfig.enableExternalizedCheckpoints(ExternalizedCheckpointCleanup.RETAIN_ON_CANCELLATION);
    val sourceStream=environment.socketTextStream("node01",9999)
    val resultStream=sourceStream
      .flatMap(x=>x.split(" "))
      .map(x=>(x,1))
      .keyBy(0)
      .sum(1)

    resultStream.print()
    environment.execute()

  }
}
```

启动netcat服务，nc -lk 9999

启动flink程序，然后观看web界面：node01:50070，可以看到，/stateStore目录保存了state的数据，而且chk的版本会不断更新，只会保留一个版本（后面会学习保留多个历史版本的checkPoint)。根据代码的设定，每隔3s就会更新一次。

![image-20200508010212878](flink.assets/image-20200508010212878.png)

隔几秒后刷新页面：

![image-20200508010237271](flink.assets/image-20200508010237271.png)

state的元数据信息最终保存到了下面这里：

![image-20200508011517620](flink.assets/image-20200508011517620.png)

## 从checkPoint恢复数据以及checkPoint保存多个历史版本

##### 4.1  保存多个历史版本

* **默认情况下**，如果设置了Checkpoint选项，则**Flink只保留最近成功生成的1个Checkpoint**，而当Flink程序失败时，可以从最近的这个Checkpoint来进行恢复。
* 如果我们希望保留多个Checkpoint，并能够根据实际需要==选择其中一个进行恢复==，这样会更加灵活，比如，我们发现最近4个小时数据记录处理有问题，希望将整个状态还原到4小时之前

* **Flink可以支持保留多个Checkpoint**，需要在Flink的配置文件conf/flink-conf.yaml中，添加如下配置，指定最多需要保存Checkpoint的个数

```yaml
state.checkpoints.num-retained: 20
```

这样设置以后就查看对应的Checkpoint在HDFS上存储的文件目录

```yaml
hdfs dfs -ls hdfs://node01:8020/flink/checkpoints
```

如果希望回退到某个Checkpoint点，只需要指定对应的某个Checkpoint路径即可实现。

如果保存多个版本，会出现下面的情景：

![image-20200508014421740](flink.assets/image-20200508014421740.png)

##### 4.2 恢复历史某个版本数据

如果Flink程序异常失败，或者最近一段时间内数据处理错误，我们**可以将程序从某一个Checkpoint点进行恢复**

```sh
bin/flink run -s hdfs://node01:8020/flink/checkpoints/467e17d2cc343e6c56255d222bae3421/chk-56/_metadata flink-job.jar
```

程序正常运行后，还会按照Checkpoint配置进行运行，继续生成Checkpoint数据。

## Flink的savePoint保存数据

##### 5.1 savePoint的介绍

* **savePoint是检查点一种特殊实现，底层其实也是使用Checkpoints的机制**。
* savePoint是用户以手工命令的方式触发checkpoint，并将结果持久化到指定的存储目录中

* 作用
  * 1、应用**程序代码升级**
    * 通过触发保存点并从该保存点处运行新版本，下游的应用程序并不会察觉到不同
  * 2、**Flink版本更新**
    * Flink 自身的更新也变得简单，因为可以针对正在运行的任务触发保存点，并从保存点处用新版本的 Flink 重启任务。
  * 3、维护和迁移
    * 使用保存点，可以轻松地“暂停和恢复”应用程序            

##### 5.2 savePoint的使用

1：在flink-conf.yaml中配置Savepoint存储位置

不是必须设置，但是设置后，后面创建指定Job的Savepoint时，可以不用在手动执行命令时指定Savepoint的位置

```yaml
state.savepoints.dir: hdfs://node01:8020/flink/savepoints
```

2：触发一个savepoint

* （1）手动触发savepoint（在flink程序运行的过程中，运行下列命令，手动触发savepoint，**触发savepoint不会影响flink程序的运行**，触发savepoint只是开启另外的一个线程来保存当前的状态）

  ```shell
  #【针对on standAlone模式】
  bin/flink savepoint jobId [targetDirectory] 
  
  #【针对on yarn模式需要指定-yid参数】
  bin/flink savepoint jobId [targetDirectory] [-yid yarnAppId]
  
  #jobId 				需要触发savepoint的jobId编号
  #targetDirectory     指定savepoint存储数据目录，如果在flink-conf.yaml中设置了，就不需要指定了
  #-yid                指定yarnAppId 
  ```

* （2）取消任务并手动触发savepoint

  ```shell
  ##【针对on standAlone模式】
  bin/flink cancel -s [targetDirectory] jobId 
  
  ##【针对on yarn模式需要指定-yid参数】
  bin/flink cancel -s [targetDirectory] jobId [-yid yarnAppId]
  ```

3：从指定的savepoint启动job

```shell
bin/flink run -s savepointPath [runArgs]
```

4、清除savepoint数据

```shell
bin/flink savepoint -d savepointPath
```




##  Flink流式处理集成kafka

* 对于**实时处理当中，我们实际工作当中的数据源一般都是使用kafka**，所以我们一起来看看如何通过Flink来集成kafka

* Flink提供了一个特有的kafka connector去读写kafka topic的数据。flink消费kafka数据，并不是完全通过跟踪kafka消费组的offset来实现去保证exactly-once的语义，而是**flink内部去跟踪offset和做checkpoint去实现exactly-once的语义**，而且对于kafka的partition，Flink会**启动对应的并行度**去处理kafka当中的每个分区的数据

* Flink整合kafka官网介绍
  * https://ci.apache.org/projects/flink/flink-docs-release-1.9/dev/connectors/kafka.html

#### 6.1 导入pom依赖

```xml
<!-- https://mvnrepository.com/artifact/org.apache.flink/flink-connector-kafka -->
<dependency>
    <groupId>org.apache.flink</groupId>
    <artifactId>flink-connector-kafka_2.11</artifactId>
    <version>1.9.2</version>
</dependency>
<dependency>
    <groupId>org.apache.flink</groupId>
    <artifactId>flink-statebackend-rocksdb_2.11</artifactId>
    <version>1.9.2</version>
</dependency>
<dependency>
    <groupId>org.apache.kafka</groupId>
    <artifactId>kafka-clients</artifactId>
    <version>1.1.0</version>
</dependency>
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-api</artifactId>
    <version>1.7.25</version>
</dependency>
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-log4j12</artifactId>
    <version>1.7.25</version>
</dependency>
```



#### 案例1：将kafka作为flink的source来使用

* 实际工作当中一般都是将kafka作为flink的source来使用

###### 6.2.1 创建kafka的topic

* 安装好kafka集群，并启动kafka集群，然后在node01执行以下命令创建kafka的topic为test

```shell
kafka-topics.sh --create --partitions 3 --topic test --replication-factor 1 --zookeeper node01:2181,node02:2181,node03:2181
```

###### 6.2.2 代码实现：

```scala
package com.kaikeba.kafka

import java.util.Properties

import org.apache.flink.contrib.streaming.state.RocksDBStateBackend
import org.apache.flink.streaming.api.CheckpointingMode
import org.apache.flink.streaming.api.environment.CheckpointConfig
import org.apache.flink.streaming.api.scala.{DataStream, StreamExecutionEnvironment}
import org.apache.flink.streaming.connectors.kafka.FlinkKafkaConsumer
import org.apache.flink.streaming.util.serialization.SimpleStringSchema

/**
  *  将kafka作为flink的source来使用
  */
object FlinkKafkaSource {

  def main(args: Array[String]): Unit = {
    val env = StreamExecutionEnvironment.getExecutionEnvironment
    //**隐式转换
    import org.apache.flink.api.scala._
    //checkpoint**配置
    env.enableCheckpointing(100)
    env.getCheckpointConfig.setCheckpointingMode(CheckpointingMode.EXACTLY_ONCE)
    env.getCheckpointConfig.setMinPauseBetweenCheckpoints(500)
    env.getCheckpointConfig.setCheckpointTimeout(60000)
    env.getCheckpointConfig.setMaxConcurrentCheckpoints(1)
    env.getCheckpointConfig.enableExternalizedCheckpoints(CheckpointConfig.ExternalizedCheckpointCleanup.RETAIN_ON_CANCELLATION)
    //设置statebackend
   env.setStateBackend(new RocksDBStateBackend("hdfs://node01:8020/flink_kafka_sink/checkpoints",true));

    val topic = "test"
    val prop = new Properties()
    prop.setProperty("bootstrap.servers","node01:9092,node02:9092,node03:9092")
    prop.setProperty("group.id","con1")
    prop.setProperty("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
    prop.setProperty("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
    val kafkaConsumer = new FlinkKafkaConsumer[String]("test",new SimpleStringSchema,prop)
      
    //把消息的偏移量通过checkpoint机制保存在HDFS上
    kafkaConsumer.setCommitOffsetsOnCheckpoints(true)
    val kafkaSource: DataStream[String] = env.addSource(kafkaConsumer)
    kafkaSource.print()
    env.execute()


  }
}

```

###### 6.2.3 kafka生产数据

启动flink程序，然后在node01执行以下命令，通过shell命令行来生产数据到kafka当中去

```shell
kafka-console-producer.sh --broker-list node01:9092,node02:9092,node03:9092 --topic  test
```

观察web：

![image-20200508024048904](flink.assets/image-20200508024048904.png)

#### 案例2：将kafka作为flink的sink来使用

我们也可以将kafka作为flink的sink来使用，就是将flink处理完成之后的数据写入到kafka当中去

###### 6.3.1 socket发送数据

node01执行以下命令，从socket当中发送数据

```
 nc -lk 9999
```

###### 6.3.2 代码实现

```scala
package com.kaikeba.kafka

import java.util.Properties

import org.apache.flink.contrib.streaming.state.RocksDBStateBackend
import org.apache.flink.streaming.api.CheckpointingMode
import org.apache.flink.streaming.api.environment.CheckpointConfig
import org.apache.flink.streaming.api.scala.StreamExecutionEnvironment
import org.apache.flink.streaming.connectors.kafka.FlinkKafkaProducer
import org.apache.flink.streaming.connectors.kafka.internals.KeyedSerializationSchemaWrapper
import org.apache.flink.streaming.util.serialization.SimpleStringSchema

/**
  * 将kafka作为flink的sink来使用
  */
object FlinkKafkaSink {

  def main(args: Array[String]): Unit = {
    val env = StreamExecutionEnvironment.getExecutionEnvironment
    //隐式转换
    import org.apache.flink.api.scala._
      
    //checkpoint配置
    env.enableCheckpointing(5000);
    env.getCheckpointConfig.setCheckpointingMode(CheckpointingMode.EXACTLY_ONCE);
    env.getCheckpointConfig.setMinPauseBetweenCheckpoints(500);
    env.getCheckpointConfig.setCheckpointTimeout(60000);
    env.getCheckpointConfig.setMaxConcurrentCheckpoints(1);
    env.getCheckpointConfig.enableExternalizedCheckpoints(CheckpointConfig.ExternalizedCheckpointCleanup.RETAIN_ON_CANCELLATION);
    //设置statebackend
    env.setStateBackend(new RocksDBStateBackend("hdfs://node01:8020/flink_kafka_sink/checkpoints",true));
    val socketStream = env.socketTextStream("node01",9999)
    val topic = "test"
    val prop = new Properties()
    prop.setProperty("bootstrap.servers","node01:9092,node02:9092,node03:9092")
    prop.setProperty("group.id","kafka_group1")
    //第一种解决方案，设置FlinkKafkaProducer里面的事务超时时间
    //设置事务超时时间
    prop.setProperty("transaction.timeout.ms",60000*15+"");
      
    //第二种解决方案，设置kafka的最大事务超时时间
      
    //使用至少一次语义的形式
    //FlinkKafkaProducer011<String> myProducer = new FlinkKafkaProducer<>(brokerList, topic, new SimpleStringSchema());
    
      //使用支持仅一次语义的形式
    /**
      * defaultTopic: String,
      * serializationSchema: KafkaSerializationSchema[IN],
      * producerConfig: Properties,
      * semantic: FlinkKafkaProducer.Semantic
      */
    val kafkaSink = new FlinkKafkaProducer[String](topic,new KeyedSerializationSchemaWrapper[String](new SimpleStringSchema()), prop,FlinkKafkaProducer.Semantic.EXACTLY_ONCE)
    socketStream.addSink(kafkaSink)

    env.execute("StreamingFromCollectionScala")

  }
}

```

###### 6.3.3 启动kafka消费者

1、启动netcat服务，nc -lk 9999

2、运行flink程序

3、node01执行以下命令启动kafka消费者，消费数据

```shell
kafka-console-consumer.sh --bootstrap-server node01:9092,node02:9092,node03:9092 --topic test
```

![image-20200508025253485](flink.assets/image-20200508025253485.png)

![image-20200508025311516](flink.assets/image-20200508025311516.png)



## Flink当中的window窗口

* 对于流式处理，如果我们需要求取总和，平均值，或者最大值，最小值等，是做不到的，因为数据一直在源源不断的产生，即数据是没有边界的，所以没法求最大值，最小值，平均值等，所以为了一些数值统计的功能，我们必须指定时间段，对某一段时间的数据求取一些数据值是可以做到的。或者对某一些数据求取数据值也是可以做到的
* 所以，流上的聚合需要由 window 来划定范围，比如 “计算过去的5分钟” ，或者 “最后100个元素的和” 。
* window是一种可以把无限数据切割为有限数据块的手段
  * 窗口可以是 **时间驱动**的 【Time Window】（比如：每30秒）
  * 或者 **数据驱动**的【Count Window】 （比如：每100个元素）

![1584599129746](flink.assets/1584599129746.png)

* 窗口类型汇总：


![1587473202406](flink.assets/window.png)



##### 7.1 窗口的基本类型介绍

* 窗口通常被区分为不同的类型:

  * tumbling windows：滚动窗口 【没有重叠】 

    * 滚动窗口下**窗口之间之间不重叠**，且窗口长度是固定的

    ![](flink.assets/tumbling windows.png)

  * sliding windows：滑动窗口 【**有重叠**】

    * 滑动窗口以一个步长（Slide）不断向前滑动，窗口的长度固定

    ![1587473504462](flink.assets/sliding windows.png)

  * session windows：会话窗口 ，**一般没人用**

    * 会话窗口根据Session gap切分不同的窗口，当一个窗口在大于Session gap的时间内没有接收到新数据时，窗口将关闭

    ![1587473534498](flink.assets/session windows.png)



##### 7.2  Flink的窗口介绍

###### 7.2.1 Time Window窗口的应用

time window又分为滚动窗口和滑动窗口，这两种窗口调用方法都是一样的，都是调用timeWindow这个方法，如果传入==一个参数就是滚动窗口==，如果传入==两个参数就是滑动窗口==

​     ![](flink.assets/1584599265529.png)

需求：每隔5s时间，统计最近10s出现的数据

代码实现：

```scala
import org.apache.flink.streaming.api.scala.{DataStream, StreamExecutionEnvironment}
import org.apache.flink.streaming.api.windowing.time.Time

object TestTimeWindow {

  def main(args: Array[String]): Unit = {
    val environment: StreamExecutionEnvironment = StreamExecutionEnvironment.getExecutionEnvironment

    import org.apache.flink.api.scala._
    val socketSource: DataStream[String] = environment.socketTextStream("node01",9999)

    socketSource
      .flatMap(x => x.split(" "))
      .map(x =>(x,1))
      .keyBy(0)
      .timeWindow(Time.seconds(10),Time.seconds(5))
      .sum(1).print()
    environment.execute()

  }

}
```



###### 7.2.2 Count Windos窗口的应用

* 与timeWindow类型，CountWinodw也可以分为滚动窗口和滑动窗口，这两个窗口调用方法一样，都是调用countWindow，如果传入一个参数就是滚动窗口，如果传入两个参数就是滑动窗口

  ​     ![1584599273870](flink.assets/1584599273870.png)



需求：使用count Window 统计最近5条数的最大值

```scala
import org.apache.flink.api.common.functions.AggregateFunction
import org.apache.flink.streaming.api.scala.{DataStream, StreamExecutionEnvironment}

/**
  * 使用countWindow统计最近5条数据的最大值
  */
object TestCountWindow {

  def main(args: Array[String]): Unit = {
    val environment: StreamExecutionEnvironment = StreamExecutionEnvironment.getExecutionEnvironment
    import org.apache.flink.api.scala._
    val socketSource: DataStream[String] = environment.socketTextStream("node01",9999)

    /**
      * 发送数据
      * spark 1
      * spark 2
      * spark 3
      * spark 4
      * hello 100
      * spark 5
      * hello 90
      * hello 80
      * hello 70
      * hello 60
      * hello 10
      */
    socketSource.map(x => (x.split(" ")(0),x.split(" ")(1).toInt))
    .keyBy(0).countWindow(5)
        .aggregate(new AggregateFunction[(String,Int),Int,Double]{   //aggregate对window的数据进行处理
          var initAccumulator :Int = 0
          override def createAccumulator(): Int = {
            initAccumulator
          }

          override def add(value: (String, Int), accumulator: Int): Int = {
            if(accumulator >= value._2){
              accumulator
            }else{
              value._2
            }
          }

          override def getResult(accumulator: Int): Double = {
            accumulator

          }

          override def merge(a: Int, b: Int): Int = {
            if(a>=b){
              a
            }else{
              b
            }
          }
        }).print()

    environment.execute()
  }
}
/*
当程序运行后，socket发送数据      
      * spark 1
      * spark 2
      * spark 3
      * spark 4
      * hello 100
 后，并不会立即触发统计操作，因为在keyBy分组(分区)后，还不够5条数据。如果再发一个spark应该就可以了。*/
```

Flink 的**AggregateFunction是一个基于中间计算结果状态进行增量计算的函数**。由于是迭代计算方式，所以，在窗口处理过程中，不用缓存整个窗口的数据，所以效率执行比较高。

由AggregateFunction定义可知，**需要实现4个接口：**

1. ACC createAccumulator(); 迭代状态的初始值
2. ACC add(IN value, ACC accumulator); 每一条输入数据，和迭代数据如何迭代
3. ACC merge(ACC a, ACC b); 多个分区的迭代数据如何合并
4. OUT getResult(ACC accumulator); 返回数据，对最终的迭代数据如何处理，并返回结果。

###### 7.2.3 自定义window的应用(了解)

* 如果time window 和 countWindow 还不够用的话，我们还可以使用自定义window来实现数据的统计等功能。

  ![1584599280754](flink.assets/1584599280754.png)

 



##### 7.3 window窗口数据的集合统计

* 前面我们可以通过aggregrate实现数据的聚合，对于求最大值，最小值，平均值等操作，我们也可以通过process方法来实现

* 对于某一个window内的数值统计，我们可以增量的聚合统计或者全量的聚合统计

###### 7.3.1 增量聚合统计

* 窗口当中每加入一条数据，就进行一次统计

* 常用的聚合算子

  *  reduce(reduceFunction)
  *  aggregate(aggregateFunction)
  *  sum()、min()、max()

  ![flink-window函数增量统计](flink.assets/flink-window函数增量统计.png)

* 需求

  * 通过接收socket当中输入的数据，统计每5秒钟数据的累计的值

* 代码实现

```scala
package com.kaikeba.window

import org.apache.flink.streaming.api.scala.{DataStream, StreamExecutionEnvironment}
import org.apache.flink.streaming.api.windowing.time.Time

object FlinkTimeCount {

  def main(args: Array[String]): Unit = {

      val environment: StreamExecutionEnvironment = StreamExecutionEnvironment.getExecutionEnvironment
      import org.apache.flink.api.scala._
		
      val socketStream: DataStream[String] = environment.socketTextStream("node01",9999)
      /*使用socket发送数据: 
      		23
      		53
      		52
      		743
      	注意：5s很快的。
      	*/
      socketStream.map(x => (1, x.toInt))
                  .keyBy(0)
                  .timeWindow(Time.seconds(5))
                  .reduce((c1,c2)=>(c1._1,c1._2+c2._2))
                  .print()

      environment.execute("FlinkTimeCount")
    }

}


```



###### 7.3.2 全量聚合统计

* **等到窗口截止，或者窗口内的数据全部到齐，然后再进行统计**，可以用于求窗口内的数据的最大值，或者最小值，平均值等

* 等属于窗口的数据到齐，才开始进行聚合计算【可以实现对窗口内的数据进行排序等需求】
  * apply(windowFunction)
  * process(processWindowFunction)
  * processWindowFunction比windowFunction提供了更多的上下文信息。

* 需求
  * 通过全量聚合统计，求取每3条数据的平均值
* 代码实现

```scala
package com.kaikeba.window

import org.apache.flink.api.java.tuple.Tuple
import org.apache.flink.streaming.api.scala.function.ProcessWindowFunction
import org.apache.flink.streaming.api.scala.{DataStream, StreamExecutionEnvironment}
import org.apache.flink.streaming.api.windowing.windows.GlobalWindow
import org.apache.flink.util.Collector

/**
  * 求取每3条数据的平均值
  */
object FlinkCountWindowAvg {
  /**
    * 输入数据
    * 1
    * 2
    * 3
    * 4
    * 5
    * 6
    * @param args
    */
  def main(args: Array[String]): Unit = {
    val environment: StreamExecutionEnvironment = StreamExecutionEnvironment.getExecutionEnvironment

    import org.apache.flink.api.scala._

    val socketStream: DataStream[String] = environment.socketTextStream("node01",9999)

    //统计一个窗口内的数据的平均值
    socketStream.map(x => (1, x.toInt))
                .keyBy(0)
                .countWindow(3)
                //通过process方法来统计窗口的平均值
                .process(new MyProcessWindowFunctionclass)
                .print()

    //必须调用execute方法，否则程序不会执行
    environment.execute("count avg")
  }
}

/**ProcessWindowFunction 需要跟四个参数
  * 输入参数类型，输出参数类型，聚合的key的类型，window的下界
  *
  */
class MyProcessWindowFunctionclass extends ProcessWindowFunction[(Int , Int) , Double , Tuple , GlobalWindow]{

  override def process(key: Tuple, context: Context, elements: Iterable[(Int, Int)], out: Collector[Double]): Unit = {
    var totalNum = 0;
    var countNum = 0;
    for(data <-  elements){
      totalNum +=1
      countNum += data._2
    }
    out.collect(countNum/totalNum)
  }
}
```



## Flink中的Time概念

* 对于流式数据处理，最大的特点是数据上具有时间的属性特征

* Flink根据**时间产生的位置**不同，可以将时间区分为三种时间概念

  * ==Event Time==（事件生成时间）
    * 事件产生的时间，它通常由事件中的时间戳描述
  * ==Ingestion time==（事件接入时间）
    * 事件进入Flink程序的时间
  * ==Processing Time==（事件处理时间）
    * 事件被处理时当前系统的时间


![1569394563906](flink.assets/time.png)

* Flink在流处理程序中支持不同的时间概念。

##### 1.1 EventTime

* 1、**事件生成时的时间**，在进入Flink之前就已经存在，可以从event的字段中抽取
* 2、必须指定watermarks（水位线）的生成方式
* 3、优势：确定性，乱序、延时、或者数据重放等情况，都能给出正确的结果
* 4、弱点：处理无序事件时性能和延迟受到影响

##### 1.2 IngestTime

* 1、**事件进入flink的时间**，即在source里获取的当前系统的时间，后续操作统一使用该时间。

* 2、不需要指定watermarks的生成方式(自动生成)

* 3、弱点：不能处理无序事件和延迟数据

##### 1.3 ProcessingTime

* 1、**执行操作的机器的当前系统时间(每个算子都不一样)**

* 2、不需要流和机器之间的协调

* 3、优势：最佳的性能和最低的延迟

* 4、弱点：不确定性 ，容易受到各种因素影像(event产生的速度、到达flink的速度、在算子之间传输速度等)，压根就不管顺序和延迟

##### 1.4 三种时间的综合比较

* 性能
  *  ProcessingTime > IngestTime > EventTime

* 延迟
  * ProcessingTime < IngestTime < EventTime

* 确定性
  * EventTime > IngestTime > ProcessingTime

##### 1.5 设置 Time 类型

* 可以你的流处理程序是以哪一种时间为标志的。

  * 在我们创建StreamExecutionEnvironment的时候可以设置Time类型，**不设置Time类型，默认是ProcessingTime**。
  * 如果设置Time类型为EventTime或者IngestTime，需要在创建StreamExecutionEnvironment中调用**setStreamTimeCharacteristic()** 方法指定。

  ```scala
  val environment: StreamExecutionEnvironment = StreamExecutionEnvironment.getExecutionEnvironment
  
  //不设置Time 类型，默认是processingTime。
  environment.setStreamTimeCharacteristic(TimeCharacteristic.ProcessingTime);
  
  //指定流处理程序以IngestionTime为准
  //environment.setStreamTimeCharacteristic(TimeCharacteristic.IngestionTime);
  
  //指定流处理程序以EventTime为准
  //environment.setStreamTimeCharacteristic(TimeCharacteristic.EventTime);
  
  
  ```



##### 1.6 ProcessWindowFunction实现时间确定

* 需求

  * 通过process实现处理时间的确定，包括数据时间、window时间等

* 代码开发

  ```scala
  package com.kaikeba.time
  
  import org.apache.commons.lang3.time.FastDateFormat
  import org.apache.flink.api.java.tuple.Tuple
  import org.apache.flink.streaming.api.scala.function.ProcessWindowFunction
  import org.apache.flink.streaming.api.scala.{DataStream, StreamExecutionEnvironment}
  import org.apache.flink.streaming.api.windowing.time.Time
  import org.apache.flink.streaming.api.windowing.windows.TimeWindow
  import org.apache.flink.util.Collector
  
  /**
    * 通过process实现处理时间的确定，包括数据时间，window时间等
    */
  object TimeWindowWordCount {
  
    def main(args: Array[String]): Unit = {
  
      val environment: StreamExecutionEnvironment = StreamExecutionEnvironment.getExecutionEnvironment
      import org.apache.flink.api.scala._
  
      val socketSource: DataStream[String] = environment.socketTextStream("node01",9999)
       //对数据进行处理
      socketSource.flatMap(x => x.split(" "))
                  .map(x =>(x,1))
                  .keyBy(0)
                  .timeWindow(Time.seconds(2),Time.seconds(1))
                  .process(new SumProcessFunction)
                  .print()
  
      environment.execute()
    }
  
  }
  
  class SumProcessFunction extends ProcessWindowFunction[(String,Int),(String,Int),Tuple,TimeWindow]{
  
    val format: FastDateFormat = FastDateFormat.getInstance("HH:mm:ss")
  
    override def process(key: Tuple, context: Context, elements: Iterable[(String, Int)], out: Collector[(String, Int)]): Unit = {
  
      println("当前系统时间为："+format.format(System.currentTimeMillis()))
      println("window的处理时间为："+format.format(context.currentProcessingTime))
      println("window的开始时间为："+format.format(context.window.getStart))
      println("window的结束时间为："+format.format(context.window.getEnd))
      var sum:Int = 0
      for(eachElement <- elements){
        sum += eachElement._2
      }
      out.collect((key.getField(0),sum))
  
    }
  
  }
  
  ```

- 开启netcat服务，启动程序，socket随便发送一个数字,如12，idea内容输出如下：

  ```
  当前系统时间为：14:38:03
  window的处理时间为：14:38:03
  window的开始时间为：14:38:01
  window的结束时间为：14:38:03
  1> (12,1)
  当前系统时间为：14:38:04
  window的处理时间为：14:38:04
  window的开始时间为：14:38:02
  window的结束时间为：14:38:04
  1> (12,1)
  ```

  


## Watermark机制

##### 2.1 Watermark的概念

通常情况下由于网络或者系统等外部因素影响下，**事件数据往往不能及时传输至FLink系统中**，导致系统的不稳定而造成数据**乱序到达或者延迟达到**等问题，因此需要有一种机制能够控制数据处理的进度。

具体来讲，在创建一个基于时间的window后，需要确定属于该window的数据元素是否已经全部到达，确定后才可以对window中的所有数据做计算处理（如汇总、分组），如果数据并没有全部到达，则继续**等待该窗口的数据全部到达后再开始计算**。

但是对于但是对于late element，我们又**不能无限期的等下去**，必须要有个机制来**保证一个特定的时间后，必须触发window去进行计算**了。在这种情况下就需要用到水位线 (Watermark) 机制。

##### 2.2 Watermark的作用

它能够衡量数据处理进度，保证事件数据全部到达Flink系统，即使数据乱序或者延迟到达，也能够像预期一样计算出正确和连续的结果。**通常watermark是结合window来实现**。

##### 2.3 Watermark的原理

在 Flink 的窗口处理过程中，如果确定全部数据到达，就可以对 Window 的所有数据做窗口计算操作（如汇总、分组等），如果数据没有全部到达，则继续等待该窗口中的数据全部到达才开始处理。

这种情况下就需要用到水位线（WaterMarks）机制，它能够衡量数据处理进度（表达数据到达的完整性），保证事件数据（全部）到达Flink系统，或者在乱序及延迟到达时，也能够像预期一样计算出正确并且连续的结果。**当任何 Event 进入到 Flink 系统时，会根据当前最大事件时间产生 Watermarks 时间戳**。 

那么 Flink 是怎么计算 Watermak 的值呢？

* ==Watermark = 进入 Flink 的最大的事件时间（maxEventTime）— 指定的延迟时间（t）==

==那么有 Watermark 的 Window 是怎么触发窗口函数的呢？==

```
（1） watermark >= window的结束时间
（2） 该窗口必须有数据   
  	注意：[window_start_time,window_end_time) 中有数据存在，这是前闭后开区间！！！也就是如果一条数据时间产生时间正好等于窗口的结束时间，它不会计算到该窗口中，会计算到下一个窗口中。
```

==注意==：Watermark 本质可以理解成一个延迟触发机制或者理解成一个时间戳。

##### 2.4 Watermark 的使用存在三种情况 

（1）有序的数据流中的watermark

​	如果数据元素的事件时间是有序的，Watermark 时间戳会随着数据元素的事件时间按顺 序生成，此时水位线的变化和事件时间保持一致（因为既然是**有序的时间，就不需要设置延迟了**，那么t 就是 0。所以 **watermark=maxtime-0 = maxtime**），也就是理想状态下的水位线。当 Watermark 时间大于 Windows 结束时间就会触发对 Windows 的数据计算，以此类推， 下一个 Window 也是一样。

<img src="flink.assets/1584669877499.png" alt="1584669877499" style="zoom:150%;" />

（2）乱序的数据流watermark

现实情况下数据元素往往并不是按照其产生顺序接入到 Flink 系统中进行处理，而频繁出现乱序或迟到的情况，这种情况就需要使用 Watermarks 来应对。比如下图，设置延迟时间 t 为 2

<img src="flink.assets/1584669886227.png" alt="1584669886227" style="zoom:150%;" />

（3）并行数据流中的 Watermark 

在多并行度的情况下，Watermark 会有一个对齐机制，这个对齐机制会**取所有 Channel 中最小的 Watermark**。

![1587869656089](flink.assets/1587869656089.png)



##### 2.5 引入watermark和eventtime

###### 1、有序数据流中引入 Watermark 和 EventTime

* 对于有序的数据，代码比较简洁，主要需要从源 Event 中抽取 EventTime
* 需求
  * 对socket中有序（按照时间递增）的数据流，进行每5s处理一次
* 代码演示

```scala
import org.apache.flink.api.java.tuple.Tuple
import org.apache.flink.streaming.api.TimeCharacteristic
import org.apache.flink.streaming.api.scala.function.ProcessWindowFunction
import org.apache.flink.streaming.api.scala.{DataStream, StreamExecutionEnvironment}
import org.apache.flink.streaming.api.windowing.time.Time
import org.apache.flink.streaming.api.windowing.windows.TimeWindow
import org.apache.flink.util.Collector

object OrderedStreamWaterMark {

  def main(args: Array[String]): Unit = {

      //todo:1.构建流式处理环境
      val environment: StreamExecutionEnvironment = StreamExecutionEnvironment.getExecutionEnvironment
      import org.apache.flink.api.scala._
      environment.setParallelism(1)

     //todo:2.设置时间类型
     environment.setStreamTimeCharacteristic(TimeCharacteristic.EventTime)

    //todo:3.获取数据源
      val sourceStream: DataStream[String] = environment.socketTextStream("node01",9999)

    //todo:4. 数据处理
      val mapStream: DataStream[(String, Long)] = sourceStream.map(x=>(x.split(",")(0),x.split(",")(1).toLong))

    //todo: 5.从源Event中抽取eventTime
      //如果是有序的数据，可以直接使用assignAscendingTimestamps，设置把事件生成时间看成是watermark
      val watermarkStream: DataStream[(String, Long)] = mapStream.assignAscendingTimestamps(x=>x._2)


    //todo:6. 数据计算
     watermarkStream.keyBy(0)
                    .timeWindow(Time.seconds(5))
                    .process(new ProcessWindowFunction[(String, Long),(String,Long),Tuple,TimeWindow] {
                        override def process(key: Tuple, context: Context, elements: Iterable[(String, Long)], out: Collector[(String, Long)]): Unit = {

                          val value: String = key.getField[String](0)

                          //窗口的开始时间
                          val startTime: Long = context.window.getStart
                          //窗口的结束时间
                          val startEnd: Long = context.window.getEnd

                          //获取当前的 watermark
                          val watermark: Long = context.currentWatermark

                          var sum:Long = 0
                          val toList: List[(String, Long)] = elements.toList
                          for(eachElement <-  toList){
                            sum +=1
                          }


                          println("窗口的数据条数:"+sum+
                            " |窗口的第一条数据："+toList.head+
                            " |窗口的最后一条数据："+toList.last+
                            " |窗口的开始时间： "+ startTime+
                            " |窗口的结束时间： "+ startEnd+
                            " |当前的watermark:"+ watermark)

                          out.collect((value,sum))

                        }
              }).print()


    environment.execute()

  }

}
```

socket发送下列数据（第一位是数据，第二位是数据产生的时间event time的时间戳）：

```scala
000001,1461756862000
000001,1461756866000
000001,1461756872000
000001,1461756873000
000001,1461756874000
000001,1461756875000
```

如果socket一次性发送所有数据，输出结果如下：

```scala
窗口的数据条数:1 |窗口的第一条数据：(000001,1461756862000) |窗口的最后一条数据：(000001,1461756862000) |窗口的开始时间： 1461756860000 |窗口的结束时间： 1461756865000 |当前的watermark:1461756873999
(000001,1)
窗口的数据条数:1 |窗口的第一条数据：(000001,1461756866000) |窗口的最后一条数据：(000001,1461756866000) |窗口的开始时间： 1461756865000 |窗口的结束时间： 1461756870000 |当前的watermark:1461756873999
(000001,1)
窗口的数据条数:3 |窗口的第一条数据：(000001,1461756872000) |窗口的最后一条数据：(000001,1461756874000) |窗口的开始时间： 1461756870000 |窗口的结束时间： 1461756875000 |当前的watermark:1461756874999
(000001,3)

```

如果socket缓慢一条条地发送数据，输出结果如下，跟上面基本一样，只是触发计算的watermark的值发生了变化：

```scala
窗口的数据条数:1 |窗口的第一条数据：(000001,1461756862000) |窗口的最后一条数据：(000001,1461756862000) |窗口的开始时间： 1461756860000 |窗口的结束时间： 1461756865000 |当前的watermark:1461756865999
(000001,1)
窗口的数据条数:1 |窗口的第一条数据：(000001,1461756866000) |窗口的最后一条数据：(000001,1461756866000) |窗口的开始时间： 1461756865000 |窗口的结束时间： 1461756870000 |当前的watermark:1461756871999
(000001,1)
窗口的数据条数:3 |窗口的第一条数据：(000001,1461756872000) |窗口的最后一条数据：(000001,1461756874000) |窗口的开始时间： 1461756870000 |窗口的结束时间： 1461756875000 |当前的watermark:1461756874999
(000001,3)
```

注意，**在该案例中，设置了并行度为1**，environment.setParallelism(1)，如果没有设置并行度为1，将不会由输出内容，因为在多并行度时，watermark会取所有channel（分区）中最小的watermark。而在本例中，所有的数据的key都是000001，被分配到同一个分区中，导致其它分区没有数据，从而最终watermark的值太小，不足以触发计算。

###### 2、乱序数据流中引入 Watermark 和 EventTime

对于乱序数据流，有两种常见的引入方法：周期性和间断性

(1)With Periodic（**周期性的**） Watermark  （重点）

周期性地生成 Watermark 的生成，默认是 100ms。每隔 N 毫秒自动向流里注入一个 Watermark，时间间隔由 streamEnv.getConfig.setAutoWatermarkInterval()决定

需求：对socket中无序数据流，进行每5s处理一次，数据中会有延迟

代码演示:

```scala
package com.kaikeba.watermark

import org.apache.flink.api.java.tuple.Tuple
import org.apache.flink.streaming.api.TimeCharacteristic
import org.apache.flink.streaming.api.functions.AssignerWithPeriodicWatermarks
import org.apache.flink.streaming.api.scala.{DataStream, StreamExecutionEnvironment}
import org.apache.flink.streaming.api.scala.function.ProcessWindowFunction
import org.apache.flink.streaming.api.watermark.Watermark
import org.apache.flink.streaming.api.windowing.time.Time
import org.apache.flink.streaming.api.windowing.windows.TimeWindow
import org.apache.flink.util.Collector


//对无序的数据流周期性的添加水印
object OutOfOrderStreamPeriodicWaterMark {

  def main(args: Array[String]): Unit = {


     //todo:1.构建流式处理环境
      val environment: StreamExecutionEnvironment = StreamExecutionEnvironment.getExecutionEnvironment
      import org.apache.flink.api.scala._
      environment.setParallelism(1)


     //todo:2.设置时间类型
     environment.setStreamTimeCharacteristic(TimeCharacteristic.EventTime)

    //todo:3.获取数据源
      val sourceStream: DataStream[String] = environment.socketTextStream("node01",9999)

    //todo:4. 数据处理
      val mapStream: DataStream[(String, Long)] = sourceStream.map(x=>(x.split(",")(0),x.split(",")(1).toLong))


    //todo:5. 添加水位线
    mapStream.assignTimestampsAndWatermarks(
        new AssignerWithPeriodicWatermarks[(String, Long)] {

        //定义延迟时间长度
        //表示在5秒以内的数据延时有效，超过5秒的数据被认定为迟到事件

        val maxOutOfOrderness=5000L
        //历史最大事件时间
        var currentMaxTimestamp:Long=_

        var watermark:Watermark=_

         //周期性的生成水位线watermark
        override def getCurrentWatermark: Watermark ={
          watermark =  new Watermark(currentMaxTimestamp -maxOutOfOrderness)
          watermark
        }

        //抽取事件时间
        override def extractTimestamp(element: (String, Long), previousElementTimestamp: Long): Long ={
            //获取事件时间
            val currentElementEventTime: Long = element._2

            //对比当前事件时间和历史最大事件时间, 将较大值重新赋值给currentMaxTimestamp
            currentMaxTimestamp=Math.max(currentMaxTimestamp,currentElementEventTime)
            println("接受到的事件："+element+" |事件时间： "+currentElementEventTime)

            currentElementEventTime
        }
      })
          .keyBy(0)
          .timeWindow(Time.seconds(5))
          .process(new ProcessWindowFunction[(String, Long),(String,Long),Tuple,TimeWindow] {
            override def process(key: Tuple, context: Context, elements: Iterable[(String, Long)], out: Collector[(String, Long)]): Unit = {


              val value: String = key.getField[String](0)

              //窗口的开始时间
              val startTime: Long = context.window.getStart
              //窗口的结束时间
              val startEnd: Long = context.window.getEnd

              //获取当前的 watermark
              val watermark: Long = context.currentWatermark

              var sum:Long = 0
              val toList: List[(String, Long)] = elements.toList
              for(eachElement <-  toList){
                sum +=1
              }


              println("窗口的数据条数:"+sum+
                " |窗口的第一条数据："+toList.head+
                " |窗口的最后一条数据："+toList.last+
                " |窗口的开始时间： "+  startTime +
                " |窗口的结束时间： "+ startEnd+
                " |当前的watermark:"+watermark)

              out.collect((value,sum))

            }
          }).print()


    environment.execute()

  }


}


```

socket发送数据

```scala
000001,1461756862000
000001,1461756872000
000001,1461756873000
000001,1461756874000
000001,1461756875000
000001,1461756871000
000001,1461756866000
000001,1461756880000
```

输出结果：

```scala
窗口的数据条数:1 |窗口的第一条数据：(000001,1461756862000) |窗口的最后一条数据：(000001,1461756862000) |窗口的开始时间： 1461756860000 |窗口的结束时间： 1461756865000 |当前的watermark:1461756867000
(000001,1)
窗口的数据条数:4 |窗口的第一条数据：(000001,1461756872000) |窗口的最后一条数据：(000001,1461756871000) |窗口的开始时间： 1461756870000 |窗口的结束时间： 1461756875000 |当前的watermark:1461756875000
(000001,4)
```

示意图：

1. 62000进来，窗口坐标从60000开始，62000-5000=57000<65000,没有触发计算
2. 72000进来，72000-5000=67000，触发60000-65000窗口的计算，该窗口包含一条数据。注意，72000进来后，65000-70000窗口被关闭了，后面如果有数据进入到该窗口时，不会被计算。
3. 73000进来，73000-5000=68000<75000，没有触发计算。后面的74000，75000，71000，66000一次类推。
4. 80000进来，80000-5000=75000>=75000,触发窗口70000-75000的计算，该窗口包含4条数据（不包括66000）。

<img src="flink.assets/image-20200509011401960.png" alt="image-20200509011401960" style="zoom:67%;" />



(2)With Punctuated（**间断性的**） Watermark

间断性的生成 Watermark 一般是基于某些事件触发 Watermark 的生成和发送。比如说只给用户id为000001的添加watermark，其他的用户就不添加

需求：对socket中无序数据流，进行每5s处理一次，数据中会有延迟

代码演示

```scala
package com.kaikeba.watermark

import org.apache.commons.lang3.time.FastDateFormat
import org.apache.flink.api.common.functions.MapFunction
import org.apache.flink.api.java.tuple.Tuple
import org.apache.flink.streaming.api.TimeCharacteristic
import org.apache.flink.streaming.api.functions.{AssignerWithPeriodicWatermarks, AssignerWithPunctuatedWatermarks}
import org.apache.flink.streaming.api.scala.{DataStream, StreamExecutionEnvironment}
import org.apache.flink.streaming.api.scala.function.ProcessWindowFunction
import org.apache.flink.streaming.api.watermark.Watermark
import org.apache.flink.streaming.api.windowing.time.Time
import org.apache.flink.streaming.api.windowing.windows.TimeWindow
import org.apache.flink.util.Collector

//对无序的数据流间断性的添加水印
object OutOfOrderStreamPunctuatedWaterMark {

  def main(args: Array[String]): Unit = {


    //todo:1.构建流式处理环境
    val environment: StreamExecutionEnvironment = StreamExecutionEnvironment.getExecutionEnvironment
    import org.apache.flink.api.scala._
    environment.setParallelism(1)


    //todo:2.设置时间类型
    environment.setStreamTimeCharacteristic(TimeCharacteristic.EventTime)

    //todo:3.获取数据源
    val sourceStream: DataStream[String] = environment.socketTextStream("node01",9999)

    //todo:4. 数据处理
    val mapStream: DataStream[(String, Long)] = sourceStream.map(x=>(x.split(",")(0),x.split(",")(1).toLong))


    //todo:5. 添加水位线
    mapStream.assignTimestampsAndWatermarks(
      new AssignerWithPunctuatedWatermarks[(String, Long)] {

        //定义延迟时间长度
        //表示在5秒以内的数据延时有效，超过5秒的数据被认定为迟到事件
        val maxOutOfOrderness=5000L
        //历史最大事件时间
        var currentMaxTimestamp:Long=_

        override def checkAndGetNextWatermark(lastElement: (String, Long), extractedTimestamp: Long): Watermark ={
                //当用户id为000001生成watermark
               if(lastElement._1.equals("000001")){

                  val watermark=  new Watermark(currentMaxTimestamp-maxOutOfOrderness)

                  watermark
               }else{
                 //其他情况下不返回水位线
                  null
               }

        }

        override def extractTimestamp(element: (String, Long), previousElementTimestamp: Long): Long = {
          //获取事件时间
          val currentElementEventTime: Long = element._2

          //对比当前事件时间和历史最大事件时间, 将较大值重新赋值给currentMaxTimestamp
          currentMaxTimestamp=Math.max(currentMaxTimestamp,currentElementEventTime)

          println("接受到的事件："+element+" |事件时间： "+currentElementEventTime )

          currentElementEventTime

        }
      })
      .keyBy(0)
      .timeWindow(Time.seconds(5))
      .process(new ProcessWindowFunction[(String, Long),(String,Long),Tuple,TimeWindow] {
          override def process(key: Tuple, context: Context, elements: Iterable[(String, Long)], out: Collector[(String, Long)]): Unit = {

            val value: String = key.getField[String](0)

            //窗口的开始时间
            val startTime: Long = context.window.getStart
            //窗口的结束时间
            val startEnd: Long = context.window.getEnd

            //获取当前的 watermark
            val watermark: Long = context.currentWatermark

            var sum:Long = 0
            val toList: List[(String, Long)] = elements.toList
            for(eachElement <-  toList){
              sum +=1
            }

            println("窗口的数据条数:"+sum+
              " |窗口的第一条数据："+toList.head+
              " |窗口的最后一条数据："+toList.last+
              " |窗口的开始时间： "+startTime +
              " |窗口的结束时间： "+startEnd+
              " |当前的watermark:"+watermark)

            out.collect((value,sum))

          }
        }).print()


    environment.execute()


  }


}

```

socket发送数据

```scala
000002,1461756866000
000002,1461756872000
000001,1461756872000
000002,1461756875000     //不会触发计算
000001,1461756875000     //触发计算
000001,1461756880000     //触发计算，因为keyBy(0)分组的原因，000002和000001的数据会分开计算。
```

输出结果：

```scala
窗口的数据条数:1 |窗口的第一条数据：(000002,1461756866000) |窗口的最后一条数据：(000002,1461756866000) |窗口的开始时间： 1461756865000 |窗口的结束时间： 1461756870000 |当前的watermark:1461756870000
(000002,1)
窗口的数据条数:1 |窗口的第一条数据：(000002,1461756872000) |窗口的最后一条数据：(000002,1461756872000) |窗口的开始时间： 1461756870000 |窗口的结束时间： 1461756875000 |当前的watermark:1461756875000
(000002,1)
窗口的数据条数:1 |窗口的第一条数据：(000001,1461756872000) |窗口的最后一条数据：(000001,1461756872000) |窗口的开始时间： 1461756870000 |窗口的结束时间： 1461756875000 |当前的watermark:1461756875000
(000001,1)
```




###### 3、Window 的allowedLateness处理延迟太大的数据

基于 Event-Time 的窗口处理流式数据，虽然提供了 Watermark 机制，却只能在**一定程度上解决了数据乱序的问题**。但在某些情况下**数据可能延时会非常严重**，即使通过 Watermark 机制也无法等到数据全部进入窗口再进行处理。

Flink 中**默认会将这些迟到的数据做丢弃处理**，但是有些时候用户希望即使数据延迟到达的情况下，也能够正常按照流程处 理并输出结果，此时就需要使用 **Allowed Lateness 机制**来对迟到的数据进行额外的处理。

迟到数据的处理机制

* 1、直接丢弃

* 2、指定允许再次迟到的时间

  ```scala
  //例如
  assignTimestampsAndWatermarks(new EventTimeExtractor() )
                  .keyBy(0)
                  .timeWindow(Time.seconds(3))
                  .allowedLateness(Time.seconds(2)) // 允许事件再迟到2秒
                  .process(new SumProcessWindowFunction())
                  .print().setParallelism(1);
  
  
  //注意：
  //（1）. 当我们设置允许迟到2秒的事件，第一次 window 触发的条件是 watermark >= window_end_time
  //（2）. 第二次(或者多次)触发的条件是watermark < window_end_time + allowedLateness
  
  ```

* 3、收集迟到太多的数据

  ```scala
  //例如
  assignTimestampsAndWatermarks(new EventTimeExtractor() )
                  .keyBy(0)
                  .timeWindow(Time.seconds(3))
                  .allowedLateness(Time.seconds(2)) //允许事件再迟到2秒
                  .sideOutputLateData(outputTag)   //收集迟到太多的数据
                  .process(new SumProcessWindowFunction())
                  .print().setParallelism(1);
  ```

代码演示:指定允许再次迟到的时间，并收集迟到太多的数据。

```scala
package com.kaikeba.watermark

import org.apache.commons.lang3.time.FastDateFormat
import org.apache.flink.api.common.functions.MapFunction
import org.apache.flink.api.java.tuple.Tuple
import org.apache.flink.streaming.api.TimeCharacteristic
import org.apache.flink.streaming.api.functions.AssignerWithPeriodicWatermarks
import org.apache.flink.streaming.api.scala.{DataStream, OutputTag, StreamExecutionEnvironment}
import org.apache.flink.streaming.api.scala.function.ProcessWindowFunction
import org.apache.flink.streaming.api.watermark.Watermark
import org.apache.flink.streaming.api.windowing.time.Time
import org.apache.flink.streaming.api.windowing.windows.TimeWindow
import org.apache.flink.util.Collector

//运行数据再次延延迟一段时间，并且对延迟太多的数据进行收集
object AllowedLatenessTest {

  def main(args: Array[String]): Unit = {
      //todo:1.构建流式处理环境
      val environment: StreamExecutionEnvironment = StreamExecutionEnvironment.getExecutionEnvironment
      import org.apache.flink.api.scala._
      environment.setParallelism(1)


     //todo:2.设置时间类型
     environment.setStreamTimeCharacteristic(TimeCharacteristic.EventTime)

    //todo:3.获取数据源
      val sourceStream: DataStream[String] = environment.socketTextStream("node01",9999)

    //todo:4. 数据处理
      val mapStream: DataStream[(String, Long)] = sourceStream.map(x=>(x.split(",")(0),x.split(",")(1).toLong))

    //定义一个侧输出流的标签，用于收集迟到太多的数据
      val lateTag=new OutputTag[(String, Long)]("late")

    //todo:5.  数据计算--添加水位线
    val result: DataStream[(String, Long)] = mapStream.assignTimestampsAndWatermarks(
            new AssignerWithPeriodicWatermarks[(String, Long)] {

              //定义延迟时间长度
              //表示在5秒以内的数据延时有效，超过5秒的数据被认定为迟到事件
              val maxOutOfOrderness = 5000L
              //历史最大事件时间
              var currentMaxTimestamp: Long = _


              //周期性的生成水位线watermark
              override def getCurrentWatermark: Watermark = {
                val watermark = new Watermark(currentMaxTimestamp - maxOutOfOrderness)
                watermark
              }

              //抽取事件时间
              override def extractTimestamp(element: (String, Long), previousElementTimestamp: Long): Long = {
                //获取事件时间
                val currentElementEventTime: Long = element._2

                //对比当前事件时间和历史最大事件时间, 将较大值重新赋值给currentMaxTimestamp
                currentMaxTimestamp = Math.max(currentMaxTimestamp, currentElementEventTime)

                println("接受到的事件：" + element + " |事件时间： " + currentElementEventTime )

                currentElementEventTime
              }
      })
              .keyBy(0)
              .timeWindow(Time.seconds(5))
              .allowedLateness(Time.seconds(2)) //运行数据再次延迟2s
              .sideOutputLateData(lateTag)     //收集延迟大多的数据
              .process(new ProcessWindowFunction[(String, Long), (String, Long), Tuple, TimeWindow] {
                        override def process(key: Tuple, context: Context, elements: Iterable[(String, Long)], out: Collector[(String, Long)]): Unit = {

                          val value: String = key.getField[String](0)

                          //窗口的开始时间
                          val startTime: Long = context.window.getStart
                          //窗口的结束时间
                          val startEnd: Long = context.window.getEnd

                          //获取当前的 watermark
                          val watermark: Long = context.currentWatermark

                          var sum: Long = 0
                          val toList: List[(String, Long)] = elements.toList

                          for (eachElement <- toList) {
                            sum += 1
                          }


                          println("窗口的数据条数:" + sum +
                            " |窗口的第一条数据：" + toList.head +
                            " |窗口的最后一条数据：" + toList.last +
                            " |窗口的开始时间： " + startTime +
                            " |窗口的结束时间： " + startEnd +
                            " |当前的watermark:" + watermark)

                          out.collect((value, sum))

              }
            })

    //打印延迟太多的数据   侧输出流:主要用于保存延迟太长的数据
    result.getSideOutput(lateTag).print("late")

    //打印
    result.print("ok")

    environment.execute()

  }

}

```

发送数据

```scala
000001,1461756862000
000001,1461756866000
000001,1461756868000
000001,1461756869000
000001,1461756870000
000001,1461756862000
000001,1461756871000
000001,1461756872000
000001,1461756862000
000001,1461756863000
```

输出结果：

```scala
接受到的事件：(000001,1461756862000) |事件时间： 1461756862000
接受到的事件：(000001,1461756866000) |事件时间： 1461756866000
接受到的事件：(000001,1461756868000) |事件时间： 1461756868000
接受到的事件：(000001,1461756869000) |事件时间： 1461756869000
接受到的事件：(000001,1461756870000) |事件时间： 1461756870000
窗口的数据条数:1 |窗口的第一条数据：(000001,1461756862000) |窗口的最后一条数据：(000001,1461756862000) |窗口的开始时间： 1461756860000 |窗口的结束时间： 1461756865000 |当前的watermark:1461756865000
ok> (000001,1)
接受到的事件：(000001,1461756862000) |事件时间： 1461756862000    //第二次触发同一个窗口
窗口的数据条数:2 |窗口的第一条数据：(000001,1461756862000) |窗口的最后一条数据：(000001,1461756862000) |窗口的开始时间： 1461756860000 |窗口的结束时间： 1461756865000 |当前的watermark:1461756865000
ok> (000001,2)
接受到的事件：(000001,1461756871000) |事件时间： 1461756871000
接受到的事件：(000001,1461756872000) |事件时间： 1461756872000
接受到的事件：(000001,1461756862000) |事件时间： 1461756862000
late> (000001,1461756862000)
接受到的事件：(000001,1461756863000) |事件时间： 1461756863000
late> (000001,1461756863000)

Process finished with exit code -1
//第二次触发（多次触发条件）：watermark < window_end_time + allowedLateness
```




###### 4、多并行度下的WaterMark

![1587869656089](flink.assets/1587869656089.png)

本地测试的过程中，如果**不设置并行度的话，默认读取本机CPU数量设置并行度**，可以手动设置并行度environment.setParallelism(1)，每一个线程都会有一个watermark.

**多并行度的情况下,一个window可能会接受到多个不同线程waterMark**。watermark对齐会取所有channel最小的watermark，以最小的watermark为准。

案例演示：以周期性WaterMark为例，修改并行度为2

```java
package com.kaikeba.watermark

import org.apache.flink.api.java.tuple.Tuple
import org.apache.flink.streaming.api.TimeCharacteristic
import org.apache.flink.streaming.api.functions.AssignerWithPeriodicWatermarks
import org.apache.flink.streaming.api.scala.{DataStream, StreamExecutionEnvironment}
import org.apache.flink.streaming.api.scala.function.ProcessWindowFunction
import org.apache.flink.streaming.api.watermark.Watermark
import org.apache.flink.streaming.api.windowing.time.Time
import org.apache.flink.streaming.api.windowing.windows.TimeWindow
import org.apache.flink.util.Collector

/**
  * 得到并打印每隔 5 秒钟统计前 5秒内的相同的 key 的所有的事件
  * 测试多并行度下的watermark
  */
object WaterMarkWindowWithMultipart {

  def main(args: Array[String]): Unit = {


    //todo:1.构建流式处理环境
    val environment: StreamExecutionEnvironment = StreamExecutionEnvironment.getExecutionEnvironment
    import org.apache.flink.api.scala._
    
    //设置并行度为2
    environment.setParallelism(2)


    //todo:2.设置时间类型
    environment.setStreamTimeCharacteristic(TimeCharacteristic.EventTime)

    //todo:3.获取数据源
    val sourceStream: DataStream[String] = environment.socketTextStream("node01",9999)

    //todo:4. 数据处理
    val mapStream: DataStream[(String, Long)] = sourceStream.map(x=>(x.split(",")(0),x.split(",")(1).toLong))

    //todo:5. 添加水位线
    mapStream.assignTimestampsAndWatermarks(
      new AssignerWithPeriodicWatermarks[(String, Long)] {

        //定义延迟时间长度
        //表示在5秒以内的数据延时有效，超过5秒的数据被认定为迟到事件

        val maxOutOfOrderness=5000L
        //历史最大事件时间
        var currentMaxTimestamp:Long=_


        //周期性的生成水位线watermark
        override def getCurrentWatermark: Watermark ={
         val  watermark =  new Watermark(currentMaxTimestamp -maxOutOfOrderness)
          watermark
        }

        //抽取事件时间
        override def extractTimestamp(element: (String, Long), previousElementTimestamp: Long): Long ={
          //获取事件时间
          val currentElementEventTime: Long = element._2

          //对比当前事件时间和历史最大事件时间, 将较大值重新赋值给currentMaxTimestamp
          currentMaxTimestamp=Math.max(currentMaxTimestamp,currentElementEventTime)

          val id: Long = Thread.currentThread.getId
          println("当前的线程id:"+id+" |接受到的事件："+element+" |事件时间： "+currentElementEventTime+" |当前值的watermark:"+getCurrentWatermark().getTimestamp())

          currentElementEventTime
        }
      })
      .keyBy(0)
      .timeWindow(Time.seconds(5))
      .process(new ProcessWindowFunction[(String, Long),(String,Long),Tuple,TimeWindow] {
        override def process(key: Tuple, context: Context, elements: Iterable[(String, Long)], out: Collector[(String, Long)]): Unit = {

          val value: String = key.getField[String](0)

          //窗口的开始时间
          val startTime: Long = context.window.getStart
          //窗口的结束时间
          val startEnd: Long = context.window.getEnd

          //获取当前的 watermark
          val watermark: Long = context.currentWatermark

          var sum:Long = 0
          val toList: List[(String, Long)] = elements.toList
          for(eachElement <-  toList){
            sum +=1
          }


          println("窗口的数据条数:"+sum+
            " |窗口的第一条数据："+toList.head+
            " |窗口的最后一条数据："+toList.last+
            " |窗口的开始时间： "+  startTime +
            " |窗口的结束时间： "+ startEnd+
            " |当前的watermark:"+ watermark)

          out.collect((value,sum))

        }
      }).print()


    environment.execute()

  }
}

```

输入数据

```java
000001,1461756862000
000001,1461756864000
000001,1461756866000
000001,1461756870000
000001,1461756871000
```

输出结果

```java
当前的线程id:65 |接受到的事件：(000001,1461756862000) |事件时间： 1461756862000 |当前值的watermark:1461756857000
当前的线程id:64 |接受到的事件：(000001,1461756864000) |事件时间： 1461756864000 |当前值的watermark:1461756859000
当前的线程id:65 |接受到的事件：(000001,1461756866000) |事件时间： 1461756866000 |当前值的watermark:1461756861000
当前的线程id:64 |接受到的事件：(000001,1461756870000) |事件时间： 1461756870000 |当前值的watermark:1461756865000
当前的线程id:65 |接受到的事件：(000001,1461756871000) |事件时间： 1461756871000 |当前值的watermark:1461756866000
窗口的数据条数:2 |窗口的第一条数据：(000001,1461756862000) |窗口的最后一条数据：(000001,1461756864000) |窗口的开始时间： 1461756860000 |窗口的结束时间： 1461756865000 |当前的watermark:1461756865000
2> (000001,2)
```

结果分析

![Flink的多并行度watermark分析](flink.assets/Flink的多并行度watermark分析.png)



## Flink的Table和SQL

##### 3.1 Table与SQL基本介绍

在Spark中有DataFrame这样的关系型编程接口，因其强大且灵活的表达能力，能够让用户通过非常丰富的接口对数据进行处理，有效降低了用户的使用成本。

**Flink也提供了关系型编程接口 Table API 以及基于Table API 的 SQL API**，让用户能够通过使用结构化编程接口高效地构建Flink应用。同时Table API 以及 SQL 能够统一处理批量和实时计算业务， 无须切换修改任何应用代码就能够基于同一套 API 编写流式应用和批量应用，从而**达到真正意义的批流统一**。

* ==Apache Flink 具有两个关系型API：Table API 和SQL，用于统一流和批处理==
* Table API 是用于 Scala 和 Java 语言的查询API，允许以非常直观的方式组合关系运算符的查询，例如 select，filter 和 join。Flink SQL 的支持是基于实现了SQL标准的 Apache Calcite。无论输入是批输入（DataSet）还是流输入（DataStream），任一接口中指定的查询都具有相同的语义并指定相同的结果。
* Table API和SQL接口彼此集成，Flink的DataStream和DataSet API亦是如此。我们可以轻松地在基于API构建的所有API和库之间切换。
* 注意，到目前最新版本为止，==Table API和SQL还有很多功能正在开发中。 并非[Table API，SQL]和[stream，batch]输入的每种组合都支持所有操作==



![1587954297942](flink.assets/1587954297942.png)



##### 3.2 为什么需要SQL

* Table API 是一种关系型API，类 SQL 的API，用户可以像操作表一样地操作数据， 非常的直观和方便。

* SQL 作为一个"人所皆知"的语言，如果一个引擎提供 SQL，它将很容易被人们接受。这已经是业界很常见的现象了。

* Table & SQL API 还有另一个职责，就是**流处理和批处理统一的API层**。

* 无论那套api，底层的引擎core都是Runtime流处理引擎。

  ![1587955069138](flink.assets/1587955069138.png)



##### 3.3 开发环境构建

* 在 Flink 1.9 中，Table 模块迎来了核心架构的升级，**引入了阿里巴巴 Blink 团队贡献的诸多功能**，取名叫： Blink Planner。

* 在使用 Table API 和 SQL 开发 Flink 应用之前，通过添加 Maven 的依赖配置到项目中，在本地工程中引入相应的依赖库，库中包含了 Table API 和 SQL 接口。 

* 添加pom依赖

  ```xml
          <dependency>
              <groupId>org.apache.flink</groupId>
              <artifactId>flink-table-planner_2.11</artifactId>
              <version>1.9.2</version>
          </dependency>
  
          <dependency>
              <groupId>org.apache.flink</groupId>
              <artifactId>flink-table-api-scala-bridge_2.11</artifactId>
              <version>1.9.2</version>
          </dependency>
  ```



##### 3.4 TableEnvironment构建

和 DataStream API 一样，**Table API 和 SQL 中具有相同的基本编程模型**。首先需要构建对应的 TableEnviroment 创建关系型编程环境，才能够在程序中使用 Table API 和 SQL来编写应用程序，另外 **Table API 和 SQL 接口可以在应用中同时使用**，Flink SQL 基于 Apache Calcite 框架实现了 SQL 标准协议，是构建在 Table API 之上的更高级接口。 

首先需要在环境中创建 TableEnvironment 对象，TableEnvironment 中提供了注册内部表、执行 Flink SQL 语句、注册自定义函数等功能。根据应用类型的不同，TableEnvironment 创建方式也有所不同，但是**都是通过调用 create()方法创建**。 

方式1、流计算环境下创建 TableEnviroment

```scala
//初始化Flink的Streaming（流计算）上下文执行环境 
val streamEnv: StreamExecutionEnvironment = StreamExecutionEnvironment.getExecutionEnvironment 
//初始化Table API的上下文环境 
val tableEvn =StreamTableEnvironment.create(streamEnv)
```

方式2、在 Flink1.9 之后由于引入了 Blink Planner

```scala
val bsSettings = EnvironmentSettings.newInstance().useOldPlanner().inStreamingMode().build() 
val bsTableEnv = StreamTableEnvironment.create(streamEnv, bsSettings)
```

注意

* Flink 社区完整保留原有 Flink Planner (Old Planner)，同时又引入了新的Blink Planner，用户可以自行选择使用 Old Planner 还是 Blink Planner。官方推荐暂时使用 Old Planner。



##### 3.5 Table API 

在 Flink 中创建一张表有两种方法： 

* （1）从一个文件中导入表结构（Structure）（常用于批计算）（静态） 
* （2）从 DataStream 或者 DataSet 转换成 Table （动态）



###### 3.5.1 创建 Table

Table API 中已经提供了 TableSource 从外部系统获取数据，例如常见的数据库、文件系统和 Kafka 消息队列等外部系统。

**1、从文件中创建 Table（静态表）**

需求：读取csv文件，文件内容参见课件当中的flinksql.csv文件，查询年龄大于18岁的人，并将结果写入到csv文件里面去，这里涉及到flink的connect的各种与其他外部系统的连接，参见https://ci.apache.org/projects/flink/flink-docs-release-1.9/dev/table/connect.html

代码开发 

```scala
package com.kaikeba.table

import org.apache.flink.api.common.typeinfo.TypeInformation
import org.apache.flink.core.fs.FileSystem.WriteMode
import org.apache.flink.streaming.api.scala.{DataStream, StreamExecutionEnvironment}
import org.apache.flink.table.api.{Table, Types}
import org.apache.flink.table.api.scala.StreamTableEnvironment
import org.apache.flink.table.sinks.CsvTableSink
import org.apache.flink.table.sources.CsvTableSource
import org.apache.flink.api.scala._
/**
  * flink table加载csv文件
  */
object TableCsvSource {

  def main(args: Array[String]): Unit = {
     //todo:1、构建流处理环境
      val environment: StreamExecutionEnvironment = StreamExecutionEnvironment.getExecutionEnvironment

    //todo:2、构建TableEnvironment
    val tableEnvironment: StreamTableEnvironment = StreamTableEnvironment.create(environment)


    //todo:3、构建csv数据源
    val csvSource = CsvTableSource.builder().path("E:\\flinksql.csv")
                                   .field("id", Types.INT())
                                   .field("name", Types.STRING())
                                   .field("age", Types.INT())
                                   .fieldDelimiter(",") //字段的分隔符
                                   .ignoreParseErrors() //忽略解析错误
                                   .ignoreFirstLine()   //忽略第一行
                                   .build()

    //todo:4、注册表
    tableEnvironment.registerTableSource("myUser", csvSource)

    //todo: 5、查询结果
    val result: Table = tableEnvironment.scan("myUser").filter("age>25").select("id,name,age")
    result.printSchema()

    //todo: 6、构建Sink，第3个参数为文件个数numFiles
    val tableSink = new CsvTableSink("./out/tableSink.txt","\t",1,WriteMode.OVERWRITE)

    //todo:7、注册sink,参数解释： (name,字段name,字段type, tablesink)
    tableEnvironment.registerTableSink("csvOutputTable",
                                        Array[String]("f1","f2","f3"),
                                        Array[TypeInformation[_]](Types.INT,Types.STRING,Types.INT) ,
                                        tableSink)

    //todo:8、写数据到sink
    result.insertInto("csvOutputTable")

    environment.execute("TableCsvSource")   //TableCsvSource是object的名称

  }
}


```

输出结果：

```
root
 |-- id: INT
 |-- name: STRING
 |-- age: INT
```

查看sink产生的文件：

![image-20200509161734040](flink.assets/image-20200509161734040.png)





**2、从DataStream中创建 Table（动态表）**

需求：使用TableApi完成基于流数据的处理

代码开发

```scala
package com.kaikeba.table

import org.apache.flink.streaming.api.scala.{DataStream, StreamExecutionEnvironment}
import org.apache.flink.table.api.{Table, Types}
import org.apache.flink.table.api.scala.StreamTableEnvironment
import org.apache.flink.types.Row


/**
  * 使用TableApi完成基于流数据的处理
  */
object TableFromDataStream {

  //todo:定义样例类
  case class User(id:Int,name:String,age:Int)


  def main(args: Array[String]): Unit = {

     //todo:1、构建流处理环境
        val streamEnv: StreamExecutionEnvironment = StreamExecutionEnvironment.getExecutionEnvironment
    streamEnv.setParallelism(1)

     //todo:2、构建TableEnvironment
        val tableEnvironment: StreamTableEnvironment = StreamTableEnvironment.create(streamEnv)
        import org.apache.flink.api.scala._

    /**
      * 101,zhangsan,18
      * 102,lisi,28
      * 103,wangwu,25
      * 104,zhaoliu,30
      */
     //todo:3、接受socket数据
        val socketStream: DataStream[String] = streamEnv.socketTextStream("node01",9999)

     //todo:4、对数据进行处理
       val userStream: DataStream[User] = socketStream.map(x=>x.split(",")).map(x=>User(x(0).toInt,x(1),x(2).toInt))

     //todo:5、将流注册成一张表
      tableEnvironment.registerDataStream("userTable",userStream)

    //todo:6、使用table 的api查询年龄大于20岁的人
      val result:Table = tableEnvironment.scan("userTable").filter("age >20")


    //todo：7、将table转化成流
     tableEnvironment.toAppendStream[Row](result).print()


    //todo:8、启动
     tableEnvironment.execute("TableFromDataStream")

  }

}

```

发送数据

```shell
nc -lk 9999


101,zhangsan,18
102,lisi,28
103,wangwu,25
104,zhaoliu,30
```

DataStream转换成Table的逻辑：

* 构建StreamExecutionEnvironment和StreamTableEnvironment对象
  * StreamTableEnvironment.fromDataStream(dataStream: DataStream)
  * StreamTableEnvironment.registerDataStream(dataStream: DataStream)


* 更多的table API操作详细见官网

  * <https://ci.apache.org/projects/flink/flink-docs-release-1.10/dev/table/tableApi.html>

  ![1588043744183](flink.assets/1588043744183.png)



###### 3.5.2   Table中的window

Flink 支持 ProcessTime、EventTime 和 IngestionTime 三种时间概念，针对每种时间概念，Flink Table API 中使用 Schema 中单独的字段来表示时间属性，当时间字段被指定后，就可以在基于时间的操作算子中使用相应的时间属性。 

在 **Table API 中通过使用.rowtime 来定义 EventTime 字段**，在 ProcessTime 时间字段名后使用.proctime 后缀来指定 ProcessTime 时间属性

需求：统计最近 5 秒钟，每个单词出现的次数

代码开发

```scala
package com.kaikeba.table

import org.apache.flink.streaming.api.TimeCharacteristic
import org.apache.flink.streaming.api.functions.AssignerWithPeriodicWatermarks
import org.apache.flink.streaming.api.scala.{DataStream, StreamExecutionEnvironment}
import org.apache.flink.streaming.api.watermark.Watermark
import org.apache.flink.table.api.{GroupWindowedTable, Table, Tumble}
import org.apache.flink.table.api.scala.StreamTableEnvironment
import org.apache.flink.types.Row

/**
  * 基于table的window窗口操作处理延迟数据
  */
object TableWindowWaterMark {

  //定义样例类
  case class Message(word:String,createTime:Long)

  def main(args: Array[String]): Unit = {
    //todo:1、构建流处理环境
     val streamEnv: StreamExecutionEnvironment = StreamExecutionEnvironment.getExecutionEnvironment
    streamEnv.setParallelism(1)

      import org.apache.flink.api.scala._

    //指定EventTime为时间语义
     streamEnv.setStreamTimeCharacteristic(TimeCharacteristic.EventTime)

   //todo: 2、构建StreamTableEnvironment
      val tableEnvironment: StreamTableEnvironment = StreamTableEnvironment.create(streamEnv)

  //todo： 3、接受socket数据
      val sourceStream: DataStream[String] = streamEnv.socketTextStream("node01",9999)

  //todo: 4、数据切分处理
    val mapStream: DataStream[Message] = sourceStream.map(x=>Message(x.split(",")(0),x.split(",")(1).toLong))

   //todo: 5、添加watermark
    val watermarksStream: DataStream[Message] = mapStream.assignTimestampsAndWatermarks(new AssignerWithPeriodicWatermarks[Message] {

      //定义延迟时长
      val maxOutOfOrderness = 5000L
      //历史最大事件时间
      var currentMaxTimestamp: Long = _

      override def getCurrentWatermark: Watermark = {
        val watermark = new Watermark(currentMaxTimestamp - maxOutOfOrderness)
        watermark
      }

      override def extractTimestamp(element: Message, previousElementTimestamp: Long): Long = {

        val eventTime: Long = element.createTime
        currentMaxTimestamp = Math.max(eventTime, currentMaxTimestamp)
        eventTime
      }
    })

    
    //todo:6、构建Table , 设置时间属性
    import org.apache.flink.table.api.scala._
     val table: Table = tableEnvironment.fromDataStream(watermarksStream,'word,'createTime.rowtime)


    //todo:7、添加window
        //滚动窗口第一种写法
    //val windowedTable: GroupWindowedTable = table.window(Tumble.over("5.second").on("createTime").as("window"))

       //滚动窗口的第二种写法,  as 'window用于设置窗口的名称，随便取个名字就行
   val windowedTable: GroupWindowedTable = table.window(Tumble over 5.second on 'createTime as 'window)

    //todo:8、对窗口数据进行处理
                                          // 使用2个字段分组，窗口名称和单词
    val result: Table = windowedTable.groupBy('window,'word)
                                              //单词、窗口的开始、结束e、聚合计算
                                         .select('word,'window.start,'window.end,'word.count)


     //todo:9、将table转换成DataStream
     val resultStream: DataStream[(Boolean, Row)] = tableEnvironment.toRetractStream[Row](result)

     resultStream.filter(x =>x._1 ==true).print()

     tableEnvironment.execute("table")
  }
}

```

发送数据

```scala
hadoop,1461756862000
hadoop,1461756866000
hadoop,1461756864000
hadoop,1461756870000
hadoop,1461756875000
```

输出结果：

```scala
hadoop,2016-04-27 11:34:20.0,2016-04-27 11:34:25.0,2
hadoop,2016-04-27 11:34:25.0,2016-04-27 11:34:30.0,1
```



##### 3.6 SQL使用

SQL 作为 Flink 中提供的接口之一，占据着非常重要的地位，主要是因为 SQL 具有灵活和丰富的语法，能够应用于大部分的计算场景。

Flink SQL 底层使用 Apache Calcite 框架， **将标准的 Flink SQL 语句解析并转换成底层的算子处理逻辑**，并在转换过程中基于语法规则层面进行性能优化，比如谓词下推等。另外用户在使用 SQL 编写 Flink 应用时，能够屏蔽底层技术细节，能够更加方便且高效地通过SQL语句来构建Flink应用。

Flink SQL构建在Table API 之上，并含盖了大部分的 Table API 功能特性。**同时 Flink SQL 可以和 Table API 混用**，Flink 最终会在整体上将代码合并在同一套代码逻辑中

###### 3.6.1 SQL操作

代码开发演示

```scala
package com.kaikeba.table

import org.apache.flink.streaming.api.scala.{DataStream, StreamExecutionEnvironment}
import org.apache.flink.table.api.Table
import org.apache.flink.table.api.scala.StreamTableEnvironment
import org.apache.flink.types.Row

object FlinkSQLTest {

  //todo:定义样例类
  case class User(id:Int,name:String,age:Int)

  def main(args: Array[String]): Unit = {

     //todo:1、构建流处理环境
        val streamEnv: StreamExecutionEnvironment = StreamExecutionEnvironment.getExecutionEnvironment
    streamEnv.setParallelism(1)

     //todo:2、构建TableEnvironment
        val tableEnvironment: StreamTableEnvironment = StreamTableEnvironment.create(streamEnv)
        import org.apache.flink.api.scala._

    /**
      * 101,zhangsan,18
      * 102,lisi,20
      * 103,wangwu,25
      * 104,zhaoliu,15
      */
     //todo:3、接受socket数据
        val socketStream: DataStream[String] = streamEnv.socketTextStream("node01",9999)

     //todo:4、对数据进行处理
       val userStream: DataStream[User] = socketStream.map(x=>x.split(",")).map(x=>User(x(0).toInt,x(1),x(2).toInt))

     //todo:5、将流注册成一张表
      tableEnvironment.registerDataStream("userTable",userStream)

    //todo:6、使用table 的api查询年龄大于20岁的人
      val result:Table = tableEnvironment.sqlQuery("select * from userTable where age>20")


    //todo：7、将table转化成流
     tableEnvironment.toAppendStream[Row](result).print()


    //todo:8、启动
     tableEnvironment.execute("TableFromDataStream")

  }

}

```

发送数据：

```scala
nc -lk 9999


101,zhangsan,18
102,lisi,28
103,wangwu,25
104,zhaoliu,30
```

将Table转换成为DataStream的两种模式

* 第一种方式：AppendMode

  ```
       将表附加到流数据，表当中只能有查询或者添加操作，如果有update或者delete操作，那么就会失败。
       只有在动态Table仅通过INSERT时才能使用此模式，即它仅附加，并且以前发出的结果永远不会更新。如果更新或删除操作使用追加模式会失败报错。
  ```

* 第二种模式：RetraceMode

  ```
       始终可以使用此模式。返回值是boolean类型。它用true或false来标记数据的插入和撤回，返回true代表数据插入，false代表数据的撤回。
  ```



###### 3.6.2 SQL中的window

Flink SQL 也支持三种窗口类型，分别为 Tumble Windows、HOP Windows 和 Session Windows，其中 HOP Windows 对应 Table API 中的 Sliding Window，同时每种窗口分别有相应的使用场景和方法。

需求：统计最近 5 秒钟，每个单词出现的次数

代码开发

```scala
package com.kaikeba.table

import org.apache.flink.streaming.api.TimeCharacteristic
import org.apache.flink.streaming.api.functions.AssignerWithPeriodicWatermarks
import org.apache.flink.streaming.api.scala.{DataStream, StreamExecutionEnvironment}
import org.apache.flink.streaming.api.watermark.Watermark
import org.apache.flink.table.api.scala.StreamTableEnvironment
import org.apache.flink.table.api.{GroupWindowedTable, Table, Tumble}
import org.apache.flink.types.Row

/**
  * 基于SQL的window窗口操作处理延迟数据
  */
object SQLWindowWaterMark {

  //定义样例类
  case class Message(word:String,createTime:Long)

  def main(args: Array[String]): Unit = {
    //todo:1、构建流处理环境
     val streamEnv: StreamExecutionEnvironment = StreamExecutionEnvironment.getExecutionEnvironment
    streamEnv.setParallelism(1)

      import org.apache.flink.api.scala._

    //指定EventTime为时间语义
     streamEnv.setStreamTimeCharacteristic(TimeCharacteristic.EventTime)

   //todo: 2、构建StreamTableEnvironment
      val tableEnvironment: StreamTableEnvironment = StreamTableEnvironment.create(streamEnv)

  //todo： 3、接受socket数据
      val sourceStream: DataStream[String] = streamEnv.socketTextStream("node01",9999)

  //todo: 4、数据切分处理
    val mapStream: DataStream[Message] = sourceStream.map(x=>Message(x.split(",")(0),x.split(",")(1).toLong))

   //todo: 5、添加watermark
    val watermarksStream: DataStream[Message] = mapStream.assignTimestampsAndWatermarks(new AssignerWithPeriodicWatermarks[Message] {

      //定义延迟时长
      val maxOutOfOrderness = 5000L
      //历史最大事件时间
      var currentMaxTimestamp: Long = _

      override def getCurrentWatermark: Watermark = {
        val watermark = new Watermark(currentMaxTimestamp - maxOutOfOrderness)
        watermark
      }

      override def extractTimestamp(element: Message, previousElementTimestamp: Long): Long = {

        val eventTime: Long = element.createTime
        currentMaxTimestamp = Math.max(eventTime, currentMaxTimestamp)
        eventTime
      }
    })



      //todo:6、注册DataStream成表 ，设置时间属性
       import org.apache.flink.table.api.scala._
      tableEnvironment.registerDataStream("t_socket",watermarksStream,'word,'createTime.rowtime)


    //todo:7、sql查询---添加window---滚动窗口----窗口长度5s
    val result: Table = tableEnvironment.sqlQuery("select word,count(*) from t_socket group by tumble(createTime,interval '5' second),word")


     //todo:8、将table转换成DataStream
     val resultStream: DataStream[(Boolean, Row)] = tableEnvironment.toRetractStream[Row](result)

     resultStream.filter(x =>x._1 ==true).print()

     tableEnvironment.execute("table")
  }
}

```

发送数据

```scala
hadoop,1461756862000
hadoop,1461756865000
hadoop,1461756863000
hadoop,1461756868000
hadoop,1461756870000
hadoop,1461756875000
hadoop,1461756880000
```

更多的SQL操作详细见官网

* <https://ci.apache.org/projects/flink/flink-docs-release-1.10/dev/table/sql/queries.html>

![1588066607198](flink.assets/1588066607198.png)



## 1. Flink的复杂事物处理机制CEP

##### 1.1 CEP概念

CEP是**Complex Event Processing**三个单词的缩写，表示复杂事件处理，是一种基于流处理的技术，CEP是Flink专门为我们提供的一个基于复杂事件监测处理的库，**CEP通过一个或多个由简单事件构成的事件流通过一定的规则匹配，然后输出用户想得到的数据，满足规则的复杂事件**。

说白一点，CEP就是用户自己指定了一些规则，然后将这些规则应用到不断产生的数据流中，最后进行一个规则的匹配。

CEP复杂事件处理**主要应用于防范网络欺诈、设备故障检测、风险规避和智能营销等领域**。Flink 基于 DataStrem API 提供了 FlinkCEP 组件栈，专门用于对复杂事件的处理，帮助用户从流式数据中发掘有价值的信息。

##### 1.2 CEP的主要特点

目标：从有序的简单事件流中发现一些高阶特征

* 输入：一个或多个由简单事件构成的事件流
* 处理：**识别简单事件之间的内在联系**，多个符合一定规则的简单事件构成复杂事件
* 输出：满足规则的复杂事件

![image-20200509183224027](flink.assets/image-20200509183224027.png)

##### 1.3 Pattern API

FlinkCEP 中提供了 Pattern API 用于对输入流数据的复杂事件规则定义，并从事件流中抽取事件结果。

包含四个步骤

* （1）输入事件流的创建
* （2）Pattern 的定义
* （3）Pattern 应用在事件流上检测
* （4）选取结果

###### 1、输入事件流的创建

```scala
//获取数据输入流
val input: DataStream[Event] = ...
```

###### 2、Pattern的定义

定义 Pattern 可以是单次执行模式，也可以是循环执行模式。**单次执行模式一次只接受一个事件，循环执行模式可以接收一个或者多个事件**。通常情况下，可以通过指定循环次数将单次执行模式变为循环执行模式。每种模式能够将多个条件组合应用到同一事件之上，**条件组合可以通过 where 方法进行叠加**。

每个 Pattern 都是通过 begin 方法定义的

```scala
val start = Pattern.begin[Event]("start_pattern")
```

下一步通过 Pattern.where()方法在 Pattern 上指定 Condition，只有当 Condition 满足之后，当前的 Pattern 才会接受事件

```scala
start.where(_.getID == "9527")
```

* ==1、设置循环次数==

  * 对于已经创建好的 Pattern，可以指定循环次数，形成循环执行的 Pattern

    * times：可以通过 times 指定**固定的循环执行次数**

      ```scala
      //指定循环触发4次 
      start.times(4); 
      //可以执行触发次数范围,让循环执行次数在该范围之内 
      start.times(2, 4);
      ```

    * optional：也可以通过 optional 关键字指定**要么不触发，要么触发指定的次数**

      ```scala
      start.times(4).optional()
      start.times(2, 4).optional()
      ```

    * greedy：可以通过 greedy 将 Pattern 标记为**贪婪模式**，在 Pattern 匹配成功的前提下，会尽可能多次触发。

      ```scala
      //触发2、3、4次,尽可能重复执行 
      start.times(2, 4).greedy()
      //触发0、2、3、4次,尽可能重复执行 
      start.times(2, 4).optional().greedy()
      ```

    * oneOrMore：可以通过 oneOrMore 方法指定**触发一次或多次**

      ```scala
      // 触发一次或者多次 
      start.oneOrMore()
      //触发一次或者多次,尽可能重复执行 
      start.oneOrMore().greedy() 
      // 触发0次或者多次 
      start.oneOrMore().optional() 
      // 触发0次或者多次,尽可能重复执行 
      start.oneOrMore().optional().greedy()
      ```

    * timesOrMor：通过 timesOrMore 方法可以指定**触发固定次数以上**，例如执行两次以上

      ```scala
      // 触发两次或者多次 
      start.timesOrMore(2);
      // 触发两次或者多次,尽可能重复执行 
      start.timesOrMore(2).greedy()
      // 不触发或者触发两次以上,尽可能重执行 
      start.timesOrMore(2).optional().greedy()
      ```

* ==2、定义条件==

  * 每个模式都需要指定**触发条件，作为事件进入到该模式是否接受的判断依据**，当事件中的数值满足了条件时，便进行下一步操作。在 FlinkCFP 中通过 pattern.where()、 pattern.or()及pattern.until()方法来为 Pattern 指定条件，且 Pattern 条件有 Simple Conditions 及Combining Conditions 等类型

    * Simple Conditions（简单条件）

      * 其主要根据事件中的字段信息进行判断，决定是否接受该事件。 

        ```scala
        // 把ID为9527的事件挑选出来
        start.where(_.getID == "9527")
        ```

    * Combining Conditions（组合条件）

      * 是将简单条件进行合并，通常情况下也可以使用 where 方法进行条件的组合，默认每个条件通过 AND 逻辑相连。如果需要使用 OR 逻辑，直接使用 or 方法连接条件即可

        ```scala
        // 把ID为9527或者年龄大于30的事件挑选出来 
        val start = Pattern.begin[Event]("start_pattern")
        				 .where(_.callType=="success").or(_.age >30)
        ```

    * Stop condition （终止条件）

      * 如果程序中使用了 oneOrMore 或者 oneOrMore().optional()方法，还可以指定停止条件，否则模式中的规则会一直循环下去，如下终止条件通过 until()方法指定

        ```scala
        start.oneOrMore.until(_.getID == "123")
        ```



* ==3、模式序列==

  * 将相互独立的模式进行组合然后形成模式序列。模式序列基本的编写方式和独立模式一 致，各个模式之间通过邻近条件进行连接即可，其中有严格邻近、宽松邻近、非确定宽松邻近三种邻近连接条件。

    * 严格邻近

      * 严格邻近条件中，需要所有的事件都按照顺序满足模式条件，不允许忽略任意不满足的模式

        * **next**

        ```scala
        //示例
        begin("first").where(_.name='a').next("second").where(.name='b')
        //当且仅当数据为a,b时，模式才会被命中。如果数据为a,c,b，由于a的后面跟了c，所以a会被直接丢弃，模式不会命中。
        ```

    * 宽松邻近

      * 在宽松邻近条件下，会忽略没有成功匹配模式条件，并不会像严格邻近要求得那么高，可以简单理解为 OR 的逻辑关系

        * **followedBy**

        ```scala
        //示例
        begin("first").where(_.name='a').followedBy("second").where(.name='b')
        //当且仅当数据为a,b或者为a,c,b，，模式均被命中，中间的c会被忽略掉。
        ```

    * 非确定宽松邻近

      * 和宽松邻近条件相比，非确定宽松邻近条件指在模式匹配过程中可以忽略已经匹配的条件

        * **followedByAny**

        ```scala
        //示例
        begin("first").where(_.name='a').followedByAny("second").where(.name='b')
        //当且仅当数据为a,c,b,b时，对于followedBy模式而言命中的为{a,b}，
        //对于followedByAny而言会有两次命中{a,b},{a,b}
        ```

      <img src="flink.assets/image-20200510022432230.png" alt="image-20200510022432230" style="zoom:67%;" />

    * 除以上模式序列外，还可以定义“不希望出现某种近邻关系”

      * notNext() 
        * 不想让某个事件严格紧邻前一个事件发生 
      * notFollowedBy() 
        * 不想让某个事件在两个事件之间发生

  * 注意

    * 1、所有模式序列必须以 .begin() 开始 

    * 2、模式序列不能以 .notFollowedBy() 结束 

    * 3、“not” 类型的模式不能和optional关键字同时使用 

    * 4、此外，还可以为模式指定时间约束，用来要求在多长时间内匹配有效 

      ```scala
      //指定模式在10秒内有效 
      pattern.within(Time.seconds(10))
      ```

###### 3、Pattern检测

* 调用**CEP.pattern()**方法，给定输入流和模式，就能得到一个PatternStream

  ```scala
  //Pattern检测
  val patternStream = CEP.pattern[Event](dataStream,pattern)
  ```


###### 4、选取结果

* 得到 PatternStream 类型的数据集后，接下来数据获取都基于 PatternStream 进行。该数据集中包含了所有的匹配事件。目前在 FlinkCEP 中提供 **select** 和 **flatSelect** 两种方法从 PatternStream 提取事件结果。

* 1、通过 Select Funciton 抽取正常事件

  * 可以通过在 PatternStream 的**Select 方法中传入自定义 Select Funciton 完成对匹配事件的转换与输出**。其中 Select Funciton 的输入参数为 Map[String, Iterable[IN]]，Map 中的 key 为模式序列中的 Pattern 名称，Value 为对应 Pattern 所接受的事件集合，格式为输入事件的数据类型。

    ```scala
    def selectFunction(pattern : Map[String, Iterable[IN]]): OUT = {
        //获取pattern中的start
         Event val startEvent = pattern.get("start_pattern").get.next
        //获取Pattern中middle
        Event val middleEvent = pattern.get("middle").get.next 
        //返回结果 
        OUT(startEvent, middleEvent)
    
    }
    ```

* 2、通过 Flat Select Funciton 抽取正常事件

  * Flat Select Funciton 和 Select Function 相似，不过 Flat Select Funciton 在每次调用**可以返回任意数量的结果**。因为 Flat Select Funciton 使用 Collector 作为返回结果的容器，可以将需要输出的事件都放置在 Collector 中返回。 

    ```scala
    def flatSelectFunction(pattern : Map[String, Iterable[IN]]),collector:Collector[OUT] = {
        //获取pattern中的start
         Event val startEvent = pattern.get("start_pattern").get.next
        //获取Pattern中middle
        Event val middleEvent = pattern.get("middle").get.next 
        //并根据startEvent的Value数量进行返回
        for (i <- 0 to startEvent.getValue) { 
            collector.collect(OUT(startEvent, middleEvent)) }
    	}
    }
    ```

* 3、通过 Select Funciton 抽取超时事件

  * 如果模式中有 within(time)，那么就很有可能有超时的数据存在，通过 PatternStream，Select 方法分别获取超时事件和正常事件。首先需要创建 OutputTag 来标记超时事件，然后在 PatternStream.select 方法中使用 OutputTag，就可以将超时事件从 PatternStream中抽取出来。 

    ```scala
    // 通过CEP.pattern方法创建PatternStream 
    val patternStream: PatternStream[Event] = CEP.pattern(input, pattern) 
    
    //创建OutputTag,并命名为timeout-output 
    val timeoutTag = OutputTag[String]("timeout-output") 
    
    //调用PatternStream select()并指定timeoutTag 
    val result: SingleOutputStreamOperator[NormalEvent] = patternStream.select(timeoutTag){ 
    //超时事件获取 
    (pattern: Map[String, Iterable[Event]], timestamp: Long) =>
    	TimeoutEvent() //返回异常事件
     } 
     { 
     //正常事件获取 
     pattern: Map[String, Iterable[Event]] =>
     	NormalEvent()//返回正常事件 
     } 
     //调用getSideOutput方法,并指定timeoutTag将超时事件输出 
     val timeoutResult: DataStream[TimeoutEvent] = result.getSideOutput(timeoutTag)
    ```


## 2. CEP编程开发案例实战

* 描述

  * 在我们操作某些银行APP的时候，经常会发现，如果上一个操作与下一个操作IP变换了（例如上一个操作使用的流量操作，下一个操作我连接上了wifi去操作，IP就会变换），那么APP就要求我们重新进行登录，避免由于IP变换产生的风险操作

* 需求

  - 用户上一个操作与下一个操作IP变换报警

* 数据格式如下

  * 从socket当中输入数据源

  ```
  192.168.52.100,zhubajie,https://icbc.com.cn/login.html,2020-02-12 12:23:45
  192.168.54.172,tangseng,https://icbc.com.cn/login.html,2020-02-12 12:23:46
  192.168.145.77,sunwukong,https://icbc.com.cn/login.html,2020-02-12 12:23:47
  192.168.52.100,zhubajie,https://icbc.com.cn/transfer.html,2020-02-12 12:23:47
  192.168.54.172,tangseng,https://icbc.com.cn/transfer.html,2020-02-12 12:23:48
  192.168.145.77,sunwukong,https://icbc.com.cn/transfer.html,2020-02-12 12:23:49
  192.168.145.77,sunwukong,https://icbc.com.cn/save.html,2020-02-12 12:23:52
  192.168.52.100,zhubajie,https://icbc.com.cn/save.html,2020-02-12 12:23:53
  192.168.54.172,tangseng,https://icbc.com.cn/save.html,2020-02-12 12:23:54
  192.168.54.172,tangseng,https://icbc.com.cn/buy.html,2020-02-12 12:23:57
  192.168.145.77,sunwukong,https://icbc.com.cn/buy.html,2020-02-12 12:23:58
  192.168.52.100,zhubajie,https://icbc.com.cn/buy.html,2020-02-12 12:23:59
  192.168.44.110,zhubajie,https://icbc.com.cn/pay.html,2020-02-12 12:24:03
  192.168.38.135,tangseng,https://icbc.com.cn/pay.html,2020-02-12 12:24:04
  192.168.89.189,sunwukong,https://icbc.com.cn/pay.html,2020-02-12 12:24:05
  192.168.44.110,zhubajie,https://icbc.com.cn/login.html,2020-02-12 12:24:04
  192.168.38.135,tangseng,https://icbc.com.cn/login.html,2020-02-12 12:24:08
  192.168.89.189,sunwukong,https://icbc.com.cn/login.html,2020-02-12 12:24:07
  192.168.38.135,tangseng,https://icbc.com.cn/pay.html,2020-02-12 12:24:10
  192.168.44.110,zhubajie,https://icbc.com.cn/pay.html,2020-02-12 12:24:06
  192.168.89.189,sunwukong,https://icbc.com.cn/pay.html,2020-02-12 12:24:09
  192.168.38.135,tangseng,https://icbc.com.cn/pay.html,2020-02-12 12:24:13
  192.168.44.110,zhubajie,https://icbc.com.cn/pay.html,2020-02-12 12:24:12
  192.168.89.189,sunwukong,https://icbc.com.cn/pay.html,2020-02-12 12:24:15
  ```

  * 整理之后的格式如下：

  ```
  192.168.145.77,sunwukong,https://icbc.com.cn/login.html,2020-02-12 12:23:47
  192.168.145.77,sunwukong,https://icbc.com.cn/transfer.html,2020-02-12 12:23:49
  192.168.145.77,sunwukong,https://icbc.com.cn/save.html,2020-02-12 12:23:52
  192.168.145.77,sunwukong,https://icbc.com.cn/buy.html,2020-02-12 12:23:58
  192.168.89.189,sunwukong,https://icbc.com.cn/pay.html,2020-02-12 12:24:05
  192.168.89.189,sunwukong,https://icbc.com.cn/login.html,2020-02-12 12:24:07
  192.168.89.189,sunwukong,https://icbc.com.cn/pay.html,2020-02-12 12:24:09
  192.168.89.189,sunwukong,https://icbc.com.cn/pay.html,2020-02-12 12:24:15
  
  192.168.52.100,zhubajie,https://icbc.com.cn/login.html,2020-02-12 12:23:45
  192.168.52.100,zhubajie,https://icbc.com.cn/transfer.html,2020-02-12 12:23:47
  192.168.52.100,zhubajie,https://icbc.com.cn/save.html,2020-02-12 12:23:53
  192.168.52.100,zhubajie,https://icbc.com.cn/buy.html,2020-02-12 12:23:59
  192.168.44.110,zhubajie,https://icbc.com.cn/pay.html,2020-02-12 12:24:03
  192.168.44.110,zhubajie,https://icbc.com.cn/login.html,2020-02-12 12:24:04
  192.168.44.110,zhubajie,https://icbc.com.cn/pay.html,2020-02-12 12:24:06
  192.168.44.110,zhubajie,https://icbc.com.cn/pay.html,2020-02-12 12:24:12
  
  192.168.54.172,tangseng,https://icbc.com.cn/login.html,2020-02-12 12:23:46
  192.168.54.172,tangseng,https://icbc.com.cn/transfer.html,2020-02-12 12:23:48
  192.168.54.172,tangseng,https://icbc.com.cn/save.html,2020-02-12 12:23:54
  192.168.54.172,tangseng,https://icbc.com.cn/buy.html,2020-02-12 12:23:57
  192.168.38.135,tangseng,https://icbc.com.cn/pay.html,2020-02-12 12:24:04
  192.168.38.135,tangseng,https://icbc.com.cn/login.html,2020-02-12 12:24:08
  192.168.38.135,tangseng,https://icbc.com.cn/pay.html,2020-02-12 12:24:10
  192.168.38.135,tangseng,https://icbc.com.cn/pay.html,2020-02-12 12:24:13
  ```



##### 2.1 使用State编程实现

代码开发

```scala
package com.kaikeba.cep

import java.util
import java.util.Collections

import org.apache.flink.api.common.state.{ListState, ListStateDescriptor}
import org.apache.flink.configuration.Configuration
import org.apache.flink.streaming.api.functions.KeyedProcessFunction
import org.apache.flink.streaming.api.scala.{DataStream, StreamExecutionEnvironment}
import org.apache.flink.util.Collector

/**
  * 使用state编程进行代码实现进行ip检测
  */

case class UserLogin(ip:String,username:String,operateUrl:String,time:String)

object CheckIPChangeWithState {

  def main(args: Array[String]): Unit = {

    val environment: StreamExecutionEnvironment = StreamExecutionEnvironment.getExecutionEnvironment
    import org.apache.flink.api.scala._

    //todo:1、接受socket数据源
    val sourceStream: DataStream[String] = environment.socketTextStream("node01",9999)

    //todo:2、数据处理
    sourceStream.map(x =>{
      val strings: Array[String] = x.split(",")
      (strings(1),UserLogin(strings(0),strings(1),strings(2),strings(3)))
    } ).keyBy(x => x._1)
      .process(new LoginCheckProcessFunction)
      .print()
    environment.execute("checkIpChange")


  }
}
//自定义KeyedProcessFunction类
class LoginCheckProcessFunction extends KeyedProcessFunction[String,(String,UserLogin),(String,UserLogin)]{

   //定义ListState
   var listState:ListState[UserLogin]=_

  override def open(parameters: Configuration): Unit = {
    listState = getRuntimeContext.getListState(new ListStateDescriptor[UserLogin]("changeIp",classOf[UserLogin]))

  }

  //解析用户访问信息
  override def processElement(value: (String, UserLogin), ctx: KeyedProcessFunction[String, (String, UserLogin), (String, UserLogin)]#Context, out: Collector[(String, UserLogin)]): Unit = {
    val logins = new util.ArrayList[UserLogin]()

    //添加到list集合
     listState.add(value._2)

    import scala.collection.JavaConverters._
    val toList: List[UserLogin] = listState.get().asScala.toList
     //排序
    val sortList: List[UserLogin] = toList.sortBy(_.time)

    if(sortList.size ==2){
      val first: UserLogin = sortList(0)
      val second: UserLogin = sortList(1)

      if(!first.ip.equals(second.ip)){
        println("小伙子你的IP变了，赶紧回去重新登录一下")
      }
      //移除第一个ip，保留第二个ip
      logins.removeAll(Collections.EMPTY_LIST)
      logins.add(second)
      listState.update(logins)
    }

     out.collect(value)

  }

}

```

socket发送数据，并观察输出结果：

```scala
4> (sunwukong,UserLogin(192.168.145.77,sunwukong,https://icbc.com.cn/login.html,2020-02-12 12:23:47))
4> (sunwukong,UserLogin(192.168.145.77,sunwukong,https://icbc.com.cn/transfer.html,2020-02-12 12:23:49))
4> (sunwukong,UserLogin(192.168.145.77,sunwukong,https://icbc.com.cn/save.html,2020-02-12 12:23:52))
4> (sunwukong,UserLogin(192.168.145.77,sunwukong,https://icbc.com.cn/buy.html,2020-02-12 12:23:58))
小伙子你的IP变了，赶紧回去重新登录一下
4> (sunwukong,UserLogin(192.168.89.189,sunwukong,https://icbc.com.cn/pay.html,2020-02-12 12:24:05))
4> (sunwukong,UserLogin(192.168.89.189,sunwukong,https://icbc.com.cn/login.html,2020-02-12 12:24:07))
```



##### 2.2 使用CEP编程实现

导入cep依赖

```xml
<dependency>
    <groupId>org.apache.flink</groupId>
    <artifactId>flink-cep-scala_2.11</artifactId>
    <version>1.9.2</version>
</dependency>
```

代码开发

```scala
package com.kaikeba.cep

import java.util

import org.apache.flink.cep.PatternSelectFunction
import org.apache.flink.cep.pattern.conditions.IterativeCondition
import org.apache.flink.cep.scala.{CEP, PatternStream}
import org.apache.flink.cep.scala.pattern.Pattern
import org.apache.flink.streaming.api.scala.{DataStream, KeyedStream, StreamExecutionEnvironment}
import org.apache.flink.streaming.api.windowing.time.Time

import scala.collection.mutable

/**
  *使用 CEP 编程进行代码实现进行ip检测
  */

case class UserLoginInfo(ip:String,username:String,operateUrl:String,time:String)
object CheckIPChangeWithCEP {

  def main(args: Array[String]): Unit = {
    val environment: StreamExecutionEnvironment = StreamExecutionEnvironment.getExecutionEnvironment
    import org.apache.flink.api.scala._

    //todo:1、接受socket数据源
    val sourceStream: DataStream[String] = environment.socketTextStream("node01",9999)

    //todo:2、数据处理
    val keyedStream: KeyedStream[(String, UserLoginInfo), String] = sourceStream.map(x => {
                       val strings: Array[String] = x.split(",")
                      (strings(1), UserLoginInfo(strings(0), strings(1), strings(2), strings(3)))
            }).keyBy(_._1)


   //todo:3、定义Pattern,指定相关条件和模型序列
    val pattern: Pattern[(String, UserLoginInfo), (String, UserLoginInfo)] = Pattern.begin[(String, UserLoginInfo)]("start")
          .where(x => x._2.username != null)
          .next("second")
          .where(new IterativeCondition[(String, UserLoginInfo)] {
            override def filter(value: (String, UserLoginInfo), context: IterativeCondition.Context[(String, UserLoginInfo)]): Boolean = {
              var flag: Boolean = false
              //获取满足前面条件的数据
              val firstValues: util.Iterator[(String, UserLoginInfo)] = context.getEventsForPattern("start").iterator()
              //遍历
              while (firstValues.hasNext) {
                val tuple: (String, UserLoginInfo) = firstValues.next()
                //ip不相同
                if (!tuple._2.ip.equals(value._2.ip)) {
                  flag = true
                }
              }

              flag
            }
          })
        //可以指定模式在一段时间内有效
      .within(Time.seconds(120))

    //todo:4、模式检测，将模式应用到流中
     val patternStream: PatternStream[(String, UserLoginInfo)] = CEP.pattern(keyedStream,pattern)


    //todo: 5、选取结果
     patternStream.select(new MyPatternSelectFunction).print()


    //todo: 6、开启计算
    environment.execute()

  }

}

//自定义PatternSelectFunction类
class MyPatternSelectFunction extends PatternSelectFunction[(String,UserLoginInfo),(String,UserLoginInfo)]{
  override def select(map: util.Map[String, util.List[(String, UserLoginInfo)]]): (String, UserLoginInfo) = {
        // 获取Pattern名称为start的事件
         val startIterator= map.get("start").iterator()

         if(startIterator.hasNext){
            println("满足start模式中的数据："+startIterator.next())
         }


        //获取Pattern名称为second的事件
         val secondIterator = map.get("second").iterator()


        var tuple:(String,UserLoginInfo)=null

        if(secondIterator.hasNext){
            tuple=secondIterator.next()
            println("满足second模式中的数据："+ tuple)
        }

    tuple
  }
}


```

socket发送数据：

```scala
192.168.145.77,sunwukong,https://icbc.com.cn/login.html,2020-02-12 12:23:47
192.168.145.77,sunwukong,https://icbc.com.cn/transfer.html,2020-02-12 12:23:49
192.168.145.77,sunwukong,https://icbc.com.cn/save.html,2020-02-12 12:23:52
192.168.145.77,sunwukong,https://icbc.com.cn/buy.html,2020-02-12 12:23:58
192.168.89.189,sunwukong,https://icbc.com.cn/pay.html,2020-02-12 12:24:05
192.168.89.189,sunwukong,https://icbc.com.cn/login.html,2020-02-12 12:24:07
```

输出结果：

```scala
满足start模式中的数据：(sunwukong,UserLogin(192.168.145.77,sunwukong,https://icbc.com.cn/buy.html,2020-02-12 12:23:58))
满足second模式中的数据：(sunwukong,UserLogin(192.168.89.189,sunwukong,https://icbc.com.cn/pay.html,2020-02-12 12:24:05))
```




## 3. Flink CEP综合案例实战1

场景介绍

* 现在工厂当中有大量的传感设备，用于检测机器当中的各种指标数据，例如温度，湿度，气压等，并实时上报数据到数据中心，现在**需要检测，某一个传感器上报的温度数据是否发生异常**。

异常的定义

* 三分钟时间内，出现三次及以上的温度高于40度就算作是异常温度，进行报警输出

收集数据如下：

```
传感器设备mac地址，检测机器mac地址，温度，湿度，气压，数据产生时间

00-34-5E-5F-89-A4,00-01-6C-06-A6-29,38,0.52,1.1,2020-03-02 12:20:32
00-34-5E-5F-89-A4,00-01-6C-06-A6-29,47,0.48,1.1,2020-03-02 12:20:35
00-34-5E-5F-89-A4,00-01-6C-06-A6-29,50,0.48,1.1,2020-03-02 12:20:38
00-34-5E-5F-89-A4,00-01-6C-06-A6-29,31,0.48,1.1,2020-03-02 12:20:39
00-34-5E-5F-89-A4,00-01-6C-06-A6-29,52,0.48,1.1,2020-03-02 12:20:41
00-34-5E-5F-89-A4,00-01-6C-06-A6-29,53,0.48,1.1,2020-03-02 12:20:43
00-34-5E-5F-89-A4,00-01-6C-06-A6-29,55,0.48,1.1,2020-03-02 12:20:45
```

代码开发实现：

```scala
package com.kaikeba.cep


import java.util

import org.apache.commons.lang3.time.FastDateFormat
import org.apache.flink.cep.PatternSelectFunction
import org.apache.flink.cep.scala.pattern.Pattern
import org.apache.flink.cep.scala.{CEP, PatternStream}
import org.apache.flink.streaming.api.TimeCharacteristic
import org.apache.flink.streaming.api.scala.{DataStream, KeyedStream, StreamExecutionEnvironment}
import org.apache.flink.streaming.api.windowing.time.Time

//定义温度信息pojo
case class DeviceDetail(sensorMac:String,deviceMac:String,temperature:String,dampness:String,pressure:String,date:String)

//报警的设备信息样例类
//传感器设备mac地址，检测机器mac地址，温度
case class AlarmDevice(sensorMac:String,deviceMac:String,temperature:String)

/**
  * 基于FlinkCEP的设备温度检测
  */
object FlinkTempeatureCEP {

  private val format: FastDateFormat = FastDateFormat.getInstance("yyyy-MM-dd HH:mm:ss")
  def main(args: Array[String]): Unit = {
    val environment: StreamExecutionEnvironment = StreamExecutionEnvironment.getExecutionEnvironment
    //指定时间类型
    environment.setStreamTimeCharacteristic(TimeCharacteristic.EventTime)
    environment.setParallelism(1)
    import org.apache.flink.api.scala._

    //接受数据
    val sourceStream: DataStream[String] = environment.socketTextStream("node01",9999)

    val deviceStream: KeyedStream[DeviceDetail, String] = sourceStream.map(x => {
        val strings: Array[String] = x.split(",")
        DeviceDetail(strings(0), strings(1), strings(2), strings(3), strings(4), strings(5))
    }).assignAscendingTimestamps(x =>{format.parse(x.date).getTime})
      .keyBy(x => x.sensorMac)


     //todo:定义Pattern,指定相关条件和模型序列
    val pattern: Pattern[DeviceDetail, DeviceDetail] = Pattern.begin[DeviceDetail]("start")
                   .where(x =>x.temperature.toInt >= 40)                                               .followedByAny("follow")
                    .where(x =>x.temperature.toInt >= 40)                                             .followedByAny("follow")
                    .where(x =>x.temperature.toInt >= 40)                                             .within(Time.minutes(3))

    //todo:模式检测，将模式应用到流中
    val patternResult: PatternStream[DeviceDetail] = CEP.pattern(deviceStream,pattern)

    //todo:选取结果
    patternResult.select(new MyPatternResultFunction).print()

    //todo: 启动
    environment.execute("startTempeature")

  }
}

//自定义PatternSelectFunction
class MyPatternResultFunction extends PatternSelectFunction[DeviceDetail,AlarmDevice]{
  override def select(pattern: util.Map[String, util.List[DeviceDetail]]): AlarmDevice = {
    val startDetails: util.List[DeviceDetail] = pattern.get("start")
    val followDetails: util.List[DeviceDetail] = pattern.get("follow")
    val thirdDetails: util.List[DeviceDetail] = pattern.get("third")

   val startResult: DeviceDetail = startDetails.iterator().next()
    val followResult: DeviceDetail = followDetails.iterator().next()
    val thirdResult: DeviceDetail = thirdDetails.iterator().next()

    println("第一条数据: "+startResult)
    println("第二条数据: "+followResult)
    println("第三条数据: "+thirdResult)

    AlarmDevice(thirdResult.sensorMac,thirdResult.deviceMac,thirdResult.temperature)
  }
}
```

socket发送数据：

```scala
00-34-5E-5F-89-A4,00-01-6C-06-A6-29,38,0.52,1.1,2020-03-02 12:20:32
00-34-5E-5F-89-A4,00-01-6C-06-A6-29,47,0.48,1.1,2020-03-02 12:20:35
00-34-5E-5F-89-A4,00-01-6C-06-A6-29,50,0.48,1.1,2020-03-02 12:20:38
00-34-5E-5F-89-A4,00-01-6C-06-A6-29,31,0.48,1.1,2020-03-02 12:20:39
00-34-5E-5F-89-A4,00-01-6C-06-A6-29,52,0.48,1.1,2020-03-02 12:20:41
00-34-5E-5F-89-A4,00-01-6C-06-A6-29,53,0.48,1.1,2020-03-02 12:20:43
00-34-5E-5F-89-A4,00-01-6C-06-A6-29,31,0.48,1.1,2020-03-02 12:20:46
```

输出结果如下，发送倒数第二条的53度的数据时，输出了一组信息，发送最后一条53度的数据时，产生了3种组合的输出，这个就是followByAny的作用效果，可以忽略已经匹配的条件。

**注意：发送最后一条31度的数据才能触发打印，说明CEP是前闭后开的。**

```scala
第一条数据: DeviceDetail(00-34-5E-5F-89-A4,00-01-6C-06-A6-29,47,0.48,1.1,2020-03-02 12:20:35)
第二条数据: [DeviceDetail(00-34-5E-5F-89-A4,00-01-6C-06-A6-29,50,0.48,1.1,2020-03-02 12:20:38)]
第三条数据: DeviceDetail(00-34-5E-5F-89-A4,00-01-6C-06-A6-29,52,0.48,1.1,2020-03-02 12:20:41)
AlarmDevice(00-34-5E-5F-89-A4,00-01-6C-06-A6-29,52)

第一条数据: DeviceDetail(00-34-5E-5F-89-A4,00-01-6C-06-A6-29,47,0.48,1.1,2020-03-02 12:20:35)
第二条数据: [DeviceDetail(00-34-5E-5F-89-A4,00-01-6C-06-A6-29,50,0.48,1.1,2020-03-02 12:20:38)]
第三条数据: DeviceDetail(00-34-5E-5F-89-A4,00-01-6C-06-A6-29,53,0.48,1.1,2020-03-02 12:20:43)
AlarmDevice(00-34-5E-5F-89-A4,00-01-6C-06-A6-29,53)
第一条数据: DeviceDetail(00-34-5E-5F-89-A4,00-01-6C-06-A6-29,47,0.48,1.1,2020-03-02 12:20:35)
第二条数据: [DeviceDetail(00-34-5E-5F-89-A4,00-01-6C-06-A6-29,52,0.48,1.1,2020-03-02 12:20:41)]
第三条数据: DeviceDetail(00-34-5E-5F-89-A4,00-01-6C-06-A6-29,53,0.48,1.1,2020-03-02 12:20:43)
AlarmDevice(00-34-5E-5F-89-A4,00-01-6C-06-A6-29,53)
第一条数据: DeviceDetail(00-34-5E-5F-89-A4,00-01-6C-06-A6-29,50,0.48,1.1,2020-03-02 12:20:38)
第二条数据: [DeviceDetail(00-34-5E-5F-89-A4,00-01-6C-06-A6-29,52,0.48,1.1,2020-03-02 12:20:41)]
第三条数据: DeviceDetail(00-34-5E-5F-89-A4,00-01-6C-06-A6-29,53,0.48,1.1,2020-03-02 12:20:43)
AlarmDevice(00-34-5E-5F-89-A4,00-01-6C-06-A6-29,53)
```



## 4. Flink CEP综合案例实战2

场景介绍

* 在我们的电商系统当中，经常会发现有些订单下单之后没有支付，就会有一个倒计时的时间值，提示你在15分钟之内完成支付，如果没有完成支付，那么该订单就会被取消，主要是因为拍下订单就会减库存，但是如果一直没有支付，那么就会造成库存没有了，别人购买的时候买不到，然后别人一直不支付，就会产生有些人买不到，有些人买到了不付款，最后导致商家一件产品都卖不出去

需求

* 创建订单之后15分钟之内一定要付款，否则就取消订单

订单数据格式如下:

```
20160728001511050311389390,1,2016-07-28 00:15:11,295
20160801000227050311955990,1,2016-07-28 00:16:12,165
20160728001511050311389390,2,2016-07-28 00:18:11,295
20160801000227050311955990,2,2016-07-28 00:18:12,165
20160728001511050311389390,3,2016-07-29 08:06:11,295
20160801000227050311955990,4,2016-07-29 12:21:12,165
20160804114043050311618457,1,2016-07-30 00:16:15,132
20160804114043050311618457,2,2016-07-30 00:47:15,132
20160804114043050311618459,2,2016-08-01 00:49:15,132
```

类型字段说明：

* 订单编号
* 订单状态

  * 1.创建订单,等待支付
  * 2.支付订单完成
  * 3.取消订单，申请退款
  * 4.已发货 
  * 5.确认收货，已经完成 
* 订单创建时间
* 订单金额

**规则：出现 1 创建订单标识之后，紧接着需要在15分钟之内出现 2 支付订单操作，中间允许有其他操作**

代码开发实现

```scala
package com.kaikeba.cep

import java.util

import org.apache.commons.lang3.time.FastDateFormat
import org.apache.flink.cep.{PatternSelectFunction, PatternTimeoutFunction}
import org.apache.flink.cep.scala.{CEP, PatternStream, pattern}
import org.apache.flink.cep.scala.pattern.Pattern
import org.apache.flink.streaming.api.TimeCharacteristic
import org.apache.flink.streaming.api.functions.timestamps.BoundedOutOfOrdernessTimestampExtractor
import org.apache.flink.streaming.api.scala.{DataStream, KeyedStream, OutputTag, StreamExecutionEnvironment}
import org.apache.flink.streaming.api.windowing.time.Time


/**
  *  订单下单未支付检测
  */

case class OrderDetail(orderId:String,status:String,orderCreateTime:String,price :Double)

object OrderTimeOutCheckCEP {

  private val format: FastDateFormat = FastDateFormat.getInstance("yyyy-MM-dd HH:mm:ss")

  def main(args: Array[String]): Unit = {

    val environment: StreamExecutionEnvironment = StreamExecutionEnvironment.getExecutionEnvironment
    environment.setStreamTimeCharacteristic(TimeCharacteristic.EventTime)
    environment.setParallelism(1)
    import org.apache.flink.api.scala._
    val sourceStream: DataStream[String] = environment.socketTextStream("node01",9999)

    val keyedStream: KeyedStream[OrderDetail, String] = sourceStream.map(x => {
      val strings: Array[String] = x.split(",")
      OrderDetail(strings(0), strings(1), strings(2), strings(3).toDouble)

    }).assignTimestampsAndWatermarks(new BoundedOutOfOrdernessTimestampExtractor[OrderDetail](Time.seconds(5)){
      override def extractTimestamp(element: OrderDetail): Long = {
        format.parse(element.orderCreateTime).getTime
      }
    }).keyBy(x => x.orderId)

     //定义Pattern模式，指定条件
    val pattern: Pattern[OrderDetail, OrderDetail] = Pattern.begin[OrderDetail]("start")
                                                            .where(order => order.status.equals("1"))
                                                            .followedBy("second")
                                                            .where(x => x.status.equals("2"))
                                                            .within(Time.minutes(15))


    // 4. 调用select方法，提取事件序列，超时的事件要做报警提示
    val orderTimeoutOutputTag = new OutputTag[OrderDetail]("orderTimeout")

    val patternStream: PatternStream[OrderDetail] = CEP.pattern(keyedStream,pattern)
    val selectResultStream: DataStream[OrderDetail] = patternStream
            .select(orderTimeoutOutputTag, new OrderTimeoutPatternFunction, new OrderPatternFunction)

     selectResultStream.print()

    //打印侧输出流数据 过了15分钟还没支付的数据
    selectResultStream.getSideOutput(orderTimeoutOutputTag).print()
    environment.execute()
  }
}

//订单超时检测
class OrderTimeoutPatternFunction extends PatternTimeoutFunction[OrderDetail,OrderDetail]{

  override def timeout(pattern: util.Map[String, util.List[OrderDetail]], l: Long): OrderDetail = {
    val detail: OrderDetail = pattern.get("start").iterator().next()
        println("超时订单号为" + detail)
        detail
  }
}


class OrderPatternFunction extends PatternSelectFunction[OrderDetail,OrderDetail] {
  override def select(pattern: util.Map[String, util.List[OrderDetail]]): OrderDetail = {
        val detail: OrderDetail = pattern.get("second").iterator().next()
        println("支付成功的订单为" + detail)
        detail
  }
}

```

socket发送数据：

```scala
20160728001511050311389390,1,2016-07-28 00:15:11,295
20160801000227050311955990,1,2016-07-28 00:16:12,165
20160728001511050311389390,2,2016-07-28 00:18:11,295
20160801000227050311955990,2,2016-07-28 00:18:12,165
20160728001511050311389390,3,2016-07-29 08:06:11,295
20160801000227050311955990,4,2016-07-29 12:21:12,165
20160804114043050311618457,1,2016-07-30 00:16:15,132
20160801000227050311955990,5,2016-07-30 18:13:24,165
20160804114043050311618457,2,2016-07-30 00:47:15,132
```

输出结果：

```scala
支付成功的订单为OrderDetail(20160728001511050311389390,2,2016-07-28 00:18:11,295.0)
OrderDetail(20160728001511050311389390,2,2016-07-28 00:18:11,295.0)
支付成功的订单为OrderDetail(20160801000227050311955990,2,2016-07-28 00:18:12,165.0)
OrderDetail(20160801000227050311955990,2,2016-07-28 00:18:12,165.0)
超时订单号为OrderDetail(20160804114043050311618457,1,2016-07-30 00:16:15,132.0)
OrderDetail(20160804114043050311618457,1,2016-07-30 00:16:15,132.0)
```



## 5. 实时ETL

##### 5.1 需求背景

* 针对应用产生的日志数据进行清洗拆分

  •1、应用产生的**日志数据是嵌套json格式，需要拆分打平**

  •2、针对日志数据中的**国家字段进行大区转换**

  •3、把**数据回写到Kafka**

##### 5.2 数据准备

* reids码表格式(元数据)：

  * 启动redis服务

    ```shell
    /kkb/install/redis-5.0.8/src/redis-server /kkb/install/redis-5.0.8/redis.conf
    ```


* 进入redis客户端

  ```
  /kkb/install/redis-5.0.8/src/redis-cli -h node01
  ```


* 插入以下数据到redis当中去

  ```sh
            #大区    国家
  hset areas AREA_US US
  hset areas AREA_CT TW,HK
  hset areas AREA_AR PK,KW,SA
  hset areas AREA_IN IN
  ## hset key field value
  ```


* 查询redis当中的数据

  ```
   HKEYS areas
   HGETALL areas
   
   127.0.0.1:6379> Hkeys areas
  1) "AREA_US"
  2) "AREA_CT"
  3) "AREA_AR"
  4) "AREA_IN"
  ```


* node01执行以下命令，创建kafka的topic

  ```sh
  kafka-topics.sh --create --partitions 2 --topic data1 --replication-factor 2 --zookeeper node01:2181,node02:2181,node03:2181  #要事先启动kafka
  ```


##### 5.3 项目架构

![image-20200512112853825](flink.assets/image-20200512112853825.png)

##### 5.4 方案实现

* 日志格式：

```java
原始数据结构如下：
第一条数据：
{"dt":"2019-11-19 20:33:41","countryCode":"KW","data":[{"type":"s2","score":0.2,"level":"A"},{"type":"s1","score":0.2,"level":"D"}]}

第二条数据：
{"dt":"2019-11-19 20:33:43","countryCode":"HK","data":[{"type":"s5","score":0.5,"level":"C"},{"type":"s2","score":0.8,"level":"B"}]}

需要我们对数据做ETL处理，将数据拉平

"dt":"2019-11-19 20:33:41","countryCode":"KW","type":"s2","score":0.2,"level":"A"
"dt":"2019-11-19 20:33:41","countryCode":"KW","type":"s1","score":0.2,"level":"D"

让后将countryCode第二步处理，替换成为大区ID

"dt":"2019-11-19 20:33:41","countryCode":"AREA_CT","type":"s2","score":0.2,"level":"A"
"dt":"2019-11-19 20:33:41","countryCode":"AREA_CT","type":"s1","score":0.2,"level":"D"

使用redis将数据进行广播，然后通过分布式缓存，通过KW查询出对应的AREA_CT出来，进行替换即可，处理完成之后的数据继续写回到kafka里面去
```

###### pom依赖

```xml
<dependencies>
            <dependency>
                <groupId>org.apache.flink</groupId>
                <artifactId>flink-java</artifactId>
                <version>${flink.version}</version>
            </dependency>
            <dependency>
                <groupId>org.apache.flink</groupId>
                <artifactId>flink-streaming-java_2.11</artifactId>
                <version>${flink.version}</version>
            </dependency>
            <dependency>
                <groupId>org.apache.flink</groupId>
                <artifactId>flink-scala_2.11</artifactId>
                <version>${flink.version}</version>
            </dependency>
            <dependency>
                <groupId>org.apache.flink</groupId>
                <artifactId>flink-streaming-scala_2.11</artifactId>
                <version>${flink.version}</version>
            </dependency>

            <dependency>
                <groupId>org.apache.bahir</groupId>
                <artifactId>flink-connector-redis_2.11</artifactId>
                <version>1.0</version>
            </dependency>

            <dependency>
                <groupId>org.apache.flink</groupId>
                <artifactId>flink-statebackend-rocksdb_2.11</artifactId>
                <version>${flink.version}</version>
            </dependency>

            <dependency>
                <groupId>org.apache.flink</groupId>
                <artifactId>flink-connector-kafka-0.11_2.11</artifactId>
                <version>${flink.version}</version>
            </dependency>

            <dependency>
                <groupId>org.apache.kafka</groupId>
                <artifactId>kafka-clients</artifactId>
                <version>0.11.0.3</version>
            </dependency>
            <!-- 日志相关依赖 -->
            <dependency>
                <groupId>org.slf4j</groupId>
                <artifactId>slf4j-api</artifactId>
                <version>1.7.25</version>
            </dependency>

            <dependency>
                <groupId>org.slf4j</groupId>
                <artifactId>slf4j-log4j12</artifactId>
                <version>1.7.25</version>
            </dependency>
            <!-- redis依赖 -->
            <dependency>
                <groupId>redis.clients</groupId>
                <artifactId>jedis</artifactId>
                <version>2.9.0</version>
            </dependency>
            <!-- json依赖 -->
            <dependency>
                <groupId>com.alibaba</groupId>
                <artifactId>fastjson</artifactId>
                <version>1.2.44</version>
            </dependency>

            <!--es依赖-->
            <dependency>
                <groupId>org.apache.flink</groupId>
                <artifactId>flink-connector-elasticsearch6_2.11</artifactId>
                <version>${flink.version}</version>
            </dependency>

        </dependencies>


    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.1</version>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                    <testExcludes>
                        <testExclude>/src/test/**</testExclude>
                    </testExcludes>
                    <encoding>utf-8</encoding>
                </configuration>
            </plugin>
            <plugin>
                <groupId>net.alchim31.maven</groupId>
                <artifactId>scala-maven-plugin</artifactId>
                <version>3.2.0</version>
                <executions>
                    <execution>
                        <id>compile-scala</id>
                        <phase>compile</phase>
                        <goals>
                            <goal>add-source</goal>
                            <goal>compile</goal>
                        </goals>
                    </execution>
                    <execution>
                        <id>test-compile-scala</id>
                        <phase>test-compile</phase>
                        <goals>
                            <goal>add-source</goal>
                            <goal>testCompile</goal>
                        </goals>
                    </execution>
                </executions>
                <configuration>
                    <scalaVersion>${scala.version}</scalaVersion>
                </configuration>
            </plugin>
            <plugin>
                <artifactId>maven-assembly-plugin</artifactId>
                <configuration>
                    <descriptorRefs>
                        <descriptorRef>jar-with-dependencies</descriptorRef>
                    </descriptorRefs>
                </configuration>
                <executions>
                    <execution>
                        <id>make-assembly</id> <!-- this is used for inheritance merges -->
                        <phase>package</phase> <!-- 指定在打包节点执行jar包合并操作 -->
                        <goals>
                            <goal>single</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
```

###### kafka producer代码开发

```java
package com.kkb.producer;

import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.serialization.StringSerializer;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Properties;
import java.util.Random;

/**
 * 模拟数据源
 */
public class MykafkaProducer {

    public static void main(String[] args) throws Exception{
        Properties prop = new Properties();
        //指定kafka broker地址
        prop.put("bootstrap.servers", "node01:9092,node02:9092,node03:9092");
        //指定key value的序列化方式
        prop.put("key.serializer", StringSerializer.class.getName());
        prop.put("value.serializer", StringSerializer.class.getName());
        //指定topic名称
        String topic = "data1";

        //创建producer链接
        KafkaProducer<String, String> producer = new KafkaProducer<String,String>(prop);

        //{"dt":"2018-01-01 10:11:11","countryCode":"US","data":[{"type":"s1","score":0.3,"level":"A"},{"type":"s2","score":0.2,"level":"B"}]}


        while(true){
            String message = "{\"dt\":\""+getCurrentTime()+"\",\"countryCode\":\""+getCountryCode()+"\",\"data\":[{\"type\":\""+getRandomType()+"\",\"score\":"+getRandomScore()+",\"level\":\""+getRandomLevel()+"\"},{\"type\":\""+getRandomType()+"\",\"score\":"+getRandomScore()+",\"level\":\""+getRandomLevel()+"\"}]}";
            System.out.println(message);
            //同步的方式，往Kafka里面生产数据
           producer.send(new ProducerRecord<String, String>(topic,message));


           Thread.sleep(2000);
        }
        //关闭链接
        //producer.close();
    }

    public static String getCurrentTime(){
        SimpleDateFormat sdf = new SimpleDateFormat("YYYY-MM-dd HH:mm:ss");
        return sdf.format(new Date());
    }

    public static String getCountryCode(){
        String[] types = {"US","TW","HK","PK","KW","SA","IN"};
        Random random = new Random();
        int i = random.nextInt(types.length);
        return types[i];
    }


    public static String getRandomType(){
        String[] types = {"s1","s2","s3","s4","s5"};
        Random random = new Random();
        int i = random.nextInt(types.length);
        return types[i];
    }
    public static double getRandomScore(){
        double[] types = {0.3,0.2,0.1,0.5,0.8};
        Random random = new Random();
        int i = random.nextInt(types.length);
        return types[i];
    }

    public static String getRandomLevel(){
        String[] types = {"A","A+","B","C","D"};
        Random random = new Random();
        int i = random.nextInt(types.length);
        return types[i];
    }


}

```

###### redis source代码开发

```java
package com.kkb.source;

import org.apache.flink.api.java.tuple.Tuple2;
import org.apache.flink.streaming.api.functions.source.SourceFunction;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.exceptions.JedisConnectionException;

import java.util.HashMap;
import java.util.Map;

/**
 *
 * hset areas AREA_US US
 * hset areas AREA_CT TW,HK
 * hset areas AREA_AR PK,KW,SA
 * hset areas AREA_IN IN
 *
 * HashMap
 *
 * US，AREA_US
 * TW，AREA_CT
 * HK，AREA_CT
 * HashMap<String,String>---->The type of the elements produced by this source.
 */
public class KkbRedisSource implements SourceFunction<HashMap<String,String>> {

    private Logger logger=LoggerFactory.getLogger(KkbRedisSource.class);

    private Jedis jedis;
    private boolean isRunning=true;

    @Override
    public void run(SourceContext<HashMap<String, String>> cxt) throws Exception {
        this.jedis = new Jedis("node01",6379);
        HashMap<String, String> map = new HashMap<>();
        while(isRunning){
          try{
              map.clear();
              Map<String, String> areas = jedis.hgetAll("areas");
              for(Map.Entry<String,String> entry: areas.entrySet()){
                  String area = entry.getKey();
                  String value = entry.getValue();
                  String[] fields = value.split(",");
                  for(String country:fields){
                      //
                      map.put(country,area);
                  }

              }
              if(map.size() > 0 ){
                  cxt.collect(map);
              }
              Thread.sleep(60000);
          }catch (JedisConnectionException e){
              logger.error("redis连接异常",e.getCause());
              this.jedis = new Jedis("node01",6379);
          }catch (Exception e){
              logger.error("数据源异常",e.getCause());
          }

        }

    }

    @Override
    public void cancel() {
        isRunning=false;
        if(jedis != null){
            jedis.close();
        }

    }
}

```

###### ETL处理代码开发

```java
package com.kkb.core;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.kkb.source.KkbRedisSource;
import org.apache.flink.api.common.serialization.SimpleStringSchema;
import org.apache.flink.streaming.api.CheckpointingMode;
import org.apache.flink.streaming.api.datastream.DataStream;
import org.apache.flink.streaming.api.datastream.DataStreamSource;
import org.apache.flink.streaming.api.datastream.SingleOutputStreamOperator;
import org.apache.flink.streaming.api.environment.CheckpointConfig;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.apache.flink.streaming.api.functions.co.CoFlatMapFunction;
import org.apache.flink.streaming.connectors.kafka.FlinkKafkaConsumer011;
import org.apache.flink.streaming.connectors.kafka.FlinkKafkaProducer011;
import org.apache.flink.streaming.connectors.kafka.internals.KeyedSerializationSchemaWrapper;
import org.apache.flink.util.Collector;

import java.util.HashMap;
import java.util.Properties;

/**
 * 数据清洗
 *
 *
 * 码表
 */
public class DataClean {
    public static void main(String[] args) throws Exception {

        StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();
        //我们是从Kafka里面读取数据，所以这儿就是topic有多少个partition，那么就设置几个并行度。
        env.setParallelism(3);

        /**
         * flink整合kafka，将kafka的offset保存到了checkPoint里面去了
         */
        env.enableCheckpointing(60000);
        env.getCheckpointConfig().setCheckpointingMode(CheckpointingMode.EXACTLY_ONCE);
        env.getCheckpointConfig().setMinPauseBetweenCheckpoints(10000);
        env.getCheckpointConfig().setMaxConcurrentCheckpoints(1);
        env.getCheckpointConfig().enableExternalizedCheckpoints(CheckpointConfig.ExternalizedCheckpointCleanup.RETAIN_ON_CANCELLATION);


        //第一步：从Kafka里面读取数据 消费者 数据源需要kafka
        //topic的取名还是有讲究的，最好就是让人根据这个名字就能知道里面有什么数据。
        String topic="data1";
        Properties consumerProperties = new Properties();
        consumerProperties.put("bootstrap.servers","node01:9092,node02:9092,node03:9092");
        consumerProperties.put("group.id","allTopic_consumer");
        consumerProperties.put("enable.auto.commit", "false");
        consumerProperties.put("auto.offset.reset","earliest");

        /**
         * String topic, 主题
         * KafkaDeserializationSchema<T> deserializer,
         * Properties props
         */
        FlinkKafkaConsumer011<String> consumer = new FlinkKafkaConsumer011<>(topic,
                new SimpleStringSchema(),
                consumerProperties);

        //读取kafka中的数据
        DataStreamSource<String> allData = env.addSource(consumer);

        //读取redis数据，设置为广播变量
        DataStream<HashMap<String, String>> mapData = env.addSource(new KkbRedisSource()).broadcast();

        //实现把2个流连起来
        SingleOutputStreamOperator<String> etlData = allData
                                                        .connect(mapData)
                                                        .flatMap(new CoFlatMapFunction<String, HashMap<String, String>, String>() {

            HashMap<String, String> allMap = new HashMap<String, String>();
            //里面处理的是kafka的数据
            @Override
            public void flatMap1(String line, Collector<String> out) throws Exception {
                JSONObject jsonObject = JSONObject.parseObject(line);
                String dt = jsonObject.getString("dt");
                String countryCode = jsonObject.getString("countryCode");
                //可以根据countryCode获取大区的名字
                String area = allMap.get(countryCode);
                JSONArray data = jsonObject.getJSONArray("data");
                for (int i = 0; i < data.size(); i++) {
                    JSONObject dataObject = data.getJSONObject(i);
                    System.out.println("大区："+area);
                    dataObject.put("dt", dt);
                    dataObject.put("area", area);
                    //下游获取到数据的时候，也就是一个json格式的数据
                    out.collect(dataObject.toJSONString());
                }
            }

            //里面处理的是redis里面的数据
            @Override
            public void flatMap2(HashMap<String, String> map,
                                 Collector<String> collector) throws Exception {
                System.out.println(map.toString());
                allMap = map;
            }
        });

        //ETL -> load kafka
        etlData.print().setParallelism(1);
        /**
         * String topicId,
         * SerializationSchema<IN> serializationSchema,
         * Properties producerConfig)
         */
//        String outputTopic="allDataClean";
//        Properties producerProperties = new Properties();
//        producerProperties.put("bootstrap.servers","192.168.167.254:9092");
//        FlinkKafkaProducer011<String> producer = new FlinkKafkaProducer011<>(outputTopic,
//                new KeyedSerializationSchemaWrapper<String>(new SimpleStringSchema()),
//                producerProperties);java
//
//        //搞一个Kafka的生产者
//        etlData.addSink(producer);
        env.execute("DataClean");
    }
}

```

运行producer程序，然后运行ETL程序，部分输出结果如下：

```scala
大区：AREA_AR
大区：AREA_AR
{"dt":"2020-05-12 14:17:09","area":"AREA_AR","score":0.8,"level":"A","type":"s3"}
{"dt":"2020-05-12 14:17:09","area":"AREA_AR","score":0.1,"level":"B","type":"s1"}
大区：AREA_US
大区：AREA_US
{"dt":"2020-05-12 14:17:11","area":"AREA_US","score":0.5,"level":"A+","type":"s2"}
{"dt":"2020-05-12 14:17:11","area":"AREA_US","score":0.3,"level":"D","type":"s4"}
```

**本次ETL flink案例，建议直接copy pom依赖来建立maven工程，否则容易出现依赖包版本的问题，从而导致程序运行失败。**


## 6  实时报表

##### 6.1 需求背景

主要针对直播/短视频平台审核指标的统计

* 1、统计不同大区每1 min内过审(上架)视频的数据量（单词的个数）
  * 每分钟【1:事件时间 2:加上水位，这样的话，我们可以挽救一些数据。3:收集数据延迟过多的数据】的不同大区的【有效视频】的数量（单词计数）

* 2、统计不同大区每1 min内未过审(下架)的数据量

##### 6.3 方案实现

* 1、统计的过去的一分钟的每个大区的有效视频数量
* 2、统计的过去的一分钟的每个大区的,不同类型的有效视频数量

统计的过去一分钟的每个单词出现次数。

```java
{"dt":"2020-04-30 15:42:12","type":"type4","username":"username1","area":"AREA_CT"}
{"dt":"2020-04-30 15:42:12","type":"type1","username":"username1","area":"AREA_AR"}
{"dt":"2020-04-30 15:42:13","type":"type4","username":"username5","area":"AREA_US"}
{"dt":"2020-04-30 15:42:13","type":"type4","username":"username4","area":"AREA_AR"}
{"dt":"2020-04-30 15:42:14","type":"type3","username":"username5","area":"AREA_IN"}
{"dt":"2020-04-30 15:42:14","type":"type1","username":"username5","area":"AREA_IN"}
{"dt":"2020-04-30 15:42:15","type":"type4","username":"username1","area":"AREA_CT"}
```

* node01执行以下命令创建kafka的topic

```shell
kafka-topics.sh --create --partitions 2 --topic data2 --replication-factor 2 --zookeeper node01:2181,node02:2181,node03:2181
```

###### pom文件：

```xml
 <properties>
        <flink.version>1.9.2</flink.version>
        <scala.version>2.11.8</scala.version>
    </properties>

    <dependencyManagement>

        <dependencies>
            <dependency>
                <groupId>org.apache.flink</groupId>
                <artifactId>flink-java</artifactId>
                <version>${flink.version}</version>
            </dependency>
            <dependency>
                <groupId>org.apache.flink</groupId>
                <artifactId>flink-streaming-java_2.11</artifactId>
                <version>${flink.version}</version>
            </dependency>
            <dependency>
                <groupId>org.apache.flink</groupId>
                <artifactId>flink-scala_2.11</artifactId>
                <version>${flink.version}</version>
            </dependency>
            <dependency>
                <groupId>org.apache.flink</groupId>
                <artifactId>flink-streaming-scala_2.11</artifactId>
                <version>${flink.version}</version>
            </dependency>

            <dependency>
                <groupId>org.apache.bahir</groupId>
                <artifactId>flink-connector-redis_2.11</artifactId>
                <version>1.0</version>
            </dependency>

            <dependency>
                <groupId>org.apache.flink</groupId>
                <artifactId>flink-statebackend-rocksdb_2.11</artifactId>
                <version>${flink.version}</version>
            </dependency>

            <dependency>
                <groupId>org.apache.flink</groupId>
                <artifactId>flink-connector-kafka-0.11_2.11</artifactId>
                <version>${flink.version}</version>
            </dependency>

            <dependency>
                <groupId>org.apache.kafka</groupId>
                <artifactId>kafka-clients</artifactId>
                <version>0.11.0.3</version>
            </dependency>
            <!-- 日志相关依赖 -->
            <dependency>
                <groupId>org.slf4j</groupId>
                <artifactId>slf4j-api</artifactId>
                <version>1.7.25</version>
            </dependency>

            <dependency>
                <groupId>org.slf4j</groupId>
                <artifactId>slf4j-log4j12</artifactId>
                <version>1.7.25</version>
            </dependency>
            <!-- redis依赖 -->
            <dependency>
                <groupId>redis.clients</groupId>
                <artifactId>jedis</artifactId>
                <version>2.9.0</version>
            </dependency>
            <!-- json依赖 -->
            <dependency>
                <groupId>com.alibaba</groupId>
                <artifactId>fastjson</artifactId>
                <version>1.2.44</version>
            </dependency>

            <!--es依赖-->
            <dependency>
                <groupId>org.apache.flink</groupId>
                <artifactId>flink-connector-elasticsearch6_2.11</artifactId>
                <version>${flink.version}</version>
            </dependency>

        </dependencies>

    </dependencyManagement>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.1</version>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                    <testExcludes>
                        <testExclude>/src/test/**</testExclude>
                    </testExcludes>
                    <encoding>utf-8</encoding>
                </configuration>
            </plugin>
            <plugin>
                <groupId>net.alchim31.maven</groupId>
                <artifactId>scala-maven-plugin</artifactId>
                <version>3.2.0</version>
                <executions>
                    <execution>
                        <id>compile-scala</id>
                        <phase>compile</phase>
                        <goals>
                            <goal>add-source</goal>
                            <goal>compile</goal>
                        </goals>
                    </execution>
                    <execution>
                        <id>test-compile-scala</id>
                        <phase>test-compile</phase>
                        <goals>
                            <goal>add-source</goal>
                            <goal>testCompile</goal>
                        </goals>
                    </execution>
                </executions>
                <configuration>
                    <scalaVersion>${scala.version}</scalaVersion>
                </configuration>
            </plugin>
            <plugin>
                <artifactId>maven-assembly-plugin</artifactId>
                <configuration>
                    <descriptorRefs>
                        <descriptorRef>jar-with-dependencies</descriptorRef>
                    </descriptorRefs>
                </configuration>
                <executions>
                    <execution>
                        <id>make-assembly</id> <!-- this is used for inheritance merges -->
                        <phase>package</phase> <!-- 指定在打包节点执行jar包合并操作 -->
                        <goals>
                            <goal>single</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>

```

###### DataReport 核心代码

```java
package com.kkb.core;


import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.kkb.function.MySumFuction;
import com.kkb.watermark.MyWaterMark;
import org.apache.flink.api.common.functions.MapFunction;
import org.apache.flink.api.common.serialization.SimpleStringSchema;
import org.apache.flink.api.java.tuple.Tuple2;
import org.apache.flink.api.java.tuple.Tuple3;
import org.apache.flink.api.java.tuple.Tuple4;
import org.apache.flink.contrib.streaming.state.RocksDBStateBackend;
import org.apache.flink.streaming.api.CheckpointingMode;
import org.apache.flink.streaming.api.TimeCharacteristic;
import org.apache.flink.streaming.api.datastream.DataStream;
import org.apache.flink.streaming.api.datastream.DataStreamSource;
import org.apache.flink.streaming.api.datastream.SingleOutputStreamOperator;
import org.apache.flink.streaming.api.environment.CheckpointConfig;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.apache.flink.streaming.api.windowing.assigners.TumblingEventTimeWindows;
import org.apache.flink.streaming.api.windowing.time.Time;
import org.apache.flink.streaming.connectors.kafka.FlinkKafkaConsumer011;
import org.apache.flink.streaming.connectors.kafka.FlinkKafkaProducer011;
import org.apache.flink.streaming.connectors.kafka.internals.KeyedSerializationSchemaWrapper;
import org.apache.flink.util.OutputTag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Properties;

/**
 * ETL:对数据进行预处理
 * 报表：就是要计算一些指标
 */
public class DataReport {

    public static void main(String[] args) throws Exception{


        StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();

        env.setParallelism(3);
        env.enableCheckpointing(60000);
        env.getCheckpointConfig().setCheckpointingMode(CheckpointingMode.EXACTLY_ONCE);
        env.getCheckpointConfig().setMinPauseBetweenCheckpoints(10000);
        env.getCheckpointConfig().setMaxConcurrentCheckpoints(1);
        env.getCheckpointConfig().enableExternalizedCheckpoints(
                CheckpointConfig.ExternalizedCheckpointCleanup.RETAIN_ON_CANCELLATION);
        //env.setStateBackend(new RocksDBStateBackend(""));
        //设置time
        env.setStreamTimeCharacteristic(TimeCharacteristic.EventTime);
        String topic="data2";
        Properties consumerProperties = new Properties();
        consumerProperties.put("bootstrap.servers","node01:9092,node02:9092,node03:9092");
        consumerProperties.put("group.id","auditLog_consumer");
        consumerProperties.put("enable.auto.commit", "false");
        consumerProperties.put("auto.offset.reset","earliest");

        //读取Kafka里面对数据
        //{"dt":"2019-11-24 21:19:47","type":"child_unshelf","username":"shenhe1","area":"AREA_ID"}
        FlinkKafkaConsumer011<String> consumer =
                new FlinkKafkaConsumer011<String>(topic,new SimpleStringSchema(),consumerProperties);


        DataStreamSource<String> data = env.addSource(consumer);

        Logger logger= LoggerFactory.getLogger(DataReport.class);

        //对数据进行处理
        SingleOutputStreamOperator<Tuple3<Long, String, String>> preData = data.map(new MapFunction<String, Tuple3<Long, String, String>>() {
            /**
             * Long:time
             * String: type
             * String: area
             * @return
             * @throws Exception
             */
            @Override
            public Tuple3<Long, String, String> map(String line) throws Exception {
                JSONObject jsonObject = JSON.parseObject(line);
                String dt = jsonObject.getString("dt");
                //按照这两个字段进行分组
                String type = jsonObject.getString("type");
                String area = jsonObject.getString("area");
                long time = 0;

                try {
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                    time = sdf.parse(dt).getTime();
                } catch (Exception e){
                    logger.error("时间解析失败，dt:" + dt, e.getCause());
                }
                return Tuple3.of(time, type, area);
            }
        });

        /**
         *过滤无效的数据  tuple3.f0指的是第一个字段time
         */
        SingleOutputStreamOperator<Tuple3<Long, String, String>> filterData = preData.filter(tuple3 -> tuple3.f0 != 0);


        /**
         * 收集迟到太久的数据
         */
        OutputTag<Tuple3<Long,String,String>> outputTag= new OutputTag<Tuple3<Long,String,String>>("late-date"){};
        /**
         * 进行窗口的统计操作
         * 统计的过去的一分钟的每个大区的,不同类型的有效视频数量
         */

        SingleOutputStreamOperator<Tuple4<String, String, String, Long>> resultData = filterData.assignTimestampsAndWatermarks(new MyWaterMark())
                //type   area
                .keyBy(1, 2)
                .window(TumblingEventTimeWindows.of(Time.seconds(30)))
                .sideOutputLateData(outputTag)
                .apply(new MySumFuction());

        /**
         * 收集到延迟太多的数据，业务里面要求写到Kafka
         */

        SingleOutputStreamOperator<String> sideOutput =
                //java8
                resultData.getSideOutput(outputTag).map(line -> line.toString());

//        String outputTopic="lateData";
//        Properties producerProperties = new Properties();
//        producerProperties.put("bootstrap.servers","node01:9092");
//        FlinkKafkaProducer011<String> producer = new FlinkKafkaProducer011<>(outputTopic,
//                new KeyedSerializationSchemaWrapper<String>(new SimpleStringSchema()),
//                producerProperties);
//        sideOutput.addSink(producer);

        resultData.print();

        env.execute("DataReport");

    }
}

```

###### ProducerDataReport 生产消息

```java
package com.kkb.source;

import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.serialization.StringSerializer;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Properties;
import java.util.Random;

/**
 *
 */
public class ProducerDataReport {

    public static void main(String[] args) throws Exception{
        Properties prop = new Properties();
        //指定kafka broker地址
        prop.put("bootstrap.servers", "node01:9092,node02:9092,node03:9092");
        //指定key value的序列化方式
        prop.put("key.serializer", StringSerializer.class.getName());
        prop.put("value.serializer", StringSerializer.class.getName());
        //指定topic名称
        String topic = "data2";

        //创建producer链接
        KafkaProducer<String, String> producer = new KafkaProducer<String,String>(prop);

        //{"dt":"2018-01-01 10:11:22","type":"shelf","username":"shenhe1","area":"AREA_US"}

        //生产消息
        while(true){
            String message = "{\"dt\":\""+getCurrentTime()+"\",\"type\":\""+getRandomType()+"\",\"username\":\""+getRandomUsername()+"\",\"area\":\""+getRandomArea()+"\"}";
            System.out.println(message);
            producer.send(new ProducerRecord<String, String>(topic,message));
            Thread.sleep(500);
        }
        //关闭链接
        //producer.close();
    }

    public static String getCurrentTime(){
        SimpleDateFormat sdf = new SimpleDateFormat("YYYY-MM-dd HH:mm:ss");
        return sdf.format(new Date());
    }

    public static String getRandomArea(){
        String[] types = {"AREA_US","AREA_CT","AREA_AR","AREA_IN","AREA_ID"};
        Random random = new Random();
        int i = random.nextInt(types.length);
        return types[i];
    }


    public static String getRandomType(){
        String[] types = {"type1","type2","type3","type4","type5"};
        Random random = new Random();
        int i = random.nextInt(types.length);
        return types[i];
    }


    public static String getRandomUsername(){
        String[] types = {"username1","username2","username3","username4","username5"};
        Random random = new Random();
        int i = random.nextInt(types.length);
        return types[i];
    }


}
```

###### MyWaterMark  设置水位线

```java
package com.kkb.watermark;


import org.apache.flink.api.java.tuple.Tuple3;
import org.apache.flink.streaming.api.functions.AssignerWithPeriodicWatermarks;
import org.apache.flink.streaming.api.watermark.Watermark;

import javax.annotation.Nullable;

/**
 *
 */
public class MyWaterMark
        implements AssignerWithPeriodicWatermarks<Tuple3<Long,String,String>> {

    long currentMaxTimestamp=0L;

    final long maxOutputOfOrderness=20000L;//允许乱序时间
    @Nullable
    @Override
    public Watermark getCurrentWatermark() {
        return new Watermark(currentMaxTimestamp - maxOutputOfOrderness);
    }

    @Override
    public long extractTimestamp(Tuple3<Long, String, String> element, long l) {
        Long timeStamp = element.f0;
        currentMaxTimestamp=Math.max(timeStamp,currentMaxTimestamp);
        return timeStamp;
    }
}

```

###### MySumFunction  

```java
package com.kkb.function;

import org.apache.flink.api.java.tuple.Tuple;
import org.apache.flink.api.java.tuple.Tuple3;
import org.apache.flink.api.java.tuple.Tuple4;
import org.apache.flink.streaming.api.functions.windowing.WindowFunction;
import org.apache.flink.streaming.api.windowing.windows.TimeWindow;
import org.apache.flink.util.Collector;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * IN,输入的数据类型
 * OUT,输出的数据类型
 * KEY,在flink里面这儿其实就是分组的字段，大家永远看到的是一个tuple字段
 *  只不过，如果你的分组的字段是有一个，那么这个tuple里面就只会有一个字段
 *  如果说你的分组的字段有多个，那么这个里面就会有多个字段。
 * W extends Window
 *
 */
public class MySumFuction implements WindowFunction<Tuple3<Long,String,String>,
        Tuple4<String,String,String,Long>,Tuple,TimeWindow> {
    @Override
    public void apply(Tuple tuple, TimeWindow timeWindow,
                      Iterable<Tuple3<Long, String, String>> input,
                      Collector<Tuple4<String, String, String, Long>> out) {
        //获取分组字段信息
        String type = tuple.getField(0).toString();
        String area = tuple.getField(1).toString();

        java.util.Iterator<Tuple3<Long, String, String>> iterator = input.iterator();
        long count=0;
        while(iterator.hasNext()){
            iterator.next();
            count++;
        }
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String time = sdf.format(new Date(timeWindow.getEnd()));


        Tuple4<String, String, String, Long> result =
                new Tuple4<String, String, String, Long>(time, type, area, count);
        out.collect(result);
    }
}

```

###### 部分输出结果

启动生产者生产消息程序，启动核心代码，查看输出结果：

```scala
1> (2020-05-12 18:26:00,type3,AREA_CT,2)
2> (2020-05-12 18:26:00,type5,AREA_CT,1)
3> (2020-05-12 18:26:00,type4,AREA_IN,2)
1> (2020-05-12 18:26:00,type2,AREA_ID,1)
3> (2020-05-12 18:26:00,type2,AREA_AR,4)
2> (2020-05-12 18:26:00,type3,AREA_AR,2)
3> (2020-05-12 18:26:00,type4,AREA_ID,1)
2> (2020-05-12 18:26:00,type3,AREA_ID,2)
```



