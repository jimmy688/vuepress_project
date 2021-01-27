---
title: centos命令
sidebar: true包yum
---

## yum命令

**安装包：**

```sh
yum install 包名
```

**更新包：**

```sh
yum update 包名   #更新一个包
yum update       #更新所有的包
```

**删除包：**

```sh
yum remove 包名
```

**列出所有已安装的包：**

```sh
yum list
```

**查找命令存在哪个包**（不知道要安装什么包的时候使用）：

```sh
yum provides  */命令名称
```

**更换yum源：**

```sh{2,6,7,8,10,11}
#1、备份配置文件
mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup
#2、下载对应版本 repo 文件, 放入 /etc/yum.repos.d/ (操作前请做好相应备份)
# CentOS6 ：http://mirrors.163.com/.help/CentOS6-Base-163.repo
# CentOS7 ：http://mirrors.163.com/.help/CentOS7-Base-163.repo
cd /etc/yum.repos.d/
wget http://mirrors.163.com/.help/CentOS6-Base-163.repo
mv CentOS6-Base-163.repo CentOS-Base.repo
#3、运行以下命令生成缓存
yum clean all
yum makecache
```

:warning:除了网易之外，国内还有其他不错的 yum 源，比如中科大和搜狐。

- [中科大的 yum 源](https://lug.ustc.edu.cn/wiki/mirrors/help/centos)