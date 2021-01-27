## oozie的介绍

Oozie是运行在hadoop平台上的一种工作流调度引擎，它可以用来调度与管理hadoop任务，如，MapReduce、Pig等。那么，对于OozieWorkflow中的一个个的action（可以理解成一个个MapReduce任务）Oozie是根据什么来对action的执行时间与执行顺序进行管理调度的呢？

答案就是我们在数据结构中常见的有向无环图(DAGDirect Acyclic Graph)的模式来进行管理调度的，我们可以利用HPDL语言（一种xml语言）来定义整个workflow，实现工作流的调度oozie的架构以及执行流程。

## oozie的架构

![image-20200406153246246](oozie.assets/image-20200406153246246.png)

## oozie的执行流程

![image-20200406153340005](oozie.assets/image-20200406153340005.png)

## oozie的组件介绍

1. workFlow：工作流，定义工作流的任务的执行，主要由一个个的action组成，在xml中进行配置即可
2. Coordinator ：协作器，说白了就是oozie当中的定时任务调度的模块
3. Bundle ：很少用，是多个Coordinator的抽象，可以通过bundle将多个Coordinator进行组装集合起来，形成一个bundle。

## oozie的安装

#### 下载安装包

oozie安装包的下载网址：

http://archive.cloudera.com/cdh5/cdh/5/oozie-4.1.0-cdh5.14.2.tar.gz

这里我们选择node03服务器作为安装服务器，下载安装包然后上传到node03服务器的/kkb/soft路径下去等待备用

#### 第一步：修改core-site.xml

修改core-site.xml，添加我们hadoop集群的代理用户,之前安装hue的时候已经修改过了。

```
cd /kkb/install/hadoop-2.6.2-cdh5.14.2/etc/hadoop

vim core-site.xml
```

添加以下内容：

```xml
<property>
	<name>hadoop.proxyuser.hadoop.hosts</name>
    <value>*</value>
</property>
<property>
    <name>hadoop.proxyuser.hadoop.groups</name>
    <value>*</value>
</property>
```

注意：hadoop的历史任务的服务必须启动，即19888端口可以查看

重启hdfs与yarn集群以及启动jobhistory

```sh
cd /kkb/install/hadoop-2.6.2-cdh5.14.2
sbin/stop-dfs.sh
sbin/start-dfs.sh
sbin/stop-yarn.sh
sbin/start-yarn.sh
sbin/mr-jobhistory-daemon.sh start historyserver
```

#### 第二步：上传oozie的安装包并解压

将我们的oozie的安装包上传到/kkb/soft

```sh
cd /kkb/soft/
tar -zxvf oozie-4.1.0-cdh5.14.2.tar.gz -C /kkb/install
```

#### 第三步：解压hadooplibs到与oozie平行的目录

将oozie-hadooplibs-4.1.0-cdh5.14.2.tar.gz这个压缩包，解压到oozie的家目录的平行目录下

```sh
tar -zxvf /kkb/install/oozie-4.1.0-cdh5.14.2/oozie-hadooplibs-4.1.0-cdh5.14.2.tar.gz -C /kkb/install/
```

#### 第四步：创建libext目录

在oozie的安装路径下创建libext目录

```sh
cd /kkb/install/oozie-4.1.0-cdh5.14.2
mkdir -p libext
```

#### 第五步：拷贝依赖包到libext

拷贝一些依赖包到libext目录下面去

拷贝所有的依赖包

```sh
cd /kkb/install/oozie-4.1.0-cdh5.14.2

cp -ra hadooplibs/hadooplib-2.6.0-cdh5.14.2.oozie-4.1.0-cdh5.14.2/* libext/
```

拷贝mysql的驱动包

```sh
cp /kkb/install/hive-1.1.0-cdh5.14.2/lib/mysql-connector-java-5.1.38.jar /kkb/install/oozie-4.1.0-cdh5.14.2/libext/
```

#### 第六步：添加ext-2.2.zip压缩包

拷贝ext-2.2.zip这个包到libext目录当中去

将我们准备好的软件ext-2.2.zip拷贝到我们的libext目录当中去

```sh
mv /kkb/soft/ext-2.2.zip /kkb/install/oozie-4.1.0-cdh5.14.2/libext/
```

#### 第七步：修改oozie-site.xml

```
cd /kkb/install/oozie-4.1.0-cdh5.14.2/conf

vim oozie-site.xml
```

如果没有这些属性，直接添加进去即可，oozie默认使用的是UTC的时区，我们需要在我们oozie-site.xml当中记得要配置我们的时区为GMT+0800时区

```xml
<property>
    <name>oozie.service.JPAService.jdbc.driver</name>
    <value>com.mysql.jdbc.Driver</value>
</property>
<property>
    <name>oozie.service.JPAService.jdbc.url</name>
    <value>jdbc:mysql://node03:3306/oozie</value>
</property>
<property>
    <name>oozie.service.JPAService.jdbc.username</name>
    <value>root</value>
</property>
<property>
    <name>oozie.service.JPAService.jdbc.password</name>
    <value>123456</value>
</property>
<property>
    <name>oozie.processing.timezone</name>
    <value>GMT+0800</value>
</property>
<property>
    <name>oozie.service.ProxyUserService.proxyuser.hue.hosts</name>
    <value>*</value>
</property>
<property>
    <name>oozie.service.ProxyUserService.proxyuser.hue.groups</name>
    <value>*</value>
</property>
<property>
    <name>oozie.service.coord.check.maximum.frequency</name>
    <value>false</value>
</property>
<property>
    <name>oozie.service.HadoopAccessorService.hadoop.configurations</name>
    <value>*=/kkb/install/hadoop-2.6.0-cdh5.14.2/etc/hadoop</value>
</property>
```

 

#### 第八步：创建mysql数据库

```sql
mysql -uroot -p

create database oozie;
```

#### 第九步：上传oozie依赖的jar包到hdfs上面去

上传oozie解压后的目录的yarn.tar.gz到hdfs目录去

```sh
cd /kkb/install/oozie-4.1.0-cdh5.14.2/

[hadoop@node03 oozie-4.1.0-cdh5.14.2]$ bin/oozie-setup.sh sharelib create -fs hdfs://node01:8020 -locallib oozie-sharelib-4.1.0-cdh5.14.2-yarn.tar.gz
```

实际上就是将这些jar包解压到了hdfs的/user/hadoop/share/lib/lib_20200406174131路径下：

![image-20200406174753029](oozie.assets/image-20200406174753029.png)

#### 第十步：创建oozie的数据库表

```sh
cd /kkb/install/oozie-4.1.0-cdh5.14.2

bin/oozie-setup.sh db create -run -sqlfile oozie.sql
```

#### 第十一步：打包项目，生成war包

```sh
sudo yum -y install zip
sudo yum -y install unzip

cd /kkb/install/oozie-4.1.0-cdh5.14.2
bin/oozie-setup.sh prepare-war
```

#### 第十二步：配置oozie的环境变量

```sh
sudo vim /etc/profile

export OOZIE_HOME=/kkb/install/oozie-4.1.0-cdh5.14.2
export OOZIE_URL=http://node03:11000/oozie
export PATH=:$OOZIE_HOME/bin

source /etc/profile
```

## 启动与关闭oozie服务

启动命令

```sh
cd /kkb/install/oozie-4.1.0-cdh5.14.2
bin/oozied.sh start 

[hadoop@node03 oozie-4.1.0-cdh5.14.2]$ jps
27682 NodeManager
40547 HRegionServer
27574 DataNode
46824 Jps
40443 QuorumPeerMain
46287 Bootstrap  #出现Bootstrap表示启动了oozie
```

关闭命令

```sh
bin/oozied.sh stop
```

## 浏览器页面访问oozie

http://node03:11000/oozie/

解决oozie的页面的时区问题：

![image-20200406201642219](oozie.assets/image-20200406201642219.png)

我们页面访问的时候，发现我们的oozie使用的还是GMT的时区，与我们现在的时区相差一定的时间，所以我们需要调整一个js的获取时区的方法，将其改成我们现在的时区

修改js当中的时区问题

```sh
cd /kkb/install/oozie-4.1.0-cdh5.14.2/oozie-server/webapps/oozie
vim oozie-console.js

#搜索getTimeZone,将"GMT"改成"GMT+0800"
function getTimeZone() {
  Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
  return Ext.state.Manager.get("TimezoneId","GMT+0800");

}
```

 

## 使用oozie调度shell脚本

oozie安装好了之后，我们需要测试oozie的功能是否完整好使，官方已经给我们带了各种测试案例，我们可以通过官方提供的各种案例来对我们的oozie进行调度。

#### 第一步：解压官方提供的调度案例

oozie自带了各种案例，我们可以使用oozie自带的各种案例来作为模板，所以我们这里先把官方提供的各种案例给解压出来

```sh
cd /kkb/install/oozie-4.1.0-cdh5.14.2
tar -zxf oozie-examples.tar.gz

#解压后，会出现一个目录：/kkb/install/oozie-4.1.0-cdh5.14.2/examples
```

#### 第二步：创建我们的工作目录

在任意地方创建一个oozie的工作目录，以后我们的调度任务的配置文件全部放到oozie的工作目录当中去

我这里直接在oozie的安装目录下面创建工作目录

```sh
cd /kkb/install/oozie-4.1.0-cdh5.14.2
mkdir oozie_works
```

#### 第三步：拷贝我们的任务模板到我们的工作目录当中去

任务模板以及工作目录都准备好了之后，把我们的shell的任务模板拷贝到我们oozie的工作目录当中去

```sh
cd /kkb/install/oozie-4.1.0-cdh5.14.2
cp -r examples/apps/shell/ oozie_works/
```

#### 第四步：随意准备一个shell脚本

```
cd /kkb/install/oozie-4.1.0-cdh5.14.2
vim oozie_works/shell/hello.sh
```

注意：这个脚本一定要是在我们oozie工作路径下的shell路径下的位置

```sh
#!/bin/bash
echo "hello world" >> /kkb/install/hello_oozie.txt
```

#### 第五步：修改模板下的配置文件

修改job.properties

```sh
cd /kkb/install/oozie-4.1.0-cdh5.14.2/oozie_works/shell
vim job.properties
```

```sh
nameNode=hdfs://node01:8020
jobTracker=node01:8032
queueName=default
examplesRoot=oozie_works
oozie.wf.application.path=${nameNode}/user/${user.name}/${examplesRoot}/shell
EXEC=hello.sh 

#jobTracker是hadoop1.x的主节点，现在已经不用了
#queueName表示任务提交的队列
#examplesRoot表示oozie任务的配置文件的根路径
#oozie.wf.application.path表示要将oozie任务上传到hdfs的哪个目录
#EXEC=hello.sh表示要执行的脚本
```

修改workflow.xml

```
vim workflow.xml
```

要注意的地方如下：

```
1. <exec>${EXEC}</exec>  #这里要改
2. <!-- <argument>my_output=Hello Oozie</argument> --> #这里要注释掉，因为将要执行的脚本不需要参数
3. <file>/user/hadoop/oozie_works/shell/\${EXEC}#${EXEC}</file>这个要自己添加，是脚本要上传到hdfs中的路径
4. <ok to="end"/>  #这里可改可不改，to="end",表示如果执行成功，直接跳到<end>步骤
```

```xml
<workflow-app xmlns="uri:oozie:workflow:0.4" name="shell-wf">
<start to="shell-node"/>
<action name="shell-node">
    <shell xmlns="uri:oozie:shell-action:0.2">
        <job-tracker>${jobTracker}</job-tracker>
        <name-node>${nameNode}</name-node>
        <configuration>
            <property>
                <name>mapred.job.queue.name</name>
                <value>${queueName}</value>
            </property>
        </configuration>
        <exec>${EXEC}</exec>  #这里要改
        <!-- <argument>my_output=Hello Oozie</argument> --> #这里要注释掉，因为脚本没参数
        <file>/user/hadoop/oozie_works/shell/${EXEC}#${EXEC}</file>

        <capture-output/>
    </shell>
    <ok to="end"/>  #这里可改可不改
    <error to="fail"/>  
</action>
<decision name="check-output">
    <switch>
        <case to="end">
            ${wf:actionData('shell-node')['my_output'] eq 'Hello Oozie'}
        </case>
        <default to="fail-output"/>
    </switch>
</decision>
<kill name="fail">
    <message>Shell action failed, error message[${wf:errorMessage(wf:lastErrorNode())}]</message>
</kill>
<kill name="fail-output">
    <message>Incorrect output, expected [Hello Oozie] but was [${wf:actionData('shell-node')['my_output']}]</message>
</kill>
<end name="end"/>
</workflow-app>
```

#### 第六步：上传我们的调度任务到hdfs上面去

注意：上传的hdfs目录为/user/root，因为我们hadoop启动的时候使用的是root用户，如果hadoop启动的是其他用户，那么就上传到

/user/其他用户

```sh
cd /kkb/install/oozie-4.1.0-cdh5.14.2

hdfs dfs -put oozie_works/ /user/hadoop
```

#### 第七步：执行调度任务

通过oozie的命令来执行我们的调度任务

```sh
cd /kkb/install/oozie-4.1.0-cdh5.14.2

bin/oozie job -oozie http://node03:11000/oozie -config oozie_works/shell/job.properties -run
```

从监控界面可以看到我们的任务正在执行了：

 <img src="oozie.assets/image-20200406212303844.png" alt="image-20200406212303844"  />

继续刷新，成功了：

![image-20200406213106141](oozie.assets/image-20200406213106141.png)

通过19888端口，查看hadoop的JobHistory，会发现，oozie实际上是启动了一个MR任务去执行我们的shell脚本。

![image-20200406214109395](oozie.assets/image-20200406214109395.png)

<img src="oozie.assets/image-20200406214728641.png" alt="image-20200406214728641" style="zoom:80%;" />

## 使用oozie调度hive

#### 第一步：拷贝hive的案例模板

```
cd /kkb/install/oozie-4.1.0-cdh5.14.2

cp -ra examples/apps/hive2/ oozie_works/
```

#### 第二步：编辑hive模板

这里使用的是hiveserver2来进行提交任务，需要注意我们要将hiveserver2的服务给启动起来

修改job.properties

```sh
cd /kkb/install/oozie-4.1.0-cdh5.14.2/oozie_works/hive2

vim job.properties

nameNode=hdfs://node01:8020
jobTracker=node01:8032
queueName=default
jdbcURL=jdbc:hive2://node03:10000/default
examplesRoot=oozie_works
oozie.use.system.libpath=true

## 配置我们文件上传到hdfs的保存路径
oozie.wf.application.path=${nameNode}/user/${user.name}/${examplesRoot}/hive2
```

修改workflow.xml()

```
vim workflow.xml
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<workflow-app xmlns="uri:oozie:workflow:0.5" name="hive2-wf">
    <start to="hive2-node"/>

    <action name="hive2-node">
        <hive2 xmlns="uri:oozie:hive2-action:0.1">
            <job-tracker>${jobTracker}</job-tracker>
            <name-node>${nameNode}</name-node>
            <prepare>
                <delete path="${nameNode}/user/${wf:user()}/${examplesRoot}/output-data/hive2"/>
                <mkdir path="${nameNode}/user/${wf:user()}/${examplesRoot}/output-data"/>
            </prepare>
            <configuration>
                <property>
                    <name>mapred.job.queue.name</name>
                    <value>${queueName}</value>
                </property>
            </configuration>
            <jdbc-url>${jdbcURL}</jdbc-url>
            <script>script.q</script>
            <param>INPUT=/user/${wf:user()}/${examplesRoot}/input-data/table</param>
            <param>OUTPUT=/user/${wf:user()}/${examplesRoot}/output-data/hive2</param>
        </hive2>
        <ok to="end"/>
        <error to="fail"/>
    </action>

    <kill name="fail">
        <message>Hive2 (Beeline) action failed, error message[${wf:errorMessage(wf:lastErrorNode())}]</message>
    </kill>
    <end name="end"/>
</workflow-app> 
```

编辑script.q文件

```sh
cd /kkb/install/oozie-4.1.0-cdh5.14.2/oozie_works/hive2
vim script.q
```

```sql
DROP TABLE IF EXISTS test;
CREATE EXTERNAL TABLE test (a INT) STORED AS TEXTFILE LOCATION '${INPUT}';
insert into test values(10);
insert into test values(20);
insert into test values(30);
```

#### 第三步：上传工作文件到hdfs

```sh
cd /kkb/install/oozie-4.1.0-cdh5.14.2/oozie_works
hdfs dfs -put hive2/ /user/hadoop/oozie_works/
```

#### 第四步：执行oozie的调度

```sh
[hadoop@node03 ~]$ hive --service hiveserver2

cd /kkb/install/oozie-4.1.0-cdh5.14.2

bin/oozie job -oozie http://node03:11000/oozie -config oozie_works/hive2/job.properties -run

#-oozie http://node03:11000/oozie 表示oozie url
#-config oozie_works/hive2/job.properties 表示oozie配置文件的路径
#-run 表示 run a job
```

#### 第五步：查看调度结果

![image-20200408000032467](oozie.assets/image-20200408000032467.png)

![image-20200408000802963](oozie.assets/image-20200408000802963.png)

## bin/oozie命令的使用帮助

```sh
[hadoop@node03 oozie-4.1.0-cdh5.14.2]$ bin/oozie help
usage: 
      the env variable 'OOZIE_URL' is used as default value for the '-oozie' option
      the env variable 'OOZIE_TIMEZONE' is used as default value for the '-timezone' option
      the env variable 'OOZIE_AUTH' is used as default value for the '-auth' option
      custom headers for Oozie web services can be specified using '-Dheader:NAME=VALUE'

      oozie help : display usage for all commands or specified command

      oozie version : show client version

      oozie job <OPTIONS> : job operations
                -action <arg>          coordinator rerun/kill on action ids (requires -rerun/-kill);
                                       coordinator log retrieval on action ids(requires -log)
                -allruns               Get workflow jobs corresponding to a coordinator action
                                       including all the reruns
                -auth <arg>            select authentication type [SIMPLE|KERBEROS]
                -change <arg>          change a coordinator or bundle job
                -config <arg>          job configuration file '.xml' or '.properties'
                -configcontent <arg>   job configuration
                -coordinator <arg>     bundle rerun on coordinator names (requires -rerun)
                -D <property=value>    set/override value for given property
                -date <arg>            coordinator/bundle rerun on action dates (requires -rerun);
                                       coordinator log retrieval on action dates (requires -log)
                -debug                 Use debug mode to see debugging statements on stdout
                -definition <arg>      job definition
                -diff <arg>            Show diff of the new coord definition and properties with the
                                       existing one (default true)
                -doas <arg>            doAs user, impersonates as the specified user
                -dryrun                Dryrun a workflow (since 3.3.2) or coordinator (since 2.0)
                                       job without actually executing it
                -failed                runs the failed workflow actions of the coordinator actions
                                       (requires -rerun)
                -filter <arg>          <key><comparator><value>[;<key><comparator><value>]*
                                       (All Coordinator actions satisfying the filters will be
                                       retreived).
                                       key: status or nominaltime
                                       comparator: =, !=, <, <=, >, >=. = is used as OR and others
                                       as AND
                                       status: values are valid status like SUCCEEDED, KILLED etc.
                                       Only = and != apply for status
                                       nominaltime: time of format yyyy-MM-dd'T'HH:mm'Z'
                -ignore <arg>          change status of a coordinator job or action to IGNORED
                                       (-action required to ignore coord actions)
                -info <arg>            info of a job
                -interval <arg>        polling interval in minutes (default is 5, requires -poll)
                -kill <arg>            kill a job (coordinator can mention -action or -date)
                -len <arg>             number of actions (default TOTAL ACTIONS, requires -info)
                -localtime             use local time (same as passing your time zone to -timezone).
                                       Overrides -timezone option
                -log <arg>             job log
                -logfilter <arg>       job log search parameter. Can be specified as -logfilter
                                       opt1=val1;opt2=val1;opt3=val1. Supported options are recent,
                                       start, end, loglevel, text, limit and debug
                -nocleanup             do not clean up output-events of the coordiantor rerun
                                       actions (requires -rerun)
                -offset <arg>          job info offset of actions (default '1', requires -info)
                -oozie <arg>           Oozie URL
                -order <arg>           order to show coord actions (default ascending order, 'desc'
                                       for descending order, requires -info)
                -poll <arg>            poll Oozie until a job reaches a terminal state or a timeout
                                       occurs
                -refresh               re-materialize the coordinator rerun actions (requires
                                       -rerun)
                -rerun <arg>           rerun a job  (coordinator requires -action or -date, bundle
                                       requires -coordinator or -date)
                -resume <arg>          resume a job
                -run                   run a job
                -start <arg>           start a job
                -submit                submit a job
                -suspend <arg>         suspend a job
                -timeout <arg>         timeout in minutes (default is 30, negative values indicate
                                       no timeout, requires -poll)
                -timezone <arg>        use time zone with the specified ID (default GMT).
                                       See 'oozie info -timezones' for a list
                -update <arg>          Update coord definition and properties
                -value <arg>           new endtime/concurrency/pausetime value for changing a
                                       coordinator job
                -verbose               verbose mode

      oozie jobs <OPTIONS> : jobs status
                 -auth <arg>       select authentication type [SIMPLE|KERBEROS]
                 -bulk <arg>       key-value pairs to filter bulk jobs response. e.g.
                                   bundle=<B>\;coordinators=<C>\;actionstatus=<S>\;startcreatedtime=
                                   <SC>\;endcreatedtime=<EC>\;startscheduledtime=<SS>\;endscheduledt
                                   ime=<ES>\; bundle, coordinators and actionstatus can be multiple
                                   comma separated valuesbundle and coordinators can be id(s) or
                                   appName(s) of those jobs. Specifying bundle is mandatory, other
                                   params are optional
                 -doas <arg>       doAs user, impersonates as the specified user
                 -filter <arg>
                                   text=<*>\;user=<U>\;name=<N>\;group=<G>\;status=<S>\;frequency=<F
                                   >\;unit=<M>\;startcreatedtime=<SC>\;endcreatedtime=<EC>
                                   \;sortBy=<SB>
                                   (text filter: matches partially with name and user or complete
                                   match with job IDvalid unit values are 'months', 'days', 'hours'
                                   or 'minutes'. startcreatedtime, endcreatedtime: time of format
                                   yyyy-MM-dd'T'HH:mm'Z'. valid values for sortBy are 'createdTime'
                                   or 'lastModifiedTime'.)
                 -jobtype <arg>    job type ('Supported in Oozie-2.0 or later versions ONLY -
                                   'coordinator' or 'bundle' or 'wf'(default))
                 -kill             bulk kill operation
                 -len <arg>        number of jobs (default '100')
                 -localtime        use local time (same as passing your time zone to -timezone).
                                   Overrides -timezone option
                 -offset <arg>     jobs offset (default '1')
                 -oozie <arg>      Oozie URL
                 -resume           bulk resume operation
                 -suspend          bulk suspend operation
                 -timezone <arg>   use time zone with the specified ID (default GMT).
                                   See 'oozie info -timezones' for a list
                 -verbose          verbose mode

      oozie admin <OPTIONS> : admin operations
                  -auth <arg>         select authentication type [SIMPLE|KERBEROS]
                  -configuration      show Oozie system configuration
                  -doas <arg>         doAs user, impersonates as the specified user
                  -instrumentation    show Oozie system instrumentation
                  -javasysprops       show Oozie Java system properties
                  -metrics            show Oozie system metrics
                  -oozie <arg>        Oozie URL
                  -osenv              show Oozie system OS environment
                  -queuedump          show Oozie server queue elements
                  -servers            list available Oozie servers (more than one only if HA is
                                      enabled)
                  -shareliblist       List available sharelib that can be specified in a workflow
                                      action
                  -sharelibupdate     Update server to use a newer version of sharelib
                  -status             show the current system status
                  -systemmode <arg>   Supported in Oozie-2.0 or later versions ONLY. Change oozie
                                      system mode [NORMAL|NOWEBSERVICE|SAFEMODE]
                  -version            show Oozie server build version

      oozie validate <OPTIONS> <ARGS> : validate a workflow, coordinator, bundle XML file
                     -auth <arg>    select authentication type [SIMPLE|KERBEROS]
                     -oozie <arg>   Oozie URL

      oozie sla <OPTIONS> : sla operations (Deprecated with Oozie 4.0)
                -auth <arg>     select authentication type [SIMPLE|KERBEROS]
                -filter <arg>   filter of SLA events. e.g., jobid=<J>\;appname=<A>
                -len <arg>      number of results (default '100', max '1000')
                -offset <arg>   start offset (default '0')
                -oozie <arg>    Oozie URL

      oozie pig <OPTIONS> -X <ARGS> : submit a pig job, everything after '-X' are pass-through parameters to pig, any '-D' arguments after '-X' are put in <configuration>
                -auth <arg>           select authentication type [SIMPLE|KERBEROS]
                -config <arg>         job configuration file '.properties'
                -D <property=value>   set/override value for given property
                -doas <arg>           doAs user, impersonates as the specified user
                -file <arg>           pig script
                -oozie <arg>          Oozie URL
                -P <property=value>   set parameters for script

      oozie hive <OPTIONS> -X <ARGS> : submit a hive job, everything after '-X' are pass-through parameters to hive, any '-D' arguments after '-X' are put in <configuration>
                 -auth <arg>           select authentication type [SIMPLE|KERBEROS]
                 -config <arg>         job configuration file '.properties'
                 -D <property=value>   set/override value for given property
                 -doas <arg>           doAs user, impersonates as the specified user
                 -file <arg>           hive script
                 -oozie <arg>          Oozie URL
                 -P <property=value>   set parameters for script

      oozie sqoop <OPTIONS> -X <ARGS> : submit a sqoop job, everything after '-X' are pass-through parameters to sqoop, any '-D' arguments after '-X' are put in <configuration>
                  -auth <arg>           select authentication type [SIMPLE|KERBEROS]
                  -command <command>    sqoop command
                  -config <arg>         job configuration file '.properties'
                  -D <property=value>   set/override value for given property
                  -doas <arg>           doAs user, impersonates as the specified user
                  -oozie <arg>          Oozie URL

      oozie info <OPTIONS> : get more detailed info about specific topics
                 -timezones   display a list of available time zones

      oozie mapreduce <OPTIONS> : submit a mapreduce job
                      -auth <arg>           select authentication type [SIMPLE|KERBEROS]
                      -config <arg>         job configuration file '.properties'
                      -D <property=value>   set/override value for given property
                      -doas <arg>           doAs user, impersonates as the specified user
                      -oozie <arg>          Oozie URL
```

 



## 使用oozie调度MR任务

#### 第一步：准备MR执行的数据

选用hadoop工程自带的MR程序来运行wordcount的示例

准备以下数据上传到HDFS的/oozie/input路径下去

```sh
hdfs dfs -mkdir -p /oozie/input
cd /tmp/
vim wordcount.txt
```

```
hello  world  hadoop
spark  hive  hadoop
```

将我们的数据上传到hdfs对应目录

```sh
hdfs dfs -put /tmp/wordcount.txt /oozie/input
```

#### 第二步：执行官方测试案例

```sh
yarn jar /kkb/install/hadoop-2.6.0-cdh5.14.2/share/hadoop/mapreduce/hadoop-mapreduce-examples-2.6.0-cdh5.14.2.jar wordcount /oozie/input/ /oozie/output
```

#### 第三步：准备我们调度的资源

将我们需要调度的资源都准备好放到一个文件夹下面去，包括我们的jar包，我们的job.properties，以及我们的workflow.xml。

拷贝MR的任务模板

```sh
cd /kkb/install/oozie-4.1.0-cdh5.14.2

cp -ra examples/apps/map-reduce/ oozie_works/
```

删掉MR任务模板lib目录下自带的jar包

```sh
cd /kkb/install/oozie-4.1.0-cdh5.14.2/oozie_works/map-reduce/lib

rm -rf oozie-examples-4.1.0-cdh5.14.2.jar
```

#### 第三步：拷贝我们自己的jar包到对应目录

从上一步的删除当中，我们可以看到我们需要调度的jar包存放在了

```sh
/kkb/install/oozie-4.1.0-cdh5.14.2/oozie_works/map-reduce/lib
```

这个目录下，所以我们把我们需要调度的jar包也放到这个路径下即可

```sh
cp /kkb/install/hadoop-2.6.0-cdh5.14.2/share/hadoop/mapreduce/hadoop-mapreduce-examples-2.6.0-cdh5.14.2.jar /kkb/install/oozie-4.1.0-cdh5.14.2/oozie_works/map-reduce/lib/

[hadoop@node03 lib]$ ls
hadoop-mapreduce-examples-2.6.0-cdh5.14.2.jar
```

#### 第四步：修改配置文件

修改job.properties

```sh
cd /kkb/install/oozie-4.1.0-cdh5.14.2/oozie_works/map-reduce
vim job.properties
```

```sh
nameNode=hdfs://node01:8020
jobTracker=node01:8032
queueName=default
examplesRoot=oozie_works
oozie.wf.application.path=${nameNode}/user/${user.name}/${examplesRoot}/map-reduce/workflow.xml
outputDir=/oozie/output
inputdir=/oozie/input
```

修改workflow.xml

```sh
cd /kkb/install/oozie-4.1.0-cdh5.14.2/oozie_works/map-reduce
vim workflow.xml
```

要修改的地方如下：

1. 26行：<delete path="${nameNode}/${outputDir}"/>
2. 33行-56行的内容全部注释掉，这个是hadoop1.x的内容
3. 注释掉后，将57行-105行的内容添加上来

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!--
  Licensed to the Apache Software Foundation (ASF) under one
  or more contributor license agreements.  See the NOTICE file
  distributed with this work for additional information
  regarding copyright ownership.  The ASF licenses this file
  to you under the Apache License, Version 2.0 (the
  "License"); you may not use this file except in compliance
  with the License.  You may obtain a copy of the License at
  
       http://www.apache.org/licenses/LICENSE-2.0
  
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
-->
<workflow-app xmlns="uri:oozie:workflow:0.5" name="map-reduce-wf">
    <start to="mr-node"/>
    <action name="mr-node">
        <map-reduce>
            <job-tracker>${jobTracker}</job-tracker>
            <name-node>${nameNode}</name-node>
            <prepare>
                <delete path="${nameNode}/${outputDir}"/>
            </prepare>
            <configuration>
                <property>
                    <name>mapred.job.queue.name</name>
                    <value>${queueName}</value>
                </property>
				<!--  
                <property>
                    <name>mapred.mapper.class</name>
                    <value>org.apache.oozie.example.SampleMapper</value>
                </property>
                <property>
                    <name>mapred.reducer.class</name>
                    <value>org.apache.oozie.example.SampleReducer</value>
                </property>
                <property>
                    <name>mapred.map.tasks</name>
                    <value>1</value>
                </property>
                <property>
                    <name>mapred.input.dir</name>
                    <value>/user/${wf:user()}/${examplesRoot}/input-data/text</value>
                </property>
                <property>
                    <name>mapred.output.dir</name>
                    <value>/user/${wf:user()}/${examplesRoot}/output-data/${outputDir}</value>
                </property>
				-->
				
				   <!-- 开启使用新的API来进行配置 -->
                <property>
                    <name>mapred.mapper.new-api</name>
                    <value>true</value>
                </property>

                <property>
                    <name>mapred.reducer.new-api</name>
                    <value>true</value>
                </property>

                <!-- 指定MR的输出key的类型 -->
                <property>
                    <name>mapreduce.job.output.key.class</name>
                    <value>org.apache.hadoop.io.Text</value>
                </property>

                <!-- 指定MR的输出的value的类型-->
                <property>
                    <name>mapreduce.job.output.value.class</name>
                    <value>org.apache.hadoop.io.IntWritable</value>
                </property>

                <!-- 指定输入路径 -->
                <property>
                    <name>mapred.input.dir</name>
                    <value>${nameNode}/${inputdir}</value>
                </property>

                <!-- 指定输出路径 -->
                <property>
                    <name>mapred.output.dir</name>
                    <value>${nameNode}/${outputDir}</value>
                </property>

                <!-- 指定执行的map类 -->
                <property>
                    <name>mapreduce.job.map.class</name>
                    <value>org.apache.hadoop.examples.WordCount$TokenizerMapper</value>
                </property>

                <!-- 指定执行的reduce类 -->
                <property>
                    <name>mapreduce.job.reduce.class</name>
                    <value>org.apache.hadoop.examples.WordCount$IntSumReducer</value>
                </property>
				<!--  配置map task的个数 -->
                <property>
                    <name>mapred.map.tasks</name>
                    <value>1</value>
                </property>

            </configuration>
        </map-reduce>
        <ok to="end"/>
        <error to="fail"/>
    </action>
    <kill name="fail">
        <message>Map/Reduce failed, error message[${wf:errorMessage(wf:lastErrorNode())}]</message>
    </kill>
    <end name="end"/>
</workflow-app>
```

#### 第五步：上传调度任务到hdfs对应目录

```sh
cd /kkb/install/oozie-4.1.0-cdh5.14.2/oozie_works
hdfs dfs -put map-reduce/ /user/hadoop/oozie_works/
```

#### 第六步：执行调度任务

执行我们的调度任务，然后通过oozie的11000端口进行查看任务结果

```sh
cd /kkb/install/oozie-4.1.0-cdh5.14.2
bin/oozie job -oozie http://node03:11000/oozie -config oozie_works/map-reduce/job.properties -run
```

#### 第七步：查看效果

登录http://node03:11000/oozie/

![image-20200408003034574](oozie.assets/image-20200408003034574.png)

## oozie的任务串联

在实际工作当中，肯定会存在多个任务需要执行，并且存在上一个任务的输出结果作为下一个任务的输入数据这样的情况，所以我们需要在workflow.xml配置文件当中配置多个action，实现多个任务之间的相互依赖关系

需求：首先执行一个shell脚本，执行完了之后再执行一个MR的程序，最后再执行一个hive的程序

#### 第一步：准备我们的工作目录

```sh
cd /kkb/install/oozie-4.1.0-cdh5.14.2/oozie_works
mkdir -p sereval-actions
```

#### 第二步：准备我们的调度文件

将我们之前的hive，shell，以及MR的执行，进行串联成到一个workflow当中去，准备我们的资源文件

```sh
cd /kkb/install/oozie-4.1.0-cdh5.14.2/oozie_works
cp hive2/script.q sereval-actions/
cp shell/hello.sh sereval-actions/
cp -ra map-reduce/lib sereval-actions/

[hadoop@node03 sereval-actions]$ pwd
/kkb/install/oozie-4.1.0-cdh5.14.2/oozie_works/sereval-actions
[hadoop@node03 sereval-actions]$ ls
hello.sh  lib  script.q
```

#### 第三步：开发调度的配置文件

```
cd /kkb/install/oozie-4.1.0-cdh5.14.2/oozie_works/sereval-actions
```

创建配置文件workflow.xml并编辑

```
vim workflow.xml
```

单个任务时，配置文件内容大致如下：

`<action>...</action>`

多个任务时，配置文件内容就是多个action的集成，大致如下：
```
> - <start to="shell-node"/>
> - <action name="shell-node">
> - - <ok to="mr-node"/>
>   - <error to="mr-node"/>
> - </action>
> - <action name="mr-node">
> - - <ok to="hive2-node"/>
>   - <error to="fail"/>
> - </action>
> - <action name="hive2-node">
> - - <ok to="end"/>
>   - <error to="fail"/>
> - </action>
```

将下面代码块所有内容添加到配置文件里：

```xml
<workflow-app xmlns="uri:oozie:workflow:0.4" name="shell-wf">
<start to="shell-node"/>
<action name="shell-node">
    <shell xmlns="uri:oozie:shell-action:0.2">
        <job-tracker>${jobTracker}</job-tracker>
        <name-node>${nameNode}</name-node>
        <configuration>
            <property>
                <name>mapred.job.queue.name</name>
                <value>${queueName}</value>
            </property>
        </configuration>
        <exec>${EXEC}</exec>
        <!-- <argument>my_output=Hello Oozie</argument> -->
        <file>/user/hadoop/oozie_works/sereval-actions/${EXEC}#${EXEC}</file>

        <capture-output/>
    </shell>
    <ok to="mr-node"/>
    <error to="mr-node"/>
</action>

<action name="mr-node">
        <map-reduce>
            <job-tracker>${jobTracker}</job-tracker>
            <name-node>${nameNode}</name-node>
            <prepare>
                <delete path="${nameNode}/${outputDir}"/>
            </prepare>
            <configuration>
                <property>
                    <name>mapred.job.queue.name</name>
                    <value>${queueName}</value>
                </property>
				<!--  
                <property>
                    <name>mapred.mapper.class</name>
                    <value>org.apache.oozie.example.SampleMapper</value>
                </property>
                <property>
                    <name>mapred.reducer.class</name>
                    <value>org.apache.oozie.example.SampleReducer</value>
                </property>
                <property>
                    <name>mapred.map.tasks</name>
                    <value>1</value>
                </property>
                <property>
                    <name>mapred.input.dir</name>
                    <value>/user/${wf:user()}/${examplesRoot}/input-data/text</value>
                </property>
                <property>
                    <name>mapred.output.dir</name>
                    <value>/user/${wf:user()}/${examplesRoot}/output-data/${outputDir}</value>
                </property>
				-->
				
				   <!-- 开启使用新的API来进行配置 -->
                <property>
                    <name>mapred.mapper.new-api</name>
                    <value>true</value>
                </property>

                <property>
                    <name>mapred.reducer.new-api</name>
                    <value>true</value>
                </property>

                <!-- 指定MR的输出key的类型 -->
                <property>
                    <name>mapreduce.job.output.key.class</name>
                    <value>org.apache.hadoop.io.Text</value>
                </property>

                <!-- 指定MR的输出的value的类型-->
                <property>
                    <name>mapreduce.job.output.value.class</name>
                    <value>org.apache.hadoop.io.IntWritable</value>
                </property>

                <!-- 指定输入路径 -->
                <property>
                    <name>mapred.input.dir</name>
                    <value>${nameNode}/${inputdir}</value>
                </property>

                <!-- 指定输出路径 -->
                <property>
                    <name>mapred.output.dir</name>
                    <value>${nameNode}/${outputDir}</value>
                </property>

                <!-- 指定执行的map类 -->
                <property>
                    <name>mapreduce.job.map.class</name>
                    <value>org.apache.hadoop.examples.WordCount$TokenizerMapper</value>
                </property>

                <!-- 指定执行的reduce类 -->
                <property>
                    <name>mapreduce.job.reduce.class</name>
                    <value>org.apache.hadoop.examples.WordCount$IntSumReducer</value>
                </property>
				<!--  配置map task的个数 -->
                <property>
                    <name>mapred.map.tasks</name>
                    <value>1</value>
                </property>

            </configuration>
        </map-reduce>
        <ok to="hive2-node"/>
        <error to="fail"/>
    </action>

 <action name="hive2-node">
        <hive2 xmlns="uri:oozie:hive2-action:0.1">
            <job-tracker>${jobTracker}</job-tracker>
            <name-node>${nameNode}</name-node>
            <prepare>
                <delete path="${nameNode}/user/${wf:user()}/${examplesRoot}/output-data/hive2"/>
                <mkdir path="${nameNode}/user/${wf:user()}/${examplesRoot}/output-data"/>
            </prepare>
            <configuration>
                <property>
                    <name>mapred.job.queue.name</name>
                    <value>${queueName}</value>
                </property>
            </configuration>
            <jdbc-url>${jdbcURL}</jdbc-url>
            <script>script.q</script>
            <param>INPUT=/user/${wf:user()}/${examplesRoot}/input-data/table</param>
            <param>OUTPUT=/user/${wf:user()}/${examplesRoot}/output-data/hive2</param>
        </hive2>
        <ok to="end"/>
        <error to="fail"/>
    </action>
<decision name="check-output">
    <switch>
        <case to="end">
            ${wf:actionData('shell-node')['my_output'] eq 'Hello Oozie'}
        </case>
        <default to="fail-output"/>
    </switch>
</decision>
<kill name="fail">
    <message>Shell action failed, error message[${wf:errorMessage(wf:lastErrorNode())}]</message>
</kill>
<kill name="fail-output">
    <message>Incorrect output, expected [Hello Oozie] but was [${wf:actionData('shell-node')['my_output']}]</message>
</kill>
<end name="end"/>
</workflow-app>
```

开发我们的job.properties配置文件

```
cd /kkb/install/oozie-4.1.0-cdh5.14.2/oozie_works/sereval-actions
vim job.properties
```

内容就是多个任务的参数的综合：

```sh
nameNode=hdfs://node01:8020
jobTracker=node01:8032
queueName=default
examplesRoot=oozie_works
EXEC=hello.sh
outputDir=/oozie/output
inputdir=/oozie/input
jdbcURL=jdbc:hive2://node03:10000/default
oozie.use.system.libpath=true
## 配置我们文件上传到hdfs的保存路径
oozie.wf.application.path=${nameNode}/user/${user.name}/${examplesRoot}/sereval-actions/workflow.xml 
```

#### 第四步：上传我们的资源文件夹到hdfs对应路径

```sh
cd /kkb/install/oozie-4.1.0-cdh5.14.2/oozie_works/
hdfs dfs -put sereval-actions/ /user/hadoop/oozie_works/
```

#### 第五步：执行调度任务

要保证hiveserver2服务已经开启。

```sh
cd /kkb/install/oozie-4.1.0-cdh5.14.2/
[hadoop@node03 oozie-4.1.0-cdh5.14.2]$ bin/oozie job -oozie http://node03:11000/oozie -config oozie_works/sereval-actions/job.properties -run
#之前出现了一次错误，不知道为什么，下面一行内容建议使用tab补全功能输入
#oozie_works/sereval-actions/job.properties
```

#### 第六步：查看效果

http://node03:11000/oozie/

<img src="http://node03:11000/oozie/v2/job/0000003-200406202248813-oozie-hado-W?show=graph" alt="Runtime error : Can't display the graph. Number of actions are more than display limit 25" style="zoom: 80%;" />



## oozie定时任务执行

在oozie当中，主要是通过Coordinator 来实现任务的定时调度，与我们的workflow类似的，Coordinator 这个模块也是主要通过xml来进行配置即可，接下来我们就来看看如何配置Coordinator 来实现任务的定时调度

Coordinator 的调度主要可以有两种实现方式：

第一种：基于时间的定时任务调度, oozie基于时间的调度主要需要指定三个参数，第一个起始时间，第二个结束时间，第三个调度频率

第二种：基于数据的任务调度，只有在有了数据才会去出发执行，只要在有了数据才会触发调度任务。

##### 第一步：拷贝定时任务的调度模板

```
cd /kkb/install/oozie-4.1.0-cdh5.14.2
cp -r examples/apps/cron oozie_works/cron-job
```

##### 第二步：拷贝我们的hello.sh脚本

```
cd /kkb/install/oozie-4.1.0-cdh5.14.2/oozie_works
cp shell/hello.sh cron-job/
```

##### 第三步：修改配置文件

###### 修改job.properties

```
cd /kkb/install/oozie-4.1.0-cdh5.14.2/oozie_works/cron-job
vim job.properties
```

```sh
nameNode=hdfs://node01:8020
jobTracker=node01:8032
queueName=default
examplesRoot=oozie_works
oozie.coord.application.path=${nameNode}/user/${user.name}/${examplesRoot}/cron-job/coordinator.xml

start=2018-08-22T19:20+0800
end=2019-08-22T19:20+0800
EXEC=hello.sh
workflowAppUri=${nameNode}/user/${user.name}/${examplesRoot}/cron-job/workflow.xml
```

###### 修改coordinator.xml

```
vim coordinator.xml
```

要修改的地方如下：

- name="cron-job"
- frequency="${coord:minutes(1)}"
- timezone="GMT+0800"
- xmlns="uri:oozie:coordinator:0.4"

```xml
<!--
	oozie的frequency 可以支持很多表达式，其中可以通过定时每分，或者每小时，或者每天，或者每月进行执行，也支持可以通过与linux的crontab表达式类似的写法来进行定时任务的执行
	例如frequency 也可以写成以下方式
	frequency="10 9 * * *"  每天上午的09:10:00开始执行任务
	frequency="0 1 * * *"  每天凌晨的01:00开始执行任务
 -->
<!-- frequency="${coord:minutes(1)}" 表示每隔一分钟执行一次-->
<coordinator-app name="cron-job" frequency="${coord:minutes(1)}" start="${start}" end="${end}" timezone="GMT+0800"
                 xmlns="uri:oozie:coordinator:0.4">
        <action>
        <workflow>
            <app-path>${workflowAppUri}</app-path>
            <configuration>
                <property>
                    <name>jobTracker</name>
                    <value>${jobTracker}</value>
                </property>
                <property>
                    <name>nameNode</name>
                    <value>${nameNode}</value>
                </property>
                <property>
                    <name>queueName</name>
                    <value>${queueName}</value>
                </property>
            </configuration>
        </workflow>
    </action>
</coordinator-app> 
```

###### 修改workflow.xml

```
vim workflow.xml
```

要修改的地方如下：

- 添加`<shell>..</shell>`之间的所有内容

```xml
<workflow-app xmlns="uri:oozie:workflow:0.5" name="one-op-wf">
    <start to="action1"/>
    <action name="action1">
    <shell xmlns="uri:oozie:shell-action:0.2">
        <job-tracker>${jobTracker}</job-tracker>
        <name-node>${nameNode}</name-node>
        <configuration>
            <property>
                <name>mapred.job.queue.name</name>
                <value>${queueName}</value>
            </property>
        </configuration>
        <exec>${EXEC}</exec>
        <!-- <argument>my_output=Hello Oozie</argument> -->
        <file>/user/hadoop/oozie_works/cron-job/${EXEC}#${EXEC}</file>

        <capture-output/>
    </shell>
    <ok to="end"/>
    <error to="end"/>
</action>
    <end name="end"/>
</workflow-app>
```

##### 第四步：上传到hdfs对应路径

```sh
cd /kkb/install/oozie-4.1.0-cdh5.14.2/oozie_works
hdfs dfs -put cron-job/ /user/hadoop/oozie_works/
```

##### 第五步：运行定时任务

```sh
cd /kkb/install/oozie-4.1.0-cdh5.14.2

bin/oozie job -oozie http://node03:11000/oozie -config oozie_works/cron-job/job.properties -run
```

##### 第六步：查看效果

![image-20200410155923280](oozie.assets/image-20200410155923280.png)

## oozie任务的查看及杀死

##### 查看所有普通任务

```sh
[hadoop@node03 oozie-4.1.0-cdh5.14.2]$ oozie jobs
Job ID                                   App Name     Status    User      Group     Started                 Ended                   
--------------------------------------------------------------------------------------
0000003-200406202248813-oozie-hado-W     shell-wf     SUCCEEDED hadoop    -         2020-04-07 17:19 GMT    2020-04-07 17:21 GMT    
--------------------------------------------------------------------------------------
0000002-200406202248813-oozie-hado-W     map-reduce-wfSUCCEEDED hadoop    -         2020-04-07 16:29 GMT    2020-04-07 16:30 GMT    
--------------------------------------------------------------------------------------
0000001-200406202248813-oozie-hado-W     hive2-wf     SUCCEEDED hadoop    -         2020-04-07 15:59 GMT    2020-04-07 16:04 GMT    
--------------------------------------------------------------------------------------
0000000-200406202248813-oozie-hado-W     shell-wf     SUCCEEDED hadoop    -         2020-04-06 13:22 GMT    2020-04-06 13:23 GMT    
--------------------------------------------------------------------------------------
```

##### 查看定时任务

```sh
[hadoop@node03 oozie-4.1.0-cdh5.14.2]$ oozie jobs -jobtype coordinator
Job ID                                   App Name       Status    Freq Unit         Started                 Next Materialized       
--------------------------------------------------------------------------------------
0000004-200406202248813-oozie-hado-C     cron-job       PREP      1    MINUTE       2020-04-10 16:00 GMT    -                       
--------------------------------------------------------------------------------------
```

##### 杀死某个任务

oozie可以通过jobid来杀死某个定时任务，语法：oozie job -kill [id]

```sh
oozie job -kill 0000004-200406202248813-oozie-hado-C
```

 定时任务被杀死后，Status会显示KILLED。![image-20200410160425194](oozie.assets/image-20200410160425194.png)

## hue整合oozie

#### 第一步：停止oozie与hue的进程

停止oozie进程：

```sh
cd /kkb/install/oozie-4.1.0-cdh5.14.2
bin/oozied.sh stop

#通过jps查看，没有BootStrap进程就代表停掉了
```

#### 第二步：修改oozie的配置文件

这个是老版本的bug，新版本已经不需要修改和上传了，这一步我们都不需要做了

修改oozie的配置文件oozie-site.xml---不需要

```xml
<property>    
    <name>oozie.service.WorkflowAppService.system.libpath</name>
    <value>/user/oozie/share/lib</value>
</property>
<property>
    <name>oozie.use.system.libpath</name>
    <value>true</value> 
</property>
```

重新上传所有的jar包到hdfs的/user/oozie/share/lib路径下去---不需要

```sh
cd /kkb/install/oozie-4.1.0-cdh5.14.2

bin/oozie-setup.sh sharelib create -fs hdfs://node01:8020 -locallib oozie-sharelib-4.1.0-cdh5.14.2-yarn.tar.gz
```

#### 第三步：修改hue的配置文件

修改hue的配置文件hue.ini---->通过notepad修改即可

```sh
[liboozie]
## The URL where the Oozie service runs on. This is required in order for
## users to submit jobs. Empty value disables the config check.
oozie_url=http://node03:11000/oozie

## Requires FQDN in oozie_url if enabled
## security_enabled=false
## Location on HDFS where the workflows/coordinator are deployed when submitted.
remote_deployement_dir=/user/hadoop/oozie_works
```

修改[oozie]，大概在1151行左右的样子

```sh
[oozie]
## Location on local FS where the examples are stored.
  ## local_data_dir=/kkb/install/oozie-4.1.0-cdh5.14.2/examples/apps

  ## Location on local FS where the data for the examples is stored.
  ## sample_data_dir=/kkb/install/oozie-4.1.0-cdh5.14.2/examples/input-data

  ## Location on HDFS where the oozie examples and workflows are stored.
  ## Parameters are $TIME and $USER, e.g. /user/$USER/hue/workspaces/workflow-$TIME
  ## remote_data_dir=/user/root/oozie_works/examples/apps

  ## Maximum of Oozie workflows or coodinators to retrieve in one API call.
  oozie_jobs_count=100

  ## Use Cron format for defining the frequency of a Coordinator instead of the old frequency number/unit.
  enable_cron_scheduling=true

  ## Flag to enable the saved Editor queries to be dragged and dropped into a workflow.
  enable_document_action=true

  ## Flag to enable Oozie backend filtering instead of doing it at the page level in Javascript. Requires Oozie 4.3+.
  enable_oozie_backend_filtering=true

  ## Flag to enable the Impala action.
  enable_impala_action=true

[filebrowser]
## Location on local filesystem where the uploaded archives are temporary stored.
  archive_upload_tempdir=/tmp

  ## Show Download Button for HDFS file browser.
  show_download_button=true

  ## Show Upload Button for HDFS file browser.
  show_upload_button=true

  ## Flag to enable the extraction of a uploaded archive in HDFS.
  enable_extract_uploaded_archive=true
```

#### 第四步：启动hue与oozie的进程

启动hue进程

```
cd /kkb/install/hue-3.9.0-cdh5.14.2
build/env/bin/supervisor
```

启动oozie进程

```
cd /kkb/install/oozie-4.1.0-cdh5.14.2
bin/oozied.sh start
```

#### 第五步：页面访问hue

http://node03.hadoop.com:8888/

###### 添加oozie workflow任务

事先写好hql/impala sql等，或者准备好mapreduce jar包等，然后通过拉拽的方式设置即可。

![image-20200410170101378](oozie.assets/image-20200410170101378.png)

###### 添加oozie 定时任务

添加好oozie workflow之后，就可以将该workflow设置为定时任务了。

![image-20200410170536143](oozie.assets/image-20200410170536143.png)

![image-20200410170600805](oozie.assets/image-20200410170600805.png)

![image-20200410170715921](oozie.assets/image-20200410170715921.png)

<img src="oozie.assets/image-20200410171154007.png" alt="image-20200410171154007" style="zoom:67%;" />

## oozie使用过程当中可能遇到的问题

1) Mysql权限配置

授权所有主机可以使用root用户操作所有数据库和数据表  

```sql
mysql> grant all on *.* to root@'%' identified by '123456' with  grant option;  
mysql> flush privileges;  
mysql> exit;  
```

2) workflow.xml配置的时候不要忽略file属性

3) jps查看进程时，注意有没有bootstrap

**4)** 关闭oozie

如果bin/oozied.sh stop无法关闭，则可以使用kill -9 [pid]，之后oozie根目录下的oozie-server/temp/xxx.pid文件一定要删除。

**5) **Oozie重新打包时，一定要注意先关闭进程，删除对应文件夹下面的pid文件。（可以参考第4条目）

**6)** 配置文件一定要生效

起始标签和结束标签无对应则不生效，配置文件的属性写错了，那么则执行默认的属性。

7) libext下边的jar存放于某个文件夹中，导致share/lib创建不成功**。**

9) 修改Hadoop配置文件，需要重启集群。一定要记得scp到其他节点。

10) JobHistoryServer必须开启，集群要重启的。

11) Mysql配置如果没有生效的话，默认使用derby数据库。

12) 在本地修改完成的job配置，必须重新上传到HDFS。

13) 将HDFS中上传的oozie配置文件下载下来查看是否有错误。

14) Linux用户名和Hadoop的用户名不一致。

15）sharelib找不到，包括重新初始化oozie

如果部署oozie出错，修复执行，初始化oozie：

1. 停止oozie（要通过jps检查bootstrap进程是否已经不存在）
2. 删除oozie-server/temp/
3. 删除HDFS上的sharelib文件夹
4. 删除oozie.sql文件，删除Mysql中删除oozie库，重新创建
5. 重新按照顺序执行文档中oozie的安装重新再来一遍

 

 

 