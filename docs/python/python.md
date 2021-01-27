## python基础

### 基础

打印：

```python
print("")
print("hello \n world")  #换行
```

连接符+：

```python
name="yoy"
print("hello"+name)
```

格式化输出：

```python
name="yoy"
age=26
print("%s is %d years old " %(name,age))
```

用户输入`input`：

```python
name = input("input your name:")
print ("My name is:"+name)
```

注释：

```python
##   单行注释
'''
  multi   多行注释
'''

快捷键： ctrl+/
```

缩进：`Tab`键，取消缩进：`shif+Tab`

![image-20200919205510974](python.assets/image-20200919205510974.png)

编码声明（一定要在第一行#开头）：

```python
##  coding=utf-8
##  coding:utf-8
##  -*- coding:utf-8 -*-
```

脚本注意事项：

```python
脚本后缀是.py
    脚本名称最好用字母、数字、_（下划线）组成（字母开头）
    脚本命名不要与python模块、函数名称重复，如：selenium
    千万不要有中文、空格，特殊字母，命名要规范
```

`python`程序入口：

```python
if __name__ == '__main__':
程序入口：
"""
对于很多编程语言来说，程序都必须要有一个入口，比如C，C++，以及完全面向对象的编程语言Java，C#等。如果你接触过这些语言，对于程序入口这个概念应该很好理解，C，C++都需要有一个main函数作为程序的入口，也就是程序的运行会从main函数开始。同样，Java，C#必须要有一个包含Main方法的主类，作为程序入口。

而Python则不同，它属于脚本语言，不像编译型语言那样先将程序编译成二进制再运行，而是动态的逐行解释运行。也就是从脚本第一行开始运行，没有统一的入口。

一个Python源码文件（.py）除了可以被直接运行外，还可以作为模块（也就是库），被其他.py文件导入。不管是直接运行还是被导入，.py文件的最顶层代码都会被运行（Python用缩进来区分代码层次），而当一个.py文件作为模块被导入时，我们可能不希望一部分代码被运行。
"""
```

交换值小例子：

```python
a=11
b=12

t=a
a=b
b=t
print("a:"+str(a)+"\nb:"+str(b))
```

练习题：

用`python`写一个猜数字的游戏，游戏规则如下：

1.由一个人随机写一个整数`1-99`（如：`21`）

2.一群小伙伴轮流猜数字，如第一个人猜一个数（如：`48`），

  则缩小范围为（`1-48`）

3.如第二个人猜一个数（如：`9`），则缩小范围为（`9-48`）

4.以此类推，值到猜中数字（`21`），游戏结束

实现效果如下：

![image-20200919211912499](python.assets/image-20200919211912499.png)

![image-20200919214310471](python.assets/image-20200919214310471.png)

```python
TrueValue=int(input("请输入一个1到99整数："))
guessValue=int(input("请猜一个1到99的整数："))
minN=1
maxN=99
while(True):
    if(guessValue<TrueValue):
        print("太小了")
        minN=guessValue
        guessValue=int(input("请猜一个%d到%d之间的整数："%(minN,maxN)))
    elif(guessValue>TrueValue):
        print("太大了")
        maxN=guessValue
        guessValue=int(input("请猜一个%d到%d之间的整数："%(minN,maxN)))
    else:
        break
```

### 数据类型

#### 变量赋值

```python
#!/usr/bin/python
## -*- coding: UTF-8 -*-
 
counter = 100 ## 赋值整型变量
miles = 1000.0 ## 浮点型
name = "John" ## 字符串
 
print counter
print miles
print name
```

计算1-10的整数求和

```python
## coding:utf-8
b = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
s = 0
for i in b:
	s = s + i
	print(s)
```

#### 多个变量赋值

```python
a = b = c = 1
a, b, c = 1, 2, "john"
```

#### 标准数据类型

`Python`有五个标准的数据类型：

- `Numbers`（数字）
  - `Python`支持四种不同的数字类型：
    - `int`（有符号整型）
    - `long`（长整型[也可以代表八进制和十六进制]）
    - `float`（浮点型）
    - `complex`（复数）
- `String`（字符串）
- `List`（列表）
- `Tuple`（元组）
- `Dictionary`（字典）

`Python3` 的六个标准数据类型中：

- **不可变数据（3 个）：**`Number`（数字）、`String`（字符串）、`Tuple`（元组）；
- **可变数据（3 个）：**`List`（列表）、`Dictionary`（字典）、`Set`（集合）。

**不可改变的数据类型，这意味着改变数字数据类型会分配一个新的对象**

##### python数字

内置的 `type()` 函数可以用来查询变量所指的对象类型。

```python
>>> a, b, c, d = 20, 5.5, True, 4+3j
>>> print(type(a), type(b), type(c), type(d))
<class 'int'> <class 'float'> <class 'bool'> <class 'complex'>
```

可以使用`isinstance`来判断数据类型：

```python
>>> a = 111
>>> isinstance(a, int)
True
>>> 
```

`isinstance` 和 `type` 的区别在于：

- `type()`不会认为子类是一种父类类型。
- `isinstance()`会认为子类是一种父类类型。

```python
>>> class A:
...     pass
... 
>>> class B(A):
...     pass
... 
>>> isinstance(A(), A)
True
>>> type(A()) == A 
True
>>> isinstance(B(), A)
True
>>> type(B()) == A
False
```

您也可以使用`del`语句删除一些对象的引用。

`del`语句的语法是：

```python
del var1[,var2[,var3[....,varN]]]
```

您可以通过使用`del`语句删除单个或多个对象的引用。例如：

```python
del var
del var_a, var_b
```

数值运算：

```python
>>> 5 + 4  ## 加法
9
>>> 4.3 - 2 ## 减法
2.3
>>> 3 * 7  ## 乘法
21
>>> 2 / 4  ## 除法，得到一个浮点数
0.5
>>> 2 // 4 ## 除法，得到一个整数
0
>>> 17 % 3 ## 取余 
2
>>> 2 ** 5 ## 乘方
32

注意：
1、数值的除法包含两个运算符：/ 返回一个浮点数，// 返回一个整数。
2、在混合计算时，Python会把整型转换成为浮点数。
```

##### String（字符串）

`Python`中的字符串用单引号 **'** 或双引号 **"** 括起来，同时使用反斜杠\ 转义特殊字符。

字符串的截取的语法格式如下：

```python
变量[头下标:尾下标]
```

索引值以 `0` 为开始值，`-1` 为从末尾的开始位置。

![img](python.assets/o99aU.png)

字符串操作：

```python
#!/usr/bin/python3

str = 'Runoob'

print (str)          ## 输出字符串
print (str[0:-1])    ## 输出第一个到倒数第二个的所有字符
print (str[0])       ## 输出字符串第一个字符
print (str[2:5])     ## 输出从第三个开始到第五个的字符
print (str[2:])      ## 输出从第三个开始的后的所有字符
print (str * 2)      ## 输出字符串两次，也可以写成 print (2 * str) 
print (str + "TEST") ## 连接字符串
```

`Python` 使用反斜杠 `\` 转义特殊字符，如果你**不想让反斜杠发生转义，可以在字符串前面添加一个 `r`**，表示原始字符串：

```python
>>> print('Ru\noob')
Ru
oob
>>> print(r'Ru\noob')
Ru\noob
```

另外，反斜杠`\`可以作为**续行符**，表示下一行是上一行的延续。也**可以使用 """...""" 或者 '''...''' 跨越多行**。

注意，`Python` 没有单独的字符类型，一个字符就是长度为`1`的字符串。

```python
>>> word = 'Python'
>>> print(word[0], word[5])
P n
>>> print(word[-1], word[-6])
n P
```

与 `C` 字符串不同的是，`Python` 字符串不能被改变。向一个索引位置赋值，比如`word[0] = 'm'`会导致错误。

在 `Python` 中，**字符串格式化**使用与 `C` 中 `sprintf` 函数一样的语法。

```python
print ("我叫 %s 今年 %d 岁!" % ('小明', 10))
```

| %c   | 格式化字符及其ASCII码                |
| ---- | ------------------------------------ |
| %s   | 格式化字符串                         |
| %d   | 格式化整数                           |
| %u   | 格式化无符号整型                     |
| %o   | 格式化无符号八进制数                 |
| %x   | 格式化无符号十六进制数               |
| %X   | 格式化无符号十六进制数（大写）       |
| %f   | 格式化浮点数字，可指定小数点后的精度 |
| %e   | 用科学计数法格式化浮点数             |
| %E   | 作用同%e，用科学计数法格式化浮点数   |
| %g   | %f和%e的简写                         |
| %G   | %f 和 %E 的简写                      |
| %p   | 用十六进制数格式化变量的地址         |

`Python2.6` 开始，新增了一种**格式化字符串的函数 [str.format()](https://www.runoob.com/python/att-string-format.html)**，它增强了字符串格式化的功能。

`format`函数可以不限个参数，位置不按顺序：

```python
>>>"{} {}".format("hello", "world")    ## 不设置指定位置，按默认顺序
'hello world'
 
>>> "{0} {1}".format("hello", "world")  ## 设置指定位置
'hello world'
 
>>> "{1} {0} {1}".format("hello", "world")  ## 设置指定位置
'world hello world'
```

也可以设置参数，通过字典或列表等来设置参数：

```python
#!/usr/bin/python
## -*- coding: UTF-8 -*-
 
print("网站名：{name}, 地址 {url}".format(name="菜鸟教程", url="www.runoob.com"))
 
## 通过字典设置参数
site = {"name": "菜鸟教程", "url": "www.runoob.com"}
print("网站名：{name}, 地址 {url}".format(**site))
 
## 通过列表索引设置参数
my_list = ['菜鸟教程', 'www.runoob.com']
print("网站名：{0[0]}, 地址 {0[1]}".format(my_list))  ## "0" 是必须的
```

数字格式化：

下表展示了 `str.format()` 格式化数字的多种方法：

```python
>>> print("{:.2f}".format(3.1415926));
3.14
```

| 数字       | 格式                                                         | 输出                   | 描述                         |
| :--------- | :----------------------------------------------------------- | :--------------------- | :--------------------------- |
| 3.1415926  | {:.2f}                                                       | 3.14                   | 保留小数点后两位             |
| 3.1415926  | {:+.2f}                                                      | +3.14                  | 带符号保留小数点后两位       |
| -1         | {:+.2f}                                                      | -1.00                  | 带符号保留小数点后两位       |
| 2.71828    | {:.0f}                                                       | 3                      | 不带小数                     |
| 5          | {:0>2d}                                                      | 05                     | 数字补零 (填充左边, 宽度为2) |
| 5          | {:x<4d}                                                      | 5xxx                   | 数字补x (填充右边, 宽度为4)  |
| 10         | {:x<4d}                                                      | 10xx                   | 数字补x (填充右边, 宽度为4)  |
| 1000000    | {:,}                                                         | 1,000,000              | 以逗号分隔的数字格式         |
| 0.25       | {:.2%}                                                       | 25.00%                 | 百分比格式                   |
| 1000000000 | {:.2e}                                                       | 1.00e+09               | 指数记法                     |
| 13         | {:>10d}                                                      | 13                     | 右对齐 (默认, 宽度为10)      |
| 13         | {:<10d}                                                      | 13                     | 左对齐 (宽度为10)            |
| 13         | {:^10d}                                                      | 13                     | 中间对齐 (宽度为10)          |
| 11         | `'{:b}'.format(11) '{:d}'.format(11) '{:o}'.format(11) '{:x}'.format(11) '{:#x}'.format(11) '{:#X}'.format(11)` | `1011 11 13 b 0xb 0XB` | 进制                         |

**f-string：**

`f-string` 是 `python3.6` 之后版本添加的，称之为字面量格式化字符串，是新的格式化字符串的语法。

之前我们习惯用百分号 (%):

```python
>>> name = 'Runoob'
>>> 'Hello %s' % name
'Hello Runoob' 
```

`f-string` 格式化字符串以 `f` 开头，后面跟着字符串，字符串中的表达式用大括号 `{}` 包起来，它会将变量或表达式计算后的值替换进去，实例如下：

```python
>>> name = 'Runoob'
>>> f'Hello {name}'  ## 替换变量

>>> f'{1+2}'         ## 使用表达式
'3'

>>> w = {'name': 'Runoob', 'url': 'www.runoob.com'}
>>> f'{w["name"]}: {w["url"]}'
'Runoob: www.runoob.com'
```

用了这种方式明显更简单了，不用再去判断使用 `%s`，还是 `%d`。

**字符串其它函数：**

```python
isdigit()	是否包含数字，返回bool值
lower() upper()
len() 长度
replace(old,new)
find(str,start,end)   检测str是否包含在字符串中，若包含则返回开始的索引值，否则返回-1
join(seq)   以指定字符串作为分隔符，将 seq 中所有的元素(的字符串表示)合并为一个新的字符串
split(str="")     以 str 为分隔符截取字符串
```



##### List（列表）

`List`（列表） 是 `Python` 中使用最频繁的数据类型。

列表可以完成大多数集合类的数据结构实现。列表中元素的**类型可以不相同**，它支持数字，字符串甚至可以包含列表（所谓嵌套）。

列表是写在方括号 **[]** 之间、用逗号分隔开的元素列表。

和字符串一样，列表同样可以被索引和截取，列表被截取后返回一个包含所需元素的新列表。

列表截取的语法格式如下：

```
变量[头下标:尾下标]
```

索引值以 `0` 为开始值，`-1` 为从末尾的开始位置。

![img](python.assets/list_slicing1.png)

加号 **+** 是列表连接运算符，星号 ***** 是重复操作。如下实例：

```python
#!/usr/bin/python3

list = [ 'abcd', 786 , 2.23, 'runoob', 70.2 ]
tinylist = [123, 'runoob']

print (list)            ## 输出完整列表
print (list[0])         ## 输出列表第一个元素
print (list[1:3])       ## 从第二个开始输出到第三个元素
print (list[2:])        ## 输出从第三个元素开始的所有元素
>>>print (tinylist * 2)    ## 输出两次列表
[123, 'runoob', 123, 'runoob']
>>>print (list + tinylist) ## 连接列表
['abcd', 786, 2.23, 'runoob', 70.2, 123, 'runoob']
```

与`Python`字符串不一样的是，列表中的元素是可以改变的：

```python
>>> a = [1, 2, 3, 4, 5, 6]
>>> a[0] = 9
>>> a[2:5] = [13, 14, 15]
>>> a
[9, 2, 13, 14, 15, 6]
>>> a[2:5] = []   ## 将对应的元素值设置为 [] 
>>> a
[9, 2, 6]
```

小结：

- 1、`List`写在方括号之间，元素用逗号隔开。
- 2、和字符串一样，`list`可以被索引和切片。
- 3、`List`可以使用`+`操作符进行拼接。
- 4、`List`中的元素是可以改变的。

`Python` 列表截取可以接收第三个参数，参数作用是**截取的步长**，以下实例在索引 `1` 到索引 `4` 的位置并设置为步长为 `2`（间隔一个位置）来截取字符串：

![img](python.assets/python_list_slice_2.png)

如果第三个参数为负数表示逆向读取，以下实例用于翻转字符串：

```python
def reverseWords(input): 
      
    ## 通过空格将字符串分隔符，把各个单词分隔为 列表
    inputWords = input.split(" ")    

    ## 翻转字符串
    ## 假设列表 list = [1,2,3,4],  
    ## list[0]=1, list[1]=2 ，而 -1 表示最后一个元素 list[-1]=4 ( 与 list[3]=4 一样) 
    ## inputWords[-1::-1] 有三个参数
    ## 第一个参数 -1 表示最后一个元素
    ## 第二个参数为空，表示移动到列表末尾
    ## 第三个参数为步长，-1 表示逆向
    inputWords=inputWords[-1::-1] 

    ## 重新组合字符串
    output = ' '.join(inputWords) 
      
    return output 
  
if __name__ == "__main__": 
    input = 'I like runoob'
    rw = reverseWords(input) 
    print(rw)
```

可以使用 `del` 语句来**删除列表的的元素:**

```python
del list[2]
```

列表的其它函数：

```python
len(list)  列表元素个数
max(list) min(list)  最大最小值
list(seq) 将元组转换为列表


list.append(obj)   在列表末尾添加新的对象
list.count(obj)    统计某个元素在列表中出现的次数
list.extend(seq)   在列表末尾一次性追加另一个序列中的多个值（用新列表扩展原来的列表）
list.index(obj)    从列表中找出某个值第一个匹配项的索引位置
list.insert(index, obj)   将对象插入列表

list.pop([index=-1])   移除列表中的一个元素（默认最后一个元素），并且返回该元素的值
list.remove(obj)      移除列表中某个值的第一个匹配项

list.reverse()     反向列表中元素
list.clear()     清空列表
list.sort( key=None, reverse=False)  对原列表进行排序

list.copy()   复制列表   复制一个副本，原值和新复制的变量互不影响！！！ 但如果是用=号来直接复制，会影响，如list1=list2
```





##### Tuple（元组）

元组（`tuple`）与列表类似，不同之处在于**元组的元素不能修改**。元组写在小括号 **()** 里，元素之间用逗号隔开。

元组中的元素类型也可以不相同：

```python
#!/usr/bin/python3

tuple = ( 'abcd', 786 , 2.23, 'runoob', 70.2  )
tinytuple = (123, 'runoob')

print (tuple)             ## 输出完整元组
print (tuple[0])          ## 输出元组的第一个元素
print (tuple[1:3])        ## 输出从第二个元素开始到第三个元素
print (tuple[2:])         ## 输出从第三个元素开始的所有元素
print (tinytuple * 2)     ## 输出两次元组
print (tuple + tinytuple) ## 连接元组
```

元组与字符串类似，可以被索引且下标索引从0开始，-1 为从末尾开始的位置。也可以进行截取（看上面，这里不再赘述）。

其实，**可以把字符串看作一种特殊的元组**。

![image-20200921110914247](python.assets/image-20200921110914247.png)

虽然`tuple`的元素不可改变，但它**可以包含可变的对象**，比如`list`列表。

构造包含 `0` 个或 `1` 个元素的元组比较特殊，所以有一些额外的语法规则：

```
tup1 = ()    ## 空元组
tup2 = (20,) ## 一个元素，需要在元素后添加逗号
```

**`string`、`list` 和 `tuple` 都属于 `sequence`（序列）。**

**注意：**

- 1、与字符串一样，元组的元素不能修改。
- 2、元组也可以被索引和切片，方法一样。
- 3、注意构造包含 `0` 或 `1` 个元素的元组的特殊语法规则。
- 4、元组也可以使用`+`操作符进行拼接。

**元组中的元素值是不允许删除的**，但我们可以使用del语句来删除整个元组。

```python
del tup
```



##### Set（集合）

集合（`set`）是由一个或数个形态各异的大小整体组成的，构成集合的事物或对象称作元素或是成员，**是一个无序不重复序列**。

**基本功能是进行成员关系测试和删除重复元素。**

可以使用大括号 **{ }** 或者 **set()** 函数创建集合，注意：创建一个空集合必须用 **set()** 而不是 **{ }**，因为 **{ }** 是用来创建一个空字典。

创建格式：

```python
parame = {value01,value02,...}
或者
set(value)
```

```python
#!/usr/bin/python3

sites = {'Google', 'Taobao', 'Runoob', 'Facebook', 'Zhihu', 'Baidu'}

print(sites)   ## 输出集合，重复的元素被自动去掉

## 成员测试
if 'Runoob' in sites :
    print('Runoob 在集合中')
else :
    print('Runoob 不在集合中')


## set可以进行集合运算
a = set('abracadabra')
b = set('alacazam')

print(a)
print(a - b)     ## a 和 b 的差集
print(a | b)     ## a 和 b 的并集
print(a & b)     ## a 和 b 的交集
print(a ^ b)     ## a 和 b 中不同时存在的元素
```

集合的其它函数：

```python
s.add( x )  添加元素, 如果元素已存在，则不进行任何操作
s.remove( x )   移除元素,如果元素不存在，则会发生错误
s.discard( x )  移除元素,如果元素不存在，不会发生错误
len(s)   个数
s.clear()  清空集合
x in s   判断元素是否存在
union()	  返回两个集合的并集
```



##### Dictionary（字典）

字典（`dictionary`）是`Python`中另一个非常有用的内置数据类型。

**列表是有序的对象集合，字典是无序的对象集合**。两者之间的区别在于：字典当中的元素是通过键来存取的，而不是通过偏移存取。

字典是一种映射类型，字典用 **{ }** 标识，它是一个无序的 **键(key) : 值(value)** 的集合。

键(`key`)必须使用不可变类型。

在同一个字典中，键(`key`)必须是唯一的。

```python
#!/usr/bin/python3

dict = {}
dict['one'] = "1 - 菜鸟教程"
dict[2]     = "2 - 菜鸟工具"

tinydict = {'name': 'runoob','code':1, 'site': 'www.runoob.com'}


print (dict['one'])       ## 输出键为 'one' 的值
print (dict[2])           ## 输出键为 2 的值
print (tinydict)          ## 输出完整的字典
print (tinydict.keys())   ## 输出所有键
print (tinydict.values()) ## 输出所有值
```

- 1、字典是一种映射类型，它的元素是键值对。
- 2、字典的关键字必须为不可变类型，且不能重复。
- 3、创建空字典使用 **{ }**。

删除字典元素：

```python
del dict['Name']  ## 删除键 'Name'
dict.clear()     ## 清空字典
del dict         ## 删除字典
```

字典值可以是任何的 `python` 对象，既可以是标准的对象，也可以是用户定义的，但**键不行**。

- 1）不允许同一个键出现两次。创建时如果同一个键被赋值两次，后一个值会被记住
- 2）键必须不可变，所以可以用数字，字符串或元组充当，而用列表就不行

**字典其它函数：**

```python
len(dict)  键的总数
str(dict)  	输出字典
radiansdict.copy()    返回一个字典的浅复制
key in dict   如果键在字典dict里返回true，否则返回false
```

`Python` 直接赋值、浅拷贝和深度拷贝解析：https://www.runoob.com/w3cnote/python-understanding-dict-copy-shallow-or-deep.html

字典的遍历方法：

```python
>>> a
{'a': '1', 'b': '2', 'c': '3'}
>>> for key in a:
       print(key+':'+a[key])
 
a:1
b:2
c:3
>>> for key in a.keys():
       print(key+':'+a[key])
 
a:1
b:2
c:3
    
    
遍历values:
>>> for value in a.values():
   		print(value)
 
1
2
3

遍历键值对：
for (key,value) in a.items():
       print(key+':'+value)
 
a:1
b:2
c:3
```



### 运算符

#### Python算术运算符

以下假设变量`a`为`10`，变量`b`为`21`：

| 运算符 | 描述                                            | 实例                               |
| :----- | :---------------------------------------------- | :--------------------------------- |
| +      | 加 - 两个对象相加                               | a + b 输出结果 31                  |
| -      | 减 - 得到负数或是一个数减去另一个数             | a - b 输出结果 -11                 |
| *      | 乘 - 两个数相乘或是返回一个被重复若干次的字符串 | a * b 输出结果 210                 |
| /      | 除 - x 除以 y                                   | b / a 输出结果 2.1                 |
| %      | 取模 - 返回除法的余数                           | b % a 输出结果 1                   |
| **     | 幂 - 返回x的y次幂                               | a**b 为10的21次方                  |
| //     | 取整除 - 向下取接近商的整数                     | >>>  9//2   4 <br />>>> -9//2   -5 |

#### Python比较运算符

以下假设变量a为10，变量b为20：

| 运算符 | 描述                                                         | 实例                  |
| :----- | :----------------------------------------------------------- | :-------------------- |
| ==     | 等于 - 比较对象是否相等                                      | (a == b) 返回 False。 |
| !=     | 不等于 - 比较两个对象是否不相等                              | (a != b) 返回 True。  |
| >      | 大于 - 返回x是否大于y                                        | (a > b) 返回 False。  |
| <      | 小于 - 返回x是否小于y。所有比较运算符返回1表示真，返回0表示假。这分别与特殊的变量True和False等价。注意，这些变量名的大写。 | (a < b) 返回 True。   |
| >=     | 大于等于 - 返回x是否大于等于y。                              | (a >= b) 返回 False。 |
| <=     | 小于等于 - 返回x是否小于等于y。                              | (a <= b) 返回 True。  |

#### Python赋值运算符

以下假设变量`a`为`10`，变量`b`为`20`：

| 运算符 | 描述             | 实例                                  |
| :----- | :--------------- | :------------------------------------ |
| =      | 简单的赋值运算符 | c = a + b 将 a + b 的运算结果赋值为 c |
| +=     | 加法赋值运算符   | c += a 等效于 c = c + a               |
| -=     | 减法赋值运算符   | c -= a 等效于 c = c - a               |
| *=     | 乘法赋值运算符   | c *= a 等效于 c = c * a               |
| /=     | 除法赋值运算符   | c /= a 等效于 c = c / a               |
| %=     | 取模赋值运算符   | c %= a 等效于 c = c % a               |
| **=    | 幂赋值运算符     | c **= a 等效于 c = c ** a             |
| //=    | 取整除赋值运算符 | c //= a 等效于 c = c // a             |

#### Python位运算符

按位运算符是把数字看作二进制来进行计算的。Python中的按位运算法则如下：

| 运算符 | 描述                                                         | 实例                                                         |
| :----- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| &      | 按位与运算符：参与运算的两个值,如果两个相应位都为1,则该位的结果为1,否则为0 | (a & b) 输出结果 12 ，二进制解释： 0000 1100                 |
| \|     | 按位或运算符：只要对应的二个二进位有一个为1时，结果位就为1。 | (a \| b) 输出结果 61 ，二进制解释： 0011 1101                |
| ^      | 按位异或运算符：当两对应的二进位相异时，结果为1              | (a ^ b) 输出结果 49 ，二进制解释： 0011 0001                 |
| ~      | 按位取反运算符：对数据的每个二进制位取反,即把1变为0,把0变为1。**~x**类似于 **-x-1** | (~a ) 输出结果 -61 ，二进制解释： 1100 0011， 在一个有符号二进制数的补码形式。 |
| <<     | 左移动运算符：运算数的各二进位全部左移若干位，由"<<"右边的数指定移动的位数，高位丢弃，低位补0。 | a << 2 输出结果 240 ，二进制解释： 1111 0000                 |
| >>     | 右移动运算符：把">>"左边的运算数的各二进位全部右移若干位，">>"右边的数指定移动的位数 | a >> 2 输出结果 15 ，二进制解释： 0000 1111                  |

#### Python逻辑运算符

`Python`语言支持逻辑运算符，以下假设变量 `a` 为 `10`, `b`为 `20`:

| 运算符 | 逻辑表达式 | 描述                                                         | 实例                    |
| :----- | :--------- | :----------------------------------------------------------- | :---------------------- |
| and    | x and y    | 布尔"与" - 如果 x 为 False，x and y 返回 False，否则它返回 y 的计算值。 | (a and b) 返回 20。     |
| or     | x or y     | 布尔"或" - 如果 x 是 True，它返回 x 的值，否则它返回 y 的计算值。 | (a or b) 返回 10。      |
| not    | not x      | 布尔"非" - 如果 x 为 True，返回 False 。如果 x 为 False，它返回 True。 | not(a and b) 返回 False |

#### Python成员运算符

除了以上的一些运算符之外，`Python`还支持成员运算符，测试实例中包含了一系列的成员，包括字符串，列表或元组。

| 运算符 | 描述                                                    | 实例                                              |
| :----- | :------------------------------------------------------ | :------------------------------------------------ |
| in     | 如果在指定的序列中找到值返回 True，否则返回 False。     | x 在 y 序列中 , 如果 x 在 y 序列中返回 True。     |
| not in | 如果在指定的序列中没有找到值返回 True，否则返回 False。 | x 不在 y 序列中 , 如果 x 不在 y 序列中返回 True。 |

#### Python身份运算符

身份运算符用于**比较两个对象的存储单元**

| 运算符 | 描述                                        | 实例                                                         |
| :----- | :------------------------------------------ | :----------------------------------------------------------- |
| is     | is 是判断两个标识符是不是引用自一个对象     | **x is y**, 类似 **id(x) == id(y)** , 如果引用的是同一个对象则返回 True，否则返回 False |
| is not | is not 是判断两个标识符是不是引用自不同对象 | **x is not y** ， 类似 **id(a) != id(b)**。如果引用的不是同一个对象则返回结果 True，否则返回 False。 |

![image-20200921124637320](python.assets/image-20200921124637320.png)

`is` 与 `==` 区别：

`is` 用于判断两个变量引用对象是否为同一个， `==` 用于判断引用变量的值是否相等。

```python
>>>a = [1, 2, 3]
>>> b = a
>>> b is a 
True
>>> b == a
True
>>> b = a[:]
>>> b is a
False
>>> b == a
True
```

### 控制语句

`python`的真值对照表：

![image-20200921111846575](python.assets/image-20200921111846575.png)

```python
## coding:utf-8
a = None
b = ''
c = 0
print(bool(a))  ## False
print(bool(b))  ## False
print(bool(c))  ## False
d = 1
e = -1
f = '0'
print(bool(d))  ## True
print(bool(e))  ## True
print(bool(f))  ## True
## 判断语句
print(bool(c > d))
print(bool(c < d))
print(bool(c == d))
print(bool(c != d))
```

#### if条件判断

```python
if condition_1:
    statement_block_1
elif condition_2:
    statement_block_2
else:
    statement_block_3
```

#### while循环

在 `Python` 中没有 `do..while` 循环。

```python
while 判断条件(condition)：	
    执行语句(statements)……	
    
    
while <expr>:
    <statement(s)>
else:
    <additional_statement(s)>
```

![img](python.assets/006faQNTgw1f5wnm06h3ug30ci08cake.gif)

#### for循环

```python
for <variable> in <sequence>:
    <statements>
else:
    <statements>
    
break 语句可以跳出 for 和 while 的循环体。如果你从 for 或 while 循环中终止，任何对应的循环 else 块将不执行。
continue 语句被用来告诉 Python 跳过当前循环块中的剩余语句，然后继续进行下一轮循环。	
```

`range()`函数：遍历数字序列，可以使用内置`range()`函数。它会生成数列

```python
>>>for i in range(5):
...     print(i)
...
0
1
2
3
4


>>>for i in range(5,9) :
    print(i)
 

5
6
7
8

指定步长：
>>>for i in range(0, 10, 3) :
    print(i)
 
    
0
3
6
9
>>>
```

**可以结合`range()`和`len()`函数以遍历一个序列的索引**,如下所示:

![image-20200921134415769](python.assets/image-20200921134415769.png)

#### pass 语句

`Python pass`是空语句，是为了保持程序结构的完整性。

`pass` 不做任何事情，一般用做**占位语句**，如下实例

```python
>>>while True: 
    ...     pass  ## 等待键盘中断 (Ctrl+C)
```

### 迭代器与生成器

#### 迭代器

迭代器是一个**可以记住遍历的位置的对象**。

迭代器对象从集合的第一个元素开始访问，直到所有的元素被访问完结束。迭代器**只能往前不会后退**。

迭代器有两个基本的方法：`iter()` 和 `next()`。

**字符串，列表或元组对象都可用于创建迭代器：**

```python
>>> list=[1,2,3,4]
>>> it = iter(list)    ## 创建迭代器对象
>>> print (next(it))   ## 输出迭代器的下一个元素
1
>>> print (next(it))
2
```

迭代器对象可以使用常规`for`语句进行遍历：

```python
list4=["hello","this","is","jimmy"]
it=iter(list4)   ## 创建迭代器对象
for i in it:
    print(i,end=" ")
   
输出结果如下：
hello this is jimmy 
```

#### 自己通过`class`类来创建一个迭代器

把一个类作为一个迭代器使用需要在类中实现两个方法 `__iter__()` 与 `__next__()` 。

如果你已经了解的面向对象编程，就知道类都有一个构造函数，`Python` 的构造函数为 `__init__()`, 它会在对象初始化的时候执行。

更多内容查阅：[Python3 面向对象](https://www.runoob.com/python3/python3-class.html)

`__iter__()` 方法返回一个特殊的迭代器对象， 这个迭代器对象实现了 `__next__()` 方法并通过 `StopIteration` 异常标识迭代的完成。

`__next__() ` 方法（`Python 2` 里是 `next()`）会返回下一个迭代器对象。

创建一个返回数字的迭代器，初始值为 1，逐步递增 2：

```python
class MyNumber:
    def __iter__(self):
        self.a=1
        return self
    def __next__(self):
        x=self.a
        self.a+=2
        return x

myclass=MyNumber()
myiter=iter(myclass)
for i in range(5):
    print(next(myiter))
```

执行输出结果：

![image-20200921140900332](python.assets/image-20200921140900332.png)

#### 生成器

在 `Python` 中，使用了 `yield` 的函数被称为生成器（`generator`）。

我们先抛开 `generator`，以一个常见的编程题目来展示 `yield` 的概念。

斐波那契（`Fibonacci`）數列是一个非常简单的递归数列，除第一个和第二个数外，任意一个数都可由前两个数相加得到。用计算机程序输出斐波那契數列的前 `N` 个数是一个非常简单的问题，许多初学者都可以轻易写出如下函数：

```python
#!/usr/bin/python
## -*- coding: UTF-8 -*-
 
def fab(max): 
    n, a, b = 0, 0, 1 
    while n < max: 
        print b 
        a, b = b, a + b 
        n = n + 1
fab(5)
```

结果没有问题，但有经验的开发者会指出，直接在 `fab` 函数中用 `print` 打印数字会导致该函数可复用性较差，因为 **`fab` 函数返回 `None`，其他函数无法获得该函数生成的数列**。

要提高 `fab` 函数的可复用性，最好不要直接打印出数列，而是返回一个 `List`。以下是 `fab` 函数改写后的**第二个版本**：

```python
#!/usr/bin/python
## -*- coding: UTF-8 -*-
 
def fab(max): 
    n, a, b = 0, 0, 1 
    L = [] 
    while n < max: 
        L.append(b) 
        a, b = b, a + b 
        n = n + 1 
    return L
 
for n in fab(5): 
    print n
```

改写后的 `fab` 函数通过返回 `List` 能满足复用性的要求，但是更有经验的开发者会指出，该函数在运行中占用的内存会随着参数 `max` 的增大而增大，如果要控制内存占用，最好不要用 `List`

第三个版本：`yield`

```python
#!/usr/bin/python
## -*- coding: UTF-8 -*-
 
def fab(max): 
    n, a, b = 0, 0, 1 
    while n < max: 
        yield b      ## 使用 yield
        ## print b 
        a, b = b, a + b 
        n = n + 1

        
for n in fab(5): 
    print n
1 
1 
2 
3 
5
```

第`3`个版本的 `fab` 和第一版相比，仅仅把 `print b` 改为了 `yield b`，就在保持简洁性的同时获得了 `iterable` 的效果。调用第3版的 `fab` 和第二版的 `fab` 完全一致。

简单地讲，`yield` 的作用就是把一个函数变成一个 `generator`，带有 `yield` 的函数不再是一个普通函数，`Python` 解释器会将其视为一个 `generator`，调用 `fab(5)` 不会执行 `fab` 函数，而是返回一个 `iterable` 对象！在 `for` 循环执行时，每次循环都会执行 `fab` 函数内部的代码，执行到 `yield b` 时，`fab` 函数就返回一个迭代值，下次迭代时，代码从 `yield b` 的下一条语句继续执行，而函数的本地变量看起来和上次中断执行前是完全一样的，于是函数继续执行，直到再次遇到 `yield`。

### 函数

`Python` 定义函数使用 `def` 关键字，一般格式如下：

```python
def 函数名（参数列表）:
    函数体
```

带参数：

```python
def area(width, height):
    return width * height
```

#### 参数传递

在 `python` 中，类型属于对象，变量是没有类型的：

```
a=[1,2,3]
a="Runoob"
```

以上代码中，`[1,2,3]` 是 `List` 类型，`"Runoob"` 是 `String` 类型，而**变量 `a` 是没有类型，她仅仅是一个对象的引用（一个指针）**，可以是指向 `List` 类型对象，也可以是指向 `String` 类型对象。

可更改(`mutable`)与不可更改(`immutable`)对象

在 `python` 中，`strings`, `tuples`, 和 `numbers` 是不可更改的对象，而 `list`,`dict` 等则是可以修改的对象。

- **不可变类型**：变量赋值 `a=5` 后再赋值 `a=10`，这里实际是新生成一个 `int` 值对象 `10`，再让 `a` 指向它，而 `5` 被丢弃，不是改变 `a` 的值，相当于新生成了 `a`。
- **可变类型**：变量赋值 `la=[1,2,3,4]` 后再赋值 `la[2]=5` 则是将 `list la` 的第三个元素值更改，本身`la`没有动，只是其内部的一部分值被修改了。

`python` 函数的参数传递：

- **不可变类型**：类似 `C++` 的值传递，如 整数、字符串、元组。如 `fun(a)`，传递的只是 `a` 的值，没有影响 `a` 对象本身。如果在 `fun`(a)）内部修改 `a` 的值，则是新生成来一个 `a`。
- **可变类型**：类似 `C++` 的引用传递，如 列表，字典。如 `fun(la)`，则是将 `la` 真正的传过去，修改后 `fun` 外部的 `la` 也会受影响

`python` 中一切都是对象，严格意义我们不能说值传递还是引用传递，我们应该说传不可变对象和传可变对象。

##### python 传不可变对象实例

可通过 `id()` 函数来查看内存地址变化。实例：

```python
def change(a):
    print(id(a))   ## 指向的是同一个对象
    a=10
    print(id(a))   ## 一个新对象
 
a=1
print(id(a))
change(a)
```

以上实例输出结果为：

```
4379369136
4379369136
4379369424
```

可以看见在调用函数前后，形参和实参指向的是同一个对象（对象 id 相同），在函数内部修改形参后，形参指向的是不同的 id。

##### python 传可变对象实例

可变对象在函数里修改了参数，那么在调用这个函数的函数里，原始的参数也被改变了。例如：

```python
#!/usr/bin/python3
 
## 可写函数说明
def changeme( mylist ):
    ## 修改传入的列表
    mylist.append([1,2,3,4])
    print("函数内取值: ", mylist)
    return
 
## 调用changeme函数
mylist = [10,20,30]
changeme( mylist )
print ("函数外取值: ", mylist)
```

传入函数的和在末尾添加新内容的对象用的是同一个引用。故输出结果如下：

```
函数内取值:  [10, 20, 30, [1, 2, 3, 4]]
函数外取值:  [10, 20, 30, [1, 2, 3, 4]]
```

#### 参数类型

以下是调用函数时可使用的正式参数类型：

- 必需参数
- 关键字参数
- 默认参数
- 不定长参数

1、必需参数：

![image-20200921150548901](python.assets/image-20200921150548901.png)

2、关键字参数：

使用关键字参数允许函数调用时参数的顺序与声明时不一致，因为 Python 解释器能够用参数名匹配参数值。

![image-20200921150642131](python.assets/image-20200921150642131.png)

3、默认参数：

调用函数时，如果没有传递参数，则会使用默认参数。

![image-20200921150717095](python.assets/image-20200921150717095.png)

4、不定长参数：

加了星号 `*` 的参数会以元组(`tuple`)的形式导入，存放所有未命名的变量参数。

![image-20200921150845828](python.assets/image-20200921150845828.png)

#### 匿名函数

`python` 使用 `lambda` 来创建匿名函数。

所谓匿名，意即不再使用 `def` 语句这样标准的形式定义一个函数。

- `lambda` 只是一个表达式，函数体比 `def` 简单很多。
- `lambda`的主体是一个表达式，而不是一个代码块。仅仅能在`lambda`表达式中封装有限的逻辑进去。
- `lambda` 函数拥有自己的命名空间，且不能访问自己参数列表之外或全局命名空间里的参数。
- 虽然`lambda`函数看起来只能写一行，却不等同于`C`或`C++`的内联函数，后者的目的是调用小函数时不占用栈内存从而增加运行效率。

![image-20200921151040040](python.assets/image-20200921151040040.png)

#### return语句

`return [表达式]` 语句用于退出函数，选择性地向调用方返回一个表达式。**不带参数值的return语句返回None**。

### 模块&包

模块是一个包含所有你定义的函数和变量的文件，其后缀名是`.py`。模块可以被别的程序引入，以使用该模块中的函数等功能。这也是使用 `python` 标准库（`sys`等）的方法。

![image-20200921152215818](python.assets/image-20200921152215818.png)

#### import 语句

```python
import module1[, module2[,... moduleN]
```

当解释器遇到 `import` 语句，**如果模块在当前的搜索路径就会被导入**。

搜索路径是一个解释器会先进行搜索的所有目录的列表。**查看搜索路径有哪些：**

```python
import sys
for paths in sys.path:
    print(paths)
```

我个人的运行结果截图：

![image-20200921162137648](python.assets/image-20200921162137648.png)

搜索路径默认是有**当前的项目的路径**的，如果想要导入的是模块的`.py`文件在项目路径下，直接`import`就可以导入：

![image-20200921163923191](python.assets/image-20200921163923191.png)

`import`直接导入使用：

![image-20200921165935903](python.assets/image-20200921165935903.png)

#### from ... import  语句

`Python` 的 `from` 语句让你从模块中**导入一个指定的部分**到当前命名空间中，语法如下：

```python
from modname import name1[, name2[, ... nameN]]
```

顺便提一下`directory`与`package`的区别：

![image-20200921170921316](python.assets/image-20200921170921316.png)

- `Directory`：在`pycharm`中就是一个文件夹，放置资源文件等，该文件夹其中并不包含`__ init.py__`文件
- `Package`：对于`Python package` 文件夹而言，与`Dictionary`不同之处在于其会自动创建`__ init.py__` 文件。简单的说，`python package`就是一个目录，其中包括一组模块和一个`__ init.py__`文件。目录下具有`init.py`文件，这样**可以通过`from … import`的方式进行`.py`文件的导入。**

所以，在`package`里面的`.py`模块，可以通过`from  ... import ...` 语句来进行导入

![image-20200921171207893](python.assets/image-20200921171207893.png)

#### from … import * 语句

把一个模块的所有内容全都导入到当前的命名空间也是可行的

#### 注意事项

1、**一个模块只会被导入一次**，不管你执行了多少次`import`。这样可以防止导入模块被一遍又一遍地执行。

因此，当导入自己自定义的模块时，如果导入第一次之后，模块又被修改了，记得**点击重新运行**，这样才能重新导入模块，否则会出现问题，因为导入的模块不会重新导入。在`pycharm`里面，方法如下：

![image-20200921172041008](python.assets/image-20200921172041008.png)

2、模块除了方法定义，还可以包括可执行的代码。这些代码一般用来初始化这个模块。**这些代码只有在第一次被导入时才会被执行。**

每个模块有各自独立的符号表，在模块内部为所有的函数当作全局符号表来使用。

所以，模块的作者**可以放心大胆的在模块内部使用这些全局变量，而不用担心把其他用户的全局变量搞混**。

举个例子：

`mymath.py`内容：

```python
def mysum(a,b):
    c=a+b
    print("hello c")
    return c
print("hello world")
```

`demo2.py`内容：

```python
from package1 import mymath
print(mymath.mysum(34, 52))
```

运行两次`mymath.py`，只有第一次进行导包时才会运行`print("hello world")`:

![image-20200921172912667](python.assets/image-20200921172912667.png)

#### `__name__`属性

`__name_`标识了一个模块的名称，一个模块被另一个程序第一次引入时，其主程序将运行。如果我们想在模块被引入时，模块中的某一程序块不执行，我们可以用`__name__`属性来使该程序块仅在该模块自身运行时执行。

```python
#!/usr/bin/python3
## Filename: using_name.py

if __name__ == '__main__':
   print('程序自身在运行')    #此段代码是私有的
else:
   print('我来自另一模块')    
```

运行输出如下：

自己运行：

![image-20200921181456745](python.assets/image-20200921181456745.png)

在另一个模块导入：

![image-20200921181439952](python.assets/image-20200921181439952.png)

#### dir()函数

内置的函数 `dir()` 可以找到模块内定义的所有名称。以一个字符串列表的形式返回：

![image-20200921182156982](python.assets/image-20200921182156982.png)

运行上面的`demo.py`后，`dir()`查看所有名称：

```python
['__builtins__', '__doc__', '__file__', '__loader__', '__name__', '__package__', '__spec__', 'a', 'demo2', 'mymath', 'sys']
```

#### 包 package

![image-20200921182904684](python.assets/image-20200921182904684.png)

包是一种管理 `Python` 模块命名空间的形式，采用"点模块名称"，比如一个模块的名称是 `A.B`， 那么他表示一个`包 A中的子模块 B` 。

不同包中的模块互不影响。**一种可能的包结构如下，包里面可以包含子包**：

![image-20200921182829091](python.assets/image-20200921182829091.png)

目录只有包含一个叫做 `__init__.py` 的文件才会被认作是一个包，主要是为了避免一些滥俗的名字（比如叫做 `string`）不小心的**影响搜索路径中的有效模块**。

1、用户可以每次只导入一个包里面的特定模块，比如:

```python
import sound.effects.echo
```

这将会导入子模块:`sound.effects.echo`。 他**必须使用全名去访问:**

```python
sound.effects.echo.echofilter(input, output, delay=0.7, atten=4)
```



2、还有一种导入子模块的方法是:

```python
from sound.effects import echo
```

这同样会导入子模块: `echo`，并且他**不需要那些冗长的前缀**，所以他可以这样使用:

```python
echo.echofilter(input, output, delay=0.7, atten=4)
```



3、还有一种变化就是直接导入一个函数或者变量:

```python
from sound.effects.echo import echofilter
```

### 读和写文件

open() 将会返回一个 file 对象，基本语法格式如下:

```python
open(filename, mode)
```

- `filename`：包含了你要访问的文件名称的字符串值。
- `mode`：决定了打开文件的模式：只读，写入，追加等。默认文件访问模式为只读(`r`)。

模式总结：（`Truncate`表示清除的意思）

![image-20200921191053339](python.assets/image-20200921191053339.png)

实例：

```python
#!/usr/bin/python3

## 打开一个文件
f = open("/tmp/foo.txt", "w")

f.write( "Python 是一个非常好的语言。\n是的，的确非常好!!\n" )

## 关闭打开的文件
f.close()
```

#### 文件对象的方法

##### f.read()

为了读取一个文件的内容，调用 `f.read(size)`, 这将读取一定数目的数据, 然后作为字符串或字节对象返回。

`size` 是一个可选的数字类型的参数。 当 `size` 被忽略了或者为负, 那么该文件的**所有内容**都将被读取并且返回。

![image-20200921191505716](python.assets/image-20200921191505716.png)



##### f.readline()

`f.readline()` 会从文件中**读取单独的一行**。换行符为 `'\n'`。`f.readline()` 如果返回一个空字符串, 说明已经已经读取到最后一行。

`hello.txt`：

```
这是第一行
这是第二行
这是第三行
```

`demo.txt`：

```python
str1=''
f=open('source/hello.txt',mode='a+',encoding='utf-8')
f.seek(0)    #改变文件当前的位置
for i in range(3):
    str1=str1+f.readline()
print(str1)
f.close()
```

##### f.readlines()

`f.readlines()` 将返回该文件中包含的**所有行**。

```python
f=open('source/hello.txt',mode='a+',encoding='utf-8')
f.seek(0)
str2=f.readlines()
print(str2)
f.close()
```

读取的每一行**使用列表保存**起来：

![image-20200921200709872](python.assets/image-20200921200709872.png)

##### f.write()

将 `string` 写入到文件中, 然后返回写入的字符数。

```python
f=open('source/hello.txt',mode='a+',encoding='utf-8')
f.write("python是一门很好的语言")
f.write()
```

##### 注意事项

如果打开文件的模式`mode='a'`或者`mode='a+`'时，打开的文件的指针都在末尾：

|    模式    |  r   |  r+  |  w   |  w+  |  a   |  a+  |
| :--------: | :--: | :--: | :--: | :--: | :--: | :--: |
|     读     |  +   |  +   |      |  +   |      |  +   |
|     写     |      |  +   |  +   |  +   |  +   |  +   |
|    创建    |      |      |  +   |  +   |  +   |  +   |
|    覆盖    |      |      |  +   |  +   |      |      |
| 指针在开始 |  +   |  +   |  +   |  +   |      |      |
| 指针在结尾 |      |      |      |      |  +   |  +   |

所以，使用`a`或`a+`模式打开文件，并且读取内容时，`读取的内容会是空`，因为指针默认在文件结尾，解决方法有`2`种：

1、使用`f.seek()`方法，读取文件前，将文件指针放在开始位置

2、使用`ab`或者`ab+`模式，`b`表示的是指针放在文件开始位置。

### 错误和异常

#### 异常处理

`try...except..else...finally`  , `except`和`finally`可有可没有。

![image-20200921203745262](python.assets/image-20200921203745262.png)

```python
try:
    print(2/0)
except ZeroDivisionError:
    print("出错了")
else:
    print("没错")
finally:
    print("done")
```

运行结果：

![image-20200921204138049](python.assets/image-20200921204138049.png)

#### 抛出异常

`Python` 使用 `raise` 语句抛出一个指定的异常。

![image-20200921204307514](python.assets/image-20200921204307514.png)

抛出异常：

```python
x=10
if x > 5:
    raise Exception('x不能大于5')
```

捕捉抛出的异常：

```python
x=10
try:
    if x > 5:
        raise Exception('x不能大于5')
except Exception:
    print("出错了")
```

运行结果为：

![image-20200921204719401](python.assets/image-20200921204719401.png)

注意：`raise` 唯一的一个参数指定了要被抛出的异常。它**必须是一个异常的实例或者是异常的类**（也就是 `Exception` 的子类）。

#### 用户自定义异常

可以通过创建一个新的异常类来拥有自己的异常。**异常类继承自 `Exception` 类，可以直接继承，或者间接继承**，例如:

![image-20200921204916881](python.assets/image-20200921204916881.png)



### 面向对象

`Python`从设计之初就已经是一门面向对象的语言。

#### 类定义

![image-20200921205147724](python.assets/image-20200921205147724.png)

#### 类对象

类对象支持两种操作：属性引用和实例化。

属性引用使用和 `Python` 中所有的属性引用一样的标准语法：`obj.name`。

```python
#!/usr/bin/python3
 
class MyClass:
    """一个简单的类实例"""
    i = 12345
    def f(self):
        return 'hello world'
 
## 实例化类
x = MyClass()
 
## 访问类的属性和方法
print("MyClass 类的属性 i 为：", x.i)
print("MyClass 类的方法 f 输出为：", x.f())
```

类有一个名为 `__init__()` 的特殊方法（**构造方法**），该方法在类实例化时会自动调用，像下面这样：

```python
def __init__(self):    
self.data = []
```

类定义了 `__init__()` 方法，类的实例化操作会自动调用 `__init__()` 方法。

**`self`代表类的实例，而非类**

类的方法与普通的函数只有一个特别的区别——它们必须有一个额外的**第一个参数名称**, 按照惯例它的名称是 self。

```python
class Test:
    def prt(self):
        print(self)
        print(self.__class__)
 
t = Test()
t.prt()
```

以上实例执行结果为：

```python
<__main__.Test instance at 0x100771878>
__main__.Test
```

从执行结果可以很明显的看出，`self` 代表的是类的实例，代表当前对象的地址，而 `self.class` 则指向类。

`self` 不是 `python` 关键字，我们把他换成 `runoob` 也是可以正常执行的:

```python
class Test:
    def prt(runoob):
        print(runoob)
        print(runoob.__class__)
 
t = Test()
t.prt()
```

以上实例执行结果为：

```python
<__main__.Test instance at 0x100771878>
__main__.Test
```

#### 类的方法

在类的内部，使用 `def` 关键字来定义一个方法，与一般函数定义不同**，类方法必须包含参数 `self`, 且为第一个参数**，`self` 代表的是类的实例。

示例：

![image-20200921211422398](python.assets/image-20200921211422398.png)

运行结果：

![image-20200921211444465](python.assets/image-20200921211444465.png)

#### 继承

```python
class people:
    name=''
    age=0
    ## 定义私有属性,私有属性在类外部无法直接进行访问
    __weight=0
    def __init__(self,n,a,w):
        self.name=n
        self.age=a
        self.__weight=w
    def speak(self):
        print("%s 说: 我 %d 岁, %d kg" %(self.name,self.age,self.__weight))
        
class student(people):
    people.__weight = 100
    grade=''
    def __init__(self,n,a,w,g):
        ## 调用父类的构函
        people.__init__(self,n,a,w)
        self.grade=g
    ## 覆写父类的方法
    def speak(self):
        print("%s 说: 我 %d 岁了，我在读 %d 年级" % (self.name, self.age, self.grade))
s=student('ken',10,60,3)
s.speak()
```

运行结果：

![image-20200921213132431](python.assets/image-20200921213132431.png)

#### 多继承

`Python`同样有限的支持多继承形式。多继承的类定义形如下例:

```python
#!/usr/bin/python3
 
#类定义
class people:
    #定义基本属性
    name = ''
    age = 0
    #定义私有属性,私有属性在类外部无法直接进行访问
    __weight = 0
    #定义构造方法
    def __init__(self,n,a,w):
        self.name = n
        self.age = a
        self.__weight = w
    def speak(self):
        print("%s 说: 我 %d 岁。" %(self.name,self.age))

        
#单继承示例
class student(people):
    grade = ''
    def __init__(self,n,a,w,g):
        #调用父类的构函
        people.__init__(self,n,a,w)
        self.grade = g
    #覆写父类的方法
    def speak(self):
        print("%s 说: 我 %d 岁了，我在读 %d 年级"%(self.name,self.age,self.grade))
        
        
#另一个类，多重继承之前的准备
class speaker():
    topic = ''
    name = ''
    def __init__(self,n,t):
        self.name = n
        self.topic = t
    def speak(self):
        print("我叫 %s，我是一个演说家，我演讲的主题是 %s"%(self.name,self.topic))

#多重继承
class sample(speaker,student):
    a =''
    def __init__(self,n,a,w,g,t):
        student.__init__(self,n,a,w,g)
        speaker.__init__(self,n,t)

test = sample("Tim",25,80,4,"Python")
test.speak()   #方法名同，默认调用的是在括号中排前地父类的方法
```

#### 方法重写

![image-20200921215730827](python.assets/image-20200921215730827.png)

注意：子类不重写 `__init__`，实例化子类时，会自动调用父类定义的 `__init__`，如果重写了`__init__` 时，实例化子类，就不会调用父类已经定义的 `__init__`。

如果重写了`__init__` 时，要继承父类的构造方法，可以使用 `super` 关键字：

```python
super(子类，self).__init__(参数1，参数2，....)
```

还有一种经典写法：

```python
父类名称.__init__(self,参数1，参数2，...)
```

#### 类属性与方法

类的私有属性

- `__private_attrs`：**两个下划线开头**，声明该属性为私有，不能在类的外部被使用或直接访问。在类内部的方法中使用时 `self.__private_attrs`。

类的方法

- 在类的内部，使用 `def` 关键字来定义一个方法，与一般函数定义不同，类方法必须包含参数 `self`，且为第一个参数，`self` 代表的是类的实例。

- `self` 的名字并不是规定死的，也可以使用 `this`，但是最好还是按照约定是用 `self`。

类的私有方法

- `private_method`：**两个下划线开头**，声明该方法为私有方法，只能在类的内部调用 ，不能在类的外部调用。`self.private_methods`。

![image-20200921220634609](python.assets/image-20200921220634609.png)

外部不能调用私有方法例子：

![image-20200921220713277](python.assets/image-20200921220713277.png)

类的专有方法：

```python
类的专有方法：
__init__ : 构造函数，在生成对象时调用
__del__ : 析构函数，释放对象时使用
__repr__ : 打印，转换
__setitem__ : 按照索引赋值
__getitem__: 按照索引获取值
__len__: 获得长度
__cmp__: 比较运算
__call__: 函数调用
__add__: 加运算
__sub__: 减运算
__mul__: 乘运算
__truediv__: 除运算
__mod__: 求余运算
__pow__: 乘方
```



### 多线程

多线程的优点：

- 使用线程可以把占据长时间的程序中的任务放到后台去处理。
- 用户界面可以更加吸引人，比如用户点击了一个按钮去触发某些事件的处理，可以弹出一个进度条来显示处理的进度。
- 程序的运行速度可能加快。
- 在一些等待的任务实现上如用户输入、文件读写和网络收发数据等，线程就比较有用了。在这种情况下我们可以释放一些珍贵的资源如内存占用等等。

每个独立的线程有一个程序运行的入口、顺序执行序列和程序的出口。但是线程不能够独立执行，必须依存在应用程序中，由应用程序提供多个线程执行控制。

**每个线程都有他自己的一组CPU寄存器，称为线程的上下文**，该上下文反映了线程上次运行该线程的CPU寄存器的状态。

线程可以分为:

- **内核线程：**由操作系统内核创建和撤销。
- **用户线程：**不需要内核支持而在用户程序中实现的线程。

#### _thread模块

调用 `_thread` 模块中的`start_new_thread()`函数来产生新线程，语法格式是：

```python
_thread.start_new_thread ( function, args[, kwargs] )
```

注意： `args` - 传递给线程函数的参数,他必须是个`tuple`类型。

实例：

![image-20200922092443587](python.assets/image-20200922092443587.png)

运行结果为：

![image-20200922092501094](python.assets/image-20200922092501094.png)

注意：使用多线程时，建议使用`try... except`包起来：

![image-20200922092749225](python.assets/image-20200922092749225.png)



#### threading模块

`_thread` 提供了低级别的、原始的线程以及一个简单的锁，它相比于 `threading` 模块的功能还是比较有限的。

`threading` 模块除了包含 `_thread` 模块中的所有方法外，还提供的其他方法：

- `threading.currentThread()`: 返回当前的线程变量。
- `threading.enumerate()`: 返回一个包含正在运行的线程的`list`。正在运行指线程启动后、结束前，不包括启动前和终止后的线程。
- `threading.activeCount()`: 返回正在运行的线程数量，与`len(threading.enumerate())`有相同的结果。

除了使用方法外，线程模块同样提供了`Thread`类来处理线程，`Thread`类提供了以下方法:

```python
run(): 用以表示线程活动的方法。
start():启动线程活动。
join([time]): 等待至线程中止。这阻塞调用线程直至线程的join() 方法被调用中止-正常退出或者抛出未处理的异常-或者是可选的超时发生。
isAlive(): 返回线程是否活动的。
getName(): 返回线程名。
setName(): 设置线程名。
```

使用 `threading` 模块创建线程：

我们可以通过直接从 `threading.Thread` 继承创建一个新的子类，并实例化后调用 `start()` 方法启动新线程，即它调用了线程的 `run()` 方法：

```python
import time
import _thread

def print_time(threadName,delay):
    count=0
    while count<5:
        time.sleep(delay)
        print("%s: %s" %(threadName,time.ctime(time.time())))
        count+=1
try:
    _thread.start_new_thread(print_time,("thread_one",2))
    _thread.start_new_thread(print_time,("thread_two",4))
except:
    print("Error:无法启动线程")


import threading
exitFlag=0
class myThread(threading.Thread):
    def __init__(self,threadId,name,counter):
        threading.Thread.__init__(self)
        self.threadId=threadId
        self.name=name
        self.counter=counter

    def run(self):
        print("开启线程："+self.name)
        print_time(self.name,self.counter,5)
        print("退出线程："+ self.name)
def print_time(threadName,delay,counter):
    while counter:
        if exitFlag:
            threadName.exit()
        time.sleep(delay)
        print('%s: %s'%(threadName,time.ctime(time.time())))
        counter-=1

thread1=myThread(1,'Thread-1',1)
thread2=myThread(2,'Thread-2',2)

thread1.start()
thread2.start()
thread1.join()
thread2.join()
print("退出线程")
```

### 日期和时间

`Python` 提供了一个 `time` 和 `calendar` 模块可以用于格式化日期和时间。

时间间隔是以秒为单位的浮点小数。

每个时间戳都以自从 `1970` 年 `1` 月 `1` 日午夜（历元）经过了多长时间来表示。

`Python` 的 `time` 模块下有很多函数可以转换常见日期格式。如函数 `time.time()` 用于获取当前时间戳, 如下实例:

![image-20200922141157600](python.assets/image-20200922141157600.png)

运行结果为：

![image-20200922141210005](python.assets/image-20200922141210005.png)

#### 时间元组

很多`Python`函数用一个元组装起来的`9`组数字处理时间: （年、月、日、时、分、秒、一周第几日、一年第几日、夏令时）

| 0    | 4位数年      | 2008                                 |
| ---- | ------------ | ------------------------------------ |
| 1    | 月           | 1 到 12                              |
| 2    | 日           | 1到31                                |
| 3    | 小时         | 0到23                                |
| 4    | 分钟         | 0到59                                |
| 5    | 秒           | 0到61 (60或61 是闰秒)                |
| 6    | 一周的第几日 | 0到6 (0是周一)                       |
| 7    | 一年的第几日 | 1到366 (儒略历)                      |
| 8    | 夏令时       | -1, 0, 1, -1是决定是否为夏令时的旗帜 |

#### 获取当前时间

获取当前时间的方法只有一个，就是`time.time()`，而且获取的是时间戳，使用`time.localtime()`可以将其转化为时间元组，如下：

```python
import time
localtime=time.localtime(time.time())
print(localtime)
```

运行结果为一个元组，有`9`个元素：

![image-20200922141648559](python.assets/image-20200922141648559.png)

#### 格式的转化

`time.asctime()`和`time.ctime()`都能得到格式为`%a %b %d %H:%M:%S %Y`的字符串时间。

`time.ctime()`的传入参数是时间戳:

```python
import
time1=time.ctime(time.time())
print(time1)
```

运行结果为：

![image-20200922142931349](python.assets/image-20200922142931349.png)

`time.asctime()`的传入参数是时间元组：

```python
import time
print(time.time())
time2=time.asctime(time.localtime(time.time()))
```

运行结果为：

![image-20200922142945607](python.assets/image-20200922142945607.png)

我们还可以使用`time.strftime()`来进行格式化，此函数需要两个参数，第一个是显示格式字符串，第二个是时间元组。

举个例子：

![image-20200922143443966](python.assets/image-20200922143443966.png)

运行结果为：

![image-20200922143503333](python.assets/image-20200922143503333.png)

```python
python中时间日期格式化符号：

%y 两位数的年份表示（00-99）
%Y 四位数的年份表示（000-9999）
%m 月份（01-12）
%d 月内中的一天（0-31）
%H 24小时制小时数（0-23）
%I 12小时制小时数（01-12）
%M 分钟数（00=59）
%S 秒（00-59）
%a 本地简化星期名称
%A 本地完整星期名称
%b 本地简化的月份名称
%B 本地完整的月份名称
%c 本地相应的日期表示和时间表示
%j 年内的一天（001-366）
%p 本地A.M.或P.M.的等价符
%U 一年中的星期数（00-53）星期天为星期的开始
%w 星期（0-6），星期天为星期的开始
%W 一年中的星期数（00-53）星期一为星期的开始
%x 本地相应的日期表示
%X 本地相应的时间表示
%Z 当前时区的名称
%% %号本身
```

### 正则表达式

正则表达式在线测试工具：http://c.runoob.com/front-end/854

使用正则表达式进行匹配的流程：

![image-20200922203915144](python.assets/image-20200922203915144.png)

#### 常用语法

![image-20200922215120578](python.assets/image-20200922215120578.png)



#### re.match函数

`re.match` 尝试从字符串的起始位置匹配一个模式，如果不是起始位置匹配成功的话，`match()`就返回`none`。

```python
re.match(pattern, string, flags=0)
```

实例：

![image-20200922210405398](python.assets/image-20200922210405398.png)

运行结果为：

![image-20200922210846493](python.assets/image-20200922210846493.png)

注意：

- `re.match`函数匹配返回的是一个`re.Match`对象，如果需要获取其中的字符串，需要使用`group()`或者`groups()`函数。
- `group()`用来获取整个正则表达式匹配到的字符串。
- `groups()`返回一个包含所有小组字符串的**元组**。
- `group(num)`表示返回第`num`个字符串。
- `flags`为**正则表达式修饰符**，默认`flags=0`，常用标志为`I`和`M`

举个例子讲一下`flags`修饰符：

![image-20200922214708832](python.assets/image-20200922214708832.png)

运行结果为：

![image-20200922214814309](python.assets/image-20200922214814309.png)

可以看到，**运行结果不受到大小写和换行的影响**，这个就是`re.M | re.I`的作用，后面其它函数若有使用到`flags`，也是一样的道理。

#### re.search方法

`re.search` 扫描整个字符串并返回第一个成功的匹配。

```python
re.search(pattern, string, flags=0)
```

`re.search`和`re.match`用法基本一致，唯一的区别是：

`re.match` 只匹配字符串的开始，如果字符串开始不符合正则表达式，则匹配失败，函数返回 `None`，而 `re.search` 匹配整个字符串，直到找到一个匹配。

#### re.sub检索和替换

```python
re.sub(pattern, repl, string, count=0, flags=0)
```

参数：

- `pattern` : 正则中的模式字符串。
- `repl` : 替换的字符串，也可为一个函数。
- `string` : 要被查找替换的原始字符串。
- `count` : 模式匹配后替换的最大次数，默认 0 表示替换所有的匹配。

实例：

![image-20200922212046449](python.assets/image-20200922212046449.png)

运行结果为：

![image-20200922212101638](python.assets/image-20200922212101638.png)

#### compile函数

回看我们的正则表达式流程，如下，是通过**正则表达式对象**去匹配结果的：

![image-20200922203915144](python.assets/image-20200922203915144.png)

`compile` 函数用于编译正则表达式，生成一个正则表达式（ `Pattern` ）对象，供 `match()` 和 `search()` 这两个函数使用。

```python
re.compile(pattern[, flags])
```

实例：

![image-20200922213233725](python.assets/image-20200922213233725.png)

#### findall

在字符串中找到正则表达式所匹配的所有子串，并**返回一个列表**，如果没有找到匹配的，则返回空列表。

**注意：** `match` 和 `search` 是匹配一次 `findall` 匹配所有。

实例：

![image-20200922213519194](python.assets/image-20200922213519194.png)

运行结果为：

![image-20200922213534327](python.assets/image-20200922213534327.png)

#### finditer

和 `findall` 类似，在字符串中找到正则表达式所匹配的所有子串，并把它们作为一个**迭代器**返回。

```python
re.finditer(pattern, string, flags=0)
```

实例：

![image-20200922213920841](python.assets/image-20200922213920841.png)

运行结果：

![image-20200922214101999](python.assets/image-20200922214101999.png)

#### 常用表达式

##### 检验数字的表达式

![image-20200922215913070](python.assets/image-20200922215913070.png)

##### 检验字符的表达式

![image-20200922215940704](python.assets/image-20200922215940704.png)

##### 特殊需求表达式

![image-20200922220000151](python.assets/image-20200922220000151.png)

### json数据解析

`Python3` 中可以使用 `json` 模块来对 `JSON` 数据进行编解码，它包含了两个函数：

- `json.dumps()`: 对数据进行编码。
- `json.loads()`: 对数据进行解码。

![img](python.assets/5767796078149632-1600823454217.svg)

`python` 原始类型向 `json` 类型的转化对照表：

| Python           | JSON   |
| :--------------- | :----- |
| dict             | object |
| list, tuple      | array  |
| str, unicode     | string |
| int, long, float | number |
| True             | true   |
| False            | false  |
| None             | null   |

#### json.dumps()

`json.dumps()`用于将`dict`类型的数据转成`str`：

示例：

![image-20200923005548976](python.assets/image-20200923005548976.png)

#### json.loads()

用于将`str`类型的数据转成`dict`：

示例：

```python
import json
dict1={
    'name':'Jimmy',
    'age':21
}
dumps=json.dumps(dict1)
loads=json.loads(dumps)

print(type(dict1))
print(type(dumps))
print(type(loads))
```

运行结果为：

![image-20200923010036736](python.assets/image-20200923010036736.png)

#### json.dump()

`json.dump()`用于将`dict`类型的数据转成str，并写入到`json`文件中:

```python
dict = {'a': 'wo', 'b': 'zai', 'c': 'zhe', 'd': 'li'}
json.dump(dict,open(r'C:\Users\zy\Documents\GitHub\python3\searchTest\json.json','w'))
```

#### json.load()

`json.load()`用于从`json`文件中读取数据，读取完数据后，数据以`dict`形式存在：

```python
filename=(r'F:\jsonDemo.json')
jsonObj=json.load(open(filename))
print(jsonObj)
print(type(jsonObj))
```

运行结果为：

![image-20200923010351855](python.assets/image-20200923010351855.png)

#### 注意事项

1. 特别注意`JSON`字符串中的内容用双引号，而非单引号。



### 装饰器@

#### 函数装饰器

##### 内置函数装饰器

###### ＠staticmethod

被＠`staticmethod`修饰的方法是静态方法，从而可以实例化使用 `C().f()`，也可以不实例化调用该方法 `C.f()`。

![image-20200923183403338](python.assets/image-20200923183403338.png)

###### @classmethod 

@`classmethod` 修饰符对应的函数不需要实例化，不需要 `self` 参数，但第一个参数需要是表示自身类的 `cls` 参数，可以来调用类的属性，类的方法，实例化对象等。

如下，被@`classmethod`修饰后，访问类的函数不需要实例化：

```python
#!/usr/bin/python
## -*- coding: UTF-8 -*-
 
class A(object):
    bar = 1
    def func1(self):  
        print ('foo') 
    @classmethod
    def func2(cls):
        print ('func2')
        print (cls.bar)
        cls().func1()   ## 调用 foo 方法
 
A.func2()   ## 不需要实例化
```

不使用@`classmethod`修饰与使用@`classmethod`修饰的区别：

![image-20200923184232563](python.assets/image-20200923184232563.png)

###### @property

`@property`可用来创建私有属性，可**把一个方法变成属性来调用：**

![image-20200923201144148](python.assets/image-20200923201144148.png)

使用`@property`后，`get_score`方法变成了一个`int`属性，不能再加括号来调用。

可对比加`@property`和不加`@property`时，`print(type(sc.get_score))`的区别，一个是`<class 'int'>`，另一个是`<class 'method'>`。



##### 函数装饰器的原理

假设用 `funA()` 函数装饰器去装饰 `funB()` 函数，如下所示：

```python
#funA 作为装饰器函数
def funA(fn):
    #...
    fn() ## 执行传入的fn参数
    #...
    return '...'

@funA
def funB():
    #...
```

实际上，上面程序完全等价于下面的程序：

```python
def funA(fn):
    #...
    fn() ## 执行传入的fn参数
    #...
    return '...'

def funB():
    #...

funB = funA(funB)
```

其底层执行了如下 `2` 步操作：

1. 将 `B` 作为参数传给 `A()` 函数；
2. 将 `A()` 函数执行完成的返回值反馈回 `B`。

实例：

```python
#funA 作为装饰器函数
def funA(fn):
    print("C语言中文网")
    fn() ## 执行传入的fn参数
    print("http://c.biancheng.net")
    return "装饰器函数的返回值"

@funA
def funB():
    print("学习 Python")
```

程序执行流程为：

![image-20200923210418004](python.assets/image-20200923210418004.png)

**带参数的函数装饰器**：

在分析 `funA()` 函数装饰器和 `funB()` 函数的关系时，细心的读者可能会发现一个问题，即当 `funB()` 函数无参数时，可以直接将 `funB` 作为 `funA()` 的参数传入。但是，如果被修饰的函数本身带有参数，那应该如何传值呢？

比较简单的解决方法就是在函数装饰器中嵌套一个函数，该函数带有的参数个数和被装饰器修饰的函数相同。例如：

```python
def funA(fn):
    ## 定义一个嵌套函数
    def say(arc):
        print("Python教程:",arc)
    return say

@funA
def funB(arc):
    print("funB():", a)
funB("http://c.biancheng.net/python")
```

程序执行结果为：

![image-20200923210654515](python.assets/image-20200923210654515.png)

显然，通过 `funB()` 函数被装饰器 `funA()` 修饰，`funB` 就被赋值为 `say`。这意味着，虽然我们在程序显式调用的是 funB() 函数，但其实执行的是装饰器嵌套的 say() 函数。

但还有一个问题需要解决，即如果当前程序中，有多个（`≥ 2`）函数被同一个装饰器函数修饰，这些函数带有的参数个数并不相等，怎么办呢？

最简单的解决方式是用 `*args` 和 `**kwargs` 作为装饰器内部嵌套函数的参数，`*args` 和 `**kwargs` 表示接受任意数量和类型的参数。举个例子：

```python
def funA(fn):
    ## 定义一个嵌套函数
    def say(*args,**kwargs):
        fn(*args,**kwargs)
    return say

@funA
def funB(arc):
    print("C语言中文网：",arc)

@funA
def other_funB(name,arc):
    print(name,arc)
funB("http://c.biancheng.net")
other_funB("Python教程：","http://c.biancheng.net/python")
```

运行结果为：

![image-20200923211007339](python.assets/image-20200923211007339.png)

**函数装饰器可以嵌套**:

上面示例中，都是使用一个装饰器的情况，但实际上，`Python` 也支持多个装饰器，比如：

```python
@funA
@funB
@funC
def fun():
    #...
```

上面程序的执行顺序是里到外，所以它等效于下面这行代码：

```python
fun = funA( funB ( funC (fun) ) )
```





### 算法练习

#### 冒泡排序法

普通的冒泡排序：

```python
listToSort=[32,1,56,34,89,56]
def bubbleSort(listToSort):
    for i in range(len(listToSort)-1):
        for j in range(len(listToSort)-i-1):
            if listToSort[j]>listToSort[j+1]:
                tem=listToSort[j]
                listToSort[j]=listToSort[j+1]
                listToSort[j+1]=tem
    return listToSort
print(bubbleSort(listToSort))
```

优化版本1：添加是否排序好的标志（新的一轮排序是否需要交换位置）

```python
listToSort=[32,1,56,34,89,56]
def bubbleSort(listToSort):
    for i in range(len(listToSort)-1):
        sortedFlag=False
        for j in range(len(listToSort)-i-1):
            if listToSort[j]>listToSort[j+1]:
                tem=listToSort[j]
                listToSort[j]=listToSort[j+1]
                listToSort[j+1]=tem
                sortedFlag=True
        if not sortedFlag:
            break
    return listToSort
print(bubbleSort(listToSort))
```

优化版本2：换成双向排序（考虑到最大值和最小值分别在两端的情况）

```python
listToSort=[32,1,56,34,89,56]
def bubbleSort(listToSort):
    for i in range(len(listToSort)-1):
        sortedFlag=False
        for j in range(len(listToSort)-i-1):
            if listToSort[j]>listToSort[j+1]:
                tem=listToSort[j]
                listToSort[j]=listToSort[j+1]
                listToSort[j+1]=tem
                sortedFlag=True
        if sortedFlag:
            sortedFlag=False
            for j in range(len(listToSort)-i-2,0,-1):
                if listToSort[j]<listToSort[j-1]:
                    tem2=listToSort[j]
                    listToSort[j]=listToSort[j-1]
                    listToSort[j-1]=tem2
                    sortedFlag=True
        if not sortedFlag:
            break
    return listToSort
print(bubbleSort(listToSort))
```



#### 九九乘法表

```python
for i in range(1,10,1):
    for j in range(1,10,1):
        if i>=j:
            print(str(i)+"*"+str(j)+"="+str(i*j),end="\t")
            if i==j:
                print("\n")
```

运行结果为：

![image-20200922100843070](python.assets/image-20200922100843070.png)

#### 函数封装练习

```python
def userN():   #获取用户输入的账号和密码
    username=input("请输入账号：\n")
    password=input("请输入密码：\n")
    return username,password

def register():
    username,password=userN()
    temp=username+"|"+password
    with open(r'E:\python_projects\python_project1\source\userPassword.txt','w') as f:
        f.write(temp)


def getNick():
    with open(r'E:\python_projects\python_project1\source\userPassword.txt','r') as f:
        userInfo=f.read().split("|")
        print("欢迎来到您的主页，{}".format(userInfo[0]))

def login():
    username,password=userN()
    with open(r'E:\python_projects\python_project1\source\userPassword.txt') as f:
        userInfo=f.read().split("|")
    if userInfo[0]==username and userInfo[1]==password:
        print("登录成功了")
        getNick()
    elif userInfo[0] != username and userInfo[1] == password:
        print("账号密码错误")
    elif userInfo[0]==username and userInfo[1]!=password:
        print("还是账号面错误")
    else:
        print("你输的都是什么东西")


def exitSys():
    import sys
    print("您已经退出登录了，欢迎下次光临")
    sys.exit(1)



def main():
    while True:
        put=int(input("请选择：1.注册2.登录3.退出"))
        if put==1:
            register()
        elif put==2:
            login()
        elif put==3:
            exitSys()
        else:
            print("不要输入哪些乱七八糟的")
            continue
if __name__=='__main__':
    main()
```

运行后的效果：

![image-20200924111945220](python.assets/image-20200924111945220.png)
