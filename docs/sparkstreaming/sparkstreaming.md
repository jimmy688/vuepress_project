大数据实时技术框架发展

> (1)storm:
>
> ​	它是一个实时的处理框架，可以实现来一条数据就处理一条数据，实时性非常高，但吞吐量很低。
>
> ​	已经被淘汰了。
>
> (2)sparkstreaming:
>
> ​	它不能算是实时的处理引擎，其本质是批处理，只不过由于要处理的数据是源源不断的，并且每个		批次非常小，然后处理起来很快，让我们感觉有实时的效果。是微批处理。
>
> ​	从严格意义来说，sparkstreaming并不是一个实时处理框架，可以理解是准实时的。
>
> ​	特性：实时性不高，吞吐量比较高。
>
> (2)flink:
>
> ​	它是真正意义上的实时处理框架，来一条数据就处理一条数据，它的实时性非常高，吞吐量也非常		高。是未来大数据的发展方向。

## SparkStreaming简介

SparkStreaming是对于Spark核心API的拓展，从而**支持对于实时数据流的可拓展，高吞吐量和容错性流处理**。数据可以由多个源取得，例如：Kafka，Flume，Twitter，ZeroMQ，Kinesis或者TCP接口，同时可以使用由如map，reduce，join和window这样的高层接口描述的复杂算法进行处理。最终，处理过的数据可以被推送到文件系统，数据库和HDFS。

数据从Kafka上获得时，我们可以把SparkStreaming理解成Kafka的消费者程序。

![Spark Streaming](sparkstreaming.assets/streaming-arch-1608485794544.png)

Spark Streaming 是基于spark的流式批处理引擎，其**基本原理是把输入数据以某一时间间隔批量的处理，当批处理间隔缩短到秒级时，便可以用于处理实时数据流。**

流式：源源不断地数据流入

流式批处理：一批批的数据源源不断地流入

![image-20200422150253653](sparkstreaming.assets/image-20200422150253653-1608485794544.png)

## SparkStreaming架构流程

![sparkStreaming架构流程](sparkstreaming.assets/sparkStreaming架构流程-1608485794544.png)

1. 将sparkstreaming程序打成jar包，提交到spark集群。
2. SparkStreaming就是一个application，需要创建流式处理的上下文对象StreamingContext,该StreamingContext内部会封装一个sparkContext,sparkContext是运行在Driver之上。根据不同的运行模式，在对应的服务器构建一个Driver。
3. ==Driver端发送Receiver（接收器）对象到某个executor进程==中，receiver是用来接收数据源的数据的，默认只有一个，可以配置多个，Receiver会占用一个线程。
4. ==Receiver会把接收到的一条条数据封装成一个个block==，然后把这些block数据写入到当前executor的内存中。==默认是每200ms之内接收的数据就是一个block，通过设置block-interval来改变这个值。==
5. Receiver把接收到的数据块block的信息通知给Driver。这里会有向Driver端申请资源的步骤，暂时省略，跟之前学习spark时讲的申请资源流程大致一样。
6. 申请好资源后，会在不同的机器节点启动其它的executor，executor里面也会有task,一个task(线程）将会处理一个block块的数据。
7. ==Driver端根据一定的时间间隔，把这些block块组成一个RDD==，然后对这些RDD进行处理。==其中一个block就是RDD中的1个partition，一个partition对应1个task任务==。默认的批处理时间间隔batch-size=1s,
8. 按照批处理时间间隔和产生block的时间间隔的默认值，可以知道：每隔1s就会生成一个job,这个job对应的RDD的分区数为1s/200ms=5个。

## SparkStreaming程序入口

~~~scala
val conf = new SparkConf().setMaster("local[2]").setAppName("NetworkWordCount")
val ssc = new StreamingContext(conf, Seconds(1))
//或者
val ssc = new StreamingContext(new SparkContext(conf), Seconds(1))
~~~

## 什么是DStream

==离散数据流或者DStream是SparkStreaming提供的基本抽象==。其表现数据的连续流，这个输入数据流可以来自于源，也可以来自于转换输入流产生的已处理数据流。==内部而言，一个DStream以一系列连续的RDDs所展现==，这些RDD是Spark对于不变的，分布式数据集的抽象。一个DStream中的每个RDD都包含来自一定间隔的数据，如下图：

![](sparkstreaming.assets/streaming-dstream-1608485794544.png)

==在DStream上使用的任何操作都会转换为针对底层RDD的操作，每一次对Dstream的处理都是针对当前批次生成的RDD数据==。例如：之前那个将行的流转变为词流的例子中，flatMap操作应用于行DStream的每个RDD上 从而产生words DStream的RDD。如下图：

![Spark Streaming](sparkstreaming.assets/streaming-dstream-ops-1608485794544.png)

![DStream逻辑图](sparkstreaming.assets/DStream逻辑图-1608485794544.png)

## DStream算子操作

#### Transformations 

==实现把一个DStream转换生成一个新的DStream，延迟加载不会触发任务的执行==

| **Transformation**               | **Meaning**                                                  |
| -------------------------------- | ------------------------------------------------------------ |
| map(func)                        | 对DStream中的各个元素进行func函数操作，然后返回一个新的DStream |
| flatMap(func)                    | 与map方法类似，只不过各个输入项可以被输出为零个或多个输出项  |
| filter(func)                     | 过滤出所有函数func返回值为true的DStream元素并返回一个新的DStream |
| repartition(numPartitions)       | 增加或减少DStream中的分区数，从而改变DStream的并行度         |
| union(otherStream)               | 将源DStream和输入参数为otherDStream的元素合并，并返回一个新的DStream. |
| count()                          | 通过对DStream中的各个RDD中的元素进行计数，然后返回只有一个元素的RDD构成的DStream |
| reduce(func)                     | 对源DStream中的各个RDD中的元素利用func进行聚合操作，然后返回只有一个元素的RDD构成的新的DStream. |
| countByValue()                   | 对于元素类型为K的DStream，返回一个元素为（K,Long）键值对形式的新的DStream，Long对应的值为源DStream中各个RDD的key出现的次数 |
| reduceByKey(func, [numTasks])    | 利用func函数对源DStream中的key进行聚合操作，然后返回新的（K，V）对构成的DStream |
| join(otherStream, [numTasks])    | 输入为（K,V)、（K,W）类型的DStream，返回一个新的（K，（V，W））类型的DStream |
| cogroup(otherStream, [numTasks]) | 输入为（K,V)、（K,W）类型的DStream，返回一个新的 (K, Seq[V], Seq[W]) 元组类型的DStream |
| transform(func)                  | 通过RDD-to-RDD函数作用于DStream中的各个RDD，可以是任意的RDD操作，从而返回一个新的RDD |
| updateStateByKey(func)           | 根据key的之前状态值和key的新值，对key进行更新，返回一个新状态的DStream |
| reduceByKeyAndWindow             | 窗口函数操作，实现按照window窗口大小来进行计算               |

#### Output Operations

输出算子操作，==触发任务的真正运行==

| Output Operation                    | Meaning                                                      |
| ----------------------------------- | ------------------------------------------------------------ |
| print()                             | 打印到控制台                                                 |
| saveAsTextFiles(prefix, [suffix])   | 保存流的内容为文本文件，文件名为"prefix-TIME_IN_MS[.suffix]". |
| saveAsObjectFiles(prefix, [suffix]) | 保存流的内容为SequenceFile，文件名为 "prefix-TIME_IN_MS[.suffix]". |
| saveAsHadoopFiles(prefix, [suffix]) | 保存流的内容为hadoop文件，文件名为 "prefix-TIME_IN_MS[.suffix]". |
| foreachRDD(func)                    | 对Dstream里面的每个RDD执行func                               |



## 数据源--socket

#### 需求

使用sparkStreaming实时接收socket数据，实现单词计数

#### 业务处理流程图

![1582444394566](sparkstreaming.assets/1582444394566-1608485794544.png)

#### 安装并开启socket服务

首先在linux服务器node01上用yum 安装nc工具，==nc命令是netcat命令的简称==,它是用来设置路由器。我们可以利用它向某个端口发送数据。

~~~shell
yum -y install nc
~~~

执行命令向指定的端口发送数据(模拟socket)

~~~shell
nc -lk 9999 
~~~

#### pom.xml配置

~~~xml
<properties> <!--注意这里，设置了version,在后面就可以引用这些值了，如${scala.version}-->
        <scala.version>2.11.8</scala.version>
        <spark.version>2.3.3</spark.version> 
</properties>

 <dependencies>
        <dependency>
            <groupId>org.scala-lang</groupId>
            <artifactId>scala-library</artifactId>
            <version>${scala.version}</version>  <!--2.11.8-->
        </dependency>

        <dependency>
            <groupId>org.apache.spark</groupId>
            <artifactId>spark-streaming_2.11</artifactId>
            <version>${spark.version}</version> <!--2.3.3-->
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

#### 开发sparkStreaming程序

~~~scala
package com.jimmy.streaming

import org.apache.spark.streaming.dstream.ReceiverInputDStream
import org.apache.spark.{SparkConf, SparkContext}
import org.apache.spark.streaming.{Seconds, StreamingContext}

object MySocket {
  def main(args: Array[String]): Unit = {
    val conf=new SparkConf().setAppName("socketDemo").setMaster("local[2]")
    val sc=new SparkContext(conf)
    sc.setLogLevel("warn")
    val ssc=new StreamingContext(sc,Seconds(1))

    val value:ReceiverInputDStream[String] = ssc.socketTextStream("node01", 9999)
    val result=value.flatMap(x=>x.split(" ")).map(x=>(x,1)).reduceByKey((x,y)=>x+y)
    result.print()

    ssc.start() //开启流式计算
    ssc.awaitTermination()  //这个表示程序不会停止运行，除非手动中断
  }
}
~~~

#### 运行程序

运行上面的Scala程序后，在node01上模拟socket以不同的速度发送数据，输入一些单词，空格隔开（要跟代码设置的分隔符一致），如下图：

![image-20200423000846608](sparkstreaming.assets/image-20200423000846608-1608485794544.png)

然后观察IDEA的程序运行界面，会出现类似下面格式的输出信息，每隔1000ms(1s)就会打印一次信息，可以结合sparkstreaming架构流程来分析。

```
-------------------------------------------
Time: 1587571532000 ms
-------------------------------------------
(spark,2)
(hadoop,4)
-------------------------------------------
Time: 1587571533000 ms
-------------------------------------------
(,1)
(spark,5)
(hadoop,10)

-------------------------------------------
Time: 1587571534000 ms
-------------------------------------------

-------------------------------------------
Time: 1587571535000 ms
-------------------------------------------

-------------------------------------------
Time: 1587571536000 ms
-------------------------------------------
```

#### 思考问题

思考一个问题：在sparkstreaming中，能不能只设置一个线程来运行，如setMaster("local[1]")。

答案是不可以，因为Receiver本身就占用了一个线程，一个CPU同一时间只能运行一个线程，只设置一个CPU的话，Receiver线程会一直占用着这个cpu，所以没有cpu去执行计算任务。

#### 剖析

==每一个DStream只负责计算当前批次产生的数据，之前批次的数据，计算完成之后就不存在了。==

![image-20200423003440585](sparkstreaming.assets/image-20200423003440585-1608485794544.png)

## 数据源--HDFS

#### 需求

通过sparkStreaming监控hdfs上的目录，有新的文件产生，就把数据拉取过来进行处理

#### 业务处理流程图

![1582444992866](sparkstreaming.assets/1582444992866-1608485794544.png)

#### 创建监听目录

```
hdfs dfs -mkdir /dataStreamingDemo
```

#### 代码开发

~~~scala
package com.jimmy.streaming

import org.apache.log4j.{Level, Logger}
import org.apache.spark.streaming.dstream.ReceiverInputDStream
import org.apache.spark.{SparkConf, SparkContext}
import org.apache.spark.streaming.{Seconds, StreamingContext}

object MySocket {
  def main(args: Array[String]): Unit = {
    Logger.getLogger("org").setLevel(Level.ERROR)
    val conf=new SparkConf().setAppName("socketDemo").setMaster("local[2]")
    val sc=new SparkContext(conf)
    sc.setLogLevel("warn")
    val ssc=new StreamingContext(sc,Seconds(1))

    val value = ssc.textFileStream("hdfs://node01:8020/dataStreamingDemo")
    val result=value.flatMap(x=>x.split(" ")).map(x=>(x,1)).reduceByKey((x,y)=>x+y)
    result.print()

    ssc.start() //开启流式计算
    ssc.awaitTermination()  //这个表示程序不会停止运行，除非手动中断
  }
}
~~~

> 注意：
>
> 1. 

#### 运行程序

创建数据文件：

```
vi /tmp/words.txt

hadoop spark spark
flume flink hadoop hadoop
```

运行sparkStreaming程序,然后上传文件到hdfs的/dataStreamingDemo目录

```
hdfs dfs -put /tmp/words.txt /dataStreamingDemo
```

观察IDEA程序运行界面，输出结果大致如下：

```
Time: 1587583799000 ms
-------------------------------------------

-------------------------------------------
Time: 1587583800000 ms
-------------------------------------------
(flink,1)
(spark,2)
(hadoop,3)
(flume,1)

-------------------------------------------
Time: 1587583801000 ms
-------------------------------------------

-------------------------------------------
```

#### 报错问题

程序之前运行时，报错：[Exception in thread "main" java.lang.NoClassDefFoundError: org/apache/hadoop/fs/CanUnbuffer](https://www.cnblogs.com/dongxiucai/p/10245896.html)

这可能是因为pom依赖添加了hbase依赖的原因，导致出现一些异常，将hbase的依赖删掉就可以正常运行了。或者可以尝试将hbase的依赖放在hadoop依赖的后面。

在该程序中，正确的pom.xml的配置如下：

```xml
<properties> <!--注意这里，设置了version,在后面就可以引用这些值了，如${scala.version}-->
        <scala.version>2.11.8</scala.version>
        <spark.version>2.3.3</spark.version> 
</properties>

 <dependencies>
        <dependency>
            <groupId>org.scala-lang</groupId>
            <artifactId>scala-library</artifactId>
            <version>${scala.version}</version>  <!--2.11.8-->
        </dependency>

        <dependency>
            <groupId>org.apache.spark</groupId>
            <artifactId>spark-streaming_2.11</artifactId>
            <version>${spark.version}</version> <!--2.3.3-->
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



## 自定义数据源TODO

~~~scala
/**
  * 自定义一个Receiver，这个Receiver从socket中接收数据
  * 使用方式：nc -lk 8888
  */
package com.kaikeba.streaming

import java.io.{BufferedReader, InputStreamReader}
import java.net.Socket
import java.nio.charset.StandardCharsets

import org.apache.spark.SparkConf
import org.apache.spark.internal.Logging
import org.apache.spark.storage.StorageLevel
import org.apache.spark.streaming.{Seconds, StreamingContext}
import org.apache.spark.streaming.dstream.{DStream, ReceiverInputDStream}
import org.apache.spark.streaming.receiver.Receiver

/**
  * 自定义数据源
  */
object CustomReceiver {

  def main(args: Array[String]): Unit = {
   Logger.getLogger("org").setLevel(Level.ERROR)

    // todo: 1、创建SparkConf对象
    val sparkConf: SparkConf = new SparkConf()
                                              .setAppName("CustomReceiver")
                                              .setMaster("local[2]")

    // todo: 2、创建StreamingContext对象
    val ssc = new StreamingContext(sparkConf,Seconds(2))

    //todo: 3、调用 receiverStream api，将自定义的Receiver传进去
   val receiverStream = ssc.receiverStream(new CustomReceiver("node01",8888))

    //todo: 4、对数据进行处理
    val result: DStream[(String, Int)] = receiverStream
                                                      .flatMap(_.split(" "))
                                                      .map((_,1))
                                                      .reduceByKey(_+_)
    //todo: 5、打印结果
    result.print()

    //todo: 6、开启流式计算
    ssc.start()
    ssc.awaitTermination()

  }

}

/**
  * 自定义source数据源
  * @param host
  * @param port
  */
class CustomReceiver(host:String,port:Int) extends Receiver[String](StorageLevel.MEMORY_AND_DISK_SER) with Logging{
  override def onStart(): Unit ={
    //启动一个线程，开始接受数据
      new Thread("socket receiver"){
        override def run(): Unit = {
            receive()
          }
      }.start()
  }

  /** Create a socket connection and receive data until receiver is stopped */
  private def receive() {
    var socket: Socket = null
    var userInput: String = null
    try {
      logInfo("Connecting to " + host + ":" + port)
      socket = new Socket(host, port)
      logInfo("Connected to " + host + ":" + port)
      val reader = new BufferedReader(
        new InputStreamReader(socket.getInputStream(), StandardCharsets.UTF_8))

      userInput = reader.readLine()
      while(!isStopped && userInput != null) {
        store(userInput)
        userInput = reader.readLine()
      }
      reader.close()
      socket.close()
      logInfo("Stopped receiving")
      restart("Trying to connect again")
    } catch {
      case e: java.net.ConnectException =>
        restart("Error connecting to " + host + ":" + port, e)
      case t: Throwable =>
        restart("Error receiving data", t)
    }
}

  override def onStop(): Unit ={

  }
}
~~~

## 集群运行sparkStreaming程序

自己开发wordcount程序，然后打包上传到集群，并打开任务运行界面，查看一下任务运行情况。

```scala
package com.jimmy.streaming

import org.apache.log4j.{Level, Logger}
import org.apache.spark.{SparkConf, SparkContext}
import org.apache.spark.streaming.{Seconds, StreamingContext}

object MySocket {
  def main(args: Array[String]): Unit = {
    Logger.getLogger("org").setLevel(Level.ERROR)
    val conf=new SparkConf().setAppName("socketDemo")
    val sc=new SparkContext(conf)
    sc.setLogLevel("warn")
    val ssc=new StreamingContext(sc,Seconds(5))

    val value = ssc.textFileStream(args(0))
    val result=value.flatMap(x=>x.split(" ")).map(x=>(x,1)).reduceByKey((x,y)=>x+y)
    result.print()

    ssc.start() //开启流式计算
    ssc.awaitTermination()  //这个表示程序不会停止运行，除非手动中断
  }
}
```

运行jar包

```sh
spark-submit --class com.jimmy.streaming.MySocket --master spark://node01:7077 --executor-memory 1g --total-executor-cores 2 originaMySparkDemo-1.0-SNAPSHOT.jar /dataStreamingDemo
```

上传文件到监听目录:

```
hdfs dfs -put /tmp/words.txt /dataStreamingDemo/
```

观察效果：

![image-20200423035855381](sparkstreaming.assets/image-20200423035855381-1608485794544.png)

查看sparkStreaming的任务运行界面，可以看到一些图表等：

![image-20200423035950826](sparkstreaming.assets/image-20200423035950826-1608485794544.png)

查看Executors，可以发现，driver运行在node01上

![image-20200423040120447](sparkstreaming.assets/image-20200423040120447-1608485794545.png)



## Transformation 高级算子

#### updateStateByKey——统计分析所有批次

需求: sparkStreaming接受socket数据实现所有批次的单词次数累加

~~~scala
package com.jimmy.streaming

import org.apache.spark.streaming.{Seconds, StreamingContext}
import org.apache.spark.{SparkConf, SparkContext}

object UpdateDemo {
  def main(args: Array[String]): Unit = {
    val sparkconf=new SparkConf().setAppName("Demo").setMaster("local[2]")
    val sc=new SparkContext(sparkconf)
    val ssc=new StreamingContext(sc,Seconds(2))
    sc.setLogLevel("warn")

    ssc.checkpoint("hdfs://node01:8020/ck")  //缓存历史批次的数据

    val data=ssc.socketTextStream("node01",9999).flatMap(x=>x.split(" ")).map(x=>(x,1))
    val result=data.updateStateByKey(myUpdateFunc)

    result.print()
    ssc.start()
    ssc.awaitTermination()
  }

  def myUpdateFunc(currentValue:Seq[Int],historyValues:Option[Int]):Option[Int]={
    val newValue=currentValue.sum+historyValues.getOrElse(0)
    Some(newValue)
  }
}
~~~

源码分析：

> 查看updateStateByKey的源码如下：
>
> ```scala
> def updateStateByKey[S: ClassTag](
>    updateFunc: (Seq[V], Option[S]) => Option[S],
>    numPartitions: Int
>  ): DStream[(K, S)] = ssc.withScope {
>  updateStateByKey(updateFunc, defaultPartitioner(numPartitions))
> }
> ```
>
> 从源码可知，该算子需要传入一个函数：(Seq[V], Option[S]) => Option[S],所以我们需要自己自定义一个符合参数类型要求的函数：
>
> ```scala
> def myUpdateFunc(currentValue:Seq[Int],historyValues:Option[Int]):Option[Int]={
>  val newValue=currentValue.sum+historyValues.getOrElse(0)
>  Some(newValue)  //将单词在所有批次出现的总次数
> }
> ```
>
> 1. 这个myUpdateFunc函数传入updateStateByKey后，将会依次作用于所有批次的不同单词。
> 2. currentValue:当前批次中==每一个单词出现的所有的1的集合==，如List(1,1,1,1),对该集合进行.sum操作就可以获得某个单词在当前批次出现的次数。
> 3. historyValues:之前批次中==每个单词出现的总次数==,Option类型表示存在或者不存在。Some表示存在有值，None表示没有

运行程序：

> 1、启动socket服务，nc -lk 9999，运行sparkStreaming程序
>
> 2、socket发送hadoop hadoop hadoop hadoop,此时程序界面显示如下，可以发现，打印的信息是所有批次的综合
>
> ```
> -------------------------------------------
> Time: 1587634964000 ms
> -------------------------------------------
> (hadoop,4)
> 
> -------------------------------------------
> Time: 1587634966000 ms
> -------------------------------------------
> (hadoop,4)
> 
> -------------------------------------------
> Time: 1587634968000 ms
> -------------------------------------------
> (hadoop,4)
> ```
>
> 3、socket继续发送flink spark hadoop，此时程序界面显示如下，可以发现，当前批次与历史批次的数据进行了汇总再输出
>
> ```
> -------------------------------------------
> Time: 1587634980000 ms
> -------------------------------------------
> (flink,1)
> (spark,1)
> (hadoop,5)
> 
> -------------------------------------------
> Time: 1587634982000 ms
> -------------------------------------------
> (flink,1)
> (spark,1)
> (hadoop,5)
> ```
>
> 



#### mapWithState——统计分析所有批次

mapWithState也是可以实现所有批次的累加，但是它相对于updateStateByKey，==性能更高==。

需求: sparkStreaming接受socket数据实现所有批次的单词次数累加

```scala
package com.jimmy.streaming

import org.apache.spark.rdd.RDD
import org.apache.spark.streaming.dstream.{DStream, MapWithStateDStream}
import org.apache.spark.streaming.{Durations, Seconds, State, StateSpec, StreamingContext, Time}
import org.apache.spark.{SparkConf, SparkContext}

object mapDemo1 {
  def main(args: Array[String]): Unit = {
    val sparkconf=new SparkConf().setAppName("Demo").setMaster("local[2]")
    val sc=new SparkContext(sparkconf)
    val ssc=new StreamingContext(sc,Seconds(2))
    sc.setLogLevel("warn")

    ssc.checkpoint("hdfs://node01:8020/ck2")

    //定义一个用于初始化的RDD
    val initRDD: RDD[(String, Int)] = ssc.sparkContext.parallelize((List(("hadoop",10),("spark",20))))
    val data:DStream[(String,Int)]=ssc.socketTextStream("node01",9999).flatMap(_.split(" ")).map((_,1))
    val MyStateSpec=StateSpec.function((time:Time,key:String,currentValue:Option[Int],historyState:State[Int])=>{
      val newValue=currentValue.getOrElse(0)+historyState.getOption().getOrElse(0)
      val output=(key,newValue)
      if(!historyState.isTimingOut()){
        historyState.update(newValue)
      }
      Some(output)
    }).initialState(initRDD).timeout(Durations.seconds(5))
    val result:MapWithStateDStream[String, Int, Int, (String, Int)]=data.mapWithState(MyStateSpec)

    result.stateSnapshots().print()
    ssc.start()
    ssc.awaitTermination()
  }
}
```

源码分析：

> 查看mapWithState的源码，如下：
>
> ```scala
> def mapWithState[StateType: ClassTag, MappedType: ClassTag](
>    spec: StateSpec[K, V, StateType, MappedType]
>  ): MapWithStateDStream[K, V, StateType, MappedType] = {
>  new MapWithStateDStreamImpl[K, V, StateType, MappedType](
>    self,
>    spec.asInstanceOf[StateSpecImpl[K, V, StateType, MappedType]]
>  )
> }
> ```
>
> mapWithState算子需要一个参数：spec: StateSpec[K, V, StateType, MappedType]
>
> StateSpec是一个object，里面有一个function方法，这个方法可以返回一个StateSpec[KeyType, ValueType, StateType, MappedType]，正好是mapWithState算子需要的参数类型，源码如下：
>
> ```scala
> object StateSpec {
> 
> def function[KeyType, ValueType, StateType, MappedType](
>    mappingFunction: (Time, KeyType, Option[ValueType], State[StateType]) => Option[MappedType]
>  ): StateSpec[KeyType, ValueType, StateType, MappedType] = {
>  ClosureCleaner.clean(mappingFunction, checkSerializable = true)
>  new StateSpecImpl(mappingFunction)
> }
> 
> ```
>
> function方法需要一个函数作为参数：mappingFunction: (Time, KeyType, Option[ValueType], State[StateType]) => Option[MappedType]
>
> 下面是代码中自己定义function方法的代码：
>
> ```scala
> val MyStateSpec=StateSpec.function((time:Time,key:String,currentValue:Option[Int],historyState:State[Int])=>{
>    val newValue=currentValue.getOrElse(0)+historyState.getOption().getOrElse(0)
>    val output=(key,newValue)
>    if(!historyState.isTimingOut()){
>      historyState.update(newValue)
>    }
>    Some(output)
>  }).initialState(initRDD).timeout(Durations.seconds(5))
> ```
>
> key:String是单词，currentValue:Option[Int]是该单词在当前批次的出现次数，historyState:State[Int]是历史批次的次数，封装在State里面。
>
> 使用Some封装output，返回出去。
>
> .initialState(initRDD)用于进行初始化，initRDD是自己定义的。
>
> .timeout(Durations.seconds(5))表示如果某个单词（key)超过5s没有出现，该key及其状态state将会被移除掉。
>
> historyState.update(newValue)是用来更新历史批次的state的，if(!historyState.isTimingOut())表示如果某单词（key)超时没有出现，就不更新其state了。
>
> ==在这里，打印时，最好使用result.stateSnapshots().print()方式而不是result.print()==
>
> 单纯使用print()的效果是下面这样的：
>
> ```sh
> (flink,1)
> (hadoop,11)
> (hadoop,12) #单词的次数加1就会打印一次，不太好。
> ```
>
> 

运行程序：

> 1、打开socket,nc -lk 9999,运行程序，一开始输出结果如下：
>
> ```
> -------------------------------------------
> Time: 1587654820000 ms
> -------------------------------------------
> (spark,20)
> (hadoop,10)
> ```
>
> 2、socket发送数据：hadoop hadoop，输出如下，可以看到，hadoop在初始值10的基础上加了2，并且spark在5s之后被移除了。
>
> ```
> -------------------------------------------
> Time: 1587654834000 ms
> -------------------------------------------
> (spark,20)
> (hadoop,12)
> 
> -------------------------------------------
> Time: 1587654836000 ms
> -------------------------------------------
> (spark,20)
> (hadoop,12)
> 
> -------------------------------------------
> Time: 1587654838000 ms
> -------------------------------------------
> (hadoop,12)
> ```
>
> 



#### transform——对DStream中的RDD进行操作

需求: 获取每一个批次中单词出现次数最多的前3位

~~~scala
import org.apache.spark.streaming.dstream.DStream
import org.apache.spark.streaming.{Seconds, StreamingContext}
import org.apache.spark.{SparkConf, SparkContext}

object Demo {
  def main(args: Array[String]): Unit = {
    val sparkconf=new SparkConf().setAppName("Demo").setMaster("local[2]")
    val sc=new SparkContext(sparkconf)
    val ssc=new StreamingContext(sc,Seconds(2))
    sc.setLogLevel("warn")
    ssc.checkpoint("hdfs://node01:8020/ck2")

    val data:DStream[(String,Int)]=ssc.socketTextStream("node01",9999).
      flatMap(_.split(" ")).map((_,1)).reduceByKey(_+_)
    val result:DStream[(String,Int)]=data.transform(rdd=>{
      val sortrdd=rdd.sortBy(x=>x._2,false)
      val top3: Array[(String, Int)] =sortrdd.take(3)
      println("=====top3结果====")
      top3.foreach(println)
      println("=====top3结果====")
      println("原始数据:")
      //不能将top3作为结果	返回，因为不是RDD[(String, Int)]类型
      sortrdd
    })

    result.print()
    ssc.start()
    ssc.awaitTermination()
  }
}
~~~

运行结果：

```scala
=====top3结果====
(hadoop,3)
(flink,2)
(spark,2)
=====top3结果====
原始数据:
-------------------------------------------
Time: 1587660264000 ms
-------------------------------------------
(hadoop,3)
(flink,2)
(spark,2)
(hive,1)
(flume,1)
```



####  Window操作

如果这样设置：val ssc=new StreamingContext(sc,Seconds(2))，就代表每隔2s处理2s的数据，那么现在的需求是：实现每隔4秒统计6秒的数据。

注意：每隔2s处理2s的数据是在处理速度足够快的基础上的，不一定2s就能处理2s的数据，如果2s内处理不完依然会阻塞。

~~~scala
import org.apache.spark.streaming.dstream.DStream
import org.apache.spark.streaming.{Seconds, StreamingContext}
import org.apache.spark.{SparkConf, SparkContext}

object Demo1 {
  def main(args: Array[String]): Unit = {
    val sparkconf=new SparkConf().setAppName("Demo").setMaster("local[2]")
    val sc=new SparkContext(sparkconf)
    val ssc=new StreamingContext(sc,Seconds(2))
    sc.setLogLevel("warn")
    ssc.checkpoint("hdfs://node01:8020/ck2")

    val data:DStream[(String,Int)]=ssc.socketTextStream("node01",9999).               
      flatMap(_.split(" ")).map((_,1))
    val result=data.reduceByKeyAndWindow((x:Int,y:Int)=>x+y,Seconds(6),Seconds(4))
    result.print()
    ssc.start()
    ssc.awaitTermination()
  }
}
~~~

> 查看reduceByKeyAndWindow的源码：
>
> ```scala
> def reduceByKeyAndWindow(
>    reduceFunc: (V, V) => V,
>    windowDuration: Duration,
>    slideDuration: Duration
>  ): DStream[(K, V)] = ssc.withScope {
>  reduceByKeyAndWindow(reduceFunc, windowDuration, 
>                       slideDuration, defaultPartitioner())
> }
> ```
>
> 该方法需要三个参数：
>    reduceFunc: (V, V) => V,  ---> 就是一个函数
>    windowDuration: Duration, ---> 窗口的大小(时间单位)，该窗口会包含N个批次的数据
>    slideDuration: Duration   ---> 滑动窗口的时间间隔，表示每隔多久计算一次
>
> 以代码中的Seconds(6),Seconds(4)为例，==这样做有个弊端：有些数据可能被重复处理了。因此，我们通常将窗口的大小与滑动窗口的时间间隔设置为一致，如Seconds(4),Seconds(4)==
>
> <img src="sparkstreaming.assets/image-20200424015743703.png"/>
>
> 运行结果如下,可以看到，数据是每隔4s会被处理一次。
>
> ```
> -------------------------------------------
> Time: 1587662178000 ms
> -------------------------------------------
> 
> -------------------------------------------
> Time: 1587662182000 ms
> -------------------------------------------
> 
> -------------------------------------------
> Time: 1587662186000 ms
> -------------------------------------------
> 
> -------------------------------------------
> Time: 1587662190000 ms
> -------------------------------------------
> (hive,2)
> (flink,4)
> (spark,4)
> (hadoop,6)
> (flume,2)
> ```
>
> 

## Output 算子

####  foreachRDD

需求：将WordCount案例中得到的结果通过foreachRDD保存结果到mysql中

在node03登录mysql,创建test database,table wordcount

```sql
create database test;
use test;
create tabel wordcount(word varchar(30),count int);
```

添加pom依赖：

```xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>5.1.38</version>
</dependency>
```

开发代码，一共有4个方案：

~~~scala
package com.jimmy.streaming

import java.sql.DriverManager

import org.apache.spark.streaming.dstream.DStream
import org.apache.spark.streaming.{Seconds, StreamingContext}
import org.apache.spark.{SparkConf, SparkContext}

object Demo1 {
  def main(args: Array[String]): Unit = {
    val sparkconf=new SparkConf().setAppName("Demo").setMaster("local[2]")
    val sc=new SparkContext(sparkconf)
    val ssc=new StreamingContext(sc,Seconds(2))
    sc.setLogLevel("warn")

    val data:DStream[(String,Int)]=ssc.socketTextStream("node01",9999).
      flatMap(_.split(" ")).map((_,1)).reduceByKey(_+_)

    //===============方案1：会出错====================
    data.foreachRDD(rdd=>{
      //注意这里创建的对象都是在Driver端!!!
      val conne=DriverManager.getConnection("jdbc:mysql://node03:3306/test",
        "root","123456")
      val statement=conne.prepareStatement(
        "insert into wordcount(word,count) values(?,?)")
      rdd.foreach(record=>{
        //这一块代码的执行是在executor端，需要进行网络传输，会出现task not serializable异常
        statement.setString(1,record._1)
        statement.setInt(2,record._2)
        statement.execute()
        statement.close()
        conne.close()
      })

    })

    //===============方案2：性能较低====================
    data.foreachRDD(rdd=>{
      rdd.foreach(record=>{
        val conne=DriverManager.getConnection("jdbc:mysql://node03:3306/test", "root","123456")
        val statement=conne.prepareStatement(s"insert into wordcount(word,count) values(?,?)")
        statement.setString(1,record._1)
        statement.setInt(2,record._2)
        statement.execute()
        statement.close()
        conne.close()
      })

    })

    //===============方案3：性能高(推荐）====================
    data.foreachRDD(rdd=>{
      rdd.foreachPartition(iter=>{
        val conne=DriverManager.getConnection("jdbc:mysql://node03:3306/test", "root","123456")
        val statement=conne.prepareStatement(s"insert into wordcount(word,count) values(?,?)")
        conne.setAutoCommit(false) //关闭自动提交！！！

        iter.foreach(record=>{
          statement.setString(1,record._1)
          statement.setInt(2,record._2)
          statement.addBatch()  //添加到一个批次
        })

        statement.executeBatch() //批量提交该分区所有数据
        statement.close()
        conne.close()
      })

    })

    //===============方案4：性能更高====================
    data.foreachRDD(rdd=>{
      rdd.foreachPartition(iter=>{
        val conne=DriverManager.getConnection("jdbc:mysql://node03:3306/test", "root","123456")
        val statement=conne.prepareStatement(s"insert into wordcount(word,count) values(?,?)")
        iter.foreach(record=>{
          statement.setString(1,record._1)
          statement.setInt(2,record._2)
          statement.execute()
        })
        statement.close()
        conne.close()
      })
  
    })

    data.print()
    ssc.start()
    ssc.awaitTermination()
  }
}

~~~

运行结果：

```sql
mysql> select * from wordcount;
+--------+-------+
| word   | count |
+--------+-------+
| hive   |     1 |
| flink  |     2 |
| spark  |     2 |
| hadoop |     3 |
| flume  |     1 |
+--------+-------+
```



## Checkpoint

checkpoint不仅仅可以保存运算结果中的数据，还可以存储Driver端的信息

==通过checkpoint可以实现Driver端的高可用==

~~~scala
package com.jimmy.streaming

import org.apache.spark.streaming.{Seconds, StreamingContext}
import org.apache.spark.{SparkConf, SparkContext}

object DemoCheckpoint {
  val checkpointPath="hdfs://node01:8020/ckDir"

  def MycreatingFunc():StreamingContext={
    val sparkconf=new SparkConf().setAppName("Demo").setMaster("local[2]")
    val sc=new SparkContext(sparkconf)
    val ssc=new StreamingContext(sc,Seconds(2))
    sc.setLogLevel("warn")

    ssc.checkpoint(checkpointPath)  //缓存历史批次的数据

    val data=ssc.socketTextStream("node01",9999).
      flatMap(x=>x.split(" ")).map(x=>(x,1))
    val result=data.updateStateByKey(myUpdateFunc)
    result.print()
    ssc
  }

  def main(args: Array[String]): Unit = {
    val ssc=StreamingContext.getOrCreate(checkpointPath,MycreatingFunc)
    ssc.start()
    ssc.awaitTermination()
  }

  def myUpdateFunc(currentValue:Seq[Int],historyValues:Option[Int]):Option[Int]={
    val newValue=currentValue.sum+historyValues.getOrElse(0)
    Some(newValue)
  }
}
~~~

运行测试

> 运行程序，socket发送数据: hadoop flink,输出信息如下：
>
> ```
> -------------------------------------------
> Time: 1587670986000 ms
> -------------------------------------------
> (flink,1)
> (hadoop,1)
> ```
>
> 此时，==终止程序的运行，然后重新启动程序==，继续socket发送数据hadoop flink,  观察输出：
>
> ```
> -------------------------------------------
> Time: 1587670988000 ms
> -------------------------------------------
> (flink,2)
> (hadoop,2)
> ```
>
> 可以发现，即使程序中途停止运行了，当程序重新启动时，依然能够接着上次的结果继续运行计算。
>
> ==Checkpoint实现Driver的高可用的原理：==
>
> 1. val ssc=StreamingContext.getOrCreate(checkpointPath,MycreatingFunc)尝试创建StreamingContext时，==先去checkpointPath里找，看看有没有Driver的元数据信息，没有的话就根据MycreatingFunc方法来获取一个StreamingContext==
> 2. 然后程序开始运行，运行时会把之前的批次的数据缓存到checkpointPath，还会Driver的信息一并存下来。
> 3. 如果程序中途停掉后，再次启动，依然会先去checkpointPath里找，看看有没有Driver的元数据信息，有就根据这些信息重启Driver，运行任务也会接着上次的进度来运行。

## SparkStreaming和SparkSQL整合

##### 为什么整合？

<img src="sparkstreaming.assets/image-20200424040141974.png"/>

##### 代码开发

pom.xml里面添加

~~~xml
<dependency>
     <groupId>org.apache.spark</groupId>
     <artifactId>spark-sql_2.11</artifactId>
     <version>2.3.3</version>
</dependency>
~~~

代码开发

~~~scala
package com.kaikeba.streaming

import org.apache.log4j.{Level, Logger}
import org.apache.spark.SparkConf
import org.apache.spark.sql.{DataFrame, SparkSession}
import org.apache.spark.streaming.{Seconds, StreamingContext}
import org.apache.spark.streaming.dstream.{DStream, ReceiverInputDStream}

/**
  * sparkStreaming整合sparksql
  */
object SocketWordCountForeachRDDDataFrame {

  def main(args: Array[String]): Unit = {
    Logger.getLogger("org").setLevel(Level.ERROR)

    // todo: 1、创建SparkConf对象
    val sparkConf: SparkConf = new SparkConf().setAppName("NetworkWordCountForeachRDDDataFrame").setMaster("local[2]")

    // todo: 2、创建StreamingContext对象
    val ssc = new StreamingContext(sparkConf,Seconds(2))

    //todo: 3、接受socket数据
    val socketTextStream: ReceiverInputDStream[String] = ssc.socketTextStream("node01",9999)

    //todo: 4、对数据进行处理
    val words: DStream[String] = socketTextStream.flatMap(_.split(" "))

    //todo: 5、对DStream进行处理，将RDD转换成DataFrame
      words.foreachRDD(rdd=>{

          //获取得到sparkSessin，由于将RDD转换成DataFrame需要用到SparkSession对象
        val sparkSession: SparkSession = SparkSession.builder().config(rdd.sparkContext.getConf).getOrCreate()
        import sparkSession.implicits._
        val dataFrame: DataFrame = rdd.toDF("word")

        //将dataFrame注册成表
         dataFrame.createOrReplaceTempView("words")

        //统计每个单词出现的次数
         val result: DataFrame = sparkSession.sql("select word,count(*) as count from words group by word")

         //展示结果
        result.show()

      })

    //todo: 6、开启流式计算
    ssc.start()
    ssc.awaitTermination()


  }
}

~~~



## SparkStreaming容错

#### SparkStreaming运行流程回顾

![1567414277097](sparkstreaming.assets/1567414277097-1584924072316-1608485794545.png) 

#### Executor失败

> 在==Receiver接收到了数据之后，会将数据复制一份到其它的Executor的内存中==。
>
> 比如，在使用ssc.socketTextStream("node01",9999)接收数据时，默认会将数据复制一份到其它的Executor内存中，是因为该方法有一个缺省参数：storageLevel=StorageLevel.MEMORY_AND_DISK_2。
>
> 在两台机器的内存中，==如果一台机器上的Executor挂了，立即切换到另一台机器上的Executor，这种方式一般情况下非常可靠且没有切换时间==。
>
> Tasks和Receiver自动的重启，不需要做任何的配置
>
> <img src="sparkstreaming.assets/1567414655887-1584924078479.png"/>
>
> 

#### Driver失败

![1567414739556](sparkstreaming.assets/1567414739556-1584924084233-1608485794545.png)

用checkpoint机制恢复失败的Driver。每个Job生成之前进行checkpoint，在Job生成之后再进行checkpoint，如果出错的话就从checkpoint中恢复。

定期的将Driver信息写入到HDFS中。

![1567414846715](sparkstreaming.assets/1567414846715-1584924092832-1608485794545.png)

###### 步骤一：设置自动重启Driver程序

**Standalone：**

```shell
在spark-submit中增加以下两个参数：
--deploy-mode cluster
--supervise #失败后是否重启Driver

使用示例：
spark-submit \
--master spark://node01:7077 \
--deploy-mode cluster \
--supervise \
--class com.kaikeba.streaming.Demo \
--executor-memory 1g \
--total-executor-cores 2 \
original-sparkStreamingStudy-1.0-SNAPSHOT.jar 
```

**Yarn：**

```shell
在spark-submit中增加以下参数：
--deploy-mode cluster
在yarn配置中设置yarn.resourcemanager.am.max-attemps参数 ,默认为2，表示允许Driver挂掉之后重启的允许失败的次数，例如：

<property>
  <name>yarn.resourcemanager.am.max-attempts</name>
  <value>4</value>  
  <description>
    The maximum number of application master execution attempts.
  </description>
</property>


使用示例：
spark-submit \
--master yarn \
--deploy-mode cluster \
--class com.kaikeba.streaming.Demo \
--executor-memory 1g \
--total-executor-cores 2 \
original-sparkStreamingStudy-1.0-SNAPSHOT.jar 
```

> 提交后，==Driver的进程名称是DriverWrapper==
>
> ![image-20200424042337680](sparkstreaming.assets/image-20200424042337680-1608485794545.png)
>
> 在后面若想要测试Driver挂掉后的重启时，可以通过kill -9将Driver程序停掉。

###### 步骤二：设置HDFS的checkpoint目录

```scala
streamingContext.setCheckpoint(hdfsDirectory) 
```

###### 步骤三：代码实现

```scala
// Function to create and setup a new StreamingContext
def functionToCreateContext(): StreamingContext = {
  val ssc = new StreamingContext(...)   // new context
  val lines = ssc.socketTextStream(...) // create DStreams
  ...
  ssc.checkpoint(checkpointDirectory)   // set checkpoint directory
  ssc
}

// Get StreamingContext from checkpoint data or create a new one
val context = StreamingContext.getOrCreate(checkpointDirectory, functionToCreateContext _)

// Do additional setup on context that needs to be done,
// irrespective of whether it is being started or restarted
context. ...

// Start the context
context.start()
context.awaitTermination()
```

#### 数据丢失如何处理

> 利用WAL把数据写入到HDFS中
>
> <img src="sparkstreaming.assets/1567415902458.png"/>
>
> 步骤一：设置checkpoint目录
>
> ```scala
> streamingContext.setCheckpoint(hdfsDirectory)
> ```
>
> 步骤二：开启WAL日志
>
> ```
> sparkConf.set("spark.streaming.receiver.writeAheadLog.enable", "true")
> ```
>
> ```
> WAL使用在文件系统和数据库中用于数据操作的持久性，先把数据写到一个持久化的日志中，然后对数据做操作，如果操作过程中系统挂了，恢复的时候可以重新读取日志文件再次进行操作。
> 
> 对于像kafka和flume这些使用接收器来接收数据的数据源。接收器作为一个长时间的任务运行在executor中，负责从数据源接收数据，如果数据源支持的话，向数据源确认接收到数据，然后把数据存储在executor的内存中，然后在exector上运行任务处理这些数据。
> 
> 如果wal启用了，所有接收到的数据会保存到一个日志文件中去（HDFS), 这样保存接收数据的持久性，此外，如果只有在数据写入到log中之后接收器才向数据源确认，这样driver重启后那些保存在内存中但是没有写入到log中的数据将会重新发送，这两点保证的数据的无丢失。
> ```
>
> 步骤三：需要reliable receiver
>
> ==如果Receiver接收到数据后，备份到HDFS或磁盘中的数据也丢失了，这时候怎么办？这时候我们就需要一个可靠的数据源了，何为可靠？可靠就是如果我数据丢失了，我依然能够重新去数据源获取数据。==
>
> 比如==Kafka就可以实现这个==，kafka可以记住消费数据的偏移量offset。
>
> ```
> 当数据写完了WAL后，才告诉数据源数据已经消费，对于没有告诉数据源的数据，可以从数据源中重新消费数据
> ```
>
> 步骤四：取消备份
>
> 开启了WAL日志后，可以把storageLevel设为StorageLevel.MEMORY_AND_DISK了。
>
> ```
> 使用StorageLevel.MEMORY_AND_DISK_SER来存储数据源，不需要后缀为2的策略了，因为HDFS已经是多副本了。
> ```
>
> ![1567416495877](sparkstreaming.assets/1567416495877-1608485794545.png)
>
> ```
> Reliable Receiver   : 当数据接收到，并且已经备份存储后，再发送回执给数据源
> Unreliable Receiver : 不发送回执给数据源
> ```
>
> 



#### 当一个task很慢容错

![1567417919912](sparkstreaming.assets/1567417919912-1608485794545.png)

开启推测机制：

1. 设置spark.speculation=true后，会开启推测机制，每隔一段时间来检查有哪些正在运行的task需要重新调度，时间间隔默认为：spark.speculation.interval=100ms。
2. 假设总的task有10个，成功的task的数量 > 0.75 * 10（spark.speculation.quantile=0.75），且正在运行的task的运行时间 > 1.5 * 成功运行task的平均时间（spark.speculation.multiplier=1.5），则这个正在运行的task需要重新等待调度。
3. 开启其它的task来运行这些task,此时会有多个task同时做着同样的任务，谁先完成就用谁的。

![Task推测机制](sparkstreaming.assets/Task推测机制-1608485794545.png)

注意：

在分布式环境中导致某个Task执行缓慢的情况有很多，负载不均、程序bug、资源不均、数据倾斜等，而且这些情况在分布式任务计算环境中是常态。==Speculative Task这种以空间换时间的思路对计算资源是种压榨，同时如果Speculative Task本身也变成了Slow Task会导致情况进一步恶化==。



## SparkStreaming语义

有三种语义：

~~~
(1) At most once  一条记录要么被处理一次，要么没有被处理

(2) At least once 一条记录可能被处理一次或者多次，可能会重复处理

(3) Exactly once 一条记录只被处理一次
~~~



## SparkStreaming与Kafka整合

SparkStreaming整合Kafka官方文档：http://spark.apache.org/docs/2.3.3/streaming-kafka-integration.html

Kafka在0.8和0.10（1.0）版本提供了新的消费者Api,可以进行与sparkStreaming的整合。0.8版本的已经过时了，而且在spark在2.3.0版本后，已经不再支持kafka 0.8。	

对于spark-streaming-kafka-0-8，支持Receiver Dstream和Direct Dstream(直连)

对于spark-streaming-kafka-0-10，不再支持Receiver Dstream了。

![image-20200424142427376](sparkstreaming.assets/image-20200424142427376-1608485794545.png)

因为我们使用的是kafka 1.0，spark 2.3.3,所以选择spark-streaming-kafka-0-10。

点击spark-streaming-kafka-0-10，查看整合方式，如下，只需要添加依赖即可。

![image-20200424143312397](sparkstreaming.assets/image-20200424143312397-1608485794545.png)

kafka-0.8: 默认消费消息的偏移量是保存在zk集群上，默认自动提交偏移量到zk上

kafka-0.10：默认消费消息的偏移量是保存在kafka集群内置的topic中，默认自动提交偏移量到kafka集群上



## 整合案例1：sparkStreaming与Kafka-0-8(Receiver) 不推荐

> 此方法使用Receiver接收数据。==Receiver是使用Kafka高级消费者API实现的==。与所有接收器一样，从Kafka通过Receiver接收的数据存储在Spark执行器中，然后由Spark Streaming启动的作业处理数据。
>
> 但是在默认配置下，此方法可能会在失败时丢失数据（请参阅[接收器可靠性](http://spark.apache.org/docs/2.3.3/streaming-programming-guide.html#receiver-reliability)）。
>
> ![image-20200424154359505](sparkstreaming.assets/image-20200424154359505-1608485794545.png)
>
> ==为确保零数据丢失，必须在Spark Streaming中另外启用Write Ahead Logs==（在Spark 1.2中引入）。这将同步保存所有收到的Kafka将数据写入分布式文件系统（例如HDFS）上的预写日志，以便在发生故障时可以恢复所有数据，但是==性能不好==。
>
> ==性能不好的原因：==
>
> 1. Receiver只是一个线程，只是用一个Receiver去消费kafka一个topic的多个分区的数据，无疑是压力很大的。
> 2. WAL预写日志需要将数据写入到HDFS中，性能也会受到影响。
>
> ==Receiver-Based Approach示意图：==
>
> ![image-20200424170120758](sparkstreaming.assets/image-20200424170120758-1608485794545.png)
>
>  

##### 第一步：添加pom依赖：

~~~xml
<dependency>
       <groupId>org.apache.spark</groupId>
       <artifactId>spark-streaming-kafka-0-8_2.11</artifactId>
       <version>2.3.3</version>
</dependency>        
~~~

##### 第二步：启动kafka集群及创建topic

```sh
[hadoop@node01 ~]$ sh bin/kafkaCluster.sh start
[hadoop@node01 ~]$ kafka-topics.sh --create --partitions 3 --replication-factor 2 --topic KStreaming --zookeeper node01:2181,node02:2181,node03:2181
```

##### 第三步：开发程序：

核心代码：

~~~scala
 import org.apache.spark.streaming.kafka._

 val kafkaStream = KafkaUtils.createStream(streamingContext,
     [ZK quorum], [consumer group id], [per-topic number of Kafka partitions to consume])
~~~

代码开发：sparkStreaming使用kafka 0.8API基于recevier来接受消息

0.8 的kafka的offset是保存在zookeeper集群上的。所以要指定zookeeper集群地址。

注意：Kafka中的topic的partition，与Spark中的RDD的partition是没有关系的。所以，在KafkaUtils.createStream()中，提高partition的数量，==只会在Receiver中增加一个读取partition的线程的数量。不会增加Spark处理数据的并行度==。如：val topics=Map("KStreaming"->1)

~~~scala
import org.apache.log4j.{Level, Logger}
import org.apache.spark.streaming.dstream.{DStream, ReceiverInputDStream}
import org.apache.spark.streaming.kafka.KafkaUtils
import org.apache.spark.{SparkConf, SparkContext}
import org.apache.spark.streaming.{Seconds, StreamingContext}

object KafkaStreaming {
  def main(args: Array[String]): Unit = {
    Logger.getLogger("org").setLevel(Level.ERROR)
    val conf=new SparkConf().setAppName("Demo").setMaster("local[2]")
      .set("spark.streaming.receiver.writeAheadLog.enable", "true")
    val sc=new SparkContext(conf)
    val ssc=new StreamingContext(sc,Seconds(2))

    ssc.checkpoint("hdfs://node01:8020/ckKafka")  //WAL预写日志，将数据写到HDFS上

    //接收kafka数据
    val zkQuorum="node01:2181,node02:2181,node03:2181"
    val groupId="g1"
    val topics=Map("KStreaming"->1)  //1代表给定1个线程去消费数据
    val data:ReceiverInputDStream[(String,String)]=
      KafkaUtils.createStream(ssc,zkQuorum,groupId,topics)

    //获取接收到的topic数据的value(不需要key)
    val data2:DStream[String]=data.map(x=>x._2)
    val result=data2.flatMap(_.split(" ")).map((_,1)).reduceByKey(_+_)

    result.print()
    ssc.start()
    ssc.awaitTermination()
  }
}
~~~

##### 第四步：运行程序，往topic生成数据

```sh
[hadoop@node01 ~]$ kafka-console-producer.sh --broker-list node01:9092,node02:9092,node03:9092 --topic KStreaming

>hadoop hadoop flink
>hadoop spark
```

查看IDEA输出信息：

```
-------------------------------------------
Time: 1587715986000 ms
-------------------------------------------
(flink,1)
(hadoop,2)
-------------------------------------------
Time: 1587715996000 ms
-------------------------------------------
(spark,1)
(hadoop,1)
```



## Direct介绍(推荐)

> 这种新的不基于Receiver的直接方式，是在Spark 1.3中引入的，从而能够确保更加健壮的机制。
>
> 替代掉使用Receiver来接收数据后，这种方式==会周期性地查询Kafka，来获得每个topic+partition的最新的offset，从而定义每个batch的offset的范围==。
>
> ==当处理数据的job启动时，就会使用Kafka的简单consumer api来获取Kafka指定offset范围的数据。==
>
> Direct Approach示意图：
>
> <img src="sparkstreaming.assets/image-20200424164335533.png"/>
>
> 这种方式有如下优点：
>
> 1、简化并行读取：
>
> 如果要读取多个partition，不需要创建多个输入DStream然后对它们进行union操作。Spark会创建跟Kafka partition一样多的RDD partition，并且会并行从Kafka中读取数据。所以在==Kafka partition和RDD partition之间，有一个一对一的映射关系==。
>
> 2、高性能
>
> 如果要保证零数据丢失，在基于receiver的方式中，需要开启WAL机制。这种方式其实效率低下，因为数据实际上被复制了两份，Kafka自己本身就有高可靠的机制，会对数据复制一份，而这里又会复制一份到WAL中。==而基于direct的方式，不依赖Receiver，不需要开启WAL机制，只要Kafka中作了数据的复制，那么就可以通过Kafka的副本进行恢复。==
>
> 3、一次且仅一次的事务机制
>
> 基于receiver的方式，是使用Kafka的高阶API来在ZooKeeper中保存消费过的数据的offset的。这是消费Kafka数据的传统方式。基于receiver的方式配合着WAL机制可以保证数据零丢失的高可靠性，但是==却无法保证数据被处理一次且仅一次==，可能会处理两次。因为==Spark和ZooKeeper之间可能是不同步的，比如说已经被处理的数据，如果自动提交偏移量失败，则会导致重复处理数据==。
>
> 使用Direct方式的话，是自己去管理偏移量+幂等/事务来实现exactly-once语义。
>
> 4、降低资源
>
> ==Direct不需要Receivers，其申请的Executors全部参与到计算任务中==；而Receiver-based则需要专门的Receivers来读取Kafka数据且不参与计算。因此相同的资源申请，Direct 能够支持更大的业务。
>
> 5、降低内存
>
> ==Receiver-based的Receiver与其他Exectuor是异步的==，并持续不断接收数据，对于小业务量的场景还好，如果遇到大业务量时，需要提高Receiver的内存，但是参与计算的Executor并无需那么多的内存。而Direct 因为没有Receiver，而是在计算时读取数据，然后直接计算，所以对内存的要求很低。实际应用中我们可以把原先的10G降至现在的2-4G左右。
>
> 6、鲁棒性更好
>
> Receiver-based方法需要Receivers来异步持续不断的读取数据，因此遇到网络、存储负载等因素，导致实时任务出现堆积，但Receivers却还在持续读取数据，此种情况很容易导致计算崩溃。==Direct 则没有这种顾虑，其Driver在触发batch计算任务时，才会读取数据并计算。队列出现堆积并不会引起程序的失败。==



## 整合案例2：SparkStreaming与Kafka-0-8(Direct)

* 支持0.8版本，或者更高的版本

* pom.xml文件添加内容如下：

~~~xml
<dependency>
       <groupId>org.apache.spark</groupId>
       <artifactId>spark-streaming-kafka-0-8_2.11</artifactId>
       <version>2.3.3</version>
</dependency>  
~~~

代码演示：

  * sparkStreaming使用kafka 0.8API基于Direct直连来接受消息
  * spark direct API接收kafka消息，从而不需要经过zookeeper，直接从broker上获取信息。

~~~scala
package com.jimmy.streaming

import kafka.serializer.StringDecoder
import org.apache.log4j.{Level, Logger}
import org.apache.spark.streaming.dstream.{DStream, InputDStream}
import org.apache.spark.streaming.kafka.KafkaUtils
import org.apache.spark.{SparkConf, SparkContext}
import org.apache.spark.streaming.{Seconds, StreamingContext}

object KafkaStreaming {
  def main(args: Array[String]): Unit = {
    Logger.getLogger("org").setLevel(Level.ERROR)
    val conf=new SparkConf().setAppName("Demo").setMaster("local[2]")
    val sc=new SparkContext(conf)
    val ssc=new StreamingContext(sc,Seconds(2))
    ssc.checkpoint("hdfs://node01:8020/ckKafka")

    //接收kafka数据
    val kafkaParams=Map(
      "metadata.broker.list"->"node01:9092,node02:9092,node03:9092",
      "group.id" -> "g1"
    )
    val topics=Set("KStreaming")
    val data:InputDStream[(String,String)]=KafkaUtils.createDirectStream[
      String,String,StringDecoder,StringDecoder](ssc,kafkaParams,topics)
      //千万不要导错StringDecoder所在的包

    //获取接收到的topic数据的value(不需要key)
    val data2:DStream[String]=data.map(x=>x._2)
    val result=data2.flatMap(_.split(" ")).map((_,1)).reduceByKey(_+_)

    result.print()
    ssc.start()
    ssc.awaitTermination()
  }
}
~~~

运行sparkStreaming程序，启动生产者，往topic写数据：

```sh
[hadoop@node01 ~]$ kafka-console-producer.sh --broker-list node01:9092,node02:9092,node03:9092 --topic KStreaming
```

要想保证数据不丢失，最简单的就是靠checkpoint的机制，但是==checkpoint机制有个特点，如果代码升级了，checkpoint机制就失效了。所以如果想实现数据不丢失，那么就需要自己管理offset==。

## 整合案例3：SparkStreaming与Kafka-0-10(Direct)

* 支持0.10版本，或者更高的版本（推荐使用这个版本）

* pom.xml文件添加内容如下：

~~~xml
   <dependency>
        <groupId>org.apache.spark</groupId>
        <artifactId>spark-streaming-kafka-0-10_2.11</artifactId>
        <version>2.3.3</version>
   </dependency>
~~~

* 代码演示：

~~~scala
import org.apache.kafka.clients.consumer.ConsumerRecord
import org.apache.kafka.common.serialization.StringDeserializer
import org.apache.log4j.{Level, Logger}
import org.apache.spark.rdd.RDD
import org.apache.spark.streaming.dstream.{InputDStream}
import org.apache.spark.streaming.kafka010.{CanCommitOffsets, ConsumerStrategies, HasOffsetRanges, KafkaUtils, LocationStrategies}
import org.apache.spark.{SparkConf, SparkContext}
import org.apache.spark.streaming.{Seconds, StreamingContext}

object KafkaStreaming {
  def main(args: Array[String]): Unit = {
    Logger.getLogger("org").setLevel(Level.ERROR)
    val conf=new SparkConf().setAppName("Demo").setMaster("local[2]")
    val sc=new SparkContext(conf)
    val ssc=new StreamingContext(sc,Seconds(2))

    //接收kafka数据
    val kafkaParams=Map(
      "bootstrap.servers" ->"node01:9092,node02:9092,node03:9092",
      "group.id" -> "g1",
      "key.deserializer" -> classOf[StringDeserializer],
      "value.deserializer" -> classOf[StringDeserializer],
      "enable.auto.commit" -> "false"
    )
    val topic=Set("KStreaming")
    val data:InputDStream[ConsumerRecord[String,String]]=
      KafkaUtils.createDirectStream(
      ssc,
      LocationStrategies.PreferConsistent,
      ConsumerStrategies.Subscribe[String, String](topic,kafkaParams))

    //获取接收到的topic数据的value(不需要key)
    data.foreachRDD(rdd=>{
      val dataRDD:RDD[String]=rdd.map(_.value())
      dataRDD.foreach(line=>println(line))
      //获取偏移量并提交到kafka中
      val offsetRange=rdd.asInstanceOf[HasOffsetRanges].offsetRanges
      data.asInstanceOf[CanCommitOffsets].commitAsync(offsetRange)
    })

    ssc.start()
    ssc.awaitTermination()
  }
}

~~~



##  解决SparkStreaming与Kafka0.8版本整合数据丢失问题

一般对于企业来说，无论是使用哪一套api去消费kafka的数据，都是设置手动提交偏移量。

如果是自动提交偏移量（默认60s提交一次）这里可能会出现问题：

（1）数据处理失败了，自动提交的偏移量，会出现数据的丢失。

（2）数据处理成功了，自动提交偏移量失败，会出现数据的重复处理。

自动提交偏移量的风险比较高，一般都使用手动提交偏移量，这里我们可以操作什么时候去提交偏移量，==把偏移量的提交交给消费者程序自己去维护==。

方案设计如下：

![kafka08SaveOffset2ZK](sparkstreaming.assets/kafka08SaveOffset2ZK-1608485794545.png)

代码开发，手动把偏移量存入Zookeeper，解决数据丢失问题。

~~~scala
package com.kaikeba.streaming.kafka

import kafka.common.TopicAndPartition
import kafka.message.MessageAndMetadata
import kafka.serializer.StringDecoder
import kafka.utils.{ZKGroupTopicDirs, ZkUtils}
import org.I0Itec.zkclient.ZkClient
import org.apache.spark.SparkConf
import org.apache.spark.rdd.RDD
import org.apache.spark.streaming.dstream.InputDStream
import org.apache.spark.streaming.kafka.{HasOffsetRanges, KafkaUtils}
import org.apache.spark.streaming.{Seconds, StreamingContext}


/**
  * 使用直连方式 SparkStreaming连接kafka0.8获取数据
  * 手动将偏移量数据保存到zookeeper中
  */
object KafkaManagerOffset08 {

  def main(args: Array[String]): Unit = {

    //todo:1、创建SparkConf 提交到集群中运行 不要设置master参数
    val conf = new SparkConf().setAppName("KafkaManagerOffset08").setMaster("local[4]")

    //todo: 2、设置SparkStreaming，并设定间隔时间
    val ssc = new StreamingContext(conf, Seconds(5))

    //todo:3、指定相关参数

        //指定组名
        val groupID = "consumer-kaikeba"
        //指定消费者的topic名字
        val topic = "wordcount"
        //指定kafka的broker地址
        val brokerList = "node01:9092,node02:9092,node03:9092"

        //指定zookeeper的地址，用来存放数据偏移量数据，也可以使用Redis MySQL等
        val zkQuorum = "node01:2181,node02:2181,node03:2181"

        //创建Stream时使用的topic名字集合，SparkStreaming可同时消费多个topic
        val topics: Set[String] = Set(topic)

        //创建一个 ZKGroupTopicDirs 对象，就是用来指定在zk中的存储目录，用来保存数据偏移量
        val topicDirs = new ZKGroupTopicDirs(groupID, topic)

        //获取 zookeeper 中的路径 "/consumers/consumer-kaikeba/offsets/wordcount"
        val zkTopicPath = topicDirs.consumerOffsetDir

        //构造一个zookeeper的客户端 用来读写偏移量数据
        val zkClient = new ZkClient(zkQuorum)

        //准备kafka的参数
        val kafkaParams = Map(
          "metadata.broker.list" -> brokerList,
          "group.id" -> groupID,
          "enable.auto.commit" -> "false"
        )


    //todo:4、定义kafkaStream流
    var kafkaStream: InputDStream[(String, String)] = null


    //todo:5、获取指定的zk节点的子节点个数
    val childrenNum = getZkChildrenNum(zkClient,zkTopicPath)


    //todo:6、判断是否保存过数据 根据子节点的数量是否为0
    if (childrenNum > 0) {

      //构造一个map集合用来存放数据偏移量信息
      var fromOffsets: Map[TopicAndPartition, Long] = Map()

      //遍历子节点
      for (i <- 0 until childrenNum) {

        //获取子节点  /consumers/consumer-kaikeba/offsets/wordcount/0
        val partitionOffset: String = zkClient.readData[String](s"$zkTopicPath/$i")
        // /wordcount-----0
        val tp = TopicAndPartition(topic, i)

        //获取数据偏移量  将不同分区内的数据偏移量保存到map集合中
        //  wordcount/0 -> 1001
        fromOffsets += (tp -> partitionOffset.toLong)
      }

      // 泛型中 key：kafka中的key   value：hello tom hello jerry
      //创建函数 解析数据 转换为（topic_name, message）的元组
      val messageHandler = (mmd: MessageAndMetadata[String, String]) => (mmd.topic, mmd.message())

      //todo:7、利用底层的API创建DStream 采用直连的方式(之前已经消费了，从指定的位置消费)
       kafkaStream = KafkaUtils.createDirectStream[String, String, StringDecoder, StringDecoder, (String, String)](ssc, kafkaParams, fromOffsets, messageHandler)

    } else {
      //todo:7、利用底层的API创建DStream 采用直连的方式(之前没有消费，这是第一次读取数据)
      //zk中没有子节点数据 就是第一次读取数据 直接创建直连对象
      kafkaStream = KafkaUtils.createDirectStream[String, String, StringDecoder, StringDecoder](ssc, kafkaParams, topics)
    }

    //todo:8、直接操作kafkaStream
    //依次迭代DStream中的kafkaRDD 只有kafkaRDD才可以强转为HasOffsetRanges  从中获取数据偏移量信息
    //之后是操作的RDD 不能够直接操作DStream 因为调用Transformation方法之后就不是kafkaRDD了获取不了偏移量信息

    kafkaStream.foreachRDD(kafkaRDD => {
      //强转为HasOffsetRanges 获取offset偏移量数据
      val offsetRanges = kafkaRDD.asInstanceOf[HasOffsetRanges].offsetRanges

      //获取数据
      val lines: RDD[String] =kafkaRDD.map(_._2)

      //todo：9、接下来就是对RDD进行操作 触发action
      lines.foreachPartition(patition => {
        patition.foreach(x => println(x))
      })

      //todo: 10、手动提交偏移量到zk集群上
      for (o <- offsetRanges) {
        //拼接zk路径   /consumers/consumer-kaikeba/offsets/wordcount/0
        val zkPath = s"${topicDirs.consumerOffsetDir}/${o.partition}"

        //将 partition 的偏移量数据 offset 保存到zookeeper中
        ZkUtils.updatePersistentPath(zkClient, zkPath, o.untilOffset.toString)
      }
    })

    //开启SparkStreaming 并等待退出
    ssc.start()
    ssc.awaitTermination()

  }

  /**
    * 获取zk节点上的子节点的个数
    * @param zkClient
    * @param zkTopicPath
    * @return
    */
  def getZkChildrenNum(zkClient:ZkClient,zkTopicPath:String):Int ={

    //查询该路径下是否有子节点，即是否有分区读取数据记录的读取的偏移量
    // /consumers/consumer-kaikeba/offsets/wordcount/0
    // /consumers/consumer-kaikeba/offsets/wordcount/1
    // /consumers/consumer-kaikeba/offsets/wordcount/2

    //子节点的个数
    val childrenNum: Int = zkClient.countChildren(zkTopicPath)

    childrenNum
  }
}

~~~



## SparkStreaming应用程序如何保证Exactly-Once

牢记实现Exactly-Once思路：

> ==一个流式计算如果想要保证Exactly-Once，那么首先要满足下面三点要求：==
>
> （1）Source支持Replay。---》Source的数据支持重新发送，kafka就可以
>
> （2）流计算引擎本身处理能保证Exactly-Once。 ---》sparkstreaming可以
>
> （3）Sink支持幂等或事务更新 ---》幂等是一个数学概念，f(f(x))=f(x),比如mysql表执行一个更新的sql语句，把老王的银行卡金额设为100，这个更新无论更新多少次，银行卡金额都是100。
>
> 也就是说如果要想让一个SparkStreaming的程序保证Exactly-Once,那么从如下三个角度出发
>
> （1）接收数据:从Source中接收数据。
>
> （2）转换数据:用DStream和RDD算子转换。
>
> （3）储存数据:将结果保存至外部系统。
>
> 如果SparkStreaming程序需要实现Exactly-Once语义，那么每一个步骤都要保证Exactly-Once。
>
> ==实现数据被处理且只被处理一次的sink的方式：==
>
> （1）需要实现数据结果保存与偏移量保存操作在同一个事务中，要么同时成功，要么就都失败。失败了会回滚。事务操作可以在foreachRDD()时进行。如果数据写入失败，或者offset保存失败，那么这一批次数据都将失败并且回滚。
>
> （2）或者实现幂等。

###### 案例演示

pom.xml添加内容如下

~~~xml
       <dependency>
            <groupId>org.scalikejdbc</groupId>
            <artifactId>scalikejdbc_2.11</artifactId>
            <version>3.1.0</version>
        </dependency>
  <!-- https://mvnrepository.com/artifact/org.scalikejdbc/scalikejdbc-config -->
        <dependency>
            <groupId>org.scalikejdbc</groupId>
            <artifactId>scalikejdbc-config_2.11</artifactId>
            <version>3.1.0</version>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>5.1.39</version>
        </dependency>
~~~

代码开发

~~~scala
import org.apache.kafka.common.TopicPartition
import org.apache.kafka.common.serialization.StringDeserializer
import org.apache.spark.SparkConf
import org.apache.spark.sql.SparkSession
import org.apache.spark.streaming.kafka010.{ConsumerStrategies, HasOffsetRanges, KafkaUtils, LocationStrategies}
import org.apache.spark.streaming.{Seconds, StreamingContext}
import org.slf4j.LoggerFactory
import scalikejdbc.{ConnectionPool, DB, _}
/**
  *    SparkStreaming EOS:
  *      Input:Kafka
  *      Process:Spark Streaming
  *      Output:Mysql
  *
  *      保证EOS:
  *        1、偏移量自己管理，即enable.auto.commit=false,这里保存在Mysql中
  *        2、使用createDirectStream
  *        3、事务输出: 结果存储与Offset提交在Driver端同一Mysql事务中
  */
object SparkStreamingEOSKafkaMysqlAtomic {
  @transient lazy val logger = LoggerFactory.getLogger(this.getClass)

  def main(args: Array[String]): Unit = {

    val topic="topic1"
    val group="spark_app1"

    //Kafka配置
    val kafkaParams= Map[String, Object](
      "bootstrap.servers" -> "node1:6667,node2:6667,node3:6667",
      "key.deserializer" -> classOf[StringDeserializer],
      "value.deserializer" -> classOf[StringDeserializer],
      "auto.offset.reset" -> "latest",
      "enable.auto.commit" -> (false: java.lang.Boolean),
      "group.id" -> group)

    //在Driver端创建数据库连接池
    ConnectionPool.singleton("jdbc:mysql://node3:3306/bigdata", "", "")

    val conf = new SparkConf().setAppName(this.getClass.getSimpleName.replace("$",""))
    val ssc = new StreamingContext(conf,Seconds(5))

    //1)初次启动或重启时,从指定的Partition、Offset构建TopicPartition
    //2)运行过程中,每个Partition、Offset保存在内部currentOffsets = Map[TopicPartition, Long]()变量中
    //3)后期Kafka Topic分区动扩展,在运行过程中不能自动感知
    val initOffset=DB.readOnly(implicit session=>{
      sql"select `partition`,offset from kafka_topic_offset where topic =${topic} and `group`=${group}"
        .map(item=> new TopicPartition(topic, item.get[Int]("partition")) -> item.get[Long]("offset"))
        .list().apply().toMap
    })

    //CreateDirectStream
    //从指定的Topic、Partition、Offset开始消费
    val sourceDStream =KafkaUtils.createDirectStream[String,String](
      ssc,
      LocationStrategies.PreferConsistent,
      ConsumerStrategies.Assign[String,String](initOffset.keys,kafkaParams,initOffset)
    )

    sourceDStream.foreachRDD(rdd=>{
      if (!rdd.isEmpty()){
        val offsetRanges = rdd.asInstanceOf[HasOffsetRanges].offsetRanges
        offsetRanges.foreach(offsetRange=>{
          logger.info(s"Topic: ${offsetRange.topic},Group: ${group},Partition: ${offsetRange.partition},fromOffset: ${offsetRange.fromOffset},untilOffset: ${offsetRange.untilOffset}")
        })

        //统计分析
        //将结果收集到Driver端
        val sparkSession = SparkSession.builder.config(rdd.sparkContext.getConf).getOrCreate()
        import sparkSession.implicits._
        val dataFrame = sparkSession.read.json(rdd.map(_.value()).toDS)
        dataFrame.createOrReplaceTempView("tmpTable")
        val result=sparkSession.sql(
          """
            |select
            |   --每分钟
            |   eventTimeMinute,
            |   --每种语言
            |   language,
            |   -- 次数
            |   count(1) pv,
            |   -- 人数
            |   count(distinct(userID)) uv
            |from(
            |   select *, substr(eventTime,0,16) eventTimeMinute from tmpTable
            |) as tmp group by eventTimeMinute,language
          """.stripMargin
        ).collect()

        //在Driver端存储数据、提交Offset
        //结果存储与Offset提交在同一事务中原子执行
        //这里将偏移量保存在Mysql中
        DB.localTx(implicit session=>{

          //结果存储
          result.foreach(row=>{
            sql"""
            insert into twitter_pv_uv (eventTimeMinute, language,pv,uv)
            value (
                ${row.getAs[String]("eventTimeMinute")},
                ${row.getAs[String]("language")},
                ${row.getAs[Long]("pv")},
                ${row.getAs[Long]("uv")}
                )
            on duplicate key update pv=pv,uv=uv
          """.update.apply()
          })

          //Offset提交
          offsetRanges.foreach(offsetRange=>{
            val affectedRows = sql"""
          update kafka_topic_offset set offset = ${offsetRange.untilOffset}
          where
            topic = ${topic}
            and `group` = ${group}
            and `partition` = ${offsetRange.partition}
            and offset = ${offsetRange.fromOffset}
          """.update.apply()

            if (affectedRows != 1) {
              throw new Exception(s"""Commit Kafka Topic: ${topic} Offset Faild!""")
            }
          })
        })
      }
    })

    ssc.start()
    ssc.awaitTermination()
  }

}
~~~




## SparkStreaming调优

#### 调整BlockReceiver的数量

![1567325066744](sparkstreaming.assets/1567325066744-1608485794545.png)

案例演示：

```scala
val kafkaStream = {  
  val sparkStreamingConsumerGroup = "spark-streaming-consumer-group"  
  val kafkaParams = Map(  
    "zookeeper.connect" -> "node01:2181,node02:2181,node03:2181",  
    "group.id" -> "spark-streaming-test")  
  val inputTopic = "test"  
  val numPartitionsOfInputTopic = 3  
  val streams = (1 to numPartitionsOfInputTopic) map  {x =>  
    KafkaUtils.createStream(ssc, kafkaParams, Map(inputTopic -> 1),      StorageLevel.MEMORY_ONLY_SER).map(_._2)  
  }  
  val unifiedStream = ssc.union(streams)  
```

#### 4调整Block的数量

~~~
batchInterval : 触发批处理的时间间隔
blockInterval :将接收到的数据生成Block的时间间隔，spark.streaming.blockInterval(默认是200ms)，那么，BlockRDD的分区数 = batchInterval / blockInterval，即一个Block就是RDD的一个分区，就是一个task
比如，batchInterval是2秒，而blockInterval是200ms，那么task数为10，如果task的数量太少，比一个executor的core数还少的话，那么可以减少blockInterval，blockInterval最好不要小于50ms，太小的话导致task数太多，那么launch task的时间久多了
~~~



##### 4.3 调整Receiver的接受速率

~~~
pps:permits per second 每秒允许接受的数据量(QPS -> queries per second)
Spark Streaming默认的PPS是没有限制的,可以通过参数spark.streaming.receiver.maxRate来控制，默认是Long.Maxvalue
~~~



##### 4.4 调整数据处理的并行度

**BlockRDD的分区数**

a. 通过Receiver接受数据的特点决定

b. 也可以自己通过repartition设置

**ShuffleRDD的分区数**

a. 默认的分区数为spark.default.parallelism(core的大小)

b. 通过我们自己设置决定

```scala
val wordCounts = words.map(x => (x, 1)).reduceByKey((a: Int, b: Int) => a + b, new HashPartitioner(10))
```

##### 4.5 数据的序列化

SparkStreaming两种需要序列化的数据：
a. 输入的数据：默认是以[StorageLevel.MEMORY_AND_DISK_SER_2](http://spark.apache.org/docs/latest/api/scala/index.html)的形式存储在executor上的内存中
b. 缓存的数据：默认是以[StorageLevel.MEMORY_ONLY_SER](http://spark.apache.org/docs/latest/api/scala/index.html)的形式存储的内存中
使用Kryo序列化机制，比Java序列化机制性能好

```scala
val conf = new SparkConf().setMaster(...).setAppName(...)
conf.set("spark.serializer", "org.apache.spark.serializer.KryoSerializer")
conf.registerKryoClasses(Array(classOf[MyClass1], classOf[MyClass2]))
val sc = new SparkContext(conf)
```



##### 4.6 内存调优

* 需要内存大小

~~~
和transformation的类型有关，如果使用的是updateStateByKey，Window这样的算子，那么内存就要设置得偏大。
~~~

* 数据存储级别

~~~
如果把接收到的数据设置的存储级别是MEMORY_DISK这种级别，也就是说如果内存不够可以把数据存储到磁盘上，其实性能还是不好的，性能最好的就是所有的数据都在内存里面，所以如果在资源允许的情况下，把内存调大一点，让所有的数据都存在内存里面。
~~~



##### 4.7 Output Operations性能

* 保存结果到外部的存储介质中，比如mysql/hbase数据库
  * 使用高性能的算子操作实现

![1585058900250](sparkstreaming.assets/1585058900250-1608485794545.png)

![1585058915092](sparkstreaming.assets/1585058915092-1608485794545.png)



##### 4.8 Backpressure(压力反馈)

![1567327168554](sparkstreaming.assets/1567327168554-1608485794545.png)

![1567327191622](sparkstreaming.assets/1567327191622-1608485794545.png)

Feedback Loop : 动态使得Streaming app从unstable状态回到stable状态

![1567327216060](sparkstreaming.assets/1567327216060-1608485794545.png)

从Spark1.5版本开始：==spark.streaming.backpressure.enabled = true==



##### 4.9 Elastic Scaling(资源动态分配)

动态分配资源：

批处理动态的决定这个application中需要多少个Executors：

1. 当一个Executor空闲的时候，将这个Executor杀掉
2. 当task太多的时候，动态的启动Executors

Streaming分配Executor的原则是比对 process time / batchInterval 的比率

![1567327351927](sparkstreaming.assets/1567327351927-1608485794545.png)

如果延迟了，那么就自动增加资源

![1567327385166](sparkstreaming.assets/1567327385166-1608485794545.png)

![1567327412253](sparkstreaming.assets/1567327412253-1608485794545.png)

从Spark2.0有这个功能，开启资源动态分配： ==spark.streaming.dynamicAllocation.enabled = true==



##### 4.10  数据倾斜调优

~~~
因为SparkStreaming的底层就是RDD，之前我们讲SparkCore的所有的数据倾斜的调优策略（见SparkCore调优）都适合于SparkStreaming，大家一定要灵活掌握，这个在实际开发的工作当中用得频率较高，各位同学面试的时候也可以从这个角度跟面试官聊。	
~~~

## 总结

```
简单聊一下sparkStreaming程序。

后期进入到企业之后，如果用到sparkStreaming消费kafka的数据，建议大家使用Direct直连方式的api的处理。它是有一些有点。如果你想实现exactly-once，可以实现幂等或者是事务去控制。去开发对应的代码.


开发步骤：
（1）在本地开发好程序（指定master为local），做测试，目的：为了测试代码的业务功能逻辑对不对
（2）可以稍微改造一下程序（master不在为local）,把程序打成jar包提交到spark集群中运行


有一个问题需要探讨一下：
一个sparkStreaming程序到底给定多少计算资源是比较合理？
假设实时处理程序的批处理时间间隔为5s。什么情况才叫资源比较合理？
首先你要知道针对于实时处理程序来什么情况才叫合理？
-----需要在当前批次时间间隔内，就要上一个批次时间产生的数据处理完成----------
说白了就是这里需要在5s之内就把上一个5s的数据处理完成。
如果处理的时间大于了批处理时间间隔，这里会出现数据的积压，任务延迟比较高


可以来几组资源参数做测试：
(1) --executor-memory  2g   --total-executor-core 10
(2) --executor-memory  2g   --total-executor-core 20
(3) --executor-memory  5g   --total-executor-core 20


把程序提交到集群之后可以通过master的web页面观察任务运行的相关信息。
spark-submit  \
--master spark://node01:7077  \
--class com.kaikeba.streaming.kafka.KafkaDirect10 \
--executor-memory 1g \
--total-executor-cores 4 \
sparkStreamingStudy-1.0-SNAPSHOT.jar 
```



## ==sparkStreaming高频面试题！！！！！！==

##### 1、你们公司有多少个实时任务？

~~~
20-50个任务就可以了
~~~



##### 2、你们是如何保证数据不丢失的, 代码怎么的？架构是什么？

~~~
kafka 0.8
kafka 0.10
~~~



##### 3、你们的任务多久是一个批次？

~~~
5秒、10秒、30秒、1分钟都是可以的
~~~



##### 4、一个批次里面大约有多少条数据？

~~~
8000条左右
~~~



##### 5、你的整个任务一天计算多少条数据？

~~~~
估算一下，2/8法则算一下
~~~~



##### 6、一条消息多大？

~~~
10KB左右
~~~



##### 7、你在处理实时任务的过程中遇到了什么问题吗？（☆☆☆☆☆）

~~~
一定不能说没有，但是也不能说有些比较低级的问题
举个例子，比如说之前处理的业务代码会出现数据丢失，现在不丢失了
或者是任务延迟了，因为发送了数据倾斜，导致在规定的时间内数据没有处理完，导致调度延迟，内存损耗完。

怎么解决的？可以使用之前的数据倾斜方法去处理解决。
~~~



##### 8、你们公司用的kafka是哪个版本，什么版本的sparkStreaming?

~~~~
1.0版本的kafka
2.3.3版本的sparkStreaming
~~~~



##### 9、你们公司是如何管理实时任务的？

~~~
可以说出一个思路就可以了
~~~



##### 10、如何保证一次语义？（☆☆☆☆☆）

~~~
不一定说要写代码，需要提供相关的思路即可
~~~




## 知识扩展-ScalikeJDBC

#### 1、什么是ScalikeJDBC

ScalikeJDBC是Scala开发人员基于SQL的简洁数据库访问库。 

该库自然包装JDBC API，为您提供易于使用且非常灵活的API。 

更重要的是，QueryDSL使您的代码类型安全且可重用。

ScalikeJDBC是一个实用且适合生产的产品。 将此库用于实际项目.

#### 2、IDEA项目中导入相关库

```xml
<!-- https://mvnrepository.com/artifact/org.scalikejdbc/scalikejdbc -->
<dependency>
    <groupId>org.scalikejdbc</groupId>
    <artifactId>scalikejdbc_2.11</artifactId>
    <version>3.1.0</version>
</dependency>
<!-- https://mvnrepository.com/artifact/org.scalikejdbc/scalikejdbc-config -->
<dependency>
    <groupId>org.scalikejdbc</groupId>
    <artifactId>scalikejdbc-config_2.11</artifactId>
    <version>3.1.0</version>
</dependency>
<!-- mysql " mysql-connector-java -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>5.1.38</version>
</dependency>
```

#### 3、数据库操作

##### 3.1 数据库连接配置信息

* 在IDEA的resources文件夹下创建application.conf

```shell
#mysql的连接配置信息
db.default.driver="com.mysql.jdbc.Driver"
db.default.url="jdbc:mysql://node03:3306/spark"
db.default.user="root"
db.default.password="123456"
```

* scalikeJDBC默认加载default配置，或者使用自定义配置

```shell
#mysql的连接配置信息
db.fred.driver="com.mysql.jdbc.Driver"
db.fred.url="jdbc:mysql://node03:3306/spark"
db.fred.user="root"
db.fred.password="123456"
```

##### 3.2 加载数据配置信息

```java
//默认加载default配置信息
DBs.setup()
//加载自定义的fred配置信息
DBs.setup('fred)
```

##### 3.3 查询数据库并封装数据

```scala
//配置mysql
DBs.setup()

//查询数据并返回单个列，并将列数据封装到集合中
val list = DB.readOnly({implicit session =>
  SQL("select content from post")
    .map(rs => 
    rs.string("content")).list().apply()
})
for(s <- list){
  println(s)
}
```



```scala
case class Users(id:String, name:String, nickName:String)

/**
  * 查询数据库，并将数据封装成对象，并返回一个集合
  */
//配置mysql
DBs.setup('fred)

//查询数据并返回单个列，并将列数据封装到集合中
val users = NamedDB('fred).readOnly({implicit session =>
  SQL("select * from users").map(rs =>
  Users(rs.string("id"), rs.string("name"),
    rs.string("nickName"))).list().apply()
})
for (u <- users){
  println(u)
}
```

##### 3.4 插入数据

###### 3.4.1 AutoCommit

```shell
/**
  * 插入数据，使用AutoCommit
  * @return
  */
val insertResult = DB.autoCommit({implicit session =>
  SQL("insert into users(name, nickName) values(?,?)").bind("test01", "test01")
    .update().apply()
})
println(insertResult)
```

###### 3.4.2 插入返回主键标识

```scala
/**
  * 插入数据，并返回主键
  * @return
  */
val id = DB.localTx({implicit session =>
  SQL("insert into users(name, nickName, sex) values(?,?,?)").bind("test", "000", "male")
    .updateAndReturnGeneratedKey("nickName").apply()
})
println(id)
```

###### 3.4.3 事务插入

```scala
/**
  * 使用事务插入数据库
  * @return
  */
val tx = DB.localTx({implicit session =>
  SQL("insert into users(name, nickName, sex) values(?,?,?)").bind("test", "haha", "male").update().apply()
  //下一行会报错，用于测试
  var s = 1 / 0 
  SQL("insert into users(name, nickName, sex) values(?,?,?)").bind("test01", "haha01", "male01").update().apply()
})
println(s"tx = ${tx}")
```

###### 3.4.4 更新数据

```scala
/**
  * 更新数据
  * @return
  */
DB.localTx({implicit session =>
  SQL("update users set nickName = ?").bind("xiaoming").update().apply()
})
```











