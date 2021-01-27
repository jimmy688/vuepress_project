
<img src='java.assets/clip_image002.jpg' />

<img src='java.assets/image-20200119011446002.png'/>

## 常用的dos命令

##### **目录操作**

- `d:`切换盘符
- `dir` 列出来当前目录的所有文件
- `md`创建目录
- `rd`删除空目录
- `cd`打开目录
- `tab`自动补全
- `.` 一个点为当前目录..两个点为上一级目录
- `cd \`或者`cd\`退回到当前盘符的根目录(与linux的斜杆方向不同)

##### **文件操作**

- `del a.txt del *.txt`
- `del 目录-`-- 表示删除目录下的所有文件

##### **其他操作**

- `cls`清屏
- `exit`退出`dos`

##### **计算机常用命令**(不区分大小写)

- `notepad`(打开记事本)
- `Mspaint`(打开画图工具)

<video id="video" controls="" preload="none">
    <source id="mp4" src="E:\LearningAll\3-Java-video\1-常见dos操作\常用的dos命令.mp4" type="video/mp4">
</video>

## Java简介

##### Java的诞生

>   SUN公司James Gosling 为手持设备开发的嵌入式编程语言
>
>   原名Oak,1995年改名为Java正式推出

##### Java的版本 

-  Java SE： Standard Edition 标准版
-  Java EE：Enterprise Edition 企业版
-  Java ME: Micro Edition  微型版

<img src='java.assets/image-20200119011446002-1608488947324.png'/>

> Java EE包含了JavaSE，而JavaME是JavaSE的精简版，ME并不常用

##### Java特点

-   一种面向对象的跨平台编程语言
-   以字节码的方式运行在虚拟机上
-   自带功能齐全的类库
-   非常活跃的开源社区支持

##### Java的优缺点

######   优点

-  简单（相对C语言）
-  健壮（强类型机制、异常处理、垃圾的自动收集等是Java程序健壮性的重要保证）
-  安全（Java提供了一个安全机制以防恶意代码的攻击）
-  跨平台，一次编写，到处运行
-  高度优化的虚拟机

######   缺点：

​    语法比较繁琐

​    无法直接操作硬件

​    GUI效果不佳

##### Java的应用范围：

######   适用于：

​    企业和互联网后端开发（web开发）

​    Android移动App开发

​    大数据应用开发

######   不适用于

​    底层操作系统开发

​    桌面应用程序开发

​    桌面大型游戏开发

##### 为什么选Java

  全球top1开发语言，最大的开发社区，最多的产商支持

  企业和互联网后端开发/Android开发/大数据开发

##### Java 版本演进

  1995 1.0  2004 1.5/5.0

  1998 2.0  2006 1.6/6.0

  2000 1.3  2011 1.7/7.0

  2002 1.4  2014 1.8/8.0

##### Java规范

>   JSR规范：Java Specification Request
>
>   JCP组织：Java Community Process（负责维护Java规范）-------用来确保Java跨平台特性

![image-20200119011353574](java.assets/image-20200119011353574.png)			

还需要一个TCK测试套件来监测Java代码是否通过规范测试

##### Java平台(JVM>JRE>JDK)

<img src='java.assets/image-20200119011533343.png' align='center'/>

​			可以看到 **JVM+Runtime Library** 可以运行在各大系统上（windows,linux,mac…）,支持跨平台使用

------

- JVM ：英文名称（Java Virtual Machine），就是我们耳熟能详的 Java 虚拟机。它只认识 xxx.class 这种类型的文件，它**能够将** **class** **文件中的字节码指令进行识别并调用操作系统向上的 API** **完成动作**。所以说，jvm 是 Java 能够跨平台的核心，具体的下文会详细说明。

- JRE ：英文名称（Java Runtime Environment），我们叫它：Java 运行时环境。它主要包含两个部分，jvm 的标准实现和 Java 的一些基本类库。它**相对于** **jvm** **来说，多出来的是一部分的 Java** **类库。**

- JDK ：英文名称（Java Development Kit），Java 开发工具包。**jdk** **是整个 Java** **开发的核心，它集成了 jre** **和一些好用的小工具。**例如：javac.exe，java.exe，jar.exe 等。

  显然，这三者的关系是：一层层的嵌套关系。**JDK>JRE>JVM**。

## 安装JDK

- **安装JDK(直接搜索JDKdownload去oracle官网下载jdk.exe)**

  **下载地址：**http://www.oracle.com/technetwork/java/javase/downloads/index.html

> ​	我的Oracle账户：
>
> [	974643517@qq.com](mailto:974643517@qq.com)
>
> ​	AsdfZxcv888

  **安装目录不要有中文**

- **安装完成后，配置环境变量**

  右击计算机→属性→高级系统设置→环境变量→系统变量path→编辑→新建

- **检查JDK****是否安装正确**

  **cmd**

​    输入java(java.exe 就是Java虚拟机)

​    输入 java -version

​	输入javac(JDK的编译器的Javac)

​      	只要三个命令都被识别成功即可

- **编写第一个Java程序**

```java
  public class Hello {
      public static void main(String[] args) {
          System.out.println(“Hello,world!”);
      }
  }
```

1. 首先新建一个文本
2. 输入被批注内容
3. 保存为Hello.java，后缀名为.java（保存路径不能有中文）
4. **进入源文件:**   进入对应盘符→cd Hello.java保存路径
5. **编译：**javac Hello.java(JDK的编译器的Javac)
6. **交给jvm虚拟机识别:** java Hello(java.exe 就是Java虚拟机)

**Java运行原理：**

`.java`源程序→编译→字节码程序`.class`→解释执行→解释器(`jvm`把`.class`文件变成特定平台的机器码)→运行→操作系统



## Java入门知识

#### Java标识符

  	自己定义的东西的名字就是标识符(类名，变量名，方法名，包名)

######   **命名规则**

​	1、标识符对大小写敏感

​	2、关键字不能做标识符

​	3、可由字母、数字、下划线_ 美元符$

​	4、不能以数字开头

###### 	命名规范(驼峰命名,见名只意)

1. **包名**:  全部小写，以域名开头，如：com.sikiedu.tools

2. **类名:**第一个单词首字母**大写**，后面的单词首字母**大写**

3. **函数和变量名:**第一个单词首字母**小写**，后面的单词首字母**大写**

   > **类名必须以英文字母开头**
   >
   > 要注意命名习惯：
   >
   > **好的命名：**
   >
   > ​	Hello
   >
   > ​	NoteBook
   >
   > ​	VRPlayer
   >
   > **不好的命名：**
   >
   > ​	hello （纯小写的）
   >
   > ​	Good123 （没有意义的名称）
   >
   > ​	Note_book （带下划线_的名称）
   >
   > ​	World

#### Java注释符

###### 		单行注释 

```java
// (在notepad++里面，ctrl+k添加注释，ctrl+q取消注释)
```

###### 		多行注释 

```java
/* balabala

balabala*/
```

###### 		文档注释

```java
/**
 *
 */
```

###### 	Java程序基本结构

```java
public class 类名{
  public表示这是一个公开的class
  在一个class内部可以定义很多的方法：
  返回值 方法名(参数){
  //我们的方法是main，返回值是void，表示没有返回值
  //在方法的花括号中间，语句是真正的执行代码，每一行语句必须以分号结束
  }
}
```

注意：当我们单击eclipse的类或方法，eclipse可以显示范围

<img src='java.assets/clip_image002-1579371731097.jpg' align='left' style='border:2px black solid'/>

------

#### Java数据类型

Java分为两大数据类型

1. **基本数据类型**
2. **引用数据类型**

![img](java.assets/clip_image002.png)

**从图看到：**Java语言提供了**八种基本类型**。**六种数字类型**（四个整数型，两个浮点型），一种字符类型，还有一种布尔型。

查看数据类型：使用`getClass()`函数，如：

```java
System.out.println("I love you".getClass());
//运行结果为 java.lang.String
```



##### 八大基本类型

------

###### **八大基本类型都是不可变数据类型**

当该数据类型的对应变量的值发生了改变，那么它对应的内存地址也会发生改变，对于这种数据类型，就称不可变数据类型。

###### **查看各大基本类型的二进制位数和最大最小值**

```java
public class TestReflection {
    public static void main(String[] args) {
        System.out.println(Byte.MAX_VALUE);
        System.out.println(Byte.MIN_VALUE);
        System.out.println(Byte.SIZE);
    }
}
// 其它类型查询方法一样
```

运行结果为：

```
127
-128
8
```

###### 类型的默认值

只定义变量不赋值时会有默认值，如

```java
static byte by; 

static char ch;
```

> 数据类型默认值：

![img](java.assets/clip_image003.png)

##### 引用类型（不可变类型）

------

1. 在Java中，引用类型指向一个对象，**指向对象的变量是引用变量**。这些变量在声明时被指定为一个特定的类型，比如 Employee、Puppy 等。变量一旦声明后，类型就不能被改变了。
2. 所有引用类型的默认值都是**null**。（空值null和空字符串””是不一样的）
3. 引用类型有：类、数组、接口。

> 字符串String是一个类，也属于引用数据类型,是Java中一个比较特殊的类，它不是Java的基本数据类型之一，但可以像基本数据类型一样使用，声明与初始化等操作都是相同的，如
>
> ```java
> String s = ‘a’;
> ```
>
> 拓展：
>
> String 是一个类，
>
> StringBuilder也是一个类
>
> 两者都是引用类型，区别是：
>
> String：不可变数据类型
>
> StringBuilder：可变数据类型
>
> ```java
> String s = "a"; s = s + "b";
> ```
>
> //其中s指向了两个内存地址 ，一个地址中是“a” ，另一个是 “ab”
>
> ```java
> StringBuilder sb = "a";  sb = "ab";
> ```
>
> //StringBuilder是可变数据类型，更改它的时候sb始终指向同一个位置

 

##### 常量

常量不会发生变化, 常量在程序运行时是不能被修改的。在 Java 中使用 final 关键字来修饰常量，声明方式和变量类似

```java
final double PI = 3.1415927;
```

虽然常量名也可以用小写，但为了便于识别，通常**使用大写字母表示常量**。

##### 自动类型转换：

整型、实型（常量）、字符型数据可以混合运算。运算中，不同类型的数据先转化为同一类型，然后进行运算。

 **转换从低级到高级。**

```java
低 ------------------------------------> 高

byte,short,char—> int —> long—> float —> double 
```

**数据类型转换必须满足如下规则：**

1. 不能对boolean类型进行类型转换。

2. 在把容量大的类型转换为容量小的类型时必须使用强制类型转换。

   ```java
   int i1 = 123; 
   byte b = (byte)i1;//强制类型转换为byte
   ```

3. 转换过程中可能导致溢出或损失精度，例如：

   ```java
   int i =128;  
   byte b = (byte)i;
   ```

   因为 byte 类型是 8 位，最大值为127，所以当 int 强制转换为 byte 类型时，值 128 时候就会导致溢出。

4. 浮点数到整数的转换是通过舍弃小数得到，而不是四舍五入，例如：

   ```java
   (int)23.7 == 23;    
   (int)-45.89f == -45
   ```

##### 隐含强制类型转换：

整数默认为int,小数默认为double类型，因此：

- ​	定义long类型时使用方法:

  ```java
  long d =100000000000L;//(末尾不添加L/l会出错)
  ```

- ​	定义float类型时使用方法:

  ```java
  float e=1.2f; //(末尾不添加F/f会出错)
  ```

##### 变量注意事项

1. 作用域(有效范围):定义在哪个大括号内，就在哪里有效，不能同名在同一个作用域里面
2. 在使用之前初始化
3. 一行可以定义多个变量

```java
int x;int y;int z;

int x,y,z;

int x=90,y=2,z=80;
```

##### 计算机存储单位的原理

1字节=8位

1byte=8bit

1kbyte=1024byte

1mb=mbyte=1024kbyte

1gb=1024mb

> B=byteb=bit,宽带100Mb=100/8MB=12.5MB(销售策略，字节与位的区别: B,b)
>
> 购买硬盘：16GB=16*1000/1024GB变小了;

##### 特殊值

-   NaN表示Not a Number 0.0/0
-   Infinity 无穷大 1.0/0
-   -Infinity 负无穷大 -1.0/0

##### 进制类型

-   二进制——输出十进制整型对应的二进制toBinaryString()
-   八进制
-   十六进制——输出十进制整型对应的十六进制toHexString()
-   十进制 

------

#### Java运算符

##### 算术运算符

\+ -  *  /  %(求余)

/  (两边只要有一个是浮点类型结果就是浮点类型)

**浮点数运算注意**：

1. 很多浮点数无法精确表示，如

   ```java
   double a = 0.1
   ```

2. 计算会有误差，如`1-9.0/10`

3. 浮点运算中，整型可以自动提升到浮点型

> 注意类型不自动提升的情况，如，24/5 分子分母都为整型，
>
> 解决方法：将其中一个数转为浮点型

##### 赋值运算符

+=,-=,/=,%=

##### 字符串拼接符 **+**

可以使用+字符对字符串进行组拼，任何类型和字符串相加都会把数据转成字符串，再进行组拼

```java
a+"hello";  //ahello
34+"hello"; //34hello
```

##### 自增运算符

++ --

```java
 int res1=a++ //顺序:res1=a→a=a+1;(先用了再加1)
 int res2=++a //顺序:a=a+1→res2=a;(先加了1再用)
```

##### 比较运算符

<>  <=  >= ==  != 结果为Boolean类型

##### 逻辑运算符

**&&(短路与)-----&逻辑与**

> &与&&的区别:
>
> 两者都表示逻辑与，但是&&还具有短路的功能，即如果第一个表达式为 false，则不再计算第二个表达式，而&没有。

```java
   int a=10,b=10;

   System.out.println(a<5 & (++b)>10);

   System.out.println(b);//结果为11

   a=10;b=10;

   System.out.println(a<5 && (++b)>10 );

   System.out.println(b);//结果为10

   //第二part的第一个判断条件a<5为false之后，不会执行第二个条件
```

**||(短路或) (有一个为真即为true)--------|(逻辑或)**

> **|和||的区别：**
>
> 两者都表示逻辑或，但是||还具有短路的功能，即如果第一个表达式为 true，则不再计算第二个表达式，而|没有。

**! 取反(后面只能跟Boolean逻辑值)**

**^ 异或 (只有一真一假才为true)** 

##### 位运算符

- **正数: **  原码、反码与补码相同。

- **负数：**原码(符号位为1) 反码(符号位不变，其余数取反) 补码(反码+1)

  ```java
  9的原码/反码/补码都是00000000 00000000 00000000 00001001
  ```

  ```java
  -9的原码10000000 00000000 00000000 00001001
      
  -9的反码11111111 11111111 11111111 11110110
  
  -9的补码11111111 11111111 11111111 11110111
  ```

计算机存储正数的时候直接存储正数的原码，存储负数的时候直接存储负数的补码。

按位运算符(只针对二进制来说，所以在进行运算之前会转换成二进制，再运算)

1. **&按位与：对应位都是1才是1**

   ```java
    9: 00000000 00000000 00000000 00001001
   &7: 00000000 00000000 00000000 00000111
   //----------------------------------------
   结果 00000000 00000000 00000000 00000001
   //所以9&7=1
   ```

2. **|按位或：对应位有一个1，就是1**

3. **~按位取反：1变0，0变1**

4. **^按位异或：对应位不一样才是1**

##### 移位运算符

- <<左移(高位抛弃，低位补0)

  ```java
  -9: 11111111 11111111 11111111 11110111(补码)
  <<3 11111111 11111111 11111111 11110111
  //----------------------------------------
  补码  11111 11111111 11111111 11110111000
  反码  11111 11111111 11111111 11110110111(补码-1)
  原码  10000 00000000 00000000 00001001000
  
  //所以-9<<3的结果为-72
  ```

  

- \>\>右移(高位按照符号位补齐，低位抛弃)

  ```java
  -9: 11111111 11111111 11111111 11110111(补码)
  >>311111111 11111111 11111111 11110111
  //----------------------------------------
  补码  11111 11111 11111111 11111111 11110
  反码  11111 11111 11111111 11111111 11101 (补码-1)
  原码  10000 00000 00000000 00000000 00010
      
  //所以-9>>3的结果为-2
  ```

- \>\>\>\>无符号右移(忽略符号位，高位补0，低位抛弃)

  ```java
  //自己实验
  ```

##### 三元运算符  ?:  (条件运算符)

- **?:**

```java
语法: 布尔表达式 ? true表达式1 : fasle表达式2
```

**案例:取最大值**

```java
int a=100,b=23,c=392;

int maxR = (a>b) ? a : b; 

int maxT = (maxR>c) ? maxR : c;
//(maxR>c)这里可以不使用括号，但是应习惯使用括号，提升代码易读性

System.out.println(maxT);
//392
```



##### instance of运算符

  该运算符用于操作对象实例，检查该对象是否是一个特定类型（类类型或接口类型）如：

```java
String name = "James";

boolean result = name instanceof String; 

// 由于 name 是 String 类型，所以返回真true
```

```java
package day01;

class Sport{

}
class Football extends Sport{

}
public class Test01{
    public static void main(String[] args) {
        Football f=new Football();
        System.out.println(f instanceof Sport); 
    }
}
/*运行结果为ture，因为Football是Sport的子类，
而instanceof可以判断一个对象是否是属于某个类或者某个类的子类*/
```

------

#### Java输入与输出

##### 输入

  Java通过 Scanner 类来获取用户的输入，通过 Scanner 类的 next() 与 nextLine() 方法获取输入的字符串，在读取前我们一般需要 使用 hasNext 与 hasNextLine 判断是否还有输入的数据。

######  **步骤：**

1. 导入java.util.Scanner

   ```java
   import java.util.Scanner;
   ```

2. 创建Scanner对象

   ```java
   //语法： 
   Scanner s = new Scanner(System.in);
   ```

3. 使用 **hasNext() 与 hasNextLine()** 判断是否还有输入的数据

4. 使用**scanner.nextLine()读取字符串**，使用**scanner.nextInt()读取整数**

###### **使用next()方法例子**

```java
import java.util.Scanner; 
public class ScannerDemo { 
	public static void main(String[] args) {
		Scanner scan = new Scanner(System.in); 
		// 从键盘接收数据 
		// next方式接收字符串 
		System.out.println("next方式接收："); 
		// 判断是否还有输入 
		if (scan.hasNext()) {
			String str1 = scan.next();
			System.out.println("输入的数据为：" + str1); 
		} 
		scan.close(); 
	} 
}

/*运算结果
next方式接收：
I love you，krystal
输入的数据为：I
*/
```

###### **使用nextLine()方法例子：**

```java
import java.util.Scanner;

public class ScannerDemo { 

public static void main(String[] args) {

Scanner scan = new Scanner(System.in); 

// 从键盘接收数据 

// nextLine方式接收字符串 

System.out.println("nextLine方式接收："); 

// 判断是否还有输入 

if (scan.hasNextLine()) {

String str1 = scan.nextLine();

System.out.println("输入的数据为：" + str1); 

} 

scan.close(); 

} 

}
```

运算结果：

<img src='java.assets/clip_image004.jpg' align='left' style='border:2px black solid'/>

###### **next()和nextLine()的区别**

**next():**

1. 一定要读取到有效字符后才可以结束输入。
2. 对输入有效字符之前遇到的空白，next() 方法会自动将其去掉。
3. 只有输入有效字符后才将其后面输入的空白作为分隔符或者结束符。
4. next() 不能得到带有空格的字符串。

**nextLine()：**

1. 以Enter为结束符,也就是说 nextLine()方法返回的是输入回车之前的所有字符。
2. 可以获得空白。

> 如果要输入 int 或 float 类型的数据，在 Scanner 类中也有支持，但是在输入之前最好先使用 hasNextXxx() 方法进行验证，再使用 nextXxx() 来读取（使用方法和读取字符串一样） 

##### 输出

C语言风格的格式化输出使用: 

```java
	System.out.printf();
```

了解更多占位符的使用：https://www.runoob.com/w3cnote/java-printf-formate-demo.html

 使用占位符%xxx   , 例子：

```java
    System.out.printf("%sLoves%s%n", "Name", "Zhangsan");
```

## Java String类

String 类是不可改变的，所以你一旦创建了 String 对象，那它的值就无法改变了

如果需要对字符串做很多修改，那么应该选择使用 [StringBuffer & StringBuilder 类](https://www.runoob.com/java/java-stringbuffer.html)。

#### String字符串的操作

##### 创建字符串

1. 通过双引号`“”`创建。

   ```Java
   String greeting = "菜鸟教程";
   //String是一个引用类型，本质是一个类class,但是因为String太常用了，Java提供了这种方法。
   ```

2. 通过`new`关键字创建

   ```java
   String s=new String("abc");
   ```

3. 通过构造方法创建

   ```java
   char[] helloArray = { 'r', 'u', 'n', 'o', 'o', 'b'}; 
   String helloString = new String(helloArray);
   ```

##### 字符串长度

  String 类的一个**访问器方法** 是 length() 方法，它返回字符串对象包含的字符数。

  <u>用于获取有关对象的信息的方法</u>称为**访问器方法**。

```java
    String s= new String()

    s.length()
```



##### 连接字符串

- 使用`String类`的**concat方法**或者**+号**：


```java
System.out.println("hello".concat(" world"));

System.out.println("hello"+" world");

//结果都是hello world
```

- 使用`String类`的`join()`方法，通过某种连接符连接字符串。

```Java
public class Test01{
    public static void main(String[] args) {
        String[] a={"I", "love you","krystal"}; //创建字符串类型的数组
        String krystal=String.join("***",a);
        System.out.println(krystal);
    }
}
//运行结果为：I***love you***krystal
```

##### 分割字符串

String类提供了`split()`方法：依据某个分割符分割字符串。`split()`方法的参数是正则表达式。

```Java
public class Test01{
    public static void main(String[] args) {
        String a="kobe*this*is*for*you";
        String [] b=a.split("\\*"); //这里要注意，第一个\是转义字符，\*是正则表达式
        for(String i:b){  //循环遍历b
            System.out.println(i);
        }
    }
}
/*运行结果为：
kobe
this
is
for
you
*/
```

##### 替换字符串子串

使用String类提供的replace()方法，方法参数可以是正则表达式。

```Java
public class Test01{
    public static void main(String[] args) {
        String a="I hate you!";
        System.out.println(a.replace("hate","love"));//参数可以为正则表达式
    }
}
//运行结果为：I love you!
```

##### 格式化字符串

**使用printf()或者format()方法**

```java
float floatVar=1.0f;
int intVar=3;
String stringVar="Hello";
String fs;

 //printf()方法：
System.out.printf("浮点型变量的值为 " +
         "%f, 整型变量的值为 " +
         " %d, 字符串变量的值为 " +
         "is %s", floatVar, intVar, stringVar);

//format()方法:
/*注意：format()并不能打印字符串出来，需要另外输出语句，因为format() 返回一个String 对象而不是 PrintStream 对象*/
fs = String.format("浮点型变量的值为 " +
           "%f, 整型变量的值为 " +
           " %d, 字符串变量的值为 " +
           " %s", floatVar, intVar, stringVar);

System.out.print(fs);
```

##### 去除字符串首尾空白字符

- 使用`String`类的`trim()`方法可以移除字符串首尾的**英文空白字符**，空白字符包括：`\n,\r,\t`。

```Java
public class Test01{
    public static void main(String[] args) {
        String a="  I love you, Krystal!   ";
        System.out.println(a);
        System.out.println(a.trim()); //注意：trim()并没有改变字符串a,而是返回了新字符串
    }
}
/*运行结果如下，可以看到第二行输出被去除了空白字符
  I love you, Krystal!   
I love you, Krystal!
*/
```

- `String`类提供了`isEmpty()`方法来判断字符串是否为空（有空白字符就算字符串不为空）

```Java
public class Test01{
    public static void main(String[] args) {
        String a="  Kobe I love you  ";
        System.out.println(a.isEmpty()); //false
        System.out.println("      ".isEmpty()); //false
        System.out.println("".isEmpty()); //true
    }
}
```

##### String类支持的其它方法

- [x] 查看JAVA-More.word文档


#### Java StringBuffer 和 StringBuilder 类

和 String 类（不可变数据类型）不同的是，**StringBuffer 和 StringBuilder 类的对象能够被多次的修改**，并且**不产生新的未使用对象**。（即为可变数据类型）

例如：Java对`String`进行了特殊处理，可使用`+`连接字符串，但是利用`+`连接字符串的同时，会不断产生新的`String`类型对象。

```Java
public class Test01{
    public static void main(String[] args) {
        String a="";
        for (int i = 0; i < 3; i++) {
        }
    }
}
```

为了高效拼接字符串，Java提供了StringBuilder和StringBuffer类，它们是可变类型，可以预分配缓冲区，这两种类型字符串新增字符时，不会创建新的临时对象。

这两种类型字符串**不支持+号**，但**支持链式操作**，如下：

```Java
public class Test01{
    public static void main(String[] args) {
        StringBuilder a=new StringBuilder();
        a=a.append("I").append(" love you").insert(0,"Kobe, ");
        System.out.println(a);

        StringBuffer b=new StringBuffer();
        b=b.append("I").append(" love you").insert(0,"Krystal, ");
        System.out.println(b);
    }
}
/*运行结果为：
Kobe, I love you
Krystal, I love you
*/
```

从上面可以知道，要高效拼接字符串，应该使用`StringBuilder`，如：

```Java
package day01;

/**
 * 利用字符串数组{"Kobe","James","kevin","love","Jordan"}，
 *  拼接成 Hello,Kobe, James, kevin, love, Jordan!
 */
public class Test01{
    public static void main(String[] args) {
        StringBuilder s=new StringBuilder();
        String [] arrStr={"Kobe","James","kevin","love","Jordan"};
        s.append("Hello,");
        for (String i:arrStr){ //循环拼接
            s.append(i).append(", ");
        }
        s.delete(s.length()-2,s.length()-1); //去掉尾部的逗号和空格 ", "
        s.append("!");
        System.out.println(s);
    }
}
//运行结果为：Hello,Kobe, James, kevin, love, Jordan!

//------------Java还提供了StringJoiner类，该类可以指定拼接符和首尾符号来拼接字符串----------
package day01;

import java.util.StringJoiner;

public class Test01{
    public static void main(String[] args) {
        StringJoiner s=new StringJoiner(",","Hello,","!"); 
        //第一个参数是拼接符，第二个参数是字符串开头添加的内容，第三个参数是字符串结尾添加的内容
        System.out.println(s);
        String [] arrStr={"Kobe","James","kevin","love","Jordan"};
        for(String i:arrStr){
            s.add(i);
        }
        System.out.println(s);
    }
}
/*运行结果为：
Hello,!
HelloKobe,James,kevin,love,Jordan
 */
```

> StringBuilder和StringBuffer的区别：**
>
> ​	`StringBuilder`：有速度优势
>
> ​	`StringBuffer` 类：线程安全
>
> `StringBuffer`类支持的方法：查看JAVA-More.word文档



## Java数组

数组是Java重要数据结构之一，和类一样，数组也是引用数据类型，**数组是用来存储固定大小的同类型元素。**

##### 声明和创建数组

**声明数组：**

```java
dataType[] arrayRefVar; 

//如：double[] myList; 
```

**创建数组:** 

```java
arrayRefVar = new dataType[arraySize];
//如：myList = new double[10];

arrayRefVar = {value0, value1, ..., valuek};
//如：mylist={1,2,4,5,3,1}
```

  **同时声明创建数组：**

-   使用方法：

```java
dataType[] arrayRefVar = new dataType[arraySize];

dataType[] arrayRefVar = {value0, value1, ..., valuek};

//dateType： 要创建的数组的元素类型

//arrayRefVar ：数组名称

//arraySize：数组存储大小
```

- 案例

```java
// 数组大小

int size = 5;

// 定义数组

double[] myList = new double[size];

myList[0] = 5.6;

myList[1] = 4.5;
```

##### 遍历数组

  **使用基本循环：**

```java
for (int i = 0; i < myList.length; i++) {
	System.out.println(myList[i] + " ");
}
```

  **使用For-Each循环：**

- 语法格式如下：

```java
for(type element: array){
	System.out.println(element);
}
//type：数组元素类型
//array:数组名称
```

- 案例：

```java
double[] myList = {1.9, 2.9, 3.4, 3.5};
// 打印所有数组元素
for (double element: myList) {
	System.out.println(element);
}
```

 

##### 多维数组

  多维数组可看成数组的数组，创建方法与一维差不多，如：

```java
String str[][] = new String[3][4]
int a[][] = new int[2][3] //二维数组a可看成一个两行三列的数组
```

  **多维数组的动态初始化：**

```java
String s[][] = new String[2][];

s[0] = new String[2];

s[1] = new String[3];

s[0][0] = new String("Good");

s[0][1] = new String("Luck");

s[1][0] = new String("to");

s[1][1] = new String("you");

s[1][2] = new String("!");

/*
s[0]=new String[2] 和 s[1]=new String[3] 是为最高维分配引用空间，也就是为最高维限制其能保存数据的最长的长度，然后再为其每个数组元素单独分配空间s0=new String("Good")等操作。
*/ 
```

##### java.util.Arrays 类

```java
import java.util.Arrays;
```

Arrays 类能方便地**操作数组**，它提供的所有方法都是静态的, Ctrl+鼠标左键可以快速查看各个方法的源码

- **Arrays类的方法：**

```java
Arrays.toString(a);//将数组a以字符串形式输出,用该方法才能输出数组的值

Arrays.deepToString(a);//将多维数组的内容以字符串形式输出

Arrays.fill(a,from,to,int var)//给数组赋值
int [] a=new int[6];
Arrays.fill(a, 2);
System.out.println(Arrays.toString(a));
Arrays.fill(a, 2,4,8);
System.out.println(Arrays.toString(a));
//a为数组名称，from,to为索引范围，var为要替换的值

Arrays.equals(); //判断数组元素是否一一对应相等
Arrays.equals(a,b); //判断a,b两个数组元素是否一致
```

```java
Arrays.sort(); 
//对数组排序,原数组会被修改成为排过序的新数组
//--------------------------------------------------
//对数组进行排序，使用冒泡排序法：
int[] ns={34,2,4,6,3,23,2,3,23,3,5,24};
for (int i =0;i<ns.length;j++){
	for(int j=i+1;j<ns.length;j++){
    	if(ns[i]>ns[j]){
    	int timp=ns[j]; 
		//交换两个变量的值必须通过临时变量
    	ns[j]=ns[i];   
    	ns[i]=tmp;
		}
	}
}
```

```java
Arrays.binarySearch(a,key);// a: 要搜索的数组,key：要搜索的值
//用二分查找算法（从数组中间开始查找）在给定数组中搜索给定值的对象(Byte,Int,double等)。数组在调用前必须排序好的。

/*
返回值：如果key在数组中，则返回搜索值的第一个索引；否则返回-1或“-”（插入点）。插入点是索引键将要插入数组的那一点，即第一个大于该键的元素的索引。
技巧：
[1] 搜索值不是数组元素，且在数组范围内，从1开始计数，得“ - 插入点索引值”；
[2] 搜索值是数组元素，从0开始计数，得搜索值的索引值；
[3] 搜索值不是数组元素，且大于数组内元素，索引值为 – (length + 1);
[4] 搜索值不是数组元素，且小于数组内元素，索引值为 – 1。*/
```

## Java控制语句

###  Java 条件语句

##### if类型

- 语法格式如下：

```java
if( x < 20 ){
	System.out.print("这是 if 语句");
}
```

##### if-else类型

if最多有一个else语句

-  语法格式如下：

```java
if( x < 20 ){
	System.out.print("这是 if 语句");
	}else{
	System.out.print("这是 else 语句");
}
```

##### if-else if-else类型

-   语法格式如下：

```java
if( x == 10 ){
     System.out.print("Value of X is 10");
   }else if( x == 20 ){
     System.out.print("Value of X is 20");
   }else if( x == 30 ){
     System.out.print("Value of X is 30");
   }else{
     System.out.print("这是 else 语句");
}
```

##### 嵌套的if-else语句

```java
if( x == 30 ){
	if( y == 10 ){
		System.out.print("X = 30 and Y = 10");
	}
}
```

##### 条件判断注意事项：

- **用浮点数来进行**==的判断不靠谱,因为计算机是二进制的。浮点数没有办法是用二进制进行精确表示，如：

```java
double x=1-9/10.0;
    if (x==0.1){
      System.out.println("x==0.01");
 } 
// 没有任何输出，说明x不完全等于0.1
```

 **解决办法：**

可以利用差值小于某个临界值来判断： Math.abs(x-0.1)<0.000001)，如

```java
double x=1-9/10.0;
    if (Math.abs(x-0.1)<0.0000001){
        System.out.println("x==0.01");
}
// 输出了x=0.01，说明x接近等于0.1
```

------

- **对于引用类型，`==`判断是否指向同一对象，`equals()`判断内容是否相等** ，如：

> 1、`equals()`方法是`java.lang.Object`类的方法，实际上，`Object`类中的`equals`方法是用来比较“地址”的，也就是用来判断是否指向同一对象，但是`string`类重新定义了`equals()`方法
>
> 2、如果是基本类型比较，那么只能用`==`来比较，不能用`equals()` 

​	**String类重新定义了equals()方法,  对于String类创建的字符串变量 ：**

```java
	String s1=new String("abc");
    String s2=new String("abc");
    if(s1.equals(s2)) {
      System.out.println("yes");
    }else {
      System.out.println("no");
    }//结果为yes

	String s1=new String("abc");
    String s2=new String("abc");
    if (s1==s2) {
      System.out.println("yes");
    }else {
      System.out.println("no");
    }//结果为no
```

​    **由字符串常量创建生成的变量，地址一样，即变量指向同一个对象**

```java
    String s3 = "abc", s4 = "abc";
    if (s3.equals(s4)) {
      System.out.println("yes1");
    }
    if (s3 == s4) {
      System.out.println("yes2");
    }
    //yes1
    //yes2
```

​    **对于StringBuffer/StringBuilder类，equals()比较的是地址，即和==一样，如：**

```java
StringBuilder s1=new StringBuilder("abc");
StringBuilder s2=new StringBuilder("abc");
if (s1.equals(s2)){
	System.out.println("yes");
}
//没有输出结果，证明s1和s2地址不一样
```

​    **如果变量为null，调用equals()会报错，如**

```java
StringBuilder s1=new StringBuilder("abc");
StringBuilder s2=null;
if (s2.equals(s1)){
	System.out.println("yes");
}
//解决办法：把非null的对象放前面，即将s2.equals(s1)改成s1.equals(s2)
```

**总结：对非String类来说，"=="和"equals"方法的作用是相同的都是用来比较其对象在堆内存的首地址，即用来比较两个引用变量是否指向同一个对象。**

------

### switch case语句

- 语法格式：

```java
switch(expression){
    case value :
       //语句
       break; //可选
    case value :
       //语句
       break; //可选
    //你可以有任意数量的case语句
    default : //可选
    //语句
}
```

- swich case例子：

```java
public class Test {
	public static void main(String args[]){
		//char grade = args[0].charAt(0);
		char grade = 'C';
		switch(grade){
     		case 'A' :
      			System.out.println("优秀");
      			break;
     		case 'B' :
     		case 'C' :
      			System.out.println("良好");
      			break;
     		case 'D' :
      			System.out.println("及格");
      			break;
     		case 'F' :
      			System.out.println("你需要再努力努力");
      			break;
     		default :
      			System.out.println("未知等级");
  		}
		System.out.println("你的等级是 " + grade);
	}
}
```

1. case语句具有穿透性，如果没有 break 语句出现，程序会不断继续执行下一条 case 语句，直到出现 break 语句。所以，任何时候都不要忘记写break

2. switch 语句中的变量类型可以是： byte、short、int 、char或者String字符串类型

3. case 语句中的值的数据类型必须与变量的数据类型相同，而且只能是常量或者字面常量

4. 为避免漏写break或者default,可以在eclipse中修改设置：

   `Preference-->java-->compiler-->errors/Warnings-->”switch case fall-through” warning/ “switch is missing default’ case`

5. **尽量少用switch语句**

------

### Java 循环语句

##### while循环

```java
while( 布尔表达式 ) {
    //循环内容 
}
```

##### do while循环

```java
do {
    //代码语句
}while(布尔表达式);
//至少执行一次
```

##### for循环

```java
for(初始化; 布尔表达式; 更新) {
    //代码语句 
}
```

- **如：**`for(int x = 10; x < 20; x = x+1){}`

##### 增强for循环（for each循环）

```java
for(声明语句 : 数组名) {
    //代码句子 
}
//声明语句：声明新的局部变量，该变量的类型必须和数组元素的类型匹配
```

- 案例：

```java
String [] names ={"James", "Larry", "Tom", "Lacy"}; 
for( String name : names ) {
	System.out.print( name ); 
	System.out.print(","); 
}
// James,Larry,Tom,Lacy, 
```

##### 循环注意事项：

1. 死循环会导致CPU100%占用
2. 不要在循环体内修改计数器
   1.  计数器变量尽量定义在for循环中——`for(int i=0;…;..){}`  

------

### break和continue

break 主要用在循环语句或者 switch 语句中，用来跳出整个语句块。break 跳出最里层的循环，并且继续执行该循环下面的语句。  

continue 适用于任何循环控制结构中。作用是让程序立刻跳转到下一次循环的迭代。在 for 循环中，continue 语句使程序立即跳转到更新语句。在 while 或者 do…while 循环中，程序立即跳转到布尔表达式的判断语句.

**两者通常配合if使用**

 

## Java类和对象

##### **类和对象简介**

1、类是对象的一个模板，它描述一类对象的行为和状态。

2、对象是类的一个实例（对象不是找个女朋友），有状态和行为。例如，一条狗是一个对象，它的状态(属性)有：颜色、名字、品种；行为（方法）有：摇尾巴、叫、吃等。

##### **创建类和对象及使用方法**

```java
public class HelloWorld{
  int age=2;
  String color;
  void methodFirst(){
  boolean gender=true;
  System.out.println(gender);
}
	for (int i=1;i<=10;i++){
  		int sum= i;
	}
}

HelloWorld a=new HelloWorld(); //创建实例对象
a.methodFirst(); //访问实例对象方法
System.out.println(a.age); //访问实例对象变量 
```

##### **类包含的变量**

- 成员变量：定义在类中的变量是成员变量（如上面的age,color）

- 局部变量：定义在**方法**中或者**{}**语句块里面的变量是局部变量 (如上面的gender,sum)

- 静态变量：声明为static类型，也声明在类中，方法体之外。

  **成员变量与局部变量的区别**

  1、定义

  定义在类中的变量是成员变量

  定义在方法中或者{}语句块里面的变量是局部变量

  2、内存位置

  成员变量存储在内存的对象中(堆),只有new出来后才占用空间

  局部变量存储在栈内存的方法中

  3、声明周期不同

  成员变量随着对象的出现而出现在堆中，随着对象的消失而从堆中消失

  局部变量随着方法的运行而出现在栈中，随着方法的调用完弹栈而消失

  4、初始化不同

  成员变量因为在堆内存中，所有默认的初始化值

  局部变量没有默认的初始化值，必须手动的给其赋值才可以使用。

##### java垃圾回收机制

成员变量随着对象的出现而出现在堆中，随着对象的消失而从堆中消失

局部变量随着方法的运行而出现在栈中，随着方法的调用完弹栈而消失

<img src='java.assets/clip_image002-1579382382909.jpg' align='left'/>

##### 类作为形式参数

- 源文件demo1.java

```java
public class demo1{
	public static void main (String[] args){
		Student s=new Student();
		StudentDemo sd=new StudentDemo;
		sd.method(s);//形式参数是引用类型
	}
}
```

- 源文件Student.java

```java
public class Student{
	public void show(){
  		System.out.println(“I love you”);
	}
}
```

- 源文件StudentDemo.java

```java
public class StudentDemo{
	public void method(Student s){
		s.show();//类名作为形式参数要的其实是该类的对象
	}
}
//还有一点:类名作为返回值，返回的其实是该类的对象
```

------

##### 包装类和toString

###### 包装类

针对**八种基本数据类型**定义的**类**称为包装类（封装类）

| 基本数据类型 | 包装类（注意大小写） |
| :----------: | :------------------: |
|   boolean    |       Boolean        |
|     byte     |         Byte         |
|    short     |        Short         |
|     int      |       Integer        |
|     long     |         Long         |
|     char     |      Character       |
|    float     |        Float         |
|    double    |        Double        |

- 装箱：基本数据类型包装成包装类的实例。
- 拆箱：包装类转为基本数据类型

```java
package day01;

public class Test01{
    public static void main(String[] args) {
        //手动装箱：
        int a=10;
        Integer b=new Integer(a); //等价于Integer b=new Integer(10);
        System.out.println(b);  //输出10
        //自动装箱：
        Integer c=10;

        //手动拆箱:
        Integer d=new Integer(20);
        int e=d.intValue();
        System.out.println(e);//输出20
        //自动拆箱:
        int f =d;
        
        //也可以通过传递字符串参数来进行装箱，前提是字符串的内容是对应包装类的数据类型
        Integer i=new Integer("30"); //不会出i错
        Integer g=new Integer("abc"); //编译不会报错，但是运行会出错。
    }
}
// 也可以对其它基本数据类型进行装箱拆箱
```

为什么有包装类，因为基本数据类型没有方法和属性，而包装类就是为了让其拥有方法和属性，实现对象化交互。	

- 主要作用1：使用包装类的`xxx.parseFloat()`方法将字符串转为其它基本类型，使用`String.valueOf()`方法将其它基本数据类型转为字符串

```java
package day01;

public class Test01{
    public static void main(String[] args) {
        //字符串转到其它基本数据类型
        int a=Integer.parseInt("24");
        float b=Float.parseFloat("24.8");
        boolean c=Boolean.parseBoolean("false");

        //基本数据类型转为字符串
        String d=String.valueOf(34);
        String e=String.valueOf(false);
        String f=String.valueOf(24.8);
    }
}
```

###### toString()

`toString()`方法的作用是输出当前实例对象的内存地址，是继承自父类`Object`的方法（任何类都会继承父类Object）。如果要输出其它信息，可以在具体的类重写`toString()方法`

```Java
class Sport{

}
public class Test01{
    public static void main(String[] args) {
        Sport a=new Sport();
        System.out.println(a.toString());
        System.out.println(a); //跟有toString()的效果一样，都是返回对象的内存地址
    }
}
/*运行结果为：
day01.Sport@1b6d3586
day01.Sport@1b6d3586
*/
```



## Java源文件声明规则

1、一个源文件中只能有一个public类

2、一个源文件可以有多个非public类

3、源文件的名称应该和public类的类名保持一致。例如：源文件中public类的类名是Hello，那么源文件应该命名为Hello.java。

4、如果一个类定义在某个**包**中，那么package语句应该在源文件的首行。

- [x] 想了解包是什么？打开JAVA-More.doc 

5、如果源文件包含import语句，那么应该放在package语句和类定义之间。如果没有package语句，那么import语句应该在源文件中最前面。

6、import语句和package语句对源文件中定义的所有类都有效。在同一源文件中，不能给不同的类不同的包声明。

## Java包

Java包：**把功能相似或相关的类或接口组织在同一个包中，方便类的查找和使用, **同一个包中的类名字是不同的，不同的包中的类的名字是可以相同的，当同时调用两个不同包中相同类名的类时，应该加上包名加以区别。因此，包可以避免名字冲突。

 包没有父子关系。java.util和java.util.zip是不同的包，两者没有任何继承关系。

-  创建包：在源文件第一行加入包声明:  `package 包名`

```java
package day01;

public class Test01 {
}
```

- 导入包：

```java
import animals.*

import animals.Animal
```



## Java方法

##### Java **方法简介：**

> 在前面几个章节中我们经常使用到 `System.out.println()`，那么它是什么呢？
>
> `println()` 是一个方法。
>
> System 是系统类。
>
> out 是标准输出对象。
>
> 这句话的用法是调用系统类 System 中的标准输出对象 out 中的方法 `println()`。

**那么什么是方法呢？**

1. Java方法是语句的集合，它们在一起执行一个功能。
2. 方法是解决一类问题的步骤的有序组合
3. 方法包含于类或对象中
4. 方法在程序中被创建，在其他地方被引用 

##### 方法的优点

1. 使程序变得更简短而清晰。

2. 有利于程序维护。

3. 可以提高程序开发的效率。

4. 提高了代码的重用性。

##### 方法的命名规则

方法的名字的第一个单词应以**小写字母作为开头，后面的单词则用大写字母开头写，**不使用连接符。例如：addPerson 

##### 方法的定义：

```java
 修饰符 返回值类型 方法名(参数类型 参数名){
    ...
    方法体
    ...
    return 返回值;
} 
```

##### 方法的调用：

1、 当方法由返回值时，方法调用通常被当作一个值赋给变量，如：

​	`int large=max(30,40);`

2、 当方法没有返回值时，方法调用是一条语句

​	`System.out.println(“Hello world”);`

- 案例

```java
public class HelloJimmy {
    public static void main(String[] args) {
      int maxNumber;
      int a=30;
      int b=40;
      maxNumber=max(a,b);
      System.out.printf("The max number is %d" ,maxNumber);
    }
    public static int max(int num1, int num2) {
      int result;
      if (num1>num2) {
        result=num1;
      }else {
        result=num2;
      }
      return result;
    }
}
//最终输出了The max number is 40
```

这个程序包含了main和max方法，max方法没有什么特别的，唯一不同地方在于main方法是被JVM调用的。

**main** **方法的头部是不变的**，如例子所示，带修饰符 public 和 static,返回 void 类型值，方法名字是 main,此外带个一个 String[] 类型参数。String[] 表明参数是字符串数组。

------

##### 修饰符：

修饰符，这是可选的，告诉编译器如何调用该方法。定义了该方法的访问类型。 

##### 返回值类型

  方法返回值的类型，**如果方法不返回任何值，则返回值类型指定为** **void** ；如果方法具有返回值，则需要指定返回值的类型，并且在方法体中使用 return 语句返回值

##### 方法的参数传递方式

  Java里方法的参数传递方式只有一种：**值传递(pass by value)**, 所谓值传递，就是讲实际参数的**影分身**传入到方法内，而参数本身不会发生任何变化。

可以理解为你在画图工具上画了一个图，再复制一份，你对复制品的任何涂改不会影响之前原版的画。

<img src='java.assets/clip_image006.jpg' align='left'/>

###### 1、 将八大基本数据类型作为传递的参数

- 以int类型为例子:

```java
public class HelloJimmy {
public static void main(String[] args) {
        int a = 40;
        changeInt(a);
        System.out.println(a);
      }
      public static void changeInt(int b) {
        b=30;
      }
}//输出了40，可以看到将a作为参数传入，main方法中的a值并未受到影响
```

###### 2、 将引用数据类型作为传递的参数

- 以数组类型为例子

```java
import java.util.Arrays;
public class HelloJimmy {
public static void main(String[] args) {
int[] a = { 23, 4, 5, 142 };
        changeInt(a);
        System.out.println(Arrays. toString (a));
      }
      public static void changeInt( int [] b) {
        b[0] = 100;
      }
}//输出结果为[100, 4, 5, 142]，数组的内容受到了影响
```

不是说值传递吗,参数本身不会发生变化吗，为什么引用数据类型的值会受到影响?

------



####### 首先我们来看一下Java的内存知识：

  Java虚拟机在运行的时候时要开辟内存空间的，启动时在自己的内存区域中还要进行更细致的划分。

  **JVM内存的划分有5片：**

​    1、寄存器

​    2、本地方法区

​    3、方法区

​    4、栈内存：栈的优势是，存取速度比堆要快，仅次于寄存器

> 栈 存储的都是局部变量，凡是定义在方法中的都是局部变量(方法之外的是全局变量)，主要存放8大基本类型的变量。变量都有自己的作用域，一旦程序离开作用域，变量就会被释放。栈内存的更新速度很快，因为局部变量的生命周期都很短。

​    5、堆内存：存储的是数组和对象（其实数组就是对象 ）

> 数组的父类也是Object, java中数组的创建使用了关键字new，凡是new建立的都是在堆中，堆中存放的都是实体（对象），实体用于封装数据，而且是封装多个（实体的多个属性），如果一个数据消失，这个实体也没有消失，还可以用，所以堆是不会随时释放的，但是栈不一样，栈里存放的都是单个变量，变量被释放了，那就没有了。堆里的实体虽然不会被释放，但是会被当成垃圾，Java有垃圾回收机制不定时的收取。

------

**因此，根据Java内存机制，我们有图，数组对象存放在了堆里：**

  ![img](java.assets/clip_image002-1579383216456.jpg)

  在上面数组作为参数传递的例子中，在**方法中传递引用的时候，引用被复制了两份**，因此a引用的对象会被修改，数组a本身的值受到了影响。

  ![img](java.assets/clip_image004-1579383216456.jpg)

###### 3、 将String这一特殊引用类型作为传递的参数

String是一种特殊的引用类型，作为参数传递时，实参的值不会受到影响。如：

```java
public class HelloJimmy {
	public static void main(String[] args) {
		String str = "Hello world";
		changeString(str);
		System.out.println(str);
	}
	public static void changeString(String s) {
		s = "Hello Krystal";
	}
}//结果输出为Hello world
```

 此时s和str引用的对象一样，都是“hello world”,但经过`s = "Hello Krystal"`;操作后，由于字符串的不可变性，此时s会引用一个新对象，s指向`”Hello Krystal”`的位置，s的hashcode值变化了，但str依旧引用着对象`”Hello world”`。

##### 可变参数

方法的可变参数声明如下：

```Java
typename...parametername//在指定类型后加一个省略号(...)
//一个方法中只能指定一个可变参数，它必须是方法的最后一个参数。任何普通的参数必须在它之前声明。
```

案例：

```Java
package test;

public class PrintMaxNumber {
    public static void main(String[] args) {
        ReturnMaxNumber a=new ReturnMaxNumber();
        System.out.println(a.findM(12.5,23,45,7.8,3));
        //结果输出了45.0
    }
}
class ReturnMaxNumber{ 
    public double findM(double...numbers){  //在类内写一个返回最大值的方法
        double maxNunber=numbers[0];//初始化最大值为第一个数字
        for (int i = 1; i < numbers.length; i++) {
            if (maxNunber<numbers[i]){
                maxNunber=numbers[i];
            }
        }
        return maxNunber; //返回最终的最大值
    }
}
```

------

## this关键字

this代表当前类的引用对象(代表当前类的一个对象)

案例：

- 源文件Demo.java:（与下面文件在同一个包中）

  ```java
  public class Demo {
  	private int age=23;
  	public void SetAge(int age) {
  		this.age=age;
  	}
  	public int GetAge() {
  		return age;//其实这里隐藏了this
  	}
  }
  ```

- 源文件Hello.java:

  ```java
  public class Hello {
  	public static void main(String[] args) {
  		Demo d=new Demo();
  		d.SetAge(34);
  		int c=d.GetAge();
  		System.out.println(c);//输出了34
  	}	
  }
  ```


## super关键字

super关键字可用于访问父类中定义的属性、方法以及可用在子类构造器中调用父类的构造器。当子父类出现同名成员时，可以用this和super区分，super的追溯**不仅限于直接父类**。

##### 访问父类中定义的属性

```Java
package test;

public class GrandFather { //GrandFather为Son类的父类中的父类
    protected int age;  //设为protected以便于子类对其的访问
}
```

```Java
package test;

public class Father extends GrandFather{ //Father为Son类的父类
    public void test1(){  //test1()方法通过super关键字访问GrandFather类的age属性
        System.out.println(super.age);
    }
}
```

```Java
package test;

public class Son extends Father { //Son类
    public void test2() { //test2()方法通过super关键字访问GrandFather类的age属性
        System.out.println(super.age);
    }
}
//用来运行的类:
class RunTool{
    public static void main(String[] args) {
        Father a =new Father();
        a.test1();
        Son b=new Son();
        b.test2();
    }
}
/*运行结果为: 
0 
0
*/
```

##### 访问父类中的方法

```Java
package test;

public class GrandFather {
    public void helloSuper(){
        System.out.println("I love you");

    }
}
```

```Java
package test;

public class Father extends GrandFather{
    public void  test1(){ 
        super.helloSuper();
    }
}
```

```Java
package test;

public class Son extends Father {
    public void test2() {
        super.helloSuper();
    }
}
//运行的类: 
class RunTool{
    public static void main(String[] args) {
        Father a =new Father();
        a.test1();
        Son b=new Son();
        b.test2();
    }
}
/*运行结果为:
I love you
I love you 
*/
```

##### 在子类构造方法中调用父类的构造方法

1. 子类中所有的构造器默认都会访问父类中空参数的构造。
2. 当父类中没有空参数的构造器时，子类的构造器必须通过this(参数列表)或者super(参数列表)语句指定调用本类或者父类中相应的构造器，且必须放在构造器的第一行。
3. 如果子类构造器中既无法显式调用父类或本类的构造器，且父类中没有无参的构造器，则编译会出错。

###### 案例1

```Java
//子类中所有的构造器默认都会访问父类中空参数的构造。
package test;

public class Father{
    public Father(){
        System.out.println("这里是Father类的构造方法");
    }
}
```

```Java
package test;

public class Son extends Father {
}

class RunTool{
    public static void main(String[] args) {
        Son b=new Son();
        /*new生成对象的时候，实际上调用了该类自身的构造方法，如
        Son b=new Son();其实是调用了public Son(){}构造方法，
        而Son类自身的构造方法又会去调用父类的无参构造方法，因此运行了语句：
        System.out.println("这里是Father类的构造方法");
        */
    }	
}
/*运行结果为:
这里是Father类的构造方法
*/
```

###### 案例2

报错的：

```Java
/*
当父类中没有空参数的构造器时，子类的构造器必须通过this(参数列表)或者super(参数列表)语句指定调用本类或者父类中相应的构造器，且必须放在构造器的第一行。*/
package test;

public class Father{
    public Father(String name,Boolean gender){
        System.out.println(name+" : "+gender);
    }
    public Father(String name,int age){
        System.out.println(name+" : "+age);
    }
}
```

```Java
package test;

public class Son extends Father {
}//会显示错误: There is no default constructor available in 'test.Father'
```

不报错的：

```Java
package test;

public class Father{
    public Father(String name,Boolean gender){
        System.out.println(name+" : "+gender);
    }
    public Father(String name,int age){
        System.out.println(name+" : "+age);
    }
}
```

```Java
package test;

public class Son extends Father {
    public Son(){
        super("krystal",21);// 这一个语句必须放在构造器方法体的第一行
        System.out.println("I love you");
    }
}
//运行类:
class RunTool{
    public static void main(String[] args) {
        Son b=new Son();
    }
}
/*运行结果为:
krystal : 21
I love you
*/
```



------



## Java修饰符

##### Java修饰符分为两大类：

- 访问修饰符:default、private、public、protected
- 非访问修饰符:static、final、abstract、synchronized和volatile

##### 访问修饰符

- public（修饰类、变量、方法、接口）
- default（修饰类、变量、方法、接口）
- private（修饰~~类~~、变量、方法、~~接口~~）	
- protected（修饰~~类~~、变量、方法、~~接口~~）//被划掉的不能被修饰

`private-->default-->protected-->public (访问权限大小)`

| **修饰符**      | **当前类** | **同一包内** | **子孙类==(同一包)==** | **子孙类==(不同包)==** | **其他包** |
| --------------- | :--------- | :----------- | :--------------------- | :--------------------- | :--------- |
| public          | ✅          | ✅            | ✅                      | ✅                      | ✅          |
| protected       | ✅          | ✅            | ✅                      | ✅/❌                    | ❌          |
| default（缺省） | ✅          | ✅            | ✅                      | ❌                      | ❌          |
| private         | ✅          | ❌            | ❌                      | ❌                      | ❌          |

访问修饰符是用来控制被修饰的东西的访问权限的，下面是访问修饰符的访问控制表：

可以看到，从private到default到protected到public，权限是越来越大的。private给予的权限最小，只有当前类可以使用。

###### private访问修饰符

> 修饰对象：private用来==修饰变量和方法==
>
> 范围：被private修饰的变量和方法只能==为当前类使用==
>
> 声明为private的变量只能通过类中公共的 getter 方法被外部类访问，如：

- Inner.java源文件（与下面文件在同一个包中）

```java
public class Inner {
	private int age=23;
	public void SetAge(int age) {
		this.age=age;
	}
	public int GetAge() {
		return age;
	}
}
```

- Outter.java源文件：

```java
public class Outter{
	public static void main(String[] args) {
		Inner a= new Inner();
		a.SetAge(50);    //Outter类修改Inner类private声明的变量
		System.out.println(a.GetAge());  //访问private声明的变量
	}
}
```

###### default访问修饰符（缺省）

> 修饰对象：default用来==修饰类、变量、方法、接口==
>
> 范围：被private修饰的变量和方法只能==为**同一个包**的类（包括子孙类）使用==

- 缺省修饰的变量不能被外包类访问案例

```java
package PackageOne;

public class HelloOne {
    int age=21;
}
```

```java
package PackageTwo;

import PackageOne.HelloOne;

public class HelloTwo extends HelloOne {
    public static void main(String[] args) {
        HelloTwo b=new HelloTwo();
        System.out.println(b.age);
        //报错：'age' is not public in 'PackageOne.HelloOne'. Cannot be accessed from outside package
    }
}
```

###### protected访问修饰符

protected可修饰变量、方法（包括构造方法），不能修饰类。

1、子类与基类在同一包中：被声明为 protected 的变量、方法和构造器能被同一个包中的任何其他类访问；

2、子类与基类不在同一包中：那么在子类中，子类实例可以访问其从基类继承而来的 protected 方法，而不能访问基类实例的protected方法。

- 案例

```java
package p1;
public class Father1 {
    protected void f() {
    	System.out.println("这是来自父类protected声明的方法");
    }
}
//------------------------------

package p1;
public class Son1 extends Father1 {
	public static void main(String[] args) {
		Father1 a=new Father1();
		a.f();  //输出：这是来自父类protected声明的方法
		Son1 b=new Son1();
		b.f();  //输出：这是来自父类protected声明的方法
	}

}
//-------------------------------

package p2;
import p1.Father1;
public class Son2 extends Father1{
	public static void main(String[] args) {
		Father1 a=new Father1();
		//a.f();  此步会编译报错(a是父类实例，而Son2子类与父类不在同一个包中) 
		Son2 b = new Son2();
		b.f();  //输出：这是来自父类protected声明的方法
	}
}
```

###### public访问修饰符

方法和属性前有public修饰，可以被任意包内的类访问。 另外，类要想被其他包导入，必须声明为public。==被public修饰的类，类名必须与文件名相同。==

------



##### 非访问修饰符	

###### static非访问修饰符

`static`可以概括为一句话：**方便在没有创建对象的情况下进行调用**。也就是说：被static关键字修饰的不需要创建对象去调用，直接**根据类名就可以去访问**。

被`static`修饰后的成员会随着类的加载而加载，优先于对象存在,被所有对象共享。

`static`关键字修饰成员**变量（不能修饰局部变量）、方法**、代码块、<u>内部类</u>。
			

```java
package test;

public class HelloJimmy {
    public static int a = 10;

    public static void fun1() {
        System.out.println("Hello Krystal");
    }
}

class Person {
    public static void main(String[] args) {
        //直接通过类名访问静态变量，如果a声明名中的static删掉，此步会报错
        HelloJimmy.a = 20;
        //通过创建对象进行调用，不推荐这样使用
        HelloJimmy b = new HelloJimmy();
        b.a = 30;

        //通过类名直接访问静态方法，如果a声明名中的static删掉，此步会报错
        HelloJimmy.fun1();
        //通过创建对象访问
        b.fun1();
    }
}
```

####### 静态变量

实例变量在每个实例中都有自己的一个独立“空间”，但是静态变量只有一个共享“空间”，所有实例都会共享该变量。对于静态变量，无论修改哪个实例的静态变量，效果都是一样的：所有实例的静态变量都被修改了，原因是静态变量并不属于实例。

```java
package test;

public class TestOne {
    public static void main(String[] args) {
        HelloStatic a = new HelloStatic();
        HelloStatic b = new HelloStatic();
        a.setAge(20);//这步会同时改变b实例的age值
        System.out.println(a.getAge());//结果为20
        System.out.println(b.getAge());//结果也是20
    }
}

class HelloStatic {
    private static int age = 18;

    public void setAge(int age) {
        this.age = age;
    }

    public int getAge() {
        return this.age;
    }
}
```

####### 静态方法

用static修饰的方法称为静态方法，跟静态变量一样，静态方法属于`class`而不属于实例，因此，==静态方法内部，无法访问this变量，也无法访问实例字段，它只能访问静态字段==。 需要的是，`main()`方法就是静态方法。

```java
package test;

public class TestOne {
    private static int name;
    HelloStatic c=new HelloStatic();
    public static void main(String[] args) {
        System.out.println(this.name); 
        //报错：'test.TestOne.this' cannot be referenced from a static context
        System.out.println(c.getAge());
        //报错：Non-static field 'c' cannot be referenced from a static context
    }
}

class HelloStatic {
    private static int age;

    public void setAge(int age) {
        this.age = age;
    }

    public int getAge() {
        return this.age;
    }
}
```

静态方法如果要访问内部类，则该内部类需要加上`static`修饰符。

```java
public class TestOne {
    public static void main(String[] args) {
        Person a = new Person();
        //报错：'test.TestOne.this' cannot be referenced from a static context
        //提示：make Person ‘static’
    }

    class Person {  //将Person这个内部类加上static修饰符即可被静态方法访问
        private int age;

        public void setAge(int age) {
            this.age = age;
        }

        public int getAge() {
            return this.age;
        }
    }
}
```

静态方法常用在工具类中，例如`Math.random();  Arrays.sort();`

```java
package test;

class CompareM { //将CompareM作为一个比较大小的工具类
    //选取最大值
    public static int findMax(int a,int b){
        return a>b?a:b;
    }
    //选取最小值
    public static int findMin(int a,int b){
        return a>b?b:a;
    }
}

public class TestOne {
    public static void main(String[] args) {
        //下面使用工具类CompareM的静态方法
        System.out.println(CompareM.findMax(54,23));
        System.out.println(CompareM.findMin(3,744));
    }
}
```

####### 静态变量和静态方法的设计思想

> 类属性（类变量）作为该类各个对象之间共享的变量。在设计类时，分析哪些类属性不因对象的不同而改变，将这些属性设置为类属性。相应的方法设置为类方法。
>
> 如果方法与调用者无关，则这样的方法通常被声明为类方法，由于不需要创建对象就可以调用类方法，从而简化了方法的调用。

####### 接口的静态变量

接口里面可以存在常量，修饰符默认为`public static final`

```java
public interface Test01{
    int a=10;//等同于public static final int a=10;
}
```



------

###### final非访问修饰符

1. final修饰的类不能被继承。提高安全性，提高程序的可读性。
2. final修饰的方法不能被子类重写。
3. final修饰的变量（成员变量或者局部变量）即称为常量。变量名称通常用大写，且只能被赋值一次。

####### final修饰类

```Java
package test;

public final class Father{
    
}
class Son extends Father{
    //会报错：Cannot inherit from final 'test.Father'，表示Father类不能被继承
}
```

####### final修饰方法

```Java
package test;

public class Father{
    public final String funFirst(){
        return "True";
    }
}
class Son extends Father{
    @Override
    public String funFirst() { //报错：'funFirst()' cannot override 'funFirst()' in 'test.Father'; overridden method is final，表示父类方法funFirst()不能被重写
        return super.funFirst();
    }
}
```

####### final修饰变量

```Java
package test;

public class Father{
    public final static int a=20;
}
class Son extends Father{
    public static void main(String[] args) {
        a=30;//报错：Cannot assign a value to final variable 'a'，表示不能修改a的值
    }
}
```

final修饰的成员变量必须初始化值，可以**直接赋值**也可以在**构造方法中赋初值**（建议使用这种方式）。

```Java
public class Father{
    public final int a;//会报错：Variable 'a' might not have been initialized
}
```

```Java
package test;

public class Father{
    public final int a;//此处不能添加static，如果添加static必须通过直接赋值，不能用构造方法来赋初始值。final变量经常和static关键字一起使用，作为常量。
    public Father(int a){
        this.a=a;
    }
}
class Son extends Father{
    public Son(int a) { //必须显示调用super()方法
        super(a);
    }
}
class RunClass{
    public static void main(String[] args) {
        Son b=new Son(24);
        System.out.println(b.a); //输出24
        
        Father c=new Father(8);
        System.out.println(c.a);  //输出8
        
        c.a=23; //被构造方法赋了初始值，不能被修改，会报错：Cannot assign a value to final variable 'a'
    }
}
```

如果修饰的成员变量是一个引用类型，则是说这个引用的地址的值不能修改，但是这个引用所指向的对象里面的内容还是可以改变的。

## 封装和隐藏（面向对象特征一）

利用getter、setter、private进行封装。将数据声明为私有的（private），再提供公共的public方法getter和setter实现对该属性的操作

- 案例原始代码

```java
class TestM {
    public int age;//TestM类的age属性被直接暴露给外部类，让调用者随意使用，可能会出问题
}
public class TestF{
    public static void main(String[] args) {
       TestM a=new TestM();
       a.age=1000;//age属性不仅被调用，还被乱修改值，逻辑性欠缺
       System.out.println(a.age);
    }
}
```

- 案例**使用封装思想**后的代码

```java
package test;

class TestM {
    private int age;//这里将public改成了private，age变量只有在当前类可以被访问

    public int getAge() { //getter 可使用快捷键Alt+insert添加
        return age;
    }

    public void setAge(int age) {//setter
        //加强逻辑控制
        if (age < 100 & age > 0) { 
            this.age = age;
        } else {
            System.out.println("请输入合理的年龄");
        }
    }
}

public class TestF {
    public static void main(String[] args) {
        TestM a = new TestM();
        a.setAge(200);
        System.out.println(a.getAge());
    }
}

/*
运行结果为：
请输入合理的年龄
0
*/
```

> **封装目的**：
>
> 1. 隐藏一个类中不需要对外提供的实现细节
> 2. 加入控制逻辑，限制对属性的不合理操作
> 3. 便于修改，增强代码的可维护性

## 方法重载

一系列方法，功能类似，但是参数不同，这成为方法的重载（overload）

比如下列的`String`类提供了多个重载方法`valueOf()`

<img src='java.assets/image-20200121043659456.png' align='left' style="border:2px solid black"/>

```java
package test;
public class TestOne{
    public static void main(String[] args) {
        //valueOf的作用是将数据转为String类型
        System.out.println(String.valueOf(23));//输出结果为23
        System.out.println(String.valueOf("A"));//输出结果为A
        char [] a=new char[3];
        a[0]=65;
        a[1]='G';
        a[2]='H';
        System.out.println(String.valueOf(a));//输出结果为AGH
    }
}
//如果想看valueOf()重载方法的源码，可以ctlr+鼠标点击查看
```

## 构造方法 (构造器constructor)

> 功能：**初始化实例**

#### 1、使用方法

- 构造方法的名称就是类名，且修饰符跟类一致

- 构造方法的参数没有限制，在方法内部，可以编写任意语句

- 和普通方法相比，构造方法没有返回值，也没有void关键字

- 调用构造方法，必须使用new操作符

  ```java
  public class HelloG {
      public static void main(String[] args) {
          Person a=new Person("Jimmy",21);  //静态方法不能访问非静态内部类
          System.out.println(a.name);
          System.out.println(a.age);
      }
      public static class Person{  //这里一定要加static非访问修饰符
          private String  name;
          private int age;
  
          public Person(String name,int age){
              this.name=name;
              this.age=age;
          }
  
      }
  }
  //=========================将Person类改为外部类==================================
  public class HelloG {
      public static void main(String[] args) {
          Person a = new Person("Jimmy", 21);
          System.out.println(a.GetName());
          System.out.println(a.GetAge());
      }
  
  }
  
  class Person {
      private String name;
      private int age;
  
      public Person(String name, int age) {
          this.name = name;
          this.age = age;
      }
      public String GetName(){
          return this.name;
      }
      public int GetAge(){
          return this.age;
      }
  }
  
  ```

  

#### 2、默认构造方法

> 默认构造方法没有参数，也没有执行语句, 如果一个类没有定义构造方法，编译器会自动为我们生成一个默认构造方法。

默认构造方法如下:

```java
public class HelloA {
    public HelloA(){}
}
```

如果我们自定义了一个构造方法，那么，**编译器就不再自动创建默认构造方法**

```java
public class HelloG {
    public static void main(String[] args) {
        Person a=new Person();  //会编译错误
        System.out.println(a.name);
        System.out.println(a.age);
    }
}
class Person{  
    private String  name;
    private int age;

    public Person(String name,int age){
        this.name=name;
        this.age=age;
    }
}
```

如果既要能使用带参数的构造方法，又想保留不带参数的构造方法，那么只能把两个构造方法都定义出来：

```java
public class HelloG {
    public static void main(String[] args) {
        Person a=new Person();  //不会编译错误
        System.out.println(a.name);
        System.out.println(a.age);
    }
}
class Person{  
    private String  name;
    private int age;

    public Person(String name,int age){
        this.name=name;
        this.age=age;
    }
    public Person() {
        
    }
}
```

#### 3、未初始化字段默认值

没有在构造方法中初始化字段时，引用类型的字段默认是`null`，数值类型的字段用**默认值**（可回看八大基本类型），`int`类型默认值是`0`，布尔类型默认值是`false`：

```java
public class HelloG {
    public static void main(String[] args) {
        Person a=new Person();  //会编译错误
        System.out.println(a.GetName());
        System.out.println(a.GetAge());
        System.out.println(a.GetSex());
    }
}
class Person{  //这里一定要加static非访问修饰符
    private String  name;
    private int age;
    private boolean Sex;
    public Person() {

    }
    public String GetName(){
        return this.name;
    }
    public int GetAge(){
        return this.age;
    }
    public boolean GetSex(){
        return this.Sex;
    }
}

/*结果为：
null
0
false
*/
```

#### 4、字段初始化顺序

如果创建字段的时候就初始化了，而且构造方法再初始化一遍，所以最终的值由构造方法的代码确定

```java
public class HelloB {
    public static void main(String[] args) {
        PersonB b=new PersonB(21,"Krystal");
        System.out.println(b.GetName());
        System.out.println(b.GetAge());
    }
}
class PersonB{
    private int age=21;
    private String name="Jimmy";
    public PersonB(int age,String name){
        this.age=age;
        this.name=name;
    }
    public int GetAge(){
        return this.age;
    }
    public String GetName(){
        return this.name;
    }
}
```

#### 5、多个构造方法（构造器的重载）

构造方法既然是个方法，则表明可以进行重载，编译器通过**参数数量、位置和类型**自动区分构造方法

```java
public class HelloB {
    public static void main(String[] args) {
        PersonB b=new PersonB(18);
        System.out.println(b.GetName());
        System.out.println(b.GetAge());
    }
}
class PersonB{
    private int age=21;
    private String name="Jimmy";
    //构造方法1
    public PersonB(int age,String name){
        this.age=age;
        this.name=name;
    }
    //构造方法2
    public PersonB(int age){
        this.age=age;
        this.name="Jimmy";
    }
    //构造方法3
    public PersonB(){

    }
    public int GetAge(){
        return this.age;
    }
    public String GetName(){
        return this.name;
    }

}
/*
输出结果为：
Jimmy
18
*/
```

#### 6、构造方法调用构造方法

一个构造方法可以调用其他构造方法，这样 做的目的是便于**代码复用**。调用其他构造方法的语法是`this(…)`：

```java
package test;

public class TestOne {
    private String name;
    private int sizeA;

    public TestOne(String name, int sizeA) {
        this.name = name;
        this.sizeA = sizeA;
    }

    public TestOne(String name) {
        this(name, 18);
    }

    public TestOne() {
        this("krystal", 18);
    }
    public String getName(){
        return this.name;
    }
    public int getSizeA(){
        return this.sizeA;
    }

}

class TestA {
    public static void main(String[] args) {
        TestOne a=new TestOne();
        System.out.println(a.getName()+" "+a.getSizeA());
    }
}
//运行结果为：krystal 18
```

## 继承（面向对象特征二）

Java使用`extends`关键字来实现继承

```Java
package test;

public class Person {
    private int age;
    private String name;
    public void fun1(){
        System.out.println(this.name+" "+this.age);
    }

    public int getAge() {
        return age;
    }
    public String getName(){
        return name;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public void setName(String name) {
        this.name = name;
    }
}
//下面让Student继承Person类
class Student extends Person{
    public static void main(String[] args) {
        Student a=new Student();
        a.setName("Jimmy");
        a.setAge(18);
        System.out.println(a.getName()+" : "+a.getAge());
        //我们可以看到，Student并没有自己创建name，age，但是从Person类继承过来了
    }
}
//执行结果为Jimmy : 18
```

在OOP（`object-oriented programming`面向对象编程）的术语中，我们把`Person`称为超类（super class），父类（parent class），基类（base class），把`Student`称为子类（subclass），扩展类（extended class）

##### 继承树

JAVA的**每一个类只允许拥有一个父类**，任何类，除了object，都会继承一个类。因此，除了object没有父类，Java中任何一个类有且只有一个父类。

![image-20200121231655209](java.assets/image-20200121231655209.png)



##### 在继承中使用protected

子类可以从父类继承属性和方法，但如果父类的属性和方法用`private`修饰时，则子类无法访问父类的东西，这就使得继承的作用被削弱了，如果想让子类可以访问父类，可以将父类中的`private`非访问修饰符改为`protected`。

- 案例：使用private，访问父类失败。

```Java
package test;

public class Person{
    private int age=10;
}
class Student extends Person{
    public void test(){
        System.out.println(age);
        //age此处会显示错误：age' has private access in 'test.Person'
    }
}
```

- 案例：使用protected，访问父类成功。

```Java
//----------------------方法1----------------------------
package test;

public class Person{
    protected int age=10;
}
class Student extends Person{
    public void test(){
        System.out.println(age);
    }
}
class RunTest{
    public static void main(String[] args) {
        Student a =new Student();
        a.test();
    }
}

//----------------------方法2----------------------------
/*
  注意上面是用public修饰的test() 方法来访问父类属性，
  如果使用static的main方法来访问，则需要new一个Person对象出来才行
 */
package test;

public class Person{
    protected int age=10;
}
class Student extends Person{
    public static void main(String[] args) {
        Person b=new Person();
        System.out.println(b.age);
    }
}

```

##### 在继承中使用super关键字

如果父类没有默认的构造方法，子类就必须显式调用`super()`并给出参数以便让编译器定位到父类的一个合适的构造方法。

```java
//详情请查看 super关键字 一级标题里的内容
```

这里还顺带引出了另一个问题：即**子类不会继承任何父类的构造方法**。子类默认的构造方法是编译器自动生成的，不是继承的。

##### 单继承与多继承

Java只支持单继承，多层继承，不允许多重继承。就是说，一个子类只能有一个父类。

<img src="java.assets/image-20200122052436685.png" alt="image-20200122052436685" style="zoom:67%;" />

多态

## java转型问题

- 基本数据类型的casting：

  - 自动类型转换：小的数据类型可以自动转换为大的数据类型，如：

    ```java 
    long a=20;
    double b=12.0f;
    ```

  - 强制类型转换：可以把大的数据类型转换成小的数据类型，如：

    ```java
    int c=(int)1200L;
    ```

- 对JAVA对象的类型转换（造型）

需要记住一句话：**允许父类引用指向子类对象，不允许子类引用指向父类对象**，因为子类功能比父类多，多的功能不能凭空变出来。**从子类到父类的类型转换可以自动进行，但是从父类到子类的类型转换必须通过（强制类型转换）实现，无继承关系的引用类型的转换是非法的。**

```Java
package test;

public class Father {
    public void run() {
        System.out.println("RunSlow");
    }
}

class Son extends Father {
    @Override
    public void run() {
        System.out.println("RunFast");
    }

    public void play() {
        System.out.println("play");
    }
}

class RunClass {
    public static void main(String[] args) {
        //下面演示向上转型，父类引用可以指向子类对象
        Son a = new Son();
        Father b = a; //会自动将new Son()对象的引用类型转型为Father类型
        b.run();
    /*程序在执行时分两个阶段：编译阶段 、运行阶段
    程序在编译阶段只知道b是Father类型，在运行时候才知道堆中的实际对象是Son类型。*/


        //-------------------------------------------

      //下面演示向下转型
//    Father c=new Father();
//    Son d =c; 此步会编译报错，因为子类引用不可以指向父类对象

//    Father c=new Father();
//    Son d =(Son)c; //编译时不会报错，但是运行时会报错，java.lang.ClassCastException: test.Father cannot be cast to test.Son，下面才是正确的做法：

        Father c = new Son();
        Son d = (Son) c; //强制将new Son()对象的引用类型转换为Son类型
        d.run();
    }
}

/*运行结果为
RunFast
RunFast*/
```

##### 向上转型

对象向上转型后，**对象会丢失除了与父类共有的属性和方法**，因为属性和方法是在编译时确定的，编译时为父类类型。	

```Java
package test;

public class Animal {
    public void eat() {
        System.out.println("eat");
    }
}

class dog extends Animal {
    public void run() {
        System.out.println("run");
    }
}

class RunClass {
    public static void doEat(Animal x) {
        x.eat();
    }

    public static void main(String[] args) {
        Animal a = new dog();
        a.eat();
        a.run(); //此步会报错，run()方法已经丢失
        
        Animal b = new Animal();
        dog c = new dog();
        RunClass.doEat(b);
        RunClass.doEat(c);//此步存在向上转型，因为doEat()需要的是Animal类的实例对象
    }
}
```

从上面案例可以知道，**向上转型的其中一个作用**就是用在方法的参数传递上，`doEat()`方法以父类为参数，调用时即使传来不同的子类，也不需要创建多个不同的方法，可以对其进行向上转型，使得代码变得简洁。

###### 静态绑定与动态绑定

```Java
package test;

public class Human {
    public void sing(){
        System.out.println("我唱歌不怎么好听");
    }
}
class Singer extends Human{
    @Override
    public void sing() {
        System.out.println("我唱歌超级好听");
    }
}
class RunT{
    public static void main(String[] args) {
        Singer a= new Singer();
        Human b=a;
        b.sing();
        /*
        在编译阶段，b绑定的是Human类型中定义的sing()方法(静态绑定，也叫做编译器绑定)
        在运行阶段，堆中的对象实际上是Singer类型，而Sing类型已经重写了sing()方法。
        所以程序在运行阶段，对象绑定的方法是Singer类型中的sing()方法（动态绑定，也叫做运行期绑定）
        
        --这种现象只是针对方法来说，属性没有这种现象，即使子类里定义了与父类完全相同的实例变量，
        这个实例变量依然不能覆盖父类中定义的实例变量--
        */
    }
}

/*运行结果为:
我唱歌超级好听*/ 
```

##### 向下转型	

向上转型时会遗失除与父类对象共有的其他方法；可以用向下转型在重新转回，这个和向上转型的作用要结合理解。	

```java
package test;

public class Father {
    public void run() {
        System.out.println("RunSlow");
    }
}
class Son extends Father {
    @Override
    public void run() {
        System.out.println("RunFast");
    }

    public void play() {
        System.out.println("play");
    }
}
class RunClass {
    public static void main(String[] args) {
        Father c = new Son();
//        c.play(); 此步编译阶段即报错
        Son d = (Son) c;
        d.play();//此步成功运行
    }
}
```



## 方法的重写（overwrite）

子类定义了一个与父类方法**名称相同，参数类型相同，返回值相同**的方法，被称为重写`override`

> 方法签名：方法名称+参数类型列表

```java
public class Father {
    public void run() {
        System.out.println("RunSlow");
    }
}
class Son extends Father {
    @Override  //输入@，选定override回车，选择指定方法即可快速创建重写方法，@verride不是必需的
    public void run() { //可见名称、参数类型、返回值都和父类相同
        System.out.println("RunFast");
    }
}
```

## 多态性（面向对象特征三）

多态性在Java中有三种体现：

- 方法的重载overload
- 方法的重写override
- 对象的多态性——主要应用在抽象类和接口上

> 对象的多态性：Java引用变量有两个类型，编译时类型，运行时类型。编译时类型有声明该变量时使用的类型决定，运行时类型由实际赋给该变量的对象决定。**如果编译时类型和运行时类型不一致，就出现了多态。**

多态是指，针对某个类型的方法调用，其真正执行的方法取决于运行时期实际类型的方法。

多态的特性就是，运行期才能动态决定调用的子类方法。对某个类型调用某个方法，执行的实际方法可能是某个子类的覆写方法。这种不确定性的方法调用，究竟有什么作用？

- 案例1：输出对不同明星的爱

```Java
package test;

class PrintA{
    public void fun(){
        System.out.println("I love you");
    }
}
class James extends PrintA{
    @Override
    public void fun(){
        System.out.println("I love you James.");
    }
}
class Kobe extends PrintA{
    @Override
    public void fun(){
        System.out.println("I love you Kobe.");
    }
}

public class Iloveyou{
    public static void printName(PrintA b){ //
        b.fun();
    }
    public static void main(String[] args) {
        printName(new Kobe());
    }
}

//运行结果为：I love you kobe.
```

- 案例2：对于收入，收税0.1%，对于工作薪资，收税`(x-5000)*0.2`,对于享受国家优惠的，收税0。计算给出的几个人不同税的总和。

```Java
package test;

class IncomeTax { //对于收入
    protected double income;

    public IncomeTax(double income) {
        this.income = income;
    }

    public double tax() {
        return this.income * 0.1;
    }
}

class SalaryTax extends IncomeTax { //对于工作薪资
    public SalaryTax(double income) {
        super(income);
    }

    @Override
    public double tax() {
        return (this.income - 5000) * 0.2;
    }
}

class SpecialTax extends IncomeTax {//对于享受国家优惠的特殊人群收入
    public SpecialTax(double income) {
        super(income);
    }

    @Override
    public double tax() {
        return 0;
    }
}

public class MainClass {  //运行类
    public static void main(String[] args) {
        IncomeTax[] a = new IncomeTax[]{new IncomeTax(4000), new IncomeTax(34500),
                new SalaryTax(9000), new SpecialTax(454564)};
        System.out.println(totalTax(a));

    }
    public static double totalTax (IncomeTax...b){
        double total = 0;
        for (IncomeTax it:b){
            total=total+it.tax();
        }
        return total;
    }
}

//运行结果为4650.0
/*
利用多态，totalTax()方法只需要和IncomeTax打交道，它完全不需要知道SalaryTax和SpercialTax的存在，就可以正确计算出总的税。如果我们要新增一种稿费收入，只需要从IncomeTax派生，然后正确重写Tax()方法就可以。把新的类型传入totalTax()，不需要修改任何代码。
*/
```

## 抽象类

当父类的方法实现没有意义时，通常用`abstract`将方法修饰为抽象方法，如`Animal`父类的`run()`方法，把该方法体写出来是没有意义的（动物的跑的方式不能确定）。因为抽象方法的存在，也要将类用`abstract`修饰，这样的类称为抽象类。

- 含有抽象方法的类必须被声明为抽象类

  ```Java
  public class Test01 {
      public abstract void run();
      //报错：Abstract method in non-abstract class，表示抽象方法不在抽象类内
  }
  
  public abstract class Test01 {
      public abstract void run(){};// 此处不能有花括号
      //报错：Abstract methods cannot have a body，表示抽象方法不能有方法体
  }
  
  //----------------正确的做法在下面-----------------------------
  public abstract class Test01 {
      public abstract void run();
  }
  ```

- 抽象类不能被实例化。**抽象类是用来被继承的**，抽象类的子类必须重写父类的抽象方法，并提供方法体。若没有**重写全部**的抽象方法，则要声明为抽象类。

  ```Java
  package day01;
  
  public abstract class Test01{
      public abstract void move();
      public abstract void eat();
  }
  class Dog extends Test01{
      @Override
      public void move() {
          System.out.println("狗的移动方式是跑");
      }
  
      @Override
      public void eat() {
          System.out.println("狗的吃东西的方式是舔");
      }
      //如果不重写实现从父类继承来的方法会报错：
      // Class 'Dog' must either be declared abstract or implement abstract method 'move()' in 'Test01'
      //必须重写所有全部的抽象方法，如果不重写全部抽象方法，必须将当前类声明为抽象类,如下面的hicken类。
  }
  abstract class Chicken extends Test01{
      @Override
      public void eat() {
          System.out.println("小鸡吃东西的方式是啄");
      }
      //可以看到抽象类可以继承抽象类，被声明为抽象类的子类不必重写全部父类抽象方法。
  }
  class MainClass{
      public static void main(String[] args) {
          Test01 a=new Test01() {
              @Override
              public void move() {
                  System.out.println("true");
              }
  
              @Override
              public void eat() {
                  System.out.println("emmm");
              }
          };//如果要实例化，必须按照此方法重写所有抽象方法
          a.eat();//输出emmm
      }
  }
  ```

- 不能用`abstract`修饰属性、私有方法、构造器、静态方法、`final`方法或`final`类

  ```Java
  package day01;
  
  public abstract class Test01{
      private int a;
  
      public abstract int a=10;
      //会报错：Modifier 'abstract' not allowed here
      private abstract void fun1(){
          //报错：Illegal combination of modifiers: 'abstract' and 'private'
      }
      public abstract Test01(){
          //报错：Modifier 'abstract' not allowed here
      }
  }
  ```

  



## 接口

接口`（interface）`是一种特殊的类，是**抽象方法和常量值的定义的集合**，没有变量和方法的实现。

接口中的所有成员变量都默认是`public static final`修饰的，所有方法都默认是`public abstract`修饰的，跟抽象类一样，接口没有构造器。

```Java
package day01;

public interface Test01{ //注意这里不是class是interface
    int a=10;//等同于public static final int a=10;
    void run();//等同于public abstract void run();
    public Test01(){};//报错：Interface abstract methods cannot have body
}
class MainClass{
    public static void main(String[] args) {
        System.out.println(Test01.a);
        //可以看到，不需要new一个对象出来即可访问a,Test01接口中的a确实被static修饰了
    }
}
```

用一个具体的类实现接口，使用`implements`关键字，且该类需实现继承的接口的所有抽象方法。如果实现接口的类中没有实现接口中的全部方法，必须将此类定义为抽象类。

```Java
package day01;

public interface Test01{
    int a=10;//等同于public static final int a=10;
    void run();//等同于public abstract void run();
    //public Test01(){};//报错：Interface abstract methods cannot have body
}
class P implements Test01{
    @Override
    public void run() {
        System.out.println("实现继承的接口的抽象方法");
    }
}
```

在Java中，一个类不可以继承自多个类，但是一个类可以实现多个接口。

```Java
package day01;

public interface Test01{ //接口1
    int a=10;
    void run();
}
interface Test02{ //接口2
    void eat();
}
class P implements Test01,Test02{ //可以看到这里实现了两个接口
    @Override
    public void run() {
        System.out.println("实现继承的接口Test01的抽象方法");
    }

    @Override
    public void eat() {
        System.out.println("实现继承的接口Test02的抽象方法");
    }
}
class MainClass{
    public static void main(String[] args) {
        System.out.println(P.a);
        P b=new P();
        b.eat();
        b.run();
    }
}
/*运行结果为：
10
实现继承的接口Test02的抽象方法
实现继承的接口Test01的抽象方法
*/
```

接口可以继承接口，用于接口的扩展。

```Java
package day01;

public interface Test01{
    void run();
}
interface TS extends Test01{ //接口TS继承接口Test01
    void eat();
}
class Demo implements TS{ //可以看到类Demo实现接口TS时，要同时重写抽象方法eat(),run()
    @Override
    public void run() {}
    @Override
    public void eat() {}
}
```

如果一个类既继承类，又实现接口，则需要先继承后实现，更改顺序会报错。

```Java
package day01;

public interface Test01{
    void run();
}
interface Test02{
    void eat();
}
class Father{
    public void fun(){
        System.out.println("父类方法");
    }
}
class Son extends Father implements Test01,Test02{ //先继承后实现，更改顺序会编译报错
    @Override
    public void run() {
        System.out.println("儿子跑步很慢");
    }

    @Override
    public void eat() {
        System.out.println("儿子吃饭用筷子很厉害");
    }
}
class RunClass{
    public static void main(String[] args) {
        Son s=new Son();
        s.eat();
        s.run();
        s.fun();
    }
}
/*运行结果为：
儿子吃饭用筷子很厉害
儿子跑步很慢
父类方法
*/
```

抽象类中可以有普通的方法，不一定是抽象方法，而在接口中，方法类型只支持**抽象方法和`default`方法**。`default`方法的目的是要给接口新增一个新方法时，如果新增的是`default`方法，那么子类就不需要全部重写修改。

```Java
public interface Test01{
    default void fun(){
        System.out.println("这是一个接口里面的default方法");
    }
    void sing();
}
```

抽象类和接口这么像，为什么使用接口？接口是一种规范，软件开发大多是一种协作性工作，接口在开发过程可以快速分离工作内容。

想想，如果想要给一个已经被继承过的抽象类添加抽象方法，则需要让其所有子类重写其新增的抽象方法。相对于在抽象类中新增抽象方法，**新建接口**然后谁需要谁就实现会更方便，。如下：

```Java
package day01;

interface Sing{  //唱歌接口
    void sing();
}
interface Dance{ //跳舞接口
    void dance();
}
interface Basketball{ //篮球接口
    void basketball();
}
interface Rap{ //rap接口
    void rap();
}
class CaiXunKun implements Sing,Dance{ //可以看到，通过建立多个接口，如果有需要时再实现就可以了
    @Override
    public void sing() {
        System.out.println("蔡徐坤唱歌");
    }

    @Override
    public void dance() {
        System.out.println("蔡徐坤跳舞");
    }
}
```

接口也具有多态性，支持向上转型。

```Java
package day01;

interface If01 {
    void emm();
}
interface If02{
    void aaa();
}
class Ok implements If01,If02{
    @Override
    public void emm() {
        System.out.println("emmmmm");
    }

    @Override
    public void aaa() {
        System.out.println("aaaaaaa");
    }
}
public class Test01{
    public static void main(String[] args) {
        If01 g=new Ok();
        g.emm(); //此行不报错
        //g.aaa();此行报错，已经向上转型，g不具有aaa()方法
    }
}
```

## 内部类

一个定义在另一个类里面的类称为内部类。内部类可以分为四种形式：成员内部类，

#### 成员内部类

###### 内部调用外部的属性和方法

成员内部类可以无条件访问外部类的所有成员属性和方法。

其他类(例子中的RunC类)访问一个内部类的形式有三种：

1. Outter.Inner outin=new Outter().new Inner();

2. Outter out=new Outter();
   Outter.Inner in=out.new Inner();

3. public Inner getInnerInstance(){return Inner};

   Outter out=new Outter();

   Outter.Inner in=out.getInnerInstance();

```java
public class Outter {
    private String name = "Krystal";
    private int age = 20;
    private Inner innerInit=null;

    public void outterFun(){
        System.out.println("外部类的方法");
    }
    
    public Inner getInnerInstance(){
        if(innerInit==null){
            innerInit=new Inner();
            return innerInit;
        }else{
            return innerInit;
        }
    }
    class Inner {
        void fun() {
            //内部类无条件访问外部类的所有成员属性和方法，不需要声明
            outterFun();
            System.out.println(name);
            System.out.println(age);
        }
    }
}

class RunC {
    public static void main(String[] args) {
        //第一种方式：
        Outter.Inner outin=new Outter().new Inner();
        outin.fun();
//        //第二种方式:
//        Outter out=new Outter();
//        Outter.Inner in=out.new Inner();
//        in.fun();
//        //第三种方式：
//        Outter out=new Outter();
//        Outter.Inner in=out.getInnerInstance();
//        in.fun();
    }
}

/*运行结果为:
外部类的方法
Krystal
20
*/
```

###### 外部调用内部的属性和方法

成员内部类可以无条件访问外部类的所有成员属性和方法，但是外部想访问内部就没那么简单了。首先要创建一个成员内部类的对象，然后通过该对象访问。

其他类(例子中的RunC类)访问一个外部类的方式跟平时一样，正常调用即可。

```java
public class Outter {
    Inner in=new Inner();
    void outterFun(){
        System.out.println(in.salary);
        in.innerFun();
    }
    class Inner {
        public void innerFun() {
            System.out.println("内部类的方法");
        }
        private long salary=25000;
    }
}

class RunC {
    public static void main(String[] args) {
        Outter ot=new Outter();
        ot.outterFun();
    }
}
/*运行结果为:
25000
内部类的方法
*/
```

#### 局部内部类

局部内部类是定义在一个方法内或者一个作用域内的类。局部内部类的访问权限仅限于方法内或者作用域内。

```java
class Outter{
    private String name="krystal";
    public void outterFun(){
        class Woman{
            int age=18;
        }
        //方法内定义的局部内部类的成员属性和方法只能在该方法内使用
        System.out.println(new Woman().age);
    }

    //Woman w=new Woman();--->编译报错
}
class RunC{
    public static void main(String[] args) {
        Outter out=new Outter();
        out.outterFun();
    }
}
//运行结果: 18
```

#### 匿名内部类（常用）

首先来了解以下什么叫做匿名类，匿名类就是没有名称的类，匿名类的名称由java的编译器给出，格式形如：外部类名称+$匿名类顺序。

既然匿名类没有名称，没有名称就不能被其它地方引用，不能被实例化，所以匿名类只能用一次，也不能由构造器。

匿名类可以继承父类的方法，也可以重写父类的方法。

**匿名类必须继承一个父类或者实现一个接口**。创建语法格式如下：

```java
new 父类构造器（实参列表) | 实现接口()
{
      //匿名内部类的类体部分
}
```

匿名类可以访问外部类的成员属性和方法，匿名类的类体不可以声明static变量或static方法。

了解了匿名类之后，那么放在一个类内部的匿名类就是匿名内部类。

**案例1：通过继承实体类创建匿名内部类**

```java
class Outter{
    public String name="krystal";
    void show(){
        System.out.println("我叫"+name);
    }
}
class RunC{
    public static void main(String[] args) {
        //通过实体类创建匿名内部类，相当于创建一个该类的子对象
        Outter out=new Outter(){
            //匿名内部类可以重写父类的方法：
            @Override
            void show() {
                System.out.println("我叫Jimmy");
            }
        };
        out.show();
        //匿名内部类可以继承父类的属性和方法:
        System.out.println(out.name); 
        //查看编译器分配给匿名内部类的名称
        System.out.println(out.getClass());
    }
}
/*运行结果为：
我叫Jimmy
krystal
class RunC$1
*/
```

**案例2：通过实现接口创建匿名内部类**

```java
interface OutF{
    public double getPrice();
    public String getName();

}
class RunC{
    public static void main(String[] args) {
        OutF oF=new OutF() {
            @Override
            public double getPrice() {
                return 153.45;
            }

            @Override
            public String getName() {
                return "shit";
            }
        };
        System.out.println(oF.getName());
        System.out.println(oF.getPrice());
        System.out.println(oF.getClass());
    }
}
/*运行结果为：
shit
153.45
class RunC$1
*/
```

#### 静态内部类

静态内部类是定义在一个类内且加了static关键字的类。**静态内部类不能访问外部类的非静态成员变量和方法**，因为外部类的非static成员必须通过具体的对象来访问，如果静态内部类可以访问非static的外部类成员，就破坏了这一原则。

```java
class staClass{
    private String cls_id;
    static class Innersta{
        void fun(){
            // System.out.println(cls_id); 
            // 报错Non-static field 'cls_id' cannot be referenced from a static context
        }
    }
}
```



## classpath和jar包

##### classpath(很少设置，一般默认)

`classpath`是`JVM`用到的一个环境变量，它用来指示`JVM`如何搜索`class`。所以，`classpath`就是一组目录的集合，它**设置的搜索路径与操作系统相关**。

在windows系统中，可能长这样，分隔符为`";"`     ：

```
C:\work\project1\bin;C:\shared;"D:\My Documents\project1\bin"  
```

在Linux系统中，可能长这样，分隔符为`":" `   ：

```
/usr/shared:/usr/local/bin:/home/liaoxuefeng/bin
```

强烈*不推荐*在系统环境变量中设置`classpath`，那样会污染整个系统环境。在启动JVM时设置`classpath`才是推荐的做法。实际上就是给`java`命令传入`-classpath`或`-cp`参数：

```
java -classpath .;C:\work\project1\bin;C:\shared abc.xyz.Hello
```

或者使用`-cp`的简写：

```
java -cp .;C:\work\project1\bin;C:\shared abc.xyz.Hello
```

`.`代表当前目录。如果JVM在某个路径下找到了对应的`class`文件，就不再往后继续搜索。如果所有路径下都没有找到，就报错。

没有设置系统环境变量，也没有传入`-cp`参数，那么JVM默认的`classpath`为`.`，即当前目录：

```
java abc.xyz.Hello
```

**不要把任何Java核心库添加到classpath中！JVM根本不依赖classpath加载核心库！**

**更好的做法是，不要设置`classpath`！默认的当前目录`.`对于绝大多数情况都够用了**

##### jar包

如果一个项目有很多个`.class文件`，且存放在不同的目录下，管理起来很不方便，如果能够将众多目录打包成一个文件，就方便多了，如下图：

<img  src="java.assets/image-20200130035200731.png" style="zoom: 67%;" />

jar包实际上是一个zip格式的压缩文件，相当于windows系统里普通的文件打包。如果将jar包后缀名改为`.zip`,则可在windows里查看jar的内容。

<img src='java.assets/image-20200130035556755.png' align='left' style='border:2px black solid'/>

jar包 包含一个特殊的`/META-INF/MANIFEST.MF`文件，`MANIFEST.MF`是纯文本，可以指定`Main-Class`和其它信息。JVM会自动读取这个`MANIFEST.MF`文件，如果存在`Main-Class`，我们就不必在命令行指定启动的类名，而是用更方便的命令,如下：

```Java
java -jar hello.jar //没有指定启动的类，因为存在Main-Class
```

在大型项目中，不可能手动编写`MANIFEST.MF`文件，再手动创建zip包。Java社区提供了大量的开源构建工具，例如==Maven==，可以非常方便地创建jar包。

## 异常处理

##### Java异常介绍

Java在程序执行过程中的不正常情况称为异常。捕获错误最理想时间是编译时候，但是有些错误在运行时才会报错。

Java程序运行过程中的异常主要分为两大类：

1. `Error`:JVM系统内部错误、资源耗尽等情况。（程序员只能处理Exception，对Error无能为力。）
2. `Exception`：编程错误等一般问题，如空指针访问、读取不存在的文件。。。

- 异常案例1：数组越界异常

```Java
public class Test01{
    public static int [] intarr={2,3,5};
    public static void main(String[] args) {
        for (int i = 0; i < 4; i++) { // i循环了0，1，2，3，但是数组长度只有3
            System.out.println(intarr[i]);
        }
    }
}
/*
编译时不报错，运行报错：Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: 3 
*/
```

- 异常案例2：空指针访问异常

```Java
class Tennis{
    public int i=0;
}
public class Test01{
    public static void main(String[] args) {
        Tennis a=null; //a没有指向任何东西
        System.out.println(a.i); 
        //编译时不会报错，运行时报错：
        //Exception in thread "main" java.lang.NullPointerException
    }
}
```

- 异常案例3：分母为0异常

```Java
public class Test01{
    public static int i=0;
    public static void main(String[] args) {
        float a=3/i;
    }
}
/*编译时不会报错，运行时报错：
Exception in thread "main" java.lang.ArithmeticException: / by zero
*/
```

##### Java异常类的层级

![image-20200201032947712](java.assets/image-20200201032947712.png)

> 运行异常是运行才能发现的异常，是我们的常见异常，上面举的3个例子都是运行异常。

##### 异常处理机制

Java异常处理：抓抛模型（捕获或者抛出）。

####### 捕获异常:

Java通过`try...catch...finally`捕获异常，语法格式如下：

```Java
try{
	//可能产生异常的代码
}catch (ExceptionName1 e1){ //catch可以有多个
	// 当产生ExceptionName1异常时执行措施
}catch (ExceptionName2 e2){
	// 当产生ExceptionName2异常时执行措施
}finally { //finally部分可写可不写
	//无条件执行语句，无论有没有异常都执行
}
```

案例1：

```Java
/**
 * 通过try...catch来捕获处理：
 * try{
 *     
 * }catch(){
 *     
 * }
 */
public class Test01{
    public static int i=0;
    public static void main(String[] args) {
        //用try花括号括住可能出错的代码
        try{   
            System.out.println(4/i); 
        }catch (Exception e){  //不知道捕获什么异常类时，可以使用异常的父类Exception
            System.out.println(e.getMessage()); //这行代码可以查看捕获的异常是什么
            e.printStackTrace();  //这行代码也可以查看捕获的异常是什么(打印方法调用栈)
            //catch(){}花括号里面可以不写任何内容
        }
        System.out.println("Kobe,this is for you");//这行不受上面是否报异常的影响，
    }
}
//运行结果为：Kobe,this is for you
```

案例2：

```Java
public class Test01{
    public static void main(String[] args) {
        String a=null;
        try{
            System.out.println(3/0);
            System.out.println(a.toString());
        }catch (java.lang.NullPointerException e1){
            System.out.println("捕获到了java.lang.NullPointerException异常");
        }catch (java.lang.ArithmeticException e2){
            System.out.println("捕获到了java.lang.ArithmeticException异常");
        }finally {
            System.out.println("emm");
        }
    }
}
/*运行结果为：
捕获到了java.lang.ArithmeticException异常
emm
*/
/*
从运行输出结果可知，程序并没有把两个异常都捕获到了，只捕获到了3/0产生的ArithmeticException异常，
这是因为捕获异常本身的目的就是为了防止程序出现异常，如果try{}花括号里面前面的内容出现异常，就不会执行后面的内容了，所以没有捕获到a.toString()的空指针异常。
*/
```

####### 抛出异常：

使用方式：`throws+try...catch`

案例1：

```java
package day01;

public class Test01 {
    public static void main(String[] args) {
        Flower a=new Flower();
        //调用fun1()时进行捕获异常：
        try{  
            a.fun1();
        }catch (Exception e){
            e.printStackTrace();
        }
    }
}
class Flower{
    void fun1() throws Exception{  //已经知道会报错，抛出异常
        System.out.println(34/0);
    }
}
```

**如果有抛出，某个上层调用就要有捕获处理**。抛出异常，是当前方法不处理异常，但是把异常往上层的调用栈传递，由上层选择捕获异常进行处理，还是选择继续往更上层抛出。如果main()方法抛出异常，异常交由虚拟机JVM处理。

案例2：

```Java
package day01;

class Flower{
    static void fun1() throws Exception{  //异常从这里开始被抛出
        System.out.println(34/0);
    }
}
class Bee{
    static void fun2() throws Exception{  //fun1()被调用，但是异常没有被捕获处理，继续抛出
        Flower.fun1();
    }
}
public class Test01 {
    public static void main(String[] args) { //fun2()被调用，异常被捕获处理
        try{
            Bee.fun2();
        }catch (Exception e){
            e.printStackTrace();
        }
    }
}
/*运行结果为：
java.lang.ArithmeticException: / by zero
	at day01.Flower.fun1(Test01.java:5)
	at day01.Bee.fun2(Test01.java:10)
	at day01.Test01.main(Test01.java:16)
*/
/*
Main调用fun2(),fun2()调用fun1()
printStackTrace()打印出了方法的调用栈，并给出了源代码的行号。
*/
```

案例3：如果异常被捕获并且继续抛出不同类型的异常（异常类型转换了），会发生什么？

```Java
package day01;

class Vege{
    static void fun1(String s){
        if(s==null){
            throw new NullPointerException();
        }else {
            System.out.println(s);
        }
    }
}
class Ora{
    static void fun2(){
        try{
            Vege.fun1(null);
        }catch (NullPointerException e1){
            throw new IllegalArgumentException();
        }
    }
}
class Test01{
    public static void main(String[] args) {
        try {
            Ora.fun2();
        }catch (IllegalArgumentException e2){
            e2.printStackTrace();
        }
    }
}
/*运行结果为：
java.util.NoSuchElementException
	at day01.Ora.fun2(Test01.java:22)
	at day01.Test01.main(Test01.java:29)
*/
/*
从运行结果可以看到，看不到原始的空指针异常的信息了，如果想要查看完整异常栈，需要添加参数，将本源代码的
第18行的throw new IllegalArgumentException();
改成throw new IllegalArgumentException(e1);
*/
```

在Java中已经可以捕获异常了，为什么还要抛出异常再进行捕获，这种机制有什么作用？个人目前理解是，为了使已经知道可能出现异常的方法继续用下去，把抓到的异常抛出给调用者，让调用者来处理。

####### 异常的屏蔽：

```Java
package day01;

class Police{
    public static void main(String[] args) {
        try{
            System.out.println(4/0);
        }catch (Exception e1){
            throw new RuntimeException(e1);
        }finally {
            
        }
    }
}
/*此处进行了异常转型，运行结果为：
Exception in thread "main" java.lang.IllegalArgumentException
	at day01.Police.main(Test01.java:10)
*/

//----------------------如果finally也抛出异常：---------------
package day01;

class Police{
    public static void main(String[] args) {
        try{
            System.out.println(4/0);
        }catch (Exception e1){
            throw new RuntimeException(e1);
        }finally {
            throw new IllegalArgumentException();
        }
    }
}
/*运行结果为：
Exception in thread "main" java.lang.IllegalArgumentException
	at day01.Police.main(Test01.java:10)
*/

//从上面两段源代码运行结果可以知道，如果catch和finally同时准备抛出异常，catch的异常会被屏蔽不抛出
```

## 集合

Java集合类存放于`Java.util`包中，**是一个用来存放对象的容器**。

- 集合只能用来存放对象。如果存放一个`int`整型数据进入集合中，会自动将int转换成`Integer`包装类。
- 集合存放的是多个对象的引用，对象本身存放在堆内存中。
- 集合可以存放不同类型，不同数量的数据类型。`jdk5`之后，Java提供了泛型，可以限制集合中的数据类型。

> 数组其实是一种特殊的集合，**为什么还要有集合呢**？
>
> 这是因为数组有如下限制：
>
> - 数组初始化后大小不可变；
> - 数组只能按索引顺序存取。
>
> 因此，我们需要各种不同类型的集合类来处理不同的数据，例如：
>
> - 可变大小的顺序链表；
> - 保证无重复元素的集合；
> - ...

Java集合主要分为三大体系：

1. `Set`:无序、不可重复的集合
2. `List`：有序，可重复的集合
3. `Map`:具有映射关系的集合(`key-value`)

### Set

#### HashSet类

`HashSet`是`Set`接口的实现类。`HashSet`按照Hash算法来存储集合中的元素，因此具有很好的存储和查找性能。

`HashSet`特点：

- 不能保证元素的排序：存入一个对象时会调用该对象的`hashCode()`方法得到`hashCode`值，再根据`hashCode`值决定元素存储位置。
- 不可重复：不可重复的意思是`hashCode`不能相同。
- `HashSet`不是线程安全的。
- 集合元素可以是`null`。

![image-20200207021844006](java.assets/image-20200207021844006.png)

案例1：

```Java
package day01;

import java.util.HashSet;
import java.util.Set;

public class DayB {
    public static void main(String[] args) {
        Set sa= new HashSet();
        //添加元素
        sa.add("I love you");
        sa.add(34);
        System.out.println(sa); //[34, I love you]
        //判断是否包含元素
        System.out.println(sa.contains(34)); //true
        //移除元素
        sa.remove(34);
        System.out.println(sa); //[I love you]
        //获取集合中元素个数：
        System.out.println(sa.size());//1
        //清空元素
        sa.clear();
        System.out.println(sa); //[]
    }
}
```

案例2：遍历集合

```Java
package day01;

import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

public class DayB {
    public static void main(String[] args) {
        Set sb= new HashSet();
        sb.add("a");
        sb.add("b");
        sb.add("c");
        //使用迭代器遍历：
        Iterator it=sb.iterator();
        while(it.hasNext()){
            System.out.println(it.next());
        }
        //使用For each循环遍历：
        for(Object a:sb){
            System.out.println(a);
        }
    }
}
```

> **补充知识点(迭代器)**：
>
> ​	迭代器是一种设计模式，它**是一个对象**，它可以遍历并选择序列中的对象。使用方法`iterator()`可要求容器（集合等）返回一个`Iterator`。`iterator()`方法是`java.lang.Iterable`接口,被`Collection`继承。
>
> ​	`Iterator`接口主要用于遍历`Collection`集合中的元素，`Iterator对象`称为迭代器。
>
> - ​	使用`Iterator`的`next()`可获得序列中的下一个元素。第一次调用`next()`方法时，它返回序列的第一个元素。
>
> - ​	使用`Iterator`的`hasNext()`可检查序列中是否还有元素。
> - ​    使用`remove()`将迭代器新返回的元素删除。

案例3：**泛型-**--将集合设置为只能存放某类型对象

```Java
package day01;

import java.util.HashSet;
import java.util.Set;

public class DayB {
    public static void main(String[] args) {
        Set <String>sc= new HashSet<String>();
        sc.add("Hello");
        sc.add(24);  //编译会报错，只能存放字符串类型对象
        
        Set sd=new HashSet();//相当于: Set<Object>sd=new HashSet<>();
    }
}
//后面会详细将泛型
```

#### TreeSet类

![image-20200207024713417](java.assets/image-20200207024713417.png)

`TreeSet`是`SortedSet`接口的实现类：

- `HashSet`是无序的，因为它实现了`Set`接口，并没有实现`SortedSet`接口

- `TreeSet`是有序的，因为它实现了`SortedSet`接口。

`TreeSet`支持两种排序：自然排序（默认采用）和定制排序

- 自然排序：`TreeSet`会**调用集合元素的CompareTo(Object obj)**方法比较元素间大小关系，并将集合元素按升序排序。 `TreeSet`集合里，建议必须放入同样类型的对象（因为默认会进行排序），否则可能发生类型转换异常，可以**通过泛型进行限制**。
- 定制排序：若定制排序，需要存放到集合中的对象对应的类实现`Comparator`接口，并重写`int Compare()`方法。

案例1：自然排序

```Java
package day01;

import java.util.Set;
import java.util.TreeSet;

public class DayB {
    public static void main(String[] args) {
        Set <Integer>sg= new TreeSet<Integer>();
        sg.add(234);
        sg.add(7);
        sg.add(34);
        for (Integer a:sg){
            System.out.println(a);
        }
    }
}
/*运行结果为：
7
34
234
*/
```

案例2：定制排序----将`Person`类的对象存到集合中，并按照对象的`age`值来进行排序。

```Java
package day01;

import java.util.Comparator;
import java.util.Set;
import java.util.TreeSet;

public class DayB {  //运行类
    public static void main(String[] args) {
        Set<Person> sk=new TreeSet<Person>(new Person());  //这里的泛型限制一定要加上,并且要将Person对象作为参数
        Person p1=new Person("krystal",20);
        Person p2=new Person("Jimmy",21);
        Person p3=new Person("anna",14);
        Person p4=new Person("bob",63);
        sk.add(p1);
        sk.add(p2);
        sk.add(p3);
        sk.add(p4);
        for(Person a:sk){
            System.out.println(a.getName()+" : "+a.getAge());
        }

    }
}
class Person implements Comparator<Person>{ //这里一定要加上泛型限制，不然报错
    private int age;
    private String name;
    public Person(){

    }
    public Person(String name,int age){
        this.name=name;
        this.age=age;
    }

    public int getAge() {
        return age;
    }

    public String getName() {
        return name;
    }

    @Override
    public int compare(Person o1, Person o2) { //注意这里的参数要是Person类
        if(o1.getAge() > o2.getAge()){ //将>和<调换即可反向排序
            return 1;
        }else if(o1.getAge()<o2.getAge()){
            return -1;
        }else {
            return 0;
        }
    }
}
/*运行结果为：
anna : 14
krystal : 20
Jimmy : 21
bob : 63
*/
```

### List

#### ArrayList类

![image-20200207034954800](java.assets/image-20200207034954800.png)

`ArrayList`是`List`接口的实现类。`ArrayList`是线程不安全的。

- `List`是有序可重复的集合，集合中的元素都有对应的索引。
- `List`可以通过索引来访问集合指定位置的元素
- `List`将元素添加顺序设置为默认索引
- `List`添加了一些通过索引操作集合的方法，如上图

`Vector`（线程安全）也是`List`接口的实现类，虽然是线程安全的，但是比较古老了，不推荐使用。

**案例1**

```java
import java.util.ArrayList;
import java.util.List;

public class DayB{
    public static void main(String[] args) {
        List<Integer> la=new ArrayList<Integer>();
        la.add(3);  //索引下标为0
        la.add(53); //索引下标为1
        la.add(21); //索引下标为2
        System.out.println(la);
        System.out.println(la.get(2)); //访问索引为2的元素

        la.add(2,44); //在索引为2的位置添加元素44
        System.out.println(la);

        List lb=new ArrayList();
        lb.add(99);
        lb.add(100);
        la.addAll(2,lb); //在索引位置添加另一个List集合
        System.out.println(la);

        la.add(99);
        System.out.println(la);
        System.out.println(la.indexOf(99)); //查看元素第一次出现的索引
        System.out.println(la.lastIndexOf(99));  //查看元素最后一次出现的索引

        la.remove(4);//移除索引4对应的元素
        la.set(2,1024); //将索引为2的元素的值改为1024

        List subl=la.subList(1,4);
        //将1到3索引的元素作为子集subl,sublist()的作用是返回一个子集对象,左闭右开
        System.out.println(subl);
    }
}
```

### Map

#### HashMap类

![image-20200207042314773](java.assets/image-20200207042314773.png)

HashMap是Map接口的实现类，Map接口比较特别，它并没有去继承Collection接口。

- Map保存映射关系数据（key-value)
- Map中的Key不允许重复

案例1：常用方法

```Java
package day01;

import java.util.HashMap;
import java.util.Map;

public class DayB{
    public static void main(String[] args) {
        Map mp=new HashMap();
        mp.put("krystal",20); //添加元素
        mp.put("Jimmy",21);
        System.out.println(mp);

        Map<String,Integer> mp2=new HashMap<String,Integer>(); //给Map设置泛型
        mp2.put("kobe",41);
        mp2.put("gigi",13);
        mp2.put("James",35);
        mp2.remove("James"); //根据Key移除元素
        System.out.println(mp2.size()); //返回map集合的长度
        System.out.println(mp2.containsKey("kobe"));//判断是否包含某key
        System.out.println(mp2.containsValue("41"));  //判断是否包含某value
        mp2.clear();//清空集合
    }
}
/*运行结果为：
{krystal=20, Jimmy=21}
2
true
false
*/
```

案例2：遍历map集合

```Java
package day01;

import org.omg.PortableInterceptor.INACTIVE;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class DayB{
    public static void main(String[] args) {
        Map<String,Integer> mp2=new HashMap<String,Integer>(); //给Map设置泛型
        mp2.put("kobe",41);
        mp2.put("gigi",13);
        mp2.put("James",35);

        //方法1：创建key集合
        Set<String> keys=mp2.keySet();  //创建key集合，keySet()可以返回key集合
        for(String s:keys){
            System.out.println(s+" : "+ mp2.get(s));
        }
        //方法2：使用entrySet()方法：
        Set<Map.Entry<String, Integer>> a=mp2.entrySet();
        for(Map.Entry<String,Integer> en:a){
            System.out.println(en.getKey()+" : "+en.getValue());
        }

    }
}
```

**HashMap与HashTable**

HashMap和Hashtable是Map接口的两个典型实现类，两者区别：

- Hashtable是一个古老实现类，不推荐使用
- Hashtable线程安全，HashMap线程不安全
- Hashtable允许使用null作为key和value，HashMap可以
- Hashtable与HashMap都不能保证key-value的顺序
- Hashtable与HashMap判断两个key相同的标准都是equals()返回true，hashCode值也相等

```Java
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Map;

public class DayB{
    public static void main(String[] args) {
        Map<String,Integer>ma=new HashMap<String,Integer>();
        ma.put(null,null); //运行不会报错

        Map<String,Integer>mt=new Hashtable<String,Integer>();
        ma.put(null,null); //运行会报错
    }
}
```

#### TreeMap类

`TreeMap`和`TreeSet`一样，是有序的。

`TreeMap`的`Key`的排序：

- 自然排序：`TreeMap`的所有`Key`必须实现`Comparable`接口，且所有的`Key`应该是同一个类的对象，否则会抛出异常`ClassCastException`
- 定制排序：`Map`的`Key`不需要实现`Comparable`接口，但是要实现`Comparator`接口。

案例1：`TreeMap`自然排序

```Java
package day01;

import java.util.Map;
import java.util.TreeMap;

public class DayB{
    public static void main(String[] args) {
        Map<Integer,String> mL=new TreeMap<Integer, String>();
        mL.put(3,"apple");
        mL.put(2,"banana");
        mL.put(5,"grape");
        System.out.println(mL);
    }
}
/*运行结果为：
{2=banana, 3=apple, 5=grape}
*/
//所有的基本数据类型的包装类都实现了Comparable接口，例如，Integer的源代码如下：
public final class Integer extends Number implements Comparable<Integer>{}

```

案例2：`TreeMap`定制排序

```Java
package day01;

import java.util.Comparator;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;

public class DayB {
    public static void main(String[] args) {
        Map<Shoe,String> mS = new TreeMap<Shoe, String>(new Shoe());
        Shoe s1=new Shoe("Jimmy",21);
        Shoe s2=new Shoe("Krystal",20);
        Shoe s3=new Shoe("who",31);
        mS.put(s1,"第一个人");
        mS.put(s2,"第二个人");
        mS.put(s3,"第三个人");
        System.out.println(mS);

        Set<Shoe> a= mS.keySet();
        for(Shoe i:a){
            System.out.println(i.age);
        }
    }
}

class Shoe implements Comparator<Shoe> {
    public int age;
    public String name;

    public Shoe() {

    }

    public Shoe(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @Override
    public int compare(Shoe o1, Shoe o2) {
        if (o1.age > o2.age) {
            return 1;
        } else if (o1.age < o2.age) {
            return -1;
        } else {
            return 0;
        }
    }
}
```

#### 工具类Collections

注意这里说的是`Collections`类，是有`s`的，不是`Collection`接口。



## 泛型

在集合学习上，我们已经用过泛型（`generic`)，它能够限制集合的类型为某一类型。`Java`泛型**只在编译阶段有效，泛型的信息不会进入运行阶段**，`Java`泛型可以保证如果程序在编译时没有发出警告，运行时就不会发生`ClassCastException`异常，让代码更加健壮。

##### 泛型类

对象实例化时如果不指定泛型，默认为：`Object`

泛型不同的引用不能相互赋值。

```java
package day01;

/**
 * 可以将type改成其它名称，不是关键字就行
 * @param <type>
 */
class FanClass<type>{ //定义泛型类，type是随机取的一个名称
    private type info;
    public type getInfo(){
        return this.info;
    }
    public void setInfo(type info){
        this.info=info;
    }
}
class RunClass{
    public static void main(String[] args) {
        FanClass<String> fa=new FanClass<String>(); //指定类的泛型为String
        fa.setInfo("hello");
        //fa.setInfo(34); ----->编译报错
        
        FanClass<Integer>fb=new FanClass<Integer>();//指定类的泛型为Integer
        fb.setInfo(42);
        //fb.setInfo("kobe"); ----->编译报错
        
        FanClass fc=new FanClass(); //没有指定泛型类型时，默认使用Object
        fc.setInfo("hello"); // 不会报错
        fc.setInfo(23);  //也不会报错
        
        //fa=fb; ---->编译报错，不同泛型类型的对象不能相互赋值     
    }
}
```

##### 泛型方法

案例1：无返回值方法

```Java
package day01;

class Mushroom{
    //无返回值，且参数没有用到泛型类型
    public <type>void mFun1(){
        System.out.println("hello");
    }
    //无返回值，参数用到泛型类型
    public <type>void mFun2(type s){
        type a=s;
        System.out.println(a);
    }
}
class RunClass{
    public static void main(String[] args) {
        Mushroom mr=new Mushroom();
        String str="hello,MushRoom";
        mr.mFun2(str);
        String []sArr={"m1","m2","m3"};
        mr.mFun2(sArr);
    }
}
/*运行结果为：
hello,MushRoom
[Ljava.lang.String;@1b6d3586
*/
```

案例2：有返回值

```Java
package day01;

class Radish{
    public <type> type rFun(type a){
        type b=a;
        System.out.println(b);
        return b;
    }
}
class RunClass{
    public static void main(String[] args) {
        Radish rt=new Radish();
        boolean a=true;
        rt.rFun(a);
    }
}
```

案例3：可变参数

```java
package day01;

class Pea{
    public <type>void  rFun(type...a){
        for (type i:a){
            System.out.println(i);
        }
    }
}
class RunClass{
    public static void main(String[] args) {
        Pea rt=new Pea();
        boolean a=true;
        String b="hello";
        int c=2;
        rt.rFun(a,b,c);
    }
}
/*运行结果为：
true
hello
2
*/
```

案例4：静态方法与泛型

```Java
package day01;
class Fork<type>{
    private type a;
    public void fFun(){
        System.out.println(a);
    }
    //类中定义的泛型，不能在静态方法中使用,如果要使用泛型，只能使用自己方法内定义的泛型
    public static void oFun(){
        //System.out.println(a); ----->编译报错
    }
}
```

##### 泛型接口

案例1：实现接口处不指定泛型

```Java
package day01;

//新建泛型接口
interface Person<type>{
    type eat(type a);
}
//第一种情形，不指定泛型，默认使用Object
class Teacher implements Person{  //等价于class Teacher implements Person<Object>
    @Override
    public Object eat(Object a) {
        System.out.println("教师吃饭的地方在"+a+"饭");
        return null;
    }
}
class RunClass{
    public static void main(String[] args) {
        Teacher t=new Teacher();
        int ind=2;
        t.eat(ind);
        String str="二";
        t.eat(str);
    }
}
/*运行结果为：
教师吃饭的地方在2饭
教师吃饭的地方在二饭
*/
```

案例2：实现接口处指定泛型但是不传入实参

```Java
//新建泛型接口
interface Person<type>{
    type eat(type a);
}
//第二种情形，指定泛型，但是不传入实参,则类的声明也要加入泛型限制
class Student<type> implements Person<type>{  
    //错误写法：class Student implements Person<type>
    @Override
    public type eat(type a) {
        System.out.println("学生吃饭的地方在"+a+"栋");
        return null;
    }
}
class RunClass{
    public static void main(String[] args) {
        Student<String> s1=new Student<String>();  //创建实例对象的时候再传入实参
        String ind1="二十九";
        s1.eat(ind1);

        Student<Integer> s2=new Student<Integer>();
        int ind2=29;
        s2.eat(ind2);
    }
}
/*运行结果为：
学生吃饭的地方在二十九栋
学生吃饭的地方在29栋
*/
```

案例3：实现接口处指定泛型并传入实参

```Java
package day01;

//新建泛型接口
interface Person<type>{
    type eat(type a);
}
//第三种情形，指定泛型，且传入的是实参
class Police implements Person<String>{
    @Override
    public String eat(String a) {
        System.out.println("警擦吃饭地方在"+a);
        return "hello,police";
    }
}
class RunClass{
    public static void main(String[] args) {
        Police p=new Police();
        p.eat("街边");
        // p.eat(23);--->编译报错
    }
}
/*运行结果为；
警擦吃饭地方在街边
*/
```

##### 泛型通配符

如果一个方法需要传入的参数为集合，但是又不确定集合中的元素是什么类型的，这时候就可以用到泛型通配符。

案例1：

```Java
package day01;

import java.util.HashSet;
import java.util.Set;

class SnowFall{
    public void fun1(Set<?> set){ //知道参数是Set集合，但是不能确定元素的类型
        System.out.println(Set);
    }
}
class RunClass{
    public static void main(String[] args) {
        SnowFall sn=new SnowFall();
        Set<String> sa=new HashSet<String>();
        sa.add("kobe");
        sa.add("krystal");
        sn.fun1(sa);

        Set<Integer> sb=new HashSet<Integer>();
        sb.add(24);
        sb.add(23);
        sn.fun1(sb);
    }
}
```

案例2：只允许泛型为`Person`类集合或者泛型为继承`Person`的子类集合作为参数

```java
package day01;

import java.util.*;

class Person{}
class Student extends Person{}
class Teacher extends Person{}
class Sandal{
    public void fun(List<?extends Person> list){//?extends通配符
        System.out.println(list);
        //参数是一个List集合，而且集合的元素只允许是Person类对象或者Person子类对象
    }
}
class RunClass{
    public static void main(String[] args) {
        Person p=new Person();
        Teacher t=new Teacher();
        Student s=new Student();
        List<Person> lp=new ArrayList<Person>();
        List<Teacher> lt=new ArrayList<Teacher>();
        List<Student> ls=new ArrayList<Student>();
        lp.add(p);
        lt.add(t);
        ls.add(s);
        Sandal sd=new Sandal();
        sd.fun(lp);
        sd.fun(lt);
        sd.fun(ls);
        
        List<String> lb=new ArrayList<>();
        // sd.fun(lb);---->编译报错
    }
}
```

案例3：只允许泛型为`Student`类集合或者泛型为继承`Student`的父类集合作为参数

```Java
package day01;

import java.util.*;

class Person{}
class Student extends Person{}
class Teacher extends Person{}
class Sandal{
    public void fun(List<?super Student> list){ //?super通配符
        System.out.println(list);
        //参数是一个List集合，而且集合的元素只允许是Student类对象或者Student父类对象
    }
}
class RunClass{
    public static void main(String[] args) {
        Person p=new Person();
        Teacher t=new Teacher();
        Student s=new Student();
        List<Person> lp=new ArrayList<Person>();
        List<Teacher> lt=new ArrayList<Teacher>();
        List<Student> ls=new ArrayList<Student>();
        lp.add(p);
        lt.add(t);
        ls.add(s);
        Sandal sd=new Sandal();
        sd.fun(lp);
        sd.fun(ls);
        //sd.fun(lt);---->编译报错，Teacher类不是Student的父类
    }
}
```

案例3：只允许实现某接口的类的结合作为参数，`<?extends 接口>`

```Java
package day01;

import java.util.ArrayList;
import java.util.List;

interface inf{}
class Pig implements inf{}
class Snake implements inf{}
public class DayB{
    public static void main(String[] args) {
        List<Pig> lp=new ArrayList<Pig>();
        List<Snake> ls=new ArrayList<Snake>();
        Elephant e=new Elephant();
        e.eFun(lp);
        e.eFun(ls);
        List<Integer> li=new ArrayList<Integer>();
        //e.eFun(li);--->编译报错
    }
}
class Elephant{
    public void eFun(List<?extends inf> list){
        System.out.println("大象大过"+list);
    }
}
```

## 枚举类enum

枚举类通过`enum`关键字声明，枚举类跟普通类没多大的区别。

枚举类的特点：

- 定义的`enum`类型总是继承自`java.lang.Enum`，且无法被继承，因为默认被`final`修饰

```java
public enum color{}
//相当于public final class color extends enum{}
```

- `enum`类无法通过`new`创建实例对象，实例只能在枚举类内定义，且实例名称一般使用纯大写。

```java
enum Festival{
    SPRING,SUMMER, AUTUMN, WINTER;
    //上面四个实际上都是枚举类的实例
    /*相当于：
    public final static Festival SPRING=new Festival();
    public final static Festival SUMMER=new Festival();
    public final static Festival AUTUMN=new Festival();
    public final static Festival WINTER=new Festival();
    */
}
class RunClass{
    public static void main(String[] args) {
        Festival fa=Festival.SPRING; //从这里可以看出枚举类的实例在是类内定义的
        //Festival fb=new Festival();-->编译错误：Enum types cannot be instantiated
    }
}
```

- 枚举类是单例模式，即类内定义的每个实例都是唯一实例。

```Java
package day01;

enum Festival{
    SPRING,SUMMER, AUTUMN, WINTER;
}
class RunClass{
    public static void main(String[] args) {
        Festival fa=Festival.SPRING;
        Festival fb=Festival.SPRING;
        System.out.println(fa.equals(fb));//输出true,说明fa和fb指向同一个对象
        Festival fc=Festival.SUMMER;
        Festival fd=Festival.SUMMER;
        System.out.println(fc.equals(fd));//输出true
    }
}
/*注意：对于非String类的引用类型，equals()作用是用来比较其对象在堆内存的首地址，即用来比较两个引用变量是否指向同一个对象*/
```

- 枚举类的构造器只能使用`private`访问控制符，如果省略了构造器的访问控制符，则默认使用`private`修饰。（从上面的单例模式特点就可以看出来）

```Java
enum WeekDay{
    MONDAY,TUESDAY,WENDESDAY;
    //public WeekDay(){} --->编译报错，枚举类的构造器默认使用private，也只能是private
}
```

案例1：

```Java
package day01;

enum Festival{
    SPRING("春天","天气晴朗，温度适中"), //实际上这4个实例相当于调用构造方法2
    SUMMER("夏天","天气很热，容易下雨"),
    AUTUMN("秋天","天气渐冷，收割的季节"),
    WINTER("冬天","天气寒冷，手脚僵硬");

    private String name;
    private String desc;
    //构造方法1：
    Festival(){}
    //构造方法2：
    Festival(String name, String desc){
        this.name=name;
        this.desc=desc;
    }
    public void showInfo(){
        System.out.println(this.name+" : "+this.desc);
    }
}
class RunClass{
    public static void main(String[] args) {
        Festival fa=Festival.SPRING;
        fa.showInfo();
        Festival fw=Festival.WINTER;
        fw.showInfo();
    }
}
/*运行结果为：
春天 : 天气晴朗，温度适中
冬天 : 天气寒冷，手脚僵硬
*/
```

案例2：枚举类的常用方法

```Java
enum Festival{
    SPRING,SUMMER,AUTUMN,WINTER;
}
class RunClass{
    public static void main(String[] args) {
        Festival fw=Festival.WINTER;
        fw.name(); //返回枚举常量的名称
        fw.ordinal();//返回枚举常量的序数
    }
}
```

案例3：枚举类与`switch`的结合使用

```Java
package day01;

enum Festival{
    SPRING,SUMMER,AUTUMN,WINTER;
}
class RunClass{
    public static void main(String[] args) {
        Festival ft=Festival.AUTUMN;
        switch (ft){
            case SPRING:
                System.out.println("这是春天");
                break;
            case SUMMER:
                System.out.println("这是夏天");
                break;
            case AUTUMN:
                System.out.println("这是秋天");
                break;
            case WINTER:
                System.out.println("这是冬天");
                break;
            default:
                System.out.println("不认识"+ft);
        }
    }
}
```

## IO流+File类

### File类

讲IO流之前先来讲以下File类。Java的标准库`Java.io`提供了File类来操作文件和目录。操作可以有：新建、删除、重命名等，但是**不能访问文件本身的内容**，如果想要访问，需要使用IO流。

#### 新建File对象:

```Java
package day01;

import java.io.File;

class Battery{
    public static void main(String[] args) {
        File a=new File("C:\\Users\\97464\\Desktop\\test\\File1.txt");

        File b=new File("C:\\Users\\97464\\Desktop","test\\File1.txt");

        /*
        1.上面两种方式创建的FIle对象是一个意思，File类的不同构造方法导致可以有不同的参数。
        2.构造File对象的时候，既可以传入绝对路径，也可以传入相对路径。
        3.注意Windows平台使用\作为路径分隔符，在Java字符串中需要用\\表示一个\。Linux平台使用/作为路径分隔符。传入相对路径时，相对路径前面加上当前目录就是绝对路径。
        4.   .代表当前目录..代表上级目录
         */
    }
}
```

#### 获取文件或者目录的路径和名字等操作

```Java
package day01;

import java.io.File;
import java.io.IOException;

class Battery{
    public static void main(String[] args){
        File tt=new File("F:\\test\\test\\..\\hello.txt");
        //获取文件或者目录的路径：
        System.out.println(tt.getPath());  //返回构造方法传入的路径
        System.out.println(tt.getAbsolutePath());  //返回绝对路径
        try {
            System.out.println(tt.getCanonicalPath());  
            //返回规范路径（C:\\Users\\..----->C:\\)
        }catch (IOException e){
            e.printStackTrace();
        }
        //获取文件或者目录的名字：
        System.out.println(tt.getName());

        //返回一个用当前文件的绝对路径构建的File对象；
        File gg=tt.getAbsoluteFile();
        System.out.println(gg.getName());

        //返回文件或目录的父级目录：
        System.out.println(tt.getParent());

        //重命名文件或目录：
        tt.renameTo(new File("F:\\test\\test\\..\\hello2.txt"));
    }
}
/*运行结果为：
F:\test\test\..\hello.txt
F:\test\test\..\hello.txt
F:\test\hello.txt
hello.txt
hello.txt
F:\test\test\..
*/

/*----------------补充：--------------------------------
上面的getCanonicalPath()方法，如果去查看它的源码可以发现它抛出了IOException异常，如果想要使用它，需要在调用的时候try...catch捕获异常，或者由main()继续抛出异常，交给JVM处理。
*/
```

#### 文件检测

```Java
package day01;

import java.io.File;

class Battery{
    public static void main(String[] args){
        File a=new File("F:\\test\\hello2.txt");
        //判断文件或者目录是否存在：
        System.out.println(a.exists());

        //判断文件是否可读或可写：
        System.out.println(a.canRead());
        System.out.println(a.canWrite());

        //判断当前File对象是不是文件或者目录：
        System.out.println(a.isFile());
        System.out.println(a.isDirectory());
    }
}
/*运行结果为：
true
true
true
true
false
*/
```

#### 获取文件大小和文件的最后修改时间

```Java
package day01;

import java.io.File;

class Battery{
    public static void main(String[] args){
        File a=new File("F:\\test\\hello2.txt");
        System.out.println(a.length()); //返回文件的大小，以字节为单位
        System.out.println(a.lastModified());  //返回最后修改时间，是一个毫秒数
    }
}
/*运行结果为：
11
1580719765617
*/
```

#### 新建和删除文件或目录

```Java
package day01;

import java.io.File;
import java.io.IOException;

class Battery{
    public static void main(String[] args){
        File a=new File("F:\\test\\hello.txt");
        if(!a.exists()){ //判断文件是否不存在
            try{
                a.createNewFile();
            }catch (IOException e){
                e.printStackTrace();
            }
        }
        a.delete(); //删除文件

        File b=new File("F:\\test2");
        b.mkdir(); //创建单层目录

        File c=new File("F:\\test3\\kobe\\number24");
        c.mkdirs();//创建多层目录
    }
}
```

#### 遍历目录下的文件和子目录

```Java
package day01;

import java.io.File;

class Battery{
    public static void main(String[] args){
        File d=new File("F:\\test3");
        System.out.println(d.list().getClass());
        //可以看到d.list()返回的是数据类型是class [Ljava.lang.String;
        //[：表示返回的类型是数组，L：表示数组元素是一个对象实例 
        // Java.land.String表示对象是String类型
        //下面进行循环输出目录下的文件或者子目录：
        String []strArr=d.list();
        for (String i:strArr){
            System.out.println(i);
        }

        File e=new File("F:\\test3");
        File [] arrFile=e.listFiles(); 
        //e.listFiles()返回test3目录下的文件或子目录的file对象
        for (File i: arrFile){
            System.out.println(i);
        }
    }
}
/*运行结果为：
class [Ljava.lang.String;
kobe
F:\test3\kobe
*/
```

上面遍历文件和子目录是单层遍历，如果想要进行多层遍历(子目录的子目录也会被遍历），可以进行递归遍历。

- 案例:

```Java
package day01;

import java.io.File;

class Rabbit{
    public void fds(File a){
        if(a.isFile()){
            System.out.println(a.getName());
        }else {
            System.out.println(a.getName());
            File []fileArr=a.listFiles();
            for (File i:fileArr){
                fds(i); //递归
            }
        }
    }
}
class RunClass{
    public static void main(String[] args) {
        Rabbit test=new Rabbit();
        File tf=new File("F:\\test3");
        test.fds(tf);
    }
}
```

### IO流 

#### IO概念：

IO是指`Input/Output`，即输入和输出，**以内存为中心：**

- Input指从外部读入数据到内存。----例如把文件从磁盘读取到内存，从网络读取数据到内存等
- Output指把数据从内存输出到外部。----例如把数据从内存写入文件，把数据从内存输出到网络等

为什么要以内存为中心？

------因为数据被读取到内存中才能被处理，代码是在内存中运行的，数据也必须内存。

#### IO流概念：

IO流是一种顺序读写数据的模式，它的特点是单向流动。

------例如: 想要把一张图片放入一个文件夹，不能整张直接塞进去，而是需要把图片转化为一个数据集（例如二进制），把这些数据一点一点传到文件夹，这个数据的传递类似于自来水在水管中的流动，称为IO流。

#### 同步和异步

同步IO是指，读写IO时代码必须等待数据返回后才继续执行后续代码，它的优点是代码编写简单，缺点是CPU执行效率低。

而异步IO是指，读写IO时仅发出请求，然后立刻执行后续代码，它的优点是CPU执行效率高，缺点是代码编写复杂。

Java标准库的包`java.io`提供了所有的同步IO，而`java.nio`则是异步IO。

下面我们即将讨论的`InputStream`、`OutputStream`、`Reader`和`Writer`都是同步IO的抽象类的具体实现类

#### 流的分类

按操作数据单位不同分为：字节流(8 bit),字符流(16 bit)

按数据流的流向不同分为：输入流，输出流

按流的角色不同分为：节点流，处理流

| 抽象基类 | 字节流       | 字符流 |
| -------- | ------------ | ------ |
| 输入流   | InputStream  | Reader |
| 输出流   | OutputStream | Writer |

Java的IO流共有40多个相关类，实际上都是从上面的四种抽象基类派生的。

![image-20200204105414414](java.assets/image-20200204105414414.png)

##### 字节流

IO流以byte（字节）为最小单位，称为字节流。字节流非常通用，不仅可以用来操作字符型文档，还**可以操作任何地其它类型文件**（图片、压缩包等），因为字节流本身使用地就是二进制。

```Java
╔════════════╗
║   Memory   ║ 内存
╚════════════╝
       ▲
       │0x48
       │0x65
       │0x6c
       │0x6c
       │0x6f
       │0x21
 ╔═══════════╗
 ║ Hard Disk ║ 硬盘
 ╚═══════════╝
 //上面，内存从硬盘（磁盘）读入了6个字节的数据，是按顺序读入的，是输入字节流。
 //反过来就是输出字节流：
 ╔════════════╗
 ║   Memory   ║ 内存
 ╚════════════╝
       │0x21
       │0x6f
       │0x6c
       │0x6c
       │0x65
       │0x48
       ▼
 ╔═══════════╗
 ║ Hard Disk ║ 硬盘
 ╚═══════════╝
```

###### InputStream

`InputStream`是Java标准库提供的最基本的输入字节流。位于`Java.io`这个包里。`InputStream`是一个抽象类，是所有输入流的父类，这个抽象类定义的最重要的方法是`int read()`。源代码如下：

```Java
public abstract int read() throws IOException;
```

构建InputStream对象：

```Java
import java.io.IOException;
import java.io.InputStream;

class MainClass{
    public static void main(String[] args) {
        InputStream is=new InputStream() {
            @Override  //可以看到新建InputStream输入流对象必须重写抽象方法int read()
            public int read() throws IOException {
                return 0;
            }
        };
    }
}
```

 `read()`这个方法会读取输入流的下一个字节，并返回字节表示的`int`值`（0-255）`（`ascii`码），**读到末尾就会返回`-1`**

`read()`方法还可以传递参数——`read(byte [] b)`，作用是一次读取一个字节数组，把输入流读取到的内容存放到这个字节数组中，并**返回存放到数组的内容的字节数**，同样是到末尾就返回`-1`。`byte`数组是作为一个缓冲区，每次存入数组大小为`byte.length`的数据，存入的数据是一个`int`

####### FileInputStream

`FileInputStream`是`InputStream`的一个子类,用来从文件中读取数据。`FileInputStream`类的构造方法有：

- `FileInputStream(File file)`： 传递一个文件的`File`类对象
- `FileInputStream(String name)`： 传递一个`String`类型的文件路径

案例1: `int read()`的使用

```
F:\\test\\hello.txt的文件内容：
abclove
```

```Java
package day01;

import java.io.FileInputStream;
import java.io.IOException;

class MainClass{
    public static void main(String[] args) throws IOException {  //所有与IO操作相关的代码都必须正确处理IOException
        FileInputStream fis=new FileInputStream("F:\\test\\hello.txt");  //创建流对象
        for(;;){  //无限循环
            int n = fis.read();  //反复调用read()方法，直到n=-1
            if (n==-1){
                break;
            }
            System.out.print(n+":"); //打印read()返回的byte值
            System.out.println((char)n);
        }
        fis.close(); //关闭流，释放对应的底层资源
    }
}
/*运行结果为
97:a
98:b
99:c
108:l
111:o
118:v
101:e
 */
//从运行结果可知，read()返回的单字节整数值，是对应字符的acsii码。通过(char)就可以转换为对应字符。
```

案例2：`int read(byte [] b)`的使用（缓冲）

```Java
package day01;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

class MainClass{
    public static void main(String[] args) throws IOException {
        InputStream cup=new FileInputStream("F:\\test\\hello.txt");
        byte [] b=new byte[3];  
        //b数组是作为一个缓冲区，在下面的循环中，每循环一次,b就会更新一次，输入流把读取到的内容放到b中
        int len=0; //初始化len为0
        while((len=cup.read(b))!=-1){  //len代表存放到数组b的数据的字节数
            System.out.print(len+":");
            System.out.println(new String(b,0,len)); //用法看下面的补充
        }
        cup.close();
    }
}
/*运行结果为：
3:abc
3:lov
1:e
 */
/*-------------------------补充：----------------------------------------
String类的构造方法public String(byte bytes[], int offset, int length)的用法：
	作用：将字节数组的某部分转为字符串
	参数：byte bytes[]表示要被转的数组
		int offset表示偏移量，即从数组的第几个位置开始转为字符串，
		int length表示总共要转化的字节数
```

`read()`方法是**阻塞的（blocking）**。读取IO流相比执行普通代码，速度要慢很多。

```Java
package day01;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

class MainClass{
    public static void main(String[] args) throws IOException {
      InputStream a=new FileInputStream("F:\\test\\hello.txt");
        System.out.println("kobe");
        int b=a.read();  // 必须等待read()方法返回才能执行下一行代码
        System.out.println("gigi");
    }
}
```

###### OutputStream

`OutputStream`是Java标准库提供的最基本的输出流。OutputStream和InputStream一样，也是抽象类，是所有输出流的父类。抽象类定义的一个重要的方法是`void write(int b)`,源代码如下：

```Java
public abstract void write(int b) throws IOException;
```

`write()`还有重载方法：

- `write(byte b[])`：用于一次性写入多个字节
- `write(byte b[], int off, int len) `：将数组`b`从`off`位置开始，把长度为`len`字节的数据写入到文件中

和`InputStream`一样，`OutputStream`的`write()`方法也是阻塞的。

####### FileOutputStream

`FileOutputStream`是`OutputStream`的子类。`FileOutputStream`类的构造方法有：

- `FileOutputStream(File file)`： 传递一个文件的`File`类对象
- `FileOutputStream(String name)`： 传递一个`String`类型的文件路径

案例1：一次写入一个字节

```Java
package day01;

import java.io.*;

class MainClass{
    public static void main(String[] args) throws IOException {
        OutputStream ops=new FileOutputStream("F:\\test\\outPut.txt");
        ops.write(97); //往文件写入97ascii码代表的字符a
        ops.write(98); //往文件写入98ascii码代表的字符b
        ops.write(99); //往文件写入99ascii码代表的字符c
        ops.flush();
        ops.close();
    }
}
//运行结果是：往F:\\test\\outPut.txt这个文件写入“abc",如果这个文件不存在，则会新建文件。
```

从案例1可以看到，`OutputStream`还提供了一个`flush()`方法，它的目的是将缓冲区的内容真正输出到目的地。

为什么要有`flush()`？因为向磁盘、网络写入数据的时候，出于效率的考虑，**操作系统并不是输出一个字节就立刻写入到文件或者发送到网络，而是把输出的字节先放到内存的一个缓冲区里（本质上就是一个`byte[]`数组）**，等到缓冲区写满了，再一次性写入文件或者网络。对于很多IO设备来说，一次写一个字节和一次写1000个字节，花费的时间几乎是完全一样的，所以`OutputStream`有个`flush()`方法，能强制把缓冲区内容输出。

通常情况下，我们不需要调用这个`flush()`方法，因为**缓冲区写满了`OutputStream`会自动调用它，并且，在调用`close()`方法关闭`OutputStream`之前，也会自动调用`flush()`方法。**

但是，在某些情况下，我们必须手动调用`flush()`方法。举个例子：

> 小明正在开发一款在线聊天软件，当用户输入一句话后，就通过`OutputStream`的`write()`方法写入网络流。小明测试的时候发现，发送方输入后，接收方根本收不到任何信息，怎么肥四？
>
> 原因就在于写入网络流是先写入内存缓冲区，等缓冲区满了才会一次性发送到网络。如果缓冲区大小是4K，则发送方要敲几千个字符后，操作系统才会把缓冲区的内容发送出去，这个时候，接收方会一次性收到大量消息。
>
> 解决办法就是每输入一句话后，立刻调用`flush()`，不管当前缓冲区是否已满，强迫操作系统把缓冲区的内容立刻发送出去。

**实际上，`InputStream`也有缓冲区**。例如，从`FileInputStream`读取一个字节时，操作系统往往会一次性读取若干字节到缓冲区，并维护一个指针指向未读的缓冲区。然后，每次我们调用`int read()`读取下一个字节时，可以直接返回缓冲区的下一个字节，避免每次读一个字节都导致IO操作。当缓冲区全部读完后继续调用`read()`，则会触发操作系统的下一次读取并再次填满缓冲区。

**案例2：一次性写入若干字节**

```Java
package day01;

import java.io.*;

/**
 * 一次性写入若干字节，通过void write(byte [])来实现
 */
class MainClass{
    public static void main(String[] args) throws IOException {
        OutputStream ops=new FileOutputStream("F:\\test\\outPut.txt");
        ops.write("hello Krystal".getBytes("utf-8") );
        ops.flush();
        ops.close();
    }
}
/*----------------------补充：------------------------------------------
 String.getBytes(String decode)方法会根据指定的decode编码返回某字符串在该编码下的byte数组
*/
```

案例3：复制文件

```Java
package day01;

import java.io.*;

class MainClass{
    public static void main(String[] args) throws IOException {
        Stero st=new Stero();
        st.fun1("F:\\test\\outPut.txt","F:\\test\\outPut2.txt");
        //把outPut.txt复制为outPut2.txt
    }
}
class Stero{
    void fun1(String intputPath,String outputPath) throws IOException {
        InputStream ips=new FileInputStream(intputPath);
        OutputStream ops=new FileOutputStream(outputPath);
        byte[]a=new byte[3];
        int len;
        while((len=ips.read(a)) != -1){
            ops.write(a,0,len);
        }
        ops.close(); //先关闭输出流
        ips.close(); //后关闭输入流
        //最早开的最晚关
    }
}
```

##### 正确关闭流

上面的流的案例，存在一个潜在的问题，如果读取或者写入过程中，发生了IO错误，流就没法及时关闭，资源也无法释放。 **Java7引入了新的`try(resource)`语法，只需要编写`try`语句，就可让编译器自动为我们关闭资源。**

案例：自动正确地关闭流

```java
class Cable{
    public static void main(String[] args) throws IOException{
        //把新建流对象地语句放在try()里面即可
        try(FileInputStream sf=new FileInputStream("F:\\test\\hello.txt")){
            int n;
            while((n=sf.read())!=-1){
                System.out.println((char)n);
            }
        }
    }
}
```



##### 字符流

如果我们需要读写的是字符(不是图片什么的)，并且字符不全是单字节表示的ASCII字符，那么按照char来读写更方便，这种流称为字符流。字符流传输的最小数据单位是`char`，Java提供了`Reader`和`Writer`两个基类来操作字符流。

`Reader`和`Writer`本质上是一个能自动编解码的`InputStream`和`OutputStream`。

**使用`Reader`，数据源虽然是字节，但我们读入的数据都是`char`类型的字符**，原因是`Reader`内部把读入的`byte`做了解码，转换成了`char`。使用`InputStream`，我们读入的数据和原始二进制数据一模一样，是`byte[]`数组，但是我们可以自己把二进制`byte[]`数组按照某种编码转换为字符串。究竟使用`Reader`还是`InputStream`，要取决于具体的使用场景。**如果数据源不是文本，就只能使用`InputStream`，如果数据源是文本，使用Reader更方便一些**。`Writer`和`OutputStream`是类似的。



###### Reader

`Reader`是Java的IO库提供的另一个输入流接口。和`InputStream`的区别是，`InputStream`是一个字节流，即以`byte`为单位读取，而`Reader`是一个字符流，即以`char`为单位读取，`Reader`是所有字符输入流的父类。`Reader`类的主要方法是`int read()`，源代码是：

```Java
public int read() throws IOException;
```

####### FileReader

`FileReader`是`Reader`的子类，`FileReader`的用法和`FileInputStream`的用法极其相似。

案例1：

```Java
//hello.txt的内容如下（注意编码格式要为utf-8，要不然会出错，另存为就可以改编码格式）
武汉，加油。
China，add oil. 
```

```Java
package day01;

import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;

class RunClas{
    public static void main(String[] args) {
        Water w=new Water();
        try {
            w.fun1("F:\\test\\hello.txt");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
class Water{
    public void fun1(String rPath) throws IOException {
        try(Reader fr=new FileReader(rPath)){
            char[] a=new char[4]; //创建用于缓冲的字符数组
            int len;
            while((len=fr.read(a))!=-1){
                System.out.println(new String(a,0,len));
            }
        }
    }
}
```

###### Writer

`Reader`是带编码转换器的`InputStream`，它把`byte`转换为`char`，而`Writer`就是带编码转换器的`OutputStream`，它把`char`转换为`byte`并输出。

`Writer`是所有字符输出流的超类，它提供的方法主要有：

- 写入一个字符`（0~65535）`：`void write(int c)`；
- 写入字符数组的所有字符：`void write(char[] c)`；
- 写入`String`表示的所有字符：`void write(String s)`。

####### FileWriter

`FileWriter`是`Writer`的一个子类。`FileWriter`的用法和`FileOutputStream`的用法很相似。

案例1：使用`void write(String s)`方法

```Java
package day01;

import java.io.*;

class RunClas {
    public static void main(String[] args) {
        Desk d=new Desk();
        try {
            d.funF("F:\\test\\FileWriterOutput.txt","Hello,krystal,i'm missing you.");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

class Desk {
    public void funF(String oPath, String content) throws IOException {
        try (Writer a = new FileWriter(oPath)) {
            a.write(content);
            a.flush();
            a.close();
        }
    }
}
```

案例2：用字符流进行复制文件

```java
package day01;

import java.io.*;

class RunClas {
    public static void main(String[] args) throws IOException {
        Desk d = new Desk();
        d.funF("F:\\test\\hello.txt", "F:\\test\\hello3.txt");
    }
}

class Desk {
    public void funF(String iPath, String oPath) throws IOException {
        Reader ra = new FileReader(iPath);
        Writer wa = new FileWriter(oPath);
        char[] charArr = new char[100];
        int len;
        while ((len = ra.read(charArr)) != -1) {
            wa.write(charArr);
        }
        wa.flush();
        wa.close();
    }
}
```

**流对文件的操作注意事项：**

- 在写入一个文件时，目录下的同名文件会被覆盖
- 在读取一个文件时，必须保证改文件是存在的，否则报异常

##### 缓冲流

为了提高 数据读写的速度，Java提供了带缓冲功能的流类，在使用这些流类时，会创建一个内部缓冲区数组。(基于内存的)。

`BufferedInputStream`-->`FileInputStream`
        `BufferedOutputStream`-->`FileOutputStream`
        `BufferedReader`-->`FileReader`
        `BufferedWriter`-->`FileWriter`

缓冲流先把数据缓冲到内存里，然后在内存中做`io`操作，基于内存的`io`操作比基于硬盘的操作快7500倍。

###### 案例1：`BufferedInputStream`的使用

```Java
package day01;

import java.io.*;

class ExaF{
    public static void main(String[] args) throws IOException {
        //创建File流对象：
        FileInputStream a=new FileInputStream("F:\\test\\hello.txt");
        //创建缓冲流对象：
        BufferedInputStream b=new BufferedInputStream(a); //需要传入FIle流作为参数
        byte[] bArr=new byte[100];
        int len;
        while((len=b.read(bArr))!=-1){
            System.out.println(new String(bArr,0,len));
        }
    }
}
```

###### 案例2：`BufferedOutputStream`的使用

```Java
package day01;

import java.io.*;

class ExaF{
    public static void main(String[] args) throws IOException {
        FileOutputStream a=new FileOutputStream("F:\\test\\BOutput.txt");
        BufferedOutputStream b=new BufferedOutputStream(a); 
        b.write("I love you,krystal".getBytes());
        b.flush();
        b.close();
    }
}
```

###### 案例3：使用字节流+缓冲流实现文件复制

```Java
package day01;

import java.io.*;

class ExaF{
    public static void main(String[] args) throws IOException {
        //创建File流对象：
        FileInputStream ia=new FileInputStream("F:\\test\\hello.txt");
        FileOutputStream oa=new FileOutputStream("F:\\test\\Chello.txt");

        //创建缓冲流对象：
        BufferedInputStream ib=new BufferedInputStream(ia);
        BufferedOutputStream ob=new BufferedOutputStream(oa); 

        byte[] bArr=new byte[100];
        int len;
        while((len=ib.read(bArr))!=-1){
            ob.write(bArr);
        }
        ob.flush();
        ob.close();
        ib.close();
        oa.close();
        ia.close();
    }
}
```

###### 案例4：`BufferedReader`的使用

```Java
package day01;

import java.io.*;

class ExaB{
    public static void main(String[] args) throws IOException {
        FileReader a=new FileReader("F:\\test\\hello.txt");
        BufferedReader b=new BufferedReader(a);
        char []cArr=new char[100];
        int len;
        while((len=b.read(cArr))!=-1){
            System.out.println(new String(cArr,0,len));
        }
        b.close();
        a.close();
    }
}
```

###### 案例5：`BufferedWriter`的使用

```Java
package day01;

import java.io.*;

class ExaB{
    public static void main(String[] args) throws IOException {
        FileWriter a=new FileWriter("F:\\test\\brout.txt");
        BufferedWriter b=new BufferedWriter(a);
        b.write("Hello,krystal!");
        b.flush();
        b.close();
        a.close();
    }
}
```

###### 案例6：使用字符流+缓冲流实现文件的复制

```Java
package day01;

import java.io.*;

class ExaB{
    public static void main(String[] args) throws IOException {
        BufferedReader br=new BufferedReader(new FileReader("F:\\test\\hello.txt"));
        BufferedWriter bw=new BufferedWriter(new FileWriter("F:\\test\\em.txt"));
        char [] cArr=new char[100];
        int len;
        while((len=br.read(cArr))!=-1){
            bw.write(cArr);
        }
        bw.flush();
        bw.close();
        br.close();
    }
}
```

##### 转换流

转换流是指`InputStreamReader`和`OutputStreamWriter`，上面讲了，流的数据都是字符时，转成字符流更高效，那么**转换流就是用来将字节流转换成字符流的**，并且可以指定字符集的编码解码格式。

案例1：转换字节输入流为字符输入流

```Java
//"F:\\test\\aa.txt"文件的编码为GBK,文件内容如下：
中国我爱你。
I love you,China.
```

```Java
package day01;

import java.io.*;

class Bear{
    public static void main(String[] args) throws IOException {
        //创建文件字节输入流对象
        FileInputStream fis=new FileInputStream("F:\\test\\aa.txt");
        //创建转换流对象
        InputStreamReader isr=new InputStreamReader(fis,"utf-8");//指定字符集编码
        char []cArr=new char[10];
        int len;
        while((len=isr.read(cArr))!=-1){
            System.out.println(new String(cArr,0,len));
        }
        isr.close();
        fis.close();
    }
}
/*运行结果为：
�й��Ұ��㡣

I love you
,China.
*/
/*出现了乱码，是因为代码中指定的字符集编码与读取的文件的数据的编码格式不一致，
指定编码的一行代码改成：InputStreamReader isr=new InputStreamReader(fis,"GBK");即可避免乱码*/
```

案例2：转换字节输出流为字符输出流

```java
package day01;

import java.io.*;

class Bear{
    public static void main(String[] args) throws IOException {
        FileOutputStream fos=new FileOutputStream("F:\\test\\ors.txt");
        OutputStreamWriter osw=new OutputStreamWriter(fos,"utf-8");
        osw.write("中国，我爱你");
        osw.flush();
        osw.close();
        fos.close();
    }
}
```

##### 标准输入输出流

`System.out`和`System.in`是系统标准的输入和输出设备（键盘和显示器）

`System.in`的类型是`InputStream`

`System.out`的类型是`PrintStream。`

- 案例1：创建一个接受键盘输入的标准输入流

```Java
package day01;

import java.io.*;

class Bear{
    public static void main(String[] args) throws IOException {
        RedPap rd=new RedPap();
        rd.fun();
    }
}
class RedPap{
    public void fun() throws IOException {
        //创建接受键盘输入的输入流
        InputStreamReader isr=new InputStreamReader(System.in);
        //把输入流放到缓冲流里：
        BufferedReader bfr=new BufferedReader(isr);
        //创建临时接受数据的字符串：
        String str="";
        while((str=bfr.readLine())!=null){  //readLine()是缓冲输入字符流提供的按行读取终端数据的方法，每一次调用会以字符串形式返回一行内容，读取完会返回null
            System.out.println(str);
        }
    }
}
//运行结果如下图：
```

![image-20200205223122589](java.assets/image-20200205223122589.png)



案例2：将控制台的输入内容输出到文件`krystal.tx`t中，控制台出现`”over“`时结束输出。

```java
package day01;

import java.io.*;

class Bear{
    public static void main(String[] args) throws IOException {
        Krystal cf=new Krystal();
        cf.fun("F:\\test\\Krystal.txt");
    }
}
class Krystal{
    public void fun(String kPath) throws IOException {
        BufferedReader bfr=new BufferedReader(new InputStreamReader(System.in));
        BufferedWriter bfw=new BufferedWriter(new FileWriter(kPath));
        String str="";
        while((str=bfr.readLine())!=null){
            if(str.equals("over")){
                break;
            }
            bfw.write(str);
        }
        bfw.close();
        bfr.close();
    }
}
```

![image-20200206025400074](java.assets/image-20200206025400074.png)

##### 序列化与反序列化

首先思考两个问题：

> 1、如果想把一个类的实例化对象存到电脑的硬盘上，要怎么做？
>
> ​		硬盘存储的基础是二进制，需要把对象转化为一个二进制的字节流，然后把流保存到硬盘上。如果要用存到硬盘里的对象，又得把流转化为对象再使用。
>
> 2、如果想把一个对象通过网络传到另一台机器上，要怎么做？
>
> ​		网络通信的基础也是二进制，需要把对象转化为二进制的数据流，然后通过网络传输流。接收者如果想要使用接收的对象得先把对象的流转为对象。

因为上面两类问题的存在，产生了对象的输入与输出流。

序列化（`Serialize`）：序列化是指把一个Java对象变成二进制内容，本质上就是一个`byte[]`数组，用`ObjectOutputStream`类将一个对象写入IO流中。

反序列化（`Deserialize`）：用`ObjectInputStream`类从IO流中恢复对象。

**注意事项：**

> - 序列化和反序列化针对的是实例化对象的各种属性，不包括类的属性。
>
>  * 一个Java对象要能序列化，必须实现一个特殊的java.io.Serializable接口
>  * 实现Serializable接口的类的对象的是可序列化的
>  * Serializable接口没有定义任何方法，它是一个空接口。
>  * 我们把这样的空接口称为“标记接口”（`Marker Interface`），实现了标记接口的类仅仅是给自身贴了个“标记”，并没有增加任何方法。

案例1：

```Java
package day01;

import java.io.*;

class AbleObj implements Serializable {
    String name;
    int age;
    String school;
    double weigth;
}
class ObjOut{  //序列化类
    public void funO(String oosPath) throws IOException {
        ObjectOutputStream oos=new ObjectOutputStream(new FileOutputStream(oosPath)); //定义对象输出流
        AbleObj ao=new AbleObj();
        ao.name="krystal";
        ao.age=20;
        ao.school="SongSanHu";
        oos.writeObject(ao);
        oos.flush();
        oos.close();
    }
}
class ObjIn{  //反序列化类
    public void funI(String oisPath) throws IOException, ClassNotFoundException {
        ObjectInputStream ois =new ObjectInputStream(new FileInputStream(oisPath));
        Object a=ois.readObject();
        AbleObj b=(AbleObj)a; //强制转换为AbleObj类型
        /*对象的序列化和反序列化使用的类要严格一致，序列化是什么类反序列化就用什么类，
        包名、类名、类结构等等所有都要一致。*/
        System.out.println(b.name);
        System.out.println(b.school);
        ois.close()
    }
}
public class Test01{  //运行类
    public static void main(String[] args) throws IOException, ClassNotFoundException {
        ObjOut tt=new ObjOut();
        tt.funO("F:\\test\\KrystalInfo.txt");
        ObjIn kk=new ObjIn();
        kk.funI("F:\\test\\KrystalInfo.txt");
    }
}
/*运行结果为：
krystal
SongSanHu
 */
```

###### 安全性

因为Java的序列化机制可以导致一个实例能直接从`byte[]`数组创建，而不经过构造方法，因此，**它存在一定的安全隐患**。一个精心构造的`byte[]`数组被反序列化后可以执行特定的Java代码，从而导致严重的安全漏洞。

实际上，Java本身提供的基于对象的序列化和反序列化机制既存在安全性问题，也存在兼容性问题。更好的序列化方法是通过**JSON**这样的通用数据结构来实现，只输出基本类型（包括`String`）的内容，而不存储任何与代码相关的信息。

##### 随机存取流

`RandomAccessFile`类支持"随机访问"的方式，即**程序可以直接跳到文件的任意地方进行读写操作**。`RandomAccessFile`对象包含一个记录指针，用来标记当前读写开始位置，通过`void seek(long pos)`方法可以将记录指针定位到`pos`位置。

案例1：随机访问文件（任意位置读取）

```Java
//F:\\test\\AccessTest.txt文件的内容为：
123456789I love you,krystal. Where are you?
```

```Java
package day01;

import java.io.FileInputStream;
import java.io.RandomAccessFile;

public class Test01{
    public static void main(String[] args) throws Exception {
        RandomIn ii=new RandomIn();
        ii.Rfi("F:\\test\\AccessTest.txt");
    }
}
class RandomIn{
    public void Rfi(String path1) throws Exception{
        RandomAccessFile raf=new RandomAccessFile(path1,"rw");
        /*参数2是mode模式：
        "r":以只读模式打开文件
        "rw":打开以便读取和写入(常用)
        "rwd":打开以便读取和写入，同步文件内容的更新
        "rws":打开以便读取和写入，同步文件内容和元数据的更新
        */
        raf.seek(5);  //设置读取文件内容的起点
        byte [] bArr=new byte[100];
        int len;
        while((len=raf.read(bArr))!=-1){
            System.out.println(new String(bArr,0,len));
        }
        raf.close();
    }
}
/*运行结果为：
6789I love you,krystal. Where are you?
*/
```

案例2：随机写入

```Java
//F:\\test\\AccessTest.txt文件的内容为：
123456789I love you,krystal. Where are you?
```

```Java
package day01;

import java.io.IOException;
import java.io.RandomAccessFile;

public class Test01{
    public static void main(String[] args) throws Exception {
        RandomOut oo=new RandomOut();
        oo.rof("F:\\test\\AccessTest.txt");
    }
}
class RandomOut{
    public void rof(String path2) throws IOException {
        RandomAccessFile rdaf=new RandomAccessFile(path2,"rw");
        rdaf.seek(0); 
        rdaf.write("Hi,this is Jimmy! ".getBytes());
        rdaf.seek(rdaf.length());  //这个相当于给文件末尾追加内容
        rdaf.write(" I miss you so much!".getBytes());
        rdaf.close();
    }
}
/*运行完成后，F:\\test\\AccessTest.txt文件的内容变化如下：
123456789I love you,krystal. Where are you?
Hi,this is Jimmy! u,krystal. Where are you? I miss you so much!
可以看到,在开头或者中间写入内容时，会覆盖掉等长度的原内容。
*/
```

## 多线程

参见多线程.md

## 正则表达式

| 正则表达式 | 规则                     | 可以匹配                       |
| :--------- | :----------------------- | :----------------------------- |
| `A`        | 指定字符                 | `A`                            |
| `\u548c`   | 指定Unicode字符          | `和`                           |
| `.`        | 任意字符                 | `a`，`b`，`&`，`0`             |
| `\d`       | 数字0~9                  | `0`~`9`                        |
| `\w`       | 大小写字母，数字和下划线 | `a`~`z`，`A`~`Z`，`0`~`9`，`_` |
| `\s`       | 空格、Tab键              | 空格，Tab                      |
| `\D`       | 非数字                   | `a`，`A`，`&`，`_`，……         |
| `\W`       | 非\w                     | `&`，`@`，`中`，……             |
| `\S`       | 非\s                     | `a`，`A`，`&`，`_`，……         |

多个字符的匹配规则如下：

| 正则表达式 | 规则             | 可以匹配                 |
| :--------- | :--------------- | :----------------------- |
| `A*`       | 任意个数字符     | 空，`A`，`AA`，`AAA`，…… |
| `A+`       | 至少1个字符      | `A`，`AA`，`AAA`，……     |
| `A?`       | 0个或1个字符     | 空，`A`                  |
| `A{3}`     | 指定个数字符     | `AAA`                    |
| `A{2,3}`   | 指定范围个数字符 | `AA`，`AAA`              |
| `A{2,}`    | 至少n个字符      | `AA`，`AAA`，`AAAA`，……  |
| `A{0,3}`   | 最多n个字符      | 空，`A`，`AA`，`AAA`     |

| 正则表达式 | 规则                 | 可以匹配                             |
| :--------- | :------------------- | :----------------------------------- |
| ^          | 开头                 | 字符串开头                           |
| $          | 结尾                 | 字符串结束                           |
| [ABC]      | […]内任意字符        | A，B，C                              |
| [A-F0-9xy] | 指定范围的字符       | `A`，……，`F`，`0`，……，`9`，`x`，`y` |
| [^A-F]     | 指定范围外的任意字符 | 非`A`~`F`                            |
| AB\|CD\|EF | AB或CD或EF           | `AB`，`CD`，`EF`                     |

## JAVA反射机制

#### 反射是什么？

反射就是reflection，Java的反射是指**程序在运行期可以拿到一个对象的所有信息**。

正常情况下，如果我们要调用一个对象的方法，或者访问一个对象的字段，通常会传入对象实例：

```java
// Main.java
import com.itranswarp.learnjava.Person;

public class Main {
    String getFullName(Person p) {
        return p.getFirstName() + " " + p.getLastName();
    }
}
```

但是，如果不能获得`Person`类，只有一个`Object`实例，比如这样：

```java
String getFullName(Object obj) {
    return ???
}
```

怎么办？有童鞋会说：强制转型啊！

```java
String getFullName(Object obj) {
    Person p = (Person) obj;
    return p.getFirstName() + " " + p.getLastName();
}
```

强制转型的时候，你会发现一个问题：编译上面的代码，仍然需要引用`Person`类。不然，去掉`import`语句，你看能不能编译通过？

**所以，反射是为了解决在运行期，对某个实例一无所知的情况下，如何调用其方法。**

#### 反射机制原理

除了`int`等基本类型外，Java的其他类型全部都是`class`（包括`interface`）。例如：

- `String`
- `Object`
- `Runnable`
- `Exception`
- ...

仔细思考，我们可以得出结论：`class`（包括`interface`）的本质是数据类型（`Type`）。无继承关系的数据类型无法赋值：

```java
Number n = new Double(123.456); // OK
String s = new Double(123.456); // compile error!
```

而`class`是由JVM在执行过程中动态加载的。JVM在第一次读取到一种`class`类型时，将其加载进内存。

每加载一种`class`，JVM就为其创建一个`Class`类型的实例，并关联起来。注意：这里的`Class`类型是一个名叫`Class`的`class`。它长这样：

```java
public final class Class {
    private Class() {}
}
```

以`String`类为例，当JVM加载`String`类时，它首先读取`String.class`文件到内存，然后，为`String`类创建一个`Class`实例并关联起来：

```java
Class cls = new Class(String);
```

这个`Class`实例是JVM内部创建的，如果我们查看JDK源码，可以发现`Class`类的构造方法是`private`，只有JVM能创建`Class`实例，我们自己的Java程序是无法创建`Class`实例的。

所以，JVM持有的每个`Class`实例都指向一个数据类型（`class`或`interface`）：

```ascii
┌───────────────────────────┐
│      Class Instance       │──────> String
├───────────────────────────┤
│name = "java.lang.String"  │
└───────────────────────────┘
┌───────────────────────────┐
│      Class Instance       │──────> Random
├───────────────────────────┤
│name = "java.util.Random"  │
└───────────────────────────┘
┌───────────────────────────┐
│      Class Instance       │──────> Runnable
├───────────────────────────┤
│name = "java.lang.Runnable"│
└───────────────────────────┘
```

一个`Class`实例包含了该`class`的所有完整信息：

```ascii
┌───────────────────────────┐
│      Class Instance       │──────> String
├───────────────────────────┤
│name = "java.lang.String"  │
├───────────────────────────┤
│package = "java.lang"      │
├───────────────────────────┤
│super = "java.lang.Object" │
├───────────────────────────┤
│interface = CharSequence...│
├───────────────────────────┤
│field = value[],hash,...   │
├───────────────────────────┤
│method = indexOf()...      │
└───────────────────────────┘
```

由于JVM为每个加载的`class`创建了对应的`Class`实例，并在实例中保存了该`class`的所有信息，包括类名、包名、父类、实现的接口、所有方法、字段等，因此，如果获取了某个`Class`实例，我们就可以通过这个`Class`实例获取到该实例对应的`class`的所有信息。

这种通过`Class`实例获取`class`信息的方法称为反射（Reflection）。

#### 如何获取Class实例？

如何获取一个`class`的`Class`实例？有三个方法：

方法一：直接通过一个`class`的静态变量`class`获取：

```java
Class cls = String.class;
```

方法二：如果我们有一个实例变量，可以通过该实例变量提供的`getClass()`方法获取：

```java
String s = "Hello";
Class cls = s.getClass();
```

方法三：如果知道一个`class`的完整类名，可以通过静态方法`Class.forName()`获取：

```java
Class cls = Class.forName("java.lang.String");
```

因为`Class`实例在JVM中是唯一的，所以，**上述方法获取的`Class`实例是同一个实例**。可以用`==`比较两个`Class`实例：

```java
Class cls1 = String.class;

String s = "Hello";
Class cls2 = s.getClass();

boolean sameClass = cls1 == cls2; // true
```

注意一下`Class`实例比较和`instanceof`的差别：

```java
Integer n = new Integer(123);

boolean b1 = n instanceof Integer; // true，因为n是Integer类型
boolean b2 = n instanceof Number; // true，因为n是Number类型的子类

boolean b3 = n.getClass() == Integer.class; // true，因为n.getClass()返回Integer.class
boolean b4 = n.getClass() == Number.class; // false，因为Integer.class!=Number.class
```

用`instanceof`不但匹配指定类型，还匹配指定类型的子类。而用`==`判断`class`实例可以精确地判断数据类型，但不能作子类型比较。

**通常情况下，我们应该用`instanceof`判断数据类型，因为面向抽象编程的时候，我们不关心具体的子类型。**只有在需要精确判断一个类型是不是某个`class`的时候，我们才使用`==`判断`class`实例。

因为反射的目的是为了获得某个实例的信息。因此，当我们拿到某个`Object`实例时，我们可以通过反射获取该`Object`的`class`信息：

```java
void printObjectInfo(Object obj) {
    Class cls = obj.getClass();
}
```

要从`Class`实例获取获取的基本信息，参考下面的代码：

`// reflection ` Run

注意到数组（例如`String[]`）也是一种`Class`，而且不同于`String.class`，它的类名是`[Ljava.lang.String`。此外，JVM为每一种基本类型如int也创建了`Class`，通过`int.class`访问。

如果获取到了一个`Class`实例，我们就可以通过该`Class`实例来创建对应类型的实例：

```java
// 获取String的Class实例:
Class cls = String.class;
// 创建一个String实例:
String s = (String) cls.newInstance();
```

上述代码相当于`new String()`。通过`Class.newInstance()`可以创建类实例，它的局限是：只能调用`public`的无参数构造方法。带参数的构造方法，或者非`public`的构造方法都无法通过`Class.newInstance()`被调用。

#### 动态加载

JVM在执行Java程序的时候，并不是一次性把所有用到的class全部加载到内存，而是第一次需要用到class时才加载。例如：

```java
// Main.java
public class Main {
    public static void main(String[] args) {
        if (args.length > 0) {
            create(args[0]);
        }
    }

    static void create(String name) {
        Person p = new Person(name);
    }
}
```

当执行`Main.java`时，由于用到了`Main`，因此，JVM首先会把`Main.class`加载到内存。然而，并不会加载`Person.class`，除非程序执行到`create()`方法，JVM发现需要加载`Person`类时，才会首次加载`Person.class`。如果没有执行`create()`方法，那么`Person.class`根本就不会被加载。

这就是JVM动态加载`class`的特性。

动态加载`class`的特性对于Java程序非常重要。利用JVM动态加载`class`的特性，我们才能在运行期根据条件加载不同的实现类。例如，Commons Logging总是优先使用Log4j，只有当Log4j不存在时，才使用JDK的logging。利用JVM动态加载特性，大致的实现代码如下：

```java
// Commons Logging优先使用Log4j:
LogFactory factory = null;
if (isClassPresent("org.apache.logging.log4j.Logger")) {
    factory = createLog4j();
} else {
    factory = createJdkLog();
}

boolean isClassPresent(String name) {
    try {
        Class.forName(name);
        return true;
    } catch (Exception e) {
        return false;
    }
}
```

这就是为什么我们只需要把Log4j的jar包放到classpath中，Commons Logging就会自动使用Log4j的原因。

#### 访问字段

对任意的一个`Object`实例，只要我们获取了它的`Class`，就可以获取它的一切信息。

我们先看看如何通过`Class`实例获取字段信息。`Class`类提供了以下几个方法来获取字段：

- Field getField(name)：根据字段名获取某个public的field（包括父类）
- Field getDeclaredField(name)：根据字段名获取当前类的某个field（不包括父类）
- Field[] getFields()：获取所有public的field（包括父类）
- Field[] getDeclaredFields()：获取当前类的所有field（不包括父类）

我们来看一下示例代码：

```java
// reflection
public class Main {
    public static void main(String[] args) throws Exception {
        Class stdClass = Student.class;
        // 获取public字段"score":
        System.out.println(stdClass.getField("score"));
        // 获取继承的public字段"name":
        System.out.println(stdClass.getField("name"));
        // 获取private字段"grade":
        System.out.println(stdClass.getDeclaredField("grade"));
    }
}

class Student extends Person {
    public int score;
    private int grade;
}

class Person {
    public String name;
}

```

上述代码首先获取`Student`的`Class`实例，然后，分别获取`public`字段、继承的`public`字段以及`private`字段，运行结果如下：

![image-20200611223412213](java.assets/image-20200611223412213.png)

一个`Field`对象包含了一个字段的所有信息：

- `getName()`：返回字段名称，例如，`"name"`；
- `getType()`：返回字段类型，也是一个`Class`实例，例如，`String.class`；
- `getModifiers()`：返回字段的修饰符，它是一个`int`，不同的bit表示不同的含义。

我们可以用反射获取该字段的信息，演示代码如下：

```java
import java.lang.reflect.Field;
import java.lang.reflect.Modifier;

public class Test3 {
    public static void main(String[] args) throws NoSuchFieldException {
        Field f=T.class.getDeclaredField("value");
        f.getName();   // "value"
        f.getType();  // class [B 表示byte[]类型
        int m=f.getModifiers();
        Modifier.isFinal(m); // true
        Modifier.isPublic(m); // false
        Modifier.isProtected(m); // false
        Modifier.isPrivate(m); // true
        Modifier.isStatic(m); // false
    }
}
final class T{
    private final byte[] value;

    T(byte[] value) {
        this.value = value;
    }
}

```

注意：getDeclaredField与getField的区别

getDeclaredFiled 仅能获取类本身的属性成员（包括私有、共有、保护） 

getField 仅能获取类(及其父类可以自己测试) public属性成员


#### 获取字段值

利用反射拿到字段的一个`Field`实例只是第一步，我们还可以拿到一个实例对应的该字段的值。

例如，对于一个`Person`实例，我们可以先拿到`name`字段对应的`Field`，再获取这个实例的`name`字段的值：

```java
// reflection import java.lang.reflect.Field; Run
public class Main {

    public static void main(String[] args) throws Exception {
        Object p = new Person("Xiao Ming");
        Class c = p.getClass();
        Field f = c.getDeclaredField("name");
        Object value = f.get(p);
        System.out.println(value); // "Xiao Ming"
    }
}

class Person {
    private String name;

    public Person(String name) {
        this.name = name;
    }
}

```

上述代码先获取`Class`实例，再获取`Field`实例，然后，用`Field.get(Object)`获取指定实例的指定字段的值。

运行代码，如果不出意外，会得到一个`IllegalAccessException`，这是因为`name`被定义为一个`private`字段，正常情况下，`Main`类无法访问`Person`类的`private`字段。要修复错误，可以将`private`改为`public`，或者，在调用`Object value = f.get(p);`前，先写一句：

```java
f.setAccessible(true);
```

调用`Field.setAccessible(true)`的意思是，别管这个字段是不是`public`，一律允许访问。

可以试着加上上述语句，再运行代码，就可以打印出`private`字段的值。

有童鞋会问：如果使用反射可以获取`private`字段的值，那么类的封装还有什么意义？

答案是正常情况下，我们总是通过`p.name`来访问`Person`的`name`字段，编译器会根据`public`、`protected`和`private`决定是否允许访问字段，这样就达到了数据封装的目的。

而反射是一种非常规的用法，使用反射，首先代码非常繁琐，其次，它更多地是给工具或者底层框架来使用，目的是在不知道目标实例任何信息的情况下，获取特定字段的值。

此外，`setAccessible(true)`可能会失败。如果JVM运行期存在`SecurityManager`，那么它会根据规则进行检查，有可能阻止`setAccessible(true)`。例如，某个`SecurityManager`可能不允许对`java`和`javax`开头的`package`的类调用`setAccessible(true)`，这样可以保证JVM核心库的安全。

#### 设置字段值

通过Field实例既然可以获取到指定实例的字段值，自然也可以设置字段的值。

设置字段值是通过`Field.set(Object, Object)`实现的，其中第一个`Object`参数是指定的实例，第二个`Object`参数是待修改的值。示例代码如下：

```java
// reflection import java.lang.reflect.Field; 
public class Main {

    public static void main(String[] args) throws Exception {
        Person p = new Person("Xiao Ming");
        System.out.println(p.getName()); // "Xiao Ming"
        Class c = p.getClass();
        Field f = c.getDeclaredField("name");
        f.setAccessible(true);
        f.set(p, "Xiao Hong");
        System.out.println(p.getName()); // "Xiao Hong"
    }
}

class Person {
    private String name;

    public Person(String name) {
        this.name = name;
    }

    public String getName() {
        return this.name;
    }
}

```

运行上述代码，打印的`name`字段从`Xiao Ming`变成了`Xiao Hong`，说明通过反射可以直接修改字段的值。

同样的，修改非`public`字段，需要首先调用`setAccessible(true)`。

==....TODO还有一些知识点。。。。==https://www.liaoxuefeng.com/wiki/1252599548343744/1264803678201760

#### 动态代理

我们来比较Java的`class`和`interface`的区别：

- 可以实例化`class`（非`abstract`）；
- 不能实例化`interface`。

所有`interface`类型的变量总是通过向上转型并指向某个实例的：

```
CharSequence cs = new StringBuilder();
```

有没有可能不编写实现类，直接在运行期创建某个`interface`的实例呢？

这是可能的，因为Java标准库提供了一种动态代理（Dynamic Proxy）的机制：可以在运行期动态创建某个`interface`的实例。

什么叫运行期动态创建？听起来好像很复杂。所谓动态代理，是和静态相对应的。我们来看静态代码怎么写：

定义接口：

```java
public interface Hello {
    void morning(String name);
}
```

编写实现类：

```java
public class HelloWorld implements Hello {
    public void morning(String name) {
        System.out.println("Good morning, " + name);
    }
}
```

创建实例，转型为接口并调用：

```java
Hello hello = new HelloWorld();
hello.morning("Bob");
```

这种方式就是我们通常编写代码的方式。

还有一种方式是动态代码，我们仍然先定义了接口`Hello`，但是我们并不去编写实现类，而是直接通过JDK提供的一个`Proxy.newProxyInstance()`创建了一个`Hello`接口对象。**这种没有实现类但是在运行期动态创建了一个接口对象的方式，我们称为动态代码。**JDK提供的动态创建接口对象的方式，就叫动态代理。

一个最简单的动态代理实现如下：

```java
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
public class Main {
    public static void main(String[] args) {
        InvocationHandler handler = new InvocationHandler() {
            @Override
            public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                System.out.println(method);
                if (method.getName().equals("morning")) {
                    System.out.println("Good morning, " + args[0]);
                }
                return null;
            }
        };
        Hello hello = (Hello) Proxy.newProxyInstance(
            Hello.class.getClassLoader(), // 传入ClassLoader
            new Class[] { Hello.class }, // 传入要实现的接口
            handler); // 传入处理调用方法的InvocationHandler
        hello.morning("Bob");
    }
}

interface Hello {
    void morning(String name);
}
```

在运行期动态创建一个`interface`实例的方法如下：

1. 定义一个`InvocationHandler`实例，它负责实现接口的方法调用；

2. 通过`Proxy.newProxyInstance()`创建interface实例，它需要3个参数：

   1. 使用的`ClassLoader`，通常就是接口类的`ClassLoader`；
   2. 需要实现的接口数组，至少需要传入一个接口进去；
   3. 用来处理接口方法调用的`InvocationHandler`实例。

3. 将返回的`Object`强制转型为接口。

动态代理实际上是JDK在运行期动态创建class字节码并加载的过程，它并没有什么黑魔法，把上面的动态代理改写为静态实现类大概长这样：

```java
public class HelloDynamicProxy implements Hello {
    InvocationHandler handler;
    public HelloDynamicProxy(InvocationHandler handler) {
        this.handler = handler;
    }
    public void morning(String name) {
        handler.invoke(
           this,
           Hello.class.getMethod("morning"),
           new Object[] { name });
    }
}
```

其实就是JDK帮我们自动编写了一个上述类（不需要源码，可以直接生成字节码），并不存在可以直接实例化接口的黑魔法。

**小结**

Java标准库提供了动态代理功能，允许在运行期动态创建一个接口的实例；

动态代理是通过`Proxy`创建代理对象，然后将接口方法“代理”给`InvocationHandler`完成的。

参考：https://www.jianshu.com/p/9bcac608c714

## JAVA比较器

java的比较器主要分为两种，第一种是实现Comparable接口的内部比较器，第二种是实现Comparator接口的外部比较器。

Comparabel接口的部分源码如下：

```java
public interface Comparable<T> {
    public int compareTo(T o);
}
```

Comparator接口的部分源码如下：

```java
public interface Comparator<T> {
    int compare(T o1, T o2);
}
```

#### 内部比较器--Comparable接口

Comparable接口位于java.lang包下。

当需要对某个类(可以是自己定义的)的对象进行**排序**时候，则需要实现Comparable这个接口，然后重写compareTo方法。我们的类实现这个接口和重写方法后，就可以使用Array.sort()对这个类的实例对象数组进行排序，或者使用Collection.sort对这个类的对象List集合进行排序。我们需要在compareTo方法里定义我们的排序规则。注意：自定义类的时候最好重写顶级父类Object的toString()方法。

案例1：内部比较器

```java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class Employee implements Comparable<Employee> { //这里记得要指定泛型
    private String name;
    private int id;
    private long salary;

    public Employee(String name, int id, long salary) {
        this.name = name;
        this.id = id;
        this.salary = salary;
    }

    @Override
    public int compareTo(Employee o) {
        if (this.salary > o.salary) {
            return (1);
        } else if (this.salary < o.salary) {
            return (-1);
        } else {
            return (0);
        }
    }
    //默认的toString()方法，调用顶级父类Object的toString()方法
//    @Override
//    public String toString() {
//        return super.toString();
//    }

    //super.toString()，父类Object的toString源码如下，该方法默认返回类名和hashCode相关信息
//    public String toString() {
//        return getClass().getName() + "@" + Integer.toHexString(hashCode());
//    }

    //重写toString()方法

    @Override
    public String toString() {
        return (this.name+"\t"+this.id+"\t"+this.salary);
    }
}

class RunClass {
    public static void main(String[] args) {
        Employee[] ems = {
                new Employee("zhansan", 23522, 20000),
                new Employee("lisi", 23436, 24000),
                new Employee("laowang", 235634, 10000)
        };
        System.out.println("===============使用Arrays.sort()来进行排序");
        //排序前
        for(Employee e:ems){
            System.out.println(e.toString());
        }
        Arrays.sort(ems);
        System.out.println("==============");
        //排序后
        for(Employee e:ems){
            System.out.println(e.toString());
        }

        System.out.println("===============使用Arrays.sort()来进行排序");
        List<Employee> myList=new ArrayList<Employee>();
        myList.add(new Employee("zhansan", 23522, 20000));
        myList.add(new Employee("lisi", 23436, 24000));
        myList.add(new Employee("lisi", 23436, 24000));
        //排序前
        for(Employee e:ems){
            System.out.println(e.toString());
        }
        Collections.sort(myList);
        System.out.println("==============");
        //排序后
        for(Employee e:ems){
            System.out.println(e.toString());
        }

    }
}
```

运行输出结果如下：

```java
===============使用Arrays.sort()来进行排序
zhansan	23522	20000
lisi	23436	24000
laowang	235634	10000
==============
laowang	235634	10000
zhansan	23522	20000
lisi	23436	24000
===============使用Arrays.sort()来进行排序
laowang	235634	10000
zhansan	23522	20000
lisi	23436	24000
==============
laowang	235634	10000
zhansan	23522	20000
lisi	23436	24000
```

#### 外部比较器--Comparator接口

Comparatro接口位于java.util包下。

Comparator接口是一个跟Comparable接口功能很相近的比较器。比较大的区别是，实现该接口的类一般是一个独立的类。详情看代码：

```java
import java.util.*;

class Employee{
    private String name;
    private int age;
    private long salary;
    public Employee(String name,int age,long salary){
        this.salary=salary;
        this.name=name;
        this.age=age;
    }

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }

    public long getSalary() {
        return salary;
    }

    @Override
    public String toString() {
        return this.name+"\t"+this.age+"\t"+this.salary;
    }
}
//创建年龄比较器：
class AgeComparator implements Comparator<Employee>{

    @Override
    public int compare(Employee o1, Employee o2) {
        if (o1.getAge()>o2.getAge()){
            return 1;
        }else if(o1.getAge()<o2.getAge()){
            return -1;
        }else {
            return 0;
        }
    }
}
//创建薪水比较器：
class SalaryComparator implements Comparator<Employee>{

    @Override
    public int compare(Employee o1, Employee o2) {
        if (o1.getSalary() > o2.getSalary()) {
            return 1;
        } else if (o1.getSalary() < o2.getSalary()) {
            return -1;
        } else {
            return 0;
        }
    }
}

class RunClass {
    public static void main(String[] args) {
        Employee[] ems = {
                new Employee("zhansan", 26, 30000),
                new Employee("lisi",14, 24000),
                new Employee("laowang",40, 10000)
        };
        System.out.println("===============使用薪水比较器来进行排序");
        //排序前
        for(Employee e:ems){
            System.out.println(e.toString());
        }
        Arrays.sort(ems,new SalaryComparator());  //使用薪水比较器进行排序
        System.out.println("==============");
        //排序后
        for(Employee e:ems){
            System.out.println(e.toString());
        }

        System.out.println("===============使用年龄比较器来进行排序");
        List<Employee> myList=new ArrayList<Employee>();
        myList.add(new Employee("zhansan", 23522, 20000));
        myList.add(new Employee("lisi", 23436, 24000));
        myList.add(new Employee("lisi", 23436, 24000));
        //排序前
        for(Employee e:ems){
            System.out.println(e.toString());
        }
        Collections.sort(myList,new AgeComparator()); //使用年龄比较器进行排序

        System.out.println("==============");
        //排序后
        for(Employee e:ems){
            System.out.println(e.toString());
        }

    }
}
```

运行输出结果如下：

```java
===============使用薪水比较器来进行排序
zhansan	26	30000
lisi	14	24000
laowang	40	10000
==============
laowang	40	10000
lisi	14	24000
zhansan	26	30000
===============使用年龄比较器来进行排序
laowang	40	10000
lisi	14	24000
zhansan	26	30000
==============
laowang	40	10000
lisi	14	24000
zhansan	26	30000
```

#### 内部与外部比较器的区别：

如果定义一个类的时候，没有考虑到排序的问题，即没有实现Comparable接口,那么就可以通过实现Comparator接口来来进行自定义排序。Comparator可以方便使用不同的排序规则，更加灵活一点。

## Filter模式（TODO）