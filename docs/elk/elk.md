## ELK日志协议栈

### 1、ELK的基本介绍

ELK是三个软件产品的首字母缩写，**Elasticsearch，Logstash 和 Kibana**。这三款软件都是开源软件，通常是配合使用，而且又先后归于 Elastic.co 公司名下，故被简称为 ELK 协议栈。 

Elasticsearch是个开源**分布式搜索引擎**，它的特点有：分布式，零配置，自动发现，索引自动分片，索引副本机制，restful风格接口，多数据源，自动搜索负载等。

Logstash是一个完全开源的工具，他可以**对你的日志进行收集、过滤，并将其存储供以后使用**（如，搜索）。

Kibana 也是一个开源和免费的工具，它Kibana可以**为 Logstash 和 ElasticSearch 提供的日志分析友好的 Web 界面**，可以帮助您汇总、分析和搜索重要数据日志。

ELK的实现介绍

| ElasticSearch | Java       | 实时的分布式搜索和分析引擎，他可以**用于全文检索，结构化搜索以及分析**，lucene。Solr |
| ------------- | ---------- | ------------------------------------------------------------ |
| Logstash      | JRuby      | 具有实时渠道能力的**数据收集引擎**，包含**输入、过滤、输出**模块，一般在过滤模块中做日志格式化的解析工作 |
| Kibana        | JavaScript | 为ElasticSerach提供分析平台和可视化的Web平台。他可以ElasticSerach的索引中查找，呼唤数据，并生成各种维度的表图 |

### 2、ELK日志协议栈整体架构

![image-20200518225755832](elk.assets/image-20200518225755832.png)  

### 3、ELK的参考资料

ELK官网：https://www.elastic.co/

ELK官网文档：https://www.elastic.co/guide/index.html

ELK中文手册：https://www.elastic.co/guide/cn/elasticsearch/guide/current/index.html

ELK中文社区：https://elasticsearch.cn/

## Elasticsearch功能学习

### 1、什么是ElasticSearch

Elaticsearch，简称为**es**， es是一个开源的**高扩展**的分**布式全文检索引擎**，它可以**近乎实时的存储、检索数据**；本身扩展性很好，**可以扩展到上百台服务器，处理PB级别的数据**。es也使用Java开发并使用Lucene作为其核心来实现所有索引和搜索的功能，但是它的目的是通过简单的RESTful API来隐藏Lucene的复杂性，从而让全文搜索变得简单。

### 2、ElasticSearch使用案例

•      2013年初，GitHub抛弃了Solr，采取ElasticSearch 来做PB级的搜索。 “GitHub使用ElasticSearch搜索20TB的数据，包括13亿文件和1300亿行代码”

•      维基百科：启动以elasticsearch为基础的核心搜索架构

•      SoundCloud：“SoundCloud使用ElasticSearch为1.8亿用户提供即时而精准的音乐搜索服务”

•      百度：百度目前广泛使用ElasticSearch作为文本数据分析，采集百度所有服务器上的各类指标数据及用户自定义数据，通过对各种数据进行多维分析展示，辅助定位分析实例异常或业务层面异常。目前覆盖百度内部20多个业务线（包括casio、云分析、网盟、预测、文库、直达号、钱包、风控等），单集群最大100台机器，200个ES节点，每天导入30TB+数据

•      新浪使用ES 分析处理32亿条实时日志

•      阿里使用ES 构建挖财自己的日志采集和分析体系

### 3、Elasticsearch的安装部署

#### 第一步：创建普通用户

注意：**ES不能使用root用户来启动**，必须使用**普通用户**来安装启动。这里我们使用hadoop用户来安装我们的es服务

#### 第二步：下载并上传压缩包，然后解压

将es的安装包下载并上传到node01服务器的/kkb/soft

**node01**服务器使用es用户执行以下命令

```sh
[hadoop@node01 ~]$ cd /kkb/soft/

[hadoop@node01 soft]$ wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-6.7.0.tar.gz

[hadoop@node01 soft]$ tar -zxf elasticsearch-6.7.0.tar.gz -C /kkb/install/
```

#### 第三步：修改配置文件

##### 修改elasticsearch.yml

**node01**服务器使用hadoop用户来修改配置文件

```sh
cd /kkb/install/elasticsearch-6.7.0/config/

mkdir -p /kkb/install/elasticsearch-6.7.0/logs/

mkdir -p /kkb/install/elasticsearch-6.7.0/datas

vim elasticsearch.yml
```

直接添加下列内容：

```sh
cluster.name: myes

node.name: node01

path.data: /kkb/install/elasticsearch-6.7.0/datas

path.logs: /kkb/install/elasticsearch-6.7.0/logs

network.host: 192.168.52.101

http.port: 9200

discovery.zen.ping.unicast.hosts: ["node01", "node02", "node03"]

bootstrap.system_call_filter: false

bootstrap.memory_lock: false

http.cors.enabled: true

http.cors.allow-origin: "*"
```

 

##### 修改jvm.option

修改jvm.option配置文件，调整jvm堆内存大小

node01使用es用户执行以下命令**调整jvm堆内存大小**，每个人根据自己服务器的内存大小来进行调整

```sh
cd /kkb/install/elasticsearch-6.7.0/config

vim jvm.options 
```

```sh
-Xms2g

-Xmx2g
```



#### 第四步：将安装包分发到其他服务器上面

node01使用es用户将安装包分发到其他服务器上面去

```sh
cd /kkb/install/

scp -r elasticsearch-6.7.0/ node02:$PWD

scp -r elasticsearch-6.7.0/ node03:$PWD
```



#### 第五步：node02与node03修改es配置文件

node02与node03也需要修改es配置文件

node02使用hadoop用户执行以下命令修改es配置文件

```
cd /kkb/install/elasticsearch-6.7.0/config/

vim elasticsearch.yml
```

 

```sh
cluster.name: myes

node.name: node02

path.data: /kkb/install/elasticsearch-6.7.0/datas

path.logs: /kkb/install/elasticsearch-6.7.0/logs

network.host: 192.168.52.102

http.port: 9200

discovery.zen.ping.unicast.hosts: ["node01", "node02", "node03"]

bootstrap.system_call_filter: false

bootstrap.memory_lock: false

http.cors.enabled: true

http.cors.allow-origin: "*"
```

 

node03使用hadoop

```
cd /kkb/install/elasticsearch-6.7.0/config/ 

vim elasticsearch.yml
```

```sh
cluster.name: myes

node.name: node03

path.data: /kkb/install/elasticsearch-6.7.0/datas

path.logs: /kkb/install/elasticsearch-6.7.0/logs

network.host: 192.168.52.103

http.port: 9200

discovery.zen.ping.unicast.hosts: ["node01", "node02", "node03"]

bootstrap.system_call_filter: false

bootstrap.memory_lock: false

http.cors.enabled: true

http.cors.allow-origin: "*"
```



#### 第六步：修改系统配置，解决启动时候的问题

由于现在使用普通用户来安装es服务，且**es服务对服务器的资源要求比较多，包括内存大小，线程数等**。所以我们**需要给普通用户解开资源的束缚**

##### 解决启动问题一：普通用户打开文件的最大数限制

问题错误信息描述：

```
max file descriptors [4096] for elasticsearch process likely too low, increase to at least [65536]
```

ES因为需要大量的创建索引文件，需要大量的打开系统的文件，所以我们需要解除linux系统当中打开文件最大数目的限制，不然ES启动就会抛错

三台机器使用es用户执行以下命令解除打开文件数据的限制

```
sudo vi /etc/security/limits.conf
```

```sh
 * soft nofile 65536
 * hard nofile 131072
 * soft nproc 2048
 * hard nproc 4096
```



##### 解决启动问题二：普通用户启动线程数限制

三台机器执行以下命令打开文件最大数

```
sudo vi /etc/sysctl.conf
```

```sh
vm.max_map_count=655360

fs.file-max=655360
```

执行以下命令生效

```
sudo sysctl -p
```

注意：以上两个问题修改完成之后，一定要重新连接linux生效。**关闭secureCRT或者XShell工具，然后重新打开工具连接linux即可**

重新连接之后执行以下命令，出现这个结果即可准备启动ES了

```sh
[hadoop@node01 ~]$ ulimit -Hn
131072
[hadoop@node01 ~]$ ulimit -Sn
65536
[hadoop@node01 ~]$ ulimit -Hu
4096
[hadoop@node01 ~]$ ulimit -Su
4096
```

#### 第七步：启动ES服务

**三台机器**使用hadoop用户执行以下命令启动es服务

```
nohup /kkb/install/elasticsearch-6.7.0/bin/elasticsearch 2>&1 &
```

启动成功之后jps即可看到es的服务进程，并且**访问页面**

:rainbow:http://node01:9200/?pretty

<img src="elk.assets/image-20200518232625435.png" alt="image-20200518232625435" style="zoom: 67%;" />

能够看到es启动之后的一些信息

注意：如果哪一台机器服务启动失败，那么就到哪一台机器的/kkb/install/elasticsearch-6.7.0/logs这个路径下面去查看错误日志

### 4、安装elasticsearch-head插件

由于es服务启动之后，**访问界面比较丑陋**，为了更好的查看索引库当中的信息，我们可以通过安装**elasticsearch-head**这个插件来实现，这个插件可以**更方便快捷的看到es的管理界面**

#### 1 、node01机器安装nodejs

Node.js是一个基于 Chrome V8 引擎的 JavaScript 运行环境。

**Node.js是一个Javascript运行环境**(runtime environment)，发布于2009年5月，由Ryan Dahl开发，实质是对Chrome V8引擎进行了封装。Node.js 不是一个 JavaScript 框架，不同于CakePHP、Django、Rails。Node.js 更不是浏览器端的库，不能与 jQuery、ExtJS 相提并论。Node.js 是一个让 JavaScript 运行在服务端的开发平台，它让 JavaScript 成为与PHP、Python、Perl、Ruby 等服务端语言平起平坐的脚本语言。

安装步骤参考：https://www.cnblogs.com/kevingrace/p/8990169.html

##### 第一步：下载安装包

node01机器执行以下命令下载安装包，然后进行解压

```sh
cd /kkb/soft/wget https://npm.taobao.org/mirrors/node/v8.1.0/node-v8.1.0-linux-x64.tar.gz

tar -zxf node-v8.1.0-linux-x64.tar.gz -C /kkb/install/
```

##### 第二步：创建软连接

node01执行以下命令创建软连接

```sh
sudo ln -s /kkb/install/node-v8.1.0-linux-x64/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm

sudo ln -s /kkb/install/node-v8.1.0-linux-x64/bin/node /usr/local/bin/node
```



##### 第三步：修改环境变量

node01服务器添加环境变量

```sh
sudo vim /etc/profile
export NODE_HOME=/kkb/install/node-v8.1.0-linux-x64
export PATH=:$PATH:$NODE_HOME/bin
```

修改完环境变量使用source生效

```
source /etc/profile
```

##### 第四步：验证安装成功

node01执行以下命令验证安装生效

```sh
node -v

npm -v
```

#### 2 、node01机器安装elasticsearch-head插件

**elasticsearch-head这个插件是es提供的一个用于图形化界面查看的一个插件工具**，可以安装上这个插件之后，通过这个插件来实现我们通过浏览器查看es当中的数据

安装elasticsearch-head这个插件这里提供两种方式进行安装，:rainbow:第一种方式就是自己下载源码包进行编译，耗时比较长，网络较差的情况下，基本上不可能安装成功

:rainbow:第二种方式就是直接使用我已经编译好的安装包，进行修改配置即可

##### 1、第一种方式：网速慢，不推荐

这里选择node01进行安装

###### 第一步：在线安装必须依赖包

```sh
## 初始化目录
cd /kkb/install
## 安装GCC
sudo yum install -y gcc-c++ make git
```

###### 第二步：从git上面克隆编译包并进行安装

```sh
cd /kkb/install
git clone https://github.com/mobz/elasticsearch-head.git
## 进入安装目录
cd /kkb/install/elasticsearch-head
## intall 才会有 node-modules
npm install
```

 ![image-20200518233309385](elk.assets/image-20200518233309385.png)

以下进度信息

```sh
npm WARN notice [SECURITY] lodash has the following vulnerability: 1 low. Go here for more details: 
npm WARN notice [SECURITY] debug has the following vulnerability: 1 low. Go here for more details: https://nodesecurity.io/advisories?search=debug&version=0.7.4 - Run `npm i npm@latest -g` to upgrade your npm version, and then `npm audit` to get more info.
npm ERR! Unexpected end of input at 1:2096
npm ERR! 7c1a1bc21c976bb49f3ea","tarball":"https://registry.npmjs.org/safer-bu
npm ERR!                                                                      ^
npm ERR! A complete log of this run can be found in:
npm ERR!     /kkb/soft/.npm/_logs/2018-11-27T14_35_39_453Z-debug.log
```

**以上错误可以不用管。**

###### 第三步、node01机器修改Gruntfile.js

第一台机器修改Gruntfile.js这个文件

```sh
cd /kkb/install/elasticsearch-head

vim Gruntfile.js
```

找到以下代码：

添加一行： hostname: '192.168.52.100',

```sh
connect: {
                        server: {
                              options: {
                                     hostname: '192.168.52.100',
                                     port: 9100,
                                     base: '.',
                                     keepalive: travelue
                                }
                        }
                }

```

###### 第四步、node01机器修改app.js

 第一台机器修改app.js

```
cd /kkb/install/elasticsearch-head/_site

vim app.js 
```

 更改前：http://localhost:9200

更改后：http://node01:9200

##### 2、第二种方式：强烈推荐

###### 第一步：上传压缩包到/kkb/soft路径下去

将我们的压缩包 **elasticsearch-head-compile-after.tar.gz** 上传到node01机器的/kkb/soft路径下面去

###### 第二步：解压安装包

node01执行以下命令解压安装包

```sh
cd /kkb/soft/

tar -zxvf elasticsearch-head-compile-after.tar.gz -C /kkb/install/
```



###### 第三步、node01机器修改Gruntfile.js

修改Gruntfile.js这个文件

```sh
cd /kkb/install/elasticsearch-head

vim Gruntfile.js
```

找到以下代码：

添加一行： hostname: '192.168.52.101',

```sh
connect: {
             server: {
                options: {
                   hostname: '192.168.52.101',
                    port: 9100,
                   base: '.',
                   keepalive: true
                 }
             }
         }
```

 

###### 第四步、node01机器修改app.js

第一台机器修改app.js

```sh
cd /kkb/install/elasticsearch-head/_site

vim app.js 
```

更改前：http://localhost:9200

更改后：http://node01:9200

#### 3、node01机器启动head服务

node01启动elasticsearch-head插件

```sh
cd /kkb/install/elasticsearch-head/node_modules/grunt/bin/
```

进程后台启动命令

```sh
nohup ./grunt server >/dev/null 2>&1 &
```

如何停止：elasticsearch-head进程

执行以下命令找到elasticsearch-head的插件进程，然后使用kill -9 杀死进程即可

```sh
sudo yum install net-tools   

netstat -nltp | grep 9100

kill -9 8328
```

#### 4、访问elasticsearch-head界面

打开Google Chrome访问 

:cloud_with_lightning_and_rain:http://192.168.52.101:9100/

![image-20200518234253283](elk.assets/image-20200518234253283.png)

### 5、node01服务器安装Kibana

kibana的基本介绍

**Kibana**是一个开源的**分析和可视化平台**，**设计用于和Elasticsearch一起工作。**

你用Kibana来搜索，查看，并和存储在Elasticsearch索引中的数据进行交互。

你可以**轻松地执行高级数据分析，并且以各种图标、表格和地图的形式可视化数据。**

Kibana使得理解大量数据变得很容易。它简单的、基于浏览器的界面使你**能够快速创建和共享动态仪表板，实时显示Elasticsearch查询的变化。**

接着使用我们的hadoop用户在node01服务器上面来实现我们的kibana的安装部署

#### 第一步：下载资源上传服务器并解压

**node01**服务器使用hadoop用户执行以下命令来下载安装包并解压

cd /kkb/soft

在线下载

```sh
wget https://artifacts.elastic.co/downloads/kibana/kibana-6.7.0-linux-x86_64.tar.gz

tar -zxf kibana-6.7.0-linux-x86_64.tar.gz -C /kkb/install/
```

#### 第二步：修改配置文件

node01服务器使用es用户执行以下命令来修改配置文件

```sh
cd /kkb/install/kibana-6.7.0-linux-x86_64/config/
vi kibana.yml
```

配置内容如下：

```sh
server.host: "node01"
elasticsearch.hosts: ["http://node01:9200"]
```

#### 第三步：启动服务

node01服务器使用es用户执行以下命令启动kibana服务

```sh
cd /kkb/install/kibana-6.7.0-linux-x86_64
nohup bin/kibana >/dev/null 2>&1 &
```

如何停止kibana进程：停止kibana服务进程

查看进程号

```
ps -ef | grep node
```

然后使用kill -9杀死进程即可

#### 第四步：浏览器访问

浏览器地址访问kibana服务

:cloud_with_lightning_and_rain:http://node01:5601

![image-20200518234828110](elk.assets/image-20200518234828110.png)

### 6、ES的核心概念

#### 1、概述

Elasticsearch是**面向文档(document oriented)的**，这意味着它**可以存储整个对象或文档(document)**。然而它不仅仅是存储，还会索引(index)每个文档的内容使之可以被搜索。在Elasticsearch中，你可以对文档（而非成行成列的数据）进行索引、搜索、排序、过滤。

Elasticsearch比传统关系型数据库如下：

```sh
Relational DB -> Databases -> Tables -> Rows -> Columns
Elasticsearch -> Indices  -> Types -> Documents -> Fields
```

==可以将ElasticSearch类比为传统关系型数据库来学习。==

#### 2、Elasticsearch核心概念 

##### 1、索引 index

一个索引就是一个**拥有几分相似特征的文档的集合**。比如说，你可以有一个客户数据的索引，另一个产品目录的索引，还有一个订单数据的索引。**一个索引由一个名字来标识（必须全部是小写字母的）**，并且当我们要对对应于这个索引中的文档进行索引、搜索、更新和删除的时候，都要使用到这个名字。在一个集群中，可以定义任意多的索引。

##### 2、类型 type

在一个索引中，你可以定义一种或多种类型。**一个类型是你的索引的一个逻辑上的分类/分区**，其语义完全由你来定。**通常，会为具有一组共同字段的文档定义一个类型**。比如说，我们假设你运营一个博客平台并且将你所有的数据存储到一个索引中。在这个索引中，你可以为用户数据定义一个类型，为博客数据定义另一个类型，当然，也可以为评论数据定义另一个类型。

##### 3、字段Field

相当于是数据表的字段，**对文档数据根据不同属性进行的分类标识**

##### 4、映射 mapping

mapping是处理数据的方式和规则方面做一些**限制**，如**某个字段的数据类型、默认值、分析器、是否被索引等等**，这些都是映射里面可以设置的，其它就是**处理es里面数据的一些使用规则设置也叫做映射**，按着最优规则处理数据对性能提高很大，因此才需要建立映射，并且==需要思考如何建立映射才能对性能更好。==

##### 5、文档 document

**一个文档是一个可被索引的基础信息单元**。比如，你可以拥有某一个客户的文档，某一个产品的一个文档，当然，也可以拥有某个订单的一个文档。**==文档以JSON（Javascript Object Notation）格式来表示==**，而JSON是一个到处存在的互联网数据交互格式。

在**一个index/type里面，你可以存储任意多的文档**。注意，尽管一个文档，物理上存在于一个索引之中，**==文档必须被索引/赋予一个索引的type。==**

##### 6、接近实时 NRT

Elasticsearch是一个接近实时的搜索平台。这意味着，从索引一个文档直到这个文档能够被搜索到**有一个轻微的延迟**（通常是1秒以内）

##### 7、集群 cluster

一个集群就是由一个或**多个节点组织在一起，它们共同持有整个的数据，并一起提供索引和搜索功能**。一个集群由一个唯一的名字标识，这个名字默认就是“elasticsearch”。这个名字是重要的，因为一个节点只能通过指定某个集群的名字，来加入这个集群.

##### 8、节点 node

一个节点是集群中的一个服务器，作为集群的一部分，它存储数据，参与集群的索引和搜索功能。和集群类似，一个节点也是由一个名字来标识的，默认情况下，这个名字是一个随机的漫威漫画角色的名字，这个名字会在启动的时候赋予节点。这个名字对于管理工作来说挺重要的，因为在这个管理过程中，你会去确定网络中的哪些服务器对应于Elasticsearch集群中的哪些节点。

一个节点可以通过配置集群名称的方式来加入一个指定的集群。**默认情况下，每个节点都会被安排加入到一个叫做“elasticsearch”的集群中**，这意味着，如果你在你的网络中启动了若干个节点，并假定它们能够相互发现彼此，它们将会自动地形成并加入到一个叫做“elasticsearch”的集群中。

在一个集群里，只要你想，可以拥有任意多个节点。而且，如果当前你的网络中没有运行任何Elasticsearch节点，这时启动一个节点，会默认创建并加入一个叫做“elasticsearch”的集群。

##### 9、分片和复制 shards&replicas

一个索引可以存储超出单个结点硬件限制的大量数据。比如，一个具有10亿文档的索引占据1TB的磁盘空间，而任一节点都没有这样大的磁盘空间；或者单个节点处理搜索请求，响应太慢。为了解决这个问题，**Elasticsearch提供了将索引划分成多份的能力，这些份就叫做分片。当你创建一个索引的时候，你可以指定你想要的分片的数量。**每个分片本身也是一个功能完善并且独立的“索引”，这个“索引”可以被放置到集群中的任何节点上。

分片很重要，主要有两方面的原因：

 1）允许你水平分割/扩展你的内容容量。 

2）允许你在分片（潜在地，位于多个节点上）之上进行分布式的、并行的操作，进而提高性能/吞吐量。

至于一个分片怎样分布，它的文档怎样聚合回搜索请求，是完全由Elasticsearch管理的，对于作为用户的你来说，这些都是透明的。

在一个网络/云的环境里，失败随时都可能发生，在**某个分片/节点不知怎么的就处于离线状态**，或者由于任何原因消失了，这种情况下，有一个**故障转移机制**是非常有用并且是强烈推荐的。为此目的，**Elasticsearch允许你创建分片的一份或多份拷贝，这些拷贝叫做复制分片，或者直接叫复制。**

复制之所以重要，有两个主要原因： 在分片/节点失败的情况下，提供了高可用性。因为这个原因，注意到复制分片从不与原/主要（original/primary）分片置于同一节点上是非常重要的。扩展你的搜索量/吞吐量，因为**搜索可以在所有的复制分片上并行运行**。总之，每个索引可以被分成多个分片。一个索引也可以被复制0次（意思是没有复制）或多次。一旦复制了，每个索引就有了**主分片**（作为复制源的原来的分片）和**复制分片**（主分片的拷贝）之别。分片和复制的数量可以在索引创建的时候指定。在索引创建之后，你可以在任何时候动态地改变复制的数量，但是你事后不能改变分片的数量。

**默认情况下，Elasticsearch中的每个索引被分片5个主分片和1个复制**，这意味着，如果你的集群中至少有两个节点，你的索引将会有5个主分片和另外5个复制分片（1个完全拷贝），这样的话**每个索引总共就有10个分片。**

### 7、管理索引

**curl是利用URL语法在命令行方式下工作的开源文件传输工具**，使用**curl可以简单实现常见的get/post请求**。简单的认为是可以在命令行下面访问url的一个工具。在**==centos的默认库里面是有curl工具的==**，如果没有请yum安装即可。

curl

- -X 指定http的请求方法 有HEAD GET POST PUT DELETE
- -d 指定要传输的数据
- -H 指定http请求头信息

#### :rainbow:索引的基本操作——在Kibana

```scala
PUT /blog01/?pretty   //创建索引

PUT /blog01/article/1/?pretty
{"id":1,"title":"what is lucene"}     //插入文档

GET /blog01/article/1/?pretty      //查询文档

PUT /blog01/article/1/?pretty
{"id":1,"title":"what is elasticSearch"}    //更新文档

GET /blog01/article/_search?q=title:elasticSearch   //搜索文档


DELETE /blog01/article/1?pretty    //删除文档

DELETE /blog01/?pretty    //删除索引
```

创建索引演示：

<img src="elk.assets/image-20200519003747019.png" alt="image-20200519003747019" style="zoom: 67%;" />

创建索引前，查看ES的web页面：

<img src="elk.assets/image-20200519004019341.png" alt="image-20200519004019341" style="zoom:67%;" />

创建索引后，查看web页面：

<img src="elk.assets/image-20200519004827466.png" alt="image-20200519004827466" style="zoom:67%;" />

插入数据后，查看数据：

![image-20200519005641603](elk.assets/image-20200519005641603.png)



#### :one:  索引的基本操作——使用curl工具

##### 1、创建索引

在我们的**liinux命令行**当中执行以下语句:

```sh
curl -XPUT http://node01:9200/blog01/?pretty
```

##### 2、插入文档

前面的命令使用 PUT 动词将一个文档添加到 /article(文档类型)，并为该文档分配 ID 为1。URL 路径显示为index/doctype/ID（索引/文档类型/ID）。

```sh
curl -XPUT http://node01:9200/blog01/article/1?pretty -d '{"id": "1", "title": "What is lucene"}'
```

问题：Content-Type header [application/x-www-form-urlencoded] is not supported

解决：

```sh
curl -XPUT http://node01:9200/blog01/article/1?pretty -d '{"id": "1", "title": "What is lucene"}' -H "Content-Type: application/json"
```

原因：

此原因时由于ES增加了安全机制， 进行严格的内容类型检查，严格检查内容类型也可以作为防止跨站点请求伪造攻击的一层保护。 [官网解释](https://www.elastic.co/blog/strict-content-type-checking-for-elasticsearch-rest-requests)

http.content_type.required

##### 3、查询文档

```sh
curl -XGET http://node01:9200/blog01/article/1?pretty
```

问题：Content-Type header [application/x-www-form-urlencoded] is not supported

解决：

```sh
curl -XPUT http://node01:9200/blog01/article/1?pretty -d '{"id": "1", "title": "What is lucene"}' -H "Content-Type: application/json"

curl -XGET http://node01:9200/blog01/article/1?pretty -H "Content-Type: application/json"
```

##### 4、更新文档

```
curl -XPUT http://node01:9200/blog01/article/1?pretty -d '{"id": "1", "title": " What is elasticsearch"}'
```

问题：Content-Type header [application/x-www-form-urlencoded] is not supported

解决：

```sh
curl -XPUT http://node01:9200/blog01/article/1?pretty -d '{"id": "1", "title": " What is elasticsearch"}' -H "Content-Type: application/json"
```

##### 5、搜索文档

```
curl -XGET "http://node01:9200/blog01/article/_search?q=title:elasticsearch" 
```

问题：Content-Type header [application/x-www-form-urlencoded] is not supported

解决：

```sh
curl -XGET "http://node01:9200/blog01/article/_search?q=title:'elasticsearch'&pretty" -H "Content-Type: application/json"
```

##### 6、删除文档

```sh
curl -XDELETE "http://node01:9200/blog01/article/1?pretty"
```

##### 7、删除索引

```sh
curl -XDELETE http://node01:9200/blog01?pretty
```

#### :two:  查询条件查询

在kibana提供的界面上进行操作。

```json
POST /school/student/_bulk
{ "index": { "_id": 1 }}
{ "name" : "liubei", "age" : 20 , "sex": "boy", "birth": "1996-01-02" , "about": "i like diaocan he girl" }
{ "index": { "_id": 2 }}
{ "name" : "guanyu", "age" : 21 , "sex": "boy", "birth": "1995-01-02" , "about": "i like diaocan" }
{ "index": { "_id": 3 }}
{ "name" : "zhangfei", "age" : 18 , "sex": "boy", "birth": "1998-01-02" , "about": "i like travel" }
{ "index": { "_id": 4 }}
{ "name" : "diaocan", "age" : 20 , "sex": "girl", "birth": "1996-01-02" , "about": "i like travel and sport" }
{ "index": { "_id": 5 }}
{ "name" : "panjinlian", "age" : 25 , "sex": "girl", "birth": "1991-01-02" , "about": "i like travel and wusong" }
{ "index": { "_id": 6 }}
{ "name" : "caocao", "age" : 30 , "sex": "boy", "birth": "1988-01-02" , "about": "i like xiaoqiao" }
{ "index": { "_id": 7 }}
{ "name" : "zhaoyun", "age" : 31 , "sex": "boy", "birth": "1997-01-02" , "about": "i like travel and music" }
{ "index": { "_id": 8 }}
{ "name" : "xiaoqiao", "age" : 18 , "sex": "girl", "birth": "1998-01-02" , "about": "i like caocao" }
{ "index": { "_id": 9 }}
{ "name" : "daqiao", "age" : 20 , "sex": "girl", "birth": "1996-01-02" , "about": "i like travel and history" }
```

![image-20200519023804763](elk.assets/image-20200519023804763.png)

##### 1、使用match_all做查询

```json
GET /school/student/_search?pretty
{
    "query": {
        "match_all": {}
    }
}
```

问题：通过match_all匹配后，会把所有的数据检索出来，但是往往真正的业务需求并非要找全部的数据，而是检索出自己想要的；并且**对于es集群来说，直接检索全部的数据，很容易造成GC现象**。所以，我们要学会如何进行高效的检索数据

##### 2、通过关键字段进行查询

```json
GET /school/student/_search?pretty
{
    "query": {
         "match": {"about": "travel"}
     }
}
```

如果此时想查询**喜欢旅游的，并且不能是男孩的**，怎么办？

【这种方式是错误的，因为**一个match下，不能出现多个字段值**[match] query doesn't support multiple fields】，**需要使用复合查询**

 ![image-20200519010107289](elk.assets/image-20200519010107289.png)

##### 3、bool的复合查询

当出现多个查询语句组合的时候，可以用bool来包含。bool合并聚包含：must，must_not或者should， should表示or的意思

例子：查询非男性中喜欢旅行的人

```json
GET /school/student/_search?pretty
{
"query": {
   "bool": {
      "must": { "match": {"about": "travel"}},
      "must_not": {"match": {"sex": "boy"}}
     }
  }
}
```



##### 4、bool的复合查询中的should

should表示可有可无的（如果should**匹配到了就展示，否则就不展示**）

例子：

查询喜欢旅行的，如果**有男性的则显示，否则不显示**

```json
GET /school/student/_search?pretty
{
"query": {
   "bool": {
      "must": { "match": {"about": "travel"}},
      "should": {"match": {"sex": "boy"}}   //好像没啥用，有没有should，效果都一样         
     }
  }
}
```

##### 5、term匹配

使用term进行精确匹配（比如数字，日期，布尔值或 not_analyzed的字符串(未经分析的文本数据类型)）

语法

```json
{ "term": { "age": 20 }}
{ "term": { "date": "2018-04-01" }}
{ "term": { "sex": “boy” }}
{ "term": { "about": "trivel" }}
```

例子：

查询喜欢旅行的

```json
GET /school/student/_search?pretty
{
"query": {
   "bool": {
      "must": {"term": {"sex": "boy"}}         
     }}
}
```



##### 6、使用terms匹配多个值

```json
GET /school/student/_search?pretty
{
"query": {
   "bool": {
      "must": { "terms": {"about": ["travel","history"]}}          
     }
  }
}
```

term主要是用于精确的过滤比如说：”我爱你”

在match下面匹配可以为包含：我、爱、你、我爱等等的解析器

在term语法下面就精准匹配到：”我爱你”

##### 7、Range过滤

Range过滤允许我们按照指定的范围查找一些数据：操作范围：**gt::大于，gae::大于等于,lt::小于，lte::小于等于**

例子：

查找出大于20岁，小于等于25岁的学生

```json
GET /school/student/_search?pretty
{
"query": {
   "range": {
    "age": {"gt":20,"lte":25}
         }
      }
}
```



##### 8、exists和 missing过滤

exists和missing过滤可以找到文档中**是否包含某个字段或者是没有某个字段**

例子：

查找字段中包含age的文档

```json
GET /school/student/_search?pretty
{
"query": {
   "exists": {
    "field": "age"  
         }
      }
}
```



##### 9、bool的多条件过滤

用bool也可以像之前match一样来过滤多行条件：

```
must [] 多个查询条件的完全匹配,相当于 and 。
must_not [] 多个查询条件的相反匹配，相当于 not 。
should [] 至少有一个查询条件匹配, 相当于 or
```

例子：

过滤出about字段包含travel并且年龄大于20岁小于30岁的同学

```json
GET /school/student/_search?pretty
{
  "query": {
    "bool": {
      "must": [
        {"term": {
          "about": {
            "value": "travel"
          }
        }},{"range": {
          "age": {
            "gte": 20,
            "lte": 30
          }
        }}
      ]
    }
  }
}
```



##### 10、查询与过滤条件合并

通常复杂的查询语句，我们也要配合过滤语句来实现缓存，用filter语句就可以来实现

例子：

查询出喜欢旅行的，并且年龄是20岁的文档

```json
GET /school/student/_search?pretty
{
  "query": {
   "bool": {
     "must": {"match": {"about": "travel"}},     
     "filter": [{"term":{"age": 20}}]
     }
  }
}
```

#### :three:  定义字段类型mappings

在es当中，每个字段都会有默认的类型，根据我们第一次插入数据进去，es会自动帮我们推断字段的类型，当然我们也可以通过设置mappings来提前自定义我们字段的类型

##### 1、使用mappings来提前定义字段类型

**使用****mapping****的映射管理，提前指定字段的类型，防止后续的程序问题；** 

```json
DELETE  document
PUT document
{
  "mappings": {
    "article" : {
      "properties":
      {
        "title" : {"type": "text"} , 
        "author" : {"type": "text"} , 
        "titleScore" : {"type": "double"} 
        
      }
    }
  }
}
get document/article/_mapping
```



##### 2、基本命令

```json
DELETE school
PUT school
{
  "mappings": {
    "logs" : {
      "properties": {"messages" : {"type": "text"}}
    }
  }
}
```

添加索引：school，文档类型类logs，索引字段为message ，字段的类型为text

GET /school/_mapping/logs

继续添加字段

```json
POST /school/_mapping/logs
{
  "properties": {"number" : {"type": "text"}}
}

GET /school/_mapping/logs
```

##### 3、获取映射字段

语法：

```json
GET /school/_mapping/logs/field/number
```

#### :four:  管理索引库分片数以及副本数settings

**所谓的settings****就是用来修改索引分片和副本数的；**

比如有的重要索引，副本数很少甚至没有副本，那么我们可以通过setting来添加副本数

```json
DELETE document
PUT document
{
  "mappings": {
    "article" : {
      "properties":
      {
        "title" : {"type": "text"} , 
        "author" : {"type": "text"} , 
        "titleScore" : {"type": "double"} 
        
      }
    }
  }
}

GET /document/_settings
```

 ![image-20200519010439609](elk.assets/image-20200519010439609.png)

 

可以看到当前的副本数是1，那么为了提高容错性，我们可以把副本数改成2：

```json
PUT /document/_settings
{
  "number_of_replicas": 2
}
```

 

**副本可以改，分片不能改**

```json
PUT /document/_settings
{
  "number_of_shards": 3
}
```

### 8、分页解决方案

#### 1、导入数据

```json
DELETE us
POST /_bulk
{ "create": { "_index": "us", "_type": "tweet", "_id": "1" }}
{ "email" : "john@smith.com", "name" : "John Smith", "username" : "@john" }
{ "create": { "_index": "us", "_type": "tweet", "_id": "2" }}
{ "email" : "mary@jones.com", "name" : "Mary Jones", "username" : "@mary" }
{ "create": { "_index": "us", "_type": "tweet", "_id": "3" }}
{ "date" : "2014-09-13", "name" : "Mary Jones", "tweet" : "Elasticsearch means full text search has never been so easy", "user_id" : 2 }
{ "create": { "_index": "us", "_type": "tweet", "_id": "4" }}
{ "date" : "2014-09-14", "name" : "John Smith", "tweet" : "@mary it is not just text, it does everything", "user_id" : 1 }
{ "create": { "_index": "us", "_type": "tweet", "_id": "5" }}
{ "date" : "2014-09-15", "name" : "Mary Jones", "tweet" : "However did I manage before Elasticsearch?", "user_id" : 2 }
{ "create": { "_index": "us", "_type": "tweet", "_id": "6" }}
{ "date" : "2014-09-16", "name" : "John Smith",  "tweet" : "The Elasticsearch API is really easy to use", "user_id" : 1 }
{ "create": { "_index": "us", "_type": "tweet", "_id": "7" }}
{ "date" : "2014-09-17", "name" : "Mary Jones", "tweet" : "The Query DSL is really powerful and flexible", "user_id" : 2 }
{ "create": { "_index": "us", "_type": "tweet", "_id": "8" }}
{ "date" : "2014-09-18", "name" : "John Smith", "user_id" : 1 }
{ "create": { "_index": "us", "_type": "tweet", "_id": "9" }}
{ "date" : "2014-09-19", "name" : "Mary Jones", "tweet" : "Geo-location aggregations are really cool", "user_id" : 2 }
{ "create": { "_index": "us", "_type": "tweet", "_id": "10" }}
{ "date" : "2014-09-20", "name" : "John Smith", "tweet" : "Elasticsearch surely is one of the hottest new NoSQL products", "user_id" : 1 }
{ "create": { "_index": "us", "_type": "tweet", "_id": "11" }}
{ "date" : "2014-09-21", "name" : "Mary Jones", "tweet" : "Elasticsearch is built for the cloud, easy to scale", "user_id" : 2 }
{ "create": { "_index": "us", "_type": "tweet", "_id": "12" }}
{ "date" : "2014-09-22", "name" : "John Smith", "tweet" : "Elasticsearch and I have left the honeymoon stage, and I still love her.", "user_id" : 1 }
{ "create": { "_index": "us", "_type": "tweet", "_id": "13" }}
{ "date" : "2014-09-23", "name" : "Mary Jones", "tweet" : "So yes, I am an Elasticsearch fanboy", "user_id" : 2 }
{ "create": { "_index": "us", "_type": "tweet", "_id": "14" }}
{ "date" : "2014-09-24", "name" : "John Smith", "tweet" : "How many more cheesy tweets do I have to write?", "user_id" : 1 }
```

#### 2、size+from浅分页

按照一般的查询流程来说，如果我想查询前10条数据：

•      1 客户端请求发给某个节点

•      2 节点转发给个个分片，查询每个分片上的前10条

•      3 结果返回给节点，整合数据，提取前10条

•      4 返回给请求客户端

**from****定义了目标数据的偏移值，****size****定义当前返回的事件数目**

```json
GET /us/_search?pretty
{
  "from" : 0 , "size" : 5
}

GET /us/_search?pretty
{
  "from" : 5 , "size" : 5
}
```

这种浅分页只适合少量数据，因为随from增大，查询的时间就会越大，而且数据量越大，查询的效率指数下降

优点：from+size在数据量不大的情况下，效率比较高

缺点：在数据量非常大的情况下，from+size分页会把全部记录加载到内存中，这样做不但运行速递特别慢，而且容易让es出现内存不足而挂掉

#### 3、scroll深分页

对于上面介绍的浅分页，当Elasticsearch响应请求时，它必须确定docs的顺序，排列响应结果。

如果请求的页数较少（假设每页20个docs）, Elasticsearch不会有什么问题，但是如果页数较大时，比如请求第20页，Elasticsearch不得不取出第1页到第20页的所有docs，再去除第1页到第19页的docs，得到第20页的docs。

解决的方式就是使用scroll，**scroll****就是维护了当前索引段的一份快照信息****--****缓存**（这个快照信息是你执行这个scroll查询时的快照）。

可以把 scroll 分为初始化和遍历两步： 1、初始化时将所有符合搜索条件的搜索结果缓存起来，可以想象成快照； 2、遍历时，从这个快照里取数据；

初始化

```json
GET us/_search?scroll=3m
{ 
"query": {"match_all": {}},
 "size": 3
}
```

初始化的时候就像是普通的search一样

其中的scroll=3m代表当前查询的数据缓存3分钟

Size：3 代表当前查询3条数据

遍历

在遍历时候，拿到上一次遍历中的*scroll*id，然后带scroll参数，重复上一次的遍历步骤，知道返回的数据为空，就表示遍历完成

```json
GET /_search/scroll
{
  "scroll" : "1m",
  "scroll_id" : "DnF1ZXJ5VGhlbkZldGNoBQAAAAAAAAPXFk0xN1BmSnlVUldhYThEdWVzZ19xbkEAAAAAAAAAIxZuQWVJU0VSZ1JzcVZtMGVYZ3RDaFlBAAAAAAAAA9oWTVZOdHJ2cXBSOU9wN3c1dk5vcWd4QQAAAAAAAAPYFk0xN1BmSnlVUldhYThEdWVzZ19xbkEAAAAAAAAAIhZuQWVJU0VSZ1JzcVZtMGVYZ3RDaFlB"
}
```

【注意】：每次都要传参数scroll，刷新搜索结果的缓存时间，另外不需要指定index和type（**不要把缓存的时时间设置太长，占用内存**）

**对比**

浅分页，每次查询都会去索引库（本地文件夹）中查询pageNum*page条数据，然后截取掉前面的数据，留下最后的数据。 这样的操作在每个分片上都会执行，最后会将多个分片的数据合并到一起，再次排序，截取需要的。

深分页，可以一次性将所有满足查询条件的数据，都放到内存中。分页的时候，在内存中查询。相对浅分页，就可以避免多次读取磁盘。

 

### 9、ES的中文分词器IK

ES默认对英文文本的分词器支持较好，但和lucene一样，如果需要对中文进行全文检索，那么需要使用中文分词器，同lucene一样，在使用中文全文检索前，需要集成IK分词器。那么我们接下来就来安装IK分词器，以实现中文的分词 

#### 第一步：三台机器安装IK分词器

将安装包上传到node01机器的/home/es路径下

```sh
cd /kkb/soft
wget https://github.com/medcl/elasticsearch-analysis-ik/releases/download/v6.7.0/elasticsearch-analysis-ik-6.7.0.zip
## 将ik分词器的插件，解压到对应路径下 
cd /kkb/soft
mkdir -p /kkb/install/elasticsearch-6.7.0/plugins/analysis-ik
unzip elasticsearch-analysis-ik-6.7.0.zip  -d /kkb/install/elasticsearch-6.7.0/plugins/analysis-ik/
```

 将安装包分发到其他机器上

node01机器执行以下命令进行安装包的分发

```sh
cd /kkb/install/elasticsearch-6.7.0/plugins 
scp -r analysis-ik/ node02:$PWD 
scp -r analysis-ik/ node03:$PWD
```

三台机器都配置完成，配置完成之后，需要重启服务。

三台机器重启es服务

三台机器执行以下命令停止es服务并重启es服务

```sh
ps -ef|grep elasticsearch | grep bootstrap | awk '{print $2}' |xargs kill -9

nohup /kkb/install/elasticsearch-6.7.0/bin/elasticsearch 2>&1 &
```

 

#### 第二步、创建索引库并配置IK分词器

```json
delete iktest
PUT /iktest?pretty
{
    "settings" : {
        "analysis" : {
            "analyzer" : {
                "ik" : {
                    "tokenizer" : "ik_max_word"
                }
            }
        }
    },
    "mappings" : {
        "article" : {
            "dynamic" : true,
            "properties" : {
                "subject" : {
                    "type" : "text",
                    "analyzer" : "ik_max_word"
                }
            }
        }
    }
}
```

说明：在创建索引库的时候，我们指定分词方式为ik_max_word，会对我们的中文进行最细粒度的切分

#### 第三步、查看分词效果

在kibana当中执行以下查询，并验证分词效果

```json
GET _analyze?pretty
  {
    "analyzer": "ik_max_word",
    "text": "特朗普是美国总统"
  }
```



#### 第四步、插入测试数据

```json
POST /iktest/article/_bulk?pretty
{ "index" : { "_id" : "1" } }
{"subject" : "＂闺蜜＂崔顺实被韩检方传唤 韩总统府促彻查真相" }
{ "index" : { "_id" : "2" } }
{"subject" : "韩举行＂护国训练＂ 青瓦台:决不许国家安全出问题" }
{ "index" : { "_id" : "3" } }
{"subject" : "媒体称FBI已经取得搜查令 检视希拉里电邮" }
{ "index" : { "_id" : "4" } }
{"subject" : "村上春树获安徒生奖 演讲中谈及欧洲排外问题" }
{ "index" : { "_id" : "5" } }
{"subject" : "希拉里团队炮轰FBI 参院民主党领袖批其”违法”" }
```

查看分词器

对"希拉里和韩国"进行分词查询

ikmaxword分词后的效果：希|拉|里|希拉里|和|韩国

```json
POST /iktest/article/_search?pretty
{
    "query" : { "match" : { "subject" : "希拉里和韩国" }},
    "highlight" : {
        "pre_tags" : ["<font color=red>"],
        "post_tags" : ["</font>"],
        "fields" : {
            "subject" : {}
        }
    }
}
```



#### 第五步、配置热词更新

查看分词效果

```json
GET _analyze?pretty
  {
    "analyzer": "ik_max_word",
    "text": "小老弟，你怎么肥事，老铁你来了！！！"
  }
```

我们会发现，随着时间的推移和发展，有些网络热词我们并不能进行分词，因为网络热词并没有定义在我们的词库里面，这就需要我们经常能够实时的更新我们的网络热词，我们可以通过tomcat来实现远程词库来解决这个问题。

##### 1、node03配置Tomcat

使用hadoop用户来进行配置tomcat，此处我们将tomcat装在node03机器上面即可，将我们的tomcat安装包上传到node03服务器的/kkb/soft路径下，然后进行解压

```
cd /kkb/soft/

tar -zxf apache-tomcat-8.5.34.tar.gz -C /kkb/install/
```

tomcat当中添加配置hot.dic

```
cd /kkb/install/apache-tomcat-8.5.34/webapps/ROOT

vi hot.dic 
```

```
老铁
肥事
```

启动tomcat

```
cd /kkb/install/apache-tomcat-8.5.34/

bin/startup.sh
```

浏览器访问以验证tomcat是否安装成功

wget http://node03:8080/hot.dic

如果能够访问到，则证明tomcat安装成功

##### 2、 三台机器修改配置文件

三台机器都要修改es的配置文件（使用es用户来进行修改即可）

第一台机器node01修改es的配置

```
cd /kkb/install/elasticsearch-6.7.0/plugins/analysis-ik/config

vim IKAnalyzer.cfg.xml
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE properties SYSTEM "http://java.sun.com/dtd/properties.dtd">
<properties>
        <comment>IK Analyzer 扩展配置</comment>
        <!--用户可以在这里配置自己的扩展字典 -->
        <entry key="ext_dict"></entry>
         <!--用户可以在这里配置自己的扩展停止词字典-->
        <entry key="ext_stopwords"></entry>
        <!--用户可以在这里配置远程扩展字典 -->
        <entry key="remote_ext_dict">http://node03:8080/hot.dic</entry>
        <!--用户可以在这里配置远程扩展停止词字典-->
        <!-- <entry key="remote_ext_stopwords">words_location</entry> -->
</properties>
```

修改完成之后拷贝到node02与node03机器上面去

node01执行以下命令进行拷贝

```sh
cd /kkb/install/elasticsearch-6.7.0/plugins/analysis-ik/config 

scp IKAnalyzer.cfg.xml node02:$PWD 

scp IKAnalyzer.cfg.xml node03:$PWD 
```

##### 3、三台机器重新启动es

三台机器重新启动es服务，三台机器先使用kill -9杀死es的服务，然后再执行以下命令进行重启

```
ps -ef|grep elasticsearch | grep bootstrap | awk '{print $2}' |xargs kill -9

nohup /kkb/install/elasticsearch-6.7.0/bin/elasticsearch 2>&1 &
```

在kibana当中执行以下命令，查看我们的分词过程

```json
 GET _analyze?pretty
  {
    "analyzer": "ik_max_word",
    "text": "小老弟，你怎么肥事，老铁你来了"
  }
```

 

 

### 10、Elasticsearch的JavaAPI操作

#### 1：创建maven工程，并添加jar包坐标依赖

创建maven工程，并导入以下jar包坐标依赖

```xml
<dependencies>
    <dependency>
        <groupId>org.elasticsearch.client</groupId>
        <artifactId>transport</artifactId>
        <version>6.7.0</version>
    </dependency>
    <dependency>
        <groupId>org.apache.logging.log4j</groupId>
        <artifactId>log4j-core</artifactId>
        <version>2.9.1</version>
    </dependency>
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter-api</artifactId>
        <version>5.3.0-M1</version>
        <scope>test</scope>
    </dependency>

    <!-- https://mvnrepository.com/artifact/com.alibaba/fastjson -->
    <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>fastjson</artifactId>
        <version>1.2.47</version>
    </dependency>
</dependencies>
<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <configuration>
                <source>1.8</source>
                <target>1.8</target>
            </configuration>
        </plugin>
    </plugins>
</build>

```

 

#### 2：添加索引文件操作 

##### 1、创建Client

```java
private TransportClient client;
@BeforeEach
public void test1() throws UnknownHostException {
    Settings settings = Settings.builder().put("cluster.name", "myes").build();
    client = new PreBuiltTransportClient(settings).addTransportAddress(new TransportAddress(InetAddress.getByName("node01"),9300)).addTransportAddress(new TransportAddress(InetAddress.getByName("node02"),9300));
}
```



##### 2、自己拼装json创建索引保存到myindex1索引库下面的article当中去

```java
/**
 * 插入json格式的索引数据
 */
@Test
public void createIndex(){
    String json = "{" +
            "\"user\":\"kimchy\"," +
            "\"postDate\":\"2013-01-30\"," +
            "\"message\":\"travelying out Elasticsearch\"" +
            "}";
    IndexResponse indexResponse = client.prepareIndex("myindex1", "article", "1").setSource(json, XContentType.JSON).get();
    client.close();
}
```

 

##### 3、使用map创建索引

```java
@Test
public void index2() throws Exception {
    HashMap<String, String> jsonMap = new HashMap<String, String>();
    jsonMap.put("name", "zhangsan");
    jsonMap.put("sex", "1");
    jsonMap.put("age", "18");
    jsonMap.put("address", "bj");
    IndexResponse indexResponse = client.prepareIndex("myindex1", "article", "2")
            .setSource(jsonMap)
            .get();
    client.close();
}
```



##### 4、XcontentBuilder实现创建索引

```java
/**
 * 通过XContentBuilder来实现索引的创建
 * @throws IOException
 */
@Test
public void index3() throws IOException {
    IndexResponse indexResponse = client.prepareIndex("myindex1", "article", "3")
            .setSource(new XContentFactory().jsonBuilder()
                    .startObject()
                    .field("name", "lisi")
                    .field("age", "18")
                    .field("sex", "0")
                    .field("address", "bj")
                    .endObject())
            .get();
    client.close();

}
```



##### 5、将对象转换为json格式字符串进行创建索引

定义person对象

```java
public class Person implements Serializable{
    private Integer id;
    private String name ;
    private Integer age;
    private Integer sex;
    private String address;
    private String phone;
    private String email;
    private  String say;


    public Person() {
    }

    public Person(Integer id, String name, Integer age, Integer sex, String address, String phone, String email,String say) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.sex = sex;
        this.address = address;
        this.phone = phone;
        this.email = email;
        this.say = say;
    }

    public String getSay() {
        return say;
    }

    public void setSay(String say) {
        this.say = say;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public Integer getSex() {
        return sex;
    }

    public void setSex(Integer sex) {
        this.sex = sex;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
```

插入索引数据

```java
/**
 * 将java对象转换为json格式字符串进行创建索引
 */
@Test
public void objToIndex(){
    Person person = new Person();
    person.setAge(18);
    person.setId(20);
    person.setName("张三丰");
    person.setAddress("武当山");
    person.setEmail("zhangsanfeng@163.com");
    person.setPhone("18588888888");
    person.setSex(1);
    String json = JSONObject.toJSONString(person);
    System.out.println(json);
    client.prepareIndex("myindex1","article","32").setSource(json,XContentType.JSON).get();
    client.close();
}
```



##### 6、批量创建索引

```java
/**
 * 批量创建索引
 * @throws IOException
 */
@Test
public void index4() throws IOException {
    BulkRequestBuilder bulk = client.prepareBulk();
    bulk.add(client.prepareIndex("myindex1", "article", "4")
            .setSource(new XContentFactory().jsonBuilder()
                    .startObject()
                    .field("name", "wangwu")
                    .field("age", "18")
                    .field("sex", "0")
                    .field("address", "bj")
                    .endObject()));
    bulk.add(client.prepareIndex("news", "article", "5")
            .setSource(new XContentFactory().jsonBuilder()
                    .startObject()
                    .field("name", "zhaoliu")
                    .field("age", "18")
                    .field("sex", "0")
                    .field("address", "bj")
                    .endObject()));
    BulkResponse bulkResponse = bulk.get();
    System.out.println(bulkResponse);
    client.close();
}
```

 

#### 3、查询索引

##### 1、初始化一批数据到索引库中准备查询

```java
/**
 * 初始化一批数据到索引库当中去准备做查询使用
 * 注意这里初始化的时候，需要给我们的数据设置分词属性
 * @throws Exception
 */
@Test
public void createIndexBatch() throws Exception {
    Settings settings = Settings
            .builder()
            .put("cluster.name", "myes") //节点名称， 在es配置的时候设置
            //自动发现我们其他的es的服务器
            .put("client.transport.sniff", "true")
            .build();
    //创建客户端
    TransportClient client = new PreBuiltTransportClient(settings)
            .addTransportAddress(new TransportAddress(InetAddress.getByName("node01"), 9300));//以本机作为节点
    //创建映射
    XContentBuilder mapping = XContentFactory.jsonBuilder()
            .startObject()
            .startObject("properties")
            //      .startObject("m_id").field("type","keyword").endObject()
            .startObject("id").field("type", "integer").endObject()
            .startObject("name").field("type", "text").field("analyzer", "ik_max_word").endObject()
            .startObject("age").field("type", "integer").endObject()
            .startObject("sex").field("type", "text").field("analyzer", "ik_max_word").endObject()
            .startObject("address").field("type", "text").field("analyzer", "ik_max_word").endObject()
            .startObject("phone").field("type", "text").endObject()
            .startObject("email").field("type", "text").endObject()
            .startObject("say").field("type", "text").field("analyzer", "ik_max_word").endObject()
            .endObject()
            .endObject();
    //pois：索引名   cxyword：类型名（可以自己定义）
    PutMappingRequest putmap = Requests.putMappingRequest("indexsearch").type("mysearch").source(mapping);
    //创建索引
    client.admin().indices().prepareCreate("indexsearch").execute().actionGet();
    //为索引添加映射
    client.admin().indices().putMapping(putmap).actionGet();


    BulkRequestBuilder bulkRequestBuilder = client.prepareBulk();
    Person lujunyi = new Person(2, "玉麒麟卢俊义", 28, 1, "水泊梁山", "17666666666", "lujunyi@163.com","hello world今天天气还不错");
    Person wuyong = new Person(3, "智多星吴用", 45, 1, "水泊梁山", "17666666666", "wuyong@163.com","行走四方，抱打不平");
    Person gongsunsheng = new Person(4, "入云龙公孙胜", 30, 1, "水泊梁山", "17666666666", "gongsunsheng@163.com","走一个");
    Person guansheng = new Person(5, "大刀关胜", 42, 1, "水泊梁山", "17666666666", "wusong@163.com","我的大刀已经饥渴难耐");
    Person linchong = new Person(6, "豹子头林冲", 18, 1, "水泊梁山", "17666666666", "linchong@163.com","梁山好汉");
    Person qinming = new Person(7, "霹雳火秦明", 28, 1, "水泊梁山", "17666666666", "qinming@163.com","不太了解");
    Person huyanzhuo = new Person(8, "双鞭呼延灼", 25, 1, "水泊梁山", "17666666666", "huyanzhuo@163.com","不是很熟悉");
    Person huarong = new Person(9, "小李广花荣", 50, 1, "水泊梁山", "17666666666", "huarong@163.com","打酱油的");
    Person chaijin = new Person(10, "小旋风柴进", 32, 1, "水泊梁山", "17666666666", "chaijin@163.com","吓唬人的");
    Person zhisheng = new Person(13, "花和尚鲁智深", 15, 1, "水泊梁山", "17666666666", "luzhisheng@163.com","倒拔杨垂柳");
    Person wusong = new Person(14, "行者武松", 28, 1, "水泊梁山", "17666666666", "wusong@163.com","二营长。。。。。。");

    bulkRequestBuilder.add(client.prepareIndex("indexsearch", "mysearch", "1")
            .setSource(JSONObject.toJSONString(lujunyi), XContentType.JSON)
    );
    bulkRequestBuilder.add(client.prepareIndex("indexsearch", "mysearch", "2")
            .setSource(JSONObject.toJSONString(wuyong), XContentType.JSON)
    );
    bulkRequestBuilder.add(client.prepareIndex("indexsearch", "mysearch", "3")
            .setSource(JSONObject.toJSONString(gongsunsheng), XContentType.JSON)
    );
    bulkRequestBuilder.add(client.prepareIndex("indexsearch", "mysearch", "4")
            .setSource(JSONObject.toJSONString(guansheng), XContentType.JSON)
    );
    bulkRequestBuilder.add(client.prepareIndex("indexsearch", "mysearch", "5")
            .setSource(JSONObject.toJSONString(linchong), XContentType.JSON)
    );
    bulkRequestBuilder.add(client.prepareIndex("indexsearch", "mysearch", "6")
            .setSource(JSONObject.toJSONString(qinming), XContentType.JSON)
    );
    bulkRequestBuilder.add(client.prepareIndex("indexsearch", "mysearch", "7")
            .setSource(JSONObject.toJSONString(huyanzhuo), XContentType.JSON)
    );
    bulkRequestBuilder.add(client.prepareIndex("indexsearch", "mysearch", "8")
            .setSource(JSONObject.toJSONString(huarong), XContentType.JSON)
    );
    bulkRequestBuilder.add(client.prepareIndex("indexsearch", "mysearch", "9")
            .setSource(JSONObject.toJSONString(chaijin), XContentType.JSON)
    );
    bulkRequestBuilder.add(client.prepareIndex("indexsearch", "mysearch", "10")
            .setSource(JSONObject.toJSONString(zhisheng), XContentType.JSON)
    );
    bulkRequestBuilder.add(client.prepareIndex("indexsearch", "mysearch", "11")
            .setSource(JSONObject.toJSONString(wusong), XContentType.JSON)
    );

    bulkRequestBuilder.get();
    client.close();

}
```

 

##### 2、通过数据id使用prepareGet来查询索引

通过id来进行查询索引

```java
/**
 * 通过id来进行精确查询
 */
@Test
public void query1() {
    GetResponse documentFields = client.prepareGet("indexsearch", "mysearch", "11").get();
    String index = documentFields.getIndex();
    String type = documentFields.getType();
    String id = documentFields.getId();
    System.out.println(index);
    System.out.println(type);
    System.out.println(id);
    Map<String, Object> source = documentFields.getSource();
    for (String s : source.keySet()) {
        System.out.println(source.get(s));
    }
}

```

 

##### 3、查询索引库当中的所有数据

```java
/**
 * 查询所有数据
 */
@Test
public void queryAll() {
    SearchResponse searchResponse = client
            .prepareSearch("indexsearch")
            .setTypes("mysearch")
            .setQuery(new MatchAllQueryBuilder())
            .get();
    SearchHits searchHits = searchResponse.getHits();
    SearchHit[] hits = searchHits.getHits();
    for (SearchHit hit : hits) {
        String sourceAsString = hit.getSourceAsString();
        System.out.println(sourceAsString);
    }
    client.close();
}

```

 

##### 4、RangeQuery范围值查询

查找索引库当中年龄为18到28的所有人

```java
/**
 * 查找年龄18到28的人,包含18和28
 */
@Test
public void  rangeQuery(){
    SearchResponse searchResponse = client.prepareSearch("indexsearch")
            .setTypes("mysearch")
            .setQuery(new RangeQueryBuilder("age").gt(17).lt(29))
            .get();
    SearchHits hits = searchResponse.getHits();
    SearchHit[] hits1 = hits.getHits();
    for (SearchHit documentFields : hits1) {
        System.out.println(documentFields.getSourceAsString());
    }
    client.close();
}
```

 

##### 5、termQuery词条查询

```java
/**
 * 词条查询
 */
@Test
public  void termQuery(){
    SearchResponse searchResponse = client.prepareSearch("indexsearch").setTypes("mysearch")
            .setQuery(new TermQueryBuilder("say", "熟悉"))
            .get();
    SearchHits hits = searchResponse.getHits();
    SearchHit[] hits1 = hits.getHits();
    for (SearchHit documentFields : hits1) {
        System.out.println(documentFields.getSourceAsString());
    }
}

```



##### 6、fuzzyQuery模糊查询

模糊查询可以自动帮我们纠正写错误的英文单词，最大纠正次数两次

```java
/**
 * fuzzyQuery表示英文单词的最大可纠正次数，最大可以自动纠正两次
 */
@Test
public void fuzzyQuery(){
    SearchResponse searchResponse = client.prepareSearch("indexsearch").setTypes("mysearch")
            .setQuery(QueryBuilders.fuzzyQuery("say", "helOL").fuzziness(Fuzziness.TWO))
            .get();
    SearchHits hits = searchResponse.getHits();
    SearchHit[] hits1 = hits.getHits();
    for (SearchHit documentFields : hits1) {
        System.out.println(documentFields.getSourceAsString());
    }
    client.close();
}

```

 

##### 7、wildCardQuery通配符查询

*：匹配任意多个字符

？：仅匹配一个字符

```java
/**
 * 模糊匹配查询有两种匹配符，分别是" * " 以及 " ? "， 用" * "来匹配任何字符，包括空字符串。用" ? "来匹配任意的单个字符
 */
@Test
public void wildCardQueryTest(){
    SearchResponse searchResponse = client.prepareSearch("indexsearch").setTypes("mysearch")
            .setQuery(QueryBuilders.wildcardQuery("say", "hel*"))
            .get();
    SearchHits hits = searchResponse.getHits();
    SearchHit[] hits1 = hits.getHits();
    for (SearchHit documentFields : hits1) {
        System.out.println(documentFields.getSourceAsString());
    }
    client.close();
}

```

 

##### 8、boolQuery 多条件组合查询

使用boolQuery实现多条件组合查询

查询年龄是18到28范围内且性别是男性的，或者id范围在10到13范围内的

```java
/**
 * 多条件组合查询 boolQuery
 * 查询年龄是18到28范围内且性别是男性的，或者id范围在10到13范围内的
 */
@Test
public void boolQueryTest(){
    RangeQueryBuilder age = QueryBuilders.rangeQuery("age").gt(17).lt(29);
    TermQueryBuilder sex = QueryBuilders.termQuery("sex", "1");
    RangeQueryBuilder id = QueryBuilders.rangeQuery("id").gt("9").lt("15");

    SearchResponse searchResponse = client.prepareSearch("indexsearch").setTypes("mysearch")
            .setQuery(
                    QueryBuilders.boolQuery().should(id)
           .should(QueryBuilders.boolQuery().must(sex).must(age)))
            .get();
    SearchHits hits = searchResponse.getHits();
    SearchHit[] hits1 = hits.getHits();
    for (SearchHit documentFields : hits1) {
        System.out.println(documentFields.getSourceAsString());
    }
    client.close();
}

```

 

##### 9、分页与高亮查询

###### 1、分页查询

```java
/*分页查询
 */
@Test
public void getPageIndex(){
    int  pageSize = 5;
    int pageNum = 2;
    int startNum = (pageNum-1)*5;
    SearchResponse searchResponse = client.prepareSearch("indexsearch")
            .setTypes("mysearch")
            .setQuery(QueryBuilders.matchAllQuery())
            .addSort("id",SortOrder.ASC)
            .setFrom(startNum)
            .setSize(pageSize)
            .get();
    SearchHits hits = searchResponse.getHits();
    SearchHit[] hits1 = hits.getHits();
    for (SearchHit documentFields : hits1) {
        System.out.println(documentFields.getSourceAsString());
    }
    client.close();
}

```

 

###### 2、高亮查询

在进行关键字搜索时，搜索出的内容中的关键字会显示不同的颜色，称之为高亮

百度搜索关键字"周星驰"

 ![image-20200519011440548](elk.assets/image-20200519011440548.png)

京东商城搜索"笔记本"

 ![image-20200519011449668](elk.assets/image-20200519011449668.png)

###### 3、高亮显示的html分析

通过开发者工具查看高亮数据的html代码实现：

 ![image-20200519011503099](elk.assets/image-20200519011503099.png)

ElasticSearch可以对查询出的内容中关键字部分进行标签和样式的设置，但是你需要告诉ElasticSearch使用什么标签对高亮关键字进行包裹

###### 4、高亮显示代码实现

```java
/**
 * 高亮查询
 */
@Test
public  void  highLight(){
    //设置我们的查询高亮字段
    SearchRequestBuilder searchRequestBuilder = client.prepareSearch("indexsearch")
            .setTypes("mysearch")
            .setQuery(QueryBuilders.termQuery("say", "hello"));

    //设置我们字段高亮的前缀与后缀
    HighlightBuilder highlightBuilder = new HighlightBuilder();
    highlightBuilder.field("say").preTags("<font style='color:red'>").postTags("</font>");

    //通过高亮来进行我们的数据查询
    SearchResponse searchResponse = searchRequestBuilder.highlighter(highlightBuilder).get();
    SearchHits hits = searchResponse.getHits();
    System.out.println("查询出来一共"+ hits.totalHits+"条数据");
    for (SearchHit hit : hits) {
        //打印没有高亮显示的数据
        System.out.println(hit.getSourceAsString());
        System.out.println("=========================");
        //打印我们经过高亮显示之后的数据
       Text[] says = hit.getHighlightFields().get("say").getFragments();
        for (Text say : says) {
            System.out.println(say);
        }

     /*   Map<String, HighlightField> highlightFields = hit.getHighlightFields();
        System.out.println(highlightFields);*/
    }
    client.close();
}

```

 

#### 4、更新索引

根据系统给数据生成的id来进行更新索引

```java
/**
 * 更新索引
 * 根据数据id来进行更新索引
 */
@Test
public void updateIndex(){
    Person guansheng = new Person(5, "宋江", 88, 0, "水泊梁山", "17666666666", "wusong@kkb.com","及时雨宋江");
    client.prepareUpdate().setIndex("indexsearch").setType("mysearch").setId("5")
            .setDoc(JSONObject.toJSONString(guansheng),XContentType.JSON)
            .get();
    client.close();
}

```

 

#### 5、删除索引

##### 1、按照id进行删除

```java
/**
 * 按照id进行删除数据
 */
@Test
public void deleteById(){
    DeleteResponse deleteResponse = client.prepareDelete("indexsearch", "mysearch", "14").get();
    client.close();
}

```

 

##### 2、按照查询条件来进行删除

```java
/*
按照条件进行删除
 */
@Test
public void  deleteByQuery(){

    BulkByScrollResponse bulkByScrollResponse = DeleteByQueryAction.INSTANCE.newRequestBuilder(client)
            .filter(QueryBuilders.rangeQuery("id").gt(2).lt(4))
            .source("indexsearch")
            .get();
    long deleted = bulkByScrollResponse.getDeleted();
    System.out.println(deleted);

}

```



##### 3、删除整个索引库

```java
/**
 * 删除索引
 * 删除整个索引库
 */
@Test
public  void  deleteIndex(){
    DeleteIndexResponse indexsearch = client.admin().indices().prepareDelete("indexsearch").execute().actionGet();
    client.close();
}

```



### 11、es的高级javaAPI操作

现有结构化数据内容如下：

| name     | age  | salary | team | position |
| -------- | ---- | ------ | ---- | -------- |
| 张云雷   | 26   | 2000   | war  | pf       |
| 特斯拉   | 20   | 500    | tim  | sf       |
| 于谦     | 25   | 2000   | cav  | pg       |
| 爱迪生   | 40   | 1000   | tim  | pf       |
| 爱因斯坦 | 21   | 300    | tim  | sg       |
| 郭德纲   | 33   | 3000   | cav  | sf       |
| 牛顿     | 21   | 500    | tim  | c        |
| 岳云鹏   | 29   | 1000   | war  | pg       |

 

初始化一批数据到es索引库当中去

```java
/**
     * 批量添加数据
     * @throws IOException
     * @throws ExecutionException
     * @throws InterruptedException
     */
    @Test
    public void addIndexDatas() throws IOException, ExecutionException, InterruptedException {
        //获取settings
        //配置es集群的名字
        Settings settings = Settings.builder().put("cluster.name", "myes").build();
        //获取客户端
        TransportAddress transportAddress = new TransportAddress(InetAddress.getByName("node01"), 9300);

        TransportAddress transportAddress2 = new TransportAddress(InetAddress.getByName("node02"), 9300);

        TransportAddress transportAddress3 = new TransportAddress(InetAddress.getByName("node03"), 9300);
        //获取client客户端
        TransportClient client = new PreBuiltTransportClient(settings).addTransportAddress(transportAddress).addTransportAddress(transportAddress2).addTransportAddress(transportAddress3);

        /**
         * 创建索引
         * */
        client.admin().indices().prepareCreate("player").get();
        //构建json的数据格式，创建映射
        XContentBuilder mappingBuilder = XContentFactory.jsonBuilder()
                .startObject()
                .startObject("player")
                .startObject("properties")
                .startObject("name").field("type","text").field("index", "true").field("fielddata","true").endObject()
                .startObject("age").field("type","integer").endObject()
                .startObject("salary").field("type","integer").endObject()
                .startObject("team").field("type","text").field("index", "true").field("fielddata","true").endObject()
                .startObject("position").field("type","text").field("index", "true").field("fielddata","true").endObject()
                .endObject()
                .endObject()
                .endObject();
        PutMappingRequest request = Requests.putMappingRequest("player")
                .type("player")
                .source(mappingBuilder);
        client.admin().indices().putMapping(request).get();


        //批量添加数据开始

        BulkRequestBuilder bulkRequest = client.prepareBulk();

// either use client#prepare, or use Requests## to directly build index/delete requests
        bulkRequest.add(client.prepareIndex("player", "player", "1")
                .setSource(jsonBuilder()
                        .startObject()
                        .field("name", "郭德纲")
                        .field("age", 33)
                        .field("salary",3000)
                        .field("team" , "cav")
                        .field("position" , "sf")
                        .endObject()
                )
        );
        bulkRequest.add(client.prepareIndex("player", "player", "2")
                .setSource(jsonBuilder()
                        .startObject()
                        .field("name", "于谦")
                        .field("age", 25)
                        .field("salary",2000)
                        .field("team" , "cav")
                        .field("position" , "pg")
                        .endObject()
                )
        );
        bulkRequest.add(client.prepareIndex("player", "player", "3")
                .setSource(jsonBuilder()
                        .startObject()
                        .field("name", "岳云鹏")
                        .field("age", 29)
                        .field("salary",1000)
                        .field("team" , "war")
                        .field("position" , "pg")
                        .endObject()
                )
        );
        bulkRequest.add(client.prepareIndex("player", "player", "4")
                .setSource(jsonBuilder()
                        .startObject()
                        .field("name", "孙越")
                        .field("age", 26)
                        .field("salary",2000)
                        .field("team" , "war")
                        .field("position" , "sg")
                        .endObject()
                )
        );
        bulkRequest.add(client.prepareIndex("player", "player", "5")
                .setSource(jsonBuilder()
                        .startObject()
                        .field("name", "张云雷")
                        .field("age", 26)
                        .field("salary",2000)
                        .field("team" , "war")
                        .field("position" , "pf")
                        .endObject()
                )
        );
        bulkRequest.add(client.prepareIndex("player", "player", "6")
                .setSource(jsonBuilder()
                        .startObject()
                        .field("name", "爱迪生")
                        .field("age", 40)
                        .field("salary",1000)
                        .field("team" , "tim")
                        .field("position" , "pf")
                        .endObject()
                )
        );
        bulkRequest.add(client.prepareIndex("player", "player", "7")
                .setSource(jsonBuilder()
                        .startObject()
                        .field("name", "牛顿")
                        .field("age", 21)
                        .field("salary",500)
                        .field("team" , "tim")
                        .field("position" , "c")
                        .endObject()
                )
        );
        bulkRequest.add(client.prepareIndex("player", "player", "4")
                .setSource(jsonBuilder()
                        .startObject()
                        .field("name", "爱因斯坦")
                        .field("age", 21)
                        .field("salary",300)
                        .field("team" , "tim")
                        .field("position" , "sg")
                        .endObject()
                )
        );
        bulkRequest.add(client.prepareIndex("player", "player", "8")
                .setSource(jsonBuilder()
                        .startObject()
                        .field("name", "特斯拉")
                        .field("age", 20)
                        .field("salary",500)
                        .field("team" , "tim")
                        .field("position" , "sf")
                        .endObject()
                )
        );


        BulkResponse bulkResponse = bulkRequest.get();
        client.close();
    }

```

 

#### 需求一：统计每个球队当中球员的数量

sql语句实现

```
select team, count(*) as player_count from player group by team;
```

使用javaAPI实现

```java
@Test
public void groupAndCount() {
    //1：构建查询提交
    SearchRequestBuilder builder = client.prepareSearch("player").setTypes("player");
    //2：指定聚合条件
    TermsAggregationBuilder team = AggregationBuilders.terms("player_count").field("team");
    //3:将聚合条件放入查询条件中
    builder.addAggregation(team);
    //4:执行action，返回searchResponse
    SearchResponse searchResponse = builder.get();
    Aggregations aggregations = searchResponse.getAggregations();
    for (Aggregation aggregation : aggregations) {
        StringTerms stringTerms = (StringTerms) aggregation;
        List<StringTerms.Bucket> buckets = stringTerms.getBuckets();
        for (StringTerms.Bucket bucket : buckets) {
            System.out.println(bucket.getKey());
            System.out.println(bucket.getDocCount());
        }
    }
}

```

 

#### 需求二：统计每个球队中每个位置的球员数量

sql语句实现

```
select team, position, count(*) as pos_count from player group by team, position;
```

java代码实现

```java
/**
 * 统计每个球队中每个位置的球员数量
 */
@Test
public void teamAndPosition(){
    SearchRequestBuilder builder = client.prepareSearch("player").setTypes("player");
    TermsAggregationBuilder team = AggregationBuilders.terms("player_count").field("team");
    TermsAggregationBuilder position = AggregationBuilders.terms("posititon_count").field("position");
    team.subAggregation(position);
    SearchResponse searchResponse = builder.addAggregation(team).addAggregation(position).get();
    Aggregations aggregations = searchResponse.getAggregations();
    for (Aggregation aggregation : aggregations) {
       // System.out.println(aggregation.toString());
        StringTerms stringTerms = (StringTerms) aggregation;
        List<StringTerms.Bucket> buckets = stringTerms.getBuckets();
        for (StringTerms.Bucket bucket : buckets) {
            long docCount = bucket.getDocCount();
            Object key = bucket.getKey();
            System.out.println("当前队伍名称为" +  key + "该队伍下有"+docCount + "个球员");

            Aggregation posititon_count = bucket.getAggregations().get("posititon_count");
            if(null != posititon_count){
                StringTerms positionTrem = (StringTerms) posititon_count;
                List<StringTerms.Bucket> buckets1 = positionTrem.getBuckets();
                for (StringTerms.Bucket bucket1 : buckets1) {
                    Object key1 = bucket1.getKey();
                    long docCount1 = bucket1.getDocCount();
                    System.out.println("该队伍下面的位置为" +  key1+"该位置下有" +  docCount1 +"人");
                }
            }
        }
    }
}

```

 

#### 需求三：分组求各种值

计算每个球队年龄最大值

```
select team, max(age) as max_age from player group by team;
```

```java
/**
 * 计算每个球队年龄最大值
 */
@Test
public  void groupAndMax(){
    SearchRequestBuilder builder = client.prepareSearch("player").setTypes("player");
    TermsAggregationBuilder team = AggregationBuilders.terms("team_group").field("team");

    MaxAggregationBuilder age = AggregationBuilders.max("max_age").field("age");

    team.subAggregation(age);
    SearchResponse searchResponse = builder.addAggregation(team).get();
    Aggregations aggregations = searchResponse.getAggregations();
    for (Aggregation aggregation : aggregations) {
        StringTerms stringTerms = (StringTerms) aggregation;
        List<StringTerms.Bucket> buckets = stringTerms.getBuckets();
        for (StringTerms.Bucket bucket : buckets) {
            Aggregation max_age = bucket.getAggregations().get("max_age");
            System.out.println(max_age.toString());
        }
    }
}

```

 

#### 需求四：统计每个球队年龄最小值

计算每个球队年龄最大/最小/总/平均的球员年龄

```
select team, min(age) as min_age from player group by team;
```

```java
/**
 * 统计每个球队中年龄最小值
 */
@Test
public  void  teamMinAge(){

    SearchRequestBuilder builder = client.prepareSearch("player").setTypes("player");

    TermsAggregationBuilder team = AggregationBuilders.terms("team_count").field("team");

    MinAggregationBuilder age = AggregationBuilders.min("min_age").field("age");

    TermsAggregationBuilder termAggregation = team.subAggregation(age);

    SearchResponse searchResponse = builder.addAggregation(termAggregation).get();
    Aggregations aggregations = searchResponse.getAggregations();
    for (Aggregation aggregation : aggregations) {
        System.out.println(aggregation.toString());

        StringTerms stringTerms = (StringTerms) aggregation;
        List<StringTerms.Bucket> buckets = stringTerms.getBuckets();
        for (StringTerms.Bucket bucket : buckets) {
            Aggregations aggregations1 = bucket.getAggregations();
            for (Aggregation aggregation1 : aggregations1) {
                System.out.println(aggregation1.toString());
            }
        }
    }
}

```

 

#### 需求五：分组求平均值

计算每个球队年龄最大/最小/总/平均的球员年龄

```
select team, avg(age) as max_age from player group by team;
```

```java
/**
 * 计算每个球队的年龄平均值
 */
@Test
public void avgTeamAge(){
    SearchRequestBuilder builder = client.prepareSearch("player").setTypes("player");

    TermsAggregationBuilder team_field = AggregationBuilders.terms("player_count").field("team");

    AvgAggregationBuilder age_avg = AggregationBuilders.avg("age_avg").field("age");

    team_field.subAggregation(age_avg);

    SearchResponse searchResponse = builder.addAggregation(team_field).get();

    Aggregations aggregations = searchResponse.getAggregations();
    for (Aggregation aggregation : aggregations) {
        System.out.println(aggregation.toString());
        StringTerms stringTerms = (StringTerms) aggregation;
    }

}

```



#### 需求六：分组求和

计算每个球队球员的平均年龄，同时又要计算总年薪

```
select team, avg(age)as avg_age, sum(salary) as total_salary from player group by team;
```

```java
/**
 * 统计每个球队当中的球员平均年龄，以及队员总年薪
 */
@Test
public void avgAndSum(){
    SearchRequestBuilder builder = client.prepareSearch("player").setTypes("player");

    TermsAggregationBuilder team_group = AggregationBuilders.terms("team_group").field("team");

    AvgAggregationBuilder avg_age = AggregationBuilders.avg("avg_age").field("age");

    SumAggregationBuilder sumMoney = AggregationBuilders.sum("sum_money").field("salary");


    TermsAggregationBuilder termsAggregationBuilder = team_group.subAggregation(avg_age).subAggregation(sumMoney);

    SearchResponse searchResponse = builder.addAggregation(termsAggregationBuilder).get();
    Aggregations aggregations = searchResponse.getAggregations();
    for (Aggregation aggregation : aggregations) {
        System.out.println(aggregation.toString());
    }


}

```

 

#### 需求七：聚合排序

计算每个球队总年薪，并按照总年薪倒序排列

```java
/**
 * 计算每个球队总年薪，并按照年薪进行排序
 *     select team, sum(salary) as total_salary from player group by team order by total_salary desc;
 */
@Test
public void orderBySum(){
    SearchRequestBuilder builder = client.prepareSearch("player").setTypes("player");
    TermsAggregationBuilder teamGroup = AggregationBuilders.terms("team_group").field("team").order(BucketOrder.count(true));
    SumAggregationBuilder sumSalary = AggregationBuilders.sum("sum_salary").field("salary");
    TermsAggregationBuilder termsAggregationBuilder = teamGroup.subAggregation(sumSalary);
    SearchResponse searchResponse = builder.addAggregation(termsAggregationBuilder).get();

    Map<String, Aggregation> stringAggregationMap = searchResponse.getAggregations().asMap();
    System.out.println(stringAggregationMap.toString());
    Aggregations aggregations = searchResponse.getAggregations();
    for (Aggregation aggregation : aggregations) {
        System.out.println(aggregation.toString());
    }
}

```

 

### 12、ES当中的地理位置搜索

ES不仅可以对我们的数据进行聚合操作，还可以针对我们的地理位置经纬度进行搜索，可以通过ES搜索我们附近的人等等各种基于地理位置的需求

经纬度在线解析网站

http://www.gpsspg.com/maps.htm

#### 第一步：创建索引库并添加数据

直接在kibana当中通过以下操作创建索引库，并添加一条数据

```json
PUT platform_foreign_website
{
  "mappings": {
     "store":{
      "properties": {
         "id": {
            "type": "text"
            },
          "storeName": {
            "type": "text"
          },
          "location":{
            "type": "geo_point"
          }
    }
     }
  }
}

```

添加数据

```json
40.0488115498,116.4320345091
PUT /platform_foreign_website/store/40?pretty
{"id": "40", "storeName": "北京市北京市朝阳区清河营东路2号院","longitude":116.4320345091,"latitude":40.0488115498,"isdelete":true,"location":{
    "lat":40.0488115498,
    "lon":116.4320345091
  
}
}

40.0461174292,116.4360685514
PUT /platform_foreign_website/store/41?pretty
{"id": "40", "storeName": "北京市北京市朝阳区北苑东路","longitude":116.4360685514,"latitude":40.0461174292,"isdelete":false,"location":{
    "lat":40.0461174292,
    "lon":116.4360685514
  
}
}

40.0519526142,116.4178513254
PUT /platform_foreign_website/store/42?pretty
{"id": "42", "storeName": "北京市北京市朝阳区立通路","longitude":116.4178513254,"latitude":40.0519526142,"isdelete":true,"location":{
    "lat":40.0519526142,
    "lon":116.4178513254
  
}
}

40.0503813013,116.4562592119
PUT /platform_foreign_website/store/43?pretty
{"id": "43", "storeName": "北京市北京市朝阳区来广营北路","longitude":116.4562592119,"latitude":40.0503813013,"isdelete":false,"location":{
    "lat":40.0503813013,
    "lon":116.4562592119
  
}
}

40.0385828363,116.4465266673
PUT /platform_foreign_website/store/44?pretty
{"id": "44", "storeName": "北京市北京市朝阳区顺白路","longitude":116.4465266673,"latitude":40.0385828363,"isdelete":false,"location":{
    "lat":40.0385828363,
    "lon":116.4465266673
  
}
}

```

查询所有的数据

```json
GET /platform_foreign_website/store/_search?pretty
{
    "query": {
        "match_all": {}
    }
}
```

 

#### 第二步：添加以下jar包坐标依赖

```xml
<!-- https://mvnrepository.com/artifact/org.locationtech.spatial4j/spatial4j -->
<dependency>
    <groupId>org.locationtech.spatial4j</groupId>
    <artifactId>spatial4j</artifactId>
    <version>0.6</version>
</dependency>
<dependency>
    <groupId>com.vividsolutions</groupId>
    <artifactId>jts</artifactId>
    <version>1.13</version>
    <exclusions>
        <exclusion>
            <groupId>xerces</groupId>
            <artifactId>xercesImpl</artifactId>
        </exclusion>
    </exclusions>
</dependency>

```

这里说了 geo_distance（找出与指定位置在给定距离内的点） 和 geo_polygon（找出落在多边形中的点）两种方法，elasticsearch其实还有另外两种 方法 geo_bounding_box（找出落在指定矩形框中的坐标点） 和 geo_distance_range（找出与指定点距离在给定最小距离和最大距离之间的点），因为需求没有涉及到暂时没有调研，以后会慢慢晚上

 

#### 第三步：使用javaAPI来实现基于地理位置的搜索

http://www.gpsspg.com/maps.htm

经纬度在线解析

```java
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.geo.GeoPoint;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.TransportAddress;
import org.elasticsearch.common.unit.DistanceUnit;
import org.elasticsearch.index.query.*;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.transport.client.PreBuiltTransportClient;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;

public class ESOperate {
    public static void main(String[] args) throws UnknownHostException {
        Settings settings = Settings.builder()
                .put("cluster.name", "myes")
                .build();

        TransportClient client = new PreBuiltTransportClient(settings)
                .addTransportAddress(new TransportAddress(InetAddress.getByName("node03"), 9300));

        /**
         * 找出落在指定矩形框当中的坐标点
         *
         40.0519526142,116.4178513254

         40.0385828363,116.4465266673
         */
        SearchResponse searchResponse = client.prepareSearch("platform_foreign_website")
                .setTypes("store")
                .setQuery(QueryBuilders.geoBoundingBoxQuery("location")
                        .setCorners(40.0519526142, 116.4178513254, 40.0385828363, 116.4465266673))
                .get();

        for(SearchHit searchHit : searchResponse.getHits().getHits()) {
            System.out.println(searchHit.getSourceAsString());
        }

        /**|
         * 找出坐落在多边形当中的坐标点
         *
         * 40.0519526142,116.4178513254
         *
         *          40.0519526142,116.4178513254
         *
         *          40.0385828363,116.4465266673
         *
         *
         */
        List<GeoPoint> points = new ArrayList<GeoPoint>();
        points.add(new GeoPoint(40.0519526142, 116.4178513254));
        points.add(new GeoPoint(40.0519526142, 116.4178513254));
        points.add(new GeoPoint(40.0385828363, 116.4465266673));
        searchResponse = client.prepareSearch("platform_foreign_website")
                .setTypes("store")
                .setQuery(QueryBuilders.geoPolygonQuery("location", points))
                .get();

        for(SearchHit searchHit : searchResponse.getHits().getHits()) {
            System.out.println(searchHit.getSourceAsString());
        }
        System.out.println("==================================================");

        /**
         * 以当前的点为中心，搜索落在半径范围内200公里的经纬度坐标点
         *40.0488115498,116.4320345091
         */
        searchResponse = client.prepareSearch("platform_foreign_website")
                .setTypes("store")
                .setQuery(QueryBuilders.geoDistanceQuery("location")
                        .point(40.0488115498, 116.4320345091)
                        .distance(200, DistanceUnit.KILOMETERS))
                .get();

        for(SearchHit searchHit : searchResponse.getHits().getHits()) {
            System.out.println(searchHit.getSourceAsString());
        }

        client.close();
    }
}

```



### 13、elasticsearch 的sql插件使用

对于这些复杂的查询，es使用javaAPI都可以实现，但是相较于sql语句来说，我们更加熟悉sql语句，所以es也提供了sql语句的开发，让我们通过sql语句即可实现ES的查询，接下来我们就来安装并学习sql的插件的使用方法吧！

在es版本6.3之前都不支持sql语句的开发，如果需要使用sql语句来开发es的数据查询，那么我们需要手动的自己安装插件，插件下载地址如下，

[https://github.com/NLPchina/elasticsearch-sql/](https://github.com/NLPchina/elasticsearch-sql/、)

但是在6.3版本之后，es自带就安装了sql的插件，我们可以直接通过sql语句的方式实现es当中的数据查询

对于sql语句的使用，es给我们提供了三种方式，接下来我们分别看看三种方式如何实现es数据的查询

#### 第一种方式：通过rest风格实现数据的查询

##### 第一步：使用rest方式向索引库当中添加数据

使用kibana向索引库当中添加数据

```json
PUT /library/book/_bulk?refresh
{"index":{"_id": "Leviathan Wakes"}}
{"name": "Leviathan Wakes", "author": "James S.A. Corey", "release_date": "2011-06-02", "page_count": 561}
{"index":{"_id": "Hyperion"}}
{"name": "Hyperion", "author": "Dan Simmons", "release_date": "1989-05-26", "page_count": 482}
{"index":{"_id": "Dune"}}
{"name": "Dune", "author": "Frank Herbert", "release_date": "1965-06-01", "page_count": 604}
```



##### 第二步：使用rest风格方式查询数据

```json
curl -X POST "node01:9200/_xpack/sql?format=txt" -H 'Content-Type: application/json' -d'
{
    "query": "SELECT * FROM library WHERE release_date < \u00272000-01-01\u0027"
}'
```



#### 第二种方式：使用sql脚本的方式进入sql客户端进行查询

我们也可以使用sql脚本的方式，进入sql客户端，通过sql语句的方式实现数据的查询

##### 第一步：node01进入sql脚本客户端

node01执行以下命令进入sql脚本客户端

```
cd /kkb/install/elasticsearch-6.7.0

bin/elasticsearch-sql-cli node01:9200
```

 

##### 第二步：执行sql语句

```
sql> select * from library;
```

```sql
     author     |     name      |  page_count   |      release_date      
----------------+---------------+---------------+------------------------
Dan Simmons     |Hyperion       |482            |1989-05-26T00:00:00.000Z
James S.A. Corey|Leviathan Wakes|561            |2011-06-02T00:00:00.000Z
Frank Herbert   |Dune           |604            |1965-06-01T00:00:00.000Z
```



#### 第三种方式：通过jdbc连接的方式

当然了，我们也可以通过jdbc连接的方式，通过java代码来实现ES当中数据的查询操作

官网介绍操作连接

https://www.elastic.co/guide/en/elasticsearch/reference/6.7/sql-jdbc.html

使用javaAPI访问数据库当中的数据，会产生一个错误，参见这篇文章

https://www.cnblogs.com/hts-technology/p/9282421.html

##### 第一步：导入jar包

在我们的maven依赖中添加以下坐标，导入es-sql的jar包

 

```xml
<repositories>
        <repository>
            <id>elastic.co</id>
            <url>https://artifacts.elastic.co/maven</url>
        </repository>
    </repositories>

	<dependency>
            <groupId>org.elasticsearch.plugin</groupId>
            <artifactId>x-pack-sql-jdbc</artifactId>
            <version>6.7.0</version>
        </dependency>

```



##### 第二步：开发java代码，实现查询

通过java代码，使用jdbc连接es服务器，然后查询数据

```java
@Test
    public void esJdbc() throws SQLException {
        EsDataSource dataSource = new EsDataSource();
        String address = "jdbc:es://http://node01:9200" ;
        dataSource.setUrl(address);
        Properties connectionProperties = new Properties();
        dataSource.setProperties(connectionProperties);
        Connection connection = dataSource.getConnection();
        Statement statement = connection.createStatement();
        ResultSet resultSet = statement.executeQuery("select * from library");
        while(resultSet.next()){
            String string = resultSet.getString(0);
            String string1 = resultSet.getString(1);
            int anInt = resultSet.getInt(2);
            String string2 = resultSet.getString(4);
            System.out.println(string + "\t" +  string1 + "\t" +  anInt + "\t" + string2);
        }
        connection.close();
    }

```

### 14、ES集群生产调优

#### 1、服务器硬件以及内存调优

##### 1、调整交换区的swap大小

关闭系统的交换区，禁用linux的虚拟内存，尽量让我们的ES禁用虚拟内存，因为如果使用虚拟内存，就会将内存当中过多的数据缓存到磁盘上面去，可以简单理解为就是拿了一块磁盘出来当做内存使用，这样当然性能就会急剧下降，所以在实际工作当中我们一般的都会尽量关闭linux的交换区的内存空间

关闭交换区的空间大小

```sh
swapoff -a
```

如果不能完全禁用swap交换区的空间大小，我们可以调整设置，尽量减少swap的空间，通过调整交换区内存空间大小，来调整我们的交换比例

swappiness参数值可设置范围在0到100之间。 低参数值会让内核尽量少用交换，更高参数值会使内核更多的去使用交换空间。默认值为60

```
vim /etc/sysctl.conf

vm.swappiness=1
```

如果没法更改我们的swap的参数值，那么我们也可以在es当中配置，禁止JVM堆内存当中的数据交换到磁盘当中去

```
cd /kkb/install/elasticsearch-6.7.0/config/

vim elasticsearch.yml
```

```
bootstrap.memory_lock:true
```

##### 2、调整普通用户打开文件数以及线程数的限制

###### 普通用户打开文件的最大数限制

ES因为需要大量的创建索引文件，需要大量的打开系统的文件，所以我们需要解除linux系统当中打开文件最大数目的限制，不然ES启动就会抛错

三台机器使用es用户执行以下命令解除打开文件数据的限制

```
sudo vi /etc/security/limits.conf
```

```sh
* soft nofile 65536
* hard nofile 131072
* soft nproc 2048
* hard nproc 4096
```

###### 普通用户启动线程数限制

三台机器执行以下命令打开文件最大数

```
sudo vi /etc/sysctl.conf
```

```
vm.max_map_count=655360

fs.file-max=655360
```

执行以下命令生效

```
sudo sysctl -p
```

注意：以上两个问题修改完成之后，一定要重新连接linux生效。关闭secureCRT或者XShell工具，然后重新打开工具连接linux即可

 

##### 3、调整ES的JVM堆内存大小

官方建议ES的堆内存大小不要超过32GB，超过32GB之后，反而会造成大量的内存的浪费，所以我们在ES当中，JVM堆内存大小，尽量调整成小于32GB，其中堆内存大小与系统内存大小，尽量五五分，例如一台服务器64GB，那么我们可以给ES堆内存大小设置为32GB，剩下的32GB留作OS cache ，当做系统内存留给lucene来使用（因为ES底层也是基于lucene的）

调整堆内存大小的官方建议

https://www.elastic.co/guide/cn/elasticsearch/guide/current/heap-sizing.html

```
cd /kkb/install/elasticsearch-6.7.0/config
vim jvm.options
```

```
-Xms32g
-Xmx32g
```

#### 2、ES的参数调优

##### 1、ES集群自动发现机制

配置ES集群的自动发现机制

```
discovery.zen.ping.unicast.hosts: ["node01", "node02", "node03"]
```

配置在每轮ping操作中等待DNS主机名查找的超时时间。需要指定[时间单位](https://www.elastic.co/guide/en/elasticsearch/reference/current/common-options.html#time-units)，默认为5秒。

```
discovery.zen.ping.unicast.resolve_timeout:30
```

##### 2、集群的主节点选举

ES集群当中的节点角色介绍

###### Master

 主要负责集群中索引的创建、删除以及数据的Rebalance等操作。Master不负责数据的索引和检索，所以负载较轻。当Master节点失联或者挂掉的时候，ES集群会自动从其他Master节点选举出一个Leader。为了防止脑裂，常常设置参数为discovery.zen.minimum_master_nodes=N/2+1，其中N为集群中Master节点的个数。建议集群中Master节点的个数为奇数个，如3个或者5个。

设置为Master节点的方式如下：

```sh
node.master: true  #设置为主节点

node.data: false  #不是数据节点

node.ingest: false  #不是ingest 节点

search.remote.connect: false  #禁用跨集群查询
```

###### Data Node

主要负责集群中数据的索引和检索，一般压力比较大。建议和Master节点分开，避免因为Data Node节点出问题影响到Master节点。

设置一个节点为Data Node节点的方式如下：

```sh
node.master: false    #不是主节点
node.data: true       #作为数据二级店
node.ingest: false    ## 不是ingest节点
search.remote.connect: false   #禁用跨群查询
```

###### Coordinating Node

协作节点，主要用于协作处理集群当中的一些事情

```sh
node.master: false    #不是主节点
node.data: true       #作为数据二级店
node.ingest: false    ## 不是ingest节点
search.remote.connect: false   #禁用跨集群查询
```

###### Ingest Node

 Ingest node专门对索引的文档做预处理，实际中不常用，除非文档在索引之前有大量的预处理工作需要做。Ingest node设置如下：

```sh
node.master: false node.master: false         
node.master: false 
node.data: false
node.ingest: true
search.remote.connect: false
```

以上节点当中最重要的就是Master Node，这个节点关系着我们集群的生死存放，我们可以通过设置多个master node作为我们集群当中的主节点，其中多个master node会通过选举机制实现选择一个master node作为active，其他的作为standBy，如果master active状态的主节点宕机，es会从其他的standBy状态的主节点当中重新选择一个新的作为active状态的节点

控制节点加入某个集群或者开始选举的响应时间(默认3s)

discovery.zen.ping_timeout:3

在网络缓慢时，3秒时间可能不够，这种情况下，需要慎重增加超时时间，增加超时时间会减慢选举进程

 

一旦节点决定加入一个存在的集群，它会发出一个加入请求给主节点，这个请求的超时时间由`discovery.zen.join_time`控制，默认是 ping 超时时间(`discovery.zen.ping_timeout`)的20倍

 

当主节点停止或者出现问题，集群中的节点会重新 ping 并选举一个新节点。有时一个节点也许会错误的认为主节点已死，所以这种 ping 操作也可以作为部分网络故障的保护性措施。在这种情况下，节点将只从其他节点监听有关当前活动主节点的信息。

如果`discovery.zen.master_election.ignore_non_master_pings`设置为`true`时（默认值为`false`），`node.master`为`false`的节点不参加主节点的选举，同时选票也不包含这种节点。

通过设置`node.master`为`false`，可以将节点设置为非备选主节点，永远没有机会成为主节点。

`discovery.zen.minimum_master_nodes`设置了最少有多少个备选主节点参加选举，同时也设置了一个主节点需要控制最少多少个备选主节点才能继续保持主节点身份。如果控制的备选主节点少于`discovery.zen.minimum_master_nodes`个，那么当前主节点下台，重新开始选举。

`discovery.zen.minimum_master_nodes`必须设置一个恰当的备选主节点值(`quonum`，一般设置 为备选主节点数/2+1)，尽量避免只有两个备选主节点，因为两个备选主节点`quonum`应该为2，那么如果一个节点出现问题，另一个节点的同意人数最多只能为1，永远也不能选举出新的主节点，这时就发生了脑裂现象。

 

##### 3、集群的故障检测

有两个故障检测进程在集群的生命周期中一直运行。一个是主节点的，ping集群中所有的其他节点，检查他们是否活着。另一种是每个节点都ping主节点，确认主节点是否仍在运行或者是否需要重新启动选举程序。

使用`discovery.zen.fd`前缀设置来控制故障检测过程，配置如下

| **配置**                       | **描述**                      |      |
| ------------------------------ | ----------------------------- | ---- |
| discovery.zen.fd.ping_interval | 节点多久ping一次，默认1s      |      |
| discovery.zen.fd.ping_timeout  | 等待响应时间，默认30s         |      |
| discovery.zen.fd.ping_retries  | 失败或超时后重试的次数，默认3 |      |

 

##### 4、集群状态更新

主节点是唯一一个能够更新集群状态的节点。主节点一次处理一个群集状态更新，应用所需的更改并将更新的群集状态发布到群集中的所有其他节点。当其他节点接收到状态时，先确认收到消息，但是不应用最新状态。如果主节点在规定时间（`discovery.zen.commit_timeout` ，默认30s）内没有收到大多数节点(`discovery.zen.minimum_master_nodes`)的确认，集群状态更新不被通过。

一旦足够的节点响应了更新的消息，新的集群状态(cluster state)被提交并且会发送一条消息给所有的节点。这些节点开始在内部应用新的集群状态。在继续处理队列中的下一个更新之前，主节点等待所有节点响应，直到超时(`discovery.zen.publish_timeout`，默认设置为30秒)。上述两个超时设置都可以通过[集群更新设置api](https://www.elastic.co/guide/en/elasticsearch/reference/current/cluster-update-settings.html)动态更改。

 

 

##### 5、no Master block机制

对于一个可以正常充分运作的集群来说，必须拥有一个活着的主节点和正常数量(discovery.zen.minimum_master_nodes个)活跃的备选主节点。discovery.zen.no_master_block设置了没有主节点时限制的操作。它又两个可选参数

all：所有操作均不可做，读写、包括集群状态的读写api，例如获得索引配置(index settings)，putMapping，和集群状态(cluster state)api

write：默认为write，写操作被拒绝执行，基于最后一次已知的正常的集群状态可读，这也许会读取到已过时的数据。

discovery.zen.no_master_block，对于节点相关的基本api，这个参数是无效的，如集群统计信息(cluster stats)，节点信息(node info)，节点统计信息(node stats)。对这些api的请求不会被阻止，并且可以在任何可用节点上运行。

 

##### 6、增加 Refresh 时间间隔

为了提高索引性能，Elasticsearch 在写入数据时候，采用延迟写入的策略，即数据先写到内存中，当超过默认 1 秒 （index.refresh_interval）会进行一次写入操作，就是将内存中 segment 数据刷新到操作系统中，此时我们才能将数据搜索出来，所以这就是为什么 Elasticsearch 提供的是**近实时**搜索功能，而不是实时搜索功能。

当然像我们的内部系统对数据延迟要求不高的话，我们可以通过延长 refresh 时间间隔，可以有效的减少 segment 合并压力，提供索引速度。在做全链路跟踪的过程中，我们就将 index.refresh_interval 设置为 30s，减少 refresh 次数。

同时，在进行全量索引时，可以将 refresh 次数临时关闭，即 index.refresh_interval 设置为 -1，数据导入成功后再打开到正常模式，比如 30s。

 

##### 7、综合调优概览

ES调优综合参数设置概览：

```sh
index.merge.scheduler.max_thread_count:1 ## 索引 merge ***线程数 

indices.memory.index_buffer_size:30%   ## 内存

index.translog.durability:async ## 这个可以异步写硬盘，增大写的速度 

index.translog.sync_interval:120s #translog 间隔时间 

discovery.zen.ping_timeout:120s ## 心跳超时时间 

discovery.zen.fd.ping_interval:120s   ## 节点检测时间

discovery.zen.fd.ping_timeout:120s   #ping 超时时间

discovery.zen.fd.ping_retries:6   ## 心跳重试次数

thread_pool.bulk.size:20 ## 写入线程个数 由于我们查询线程都是在代码里设定好的，我这里只调节了写入的线程数

thread_pool.bulk.queue_size:1000 ## 写入线程队列大小 

index.refresh_interval:300s #index 刷新间隔复制代码
```



## LogStash日志数据采集

### 1、LogStash介绍及安装

官网：

https://www.elastic.co/guide/en/logstash/current/index.html

#### 1.1、介绍

logstash就是一个具备实时数据传输能力的管道，负责将数据信息从管道的输入端传输到管道的输出端；与此同时这根管道还可以让你根据自己的需求在中间加上滤网，Logstash提供里很多功能强大的滤网以满足你的各种应用场景。是一个input | filter | output 的数据流。

#### 1.2 、node01机器安装LogStash

下载logstache并上传到第一台服务器的/home/es路径下，然后进行解压

下载安装包---可以直接将已经下载好的安装包上传到/home/es路径下即可

```sh
cd /kkb/soft 
wget https://artifacts.elastic.co/downloads/logstash/logstash-6.7.0.tar.gz
## 解压
tar -zxf logstash-6.7.0.tar.gz -C /kkb/install/
```

#### 1.3、Input插件

##### 1.3.1 stdin标准输入和stdout标准输出

使用标准的输入与输出组件，实现将我们的数据从控制台输入，从控制台输出

```sh
cd /kkb/install/logstash-6.7.0/
bin/logstash -e 'input{stdin{}}output{stdout{codec=>rubydebug}}'
```

 ![image-20200519012821127](elk.assets/image-20200519012821127.png)

```json
{
      "@version" => "1",
          "host" => "node01",
    "@timestamp" => 2018-10-13T08:33:13.126Z,
       "message" => "hello"
}

```

##### 1.3.2 监控日志文件变化

Logstash 使用一个名叫 *FileWatch* 的 Ruby Gem 库来监听文件变化。这个库支持 glob 展开文件路径，而且会记录一个叫 *.sincedb* 的数据库文件来跟踪被监听的日志文件的当前读取位置。所以，不要担心 logstash 会漏过你的数据。

###### 编写脚本

```
cd /kkb/install/logstash-6.7.0/config

vim monitor_file.conf
```

```json
input{
    file{
        path => "/kkb/install/datas/tomcat.log"
        type => "log"
        start_position => "beginning"
    }
}
output{
        stdout{
        codec=>rubydebug
        }
}

```

###### 检查配置文件是否可用

```sh
cd /kkb/install/logstash-6.7.0/
bin/logstash -f /kkb/install/logstash-6.7.0/config/monitor_file.conf -t
```

成功会出现一下信息：

```
 Config Validation Result: OK. Exiting Logstash
```

###### 启动服务

```sh
cd /kkb/install/logstash-6.7.0

bin/logstash -f /kkb/install/logstash-6.7.0/config/monitor_file.conf
```

###### 发送数据

新开xshell窗口通过以下命令发送数据

```
mkdir -p /kkb/install/datas

echo "hello logstash" >> /kkb/install/datas/tomcat.log
```

###### 其它参数说明

```scala
Path=>表示监控的文件路径
Type=>给类型打标记，用来区分不同的文件类型。
Start_postion=>从哪里开始记录文件，默认是从结尾开始标记，要是你从头导入一个文件就把改成”beginning”.
discover_interval=>多久去监听path下是否有文件，默认是15s
exclude=>排除什么文件
close_older=>一个已经监听中的文件，如果超过这个值的时间内没有更新内容，就关闭监听它的文件句柄。默认是3600秒，即一个小时。
sincedb_path=>监控库存放位置(默认的读取文件信息记录在哪个文件中)。默认在：/data/plugins/inputs/file。
sincedb_write_interval=> logstash 每隔多久写一次 sincedb 文件，默认是 15 秒。
stat_interval=>logstash 每隔多久检查一次被监听文件状态（是否有更新），默认是 1 秒。
```

##### 1.3.3、jdbc插件

jdbc插件允许我们采集某张数据库表当中的数据到我们的logstashe当中来

###### 第一步：编写脚本

开发脚本配置文件

```
cd /kkb/install/logstash-6.7.0/config

vim jdbc.conf
```

```scala
input {
  jdbc {
    jdbc_driver_library => "/kkb/install/mysql-connector-java-5.1.38.jar"
    jdbc_driver_class => "com.mysql.jdbc.Driver"
    jdbc_connection_string => "jdbc:mysql://192.168.31.82:3306/mydb"
    jdbc_user => "root"
    jdbc_password => "123456"

    use_column_value => true
    tracking_column => "tno"
  ##  parameters => { "favorite_artist" => "Beethoven" }
    schedule => "* * * * *"
    statement => "SELECT * from courses where tno > :sql_last_value ;"
  }
}



output{
        stdout{
        codec=>rubydebug
        }
}

```

###### 第二步：上传mysql连接驱动包到指定路劲

将我们mysql的连接驱动包上传到我们指定的/kkb/install/路径下

###### 第三步：检查配置文件是否可用

```
cd /kkb/install/logstash-6.7.0/

bin/logstash -f /kkb/install/logstash-6.7.0/config/jdbc.conf -t
```

通过之后

```
 Config Validation Result: OK. Exiting Logstash
```

###### 第四步：启动服务

通过以下命令启动logstash

```
cd /kkb/install/logstash-6.7.0

bin/logstash -f /kkb/install/logstash-6.7.0/config/jdbc.conf
```

###### 第五步：数据库当中添加数据

在我们的数据库当中手动随便插入数据，发现我们的logstash可以进行收集

##### 1.3.4 systlog插件

**syslog****机制负责记录内核和应用程序产生的日志信息，管理员可以通过查看日志记录，来掌握系统状况**

默认系统已经安装了rsyslog.直接启动即可

###### 编写脚本

```
cd /kkb/install/logstash-6.7.0/config

vim syslog.conf
```

```scala
input{
    tcp{
        port=> 6789
        type=> syslog
    }
    udp{
        port=> 6789
        type=> syslog
    }
}

filter{
    if [type] == "syslog" {
        grok {
                match => { "message" => "%{SYSLOGTIMESTAMP:syslog_timestamp} %{SYSLOGHOST:syslog_hostname} %{DATA:syslog_program}(?:\[%{POSINT:syslog_pid}\])?: %{GREEDYDATA:syslog_message}" }
                add_field => [ "received_at", "%{@timestamp}" ]
                add_field => [ "received_from", "%{host}" ]
        }
       date {
             match => [ "syslog_timestamp", "MMM  d HH:mm:ss", "MMM dd HH:mm:ss" ]
           }
    }
}

output{
    stdout{
        codec=> rubydebug
    }
}

```



###### 检查配置文件是否可用

```
cd /kkb/install/logstash-6.7.0

bin/logstash -f /kkb/install/logstash-6.7.0/config/syslog.conf -t
```

###### 启动服务

执行以下命令启动logstash服务

```
cd /kkb/install/logstash-6.7.0

bin/logstash -f /kkb/install/logstash-6.7.0/config/syslog.conf
```

###### 发送数据

修改系统日志配置文件

```
sudo vim /etc/rsyslog.conf
```

添加一行以下配置

```sh
*.* @@node01:6789
```

![image-20200519013251939](elk.assets/image-20200519013251939.png)

重启系统日志服务

```
sudo systemctl restart rsyslog
```

###### 其它参数说明

在logstash中的grok是正则表达式，用来解析当前数据

原始数据其实是：

```scala
Dec 23 12:11:43 louis postfix/smtpd[31499]: connect from unknown[95.75.93.154]
Jun 05 08:00:00 louis named[16000]: client 199.48.164.7#64817: query (cache) 'amsterdamboothuren.com/MX/IN' denied
Jun 05 08:10:00 louis CRON[620]: (www-data) CMD (php /usr/share/cacti/site/poller.php >/dev/null 2>/var/log/cacti/poller-error.log)
Jun 05 08:05:06 louis rsyslogd: [origin software="rsyslogd" swVersion="4.2.0" x-pid="2253" x-info="http://www.rsyslog.com"] rsyslogd was HUPed, type 'lightweight'.
```

#### 1.4、filter插件

Logstash之所以强悍的主要原因是filter插件；通过过滤器的各种组合可以得到我们想要的结构化数据。 

1、grok正则表达式

grok正则表达式是logstash非常重要的一个环节；可以通过grok非常方便的将数据拆分和索引 

语法格式： 

```sh
(?<name>pattern)  

？<name>表示要取出里面的值，pattern就是正则表达式 
```



##### 1、收集控制台输入数据，采集日期时间出来

###### 第一步：开发配置文件

```
cd /kkb/install/logstash-6.7.0/config/

vim filter.conf
```

```scala
input {stdin{}} filter {
        grok {
                match => {
"message" => "(?<date>\d+\.\d+)\s+"
                }       
        }       
}       
output {stdout{codec => rubydebug}}
```

###### 第二步：启动logstash服务

```
cd /kkb/install/logstash-6.7.0/

bin/logstash -f /kkb/install/logstash-6.7.0/config/filter.conf
```

###### 第三步：控制台输入文字

5.20 今天天气还不错

 ![image-20200519013431525](elk.assets/image-20200519013431525.png)

##### 2、使用grok收集nginx日志数据

nginx一般打印出来的日志格式如下

```nginx
36.157.150.1 - - [05/Nov/2018:12:59:28 +0800] "GET /phpmyadmin_8c1019c9c0de7a0f/js/get_scripts.js.php?scripts%5B%5D=jquery/jquery-1.11.1.min.js&scripts%5B%5D=sprintf.js&scripts%5B%5D=ajax.js&scripts%5B%5D=keyhandler.js&scripts%5B%5D=jquery/jquery-ui-1.11.2.min.js&scripts%5B%5D=jquery/jquery.cookie.js&scripts%5B%5D=jquery/jquery.mousewheel.js&scripts%5B%5D=jquery/jquery.event.drag-2.2.js&scripts%5B%5D=jquery/jquery-ui-timepicker-addon.js&scripts%5B%5D=jquery/jquery.ba-hashchange-1.3.js HTTP/1.1" 200 139613 "-" "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36"
```

这种日志是非格式化的，通常，我们获取到日志后，还要使用mapreduce 或者spark 做一下清洗操作，

就是将非格式化日志编程格式化日志；

在清洗的时候，如果日志的数据量比较大，那么也是需要花费一定的时间的；

所以可以使用logstash 的grok 功能，将nginx 的非格式化数据采集成格式化数据：

 

###### 第一步：安装grok插件

####### 第一种方式安装：在线安装（墙裂不推荐）

在线安装grok插件

```
cd /kkb/install/logstash-6.7.0/

vim Gemfile
```

```
#source 'https://rubygems.org'    ## 将这个镜像源注释掉
source https://gems.ruby-china.com/  ## 配置成中国的这个镜像源
```

准备在线安装

```
cd /kkb/install/logstash-6.7.0/

bin/logstash-plugin install logstash-filter-grok 
```

####### 第二种安装方式，直接使用我已经下载好的安装包进行本地安装（墙裂推荐使用）

上传我们的压缩包logstash-filter-grok-4.0.4.zip上传到/kkb/install/logstash-6.7.0 这个路径下面

然后准备执行本地安装

```sh
cd /kkb/install/logstash-6.7.0/
bin/logstash-plugin install file:///kkb/install/logstash-6.7.0/logstash-filter-grok-4.0.4.zip
```

安装成功之后查看logstash的插件列表

```
cd /kkb/install/logstash-6.7.0/

bin/logstash-plugin list
```

###### 第二步：开发logstash的配置文件

定义logstash的配置文件如下，我们从控制台输入nginx的日志数据，然后经过filter的过滤，将我们的日志文件转换成为标准的数据格式

```
cd /kkb/install/logstash-6.7.0/config

vim monitor_nginx.conf
```

```scala
input {stdin{}}
filter {
grok {
match => {
"message" => "%{IPORHOST:clientip} \- \- \[%{HTTPDATE:time_local}\] \"(?:%{WORD:method} %{NOTSPACE:request}(?:HTTP/%{NUMBER:httpversion})?|%{DATA:rawrequest})\" %{NUMBER:status} %{NUMBER:body_bytes_sent} %{QS:http_referer} %{QS:agent}"
         }
     }
}
output {stdout{codec => rubydebug}}
```



###### 第三步：启动logstash

执行以下命令启动logstash

```
cd /kkb/install/logstash-6.7.0

bin/logstash -f /kkb/install/logstash-6.7.0/config/monitor_nginx.conf
```

###### 第四步：从控制台输入nginx日志文件数据

输入第一条数据

```nginx
36.157.150.1 - - [05/Nov/2018:12:59:27 +0800] "GET /phpmyadmin_8c1019c9c0de7a0f/js/messages.php?lang=zh_CN&db=&collation_connection=utf8_unicode_ci&token=6a44d72481633c90bffcfd42f11e25a1 HTTP/1.1" 200 8131 "-" "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36"
```

输入第二条数据

```nginx
36.157.150.1 - - [05/Nov/2018:12:59:28 +0800] "GET /phpmyadmin_8c1019c9c0de7a0f/js/get_scripts.js.php?scripts%5B%5D=jquery/jquery-1.11.1.min.js&scripts%5B%5D=sprintf.js&scripts%5B%5D=ajax.js&scripts%5B%5D=keyhandler.js&scripts%5B%5D=jquery/jquery-ui-1.11.2.min.js&scripts%5B%5D=jquery/jquery.cookie.js&scripts%5B%5D=jquery/jquery.mousewheel.js&scripts%5B%5D=jquery/jquery.event.drag-2.2.js&scripts%5B%5D=jquery/jquery-ui-timepicker-addon.js&scripts%5B%5D=jquery/jquery.ba-hashchange-1.3.js HTTP/1.1" 200 139613 "-" "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36"
```

#### 1.5、 Output插件

##### 1.4.1 标准输出到控制台

将我们收集的数据直接打印到控制台

```scala
output {
    stdout {
        codec => rubydebug
    }
} 
```

```sh
bin/logstash -e 'input{stdin{}}output{stdout{codec=>rubydebug}}'
[es@node01 logstash]$ bin/logstash -e 'input{stdin{}}output{stdout{codec=>rubydebug}}'
hello
```

##### 1.4.2 将采集数据保存到file文件中

logstash也可以将收集到的数据写入到文件当中去永久保存，接下来我们来看看logstash如何配置以实现将数据写入到文件当中

###### 第一步：开发logstash的配置文件

```sh
cd /kkb/install/logstash-6.7.0/config
vim output_file.conf
```

```scala
input {stdin{}}
output {
    file {
        path => "/kkb/install/datas/%{+YYYY-MM-dd}-%{host}.txt"
        codec => line {
            format => "%{message}"
        }
        flush_interval => 0
    }
}
```

###### 第二步：检测配置文件并启动logstash服务

`cd /kkb/install/logstash-6.7.0`

检测配置文件是否正确

`bin/logstash -f config/output_file.conf -t`

启动服务，然后从控制台输入一些数据

`bin/logstash -f config/output_file.conf`

查看文件写入的内容

```
cd /kkb/install/datas	

more 2018-11-08-node01.hadoop.com.txt
```

 ![image-20200519014141486](elk.assets/image-20200519014141486.png)

 

##### 1.4.3 将采集数据保存到elasticsearch

###### 第一步：开发logstash的配置文件

```sh
cd /kkb/install/logstash-6.7.0/config
vim output_es.conf
```

```scala
input {stdin{}}
output {
    elasticsearch {
        hosts => ["node01:9200"]
        index => "logstash-%{+YYYY.MM.dd}"
    }
}
```

这个index是保存到elasticsearch上的索引名称，如何命名特别重要，因为我们很可能后续根据某些需求做查询，所以最好带时间，因为我们在中间加上type，就代表不同的业务，这样我们在查询当天数据的时候，就可以根据类型+时间做范围查询

###### 第二步：检测配置文件并启动logstash

检测配置文件是否正确

```
cd /kkb/install/logstash-6.7.0

bin/logstash -f config/output_es.conf -t 
```

启动logstash

```
bin/logstash -f config/output_es.conf
```

###### 第三步：es当中查看数据

访问

http://node01:9100/

查看es当中的数据

 ![image-20200519014246460](elk.assets/image-20200519014246460.png)

注意：

更多的input，filter，output组件参见以下链接

https://www.elastic.co/guide/en/logstash/current/index.html

## kibana报表展示

官网对于kibana的基本简介

https://www.elastic.co/guide/cn/kibana/current/index.html

kibana是一个强大的报表展示工具，可以通过kibana自定义我们的数据报表展示，实现我们的数据的各种图表查看

我们可以通过官网提供的数据集来实现我们的数据的报表展示

### 第一步：下载数据集

下载账户数据集

https://download.elastic.co/demos/kibana/gettingstarted/accounts.zip

下载日志数据集

https://download.elastic.co/demos/kibana/gettingstarted/logs.jsonl.gz

### 第二步：上传我们的数据集并解压

将我们以上下载的数据集全部上传到node01服务器的/kkb路径下

### 第三步：创建对应的索引库

创建我们的索引库，然后加载数据

#### 第一个索引库：日志数据集数据索引库

创建第一个索引库，将我们第一个索引库日志数据也创建好

我们这里实际上按照日期，创建了三个索引库，都是用于加载我们的日志数据

```json
PUT /logstash-2015.05.18
{
  "mappings": {
    "log": {
      "properties": {
        "geo": {
          "properties": {
            "coordinates": {
              "type": "geo_point"
            }
          }
        }
      }
    }
  }
}
PUT /logstash-2015.05.19
{
  "mappings": {
    "log": {
      "properties": {
        "geo": {
          "properties": {
            "coordinates": {
              "type": "geo_point"
            }
          }
        }
      }
    }
  }
}
PUT /logstash-2015.05.20
{
  "mappings": {
    "log": {
      "properties": {
        "geo": {
          "properties": {
            "coordinates": {
              "type": "geo_point"
            }
          }
        }
      }
    }
  }
}
```

### 第四步：加载示例数据到我们的索引库当中来

直接在node01的/kkb路径下执行以下命令来加载我们的示例数据到索引库当中来

node01机器上面执行以下命令

```sh
cd /kkb
curl -H 'Content-Type: application/x-ndjson' -XPOST 'node01:9200/bank/account/_bulk?pretty' --data-binary @accounts.json
curl -H 'Content-Type: application/x-ndjson' -XPOST 'node01:9200/_bulk?pretty' --data-binary @logs.json
```

