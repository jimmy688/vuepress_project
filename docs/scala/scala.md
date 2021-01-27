## 待解决问题（TODO）

1. scala数组可以存放不同类型的数据吗？如：val arr=Array("hello",1,3.5,Test)
2. 

## scala简介

* scala是运行在 JVM 上的多范式编程语言，同时支持==面向对象==和==面向函数编程==
* 早期scala刚出现的时候，并没有怎么引起重视，随着==Spark==和==Kafka==这样基于scala的大数据框架的兴起，scala逐步进入大数据开发者的眼帘。scala的主要优势是它的表达性。
* 官网地址: http://www.scala-lang.org

为什么要使用scala?

* 开发大数据应用程序（Spark程序、Flink程序）
* 表达能力强，一行代码抵得上Java多行，开发速度快
* 兼容Java，可以访问庞大的Java类库

![1568095858219](scala.assets/1568095858219.png)



## scala开发环境安装

学习如何编写scala代码之前，需要先安装scala编译器以及开发工具。

scala程序运行需要依赖于Java类库，必须要有**==Java运行环境==**，scala才能正确执行

**要编译运行scala程序需要**：

* ==jdk  ( jvm )==
* ==scala编译器（scala SDK）==

Java程序编译执行流程

![1556551819121](scala.assets/1556551819121.png)

Scala程序编译执行流程

![1556551904384](scala.assets/1556551904384.png)



#### 第一步：安装JDK

~~~
安装JDK 1.8 64位版本，并配置好环境变量
~~~

#### 第二步：安装scala SDK

###### 下载安装包sdk

~~~
scala SDK是scala语言的编译器，要开发scala程序，必须要先安装SDK
~~~

安装包下载地址：https://www.scala-lang.org/download/2.11.8.html

所有版本的安装包的下载地址：https://www.scala-lang.org/download/all.html

下载安装包: scala-2.11.8.zip

![scala-sdk](scala.assets/scala-2.11.8.png)

###### 解压安装包

将下载好的安装包解压到没有空格没有中文的路径，我们的安装路径是：D:\scalaInstall

<img src="scala.assets/image-20200410180113337.png" alt="image-20200410180113337" style="zoom:67%;" />

###### 配置环境变量

新建系统变量：

<img src="scala.assets/image-20200410180356247.png" alt="image-20200410180356247" style="zoom:67%;" />

修改变量Path:

<img src="scala.assets/image-20200410180546044.png" alt="image-20200410180546044" style="zoom: 67%;" />

###### 验证sdk是否安装成功

cmd-->输入scala，回车

```sh
C:\Users\97464>scala
Welcome to Scala 2.11.8 (Java HotSpot(TM) 64-Bit Server VM, Java 1.8.0_201).
Type in expressions for evaluation. Or try :help.

scala>
```



#### 第三步：安装IDEA的scala插件

IDEA默认是不支持scala程序开发，所以需要来安装scala插件来支持scala语言。安装scala插件可以通过在线安装，也可以通过离线安装。我们之前已经进行过在线安装了，不用再安装，下列展示了离线安装的方法。

###### 查看IDEA版本

打开IDEA，通过help查看版本，我们的版本是2019.3.1

<img src="scala.assets/image-20200410180855619.png" alt="image-20200410180855619" style="zoom:67%;" />



###### 到IDEA官网下载对应版本的[IDEA scala插件](http://plugins.jetbrains.com/plugin/1347-scala)

一定要下载IDEA版本一致的scala插件，只需要保证主次版本一致即可，即2019.3

查看scala的所有版本的地址为：https://plugins.jetbrains.com/plugin/1347-scala/versions

我自己的IDEA对应的sacla版本下载地址：https://plugins.jetbrains.com/plugin/1347-scala/update/74711

<img src="scala.assets/image-20200410182625801.png" alt="image-20200410182625801" style="zoom:50%;" />

###### 本地安装插件

点击File ，再点击Settings

![1568099639135](scala.assets/1568099639135.png)

![image-20200410183223314](scala.assets/image-20200410183223314.png)

![1568099955417](scala.assets/1568099955417.png)

添加scala插件后，重启IDEA

###### 验证插件是否安装成功

create project,有下列选择时，表示成功安装。

![image-20200410183825825](scala.assets/image-20200410183825825.png)

###### 创建IDEA scala project

![image-20200410184231258](scala.assets/image-20200410184231258.png)



## scala的REPL交互式解释器

* Scala提供的最重要的一个工具是交互模式（REPL）。==REPL是一个交互式解释器==，可以即时编译、运行代码并返回结果，方便前期做学习和测试

* REPL

  * R(read)、E(evaluate) 、P（print）、L（loop），即读取、求值、打印、循环。

* 要启动scala解释器，只需要以下几步：

  - 按住`windows键 + r`
  - 输入`scala`即可

  ![1568101144953](scala.assets/1568101144953.png)

* 退出scala解释器

  * 使用 ==:quit== 就可以了



## scala中声明变量

##### 声明变量语法：

~~~scala
val/var 变量名称:变量类型 = 初始值
~~~

val定义的是**不可重新赋值**的变量(值不可修改)

var定义的是**可重新赋值**的变量(值可以修改)

ps：

* scala中声明变量是变量名称在前，变量类型在后，跟java是正好相反
* scala的语句最后不需要添加分号

示例：

~~~scala
//使用val声明变量,相当于java中的final修饰,不能在指向其他的数据了
 val  a:Int = 10

//使用var声明变量,后期可以被修改重新赋值
 var  b:Int = 20	 
 b=100

//scala中的变量的类型可以显式的声明,也可以不声明,如果不显式的声明这会根据变量的值来推断出来变量的类型(scala支持类型推断)
 val c = 20
~~~

![1568103524126](scala.assets/1568103524126.png)

##### 惰性变量

Scala中使用==关键字lazy==来定义惰性变量，实现延迟加载(懒加载)。 

惰性变量只能是不可变变量，并且只有在调用惰性变量时，才会去实例化这个变量。

语法格式:

~~~scala
lazy val 变量名 = 表达式
~~~

![1568104205830](scala.assets/1568104205830.png)

​         

## scala中数据类型

scala中的类型绝大多数和Java一样，scala的基本数据类型如下，本质上都是一个类。

| 基础类型 | 类型说明                 |
| -------- | ------------------------ |
| Byte     | 8位带符号整数            |
| Short    | 16位带符号整数           |
| **Int**  | 32位带符号整数           |
| Long     | 64位带符号整数           |
| Char     | 16位无符号Unicode字符    |
| String   | Char类型的序列（字符串） |
| Float    | 32位单精度浮点数         |
| Double   | 64位双精度浮点数         |
| Boolean  | true或false              |

**scala类型与Java的区别：**

1. scala中所有的类型都使用大写字母开头
2. 整形使用Int而不是Integer
3. scala中定义变量可以不写类型，让scala编译器自动推断

**scala类型的层次结构：**

![1556592270468](scala.assets/1556592270468.png)



| 类型    | 说明                                                         |
| ------- | ------------------------------------------------------------ |
| Any     | **所有类型**的父类，,它有两个子类AnyRef与AnyVal              |
| AnyVal  | **所有数值类型**的父类                                       |
| AnyRef  | 所有对象类型（引用类型）的父类                               |
| Unit    | 表示空，Unit是AnyVal的子类，它只有一个实例值，即（），它类似于Java中的void，但scala要比Java更加面向对象 |
| Null    | Null是AnyRef的子类，也就是说它是所有引用类型的子类。它的实例是null,   可以将null赋值给任何对象类型 |
| Nothing | 所有类型的**子类**不能直接创建该类型实例，某个方法抛出异常时，返回的就是Nothing类型，因为Nothing是所有类的子类，那么它可以赋值为任何类型 |



## scala中的条件表达式

scala中的表达式都是有值的，条件表达式就是if表达式，if表达式可以根据给定的条件是否满足，根据条件的结果（真或假）决定执行对应的操作。scala条件表达式的语法和Java一样。

~~~scala
//定义变量x
scala> val x =1
x: Int = 1

//if表达式
scala> val y =if(x>0) 1 else -1
y: Int = 1

//支持混合类型表达式
scala> val z=if(x>1) 1 else "error"
z: Any = error  // z的类型由混合类型的共同父类决定

//缺失else 相当于 if(x>2) 1 else ()
scala> val m=if(x>2) 1
m: AnyVal = ()

//scala中有个Unit类，用作不返回任何结果的方法的结果类型,相当于Java中的void，Unit只有一个实例值，写成()
scala> val n=if(x>2) 1 else ()
n: AnyVal = ()

//if(xx) else if(xx) val 
scala> val k=if(x<0) -1 else if (x==0) 0 else 1
k: Int = 1
~~~



## scala中的块表达式

定义变量时用 {} 包含一系列表达式，其中块的最后一个表达式的值就是块的值。

~~~scala
val x=0 
val result={
  val y=x+10
  val z=y+"-hello"  
  val m=z+"-kaikeba"
    "over"    //相当于return "over"
}

result: String = over
//result的值就是块表达式的结果    
//后期一个方法的返回值不需要加上return,把要返回的结果放在方法的最后一行就可以了 
~~~

复制多行代码到scala REPL解释器中的方法是：

写好多行代码，复制代码，然后在scala解释器中先输入 ==:paste==，回车,右键即可粘贴,之后按==ctrl+d==执行。

![1568108241418](scala.assets/1568108241418.png)



## scala循环

在scala中，可以使用for和while，但一般推荐使用for表达式，因为for表达式语法更简洁

#### for循环

语法结构：

~~~scala
for (i <- 表达式/数组/集合){
    //表达式
}
~~~

示例：

~~~scala
//简单的for循环
scala> val nums= 1 to 10
nums: scala.collection.immutable.Range.Inclusive = Range(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

scala> for(i <- nums) println(i)
1
2
3
4
5
6
7
8
9
10

~~~

双重for循环

~~~scala
//双重for循环
scala>  for(i <- 1 to 3; j <- 1 to 3) println(i*10+j)
11
12
13
21
22
23
31
32
33

//双重for循环打印99乘法表
for(i <- 1 to 9; j <- 1 to i){
    print(i+"*"+j+"="+i*j+"\t")
     if(i==j){
       println()
    }    
} 

1*1=1
2*1=2   2*2=4
3*1=3   3*2=6   3*3=9
4*1=4   4*2=8   4*3=12  4*4=16
5*1=5   5*2=10  5*3=15  5*4=20  5*5=25
6*1=6   6*2=12  6*3=18  6*4=24  6*5=30  6*6=36
7*1=7   7*2=14  7*3=21  7*4=28  7*5=35  7*6=42  7*7=49
8*1=8   8*2=16  8*3=24  8*4=32  8*5=40  8*6=48  8*7=56  8*8=64
9*1=9   9*2=18  9*3=27  9*4=36  9*5=45  9*6=54  9*7=63  9*8=72  9*9=81
~~~

守卫: 在for表达式中可以添加if判断语句，这个if判断就称为守卫

~~~scala
//语法结构
for(i <- 达式/数组/集合 if 表达式) {
    // 表达式
}

scala> for(i <- 1 to 10 if i >5) println(i)
6
7
8
9
10

~~~

for推导式: 在for循环体中，可以使用yield表达式构建出一个集合，我们把使用yield的for表达式称之为推导式

~~~scala
// for推导式：for表达式中以yield开始，该for表达式会构建出一个集合

val v = for(i <- 1 to 5) yield i * 10
v: scala.collection.immutable.IndexedSeq[Int] = Vector(10, 20, 30, 40, 50)
~~~


#### while循环

scala中while循环和Java中是一致的

语法结构

~~~scala
while(返回值为布尔类型的表达式){
    //表达式
}
~~~

示例：

~~~scala
scala> var x = 10
x: Int = 10

scala> while(x >5){
     | println(x)
     | x -= 1
     | }
10
9
8
7
6
~~~



## scala方法和函数

#### 方法

###### 语法：

~~~scala
def methodName (参数名:参数类型, 参数名:参数类型) : [return type] = {
    // 方法体：一系列的代码
}
~~~

###### 说明：

1. 参数列表的参数类型不能省略
2. 返回值类型可以省略，由scala编译器自动推断
3. 返回值可以不写return，默认就是{}块表达式的值

###### 示例：

~~~scala
scala> def add(a:Int,b:Int) = a+b
add: (a: Int, b: Int)Int

scala> add(1,2)
res8: Int = 3
~~~

###### 注意:

如果定义递归方法，不能省略返回值类型

示例：定义递归方法（求阶乘）

10 * 9 * 8 * 7 * 6 * ... * 1

~~~scala
scala> def m1(x:Int)={
     | if(x==1) 1
     | else x * m1(x-1)
     | }
<console>:14: error: recursive method m1 needs result type
       else x * m1(x-1)
                ^

scala> def m1(x:Int):Int={
     | if(x==1) 1
     | else x * m1(x-1)
     | }
m1: (x: Int)Int

scala> m1(10)
res9: Int = 3628800
~~~

###### 方法的参数

**默认参数:** 在定义方法时可以给参数定义一个默认值。

~~~scala
//1. 定义一个计算两个值相加的方法，这两个值默认为0
//2. 调用该方法

scala> def add(x:Int = 0, y:Int = 0) = x + y
add: (x: Int, y: Int)Int

scala> add(10)
res14: Int = 10

scala> add(10,20)
res15: Int = 30

scala> add()
res16: Int = 0
~~~

**带名参数:**在调用方法时，可以指定参数的名称来进行调用。

~~~scala
scala> def add(x:Int = 0, y:Int = 0) = x + y
add: (x: Int, y: Int)Int

scala> add(x=1)
res16: Int = 1
~~~

**变长参数:** 如果方法的参数是不固定的，可以定义一个方法的参数是变长参数。

语法格式：

~~~scala
def 方法名(参数名:参数类型*):返回值类型 = {
    方法体
}

//在参数类型后面加一个*号，表示参数可以是0个或者多个
~~~

示例

~~~scala
scala> def sum1(x:Int*)={x.sum}
sum1: (x: Int*)Int

scala> sum1(1,3,5,7)
res17: Int = 16



//==========参数化================
scala> sum1(1 to 4)
<console>:14: error: type mismatch;
 found   : scala.collection.immutable.Range.Inclusive
 required: Int
       sum1(1 to 4)
              ^

scala> sum1(1 to 4:_*)
res19: Int = 10
//将1 to 4变成参数
~~~


#### 函数

scala支持函数式编程，将来编写Spark/Flink程序中，会大量使用到函数

语法：

~~~scala
val 函数变量名 = (参数名:参数类型, 参数名:参数类型....) => 函数体
~~~

注意

- 函数是一个对象（变量）
- 类似于方法，函数也有输入参数和返回值
- 函数定义不需要使用def定义
- 无需指定返回值类型
- 函数体可以有花括号{}

演示

~~~scala
scala> val a = (x:Int, y:Int) => x + y
a: (Int, Int) => Int = <function2>

scala> a(1,2)
res3: Int = 3
~~~

一个函数没有赋予一个变量，则称为匿名函数，后期再实际开发代码的时候，基本上都是使用匿名函数,如：

```
(x:Int,y:Int)=>x+y
```

#### 方法和函数的区别

1. 方法是隶属于类或者对象的，在运行时，它是加载到JVM的方法区中
2. 可以将函数对象赋值给一个变量，在运行时，它是加载到JVM的堆内存中
3. 函数是一个对象，继承自FunctionN，函数对象有apply，curried，toString，tupled这些方法，而方法则没有

#### 方法转换为函数

* 有时候需要将方法转换为函数，作为变量传递，就需要将方法转换为函数

* 使用`_`即可将方法转换为函数

* 示例

  ~~~scala
  scala> def add(x:Int,y:Int)=x+y
  add: (x: Int, y: Int)Int
  
  scala> val a = add _  //add与_之间是有一个空格的！！！
  a: (Int, Int) => Int = <function2>
  ~~~


## 数组（定长/变长，元素可修改)

scala中数组的概念是和Java类似，可以用数组来存放一组数据

scala中，有两种数组，一种是**定长数组**，另一种是**变长数组**

#### 定长数组

定长数组指的是数组的**长度**是**不允许改变**的，但是数组的**元素**是**可以改变**的

语法

~~~scala
// 通过指定长度定义数组
val/var 变量名 = new Array[元素类型](数组长度)

// 用元素直接初始化数组
val/var 变量名 = Array(元素1, 元素2, 元素3...)
~~~

演示

~~~scala
scala> val a=new Array[Int](10)
a: Array[Int] = Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0)

scala> a(0)
res19: Int = 0

scala> a(0)=10

scala> a
res21: Array[Int] = Array(10, 0, 0, 0, 0, 0, 0, 0, 0, 0)

//////////////////////////////////////////////////////////////////
scala> val b =Array("hadoop","spark","hive")
b: Array[String] = Array(hadoop, spark, hive)

scala> b(0)
res24: String = hadoop

scala> b.length  //通过.length查看数组长度
res25: Int = 3
~~~

#### 变长数组

变长数组指的是数组的长度是可变的，可以往数组中添加、删除元素

创建变长数组，需要提前导入ArrayBuffer类

~~~scala
import scala.collection.mutable.ArrayBuffer
~~~

语法: 

创建空的ArrayBuffer变长数组

~~~scala
val/var a = ArrayBuffer[元素类型]()
~~~

创建带有初始元素的ArrayBuffer

~~~scala
val/var a = ArrayBuffer(元素1，元素2，元素3....)
~~~

示例：

~~~scala
//导入ArrayBuffer类型
scala> import scala.collection.mutable.ArrayBuffer
import scala.collection.mutable.ArrayBuffer

//定义一个长度为0的整型变长数组
scala> val a=ArrayBuffer[Int]()
a: scala.collection.mutable.ArrayBuffer[Int] = ArrayBuffer()

//定义一个有初始元素的变长数组
scala> val b = ArrayBuffer("hadoop", "storm", "spark")
b: scala.collection.mutable.ArrayBuffer[String] = ArrayBuffer(hadoop, storm, spark)
~~~

变长数组的增删改操作

- 使用`+=`添加元素
- 使用`-=`删除元素
- 使用`++=`追加一个数组到变长数组

示例：

~~~scala
// 定义变长数组
scala> val a = ArrayBuffer("hadoop", "spark", "flink")
a: scala.collection.mutable.ArrayBuffer[String] = ArrayBuffer(hadoop, spark, flink)

// 追加一个元素
scala> a += "flume"
res10: a.type = ArrayBuffer(hadoop, spark, flink, flume)

// 删除一个元素
scala> a -= "hadoop"
res11: a.type = ArrayBuffer(spark, flink, flume)

// 追加一个数组
scala> a ++= Array("hive", "sqoop")
res12: a.type = ArrayBuffer(spark, flink, flume, hive, sqoop)
~~~



#### 遍历数组

可以使用以下两种方式来遍历数组：

* 使用==for表达式== 直接遍历数组中的元素
* 使用 ==索引== 遍历数组中的元素

示例

~~~scala
scala> for(i <- a)println(i)
hadoop
hive
flume
spark

scala> for(i <- 0 to a.length -1 )println(a(i))
hadoop
hive
flume
spark

scala> for(i <- 0 until a.length) println(a(i))
hadoop
hive
flume
spark


//0 until n —— 生成一系列的数字，包含0，不包含n
//0 to n    —— 包含0，也包含n

~~~



#### 数组常用操作

* scala中的数组封装了丰富的计算操作，将来在对数据处理的时候，不需要我们自己再重新实现。
  * 求和——sum方法
  * 求最大值——max方法 
  * 求最小值——min方法 
  * 排序——sorted方法
* 示例

~~~scala
scala> val array=Array(1,3,4,2,5)
array: Array[Int] = Array(1, 3, 4, 2, 5)

//求和
scala> array.sum
res10: Int = 15

//求最大值
scala> array.max
res11: Int = 5

//求最小值
scala> array.min
res12: Int = 1

//升序
scala> array.sorted  //.sorted会生成一个新的排序后的数组，对原数组没有影响
res13: Array[Int] = Array(1, 2, 3, 4, 5)

//降序    reverse 反转  //.reverse会生成一个新的反转后的数组，对原数组没有影响
scala> array.sorted.reverse
res14: Array[Int] = Array(5, 4, 3, 2, 1)

~~~



## 元组（不同类型，元素不可变）

元组可以用来包含一组不同类型的值。例如：姓名，年龄，性别，出生年月。元组的元素是不可变 的。

#### 定义元组

使用括号来定义元组:

~~~scala
val/var 元组变量名称 = (元素1, 元素2, 元素3....)
~~~

使用箭头来定义元素（元组只有两个元素）:

~~~scala
val/var 元组 = 元素1->元素2
~~~

##### 示例

~~~scala
// 可以直接使用括号来定义一个元组 
scala> val a = (1, "张三", 20, "北京市") 
a: (Int, String, Int, String) = (1,张三,20,北京市)

//使用箭头来定义元素
scala> val b = 1->2 
b: (Int, Int) = (1,2)
~~~

#### 访问元组

访问方法：通过索引来访问元组中的元素，索引从1开始，_1表示访问第一个元素，依次类推

```
 _1、_2、_3....
```

示例

~~~scala
scala> val a = (1, "张三", 20, "北京市")
a: (Int, String, Int, String) = (1,张三,20,北京市)

//获取元组中的第一个元素
scala> a._1
res18: Int = 1

//获取元组中的第二个元素
scala> a._2
res19: String = 张三

//获取元组中的第三个元素
scala> a._3
res20: Int = 20

//获取元组中的第四个元素
scala> a._4
res21: String = 北京市

//不能修改元组中的值
scala> a._4="上海"
<console>:12: error: reassignment to val
       a._4="上海"
           ^
~~~



## 映射Map

Map可以称之为映射。它是由键值对组成的集合。scala当中的Map集合与java当中的Map类似，也是key，value对形式的。

在scala中，Map也分为不可变Map和可变 Map。

#### 不可变Map

定义语法:

~~~scala
val/var map = Map(键->值, 键->值, 键->值...)    // 推荐，可读性更好 
val/var map = Map((键, 值), (键, 值), (键, 值), (键, 值)...)

//键必须使用""包起来
~~~

演示

~~~scala
scala> val map1 = Map("zhangsan"->30, "lisi"->40) 
map: scala.collection.immutable.Map[String,Int] = Map(zhangsan -> 30, lisi -> 40)

scala> val map2 = Map(("zhangsan", 30), ("lisi", 30)) 
map: scala.collection.immutable.Map[String,Int] = Map(zhangsan -> 30, lisi -> 30)

// 根据key获取value 
scala> map1("zhangsan") 
res10: Int = 30
~~~



#### 可变Map

可变Map需要手动导入==import scala.collection.mutable.Map==, 定义语法与不可变Map一致。

演示

~~~scala
//导包
scala> import scala.collection.mutable.Map
import scala.collection.mutable.Map

//定义可变的map
scala> val map3 = Map("zhangsan"->30, "lisi"->40)
map3: scala.collection.mutable.Map[String,Int] = Map(lisi -> 40, zhangsan -> 30)

//获取zhangsan这个key对应的value
scala> map3("zhangsan")
res26: Int = 30

//给zhangsan这个key重新赋值value
scala> map3("zhangsan")=50

//显示map3
scala> map3
res28: scala.collection.mutable.Map[String,Int] = Map(lisi -> 40, zhangsan -> 50)

~~~



#### Map基本操作

按照key获取value

~~~scala
// 获取zhagnsan的年龄 
scala> map("zhangsan")
res10: Int = 30

// 获取wangwu的年龄，如果wangwu不存在，则返回-1 比较友好，避免遇到不存在的key而报错
scala> map.getOrElse("wangwu", -1) 
res11: Int = -1
~~~

修改可变Map的key对应的value

~~~scala
scala> map("lisi")=50
~~~

添加key-value键值对

~~~scala
scala> map+=("wangwu" ->35)
res12: map.type = Map(lisi -> 50, zhangsan -> 30, wangwu -> 35)
~~~

删除key-value键值对

~~~scala
scala> map -="wangwu"
res13: map.type = Map(lisi -> 50, zhangsan -> 30)
~~~

获取所有的key和所有的value

~~~scala
//获取所有的key
scala> map.keys
res36: Iterable[String] = Set(lisi, zhangsan)

//获取所有的key
scala> map.keySet
res37: scala.collection.Set[String] = Set(lisi, zhangsan)

//获取所有的value
scala> map.values
res38: Iterable[Int] = HashMap(50, 30)
~~~

遍历map

~~~scala
//第一种遍历
scala> for(k <- map.keys) println(k+" -> " +map(k))
lisi -> 50
zhangsan -> 30


//第二种遍历
scala> for((k,v) <- map) println(k+" -> "+v)
lisi -> 50
zhangsan -> 30
~~~



## Set集合（无重复，定长/变长）

Set是代表没有重复元素的集合。Set具备以下性质：

* 元素不重复 
* 不保证插入顺序
* 元素可以是不同类型

scala中的set集合也分为两种，一种是不可变集合，另一种是可变集合。

#### 不可变Set集合

语法

~~~scala
//创建一个空的不可变集
val/var 变量名 = Set[类型]()

//给定元素来创建一个不可变集
val/var 变量名 = Set[类型](元素1, 元素2, 元素3...)

~~~

演示

~~~scala
// 创建set集合 
scala> val a = Set(1,1,2,3,4,5) 
a: scala.collection.immutable.Set[Int] = Set(5, 1, 2, 3, 4)

// 获取集合的大小 
scala> a.size 
res0: Int = 5

// 遍历集合
scala> for(i <- a) println(i)

//添加元素生成新的集合,原集合不受影响
scala> a + 6
res1: scala.collection.immutable.Set[Int] = Set(5, 1, 6, 2, 3, 4)

// 删除一个元素,原集合不受影响 
scala> a - 1 
res2: scala.collection.immutable.Set[Int] = Set(5, 2, 3, 4)

// 删除set集合中存在的元素 ,原集合不受影响
scala> a -- Set(2,3) 
res3: scala.collection.immutable.Set[Int] = Set(5, 1, 4)

// 拼接两个集合 ,原集合不受影响
scala> a ++ Set(6,7,8) 
res4: scala.collection.immutable.Set[Int] = Set(5, 1, 6, 2, 7, 3, 8, 4)

//求2个Set集合的交集,原集合不受影响
scala> a & Set(3,4,5,6)
res5: scala.collection.immutable.Set[Int] = Set(5, 3, 4)

//注意：这里对不可变的set集合进行添加删除等操作，对于该集合来说是没有发生任何变化，这里是生成了新的集合，新的集合相比于原来的集合来说发生了变化。
~~~



#### 可变Set集合

要使用可变集，必须要手动导入： ==import scala.collection.mutable.Set==

演示

~~~scala
//导包
scala> import scala.collection.mutable.Set
import scala.collection.mutable.Set

//定义可变的set集合
scala> val set=Set(1,2,3,4,5)
set: scala.collection.mutable.Set[Int] = Set(1, 5, 2, 3, 4)

//添加单个元素
scala> set +=6
res10: set.type = Set(1, 5, 2, 6, 3, 4)

//添加多个元素
scala> set +=(6,7,8,9)
res11: set.type = Set(9, 1, 5, 2, 6, 3, 7, 4, 8)

//添加一个set集合中的元素
scala> set ++=Set(10,11)
res12: set.type = Set(9, 1, 5, 2, 6, 3, 10, 7, 4, 11, 8)

//删除一个元素
scala> set -=11
res13: set.type = Set(9, 1, 5, 2, 6, 3, 10, 7, 4, 8)

//删除多个元素
scala> set -=(9,10)
res15: set.type = Set(1, 5, 2, 6, 3, 7, 4, 8)

//删除一个set子集
scala> set --=Set(7,8)
res19: set.type = Set(1,5, 2, 6, 3, 4)

scala> set.remove(1)
res17: Boolean = true

scala> set
res18: scala.collection.mutable.Set[Int] = Set(5, 2, 6, 3, 4)
~~~



## 列表 List（可重复）

List是scala中最重要的、也是最常用的数据结构。List具备以下性质：

* 可以保存重复的值 
* 有先后顺序

在scala中，也有两种列表，一种是不可变列表、另一种是可变列表

#### 不可变列表

不可变列表就是列表的**元素、长度都是不可变的**

语法格式: 

~~~scala
val/var 变量名 = List(元素1, 元素2, 元素3...)

//使用 Nil 创建一个不可变的空列表
val/var 变量名 = Nil

//使用 :: 方法创建一个不可变列表
val/var 变量名 = 元素1 :: 元素2 :: Nil
~~~

演示

~~~scala
//创建一个不可变列表，存放以下几个元素（1,2,3,4）
scala> val  list1=List(1,2,3,4)
list1: List[Int] = List(1, 2, 3, 4)

//使用Nil创建一个不可变的空列表
scala> val  list2=Nil
list2: scala.collection.immutable.Nil.type = List()

//使用 :: 方法创建列表，包含1、2、3三个元素
scala> val list3=1::2::3::Nil
list3: List[Int] = List(1, 2, 3)
~~~

#### 可变列表

可变列表就是列表的元素、长度都是可变的。

要使用可变列表，先要导入 ==import scala.collection.mutable.ListBuffer==

创建空的可变列表，语法：

~~~scala
val/var 变量名 = ListBuffer[Int]()
~~~

创建非空的可变列表，语法结构：

~~~scala
val/var 变量名 = ListBuffer(元素1，元素2，元素3...)
~~~

演示

~~~scala
//导包
scala> import scala.collection.mutable.ListBuffer
import scala.collection.mutable.ListBuffer

//定义一个空的可变列表
scala> val a=ListBuffer[Int]()
a: scala.collection.mutable.ListBuffer[Int] = ListBuffer()

//定义一个有初始元素的可变列表
scala> val b=ListBuffer(1,"lisi",3,4)
b: scala.collection.mutable.ListBuffer[Int] = ListBuffer(1, 2, 3, 4)
~~~



#### 列表操作

~~~scala
//导包
scala> import scala.collection.mutable.ListBuffer
import scala.collection.mutable.ListBuffer

//定义一个可变的列表
scala> val list=ListBuffer(1,2,3,4)
list: scala.collection.mutable.ListBuffer[Int] = ListBuffer(1, 2, 3, 4)

//获取第一个元素
scala> list(0)
res4: Int = 1
//获取第一个元素
scala> list.head
res5: Int = 1

//获取除了第一个元素外其他元素组成的列表
scala> list.tail
res6: scala.collection.mutable.ListBuffer[Int] = ListBuffer(2, 3, 4)

//添加单个元素
scala> list +=5
res7: list.type = ListBuffer(1, 2, 3, 4, 5)

//添加一个不可变的列表
scala> list ++=List(6,7)
res8: list.type = ListBuffer(1, 2, 3, 4, 5, 6, 7)

//添加一个可变的列表
scala> list ++=ListBuffer(8,9)
res9: list.type = ListBuffer(1, 2, 3, 4, 5, 6, 7, 8, 9)

//删除单个元素
scala> list -=9
res10: list.type = ListBuffer(1, 2, 3, 4, 5, 6, 7, 8)

//删除一个不可变的列表存在的元素
scala> list --=List(7,8)
res11: list.type = ListBuffer(1, 2, 3, 4, 5, 6)

//删除一个可变的列表存在的元素
scala> list --=ListBuffer(5,6)
res12: list.type = ListBuffer(1, 2, 3, 4)

//可变的列表转为不可变列表,生成了新列表，对原数组无影响
scala> list.toList
res13: List[Int] = List(1, 2, 3, 4)

//可变的列表转为不可变数组,生成了新列表，对原数组无影响
scala> list.toArray
res14: Array[Int] = Array(1, 2, 3, 4)
~~~



## 函数式编程

我们将来使用Spark/Flink的大量业务代码都会使用到函数式编程。

下面的这些操作是学习的重点，先来感受下如何进行函数式编程以及它的强大

#### 遍历 - foreach

foreach是List集合带有的方法。通俗解释：将集合的元素传入函数体，对元素执行函数体设定的操作，如打印每个元素等。

方法描述：

~~~scala
foreach(f: (A) ⇒ Unit): Unit
~~~

方法说明: foreach方法有一个参数f,参数类型是一个匿名函数(A) ⇒ Unit，方法的返回值是Unit。

| foreach | API           | 说明                                                         |
| ------- | ------------- | ------------------------------------------------------------ |
| 参数    | f: (A) ⇒ Unit | 接收一个匿名函数对象<br />函数的输入参数为集合的元素<br />返回值为空 |
| 返回值  | Unit          | 空                                                           |

方法实操

~~~scala
scala> val list=List(1,2,3,4)
list: List[Int] = List(1, 2, 3, 4)

//定义一个匿名函数传入到foreach方法中
scala> list.foreach((x:Int)=>println(x))
1
2
3
4

//匿名函数的输入参数类型可以省略，由编译器自动推断
scala> list.foreach(x=>println(x))
1
2
3
4

//当函数参数，只在函数体中出现一次，而且函数体没有嵌套调用时，可以使用下划线来简化函数定 义
scala> list.foreach(println(_))
1
2
3
4

//最简写，直接给定println
scala> list.foreach(println)
1
2
3
4

//很神奇的语法，别害怕，盘它就可以了，后期通过scala语言开发spark、Flink程序非常简洁方便
~~~



#### 映射 - map

合的映射操作是将来在编写Spark/Flink用得最多的操作，是我们必须要掌握的掌握。通俗解释：将集合的元素传入函数体，对元素执行函数体设定的操作生成新的元素，新的元素形成新的集合。生成了新的集合，但是原集合是不受影响的。

方法描述

~~~scala
def map[B](f: (A) ⇒ B): TraversableOnce[B]
~~~

方法说明

| map方法 | API                | 说明                                                         |
| ------- | ------------------ | ------------------------------------------------------------ |
| 泛型    | [B]                | 指定map方法最终返回的集合泛型                                |
| 参数    | f: (A) ⇒ B         | 传入一个函数对象<br />该函数接收一个类型A（要转换的列表元素）<br />返回值为类型B |
| 返回值  | TraversableOnce[B] | B类型的集合                                                  |

方法实操 

~~~scala
//定义一个list集合，实现把内部每一个元素做乘以10，生成一个新的list集合
scala> val list=List(1,2,3,4)
list: List[Int] = List(1, 2, 3, 4)

//定义一个匿名函数
scala> list.map((x:Int)=>x*10)
res21: List[Int] = List(10, 20, 30, 40)

//省略匿名函数参数类型
scala> list.map(x=>x*10)
res22: List[Int] = List(10, 20, 30, 40)

//最简写   用下划线
scala> list.map(_*10)
res23: List[Int] = List(10, 20, 30, 40)
~~~



#### 扁平化映射 - flatmap

映射扁平化也是将来用得非常多的操作，也是必须要掌握的。通俗解释：将集合的元素传入函数体，每传入一个元素就生成一个集合，多个集合最终汇聚成一个集合。原集合会受到影响。

方法描述

~~~scala
def flatMap[B](f: (A) ⇒ GenTraversableOnce[B]): TraversableOnce[B]
~~~

方法说明

| flatmap方法 | API                            | 说明                                                         |
| ----------- | ------------------------------ | ------------------------------------------------------------ |
| 泛型        | [B]                            | 最终要转换的集合元素类型                                     |
| 参数        | f: (A) ⇒ GenTraversableOnce[B] | 传入一个函数对象<br />函数的参数是集合的元素<br />函数的返回值是一个集合 |
| 返回值      | TraversableOnce[B]             | B类型的集合                                                  |

* 方法实操

~~~scala
//定义一个List集合,每一个元素中就是一行数据，有很多个单词
scala>  val list = List("hadoop hive spark flink", "hbase spark")
list: List[String] = List(hadoop hive spark flink, hbase spark)

//使用flatMap进行偏平化处理，获取得到所有的单词
//注意：flatMap的M是大写
scala> list.flatMap(x => x.split(" "))
res24: List[String] = List(hadoop, hive, spark, flink, hbase, spark)

//简写
scala> list.flatMap(_.split(" "))
res25: List[String] = List(hadoop, hive, spark, flink, hbase, spark)

// flatMap该方法其本质是先进行了map 然后又调用了flatten
scala> list.map(_.split(" ")).flatten
res26: List[String] = List(hadoop, hive, spark, flink, hbase, spark)
~~~

flatmap的效果与下面一样,可理解成flatmap将两个步骤合在一起了：

```scala
scala> list1.map((x:String)=>x.split(" "))
res10: List[Array[String]] = List(Array(hadoop, hive, spark, flink), Array(hbase, spark))

scala> list1.map((x:String)=>x.split(" ")).flatten
res11: List[String] = List(hadoop, hive, spark, flink, hbase, spark)
```

#### 过滤 - filter

通俗解释：将集合的元素传入函数体，经过设定的判断后，若为true，则保留该元素，否则过滤掉。注意：过滤掉后是生成了新的集合，原集合不受影响。

方法描述

```scala
def filter(p: (A) ⇒ Boolean): TraversableOnce[A]
```

方法说明

| filter方法 | API                | 说明                                                         |
| ---------- | ------------------ | ------------------------------------------------------------ |
| 参数       | p: (A) ⇒ Boolean   | 传入一个函数对象<br />接收一个集合类型的参数<br />返回布尔类型，满足条件返回true, 不满足返回false |
| 返回值     | TraversableOnce[A] | 列表                                                         |

方法实操

~~~scala
//定义一个list集合
scala> val list=List(1,2,3,4,5,6,7,8,9,10)
list: List[Int] = List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

//过滤出集合中大于5的元素
scala> list.filter(x => x >5)
res27: List[Int] = List(6, 7, 8, 9, 10)

//把集合中大于5的元素取出来乘以10生成一个新的list集合
scala> list.filter(_ > 5).map(_ * 10)
res29: List[Int] = List(60, 70, 80, 90, 100)

//通过这个案例，应该是可以感受到scala比java的强大了...
~~~



#### 排序 - sort

在scala集合中，可以使用以下几种方式来进行排序。（原集合不受影响）

1. sorted默认排序 
2. sortBy指定字段排序 
3. sortWith自定义排序

###### sorted默认排序

~~~~scala
//定义一个List集合
scala> val list=List(5,1,2,4,3)
list: List[Int] = List(5, 1, 2, 4, 3)

//默认就是升序
scala> list.sorted
res30: List[Int] = List(1, 2, 3, 4, 5)
~~~~

###### sortBy指定字段排序

通俗解释：将集合元素传入函数体，经过处理后生成新的元素，根据新的元素对原集合进行排序。原集合不受影响。

方法描述

~~~scala
def sortBy[B](f: (A) ⇒ B): List[A]
~~~

方法说明

| sortBy方法 | API        | 说明                                                         |
| ---------- | ---------- | ------------------------------------------------------------ |
| 泛型       | [B]        | 按照什么类型来进行排序                                       |
| 参数       | f: (A) ⇒ B | 传入函数对象<br />接收一个集合类型的元素参数<br />返回B类型的元素进行排序 |
| 返回值     | List[A]    | 返回排序后的列表                                             |

方法实操

~~~scala
//定义一个List集合
scala> val list=List("1 hadoop","2 spark","3 flink")
list: List[String] = List(1 hadoop, 2 spark, 3 flink)

//按照单词的首字母进行排序
scala> list1.sortBy((x:String)=>x.split(" ")(1))
res27: List[String] = List(3 flink, 1 hadoop, 2 spark)

//可简写成下面：
scala> list.sortBy(x=>x.split(" ")(1))
res33: List[String] = List(3 flink, 1 hadoop, 2 spark)
~~~

###### sortWith自定义排序

通俗解释：将集合的两个元素传入函数体，进行比较，如果小于就返回true，两个元素调换位置，否则不变，多次比较后不同的两个元素后就得到了排序后的集合。原集合不受影响。

方法描述

~~~scala
def sortWith(lt: (A, A) ⇒ Boolean): List[A]
~~~

方法说明

| sortWith方法 | API                  | 说明                                                         |
| ------------ | -------------------- | ------------------------------------------------------------ |
| 参数         | lt: (A, A) ⇒ Boolean | 传入一个比较大小的函数对象<br />接收两个集合类型的元素参数<br />返回两个元素大小，小于返回true，大于返回false |
| 返回值       | List[A]              | 返回排序后的列表                                             |

方法实操

~~~scala
scala> val list = List(2,3,1,6,4,5)
a: List[Int] = List(2, 3, 1, 6, 4, 5)

//降序
scala> list.sortWith((x,y)=>x>y)
res35: List[Int] = List(6, 5, 4, 3, 2, 1)

//升序
scala> list.sortWith((x,y)=>x<y)
res36: List[Int] = List(1, 2, 3, 4, 5, 6)
~~~



#### 分组 - groupBy

通俗解释：将集合元素传入函数体，处理后得到新的元素，如果新的元素相同，则将集合原来的元素归为同一组。

* 方法描述

```scala
def groupBy[K](f: (A) ⇒ K): Map[K, List[A]]
```

- 方法说明

| groupBy方法 | API             | 说明                                                         |
| ----------- | --------------- | ------------------------------------------------------------ |
| 泛型        | [K]             | 分组字段的类型                                               |
| 参数        | f: (A) ⇒ K      | 传入一个函数对象<br />接收集合元素类型的参数<br />返回一个K类型的key，这个key会用来进行分组，相同的key放在一组中 |
| 返回值      | Map[K, List[A]] | 返回一个映射，K为分组字段，List为这个分组字段对应的一组数据  |

* 方法实操

~~~scala
scala> val a = List("张三"->"男", "李四"->"女", "王五"->"男")
a: List[(String, String)] = List((张三,男), (李四,女), (王五,男))

// 按照性别分组
scala> a.groupBy((kv:(String,String))=>kv._2)
res31: scala.collection.immutable.Map[String,List[(String, String)]] = Map(男 -> List((张三,男), (王五,男)), 女 -> List((李四,女)))
//可简写成下面:
scala> a.groupBy(_._2)

// 将分组后的映射转换为性别/人数元组列表
scala> res31.map(x => x._1 -> x._2.size)
res32: scala.collection.immutable.Map[String,Int] = Map(男 -> 2, 女 -> 1)
~~~



#### 聚合 - reduce

reduce表示将列表元素，传入一个函数进行聚合计算

方法描述

~~~scala
def reduce[A1 >: A](op: (A1, A1) ⇒ A1): A1
~~~

方法说明

| reduce方法 | API               | 说明                                                         |
| ---------- | ----------------- | ------------------------------------------------------------ |
| 泛型       | [A1 >: A]         | （下界）A1必须是集合元素类型的子类                           |
| 参数       | op: (A1, A1) ⇒ A1 | 传入函数对象，用来不断进行聚合操作<br />第一个A1类型参数为：当前聚合后的变量<br />第二个A1类型参数为：当前要进行聚合的元素 |
| 返回值     | A1                | 列表最终聚合为一个元素                                       |

方法实操

~~~scala
scala> val a = List(1,2,3,4,5,6,7,8,9,10)
a: List[Int] = List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

scala> a.reduce((x,y) => x + y)
res5: Int = 55

// 第一个下划线表示第一个参数，就是历史的聚合数据结果
// 第二个下划线表示第二个参数，就是当前要聚合的数据元素
scala> a.reduce(_ + _)
res53: Int = 55

// 与reduce一样，从左往右计算
scala> a.reduceLeft(_ + _)
res0: Int = 55

// 从右往左聚合计算
scala> a.reduceRight(_ + _)
res1: Int = 55
~~~



#### 折叠 - fold

* fold与reduce很像，但是多了一个指定初始值参数
* 方法描述

```scala
def fold[A1 >: A](z: A1)(op: (A1, A1) ⇒ A1): A1
```

- 方法说明

| reduce方法 | API               | 说明                                                         |
| ---------- | ----------------- | ------------------------------------------------------------ |
| 泛型       | [A1 >: A]         | （下界）A1必须是集合元素类型的子类                           |
| 参数1      | z: A1             | 初始值                                                       |
| 参数2      | op: (A1, A1) ⇒ A1 | 传入函数对象，用来不断进行折叠操作<br />第一个A1类型参数为：当前折叠后的变量<br />第二个A1类型参数为：当前要进行折叠的元素 |
| 返回值     | A1                | 列表最终折叠为一个元素                                       |

* 方法实操

~~~scala
//定义一个List集合
scala> val a = List(1,2,3,4,5,6,7,8,9,10)
a: List[Int] = List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

//求和
scala> a.sum
res41: Int = 55

//给定一个初始值，，折叠求和
scala> a.fold(0)(_+_)
res42: Int = 55

scala> a.fold(10)(_+_)
res43: Int = 65

//从左往右
scala> a.foldLeft(10)(_+_)
res44: Int = 65

//从右往左
scala> a.foldRight(10)(_+_)
res45: Int = 65


//fold和foldLet效果一致，表示从左往右计算
//foldRight表示从右往左计算

~~~



## 高阶函数

使用函数值作为参数，或者返回值为函数值的“函数”和“方法”，均称之为“高阶函数”。

#### 函数值作为参数

~~~scala
//定义一个数组
scala> val array=Array(1,2,3,4,5)
array: Array[Int] = Array(1, 2, 3, 4, 5)

//定义一个函数
scala> val func=(x:Int)=>x*10
func: Int => Int = <function1>

//函数作为参数传递到方法中
scala> array.map(func)
res0: Array[Int] = Array(10, 20, 30, 40, 50)
~~~

#### 匿名函数

~~~scala
//定义一个数组
scala> val array=Array(1,2,3,4,5)
array: Array[Int] = Array(1, 2, 3, 4, 5)

//定义一个没有名称的函数----匿名函数
scala> array.map(x=>x*10)
res1: Array[Int] = Array(10, 20, 30, 40, 50)
~~~

#### 柯里化

方法可以定义多个参数列表，当使用较少的参数列表调用多参数列表的方法时，会产生一个新的函数，该函数接收剩余的参数列表作为其参数。这被称为柯里化。

通俗解释：两个括号

示例：定义一个方法，参数列表是(a:String)，返回类型是一个函数(String,String)=>String。调用该方法时，会产生一个新的函数，新的函数可以接受剩余的参数列表作为参数。

```scala
def getAddress(a:String):(String,String)=>String={
    (b:String,c:String)=>a+"-"+b+"-"+c
}

scala> val f1=getAddress("china")
f1: (String, String) => String = <function2>

scala> f1("beijing","tiananmen")
res5: String = china-beijing-tiananmen
```

下面对该示例进行柯里化：

~~~scala
def getAddress(a:String)(b:String,c:String):String={ 
  		a+"-"+b+"-"+c 
}
//调用方法时，要将两个括号的参数都填上，否则报错
scala> getAddress("china")("beijing","tiananmen")
res0: String = china-beijing-tiananmen
~~~

进行了柯里化的方法，可以只传入第一个括号的参数，然后生成参数为第二个括号的参数的新方法。

```scala
scala> val func=getAddress("china")_
func: (String, String) => String = <function2>

scala> func("beijing","tiananmen")
res50: String = china-beijing-tiananmen
```

之前学习使用的下面这些操作就是使用到了柯里化。

```scala
List(1,2,3,4).fold(0)(_+_)
List(1,2,3,4).foldLeft(0)(_+_)
List(1,2,3,4).foldRight(0)(_+_)
```



#### 闭包

函数里面引用外面类成员变量叫作闭包

~~~scala
scala> var factor=10
scala> val f1=(x:Int) => x*factor
scala> f1(2)
res51: Int = 20


//定义的函数f1，它的返回值是依赖于不在函数作用域的一个变量
//后期必须要要获取到这个变量才能执行
//spark和flink程序的开发中大量的使用到函数，函数的返回值依赖的变量可能都需要进行大量的网络传输获取得到。这里就需要这些变量实现序列化进行网络传输。

def multiply(x:Double)=(y:Double)=>x*y
val doubleFunc=multiply(2)  //调用方法multiply，生成函数并赋给doubleFunc
val tripleFunc=multiply(3)

scala> doubleFunc(10)
res52: Double = 20.0

scala> tripleFunc(10)
res53: Double = 30.0
~~~



## scala面向对象编程之类

#### 类的定义

scala是支持面向对象的，也有类和对象的概念。

示例：

* 定义一个Customer类，并添加成员变量/成员方法
* 添加一个main方法，并创建Customer类的对象，并给对象赋值，打印对象中的成员，调用成员方法

~~~scala
class Customer {
  var name:String = _
  var sex:String = _
  val registerDate:Date = new Date

  def sayHi(msg:String) = {
    println(msg)
  }
}

object Main {
  def main(args: Array[String]): Unit = {
    val customer = new Customer
    //给对象的成员变量赋值
    customer.name = "张三"
    customer.sex = "男"

    println(s"姓名: ${customer.name}, 性别：${customer.sex}, 注册时间: ${customer.registerDate}")
    //对象调用方法  
    customer.sayHi("你好!")
  }
}

/*运行结果为：
姓名：张三, 性别：男, 注册时间: Mon Apr 13 00:00:54 CST 2020
你好！
*/
~~~

说明

1. var name:String = _，  _表示使用默认值进行初始化
   例如：String类型默认值是null，Int类型默认值是0，Boolean类型默认值是false...
2. val变量不能使用_来进行初始化，因为val是不可变的，所以必须手动指定一个默认值
3. main方法必须要放在一个scala的object（单例对象）中才能执行
4. println(s"...${}...")中的s必须要写，有s才可以获取成员变量的值，如：\${customer.name}

#### 类的构造器

主构造器:  主构造器是指在类名的后面跟上一系列参数，例如

~~~scala
class 类名(var/val 参数名:类型 = 默认值, var/val 参数名:类型 = 默认值){
    // 构造代码块
}
~~~

辅助构造器:  在类中使用this来定义，例如

~~~scala
def this(参数名:类型, 参数名:类型) {
    ...
}
~~~

演示

~~~scala
class Student(val name: String, val age: Int) {
  val address: String = "beijing"

  //定义只有一个参数的辅助构造器1
  def this(name: String) {
    this(name, 20)
  }

  //定义只有一个参数的辅助构造器2
  def this(age: Int) {
    this("某某某", age)
  }
}

object Main {
  def main(args: Array[String]): Unit = {
    val stu1 = new Student("Krystal", 21)   //使用主构造器
    val stu2 = new Student("Jimmy")			//使用辅助构造器
    val stu3 = new Student(23)              //使用辅助构造器
    println(s"${stu1.name},${stu1.age}\n${stu2.name},${stu2.age}\n${stu3.name},${stu3.age}")
  }
}
~~~

运行结果为：

```
Krystal,21
Jimmy,20
某某某,23
```



## scala面向对象编程之对象

#### scala中的object

scala中是没有Java中的静态成员的。如果将来我们需要用到static变量、static方法，就要用到scala中的单例对象object。

定义object方法：定义单例对象和定义类很像，就是把class换成object

示例：定义一个工具类，用来格式化日期时间

~~~scala
object DateUtils{

  // 在object中定义的成员变量，相当于Java中定义一个静态变量
  // 定义一个SimpleDateFormat日期时间格式化对象
  val sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm")

  // 相当于Java中定义一个静态方法
  def format(d:Date)=sdf.format(d)
}

object Test{
  def main(args: Array[String]): Unit = {
      //可以直接调用DateUtils的format方法：
    println(DateUtils.format(new Date()))
  }
}
~~~

运行结果为：

```
2020-04-13 00:32
```

说明：

1. 使用object 单例对象名定义一个单例对象，可以用object作为工具类或者存放常量
2. 在单例对象中定义的变量，类似于Java中的static成员变量
3. 在单例对象中定义的方法，类似于Java中的static方法
4. object单例对象的构造代码可以直接写在花括号中
5. 调用单例对象的方法，直接使用单例对象名.方法名，访问单例对象的成员变量也是使用单例对象名.变量名
6. 单例对象只能有一个无参的主构造器，不能添加其他参数

#### scala中的伴生对象

在同一个scala文件，有一个class和object具有同样的名字，那么就称这个object是class的伴生对象，class是object的伴生类；

伴生类和伴生对象的最大特点是，**可以相互访问私有属性**；

示例：

~~~scala
class ClassObject{
  def printConstant()={
      //可以访问伴生对象Dog的私有属性
    println(ClassObject.CONSTANT)
  }
}
object ClassObject{
  //伴生对象中的私有属性:
  private val CONSTANT="krystal"

  def main(args: Array[String]): Unit = {
    val p=new ClassObject
    p.printConstant()
  }
}
~~~

运行结果为：

```
krystal
```

说明

~~~~
(1). 伴生类和伴生对象的名字必须是一样的
(2). 伴生类和伴生对象需要在一个scala源文件中
(3). 伴生类和伴生对象可以互相访问private的属性
~~~~



#### scala中object的apply方法

我们之前使用过下列方式来创建一个Array对象，这种写法非常简便，不需要再写一个new，然后敲一个空格，再写类名。

~~~scala
// 创建一个Array对象
val a = Array(1,2,3,4)
~~~

> **可以这样创建对象的原因是？**
>
> 1. Array类有一个伴生对象Array,伴生对象Array里面定义着apply方法
>
> 2. apply方法的源码大致如下，方法参数时Int*,返回类型是Array
>
>    <img src="scala.assets/1568196769539.png" alt="1568196769539" style="zoom: 67%;" />
>
> 3. 执行val a = Array(1,2,3,4)操作时，首先会找到Array类的伴生对象object Array
>
> 4. 然后找到伴生对象里，有着对应参数的apply方法，进行调用，从而创建了新对象

因此，归为一点就是：**实现伴生对象的apply方法**，伴生对象的apply方法用来快速地创建一个伴生类的对象。

示例：

~~~scala
class Person(name:String,age:Int){
  override def toString: String = s"Person{$name,$age}"
}
object Person{
  //实现apply方法,返回Person伴生类的对象
  def apply(name:String,age:Int): Person = new Person(name,age)
  //apply方法支持重载
  def apply(name: String): Person = new Person(name, 21)
  def apply(age: Int): Person = new Person("krystal", age)
  def apply(): Person = new Person("krystal", 21)
}
object Test{
  def main(args: Array[String]): Unit = {
    val p=Person("krystal")
    println(p.toString)
  }
}
~~~

运行结果为：

```
Person{krystal,21}
```

说明：

1. 当遇到类名(参数1, 参数2...)会自动调用对应的apply方法，在apply方法中来创建对象
2. 定义apply时，如果参数列表是空，也不能省略括号()，否则引用的是伴生对象



#### scala中object的main方法

scala和Java一样，如果要运行一个程序，必须有一个main方法。而在Java中main方法是静态的，而在scala中没有静态方法。**在scala中，这个main方法必须放在一个object中**

示例1：

~~~scala
object Main1{
  def main(args:Array[String]) = {
    println("hello, scala")
  }
}
~~~

也可以继承自App Trait（特质），然后将需要编写在main方法中的代码，写在object的构造方法体内。其本质是调用了Trait这个特质中的main方法。

示例2

~~~scala
object Main2 extends App {
  println("hello, scala")  //不需要再写main方法
}
~~~



## scala面向对象编程之继承

#### 继承extends

scala和Java一样，使用**extends**关键字来实现继承。可以在子类中定义父类中没有的字段和方法，或者重写父类的方法。

示例1：实现简单继承

~~~scala
class Person1{
  var name="super"
  def getName()=this.name
}
class Student1 extends Person1{

}
object Test1{
  def main(args: Array[String]): Unit = {
    var p1=new Person1
    var s1=new Student1
    s1.name="krystal"
    println(s1.getName())
  }
}
~~~

运行结果为：

```
krystal
```

示例2：单例对象实现继承

~~~scala
class Person1{
  var name="super"
  def getName()=this.name
}
object Student1 extends Person1{

}
object Test1{
  def main(args: Array[String]): Unit = {
    Student1.name="krystal"
    println(Student1.getName())
  }
}
~~~

运行结果为：

```
krystal
```



#### 关键字：override/super

1. 如果子类要覆盖父类中的一个非抽象方法，必须要使用override关键字
2. 可以使用override关键字来重写一个val字段
3. 可以使用super关键字来访问父类的成员

示例1：

~~~scala
class Person2{
  val name="super"
  def getName=name
}
class Person3 extends Person2{
  override val name: String = "krystal"   //重写字段
  override def getName: String = "hello "+super.getName  //调用父类的getName方法
}
object Test3{
  def main(args: Array[String]): Unit = {
    val p3:Person3=new Person3()
    println(p3.name)
    println(p3.getName)
  }
}
~~~

运行结果为：

```
krystal
hello krystal
```



#### 关键字：isInstanceOf/asInstanceOf

我们经常要在代码中进行类型的判断和类型的转换。在Java中，我们可以使用instanceof关键字、以及(类型)object来实现。在scala中如何实现呢？

scala中对象提供isInstanceOf 和 asInstanceOf方法。

* isInstanceOf判断对象是否为指定类的对象
* asInstanceOf将对象转换为指定类型


|                        | Java             | Scala               |
| ---------------------- | ---------------- | ------------------- |
| 判断对象是否是C类型    | obj instanceof C | obj.isInstanceof[C] |
| 将对象强转成C类型      | (C ) obj         | obj.asInstanceof[C] |
| 获取类型为T的class对象 | C.class          | classOf[C]          |

示例：

~~~scala
class Person4{}
class Student4 extends Person4{}
object Person5{
  def main(args: Array[String]): Unit = {
    val pn:Person4=new Person4
    val s:Student4=null
    println(pn.isInstanceOf[Person4])  //true
    println(pn.isInstanceOf[Student4]) //false
    println(s.isInstanceOf[Student4])  //false
      
    val a=pn.asInstanceOf[Person4]
  }
}
~~~



#### getClass和classOf

isInstanceOf 只能判断出对象是否为指定类以及其子类的对象，而不能精确的判断出，对象就是指定类的对象。如果要求精确地判断出对象就是指定类的对象，那么就只能使用 getClass 和 classOf 。

* 对象.getClass可以精确获取对象的类型

* classOf[x]可以精确获取类型
* 使用==操作符就可以直接比较

示例:

~~~scala
class Person{}
class Student extends Person{}
object Test{
  def main(args: Array[String]): Unit = {
    val p:Person=new Student  //p是Person类的子类的对象
    println(p.isInstanceOf[Person])  //true
    println(p.isInstanceOf[Student])  //true
    println(p.getClass==classOf[Person])  //false
    println(p.getClass==classOf[Student])  //true
  }
}
~~~



## scala访问修饰符

scala只有两个访问修饰符：private/protected

Java中的访问控制，同样适用于scala，可以在成员前面添加private/protected关键字来控制成员的可见性。但在scala中，没有public关键字，任何没有被标为private或protected的成员都是公共的。

#### private修饰符

private修饰的成员只能在类内部或者伴生对象中使用

```scala
class Person{
  private var name="krystal"
  def getName()={
    name //没报错
  }
}
class Student{
  val p:Person=new Person
  // println(p.name) -->报错
}
class Student2 extends Person{
  val s:Student2=new Student2
  // println(s.name)-->报错
}
object Person{
  def main(args: Array[String]): Unit = {
    val pp:Person=new Person
    println(pp.name)  //没报错
  }
}
```

#### private[this]修饰符

被修饰的成员只能在当前类中被访问。或者可以理解为：只能通过this.来访问（在当前类中访问成员会自动添加this.）

示例:

private[this] var name只能从this对象的方法访问。

~~~scala
class Person{
  private[this] var name="krystal"
  def getName()=this.name
  
  def sayHelloTo(p:Person) = {
    println("hello" + this.name)     // 报错!无法访问
  }
}
object Person{
  def main(args: Array[String]): Unit = {
    val pp:Person=new Person
    //println(pp.name) -->报错
  }
}
~~~

#### protected[this]修饰符

被修饰的成员只能在当前类和当前子类中被访问。也可以理解为：当前类通过**this.**访问或者子类通过**this.**访问

示例:

~~~scala
class Person{
  protected[this] var name="super"
  def getName(): Unit ={
    this.name
  }
  def sayHi(person: Person): Unit ={
    //println(person.name)-->报错
  }
}
//伴生对象
object Person{
  def showName(person: Person): Unit ={
    //println(person.name)-->报错
  }
}
class Student extends Person{
  def showName(): Unit ={
    println(name)
  }
}
~~~

#### 调用父类的constructor

实例化子类对象，必须要调用父类的构造器，在scala中，只能在子类的主构造器中调用父类的构造器

示例:

~~~scala
class Person(name:String){
  println("name: "+this.name)
}
// 直接在父类的类名后面调用父类构造器
class Student(var name:String,var age:Int) extends Person(name);
object Test{
  def main(args: Array[String]): Unit = {
    val stu:Student=new Student("krystal",21)
    println(s"${stu.name}-${stu.age}")
  }
}

//先调用父类的构造器，再调用子类的构造器
~~~

运行结果为：

```
name: krystal
krystal-21
```



#### 抽象类

如果类的某个成员在当前类中的定义是不包含完整的，它就是一个**抽象类**

不完整定义有两种情况：

1. 方法没有方法体
2. 变量没有初始化

没有方法体的方法称为**抽象方法**，没有初始化的变量称为**抽象字段**。定义抽象类和Java一样，在类前面加上**abstract**关键字就可以了

示例：

~~~scala
abstract class Person{
  def sayhello:Unit
  def sayBye:Unit
  val address:String
}
class Student extends Person{
  //重写方法
  override def sayhello: Unit = println("hello krystal")
  //重写方法
  override def sayBye: Unit = println("Bye")
  //重写字段
  override val address: String = "MaoMing"
}
object Test{
  def main(args: Array[String]): Unit = {
    val stu:Student=new Student
    stu.sayhello
    stu.sayBye
    println(stu.address)
  }
}
~~~

运行结果为：

```
hello krystal
Bye
MaoMing
```



#### 匿名内部类

匿名内部类是没有名称的子类，直接用来创建实例对象。Spark的源代码中有大量使用到匿名内部类。

示例：

~~~scala
abstract class Person{
  def sayHello: Unit ={
  }

}
object Test{
  def main(args: Array[String]): Unit = {
      //创建一个匿名内部类对象
    var p:Person=new Person {
      override def sayHello: Unit = println("匿名内部类")
    }
    p.sayHello
  }
}
~~~

运行结果为：

```
匿名内部类
```



## scala面向对象编程之trait特质

特质：

1. 特质是scala中代码复用的基础单元
2. 它可以将方法和字段定义封装起来，然后添加到类中
3. 与类继承不一样的是，类继承要求每个类都只能继承一个超类，而一个类可以添加任意数量的特质。
4. 特质的定义和抽象类的定义很像，但它是使用trait关键字

#### 作为接口使用

使用`extends`来继承trait（scala不论是类还是特质，都是使用extends关键字）

如果要继承多个trait，则使用with关键字

示例一：继承单个trait

~~~scala
trait Logger1{
  //抽象方法
  def log(msg:String)
}
class ConsoleLogger1 extends Logger1{
  override def log(msg: String): Unit = println(msg)
}
object Test{
  def main(args: Array[String]): Unit = {
    val cons=new ConsoleLogger1
    cons.log("warn:file not found")
  }
}
~~~

运行结果为：

```
warn:file not found
```

示例二：继承多个trait

~~~scala
trait Logger1{
  def log(msg:String)
}
trait Send{
  def send(msg:String)
}
class ConsoleLogger1 extends Logger1 with Send {
  override def log(msg: String): Unit = println(msg)
  override def send(msg: String): Unit = println(msg)
}
object Test{
  def main(args: Array[String]): Unit = {
    val cons=new ConsoleLogger1
    cons.log("warn:file not found")
    cons.send("hello scala")
  }
}
~~~

运行结果为：

```
warn:file not found
hello scala
```

#### 定义具体的方法

和类一样，trait中还可以定义具体的方法。

示例：

~~~scala
trait Logger1{
  //具体的方法
  def log(msg:String)=println(msg)
}
class Add extends Logger1{
  def add()=log("添加用户")
}
object Test{
  def main(args: Array[String]): Unit = {
    val ad=new Add
    ad.add()
  }
}
~~~

运行结果为：

```
添加用户
```

#### 定义具体方法和抽象方法

在trait中，可以混合使用具体方法和抽象方法

使用具体方法依赖于抽象方法，而抽象方法可以放到继承trait的子类中实现，这种设计方式也称为**模板模式**

示例

~~~scala
trait Logger3{
  def log(msg:String)
  def INFO(info:String)=log("INFO"+info)
  def WARN(warn:String)=log("WARN"+warn)
  def ERROR(error:String)=log("ERROR"+error)
}
class PrintLog extends Logger3{
  override def log(msg: String): Unit = println(msg)
}
object Test{
  def main(args: Array[String]): Unit = {
    val log1=new PrintLog
    log1.INFO("这是一条INFO级别信息")
    log1.WARN("这是一条WARN级别信息")
    log1.ERROR("这是一条ERROR级别信息")
  }
}
~~~

运行结果为：

```
INFO这是一条INFO级别信息
WARN这是一条WARN级别信息
ERROR这是一条ERROR级别信息
```

#### 定义具体字段和抽象字段

在trait中可以定义具体字段和抽象字段，继承trait的子类自动拥有trait中定义的字段，字段直接被添加到子类中。

示例：

~~~scala
trait Person{
  val name:String
  val address:String="China"
}
class Student1 extends Person{
  override val name: String = "krystal"
}
object Test{
  def main(args: Array[String]): Unit = {
    val s1:Student1=new Student1
    println(s"${s1.name} lives in ${s1.address}")
  }
}
~~~

运行结果为：

```
krystal lives in China
```

#### 实例对象混入trait

1. trait还可以混入到实例对象中，给对象实例添加额外的行为
2. 只有混入了trait的对象才具有trait中的方法，其他的该类对象不具有trait中的行为
3. 使用with将trait混入到实例对象中
4. 将trait混入对象时，不要自己指定类型，使用自动推导，即不能写成该形式：val s1:Student=...

示例：

~~~scala
trait Person{
  val address:String="China"
  def log(msg:String)=println(msg)
}
class Student1{}
object Test{
  def main(args: Array[String]): Unit = {
    // 使用with关键字直接将特质混入到对象中
    val s1=new Student1 with Person //不能写成val s1:Student=new Student1 with Person
    println(s"krystal lives in ${s1.address}")
    s1.log("你好")
    println(s1.getClass)

    val s2:Student1=new Student1
    println(s2.getClass)
  }
}
~~~

运行结果为：

```
krystal lives in China
你好
class Test$$anon$1
class Student1
```



## scala模式匹配和样例类

scala有一个十分强大的模式匹配机制，可以应用到很多场合。并且scala还提供了样例类，对模式匹配进行了优化，可以快速进行匹配。

应用场合：

1. java  switch  case
2. switch语句
3. 类型查询
4. 以及快速获取数据

#### 匹配字符串

~~~scala
import scala.util.Random

object Test extends App{
  val arr=Array("hadoop","zookeeper","flume","spark")
  val name=arr(Random.nextInt(arr.length))
  name match{
    case "hadoop" =>println("This is Hadoop")
    case "zookeeper" =>println("This is zookeeper")
    case _ =>println("I don't know who you are")
  }
}
~~~

说明：

1. Random.nextInt()用于生成随机数
2. case "hadoop" =>println("This is Hadoop")表示name如果是"hadoop",则执行println("This is Hadoop")
3. case _表示，如果前面的case都不满足，则执行...

#### 匹配类型

~~~scala
import scala.util.Random

object Test extends App{
  val arr=Array("hello",1,3.5,Test)
  val valueA=arr(Random.nextInt(arr.length))

  valueA match{
    case x:Int                => println("Int=>"+x)
    case y:Double if(y>=0)    => println("Double=>"+y)
    case z:String             => println("String=>"+z)
    case _                    => throw new Exception("not match exception")
  }
}
~~~

说明：

1. case x:Int一行表示，如果valueA是Int类型，则将valueA赋值给x,然后执行语句println("Int=>"+x)
2. case y:Double if(y>=0)一行表示，如果valueA是Double类型，则将valueA赋值给y,然后判断y是否>=0,如果是，则执行语句println("Double=>"+y)

#### 匹配数组

~~~scala
import scala.util.Random

object Test extends App{
  val arr=Array(1,3,5)
  arr match{
    case Array(1,x,y)         => println(x+"---"+y)
    case Array(1,_*)          => println("1...")
    case Array(0)             => println("Only 0")
    case _                    => println("something else")
  }
}
~~~

运行结果为：

```
3---5
```

说明：

1. case Array(1,x,y)表示如果arr的第一个元素是1，且arr刚好有3个元素，则将3、5分别赋值给x,y，然后执行println(x+"---"+y)
2. case Array(1,_*)表示如果arr的第一个元素是1，且1后面还有一个或者多个元素，则执行...
3. case匹配只会匹配一个，如果前面的case已经满足条件了，则不会再去判断后面case了，这就是运行结果只有3---5，没有1...的原因。

#### 匹配集合

~~~scala
object Test extends App{
  val list1=List(0,3,6)
  list1 match{
    case 0::Nil =>println("Only 0")
    case 0::tail =>println("0...")
    case x::y::z::Nil =>println(s"x:$x y:$y z:$z")
    case _ =>println("something else")
  }
}
~~~

运行结果为：

```
0...
```

说明：

1. case 0::Nil的Nil表示已经到了末尾，表示0后面没有元素了，也就是list1只有0
2. case 0::tail的tail表示List的后半部分，List可分为两部分，head是第一个元素，tail是第一个元素后的所有元素
3. case x::y::z::Nil表示List只有3个元素

#### 匹配元组

~~~scala
object Test extends App{
  val tup=(0,3,6)
  tup match{
    case (1,x,y)    => println(s"1,$x,$y")
    case (2,x,y)    => println(s"$x,$y")
    case _          => println("others...")
  }
}
~~~

运行结果为：

```
others...
```

说明：

1. 类比匹配数组即可

------

#### 样例类

样例类是一种特殊类，它可以用来快速定义一个用于**保存数据**的类（类似于Java POJO类），而且它会自动生成apply方法，允许我们快速地创建样例类实例对象。

注：Java POJO类是一个有属性和get、set方法的类，但是没有业务逻辑。

##### 样例类

语法结构：定义样例类

~~~scala
case class 样例类名(成员变量名1:类型1, 成员变量名2:类型2 ...)
~~~

示例：

~~~scala
//定义样例类：
case class casePerson(name:String,age:Int)
case class caseStudent(var name:String,var age:Int) // 使用var指定成员变量是可变的
object Test{
  def main(args: Array[String]): Unit = {
    //使用newc创建实例：
    val p1=new casePerson("张三",20)
    //使用类名直接创建实例：
    val p2=casePerson("王五",24)
    //p1.name="zhangsan"--->报错，样例类默认的成员变量都是val的，除非手动指定变量为var类型
    //p2.name="wangwu"--->报错

    val p3=caseStudent("李四",21)
    p3.name="lisi" //没报错
    println(s"${p3.name} ${p3.age}") 
  }
}
~~~

运行结果为：

```
lisi 21
```

说明：

1. 样例类默认的成员变量都是val的，除非手动指定变量为var类型

##### 样例对象

使用case object可以创建样例对象。样例对象是单例的，而且它**没有主构造器**。样例对象是可序列化的。

语法格式：定义样例对象

~~~scala
case object 样例对象名
~~~

示例：

~~~scala
case class SendMessage(text:String)

// 消息如果没有任何参数，就可以定义为样例对象
case object startTask
case object PauseTask
case object StopTask
~~~

示例: 样例类和样例对象结合模式使用

~~~scala
import scala.util.Random

case class SubmitTask(id:String,name:String)
case class HeartBeat(time:Long)
case object CheckTimeOutTask

case object caseDemo extends App{
  val arr=Array(CheckTimeOutTask,HeartBeat(10000),SubmitTask("0001","task-0001"))
  val a=arr(Random.nextInt(arr.length))
  a match {
    case SubmitTask(x,y) =>println(s"id:$x, name:$y")
    case HeartBeat(x) =>println(s"time: $x")
    case CheckTimeOutTask =>println("检查超时")
    case _ =>println("others...")
  }
}
~~~

说明：

1. case SubmitTask(x,y)=>...表示如果是SubmitTask类型，则将"0001","task-0001"分别赋值给x,y，然后执行语句...
2. 其它case，类比即可。



##### Option类

Option类可以看成是特殊的样例类，用来表示可能存在或也可能不存在的值，Option类有2个子类

一个是Some, Some包装了某个值,一个是None, None表示没有值。两个子类的大致源代码如下：

```scala
final case class Some[+A](val x : A) extends scala.Option[A] with scala.Product with scala.Serializable {
  def isEmpty : scala.Boolean = { /* compiled code */ }
  def get : A = { /* compiled code */ }
}

case object None extends scala.Option[scala.Nothing] with scala.Product with scala.Serializable {
  def isEmpty : scala.Boolean = { /* compiled code */ }
  def get : scala.Nothing = { /* compiled code */ }
}
```

![1568271621212](scala.assets/1568271621212.png)

![1568271671144](scala.assets/1568271671144.png)

示例:

~~~scala
object Test{
  def main(args: Array[String]): Unit = {
    val map1=Map("a"->1,"b"->2)
    val value1:Option[Int]=map1.get("b")

    val v1=value1 match {
      case Some(i)=>i
      case None =>0
    }
    println(v1)

    //更好的方式：
    val v2=map1.getOrElse("c",0)
    println(v2)
  }
}
~~~

运行结果为：

```
2
0
```

说明：

1. map1.get("b")是获得键为b的键值
2. value1可能是有值也可能没值，由map1.get()中的键决定。如果有值就用Some类型来接收值，没有值就是用None类型。
3. Option/Some/None都是样例类
4. case Some(i)=>i表示 如果value1的类型是Some类型(有值），则将value1的值赋给i，然后执行 i
5. case Some(i)=>i表示 如果value1的类型是None类型（无值），然后执行 0
6. 匹配的值最终赋给vl



##### 偏函数

被包在花括号内==没有match的一组case语句==是一个偏函数，它是PartialFunction[A, B]类的一个实例，

* A代表输入参数类型
* B代表返回结果类型
* 可以理解为：偏函数是一个参数和一个返回值的函数。

示例：

~~~scala
object Test extends App{
  //func1是一个输入参数为Int类型，返回值为String类型的偏函数
  val func1:PartialFunction[Int,String]={
    case 1 => "一"
    case 2 => "二"
    case 3 => "三"
    case _ => "其他"
  }
  println(func1(2))

  val list1=List(1,2,3,4,5,6)
  //使用偏函数来执行filter过滤操作，filter编程原本是这样写的list1.filter(x => x >3)
  val res=list1.filter{
    case x if x>3 =>true
    case _=>false
  }
  println(res)
}
~~~

运行结果为：

```
二
List(4, 5, 6)
```

说明：

1. PartialFunction[Int,String]={
       case 1 => "一"
       case 2 => "二"
       case 3 => "三"
       case _ => "其他"
     }这是一个偏函数，是func1的类型
2. 

## scala异常处理

#### 异常场景

来看看下面一段代码

~~~scala
object Test{
  def main(args: Array[String]): Unit = {
    val n=10/0
  }
}
~~~

运行结果：

```scala
Exception in thread "main" java.lang.ArithmeticException: / by zero
at Test$.main(Customer.scala:3)
at Test.main(Customer.scala)
```

执行程序，可以看到scala抛出了异常，说明程序出现错误后就终止了。那怎么解决该问题呢？

#### 捕获异常

在scala中，可以使用异常处理来解决这个问题。在Scala里，借用了模式匹配的思想来做异常的匹配

捕获异常的语法格式：

~~~scala
try {
    // 代码
}
catch {
    case ex:异常类型1 => // 代码
    case ex:异常类型2 => // 代码
}
finally {
    // 代码
}

~~~

说明：

1. try中的代码是我们编写的业务处理代码
2. 在catch中表示当出现某个异常时，需要执行的代码
3. 在finally中，是不管是否出现异常都会执行的代码

示例：

~~~scala
object Test{
  def main(args: Array[String]): Unit = {
    try{
      val n=10/0
    }catch {
      case ex1: Exception=>println(ex1.getMessage)
    }finally {
      println("我始终都会被执行")
    }
  }
}
~~~

运行结果为：

```scala
/ by zero
我始终都会被执行
```

#### 抛出异常

我们也可以在一个方法中，抛出异常。语法格式和Java类似，使用throw new Exception...

示例：

~~~scala
object Test{
  def main(args: Array[String]): Unit = {
    throw new Exception("这是一个异常")
  }
}
~~~

运行结果为：

```scala
Exception in thread "main" java.lang.Exception: 这是一个异常
	at Test$.main(Customer.scala:3)
	at Test.main(Customer.scala)
```

## scala提取器(Extractor)

提取器是从传递给它的对象中提取出构造该对象的参数。(回想样例类进行模式匹配提取参数)

scala 提取器是一个带有unapply方法的对象。unapply方法算是apply方法的反向操作

unapply接受一个对象，然后从对象中提取值，提取的值通常是用来构造该对象的值。

![1552639637165](scala.assets/1552639637165.png)

![1552639674932](scala.assets/1552639674932.png)

示例:

~~~scala
class Student{
  var name:String=_
  var age:Int=_
  //辅助构造器1：
  def this(name:String,age:Int)={
    this()
    this.name=name
    this.age=age
  }
  //辅助构造器2：
  def this(name:String)={
    this()
    this.name=name
  }
}

object Student{
  def apply(name:String): Student = new Student(name)
  def apply(name:String,age:Int): Student = new Student(name,age)
  //实现提取器：
  def unapply(arg: Student): Option[(String,Int)] = Some(arg.name,arg.age)
}

object Test{
  def main(args: Array[String]): Unit = {

    //正常new一个实例
    val kk=new Student("krystal")
    println(kk.name)
    //类名创建一个实例
    val kk2=Student("krystal2")
    println(kk2.name)

    val lisi=Student("lisi",30)
    lisi match{
      case Student(x,y)=>println(s"name:$x  age:$y")
    }
  }
}
~~~

运行结果为：

```scala
krystal
krystal2
name:lisi  age:30
```

说明：

1. 执行lisi match{
       case Student(x,y)=>println(s"name:\$x  age:\$y")
     }时，
2. 首先会调用伴生对象的unapply方法，同时把lisi对象传到该unapply方法，解析出name和age,然后构造一个Some,最后将name赋给x,age赋给y,然后执行println(s"name:\$x  age:\$y")

## scala泛型

scala和Java一样，类和特质、方法都可以支持泛型。在scala中，使用方括号来定义类型参数

```scala
scala> val list1:List[String] = List("1", "2", "3")
list1: List[String] = List(1, 2, 3)
```

#### 定义一个泛型方法

示例：不考虑泛型的支持

~~~scala
object Test{
  def getMiddle(arr:Array[Int])=arr(arr.length/2)
  def main(args: Array[String]): Unit = {
    var arr1=Array(1,2,3,4,5)
    println(getMiddle(arr1))
  }
}
~~~

运行结果为：

```
3
```

示例：考虑泛型的支持

~~~scala
object Test{
  //使用泛型：
  def getMiddle[A](arr:Array[A])={arr(arr.length/2)}
  def main(args: Array[String]): Unit = {
    var arr1=Array(1,2,3,4,5)
    var arr2=Array('a','b','c','d','e')
    println(getMiddle(arr1))
    println(getMiddle(arr2))

    //简写方式：
    println(getMiddle(arr1))
    println(getMiddle(arr2))
  }
}
~~~

运行结果为：

```
3
c
3
c
```

#### 定义一个泛型类

定义一个Pair类包含2个类型不固定的泛型

示例:

 ~~~scala
// 类名后面的方括号，就表示这个类可以使用两个类型、分别是T和S
// 这个名字可以任意取
class Pair[T,S](val f1:T,val f2:S){}
case class People(var name:String,var age:Int)
object Test{
  def main(args: Array[String]): Unit = {
    val p1=new Pair[String,Int]("zhangsan",10)
    val p2=new Pair[String,String]("lisi","1997-02-16")
    val p3=new Pair[People,People](People("jimmy",21),People("krystal",21))
  }
}
 ~~~

#### 上下界

在指定泛型类型时，有时需要界定泛型类型的范围，而不是接收任意类型。比如，要求某个泛型类型，必须是某个类的子类，这样在程序中就可以放心的调用父类的方法，程序才能正常的使用与运行.

scala的上下边界特性允许泛型类型是某个类的子类，或者是某个类的父类

 参数U >: 类型T  这是类型下界的定义，也就是U必须是类型T的父类或者是自己本身。

 参数U <: 类型T  这是类型上界的定义，也就是U必须是类型T的子类或者是自己本身。

###### 示例1：上界

~~~scala
class Pair[T<:Person,S<:Person](val first:T,val second:S){
  def chat(msg:String)=println(s"${first.name}对${second.name}说: $msg")
}

class Person(var name:String,var age:Int){}
class Student(name:String,age:Int) extends Person(name,age){}
object Test{
  def main(args: Array[String]): Unit = {
    //Pair的构造方法的参数既可以是Person类型，也可以是Student类型
    val p1=new Pair[Person,Student](new Person("Jimmy",21),new Student("krystal",20))
    p1.chat("I love you")
  }
}
~~~

运行结果为：

```
Jimmy对krystal说: I love you
```

###### 示例2：上下界结合

![1552657709922](scala.assets/1552657709922.png)

需求：控制Person只能和Person、Policeman聊天，但是不能和Superman聊天。

~~~scala
class Pair[T<:Person,S >: Policeman <:Person](val first:T,val second:S){
  def chat(msg:String)=println(s"${first.name}对${second.name}说: $msg")
}
class Person(var name:String,var age:Int)
class Policeman(name:String,age:Int) extends Person(name,age)
class Superman(name:String,age:Int) extends Policeman(name,age)

object Test{
  def main(args: Array[String]): Unit = {
    val p1=new Pair[Person,Person](new Person("lufei",21),new Person("nvdi",25))
    p1.chat("我爱你")
    val p2=new Pair[Person,Policeman](new Person("lisi",21),new Policeman("zhangsan",25))
    p2.chat("你好")

    //val p3=new Pair[Person,Superman](new Person("zuolong",21),new Superman("sanji",25))-->报错
    //p3.chat("我迷路了")
  }
}
~~~

运行结果为:

```
lufei对nvdi说: 我爱你
lisi对zhangsan说: 你好
```



#### scala协变、逆变、非变

观察下面代码块1，思考一个类型转换的问题：从val p1 = new Pair("hello")可以知道，p1的类型是Pair(String),那么将p1赋给类型为Pair(AnyRef)的p2? 

答案是不行的，会报错。虽然说String类型是AnyRef的子类型，但是不代表Pair(String)是Pair(AnyRef)的子类型，所以不能将Pair(String)类型转为Pair(AnyRef)类型。

代码块1：

~~~scala
class Pair[T](a:T)

object Pair {
  def main(args: Array[String]): Unit = {
    val p1 = new Pair("hello")
    // 编译报错，无法将p1转换为p2
    val p2:Pair[AnyRef] = p1

    println(p2)
  }
}
~~~

那怎么解决这个问题？-->使用协变。

###### 协变

将上面代码块1中的class Pair[T]替换成class Pair[+T]：

~~~scala
class Pair[+T]，这种情况是协变。类型B是A的子类型，Pair[B]可以认为是Pair[A]的子类型。这种情况，参数化类型的方向和类型的方向是一致的。
~~~

###### 逆变

将上面代码块1中的class Pair[T]替换成class Pair[-T]：

~~~scala
class Pair[-T]，这种情况是逆变。类型B是A的子类型，Pair[A]反过来可以认为是Pair[B]的子类型。这种情况，参数化类型的方向和类型的方向是相反的。
~~~

###### 非变

上面的代码块1使用的就是非变：

~~~scala
class Pair[T]{}，这种情况就是非变（默认），类型B是A的子类型，Pair[A]和Pair[B]没有任何从属关系，这种情况和Java是一样的。
~~~

![1558064807949](scala.assets/1558064807949.png)

###### 示例:

~~~scala
class Father
class Son extends Father

class Temp1[A](title:String)
class Temp2[+A](title:String)
class Temp3[-A](title:String)

object Test{
  def main(args: Array[String]): Unit = {
    val a=new Son()
    val b:Father=a  //没报错，证明Son是Father的子类，可以转换

    //非变：
    val t1:Temp1[Son]=new Temp1[Son]("测试")
    //val tt1:Temp1[Father]=t1-->报错

    //协变
    val t2:Temp2[Son]=new Temp2[Son]("测试")
    val tt2:Temp2[Father]=t2

    //逆变
    val t3:Temp3[Father]=new Temp3[Father]("测试")
    val tt3:Temp3[Son]=t3
  }
}

~~~

总结:

~~~scala
C[+T]：如果A是B的子类，那么C[A]是C[B]的子类。
C[-T]：如果A是B的子类，那么C[B]是C[A]的子类。
C[T]： 无论A和B是什么关系，C[A]和C[B]没有从属关系。
~~~



## scala隐式转换和隐式参数

#### 隐式转换

Scala提供的隐式转换和隐式参数功能，是非常有特色的功能。是Java等编程语言所没有的功能。它可以允许你手动指定，将某种类型的对象转换成其他类型的对象或者是给一个类增加方法。通过这些功能，可以实现非常强大、特殊的功能。

隐式转换其核心就是定义一个使用 ==implicit== 关键字修饰的方法 实现把一个原始类转换成目标类，进而可以调用目标类中的方法

#### 隐式参数

所谓的隐式参数，指的是在函数或者方法中，定义一个用implicit修饰的参数，
此时Scala会尝试找到一个指定类型的用implicit修饰的参数，即隐式值，并注入参数。

所有的隐式转换和隐式参数必须定义在一个object中

#### 案例演示

##### 案例一：让java.io.File类具备RichFile类中的read方法

~~~scala
import java.io.File
import scala.io.Source

class RichFile(val f:File){
  def read():String={
    Source.fromFile(f).mkString
  }
}
object MyPredef{
  implicit def file2RichFile(f:File)=new RichFile(f)
}
object Test{
  def main(args: Array[String]): Unit = {
    val f=new File("F:\\test\\aa.txt")
    import MyPredef.file2RichFile 
    val data:String=f.read
    println(data)
  }
}
~~~

说明：

1. mkString的作用是将一个集合转化为一个字符串
2. import MyPredef.file2RichFile 如果将这行注释掉，会报错
3. 

##### 案例二：超人变身

~~~scala
package com.jimmy

class Man(val name:String){
  def fight1=println("打不过怪兽")
}
class SuperMan(val name:String){
  def fight2=println("超人打怪兽")
}
object MySuper{
  implicit def Man2Super(m:Man)=new SuperMan(m.name)
}
object Test{
  def main(args: Array[String]): Unit = {
    val m=new Man("dijia")
    m.fight1

    println("变身！！！！！！")
    import MySuper.Man2Super
    m.fight2
  }
}

~~~

运行结果为：

```
打不过怪兽
变身！！！！！！
超人打怪兽
```

##### 案例三：一个类隐式转换成具有相同方法的多个类

~~~~scala
class Animal{}
class Person1{
  def readBook(name:String)=println(s"在读书: $name")
}
class Person2{
  def readBook(name:String)=println(s"在看书: $name")
  def Riding()=println("在骑单车")
}
object MyUtils{
  implicit def animaltoPerson1(am:Animal)=new Person1
  implicit def animaltoPerson2(am:Animal)=new Person2
}
object Test1 extends App{
  val am:Animal=new Animal
  import MyUtils.animaltoPerson1
  am.readBook("格列佛游记")
}
object Test2 extends App{
  val am:Animal=new Animal
  import MyUtils.animaltoPerson2
  am.readBook("西游记")
}
object Test3 extends App{
  val am:Animal=new Animal
  import MyUtils._  //不能使用这种方式导入，下面容易出错
  //am.readBook("西游记")-->报错
}
~~~~

三个object的运行结果分别为：

```
在读书: 格列佛游记
在看书: 西游记
报错
```

说明：

1. import MyUtils._ 这种方式会导入所有的隐式转换函数，因为Person1和Person2都有readBook函数，所以这个方式会导致不知道选用哪个类的readBook，从而报错

##### 案例四：员工领取薪水

~~~scala
object Msg{
  //在object中定义隐式值
  //注意：同一类型的隐式值只允许出现一次，否则会报错
  implicit val name="zhangsan"
  implicit val salary=10000.00  //这个需要有小数位，否则后面会报错
}
class Boss{
  def callName(implicit name:String):String=name +" is coming. "
  def sendSalary(implicit salary:Double):String="This is your salary: "+salary
}
object Test extends App{
  //使用import导入定义好的隐式值，注意：必须先加载否则会报错
  import Msg.name
  import Msg.salary
  val b1=new Boss
  println(b1.callName+b1.sendSalary)
}
~~~

运行结果为：

```
zhangsan is coming. This is your salary: 10000.0
```

说明：

1. 在object中定义隐式值，但是同一类型的隐式值只允许出现一次，否则会报错
2. 隐式类型以及对应的值类型必须对应好，否则容易报错
3. println(b1.callName+b1.sendSalary)这里使用callName和sendSalary方法都不需要传参数，是因为有了隐式参数
4. 调用带有隐式参数的方法时，只需导入方法参数对应类型的隐式参数即可。