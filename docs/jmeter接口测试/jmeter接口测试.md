## 接口测试

```properties
推荐学习网址链接：
https://www.cnblogs.com/poloyy/category/1746599.html
https://www.cnblogs.com/poloyy/tag/
```

`jmeter`---》必須先安裝jdk

### 认识接口测试

我们一起来认识一下接口测试，首先从我们熟悉的普通基于图形界面做的手工测试开始。

手工测试是这样子的：

![img](jmeter接口测试.assets/clip_image002-1597972727682.jpg)

接口测试则是这样子的：

![img](jmeter接口测试.assets/clip_image004-1597972727683.jpg)

这里，唯一的不同，就是把手工测试操作的图形界面，改成了接口测试的工具或脚本。也就是说，我们做普通手工测试的大部分测试设计方法，在接口测试中仍然适用。

  我们来一个个看看图里的东西的意义： 

#####  1.服务端程序

  现代的软件开发，大多是网络程序的开发。**网络程序又通常分为服务器端程序和客户端程序**。像我 们常常使用的搜索引擎， 我们用浏览器或手机APP打开搜索引擎， 这个浏览器或者手机APP也就是 客户端程序。当我们在客户端输入一个搜索关键字时，这个信息会被发送到服务端程序上。然后服 务端程序去做信息的检索，再把搜索结果发回到客户端程序上，这样我们就可以看到搜索结果了。  **接口测试的目标通常就是测试服务端程序**。  

#####   2.图形界面。  

  这是客户端程序里提供给用户使用的界面。**标准叫法为用户接口(UI， UserInterface) 和图形化用户接口(GUI， Graphical UserInterface) 。**区别是UI泛指各种给用户提供的界面， 比如  Linux操作系统中的命令行界面， 也是一种UI， 而GUI指图形化界面。  

##### 3.数据

当我们操作`UI`时，客户端程序会把我们想要**发送给服务端程序的指令封装成数据的包**。会封装成什么类型的包，取决于数据在网络的那一层封装。后面我们会详细讲解数据的包和网络的分层。当服务端把数据处理完毕或指令执行完毕后，服务端会把要给用户看的数据也封装成包，发送回客户端。客户端再把包解开，给用户看里面的数据。**这就是封包和解包的过程**。

##### 4.工具或脚本

当我们使用图形界面做手工测试时，可以不用工具或脚本，客户端会完成数据的封包。这样做测试，**测试的对象是整个程序**，也就是我们把客户端程序加上服务端程序视为一个黑盒。而接口测试中则不同，我们要**测的对象变成了服务端程序**。

也就是说，我们**把服务端程序视为一个黑盒，然后，再用工具或脚本去模拟客户端程序的工作**，像客户端程序一样去做封包工作和数据发送工作，再在收到服务端返回信息后，像客户端一样去把包解开来。把数据呈现出来。这种用代码去模拟某部分我们不想测的东西的做法，我们通常称为**Mock**。

##### 5.接口可以简单分为：内部接口和外部接口

作为**黑盒测试，基本的测试思路是通过输入和输出判断被测系统或者对象的逻辑。**

获取人员的信息，我需要把人员的用户名传给hr系统接口，这样hr系统的接口会返回给我用户的一些更加具体的信息，这里的输入是用户名，输出是用户的详细信息。

##### 6.为什么要做接口测试

既然是接口获取和操作资源的方式，而大部分系统和产品中，资源一般都是产品的核心，比如微信核心资源就是通讯录关系链和聊天记录等，因此资源是必须的。

另外接口中大部分的内容是数据，**通过数据的对比我们能推测到系统和产品的逻辑，测接口就是测逻辑**。

最后接口中的返回相对单纯，不想web页面，html代码中有太对ui的东西，ui最不稳定，变化太快，接口相对稳定一点点，但是里面的干扰信息更少，断言相对容易很多。

##### 	7.口测试用例怎么写？

还是3a原则：

- A：**arrange初始化测试数据**，就是造数据，这里的数据有我们输入的数据，也有目标接口所涉及的资源，比如hr系统中的用户信息，我们必须先有几条人员的详细信息才能去获取人员信息的接口（当然只是正常的流程，我们有时候还需要清掉数据以便测试资源为空的情况）
- A：**act 调用接口库**，传入输入数据；
- A:  **assert 断言**，对返回的资源信息进行断言，比如获取用户信息的接口返回了用户信息之后，我们要判断返回的用户是不是我们想要的那个用户，我们获取的是李雷的信息，接口如果返回韩梅梅，那么接口的逻辑就是不对的。 

### http协议

#### http是什么

HTTP（超文本传输协议）是一个基于请求与响应模式的、无状态的（所以浏览器要依靠cookie、token等保持登录状态）、应用层的协议。

HTTP协议是一个基于TCP协议之上的请求-响应协议。

#### http协议的url解析

```sh
http://apis.juhe.cn/mobile/get?phone=13265586937&key=63a77489d2c51d26b4031e344b4f0050

1.http/https:         协议类型

2.--apis.juhe.cn       host：主机地址或域名（服务器地址）   
--www.xxx.com             域名
--localhost:8080         localhost是本机地址

3.port:端口号           （默认端口是80可以省略）

4.path:                请求的路径（服务器资源的路径）（host之后，问号？之前）

5.?  :                问号是分割符号

6.参数：              name=value

7.&   ：              多个参数用&隔开   

http协议默认（缺省）的端口号是80，https协议默认的端口号是443
```

#### http请求request

##### 请求内容剖析

浏览器发送的HTTP请求格式大致如下：

```
GET / HTTP/1.1
Host: www.sina.com.cn
User-Agent: Mozilla/5.0 xxx
Accept: */*
Accept-Language: zh-CN,zh;q=0.9,en-US;q=0.8
```

第一行表示使用`GET`请求获取路径为`/`的资源，并使用`HTTP/1.1`协议，从第二行开始，每行都是以`Header: Value`形式表示的`HTTP`头，比较常用的`HTTP Header`包括：

- `Host`: 表示请求的主机名，因为一个服务器上可能运行着多个网站，因此，`Host`表示浏览器正在请求的域名；
- `User-Agent`: 标识客户端本身，例如`Chrome`浏览器的标识类似`Mozilla/5.0 ... Chrome/79`，IE浏览器的标识类似`Mozilla/5.0 (Windows NT ...) like Gecko`；
- `Accept`：表示浏览器能接收的资源类型，如`text/*`，`image/*`或者`*/*`表示所有；
- `Accept-Language`：表示浏览器偏好的语言，服务器可以据此返回不同语言的网页；
- `Accept-Encoding`：表示浏览器可以支持的压缩类型，例如`gzip, deflate, br`。
- `Contet-Type`: 发送`post`时候，`body`的数据类型声明。
- `keep-alive`:保持长连接
  - 请求1 --- 三次握手 --- 传数据
    请求2
    ....
    请求N --- 四次挥手
- `cookie`: ...

举个例子：

GET请求：

![image-20200821203931340](jmeter接口测试.assets/image-20200821203931340.png)

POST请求：

![image-20200821204213499](jmeter接口测试.assets/image-20200821204213499.png)

可以看到，GET请求的格式跟post请求的格式很像，但是post请求是有请求body的。

下面来继续剖析一下请求的内容：

客户端发送一个HTTP请求到服务器的请求消息包括以下格式：

**请求行（request line）、请求头部（header）、空行和请求数据四个部分组成。**

![image-20200821204623901](jmeter接口测试.assets/image-20200821204623901.png)

##### Get请求参数剖析

Get的请求参数都在请求行里，可以在`fiddler`的`Webforms`的`QueryString`查看：

![image-20200821204910732](jmeter接口测试.assets/image-20200821204910732.png)

##### post请求参数剖析

post的请求参数可以是请求行的参数**QueryString+body**

`--QueryString`可以为空

`--body`也可以为空

![image-20200821205100223](jmeter接口测试.assets/image-20200821205100223.png)

##### post请求body剖析

post请求的body常见的数据类型有四种：

```json
1.第一种：application/json： 
			{"input1":"xxx","input2":"ooo","remember":false}
			填写在jmeter的parameters中
 
2.第二种：application/x-www-form-urlencoded：
			input1=xxx&input2=ooo&remember=false
			填写在 jmeter的请求的body中
 
3.第三种：multipart/form-data:这一种是表单格式的


4.第四种：text/xml
<!--?xml version="1.0"?-->
<methodcall>
<methodname>examples.getStateName</methodname>
```



#### http请求的不同方法的区别

根据HTTP标准，HTTP请求可以使用多种请求方法。

- `HTTP1.0`定义了三种请求方法： **GET, POST** 和 HEAD方法。

- `HTTP1.1`新增了五种请求方法：OPTIONS, **PUT, DELETE**, TRACE 和 CONNECT 方法。

`get`请求与`post`请求的区别

- `get`: 1.向服务器取数据；2.`get`请求数据传输放在url中；3.`post`相对安全一点，
- `get`请求的参数直接放在url中，`post`请求的参数放在`body`中
- `post`：1. 向服务器提交数据；2.`post`数据传输放在`body`中；

不同请求的解释：

- `GET` 请求指定的页面信息，并返回实体主体。
- `HEAD` 类似于`get`请求，只不过返回的响应中没有具体的内容，用于获取报头 POST 向指定资源提交数据进行处理请求（例如提交表单或者上传文件）。数据被包含在请求体中。POST请求可能会导致新的资源的建立和/或已有资源的修改。 PUT 从客户端向服务器传送的数据取代指定的文档的内容。 
- `DELETE` 请求服务器删除指定的页面。
- `CONNECT HTTP/1.1`协议中预留给能够将连接改为管道方式的代理服务器。 `OPTIONS` 允许客户端查看服务器的性能。 
- `TRACE` 回显服务器收到的请求，主要用于测试或诊断。

#### http响应response

```
一般情况下，服务器接收并处理客户端发过来的请求后会返回一个HTTP的响应消息。

HTTP响应也由四个部分组成，分别是：状态行、消息报头、空行和响应正文。
```

fiddler响应信息的查看：

![image-20200821205525780](jmeter接口测试.assets/image-20200821205525780.png)

##### 响应内容剖析：

![image-20200821205824554](jmeter接口测试.assets/image-20200821205824554.png)

##### 状态码

```sh
状态代码有三位数字组成，第一个数字定义了响应的类别，共分五种类别:
1xx：指示信息--表示请求已接收，继续处理
2xx：成功--表示请求已被成功接收、理解、接受
3xx：重定向--要完成请求必须进行更进一步的操作
4xx：客户端错误--请求有语法错误或请求无法实现
5xx：服务器端错误--服务器未能实现合法的请求


常见状态码：
200 OK //客户端请求成功 
400 Bad Request //客户端请求有语法错误，不能被服务器所理解 
401 Unauthorized //请求未经授权，这个状态代码必须和WWW-Authenticate报头域一起使用 
403 Forbidden //服务器收到请求，但是拒绝提供服务 
404 Not Found //请求资源不存在，eg：输入了错误的URL 
500 Internal Server Error //服务器发生不可预期的错误 
503 Server Unavailable //服务器当前不能处理客户端的请求，一段时间后可能恢复正常
```

### Fiddler介绍

#### Fiddler工作原理

​	终端设备（web、app）发出请求，fiddler作为代理，传给服务器；服务器返回数据，**fiddler拦截后，再传给终端设备**。

![image-20200821210122980](jmeter接口测试.assets/image-20200821210122980.png)





### Fiddler安装及设置

双击Fiddler安装包，即可安装。安装后，如果需要抓https协议的包，需要开启监控，进行一些配置，步骤如下：

进入到Fiddler的安装目录：

![image-20200821191631842](jmeter接口测试.assets/image-20200821191631842.png)

```
E:
cd install/fiddler_install/Fiddler
```

进入安装目录后，执行以下命令

```sh
makecert.exe -r -ss my -n "CN=DO_NOT_TRUST_FiddlerRoot, O=DO_NOT_TRUST, OU=Created by http://www.fiddler2.com" -sky signature -eku 1.3.6.1.5.5.7.3.1 -h 1 -cy authority -a sha1 -m 120 -b 09/05/2025
```

注意：这个命令最后的日期 09/05/2025 **一定要大于现在的日期 否则创建证书是过期的**

![image-20200821193329571](jmeter接口测试.assets/image-20200821193329571.png)

点击`option`，修改设置，导出`export`证书到桌面，把框上的内容都勾选上。

如果没有上面的一步的话，这一步有可能不能成功。

![image-20200821192126892](jmeter接口测试.assets/image-20200821192126892.png)

导出的证书如下：

![image-20200821192638064](jmeter接口测试.assets/image-20200821192638064.png)

打开浏览器，开始安装证书：

![image-20200821193803633](jmeter接口测试.assets/image-20200821193803633.png)

如下图，如果证书不存在，可以进行导入：

![image-20200821194036379](jmeter接口测试.assets/image-20200821194036379.png)

现在就可以开始抓`https`协议的包了。

![image-20200907154839035](jmeter接口测试.assets/image-20200907154839035.png)

![image-20200907154900993](jmeter接口测试.assets/image-20200907154900993.png)

可以尝试修改一下`fiddler`的字体类型和大小：

![image-20200821194616481](jmeter接口测试.assets/image-20200821194616481.png)

### Jmeter初步学习

#### 1. Jmeter简介

##### 1.1什么是Jmeter

`Apache JMeter`是`Apache`组织开发的基于`Java`的**压力测试工具**。用于对软件做压力测试，它最初被设计用于Web应用测试，但后来扩展到其他测试领域。 它可以用于测试静态和动态资源，例如静态文件、`Java` 小服务程序、`CGI` 脚本、`Java` 对象、数据库、`FTP` 服务器， 等等。**JMeter 可以用于对服务器、网络或对象模拟巨大的负载，来自不同压力类别下测试它们的强度和分析整体性能**。另外，`JMeter`能够**对应用程序做功能/回归测试**，通过创建带有断言的脚本来验证你的程序返回了你期望的结果。为了最大限度的灵活性，`JMeter`允许使用正则表达式创建断言。

`Apache jmeter`可以用于对静态的和动态的资源（文件，`Servlet`，`Perl`脚本，`java` 对象，数据库和查询，FTP服务器等等）的性能进行测试。它可以用于对服务器、网络或对象模拟繁重的负载来测试它们的强度或分析不同压力类型下的整体性能。你可以使用它做性能的图形分析或在大并发负载测试你的服务器/脚本/对象。

Jmeter**工作原理图：**

![img](jmeter接口测试.assets/clip_image002-1597974906724.jpg)

 

##### 1.2 Jmeter的作用及特色

JMeter的作用

```sh
1.能够对HTTP和FTP服务器进行压力和性能测试， 也可以对任何数据库进行同样的测试（通过JDBC）。

2.完全的可移植性和100% 纯java。

3.完全 Swing 和轻量组件支持（预编译的JAR使用 javax.swing.*)包。

4.完全多线程框架允许通过多个线程并发取样和 通过单独的线程组对不同的功能同时取样。

5.精心的GUI设计允许快速操作和更精确的计时。

6.缓存和离线分析/回放测试结果。
```

JMeter的特色

```sh
1. 源许可: Jmeter 是完全免费的，并提供了源码可供自定义开 发

2. 图形界面模式：提供了方便的图形界面来编辑和开发测试脚本

3. 平台无关：可以轻易在 windows、linux、mac 上运行

4. 多线程框架：通过线程组，能够轻易的设置不同测试的并发用户。

5. 图形测试结果：提供了图表、表格、树、文件等格式的结果显 示。

6. 易于安装：jmeter 不需要安装，下载解压即可用。

7. 高扩展性：jmeter 支持用户自定义测试脚本，同样还提供了 各种插件。

8. 多测试类型支持：支持性能测试、分布式测试、功能测试

9. 仿真模拟：支持多用户并发测试

10. 多协议支持：支持 http、jdbc、ldap、soap、jms、ftp 等 等协议

11. 录制&回放：支持用 badboy 或 jmeter 录制，不过笔者从来 不用该模式，纯手工最佳。

12. 脚本测试:jmeter 支持 beanshell 和 selenium
```

#### 2. Jmeter的安装

##### 2.1 Jmeter安装的需要条件

因为jmeter运行需要Java环境，使用jmeter前需要先在电脑上面安装好jdk，如果没先安装jdk，启动jmeter会出现“`Not able to find Java executable or version. Please check your Java installation.”`的错误

jdk的下载地址：https://www.oracle.com/java/technologies/javase-jdk13-downloads.html

![img](jmeter接口测试.assets/clip_image004-1597974906725.jpg)

根据电脑操作系统下载对应的jdk安装包

下载后双击安装包进行安装，事先说明，jdk安装过程会提供两次安装，**第一次是安装在jdk中，第二次是安装在jre中**。

**建议提前新建了2个文件夹，jre文件夹用于jre安装，jdk文件夹用于安装java**，安装时自定义安装路径，建议不要默认装在C盘

开始安装

![img](jmeter接口测试.assets/clip_image006-1597974906726.jpg)

选择安装路径安装完成

![img](jmeter接口测试.assets/clip_image008-1597974906726.jpg)

配置jdk环境

安装完成了就是配置环境变量，在桌面右键我的电脑，通过：计算机→属性→高级系统设置→高级→环境变量，进入环境配置页面系统变量→新建 JAVA_HOME 变量。

变量值填写jdk的安装目录（本人是 D:\Software\Java\jdk1.8.0_60)

​    ![img](jmeter接口测试.assets/clip_image010-1597974906726.jpg)

系统变量→寻找 Path 变量→编辑

在变量值最后输入：`;%JAVA_HOME%\bin;%JAVA_HOME%\jre\bin;`

（注意原来Path的变量值末尾有没有;号，如果没有，先输入；号再输入上面的代码）

   ![img](jmeter接口测试.assets/clip_image012-1597974906726.jpg)

系统变量→新建 CLASSPATH 变量

变量值填写： `.;%JAVA_HOME%\lib;%JAVA_HOME%\lib\tools.jar`（注意最前面有一点）

系统变量配置完毕

![img](jmeter接口测试.assets/clip_image014-1597974906726.jpg)

检验是否配置成功 运行cmd 输入 `java -version` （`java` 和 `-version` 之间有空格）

如图所示显示版本信息，则说明安装和配置成功

![img](jmeter接口测试.assets/clip_image016-1597974906727.jpg)

##### 2.2 Jmeter的安装配置环境变量

jmeter运行环境安装好了，就可以安装jmeter了。

Jmeter下载地址：http://jmeter.apache.org/download_jmeter.cgi

![img](jmeter接口测试.assets/clip_image018-1597974906726.jpg)

下载zip，直接解压就可以用了，比较方便。建议在D盘新建了一个jmeter文件夹，用于此压缩包解压。解压完成是这样：

![img](jmeter接口测试.assets/clip_image020-1597974906727.jpg)

启动会出现先启动一个cmd，然后就打开了jmeter

![img](jmeter接口测试.assets/clip_image022-1597974906727.jpg)

1. ```sh
   1. jmeter直接下载解压，配置环境变量就可以用cmd打开jmeter，在后续进阶使用jmeter也会需要配置环境变量
   
   2. 在系统变量中添加俩个属性 
   
   3. JMETER_HOME=D:\apache-jmetes\apache-jmeter-4.0   (就是jmeter保存的路径)
   
   4. CLASSPATH=%JMETER_HOME%\lib\ext\ApacheJMeter_core.jar;%JMETER_HOME%\lib\jorphan.jar;  (这个复制上去就ok) CLASSPATH变量如果存在就直接在后面加变量，如果没有就新建一个，注意每个变量 ; 隔开
   
   5. 在用系统变量path后面加上 ;%JMETER_HOME%\bin  注意是系统变量
   
   6. 配置完成后使用cmd直接输入jmeter就可以打开jmeter
   ```

![img](jmeter接口测试.assets/clip_image024-1597974906727.jpg)

使用cmd打开也会出现跟在文件夹中打开一样的提示语

![img](jmeter接口测试.assets/clip_image026-1597974906727.jpg)

![image-20200821102015836](jmeter接口测试.assets/image-20200821102015836.png)

如果不配置环境变量，直接双击jmeter安装目录的bin/jmeter.bat文件，也可以打开Jmeter 。

在linux系统里面，启动Jmeter的方式是  bin/jmeter.sh

#### 3.Jmeter插件安装

插件下载地址：https://jmeter-plugins.org/install/Install/

安装方法如下图，放在路径 lib/ext下，然后重启JMeter：

![image-20200822130559358](jmeter接口测试.assets/image-20200822130559358.png)

安装完成后，打开jmeter，点击options可查看插件：

![image-20200822131239952](jmeter接口测试.assets/image-20200822131239952.png)

### fiddler抓包+Jmeter入门

以`linux`系统（`xiaoqiang`)的网站为例，学习抓包和Jmeter的使用。账号密码：xiaoqiang1和123123

#### 前备知识：

Jmeter基本操作：

- 1、新建testplan测试计划，新建线程组Thread Group

  ![image-20200821171613178](jmeter接口测试.assets/image-20200821171613178.png)

- 新建http request（可建立多个）

  ![image-20200821171734804](jmeter接口测试.assets/image-20200821171734804.png)

- 右击Thread group,新建观察树 View Results Tree（观察树是全局的，可在TestPlan下的任意地方新建）

  ![image-20200821171906055](jmeter接口测试.assets/image-20200821171906055.png)

- 右击Thread group，新建cookie管理器（HTTP Cookie Manager），cookie管理器可以保持用户登录状态

  ![image-20200821172116797](jmeter接口测试.assets/image-20200821172116797.png)

#### 第一步：登录

进浏览器，准备抓包

![image-20200821165617405](jmeter接口测试.assets/image-20200821165617405.png)

打开抓包，输入账号密码，抓包：

```
xiaoqiang1

123123
```

![image-20200821170131818](jmeter接口测试.assets/image-20200821170131818.png)

注意query_string和body内容（这些内容可以在web_form里面查看）。query_stirng直接在服务器路径path里面填写，body内容是要填写在parameters里面。

![image-20200821170333056](jmeter接口测试.assets/image-20200821170333056.png)

#### 第二步：搜索商品

![image-20200821173226681](jmeter接口测试.assets/image-20200821173226681.png)

抓包，填写信息：

![image-20200821174049058](jmeter接口测试.assets/image-20200821174049058.png)

#### 第三步：添加商品到购物车

这里特别注意一下，我们需要的是添加商品到购物车这么一个动作，而不是显示购物车的页面。

添加商品很容易猜到的是，很可能就是要提交商品信息到服务器，也就是，body有商品的坐标信息。

![image-20200821181434612](jmeter接口测试.assets/image-20200821181434612.png)

![image-20200821181516640](jmeter接口测试.assets/image-20200821181516640.png)

这里提一下get请求和post请求的区别：

- 1、Get是不安全的，因为在传输过程，数据被放在请求的URL中；Post的所有操作对用户来说都是不可见的。    
- 2、 Get传送的数据量较小，这主要是因为受URL长度限制；**Post传送的数据量较大**，一般被默认为不受限制。    
- 3、 Get限制Form表单的数据集的值必须为ASCII字符；而Post支持整个ISO10646字符集。    
- 4、 Get执行效率却比Post方法好。Get是form提交的默认方法。
- 5、get请求的参数直接放在url中，post请求的参数放在body中

浏览器用GET请求来获取一个html页面/图片/css/js等资源；用POST来提交一个`<form>表单`，并得到一个结果的网页。

![image-20200821175908396](jmeter接口测试.assets/image-20200821175908396.png)

#### 第四步：查看购物车，结算购物车，查看确认界面，提交订单

按照上面的规律，进行剩余四步，如下图：

![image-20200821200541423](jmeter接口测试.assets/image-20200821200541423.png)

![image-20200821200643812](jmeter接口测试.assets/image-20200821200643812.png)

​	<img src="jmeter接口测试.assets/image-20200821200716458.png" alt="image-20200821200716458"/>

#### 补充

查看观察树技巧：

- 可以以不同的方式去查看响应内容（txt、html等等），如下：
- ![image-20200821200857432](jmeter接口测试.assets/image-20200821200857432.png)

- jmeter这样一来就实现了小小的自动化功能

### JMeter深入学习

#### JMeter常用目录介绍

启动JMeter时，我们会发现一些提示信息：

![image-20200822143652622](jmeter接口测试.assets/image-20200822143652622.png)

这几句话的意思是：**不要使用GUI模式来进行压力测试**（负载测试），此模式仅适用于测试创建和测试调试，对于压力测试，请使用CLI命令行模式（Non GUI) 。

既然有可能要使用CLI命令行模式，那我们就来了解一些JMeter常用的目录的作用。

![image-20200822150822110](jmeter接口测试.assets/image-20200822150822110.png)

##### bin目录

```css
bin目录：
examples:	目录中有CSV样例
jmeter.bat	windows系统的启动文件
jmeter.sh 	linux系统的启动文件
jmeter.log	jmeter的运行日志文件
jmeter.properties	jmeter的系统配置文件	
	- jmeter.properties配置文件有修改时，要重启jmeter
jmeter-server.bat	windows分布式测试要用到的服务器配置
jmeters-server	linux分布式测试要用的服务器配置
```

利用`jmeter.properties`配置文件可以进行一些**jmeter的界面显示配置**，如设置jmeter的GUI语言，GUI图标大小比例， 功能区工具栏图标大小，视图区目录树图标大小等等，参考链接：https://zhuanlan.zhihu.com/p/92582351

另外，说一下SSL：

**什么是SSL？https、SSL和TSL之间的关系？**

如果您能使用 https:// 来访问某个网站，就表示此网站是部署了SSL证书。一般来讲，如果此网站部署了SSL证书，则在需要加密的页面会自动从 http:// 变为 https:// ，如果没有变，你认为此页面应该加密，您也可以尝试直接手动在浏览器地址栏的http后面加上一个英文字母“ s ”后回车，如果能正常访问并出现安全锁，则表明此网站实际上是部署了SSL证书，只是此页面没有做 https:// 链接；如果不能访问，则表明此网站没有部署 SSL证书。

![ä»ä¹æ¯ SSLè¯ä¹¦](jmeter接口测试.assets/how_to_Check_SSL_clip_image001.gif)

请注意：有些部署了 SSL证书的网站会有不安全因素警告 ( 如下图所示 ) ，表明此页面中含有指向其他没有部署 SSL证书的页面，为了安全起见，建议您选择“否”，浏览器就不显示不安全的内容，这些内容一般都是 Flash 动画或 Java Script ，如果选择“是”，则浏览器不会显示安全锁标志。

起初是因为HTTP在传输数据时使用的是明文（虽然说POST提交的数据时放在报体里看不到的，但是还是可以通过抓包工具窃取到）是不安全的，为了解决这一隐患网景公司推出了**SSL安全套接字协议层**，SSL是基于HTTP之下TCP之上的一个协议层，**是基于HTTP标准并对TCP传输数据时进行加密**，所以**HPPTS是HTTP+SSL/TCP的简称**。

**SSL的版本介绍**

由于HTTPS的推出受到了很多人的欢迎，在SSL更新到3.0时，IETF对SSL3.0进行了标准化，并添加了少数机制(但是几乎和SSL3.0无差异)，标准化后的IETF更名为TLS1.0(Transport Layer Security 安全传输层协议)，**可以说TLS就是SSL的新版本3.1**，TLS1.0和SSL3.0几乎没有区别

下面看一下**SSL在`jmeter.properties`里面的常见设置：**

```properties
　## 指定HTTPS协议层
　https.default.protocol=TLS
　## 指定SSL版本，实际应用中可能需要修改
　https.default.protocol=SSLv3
　## 设置启动的协议
　https.socket.protocols=SSLv2Hello SSLv3 TLSv1
　## 缓存控制，控制SSL是否可以在多个迭代中重用
　https.use.cached.ssl.context=true
```



##### 其它目录

###### docs目录

**jmeter接口文档目录**。jmeter是开源，支持二次开发，所以对外提供了一些二次开发的接口api。

![image-20200822164034911](jmeter接口测试.assets/image-20200822164034911.png)

`docs/api`就是jmeter接口文档的目录，双击index.html就可以看到接口信息：

![image-20200822164137139](jmeter接口测试.assets/image-20200822164137139.png)

###### extras目录

**扩展插件目录。提供了对Ant的支持**，可以使用Ant来实现自动化测试，例如批量脚本执行，产生html格式的报表，测试运行时，可以把测试数据记录下来，jmeter会自动生成一个.jtl文件，将该文件放到extras目录下，运行“ant-Dtest=文件名 report",就可以生成测试统计报表。

###### lib目录

所用到插件目录，里面均为jar包。jmeter会自动在jmeter HOME/lib和ext目录下寻找需要的类，lib下存放JMeter所依赖的外部jar，如httpclient.jar、httpcore.jar、httpmime.jar等等。

其中lib\ext目录下存放有Jmeter依赖的核心jar包，ApacheJMeter_core.jar、ApacheJMeter_java.jar在写client端需要引用，JMeter插件包也在此目录下。

lib\junit下存放junit测试脚本。

###### Licenses目录

jmeter证书目录。

###### printable_docs目录

`printable_docs`的`usermanual`子目录下的内容是**JMeter的用户手册文档**，其中`usermanual`下的`component_reference.html`是最常用的核心元件帮助文档。

![image-20200822165504631](jmeter接口测试.assets/image-20200822165504631.png)

双击打开主页`index.html`

![image-20200822165628477](jmeter接口测试.assets/image-20200822165628477.png)

**重点学习文档：usermanual/component_reference.html**：

![image-20200822170502961](jmeter接口测试.assets/image-20200822170502961.png)

#### 测试计划元件

##### 测试计划（Test plan)

描述一个性能测试，包含本次测试的所有相关功能

##### 线程组（Thread Group)

线程组元件是任何一个测试计划的开始点。

![image-20200822181714516](jmeter接口测试.assets/image-20200822181714516.png)

一个线程组可以看做一个**虚拟用户组**，线程组中的每个线程都可以理解为一个虚拟用户。多个用户同时去执行相同的一批次任务。**每个线程之间都是隔离的**，互不影响的。一个线程的执行过程中，操作的变量，不会影响其他线程的变量值。

线程组的相关配置解释如下：

###### 1、取样器错误后要执行的动作：

![image-20200822182310594](jmeter接口测试.assets/image-20200822182310594.png)

- 继续：忽略错误，继续执行
- Start Next Thread Loop： 忽略错误，线程当前循环终止，执行下一个循环。
- 停止线程：当前线程停止执行，不影响其他线程正常执行。
- 停止测试：整个测试会在所有当前正在执行的线程执行完毕后停止
- Stop test now：整个测试会立即停止执行，当前正在执行的取样器可能会被中断。

这几个配置项控制了“当遇到错误的时候测试的执行策略”是否会继续执行。

###### 2、设置线程数

线程数也就是**并发数**，每个线程将会完全独立的运行测试计划，互不干扰。多个线程用于模仿对服务器的并发访问。默认是1个。

![image-20200822182531835](jmeter接口测试.assets/image-20200822182531835.png)

###### 3、ramp-up period

- ramp-up period用于**设置启动所有线程所需要的时间**。注意是启动所有线程的时间，不是执行完所有线程的时间。如果选择了10个线程，并且ramp-up period是100秒，那么JMeter将使用100秒使10个线程启动并运行。每个线程将在前一个线程启动后10（100/10）秒后启动。
- 当这个值设置的很小、线程数又设置的很大时，在刚开始执行时会对服务器产生很大的负荷。
- 下图的线程配置中，5个线程，5秒启动时间，每个线程执行两次循环。那么每个线程之间启动延迟为 1 秒。

![image-20200822182816342](jmeter接口测试.assets/image-20200822182816342.png)

- 如果 ramp-up 时间内，所有线程不能启动运行完的话，时间则会顺延下去
- Ramp-up设置注意事项：
- ![image-20200822185145451](jmeter接口测试.assets/image-20200822185145451.png)

###### 4、设置循环次数

该项设置线程组在结束前**每个线程循环的次数**，如果次数设置为1，那么JMeter在停止前只执行测试计划一次。

![image-20200822182931937](jmeter接口测试.assets/image-20200822182931937.png)

设置了多个线程或循环次数大于1时，向服务器发送了多个请求，查看观察树的效果大致如下：

![image-20200822184542118](jmeter接口测试.assets/image-20200822184542118.png)

###### 5、Delay Thread creation until needed

延迟创建线程直到需要。

- 默认情况下，测试开始的时候，所有线程就被创建完了。如果勾选了此选项，那么线程只会在合适的需要用到的时候创建。
- 延迟创建线程，直到线程被需要、采样器开始执行时才会被创建，避免资源浪费

###### 6、Specify Thread Lifetime【调度器】

**调度器的作用：**控制每个线程组运行的持续时间以及它在多少秒后再启动

**Duration (seconds) ：**持续时间；线程组运行的持续时间

**Startup Delay (seconds)：**启动延迟；测试计划开始后，线程组的**线程**将在多少秒后**再启动运行**

![image-20200822185518293](jmeter接口测试.assets/image-20200822185518293.png)

调度器和循环次数的关系：

- 循环次数有**固定值且 ≠ -1**，持续时间**不会生效**，以循环次数为准
- 循环次数设置为**永远或 -1 时**，持续时间才**会生效**

调度器注意事项：

- 当线程组运行完持续时间后，会**逐步释放线程，**不会一下子把所有线程释放掉，而释放线程也是需要时间的~
- 所以测试计划总的时间（右上角的时间）会 > 持续时间+启动延迟

![image-20200822190551517](jmeter接口测试.assets/image-20200822190551517.png)

###### 预习系统吞吐量（TPS）

- 总的完成请求数 = 线程总数 * 循环次数
- 平均TPS = 总请求数 / 线程运行总时间**【上图，右上角黄色三角形的时间】**
- 平均TPS（即聚合报告的TPS）是仅供参考的
- **实际的TPS**是由**响应时间决定**的，需要通过响应时间结果图和TPS结果图来最后得出 

> 一个系统的吞度量（承压能力）与request对CPU的消耗、外部接口、IO等等紧密关联。
>
> 单个reqeust 对CPU消耗越高，外部系统接口、IO影响速度越慢，系统吞吐能力越低，反之越高。
>
> 系统吞吐量几个重要参数：QPS（TPS）、并发数、响应时间
>
> **QPS（TPS）：**每秒钟request/事务 数量
>
> **并发数：** 系统同时处理的request/事务数
>
> **响应时间：** 一般取平均响应时间
>
> （很多人经常会把并发数和TPS理解混淆）
>
> 理解了上面三个要素的意义之后，就能推算出它们之间的关系：
>
> QPS（TPS）= 并发数/平均响应时间
>
> **一个系统吞吐量通常由QPS（TPS）、并发数两个因素决定**，每套系统这两个值都有一个相对极限值，在应用场景访问压力下，只要某一项达到系统最高值，系统的吞吐量就上不去了，如果压力继续增大，系统的吞吐量反而会下降，原因是系统超负荷工作，上下文切换、内存等等其它消耗导致系统性能下降。

##### setup thread group 

一种特殊类型的ThreadGroup，用于在执行常规线程组之前执行一些必要的操作。在“setup thread group ”下提到的线程行为与普通线程组完全相同。不同的是执行顺序---**它会在普通线程组执行之前被触发。**

应用场景举例：

A、测试数据库操作功能时，用于执行打开数据库连接的操作。

B、测试用户购物功能时，用于执行用户的注册、登录等操作。

![image-20200824094019393](jmeter接口测试.assets/image-20200824094019393.png)

 

##### teardown thread group 

一种特殊类型的`ThreadGroup`，用于在执行常规线程组完成后执行一些必要的操作。在`“teardown thread group ”`下提到的线程行为与普通线程组完全相同。不同的是执行顺序---**它会在普通线程组执行之后被触发。**

应用场景举例：

A、测试数据库操作功能时，用于执行关闭数据库连接的操作。

B、测试用户购物功能时，用于执行用户的退出等操作。

tips：

默认情况下，如果测试按预期完成，则`TearDown`线程组将不会运行。如果你想要运行它，则需要从`Test Plan`界面中选中复选框`“Run tearDown Thread Groups after shutdown of main threads”`。

\-----------------------------------------------------------

可能你还是不太理解他们与普通的线程组有什么不同。但是如果你用过**junit**，想必你应该对`setup` ，`teardown`这两个字眼不陌生。

![image-20200824094136267](jmeter接口测试.assets/image-20200824094136267.png)

##### 取样器（Sampler)

取样器（`Sampler`)是性能测试中向服务器发送请求，记录响应信息，记录响应时间的最小单元，`JMeter`原生支持多种不同的sampler,如`HTTP Request Sampler`、`FTP Request Sampler`、`TCP Request Sampler`、`JDBC Request Sampler`等，每一种不同类型的`sampler`可以根据设置的参宿向服务器发出不同类型的请求。

在`Jmeter`的所有`Sampler`中，`Java Request Sampler`与`BeanShell Request Sampler`是两种特殊的可定制的Sampler。

一个取样器常进行三部分的工作：**向服务器发送请求，记录服务器的响应数据和记录响应时间信息**。

![image-20200824103209555](jmeter接口测试.assets/image-20200824103209555.png)

![image-20200824103725757](jmeter接口测试.assets/image-20200824103725757.png)

##### 逻辑控制器（Logic Controller)

逻辑控制器，包括两类元件，一类是用于控制`testplan`中`sampler`节点发送请求的逻辑顺序的控制器，常用的有如果`(If)`控制器、`switchController`、`Runtime Controller`、循环控制器等。另一类是用来组织可控制`sampler`节点的，如事物控制器、吞吐量控制器。

![image-20200824104128242](jmeter接口测试.assets/image-20200824104128242.png)

##### 配置元件（Config Element）

配置元件（`config element`)用于提供对静态数据配置的支持。`CSV Data Set config`可以将本地数据文件形成数据池（`Data Pool`）, 而对应于`HTTP Request Sampler`和`TCP Request Sampler`等类型的配置元件则可以修改`Sampler`的默认数据。例如，`HTTP Cookie Manager`可以用于对`HTTP Request Sampler`的`cookie`进行管理（可保持登录状态）。`HTT`P请求默认值不会出发`Jmeter`发送http请求，而只是定义`HTTP`请求的默认属性。

![image-20200824104954841](jmeter接口测试.assets/image-20200824104954841.png)

##### 定时器（Timer）

用于操作之间设置等待时间，等待时间使性能测试中常用的控制客户端`QPS`（系统吞吐量）的手段，`jmeter`定义了`Constant Times、Constant Throughput Times、Guass Ramdon Times`等不同类型的`Times`。

![image-20200824200149426](jmeter接口测试.assets/image-20200824200149426.png)

![image-20200824200121760](jmeter接口测试.assets/image-20200824200121760.png)



##### 前置处理器（Pre Processors)

用于在实际请求发出之前对即将发出的请求进行特殊处理。

例如：`Count`处理器可以实现自增操作，自增后生成的数据可以被将要发出的请求使用，而`HTTP URL Re-Writing Modifier`处理器可以实现`URL`重写，当`URL`中有`sessionID`一类的`session`信息时，可以通过该处理器填充发出请求实际的`sessionID`。

![image-20200824201115626](jmeter接口测试.assets/image-20200824201115626.png)

##### 后置处理器（post processors)

![image-20200824201238185](jmeter接口测试.assets/image-20200824201238185.png)

##### 断言（assertion）

用于检查测试中得到的响应数据等是否符合语气，`Assertions`一般用来设置检查点，用以保证性能测试过程中的数据交互与预期一致。

![image-20200824201443248](jmeter接口测试.assets/image-20200824201443248.png)

##### 监听器（listener）

对测试结果进行处理和可视化展示的一系列组件，常用的有图形结果、查看结果树、聚合报告等。

#### Jmeter运行原理





### JMeter使用案例2

本案例的使用网址：http://192.168.239.130:8080/recruit.students/login/view (招生部署系统)，账号密码：

```
admin
test123
```

先整体看一下最终的效果：

![image-20200824152755657](jmeter接口测试.assets/image-20200824152755657.png)

这里只提一下关键的两步：

#### 1、登录步骤

登录时，密码被加密了

![image-20200824155901571](jmeter接口测试.assets/image-20200824155901571.png)

#### 2、设置学生录入时间

这一步的抓包信息如下：

![image-20200824160152618](jmeter接口测试.assets/image-20200824160152618.png)

`Content-Type`是`application/json`格式的，需要将请求`body`的内容放到下图中的`Body Data`里面。**直接复制粘贴过去就行，不用去掉首尾的`[]`号。**

![image-20200824160007700](jmeter接口测试.assets/image-20200824160007700.png)

因为该`post`请求的`body`是`json`格式的，所以我们要把请求头的`Content-Type`的值修改成`application/json`（**`Content-Type`的默认值是`Content-Type: application/x-www-form-urlencoded;charset=UTF-8`**）。修改的方式是在该`set_recruit_time`取样器里面添加请求头配置元件`HTTP Header Manager`。

![image-20200824162831354](jmeter接口测试.assets/image-20200824162831354.png)

注意：配置元件`Config Element`如果是跟取样器同级的，那么影响是全局，但如果是放在某一个取样器下，那么配置元件只会影响对应的取样器，而且**局部性的比全局性的优先级更高**。

![image-20200824163310263](jmeter接口测试.assets/image-20200824163310263.png)

本案例的`HTTP Header manager`的配置信息如下：

![image-20200824163752986](jmeter接口测试.assets/image-20200824163752986.png)

#### 3、如何进行参数化

参数化是什么？参数化是为了更真实的模拟生产环境，更加方便我们的测试，比如随机生成一些名称。

以`create_school_step`新建学校一步为例，对要**新建的学校名称**进行参数化，步骤如下：

![image-20200824165557061](jmeter接口测试.assets/image-20200824165557061.png)

找到能随机生成固定位数字符串的函数：

![image-20200824165657582](jmeter接口测试.assets/image-20200824165657582.png)

`RandomString`函数解释：

![image-20200824165907269](jmeter接口测试.assets/image-20200824165907269.png)

点击`Generate & Copy to clipboard`，复制函数到学校名称的参数处：

![image-20200824170114737](jmeter接口测试.assets/image-20200824170114737.png)

修改完后，运行，查看观察树，观察新建学校一步，效果如下：

![image-20200824170406316](jmeter接口测试.assets/image-20200824170406316.png)

#### 4、如何判断测试是否成功？

从现象到本质

```css
1.请求绿色 
2. 状态码  200  协议状态码   业务状态码 ----- 开发定义的
3. 是否实现的接口相应的功能
```

#### 5、小结补充

- json格式的post请求body的内容，填放在Body Data里面：

![image-20200824171321806](jmeter接口测试.assets/image-20200824171321806.png)

### Jmeter CSV参数化案例

下面以注册`xiaoqiangshop`账户为例，进行一次CSV参数化的演示：

![image-20200824181150107](jmeter接口测试.assets/image-20200824181150107.png)

CSV参数化学习链接：https://www.cnblogs.com/wwho/p/7292006.html

##### 6.1新建CSV Data Set Config

![image-20200824181427284](jmeter接口测试.assets/image-20200824181427284.png)

##### 6.2填写配置信息

![image-20200824182246740](jmeter接口测试.assets/image-20200824182246740.png)

##### 6.3创建csv文件

在设置的jmx文件的保存路径，新建`txt`文件，修改为`.csv`文件(或者新建一个excel文件，然后另存为`csv`文件格式），输入一下内容：

```css
jimmy,83434532@qq.com,4352342698,453335@qq.com,53434565,6546454,2343653,18283564454,guangdong
krystal,84343892@qq.com,426234258,44535435@qq.com,53486565,655654,2343553,18448454,guangdong
bod,8324262@qq.com,4232453298,4745634345435@qq.com,5352365,6546454,234363,1828348454,guangdong
sunny,832346892@qq.com,42354376348,4534543435@qq.com,5234365,6546454,2343453,18454554,guangdong
velyn,83247392@qq.com,4245437638,4534535@qq.com,53454365,3456454,2343653,1548454,guangdong
trevor,83254353@qq.com,4454376456456,45345435@qq.com,5653365,6546454,2343343,1824548454,guangdong
Alex838767492@qq.com,42534538,45345335@qq.com,53454365,64534,2343653,182845354,guangdong
```

##### 6.4设置线程组循环次数

把线程组的循环运行次数设置为2：

![image-20200824191636437](jmeter接口测试.assets/image-20200824191636437.png)

##### 6.5可新建一个Debug Sampler调试取样器

`Debug Sampler`主要是为了方便我们**查看参数化的对应变量的取值**。

![image-20200824192643088](jmeter接口测试.assets/image-20200824192643088.png)

##### 6.6抓包并配置请求信息

![image-20200824193617326](jmeter接口测试.assets/image-20200824193617326.png)

想要引用`CSV Data Set Config`里面设置的变量的语法是：`${变量名}`

![image-20200824193701368](jmeter接口测试.assets/image-20200824193701368.png)

##### 6.7运行并查看结果

![image-20200824193902728](jmeter接口测试.assets/image-20200824193902728.png)

![image-20200824193920419](jmeter接口测试.assets/image-20200824193920419.png)

### Jmeter 案例：不同用户登录，买不同的商品

需求： 对登录的用户进行参数化，设置一个线程，多次循环（6次），每循环一次都是不同的用户登录。

![image-20200827135934613](jmeter接口测试.assets/image-20200827135934613.png)

![image-20200827140408004](jmeter接口测试.assets/image-20200827140408004.png)

关键点：

1、对账号和密码进行CSV参数化

![image-20200827140137219](jmeter接口测试.assets/image-20200827140137219.png)

2、对添加到购物车一步的商品`id`进行`CSV`参数化：

![image-20200827140332074](jmeter接口测试.assets/image-20200827140332074.png)

3、**勾选反复清楚`cookie`**，因为`cookie`能保持用户的登录状态，没循环完一次就清除一下`cookie`，能保证登录用户和`cookie`能对应上来，不会乱套。

![image-20200827140500621](jmeter接口测试.assets/image-20200827140500621.png)

4、设置循环次数：

![image-20200827140702766](jmeter接口测试.assets/image-20200827140702766.png)

### Jmeter 关联案例

本次案例使用到**正则表达式提取器**，利用招生系统http://192.168.239.130:8080/recruit.students/login/view，**实现新建学校和立马禁用学校的关联**，也就是新建学校和禁用学校这两个步骤处在同一个线程内完成。

![image-20200826092154459](jmeter接口测试.assets/image-20200826092154459.png)

学习参考链接：https://www.cnblogs.com/wwho/p/7277349.html

![image-20200826092559744](jmeter接口测试.assets/image-20200826092559744.png)

为什么创建学校和禁用学校要进行关联？

下面我们先分析一下**禁用学校**这个步骤：

![image-20200826093015273](jmeter接口测试.assets/image-20200826093015273.png)

那`id`和`schoolId`都是动态变化，那它们是跟着哪里变化的，根据哪里变化的，这些动态变化的数字是哪里产生的？

答案是**新建学校**一步为每一个新建的学校创建了不同的`id`和`schoolId`

接下来通过分析创建学校一步：

![image-20200826135859088](jmeter接口测试.assets/image-20200826135859088.png)

学校这里设置没有什么问题，学校名被参数化了，所以每次运行基本都能成功新建新的学校。

运行测试计划，查看结果观察树，发现新建学校一步的响应内容包含了禁用学校一步需要的请求信息：

![image-20200827115908910](jmeter接口测试.assets/image-20200827115908910.png)

所以我们可以给**新建学校**一步添加**正则表达式后置提取器**，从响应内容`response data`提取禁用一步需要的数据，最后进行参数化，达到**关联和动态变化**的效果。

![image-20200827124559369](jmeter接口测试.assets/image-20200827124559369.png)

![image-20200827120400540](jmeter接口测试.assets/image-20200827120400540.png)

正则表达式提取器使用方法：

> Apply to:和要检查的相应字段，一般都默认，主要是针对响应数据中的值去处理，如有其它需要，可以参考jmeter说明
>
> - **引用名称**：自己定义的变量名称，后续**请求**将要引用到的**变量名**,如填写的是：actionId，后面的引用方式是${actionId}
> - **正则表达式**：提取内容的正则表达式，相当于lr中的关联函数
> - 【**"（）"**  括起来的部分就是需要提取的，对于你要提的内容需要用小括号括起来】
> - **【"."**：匹配除了换行符以外的任何字符**】**
> - 【**"\*"(贪婪)**  重复零次或更多
>
> ​     例如"aaaaaaaa" 匹配字符串中所有的a  正则： "`a*`"  会出到所有的字符"a"】
>
> - 【**"+"(懒惰)**  重复一次或更多次 
>
> ​    例如"aaaaaaaa" 匹配字符串中所有的a  正则： "`a+`"  会取到字符中所有的a字符，  "`a+`"与"`a`*"不同在于"+"至少是一次而"*" 可以是0次】
>
> - 【"?"(占有)  重复零次或一次
>
>   例如"aaaaaaaa" 匹配字符串中的a 正则 ： "`a?`" 只会匹配一次，也就是结果只是单个字符a】
>
> - 【**"\*?"**  重复任意次，但尽可能少重复 
>
>   例如 "acbacb"  正则  "`a.*?b`" 只会取到第一个"acb" 原本可以全部取到但加了限定符后，只会匹配尽可能少的字符 ，而"acbacb"最少字符的结果就是"acb" 】
>
> - 【**"+?"** 重复1次或更多次，但尽可能少重复，与**"\*?"** 一样，只是至少要重复1次】
>
> 还有分组的情况，常用的就这两种，其它的可以再自行百度
>
> - 【**"(?=exp)"** 匹配exp前面的位置】
> - 【**"(?<=exp)"** 匹配exp后面的位置】
> - **模板**：用$$引用起来，如果在正则表达式中有多个正则表达式（多个括号括起来的），则可以是$2$，$3$等等，表示解析到的第几个值给actionId。例如：$1$表示匹配到的第一个值
> - **匹配数字**：0代表随机取值，-1代表所有值，此时提取结果是一个数组，其余正整数代表第几个匹配的内容提取出来。如果匹配数字选择的是-1，还可以通过${actionId}的方式来取第1个匹配的内容，${actionId}来取第2个匹配的内容。 
> - 缺省值：正则匹配失败时，取的值

本次案例的两个正则表达式设置为：

```json
"data":{"id":(.*?),"schoolName

登录帐号为(.*?)，密码为
```

设置好正则表达式提取器后，将禁用一步的`id`和`schoolId`进行参数化：

![image-20200827130422063](jmeter接口测试.assets/image-20200827130422063.png)

然后，运行，刷新浏览器，最终的目标效果如下（新建学校后，立马禁用了学校）：

![image-20200827130627321](jmeter接口测试.assets/image-20200827130627321.png)

本案例的`jmx`文件下载链接：https://github.com/jimmy688/jmeter_jmx_files

补充：其实禁用要用到的`id`和`schoolId`不一定非要从新建学校一步的响应`body`里面提取，也可以从其它地方提取，如学校的列表页。而且，因为新建学校的响应内容是json格式的，我们还可以**使用`json`提取器来替换正则表达式提取器**，两者能达到的效果是一样的。

![image-20200827134819634](jmeter接口测试.assets/image-20200827134819634.png)

保证自己写的`json` 表达式能提取出我们想要的数据的方式：

1、查看观察树，查看新建学校一步，选择json格式：

![image-20200827135016671](jmeter接口测试.assets/image-20200827135016671.png)

2、进行`Test`试验：

![image-20200827135144947](jmeter接口测试.assets/image-20200827135144947.png)

如果响应内容是`json`格式的，我们就可以使用后置`json`提取器来提取，否则就用正则表达式的就行，也还有其它类型的提取器可以用。

不同类型的提取器用法都差不多，只不过是这个表达式的提取语法不太一样而已。

### Jmeter 随机参数化

本案例以登录xiaoqiang系统，随机购买商品为例进行讲解：

本案例的`jmx`文件下载链接：https://github.com/jimmy688/jmeter_jmx_files

![image-20200827132727597](jmeter接口测试.assets/image-20200827132727597.png)

复制生成的随机函数到商品`id`处，如下：

![image-20200827132934597](jmeter接口测试.assets/image-20200827132934597.png)

### JMeter上传下载

#### 1、下载

下载api：http://192.168.239.130/recruit.students/studentManagement/loadTemplet，该`api`是自己部署的招生系统下载学生模板的`api`，所以，要想下载，**先要登录招生系统**。

本次下载需要使用到`BeanShell Sampler`。

`Beanshell`介绍：

- 是一种完全符合`java`语法规范的脚本语言，且又拥有自己的一些语法和方法；
- 是一种松散类型的脚本语言；
- 它执行标准`java`语句和表达式，另外它还包括一些脚本命令和语法

`BeanShell`除了取样器，还有

- 定时器： `Beanshell Timer`
- 前置处理器：`BeanShell PreProcessor`
- 后置处理器：`BeanShell PostProcessor`
- 采样器：`BeanShell Sampler`
- 断言： `BeanShell` 断言
- 监听器： `BeanShell Listener`

下面是整个下载案例的总体思路：

![image-20200903111830587](jmeter接口测试.assets/image-20200903111830587.png)

`BeahShell Script:`

```java
import java.io.*;

byte[] result=prev.getResponseData();

String file_name="E:\\downup_jmeterTest\\student.xls";
	
File file=new File(file_name);
FileOutputStream out = new FileOutputStream(file);
out.write(result);
out.close();
```

下载`api`设置如下：

![image-20200903115750812](jmeter接口测试.assets/image-20200903115750812.png)

#### 2、上传

本次上传使用招生系统试验：

![image-20200904100005156](jmeter接口测试.assets/image-20200904100005156.png)

![image-20200904100232959](jmeter接口测试.assets/image-20200904100232959.png)

### 接口测试用例设计(TODO)

接口测试：

- 接口泛指实体把自己提供给外界的一种抽象化物
- 计算机中，接口是系统中`两个独立部件`进行`信息交换`的共享边界
- ![image-20200903124833537](jmeter接口测试.assets/image-20200903124833537.png)

被测系统：

![image-20200903124950249](jmeter接口测试.assets/image-20200903124950249.png)

登录：

![image-20200903125022451](jmeter接口测试.assets/image-20200903125022451.png)

接口抽象：

![image-20200903125048262](jmeter接口测试.assets/image-20200903125048262.png)

传统测试 & 接口测试

测试对象：系统/`UI`、接口/代码实现

测试手段

### jmeter连接mysql

`jmeter`连接`mysql`的步骤：

- 创建`testplan`,创建线程组
- `testplan`需要设置导入`mysql`驱动包（`mysql-connector-java-xxx.jar`包）
- 创建`JDBC Connection Configuration`
- 创建`JDBC Request`
- 创建`Debug Sampler`和`View Results Tree`来查看结果

如下：

![image-20200904170914131](jmeter接口测试.assets/image-20200904170914131.png)

#### 1、TestPlan设置：

![image-20200904171014527](jmeter接口测试.assets/image-20200904171014527.png)

`mysql`驱动包下载：https://dev.mysql.com/downloads/connector/j/

![image-20200904172905290](jmeter接口测试.assets/image-20200904172905290.png)

##### 2、JDBC Connection Configuration设置：

![image-20200904174613257](jmeter接口测试.assets/image-20200904174613257.png)

`Variable Name`： 变量名称，需要**变量名绑定到池**。**需要唯一标识。与JDBC Request取样器中的相对应**。**`JDBC request`可以通过选择不同的连接池名来选择不同的数据库连接**

`Max Number of Connection`： 数据库最大链接数

`Auto Commit`：自动提交

`Transaction Isolation`：  事务间隔级别设置

##### 3、JDBC Request设置：

![image-20200904175651334](jmeter接口测试.assets/image-20200904175651334.png)

#### 4、运行

运行后，可以看到，已经把`f_student_name`的字段的值都取出来了。我们接下来可以利用这些值进行参数化了。

![image-20200904175819767](jmeter接口测试.assets/image-20200904175819767.png)

### Foreach Controller以及mysql参数化

下面以小强系统为例，使用`Foreach Controller`（遍历控制器）和设置`mysql`参数化（点击搜索商品参数化）。

![image-20200904181646933](jmeter接口测试.assets/image-20200904181646933.png)

参数： 

`Input Variable Prefix`：输入变量前缀

`Output variable name`：输出变量名称，**提供给其它控件引用** 

`Start index for loop(exclusive)`：循环开始的索引（默认从0开始，如果填写是2，实际是从2+1个开始执行） 

`End index for loop(inclusive)`：循环结束的索引（默认从0开始，如果填写是2，实际是从2+1个开始执行） 

`Add "_" before number`：输入变量名称中是否使用`“_”`进行间隔。 

点击搜索商品取样器设置，进行参数化（引用的变量是`Output variable name`)：

![image-20200904181729144](jmeter接口测试.assets/image-20200904181729144.png)

运行：

![image-20200904182600897](jmeter接口测试.assets/image-20200904182600897.png)

![image-20200904182704175](jmeter接口测试.assets/image-20200904182704175.png)

### Foreach Controller以及mysql参数化案例2

`ForEach Controller`**只支持一个变量作为输入**，但是有时候我们需要使用多个变量作为输入变量。比如下面，以禁用招生系统的多个学校为目的，实现多个前缀变量的提取和引用：

![image-20200905111857740](jmeter接口测试.assets/image-20200905111857740.png)

![image-20200905103652398](jmeter接口测试.assets/image-20200905103652398.png)

从上面两图可以看出，`ForEacn Controller`只能循环读取同一个前缀的变量，不同变量不同前缀就不行了。因此，我们可以让`ForEach`控制器只控制一个变量的输入，然后**使用函数来获取另一个前缀的变量的值。**

获取相同前缀的变量的值可以使用`__V嵌套函数`和`__counter计数函数`来实现。

`V`函数介绍：

```lua
函数__V可以用于执行变量名表达式，并返回执行结果。它可以被用于执行嵌套函数引用。
目前直接使用${A1_${B1}} ，Jmeter是不支持的，所以需要函数来帮忙。

举个栗子，当前有两个变量 A1、A2，还有一个 N = 1

 ${A1} ：可以正常引用
 ${A${N}} ：不可以这样使用，因为不支持函数嵌套
 ${__V(A${N})} ：可以这样使用， A${N}  会变成 A1 ，__V 函数会返回 A1 

语法格式：
${__V(var,default)}

参数讲解：
字段	       含义	             是否必传
Variable Name	需要执行的变量名表达式	   yes
Default Name	默认值	              no
```

`counter`函数介绍

```lua
语法格式：
${__counter(参数1，参数2)} 

属性	描述	                                                                    必填
参数1	如果您希望每个模拟用户的计数器保持独立并与其他用户分开，则为TRUE。 False是对全局请求进行计数。	       是
参数2	用于重用此函数创建的值的引用名称。存储的值的格式为$ {refName}。这允许您保留一个计数器并在多个位置引用其值。	 否

计数器每次调用时都会生成一个新数字，从1开始，每次递增+1。计数器可以配置为将每个模拟用户的值分开，或者为所有用户使用相同的计数器。如果每个用户的值分别递增，那就像计算测试计划中的迭代次数一样。全局计数器就像计算该计划中运行的请求次数。

计数器使用整数变量来保存计数，因此最大值为2,147,483,647。
```

本案例禁用学校两个关键值：`id`和`schoolId`：

`id`使用`ForEach`来控制，`schoolId`使用函数来解决，如下：

![image-20200905114431053](jmeter接口测试.assets/image-20200905114431053.png)

`schoolId`的函数公式如下：

```lua
[{"id":${id},"disable":0,"schoolId":${__V(idd_${__intSum(2,${__counter(TRUE,)})},)}}]

其中：__V(idd_${__intSum(2,${__counter(TRUE,)})},)生成的变量名是：idd_xxx格式的
```

除了`V`函数和`counter`函数外，还是用到了`intSum`函数，因为`counter`默认是从1开始计数的，但是我们的`ForEach`控制器设置了遍历id前缀的变量的`start index`的值为2，所以我们也要让`counter`从`2`开始计数（即加个`2`），以此来**保证`id`和`schoolId`的相对应**。

`intSum`函数介绍：

```lua
语法格式：
${__intSum(1,2,3)}

参数解释：
字段	         含义	         是否必传
First number	第一个要添加的整数	yes
Second number	第二个要添加的整数	yes
nth number	   后续继续要添加的整数  no
Variable name	引用返回值的变量名   no
```

运行后，查看观察树：

![image-20200905121443449](jmeter接口测试.assets/image-20200905121443449.png)

观察上面观察树的图和下面`Navicat`的图，可以发现，`id`和`schoolId`是对应的，如果不是对应的，禁用一步也会报错。

再使用`navicat`查看数据库数据变化情况：

![image-20200905130734277](jmeter接口测试.assets/image-20200905130734277.png)

可以看到，两个学校都被禁用了。

### jmeter-ant-jenkins轻量级接口自动化测试

安装的工具：

```lua
jdk1.8   
Jmeter4.0    
ant1.9（蚂蚁）    
jenkins2.1（詹金斯）
```

#### windows安装Ant

下载安装包：https://mirrors.tuna.tsinghua.edu.cn/apache//ant/binaries/apache-ant-1.9.15-bin.zip

![image-20200907103212716](jmeter接口测试.assets/image-20200907103212716.png)

解压到非中文路径：

![image-20200907103300231](jmeter接口测试.assets/image-20200907103300231.png)

配置环境变量:

```lua
ANT_HOME	E:\install\apache-ant-1.9.14
path	E:\install\apache-ant-1.9.14\bin
classpath	E:\install\apache-ant-1.9.14\lib
```

验证是否成功安装`ant`：

![image-20200907103642345](jmeter接口测试.assets/image-20200907103642345.png)

`ant`安装完成了，接下来做`ant`和`jmeter`的集成：

#### ant与jmeter的集成

将`JMeter`所在目录下`extras`子目录里的`ant-JMeter-1.1.1.jar`复制到`Ant`所在目录`lib`子目录之下。

![image-20200907104415345](jmeter接口测试.assets/image-20200907104415345.png)

 

修改`jmeter`目录下的`bin/jmeter.properties`，找到`jmeter.save.saveservice.output_format`，去掉注释并设置为`xml`。

![image-20200907104513034](jmeter接口测试.assets/image-20200907104513034.png)

![image-20200907104602587](jmeter接口测试.assets/image-20200907104602587.png)

本地新建一个英文文件夹`testcases`，包含`report`和`script`两个文件夹：

![image-20200908194900270](jmeter接口测试.assets/image-20200908194900270.png)

在`report`目录下，创建两个文件夹`html`、`jtl`：

![image-20200908195138296](jmeter接口测试.assets/image-20200908195138296.png)

创建一个`build.xml`文件：

![image-20200909002745282](jmeter接口测试.assets/image-20200909002745282.png)

打开`build.xml`文件，添加文件内容：（**不要去修改`jmeter`安装目录下的`build.xml`文件，要自己建**）

![img](jmeter接口测试.assets/1180565-20200428161104567-189086392.png)

![image-20200908200646987](jmeter接口测试.assets/image-20200908200646987.png)

![image-20200908200429572](jmeter接口测试.assets/image-20200908200429572.png)

测试报告的格式有多样性的，如果`jmeter`安装目录`extras`中测试报告名称改了，一定要到`build.xml`文件中把报告名称改为和`extras`中的一致。

`jmeter.results.shanhe.me.xsl`下载链接：http://shanhe.me/download.php?file=jmeter.results.shanhe.me.xsl

`build.xml`的完整内容可如下：

```xml
<?xml version="1.0" encoding="utf-8"?>
<project name="jmeter_test" default="all" basedir=".">
    <tstamp>
        <format property="time" pattern="yyyyMMddhhmm" />
    </tstamp>
    <!-- 需要改成自己本地的 Jmeter 目录-->
    <property name="jmeter.home" value="E:\install\jmeter\apache-jmeter-5.3\apache-jmeter-5.3" />
    <!-- jmeter生成jtl格式的结果报告的路径-->
    <property name="jmeter.result.jtl.dir" value="E:\testcases\report\jtl" />
    <!-- jmeter生成html格式的结果报告的路径-->
    <property name="jmeter.result.html.dir" value="E:\testcases\report\html" />
    <!-- 生成的报告的前缀 -->
    <property name="ReportName" value="TestReport_jimmy" />
    <!-- 生成各种文件-->
	<property name="jmeter.result.jtlName" value="${jmeter.result.jtl.dir}/${ReportName}.jtl" />
	<!--<property name="jmeter.result.jtlName" value="${jmeter.result.jtl.dir}/${ReportName}${time}.jtl" />-->
    <property name="jmeter.result.htmlName" value="${jmeter.result.html.dir}/${ReportName}.html" />
	<!-- <property name="jmeter.result.htmlName" value="${jmeter.result.html.dir}/${ReportName}${time}.html" />-->

    <!-- 接收测试报告的邮箱 -->
<!--    <property name="mail_to" value="whweia@vip.qq.com" />-->
    <!-- 电脑地址 -->
<!--    <property name="ComputerName" value="xiaoqiang" />-->

	<!-- 解决不显示 Min/Max 统计时间的问题。同时把下面的两个jar文件copy到ant的lib包中-->
	<path id="xslt.classpath">
	<fileset dir="${jmeter.home}/lib" includes="xalan-2.7.1.jar"/>
	<fileset dir="${jmeter.home}/lib" includes="serializer-2.7.1.jar"/>
	</path>

    <target name="all">
        <antcall target="test" />
        <antcall target="report" />
    </target>
    <target name="test">
        <taskdef name="jmeter" classname="org.programmerplanet.ant.taskdefs.jmeter.JMeterTask" />
        <jmeter jmeterhome="${jmeter.home}" resultlog="${jmeter.result.jtlName}">
            <!-- 声明要运行的脚本。"*.jmx"指包含此目录下的所有jmeter脚本 -->
            <testplans dir="E:\testcases\script" includes="*.jmx" />
        </jmeter>
    </target>
	<!-- jmeter-results-detail-report_21.xsl   or    jmeter.results.shanhe.me.xsl-->
    <target name="report">
		<!-- 解决不显示时间的问题-->
		<tstamp> <format property="report.datestamp" pattern="yyyy/MM/dd HH:mm" /></tstamp>
        <xslt in="${jmeter.result.jtlName}" out="${jmeter.result.htmlName}" style="${jmeter.home}/extras/jmeter.results.shanhe.me.xsl" >
		<param name="dateReport" expression="${report.datestamp}"/>
		</xslt>
        <!-- 因为上面生成报告的时候，不会将相关的图片也一起拷贝至目标目录，所以，需要手动拷贝 -->
        <copy todir="${jmeter.result.html.dir}">
            <fileset dir="${jmeter.home}/extras">
                <include name="collapse.png" />
                <include name="expand.png" />
            </fileset>
        </copy>
    </target>
</project>
```

#### ant运行jmeter脚本

接下来可以使用`ant`运行`jmeter`脚本并生成报告了。

随便复制一个可以使用的`jmx`格式脚本到之前自己创建的`script`目录下：

![image-20200908202546896](jmeter接口测试.assets/image-20200908202546896.png)

进入`cmd`：`cd`到`testcases`目录：

![image-20200909003114956](jmeter接口测试.assets/image-20200909003114956.png)

查看生成的测试报告：

![image-20200908203148748](jmeter接口测试.assets/image-20200908203148748.png)

![image-20200908203254767](jmeter接口测试.assets/image-20200908203254767.png)

双击打开`html`报告，内容如下：

![image-20200909003241595](jmeter接口测试.assets/image-20200909003241595.png)

####  jenkins安装

`jenkins`可以直接安装，也可以使用`tomcat`来安装，下面使用`tomcat`来安装：

下载`tomcat`的`windows`安装包：https://tomcat.apache.org/download-70.cgi

![image-20200908203742823](jmeter接口测试.assets/image-20200908203742823.png)

 解压`tomcat`安装包到无英文路径：

![image-20200908204211469](jmeter接口测试.assets/image-20200908204211469.png)

进入`bin`目录，双击`startup.bat`批处理文件，看`tomcat`是否安装成功：

![image-20200908204632396](jmeter接口测试.assets/image-20200908204632396.png)

把`jenkins.war`文件放到`tomcat`的`webapp`目录中，然后重启`tomcat` (`bin`目录中 `shutdown.bat`关闭)，然后再启动`tomcat`

`jenkins.war`包下载链接：http://mirrors.jenkins-ci.org/war/latest/jenkins.war

​	![image-20200908212717868](jmeter接口测试.assets/image-20200908212717868.png)

在浏览器中输入 http://127.0.0.1:8080/jenkins/ 访问：

有可能会出现下面这个页面，要加载一会：

![image-20200909005818398](jmeter接口测试.assets/image-20200909005818398.png)

`Jenkins`加载完毕后，输入密码解锁：

![image-20200908183320405](jmeter接口测试.assets/image-20200908183320405.png)

查看文件：`C:\Users\Administrator\.jenkins\secrets\initialAdminPassword`来获取密码。

输入密码，回车：

为避免出错，打开链接：http://127.0.0.1:8080/jenkins/pluginManager/advanced

修改内容：将`https`改为`http`

![image-20200908184456143](jmeter接口测试.assets/image-20200908184456143.png)

![image-20200908184504567](jmeter接口测试.assets/image-20200908184504567.png)

修改后，重新访问路径：http://127.0.0.1:8080/jenkins/  ，选择推荐安装：

![image-20200908184553026](jmeter接口测试.assets/image-20200908184553026.png)

![image-20200908184724454](jmeter接口测试.assets/image-20200908184724454.png)

敲黑板：`Jenkins`插件下载速度慢、经常安装失败。启动后先不要安装插件，先替换文件再安装插件，

解决办法：替换所有插件下载的`url`，替换连接测试`url`。修改`C`盘的`default.json`文件的内容，`default.json`的路径可以从解锁那一步知道，在`C:\Users\Administrator\.jenkins\updates`下：

将`google.com`修改为`baidu.com`:

![image-20200909011339307](jmeter接口测试.assets/image-20200909011339307.png)

 

![image-20200909011621463](jmeter接口测试.assets/image-20200909011621463.png)

配置完成后重启jenkins，后缀加上restart

![img](jmeter接口测试.assets/clip_image046.jpg)

如果还是下载插件失败的话，停止`tomcat`，删除`war`包，删除`.jenkins`的文件，然后再把`war`包上传，启动`tomcat`，多试试几次。或者可以重启电脑

安装完插件后要设置自己的账号密码，务必记住：

```
krystal
krystal123
```

邮箱设置建议使用126或163邮箱。

登陆后，页面如下：

![image-20200909012018354](jmeter接口测试.assets/image-20200909012018354.png)

如果登录后页面空白，那么进行以下操作：没有空白页的就不要这一步操作

进入`.jenkins`的目录，修改`conf.xml`文件

![img](jmeter接口测试.assets/clip_image052.jpg)

然后重启`jenkins`。

8、新建自由风格的项目

![image-20200909012135685](jmeter接口测试.assets/image-20200909012135685.png)

 选择第一个自由风格，然后点击OK按钮

![image-20200909013208648](jmeter接口测试.assets/image-20200909013208648.png)

 配置`ant`，增加`build`路径

![image-20200909013257003](jmeter接口测试.assets/image-20200909013257003.png)

![image-20200909013120424](jmeter接口测试.assets/image-20200909013120424.png)

注意点：

![img](jmeter接口测试.assets/clip_image062.jpg)

点击保存之后，继续配置测试报告

如果没有安装推荐的插件在这里需要下载一个插件`Public HTML reports` 

`Manage Jenkins`---》`Manage Plugins`----》可选插件  输入`HTML Publisher` 进行查询并进行安装

![image-20200909012840096](jmeter接口测试.assets/image-20200909012840096.png)

![image-20200909012938505](jmeter接口测试.assets/image-20200909012938505.png)

接下来继续配置报告

点击增加构建后操作步骤  并点击`Public HTML reports` 

![image-20200909013401266](jmeter接口测试.assets/image-20200909013401266.png)

![image-20200909013429527](jmeter接口测试.assets/image-20200909013429527.png)

![](jmeter接口测试.assets/clip_image066.gif)

![image-20200909013549899](jmeter接口测试.assets/image-20200909013549899.png)

 　并点击保存按钮  好了 现在我们报告也配置好了 ，现在进行`jenkins`构建下吧

![image-20200909013617988](jmeter接口测试.assets/image-20200909013617988.png)

![image-20200909013646899](jmeter接口测试.assets/image-20200909013646899.png)

查看输出：

![image-20200909013802330](jmeter接口测试.assets/image-20200909013802330.png)

![image-20200909013915085](jmeter接口测试.assets/image-20200909013915085.png)

　　好了到了这一步 已经构建成功了，`Success` ! 

　　我们在`jenkins`下面看下`HTML` 报告

![IMG_265](jmeter接口测试.assets/clip_image074.gif)

![img](jmeter接口测试.assets/clip_image076.jpg)

![img](jmeter接口测试.assets/clip_image078.jpg)

之后可以用`jenkins`定时器定时执行`jmeter`脚本，也可以批量执行`jmeter`脚本。

#### jenkins构建触发器

##### 定时构建

举个例子：**每天上班前跑一遍你的脚本**

![image-20200909015805984](jmeter接口测试.assets/image-20200909015805984.png)

定时规则如下：

| 字段                          | *    | *    | *       | *       | *     |
| ----------------------------- | ---- | ---- | ------- | ------- | ----- |
| 含义                          | 分钟 | 小时 | 日期    | 月份    | 星期  |
| 取值范围                      | 0-59 | 0-23 | 1月31日 | 1月12日 | 0-7   |
|                               |      |      |         |         |       |
| 示例                          |      |      |         |         |       |
| 每隔15分钟执行一次            | H/15 | *    | *       | *       | *     |
| 每隔2个小时执行一次           | H    | H/2  | *       | *       | *     |
| 每隔3天执行一次               | H    | H    | H/3     | *       | *     |
| 每隔3天执行一次(每月的1-15号) | H    | H    | 1-15/3  | *       | *     |
| 每周1,3,5执行一次             | H    | H    | *       | *       | 1,3,5 |

```lua
每隔5分钟构建一次
H/5 * * * *

每两小时构建一次
H H/2 * * *

每天中午12点定时构建一次
H 12 * * *

每天下午18点定时构建一次
H 18 * * *

在每个小时的前半个小时内的每10分钟
H(0-29)/10 * * * *

每两小时45分钟，从上午9:45开始，每天下午3:45结束
45 9-16/2 * * 1-5

每两小时一次，每个工作日上午9点到下午5点(也许是上午10:38，下午12:38，下午2:38，下午4:38)
H H(9-16)/2 * * 1-5
```

#### jenkins邮件通知设置

本次以**163网易邮箱**为例，设置`jenkins`的邮件通知。若使用其它邮箱，也是基本一样的步骤。

##### 第一步：网页登录163邮箱，设置开启smtp服务

登录163邮箱：

![image-20200910140613009](jmeter接口测试.assets/image-20200910140613009.png)

![image-20200910140654691](jmeter接口测试.assets/image-20200910140654691.png)

![image-20200910140823194](jmeter接口测试.assets/image-20200910140823194.png)

点击开启`IMAP/SMTP`服务后，会弹出二维码，然后使用手机微信扫描，扫描后会自动跳到发送短信界面：

![image-20200910141636558](jmeter接口测试.assets/image-20200910141636558.png)

手机发送短信后，回到`163`邮箱页面，**点击已发送短信**（不行就多点一次，不要着急），如果成功后，会弹出一下界面：

![image-20200910141247370](jmeter接口测试.assets/image-20200910141247370.png)

把授权码记录下来，不要泄露给别人。

接下来**开启`POP3/SMTP`服务**，也是一样的步骤，**点击开启》手机微信扫描》发送短信》点击已发送短信。**

出现以下界面即代表开启成功：

![image-20200909193356776](jmeter接口测试.assets/image-20200909193356776.png)

两个服务都开启后，界面如下：

![image-20200910142233279](jmeter接口测试.assets/image-20200910142233279.png)

##### 第二步：在电脑安装Foxmail,并登录163邮箱

**此步其实可以省略，着急时可以直接跳到第三步！**。

`Foxmail`安装包下载链接：https://www.foxmail.com/

安装`Foxmail`后，登录`163`邮箱：

![image-20200910142912223](jmeter接口测试.assets/image-20200910142912223.png)

![image-20200910143109095](jmeter接口测试.assets/image-20200910143109095.png)

**如果能登录成功，代表你的`smtp`服务确实正常成功开启了**。

登录后，查看`163`邮箱的`smtp`服务的端口，找到设置

![image-20200910143255470](jmeter接口测试.assets/image-20200910143255470.png)

![image-20200910143606074](jmeter接口测试.assets/image-20200910143606074.png)

##### 第三步：设置Jenkins系统配置

1、进入`Jenkins`的系统设置页面:

![image-20200910143827797](jmeter接口测试.assets/image-20200910143827797.png)

2、设置**Extended E-mail Notification**：

下面**有些选项你可能是看不到的**，你需要点击**高级选项**，或者`Default Triggers`才能看到。

![image-20200910144614094](jmeter接口测试.assets/image-20200910144614094.png)

![image-20200910144926505](jmeter接口测试.assets/image-20200910144926505.png)

![image-20200910145455279](jmeter接口测试.assets/image-20200910145455279.png)

3、设置邮件通知：

![image-20200910145843452](jmeter接口测试.assets/image-20200910145843452.png)

测试邮件成功发送后，界面如下：![image-20200910145909959](jmeter接口测试.assets/image-20200910145909959.png)

**最后保存！！！**

##### 第四步：配置你的`project`项目（任务）：

点击配置：

![image-20200910150053790](jmeter接口测试.assets/image-20200910150053790.png)

设置构建后操作：

![image-20200910150345300](jmeter接口测试.assets/image-20200910150345300.png)

点击高级设置：

![image-20200910150425380](jmeter接口测试.assets/image-20200910150425380.png)

设置触发器：

![image-20200910150733517](jmeter接口测试.assets/image-20200910150733517.png)

接下来，保存即可。

##### 第五步：测试能否收到邮件

自己点击运行`project`或者设置定时触发器：

![image-20200910151556289](jmeter接口测试.assets/image-20200910151556289.png)

![image-20200910151631798](jmeter接口测试.assets/image-20200910151631798.png)

查看构建队列，如果有刚刚完成的任务，去看看自己的邮箱有没有收到邮件通知，若收到通知，则代表邮件通知设置成功了！！！

我收到的邮件如下：

![image-20200910151940773](jmeter接口测试.assets/image-20200910151940773.png)



### Jmeter跨线程组调用

setProperty

### fiddler抓包篡改数据

#### Before Request

案例需求：在招生系统新建学校，发送请求之前，进行篡改请求的数据，修改要新建的学校名称。

1、打开`jmeter`来新建学校，或者打开浏览器新建学校也行：

![image-20200907111053243](jmeter接口测试.assets/image-20200907111053243.png)

2、设置`fiddler`:`Rulers –Automatic Breakpoints—Before Requests`

![image-20200907105944263](jmeter接口测试.assets/image-20200907105944263.png)

3、点击新建学校：`我的大学_1`

![image-20200907111151645](jmeter接口测试.assets/image-20200907111151645.png)

4、回到`fiddler`，修改请求`body`的信息，学校名称：`我的大学_2`:

![image-20200907111408901](jmeter接口测试.assets/image-20200907111408901.png)

5、点击`Run to Completion`：

![image-20200907111537182](jmeter接口测试.assets/image-20200907111537182.png) 

6、点击后，请求就正式发送出去了：

![image-20200907111611015](jmeter接口测试.assets/image-20200907111611015.png)

![image-20200907111648108](jmeter接口测试.assets/image-20200907111648108.png)

#### After Response

设置`After Response`: `Rulers –Automatic Breakpoints—After Responses`

![image-20200907112809164](jmeter接口测试.assets/image-20200907112809164.png)

刷新页面：

![image-20200907112752024](jmeter接口测试.assets/image-20200907112752024.png)

篡改响应内容，点击 `Run to Completion`:

![image-20200907112648976](jmeter接口测试.assets/image-20200907112648976.png)

查看篡改效果：

![image-20200907113008899](jmeter接口测试.assets/image-20200907113008899.png)

#### 篡改数据的应用

比如说，我要测试招生系统的不同长度学校名称的`UI`显示效果，那么我可以直接使用`Before Request`来修改请求或者`After response`来修改响应内容：

![image-20200908090948627](jmeter接口测试.assets/image-20200908090948627.png)

比如，可以设置`After Response`，直接刷新页面，然后找到学校列表的接口，修改响应内容的学校名称，然后

![image-20200908095808711](jmeter接口测试.assets/image-20200908095808711.png)

### fiddler抓App包

1、保证手机与电脑处在同一个局域网中

2、修改`fiddler`配置：

![image-20200909113809220](jmeter接口测试.assets/image-20200909113809220.png)

2、`windows` `dos`输入`ipconfig`查看`ip`：

![image-20200909113731788](jmeter接口测试.assets/image-20200909113731788.png)

3、手机修改代理方式（改为手动）、`ip`和端口（端口跟`fiddler`上设置的一致）：

![image-20200909113928224](jmeter接口测试.assets/image-20200909113928224.png)

4、用手机随便访问一个网页，抓包：

![image-20200909114022886](jmeter接口测试.assets/image-20200909114022886.png)

### jmeter用户自定义变量

#### 方式1：Testplan中添加

![image-20200909140820235](jmeter接口测试.assets/image-20200909140820235.png)

![image-20200909140840436](jmeter接口测试.assets/image-20200909140840436.png)

#### 方式2：User Defined Variable中添加

![image-20200909140951287](jmeter接口测试.assets/image-20200909140951287.png)

![image-20200909141146799](jmeter接口测试.assets/image-20200909141146799.png)

![image-20200909141217048](jmeter接口测试.assets/image-20200909141217048.png)

#### 方式3：User Parameters中添加

![image-20200909143032181](jmeter接口测试.assets/image-20200909143032181.png)

在`User Parameters`里面添加变量，添加用户。

这样一来，就可以实现**一个变量，不同用户对应不同的值**。

![image-20200909142946835](jmeter接口测试.assets/image-20200909142946835.png)

设置好`User Parameters`后，添加两个`http request`取样器，第一取样器使用`url1`，第二个取样器使用`url2`：

![image-20200909145433760](jmeter接口测试.assets/image-20200909145433760.png)

设置线程组：`1`个线程

![image-20200909145509747](jmeter接口测试.assets/image-20200909145509747.png)

运行，两个`request`都是同一个线程来运行的：`request1`使用`User_1`的`url1`，`request2`使用`User_2`的`url2`：

![image-20200909150112477](jmeter接口测试.assets/image-20200909150112477.png)

将线程组设置为`2`个线程：

![image-20200909150745956](jmeter接口测试.assets/image-20200909150745956.png)

运行，4个`url`都被访问了

![image-20200909151052640](jmeter接口测试.assets/image-20200909151052640.png)
