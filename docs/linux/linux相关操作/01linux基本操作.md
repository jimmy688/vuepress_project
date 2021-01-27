---
title: linux基本操作
sidebar: true
---



## linux系统安装

**ubuntu系统安装：**

1、下载iso文件：[ubuntu旧版本iso文件下载](http://old-releases.ubuntu.com/releases)

```
ubuntu-18.04.4-server-amd64.iso      (这个是amd64 LTS版本)
ubuntu-18.04.4-server-arm64.iso      (这个是arm64 LTS版本)
```

2、安装系统

3、安装openssh-server

```sh
apt-get install openssh-server
```

4、配置root密码：

```sh
sudo passwd root
```

4、安装vim

```sh
apt-get install -y vim
```

5、配置允许`root`用户登录，打开注释，将`prohibit-password`改为`yes`

```sh{3,4}
vi /etc/ssh/sshd_config

#PermitRootLogin prohibit-password
PermitRootLogin yes
```



## 配置静态ip

**centos配置静态IP**

1、修改配置文件

```sh{1}
vi /etc/sysconfig/network-scripts/ifcfg-网卡名称

BOOTPROTO="static"
IPADDR=192.168.52.88
DNS1=114.114.114.114
NETMASK=255.255.255.0
GATEWAY=192.168.52.2
```

2、重启网络服务

```sh
systemctl restart network
```

**ubuntu配置静态IP**

1、修改`/etc/netplan`下的`yaml`文件：

```sh
vi /etc/netplan/*.yaml
```

初始DHCP方式的内容：

```sh
network:
  version: 2
  renderer: networkd
  ethernets:
    ens33:
      dhcp4: yes
```

修改成静态IP：

```sh
network:
  version: 2
  renderer: networkd
  ethernets:
    ens33:
      dhcp4: no
      addresses: [192.168.52.142/24]
      optional: true
      gateway4: 192.168.52.2
      nameservers:
      	addresses: [114.114.114.114,8.8.8.8]
```

[解决域名解析问题](https://www.tecmint.com/resolve-temporary-failure-in-name-resolution/)：

```sh{1,4,6,7,9}
vi /etc/resolv.conf 
#如果不存在就自己创建
#添加以下内容：
nameserver 8.8.8.8
#执行下面命令：
sudo systemctl restart systemd-resolved.service
sudo systemctl status systemd-resolved.service
#验证
ping baidu.com
```

