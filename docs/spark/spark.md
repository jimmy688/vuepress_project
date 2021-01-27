

课前准备

安装好对应版本的hadoop集群

安装好对应版本的zookeeper集群

## 课堂主题

本堂课主要围绕 **spark的基础知识点** 进行讲解。主要包括以下几个方面

1. spark核心概念
2. spark集群架构
3. spark集群安装部署
4. spark-shell的使用
5. 通过IDEA开发spark程序
6. RDD弹性分布式数据集的概念
7. RDD弹性分布式数据集的五大属性
8. RDD弹性分布式数据集的算子操作分类
9. RDD弹性分布式数据集的算子操作练习
10. RDD弹性分布式数据集的依赖关系
11. RDD弹性分布式数据集的lineage血统机制
12. RDD弹性分布式数据集的缓存机制
13. spark任务的DAG有向无环图的构建
14. spark任务如何划分stage
15. spark的任务调度流程
16. spark的运行架构
17. 基于wordcount程序剖析spark任务提交、划分、调度流程

## spark是什么

"Apache Spark" is a unified analytics engine for large-scale data processing.

spark是针对于大规模数据处理的统一分析引擎

spark是在Hadoop基础上的改进，是UC Berkeley AMP lab所开源的类Hadoop MapReduce的通用的并行计算框架，Spark基于map reduce算法实现的分布式计算，拥有Hadoop MapReduce所具有的优点；但不同于MapReduce的是Job中间输出和结果可以保存在内存中，从而不再需要读写HDFS，因此Spark能更好地适用于数据挖掘与机器学习等需要迭代的map reduce的算法。

spark是基于内存计算框架，计算速度非常之快，但是它仅仅只是涉及到计算，并没有涉及到数据的存储，后期需要使用spark对接外部的数据源，比如hdfs。

注意：spark只做计算不做存储

## spark的四大特性

查看官网可以了解spark的四大特性，spark官网地址：http://spark.apache.org/

#### 速度快

spark运行速度相对于hadoop提高100倍,见下图：

Apache Spark使用最先进的DAG调度程序，查询优化程序和物理执行引擎，实现批量和流式数据的高性能。

![image-20200414153227594](spark.assets/image-20200414153227594.png)

##### spark比MR快的2个主要原因（面试题）

###### 1、基于内存

mapreduce任务后期再计算的时候，每一个job的输出结果会落地到磁盘，后续有其他的job需要依赖于前面job的输出结果，这个时候就需要进行大量的磁盘io操作。性能就比较低。


spark任务后期再计算的时候，job的输出结果可以保存在内存中，后续有其他的job需要依赖于前面job的输出结果，这个时候就直接从内存中获取得到，避免了磁盘io操作，性能比较高


对于spark程序和mapreduce程序都会产生shuffle阶段，在shuffle阶段中它们产生的数据都会落地到磁盘。

###### 2、进程与线程

mapreduce任务以进程的方式运行在yarn集群中，比如程序中有100个MapTask，一个task就需要一个进程，这些task要运行就需要开启100个进程。

spark任务以线程的方式运行在进程中，比如程序中有100个MapTask，后期一个task就对应一个线程，这里就不再是进程，这些task需要运行，这里可以极端一点：只需要开启1个进程，在这个进程中启动100个线程就可以了。

进程中可以启动很多个线程，而开启一个进程与开启一个线程需要的时间和调度代价是不一样。 开启一个进程需要的时间远远大于开启一个线程。



#### 易用性

可以通过 java/scala/python/R/SQL等不同语言快速去编写spark程序

![image-20200414153247802](spark.assets/image-20200414153247802.png)

#### 通用性

spark框架不在是一个简单的框架，可以把spark理解成一个spark生态系统，它内部是包含了很多模块，基于不同的应用场景可以选择对应的模块去使用，见下图：

1. sparksql：通过sql去开发spark程序做一些离线分析
2. sparkStreaming：主要是用来解决公司有实时计算的这种场景
3. Mlib：它封装了一些机器学习的算法库
4. Graphx：图计算

![image-20200414153311063](spark.assets/image-20200414153311063.png)

#### 兼容性

spark程序就是一个计算逻辑程序，这个任务要运行就需要计算资源（内存、cpu、磁盘），哪里可以给当前这个任务提供计算资源，就可以把spark程序提交到哪里去运行。

目前主要的运行方式是下面的standAlone和yarn。

**standAlone：**它是spark自带的独立运行模式，整个任务的资源分配由spark集群的老大Master负责

**yarn：**可以把spark程序提交到yarn中运行，整个任务的资源分配由yarn中的老大ResourceManager负责

mesos：它也是apache开源的一个类似于yarn的资源调度平台

![image-20200414153331693](spark.assets/image-20200414153331693.png)

## spark集群架构（重要）

![spark](spark.assets/spark.png)

- Driver：执行客户端写好的main方法，它会构建一个名叫SparkContext对象，该对象是所有spark程序的执行入口
- Application：就是一个spark的应用程序，它是包含了客户端的代码和任务运行的资源信息
- ClusterManager：给程序提供计算资源的外部服务,在不同的运行平台，ClusterManager也不同，主要有以下3种：
  - standAlone：它是spark自带的集群模式，整个任务的资源分配由spark集群的老大Master负责
  - yarn：可以把spark程序提交到yarn中运行，整个任务的资源分配由yarn中的老大ResourceManager负责
  - mesos：它也是apache开源的一个类似于yarn的资源调度平台。
- Master：它是整个spark集群的主节点，负责任务资源的分配
- Worker：它是整个spark集群的从节点，负责任务计算的节点
- Executor：它是一个进程，它会在worker节点启动该进程（计算资源），一个worker节点可以有多个Executor进程
- Task：spark任务是以task线程的方式运行在worker节点对应的executor进程中



## spark集群安装部署

搭建spark集群要事先搭建好zookeeper集群，spark会依赖zookeeper集群来实现Master的高可用。

#### 第一步：下载安装包

下载安装包：spark-2.3.3-bin-hadoop2.7.tgz

下载地址：

https://archive.apache.org/dist/spark/spark-2.3.3/spark-2.3.3-bin-hadoop2.7.tgz

#### 第二步：解压安装包

上传安装包到node01,解压，修改名称：

```sh
cd /kkb/soft
rz

tar -zxvf /kkb/soft/spark-2.3.3-bin-hadoop2.7.tgz -C /kkb/install/
cd /kkb/install
mv spark-2.3.3-bin-hadoop2.7 spark
```

#### 第三步：修改配置文件

进入到spark的安装目录下对应的conf文件夹

```sh
cd /kkb/install/spark/conf
mv spark-env.sh.template spark-env.sh
vim spark-env.sh
```

添加下面内容

```shell
#配置java的环境变量
export JAVA_HOME=/kkb/install/jdk1.8.0_141
#配置zk相关信息
export SPARK_DAEMON_JAVA_OPTS="-Dspark.deploy.recoveryMode=ZOOKEEPER  -Dspark.deploy.zookeeper.url=node01:2181,node02:2181,node03:2181  -Dspark.deploy.zookeeper.dir=/spark"
```

说明：

1. -Dspark.deploy.recoveryMode=ZOOKEEPER 指定spark的恢复模式为ZOOKEEPER
2. -Dspark.deploy.zookeeper.url=node01:2181,node02:2181,node03:2181指定zookeeper集群的地址
3. -Dspark.deploy.zookeeper.dir=/spark" 指定spark在zookeeper中创建的节点（文件），随便设置一个名字即可

设定spark的从节点：

```sh
mv slaves.template slaves
vim slaves 
```

```sh
#指定spark集群的worker节点
node02
node03
```

#### 第四步：分发安装目录到其他机器

```shell
scp -r /kkb/install/spark node02:/kkb/install
scp -r /kkb/install/spark node03:/kkb/install
```

#### 第五步：修改spark环境变量

所有节点修改/etc/profile

```
sudo vim /etc/profile
```

```shell
export SPARK_HOME=/kkb/install/spark
export PATH=$PATH:$SPARK_HOME/bin:$SPARK_HOME/sbin
```

```
source /etc/profile
```



## spark集群的启动和停止

必须先启动zookeeper集群

#### 启动spark

在任意一台服务器来执行下列脚本（条件：需要任意2台机器之间实现ssh免密登录），

```sh
$SPARK_HOME/sbin/start-all.sh
```

在哪里启动这个脚本，就会在当前该机器启动一个Master进程，整个集群的worker进程的启动由slaves文件决定

后期可以在其他机器单独在启动master,实现高可用：

```sh
$SPARK_HOME/sbin/start-master.sh
```

验证是否成功开启：

```sh
[hadoop@node01 conf]$ xcall jps
************= node01 jps ************=
7892 Jps
7610 QuorumPeerMain
7739 Master
************= node02 jps ************=
7857 Master
7941 Jps
7751 Worker
7611 QuorumPeerMain
************= node03 jps ************=
7921 Jps
7802 Worker
7643 QuorumPeerMain
```

#### 停止spark

在处于active Master主节点执行

```
$SPARK_HOME/sbin/stop-all.sh
```

在处于standBy Master主节点执行

```
$SPARK_HOME/sbin/stop-master.sh
```

## spark高可用思考问题

问题思考：

1、如何恢复到上一次活着master挂掉之前的状态?

```
在高可用模式下，整个spark集群就有很多个master，其中只有一个master被zk选举成活着的master，其他的多个master都处于standby，同时把整个spark集群的元数据信息通过zk中节点进行保存。

后期如果活着的master挂掉。首先zk会感知到活着的master挂掉，下面开始在多个处于standby中的master进行选举，再次产生一个活着的master，这个活着的master会读取保存在zk节点中的spark集群元数据信息，恢复到上一次master的状态。整个过程在恢复的时候经历过了很多个不同的阶段，每个阶段都需要一定时间，最终恢复到上个活着的master的状态，整个恢复过程一般需要1-2分钟。
```

2、在master的恢复阶段对任务的影响?

```
a）对已经运行的任务是没有任何影响
   由于该任务正在运行，说明它已经拿到了计算资源，这个时候就不需要master。
   	  
b) 对即将要提交的任务是有影响
  由于该任务需要有计算资源，这个时候会找活着的master去申请计算资源，由于没有一个活着的master,该任务是获取不到计算资源，也就是任务无法运行。
```

![image-20200414175158839](spark.assets/image-20200414175158839.png)



## spark集群的web管理界面

当启动好spark集群之后，可以访问这样一个地址：http://...:8080

比如说，如果node01/node02都启动了Master,则可以访问地址：http://node01:8080和http://node02:8080

可以通过这个web界面观察到很多信息

* 整个spark集群的详细信息
* 整个spark集群总的资源信息
* 整个spark集群已经使用的资源信息
* 整个spark集群还剩的资源信息
* 整个spark集群正在运行的任务信息
* 整个spark集群已经完成的任务信息

node01：

![image-20200414172049366](spark.assets/image-20200414172049366.png)

node02:

![image-20200414172114655](spark.assets/image-20200414172114655.png)

整个spark集群的计算资源是把所有worker节点的资源进行累加，下面是老师的截图：

![image-20200414172533211](spark.assets/image-20200414172533211.png)

## 初识spark程序

#### 普通模式提交 (指定活着的master地址)

指定的必须是alive状态的Master地址，否则会执行失败。

```
cd /kkb/install/spark
```

```shell
bin/spark-submit \
--class org.apache.spark.examples.SparkPi \
--master spark://node01:7077 \
--executor-memory 1G \
--total-executor-cores 2 \
examples/jars/spark-examples_2.11-2.3.3.jar \
10


####参数说明
--class：指定包含main方法的主类
--master：指定spark集群master地址
--executor-memory：指定任务在运行的时候需要的每一个executor内存大小
--total-executor-cores： 指定任务在运行的时候需要总的cpu核数
examples/jars/spark-examples_2.11-2.3.3.jar :是spark程序打包成的jar包,spark提供的计算圆周率的测试包
10 ：spark程序要用到的参数
```

运行结果查看：

![image-20200414175405614](spark.assets/image-20200414175405614.png)

![image-20200414175505390](spark.assets/image-20200414175505390.png)

#### 高可用模式提交 (集群有很多个master）

当Master有多个的时候，上面的提交方式就显得很麻烦了，因为要找到alive状态的Master很费时间。

企业中，一般都是固定几台机器来启动Master,然后使用高可用模式提交，这个模式会**轮询**尝试连接Master列表中的Master,连接成功了就将spark程序提交上去。

```shell
bin/spark-submit \
--class org.apache.spark.examples.SparkPi \
--master spark://node01:7077,node02:7077,node03:7077 \
--executor-memory 1G \
--total-executor-cores 2 \
examples/jars/spark-examples_2.11-2.3.3.jar \
10

spark集群中有很多个master，并不知道哪一个master是活着的master，即使你知道哪一个master是活着的master，它也有可能下一秒就挂掉，这里就可以把所有master都罗列出来
--master spark://node01:7077,node02:7077,node03:7077

后期程序会轮训整个master列表，最终找到活着的master，然后向它申请计算资源，最后运行程序。
```



## spark-shell使用

#### 运行spark-shell --master local[N] 读取本地文件

选项说明：

- local 表示程序在本地进行计算，跟spark集群目前没有任何关系
- N  它是一个正整数，表示使用N个线程参与任务计算
- local[N] 表示本地采用N个线程计算任务

spark-shell --master local[2]

- 默认会产生一个SparkSubmit进程

示例： 读取本地文件进行单词统计

###### 第一步：创建文件

```sh
[hadoop@node01 ~]$ cd /tmp
[hadoop@node01 tmp]$ vi words.txt
hadoop spark spark
flume flink hadoop hadoop
```

###### 第二步：开启spark-shell

```scala
[hadoop@node01 ~]$ spark-shell --master local[2]
2020-04-14 18:15:00 WARN  NativeCodeLoader:62 - Unable to load native-hadoop library for your platform... using builtin-java classes where applicable
Setting default log level to "WARN".
To adjust logging level use sc.setLogLevel(newLevel). For SparkR, use setLogLevel(newLevel).
Spark context Web UI available at http://node01:4040
Spark context available as 'sc' (master = local[2], app id = local-1586859312537).
Spark session available as 'spark'.
Welcome to
      ____              __
     / __/__  ___ _____/ /__
    _\ \/ _ \/ _ `/ __/  '_/
   /___/ .__/\_,_/_/ /_/\_\   version 2.3.3
      /_/
         
Using Scala version 2.11.8 (Java HotSpot(TM) 64-Bit Server VM, Java 1.8.0_141)
Type in expressions to have them evaluated.
Type :help for more information.

scala> 
```

说明：

1. Spark context available as 'sc'，启动spark shell的时候，Spark context被初始化为了'sc'

###### 第三步：编写scala程序

```scala
scala> sc.textFile("file:///tmp/words.txt").flatMap(x=>x.split(" ")).map(x=>(x,1)).reduceByKey((x,y)=>x+y).collect
res0: Array[(String, Int)] = Array((flink,1), (spark,2), (hadoop,3), (flume,1))

//可以简写成下面：
sc.textFile("file:///tmp/words.txt").flatMap(_.split(" ")).map((_,1)).reduceByKey(_+_).collect
```

说明：

1. sc.textFile()——加载数据  大致格式：hadoop spark spark
2. flatMap(x=>x.split(" "))——扁平化： 大致格式：List(hadoop,spark,spark)
3. map(x=>(x,1))——映射 大致格式：List((hadoop,1),(spark,1),(spark,1))
4. reduceByKey((x,y)=>x+y)——按Key聚合  大致格式：(hadoop,List(1,1))----->(hadoop,2)
5. collect——收集打印
6. 结果是被装在Array里面的

#### 运行spark-shell --master local[N] 读取HDFS上文件

###### spark整合HDFS

在node01上修改配置文件

```sh
vi /kkb/install/spark/conf/spark-env.sh 
```

```shell
export HADOOP_CONF_DIR=/kkb/install/hadoop-2.6.0-cdh5.14.2/etc/hadoop
```

分发到其他节点

~~~shell
sudo scp spark-env.sh node02:/kkb/install/spark/conf
sudo scp spark-env.sh node03:/kkb/install/spark/conf
~~~

示例：读取HDFS文件进行单词统计

###### 第一步：将文件上传到hdfs

开启hadoop

```
hadoop.sh start
```

```
hdfs dfs -put /tmp/words.txt /
```

###### 第二步：开启spark shell

```
spark-shell --master local[2]
```

###### 第三步：编写spark程序

```scala
scala> sc.textFile("hdfs://node01:8020/words.txt").flatMap(_.split(" ")).map((_,1)).reduceByKey(_+_).collect
res5: Array[(String, Int)] = Array((flink,1), (spark,2), (hadoop,3), (flume,1))

//简写：
sc.textFile("/words.txt").flatMap(_.split(" ")).map((_,1)).reduceByKey(_+_).collect
```



#### 运行spark-shell 指定集群中活着master

上面的--local方式是本地运行的，没有使用到spark集群，当使用--master指定alive状态的master时就是使用spark集群来运行了。

开启spark shell

```sh
spark-shell --master spark://node01:7077 --executor-memory 1g  --total-executor-cores 2

--master spark://node01:7077  #指定活着的master地址
--executor-memory 1g    #指定每一个executor进程的内存大小
--total-executor-cores 4    #指定总的executor进程cpu核数
```

开启spark shell，访问web端，会显示（local方式运行spark shell时是不会显示的）：

![image-20200414194201687](spark.assets/image-20200414194201687.png)

示例1：读取HDFS上文件进行单词统计

```scala
sc.textFile("hdfs://node01:8020/words.txt").flatMap(_.split(" ")).map((_,1)).reduceByKey(_+_).collect

//实现读取hdfs上文件之后，需要把计算的结果保存到hdfs上
sc.textFile("/words.txt").flatMap(_.split(" ")).map((_,1)).reduceByKey(_+_).saveAsTextFile("/out")
```

示例2：读取HDFS上文件进行单词统计并将结果保存到HDFS

```scala
sc.textFile("hdfs://node01:8020/words.txt").flatMap(_.split(" ")).map((_,1)).reduceByKey(_+_).saveAsTextFile("hdfs://node01:8020/spark_out")
```

查看保存到HDFS的结果,结果被存放到两个文件中：

```sh
[hadoop@node01 tmp]$ hdfs dfs -ls /spark_out
Found 3 items
-rw-r--r--   3 hadoop supergroup          0 2020-04-14 19:46 /spark_out/_SUCCESS
-rw-r--r--   3 hadoop supergroup         10 2020-04-14 19:46 /spark_out/part-00000
-rw-r--r--   3 hadoop supergroup         31 2020-04-14 19:46 /spark_out/part-00001
[hadoop@node01 tmp]$ hdfs dfs -cat /spark_out/part-00000
(flink,1)
[hadoop@node01 tmp]$ hdfs dfs -cat /spark_out/part-00001
(spark,2)
(hadoop,3)
(flume,1)

#为什么结果会保存到两个文件中？后面会讲
```



## 通过IDEA开发spark程序

#### 构建maven工程

###### 创建src/main/scala 和 src/test/scala 目录

![1568613632045](spark.assets/1568613632045.png)

###### 添加pom依赖

说明：

1. 创建maven工程后，设定maven为自己安装的maven，并在确保settings.xml里面设置了镜像地址为阿里云
2. 如果下载不下来scala-maven-plugin或者maven-shade-plugin，则自己去网上搜索下载，然后存放到本地仓库repository的对应目录，没有对应的目录就自己创建。
3. 比如，import不了scala-maven-plugin，那就将从网上下载的plugin的jar包存放到以下目录：E:\BaiduNetdiskDownload\repository\net\alchim31\maven\scala-maven-plugin
4. 下载maven依赖的好网址：https://mvnrepository.com/

~~~xml
<dependencies>
    <dependency>
        <groupId>org.apache.spark</groupId>
        <artifactId>spark-core_2.11</artifactId>
        <version>2.3.3</version>
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
~~~



#### spark单词统计（scala/本地运行)

在windows创建文件"F:\test\aa.txt"

```
hadoop spark spark
flume hadoop flink
hive spark hadoop
spark hbase
```

创建object,代码开发：

```scala
import org.apache.spark.rdd.RDD
import org.apache.spark.{SparkConf, SparkContext}

object SparkWordCount {
  def main(args: Array[String]): Unit = {
    
    //构建sparkConf对象 设置application名称和master地址
    val sConf:SparkConf=new SparkConf().setAppName("WordCount").setMaster("local[2]")
    
    
    //构建sparkContext对象,该对象非常重要，它是所有spark程序的执行入口
    // 它内部会构建DAGScheduler和 TaskScheduler对象
    val sc=new SparkContext(sConf)
      
    //设置日志输出级别
    sc.setLogLevel("warn")
    
    //读取数据文件
    val data:RDD[String]=sc.textFile("F:\\test\\aa.txt")
    
    //切分每一行，获取所有单词
    val words:RDD[String]=data.flatMap(x=>x.split(" "))
    
    //每个单词计为1
    val wordAndOne:RDD[(String,Int)]=words.map(x=>(x,1))
    
    //将相同单词出现的1累加
    val res:RDD[(String,Int)]=wordAndOne.reduceByKey((x,y)=>x+y)
    
    //按照单词出现的次数降序排列  第二个参数默认是true表示升序，设置为false表示降序
    val res_sort:RDD[(String,Int)]=res.sortBy(x=>x._2,false)
    
    //收集数据
    val res_coll:Array[(String,Int)]=res_sort.collect()
      
    //打印
    res_coll.foreach(println)
      
    //关闭spark Context
    sc.stop()
  }
}

```

运行输出结果为：

```scala
(spark,4)
(hadoop,3)
(hive,1)
(flink,1)
(flume,1)
(hbase,1)
```

#### spark单词统计（scala/集群运行)

集群运行与本地运行的代码开发很接近，本次集群运行相对于上面的本地运行代码，修改的地方有：

1. new SparkConf().setAppName("WordCount")没有加.setMaster("local[2]")
2. sc.textFile(args(0))数据输入路径采用动态传参
3. 不再有数据收集,即.collect()
4. res_sort.saveAsTextFile(args(1))结果输出路径采用动态传参

~~~scala
import org.apache.spark.rdd.RDD
import org.apache.spark.{SparkConf, SparkContext}

object SparkWordCount {
  def main(args: Array[String]): Unit = {
    val sConf:SparkConf=new SparkConf().setAppName("WordCount")
    val sc=new SparkContext(sConf)
    sc.setLogLevel("warn")
    val data:RDD[String]=sc.textFile(args(0))
    val words:RDD[String]=data.flatMap(x=>x.split(" "))
    val wordAndOne:RDD[(String,Int)]=words.map(x=>(x,1))
    val res:RDD[(String,Int)]=wordAndOne.reduceByKey((x,y)=>x+y)
    val res_sort:RDD[(String,Int)]=res.sortBy(x=>x._2,false)
    res_sort.saveAsTextFile(args(1))
  }
}
~~~

打成jar包提交到集群中运行

~~~shell
[hadoop@node01 tmp]$ spark-submit --master spark://node01:7077,node02:7077 \
--class SparkWordCount \
--executor-memory 1g \
--total-executor-cores 2 \
/tmp/original-MySparkDemo-1.0-SNAPSHOT.jar \
/words.txt /spark_out1
~~~

说明：

1. 运行jar包前，要先创建好数据文件/words.txt
2. /words.txt指的是hdfs的路径（因为之前spark整合了hdfs)
3. /out也是hdfs的路径
4. /tmp/original-MySparkDemo-1.0-SNAPSHOT.jar是linux的本地路径

#### spark单词统计（JAVA/本地运行)TODO

代码开发

~~~java
package com.kaikeba;

import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.api.java.function.FlatMapFunction;
import org.apache.spark.api.java.function.Function2;
import org.apache.spark.api.java.function.PairFunction;
import scala.Tuple2;

import java.util.Arrays;
import java.util.Iterator;
import java.util.List;

//todo: 利用java语言开发spark的单词统计程序
public class JavaWordCount {
    public static void main(String[] args) {
        //1、创建SparkConf对象
        SparkConf sparkConf = new SparkConf().setAppName("JavaWordCount").setMaster("local[2]");

        //2、构建JavaSparkContext对象
        JavaSparkContext jsc = new JavaSparkContext(sparkConf);

        //3、读取数据文件
        JavaRDD<String> data = jsc.textFile("E:\\words.txt");

        //4、切分每一行获取所有的单词   scala:  data.flatMap(x=>x.split(" "))
        JavaRDD<String> wordsJavaRDD = data.flatMap(new FlatMapFunction<String, String>() {
            public Iterator<String> call(String line) throws Exception {
                String[] words = line.split(" ");
                return Arrays.asList(words).iterator();
            }
        });

        //5、每个单词计为1    scala:  wordsJavaRDD.map(x=>(x,1))
        JavaPairRDD<String, Integer> wordAndOne = wordsJavaRDD.mapToPair(new PairFunction<String, String, Integer>() {
            public Tuple2<String, Integer> call(String word) throws Exception {
                return new Tuple2<String, Integer>(word, 1);
            }
        });

        //6、相同单词出现的1累加    scala:  wordAndOne.reduceByKey((x,y)=>x+y)
        JavaPairRDD<String, Integer> result = wordAndOne.reduceByKey(new Function2<Integer, Integer, Integer>() {
            public Integer call(Integer v1, Integer v2) throws Exception {
                return v1 + v2;
            }
        });

        //按照单词出现的次数降序 (单词，次数)  -->(次数,单词).sortByKey----> (单词，次数)
        JavaPairRDD<Integer, String> reverseJavaRDD = result.mapToPair(new PairFunction<Tuple2<String, Integer>, Integer, String>() {
            public Tuple2<Integer, String> call(Tuple2<String, Integer> t) throws Exception {
                return new Tuple2<Integer, String>(t._2, t._1);
            }
        });

        JavaPairRDD<String, Integer> sortedRDD = reverseJavaRDD.sortByKey(false).mapToPair(new PairFunction<Tuple2<Integer, String>, String, Integer>() {
            public Tuple2<String, Integer> call(Tuple2<Integer, String> t) throws Exception {
                return new Tuple2<String, Integer>(t._2, t._1);
            }
        });

        //7、收集打印
        List<Tuple2<String, Integer>> finalResult = sortedRDD.collect();

        for (Tuple2<String, Integer> t : finalResult) {
            System.out.println("单词："+t._1 +"\t次数："+t._2);
        }

        jsc.stop();

    }
}
~~~

## spark学习推荐

看书：《图解spark》

看spark官网：http://spark.apache.org/

## spark补充1

用yarn运行spark程序,而不是用Master运行时，就跟spark集群没多大关系了。

spark程序和MapReduce程序一样，本质上都是一个java程序，都有自己的计算逻辑，用yarn运行spark程序时，提交job的方式还是spark-submit,spark程序的计算还是在内存中，很多东西都不变，只是将Master换成了yarn。

yarn可理解成一个资源统一调度框架，不仅仅可以为MapReduce任务分配资源，还可以为spark等任务分配计算资源。

## RDD

### RDD是什么

RDD（Resilient Distributed Dataset）叫做**弹性分布式数据集**，是Spark中最基本的数据抽象，它代表一个不可变、可分区、里面的元素可并行计算的集合。**RDD是spark core的底层核心**。

* **Dataset**:就是一个集合，存储很多数据.
* **Distributed**：它内部的元素进行了分布式存储，方便于后期进行分布式计算.
* **Resilient**：表示弹性，rdd的数据是可以保存在内存或者是磁盘中.



### RDD的五大属性（重要）

ctrl+左击查看RDD的部分源码（如果看不了就download source),源码中对RDD的描述如下：

```scala
/**
 * A Resilient Distributed Dataset (RDD), the basic abstraction in Spark. Represents an immutable,
 * partitioned collection of elements that can be operated on in parallel. This class contains the
 * basic operations available on all RDDs, such as `map`, `filter`, and `persist`. In addition,
 * [[org.apache.spark.rdd.PairRDDFunctions]] contains operations available only on RDDs of key-value
 * pairs, such as `groupByKey` and `join`;
 * [[org.apache.spark.rdd.DoubleRDDFunctions]] contains operations available only on RDDs of
 * Doubles; and
 * [[org.apache.spark.rdd.SequenceFileRDDFunctions]] contains operations available on RDDs that
 * can be saved as SequenceFiles.
 * All operations are automatically available on any RDD of the right type (e.g. RDD[(Int, Int)])
 * through implicit.
 *
 * Internally, each RDD is characterized by five main properties:
 *
 *  - A list of partitions
 *  - A function for computing each split
 *  - A list of dependencies on other RDDs
 *  - Optionally, a Partitioner for key-value RDDs (e.g. to say that the RDD is hash-partitioned)
 *  - Optionally, a list of preferred locations to compute each split on (e.g. block locations for
 *    an HDFS file)
 *
 * All of the scheduling and execution in Spark is done based on these methods, allowing each RDD
 * to implement its own way of computing itself. Indeed, users can implement custom RDDs (e.g. for
 * reading data from a new storage system) by overriding these functions. Please refer to the
 * <a href="http://people.csail.mit.edu/matei/papers/2012/nsdi_spark.pdf">Spark paper</a>
 * for more details on RDD internals.
 */
```

从上面源码中，可以得到RDD的五大属性：

#### 属性1：A list of partitions

一个分区列表，这里表示一个rdd有很多分区，每一个分区内部是包含了该RDD的部分数据，spark中任务是以task线程的方式运行， 一个分区就对应一个task线程。

![image-20200415130448439](spark.assets/image-20200415130448439.png)

用户可以在创建RDD时指定RDD的分区个数，如果没有指定，那么就会采用默认值。 

```scala
val rdd=sparkContext.textFile("/words.txt")
```

分区数的默认值的计算公式如下：

```scala
RDD的分区数=max(文件的block个数，defaultMinPartitions)
//通过Spark Context读取hdfs上的文件来计算分区数
```

#### 属性2：A function for computing each split

一个计算每个分区的函数，这里表示Spark中RDD的计算是以分区为单位的，每个RDD都会实现compute计算函数以达到这个目的.

#### 属性3：A list of dependencies on other RDDs

一个rdd会依赖于其他多个rdd，这里涉及到rdd与rdd之间的依赖关系，spark任务的容错机制就是根据这个特性（血统）而来。

```scala
val rdd1:RDD[String]=sc.textFile("/words.txt")
val rdd2:RDD[String]=rdd1.flatMap(x=>x.split(" "))
val rdd3:RDD[(String,Int)]=rdd2.Map(x=>(x,1))

val rdd6=rdd4.join(rdd5)
```

rdd2依赖于rdd1,而rdd3依赖于rdd2

rdd6依赖于rdd4、rdd5

#### 属性4：Optionally, a Partitioner for key-value RDDs (e.g. to say that the RDD is hash-partitioned)

一个Partitioner，即RDD的分区函数（可选项）

当前Spark中实现了两种类型的分区函数，

1. 基于哈希的HashPartitioner，(key.hashcode % 分区数= 分区号)。它是默认值
2. 基于范围的RangePartitioner。

什么会有Partitioner?

1. 只有对于key-value的RDD(RDD[(String, Int)]),并且产生shuffle，才会有Partitioner，
2. 非key-value的RDD(RDD[String])的Parititioner的值是None。

Option类型：可以表示有值或者没有值，它有2个子类：   	

1. Some：表示封装了值	
2. None：表示没有值

#### 属性5：Optionally, a list of preferred locations to compute each split on (e.g. block locations for an HDFS file)

一个列表，存储每个Partition的优先位置(可选项)，这里涉及到数据的本地性，数据块位置最优。

spark任务在调度的时候会优先考虑存有数据的节点开启计算任务，减少数据的网络传输，提升计算效率。

![image-20200415133258993](spark.assets/image-20200415133258993.png)

### 基于spark的单词统计程序剖析rdd的五大属性

##### 需求

~~~
HDFS上有一个大小为300M的文件，通过spark实现文件单词统计，最后把结果数据保存到HDFS上
~~~

##### 要执行的代码

~~~scala
sc.textFile("/words.txt").flatMap(_.split(" ")).map((_,1)).reduceByKey(_+_).saveAsTextFile("/out")
~~~

##### 流程分析

###### 大致流程：

![image-20200415140940717](spark.assets/image-20200415140940717.png)

###### 每个rdd的解释：

![image-20200415141032695](spark.assets/image-20200415141032695.png)

###### 完整图：

![image-20200415141636967](spark.assets/image-20200415141636967.png)

###### partitioner的解析：

rdd1,rdd2,rdd3的partitioner都是None，经过shuffle，rdd4的partitioner为HashPartitioner。

![image-20200415141443569](spark.assets/image-20200415141443569.png)

![image-20200415141529095](spark.assets/image-20200415141529095.png)

##### 为什么计算小文件会生成两个结果文件？

通过上面的流程分析，可以知道，**加载一个文件时，文件的block个数就是默认的分区个数**，而一个分区对应生成一个结果文件。

那为什么我们之前计算words.txt这么一个只有1个block的小文件时，会生成2个结果文件？按道理不是1个才对？

这跟加载数据文件的textFile()方法的参数有关，首先来看一下textFile()的源码：

```scala
def textFile(
      path: String,
      minPartitions: Int = defaultMinPartitions): RDD[String] = withScope {
    assertNotStopped()
    hadoopFile(path, classOf[TextInputFormat], classOf[LongWritable], classOf[Text],
      minPartitions).map(pair => pair._2.toString).setName(path)
  }
```

可以看到，textFile方法，有两个参数,path和minPartitions，而我们之前使用的时候，只填了一个参数，如：val data:RDD[String]=sc.textFile(args(0))

这样的话，最小分区数minPartitions就会使用默认值defaultMinPartitions，再来看一下defaultMinPartitions的源码：

```scala
def defaultMinPartitions: Int = math.min(defaultParallelism, 2)
```

defaultMinPartitions是一个方法，返回值是math.min(defaultParallelism, 2)

defaultParallelism是默认并行度，一般是大于2的数，所以math.min(defaultParallelism, 2)=2

因此，最小分区数minPartitions=2，这就是计算分析小文件会生成2个文件的原因。

### 拓展：并行与并发

#### 并发

并发（Concurrent），在操作系统中，是指一个时间段中有几个程序都处于已启动运行到运行完毕之间，且这几个程序都是在同一个处理机上运行。

并发不是真正意义上的“同时进行”，只是CPU把一个时间段划分成几个时间片段（时间区间），然后在这几个时间区间之间来回切换，由于CPU处理的速度非常快，只要时间间隔处理得当，即可让用户感觉是多个应用程序同时在进行。如：打游戏和听音乐两件事情在**同一个时间段内**都是在同一台电脑上完成了**从开始到结束的动作**。那么，就可以说听音乐和打游戏是并发的。

#### 并行

并行（Parallel），当系统有一个以上CPU时，当一个CPU执行一个进程时，另一个CPU可以执行另一个进程，两个进程互不抢占CPU资源，可以同时进行，这种方式我们称之为并行(Parallel)。

其实决定并行的因素不是CPU的数量，而是CPU的核心数量，比如一个CPU多个核也可以并行。

#### 并行与并发示意图

如下图所示：（并发与并发示意图）

![img](spark.assets/1628624-20190505161932608-1136050215.jpg)**

所以，并发是在一段时间内宏观上多个程序同时运行，并行是在某一时刻，真正有多个程序在运行。

#### 并行和并发的区别

1. 并发，指的是多个事情，在同一时间段内同时发生了。  
2. 并行，指的是多个事情，在同一时间点上同时发生了。

3. 并发的多个任务之间是互相抢占资源的。  
4. 并行的多个任务之间是不互相抢占资源的。

只有在多CPU或者一个CPU多核的情况中，才会发生并行。否则，看似同时发生的事情，其实都是并发执行的。

#### spark的并行

一个文件有多个block,一个block对应一个分区，一个分区就会对应一个task,一个task对应一个线程，多个线程并行运行：

以上面的300M的文件的计算为例，分析spark中的并行：

并行运行1：

![image-20200415154218150](spark.assets/image-20200415154218150.png)

并行运行2：

![image-20200415154545940](spark.assets/image-20200415154545940.png)

### RDD的创建方式

RDD的创建方式有3种：

1、通过已经存在的scala集合去构建，前期做一些测试用到的比较多

```scala
val rdd1=sc.parallelize(List(1,2,3,4,5)) //parallelize可以添加第2个参数，是分区的数量
val rdd2=sc.parallelize(Array("hadoop","hive","spark"))
val rdd3=sc.makeRDD(List(1,2,3,4))

//parallelize表示并行化
```

无论传入的是什么，元素最终都是用Array封装的：

![image-20200415155327297](spark.assets/image-20200415155327297.png)

2、加载外部的数据源去构建

```scala
val rdd1=sc.textFile("/words.txt")
```

3、从已经存在的rdd进行转换生成一个新的rdd

```scala
val rdd2=rdd1.flatMap(_.split(" "))
val rdd3=rdd2.map((_,1))
```



## RDD的算子

算子可以理解成RDD的一些方法。

RDD的算子可以分为2类：

1、transformation（转换）

- 根据已经存在的rdd转换生成一个新的rdd,  它是延迟加载，它不会立即执行
- 例如： map / flatMap / reduceByKey 等

2、action (动作)

- 它会真正触发任务的运行，将rdd的计算的结果数据返回给Driver端，或者是保存结果数据到外部存储介质中
- 例如：collect / saveAsTextFile 等

### RDD常见的算子操作说明(重要)

#### transformation算子

| **转换**                                            | **含义**                                                     |
| --------------------------------------------------- | ------------------------------------------------------------ |
| **map(func)**                                       | 返回一个新的RDD，该RDD由每一个输入元素经过func函数转换后组成 |
| **filter(func)**                                    | 返回一个新的RDD，该RDD由经过func函数计算后返回值为true的输入元素组成 |
| **flatMap(func)**                                   | 类似于map，但是每一个输入元素可以被映射为0或多个输出元素（所以func应该返回一个序列，而不是单一元素） |
| **mapPartitions(func)**                             | 类似于map，但独立地在RDD的每一个分片上运行，因此在类型为T的RDD上运行时，func的函数类型必须是Iterator[T] => Iterator[U] |
| **mapPartitionsWithIndex(func)**                    | 类似于mapPartitions，但func带有一个整数参数表示分片的索引值，因此在类型为T的RDD上运行时，func的函数类型必须是(Int, Interator[T]) => Iterator[U] |
| **union(otherDataset)**                             | 对源RDD和参数RDD求并集后返回一个新的RDD                      |
| **intersection(otherDataset)**                      | 对源RDD和参数RDD求交集后返回一个新的RDD                      |
| **distinct([numTasks]))**                           | 对源RDD进行去重后返回一个新的RDD                             |
| **groupByKey([numTasks])**                          | 在一个(K,V)的RDD上调用，返回一个(K, Iterator[V])的RDD        |
| **reduceByKey(func, [numTasks])**                   | 在一个(K,V)的RDD上调用，返回一个(K,V)的RDD，使用指定的reduce函数，将相同key的值聚合到一起，与groupByKey类似，reduce任务的个数可以通过第二个可选的参数来设置 |
| **sortByKey([ascending], [numTasks])**              | 在一个(K,V)的RDD上调用，K必须实现Ordered接口，返回一个按照key进行排序的(K,V)的RDD |
| **sortBy(func,[ascending], [numTasks])**            | 与sortByKey类似，但是更灵活                                  |
| **join(otherDataset, [numTasks])**                  | 在类型为(K,V)和(K,W)的RDD上调用，返回一个相同key对应的所有元素对在一起的(K,(V,W))的RDD |
| **cogroup(otherDataset, [numTasks])**               | 在类型为(K,V)和(K,W)的RDD上调用，返回一个(K,`(Iterable<V>,Iterable<W>))`类型的RDD |
| **coalesce(numPartitions)**                         | 减少 RDD 的分区数到指定值。                                  |
| **repartition(numPartitions)**                      | 重新给 RDD 分区                                              |
| **repartitionAndSortWithinPartitions(partitioner)** | 重新给 RDD 分区，并且每个分区内以记录的 key 排序             |

#### action算子

| **动作**                       | **含义**                                                     |
| ------------------------------ | ------------------------------------------------------------ |
| **reduce(func)**               | reduce将RDD中元素前两个传给输入函数，产生一个新的return值，新产生的return值与RDD中下一个元素（第三个元素）组成两个元素，再被传给输入函数，直到最后只有一个值为止。 |
| **collect()**                  | 在驱动程序中，以数组的形式返回数据集的所有元素               |
| **count()**                    | 返回RDD的元素个数                                            |
| **first()**                    | 返回RDD的第一个元素（类似于take(1)）                         |
| **take(n)**                    | 返回一个由数据集的前n个元素组成的数组                        |
| **takeOrdered(n, [ordering])** | 返回自然顺序或者自定义顺序的前 n 个元素                      |
| **saveAsTextFile(path)**       | 将数据集的元素以textfile的形式保存到HDFS文件系统或者其他支持的文件系统，对于每个元素，Spark将会调用toString方法，将它装换为文件中的文本 |
| **saveAsSequenceFile(path)**   | 将数据集中的元素以Hadoop sequencefile的格式保存到指定的目录下，可以使HDFS或者其他Hadoop支持的文件系统。 |
| **saveAsObjectFile(path)**     | 将数据集的元素，以 Java 序列化的方式保存到指定的目录下       |
| **countByKey()**               | 针对(K,V)类型的RDD，返回一个(K,Int)的map，表示每一个key对应的元素个数。 |
| **foreach(func)**              | 在数据集的每一个元素上，运行函数func                         |
| **foreachPartition(func)**     | 在数据集的每一个分区上，运行函数func                         |

#### map与mapPartitions的区别（面试题）

1. map含义：返回一个新的RDD，该RDD由每一个输入元素经过func函数转换后组成
2. mapPartitions含义：类似于map，但独立地在RDD的每一个分片上运行，因此在类型为T的RDD上运行时，func的函数类型必须是Iterator[T] => Iterator[U]
3. map是对rdd中的每一个元素进行操作，mapPartitions是对rdd中的每一个分区/task的迭代器进行操作
4. 两者最终实现的效果都是一样的，但是实现的过程不一样。

MapPartitions的优点：

如果是普通的map，比如一个partition中有1万条数据，那么你的function要执行和计算1万次。

**使用MapPartitions操作之后，一个task仅仅会执行一次function**，function一次接收所有的partition数据。只要执行一次就可以了，性能比较高。

如果在map过程中需要频繁创建额外的对象(例如将rdd中的数据通过jdbc写入数据库,map需要为每个元素创建一个链接而mapPartition为每个partition创建一个链接),则mapPartitions效率比map高的多。

SparkSql或DataFrame默认会对程序进行mapPartition的优化。

MapPartitions的缺点：

如果是普通的map操作，一次function的执行就处理一条数据；那么如果内存不够用的情况下， 比如处理了1千条数据了，那么这个时候内存不够了，那么就可以将已经处理完的1千条数据从内存里面垃圾回收掉，或者用其他方法，腾出空间来吧。

所以说普通的**map操作通常不会导致内存的OOM（Out Of Memory)异常**。 

但是MapPartitions操作，对于大量数据来说，比如甚至一个partition，100万数据，一次传入一个function以后，那么可能一下子内存不够，但是又没有办法去腾出内存空间来，可能就OOM，内存溢出。

#### foreach与foreachPartition的区别（面试题）

与map VS mapPartitions类似

## 面试题1

![image-20200417025522744](spark.assets/image-20200417025522744.png)

## RDD常用的算子操作演示

为了方便前期的测试和学习，可以使用spark-shell进行演示

~~~shell
spark-shell --master local[2]
~~~


#### 1 map

```scala
scala> val rdd1=sc.parallelize(List(1,2,3,4,5,6,7,8))
scala> val rdd2=rdd1.map(x=>x*10)
scala> rdd2.collect
res4: Array[Int] = Array(10, 20, 30, 40, 50, 60, 70, 80)  
```

#### 2 filter

```scala
val rdd1 = sc.parallelize(List(5, 6, 4, 7, 3, 8, 2, 9, 1, 10))

//把rdd1中大于5的元素进行过滤
rdd1.filter(x => x >5).collect
```

#### 3 flatMap

```scala
val rdd1 = sc.parallelize(Array(	"a b c", "d e f", "h i j"))
//获取rdd1中元素的每一个字母
rdd1.flatMap(_.split(" ")).collect
```

#### 4 intersection、union

```scala
val rdd1 = sc.parallelize(List(5, 6, 4, 3))
val rdd2 = sc.parallelize(List(1, 2, 3, 4))
//求交集
scala> rdd1.intersection(rdd2).collect
res7: Array[Int] = Array(4, 3)  

//求并集
scala> val rdd5=rdd1.union(rdd2)
scala> rdd5.collect
res6: Array[Int] = Array(5, 6, 4, 3, 1, 2, 3, 4)
```

#### 5 distinct

```scala
val rdd1 = sc.parallelize(List(1,1,2,3,3,4,5,6,7))
//去重
rdd1.distinct
```

#### 6 join、groupByKey

```scala
val rdd1 = sc.parallelize(List(("tom", 1), ("jerry", 3), ("kitty", 2)))
val rdd2 = sc.parallelize(List(("jerry", 2), ("tom", 1), ("shuke", 2)))

//求join
val rdd3 = rdd1.join(rdd2)
rdd3.collect
res8: Array[(String, (Int, Int))] = Array((tom,(1,1)), (jerry,(3,2)))

//求并集
val rdd4 = rdd1 union rdd2
rdd4.groupByKey.collect
res11: Array[(String, Iterable[Int])] = Array((tom,CompactBuffer(1, 1)), (jerry,CompactBuffer(3, 2)), (shuke,CompactBuffer(2)), (kitty,CompactBuffer(2)))
```

#### 7 cogroup

```scala
val rdd1 = sc.parallelize(List(("tom", 1), ("tom", 2), ("jerry", 3), ("kitty", 2)))
val rdd2 = sc.parallelize(List(("jerry", 2), ("tom", 1), ("jim", 2)))
//分组
val rdd3 = rdd1.cogroup(rdd2)
rdd3.collect
res12: Array[(String, (Iterable[Int], Iterable[Int]))] = Array((jim,(CompactBuffer(),CompactBuffer(2))), (tom,(CompactBuffer(1, 2),CompactBuffer(1))), (jerry,(CompactBuffer(3),CompactBuffer(2))), (kitty,(CompactBuffer(2),CompactBuffer())))
```

#### 8 reduce

示例1：

```scala
val rdd1 = sc.parallelize(List(1, 2, 3, 4, 5))

//reduce聚合
val rdd2 = rdd1.reduce(_ + _)
```

示例2：

```scala
val rdd3 = sc.parallelize(List("1","2","3","4","5"))

scala> rdd3.reduce(_+_)
res18: String = 12345

scala> rdd3.reduce(_+_)
res21: String = 34512 //从12345变成了34512
```

从上面示例2的代码块可知，同样的操作，出现了不同的结果。

这是因为元素在不同的分区中，每一个分区都是一个独立的task线程去运行（多个分区并行运算）。这些task运行有先后关系。

查看元素的分区情况：

```scala
scala> rdd3.partitions
res19: Array[org.apache.spark.Partition] = Array(org.apache.spark.rdd.ParallelCollectionPartition@c55, org.apache.spark.rdd.ParallelCollectionPartition@c56)

scala> rdd3.partitions.length
res20: Int = 2
```



#### 9 reduceByKey、sortByKey

```scala
val rdd1 = sc.parallelize(List(("tom", 1), ("jerry", 3), ("kitty", 2),  ("shuke", 1)))
val rdd2 = sc.parallelize(List(("jerry", 2), ("tom", 3), ("shuke", 2), ("kitty", 5)))
val rdd3 = rdd1.union(rdd2)

//按key进行聚合
val rdd4 = rdd3.reduceByKey(_ + _)
rdd4.collect

//按value的降序排序
val rdd5 = rdd4.map(t => (t._2, t._1)).sortByKey(false).map(t => (t._2, t._1))
rdd5.collect
```



#### 10 repartition、coalesce

###### 两者使用区别

coalesce功能：改变分区数量，只能减少，不能增加

repartition功能：改变分区数量，减少增加都可以

coalesce示例：

```scala
scala> val rdd1=sc.parallelize(List(1,2,3,4,5,6,7,8),3)

scala> rdd1.partitions.length
res4: Int = 3

//************=利用coalesce减少分区数量，成功****************************=
scala> val rdd2=rdd1.coalesce(2)
rdd2: org.apache.spark.rdd.RDD[Int] = CoalescedRDD[1] at coalesce at <console>:25

scala> rdd2.partitions.length
res5: Int = 2

scala> rdd1.partitions.length
res6: Int = 3

//************=利用coalesce增加分区数量，失败****************************=
scala> val rdd3=rdd1.coalesce(5)
rdd3: org.apache.spark.rdd.RDD[Int] = CoalescedRDD[2] at coalesce at <console>:25

scala> rdd3.partitions.length
res7: Int = 3

scala> rdd1.partitions.length
res8: Int = 3

//************=利用repatriation增加分区数量，成功****************************=
scala> val rdd4=rdd1.repartition(5)
rdd4: org.apache.spark.rdd.RDD[Int] = MapPartitionsRDD[6] at repartition at <console>:25

scala> rdd4.partitions.length
res9: Int = 5

scala> rdd1.partitions.length
res10: Int = 3
```

为什么repartition可以增加分区数量，而coalesce不可以，两者又有什么区别，我们来看一下源码：

repartition方法的源码（源码在RDD.scala搜索即可）：

```scala
def repartition(numPartitions: Int)(implicit ord: Ordering[T] = null): RDD[T] = withScope {
    coalesce(numPartitions, shuffle = true)
  }
```

从源码可以看出，repartition方法体调用了coalesce方法，该coalesce方法有2个参数，第2个参数是shuffle = true。再来看一下coalesce方法的源码：

```scala
def coalesce(numPartitions: Int, shuffle: Boolean = false,
               partitionCoalescer: Option[PartitionCoalescer] = Option.empty)
              (implicit ord: Ordering[T] = null)
      : RDD[T] = withScope {.....}
```

可看到，coalesce方法的第二个参数是shuffle，但是值却是false，这与repartition方法体里调用的coalesce参数值刚好相反。

因此，可以推断出，repartition能够的增加分区的数量的根本原因是将shuffle参数设为了true。

使用建议：因为shuffle是比较消耗资源的，所以如果要减少分区的数量时，尽量使用coalesce。

###### 改变分区数量的应用场景举例：

要执行的操作：

```scala
sc.textFile("/words.txt").flatMap(x=>x.split(" ")).map(x=>(x,1)).reduceByKey((x,y)=>x+y).saveAsTextFile("/out")
```

假如words.txt文件很大,那么会产生很多个分区，比如1000个分区，每个分区数据量可能有点小。

如果直接保存数据到hdfs上，那么会产生很多个小文件(hdfs不适合处理小文件)。

为了减少在hdfs生成的小文件数量，可以在saveAsTextFile("/out")之前添加一个步骤来减少分区数量，代码如下：

```scala
val rdd4=sc.textFile("/words.txt").flatMap(x=>x.split(" ")).map(x=>(x,1)).reduceByKey((x,y)=>x+y)

val rdd5=rdd4.coalesce(5)

rdd5.saveAsTextFile("/out")
```

###### 有无shuffle的示意图：

可以看到，减少分区数量如果使用repartition会产生shuffle，shuffle阶段要进行计算分区号和交叉传送等操作，明显麻烦比无shuffle时麻烦很多，消耗资源。

![image-20200415201224598](spark.assets/image-20200415201224598.png)

#### 11 map、mapPartitions、mapPartitionsWithIndex

```scala
val rdd1=sc.parallelize(1 to 10,5)
rdd1.map(x => x*10)).collect
rdd1.mapPartitions(iter => iter.map(x=>x*10)).collect

//map：用于遍历RDD,将函数f应用于每一个元素，返回新的RDD(transformation算子)。
//mapPartitions:用于遍历操作RDD中的每一个分区，返回生成一个新的RDD（transformation算子）。
```

总结：

如果在映射的过程中需要频繁创建额外的对象，使用mapPartitions要比map高效

比如，将RDD中的所有数据通过JDBC连接写入数据库，如果使用map函数，可能要为每一个元素都创建一个connection，这样开销很大，如果使用mapPartitions，那么只需要针对每一个分区建立一个connection。

mapPartitionsWithIndex的使用：

```scala
scala> val rdd1=sc.parallelize(1 to 5,2)
rdd1: org.apache.spark.rdd.RDD[Int] = ParallelCollectionRDD[7] at parallelize at <console>:24

//index表示分区号  可以获取得到每一个元素属于哪一个分区
scala> rdd1.mapPartitionsWithIndex((index,iter)=>iter.map(x=>(index,x))).collect
res11: Array[(Int, Int)] = Array((0,1), (0,2), (1,3), (1,4), (1,5))
```

#### 12 foreach、foreachPartition

```scala
val rdd1 = sc.parallelize(List(5, 6, 4, 7, 3, 8, 2, 9, 1, 10))

//foreach实现对rdd1里的每一个元素乘10然后打印输出
rdd1.foreach(x=>println(x * 10))

//foreachPartition实现对rdd1里的每一个元素乘10然后打印输出
rdd1.foreachPartition(iter => iter.foreach(x=>println(x * 10)))

//foreach:用于遍历RDD,将函数f应用于每一个元素，无返回值(action算子)。
//foreachPartition: 用于遍历操作RDD中的每一个分区。无返回值(action算子)。
```

总结：一般使用mapPartitions或者foreachPartition算子比map和foreach更加高效，推荐使用。

-----------------------------------------------------------------------------

-----------------------------录播分界线-----------------------------------------

-----------------------------------------------------------------------------

## 案例1：使用Java实现spark的wordCount

##### 案例需求：

单词计数

##### 第一步：创建maven工程，引入依赖

~~~xml
 <dependencies>
    <dependency>
        <groupId>org.apache.spark</groupId>
        <artifactId>spark-core_2.11</artifactId>
        <version>2.3.3</version>
    </dependency>
</dependencies>

~~~

##### 第二步：代码开发

说明：

1. 使用Java编写spark程序，其实跟scala的步骤是一样的，只不过写法有点变化而已。
2. scala的RDD对应Java中的JavaRDD
3. scala的SparkContext对应Java中的JavaSparkContext
4. scala方法中的参数为函数时，在Java中要改成对象，因为Java是面向对象的，这是scala相对于Java非常不同的地方。
5. 编写spark程序的大致步骤如下：

~~~scala
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.api.java.function.FlatMapFunction;
import org.apache.spark.api.java.function.Function2;
import org.apache.spark.api.java.function.PairFunction;
import scala.Tuple2;

import java.util.Arrays;
import java.util.Iterator;
import java.util.List;

public class MyJavaSpark {
    public static void main(String[] args) {
        //1、创建spark Conf
        SparkConf sparkConf = new SparkConf().setAppName("WordCount").setMaster("local");

        //2、创建spark Context
        JavaSparkContext javaSparkContext = new JavaSparkContext(sparkConf);

        //3、读取数据
        JavaRDD<String> stringJavaRDD = javaSparkContext.textFile("F:\\test\\aa.txt", 2);

        //4、切分每一行数据为一个个单词
        final JavaRDD<String> wordsRDD = stringJavaRDD.flatMap(new FlatMapFunction<String, String>() {
            public Iterator<String> call(String s) throws Exception {
                String[] s1 = s.split(" ");
                return Arrays.asList(s1).iterator();
            }
        });

        //5、每个单词计为1
        JavaPairRDD<String, Integer> wordAndOneRDD = wordsRDD.mapToPair(new PairFunction<String, String, Integer>() {
            public Tuple2<String, Integer> call(String s) throws Exception {
                return new Tuple2<String, Integer>(s, 1);
            }
        });

        //6、相同的单词累加1
        JavaPairRDD<String, Integer> resultRDD = wordAndOneRDD.reduceByKey(new Function2<Integer, Integer, Integer>() {
            public Integer call(Integer v1, Integer v2) throws Exception {
                return v1 + v2;
            }
        });

        //7、收集数据
        List<Tuple2<String, Integer>> collectRDD = resultRDD.collect();

        //8、打印数据
        for(Tuple2<String,Integer> t:collectRDD){
            System.out.println("单词："+t._1+"次数："+t._2);
        }

        //9、关闭资源
        javaSparkContext.stop();
    }
}
~~~

运行结果为：

```
单词：hive次数：1
单词：flink次数：1
单词：spark次数：4
单词：hadoop次数：3
单词：flume次数：1
单词：hbase次数：1
```



## 案例2：实现点击流日志数据分析

点击流日志数据：用户在网站的浏览行为记录

##### 案例数据

资料中的access.log文件，文件里一行数据的格式大致如下：

```
60.208.6.156 - - [18/Sep/2013:06:49:48 +0000] "GET /wp-content/uploads/2013/07/rcassandra.png HTTP/1.0" 200 185524 "http://cos.name/category/software/packages/" "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.66 Safari/537.36"
```

1. 数据中的横杠-也是一个字段， 表示无
2. 一行数据代表一次访问。
3. 第1个字段是用户的ip地址

![image-20200415221704529](spark.assets/image-20200415221704529.png)

##### 统计PV

PV：页面浏览量，是网站各个网页被浏览的总次数。对应于access.log中的数据，一行数据就是一条浏览记录。

因此，要获取PV，实质是要统计access.log文件中行数。

~~~scala
import org.apache.spark.{SparkConf, SparkContext}

object PV {
  def main(args: Array[String]): Unit = {
    val sparkconf=new SparkConf().setAppName("PV").setMaster("local[2]")
    val sc=new SparkContext(sparkconf)
    val data=sc.textFile("E:\\LearningAll\\8-HadoopEcosystem-Video\\spark下载资料\\spark课程录播资料\\案例数据\\access.log")
    val pv=data.count();
    println(pv)
    sc.stop()
  }
}
~~~

运行结果为：

```
14619
```

##### 统计UV

UV（Unique Visitor）是独立访客数。放在这里就是有多少个不同的ip地址的访客访问过网站，相同ip地址的访客，无论访问网站多少次，都只算入UV一次。

因此，spark程序的大致步骤是：加载每一行数据，获取每一行数据的ip地址，对ip地址去重，然后统计ip数量。

代码开发:

~~~scala
import org.apache.spark.{SparkConf, SparkContext}

object PV {
  def main(args: Array[String]): Unit = {
    val sparkconf=new SparkConf().setAppName("PV").setMaster("local[2]")
    val sc=new SparkContext(sparkconf)
    val data=sc.textFile("E:\\LearningAll\\8-HadoopEcosystem-Video\\spark下载资料\\spark课程录播资料\\案例数据\\access.log")
    //获取每一行的ip地址：
    val rdd2=data.map(x=>x.split(" ")(0))
    //去重：
    val rdd3=rdd2.distinct()
    val uv=rdd3.count();
    println(uv)
    sc.stop()
  }
}

~~~

```
1050
```

##### 获取被访问的TopN页面地址

数据文件里每一行数据代表一次访问，每一行数据的第11个字段是被访问的页面地址，如

```scala
60.208.6.156 - - [18/Sep/2013:06:49:48 +0000] "GET /wp-content/uploads/2013/07/rcassandra.png HTTP/1.0" 200 185524 "http://cos.name/category/software/packages/" "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.66 Safari/537.36"
```

中的"http://cos.name/category/software/packages/"。

但是，有些行的数据是不完整的，可能没有第11个字段，或者第11个字段的值是 "-" ，因此，我们首先要进行数据的处理，然后再分析数据。

注意，"-"中的双引号是包括在数据里面的，千万别少写了，特别注意下面代码块中的第11行代码。

代码开发

~~~scala
import org.apache.spark.{SparkConf, SparkContext}

object PV {
  def main(args: Array[String]): Unit = {
    val sparkconf=new SparkConf().setAppName("PV").setMaster("local[2]")
    val sc=new SparkContext(sparkconf)
    val data=sc.textFile("E:\\LearningAll\\8-HadoopEcosystem-Video\\spark下载资料\\spark课程录播资料\\案例数据\\access.log")
    //处理数据，使得每一行数据至少有11个字段
    val data2=data.filter(x=>x.split(" ").length>10)
    //处理数据，使得每一行数据的第11个字段都不为 "-"，注意，双引号也包括在里面
    val data3=data2.filter(x=>x.split(" ")(10)!="\"-\"")
    //获取第11个字段
    val rdd10=data3.map(x=>x.split(" ")(10))
    //每个计1
    val result1=rdd10.map(x=>(x,1))
    //统计
    val result2=result1.reduceByKey(_+_)
    //排序
    val sortRDD=result2.sortBy(x=>x._2,false)
    //获取Top5
    val finalRes=sortRDD.take(5)
    //打印：
    finalRes.foreach(println)
    sc.stop()
  }
}
~~~

运行结果为：

```scala
("http://blog.fens.me/category/hadoop-action/",547)
("http://blog.fens.me/",377)
("http://blog.fens.me/wp-admin/post.php?post=2445&action=edit&message=10",360)
("http://blog.fens.me/r-json-rjson/",274)
("http://blog.fens.me/angularjs-webstorm-ide/",271)
```



## 案例3：读取文件数据写入到mysql表中

##### 创建maven工程

~~~xml
<dependencies>
    <dependency>
        <groupId>org.apache.spark</groupId>
        <artifactId>spark-core_2.11</artifactId>
        <version>2.3.3</version>
    </dependency>
    <dependency>
     <groupId>mysql</groupId>
     <artifactId>mysql-connector-java</artifactId>
     <version>5.1.38</version>
	</dependency>
</dependencies>
~~~

##### 案例数据

```
1,tony,18
2,xiaoqiang,20
3,xiaoming,15
4,laowang,45
```

##### 创建mysql表

在node03登录mysql,创建一个表，Person

```sql
mysql> create database demo1;
mysql> use demo1
mysql> create table person(id int,name varchar(15),age int);
```

##### 通过foreach算子实现

大致步骤：加载数据--》处理数据后将数据封装到RDD中--》foreach遍历数据，创建mysql连接，写入数据

~~~scala
import java.sql.{Connection, DriverManager, PreparedStatement}

import org.apache.spark.rdd.RDD
import org.apache.spark.{SparkConf, SparkContext}

object Data2MysqlForeach {
  def main(args: Array[String]): Unit = {
    val sparkkconf=new SparkConf().setAppName("ForeachMysql").setMaster("local[2]")
    val sc=new SparkContext(sparkkconf)
    val data=sc.textFile("E:\\LearningAll\\8-HadoopEcosystem-Video\\spark下载资料\\spark课程录播资料\\案例数据\\person.txt")
    val data2:RDD[Array[String]]=data.map(x=>x.split(","))

    data2.foreach(t=> {
      var conne: Connection = null
      try {
        //创建连接
        conne = DriverManager.getConnection("jdbc:mysql://node03:3306/demo1", "root", "123456")
        //定义sql语句，?是占位符
        val sql1 = "insert into person(id,name,age) values(?,?,?)"
        //获取prepareStatement对象，这个对象可以对sql语句进行预编译
        val ps = conne.prepareStatement(sql1)
        //给sql语句的问号?赋值，1代表第一个问号，2代表第二个问号...
        ps.setString(1, t(0))
        ps.setString(2, t(1))
        ps.setString(3, t(2))
        //执行sql语句
        ps.execute()
      }catch {
        case ex:Exception =>println(ex.getMessage)
      }finally {
        if(conne!=null){conne.close()}
      }
    })
    sc.stop()
  }
}

~~~

查看mysql的person表,如下，已经写入成功：

```sql
mysql> select * from person;
+------+-----------+------+
| id   | name      | age  |
+------+-----------+------+
|    4 | laowang   |   45 |
|    1 | tony      |   18 |
|    2 | xiaoqiang |   20 |
|    3 | xiaoming  |   15 |
+------+-----------+------+
```

说明：

1. 通过foreach算子来实现的话，观察代码，会发现，foreach每遍历一条数据，就会创建一个mysql连接，如果存在大量数据的话，无疑是很耗时的。
2. 从person表可看到，插入的数据的顺序并不是跟源数据一致的，这是因为受到了多个分区并行执行的影响。


##### 通过foreachPartition算子实现

通过foreachPartition来实现与foreach来实现的源代码差不多，只需要修改几个地方,代码如下：

~~~scala
import java.sql.{Connection, DriverManager, PreparedStatement}

import org.apache.spark.rdd.RDD
import org.apache.spark.{SparkConf, SparkContext}

object Data2MysqlForeachPartition {
  def main(args: Array[String]): Unit = {
    val sparkkconf=new SparkConf().setAppName("ForeachMysql").setMaster("local[2]")
    val sc=new SparkContext(sparkkconf)
    val data=sc.textFile("E:\\LearningAll\\8-HadoopEcosystem-Video\\spark下载资料\\spark课程录播资料\\案例数据\\person.txt")
    val data2:RDD[Array[String]]=data.map(x=>x.split(","))

    data2.foreachPartition(iter=> {
      var conne: Connection = null
      try {
        //创建连接
        conne = DriverManager.getConnection("jdbc:mysql://node03:3306/demo1", "root", "123456")
        //定义sql语句，?是占位符
        val sql1 = "insert into person(id,name,age) values(?,?,?)"
        //获取prepareStatement对象，这个对象可以对sql语句进行预编译
        val ps = conne.prepareStatement(sql1)
        //给sql语句的问号?赋值，1代表第一个问号，2代表第二个问号...
        iter.foreach(t=>{
          ps.setString(1, t(0))
          ps.setString(2, t(1))
          ps.setString(3, t(2))

          ps.addBatch()
        })
        //执行sql语句
        ps.executeBatch()
      }catch {
        case ex:Exception =>println(ex.getMessage)
      }finally {
        if(conne!=null){conne.close()}
      }
    })
    sc.stop()
  }
}

~~~

再次查看person表：

```sql
mysql> select * from person;
+------+-----------+------+
| id   | name      | age  |
+------+-----------+------+
|    4 | laowang   |   45 |
|    1 | tony      |   18 |
|    2 | xiaoqiang |   20 |
|    3 | xiaoming  |   15 |
|    1 | tony      |   18 |
|    4 | laowang   |   45 |
|    2 | xiaoqiang |   20 |
|    3 | xiaoming  |   15 |
+------+-----------+------+
```

##### 小结

1. foreach算子实现获取得到一条一条的数据之后，然后进行获取对应的数据库连接，实现把数据插入到mysql表中，这里rdd中有N条数据，这里就需要与mysql数据库创建N次连接，它是比较浪费资源

2. foreachPartition算子实现以分区为单位与mysql数据库来创建数据库连接，可以大大减少与mysql数据创建的连接数，有助于程序的性能提升。所以后期推荐大家使用foreachPartition算子



## 案例4：读取文件数据写入到hbase表中

##### 案例数据

数据是资料中的users.dat文件，数据的大致格式如下，以::为分隔符，一共5个字段，分别是id,gender,age,position,code

```
1::F::1::10::48067
2::M::56::16::70072
3::M::25::15::55117
4::M::45::7::02460
5::M::25::20::55455
6::F::50::9::55117
7::M::35::1::06810
```

##### 添加pom依赖

在之前案例的pom的基础上，添加以下依赖：

~~~xml
        <dependency>
            <groupId>org.apache.hbase</groupId>
            <artifactId>hbase-client</artifactId>
            <version>1.2.1</version>
        </dependency>
~~~

##### 创建hbase表

确保hbase、hadoop、zookeeper都正常开启，进入hbase shell，创建表person

```sql
start-hbase.sh

hbase shell

hbase(main):001:0> create 'person','f1','f2'
```

##### 代码开发

~~~scala
import org.apache.hadoop.hbase.{HBaseConfiguration, TableName}
import org.apache.hadoop.hbase.client.{Connection, ConnectionFactory, Put}
import org.apache.spark.{SparkConf, SparkContext}

object Data2Hbase {
  def main(args: Array[String]): Unit = {
    val sparkConf=new SparkConf().setAppName("hbase").setMaster("local[2]")
    val sc=new SparkContext(sparkConf)
    val data=sc.textFile("E:\\LearningAll\\8-HadoopEcosystem-Video\\spark下载资料\\spark课程录播资料\\案例数据\\users.dat")
    val data2=data.map(x=>x.split("::"))
    data2.foreachPartition(iter=>{
      var conne:Connection=null
      try{
        val conf=HBaseConfiguration.create()
        conf.set("hbase.zookeeper.quorum","node01:2181,node02:2181,node03:2181")
        conne=ConnectionFactory.createConnection(conf)
        val tablePerson=conne.getTable(TableName.valueOf("person"))
        iter.foreach(x=>{
          val put=new Put(x(0).getBytes())
          put.addColumn("f1".getBytes(),"gender".getBytes(),x(1).getBytes())
          put.addColumn("f1".getBytes(),"age".getBytes(),x(2).getBytes())
          put.addColumn("f1".getBytes(),"position".getBytes(),x(3).getBytes())
          put.addColumn("f1".getBytes(),"code".getBytes(),x(4).getBytes())
          tablePerson.put(put)
        })
      }catch {
        case ex:Exception =>println(ex.getMessage)
      }finally {if (conne!=null){conne.close()}}
    })
  }
}

~~~

查看hbase中的person表，部分数据如下：

```sh
scan 'person'                                                                                  
999                 column=f1:age, timestamp=1586981613489, value=25                   
999                 column=f1:code, timestamp=1586981613489, value=62558               
999                 column=f1:gender, timestamp=1586981613489, value=M                 
999                 column=f1:position, timestamp=1586981613489, value=15   
```



## 案例5：实现ip地址查询

##### 需求分析

在互联网中，我们经常会见到城市热点图这样的报表数据，例如在百度统计中，会统计今年的热门旅游城市、热门报考学校等，会将这样的信息显示在热点图中。

![1579070050537](spark.assets/1579070050537.png)

要想实现上面热点图效果，我们需要通过日志信息（运行商或者网站自己生成）和城市ip段信息来判断用户的ip段，统计热点经纬度。

示意图：基站下放给用户可以上网的ip地址，通过这个ip地址就可以定位用户的坐标（经纬度）。

![image-20200416043037480](spark.assets/image-20200416043037480.png)

##### 案例数据

1、日志信息数据: 20090121000132.394251.http.format

各字段分别表示：时间戳|ip地址|.......,只需要留意前2个字段

![1579070153331](spark.assets/1579070153331.png)

2、城市ip段信息数据: ip.txt，类似于码表数据

开始数字和结束数字分别是开始ip和结束ip经过算法计算得到的值。

![1579070232110](spark.assets/1579070232110.png)

##### 开发思路

1、 加载城市ip段信息，获取ip起始数字和结束数字，经度，维度

2、 加载日志数据，获取ip信息，然后使用相同的算法将ip转换为数字，和ip段比较

3、 比较的时候采用二分法查找，找到对应的经度和维度

4、 然后对经度和维度做单词计数

##### 广播变量

在本次的ip案例中，要将日志数据中的每个ip都拿去跟城市ip信息数据进行匹配，为每个日志数据中的ip匹配对应的经纬度，而如果每个task都加载一份城市ip信息数据到内存中的话，无疑是非常消耗内存的，因此需要将城市ip信息数据封装在广播变量里，作为共享数据。

![image-20200416123110870](spark.assets/image-20200416123110870.png)

##### 代码实现

~~~scala
import org.apache.spark.rdd.RDD
import org.apache.spark.{SparkConf, SparkContext}

object CityIp {
  def ip2Long(ip:String):Long={
    val ipSpl:Array[String]=ip.split("\\.")
    var ipLong: Long = 0L
    for(i<-ipSpl){
      ipLong=i.toLong | ipLong<<8L
    }
    ipLong
  }
  def binarySearch(ipLong: Long, cityIp: Array[(String, String, String, String)]): Long ={
    //定义码表数组的起始下标：
    var startIndex=0
    //定义码表数组的结束下标：
    var endIndex=cityIp.length-1

    while(startIndex<=endIndex){
      val middleIndex=(startIndex+endIndex)/2
      //如果正好满足中间的元组的IP数值
      if(ipLong >= cityIp(middleIndex)._1.toLong && ipLong<=cityIp(middleIndex)._2.toLong){
        return middleIndex
      }
      if(ipLong > cityIp(middleIndex)._1.toLong){
        startIndex=middleIndex+1
      }
      if(ipLong<cityIp(middleIndex)._2.toLong){
        endIndex=middleIndex
      }
    }
    -1 //-1表示下标没有找到
  }
  def main(args: Array[String]): Unit = {
    val sparkconf=new SparkConf().setAppName("Ip").setMaster("local")
    val sc=new SparkContext(sparkconf)
    //加载ip码表数据
    val ipData=sc.textFile("E:\\LearningAll\\8-HadoopEcosystem-Video\\spark下载资料\\spark课程录播资料\\案例数据\\ip.txt")
    //处理ip码表数据
    val ipData2=ipData.map(x=>x.split("\\|")).map(x=>(x(2),x(3),x(x.length-2),x(x.length-2)))
    //创建广播变量
    val bdIP=sc.broadcast(ipData2.collect())
    //加载运营商日志数据
    val logData=sc.textFile("E:\\LearningAll\\8-HadoopEcosystem-Video\\spark下载资料\\spark课程录播资料\\案例数据\\20090121000132.394251.http.format")
    //处理运营商日志数据
    val logIps=logData.map(x=>x.split("\\|")(1))
    //遍历日志数据中的每个ip，将ip转为Long类型数值
    val andOneRDD:RDD[((String, String), Int)] =logIps.mapPartitions(iter=>{
      //获取广播变量的数据
      val cityIp:Array[(String,String,String,String)]=bdIP.value
      //遍历日志的ip，将ip转为数值
      iter.map(x=>{
        val ipLong=ip2Long(x)
        //获取ipLong在ip码表对应的索引数值（获取ipLong处在城市ipx信息表的第几行的ip数值区间）
        val index:Int=binarySearch(ipLong,cityIp).toInt
        //获取下标对应的经纬度等信息
        val resultJW: (String, String, String, String)=cityIp(index)
        //封装数据,作为返回值
        ((resultJW._3,resultJW._4),1)
      })

    })
    //相同的经纬度出现累加1
    val finalResult=andOneRDD.reduceByKey(_+_)

    //打印数据：
    finalResult.foreach(println)
  }
}

~~~

运行结果为：

```
((106.51107,106.51107),91)
((108.948024,108.948024),1824)
((114.502461,114.502461),383)
((106.27633,106.27633),36)
((102.712251,102.712251),126)
((107.08166,107.08166),29)
((116.405285,116.405285),1535)
((107.7601,107.7601),85)
((107.39007,107.39007),47)
((106.57434,106.57434),177)
((106.56347,106.56347),3)
((106.504962,106.504962),400)
```

##### 小结

该案例比较贴近实际的真实需求，含金量是比较高，这里使用了广播变量知识点、二分查询、ip地址转成Long类型数字，大家多多练习！掌握spark中的RDD编程。

## spark程序的序列化问题

#### transformation操作为什么需要序列化

spark是分布式执行引擎，其核心抽象是弹性分布式数据集RDD，其代表了分布在不同节点的数据。Spark的计算是在executor上分布式执行的，所以用户执行RDD的map，flatMap，reduceByKey等transformation 操作时可能有如下执行过程：

1. 代码中对象在driver本地序列化
2. 对象序列化后传输到远程executor节点
3. 远程executor节点反序列化对象
4. 最终远程节点执行

这些操作要序列化的原因：

我们知道，transformation这些算子都是要传入参数的，而且很多的参数都是函数，类似于闭包，闭包可简单理解成“定义在一个函数内部的函数”。

假如说作为算子参数的函数是：x=>(x,外部定义的对象或变量等)，外部定义的对象或变量等是在driver端创建的，那么如果作为算子参数的函数要使用外部的东西，就要从driver端拉取外部对象等过来到当前executor，从而使用。

因此，对象在执行中需要序列化通过网络传输，则必须经过序列化过程。

![image-20200416162320980](spark.assets/image-20200416162320980.png)



#### spark的任务序列化异常原因

##### 报错的可能原因

在编写spark程序中，由于在map，foreachPartition等算子内部使用了外部定义的变量和函数，从而引发Task未序列化问题。

然而spark算子在计算过程中使用外部变量在许多情形下确实在所难免，比如在filter算子根据外部指定的条件进行过滤，map根据相应的配置进行变换。

经常会出现“org.apache.spark.SparkException: Task not serializable”这个错误，出现这个错误的原因可能是：

1. 这些算子使用了外部的变量，但是这个变量不能序列化。
2. 当前类使用了“extends Serializable”声明支持序列化，但是由于某些字段不支持序列化，仍然会导致整个类序列化时出现问题，最终导致出现Task未序列化问题。

##### 示例1：

数据库连接定义在了foreachPartition算子外部，当算子内部要使用该连接时，就出现了序列化错误。这是因为这个数据库连接是在driver端构建的，而数据库连接没有实现序列化，无法传输到不同机器的executor，就报错了。

![image-20200416163718819](spark.assets/image-20200416163718819.png)

##### 示例2：

看下图，serialDemo是在object外部定义的类，虽然serialDemo extends Serializable实现序列化，但是，因为该类里面的数据库连接是conne是不支持序列化的，导致序列化不成功。虽然引用的是name变量，但还是报错了。

如果函数中使用了该类对象的成员变量，该类除了要实现序列化之外，**所有的成员变量必须要实现序列化**。

![image-20200416164933460](spark.assets/image-20200416164933460.png)



#### spark中解决序列化问题的办法

1. 如果函数中使用了该类对象，该类要实现序列化，序列化方法：class xxx extends Serializable{}
2. 如果函数中使用了该类对象的成员变量，该类除了要实现序列化之外，所有的成员变量必须要实现序列化
3. 对于不能序列化的成员变量使用**“@transient”**标注，告诉编译器不需要序列化
4. 也可将依赖的变量独立放到一个小的class中，让这个class支持序列化，这样做可以减少网络传输量，提高效率。
5. 可以把对象的创建直接在该函数中构建这样避免需要序列化

因此，遵从这些方法，将上面示例2中的代码改成如下就可以运行成功了：

```scala
import java.sql.{Connection, DriverManager, PreparedStatement}

import org.apache.spark.{SparkConf, SparkContext}

class serialDemo extends Serializable {
  val name:String="krystal"
  @transient
  val conne = DriverManager.getConnection("jdbc:mysql://node03:3306/demo1", "root", "123456")
}
object Data2MysqlForeachPartition {
  def main(args: Array[String]): Unit = {
    val sparkkconf = new SparkConf().setAppName("ForeachMysql").setMaster("local[2]")
    val sc = new SparkContext(sparkkconf)
    val rdd1=sc.parallelize(1 to 10)
    val sd=new serialDemo()
    val rdd2=rdd1.map(x=>(x,sd.name))
    rdd2.foreach(println)
  }
}
```

运行结果为：

```scala
(6,krystal)
(1,krystal)
(2,krystal)
(3,krystal)
(4,krystal)
(5,krystal)
(7,krystal)
(8,krystal)
(9,krystal)
(10,krystal)
```



## spark on yarn

spark程序可以提交到yarn中去运行，此时spark任务所需要的计算资源由yarn中的老大ResourceManager去分配

官网资料地址: http://spark.apache.org/docs/2.3.3/running-on-yarn.html

#### 环境准备

1. 安装hadoop集群
2. 安装spark环境

注意：

这里不需要安装spark集群，只需要解压spark安装包到任意一台服务器，然后修改文件spark-env.sh:

```shell
#指定java的环境变量
export JAVA_HOME=/kkb/install/jdk1.8.0_141
#指定hadoop的配置文件目录
export HADOOP_CONF_DIR=/kkb/install/hadoop-2.6.0-cdh5.14.2/etc/hadoop
```

因为我们之前安装过了spark集群，包含了spark环境，所以我们不需要做任何操作

#### sparkOnYarn模式

按照Spark应用程序中的driver分布方式不同，Spark on YARN有两种模式： 

1. yarn-client模式
2. yarn-cluster`模式

##### yarn-cluster模式

提交spark的测试程序到yarn运行：

```shell
spark-submit --class org.apache.spark.examples.SparkPi \
--master yarn \
--deploy-mode cluster \
--driver-memory 1g \
--executor-memory 1g \
--executor-cores 1 \
/kkb/install/spark/examples/jars/spark-examples_2.11-2.3.3.jar \
10

#特别注意 
	--master 的值是yarn
	--deploy-mode 的值是cluster，表示使用cluster模式运行
```

如果运行出现错误，可能是虚拟内存不足，可以添加参数

vim yarn-site.xml

```xml
<!--容器是否会执行物理内存限制，默认为True-->
<property>
    <name>yarn.nodemanager.pmem-check-enabled</name>
    <value>false</value>
</property>

<!--容器是否会执行虚拟内存限制，默认为True-->
<property>
    <name>yarn.nodemanager.vmem-check-enabled</name>
    <value>false</value>
</property>
```

说明：

1、使用cluster集群模式时，如果在运行中途，在运行窗口界面按ctrl+c是终止不了spark程序的运行的，虽然窗口不再有打印输出，但是程序还是在运行着的。如下：

![image-20200416173857717](spark.assets/image-20200416173857717.png)

2、ctrl+c停止打印输出后，我们去查看http://node01:8088/cluster的信息，发现该任务执行成功了：

![image-20200416174244879](spark.assets/image-20200416174244879.png)

3、点击该Application的ID，查看log,可看到运行结果：

![image-20200416174653942](spark.assets/image-20200416174653942.png)

4、即使不使用ctrl+c中断打印信息的输出，程序在运行完成后（state：Finished代表运行完成），在Linux的运行输出窗口依然是看不到Pi的结果输出的。这跟cluster模式运行有关。

##### yarn-client模式

提交spark的测试程序到yarn运行：

```shell
spark-submit --class org.apache.spark.examples.SparkPi \
--master yarn \
--deploy-mode client \
--driver-memory 1g \
--executor-memory 1g \
--executor-cores 1 \
/kkb/install/spark/examples/jars/spark-examples_2.11-2.3.3.jar \
10
```

说明：

1. 在client模式下，如果ctrl+c中断了输出，等同于停止了程序的运行。
2. 在client模式下，可以在Linux的运行输出窗口看到Pi结果的输出

#### 两种模式的原理

首先来回顾以下MapReduce程序运行在yarn的大致流程：

1. 客户端与ResourceManager进行通信，申请Application
2. 客户端提交jar包到hdfs
3. RM向集群的某个NodeManager申请开启ApplicationMaster,该NM就启动一个Container，在该Container里面启动ApplicationMaster
4. ApplicationMaster向RM申请在某些NodeManager启动容器，给task运行，然后NM就会启动一些Container给task运行

##### yarn-cluster模式原理：

结合yanr的工作机制,yarn-cluter模式执行spark程序的大致流程如下：

1. 客户端提交Application到RM
2. RM找到某个节点上NodeManager，申请Container来启动一个ApplicationMaster。
3. ApplicationMaster启动后，会在内部构建一个spark context对象。SparkContext的底层调度器由taskScheduler变成了YarnClusterScheduler。
4. 在之前了解到，SparkContext对象是在Driver端的，因此，Driver端也是在该ApplicationMaster进程内部的。ApplicationMaster跟driver端捆绑在一起了，ApplicationMaster在哪里，driver端就在哪里。
5. 构建好SparkContext对象后，ApplicationMaster会向RM申请计算资源Container。
6. 然后在某些NodeManager节点上就会启动Container,在Container上启动executor
7. 最后，YarnClusterScheduler就会提交task到executor上运行

了解yarn-cluster模式的机制后，就可以理解：为什么ctrl+c终止客户端终端停止不了spark程序的运行了。

这是因为Driver端跟客户端不在同一个节点，比如客户端在node01,而nodemanager和dirver都在node02。

![image-20200416191119359](spark.assets/image-20200416191119359.png)

##### yarn-client模式原理：

client模式与cluster模式的流程很相似，只不过是Driver端的位置发生了变化，Driver端跟客户端捆绑在了一起，YarnClusterScheduler也变成了YarnClientScheduler。

因此，当使用client模式时，如果我们停掉了客户端终端，就相当于停掉了Driver端，导致程序运行失败。这也是我们输出日志显示不停地尝试连接Driver端的原因。

![yarn-client](spark.assets/yarn-client.png)



#### 两种模式的区别

yarn-cluster模式

- spark程序的**Driver程序在YARN中运行**，运行结果不能在客户端显示，并且客户端可以在启动应用程序后消失应用的。
- 最好运行那些将结果最终保存在外部存储介质（如HDFS、Redis、Mysql），客户端的终端显示的仅是作为YARN的job的简单运行状况。

yarn-client模式

- spark程序的**Driver运行在Client上**，应用程序运行结果会在客户端显示，所有适合运行结果有输出的应用程序（如spark-shell）

总结

1. 最大的区别就是Driver端的位置不一样。
2. yarn-cluster: Driver端运行在yarn集群中，与ApplicationMaster进程在一起。
3. yarn-client:  Driver端运行在提交任务的客户端,与ApplicationMaster进程没关系,经常用于进行测试

## collect 算子操作剖析 

collect算子操作的作用：

1. 它是一个action操作，会触发任务的运行
2. 它会把RDD的数据进行收集之后，以数组的形式返回给Driver端

![collect](spark.assets/collect.png)

总结：

1. 默认Driver端的内存大小为1G，由参数 spark.driver.memory 设置。

2. 如果某个rdd的数据量超过了Driver端默认的1G内存，对rdd调用collect操作，这里会出现Driver端的内存溢出（OOM），所有这个**collect操作存在一定的风险，实际开发代码一般不会使用**。比如说rdd的数据量达到了10G，rdd.collect这个操作非常危险，很有可能出现driver端的内存不足

3. 广播变量也会占用Driver端一定的内存空间。

4. 实际企业中一般都会把该参数调大，比如5G/10G等。

   可以在代码中修改该参数，如下

   ```scala
   new SparkConf().set("spark.driver.memory","5G")
   ```

## spark任务中资源参数剖析

通过开发工具开发好spark程序后达成jar包最后提交到集群中运行

提交任务脚本如下

```shell
spark-submit \
--master spark://node01:7077,node02:7077 \
--class com.kaikeba.WordCountOnSpark \
--executor-memory 1g  \
--total-executor-cores 4 \
original-spark_class03-1.0-SNAPSHOT.jar \
/words.txt  /out
```

#### --executor-memory

- 表示每一个executor进程需要的内存大小，它决定了后期操作数据的速度

```
比如说一个rdd的数据量大小为5g,这里给定的executor-memory为2g, 在这种情况下，内存是存储不下，它会把一部分数据保存在内存中，还有一部分数据保存在磁盘，后续需要用到该rdd的结果数据，可以从内存和磁盘中获取得到，这里就涉及到一定的磁盘io操作。

,这里给定的executor-memory为10g，这里数据就可以完全在内存中存储下，后续需要用到该rdd的数据，就可以直接从内存中获取，这样一来，避免了大量的磁盘io操作。性能得到提升。


在实际的工作，这里 --executor-memory 需要设置的大一点。
比如说10G/20G/30G等
```

#### --total-executor-cores

--total-executor-cores表示任务运行需要总的cpu核数，它决定了任务并行运行的粒度

比如说要处理100个task，注意一个cpu在同一时间只能处理一个task线程。

1. 如果给定的总的cpu核数是5个，这里就需要100/5=20个批次才可以把这100个task运行完成，如果平均每个task运行1分钟，这里最后一共运行20分钟。

2. 如果给定的总的cpu核数是20个，这里就需要100/20=5个批次才可以把这100个task运行完成，如果平均每个task运行1分钟，这里最后一共运行5分钟。

3. 如果如果给定的总的cpu核数是100个，这里就需要100/100=1个批次才可以把这100个task运行完成，如果平均每个task运行1分钟，这里最后一共运行1分钟。


在实际的生产环境中，--total-executor-cores 这个参数一般也会设置的大一点，比如说 30个/50个/100个

![image-20200416204239271](spark.assets/image-20200416204239271.png)

#### 总结

后期对于spark程序的优化，可以从这2个参数入手，无论你把哪一个参数调大，对程序运行的效率来说都会达到一定程度的提升，加大计算资源它是最直接、最有效果的优化手段。

在计算资源有限的情况下，可以考虑其他方面，比如说代码层面，JVM层面等



## spark的shuffle原理分析

#### shuffle概述

Shuffle就是对数据进行重组，由于分布式计算的特性和要求，在实现细节上更加繁琐和复杂。

在MapReduce框架，Shuffle是连接Map和Reduce之间的桥梁，Map阶段通过shuffle读取数据并输出到对应的Reduce；而Reduce阶段负责从Map端拉取数据并进行计算。

在整个shuffle过程中，往往伴随着大量的磁盘和网络I/O。所以shuffle性能的高低也直接决定了整个程序的性能高低。**Spark也会有自己的shuffle实现过程。**

MapReduce Shuffle流程图：

  ![mapreduce_shuffle](spark.assets/mapreduce_shuffle.png)



#### spark中的shuffle介绍

在DAG调度的过程中，Stage阶段的划分是根据是否有shuffle过程，也就是存在wide Dependency宽依赖的时候,需要进行shuffle,这时候会将作业job划分成多个Stage，每一个stage内部有很多可以并行运行的task。

stage与stage之间的过程就是shuffle阶段，在Spark的中，负责shuffle过程的执行、计算和处理的组件主要就是ShuffleManager，也即shuffle管理器。ShuffleManager随着Spark的发展有两种实现的方式，分别为HashShuffleManager和SortShuffleManager，因此spark的Shuffle有Hash Shuffle和Sort Shuffle两种。

#### HashShuffle机制

##### HashShuffle概述

在Spark 1.2以前，默认的shuffle计算引擎是HashShuffleManager。

该ShuffleManager-HashShuffleManager有着一个非常严重的弊端，就是会产生大量的中间磁盘文件，进而由大量的磁盘IO操作影响了性能。因此在Spark 1.2以后的版本中，默认的ShuffleManager改成了SortShuffleManager。

SortShuffleManager相较于HashShuffleManager来说，有了一定的改进。主要就在于每个Task在进行shuffle操作时，虽然也会产生较多的临时磁盘文件，但是最后会将所有的临时文件合并(merge)成一个磁盘文件，因此每个Task就只有一个磁盘文件。在下一个stage的shuffle read task拉取自己的数据时，只要根据索引读取每个磁盘文件中的部分数据即可。

HashShuffleManager的运行机制主要分成两种:

1. 一种是**普通运行机制**
2. 另一种是**合并的运行机制**。合并机制主要是通过复用buffer来优化Shuffle过程中产生的小文件的数量。

Hash shuffle是不具有排序的Shuffle。



##### 普通机制的Hash shuffle

![未优化的HashShuffle机制](spark.assets/未优化的HashShuffle机制.png)

**图解**

这里我们先明确一个假设前提：每个Executor只有1个CPU core，也就是说，无论这个Executor上分配多少个task线程，同一时间都只能执行一个task线程。

图中有3个ReduceTask，从ShuffleMapTask 开始那边各自把自己进行 Hash 计算(分区器：hash/numreduce取模)，分类出3个不同的类别，每个 ShuffleMapTask 都分成3种类别的数据，想把不同的数据汇聚然后计算出最终的结果，所以ReduceTask 会在属于自己类别的数据收集过来，汇聚成一个同类别的大集合，每1个ShuffleMapTask输出3份本地文件，这里有4个ShuffleMapTask，所以总共输出了4 x 3个分类文件 = 12个本地小文件。

**shuffle Write阶段**

主要就是在一个stage结束计算之后，为了下一个stage可以执行shuffle类的算子(比如reduceByKey，groupByKey)，而将每个task处理的数据按key进行“分区”。所谓“分区”，就是对相同的key执行hash算法，从而将相同key都写入同一个磁盘文件中，而每一个磁盘文件都只属于reduce端的stage的一个task。在将数据写入磁盘之前，会先将数据写入内存缓冲Buffer中，当内存缓冲填满之后，才会溢写到磁盘文件中去。

那么每个执行shuffle write的task，要为下一个stage创建多少个磁盘文件呢? 很简单，下一个stage的task有多少个，当前stage的每个task就要创建多少份磁盘文件。比如下一个stage总共有100个task，那么当前stage的每个task都要创建100份磁盘文件。如果当前stage有50个task，总共有10个Executor，每个Executor执行5个Task，那么每个Executor上总共就要创建500个磁盘文件，所有Executor上会创建5000个磁盘文件。由此可见，未经优化的shuffle write操作所产生的磁盘文件的数量是极其惊人的。

**shuffle Read阶段**

shuffle read，通常就是一个stage刚开始时要做的事情。此时该stage的每一个task就需要将上一个stage的计算结果中的所有相同key，从各个节点上通过网络都拉取到自己所在的节点上，然后进行key的聚合或连接等操作。由于shuffle write的过程中，task给Reduce端的stage的每个task都创建了一个磁盘文件，因此shuffle read的过程中，每个task只要从上游stage的所有task所在节点上，拉取属于自己的那一个磁盘文件即可。

shuffle read的拉取过程是一边拉取一边进行聚合的。每个shuffle read task都会有一个自己的buffer缓冲，每次都只能拉取与buffer缓冲相同大小的数据，然后通过内存中的一个Map进行聚合等操作。聚合完一批数据后，再拉取下一批数据，并放到buffer缓冲中进行聚合操作。以此类推，直到最后将所有数据到拉取完，并得到最终的结果。

**注意**

1. buffer起到的是缓存作用，缓存能够加速写磁盘，提高计算的效率,shuffle write task buffer的默认大小32k,shuffle read task buffer的默认大小是48M。

2. 分区器：根据hash/numRedcue取模决定数据由几个Reduce处理，也决定了写入几个buffer中

3. block file：磁盘小文件，从图中我们可以知道磁盘小文件的个数计算公式：
       block file=M*R
4. M为map task的数量，R为Reduce的数量，一般Reduce的数量等于buffer的数量，都是由分区器决定的

**Hash shuffle普通机制的问题**

  （1)Shuffle阶段在磁盘上会产生海量的小文件，建立通信和拉取数据的次数变多,此时会产生大量耗时低效的 IO 操作 (因为产生过多的小文件)

  （2)可能导致OOM，大量耗时低效的 IO 操作 ，导致写磁盘时的对象过多，读磁盘时候的对象也过多，这些对象存储在堆内存中，会导致堆内存不足，相应会导致频繁的GC，GC会导致OOM。由于内存中需要保存海量文件操作句柄和临时信息，如果数据处理的规模比较庞大的话，内存不可承受，会出现 OOM 等问题



##### 合并机制的Hash shuffle

合并机制就是复用buffer缓冲区，开启合并机制的配置是spark.shuffle.consolidateFiles。该参数默认值为false，将其设置为true即可开启优化机制。

通常来说，如果我们使用HashShuffleManager，那么都建议开启这个选项。

![优化后的Shuffle机制](spark.assets/优化后的Shuffle机制.png)



- **图解**

这里有6个这里有6个shuffleMapTask，数据类别还是分成3种类型，因为Hash算法会根据你的 Key 进行分类，在同一个进程中，无论是有多少过Task，都会把同样的Key放在同一个Buffer里，然后把Buffer中的数据写入以Core数量为单位的本地文件中，(一个Core只有一种类型的Key的数据)。

每1个Task所在的进程中，分别写入共同进程中的3份本地文件，这里有6个shuffleMapTasks，所以总共输出是 2个Cores x 3个分类文件 = 6个本地小文件。

- **注意**

```sh
1、启动HashShuffle的合并机制ConsolidatedShuffle的配置：
	spark.shuffle.consolidateFiles=true

2、block file=Core*R  #产生文件的数量
	Core为CPU的核数，R为ReduceTask的数量
```

- **Hash shuffle合并机制的问题**

```
  	如果 Reducer 端的并行任务或者是数据分片过多的话则 Core * Reducer Task 依旧过大，也会产生很多小文件。
```



#### Sort shuffle机制

SortShuffleManager的运行机制主要分成两种，

- 一种是**普通运行机制**
- 另一种是**bypass运行机制**

##### Sort shuffle的普通机制

![sortshuffle](spark.assets/sortshuffle.png)

- **图解**

在该模式下，数据会先写入一个数据结构，聚合算子写入Map，一边通过Map局部聚合，一边写入内存。Join算子写入ArrayList直接写入内存中。然后需要判断是否达到阈值（5M），如果达到就会将内存数据结构的数据写入到磁盘，清空内存数据结构。

在溢写磁盘前，先根据key进行排序，排序过后的数据，会分批写入到磁盘文件中。默认批次为10000条，数据会以每批一万条写入到磁盘文件。写入磁盘文件通过缓冲区溢写的方式，每次溢写都会产生一个磁盘文件，也就是说一个task过程会产生多个临时文件.

最后在每个task中，将所有的临时文件合并，这就是merge过程，此过程将所有临时文件读取出来，一次写入到最终文件。意味着一个task的所有数据都在这一个文件中。同时单独写一份索引文件，标识下游各个task的数据在文件中的索引start offset和end offset。

这样算来如果第一个stage 50个task，每个Executor执行一个task，那么无论下游有几个task，就需要50*2=100个磁盘文件。

- **好处**

```
  1. 小文件明显变少了，一个task只生成一个file文件
  
  2. file文件整体有序，加上索引文件的辅助，查找变快，虽然排序浪费一些性能，但是查找变快很多
```

##### bypass模式的sortShuffle

bypass机制运行条件

- shuffle map task数量小于spark.shuffle.sort.bypassMergeThreshold参数的值
- 不是聚合类的shuffle算子（比如reduceByKey）

![bypasssortshuffle](spark.assets/bypasssortshuffle.png)

- **好处**

该机制与sortshuffle的普通机制相比，在shuffleMapTask不多的情况下，首先写的机制是不同，其次不会进行排序。这样就可以节约一部分性能开销。

- **总结**

```
在shuffleMapTask数量小于默认值200时，启用bypass模式的sortShuffle(原因是数据量本身比较少，没必要进行sort全排序，因为数据量少本身查询速度就快，正好省了sort的那部分性能开销。)
 
 该机制与普通SortShuffleManager运行机制的不同在于：
    第一: 磁盘写机制不同；
    第二: 不会进行sort排序；
```



## Spark Shuffle参数调优

**spark.shuffle.file.buffer**

- 默认值：32k
- 参数说明：该参数用于设置shuffle write task的BufferedOutputStream的buffer缓冲大小。将数据写到磁盘文件之前，会先写入buffer缓冲中，待缓冲写满之后，才会溢写到磁盘。
- 调优建议：如果作业可用的内存资源较为充足的话，可以适当增加这个参数的大小（比如64k），从而减少shuffle write过程中溢写磁盘文件的次数，也就可以减少磁盘IO次数，进而提升性能。在实践中发现，合理调节该参数，性能会有1%~5%的提升。

**spark.reducer.maxSizeInFlight**

- 默认值：48m
- 参数说明：该参数用于设置shuffle read task的buffer缓冲大小，而这个buffer缓冲决定了每次能够拉取多少数据。
- 调优建议：如果作业可用的内存资源较为充足的话，可以适当增加这个参数的大小（比如96m），从而减少拉取数据的次数，也就可以减少网络传输的次数，进而提升性能。在实践中发现，合理调节该参数，性能会有1%~5%的提升。

**spark.shuffle.io.maxRetries**

- 默认值：3
- 参数说明：shuffle read task从shuffle write task所在节点拉取属于自己的数据时，如果因为网络异常导致拉取失败，是会自动进行重试的。该参数就代表了可以重试的最大次数。如果在指定次数之内拉取还是没有成功，就可能会导致作业执行失败。
- 调优建议：对于那些包含了特别耗时的shuffle操作的作业，建议增加重试最大次数（比如60次），以避免由于JVM的full gc或者网络不稳定等因素导致的数据拉取失败。在实践中发现，对于针对超大数据量（数十亿~上百亿）的shuffle过程，调节该参数可以大幅度提升稳定性。

**spark.shuffle.io.retryWait**

- 默认值：5s
- 参数说明：具体解释同上，该参数代表了每次重试拉取数据的等待间隔，默认是5s。
- 调优建议：建议加大间隔时长（比如60s），以增加shuffle操作的稳定性。

**spark.shuffle.memoryFraction**（Spark1.6是这个参数，1.6以后参数变了，具体参考上一讲Spark内存模型知识）

- 默认值：0.2
- 参数说明：该参数代表了Executor内存中，分配给shuffle read task进行聚合操作的内存比例，默认是20%。
- 调优建议：在资源参数调优中讲解过这个参数。如果内存充足，而且很少使用持久化操作，建议调高这个比例，给shuffle read的聚合操作更多内存，以避免由于内存不足导致聚合过程中频繁读写磁盘。在实践中发现，合理调节该参数可以将性能提升10%左右。

**spark.shuffle.manager**

- 默认值：sort
- 参数说明：该参数用于设置ShuffleManager的类型。Spark 1.5以后，有三个可选项：hash、sort和tungsten-sort。HashShuffleManager是Spark 1.2以前的默认选项，但是Spark 1.2以及之后的版本默认都是SortShuffleManager了。Spark1.6以后把hash方式给移除了，tungsten-sort与sort类似，但是使用了tungsten计划中的堆外内存管理机制，内存使用效率更高。
- 调优建议：由于SortShuffleManager默认会对数据进行排序，因此如果你的业务逻辑中需要该排序机制的话，则使用默认的SortShuffleManager就可以；而如果你的业务逻辑不需要对数据进行排序，那么建议参考后面的几个参数调优，通过bypass机制或优化的HashShuffleManager来避免排序操作，同时提供较好的磁盘读写性能。这里要注意的是，tungsten-sort要慎用，因为之前发现了一些相应的bug。

**spark.shuffle.sort.bypassMergeThreshold**

- 默认值：200
- 参数说明：当ShuffleManager为SortShuffleManager时，如果shuffle read task的数量小于这个阈值（默认是200），则shuffle write过程中不会进行排序操作，而是直接按照未经优化的HashShuffleManager的方式去写数据，但是最后会将每个task产生的所有临时磁盘文件都合并成一个文件，并会创建单独的索引文件。
- 调优建议：当你使用SortShuffleManager时，如果的确不需要排序操作，那么建议将这个参数调大一些，大于shuffle read task的数量。那么此时就会自动启用bypass机制，map-side就不会进行排序了，减少了排序的性能开销。但是这种方式下，依然会产生大量的磁盘文件，因此shuffle write性能有待提高。



## 数据倾斜原理和现象分析

#### 数据倾斜概述

有的时候，我们可能会遇到大数据计算中一个最棘手的问题——数据倾斜，此时Spark作业的性能会比期望差很多。

数据倾斜调优，就是使用各种技术方案解决不同类型的数据倾斜问题，以保证Spark作业的性能。

#### 数据倾斜发生时的现象

1、绝大多数task执行得都非常快，但个别task执行极慢

```
	你的大部分的task，都执行的特别快，很快就执行完了，剩下几个task，执行的特别特别慢，
前面的task，一般10s可以执行完5个；最后发现某个task，要执行1个小时，2个小时才能执行完一个task。
	
	这个时候就出现数据倾斜了。
这种方式还算好的，因为虽然老牛拉破车一样，非常慢，但是至少还能跑。
```

2、绝大数task执行很快，有的task直接报OOM (Jvm Out Of Memory) 异常

```
	运行的时候，其他task都很快执行完了，也没什么特别的问题；但是有的task，就是会突然间报了一个OOM，JVM Out Of Memory，内存溢出了，task failed，task lost，resubmitting task等日志异常信息。反复执行几次都到了某个task就是跑不通，最后就挂掉。

	某个task就直接OOM，那么基本上也是因为数据倾斜了，task分配的数量实在是太大了！！！所以内存放不下，然后你的task每处理一条数据，还要创建大量的对象。内存爆掉了。
```

#### 数据倾斜发生的原理

![数据倾斜](spark.assets/数据倾斜.png)

```
如上图所示：
	在进行任务计算shuffle操作的时候，第一个task和第二个task各分配到了1万条数据；需要5分钟计算完毕；第一个和第二个task，可能同时在5分钟内都运行完了；第三个task要98万条数据，98 * 5 = 490分钟 = 8个小时；
	本来另外两个task很快就运行完毕了（5分钟），第三个task数据量比较大，要8个小时才能运行完，就导致整个spark作业，也得8个小时才能运行完。最终导致整个spark任务计算特别慢。
```



#### 数据倾斜如何定位原因

###### 方法1：主要是根据log日志信息去定位

数据倾斜只会发生在shuffle过程中。这里给大家罗列一些常用的并且可能会触发shuffle操作的算子：distinct、groupByKey、reduceByKey、aggregateByKey、join、cogroup、repartition等。

出现数据倾斜时，可能就是你的代码中使用了这些算子中的某一个所导致的。因为某个或者某些key对应的数据，远远的高于其他的key。

###### 方法2：分析定位逻辑

```
	由于代码中有大量的shuffle操作，一个job会划分成很多个stage，首先要看的，就是数据倾斜发生在第几个stage中。
	可以在任务运行的过程中，观察任务的UI界面，可以观察到每一个stage中运行的task的数据量，从而进一步确定是不是task分配的数据不均匀导致了数据倾斜。
	比如下图中，倒数第三列显示了每个task的运行时间。明显可以看到，有的task运行特别快，只需要几秒钟就可以运行完;而有的task运行特别慢，需要几分钟才能运行完，此时单从运行时间上看就已经能够确定发生数据倾斜了。
	此外，倒数第一列显示了每个task处理的数据量，明显可以看到，运行时间特别短的task只需要处理几百KB的数据即可，而运行时间特别长的task需要处理几千KB的数据，处理的数据量差了10倍。此时更加能够确定是发生了数据倾斜。
```

![20170308091203159](spark.assets/20170308091203159.png)

###### 方法3：某个task莫名其妙内存溢出的情况

这种情况下去定位出问题的代码就比较容易了。我们建议直接看yarn-client模式下本地log的异常栈，或者是通过YARN查看yarn-cluster模式下的log中的异常栈。

一般来说，通过异常栈信息就可以定位到你的代码中哪一行发生了内存溢出。然后在那行代码附近找找，一般也会有shuffle类算子，此时很可能就是这个算子导致了数据倾斜。

但是大家要注意的是，不能单纯靠偶然的内存溢出就判定发生了数据倾斜。因为自己编写的代码的bug，以及偶然出现的数据异常，也可能会导致内存溢出。因此还是要按照上面所讲的方法，通过Spark Web UI查看报错的那个stage的各个task的运行时间以及分配的数据量，才能确定是否是由于数据倾斜才导致了这次内存溢出。

###### 方法4：查看导致数据倾斜的key的数据分布情况

```
	知道了数据倾斜发生在哪里之后，通常需要分析一下那个执行了shuffle操作并且导致了数据倾斜的RDD/Hive表，查看一下其中key的分布情况。这主要是为之后选择哪一种技术方案提供依据。针对不同的key分布与不同的shuffle算子组合起来的各种情况，可能需要选择不同的技术方案来解决。
此时根据你执行操作的情况不同，可以有很多种查看key分布的方式：
	如果是Spark SQL中的group by、join语句导致的数据倾斜，那么就查询一下SQL中使用的表的key分布情况。
	如果是对Spark RDD执行shuffle算子导致的数据倾斜，那么可以在Spark作业中加入查看key分布的代码，比如RDD.countByKey()。然后对统计出来的各个key出现的次数，collect/take到客户端打印一下，就可以看到key的分布情况。
	举例来说，对于上面所说的单词计数程序，如果确定了是stage1的reduceByKey算子导致了数据倾斜，那么就应该看看进行reduceByKey操作的RDD中的key分布情况，在这个例子中指的就是pairs RDD。如下示例，我们可以先对pairs采样10%的样本数据，然后使用countByKey算子统计出每个key出现的次数，最后在客户端遍历和打印样本数据中各个key的出现次数。
```

```scala
val sampledPairs = pairs.sample(false, 0.1)
val sampledWordCounts = sampledPairs.countByKey()
sampledWordCounts.foreach(println(_))

//sample算子时用来抽样用的，其有3个参数

//withReplacement：表示抽出样本后是否在放回去，true表示会放回去，这也就意味着抽出的样本可能有重复

//fraction ：抽出多少，这是一个double类型的参数,0-1之间，eg:0.3表示抽出30%

//seed：表示一个种子，根据这个seed随机抽取，一般情况下只用前两个参数就可以，那么这个参数是干嘛的呢，这个参数一般用于调试，有时候不知道是程序出问题还是数据出了问题，就可以将这个参数设置为定值
```

#### 数据倾斜原因总结

数据本身问题

```
（1）、key本身分布不均衡（包括大量的key为空）
（2）、key的设置不合理
```

spark使用不当的问题

```
（1）、shuffle时的并发度不够
（2）、计算方式有误	
```

#### 数据倾斜的后果

```
（1）spark中的stage的执行时间受限于最后那个执行完成的task,因此运行缓慢的任务会拖垮整个程序的运行速度（分布式程序运行的速度是由最慢的那个task决定的）。

（2）过多的数据在同一个task中运行，将会把executor内存撑爆，导致OOM内存溢出。
```



## spark中数据倾斜的解决方案

##### 解决方案一：使用Hive ETL预处理数据

方案适用场景：**导致数据倾斜的是Hive表**。如果该Hive表中的数据本身很不均匀(比如某个key对应了100万数据，其他key才对应了10条数据)，而且业务场景需要频繁使用Spark对Hive表执行某个分析操作，那么比较适合使用这种技术方案。

方案实现思路：此时可以评估一下，是否可以通过Hive来进行数据预处理(即通过Hive ETL预先对数据按照key进行聚合，或者是预先和其他表进行join)，然后在**Spark作业中针对的数据源就不是原来的Hive表了，而是预处理后的Hive表**。此时由于数据已经预先进行过聚合或join操作了，那么在Spark作业中也就不需要使用原先的shuffle类算子执行这类操作了。

方案实现原理：这种方案从根源上解决了数据倾斜，因为彻底避免了在Spark中执行shuffle类算子，那么肯定就不会有数据倾斜的问题了。但是这里也要提醒一下大家，这种方式属于治标不治本。因为毕竟数据本身就存在分布不均匀的问题，所以Hive ETL中进行group by或者join等shuffle操作时，还是会出现数据倾斜，导致Hive ETL的速度很慢。我们**只是把数据倾斜的发生提前到了Hive ETL中，避免Spark程序发生数据倾斜而已**。

方案优点：实现起来简单便捷，效果还非常好，完全规避掉了数据倾斜，**Spark作业的性能会大幅度提升**。

方案缺点：**治标不治本，Hive ETL中还是会发生数据倾斜**。

方案实践经验：在一些Java系统与Spark结合使用的项目中，会出现Java代码频繁调用Spark作业的场景，而且对Spark作业的执行性能要求很高，就比较适合使用这种方案。将数据倾斜提前到上游的Hive ETL，每天仅执行一次，只有那一次是比较慢的，而之后每次Java调用Spark作业时，执行速度都会很快，能够提供更好的用户体验。

项目实践经验：有一个交互式用户行为分析系统中使用了这种方案，该系统主要是允许用户通过Java Web系统提交数据分析统计任务，后端通过Java提交Spark作业进行数据分析统计。要求Spark作业速度必须要快，尽量在10分钟以内，否则速度太慢，用户体验会很差。所以我们将有些Spark作业的shuffle操作提前到了Hive ETL中，从而让Spark直接使用预处理的Hive中间表，尽可能地减少Spark的shuffle操作，大幅度提升了性能，将部分作业的性能提升了6倍以上。

![交互式用户行为分析系统](spark.assets/交互式用户行为分析系统.png)



##### 解决方案二：过滤少数导致倾斜的key

方案适用场景：如果发现**导致倾斜的key就少数几个，而且对计算本身的影响并不大**的话，那么很适合使用这种方案。比如99%的key就对应10条数据，但是只有一个key对应了100万数据，从而导致了数据倾斜。

方案实现思路：如果我们判断那少数几个数据量特别多的key，对作业的执行和计算结果不是特别重要的话，那么干脆就**直接过滤掉那少数几个key**。比如，在Spark SQL中可以使用where子句过滤掉这些key或者在Spark Core中对RDD执行filter算子过滤掉这些key。如果需要每次作业执行时，动态判定哪些key的数据量最多然后再进行过滤，那么可以使用sample算子对RDD进行采样，然后计算出每个key的数量，取数据量最多的key过滤掉即可。

方案实现原理：将导致数据倾斜的key给过滤掉之后，这些key就不会参与计算了，自然不可能产生数据倾斜。

方案优点：实现简单，而且效果也很好，可以完全规避掉数据倾斜。

方案缺点：适用场景不多，**大多数情况下，导致倾斜的key还是很多的，并不是只有少数几个**。

方案实践经验：在项目中我们也采用过这种方案解决数据倾斜。有一次发现某一天Spark作业在运行的时候突然OOM了，追查之后发现，是Hive表中的某一个key在那天数据异常，导致数据量暴增。因此就采取每次执行前先进行采样，计算出样本中数据量最大的几个key之后，直接在程序中将那些key给过滤掉。



##### 解决方案三：提高shuffle操作的并行度(**效果差**)

方案适用场景：如果我们必须要对数据倾斜迎难而上，那么建议优先使用这种方案，因为这是处理数据倾斜最简单的一种方案。

方案实现思路：在对RDD执行shuffle算子时，给shuffle算子传入一个参数，比如reduceByKey(1000)，该参数就设置了这个shuffle算子执行时shuffle read task的数量。对于Spark SQL中的shuffle类语句，比如group by、join等，需要设置一个参数，即spark.sql.shuffle.partitions，该参数代表了shuffle read task的并行度，该值默认是200，对于很多场景来说都有点过小。

方案实现原理：增加shuffle read task的数量，可以让原本分配给一个task的多个key分配给多个task，从而让每个task处理比原来更少的数据。举例来说，如果原本有5个key，每个key对应10条数据，这5个key都是分配给一个task的，那么这个task就要处理50条数据。而增加了shuffle read task以后，每个task就分配到一个key，即每个task就处理10条数据，那么自然每个task的执行时间都会变短了。具体原理如下图所示。

方案优点：实现起来比较简单，可以有效缓解和减轻数据倾斜的影响。

方案缺点：只是缓解了数据倾斜而已，没有彻底根除问题，根据实践经验来看，其**效果有限**。

方案实践经验：该方案通常无法彻底解决数据倾斜，因为如果出现一些极端情况，比如某个key对应的数据量有100万，那么无论你的task数量增加到多少，这个对应着100万数据的key肯定还是会分配到一个task中去处理，因此注定还是会发生数据倾斜的。所以这种方案只能说是在发现数据倾斜时尝试使用的第一种手段，尝试去用最简单的方法缓解数据倾斜而已，或者是和其他方案结合起来使用。

![1570609831990](spark.assets/1570609831990.png)



##### 解决方案四：两阶段聚合（局部聚合+全局聚合）

方案适用场景：**对RDD执行reduceByKey等聚合类shuffle算子或者在Spark SQL中使用group by语句进行分组聚合时**，比较适用这种方案。

方案实现思路：这个方案的核心实现思路就是进行两阶段聚合。第一次是局部聚合，先**给每个key都打上一个随机数**，比如10以内的随机数，此时原先一样的key就变成不一样的了，比如(hello, 1) (hello, 1) (hello, 1) (hello, 1)，就会变成(1_hello, 1) (1_hello, 1) (2_hello, 1) (2_hello, 1)。接着对打上随机数后的数据，执行reduceByKey等聚合操作，进行局部聚合，那么局部聚合结果，就会变成了(1_hello, 2) (2_hello, 2)。然后**将各个key的前缀给去掉**，就会变成(hello,2)(hello,2)，再次进行全局聚合操作，就可以得到最终结果了，比如(hello, 4)。

方案实现原理：将原本相同的key通过附加随机前缀的方式，变成多个不同的key，就可以让原本被一个task处理的数据分散到多个task上去做局部聚合，进而解决单个task处理数据量过多的问题。接着去除掉随机前缀，再次进行全局聚合，就可以得到最终的结果。具体原理见下图。

方案优点：对于聚合类的shuffle操作导致的数据倾斜，效果是非常不错的。通常都可以解决掉数据倾斜，或者至少是大幅度缓解数据倾斜，将Spark作业的性能提升数倍以上。

方案缺点：**仅仅适用于聚合类的shuffle操作，适用范围相对较窄**。如果是join类的shuffle操作，还得用其他的解决方案。

```scala
//案例
//  如果使用reduceByKey因为数据倾斜造成运行失败的问题。具体操作流程如下:
//    (1) 将原始的 key 转化为  随机值 + key  (随机值 = Random.nextInt)
//    (2) 对数据进行 reduceByKey(func)
//    (3) 将  随机值+key 转成 key
//    (4) 再对数据进行 reduceByKey(func)

object WordCountAggTest {
  def main(args: Array[String]): Unit = {
    val conf = new SparkConf().setMaster("local[2]").setAppName("WordCount")
    val sc = new SparkContext(conf)
    val array = Array("you you","you you","you you",
      "you you",
      "you you",
      "you you",
      "you you",
      "jump jump")
    val rdd = sc.parallelize(array,8)
    rdd.flatMap( line => line.split(" "))
      .map(word =>{
        val prefix = (new util.Random).nextInt(3)
        (prefix+"_"+word,1)
      }).reduceByKey(_+_)
       .map( wc =>{
         val newWord=wc._1.split("_")(1)
         val count=wc._2
         (newWord,count)
       }).reduceByKey(_+_)
      .foreach( wc =>{
        println("单词："+wc._1 + " 次数："+wc._2)
      })

  }
}
注：我们这儿使用的是reduceByKey天然的有调优的效果，如果这儿是groupBykey那么发生数据倾斜的概率就会更大，更严重。
```



##### 解决方案五：将reduce join转为map join

方案适用场景：在**对RDD使用join类操作，或者是在Spark SQL中使用join语句时，而且join操作中的一个RDD或表的数据量比较小**（比如几百M或者一两G），比较适用此方案。

方案实现思路：不使用join算子进行连接操作，而**使用Broadcast变量与map类算子实现join操作，进而完全规避掉shuffle类的操作**，彻底避免数据倾斜的发生和出现。将较小RDD中的数据直接通过collect算子拉取到Driver端的内存中来，然后对其创建一个Broadcast变量；接着对另外一个RDD执行map类算子，在算子函数内，从Broadcast变量中获取较小RDD的全量数据，与当前RDD的每一条数据按照连接key进行比对，如果连接key相同的话，那么就将两个RDD的数据用你需要的方式连接起来。

方案实现原理：普通的join是会走shuffle过程的，而一旦shuffle，就相当于会将相同key的数据拉取到一个shuffle read task中再进行join，此时就是reduce join。但是如果一个RDD是比较小的，则可以采用广播小RDD全量数据+map算子来实现与join同样的效果，也就是map join，此时就不会发生shuffle操作，也就不会发生数据倾斜。具体原理如下图所示。

方案优点：对join操作导致的数据倾斜，效果非常好，因为根本就不会发生shuffle，也就根本不会发生数据倾斜。

方案缺点：适用场景较少，因为这个方案**只适用于一个大表和一个小表的情况**。毕竟我们需要将小表进行广播，此时会比较消耗内存资源，driver和每个Executor内存中都会驻留一份小RDD的全量数据。如果我们广播出去的RDD数据比较大，比如10G以上，那么就可能发生内存溢出了。因此并不适合两个都是大表的情况。

![reduce joinz转换为map join ](spark.assets/reduce joinz转换为map join .png)

```scala
object MapJoinTest {
 
  def main(args: Array[String]): Unit = {
    val conf = new SparkConf().setMaster("local[2]").setAppName("WordCount")
    val sc = new SparkContext(conf)
    val lista=Array(
      Tuple2("001","令狐冲"),
      Tuple2("002","任盈盈")
    )
     //数据量小一点
    val listb=Array(
      Tuple2("001","一班"),
      Tuple2("002","二班")
    )
    val listaRDD = sc.parallelize(lista)
    val listbRDD = sc.parallelize(listb)
    //val result: RDD[(String, (String, String))] = listaRDD.join(listbRDD)
     //设置广播变量
    val listbBoradcast = sc.broadcast(listbRDD.collect())
    listaRDD.map(  tuple =>{
      val key = tuple._1
      val name = tuple._2
      val map = listbBoradcast.value.toMap
      val className = map.get(key)
      (key,(name,className))
    }).foreach( tuple =>{
      println("班级号"+tuple._1 + " 姓名："+tuple._2._1 + " 班级名："+tuple._2._2.get)
    })
  }
}
```



##### 解决方案六：采样倾斜key并分拆join操作

方案适用场景：两个RDD/Hive表进行join的时候，如果数据量都比较大，无法采用“解决方案五”，那么此时可以看一下两个RDD/Hive表中的key分布情况。**如果出现数据倾斜，是因为其中某一个RDD/Hive表中的少数几个key的数据量过大，而另一个RDD/Hive表中的所有key都分布比较均匀**，那么采用这个解决方案是比较合适的。

方案实现思路：
　　1、对包含少数几个数据量过大的key的那个RDD，通过sample算子采样出一份样本来，然后统计一下每个key的数量，**计算出来数据量最大的是哪几个key**。
　　2、然后将这几个key对应的数据从原来的RDD中拆分出来，形成一个单独的RDD，并给每个key都打上n以内的随机数作为前缀，而不会导致倾斜的大部分key形成另外一个RDD。
　　3、接着将需要join的另一个RDD，也过滤出来那几个倾斜key对应的数据并形成一个单独的RDD，将每条数据膨胀成n条数据，这n条数据都按顺序附加一个0~n的前缀，不会导致倾斜的大部分key也形成另外一个RDD。
　　4、再将附加了随机前缀的独立RDD与另一个膨胀n倍的独立RDD进行join，**此时就可以将原先相同的key打散成n份，分散到多个task中去进行join了。**
　　5、而另外两个普通的RDD就照常join即可。
　　6、最后将两次join的结果使用union算子合并起来即可，就是最终的join结果。

方案实现原理：对于join导致的数据倾斜，如果只是某几个key导致了倾斜，可以将少数几个key分拆成独立RDD，并附加随机前缀打散成n份去进行join，此时这几个key对应的数据就不会集中在少数几个task上，而是分散到多个task进行join了。

方案优点：对于join导致的数据倾斜，如果只是某几个key导致了倾斜，采用该方式可以用最有效的方式打散key进行join。而且只需要针对少数倾斜key对应的数据进行扩容n倍，不需要对全量数据进行扩容。避免了占用过多内存。

方案缺点：如果导致倾斜的key特别多的话，比如成千上万个key都导致数据倾斜，那么这种方式也不适合。

![随机前缀和扩容RDD](spark.assets/随机前缀和扩容RDD.png)



##### 解决方案七：使用随机前缀和扩容RDD进行join

方案适用场景：如果在进行join操作时，RDD中有大量的key导致数据倾斜，那么进行分拆key也没什么意义，此时就只能使用这一种方案来解决问题了。

方案实现思路：
　　1、该方案的实现思路基本和“解决方案六”类似，首先查看RDD/Hive表中的数据分布情况，找到那个造成数据倾斜的RDD/Hive表，比如有多个key都对应了超过1万条数据。
　　2、然后将该RDD的每条数据都打上一个n以内的随机前缀。
　　3、同时对另外一个正常的RDD进行扩容，将每条数据都扩容成n条数据，扩容出来的每条数据都依次打上一个0~n的前缀。
　　4、最后将两个处理后的RDD进行join即可。

方案实现原理：将原先一样的key通过附加随机前缀变成不一样的key，然后就可以将这些处理后的“不同key”分散到多个task中去处理，而不是让一个task处理大量的相同key。该方案与“解决方案六”的不同之处就在于，上一种方案是尽量只对少数倾斜key对应的数据进行特殊处理，由于处理过程需要扩容RDD，因此上一种方案扩容RDD后对内存的占用并不大；而这一种方案是针对有大量倾斜key的情况，没法将部分key拆分出来进行单独处理，因此只能对整个RDD进行数据扩容，对内存资源要求很高。

方案优点：对join类型的数据倾斜基本都可以处理，而且效果也相对比较显著，性能提升效果非常不错。

方案缺点：该方案更多的是缓解数据倾斜，而不是彻底避免数据倾斜。而且需要对整个RDD进行扩容，对内存资源要求很高。

方案实践经验：曾经开发一个数据需求的时候，发现一个join导致了数据倾斜。优化之前，作业的执行时间大约是60分钟左右；使用该方案优化之后，执行时间缩短到10分钟左右，性能提升了6倍。



##### 解决方案八：把上面的几种数据倾斜的解决方案综合的灵活运行

------------------------spark第三次课-------------------------------------



## RDD的依赖关系

##### 依赖类型

RDD根据依赖关系，可以分为父RDD和子RDD，父RDD就是被子RDD依赖的RDD。

而父RDD与子RDD的依赖关系，可以分为两种类型：

1. 窄依赖（narrow dependency）
2. 宽依赖（wide dependency）

##### 窄依赖

窄依赖：指的是每一个父RDD的Partition最多被子RDD的一个Partition使用，可比喻为独生子女。

map/flatMap/filter/union等算子操作都是窄依赖，所有的窄依赖不会产生shuffle

##### 宽依赖

宽依赖：指的是多个子RDD的Partition会依赖同一个父RDD的Partition，可比喻为超生。

reduceByKey/sortByKey/groupBy/groupByKey/join等算子操作都是宽依赖，所有的宽依赖会产生shuffle

##### 示意图

![image-20200417040624865](spark.assets/image-20200417040624865.png)

##### 补充说明

由上图可知，join分为宽依赖和窄依赖，如果RDD有相同的partitioner(本质是看分区函数或者分区逻辑是否相同），那么将不会引起shuffle，这种join是窄依赖，反之就是宽依赖。详情看下图：

![image-20200417042221150](spark.assets/image-20200417042221150.png)



## lineage（血统）理解即可

RDD只支持粗粒度转换：即只记录单个块上执行的单个操作。

那么，就需要创建RDD的一系列Lineage（即血统）记录下来，以便恢复丢失的分区。

RDD的Lineage会记录RDD的元数据信息和转换行为，lineage保存了RDD的依赖关系，当该RDD的部分分区数据丢失时，它可以根据这些信息来重新运算和恢复丢失的数据分区。

比如，下图中的rdd2的1号分区的数据丢失了，那么就可以根据血统lineage保存的RDD的依赖关系和转换行为等，将rdd1中的数据进行flatMap操作恢复丢失的数据。

![image-20200417042533244](spark.assets/image-20200417042533244.png)

## RDD的缓存机制（★★★★★)

#### 什么是rdd的缓存

spark可以把一个rdd的数据缓存起来，后续有其他的job需要用到该rdd的结果数据，可以直接从缓存中获取得到，避免了重复计算。缓存是加快后续对该数据的访问操作。

#### 如何对rdd设置缓存

可以通过persist方法或cache方法将前面的RDD的数据缓存。但这两个方法被调用时不会立即执行缓存操作，而是触发后面的action时，才将RDD缓存在计算节点的内存中，并供后面重用。

persist方法和cache方法的源代码如下，可以看到cache方法内调用了persist方法，persist方法的参数的默认值是StorageLevel.MEMORY_ONLY。

```scala
/**
   * Persist this RDD with the default storage level (`MEMORY_ONLY`).
   */
  def persist(): this.type = persist(StorageLevel.MEMORY_ONLY)

  /**
   * Persist this RDD with the default storage level (`MEMORY_ONLY`).
   */
  def cache(): this.type = persist()
```

StorageLevel的部分源码带，StorageLevel是一个object，里面定义了不同的变量来表示不同的存储级别。

1. NONE 不进行缓存
2. DISK_ONLY 缓存到磁盘    DISK_ONLY_2 缓存到磁盘,2份
3. MEMORY_ONLY 缓存到内存    MEMORY_ONLY_2 缓存到内存2份
4. MEMORY_ONLY_SER 序列化后缓存到内存  MEMORY_ONLY_SER_2 序列化后缓存到内存2份
5. MEMORY_AND_DISK  缓存到内存或磁盘 MEMORY_AND_DISK_2  缓存到内存或磁盘2份
6. MEMORY_AND_DISK_SER 缓存到内存或磁盘且序列化  MEMORY_AND_DISK_SER_2 ...
7. OFF_HEAP 缓存到堆外

注意：MEMORY_AND_DISK并不是把数据缓存一部分在内存中一部分在磁盘中，而是优先考虑内存，内存不够了才缓存到磁盘。

```scala
object StorageLevel {
  val NONE = new StorageLevel(false, false, false, false)
  val DISK_ONLY = new StorageLevel(true, false, false, false)
  val DISK_ONLY_2 = new StorageLevel(true, false, false, false, 2)
  val MEMORY_ONLY = new StorageLevel(false, true, false, true)
  val MEMORY_ONLY_2 = new StorageLevel(false, true, false, true, 2)
  val MEMORY_ONLY_SER = new StorageLevel(false, true, false, false)
  val MEMORY_ONLY_SER_2 = new StorageLevel(false, true, false, false, 2)
  val MEMORY_AND_DISK = new StorageLevel(true, true, false, true)
  val MEMORY_AND_DISK_2 = new StorageLevel(true, true, false, true, 2)
  val MEMORY_AND_DISK_SER = new StorageLevel(true, true, false, false)
  val MEMORY_AND_DISK_SER_2 = new StorageLevel(true, true, false, false, 2)
  val OFF_HEAP = new StorageLevel(true, true, true, false, 1)
```

#### cache和persist的使用示例

打开spark shell

```sh
spark-shell --master spark://node01:7077 --executor-memory 1g --total-executor-cores 2
```

登录8080端口的spark页面，找到spark shell对应的Application，点击Spark shell

<img src="spark.assets/image-20200417093437067.png" alt="image-20200417093437067" style="zoom:67%;" />

点击后，就进入了http://node01:4040/jobs/，然后切换到Storage



<img src="spark.assets/image-20200417093646386.png" alt="image-20200417093646386" style="zoom:67%;" />

往spark shell一行行执行下列代码，注意刷新观察Storage界面的变化。

```scala
val rdd1=sc.textFile("/words.txt")
val rdd2=rdd1.flatMap(_.split(" "))
val rdd3=rdd2.cache
rdd3.collect
```

执行完rdd3.collect后，页面才发生了变化，如下图，图中显示存储在内存中的大小为440.0B，磁盘为0：

![image-20200417094145627](spark.assets/image-20200417094145627.png)

继续执行下列代码：

```scala
val rdd4=rdd3.map((_,1))
val rdd5=rdd4.persist(org.apache.spark.storage.StorageLevel.DISK_ONLY)
rdd5.collect
```

执行rdd5.collect后，页面再次发生变化，如下图：

![image-20200417094636520](spark.assets/image-20200417094636520.png)



#### cache和persist的区别（**面试题**）

简述下如何对RDD设置缓存，以及它们的区别是什么？

对RDD设置缓存成可以调用rdd的2个方法： 一个是cache，一个是persist，调用这2个方法都可以对rdd的数据设置缓存，但不是立即就触发缓存执行，后面需要有action，才会触发缓存的执行。

cache方法和persist方法区别：

1. cache:   默认是把数据缓存在内存中，其本质就是调用persist方法；
2. persist：可以把数据缓存在内存或者是磁盘，有丰富的缓存级别，这些缓存级别都被定义在StorageLevel这个object中。



#### 什么时候需要设置缓存？

首先理解一个概念：transformation算子是延迟加载的，只有在触发action时才会被执行，job执行完之后，前面所有rdd的数据就都不存在了，如果没有action算子，各个rdd之间就只是一个转换

1、某个rdd的数据后期被使用了多次

![1569037915592](spark.assets/1569037915592-1587626129052.png)

如上图所示的计算逻辑： 

当第一次使用rdd2做相应的算子操作得到rdd3的时候，就会从rdd1开始计算，先读取HDFS上的文件，然后对rdd1 做对应的算子操作得到rdd2,再由rdd2计算之后得到rdd3。同样为了计算得到rdd4，前面的逻辑会被重新计算。

默认情况下多次对同一个rdd执行算子操作， rdd都会对这个rdd及之前的父rdd全部重新计算一次。 这种情况在实际开发代码的时候会经常遇到，但是我们一定要避免一个rdd重复计算多次，否则会导致性能急剧降低。   

因此，可以把多次使用到的rdd，也就是公共rdd进行持久化，避免后续需要，再次重新计算，提升效率。如下图，在设置了rdd2.cache或rdd2.persist后，得到rrd3时（假设rdd2-->rdd3是一个action），步骤还是HDFS-->rdd1-->rdd2-->rdd3，但是因为rdd3是rdd2经过action算子操作得到的，rrd2的数据得到缓存。

那么生成rdd4的时候，步骤就简单了很多，直接从缓存中获取数据，计算得到rdd4。

![image-20200417095850150](spark.assets/image-20200417095850150.png)

2、为了获取得到一个rdd的结果数据，经过了大量的算子操作或者是计算逻辑比较复杂,总之某个rdd的数据来之不易时，可以进行缓存：

~~~scala
val rdd2=rdd1.flatMap(函数).map(函数).reduceByKey(函数).xxx.xxx.xxx.xxx.xxx
~~~



#### 清除缓存数据

自动清除

~~~
一个application应用程序结束之后，对应的缓存数据也就自动清除
~~~

手动清除

~~~
调用rdd的unpersist方法
~~~

## RDD的checkpoint机制（★★★★★)  

#### checkpoint概念

我们可以对rdd的数据进行缓存，保存在内存或者是磁盘中。后续就可以直接从内存或者磁盘中获取得到，但是它们不是特别安全。

cache

它是直接把数据保存在内存中，后续操作起来速度比较快，直接从内存中获取得到。但这种方式很不安全，由于服务器挂掉或者是进程终止，会导致数据的丢失。

persist

它可以把数据保存在本地磁盘中，后续可以从磁盘中获取得到该数据，但它也不是特别安全，由于系统管理员一些误操作删除了，或者是磁盘损坏，也有可能导致数据的丢失。

checkpoint（检查点）

它是提供了一种相对而言更加可靠的数据持久化方式。它是把数据保存在分布式文件系统，比如HDFS上。这里就是利用了HDFS高可用性，高容错性（多副本）来最大程度保证数据的安全性。

#### 如何设置checkpoint

1、在hdfs上设置一个checkpoint目录

~~~scala
sc.setCheckpointDir("hdfs://node01:8020/checkpoint") 
~~~

2、对需要做checkpoint操作的rdd调用checkpoint方法

~~~scala
val rdd1=sc.textFile("/words.txt")
rdd1.checkpoint
val rdd2=rdd1.flatMap(_.split(" ")) 
~~~

3、最后需要有一个action操作去触发任务的运行

~~~scala
rdd2.collect
~~~

查看缓存中hdfs中的数据：

```sh
[hadoop@node01 ~]$ hdfs dfs -ls /checkpoint/e237e2bb-dc0e-47d9-851f-26687b0d7dbe/rdd-5
Found 2 items
-rw-r--r--   3 hadoop supergroup         53 2020-04-17 10:20 /checkpoint/e237e2bb-dc0e-47d9-851f-26687b0d7dbe/rdd-5/part-00000
-rw-r--r--   3 hadoop supergroup          4 2020-04-17 10:20 /checkpoint/e237e2bb-dc0e-47d9-851f-26687b0d7dbe/rdd-5/part-00001
```



#### cache、persist、checkpoint三者区别

cache和persist

* cache默认数据缓存在内存中
* persist可以把数据保存在内存或者磁盘中
* 后续要触发 cache 和 persist 持久化操作，需要有一个action操作
* 它不会开启其他新的任务，一个action操作就对应一个job 
* 它不会改变rdd的依赖关系，程序运行完成后对应的缓存数据就自动消失

checkpoint

* 可以把数据持久化写入到hdfs上
* 后续要触发checkpoint持久化操作，需要有一个action操作，****后续会开启新的job执行checkpoint操作****
* 它会改变rdd的依赖关系，后续数据丢失了不能够在通过血统进行数据的恢复。

* 程序运行完成后对应的checkpoint数据就不会消失

cache或persisit与checkpoint的结合使用：

```scala
   sc.setCheckpointDir("/checkpoint")
   val rdd1=sc.textFile("/words.txt")
   val rdd2=rdd1.cache
   rdd2.checkpoint
   val rdd3=rdd2.flatMap(_.split(" "))
   rdd3.collect
   
//对checkpoint在使用的时候进行优化，在调用checkpoint操作之前，可以先来做一个cache操作，缓存对应rdd的结果数据，后续就可以直接从cache中获取到rdd的数据写入到指定checkpoint目录中   
```

## DAG有向无环图生成

#### DAG是什么

**DAG(Directed Acyclic Graph)** 叫做有向无环图（有方向,无闭环,代表着数据的流向），原始的RDD通过一系列的转换就形成了DAG。

下图是基于单词统计逻辑得到的DAG有向无环图



![1569047954944](spark.assets/1569047954944-1587626129052.png)

## DAG划分stage（★★★★★)  

#### stage是什么

**一个Job会被拆分为多组Task，每组任务被称为一个stage**

stage表示不同的调度阶段，一个spark job会对应产生很多个stage

stage类型一共有2种

1. **ShuffleMapStage**

  * 最后一个shuffle之前的所有变换的Stage叫ShuffleMapStage
    * 它对应的task是shuffleMapTask

2. **ResultStage**

  * 最后一个shuffle之后操作的Stage叫ResultStage，它是最后一个Stage。
    * 它对应的task是ResultTask



#### 为什么要划分stage

根据RDD之间依赖关系的不同将DAG划分成不同的Stage(调度阶段)

- 对于窄依赖，partition的转换处理在一个Stage中完成计算
- 对于宽依赖，由于有Shuffle的存在，只能在parent RDD处理完成后，才能开始接下来的计算，

由于划分完stage之后，在同一个stage中只有窄依赖，没有宽依赖，可以实现流水线计算，
stage中的每一个分区对应一个task，在同一个stage中就有很多可以并行运行的task。



#### 如何划分stage

**划分stage的依据就是宽依赖**

划分流程：

(1) 首先根据rdd的算子操作顺序生成DAG有向无环图，接下里从最后一个rdd往前推，创建一个新的stage，把该rdd加入到该stage中，它是最后一个stage。

(2) 在往前推的过程中运行遇到了窄依赖就把该rdd加入到本stage中，如果遇到了宽依赖，就从宽依赖切开，那么最后一个stage也就结束了。

(3) 重新创建一个新的stage，按照第二个步骤继续往前推，一直到最开始的rdd，整个划分stage也就结束了

![划分stage](spark.assets/划分stage-1587626129053.png)



#### stage与stage之间的关系

划分完stage之后，每一个stage中有很多可以并行运行的task，后期把每一个stage中的task封装在一个taskSet集合中，最后把一个一个的taskSet集合提交到worker节点上的executor进程中运行。

rdd与rdd之间存在依赖关系，stage与stage之前也存在依赖关系，前面stage中的task先运行，运行完成了再运行后面stage中的task，也就是说后面stage中的task输入数据是前面stage中task的输出结果数据。

![stage](spark.assets/stage-1587626129053.png)



## spark的任务调度

![spark任务调度](spark.assets/spark任务调度-1587626129053.png)



~~~
(1) Driver端运行客户端的main方法，构建SparkContext对象，在SparkContext对象内部依次构建DAGScheduler和TaskScheduler

(2) 按照rdd的一系列操作顺序，来生成DAG有向无环图

(3) DAGScheduler拿到DAG有向无环图之后，按照宽依赖进行stage的划分。每一个stage内部有很多可以并行运行的task，最后封装在一个一个的taskSet集合中，然后把taskSet发送给TaskScheduler

(4) TaskScheduler得到taskSet集合之后，依次遍历取出每一个task提交到worker节点上的executor进程中运行。

(5) 所有task运行完成，整个任务也就结束了
~~~



## spark的运行架构

![spark](spark.assets/spark-1586935313986-1587626129053.png)

~~~
(1) Driver端向资源管理器Master发送注册和申请计算资源的请求

(2) Master通知对应的worker节点启动executor进程(计算资源)

(3) executor进程向Driver端发送注册并且申请task请求

(4) Driver端运行客户端的main方法，构建SparkContext对象，在SparkContext对象内部依次构建DAGScheduler和TaskScheduler

(5) 按照客户端代码洪rdd的一系列操作顺序，生成DAG有向无环图

(6) DAGScheduler拿到DAG有向无环图之后，按照宽依赖进行stage的划分。每一个stage内部有很多可以并行运行的task，最后封装在一个一个的taskSet集合中，然后把taskSet发送给TaskScheduler

(7) TaskScheduler得到taskSet集合之后，依次遍历取出每一个task提交到worker节点上的executor进程中运行

(8) 所有task运行完成，Driver端向Master发送注销请求，Master通知Worker关闭executor进程，Worker上的计算资源得到释放，最后整个任务也就结束了。
~~~



## 基于wordcount程序剖析spark任务的提交、划分、调度流程（★★★★★) 

![job-scheduler-running](spark.assets/job-scheduler-running-1587626129053.png)



## **面试题2**

1. reduceByKey和groupByKey的区别是什么？
2. 下面哪些操作是宽依赖  flatMap/map/filter/reduceByKey
3. 简述cache和persist的区别
4. 简述如何划分stage



## \=\=\=\=\=\=\=\=\=\**spark第四次课=\=\=\=\=\=\=\=\**

## sparksql概述

#### sparksql的前世今生

- Shark是专门针对于spark的构建大规模数据仓库系统的一个框架
- Shark与Hive兼容、同时也依赖于Spark版本
- Hivesql底层把sql解析成了mapreduce程序，Shark是把sql语句解析成了Spark任务
- 随着性能优化的上限，以及集成SQL的一些复杂的分析功能，发现Hive的MapReduce思想限制了Shark的发展。
- 最后Databricks公司终止对Shark的开发
  - 决定单独开发一个框架，不在依赖hive，把重点转移到了**sparksql**这个框架上。

#### 什么是sparksql 

Spark SQL is Apache Spark's module for working with structured data.

SparkSQL是apache Spark用来处理结构化数据的一个模块。

![1569468946521](spark.assets/1569468946521.png)



## sparksql的四大特性

#### 易整合

将SQL查询与Spark程序无缝混合

可以使用不同的语言进行代码开发

- java
- scala
- python
- R

![1569469087993](spark.assets/1569469087993.png)

#### 统一的数据源访问

以相同的方式连接到任何数据源，sparksql后期可以采用一种统一的方式去对接任意的外部数据源，不需要使用不同的Api

~~~scala
val  dataFrame = sparkSession.read.文件格式的方法名("该文件格式的路径")
~~~

![1569469225309](spark.assets/1569469225309.png)

#### 兼容hive

sparksql可以支持hivesql这种语法  sparksql兼容hivesql

![1569469413038](spark.assets/1569469413038.png)

#### 支持标准的数据库连接

sparksql支持标准的数据库连接JDBC或者ODBC

![1569469446641](spark.assets/1569469446641.png)

## DataFrame概述

spark core--->操控RDD

spark sql--->操控DataFrame

##### DataFrame发展

DataFrame前身是schemaRDD,这个schemaRDD是直接继承自RDD，它是RDD的一个实现类

在spark1.3.0之后把schemaRDD改名为DataFrame,它不再继承自RDD，而是自己实现RDD上的一些功能

也可以把dataFrame转换成一个rdd，调用rdd方法即可转换成功，例如 val rdd1=dataFrame.rdd

##### DataFrame是什么

在Spark中，DataFrame是一种**以RDD为基础的分布式数据集**，类似于**传统数据库的二维表格**

DataFrame带有**Schema元信息**，即DataFrame所表示的二维表数据集的每一列都带有名称和类型，但底层做了更多的优化

DataFrame可以从很多数据源构建，比如：已经存在的RDD、结构化文件、外部数据库、Hive表。

RDD可以把它内部元素看成是一个java对象

DataFrame可以把内部元素看成是一个Row对象，它表示一行一行的数据，每一行是固定的数据类型

可以把DataFrame这样去理解----->RDD+schema元信息, dataFrame相比于rdd来说，多了对数据的描述信息（schema元信息）



![1569492382924](spark.assets/1569492382924.png)

![image-20200617193824609](spark.assets/image-20200617193824609.png)

## DataFrame和RDD的优缺点

#### RDD优点

1、编译时类型安全，开发会进行类型检查，在编译的时候及时发现错误

2、具有面向对象编程的风格

#### RDD缺点

1、构建大量的java对象占用了大量heap堆空间，导致频繁的垃圾回收GC。 :RDD[Java对象]

```
由于数据集RDD它的数据量比较大，后期都需要存储在heap堆中，这里有heap堆中的内存空间有限，出现频繁的垃圾回收（GC），程序在进行垃圾回收的过程中，所有的任务都是暂停。影响程序执行的效率
```

2、数据的序列化和反序列性能开销很大

```
  在分布式程序中，对象(对象的内容和结构)是先进行序列化，发送到其他服务器，进行大量的网络传输，然后接受到这些序列化的数据之后，再进行反序列化来恢复该对象
```

#### DataFrame优点

DataFrame引入了schema元信息和off-heap(堆外)

1、DataFrame引入off-heap，大量的对象构建直接使用操作系统层面上的内存，不再使用heap堆中的内存，这样一来heap堆中的内存空间就比较充足，不会导致频繁GC，程序的运行效率比较高，它是解决了RDD构建大量的java对象占用了大量heap堆空间，导致频繁的GC这个缺点。

![image-20200417135339845](spark.assets/image-20200417135339845.png)

2、DataFrame引入了schema元信息---就是数据结构的描述信息，后期spark程序中的大量对象在进行网络传输的时候，只需要把数据的内容本身进行序列化就可以，数据结构信息可以省略掉。这样一来数据网络传输的数据量是有所减少，数据的序列化和反序列性能开销就不是很大了。它是解决了RDD数据的序列化和反序列性能开销很大这个缺点

#### DataFrame缺点

DataFrame引入了schema元信息和off-heap(堆外)它是分别解决了RDD的缺点，同时它也丢失了RDD的优点

1、编译时类型不安全

- 编译时不会进行类型的检查，这里也就意味着前期是无法在编译的时候发现错误，只有在运行的时候才会发现

2、不再具有面向对象编程的风格

## 读取文件构建DataFrame

##### Spark context与Spark session的关系

在spark2.0之前，要操控rdd就要构建spark context对象，要使用sparksql就要构建sqlcontext对象，要使用hive表就要构建hivecontext对象。

在spark2.0之后，人们觉得这样太麻烦，就出现了spark session,spark session封装了上面的3个对象。

那么，spark2.0之后，就可通过spark session来构建spark context、sql context...

```scala
scala> sc
res0: org.apache.spark.SparkContext = org.apache.spark.SparkContext@5fdb7394

scala> spark
res1: org.apache.spark.sql.SparkSession = org.apache.spark.sql.SparkSession@52285a5f

scala> spark.   //下面是spark封装的东西
baseRelationToDataFrame   close   createDataFrame   emptyDataFrame   experimental   listenerManager   range   readStream     sharedState    sql          stop      table   udf    catalog        conf    createDataset     emptyDataset     implicits  newSession   read    sessionState   sparkContext   sqlContext   streams   time    version   

scala> spark.sparkContext   
res2: org.apache.spark.SparkContext = org.apache.spark.SparkContext@5fdb7394

scala> spark.sparkContext.parallelize(List(1,2,3))  //使用spark封装的sparkContext
res3: org.apache.spark.rdd.RDD[Int] = ParallelCollectionRDD[0] at parallelize at <console>:24
```

![image-20200417140545035](spark.assets/image-20200417140545035.png)

##### 读取文本文件创建DataFrame

创建文本文件：

```
vi /tmp/person.txt
1 zhangsan 20
2 lisi 32
3 laowang 46

hdfs dfs -put /tmp/person.txt /
```

第一种方式，从结果可以看到DataFrame默认使用一个string类型的value列

```scala
scala> val personDF=spark.read.text("/person.txt")
personDF: org.apache.spark.sql.DataFrame = [value: string]

//打印schema信息
scala> personDF.printSchema
root
 |-- value: string (nullable = true)

//展示数据
scala> personDF.show
+-------------+                                                                 
|        value|
+-------------+
|1 zhangsan 20|
|    2 lisi 32|
| 3 laowang 46|
+-------------+
```

第二种方式

```scala
//加载数据
val rdd1=sc.textFile("/person.txt").map(x=>x.split(" "))
//定义一个样例类
case class Person(id:String,name:String,age:Int)
//把rdd与样例类进行关联
val personRDD=rdd1.map(x=>Person(x(0),x(1),x(2).toInt))
//把rdd转换成DataFrame
val personDF=personRDD.toDF

//打印schema信息
personDF.printSchema

//展示数据
personDF.show
```

##### 读取json文件创建DataFrame

```sh
hdfs dfs -put /kkb/install/spark/examples/src/main/resources/people.json /
{"name":"Michael"}
{"name":"Andy", "age":30}
{"name":"Justin", "age":19}
```

```scala
scala> val peopleDF=spark.read.json("/people.json")
peopleDF: org.apache.spark.sql.DataFrame = [age: bigint, name: string]          

scala> peopleDF.printSchema
root
 |-- age: long (nullable = true)
 |-- name: string (nullable = true)


scala> peopleDF.show
+----+-------+
| age|   name|
+----+-------+
|null|Michael|
|  30|   Andy|
|  19| Justin|
+----+-------+
```

##### 读取parquet文件创建DataFrame

```
hdfs dfs -put /kkb/install/spark/examples/src/main/resources/users.parquet /
```



```scala
scala> val parquetDF=spark.read.parquet("/users.parquet")
parquetDF: org.apache.spark.sql.DataFrame = [name: string, favorite_color: string ... 1 more field]

scala> parquetDF.printSchema
root
 |-- name: string (nullable = true)
 |-- favorite_color: string (nullable = true)
 |-- favorite_numbers: array (nullable = true)  //数组类型
 |    |-- element: integer (containsNull = true)  //数组元素的类型


scala> parquetDF.show
+------+--------------+----------------+                                        
|  name|favorite_color|favorite_numbers|
+------+--------------+----------------+
|Alyssa|          null|  [3, 9, 15, 20]|
|   Ben|           red|              []|
+------+--------------+----------------+
```



## DataFrame常用操作

#### DSL风格语法

就是sparksql中的DataFrame自身提供了一套自己的Api，可以去使用这套api来做相应的处理。

创建DataFrame

```scala
scala> val rdd1=sc.textFile("/person.txt").map(x=>x.split(" "))
rdd1: org.apache.spark.rdd.RDD[Array[String]] = MapPartitionsRDD[20] at map at <console>:24   //每一行切分而成的多个元素被封装成一个Array,作为RDD的类型

scala> case class Person(id:String,name:String,age:Int)
defined class Person  //创建一个样例类

scala> val PersonRDD=rdd1.map(x=>Person(x(0),x(1),x(2).toInt))
PersonRDD: org.apache.spark.rdd.RDD[Person] = MapPartitionsRDD[21] at map at <console>:27   //将rdd1的每一个Array类型转为一个Person对象


scala> val PersonDF=PersonRDD.toDF  //将RDD转为DataFrame
PersonDF: org.apache.spark.sql.DataFrame = [id: string, name: string ... 1 more field]

scala> PersonDF.printSchema
root
 |-- id: string (nullable = true)
 |-- name: string (nullable = true)
 |-- age: integer (nullable = false)


scala> PersonDF.show
+---+--------+---+                                                              
| id|    name|age|
+---+--------+---+
|  1|zhangsan| 20|
|  2|    lisi| 32|
|  3| laowang| 46|
+---+--------+---+
```

DataFrame.select()操作,select操作返回的还是一个DataFrame类型

```scala
scala> PersonDF.select("name")
res12: org.apache.spark.sql.DataFrame = [name: string]

scala> PersonDF.select("name").show
+--------+
|    name|
+--------+
|zhangsan|
|    lisi|
| laowang|
+--------+

scala> PersonDF.select($"name").show
+--------+
|    name|
+--------+
|zhangsan|
|    lisi|
| laowang|
+--------+


scala> PersonDF.select(col("name")).show
+--------+
|    name|
+--------+
|zhangsan|
|    lisi|
| laowang|
+--------+


scala> PersonDF.select("name","age").show
+--------+---+
|    name|age|
+--------+---+
|zhangsan| 20|
|    lisi| 32|
| laowang| 46|
+--------+---+


scala> PersonDF.select($"name",$"age",$"age"+1).show   //age+1
+--------+---+---------+
|    name|age|(age + 1)|
+--------+---+---------+
|zhangsan| 20|       21|
|    lisi| 32|       33|
| laowang| 46|       47|
+--------+---+---------+
```

DataFrame.filter()操作：

```scala
scala> PersonDF.filter($"age">30).show
+---+-------+---+
| id|   name|age|
+---+-------+---+
|  2|   lisi| 32|
|  3|laowang| 46|
+---+-------+---+
```

#### SQL风格语法（推荐）

可以把DataFrame注册成一张表，然后通过**sparkSession.sql(sql语句)**操作

```scala
//DataFrame注册成表
personDF.createTempView("Person")

//使用SparkSession调用sql方法统计查询
scala> spark.sql("select * from Person").show
+---+--------+---+
| id|    name|age|
+---+--------+---+
|  1|zhangsan| 20|
|  2|    lisi| 32|
|  3| laowang| 46|
+---+--------+---+

spark.sql("select name from person").show
spark.sql("select name,age from person").show
spark.sql("select * from person where age >30").show
spark.sql("select count(*) from person where age >30").show
spark.sql("select age,count(*) from person group by age").show
spark.sql("select age,count(*) as count from person group by age").show
spark.sql("select * from person order by age desc").show
```

## DataSet概述

##### DataSet是什么

DataSet是分布式的数据集合，Dataset提供了强类型支持，也是在RDD的每行数据加了类型约束。

强类型：所属类型必须在编译时确定。

DataSet是在Spark1.6中添加的新的接口。它集中了RDD的优点（**强类型和可以用强大lambda函数**）以及使用了Spark SQL优化的执行引擎。

##### RDD、DataFrame、DataSet的区别

假设RDD中的两行数据长这样

![1569492571159](spark.assets/1569492571159.png)



那么DataFrame中的数据长这样

![1569492595941](spark.assets/1569492595941.png)



Dataset中的数据长这样

![1569492595941](spark.assets/1569492595941.png)

或者长这样（每行数据是个Object）

![1569492637053](spark.assets/1569492637053.png)



DataSet包含了DataFrame的功能，Spark2.0中两者统一，DataFrame表示为DataSet[Row]，即DataSet的子集。

1. DataSet可以在编译时检查类型
2. 并且是面向对象的编程接口

##### DataSet与DataFrame源码分析

我们来查看以下DataSet与DataFrame的源码，进入IDEA，添加以下pom依赖：

```xml
        <dependency>
            <groupId>org.apache.spark</groupId>
            <artifactId>spark-sql_2.11</artifactId>
            <version>2.3.3</version>
        </dependency>
```

按住ctrl+N,搜索DataFrame类，发现搜索不到，搜索DataSet类，成功。download source。

发现DataSet的源码包含以下代码：

```scala
def toDF(): DataFrame = new Dataset[Row](sparkSession, queryExecution, RowEncoder(schema))
```

toDF()方法是一个返回值类型为DataFrame，点击查看该DataFrame的源码，如下，发现DataFrame类型就是一个Dataset[Row]类型。这就是DataFrame表示为DataSet[Row]，即DataSet的子集的原因。

```scala
package object sql {
  @DeveloperApi
  @InterfaceStability.Unstable
  type Strategy = SparkStrategy

  type DataFrame = Dataset[Row]
}
```

##### DataFrame与DataSet互相转换

把一个DataFrame转换成DataSet

```scala
val dataSet=dataFrame.as[强类型]
```

把一个DataSet转换成DataFrame

```scala
val dataFrame=dataSet.toDF
```

补充说明: 可以从dataFrame和dataSet获取得到rdd

```scala
val rdd1=dataFrame.rdd

val rdd2=dataSet.rdd
```

转换示例：

```scala
scala> val df=spark.read.text("/person.txt")
df: org.apache.spark.sql.DataFrame = [value: string]

scala> df.show
+-------------+                                                                 
|        value|
+-------------+
|1 zhangsan 20|
|    2 lisi 32|
| 3 laowang 46|
+-------------+


scala> val ds=df.as[String]
ds: org.apache.spark.sql.Dataset[String] = [value: string]

scala> ds.show
+-------------+                                                                 
|        value|
+-------------+
|1 zhangsan 20|
|    2 lisi 32|
| 3 laowang 46|
+-------------+
```



## 构建DataSet

##### 1、通过sparkSession调用createDataset方法

```scala
scala> val ds=spark.createDataset(1 to 10)
ds: org.apache.spark.sql.Dataset[Int] = [value: int]

scala> ds.show
+-----+
|value|
+-----+
|    1|
|    2|
|    3|
|    4|
|    5|
|    6|
|    7|
|    8|
|    9|
|   10|
+-----+

scala> val ds=spark.createDataset(sc.textFile("/person.txt"))
ds: org.apache.spark.sql.Dataset[String] = [value: string]

scala> ds.show
+-------------+
|        value|
+-------------+
|1 zhangsan 20|
|    2 lisi 32|
| 3 laowang 46|
+-------------+
```

##### 2、使用scala集合和rdd调用toDS方法

```scala
scala> val ds=sc.textFile("/person.txt").toDS
ds: org.apache.spark.sql.Dataset[String] = [value: string]

scala> ds.show
+-------------+
|        value|
+-------------+
|1 zhangsan 20|
|    2 lisi 32|
| 3 laowang 46|
+-------------+


scala> List(1,2,4).toDS
res20: org.apache.spark.sql.Dataset[Int] = [value: int]

scala> List(1,2,4).toDS.show
+-----+
|value|
+-----+
|    1|
|    2|
|    4|
+-----+
```

##### 3、把一个DataFrame转换成DataSet

```scala
scala> case class Person(name:String,age:Long)
defined class Person

scala> val peopleDS=spark.read.json("/people.json").as[Person]
peopleDS: org.apache.spark.sql.Dataset[Person] = [age: bigint, name: string]

scala> peopleDS
res13: org.apache.spark.sql.Dataset[Person] = [age: bigint, name: string]

scala> peopleDS.show
+----+-------+
| age|   name|
+----+-------+
|null|Michael|
|  30|   Andy|
|  19| Justin|
+----+-------+
```

##### 4、通过一个DataSet转换生成一个新的DataSet

```scala
scala>  List(1,2,3,4,5).toDS.map(x=>x*10)
res22: org.apache.spark.sql.Dataset[Int] = [value: int]

scala>  List(1,2,3,4,5).toDS.map(x=>x*10).show
+-----+
|value|
+-----+
|   10|
|   20|
|   30|
|   40|
|   50|
+-----+
```



## 通过IDEA开发程序实现把RDD转换DataFrame

##### 官网学习如何创建spark sql Scala程序

![image-20200417205422106](spark.assets/image-20200417205422106.png)

##### 添加依赖

```xml
        <dependency>
            <groupId>org.apache.spark</groupId>
            <artifactId>spark-sql_2.11</artifactId>
            <version>2.3.3</version>
        </dependency>
```

##### 方法1：利用反射机制

定义一个样例类，后期直接映射成DataFrame的schema信息。

case class Person(id:String,name:String,age:Int)

适用场景：在开发代码之前，可以先确定好DataFrame的schema元信息

```scala
import org.apache.spark.rdd.RDD
import org.apache.spark.sql.{Column, SparkSession}

case class Person(id:String,name:String,age:Int)
object SparkSqlDemo {
  def main(args: Array[String]): Unit = {
    //1、创建SparkSession
    val spark=SparkSession.builder().appName("SparkSqlDemo1").master("local[2]").getOrCreate()
    val sc=spark.sparkContext

    val data:RDD[Array[String]]=sc.textFile("F:\\test\\person.txt").map(x=>x.split(" "))
    //将样例类与RDD关联,即RDD[Array[String]]---->RDD[Person]
    val personRDD:RDD[Person]=data.map(x=>Person(x(0),x(1),x(2).toInt))

    //将RDD转为DataFrame
    //RDD本身是没有toDF方法的,要导入隐式转换(详细参考scala.md)
    import spark.implicits._
    val personDF=personRDD.toDF()
    personDF.printSchema()
    personDF.show()

    val firstRow=personDF.first() //获取第一行数据
    println("firstRow: "+firstRow)
    val top2=personDF.head(2) //获取前2位数据
    top2.foreach(println)

    //获取name字段
    personDF.select("name").show()
    personDF.select($"name").show()
    personDF.select(new Column("name")).show()
    personDF.select("name","age").show()

    personDF.select($"name",$"age",$"age"+1).show()

    //按照age过滤
    personDF.filter($"age" >30).show()
    val count: Long = personDF.filter($"age" >30).count()
    println("count:"+count)

    //分组
    personDF.groupBy("age").count().show()

    personDF.show()
    personDF.foreach(row => println(row))

    //使用foreach获取每一个row对象中的name字段
    personDF.foreach(row =>println(row.getAs[String]("name")))
    personDF.foreach(row =>println(row.get(1)))
    personDF.foreach(row =>println(row.getString(1)))
    personDF.foreach(row =>println(row.getAs[String](1)))
    //todo：----------------- DSL风格语法--------------------end


    //todo：----------------- SQL风格语法-----------------start
    personDF.createTempView("person")
    //使用SparkSession调用sql方法统计查询
    spark.sql("select * from person").show
    spark.sql("select name from person").show
    spark.sql("select name,age from person").show
    spark.sql("select * from person where age >30").show
    spark.sql("select count(*) from person where age >30").show
    spark.sql("select age,count(*) from person group by age").show
    spark.sql("select age,count(*) as count from person group by age").show
    spark.sql("select * from person order by age desc").show
    //todo：----------------- SQL风格语法----------------------end

    //关闭sparkSession对象
    spark.stop()
  }
}

```



##### 方法2：通过StructType动态指定Schema

该方法的应用场景：在开发代码之前，无法确定需要的DataFrame对应的schema元信息，需要在开发代码的过程中动态指定。

```scala
import org.apache.spark.rdd.RDD
import org.apache.spark.sql.types.{IntegerType, StringType, StructField, StructType}
import org.apache.spark.sql.{Row, SparkSession}

object StructTypeDemo {
  def main(args: Array[String]): Unit = {
    val spark=SparkSession.builder().appName("Demo").master("local[2]").getOrCreate()
    val sc=spark.sparkContext
    sc.setLogLevel("warn")

    val data:RDD[Array[String]]=sc.textFile("F:\\test\\person.txt").map(x=>x.split(" "))
    //使用Row包装一行数据，Row可以封装任意类型任意数目的数据
    val rowRDD:RDD[Row]=data.map(x=>Row(x(0),x(1),x(2).toInt))
    val schema=StructType(
        StructField("id",StringType)::
        StructField("name",StringType)::
        StructField("age",IntegerType)::Nil
    )
    val personDF=spark.createDataFrame(rowRDD,schema)

    personDF.printSchema()
    personDF.show()

    personDF.createTempView("user")
    spark.sql("select * from user").show()

    spark.stop()
  }
}
```

说明：

1. 因为后面要使用spark.createDataFrame(rowRDD:RDD[Row],schema:StructType)来创建DataFrame，所以要想创建RDD[Row]和StructType类型的变量

![image-20200418031619386](spark.assets/image-20200418031619386.png)

1. Row类有伴生对象object Row,伴生对象里有apply方法，该apply方法的参数是Any*,所以创建Row对象时不需要new,参数也可以多种类型和多个，Row(x(0),x(1),x(2).toInt)

2. StructType的参数类型是：

   ![image-20200418031038117](spark.assets/image-20200418031038117.png)

3. StructField是一个样例类，源代码大致如下：

```scala
case class StructField(
    name: String,   //名称
    dataType: DataType,  //数据类型
    nullable: Boolean = true,   //表示是否允许该值为空
    metadata: Metadata = Metadata.empty) {...}
```



## sparksql 操作hivesql

添加依赖

```xml
        <dependency>
            <groupId>org.apache.spark</groupId>
            <artifactId>spark-hive_2.11</artifactId>
            <version>2.3.3</version>
        </dependency>
```

person.txt

```
1 zhangsan 43
2 lisi 21
3 laowang 47
```

Demo1.scala

```scala
import org.apache.spark.sql.SparkSession

object Demo1 {
  def main(args: Array[String]): Unit = {
    //注意：要开启对hive的支持：.enableHiveSupport()
    val spark=SparkSession.builder().appName("spark sql control hive sql").master("local[2]").enableHiveSupport().getOrCreate()
    val sc=spark.sparkContext
    sc.setLogLevel("Warn")

    spark.sql(
      """
        |create table if not exists person(id string,name string,age int)
        |row format delimited fields terminated by " "
        |""".stripMargin)    //stripMargin的作用是将 | 变成空格
      
    spark.sql("load data local inpath 'file:///F:/test/person.txt' into table person")
    spark.sql("select * from person").show()

    spark.stop()
  }
}
```

运行结果为：

```scala
+---+--------+---+
| id|    name|age|
+---+--------+---+
|  1|zhangsan| 43|
|  2|    lisi| 21|
|  3| laowang| 47|
+---+--------+---+
```

说明：

1. 文件的路径一定要加上file:///，否则会报错
2. 运行成功后，会在当前project的根目录下创建两个目录：metastore_db和spark-warehouse
3. metastore_db用于存放刚才在本地创建的表的元数据，spark-warehouse用于保存表的数据

<img src="spark.assets/image-20200418154332266.png" alt="image-20200418154332266" style="zoom: 80%;" />



## spark sql 操作JDBC数据源(★★★★★)

spark sql可以通过 JDBC 从关系型数据库中读取数据的方式创建DataFrame，通过对DataFrame一系列的计算后，还可以将数据再写回关系型数据库中

##### 通过sparksql加载mysql表中的数据

在node03创建表，准备数据

```sql
mysql> create database spark;
mysql> use spark;
mysql> create table user(id int,name varchar(15),age int);
mysql> insert into user(id,name,age) values(1,'krystal',21),(2,'jimmy',22);
mysql> select * from user;
+------+---------+------+
| id   | name    | age  |
+------+---------+------+
|    1 | krystal |   21 |
|    2 | jimmy   |   22 |
+------+---------+------+
2 rows in set (0.11 sec)
```

添加mysql连接驱动jar包

```xml
<dependency>
	<groupId>mysql</groupId>
	<artifactId>mysql-connector-java</artifactId>
	<version>5.1.38</version>
</dependency>
```

开发代码：

```scala
import java.util.Properties

import org.apache.spark.sql.{DataFrame, SparkSession}

object Demo2 {
  def main(args: Array[String]): Unit = {
    val spark=SparkSession.builder().appName("demo").master("local[2]").getOrCreate()

    val url="jdbc:mysql://node03:3306/spark"
    val tableName="user"
    val properties=new Properties()
    properties.setProperty("user","root")
    properties.setProperty("password","123456")

    val mysqlDF:DataFrame=spark.read.jdbc(url,tableName,properties)
    mysqlDF.printSchema()
    mysqlDF.show()

    mysqlDF.createTempView("user")
    spark.sql("select * from user")

    spark.stop()
  }
}

```

运行结果为：

```scala
root
 |-- id: integer (nullable = true)
 |-- name: string (nullable = true)
 |-- age: integer (nullable = true)
 
 +---+-------+---+
| id|   name|age|
+---+-------+---+
|  1|krystal| 21|
|  2|  jimmy| 22|
+---+-------+---+
```



##### 通过sparksql保存结果数据到mysql表中(本地)

继续往user表插入数据：

```sql
mysql> use spark
mysql> insert into user(id,name,age) values(3,'zhangsan',34),(4,'lisi',46);
mysql> select * from user;
+------+----------+------+
| id   | name     | age  |
+------+----------+------+
|    1 | krystal  |   21 |
|    2 | jimmy    |   22 |
|    3 | zhangsan |   34 |
|    4 | lisi     |   46 |
+------+----------+------+
4 rows in set (0.00 sec)
```

代码开发(本地运行)

```scala
import java.util.Properties

import org.apache.spark.sql.{DataFrame, SparkSession}

object Demo2 {
  def main(args: Array[String]): Unit = {
    val spark=SparkSession.builder().appName("demo").master("local[2]").getOrCreate()

    val url="jdbc:mysql://node03:3306/spark"
    val tableName="user"
    val properties=new Properties()
    properties.setProperty("user","root")
    properties.setProperty("password","123456")

    val mysqlDF:DataFrame=spark.read.jdbc(url,tableName,properties)
    mysqlDF.createTempView("user")
    val resultDF:DataFrame=spark.sql("select * from user where age > 30")

    resultDF.write.mode("append").jdbc(url,"user2",properties)

    spark.stop()
  }
}

```

查询user2表：

```sql
mysql> select * from user2;
+------+----------+------+
| id   | name     | age  |
+------+----------+------+
|    3 | zhangsan |   34 |
|    4 | lisi     |   46 |
+------+----------+------+
```

说明：

1. resultDF.wirte.mode("...")的参数有四种，mode用来指定数据的插入模式。
       //overwrite: 表示覆盖，如果表不存在，事先帮我们创建
       //append   :表示追加， 如果表不存在，事先帮我们创建
       //ignore   :表示忽略，如果表事先存在，就不进行任何操作
       //error    :如果表事先存在就报错（默认选项）
2. 将数据处理后保存到MySQL中，还可以使用rdd方法，详情查看spqrk.md
3. 如果要将本地运行改成打jar包到集群运行，只需要修改2个地方：
   1. 删掉.master()
   2. 将resultDF.write.mDFode(args(0)).jdbc()的第2个参数设为args(1)

##### 通过sparksql保存结果数据到mysql表中(集群)

```scala
import java.util.Properties

import org.apache.spark.sql.{DataFrame, SparkSession}

object Demo2 {
  def main(args: Array[String]): Unit = {
    val spark=SparkSession.builder().appName("demo").getOrCreate()

    val url="jdbc:mysql://node03:3306/spark"
    val tableName="user"
    val properties=new Properties()
    properties.setProperty("user","root")
    properties.setProperty("password","123456")

    val mysqlDF:DataFrame=spark.read.jdbc(url,tableName,properties)
    mysqlDF.createTempView("user")
    val resultDF:DataFrame=spark.sql("select * from user where age > 30")

    resultDF.write.mode("append").jdbc(url,args(1),properties)

    spark.stop()
  }
}

```

提交任务脚本

```shell
spark-submit \
--master spark://node01:7077 \
--class com.kaikeba.sql.Data2Mysql \
--executor-memory 1g \
--total-executor-cores 4 \
--driver-class-path /home/hadoop/jars/mysql-connector-java-5.1.38.jar \
--jars /home/hadoop/jars/mysql-connector-java-5.1.38.jar \
original-spark_class05-1.0-SNAPSHOT.jar \
append  t_kaikeba


--driver-class-path：指定一个Driver端所需要的额外jar
--jars ：指定executor端所需要的额外jar
```

## sparksql 保存数据到不同类型文件

创建F:\\test\\score.json文件：

```json
{"name":"zhangsan1","classNum":"10","score":90}
{"name":"zhangsan11","classNum":"10","score":90}
{"name":"zhangsan2","classNum":"10","score":80}
{"name":"zhangsan3","classNum":"10","score":95}
{"name":"zhangsan4","classNum":"20","score":90}
{"name":"zhangsan5","classNum":"20","score":91}
{"name":"zhangsan6","classNum":"20","score":86}
{"name":"zhangsan7","classNum":"20","score":78}
{"name":"zhangsan8","classNum":"30","score":60}
{"name":"zhangsan9","classNum":"30","score":88}
{"name":"zhangsan10","classNum":"30","score":95}
```

代码开发：

```scala
import java.util.Properties

import org.apache.spark.sql.{DataFrame, SparkSession}

object Demo3 {
  def main(args: Array[String]): Unit = {
    val spark=SparkSession.builder().appName("demo").master("local[2]")getOrCreate()
    val dataDF:DataFrame=spark.read.json("file:///F:/test/score.json")

    //处理数据：
    dataDF.createTempView("tableDemo")
    val result=spark.sql("select * from tableDemo where score > 80")

    //保存数据：
    result.write.json("file:///F:/test/out_json")
    result.write.parquet("file:///F:/test/out_parquet")
    result.write.save("file:///F:/test/out_save")
    result.write.csv("file:///F:/test/out_csv")
    result.write.saveAsTable("t1")
    result.write.partitionBy("classNum").json("file:///F:/test/out_partition_json")
    result.write.partitionBy("classNum","name").json("file:///F:/test/out_partition2_json")

    spark.stop()
  }
}
```

说明：

1. out_xxx等都是目录来的，而且是由程序来创建，不需要事先创建，否则报错
2. write.save()默认保存为parquet格式
3. 经过partitionBy分区后保存的数据文件如下：

<img src="spark.assets/image-20200418172427804.png" alt="image-20200418172427804" style="zoom:80%;" />

1. result.write.saveAsTable("t1")保存表t1在spark-warehouse目录下：

![image-20200418172519068](spark.assets/image-20200418172519068.png)



## sparksql中自定义函数(★★★★★)

创建文件F:/test/test_udf.txt

```
hello
Hadoop
DataFrame
spark
```

自定义UDF函数

代码开发

```scala
import org.apache.spark.sql.api.java.UDF1
import org.apache.spark.sql.types.StringType
import org.apache.spark.sql.{DataFrame, SparkSession}

object Demo3 {
  def main(args: Array[String]): Unit = {
    val spark=SparkSession.builder().appName("demo").master("local[2]")getOrCreate()
    val dataDF:DataFrame=spark.read.text("file:///F:/test/test_udf.txt")

    dataDF.createTempView("udfTest")

    //自定义函数方法1:小写--》大写
    spark.udf.register("low2Up",new UDF1[String,String] {
      override def call(t1: String): String = return t1.toUpperCase()
    },StringType)

    //自定义函数方法2：大写--》小写
    spark.udf.register("up2Low",(x:String)=>x.toLowerCase())

    spark.sql("select value from udfTest").show()
    spark.sql("select low2Up(value) from udfTest").show()
    spark.sql("select up2Low(value) from udfTest").show()

    spark.stop()
  }
}

```

运行结果为：

```scala
+-----------------+
|UDF:low2Up(value)|
+-----------------+
|            HELLO|
|           HADOOP|
|        DATAFRAME|
|            SPARK|
+-----------------+

+-----------------+
|UDF:up2Low(value)|
+-----------------+
|            hello|
|           hadoop|
|        dataframe|
|            spark|
+-----------------+
```

说明：

1. udf.register()支持的参数如下, (函数名称，函数，返回值类型) ，通过该方法，我们可以自定义函数

![image-20200418173539916](spark.assets/image-20200418173539916.png)

1. 使用UDF1接口可以自定义1个输入参数的函数，UDF2接口可以自定义2个输入参数的函数，UDF3接口可以自定义3个输入参数的函数，依次类推....
2. new UDF1[String,String]的第一个参数是要定义的函数的输入参数类型，第二个参数是要定义的函数的返回值类型
3. 



## sparksql整合hive

##### spark整合hive步骤

把node03的hive安装目录下的配置文件hive-site.xml拷贝到每一个spark安装目录下对应的conf文件夹中（3台机器）

```sh
cd /kkb/install/hive-1.1.0-cdh5.14.2/conf
cp hive-site.xml /kkb/install/spark/conf/
scp hive-site.xml node01:/kkb/install/spark/conf/
scp hive-site.xml node02:/kkb/install/spark/conf/
```

把node03的hive的libe目录下的连接mysql驱动的jar包拷贝到spark安装目录下对应的jars文件夹中（3台机器）

```sh
cd /kkb/install/hive-1.1.0-cdh5.14.2/lib
cp mysql-connector-java-5.1.38.jar /kkb/install/spark/jars/
scp mysql-connector-java-5.1.38.jar node01:/kkb/install/spark/jars/
scp mysql-connector-java-5.1.38.jar node02:/kkb/install/spark/jars/
```

可以使用spark-sql脚本 后期执行sql相关的任务

##### 启动hive相关的spark sql

启动整合hive的spark sql 

```shell
spark-sql \
--master spark://node01:7077 \
--executor-memory 1g \
--total-executor-cores 4 \
--conf spark.sql.warehouse.dir=hdfs://node01:8020/user/hive/warehouse 
```

启动之后，可以看到如下shell:

![image-20200419011931846](spark.assets/image-20200419011931846.png)

我们之前了解过，spark sql是兼容hive sql 的，因此，在这里我们可以像在hive shell那样，进行对hive数据仓库的操作。如：

```sql
spark-sql (default)> show databases;
databaseName
db1
default

spark-sql (default)> use db1;

spark-sql (default)> show tables;
database        tableName       isTemporary
db1     hivedemo        false
db1     sparkdemo1      false

spark-sql (default)> select * from sparkdemo1;
id      name    age
1       krystal 21
```

##### 写运行spark sql语句的脚本

```sh
[hadoop@node01 ~]$ mkdir sparkTest
cd sparkTest
vi sparkHiveDemo.sh
```

```shell
#!/bin/sh
#定义sparksql提交脚本的头信息
SUBMITINFO="spark-sql --master spark://node01:7077 --executor-memory 1g --total-executor-cores 2 --conf spark.sql.warehouse.dir=hdfs://node01:8020/user/hive/warehouse" 
#定义一个sql语句
SQL="select * from db1.sparkDemo1;" 
#执行sql语句   类似于 hive -e sql语句
echo "$SUBMITINFO" 
echo "$SQL"
$SUBMITINFO -e "$SQL"
```

运行脚本：

```sh
sh sparkHiveDemo.sh
```

运行结果为：

```
id      name    age
1       krystal 21
```



## sparksql处理点击流日志数据案例(★★★★★)

##### 需求描述

通过sparsql对用户访问产生点击流日志数据进行分析处理，计算出对应的指标

![image-20200419015002531](spark.assets/image-20200419015002531.png)

##### 工具类开发

代码开发——校验日志数据进行字段解析提取的工具类AccessLogUtils

~~~scala
import scala.util.matching.Regex

//定义一个样例类，将切分后的一行数据封装在该类里：
case class AccessLog(
                      ipAddress: String, // IP地址
                      clientId: String, // 客户端唯一标识符
                      userId: String, // 用户唯一标识符
                      serverTime: String, // 服务器时间
                      method: String, // 请求类型/方式
                      endpoint: String, // 请求的资源
                      protocol: String, // 请求的协议名称
                      responseCode: Int, // 请求返回值：比如：200、401
                      contentSize: Long, // 返回的结果数据大小
                      url:String, //访问的url地址
                      clientBrowser:String //客户端游览器信息
                    )
object MyUtils {
  val regex:Regex="""^(\S+) (\S+) (\S+) \[([\w:/]+\s[+\-]\d{4})\] "(\S+) (\S+) (\S+)" (\d{3}) (\d+) (\S+) (.*)""".r

  //自定义过滤方法来过滤脏数据
  def isValidLine(line:String):Boolean={
    //findFirstMatchIn 是一个匹配方法，返回值是Some或者None
    val options=regex.findFirstMatchIn(line)
    if (options.isEmpty){
      false
    }else{
      true
    }
  }

  //定义一个方法，将一行数据切分，并封装在AccessLog类中，并返回AccessLog对象：
  def parseLine(line:String): AccessLog ={
    val options=regex.findFirstMatchIn(line)
    val matcher=options.get
    AccessLog(
      matcher.group(1), // 获取匹配的字符串中的第一组的值
      matcher.group(2),
      matcher.group(3),
      matcher.group(4),
      matcher.group(5),
      matcher.group(6),
      matcher.group(7),
      matcher.group(8).toInt,
      matcher.group(9).toLong,
      matcher.group(10),
      matcher.group(11)
    )
  }


}

~~~

说明：

1. 正则表达式：可以利用notepad的正则表达式方式的查找功能来解析每个正则表达式的意思
   1. ^代表开头的意思
   2. \S代表非空格和非Tab键   + 代表至少一个字符  (\S+)代表至少一个非空格Tab键的字符
   3. (\S+)代表至少有一个非空格非Tab键的字符
   4. \\[([\w:/]+\s[+\\-]\d{4})\\] 中的
      1. \\[代表 [
      2. \w代表大小写字母，数字和下划线，
      3. [\w:/]+代表 大小写字母，数字和下划线、冒号:、斜线/中的任意字符至少一位，
      4. \s代表空格或tab键
      5. [+\\-]代表 +或者-
      6. \d{4}代表4为数字
      7. \]代表]
      8. 匹配举例：[19/Sep/2013:04:08:36 +0000]
   5. .*代表任意个数的任意字符
   6. 正则表达式中的括号() 代表一个组，我们的正则表达式有11个括号()，所以有11个组
   7. 第一个括号就是第1组，依次类推，后期我们可以获取指定第几组的数据，因此，对匹配到的一行数据就不需要split(" ")切分了。
   8. findFirstMatchIn()是匹配到第一个成功匹配的数据
2. val regex:Regex="xxx".r的是字符串上的方法，该方法可以返回一个new Regex对象
3. 正则表达式中会出现特殊字符等，Scala中可以使用三对引号来直接输特殊字符，不需要转义符

##### 指标统计

大致步骤：构建sparkSession和sparkContext对象---》加载数据为RDD---》过滤掉脏数据---》将数据转为DataFrame---》将DataFrame注册成一张表---》指标统计分析---》将分析统计结果保存到mysql---》关闭资源

~~~scala
import java.util.Properties

import org.apache.spark.rdd.RDD
import org.apache.spark.sql.SparkSession

object LogAnalysis {

  val url="jdbc:mysql://node03:3306/spark"
  val properties=new Properties()
  properties.setProperty("user","root")
  properties.setProperty("password","123456")

  def main(args: Array[String]): Unit = {
    val spark=SparkSession.builder().appName("demo").master("local[2]").getOrCreate()
    val sc=spark.sparkContext
    sc.setLogLevel("warn")

    val lineRDD=sc.textFile("E:\\LearningAll\\8-HadoopEcosystem-Video\\spark下载资料\\spark_day05\\案例数据\\access.log")
    val lineCleanRDD2:RDD[String]=lineRDD.filter(line=>MyUtils.isValidLine(line))
    val parseRDD:RDD[AccessLog]=lineCleanRDD2.map(line=>MyUtils.parseLine(line))

    //RDD--->DataFrame
    import spark.implicits._
    val dataDF=parseRDD.toDF()
    dataDF.show(5)

    //注册
    dataDF.createTempView("accesslog")

    //开始分析数据
    val result1=spark.sql(
      """
        |select
        |date_sub(from_unixtime(unix_timestamp(),'yyyy-MM-dd'),1) as time,
        |AVG(contentSize) as avg_contentSize,
        |MAX(contentSize) as max_contentSize,
        |MIN(contentSize) as min_contentSize
        |from accesslog
        |""".stripMargin)
    result1.show()

    //PV,UV
    val result2=spark.sql(
      """
        |select
        |date_sub(from_unixtime(unix_timestamp(),'yyyy-MM-dd'),1) as time,
        |count(*) as PV,
        |count(distinct ipAddress) as UV
        |from accesslog
        |""".stripMargin)
    result2.show()

    val result3=spark.sql(
      """
        |select
        |date_sub(from_unixtime(unix_timestamp(),'yyyy-MM-dd'),1) as time,
        |responseCode as code,
        |count(*) as count
        |from accesslog
        |group by responseCode
        |""".stripMargin)
    result3.show()

    //求访问url次数最多的前N位
    val result4 = spark.sql(
      """
        |select
        |*,date_sub(from_unixtime(unix_timestamp(),'yyyy-MM-dd'),1) as time
        |from (
        |select
        |url as url,
        |count(*) as count
        |from accesslog
        |group by url) t
        |order by t.count desc limit 5
          """.stripMargin)
    result4.show()

    //求各个请求方式出现的次数
    val result5 = spark.sql(
      """
        |select
        |date_sub(from_unixtime(unix_timestamp(),'yyyy-MM-dd'),1) as time,
        |method as method,
        |count(*) as count
        |from accesslog
        |group by method
          """.stripMargin)
    result5.show()

    //保存result5数据到mysql
    result5.write.jdbc(url,"t_method",properties)  //不需要事先自己创建表

    spark.stop()
  }
}
~~~

说明：

1. DATE_SUB(date,INTERVAL expr type)是一个将日期减去指定的时间间隔的函数，*date* 参数是合法的日期表达式。*expr* 参数是您希望添加的时间间隔。
2. 函数：FROM_UNIXTIME
   作用：将MYSQL中以INT(11)存储的时间（时间戳）以"YYYY-MM-DD"格式来显示。
   语法：**FROM_UNIXTIME(unix_timestamp,format)**
3. unix_timestamp()可以获取当前时间的时间戳
4. unix_timestamp()也可以传入一个date参数，表示获取date的时间戳，Unix timestamp(date) 中的date需满足格式：yyyy-MM-dd HH:mm:ss或者yyyy-MM-dd
5. date_sub(from_unixtime(unix_timestamp(),'yyyy-MM-dd'),1)表示当前时间减1天，进行减1天的原因大概是在实际工作当中，一般是对昨天的数据进行统计分析的，所以在当前时间减1天

运行结果为：

```scala
+--------------+--------+------+--------------------+------+--------------------+--------+------------+-----------+---+--------------------+
|     ipAddress|clientId|userId|          serverTime|method|            endpoint|protocol|responseCode|contentSize|url|       clientBrowser|
+--------------+--------+------+--------------------+------+--------------------+--------+------------+-----------+---+--------------------+
|194.237.142.21|       -|     -|18/Sep/2013:06:49...|   GET|/wp-content/uploa...|HTTP/1.1|         304|          0|"-"|"Mozilla/4.0 (com...|
| 163.177.71.12|       -|     -|18/Sep/2013:06:49...|  HEAD|                   /|HTTP/1.1|         200|         20|"-"|"DNSPod-Monitor/1.0"|
| 163.177.71.12|       -|     -|18/Sep/2013:06:49...|  HEAD|                   /|HTTP/1.1|         200|         20|"-"|"DNSPod-Monitor/1.0"|
|101.226.68.137|       -|     -|18/Sep/2013:06:49...|  HEAD|                   /|HTTP/1.1|         200|         20|"-"|"DNSPod-Monitor/1.0"|
|101.226.68.137|       -|     -|18/Sep/2013:06:49...|  HEAD|                   /|HTTP/1.1|         200|         20|"-"|"DNSPod-Monitor/1.0"|
+--------------+--------+------+--------------------+------+--------------------+--------+------------+-----------+---+--------------------+
only showing top 5 rows

+----------+------------------+---------------+---------------+
|      time|   avg_contentSize|max_contentSize|min_contentSize|
+----------+------------------+---------------+---------------+
|2020-04-18|15882.708061002179|         432916|              0|
+----------+------------------+---------------+---------------+

+----------+-----+----+
|      time|   PV|  UV|
+----------+-----+----+
|2020-04-18|13770|1027|
+----------+-----+----+

+----------+----+-----+
|      time|code|count|
+----------+----+-----+
|2020-04-18| 500|    1|
|2020-04-18| 502|    8|
|2020-04-18| 301|   94|
|2020-04-18| 400|   13|
|2020-04-18| 403|    3|
|2020-04-18| 404|  201|
|2020-04-18| 408|    1|
|2020-04-18| 200|12340|
|2020-04-18| 304|  949|
|2020-04-18| 499|    8|
|2020-04-18| 302|  152|
+----------+----+-----+

+--------------------+-----+----------+
|                 url|count|      time|
+--------------------+-----+----------+
|                 "-"| 5204|2020-04-18|
|"http://blog.fens...|  547|2020-04-18|
|"http://blog.fens...|  377|2020-04-18|
|"http://blog.fens...|  360|2020-04-18|
|"http://blog.fens...|  274|2020-04-18|
+--------------------+-----+----------+

+----------+------+-----+
|      time|method|count|
+----------+------+-----+
|2020-04-18|  POST|  449|
|2020-04-18|  HEAD| 2941|
|2020-04-18|   GET|10380|
+----------+------+-----+
```

查看保存到mysql的数据：

```scala
mysql> show tables;
+-----------------+
| Tables_in_spark |
+-----------------+
| t_method        |
| t_students      |
| user            |
| user2           |
+-----------------+
4 rows in set (0.00 sec)

mysql> select * from t_method;
+------------+--------+-------+
| time       | method | count |
+------------+--------+-------+
| 2020-04-18 | POST   |   449 |
| 2020-04-18 | HEAD   |  2941 |
| 2020-04-18 | GET    | 10380 |
+------------+--------+-------+
```







## Spark调优——分配更多的资源

分配更多的资源是性能优化调优的王道，就是增加和分配更多的资源，这对于性能和速度上的提升是显而易见的。

基本上，在一定范围之内，增加资源与性能的提升，是成正比的；写完了一个复杂的spark作业之后，进行性能调优的时候，首先第一步，就是要来调节最优的资源配置；

在这个基础之上，如果说你的spark作业，能够分配的资源达到了你的能力范围的顶端之后，无法再分配更多的资源了，公司资源有限；那么才是考虑去做后面的这些性能调优的点。

相关问题：

1. 分配哪些资源？
2. 在哪里可以设置这些资源？
3. 剖析为什么分配这些资源之后，性能可以得到提升？

#### 分配哪些资源

~~~scala
executor-memory、executor-cores、driver-memory
~~~

#### 在哪里可以设置这些资源

在实际的生产环境中，提交spark任务时，使用spark-submit shell脚本，在里面调整对应的参数。

~~~sh
spark-submit \
 --master spark://node1:7077 \
 --class com.kaikeba.WordCount \
 --num-executors 3 \    配置executor的数量
 --driver-memory 1g \   配置driver的内存（影响不大）
 --executor-memory 1g \ 配置每一个executor的内存大小
 --executor-cores 3 \   配置每一个executor的cpu个数
 /export/servers/wordcount.jar
~~~

#### 参数调节到多大，算是最大

Standalone模式

~~~
 	先计算出公司spark集群上的所有资源 每台节点的内存大小和cpu核数，
 	比如：一共有20台worker节点，每台节点8g内存，10个cpu。
 	实际任务在给定资源的时候，可以给20个executor、每个executor的内存8g、每个executor的使用的cpu个数10。
~~~

Yarn模式

~~~
 	先计算出yarn集群的所有大小，比如一共500g内存，100个cpu；
 	这个时候可以分配的最大资源，比如给定50个executor、每个executor的内存大小10g,每个executor使用的cpu个数为2。
~~~

使用原则

~~~
在资源比较充足的情况下，尽可能的使用更多的计算资源，尽量去调节到最大的大小
~~~

#### 为什么调大资源以后性能可以提升

##### --executor-memory

- 表示每一个executor进程需要的内存大小，它决定了后期操作数据的速度

```
比如说一个rdd的数据量大小为5g,这里给定的executor-memory为2g, 在这种情况下，内存是存储不下，它会把一部分数据保存在内存中，还有一部分数据保存在磁盘，后续需要用到该rdd的结果数据，可以从内存和磁盘中获取得到，这里就涉及到一定的磁盘io操作。

,这里给定的executor-memory为10g，这里数据就可以完全在内存中存储下，后续需要用到该rdd的数据，就可以直接从内存中获取，这样一来，避免了大量的磁盘io操作。性能得到提升。


在实际的工作，这里 --executor-memory 需要设置的大一点。
比如说10G/20G/30G等
```

##### --total-executor-cores

--total-executor-cores表示任务运行需要总的cpu核数，它决定了任务并行运行的粒度

比如说要处理100个task，注意一个cpu在同一时间只能处理一个task线程。

1. 如果给定的总的cpu核数是5个，这里就需要100/5=20个批次才可以把这100个task运行完成，如果平均每个task运行1分钟，这里最后一共运行20分钟。

2. 如果给定的总的cpu核数是20个，这里就需要100/20=5个批次才可以把这100个task运行完成，如果平均每个task运行1分钟，这里最后一共运行5分钟。

3. 如果如果给定的总的cpu核数是100个，这里就需要100/100=1个批次才可以把这100个task运行完成，如果平均每个task运行1分钟，这里最后一共运行1分钟。

在实际的生产环境中，--total-executor-cores 这个参数一般也会设置的大一点，比如说 30个/50个/100个

注意：如果分配的cpu核数比总的task线程数量还打会造成资源浪费。

![image-20200416204239271](spark.assets/image-20200416204239271-1587626129053.png)

![spark性能优化--分配资源](spark.assets/spark性能优化--分配资源.png)



## Spark调优——提高并行度

#### Spark的并行度指的是什么

spark作业中，各个stage的task的数量，也就代表了spark作业在各个阶段stage的并行度！

当分配完所能分配的最大资源了，然后对应资源去调节程序的并行度，如果并行度没有与资源相匹配，那么导致你分配下去的资源都浪费掉了。同时并行运行，还可以让每个task要处理的数量变少（很简单的原理。合理设置并行度，可以充分利用集群资源，减少每个task处理数据量，而增加性能加快运行速度。）

#### 如何提高并行度

##### 可以设置task的数量

task数量至少设置成与spark Application 的总cpu core 数量相同。最理想情况，150个core，分配150task，一起运行，差不多同一时间运行完毕

官方推荐，task数量，设置成spark Application 总cpu core数量的2~3倍 。
	

	比如150个cpu core ，基本设置task数量为300~500. 与理想情况不同的，有些task会运行快一点，比如50s就完了，有些task 可能会慢一点，要一分半才运行完，所以如果你的task数量，刚好设置的跟cpu core 数量相同，可能会导致资源的浪费。

因为比如150个task中10个先运行完了，剩余140个还在运行，但是这个时候，就有10个cpu core空闲出来了，导致浪费。如果设置2~3倍，那么一个task运行完以后，另外一个task马上补上来，尽量让cpu core不要空闲。同时尽量提升spark运行效率和速度。提升性能。

##### 设置task数量方法1——spark.default.parallelism

spark.default.parallelism

参数说明：该参数用于设置每个stage的默认task数量。这个参数极为重要，如果不设置可能会直接影响你的Spark作业性能。

参数调优建议：Spark作业的默认task数量为500~1000个较为合适。很多同学常犯的一个错误就是不去设置这个参数，那么此时就会导致Spark自己根据底层HDFS的block数量来设置task的数量，默认是一个HDFS block对应一个task。通常来说，Spark默认设置的数量是偏少的（比如就几十个task），如果task数量偏少的话，就会导致你前面设置好的Executor的参数都前功尽弃。试想一下，无论你的Executor进程有多少个，内存和CPU有多大，但是task只有1个或者10个，那么90%的Executor进程可能根本就没有task执行，也就是白白浪费了资源！因此Spark官网建议的设置原则是，设置该参数为num-executors * executor-cores的2~3倍较为合适，比如Executor的总CPU core数量为300个，那么设置1000个task是可以的，此时可以充分地利用Spark集群的资源。

可以通过在构建SparkConf对象的时候设置，例如：

```scala
new SparkConf().set("spark.defalut.parallelism","500")
```

##### 设置task数量方法2——给RDD重新设置partition的数量

使用rdd.repartition 来重新分区，该方法会生成一个新的rdd，使其分区数变大。

此时由于一个partition对应一个task，那么对应的task个数越多，通过这种方式也可以提高并行度。

##### 设置task数量方法3——提高sparksql运行的task数量



通过设置参数 spark.sql.shuffle.partitions=500  默认为200；

可以适当增大，来提高并行度。 比如设置为 spark.sql.shuffle.partitions=500。

该参数的作用：Configures the number of partitions to use when shuffling data for joins or aggregations.



## Spark调优——RDD的重用和持久化

##### 实际开发遇到的情况说明

![rdd重用1](spark.assets/rdd重用1.png)

如上图所示的计算逻辑：

（1）当第一次使用rdd2做相应的算子操作得到rdd3的时候，就会从rdd1开始计算，先读取HDFS上的文件，然后对rdd1做对应的算子操作得到rdd2,再由rdd2计算之后得到rdd3。同样为了计算得到rdd4，前面的逻辑会被重新计算。

（3）默认情况下多次对一个rdd执行算子操作，去获取不同的rdd，都会对这个rdd及之前的父rdd全部重新计算一次。这种情况在实际开发代码的时候会经常遇到，但是我们一定要避免一个rdd重复计算多次，否则会导致性能急剧降低。

总结：可以把多次使用到的rdd，也就是公共rdd进行持久化，避免后续需要，再次重新计算，提升效率。

![rdd重用2](spark.assets/rdd重用2.png)



##### 如何对rdd进行持久化

可以调用rdd的cache或者persist方法。

（1）cache方法默认是把数据持久化到内存中 ，例如：rdd.cache ，其本质还是调用了persist方法

（2）persist方法中有丰富的缓存级别，这些缓存级别都定义在StorageLevel这个object中，可以结合实际的应用场景合理的设置缓存级别。

例如： rdd.persist(StorageLevel.MEMORY_ONLY),这是cache方法的实现。

##### rdd持久化的时可以采用序列化

（1）如果正常将数据持久化在内存中，那么可能会导致内存的占用过大，这样的话，也许会导致OOM内存溢出。

（2）当纯内存无法支撑公共RDD数据完全存放的时候，就优先考虑使用序列化的方式在纯内存中存储。将RDD的每个partition的数据，序列化成一个字节数组；序列化后，大大减少内存的空间占用。

（3）序列化的方式，唯一的缺点就是，在获取数据的时候，需要反序列化。但是可以减少占用的空间和便于网络传输

（4）如果序列化纯内存方式，还是导致OOM，内存溢出；就只能考虑磁盘的方式，内存+磁盘的普通方式（无序列化）。

（5）为了数据的高可靠性，而且内存充足，可以使用双副本机制，进行持久化

持久化的双副本机制，持久化后的一个副本，因为机器宕机了，副本丢了，就还是得重新计算一次；

持久化的每个数据单元，存储一份副本，放在其他节点上面，从而进行容错；

一个副本丢了，不用重新计算，还可以使用另外一份副本。这种方式，仅仅针对你的内存资源极度充足。

比如: StorageLevel.MEMORY_ONLY_2



## Spark调优——广播变量的使用

##### 场景描述

在实际工作中可能会遇到这样的情况，由于要处理的数据量非常大，这个时候可能会在一个stage中出现大量的task，比如有1000个task，这些task都需要一份相同的数据来处理业务，这份数据的大小为100M，该数据会拷贝1000份副本，通过网络传输到各个task中去，给task使用。

这里会涉及大量的网络传输开销，同时至少需要的内存为1000*100M=100G，这个内存开销是非常大的。不必要的内存的消耗和占用，就导致了你在进行RDD持久化到内存，也许就没法完全在内存中放下；就只能写入磁盘，最后导致后续的操作在磁盘IO上消耗性能；这对于spark任务处理来说就是一场灾难。

由于内存开销比较大，task在创建对象的时候，可能会出现堆内存放不下所有对象，就会导致频繁的垃圾回收器的回收GC。GC的时候一定是会导致工作线程停止，也就是导致Spark暂停工作那么一点时间。频繁GC的话，对Spark作业的运行的速度会有相当可观的影响。

![task共享数据](spark.assets/task共享数据.png)



##### 广播变量引入

Spark中分布式执行的代码需要传递到各个executor的task上运行。对于一些只读、固定的数据,每次都需要Driver广播到各个Task上，这样效率低下。广播变量允许将变量只广播给各个executor。

该executor上的各个task再从所在节点的BlockManager(负责管理某个executor对应的内存和磁盘上的数据)获取变量，而不是从Driver获取变量，从而提升了效率。

![广播变量](spark.assets/广播变量.png)

广播变量，初始的时候，就在Drvier上有一份副本。通过在Driver把共享数据转换成广播变量。

task在运行的时候，想要使用广播变量中的数据，此时首先会在自己本地的Executor对应的BlockManager中，尝试获取变量副本；如果本地没有，那么就从Driver远程拉取广播变量副本，并保存在本地的BlockManager中；

此后这个executor上的task，都会直接使用本地的BlockManager中的副本。那么这个时候所有该executor中的task都会使用这个广播变量的副本。也就是说一个executor只需要在第一个task启动时，获得一份广播变量数据，之后的task都从本节点的BlockManager中获取相关数据。

executor的BlockManager除了从driver上拉取，也可能从其他节点的BlockManager上拉取变量副本，网络距离越近越好。

##### 使用广播变量后的性能分析

比如一个任务需要50个executor，1000个task，共享数据为100M。

(1)在不使用广播变量的情况下，1000个task，就需要该共享数据的1000个副本，也就是说有1000份数需要大量的网络传输和内存开销存储。耗费的内存大小1000*100=100G.*

(2)使用了广播变量后，50个executor就只需要50个副本数据，而且不一定都是从Driver传输到每个节点，还可能是就近从最近的节点的executor的blockmanager上拉取广播变量副本，网络传输速度大大增加；内存开销 50*100M=5G

总结：
	不使用广播变量的内存开销为100G，使用后的内存开销5G，这里就相差了20倍左右的网络传输性能损耗和内存开销，使用广播变量后对于性能的提升和影响，还是很可观的。
	广播变量的使用不一定会对性能产生决定性的作用。比如运行30分钟的spark作业，可能做了广播变量以后，速度快了2分钟，或者5分钟。但是一点一滴的调优，积少成多。最后还是会有效果的。

##### 广播变量使用注意事项

1. 能不能将一个RDD使用广播变量广播出去？

   不能，因为RDD是不存储数据的。可以将RDD的结果广播出去。

2. 广播变量只能在Driver端定义，不能在Executor端定义。

3. 在Driver端可以修改广播变量的值，在Executor端无法修改广播变量的值。

4. 如果executor端用到了Driver的变量，如果不使用广播变量在Executor有多少task就有多少Driver端的变量副本。

5. 如果Executor端用到了Driver的变量，如果使用广播变量在每个Executor中只有一份Driver端的变量副本。



##### 如何使用广播变量

(1) 通过sparkContext的broadcast方法把数据转换成广播变量，类型为Broadcast，

```scala
val broadcastArray: Broadcast[Array[Int]] = sc.broadcast(Array(1,2,3,4,5,6))
```

(2) 然后executor上的BlockManager就可以拉取该广播变量的副本获取具体的数据。

获取广播变量中的值可以通过调用其value方法

```scala
 val array: Array[Int] = broadcastArray.value
```



## Spark调优——尽量避免使用shuffle类算子

##### shuffle描述

spark中的shuffle涉及到数据要进行大量的网络传输，下游阶段的task任务需要通过网络拉取上阶段task的输出数据，shuffle过程，简单来说，就是将分布在集群中多个节点上的同一个key，拉取到同一个节点上，进行聚合或join等操作。比如reduceByKey、join等算子，都会触发shuffle操作。

如果有可能的话，要尽量避免使用shuffle类算子。

因为Spark作业运行过程中，最消耗性能的地方就是shuffle过程。
	

##### 哪些算子操作会产生shuffle

spark程序在开发的过程中使用reduceByKey、join、distinct、repartition等算子操作，这里都会产生shuffle，由于shuffle这一块是非常耗费性能的，实际开发中尽量使用map类的非shuffle算子。这样的话，没有shuffle操作或者仅有较少shuffle操作的Spark作业，可以大大减少性能开销。



##### 避免产生shuffle的小案例

错误的做法：

传统的join操作会导致shuffle操作。因为两个RDD中，相同的key都需要通过网络拉取到一个节点上，由一个task进行join操作。

```scala
val rdd3 = rdd1.join(rdd2)
```

![image-20200419135700724](spark.assets/image-20200419135700724.png)



正确的做法：Broadcast+map的join操作，不会导致shuffle操作

~~~scala
// 使用Broadcast将一个数据量较小的RDD作为广播变量。
val rdd2Data = rdd2.collect()
val rdd2DataBroadcast = sc.broadcast(rdd2Data)

// 在rdd1.map算子中，可以从rdd2DataBroadcast中，获取rdd2的所有数据。
// 然后进行遍历，如果发现rdd2中某条数据的key与rdd1的当前数据的key是相同的，那么就判定可以进行join。
// 此时就可以根据自己需要的方式，将rdd1当前数据与rdd2中可以连接的数据，拼接在一起（String或Tuple）。
val rdd3 = rdd1.map(rdd2DataBroadcast...) //写一个方法来事先拼接操作

// 注意，以上操作，建议仅仅在rdd2的数据量比较少（比如几百M，或者一两G）的情况下使用。
// 因为每个Executor的内存中，都会驻留一份rdd2的全量数据。
~~~



##### 使用map-side预聚合的shuffle操作

map-side预聚合

如果因为业务需要，一定要使用shuffle操作，无法用map类的算子来替代，那么尽量使用可以map-side预聚合的算子。

所谓的map-side预聚合，说的是在每个节点本地对相同的key进行一次聚合操作，类似于MapReduce中的本地combiner。

map-side预聚合之后，每个节点本地就只会有一条相同的key，因为多条相同的key都被聚合起来了。其他节点在拉取所有节点上的相同key时，就会大大减少需要拉取的数据数量，从而也就减少了磁盘IO以及网络传输开销。

通常来说，在可能的情况下，建议使用reduceByKey或者aggregateByKey算子来替代掉groupByKey算子。因为reduceByKey和aggregateByKey算子都会使用用户自定义的函数对每个节点本地的相同key进行预聚合。而groupByKey算子是不会进行预聚合的，全量的数据会在集群的各个节点之间分发和传输，性能相对来说比较差。

比如如下两幅图，就是典型的例子，分别基于reduceByKey和groupByKey进行单词计数。其中第一张图是groupByKey的原理图，可以看到，没有进行任何本地聚合时，所有数据都会在集群节点之间传输；第二张图是reduceByKey的原理图，可以看到，每个节点本地的相同key数据，都进行了预聚合，然后才传输到其他节点上进行全局聚合。

**groupByKey进行单词计数原理**

![1577080609633](spark.assets/groupByKey.png)



**reduceByKey单词计数原理**

![1577080686083](spark.assets/reduceByKey.png)





## Spark调优——使用高性能的算子



##### 使用reduceByKey/aggregateByKey替代groupByKey

* reduceByKey/aggregateByKey 可以进行预聚合操作，减少数据的传输量，提升性能
* groupByKey 不会进行预聚合操作，进行数据的全量拉取，性能比较低

##### 使用mapPartitions替代普通map

mapPartitions类的算子，一次函数调用会处理一个partition所有的数据，而不是一次函数调用处理一条，性能相对来说会高一些。

但是有的时候，使用mapPartitions会出现OOM（内存溢出）的问题。因为单次函数调用就要处理掉一个partition所有的数据，如果内存不够，垃圾回收时是无法回收掉太多对象的，很可能出现OOM异常。所以使用这类操作时要慎重！

##### 使用foreachPartitions替代foreach

原理类似于“使用mapPartitions替代map”，也是一次函数调用处理一个partition的所有数据，而不是一次函数调用处理一条数据。

在实践中发现，foreachPartitions类的算子，对性能的提升还是很有帮助的。比如在foreach函数中，将RDD中所有数据写MySQL，那么如果是普通的foreach算子，就会一条数据一条数据地写，每次函数调用可能就会创建一个数据库连接，此时就势必会频繁地创建和销毁数据库连接，性能是非常低下；

但是如果用foreachPartitions算子一次性处理一个partition的数据，那么对于每个partition，只要创建一个数据库连接即可，然后执行批量插入操作，此时性能是比较高的。实践中发现，对于1万条左右的数据量写MySQL，性能可以提升30%以上。

##### 使用filter之后进行coalesce操作

通常对一个RDD执行filter算子过滤掉RDD中较多数据后（比如30%以上的数据），建议使用coalesce算子，手动减少RDD的partition数量，将RDD中的数据压缩到更少的partition中去。

因为filter之后，RDD的每个partition中都会有很多数据被过滤掉，此时如果照常进行后续的计算，其实每个task处理的partition中的数据量并不是很多，有一点资源浪费，而且此时处理的task越多，可能速度反而越慢。

因此用coalesce减少partition数量，将RDD中的数据压缩到更少的partition之后，只要使用更少的task即可处理完所有的partition。在某些场景下，对于性能的提升会有一定的帮助。

##### 使用repartitionAndSortWithinPartitions替代repartition与sort类操作

repartitionAndSortWithinPartitions是Spark官网推荐的一个算子，官方建议，如果需要在repartition重分区之后，还要进行排序，建议直接使用repartitionAndSortWithinPartitions算子。

因为该算子可以一边进行重分区的shuffle操作，一边进行排序。shuffle与sort两个操作同时进行，比先shuffle再sort来说，性能可能是要高的。



## Spark调优——使用Kryo优化序列化性能

##### spark序列化介绍

Spark在进行任务计算的时候，会涉及到数据跨进程的网络传输、数据的持久化，这个时候就需要对数据进行序列化。Spark默认采用Java的序列化器。默认java序列化的优缺点如下:

其好处：处理起来方便，不需要我们手动做其他操作，只需要在使用一个对象和变量的时候，实现Serializble接口即可。

其缺点：默认的序列化机制的效率不高，序列化的速度比较慢；序列化以后的数据，占用的内存空间相对还是比较大。

Spark支持使用Kryo序列化机制。Kryo序列化机制，比默认的Java序列化机制，速度要快，序列化后的数据要更小，大概是Java序列化机制的1/10。所以Kryo序列化优化以后，可以让网络传输的数据变少；在集群中耗费的内存资源大大减少。

##### Kryo序列化启用后生效的地方

Kryo序列化机制，一旦启用以后，会生效的几个地方：

（1）算子函数中使用到的外部变量

算子中的外部变量可能来着与driver需要涉及到网络传输，就需要用到序列化。

最终可以优化网络传输的性能，优化集群中内存的占用和消耗

（2）持久化RDD时进行序列化，StorageLevel.MEMORY_ONLY_SER

将rdd持久化时，对应的存储级别里，需要用到序列化。

最终可以优化内存的占用和消耗；持久化RDD占用的内存越少，task执行的时候，创建的对象，就不至于频繁的占满内存，频繁发生GC。

（3）产生shuffle的地方，也就是宽依赖

下游的stage中的task，拉取上游stage中的task产生的结果数据，跨网络传输，需要用到序列化。最终可以优化网络传输的性能
	

##### 如何开启Kryo序列化机制

~~~scala
// 创建SparkConf对象。
val conf = new SparkConf().setMaster(...).setAppName(...)
// 设置序列化器为KryoSerializer。
conf.set("spark.serializer", "org.apache.spark.serializer.KryoSerializer")

// 注册要序列化的自定义类型。
conf.registerKryoClasses(Array(classOf[MyClass1], classOf[MyClass2]))
~~~



## Spark调优——使用fastutil优化数据格式

##### fastutil介绍

fastutil是扩展了Java标准集合框架（Map、List、Set；HashMap、ArrayList、HashSet）的类库，提供了特殊类型的map、set、list和queue；

fastutil能够提供更小的内存占用，更快的存取速度；我们使用fastutil提供的集合类，来替代自己平时使用的JDK的原生的Map、List、Set.

##### fastutil好处

fastutil集合类，可以减小内存的占用，并且在进行集合的遍历、根据索引（或者key）获取元素的值和设置元素的值的时候，提供更快的存取速度

##### Spark中应用fastutil的场景和使用

###### 算子函数使用了外部变量

（1）你可以使用Broadcast广播变量优化；

（2）可以使用Kryo序列化类库，提升序列化性能和效率；

（3）如果外部变量是某种比较大的集合，那么可以考虑使用fastutil改写外部变量；

首先从源头上就减少内存的占用(fastutil)，通过广播变量进一步减少内存占用，再通过Kryo序列化类库进一步减少内存占用。

###### 算子函数里使用了比较大的集合Map/List

在你的算子函数里，也就是task要执行的计算逻辑里面，如果有逻辑中，出现，要创建比较大的Map、List等集合，可能会占用较大的内存空间，而且可能涉及到消耗性能的遍历、存取等集合操作； 那么此时，可以考虑将这些集合类型使用fastutil类库重写，

使用了fastutil集合类以后，就可以在一定程度上，减少task创建出来的集合类型的内存占用。 
避免executor内存频繁占满，频繁唤起GC，导致性能下降。

###### fastutil的使用

第一步：在pom.xml中引用fastutil的包

```xml
    <dependency>
      <groupId>fastutil</groupId>
      <artifactId>fastutil</artifactId>
      <version>5.0.9</version>
    </dependency>
```

第二步：平时使用List(Integer)的替换成IntList即可。 

`List<Integer>`的元素类型对应到fastutil就是IntList类型
	

	使用说明：

基本都是类似于IntList的格式，前缀就是集合的元素类型； 

特殊的就是Map，Int2IntMap，代表了key-value映射的元素类型。



## Spark调优——调节数据本地化等待时长

Spark在Driver上对Application的每一个stage的task进行分配之前，都会计算出每个task要计算的是哪个分片数据，RDD的某个partition；Spark的task分配算法，优先会希望每个task正好分配到它要计算的数据所在的节点，这样的话就不用在网络间传输数据；

但是通常来说，有时事与愿违，可能task没有机会分配到它的数据所在的节点，为什么呢，可能那个节点的计算资源和计算能力都满了；所以这种时候，通常来说，Spark会等待一段时间，默认情况下是3秒（不是绝对的，还有很多种情况，对不同的本地化级别，都会去等待），到最后实在是等待不了了，就会选择一个比较差的本地化级别，比如说将task分配到距离要计算的数据所在节点比较近的一个节点，然后进行计算。

![image-20200419142802894](spark.assets/image-20200419142802894.png)

##### 本地化级别

（1）PROCESS_LOCAL：进程本地化

代码和数据在同一个进程中，也就是在同一个executor中；计算数据的task由executor执行，数据在executor的BlockManager中；性能最好

（2）NODE_LOCAL：节点本地化

代码和数据在同一个节点中；比如说数据作为一个HDFS block块，就在节点上，而task在节点上某个executor中运行；或者是数据和task在一个节点上的不同executor中；数据需要在进程间进行传输；性能其次

（3）RACK_LOCAL：机架本地化	

数据和task在一个机架的两个节点上；数据需要通过网络在节点之间进行传输； 性能比较差

（4）ANY：无限制

数据和task可能在集群中的任何地方，而且不在一个机架中；性能最差
	

##### 数据本地化等待时长

spark.locality.wait，默认是3s

首先采用最佳的方式，等待3s后降级,还是不行，继续降级...,最后还是不行，只能够采用最差的。

##### 如何调节参数并且测试

修改spark.locality.wait参数，默认是3s，可以增加

下面是每个数据本地化级别的等待时间，默认都是跟spark.locality.wait时间相同，默认都是3s

(可查看spark官网对应参数说明，如下图所示)

spark.locality.wait.node

spark.locality.wait.process

spark.locality.wait.rack

在代码中设置：

```scala
new SparkConf().set("spark.locality.wait","10")
```

然后把程序提交到spark集群中运行，注意观察日志，spark作业的运行日志，推荐大家在测试的时候，先用client模式，在本地就直接可以看到比较全的日志。 

日志里面会显示，starting task .... PROCESS LOCAL、NODE LOCAL.....

例如：

```sh
Starting task 0.0 in stage 1.0 (TID 2, 192.168.200.102, partition 0, NODE_LOCAL, 5254 bytes)
```

观察大部分task的数据本地化级别，如果大多都是PROCESS_LOCAL，那就不用调节了。

如果是发现，好多的级别都是NODE_LOCAL、ANY，那么最好就去调节一下数据本地化的等待时长。应该是要反复调节，每次调节完以后，再来运行，观察日志 看看大部分的task的本地化级别有没有提升；看看整个spark作业的运行时间有没有缩短。

注意注意：在调节参数、运行任务的时候，别本末倒置，本地化级别倒是提升了， 但是因为大量的等待时长，spark作业的运行时间反而增加了，那就还是不要调节了。



## Spark调优——基于Spark内存模型调优

#### spark中executor内存划分

Executor的内存主要分为三块

* 第一块是让task执行我们自己编写的代码时使用；
* 第二块是让task通过shuffle过程拉取了上一个stage的task的输出后，进行聚合等操作时使用
* 第三块是让RDD缓存时使用

#### spark的内存模型

~~~
	在spark1.6版本以前 spark的executor使用的静态内存模型，但是在spark1.6开始，多增加了一个统一内存模型。
	通过spark.memory.useLegacyMode 这个参数去配置
			默认这个值是false，代表用的是新的动态内存模型；
			如果想用以前的静态内存模型，那么就要把这个值改为true。
~~~

##### 静态内存模型

![1570604272790](spark.assets/1570604272790.png)

实际上就是把我们的一个executor分成了三部分，

1. Storage内存区域，
2. execution区域，
3. Others其他区域。

如果使用的静态内存模型，那么用这几个参数去控制：

1. spark.storage.memoryFraction：默认0.6
2. spark.shuffle.memoryFraction：默认0.2  
3. 所以第三部分就是0.2

如果我们cache数据量比较大，或者是我们的广播变量比较大，那我们就把spark.storage.memoryFraction这个值调大一点。

但是如果我们代码里面没有广播变量，也没有cache，shuffle又比较多，那我们要把spark.shuffle.memoryFraction 这值调大。

###### 静态内存模型的缺点

我们配置好了Storage内存区域和execution区域后，我们的一个任务假设execution内存不够用了，但是它的Storage内存区域是空闲的，两个之间不能互相借用，不够灵活，所以才出来我们新的统一内存模型。



##### 统一内存模型

![img](spark.assets/image2018-11-1_16-39-33.png)

动态内存模型先是预留了300m内存，防止内存溢出。动态内存模型把整体内存分成了两部分，由这个参数表示spark.memory.fraction 这个指的默认值是0.6 代表另外的一部分是0.4,

然后spark.memory.fraction 这部分又划分成为两个小部分。这两小部分共占整体内存的0.6 .这两部分其实就是：Storage内存和execution内存。由spark.memory.storageFraction 这个参数去调配，因为两个共占0.6。如果spark.memory.storageFraction这个值配的是0.5,那说明这0.6里面 storage占了0.5，也就是executor占了0.3 。

统一内存模型有什么特点呢?

Storage内存和execution内存 可以相互借用。不用像静态内存模型那样死板，但是是有规则的

**场景一**: Execution使用的时候发现内存不够了，然后就会把storage的内存里的数据驱逐到磁盘上,腾出来的内存空间将借给Execution。

![1570604662552](spark.assets/1570604662552.png)

**场景二**: 一开始execution的内存使用得不多，但是storage使用的内存多，所以storage就借用了execution的内存，但是后来execution也要需要内存了，这个时候就会把storage的内存里的数据写到磁盘上，腾出内存空间。

![1570604675176](spark.assets/1570604675176.png)



为什么受伤的都是storage呢？是因为execution里面的数据是马上就要用的，而storage里的数据不一定马上就要用。	

###### 任务提交脚本参考

以下是一份spark-submit命令的示例，大家可以参考一下，并根据自己的实际情况进行调节

```sh
./bin/spark-submit \
  --master yarn-cluster \
  --num-executors 100 \
  --executor-memory 6G \
  --executor-cores 4 \
  --driver-memory 1G \
  --conf spark.default.parallelism=1000 \
  --conf spark.storage.memoryFraction=0.5 \
  --conf spark.shuffle.memoryFraction=0.3 \
```

###### 个人经验

~~~java
java.lang.OutOfMemoryError
ExecutorLostFailure
Executor exit code 为143
executor lost
hearbeat time out
shuffle file lost

如果遇到以上问题，很有可能就是内存除了问题，可以先尝试增加内存。如果还是解决不了，那么请听下一次数据倾斜调优的课。
~~~



## 招聘要求介绍

![1565872653413](spark.assets/1565872653413.png)

![1565872766577](spark.assets/1565872766577.png)

















