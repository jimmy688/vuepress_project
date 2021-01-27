## kubernetes的介绍

学习链接：

- 尚硅谷kubernetes教程：https://pan.baidu.com/s/1U6-AXHj5gsDsAHSXeoKnRg 提取码：tdpk
- https://jimmysong.io/kubernetes-handbook/concepts/
- https://www.kubernetes.org.cn/k8s
- https://kuboard.cn/learning/



Kubernetes是一个可以移植、可扩展的开源平台，使用 [声明式的配置](https://kuboard.cn/learning/k8s-intermediate/workload/wl-deployment/#deployment-概述) 并依据配置信息自动地执行容器化应用程序的管理。在所有的**容器编排工具**中（类似的还有 docker swarm / mesos等），Kubernetes的生态系统更大、增长更快，**有更多的支持、服务和工具**可供用户选择。

kubernetes起源于希腊，是领航员、舵手的意思。Google于2014年将Borg系统开源为Kubernetes。Kubernetes构建在Google **Borg** [十五年运行大规模分布式系统的经验 (opens new window)](https://ai.google/research/pubs/pub43438)基础之上，并结合了开源社区最好的想法和实践。

**部署应用程序的方式**

![Kubernetes教程_部署方式演化](kubernetes.assets/container_evolution.cb55fb19.svg)

传统部署时代：企业直接将应用程序部署在物理机上。由于物理机上不能为应用程序定义资源使用边界，我们也就很难合理地分配计算资源

虚拟化部署时代：用户可以在单台物理机的CPU上运行多个虚拟机（Virtual Machine）。

- 虚拟化技术使得应用程序被虚拟机相互分隔开，限制了应用程序之间的非法访问，进而提供了一定程度的安全性。
- 虚拟化技术提高了物理机的资源利用率，可以更容易地安装或更新应用程序，降低了硬件成本，因此可以更好地规模化实施。

容器化部署时代：容器与虚拟机类似，但是降低了隔离层级，共享了操作系统。因此，容器可以认为是轻量级的。

**容器流行的好处**

- **敏捷地创建和部署应用程序**：相较于创建虚拟机镜像，创建容器镜像更加容易和快速
- **分离开发和运维的关注点**：在开发构建阶段就完成容器镜像的构建，构建好的镜像可以部署到多种基础设施上。
- **松耦合、分布式、弹性、无约束的微服务**：应用程序被切分成更小的、独立的微服务，并可以动态部署和管理，而不是一个部署在专属机器上的庞大的单片应用程序
- 等等....

**kubernetes的功能**

Kubernetes可以处理应用程序的伸缩、failover、部署模式等多种需求。

Kubernetes提供的特性有：

- **服务发现和负载均衡**

  Kubernetes 可以通过 DNS 名称或 IP 地址暴露容器的访问方式。并且可以在同组容器内分发负载以实现负载均衡

- **存储编排**

  Kubernetes可以自动挂载指定的存储系统，例如 local stroage/nfs/云存储等

- **自动发布和回滚**

  您可以在 Kubernetes 中声明您期望应用程序容器应该达到的状态，Kubernetes将以合适的速率调整容器的实际状态，并逐步达到最终期望的结果。请参考 [声明式的配置](https://kuboard.cn/learning/k8s-intermediate/workload/wl-deployment/#deployment-概述)

- **自愈**

  Kubernetes提供如下自愈能力：

  - 重启已经停机的容器
  - 替换、kill 那些不满足自定义健康检查条件的容器
  - 在容器就绪之前，避免调用者发现该容器

- **密钥及配置管理**

  Kubernetes可以存储和管理敏感信息（例如，密码、OAuth token、ssh密钥等）。您可以更新容器应用程序的密钥、配置等信息，而无需：

  - 重新构建容器的镜像
  - 在不合适的地方暴露密码信息

**Kubernetes的边界**

Kubernetes不是一个传统意义的、保罗万象的 PaaS（Platform as a Service）系统。Kubernetes在容器层面工作，而不是硬件层面，它提供了与 PaaS 平台相似的通用特性，例如：部署、伸缩、负载均衡、日志、监控等。然而，Kubernetes并不是一个单一整体，这些特性都是可选、可插拔的。Kubernetes提供用于搭建开发平台的基础模块，同时为用户提供了不同模块的选择性和多样性。

Kubernetes：

- 不限制应用程序的类型。Kubernetes的目标是广泛支持不同类型的工作负载，包括：有状态、无状态、数据处理等类型的应用。只要应用可以在容器中运行，就能够非常好地在 Kubernetes 上运行

- 不部署源码、不编译或构建应用程序。持续集成、分发、部署（CI/CD）的工作流极大程度上取决于组织的文化、偏好以及技术要求。Kubernetes可以作为部署平台参与到 CI/CD 流程，但是不涉及镜像构建和分发的过程

  > 译者注：可选的有 Jenkins / Gitlab Runner / docker registry / harbour 等

- 不提供应用程序级别的服务，包括：中间件（例如，消息总线）、数据处理框架（例如，Spark）、数据库（例如，mysql）、缓存（例如，Redis），或者分布式存储（例如，Ceph）。此类组件可以在 Kubernetes 上运行，或者可以被运行在 Kubernetes 上的应用程序访问

- 不限定日志、监控、报警的解决方案。Kubernetes 提供一些样例展示如何与日志、监控、报警等组件集成，同时提供收集、导出监控度量（metrics）的一套机制。您可以根据自己的需要选择日志、监控、报警组件

  > 译者注：可选的有 ELK / Prometheus / Graphana / Pinpoint / Skywalking / Metrics Server 等

- 不提供或者限定配置语言（例如，jsonnet）。Kubernetes提供一组声明式的 API，您可以按照自己的方式定义部署信息。

  > 译者注：可选的有 helm/kustomize/kubectl/kubernetes dashboard/kuboard/octant/k9s 等

- 不提供或限定任何机器的配置、维护、管理或自愈的系统。

  > 译者注：在这个级别上，可选的组件有 puppet、ansible、open stack 等

- 此外，Kubernetes不是一个纯粹意义上的容器编排系统。事实上，Kubernetes 消除了容器编排的需求。容器编排的技术定义是`预定义流程的执行`（先做A、再做B、然后做C）。与此相对应，Kubernetes构建了一系列相互独立、可预排的控制过程，以持续不断地将系统从当前状态调整到声明的目标状态。如何从 A 达到 C，并不重要。集中化的控制也就不需要了。这个设计思想使得Kubernetes使用更简单、更强大、稳健、反脆弱和可扩展。



## kubernetes架构

### Borg简介

Borg是谷歌内部的大规模集群管理系统，负责对谷歌内部很多核心服务的调度和管理。Borg的目的是让用户能够不必操心资源管理的问题，让他们专注于自己的核心业务，并且做到跨多个数据中心的资源利用率最大化。

Borg主要由BorgMaster、Borglet、borgcfg和Scheduler组成，如下图所示

![Borg架构](kubernetes.assets/borg.png)

- BorgMaster是整个集群的大脑，负责维护整个集群的状态，并将数据持久化到Paxos存储中；
- Scheduer负责任务的调度，根据应用的特点将其调度到具体的机器上去；
- Borglet负责真正运行任务（在容器中）；
- borgcfg是Borg的命令行工具，用于跟Borg系统交互，一般通过一个配置文件来提交任务。

### kubernetes架构

Kubernetes借鉴了Borg的设计理念，比如Pod、Service、Label和单Pod单IP等。Kubernetes的整体架构跟Borg非常像，如下图所示。

![Kubernetes架构](kubernetes.assets/architecture.png)

Kubernetes主要由以下几个核心组件组成：

- etcd保存了整个集群的状态；
- apiserver提供了资源操作的唯一入口，并提供认证、授权、访问控制、API注册和发现等机制；
- controller manager负责维护集群的状态，比如故障检测、自动扩展、滚动更新等；
- scheduler负责资源的调度，按照预定的调度策略将Pod调度到相应的机器上；
- kubelet负责维护容器的生命周期，同时也负责Volume（CSI）和网络（CNI）的管理；
- Container runtime负责镜像管理以及Pod和容器的真正运行（CRI）；
- kube-proxy负责为Service提供cluster内部的服务发现和负载均衡；

除了核心组件，还有一些推荐的插件，其中有的已经成为CNCF中的托管项目：

- CoreDNS负责为整个集群提供DNS服务
- Ingress Controller为服务提供外网入口
- Prometheus提供资源监控
- Dashboard提供GUI
- Federation提供跨可用区的集群

下图清晰表明了Kubernetes的架构设计以及组件之间的通信协议。

![image-20201117182651823](kubernetes.assets/image-20201117182651823.png)

下面是更抽象的一个视图：

![image-20201117185903668](kubernetes.assets/image-20201117185903668.png)



Master架构

![image-20201117185918518](kubernetes.assets/image-20201117185918518.png)



Node架构

![image-20201117190006428](kubernetes.assets/image-20201117190006428.png)



## kubernetes组件

### [Master组件](https://kuboard.cn/learning/k8s-bg/component.html#master组件)

Master组件是集群的控制平台（control plane）：

- master 组件负责集群中的全局决策（例如，调度）
- master 组件探测并响应集群事件（例如，当 Deployment 的实际 Pod 副本数未达到 `replicas` 字段的规定时，启动一个新的 Pod）

Master组件可以运行于集群中的任何机器上。但是，为了简洁性，通常在同一台机器上运行所有的 master 组件，且不在此机器上运行用户的容器。参考 [安装Kubernetes高可用](https://kuboard.cn/install/install-kubernetes.html)。

#### [kube-apiserver](https://kuboard.cn/learning/k8s-bg/component.html#kube-apiserver)

此 master 组件提供 Kubernetes API。这是Kubernetes控制平台的前端（front-end），可以水平扩展（通过部署更多的实例以达到性能要求）。kubectl / kubernetes dashboard / kuboard 等Kubernetes管理工具就是通过 kubernetes API 实现对 Kubernetes 集群的管理。

#### [etcd](https://kuboard.cn/learning/k8s-bg/component.html#etcd)

支持一致性和高可用的名值对存储组件，Kubernetes集群的所有配置信息都存储在 etcd 中。请确保您 [备份 (opens new window)](https://kubernetes.io/docs/tasks/administer-cluster/configure-upgrade-etcd/#backing-up-an-etcd-cluster)了 etcd 的数据。关于 etcd 的更多信息，可参考 [etcd 官方文档(opens new window)](https://etcd.io/docs/)

#### [kube-scheduler](https://kuboard.cn/learning/k8s-bg/component.html#kube-scheduler)

此 master 组件监控所有新创建尚未分配到节点上的 Pod，并且自动选择为 Pod 选择一个合适的节点去运行。

影响调度的因素有：

- 单个或多个 Pod 的资源需求
- 硬件、软件、策略的限制
- 亲和与反亲和（affinity and anti-affinity）的约定
- 数据本地化要求
- 工作负载间的相互作用

#### [kube-controller-manager](https://kuboard.cn/learning/k8s-bg/component.html#kube-controller-manager)

此 master 组件运行了所有的控制器

逻辑上来说，每一个控制器是一个独立的进程，但是为了降低复杂度，这些控制器都被合并运行在一个进程里。

kube-controller-manager 中包含的控制器有：

- 节点控制器： 负责监听节点停机的事件并作出对应响应
- 副本控制器： 负责为集群中每一个 副本控制器对象（Replication Controller Object）维护期望的 Pod 副本数
- 端点（Endpoints）控制器：负责为端点对象（Endpoints Object，连接 Service 和 Pod）赋值
- Service Account & Token控制器： 负责为新的名称空间创建 default Service Account 以及 API Access Token

### [Node 组件](https://kuboard.cn/learning/k8s-bg/component.html#node-组件)

Node 组件运行在每一个节点上（包括 master 节点和 worker 节点），负责维护运行中的 Pod 并提供 Kubernetes 运行时环境。

#### [kubelet](https://kuboard.cn/learning/k8s-bg/component.html#kubelet)

此组件是运行在每一个集群节点上的代理程序。它确保 Pod 中的容器处于运行状态。Kubelet 通过多种途径获得 PodSpec 定义，并确保 PodSpec 定义中所描述的容器处于运行和健康的状态。Kubelet不管理不是通过 Kubernetes 创建的容器。

#### [kube-proxy](https://kuboard.cn/learning/k8s-bg/component.html#kube-proxy)

[kube-proxy](https://kuboard.cn/learning/k8s-intermediate/service/service-details.html#虚拟-ip-和服务代理) 是一个网络代理程序，运行在集群中的每一个节点上，是实现 Kubernetes Service 概念的重要部分。

kube-proxy 在节点上维护网络规则。这些网络规则使得您可以在集群内、集群外正确地与 Pod 进行网络通信。如果操作系统中存在 packet filtering layer，kube-proxy 将使用这一特性（[iptables代理模式](https://kuboard.cn/learning/k8s-intermediate/service/service-details.html#iptables-代理模式)），否则，kube-proxy将自行转发网络请求（[User space代理模式](https://kuboard.cn/learning/k8s-intermediate/service/service-details.html#user-space-代理模式)）

#### [容器引擎](https://kuboard.cn/learning/k8s-bg/component.html#容器引擎)

容器引擎负责运行容器。Kubernetes支持多种容器引擎：[Docker (opens new window)](http://www.docker.com/)、[containerd (opens new window)](https://containerd.io/)、[cri-o (opens new window)](https://cri-o.io/)、[rktlet (opens new window)](https://github.com/kubernetes-incubator/rktlet)以及任何实现了 [Kubernetes容器引擎接口 (opens new window)](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/container-runtime-interface.md)的容器引擎

### [Addons](https://kuboard.cn/learning/k8s-bg/component.html#addons)

addons叫做附加组件或者插件。

Addons 使用 Kubernetes 资源（DaemonSet、Deployment等）实现集群的功能特性。由于他们提供集群级别的功能特性，addons使用到的Kubernetes资源都放置在 `kube-system` 名称空间下。

下面描述了一些经常用到的 addons，参考 [Addons (opens new window)](https://kubernetes.io/docs/concepts/cluster-administration/addons/)查看更多列表。

#### [DNS](https://kuboard.cn/learning/k8s-bg/component.html#dns)

除了 DNS Addon 以外，其他的 addon 都不是必须的，所有 Kubernetes 集群都应该有 [Cluster DNS](https://kuboard.cn/learning/k8s-intermediate/service/dns.html)

Cluster DNS 是一个 DNS 服务器，是对您已有环境中其他 DNS 服务器的一个补充，存放了 Kubernetes Service 的 DNS 记录。

Kubernetes 启动容器时，自动将该 DNS 服务器加入到容器的 DNS 搜索列表中。

> 如果您参考 www.kuboard.cn 上提供的文档安装 Kubernetes，默认已经安装了 [Core DNS(opens new window)](https://coredns.io/)

#### [Web UI（Dashboard）](https://kuboard.cn/learning/k8s-bg/component.html#web-ui-dashboard)

[Dashboard (opens new window)](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/)是一个Kubernetes集群的 Web 管理界面。用户可以通过该界面管理集群。

#### [Kuboard](https://kuboard.cn/learning/k8s-bg/component.html#kuboard)

[Kuboard](https://kuboard.cn/install/install-dashboard.html) 是一款基于Kubernetes的微服务管理界面，相较于 Dashboard，Kuboard 强调：

- 无需手工编写 YAML 文件
- 微服务参考架构
- 上下文相关的监控
- 场景化的设计
  - 导出配置
  - 导入配置

#### [ContainerResource Monitoring](https://kuboard.cn/learning/k8s-bg/component.html#containerresource-monitoring)

[Container Resource Monitoring (opens new window)](https://kubernetes.io/docs/tasks/debug-application-cluster/resource-usage-monitoring/)将容器的度量指标（metrics）记录在时间序列数据库中，并提供了 UI 界面查看这些数据

#### [Cluster-level Logging](https://kuboard.cn/learning/k8s-bg/component.html#cluster-level-logging)

[Cluster-level logging (opens new window)](https://kubernetes.io/docs/concepts/cluster-administration/logging/)机制负责将容器的日志存储到一个统一存储中，并提供搜索浏览的界面



## kubernetes安装

### 单节点安装

配置要求：

- 至少2台 **2核4G** 的服务器
- **Cent OS 7.6 / 7.7 / 7.8**

**安装后的软件版本为**

- Kubernetes v1.19.x
  - calico 3.13.1
  - nginx-ingress 1.5.5
- Docker 19.03.11

安装前置条件：

- 任意节点 centos 版本为 7.6 / 7.7 或 7.8
- 任意节点 CPU 内核数量大于等于 2，且内存大于等于 4G
- 任意节点 hostname 不是 localhost，且不包含下划线、小数点、大写字母
- 任意节点都有固定的内网 IP 地址
- 任意节点都只有一个网卡，如果有特殊目的，我可以在完成 K8S 安装后再增加新的网卡
- 任意节点上 Kubelet使用的 IP 地址 可互通（无需 NAT 映射即可相互访问），且没有防火墙、安全组隔离
- 任意节点不会直接使用 docker run 或 docker-compose 运行容器



#### 下载centos镜像

centos iso文件下载链接：

- https://mirrors.aliyun.com/centos/?spm=a2c6h.13651104.0.0.5f6612b2AyMJ5i
- http://vault.centos.org/
- https://vault.centos.org/7.7.1908/isos/x86_64/

#### 检查 centos / hostname

```sh
## 在 master 节点和 worker 节点都要执行
cat /etc/redhat-release

## 此处 hostname 的输出将会是该机器在 Kubernetes 集群中的节点名字
## 不能使用 localhost 作为节点的名字
hostname

## 请使用 lscpu 命令，核对 CPU 信息
## Architecture: x86_64    本安装文档不支持 arm 架构
## CPU(s):       2         CPU 内核数量不能低于 2
lscpu
```

设置hostname:

```sh
## 修改 hostname
hostnamectl set-hostname your-new-host-name
## 查看修改结果
hostnamectl status
## 设置 hostname 解析
echo "127.0.0.1   $(hostname)" >> /etc/hosts
```

修改cpu数量的方法：

![image-20201221143718889](kubernetes.assets/image-20201221143718889.png)



#### 检查网络

```sh
[root@demo-master-a-1 ~]$ ip route show
default via 172.21.0.1 dev eth0 
169.254.0.0/16 dev eth0 scope link metric 1002 
172.21.0.0/20 dev eth0 proto kernel scope link src 172.21.0.12 

[root@demo-master-a-1 ~]$ ip address
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 00:16:3e:12:a4:1b brd ff:ff:ff:ff:ff:ff
    inet 172.17.216.80/20 brd 172.17.223.255 scope global dynamic eth0
       valid_lft 305741654sec preferred_lft 305741654sec
```

kubelet使用的IP地址

- `ip route show` 命令中，可以知道机器的默认网卡，通常是 `eth0`，如 ***default via 172.21.0.23 dev eth0***
- `ip address` 命令中，可显示默认网卡的 IP 地址，Kubernetes 将使用此 IP 地址与集群内的其他节点通信，如 `172.17.216.80`
- 所有节点上 Kubernetes 所使用的 IP 地址必须可以互通（无需 NAT 映射、无安全组或防火墙隔离）

**配置静态ip：**

```sh
vi /etc/sysconfig/network-scripts/ifcfg-ens33 
TYPE="Ethernet"
PROXY_METHOD="none"
BROWSER_ONLY="no"
BOOTPROTO="static"   #这里要修改成static
DEFROUTE="yes"
IPV4_FAILURE_FATAL="no"
IPV6INIT="yes"
IPV6_AUTOCONF="yes"
IPV6_DEFROUTE="yes"
IPV6_FAILURE_FATAL="no"
IPV6_ADDR_GEN_MODE="stable-privacy"
NAME="ens33"
UUID="0c00c122-c1b4-4677-ac88-94f992fe0346"
DEVICE="ens33"
ONBOOT="yes"

IPADDR="192.168.72.137"
NETMASK="255.255.255.0"
GATEWAY="192.168.72.1"
```

```sh
systemctl restart network
```

**关掉防火墙：**

```
systemctl stop firewalld
systemctl disable firewalld
```



#### 安装docker及kubelet

可选择快速安装或者手动安装方式。

##### 快速安装

使用 root 身份在所有节点执行如下代码，以安装软件：

- docker
- nfs-utils
- kubectl / kubeadm / kubelet

```sh
## 在 master 节点和 worker 节点都要执行
## 最后一个参数 1.19.5 用于指定 kubenetes 版本，支持所有 1.19.x 版本的安装
## 腾讯云 docker hub 镜像
## export REGISTRY_MIRROR="https://mirror.ccs.tencentyun.com"
## DaoCloud 镜像
## export REGISTRY_MIRROR="http://f1361db2.m.daocloud.io"
## 华为云镜像
## export REGISTRY_MIRROR="https://05f073ad3c0010ea0f4bc00b7105ec20.mirror.swr.myhuaweicloud.com"
## 阿里云 docker hub 镜像
export REGISTRY_MIRROR=https://registry.cn-hangzhou.aliyuncs.com
curl -sSL https://kuboard.cn/install-script/v1.19.x/install_kubelet.sh | sh -s 1.19.5
```

**请将脚本最后的 1.19.5 替换成需要的版本号，** 脚本中间的 v1.19.x 不要替换

> docker hub 镜像请根据自己网络的情况任选一个
>
> - 第四行为腾讯云 docker hub 镜像
> - 第六行为DaoCloud docker hub 镜像
> - 第八行为华为云 docker hub 镜像
> - 第十行为阿里云 docker hub 镜像



##### 手动安装

手动执行以下代码，结果与快速安装相同。***请将脚本第79行（已高亮）的 ${1} 替换成您需要的版本号，例如 1.19.5***

> docker hub 镜像请根据自己网络的情况任选一个
>
> - 第四行为腾讯云 docker hub 镜像
> - 第六行为DaoCloud docker hub 镜像
> - 第八行为阿里云 docker hub 镜像

```sh
## 在 master 节点和 worker 节点都要执行
## 最后一个参数 1.19.5 用于指定 kubenetes 版本，支持所有 1.19.x 版本的安装
## 腾讯云 docker hub 镜像
## export REGISTRY_MIRROR="https://mirror.ccs.tencentyun.com"
## DaoCloud 镜像
## export REGISTRY_MIRROR="http://f1361db2.m.daocloud.io"
## 阿里云 docker hub 镜像
export REGISTRY_MIRROR=https://registry.cn-hangzhou.aliyuncs.com
```

```sh
#!/bin/bash

## 在 master 节点和 worker 节点都要执行

## 安装 docker
## 参考文档如下
## https://docs.docker.com/install/linux/docker-ce/centos/ 
## https://docs.docker.com/install/linux/linux-postinstall/

## 卸载旧版本
yum remove -y docker \
docker-client \
docker-client-latest \
docker-ce-cli \
docker-common \
docker-latest \
docker-latest-logrotate \
docker-logrotate \
docker-selinux \
docker-engine-selinux \
docker-engine

## 设置 yum repository
yum install -y yum-utils \
device-mapper-persistent-data \
lvm2
yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

## 安装并启动 docker
yum install -y docker-ce-19.03.11 docker-ce-cli-19.03.11 containerd.io-1.2.13

mkdir /etc/docker || true

cat > /etc/docker/daemon.json <<EOF
{
  "registry-mirrors": ["${REGISTRY_MIRROR}"],
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  },
  "storage-driver": "overlay2",
  "storage-opts": [
    "overlay2.override_kernel_check=true"
  ]
}
EOF

mkdir -p /etc/systemd/system/docker.service.d

## Restart Docker
systemctl daemon-reload
systemctl enable docker
systemctl restart docker

## 安装 nfs-utils
## 必须先安装 nfs-utils 才能挂载 nfs 网络存储
yum install -y nfs-utils
yum install -y wget

## 关闭 防火墙
systemctl stop firewalld
systemctl disable firewalld

## 关闭 SeLinux
setenforce 0
sed -i "s/SELINUX=enforcing/SELINUX=disabled/g" /etc/selinux/config

## 关闭 swap
swapoff -a
yes | cp /etc/fstab /etc/fstab_bak
cat /etc/fstab_bak |grep -v swap > /etc/fstab

## 修改 /etc/sysctl.conf
## 如果有配置，则修改
sed -i "s#^net.ipv4.ip_forward.*#net.ipv4.ip_forward=1#g"  /etc/sysctl.conf
sed -i "s#^net.bridge.bridge-nf-call-ip6tables.*#net.bridge.bridge-nf-call-ip6tables=1#g"  /etc/sysctl.conf
sed -i "s#^net.bridge.bridge-nf-call-iptables.*#net.bridge.bridge-nf-call-iptables=1#g"  /etc/sysctl.conf
sed -i "s#^net.ipv6.conf.all.disable_ipv6.*#net.ipv6.conf.all.disable_ipv6=1#g"  /etc/sysctl.conf
sed -i "s#^net.ipv6.conf.default.disable_ipv6.*#net.ipv6.conf.default.disable_ipv6=1#g"  /etc/sysctl.conf
sed -i "s#^net.ipv6.conf.lo.disable_ipv6.*#net.ipv6.conf.lo.disable_ipv6=1#g"  /etc/sysctl.conf
sed -i "s#^net.ipv6.conf.all.forwarding.*#net.ipv6.conf.all.forwarding=1#g"  /etc/sysctl.conf
## 可能没有，追加
echo "net.ipv4.ip_forward = 1" >> /etc/sysctl.conf
echo "net.bridge.bridge-nf-call-ip6tables = 1" >> /etc/sysctl.conf
echo "net.bridge.bridge-nf-call-iptables = 1" >> /etc/sysctl.conf
echo "net.ipv6.conf.all.disable_ipv6 = 1" >> /etc/sysctl.conf
echo "net.ipv6.conf.default.disable_ipv6 = 1" >> /etc/sysctl.conf
echo "net.ipv6.conf.lo.disable_ipv6 = 1" >> /etc/sysctl.conf
echo "net.ipv6.conf.all.forwarding = 1"  >> /etc/sysctl.conf
## 执行命令以应用
sysctl -p

## 配置K8S的yum源
cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=http://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=0
repo_gpgcheck=0
gpgkey=http://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg
       http://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF

## 卸载旧版本
yum remove -y kubelet kubeadm kubectl

## 安装kubelet、kubeadm、kubectl
## 将 ${1} 替换为 kubernetes 版本号，例如 1.19.0
yum install -y kubelet-${1} kubeadm-${1} kubectl-${1}

## 重启 docker，并启动 kubelet
systemctl daemon-reload
systemctl restart docker
systemctl enable kubelet && systemctl start kubelet

docker version

```

> WARNING
>
> 如果此时执行 `systemctl status kubelet` 命令，将得到 kubelet 启动失败的错误提示，请忽略此错误，因为必须完成后续步骤中 kubeadm init 的操作，kubelet 才能正常启动



#### [初始化 master 节点](https://kuboard.cn/install/install-k8s.html#初始化-master-节点)

##### 快速初始化

**请将脚本最后的 1.19.5 替换成您需要的版本号，** 脚本中间的 v1.19.x 不要替换

```sh
## 只在 master 节点执行
## 替换 x.x.x.x 为 master 节点实际 IP（请使用内网 IP）
## export 命令只在当前 shell 会话中有效，开启新的 shell 窗口后，如果要继续安装过程，请重新执行此处的 export 命令
export MASTER_IP=x.x.x.x
## 替换 apiserver.demo 为 您想要的 dnsName
export APISERVER_NAME=apiserver.demo
## Kubernetes 容器组所在的网段，该网段安装完成后，由 kubernetes 创建，事先并不存在于您的物理网络中
export POD_SUBNET=10.100.0.1/16
echo "${MASTER_IP}    ${APISERVER_NAME}" >> /etc/hosts
curl -sSL https://kuboard.cn/install-script/v1.19.x/init_master.sh | sh -s 1.19.5

```

##### 手动初始化

手动执行以下代码，结果与快速初始化相同。***请将脚本第21行（已高亮）的 ${1} 替换成您需要的版本号，例如 1.19.5***

```sh
## 只在 master 节点执行
## 替换 x.x.x.x 为 master 节点的内网IP
## export 命令只在当前 shell 会话中有效，开启新的 shell 窗口后，如果要继续安装过程，请重新执行此处的 export 命令
export MASTER_IP=x.x.x.x
## 替换 apiserver.demo 为 您想要的 dnsName
export APISERVER_NAME=apiserver.demo
## Kubernetes 容器组所在的网段，该网段安装完成后，由 kubernetes 创建，事先并不存在于您的物理网络中
export POD_SUBNET=10.100.0.1/16
echo "${MASTER_IP}    ${APISERVER_NAME}" >> /etc/hosts
```

```sh
#!/bin/bash

## 只在 master 节点执行

## 脚本出错时终止执行
set -e

if [ ${#POD_SUBNET} -eq 0 ] || [ ${#APISERVER_NAME} -eq 0 ]; then
  echo -e "\033[31;1m请确保您已经设置了环境变量 POD_SUBNET 和 APISERVER_NAME \033[0m"
  echo 当前POD_SUBNET=$POD_SUBNET
  echo 当前APISERVER_NAME=$APISERVER_NAME
  exit 1
fi


## 查看完整配置选项 https://godoc.org/k8s.io/kubernetes/cmd/kubeadm/app/apis/kubeadm/v1beta2
rm -f ./kubeadm-config.yaml
cat <<EOF > ./kubeadm-config.yaml
apiVersion: kubeadm.k8s.io/v1beta2
kind: ClusterConfiguration
kubernetesVersion: 1.18.9
imageRepository: registry.aliyuncs.com/k8sxio
controlPlaneEndpoint: "${APISERVER_NAME}:6443"
networking:
  serviceSubnet: "10.96.0.0/16"
  podSubnet: "${POD_SUBNET}"
  dnsDomain: "cluster.local"
EOF

## kubeadm init
## 根据您服务器网速的情况，您需要等候 3 - 10 分钟
kubeadm config images pull --config=kubeadm-config.yaml
kubeadm init --config=kubeadm-config.yaml --upload-certs

## 配置 kubectl
rm -rf /root/.kube/
mkdir /root/.kube/
cp -i /etc/kubernetes/admin.conf /root/.kube/config

## 安装 calico 网络插件
## 参考文档 https://docs.projectcalico.org/v3.13/getting-started/kubernetes/self-managed-onprem/onpremises
echo "安装calico-3.13.1"
rm -f calico-3.13.1.yaml
wget https://kuboard.cn/install-script/calico/calico-3.13.1.yaml
kubectl apply -f calico-3.13.1.yaml

```

**如果master初始化出错：**

> - 请确保使用 root 用户执行初始化命令
>
> - 不能下载 kubernetes 的 docker 镜像
>
>   - 安装文档中，默认使用阿里云的 docker 镜像仓库，然而，有时候，该镜像会罢工
>
>   - 如碰到不能下载 docker 镜像的情况，请尝试手工初始化，并修改手工初始化脚本里的第22行（文档中已高亮）为：
>
>     ```yaml
>     imageRepository: gcr.azk8s.cn/google-containers
>     ```
>
> - 检查环境变量，执行如下命令
>
>   ```sh
>   echo MASTER_IP=${MASTER_IP} && echo APISERVER_NAME=${APISERVER_NAME} && echo POD_SUBNET=${POD_SUBNET}
>   ```
>
>   请验证如下几点：
>
>   - 环境变量 ***MASTER_IP*** 的值应该为 master 节点的 **内网IP**，如果不是，请重新 export
>   - **APISERVER_NAME** 不能是 master 的 hostname
>   - **APISERVER_NAME** 必须全为小写字母、数字、小数点，不能包含减号
>   - **POD_SUBNET** 所使用的网段不能与 ***master节点/worker节点*** 所在的网段重叠。该字段的取值为一个 [CIDR](https://kuboard.cn/glossary/cidr.html) 值，如果您对 CIDR 这个概念还不熟悉，请仍然执行 export POD_SUBNET=10.100.0.1/16 命令，不做修改
>
> - 重新初始化 master 节点前，请先执行 `kubeadm reset -f` 操作



##### 检查 master 初始化结果

```sh
## 只在 master 节点执行

## 执行如下命令，等待 3-10 分钟，直到所有的容器组处于 Running 状态
watch kubectl get pod -n kube-system -o wide

## 查看 master 节点初始化结果
kubectl get nodes -o wide

```

可能会出现pending或者Failed to pull image的问题，需要稍微等久一点，从下面的图可以看出花了21分钟才全部处于Running状态：

![image-20201221184147517](kubernetes.assets/image-20201221184147517.png)

![image-20201221185235129](kubernetes.assets/image-20201221185235129.png)

出现错误的解决方法：

> - ImagePullBackoff / Pending
>
>   - 如果 `kubectl get pod -n kube-system -o wide` 的输出结果中出现 ImagePullBackoff 或者长时间处于 Pending 的情况，请参考 [查看镜像抓取进度](https://kuboard.cn/learning/faq/image-pull-backoff.html)
>
> - ContainerCreating
>
>   - 如果`kubectl get pod -n kube-system -o wide`的输出结果中某个 Pod 长期处于 ContainerCreating、PodInitializing 或 Init:0/3 的状态，可以尝试：
>
>     - 查看该 Pod 的状态，例如：
>
>       ```sh
>       kubectl describe pod kube-flannel-ds-amd64-8l25c -n kube-system
>       ```
>
>       如果输出结果中，最后一行显示的是 Pulling image，请耐心等待，或者参考
>
>       查看镜像抓取进度
>
>       ```
>       Normal  Pulling    44s   kubelet, k8s-worker-02  Pulling image "quay.io/coreos/flannel:v0.12.0-amd64"
>       ```
>
>     - 将该 Pod 删除，系统会自动重建一个新的 Pod，例如：
>
>       ```sh
>       kubectl delete pod kube-flannel-ds-amd64-8l25c -n kube-system
>       ```



#### 初始化worker节点

针对所有worker节点执行：

```sh
## 只在 worker 节点执行
## 替换 x.x.x.x 为 master 节点的内网 IP
export MASTER_IP=x.x.x.x
## 替换 apiserver.demo 为初始化 master 节点时所使用的 APISERVER_NAME
export APISERVER_NAME=apiserver.demo
echo "${MASTER_IP}    ${APISERVER_NAME}" >> /etc/hosts

## 替换为 master 节点上 kubeadm token create 命令的输出
kubeadm join apiserver.demo:6443 --token mpfjma.4vjjg8flqihor4vt     --discovery-token-ca-cert-hash sha256:6f7a8e40a810323672de5eee6f4d19aa2dbdb38411845a1bf5dd63485c43d303

```

把worker节点添加进来后，看下图，需要大概10分钟的时间去转为Ready状态，一开始为Not Ready状态。

![image-20201221191719471](kubernetes.assets/image-20201221191719471.png)



**出错处理**

> #### 常见错误原因
>
> 经常在群里提问为什么 join 不成功的情况大致有这几种：
>
> [worker 节点不能访问 apiserver](https://kuboard.cn/install/install-k8s.html#worker-节点不能访问-apiserver)
>
> 在worker节点执行以下语句可验证worker节点是否能访问 apiserver
>
> ```sh
> curl -ik https://apiserver.demo:6443
> ```
>
> 如果不能，请在 master 节点上验证
>
> ```sh
> curl -ik https://localhost:6443
> ```
>
> 正常输出结果如下所示：
>
> ```
> HTTP/1.1 403 Forbidden
> Cache-Control: no-cache, private
> Content-Type: application/json
> X-Content-Type-Options: nosniff
> Date: Fri, 15 Nov 2019 04:34:40 GMT
> Content-Length: 233
> 
> {
>   "kind": "Status",
>   "apiVersion": "v1",
>   "metadata": {
> ...
> ```
>
> 可能原因
>
> - 如果 master 节点能够访问 apiserver、而 worker 节点不能，则请检查自己的网络设置
>   - /etc/hosts 是否正确设置？
>   - 是否有安全组或防火墙的限制？
>
> [worker 节点默认网卡](https://kuboard.cn/install/install-k8s.html#worker-节点默认网卡)
>
> - Kubelet使用的 IP 地址与 master 节点可互通（无需 NAT 映射），且没有防火墙、安全组隔离
>   - 如果你使用 vmware 或 virtualbox 创建虚拟机用于 K8S 学习，可以尝试 NAT 模式的网络，而不是桥接模式的网络
>
> [移除worker节点并重试](https://kuboard.cn/install/install-k8s.html#移除worker节点并重试)
>
> WARNING
>
> 正常情况下，您无需移除 worker 节点，如果添加到集群出错，您可以移除 worker 节点，再重新尝试添加
>
> 在准备移除的 worker 节点上执行
>
> ```sh
> ## 只在 worker 节点执行
> kubeadm reset -f
> ```
>
> 在 master 节点 demo-master-a-1 上执行
>
> ```sh
> ## 只在 master 节点执行
> kubectl get nodes -o wide
> ```
>
> 如果列表中没有您要移除的节点，则忽略下一个步骤
>
> ```sh
> ## 只在 master 节点执行
> kubectl delete node demo-worker-x-x  
> ```
>
> TIP
>
> - 将 demo-worker-x-x 替换为要移除的 worker 节点的名字
> - worker 节点的名字可以通过在节点 demo-master-a-1 上执行 kubectl get nodes 命令获得

##### 检查初始化结果

```
## 只在 master 节点执行
kubectl get nodes -o wide
```

结果格式如下：

```
[root@node03 imagetars]## kubectl get nodes -o wide
NAME     STATUS   ROLES    AGE   VERSION   INTERNAL-IP       EXTERNAL-IP   OS-IMAGE                KERNEL-VERSION           CONTAINER-RUNTIME
node01   Ready    master   63m   v1.19.5   192.168.116.101   <none>        CentOS Linux 7 (Core)   3.10.0-1062.el7.x86_64   docker://19.3.11
node02   Ready    <none>   22m   v1.19.5   192.168.116.102   <none>        CentOS Linux 7 (Core)   3.10.0-1062.el7.x86_64   docker://19.3.11
```

#### 安装Ingress Controller

快速初始化：

```sh
## 只在 master 节点执行
kubectl apply -f https://kuboard.cn/install-script/v1.19.x/nginx-ingress.yaml
```

如果想使用其它的 Ingress Controller，卸载Ingress Controller的方式如下：

```sh
## 只在 master 节点执行
kubectl delete -f https://kuboard.cn/install-script/v1.19.x/nginx-ingress.yaml
```

> 如果打算将 Kubernetes 用于生产环境，请参考此文档 [Installing Ingress Controller (opens new window)](https://docs.nginx.com/nginx-ingress-controller/installation/installation-with-manifests/)，完善 Ingress 的配置。





### 高可用安装



## 重启kubernetes集群

Kubernetes集群的设计目标是**setup-and-run-forever**，使用虚拟机学习，会出现反复重启集群所在虚拟机的情况。下面是重启后可能出现的问题的解释。

[Worker节点不能启动](https://kuboard.cn/install/k8s-restart.html#worker节点不能启动)

Master 节点的 IP 地址变化，导致 worker 节点不能启动。请重装集群，并确保所有节点都有固定内网 IP 地址。

[许多Pod一直Crash或不能正常访问](https://kuboard.cn/install/k8s-restart.html#许多pod一直crash或不能正常访问)

```sh
kubectl get pods --all-namespaces
```

重启后会发现许多 Pod 不在 Running 状态，此时，请使用如下命令删除这些状态不正常的 Pod。通常，您的 Pod 如果是使用 Deployment、StatefulSet 等控制器创建的，kubernetes 将创建新的 Pod 作为替代，重新启动的 Pod 通常能够正常工作。

```sh
kubectl delete pod <pod-name> -n <pod-namespece>
```











