## app

### 安卓开发环境搭建

`Android`开发环境有三种方式，分别是`JDK+SDK+Eclipse+ADT`、`JDK+adt-bundle`与`JDK+Android Studio`。

不要使用`JDK+SDK+Eclipse+ADT`这种方式，不是说什么太复杂的，网络实在太慢，打开`SDK`工具之后就根本就下载不了。`Android Studio`也是不行的，说好集合大量打开环境。安装的时候却还是需要联网。

**建议使用`JDK+adt-bundle`这种方式来搭建`Android`开发环境**。

`ADT-Bundle`是由`Google Android`官方提供的集成式`IDE`，已经包含了`Eclipse`，`Android SDK`及`Android`所需要的平台工具，新手只需要`ADT-Bundle`即可快速搭建起`Android`开发环境，省了不少事情。

`adt-bundle-windows`的下载：

下载链接1：http://pan.baidu.com/s/1kUm638V

下载链接2：http://dl.google.com/android/adt/adt-bundle-windows-x86-20131030.zip（32位）http://dl.google.com/android/adt/adt-bundle-windows-x86_64-20131030.zip（64位）

![image-20200929150518980](app测试.assets/image-20200929150518980.png)

下载后`adt`后，解压到一个没有中文的路径。

打开`cmd`，进入到`adt`里面的`adb`所在目录（可以配置环境变量），输入`adb version`：

![image-20200930130048338](app测试.assets/image-20200930130048338.png)

安装一个安卓模拟器，推荐的模拟器：

- **https://pro.itools.cn/simulate/**（`iTools`）
- https://www.yeshen.com/（`夜神`）

先开启安卓模拟器，再开启cmd，输入`adb devices`，查看连接到`PC`的安卓设备：

![image-20200930130012934](app测试.assets/image-20200930130012934.png)

### monkey介绍

“猴子测试”是指没有测试经验的人甚至对计算机根本不了解的人（就像猴子一样）不需要知道程序的任何用户交互方面的知识，如果给他一个程序，他就会针对他看到的界面进行操作，**其操作是无目的的、乱点乱按的**。

`monkey`是`Android`系统自带一个命令行工具，可以运行在模拟器里或者真是设备中运行。`monkey`向系统发送伪随机的用户事件流，实现对正在开发的应用程序进行压力测试。

通过这个工具可以模拟用户触摸屏幕、滑动轨迹球、按键等操作来对模拟器或者手机设备上的软件进行压力测试，检测该软件的稳定性、健壮性。

1、运行时机：一般是产品稳定后，首轮**功能测试完成**的**夜间进行**

2、需要知道`packageName`

3、目的：主要测试产品是否存在崩溃问题和`ANR`问题。

稳定性问题 —— `ANR /Crash`等问题；`ANR`是指当`Android`系统监测到应用程序在`5`秒内没有响应输入的事件或广播在`10`秒内没有执行完毕时**抛出无响应提示**（`ANR(Application Not Responding`)）。`Crash`是指当应用程序出现错误时导致程序异常停止或退出的情况。

注：卡顿与`ARN`的问题。卡顿简单的来说，就是**手机没有及时响应、页面延迟，出现丢帧**的现象，或者点击无响应。绝大多数的卡顿，稍等片刻系统就会恢复正常，但假如超过`5S`，就可能会引发手机`ANR`警告。

`monkey`的使用：

（1） `Monkey`程序由`Android`系统自带，使用`Java`语言写成，在`Android`文件系统中的存放路径是： `/system/framework/monkey.jar`

![image-20200930131711746](app测试.assets/image-20200930131711746.png)

（2） `Monkey.jar`程序是由一个名为“`monkey`”的`Shell`脚本来启动执行，`shell`脚本在`Android`文件系统中 的存放路径是：`/system/bin/monkey`； 

（3）`Monkey` 命令启动方式：

- a）可以通过`PC`机`CMD`窗口中执行: `adb shell monkey ｛+命令参数｝`来进行`Monkey`测试

![image-20200930131233347](app测试.assets/image-20200930131233347.png)

- b）在`PC`上`adb shell` 进入`Android`系统，通过执行`monkey {+命令参数}` 来进行`Monkey` 测试

![image-20200930131307166](app测试.assets/image-20200930131307166.png)

- c ) 在`Android`机或者模拟器上直接执行`monkey` 命令，可以在`Android`机上安装`Android`终端模拟器  

### adb

`adb(Android Debug Bridge)`**是`android sdk`的一个工具**，是用来连接安卓手机和`PC`端的桥梁，要有`adb`作为二者之间的维系，才能让用户在电脑上对手机进行全面的操作。

`Android`的初衷是用`adb`这样的一个工具来协助开发人员在开发`android`应用的过程中更快更好地调试`apk`（`Android application package`，`Android`应用程序包），因此`adb`具有安装卸载`apk`、拷贝推送文件、查看设备硬件信息、查看应用程序占用资源、在设备执行`shell`命令等功能（`android`的底层内核是`linux`）。

### monkey架构

`Monkey` 运行在设备或模拟器上面，可以脱离`PC`运行（普遍做法是将`monkey`作为一个像待测应用发送 随机按键消息的测试工具。验证待测应用在这些随机性的输入面前是否会闪退或者崩溃）

![image-20200930131953003](app测试.assets/image-20200930131953003.png)

### monkey参数大全

![image-20200930132051192](app测试.assets/image-20200930132051192.png)

参数详情介绍：

```lua
-p <允许的包名列表>
用此参数指定一个或多个包。指定包之后，monkey将只允许系统启动指定的app。如果不指定包， monkey将允许系统启动设备中的所有app。
指定一个包：adb shell monkey –p com.sf.DarkCalculator -v 100
指定多个包：adb shell monkey -p fishjoy.control.menu –p com.shjt.map –v 100

-v
用于指定反馈信息级别（信息级别就是日志的详细程度），总共分3个级别，分别对应的参数如下 表所示：
Level 0: adb shell monkey -p com.shjt.map -v 100  // 缺省值，仅提供启动提示、测试完成和最终结果等少量信息
Level 1:adb shell monkey –p com.shjt.map –v -v 100 // 提供较为详细的日志，包括每个发送到Activity的事件信息
Level 2:adb shell monkey –p com.shjt.map –v –v -v 100  // 最详细的日志，包括了测试中选中/未选中的Activity信息


-s（随机数种子）
用于指定伪随机数生成器的seed值，如果seed相同，则两次Monkey测试所产生的事件序列也相同的。示例：
monkey测试1：adb shell monkey –p com.shjt.map –s 10 100 
monkey测试2：adb shell monkey –p com.shjt.map –s 10 100
	
	好像随机数种子比必须写在测试事件次数之前,比如，按照下面的格式，貌似重现不了一样的效果：
	adb shell monkey –p com.shjt.map  100 –s 10


--throttle <毫秒>
用于指定用户操作（即事件）间的时延，单位是毫秒；如果不指定这个参数，monkey会尽可能快地生成和发送消息。 
示例：adb shell monkey –p com.shjt.map --throttle 3000 -v 100

Event percentages（事件百分比）:

0：点击事件百分比，即参数--pct-touch
1：滑动事件百分比，即参数--pct-motion
2：缩放事件百分比，即参数--pct-pinchzoom
3：轨迹球事件百分比，即参数--pct-trackball
4：屏幕旋转事件百分比，即参数--pct-rotation
5：基本导航事件百分比，即参数--pct-nav
6：主要导航事件百分比，即参数--pct-majornav
7：系统按键事件百分比，即参数--pct-syskeys
8：Activity启动事件百分比，即参数--pct-appswitch
9：键盘唤出隐藏事件百分比，即参数--pct-flip
10：其他事件百分比，即参数--pct-anyevent

```

### monkey使用场景

```lua
策略
    异常策略
        跑完：全部异常忽略
        专门测试某个异常：不忽略某个异常，出现某个异常即停止测试
        人在时候：上班过程中跑不忽略异常，出现异常马上停止，可以马上处理
        验收策略：去除全部异常，出现错误则停止，则验收不通过

    延时策略
        低延时高延时
        随机延时
        用户操作延时

    事件数量
        常规测试：10W
        压力型测试：30W
        稳定性测试：50W
        长时间执行：100W

```

忽略崩溃、异常、超时：

`--ignore-crashes` 忽略崩溃和异常

![image-20200930133424729](app测试.assets/image-20200930133424729.png)

 `--ignore-timeouts` 忽略超时

![image-20200930133429697](app测试.assets/image-20200930133429697.png)

两个参数一起使用：

![image-20200930133452818](app测试.assets/image-20200930133452818.png)

命令组合：

```
应用选取策略+随机种子策略+事件策略+异常策略+延时策略+事件数量

应用选择策略
    单应用
    多应用组合
    黑白名单组合
    整机测试
    
随机种子策略
    固定种子，从小到极大
    随机种子

事件策略
	用户故事策略：依据常见的用户场景划分各事件百分比
	应用特性策略：依据应用策略对Monkey各事件进行划分百分比
	专项测试策略：对某个事件提高到很高的百分比，对应用进行专项测试
```

`monkey`使用策略：

```
需求开发
	轻量	延迟高些	针对专项

迭代完成
	高压	全面测试	各种组合命令专项	延时低	事件多	关注性能

稳定版
	虐待	全面测试	加大压力事件大	专项性能
	
验收
```

`monkey`使用注意点：

```lua
a.事件的总百分比不能超过100%
b.事件的百分比要写出，不能空白，空白当事件没有100%的时候，会自动分配
c.记得加种子，如果没有加种子的话，不方便问题的回归
d.注意编写格式（会提供一个脚本工具）
```

### monkey测试练习

预备知识：

```sh
查看包名的方式：
	
	1、获取所有包名：
		adb shell pm list package
	2、获取第三方包名：
		adb shell pm list package -3
	3、获取包名和activity
		adb logcat | findstr START

```

测试对象：计算器：

![image-20200930150736626](app测试.assets/image-20200930150736626.png)

#### 测试语句练习1

```sh
1、指定一个包让Monkey程序模拟100次随机用户事件
	adb shell monkey -p com.sf.DarkCalculator 100
	说明：参数-p用于约束限制，用此参数指定一个或多个包（即App）。指定包之后，Monkey将只允许系统启动指定的APP；如果不指定包，Monkey将允许系统启动设备中的所有APP，com.sf.DarkCalculator为包名，100是事件计数。
	
2、指定日志级别
    //指定日志级别Level 0
    adb shell monkey -v -p com.sf.DarkCalculator  100
    说明：日志级别用于指定反馈信息级别（信息级别就是日志的详细程度），日志级别 Level 0 ，仅提供启动提示、测试完成和最终结果等少量信息。

    /指定日志级别Level 1
    adb shell monkey –v -v -p com.sf.DarkCalculator  100
    说明：日志级别 Level 1，提供较为详细的日志，包括每个发送到Activity的事件信息。 

    //指定日志级别Level 2
    adb shell monkey –v -v -v -p com.sf.DarkCalculator  100
    说明：日志级别 Level 2，提供最详细的日志，包括了测试中选中/未选中的Activity信息。

3、--throttle <毫秒>
    用于指定用户操作（即事件）间的时延，单位是毫秒；如果不指定这个参数，monkey会尽可能快的生成和发送消息。
    //指定用户操作（即事件）间的时延
    adb shell monkey -v -p com.sf.DarkCalculator 100 –-throttle 1000
    说明：throttle单位是毫秒。

4、调整事件百分比
    //调整触摸事件的百分比
    adb shell monkey -v -p com.sf.DarkCalculator 1000 --pct-touch 10 
    说明：--pct-｛+事件类别｝｛+事件类别百分比｝用于指定每种类别事件的百分比（在Monkey事件序列中，该类事件数目占总事件数目的百分比），--pct-touch ｛+百分比｝用于调整触摸事件的百分比(触摸事件是一个down-up事件，它发生在屏幕上的某单一位置)。


    /调整动作事件的百分比
    adb shell monkey -v -p com.sf.DarkCalculator 1000 --pct-motion 20  
    说明：调整动作事件的百分比(动作事件由屏幕上某处的一个down事件、一系列的伪随机事件和一个up事件组成)。


    //调整轨迹事件的百分比
    adb shell monkey -v -p com.sf.DarkCalculator  1000 --pct-trackball 30 
    说明：调整轨迹事件的百分比(轨迹事件由一个或几个随机的移动组成，有时还伴随有点击)。


    //调整“基本”导航事件的百分比
    adb shell monkey -v -p com.sf.DarkCalculator 1000 --pct-nav 40 
    说明：调整“基本”导航事件的百分比(导航事件由来自方向输入设备的up/down/left/right组成)。

    //调整主要导航事件的百分比
    adb shell monkey  -v -p com.sf.DarkCalculator  1000 --pct-majornav 50
    说明：调整主要导航事件的百分比(这些导航事件通常引发图形界面中的动作，如：5-way键盘的中间按键、回退按键、菜单按键)。

    //调整系统按键事件的百分比
    adb shell monkey -v -p com.sf.DarkCalculator 1000 --pct-syskeys 60  
    说明：调整系统按键事件的百分比(这些按键通常被保留，由系统使用，如Home、Back、Start Call、End Call及音量控制键)

    //指定多个类型事件的百分比
    adb shell monkey -p com.sf.DarkCalculator 1000 --pct-touch 50 --pct-motion 50 
    注意：各事件类型的百分比总数不能超过100%

5、忽略选项
    //即使app崩溃，Monkey依然继续发送事件，直到事件数目达到目标值为止
    adb shell monkey -v -p com.sf.DarkCalculator 1000 --ignore-crashes  
    说明：用于指定当应用程序崩溃时（Force& Close错误），Monkey是否停止运行。如果使用--ignore-crashes参数，即使应用程序崩溃，Monkey依然会发送事件，直到事件计数达到1000为止。

    //即使APP发生ANR，Monkey依然继续发送事件，直到事件数目达到目标值为止
    adb shell monkey -v -p com.sf.DarkCalculator 1000 --ignore-timeouts 
    说明：用于指定当应用程序发生ANR（Application No Responding）错误时，Monkey是否停止运行如果使用--ignore-timeouts参数，即使应用程序发生ANR错误，Monkey依然会发送事件，直到事件计数完成。
```

#### 测试语句练习2

```sh
通过APP测试之Monkey压力测试（一），我们了解了Monkey是什么，Monkey是如何实现对APP进行压力测试，也熟悉了Monkey基本的命令，今天将在之前的基础上进行补充和拓展，一起深入接触并掌握Monkey，这之后，我们还将总结APP测试常见问题！

Monkey参数的约束限制规范：
1.	一个 -p 选项只能用于一个包，指定多个包，需要使用多个 -p 选项；

2.-s <seed> 伪随机数生成器的seed值，如果用相同的seed值再次运行monkey，它将生成相同的事件序列，对9个事件分配相同的百分比；

3.-v 命令行的每一个-v将增加反馈信息的级别：
Level 0为一个-v的命令，除了启动的提示、测试完成和最终结果之外，提供较少的信息 ;
Level 1为两个-v的命令，提供较为详细的测试信息，如逐个发送到Activity的事件 ；
Level 2为三个-v的命令，提供更加详细的测试信息，如测试中被选中或未被选中的Activity；


常见命令组合：
1.monkey -v -p com.package  500 ：简单的输出测试的信息；
2.monkey -v -v -v -p com.package  500  ：以深度为三级输出测试信息；
3.monkey -v -p com.package --port 端口号  ：为测试分配一个专用的端口号，不过这个命令只能输出跳转的信息及有错误时输出信息；
4.monkey -v -p com.package 500 -s 数字   ：为随机数的事件序列定一个值，若出现问题下次可以重复同样的系列进行排错；
5.monkey -v -p com.package 500  --throttle 3000  
:为每一次执行一次有效的事件后休眠3000毫秒；


Monkey测试参数建议
间隔时间：500毫秒；
种子数：随机；
遇到错误：不停止；
执行时长：每机型不小于12小时或点击次数：100万次；
机型覆盖建议：覆盖高中低端机型
不同芯片平台（高通、海思、MTK等）
不同分辨率（480*800以上主流分辨率）
不同安卓版本（安卓8.0以上主流安卓版本）；





Monkey参考命令
adb shell monkey -v -v -v -p com.tencent.XXX(替换包名) --throttle 500 --ignore-crashes --ignore-timeouts --ignore-security-exceptions --ignore-native-crashes  1000000>d:\monkeyScreenLog.log

测试可以发现的问题
Android平台应用程序可能产生以下两种问题：
1、Crash
2、ANR （响应延时）

```



### app专项测试

#### app启动时间测试

```lua
什么是应用启动的时间

	在上面这个启动流程中，任何一个地方有耗时操作都会拖慢我们应用的启动速度，而应用启动时间是用毫秒度量的，对于毫秒级别的快慢度量我们还是需要去精确的测量到到底应用启动花了多少时间，而根据这个时间来做衡量。
什么才是应用的启动时间
	从点击应用的启动图标开始创建出一个新的进程直到我们看到了界面的第一帧，这段时间就是应用的启动时间。
我们要测量的也就是这段时间，测量这段时间可以通过adb shell命令的方式进行测量，这种方法测量的最为精确，命令在下面的原理里面。


	app冷启动： 当应用启动时，后台没有该应用的进程，这时系统会重新创建一个新的进程分配给该应用， 这个启动方式就叫做冷启动（后台不存在该应用进程）。
	app热启动： 当应用已经被打开， 但是被按下返回键、Home键等按键时回到桌面或者是其他程序的时候，再重新打开该app时， 这个方式叫做热启动（后台已经存在该应用进程）。
	app首次启动: 首次启动应用时会有很多的数据或配置文件的初始化工作，因此其启动时间远远大于冷启动的启动时间，这样的话app的启动时间也就变成了从3个指标去衡量了


原理
	adb shell am start -W [packageName]/[packageName.MainActivity]
	执行成功后将返回三个测量到的时间：
	
	ThisTime:一般和TotalTime时间一样，除非在应用启动时开了一个透明的Activity预先处理一些事再显示出主Activity，这样将比TotalTime小。
	TotalTime:应用的启动时间，包括创建进程+Application初始化+Activity初始化到界面显示。
	WaitTime:一般比TotalTime大点，包括系统影响的耗时。
	
	脚本取的是TotalTime

```

获取包名的方法：

```sh
adb logcat | findstr START
```

然后点击启动模拟器上的应用，获取包名和`Activity`：(`com.sf.DarkCalculator/.MainActivity`)

![image-20200930173840396](app测试.assets/image-20200930173840396.png)

获取启动时间：`adb shell am start -W -n com.sf.DarkCalculator/.MainActivity`

![image-20200930174023274](app测试.assets/image-20200930174023274.png)

关闭`app`

`adb shell am force-stop com.sf.DarkCalculator`

热启动关闭`app`