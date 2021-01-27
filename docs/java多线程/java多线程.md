## 线程的基本概念

首先理解些基本概念：程序--》进程--》线程

- 程序（program）：是指为完成特定任务、用某种编程语言编写的一组指令的集合。即指一段静态的代码，静态对象。

- 进程（process）：是程序的一次执行过程，或者正在运行的一个程序。动态过程：有它自身的产生、存在和消亡的过程。
  - 比如运行中的QQ，运行中的MP3播放器，都是进程（动态的）。
  - 程序--》静态，进程--》动态
- 线程（thread）：进程可进一步细化成线程，**是一个程序内部的一条执行路径**。
  - **若一个程序可同一时间执行多个线程，就是支持多线程的**。
  - 线程相当于进程的一条分支。

再来理解一些概念：

- 并发：一个处理器同时处理多个任务，逻辑上的同时发生。
- 并行：多个处理器或者多核处理器同时处理不同的任务，物理上的同时发生。
  - **并发是一个人同时吃三个馒头，并行是三个人同时吃三个馒头**。并发的一个处理器挂了，所有任务都挂了，并行的某个处理器挂了，也只有它自己对应的任务受影响，另外两个处理器及其运行的任务不受影响。

在讨论什么是线程前有必要先说下什么是进程，因为线程是进程中的一个实体，线程本身是不会独立存在的。 进程是代码在数据集合上的一次运行活动， 是系统进行资源分配 和调度的基本单位， 线程则是进程的一个执行路径， 一个进程中至少有一个线程，进程中的多个线程共享进程的资源。

操作系统在分配资源时是把资源分配给进程的， 但是 CPU 资源比较特殊， 它是被分配到线程的， 因为真正要占用 CPU 运行的是线程， 所以也说**线程是 CPU 分配的基本单位**。

在 Java 中，当我们启动 main 函数时其实就启动了一个JVM 的进程， 而 main 函数所 在的线程就是这个进程中的一个线程，也称主线程。

![image-20200529234718456](java多线程.assets/image-20200529234718456.png)

由图 1-1 可以看到， 一个进程中有多个线程，多个线程共享进程的堆和方法区资源， 但是每个线程有自己的程序计数器和栈区域。

程序计数器是一块内存区域，用来记录线程当前要执行的指令地址。 那么为何要将程序计数器设计为线程私有的呢？前面说了线程是占用 CPU 执行的基本单位，而 **CPU 一 般是使用时间片轮转方式让线程轮询占用的**，所以当前线程 CPU 时间片用完后，要让出 CPU，等下次轮到自 己的时候再执行。 那么如何知道之前程序执行到哪里了呢？其实**程序计数器就是为了记录该线程让出 CPU 时的执行地址的，待再次分配到时间片时线程就可以从自己私有的计数器指定地址继续执行**。 另外需要注意的是，如果执行的是 native 方法， 那么 pc 计数器记录的是 undefined 地址，只有执行的是 Java 代码时 pc 计数器记录的才是 下一条指令的地址。

另外每个线程都有自己的栈资源，用于存储该线程的局部变量，这些局部变量是该线程私有的，其他线程是访问不了的，除此之外栈还用来存放线程的调用栈帧。

堆是一个进程中最大的一块内存，堆是被进程中的所有线程共享的，是进程创建时分配的，堆里面主要存放使用 new 操作创建的对象实例。

方法区则用来存放JVM加载的类、常量及静态变量等信息，也是线程共享的。

### 多线程应用场景

何时需要多线程？

1. 程序需要同时执行多个任务
2. 程序需要实现一些等待的任务时，如用户输入、文件读写操作、网络操作、搜索等。
3. 需要一些后台运行的程序时。
   - 因为多线程是进程的分支。当分支之后，就各走各的。假设在进程上跑的代码是主程序，当其中的第三行代码是开启线程的，那么，**开启线程之后线程运行的的代码就是和主程序并行**（它们之间不相干了）

## 多线程的创建与启动

java语言的JVM允许程序运行多个线程，它通过java.lang.Thread类来实现。

Thread类的特性:

1. **每个线程都是通过某个特定Thread对象的run()方法来完成操作的**，经常把run()方法的主体称为线程体。要运行的代码逻辑写在run()方法里。
2. 通过该Thread对象的start()方法来调用这个线程。**本质是调用run()方法**。

### Thread类主要方法

Thread类的**构造方法**:

```java
public Thread()//创建新的Thread对象
public Thread(String threadname) //创建线程并指定线程实例名
public Thread(Runnable target) // 指定创建线程的目标对象，它实现了Runnable接口的run()方法
public Thread(Runnable target,String threadname) //创建新的Thread对象
```

Thread类的方法：

```java
void start()  //启动线程
run() //线程被调度时执行的操作
String getName()//返回线程的名称
void setName()//设置线程名称
static currentThread()//返回当前线程
```

### 方式1：创建多线程——继承Thread类

1、创建一个类，继承Thread类并重写run()方法

2、创建Thread实例对象，并运行线程。

```java
class MyThread extends Thread{
    @Override
    public void run() {
        System.out.println("多线程运行的代码写在这个run()方法里");
        for (int i = 0; i <5 ; i++) {
            System.out.println("湖人总冠军");
        }
    }
}
public class Test {
    public static void main(String[] args) {
        Thread td=new MyThread();
        td.start();
        for (int i = 0; i <300 ; i++) {
            System.out.println("==============================");
            System.out.println("==============================");
            System.out.println("==============================");
        }

    }
}

/*运行结果大致如下：
==============================
多线程运行的代码写在这个run()方法里
湖人总冠军
湖人总冠军
湖人总冠军
湖人总冠军
湖人总冠军
==============================
==============================
*/
```

从上面的案例结果可以看到，main()方法中打印的内容与开启线程的run()方法中的**打印语句是混合起来的**，而每一次运行，打印顺序都是不固定的。

这是因为main()方法执行td.start()方法开启多线程之后，就相当于在main()方法之外开启了一条支流，这个时候，**td.start()之后的main()方法中的其它代码的运行就跟run()方法运行无关了**。

这个就是多线程的**异步性**。

```java
public class Test {
    public static void main(String[] args) {
        Thread td=new MyThread();
        td.start();
        Thread t2=new MyThread();
        t2.start();
        Thread t3=new MyThread();  
        t3.start();
        System.out.println("=============");
    }
}
```

从上面代码可以看到，**线程的个数是可以自己适当增加的**。

### 方式2：创建多线程——实现Runnable接口

创建一个类，实现Runnable接口，并重写run()方法。

```java
class MyThread2 implements Runnable {
    @Overridejava
    public void run() {
        System.out.println(Thread.currentThread().getName()+"Runnable多线程运行的代码");
        for (int i = 0; i <5; i++) {
            System.out.println(Thread.currentThread().getName()+"这是多线程的逻辑代码");
        }
    }
}
public class Test {
    public static void main(String[] args) {
//        Thread(Runnable target)
        Thread th1=new Thread(new MyThread2()); //new Mythread2()就是target
        th1.start();
//        Thread(Runnable target, String name)
        Thread th2=new Thread(new MyThread2(),"th2");  //定义的线程名称的作用看输出
        th2.start();
        
        System.out.println("=========================");
        
    }
}
/*运行结果为：
=========================
Thread-0Runnable多线程运行的代码
th2Runnable多线程运行的代码
th2这是多线程的逻辑代码
th2这是多线程的逻辑代码
th2这是多线程的逻辑代码
th2这是多线程的逻辑代码
th2这是多线程的逻辑代码
Thread-0这是多线程的逻辑代码
Thread-0这是多线程的逻辑代码
Thread-0这是多线程的逻辑代码
Thread-0这是多线程的逻辑代码
Thread-0这是多线程的逻辑代码
*/
//Thread-0是系统给出的线程默认名称
```

### 两种创建线程方式的区别

从案例1和案例2可以知道创建多线程的两个方式：

- 继承Thread类
- 实现Runnable接口

一般，**推荐使用实现Runnable接口**的方式

- 这样可以避免**单继承**的问题。单继承就是说一个类只能继承一个类，不可继承多个类。使用接口方式我们的线程类就还可以继承其它的类。

- **接口方式使得多个线程可以共享同一个接口实现类的对象，非常适合多个相同的线程来处理同一份资源**。详情看下列代码：

  ```java
  public class Test {
      public static void main(String[] args) {
          Runnable ra=new MyThread3();
          Thread t1=new Thread(ra);
          t1.start();	
          Thread t2=new Thread(ra);
          t2.start();
      }
  }
  
  class MyThread3 implements Runnable {
      int count=1;
      @Override
      public void run() {
          System.out.println(Thread.currentThread().getName()+"Runnable多线程运行的代码");
          for (int i = 0; i <5; i++) {
              count++;
              System.out.println(Thread.currentThread().getName()+"这是多线程的逻辑代码"+count);
          }
      }
  }
  /*运行结果为：
  Thread-0Runnable多线程运行的代码
  Thread-0这是多线程的逻辑代码2
  Thread-0这是多线程的逻辑代码3
  Thread-0这是多线程的逻辑代码4
  Thread-0这是多线程的逻辑代码5
  Thread-0这是多线程的逻辑代码6
  Thread-1Runnable多线程运行的代码
  Thread-1这是多线程的逻辑代码7
  Thread-1这是多线程的逻辑代码8
  Thread-1这是多线程的逻辑代码9
  Thread-1这是多线程的逻辑代码10
  Thread-1这是多线程的逻辑代码11
  */
  //从输出结果可知，Thread-0线程和Thread-1线程是共享同一个count的
  ```

### 主线程可以获取子线程返回值的方法——FutureTask

```java
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.FutureTask;

class Test{
    public static void main(String[] args) {
        FutureTask<String> futureTask=new FutureTask<>(new CallerTask());
        new Thread(futureTask).start();
        try {
            String result=futureTask.get();
            System.out.println(result);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
class CallerTask implements Callable<String>{

    @Override
    public String call() throws Exception {
        System.out.println("FutureTask");
        return "hello";
    }
}
```

运行结果：

![image-20200516171402662](java多线程.assets/image-20200516171402662.png)

上面代码中，CallerTask类实现了Callable接口的call()方法。

将FutureTask对象作为任务创建一个线程并且启动它，**可以通过get()方法等待任务执行完毕并获取返回结果**。



## 多线程的优点

1. 提高应用程序的响应。对图形界面更有意义，可增强用户体验。
2. 提高CPU利用率
3. **改善程序结构，长而复杂的进程分为多个线程**，独立运行，利于理解和修改。
   - 比如一个方法里有1000行代码，前300行，中间300行，最后400行，如果这三段代码没有因果关系，这种情况我们就可以使用线程处理，把这三段代码分别放在不同的线程中去运行，这三段代码是并行运行的。

## 线程的优先级

线程的优先级就是哪个线程有较大的概率先执行。只是说概率比较大，并不是绝对的。

优先级是用数组**表示，数据越大优先级越高，如果没有设置，默认优先级是5。

```java
getPriority(); //获取线程优先值：
setPriority(int ..) //设置线程的优先级
```

**优先级案例**

```Java
public class Test {
    public static void main(String[] args) {
        Thread t1=new Thread(new MyThread4(),"t1");
        t1.setPriority(3);
        t1.start();

        Thread t2=new Thread(new MyThread4(),"t2");
        t2.setPriority(4);
        t2.start();
    }
}

class MyThread4 implements Runnable {
    @Override
    public void run() {
        for (int i = 0; i <5; i++) {
            System.out.println(Thread.currentThread().getName()+"这是多线程的逻辑代码");
        }
    }
}
/*运行结果为：
t1这是多线程的逻辑代码
t2这是多线程的逻辑代码
t2这是多线程的逻辑代码
t2这是多线程的逻辑代码
t2这是多线程的逻辑代码
t2这是多线程的逻辑代码
t1这是多线程的逻辑代码
t1这是多线程的逻辑代码
t1这是多线程的逻辑代码
t1这是多线程的逻辑代码
*/
```

从上面结果可以知道，**t2的有更多的内容执行在前面**。每次运行，结果都可能不一样

## 线程让步  yield()

**暂停正在执行的线程，把执行机会让给优先级别相同或更高的线程。**注意，不是说线程A礼让了，就一定会执行线程B，线程A礼让了只是说A回到了就绪状态，回到后，A还可能抢到CPU时间片。

若队列中没有同优先级的线程，忽略此方法

```java
public class Test {
    public static void main(String[] args) {
        Thread t1=new Thread(new MyThread4(),"t1");
        t1.start();
        Thread t2=new Thread(new MyThread4(),"t2");
        t2.start();
    }
}

class MyThread4 implements Runnable {
    @Override
    public void run() {
        for (int i = 0; i <5; i++) {
            if (i % 2 == 0) {
                Thread.yield();//线程让步
            }
            System.out.println(Thread.currentThread().getName()+"这是多线程的逻辑代码");
        }
    }
}
/*运行结果为：
t1这是多线程的逻辑代码
t2这是多线程的逻辑代码
t1这是多线程的逻辑代码
t2这是多线程的逻辑代码
t1这是多线程的逻辑代码
t1这是多线程的逻辑代码
t2这是多线程的逻辑代码
t2这是多线程的逻辑代码
t1这是多线程的逻辑代码
t2这是多线程的逻辑代码
*/
```

## 线程阻塞  join()

当某个程序执行流中调用其它线程的join()方法时，调用的线程将被阻塞，直到join()方法加入的join线程被执行完。

优先级低的线程也可以获得执行

```java
public class Test {
    public static void main(String[] args) {
        Thread t1=new Thread(new MyThread4(),"t1");
        t1.start();
        Thread t2=new Thread(new MyThread4(),"t2");
        t2.start();

        System.out.println("1====================1");
        try {
            t1.join(); //相当于把t1的run()方法插入到这个位置执行
            /**
             * 阻塞当前的main方法，先不执行System.out.println("2======================2");代码
             * 先执行join进来的线程的代码
             */
        }catch (Exception e){
            e.printStackTrace();
        }
        System.out.println("2======================2");
        System.out.println("3======================3");
    }
}

class MyThread4 implements Runnable {
    @Override
    public void run() {
        for (int i = 0; i <5; i++) {
            System.out.println(Thread.currentThread().getName()+"这是多线程的逻辑代码");
        }
    }
}


/*运行将结果为：
1====================1
t1这是多线程的逻辑代码
t1这是多线程的逻辑代码
t1这是多线程的逻辑代码
t1这是多线程的逻辑代码
t1这是多线程的逻辑代码
2======================2
3======================3
t2这是多线程的逻辑代码
t2这是多线程的逻辑代码
t2这是多线程的逻辑代码
t2这是多线程的逻辑代码
t2这是多线程的逻辑代码
*/
```

## 线程睡眠  sleep()

```Java
package com.jimmy.day05;

public class Test {
    public static void main(String[] args) {
        Thread t1=new Thread(new MyThread4(),"t1");
        t1.start();
    }
}

class MyThread4 implements Runnable {
    @Override
    public void run() {
        for (int i = 0; i <5; i++) {
            try {
                Thread.sleep(1000); // 当前线程睡眠1000毫秒
                //也就是当前循环每隔1秒才循环一次
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(Thread.currentThread().getName()+"这是多线程的逻辑代码");
        }
    }
}
/*运行结果为：
t1这是多线程的逻辑代码
t1这是多线程的逻辑代码
t1这是多线程的逻辑代码
t1这是多线程的逻辑代码
t1这是多线程的逻辑代码
*/
//输出结果每隔一秒才输出一行
```

## 强制结束线程生命周期  stop()

线程还没有运行完就把它结束掉。**该方法过时了**

```Java
package com.jimmy.day05;

public class Test {
    public static void main(String[] args) {
        Thread t1=new Thread(new MyThread4(),"t1");
        t1.start();
        System.out.println("===================");
        System.out.println("===================");
        t1.stop();
    }
}

class MyThread4 implements Runnable {
    int count=0;
    @Override
    public void run() {
        for (int i = 0; i <5; i++) {
            count++;
            System.out.println(Thread.currentThread().getName()+"这是多线程的逻辑代码"+count);
        }
    }
}
/*运行结果为：
===================
===================
*/
```

## 判断线程是否存活  isAlive()

```java
package com.jimmy.day05;

public class Test {
    public static void main(String[] args) {
        Thread t2=new Thread(new MyThread4(),"t2");
        t2.start();
        try {
            t2.join();
        } catch (InterruptedException e) {
            ejava.printStackTrace();
        }
        System.out.println(t2.isAlive());
    }
}

class MyThread4 implements Runnable {
    int count=0;
    @Override
    public void run() {
        for (int i = 0; i <3; i++) {
            count++;
            System.out.println(Thread.currentThread().getName()+"这是多线程的逻辑代码"+count);
        }
    }
}
/*运行结果为：
t2这是多线程的逻辑代码1
t2这是多线程的逻辑代码2
t2这是多线程的逻辑代码3
false
*/
```

## 线程的生命周期

生命周期：线程从生到死的经历。

线程生命周期的5种状态:

1. 新建：Thread类被声明创建时。
2. 就绪：使用start()方法后。
3. 运行：就绪的线程被调度并获得处理器资源，进入运行状态。
4. 阻塞：被人为挂起或执行输入输出操作时，让出CPU并临时终止自己的执行，进入阻塞状态。类似堵车了，车不能动。
5. 死亡：全部工作完成或者人为强制关闭线程。

![image-20200218173655314](java多线程.assets/image-20200218173655314.png)

![image-20200516145234109](java多线程.assets/image-20200516145234109.png)

其实阻塞状态有一些比较特殊的，我们可以将生命周期**划分得更详细一些**，如下图，下面的等待队列和锁池都可以看成是阻塞状态。

<img src="java多线程.assets/image-20200516145847479.png" alt="image-20200516145847479" style="zoom:150%;" />



## 同步锁synchronized

**多个线程运行导致的问题**：

- 多个线程的不确定性==引起执行结果的不稳定==

- 多个线程对账本的共享，会造成操作的不完整性，会破坏数据。

  ![image-20200218174054440](java多线程.assets/image-20200218174054440.png)

**问题案例1：不同用户从同一个账户取钱**

```Java
package com.jimmy.day05;

public class Test{
    public static void main(String[] args) {
        //创建一个账户，并初始化余额为3000
        Accout a1=new Accout(3000);
        //创建两个要从上面账户取钱的用户
        User u1=new User(a1,2000);
        User u2=new User(a1,2000);
        //运行多线程，同时取钱
        Thread jimmy=new Thread(u1,"Jimmy");
        Thread krystal=new Thread(u2,"krystal");
        jimmy.start();
        krystal.start();
    }
}
//定义类，模拟用户
class Accout{
    //初始化用户余额
    private int money;
    public Accout(int num){
        this.money=num;
        System.out.println("创建了一个余额为3000的用户");
    }
    //定义取钱方法；
    public  void drawFun(int m){
        if(money-m<0){
            System.out.println(Thread.currentThread().getName()+" : "+"余额不足了,取钱失败");
            System.out.println(Thread.currentThread().getName()+" : "+"当前账户余额为："+money);
        }else{
            money=money-m;
            System.out.println(Thread.currentThread().getName()+" : "+"取了"+m+"元");
            System.out.println(Thread.currentThread().getName()+" : "+"余额变成了: "+money);
        }
    }
}
//定义线程类,模拟用户取款
class User implements Runnable{
    Accout accout;
    int m;
    public User(Accout accout,int m){
        this.accout=accout;
        this.m=m;
    }
    @Override
    public void run() {
        accout.drawFun(m);
    }
}
/*运行结果为：
创建了一个余额为3000的用户
Jimmy : 取了2000元
krystal : 余额不足了,取钱失败
krystal : 当前账户余额为：1000
Jimmy : 余额变成了: 1000
*/
可以看到，jimmy取钱操作还没完整执行，krystal就过来插入执行了。
一个线程还没执行完，另一个线程就运行了。这个就是多线程的问题。
```

问题案例2：

```java
class Test {
    public static void main(String[] args) {
        Runnable r=()->{
            while(TicketCenter.restCount>0){
                System.out.println(Thread.currentThread().getName()+"卖出一张票,剩余"+ --TicketCenter.restCount + "张");
            }
        };
        Thread t1=new Thread(r,"thread -1");
        Thread t2=new Thread(r,"thread -2");
        Thread t3=new Thread(r,"thread -3");
        Thread t4=new Thread(r,"thread -4");
        t1.start();
        t2.start();
        t3.start();
        t4.start();
    }
}
class TicketCenter{
    public static int restCount=100;
}
/*运行输出结果：
thread -4卖出一张票,剩余99张
thread -1卖出一张票,剩余97张
thread -2卖出一张票,剩余96张
thread -3卖出一张票,剩余98张
thread -3卖出一张票,剩余92张
thread -3卖出一张票,剩余91张
thread -2卖出一张票,剩余93张
thread -2卖出一张票,剩余89张
thread -2卖出一张票,剩余88张
thread -2卖出一张票,剩余87张
thread -2卖出一张票,剩余86张
thread -2卖出一张票,剩余85张
thread -1卖出一张票,剩余94张
*/  产生这种结果的原因可能是，一个线程计算完剩余票数后，还没打印，另一个线程就抢到了CPU时间片
```

上面问题的解决办法是加同步锁。

在普通方法上加同步锁synchronized，**锁的是整个对象，不是某一个方法**，**不同的对象就是不同的锁**。

### **案例1：**线程针对同一个对象时，是同把锁。

```java
package com.jimmy.day05;

public class Test{
    public static void main(String[] args) {
        T1 emm=new T1();   //下面所有的线程针对的都是同一个对象
        Thread t1=new Thread(emm,"t1");
        Thread t2=new Thread(emm,"t2");
        Thread t3=new Thread(emm,"t3");
        t1.start();
        t2.start();
        t3.start();
    }
}
class T1 implements Runnable{
    @Override
    public synchronized void run() {
        for (int i = 0; i < 5; i++) {
            System.out.println(Thread.currentThread().getName()+"锁的应用");
        }
    }
}
//从下列运行结果看到，锁住了，线程不会交叉同时运行。
/*运行结果为：
t1锁的应用
t1锁的应用
t1锁的应用
t1锁的应用
t1锁的应用
t2锁的应用
t2锁的应用
t2锁的应用
t2锁的应用
t2锁的应用
t3锁的应用
t3锁的应用
t3锁的应用
t3锁的应用
t3锁的应用
*/
```

### 案例2：线程针对不同对象时，不是同把锁

```java
package com.jimmy.day05;

public class Test{
    public static void main(String[] args) {
        Thread t1=new Thread(new T1(),"t1");
        Thread t2=new Thread(new T1(),"t2");
        Thread t3=new Thread(new T1(),"t3");
        t1.start();
        t2.start();
        t3.start();
    }
}
class T1 implements Runnable{
    @Override
    public synchronized void run() {
        for (int i = 0; i < 5; i++) {
            System.out.println(Thread.currentThread().getName()+"锁的应用");
        }
    }
}
//从下列结果知，虽然方法加上了同步锁，但是线程间还是交叉同步运行了，是因为线程针对的不同的对象。
/*运行结果为：
t1锁的应用
t1锁的应用
t1锁的应用
t2锁的应用
t2锁的应用
t2锁的应用
t1锁的应用
t1锁的应用
t2锁的应用
t2锁的应用
t3锁的应用
t3锁的应用
t3锁的应用
t3锁的应用
t3锁的应用
*/
```

### 案例3：使用static synchronized，对所有对象是同把锁，可看成是类锁。

```java
package com.jimmy.day05;

public class Test{
    public static void main(String[] args) {
        //创建一个账户，并初始化余额为3000
        Accout a1=new Accout(3000);
        //创建两个要从上面账户取钱的用户
        User u1=new User(a1,2000);
        User u2=new User(a1,2000);
        //运行多线程，同时取钱
        Thread jimmy=new Thread(u1,"Jimmy");
        Thread krystal=new Thread(u2,"krystal");
        jimmy.start();
        krystal.start();
    }
}
//定义类，模拟用户
class Accout{
    //初始化用户余额
    private static int money;
    public Accout(int num){
        this.money=num;
        System.out.println("创建了一个余额为3000的用户");
    }
    //定义取钱方法；
    public  static synchronized void drawFun(int m){
        if(money-m<0){
            System.out.println(Thread.currentThread().getName()+" : "+"余额不足了,取钱失败");
            System.out.println(Thread.currentThread().getName()+" : "+"当前账户余额为："+money);
        }else{
            money=money-m;
            System.out.println(Thread.currentThread().getName()+" : "+"取了"+m+"元");
            System.out.println(Thread.currentThread().getName()+" : "+"余额变成了: "+money);
        }
    }
}
//定义线程类,模拟用户取款
class User implements Runnable{
    Accout accout;
    int m;
    public User(Accout accout,int m){
        this.accout=accout;
        this.m=m;
    }
    @Override
    public void run() {
        accout.drawFun(m);
    }
}
//两个线程不再交叉同时运行。
/*运行结果为：
创建了一个余额为3000的用户
krystal : 取了2000元
krystal : 余额变成了: 1000
Jimmy : 余额不足了,取钱失败
Jimmy : 当前账户余额为：1000
*/ 

```

### 案例4：同步代码段（上面的加锁方式是同步方法）

上面都是给方法加上synchronized关键字，我们还可以使用同步代码段的方式来解决：

```java
class Test {
    public static void main(String[] args) {
        Runnable r=()->{
            while(TicketCenter.restCount>0){
                synchronized ("锁"){
                    System.out.println(Thread.currentThread().getName()+"卖出一张票,剩余"+ --TicketCenter.restCount + "张");
                }
            }
        };
        Thread t1=new Thread(r,"thread -1");
        Thread t2=new Thread(r,"thread -2");
        Thread t3=new Thread(r,"thread -3");
        Thread t4=new Thread(r,"thread -4");
        t1.start();
        t2.start();
        t3.start();
        t4.start();
    }
}
class TicketCenter{
    public static int restCount=100;
}
/*
thread -2卖出一张票,剩余99张
thread -2卖出一张票,剩余98张
thread -2卖出一张票,剩余97张
thread -2卖出一张票,剩余96张
...
thread -2卖出一张票,剩余1张
thread -2卖出一张票,剩余0张
thread -4卖出一张票,剩余-1张
thread -1卖出一张票,剩余-2张
thread -3卖出一张票,剩余-3张

*/ 打印是有序的，但是会有负数，这是因为，在同步代码段外，有3个线程进入了循环体，且在等待，一旦这3个线程抢到锁，就不会再判断TicketCenter.restCount>0，所以，我们还要加一个条件，改进的代码如下：
    
class Test {
    public static void main(String[] args) {
        Runnable r=()->{
            while(TicketCenter.restCount>0){
                synchronized ("锁"){
                    if(TicketCenter.restCount<=0){
                        return;
                    }
                    System.out.println(Thread.currentThread().getName()+"卖出一张票,剩余"+ --TicketCenter.restCount + "张");
                }
            }
        };
        Thread t1=new Thread(r,"thread -1");
        Thread t2=new Thread(r,"thread -2");
        Thread t3=new Thread(r,"thread -3");
        Thread t4=new Thread(r,"thread -4");
        t1.start();
        t2.start();
        t3.start();
        t4.start();
    }
}
class TicketCenter{
    public static int restCount=100;
}
```

## 显式锁ReenTrantLock

关键代码：

1. 创建显示锁对象：ReentrantLock mylock=new ReentrantLock();
2. 上锁：mylock.lock();  
3. 解锁：mylock.unlock(); 

```java
import java.util.concurrent.locks.ReentrantLock;

class Test {
    public static void main(String[] args) {
        ReentrantLock mylock=new ReentrantLock();
        Runnable r=()->{
            while(TicketCenter.restCount>0){
                synchronized ("锁"){
                    mylock.lock();  //上锁
                    if(TicketCenter.restCount<=0){
                        mylock.unlock();  
                        //如果这里退出循环时不解锁，会导致某一个线程持续占用CPU资源，程序不会停掉
                        return;
                    }
                    System.out.println(Thread.currentThread().getName()+"卖出一张票,剩余"+ --TicketCenter.restCount + "张");
                    mylock.unlock();  //解锁
                }
            }
        };
        Thread t1=new Thread(r,"thread -1");
        Thread t2=new Thread(r,"thread -2");
        Thread t3=new Thread(r,"thread -3");
        Thread t4=new Thread(r,"thread -4");
        t1.start();
        t2.start();
        t3.start();
        t4.start();
    }
}
class TicketCenter{
    public static int restCount=100;
}
/*
thread -1卖出一张票,剩余99张
thread -1卖出一张票,剩余98张
thread -1卖出一张票,剩余97张
thread -1卖出一张票,剩余96张
...
thread -2卖出一张票,剩余2张
thread -2卖出一张票,剩余1张
thread -2卖出一张票,剩余0张
*/
```

## 死锁

在程序当中，应该尽量避免死锁的出现。

什么是死锁，看下面例子：

```java
import java.util.concurrent.locks.ReentrantLock;

class Test {
    public static void main(String[] args) {
        ReentrantLock mylock=new ReentrantLock();
        Runnable r1=()->{
                synchronized ("A"){
                    System.out.println("线程1持有了锁A");
                    synchronized ("B"){
                        System.out.println("线程1同时持有了锁A和锁B");
                    }
                }
        };

        Runnable r2=()->{
                synchronized ("B"){
                    System.out.println("线程2持有了锁B");
                    synchronized ("A"){
                        System.out.println("线程2同时持有了锁A和锁B");
                    }
                }
        };
        Thread t1=new Thread(r1);
        Thread t2=new Thread(r2);
        t1.start();
        t2.start();
    }
}
```

程序运行界面：

![image-20200516161601469](java多线程.assets/image-20200516161601469.png)

可以看到，**程序没有结束，一直运行着**，而且，两个线程都没有打印出同时持有锁A和锁B，这个就是**死锁**。多个线程持有对方的锁对象，但是又不释放自己的锁。

当然，如果其中一个线程执行**足够快**，也可能同时拿到2把锁，然后程序最终会结束运行。

根据上面例子的理解，可以直到，**死锁产生的必须具备以下4个条件：**

1. 互斥条件：资源已经被获取到并使用，其它请求者只能等待
2. 请求并持有条件：一个线程已经持有了至少一个资源，但又提出了新的资源请求，但是新资源已经被其它线程占有。
3. 不可剥夺条件：线程获取到的资源没使用完时不能被其它线程抢占。
4. 环路等待条件：存在线程的环形链，即线程集合{T0,T1,T2,...,TN}中的T0等待T1，T1等待T2,....,TN等待T0。

## wait/notify/notifyAll

wait：等待，是Object类中的一个方法，作用是当前的线程释放自己的锁标记，并且让出CPU资源，使当前的线程进入等待队列中。

notify：通知，是Object类中的一个方法，作用是唤醒等待队列中的一个线程，是这个线程进入锁池。

notifyAll：通知，是Object类中的一个方法，作用是唤醒等待队列中的**所有**线程，是这些线程进入锁池。

解决死锁版本1：

```java
import java.util.concurrent.locks.ReentrantLock;

class Test {
    public static void main(String[] args) {
        ReentrantLock mylock=new ReentrantLock();
        Runnable r1=()->{
                synchronized ("A"){
                    System.out.println("线程1持有了锁A");
                    try {
                        "A".wait();
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    synchronized ("B"){
                        System.out.println("线程1同时持有了锁A和锁B");
                    }
                }
        };

        Runnable r2=()->{
                synchronized ("B"){
                    System.out.println("线程2持有了锁B");
                    synchronized ("A"){
                        System.out.println("线程2同时持有了锁A和锁B");
                    }
                }
        };
        Thread t1=new Thread(r1);
        Thread t2=new Thread(r2);
        t1.start();
        t2.start();
    }
}
```

运行界面：

![image-20200516163730638](java多线程.assets/image-20200516163730638.png)

可以看到，加上了"A".wait()后，线程2同时持有了锁A和锁B，但是程序依然还不能结束运行，因为线程1进入了等待队列。此时，我们要加上notifyAll或者notify来解决。

版本2：

```java
import java.util.concurrent.locks.ReentrantLock;

class Test {
    public static void main(String[] args) {
        ReentrantLock mylock=new ReentrantLock();
        Runnable r1=()->{
                synchronized ("A"){
                    System.out.println("线程1持有了锁A");
                    try {
                        "A".wait();
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    synchronized ("B"){
                        System.out.println("线程1同时持有了锁A和锁B");
                    }
                }
        };

        Runnable r2=()->{
                synchronized ("B"){
                    System.out.println("线程2持有了锁B");
                    synchronized ("A"){
                        System.out.println("线程2同时持有了锁A和锁B");
                        "A".notify();
                    }
                }
        };
        Thread t1=new Thread(r1);
        Thread t2=new Thread(r2);
        t1.start();
        t2.start();
    }
}
```

运行界面：

![image-20200516164013574](java多线程.assets/image-20200516164013574.png)

可以看到，问题已经解决了。

其实，我们还可以在设计程序之初，不依靠wait和notify这些方法来避免死锁的。这个方法就是**申请资源的有序性。**

比如说，线程A和线程B，只需要**保证两个线程获取资源的顺序一致**，就可以避免死锁，如线程A和线程B都需要资源1,2,3,4,....n，但是都只有在获取了资源n-1的时候才能去获取资源n。

## 多线程模式下的懒汉式单例

单线程模式下的懒汉式单例：

```java
import java.util.concurrent.locks.ReentrantLock;

class Test {
    public static void main(String[] args) {
       for(int i=0;i<100;i++){
           Boss.getBoss();
       }
    }
}


class Boss{
    private Boss(){
        System.out.println("一个Boss对象被实例化了");
    }
    private static Boss instance=null;
    public static Boss getBoss(){
        if(instance==null){
             instance=new Boss();
        }
        return instance;
    }
}

```

运行结果：

![image-20200516164924019](java多线程.assets/image-20200516164924019.png)

可以看到，只实例化了1个Boss对象。

但是，在多线程模式下，如果不加锁，就会出问题，看下列代码：

```java
import java.util.concurrent.locks.ReentrantLock;

class Test {
    public static void main(String[] args) {
       Runnable r=()->{
           Boss.getBoss();
       };
       for (int i=0;i<100;i++){
           new Thread(r).start();
       }
    }
}


class Boss{
    private Boss(){
        System.out.println("一个Boss对象被实例化了");
    }
    private static Boss instance=null;
    public static Boss getBoss(){
        if(instance==null){
             instance=new Boss();
        }
        return instance;
    }
}

```

运行结果：

![image-20200516165200883](java多线程.assets/image-20200516165200883.png)

可以看到，多个Boss对象被实例化了，这个就是多线程下的单例问题。

下面，我们使用加锁来解决这个问题：

```java
import java.util.concurrent.locks.ReentrantLock;

class Test {
    public static void main(String[] args) {
       Runnable r=()->{
           Boss.getBoss();
       };
       for (int i=0;i<100;i++){
           new Thread(r).start();
       }
    }
}


class Boss{
    private Boss(){
        System.out.println("一个Boss对象被实例化了");
    }
    private static Boss instance=null;
    public static Boss getBoss(){
        synchronized ("A"){
            if(instance==null){
                instance=new Boss();
            }
            return instance;
        }
    }
}

```

运行结果：

![image-20200516165405060](java多线程.assets/image-20200516165405060.png)

## 线程的上下文切换

多线程编程中 , 线程个数一般都大于cpu个数。而每个cpu同一时刻只能被一个线程使用。为了让用户感觉多个线程是在同时进行的。CPU资源的分配采用了时间片轮转的策略。也就是给每个线程分配一个时间片。线程在时间片内占用cpu执行任务，当前线程使用完时间片后就转为就绪状态，并让出cpu给其他线程占用，这就是上下文切换。

从当前线程的上下文切换到了其他线程。那么就有一个问题，让出cpu的线程，**等下次轮到自己占有cpu时，如何知道自己之前运行到哪里了？**所以在切换线程上下文时。**需要保存当前线程的执行现场**。当再次执行时，根据保存的执行现场信息，恢复执行现场。

线程上下文切换的时机有: 当前线程的cpu时间片使用完处于就绪状态时。当前线程被其他线程中断时。

## 守护线程与用户线程

Java 中的线程分为两类，分别为 **daemon 线程（守护线程〉**和 **user 线程（用户线程）**。

守护线程是什么？面试：守护线程是运行在后台的一种特殊线程。它独立于控制终端并且周期性地执行某种任务或等待处理某些发生的事件。在 Java 中垃圾回收线程就是特殊的守护线程。

在 JVM 启动时会调用 main 函数， **main 函数所在的钱程就是一个用户线程**，其实在 JVM 内部同时－还启动了好多守护线程， 比如垃圾回收线程。那么守护线程和用户线程有什么区 别呢？

区别之一是当最后一个非守护线程结束时， JVM 会正常退出，而不管当前是否有守护线程，也就是说守护线程是否结束并不影响 JVM的退出。言外之意，**只要有一个用 户线程还没结束， 正常情况下JVM就不会退出。**

==创建守护线程的方式：使用setDaemon()方法==

```java
class Test{
    public static void main(String[] args) {
        Thread daemonThread=new Thread(new Runnable() {
            @Override
            public void run() {
                for(;;){}
            }
        });
        daemonThread.setDaemon(true);
        daemonThread.start();
    }
}
```

**总结：** 如果你希望在主线程结束后 JVM 进程马上结束，那么在创建线程时可以将其设置为守护线程，如果你希望在主线程结束后子线程继续工作，等子线程结束后再让JVM 进程结束，那么就将子线程设置为用户线程。

## ThreadLocal

### ThreadLocal介绍

多钱程访问同一个**共享变量**时特别**容易出现并发问题**，特别是在多个线程需要对一个 共享变量进行写入时。 为了保证线程安全，一般使用者在访问共享变量时**需要进行适当的 同步**，如图 1-3 所示。

<img src="java多线程.assets/image-20200516193043791.png" alt="image-20200516193043791" style="zoom:50%;" />

同步的措施一般是加锁。

但有一种特殊的应用场景：**当创建一个变量后， 每个线程对其进行访问的时候访问的是自己线程的变量。**

==上面这种场景不会产生线程安全问题==，实现这种场景的方法就是**ThreadLocal** 。

ThreadLocal 是 JDK 包提供的，它提供了**线程本地变量**，也就是如果你创建了 一个 **ThreadLocal 变量**，那么访问这个变量的每个线程都会有这个变量的一个**本地副本**。 当多个线程操作这个变量时，实际操作的是自己本地内存里面的变量，从而避免了线程安全问题。**创建一个 ThreadLocal 变量后，每个线程都会复制一个变量到自己的本地内存**，如图 1-4 所示。

<img src="java多线程.assets/image-20200516193459505.png" alt="image-20200516193459505" style="zoom:67%;" />

### ThreadLocal代码演示

我们来看一下下列代码，使用ThreadLocal来实现每个线程访问的都是自己线程的变量。

```java
class ThreadLocalTest{
    static ThreadLocal<String> localVariable=new ThreadLocal<String>();
    static void myPrint(String str){
        System.out.println(str+":"+localVariable.get());
        localVariable.remove();
    }

    public static void main(String[] args) {
        Thread threadOne=new Thread(new Runnable() {
            @Override
            public void run() {
                localVariable.set("one");
                myPrint("threadOne");
                System.out.println("threadOne remove后的值"+":"+localVariable.get());
            }
        });
        Thread threadTwo=new Thread(new Runnable() {
            @Override
            public void run() {
                localVariable.set("two");
                myPrint("threadTwo");
                System.out.println("threadTwo remove后的值"+":"+localVariable.get());
            }
        });
        threadOne.start();
        threadTwo.start();
    }
}
```

运行结果如下，两个线程修改和访问的是自己线程的变量，不会相互影响。

![image-20200516201817580](java多线程.assets/image-20200516201817580.png)

代码中首先创建了一个ThreadLocal变量，然后创建了线程One,Two并启动。

线程One通过set()方法，修改变量的值，这个其实修改的是本地内存中的一个副本,这个副本Two是访问不了的。

remove()可以移除自己线程的本次内存中的值。

**那ThreadLocal的原理是啥？**为什么能够实现每个线程只访问自己线程的变量？

### ThreadLocal的原理

Thread 类中有一个 **threadLocals** 和一个 **inheritableThreadLocals**， 它们都是ThreadLocalMap 类型的变量， 而 **ThreadLocalMap 是一个定制化的 Hashmap**。 

在默认情 况下， 每个线程中的这两个变量都为 null，只有当前线程第一次调用 ThreadLocal 的 set 或 者 get 方法时才会创建它们。 其实每个线程的本地变量不是存放在 ThreadLocal 实例里面， 而是存放在调用线程的 threadLocals 变量里面。 也就是说， ThreadLocal 类型的本地变量存放在具体的线程内存空间中。 

**ThreadLocal 就是一个工具**，它通过 **set** 方法把 value 值放 入调用线程的 threadLocals 里面并存放起来， 当调用线程调用它的 **get** 方法时，再从当前 线程的 threadLocals 变量里面将其拿出来使用 。 如果调用线程一直不终止， 那么这个本地 变量会一直存放在调用线程的 threadLocals 变量里面，所以当不需要使用本地变量时可以 通过调用 ThreadLocal 变量的 **remove**方法，从当前线程的 threadLocals里面删除该本地变量。 

另外， Thread 里面的 threadLocals 为何被设计为 map 结构？很明显是因为**每个线程可以关联多个 ThreadLocal 变量。**

我们通过源码来查看一下set、get和remove三个方法的实现逻辑：

```java
    public void set(T value) {
        //获取当前线程
        Thread t = Thread.currentThread();
        //将当前线程作为 key，去查找对应的线程变量，找到则设置 
        ThreadLocalMap map = getMap(t);
        if (map != null)
            map.set(this, value);
        else
            //第一次调用就创建当前线程对应的HashMap 
            createMap(t, value);
    }

    public T get() {
        Thread t = Thread.currentThread();
        ThreadLocalMap map = getMap(t);
        if (map != null) {
            ThreadLocalMap.Entry e = map.getEntry(this);
            if (e != null) {
                @SuppressWarnings("unchecked")
                T result = (T)e.value;
                return result;
            }
        }
        return setInitialValue();
    }

	public void remove() {
         ThreadLocalMap m = getMap(Thread.currentThread());
         if (m != null)
             m.remove(this);
     }
```

总结 ：如图 1-6 所示， 在**每个线程内部都有一个名 为 threadLocals 的成员变量**， 该变量的类型为 HashMap， 其中 **key 为我们定义的 ThreadLocal 变量的 this 引用 ， value 则为我 们使用 set 方法设置的值**。 

每个线程的本地变量存放在线程自己的内存变量 threadLocals 中， 如果当前线程一直不消亡， 那么这些本地变量会一直存在， 所以==可能会造成内存溢出==， 因 此**使用完毕后要记得调用 ThreadLocal 的 remove 方法删除对应线程的 threadLocals 中的本地变量。**

<img src="java多线程.assets/image-20200516214137660.png" alt="image-20200516214137660" style="zoom:67%;" />

### ThreadLocal不支持继承性

ThreadLocal是不支持继承性的，观察下列代码：

```java
class Test{
    static ThreadLocal<String> threadLocal=new ThreadLocal<>();
    public static void main(String[] args) {
        threadLocal.set("hello world");
        new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println("子线程:"+threadLocal.get());
            }
        }).start();
        System.out.println("主线程:"+threadLocal.get());
    }


}
```

输出结果如下：

![image-20200516222537648](java多线程.assets/image-20200516222537648.png)

这个结果其实符合我们的猜想，因为代码中调用set方法的是main线程，main线程和子线程是不同的线程，所以子线程打印了null，而主线程打印了自己设置的值。

那么，如果我们想要让子线程能访问父线程的值，如何实现？这时候就到**InheritableThreadLocal**出场了。

### InheritableThreadLocal 支持继承性

 InheritableThreadLocal 继承自 ThreadLocal， 其提供了一个特性，就是**让子线程可以访问在父线程中设置的本地变量。**

详情看书本。

## 什么是多线程并发编程

首先要澄清并发和并行的概念，**并发是指同一个时间段内多个任务同时都在执行，并且都没有执行结束**，而并行是说在单位时间 内多个任务同时在执行。 并发任务强调在一个 时间段内同时执行，而一个时间段由多个单位时间累积而成，所以说**并发的多个任务在单位时间内不一定同时在执行。** 在单 CPU 的时代多个任务都是并发执行的，这是因为单个 CPU 同时只能执行一个任务。 在单 CPU 时代多任务是共享一个 CPU 的，当一个任务占用 CPU 运行时，其他任务就会被挂起，当占用 CPU 的任务时间片用完后，会把 CPU 让给其 他任务来使用，所以**在单 CPU 时代多线程编程是没有太大意义的**，并且线程间频繁的上 下文切换还会带来额外开销。

下图所示为在单个 CPU 上运行两个线程，线程 A 和线程 B 是轮流使用 CPU 进行任 务处理的，也就是在某个时间内单个 CPU 只执行一个线程上面的任务。 当线程 A 的时间 片用完后会进行线程上下文切换，也就是保存当前线程 A 的执行上下文，然后切换到线 程 B 来占用 CPU 运行任务。

![image-20200529235103354](java多线程.assets/image-20200529235103354.png)

图 2-2 所示为双 CPU 配置，线程 A 和线程 B 各自在自己的 CPU 上执行任务，实现了 真正的并行运行。

<img src="java多线程.assets/image-20200529235123512.png" alt="image-20200529235123512" style="zoom:67%;" />

而在多线程编程实践中，**线程的个数往往多于 CPU 的个数，所 以一般都称多线程并发编程而不是多线程并行编程。**

为什么要进行多线程并发编程？

多核 CPU 时代的到来打破了单核 CPU 对多线程效能的限制。 多个 CPU 意味着每个 线程可以使用自己的 CPU 运行，这减少了线程上下文切换的开销，但随着对应用系统性 能和吞吐量要求的提高，出现了处理海量数据和请求的要求，这些都对高并发编程有着迫 切的需求。

## 线程安全问题

线程安全问题，是指多个线程同时读写一个**共享资源**并且没有任何同步措施时，导致**出现脏数据**或者其它**不可预见的结果**的问题。

<img src="java多线程.assets/image-20200516232403939.png" alt="image-20200516232403939" style="zoom:67%;" />

是不是说多个线程共享了资源， 当它们都去访问这个共享资源时就会产生线程安全问题呢？答案是否定的， 如果多个线程都只是读取共享资源， 而不去修改，那么就不会存在线程安全问题， 只有当**至少一个线程修改共享资源时才会存在线程安全问题。**

最典型的就是**计数器类的实现**，计数变量 count 本身是一个共享变量， 多个线程可以对其进行递增操作，如果不使用同步措施， 由于递增操作是**获取一计算一保存**三步操作， 因此**可能导致计数不准确**，如下所示。

![image-20200516232627447](java多线程.assets/image-20200516232627447.png)

如何解决线程安全问题？可以使用关键字**synchronized加锁**进行同步。

## 共享变量的内存可见性问题

共享变量的内存可见性问题可以理解为线程安全问题的一种。

谈到内存可见性， 我们首先来看看在**多线程下处理共享变量**时 **Java 的内存模型**，如图 2-4 所示。

<img src="java多线程.assets/image-20200516232931253.png" alt="image-20200516232931253" style="zoom:67%;" />

**Java 内存模型规定，将所有的变量都存放在主内存中**，==当线程使用变量时，会把主内存里面的变量复制到自己的工作空间或者叫作工作内存，线程读写变量时操作的是自己工作内存中的变量==。 

Java 内存模型是一个抽象的概念，那么在实际实现中线程的工作内存是什么呢？请看图 2-5。

<img src="java多线程.assets/image-20200516233102025.png" alt="image-20200516233102025" style="zoom:50%;" />

图中所示是一个双核 CPU 系统架构，每个核有自己的控制器和运算器，其中控制器包含一组寄存器和操作控制器，运算器执行算术逻辅运算。**每个核都有自己的一级缓存**， 在有些架构里面还有一个所有 CPU 都==共享的==**二级缓存**。 那么 **Java 内存模型里面的工作内 存，就对应这里的 Ll 或者 L2 缓存或者 CPU 的寄存器**。

==当一个线程操作共享变量时， 它首先从主内存复制共享变量到自己的工作内存， 然后对工作内存里的变量进行处理， 处理完后将变量值更新到主内存。==

那么假如线程 A 和线程 B 同时处理一个共享变量， 会出现什么情况？我们使用图 2-5 所示 CPU 架构， **假设线程 A 和线程 B 使用不同 CPU 执行，并且当前两级 Cache 都为空**， 那么这时候由于 Cache 的存在，将会导致内存不可见问题， 具体看下面的分析。

1. 线程 A 首先获取共享变量 X 的值，由于两级 Cache 都没有命中（没找到变量X) ，所以加载主内存 中 X 的值，假如为 0。然后把 X=0的值缓存到两级缓存， 线程 A 修改 X 的值为 1, 然后将其写入两级 Cache， 并且刷新到主内存。 线程 A 操作完毕后，线程 A 所在的 CPU 的两级 Cache 内和主内存里面的 X 的值都是 l 。
2. 线程 B 获取 X 的值，首先一级缓存没有命中，然后看二级缓存，二级缓存命中了 ， 所以返回 X= 1 ； 到这里一切都是正常的， 因为这时候主内存中也是 X=l 。然后线 程 B 修改 X 的值为 2， 并将其存放到线程 2 所在的一级 Cache 和共享二级 Cache 中， 最后更新主内存中 X 的值为 2 ;  到这里一切都是好的。 
3. 线程 A 这次又需要修改 X 的值， **获取时一级缓存命中， 并且 X=l ，到这里问题就出现了**，明明线程 B 已经把 X 的值修改为了 2，为何线程 A 获取的还是 l 呢？ **这就是共享变量的内存不可见问题**， 也就是线程 B 写入的值对线程 A 不可见。

那么如何解决共享变量内存不可见问题？ 使用 Java 中的 **volatile 关键字**或者**synchronized关键字**就可以解决这 个问题， 下面会有讲解。

## synchronized关键字

synchronized 块是 Java 提供的一种**原子性内置锁**， Java 中的每个对象都可以把它当作 一个同步锁来使用 ， 这些 Java 内置的使用者看不到的锁被称为内部锁，也叫作监视器锁。 线程的执行代码在进入 synchronized 代码块前会自动获取内部锁，这时候**其他线程访问该同步代码块时会被阻塞挂起**。拿到内部锁的线程会在正常退出同步代码块或者抛出异常后或者在同步块内调用了该内置锁资源的 wait 系列方法时释放该内置锁。 **内置锁是排它锁**， 也就是当一个线程获取这个锁后， 其他线程必须等待该线程释放锁后才能获取该锁。

另外，由于 Java 中的线程是与操作系统的原生线程一一对应的，所以**当阻塞一个线程时，需要从用户态切换到内核态执行阻塞操作，这是很耗时的操作**，而 synchronized 的 使用就**会导致上下文切换**。

前面介绍了共享变量内存可见性问题主要是由于线程的工作内存导致的，下面我们来讲解 synchronized 的一个内存语义，这个内存语义就**可以解决共享变量内存可见性问题**。 进入 synchronized 块的==内存语义是把在 synchronized 块内使用到的变量从线程的工作内存中清除，这样在 synchronized 块内使用到该变量时就不会从线程的工作内存中获取，而是直接从主内存中获取==。 退出 synchronized 块的内存语义是把在 synchronized 块内对共享变量的修改刷新到主内存。

其实**这也是加锁和释放锁的语义**，==当获取锁后会清空锁块内本地内存中将会被用到的共享变量，在使用这些共享变量时从主内存进行加载，在释放锁时将本地内存中修改的共享变量刷新到主内存。==

除可以解决共享变量内存可见性问题外， synchronized 经常被用来实现原子性操作。 另外请注意， synchronized 关键字会引起线程上下文切换并带来线程调度开销。

**总结：**synchronized关键字可解决共享变量内存可见性问题、实现原子性操作，但是会引起线程上下文切换并带来线程调度开销。

## volatile 关键字

上面介绍了使用锁的方式可以解决共享变量内存可见性问题，但是使用锁太笨重，因 为它会带来线程上下文的切换开销。 对于解决内存可见性问题， Java 还提供了一种**弱形式的同步**，也就是使用 volatile 关键字。 该关键字可以确保对一个变量的更新对其他线程马上可见。 当一个变量被声明为 volatile 时，线程在写入变量时不会把值缓存在寄存器或者其他地方，而是会把值刷新回主内存。 当其他线程读取该共享变量时，会从主内存重新获取最新值，而不是使用当前线程的工作内存中的值。 volatile 的内存语义和 synchronized 有 相似之处，具体来说就是，当线程写入了 volatile 变量值时就等价于线程**退出** synchronized 同步块（即把写入工作内存的变量值同步到主内存），读取 volatile 变量值时就相当于**进入**同 步块 （即先清空本地内存变量值，再从主内存获取最新值）。

下面看一个使用 volatile 关键字解决内存可见性问题的例子。 如下代码中的共享变量value 是线程不安全的，因为这里没有使用适当的同步措施。

首先来看使用 synchronized 关键宇进行同步的方式。

```java
public class ThreadSafeinteger { 
	private int value; 
	public synchronized int get() { 
		return value; 
    }
	public synchronized void set (int value) { 
		this.value = value; 
    }
}
```


然后是使用 volatile 进行同步。

```java
public class ThreadSafeinteger { 
	private volatile int value; 
	public int get(){
        return value; 
    } 
	publiC void set (int value) { 
        this.value = value; 
    }
}
```

在这里使用 synchronized 和使用 volatile 是等价的，都解决了共享变量 value 的内存可见性问题，但是前者是独占锁，同时只能有一个线程调用 get（）方法，其他调用线程会被阻塞， 同时会存在线程上下文切换和线程重新调度的开销，这也是使用锁方式不好的地方。 而**后者是非阻塞算法， 不会造成线程上下文切换的开销。**

但并非在所有情况下使用它们都是等价的， **volatile 虽然提供了可见性保证，但并不保证操作的原子性**。那么一般在什么时候才使用 volatile 关键字呢？==写入变量值不依赖、变量的当前值时==。 因为如果依赖当前值，将是**获取一计算一写入** 三步操作，这三步操作不是原子性的，而 volatile 不保证原子性。读写变量值时没有加锁。 因为加锁本身已经保证了内存可见性，这时候不需要把变量声明为 volatile 的。

## Java 中的原子性操作

所谓原子性操作，是指执行一系列操作时，**这些操作要么全部执行， 要么全部不执行， 不存在只执行其中一部分的情况**。 

比如，在设计计数器时一般都先读取当前值，然后+1， 再更新。 这个过程是**读改写**的过程，如果不能保证这个过程是原子性的，那么就会出现线程安全问题。 如下代码是线程不安全的，因为不能保证++value 是原子性操作。

```java
public class ThreadNotSaf eCount { 
	private Long value; 
	publiC Long getCount () {
        return value; 
	public void inc () { 
        ++value; 
    }
}
```

使用 Javap -c 命令查看汇编代码，如下所示。

```
publ inC void inc() ; 
	Code:
	0: aload_0 
    1: dup 
    2: getfield #2  //Field value:J 
    5: lconst_1 
    6: ladd 
    7: putfield #2  //Field value:J
   10: return 
```

由此可见，**简单的++value 由 2、 5、 6、 7 四步组成**，其中第 2 步是获取当前 value 的 值并放入栈顶， 第 5 步把常量 1 放入栈顶，第 6 步把当前栈顶中两个值相加并把结果放入 栈顶，第 7 步则把栈顶的结果赋给 value 变量。因此， **Java 中简单的一句++value 被转换为汇编后就不具有原子性了 。**

那么如何才能保证多个操作的原子性呢？最简单的方法就是使用 synchronized 关键字 进行同步，修改代码如下。

```java
public class ThreadNotSaf eCount { 
	private Long value; 
	publiC synchronized Long getCount () {
        return value; 
	public synchronized void inc () { 
        ++value; 
    }
}
```

使用 synchronized 关键宇的确可以实现线程安全性， 即内存可见性和原子性，但是 synchronized 是独占锁，没有获取内部锁的线程会被阻塞掉，而这里的 getCount 方法只是 读操作，多个线程同时调用不会存在线程安全问题。 但是加了关键宇 synchronized 后，**同 一时间就只能有一个线程可以调用，这显然大大降低了并发性**。 你也许会间，既然是**只读操作**，那为何不去掉 getCount 方法上的 synchronized 关键字呢？其实是**不能去掉的，别忘了这里要靠 synchronized 来实现 value 的内存可见性。**那么有没有更好的实现呢？答案是肯定的，下面将讲到的在内部使用==非阻塞 CAS== 算法实现的原子性操作类==AtomicLong==就是 一个不错的选择。

## CAS（compare and swap)

### CAS介绍

在 Java 中 ， 锁在并发处理中占据了 一席之地，但是使用锁有一个不好的地方，就 是当一个线程没有获取到锁时会被阻塞挂起， 这会导致线程上下文的切换和重新调度开销。 Java 提供了非阻塞的 volatile 关键字来解决共享变量的可见性问题， 这在一定程度 上弥补 了 锁带来的开销 问题，但是 volatile 只能保证共享变量的可见性，不能解决读 改一写等的原子性问题。

CAS 即 **Compare and Swap**，其是 JDK 提供的**非阻塞原子性操 作**， 它通过硬件**保证了比较更新操作的原子性**。 JDK 里面的 **Unsafe 类**提供了一系列的 **compareAndSwap*方法**， 下面以 compareAndSwapLong 方法为例进行简单介绍。

- boolean compareAndSwapLong(Object obj,long valueOffset,long expect, long update）方 法 ： 其中 compareAndSwap 的意思是**比较并交换**。 CAS 有四个操作数， 分别为 ： **对象内存位置**、 **对象中的变量的偏移量**、 **变量预期值**和**新的值**。 其操作含义是， 如果对象 obj 中内存偏移量为 valueOffset 的变量值为 expect，则使用新的值 update 替换旧的值 expect。 这是处理器提供的一个原子性指令。

关于 CAS 操作有个经典的 **ABA 问题**， 具体如下： 假如线程 I 使用 CAS 修改初始值 为 A 的变量 X， 那么线程 I 会首先去获取当前变量 X 的值（为 A〕， 然后使用 CAS 操作尝 试修改 X 的值为 B， 如果使用 CAS 操作成功了 ， 那么程序运行一定是正确的吗？其实未必， 这是因为有可能在线程 I 获取变量 X 的值 A 后，在执行 CAS 前，线程 II 使用 CAS 修改 了变量 X 的值为 B，然后又使用 CAS 修改了变量 X 的值为 A。 所以虽然线程 I 执行 CAS 时 X 的值是 A， 但是这个 A 己经不是线程 I 获取时的 A 了 。 这就是 ABA 问题。

**ABA 问题的产生是因为变量的状态值产生了环形转换**，就是变量的值可以从 A 到 B, 然后再从 B 到 A。如果变量的值只能朝着一个方向转换，比如 A 到 B , B 到 C， 不构成环 形，就不会存在问题。 JDK 中的 **AtomicStampedReference 类**给每个变量的状态值都配备了 一个时间戳， 从而避免了 ABA 问题的产生。

![image-20200517030003561](java多线程.assets/image-20200517030003561.png)

### CAS的强大之处

CAS相对于synchronized的优势是：CAS是非阻塞的，速度更快。

下面我们来举个例子感受一下CAS的速度。

例子的需求是：模拟100个用户（线程），每个用户访问10次网站，然后统计所有用户的访问次数。

版本1：既不使用synchronized，也不使用CAS

```java
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

class Test{
    static int count=0;
    public static void request() throws InterruptedException {
        //模拟耗时5毫秒
        TimeUnit.MILLISECONDS.sleep(5);
        count++;
    }

    public static void main(String[] args) throws InterruptedException {
        long startTime=System.currentTimeMillis();
        int threadSize=100;
        CountDownLatch countDownLatch=new CountDownLatch(threadSize);
        for(int i=0;i<threadSize;i++){
            new Thread(new Runnable() {
                @Override
                public void run() {
                    try {
                        for(int j=0;j<10;j++){
                            request();
                        }
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }finally {
                        countDownLatch.countDown();
                    }
                }
            }).start();
        }
        countDownLatch.await();
        long endTime=System.currentTimeMillis();
        System.out.println(Thread.currentThread().getName() + ",耗时："+(endTime-startTime)+",count="+count);
    }
}
```

运行结果：

![image-20200517020023685](java多线程.assets/image-20200517020023685.png)

根据我们的例子需求，最终得到的访问次数count应该为100*10=1000，但是从上面的运行结果可以看到，count的值是992，而且每一次运行的结果都可能不一样，这个就是没有实现原子性的后果。耗时为 66毫秒。

> 补充知识点：**CountDownLatch**
>
> Java的concurrent包里面的CountDownLatch其实**可以把它看作一个计数器**，只不过这个计数器的操作是**原子操作**，同时只能有一个线程去操作这个计数器，也就是同时只能有一个线程去减这个计数器里面的值。
>
> 你**可以向CountDownLatch对象设置一个初始的数字作为计数值，任何调用这个对象上的await()方法的线程都会阻塞，直到这个计数器的计数值被其他的线程减为0为止。**
>
> CountDownLatch的一个非常典型的**应用场景是：有一个任务想要往下执行，但必须要等到其他的任务执行完毕后才可以继续往下执行。**假如我们这个想要继续往下执行的任务调用一个CountDownLatch对象的await()方法，其他的任务执行完自己的任务后调用同一个CountDownLatch对象上的countDown()方法，这个调用await()方法的任务将一直阻塞等待，直到这个CountDownLatch对象的计数值减到0为止。
>
> 举个例子，有三个工人在为老板干活，这个老板有一个习惯，就是当三个工人把一天的活都干完了的时候，他就来检查所有工人所干的活。记住这个条件：**三个工人先全部干完活，老板才检查**。

版本2：通过synchronized原理来保证原子性

基于上面的代码，除了给request方法添加synchronized关键字，其它都不变。

```java
    public synchronized static void request() throws InterruptedException {
        //模拟耗时5毫秒
        TimeUnit.MILLISECONDS.sleep(5);
        count++;
    }
```

运行结果：

![image-20200517020706515](java多线程.assets/image-20200517020706515.png)

结果实现了原子性，但是耗时很长，相对于不加锁时，效率低了很多。这个就是synchronized的缺点。

版本3：模拟CAS原理来保证原子性

```java
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

class Test{
    volatile static int count=0;
    public static int getCount(){return count;}

    public static void request() throws InterruptedException {
        //模拟耗时5毫秒
        TimeUnit.MILLISECONDS.sleep(5);
        int expectCount;
        while (!compareAndSwap(expectCount=getCount(),expectCount+1)){}
    }
    public static synchronized boolean compareAndSwap(int expectCount,int newCount){
        if(getCount()==expectCount){
            count=newCount;
            return true;
        }
        return false;
    }

    public static void main(String[] args) throws InterruptedException {
        long startTime=System.currentTimeMillis();
        int threadSize=100;
        CountDownLatch countDownLatch=new CountDownLatch(threadSize);
        for(int i=0;i<threadSize;i++){
            new Thread(new Runnable() {
                @Override
                public void run() {
                    try {
                        for(int j=0;j<10;j++){
                            request();
                        }
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }finally {
                        countDownLatch.countDown();
                    }
                }
            }).start();
        }
        countDownLatch.await();
        long endTime=System.currentTimeMillis();
        System.out.println(Thread.currentThread().getName() + ",耗时："+(endTime-startTime)+",count="+count);
    }
}
```

递增操作本质上可以分为3步：

1. 获取变量值，记为A
2. 递增值，B=A+1
3. 保存值，即将B赋给count

那CAS可以理解为升级了第3步，**将第3步改为了一下4个小步**：

1. 获取锁

2. 获取count最新值，记为LV

3. 判断LV是否等于A，如果相等,则将B的值赋给count，并返回true，否则返回false

   若为false则重新回到上面的第1步：获取变量值，然后第2步........

4. 释放锁

代码的运行结果为：

![image-20200517023722518](java多线程.assets/image-20200517023722518.png)

可以看到，模拟CAS的实现原理保证了原子性，而且耗时很短。

### ABA问题的代码演示

JUC包提供了一系列的原子性操作类，这些类**都是使用非阻塞算法CAS来实现的**，相比使用锁实现原子性操作，性能有很大提高。接下来，我们利用**atomicInteger原子操作类**来演示CAS的ABA问题。

```java
import java.util.concurrent.atomic.AtomicInteger;

class Test{
    public  static AtomicInteger a=new AtomicInteger(1);
    public static void main(String[] args) {
        Thread main=new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println("操作线程是："+Thread.currentThread().getName()+"，a的初始值："+a.get());
                try {
                    int expectNum=a.get();
                    int newNum=expectNum+1;
                    Thread.sleep(1000); //让主线程休眠1s，让出CPU
                    boolean isCASSuccess=a.compareAndSet(expectNum,newNum);
                    System.out.println("操作线程是："+Thread.currentThread().getName()+"CAS操作成功了吗? "+isCASSuccess);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }

            }
        },"主线程");
        Thread other=new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    Thread.sleep(20);  //确保Thread-main线程优先执行
                    a.incrementAndGet();
                    System.out.println("操作线程是："+Thread.currentThread().getName()+",进行了increment操作，a值变为："+a.get());
                    a.decrementAndGet();
                    System.out.println("操作线程是："+Thread.currentThread().getName()+",进行了decrement操作，a值变为："+a.get());
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        },"干扰线程");
        main.start();
        other.start();
    }
}
```

上面代码，other线程刚开始运行就添加睡眠时间，保证让main线程先执行，然后main线程获取完expectNum后，也休眠，而且休眠时间更长，这时候other线程已经休眠完成，继续运行，修改a的值，加1再减1。然后，main线程休眠完成，继续运行（完全不知道a的值被改过了）。

运行结果如下：

![image-20200517033741717](java多线程.assets/image-20200517033741717.png)

总结：**对于ABA问题不敏感的数据或程序，建议使用CAS来保证原子性**，但是如果数据对ABA问题敏感，比如说涉及到钱或者银行相关业务的，建议不要使用CAS，可以使用锁或者其它方式。

JDK中还提供了**AtomicStampedReference**类来**避免ABA问题**的产生，这个类可以给每个变量的值配备一个**时间戳（版本号）**。代码演示：

```java
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicStampedReference;

class Test{
    public  static AtomicStampedReference<Integer> a=new AtomicStampedReference<Integer>(1,1);
    public static void main(String[] args) {
        Thread main=new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println("操作线程是："+Thread.currentThread().getName()+"，a的初始值："+a.getReference());
                try {
                    Integer expectReference=a.getReference();
                    Integer newReference=expectReference+1;
                    Integer expectStamp=a.getStamp();
                    Integer newStamp=expectStamp+1;
                    Thread.sleep(1000); //让主线程休眠1s，让出CPU
                    boolean isCASSuccess=a.compareAndSet(expectReference,newReference,expectStamp,newStamp);
                    System.out.println("操作线程是："+Thread.currentThread().getName()+"CAS操作成功了吗? "+isCASSuccess);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }

            }
        },"主线程");
        Thread other=new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    Thread.sleep(20);  //确保Thread-main线程优先执行
                    a.compareAndSet(a.getReference(),(a.getReference()+1),a.getStamp(),(a.getStamp()+1));
                    System.out.println("操作线程是："+Thread.currentThread().getName()+",进行了increment操作，a值变为："+a.getReference());
                    a.compareAndSet(a.getReference(),(a.getReference()-1),a.getStamp(),(a.getStamp()+1));
                    System.out.println("操作线程是："+Thread.currentThread().getName()+",进行了decrement操作，a值变为："+a.getReference());
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        },"干扰线程");
        main.start();
        other.start();
    }
}
```

运行结果为：

![image-20200517035954911](java多线程.assets/image-20200517035954911.png)

可以看到，**AtomicStampedReference类解决了ABA问题。**

### CAS的其它缺点

CAS虽然很高效的解决了原子操作问题，但是CAS仍然存在三大问题。

1. 循环时间长开销很大。
2. 只能保证一个共享变量的原子操作。
3. ABA问题。（前面讲了）

+循环时间长开销很大：

我们可以看到getAndAddInt方法执行时，如果CAS失败，会一直进行尝试。如果CAS长时间一直不成功，可能会给CPU带来很大的开销。

只能保证一个共享变量的原子操作：

当对一个共享变量执行操作时，我们可以使用循环CAS的方式来保证原子操作，但是对多个共享变量操作时，循环CAS就无法保证操作的原子性，这个时候就可以用锁来保证原子性。


## 不同类型的锁

### 乐观锁与悲观锁

乐观锁和悲观锁是在**数据库中引入的名词**，但是在并发包锁里面也引入了类似的思想， 所以这里还是有必要讲解下。

**悲观锁指对数据被外界修改持保守态度**，认为数据很容易就会被其他线程修改，所以在数据被处理前先对数据进行加锁，并在整个数据处理过程中，使数据处于锁定状态。 悲观锁的实现往往依靠数据库提供的锁机制，即在数据库中 ，**在对数据记录操作前给记录加排它锁**。 如果获取锁失败， 则说明数据正在被其他线程修改， 当前线程则等待或者抛出异 常。 如果获取锁成功，则对记录进行操作，然后提交事务后释放排它锁。

乐观锁是相对悲观锁来说的，它**认为数据在一般情况下不会造成冲突**，所以在**访问记录前不会加排它锁**，而是在进行数据提交更新时，才会正式对数据冲突与否进行检测。**具体来说，根据 update 返回的行数让用户决定如何去做**。

### 公平锁与非公平锁

根据线程获取**锁的抢占机制**，锁可以分为公平锁和非公平锁，公平锁表示线程获取锁的顺序是按照线程请求锁的时间早晚来决定的，也就是最早请求锁的线程将最早获取到锁。 而非公平锁则在运行时闯入，也就是**先来不一定先得**。

ReentrantLock 提供了公平和非公平锁的实现。

- 公平锁： ReentrantLock pairLock =new ReentrantLock(true）。 
- 非公平锁： ReentrantLock pairLock =new ReentrantLock(false）。 

如果构造函数不传递参数，则默认是非公平锁。

例如，假设线程 A 已经持有了锁，这时候线程 B 请求该锁其将会被挂起。 当线程 A 释放锁后，假如当前有线程 C 也需要获取该锁，如果采用非公平锁方式，则根据线程调度 策略， 线程 B 和线程 C 两者之一可能获取锁，这时候不需要任何其他干涉，而**如果使用公平锁则需要把 C 挂起，让B 获取当前锁。**

**在没有公平性需求的前提下尽量使用非公平锁，因为公平锁会带来性能开销。**

### 独占锁与共享锁

根据锁只能被单个线程持有还是能被多个线程共同持有，锁可以分为独占锁和共享锁。

**独占锁保证任何时候都只有一个线程能得到锁**， ==ReentrantLock 就是以独占方式实现的==。 共享锁则可以同时由多个线程持有，例如==ReadWriteLock 读写锁==，它允许一个资源可以被多线程同时进行读操作。

**独占锁是一种悲观锁**，由于每次访问资源都先加上互斥锁，这限制了并发性，因为读操作并不会影响数据的一致性，而独占锁只允许在同一时间由一个线程读取数据，其他线 程必须等待当前线程释放锁才能进行读取。

**共享锁则是一种乐观锁**，它放宽了加锁的条件，**允许多个线程同时进行==读操作==**。

### 可重入锁

当一个线程要获取一个被其他线程持有的独占锁时，该线程会被阻塞，那么当一个线程再次获取它自己己经获取的锁时是否会被阻塞呢？如果不被阻塞，那么我们说该锁是可重入的，也就是只要该**线程获取了该锁，那么可以无限次数（在高级篇中我们将知道，严 格来说是有限次数）地进入被该锁锁住的代码。**

下面看一个例子，看看在什么情况下会使用可重入锁。

```java
synchronized(myObject){
    //一堆代码
    synchronized(myObjet){ 
        //一堆代码
    }
}
```

实际上， **synchronized 内部锁和Reetrantlock都是可重入锁**。 ==可重入锁的原理是在锁内部维护一个线程标示monitor，用来标示该锁目前被哪个线程占用，然后关联一个计数器。一开始计数器值为0, 说明该锁没有被任何线程占用 。 当一个钱程获取了该锁时，计数器的值会+1 ，这时其他线程再来获取该锁时会发现锁的所有者不是自己而被阻塞挂起。==

但是当获取了该锁的线程再次获取锁时发现锁拥有者是自己，就会把计数器值加＋1, 当释放锁后计数器值 － 1 。 当计数器值为 0 时，**锁里面的线程标示被重置为 null**， 这时候被阻塞的线程会被唤醒来竞争获取该锁。

### 自旋锁

由于 Java 中的线程是与操作系统中的线程一一对应的，所以当一个线程在获取锁（比 如独占锁）失败后，会被切换到内核状态而被挂起。 当该线程获取到锁时又需要将其切换 到内核状态而唤醒该线程。 而**从用户状态切换到内核状态的开销是比较大**的，在一定程度 上会影响并发性能。自旋锁则是，当前线程在获取锁时，如果发现锁已经被其他线程占有， 它**不马上阻塞自己，在不放弃 CPU 使用权的情况下，多次尝试获取**（默认次数是 10，可 以使用 **-XX:PreBlockSpinsh** 参数设置该值），很有可能在后面几次尝试中其他线程己经释放了锁。 如果尝试指定的次数后仍没有获取到锁则当前线程才会被阻塞挂起。 由此看来自 旋锁是**使用 CPU 时间换取线程阻塞与调度的开销**，但是很有可能这些 CPU 时间白白浪费了 。

补充：

ReentrantLock常常对比着synchronized来分析，我们先对比着来看然后再一点一点分析。

（1）synchronized是独占锁，加锁和解锁的过程自动进行，易于操作，但不够灵活。ReentrantLock也是独占锁，加锁和解锁的过程需要手动进行，不易操作，但非常灵活。

（2）synchronized可重入，因为加锁和解锁自动进行，不必担心最后是否释放锁；ReentrantLock也可重入，但加锁和解锁需要手动进行，且次数需一样，否则其他线程无法获得锁。

（3）synchronized不可响应中断，一个线程获取不到锁就一直等着；ReentrantLock可以相应中断。

## 原子操作类TODO

JUC 包提供了一系列的原子性操作类，这些类**都是使用非阻塞算法 CAS 实现的**，相 比使用锁实现原子性操作这在性能上有很大提高。由于原子性操作类的原理都大致相同， 所以本章只讲解最简单的 AtomicLong 类的实现原理以及 **JDK 8 中新增的 LongAdder 和 LongAccumulator 类**的原理。有了这些基础， 再去理解其他原子性操作类的实现就不会感到困难了 。

原子变量操作类:

JUC 并发包中包含有 Atomiclnteger、 AtomicLong 和 AtomicBoolean 等原子性操作类， 它们的原理类似。

JDK 8 新增的原子操作类 LongAdder的简单介绍：

前面讲过， AtomicLong 通过 CAS 提供了非阻塞的原子性操作，相比使用阻塞算法的 同步器来说它的性能己经很好了，但是 JDK 开发组并不满足于此。 使用 AtomicLong 时， 在高并发下大量线程会同时去竞争更新同一个原子变量，但是由于同时只有一个线程的 CAS 操作会成功，这就造成了**大量线程竞争失败后，会通过无限循环不断进行自旋尝试 CAS 的操作， 而这会白白浪费 CPU 资源。**

因此 JDK 8 新增了一个原子性递增或者递减类 LongAdder 用来**克服在高并发下使用 AtomicLong 的缺点**。 

既然AtomicLong 的性能瓶颈是**由于过多线程同时去竞争一个变量的更新而产生的**，那么如果把一个变量分解为多个变量，让同样多的线程去竞争多个资源， 是不是就解决了性能问题？是的， LongAdder 就是这个思路。 下面通过图来理解两者设计 的不同之处，如图 4-1 所示。

![image-20200530021921421](java多线程.assets/image-20200530021921421.png)

如图 4-1 所示，使用 AtomicLong 时，是多个线程同时竞争同一个原子变量。

![image-20200530022003153](java多线程.assets/image-20200530022003153.png)

如图 4-2 所示，**使用 LongAdder 时，则是在内部维护多个 Cell 变量**，每个 Cell 里面有一个初始值为 0 的 long 型变量，这样，在同等并发量的情况下，争夺单个变量更新操 作的线程量会减少，这变相地减少了争夺共享资源的并发量。另外，多个线程在**争夺同一 个 Cell 原子变量时如果失败了 ， 它并不是在当前 Cell 变量上一直自旋 CAS 重试，而是尝 试在其他 Cell 的变量上进行 CAS 尝试，这个改变增加了当前线程重试 CAS 成功的可能性**。 最后，在获取 LongAdder 当前值时， 是把所有 Cell 变量的 value 值累加后再加上 base 返回的。

LongAdder 维护了 一个延迟初始化的原子性更新数组（默认情况下 Cell 数组是 null〕 和一个基值变量 base。 由于 Cells 占用的内存是相对比较大的，所以一开始并不创建它， 而是在需要时创建，也就是**惰性加载**。

当一开始判断 Cell 数组是 null 并且**并发线程较少时，所有的累加操作都是对 base 变量进行的**。 保持 Cell 数组的大小为 2 的 N 次方，在初始化时 Cell 数组中的 Cell 元素个数 为 2，数组里面的变量实体是 Cell 类型。 **Cell 类型是 AtomicLong 的一个改进**，用来减少缓存的争用，也就是解决伪共享问题。

对于大多数孤立的多个原子操作进行字节填充是浪费的，因为原子性操作都是无规律地分散在内存中的 （也就是说多个原子性变量的内存地址是不连续的）， 多个原子变量被放入同一个缓存行的可能性很小。 但是原子性数组元素的内存地址是连续的，所以数组内 的多个元素能经常共享缓存行，因此这里使用 ＠sun.misc.Contended 注解对 Cell 类进行字节填充，这防止了数组中多个元素共享一个缓存行，在性能上是一个提升。

## AQS

### Java并发面试问题之谈谈你对AQS的理解？

###### 一、ReentrantLock和AQS的关系

首先我们来看看，如果用java并发包下的`ReentrantLock`来加锁和释放锁，是个什么样的感觉？

这个基本学过java的同学应该都会吧，毕竟这个是java并发基本API的使用，应该每个人都是学过的，所以我们直接看一下代码就好了：

![img](java多线程.assets/640.png)

上面那段代码应该不难理解吧，无非就是搞一个Lock对象，然后加锁和释放锁。

你这时可能会问，这个跟AQS有啥关系？关系大了去了！因为**java并发包下很多API都是基于AQS来实现的加锁和释放锁等功能的，AQS是java并发包的基础类。**

举个例子，比如==说ReentrantLock、ReentrantReadWriteLock底层都是基于AQS来实现的。==

那么AQS的全称是什么呢？**AbstractQueuedSynchronizer，抽象队列同步器**。给大家画一个图先，看一下ReentrantLock和AQS之间的关系。

![img](java多线程.assets/640.jpg)

我们来看上面的图。说白了，ReentrantLock内部包含了一个AQS对象，也就是AbstractQueuedSynchronizer类型的对象。这个**AQS对象就是ReentrantLock可以实现加锁和释放锁的关键性的核心组件。**

###### 二、ReentrantLock加锁和释放锁的底层原理

好了，那么现在如果有一个线程过来尝试用ReentrantLock的lock()方法进行加锁，会发生什么事情呢？

很简单，这个AQS对象内部有一个核心的变量叫做**state**，是int类型的，代表了**加锁的状态**。初始状态下，这个state的值是0。

另外，这个AQS内部还有一个**关键变量**，用来记录**当前加锁的是哪个线程**，初始化状态下，这个变量是null。

![image-20200517044322274](java多线程.assets/image-20200517044322274.png)

接着线程1跑过来调用ReentrantLock的lock()方法尝试进行加锁，这个加锁的过程，直接就是用CAS操作将state值从0变为1。

如果不知道CAS是啥的，请看上篇文章，[《大白话聊聊Java并发面试问题之Java 8如何优化CAS性能？》](http://mp.weixin.qq.com/s?__biz=MzU0OTk3ODQ3Ng==&mid=2247484070&idx=1&sn=c1d49bce3c9da7fcc7e057d858e21d69&chksm=fba6eaa5ccd163b3a935303f10a54a38f15f3c8364c7c1d489f0b1aa1b2ef293a35c565d2fda&scene=21#wechat_redirect)

如果之前没人加过锁，那么state的值肯定是0，此时线程1就可以加锁成功。

一旦线程1加锁成功了之后，就可以设置当前加锁线程是自己。所以大家看下面的图，就是线程1跑过来加锁的一个过程。

![image-20200517044401525](java多线程.assets/image-20200517044401525.png)

其实看到这儿，大家应该对所谓的AQS有感觉了。说白了，就是并发包里的一个核心组件，里面有state变量、加锁线程变量等核心的东西，维护了加锁状态。

你会发现，ReentrantLock这种东西只是一个外层的API，**内核中的锁机制实现都是依赖AQS组件的**。

这个ReentrantLock之所以用Reentrant打头，意思就是他是一个可重入锁。

可重入锁的意思，就是你可以对一个ReentrantLock对象多次执行lock()加锁和unlock()释放锁，也就是可以对一个锁加多次，叫做可重入加锁。

大家看明白了那个state变量之后，就知道了如何进行可重入加锁！

其实每次线程1可重入加锁一次，会判断一下当前加锁线程就是自己，那么他自己就可以可重入多次加锁，每次加锁就是把state的值给累加1，别的没啥变化。

接着，如果线程1加锁了之后，线程2跑过来加锁会怎么样呢？

**我们来看看锁的互斥是如何实现的？**线程2跑过来一下看到，哎呀！state的值不是0啊？所以CAS操作将state从0变为1的过程会失败，因为state的值当前为1，说明已经有人加锁了！

接着线程2会看一下，是不是自己之前加的锁啊？当然不是了，**“加锁线程”**这个变量明确记录了是线程1占用了这个锁，所以线程2此时就是加锁失败。

给大家来一张图，一起来感受一下这个过程：

![image-20200517044444863](java多线程.assets/image-20200517044444863.png)



接着，线程2会将自己放入AQS中的一个等待队列，因为自己尝试加锁失败了，此时就要将自己放入队列中来等待，等待线程1释放锁之后，自己就可以重新尝试加锁了

所以大家可以看到，AQS是如此的核心！AQS内部还有一个等待队列，专门放那些加锁失败的线程！

同样，给大家来一张图，一起感受一下：

![image-20200517044505568](java多线程.assets/image-20200517044505568.png)



接着，线程1在执行完自己的业务逻辑代码之后，就会释放锁！**他释放锁的过程非常的简单**，就是将AQS内的state变量的值递减1，如果state值为0，则彻底释放锁，会将“加锁线程”变量也设置为null！

整个过程，参见下图：

![image-20200517044523242](java多线程.assets/image-20200517044523242.png)

接下来，会从**等待队列的队头唤醒线程2重新尝试加锁。**

好！线程2现在就重新尝试加锁，这时还是用CAS操作将state从0变为1，此时就会成功，成功之后代表加锁成功，就会将state设置为1。

此外，还要把**“加锁线程”**设置为线程2自己，同时线程2自己就从等待队列中出队了。

最后再来一张图，大家来看看这个过程。

![image-20200517044541595](java多线程.assets/image-20200517044541595.png)

### AQS的深入学习

AQS是什么？

AQS是锁的底层支持，AbstractQueuedSynchronizer 抽象同步队列简称 AQS，它是实现同步器的基础组件， **并发包中锁的底层就是使用 AQS 实现的**。 另外，大多数开发者可能永远不会直接使用 AQS，但是知道其原理对于架构设计还是很有帮助的。 

**AQS实现原理**

`AQS`中 维护了一个`volatile int state`（代表共享资源）和一个`FIFO`线程等待队列（多线程争用资源被阻塞时会进入此队列）。

这里`volatile`能够保证多线程下的可见性，当`state=1`则代表当前对象锁已经被占有，其他线程来加锁时则会失败，加锁失败的线程会被放入一个`FIFO`的等待队列中，比列会被`UNSAFE.park()`操作挂起，等待其他获取锁的线程释放锁才能够被唤醒。

另外`state`的操作都是通过`CAS`来保证其并发修改的安全性。

具体原理我们可以用一张图来简单概括：

![img](java多线程.assets/640-1589694043732.png)     

`AQS` 中提供了很多关于锁的实现方法，

- getState()：获取锁的标志state值
- setState()：设置锁的标志state值
- tryAcquire(int)：独占方式获取锁。尝试获取资源，成功则返回true，失败则返回false。
- tryRelease(int)：独占方式释放锁。尝试释放资源，成功则返回true，失败则返回false。

这里还有一些方法并没有列出来，接下来我们以`ReentrantLock`作为突破点通过源码和画图的形式一步步了解`AQS`内部实现原理。

![img](java多线程.assets/640-1589694043760.png)



 **目录结构**

文章准备模拟多线程竞争锁、释放锁的场景来进行分析`AQS`源码：

**三个线程(线程一、线程二、线程三)同时来加锁/释放锁**

**目录如下：**

- **线程一**加锁成功时`AQS`内部实现
- **线程二/三**加锁失败时`AQS`中等待队列的数据模型
- **线程一**释放锁及**线程二**获取锁实现原理
- 通过线程场景来讲解**公平锁**具体实现原理
- 通过线程场景来讲解Condition中a`wait()`和`signal()`实现原理

这里会通过画图来分析每个线程加锁、释放锁后`AQS`内部的数据结构和实现原理

##### 线程一加锁成功

如果同时有**三个线程**并发抢占锁，此时**线程一**抢占锁成功，**线程二**和**线程三**抢占锁失败，具体执行流程如下：

![img](java多线程.assets/640-1589694043760-1610882192811.png)

此时`AQS`内部数据为：

![img](java多线程.assets/640-1589694043765.png)

**线程二**、**线程三**加锁失败：

![img](java多线程.assets/640-1589694043827.png)

有图可以看出，等待队列中的节点`Node`是一个双向链表，这里`SIGNAL`是`Node`中`waitStatus`属性，`Node`中还有一个`nextWaiter`属性，这个并未在图中画出来，这个到后面`Condition`会具体讲解的。

`waitStatus`记录当前线程等待状态，可以为 CANCELLED （线程被取消了）、 SIGNAL （线程需要被唤醒）、 CONDITION （线程在条件队列里面等待〉、 PROPAGATE （释 放共享资源时需要通知其他节点〕； prev 记录当前节点的前驱节点， next 记录当前节点的 后继节点。

具体看下抢占锁代码实现：

```java
java.util.concurrent.locks.ReentrantLock .NonfairSync:
static final class NonfairSync extends Sync {
    
    final void lock() {
        if (compareAndSetState(0, 1))
            setExclusiveOwnerThread(Thread.currentThread());
        else
            acquire(1);
    }

    protected final boolean tryAcquire(int acquires) {
        return nonfairTryAcquire(acquires);
    }
}
```

这里使用的**ReentrantLock非公平锁**，线程进来直接利用`CAS`尝试抢占锁，如果抢占成功`state`值回被改为1，且设置对象独占锁线程为当前线程。如下所示：

```java
protected final boolean compareAndSetState(int expect, int update) {
    return unsafe.compareAndSwapInt(this, stateOffset, expect, update);
}

protected final void setExclusiveOwnerThread(Thread thread) {
    exclusiveOwnerThread = thread;
}
```

##### 线程二抢占锁失败

我们按照真实场景来分析，**线程一**抢占锁成功后，`state`变为1，**线程二**通过`CAS`修改`state`变量必然会失败。此时`AQS`中`FIFO`(First In First Out 先进先出)队列中数据如图所示：

![img](java多线程.assets/640-1589694043844.png)

我们将**线程二**执行的逻辑一步步拆解来看：

`java.util.concurrent.locks.AbstractQueuedSynchronizer.acquire()`:

```java
public final void acquire(int arg) {
    if (!tryAcquire(arg) &&
        acquireQueued(addWaiter(Node.EXCLUSIVE), arg))
        selfInterrupt();
}
```

先看看`tryAcquire()`的具体实现：`java.util.concurrent.locks.ReentrantLock .nonfairTryAcquire()`:

```java
final boolean nonfairTryAcquire(int acquires) {
    final Thread current = Thread.currentThread();
    int c = getState();
    if (c == 0) {
        if (compareAndSetState(0, acquires)) {
            setExclusiveOwnerThread(current);
            return true;
        }
    }
    else if (current == getExclusiveOwnerThread()) {
        int nextc = c + acquires;
        if (nextc < 0)
            throw new Error("Maximum lock count exceeded");
        setState(nextc);
        return true;
    }
    return false;
}
```

`nonfairTryAcquire()`方法中首先会获取`state`的值，如果不为0则说明当前对象的锁已经被其他线程所占有，接着判断占有锁的线程是否为当前线程，如果是则累加`state`值，这就是可重入锁的具体实现，累加`state`值，释放锁的时候也要依次递减`state`值。

如果`state`为0，则执行`CAS`操作，尝试更新`state`值为1，如果更新成功则代表当前线程加锁成功。

以**线程二**为例，因为**线程一**已经将`state`修改为1，所以**线程二**通过`CAS`修改`state`的值不会成功。加锁失败。

**线程二**执行`tryAcquire()`后会返回false，接着执行`addWaiter(Node.EXCLUSIVE)`逻辑，将自己加入到一个`FIFO`等待队列中，代码实现如下：

`java.util.concurrent.locks.AbstractQueuedSynchronizer.addWaiter()`:

```java
private Node addWaiter(Node mode) {    
    Node node = new Node(Thread.currentThread(), mode);
    Node pred = tail;
    if (pred != null) {
        node.prev = pred;
        if (compareAndSetTail(pred, node)) {
            pred.next = node;
            return node;
        }
    }
    enq(node);
    return node;
}
```

这段代码首先会创建一个和当前线程绑定的`Node`节点，`Node`为双向链表。此时等待对内中的`tail`指针为空，直接调用`enq(node)`方法将当前线程加入等待队列尾部：

```java
private Node enq(final Node node) {
    for (;;) {
        Node t = tail;
        if (t == null) {
            if (compareAndSetHead(new Node()))
                tail = head;
        } else {
            node.prev = t;
            if (compareAndSetTail(t, node)) {
                t.next = node;
                return t;
            }
        }
    }
}
```

第一遍循环时`tail`指针为空，进入if逻辑，使用`CAS`操作设置`head`指针，将`head`指向一个新创建的`Node`节点。此时`AQS`中数据：

![img](java多线程.assets/640-1589694043851.png)

执行完成之后，`head`、`tail`、`t`都指向第一个`Node`元素。

接着执行第二遍循环，进入`else`逻辑，此时已经有了`head`节点，这里要操作的就是将**线程二**对应的`Node`节点挂到`head`节点后面。此时队列中就有了两个`Node`节点：

![img](java多线程.assets/640-1589694043857.png)

`addWaiter()`方法执行完后，会返回当前线程创建的节点信息。继续往后执行`acquireQueued(addWaiter(Node.EXCLUSIVE), arg)`逻辑，此时传入的参数为**线程二**对应的`Node`节点信息：

`java.util.concurrent.locks.AbstractQueuedSynchronizer.acquireQueued()`:

```java
final boolean acquireQueued(final Node node, int arg) {
    boolean failed = true;
    try {
        boolean interrupted = false;
        for (;;) {
            final Node p = node.predecessor();
            if (p == head && tryAcquire(arg)) {
                setHead(node);
                p.next = null; // help GC
                failed = false;
                return interrupted;
            }
            if (shouldParkAfterFailedAcquire(p, node) &&
                parkAndChecknIterrupt())
                interrupted = true;
        }
    } finally {
        if (failed)
            cancelAcquire(node);
    }
}

private static boolean shouldParkAfterFailedAcquire(Node pred, Node node) {
    int ws = pred.waitStatus;
    if (ws == Node.SIGNAL)
        return true;
    if (ws > 0) {
        do {
            node.prev = pred = pred.prev;
        } while (pred.waitStatus > 0);
        pred.next = node;
    } else {
        compareAndSetWaitStatus(pred, ws, Node.SIGNAL);
    }
    return false;
}

private final boolean parkAndCheckInterrupt() {
    LockSupport.park(this);
    return Thread.interrupted();
}
```

`acquireQueued()`这个方法会先判断当前传入的`Node`对应的前置节点是否为`head`，如果是则尝试加锁。加锁成功过则将当前节点设置为`head`节点，然后空置之前的`head`节点，方便后续被垃圾回收掉。

如果加锁失败或者`Node`的前置节点不是`head`节点，就会通过`shouldParkAfterFailedAcquire`方法 将`head`节点的`waitStatus`变为了`SIGNAL=-1`，最后执行`parkAndChecknIterrupt`方法，调用`LockSupport.park()`挂起当前线程。

此时`AQS`中的数据如下图：

![img](java多线程.assets/640-1589695221137.png)

此时**线程二**就静静的待在`AQS`的等待队列里面了，等着其他线程释放锁来唤醒它。

##### 线程三抢占锁失败

看完了**线程二**抢占锁失败的分析，那么再来分析**线程三**抢占锁失败就很简单了，先看看`addWaiter(Node mode)`方法：

```java
private Node addWaiter(Node mode) {
    Node node = new Node(Thread.currentThread(), mode);
    Node pred = tail;
    if (pred != null) {
        node.prev = pred;
        if (compareAndSetTail(pred, node)) {
            pred.next = node;
            return node;
        }
    }
    enq(node);
    return node;
}
```

此时等待队列的`tail`节点指向**线程二**，进入`if`逻辑后，通过`CAS`指令将`tail`节点重新指向**线程三**。

接着**线程三**调用`enq()`方法执行入队操作，和上面**线程二**执行方式是一致的，入队后会修改**线程二**对应的`Node`中的`waitStatus=SIGNAL`。最后**线程三**也会被挂起。此时等待队列的数据如图：

![img](java多线程.assets/640-1589694993350.png)

##### 线程一释放锁

现在来分析下释放锁的过程，首先是**线程一**释放锁，释放锁后会唤醒`head`节点的后置节点，也就是我们现在的**线程二**，具体操作流程如下：

![img](java多线程.assets/640-1589695016844.png)

执行完后等待队列数据如下：

![img](java多线程.assets/640-1589695030389.png)

此时**线程二**已经被唤醒，继续尝试获取锁，如果获取锁失败，则会继续被挂起。如果获取锁成功，则`AQS`中数据如图：

![img](java多线程.assets/640-1589695070323.png)

接着还是一步步拆解来看，先看看**线程一**释放锁的代码：

```
java.util.concurrent.locks.AbstractQueuedSynchronizer.release()
public final boolean release(int arg) {
    if (tryRelease(arg)) {
        Node h = head;
        if (h != null && h.waitStatus != 0)
            unparkSuccessor(h);
        return true;
    }
    return false;
}
```

这里首先会执行`tryRelease()`方法，这个方法具体实现在`ReentrantLock`中，如果`tryRelease`执行成功，则继续判断`head`节点的`waitStatus`是否为0

前面我们已经看到过，`head`的`waitStatue`为`SIGNAL(-1)`，这里就会执行`unparkSuccessor()`方法来唤醒`head`的后置节点，也就是我们上面图中**线程二**对应的`Node`节点。

此时看`ReentrantLock.tryRelease()`中的具体实现：

```
protected final boolean tryRelease(int releases) {
    int c = getState() - releases;
    if (Thread.currentThread() != getExclusiveOwnerThread())
        throw new IllegalMonitorStateException();
    boolean free = false;
    if (c == 0) {
        free = true;
        setExclusiveOwnerThread(null);
    }
    setState(c);
    return free;
}
```

执行完`ReentrantLock.tryRelease()`后，`state`被设置成0，Lock对象的独占锁被设置为null。此时看下`AQS`中的数据：

![img](java多线程.assets/640-1589695169509.png)

接着执行`java.util.concurrent.locks.AbstractQueuedSynchronizer.unparkSuccessor()`方法，唤醒`head`的后置节点：

```
private void unparkSuccessor(Node node) {
    int ws = node.waitStatus;
    if (ws < 0)
        compareAndSetWaitStatus(node, ws, 0);
    Node s = node.next;
    if (s == null || s.waitStatus > 0) {
        s = null;
        for (Node t = tail; t != null && t != node; t = t.prev)
            if (t.waitStatus <= 0)
                s = t;
    }
    if (s != null)
        LockSupport.unpark(s.thread);
}
```

这里主要是将`head`节点的`waitStatus`设置为0，然后解除`head`节点`next`的指向，使`head`节点空置，等待着被垃圾回收。

此时重新将`head`指针指向**线程二**对应的`Node`节点，且使用`LockSupport.unpark`方法来唤醒**线程二**。

被唤醒的**线程二**会接着尝试获取锁，用`CAS`指令修改`state`数据。执行完成后可以查看`AQS`中数据：

![img](java多线程.assets/640-1589695306936.png)

此时**线程二**被唤醒，**线程二**接着之前被`park`的地方继续执行，继续执行`acquireQueued()`方法。

##### 线程二唤醒继续加锁

```
final boolean acquireQueued(final Node node, int arg) {
    boolean failed = true;
    try {
        boolean interrupted = false;
        for (;;) {
            final Node p = node.predecessor();
            if (p == head && tryAcquire(arg)) {
                setHead(node);
                p.next = null; // help GC
                failed = false;
                return interrupted;
            }
            if (shouldParkAfterFailedAcquire(p, node) &&
                parkAndCheckInterrupt())
                interrupted = true;
        }
    } finally {
        if (failed)
            cancelAcquire(node);
    }
}
```

此时**线程二**被唤醒，继续执行`for`循环，判断**线程二**的前置节点是否为`head`，如果是则继续使用`tryAcquire()`方法来尝试获取锁，其实就是使用`CAS`操作来修改`state`值，如果修改成功则代表获取锁成功。接着将**线程二**设置为`head`节点，然后空置之前的`head`节点数据，被空置的节点数据等着被**垃圾回收**。

此时线程三获取锁成功，`AQS`中队列数据如下：

![img](java多线程.assets/640-1589695330310.png)

等待队列中的数据都等待着被垃圾回收。

##### 线程二释放锁/线程三加锁

当**线程二**释放锁时，会唤醒被挂起的**线程三**，流程和上面大致相同，被唤醒的**线程三**会再次尝试加锁，具体代码可以参考上面内容。具体流程图如下：

![img](java多线程.assets/640-1589695361730.png)

此时`AQS`中队列数据如图：

![img](java多线程.assets/640-1589695383352.png)



#####  公平锁实现原理

上面所有的加锁场景都是基于**非公平锁**来实现的，**非公平锁**是`ReentrantLock`的默认实现，那我们接着来看一下**公平锁**的实现原理，这里先用一张图来解释**公平锁**和**非公平锁**的区别：



**非公平锁**执行流程：

![img](java多线程.assets/640-1589695434904.png)

这里我们还是用之前的线程模型来举例子，当**线程二**释放锁的时候，唤醒被挂起的**线程三**，**线程三**执行`tryAcquire()`方法使用`CAS`操作来尝试修改`state`值，如果此时又来了一个**线程四**也来执行加锁操作，同样会执行`tryAcquire()`方法。

这种情况就会出现竞争，**线程四**如果获取锁成功，**线程三**仍然需要待在等待队列中被挂起。这就是所谓的**非公平锁**，**线程三**辛辛苦苦排队等到自己获取锁，却眼巴巴的看到**线程四**插队获取到了锁。

**公平锁**执行流程：

![img](java多线程.assets/640-1589695447782.png)

公平锁在加锁的时候，会先判断`AQS`等待队列中是存在节点，如果存在节点则会直接入队等待，具体代码如下.

公平锁在获取锁是也是首先会执行`acquire()`方法，只不过公平锁单独实现了`tryAcquire()`方法：

`#java.util.concurrent.locks.AbstractQueuedSynchronizer.acquire()`:

```
public final void acquire(int arg) {
    if (!tryAcquire(arg) &&
        acquireQueued(addWaiter(Node.EXCLUSIVE), arg))
        selfInterrupt();
}
```

这里会执行`ReentrantLock`中公平锁的`tryAcquire()`方法

`#java.util.concurrent.locks.ReentrantLock.FairSync.tryAcquire()`:

```
static final class FairSync extends Sync {
    protected final boolean tryAcquire(int acquires) {
        final Thread current = Thread.currentThread();
        int c = getState();
        if (c == 0) {
            if (!hasQueuedPredecessors() &&
                compareAndSetState(0, acquires)) {
                setExclusiveOwnerThread(current);
                return true;
            }
        }
        else if (current == getExclusiveOwnerThread()) {
            int nextc = c + acquires;
            if (nextc < 0)
                throw new Error("Maximum lock count exceeded");
            setState(nextc);
            return true;
        }
        return false;
    }
}
```

这里会先判断`state`值，如果不为0且获取锁的线程不是当前线程，直接返回false代表获取锁失败，被加入等待队列。如果是当前线程则可重入获取锁。

如果`state=0`则代表此时没有线程持有锁，执行`hasQueuedPredecessors()`判断`AQS`等待队列中是否有元素存在，如果存在其他等待线程，那么自己也会加入到等待队列尾部，做到真正的先来后到，有序加锁。具体代码如下：

`#java.util.concurrent.locks.AbstractQueuedSynchronizer.hasQueuedPredecessors()`:

```
public final boolean hasQueuedPredecessors() {
    Node t = tail;
    Node h = head;
    Node s;
    return h != t &&
        ((s = h.next) == null || s.thread != Thread.currentThread());
}
```

这段代码很有意思，返回`false`代表队列中没有节点或者仅有一个节点是当前线程创建的节点。返回`true`则代表队列中存在等待节点，当前线程需要入队等待。

![img](java多线程.assets/640-1589695478352.png)

先判断`head`是否等于`tail`，如果队列中只有一个`Node`节点，那么`head`会等于`tail`，接着判断`head`的后置节点，这里肯定会是`null`，如果此`Node`节点对应的线程和当前的线程是同一个线程，那么则会返回`false`，代表没有等待节点或者等待节点就是当前线程创建的`Node`节点。此时当前线程会尝试获取锁。

如果`head`和`tail`不相等，说明队列中有等待线程创建的节点，此时直接返回`true`，如果只有一个节点，而此节点的线程和当前线程不一致，也会返回`true`

**非公平锁**和**公平锁**的区别：**非公平锁**性能高于**公平锁**性能。**非公平锁**可以减少`CPU`唤醒线程的开销，整体的吞吐效率会高点，`CPU`也不必取唤醒所有线程，会减少唤起线程的数量

**非公平锁**性能虽然优于**公平锁**，但是会存在导致**线程饥饿**的情况。在最坏的情况下，可能存在某个线程**一直获取不到锁**。不过相比性能而言，饥饿问题可以暂时忽略，这可能就是`ReentrantLock`默认创建非公平锁的原因之一了。

#####  Condition实现原理

**Condition 简介**

上面已经介绍了`AQS`所提供的核心功能，当然它还有很多其他的特性，这里我们来继续说下`Condition`这个组件。

```
Condition`是在`java 1.5`中才出现的，它用来替代传统的`Object`的`wait()`、`notify()`实现线程间的协作，相比使用`Object`的`wait()`、`notify()`，使用`Condition`中的`await()`、`signal()`这种方式实现线程间协作更加安全和高效。因此通常来说比较推荐使用`Condition
```

其中`AbstractQueueSynchronizer`中实现了`Condition`中的方法，主要对外提供`awaite(Object.wait())`和`signal(Object.notify())`调用。

##### Condition Demo示例

使用示例代码：

```
/**
 * ReentrantLock 实现源码学习
 * @author 一枝花算不算浪漫
 * @date 2020/4/28 7:20
 */
public class ReentrantLockDemo {
    static ReentrantLock lock = new ReentrantLock();

    public static void main(String[] args) {
        Condition condition = lock.newCondition();

        new Thread(() -> {
            lock.lock();
            try {
                System.out.println("线程一加锁成功");
                System.out.println("线程一执行await被挂起");
                condition.await();
                System.out.println("线程一被唤醒成功");
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                lock.unlock();
                System.out.println("线程一释放锁成功");
            }
        }).start();

        new Thread(() -> {
            lock.lock();
            try {
                System.out.println("线程二加锁成功");
                condition.signal();
                System.out.println("线程二唤醒线程一");
            } finally {
                lock.unlock();
                System.out.println("线程二释放锁成功");
            }
        }).start();
    }
}
```

执行结果如下图：

![img](java多线程.assets/640-1589695594005.png)

这里**线程一**先获取锁，然后使用`await()`方法挂起当前线程并**释放锁**，**线程二**获取锁后使用`signal`唤醒**线程一**。

##### Condition实现原理图解

我们还是用上面的`demo`作为实例，执行的流程如下：

![img](java多线程.assets/640-1589695576696.png)

**线程一**执行`await()`方法：

先看下具体的代码实现，`#java.util.concurrent.locks.AbstractQueuedSynchronizer.ConditionObject.await()`：

```java
 public final void await() throws InterruptedException {
    if (Thread.interrupted())
        throw new InterruptedException();
    Node node = addConditionWaiter();
    int savedState = fullyRelease(node);
    int interruptMode = 0;
    while (!isOnSyncQueue(node)) {
        LockSupport.park(this);
        if ((interruptMode = checkInterruptWhileWaiting(node)) != 0)
            break;
    }
    if (acquireQueued(node, savedState) && interruptMode != THROW_IE)
        interruptMode = REINTERRUPT;
    if (node.nextWaiter != null) // clean up if cancelled
        unlinkCancelledWaiters();
    if (interruptMode != 0)
        reportInterruptAfterWait(interruptMode);
}
```

`await()`方法中首先调用`addConditionWaiter()`将当前线程加入到`Condition`队列中。

执行完后我们可以看下`Condition`队列中的数据：

![img](java多线程.assets/640-1589695611649.png)

具体实现代码为：

```
private Node addConditionWaiter() {
    Node t = lastWaiter;
    if (t != null && t.waitStatus != Node.CONDITION) {
        unlinkCancelledWaiters();
        t = lastWaiter;
    }
    Node node = new Node(Thread.currentThread(), Node.CONDITION);
    if (t == null)
        firstWaiter = node;
    else
        t.nextWaiter = node;
    lastWaiter = node;
    return node;
}
```

这里会用当前线程创建一个`Node`节点，`waitStatus`为`CONDITION`。接着会释放该节点的锁，调用之前解析过的`release()`方法，释放锁后此时会唤醒被挂起的**线程二**，**线程二**会继续尝试获取锁。

接着调用`isOnSyncQueue()`方法判断当前节点是否为`Condition`队列中的头部节点，如果是则调用`LockSupport.park(this)`挂起`Condition`中当前线程。此时**线程一**被挂起，**线程二**获取锁成功。

具体流程如下图：

![img](java多线程.assets/640-1589695625498.png)

**线程二**执行`signal()`方法：

首先我们考虑下**线程二**已经获取到锁，此时`AQS`等待队列中已经没有了数据。

接着就来看看**线程二**唤醒**线程一**的具体执行流程：

```
public final void signal() {
    if (!isHeldExclusively())
        throw new IllegalMonitorStateException();
    Node first = firstWaiter;
    if (first != null)
        doSignal(first);
}
```

先判断当前线程是否为获取锁的线程，如果不是则直接抛出异常。接着调用`doSignal()`方法来唤醒线程。

```java
private void doSignal(Node first) {
    do {
        if ( (firstWaiter = first.nextWaiter) == null)
            lastWaiter = null;
        first.nextWaiter = null;
    } while (!transferForSignal(first) &&
             (first = firstWaiter) != null);
}

final boolean transferForSignal(Node node) {
    if (!compareAndSetWaitStatus(node, Node.CONDITION, 0))
        return false;

    Node p = enq(node);
    int ws = p.waitStatus;
    if (ws > 0 || !compareAndSetWaitStatus(p, ws, Node.SIGNAL))
        LockSupport.unpark(node.thread);
    return true;
}

/**
 * Inserts node into queue, initializing if necessary. See picture above.
 * @param node the node to insert
 * @return node's predecessor
 */
private Node enq(final Node node) {
    for (;;) {
        Node t = tail;
        if (t == null) { // Must initialize
            if (compareAndSetHead(new Node()))
                tail = head;
        } else {
            node.prev = t;
            if (compareAndSetTail(t, node)) {
                t.next = node;
                return t;
            }
        }
    }
}
```

这里先从`transferForSignal()`方法来看，通过上面的分析我们知道`Condition`队列中只有线程一创建的一个`Node`节点，且`waitStatue`为`CONDITION`，先通过`CAS`修改当前节点`waitStatus`为0，然后执行`enq()`方法将当前线程加入到等待队列中，并返回当前线程的前置节点。

加入等待队列的代码在上面也已经分析过，此时等待队列中数据如下图：

![img](java多线程.assets/640-1589694043856.png)

接着开始通过`CAS`修改当前节点的前置节点`waitStatus`为`SIGNAL`，并且唤醒当前线程。此时`AQS`中等待队列数据为：

![img](java多线程.assets/640-1589695660746.png)

**线程一**被唤醒后，继续执行`await()`方法中的 while 循环。

```
public final void await() throws InterruptedException {
    if (Thread.interrupted())
        throw new InterruptedException();
    Node node = addConditionWaiter();
    int savedState = fullyRelease(node);
    int interruptMode = 0;
    while (!isOnSyncQueue(node)) {
        LockSupport.park(this);
        if ((interruptMode = checkInterruptWhileWaiting(node)) != 0)
            break;
    }
    if (acquireQueued(node, savedState) && interruptMode != THROW_IE)
        interruptMode = REINTERRUPT;
    if (node.nextWaiter != null) // clean up if cancelled
        unlinkCancelledWaiters();
    if (interruptMode != 0)
        reportInterruptAfterWait(interruptMode);
}
```

因为此时线程一的`waitStatus`已经被修改为0，所以执行`isOnSyncQueue()`方法会返回`false`。跳出`while`循环。

接着执行`acquireQueued()`方法，这里之前也有讲过，尝试重新获取锁，如果获取锁失败继续会被挂起。直到另外线程释放锁才被唤醒。

```
final boolean acquireQueued(final Node node, int arg) {
    boolean failed = true;
    try {
        boolean interrupted = false;
        for (;;) {
            final Node p = node.predecessor();
            if (p == head && tryAcquire(arg)) {
                setHead(node);
                p.next = null; // help GC
                failed = false;
                return interrupted;
            }
            if (shouldParkAfterFailedAcquire(p, node) &&
                parkAndCheckInterrupt())
                interrupted = true;
        }
    } finally {
        if (failed)
            cancelAcquire(node);
    }
}
```

此时**线程一**的流程都已经分析完了，等**线程二**释放锁后，**线程一**会继续重试获取锁，流程到此终结。

##### Condition总结

我们总结下 Condition 和 wait/notify 的比较：

- Condition 可以精准的对多个不同条件进行控制，wait/notify 只能和 synchronized 关键字一起使用，并且只能唤醒一个或者全部的等待队列；
- Condition 需要使用 Lock 进行控制，使用的时候要注意 lock() 后及时的 unlock()，Condition 有类似于 await 的机制，因此不会产生加锁方式而产生的死锁出现，同时底层实现的是 park/unpark 的机制，因此也不会产生先唤醒再挂起的死锁，一句话就是不会产生死锁，但是 wait/notify 会产生先唤醒再挂起的死锁。

## 线程池

### 一、线程概述

线程池，顾名思义就是存放线程的池子，池子里存放了很多**可以复用的线程**。

如果不用类似线程池的容器，每当我们需要执行用户任务的时候都去创建新的线程，任务执行完之后线程就被回收了，这样频繁地创建和销毁线程会浪费大量的系统资源。

因此，线程池通过线程复用机制，并对线程进行统一管理，具有以下优点：

- 降低系统资源消耗。通过复用已存在的线程，**降低线程创建和销毁造成的消耗；**
- **提高响应速度**。当有任务到达时，无需等待新线程的创建便能立即执行；
- 提高线程的可管理性。线程是稀缺资源，如果无限制的创建，不仅会消耗大量系统资源，还会降低系统的稳定性，使用线程池可以进行**对线程进行统一的分配、调优和监控。**

**ThreadPoolExecutor**是线程池框架的一个核心类，另外， 线程池也提供了许多可调参数和可扩展性接口 ，以满足不同情境的需要，程序 员可以使用**更方便的 Executors 的工厂方法**， 比如 `newCachedThreadPool` （线程池线程个数 最多可达 `Integer.MAX_VALUE`，线程自动回收）、 `newFixedThreadPool` （固定大小的线程池） 和 newSingleThreadExecutor （单个线程）等来创建线程池，当然用户还可以 自定义。

本文通过对ThreadPoolExecutor源码的分析（基于JDK 1.8），来深入分析线程池的实现原理。

### 二、ThreadPoolExecutor类的属性

ThreadPoolExecutor继承了AbstractExecutorService，成员变量ctl是一个Integer的原子变量，用来记录线程池状态和线程池中线程个数。

查看ThreadPoolExecutor类的源码：

```java
// 线程池的控制状态,用高3位来表示线程池的运行状态,低29位来表示线程池中工作线程的数量
    private final AtomicInteger ctl = new AtomicInteger(ctlOf(RUNNING, 0));
    //值为29,用来表示偏移量
    private static final int COUNT_BITS = Integer.SIZE - 3;
    //线程池的最大容量,其值的二进制为:00011111111111111111111111111111（29个1）
    private static final int CAPACITY   = (1 << COUNT_BITS) - 1;  //1的二进制左移29位，低位补0

    // 线程池的运行状态，总共有5个状态，用高3位来表示
    private static final int RUNNING    = -1 << COUNT_BITS;
    private static final int SHUTDOWN   =  0 << COUNT_BITS;
    private static final int STOP       =  1 << COUNT_BITS;
    private static final int TIDYING    =  2 << COUNT_BITS;
    private static final int TERMINATED =  3 << COUNT_BITS;

    //任务缓存队列，用来存放等待执行的任务
    private final BlockingQueue<Runnable> workQueue;

    //全局锁，对线程池状态等属性修改时需要使用这个锁
    private final ReentrantLock mainLock = new ReentrantLock();

    //线程池中工作线程的集合，访问和修改需要持有全局锁
    private final HashSet<Worker> workers = new HashSet<Worker>();

    // 终止条件
    private final Condition termination = mainLock.newCondition();

    //线程池中曾经出现过的最大线程数
    private int largestPoolSize;
    
    //已完成任务的数量
    private long completedTaskCount;

    //线程工厂
    private volatile ThreadFactory threadFactory;

    //任务拒绝策略
    private volatile RejectedExecutionHandler handler;

    //线程存活时间
    private volatile long keepAliveTime;

    //是否允许核心线程超时
    private volatile boolean allowCoreThreadTimeOut;

    //核心池大小，若allowCoreThreadTimeOut被设置，核心线程全部空闲超时被回收的情况下会为0
    private volatile int corePoolSize;

    //最大池大小，不得超过CAPACITY
    private volatile int maximumPoolSize;

    //默认的任务拒绝策略
    private static final RejectedExecutionHandler defaultHandler =
        new AbortPolicy();

    private static final RuntimePermission shutdownPerm =
        new RuntimePermission("modifyThread");

    private final AccessControlContext acc;
```

在ThreadPoolExecutor类的这些属性中，**线程池状态**是控制线程池生命周期至关重要的属性，这里就以线程池状态为出发点进行研究。

通过上面的源码可知，**线程池的运行状态总共有5种**，其值和含义分别如下：

- RUNNING:  高3位为111，接受新任务并处理阻塞队列中的任务
- SHUTDOWN: 高3位为000，不接受新任务但会处理阻塞队列中的任务
- STOP:高3位为001，不会接受新任务，也不会处理阻塞队列中的任务，并且中断正在运行的任务
- TIDYING:  高3位为010，所有任务都已终止，工作线程数量为0，线程池将转化到TIDYING状态，即将要执行terminated()钩子方法
- TERMINATED: 高3位为011，terminated()方法已经执行结束

然而，线程池中使用一个AtomicInteger类型的变量ctl来表示线程池的控制状态，其将线程池运行状态与工作线程的数量打包在一个整型中，用高3位来表示线程池的运行状态,低29位来表示线程池中工作线程的数量，**对ctl的操作主要参考以下几个函数：**

```java
// 通过与的方式，获取ctl的高3位，也就是线程池的运行状态
    private static int runStateOf(int c)     { return c & ~CAPACITY; }   //~ 是位运算符 非
    //通过与的方式，获取ctl的低29位，也就是线程池中工作线程的数量
    private static int workerCountOf(int c)  { return c & CAPACITY; }
    //通过或的方式，将线程池状态和线程池中工作线程的数量打包成ctl
    private static int ctlOf(int rs, int wc) { return rs | wc; }
    //SHUTDOWN状态的值是0，比它大的均是线程池停止或清理状态，比它小的是运行状态
    private static boolean isRunning(int c) {
        return c < SHUTDOWN;
    }
```

接下来，我们看一下**线程池状态的所有转换情况**，如下：

- RUNNING -> SHUTDOWN：调用shutdown()，可能在finalize()中隐式调用
- (RUNNING or SHUTDOWN) -> STOP：调用shutdownNow()
- SHUTDOWN -> TIDYING：当缓存队列和线程池都为空时
- STOP -> TIDYING：当线程池为空时
- TIDYING -> TERMINATED：当terminated()方法执行结束时

通常情况下，线程池有如下两种状态转换流程：

1. RUNNING -> SHUTDOWN -> TIDYING -> TERMINATED
2. RUNNING -> STOP -> TIDYING -> TERMINATED

### 三、ThreadPoolExecutor类的构造方法

通常情况下，我们使用线程池的方式就是new一个ThreadPoolExecutor对象来生成一个线程池。接下来，先看ThreadPoolExecutor类的构造函数：

```java
//间接调用最后一个构造函数，采用默认的任务拒绝策略AbortPolicy和默认的线程工厂
    public ThreadPoolExecutor(int corePoolSize,
                              int maximumPoolSize,
                              long keepAliveTime,
                              TimeUnit unit,
                              BlockingQueue<Runnable> workQueue);
    //间接调用最后一个构造函数，采用默认的任务拒绝策略AbortPolicy
    public ThreadPoolExecutor(int corePoolSize,
                              int maximumPoolSize,
                              long keepAliveTime,
                              TimeUnit unit,
                              BlockingQueue<Runnable> workQueue,
                              ThreadFactory threadFactory);
    //间接调用最后一个构造函数，采用默认的默认的线程工厂
    public ThreadPoolExecutor(int corePoolSize,
                              int maximumPoolSize,
                              long keepAliveTime,
                              TimeUnit unit,
                              BlockingQueue<Runnable> workQueue,
                              RejectedExecutionHandler handler);
    //前面三个分别调用了最后一个，主要的构造函数
    public ThreadPoolExecutor(int corePoolSize,
                              int maximumPoolSize,
                              long keepAliveTime,
                              TimeUnit unit,
                              BlockingQueue<Runnable> workQueue,
                              ThreadFactory threadFactory,
                              RejectedExecutionHandler handler);
```

接下来，看下最后一个构造函数的具体实现：

```java
public ThreadPoolExecutor(int corePoolSize,
                              int maximumPoolSize,
                              long keepAliveTime,
                              TimeUnit unit,
                              BlockingQueue<Runnable> workQueue,
                              ThreadFactory threadFactory,
                              RejectedExecutionHandler handler) {
        //参数合法性校验
        if (corePoolSize < 0 ||
            maximumPoolSize <= 0 ||
            maximumPoolSize < corePoolSize ||
            keepAliveTime < 0)
            throw new IllegalArgumentException();
        //参数合法性校验
        if (workQueue == null || threadFactory == null || handler == null)
            throw new NullPointerException();
        this.acc = System.getSecurityManager() == null ?
                null :
                AccessController.getContext();
        //初始化对应的属性
        this.corePoolSize = corePoolSize;
        this.maximumPoolSize = maximumPoolSize;
        this.workQueue = workQueue;
        this.keepAliveTime = unit.toNanos(keepAliveTime);
        this.threadFactory = threadFactory;
        this.handler = handler;
    }
```

下面解释下一下构造器中各个参数的含义：

**1.corePoolSize**

线程池中的==核心线程数==。当提交一个任务时，线程池创建一个新线程执行任务，直到当前线程数等于corePoolSize；如果当前线程数为corePoolSize，继续提交的任务被保存到阻塞队列中，等待被执行。

**2.maximumPoolSize**

线程池中允许的==最大线程数==。如果当前阻塞队列满了，且继续提交任务，则创建新的线程执行任务，前提是当前线程数小于maximumPoolSize。

**3.keepAliveTime**

==线程空闲时的存活时间==。默认情况下，==只有当线程池中的线程数大于corePoolSize时，keepAliveTime才会起作用==，如果一个线程空闲的时间达到keepAliveTime，则会终止，直到线程池中的线程数不超过corePoolSize。但是如果调用了allowCoreThreadTimeOut(boolean)方法，keepAliveTime参数也会起作用，直到线程池中的线程数为0。

**4.unit**

keepAliveTime参数的==时间单位==。

**5.workQueue**

==任务缓存队列（阻塞队列）==，用来存放等待执行的任务。==如果当前线程数为corePoolSize，继续提交的任务就会被保存到任务缓存队列中，等待被执行。==

一般来说，这里的==BlockingQueue==有以下三种选择：

- SynchronousQueue：==一个不存储元素的阻塞队列，每个插入操作必须等到另一个线程调用移除操作==，否则插入操作一直处于阻塞状态。因此，如果线程池中始终没有空闲线程（任务提交的平均速度快于被处理的速度），可能出现无限制的线程增长。
- LinkedBlockingQueue：基于链表结构的阻塞队列，如果不设置初始化容量，其容量为Integer.MAX_VALUE，即为==无界队列==。因此，如果线程池中线程数达到了corePoolSize，且始终没有空闲线程（任务提交的平均速度快于被处理的速度），==任务缓存队列可能出现无限制的增长。==
- ArrayBlockingQueue：基于数组结构的==有界阻塞队列==，按==FIFO==排序任务。

**6.threadFactory**

线程工厂，创建新线程时使用的==线程工厂==。

**7.handler**

==任务拒绝策略==，当阻塞队列满了，且线程池中的线程数达到maximumPoolSize，如果继续提交任务，就会采取任务拒绝策略处理该任务，线程池提供了4种任务拒绝策略：

- AbortPolicy：丢弃任务并抛出RejectedExecutionException异常，默认策略；

- CallerRunsPolicy：由调用execute方法的线程执行该任务；

- DiscardPolicy：丢弃任务，但是不抛出异常;

- DiscardOldestPolicy：丢弃阻塞队列最前面的任务，然后重新尝试执行任务（重复此过程）。

  当然也可以根据应用场景实现RejectedExecutionHandler接口，自定义饱和策略，如记录日志或持久化存储不能处理的任务。

### 四、线程池的实现原理

###### 1.提交任务

线程池框架提供了两种方式提交任务，**submit()**和**execute()**，通过submit()方法提交的任务**可以返回任务执行的结果**，通过execute()方法提交的任务**不能获取任务执行的结果。**

submit()方法的实现有以下三种：

```java
public Future<?> submit(Runnable task);
    public <T> Future<T> submit(Runnable task, T result);
    public <T> Future<T> submit(Callable<T> task);
```

下面以第一个方法为例简单看一下submit()方法的实现：

```java
public Future<?> submit(Runnable task) {
        if (task == null) throw new NullPointerException();
        RunnableFuture<Void> ftask = newTaskFor(task, null);
        execute(ftask);
        return ftask;
    }
```

submit()方法是在ThreadPoolExecutor的父类AbstractExecutorService类实现的，**最终还是调用的ThreadPoolExecutor类的execute()方法**，下面**着重看一下execute()方法的实现。**

```java
public void execute(Runnable command) {
        if (command == null)
            throw new NullPointerException();
        //获取线程池控制状态+线程个数变量的组合值
        int c = ctl.get();
        // (1)
        //当前线程池的线程（worker）数量是否小于corePoolSize 小于则开启新线程运行
        if (workerCountOf(c) < corePoolSize) {
            //创建worker,addWorker方法boolean参数用来判断是否创建核心线程
            if (addWorker(command, true))
                //成功则返回
                return;
            //失败则再次获取线程池控制状态
            c = ctl.get();
        }
        //(2)
       //线程池处于RUNNING状态，将任务加入workQueue任务缓存队列（阻塞队列）
        if (isRunning(c) && workQueue.offer(command)) {
            // 再次检查，获取线程池控制状态，防止在任务入队的过程中线程池关闭了或者线程池中没有线程了
            int recheck = ctl.get();
            //线程池不处于RUNNING状态，且将任务从workQueue移除成功，并执行拒绝策略
            if (! isRunning(recheck) && remove(command))
                //采取任务拒绝策略
                reject(command);
            //worker数量等于0，即线程池为空，则添加一个线程
            else if (workerCountOf(recheck) == 0)
                //创建worker
                addWorker(null, false);
        }
        //(3)  如果队列满了，则新增线程，若新增失败则执行拒绝策略
        else if (!addWorker(command, false))  //创建worker
            reject(command);  //如果创建worker失败，采取任务拒绝策略
    }
```

execute()方法的执行流程可以总结如下：

- 若线程池工作线程数量小于corePoolSize,则创建新线程来执行任务
- 若工作线程数量大于或等于corePoolSize,则将任务加入BlockingQueue
- 若无法将任务加入BlockingQueue(BlockingQueue已满),且工作线程数量小于maximumPoolSize,则创建新的线程来执行任务
- 若工作线程数量达到maximumPoolSize,则创建线程失败,采取任务拒绝策略

可以结合下面的两张图来理解线程池提交任务的执行流程。(ThreadPoolExecutor的execute()方法的执行示意图)

![img](java多线程.assets/640-1589699109285.jpg)

###### 2.创建线程

从execute()方法的实现可以看出，**addWorker()**方法主要**负责创建新的线程**并执行任务，代码实现如下：  

```java
//addWorker有两个参数:Runnable类型的firstTask,用于指定新增的线程执行的第一个任务;boolean类型的core,表示是否创建核心线程
//该方法的返回值代表是否成功新增一个线程
 private boolean addWorker(Runnable firstTask, boolean core) {
        retry:
        for (;;) {
            int c = ctl.get();
            int rs = runStateOf(c);

            // (1)
            if (rs >= SHUTDOWN &&
                ! (rs == SHUTDOWN &&
                   firstTask == null &&
                   ! workQueue.isEmpty()))
                return false;

            for (;;) {
                int wc = workerCountOf(c);
                //线程数超标，不能再创建线程，直接返回
                if (wc >= CAPACITY ||
                    wc >= (core ? corePoolSize : maximumPoolSize))
                    return false;
                //CAS操作递增workCount
                //如果成功，那么创建线程前的所有条件校验都满足了，准备创建线程执行任务，退出retry循环
                //如果失败，说明有其他线程也在尝试往线程池中创建线程(往线程池提交任务可以是并发的)，则继续往下执行
                if (compareAndIncrementWorkerCount(c))
                    break retry;
                //重新获取线程池控制状态
                c = ctl.get();
                // 如果线程池的状态发生了变更,如有其他线程关闭了这个线程池,那么需要回到外层的for循环
                if (runStateOf(c) != rs)
                    continue retry;
                //如果只是CAS操作失败的话，进入内层的for循环就可以了
            }
        }

        //到这里，创建线程前的所有条件校验都满足了，可以开始创建线程来执行任务
        //worker是否已经启动
        boolean workerStarted = false;
        //是否已将这个worker添加到workers这个HashSet中
        boolean workerAdded = false;
        Worker w = null;
        try {
            //创建一个worker，从这里可以看出对线程的包装
            w = new Worker(firstTask);
            //取出worker中的线程对象,Worker的构造方法会调用ThreadFactory来创建一个新的线程
            final Thread t = w.thread;
            if (t != null) {
                //获取全局锁, 并发的访问线程池workers对象必须加锁,持有锁的期间线程池也不会被关闭
                final ReentrantLock mainLock = this.mainLock;
                mainLock.lock();
                try {
                    //重新获取线程池的运行状态
                    int rs = runStateOf(ctl.get());

                    //小于SHUTTDOWN即RUNNING
                    //等于SHUTDOWN并且firstTask为null,不接受新的任务,但是会继续执行等待队列中的任务
                    if (rs < SHUTDOWN ||
                        (rs == SHUTDOWN && firstTask == null)) {
                        //worker里面的thread不能是已启动的
                        if (t.isAlive())
                            throw new IllegalThreadStateException();
                       //将新创建的线程加入到线程池中
                        workers.add(w);
                        int s = workers.size();
                        // 更新largestPoolSize
                        if (s > largestPoolSize)
                            largestPoolSize = s;
                        workerAdded = true;
                    }
                } finally {
                    mainLock.unlock();
                }
                //线程添加线程池成功，则启动新创建的线程
                if (workerAdded) {
                    t.start();
                    workerStarted = true;
                }
            }
        } finally {
            //若线程启动失败,做一些清理工作,例如从workers中移除新添加的worker并递减wokerCount
            if (! workerStarted)
                addWorkerFailed(w);
        }
        //返回线程是否启动成功
        return workerStarted;
    }
```

因为代码(1)处的逻辑不利于理解，我们通过(1)的等价实现来理解: 

```java
if (rs>=SHUTDOWN && !(rs == SHUTDOWN && firstTask == null && ! workQueue.isEmpty()))
//等价实现
rs>=SHUTDOWN && (rs != SHUTDOWN || firstTask != null || workQueue.isEmpty())
```

其含义为,满足下列条件之一则直接返回false，线程创建失败:

- rs > SHUTDOWN,也就是STOP,TIDYING或TERMINATED，此时不再接受新的任务，且中断正在执行的任务
- rs = SHUTDOWN且firstTask != null，此时不再接受任务，但是仍会处理任务缓存队列中的任务
- rs = SHUTDOWN，队列为空

多说一句，若线程池处于 SHUTDOWN， firstTask 为 null，且 workQueue 非空，那么还得创建线程继续处理任务缓存队列中的任务。

总结一下，**addWorker()方法完成了如下几件任务：**

1. 原子性的增加workerCount
2. 将用户给定的任务封装成为一个worker，并将此worker添加进workers集合中
3. 启动worker对应的线程
4. 若线程启动失败，回滚worker的创建动作，即从workers中移除新添加的worker，并原子性的减少workerCount

###### 3.工作线程的实现

从addWorker()方法的实现可以看出，**工作线程的创建和启动都跟ThreadPoolExecutor中的内部类Worker有关**。下面我们分析Worker类来看一下工作线程的实现。

**Worker类继承自AQS类**，具有锁的功能；**实现了Runable接口**，可以将自身作为一个任务在线程中执行。

```java
private final class Worker
        extends AbstractQueuedSynchronizer
        implements Runnable
```

Worker的主要字段就下面三个，代码也比较简单。

```java
//用来封装worker的线程，线程池中真正运行的线程,通过线程工厂创建而来
        final Thread thread;
        //worker所对应的第一个任务，可能为空
        Runnable firstTask;
        //记录当前线程完成的任务数
        volatile long completedTasks;
```

Worker的构造函数如下。

```java
Worker(Runnable firstTask) {
            //设置AQS的state为-1，在执行runWorker()方法之前阻止线程中断
            setState(-1);
            //初始化第一个任务
            this.firstTask = firstTask;
            //利用指定的线程工厂创建一个线程，注意，参数是Worker实例本身this
            //也就是当执行start方法启动线程thread时，真正执行的是Worker类的run方法
            this.thread = getThreadFactory().newThread(this);
        }
```

Worker类继承了AQS类，重写了其相应的方法，**实现了一个自定义的同步器，实现了不可重入锁。**

```java
//是否持有独占锁
        protected boolean isHeldExclusively() {
            return getState() != 0;
        }
        //尝试获取锁
        protected boolean tryAcquire(int unused) {
            if (compareAndSetState(0, 1)) {
                //设置独占线程
                setExclusiveOwnerThread(Thread.currentThread());
                return true;
            }
            return false;
        }
        //尝试释放锁
        protected boolean tryRelease(int unused) {
            //设置独占线程为null
            setExclusiveOwnerThread(null);
            setState(0);
            return true;
        }
        //获取锁
        public void lock()        { acquire(1); }
        //尝试获取锁
        public boolean tryLock()  { return tryAcquire(1); }
        //释放锁
        public void unlock()      { release(1); }
        //是否持有锁
        public boolean isLocked() { return isHeldExclusively(); }
```

Worker类还提供了一个中断线程thread的方法。

```java
void interruptIfStarted() {
            Thread t;
            //AQS状态大于等于0，worker对应的线程不为null，且该线程没有被中断
            if (getState() >= 0 && (t = thread) != null && !t.isInterrupted()) {
                try {
                    t.interrupt();
                } catch (SecurityException ignore) {
                }
            }
        }
```

再来看一下Worker类的run()方法的实现，会发现**run()**方法最终调用了ThreadPoolExecutor类的**runWorker()**方法。

```java
public void run() {
            runWorker(this);
        }
```

###### 4.线程复用机制

通过上文可以知道，worker中的线程start 后，执行的是worker的run()方法，而run()方法最终会调用ThreadPoolExecutor类的runWorker()方法，**runWorker()方法实现了线程池中的线程复用机制。**下面我们来看一下runWorker()方法的实现。

```java
final void runWorker(Worker w) {
        //获取当前线程
        Thread wt = Thread.currentThread();
        //获取w的firstTask
        Runnable task = w.firstTask;
        //设置w的firstTask为null
        w.firstTask = null;
        // 释放锁，设置AQS的state为0，允许中断
        w.unlock();
        //用于标识线程是否异常终止，finally中processWorkerExit()方法会有不同逻辑
        boolean completedAbruptly = true;
        try {
            //循环调用getTask()获取任务,不断从任务缓存队列获取任务并执行
            while (task != null || (task = getTask()) != null) {
                //进入循环内部，代表已经获取到可执行的任务，则对worker对象加锁，保证线程在执行任务过程中不会被中断
                w.lock();
                if ((runStateAtLeast(ctl.get(), STOP) ||  //若线程池状态大于等于STOP，那么意味着该线程要中断
                     (Thread.interrupted() &&      //线程被中断
                      runStateAtLeast(ctl.get(), STOP))) &&  //且是因为线程池内部状态变化而被中断
                    !wt.isInterrupted())           //确保该线程未被中断
                    //发出中断请求
                    wt.interrupt();
                try {
                    //开始执行任务前的Hook方法
                    beforeExecute(wt, task);
                    Throwable thrown = null;
                    try {
                        //到这里正式开始执行任务
                        task.run();
                    } catch (RuntimeException x) {
                        thrown = x; throw x;
                    } catch (Error x) {
                        thrown = x; throw x;
                    } catch (Throwable x) {
                        thrown = x; throw new Error(x);
                    } finally {
                        //执行任务后的Hook方法
                        afterExecute(task, thrown);
                    }
                } finally {
                    //置空task，准备通过getTask()获取下一个任务
                    task = null;
                    //completedTasks递增
                    w.completedTasks++;
                    //释放掉worker持有的独占锁
                    w.unlock();
                }
            }
            completedAbruptly = false;
        } finally {
            //到这里，线程执行结束，需要执行结束线程的一些清理工作
            //线程执行结束可能有两种情况：
            //1.getTask()返回null，也就是说，这个worker的使命结束了，线程执行结束
            //2.任务执行过程中发生了异常
            //第一种情况，getTask()返回null，那么getTask()中会将workerCount递减
            //第二种情况，workerCount没有进行处理，这个递减操作会在processWorkerExit()中处理
            processWorkerExit(w, completedAbruptly);
        }
    }
```

**runWorker()方法是==线程池的核心==，实现了线程池中的线程复用机制**，来看一下

runWorker()方法都做了哪些工作：

1.运行第一个任务firstTask之后，循环调用getTask()方法获取任务,不断从任务缓存队列获取任务并执行；

2.获取到任务之后就对worker对象加锁，保证线程在执行任务的过程中不会被中断，任务执行完会释放锁；

3.在执行任务的前后，可以根据业务场景重写beforeExecute()和afterExecute()等Hook方法；

4.执行通过getTask()方法获取到的任务

5.线程执行结束后，调用processWorkerExit()方法执行结束线程的一些清理工作

从runWorker()方法的实现可以看出，**runWorker()方法中主要调用了getTask()方法和processWorkerExit()方法，**下面分别看一下这两个方法的实现。

####### getTask()的实现

**getTask()方法用来不断地从任务缓存队列获取任务并交给线程执行**，下面分析一下其实现。

```java
private Runnable getTask() {
        //标识当前线程是否超时未能获取到task对象
        boolean timedOut = false;

        for (;;) {
            //获取线程池的控制状态
            int c = ctl.get();
            //获取线程池的运行状态
            int rs = runStateOf(c);

            //如果线程池状态大于等于STOP，或者处于SHUTDOWN状态，并且阻塞队列为空，线程池工作线程数量递减，方法返回null，回收线程
            if (rs >= SHUTDOWN && (rs >= STOP || workQueue.isEmpty())) {
                decrementWorkerCount();
                return null;
            }
            
            //获取worker数量
            int wc = workerCountOf(c);

            //标识当前线程在空闲时，是否应该超时回收
            // 如果allowCoreThreadTimeOut为ture，或当前线程数大于核心池大小，则需要超时回收
            boolean timed = allowCoreThreadTimeOut || wc > corePoolSize;
            
            //如果worker数量大于maximumPoolSize(有可能调用了 setMaximumPoolSize(),导致worker数量大于maximumPoolSize)
            if ((wc > maximumPoolSize || (timed && timedOut))  //或者获取任务超时
                && (wc > 1 || workQueue.isEmpty())) {  //workerCount大于1或者阻塞队列为空（在阻塞队列不为空时，需要保证至少有一个工作线程）
                if (compareAndDecrementWorkerCount(c))
                    //线程池工作线程数量递减，方法返回null，回收线程
                    return null;
                //线程池工作线程数量递减失败，跳过剩余部分，继续循环
                continue;
            }

            try {
                //如果允许超时回收，则调用阻塞队列的poll()，只在keepAliveTime时间内等待获取任务，一旦超过则返回null
                //否则调用take()，如果队列为空，线程进入阻塞状态，无限时等待任务，直到队列中有可取任务或者响应中断信号退出
                Runnable r = timed ?
                    workQueue.poll(keepAliveTime, TimeUnit.NANOSECONDS) :
                    workQueue.take();
                //若task不为null，则返回成功获取的task对象
                if (r != null)
                    return r;
                // 若返回task为null，表示线程空闲时间超时，则设置timeOut为true
                timedOut = true;
            } catch (InterruptedException retry) {
                //如果此worker发生了中断，采取的方案是重试，没有超时
                //在哪些情况下会发生中断？调用setMaximumPoolSize()，shutDown()，shutDownNow()
                timedOut = false;
            }
        }
    }
```

接下来总结一下**getTask()方法会在哪些情况下返回：**

1.线程池处于RUNNING状态，阻塞队列不为空，返回成功获取的task对象

2.线程池处于SHUTDOWN状态，阻塞队列不为空，返回成功获取的task对象

3.线程池状态大于等于STOP，返回null，回收线程

4.线程池处于SHUTDOWN状态，并且阻塞队列为空，返回null，回收线程

5.worker数量大于maximumPoolSize，返回null，回收线程

6.线程空闲时间超时，返回null，回收线程

####### processWorkerExit()的实现

**processWorkerExit()方法负责执行结束线程的一些清理工作**，下面分析一下其实现。

```java
private void processWorkerExit(Worker w, boolean completedAbruptly) {
        //如果用户任务执行过程中发生了异常，则需要递减workerCount
        if (completedAbruptly)
            decrementWorkerCount();

        final ReentrantLock mainLock = this.mainLock;
        //获取全局锁
        mainLock.lock();
        try {
            //将worker完成任务的数量累加到总的完成任务数中
            completedTaskCount += w.completedTasks;
            //从workers集合中移除该worker
            workers.remove(w);
        } finally {
            //释放锁
            mainLock.unlock();
        }
        //尝试终止线程池
        tryTerminate();
        //获取线程池控制状态
        int c = ctl.get();
        if (runStateLessThan(c, STOP)) {  //线程池运行状态小于STOP
            if (!completedAbruptly) {  //如果用户任务执行过程中发生了异常，则直接调用addWorker()方法创建线程
                //是否允许核心线程超时
                int min = allowCoreThreadTimeOut ? 0 : corePoolSize;
                //允许核心超时并且workQueue阻塞队列不为空，那线程池中至少有一个工作线程
                if (min == 0 && ! workQueue.isEmpty())
                    min = 1;
                //如果工作线程数量workerCount大于等于核心池大小corePoolSize，
                //或者允许核心超时并且workQueue阻塞队列不为空时，线程池中至少有一个工作线程，直接返回
                if (workerCountOf(c) >= min)
                    return;
                //若不满足上述条件，则调用addWorker()方法创建线程
            }
            //创建新的线程取代当前线程
            addWorker(null, false);
        }
    }
```

processWorkerExit()方法中主要调用了tryTerminate()方法，下面看一下tryTerminate()方法的实现。

```java
final void tryTerminate() {
        for (;;) {
            //获取线程池控制状态
            int c = ctl.get();
            if (isRunning(c) ||    //线程池的运行状态为RUNNING
                runStateAtLeast(c, TIDYING) ||    //线程池的运行状态大于等于TIDYING
                (runStateOf(c) == SHUTDOWN && ! workQueue.isEmpty()))  //线程池的运行状态为SHUTDOWN且阻塞队列不为空
                //不能终止，直接返回
                return;

            //只有当线程池的运行状态为STOP，或线程池运行状态为SHUTDOWN且阻塞队列为空时，可以执行到这里
            //如果线程池工作线程的数量不为0
            if (workerCountOf(c) != 0) {
                //仅仅中断一个空闲的worker
                interruptIdleWorkers(ONLY_ONE);
                return;
            }

            //只有当线程池工作线程的数量为0时可以执行到这里
            final ReentrantLock mainLock = this.mainLock;
            //获取全局锁
            mainLock.lock();
            try {
                if (ctl.compareAndSet(c, ctlOf(TIDYING, 0))) {  //CAS操作设置线程池运行状态为TIDYING，工作线程数量为0
                    try {
                        //执行terminated()钩子方法
                        terminated();
                    } finally {
                        //设置线程池运行状态为TERMINATED，工作线程数量为0
                        ctl.set(ctlOf(TERMINATED, 0));
                        //唤醒在termination条件上等待的所有线程
                        termination.signalAll();
                    }
                    return;
                }
            } finally {
                //释放锁
                mainLock.unlock();
            }
            //若CAS操作失败则重试
        }
    }
```

**tryTerminate()方法的作用是尝试终止线程池**，它会在所有可能终止线程池的地方被调用，**满足终止线程池的条件有两个：首先，线程池状态为STOP,或者为SHUTDOWN且任务缓存队列为空；其次，工作线程数量为0。**

满足了上述两个条件之后，tryTerminate()方法获取全局锁，设置线程池运行状态为TIDYING，之后执行terminated()钩子方法，最后设置线程池状态为TERMINATED。

至此，线程池运行状态变为TERMINATED，工作线程数量为0，workers已清空，且workQueue也已清空，所有线程都执行结束，线程池的生命周期到此结束。

###### 5.关闭线程池

**关闭线程池有两个方法，shutdown()和shutdownNow()**，下面分别看一下这两个方法的实现。

####### shutdown()的实现

**shutdown()方法将线程池运行状态设置为SHUTDOWN，此时线程池不会接受新的任务，但会处理阻塞队列中的任务。**

```java
public void shutdown() {
        final ReentrantLock mainLock = this.mainLock;
        //获取全局锁
        mainLock.lock();
        try {
            //检查shutdown权限
            checkShutdownAccess();
            //设置线程池运行状态为SHUTDOWN
            advanceRunState(SHUTDOWN);
            //中断所有空闲worker
            interruptIdleWorkers();
            //用onShutdown()钩子方法
            onShutdown();
        } finally {
            //释放锁
            mainLock.unlock();
        }
        //尝试终止线程池
        tryTerminate();
    }
```

shutdown()方法首先会检查是否具有shutdown的权限，然后设置线程池的运行状态为SHUTDOWN，之后中断所有空闲的worker，再调用onShutdown()钩子方法，最后尝试终止线程池。

**shutdown()方法调用了interruptIdleWorkers()方法中断所有空闲的worker**，其实现如下。

```java
private void interruptIdleWorkers() {
        interruptIdleWorkers(false);
    }

    //onlyOne标识是否只中断一个线程
    private void interruptIdleWorkers(boolean onlyOne) {
        final ReentrantLock mainLock = this.mainLock;
        //获取全局锁
        mainLock.lock();
        try {
            //遍历workers集合
            for (Worker w : workers) {
                //worker对应的线程
                Thread t = w.thread;
                //线程未被中断且成功获得锁
                if (!t.isInterrupted() && w.tryLock()) {
                    try {
                        //发出中断请求
                        t.interrupt();
                    } catch (SecurityException ignore) {
                    } finally {
                        //释放锁
                        w.unlock();
                    }
                }
                //若只中断一个线程，则跳出循环
                if (onlyOne)
                    break;
            }
        } finally {
            //释放锁
            mainLock.unlock();
        }
    }
```

####### shutdownNow()的实现

shutdownNow()方法将线程池运行状态设置为STOP，此时线程池不会接受新任务，也不会处理阻塞队列中的任务，并且中断正在运行的任务。

```java
public List<Runnable> shutdownNow() {
        List<Runnable> tasks;
        final ReentrantLock mainLock = this.mainLock;
        //获取全局锁
        mainLock.lock();
        try {
            //检查shutdown权限
            checkShutdownAccess();
            //设置线程池运行状态为STOP
            advanceRunState(STOP);
            //中断所有worker
            interruptWorkers();
            //将任务缓存队列中等待执行的任务取出并放到list中
            tasks = drainQueue();
        } finally {
            //释放锁
            mainLock.unlock();
        }
        //尝试终止线程池
        tryTerminate();
        //返回任务缓存队列中等待执行的任务列表
        return tasks;
    }
```

shutdownNow()方法与shutdown()方法相似，不同之处在于，**前者设置线程池的运行状态为STOP，之后中断所有的worker(并非只是空闲的worker)**，尝试终止线程池之后，返回任务缓存队列中等待执行的任务列表。

shutdownNow()方法调用了interruptWorkers()方法中断所有的worker(**并非只是空闲的worker**)，其实现如下。

```java
private void interruptWorkers() {
        final ReentrantLock mainLock = this.mainLock;
        //获取全局锁
        mainLock.lock();
        try {
            //遍历workers集合
            for (Worker w : workers)
                //调用Worker类的interruptIfStarted()方法中断线程
                w.interruptIfStarted();
        } finally {
            //释放锁
            mainLock.unlock();
        }
    }
```

### 五、总结

至此，我们已经阅读了线程池框架的核心类ThreadPoolExecutor类的大部分源码，由衷地赞叹这个类很多地方设计的巧妙之处：

- 将线程池的运行状态和工作线程数量打包在一起，并使用了大量的位运算
- 使用CAS操作更新线程控制状态ctl，确保对ctl的更新是原子操作
- 内部类Worker类继承了AQS，实现了一个自定义的同步器，实现了不可重入锁
- 使用while循环自旋地从任务缓存队列中获取任务并执行，实现了线程复用机制
- 调用interrupt()方法中断线程，但注意该方法并不能直接中断线程的运行，只是发出了中断信号，配合BlockingQueue的take()，poll()方法的使用，打断线程的阻塞状态

其实，**线程池的本质就是生产者消费者模式，线程池的调用者不断向线程池提交任务，线程池里面的工作线程不断获取这些任务并执行(从任务缓存队列获取任务或者直接执行任务)。**