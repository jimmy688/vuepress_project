## 工作流调度器azkaban概述

azkaban官网：https://azkaban.github.io/

azkaban功能特点:

- 提供功能清晰、简单易用的web UI界面
- 提供job配置文件快速建立任务和任务之间的关系
- 提供模块化的可插拔机制，原生支持command、java、hive、hadoop
- 基于java开发，代码结构清晰，易于二次开发

##  为什么需要工作流调度系统

1. 一个完整的数据分析系统通常都是由大量任务单元组成：shell脚本程序，java程序，mapreduce程序、hive脚本等
2. 各任务单元之间存在时间先后及前后依赖关系
3. 为了很好地组织起这样的复杂执行计划，需要一个工作流调度系统来调度执行；

例如，我们可能有这样一个需求，某个业务系统每天产生20G原始数据，我们每天都要对其进行处理，处理步骤如下所示：

1. 通过Hadoop先将原始数据同步到HDFS上；
2. 借助MapReduce计算框架对原始数据进行转换，生成的数据以分区表的形式存储到多张Hive表中；
3. 需要对Hive中多个表的数据进行JOIN处理，得到一个明细数据Hive大表；
4. 将明细数据进行各种统计分析，得到结果报表信息；
5. 需要将统计分析得到的结果数据同步到业务系统中，供业务调用使用。

 <img src="azkaban.assets/image-20200320173552201-1608482417504.png" alt="image-20200320173552201" style="zoom:67%;" />

## 如何实现工作流调度

简单的任务调度：直接使用linux的crontab来定义；

复杂的任务调度：开发调度平台或使用现成的开源调度系统，比如ooize、azkaban、airflow等

## Azkaban介绍

Azkaban是由Linkedin开源的一个批量工作流任务调度器。用于在一个工作流内以一个特定的顺序运行一组工作和流程。

Azkaban定义了一种KV文件(properties)格式来建立任务之间的依赖关系，并提供一个易于使用的web用户界面维护和跟踪你的工作流。

它有如下功能特点：

Ø Web用户界面

Ø 方便上传工作流

Ø 方便设置任务之间的关系

Ø 调度工作流

Ø 认证/授权(权限的工作)

Ø 能够杀死并重新启动工作流

Ø 模块化和可插拔的插件机制

Ø 项目工作区

Ø 工作流和任务的日志记录和审计 

## azkaban的基本架构

![img](azkaban.assets/clip_image004.jpg)

Azkaban由三部分构成

1. Azkaban Web Server：提供了Web UI，是azkaban的主要管理者，包括 project 的管理，认证，调度，对工作流执行过程的监控等。（提供客户端一个交互界面）
2. Azkaban Executor Server：负责具体的工作流和任务的调度提交(执行任务)
3. Mysql/oracle：用于保存项目、日志或者执行计划之类的信息（存储任务）

 

## Azkaban架构的三种运行模式

#### solo server mode(单机模式）

h2 web server 和 executor server运行在同一个进程里,是最简单的模式，可用于测试、调式。

数据库使用内置的H2数据库，管理服务器和执行服务器都在一个进程中运行，任务量不大项目可以采用此模式。

#### two server mode

web server 和 executor server运行在不同的进程。数据库为mysql，管理服务器和执行服务器在不同进程，这种模式下，管理服务器和执行服务器互不影响。

#### multiple executor mode

web server 和 executor server运行在不同的进程，executor server有多个。该模式下，执行服务器和管理服务器在不同主机上，且执行服务器可以有多个。
 ​ 

## 编译azkaban源码

我们接下来要安装的是azkaban的版本是3.x。

azkaban 3.x版本的新特性：exec server可以有多个，做主从备份，从而避免exec server宕机之后就没法执行任务。

azkaban 3.x版本只是提供了源码，没有提供安装包，而且azkaban不是cdh公司的。cdh公司的调度工具是ozzie.

我们需要对azkaban3.51.0这个版本自己进行重新编译，编译完成之后就可获得azkaban的安装包。

注意：我们这里编译需要使用jdk1.8的版本来进行编译，如果编译服务器使用的jdk版本是1.7的，记得切换成jdk1.8，我们这里使用的是jdk8u141这个版本来进行编译

```sh
cd /kkb/soft/
#下载azkaban源码包
wget https://github.com/azkaban/azkaban/archive/3.51.0.tar.gz
#解压源码包
tar -zxvf 3.51.0.tar.gz -C ../install/

cd /kkb/install/azkaban-3.51.0/
#安装编译工具：
yum -y install git
yum -y install gcc-c++
#开始进行编译：
./gradlew build installDist -x test 
```

编译之后，安装包被存放在了以下路径：

```sh
#azkaban-exec-server存放目录
/kkb/install/azkaban-3.51.0/azkaban-exec-server/build/distributions

#azkaban-web-server存放目录
/kkb/install/azkaban-3.51.0/azkaban-web-server/build/distributions

#azkaban-solo-server存放目录
/kkb/install/azkaban-3.51.0/azkaban-solo-server/build/distributions

#azkaban two server模式下需要的C程序在这个路径下面
/kkb/install/azkaban-3.51.0/az-exec-util/src/main/c

#数据库脚本文件在这个路径下面
/kkb/install/azkaban-3.51.0/azkaban-db/build/install/azkaban-db
```

因为编译费时，这里就不自己编译了，从老师的资料获得的安装文件列表如下：

![image-20200320183323252](azkaban.assets/image-20200320183323252-1608482420615.png)

 

## 安装azkaban

##### 第一步：上传安装材料

我们这里安装的模式是tow server mode模式，即一个web server加一个executor server。我们以node03为例，进行azkaban的安装。

安装所需的软件如下：

1. Azkaban Web服务安装包：azkaban-web-server-0.1.0-SNAPSHOT.tar.gz
2. Azkaban执行服务安装包：azkaban-exec-server-0.1.0-SNAPSHOT.tar.gz
3. 编译之后的sql脚本：create-all-sql-0.1.0-SNAPSHOT.sql
4. C程序文件脚本：execute-as-user.c程序

```sh
[hadoop@node03 ~]$  cd /kkb/soft/
[hadoop@node03 soft]$ rz
```

<img src="azkaban.assets/image-20200321141733962-1608482423463.png" alt="image-20200321141733962" style="zoom: 80%;" />

##### 第二步：数据库准备

进入mysql的客户端执行以下命令

```
mysql -uroot -p
```

执行以下命令：

```sql
CREATE DATABASE azkaban;

#修改mysql密码等级及长度
set global validate_password_policy=low;
set global validate_password_length=6;

CREATE USER 'azkaban'@'%' IDENTIFIED BY 'azkaban';  
mysql> select host,user from mysql.user;
+-----------+---------------+
| host      | user          |
+-----------+---------------+
| %         | azkaban       |
| %         | root          |
| localhost | mysql.session |
| localhost | mysql.sys     |
| localhost | root          |
+-----------+---------------+

#将对database azkaban操作的所有权限赋给azkaban用户
GRANT all privileges ON azkaban.* to 'azkaban'@'%' identified by 'azkaban' WITH GRANT OPTION; 

flush privileges;

use azkaban; 
#执行sql脚本，导入数据到database azkaban
source /kkb/soft/create-all-sql-0.1.0-SNAPSHOT.sql;

mysql> show tables;
+--------------------------+
| Tables_in_azkaban        |
+--------------------------+
| QRTZ_BLOB_TRIGGERS       |
| QRTZ_CALENDARS           |
| QRTZ_CRON_TRIGGERS       |
| QRTZ_FIRED_TRIGGERS      |
| QRTZ_JOB_DETAILS         |
| QRTZ_LOCKS               |
| QRTZ_PAUSED_TRIGGER_GRPS |
| QRTZ_SCHEDULER_STATE     |
| QRTZ_SIMPLE_TRIGGERS     |
| QRTZ_SIMPROP_TRIGGERS    |
| QRTZ_TRIGGERS            |
| active_executing_flows   |
| active_sla               |
| execution_dependencies   |
| execution_flows          |
| execution_jobs           |
| execution_logs           |
| executor_events          |
| executors                |
| project_events           |
| project_files            |
| project_flow_files       |
| project_flows            |
| project_permissions      |
| project_properties       |
| project_versions         |
| projects                 |
| properties               |
| triggers                 |
+--------------------------+
```

##### 第三步：解压软件安装包

解压azkaban-web-server,改名：

```sh
cd /kkb/soft
[hadoop@node03 soft]$ tar -zxvf azkaban-web-server-0.1.0-SNAPSHOT.tar.gz -C /kkb/install/
[hadoop@node03 soft]$ mv /kkb/install/azkaban-web-server-0.1.0-SNAPSHOT/ /kkb/install/azkaban-web-server-3.51.0
```

解压azkaban-exec-server,改名：

```sh
cd /kkb/soft
[hadoop@node03 soft]$ tar -zxvf azkaban-exec-server-0.1.0-SNAPSHOT.tar.gz -C /kkb/install/
[hadoop@node03 soft]$ mv /kkb/install/azkaban-exec-server-0.1.0-SNAPSHOT/ /kkb/install/azkaban-exec-server-3.51.0
```

##### 第四步：安装SSL安全认证

安装ssl安全认证，是为了允许我们使用https的方式访问我们的azkaban的web服务，密码一定要一个个的字母输入，或者粘贴也行。

```sh
cd /kkb/install/azkaban-web-server-3.51.0
[hadoop@node03 azkaban-web-server-3.51.0]$ keytool -keystore keystore -alias jetty -genkey -keyalg RSA
```

![image-20200325232719202](azkaban.assets/image-20200325232719202.png)

```sh
[hadoop@node03 azkaban-web-server-3.51.0]$ ll
total 8
drwxr-xr-x 3 hadoop hadoop   65 Sep  6  2018 bin
drwxr-xr-x 2 hadoop hadoop  106 Sep  6  2018 conf
-rw-rw-r-- 1 hadoop hadoop 2243 Mar 26 06:40 keystore #如果keytool那个步骤错了之后删掉keystore这个文件重新来就可以了
drwxr-xr-x 2 hadoop hadoop 4096 Sep  6  2018 lib
drwxr-xr-x 6 hadoop hadoop   73 Sep  6  2018 web
```



##### 第五步：安装web server

修改azkaban-web-server的配置文件

```sh
cd /kkb/install/azkaban-web-server-3.51.0/conf

vim azkaban.properties
```

下面是正确的配置参数：

```sh
## Azkaban Personalization Settings
azkaban.name=Azkaban #可改可不改，自己定义即可
azkaban.label=My Azkaban  #可改可不改，自己定义即可
azkaban.color=#FF3601
azkaban.default.servlet.path=/index
web.resource.dir=web/
default.timezone.id=Asia/Shanghai #时区，一定要改

## Azkaban UserManager class
user.manager.class=azkaban.user.XmlUserManager
user.manager.xml.file=conf/azkaban-users.xml

## Loader for projects
executor.global.properties=conf/global.properties
azkaban.project.dir=projects

## Velocity dev mode
velocity.dev.mode=false

## Azkaban Jetty server properties.
jetty.use.ssl=true  ## 这个要改成true，如果第七步的安装插件不成功的话要改为false.
jetty.maxThreads=25
jetty.port=8081

#下面的内容是要自己添加的:
jetty.ssl.port=8443
jetty.keystore=/kkb/install/azkaban-web-server-3.51.0/keystore#使用刚刚生成的keystore路径
jetty.password=azkaban
jetty.keypassword=azkaban
jetty.truststore=/kkb/install/azkaban-web-server-3.51.0/keystore
jetty.trustpassword=azkaban

 

 

## Azkaban Executor settings

## mail settings

mail.sender=

mail.host=
## User facing web server configurations used to construct the user facing server URLs. They are useful when there is a reverse proxy between Azkaban web install and users.

## enduser -> myazkabanhost:443 -> proxy -> localhost:8081
## when this parameters set then these parameters are used to generate email links.
## if these parameters are not set then jetty.hostname, and jetty.port(if ssl configured jetty.ssl.port) are used.
## azkaban.webserver.external_hostname=myazkabanhost.com
## azkaban.webserver.external_ssl_port=443
## azkaban.webserver.external_port=8081

job.failure.email=
job.success.email=
lockdown.create.projects=false
cache.directory=cache

## JMX stats
jetty.connector.stats=true
executor.connector.stats=true

## Azkaban mysql settings by default. Users should configure their own username and password.
database.type=mysql
mysql.port=3306
mysql.host=node03  #这个要改
mysql.database=azkaban
mysql.user=azkaban
mysql.password=azkaban
mysql.numconnections=100

#Multiple Executor
azkaban.use.multiple.executors=true

#下面这个要被注释掉：
#azkaban.executorselector.filters=StaticRemainingFlowSize,MinimumFreeMemory,CpuStatus
azkaban.executorselector.comparator.NumberOfAssignedFlowComparator=1
azkaban.executorselector.comparator.Memory=1
azkaban.executorselector.comparator.LastDispatched=1
azkaban.executorselector.comparator.CpuUsage=1

 
#下面这些参数要自己添加:
azkaban.activeexecutor.refresh.milisecinterval=10000
azkaban.queueprocessing.enabled=true
azkaban.activeexecutor.refresh.flowinterval=10
azkaban.executorinfo.refresh.maxThreads=10
```

 

##### 第六步：安装executor server

修改azkaban-exec-server的配置文件

```
cd /kkb/install/azkaban-exec-server-3.51.0/conf

vim azkaban.properties
```

 下面是正确的参数配置：

```sh
## Azkaban Personalization Settings
azkaban.name=Azkaban #可改可不改
azkaban.label=My Azkaban #可改可不改
azkaban.color=#FF3601
azkaban.default.servlet.path=/index
web.resource.dir=web/
default.timezone.id=Asia/Shanghai #这个一定要改

## Azkaban UserManager class
user.manager.class=azkaban.user.XmlUserManager
user.manager.xml.file=conf/azkaban-users.xml

## Loader for projects
executor.global.properties=conf/global.properties
azkaban.project.dir=projects

## Velocity dev mode
velocity.dev.mode=false

## Azkaban Jetty server properties.
jetty.use.ssl=true  #这个要改,如果第七步的安装插件不成功的话要改为false。
jetty.maxThreads=25
jetty.port=8081

#要添加下面这些参数:
jetty.keystore=/kkb/install/azkaban-web-server-3.51.0/keystore
jetty.password=azkaban
jetty.keypassword=azkaban
jetty.truststore=/kkb/install/azkaban-web-server-3.51.0/keystore
jetty.trustpassword=azkaban

## Where the Azkaban web server is located
azkaban.webserver.url=https://node03:8443  #这个要改,如果第七步的安装插件不成功的话要改为http://node03:8081。

## mail settings
mail.sender=
mail.host=

## User facing web server configurations used to construct the user facing server URLs. They are useful when there is a reverse proxy between Azkaban web install and users.

## enduser -> myazkabanhost:443 -> proxy -> localhost:8081
## when this parameters set then these parameters are used to generate email links.
## if these parameters are not set then jetty.hostname, and jetty.port(if ssl configured jetty.ssl.port) are used.

## azkaban.webserver.external_hostname=myazkabanhost.com
## azkaban.webserver.external_ssl_port=443
## azkaban.webserver.external_port=8081
job.failure.email=
job.success.email=
lockdown.create.projects=false
cache.directory=cache

## JMX stats
jetty.connector.stats=true
executor.connector.stats=true

## Azkaban plugin settings
azkaban.jobtype.plugin.dir=plugins/jobtypes

## Azkaban mysql settings by default. Users should configure their own username and password.
database.type=mysql
mysql.port=3306
mysql.host=node03  #这个要改
mysql.database=azkaban
mysql.user=azkaban
mysql.password=azkaban
mysql.numconnections=100

## Azkaban Executor settings
executor.maxThreads=50
executor.flow.threads=30
```

##### 第七步：添加插件

将C文件execute-as-user.c复制到这个目录来/kkb/install/azkaban-exec-server-3.51.0/plugins/jobtypes

```sh
[hadoop@node03 ~]$ cp /kkb/soft/execute-as-user.c /kkb/install/azkaban-exec-server-3.51.0/plugins/jobtypes/
```

然后执行以下命令生成execute-as-user

```sh
[hadoop@node03 jobtypes]$ sudo yum -y install gcc-c++

cd /kkb/install/azkaban-exec-server-3.51.0/plugins/jobtypes

[hadoop@node03 jobtypes]$ gcc execute-as-user.c -o execute-as-user

[hadoop@node03 jobtypes]$ sudo chown root execute-as-user

[hadoop@node03 jobtypes]$ sudo chmod 6050 execute-as-user  
```

##### 第八步：修改配置文件

修改配置文件

```sh
cd /kkb/install/azkaban-exec-server-3.51.0/plugins/jobtypes/
vim commonprivate.properties
```

```sh
execute.as.user=false
memCheck.enabled=false
azkaban.native.lib=/kkb/install/azkaban-exec-server-3.51.0/plugins/jobtypes
```

最终生成的文件如下

```sh
[hadoop@node03 jobtypes]$ ll
total 24
-rw-rw-r-- 1 hadoop hadoop   143 Mar 26 00:29 commonprivate.properties
---Sr-s--- 1 root   hadoop 13616 Mar 26 00:19 execute-as-user
-rw-r--r-- 1 hadoop hadoop  3976 Mar 26 00:14 execute-as-user.c
```



## 启动azkaban服务

#### 第一步：启动azkaban exec server

```sh
cd /kkb/install/azkaban-exec-server-3.51.0

[hadoop@node03 azkaban-exec-server-3.51.0]$ bin/start-exec.sh 
```

#### 第二步：激活我们的exec-server

node03机器任意目录下执行以下命令

```sh
[hadoop@node03 ~]$ curl -G "node03:$(<./executor.port)/executor?action=activate" && echo {"status":"success"}
```

#### 第三步：启动azkaban-web-server

```sh
cd /kkb/install/azkaban-web-server-3.51.0/

[hadoop@node03 azkaban-web-server-3.51.0]$ bin/start-web.sh 
```

#### 第四步：检查服务启动情况

```sh
[hadoop@node03 azkaban-web-server-3.51.0]$ jps  #出现下面两个进程就代表启动了azkaban服务
8944 AzkabanExecutorServer 
8995 AzkabanWebServer
9112 Jps
```

#### 第五步：web访问：

https://node03:8443

用户名和密码都是azkaban

注意：第一次使用web访问的时候，可能出现浏览器不信任的情况，要手动选择继续前往node03

![image-20200326003927660](azkaban.assets/image-20200326003927660.png)

## 拓展：修改linux的时区问题

使用azkaban服务前要同步好每个linux机器的时间。由于我们先前做好了时钟同步，所以不用担心时区问题，不需要修改时区了。如果没有的话，可以按照下列方法修改：

注：先配置好服务器节点上的时区

1、先生成时区配置文件Asia/Shanghai，用交互式命令 tzselect 即可

2、拷贝该时区文件，覆盖系统本地时区配置

```
cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime 
```

 

## Azkaban的内置支持任务类型

Azkaba内置的任务类型支持command、java

## Command类型单一job示例 

#### 创建job描述文件

创建文本文件myCommand.txt，添加下列代码块中内容，然后保存。更改名称为myCommand.job,注意后缀.txt一定不要带上，保存为格式为UFT-8 without bom（Edit with notepad++）。

内容如下:

```sh
type=command
command=echo 'hello world' 
```

#### 将job资源文件打包成zip文件

选择压缩文件格式为.zip，对myCommand.job文件进行压缩。

![image-20200326095309153](azkaban.assets/image-20200326095309153.png)

 

#### 创建project并上传压缩包

首先create project，注意：Description最好不要使用中文。

![img](azkaban.assets/clip_image024.jpg)

upload上传zip包

![img](azkaban.assets/clip_image026.jpg)



#### 启动执行job

点击execute Flow-->execute执行job。

![image-20200326095525699](azkaban.assets/image-20200326095525699.png)

执行后，出现下列提示：

![image-20200326095631147](azkaban.assets/image-20200326095631147.png)

查看运行状态和运行日志等：

![image-20200326095828437](azkaban.assets/image-20200326095828437.png)





## Command类型多job工作流flow

###### 创建有依赖关系的多个job描述

第一个job：foo.job

```sh
type=command
command=echo 'foo'    
```

第二个job：bar.job依赖foo.job

```sh
 type=command
 command=echo 'bar' 
```

第三个job:stop.job，依赖于foo.job，以及bar.job

```sh
#stop.job
type=command
denpendencies=foo,bar
command=echo "stop job"
```

将所有的.job资源文件打到一个zip包中

![image-20200326100738556](azkaban.assets/image-20200326100738556.png)

###### web端：create project-->upload上传foobarStop.zip

###### 启动工作流flow

![image-20200326101055306](azkaban.assets/image-20200326101055306.png)

###### 查看运行状态：

下列的运行状态显示运行失败，而且是bar.job运行成功，foo.job运行失败(原因是内容写错了）,stopJob.job运行被取消（Cancelled)

因为stopJob.job依赖于foo.job，所以foo.job运行失败会导致stopJob.jos被取消运行。

![image-20200326101319804](azkaban.assets/image-20200326101319804.png)



## azkaban任务--HDFS操作

创建job描述文件fs.job

```sh
#fs.job

type=command
command=echo "start execute"
command.1=/kkb/install/hadoop-2.6.0-cdh5.14.2/bin/hdfs dfs -mkdir /azkaban
command.2=/kkb/install/hadoop-2.6.0-cdh5.14.2/bin/hdfs dfs -put /home/hadoop/source.txt  /azkaban
```

将job资源文件打包成zip文件

![img](azkaban.assets/clip_image031.png)

通过azkaban的web管理平台创建project并上传job压缩包

启动执行该job

## azkaban任务--MAPREDUCE

Mr任务依然可以使用command的job类型来执行

创建job描述文件，及mr程序jar包（示例中直接使用hadoop自带的example jar）

```sh
type=command
command=/kkb/install/hadoop-2.6.0-cdh5.14.2/bin/hadoop jar hadoop-mapreduce-examples-2.6.0-cdh5.14.0.jar pi 3 5
```

将所有job资源文件打到一个zip包中

![img](azkaban.assets/clip_image033.jpg)

 

在azkaban的web管理界面创建工程并上传zip包

启动job

## azkaban任务--HIVE脚本

创建job描述文件和hive脚本

Hive脚本： hive.sql

```sh
create database if not exists azhive;
use azhive;
create table if not exists aztest(id string,name string) row format delimited fields terminated by '\t';
```

Job描述文件：hive.job

```sh
type=command
command=/kkb/install/hive-1.1.0-cdh5.14.0/bin/hive -f 'hive.sql'
```

将所有job资源文件打到一个zip包中

![img](azkaban.assets/clip_image035.jpg)

在azkaban的web管理界面创建工程并上传zip包

启动job

## azkaban的定时任务

使用azkaban的scheduler功能可以实现对我们的作业任务进行定时调度功能,步骤：execute Flow-->Schedule-->Schedule

![img](azkaban.assets/clip_image037.jpg)

 

<img src="azkaban.assets/image-20200326102843921-1608482426423.png" alt="image-20200326102843921" style="zoom:67%;" />

 

```ruby
*/1 * ? * * 每分钟执行一次定时调度任务

0 1 ? * * 每天晚上凌晨一点钟执行这个任务

0 */2 ? * * 每隔两个小时定时执行这个任务

30 21 ? * * 每天晚上九点半定时执行这个任务
```

 

## azkaban的webUI参数传递

azkaban可以通过webUI动态给job传递参数

###### 1、创建一个job的描述文件: parameter.job

```sh
#parameter.job
type=command
parameter=${param}
command= echo ${parameter}
```

${param} 表示解析页面传递的参数param的值，通过声明一个变量parameter去接收

${parameter}表示获取该parameter变量的值



###### 2、将job资源文件打包成zip文件

parameter.zip

![image-20200326103508212](azkaban.assets/image-20200326103508212.png)

###### 3、创建工程，上传zip包，最后启动工作流，并且设置参数：

![image-20200326103316660](azkaban.assets/image-20200326103316660.png)

![image-20200326103812367](azkaban.assets/image-20200326103812367.png)

###### 4、查看运行完成后的结果

![img](azkaban.assets/clip_image043-1608482413438.png)

## azkaban补充

![image-20200330132446385](azkaban.assets/image-20200330132446385.png)

![image-20200330132625465](azkaban.assets/image-20200330132625465.png)