---
title: 检验hadoop环境
sidebar: true
---

## 单词统计实例

到目前为止，hadoop所有的环境都搭建完成了，现在来看个hadoop运行实例（单词统计）。在主节点node01上操作：

1、在hdfs上创建一个目录，并在本地文件系统创建一个words文件（随便写几个单词）

```sh
hdfs dfs -mkdir /test
hdfs dfs -ls /test
touch /home/hadoop/words
cd
vi words 
cat words
```

2、把words文件推送到hdfs上：

```sh
hdfs dfs -put /home/hadoop/words /test
hdfs dfs -ls -r /test
```

3、执行示例：

```sh
hadoop jar /kkb/install/hadoop-2.6.0-cdh5.14.2/share/hadoop/mapreduce/hadoop-mapreduce-examples-2.6.0-cdh5.14.2.jar wordcount /test/words /test/output
```

4、查看结果输出文件：

```sh
hdfs dfs -text /test/output/part-r-00000
hdfs dfs -ls /test/output/
```

5、从web页面下载part-r-00000

配置windows的hosts文件，用管理员身份修改`windows`的文件`C:/windows/system32/drivers/etc/hosts`

添加下列内容：  

```sh
192.168.52.101 node01
192.168.52.102 node02
192.168.52.103 node03
```

使用浏览器访问`node01:50070`，进到文件系统页面找到文件下载即可

## 创建快捷脚本

### xcall

:::tip

所有节点创建**快速在所有节点执行命令**的脚本`xcall`

:::

在node01执行：

```sh
su - hadoop
mkdir ~/bin  
vi ~/bin/xcall
```

```sh
#!/bin/bash

params=$@
i=201
for (( i=1 ; i <= 3 ; i = $i + 1 )) ; do
    echo ============= node0$i $params =============
    ssh node0$i "source /etc/profile;$params"
done
```

```sh
cd ~/bin
chmod 777 xcall
scp xcall node02:$PWD/    #node02要创建一个bin目录
scp xcall node03:$PWD/    #node03要创建一个bin目录
```

所有机器为`~/bin`目录添加环境变量：

```sh
vi /home/hadoop/.bash_profile

export MY_HOME=/home/hadoop/
PATH=$PATH:$HOME/.local/bin:$HOME/bin:$JAVA_HOME/bin:$HADOOP_HOME/bin:$HADOOP_HOME/sbin:$ZOOKEEPER_HOME/bin:$MY_HOME/bin
```

查看效果：

```sh
[hadoop@node01 bin]$ xcall jps
============= node01 jps =============
27395 DataNode
27270 NameNode
27799 NodeManager
27544 SecondaryNameNode
29195 QuorumPeerMain
28172 JobHistoryServer
27679 ResourceManager
29599 Jps
============= node02 jps =============
17698 NodeManager
19155 Jps
18908 QuorumPeerMain
17598 DataNode
============= node03 jps =============
19376 Jps
17686 DataNode
19128 QuorumPeerMain
17786 NodeManager
```

### xsync

:::tip

在主节点`node01`上创建`xsync`脚本文件，方便快速同步所有机器的文件。

xsync脚本里面用到了rsync命令，rsync命令是一个远程数据同步工具，可通过LAN/WAN快速同步多台主机间的文件。rsync使用所谓的“rsync算法”来使本地和远程两个主机之间的文件达到同步，这个算法**只传送两个文件的不同部分**，而不是每次都整份传送，因此速度相当快。

[查看rsync命令更多信息](https://man.linuxde.net/rsync)。

:::

```sh
vi ~/bin/xsync
```

```sh
#!/bin/bash
#1 获取输入参数个数，如果没有参数，直接退出
pcount=$#
if ((pcount==0)); then
echo no args;
exit;
fi

#2 获取文件名称
p1=$1
fname=`basename $p1`

echo $fname

#3 获取上级目录到绝对路径
pdir=`cd -P $(dirname $p1); pwd`
echo $pdir

#4 获取当前用户名称
user=`whoami`

#5 循环
for((host=1; host<4; host++)); do
        echo ------------------- node0$host --------------
        rsync -av $pdir/$fname $user@node0$host:$pdir
done


```

```
chmod 777 ~/bin/xsync
```

### hadoop.sh

创建**快速启动和停止hadoop**的脚本：hadoop.sh

主节点node01执行以下操作：

```sh
vi hadoop.sh
```

```sh
#!/bin/bash
case $1 in
"start" ){
  source /home/hadoop/.bash_profile;
 /kkb/install/hadoop-2.6.0-cdh5.14.2/sbin/start-dfs.sh
 /kkb/install/hadoop-2.6.0-cdh5.14.2/sbin/start-yarn.sh
 /kkb/install/hadoop-2.6.0-cdh5.14.2/sbin/mr-jobhistory-daemon.sh start historyserver

};;
"stop"){

  /kkb/install/hadoop-2.6.0-cdh5.14.2/sbin/stop-dfs.sh
 /kkb/install/hadoop-2.6.0-cdh5.14.2/sbin/stop-yarn.sh
 /kkb/install/hadoop-2.6.0-cdh5.14.2/sbin/mr-jobhistory-daemon.sh stop  historyserver
};;
esac
```

```sh
chmod 777 ~/bin/hadoop.sh
```

验证效果：

```
hadoop.sh start
hadoop.sh stop
```



### zkhadoop.sh

主节点node01创建快速启动zookeeper集群和hadoop集群的脚本：zkhadoop.sh：

```sh
vi ~/bin/zkhadoop.sh
```

```sh
#!/bin/bash
source /etc/profile
/kkb/install/zookeeper-3.4.5-cdh5.14.2/bin/zkServer.sh start

sleep 5

ssh node02 "source /etc/profile;/kkb/install/zookeeper-3.4.5-cdh5.14.2/bin/zkServer.sh start"

sleep 5

ssh node03 "source /etc/profile;/kkb/install/zookeeper-3.4.5-cdh5.14.2/bin/zkServer.sh start"

sleep 5

ssh node01 "/kkb/install/hadoop-2.6.0-cdh5.14.2/sbin/start-dfs.sh;/kkb/install/hadoop-2.6.0-cdh5.14.2/sbin/start-yarn.sh"

sleep 3

/kkb/install/hadoop-2.6.0-cdh5.14.2/sbin/mr-jobhistory-daemon.sh start historyserver
```

```sh
chmod 777 ~/bin/zkhadoop.sh
```

```sh
zkhadoop.sh
```

