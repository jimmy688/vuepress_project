推荐学习网址

众多知识点学习网址:https://www.tutorialspoint.com/tutorialslibrary.htm

数据结构与算法可视化:https://www.cs.usfca.edu/~galles/visualization/Algorithms.html

红黑树学习视频：https://www.bilibili.com/video/av75383751?p=4

## 时间复杂度

学习网站链接：https://blog.csdn.net/qq_41523096/article/details/82142747

由于运行环境和输入规模的影响，对于一个程序，绝对的执行时间是无法估计的，但是我们可以预估出代码的基本操作执行次数。

#### 时间复杂度的意义

由此可见，衡量代码的好坏，包括两个非常重要的指标：

1.运行时间；

2.占用空间。

但是，代码还没有运行，怎么预知代码运行所花的时间呢？

由于运行环境和输入规模的影响，对于一个程序，绝对的执行时间是无法估计的，但是我们**可以预估出代码的基本操作执行次数。**

#### 基本操作执行次数

关于代码的基本操作执行次数T(n)，我们用四个程序，来做一下比喻：

**场景1：**T（n） = 3n，**执行次数是线性的。**

```java
void eat1(int n){
    for(int i=0; i<n; i++){;
        System.out.println("等待一天");
        System.out.println("等待一天");
        System.out.println("吃一寸面包");
    }
}
vo
```

**场景2：**T（n） = 5logn，**执行次数是对数的。**

```java
void eat2(int n){
   for(int i=1; i<n; i*=2){
       System.out.println("等待一天");
       System.out.println("等待一天");
       System.out.println("等待一天");
       System.out.println("等待一天");
       System.out.println("吃一半面包");
   }
}
```

**场景3：**T（n） = 2，**执行次数是常量的。**

```java
void eat3(int n){
   System.out.println("等待一天");
   System.out.println("吃一个鸡腿");
}
```

**场景4：**T（n） = 0.5n^2 + 0.5n，**执行次数是一个多项式。**

```java
void eat4(int n){
   for(int i=0; i<n; i++){
       for(int j=0; j<i; j++){
           System.out.println("等待一天");
       }
       System.out.println("吃一寸面包");
   }
}
```

#### 渐进时间复杂度

有了基本操作执行次数的函数 T（n），是否就可以分析和比较一段代码的运行时间了呢？还是有一定的困难。

比如算法A的相对时间是T（n）= 100n，算法B的相对时间是T（n）= 5n^2，这两个到底谁的运行时间更长一些？这就要看n的取值了。

所以，这时候有了渐进时间复杂度（asymptotic time complexity）的概念，官方的定义如下：

**若存在函数 f（n），使得当n趋近于无穷大时，T（n）/ f（n）的极限值为不等于零的常数，则称 f（n）是T（n）的同数量级函数。**

**记作 T（n）= O（f（n）），称O（f（n）） 为算法的渐进时间复杂度，简称时间复杂度。**

渐进时间复杂度用大写O来表示，所以也被称为大O表示法。

**直白地讲，时间复杂度就是把时间规模函数T(n)简化为一个数量级，这个数量级可以是n,n^2,n^3等。=

#### 如何推导出时间复杂度呢？

推导时间复杂度有如下几个原则：

1. 如果运行时间是常数量级，用常数1表示；
2. 只保留时间函数中的最高阶项；
3. 如果最高阶项存在，则省去最高阶项前面的系数。

**让我们回头看看刚才的四个场景。**

**场景1：**

T（n） = 3n 

最高阶项为3n，省去系数3，转化的时间复杂度为：

T（n） = O（n）

**场景2：**

T（n） = 5logn 

最高阶项为5logn，省去系数5，转化的时间复杂度为：

T（n） = O（logn）

![image-20210127113051729](java数据结构.assets/image-20210127113051729.png)

**场景3：**

T（n） = 2

只有常数量级，转化的时间复杂度为：

T（n） = O（1）



**场景4：**

T（n） = 0.5n^2 + 0.5n

最高阶项为0.5n^2，省去系数0.5，转化的时间复杂度为：

T（n） = O（n^2）

![image-20210127113129707](java数据结构.assets/image-20210127113129707.png)

这四种时间复杂度究竟谁用时更长，谁节省时间呢？稍微思考一下就可以得出结论：

O（1）< O（logn）< O（n）< O（n^2）

在编程的世界中有着各种各样的算法，除了上述的四个场景，还有许多不同形式的时间复杂度，比如：

O（nlogn）, O（n^3）, O（m*n），O（2^n），O（n！）

今后遨游在代码的海洋里，我们会陆续遇到上述时间复杂度的算法。

#### 时间复杂度的巨大差异

我们来举过一个栗子：

算法A的相对时间规模是T（n）= 100n，时间复杂度是O(n)

算法B的相对时间规模是T（n）= 5n^2，时间复杂度是O(n^2)

算法A运行在小灰家里的老旧电脑上，算法B运行在某台超级计算机上，运行速度是老旧电脑的100倍。

那么，随着输入规模 n 的增长，两种算法谁运行更快呢？

![image-20210127113152895](java数据结构.assets/image-20210127113152895.png)

从表格中可以看出，当n的值很小的时候，算法A的运行用时要远大于算法B；当n的值达到1000左右，算法A和算法B的运行时间已经接近；当n的值越来越大，达到十万、百万时，算法A的优势开始显现，算法B则越来越慢，差距越来越明显。

这就是不同时间复杂度带来的差距。

## 空间复杂度

既然时间复杂度不是用来计算程序具体耗时的，那么我也应该明白，空间复杂度也不是用来计算程序实际占用的空间的。

空间复杂度是对一个算法在运行过程中临时占用存储空间大小的一个量度，同样反映的是一个趋势，我们用 S(n) 来定义。

空间复杂度比较常用的有：O(1)、O(n)、O(n²)，我们下面来看看：

空间复杂度 O(1)

如果算法执行所需要的临时空间不随着某个变量n的大小而变化，即此算法空间复杂度为一个常量，可表示为 O(1)
举例：

```java
int i = 1;
int j = 2;
++i;
j++;
int m = i + j;
```


代码中的 i、j、m 所分配的空间都不随着处理数据量变化，因此它的空间复杂度 S(n) = O(1)

空间复杂度 O(n)

我们先看一个代码：

```java
int[] m = new int[n]
for(i=1; i<=n; ++i)
{
   int j = i;
   j++;
}
```


这段代码中，第一行new了一个数组出来，这个数据占用的大小为n，这段代码的2-6行，虽然有循环，但没有再分配新的空间，因此，这段代码的空间复杂度主要看第一行即可，即 S(n) = O(n)

## 数组

##### 数组定义

数组对应的英文是array，是有限个相同类型的变量所组成的有序集合，数组中的每一个变量被称为元素。数组是最为简单、常用的数据结构。

数组中的每一个元素也有着自己的下标，只 不过这个下标从0开始，一直到数组长度-1。

数组的另一个特点，是在内存中顺序存储，因此可以很好地实现逻辑上的顺序 表。

##### 数组在内存中的顺序存储

内存是由一个个连续的内存单元组成的，每一个内存单元都有自己的地址。在 这些内存单元中，有些被其他数据占用了，有些是空闲的。

**数组中的每一个元素，都存储在小小的内存单元中，并且元素之间紧密排列， 既不能打乱元素的存储顺序，也不能跳过某个存储单元进行存储。**

![image-20200427010918275](java数据结构.assets/image-20200427010918275.png)

在上图中，橙色的格子代表空闲的存储单元，灰色的格子代表已占用的存储单 元，而红色的连续格子代表数组在内存中的位置。不同类型的数组，每个元素所占的字节个数也不同，本图只是一个简单的示意图。

##### 读取元素——时间O(1)

对于数组来说，读取元素是最简单的操作。由于数组在内存中顺序存储，所以只要给出一个数组下标，就可以读取到对应的数组元素。

假设有一个名称为array的数组，我们要读取数组下标为3的元素，就写作 array[3]；读取数组下标为5的元素，就写作array[5]。需要注意的是，输入的下 标必须在数组的长度范围之内，否则会出现数组越界。

**像这种根据下标读取元素的方式叫作随机读取。**

简单的代码示例如下：

```java
int[] array = new int[]{3,1,2,5,4,9,7,2}; 
// 输出数组中下标为3的元素 
System.out.println(array[3]);
```

##### 更新元素——时间O(1)

要把数组中某一个元素的值替换为一个新值，也是非常简单的操作。直接利用数组下标，就可以把新值赋给该元素。

简单的代码示例如下：

```java
int[] array = new int[]{3,1,2,5,4,9,7,2}; 
// 给数组下标为5的元素赋值 
array[5] = 10; 
// 输出数组中下标为5的元素 
System.out.println(array[5]);
```

##### 插入元素——时间O(n)

在介绍插入数组元素的操作之前，我们需要补充一个概念，那就是数组的实际 元素数量有可能小于数组的长度，例如下面的情形。

因此，插入数组元素的操作存在3种情况。

1. 尾部插入
2. 中间插入
3. 超范围插入--->需要扩容

尾部插入，是最简单的情况，直接把插入的元素放在数组尾部的空闲位置即可，等同于更新元素的操作。

中间插入，稍微复杂一些。**由于数组的每一个元素都有其固定下标，所以不得不首先把插入位置及后面的元素向后移动，腾出地方，再把要插入的元素放到对应的数组位置上**。

**中间插入操作的完整实现代码如下：**

```java
package com.jimmy.streaming;

class MyArray {
    public int[] array1;
    public int size;
    public MyArray(int capacity){
        this.array1=new int[capacity];
        this.size=0;
    }
    /**
     *
     * @param element 要插入的元素
     * @param index  插入的位置
     */
    public void insert(int element,int index){
        if(index<0 || index>size){
            throw new IndexOutOfBoundsException("超出数组实际元素范围了");
        }
        //从右向左循环，将元素逐个向右挪1位
        for (int i=size; i>=index; i--){
            array1[i+1]=array1[i];
        }
        array1[index]=element;
        size++;
    }
    public void output(){
        for(int i=0;i<size;i++){
            System.out.println("index:"+i+"--->"+array1[i]);
        }
    }
    public static void main(String[] args) {
        MyArray myarray=new MyArray(10);
        myarray.insert(3,0);
        myarray.insert(7,1);
        myarray.insert(9,2);
        myarray.insert(5,3);
        //往中间插入元素：
        myarray.insert(6,1);
        myarray.output();
    }
}
```

代码中的成员变量size是数组实际元素的数量。如果插入元素在数组尾部，传入的下标参数index等于size；如果插入元素在数组中间或头部，则index小于size。

运行结果如下

```
index:0--->3
index:1--->6
index:2--->7
index:3--->9
index:4--->5
```

> 注意:不将
>
> if(index<0 || index>size){  
>       throw new IndexOutOfBoundsException("超出数组范围了");
>   }
>
> 改成
>
> if(index<0 || index>array1.length-1){  
>       throw new IndexOutOfBoundsException("超出数组范围了");
>   }
>
> 的原因是：想要让元素尽可能地按照index的顺序来插入。比如，在index=0,1,2位置都插入了元素后，再次插入新元素时，插入的可能位置应是index=0,1,2,3，如果不是这些位置，就报错，不要直接跳到index=5等位置插入元素。
>
> 当然，也不是不可以使用index>array1.length-1方式，只是当前程序的需求这样而已。



##### 数组扩容——时间O(n)

可以创建一个新数组，长度是旧数组的2倍，再把旧数组中的元素统统复制过去，这样就实现了数组的扩容。

![image-20200427013933516](java数据结构.assets/image-20200427013933516.png)

**如果想在数组的实际元素达到数组容量上限的情况下，对数组进行扩容，代码实现如下**，实际上只是对中间插入的代码稍微修改一下。

知识点：使用System.arraycopy()复制数组到新的数组

```java
package com.jimmy.streaming;

class MyArray {
    public int[] array1;
    public int size;
    public MyArray(int capacity){
        this.array1=new int[capacity];
        this.size=0;
    }
    /**
     *
     * @param element 要插入的元素
     * @param index  插入的位置
     */
    public void insert(int element,int index){
        if(size>=array1.length-1){
            resize();
        }
        if(index<0 || index>size){
            throw new IndexOutOfBoundsException("超出数组实际元素范围了");
        }
        //从右向左循环，将元素逐个向右挪1位
        for (int i=size; i>=index; i--){
            array1[i+1]=array1[i];
        }
        array1[index]=element;
        size++;
    }
    public void resize(){
        int[] arrayNew=new int[array1.length*2];
        //从旧数组复制到新数组
        System.arraycopy(array1,0,arrayNew,0,array1.length);
        array1=arrayNew;
    }
    public void output(){
        for(int i=0;i<size;i++){
            System.out.println("index:"+i+"--->"+array1[i]);
        }
    }
    public static void main(String[] args) {
        MyArray myarray=new MyArray(10);
        for(int i=0;i<12;i++){
            myarray.insert(30,i);
        }
        System.out.println("数组长度为："+myarray.array1.length);
    }
}
```

运行结果为：

```
数组长度为：20
```



##### 删除元素——时间O(n)

数组的删除操作和插入操作的过程相反，如果删除的元素位于数组中间，其后 的元素都需要向前挪动1位。

删除的操作，只涉及元素的移动，时间复杂度是O(n)

![image-20200427020318368](java数据结构.assets/image-20200427020318368.png)

删除元素的代码如下(整合了插入扩容等操作）：

```java
package com.jimmy.streaming;

class MyArray {
    public int[] array1;
    public int size;
    public MyArray(int capacity){
        this.array1=new int[capacity];
        this.size=0;
    }
    /**
     *
     * @param element 要插入的元素
     * @param index  插入的位置
     */
    public void insert(int element,int index){
        if(size>=array1.length-1){
            resize();
        }
        if(index<0 || index>size){
            throw new IndexOutOfBoundsException("超出数组实际元素范围了");
        }
        //从右向左循环，将元素逐个向右挪1位
        for (int i=size; i>=index; i--){
            array1[i+1]=array1[i];
        }
        array1[index]=element;
        size++;
    }
    public void resize(){
        int[] arrayNew=new int[array1.length*2];
        //从旧数组复制到新数组
        System.arraycopy(array1,0,arrayNew,0,array1.length);
        array1=arrayNew;
    }
    public int delete(int index){
        if(index<0 || index>=size){
            throw new IndexOutOfBoundsException("超出数组实际元素范围了");
        }
        int deleteElement=array1[index];
        for(int i=index;i<size-1;i++){
            array1[i]=array1[i+1];
        }
        size--;
        return deleteElement;
    }
    public void output(){
        for(int i=0;i<size;i++){
            System.out.println("index:"+i+"--->"+array1[i]);
        }
    }
    public static void main(String[] args) {
        MyArray myarray=new MyArray(10);
        myarray.insert(3,0);
        myarray.insert(7,1);
        myarray.insert(9,2);
        myarray.insert(5,3);
        myarray.delete(1);
        myarray.output();
    }
}
```

运行结果为：

```
index:0--->3
index:1--->9
index:2--->5
```

##### 数组的优势与劣势

优势：数组**拥有非常高效的随机访问能力**，只要给出下标，就可以用常量时间找到对应的元素。有一种高效的查找元素的算法叫做二分查找，就是利用了数组的这个优势

劣势：体现在插入和删除元素方面。由于数组元素连续紧密地存储在内存中，插入、删除元素都会导致大量元素被迫移动，影响效率。

**总的来说，数组所适合的是读操作多、写操作少的场景**，下一节我们要讲解的链表则恰恰相反。

## 链表

##### 链表定义

在影视作品中，我们可能都见到过地下工作者的经典话语：“上级的姓名、住址，我知道，下级的姓名、住址，我也知道，但是这些都是 我们党的秘密，不能告诉你们！”

地下党借助这种单线联络的方式，灵活隐秘地传递着各种重要信息。

在计算机科学领域里，有一种数据结构也恰恰具备这样的特征，这种数据结构 就是链表。

**链表（linked list）是一种在物理上非连续、非顺序的数据结构，由若干节点（node）所组成。**

##### 单向链表

单向链表的每一个节点包含两部分，一部分是存放数据的变量data，另一部分是指向下一个节点的指针next。

![image-20200427035811697](java数据结构.assets/image-20200427035811697.png)

```java
private static class Node { 
	int data;
	Node next;
}
```

链表的第1个节点被称为头节点，最后1个节点被称为尾节点，**尾节点的next指针指向空**。

**与数组按照下标来随机寻找元素不同**，对于链表的其中一个节点A，我们只能根据节点A的next指针来找到该节点的下一个节点B，再根据节点B的next指针找到下 一个节点C……

通过链表的一个节点，**如何能快速找到它的前一个节点呢？----》要使用双向链表。**

##### 双向链表

双向链表比单向链表稍微复杂一些，它的每一个节点除了拥有data和next指 针，还拥有指向前置节点的prev指针。

![image-20200427040105078](java数据结构.assets/image-20200427040105078.png)

如果说数组在内存中的存储方式是顺序存储，那么链表在内存中的存储方式则 是随机存储。

什么叫随机存储呢？

上一节我们讲解了数组的内存分配方式，数组在内存中占用了连续完整的存储 空间。而链表则采用了见缝插针的方式，链表的每一个节点分布在内存的不同位 置，依靠next指针关联起来。这样可以灵活有效地利用零散的碎片空间。

让我们看一看下面两张图，对比一下数组和链表在内存中分配方式的不同。

<img src="java数据结构.assets/image-20200427212541081.png" alt="image-20200427212541081" style="zoom:80%;" />



<img src="java数据结构.assets/image-20200427212558019.png" alt="image-20200427212558019" style="zoom:80%;" />

图中的箭头代表链表节点的next指针。

##### 链表查找节点——O(n)

在查找元素时，链表不像数组那样可以通过下标快速进行定位，只能从头节点 开始向后一个一个节点逐一查找。

例如给出一个链表，需要查找从头节点开始的第3个节点。

![image-20200427212722380](java数据结构.assets/image-20200427212722380.png)

第1步，将查找的指针定位到头节点。

![image-20200427212740683](java数据结构.assets/image-20200427212740683.png)

第2步，根据头节点的next指针，定位到第2个节点

![image-20200427212754793](java数据结构.assets/image-20200427212754793.png)

第3步，根据第2个节点的next指针，定位到第3个节点，查找完毕。

![image-20200427212809989](java数据结构.assets/image-20200427212809989.png)

链表查找的最坏时间复杂度是O(n)

##### 链表更新节点——若不考虑查找过程->O(1)

如果不考虑查找节点的过程，链表的更新过程会像数组那样简单，直接把旧数 据替换成新数据即可。

![image-20200427212942940](java数据结构.assets/image-20200427212942940.png)

##### 链表插入节点——若不考虑查找过程->O(1)

与数组类似，链表插入节点时，同样分为3种情况。

1. 尾部插入 
2. 头部插入 
3. 中间插入

尾部插入，是最简单的情况，把最后一个节点的next指针指向新插入的节点即可。

![image-20200427213228744](java数据结构.assets/image-20200427213228744.png)

头部插入，可以分成两个步骤。

第1步，把新节点的next指针指向原先的头节点。

第2步，把新节点变为链表的头节点。

![image-20200427213307183](java数据结构.assets/image-20200427213307183.png)

中间插入，同样分为两个步骤。

第1步，新节点的next指针，指向插入位置的节点。

第2步，插入位置前置节点的next指针，指向新节点。

![image-20200427213344567](java数据结构.assets/image-20200427213344567.png)

只要内存空间允许，能够插入链表的元素是无穷无尽的，不需要像数组那样考 虑扩容的问题。

##### 链表删除节点——若不考虑查找过程->O(1)

链表的删除操作同样分为3种情况。

1. 尾部删除
2. 头部删除 
3. 中间删除

尾部删除，是最简单的情况，把倒数第2个节点的next指针指向空即可。

![image-20200427213429297](java数据结构.assets/image-20200427213429297.png)

头部删除，也很简单，把链表的头节点设为原先头节点的next指针即可。

![image-20200427213501772](java数据结构.assets/image-20200427213501772.png)

中间删除，同样很简单，把要删除节点的前置节点的next指针，指向要删除元 素的下一个节点即可。

![image-20200427213514641](java数据结构.assets/image-20200427213514641.png)

这里需要注意的是，许多高级语言，如**Java，拥有自动化的垃圾回收机制，所以我们不用刻意去释放被删除的节点，只要没有外部引用指向它们，被删除的节点 会被自动回收。**

**如果不考虑插入、删除操作之前查找元素的过程，只考虑纯粹的插入和删除操作，时间复杂度都是O(1)。**

##### 代码实现单链表

```java
package com.jimmy.streaming;


class Demo1{
    // 头节点指针
    private Node head;
    // 尾节点指针
    private Node last;
    // 链表实际长度
    private int size;

    //定义链表节点
    public static class Node{
        int data;
        Node next=null;
        public Node(int data){
            this.data=data;
        }
    }

    /**
     * 链表查找元素
     * 思路：从头节点一直next到查找的节点
     * @param index  查找的位置
     * @return
     */
    public Node get(int index){
        if(index<0 || index>=size){
            throw new IndexOutOfBoundsException(" 超出链表节点范围！");
        }
        Node temp=head;
        for (int i=0;i<index;i++){
            temp=temp.next;
        }
        return temp;
    }
    /**
     *
     * @param data 插入元素
     * @param index 插入位置
     */
    public void insert(int data,int index){
        if(index<0 || index>size){
            throw new IndexOutOfBoundsException("超出链表节点范围");
        }
        Node insertedNode=new Node(data);
        if(size**0){
            //空链表
            head=insertedNode;
            last=insertedNode;
        }else if(index**0){
            //插入头部：
            insertedNode.next=head;
            head=insertedNode;
        }else if(size**index){
            //插入尾部：
            last.next=insertedNode;
            last=insertedNode;
        }else {
            Node prevNode=get(index-1);
            insertedNode.next=prevNode.next;
            prevNode.next=insertedNode;
        }
        size++;
    }

    public Node remove(int index){
        if(index<0||index>=size){
            throw new IndexOutOfBoundsException(" 超出链表节点范围！");
        }
        Node removedNode=null;
        if(index**0){
            //删除头节点
            removedNode=head;
            head=head.next;
        }else if(index**size-1){
            //删除尾节点
            removedNode=last;
            Node prevNode=get(index-1);
            prevNode.next=null;
            last=prevNode;
        }else {
            //删除中间节点
            Node prevNode=get(index-1);
            removedNode=prevNode.next;
            prevNode.next=prevNode.next.next;
        }
        size--;
        return removedNode;
    }

    //输出链表
    public void output(){
        Node temp=head;
        while (temp!=null){
            System.out.println(temp.data);
            temp=temp.next;
        }
    }

    public static void main(String[] args) {
        Demo1 myLinkedList=new Demo1();
        myLinkedList.insert(3,0);
        myLinkedList.insert(7,1);
        myLinkedList.insert(9,2);
        myLinkedList.insert(5,3);
        myLinkedList.insert(6,1);
        myLinkedList.remove(0);
        myLinkedList.output();
    }
}
```

运行结果为：

```
6
7
9
5
```

## 数组VS链表

数组和链表都属于线性的数据结构，用哪一个更好呢？

数据结构没有绝对的好与坏，数组和链表各有千秋。

![image-20200427225845087](java数据结构.assets/image-20200427225845087.png)

**数组的优势在于能够快速定位元素**，对于读操作多、写操作少的场景来说，用数组更合适一些。

相反地，**链表的优势在于能够灵活地进行插入和删除操作**，如果需要在尾部频繁插入、删除元素，用链表更合适一些。

## 栈

##### 物理结构与逻辑结构

常用的数据结构有很多，但大多数都以数组和链表作为存储方式。

数组和链表可以被看做是数据存储的**“物理结构”**。什么是数据存储的物理结构呢？

如果把数据结构比作活生生的人，那么物理结构就是人的血肉和骨骼，看得见，摸得着，实实在在。例如我们刚刚学过的数组和链表，都是内存中实实在在的 存储结构。

而在物质的人体之上，还存在着人的思想和精神，如果把物质层面的人体比作数据存储的物理结构，那么精神层面的人格则是数据存储的逻辑结构。**逻辑结构是抽象的概念，它依赖于物理结构而存在。**

<img src="java数据结构.assets/image-20200427231409153.png" alt="image-20200427231409153" style="zoom:67%;" />

接下来要讲的栈、队列和二叉树等，都属于逻辑结构，它们的物理实现既可以利用数组，也可以利用链表来完成。

##### 栈的定义

先举一个生活中的例子。

假如有一个又细又长的圆筒，圆筒一端封闭，另一端开口。往圆筒里放入乒乓 球，先放入的靠近圆筒底部，后放入的靠近圆筒入口。

![image-20200427232440095](java数据结构.assets/image-20200427232440095.png)

那么，要想取出这些乒乓球，则只能按照和放入顺序相反的顺序来取，先取出 后放入的，再取出先放入的，而不可能把最里面最先放入的乒乓球优先取出。

![image-20200427232450026](java数据结构.assets/image-20200427232450026.png)

**栈（stack）是一种线性数据结构**，它就像一个上图所示的放入乒乓球的圆筒容器，**栈中的元素只能先入后出（First In Last Out，简称FILO）**。最早进入的元素存放的位置叫作**栈底**（bottom），最后进入的元素存放的位置叫作**栈顶** （top）。

栈这种数据结构既可以用数组来实现，也可以用链表来实现。

栈的数组实现如下。

![image-20200427232528374](java数据结构.assets/image-20200427232528374.png)

栈的链表实现如下。

![image-20200427232536648](java数据结构.assets/image-20200427232536648.png)

##### 入栈——时间O(1)

入栈操作（push）就是把新元素放入栈中，只允许从栈顶一侧放入元素，新元 素的位置将会成为新的栈顶。
这里我们以数组实现为例。

<img src="java数据结构.assets/image-20200427232617431.png" alt="image-20200427232617431" style="zoom:80%;" />



##### 出栈——时间O(1)

出栈操作（pop）就是把元素从栈中弹出，只有栈顶元素才允许出栈，出栈元素 的前一个元素将会成为新的栈顶。这里我们以数组实现为例。

![image-20200427232703652](java数据结构.assets/image-20200427232703652.png)

由于栈操作的代码实现比较简单，这里就不再展示代码了，有兴趣的读者可以自己写写看。

**入栈和出栈只会影响到最后一个元素，不涉及其他元素的整体移动，所以无论是以数组还是以链表实现，入栈、出栈的时间复杂度 都是O(1)。**

## 队列

##### 队列的定义

要弄明白什么是队列，我们同样可以用一个生活中的例子来说明。

假如公路上有一条单行隧道，所有通过隧道的车辆只允许从隧道入口驶入，从 隧道出口驶出，不允许逆行。

![image-20200427232853794](java数据结构.assets/image-20200427232853794.png)

因此，要想让车辆驶出隧道，只能按照它们驶入隧道的顺序，先驶入的车辆先驶出，后驶入的车辆后驶出，任何车辆都无法跳过它前面的车辆提前驶出。

![image-20200427232900797](java数据结构.assets/image-20200427232900797.png)

**队列（queue）是一种线性数据结构**，它的特征和行驶车辆的单行隧道很相似。 **不同于栈的先入后出，队列中的元素只能先入先出（First In First Out，简称 FIFO）**。队列的出口端叫作**队头**（front），队列的入口端叫作**队尾**（rear）。

与栈类似，队列这种数据结构既可以用数组来实现	，也可以用链表来实现。

用数组实现时，为了入队操作的方便，把**队尾位置规定为最后入队元素的下一个位置**。

队列的数组实现如下。

![image-20200427233011542](java数据结构.assets/image-20200427233011542.png)

队列的链表实现如下。

![image-20200427233021527](java数据结构.assets/image-20200427233021527.png)

##### 入队——时间O(1)

入队（enqueue）就是把新元素放入队列中，只允许在队尾的位置放入元素， 新元素的下一个位置将会成为新的队尾。

![image-20200427233118981](java数据结构.assets/image-20200427233118981.png)

##### 出队——时间O(1)

出队操作（dequeue）就是把元素移出队列，只允许在队头一侧移出元素，出 队元素的后一个元素将会成为新的队头。

![image-20200427233141954](java数据结构.assets/image-20200427233141954.png)

##### 循环队列

**如果一个**用数组实现的队列**不断出队，队头左边的空间失去作用，那队列的容量岂不是越来越小了**？例如像下面这样。

![image-20200427233325098](java数据结构.assets/image-20200427233325098.png)

**用数组实现的队列可以采用循环队列的方式来维持队列容量的恒定。**

假设一个队列经过反复的入队和出队操作，还剩下2个元素，在“物理”上分布 于数组的末尾位置。这时又有一个新元素将要入队。

![image-20200427233558502](java数据结构.assets/image-20200427233558502.png)

在数组不做扩容的前提下，如何让新元素入队并确定新的队尾位置呢？我们可以利用已出队元素留下的空间，让队尾指针重新指回数组的首位。

![image-20200427233612172](java数据结构.assets/image-20200427233612172.png)

这样一来，整个队列的元素就“循环”起来了。**在物理存储上，队尾的位置也可以在队头之前**。当再有元素入队时，将其放入数组的首位，队尾指针继续后移即可。

![image-20200427233624247](java数据结构.assets/image-20200427233624247.png)

一直到（队尾下标+1）%数组长度 = 队头下标时，代表此队列真的已经满了。 需要注意的是，**队尾指针指向的位置永远空出1位，所以队列最大容量比数组长度小1**。

![image-20200427233701560](java数据结构.assets/image-20200427233701560.png)

循环队列的代码实现：

```java
package com.jimmy.streaming;

class Myqueue {
    private int front;  //对头index
    private int rear; //队尾index

    private int[] array;
    public Myqueue(int capacity){
        this.array=new int[capacity];
    }

    /**
     * 入队
     * @param element
     * @throws Exception
     */
    public void enQueue(int element) throws Exception {
        if((rear+1)%array.length**front){
            throw new Exception("队列已满");
        }
        array[rear]=element;
        rear=(rear+1)%array.length;
    }

    /**
     * 出队
     * @return
     * @throws Exception
     */
    public int deQueue() throws Exception {
        if(front**rear){
            throw new Exception("队列已空");
        }
        int deQueueElement=array[front];
        front=(front+1)%array.length;
        return deQueueElement;
    }

    public void output(){
        for(int i=front;i!=rear;i=(i+1)%array.length){
            System.out.println(array[i]);
        }
    }

    public static void main(String[] args) throws Exception {
        Myqueue mq=new Myqueue(6);
        mq.enQueue(3);
        mq.enQueue(5);
        mq.enQueue(6);
        mq.enQueue(8);
        mq.enQueue(1);
        
        mq.deQueue();
        mq.deQueue();
        mq.deQueue();
        
        mq.enQueue(2);
        mq.enQueue(4);
        mq.enQueue(9);
        mq.output();
    }
}
```

运行结果为：

```
8
1
2
4
9
```

**循环队列不但充分利用了数组的空间，还避免了数组元素整体移动的麻烦**

## 栈与队列的应用

##### 栈的应用

栈的输出顺序和输入顺序相反，所以**栈通常用于对“历史”的回溯**，也就是逆流而上追溯“历史”。

例如实现递归的逻辑，就可以用栈来代替，因为栈可以回溯方法的调用链。

<img src="java数据结构.assets/image-20200428011132654.png" alt="image-20200428011132654" style="zoom:50%;" />

栈还有一个著名的应用场景是面包屑导航，使用户在浏览页面时可以轻松地回 溯到上一级或更上一级页面。

![image-20200428011122536](java数据结构.assets/image-20200428011122536.png)

##### 队列的应用

队列的输出顺序和输入顺序相同，所以**队列通常用于对“历史”的回放，也就 是按照“历史”顺序，把“历史”重演一遍。**

例如在多线程中，争夺公平锁的等待队列，就是按照访问顺序来决定线程在队 列中的次序的。

再如网络爬虫实现网站抓取时，也是把待抓取的网站URL存入队列中，再按照存 入队列的顺序来依次抓取和解析的。

<img src="java数据结构.assets/image-20200428011148876.png" alt="image-20200428011148876" style="zoom:50%;" />

##### 双端队列

那么，有没有办法把栈和队列的特点结合起来，既可以先入先出，也可以先入后出呢？

还真有，这种数据结构叫作双端队列（deque）。

双端队列这种数据结构，可以说综合了栈和队列的优点，对双端队列来说，**从队头一端可以入队或出队，从队尾一端也可以入队或出队**。有关双端队列的细节，感兴趣的读者可以查阅资料做更多的了解。

##### 优先队列

还有一种队列，它遵循的不是先入先出，而是**谁的优先级最高，谁先出队**。

这种队列叫作优先队列。优先队列已经不属于线性数据结构的范畴了，它是基于二叉堆来实现的。关于 优先队列的原理和使用情况，我们会在下一章进行详细介绍。

## 散列表（哈希表）

##### 散列表的定义

散列表也叫作哈希表（hash table），这种数据结构提供了键（Key）和值 （Value）的映射关系。只要给出一个Key，就**可以高效查找到它所匹配的Value，时间复杂度接近于O(1)**。

散列表可以说是数组和链表的结合，它在算法中的应用很普遍，是一种非常重要的数据结构

<img src="java数据结构.assets/image-20200428011349957.png" alt="image-20200428011349957" style="zoom:50%;" />

##### 哈希函数

**散列表是如何根据Key来快速找到它所匹配的Value呢？**回想一下，之前学过的几个数据结构中，谁的查询效
率最高？

是数组！数组可以根据下标，进行元素的随机访问。

可是数组只能根据下标，像a[0]、a[1]、a[2]、a[3]、a[4]这样来访问，而散列表的Key则是以字符串类型为主的。例如以学生的学号作为Key，输入002123，查询到李四；或者以单词为Key，输入by，查询到数字46……

所以我们需要一个“中转站”，通过某种方式，**把Key和数组下标进行转换**。**这个中转站就叫作哈希函数**。

<img src="java数据结构.assets/image-20200428011647660.png" alt="image-20200428011647660" style="zoom:67%;" />

这个所谓的哈希函数是怎么实现的呢？**在不同的语言中，哈希函数的实现方式是不一样的**。

这里以Java的常用集合 HashMap为例，来看一看**哈希函数在Java中的实现**。

**在Java及大多数面向对象的语言中，每一个对象都有属于自己的hashcode**，这 个hashcode是区分不同对象的重要标识。无论对象自身的类型是什么，它们的**hashcode都是一个整型变量**。

既然都是整型变量，想要转化成数组的下标也就不难实现了。最简单的转化方 式是什么呢？是按照数组长度进行取模运算。

index = HashCode (Key) % Array.length

实际上，JDK（Java Development Kit，Java语言的软件开发工具包）中的

**哈希函数并没有直接采用取模运算，而是利用了位运算的方式来优化性能。**不过在 这里可以姑且简单理解成取模操作。

通过哈希函数，我们可以把字符串或其他类型的Key，转化成数组的下标 index。如给出一个长度为8的数组，则当key=001121时，index = HashCode ("001121") % Array.length = 1420036703 % 8 = 7

而当key=this时，index = HashCode ("this") % Array.length = 3559070 % 8 = 6

##### 写操作&哈希冲突

**写操作就是在散列表中插入新的键值对（**在JDK中叫作Entry**）**。

如调用hashMap.put("002931", "王五")，意思是插入一组Key为002931、 Value为王五的键值对。具体该怎么做呢？

第1步，通过哈希函数，把Key转化成数组下标5。

第2步，如果数组下标5对应的位置没有元素，就把这个Entry填充到数组下标5的位置。

![image-20200428012145975](java数据结构.assets/image-20200428012145975.png)

但是，由于数组的长度是有限的，**当插入的Entry越来越多时，不同的Key通过 哈希函数获得的下标有可能是相同的。**例如002936这个Key对应的数组下标是2； 002947这个Key对应的数组下标也是2。****这种情况，就叫作哈希冲突。****

![image-20200428012156238](java数据结构.assets/image-20200428012156238.png)

**哈希冲突是无法避免的，既然不能避免，我们就要想办法来解决。解决哈希冲突的方法主要有两种，一种是开放寻址法，一种是链表法。**

##### 开放寻址法解决哈希冲突

开放寻址法的原理很简单，当一个Key通过哈希函数获得对应的数组下标已被占用时，我们可以**“另谋高就”，寻找下一个空档位置**。

![image-20200428012457886](java数据结构.assets/image-20200428012457886.png)

以上面的情况为例，Entry6通过哈希函数得到下标2，该下标在数组中已经有了其他元素，那么就向后移动1位，看看数组下标3的位置是否有空。

![image-20200428012510757](java数据结构.assets/image-20200428012510757.png)

很不巧，下标3也已经被占用，那么就再向后移动1位，看看数组下标4的位置是 否有空。

![image-20200428012548151](java数据结构.assets/image-20200428012548151.png)

幸运的是，数组下标4的位置还没有被占用，因此把Entry6存入数组下标4的位置。

![image-20200428012524814](java数据结构.assets/image-20200428012524814.png)

这就是开放寻址法的基本思路。当然，在遇到哈希冲突时，寻址方式有很多种，并不一定只是简单地寻找当前元素的后一个元素，这里只是举一个简单的示例而已。

在**Java中，ThreadLocal所使用的就是开放寻址法**。

##### 链表法解决哈希冲突

这种解决哈希冲突的方法，被应用在了Java的集合类HashMap当中。

**HashMap数组的每一个元素不仅是一个Entry对象，还是一个链表的头节点**。每一个Entry对象通过next指针指向它的下一个Entry节点。当新来的Entry映射到与之冲突的数组位置时，只需要插入到对应的链表中即可。

![image-20200428012753224](java数据结构.assets/image-20200428012753224.png)

##### 读操作

例如调用 hashMap.get("002936")，意思是查找Key为002936的Entry在散列 表中所对应的值。具体该怎么做呢？下面以链表法为例来讲一下。

第1步，通过哈希函数，把Key转化成数组下标2。

第2步，找到数组下标2所对应的元素，如果这个元素的Key是002936，那么就找到了；如果这个Key不是002936也没关系，由于数组的每个元素都与一个链表对应，我们可以顺着链表慢慢往下找，看看能否找到与Key相匹配的节点。

![image-20200428012859632](java数据结构.assets/image-20200428012859632.png)

##### 扩容

****散列表是基于数组实现的**，那么散列表也要涉及扩容的问题。**

首先，什么时候需要进行扩容呢？

**当经过多次元素插入，散列表达到一定饱和度时，Key映射位置发生冲突的概率会逐渐提高。这样一来，大量元素拥挤在相同的数组下标位置，**形成很长的链表**， 对后续插入操作和查询操作的性能都有很大影响。**

<img src="java数据结构.assets/image-20200428013251664.png" alt="image-20200428013251664" style="zoom:67%;" />

这时，散列表就需要扩展它的长度，也就是进行扩容。

对于JDK中的散列表实现类HashMap来说，影响其扩容的因素有两个。Capacity，即HashMap的当前长度 LoadFactor，即HashMap的负载因子，默认值为0.75f

衡量HashMap需要进行扩容的条件如下。

****HashMap.Size >= Capacity×LoadFactor****

扩容不是简单地把散列表的长度扩大，而是经历了下面两个步骤。

1．扩容，创建一个新的Entry空数组，长度是原数组的2倍。

2．重新Hash，遍历原Entry数组，把所有的Entry重新Hash到新数组中。为什 么要重新Hash呢？因为长度扩大以后，Hash的规则也随之改变。经过扩容，原本拥挤的散列表重新变得稀疏，原有的Entry也重新得到了尽可能 均匀的分配。

**扩容前的HashMap。**

![image-20200428013648619](java数据结构.assets/image-20200428013648619.png)

**扩容后的HashMap。**

![image-20200428013657884](java数据结构.assets/image-20200428013657884.png)

以上就是散列表各种基本操作的原理。由于HashMap的实现代码相对比较复杂，这里就不直接列出源码了，有兴趣的读者可以在JDK中直接阅读HashMap类的源码。

需要注意的是，**关于HashMap的实现，JDK8和以前的版本有着很大的不同。当多个Entry被Hash到同一个数组下标位置时，为了提升插入和查找的效率，**HashMap 会把Entry的链表转化为红黑树这种数据结构****

## 树

#### 树的定义

**有许多逻辑关系并不是简单的线性关系**，在实际场景中，常常存在着一对多，甚至是多对多的情况。

其中**树和图就是典型的非线性数据结构**，我们首先讲一讲树的知识。

在数据结构中，树的定义如下。

树（tree）是**n（n≥0）个节点的有限集**。当n=0时，称为空树。在任意一个非空树中，有如下特点。

1. 有且仅有一个特定的称为根的节点。
2. 当n>1时，其余节点可分为m（m>0）个互不相交的有限集，每一个集合本身 又是一个树，并称为根的子树。

下面这张图，就是一个标准的树结构。

<img src="java数据结构.assets/image-20200428014120814.png" alt="image-20200428014120814" style="zoom: 67%;" />

在上图中，节点1是根节点（root）；节点5、6、7、8是树的末端，**没有“孩子”，被称为叶子节点（leaf）**。图中的虚线部分，是根节点1的其中一个子树。

同时，树的结构从根节点到叶子节点，分为不同的层级。从一个节点的角度来看，它的上下级和同级节点关系如下。

<img src="java数据结构.assets/image-20200428014244116.png" alt="image-20200428014244116" style="zoom:67%;" />

在上图中，节点4的上一级节点，是节点4的父节点（parent）；从节点4衍生出 来的节点，是节点4的孩子节点（child）；和节点4同级，由同一个父节点衍生出来的节点，是节点4的兄弟节点（sibling）。

树的最大层级数，被称为树的高度或深度。显然，上图这个树的高度是4。

#### 二叉树

二叉树（binary tree）是树的一种特殊形式。二叉，顾名思义，这种**树的每个节点最多有2个孩子节点。**注意，这里是最多有2个，也可能只有1个，或者没有孩 子节点。

二叉树的结构如图所示。

<img src="java数据结构.assets/image-20200428014400833.png" alt="image-20200428014400833" style="zoom: 50%;" />



二叉树节点的两个孩子节点，一个被称为左孩子（left child），一个被称为右孩 子（right child）。

**这两个孩子节点的顺序是固定的，就像人的左手就是左手，右手就是右手，**不能够颠倒或混淆**。**

#### 满二叉树

满二叉树是二叉树的一种特殊形式。什么是满二叉树呢？

一个二叉树的所有非叶子节点都存在左右孩子，并且所有叶子节点都在同一层 级上，那么这个树就是满二叉树。

<img src="java数据结构.assets/image-20200428014538753.png" alt="image-20200428014538753" style="zoom:50%;" />

简单点说，满二叉树的每一个分支都是满的。

#### 完全二叉树

对一个有n个节点的二叉树，按层级顺序编号，则所有节点的编号为从1到n。如果这个树所有节点和同样深度的满二叉树的编号为从1到n的节点位置相同，则这个二叉树为完全二叉树。

这个定义还真绕，看看下图就很容易理解了。

<img src="java数据结构.assets/image-20200428014711366.png" alt="image-20200428014711366" style="zoom: 50%;" />

**在上图中，二叉树编号从1到12的12个节点，和前面满二叉树编号从1到12的节点位置完全对应。**因此这个树是完全二叉树。

完全二叉树的条件没有满二叉树那么苛刻：满二叉树要求所有分支都是满的； 而完全二叉树只需保证最后一个节点之前的节点都齐全即可。

#### 二叉树在内存中的存储

上一章咱们讲过，数据结构可以划分为物理结构和逻辑结构。**二叉树属于逻辑结构，它可以通过多种物理结构来表达。**

二叉树可以用哪些物理存储结构来表达呢？

1. 链式存储结构。(这里不是说链表)
2. 数组。

****首先来看一看链式存储结构。****

<img src="java数据结构.assets/image-20200428015152648.png" alt="image-20200428015152648" style="zoom:67%;" />

链式存储是二叉树最直观的存储方式。

上一章讲过链表，**链表是一对一的存储方式**，每一个链表节点拥有data变量和一个指向下一节点的next指针。**而二叉树稍微复杂一些，一个节点最多可以指向左右两个孩子节点**，所以二叉树的每一个节点包含3部分。

1. 存储数据的data变量 
2. 指向左孩子的left指针
3. 指向右孩子的right指针

****再来看看用数组是如何存储的。****

<img src="java数据结构.assets/image-20200428015414400.png" alt="image-20200428015414400" style="zoom:50%;" />

**使用数组存储时，会按照层级顺序把二叉树的节点放到数组中对应的位置上**。 如果某一个节点的左孩子或右孩子空缺，则数组的相应位置也空出来。

为什么这样设计呢？因为这样可以更方便地在数组中定位二叉树的孩子节点和父节点。

假设一个父节点的下标是parent，那么它的左孩子节点下标就是2×parent + 1；右孩子节点下标就是2×parent + 2。

反过来，假设一个左孩子节点的下标是leftChild，那么它的父节点下标就是 （leftChild-1）/ 2。

假如节点4在数组中的下标是3，节点4是节点2的左孩子，节点2的下标可以直接通过计算得出：节点2的下标 = (3-1)/2 = 1

显然，**对于一个**稀疏的**二叉树来说，用数组表示法是非常浪费空间的。**

什么样的二叉树最适合用数组表示呢？

我们后面即将学到的二叉堆，一种特殊的完全二叉树，就是用数组来存储的。

#### 二叉树的应用——查找

 二叉树的用处有很多，让我们来具体看一看。二叉树包含许多特殊的形式，每一种形式都有自己的作用，但是其**最主要的应用还在于进行查找操作和维持相对顺序这两个方面。**

这里我们介绍一种特殊的二叉树：二叉查找树（binary search tree）。这种二叉树的主要作用就是进行查找操作。

二叉查找树在二叉树的基础上增加了以下几个条件。

1. 如果左子树不为空，则**左子树上所有节点的值均小于根节点的值** 
2. 如果右子树不为空，则**右子树上所有节点的值均大于根节点的值**
3. 左、右子树也都是二叉查找树

****注意：这里的值说的不是索引值，是真实的值****

下图就是一个标准的二叉查找树。

<img src="java数据结构.assets/image-20200428020631935.png" alt="image-20200428020631935" style="zoom:50%;" />



二叉查找树的这些条件有什么用呢？当然是为了查找方便。**例如查找值为4的节点**，步骤如下。

1. 访问根节点6，发现4<6。
2. 访问节点6的左孩子节点3，发现4>3。
3. 访问节点3的右孩子节点4，发现4=4，这正是要查找的节点。

对于一个节点分布相对均衡的二叉查找树来说，如果节点总数是n，那么**搜索节点的时间复杂度就是O(logn)**，和树的深度是一样的。

这种依靠比较大小来逐步查找的方式，和二分查找算法非常相似。

#### 二叉树的应用——维持相对顺序

这一点仍然要从二叉查找树说起。二叉查找树要求左子树小于父节点，右子树大于父节点，正是这样保证了二叉树的有序性。

因此二叉查找树还有另一个名字——二叉排序树（binary sort tree）。

新插入的节点，同样要遵循二叉排序树的原则。例如插入新元素5，由于5<6， 5>3，5>4，所以5最终会插入到节点4的右孩子位置。

<img src="java数据结构.assets/image-20200428020946458.png" alt="image-20200428020946458" style="zoom:50%;" />

再如插入新元素10，由于10>6，10>8，10>9，所以10最终会插入到节点9的右 孩子位置。

<img src="java数据结构.assets/image-20200428021001897.png" alt="image-20200428021001897" style="zoom:50%;" />

这一切看起来很顺利，然而却隐藏着一个致命的问题。什么问题呢？下面请试 着在二叉查找树中依次插入9、8、7、6、5、4，看看会出现什么结果。

<img src="java数据结构.assets/image-20200428021023777.png" alt="image-20200428021023777" style="zoom:50%;" />

哈哈，好好的一个二叉树，变成“跛脚”啦！不只是外观看起来变得怪异了，**查询节点的时间复杂度
也退化成了O(n)。**

**怎么解决这个问题呢？这就涉及二叉树的自平衡了**。

**二叉树自平衡的方式有多 种，如红黑树、AVL树、树堆等**。由于篇幅有限，本书就不一一详细讲解了，感兴趣 的读者可以查一查相关资料。

**除二叉查找树以外，二叉堆也维持着相对的顺序。不过二叉堆的条件要宽松一 些，只要求父节点比它的左右孩子都大**，这一点在后面的章节中我们会详细讲解

#### 二叉树的遍历介绍

当我们介绍数组、链表时，为什么没有着重研究他们的遍历过程呢？二叉树的遍历又有什么特殊之处？

在计算机程序中，遍历本身是一个线性操作。所以遍历同样具有线性结构的数组或链表，是一件轻而易举的事情。

<img src="java数据结构.assets/image-20200428021753422.png" alt="image-20200428021753422" style="zoom:50%;" />

反观**二叉树，是典型的非线性数据结构，遍历时需要把非线性关联的节点转化成一个线性的序列**，以不同的方式来遍历，遍历出的序列顺序也不同。

那么，二叉树都有哪些遍历方式呢？从节点之间位置关系的角度来看，二叉树的遍历分为4种。

1. 前序遍历。
2. 中序遍历。
3. 后序遍历。
4. 层序遍历。

从更宏观的角度来看，二叉树的遍历归结为两大类。

1. 深度优先遍历（前序遍历、中序遍历、后序遍历）。
2. 广度优先遍历（层序遍历）。

#### 深度优先遍历——前序/中序/后序

深度优先和广度优先这两个概念不止局限于二叉树，它们更是一种抽象的算法 思想，决定了访问某些复杂数据结构的顺序。在访问树、图，或其他一些复杂数据 结构时，这两个概念常常被使用到。
所谓深度优先，顾名思义，就是偏向于纵深，“一头扎到底”的访问方式。可 能这种说法有些抽象，下面就通过二叉树的前序遍历、中序遍历、后序遍历，来看 一看深度优先是怎么回事吧。

###### 前序遍历

二叉树的前序遍历，**输出顺序是根节点、左子树、右子树**。

下图就是一个二叉树的前序遍历，每个节点左侧的序号代表该节点的输出顺序。

<img src="java数据结构.assets/image-20200428022054382.png" alt="image-20200428022054382" style="zoom:50%;" />

详细步骤如下：

1. 首先输出的是根节点1。
2. 由于根节点1存在左孩子，输出左孩子节点2。
3. 由于节点2也存在左孩子，输出左孩子节点4。
4. 节点4既没有左孩子，也没有右孩子，那么回到节点2，输出节点2的右孩子 节点5。
5. 节点5既没有左孩子，也没有右孩子，那么回到节点1，输出节点1的右孩子 节点3。
6. 节点3没有左孩子，但是有右孩子，因此输出节点3的右孩子节点6。到此为止，所有的节点都遍历输出完毕。

**总结为一句话就是，从根节点开始，能往左就往左，不能往左就往右，右也没有就后退。**

###### 中序遍历

二叉树的中序遍历，**输出顺序是左子树、根节点、右子树。**

下图就是一个二叉树的中序遍历，每个节点左侧的序号代表该节点的输出顺序。

<img src="java数据结构.assets/image-20200428022613114.png" alt="image-20200428022613114" style="zoom:50%;" />

详细步骤如下：

1. 首先访问根节点的左孩子，如果这个左孩子还拥有左孩子，则继续深入访问 下去，**一直找到不再有左孩子的节点**，并输出该节点。显然，第一个没有左孩子的节点是节点4。
2. 依照中序遍历的次序，接下来输出节点4的父节点2。
3. 再输出节点2的右孩子节点5。
4. 以节点2为根的左子树已经输出完毕，这时再输出整个二叉树的根节点1。
5. 由于节点3没有左孩子，所以直接输出根节点1的右孩子节点3。
6. 最后输出节点3的右孩子节点6。到此为止，所有的节点都遍历输出完毕。

###### 后序遍历

二叉树的后序遍历，**输出顺序是左子树、右子树、根节点**。

下图就是一个二叉树的后序遍历，每个节点左侧的序号代表该节点的输出顺序。

<img src="java数据结构.assets/image-20200428022745055.png" alt="image-20200428022745055" style="zoom:50%;" />

###### 深度优先遍历的代码实现——使用递归方法

```java
package com.jimmy.streaming;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

class Demo3{
    /**
     * 定义二叉树节点
     */
    public static class TreeNode{
        int data;
        TreeNode leftChild;
        TreeNode rightChild;
        public TreeNode(int data){
            this.data=data;
        }
    }

    /**
     * 利用递归与LinkedList来定义构建二叉树的方法
     * @param inputList
     * @return
     */
    public static TreeNode createBinaryTree(LinkedList<Integer> inputList){
        TreeNode node=null;
        if(inputList**null || inputList.isEmpty()){
            return null;
        }
        Integer data=inputList.removeFirst(); //删除LinkedList中的第一个节点并返回该节点值
        if (data!=null){
            node=new TreeNode(data);
            node.leftChild=createBinaryTree(inputList);
            node.rightChild=createBinaryTree(inputList);
        }
        return node;
    }

    /**
     * 前序遍历
     * @param node
     */
    public static void preOrderTraveral(TreeNode node){
        if(node**null){
            return;
        }
        System.out.println(node.data);
        preOrderTraveral(node.leftChild);
        preOrderTraveral(node.rightChild);
    }

    /**
     * 中序遍历
     * @param node
     */
    public static void inOrderTraveral(TreeNode node){
        if(node**null){
            return;
        }
        inOrderTraveral(node.leftChild);
        System.out.println(node.data);
        inOrderTraveral(node.rightChild);
    }

    /**
     * 后序遍历
     * @param node
     */
    public static void postOrderTraveral(TreeNode node){
        if(node**null){
            return;
        }
        inOrderTraveral(node.leftChild);
        inOrderTraveral(node.rightChild);
        System.out.println(node.data);
    }


    public static void main(String[] args) {
        List al=Arrays.asList(new Integer[]{3,2,9,null,null,10,null,null,8,null,4});
        LinkedList<Integer> inputList=new LinkedList<Integer>(al);
        TreeNode treeNode=createBinaryTree(inputList);

        System.out.println(" 前序遍历： ");
        preOrderTraveral(treeNode);
        System.out.println(" 中序遍历： ");
        inOrderTraveral(treeNode);
        System.out.println(" 后序遍历： ");
        postOrderTraveral(treeNode);
    }
}
```

运行结果为：

```
 前序遍历： 
3
2
9
10
8
4
 中序遍历： 
9
2
10
3
8
4
 后序遍历： 
9
2
10
8
4
3
```

二叉树的构建方法有很多，这里把一个线性的链表转化成非线性的二叉树，链表节点的顺序恰恰是二叉树前序遍历的顺序。链表中的空值，代表二叉树节点的左孩子或右孩子为空的情况。

在代码的main函数中，通过{3,2,9,null,null,10,null,null,8,null,4}这 样一个线性序列，构建成的二叉树如下。

<img src="java数据结构.assets/image-20200428034937918.png" alt="image-20200428034937918" style="zoom:67%;" />



###### 拓展：LinkedList类

**LinkedList是一个双向链表**, 当数据量很大或者操作很频繁的情况下，添加和删除元素时具有比ArrayList更好的性能。但在元素的查询和修改方面要弱于ArrayList。

**LinkedList类每个结点用内部类Node表示，LinkedList通过first和last引用分别指向链表的第一个和最后一个元素**，**当链表为空时，first和last都为NULL值**。LinkedList数据结构如下图所示：

![image-20200428033244211](java数据结构.assets/image-20200428033244211.png)

![image-20200428033255417](java数据结构.assets/image-20200428033255417.png)

查看LinkedList类的内部类Node的源码,Node节点一共有三个属性：item代表节点值，prev代表节点的前一个节点，next代表节点的后一个节点。

```java
private static class Node<E> {
        E item;
        Node<E> next;
        Node<E> prev;

        Node(Node<E> prev, E element, Node<E> next) {
            this.item = element;
            this.next = next;
            this.prev = prev;
        }
    }
```

查看LinkedList类的部分源码,可发现LinkedList中定义了两个变量分别指向链表中的第一个和最后一个结点。

```java
public class LinkedList<E>
    extends AbstractSequentialList<E>
    implements List<E>, Deque<E>, Cloneable, java.io.Serializable
{
    transient int size = 0;

    /**
     * Pointer to first node.
     * Invariant: (first ** null && last ** null) ||
     *            (first.prev ** null && first.item != null)
     */
    transient Node<E> first;

    /**
     * Pointer to last node.
     * Invariant: (first ** null && last ** null) ||
     *            (last.next ** null && last.item != null)
     */
    transient Node<E> last;
```

从LinkedList中删除元素的方法：

```java
●boolean remove(Object o)

从当前链表中移除指定的元素。

● E remove(int index)

从当前链表中移除指定位置的元素。

● E removeFirst()

从当前链表中移除第一个元素。

● E removeLast()

从当前链表中移除最后一个元素。

● E remove()

从当前链表中移除第一个元素，同removeLast()相同。
```

添加元素到LinkedList的方法：

```java
●boolean add(E e)

在链表尾部添加一个元素，如果成功，返回true，否则返回false。

●void addFirst(E e)

在链表头部插入一个元素。

●addLast(E e)

在链表尾部添加一个元素。

●void add(int index, E element)

在指定位置插入一个元素。
```

获取LinkedList元素的方法：

```java
● E get(int index)

从当前链表中获取指定位置的元素。

● E getFirst()

从当前链表中获取第一个元素。

● E getLast()

从当前链表中获取最后一个元素。
```

###### 前序遍历的代码实现——使用栈(非递归)

绝大多数可以用递归解决的问题，其实都可以用另一种数据结构来解决，这种 数据结构就是栈。**因为递归和栈都有回溯的特性。**

如何借助栈来实现二叉树的非递归遍历呢？下面以二叉树的前序遍历为例，看一看具体过程。

1、首先遍历二叉树的根节点1，放入栈中。

<img src="java数据结构.assets/image-20200428041623618.png" alt="image-20200428041623618" style="zoom:50%;" />

2、遍历根节点1的左孩子节点2，放入栈中。

<img src="java数据结构.assets/image-20200428041641974.png" alt="image-20200428041641974" style="zoom:50%;" />

3、遍历节点2的左孩子节点4，放入栈中。

<img src="java数据结构.assets/image-20200428041742440.png" alt="image-20200428041742440" style="zoom:50%;" />

4、节点4既没有左孩子，也没有右孩子，我们需要回溯到上一个节点2。可是现在并不是做递归操作，怎么回溯呢？别担心，栈已经存储了刚才遍历的路径。让旧的栈顶元素4出栈，就可以重新访问节点2，得到节点2的右孩子节点5。

**此时节点2已经没有利用价值**（已经访问过左孩子和右孩子），节点2出栈，节点5入栈。

<img src="java数据结构.assets/image-20200428041835655.png" alt="image-20200428041835655" style="zoom:50%;" />

5、节点5既没有左孩子，也没有右孩子，我们需要再次回溯，一直回溯到节点 1。所以让节点5出栈。
根节点1的右孩子是节点3，节点1出栈，节点3入栈。

<img src="java数据结构.assets/image-20200428042046728.png" alt="image-20200428042046728" style="zoom:50%;" />

6、节点3的右孩子是节点6，节点3出栈，节点6入栈。

<img src="java数据结构.assets\image-20200428042553153.png" alt="image-20200428042553153" style="zoom:50%;" />

7、节点6既没有左孩子，也没有右孩子，所以节点6出栈。此时栈为空，遍历结束。

<img src="java数据结构.assets\image-20200428042615782.png" alt="image-20200428042615782" style="zoom:50%;" />

```java
package com.jimmy.streaming;

import java.util.*;

class Demo3{
    /**
     * 定义二叉树节点
     */
    public static class TreeNode{
        int data;
        TreeNode leftChild;
        TreeNode rightChild;
        public TreeNode(int data){
            this.data=data;
        }
    }

    /**
     * 定义构建二叉树的方法
     * @param inputList
     * @return
     */
    public static TreeNode createBinaryTree(LinkedList<Integer> inputList){
        TreeNode node=null;
        if(inputList**null || inputList.isEmpty()){
            return null;
        }
        Integer data=inputList.removeFirst();
        if (data!=null){
            node=new TreeNode(data);
            node.leftChild=createBinaryTree(inputList);
            node.rightChild=createBinaryTree(inputList);
        }
        return node;
    }

    public static void preOrderTraveral(TreeNode root){
        Stack<TreeNode> stack=new Stack<TreeNode>();
        TreeNode treenode=root;
        while (treenode!=null || !stack.isEmpty()){
            //迭代访问节点的左孩子，并入栈
            while (treenode!=null){
                System.out.println(treenode.data);
                stack.push(treenode);
                treenode=treenode.leftChild;
            }
            if(!stack.isEmpty()){
                treenode=stack.pop(); //出栈
                treenode=treenode.rightChild;
            }
        }
    }


    public static void main(String[] args) {
        List al=Arrays.asList(new Integer[]{3,2,9,null,null,10,null,null,8,null,4});
        LinkedList<Integer> inputList=new LinkedList<Integer>(al);
        TreeNode treeNode=createBinaryTree(inputList);

        System.out.println(" 前序遍历： ");
        preOrderTraveral(treeNode);
    }
}
```

运行结果为：

```
前序遍历： 
3
2
9
10
8
4
```

###### 拓展：Java Stack类

栈Stack是Vector的一个子类，它**实现了一个标准的后进先出的栈**。

堆栈只定义了默认构造函数，用来创建一个空栈。 堆栈除了包括由Vector定义的所有方法，也定义了自己的一些方法。

```
Stack()
```

除了由Vector定义的所有方法，自己也定义了一些方法：

| 序号 | 方法描述                                                     |
| :--- | :----------------------------------------------------------- |
| 1    | boolean empty()  测试堆栈是否为空。                          |
| 2    | Object peek( ) 查看堆栈顶部的对象，但不从堆栈中移除它。      |
| 3    | Object pop( ) 移除堆栈顶部的对象，并作为此函数的值返回该对象。 |
| 4    | Object push(Object element) 把项压入堆栈顶部。               |
| 5    | int search(Object element) 返回对象在堆栈中的位置，以 1 为基数。 |

#### 广度优先遍历——使用到了队列

###### 广度优先遍历介绍

如果说深度优先遍历是在一个方向上“一头扎到底”，那么广度优先遍历则恰恰相反：先在各个方向上各走出1步，再在各个方向上走出第2步、第3步……一直到 各个方向全部走完。听起来有些抽象，下面让我们通过二叉树的层序遍历，来看一 看广度优先是怎么回事。

层序遍历，顾名思义，就是二叉树按照从根节点到叶子节点的层次关系，**一层一层横向遍历各个节点**。

<img src="java数据结构.assets\image-20200428043559478.png" alt="image-20200428043559478" style="zoom:50%;" />

上图就是一个二叉树的层序遍历，每个节点左侧的序号代表该节点的输出顺序。

可是，**二叉树同一层次的节点之间是没有直接关联的，如何实现这种层序遍历呢？**

这里同样需要借助一个数据结构来辅助工作，这个数据结构就是**队列**。

详细遍历步骤如下。

1. 根节点1进入队列。

   <img src="java数据结构.assets\image-20200428043733288.png" alt="image-20200428043733288" style="zoom:50%;" />

2. 节点1出队，输出节点1，并得到节点1的左孩子节点2、右孩子节点3。让节 点2和节点3入队。

   <img src="java数据结构.assets\image-20200428043750667.png" alt="image-20200428043750667" style="zoom:50%;" />

3. 节点2出队，输出节点2，并得到节点2的左孩子节点4、右孩子节点5。让节 点4和节点5入队。

   <img src="java数据结构.assets\image-20200428043803255.png" alt="image-20200428043803255" style="zoom:50%;" />

4. 节点3出队，输出节点3，并得到节点3的右孩子节点6。让节点6入队。

   <img src="java数据结构.assets\image-20200428043814944.png" alt="image-20200428043814944" style="zoom:50%;" />

5. 节点4出队，输出节点4，由于节点4没有孩子节点，所以没有新节点入队。

   <img src="java数据结构.assets\image-20200428043830168.png" alt="image-20200428043830168" style="zoom:50%;" />

6. 节点5出队，输出节点5，由于节点5同样没有孩子节点，所以没有新节点入队。

  <img src="java数据结构.assets\image-20200428043908584.png" alt="image-20200428043908584" style="zoom:50%;" />

7. 节点6出队，输出节点6，节点6没有孩子节点，没有新节点入队。到此为止，所有的节点都遍历输出完毕。

  <img src="java数据结构.assets\image-20200428043926232.png" alt="image-20200428043926232" style="zoom:50%;" />

###### 代码实现

```java
package com.jimmy.streaming;

import java.util.*;

class Demo3{
    /**
     * 定义二叉树节点
     */
    public static class TreeNode{
        int data;
        TreeNode leftChild;
        TreeNode rightChild;
        public TreeNode(int data){
            this.data=data;
        }
    }

    /**
     * 利用递归与LinkedList来定义构建二叉树的方法
     * @param inputList
     * @return
     */
    public static TreeNode createBinaryTree(LinkedList<Integer> inputList){
        TreeNode node=null;
        if(inputList**null || inputList.isEmpty()){
            return null;
        }
        Integer data=inputList.removeFirst();
        if (data!=null){
            node=new TreeNode(data);
            node.leftChild=createBinaryTree(inputList);
            node.rightChild=createBinaryTree(inputList);
        }
        return node;
    }

    /**
     * 二叉树层序遍历
     * @param root 二叉树根节点
     */
    public static void levelOrderTraveral(TreeNode root){
        Queue<TreeNode> queue=new LinkedList<TreeNode>();
        queue.offer(root);
        while (!queue.isEmpty()){
            TreeNode node=queue.poll();
            System.out.println(node.data);
            if(node.leftChild!=null){
                queue.offer(node.leftChild);
            }
            if(node.rightChild!=null){
                queue.offer(node.rightChild);
            }
        }
    }


    public static void main(String[] args) {
        List al=Arrays.asList(new Integer[]{1,2,3,4,5,null,6});
        LinkedList<Integer> inputList=new LinkedList<Integer>(al);
        TreeNode treeNode=createBinaryTree(inputList);

        System.out.println(" 层序遍历： ");
        levelOrderTraveral(treeNode);
    }
}
```

运行结果为：

```
 层序遍历： 
1
2
3
4
5
6
```

###### 拓展：Java Queue类

队列是一种特殊的线性表，它只允许在表的前端进行删除操作，而在表的后端进行插入操作。

LinkedList类实现了Queue接口，因此我们可以把LinkedList当成Queue来用。

```java
Queue<String> queue = new LinkedList<String>();
queue.offer("a"); //添加元素
queue.poll(); //返回第一个元素，并在队列中删除
queue.element(); //返回第一个元素 
queue.peek(); //返回第一个元素 
```



#### 二叉堆——实现优先队列的基础

###### 二叉堆的定义

什么是二叉堆？**二叉堆本质上是一种完全二叉树**，它分为两个类型。

1. 最大堆。
2. 最小堆。

<img src="java数据结构.assets\image-20200428051718667.png" alt="image-20200428051718667" style="zoom:33%;" />

什么是最大堆呢？**最大堆的任何一个父节点的值，都大于或等于它左、右孩子节点的值。**

<img src="java数据结构.assets\image-20200428051743327.png" alt="image-20200428051743327" style="zoom:33%;" />

什么是最小堆呢？**最小堆的任何一个父节点的值，都小于或等于它左、右孩子节点的值。**

二叉堆的根节点叫作**堆顶**。

最大堆和最小堆的特点决定了：最大堆的堆顶是整个堆中的最大元素；最小堆 的堆顶是整个堆中的最小元素。

那么，我们如何构建一个堆呢？这就需要依靠二叉堆的自我调整了。

###### 二叉堆的自我调整

对于二叉堆，有如下几种操作。

1. 插入节点。
2. 删除节点。
3. 构建二叉堆。

这几种操作都基于堆的自我调整。所谓**堆的自我调整，就是把一个不符合堆性质的完全二叉树，调整成一个堆**。下面让我们以最小堆为例，看一看二叉堆是如何 进行自我调整的。

****插入节点****——时间O(logn)

当二叉堆插入节点时，插入位置是完全二叉树的最后一个位置。例如插入一个 新节点，值是 0。

<img src="java数据结构.assets\image-20200428051944608.png" alt="image-20200428051944608" style="zoom: 50%;" />

这时，新节点的父节点5比0大，显然不符合最小堆的性质。于是让新节点“上浮”，和父节点交换位置。

<img src="java数据结构.assets\image-20200428052008714.png" alt="image-20200428052008714" style="zoom: 50%;" />

继续用节点0和父节点3做比较，因为0小于3，则让新节点继续“上浮”。

<img src="java数据结构.assets\image-20200428052058648.png" alt="image-20200428052058648" style="zoom:50%;" />

继续比较，最终新节点0“上浮”到了堆顶位置。

<img src="java数据结构.assets\image-20200428052127322.png" alt="image-20200428052127322" style="zoom:50%;" />

****删除节点****——时间O(logn)

二叉堆删除节点的过程和插入节点的过程正好相反，所删除的是处于堆顶的节点。

例如删除最小堆的堆顶节点1。

<img src="java数据结构.assets\image-20200428052205127.png" alt="image-20200428052205127" style="zoom:50%;" />

这时，为了继续维持完全二叉树的结构，我们把堆的最后一个节点10临时补到 原本堆顶的位置。

<img src="java数据结构.assets\image-20200428052234023.png" alt="image-20200428052234023" style="zoom:50%;" />

接下来，让暂处堆顶位置的节点10和它的左、右孩子进行比较，如果左、右孩子节点中最小的一个（显然是节点2）比节点10小，那么让节点10“下沉”。

<img src="java数据结构.assets\image-20200428052254648.png" alt="image-20200428052254648" style="zoom:50%;" />

继续让节点10和它的左、右孩子做比较，左、右孩子中最小的是节点7，由于10 大于7，让节点10继续“下沉”。

<img src="java数据结构.assets\image-20200428052315127.png" alt="image-20200428052315127" style="zoom:50%;" />

这样一来，二叉堆重新得到了调整。

****构建二叉堆****——时间O(n)

**构建二叉堆，也就是把一个无序的完全二叉树调整为二叉堆，本质就是让所有**非叶子节点**依次“下沉”。**

下面举一个无序完全二叉树的例子，如下图所示。

<img src="java数据结构.assets\image-20200428052409016.png" alt="image-20200428052409016" style="zoom:50%;" />

首先，从最后一个非叶子节点开始，也就是从节点10开始。如果节点10大于它 左、右孩子节点中最小的一个，则节点10“下沉”。

<img src="java数据结构.assets\image-20200428052419168.png" alt="image-20200428052419168" style="zoom:50%;" />

接下来轮到节点3，如果节点3大于它左、右孩子节点中最小的一个，则节点 3“下沉”。

<img src="java数据结构.assets\image-20200428052432864.png" alt="image-20200428052432864" style="zoom:50%;" />

然后轮到节点1，如果节点1大于它左、右孩子节点中最小的一个，则节点1“下沉”。事实上节点1小于它的左、右孩子，所以不用改变。

接下来轮到节点7，如果节点7大于它左、右孩子节点中最小的一个，则节点 7“下沉”。

<img src="java数据结构.assets\image-20200428052511657.png" alt="image-20200428052511657" style="zoom:50%;" />

节点7继续比较，继续“下沉”。

<img src="java数据结构.assets\image-20200428052528888.png" alt="image-20200428052528888" style="zoom:50%;" />

经过上述几轮比较和“下沉”操作，最终每一节点都小于它的左、右孩子节 点，一个无序的完全二叉树就被构建成了一个最小堆。

堆的插入、删除、构建操作的时间复杂度各是多少？

堆的插入操作是单一节点的“上浮”，堆的删除操作是单一节点的“下沉”，这两个操作的平均交换次数都是堆高度的一半，所以时间复杂度是O(logn)。构建堆的时间复杂度并不是O(nlogn)，而是O(n)。

###### 代码实现——最小堆

在展示代码之前，我们还需要明确一点：二叉堆虽然是一个完全二叉树，但它 的存储方式并不是链式存储，而是顺序存储。换句话说，**二叉堆的所有节点都存储在数组中**。

<img src="java数据结构.assets\image-20200428053004306.png" alt="image-20200428053004306" style="zoom:50%;" />

在数组中，在没有左、右指针的情况下，如何定位一个父节点的左孩子和右孩子呢？

像上图那样，可以依靠数组下标来计算。

假设父节点的下标是parent，那么它的左孩子下标就是 2×parent+1；右孩子 下标就是2×parent+2。

例如上面的例子中，节点6包含9和10两个孩子节点，节点6在数组中的下标是 3，节点9在数组中的下标是7，节点10在数组中的下标是8。那么，
	7 = 3×2+1，
	8 = 3×2+2，
	刚好符合规律。

代码：

```java
package com.jimmy.streaming;

import java.util.Arrays;

class HeapDemo{
    public static void upAdjust(int[] array){
        int childIndex=array.length-1;
        int parentIndex=(childIndex-1)/2;
        int temp=array[childIndex];
        while (childIndex >0&&temp< array[parentIndex]){
            //无须真正交换，单向赋值即可
            array[childIndex]=array[parentIndex];
            childIndex=parentIndex;
            parentIndex=(parentIndex-1)/2;
        }
        array[childIndex]=temp;
    }

    /**
     * “下沉”调整
     * @param array  待调整的堆
     * @param parentIndex   要“下沉”的父节点
     * @param length  堆的有效大小
     */
    public static void downAdjust(int[] array,int parentIndex, int length){
        // temp 保存父节点值，用于最后的赋值
        int temp=array[parentIndex];
        int childIndex=2*parentIndex+1;
        while(childIndex<length){
            // 如果有右孩子，且右孩子小于左孩子的值，则定位到右孩子
            if(childIndex+1<length && array[childIndex+1]<array[childIndex]){
                childIndex++;
            }
            // 如果父节点小于任何一个孩子的值，则直接跳出
            if(temp<=array[childIndex]){
                break;
            }
            //无须真正交换，单向赋值即可
            array[parentIndex]=array[childIndex];
            parentIndex=childIndex;
            childIndex=2*parentIndex+1;
        }
        array[parentIndex]=temp;
    }

    /**
     * 构建堆
     * @param array 待调整的堆
     */
    public static void buildHeap(int[] array){
        // 从最后一个非叶子节点开始，依次做“下沉”调整
        for(int i=(array.length-2)/2; i>=0; i--){
            downAdjust(array,i,array.length);
        }
    }

    public static void main(String[] args) {
        int[] array=new int[]{1,3,2,6,5,7,8,9,10,0};
        upAdjust(array);
        System.out.println(Arrays.toString(array));

        array = new int[] {7,1,3,10,5,2,8,9,6};
        buildHeap(array);
        System.out.println(Arrays.toString(array));
    }
}
```

运行结果为：

```
[0, 1, 2, 6, 3, 7, 8, 9, 10, 5]
[1, 5, 2, 6, 7, 3, 8, 9, 10]
```

代码中有一个优化的点，就是**在父节点和孩子节点做连续交换时，并不一定要真的交换，只需要先把交换一方的值存入temp变量，做单向覆盖，循环结束后，再 把temp的值存入交换后的最终位置即可**。

#### 优先队列

###### 优先队列的定义

先来回顾一下队列的知识点：

队列的特点是什么？在之前的章节中已经讲过，队列的特点是先进先出（FIFO）。

入队列，将新元素置于队尾：

<img src="java数据结构.assets\image-20200428161319278.png" alt="image-20200428161319278" style="zoom:50%;" />

出队列，队头元素最先被移出：

<img src="java数据结构.assets\image-20200428161329172.png" alt="image-20200428161329172" style="zoom:50%;" />

那么，优先队列又是什么样子呢？

**优先队列不再遵循先入先出的原则**，而是分为两种情况。

- 最大优先队列，无论入队顺序如何，都是当前**最大的元素优先出队** 
- 最小优先队列，无论入队顺序如何，都是当前**最小的元素优先出队**

例如有一个最大优先队列，其中的最大元素是8，那么虽然8并不是队头元素， 但出队时仍然让元素8首先出队。

<img src="java数据结构.assets\image-20200428161439107.png" alt="image-20200428161439107" style="zoom:50%;" />

**要实现以上需求，利用线性数据结构并非不能实现，但是时间复杂度较高。这时候我们的二叉堆就派上用场了。**

###### 优先队列的实现

先来回顾一下二叉堆的特性。

1. 最大堆的堆顶是整个堆中的最大元素。
2. 最小堆的堆顶是整个堆中的最小元素。

因此，可以用最大堆来实现最大优先队列，这样的话，每一次入队操作就是堆的插入操作，每一次出队操作就是删除堆顶节点。

**入队操作具体步骤如下。**

1、插入新节点5。

<img src="java数据结构.assets\image-20200428161655453.png" alt="image-20200428161655453" style="zoom:50%;" />

2、新节点5“上浮”到合适位置。

<img src="java数据结构.assets\image-20200428161730259.png" alt="image-20200428161730259" style="zoom:50%;" />

**出队操作具体步骤如下。**

1、让原堆顶节点10出队。

<img src="java数据结构.assets\image-20200428161802355.png" alt="image-20200428161802355" style="zoom:50%;" />

2、把最后一个节点1替换到堆顶位置。

<img src="java数据结构.assets\image-20200428161824275.png" alt="image-20200428161824275" style="zoom:50%;" />

节点1“下沉”，节点9成为新堆顶。

<img src="java数据结构.assets\image-20200428161841150.png" alt="image-20200428161841150" style="zoom:50%;" />

小灰，你说说这个优先队列的入队和出队操作，时间复杂度分别是多少？

**二叉堆节点“上浮”和“下沉”的时间复杂度都是O(logn)，所以优先队列入队和出队的时间复杂度也是O(logn)！**

###### 代码实现——最大优先队列

```java
package com.jimmy.streaming;

import java.util.Arrays;

class PriorityQueue{
    private int size; //队列实际元素数量
    private int[]array;
    public PriorityQueue(){
        //队列初始长度为32
        array=new int[32];
    }

    /**
     * 入队
     * @param key 入队元素
     */
    public void enQueue(int key){
        //队列长度超出范围，扩容
        if(size>=array.length){
            resize();
        }
        array[size++]=key; //等价于array[size]=key;size++;
        upAdjust();
    }

    public int deQueue() throws Exception {
        if(size<=0){
            throw new Exception("the queue is empty !");
        }
        //获取堆顶元素
        int head=array[0];
        //让最后一个元素移动到堆顶
        array[0]=array[--size];
        downAdjust();
        return head;
    }
    /**
     * 扩容
     */
    private void resize(){
        //队列容量翻倍
        int newSize=this.size*2;
        this.array=Arrays.copyOf(this.array,newSize);
    }

    /**
     * 上浮调整
     */
    private void upAdjust(){
        int childIndex=size-1;
        int parentIndex=(childIndex-1)/2;
        int temp=array[childIndex];
        while (childIndex >0&&temp> array[parentIndex]){
            //无须真正交换，单向赋值即可
            array[childIndex]=array[parentIndex];
            childIndex=parentIndex;
            parentIndex=(parentIndex-1)/2;
        }
        array[childIndex]=temp;
    }


    /**
     * 下沉调整
     */
    private void downAdjust(){
        int parentIndex=0;
        // temp 保存父节点值，用于最后的赋值
        int temp=array[parentIndex];
        int childIndex=2*parentIndex+1;
        while(childIndex<size){
            // 如果有右孩子，且右孩子小于左孩子的值，则定位到右孩子
            if(childIndex+1<size && array[childIndex+1]>array[childIndex]){
                childIndex++;
            }
            // 如果父节点小于任何一个孩子的值，则直接跳出
            if(temp>=array[childIndex]){
                break;
            }
            //无须真正交换，单向赋值即可
            array[parentIndex]=array[childIndex];
            parentIndex=childIndex;
            childIndex=2*parentIndex+1;
        }
        array[parentIndex]=temp;
    }



    public static void main(String[] args) throws Exception {
        PriorityQueue priorityQueue = new PriorityQueue();
        priorityQueue.enQueue(3);
        priorityQueue.enQueue(5);
        priorityQueue.enQueue(10);
        priorityQueue.enQueue(2);
        priorityQueue.enQueue(7);
        System.out.println(" 出队元素：" + priorityQueue.deQueue());
        System.out.println(" 出队元素：" + priorityQueue.deQueue());
    }
}
```

运行结果为：

```
 出队元素：10
 出队元素：7
```



#### 红黑树//TODO

数据结构与算法可视化:https://www.cs.usfca.edu/~galles/visualization/Algorithms.html

红黑树学习视频：https://www.bilibili.com/video/av75383751?p=4

###### 红黑树的定义与性质

红黑树是一种**含有红黑节点并能自平衡的二叉查找树**。它满足下面5个性质：

1. 性质1：每个节点要么是黑色，要么是红色。
2. 性质2：根节点是黑色。
3. 性质3：每个叶子节点（NIL）是黑色。
4. 性质4：每个红色结点的两个子节点一定都是黑色。
5. 性质5：任意一节点到每个叶子节点的路径都包含数量相同的黑结点。

###### 红黑树的定义与性质的剖析

1、红黑树是二叉查找树

二叉查找树的特点是：树和它的子树满足以下约束：左节点小于父节点，右节点大于父节点。

通俗理解就是，如下图，每个节点投射到x轴的值是从小到大的。

<img src="java数据结构.assets\image-20200429122012486.png" alt="image-20200429122012486" style="zoom:67%;" />

2、红黑树性质1：每个节点要么是黑色，要么是红色

红黑树每个节点多了1个颜色标记位，每个节点要么是黑色，要么是红色。

实现红黑树的大致代码如下：

```java
public class RedBlack{
	private short color;
	private RedBlack left;
	private RedBlask right;
	private Long value;
}
```

3、红黑树性质2：根节点是黑色【这是硬形规定，你无法推导出根节点不能是红色】

<img src="java数据结构.assets\image-20200429122938629.png" alt="image-20200429122938629" style="zoom:67%;" />

4、红黑树性质3：每个叶子节点（NIL）是黑色。

每个叶子节点(NIL) 都是黑色的**虚节点**（虚拟出来的）

注意：红黑树中的叶子节点跟树中定义的叶子节点是不一样的。这里的叶子节点指的是黑色的，**value值是null的节点**。

<img src="java数据结构.assets\image-20200429123150959.png" alt="image-20200429123150959" style="zoom: 67%;" />

5、红黑树性质4：每个红色结点的两个子节点一定都是黑色。

简单理解就是：**不能有两个连续的红色节点**。

6、红黑树性质5：任意一节点到每个叶子节点（NIL)的路径都包含数量相同的黑节点。

**红黑树并不是一个完美平衡二叉查找树，**从图1可以看到，根结点P的左子树显然比右子树高，但**左子树和右子树的黑结点的层数是相等的**，也即任意一个结点到到每个叶子结点的路径都包含数量相同的黑结点(性质5)。所以我们叫红黑树这种平衡为****黑色完美平衡****（抛开红节点，黑色节点的层数相等）。

<img src="java数据结构.assets\image-20200429125248193.png" alt="image-20200429125248193" style="zoom: 80%;" />

###### 红黑树的平衡性

红黑树是一种含有红黑结点并能自平衡的二叉查找树。

红黑树是**非完美平衡二叉查找树**，是**完美黑色平衡二叉查找树**。

我们在学习普通的二叉查找树的时候知道，二叉查找树可能会出现下面图的这种情况，依次插入1、2、3、4、5值时，完全退化成了链表，二分查找已经使用不到了。

<img src="java数据结构.assets\image-20200429125727547.png" alt="image-20200429125727547" style="zoom: 67%;" />

###### 红黑树自平衡的最小单元

红黑树的自平衡每次只考虑CPGU三代即可，其余部分无需考虑

- 祖父G-Grandfather
- 父母P-Parents
- 叔叔U-Uncle
- 兄弟B-Brother
- 根R-Root
- 当前新增节点C-Current

<img src="java数据结构.assets\image-20200429131616289.png" alt="image-20200429131616289" style="zoom:80%;" />

###### 红黑树自平衡的原子操作

红黑树的自平衡操作包括：**变色**，**旋转**。

其中旋转有可以分为**左旋**和**右旋**。**旋转要有圆心**，有方向（****基于最短路径来确定旋转方向****）。旋转节点围绕子节点旋转（子节点为圆心）

左旋：逆时针方向旋转

右旋：顺时针方向旋转，右旋示意图如下：



<img src="java数据结构.assets\image-20200429133501392.png" alt="image-20200429133501392" style="zoom: 67%;" />

右旋举例

<img src="java数据结构.assets\image-20200429133534401.png" alt="image-20200429133534401" style="zoom:67%;" />

变色举例，示意图如下：

<img src="java数据结构.assets\image-20200429133709908.png" alt="image-20200429133709908" style="zoom:50%;" />

左旋举例，示意图如下：

<img src="java数据结构.assets\image-20200429195040081.png" alt="image-20200429195040081" style="zoom:67%;" />



###### 红黑树的查找操作

和二叉搜索树的查找类似，比较简单。

###### 红黑树的新增操作

红黑树进行新增操作会遇到的所有情况：

![image-20200429200833314](java数据结构.assets/image-20200429200833314.png)

情况1：C=root 

情况2：C.parent=black

情况3：C.parent=red & C.uncle=red

情况4：C.parent=red & (C.uncle=black or C.uncle is Nil)

4中新增情况的处理：

<img src="java数据结构.assets\image-20200429201257797.png" alt="image-20200429201257797" style="zoom:67%;" />

情况1：C=root

​	处理方法：**新增C当前节点默认为红色**，修改C当前节点为黑色。

![image-20200429202254522](java数据结构.assets/image-20200429202254522.png)

情况2：C.parent=black

​	处理方法：新增C当前节点，颜色为红色。不需要做任何处理。

![image-20200429202314416](java数据结构.assets/image-20200429202314416.png)

情况4.1: CPG 三点一线

​	处理方法：以P父节点为圆心，旋转G祖父节点，变色P父节点和G祖父节点。

![image-20200429202632424](java数据结构.assets/image-20200429202632424.png)

![image-20200429202658525](java数据结构.assets/image-20200429202658525.png)

情况2：CPG三角关系

​	处理方法：以C当前新增节点为圆心，旋转P点，再按照4.1情况处理。

<img src="java数据结构.assets\image-20200429202859540.png" alt="image-20200429202859540" style="zoom:50%;" />

<img src="java数据结构.assets\image-20200429202932747.png" alt="image-20200429202932747" style="zoom:50%;" />

<img src="java数据结构.assets\image-20200429203114843.png" alt="image-20200429203114843" style="zoom:50%;" />

情况3：C.parent=red &C.uncle=red

​	处理方法：

​		新增C节点 默认为红色

​		P父节点变成黑色

​		U叔叔节点变成黑色

​		G祖父节点变成红色

​		【如果祖父节点变红导致不满足红黑树性质】

​		将祖父节点作为新增节点C **递归处理**【1 2 3 4情况处理】

![image-20200429203438746](java数据结构.assets/image-20200429203438746.png)



## 排序算法

#### 排序算法的种类

根据时间复杂度的不同，主流的排序算法可以分为3大类。

1、时间复杂度为O(n2)的排序算法

- 冒泡排序 
- 选择排序 
- 插入排序
- 希尔排序（希尔排序比较特殊，它的性能略优于O(n2)，但又比不上 O(nlogn)，姑且把它归入本类）

2、时间复杂度为O(nlogn)的排序算法

- 快速排序 
- 归并排序 
- 堆排序

3、时间复杂度为线性的排序算法

- 计数排序 
- 桶排序 
- 基数排序

当然，以上列举的只是最主流的排序算法，在算法界还存在着更多五花八门的排序，它们有些基于传统排序变形而来；有些则是脑洞大开，如鸡尾酒排序、猴子 排序、睡眠排序等。

此外，**排序算法还可以根据其稳定性，划分为稳定排序和不稳定排序**。即如果值相同的元素在排序后仍然保持着排序前的顺序，则这样的排序算法是稳定排序；如果值相同的元素在排序后打乱了排序前的顺序，则这样的排序算法是 不稳定排序。

例如下面的例子。

<img src="java数据结构.assets\image-20200429204612954.png" alt="image-20200429204612954" style="zoom:50%;" />

在大多数场景中，值相同的元素谁先谁后是无所谓的。但是在某些场景下，值相同的元素必须保持原有的顺序。

由于篇幅所限，我们无法把所有的排序算法都一一详细讲述。在本章中，将只 讲述几个具有代表性的排序算法：冒泡排序、快速排序、堆排序、计数排序、桶排序。

#### 冒泡排序

###### 冒泡排序介绍

<video src="E:\LearningAll\8-HadoopEcosystem-Video\java+数据结构+算法突击.assets\BubbleSort.mp4"/>
冒泡排序的英文是bubble sort，它是一种基础的交换排序。

大家一定都喝过汽水，汽水中常常有许多小小的气泡哗啦哗啦飘到上面来。这 是因为组成小气泡的二氧化碳比水轻，所以小气泡可以一点一点地向上浮动。

而冒泡排序之所以叫冒泡排序，正是因为这种**排序算法的每一个元素都可以像小气泡一样，根据自身大小，一点一点地向着数组的一侧移动**。

具体如何移动呢？让我们先来看一个例子。

有8个数字组成一个无序数列{5,8,6,3,9,2,1,7}，希望按照从小到大的顺序对其进行排序。

<img src="java数据结构.assets\image-20200429210225216.png" alt="image-20200429210225216" style="zoom: 50%;" />

按照冒泡排序的思想，我们要把相邻的元素两两比较，当一个元素大于右侧相邻元素时，交换它们的位置；

当一个元素小于或等于右侧相邻元素时，位置不变。

详细过程如下。

<img src="java数据结构.assets\image-20200429210242483.png" alt="image-20200429210242483" style="zoom: 50%;" />

这样一来，元素9作为数列中最大的元素，就像是汽水里的小气泡一 样，“漂”到了最右侧。

这时，冒泡排序的第1轮就结束了。数列最右侧元素9的位置可以认为是一个有 序区域，**有序区域目前只有1个元素**。

<img src="java数据结构.assets\image-20200429210309856.png" alt="image-20200429210309856" style="zoom:50%;" />

下面，让我们来进行第2轮排序。

第2轮排序结束后，数列**右侧的有序区有了2个元素**，顺序如下。

后续的交换细节，这里就不详细描述了，第3轮到第7轮的状态如下。

<img src="java数据结构.assets\image-20200430013356642.png" alt="image-20200430013356642" style="zoom:50%;" />

到此为止，所有元素都是有序的了，这就是冒泡排序的整体思路。

冒泡排序是一种稳定排序，值相等的元素并不会打乱原本的顺序。由于该排序算法的每一轮都要**遍历非有序区所有元素**，总共遍历（元素数量-1）轮，所以**平均时间复杂 度是O(n^2)**。

###### 冒泡排序——第1版实现代码

```java
package com.jimmy.streaming;

import java.util.Arrays;

class SortDemo{

    public static void sort(int[]array){
        for (int i=0;i<array.length-1;i++){
            for(int j=0;j<array.length-i-1;j++){
                int temp=0;
                if(array[j]>array[j+1]){
                    temp=array[j];
                    array[j]=array[j+1];
                    array[j+1]=temp;
                }
            }
        }
    }
    public static void main(String[] args) {
        int[] array=new int[]{5,8,6,3,9,2,1,7};
        sort(array);
        System.out.println(Arrays.toString(array));
    }
}
```

运行结果为：

```
[1, 2, 3, 5, 6, 7, 8, 9]
```

###### 冒泡排序优化1：标记数列是否已经有序

让我们回顾一下刚才描述的排序细节，仍然以{5,8,6,3,9,2,1,7}这个数列为 例，当排序算法分别执行到第6、第7轮时，数列状态如下。

<img src="java数据结构.assets\image-20200430015015671.png" alt="image-20200430015015671" style="zoom:50%;" />

很明显可以看出，经过**第6轮排序后，整个数列已然是有序的了**。可是排序算法 仍然兢兢业业地继续执行了第7轮排序。

在这种情况下，如果能**判断出数列已经有序，并做出标记，那么剩下的几轮排序就不必执行了**，可以提前结束工作

###### 冒泡排序——第2版实现代码

```java
package com.jimmy.streaming;

import java.util.Arrays;

class SortDemo{

    public static void sort(int[]array){

        for (int i=0;i<array.length-1;i++)
        {
            //有序标记，每一轮的初始值都是true
        	boolean isSorted=true;
            for(int j=0;j<array.length-i-1;j++)
            {
                int temp=0;
                if(array[j]>array[j+1])
                {
                    temp=array[j];
                    array[j]=array[j+1];
                    array[j+1]=temp;
                    //因为有元素进行交换，所以不是有序的，标记变为false
                    isSorted=false;
                }
            }
            if(isSorted){
                break;
            }
        }
    }
    public static void main(String[] args) {
        int[] array=new int[]{5,8,6,3,9,2,1,7};
        sort(array);
        System.out.println(Arrays.toString(array));
    }
}
```

运行结果：

```
[1, 2, 3, 5, 6, 7, 8, 9]
```

第2版代码做了小小的改动，利用布尔变量isSorted作为标 记。如果在本轮排序中，元素有交换，则说明数列无序；如果没有元素交换，则说 明数列已然有序，然后直接跳出大循环。

###### 冒泡排序优化2：界定数列有序区

标记数列是否已经有序只是冒泡排序优化的第一步，我们还可以进一步来提升它的性能。

为了说明问题，这次以一个新的数列为例。

<img src="java数据结构.assets\image-20200430015826126.png" alt="image-20200430015826126" style="zoom: 50%;" />

这个数列的特点是前半部分的元素（3、4、2、1）无序，后半部分的元素（5、 6、7、8）按升序排列，并且后半部分元素中的最小值也大于前半部分元素的最大 值。

下面按照冒泡排序的思路来进行排序，看一看具体效果。

第1轮

<img src="java数据结构.assets\image-20200430015845546.png" alt="image-20200430015845546" style="zoom: 50%;" />

元素4和5比较，发现4小于5，所以位置不变。

元素5和6比较，发现5小于6，所以位置不变。

元素6和7比较，发现6小于7，所以位置不变。

元素7和8比较，发现7小于8，所以位置不变。

第1轮结束，数列**有序区包含1个元素（实际上不止1个元素）**。

<img src="java数据结构.assets\image-20200430015911077.png" alt="image-20200430015911077" style="zoom:50%;" />

第2轮

元素3和2比较，发现3大于2，所以3和2交换。

<img src="java数据结构.assets\image-20200430015955185.png" alt="image-20200430015955185" style="zoom:50%;" />

元素3和4比较，发现3小于4，所以位置不变。

元素4和5比较，发现4小于5，所以位置不变。

元素5和6比较，发现5小于6，所位位置不变。

元素6和7比较，发现6小于7，所以位置不变。

元素7和8比较，发现7小于8，所以位置不变。

第2轮结束，数列**有序区包含2个元素（实际上不止2个元素）**。

![image-20200430020006166](java数据结构.assets/image-20200430020006166.png)

小灰，你发现其中的问题了吗？

其实**右面的许多元素已经是有序的了，可是每一轮还是白白地比较了许多次**。 没错，这正是冒泡排序中另一个需要优化的点。这个问题的**关键点在于对数列有序区的界定**。

按照现有的逻辑，有序区的长度和排序的轮数是相等的。例如第1轮排序过后的 有序区长度是1，第2轮排序过后的有序区长度是2 ……

****实际上，数列真正的有序区可能会大于这个长度****，如上述例子中在第2轮排序 时，后面的5个元素实际上都已经属于有序区了。因此后面的多次元素比较是没有意 义的。

那么，该如何避免这种情况呢？我们可以在**每一轮排序后，记录下来最后一次元素交换的位置，该位置即为无序数列的边界，再往后就是有序区了**。

###### 冒泡排序——第3版实现代码

```java
import java.util.Arrays;

class SortDemo{

    public static void sort(int[]array){

        //记录最后一次交换的位置
        int lastExchangeIndex=0;
        //初始化无序数列的边界，每次比较只需要比到这里为止
        int sortBorder=array.length-1;

        for (int i=0;i<array.length-1;i++)
        {
            //有序标记，每一轮的初始值都是true
            boolean isSorted=true;
            for(int j=0;j<sortBorder;j++)
            {
                int temp=0;
                if(array[j]>array[j+1])
                {
                    temp=array[j];
                    array[j]=array[j+1];
                    array[j+1]=temp;
                    //因为有元素进行交换，所以不是有序的，标记变为false
                    isSorted=false;
                    lastExchangeIndex=j;
                }
            }
            sortBorder=lastExchangeIndex;
            if(isSorted){
                break;
            }
        }
    }
    public static void main(String[] args) {
        int[] array=new int[]{5,8,6,3,9,2,1,7};
        sort(array);
        System.out.println(Arrays.toString(array));
    }
}
```

运行结果为：

```
[1, 2, 3, 5, 6, 7, 8, 9]
```

#### 鸡尾酒排序——双向交换的冒泡排序

###### 鸡尾酒排序介绍

冒泡排序的每一个元素都可以像小气泡一样，根据自身大小，一点一点地向着数组的一侧移动。算法的每一轮都是从左到右来比较元素，进行单向的位置交换的。

那么鸡尾酒排序做了怎样的优化呢？**鸡尾酒排序的元素比较和交换过程是双向的**。

下面举一个例子。

由8个数字组成一个无序数列{2,3,4,5,6,7,8,1}，希望对其进行从小到大的排序。

如果按照冒泡排序的思想，排序过程如下。

<img src="java数据结构.assets\image-20200430151619345.png" alt="image-20200430151619345" style="zoom:50%;" />

元素2、3、4、5、6、7、8已经是有序的了，**只有元素1的位置不对**，却还要进行7轮排序，这也太“憋屈”了吧！没错，**鸡尾酒排序正是要解决这个问题的**。

那么鸡尾酒排序是什么样子的呢？让我们来看一看详细过程。

第1轮（和冒泡排序一样，8和1交换）

<img src="java数据结构.assets\image-20200430151808439.png" alt="image-20200430151808439" style="zoom:50%;" />

第2轮，此时开始不一样了，我们反过来从右往左比较并进行交换。

<img src="java数据结构.assets\image-20200430151837632.png" alt="image-20200430151837632" style="zoom:50%;" />

<img src="java数据结构.assets\image-20200430151905268.png" alt="image-20200430151905268" style="zoom:50%;" />



<img src="java数据结构.assets\image-20200430151837632.png" alt="image-20200430151837632" style="zoom:50%;" />![image-20200430151905268](java数据结构.assets/image-20200430151905268.png)

![image-20200430151905268](java数据结构.assets/image-20200430151905268-1610888383051.png)

第3轮（虽然实际上已经有序，但是流程并没有结束）

在鸡尾酒排序的第3轮，需要重新从左向右比较并进行交换。

1和2比较，位置不变；2和3比较，位置不变；3和4比较，位置不变……6和7比 较，位置不变。

**没有元素位置进行交换，证明已经有序，排序结束**。

这就是鸡尾酒排序的思路。排序过程就像钟摆一样，第1轮从左到右，第2轮从右到左，第3轮再从左到右……

###### 鸡尾酒排序代码实现

```java
package com.jimmy.streaming;

import java.util.Arrays;

class SortDemo{

    public static void sort(int[]array){

        int temp=0;
        //奇数轮
        for (int i=0;i<array.length/2;i++)
        {
            //有序标记，每一轮的初始值都是true
            boolean isSorted=true;
            for(int j=0;j<array.length-i-1;j++)
            {
                if(array[j]>array[j+1])
                {
                    temp=array[j];
                    array[j]=array[j+1];
                    array[j+1]=temp;
                    //因为有元素进行交换，所以不是有序的，标记变为false
                    isSorted=false;
                }
            }
            if(isSorted){
                break;
            }

            isSorted=true;
            for(int j=array.length-i-1;j>i;j--)
            {
                if(array[j]<array[j-1])
                {
                    temp=array[j];
                    array[j]=array[j-1];
                    array[j-1]=temp;
                    //因为有元素进行交换，所以不是有序的，标记变为false
                    isSorted=false;
                }
            }
            if(isSorted){
                break;
            }
        }
    }
    public static void main(String[] args) {
        int[] array=new int[]{5,8,6,3,9,2,1,7};
        sort(array);
        System.out.println(Arrays.toString(array));
    }
}
```

#### 快速排序

###### 快速排序的介绍

**同冒泡排序一样，快速排序也属于交换排序**，通过元素之间的比较和交换位置 来达到排序的目的。

不同的是，冒泡排序在每一轮中只把1个元素冒泡到数列的一端，而**快速排序则在每一轮挑选一个基准元素，并让其他比它大的元素移动到数列一边，比它小的元 素移动到数列的另一边，从而把数列拆解成两个部分**。

<img src="java数据结构.assets\image-20200430161116595.png" alt="image-20200430161116595" style="zoom:50%;" />

这种思路就叫作分治法。每次把数列分成两部分，究竟有什么好处呢？

假如给出一个8个元素的数列，一般情况下，使用冒泡排序需要比较7轮，每一轮把1个元素移动到数列的一端，时间复杂度是O(n2)。

而**快速排序的流程是什么样子呢？**

<img src="java数据结构.assets\image-20200430161137038.png" alt="image-20200430161137038" style="zoom: 67%;" />

如图所示，在分治法的思想下，**原数列在每一轮都被拆分成两部分**，每一部分 在下一轮又分别被拆分成两部分，**直到不可再分为止**。

**每一轮的比较和交换，需要把数组全部元素都遍历一遍，时间复杂度是O(n)**。 这样的遍历一共需要多少轮呢？**假如元素个数是n，那么平均情况下需要logn轮**，因此**快速排序算法总体的平均时间复杂度是O(nlogn)**。

分治法果然神奇！那么基准元素是如何选的呢？又如何把其他元素移动到基准元素的两端？

###### 基准元素的选择

基准元素，英文是pivot[ˈpɪvət]，**在分治过程中，以基准元素为中心，把其他元素移动到它的左右两边。**
那么如何选择基准元素呢？

**最简单的方式是选择数列的第1个元素。**

![image-20200430161359578](java数据结构.assets/image-20200430161359578.png)

这种选择**在绝大多数情况下是没有问题的。但是，假如有一个原本逆序的数列**，期望排序成顺序数列，那么会出现什么情况呢？

<img src="java数据结构.assets\image-20200430161423047.png" alt="image-20200430161423047" style="zoom: 67%;" />

哎呀，**整个数列并没有被分成两半，每一轮都只确定了基准元素的位置**。

是呀，在这种情况下，数列的第1个元素要么是最小值，要么是最大值，根本无法发挥分治法的优势。

**在这种极端情况下，快速排序需要进行n轮，时间复杂度退化成了O(n^2)**。那么，该怎么避免这种情况发生呢？其实很简单，我们**可以随机选择一个元素作为基准元素，并且让基准元素和数列首元素交换位置**。

这样一来，即使在数列完全逆序的情况下，也可以有效地将数列分成两部分。

当然，即使是随机选择基准元素，**也会有极小的几率选到数列的最大值或最小值**，同样会影响分治的效果。

所以，****虽然快速排序的平均时间复杂度是O(nlogn)，但最坏情况下的时间复杂度是O(n^2)****。

在后文中，为了简化步骤，省去了随机选择基准元素的过程，直接把首元素作为基准元素。

###### 元素的交换

选定了基准元素以后，我们要做的就是把其他元素中小于基准元素的都交换到基准元素一边，大于基准元素的都交换到基准元素另一边。

具体如何实现呢？有两种方法。

1. 双边循环法。
2. 单边循环法。

###### 双边循环法

何谓双边循环法？下面来看一看详细过程。给出原始数列如下，要求对其从小到大进行排序。

<img src="java数据结构.assets\image-20200430162302978.png" alt="image-20200430162302978" style="zoom:50%;" />

首先，选定基准元素pivot，并且设置两个指针left和right，指向数列的最左和最右两个元素。

<img src="java数据结构.assets\image-20200430162312593.png" alt="image-20200430162312593" style="zoom: 67%;" />

接下来进行第1次循环，**从right指针开始，让指针所指向的元素和基准元素做比较。如果大于或等于pivot，则指针向左移动；如果小于pivot，则right指针停止移动，切换到left指针**。

在当前数列中，1<4，所以right直接停止移动，换到left指针，进行下一步行动。

**轮到left指针行动，让指针所指向的元素和基准元素做比较。如果小于或等于 pivot，则指针向右移动；如果大于pivot，则left指针停止移动。**

由于left开始指向的是基准元素，判断肯定相等，所以left右移1位。

<img src="java数据结构.assets\image-20200430162500664.png" alt="image-20200430162500664" style="zoom:67%;" />

由于7>4，left指针在元素7的位置停下。这时，让left和right指针所指向的元 素进行交换。

<img src="java数据结构.assets\image-20200430162537548.png" alt="image-20200430162537548" style="zoom:67%;" />

接下来，进入第2次循环，重新切换到right指针，向左移动。right指针先移 动到8，8>4，继续左移。由于2<4，停止在2的位置。

按照这个思路，后续步骤如图所示。

<img src="java数据结构.assets\image-20200430162614864.png" alt="image-20200430162614864" style="zoom: 67%;" />

<img src="java数据结构.assets\image-20200430162653299.png" alt="image-20200430162653299" style="zoom: 67%;" />



###### 快速排序代码实现——双向循环法（递归）

```java
package com.jimmy.streaming;

import java.util.Arrays;

class DemoQuick{
    public static void quickSort(int []arr,int startIndex,int endIndex){
        // 递归结束条件：startIndex大于或等于endIndex时
        if(startIndex>=endIndex){
            return;
        }
        // 得到基准元素位置
        int pivotIndex=partition(arr,startIndex,endIndex);
        quickSort(arr,startIndex,pivotIndex-1);
        quickSort(arr,pivotIndex+1,endIndex);
    }

    /**
     * 分治（双边循环法）
     * @param arr  待交换的数组
     * @param startIndex   起始下标
     * @param endIndex      结束下标
     * @return
     */
    public static int partition(int []arr,int startIndex,int endIndex){
        // 取第1个位置（也可以选择随机位置）的元素作为基准元素
        int left=startIndex;
        int right=endIndex;
        int pivot=arr[startIndex];
        while (left!=right){
            while (right>left && arr[right]>pivot){
                right--;
            }
            while (right>left && arr[left]<=pivot){
                left++;
            }
            if(left<right){
                int temp=arr[left];
                arr[left]=arr[right];
                arr[right]=temp;
            }
        }
        ////pivot 和指针重合点交换
        arr[startIndex]=arr[left];
        arr[left]=pivot;
        return left;
    }
    public static void main(String[] args) {
        int[] arr = new int[] {4,4,6,5,3,2,8,1};
        quickSort(arr, 0, arr.length-1);
        System.out.println(Arrays.toString(arr));
    }
}
```

**quickSort方法通过递归的方式，实现了分而治之的思想**。partition方法则实现了元素的交换，让数列中的元素依据自身大小，分别交 换到基准元素的左右两边。在这里，我们使用的交换方式是双边循环法。

###### 单边循环法

双边循环法从数组的两边交替遍历元素，虽然更加直观，但是代码实现相对烦 琐。而单边循环法则简单得多，只从数组的一边对元素进行遍历和交换。我们来看 一看详细过程。

给出原始数列如下，要求对其从小到大进行排序。

<img src="java数据结构.assets\image-20200430172040677.png" alt="image-20200430172040677" style="zoom:67%;" />

开始和双边循环法相似，首先选定基准元素pivot。同时，设置一个mark指针 指向数列起始位置，**这个mark指针代表小于基准元素的区域边界**。

<img src="java数据结构.assets\image-20200430172054971.png" alt="image-20200430172054971" style="zoom:67%;" />

接下来，从基准元素的下一个位置开始遍历数组。

**如果遍历到的元素大于基准元素，就继续往后遍历。**

**如果遍历到的元素小于基准元素，则需要做两件事**：**第一，把mark指针右移1 位**，因为小于pivot的区域边界增大了1；**第二，让最新遍历到的元素和mark指针所在位置的元素交换位置**，因为最新遍历的元素归属于小于pivot的区域。

首先遍历到元素7，7>4，所以继续遍历。

<img src="java数据结构.assets\image-20200430172202076.png" alt="image-20200430172202076" style="zoom:67%;" />

接下来遍历到的元素是3，3<4，所以mark指针右移1位。

<img src="java数据结构.assets\image-20200430172212193.png" alt="image-20200430172212193" style="zoom:67%;" />

随后，让元素3和mark指针所在位置的元素交换，因为元素3归属于小于pivot 的区域。

<img src="java数据结构.assets\image-20200430172222861.png" alt="image-20200430172222861" style="zoom:67%;" />

按照这个思路，继续遍历，后续步骤如图所示。

<img src="java数据结构.assets\image-20200430172306562.png" alt="image-20200430172306562" style="zoom:67%;" />

<img src="java数据结构.assets\image-20200430172322049.png" alt="image-20200430172322049" style="zoom:67%;" />

明白了，这个方法只需要单边循环，确实简单了许多呢！怎么用代码来实现呢？

**双边循环法和单边循环法的区别在于partition函数的实现**，让我们来看一下代码。

###### 快速排序代码实现——单向循环法（递归）

```java
package com.jimmy.streaming;

import java.util.Arrays;

class DemoQuick{
    public static void quickSort(int []arr,int startIndex,int endIndex){
        // 递归结束条件：startIndex大于或等于endIndex时
        if(startIndex>=endIndex){
            return;
        }
        // 得到基准元素位置
        int pivotIndex=partition(arr,startIndex,endIndex);
        quickSort(arr,startIndex,pivotIndex-1);
        quickSort(arr,pivotIndex+1,endIndex);
    }

    /**
     * 分治（单向循环）
     * @param arr
     * @param startIndex
     * @param endIndex
     * @return
     */
    public static int partition(int []arr,int startIndex,int endIndex){
        int pivot=arr[startIndex];
        int mark=startIndex;
        for(int i=startIndex+1;i<=endIndex;i++){
            if(arr[i]<pivot){
                mark++;
                int temp=arr[i];
                arr[i]=arr[mark];
                arr[mark]=temp;java
            }
        }
        arr[startIndex]=arr[mark];
        arr[mark]=pivot;
        return mark;
    }
    public static void main(String[] args) {
        int[] arr = new int[] {4,4,6,5,3,2,8,1};
        quickSort(arr, 0, arr.length-1);
        System.out.println(Arrays.toString(arr));
    }
}
```

运行结果为：

```
[1, 2, 3, 4, 4, 5, 6, 8]
```

partition方法只要一个大循环就搞定了，的确比双边循环法简单多了。

实快速排序也可以基于非递归的方式来实现。

###### 速排序代码实现——单向循环法（非递归）

绝大多数的递归逻辑，都可以用栈的方式来代替。为什么这样说呢？

在第1章介绍空间复杂度时我们曾经提到过，代码中一层一层的方法调用，本身 就使用了一个方法调用栈。

**每次进入一个新方法，就相当于入栈；每次有方法返回，就相当于出栈。**

所以，可以把原本的递归实现转化成一个栈的实现，在栈中存储每一次方法调用的参数。

<img src="java数据结构.assets\image-20200430175849087.png" alt="image-20200430175849087" style="zoom: 50%;" />

下面来看一下具体的代码：

```java
package com.jimmy.streaming;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Stack;

class DemoQuick{
    public static void quickSort(int []arr,int startIndex,int endIndex){
        // 用一个集合栈来代替递归的函数栈
        Stack<Map<String,Integer>> quickSortStack=new Stack<Map<String, Integer>>();
        // 整个数列的起止下标，以哈希的形式入栈
        Map rootParam=new HashMap();
        rootParam.put("startIndex",startIndex);
        rootParam.put("endIndex",endIndex);
        quickSortStack.push(rootParam);

        while (!quickSortStack.isEmpty()){
            //  栈顶元素出栈，得到起止下标
            Map<String,Integer> param=quickSortStack.pop();
            //  得到基准元素位置
            int pivotIndex=partition(arr,param.get("startIndex"),param.get("endIndex"));
            //  根据基准元素分成两部分, 把每一部分的起止下标入栈
            if(param.get("startIndex")<pivotIndex-1){
                Map<String,Integer> leftParam=new HashMap<String, Integer>();
                leftParam.put("startIndex",param.get("startIndex"));
                leftParam.put("endIndex",pivotIndex-1);
                quickSortStack.push(leftParam);
            }
            if(pivotIndex+1<param.get("endIndex")){
                Map<String,Integer> rightParam=new HashMap<String, Integer>();
                rightParam.put("startIndex",pivotIndex+1);
                rightParam.put("endIndex",param.get("endIndex"));
                quickSortStack.push(rightParam);
            }
        }
    }

    /**
     * 分治（单向循环）
     * @param arr
     * @param startIndex
     * @param endIndex
     * @return
     */
    public static int partition(int []arr,int startIndex,int endIndex){
        int pivot=arr[startIndex];
        int mark=startIndex;
        for(int i=startIndex+1;i<=endIndex;i++){
            if(arr[i]<pivot){
                mark++;
                int temp=arr[i];
                arr[i]=arr[mark];
                arr[mark]=temp;
            }
        }
        arr[startIndex]=arr[mark];
        arr[mark]=pivot;
        return mark;
    }
    public static void main(String[] args) {
        int[] arr = new int[] {4,4,6,5,3,2,8,1};
        quickSort(arr, 0, arr.length-1);
        System.out.println(Arrays.toString(arr));
    }
}
```

运行结果为：

```
[1, 2, 3, 4, 4, 5, 6, 8]
```

和刚才的递归实现相比，非递归方式代码的变动只发生在quickSort方法中。 **该方法引入了一个存储Map类型元素的栈，用于存储每一次交换时的起始下标和结束下标**。

每一次循环，都会让栈顶元素出栈，通过partition方法进行分治，并且按照基准元素的位置分成左右两部分，左右两部分再分别入栈。**当栈为空时，说明排序 已经完毕，退出循环。**

快速排序是很重要的算法，与傅里叶变换等算法并称为二十世纪十大算法。 有关快速排序的知识我们就介绍到这里，**希望大家把这个算法吃透，未来会受益无穷**！

#### 堆排序

还记得二叉堆的特性是什么吗?

- 最大堆的堆顶是整个堆中的最大元素。
- 最小堆的堆顶是整个堆中的最小元素。

以最大堆为例，如果删除一个最大堆的堆顶（并不是完全删除，而是跟末尾的 节点交换位置），经过自我调整，第2大的元素就会被交换上来，成为最大堆的新堆顶。



<img src="java数据结构.assets\image-20200430210212360.png" alt="image-20200430210212360" style="zoom:50%;" />

<img src="java数据结构.assets\image-20200430210240185.png" alt="image-20200430210240185" style="zoom:50%;" />

正如上图所示，在删除值为10的堆顶节点后，经过调整，值为9的新节点就会顶替上来；在删除值为9的堆顶节点后，经过调整，值为8的新节点就会顶替上来……

**由于二叉堆的这个特性，每一次删除旧堆顶，调整后的新堆顶都是大小仅次于旧堆顶的节点**。

**那么只要反复删除堆顶，反复调整二叉堆，所得到的集合就会成为 一个有序集合**，过程如下。

删除节点9，节点8成为新堆顶。

<img src="java数据结构.assets\image-20200430210308234.png" alt="image-20200430210308234" style="zoom:50%;" />

删除节点8，节点7成为新堆顶。

<img src="java数据结构.assets\image-20200430210325090.png" alt="image-20200430210325090" style="zoom:50%;" />

删除节点7，节点6成为新堆顶。

<img src="java数据结构.assets\image-20200430210339664.png" alt="image-20200430210339664" style="zoom:50%;" />

删除节点6，节点5成为新堆顶。

<img src="java数据结构.assets\image-20200430210352778.png" alt="image-20200430210352778" style="zoom:50%;" />

删除节点5，节点4成为新堆顶。

<img src="java数据结构.assets\image-20200430210402934.png" alt="image-20200430210402934" style="zoom:50%;" />

删除节点4，节点3成为新堆顶。

<img src="java数据结构.assets\image-20200430210416089.png" alt="image-20200430210416089" style="zoom:50%;" />

删除节点3，节点2成为新堆顶。

<img src="java数据结构.assets\image-20200430210429620.png" alt="image-20200430210429620" style="zoom:50%;" />

到此为止，**原本的最大二叉堆已经变成了一个从小到大的有序集合**。之前说过，二叉堆实际存储在数组中，数组中的元素排列如下。

<img src="java数据结构.assets\image-20200430210510860.png" alt="image-20200430210510860" style="zoom:50%;" />

由此，可以归纳出堆排序算法的步骤。

1. 把无序数组构建成二叉堆。需要从小到大排序，则构建成最大堆；需要从大到小排序，则构建成最小堆。
2. 循环删除堆顶元素，替换到二叉堆的末尾，调整堆产生新的堆顶。

大体思路明白了，那么该如何用代码来实现呢?

讲二叉堆时，我们写了二叉堆操作的相关代码。现在只要在原代码的基础上稍微改动一点点，就可以实现堆排序了。

```java
package com.jimmy.streaming;

import java.util.Arrays;

class HeapSortDemo{

    /**
     * 下沉调整
     * @param array 待调整的堆
     * @param parentIndex  要“下沉”的父节点
     * @param length  堆的有效大小
     */
    public static void downAdjust(int []array,int parentIndex,int length){
        // temp 保存父节点值，用于最后的赋值
        int temp=array[parentIndex];
        int childIndex=2*parentIndex+1;
        while (childIndex<length){
            // 如果有右孩子，且右孩子大于左孩子的值，则定位到右孩子
            if(childIndex+1<length && array[childIndex+1]>array[childIndex]){
                childIndex++;
            }
            // 如果父节点大于任何一个孩子的值，则直接跳出
            if(temp>array[childIndex]){
                break;
            }
            array[parentIndex]=array[childIndex];
            parentIndex=childIndex;
            childIndex=2*childIndex+1;
        }
        array[parentIndex]=temp;
    }

    /**
     * 堆排序（升序）
     * @param array 待调整的堆
     */
    public static void heapSort(int[] array){
        // 1. 把无序数组构建成最大堆
        for(int i=(array.length-2)/2;i>=0;i--){
            downAdjust(array,i,array.length);
        }
        System.out.println(Arrays.toString(array));
        // 2. 循环删除堆顶元素，移到集合尾部，调整堆产生新的堆顶
        for(int i =array.length-1;i>0;i--){
            // 最后1个元素和第1个元素进行交换
            int temp=array[i];
            array[i]=array[0];
            array[0]=temp;
            // “下沉”调整最大堆
            downAdjust(array,0,i);


        }
    }
    public static void main(String[] args) {
        int[] arr=new int[]{1,3,2,6,5,7,8,9,10,0};
        heapSort(arr);
        System.out.println(Arrays.toString(arr));
    }
}
```

运行结果为：

```
[10, 9, 8, 6, 5, 7, 2, 3, 1, 0]
[0, 1, 2, 3, 5, 6, 7, 8, 9, 10]
```

二叉堆的节点“下沉”调整（downAdjust 方法）是堆排序算法的基础，这个调节操作本身的时间复杂度在上一章讲过，是O(log n)。我们再来回顾一下堆排序算法的步骤。

1. 把无序数组构建成二叉堆。
2. 循环删除堆顶元素，并将该元素移到集合尾部，调整堆产生新的堆顶。

第1步，把无序数组构建成二叉堆，这一步的时间复杂度是O(n)。

第2步，需要进行n-1次循环。每次循环调用一次downAdjust方法，所以第2步 的计算规模是 (n-1)×logn ，时间复杂度为O(nlogn)。

**两个步骤是并列关系，所以整体的时间复杂度是O(nlogn)。**

从宏观上看，堆排序和快速排序相比，有什么区别和联系呢？

先说说相同点，**堆排序和快速排序的平均时间复杂度都是O(nlogn)，并且都是不稳定排序**。

至于不同点，**快速排序的最坏时间复杂度是O(n^2)，而堆排序的最坏时间复杂度稳定在O(nlogn)**。

#### 计数排序

###### 线性时间的排序

让我们先来回顾一下以前所学的排序算法，无论是冒泡排序，还是快速排序，都是基于元素之间的比较来进行排序的。

例如冒泡排序。如下图所示，因为8>3，所以8和3的位置交换。

<img src="java数据结构.assets\image-20200430225545592.png" alt="image-20200430225545592" style="zoom:67%;" />

例如堆排序。如下图所示，因为10>7，所以10和7的位置交换。

<img src="java数据结构.assets\image-20200430225600918.png" alt="image-20200430225600918" style="zoom:50%;" />

排序当然要先比较呀，难道还有不需要比较的排序算法？

**有一些特殊的排序并不基于元素比较，如计数排序、桶排序、基数排序。**

以计数排序来说，这种排序算法是利用数组下标来确定元素的正确位置的。

###### 初识计数排序

还是不明白，元素下标怎么能用来帮助排序呢？那让我们来看一个例子。

假设数组中有20个随机整数，取值范围为0～10，要求用最快的速度把这20个整数从小到大进行排序。

如何给这些无序的随机整数进行排序呢？

考虑到这些整数只能够在0、1、2、3、4、5、6、7、8、9、10这11个数中取值，取值范围有限。所以，可以根据这有限的范围，建立一个长度为11的数组。数组下标从0到10，元素初始值全为0。

<img src="java数据结构.assets\image-20200430225742740.png" alt="image-20200430225742740" style="zoom:67%;" />

假设20个随机整数的值如下所示。

9，3，5，4，9，1，2，7，8，1，3，6，5，3，4，0，10，9 ，7，9

下面就开始遍历这个无序的随机数列，每一个整数按照其值对号入座，同时，对应数组下标的元素进行加1操作。

例如第1个整数是9，那么数组下标为9的元素加1。

<img src="java数据结构.assets\image-20200430225831955.png" alt="image-20200430225831955" style="zoom: 67%;" />

第2个整数是3，那么数组下标为3的元素加1。

<img src="java数据结构.assets\image-20200430225845395.png" alt="image-20200430225845395" style="zoom:67%;" />

继续遍历数列并修改数组……

最终，当数列遍历完毕时，数组的状态如下。

<img src="java数据结构.assets\image-20200430225857242.png" alt="image-20200430225857242" style="zoom:67%;" />

**该数组中每一个下标位置的值代表数列中对应整数出现的次数。**

有了这个统计结果，排序就很简单了。直接遍历数组，输出数组元素的下标 值，元素的值是几，就输出几次。

0，1，1，2，3，3，3，4，4，5，5，6，7，7，8，9，9，9，9，10

显然，现在输出的数列已经是有序的了。

这就是计数排序的基本过程，它**适用于一定范围内的整数排序。在取值范围不是很大的情况下，它的性能甚至快过那些时间复杂度为O(nlogn)的排序**。

```java
package com.jimmy.streaming;

import java.util.Arrays;

class SortDemo{
    public static int[] countSort(int[] array){
        //1.得到数列的最大值
        int max=array[0];
        for(int i=1;i<array.length;i++){
            if(max<array[i]){
                max=array[i];
            }
        }
        //2.根据数列最大值确定统计数组的长度
        int []countArray=new int[max+1];
        //3.遍历数列，填充统计数组
        for(int i=0;i<array.length;i++){
            countArray[array[i]]++; //
        }
        //4.遍历统计数组，输出结果
        int index=0;
        int [] sortedArray=new int[array.length];
        for(int i=0;i<countArray.length;i++){
            for(int j=0;j<countArray[i];j++){
                sortedArray[index++]=i;
            }
        }
        return sortedArray;
    }
    public static void main(String[] args) {
        int[] arr=new int[]{4,4,6,5,3,2,8,1,7,5,6,0,10};
        int[]sortedArray=countSort(arr);
        System.out.println(Arrays.toString(sortedArray));
    }
}
```

运行结果为：

```
[0, 1, 2, 3, 4, 4, 5, 5, 6, 6, 7, 8, 10]
```

这段代码在开头有一个步骤，就是求数列的最大整数值max。后面创建的统计数 组countArray，长度是max+1，以此来保证数组的最后一个下标是max。

###### 计数排序的优化

<video src="E:\LearningAll\8-HadoopEcosystem-Video\java+数据结构+算法突击.assets\CountSort.mp4" />
我们**只以数列的最大值来决定统计数组的长度**，其实并不严谨。例如下面的数列。

95，94，91，98，99，90，99，93，91，92

这个数列的最大值是99，但最小的整数是90。如果创建长度为100的数组，那么前面从0到89的空间位置就都浪费了！

怎么解决这个问题呢？

很简单，只要不再以输入数列的最大值+1作为统计数组的长度，而是**以**数列最大值-最小值+1**作为统计数组的长度**即可。

同时，数列的最小值作为一个偏移量，用于计算整数在统计数组中的下标。

以刚才的数列为例，统计出数组的长度为99-90+1=10，偏移量等于数列的最小 值90。

对于第1个整数95，对应的统计数组下标是95-90 = 5，如图所示。

<img src="java数据结构.assets\image-20200501012448753.png" alt="image-20200501012448753" style="zoom: 67%;" />

是的，这确实对计数排序进行了优化。此外，**朴素版的计数排序只是简单地按照统计数组的下标输出元素值，并没有真正给原始数列进行排序**。

如果只是单纯地给整数排序，这样做并没有问题。但如果在现实业务里，例如**给学生的考试分数进行排序，遇到相同的分数就会分不清谁是谁**。

什么意思呢？让我们看看下面的例子。

<img src="java数据结构.assets\image-20200501012617209.png" alt="image-20200501012617209" style="zoom:67%;" />

给出一个学生成绩表，要求按成绩从低到高进行排序，如果成绩相同，则遵循原表固有顺序。

那么，当我们填充统计数组以后，只知道有两个成绩并列为95分的同学，却不知道哪一个是小红，哪一个是小绿。

<img src="java数据结构.assets\image-20200501012737865.png" alt="image-20200501012737865" style="zoom:67%;" />

**这种分数相同的情况要怎么解决？**

在这种情况下，需要稍微改变之前的逻辑，**在填充完统计数组以后，对统计数组做一下变形。**

仍然以刚才的学生成绩表为例，将之前的统计数组变形成下面的样子。

<img src="java数据结构.assets\image-20200501012849836.png" alt="image-20200501012849836" style="zoom:67%;" />

这是如何变形的呢？其实就是****从统计数组的第2个元素开始，每一个元素都加上前面所有元素之和****。

为什么要相加呢？初次接触的读者可能会觉得莫名其妙。

这样相加的**目的，是让统计数组存储的元素值，等于相应整数的最终排序位置的序号**。例如下标是9的元素值为5，代表原始数列的整数9，最终的排序在第5位。

接下来，创建输出数组sortedArray，长度和输入数列一致。然后从后向前遍历输入数列。

第1步，遍历成绩表最后一行的小绿同学的成绩。

小绿的成绩是95分，找到countArray下标是5的元素，值是4，代表小绿的成绩 排名位置在第4位。**同时，给countArray下标是5的元素值减1，从4变成3，代表下次再遇到95分的成绩时，最终排名是第3**。

<img src="java数据结构.assets\image-20200501012934894.png" alt="image-20200501012934894" style="zoom:67%;" />

<img src="java数据结构.assets\image-20200501013009317.png" alt="image-20200501013009317" style="zoom:67%;" />

第2步，遍历成绩表倒数第2行的小白同学的成绩。

小白的成绩是94分，找到countArray下标是4的元素，值是2，代表小白的成绩 排名位置在第2位。同时，给countArray下标是4的元素值减1，从2变成1，代表下次再遇到94分的成绩时（实际上已经遇不到了），最终排名是第1。

<img src="java数据结构.assets\image-20200501013112960.png" alt="image-20200501013112960" style="zoom:80%;" />

第3步，遍历成绩表倒数第3行的小红同学的成绩。小红的成绩是95分，找到countArray下标是5的元素，值是3（最初是4，减1变 成了3），代表小红的成绩排名位置在第3位。

同时，给countArray下标是5的元素值减1，从3变成2，代表下次再遇到95分的 成绩时（实际上已经遇不到了），最终排名是第2。

<img src="java数据结构.assets\image-20200501013142963.png" alt="image-20200501013142963" style="zoom: 67%;" />

这样一来，同样是95分的小红和小绿就能够清楚地排出顺序了，也正因为此，**优化版本的计数排序属于**稳定排序**。**

后面的遍历过程以此类推，这里就不再详细描述了。

代码实现：

```java
package com.jimmy.streaming;

import java.util.Arrays;

class SortDemo{
    public static int[] countSort(int[] array){
        //1.得到数列的最大值和最小值，并算出差值d
        int max=array[0];
        int min=array[0];
        for(int i=1;i<array.length;i++){
            if(max<array[i]){
                max=array[i];
            }
            if(min>array[i]){
                min=array[i];
            }
        }
        int d=max-min;

        //2.创建统计数组并统计对应元素的个数
        int []countArray=new int[d+1];
        //3.遍历数列，填充统计数组
        for(int i=0;i<array.length;i++){
            countArray[array[i]-min]++; //
        }

        //3.统计数组做变形，后面的元素等于前面的元素之和
        for(int i=1;i<countArray.length;i++){
            countArray[i]+=countArray[i-1];
        }
        //4.倒序遍历原始数列，从统计数组找到正确位置，输出到结果数组
        int index=0;
        int [] sortedArray=new int[array.length];
        for(int i=array.length-1;i>0;i--){
            sortedArray[countArray[array[i]-min]-1]=array[i];
            countArray[array[i]-min]--;
        }
        return sortedArray;
    }
    public static void main(String[] args) {
        int[] arr=new int[]{95,94,91,98,99,90,99,93,91,92};
        int[]sortedArray=countSort(arr);
        System.out.println(Arrays.toString(sortedArray));
    }
}
```

运行结果为：

```
[90, 91, 91, 92, 93, 94, 0, 98, 99, 99]
```

如果原始数列的规模是n，最大和最小整数的差值是m，你说说计数排序的时间复杂度和空间复杂度是多少？

代码第1、2、4步都涉及遍历原始数列，运算量都是n，第3步遍历统计数列，运算量是m，所以总体运算量是3n+m，去掉系数，**时间复杂度是O(n+m)**。

至于空间复杂度，如果不考虑结果数组，只考虑统计数组大小的话，**空间复杂度是O(m)**。

###### 计数排序的局限性

既然计数排序这么强大，为什么很少被大家使用呢？**因为计数排序有它的局限性**，主要表现为如下两点。

1、**当数列最大和最小值差距过大时，并不适合用计数排序**。例如给出20个随机整数，范围在0到1亿之间，这时如果使用计数排序，需要创 建长度为1亿的数组。不但严重浪费空间，而且时间复杂度也会随之升高。

2、**当数列元素不是整数时，也不适合用计数排序**。如果数列中的元素都是小数，如25.213，或0.00 000 001这样的数字，则无 法创建对应的统计数组。这样显然无法进行计数排序。

对于这些局限性，另一种线性时间排序算法做出了弥补，这种排序算法叫作**桶排序**。

#### 桶排序

桶排序？那又是什么鬼？**桶排序同样是一种线性时间的排序算法**。类似于计数排序所创建的统计数组，桶排序需要创建若干个桶来协助排序。

那么，桶排序中所谓的“桶”，又是什么呢？

每一个桶（bucket）代表一个区间范围，里面可以承载一个或多个元素。

假设有一个非整数数列如下：

4.5，0.84，3.25，2.18，0.5

让我们来看看桶排序的工作原理。

桶排序的第1步，就是创建这些桶，并确定每一个桶的区间范围。

<img src="java数据结构.assets\image-20200501030139363.png" alt="image-20200501030139363" style="zoom: 67%;" />

具体需要建立多少个桶，如何确定桶的区间范围，有很多种不同的方式。我们 这里创建的桶数量等于原始数列的元素数量，除最后一个桶只包含数列最大值外，前面各个桶的区间按照比例来确定。

****区间跨度 = （最大值-最小值）/ （桶的数量 - 1）****

第2步，遍历原始数列，把元素对号入座放入各个桶中。

<img src="java数据结构.assets\image-20200501030206903.png" alt="image-20200501030206903" style="zoom:67%;" />

第3步，对每个桶内部的元素分别进行排序（显然，只有第1个桶需要排序）。

<img src="java数据结构.assets\image-20200501030215633.png" alt="image-20200501030215633" style="zoom:67%;" />

第4步，遍历所有的桶，输出所有元素。

0.5，0.84，2.18，3.25，4.5

到此为止，排序结束。

大体明白了，那么，代码怎么写呢？

我们来看一看桶排序的代码实现。

```java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedList;

class BucketSortDemo{
    public static double[] bucketSort(double[] array)
    {
        //1.得到数列的最大值和最小值，并算出差值d
        double max=array[0];
        double min=array[0];
        for(int i=1;i<array.length;i++){
            if(max<array[i]){
                max=array[i];
            }
            if(min>array[i]){
                min=array[i];
            }
        }
        double d=max-min;

        //2.初始化桶
        int bucketNum=array.length;
        ArrayList<LinkedList<Double>> bucketList=
                new ArrayList<LinkedList<Double>>();
        for(int i=0;i<bucketNum;i++){
            bucketList.add(new LinkedList<Double>());
        }

        //3.遍历原始数组，将每个元素放入桶中
        for(int i=0;i<array.length;i++){
            //计算放入哪个桶
            int num=(int)((array[i]-min)*(bucketNum-1)/d);
            //获取桶并存放元素
            bucketList.get(num).add(array[i]);
        }
        //4.对每个桶内部进行排序
        for(int i=0;i<bucketList.size();i++){
            Collections.sort(bucketList.get(i));
        }

        //5.输出全部元素
        double[] sortedArray=new double[array.length];
        int index=0;
        for(LinkedList<Double> list:bucketList)
        {
            for(double element:list){
                sortedArray[index]=element;
                index++;
            }
        }
        return sortedArray;
    }
    public static void main(String[] args) {
        double[] arr=new double[]{4.12,6.421,0.0023,3.0,2.123,8.122,4.12, 10.09};
        double[]sortedArray=bucketSort(arr);
        System.out.println(Arrays.toString(sortedArray));
    }
}
```

运行结果为：

```
[0.0023, 2.123, 3.0, 4.12, 4.12, 6.421, 8.122, 10.09]
```

在上述代码中，**所有的桶都保存在ArrayList集合中，每一个桶都被定义成一 个链表（`LinkedList<Double>`），这样便于在尾部插入元素。**

同时，上述代码使用了JDK的集合工具类Collections.sort来为桶内部的元素进行排序

**Collections.sort底层采用的是归并排序或Timsort**，各位读者可以简单地把它们当作一种时间复杂度为O(nlogn)的排序。

那么，桶排序的时间复杂度是多少呢？桶排序的时间复杂度有些复杂，让我们来计算一下。

假设原始数列有n个元素，分成n个桶。下面逐步来分析一下算法复杂度。

第1步，求数列最大、最小值，运算量为n。

第2步，创建空桶，运算量为n。

第3步，把原始数列的元素分配到各个桶中，运算量为n。

第4步，在每个桶内部做排序，在元素分布相对均匀的情况下，所有桶的运算量 之和为n。

第5步，输出排序数列，运算量为n。

因此，桶排序的总体时间复杂度为O(n)。

至于空间复杂度就很容易得到了，同样是O(n)。

**桶排序的性能并非绝对稳定**。如果元素的分布极不均衡，在极端情况下，第一个桶中有n-1个元素，最后一个桶中有1个元素。此时的**时间复杂度将退化为O(nlogn)**，而且还白白创建了许多空桶。

<img src="java数据结构.assets\image-20200501032449827.png" alt="image-20200501032449827" style="zoom:67%;" />

由此可见，**并没有绝对好的算法，也没有绝对不好的算法，关键要看具体的场景。**

#### 排序总结

下面根据算法的时间复杂度、空间复杂度、是否稳定等维度来做一个归纳。

![image-20200501032559925](java数据结构.assets/image-20200501032559925.png)

## 面试中的算法

#### 如何判断链表有环

有一个单向链表，链表中有可能出现“环”，就像下图这样。那么，**如何用程序来判断该链表是否为有环链表呢？**

<img src="java数据结构.assets\image-20200501033350940.png" alt="image-20200501033350940" style="zoom:67%;" />

###### 方法1：

首先从头节点开始，依次遍历单链表中的每一个节点。**每遍历一个新节点，就从头检查新节点之前的所有节点，用新节点和此节点之前所有节点依次做比较**。如果发现新节点和之前的某个节点相同，则说明该节点被遍历过两次，链表有环；如果之前的所有节点中不存在与新节点相同的节点，就继续遍历下一个新节点，继续重复刚才的操作。

<img src="java数据结构.assets\image-20200501033412010.png" alt="image-20200501033412010" style="zoom:67%;" />

就像图中这样，当遍历链表节点7时，从头访问节点5和节点3，发现已遍历的节 点中并不存在节点7，则继续往下遍历。当第2次遍历到节点2时，从头访问曾经遍历过的节点，**发现已经遍历过节点2， 说明链表有环**。假设链表的节点数量为n，则**该解法的时间复杂度为O(n^2)**。由于并没有创建额 外的存储空间，所以空间复杂度为O(1)。

OK，这姑且算是一种方法，有没有效率更高的解法？

哦，让我想想啊……

或者，我****创建一个哈希表****，然后……

###### 方法2：

首先**创建一个以节点ID为Key的HashSet集合，用来存储曾经遍历过的节点**。然后同样从头节点开始，依次遍历单链表中的每一个节点。每遍历一个新节点，都用新节点和HashSet集合中存储的节点进行比较，如果发现HashSet中存在与之相同的 节点ID，则说明链表有环，如果HashSet中不存在与新节点相同的节点ID，就把这 个新节点ID存入HashSet中，之后进入下一节点，继续重复刚才的操作。

遍历过5、3。

<img src="java数据结构.assets\image-20200501033641355.png" alt="image-20200501033641355" style="zoom: 50%;" />

遍历过5、3、7、2、6、8、1。

<img src="java数据结构.assets\image-20200501033657848.png" alt="image-20200501033657848" style="zoom:50%;" />

当再一次遍历节点2时，查找HashSet，发现节点已存在。

<img src="java数据结构.assets\image-20200501033721488.png" alt="image-20200501033721488" style="zoom:50%;" />

由此可知，链表有环。

**这个方法在流程上和方法1类似，本质的区别是使用了HashSet作为额外的缓存**。

假设链表的节点数量为n，则**该解法的时间复杂度是O(n)。由于使用了额外的存储空间，所以算法的空间复杂度同样是O(n)**。

OK，这种方法在时间上已经是最优了。有没有可能在空间上也得到优化？

哦，让我想想啊……

想不出来啊，怎么能让时间复杂度不变，同时让空间复杂度降低呢？

有一个很巧妙的方法，这个方法利用了两个指针。

###### 方法3：

首先**创建两个指针p1和p2（在Java里就是两个对象引用）**，让它们同时指向这个链表的头节点。然后开始一个大循环，在循环体中，让****指针p1每次向后移动1个节 点，让指针p2每次向后移动2个节点****，然后比较两个指针指向的节点是否相同。如果相同，则可以判断出链表有环，如果不同，则继续下一次循环。

第1步，p1和p2都指向节点5。

<img src="java数据结构.assets\image-20200501033845310.png" alt="image-20200501033845310" style="zoom: 50%;" />

第2步，p1指向节点3，p2指向节点7。

<img src="java数据结构.assets\image-20200501033907079.png" alt="image-20200501033907079" style="zoom:50%;" />

第3步，p1指向节点7，p2指向节点6。

<img src="java数据结构.assets\image-20200501033934980.png" alt="image-20200501033934980" style="zoom:50%;" />

第4步，p1指向节点2，p2指向节点1。

<img src="java数据结构.assets\image-20200501033948294.png" alt="image-20200501033948294" style="zoom:50%;" />

第5步，p1指向节点6，p2也指向节点6，p1和p2所指相同，说明链表有环。

<img src="java数据结构.assets\image-20200501034000985.png" alt="image-20200501034000985" style="zoom:50%;" />

学过小学奥数的读者，一定听说过数学上的追及问题。此方法就类似于一个追及问题。

在一个环形跑道上，两个运动员从同一地点起跑，一个运动员速度快，另一个运动员速度慢。当两人跑了一段时间后，速度快的运动员必然会再次追上并超过速 度慢的运动员，原因很简单，因为跑道是环形的。

假设链表的节点数量为n，则**该算法的时间复杂度为O(n)。除两个指针外，没有使用任何额外的存储空间，所以空间复杂度是O(1)**。

方法3代码实现——P1P2法

```java
package com.jimmy.streaming;

class CircleDemo{
    private static class Node{
        int data;
        Node next;
        Node(int data){
            this.data=data;
        }
    }
    public static boolean isCycle(Node head){
        Node p1=head;
        Node p2=head;
        while (p2!=null && p2.next!=null){
            p1=p1.next;
            p2=p2.next;
            if(p1**p2){
                return true;
            }
        }
        return false;
    }

    public static void main(String[] args) {
        Node node1 = new Node(5);
        Node node2 = new Node(3);
        Node node3 = new Node(7);
        Node node4 = new Node(2);
        Node node5 = new Node(6);
        node1.next = node2;
        node2.next = node3;
        node3.next = node4;
        node4.next = node5;
        node5.next = node2;

        System.out.println(isCycle(node1));
    }

}
```

运行结果为：

```
true
```

###### 问题扩展

这个题目其实还可以扩展出许多有意思的问题，例如下面这些。

**扩展问题1：如果链表有环，如何求出环的长度？**

<img src="java数据结构.assets\image-20200501041427616.png" alt="image-20200501041427616" style="zoom: 33%;" />

**扩展问题2：如果链表有环，如何求出入环节点？**

<img src="java数据结构.assets\image-20200501041458448.png" alt="image-20200501041458448" style="zoom:33%;" />

哎呀，这两个问题怎么解呢？

第1个问题求环长，非常简单，解法如下。

当两个指针首次相遇，证明链表有环的时候，让两个指针从相遇点继续循环前 进，并统计前进的循环次数，直到两个指针第2次相遇。此时，统计出来的前进次数就是环长。

因为指针p1每次走1步，指针p2每次走2步，两者的速度差是1步。当两个指针 再次相遇时，p2比p1多走了整整1圈。

因此，****环长 = 每一次速度差 × 前进次数 = 前进次数。****(这里的速度差是2-1=1)

第2个问题是求入环点，有些难度，我们可以做一个抽象的推断。

<img src="java数据结构.assets\image-20200501041525361.png" alt="image-20200501041525361" style="zoom:50%;" />

上图是对有环链表所做的一个抽象示意图。假设从链表头节点到入环点的距离 是D，从入环点到两个指针首次相遇点的距离是S1，从首次相遇点回到入环点的距离是S2。

那么，当两个指针首次相遇时，各自所走的距离是多少呢？

指针p1一次只走1步，所走的距离是D+S1。

指针p2一次走2步，多走了n(n>=1)整圈，所走的距离是D+S1+n(S1+S2)。

由于p2的速度是p1的2倍，所以所走距离也是p1的2倍，因此：

2(D+S1) = D+S1+n(S1+S2)

等式经过整理得出：

****D = (n-1)(S1+S2)+S2****（n=1时，D=S2)

也就是说，****从链表头结点到入环点的距离，等于从首次相遇点绕环n-1圈再回到入环点的距离****。

这样一来，**只要把其中一个指针放回到头节点位置，另一个指针保持在首次相遇点，两个指针都是每次向前走1步。那么，它们最终相遇的节点，就是入环节点**。

哇，居然这么神奇？

我们不妨用原题中链表的例子来演示一下。

首先，让指针p1回到链表头节点，指针p2保持在首次相遇点。

<img src="java数据结构.assets\image-20200501041909826.png" alt="image-20200501041909826" style="zoom:50%;" />

指针p1和p2各自前进1步。

<img src="java数据结构.assets\image-20200501041927511.png" alt="image-20200501041927511" style="zoom:50%;" />

指针p1和p2第2次前进。

<img src="java数据结构.assets\image-20200501041940249.png" alt="image-20200501041940249" style="zoom:50%;" />

指针p1和p2第3次前进，指向了同一个节点2，节点2正是有环链表的入环点。

<img src="java数据结构.assets\image-20200501041955696.png" alt="image-20200501041955696" style="zoom:50%;" />

果真在入环点相遇了呢，这下明白了

#### 最小栈的实现

题目

**实现一个栈，该栈带有出栈（pop）、入栈（push）、取最小元素（getMin）3 个方法。要保证这3个方法的时间复杂度都是O(1)。**

<img src="java数据结构.assets\image-20200501043129169.png" alt="image-20200501043129169" style="zoom:50%;" />

哦，让我想想…… 我想到啦！可以把栈中的最小元素下标暂存起来……

**小灰的思路如下。**

1、创建一个整型变量min，用来存储栈中的最小元素。当第1个元素进栈时， 把进栈元素赋值给min，即把栈中唯一的元素当做最小值。

<img src="java数据结构.assets\image-20200501043146581.png" alt="image-20200501043146581" style="zoom:50%;" />

2、之后每当一个新元素进栈，就让新元素和min比较大小。如果新元素小于min，则min等于新进栈的元素；如果新元素大于或等于min，则不做改变。

<img src="java数据结构.assets\image-20200501043218614.png" alt="image-20200501043218614" style="zoom:50%;" />

当调用getMin方法时，直接返回min的值即可。

**这个思路存在问题，只考虑了进栈场景，却没有考虑出栈场景。**

演示一下。

原本，栈中最小的元素是3，min变量记录的值也是3。

<img src="java数据结构.assets\image-20200501043401600.png" alt="image-20200501043401600" style="zoom:50%;" />

这时，栈顶元素出栈了。此时的min变量应该等于几呢？

<img src="java数据结构.assets\image-20200501043410981.png" alt="image-20200501043410981" style="zoom:50%;" />

虽然此时的最小元素是4，但是程序并不知道。

所以说，**只暂存一个最小值是不够的，我们需要存储栈中曾经的最小值，作为“备胎”。**

****详细的解法步骤如下。****

1、设原有的栈叫作栈A，此时创建一个额外的“备胎”栈B，用于辅助栈A。

<img src="java数据结构.assets\image-20200501043456072.png" alt="image-20200501043456072" style="zoom: 33%;" />

2、当第1个元素进入栈A时，让新元素也进入栈B。这个唯一的元素是栈A的当前最小值。

<img src="java数据结构.assets\image-20200501043514492.png" alt="image-20200501043514492" style="zoom: 33%;" />

3、之后，每当新元素进入栈A时，比较新元素和栈A当前最小值的大小，如果小于栈A当前最小值，则让新元素进入栈B，此时栈B的栈顶元素就是栈A当前最小值。

<img src="java数据结构.assets\image-20200501043543367.png" alt="image-20200501043543367" style="zoom: 33%;" />

4、每当栈A有元素出栈时，如果出栈元素是栈A当前最小值，则让栈B的栈顶元素也出栈。此时栈B余下的栈顶元素所指向的，是栈A当中原本第2小的元素，代替刚 才的出栈元素成为栈A的当前最小值。（备胎转正）

<img src="java数据结构.assets\image-20200501043610548.png" alt="image-20200501043610548" style="zoom:33%;" />

**当调用getMin方法时，返回栈B的栈顶所存储的值，这也是栈A的最小值**。

显然，这个解法中**进栈、出栈、取最小值的时间复杂度都是O(1)，最坏情况空间复杂度是O(n)**。

```java
package com.jimmy.streaming;

import java.util.Stack;

class MinStack{
    private Stack<Integer> mainStack=new Stack<Integer>();
    private Stack<Integer> minStack=new Stack<Integer>();

    /**
     * 入栈
     * @param element 入栈元素
     */
    public void push(int element){
        mainStack.push(element);
        //如果辅助栈为空，或者新元素小于或等于辅助栈栈顶，则将新元素压入辅助栈
        if(minStack.empty() || element<=minStack.peek()){
            minStack.push(element);
        }
    }

    /**
     * 出栈操作
     * @return
     */
    public Integer pop(){
        //如果出栈元素和辅助栈栈顶元素值相等，辅助栈出栈
        if(minStack.peek().equals(mainStack.peek())){
            minStack.pop();
        }
        return mainStack.pop();
    }

    public int getMin() throws Exception {
        if(minStack.empty()){
            throw new Exception("stack is empty");
        }
        return minStack.peek();
    }

    public static void main(String[] args) throws Exception {
        MinStack stack = new MinStack();
        stack.push(4);
        stack.push(9);
        stack.push(7);
        stack.push(3);
        stack.push(8);
        stack.push(5);
        System.out.println(stack.getMin());
        stack.pop();
        stack.pop();
        stack.pop();
        System.out.println(stack.getMin());
    }

}
```

运行结果为：

```
3
4
```

#### 求最大公约数

###### 辗转相除法

辗转相除法， 又名欧几里得算法（Euclidean algorithm），该算法的目的 是求出两个正整数的最大公约数。它是已知最古老的算法， 其产生时间可追溯至公 元前300年前。

这条算法基于一个定理：两个正整数a和b（a>b），它们的最大公约数等于a除 以b的余数c和b之间的最大公约数。

例如10和25，25除以10商2余5，那么10和25的最大公约数，等同于10和5的最 大公约数。

有了这条定理，求最大公约数就变得简单了。我们**可以使用递归的方法把问题逐步简化**。

首先，计算出a除以b的余数c，把问题转化成求b和c的最大公约数；然后计算出 b除以c的余数d，把问题转化成求c和d的最大公约数；再计算出c除以d的余数e，把问题转化成求d和e的最大公约数……

以此类推，**逐渐把两个较大整数之间的运算简化成两个较小整数之间的运算**，**直到两个数可以整除，或者其中一个数减小到1为止**。

辗转相除法的实现代码如下：

```java
package com.jimmy.streaming;

import java.util.Stack;

class Demo2{
    public static int getGreatestCommonDivisorV2(int a,int b){
        int big=a>b ?a:b;
        int small=a<b?a:b;
        if(big%small**0){
            return small;
        }
        return getGreatestCommonDivisorV2(big%small,small);
    }
    public static void main(String[] args) throws Exception {
        System.out.println(getGreatestCommonDivisorV2(25,5));
        System.out.println(getGreatestCommonDivisorV2(100,80));
        System.out.println(getGreatestCommonDivisorV2(27,14));
    }

}
```

运行结果为：

```
5
20
1
```

**这确实是辗转相除法的思路。不过有一个问题，当两个整数较大时，**做a%b取模运算的性能会比较差**。**

###### 更相减损术

可是不取模的话，还能怎么办呢？说到这里，另一个算法就要登场了，它叫作**更相减损术**。

更相减损术，出自中国古代的《九章算术》，也是一种求最大公约数的算法。 古希腊人很聪明，可是我们炎黄子孙也不差。

它的原理更加简单：两个正整数a和b（a>b），它们的**最大公约数等于a-b的差值c和较小数b的最大公约数**。例如10和25，25减10的差是15，那么10和25的最大公约数，等同于10和15的最大公约数。

由此，我们同样可以通过递归来简化问题。首先，计算出a和b的差值c（假设 a>b），把问题转化成求b和c的最大公约数；然后计算出c和b的差值d（假设 c>b），把问题转化成求b和d的最大公约数；再计算出b和d的差值e（假设b>d）， 把问题转化成求d和e的最大公约数……

以此类推，逐渐把两个较大整数之间的运算简化成两个较小整数之间的运算，直到两个数可以相等为止，最大公约数就是最终相等的这两个数的值。

```java
package com.jimmy.streaming;

import java.util.Stack;

class Demo2{
    public static int getGreatestCommonDivisorV3(int a,int b){
        int big=a>b ?a:b;
        int small=a<b?a:b;
        if(big-small**0){
            return small;
        }
        return getGreatestCommonDivisorV3(big-small,small);
    }
    public static void main(String[] args) throws Exception {
        System.out.println(getGreatestCommonDivisorV3(25,5));
        System.out.println(getGreatestCommonDivisorV3(100,80));
        System.out.println(getGreatestCommonDivisorV3(27,14));
    }

}
```

更相减损术的过程就是这样。我们避免了大整数取模可能出现的性能问题，已经越来越接近最优解决方案了。

但是，更相减损术依靠两数求差的方式来递归，**运算次数肯定远大于辗转相除法的取模方式**吧？

能发现问题，看来你进步了。**更相减损术是不稳定的算法，当两数相差悬殊时，如计算10000和1的最大公约数，就要递归9999次！**

###### 两者优势结合

有什么办法可以既避免大整数取模，又能尽可能地减少运算次数呢？

下面就是我要说的最优方法：把辗转相除法和更相减损术的优势结合起来，在更相减损术的基础上使用移位运算。众所周知，**移位运算的性能非常好（代替取模运算）**。对于给出的正整数a和b，不难得到如下的结论。

（从下文开始，获得最大公约数的方法getGreatestCommonDivisor被简写为 gcd。）

1. 当a和b均为偶数时，gcd(a,b) = 2×gcd(a/2, b/2) = 2×gcd(a>>1,b>>1)。
2. 当a为偶数，b为奇数时，gcd(a,b) = gcd(a/2,b) = gcd(a>>1,b)。
3. 当a为奇数，b为偶数时，gcd(a,b) = gcd(a,b/2) = gcd(a,b>>1)。
4. 当a和b均为奇数时，先利用更相减损术运算一次，gcd(a,b) = gcd(b,a-b)，此 时a-b必然是偶数，然后又可以继续进行移位运算。

注：****a>>1等价于a/2,a<<1等价于a*2****

例如计算10和25的最大公约数的步骤如下。

1. 整数10通过移位，可以转换成求5和25的最大公约数。
2. 利用更相减损术，计算出25-5=20，转换成求5和20的最大公约数。
3. 整数20通过移位，可以转换成求5和10的最大公约数。
4. 整数10通过移位，可以转换成求5和5的最大公约数。
5. 利用更相减损术，因为两数相等，所以最大公约数是5。

这种方式在两数都比较小时，可能看不出计算次数的优势；当两数越大时，计算次数的减少就会越明显。

```java
import java.util.Stack;

class Demo2{
    public static int gcd(int a,int b){
        if(a**b){
            return a;
        }
        if((a&1)**0 && (b&1)**0){
            return gcd(a>>1,b>>1) <<1;
        }else if((a&1)**0 && (b&1)!=0){
            return gcd(a>>1,b);
        }else if((a&1)!=0 && (b&1)**0){
            return gcd(a,b>>1);
        }else {
            int big=a>b?a:b;
            int small=a<b?a:b;
            return gcd(big-small,small);
        }
    }
    public static void main(String[] args) throws Exception {
        System.out.println(gcd(25,5));
        System.out.println(gcd(100,80));
        System.out.println(gcd(27,14));
    }

}
```

在上述代码中，判断整数奇偶性的方式是让整数和1进行与运算，如果 (a&1)**0，则说明整数a是偶数；如果(a&1)!=0，则说明整数a是奇数。

让我们来总结一下上述解法的时间复杂度。

1. 暴力枚举法：时间复杂度是O(min(a, b))。
2. 辗转相除法：时间复杂度不太好计算，可以近似为O(log(max(a, b)))， 但是取模运算性能较差。
3. 更相减损术：避免了取模运算，但是算法性能不稳定，最坏时间复杂度为 O(max(a, b))。
4. 更相减损术与移位相结合：不但避免了取模运算，而且算法性能稳定，时间复杂度为O(log(max(a, b)))。



#### 如何判断一个数是否为2的整数次幂

题目

实现一个方法，来**判断一个正整数是否是2的整数次幂**（如16是2的4次方，返回 true；18不是2的整数次幂，则返回false）。要求性能尽可能高。

**方法1：**利用一个整型变量，让它从1开始不断乘以2，将每一次乘2的结果和目标整数进行比较。

我想到了！利用一个整型变量，让它从1开始不断乘以2，将每一次乘2的结果和目标整数进行比较。

创建一个中间变量temp，初始值是1。然后进入一个循环，每次循环都让temp 和目标整数相比较，如果相等，则说明目标整数是2的整数次幂；如果不相等，则让temp增大1倍，继续循环并进行比较。当temp的值大于目标整数时，说明目标整数 不是2的整数次幂。

举个例子。

给出一个整数19，则

1X2 = 2，

2X2 = 4，

4X2 = 8，

8X2 = 16，

16X2 = 32，

由于32>19，所以19不是2的整数次幂。

**如果目标整数的大小是n，则此方法的时间复杂度是O(logn)**。

代码已经写好了，快来看看！

```java
package com.jimmy.streaming;

class Demo2{
    public static boolean isPowerOf(int num){
        int temp=1;
        while (temp<=num){
            if(temp**num){
                return true;
            }
            temp=temp*2;
        }
        return false;
    }

    public static void main(String[] args) {
        System.out.println(isPowerOf(64));
        System.out.println(isPowerOf(30));
    }
}
```

该怎么来提高其性能呢？

可以把之前乘以2的操作改成向左移位，移位的性能比乘法高得多。来看看改变之后的代码吧。

```java
package com.jimmy.streaming;

class Demo2{
    public static boolean isPowerOf(int num){
        int temp=1;
        while (temp<=num){
            if(temp**num){
                return true;
            }
            temp=temp<<1;
        }
        return false;
    }

    public static void main(String[] args) {
        System.out.println(isPowerOf(64));
        System.out.println(isPowerOf(30));
    }
}
```

OK，这样确实有一定优化。但目前算法的**时间复杂度仍然是O(logn)，本质上没有变**。

如何才能在性能上有质的飞跃呢？

把2的整数次幂转换成二进制数，会有什么样的共同点？

让我想想，十进制的2转换成二进制是10B，4转换成二进制是100B，8转化成二进制是1000B……

我知道了！**如果一个整数是2的整数次幂，那么当它转化成二进制时，只有最高位是1，其他位都是0！**
 没错，是这样的。接下来如果把这些2的整数次幂各自减1，再转化成二进制，会有什么样的特点呢？

都减1？让我试试啊！

我发现了，**2的整数次幂一旦减1，它的二进制数字就全部变成了1！**

很好，这时候如果用原数值（2的整数次幂）和它减1的结果进行按位与运算，也就是n&(n-1)，会是什么结果呢？

**0和1按位与运算的结果是0，所以凡是2的整数次幂和它本身减1的结果进行与运算，结果都必定是0**。反之，如果一个整数不是2的整 数次幂，结果一定不是0！

那么，解决这个问题的方法已经很明显了，你说说怎样来判断一个整数是否是2的整数次幂。

很简单，对于一个整数n，只需要计算n&(n-1)的结果是不是0。****这个方法的时间复杂度只有O（1）****。

代码我已经写好了，除方法声明外，只有1行哦！

```java
package com.jimmy.streaming;

class Demo2{
    public static boolean isPowerOf(int num){
        return (num&num-1)**0;
    }

    public static void main(String[] args) {
        System.out.println(isPowerOf(64));
        System.out.println(isPowerOf(30));
    }
}
```

#### 无序数组排序后的最大相邻差

题目

有一个无序整型数组，如何求出该数组排序后的任意两个相邻元素的最大差 值？要求时间和空间复杂度尽可能低。

可能题目有点绕，让我们来看一个例子。

<img src="java数据结构.assets\image-20200501124353845.png" alt="image-20200501124353845" style="zoom:67%;" />

哦，让我想想……

嗨，这还不简单吗？**先使用时间复杂度为O（nlogn）的排序算法给原来的数组排序，然后遍历数组，对每两个相邻元素求差，最大差值不就出来了吗？**

###### 解法1：

使用任意一种时间复杂度为O（nlogn）的排序算法（如快速排序）给原数组排序，然后遍历排好序的数组，并对每两个相邻元素求差，最终得到最大差值。

该解法的时间复杂度是O（nlogn），在不改变原数组的情况下，空间复杂度是 O(n)。

###### 解法2：

这道题很有意思。虽然对数组排序以后肯定能得到正确的结果，但我们**没有必要真的去进行排序**。不排序的话，该怎么办呢？

小灰，你记不记得，有哪些排序算法的时间复杂度是线性的？

好像有计数排序、桶排序，还有个什么基数排序……可你刚才不是说不用排序吗？

别着急，我们仅仅是借助一下这些排序的思想而已。小灰你想一下，**这道题能不能像计数排序一样，利用数组下标来解决？**

像计数排序一样？让我想想啊……

有了！我可以使用计数排序的思想，先找出原数组最大值和最小值的差……，步骤如下：

1. 利用计数排序的思想，先求出原数组的最大值max与最小值min的区间长度k（k=max-min+1），以及偏移量d=min。
2. 创建一个长度为k的新数组Array。
3. 遍历原数组，每遍历一个元素，就把新数组Array对应下标的值+1。例如原数组元素的值为n，则将Array[n-min]的值加1。遍历结束后，Array的一部分元素 值变成了1或更高的数值，一部分元素值仍然是0。
4. 遍历新数组Array，统计出Array中最大连续出现0值的次数+1，即为相邻元素最大差值。

例如给定一个无序数组 { 2, 6, 3, 4, 5, 10, 9 }，处理过程如下图。

第1步，确定k（数组长度）和d（偏移量）。

<img src="java数据结构.assets\image-20200501125015962.png" alt="image-20200501125015962" style="zoom:50%;" />

第2步，创建数组。

<img src="java数据结构.assets\image-20200501125030984.png" alt="image-20200501125030984" style="zoom:50%;" />

第3步，遍历原数组，对号入座。

<img src="java数据结构.assets\image-20200501125055390.png" alt="image-20200501125055390" style="zoom:50%;" />

第4步，判断0值最多连续出现的次数，计算出最大相邻差。

<img src="java数据结构.assets\image-20200501125112533.png" alt="image-20200501125112533" style="zoom:50%;" />

很好，我们已经进步了很多。这个思路在数组元素差值不很悬殊的时候，确实效率很高。

可是设想一下，如果原数组只有3个元素：1、2、1 000000，那就要创建长度是1000 000的数组！想一想还能如何优化？

让我想想啊……

对了！桶排序的思想正好解决了这个问题！

###### 解法3：

利用桶排序的思想，根据原数组的长度n，创建出n个桶，每一个桶代表一个区间范围。其中第1个桶从原数组的最小值min开始，区间跨度是（max-min）/（n-1）。

遍历原数组，把原数组每一个元素插入到对应的桶中																																																																																																																																																																																																																																																										，记录每一个桶的最大和最小值。

遍历所有的桶，统计出每一个桶的最大值，和这个桶右侧非空桶的最小值的差，数值最大的差即为原数组排序后的相邻最大差值。

例如给出一个无序数组 { 2, 6, 3, 4, 5, 10, 9 }，处理过程如下图。

第1步，根据原数组，创建桶，确定每个桶的区间范围。

<img src="java数据结构.assets\image-20200501125654900.png" alt="image-20200501125654900" style="zoom:50%;" />

第2步，遍历原数组，确定每个桶内的最大和最小值。

<img src="java数据结构.assets\image-20200501135101103.png" alt="image-20200501135101103" style="zoom: 67%;" />

第3步，遍历所有的桶，找出最大相邻差。

<img src="java数据结构.assets\image-20200501135122384.png" alt="image-20200501135122384" style="zoom:67%;" />

这个方法不需要像标准桶排序那样给每一个桶内部进行排序，**只需要记录桶内的最大和最小值即可，所以时间复杂度稳定在O(n)**。

很好，让我们来写一下代码吧。

```java
package com.jimmy.streaming;

class Demo2{
    private static int getMaxSortedDistance(int[] array){
        //1.得到数列的最大值和最小值
        int max=array[0];
        int min=array[0];
        for(int i=1;i<array.length;i++){
            if(max<array[i]){
                max=array[i];
            }
            if(min>array[i]){
                min=array[i];
            }
        }
        int d=max-min;
        //如果max 和min 相等，说明数组所有元素都相等，返回0
        if(d**0){
            return 0;
        }

        //2.初始化桶
        int bucketNum=array.length;
        Bucket[] buckets=new Bucket[bucketNum];
        for(int i=0;i<bucketNum;i++){
            buckets[i]=new Bucket();
        }

        //3.遍历原始数组，确定每个桶的最大最小值
        for(int i=0;i<array.length;i++){
            //确定数组元素所归属的桶下标
            int index=((array[i]-min)*(bucketNum-1)/d);
            if(buckets[index].min**null || buckets[index].min>array[i]){
                buckets[index].min=array[i];
            }
            if(buckets[index].max**null || buckets[index].max<array[i]){
                buckets[index].max=array[i];
            }
        }

        //4.遍历桶，找到最大差值
        int leftMax=buckets[0].max;
        int maxDistance=0;
        for(int i=0;i<buckets.length;i++){
            if(buckets[i].min**null){
                continue;
            }
            if(buckets[i].min-leftMax>maxDistance){
                maxDistance=buckets[i].min-leftMax;
            }
            leftMax=buckets[i].max;
        }
        return maxDistance;
    }

    private static class Bucket{
        Integer max;
        Integer min;
    }
    public static void main(String[] args) {
        int[] array = new int[] {2,6,3,4,5,10,9};
        System.out.println(getMaxSortedDistance(array));
    }
}
```

运行结果为：

```
3
```

代码的前几步都比较直观，唯独第4步稍微有些不好理解：使用临时变量leftMax，在每一轮迭代时存储当前左侧桶的最大值。而两个桶之间的差值，则是buckets[i].minleftMax。

#### 如何用栈实现队列

题目: **用栈来模拟一个队列，要求实现队列的两个基本操作：入队、出队**。

哦……栈是先入后出，队列是先入先出，用栈没办法实现队列吧？

提示你一下，用一个栈肯定是没办法实现队列的，但如果我们有两个栈呢？

我们先来回顾一下栈和队列的不同特点。

栈的特点是先入后出，出入元素都是在同一端（栈顶）。

入栈：

<img src="java数据结构.assets\image-20200501150608994.png" alt="image-20200501150608994" style="zoom: 50%;" />

出栈：

<img src="java数据结构.assets\image-20200501150624650.png" alt="image-20200501150624650" style="zoom:50%;" />

队列的特点是先入先出，出入元素是在不同的两端（队头和队尾）。

入队：

<img src="java数据结构.assets\image-20200501150635866.png" alt="image-20200501150635866" style="zoom:50%;" />

出队：

<img src="java数据结构.assets\image-20200501150644898.png" alt="image-20200501150644898" style="zoom:50%;" />

既然我们拥有两个栈，那么可以让其中一个栈作为队列的入口，负责插入新元 素；另一个栈作为队列的出口，负责移除老元素。

可是，两个栈是各自独立的，怎么能把它们有效地关联起来呢？

别着急，让我来具体演示一下。

队列的主要操作无非有两个：入队和出队。

在模拟入队操作时，每一个新元素都被压入到栈A当中。

让元素1入队。

<img src="java数据结构.assets\image-20200501150701011.png" alt="image-20200501150701011" style="zoom:50%;" />

让元素2入队。

<img src="java数据结构.assets\image-20200501150712117.png" alt="image-20200501150712117" style="zoom: 50%;" />

让元素3入队。

<img src="java数据结构.assets\image-20200501150725815.png" alt="image-20200501150725815" style="zoom:50%;" />

这时，我们希望最先入队的元素1出队，需要怎么做呢？

让栈A中的所有元素按顺序出栈，再按照出栈顺序压入栈B。这样一来，元素从栈A弹出并压入栈B的顺序是3、2、1，和当初进入栈A的顺序1、2、3是相反的。

<img src="java数据结构.assets\image-20200501150753440.png" alt="image-20200501150753440" style="zoom:50%;" />

此时让元素1 出队，也就是让元素1从栈B中弹出。

<img src="java数据结构.assets\image-20200501150825551.png" alt="image-20200501150825551" style="zoom:50%;" />

让元素2出队。

<img src="java数据结构.assets\image-20200501150835344.png" alt="image-20200501150835344" style="zoom:50%;" />

如果这个时候又想做入队操作了呢？

很简单，当有新元素入队时，重新把新元素压入栈A。

让元素4入队。

<img src="java数据结构.assets\image-20200501150912610.png" alt="image-20200501150912610" style="zoom:50%;" />

此时出队操作仍然从栈B中弹出元素。让元素3出队。

<img src="java数据结构.assets\image-20200501150928325.png" alt="image-20200501150928325" style="zoom:50%;" />

现在**栈B已经空了，如果再想出队该怎么办**呢？

也不难，**只要栈A中还有元素，就像刚才一样，把栈A中的元素弹出并压入栈B即可**。

<img src="java数据结构.assets\image-20200501151014655.png" alt="image-20200501151014655" style="zoom:50%;" />

让元素4出队。

<img src="java数据结构.assets\image-20200501151002961.png" alt="image-20200501151002961" style="zoom:50%;" />

怎么样，这回你绕明白了吗？

哦，基本上明白了，那么代码怎么来实现呢

```java
import java.util.Stack;

class Demo{
    static class StackAndQueue{
        private static Stack<Integer> stackA=new Stack<Integer>();
        private static Stack<Integer> stackB=new Stack<Integer>();

        /**
         * 入队操作
         * @param element
         */
        private static void enQueue(int element){
            stackA.push(element);
        }

        /**
         * 出队操作
         * @return
         */
        private static Integer deQueue() {
            if (stackB.empty()) {
                if(stackA.empty()){
                    return null;
                }
                while (!stackA.empty()) {
                    stackB.push(stackA.pop());
                }
            }
            return stackB.pop();
        }
    }
    public static void main(String[] args) {
        StackAndQueue sdq=new StackAndQueue();
        sdq.enQueue(34);
        sdq.enQueue(31);
        sdq.enQueue(46);
        sdq.enQueue(18);
        System.out.println(sdq.deQueue());
        System.out.println(sdq.deQueue());
        System.out.println(sdq.deQueue());
    }
}
```

运行结果为：

```
34
31
46
```

**入队操作的时间复杂度显然是O(1)**。

至于出队操作，如果涉及栈A和栈B的元素迁移，那么一次出队的时间复杂度是O(n)；如果不用迁移，时间复杂度是O(1)。咦，在这种情况下，出队的时间复杂度究竟应该是多少呢？

这里涉及一个新的概念，叫作**均摊时间复杂度**。需要元素迁移的**出队操作只有少数情况**，并且不可能连续出现，其后的大多数出队 操作都不需要元素迁移。

所以把时间均摊到每一次出队操作上面，其时间复杂度是O(1)。这个概念并不常用，稍做了解即可。

#### 寻找全排列的下一个数

题目： **给出一个正整数，找出这个正整数所有数字全排列的下一个数**。

说通俗点就是**在一个整数所包含数字的全部组合中，找到一个大于且仅大于原 数的新整数**。让我们举几个例子。

如果输入12345，则返回12354。

如果输入12354，则返回12435。

如果输入12435，则返回12453。

给出方法之前，先思考一个问题：由固定几个数字组成的整数，怎样排列最大？怎样排列最小？

让我想一想啊……

知道了，**如果是固定的几个数字，应该是在逆序排列的情况下最大，在顺序排列的情况下最小。**

举一个例子。

给出1、2、3、4、5这几个数字。

- 最大的组合：54321。
- 最小的组合：12345。


没错，**数字的顺序和逆序，是全排列中的两种极端情况。那么普遍情况下，一个数和它最近的全排列数存在什么关联呢？**

例如给出整数12354，它包含的数字是1、2、3、4、5，如何找到这些数字全排列之后仅大于原数的新整数呢？

为了和原数接近，我们****需要尽量保持高位不变，低位在最小的范围内变换顺序****。

**至于变换顺序的范围大小，则取决于当前整数的逆序区域。**

<img src="java数据结构.assets\image-20200501154401399.png" alt="image-20200501154401399" style="zoom:50%;" />

如图所示，12354的逆序区域是最后两位，仅看这两位已经是当前的最大组合。 若想最接近原数，又比原数更大，必须从倒数第3位开始改变。

怎样改变呢？12345的倒数第3位是3，我们需要从后面的逆序区域中找到大于3的最小的数字，让其和3的位置进行互换。

<img src="java数据结构.assets\image-20200501155459547.png" alt="image-20200501155459547" style="zoom:50%;" />

互换后的临时结果是12453，倒数第3位已经确定，这个时候最后两位仍然是逆序状态。我们需要把最后两位转变为顺序状态，以此保证在倒数第3位数值为4的情况下，后两位尽可能小。

<img src="java数据结构.assets\image-20200501155512501.png" alt="image-20200501155512501" style="zoom:50%;" />

这样一来，就得到了想要的结果12435。

**获得全排列下一个数的只需要3个步骤**。

1. 从后向前查看逆序区域，**找到逆序区域的前一位**，也就是数字置换的边界。
2. **让逆序区域的前一位和逆序区域中大于它的最小的数字交换位置**。
3. 把**原来的逆序区域转为顺序状态**。

最后让我们用代码来实现一下。这里为了方便数字位置的交换，入参和返回值的类型都采用了整型数组。

```java
package com.jimmy.streaming;

import java.util.Arrays;

class Demo{
    private static int[] findNearestNumber(int[] numbers){
        //1. 从后向前查看逆序区域，找到逆序区域的前一位，也就是数字置换的边界
        int index=findTransferPoint(numbers);
        // 如果数字置换边界是0，说明整个数组已经逆序，无法得到更大的相同数
        // 字组成的整数，返回null
        if(index**0){
            return null;
        }
        //2.把逆序区域的前一位和逆序区域中刚刚大于它的数字交换位置
        //复制并入参，避免直接修改入参
        int[]numbersCopy= Arrays.copyOf(numbers,numbers.length);
        exchangeHead(numbersCopy,index);

        //3.把原来的逆序区域转为顺序
        reverse(numbersCopy,index);
        return numbersCopy;
    }
    private static int findTransferPoint(int[] numbers){
        for(int i=numbers.length-1;i>0;i--){
            if(numbers[i]>numbers[i-1]){
                return i;
            }
        }
        return 0;
    }

    private static int[]exchangeHead(int []numbers,int index)
    {
        int head=numbers[index-1];
        for(int i=numbers.length-1;i>0;i--){
            if(head<numbers[i]){
                numbers[index-1]=numbers[i];
                numbers[i]=head;
                break;

            }
        }
        return numbers;
    }
    private static int[] reverse(int[]num,int index){
        for(int i=index,j=num.length-1;i<j;i++,j--){
            int temp=num[i];
            num[i]=num[j];
            num[j]=temp;
        }
        return num;
    }
    public static void main(String[] args) {
        int[] numbers = {1,2,3,4,5};
        //打印12345 之后的10个全排列整数
        for(int i=0;i<10;i++)
        {
            numbers=findNearestNumber(numbers);
            for(int j:numbers){
                System.out.print(j);
            }
            System.out.println();
        }
    }
}
```

运行结果为：

```
12354
12435
12453
12534
12543
13245
13254
13425
13452
13524
```

这种解法拥有一个“高大上”的名字：字典序算法。

小灰，你说说这个解法的时间复杂度是多少？

该算法3个步骤每一步的时间复杂度都是O(n)，所以**整体时间复杂度也是O(n)**！

## HashMap的底层数据结构

众所周知，HashMap是一个用于存储Key-Value键值对的集合，每一个键值对也叫做**Entry**。这些个键值对（Entry）分散存储在一个数组当中，这个数组就是HashMap的主干。

HashMap数组每一个元素的初始值都是Null。

![img](java数据结构.assets/640-1587484198865.jpg)

对于HashMap，我们最常使用的是两个方法：**Get** 和 **Put**。

**1.Put方法的原理**

调用Put方法的时候发生了什么呢？

比如调用 hashMap.put("apple", 0) ，插入一个Key为“apple"的元素。这时候我们需要利用一个哈希函数来确定Entry的插入位置（index）：

**index = Hash（“apple”）**

假定最后计算出的index是2，那么结果如下：

![img](java数据结构.assets/640-1587484198926.png)

但是，因为HashMap的长度是有限的，当插入的Entry越来越多时，再完美的Hash函数也难免会出现index冲突的情况。比如下面这样：

![img](java数据结构.assets/640-1587484198866.png)

这时候该怎么办呢？我们可以利用**链表**来解决。

HashMap数组的每一个元素不止是一个Entry对象，也是一个链表的头节点。每一个Entry对象通过Next指针指向它的下一个Entry节点。当新来的Entry映射到冲突的数组位置时，只需要插入到对应的链表即可：



![img](java数据结构.assets/640-1587484198896.png)

需要注意的是，新来的Entry节点插入链表时，使用的是“头插法”。至于为什么不插入链表尾部，后面会有解释。

2.Get方法的原理

使用Get方法根据Key来查找Value的时候，发生了什么呢？

首先会把输入的Key做一次Hash映射，得到对应的index：

**index = Hash（“apple”）**

由于刚才所说的Hash冲突，同一个位置有可能匹配到多个Entry，这时候就需要顺着对应链表的头节点，一个一个向下来查找。假设我们要查找的Key是“apple”：

![img](java数据结构.assets/640-1587484198926.jpg)

第一步，我们查看的是头节点Entry6，Entry6的Key是banana，显然不是我们要找的结果。

第二步，我们查看的是Next节点Entry1，Entry1的Key是apple，正是我们要找的结果。

之所以把Entry6放在头节点，是因为HashMap的发明者认为，**后插入的Entry被查找的可能性更大**。

![img](java数据结构.assets/640-1587484198784.jpg)

![img](java数据结构.assets/640-1587484198786.jpg)

![img](java数据结构.assets/640-1587484198790.jpg)

![img](java数据结构.assets/640-1587484198797.jpg)

![img](java数据结构.assets/640-1587484198804.jpg)





![img](java数据结构.assets/640.jpg)





![img](java数据结构.assets/640-1587484198814.jpg)





![img](https://mmbiz.qpic.cn/mmbiz_jpg/NtO5sialJZGoXt6UNkvyibQ8ufeF48pvm2ial1Nlu9LvrJlcyIgsGKqOMib1DhB6hKNvKPicYmnBsCAJeQdCibBADJWQ/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)





![img](java数据结构.assets/640-1587484198835.jpg)





![img](java数据结构.assets/640-1587484198866.jpg)





————————————





![img](java数据结构.assets/640-1587484198895.jpg)









![img](java数据结构.assets/640-1587484198982.jpg)





![img](java数据结构.assets/640-1587484198983.jpg)







之前说过，从Key映射到HashMap数组的对应位置，会用到一个Hash函数：

**index = Hash（“apple”）**

如何实现一个尽量均匀分布的Hash函数呢？我们通过利用Key的HashCode值来做某种运算。



![img](java数据结构.assets/640-1587484198984.jpg)

**index = HashCode（\**Key\**） % Length ?**

如何进行位运算呢？有如下的公式（Length是HashMap的长度）：

**index = HashCode（\**Key\**） & （\**Length\** - 1）** 

下面我们以值为“book”的Key来演示整个过程：

1.计算book的hashcode，结果为十进制的3029737，二进制的101110001110101110 1001。

2.假定HashMap长度是默认的16，计算Length-1的结果为十进制的15，二进制的1111。

3.把以上两个结果做**与运算**，101110001110101110 1001 & 1111 = 1001，十进制是9，所以 index=9。

可以说，Hash算法最终得到的index结果，完全取决于Key的Hashcode值的最后几位。

![img](java数据结构.assets/640-1587484198985.jpg)





假设HashMap的长度是10，重复刚才的运算步骤：

![img](java数据结构.assets/640-1587484198951.jpg)

单独看这个结果，表面上并没有问题。我们再来尝试一个新的HashCode 101110001110101110 **1011** ：

![img](java数据结构.assets/640-1587484198949.png)

让我们再换一个HashCode 101110001110101110 **1111** 试试 ：

![img](java数据结构.assets/640-1587484199024.jpg)

是的，虽然HashCode的倒数第二第三位从0变成了1，但是运算的结果都是1001。也就是说，当HashMap长度为10的时候，有些index结果的出现几率会更大，而有些index结果永远不会出现（比如0111）！

这样显然不符合Hash算法均匀分布的原则。

反观长度16或者其他2的幂，Length-1的值是所有二进制位全为1，这种情况下，index的结果等同于HashCode后几位的值。只要输入的HashCode本身分布均匀，Hash算法的结果就是均匀的。





![img](java数据结构.assets/640-1587484198986.jpg)

## 小灰算法学习网址

http://www.likecs.com/default/index/show?id=78169