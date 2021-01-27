---
title: linux通用命令
sidebar: true
collapsable: true
---

## 文件和目录

```sh
#回上次所在的目录 
cd - 
#显示包含数字的文件或目录
ls | grep [0-9]
#递归创建目录
mkdir -p /01/02
#同时创建多个目录
mkdir 01 02 03
#删除目录并同时删除其内容
rm -rf dir01
#同时删除多个目录并同时删除其内容
rm -rf dir01 dir02
#复制一个文件
cp file01 file02
#复制目录下的所有文件
cp dir01/* dir02/
#复制一个目录
cp -r dir01 dir02/
#创建一个空文件
touch file01
```

## 查看文件内容

```sh
cat
tail -f 实时查看
tail -n 查看最后n行
head -n 查看前n行
more
less

# more和less的相关操作：
#	 Enter 向下n行，需要定义。默认为1行
#    Ctrl+F 向下滚动一屏
#    空格键 向下滚动一屏
#    Ctrl+B 返回上一屏
#    = 输出当前行的行号
#    q 退出more
```



## 搜索文件

**查找当前目录下包含指定内容的文件：**

```sh
grep -rni "content"
#或者
grep "content" -r ./
#或者
grep -l "content" ./*.txt
```

:::tip

`-r`参数表示递归查找当前目录的文件，`-n`会显示查找位置的行号，`-i`搜索时忽略大小写

::: 

**根据文件名查找文件：**

```sh
find / -name "content"
find / -name "*content*"  # 使用通配符*(0或者任意多个)
```

**根据文件大小查找文件：**

```sh
find / -size +100M #大于100M
find / -size -100M #小于100M
```

:::tip

`c:字节，w:双字，k:KB，M:MB，G:GB`

:::

**根据访问时间查找文件：**

```sh
find / -amin -10   # 查找在系统中最后10分钟访问的文件(access time)
find / -atime -2　　# 查找在系统中最后48小时访问的文件
```

**根据修改时间查找文件：**

```sh
find / -mmin -5 　　 # 查找在系统中最后5分钟里修改过的文件(modify time)
find / -mtime -1 　 # 查找在系统中最后24小时里修改过的文件
```

**查找命令的可执行文件的路径：**

```sh
which 可执行命令
```

**查找命令的查找二进制文件、源代码文件和man手册页路径：**

```sh
whereis 可执行命令
```



## 搜索文件内容

**使用grep搜索指定文件的内容：**

```sh
grep --color "apulis" /root/apulis.txt  #高亮查找的字符串
grep -v "apulis" /root/apulis.txt     #搜索不包含特定内容的行
grep -i "apulis" /root/apulis.txt     #不区分大小写
grep '^apulis' /root/apulis.txt       #利用表达式，搜索特定内容开头的行
```

:::tip

grep只支持基本正则表达式：

- 在基本正则表达式（BRE）中，只承认`“^”、“$”、“.”、“[”、“]”、“*”`这些是元字符，所有其他的字符都被识别为普通字符。

:::

## 打包和压缩

**打tar包与解tar包：**

```sh
tar -cvf hello.tar ./backup
tar -xvf hello.tar

-c 打包
-x 解包
```

**gzip格式压缩与解压：**

```sh
gzip hello.txt  #压缩单个文件，原文件会被删除
gzip -r ./backup  # 递归压缩指定文件夹下的文件,这个文件夹不会被压缩，只会压缩里面的每一个文件

gunzip backup.gz   #解压
```

:::tip

最常用的是将`tar`命令与`gzip`命令组合起来，直接对文件夹先打包后压缩。

:::

---

**打tar包然后使用gzip压缩（.tar.gz）：**

```sh
tar -zcvf hello.tar.gz ./backup
```

**解压tar包：**

```sh
tar -cvf hello.tar   #解压到当前路径
tar -cvf hello.tar -C /root/    #解压到指定路径
```

**解压tar.gz包：**

```sh
tar -zxvf hello.tar.gz  #解压到当前路径
tar -zxvg hello.tar.gz -C /root/   #解压到指定路径
```

**zip压缩与解压：**

```sh
zip file1 file2 ...
unzip [选项] file
	-n　#解压缩时不覆盖已存在的文件(而是跳过)
	-d  #将文件解压到指定路径
```







## vim使用技巧

[参考链接](https://www.cnblogs.com/momofan/p/5936203.html)

> 1、删除光标所在行：dd
>
> 2、删除所有内容：按esc键后，先按gg（到达顶部），然后dG
>
> 3、复制所有内容：按esc键后，先按gg（到达顶部），然后VG，使用鼠标拖拉选定要复制的内容，点击复制
>
> 4、移动光标到文档首行： gg
>
> 5、移动光标到文档尾行：G
>
> 6、向下翻页： ctrl + f 
>
> 7、向上翻页：ctrl + b 
>
> 8、向下翻半页   ctrl + d   此比较有用
>
> 9、向上翻半页  ctrl + u    此比较有用
>
> 10、**撤销：u**
>
> 11、移动到行首/行尾：Home / End
>
> 12、修改为paste模式（取消自动缩进）：输入:set paste回车，然后按insert
>
> 13、查找：/查找的内容，回车，按n查找下一个
>
> 14、显示行数： :set number
>
> 15、跳到第n 行：:n
>
> 16、光标所在行向左移动一个 tab： 输入<<
>
> 17、光标所在行向右移动一个 tab:     输入>>



## 软链接

**创建软链接：**

将01目录软链接到02：

```sh
ln -s 01 02
```

创建软连接时，不用创建文件夹，即不需要提前创建02。

例子：

```sh{4}
mkdir 01
ln -s 01 02

lrwxrwxrwx. 1 root root    2 1月  23 17:25 02 -> 01
```

**删除软链接：**

```sh
正确做法：rm -rf 02
错误做法：rm -rf 02/    这种做法会导致删除实际数据
```

## 挂载与卸载

参考链接：https://www.cnblogs.com/isme-zjh/p/11421334.html

首先插入U盘或硬盘：

**查询本机可以识别的硬盘和分区：**

```
fdisk -l   #通过这个命令可以知道有哪些没被挂载的U盘
```

**挂载：**

```sh
mount /dev/sda /mnt/test   #/mnt/test必须实现存在，而且是空目录
```

**以只读方式挂载：**

```sh
mount -r /dev/sda /mnt/test
```

**卸载：**

```sh
umount /dev/sda
或者
umount /mnt/test
#注意：不能进入挂载的目录下进行卸载
```

**强制卸载繁忙中的设备：**

```sh
fuser -km /dev/sda
```

**开机自动挂载：**

:warning:谨慎操作，否则会导致开机失败

```sh
vi /etc/fstab #添加要自动挂载的设备

#要挂载的设备或伪文件系统  挂载点 文件系统类型  挂载选项 转储频率 自检次序(一般只有rootfs才用1)
#UUID=6efb8a23-bae1-427c-ab10-3caca95250b1 /boot  xfs    defaults    0 0
```

## 查看磁盘空间

**df与du：**

查看磁盘空间：`df -h`

```sh{1}
$df -h
文件系统                   1K-块    已用     可用 已用% 挂载点
devtmpfs                  485868       0   485868    0% /dev
tmpfs                     497872       0   497872    0% /dev/shm
tmpfs                     497872    7872   490000    2% /run
tmpfs                     497872       0   497872    0% /sys/fs/cgroup
/dev/mapper/centos-root 17811456 3790808 14020648   22% /
/dev/sda1                1038336  139252   899084   14% /boot
tmpfs                      99576       0    99576    0% /run/user/0
```

查看当前目录的大小：du -sh

**查看当前目录下的文件夹的大小**（不包括文件）：`du -h --max-depth=1`

查看某个文件的大小：`du -h 文件名`

## 用户和用户组

**添加新用户：**

- `useradd 用户名`
- `useradd -s xxx 用户名`（指定用户登录的shell）如：`useradd -s /bin/sh sam`

**删除用户：**

- `userdel 用户名`

- `userdel -r 用户名`（把用户的主目录一起删除）

**设置用户密码：**

```sh
#修改用户密码
passwd 用户名

#修改用户密码为空（用户下一次登录时，系统就不再允许该用户登录了）
passwd -d 用户名

#锁定某一用户，使其不能登录
passwd -l 用户名
```

**添加用户组：**`groupadd 用户组`

**删除用户组：**`groupdel 用户组`

## 文件权限

修改权限：

**1、给单个文件添加或减少权限:**

```sh
chmod ugo+r 文件名
chmod ugo-r 文件名
或 
chmod a+r  文件名
chmod a-r  文件名
```

**2、给当前目录下的所有文件或目录添加权限：**

```sh
chmod -R a+rw *
```

**3、通过数字设定权限：**

```sh
chmod 777 文件名
chmod 600 文件名
...

rwx = 111 = 7
rw- = 110 = 6
r-x = 101 = 5
r-- = 100 = 4
-wx = 011 = 3
-w- = 010 = 2
--x = 001 = 1
--- = 000 = 0
```

**4、更改文件的拥有者**

```sh
# chown 用户名:用户组 [文件1、文件2...]
chown tom:users file1 file2 file3   #同时修改多个文件的拥有者
```



## 文本处理

Linux有两个主要的文本数据处理工具，sed和awk。

**:arrow_forward:sed（流编辑器）：**

sed主要是以**行**为单位进行处理，可以将数据行进行替换、删除、新增、选取等特定工作。[参考链接](https://blog.51cto.com/13466287/2066532)

**p 输出特定的行：**

```sh
sed -n 'p' hello.txt
#    p	输出1.txt的所有行
#    2p	输出1.txt的第二行
#    2，5p	输出1.txt的第二行到第五行
#    2，+5p	输出1.txt的第二行和第二行以后的5行
#    1～2p	输出第一行，每隔两行输出一行，也就是输出奇数行
```

**p 输出包含某内容的行：**

```sh
sed -n '/hadoop/p' hello.txt
sed -n '/[0-9]/p' hello.txt   #结合正则表达式
```

:warning:`-n` 作用是屏蔽默认输出；如果不加`-n`选项，会重复输出输出满足条件的行，建议加上。

**d 删除特定的行并输出未删除的行：**

```sh
sed '2d' hello.txt
#	2d 删除第2行
#	2,3d 删除第2到第3行
```

**d 删除包含特定内容的行并输出未删除的行：**

```sh
sed '/hadoop/d' hello.txt
sed '/^[0-9]/d' hello.txt
```

**s 替换行中的特定内容并输出每一行：**

```sh
sed 's/old/new/' 1.txt
sed 's/hadoop/spark/' 1.txt
```

:warning:上面所有的sed命令都不会修改源文件，除非加上 `-i` 选项。



---

**:arrow_forward:awk：**

默认情况下，awk 会将如下变量分配给它在文本行中发现的数据字段：

- `$0` 代表整个文本行；
- `$1` 代表文本行中的第 1 个数据字段；
- `$2` 代表文本行中的第 2 个数据字段；
- `$n` 代表文本行中的第 n 个数据字段。

**打印某一列：**

```sh{1,5}
$ cat hello.txt
One line of test text.
Two lines of test text.
Three lines of test text.
$ cat hello.txt | awk '{print $1}'
One
Two
Three
```

**根据列是否包含内容来打印列：**

```sh{1,5}
$ cat hello.txt
One line of test apulis.
Two lines of test text.
Three lines of test text.
$ cat hello.txt | awk '$5 ~ /apulis/ {print $1,$4}'
One test    #打印第5列中包含apulis的行的第1和第4列
```

**根据列的值来打印列：**

```sh{1,6}
$ cat hello.txt
1 hadoop
3 flink
6 spark
4 flume
$ cat hello.txt | awk '$1>4 {print $2}'
spark   #打印第1列大于4的行的第2列
```

:warning:上面例子都是通过管道符来作为awk的输入。使用中，也可以使用文件作为awk的输入，如 `awk '{print $1}' hello.txt`。



## 网络

`ifconfig`命令

- `ifconfig`：查看网络状态（能查看IP地址和子网掩码，但是不能查看网关和DNS地址），还可以临时设置某一网卡的IP地址和子网掩码。

关闭与启动网卡

- `ifdown 网卡设备名`：禁用该网卡设备。
- `ifup 网卡设备名`：启用该网卡设备。

查询网络状态

- `netstat 选项`（可以用于查看当前计算机开放的端口，从而判断当前计算机启动了哪些服务）
- `netstat -ntlp` 

域名解析：

- `nslookup [主机名或IP]`：进行域名或IP地址的解析

**下载命令：**[参考链接](https://www.linuxidc.com/Linux/2015-05/117381.htm)

:arrow_forward:1、`curl`下载命令：

```sh
curl -o baidu.html www.baidu.com
curl –s –o baidu.html www.baidu.com |iconv -f utf-8  #减少输出信息
```

```sh
常用参数如下：
-c，--cookie-jar：将cookie写入到文件
-b，--cookie：从文件中读取cookie
-C，--continue-at：断点续传
-d，--data：http post方式传送数据
-D，--dump-header：把header信息写入到文件
-F，--from：模拟http表达提交数据
-s，--slient：减少输出信息
-o，--output：将信息输出到文件
-O，--remote-name：按照服务器上的文件名，存在本地
--l，--head：仅返回头部信息
-u，--user[user:pass]：设置http认证用户和密码
-T，--upload-file：上传文件
-e，--referer：指定引用地址
-x，--proxy：指定代理服务器地址和端口
-w，--write-out：输出指定格式内容
--retry：重试次数
--connect-timeout：指定尝试连接的最大时间/s
```

:arrow_forward:2、wget下载命令：

```sh
wget http://nginx.org/download/nginx-1.8.0.tar.gz
```

## 查看系统信息

`uname -a`： 查看内核/操作系统/CPU信息 。  [参考链接](https://www.runoob.com/linux/linux-comm-uname.html)

`env`：查看环境变量。

`uptime`： 查看系统运行时间、用户数、负载。

`fdisk -l`  ：查看所有分区。

`top` ：实时显示进程状态用户 。

`ps -ef`：  查看所有进程

`arch`：查看系统架构

## 其它命令

统计当前目录下，文件或者目录的总个数：

```sh
ls | wc -l
```

以大小为依据依次显示文件和目录的大小 

```sh
$ du -skh * | sort -rn
63M     docker.github.io-master
43M     docker.github.io-master.zip
```

`systemctl`命令：

```sh
systemctl stop/start/restart/disable/enable service.name
```

`hostnamectl` 设置主机名：

```sh
hostnamectl set-hostname xxx
```

**别名：**

> 查看别名
>
> ```sh
> alias vi
> ```
>
> 临时设置别名：
>
> ```sh
> alias kgn='kubectl get nodes'
> ```
>
> 永久设置别名：
>
> ```sh
> vi ~/.bashrc
> #添加别名：
> alias kgn='kubectl get nodes'
> ```
>
> 取消别名：
>
> ```sh
> unalias kgn
> ```
>
> 让别名