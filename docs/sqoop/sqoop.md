## sqoop概述

Sqoop是apache旗下的一款 ”Hadoop和关系数据库之间传输数据“ 的工具

导入数据：将MySQL，Oracle导入数据到Hadoop的HDFS、HIVE、HBASE等数据存储系统

导出数据：从Hadoop的文件系统HDFS中导出数据到关系数据库

![image-20200320140617360](sqoop.assets/image-20200320140617360.png)

 

## sqoop的工作机制

将导入和导出的命令翻译成mapreduce程序实现

在翻译出的mapreduce中主要是对inputformat和outputformat进行定制

## sqoop1与sqoop2架构对比

sqoop在发展中的过程中演进出来了两种不同的架构.[架构演变史](https://blogs.apache.org/sqoop/entry/apache_sqoop_highlights_of_sqoop#comment-1561314193000)

#### sqoop1架构(常用)

![image-20200320140635558](sqoop.assets/image-20200320140635558.png)

版本号为1.4.x为sqoop1 

在架构上：sqoop1使用sqoop客户端直接提交的方式

访问方式：CLI控制台方式进行访问

安全性：命令或脚本中指定用户数据库名及密码

 

#### sqoop2架构

![image-20200320140644558](sqoop.assets/image-20200320140644558.png)

 

版本号为1.99x为sqoop2 

在架构上：sqoop2引入了sqoop server，对connector实现了集中的管理

访问方式：REST API、 JAVA API、 WEB UI以及CLI控制台方式进行访问

 

#### sqoop1与sqoop2比较

| 比较 | Sqoop1                                                       | Sqoop2                                                       |
| ---- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 架构 | 仅仅使用一个sqoop客户端                                      | 引入了sqoop server集中化管理connector,以及rest api，web,UI，并引入安全机制 |
| 部署 | 部署简单，安装需要root权限，connector必须符合JDBC模型        | 架构稍复杂，配置部署繁琐                                     |
| 使用 | 命令行方式容易出错，格式紧耦合，无法支持所有数据类型，安全机制不够完善，例如密码暴露 | 多种交互方式，命令行，WebUI，rest API,connector集中化管理，所有的链接安装在sqoop server上，完善权限管理机制，connector规范化，仅仅负责数据的读写。 |

 

## sqoop安装部署

Sqoop安装很简单，解压好进行简单的修改就可以使用.

Sqoop是单台机器安装即可。我们以node03为例，进行安装。

### 第一步：下载安装包

http://archive.cloudera.com/cdh5/cdh/5/sqoop-1.4.6-cdh5.14.2.tar.gz

### 第二步：上传并解压

将我们下载好的安装包上传到node03服务器的/kkb/soft路径下，然后进行解压

```sh
cd /kkb/soft/
[hadoop@node03 soft]$ tar -zxvf sqoop-1.4.6-cdh5.14.2.tar.gz -C /kkb/install/
```

### 第三步：修改配置文件

更改sqoop的配置文件

```sh
cd /kkb/install/sqoop-1.4.6-cdh5.14.2/conf
mv sqoop-env-template.sh sqoop-env.sh
vim sqoop-env.sh
```

```sh
#Set path to where bin/hadoop is available
export HADOOP_COMMON_HOME=/kkb/install/hadoop-2.6.0-cdh5.14.2

#Set path to where hadoop-*-core.jar is available
export HADOOP_MAPRED_HOME=/kkb/install/hadoop-2.6.0-cdh5.14.2

#set the path to where bin/hbase is available
export HBASE_HOME=/kkb/install/hbase-1.2.0-cdh5.14.2

#Set the path to where bin/hive is available
export HIVE_HOME=/kkb/install/hive-1.1.0-cdh5.14.2
```

### 第四步：添加两个必要的jar包

sqoop需要两个额外依赖的jar包，将课件资料当中两个jar包添加到sqoop的lib目录下

```sh
mv /kkb/soft/mysql-connector-java-5.1.38.jar /kkb/install/sqoop-1.4.6-cdh5.14.2/lib/
mv /kkb/soft/java-json.jar /kkb/install/sqoop-1.4.6-cdh5.14.2/lib/
```



### 第五步：配置sqoop的环境变量

```
sudo vim /etc/profile
```

```sh
export SQOOP_HOME=/kkb/install/sqoop-1.4.6-cdh5.14.2
export PATH=:$SQOOP_HOME/bin:$PATH
```



## Sqoop命令

#### 查看命令帮助

```ruby
[hadoop@node03 lib]$ sqoop help 
usage: sqoop COMMAND [ARGS]

Available commands:
  codegen            Generate code to interact with database records
  create-hive-table  Import a table definition into Hive
  eval               Evaluate a SQL statement and display the results
  export             Export an HDFS directory to a database table
  help               List available commands
  import             Import a table from a database to HDFS
  import-all-tables  Import tables from a database to HDFS
  import-mainframe   Import datasets from a mainframe server to HDFS
  job                Work with saved jobs
  list-databases     List available databases on a server
  list-tables        List available tables in a database
  merge              Merge results of incremental imports
  metastore          Run a standalone Sqoop metastore
  version            Display version information
```



#### 列出所有的数据库

list-databases     List available databases on a server

查看该命令的具体帮助：

```sh
sqoop list-databases --help

Generic options supported are
-conf <configuration file>     specify an application configuration file

-D <property=value>            use value for given property

-fs <local|namenode:port>      specify a namenode

-jt <local|resourcemanager:port>    specify a ResourceManager

-files <comma separated list of files>    specify comma separated files to be copied to the map reduce cluster

-libjars <comma separated list of jars>    specify comma separated jar files to include in the classpath.

-archives <comma separated list of archives>    specify comma separated archives to be unarchived on the compute machines.

```

列出node03主机所有的数据库

```sh
bin/sqoop list-databases --connect jdbc:mysql://node03:3306/ --username root --password 123456 

information_schema
hive
mysql
mysqlsource
performance_schema
sys
```

#### 查看某一个数据库下的所有数据表

查看mysqlsource database的所有表

```sh
bin/sqoop list-tables --connect jdbc:mysql://node03:3306/mysqlsource --username root --password 123456

flume_meta
student
```

 

## sqoop导入数据

sqoop的底层原理本质是一个MapReduce job，sqoop是通过一个MapReduce job 从数据库中导入一个表，这个job从表中逐行抽取数据，接着一行行的数据写入HDFS。

表中的每一行被视为HDFS的记录。所有记录都存储为文本文件的文本数据（或者Avro、sequence文件等二进制数据） 

#### 查看导入命令import帮助

```sh
[hadoop@node03 ~]$ sqoop import --help

Common arguments:
   --connect <jdbc-uri>                                       Specify JDBC
                                                              connect
                                                              string
   --connection-manager <class-name>                          Specify
                                                              connection
                                                              manager
                                                              class name
   --connection-param-file <properties-file>                  Specify
                                                              connection
                                                              parameters
                                                              file
   --driver <class-name>                                      Manually
                                                              specify JDBC
                                                              driver class
                                                              to use
   --hadoop-home <hdir>                                       Override
                                                              $HADOOP_MAPR
                                                              ED_HOME_ARG
   --hadoop-mapred-home <dir>                                 Override
                                                              $HADOOP_MAPR
                                                              ED_HOME_ARG
   --help                                                     Print usage
                                                              instructions
   --metadata-transaction-isolation-level <isolationlevel>    Defines the
                                                              transaction
                                                              isolation
                                                              level for
                                                              metadata
                                                              queries. For
                                                              more details
                                                              check
                                                              java.sql.Con
                                                              nection
                                                              javadoc or
                                                              the JDBC
                                                              specificaito
                                                              n
   --oracle-escaping-disabled <boolean>                       Disable the
                                                              escaping
                                                              mechanism of
                                                              the
                                                              Oracle/OraOo
                                                              p connection
                                                              managers
-P                                                            Read
                                                              password
                                                              from console
   --password <password>                                      Set
                                                              authenticati
                                                              on password
   --password-alias <password-alias>                          Credential
                                                              provider
                                                              password
                                                              alias
   --password-file <password-file>                            Set
                                                              authenticati
                                                              on password
                                                              file path
   --relaxed-isolation                                        Use
                                                              read-uncommi
                                                              tted
                                                              isolation
                                                              for imports
   --skip-dist-cache                                          Skip copying
                                                              jars to
                                                              distributed
                                                              cache
   --temporary-rootdir <rootdir>                              Defines the
                                                              temporary
                                                              root
                                                              directory
                                                              for the
                                                              import
   --throw-on-error                                           Rethrow a
                                                              RuntimeExcep
                                                              tion on
                                                              error
                                                              occurred
                                                              during the
                                                              job
   --username <username>                                      Set
                                                              authenticati
                                                              on username
   --verbose                                                  Print more
                                                              information
                                                              while
                                                              working

Import control arguments:
   --append                                                   Imports data
                                                              in append
                                                              mode
   --as-avrodatafile                                          Imports data
                                                              to Avro data
                                                              files
   --as-parquetfile                                           Imports data
                                                              to Parquet
                                                              files
   --as-sequencefile                                          Imports data
                                                              to
                                                              SequenceFile
                                                              s
   --as-textfile                                              Imports data
                                                              as plain
                                                              text
                                                              (default)
   --autoreset-to-one-mapper                                  Reset the
                                                              number of
                                                              mappers to
                                                              one mapper
                                                              if no split
                                                              key
                                                              available
   --boundary-query <statement>                               Set boundary
                                                              query for
                                                              retrieving
                                                              max and min
                                                              value of the
                                                              primary key
   --columns <col,col,col...>                                 Columns to
                                                              import from
                                                              table
   --compression-codec <codec>                                Compression
                                                              codec to use
                                                              for import
   --delete-target-dir                                        Imports data
                                                              in delete
                                                              mode
   --direct                                                   Use direct
                                                              import fast
                                                              path
   --direct-split-size <n>                                    Split the
                                                              input stream
                                                              every 'n'
                                                              bytes when
                                                              importing in
                                                              direct mode
-e,--query <statement>                                        Import
                                                              results of
                                                              SQL
                                                              'statement'
   --fetch-size <n>                                           Set number
                                                              'n' of rows
                                                              to fetch
                                                              from the
                                                              database
                                                              when more
                                                              rows are
                                                              needed
   --inline-lob-limit <n>                                     Set the
                                                              maximum size
                                                              for an
                                                              inline LOB
-m,--num-mappers <n>                                          Use 'n' map
                                                              tasks to
                                                              import in
                                                              parallel
   --mapreduce-job-name <name>                                Set name for
                                                              generated
                                                              mapreduce
                                                              job
   --merge-key <column>                                       Key column
                                                              to use to
                                                              join results
   --split-by <column-name>                                   Column of
                                                              the table
                                                              used to
                                                              split work
                                                              units
   --split-limit <size>                                       Upper Limit
                                                              of rows per
                                                              split for
                                                              split
                                                              columns of
                                                              Date/Time/Ti
                                                              mestamp and
                                                              integer
                                                              types. For
                                                              date or
                                                              timestamp
                                                              fields it is
                                                              calculated
                                                              in seconds.
                                                              split-limit
                                                              should be
                                                              greater than
                                                              0
   --table <table-name>                                       Table to
                                                              read
   --target-dir <dir>                                         HDFS plain
                                                              table
                                                              destination
   --validate                                                 Validate the
                                                              copy using
                                                              the
                                                              configured
                                                              validator
   --validation-failurehandler <validation-failurehandler>    Fully
                                                              qualified
                                                              class name
                                                              for
                                                              ValidationFa
                                                              ilureHandler
   --validation-threshold <validation-threshold>              Fully
                                                              qualified
                                                              class name
                                                              for
                                                              ValidationTh
                                                              reshold
   --validator <validator>                                    Fully
                                                              qualified
                                                              class name
                                                              for the
                                                              Validator
   --warehouse-dir <dir>                                      HDFS parent
                                                              for table
                                                              destination
   --where <where clause>                                     WHERE clause
                                                              to use
                                                              during
                                                              import
-z,--compress                                                 Enable
                                                              compression

Incremental import arguments:
   --check-column <column>        Source column to check for incremental
                                  change
   --incremental <import-type>    Define an incremental import of type
                                  'append' or 'lastmodified'
   --last-value <value>           Last imported value in the incremental
                                  check column

Output line formatting arguments:
   --enclosed-by <char>               Sets a required field enclosing
                                      character
   --escaped-by <char>                Sets the escape character
   --fields-terminated-by <char>      Sets the field separator character
   --lines-terminated-by <char>       Sets the end-of-line character
   --mysql-delimiters                 Uses MySQL's default delimiter set:
                                      fields: ,  lines: \n  escaped-by: \
                                      optionally-enclosed-by: '
   --optionally-enclosed-by <char>    Sets a field enclosing character

Input parsing arguments:
   --input-enclosed-by <char>               Sets a required field encloser
   --input-escaped-by <char>                Sets the input escape
                                            character
   --input-fields-terminated-by <char>      Sets the input field separator
   --input-lines-terminated-by <char>       Sets the input end-of-line
                                            char
   --input-optionally-enclosed-by <char>    Sets a field enclosing
                                            character

Hive arguments:
   --create-hive-table                         Fail if the target hive
                                               table exists
   --hive-database <database-name>             Sets the database name to
                                               use when importing to hive
   --hive-delims-replacement <arg>             Replace Hive record \0x01
                                               and row delimiters (\n\r)
                                               from imported string fields
                                               with user-defined string
   --hive-drop-import-delims                   Drop Hive record \0x01 and
                                               row delimiters (\n\r) from
                                               imported string fields
   --hive-home <dir>                           Override $HIVE_HOME
   --hive-import                               Import tables into Hive
                                               (Uses Hive's default
                                               delimiters if none are
                                               set.)
   --hive-overwrite                            Overwrite existing data in
                                               the Hive table
   --hive-partition-key <partition-key>        Sets the partition key to
                                               use when importing to hive
   --hive-partition-value <partition-value>    Sets the partition value to
                                               use when importing to hive
   --hive-table <table-name>                   Sets the table name to use
                                               when importing to hive
   --map-column-hive <arg>                     Override mapping for
                                               specific column to hive
                                               types.

HBase arguments:
   --column-family <family>    Sets the target column family for the
                               import
   --hbase-bulkload            Enables HBase bulk loading
   --hbase-create-table        If specified, create missing HBase tables
   --hbase-row-key <col>       Specifies which input column to use as the
                               row key
   --hbase-table <table>       Import to <table> in HBase

HCatalog arguments:
   --hcatalog-database <arg>                        HCatalog database name
   --hcatalog-home <hdir>                           Override $HCAT_HOME
   --hcatalog-partition-keys <partition-key>        Sets the partition
                                                    keys to use when
                                                    importing to hive
   --hcatalog-partition-values <partition-value>    Sets the partition
                                                    values to use when
                                                    importing to hive
   --hcatalog-table <arg>                           HCatalog table name
   --hive-home <dir>                                Override $HIVE_HOME
   --hive-partition-key <partition-key>             Sets the partition key
                                                    to use when importing
                                                    to hive
   --hive-partition-value <partition-value>         Sets the partition
                                                    value to use when
                                                    importing to hive
   --map-column-hive <arg>                          Override mapping for
                                                    specific column to
                                                    hive types.

HCatalog import specific options:
   --create-hcatalog-table             Create HCatalog before import
   --drop-and-create-hcatalog-table    Drop and Create HCatalog before
                                       import
   --hcatalog-storage-stanza <arg>     HCatalog storage stanza for table
                                       creation

Accumulo arguments:
   --accumulo-batch-size <size>          Batch size in bytes
   --accumulo-column-family <family>     Sets the target column family for
                                         the import
   --accumulo-create-table               If specified, create missing
                                         Accumulo tables
   --accumulo-instance <instance>        Accumulo instance name.
   --accumulo-max-latency <latency>      Max write latency in milliseconds
   --accumulo-password <password>        Accumulo password.
   --accumulo-row-key <col>              Specifies which input column to
                                         use as the row key
   --accumulo-table <table>              Import to <table> in Accumulo
   --accumulo-user <user>                Accumulo user name.
   --accumulo-visibility <vis>           Visibility token to be applied to
                                         all rows imported
   --accumulo-zookeepers <zookeepers>    Comma-separated list of
                                         zookeepers (host:port)

Code generation arguments:
   --bindir <dir>                             Output directory for
                                              compiled objects
   --class-name <name>                        Sets the generated class
                                              name. This overrides
                                              --package-name. When
                                              combined with --jar-file,
                                              sets the input class.
   --escape-mapping-column-names <boolean>    Disable special characters
                                              escaping in column names
   --input-null-non-string <null-str>         Input null non-string
                                              representation
   --input-null-string <null-str>             Input null string
                                              representation
   --jar-file <file>                          Disable code generation; use
                                              specified jar
   --map-column-java <arg>                    Override mapping for
                                              specific columns to java
                                              types
   --null-non-string <null-str>               Null non-string
                                              representation
   --null-string <null-str>                   Null string representation
   --outdir <dir>                             Output directory for
                                              generated code
   --package-name <name>                      Put auto-generated classes
                                              in this package
```



#### 第一步：准备表数据

在node03的mysql中创建一个userdb database, 其中包含表：emp, emp_add和emp_conn。

表emp:

| **id** | **name** | **deg**      | **salary** | **dept** |
| ------ | -------- | ------------ | ---------- | -------- |
| 1201   | gopal    | manager      | 50,000     | TP       |
| 1202   | manisha  | Proof reader | 50,000     | TP       |
| 1203   | khalil   | php dev      | 30,000     | AC       |
| 1204   | prasanth | php dev      | 30,000     | AC       |
| 1205   | kranthi  | admin        | 20,000     | TP       |

表emp_add:

| **id** | **hno** | **street** | **city** |
| ------ | ------- | ---------- | -------- |
| 1201   | 288A    | vgiri      | jublee   |
| 1202   | 108I    | aoc        | sec-bad  |
| 1203   | 144Z    | pgutta     | hyd      |
| 1204   | 78B     | old city   | sec-bad  |
| 1205   | 720X    | hitec      | sec-bad  |

表emp_conn:

| **id** | **phno** | **email**       |
| ------ | -------- | --------------- |
| 1201   | 2356742  | gopal@tp.com    |
| 1202   | 1661663  | manisha@tp.com  |
| 1203   | 8887776  | khalil@ac.com   |
| 1204   | 9988774  | prasanth@ac.com |
| 1205   | 1231231  | kranthi@tp.com  |

建表语句如下：直接复制粘贴到node03的mysql命令行即可。

```sql
CREATE DATABASE /*!32312 IF NOT EXISTS*/`userdb` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `userdb`;

DROP TABLE IF EXISTS `emp`;

CREATE TABLE `emp` (
  `id` INT(11) DEFAULT NULL,
  `name` VARCHAR(100) DEFAULT NULL,
  `deg` VARCHAR(100) DEFAULT NULL,
  `salary` INT(11) DEFAULT NULL,
  `dept` VARCHAR(10) DEFAULT NULL,
  `create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_delete` BIGINT(20) DEFAULT '1'
) ENGINE=INNODB DEFAULT CHARSET=latin1;

INSERT  INTO `emp`(`id`,`name`,`deg`,`salary`,`dept`) VALUES (1201,'gopal','manager',50000,'TP'),(1202,'manisha','Proof reader',50000,'TP'),(1203,'khalil','php dev',30000,'AC'),(1204,'prasanth','php dev',30000,'AC'),(1205,'kranthi','admin',20000,'TP');

DROP TABLE IF EXISTS `emp_add`;

CREATE TABLE `emp_add` (
  `id` INT(11) DEFAULT NULL,
  `hno` VARCHAR(100) DEFAULT NULL,
  `street` VARCHAR(100) DEFAULT NULL,
  `city` VARCHAR(100) DEFAULT NULL,
  `create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_delete` BIGINT(20) DEFAULT '1'
) ENGINE=INNODB DEFAULT CHARSET=latin1;

INSERT  INTO `emp_add`(`id`,`hno`,`street`,`city`) VALUES (1201,'288A','vgiri','jublee'),(1202,'108I','aoc','sec-bad'),(1203,'144Z','pgutta','hyd'),(1204,'78B','old city','sec-bad'),(1205,'720X','hitec','sec-bad');

DROP TABLE IF EXISTS `emp_conn`;
CREATE TABLE `emp_conn` (
  `id` INT(100) DEFAULT NULL,
  `phno` VARCHAR(100) DEFAULT NULL,
  `email` VARCHAR(100) DEFAULT NULL,
  `create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_delete` BIGINT(20) DEFAULT '1'
) ENGINE=INNODB DEFAULT CHARSET=latin1;

INSERT  INTO `emp_conn`(`id`,`phno`,`email`) VALUES (1201,'2356742','gopal@tp.com'),(1202,'1661663','manisha@tp.com'),(1203,'8887776','khalil@ac.com'),(1204,'9988774','prasanth@ac.com'),(1205,'1231231','kranthi@tp.com');

```

#### 第二步：导入数据库表数据到HDFS

将MySQL中的emp表导入到HDFS

```sh
bin/sqoop import --connect jdbc:mysql://node03:3306/userdb --password 123456 --username root --table emp --m 1

## --m 1  表示使用1个maptask
```

如果成功执行，那么会得到下面的输出。

![image-20200314043443688](sqoop.assets/image-20200314043443688.png)

使用以下命令查看导入的数据,数据默认存放在了hdfs的/user/hadoop路径下，表的字段间的分隔符默认使用逗号","。

```sh
[hadoop@node03 conf]$ hdfs dfs -cat /user/hadoop/emp/part-m-00000
1201,gopal,manager,50000,TP,2020-03-14 12:21:03.0,2020-03-14 12:21:03.0,1
1202,manisha,Proof reader,50000,TP,2020-03-14 12:21:03.0,2020-03-14 12:21:03.0,1
1203,khalil,php dev,30000,AC,2020-03-14 12:21:03.0,2020-03-14 12:21:03.0,1
1204,prasanth,php dev,30000,AC,2020-03-14 12:21:03.0,2020-03-14 12:21:03.0,1
1205,kranthi,admin,20000,TP,2020-03-14 12:21:03.0,2020-03-14 12:21:03.0,1
```



#### 第三步：导入数据库表数据到HDFS指定目录

1. 使用参数 --target-dir来指定导出目录

2. 使用参数—delete-target-dir来判断导出目录是否存在，如果存在就删掉

导入数据：

```sh
sqoop import --connect jdbc:mysql://node03:3306/userdb --username root --password 123456 --delete-target-dir --table emp --target-dir /sqoop/emp --m 1
```

查看导入的数据：

```sh
[hadoop@node03 conf]$ hdfs dfs -text /sqoop/emp/part-m-00000 #使用cat也行
1201,gopal,manager,50000,TP,2020-03-14 12:21:03.0,2020-03-14 12:21:03.0,1
1202,manisha,Proof reader,50000,TP,2020-03-14 12:21:03.0,2020-03-14 12:21:03.0,1
1203,khalil,php dev,30000,AC,2020-03-14 12:21:03.0,2020-03-14 12:21:03.0,1
1204,prasanth,php dev,30000,AC,2020-03-14 12:21:03.0,2020-03-14 12:21:03.0,1
1205,kranthi,admin,20000,TP,2020-03-14 12:21:03.0,2020-03-14 12:21:03.0,1
```

#### 第四步：导入数据库表数据到HDFS指定目录并指定分隔符

```sh
sqoop import --connect jdbc:mysql://node03:3306/userdb --username root --password 123456 --delete-target-dir --table emp --target-dir /sqoop/emp2 --m 1 --fields-terminated-by '\t'
```

查看文件内容,是以"\t"作为分隔符的。

```sh
[hadoop@node03 conf]$ hdfs dfs -text /sqoop/emp2/part-m-00000
1201 gopal   manager 50000        TP 2020-03-14 12:21:03.0   2020-03-14 12:21:03.0   1
1202  manisha Proof reader 50000  TP 2020-03-14 12:21:03.0   2020-03-14 12:21:03.0   1
1203  khalil  php dev 30000       AC 2020-03-14 12:21:03.0   2020-03-14 12:21:03.0   1
1204  prasanth  php dev 30000     AC 2020-03-14 12:21:03.0   2020-03-14 12:21:03.0   1
1205  kranthi admin   20000       TP 2020-03-14 12:21:03.0   2020-03-14 12:21:03.0   1
```

 

#### 第五步：导入数据库表数据到Hive表（hive表已存在）

将我们mysql表当中的数据直接导入到hive表中的话，我们需要将hive的一个叫做hive-exec-1.1.0-cdh5.14.0.jar的jar包拷贝到sqoop的lib目录下

```sh
[hadoop@node03 ~]$ cp /kkb/install/hive-1.1.0-cdh5.14.2/lib/hive-exec-1.1.0-cdh5.14.2.jar /kkb/install/sqoop-1.4.6-cdh5.14.2/lib/
```

在hive中创建表：

```sql
hive (default)> create database sqooptohive;

hive (default)> use sqooptohive;

hive (sqooptohive)> create external table emp_hive(id int,name string,deg string,salary int ,dept string) row format delimited fields terminated by '\001';
```

将我们mysql当中的数据导入到hive表当中来：

```sh
sqoop import --connect jdbc:mysql://node03:3306/userdb --username root --password 123456 --table emp --fields-terminated-by '\001' --hive-import --hive-table sqooptohive.emp_hive --hive-overwrite --delete-target-dir --m 1
```

- --hive-overwrite表示，导入的数据会覆盖hive表中原先存在的数据

导入成功后，查看hive表数据：

```sql
hive (sqooptohive)> select * from emp_hive;
OK
emp_hive.id     emp_hive.name   emp_hive.deg    emp_hive.salary emp_hive.dept
1201    gopal   manager 50000   TP
1202    manisha Proof reader    50000   TP
1203    khalil  php dev 30000   AC
1204    prasanth        php dev 30000   AC
1205    kranthi admin   20000   TP
```

#### 第六步：导入数据库表数据到Hive表（hive表未存在）

将我们的mysql的表直接导入到hive表当中去

```sh
sqoop import --connect jdbc:mysql://node03:3306/userdb --username root --password 123456 --table emp_conn --hive-import -m 1 --hive-database sqooptohive;
```

通过上面这个命令，我们可以直接将我们mysql表当中的数据以及表结构一起倒入到hive当中去,--hive-database sqooptohive表示导入到哪个database。

查看效果：

```sql
hive (sqooptohive)> show tables;
OK
tab_name
emp_conn #
emp_hivesh
```



#### 第七步：导入数据库表数据到hbase

启动zookeeper和hbase

```sh
zkServer.sh start #三台机器都要执行这一行代码
start-hbase.sh #node01执行这一行代码
```

在mysql当中创建数据库以及数据库表并插入数据

```sql
CREATE DATABASE IF NOT EXISTS library;
USE library;
CREATE TABLE book(
    id INT(4) PRIMARY KEY NOT NULL AUTO_INCREMENT, 
    NAME VARCHAR(255) NOT NULL,
    price VARCHAR(255) NOT NULL
);
```

```sql
INSERT INTO book(NAME, price) VALUES('Lie Sporting', '30'); 
INSERT INTO book (NAME, price) VALUES('Pride & Prejudice', '70'); 
INSERT INTO book (NAME, price) VALUES('Fall of Giants', '50'); 

mysql> select * from book;
+----+-------------------+-------+
| id | NAME              | price |
+----+-------------------+-------+
|  1 | Lie Sporting      | 30    |
|  2 | Pride & Prejudice | 70    |
|  3 | Fall of Giants    | 50    |
+----+-------------------+-------+
```

将mysql表当中的数据导入HBase表当中去（只能指定一个列族）:

```sh
sqoop import \
--connect jdbc:mysql://node03:3306/library \
--username root \
--password 123456 \
--table book \
--columns "id,name,price" \
--column-family "info" \
--hbase-create-table \
--hbase-row-key "id" \
--hbase-table "hbase_book" \
--num-mappers 1 \
--split-by id
```

在HBase当中查看表数据

```sh
[hadoop@node03 install]$ hbase shell
```

```sh
hbase(main):002:0> scan 'hbase_book'
ROW           COLUMN+CELL                           
 1            column=info:name, timestamp=1584163926211, value=Lie Sporting     
 1            column=info:price, timestamp=1584163926211, value=30              
 2            column=info:name, timestamp=1584163926211, value=Pride & Prejudice
 2            column=info:price, timestamp=1584163926211, value=70              
 3            column=info:name, timestamp=1584163926211, value=Fall of Giants   
 3            column=info:price, timestamp=1584163926211, value=50              
```

#### 业务系统中表的分类

我们上面的七步都是进行了全表导入，但是有时候我们是不需要进行全表导入的，先来了解一下实际应用中，业务系统中表的分类：

第一大类：业务表

- 需要做增删改查的操作，如user表

第二大类：记录表 

- 比如日志记录表  这个表只会一直增加，不会修改，删除

第三类：码表 字典表

- 省市区县  一般数据量不大，而且不会变动

从上面三类表的描述可知：

1. 对于业务表，新添加的数据以及修改的数据都要导入过来，导入变化的数据，没变化的数据，导入之后再不要导入了
2. 对于记录表，新插入的数据需要导入过来，导入新增加的数据即可，导入过的数据再不要导入了
3. 对于码表，一般导入一次即可，有变更再及时导入即可

因此，可以看到全表导入的情况并不多，下面，我们就来讲讲如何进行非全表导入。

#### 第八步：导入数据库表的子集--where

sqoop可导入sql where语句的查询结果到hadoop的数据存储系统中。

例子：

查找表emp_add当中city字段的值为sec-bad的所有数据,并将这些数据导入到hdfs上面去

```sh
sqoop import --connect jdbc:mysql://node03:3306/userdb --username root --password 123456 --table emp_add --target-dir /sqoop/emp_add -m 1 --delete-target-dir --where "city = 'sec-bad'"

[hadoop@node03 ~]$ hdfs dfs -ls /sqoop/emp_add/ 
Found 2 items
-rw-r--r--   3 hadoop supergroup     0 2020-03-14 23:28 /sqoop/emp_add/_SUCCESS
-rw-r--r--   3 hadoop supergroup     210 2020-03-14 23:28 /sqoop/emp_add/part-m-00000

[hadoop@node03 ~]$ hdfs dfs -cat /sqoop/emp_add/part-m-00000
1202,108I,aoc,sec-bad,2020-03-14 12:21:03.0,2020-03-14 12:21:03.0,1
1204,78B,old city,sec-bad,2020-03-14 12:21:03.0,2020-03-14 12:21:03.0,1
1205,720X,hitec,sec-bad,2020-03-14 12:21:03.0,2020-03-14 12:21:03.0,1
#从上面结果可以看到，只存储了"city = 'sec-bad'"的数据
```

#### 第九步：导入数据库表的子集--query

我们还可以通过 –query参数来指定我们的sql语句，通过sql语句来过滤我们的数据进行导入。

注意事项：

1. 使用sql语句来进行查找是不能加参数--table 
2. 并且必须要添加--where条件，
3. 并且--where条件后面必须带一个$CONDITIONS 这个字符串，
4. 并且这个sql语句必须用单引号，不能用双引号

例子：

```sh
mysql> select * from emp_conn;
+------+---------+-----------------+---------------------+---------------------+--
| id   | phno    | email        | create_time         | update_time  | is_delete |
+------+---------+-----------------+---------------------+---------------------+--
| 1201 | 2356742 |gopal@tp.com  | 2020-03-14 12:21:03 | 2020-03-14 12:21:03 |  1 |
| 1202 | 1661663 |manisha@tp.com| 2020-03-14 12:21:03 | 2020-03-14 12:21:03 |  1 |
| 1203 | 8887776 |khalil@ac.com  | 2020-03-14 12:21:03 | 2020-03-14 12:21:03 |  1 |
| 1204 | 9988774 |prasanth@ac.com| 2020-03-14 12:21:03 | 2020-03-14 12:21:03|  1 |
| 1205 | 1231231 |kranthi@tp.com | 2020-03-14 12:21:03 | 2020-03-14 12:21:03|  1 |
+------+---------+-----------------+---------------------+---------------------+--


sqoop import --connect jdbc:mysql://node03:3306/userdb --username root --password 123456 --delete-target-dir -m 1 --query 'select phno from emp_conn where 1=1 and $CONDITIONS' --target-dir /sqoop/emp_conn 

[hadoop@node03 ~]$ hdfs dfs -ls /sqoop/emp_query/
Found 2 items
-rw-r--r--   3 hadoop supergroup     0 2020-03-14 23:37 /sqoop/emp_query/_SUCCESS
-rw-r--r--   3 hadoop supergroup     40 2020-03-14 23:37 /sqoop/emp_query/part-m-00000

[hadoop@node03 ~]$ hdfs dfs -cat /sqoop/emp_query/part-m-00000
2356742
1661663
8887776
9988774
1231231
```

#### 第十步：增量导入数据库表数据到HDFS

在实际工作当中，数据的导入，很多时候都是只需要导入增量数据即可，并不需要将表中的数据全部导入到hive或者hdfs当中去，肯定会出现重复的数据的状况，所以我们一般都是选用一些字段进行增量的导入，为了支持增量的导入，sqoop也给我们考虑到了这种情况并且支持增量的导入数据

增量导入是仅导入新添加的表中的行的技术。

下面的语法用于Sqoop导入命令增量选项。

```sh
--incremental <mode>  --check-column <column name>  --last value <last check column value> 
```

```sh
Incremental import arguments:
   --check-column <column>        Source column to check for incremental
                                  change 
                                  #通过哪一列来检查新增的改变（检查的列）
   --incremental <import-type>    Define an incremental import of type
                                  'append' or 'lastmodified'
                                  #指定导入类型，append为追加
   --last-value <value>           Last imported value in the incremental
                                  check column
                                  #最后一个导入的检查的列的值
```

###### 例子1（这种做法很鸡肋）：

假如我以id这一列作为判断是否有新增数据的列(--check-column)，上一次导入数据导到了id列值为1203那里，而且表中仅仅会有新增数据的操作，没有更新update数据的操作。

那么，我们可以进行如下导入新增数据的操作：

注意：增量导入的时候，一定不能加参数--delete-target-dir否则会报错

```sql
mysql> select * from emp;
+------+----------+--------------+--------+------+---------------------+--------------
| id   | name     | deg          | salary | dept | create_time         | update_time         | is_delete |
+------+----------+--------------+--------+------+---------------------+--------------
| 1201 | gopal    | manager      |  50000 | TP   | 2020-03-14 12:21:03 | 2020-03-14 12:21:03 |         1 |
| 1202 | manisha  | Proof reader |  50000 | TP   | 2020-03-14 12:21:03 | 2020-03-14 12:21:03 |         1 |
| 1203 | khalil   | php dev      |  30000 | AC   | 2020-03-14 12:21:03 | 2020-03-14 12:21:03 |         1 |
| 1204 | prasanth | php dev      |  30000 | AC   | 2020-03-14 12:21:03 | 2020-03-14 12:21:03 |         1 |
| 1205 | kranthi  | admin        |  20000 | TP   | 2020-03-14 12:21:03 | 2020-03-14 12:21:03 |         1 |
+------+----------+--------------+--------+------+---------------------+-------------
```

```sh
sqoop import --connect jdbc:mysql://node03:3306/userdb --username root --password 123456 --table emp --incremental append --check-column id --last-value 1203 --m 1 --target-dir /sqoop/increment

[hadoop@node03 ~]$ hdfs dfs -cat /sqoop/increment/part-m-00000    
1204,prasanth,php dev,30000,AC,2020-03-14 12:21:03.0,2020-03-14 12:21:03.0,1
1205,kranthi,admin,20000,TP,2020-03-14 12:21:03.0,2020-03-14 12:21:03.0,1
```

 这种方法虽然实现了增量导入，但是很鸡肋，因为我们怎么上一次导入的id列的最后一个值是什么？而且这种增量导入还是在没有update操作的基础上实现的，实际中很可能是有update数据操作的，有update的话，又要怎么实现增量导入，这时候就用到了sql的TIMESTAMP属性了。

###### 例子2：

我们在创建emp表的时候，添加了下列两个字段，

create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

update_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE 

分别用来记录insert时间以及update时间，我们可以利用--where来设定查询的时间范围，从而实现更强大的增量导入，同时导入insert新增的数据和更新update过的数据。

下面的代码块可以实现导入新增以及更新过的数据：

```sh
sqoop import --connect jdbc:mysql://node03:3306/userdb --username root --password 123456 --table emp --incremental append --where "update_time > '2020-03-14 12:21:02' and is_delete='1' and update_time < '2020-03-14 12:21:05'" --target-dir /sqoop/incement2 --check-column id --m 1

[hadoop@node03 ~]$ hdfs dfs -cat /sqoop/incement2/part-m-00000
1201,gopal,manager,50000,TP,2020-03-14 12:21:03.0,2020-03-14 12:21:03.0,1
1202,manisha,Proof reader,50000,TP,2020-03-14 12:21:03.0,2020-03-14 12:21:03.0,1
1203,khalil,php dev,30000,AC,2020-03-14 12:21:03.0,2020-03-14 12:21:03.0,1
1204,prasanth,php dev,30000,AC,2020-03-14 12:21:03.0,2020-03-14 12:21:03.0,1
1205,kranthi,admin,20000,TP,2020-03-14 12:21:03.0,2020-03-14 12:21:03.0,1
```

下面的代码块可以实现导入新增数据(不包括更新过的数据）：

```sql
sqoop import --connect jdbc:mysql://node03:3306/userdb --username root --password 123456 --table emp --incremental append --where "create_time > '2020-03-14 12:21:02' and is_delete='1' and create_time < '2020-03-14 12:21:05'" --target-dir /sqoop/incement2 --check-column id --m 1
```



#### 作业：增量导入数据到hive表中该如何实现？(TODO)

 

#### 面试题：如何解决减量数据？？？

假设我们已经将数据库表的数据导入到hdfs了，那么如果数据库表又删除某些数据，如何解决？我们要删掉导入到hdfs的对应部分数据吗？

当然不是。在业务库表中，一般都是做假删除的，比如说添加一个is_delete字段来判断某个记录（行）是不是已被删除的，并不是真的删除。那么若数据库表的数据被删了，那么对应的is_delete字段的对应值就会发生变化，比如说从1变成了0，那么update_time就会发生变化。既然update_time就会发生了变化，我们就可以把减量数据当成更新的数据来处理就行了，只不过是做了删除标记的更新数据罢了。

#### 思考问题

问题：一行数据被update前，导入到hdfs过一次，后来这行数据被update了，然后该行数据又被导入hdfs了，那么我们就导入了两条同一行的数据（虽然部分值可能不一样）。我们要怎么更新我们的hdfs中的这行数据，怎么找到这两条数据？

解决：使用数据仓库的拉链表来解决。

## Sqoop导出数据

#### 从HDFS文件导出数据到mysql

导出前，目标表必须存在于目标数据库中。要导出到数据库的数据内容及路径如下

```sh
[hadoop@node03 ~]$ hdfs dfs -ls /sqoop/emp
Found 2 items
-rw-r--r--   3 hadoop supergroup          0 2020-03-14 12:49 /sqoop/emp/_SUCCESS
-rw-r--r--   3 hadoop supergroup        381 2020-03-14 12:49 /sqoop/emp/part-m-00000

[hadoop@node03 ~]$ hdfs dfs -cat /sqoop/emp/part-m-00000
1201,gopal,manager,50000,TP,2020-03-14 12:21:03.0,2020-03-14 12:21:03.0,1
1202,manisha,Proof reader,50000,TP,2020-03-14 12:21:03.0,2020-03-14 12:21:03.0,1
1203,khalil,php dev,30000,AC,2020-03-14 12:21:03.0,2020-03-14 12:21:03.0,1
1204,prasanth,php dev,30000,AC,2020-03-14 12:21:03.0,2020-03-14 12:21:03.0,1
1205,kranthi,admin,20000,TP,2020-03-14 12:21:03.0,2020-03-14 12:21:03.0,1
```

node03创建mysql表。

```sql
CREATE TABLE `emp_out` (
    `id` INT(11) DEFAULT NULL,
    `name` VARCHAR(100) DEFAULT NULL,
    `deg` VARCHAR(100) DEFAULT NULL,
    `salary` INT(11) DEFAULT NULL,
    `dept` VARCHAR(10) DEFAULT NULL,
    `create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `update_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `is_delete` BIGINT(20) DEFAULT '1'
) ENGINE=INNODB DEFAULT CHARSET=utf8;
```

通过kkb来实现数据的导出，将hdfs的数据导出到mysql当中去

```sh
sqoop export --connect jdbc:mysql://node03:3306/userdb --username root --password 123456 --table emp_out --export-dir /sqoop/emp --input-fields-terminated-by ","
```

查看emp_out表是否确实存在数据：

```sh
mysql> select * from emp_out;
+------+----------+--------------+--------+------+---------------------+----------
| id   | name     | deg          | salary | dept | create_time         | update_ti
+------+----------+--------------+--------+------+---------------------+----------
| 1205 | kranthi  | admin        |  20000 | TP   | 2020-03-14 12:21:03 | 2020-03-1
| 1201 | gopal    | manager      |  50000 | TP   | 2020-03-14 12:21:03 | 2020-03-1
| 1202 | manisha  | Proof reader |  50000 | TP   | 2020-03-14 12:21:03 | 2020-03-1
| 1203 | khalil   | php dev      |  30000 | AC   | 2020-03-14 12:21:03 | 2020-03-1
| 1204 | prasanth | php dev      |  30000 | AC   | 2020-03-14 12:21:03 | 2020-03-1
+------+----------+--------------+--------+------+---------------------+----------

#数据还有一部分没有复制粘贴过来
```



#### 从Hbase表导出数据到mysql

注意：sqoop不支持我们直接将HBase当中的数据导出，所以我们可以通过以下的转换进行导出。

Hbase→hive外部表→hive内部表→通过sqoop→mysql

需求：将hbase_book这张表当中的数据导出到mysql当中来

**第一步：**创建hive外部表，映射hbase当中的hbase_book表

```sql
nohup hive --service hiveserver2 2>&1 &
beeline
!connect jdbc:hive2://node03:10000

0: jdbc:hive2://node03:10000> create database course;

CREATE EXTERNAL TABLE course.hbase2mysql (id int,name string,price int)
STORED BY 'org.apache.hadoop.hive.hbase.HBaseStorageHandler'
WITH SERDEPROPERTIES ("hbase.columns.mapping" =":key,info:name, info:price")
TBLPROPERTIES( "hbase.table.name" = "hbase_book",
              "hbase.mapred.output.outputtable" = "hbase2mysql");
 
0: jdbc:hive2://node03:10000> select * from hbase2mysql;
+-----------------+--------------------+--------------------+--+
| hbase2mysql.id  |  hbase2mysql.name  | hbase2mysql.price  |
+-----------------+--------------------+--------------------+--+
| 1               | Lie Sporting       | 30                 |
| 2               | Pride & Prejudice  | 70                 |
| 3               | Fall of Giants     | 50                 |
+-----------------+--------------------+--------------------+--+
```

**第二步：**创建hive内部表

```sql
0: jdbc:hive2://node03:10000> CREATE TABLE course.hbase2mysqlin(id int,name string,price int);
```

**第三步：**将外部表数据插入到内部表

```sql
0: jdbc:hive2://node03:10000> insert overwrite table course.hbase2mysqlin select * from course.hbase2mysql;

0: jdbc:hive2://node03:10000> select * from hbase2mysqlin;
+-------------------+---------------------+----------------------+--+
| hbase2mysqlin.id  | hbase2mysqlin.name  | hbase2mysqlin.price  |
+-------------------+---------------------+----------------------+--+
| 1                 | Lie Sporting        | 30                   |
| 2                 | Pride & Prejudice   | 70                   |
| 3                 | Fall of Giants      | 50                   |
+-------------------+---------------------+----------------------+--+
```

**第四步：**清空mysql表数据,将book表数据清空

清空book是为了做前后对比，等下要将hive内部表的数据导出到mysql的book表中，清空可以验证是否导出成功。

```sql
mysql> use library;
mysql> TRUNCATE TABLE book;

mysql> select * from book; 
Empty set (0.00 sec)
```

**第五步：**获得内部表的数据存放在hdfs的路径

```sql
0: jdbc:hive2://node03:10000> desc formatted  hbase2mysqlin;

Location: hdfs://node01:8020/user/hive/warehouse/course.db/hbase2mysqlin
```

**第六步：**执行sqoop导出hive内部表数据到mysql

```sh
sqoop export -connect jdbc:mysql://node03:3306/library -username root -password 123456 -table book -export-dir /user/hive/warehouse/course.db/hbase2mysqlin --input-fields-terminated-by '\001' --input-null-string '\\N' --input-null-non-string '\\N';
```

--input-null-string '\\\N' 表示如果导入的数据是空值，而且是字符串类型的空值，则使用\N来表示。

--input-null-non-string '\\\N' 表示如果导入的数据是空值，且不是字符串类型，则使用\N来表示。

**第七步：**查看效果：

```sql
mysql> select * from book; 
+----+-------------------+-------+
| id | NAME              | price |
+----+-------------------+-------+
|  1 | Lie Sporting      | 30    |
|  2 | Pride & Prejudice | 70    |
|  3 | Fall of Giants    | 50    |
+----+-------------------+-------+
3 rows in set (0.00 sec)
```



## Sqoop job作业（了解即可）

Sqoop作业：将事先定义好的数据导入导出任务按照指定流程运行。Sqoop作业不太常用，了解即可，一般使用Linux shell脚本（将sqoop语句写入脚本中，然后运行脚本）。

创建Sqoop作业的语法：

```sh
$ sqoop job (generic-args)  (job-args)    [-- [subtool-name] (subtool-args)]     
$ sqoop-job (generic-args)  (job-args)    [-- [subtool-name] (subtool-args)]      
```

创建Sqoop作业示例：

在这里，我们创建一个名为myjob，将RDBMS表的数据导入到HDFS中。

```sh
[hadoop@node03 ~]$ sqoop job --create myjob -- import --connect jdbc:mysql://node03:3306/userdb --username root --password 123456 --table emp --target-dir /sqoopJob/myjob --delete-target-dir --m 1
```

注意：

- 创建job时，-- import是不连在一起的，一定要分开，不能写成--import
- 要加上--m 1，否则等会运行job时会报错：ERROR tool.ImportTool: Import failed: No primary key could be found for table emp. Please specify one with --split-by or perform a sequential import with '-m 1'. 可能是因为没有primary key才需要加--m 1

显示存在的作业 (--list)

```sh
[hadoop@node03 ~]$ sqoop job --list

Available jobs:
  myjob
```

检查作业(--show)

**‘--show’** 参数用于检查或验证特定的工作，及其详细信息。

```sh
[hadoop@node03 ~]$ sqoop job --show myjob
Enter password:  #需要输入密码(hadoop用户的密码)才能查看job详细信息
Job: myjob
Tool: import
Options:  
----------------------------  #显示了工具Tool和参数options
reset.onemapper = false
... #中间省略了
hbase.create.table = false
codegen.compile.dir = /tmp/sqoop-hadoop/compile/2a2a6614296865eedd8f26a8d8ea0636
codegen.output.delimiters.escape = 0
db.connect.string = jdbc:mysql://node03:3306/userdb
```

执行作业 (--exec)

```sh
[hadoop@node03 ~]$ sqoop job --exec myjob  

#查看运行作业后的效果。
[hadoop@node03 ~]$ hdfs dfs -cat /sqoopJob/myjob/part-m-00000
1201,gopal,manager,50000,TP,2020-03-14 12:21:03.0,2020-03-14 12:21:03.0,1
1202,manisha,Proof reader,50000,TP,2020-03-14 12:21:03.0,2020-03-14 12:21:03.0,1
1203,khalil,php dev,30000,AC,2020-03-14 12:21:03.0,2020-03-14 12:21:03.0,1
1204,prasanth,php dev,30000,AC,2020-03-14 12:21:03.0,2020-03-14 12:21:03.0,1
1205,jimmy,admin,20000,TP,2020-03-14 12:21:03.0,2020-03-15 01:27:17.0,1
```

 

## Sqoop常用命令及参数(TODO)

### 常用命令列举

这里给大家列出来了一部分Sqoop操作时的常用参数，以供参考，需要深入学习的可以参看对应类的源代码。

| **序号** | **命令**          | **类**              | **说明**                                                     |
| -------- | ----------------- | ------------------- | ------------------------------------------------------------ |
| 1        | import            | ImportTool          | 将数据导入到集群                                             |
| 2        | export            | ExportTool          | 将集群数据导出                                               |
| 3        | codegen           | CodeGenTool         | 获取数据库中某张表数据生成Java并打包Jar                      |
| 4        | create-hive-table | CreateHiveTableTool | 创建Hive表                                                   |
| 5        | eval              | EvalSqlTool         | 查看SQL执行结果                                              |
| 6        | import-all-tables | ImportAllTablesTool | 导入某个数据库下所有表到HDFS中                               |
| 7        | job               | JobTool             | 用来生成一个sqoop的任务，生成后，该任务并不执行，除非使用命令执行该任务。 |
| 8        | list-databases    | ListDatabasesTool   | 列出所有数据库名                                             |
| 9        | list-tables       | ListTablesTool      | 列出某个数据库下所有表                                       |
| 10       | merge             | MergeTool           | 将HDFS中不同目录下面的数据合在一起，并存放在指定的目录中     |
| 11       | metastore         | MetastoreTool       | 记录sqoop job的元数据信息，如果不启动metastore实例，则默认的元数据存储目录为：~/.sqoop，如果要更改存储目录，可以在配置文件sqoop-site.xml中进行更改。 |
| 12       | help              | HelpTool            | 打印sqoop帮助信息                                            |
| 13       | version           | VersionTool         | 打印sqoop版本信息                                            |

### 命令&参数详解

刚才列举了一些Sqoop的常用命令，对于不同的命令，有不同的参数，让我们来一一列举说明。

首先来我们来介绍一下公用的参数，所谓公用参数，就是大多数命令都支持的参数。

##### 1、公用参数：数据库连接

| **序号** | **参数**             | **说明**               |
| -------- | -------------------- | ---------------------- |
| 1        | --connect            | 连接关系型数据库的URL  |
| 2        | --connection-manager | 指定要使用的连接管理类 |
| 3        | --driver             | JDBC的driver class     |
| 4        | --help               | 打印帮助信息           |
| 5        | --password           | 连接数据库的密码       |
| 6        | --username           | 连接数据库的用户名     |
| 7        | --verbose            | 在控制台打印出详细信息 |

##### 2、公用参数：import

| **序号** | **参数**                         | **说明**                                                     |
| -------- | -------------------------------- | ------------------------------------------------------------ |
| 1        | --enclosed-by  `<char>`            | 给字段值前后加上指定的字符                                   |
| 2        | --escaped-by  `<char>`             | 对字段中的双引号加转义符                                     |
| 3        | --fields-terminated-by  `<char>`   | 设定每个字段是以什么符号作为结束，默认为逗号                 |
| 4        | --lines-terminated-by  `<char>`    | 设定每行记录之间的分隔符，默认是\n                           |
| 5        | --mysql-delimiters               | Mysql默认的分隔符设置，字段之间以逗号分隔，行之间以\n分隔，默认转义符是\，字段值以单引号包裹。 |
| 6        | --optionally-enclosed-by  `<char>` | 给带有双引号或单引号的字段值前后加上指定字符。               |

##### 3、公用参数：export

| **序号** | **参数**                               | **说明**                                   |
| -------- | -------------------------------------- | ------------------------------------------ |
| 1        | --input-enclosed-by  `<char> `           | 对字段值前后加上指定字符                   |
| 2        | --input-escaped-by  `<char>`             | 对含有转移符的字段做转义处理               |
| 3        | --input-fields-terminated-by  `<char>`   | 字段之间的分隔符                           |
| 4        | --input-lines-terminated-by  `<char>`    | 行之间的分隔符                             |
| 5        | --input-optionally-enclosed-by  `<char>` | 给带有双引号或单引号的字段前后加上指定字符 |

##### 4、公用参数：hive

| **序号** | **参数**                         | **说明**                                                  |
| -------- | -------------------------------- | --------------------------------------------------------- |
| 1        | --hive-delims-replacement  `<arg>` | 用自定义的字符串替换掉数据中的\r\n和\013 \010等字符       |
| 2        | --hive-drop-import-delims        | 在导入数据到hive时，去掉数据中的\r\n\013\010这样的字符    |
| 3        | --map-column-hive  `<map>`         | 生成hive表时，可以更改生成字段的数据类型                  |
| 4        | --hive-partition-key             | 创建分区，后面直接跟分区名，分区字段的默认类型为string    |
| 5        | --hive-partition-value  `<v>`      | 导入数据时，指定某个分区的值                              |
| 6        | --hive-home  `<dir>`               | hive的安装目录，可以通过该参数覆盖之前默认配置的目录      |
| 7        | --hive-import                    | 将数据从关系数据库中导入到hive表中                        |
| 8        | --hive-overwrite                 | 覆盖掉在hive表中已经存在的数据                            |
| 9        | --create-hive-table              | 默认是false，即，如果目标表已经存在了，那么创建任务失败。 |
| 10       | --hive-table                     | 后面接要创建的hive表,默认使用MySQL的表名                  |
| 11       | --table                          | 指定关系数据库的表名                                      |

 

公用参数介绍完之后，我们来按照命令介绍命令对应的特有参数。

##### 5、命令&参数：import

将关系型数据库中的数据导入到HDFS（包括Hive，HBase）中，如果导入的是Hive，那么当Hive中没有对应表时，则自动创建。

**1)** **命令：**

如：导入数据到hive中

  $ bin/sqoop import \  --connect jdbc:mysql://node03:3306/userdb  \  --username root \  --password 123456 \  --table emp \  --hive-import  

 

如：增量导入数据到hive中，mode=append

  append导入：  $  bin/sqoop import \  --connect  jdbc:mysql://node03:3306/userdb \  --username  root \  --password  123456 \  --table  emp \  --num-mappers  1 \  --fields-terminated-by  "\t" \  --target-dir  /user/hive/warehouse/emp \  --check-column  id \  --incremental  append \  --last-value  3  

易错提醒：append不能与--hive-等参数同时使用（Append mode for hive imports is not yet supported. Please remove the parameter --append-mode）

 

如：增量导入数据到hdfs中，mode=lastmodified

  先在mysql中建表并插入几条数据： 

```sql
 mysql> create table  company.staff_timestamp(id int(4), name varchar(255), sex varchar(255),  last_modified timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE  CURRENT_TIMESTAMP);  mysql> insert into  company.staff_timestamp (id, name, sex) values(1, 'AAA', 'female');  
 
 mysql> insert into  company.staff_timestamp (id, name, sex) values(2, 'BBB', 'female');  
 
 #先导入一部分数据：  
 bin/sqoop import  --connect  jdbc:mysql://node03:3306/userdb  --username  root --password  123456   --table  emp_conn  --delete-target-dir    --m  1  
 #再增量导入一部分数据：  
 
 mysql> insert into  company.staff_timestamp (id, name, sex) values(3, 'CCC', 'female');  
 
 bin/sqoop import  --connect  jdbc:mysql://node03:3306/userdb --username  root --password  123456  --table  emp_conn  --check-column  last_modified --incremental  lastmodified --last-value  "2018-0-28 22:20:38"  --m  1  --append  
```

易错提醒：使用lastmodified方式导入数据要指定增量数据是要--append（追加）还是要--merge-key（合并）

易错提醒：--incremental lastmodified模式下，last-value指定的值是会包含于增量导入的数据中。

**2)** **参数：**

| **序号** | **参数**                         | **说明**                                                     |
| -------- | -------------------------------- | ------------------------------------------------------------ |
| 1        | --append                         | 将数据追加到HDFS中已经存在的DataSet中，如果使用该参数，sqoop会把数据先导入到临时文件目录，再合并。 |
| 2        | --as-avrodatafile                | 将数据导入到一个Avro数据文件中                               |
| 3        | --as-sequencefile                | 将数据导入到一个sequence文件中                               |
| 4        | --as-textfile                    | 将数据导入到一个普通文本文件中                               |
| 5        | --boundary-query  `<statement>`    | 边界查询，导入的数据为该参数的值（一条sql语句）所执行的结果区间内的数据。 |
| 6        | --columns `<col1, col2,  col3>`    | 指定要导入的字段                                             |
| 7        | --direct                         | 直接导入模式，使用的是关系数据库自带的导入导出工具，以便加快导入导出过程。 |
| 8        | --direct-split-size              | 在使用上面direct直接导入的基础上，对导入的流按字节分块，即达到该阈值就产生一个新的文件 |
| 9        | --inline-lob-limit               | 设定大对象数据类型的最大值                                   |
| 10       | --m或–num-mappers                | 启动N个map来并行导入数据，默认4个。                          |
| 11       | --query或--e `<statement>`         | 将查询结果的数据导入，使用时必须伴随参--target-dir，--hive-table，如果查询中有where条件，则条件后必须加上$CONDITIONS关键字 |
| 12       | --split-by `<column-name>`         | 按照某一列来切分表的工作单元，不能与--autoreset-to-one-mapper连用（请参考官方文档） |
| 13       | --table `<table-name>`             | 关系数据库的表名                                             |
| 14       | --target-dir `<dir>`               | 指定HDFS路径                                                 |
| 15       | --warehouse-dir `<dir>`            | 与14参数不能同时使用，导入数据到HDFS时指定的目录             |
| 16       | --where                          | 从关系数据库导入数据时的查询条件                             |
| 17       | --z或--compress                  | 允许压缩                                                     |
| 18       | --compression-codec              | 指定hadoop压缩编码类，默认为gzip(Use Hadoop codec  default gzip) |
| 19       | --null-string  `<null-string`>     | string类型的列如果null，替换为指定字符串                     |
| 20       | --null-non-string  `<null-string>` | 非string类型的列如果null，替换为指定字符串                   |
| 21       | --check-column `<col> `            | 作为增量导入判断的列名                                       |
| 22       | --incremental `<mode>`             | mode：append或lastmodified                                   |
| 23       | --last-value `<value>`             | 指定某一个值，用于标记增量导入的位置                         |

##### 6、命令&参数：export

从HDFS（包括Hive和HBase）中奖数据导出到关系型数据库中。

**1)** **命令：**

**如：**

  $ bin/sqoop export \  --connect jdbc:mysql://node03:3306/userdb  \  --username root \  --password 123456 \  --table emp_add \  --export-dir /user/company \  --input-fields-terminated-by  "\t" \  --num-mappers 1  

 

**2)** **参数：**

| **序号** | **参数**                               | **说明**                                                     |
| -------- | -------------------------------------- | ------------------------------------------------------------ |
| 1        | --direct                               | 利用数据库自带的导入导出工具，以便于提高效率                 |
| 2        | --export-dir  `<dir>`                    | 存放数据的HDFS的源目录                                       |
| 3        | -m或--num-mappers  `<n>`                 | 启动N个map来并行导入数据，默认4个                            |
| 4        | --table  `<table-name>`                  | 指定导出到哪个RDBMS中的表                                    |
| 5        | --update-key  `<col-name>`               | 对某一列的字段进行更新操作                                   |
| 6        | --update-mode  `<mode>`                  | updateonly  allowinsert(默认)                                |
| 7        | --input-null-string  `<null-string>`     | 请参考import该类似参数说明                                   |
| 8        | --input-null-non-string  `<null-string>` | 请参考import该类似参数说明                                   |
| 9        | --staging-table  `<staging-table-name>`  | 创建一张临时表，用于存放所有事务的结果，然后将所有事务结果一次性导入到目标表中，防止错误。 |
| 10       | --clear-staging-table                  | 如果第9个参数非空，则可以在导出操作执行前，清空临时事务结果表 |

 

##### 7、命令&参数：codegen

将关系型数据库中的表映射为一个Java类，在该类中有各列对应的各个字段。

如：

  $ bin/sqoop codegen \  --connect jdbc:mysql://node03:3306/userdb  \  --username root \  --password 123456 \  --table emp_add \  --bindir /home/admin/Desktop/staff  \  --class-name Staff \  --fields-terminated-by  "\t"  

 

| **序号** | **参数**                            | **说明**                                                     |
| -------- | ----------------------------------- | ------------------------------------------------------------ |
| 1        | --bindir  `<dir>`                     | 指定生成的Java文件、编译成的class文件及将生成文件打包为jar的文件输出路径 |
| 2        | --class-name  `<name>`                | 设定生成的Java文件指定的名称                                 |
| 3        | --outdir  `<dir>`                     | 生成Java文件存放的路径                                       |
| 4        | --package-name `<name>`             | 包名，如com.z，就会生成com和z两级目录                        |
| 5        | --input-null-non-string  `<null-str>` | 在生成的Java文件中，可以将null字符串或者不存在的字符串设置为想要设定的值（例如空字符串） |
| 6        | --input-null-string  `<null-str>`     | 将null字符串替换成想要替换的值（一般与5同时使用）            |
| 7        | --map-column-java `<arg>`             | 数据库字段在生成的Java文件中会映射成各种属性，且默认的数据类型与数据库类型保持对应关系。该参数可以改变默认类型，例如：--map-column-java  id=long, name=String |
| 8        | --null-non-string  `<null-str>`       | 在生成Java文件时，可以将不存在或者null的字符串设置为其他值   |
| 9        | --null-string `<null-str>`            | 在生成Java文件时，将null字符串设置为其他值（一般与8同时使用） |
| 10       | --table `<table-name>`                | 对应关系数据库中的表名，生成的Java文件中的各个属性与该表的各个字段一一对应 |

##### 8、命令&参数：create-hive-table

生成与关系数据库表结构对应的hive表结构。

**命令：**

如：

  $  bin/sqoop create-hive-table \  --connect jdbc:mysql://node03:3306/userdb  \  --username root \  --password 123456 \  --table emp_add \  --hive-table emp_add  

**参数：**

| **序号** | **参数**            | **说明**                                              |
| -------- | ------------------- | ----------------------------------------------------- |
| 1        | --hive-home  `<dir>`  | Hive的安装目录，可以通过该参数覆盖掉默认的Hive目录    |
| 2        | --hive-overwrite    | 覆盖掉在Hive表中已经存在的数据                        |
| 3        | --create-hive-table | 默认是false，如果目标表已经存在了，那么创建任务会失败 |
| 4        | --hive-table        | 后面接要创建的hive表                                  |
| 5        | --table             | 指定关系数据库的表名                                  |

##### 9、命令&参数：eval

可以快速的使用SQL语句对关系型数据库进行操作，经常用于在import数据之前，了解一下SQL语句是否正确，数据是否正常，并可以将结果显示在控制台。

**命令：**

如：

  $  bin/sqoop eval \  --connect jdbc:mysql://node03:3306/userdb  \  --username root \  --password 123456 \  --query "SELECT * FROM  emp"  

**参数：**

| **序号** | **参数**     | **说明**          |
| -------- | ------------ | ----------------- |
| 1        | --query或--e | 后跟查询的SQL语句 |

 

##### 10、命令&参数：import-all-tables

可以将RDBMS中的所有表导入到HDFS中，每一个表都对应一个HDFS目录

**命令：**

如：

  $  bin/sqoop import-all-tables \  --connect jdbc:mysql://node03:3306/userdb  \  --username root \  --password 123456 \  --warehouse-dir /all_tables  

 

**参数：**

| **序号** | **参数**                 | **说明**                               |
| -------- | ------------------------ | -------------------------------------- |
| 1        | --as-avrodatafile        | 这些参数的含义均和import对应的含义一致 |
| 2        | --as-sequencefile        |                                        |
| 3        | --as-textfile            |                                        |
| 4        | --direct                 |                                        |
| 5        | --direct-split-size  `<n>` |                                        |
| 6        | --inline-lob-limit  `<n>`  |                                        |
| 7        | --m或—num-mappers  `<n>`   |                                        |
| 8        | --warehouse-dir  `<dir>`   |                                        |
| 9        | -z或--compress           |                                        |
| 10       | --compression-codec      |                                        |

 

##### 11、命令&参数：job

用来生成一个sqoop任务，生成后不会立即执行，需要手动执行。

**命令：**

如：

  $ bin/sqoop job \   --create myjob -- import-all-tables \   --connect jdbc:mysql://node03:3306/userdb \   --username root \   --password 123456  $ bin/sqoop job \  --list  $ bin/sqoop job \  --exec myjob  

易错提醒：注意import-all-tables和它左边的--之间有一个空格

易错提醒：如果需要连接metastore，则--meta-connect jdbc:hsqldb:hsql://node03:16000/sqoop

参数：

| **序号** | **参数**                   | **说明**                 |
| -------- | -------------------------- | ------------------------ |
| 1        | --create  `<job-id>`         | 创建job参数              |
| 2        | --delete  `<job-id>`         | 删除一个job              |
| 3        | --exec  `<job-id>`           | 执行一个job              |
| 4        | --help                     | 显示job帮助              |
| 5        | --list                     | 显示job列表              |
| 6        | --meta-connect  `<jdbc-uri>` | 用来连接metastore服务    |
| 7        | --show  `<job-id>`           | 显示一个job的信息        |
| 8        | --verbose                  | 打印命令运行时的详细信息 |

易错提醒：在执行一个job时，如果需要手动输入数据库密码，可以做如下优化

```  <property>       <name>sqoop.metastore.client.record.password</name>       <value>true</value>       <description>If true, allow saved  passwords in the metastore.</description>  </property>  ```

 

##### 12、命令&参数：list-databases

**命令：**

如：

  $  bin/sqoop list-databases \  --connect jdbc:mysql://node03:3306/userdb  \  --username root \  --password 123456  

 

**参数：**与公用参数一样

##### 13、命令&参数：list-tables

**命令：**

如：

  $ bin/sqoop list-tables \  --connect jdbc:mysql://node03:3306/userdb  \  --username root \  --password 123456  

**参数：**与公用参数一样

##### 14、命令&参数：merge

将HDFS中不同目录下面的数据合并在一起并放入指定目录中

数据环境：

  new_staff  1    AAA    male  2    BBB    male  3    CCC    male  4    DDD    male  old_staff  1    AAA    female  2    CCC    female  3    BBB    female  6    DDD    female  

易错提醒：上边数据的列之间的分隔符应该为\t，行与行之间的分割符为\n，如果直接复制，请检查之。

**命令：**

如：

  创建JavaBean：  $  bin/sqoop codegen \  --connect  jdbc:mysql://node03:3306/userdb \  --username  root \  --password  123456 \  --table  emp_conn \  --bindir  /home/admin/Desktop/staff \  --class-name  EmpConn \  --fields-terminated-by  "\t"     开始合并：  $  bin/sqoop merge \  --new-data  /test/new/ \  --onto  /test/old/ \  --target-dir  /test/merged \  --jar-file  /home/admin/Desktop/staff/EmpConn.jar \  --class-name  Staff \  --merge-key  id  结果：  1    AAA MALE  2    BBB MALE  3    CCC MALE  4    DDD MALE  6    DDD FEMALE  

 

参数：

| **序号** | **参数**              | **说明**                                               |
| -------- | --------------------- | ------------------------------------------------------ |
| 1        | --new-data  `<path>`    | HDFS  待合并的数据目录，合并后在新的数据集中保留       |
| 2        | --onto  `<path>`        | HDFS合并后，重复的部分在新的数据集中被覆盖             |
| 3        | --merge-key  `<col>`    | 合并键，一般是主键ID                                   |
| 4        | --jar-file  `<file>`    | 合并时引入的jar包，该jar包是通过Codegen工具生成的jar包 |
| 5        | --class-name  `<class>` | 对应的表名或对象名，该class类是包含在jar包中的         |
| 6        | --target-dir  `<path>`  | 合并后的数据在HDFS里存放的目录                         |

 

##### 15、命令&参数：metastore

记录了Sqoop job的元数据信息，如果不启动该服务，那么默认job元数据的存储目录为~/.sqoop，可在sqoop-site.xml中修改。

**命令：**

如：启动sqoop的metastore服务

  $ bin/sqoop metastore  

 

**参数：**

| **序号** | **参数**   | **说明**      |
| -------- | ---------- | ------------- |
| 1        | --shutdown | 关闭metastore |

 

 

------



 [[a1\]](#_msoanchor_1)使用sql语句来进行查找是不能加参数--table 

并且必须要添加where条件，

并且where条件后面必须带一个$CONDITIONS 这个字符串，

并且这个sql语句必须用单引号，不能用双引号