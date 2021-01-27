---
title: 搭建zookeeper集群
sidebar: true
---

:::warning

注意事项：**所有机器一定要保证时钟同步** 

:::

## node01安装zookeeper

[下载zookeeper安装包](http://archive.cloudera.com/cdh5/cdh/5/)

下载版本：`zookeeper-3.4.5-cdh5.14.2.tar.gz` 

上传到`node01`的`/kkb/soft`路径，并解压到`/kkb/install`路径：

```sh
cd /kkb/soft
tar -zxvf zookeeper-3.4.5-cdh5.14.2.tar.gz -C /kkb/install/ 
```

修改配置文件

```sh
cd /kkb/install/zookeeper-3.4.5-cdh5.14.2/conf
cp zoo_sample.cfg  zoo.cfg
```

```sh
mkdir -p /kkb/install/zookeeper-3.4.5-cdh5.14.2/zkdatas
```

```sh
vim zoo.cfg

dataDir=/kkb/install/zookeeper-3.4.5-cdh5.14.2/zkdatas
autopurge.snapRetainCount=3 #删掉注释
autopurge.purgeInterval=1  #删掉注释
server.1=node01:2888:3888
server.2=node02:2888:3888
server.3=node03:2888:3888
```

添加`myid`配置：

```sh{3}
vi /kkb/install/zookeeper-3.4.5-cdh5.14.2/zkdatas/myid

1
```



## 分发Zookeeper安装包

分发node01的安装包到node02和node03上：

```sh
scp -r /kkb/install/zookeeper-3.4.5-cdh5.14.2/ node02:/kkb/install/
scp -r /kkb/install/zookeeper-3.4.5-cdh5.14.2/ node03:/kkb/instal/
```

node02上修改myid的值为2

```
vi /kkb/install/zookeeper-3.4.5-cdh5.14.2/myid

2
```

node03上修改myid的值为3

```
vi /kkb/install/zookeeper-3.4.5-cdh5.14.2/myid

3
```

:::warning

每个节点的myid值一定要正确，否则后面会出错

:::

## 配置zookeeper环境变量

所有节点配置zookeeper环境变量：

```sh
vi /home/hadoop/.bash_profile

export ZOOKEEPER_HOME=/kkb/install/zookeeper-3.4.5-cdh5.14.2
export PATH=....:ZOOKEEPER_HOME/bin
```

```sh
source /home/hadoop/.bash_profile
```



## 所有机器启动zookeeper服务

所有机器执行：  

```sh
/kkb/install/zookeeper-3.4.5-cdh5.14.2/bin/zkServer.sh start
```

查看启动状态：

```sh
/kkb/install/zookeeper-3.4.5-cdh5.14.2/bin/zkServer.sh status
```

出现类似下列信息时表示正常开启:

:::tip

JMX enabled by default

Using config: /kkb/install/zookeeper-3.4.5-cdh5.14.2/bin/../conf/zoo.cfg

Mode: leader

:::

:warning:**搭建完并启动zookeeper集群后，执行jps会出现QuorumPeerMain**

