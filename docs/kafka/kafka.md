## Kafka概述

##### 为什么有消息系统

**解耦**
允许你独立的扩展或修改两边的处理过程，只要确保它们遵守同样的接口约束。

**冗余**
消息队列把数据进行持久化直到它们已经被完全处理，通过这一方式规避了数据丢失风险。许多消息队列所采用的"插入-获取-删除"范式中，在把一个消息从队列中删除之前，需要你的处理系统明确的指出该消息已经被处理完毕，从而确保你的数据被安全的保存直到你使用完毕。

**扩展性**
因为消息队列解耦了你的处理过程，所以增大消息入队和处理的频率是很容易的，只要另外增加处理过程即可。

**灵活性 & 峰值处理能力**
在访问量剧增的情况下，应用仍然需要继续发挥作用，但是这样的突发流量并不常见。如果为以能处理这类峰值访问为标准来投入资源随时待命无疑是巨大的浪费。使用消息队列能够使关键组件顶住突发的访问压力，而不会因为突发的超负荷的请求而完全崩溃。

**可恢复性**
系统的一部分组件失效时，不会影响到整个系统。消息队列降低了进程间的耦合度，所以即使一个处理消息的进程挂掉，加入队列中的消息仍然可以在系统恢复后被处理。

**顺序保证**
在大多使用场景下，数据处理的顺序都很重要。部分消息队列本来就是排序的，并且能保证数据会按照特定的顺序来处理大。（Kafka 保证一个 Partition 内的消息的有序性）

**缓冲**
有助于控制和优化数据流经过系统的速度，解决生产消息和消费消息的处理速度不一致的情况。

**异步通信**
很多时候，用户不想也不需要立即处理消息。消息队列提供了异步处理机制，允许用户把一个消息放入队列，但并不立即处理它。想向队列中放入多少消息就放多少，然后在需要的时候再去处理它们。

> 补充：
>
> 解耦的通俗理解：解耦：假设生产者和消费者分别是两个类。如果让生产者直接调用消费者的某个方法，那么生产者对于消费者就会产生依赖（也就是耦合）。将来如果消费者的代码发生变化，可能会影响到生产者。而如果两者都依赖于某个缓冲区，两者之间不直接依赖，耦合也就相应降低了。生产者直接调用消费者的某个方法，还有另一个弊端。由于函数调用是同步的（或者叫阻塞的），在消费者的方法没有返回之前，生产者只好一直等在那边。万一消费者处理数据很慢，生产者就会白白糟蹋大好时光。缓冲区还有另一个好处。如果制造数据的速度时快时慢，缓冲区的好处就体现出来了。当数据制造快的时候，消费者来不及处理，未处理的数据可以暂时存在缓冲区中。等生产者的制造速度慢下来，消费者再慢慢处理掉。

##### Kafka核心概念

Kafka是最初由Linkedin公司开发，**是一个分布式、分区的、多副本的、多订阅者，基于zookeeper协调的分布式日志系统（也可以当做MQ系统）**，常见可以用于web/nginx日志、访问日志，消息服务等等，Linkedin于2010年贡献给了Apache基金会并成为顶级开源项目。

kafka是一个分布式消息队列。具有高性能、持久化、多副本备份、横向扩展能力。生产者往队列里写消息，消费者从队列里取消息进行业务逻辑。Kafka就是一种发布-订阅模式。将消息保存在磁盘中，以顺序读写方式访问磁盘，避免随机读写导致性能瓶颈。

##### kafka特性

高吞吐、低延迟

> kakfa 最大的特点就是收发消息非常快，kafka 每秒可以处理几十万条消息，它的最低延迟只有几毫秒。

高伸缩性

>  每个主题(topic) 包含多个分区(partition)，主题中的分区可以分布在不同的主机(broker)中。

持久性、可靠性

> Kafka 能够允许数据的持久化存储，消息被持久化到磁盘，并支持数据备份防止数据丢失。

容错性

>  允许集群中的节点失败，某个节点宕机，Kafka 集群能够正常工作。

高并发

> 支持数千个客户端同时读写。

## Kafka集群架构

![image-20200419215655315](kafka.assets/image-20200419215655315.png)

producer

> 消息生产者，发布消息到Kafka集群的终端或服务

broker

> Kafka集群中包含的服务器，==一个borker就表示kafka集群中的一个节点==

topic

> 每条发布到Kafka集群的消息属于的类别，即Kafka是面向 topic 的。更通俗的说Topic就像一个消息队列，生产者可以向其写入消息，消费者可以从中读取消息，一个Topic支持多个生产者或消费者同时订阅它，所以其扩展性很好。

partition

> ==每个 topic 包含一个或多个partition==。Kafka分配的单位是partition

replica

> partition的副本，保障 partition 的高可用。

consumer

> 从Kafka集群中消费消息的终端或服务

consumer group

> 每个 consumer 都属于一个 consumer group，==每条消息只能被 consumer group 中的一个 Consumer 消费，但可以被多个 consumer group 消费。==

leader

> 每个partition有多个副本，其中有且仅有一个作为Leader，Leader是当前负责数据的读写的partition。 producer 和 consumer 只跟 leader 交互

follower

> Follower跟随Leader，所有写请求都通过Leader路由，数据变更会广播给所有Follower，Follower与Leader保持数据同步。如果Leader失效，则从Follower中选举出一个新的Leader。

controller

> 大家有没有思考过一个问题，就是Kafka集群中某个broker宕机之后，是谁负责感知到他的宕机，以及负责进行Leader Partition的选举？如果你在Kafka集群里新加入了一些机器，此时谁来负责把集群里的数据进行负载均衡的迁移？包括你的Kafka集群的各种元数据，比如说每台机器上有哪些partition，谁是leader，谁是follower，是谁来管理的？如果你要删除一个topic，那么背后的各种partition如何删除，是谁来控制？还有就是比如Kafka集群扩容加入一个新的broker，是谁负责监听这个broker的加入？如果某个broker崩溃了，是谁负责监听这个broker崩溃？
>
> 这里就需要一个==Kafka集群的总控组件，Controller。他负责管理整个Kafka集群范围内的各种东西。==

zookeeper

> (1)Kafka 通过 zookeeper 来存储集群的meta元数据信息
>
> (2)一旦controller所在broker宕机了，此时临时节点消失，集群里其他broker会一直监听这个临时节点，发现临时节点消失了，就争抢再次创建临时节点，保证有一台新的broker会成为controller角色。

offset偏移量

> 消费者在对应分区上已经消费的消息数（位置），offset保存的地方跟kafka版本有一定的关系。
>
> kafka0.8 版本之前offset保存在zookeeper上。
>
> kafka0.8 版本之后offset保存在kafka集群上。它是把消费者消费topic的位置通过==kafka集群内部有一个默认的topic，名称叫__consumer_offsets==，它默认有50个分区。

ISR机制

> 光是依靠多副本机制能保证Kafka的高可用性，但是能保证数据不丢失吗？不行，因为如果leader宕机，但是leader的数据还没同步到follower上去，此时即使选举了follower作为新的leader，当时刚才的数据已经丢失了。
>
> ISR是：in-sync replica，就是跟leader partition保持同步的follower partition的数量，==只有处于ISR列表中的follower才可以在leader宕机之后被选举为新的leader==，因为在这个ISR列表里代表他的数据跟leader是同步的。

消费者consumer与partition的关系

> 假设有2个消费组，一个关于订单数据的topic有3个partition。两个消费组都要对该topic的数据进行处理。
>
> 1. 如果一个消费组的消费者个数等于分区数，partition与这个消费组的消费者是一一对应关系。即一个消费者处理一个分区的数据
> 2. 如果一个消费组的消费者个数大于分区数，该组会出现消费者空闲状态，后期有些消费者挂掉之后，空闲状态的消费者会顶上去，继续消费数据。
> 3. 如果一个消费组的消费者个数小于分区数，这里会出现某个消费者消费多个分区数据的情况
> 4. 也就是说，topic中的每一条消息都只能被一个消费组中的某个消费者去消费，而不同的消费组是可以消费同一条消息的。
>
> 详情看下图：

![image-20200419214847181](kafka.assets/image-20200419214847181.png)

## kafka集群安装部署

需要事先安装好Zookeeper集群

##### 下载安装包（http://kafka.apache.org）

spark是根据scala开发的，下载版本是2.11.xxx

kafka也是根据scala开发的，下载版本也要对应上来，安装版本是2.11.xxx

这里安装的kafka版本是2.11-1.0.1，是0.8版本之后的版本。

~~~sh
cd /kkb/soft
rz #上传安装包kafka_2.11-1.0.1.tgz到node01
~~~

##### 解压安装包到指定规划目录

~~~shell
tar -zxvf /kkb/soft/kafka_2.11-1.0.1.tgz -C /kkb/install/
~~~

##### 重命名解压目录

~~~shell
cd /kkb/install/
mv kafka_2.11-1.0.1 kafka
~~~

##### 修改配置文件

进入到kafka安装目录下有一个config目录

```sh
cd /kkb/install/kafka/config
vi server.properties
```

```shell
#指定kafka对应的broker id ，唯一
broker.id=0
#指定数据存放的目录
log.dirs=/kkb/install/kafka/kafka-logs
#指定zk地址
zookeeper.connect=node01:2181,node02:2181,node03:2181
#指定是否可以删除topic ,默认是false 表示不可以删除
delete.topic.enable=true
#指定broker主机名
host.name=node01
```

注意：还要将该文件中的log.dirs=/tmp/kafka-logs一行注释掉，否则topic的数据的存放目录是/tmp/kafka-logs

##### ndoe01配置kafka环境变量

sudo vi /etc/profile

```
export KAFKA_HOME=/kkb/install/kafka
export PATH=$PATH:$KAFKA_HOME/bin
```

##### 分发kafka安装目录到其他节点

```
scp -r kafka node02:/kkb/install
scp -r kafka node03:/kkb/install
```

配置node03/node02的kafka环境变量

```
sudo vi /etc/profile
```

##### 修改node02和node03上的配置

node02

vi server.properties

```shell
#指定kafka对应的broker id ，唯一
broker.id=1
#指定数据存放的目录
log.dirs=/kkb/install/kafka/kafka-logs
#指定zk地址
zookeeper.connect=node01:2181,node02:2181,node03:2181
#指定是否可以删除topic ,默认是false 表示不可以删除
delete.topic.enable=true
#指定broker主机名
host.name=node02
```

node03

vi server.properties

```shell
#指定kafka对应的broker id ，唯一
broker.id=2
#指定数据存放的目录
log.dirs=/kkb/install/kafka/kafka-logs
#指定zk地址
zookeeper.connect=node01:2181,node02:2181,node03:2181
#指定是否可以删除topic ,默认是false 表示不可以删除
delete.topic.enable=true
#指定broker主机名
host.name=node03
```

安装完后broker.id与主机的对应关系是：

> node01---->broker.id=0
>
> node02---->broker.id=1
>
> node03---->broker.id=2

## kafka集群启动和停止

启动kafka时确保启动了zookeeper集群

##### 启动

1、前台启动,三台机器执行下列代码：

```sh
kafka-server-start.sh /kkb/install/kafka/config/server.properties
```

2、后台启动，三台机器执行下列代码：

```shell
nohup kafka-server-start.sh /kkb/install/kafka/config/server.properties >/dev/null 2>&1 &
```

3、写脚本来一键启动kafka

```
vi /home/hadoop/bin/start_kafka.sh
```

```shell
#!/bin/sh
for host in node01 node02 node03
do
        ssh $host "source /etc/profile;nohup kafka-server-start.sh /kkb/install/kafka/config/server.properties >/dev/null 2>&1 &" 
        echo "$host kafka is running"

done
```

##### 停止

所有节点执行关闭kafka脚本

```
kafka-server-stop.sh
```

写脚本来一键停止kafka

vi /home/hadoop/bin/stop_kafka.sh

```shell
#!/bin/sh
for host in node01 node02 node03
do
  ssh $host "source /etc/profile;nohup /kkb/install/kafka/bin/kafka-server-stop.sh &" 
  echo "$host kafka is stopping"
done
```



##### 一键启动和停止kafka脚本

```
vi /home/hadoop/bin/kafkaCluster.sh 
```

~~~shell
#!/bin/sh
case $1 in   #$1代表第一个参数
"start"){
for host in node01 node02 node03 
do
  ssh $host "source /home/hadoop/.bash_profile;source /etc/profile; nohup /kkb/install/kafka/bin/kafka-server-start.sh /kkb/install/kafka/config/server.properties > /dev/null 2>&1 &"   
  echo "$host kafka is running..."  
done  
};;

"stop"){
for host in node01 node02 node03 
do
  ssh $host "source /home/hadoop/.bash_profile;source /etc/profile; nohup /kkb/install/kafka/bin/kafka-server-stop.sh >/dev/null  2>&1 &"   
  echo "$host kafka is stopping..."  
done
};;
esac
~~~

写成这样也可以：

```sh
#!/bin/sh
case $1 in   #$1代表第一个参数
"start"){
for (( i=1 ; i <= 3 ; i = $i + 1 ));
do
  ssh node0$i "source /home/hadoop/.bash_profile;source /etc/profile; nohup /kkb/install/kafka/bin/kafka-server-start.sh /kkb/install/kafka/config/server.properties > /dev/null 2>&1 &"
  echo "$host kafka is running..."
done
};;

"stop"){
for host in node01 node02 node03
do
  ssh $host "source /home/hadoop/.bash_profile;source /etc/profile; nohup /kkb/install/kafka/bin/kafka-server-stop.sh >/dev/null  2>&1 &"
  echo "$host kafka is stopping..."
done
};;
esac
```

一键启动kafka

~~~shell
sh /home/bin/kafkaCluster.sh start
~~~

一键停止kafka

~~~shell
sh /home/bin/kafkaCluster.sh stop
~~~

> 说明：
>
> 1. 之前写脚本的时候，因为只用了source /etc/profile; 导致node01和node02都不能使用脚本启动，后来加上了source /home/hadoop/.bash_profile;才把问题给解决了。可能是因为java环境变量设置在了/home/hadoop/.bash_profile的原因。

## kafka的命令行的管理使用

##### 1、创建topic

```shell
kafka-topics.sh --create --partitions 3 --replication-factor 2 --topic test --zookeeper node01:2181,node02:2181,node03:2181
```

##### 2、查询所有的topic

```shell
kafka-topics.sh --list --zookeeper node01:2181,node02:2181,node03:2181 
test
```

> 说明：
>
> 1. kafka是有一个内置的topic的，名称为__consumer_offsets，但是现在还没创建。
> 2. __consumer_offsets作为kafka的内部topic，用来保存消费组元数据以及对应提交的offset信息。
> 3. 消费者poll数据时会去创建consumer_offsets，当然前提是consumer_offsets不存在的情况下

##### 3、查看topic的描述信息

~~~shell
kafka-topics.sh --describe --topic test --zookeeper node01:2181,node02:2181,node03:2181
~~~

> 运行结果为：
>
> Topic:test      PartitionCount:3        ReplicationFactor:2     Configs:
>      Topic: test     Partition: 0    Leader: 1       Replicas: 1,2   Isr: 1,2
>      Topic: test     Partition: 1    Leader: 2       Replicas: 2,0   Isr: 2,0
>      Topic: test     Partition: 2    Leader: 0       Replicas: 0,1   Isr: 0,1
>
> 说明：
>
> 1. PartitionCount:3 表示该topic一共3个partition
>
> 2. ReplicationFactor:2 表示每个分区都有2个副本
>
> 3. Partition: 0    Leader: 1       Replicas: 1,2   Isr: 1,2
>
>    表示0号分区的Leader partition处在broker.id=1的节点上（node02),2个副本分别处在broker.id=1/broker.id=2的节点上（node02/node03), Isr列表有两个partition且分别处在broker.id=1/broker.id=2的节点上（node02/node03)
>
> 4. Isr列表中的partition是跟leader partition的数据同步的，详情看kafka集群架构。
>
> 了解test topic的信息后，我们来==观察一下kafka的数据保存目录==：
>
> ```sh
> [hadoop@node01 ~]$ xcall ls /kkb/install/kafka/kafka-logs/
> ============= node01 ls /kkb/install/kafka/kafka-logs/ =============
> test-1
> test-2
> ============= node02 ls /kkb/install/kafka/kafka-logs/ =============
> test-0
> test-2
> ============= node03 ls /kkb/install/kafka/kafka-logs/ =============
> test-0
> test-1
> ```
>
> 从ls结果可以发现，node01/node02/node03的/kkb/install/kafka/kafka-logs/数据保存目录下分别有不同的test-x目录，这个刚好跟描述信息符合。
>
> ==topic的数据是以分区为单位进行保存的，而且一个分区的数据是保存在以该分区编号为后缀的目录下的==，比如test topic的0号partition的数据是保存在test-0目录下的。而0号分区有2个副本，分别在node02/node03,Leader partition在node2。
>
> 

##### 4、删除topic

~~~shell
kafka-topics.sh --delete --topic test --zookeeper node01:2181,node02:2181,node03:2181 
~~~

##### 5、模拟生产者写入数据到topic中

kafka-console-producer.sh

```shell
kafka-console-producer.sh --broker-list node01:9092,node02:9092,node03:9092 --topic test 
```

##### 6、模拟消费者拉取topic中的数据

kafka-console-consumer.sh

```shell
kafka-console-consumer.sh --zookeeper node01:2181,node02:2181,node03:2181 --topic test --from-beginning
#或者
kafka-console-consumer.sh --bootstrap-server node01:9092,node02:9092,node03:9092 --topic test --from-beginning
```

> 说明：
>
> 在使用kafka-console-consumer.sh --zookeeper node01:2181,node02:2181,node03:2181 --topic test --from-beginning这种方式消费数据时，会报以下警告：
>
> Using the ConsoleConsumer with old consumer is deprecated and will be removed in a future major release. ==Consider using the new consumer by passing [bootstrap-server] instead of [zookeeper].==
>
> 警告信息表示这种消费方式过时了，建议使用bootstrap-server。
>
> 1. 当使用--zookeeper方式消费时，消费的偏移量等信息是保存在zookeeper中的
> 2. 当使用--bootstrap-server方式消费时，消费的偏移量等信息时保存在kafka的内置topic中的。

## kafka的生产者api代码开发

创建maven工程引入依赖

~~~xml
        <dependency>
            <groupId>org.apache.kafka</groupId>
            <artifactId>kafka-clients</artifactId>
            <version>1.0.1</version>
        </dependency>
~~~

代码开发

```java
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerRecord;

import java.util.Properties;

public class KafkaDemo {
    public static void main(String[] args) {
        //添加属性，设置kafka集群地址
        Properties props=new Properties();
        props.setProperty("bootstrap.servers","node01:9092,node02:9092,node03:9092");

        props.put("ack","1");
        props.put("retries",0);
        props.put("buffer.memory",33554432);
        props.put("batch.size",16384);
        props.put("linger.ms",1);
        //消息是由key和value构成的，下面设置key和value的序列化器
        props.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
        props.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");

        Producer producer=new KafkaProducer(props);
        //或Producer<String,String> producer=new KafkaProducer<String,String>(props);

        for (int i=0;i<100;i++){
            //下面需要三个参数，第一个：topic的名称，第二个参数：表示消息的key,第三个参数：消息具体内容
            producer.send(new ProducerRecord("test",Integer.toString(i),"hello-kafka-"+i));
        }
        producer.close();
    }
}

```

> 说明：
>
> 1. props.put("==ack==","1"); ack代表==消息确认机制==，有3种值：1 0 -1
>    ack = 0: 表示produce发送完消息后，请求立即返回，不需要等待leader的任何确认。这种方案有最高的吞吐率，但是不保证消息是否真的发送成功。
>
>    ack = 1: 表示leader副本必须应答此produce请求并写入消息到本地日志，之后produce请求被认为成功. 如果leader挂掉有数据丢失的风险
>
>    ack = -1或者all: 表示分区leader必须等待消息被成功写入到所有的ISR副本(同步副本)中才认为produce请求成功。这种方案提供最高的消息持久性保证，但是理论上吞吐率也是最差的。
>
> 2. props.put("retries",0);表示==生产者发送消息失败后，重试的次数==。
>
> 3. props.put("buffer.memory",33554432); buffer.memory是缓冲区大小，33554432表示32M。 props.put("batch.size",16384); batch.size是批处理大小，16384表示16KB。
>
>    详情见下图：producer如果一条条地把数据发送到topic，会比较费力，所以producer先往缓冲区写数据，缓冲区满32M时就开始进行批次发送，每一批次发送16KB数据。
>
>    ![image-20200420042106148](kafka.assets/image-20200420042106148.png)
>
> 4. props.put("linger.ms", 1); linger.ms表示如果批次发送的batch不满16KB时，不会立即发送数据出去，而是等待1ms,1ms后，如果凑够16KB就发送16KB数据过去，当然不凑够也会发送出去。
>
> 5. producer.send(new ProducerRecord(xxx))将数据发送出去，new ProducerRecord(xxx)将一条数据包装成ProducerRecord
>
> ==模拟消费者消费数据验证producer是否成功发送数据：==
>
> ```sh
> kafka-console-consumer.sh --bootstrap-server node01:9092,node02:9092,node03:9092 --topic test --from-beginning
> ```
>
> ![image-20200420043548757](kafka.assets/image-20200420043548757.png)




## kafka的消费者api代码开发

#### 自动提交偏移量代码开发

```java
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;

import java.util.Arrays;
import java.util.Properties;

public class KafkaDemo2 {
    public static void main(String[] args) {
        Properties props=new Properties();
        props.setProperty("bootstrap.servers","node01:9092,node02:9092,node03:9092");
        //指定消费者组id
        props.put("group.id","consumer-test");
        //指定是否自动提交偏移量
        props.put("enable.auto.commit",true);
        //自动提交偏移量的时间间隔：
        props.put("enable.auto.interval.ms","1000");
        props.put("auto.offset.reset","earliest");
        //指定key和value的反序列化器
        props.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
        props.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
        KafkaConsumer<String, String> consumer = new KafkaConsumer<String, String>(props);
        //指定消费哪些topic
        consumer.subscribe(Arrays.asList("test"));
        //设置死循环，持续开启消费
        while (true){
            ConsumerRecords<String, String> records = consumer.poll(100);
            //消费数据：
            for(ConsumerRecord<String,String> r:records){
                int partition=r.partition();
                String key=r.key();
                String value=r.value();
                long offset=r.offset();
                System.out.println("partition:"+partition+"\t key:"+key+"\toffset:"+offset+"\tvalue:"+value);
            }
        }
    }
}

```

> 说明：
>
> 1. props.put("auto.offset.reset","earliest"); auto.offset.reset表示偏移量自动重置的方式，有三种方式,默认是latest方式，如下：
>
>    earliest: 当各分区下有已提交的offset时，从提交的offset开始消费；==无提交的offset时，从头开始消费==
>    latest: 当各分区下有已提交的offset时，从提交的offset开始消费；==无提交的offset时，消费新产生的该分区下的数据==
>    none : topic各分区都存在已提交的offset时，从offset后开始消费；==只要有一个分区不存在已提交的offset，则抛出异常==
>
> 2. **使用consumer.poll(100)拉取数据时，会将拉取到的每一条消息数据封装在ConsumerRecord对象里，而所有的ConsumerRecord对象都被封装在一个ConsumerRecords类对象里。**
>
> 3. consumer.poll(100)的参数100表示timeout,是一个超时时间，消费者一旦拿到足够多的数据（具体多少看参数设置），consumer.poll(100)就会返回ConsumerRecords<String,String>，==如果没有拿到足够多的数据，会阻塞100ms,但是100ms后就会返回==。
>
> 运行后，消费了数据，而且程序一直保持运行状态：
>
> ![image-20200420144834785](kafka.assets/image-20200420144834785.png)

#### 手动提交偏移量代码开发

~~~java
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Properties;

public class KafkaDemo2 {
    public static void main(String[] args) {
        Properties props=new Properties();
        props.setProperty("bootstrap.servers","node01:9092,node02:9092,node03:9092");
        props.put("group.id","manual-consumer");
        props.put("enable.auto.commit","false");
        props.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
        props.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
        KafkaConsumer<String, String> consumer = new KafkaConsumer<String, String>(props);
        consumer.subscribe(Arrays.asList("test"));

        //定义一个数字，表示消费多少条消息后手动提交偏移量
        final int minBatchSize=20;

        //定义一个数组，缓冲一批数据
        ArrayList<ConsumerRecord<String, String>> buffer = new ArrayList<ConsumerRecord<String, String>>();

        while (true){
            ConsumerRecords<String, String> records = consumer.poll(100);
            //将拉取的每一条数据都添加到buffer
            for(ConsumerRecord cr:records){
                buffer.add(cr);
            }
            //消费数据：
            if(buffer.size()>=minBatchSize){
                System.out.println("缓冲区的数据条数："+buffer.size());
                System.out.println("我已经处理完这一批数据了...");
                consumer.commitSync();  //提交偏移量
                buffer.clear();
            }
        }
    }
}

~~~

运行本程序后，使用生产者程序发送消息，然后观看本程序运行界面，出现如下输出：

```sh
缓冲区的数据条数：20
我已经处理完这一批数据了...
缓冲区的数据条数：27
我已经处理完这一批数据了...
缓冲区的数据条数：45
我已经处理完这一批数据了...
缓冲区的数据条数：33
我已经处理完这一批数据了...
```



## 招聘要求介绍

![1568432422326](kafka.assets/1568432422326.png)

![1568432464259](kafka.assets/1568432464259.png)



## kafka分区策略

##### 哪里指定分区策略？

kafka的分区策略决定了producer生产者产生的一条消息最后会写入到topic的哪一个分区中。

分区策略在ProducerRecord类的对象里设置，我们来看一下源码，如下。我们可以看到，ProducerRecord类有多种构造方法。使用不同的构造方法构建对象时，会有不同的分区策略。

```java
public ProducerRecord(String topic, Integer partition, Long timestamp, K key, V value) {
        this(topic, partition, timestamp, key, value, (Iterable)null);
    }

    public ProducerRecord(String topic, Integer partition, K key, V value, Iterable<Header> headers) {
        this(topic, partition, (Long)null, key, value, headers);
    }

    public ProducerRecord(String topic, Integer partition, K key, V value) {
        this(topic, partition, (Long)null, key, value, (Iterable)null);
    }

    public ProducerRecord(String topic, K key, V value) {
        this(topic, (Integer)null, (Long)null, key, value, (Iterable)null);
    }

    public ProducerRecord(String topic, V value) {
        this(topic, (Integer)null, (Long)null, (Object)null, value, (Iterable)null);
    }
```

##### 1、指定具体的分区号

给定具体的分区号，数据就会写入到指定的分区中

~~~java
//将数据写入0号分区中：
producer.send(new ProducerRecord<String, String>("test", 0,Integer.toString(i), "hello-kafka-"+i));
~~~

##### 2、不给定具体的分区号，给定key的值（key不断变化）

不给定具体的分区号，给定一个key值, 这里使用计算公式：key.hashcode%分区数=分区号 来决定。key是消息的key。

~~~java
//Integer.toString(i)在这里是key
producer.send(new ProducerRecord<String, String>("test", Integer.toString(i), "hello-kafka-"+i));
~~~

##### 3、不给定具体的分区号，也不给对应的key

不给定具体的分区号，也不给定对应的key ,这个它会进行轮训的方式把数据写入到不同分区中

~~~java
producer.send(new ProducerRecord<String, String>("test", "hello-kafka-"+i));
~~~

##### 4、自定义分区

定义一个类实现接口Partitioner，并实现里面的抽象方法。

~~~java
import org.apache.kafka.clients.producer.Partitioner;
import org.apache.kafka.common.Cluster;

import java.util.Map;

public class MyPartitioner implements Partitioner{
    /**
     *
     * @param s  topic
     * @param o  消息数据的key
     * @param bytes  key的字节数组
     * @param o1   消息数据的value
     * @param bytes1   value的字节数组
     * @param cluster  集群
     * @return
     */
    public int partition(String s, Object o, byte[] bytes, Object o1, byte[] bytes1, Cluster cluster) {
        //获取topic的分区个数：
        Integer numPartitions = cluster.partitionCountForTopic(s);
        //计算并返回分区号
        // o.hashCode()%numPartitions的值可能是 -1 -2 0 1 2，要取绝对值
        return Math.abs(o.hashCode()%numPartitions);
    }

    public void close() {

    }

    public void configure(Map<String, ?> map) {

    }
}
~~~

配置自定义分区类

~~~java
//在Properties对象中添加自定义分区类
props.put("partitioner.class","com.kaikeba.partitioner.MyPartitioner");
~~~





## kafka的文件存储机制

![image-20200602221111202](kafka.assets/image-20200602221111202.png)

#### 概述

> 同一个topic下有多个不同的partition，每个partition为一个目录，partition命名的规则是topic的名称加上一个序号，序号从0开始。
>
> ![image-20200421031834688](kafka.assets/image-20200421031834688.png)
>
> 每一个partition目录下的文件被平均切割成大小相等（默认一个文件是1G，可以手动去设置）的数据文件，==每一个数据文件都被称为一个段（segment file）==，但每个段消息数量不一定相等。一个segment内部包含了2个文件，一个是.log，一个是.index，log负责数据的存储，index负责对文件数据构建索引，方便以后查询。这种特性能够使得老的segment可以被快速清除。==默认保留7天的数据。==
>
> segment每次满1G后，数据会再写入到一个新的文件中。
>
> <img src="kafka.assets/image-20200421031850314.png" alt="image-20200421031850314" style="zoom:80%;" />
>
> 另外每个partition只需要支持顺序读写就可以。如上图所示：
>
> 首先00000000000000000000.log是最早产生的文件，
>
> 该文件达到1G后又产生了新的00000000000002025849.log文件，新的数据会写入到这个新的文件里面。这个文件到达1G后，数据又会写入到下一个文件中。也就是说它只会往文件的末尾追加数据，这就是顺序写的过程，生产者只会对每一个partition做数据的追加（写操作）。
>
> ==新文件的文件的命名规则就是之前分区的所有数据的条数+1==

#### 数据消费问题讨论（面试题）

> 问题：==如何保证消息消费的有序性呢？==比如说生产者生产了0到100个商品，那么消费者在消费的时候按照0到100这个从小到大的顺序消费？
>
> 1、那么kafka如何保证这种有序性呢？
>
> 难度就在于，生产者生产出0到100这100条数据之后，通过一定的分组策略存储到broker的partition中的时候，比如0到10这10条消息被存到了这个partition中，10到20这10条消息被存到了那个partition中，这样的话，消息在分组存到partition中的时候就已经被分组策略搞得无序了。
>
> 2、那么能否做到消费者在消费消息的时候全局有序呢？
>
> 遇到这个问题，我们可以回答，在大多数情况下是做不到全局有序的。但在某些情况下是可以做到的。比如我的partition只有一个，这种情况下是可以全局有序的。
>
> 那么可能有人又要问了，只有一个partition的话，哪里来的分布式呢？哪里来的负载均衡呢？所以说，全局有序是一个伪命题！全局有序根本没有办法在kafka要实现的大数据的场景来做到。但是我们只能保证当前这个partition内部消息消费的有序性。
>
> ==结论：一个partition中的数据是有序的吗？回答：间隔有序，不连续。==
>
> 针对一个topic里面的数据，只能做到partition内部有序，不能做到全局有序。特别是加入消费者的场景后，如何保证消费者的消费的消息的全局有序性，这是一个伪命题，只有在一种情况下才能保证消费的消息的全局有序性，那就是只有一个partition。

#### Segment文件

###### Segment file是什么

> 生产者生产的消息按照一定的分区策略被发送到topic中partition中，partition在磁盘上就是一个目录，该目录名是topic的名称加上一个序号，在这个==partition目录下，有两类文件，一类是以log为后缀的文件，一类是以index为后缀的文件，每一个log文件和一个index文件相对应==，这一对文件就是一个segment file，也就是一个段。
>
> 其中的log文件就是数据文件，里面存放的就是消息，而index文件是索引文件，索引文件记录了元数据信息。log文件达到1个G后滚动重新生成新的log文件

###### Segment文件特点

> segment文件命名的规则：partition全局的第一个segment从0（20个0）开始，后续的每一个segment文件名是上一个segment文件中最后一条消息的offset值。那么这样命令有什么好处呢？
>
> ==假如我们有一个消费者已经消费到了368776（offset值为368776），那么现在我们要继续消费的话，怎么做呢？==
>
> 看下图，分2个步骤;
>
> 第1步：从所有log文件的的文件名中找到对应的log文件，第368776条数据位于上图中的“00000000000000368769.log”这个文件中，这一步涉及到一个常用的算法叫做“二分查找法”
>
> （假如我现在给你一个offset值让你去找，你首先是==将所有的log的文件名进行排序，然后通过二分查找法进行查找，很快就能定位到某一个文件==，紧接着拿着这个offset值到其索引文件中找这条数据究竟存在哪里）；
>
> 第2步：到index文件中去找第368776条数据所在的位置。
>
> 索引文件（index文件）中存储这大量的元数据，而数据文件（log文件）中存储这大量的消息。
>
> 索引文件（index文件）中的元数据指向对应的数据文件（log文件）中消息的物理偏移地址。
>
> 那==如何根据索引文件来快速找到第368776条数据所在的位置？看下面的快速查询知识点。==
>
> 



## kafka如何快速查询数据

#### index与log文件结构

![kafka](kafka.assets/kafka.png)



> 上图的左半部分是索引文件，里面存储的是一对一对的key-value，其中key是消息在数据文件（对应的log文件）中的编号，比如==“1,3,6,8……”，分别表示在log文件中的第1条消息、第3条消息、第6条消息==、第8条消息……，那么为什么在index文件中这些编号不是连续的呢？
>
> 这是因为==index文件中并没有为数据文件中的每条消息都建立索引，而是采用了稀疏存储的方式，每隔一定字节的数据建立一条索引==。这样避免了索引文件占用过多的空间，从而可以将索引文件保留在内存中。
>
> 但缺点是没有建立索引的Message也不能一次定位到其在数据文件的位置，从而需要做一次顺序扫描，但是这次顺序扫描的范围就很小了。
>
> 例子1：以要读取第368777条数据为例， 由368777-368769=8得到，该数据在0000368769.log文件中是第8条数据，再找到索引文件中元数据8,1686，其中8代表在右边log数据文件中从上到下第8个消息(在全局partiton表示第368777个消息)，其中1686表示该消息的物理偏移地址（位置）为1686。
>
> 要是读取offset=368777的消息，就从00000000000000368769.log文件中的1686的位置进行读取。
>
> 例子2：如果要读取的是第368776条数据呢？368776-368769=7，表示log文件中的第7条数据，但在稀疏的index文件中没有为第7条数据建立索引，这时候就可以先定位到第6条或第8条数据在log文件的物理位置等，然后进行依次顺序扫描即可。虽说顺序扫描效率不够，但是扫描范围已经很小了。
>
> ==那定位到某条数据在log文件的位置后，开始读取，那怎么知道何时读完本条消息，否则就读到下一条消息的内容了？==，看下面的Message物理结构。
> 	

#### Message物理结构

![img](kafka.assets/20170107212325100.png)

参数说明：

| 关键字              | 解释说明                                                     |
| ------------------- | ------------------------------------------------------------ |
| 8 byte offset       | 在parition(分区)内的每条消息都有一个有序的id号，这个id号被称为偏移(offset),它可以唯一确定每条消息在parition(分区)内的位置。即offset表示partiion的第多少message |
| 4 byte message size | message大小                                                  |
| 4 byte CRC32        | 用crc32校验message                                           |
| 1 byte “magic"      | 表示本次发布Kafka服务程序协议版本号                          |
| 1 byte “attributes" | 表示为独立版本、或标识压缩类型、或编码类型。                 |
| 4 byte key length   | 表示key的长度,当key为-1时，K byte key字段不填                |
| K byte key          | 可选                                                         |
| value bytes payload | 表示实际消息数据。                                           |

> 这个就需要涉及到消息的物理结构了，==消息都具有固定的物理结构==，包括：offset（8 Bytes）、消息体的大小（4 Bytes）、crc32（4 Bytes）、magic（1 Byte）、attributes（1 Byte）、key length（4 Bytes）、key（K Bytes）、payload(N Bytes)等等字段，==可以确定一条消息的大小，即读取到哪里截止。==



#### kafka高效文件存储设计特点

1. Kafka把topic中一个parition大文件分成多个小文件段，通过多个小文件段，就容易定期清除或删除已经消费完文件，减少磁盘占用。
2. 通过索引信息可以快速定位message
3. 通过将index元数据全部映射到memory，可以避免segment file的IO磁盘操作。
4. 通过索引文件稀疏存储，可以大幅降低index文件元数据占用空间大小。





## 为什么Kafka速度那么快

Kafka是大数据领域无处不在的消息中间件，目前广泛使用在企业内部的实时数据管道，并帮助企业构建自己的流计算应用程序。

Kafka虽然是基于磁盘做的数据存储，但却具有高性能、高吞吐、低延时的特点，其吞吐量动辄几万、几十上百万，这其中的原由值得我们一探究竟。

#### 顺序读写

> ==磁盘顺序读写性能要高于内存的随机读写==
>
> 众所周知Kafka是将消息记录持久化到本地磁盘中的，一般人会认为磁盘读写性能差，可能会对Kafka性能如何保证提出质疑。实际上不管是内存还是磁盘，快或慢关键在于寻址的方式，磁盘分为顺序读写与随机读写，内存也一样分为顺序读写与随机读写。基于磁盘的随机读写确实很慢，但磁盘的顺序读写性能却很高，一般而言要高出磁盘随机读写三个数量级，==一些情况下磁盘顺序读写性能甚至要高于内存随机读写==。
>
> 磁盘的顺序读写是磁盘使用模式中最有规律的，并且操作系统也对这种模式做了大量优化，Kafka就是使用了磁盘顺序读写来提升的性能。==Kafka的message是不断追加到本地磁盘文件末尾的，而不是随机的写入，这使得Kafka写入吞吐量得到了显著提升==



#### Page Cache(页缓存)

> 为了优化读写性能，==Kafka利用了操作系统本身的Page Cache，就是利用操作系统自身的内存而不是JVM空间内存==。这样做的好处有：
>
> （1）避免Object消耗：如果是使用Java堆，Java对象的内存消耗比较大，通常是所存储数据的两倍甚至更多。
>
> （2）避免GC问题：随着JVM中数据不断增多，垃圾回收将会变得复杂与缓慢，使用系统缓存就不会存在GC问题。

#### 零拷贝(sendfile)-了解即可

零拷贝并不是不需要拷贝，而是减少不必要的拷贝次数。通常是说在IO读写过程中。Kafka利用linux操作系统的 "零拷贝（zero-copy）" 机制在消费端做的优化。

###### 数据从文件发送到socket网络连接中的常规传输路径：

> 比如：读取文件，再用socket发送出去。传统方式的实现是：
>
> 1. 先读取、再发送，实际经过1~4四次copy。
> 2. buffer = File.read 
> 3. Socket.send(buffer)
>
> 示意图如下：
>
> <img src="kafka.assets/image-20200421134041498.png" alt="image-20200421134041498" style="zoom: 67%;" />
>
> 第一步：操作系统从磁盘读取数据到内核空间（kernel space）的Page Cache缓冲区
>
> 第二步：应用程序读取内核缓冲区的数据copy到用户空间（user space）的缓冲区
>
> 第三步：应用程序将用户空间缓冲区的数据copy回内核空间到socket缓冲区
>
> 第四步：操作系统将数据从socket缓冲区copy到网卡，由网卡进行网络传输
>
> 拓展：套接字（*socket*）是一个抽象层，应用程序可以通过它发送或接收数据，可对其进行像对文件一样的打开、读写和关闭等操作。套接字允许应用程序将I/O插入到网络中，并与网络中的其他应用程序进行通信。
>
> ==传统方式，读取磁盘文件并进行网络发送，经过的四次数据copy是非常繁琐的==。实际IO读写，需要进行IO中断，需要CPU响应中断(带来上下文切换)，尽管后来引入DMA来接管CPU的中断请求，但四次copy是存在“不必要的拷贝”的。
>
> 重新思考传统IO方式，会注意到实际上并不需要第二个和第三个数据副本。应用程序除了缓存数据并将其传输回套接字缓冲区之外什么都不做。相反，数据可以直接从读缓冲区传输到套接字缓冲区。
>
> 显然，第二次和第三次数据copy 其实在==这种场景==下没有什么帮助反而带来开销，这也正是零拷贝出现的意义。
>
> ==这种场景：是指读取磁盘文件后，不需要做其他处理，直接用网络发送出去。试想，如果读取磁盘的数据需要用程序进一步处理的话，必须要经过第二次和第三次数据copy，让应用程序在内存缓冲区处理。==
>
> 下面，我们来尝试做下改变，减少copy次数：
>
> <img src="kafka.assets/image-20200421134751711.png" alt="image-20200421134751711" style="zoom: 80%;" />
>
> 此时我们会发现用户态“空空如也”。数据没有来到用户态，而是直接在核心态就进行了传输，但这样依然还是有多次复制。首先数据被读取到read buffer中，然后发到socket buffer，最后才发到网卡。虽然减少了用户态和核心态的切换，但依然存在多次数据复制。
>
> 如果可以进一步减少数据复制的次数，甚至没有数据复制是不是就会做到最快呢？



###### 利用DMA实现“零拷贝”

DMA，全称叫Direct Memory Access，一种可让某些硬件子系统去直接访问系统主内存，而不用依赖CPU的计算机系统的功能。听着是不是很厉害，跳过CPU，直接访问主内存。传统的内存访问都需要通过CPU的调度来完成。如下图：

![image-20200421134217426](kafka.assets/image-20200421134217426.png)

而DMA，则可以绕过CPU，硬件自己去直接访问系统主内存。如下图

![1577687862577](kafka.assets/1577687862577.png)

回到本文中的文件传输，有了DMA后，就可以实现绝对的零拷贝了，因为网卡是直接去访问系统主内存的。如下图：	

![image-20200421135005858](kafka.assets/image-20200421135005858.png)

#### 总结

Kafka采用==顺序读写、Page Cache、零拷贝以及分区分段等这些设计，再加上在索引方面做的优化，另外Kafka数据读写也是批量的而不是单条的==，使得Kafka具有了高性能、高吞吐、低延时的特点。这样Kafka提供大容量的磁盘存储也变成了一种优点

Java的NIO提供了FileChannle，它的transferTo、transferFrom方法就是Zero Copy。

## kafka整合flume

#### 为什么整合flume？

观察下面的开发思路就可以理解了：

![image-20200420153016660](kafka.assets/image-20200420153016660.png)



#### kafka整合flume案例

1、添加flume的配置

vi flume-kafka.conf

~~~shell
#为我们的source channel  sink起名
a1.sources = r1
a1.channels = c1
a1.sinks = k1

#指定我们的source数据收集策略
a1.sources.r1.type = spooldir
a1.sources.r1.spoolDir = /kkb/install/flumeData/files
a1.sources.r1.inputCharset = utf-8

#指定我们的source收集到的数据发送到哪个管道
a1.sources.r1.channels = c1

#指定我们的channel为memory,即表示所有的数据都装进memory当中
a1.channels.c1.type = memory
a1.channels.c1.capacity = 1000
a1.channels.c1.transactionCapacity = 100


#指定我们的sink为kafka sink，并指定我们的sink从哪个channel当中读取数据
a1.sinks.k1.channel = c1
a1.sinks.k1.type = org.apache.flume.sink.kafka.KafkaSink
a1.sinks.k1.kafka.topic = kaikeba
a1.sinks.k1.kafka.bootstrap.servers = node01:9092,node02:9092,node03:9092
a1.sinks.k1.kafka.flumeBatchSize = 20
a1.sinks.k1.kafka.producer.acks = 1
~~~

2、创建topic

~~~shell
kafka-topics.sh --create --topic kaikeba --partitions 3 --replication-factor 2  --zookeeper node01:2181,node02:2181,node03:2181
~~~

3、启动flume

~~~shell
bin/flume-ng agent -n a1 -c conf -f conf/flume-kafka.conf -Dflume.root.logger=info,console
~~~

4、启动kafka控制台消费者，验证数据写入成功

~~~shell
kafka-console-consumer.sh --topic kaikeba --bootstrap-server node01:9092,node02:9092,node03:9092  --from-beginning
~~~



## kafka监控工具安装和使用

#### 工具-Kafka Manager

kafkaManager它是由雅虎开源的可以监控整个kafka集群相关信息的一个工具。

（1）可以管理几个不同的集群

（2）监控集群的状态(topics, brokers, 副本分布, 分区分布)

（3）创建topic、修改topic相关配置

###### 1、上传安装包到node01

```
kafka-manager-1.3.0.4.zip
```

###### 2、解压安装包

```sh
sudo yum -y install unzip
unzip kafka-manager-1.3.0.4.zip  -d /kkb/install 
```

###### 3、修改配置文件

```
cd /kkb/install/kafka-manager-1.3.0.4/conf
vim application.conf
```

```shell
#修改kafka-manager.zkhosts的值，指定kafka集群地址
kafka-manager.zkhosts="node01:2181,node02:2181,node03:2181"
```

###### 4、启动kafka-manager

> 启动zk集群，kafka集群，再使用root用户启动kafka-manager服务。
>
> 注意：因为要使用root用户启动，所以，==建议在/etc/profile上重新配置以下Java的环境变量==，虽然在hadoop用户的.bash_profile上配置过了，但是启动kafka-manager时还是会报错：java没有找到。
>
> ```sh
> su - root
> vi /etc/profile
> 
> export JAVA_HOME=xxx
> export Path=xxx:$JAVA_HOME/bin
> ```
>
> 前台启动：
>
> ```sh
> cd /kkb/install/kafka-manager-1.3.0.4/
> bin/kafka-manager -Dconfig.file=conf/application.conf 
> #-Dconfig.file=conf/application.conf 指定配置文件
> ```
>
> 后台启动：
>
> ```sh
> cd /kkb/install/kafka-manager-1.3.0.4/
> nohup bin/kafka-manager -Dconfig.file=conf/application.conf &
> ```
>
> 还可以通过-Dhttp.port手动指定kafka-manager的端口（默认端口是: 9000)
>
> ```sh
> bin/kafka-manager -Dconfig.file=conf/application.conf -Dhttp.port=8080
> ```
>
> 

###### 5、访问地址

node01:9000

通过web界面添加kafka 集群的方法：（kafka集群可以添加多个，也就是说该工具可以监控多个集群）

- cluster name随便取一个名字即可，如MyKafka
- cluster zookeeper Hosts填我们的zookeeper集群地址
- Kafka version 随便选取一个即可

<img src="kafka.assets/image-20200421174822032.png" alt="image-20200421174822032" style="zoom:80%;" />

添加好kafka集群后，查看自己的集群情况：

![image-20200421175215928](kafka.assets/image-20200421175215928.png)



#### 工具-KafkaOffsetMonitor

该监控是基于一个jar包的形式运行，部署较为方便。==只有监控功能==，使用起来也较为安全

(1)消费者组列表

(2)查看topic的历史消费信息.

(3)每个topic的所有parition列表(topic,pid,offset,logSize,lag,owner)

(4)对consumer消费情况进行监控,并能列出每个consumer offset,滞后数据。

###### 1、下载安装包

```
KafkaOffsetMonitor-assembly-0.2.0.jar
```

###### 2、在服务器上新建一个目录kafka_moitor，把jar包上传到该目录中

```sh
[hadoop@node01 soft]$ cd /kkb/install/
[hadoop@node01 install]$ mkdir kafka_moitor
[hadoop@node01 install]$ mv /kkb/soft/KafkaOffsetMonitor-assembly-0.2.0.jar /kkb/install/kafka_moitor/
```

###### 3、在kafka_moitor目录下新建一个脚本

```sh
cd /kkb/install/kafka_moitor/
vim start_kafka_web.sh
```

```shell
#!/bin/sh
java -cp KafkaOffsetMonitor-assembly-0.2.0.jar com.quantifind.kafka.offsetapp.OffsetGetterWeb --zk node01:2181,node02:2181,node03:2181 --port 8089 --refresh 10.seconds --retain 1.days
```

###### 4、启动脚本

```shell
nohup sh start_kafka_web.sh &
```

###### 5、访问地址

在浏览器中即可使用node01:8089访问kafka的监控页面。

![1577435232773](kafka.assets/1577435232773.png)

![1577435264270](kafka.assets/1577435264270.png)



#### 工具-Kafka Eagle(推荐)

1、下载Kafka Eagle安装包

- http://download.smartloli.org/
  - kafka-eagle-bin-1.2.3.tar.gz

2、解压 

```sh
tar -zxvf /kkb/soft/kafka-eagle-bin-1.2.3.tar.gz -C /kkb/install/

cd /kkb/install/kafka-eagle-bin-1.2.3/
tar -zxvf kafka-eagle-web-1.2.3-bin.tar.gz 

mv kafka-eagle-web-1.2.3 kafka-eagle-web
```

3、修改配置文件

进入到conf目录, 修改system-config.properties

```sh
cd /kkb/install/kafka-eagle-bin-1.2.3/kafka-eagle-web/conf

vi system-config.properties
```

```sh
## 填上你的kafka集群信息
kafka.eagle.zk.cluster.alias=cluster1  #别名
cluster1.zk.list=node01:2181,node02:2181,node03:2181

## kafka eagle页面访问端口
kafka.eagle.webui.port=8048

## kafka sasl authenticate
kafka.eagle.sasl.enable=false
kafka.eagle.sasl.protocol=SASL_PLAINTEXT
kafka.eagle.sasl.mechanism=PLAIN
kafka.eagle.sasl.client=/kkb/install/kafka-eagle-bin-1.2.3/kafka-eagle-web/conf/kafka_client_jaas.conf  #这个要自己添加

##  添加刚刚导入的ke数据库配置，我这里使用的是mysql
kafka.eagle.driver=com.mysql.jdbc.Driver
kafka.eagle.url=jdbc:mysql://node03:3306/ke?useUnicode=true&characterEncoding=UTF-8&zeroDateTimeBehavior=convertToNull
kafka.eagle.username=root
kafka.eagle.password=123456
```

4、配置环境变量

vi /etc/profile

```
export KE_HOME=/kkb/install/kafka-eagle-bin-1.2.3/kafka-eagle-web
export PATH=$PATH:$KE_HOME/bin

source /etc/profile
```

5、启动kafka-eagle

进入到$KE_HOME/bin目录，执行脚本sh ke.sh start

```sh
[hadoop@node01 conf]$ cd $KE_HOME/bin
[hadoop@node01 bin]$ sh ke.sh start
```

6、访问地址

启动成功后在浏览器中输入http://node01:8048/ke就可以访问kafka eagle 了。 

<video src="E:\LearningAll\8-HadoopEcosystem-Video\kafka.assets\kafka-eagle.mp4" />
## kafka内核原理

#### ISR机制

光是依靠多副本机制能保证Kafka的高可用性，但是能保证数据不丢失吗？

不行，因为如果leader宕机，但是leader的数据还没同步到follower上去，此时即使选举了follower作为新的leader，当时刚才的数据已经丢失了。

ISR是：in-sync replica，就是跟leader partition保持同步的follower partition的数量，只有处于ISR列表中的follower才可以在leader宕机之后被选举为新的leader，因为在这个ISR列表里代表他的数据跟leader是同步的。

如果要保证写入kafka的数据不丢失，首先需要保证ISR中至少有一个follower，其次就是在一条数据写入了leader partition之后，要求必须复制给ISR中所有的follower partition，才能说代表这条数据已提交，绝对不会丢失，这是Kafka给出的承诺。

leader partition挂掉时，如果ISR列表里没有follower partition，将会报异常。

#### HW&LEO原理

LEO

> last end offset，日志末端偏移量，==标识当前日志文件中下一条待写入的消息的offset==。举一个例子，若LEO=10，那么表示在该副本日志上已经保存了10条消息，位移范围是[0，9]。

HW

> Highwatermark，俗称==高水位，它标识了一个特定的消息偏移量（offset），消费者只能拉取到这个offset之前的消息==。任何一个副本对象的HW值一定不大于其LEO值。
> 	小于或等于HW值的所有消息被认为是“已提交的”或“已备份的”。==HW它的作用主要是用来判断副本的备份进度.==
> 	下图表示一个日志文件，这个日志文件中只有9条消息，第一条消息的offset（LogStartOffset）为0，最后一条消息的offset为8，offset为9的消息使用虚线表示的，代表下一条待写入的消息。日志文件的 HW 为6，表示消费者只能拉取offset在 0 到 5 之间的消息，offset为6的消息对消费者而言是不可见的。

![img](kafka.assets/691225277.png)

![img](kafka.assets/u=1118880152,1351290688&fm=26&gp=0.jpg)

> ==leader持有的HW即为分区的HW,同时leader所在broker还保存了所有follower副本的leo==
>
> （1）关系：leader的leo >= follower的leo >= leader保存的follower的leo >= leader的hw >= follower的hw
>
> （2）原理：上面关系反应出各个值的更新逻辑的先后

#### 更新LEO的机制

> 注意:==follower副本的LEO保存在2个地方==
>
> （1）follower副本所在的broker缓存里。
>
> （2）leader所在broker的缓存里，也就是leader所在broker的缓存上保存了该分区所有副本的LEO。
>
> 更新LEO的时机
>
> ==follower更新LEO==
>
> （1）follower的leo更新时间: 每当follower副本写入一条消息时，leo值会被更新
>
> （2）leader端的follower副本的leo更新时间: 当follower从leader处fetch消息时，leader获取follower的fetch请求中的offset参数，更新保存在leader端follower的leo。
>
> ==leader更新LEO==
>
> （1）leader本身的leo的更新时间：leader向log写消息时

#### 更新HW的机制

> ==1、follower更新HW==
>
> follower更新HW发生在其更新完LEO后，即==follower向log写完数据，它就会尝试更新HW值==。具体算法就是比较当前LEO(已更新)与fetch响应中leader的HW值，取两者的小者作为新的HW值，即 min(leader HW, follower leo)。
>
> ==2、leader更新HW的时机==
>
> （1）producer 向 leader 写消息时
>
> （2）leader 处理 follower 的 fetch 请求时
>
> （3）某副本成为leader时
>
> （4）broker 崩溃导致副本被踢出ISR时
>
> ==3、leader更新HW的方式==
>
> 当尝试确定分区HW时，它会选出所有满足条件的副本，比较它们的LEO（当然也包括leader自己的LEO），并==选择最小的LEO值作为HW值==,leader HW=min(所有follower leo) 。
>
> 这里的满足条件主要是指副本要满足以下两个条件之一：
>
> （1）处于ISR中
>
> （2）副本LEO落后于leader LEO的时长不大于replica.lag.time.max.ms参数值（默认值是10秒），或者落后Leader的条数超过预定值replica.lag.max.messages（默认值是4000）。也就是说如果某follower在10s秒内没有向leader同步数据，就会被踢出ISR列表，或者落后leader4000条数据时也会踢出ISR列表。
>
> 
>
> ![HW和LEO的更新](kafka.assets/HW和LEO的更新.png)



## producer消息发送原理

###### producer核心流程概览

![Producer流程分析](kafka.assets/Producer流程分析.png)

* 1、构建KafkaProducer对象，构建后会初始化一个ProducerInterceptors，它是一个拦截器，对发送的数据进行拦截

  ```
  ps：说实话这个功能其实没啥用，我们即使真的要过滤，拦截一些消息，也不考虑使用它，我们直接发送数据之前自己用代码过滤即可
  ```

* 2、Serializer 对消息的key和value进行序列化

* 3、通过使用分区器作用在每一条消息上，实现数据分发进行入到topic不同的分区中

* 4、RecordAccumulator收集消息，实现批量发送

  ```
  它是一个缓冲区，可以缓存一批数据，把topic的每一个分区数据存在一个队列Deque中，然后封装消息成一个一个的batch批次，每一个batch默认是16KB，最后实现数据分批次批量发送。缓冲区大小默认是32M。
  缓冲区就是生产者的Java开发代码中的props.put("buffer.memory",xxx)
  batch批次就是生产者的Java开发代码中的props.put("batch.size",xxx)
  ```

* 5、Sender线程从RecordAccumulator获取消息

* 6、构建ClientRequest对象

* 7、将ClientRequest交给 NetWorkClient准备发送

* 8、NetWorkClient 将通过RPC方式将请求放入到KafkaChannel的缓存

* 9、发送请求到kafka集群

* 10、调用回调函数，接受到响应



## producer核心参数

#### 回顾之前的producer生产者代码

~~~java
package com.kaikeba.producer;

import org.apache.kafka.clients.producer.*;

import java.util.Properties;
import java.util.concurrent.ExecutionException;

/**
 * 需求：开发kafka生产者代码
 */
public class KafkaProducerStudyDemo {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        //准备配置属性
        Properties props = new Properties();
        //kafka集群地址
        props.put("bootstrap.servers", "node01:9092,node02:9092,node03:9092");
        //acks它代表消息确认机制   // 1 0 -1 all
        props.put("acks", "all");
        //重试的次数
        props.put("retries", 0);
        //批处理数据的大小，每次写入多少数据到topic
        props.put("batch.size", 16384);
        //可以延长多久发送数据
        props.put("linger.ms", 1);
        //缓冲区的大小
        props.put("buffer.memory", 33554432);
        props.put("key.serializer",
                  "org.apache.kafka.common.serialization.StringSerializer");
        props.put("value.serializer",
                  "org.apache.kafka.common.serialization.StringSerializer");

        //添加自定义分区函数
        props.put("partitioner.class","com.kaikeba.partitioner.MyPartitioner");

        Producer<String, String> producer = new KafkaProducer<String, String>(props);
        for (int i = 0; i < 100; i++) {

            // 这是异步发送的模式
            producer.send(new ProducerRecord<String, String>("test", Integer.toString(i), "hello-kafka-"+i), new Callback() {
                public void onCompletion(RecordMetadata metadata, Exception exception) {
                    if(exception == null) {
                        // 消息发送成功
                        System.out.println("消息发送成功");
                    } else {
                        // 消息发送失败，需要重新发送
                    }
                }

            });

            // 这是同步发送的模式
            //producer.send(record).get();
            // 你要一直等待人家后续一系列的步骤都做完，发送消息之后
            // 有了消息的回应返回给你，你这个方法才会退出来
        }
        producer.close();
    }

}
~~~

#### 参数之常见异常处理

观察上面的生产者代码，发送数据是可以同步或者异步的，但不管是异步还是同步，都可能让你处理异常，常见的异常如下：

> 1）LeaderNotAvailableException：这个就是如果某台机器挂了，此时leader副本不可用，会导致你写入失败，要等待其他follower副本切换为leader副本之后，才能继续写入，此时可以==重试发送即可==。如果说你平时重启kafka的broker进程，肯定会导致leader切换，一定会导致你写入报错：LeaderNotAvailableException
>
> 2）NotControllerException：这个也是同理，如果说Controller所在Broker挂了，那么此时会有问题，需要等待Controller重新选举，此时==也是一样就是重试即可==
>
> 3）NetworkException：网络异常，==重试即可==
> 我们之前配置了一个参数，retries，他会自动重试的，但是如果重试几次之后还是不行，就会提供Exception给我们来处理了。

下面我们来看一下重试的相关参数：

> (1)retries
>
> 重新发送数据的次数，默认为0，表示不重试，
>
> ==在重试次数内切换leader副本成功/Controller重新选举成功/网络恢复正常，就不会报告上面的异常，程序继续运行。==
>
> (2)retry.backoff.ms
>
> 两次重试之间的时间间隔，默认为100ms

#### 参数之提升消息吞吐量

吞吐量可以理解为单位时间内发送的数据量。可以通过下列这些参数来提高消息的吞吐量。

> （1）buffer.memory
>
> 设置发送消息的缓冲区，默认值是33554432，就是32MB
>
> 如果发送消息出去的速度小于写入消息进去的速度，就会导致缓冲区写满，此时生产消息就会阻塞住，所以说==这里就应该多做一些压测，尽可能保证说这块缓冲区不会被写满导致生产行为被阻塞住==
>
> （2）compression.type
>
> producer用于压缩数据的压缩类型。默认是none表示无压缩。可以指定gzip、snappy
>
> ==压缩最好用于批量处理，批量处理消息越多，压缩性能越好。==
>
> （3）batch.size
>
> producer将试图批处理消息记录，以==减少请求次数==。这将改善client与server之间的性能。
>
> 默认是16384Bytes，即16kB，也就是一个batch满了16kB就发送出去
>
> ==如果batch太小，会导致频繁网络请求，吞吐量下降；如果batch太大，会导致一条消息需要等待很久才能被发送出去，而且会让内存缓冲区有很大压力，过多数据缓冲在内存里。==
>
> （4）linger.ms
>
> 这个值默认是0，就是消息必须立即被发送
>
> 一般设置一个100毫秒之类的，这样的话就是说，这个消息被发送出去后进入一个batch，如果100毫秒内，这个batch满了16kB，自然就会发送出去。但是如果100毫秒内，batch没满，那么也必须把消息发送出去了，不能让消息的发送延迟时间太长，也避免给内存造成过大的一个压力。
>
> 

#### 参数之请求超时

> (1)max.request.size
>
> * 这个参数用来==控制发送出去的一条消息的大小==，默认是1048576字节，也就1mb
> * 这个一般太小了，很多消息可能都会超过1mb的大小，所以需要自己优化调整，把他设置更大一些（企业一般设置成10M）
>
> (2)request.timeout.ms
>
> * 这个就是说发送一个请求出去之后，他有一个超时的时间限制，默认是30秒
> * 如果==30秒都收不到响应，那么就会认为异常，会抛出一个TimeoutException来让我们进行处理==

#### ACK参数

acks参数，其实是控制发送出去的消息的持久化机制的。ack参数的有如下的值：

> (1)acks=0
>
> ==生产者只管发数据，不管消息是否写入成功到broker中，数据丢失的风险最高==
>
> producer根本不管写入broker的消息到底成功没有，发送一条消息出去，立马就可以发送下一条消息，这是吞吐量最高的方式，但是可能消息都丢失了。你也不知道的，但是说实话，你如果真是那种实时数据流分析的业务和场景，就是仅仅分析一些数据报表，丢几条数据影响不大的。会让你的发送吞吐量会提升很多，你发送弄一个batch出去，不需要等待人家leader写成功，直接就可以发送下一个batch了，吞吐量很大的，哪怕是偶尔丢一点点数据，实时报表，折线图，饼图。
>
> （2）acks=1
>
> ==只要leader写入成功，就认为消息成功了==。默认给这个其实就比较合适的，还是可能会导致数据丢失的，如果刚写入leader，leader就挂了，此时数据必然丢了，其他的follower没收到数据副本，变成leader.
>
> （2）acks=all 或者 acks=-1
>
> 这个leader写入成功以后，==必须等待其他ISR中的副本都写入成功，才可以返回响应说这条消息写入成功了==，此时你会收到一个回调通知==》“这种方式数据最安全，但是性能最差”。

如果要想保证数据不丢失，得如下设置：

> （1）min.insync.replicas = 2
>
> ISR里必须有2个副本，一个leader和一个follower，最最起码的一个，不能只有一个leader存活，连一个follower都没有。
>
> （2）acks = -1
>
> 每次写成功一定是leader和follower都成功才可以算做成功，这样leader挂了，follower上是一定有这条数据，不会丢失。
>
> （3）retries = Integer.MAX_VALUE
>
> 无限重试，如果上述两个条件不满足，写入一直失败，就会无限次重试，保证说数据必须成功的发送给两个副本，如果做不到，就不停的重试。
>
> ==除非是面向金融级的场景，面向企业大客户，或者是广告计费，跟钱的计算相关的场景下，才会通过严格配置保证数据绝对不丢失==



#### 重试乱序

> max.in.flight.requests.per.connection，表示==每个网络连接已经发送但还没有收到服务端响应的请求个数最大值。==
>
> ==消息重试是可能导致消息的乱序的，因为可能排在你后面的消息都发送出去了，你现在收到回调失败了才在重试，此时消息就会乱序==。
>
> 所以可以使用“max.in.flight.requests.per.connection”==参数设置为1，这样可以保证producer必须把一个请求发送的数据发送成功了再发送后面的请求。避免数据出现乱序==
>
> <img src="kafka.assets/image-20200422040917064.png" alt="image-20200422040917064" style="zoom: 47%;" />



## broker核心参数

server.properties配置文件核心参数

> 【broker.id】
>
> 每个broker都必须自己设置的一个唯一id
>
> 【log.dirs】
>
> 这个极为重要，kafka的所有数据就是写入这个目录下的磁盘文件中的，==如果说机器上有多块物理硬盘，那么可以把多个目录挂载到不同的物理硬盘上，然后这里可以设置多个目录，这样kafka可以数据分散到多块物理硬盘，多个硬盘的磁头可以并行写，这样可以提升吞吐量。==
>
> 【zookeeper.connect】
>
> 连接kafka底层的zookeeper集群的
>
> 【Listeners】
>
> broker监听客户端发起请求的端口号，默认是9092
>
> 【unclean.leader.election.enable】
>
> 默认是false，意思就是只能选举ISR列表里的follower成为新的leader，1.0版本后才设为false，之前都是true，允许非ISR列表的follower选举为新的leader
>
> 【delete.topic.enable】
>
> 默认true，允许删除topic
>
> 【log.retention.hours】
>
> 可以设置一下，要保留数据多少个小时(默认168小时)，这个就是底层的磁盘文件，默认保留7天的数据，根据自己的需求来就行了


## consumer消费原理

#### Offset管理

> 每个consumer内存里数据结构保存对每个topic的每个分区的消费offset，定期会提交offset，老版本是写入zk，但是那样高并发请求zk是不合理的架构设计，zk是做分布式系统的协调的，轻量级的元数据存储，不能负责高并发读写，作为数据存储。
>
> 所以后来就是提交offset发送给内部topic：==consumer_offsets，提交过去的时候，key是group.id+topic+分区号，value就是当前offset的值，每隔一段时间，kafka内部会对这个topic进行compact。也就是每个group.id+topic+分区号就保留最新的那条数据即可。==
>
> 而且因为这个 ==__consumer_offsets可能会接收高并发的请求，所以默认分区50个，这样如果你的kafka部署了一个大的集群，比如有50台机器，就可以用50台机器来抗offset提交的请求压力==，就好很多。

#### Coordinator

Coordinator的作用

> 每个consumer group都会选择一个broker作为自己的coordinator，他是负责监控这个消费组里的各个消费者的心跳，以及判断是否宕机，然后开启rebalance.
>
> 根据内部的一个选择机制，会挑选一个对应的Broker，==Kafka总会把你的各个消费组均匀分配给各个Broker作为coordinator来进行管理的.==
>
> ==consumer group中的每个consumer刚刚启动就会跟选举出来的这个consumer group对应的coordinator所在的broker进行通信，然后由coordinator分配分区给你的这个consumer来进行消费==。coordinator会尽可能均匀的分配分区给各个consumer来消费。

如何选择哪台是coordinator

> ==首先对消费组的groupId进行hash，接着对consumer_offsets的分区数量取模==，默认是50，可以通过offsets.topic.num.partitions来设置，找到你的这个consumer group的offset要提交到consumer_offsets的哪个分区。
>
> 比如说：groupId，"membership-consumer-group" -> hash值（数字）-> 对50取模 -> 就知道这个consumer group下的所有的消费者提交offset的时候是往哪个分区去提交offset。
>
> 找到consumer_offsets的一个分区，consumer_offset的分区的副本数量默认来说1，只有一个leader，然后对这个分区找到对应的leader所在的broker，这个broker就是这个consumer group的coordinator了，consumer接着就会维护一个Socket连接跟这个Broker进行通信。

#### 消费流程

![39 GroupCoordinator原理剖析](kafka.assets/GroupCoordinator原理剖析.png)



1. 对group.id进行hash运算，取模，得到offset要提交到consumer_offsets的哪个分区，找到这个分区对应的leader，该leader所在的broker就是这个消费组的的coordinator了。
2. 选出coordinator后，消费组的所有消费者向coordinator发送注册请求，最先发送请求的消费者将称为consumer（leader）。
3. consumer（leader）指定消费方案，并发送给coordinator。
4. coordinator收到方案后，下发消费方案到该消费者所有的consumer。
5. 每个consumer根据方案，找到对应的leader分区，开始消费数据。

## consumer消费者Rebalance策略

> 比如我们消费的一个topic主题有==12个分区==：p0,p1,p2,p3,p4,p5,p6,p7,p8,p9,p10,p11
>
> 假设我们的消费者组里面有==三个消费者==。

#### range范围策略

RangeAssignor（默认策略）

> range策略就是按照partiton的序号范围
> 	p0~3             consumer1
> 	p4~7             consumer2
> 	p8~11            consumer3
>
> 默认就是这个策略

#### round-robin轮训策略

RoundRobinAssignor

> consumer1:	0,3,6,9
>
> consumer2:	1,4,7,10
>
> consumer3:	2,5,8,11
>
> 但是==前面的这两个方案有个问题：==
>
> 假设consuemr1挂了，会重新指定方案，p0-5分配给consumer2,p6-11分配给consumer3
>
> 这样的话，原本在consumer2上的的p6,p7分区就被分配到了 consumer3上

#### sticky黏性策略

StickyAssignor

> 最新的一个sticky策略，就是说尽可能保证在rebalance的时候，==让原本属于这个consumer
> 的分区还是属于他们，然后把多余的分区再均匀分配过去==，这样尽可能维持原来的分区分配的策略
>
> consumer1： 0-3
>
> consumer2:  4-7
>
> consumer3:  8-11 
>
> 假设consumer3挂了
>
> consumer1：0-3，+8,9
>
> consumer2: 4-7，+10,11

#### 消费者分配策略的控制

由参数==partition.assignment.strategy==控制，默认是RangeAssignor表示范围策略

~~~java
//设置消费者分配策略：
properties.put(ConsumerConfig.PARTITION_ASSIGNMENT_STRATEGY_CONFIG, 
StickyAssignor.class.getName());
~~~



## consumer核心参数

官网查看kafka参数<http://kafka.apache.org/10/documentation.html>

> ###### 【heartbeat.interval.ms】
>
> 默认值：3000
>
> consumer心跳时间，==必须得保持心跳才能知道consumer是否故障了==，然后如果故障之后，就会通过心跳
>
> 下发rebalance的指令给其他的consumer通知他们进行rebalance的操作。
>
> leader会重新指定消费方案，然后提交给coordinator,再次下发消费方案给各个consumer
>
> ###### 【session.timeout.ms】
>
> 默认值：10000	
>
> kafka==多长时间感知不到一个consumer就认为他故障了==，默认是10秒
>
> ###### 【max.poll.interval.ms】
>
> 默认值：300000  
>
> 如果在==两次poll操作之间，超过了这个时间，那么就会认为这个consume处理能力太弱了，会被踢出消费组==，分区分配给别人去消费，一遍来说结合你自己的业务处理的性能来设置就可以了
>
> ###### 【fetch.max.bytes】
>
> 默认值：1048576=>1M
>
> 获取一==条消息最大的字节数==，一般建议设置大一些
>
> ###### 【max.poll.records】
>
> 默认值：500条
>
> 一次poll返回消息的==最大条数==，
>
> ###### 【connections.max.idle.ms】
>
> 默认值：540000  
>
> ==consumer跟broker的socket连接如果空闲超过了一定的时间，此时就会自动回收连接==，但是下次消费就要重新建立socket连接，这个==建议设置为-1，不要去回收==
>
> ###### 【auto.offset.reset】
>
> earliest：当各分区下有已提交的offset时，从提交的offset开始消费；无提交的offset时，从头开始消费		  
>
> latest：当各分区下有已提交的offset时，从提交的offset开始消费；无提交的offset时，从当前位置开始消费
>
> none：topic各分区都存在已提交的offset时，从offset后开始消费；只要有一个分区不存在已提交的offset，则抛出异常
>
> 注：我们==生产里面一般设置的是latest==
>
> ###### 【enable.auto.commit】
>
> 默认值：true
>
> 设置为自动提交offset
>
> ###### 【auto.commit.interval.ms】
>
> 默认值：60 * 1000
>
> ==每隔多久更新一下偏移量==	

## 面试题

![image-20200422140129387](kafka.assets/image-20200422140129387.png)

> 如果消费者这端要保证数据被处理且只被处理一次，屏蔽掉下面这2种情况：
> 	（1）数据的重复处理
> 	（2）数据的丢失
>
> 一般来说：==需要手动提交偏移量，需要保证数据处理成功与保存偏移量的操作在同一事务中就可以了==



## kafka优秀书籍推荐

![1568440708295](kafka.assets/1568440708295.png)



![1568440766949](kafka.assets/1568440766949.png)



## 作业--kafka性能测试

博客地址: https://www.cnblogs.com/xiaodf/p/6023531.html









