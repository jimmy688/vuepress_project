---
title: 启动hadoop集群
sidebar: true
---

## 单个节点逐一启动

```sh{2,4,6,8}
#1、在主节点上使用以下命令启动 HDFS NameNode： 
hadoop-daemon.sh start namenode 
#2、在每个从节点上使用以下命令启动 HDFS DataNode： 
hadoop-daemon.sh start datanode
#3、在主节点上使用以下命令启动 YARN ResourceManager： 
yarn-daemon.sh start resourcemanager 
#4、在每个从节点上使用以下命令启动 YARN nodemanager： 
yarn-daemon.sh start nodemanager 
```



## 脚本一键启动

:::tip

如果配置了 `etc/hadoop/slaves` 和 `ssh` 免密登录，则可以使用程序脚本启动所有`Hadoop` 集群的相关进程，在**主节点**上执行。

:::

一键启动集群：

```sh
cd /kkb/install/hadoop-2.6.0-cdh5.14.2/

sbin/start-dfs.sh
sbin/start-yarn.sh

sbin/mr-jobhistory-daemon.sh start historyserver
```

一键停止集群：

```sh
sbin/stop-dfs.sh
sbin/stop-yarn.sh
```



## jps查看已启动的进程

主节点执行：`jps`

主节点需要有： 

- `DataNode`
- `JobHistoryServer`
- `Jps`
- `NodeManager`
- `ResourceManager`
- `SecondaryNameNode`
- `NameNode` 

从节点需要有：

- `DataNode`
- `NodeManager`
- `Jps`



## 查看web管理页面

推荐使用谷歌访问：

- hdfs集群web地址：`主节点IP:50070`
- yarn集群web地址：`主节点IP:8088`
- jobhistory  web地址：`主节点IP:19888`