## 1、JVM高频面试题

1、谈谈你对jvm的理解

2、jdk8与jdk7比较有哪些大的改动，解决了什么问题

3、谈谈你对volatile的理解

4、类加载机制以及过程

5、有没有了解过jvm的双亲委派机制

6、有没有用过什么jvm性能分析工具

7、jdk8以及jdk7的垃圾回收机制有哪些异同

…….

## 2、JVM的基本介绍

JVM是Java Virtual Machine（Java[虚拟机](https://baike.baidu.com/item/虚拟机)）的缩写，JVM是一种用于计算设备的规范，它是一个虚构出来的计算机，是通过在实际的计算机上仿真模拟各种计算机功能来实现的

jvm是直接与操作系统进行交互的，与操作系统交互的结构图如下，

![img](jvm.assets/clip_image001.png)

jvm是直接与操作系统进行交互，不会直接与服务器硬件进行交互，可以简单理解jvm就是一台小的电脑，一台运行在我们操作系统之上的虚拟的电脑

 

## 3、一个java文件的生命之旅

![img](jvm.assets/clip_image003.png)

 

1、java文件经过编译之后变成class字节码文件

2、字节码文件通过类加载器(搬运工）被搬运到jvm虚拟机当中来

3、虚拟机当中主要有五大块

a)    方法区：线程共享区域，存在多线程安全问题，主要存放全局变量，常量，静态变量等

b)   堆：线程共享区域，存在多线程安全问题，主要存放对象实例和数组等

c)    虚拟机栈：线程不同享区域，不存在多线程安全问题，主要存放局部变量等

d)   本地方法栈：线程不共享区域，不存在多线程安全问题，主要负责去调用一些底层的C程序实现，一般不做研究

e)    程序计数器：线程不共享区域，不存在多线程安全问题，一般不做研究

下面是一个程序代码的执行过程

```java
Animal.java
public class Animal {
    public String name;
    public Animal(String name) {
        this.name = name;
    }
    public void printName() {
        System.out.println("Animal ["+name+"]");
    }
}
MainApp.java
public class MainApp {
    public static void main(String[] args) {
        Animal animal = new Animal("Puppy");
        animal.printName();
    }
}

```



下面是程序运行的详细步骤：

1. 在编译好java程序得到MainApp.class文件后，执行MainApp。

   系统就会启动一个jvm进程，jvm进程从classpath路径中找到一个名为MainApp.class的二进制文件，**将MainApp的类信息加载到运行时数据区的方法区内**，这个过程叫做MainApp类的加载。

2. JVM找到AppMain的主函数入口，开始执行main函数。

3. main函数的第一条命令是Animal animal = new Animal("Puppy");

   就是让JVM创建一个Animal对象，但是这时候方法区中没有Animal类的信息，所以JVM马上加载Animal类，**把Animal类的类型信息放到方法区中**。

4. 加载完Animal类之后，Java虚拟机做的第一件事情就是**在堆区中为一个新的Animal实例分配内存, 然后调用构造函数初始化Animal实例，这个Animal实例持有着指向方法区的Animal类的类型信息**（其中包含有方法表，java动态绑定的底层实现）的引用。

5. 当使用animal.printName()的时候，JVM根据animal引用找到Animal对象，然后根据Animal对象持有的引用定位到方法区中Animal类的类型信息的方法表，获得printName()函数的字节码的地址。

6. 开始运行printName()函数。

## 4、类加载器的基本介绍

![img](jvm.assets/clip_image004.png)

类加载器负责加载class文件，**class文件在文件开头有特定的文件标示**，将class文件**字节码内容**加载到内存中，并将这些内容**转换成方法区中的运行时的数据结构**并且ClassLoader**只负责class文件的加载**，至于它是否可以运行，则由Execution Engine决定 

### 1、类加载器的过程

从类被加载到虚拟机内存中开始，到卸御出内存为止，它的**整个生命周期分为7个阶段**:

加载(Loading)、验证(Verification)、准备(Preparation)、解析(Resolution)、初始化(Initialization)、使用(Using)、卸御(Unloading)。其中验证、准备、解析三个部分统称为连接。 7个阶段发生的顺序如下：

![img](jvm.assets/clip_image006.png)

 

#### 1、加载：

1、将class文件加载在内存中。

2、将静态数据结构(数据存在于class文件的结构)转化成方法区中运行时的数据结构。

注意：方法区中如果出现OOM，那么多半是因为加载的依赖太多

4、在堆中生成一个代表这个类的java.lang.Class对象，作为数据访问的入口

#### 2、链接

**private** **static** **int** a = 3 ; 

a = 0 ; 

1、验证：**确保加载的类符合JVM规范与安全**。保证被校验类的方法在运行时不会做出危害虚拟机安全的事件

2、准备：**为static变量在方法区中分配空间，设置变量的初始值**。例如static int a=3，在此阶段会a被初始化为0；

注意：准备阶段，只设置类中的静态变量（方法区中），不包括实例变量（堆内存中），实例变量是在对象初始化的时候分配值的

3、解析：

解析阶段是虚拟机将**常量池**内的**符号引用**替换为**直接引用**的过程。

符号引用：简单的理解就是字符串，比如引用一个类，java.util.ArrayList 这就是一个符号引用

直接引用：**指针或者地址偏移量**。引用对象一定在内存（已经加载）。

#### 3、初始化

初始化是类加载的最后阶段，初始化阶段是执行类构造器`<clinit>()`方法。在类构造器方法中，它将**由编译器自动收集类中的所有类变量的赋值动作**(<!--准备阶段的a正式被赋值3-->)和静态变量与静态语句块static{}合并

**初始化，为类的静态变量赋予正确的初始值**

 

#### 4、使用，卸载

使用：正常使用

卸载：GC把无用的对象从内存中卸载

 

### 2、类加载器的加载顺序

加载一个类进来之后，需要经过加载，链接，初始化，使用，卸载等一系列步骤，那么我们**加载一个class类的顺序也是有优先级的**，先加载我们**rt.jar**这个jar包下面的class类，所以我们才能够使用如下代码

```java
HashMap<String,String> hashMap = new HashMap<String,String>()
```

![img](jvm.assets/clip_image008.png)

1）Bootstrap ClassLoader

负责加载$JAVA_HOME中**jre/lib/rt.jar**里所有的 class，由 C++ 实现，不是 ClassLoader 子类。(java.lang下有个很重要的类ClassLoader，这个类主要就是用来把指定名称(指定路径下)的类加载到JVM中)

2）Extension ClassLoader

负责加载Java平台中**扩展功能的一些 jar 包**，包括$JAVA_HOME中**jre/lib/*.jar**或**-Djava.ext.dirs**指定目录下的 jar 包。

3）App ClassLoader

负责**加载 classpath 中指定的 jar 包及目录中 class**。

4）Custom ClassLoader

属于应用程序**根据自身需要自定义的 ClassLoader**，如 Tomcat、jboss 都会根据 J2EE 规范自行实现 ClassLoader。

加载过程中会先检查类是否被已加载（先检查后加载），**检查顺序是自底向上**，从 Custom ClassLoader 到 BootStrap ClassLoader 逐层检查，**只要某个 Classloader 已加载就视为已加载此类，保证此类只被所有 ClassLoader 加载一次**。而==加载的顺序是自顶向下，也就是由上层来逐层尝试加载此类。==

 

![img](jvm.assets/clip_image010.png)

 

验证类加载器机制：

```java
public class ClassLoaderTest {
    public static void main(String[] args) {
        ClassLoader loader = Thread.currentThread().getContextClassLoader();
        System.out.println(loader);
        System.out.println(loader.getParent());
        System.out.println(loader.getParent().getParent());
    }
}
```

在获取ExtClassLoader的父loader的时候出现了null，这是因为Bootstrap Loader（引导类加载器）是用C++语言实现的，找不到一个确定的返回父Loader的方式，于是就返回null

### 3、类加载器当中的双亲委派机制

当一个类收到了类加载请求，他**首先不会尝试自己去加载这个类**，而是把这个请求委派给父类去完成，每一个层次类加载器都是如此，因此所有的加载请求都应该传送到启动类加载其中，**只有当父类加载器反馈自己无法完成这个请求的时候（在它的加载路径下没有找到所需加载的Class），子类加载器才会尝试自己去加载。** (==层层往上捅==)

采用双亲委派的一个好处是比如加载位于 rt.jar 包中的类 java.lang.Object，不管是哪个加载器加载这个类，最终都是委托给**顶层的启动类**加载器进行加载，这样就**保证了使用不同的类加载器最终得到的都是同样一个 Object对象。** 

运行以下代码查看效果

```java
package java.lang;

public class String {
    public static void main(String[] args) {
        System.out.println("hello world");
    }

}

//运行时，其实找到的是rt.jar包中的java.lang.String类（层层网上捅）
```

 运行结果报错如下：

错误: 在类 java.lang.String 中找不到 main 方法, 请将 main 方法定义为:

  public static void main(String[] args)

否则 JavaFX 应用程序类必须扩展javafx.application.Application

为了**保证我们开发的代码，不会污染java当中自带的源代码**，保证我们**使用的class类都是最终的一个**，所以才会有双亲委派这种机制，提供一种**沙箱**环境来保证我们加载的class类都是同一个

遵循一个原则：层层向上找，先找到先使用，后面的一概不见

## 5、运行时的数据区域

### 1、本地方法栈Native Method Stack（了解）

![img](jvm.assets/clip_image012.png)

本地方法栈（Native Method Stacks）与虚拟机栈所发挥的作用是非常相似的，其区别不过是虚拟机栈为虚拟机执行Java方法（也就是字节码）服务，而本地方法栈则是为虚拟机使用到的Native方法服务(比如C语言写的程序和C++写的程序)

参见代码如下：

```java
package com.kkb.stack;

public class MyStack {
    public static void main(String[] args) {
        Thread thread = new Thread();
        thread.start();
    }
}
```

 查看start方法实现：

![img](jvm.assets/clip_image014.jpg)

追踪start0方法，

![img](jvm.assets/clip_image016.jpg)

**标示了native关键字，说明java这里调用了C程序的语言库当中的方法，或者调用了操作系统当中的方法等，已经是java语言没法搞定的范畴了**。一般native修饰的方法都放在了本地方法栈Native Method Stack

### 2、本地接口Native Interface（了解）

本地接口的作用是融合不同的编程语言为 Java 所用，它的初衷是融合 C/C++程序，**Java 诞生的时候是 C/C++横行的时候，要想立足，必须有调用 C/C++程序，于是就在内存中专门开辟了一块区域处理标记为native的代码**，它的具体做法是 Native Method Stack中登记 native方法，在Execution Engine 执行时加载native libraies。

目前该方法使用的越来越少了，除非是与硬件有关的应用，比如通过Java程序驱动打印机或者Java系统管理生产设备，在企业级应用中已经比较少见。因为现在的异构领域间的通信很发达，比如可以使用 Socket通信，也可以使用Web Service等等，不多做介绍。

### 3、程序计数器/PC寄存器

 

![img](jvm.assets/clip_image018.png)

PC寄存器（程序计数器）**就是一个指针**，指向我们下一个需要运行的方法

程序计数器是一块非常小的内存空间，主要是用来对当前线程所执行的字节码的行号指示器；

而且程序计数器是内存区域中**唯一一块不存在OutOfMemoryError的区域**

每个线程都有一个程序计数器，是**线程私有的**,就是一个指针，指向方法区中的方法字节码（**用来存储指向下一条指令的地址,也即将要执行的指令代码**），由执行引擎读取下一条指令，是一个非常小的内存空间，几乎可以忽略不记。

这块内存区域很小，它是当前线程所执行的字节码的行号指示器，字节码解释器通过改变这个计数器的值来选取下一条需要执行的字节码指令。

如果执行的是一个Native方法，那这个计数器是**空的**。

用以**完成分支、循环、跳转、异常处理、线程恢复等基础功能**。不会发生内存溢出(OutOfMemory=OOM)错误

### 4、方法区Method Area

![img](jvm.assets/clip_image020.png)

 

方法区和java堆一样，是**线程共享的**区域；它主要存储了**每一个类的结构信息（元数据信息：类名、类位置...）**

**方法区的作用的就是用来存储：已经被虚拟机加载的**类信息、常量、静态变量等；

而且方法区还有另一种叫法：【非堆】，也有人给方法区叫做**永久代（把不会回收的东西放在方法区里）**

当方法区存储信息过大时候，也就是无法满足内存分配的时候会报错

上面讲的是规范，在不同虚拟机里头实现是不一样的，最典型的就是永久代(PermGen space)和元空间(Metaspace)。

But，实例变量存在堆内存中,和方法区无关

### 5、java虚拟机栈

**栈管运行，堆管存储==》结论，背下来**

![img](jvm.assets/clip_image022.png)

 

#### 1、虚拟机栈的基本介绍

程序员经常说“堆栈”，其中的**栈就是虚拟机栈**。

**虚拟机栈描述的是：Java方法执行的内存模型；**（说白了就是：虚拟机栈就是用来存储：局部变量表、栈操作、动态链表、方法出口这些东西；

```java
public class Person{
    int b=30; //方法区
    public void sayHello(){
        int a=20;  //局部变量，存在栈里面
    }
}
```

这些东西有个特点：都是**线程私有的**，所以虚拟机栈是线程私有的

对于虚拟机栈可能出现的异常有两种：

1：**如果线程请求的栈深度大于虚拟机栈允许的最大深度**，报错：**StackOverflowError**

（这种错误**经常出现在递归操作中**，无限制的反复调用方法，最终导致压栈深度超过虚拟机允许的最大深度，就会报错）

2：java的虚拟机栈可以进行动态扩展，但随着**扩展会不断的申请内存，当无法申请足够内存的时候就会报错：OutOfMemoryError**

不断入栈，导致栈溢出

```java
package com.kkb.stack;
public class StackException {
    int i = 0;
    public static void main(String[] args) {
        StackException stackException = new StackException();
        stackException.stackExcept();
    }

    public void stackExcept(){
        i ++ ;
        System.out.println("入栈第" + i + "次");
        stackExcept();
    }
}
```



 

 

#### 2、虚拟机栈的生命周期

**对于栈来说，不存在垃圾回收问题**，只要程序执行结束，栈就over释放，生命周期和线程一致，是私有线程区域。**8种基本类型的变量+对象的引用变量+实例方法都是在函数的栈内存中分配。**

#### 3、虚拟机栈当中究竟存放了什么数据

==栈帧==中主要保存3 类数据：

**局部变量（Local Variables）**:输入参数和输出参数以及方法内的变量。八种基本数据类型 + 引用类型（String，以及自己定义的class类等）

**栈操作（Operand Stack）**:记录出栈、入栈的操作；

**栈帧数据（Frame Data）**:包括类文件、方法等等。

 

#### 4、虚拟机栈运行原理

栈中的数据都是以**栈帧（Stack Frame）的格式**存在，栈帧是**一个内存区块**，是一个数据集，**是一个有关方法(Method)和运行期数据的数据集**，**当一个方法A被调用时就产生了一个栈帧 F1，并被压入到栈中**，==说白了，在java中，栈帧就是java的方法==

A方法又调用了 B方法，于是产生栈帧 F2 也被压入栈，

B方法又调用了 C方法，于是产生栈帧 F3 也被压入栈，

……

执行完毕后，先弹出F3栈帧，再弹出F2栈帧，再弹出F1栈帧……

==遵循“先进后出”/“后进先出”原则。==

**每个方法执行的同时都会创建一个栈帧，用于存储局部变量表、操作数栈、动态链接、方法出口等信息**，每一个方法从调用直至执行完毕的过程，就对应着一个栈帧在虚拟机中入栈到出栈的过程。**栈的大小和具体JVM的实现有关，通常在256K~756K之间,约等于1Mb左右。**

```java
package com.kkb.stack;
public class StackIn {
    //程序入口方法
    public static void main(String[] args) {
        StackIn stackIn = new StackIn();
        //调用A 方法，产生了栈帧 F1
        stackIn.A();
    }
    //最后弹出F1
    public void A(){
        System.out.println("A");
        // F1栈帧里面调用B方法，产生栈帧F2
        B();
    }

    //然后弹出F2
    public void B(){
        //F2栈帧里面调用C方法，产生栈帧F3
        System.out.println("B");
        C();
    }

    //栈帧F3  执行完成之后，先弹出F3
    public void C(){
        System.out.println("C");
    }
}
```

 

![img](jvm.assets/clip_image024.png)

#### 5、局部变量复用slot

局部变量表用于**存放**方法参数和方法内部**定义的局部变量**。方法表的Code属性: max_locals 数据项指明了该方法所需要分配的局部变量表的最大容量。

局部变量表的容量**以Slot（Variable Slot：变量槽）为最小单位**，其中64位长度的long和double类型的数据占用2个Slot，其余数据类型（boolean、byte、char、short、int、float、reference、returnAddress）占用一个Slot（一个Slot可以存放32位以内的数据类型）

虚拟机通过索引定位的方式使用局部变量表，索引值的范围是从0到局部变量表最大Slot数量。32位数据类型的变量，索引n就代表使用第n个Slot，如果是64位数据类型的变量，则说明会同时使用n和n+1两个Slot。

在方法执行时，虚拟机是使用局部变量表完成参数值到参数变量列表的传递过程，如果是实例方法（非static的方法）那么局部变量表中第0位的Slot默认是用于传递方法所属实例对象的引用，在方法中可以通过 this 关键字来访问到这个隐含的参数，其余参数则按参数表顺序排列，占用从索引1开始的局部变量Slot。参数列表分配完毕后，再根据方法体内部定义的变量顺序和作用域分配其余的Slot。

**为了节省栈帧空间，局部变量表中的Slot是可以复用的**，当方法执行位置已经（程序计数器在字节码的值）超过了某个变量，那么这个变量的Slot可以被其他变量复用。

**除了能节省栈帧空间，还伴随着可能会影响到系统垃圾收集的行为。**

```java
package com.kkb.stack;

public class StackGc {
    示例一  垃圾没有被回收
    public static void main(String[] args) {
        // 向内存填充64M的数据
        byte[] placeholder = new byte[64 * 1024 * 1024];
        System.gc();
    }

    示例二  垃圾没有被回收
   public static void main(String[] args) {
        // 向内存填充64M的数据
        {
            byte[] placeholder = new byte[64 * 1024 * 1024];
        }
        System.gc();
    }

    示例三  垃圾被回收
   public static void main(String[] args) {
        // 向内存填充64M的数据
        {
            byte[] placeholder = new byte[64 * 1024 * 1024];
        }
        int a = 0;
        System.gc();
    }
}
```

 在IDEA当中执行以上代码，并**加上参数 -verbose:gc 来查看我们的GC回收信息**，我们会发现第一个方法没有GC回收，第二个方法没有垃圾回收，第三个方法GC回收了

能否被回收的关键因素就是变量是否还有被引用，在**第三个示例当中int a = 0;这个变量没有被其他引用，导致垃圾回收工作，回收垃圾**

#### 6、方法的参数对调用次数的影响

如果一个方法有参数列表，一个方法没有参数列表，形式参见如下

```java
public class MethodParameter {
    private static int count = 0;

    public static void recursion(int a, int b, int c) {
        System.out.println("我是有参数的方法，调用第" + count+"次");
        long l1 = 12;
        short sl = 1;
        byte b1 = 1;
        String s = "1";
        count++;
        recursion(1, 2, 3);
    }
    public static void recursion() {
        System.out.println("我是没有参数的方法，调用第" + count+"次");
        count++;
        recursion();
    }

    public static void main(String[] args) {
       // recursion();
        recursion(1, 2, 3);
    }
}
```

运行不同的重载方法，我们会明显的发现，**没有参数的方法，调用的次数会更多，因为我们的参数就是局部变量，局部变量的装载也需要一定的内存空间**

我们**可以通过参数 -Xss160K 来调整我们的每个线程的堆栈大小**，但是无论如何调整栈空间大小，依然会发现没有参数且没有局部变量的方法调用次数远远比有参数有局部变量的方法调用的次数多得多。栈的大小和具体JVM的实现有关，**通常在256K~756K之间**,与等于1Mb左右

### 6、java虚拟机堆

![img](jvm.assets/clip_image026.png)

#### 1、JVM虚拟机堆的基本组成介绍

1. JVM内存划分为**堆内存**和**非堆内存**，堆内存分为**年轻代**（Young Generation）、**老年代**（Old Generation），非堆内存就一个**永久代**（Permanent Generation）。
2. 年轻代又分为**Eden**和**Survivor**区。Survivor区由**FromSpace**和**ToSpace**组成。Eden区占大容量，Survivor两个区占小容量，默认比例是8:1:1。
3. 堆内存用途：**存放的是对象**，垃圾收集器就是收集这些对象，然后根据GC算法回收。
4. 非堆内存用途：**永久代，也称为方法区，存储程序运行时长期存活的对象**，比如类的元数据、方法、常量、属性等。

![img](jvm.assets/clip_image028.png)

**在JDK1.8版本废弃了永久代，替代的是元空间（MetaSpace）**，元空间与永久代上类似，**都是方法区的实现**，他们最大区别是：==元空间并不在JVM中，而是使用本地内存==。

元空间有两个参数：

- MetaspaceSize ：初始化元空间大小，控制发生GC阈值
- MaxMetaspaceSize ： 限制元空间大小上限，防止异常占用过多物理内存

 

#### 2、jdk1.8为什么要移除永久代

在**jdk1.8当中已经不存在永久代这一说了**，取而代之的是**元数据区**，元数据区与永久代的功能类似，**都是用于存放一些不会被回收的对象**，例如我们的数据库连接池这样的对象等，只不过在1.8当中元数据区最大的特性就是使用了**堆外内存**，也就是**操作系统级别的物理内存**，数据直接保存到了物理内存当中去了。

移除永久代原因：**为融合HotSpot JVM与JRockit VM（新JVM技术）而做出的改变**，因为JRockit没有永久代。==有了元空间就不再会出现永久代OOM问题了！==

#### 3、新生代介绍

**新生成的对象首先放到年轻代Eden区**，当Eden空间满了，触发**Minor GC**，存活下来的对象移动到Survivor0区，Survivor0区满后触发执行Minor GC，Survivor0区存活对象移动到Suvivor1区，这样==保证了一段时间内总有一个survivor区为空==。经过多次Minor GC仍然存活的对象移动到老年代。

 老年代存储长期存活的对象，占满时会触发**Major GC or Full GC**，**GC期间会停止所有线程等待GC完成**，进行养老区的内存清理，所以对响应要求高的应用尽量减少发生Major GC（Full GC），避免响应超时，。**若养老区执行了Full GC之后发现依然无法进行对象的保存，就会产生OOM异常“OutOfMemoryError”。**

如果出现java.lang.OutOfMemoryError: Java heap space异常，说明Java虚拟机的堆内存不够。原因有二：

（1）Java虚拟机的堆内存设置不够，可以通过参数-Xms、-Xmx来调整。

（2）代码中创建了大量大对象，并且长时间不能被垃圾收集器收集（==存在被引用==）

> Minor GC ： 清理年轻代 
>
> Major GC ： 清理老年代
>
> Full GC ： 清理整个堆空间，包括年轻代和永久代
>
> **所有GC都会停止应用所有线程。**

![img](jvm.assets/clip_image030.png)

![img](jvm.assets/clip_image032.png)

#### 4、如何判断哪些数据需要go die

![img](jvm.assets/clip_image034.png)

 

介绍了Java内存运行时区域的各个部分，其中程序计数器、虚拟机栈、本地方法栈，3个区域随着线程的生存而生存的。内存分配和回收都是确定的。随着线程的结束内存自然就被回收了，因此不需要考虑垃圾回收的问题。而**Java堆和方法区则不一样，各线程共享，内存的分配和回收都是动态的。因此垃圾收集器所关注的都是堆和方法区这部分内存。**

接下来我们就讨论Jvm是怎么回收这部分内存的。在进行回收前垃圾收集器第一件事情就是**确定哪些对象还存活**，**哪些已经死去**。下面介绍两种基础的回收算法

##### 1、引用计数器计算方法

给对象添加一个引用计数器，每当有一个地方引用它时计数器就+1，当引用失效时计数器就-1,。只要计数器等于0的对象就是不可能再被使用的。

此算法在大部分情况下都是一个不错的选择，也有一些著名的应用案例。但是Java虚拟机中是没有使用的。

**优点**：实现简单、判断效率高。

**缺点**：很难解决==对象之间循环引用==的问题。例如下面这个例子

```java
Object a = new Object();
Object b = new Object();
a=b;
b=a;
a=b=null; 
//这样就导致gc无法回收他们。　
```



##### 2、可达性分析计算方法

通过一系列的称为**“GC Roots”**的对象作为起始点，从这些节点开始向下搜索，搜索所走过的路径称为**引用链**，当一个对象到**GC Roots没有使用任何引用链时，则说明该对象是不可用的**。

主流的商用程序语言（Java、C#等）在**主流的实现中，都是通过可达性分析来判定对象是否存活的**。

通过下图来清晰的感受gc root与对象展示的联系。所示灰色区域对象是存活的，Object5/6/7均是可回收的对象

![img](jvm.assets/clip_image036.png)

　在Java语言中，可作为GC Roots 的对象包括下面几种

1. 虚拟机栈（栈帧中的本地变量表）中引用的对象
2. 方法区中静态变量引用的对象
3. 方法区中常量引用的对象
4. 本地方法栈（即一般说的 Native 方法）中JNI引用的对象

　**优点**：更加精确和严谨，可以分析出==循环数据结构==相互引用的情况；

　**缺点**：实现比较复杂、需要分析大量数据，消耗大量时间、分析过程需要GC停顿（引用关系不能发生变化），即停顿所有Java执行线程（称为**"Stop The World"，是垃圾回收重点关注的问题**）。

#### 5、如何确切宣告一个对象的死亡

**宣告一个对象死亡，至少要经历两次标记。**

##### 　　1、第一次标记

如果对象进行可达性分析算法之后没发现与GC Roots相连的引用链，那它将会==第一次标记并且进行一次筛选==。

**筛选条件**：判断此对象是否有必要执行finalize()方法。

finalize()是Object中的方法，当垃圾回收器将要回收对象所占内存之前被调用，即当一个对象被虚拟机宣告死亡时会先调用它finalize()方法，让此对象处理它生前的最后事情（==这个对象可以趁这个时机挣脱死亡的命运==）

**筛选结果**：当对象没有覆盖finalize()方法、或者finalize()方法已经被JVM执行过，则判定为可回收对象。如果对象有必要执行finalize()方法，则被放入F-Queue队列中。稍后在JVM自动建立、低优先级的Finalizer线程（可能多个线程）中触发这个方法；　　

##### 　　2、第二次标记

GC对F-Queue队列中的对象进行二次标记。

**如果对象在finalize()方法中重新与引用链上的任何一个对象建立了关联，那么二次标记时则会将它移出“即将回收”集合。**如果此时对象还没成功逃脱，那么只能被回收了。

##### 　　3、finalize() 方法

finalize()是Object类的一个方法、一个对象的finalize()方法只会被系统自动调用一次，经过finalize()方法逃脱死亡的对象，第二次不会再调用；

特别说明：==并不提倡在程序中调用finalize()来进行自救。建议忘掉Java程序中该方法的存在。==因为它执行的时间不确定，甚至是否被执行也不确定（Java程序的不正常退出），而且运行代价高昂，无法保证各个对象的调用顺序（甚至有不同线程中调用）。 

#### 6、垃圾回收复制标记整理算法

由于垃圾收集算法的实现涉及大量的程序细节。因此本节不打算过多地讨论算法的实现，只是介绍几种算法的思想及其发展过程。主要涉及的算法有**标记-清除算法、复制算法、标记-整理算法、分代收集算法**。

##### 标记-清除算法

最基础的收集算法是”标记-清除“（Mark-Sweep）算法，如同它的名字一样，算法分为”标记“和”清除两个阶段“：首先标记出所有需要回收的对象，在标记完成后统一回收所有被标记的对象。之所以说它是最基础的收集算法，是因为后续的收集算法都是基于这种思路并对其不足进行改进而得到的。

它的主要不足有两个：一个是效率问题，**标记和清除两个过程的效率都不高**；另一个是空间问题，标记清除之后会产生大量**不连续的内存碎片**，空间碎片太多可能会导致以后在程序运行过程中需要分配较大对象时，无法找到足够的连续内存而不得不提前触发另一次垃圾收集动作。标记-清除算法的执行过程如图所示：

 

![img](jvm.assets/clip_image038.png)

##### 复制算法

为了解决效率问题，一种称为“复制”（Copying）的收集算法出现了，它将可用内存按容量划分为大小相等的两块，每次只使用其中的一块。当这一块的内存用完了，就将还存活着的对象复制到另外一块上面，然后再把已使用过的内存空间一次清理掉。这样使得每次都是对整个半区进行内存回收，内存分配时也就不用考虑内存碎片等复杂情况，只要移动堆顶指针，按顺序分配内存即可，实现简单，运行高效。只是**这种算法的代价是将内存缩小为原来的一半**，未免太高了一点。复制算法的执行过程如图所示：

![img](jvm.assets/clip_image040.png)

 

**现在的商业虚拟机都采用这种收集算法来回收==新生代==**，IBM公司的专门研究表明，新生代中的对象98%是“朝生夕灭”的，所以并不需要按照 1:1 的比例来划分内存空间，而是将内存分为一块较大的Eden空间和两块较小的Survivor空间，**每次使用Eden和其中一块Survivor**。==当回收时，将Eden和Survivor中还存活着的对象一次性地复制到另外一块Survivor空间上，最后清理掉Eden和刚才用过的Survivor空间==。HotSpot虚拟机默认Eden和Survivor的大小比例是8:1，也就是每次新生代中可用内存空间为整个新生代容量的90%（80%+10%），只有10%的内存会被“浪费”。当然，98%的对象可回收只是一般场景下的数据，我们**没有办法保证每次回收都只有不多于10%的对象存活**，当Survivor空间不够用时，需要依赖其他内存（这里指老年代）进行分配**==担保==（Handle Promotion）**。

##### 标记-整理算法

**复制收集算法在对象存活率较高时就要进行较多的复制操作，效率将会变低**。更关键的是，如果不想浪费50%的空间，就需要有额外的空间进行**分配担保**，以应对被使用的内存中所有对象都100%存活的极端情况，所以在老年代一般不能直接选用这种算法。

**根据老年代的特点**，有人提出了另外一种“标记-整理”（Mark-Compact）算法，标记过程仍然与“标记-清除”算法一样，但后续步骤不是直接对可回收对象进行清理，而是**让所有存活的对象都向一端移动**，然后直接清理掉边界以外的内存，“标记-整理”算法的示意图如下：

 ![img](jvm.assets/clip_image042.png)

 

##### 分代收集算法

当前商业虚拟机的垃圾收集都采用“分代收集”（Generational Collection）算法，这种算法并没有什么新的思想，只是根据对象存活周期的不同将内存划分为几块。一般是把**Java堆分为新生代和老年代**，这样就可以根据各个年代的特点采用最适当的收集算法。在**新生代**中，每次垃圾收集时都发现有大批对象死去，只有少量存活，那就选用**复制算法**，只需要付出少量存活对象的复制成本就可以完成收集。而**老年代**中因为对象存活率高、没有额外空间对它进行分配担保，就必须使用“**标记-清理”或者“标记-整理”**算法来进行回收。

 

 

#### 7、垃圾回收器介绍

垃圾回收器是垃圾回收算法的实现。以下罗列了HotSpot VM中的垃圾回收器，以及适用场景 ：

![img](jvm.assets/clip_image044.jpg)

到**jdk8**为止，**默认的垃圾收集器是Parallel Scavenge 和 Parallel Old**

从**jdk9**开始，**G1收集器成为默认的垃圾收集器**

目前来看，==G1回收器停顿时间最短而且没有明显缺点==，非常适合Web应用。在jdk8中测试Web应用，堆内存6G，新生代4.5G的情况下，Parallel Scavenge 回收新生代停顿长达1.5秒。G1回收器回收同样大小的新生代只停顿0.2秒。

#### 8、JVM常用调整参数介绍

重点关注下列表中所有的==标红参数==。

**JVM**参数的含义实例见[实例分析](http://www.cnblogs.com/redcreen/archive/2011/05/05/2038331.html)

|          **参数名称**          | **含义**                                                   | **默认值**           |                                                              |
| :----------------------------: | ---------------------------------------------------------- | -------------------- | ------------------------------------------------------------ |
|            **-Xms**            | 初始堆大小                                                 | 物理内存的1/64(<1GB) | 默认(MinHeapFreeRatio参数可以调整)空余堆内存小于40%时，JVM就会增大堆直到-Xmx的最大限制. |
|            **-Xmx**            | 最大堆大小                                                 | 物理内存的1/4(<1GB)  | 默认(MaxHeapFreeRatio参数可以调整)空余堆内存大于70%时，JVM会减少堆直到 -Xms的最小限制（==工作中最大堆与初始堆大小一般设置为相等，防止频繁GC==） |
|            **-Xmn**            | 年轻代大小(1.4or lator)                                    |                      | ==注意==：此处的大小是（eden+  2 survivor space).与jmap -heap中显示的New gen是不同的。   整个堆大小=年轻代大小 + 老年代大小 + 持久代（永久代）大小.   ==增大年轻代后,将会减小年老代大小.此值对系统性能影响较大==,Sun官方推荐配置为整个堆的3/8 |
|        **-XX:NewSize**         | 设置年轻代大小(for 1.3/1.4)                                |                      |                                                              |
|       **-XX:MaxNewSize**       | 年轻代最大值(for 1.3/1.4)                                  |                      |                                                              |
|        **-XX:PermSize**        | 设置持久代(perm gen)初始值                                 | 物理内存的1/64       |                                                              |
|      **-XX:MaxPermSize**       | 设置持久代最大值                                           | 物理内存的1/4        |                                                              |
|            **-Xss**            | 每个线程的堆栈大小                                         |                      | JDK5.0以后每个线程堆栈大小为1M,以前每个线程堆栈大小为256K.更具应用的线程所需内存大小进行 调整.在相同物理内存下,减小这个值能生成更多的线程.但是操作系统对一个进程内的线程数还是有限制的,不能无限生成,经验值在3000~5000左右   一般小的应用， 如果栈不是很深， 应该是128k够用的 大的应用建议使用256k。这个选项对性能影响比较大，需要严格的测试。（校长）   和threadstacksize选项解释很类似,官方文档似乎没有解释,在论坛中有这样一句话:"”   -Xss is translated in a VM flag named ThreadStackSize”   一般设置这个值就可以了。 |
|     -*XX:ThreadStackSize*      | Thread Stack Size                                          |                      | (0 means use default stack size) [Sparc: 512; Solaris x86: 320  (was 256 prior in 5.0 and earlier); Sparc 64 bit: 1024; Linux amd64: 1024  (was 0 in 5.0 and earlier); all others 0.] |
|        **-XX:NewRatio**        | 年轻代(包括Eden和两个Survivor区)与年老代的比值(除去持久代) |                      | -XX:NewRatio=4表示年轻代与年老代所占比值为1:4,年轻代占整个堆栈的1/5   Xms=Xmx并且设置了Xmn的情况下，该参数不需要进行设置。 |
|     **-XX:SurvivorRatio**      | Eden区与Survivor区的大小比值                               |                      | 设置为8,则两个Survivor区与一个Eden区的比值为2:8,一个Survivor区占整个年轻代的1/10 |
|    -XX:LargePageSizeInBytes    | 内存页的大小不可设置过大， 会影响Perm的大小                |                      | =128m                                                        |
|  -XX:+UseFastAccessorMethods   | 原始类型的快速优化                                         |                      |                                                              |
|   **-XX:+DisableExplicitGC**   | 关闭System.gc()                                            |                      | 这个参数需要严格的测试                                       |
|    -XX:MaxTenuringThreshold    | 垃圾最大年龄                                               |                      | 如果设置为0的话,则年轻代对象不经过Survivor区,直接进入年老代. 对于年老代比较多的应用,可以提高效率.如果将此值设置为一个较大值,则年轻代对象会在Survivor区进行多次复制,这样可以增加对象再年轻代的存活 时间,增加在年轻代即被回收的概率   该参数只有在串行GC时才有效. |
|      -XX:+AggressiveOpts       | 加快编译                                                   |                      |                                                              |
|     -XX:+UseBiasedLocking      | 锁机制的性能改善                                           |                      |                                                              |
|          -Xnoclassgc           | 禁用垃圾回收                                               |                      |                                                              |
|  -XX:SoftRefLRUPolicyMSPerMB   | 每兆堆空闲空间中SoftReference的存活时间                    | 1s                   | softly reachable objects will remain alive for some amount of  time after the last time they were referenced. The default value is one  second of lifetime per free megabyte in the heap |
| **-XX:PretenureSizeThreshold** | 对象超过多大是直接在旧生代(老年代)分配                     | 0                    | 单位字节 新生代采用Parallel  Scavenge GC时无效   另一种直接在旧生代分配的情况是大的数组对象,且数组中无外部引用对象. |
|   -XX:TLABWasteTargetPercent   | TLAB占eden区的百分比                                       | 1%                   |                                                              |
|    -XX:+*CollectGen0First*     | FullGC时是否先YGC                                          | false                |                                                              |

**并行收集器相关参数**

|     -XX:+UseParallelGC      | Full GC采用parallel MSC   (此项待验证)            |      | 选择垃圾收集器为并行收集器.此配置仅对年轻代有效.即上述配置下,年轻代使用并发收集,而年老代仍旧使用串行收集.(此项待验证) |
| :-------------------------: | ------------------------------------------------- | ---- | ------------------------------------------------------------ |
|      -XX:+UseParNewGC       | 设置年轻代为并行收集                              |      | 可与CMS收集同时使用   JDK5.0以上,JVM会根据系统配置自行设置,所以无需再设置此值 |
|  **-XX:ParallelGCThreads**  | 并行收集器的线程数(使用多少个线程回收垃圾)        |      | 此值最好配置与处理器数目相等 同样适用于CMS                   |
|    -XX:+UseParallelOldGC    | 年老代垃圾收集方式为并行收集(Parallel Compacting) |      | 这个是JAVA 6出现的参数选项                                   |
|  **-XX:MaxGCPauseMillis**   | 每次年轻代垃圾回收的最长时间(最大暂停时间)        |      | 如果无法满足此时间,JVM会自动调整年轻代大小,以满足此值.       |
| -XX:+UseAdaptiveSizePolicy  | 自动选择年轻代区大小和相应的Survivor区比例        |      | 设置此选项后,并行收集器会自动选择年轻代区大小和相应的Survivor区比例,以达到目标系统规定的最低相应时间或者收集频率等,此值建议使用并行收集器时,一直打开. |
|       -XX:GCTimeRatio       | 设置垃圾回收时间占程序运行时间的百分比            |      | 公式为1/(1+n)                                                |
| -XX:+*ScavengeBeforeFullGC* | Full GC前调用YGC                                  | true | Do young generation GC prior to a full GC. (Introduced in  1.4.1.) |

**CMS**相关参数

| -XX:+UseConcMarkSweepGC                | 使用CMS内存收集                             |      | 测试中配置这个以后,-XX:NewRatio=4的配置失效了,原因不明.所以,此时年轻代大小最好用-Xmn设置.??? |
| -------------------------------------- | ------------------------------------------- | ---- | ------------------------------------------------------------ |
| -XX:+AggressiveHeap                    |                                             |      | 试图是使用大量的物理内存   长时间大内存使用的优化，能检查计算资源（内存， 处理器数量）   至少需要256MB内存   大量的CPU／内存， （在1.4.1在4CPU的机器上已经显示有提升） |
| -XX:CMSFullGCsBeforeCompaction         | 多少次后进行内存压缩                        |      | 由于并发收集器不对内存空间进行压缩,整理,所以运行一段时间以后会产生"碎片",使得运行效率降低.此值设置运行多少次GC以后对内存空间进行压缩,整理. |
| -XX:+CMSParallelRemarkEnabled          | 降低标记停顿                                |      |                                                              |
| -XX+UseCMSCompactAtFullCollection      | 在FULL GC的时候， 对年老代的压缩            |      | CMS是不会移动内存的， 因此， 这个非常容易产生碎片， 导致内存不够用， 因此， 内存的压缩这个时候就会被启用。 增加这个参数是个好习惯。   可能会影响性能,但是可以消除碎片 |
| -XX:+UseCMSInitiatingOccupancyOnly     | 使用手动定义初始化定义开始CMS收集           |      | 禁止hostspot自行触发CMS GC                                   |
| -XX:CMSInitiatingOccupancyFraction=70  | 使用cms作为垃圾回收   使用70％后开始CMS收集 | 92   | 为了保证不出现promotion failed(见下面介绍)错误,该值的设置需要满足以下公式[**CMSInitiatingOccupancyFraction**计算公式](https://www.cnblogs.com/redcreen/archive/2011/05/04/2037057.html#CMSInitiatingOccupancyFraction_value) |
| -XX:CMSInitiatingPermOccupancyFraction | 设置Perm Gen使用到达多少比率时触发          | 92   |                                                              |
| -XX:+CMSIncrementalMode                | 设置为增量模式                              |      | 用于单CPU情况                                                |
| -XX:+CMSClassUnloadingEnabled          |                                             |      |                                                              |

**辅助信息**

|            **-XX:+PrintGC**            |                                                          | 输出形式:  [GC  118250K->113543K(130112K), 0.0094143 secs]   [Full GC 121376K->10414K(130112K), 0.0650971 secs] |
| :------------------------------------: | -------------------------------------------------------- | ------------------------------------------------------------ |
|        **-XX:+PrintGCDetails**         |                                                          | 输出形式:[GC [DefNew: 8614K->781K(9088K), 0.0123035 secs]  118250K->113543K(130112K), 0.0124633 secs]   [GC [DefNew: 8614K->8614K(9088K), 0.0000665 secs][Tenured: 112761K->10414K(121024K), 0.0433488 secs] 121376K->10414K(130112K),  0.0436268 secs] |
|       **-XX:+PrintGCTimeStamps**       |                                                          |                                                              |
|     -XX:+PrintGC:PrintGCTimeStamps     |                                                          | 可与-XX:+PrintGC -XX:+PrintGCDetails混合使用   输出形式:11.851: [GC 98328K->93620K(130112K), 0.0082960 secs] |
| **-XX:+PrintGCApplicationStoppedTime** | 打印垃圾回收期间程序暂停的时间.可与上面混合使用          | 输出形式:Total time for which application threads were stopped:  0.0468229 seconds |
| -XX:+PrintGCApplicationConcurrentTime  | 打印每次垃圾回收前,程序未中断的执行时间.可与上面混合使用 | 输出形式:Application time: 0.5291524 seconds                 |
|           -XX:+PrintHeapAtGC           | 打印GC前后的详细堆栈信息                                 |                                                              |
|          **-Xloggc:filename**          | 把相关日志信息记录到文件以便分析.   与上面几个配合使用   | -Xloggc:c:/gc.log                                            |
|        -XX:+PrintClassHistogram        | garbage collects before printing the histogram.          |                                                              |
|             -XX:+PrintTLAB             | 查看TLAB空间的使用情况                                   |                                                              |
|     XX:+PrintTenuringDistribution      | 查看每次minor GC后新的存活周期的阈值                     | Desired  survivor size 1048576 bytes, new threshold 7 (max 15)   new threshold 7即标识新的存活周期的阈值为7。 |

 

## 6、JVM调优案例

运用以上所学的jvm的知识点，我们可以对JVM虚拟机进行调优，其中调优的重灾区主要就是堆内存这一块儿

JVM 中最大堆大小有三方面限制：**相关操作系统的数据模型**（32-bt还是64-bit）限制；**系统的可用虚拟内存限制**；**系统的可用物理内存限制**。32位操作系统虽然寻址空间大小是4G（2^32），但具体操作系统会给一个限制（一般Windows系统有2GB内核空间，故用户空间限制在1.5G~2G，Linux系统有1GB内核空间，故用户空间是2G~3G）；64位操作系统对内存无限制。**所有线程共享数据区大小=新生代大小 + 年老代大小 + 持久代大小**。持久代一般固定大小为64m。所以java堆中增大年轻代后，将会减小年老代大小。此值对系统性能影响较大，Sun官方推荐配置为java堆的3/8。（老年代过小容易导致频繁GC，还是Full GC)

 

### 1、调整最大堆内存和最小堆内存

**1、-Xmx –Xms：指定java堆最大值（默认值是物理内存的1/4(<1GB)）和初始java堆最小值（默认值是物理内存的1/64(<1GB))**

默认(MinHeapFreeRatio参数可以调整)空余堆内存**小于40%**时，JVM就会**增大**堆直到-Xmx的最大限制.，默认(MaxHeapFreeRatio参数可以调整)空余堆内存**大于70%**时，JVM会**减少**堆直到 -Xms的最小限制。**开发过程中，通常会将 -Xms 与 -Xmx两个参数的配置相同的值**，其目的是为了能够在java垃圾回收机制清理完堆区后不需要重新分隔计算堆区的大小而浪费资源。

注意：此处设置的是Java堆大小，也就是新生代大小 + 老年代大小

**举例**、当参数设置为如下时：

-Xmx20m -Xms5m -XX:+PrintGCDetails

![image-20200516033356171](jvm.assets/image-20200516033356171.png)

![image-20200516033550465](jvm.assets/image-20200516033550465.png)

在程序中运行如下代码:

```java
class Test {
    public static void main(String[] args) {
        //系统的最大空间:
        System.out.println("Xmx=" + Runtime.getRuntime().maxMemory() / 1024.0 / 1024 + "M");  
        //系统的空闲空间:
        System.out.println("free mem=" + Runtime.getRuntime().freeMemory() / 1024.0 / 1024 + "M"); 
        //当前可用的总空间:
        System.out.println("total mem=" + Runtime.getRuntime().totalMemory() / 1024.0 / 1024 + "M"); 
    }
}
```

运行效果如下，可以看到Allocation Failure分配失败，产生了GC，

total mem是**当前堆的大小**，5.5M=1536K+4096K

free mem是当前堆的空闲空间大小，4.308M=5.5M-1144K-96K

![image-20200516035331724](jvm.assets/image-20200516035331724.png) 

保持参数不变，在程序中运行如下代码：（分配1M空间给数组）

```java
class Test {
    public static void main(String[] args) {
        byte[] b = new byte[1 * 1024 * 1024];
        System.out.println("分配了1M空间给数组");
        //系统的最大空间:
        System.out.println("Xmx=" + Runtime.getRuntime().maxMemory() / 1024.0 / 1024 + "M");  
        //系统的空闲空间:
        System.out.println("free mem=" + Runtime.getRuntime().freeMemory() / 1024.0 / 1024 + "M"); 
        //当前可用的总空间:
        System.out.println("total mem=" + Runtime.getRuntime().totalMemory() / 1024.0 / 1024 + "M"); 
    }
}
```

运行效果如下，堆的空闲空间减少了1M，堆的大小没有变化：

![image-20200516040124586](jvm.assets/image-20200516040124586.png)

注：==Java会尽可能将total mem的值维持在最小堆。==

保持参数不变，在程序中运行如下代码：（分配10M空间给数组）

```java
class Test {
    public static void main(String[] args) {
        byte[] b = new byte[10 * 1024 * 1024];
        System.out.println("分配了10M空间给数组");
        //系统的最大空间:
        System.out.println("Xmx=" + Runtime.getRuntime().maxMemory() / 1024.0 / 1024 + "M");
        //系统的空闲空间:
        System.out.println("free mem=" + Runtime.getRuntime().freeMemory() / 1024.0 / 1024 + "M");
        //当前可用的总空间:
        System.out.println("total mem=" + Runtime.getRuntime().totalMemory() / 1024.0 / 1024 + "M");
    }
}
```

运行效果，堆的内存不足以分配10M给数组，导致堆大小变大为15M（Xmx=20M)

![image-20200516040614278](jvm.assets/image-20200516040614278.png) 

保持参数不变，在程序中运行如下代码：（进行一次GC的回收）

```java
class Test {
    public static void main(String[] args) {
        System.gc();
        //系统的最大空间:
        System.out.println("Xmx=" + Runtime.getRuntime().maxMemory() / 1024.0 / 1024 + "M");
        //系统的空闲空间:
        System.out.println("free mem=" + Runtime.getRuntime().freeMemory() / 1024.0 / 1024 + "M");
        //当前可用的总空间:
        System.out.println("total mem=" + Runtime.getRuntime().totalMemory() / 1024.0 / 1024 + "M");
    }
}
```

运行效果如下，手动GC后，堆的空闲大小比之前大了一点。

![image-20200516041149760](jvm.assets/image-20200516041149760.png) 

### 2、JVM**堆**内存参数调优实战

我们可以通过以下参数来调整年轻代，年轻代以及老年代的比例，以及eden区和survivor区的比值大小

1. -Xmn：**年轻代的大小**
2. -XX:NewRatio ：**年轻代与老年代的比值**
3. -XX:SurvivorRatio：年轻代当中**survivor与eden区的比值**，设置为8,则两个Survivor区与一个Eden区的比值为2:8,一个Survivor区占整个年轻代的1/10

==设置新生代（年轻代）大小，大小是：eden+ 2 survivor space==

==所有共享数据区大小=年轻代大小 + 年老代大小 + 持久代大小==。一般永久代大小固定，所以增大年轻代后,将会减小年老代大小，此值对系统性能影响较大，Sun官方推荐配置为整个java堆的3/8

#### 1、调整新生代和老年代的比值

-XX:NewRatio

新生代（eden+2*Survivor）和老年代（不包含永久区）的比值

例如：-XX:NewRatio=4，表示新生代:老年代=1:4，即新生代占整个堆的1/5。**在Xms=Xmx并且设置了Xmn的情况下，该参数不需要进行设置。**

#### 2、调整幸存取的比值

-XX:SurvivorRatio（幸存代）

设置两个Survivor区和eden的比值

例如：8，表示两个Survivor:eden=2:8，即一个Survivor占年轻代的1/10

#### 3、设置年轻代和老年代的大小

-XX:NewSize   设置年轻代大小

-XX:MaxNewSize    设置年轻代最大值

**现在运行如下这段代码：**

```java
public class GCLog {
	public static void main(String[] args) {
    	byte[] b = null;
    	for (int i = 0; i < 10; i++)
        	b = new byte[1 * 1024 * 1024];
	}
}
```



#### 4、设置不同参数，观看GC日志

我们通过设置不同的jvm参数，来看一下GC日志的区别。

###### 1、设置新生代为1M，很小

当参数设置为如下时：（设置新生代为1M，很小）

-Xmx20m -Xms20m -Xmn1m -XX:+**PrintGCDetails** 

参数说明：

-Xmx20m ：最大堆内存大大小为20M

-Xms20m ：最小堆内存大小为20M

-Xmn1m ：年轻代大小为1M，那么老年代大小为多大？？

-XX:+**PrintGCDetails** ：打印出GC的详细日志

运行效果：

![img](jvm.assets/clip_image054.jpg)

总结：没有触发GC由于新生代的内存比较小，对象直接分配到老年代当中去了 

###### 2、新生代设置20M，很大

当参数设置为如下时：（设置新生代为20M，足够大）

-Xmx20m -Xms20m -Xmn20m -XX:+**PrintGCDetails**

参数说明：

-Xmx20m ：最大堆内存大大小为20M

-Xms20m ：最小堆内存大小为20M

-Xmn20m ：年轻代大小为20M，那么老年代大小为多大？？

-XX:+**PrintGCDetails** ：打印出GC的详细日志

运行效果：

![img](jvm.assets/clip_image056.jpg)

上图显示：

没有触发GC

全部分配在eden

老年代没有使用

###### 3、新生代设置7M，不大不小

（3）当参数设置为如下时：（设置新生代为7M，不大不小）

-Xmx20m -Xms20m -Xmn7m -XX:+**PrintGCDetails**

参数说明：

-Xmx20m ：最大堆内存大大小为20M

-Xms20m ：最小堆内存大小为20M

-Xmn7m ：年轻代大小为7M，那么老年代大小为多大？？

-XX:+**PrintGCDetails** ：打印出GC的详细日志

运行效果：

![img](jvm.assets/clip_image058.jpg)

总结：

　　进行了2次新生代GC

　　s0 s1 太小，需要老年代担保

###### 4、设置幸存代大小

当参数设置为如下时：（设置新生代为7M，不大不小；同时，增加幸存代大小）

-Xmx20m -Xms20m -Xmn7m -XX:SurvivorRatio=2 -XX:+**PrintGCDetails**

参数说明：

-Xmx20m ：最大堆内存大大小为20M

-Xms20m ：最小堆内存大小为20M

-Xmn7m ：年轻代大小为7M，那么老年代大小为多大？？

-XX:SurvivorRatio=2 两个survivor区与eden区的比值：2:2 ，eden区占比50%，survivor占比50% ，官方推荐占比是2:8，也就是survivor占比20%，eden区占比80%

-XX:+**PrintGCDetails** ：打印出GC的详细日志

运行效果：

![img](jvm.assets/clip_image060.jpg)

总结：

  进行了至少3次新生代GC

  s0 s1 增大

###### 5、设置eden区和survivor的比例

当参数设置为如下时：

-Xmx20m -Xms20m -XX:NewRatio=1 -XX:SurvivorRatio=1 -XX:+**PrintGCDetails** 

参数说明：

-Xmx20m ：最大堆内存大大小为20M

-Xms20m ：最小堆内存大小为20M

-XX:NewRatio=1 ：年轻代与老年代的占比 1:1    -->参数有问题，老年代的空间太小了，官方推荐老年代占比5/8

-XX:SurvivorRatio=2 两个survivor区与eden区的比值：2:2 ，eden区占比50%，survivor占比50% ，官方推荐占比是2:8，也就是survivor占比20%，eden区占比80%   -->参数有问题，官方推荐survivor：edne区 = 2:8

-XX:+**PrintGCDetails** ：打印出GC的详细日志

运行效果：

![img](jvm.assets/clip_image062.jpg)

设置年轻代当中eden区与survivor区的比值，这里设置eden:survivor 为1:1。也就是eden区占新生代内存的1/2。survivor区占新生代的1/2

###### 6、调整eden区和survivor区的比例，减少GC次数

当参数设置为如下时： 和上面的（5）相比，适当减小幸存代大小，这样的话，能够减少GC的次数

-Xmx20m -Xms20m -XX:NewRatio=1 -XX:SurvivorRatio=4 -XX:+**PrintGCDetails**

参数说明：

-Xmx20m ：最大堆内存大大小为20M

-Xms20m ：最小堆内存大小为20M

-XX:NewRatio=1 ：年轻代与老年代的占比 1:1

-XX:SurvivorRatio=4 两个survivor区与eden区的比值：2:4 ，eden区占比2/3，survivor占比1/3 ，官方推荐占比是2:8，也就是survivor占比20%，eden区占比80%

-XX:+**PrintGCDetails** ：打印出GC的详细日志

运行效果

![img](jvm.assets/clip_image064.jpg)

减少eden区内存大小，更少的发生GC次数

###### 7、调整最大堆内存和最小堆内存

调整最大堆内存和最小堆内存如下：

-Xmx10m -Xms5m -XX:NewRatio=1 -XX:SurvivorRatio=1 -XX:+**PrintGCDetails** 

参数说明：

-Xmx20m ：最大堆内存大大小为20M

-Xms5m ：最小堆内存大小为5M

-XX:NewRatio=1 ：年轻代与老年代的占比 1:1 è有问题

-XX:SurvivorRatio=4 两个survivor区与eden区的比值：2:4 ，eden区占比2/3，survivor占比1/3 ，官方推荐占比是2:8，也就是survivor占比20%，eden区占比80% è有问题

-XX:+**PrintGCDetails** ：打印出GC的详细日志

 

==频繁的发生minorGC以及发生了一次Full GC，所以实际工作当中最大堆内存和最小堆内存一般都是调整成为一样的==

#### 5、查看GC错误日志

**-XX:+HeapDumpOnOutOfMemoryError、-XX:+HeapDumpPath**

**-XX:+HeapDumpOnOutOfMemoryError**

==OOM时导出堆到文件，根据这个文件，我们可以看到系统dump时发生了什么==。

-XX:+HeapDumpPath：导出OOM的路径

例如我们设置如下的参数：

```sh
-Xmx20m -Xms5m -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=d:/a.dump
```

上方意思是说，现在给堆内存最多分配20M的空间。如果发生了OOM异常，那就把dump信息导出到d:/a.dump文件中。

然后，我们执行如下代码：

```java
public class GCDump {
    public static void main(String[] args) {
        Vector v = new Vector();
        for (int i = 0; i < 25; i++)
        v.add(new byte[1 * 1024 * 1024]);
    }
}
```

上方代码中，需要利用25M的空间，很显然会发生OOM异常。现在我们运行程序，控制台打印如下：

![img](jvm.assets/clip_image066.jpg)

现在我们去D盘看一下dump文件：

![img](jvm.assets/clip_image068.jpg)

上图显示，一般来说，这个文件的大小和最大堆的大小保持一致。

我们可以用VisualVM打开这个dump文件。

注：关于VisualVM的使用，可以参考下面这篇博客：

使用 VisualVM 进行性能分析及调优：[http://www.ibm.com/developerworks/cn/java/j-lo-visualvm/](https://links.jianshu.com/go?to=http%3A%2F%2Fwww.ibm.com%2Fdeveloperworks%2Fcn%2Fjava%2Fj-lo-visualvm%2F)

或者使用Java自带的Java VisualVM工具也行：

![img](jvm.assets/clip_image070.jpg)

![img](jvm.assets/clip_image072.jpg)

上图中就是dump出来的文件，==文件中可以看到，一共有19个byte已经被分配了。 ===

#### 6、记录OutOfMemoryError

**4、-XX:OnOutOfMemoryError：**

-XX:OnOutOfMemoryError

==在OOM时，执行一个脚本。可以在OOM时，发送邮件，甚至是重启程序。==

例如我们设置如下的参数：

```sh
-XX:OnOutOfMemoryError=D:/ProgramFiles/jdk8u141/jdk/bin/printstack.bat %p 
```

p代表的是当前进程的pid 

上方参数的意思是说，执行printstack.bat脚本，而这个脚本做的事情是：

```sh
D:/ProgramFiles/jdk8u141/jdk/bin/jstack -F %1 > D:/a.txt
```

即当程序OOM时，在D:/a.txt中将会生成**线程**的dump。

#### 7、堆的分配参数总结

根据实际事情调整新生代和幸存代的大小

官方推荐新生代占java堆的3/8

幸存代占新生代的1/10

**在OOM时，记得Dump出堆**，确保可以排查现场问题

#### 8、永久区参数调整

-XX:PermSize -XX:MaxPermSize

设置永久区的初始空间（默认为物理内存的1/64）和最大空间（默认为物理内存的1/4）。也就是说，jvm启动时，永久区一开始就占用了PermSize大小的空间，如果空间还不够，可以继续扩展，但是不能超过MaxPermSize，否则会OOM。

他们表示，一个系统可以容纳多少个类型

代码举例：

我们知道，使用CGLIB等库的时候，可能会产生大量的类，这些类，有可能撑爆永久区导致OOM。于是，我们运行下面这段代码：

```java
public class CGLib {
    public static void main(String[] args) {
        for(int i=0;i<100000;i++){
        CglibBean bean = new CglibBean("geym.jvm.ch3.perm.bean"+i,new HashMap());
        }
    }
}
```

上面这段代码会在永久区不断地产生新的类。于是，运行效果如下：

![img](jvm.assets/clip_image074.jpg)

总结：**如果堆空间没有用完也抛出了OOM，有可能是永久区导致的**。堆空间实际占用非常少，但是永久区溢出 一样抛出OOM。

### 3、JVM**栈**参数调优实战

#### 1、调整每个线程栈空间的大小

**-Xss：**

设置每个线程栈空间的大小。**JDK5.0以后每个线程堆栈大小为1M**，以前每个线程堆栈大小为256K。在相同物理内存下,减小这个值能生成更多的线程。但是操作系统对一个进程内的线程数还是有限制的，不能无限生成，经验值在3000~5000左右

决定了函数调用的深度

每个线程都有独立的栈空间

局部变量、参数分配在栈上

注：栈空间是每个线程私有的区域。栈里面的主要内容是栈帧，而栈帧存放的是局部变量表，局部变量表的内容是：局部变量、参数。

我们来看下面这段代码：（没有出口的递归调用）

```java
public class TestStackDeep {
    private static int count = 0;

    public static void recursion(long a, long b, long c) {
        long e = 1, f = 2, g = 3, h = 4, i = 5, k = 6, q = 7, x = 8, y = 9, z = 10;
        count++;
        recursion(a, b, c);
    }

    public static void main(String args[]) {
        try {
            recursion(0L, 0L, 0L);
        } catch (Throwable e) {
            System.out.println("deep of calling = " + count);
            e.printStackTrace();
        }
    }

}
```

上方这段代码是没有出口的递归调用，肯定会出现OOM的。

如果设置栈大小为512k：

-Xss512K

运行效果如下：（方法被调用了1707次）

![img](jvm.assets/clip_image076.jpg)

如果设置栈大小为1024k：（方法被调用8618次）

![img](jvm.assets/clip_image078.jpg)

意味着函数调用的次数太深，像这种递归调用就是个典型的例子。

#### 2、设置线程栈的大小

**-XXThreadStackSize：**

设置线程栈的大小(0 means use default stack size)

### 4、JVM其他参数介绍

#### 1、设置内存页的大小

-XXThreadStackSize：

设置内存页的大小，不可设置过大，会影响Perm的大小

#### 2、设置原始类型的快速优化

**-XX:+UseFastAccessorMethods：**

设置原始类型的快速优化

#### 3、设置关闭手动GC

**-XX:+DisableExplicitGC：**

设置关闭System.gc()(这个参数需要严格的测试)

#### 4、设置垃圾最大年龄

**-XX:MaxTenuringThreshold**

设置垃圾最大年龄。如果设置为0的话,则年轻代对象不经过Survivor区,直接进入年老代. 对于年老代比较多的应用,可以提高效率。如果将此值设置为一个较大值,则年轻代对象会在Survivor区进行多次复制,这样可以增加对象再年轻代的存活时间,增加在年轻代即被回收的概率。该参数只有在串行GC时才有效.

#### 5、加快编译速度

-XX:+AggressiveOpts

加快编译速度

#### 6、改善锁机制性能        

-XX:+UseBiasedLocking

锁机制的性能改善 

#### 7、禁用垃圾回收        

-Xnoclassgc 

禁用垃圾回收

#### 8、设置堆空间存活时间      

-XX:SoftRefLRUPolicyMSPerMB

设置每兆堆空闲空间中SoftReference的存活时间，默认值是1s 。（softly reachable objects will remain alive for some amount of time after the last time they were referenced. The default value is one second of lifetime per free megabyte in the heap）

#### 9、设置对象直接分配在老年代

-XX:PretenureSizeThreshold 

设置对象超过多大时直接在老年代分配，默认值是0。

#### 10、设置TLAB占eden区的比例

-XX:TLABWasteTargetPercent 

设置TLAB占eden区的百分比，默认值是1% 。 

#### 11、设置是否优先YGC 

-XX:+CollectGen0First   

设置FullGC时是否先YGC，默认值是false。

 

## 7、大数据组件调优案例实战

### 1、hadoop调优实战

调优前提，三台物理机器，内存128GB，CPU核数每台都是24核

每台机器物理内存留下16GB，其他的都给大数据组件使用

| 组件名称               | 分配内存 |
| ---------------------- | -------- |
| Yarn管理内存           | 60G      |
| Flume                  | 4G       |
| Hbase使用内存          | 16G      |
| Namenode堆内存         | 8G       |
| ResourceManager堆内存  | 8G       |
| JogHistoryServer堆内存 | 4G       |
| DataNode堆内存         | 4G       |
| NodeManager堆内存      | 4G       |

 

#### 调整namenode启动的堆内存大小

调整hadoop以及namenode的堆内存大大小

```sh
cd /kkb/install/hadoop-2.6.0-cdh5.14.2/etc/hadoop
vim hadoop-env.sh
export HADOOP_HEAPSIZE=8192m
export HADOOP_NAMENODE_INIT_HEAPSIZE="8192"
```

#### 调整jobHisotryServer的堆内存大小

```sh
cd /kkb/install/hadoop-2.6.0-cdh5.14.2/etc/hadoop
vim mapred-env.sh
export HADOOP_JOB_HISTORYSERVER_HEAPSIZE=4096
```

#### 调整yarn的堆内存大小

```sh
cd /kkb/install/hadoop-2.6.0-cdh5.14.2/etc/hadoop
vim yarn-env.sh

JAVA_HEAP_MAX=-Xmx8192m

export YARN_RESOURCEMANAGER_OPTS=-Xmx8096m -Xms8096m -XX:SurvivorRatio=8
```



#### 调整yarn内存大小

```sh
cd /kkb/install/hadoop-2.6.0-cdh5.14.2/etc/hadoop

vim yarn-site.xml
```



| yarn.scheduler.minimum-allocation-mb     | 4096  | 每个container最小内存        |
| ---------------------------------------- | ----- | ---------------------------- |
| yarn.scheduler.maximum-allocation-mb     | 16384 | 每个container最大分配内存    |
| yarn.scheduler.minimum-allocation-vcores | 2     | 每个container最少分配CPU核数 |
| yarn.scheduler.maximum-allocation-vcores | 8     | 每个container最大CPU核数     |
| yarn.nodemanager.resource.memory-mb      | 61440 | 每台机器的物理内存           |
| yarn.nodemanager.resource.cpu-vcores     | 18    | 每台机器的CPU核数            |

 

### 2、flume组件内存调优

```sh
cd /kkb/install/apache-flume-1.6.0-cdh5.14.2-bin/conf

vim flume-env.sh

export JAVA_OPTS="-Xms4096m –Xmx4096m -Dcom.sun.management.jmxremote"

export JAVA_OPTS="$JAVA_OPTS -Dorg.apache.flume.log.rawdata=true -Dorg.apache.flume.log.printconfig=true "
```

 

### 3、Hbase内存调优

```sh
cd /kkb/install/hbase-1.2.0-cdh5.14.2/conf

vim hbase-env.sh

export HBASE_HEAPSIZE=8G

export HBASE_OFFHEAPSIZE=16G

export HBASE_MASTER_OPTS="$HBASE_MASTER_OPTS -XX:PermSize=16384m -XX:MaxPermSize=16384m -XX:ReservedCodeCacheSize=2048m"

export SERVER_GC_OPTS="-verbose:gc -XX:+PrintGCDetails -XX:+PrintGCDateStamps"

export SERVER_GC_OPTS="-verbose:gc -XX:+PrintGCDetails -XX:+PrintGCDateStamps -Xloggc:/kkb/install/gc/gc.log -XX:+UseGCLogFileRotation -XX:Numb

erOfGCLogFiles=1 -XX:GCLogFileSize=512M"
```

 

 

 

 