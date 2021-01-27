## docker学习链接

https://yeasy.gitbook.io/docker_practice/

## docker的安装

桌面安装：

- 《[Windows Docker安装](http://c.biancheng.net/view/3121.html)》
- 《[Mac Docker安装](http://c.biancheng.net/view/3122.html)》


服务器安装：

- 《[ubuntu安装docker](https://www.runoob.com/docker/ubuntu-docker-install.html)》《[centos安装docker](https://www.runoob.com/docker/centos-docker-install.html)》
- 《[Windows Server Docker安装](http://c.biancheng.net/view/3126.html)》
- 《[Docker Engine引擎升级](http://c.biancheng.net/view/3127.html)》
- 《[Docker存储驱动](http://c.biancheng.net/view/3130.html)》

### ubuntu安装docker

#### 设置仓库

更新 apt 包索引。

```
$ sudo apt-get update
```

安装 apt 依赖包，用于通过HTTPS来获取仓库:

```
$ sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common
```

添加 Docker 的官方 GPG 密钥：

```
$ curl -fsSL https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu/gpg | sudo apt-key add -
```

使用以下指令设置稳定版仓库:

```
$ sudo add-apt-repository \
   "deb [arch=amd64] https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu/ \
  $(lsb_release -cs) \
  stable"
```

#### 安装 Docker Engine-Community

更新 apt 包索引。

```
$ sudo apt-get update
```

安装最新版本的 Docker Engine-Community 和 containerd ，或者转到下一步安装特定版本：

```
$ sudo apt-get install docker-ce docker-ce-cli containerd.io
```

如果要安装特定版本的 Docker Engine-Community，请在仓库中列出可用版本，然后选择一种安装。列出您的仓库中可用的版本：

```
$ apt-cache madison docker-ce

  docker-ce | 5:18.09.1~3-0~ubuntu-xenial | https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu  xenial/stable amd64 Packages
  docker-ce | 5:18.09.0~3-0~ubuntu-xenial | https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu  xenial/stable amd64 Packages
  docker-ce | 18.06.1~ce~3-0~ubuntu       | https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu  xenial/stable amd64 Packages
  docker-ce | 18.06.0~ce~3-0~ubuntu       | https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu  xenial/stable amd64 Packages
  ...
```

使用第二列中的版本字符串安装特定版本，例如 5:18.09.1~3-0~ubuntu-xenial。

```
$ sudo apt-get install docker-ce=<VERSION_STRING> docker-ce-cli=<VERSION_STRING> containerd.io
```

测试 Docker 是否安装成功，输入以下指令，打印出以下信息则安装成功:

```
$ sudo docker run hello-world

Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
1b930d010525: Pull complete                                                                                                                                  Digest: sha256:c3b4ada4687bbaa170745b3e4dd8ac3f194ca95b2d0518b417fb47e5879d9b5f
Status: Downloaded newer image for hello-world:latest


Hello from Docker!
This message shows that your installation appears to be working correctly.


To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.


To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash


Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/


For more examples and ideas, visit:
 https://docs.docker.com/get-started/
```

查看docker状态：

```
sudo systemctl status docker
```

`docker`命令只能由**root**用户或**docker**组中的用户运行，该用户在Docker的安装过程中自动创建。如果您尝试运行该`docker`命令而不使用`sudo`或不在**docker**组中中用户运行，您将看到如下输出：

```js
docker: Cannot connect to the Docker daemon. Is the docker daemon running on this host?.
See 'docker run --help'.
```

最好通过非 root 用户来使用 Docker，这时需要添加非 root 用户到本地 Docker Unix 组当中。

```sh
$ sudo usermod -aG docker npoulton

$ cat /etc/group | grep docker
docker:x:998:jinguang

$ newgrp docker  #更新docker组
```

## docker介绍

docker是一个帮助开发、部署、运行应用的平台，核心思想是：在任何地方开发、部署和运行任何应用，像集装箱一样任意组装。

docker是一个开源项目，go语言实现，docker基础是linux容器技术。

docker与传统虚拟化方式的不同，是在操作系统层面上实现虚拟化，直接复用本地主机的操作系统，而传统在硬件层面。

![传统虚拟化](docker.assets/virtualization.png)

![Docker](docker.assets/docker.png)

使用docker的原因：

- 简化开发和部署的成本。
- docker是轻量级的容器，速度非常块，启动时间少，可帮助快速部署和扩展。
- 可运行多种环境中，物理/虚拟主机，公有/私有云上都可以
- 可多平台运行，轻松移植

## docker镜像

**image镜像**

可以把镜像当成java中的一个类，相当于一个root文件系统，比如官方镜像 ubuntu:16.04 就包含了完整的一套 Ubuntu16.04 最小系统的 root 文件系统。

镜像由多个层组成，每层叠加之后，从外部看来就如一个独立的对象。镜像内部是一个精简的操作系统（OS），同时还包含应用运行所必须的文件和依赖包。

![image-20201114144632614](docker.assets/image-20201114144632614.png)

每一个镜像都可能依赖于由一个或多个下层的组成的另一个镜像。我们有时说，下层那个镜像是上层镜像的父镜像。

基础镜像：

一个没有任何父镜像的镜像，谓之基础镜像。

镜像ID：

所有镜像都是通过一个 64 位十六进制字符串 （内部是一个 256 bit 的值）来标识的。 为简化使用，前 12 个字符可以组成一个短ID，可以在命令行中使用。短ID还是有一定的 碰撞机率，所以服务器总是返回长ID。

**拉取镜像：**

可以使用 `docker image pull` 命令来从仓库获取所需要的镜像。默认情况，会从`Docker Hub`仓库中拉取镜像。

比如：`docker image pull alpine:latest` 命令会从`Docker Hub`中的`alpine`仓库中拉取标签为`latest`的镜像。

`Linux Docker` 主机本地镜像仓库通常位于 `/var/lib/docker/<storage-driver>`，`Windows Docker` 主机则是 `C:\ProgramData\docker\windowsfilter`。

可通过命令 `docker image ls` 查看`docker`主机的本地仓库中存在的镜像。如果本地仓库已经存在，拉取的时候会输出：Already exists。

> 提示：如果使用 Linux，并且还没有将当前用户加入到本地 Docker UNIX 组中，则需要在下面的命令前面添加 sudo。

Docker 客户端的镜像仓库服务是可配置的，默认使用 Docker Hub。镜像仓库服务包含多个镜像仓库（Image Repository）。同样，一个镜像仓库中可以包含多个镜像。

![image-20201114195722423](docker.assets/image-20201114195722423.png)

Docker Hub分为官方镜像仓库（official repository）和非官方镜像仓库（unofficial repository)。

![image-20201116152250618](docker.assets/image-20201116152250618.png)

官方的更加安全，更新较快，有完善的文档和最佳实践。从非官方仓库拉取要谨慎点，当然也会有优秀的镜像。

`docker image pull` 命令的格式如下

```
docker image pull <repository>:<tag>
```

从**官方仓库**拉取不同的镜像：

```
$ docker image pull mongo:3.3.11
//该命令会从官方Mongo库拉取标签为3.3.11的镜像

$ docker image pull redis:latest
//该命令会从官方Redis库拉取标签为latest的镜像

$ docker image pull alpine
//该命令会从官方Alpine库拉取标签为latest的镜像
```

注意，没有指定标签时，默认拉取标签为latest的镜像，但是标有 latest 标签的镜像不保证这是仓库中最新的镜像。

从**非官方仓库**拉取镜像，读者需要在仓库名称面前加上 Docker Hub 的用户名或者组织名称。

下面演示从 tu-demo 仓库中拉取 v2 这个镜像，其中镜像的拥有者是 Docker Hub 账户 nigelpoulton，一个不应该被信任的账户：

```
$ docker image pull nigelpoulton/tu-demo:v2
```

一个镜像是可以有多个标签的，可以通过`-a`参数来拉取仓库中所有标签的镜像：

```
$ docker image pull -a xxx:xxx
```

**查看已经拉取的镜像：**

```
docker image ls
```

因为一个镜像可以有多个标签，所以拉取了多个标签的镜像时，可能有重复的镜像，镜像ID才能唯一标识一个镜像，比如下面，latest和v1标签都指向了ID为9b915a..1e29的镜像：

```
$ docker image ls
REPOSITORY TAG IMAGE ID CREATED SIZE
nigelpoulton/tu-demo v2 6ac21e..bead 1 yr ago 211.6 MB
nigelpoulton/tu-demo latest 9b915a..1e29 1 yr ago 211.6 MB
nigelpoulton/tu-demo v1 9b915a..1e29 1 yr ago 211.6 MB
```

docker提供了 `--filter`参数来过滤，下列命令只返回悬虚（dangling）镜像：

```
$ docker image ls --filter dangling=true
REPOSITORY TAG IMAGE ID CREATED SIZE
<none> <none> 4fd34165afe0 7 days ago 14.5MB
```

那些没有标签的镜像被称为悬虚镜像，在列表中展示为`<none>:<none>`。

可以通过 `docker image prune` 命令移除全部的悬虚镜像。如果添加了 `-a` 参数，Docker 会额外移除没有被使用的镜像（那些没有被任何容器使用的镜像）。

可以使用 `--format` 参数来通过 Go 模板对输出内容进行格式化。例如，下面的指令将只返回 Docker 主机上镜像的大小属性。

```
$ docker image ls --format "{{.Size}}"
99.3MB
111MB
82.6MB
88.8MB
4.15MB
108MB
```

使用下面命令返回全部镜像，但是只显示仓库、标签和大小信息。

```
$ docker image ls --format "{{.Repository}}: {{.Tag}}: {{.Size}}"
dodge: challenger: 99.3MB
ubuntu: latest: 111MB
python: 3.4-alpine: 82.6MB
python: 3.5-alpine: 88.8MB
alpine: latest: 4.15MB
nginx: latest: 108MB
```

只返回系统中本地拉取的全部镜像的 ID 列表：

```
docker image ls -q
```

**搜索docker hub**

`docker search`可通过CLI方式搜索docker hub。语法格式：`docker search NAME`。

如：

- `docker search nigelpoulton` 会查找所有“NAME”包含“nigelpoulton”的仓库
- `docker search alpine` 列出所有仓库名称中包含“alpine”的镜像。

注意，上面返回的镜像中既有官方的也有非官方的，可以使用 `--filter "is-official=true"`来只显示官方镜像。

```
docker search alpine --filter "is-official=true"
```

`docker search`只返回 25 行结果，可以通过指定 --limit 参数来增加返回内容行数，最多为 100 行。

**镜像和分层**

Docker 镜像由一些松耦合的只读镜像层组成。如图：

![image-20201116093937372](docker.assets/image-20201116093937372.png)

Docker 负责堆叠这些镜像层，并且将它们表示为单个统一的对象。

查看镜像分层：`docker image inspect 镜像名`

```
$ docker image inspect ubuntu:latest
[
{
"Id": "sha256:bd3d4369ae.......fa2645f5699037d7d8c6b415a10",
"RepoTags": [
"ubuntu:latest"

<Snip>

"RootFS": {
  "Type": "layers",
  "Layers": [
   "sha256:c8a75145fc...894129005e461a43875a094b93412",
   "sha256:c6f2b330b6...7214ed6aac305dd03f70b95cdc610",
   "sha256:055757a193...3a9565d78962c7f368d5ac5984998",
   "sha256:4837348061...12695f548406ea77feb5074e195e3",
   "sha256:0cad5e07ba...4bae4cfc66b376265e16c32a0aae9"
  ]
  }
}
]
```

所有的 Docker 镜像都起始于一个基础镜像层，当进行修改或增加新的内容时，就会在当前镜像层之上，创建新的镜像层。

举个例子，假如基于 Ubuntu Linux 16.04 创建一个新的镜像，这就是新镜像的第一层；如果在该镜像中添加`Python`包，就会在基础镜像层之上创建第二个镜像层；如果继续添加一个安全补丁，就会创建第三个镜像层。

该镜像当前已经包含 3 个镜像层，如下图所示（这只是一个用于演示的很简单的例子）。



![基于Ubuntu Linux 16.04创建镜像](docker.assets/4-1Z416164115364.gif)


在添加额外的镜像层的同时，**镜像始终保持是当前所有镜像的组合**，理解这一点非常重要。下图中举了一个简单的例子，每个镜像层包含 3 个文件，而镜像包含了来自两个镜像层的 6 个文件。



![添加额外的镜像层后的镜像](docker.assets/4-1Z41616413R94.gif)


上图中的镜像层跟之前图中的略有区别，主要目的是便于展示文件。

下图中展示了一个稍微复杂的三层镜像，在外部看来整个镜像只有 6 个文件，这是因为最上层中的文件 7 是文件 5 的一个更新版本。



![三层镜像](docker.assets/4-1Z416164203H1.gif)


这种情况下，上层镜像层中的文件覆盖了底层镜像层中的文件。这样就使得文件的更新版本作为一个新镜像层添加到镜像当中。

Docker 通过存储引擎（新版本采用快照机制）的方式来实现镜像层堆栈，并保证多镜像层对外展示为统一的文件系统。

Linux 上可用的存储引擎有 AUFS、Overlay2、Device Mapper、Btrfs 以及 ZFS。顾名思义，每种存储引擎都基于 Linux 中对应的文件系统或者块设备技术，并且每种存储引擎都有其独有的性能特点。

Docker 在 Windows 上仅支持 windowsfilter 一种存储引擎，该引擎基于 NTFS 文件系统之上实现了分层和 CoW[1。

下图展示了与系统显示相同的三层镜像。所有镜像层堆叠并合并，对外提供统一的视图。



![从系统角度看三层镜像](docker.assets/4-1Z4161642301E.gif)

**共享镜像层**

多个镜像之间可以共享镜像层。Docker 很聪明，可以识别出要拉取的镜像中，哪几层已经在本地存在，拉取时，已经存在的镜像层会输出Already exists。

**根据摘要拉取镜像**

镜像的标签是可变的，可能出现打错标签的或者给新镜像打一个已经存在的标签的情况。

摘要是镜像内容的一个散列值，所以镜像内容的变更会导致散列值的改变，这意味着摘要是不可变的，摘要可以解决上面的问题。

查看镜像摘要只需加上 `--digests`参数即可，如：

```
$ docker image ls --digests alpine
REPOSITORY TAG DIGEST IMAGE ID CREATED SIZE
alpine latest sha256:3dcd...f73a 4e38e38c8ce0 10 weeks ago 4.8 MB
```

知道镜像的摘要了，就可以再次使用摘要来拉取镜像：

```
$ docker image rm alpine:latest
Untagged: alpine:latest
Untagged: alpine@sha256:c0537...7c0a7726c88e2bb7584dc96
Deleted: sha256:02674b9cb179d...abff0c2bf5ceca5bad72cd9
Deleted: sha256:e154057080f40...3823bab1be5b86926c6f860

$ docker image pull alpine@sha256:c0537...7c0a7726c88e2bb7584dc96
sha256:c0537...7726c88e2bb7584dc96: Pulling from library/alpine
cfc728c1c558: Pull complete
Digest: sha256:c0537ff6a5218...7c0a7726c88e2bb7584dc96
Status: Downloaded newer image for alpine@sha256:c0537...bb7584dc96
```

没有原生 Docker 命令支持从远端镜像仓库服务（如Docker Hub）中获取镜像摘要。这意味着只能先通过标签方式拉取镜像到本地，然后**自己维护镜像的摘要列表**。镜像摘要在未来绝对不会发生变化。

**镜像散列值（摘要）**

从 Docker 1.10 版本开始，镜像就是一系列松耦合的独立层的集合。

镜像本身就是一个配置对象，镜像的唯一标识是一个加密 ID，即配置对象本身的散列值。每个镜像层也由一个加密 ID 区分，其值为镜像层本身内容的散列值。

这意味着修改镜像的内容或其中任意的镜像层，都会导致加密散列值的变化。所以，镜像和其镜像层都是不可变的，任何改动都能很轻松地被辨别。

这就是所谓的内容散列（Content Hash）。

> 在推送和拉取镜像的时候，都会对镜像层进行压缩来节省网络带宽以及仓库二进制存储空间。
>
> 但是压缩会改变镜像内容，这意味着镜像的内容散列值在推送或者拉取操作之后，会与镜像内容不相符！这显然是个问题。
>
> 例如，在推送镜像层到 Docker Hub 的时候，Docker Hub 会尝试确认接收到的镜像没有在传输过程中被篡改。
>
> 为了完成校验，Docker Hub 会根据镜像层重新计算散列值，并与原散列值进行比较。
>
> 因为镜像在传输过程中被压缩（发生了改变），所以散列值的校验也会失败。
>
> 为避免该问题，每个镜像层同时会包含一个分发散列值（Distribution Hash）。这是一个压缩版镜像的散列值，当从镜像仓库服务拉取或者推送镜像的时候，其中就包含了分发散列值，该散列值会用于校验拉取的镜像是否被篡改过。
>
> 这个内容寻址存储模型极大地提升了镜像的安全性，因为在拉取和推送操作后提供了一种方式来确保镜像和镜像层数据是一致的。
>
> 该模型也解决了随机生成镜像和镜像层 ID 这种方式可能导致的 ID 冲突问题。

**多架构的镜像**

Docker可以让我们运行一个应用就像拉取镜像并运行容器这么简单。无须担心安装、依赖或者配置的问题。开箱即用。

但是是在添加了新平台和架构之后，例如 Windows、ARM 以及 s390x，突然发现，在拉取镜像并运行之前，需要考虑镜像是否与当前运行环境的架构匹配，这破坏了 Docker 的流畅体验。

多架构镜像（Multi-architecture Image）的出现解决了这个问题！、

Docker（镜像和镜像仓库服务）规范目前支持多架构镜像。这意味着某个镜像仓库标签（repository:tag）下的镜像可以同时支持 64 位 Linux、PowerPC Linux、64 位 Windows 和 ARM 等多种架构。

**简单地说，就是一个镜像标签之下可以支持多个平台和架构。**

镜像仓库服务 API 支持两种重要的结构：Manifest 列表（新）和 Manifest。

Manifest 列表是指某个镜像标签支持的架构列表。其支持的每种架构，都有自己的 Mainfest 定义，其中列举了该镜像的构成。

下图使用 Golang 官方镜像作为示例。图左侧是 Manifest 列表，其中包含了该镜像支持的每种架构。

Manifest 列表的每一项都有一个箭头，指向具体的 Manifest，其中包含了镜像配置和镜像层数据。

![image-20201116110808395](docker.assets/image-20201116110808395.png)



在具体操作之前，先来了解一下**原理**。

假设要在 Raspberry Pi（基于 ARM 架构的 Linux）上运行 Docker。在拉取镜像的时候，Docker 客户端会调用 Docker Hub 镜像仓库服务相应的 API 完成拉取。

如果该镜像有 Mainfest 列表，并且存在 Linux on ARM 这一项，则 Docker Client 就会找到 ARM 架构对应的 Mainfest 并解析出组成该镜像的镜像层加密 ID。

然后从 Docker Hub 二进制存储中拉取每个镜像层。

**示例**

在不同的平台和架构拉取正确的官方 Golang 镜像：

```
64 位 Linux 示例如下：
$ docker container run --rm golang go version

Unable to find image 'golang:latest' locally
latest: Pulling from library/golang
723254a2c089: Pull complete
<Snip>
39cd5f38ffb8: Pull complete
Digest: sha256:947826b5b6bc4...
Status: Downloaded newer image for golang:latest
go version go1.9.2 linux/amd64

64 位 Windows 示例如下。

PS> docker container run --rm golang go version

Using default tag: latest
latest: Pulling from library/golang
3889bb8d808b: Pull complete
8df8e568af76: Pull complete
9604659e3e8d: Pull complete
9f4a4a55f0a7: Pull complete
6d6da81fc3fd: Pull complete
72f53bd57f2f: Pull complete
6464e79d41fe: Pull complete
dca61726a3b4: Pull complete
9150276e2b90: Pull complete
cd47365a14fb: Pull complete
1783777af4bb: Pull complete
3b8d1834f1d7: Pull complete
7258d77b22dd: Pull complete
Digest: sha256:e2be086d86eeb789...e1b2195d6f40edc4
Status: Downloaded newer image for golang:latest
go version go1.9.2 windows/amd64

上面命令的意思是：从 Docker Hub 拉取 Golang 镜像，以容器方式启动，执行 go version 命令，并且输出 Go 的版本和主机 OS / CPU 架构信息。
```

可以看到两个示例使用了完全相同的命令，但是 Linux 示例中拉取的是 linux/amd64 镜像，而 Windows 示例中拉取的是 windows/amd64 镜像。

所有官方镜像都支持 Manifest 列表。

**示例中只运行了普通的命令，选择当前平台和架构所需的正确镜像版本是由 Docker 完成的。**

但是，全面支持各种架构的工作仍在推进当中。**创建支持多架构的镜像需要镜像的发布者做更多的工作**。同时，某些软件也并非跨平台的。在这个前提下，Manifest 列表是可选的——在没有 Manifest 列表的情况下，镜像仓库服务会返回普通的 Manifest。

**删除镜像**

以通过 `docker image rm` 命令从 Docker 主机删除该镜像。删除操作会在当前主机上删除该镜像以及相关的镜像层。

但是，如果某个镜像层被多个镜像共享，那**只有当全部依赖该镜像层的镜像都被删除后，该镜像层才会被删除**。

下面的示例中通过镜像 ID 来删除镜像：

```
$ docker image rm 02674b9cb179
Untagged: alpine@sha256:c0537ff6a5218...c0a7726c88e2bb7584dc96
Deleted: sha256:02674b9cb179d57...31ba0abff0c2bf5ceca5bad72cd9
Deleted: sha256:e154057080f4063...2a0d13823bab1be5b86926c6f860
```

**如果被删除的镜像上存在运行状态的容器，那么删除操作不会被允许**。再次执行删除镜像命令之前，需要停止并删除该镜像相关的全部容器。

一种删除某 Docker 主机上全部镜像的快捷方式是在 `docker image rm` 命令中传入当前系统的全部镜像 ID，通过运行 `docker image ls -q`来快速删除：

```
$ docker image rm $(docker image ls -q) -f
Untagged: ubuntu:latest
Untagged: ubuntu@sha256:f4691c9...2128ae95a60369c506dd6e6f6ab
Deleted: sha256:bd3d4369aebc494...fa2645f5699037d7d8c6b415a10
Deleted: sha256:cd10a3b73e247dd...c3a71fcf5b6c2bb28d4f2e5360b
Deleted: sha256:4d4de39110cd250...28bfe816393d0f2e0dae82c363a
Deleted: sha256:6a89826eba8d895...cb0d7dba1ef62409f037c6e608b
Deleted: sha256:33efada9158c32d...195aa12859239d35e7fe9566056
Deleted: sha256:c8a75145fcc4e1a...4129005e461a43875a094b93412
Untagged: alpine:latest
Untagged: alpine@sha256:3dcdb92...313626d99b889d0626de158f73a
Deleted: sha256:4e38e38c8ce0b8d...6225e13b0bfe8cfa2321aec4bba
Deleted: sha256:4fe15f8d0ae69e1...eeeeebb265cd2e328e15c6a869f

$ docker image ls
REPOSITORY TAG IMAGE ID CREATED SIZE
```

可以看到 `docker image ls -q` 命令只返回了系统中本地拉取的全部镜像的 ID 列表。将这个列表作为参数传给 `docker image rm`会删除本地系统中的全部镜像。

注意：**如果是在 Windows 环境中，那么只有在 PowerShell 终端中执行删除才会生效。在 CMD 中执行并不会生效。**

**小结：镜像的常用命令**

- `docker image pull`是下载镜像的命令。镜像从远程镜像仓库服务的仓库中下载。默认情况下，镜像会从 [Docker](http://c.biancheng.net/docker/) Hub 的仓库中拉取。
- `docker image pull alpine:latest`命令会从 Docker Hub 的 alpine 仓库中拉取标签为 latest 的镜像。
- `docker image ls`列出了本地 Docker 主机上存储的镜像。`--digests`查看摘要，`-q`查看镜像ID。
- `docker image inspect`命令非常有用， 该命令完美展示了镜像的细节，包括镜像层数据和元数据。
- `docker image rm`用于删除镜像。
- `docker image rm alpine:latest`命令的含义是删除 alpine:latest 镜像。当镜像存在关联的容器，并且容器处于运行（Up）或者停止（Exited）状态时，不允许删除该镜像。

## docker容器

容器是镜像的运行时实例。正如从虚拟机模板上启动 VM 一样，用户也同样可以从单个镜像上启动一个或多个容器。

虚拟机和容器最大的区别是容器更快并且更轻量级——与虚拟机运行在完整的操作系统之上相比，容器会共享其所在主机的操作系统/内核。

下图为使用**单个 Docker镜像启动多个容器**的示意图。

![image-20201116144417915](docker.assets/image-20201116144417915.png)

```
jinguang@jinguang:~$ docker container help

Usage:  docker container COMMAND

Manage containers

Commands:
  attach      Attach local standard input, output, and error streams to a running container
  commit      Create a new image from a container's changes
  cp          Copy files/folders between a container and the local filesystem
  create      Create a new container
  diff        Inspect changes to files or directories on a container's filesystem
  exec        Run a command in a running container
  export      Export a container's filesystem as a tar archive
  inspect     Display detailed information on one or more containers
  kill        Kill one or more running containers
  logs        Fetch the logs of a container
  ls          List containers
  pause       Pause all processes within one or more containers
  port        List port mappings or a specific mapping for the container
  prune       Remove all stopped containers		删除所有停止运行的容器
  rename      Rename a container	重命名一个容器
  restart     Restart one or more containers	重启一个或在多个容器
  rm          Remove one or more containers	删除一个或多个容器
  run         Run a command in a new container	启动一个容器
  start       Start one or more stopped containers
  stats       Display a live stream of container(s) resource usage statistics
  stop        Stop one or more running containers
  top         Display the running processes of a container
  unpause     Unpause all processes within one or more containers
  update      Update configuration of one or more containers
  wait        Block until one or more containers stop, then print their exit codes
```

**容器和虚拟机**

容器和虚拟机都依赖于宿主机才能运行。宿主机可以是笔记本，是数据中心的物理服务器，也可以是公有云的某个实例。

在下面的示例中，假设宿主机是一台需要运行 4 个业务应用的物理服务器。

在虚拟机模型中，首先要开启物理机并启动 Hypervisor 引导程序。一旦 Hypervisor 启动，就会占有机器上的全部物理资源，如 CPU、RAM、存储和 NIC。

Hypervisor 接下来就会将这些物理资源划分为虚拟资源，并且看起来与真实物理资源完全一致。

然后 Hypervisor 会将这些资源打包进一个叫作虚拟机（VM）的软件结构当中。这样用户就可以使用这些虚拟机，并在其中安装操作系统和应用。

前面提到需要在物理机上运行 4 个应用，所以在 Hypervisor 之上需要创建 4 个虚拟机并安装 4 个操作系统，然后安装 4 个应用。当操作完成后，结构如下图所示。

![image-20201116150226010](docker.assets/image-20201116150226010.png)

而容器模型则略有不同。

服务器启动之后，所选择的操作系统会启动。在 Docker 世界中可以选择 Linux，或者内核支持内核中的容器原语的新版本 Windows。

与虚拟机模型相同，OS 也占用了全部硬件资源。在 OS 层之上，需要安装容器引擎（如 Docker）。

容器引擎可以获取系统资源，比如进程树、文件系统以及网络栈，接着将资源分割为安全的互相隔离的资源结构，称之为容器。

**每个容器看起来就像一个真实的操作系统，在其内部可以运行应用**。按照前面的假设，需要在物理机上运行 4 个应用。

因此，需要划分出 4 个容器并在每个容器中运行一个应用，如下图所示。

![image-20201116150257991](docker.assets/image-20201116150257991.png)



**虚拟机的额外开销**

基于前文所述内容，接下来探讨 Hypervisor 模型的一个主要问题。

首先我们的目标是在一台物理机上运行 4 个业务相关应用。每种模型示例中都安装了一个操作系统或者 Hypervisor（一种针对虚拟机高度优化后的操作系统）。

虚拟机模型将底层硬件资源划分到虚拟机当中。每个虚拟机都是包含了虚拟 CPU、虚拟 RAM、虚拟磁盘等资源的一种软件结构。

因此，每个虚拟机都需要有自己的操作系统来声明、初始化并管理这些虚拟资源。

但是，**操作系统本身是有其额外开销的**。例如，每个操作系统都消耗一点 CPU、一点 RAM、一点存储空间等。

每个操作系统都需要独立的许可证，并且都需要打补丁升级，每个操作系统也都面临被攻击的风险。

通常将这种现象称作 OS Tax 或者 VM Tax，每个操作系统都占用一定的资源。

容器模型具有在宿主机操作系统中运行的单个内核。在一台主机上运行数十个甚至数百个容器都是可能的——容器共享一个操作系统/内核。

这意味着只有一个操作系统消耗 CPU、RAM 和存储资源，只有一个操作系统需要授权，只有一个操作系统需要升级和打补丁。同时，只有一个操作系统面临被攻击的风险。简言之，就是只有一份 OS 损耗。

在上述单台机器上只需要运行 4 个业务应用的场景中，也许问题尚不明显。但当需要运行成百上千应用的时候，就会引起质的变化。

另一个值得考虑的事情是启动时间。因为容器并不是完整的操作系统，所以其启动要远比虚拟机快。

切记，在容器内部并不需要内核，也就没有定位、解压以及初始化的过程——更不用提在内核启动过程中对硬件的遍历和初始化了。

这些在容器启动的过程中统统都不需要！唯一需要的是位于下层操作系统的共享内核是启动了的！最终结果就是，容器可以在 1s 内启动。唯一对容器启动时间有影响的就是容器内应用启动所花费的时间。

这就是容器模型要比虚拟机模型简洁并且高效的原因了。**使用容器可以在更少的资源上运行更多的应用，启动更快，并且支付更少的授权和管理费用，同时面对未知攻击的风险也更小**。

**查看docker daemon**

通常登录 Docker 主机后的第一件事情是检查 Docker 是否正在运行。

```
$ docker version
Client: Docker Engine - Community
 Version:           19.03.13
 API version:       1.40
 Go version:        go1.13.15
 Git commit:        4484c46d9d
 Built:             Wed Sep 16 17:02:52 2020
 OS/Arch:           linux/amd64
 Experimental:      false

Server: Docker Engine - Community
 Engine:
  Version:          19.03.13
  API version:      1.40 (minimum version 1.12)
  Go version:       go1.13.15
  Git commit:       4484c46d9d
  Built:            Wed Sep 16 17:01:20 2020
  OS/Arch:          linux/amd64
  Experimental:     false
 containerd:
  Version:          1.3.7
  GitCommit:        8fba4e9a7d01810a393d5d25a3621dc101981175
 runc:
  Version:          1.0.0-rc10
  GitCommit:        dc9208a3303feef5b3839f4323d9beb36df0a9dd
 docker-init:
  Version:          0.18.0
  GitCommit:        fec3683
```

当命令输出中包含 Client 和 Server 的内容时，可以继续下面的操作。如果在 Server 部分中包含了错误码，这表示 Docker daemon 很可能没有运行，或者当前用户没有权限访问。如果在 Linux 中遇到无权限访问的问题，需要确认当前用户是否属于本地 Docker UNIX 组。

查看docker状态：

```
systemctl status docker
systemctl is-active docker
```

**启动一个简单的容器**

启动容器的基本命令格式：

```
docker container run <options> <im- age>:<tag> <app>
```

示例：

```sh
docker search ubuntu
docker image pull ubuntu    或者 docker pull ubuntu
docker container run -it ubuntu  或者 docker run -it ubuntu 	-i和-t提供了对容器的交互式shell访问

run回车之后，会进入到容器内部的shell中：
root@15592a8c4b21:/## 


注意命令提示符中的容器ID。在例子中它是15592a8c4b21，稍后需要该容器ID以在要删除容器时标识容器。现在可以在容器内运行任何命令。例如，让我们更新容器内的包数据库。我们不需要sudo命令添加前缀，因为是以root用户身份在容器内操作：

apt update
apt install nodejs   安装nodejs
node -v  查看版本

在容器内进行的任何更改仅适用于该容器。要退出容器，请输入exit退出。
```

docker是怎么工作的：

Docker是一个**Client-Server**结构的系统，Docker守护进程（Docker daemon）运行在主机上， 然后通过Socket连接从客户端访问，守护进程从客户端接受命令并管理运行在主机上的容器。 **容器，是一个运行时环境，就是我们前面说到的集装箱。**

![image-20201116153544285](docker.assets/image-20201116153544285.png)

> 当我们敲击docker container run -it ubutu并回车后，底层发生了这些事情：
>
> 1、Docker 客户端选择合适的 API 来调用 Docker daemon。
>
> 2、Docker daemon 接收到命令并搜索 Docker 本地缓存，观察是否有命令所请求的镜像。
>
> 如果本地缓存并未包含该镜像，Docker 接下来会查询在 Docker Hub 中是否存在对应镜像。找到该镜像后，Docker 将镜像拉取到本地，存储在本地缓存当中。
>
> 在标准的、开箱即用的 Linux 安装版中，Docker daemon 通过位于 /var/run/docker.sock 的本地 IPC/Unix [socket](http://c.biancheng.net/socket/) 来实现 Docker 远程 API；在 Windows 中，Docker daemon 通过监听名为 npipe:////./pipe/docker_engine 的管道来实现。
>
> 通过配置，也可以借助网络来实现 Docker Client 和 daemon 之间的通信。
>
> Docker 默认非 TLS 网络端口为 2375，TLS 默认端口为 2376。（TLS是https比http多出来的一个证书）
>
> 3、一旦镜像拉取到本地，daemon 就创建容器并在其中运行指定的应用。

**容器进程**

在容器的bash shell里执行，`ps -ef` 查看进程：

```
root@15592a8c4b21:/## ps -ef
UID          PID    PPID  C STIME TTY          TIME CMD
root           1       0  0 15:36 pts/0    00:00:00 /bin/bash
root        2817       1  0 16:07 pts/0    00:00:00 ps -ef
```

可以看到，只有一个/bin/bash进程和一个临时进程ps -ef 。

所以，若输入 `exit` 退出 Bash Shell，那么容器也会退出（终止）。

原因是**容器如果不运行任何进程则无法存在**，杀死 Bash Shell 即杀死了容器唯一运行的进程，导致这个容器也被杀死。

按下 Ctrl+p+q 组合键则会退出容器但并不终止容器运行。这样做会切回到 Docker 主机的 Shell，并保持容器在后台运行。

可以使用 `docker container ls` 命令来观察当前系统正在运行的容器列表：

```
jinguang@jinguang:~$ docker container ls
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
15592a8c4b21        ubuntu              "/bin/bash"         33 minutes ago      Up 33 minutes                           awesome_franklin
```

**当前容器仍然在运行，并且可以通过 docker container exec 命令将终端重新连接到 Docker：**

```
jinguang@jinguang:~$ docker container exec -it 15592a8c4b21 bash
root@15592a8c4b21:/## ps -ef
UID          PID    PPID  C STIME TTY          TIME CMD
root           1       0  0 15:36 pts/0    00:00:00 /bin/bash
root        2818       0  0 16:12 pts/1    00:00:00 bash
root        2830    2818  0 16:12 pts/1    00:00:00 ps -ef
```

再次运行 ps -ef  命令，会看到两个 Bash ，这是因为 `docker container exec` 命令创建了新的 Bash 进程并且连接到容器。这意味着在当前 Shell 输入 exit 并不会导致容器终止，因为原 Bash 或者 PowerShell 进程还在运行当中。

输入 exit 退出容器，并通过命令 `docker container ps` 来确认容器依然在运行中。果然容器还在运行：

```
root@15592a8c4b21:/## exit
exit
jinguang@jinguang:~$ docker container ls
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
15592a8c4b21        ubuntu              "/bin/bash"         37 minutes ago      Up 37 minutes                           awesome_franklin
```

如果在自己的 Docker 主机上运行示例，则需要使用下面两个命令来停止并删除容器。

```sh
jinguang@jinguang:~$ docker container stop 15592a8c4b21
15592a8c4b21

jinguang@jinguang:~$ docker container ls
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES


docker container rm 15592a8c4b21
```



**docker生命周期**

![image-20201116153138227](docker.assets/image-20201116153138227.png)



举个例子，介绍一下容器的生命周期，从创建、运行、休眠，直至销毁的整个过程。

注意：启动一个容器时，是可以给容器取名称的。

```sh
根据ubuntu镜像新建一个容器，名称为“percy”，意指持久化（persistent）。
jinguang@jinguang:~$ docker container run --name percy -it ubuntu:latest /bin/bash

在容器里面创建一个文件，将一部分数据写入其中
root@66c7dc915bae:/## cd tmp/
root@66c7dc915bae:/tmp## ls -l
total 0
root@66c7dc915bae:/tmp## echo "hello world" > new
root@66c7dc915bae:/tmp## ls -l
total 4
-rw-r--r-- 1 root root 17 Nov 16 08:28 new
root@66c7dc915bae:/tmp## cat new 
hello world


按ctrl+P+Q退出bash，让容器继续后台运行
jinguang@jinguang:~$ docker container ls
CONTAINER ID        IMAGE               COMMAND             CREATED              STATUS              PORTS               NAMES
66c7dc915bae        ubuntu:latest       "/bin/bash"         About a minute ago   Up About a minute                       percy

停止容器（容器有名称后，可以根据名称来停止，不用容器ID也行）
jinguang@jinguang:~$ docker container stop percy
percy

查看“正在运行”的容器
jinguang@jinguang:~$ docker container ls
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES

查看“所有”容器（包括停止的容器）
jinguang@jinguang:~$ docker container ls -a
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS                      PORTS               NAMES
66c7dc915bae        ubuntu:latest       "/bin/bash"         2 minutes ago       Exited (0) 26 seconds ago                       percy

开启容器  （尽管已经停止运行，容器的全部配置和内容仍然保存在 Docker 主机的文件系统之中，并且随时可以重新启动。）
jinguang@jinguang:~$ docker container start percy
percy

连接到重启后的容器：
jinguang@jinguang:~$ docker container exec -it percy bash
查看文件数据还在不在：
root@66c7dc915bae:/##  cat /tmp/new 
hello world
确认之前创建的文件依然存在，并且文件中仍包含之前写入的数据。
这证明停止容器运行并不会损毁容器或者其中的数据。


退出-停止-删除
root@66c7dc915bae:/## exit
exit
jinguang@jinguang:~$ docker container ls
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
66c7dc915bae        ubuntu:latest       "/bin/bash"         3 minutes ago       Up About a minute                       percy
jinguang@jinguang:~$ docker container stop percy
percy
jinguang@jinguang:~$ docker container rm percy   
percy
（docker container rm 命令后面添加 -f 参数来一次性删除运行中的容器是可行的，但是不推荐,删除容器的最佳方式还是分两步，先停止容器然后删除。）

jinguang@jinguang:~$ docker container ls
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
```

上面的示例阐明了容器的持久化特性，还是需要指出卷（volume）才是在容器中存储持久化数据的首选方式。

**优雅的停止容器**

linux下关于终止进程的信号:SIGTERM 和 SIGKILL

- SIGKILL信号：无条件终止进程信号。进程接收到该信号会立即终止，不进行清理和暂存工作。该信号不能被忽略、处理和阻塞，它向系统管理员提供了可以杀死任何进程的方法。
- SIGTERM信号：程序终结信号，可以由kill命令产生。与SIGKILL不同的是，SIGTERM信号可以被阻塞和终止，以便程序在退出前可以保存工作或清理临时文件等。

docker的相关操作：

- docker stop 会先发出SIGTERM信号给进程，告诉进程即将会被关闭。在-t指定的等待时间过了之后，将会立即发出SIGKILL信号，直接关闭容器。
- docker kill 直接发出SIGKILL信号关闭容器。但也可以通过-s参数修改发出的信号。
- docker restart 中同样可以设置 -t 等待时间，当等待时间过后会立刻发送SIGKILL信号，直接关闭容器。

- `docker container rm <container> -f` 命令不会先友好地发送 SIGTERM，这条命令会直接发出 SIGKILL。

因此会发现在docker stop的等待过程中，如果终止docker stop的执行，容器最终没有被关闭。而docker kill几乎是立刻发生，无法撤销。

**docker容器的重启策略**

通常建议在运行容器时配置好重启策略。这是容器的一种自我修复能力，可以在指定事件或者错误后重启来完成自我修复。

Docker容器的重启策略如下：

- no，默认策略，在容器退出时不重启容器
- on-failure，在容器非正常退出时（退出状态非0），才会重启容器
- on-failure:3，在容器非正常退出时重启容器，最多重启3次
- always，在容器退出时总是重启容器
- unless-stopped，在容器退出时总是重启容器，但是不考虑在Docker守护进程启动时就已经停止了的容器

举个 always 的例子，exit之后，注意，容器于 9s 前被创建，但却在 4s 前才启动。这是因为在容器中输入退出命令的时候，容器被杀死，然后 Docker 又重新启动了该容器。，这是因为在容器中输入退出命令的时候，容器被杀死，然后 Docker 又重新启动了该容器：

```
jinguang@jinguang:~$ docker container run --name neversaydie -it --restart always ubuntu:latest bash
root@bc99af4471a0:/## exit
exit
jinguang@jinguang:~$ docker container ls
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
bc99af4471a0        ubuntu:latest       "bash"              9 seconds ago       Up 4 seconds                            neversaydie
```

**快速清理**

这种操作一定**不能**在生产环境系统或者运行着重要容器的系统上执行。

在 Docker 主机的 Shell 中运行下面的命令，可以删除全部容器。

```
$()
```

**容器常用命令**

**1) docker container run**

启动新容器的命令。

docker container run -it ubuntu /bin/bash 命令会在前台启动一个 Ubuntu 容器，并运行 Bash Shell。

Ctrl-PQ 会断开 Shell 和容器终端之间的链接，并在退出后保持容器在后台处于运行（UP）状态。

**2) docker container ls**

用于列出所有在运行（UP）状态的容器。如果使用 -a 标记，还可以看到处于停止（Exited）状态的容器。

**3) docker container exec**

用于在运行状态的容器中，启动一个新进程。该命令在将 Docker 主机 Shell 连接到一个运行中容器终端时非常有用。

`docker container exec -it <container-name or container-id> bash` 命令会在容器内部启动一个 Bash Shell 进程，并连接到该 Shell。

为了使该命令生效，用于创建容器的镜像必须包含 Bash Shell。

**4) docker container stop**

此命令会停止运行中的容器，并将状态置为 Exited(0)。

该命令通过发送 SIGTERM 信号给容器内 PID 为 1 的进程达到目的。

如果进程没有在 10s 之内得到清理并停止运行，那么会接着发送 SIGKILL 信号来强制停止该容器。

docker container stop 可以接收容器 ID 以及容器名称作为参数。

**5) docker container start**

重启处于停止（Exited）状态的容器。可以在 docker container start 命令中指定容器的名称或者 ID。

**6) docker container rm**

删除停止运行的容器。可以通过容器名称或者 ID 来指定要删除的容器。推荐首先使用 docker container stop 命令停止容器，然后使用 docker container rm 来完成删除。

**7) docker container inspect**

显示容器的配置细节和运行时信息。该命令接收容器名称和容器 ID 作为主要参数。



## docker应用容器化

Docker的核心思想就是如何将应用整合到容器中，并且能在容器中实际运行。

将应用整合到容器中并且运行起来的这个过程，称为“容器化”（Containerizing），有时也叫作“Docker化”（Dockerizing）。

完整的应用容器化过程主要分为以下几个步骤。

- 编写应用代码。
- 创建一个 Dockerfile，其中包括当前应用的描述、依赖以及该如何运行这个应用。
- 对该 Dockerfile 执行 docker image build 命令。
- 等待 Docker 将应用程序构建到 Docker 镜像中。


一旦应用容器化完成（即应用被打包为一个 Docker 镜像），就能以镜像的形式交付并以容器的方式运行了。

![image-20201116173948400](docker.assets/image-20201116173948400.png)



**示例：将一个简单的单节点 Node.js Web 应用容器化**

**1、获取应用代码**

应用代码可以从网盘获取（https://pan.baidu.com/s/150UgIJPvuQUf0yO3KBLegg 提取码：pkx4）。

![image-20201116182425771](docker.assets/image-20201116182425771.png)

**2、上传到linux上，分析里面的Dockerfile**

Dockerfile 主要包括两个用途：

- 对当前应用的描述。
- 指导 Docker 完成应用的容器化（创建一个包含当前应用的镜像）

```
jinguang@jinguang:/yitong/download/dockerdemo/psweb-master$ ls
app.js  circle.yml  Dockerfile  package.json  README.md  test  views
jinguang@jinguang:/yitong/download/dockerdemo/psweb-master$ cat Dockerfile 
## Test web-app to use with Pluralsight courses and Docker Deep Dive book
## Linux x64
FROM alpine	（1）

LABEL maintainer="nigelpoulton@hotmail.com"	（2）

## Install Node and NPM
RUN apk add --update nodejs nodejs-npm	（3）

## Copy app to /src
COPY . /src	（4）

WORKDIR /src	（5）

## Install dependencies
RUN  npm install	（6）

EXPOSE 8080	（7）

ENTRYPOINT ["node", "./app.js"]	（8）
```

（1）FROM 指令指定的镜像，会作为当前镜像的一个基础镜像层，当前应用的剩余内容会作为新增镜像层添加到基础镜像层之上。

本例中的应用基于 Linux 操作系统，所以在 FROM 指令当中所引用的也是一个 Linux 基础镜像；如果要容器化的应用是一个基于 Windows 操作系统的应用，就需要指定一个像 microsoft/aspnetcore-build 这样的 Windows 基础镜像了。

截至目前，基础镜像的结构如下图所示。

![image-20201116183315562](docker.assets/image-20201116183315562.png)













**docker架构**

有了上面对docker的了解后，来看一下docker的架构：

![image-20201116173758928](docker.assets/image-20201116173758928.png)

```
Docker Client：接收命令和Docker Host进行交互的客户端

Docker Host：运行Docker服务的主机

- Docker Daemon：守护进程，用于管理所有镜像和容器
- Docker Images/Containers：镜像和容器实例

Registry(Hub)：镜像仓库
```

## docker卷

Docker 采用 AFUS 分层文件系统时，文件系统的改动都是发生在最上面的容器层。在容器的生命周期内，它是持续的，包括容器在被停止后。但是，当容器被删除后，该数据层也随之被删除了。因此，Docker 采用 volume （卷）的形式来向容器提供持久化存储。

默认情况下，容器不使用任何 volume，此时，容器的数据被保存在容器之内，它**只在容器的生命周期内存在**，会随着容器的被删除而被删除。当然，也可以使用 docker commit 命令将它持久化为一个新的镜像。

一个 data volume 是容器中绕过 Union 文件系统的一个特定的目录。在 Linux 系统中，该存储的目录在 `/var/lib/docker/<storage-driver>/` 之下，是容器的一部分。在 Windows 系统中位于 `C\ProgramData\Docker\windowsfilter\` 目录之下。它被设计用来保存数据，而不管容器的生命周期。因此，当你删除一个容器时，Docker 肯定不会自动地删除一个volume。

**创建卷**

```
$ docker volume create my-vol
```

**列举存在的卷**

```
$ docker volume ls
```

**查看卷详情**

```
$ docker volume inspect my-vol
[
    {
        "Driver": "local",
        "Labels": {},
        "Mountpoint": "/var/lib/docker/volumes/my-vol/_data",
        "Name": "my-vol",
        "Options": {},
        "Scope": "local"
    }
]

```

**删除卷**

```
$ docker volume rm my-vol
```

**开启一个带卷的容器**

使用`--mount`方式：

```
$ docker run -d \
  --name devtest \
  --mount source=myvol2,target=/app \
  nginx:latest
```

使用`-v`方式：

```
$ docker run -d \
  --name devtest \
  -v myvol2:/app \
  nginx:latest
```

## docker manifest

```sh
docker manifest inspect harbor.apulis.cn/develop/cicd/jenkins-slave:20201223

docker manifest create harbor.apulis.cn/develop/cicd/jenkins-slave:20201223 \
    harbor.apulis.cn/develop/cicd/jenkins-slave/arm64:20201223 --amend
docker manifest annotate harbor.apulis.cn/develop/cicd/jenkins-slave:20201223 \
    harbor.apulis.cn/develop/cicd/jenkins-slave/arm64:20201223 --arch arm64 --os linux
docker manifest push harbor.apulis.cn/develop/cicd/jenkins-slave:20201223

docker manifest create harbor.apulis.cn/develop/cicd/jenkins-slave:20201223 \
    harbor.apulis.cn/develop/cicd/jenkins-slave/amd64:20201223 --amend
docker manifest annotate harbor.apulis.cn/develop/cicd/jenkins-slave:20201223 \
    harbor.apulis.cn/develop/cicd/jenkins-slave/amd64:20201223 --arch amd64 --os linux
docker manifest push harbor.apulis.cn/develop/cicd/jenkins-slave:20201223
```







## Alpine

https://yeasy.gitbook.io/docker_practice/os/alpine

https://pkgs.alpinelinux.org/packages

更换镜像源：

```
sed -i 's/dl-cdn.alpinelinux.org/mirrors.tuna.tsinghua.edu.cn/g' /etc/apk/repositories
```

坑1 ： 下载慢

解决：
echo "https://mirror.tuna.tsinghua.edu.cn/alpine/v3.4/main" > /etc/apk/repositories \
&& echo "https://mirror.tuna.tsinghua.edu.cn/alpine/v3.4/community" >> /etc/apk/repositories \
&& echo "https://mirror.tuna.tsinghua.edu.cn/alpine/edge/testing" >> /etc/apk/repositories

坑2： 找不到包

解决： 搜索 https://pkgs.alpinelinux.org/packages ，加入指定的“Branch”和“Repository”的源到/etc/apk/repositories，就可以apk add

 

坑3： 安装失败

```
ERROR: https://mirror.tuna.tsinghua.edu.cn/alpine/v3.4/community: Bad file descriptor
WARNING: Ignoring APKINDEX.79f426e4.tar.gz: Bad file descriptor
ERROR: unsatisfiable constraints:
  openssh (missing):
    required by: world[openssh]
```

解决：

```
apk add  openssh --no-cache #加--no-cache, 另外，还能减少镜像体积
```