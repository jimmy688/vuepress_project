## Linux Redis的安装

#### 1.下载redis安装包

（1）可以直接在linux系统控制台执行命令：wget http://219.238.7.66/files/502600000A29C8D5/download.redis.io/releases/redis-3.2.9.tar.gz

（2）点击这里下载我提供的安装包，提取码：xet8

#### 2.安装

（1）将下载好的安装包解压到node01的/kkb/install目录下。执行命令：tar -zxvf redis-3.2.9.tar.gz -C /kkb/install 

（2）编译解压文件。执行命令：make

注意事项：执行后有可能会报错。

第一种错误：**gcc:Command not found**.这是系统没有安装gcc编译程序，执行命令： yum -y install gcc 进行安装完后，先执行命令：make distclean 清除之前编译产生的文件，然后在执行make命令即可。

第二种错误：**error: jemalloc/jemalloc.h: No such file or directory**。解决方案，执行命令：make MALLOC=libc 然后在执行编译命令。

编译成功后如图所示：

![](redis.assets/20191211142850955.png)

（3）最后在执行一下命令：make install .

注意：在make执行之后再执行 make install，该操作则将 src下的许多可执行文件复制到/usr/local/bin 目录下，这样做可以在任意目录执行redis的软件的命令（例如启动，停止，客户端连接服务器等）， make install 也可以不用执行，看心情啦，当然了，推荐执行一下。执行后效果如下：

![](redis.assets/20191211143225800.png)

致此，redis已经安装成功了，下面可以启动一下试试了。

#### 3.使用

（1）启动

进入/kkb/install/redis-3.2.9/src目录下，执行命令：**./redis-server &** 后台方式启动redis。效果如下：

![image-20200504133630611](redis.assets/image-20200504133630611.png)

此时查看redis进程，如下显示，说明已经启动成功了：

（2）关闭redis

/kkb/install/redis-3.2.9/src目录下执行：./redis-cli shutdown 建议使用这种方式，redis会将数据处理完后在关闭。当然也可以直接杀进程，kill pid ，但这种方式会直接关闭，如果有正在处理的数据就会停止处理。

（3）redis的默认端口号是：**6379**

## Redis介绍

#### Redis 简介

Redis 是完全开源免费的，遵守BSD协议，**是一个高性能的key-value数据库**。

Redis 与其他 key - value 缓存产品有以下三个特点：

- Redis**支持数据的持久化**，可以将内存中的数据保存在磁盘中，重启的时候可以再次加载进行使用。
- Redis不仅仅支持简单的key-value类型的数据，同时**还提供list，set，zset，hash等数据结构的存储**。
- Redis**支持数据的备份**，即master-slave模式的数据备份。

------

#### Redis 优势

- **性能极高** – Redis能读的速度是110000次/s,写的速度是81000次/s 。
- 丰富的数据类型 – Redis支持二进制案例的 Strings, Lists, Hashes, Sets 及 Ordered Sets 数据类型操作。
- 原子 – **Redis的所有操作都是原子性的，意思就是要么成功执行要么失败完全不执行**。单个操作是原子性的。多个操作也支持事务，即原子性，通过MULTI和EXEC指令包起来。
- 丰富的特性 – Redis还支持 publish/subscribe, 通知, key 过期等等特性。

------

#### Redis与其他key-value存储有什么不同？

- Redis有着更为复杂的数据结构并且提供对他们的原子性操作，这是一个不同于其他数据库的进化路径。Redis的数据类型都是基于基本数据结构的同时对程序员透明，无需进行额外的抽象。
- Redis运行在内存中但是可以持久化到磁盘，所以在对不同数据集进行高速读写时需要权衡内存，因为数据量不能大于硬件内存。在内存数据库方面的另一个优点是，相比在磁盘上相同的复杂的数据结构，在内存中操作起来非常简单，这样Redis可以做很多内部复杂性很强的事情。同时，在磁盘格式方面他们是紧凑的以追加的方式产生的，因为他们并不需要进行随机访问。

## Redis 命令

Redis 命令用于在 redis 服务上执行操作。

要在 redis 服务上执行命令需要一个 redis 客户端。Redis 客户端在我们之前下载的的 redis 的安装包中。

#### 语法

启动Redis 客户端的基本语法为：

```
[hadoop@node01 ~]$ redis-cli
127.0.0.1:6379>
```

#### 实例

以下实例讲解了如何启动 redis 客户端：

启动 redis 客户端，打开终端并输入命令 **redis-cli**。该命令会连接本地的 redis 服务。

```
[hadoop@node01 ~]$ redis-cli
127.0.0.1:6379> ping
PONG
127.0.0.1:6379> 
```

在以上实例中我们连接到本地的 redis 服务并执行 **PING** 命令，该命令用于检测 redis 服务是否启动。

------

### 在远程服务上执行命令

如果需要在远程 redis 服务上执行命令，同样我们使用的也是 **redis-cli** 命令。

#### 语法

```
$ redis-cli -h host -p port -a password
```

#### 实例

以下实例演示了如何连接到主机为 127.0.0.1，端口为 6379 ，密码为 mypass 的 redis 服务上。

```
$redis-cli -h 127.0.0.1 -p 6379 -a "mypass"
redis 127.0.0.1:6379>
redis 127.0.0.1:6379> PING

PONG
```

## Redis 键(key)

Redis 键命令用于管理 redis 的键。 

#### 语法

Redis 键命令的基本语法如下：

```
redis 127.0.0.1:6379> COMMAND KEY_NAME
```

#### 实例

```
redis 127.0.0.1:6379> SET runoobkey redis
OK
redis 127.0.0.1:6379> DEL runoobkey
(integer) 1
```

在以上实例中 **DEL** 是一个命令， **runoobkey** 是一个键。 如果键被删除成功，命令执行后输出 **(integer) 1**，否则将输出 **(integer) 0**

------

#### Redis keys 命令

下表给出了与 Redis 键相关的基本命令：

| 序号 | 命令及描述                                                   |
| :--- | :----------------------------------------------------------- |
| 1    | [DEL key](https://www.runoob.com/redis/keys-del.html) 该命令用于在 key 存在时删除 key。 |
| 2    | [DUMP key](https://www.runoob.com/redis/keys-dump.html)  序列化给定 key ，并返回被序列化的值。 |
| 3    | [EXISTS key](https://www.runoob.com/redis/keys-exists.html)  检查给定 key 是否存在。 |
| 4    | [EXPIRE key](https://www.runoob.com/redis/keys-expire.html) seconds 为给定 key 设置过期时间，以秒计。 |
| 5    | [EXPIREAT key timestamp](https://www.runoob.com/redis/keys-expireat.html)  EXPIREAT 的作用和 EXPIRE 类似，都用于为 key 设置过期时间。 不同在于 EXPIREAT 命令接受的时间参数是 UNIX 时间戳(unix timestamp)。 |
| 6    | [PEXPIRE key milliseconds](https://www.runoob.com/redis/keys-pexpire.html)  设置 key 的过期时间以毫秒计。 |
| 7    | [PEXPIREAT key milliseconds-timestamp](https://www.runoob.com/redis/keys-pexpireat.html)  设置 key 过期时间的时间戳(unix timestamp) 以毫秒计 |
| 8    | [KEYS pattern](https://www.runoob.com/redis/keys-keys.html)  查找所有符合给定模式( pattern)的 key 。 |
| 9    | [MOVE key db](https://www.runoob.com/redis/keys-move.html)  将当前数据库的 key 移动到给定的数据库 db 当中。 |
| 10   | [PERSIST key](https://www.runoob.com/redis/keys-persist.html)  移除 key 的过期时间，key 将持久保持。 |
| 11   | [PTTL key](https://www.runoob.com/redis/keys-pttl.html)  以毫秒为单位返回 key 的剩余的过期时间。 |
| 12   | [TTL key](https://www.runoob.com/redis/keys-ttl.html)  以秒为单位，返回给定 key 的剩余生存时间(TTL, time to live)。 |
| 13   | [RANDOMKEY](https://www.runoob.com/redis/keys-randomkey.html)  从当前数据库中随机返回一个 key 。 |
| 14   | [RENAME key newkey](https://www.runoob.com/redis/keys-rename.html)  修改 key 的名称 |
| 15   | [RENAMENX key newkey](https://www.runoob.com/redis/keys-renamenx.html)  仅当 newkey 不存在时，将 key 改名为 newkey 。 |
| 16   | [TYPE key](https://www.runoob.com/redis/keys-type.html)  返回 key 所储存的值的类型。 |

更多命令请参考：https://redis.io/commands