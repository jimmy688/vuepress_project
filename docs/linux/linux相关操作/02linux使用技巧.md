---
title: linux使用技巧
sidebar: true
---



## vim更改缩进空格数和TAB键缩进数

> 修改vimrc配置文件：
>
> ```sh
> vi /etc/vim/vimrc
> ```
>
> 添加下面内容：
>
> ```sh
> set tabstop=4
> set shiftwidth=4
> ```
>



## ssh config

OpenSSH 允许自定义客户端连接选项，这些选项可以被存储到一个配置文件中，这个配置文件可以用来定义每个主机的配置。

本地系统的每个用户都可以维护一个客户端的 SSH 配置文件。



> 1、生成 ssh key
>
> ```sh
> ssh-keygen -t rsa
> ```
>
> 2、编辑 config 文件（无论哪个用户都可以）
>
> ```sh{1}
> vi ~/.ssh/config
> 
> #按照下面的格式添加内容
> Host centos7 
>     HostName 192.168.52.88
>     port 22
>     user root
>     IdentityFile ~/.ssh/id_rsa
> ```
>
> 3、测试
>
> ```
> ssh centos7
> ```
>
> 

## k8s配置命令别名

[参考链接](https://www.huweihuang.com/kubernetes-notes/operation/kubectl-alias.html)

```sh
# 将 .kubectl_aliases下载到 home 目录
cd ~ && wget https://raw.githubusercontent.com/ahmetb/kubectl-aliases/master/.kubectl_aliases

# 将以下内容添加到 .bashrc中，并执行 source .bashrc
[ -f ~/.kubectl_aliases ] && source ~/.kubectl_aliases
function kubectl() { command kubectl $@; }

# 如果需要提示别名的完整命令，则将以下内容添加到 .bashrc中，并执行 source .bashrc
[ -f ~/.kubectl_aliases ] && source ~/.kubectl_aliases
function kubectl() { echo "+ kubectl $@"; command kubectl $@; }
```



## 下载apt依赖包并安装

以安装ansible为例：

新建一个存放deb包的目录：

```sh
mkdir /root/ansible
cd /root/ansible
```

下载依赖包：

```sh
#查看依赖包列表
apt-cache depends --recurse --no-recommends --no-suggests --no-conflicts --no-breaks --no-replaces --no-enhances ansible | grep -v i386| grep "^\w" | sort -u

sudo apt update
sudo apt install software-properties-common
sudo apt-add-repository --yes --update ppa:ansible/ansible

#下载deb依赖包
sudo apt-get download  $(apt-cache depends --recurse --no-recommends --no-suggests --no-conflicts --no-breaks --no-replaces --no-enhances ansible | grep -v i386| grep "^\w" | sort -u)
```

安装软件：

```sh
cd /root/ansible
dpkg -i *.deb
```

参考链接：

[【Ubuntu】Ubuntu上搭建本地源，做离线安装](https://blog.csdn.net/michaelwoshi/article/details/94185132)

[How to download all dependencies and packages to directory？](https://stackoverflow.com/questions/13756800/how-to-download-all-dependencies-and-packages-to-directory)

[How to list/download the recursive dependencies of a debian package?](https://stackoverflow.com/questions/22008193/how-to-list-download-the-recursive-dependencies-of-a-debian-package)

[How To Create A Local Debian/Ubuntu Mirror With apt-mirror?](https://www.howtoforge.com/local_debian_ubuntu_mirror)

[How do I download a package from apt-get without installing it?](https://stackoverflow.com/questions/4419268/how-do-i-download-a-package-from-apt-get-without-installing-it)

[How to download .deb package and all dependencies?](https://superuser.com/questions/876727/how-to-download-deb-package-and-all-dependencies)

[How to list all packages from a repository in ubuntu / debian?](https://serverfault.com/questions/252333/list-all-packages-from-a-repository-in-ubuntu-debian)



## python依赖包下载

创建依赖包存放目录：

```sh
mkdir /root/netaddr
cd /root/netaddr
```

下载pip包：

```sh
#下载语法：pip download -d save_path packages 
pip3 download -d ./ netaddr
```

创建requirements.txt ：

```
pip3 freeze > requirements.txt
```

离线安装：

```sh
pip3 install  --no-index --find-links=./  -r requirements.txt 
```

:::warning

未验证通过

:::



































