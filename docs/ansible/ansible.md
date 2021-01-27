## ansible简介

ansible是一个自动化部署工具，主要应用场景有配置系统、软件部署、持续发布及不停服平滑滚动更新的高级任务编排。

ansible版本更新很快，社区贡献的新模块和组件发展的非常快，每个版本都会合入很多的新模块。

安装ansible的时候，建议安装较新版本。

ansible官方文档：

- https://cn-ansibledoc.readthedocs.io/zh_CN/latest/
- https://docs.ansible.com/ansible/latest/user_guide/index.html
- http://www.ansible.com.cn/docs/intro_installation.html


## ansible的安装



### 准备工作

**管理机环境要求：**

准备一台管理机，该管理机可通过 SSH 连接到你所有的被管理机。

运行 Ansible 的服务器必须且只需要安装有 Python 2.7+ 或者 Python 3.5+。Red Hat, Debian, CentOS, macOS, 任一 BSD 系列的系统均可。 但`Windows` 不能用于管理机。

选择管理机时，需要注意的时，网络条件越好越便于管理。 比如：当你选择在云上使用 Ansible 时，那么管理机和管理节点都在云上是最佳选择，连接外网的节点速度则会慢很多，也存在很大的安全风险。

**受管节点环境要求：**

受管节点需要和外界正常通信，默认使用 SSH 协议。 默认使用 SFTP 。 如果 SFTP 无法使用，你可以在 ansible.cfg 中将其修改为 SCP。

同样，受管机需要有 Python 2.6+ 或 Python 3.5以上的环境。

默认情况下 Ansible 使用 `/usr/bin/python` 下的Python 解释器运行命令。 但部分 Linux 发行版可能只安装了 Python 3 解释器，可以从 `/usr/bin/python3` 找到。

1、可以通过inventory文件来设置指定python解释器 [ansible_python_interpreter](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/intro_inventory.html#ansible-python-interpreter)，如：

```sh
freebsd_host      ansible_python_interpreter=/usr/local/bin/python
```

2、也可以干脆安装一个 Python 2的解释器。如果 Python 2 的解释器没有安装在指定目录 **/usr/bin/python** 。也需要使用第一种方法来指定解释器的位置。

### 开始安装

**安装ansible的方式有一下几种：**

- 使用系统默认的包管理器安装 (`for Red Hat Enterprise Linux (TM), CentOS, Fedora, Debian, or Ubuntu`).
- 使用`pip`安装
- 源码安装 `devel` 版本的Ansible，体验最新版本的功能

1、**在ubuntu中配置 PPA 来安装：**

```sh
$ sudo apt update
$ sudo apt install software-properties-common
$ sudo apt-add-repository --yes --update ppa:ansible/ansible
$ sudo apt install ansible
```

2、**[从源码安装运行 Ansible (devel)](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/installation_guide/intro_installation.html#id32)**

3、**安装指定版本的ansible:**

## 配置ansible

配置ansible有几种方式：

```
1、配置文件
2、系统环境配置
3、命令行选项
```

`ansible`的配置文件是`ansible.cfg`，核心配置都在这个文件中。

如果通过包管理工具安装的，那最新的 `ansible.cfg` 默认存放在 `/etc/ansible` 中，也有可能因为重复安装或升级，文件是以 `.rpmnew` 结尾。

---

ansible配置支持系统变量，**如果系统环境设置了，会覆盖ansible的配置。**

---

**在命令行指定的配置优先级比从配置文件中读取的优化级要高**，也即会覆盖从配置文件中读取的环境变量。

## 用户指南

欢迎使用 Ansible User Guide!

该页内容包括命令行使用、配置 inventory、编写 playbooks.

- [Ansible 快速入门指南](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/quickstart.html)
- Ansible 概览
  - [管理机](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/basic_concepts.html#id2)
  - [受控节点](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/basic_concepts.html#id3)
  - [Inventory 仓库](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/basic_concepts.html#inventory)
  - [Modules 模块](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/basic_concepts.html#modules)
  - [Tasks 任务](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/basic_concepts.html#tasks)
  - [Playbooks 任务剧本](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/basic_concepts.html#playbooks)
- 入门
  - [选择指定机器执行](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/intro_getting_started.html#id3)
  - [连接远程受控节点](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/intro_getting_started.html#remote-connection-information)
  - [复制和执行模块](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/intro_getting_started.html#id8)
  - [接下来](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/intro_getting_started.html#id10)
- Inventory 使用进阶
  - [Inventory 基础: formats, hosts, and groups](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/intro_inventory.html#inventory-formats-hosts-and-groups)
  - [Inventory 变量定义](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/intro_inventory.html#id6)
  - [给单台主机设置变量 : host variables](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/intro_inventory.html#host-variables)
  - [给多台主机设置变量 : group variables](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/intro_inventory.html#group-variables)
  - [编排主机和组变量](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/intro_inventory.html#splitting-out-vars)
  - [变量合并](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/intro_inventory.html#how-we-merge)
  - [使用多个 Inventory](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/intro_inventory.html#using-multiple-inventory-sources)
  - [主机连接: Inventory 参数设置](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/intro_inventory.html#behavioral-parameters)
  - [Inventory 设置示例](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/intro_inventory.html#inventory-setup-examples)
- 动态 Inventory 清单配置
  - [Inventory 脚本示例: Cobbler](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/intro_dynamic_inventory.html#inventory-cobbler)
  - [Inventory 清单脚本示例: AWS EC2](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/intro_dynamic_inventory.html#inventory-aws-ec2)
  - [Inventory 脚本示例: OpenStack](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/intro_dynamic_inventory.html#inventory-openstack)
  - [其它 inventory scripts](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/intro_dynamic_inventory.html#inventory-scripts)
  - [Inventory 目录和多个 Inventory 源的使用](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/intro_dynamic_inventory.html#inventory-inventory)
  - [动态组中的静态组](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/intro_dynamic_inventory.html#static-groups-of-dynamic)
- Pattern: 正则匹配主机和组
  - [使用 patterns 模式](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/intro_patterns.html#patterns)
  - [通过 patterns](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/intro_patterns.html#common-patterns)
  - [patterns 局限性](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/intro_patterns.html#id3)
  - [高级 Pattern 选项](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/intro_patterns.html#id4)
  - [Patterns and ansible-playbook 标志](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/intro_patterns.html#patterns-and-ansible-playbook)
- ad-hoc 命令操作指引
  - [Why use ad-hoc commands?](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/intro_adhoc.html#why-use-ad-hoc-commands)
  - [Use cases for ad-hoc tasks](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/intro_adhoc.html#use-cases-for-ad-hoc-tasks)
- Connection methods and details
  - [ControlPersist and paramiko](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/connection_details.html#controlpersist-and-paramiko)
  - [Setting a remote user](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/connection_details.html#setting-a-remote-user)
  - [Setting up SSH keys](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/connection_details.html#setting-up-ssh-keys)
  - [Running against localhost](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/connection_details.html#running-against-localhost)
  - [Managing host key checking](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/connection_details.html#managing-host-key-checking)
  - [Other connection methods](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/connection_details.html#other-connection-methods)
- Working with command line tools
- Working With Playbooks
  - [Intro to Playbooks](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/playbooks_intro.html)
  - [Tips and tricks](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/playbooks_best_practices.html)
  - [Re-using Ansible artifacts](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/playbooks_reuse.html)
  - [Roles](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/playbooks_reuse_roles.html)
  - [Using Variables](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/playbooks_variables.html)
  - [Templating (Jinja2)](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/playbooks_templating.html)
  - [Conditionals](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/playbooks_conditionals.html)
  - [Loops](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/playbooks_loops.html)
  - [Blocks](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/playbooks_blocks.html)
  - [Advanced Playbooks Features](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/playbooks_special_topics.html)
  - [Controlling playbook execution: strategies and more](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/playbooks_strategies.html)
  - [Playbook Example: Continuous Delivery and Rolling Upgrades](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/guide_rolling_upgrade.html)
- Understanding privilege escalation: become
  - [Using become](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/become.html#using-become)
  - [Risks and limitations of become](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/become.html#risks-and-limitations-of-become)
  - [Become and network automation](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/become.html#become-and-network-automation)
  - [Become and Windows](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/become.html#become-and-windows)
- Ansible Vault
  - [What Can Be Encrypted With Vault](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/vault.html#what-can-be-encrypted-with-vault)
  - [Vault IDs and Multiple Vault Passwords](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/vault.html#vault-ids-and-multiple-vault-passwords)
  - [Creating Encrypted Files](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/vault.html#creating-encrypted-files)
  - [Editing Encrypted Files](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/vault.html#editing-encrypted-files)
  - [Rekeying Encrypted Files](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/vault.html#rekeying-encrypted-files)
  - [Encrypting Unencrypted Files](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/vault.html#encrypting-unencrypted-files)
  - [Decrypting Encrypted Files](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/vault.html#decrypting-encrypted-files)
  - [Viewing Encrypted Files](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/vault.html#viewing-encrypted-files)
  - [Use encrypt_string to create encrypted variables to embed in yaml](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/vault.html#use-encrypt-string-to-create-encrypted-variables-to-embed-in-yaml)
  - [Providing Vault Passwords](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/vault.html#providing-vault-passwords)
  - [Vault Password Client Scripts](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/vault.html#vault-password-client-scripts)
  - [Speeding Up Vault Operations](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/vault.html#speeding-up-vault-operations)
  - [Vault Format](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/vault.html#vault-format)
  - [Vault Payload Format 1.1 - 1.2](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/vault.html#vault-payload-format-1-1-1-2)
- Sample Ansible setup
  - [Sample directory layout](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/sample_setup.html#sample-directory-layout)
  - [Alternative directory layout](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/sample_setup.html#alternative-directory-layout)
  - [Sample group and host variables](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/sample_setup.html#sample-group-and-host-variables)
  - [Sample playbooks organized by function](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/sample_setup.html#sample-playbooks-organized-by-function)
  - [Sample task and handler files in a function-based role](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/sample_setup.html#sample-task-and-handler-files-in-a-function-based-role)
  - [What the sample setup enables](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/sample_setup.html#what-the-sample-setup-enables)
  - [Organizing for deployment or configuration](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/sample_setup.html#organizing-for-deployment-or-configuration)
  - [Using local Ansible modules](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/sample_setup.html#using-local-ansible-modules)
- Working With Modules
  - [Introduction to modules](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/modules_intro.html)
  - [Return Values](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/reference_appendices/common_return_values.html)
  - [Module Maintenance & Support](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/modules_support.html)
- Working With Plugins
  - [Action Plugins](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/plugins/action.html)
  - [Become Plugins](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/plugins/become.html)
  - [Cache Plugins](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/plugins/cache.html)
  - [Callback Plugins](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/plugins/callback.html)
  - [Cliconf Plugins](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/plugins/cliconf.html)
  - [Connection Plugins](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/plugins/connection.html)
  - [Httpapi Plugins](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/plugins/httpapi.html)
  - [Inventory Plugins](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/plugins/inventory.html)
  - [Lookup Plugins](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/plugins/lookup.html)
  - [Netconf Plugins](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/plugins/netconf.html)
  - [Shell Plugins](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/plugins/shell.html)
  - [Strategy Plugins](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/plugins/strategy.html)
  - [Vars Plugins](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/plugins/vars.html)
  - [Filters](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/playbooks_filters.html)
  - [Tests](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/playbooks_tests.html)
  - [Plugin Filter Configuration](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/plugin_filtering_config.html)
- Ansible and BSD
  - [Connecting to BSD nodes](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/intro_bsd.html#connecting-to-bsd-nodes)
  - [Bootstrapping BSD](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/intro_bsd.html#bootstrapping-bsd)
  - [Setting the Python interpreter](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/intro_bsd.html#setting-the-python-interpreter)
  - [Which modules are available?](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/intro_bsd.html#which-modules-are-available)
  - [Using BSD as the control node](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/intro_bsd.html#using-bsd-as-the-control-node)
  - [BSD facts](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/intro_bsd.html#bsd-facts)
  - [BSD efforts and contributions](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/intro_bsd.html#bsd-efforts-and-contributions)
- Windows Guides
  - [Setting up a Windows Host](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/windows_setup.html)
  - [Windows Remote Management](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/windows_winrm.html)
  - [Using Ansible and Windows](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/windows_usage.html)
  - [Desired State Configuration](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/windows_dsc.html)
  - [Windows performance](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/windows_performance.html)
  - [Windows Frequently Asked Questions](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/windows_faq.html)
- Using collections
  - [Installing collections](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/collections_using.html#installing-collections)
  - [Listing collections](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/collections_using.html#listing-collections)
  - [Verifying collections](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/collections_using.html#verifying-collections)
  - [Using collections in a Playbook](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/collections_using.html#using-collections-in-a-playbook)
  - [Simplifying module names with the `collections` keyword](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/collections_using.html#simplifying-module-names-with-the-collections-keyword)

---

## ansible概览

**[管理机](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/basic_concepts.html#id4)**

任何安装了 Ansbile 的服务器，你都可以使用 `ansible` or `ansible-playbook` 命令。 任何安装了 Ansbile 的机器都可以做为管理节点，便携式计算机，共享桌面和服务器都可以。 你可以配置多个管理节点。唯一需要注意的是，**管理节点不支持 Windows 系统。**

**[受管节点](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/basic_concepts.html#id5)**

Ansbile 管理的服务器或者网络设备都称为受控节点。 受控节点有时候也叫做 “hosts” ( 主机 ). 受控节点不需要安装 Ansible.

**[Inventory](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/basic_concepts.html#id6)**

Inventory是保存受控节点的信息列表，类似于系统的 hosts 文件。Inventory 可以用 IP 的方式指定受控节点。 

**[Modules 模块](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/basic_concepts.html#id7)**

Modules 模块是 Ansible 执行代码的最小单元。 每个模块都是特殊用途，从特殊类型的数据库用户管理，到特殊类型的网络设备  VLAN 接口管理。  你可以通过一个任务调用单个模块，也可以在一个剧本中调用多个不同的模块。

**[Tasks 任务](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/basic_concepts.html#id8)**

Ansible 执行操作的最小单位。 ad-hoc 更适合临时执行命令的执行场景。

**[Playbooks 任务剧本](https://cn-ansibledoc.readthedocs.io/zh_CN/latest/user_guide/basic_concepts.html#id9)**

**playbook是一个任务task的列表**，可以按照顺序重复运行，playbook可以同时包含变量和任务。

playbook通常使用yaml文件来编写。

---



## ansible初体验

### 创建一个Inventory

编辑`/etc/ansible/hosts`文件或者自己创建一个`Inventory`文件。可以通过**IP或者域名**来添加受管理的主机，如：

```sh
[test]
192.0.2.50
aserver.example.org
bserver.example.org
```



### 检查ssh连接

确保管理节点可以通过`ssh`协议使用同一个用户名连接到所有的节点，如果有必要，也可以将`ssh`公钥添加到`authorized_keys`文件中。

设置并测试ssh免密登录的方法：

```sh
ssh-keygen
ssh-copy-id -i ~/.ssh/id_rsa.pub root@192.168.52.137
ssh root@192.168.52.137
```

可以通过以下几种方式来**覆盖默认的用户名**：

- 在命令行中通过`-u`选项来指定
- 在`Inventory`文件中设置用户信息
- 在`ansible`配置文件中设置用户信息
- 设置环境变量

点击此处查看上面几种方式的优先级规则： [Controlling how Ansible behaves: precedence rules](https://docs.ansible.com/ansible/latest/reference_appendices/general_precedence.html#general-precedence-rules) 

连接上受管节点后，就可以通过命令行或者playbook将模块传到远程机器来运行了。



### 运行ansible命令

使用ping模块，用ping测试连接 `Inventory`文件中的所有节点：

```sh
ansible all -m ping
```

在所有节点上运行命令：

```sh
ansible all -a "/bin/echo hello"
```

如果需要**提升权限**来执行权限，可以使用 `become`选项：

```sh
## as bruce
$ ansible all -m ping -u bruce
## as bruce, sudoing to root (sudo is default method)
$ ansible all -m ping -u bruce --become
## as bruce, sudoing to batman
$ ansible all -m ping -u bruce --become --become-user batman
```

点击此处查看更多扩大权限的方法：[Understanding privilege escalation: become](https://docs.ansible.com/ansible/latest/user_guide/become.html#become).

ansible默认使用`sftp`来传输文件，如果你的机器不支持`sftp`，可以配置切换到`scp`模式。配置方法：[Configuring Ansible](https://docs.ansible.com/ansible/latest/installation_guide/intro_configuration.html#intro-configuration)

## ad-hoc命令

### ad-hoc命令介绍

`ad-hoc`的理解：**临时的，简单的，可实现目的的**任意一种简单方式。

`ad-hoc`对不需要重复运行的任务的很有帮助，比如，想要关闭所有的机器，可以执行一个简单的命令即可，而不需要写一个playbook。

`ad-hoc`命令的格式如下：

```sh
$ ansible [pattern] -m [module] -a "[module options]"
```

点击此处查看 [patterns](https://docs.ansible.com/ansible/latest/user_guide/intro_patterns.html#intro-patterns) 和 [modules](https://docs.ansible.com/ansible/latest/user_guide/modules.html#working-with-modules)。

`an-hoc`命令可以使用`ansible`的任意模块来执行任务。

`ad-hoc`命令和`playbook`一样，使用声明式模型，计算并执行达到指定最终状态所需的操作。它们通过在开始前**检查当前状态来实现一种幂等形式**，除非当前状态与指定的最终状态不同，否则什么也不做。

### 例子：重启一个组的机器

`ansible`命令行工具的默认模块是： [ansible.builtin.command module](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/command_module.html#command-module)。可以使用`ad-hoc`命令来`command`命令模块来重启机器，不需要使用`-m`来指定使用的模块。

配置`Inventory`文件：

```sh
[test]
192.168.51.137
192.168.51.138
192.168.51.139
```

执行ad-hoc命令：

```sh
$ ansible test -a "/sbin/reboot"
```

默认情况下，ansible只会使用5个并发线程来执行任务，如果你有更多的机器，可能会花费一点时间。

可以通过`-f`选项来设定并发个数，如使用10个并发数来重启机器：

```sh
$ ansible test -a "/sbin/reboot" -f 10
```

`ansible`默认会用当前用户来执行任务，可以`-u`选项来使用其它用户连接受管机器：

```sh
$ ansible test -a "/sbin/reboot" -f 10 -u jinguang
```

使用sudo提升用户权限：

```sh
$ ansible test -a "/sbin/reboot" -f 10 -u username --become [--ask-become-pass]
```

如果使用`--ask-become-pass`选项，ansible会提示您输入用于权限提升的密码（sudo/su/pfexec/doas/etc）



上面的例子，没有使用`-m`来指定模块，而是使用默认的`command`模块。

我们可以使用-`m`选项来指定使用的模块：

```sh
$ ansible raleigh -m ansible.builtin.shell -a 'echo $TERM'
#可以去掉ansible.builtin前缀
```

### 例子：管理文件

`ad-hoc`命令可以利用`ansible`和`scp`的功能来**将文件并行传输到多个机器**。

例如，传输文件到一个主机组中的所有机器：

```sh
$ ansible test -m ansible.builtin.copy -a "src=/etc/hosts dest=/temp/hosts"
#可以去掉sible.builtin前缀
```

 [ansible.builtin.file](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/file_module.html#file-module) 模块可以设置传输的文件的所有者和权限：

```sh
$ ansible webservers -m ansible.builtin.file -a "dest=/srv/foo/a.txt mode=600"
$ ansible webservers -m ansible.builtin.file -a "dest=/srv/foo/b.txt mode=600 owner=mdehaan group=mdehaan"
```

`copy`模块也可以使用上面的选项来设置所有者和权限：

```sh
$ ansible test -m copy -a "src=/home/test1/hello.txt dest=/home/test2 owner=root"
```

`file`模块可以创建目录，等同于命令`mkdir -p`：

```sh
$ ansible test -m file -a "dest=/home/a owner=root group=root state=directory"
```

file模块也可以递归删除目录和文件：

```sh
$ ansible test -m file -a "dest=/home/a state=absent"
```

### 例子：管理package

可以使用`ansible.builtin.yum`模块来安装package：

```sh
$ ansible test -m yum -a "name=lrzsz state=present"
```

安装指定版本：

```sh
$ ansible test -m yum -a "name=acme-1.5 state=present"
```

安装最新版本：

```sh
$ ansible test -m yum -a "name=lrzsz state=latest"
```

确保一个package没有被下载安装：

```sh
$ ansible test -m yum -a "name=lrzsz state=absent"
```

### 例子：管理用户和组

`ad-hoc`命令可以使用`ansible.builtin.user`模块来创建、删除受管节点的用户。

创建用户：

```sh
ansible test -m user -a "name=user01 password=123456"
```

删除用户：

```sh
ansible test -m user -a "name=user01 state=absent"
```

点击此处查看更多相关操作： [ansible.builtin.user](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/user_module.html#user-module)

### 例子：管理服务

`ansible.builtin.service`模块可以管理节点的服务。

确保所有节点的服务都启动了：

```sh
$ ansible webservers -m service -a "name=httpd state=started"
```

重启服务：

```sh
$ ansible webservers -m ansible.builtin.service -a "name=httpd state=restarted"
```

### 例子：收集Facts

`Facts`代表着在一个机器的系统中发现的变量，是Ansible用于采集被管理机器设备信息的一个功能，采集的机器设备信息主要包含IP地址，操作系统，以太网设备，mac 地址，时间/日期相关数据，硬件信息等。

可以使用`Facts`来实现任务的有条件执行。

使用`setup`模块查看所有`Facts`：

```sh
$ ansible all -m setup
```

点击此处查看`setup`更多内容： [ansible.builtin.setup](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/setup_module.html#setup-module)

使用`filter`参数来查看指定的信息：

```sh
nsible all -m setup -a "filter=ansible_all_ipv4_addresses"
```

![image-20210102031733477](ansible.assets/image-20210102031733477.png)

## 使用playbook

Playbooks记录并执行Ansible的配置、部署和编排功能。它可以描述您希望远程系统强制执行的策略，也可以描述一般IT流程中的一组步骤。如果Ansible模块是您的车间中的工具，那么剧本就是您的说明手册，主机的清单就是您的原材料。

### Templating (Jinja2)

`Ansible`使用`Jinja2`模板来启动动态表达式和对变量的访问。

`Ansible`包括许多专门的过滤器和模板测试，也可以使用`Jinja2`中包含的所有标准过滤器和测试。

`Ansible`还提供了一种新的插件类型： [Lookup插件](https://docs.ansible.com/ansible/latest/plugins/lookup.html#lookup-plugins)。

在任务被发送到目标机器上或者执行之前，**所有模板都发生在Ansible控制器上**。这种方法使目标上的包需求最小化（`jinja2`只在控制器上需要），也限制了`Ansible`传递到目标机器的数据量。

`Ansible`在控制器上解析模板，然后只会传送必要的信息到目标机器上去执行任务，而不是传递所有在控制器上的数据。

#### 获取当前时间

`Jinja2`使用now()函数获取当前时间。

now()函数有2个参数：

- `utc`：表示使用UTC的当前时间，默认为Fase。True/False。
- `fmt`：接受返回格式化日期时间字符串的strftime字符串。、

#### 使用过滤器处理数据

过滤器的功能：

- 将Json数据转为Yaml数据
- 拆分URL获取主机名
- 获取字符串的SHA1散列值
- 进行整数的加法和乘法
- ......等等

可以使用Ansible的过滤器来处理数据，也可以使用Jinja2附带的过滤器来处理数据。

##### 处理未定义的变量

过滤器可以为未定义的变量提供默认值或者使变量变成可选的。

如果Ansible配置了忽略大多数的未定义的变量，可以使用mandatory强制过滤器来标记这些变量。

**使用default提供默认值：**

```jinja2
{{ some_variable | default(6) }}
```

提供了默认值后，Ansible就不会抛出 “undefined variable” 错误了。	如果使用role，可以添加defaults/main.yml文件来为role定义变量的默认值。

当变量可能为false或者空字符串时，需要将第二个参数设为true：

```jinja2
{{ lookup('env', 'MY_USER') | default('admin', true) }}
```

**将变量值变为可选的：**

```sh
- name: Touch files with an optional mode
  ansible.builtin.file:
    dest: "{{ item.path }}"
    state: touch
    mode: "{{ item.mode | default(omit) }}"
  loop:
    - path: /tmp/foo
    - path: /tmp/bar
    - path: /tmp/baz
      mode: "0444"
```

`loop`关键字是用来创建循环的，循环`touch`创建三个文件，`/tmp/foo`和`/tmp/bar`文件的`mode`都是使用系统的默认值，只有`/tmp/baz`文件使用 `0444 mode`。

为了让`mode`变量的值变成可选的，将`mode`的默认值设置成了特殊变量`omit`。

**定义将强制值：**

可以配置Ansible中 [DEFAULT_UNDEFINED_VAR_BEHAVIOR](https://docs.ansible.com/ansible/latest/reference_appendices/config.html#default-undefined-var-behavior) 的值为 `false`来允许未定义的变量的存在。

如果配置了允许变量未定义，那么也可以通过`mandatory`过滤器来强制某些变量一定不能未定义：

```jinja2
{{ variable | mandatory }}
```

##### 定义不同的值（ternary三元）

为true、false不同的返回值定义不同的值：

```jinja2
{{ (status == 'needs_restart') | ternary('restart', 'continue') }}
```

为true、false、null不同的返回值定义不同的值：

```jinja2
{{ enabled | ternary('no shutdown', 'shutdown', omit) }}
```

##### 管理数据类型

可以使用type_debug、dict2items和item2dict过滤器来管理数据类型。

1、**显示数据类型（有助于调试）：**

```jinja2
{{ myvar | type_debug }}
```

2、**字典转为列表：**

```jinja2
{{ dict | dict2items }}
```

字典转为列表之前：

```yaml
tags:
  Application: payment
  Environment: dev
```

转为列表之后：

```yaml
- key: Application
  value: payment
- key: Environment 
  value: dev
```

也可以传递key_name和value_name来指定key和value的名称：

```jinja2
{{ files | dict2items(key_name='file', value_name='path') }}
```

字典转为列表之前：

```yaml
files:
  users: /etc/passwd
  groups: /etc/group
```

转为列表之后：

```yaml
- file: users
  path: /etc/passwd
- file: groups
  path: /etc/group
```

**3、列表转为字典：**

```jinja2
{{ tags | item2dict }}
```

列表转为字典之前：

```yaml
tags:
  - key: Application
    value: payment
  - key: Environment
    value: dev
```

转为字典之后：

```yaml
Application: payment
Environment: dev
```

注意，并不是所有的列表都是使用`key`来指定`keys`，或者使用`value`来指定`values`，如：

```yaml
fruits:
  - fruit: apple
    color: red
  - fruit: pear
    color: yellow
  - fruit: grapefruit
    color: yellow
```

**4、强制转为指定数据类型：**

```yaml
- debug:
  msg: test
  when: some_string_value | bool
```

##### 格式化yaml和json数据

可以通过过滤器将`Jinja2`模板中的数据结构转为`YAML`或者`JSON`格式：

```jinja2
{{ some_variable | to_json }}
{{ some_variable | to_yaml }}
```

可读性更强的：

```jinja2
{{ some_variable | to_nice_json }}
{{ some_variable | to_nice_yaml }}
```

指定缩进：

```jinja2
{{ some_variable | to_nice_json(indent=2) }}
{{ some_variable | to_nice_yaml(indent=8) }}
```

 `to_yaml`和 `to_nice_yaml` 过滤器使用了 [PyYAML library](https://pyyaml.org/)，这个库支持的字符串长度只有80，如果超过80，会出现一些问题。为了避免这个问题，可以使用`width`选项来定义宽度：

```jinja2
{{ some_variable | to_yaml(indent=8, width=1337) }}
{{ some_variable | to_nice_yaml(indent=8, width=1337) }}
```

如果读取的是已经格式化过的数据，可以使用以下过滤器来读取：

```jinja2
{{ some_variable | from_json }}
{{ some_variable | from_yaml }}
```

举个例子：

```yaml
tasks:
  - name: Register JSON output as a variable
    ansible.builtin.shell: cat /some/path/to/file.json
    register: result

  - name: Set a variable
    ansible.builtin.set_fact:
      myvar: "{{ result.stdout | from_json }}"
```

注意，默认情况下，`to_json`和`to_nice_json`会将接收到的数据转为`ascii`格式，如：

```jinja2
{{ 'München'| to_json }} 

'M\u00fcnchen'
```

为了保留`Unicode`字符，可以传递`ensure_ascii=False`参数给过滤器：

```jinja2
{{ 'München'| to_json(ensure_ascii=False) }}

'München'
```

##### 合并和选择数据

使用zip过滤器合并两个列表：

You can  combine data from multiple sources and types, and select values from  large data structures, giving you precise control over complex data. 



#### [Combining items from multiple lists: zip and zip_longest](https://docs.ansible.com/ansible/latest/user_guide/playbooks_filters.html#id15)

New in version 2.3.

To get a list combining the elements of other lists use `zip`:

```
- name: Give me list combo of two lists
  ansible.builtin.debug:
   msg: "{{ [1,2,3,4,5] | zip(['a','b','c','d','e','f']) | list }}"

- name: Give me shortest combo of two lists
  ansible.builtin.debug:
    msg: "{{ [1,2,3] | zip(['a','b','c','d','e','f']) | list }}"
```

To always exhaust all lists use `zip_longest`:

```
- name: Give me longest combo of three lists , fill with X
  ansible.builtin.debug:
    msg: "{{ [1,2,3] | zip_longest(['a','b','c','d','e','f'], [21, 22, 23], fillvalue='X') | list }}"
```

Similarly to the output of the `items2dict` filter mentioned above, these filters can be used to construct a `dict`:

```
{{ dict(keys_list | zip(values_list)) }}
```

List data (before applying the `zip` filter):

```
keys_list:
  - one
  - two
values_list:
  - apple
  - orange
```

Dictonary data (after applying the `zip` filter):

```
one: apple
two: orange
```

#### [Combining objects and subelements](https://docs.ansible.com/ansible/latest/user_guide/playbooks_filters.html#id16)

New in version 2.7.

The `subelements` filter produces a product of an object and the subelement values of that object, similar to the `subelements` lookup. This lets you specify individual subelements to use in a template. For example, this expression:

```
{{ users | subelements('groups', skip_missing=True) }}
```

Data before applying the `subelements` filter:

```
users:
- name: alice
  authorized:
  - /tmp/alice/onekey.pub
  - /tmp/alice/twokey.pub
  groups:
  - wheel
  - docker
- name: bob
  authorized:
  - /tmp/bob/id_rsa.pub
  groups:
  - docker
```

Data after applying the `subelements` filter:

```
-
  - name: alice
    groups:
    - wheel
    - docker
    authorized:
    - /tmp/alice/onekey.pub
    - /tmp/alice/twokey.pub
  - wheel
-
  - name: alice
    groups:
    - wheel
    - docker
    authorized:
    - /tmp/alice/onekey.pub
    - /tmp/alice/twokey.pub
  - docker
-
  - name: bob
    authorized:
    - /tmp/bob/id_rsa.pub
    groups:
    - docker
  - docker
```

You can use the transformed data with `loop` to iterate over the same subelement for multiple objects:

```
- name: Set authorized ssh key, extracting just that data from 'users'
  ansible.posix.authorized_key:
    user: "{{ item.0.name }}"
    key: "{{ lookup('file', item.1) }}"
  loop: "{{ users | subelements('authorized') }}"
```



#### [Combining hashes/dictionaries](https://docs.ansible.com/ansible/latest/user_guide/playbooks_filters.html#id17)

New in version 2.0.

The `combine` filter allows hashes to be merged. For example, the following would override keys in one hash:

```
{{ {'a':1, 'b':2} | combine({'b':3}) }}
```

The resulting hash would be:

```
{'a':1, 'b':3}
```

The filter can also take multiple arguments to merge:

```
{{ a | combine(b, c, d) }}
{{ [a, b, c, d] | combine }}
```

In this case, keys in `d` would override those in `c`, which would override those in `b`, and so on.

The filter also accepts two optional parameters: `recursive` and `list_merge`.

- recursive

  Is a boolean, default to `False`. Should the `combine` recursively merge nested hashes. Note: It does **not** depend on the value of the `hash_behaviour` setting in `ansible.cfg`.

- list_merge

  Is a string, its possible values are `replace` (default), `keep`, `append`, `prepend`, `append_rp` or `prepend_rp`. It modifies the behaviour of `combine` when the hashes to merge contain arrays/lists.

```
default:
  a:
    x: default
    y: default
  b: default
  c: default
patch:
  a:
    y: patch
    z: patch
  b: patch
```

If `recursive=False` (the default), nested hash aren’t merged:

```
{{ default | combine(patch) }}
```

This would result in:

```
a:
  y: patch
  z: patch
b: patch
c: default
```

If `recursive=True`, recurse into nested hash and merge their keys:

```
{{ default | combine(patch, recursive=True) }}
```

This would result in:

```
a:
  x: default
  y: patch
  z: patch
b: patch
c: default
```

If `list_merge='replace'` (the default), arrays from the right hash will “replace” the ones in the left hash:

```
default:
  a:
    - default
patch:
  a:
    - patch
{{ default | combine(patch) }}
```

This would result in:

```
a:
  - patch
```

If `list_merge='keep'`, arrays from the left hash will be kept:

```
{{ default | combine(patch, list_merge='keep') }}
```

This would result in:

```
a:
  - default
```

If `list_merge='append'`, arrays from the right hash will be appended to the ones in the left hash:

```
{{ default | combine(patch, list_merge='append') }}
```

This would result in:

```
a:
  - default
  - patch
```

If `list_merge='prepend'`, arrays from the right hash will be prepended to the ones in the left hash:

```
{{ default | combine(patch, list_merge='prepend') }}
```

This would result in:

```
a:
  - patch
  - default
```

If `list_merge='append_rp'`, arrays from the right hash will be appended to the ones in the left  hash. Elements of arrays in the left hash that are also in the  corresponding array of the right hash will be removed (“rp” stands for  “remove present”). Duplicate elements that aren’t in both hashes are  kept:

```
default:
  a:
    - 1
    - 1
    - 2
    - 3
patch:
  a:
    - 3
    - 4
    - 5
    - 5
{{ default | combine(patch, list_merge='append_rp') }}
```

This would result in:

```
a:
  - 1
  - 1
  - 2
  - 3
  - 4
  - 5
  - 5
```

If `list_merge='prepend_rp'`, the behavior is similar to the one for `append_rp`, but elements of arrays in the right hash are prepended:

```
{{ default | combine(patch, list_merge='prepend_rp') }}
```

This would result in:

```
a:
  - 3
  - 4
  - 5
  - 5
  - 1
  - 1
  - 2
```

`recursive` and `list_merge` can be used together:

```
default:
  a:
    a':
      x: default_value
      y: default_value
      list:
        - default_value
  b:
    - 1
    - 1
    - 2
    - 3
patch:
  a:
    a':
      y: patch_value
      z: patch_value
      list:
        - patch_value
  b:
    - 3
    - 4
    - 4
    - key: value
{{ default | combine(patch, recursive=True, list_merge='append_rp') }}
```

This would result in:

```
a:
  a':
    x: default_value
    y: patch_value
    z: patch_value
    list:
      - default_value
      - patch_value
b:
  - 1
  - 1
  - 2
  - 3
  - 4
  - 4
  - key: value
```



#### [Selecting values from arrays or hashtables](https://docs.ansible.com/ansible/latest/user_guide/playbooks_filters.html#id18)

New in version 2.1.

The extract filter is used to map from a list of indices to a list of values from a container (hash or array):

```
{{ [0,2] | map('extract', ['x','y','z']) | list }}
{{ ['x','y'] | map('extract', {'x': 42, 'y': 31}) | list }}
```

The results of the above expressions would be:

```
['x', 'z']
[42, 31]
```

The filter can take another argument:

```
{{ groups['x'] | map('extract', hostvars, 'ec2_ip_address') | list }}
```

This takes the list of hosts in group ‘x’, looks them up in hostvars, and then looks up the ec2_ip_address of the result. The final result is a list of IP addresses for the hosts in group ‘x’.

The third argument to the filter can also be a list, for a recursive lookup inside the container:

```
{{ ['a'] | map('extract', b, ['x','y']) | list }}
```

This would return a list containing the value of b[‘a’][‘x’][‘y’].

#### [Combining lists](https://docs.ansible.com/ansible/latest/user_guide/playbooks_filters.html#id19)

This set of filters returns a list of combined lists.

##### [permutations](https://docs.ansible.com/ansible/latest/user_guide/playbooks_filters.html#id20)

To get permutations of a list:

```
- name: Give me largest permutations (order matters)
  ansible.builtin.debug:
    msg: "{{ [1,2,3,4,5] | permutations | list }}"

- name: Give me permutations of sets of three
  ansible.builtin.debug:
    msg: "{{ [1,2,3,4,5] | permutations(3) | list }}"
```

##### [combinations](https://docs.ansible.com/ansible/latest/user_guide/playbooks_filters.html#id21)

Combinations always require a set size:

```
- name: Give me combinations for sets of two
  ansible.builtin.debug:
    msg: "{{ [1,2,3,4,5] | combinations(2) | list }}"
```

Also see the [Combining items from multiple lists: zip and zip_longest](https://docs.ansible.com/ansible/latest/user_guide/playbooks_filters.html#zip-filter)

##### [products](https://docs.ansible.com/ansible/latest/user_guide/playbooks_filters.html#id22)

The product filter returns the [cartesian product](https://docs.python.org/3/library/itertools.html#itertools.product) of the input iterables. This is roughly equivalent to nested for-loops in a generator expression.

For example:

```
- name: Generate multiple hostnames
  ansible.builtin.debug:
    msg: "{{ ['foo', 'bar'] | product(['com']) | map('join', '.') | join(',') }}"
```

This would result in:

```
{ "msg": "foo.com,bar.com" }
```

#### [Selecting JSON data: JSON queries](https://docs.ansible.com/ansible/latest/user_guide/playbooks_filters.html#id23)

To select a single element or a data subset from a complex data structure in JSON format (for example, Ansible facts), use the `json_query` filter.  The `json_query` filter lets you query a complex JSON structure and iterate over it using a loop structure.

Note

This filter has migrated to the [community.general](https://galaxy.ansible.com/community/general) collection. Follow the installation instructions to install that collection.

Note

This filter is built upon **jmespath**, and you can use the same syntax. For examples, see [jmespath examples](http://jmespath.org/examples.html).

Consider this data structure:

```
{
    "domain_definition": {
        "domain": {
            "cluster": [
                {
                    "name": "cluster1"
                },
                {
                    "name": "cluster2"
                }
            ],
            "server": [
                {
                    "name": "server11",
                    "cluster": "cluster1",
                    "port": "8080"
                },
                {
                    "name": "server12",
                    "cluster": "cluster1",
                    "port": "8090"
                },
                {
                    "name": "server21",
                    "cluster": "cluster2",
                    "port": "9080"
                },
                {
                    "name": "server22",
                    "cluster": "cluster2",
                    "port": "9090"
                }
            ],
            "library": [
                {
                    "name": "lib1",
                    "target": "cluster1"
                },
                {
                    "name": "lib2",
                    "target": "cluster2"
                }
            ]
        }
    }
}
```

To extract all clusters from this structure, you can use the following query:

```
- name: Display all cluster names
  ansible.builtin.debug:
    var: item
  loop: "{{ domain_definition | community.general.json_query('domain.cluster[*].name') }}"
```

To extract all server names:

```
- name: Display all server names
  ansible.builtin.debug:
    var: item
  loop: "{{ domain_definition | community.general.json_query('domain.server[*].name') }}"
```

To extract ports from cluster1:

```
- ansible.builtin.name: Display all ports from cluster1
  debug:
    var: item
  loop: "{{ domain_definition | community.general.json_query(server_name_cluster1_query) }}"
  vars:
    server_name_cluster1_query: "domain.server[?cluster=='cluster1'].port"
```

Note

You can use a variable to make the query more readable.

To print out the ports from cluster1 in a comma separated string:

```
- name: Display all ports from cluster1 as a string
  ansible.builtin.debug:
    msg: "{{ domain_definition | community.general.json_query('domain.server[?cluster==`cluster1`].port') | join(', ') }}"
```

Note

In the example above, quoting literals using backticks avoids escaping quotes and maintains readability.

You can use YAML [single quote escaping](https://yaml.org/spec/current.html#id2534365):

```
- name: Display all ports from cluster1
  ansible.builtin.debug:
    var: item
  loop: "{{ domain_definition | community.general.json_query('domain.server[?cluster==''cluster1''].port') }}"
```

Note

Escaping single quotes within single quotes in YAML is done by doubling the single quote.

To get a hash map with all ports and names of a cluster:

```
- name: Display all server ports and names from cluster1
  ansible.builtin.debug:
    var: item
  loop: "{{ domain_definition | community.general.json_query(server_name_cluster1_query) }}"
  vars:
    server_name_cluster1_query: "domain.server[?cluster=='cluster2'].{name: name, port: port}"
```

### [Randomizing data](https://docs.ansible.com/ansible/latest/user_guide/playbooks_filters.html#id24)

When you need a randomly generated value, use one of these filters.



#### [Random MAC addresses](https://docs.ansible.com/ansible/latest/user_guide/playbooks_filters.html#id25)

New in version 2.6.

This filter can be used to generate a random MAC address from a string prefix.

Note

This filter has migrated to the [community.general](https://galaxy.ansible.com/community/general) collection. Follow the installation instructions to install that collection.

To get a random MAC address from a string prefix starting with ‘52:54:00’:

```
"{{ '52:54:00' | community.general.random_mac }}"
## => '52:54:00:ef:1c:03'
```

Note that if anything is wrong with the prefix string, the filter will issue an error.

> New in version 2.9.

As of Ansible version 2.9, you can also initialize the random number  generator from a seed to create random-but-idempotent MAC addresses:

```
"{{ '52:54:00' | community.general.random_mac(seed=inventory_hostname) }}"
```



#### [Random items or numbers](https://docs.ansible.com/ansible/latest/user_guide/playbooks_filters.html#id26)

The `random` filter in Ansible is an extension of the default Jinja2 random filter,  and can be used to return a random item from a sequence of items or to  generate a random number based on a range.

To get a random item from a list:

```
"{{ ['a','b','c'] | random }}"
## => 'c'
```

To get a random number between 0 and a specified number:

```
"{{ 60 | random }} * * * * root /script/from/cron"
## => '21 * * * * root /script/from/cron'
```

To get a random number from 0 to 100 but in steps of 10:

```
{{ 101 | random(step=10) }}
## => 70
```

To get a random number from 1 to 100 but in steps of 10:

```
{{ 101 | random(1, 10) }}
## => 31
{{ 101 | random(start=1, step=10) }}
## => 51
```

You can initialize the random number generator from a seed to create random-but-idempotent numbers:

```
"{{ 60 | random(seed=inventory_hostname) }} * * * * root /script/from/cron"
```

#### [Shuffling a list](https://docs.ansible.com/ansible/latest/user_guide/playbooks_filters.html#id27)

The `shuffle` filter randomizes an existing list, giving a different order every invocation.

To get a random list from an existing  list:

```
{{ ['a','b','c'] | shuffle }}
## => ['c','a','b']
{{ ['a','b','c'] | shuffle }}
## => ['b','c','a']
```

You can initialize the shuffle generator from a seed to generate a random-but-idempotent order:

```
{{ ['a','b','c'] | shuffle(seed=inventory_hostname) }}
## => ['b','a','c']
```

The shuffle filter returns a list whenever possible. If you use it with a non ‘listable’ item, the filter does nothing.



### [Managing list variables](https://docs.ansible.com/ansible/latest/user_guide/playbooks_filters.html#id28)

You can search for the minimum or maximum value in a list, or flatten a multi-level list.

To get the minimum value from list of numbers:

```
{{ list1 | min }}
```

To get the maximum value from a list of numbers:

```
{{ [3, 4, 2] | max }}
```

New in version 2.5.

Flatten a list (same thing the flatten lookup does):

```
{{ [3, [4, 2] ] | flatten }}
```

Flatten only the first level of a list (akin to the items lookup):

```
{{ [3, [4, [2]] ] | flatten(levels=1) }}
```



### [Selecting from sets or lists (set theory)](https://docs.ansible.com/ansible/latest/user_guide/playbooks_filters.html#id29)

You can select or combine items from sets or lists.

New in version 1.4.

To get a unique set from a list:

```
## list1: [1, 2, 5, 1, 3, 4, 10]
{{ list1 | unique }}
## => [1, 2, 5, 3, 4, 10]
```

To get a union of two lists:

```
## list1: [1, 2, 5, 1, 3, 4, 10]
## list2: [1, 2, 3, 4, 5, 11, 99]
{{ list1 | union(list2) }}
## => [1, 2, 5, 1, 3, 4, 10, 11, 99]
```

To get the intersection of 2 lists (unique list of all items in both):

```
## list1: [1, 2, 5, 3, 4, 10]
## list2: [1, 2, 3, 4, 5, 11, 99]
{{ list1 | intersect(list2) }}
## => [1, 2, 5, 3, 4]
```

To get the difference of 2 lists (items in 1 that don’t exist in 2):

```
## list1: [1, 2, 5, 1, 3, 4, 10]
## list2: [1, 2, 3, 4, 5, 11, 99]
{{ list1 | difference(list2) }}
## => [10]
```

To get the symmetric difference of 2 lists (items exclusive to each list):

```
## list1: [1, 2, 5, 1, 3, 4, 10]
## list2: [1, 2, 3, 4, 5, 11, 99]
{{ list1 | symmetric_difference(list2) }}
## => [10, 11, 99]
```



### [Calculating numbers (math)](https://docs.ansible.com/ansible/latest/user_guide/playbooks_filters.html#id30)

New in version 1.9.

You can calculate logs, powers, and roots of numbers with Ansible  filters. Jinja2 provides other mathematical functions like abs() and  round().

Get the logarithm (default is e):

```
{{ myvar | log }}
```

Get the base 10 logarithm:

```
{{ myvar | log(10) }}
```

Give me the power of 2! (or 5):

```
{{ myvar | pow(2) }}
{{ myvar | pow(5) }}
```

Square root, or the 5th:

```
{{ myvar | root }}
{{ myvar | root(5) }}
```

### [Managing network interactions](https://docs.ansible.com/ansible/latest/user_guide/playbooks_filters.html#id31)

These filters help you with common network tasks.

Note

These filters have migrated to the [ansible.netcommon](https://galaxy.ansible.com/ansible/netcommon) collection. Follow the installation instructions to install that collection.



#### [IP address filters](https://docs.ansible.com/ansible/latest/user_guide/playbooks_filters.html#id32)

New in version 1.9.

To test if a string is a valid IP address:

```
{{ myvar | ansible.netcommon.ipaddr }}
```

You can also require a specific IP protocol version:

```
{{ myvar | ansible.netcommon.ipv4 }}
{{ myvar | ansible.netcommon.ipv6 }}
```

IP address filter can also be used to extract specific information from an IP address. For example, to get the IP address itself from a CIDR, you can use:

```
{{ '192.0.2.1/24' | ansible.netcommon.ipaddr('address') }}
```

More information about `ipaddr` filter and complete usage guide can be found in [ipaddr filter](https://docs.ansible.com/ansible/latest/user_guide/playbooks_filters_ipaddr.html#playbooks-filters-ipaddr).



#### [Network CLI filters](https://docs.ansible.com/ansible/latest/user_guide/playbooks_filters.html#id33)

New in version 2.4.

To convert the output of a network device CLI command into structured JSON output, use the `parse_cli` filter:

```
{{ output | ansible.netcommon.parse_cli('path/to/spec') }}
```

The `parse_cli` filter will load the spec file and pass the command output through it, returning JSON output. The YAML spec file defines how to parse the CLI output.

The spec file should be valid formatted YAML.  It defines how to parse the CLI output and return JSON data.  Below is an example of a valid spec file that will parse the output from the `show vlan` command.

```
---
vars:
  vlan:
    vlan_id: "{{ item.vlan_id }}"
    name: "{{ item.name }}"
    enabled: "{{ item.state != 'act/lshut' }}"
    state: "{{ item.state }}"

keys:
  vlans:
    value: "{{ vlan }}"
    items: "^(?P<vlan_id>\\d+)\\s+(?P<name>\\w+)\\s+(?P<state>active|act/lshut|suspended)"
  state_static:
    value: present
```

The spec file above will return a JSON data structure that is a list of hashes with the parsed VLAN information.

The same command could be parsed into a hash by using the key and values directives.  Here is an example of how to parse the output into a hash value using the same `show vlan` command.

```
---
vars:
  vlan:
    key: "{{ item.vlan_id }}"
    values:
      vlan_id: "{{ item.vlan_id }}"
      name: "{{ item.name }}"
      enabled: "{{ item.state != 'act/lshut' }}"
      state: "{{ item.state }}"

keys:
  vlans:
    value: "{{ vlan }}"
    items: "^(?P<vlan_id>\\d+)\\s+(?P<name>\\w+)\\s+(?P<state>active|act/lshut|suspended)"
  state_static:
    value: present
```

Another common use case for parsing CLI commands is to break a large command into blocks that can be parsed.  This can be done using the `start_block` and `end_block` directives to break the command into blocks that can be parsed.

```
---
vars:
  interface:
    name: "{{ item[0].match[0] }}"
    state: "{{ item[1].state }}"
    mode: "{{ item[2].match[0] }}"

keys:
  interfaces:
    value: "{{ interface }}"
    start_block: "^Ethernet.*$"
    end_block: "^$"
    items:
      - "^(?P<name>Ethernet\\d\\/\\d*)"
      - "admin state is (?P<state>.+),"
      - "Port mode is (.+)"
```

The example above will parse the output of `show interface` into a list of hashes.

The network filters also support parsing the output of a CLI command using the TextFSM library.  To parse the CLI output with TextFSM use the following filter:

```
{{ output.stdout[0] | ansible.netcommon.parse_cli_textfsm('path/to/fsm') }}
```

Use of the TextFSM filter requires the TextFSM library to be installed.

#### [Network XML filters](https://docs.ansible.com/ansible/latest/user_guide/playbooks_filters.html#id34)

New in version 2.5.

To convert the XML output of a network device command into structured JSON output, use the `parse_xml` filter:

```
{{ output | ansible.netcommon.parse_xml('path/to/spec') }}
```

The `parse_xml` filter will load the spec file and pass the command output through formatted as JSON.

The spec file should be valid formatted YAML. It defines how to parse the XML output and return JSON data.

Below is an example of a valid spec file that will parse the output from the `show vlan | display xml` command.

```
---
vars:
  vlan:
    vlan_id: "{{ item.vlan_id }}"
    name: "{{ item.name }}"
    desc: "{{ item.desc }}"
    enabled: "{{ item.state.get('inactive') != 'inactive' }}"
    state: "{% if item.state.get('inactive') == 'inactive'%} inactive {% else %} active {% endif %}"

keys:
  vlans:
    value: "{{ vlan }}"
    top: configuration/vlans/vlan
    items:
      vlan_id: vlan-id
      name: name
      desc: description
      state: ".[@inactive='inactive']"
```

The spec file above will return a JSON data structure that is a list of hashes with the parsed VLAN information.

The same command could be parsed into a hash by using the key and values directives.  Here is an example of how to parse the output into a hash value using the same `show vlan | display xml` command.

```
---
vars:
  vlan:
    key: "{{ item.vlan_id }}"
    values:
        vlan_id: "{{ item.vlan_id }}"
        name: "{{ item.name }}"
        desc: "{{ item.desc }}"
        enabled: "{{ item.state.get('inactive') != 'inactive' }}"
        state: "{% if item.state.get('inactive') == 'inactive'%} inactive {% else %} active {% endif %}"

keys:
  vlans:
    value: "{{ vlan }}"
    top: configuration/vlans/vlan
    items:
      vlan_id: vlan-id
      name: name
      desc: description
      state: ".[@inactive='inactive']"
```

The value of `top` is the XPath relative to the XML root node. In the example XML output given below, the value of `top` is `configuration/vlans/vlan`, which is an XPath expression relative to the root node (\<rpc-reply\>). `configuration` in the value of `top` is the outer most container node, and `vlan` is the inner-most container node.

```
items` is a dictionary of key-value pairs that map user-defined names to XPath expressions that select elements. The Xpath expression is relative to the value of the XPath value contained in `top`. For example, the `vlan_id` in the spec file is a user defined name and its value `vlan-id` is the relative to the value of XPath in `top
```

Attributes of XML tags can be extracted using XPath expressions. The value of `state` in the spec is an XPath expression used to get the attributes of the `vlan` tag in output XML.:

```
<rpc-reply>
  <configuration>
    <vlans>
      <vlan inactive="inactive">
       <name>vlan-1</name>
       <vlan-id>200</vlan-id>
       <description>This is vlan-1</description>
      </vlan>
    </vlans>
  </configuration>
</rpc-reply>
```

Note

For more information on supported XPath expressions, see [XPath Support](https://docs.python.org/2/library/xml.etree.elementtree.html#xpath-support).

#### [Network VLAN filters](https://docs.ansible.com/ansible/latest/user_guide/playbooks_filters.html#id35)

New in version 2.8.

Use the `vlan_parser` filter to transform an unsorted list of VLAN integers into a sorted string list of integers according to IOS-like VLAN list rules. This list has the following properties:

- Vlans are listed in ascending order.
- Three or more consecutive VLANs are listed with a dash.
- The first line of the list can be first_line_len characters long.
- Subsequent list lines can be other_line_len characters.

To sort a VLAN list:

```
{{ [3003, 3004, 3005, 100, 1688, 3002, 3999] | ansible.netcommon.vlan_parser }}
```

This example renders the following sorted list:

```
['100,1688,3002-3005,3999']
```

Another example Jinja template:

```
{% set parsed_vlans = vlans | ansible.netcommon.vlan_parser %}
switchport trunk allowed vlan {{ parsed_vlans[0] }}
{% for i in range (1, parsed_vlans | count) %}
switchport trunk allowed vlan add {{ parsed_vlans[i] }}
```

This allows for dynamic generation of VLAN lists on a Cisco IOS  tagged interface. You can store an exhaustive raw list of the exact  VLANs required for an interface and then compare that to the parsed IOS  output that would actually be generated for the configuration.



### [Encrypting and checksumming strings and passwords](https://docs.ansible.com/ansible/latest/user_guide/playbooks_filters.html#id36)

New in version 1.9.

To get the sha1 hash of a string:

```
{{ 'test1' | hash('sha1') }}
```

To get the md5 hash of a string:

```
{{ 'test1' | hash('md5') }}
```

Get a string checksum:

```
{{ 'test2' | checksum }}
```

Other hashes (platform dependent):

```
{{ 'test2' | hash('blowfish') }}
```

To get a sha512 password hash (random salt):

```
{{ 'passwordsaresecret' | password_hash('sha512') }}
```

To get a sha256 password hash with a specific salt:

```
{{ 'secretpassword' | password_hash('sha256', 'mysecretsalt') }}
```

An idempotent method to generate unique hashes per system is to use a salt that is consistent between runs:

```
{{ 'secretpassword' | password_hash('sha512', 65534 | random(seed=inventory_hostname) | string) }}
```

Hash types available depend on the master system running Ansible, ‘hash’ depends on hashlib, password_hash depends on passlib (https://passlib.readthedocs.io/en/stable/lib/passlib.hash.html).

New in version 2.7.

Some hash types allow providing a rounds parameter:

```
{{ 'secretpassword' | password_hash('sha256', 'mysecretsalt', rounds=10000) }}
```



### [Manipulating text](https://docs.ansible.com/ansible/latest/user_guide/playbooks_filters.html#id37)

Several filters work with text, including URLs, file names, and path names.



#### [Adding comments to files](https://docs.ansible.com/ansible/latest/user_guide/playbooks_filters.html#id38)

The `comment` filter lets you create comments in a file from text in a template, with a variety of comment styles. By default Ansible uses `#` to start a comment line and adds a blank comment line above and below your comment text. For example the following:

```
{{ "Plain style (default)" | comment }}
```

produces this output:

```
#
## Plain style (default)
#
```

Ansible offers styles for comments in C (`//...`), C block (`/*...*/`), Erlang (`%...`) and XML (``):

```
{{ "C style" | comment('c') }}
{{ "C block style" | comment('cblock') }}
{{ "Erlang style" | comment('erlang') }}
{{ "XML style" | comment('xml') }}
```

You can define a custom comment character. This filter:

```
{{ "My Special Case" | comment(decoration="! ") }}
```

produces:

```
!
! My Special Case
!
```

You can fully customize the comment style:

```
{{ "Custom style" | comment('plain', prefix='#######\n#', postfix='#\n#######\n   ###\n    #') }}
```

That creates the following output:

```
#######
#
## Custom style
#
#######
   ###
    #
```

The filter can also be applied to any Ansible variable. For example to make the output of the `ansible_managed` variable more readable, we can change the definition in the `ansible.cfg` file to this:

```
[defaults]

ansible_managed = This file is managed by Ansible.%n
  template: {file}
  date: %Y-%m-%d %H:%M:%S
  user: {uid}
  host: {host}
```

and then use the variable with the comment filter:

```
{{ ansible_managed | comment }}
```

which produces this output:

```
#
## This file is managed by Ansible.
#
## template: /home/ansible/env/dev/ansible_managed/roles/role1/templates/test.j2
## date: 2015-09-10 11:02:58
## user: ansible
## host: myhost
#
```

#### [Splitting URLs](https://docs.ansible.com/ansible/latest/user_guide/playbooks_filters.html#id39)

New in version 2.4.

The `urlsplit` filter extracts the fragment, hostname, netloc, password, path, port,  query, scheme, and username from an URL. With no arguments, returns a  dictionary of all the fields:

```
{{ "http://user:password@www.acme.com:9000/dir/index.html?query=term#fragment" | urlsplit('hostname') }}
## => 'www.acme.com'

{{ "http://user:password@www.acme.com:9000/dir/index.html?query=term#fragment" | urlsplit('netloc') }}
## => 'user:password@www.acme.com:9000'

{{ "http://user:password@www.acme.com:9000/dir/index.html?query=term#fragment" | urlsplit('username') }}
## => 'user'

{{ "http://user:password@www.acme.com:9000/dir/index.html?query=term#fragment" | urlsplit('password') }}
## => 'password'

{{ "http://user:password@www.acme.com:9000/dir/index.html?query=term#fragment" | urlsplit('path') }}
## => '/dir/index.html'

{{ "http://user:password@www.acme.com:9000/dir/index.html?query=term#fragment" | urlsplit('port') }}
## => '9000'

{{ "http://user:password@www.acme.com:9000/dir/index.html?query=term#fragment" | urlsplit('scheme') }}
## => 'http'

{{ "http://user:password@www.acme.com:9000/dir/index.html?query=term#fragment" | urlsplit('query') }}
## => 'query=term'

{{ "http://user:password@www.acme.com:9000/dir/index.html?query=term#fragment" | urlsplit('fragment') }}
## => 'fragment'

{{ "http://user:password@www.acme.com:9000/dir/index.html?query=term#fragment" | urlsplit }}
## =>
##   {
##       "fragment": "fragment",
##       "hostname": "www.acme.com",
##       "netloc": "user:password@www.acme.com:9000",
##       "password": "password",
##       "path": "/dir/index.html",
##       "port": 9000,
##       "query": "query=term",
##       "scheme": "http",
##       "username": "user"
##   }
```

#### [Searching strings with regular expressions](https://docs.ansible.com/ansible/latest/user_guide/playbooks_filters.html#id40)

To search a string with a regex, use the “regex_search” filter:

```
## search for "foo" in "foobar"
{{ 'foobar' | regex_search('(foo)') }}

## will return empty if it cannot find a match
{{ 'ansible' | regex_search('(foobar)') }}

## case insensitive search in multiline mode
{{ 'foo\nBAR' | regex_search("^bar", multiline=True, ignorecase=True) }}
```

To search for all occurrences of regex matches, use the “regex_findall” filter:

```
## Return a list of all IPv4 addresses in the string
{{ 'Some DNS servers are 8.8.8.8 and 8.8.4.4' | regex_findall('\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b') }}
```

To replace text in a string with regex, use the “regex_replace” filter:

```
## convert "ansible" to "able"
{{ 'ansible' | regex_replace('^a.*i(.*)$', 'a\\1') }}

## convert "foobar" to "bar"
{{ 'foobar' | regex_replace('^f.*o(.*)$', '\\1') }}

## convert "localhost:80" to "localhost, 80" using named groups
{{ 'localhost:80' | regex_replace('^(?P<host>.+):(?P<port>\\d+)$', '\\g<host>, \\g<port>') }}

## convert "localhost:80" to "localhost"
{{ 'localhost:80' | regex_replace(':80') }}

## change a multiline string
{{ var | regex_replace('^', '#CommentThis#', multiline=True) }}
```

Note

If you want to match the whole string and you are using `*` make sure to always wraparound your regular expression with the start/end anchors. For example `^(.*)$` will always match only one result, while `(.*)` on some Python versions will match the whole string and an empty string at the end, which means it will make two replacements:

```
## add "https://" prefix to each item in a list
GOOD:
{{ hosts | map('regex_replace', '^(.*)$', 'https://\\1') | list }}
{{ hosts | map('regex_replace', '(.+)', 'https://\\1') | list }}
{{ hosts | map('regex_replace', '^', 'https://') | list }}

BAD:
{{ hosts | map('regex_replace', '(.*)', 'https://\\1') | list }}

## append ':80' to each item in a list
GOOD:
{{ hosts | map('regex_replace', '^(.*)$', '\\1:80') | list }}
{{ hosts | map('regex_replace', '(.+)', '\\1:80') | list }}
{{ hosts | map('regex_replace', '$', ':80') | list }}

BAD:
{{ hosts | map('regex_replace', '(.*)', '\\1:80') | list }}
```

Note

Prior to ansible 2.0, if “regex_replace” filter was used with  variables inside YAML arguments (as opposed to simpler ‘key=value’  arguments), then you needed to escape backreferences (for example, `\\1`) with 4 backslashes (`\\\\`) instead of 2 (`\\`).

New in version 2.0.

To escape special characters within a standard Python regex, use the  “regex_escape” filter (using the default re_type=’python’ option):

```
## convert '^f.*o(.*)$' to '\^f\.\*o\(\.\*\)\$'
{{ '^f.*o(.*)$' | regex_escape() }}
```

New in version 2.8.

To escape special characters within a POSIX basic regex, use the “regex_escape” filter with the re_type=’posix_basic’ option:

```
## convert '^f.*o(.*)$' to '\^f\.\*o(\.\*)\$'
{{ '^f.*o(.*)$' | regex_escape('posix_basic') }}
```

#### [Managing file names and path names](https://docs.ansible.com/ansible/latest/user_guide/playbooks_filters.html#id41)

To get the last name of a file path, like ‘foo.txt’ out of ‘/etc/asdf/foo.txt’:

```
{{ path | basename }}
```

To get the last name of a windows style file path (new in version 2.0):

```
{{ path | win_basename }}
```

To separate the windows drive letter from the rest of a file path (new in version 2.0):

```
{{ path | win_splitdrive }}
```

To get only the windows drive letter:

```
{{ path | win_splitdrive | first }}
```

To get the rest of the path without the drive letter:

```
{{ path | win_splitdrive | last }}
```

To get the directory from a path:

```
{{ path | dirname }}
```

To get the directory from a windows path (new version 2.0):

```
{{ path | win_dirname }}
```

To expand a path containing a tilde (~) character (new in version 1.5):

```
{{ path | expanduser }}
```

To expand a path containing environment variables:

```
{{ path | expandvars }}
```

Note

expandvars expands local variables; using it on remote paths can lead to errors.

New in version 2.6.

To get the real path of a link (new in version 1.8):

```
{{ path | realpath }}
```

To get the relative path of a link, from a start point (new in version 1.7):

```
{{ path | relpath('/etc') }}
```

To get the root and extension of a path or file name (new in version 2.0):

```
## with path == 'nginx.conf' the return would be ('nginx', '.conf')
{{ path | splitext }}
```

The `splitext` filter returns a string. The individual components can be accessed by using the `first` and `last` filters:

```
## with path == 'nginx.conf' the return would be 'nginx'
{{ path | splitext | first }}

## with path == 'nginx.conf' the return would be 'conf'
{{ path | splitext | last }}
```

To join one or more path components:

```
{{ ('/etc', path, 'subdir', file) | path_join }}
```

New in version 2.10.

### [Manipulating strings](https://docs.ansible.com/ansible/latest/user_guide/playbooks_filters.html#id42)

To add quotes for shell usage:

```
- name: Run a shell command
  ansible.builtin.shell: echo {{ string_value | quote }}
```

To concatenate a list into a string:

```
{{ list | join(" ") }}
```

To work with Base64 encoded strings:

```
{{ encoded | b64decode }}
{{ decoded | string | b64encode }}
```

As of version 2.6, you can define the type of encoding to use, the default is `utf-8`:

```
{{ encoded | b64decode(encoding='utf-16-le') }}
{{ decoded | string | b64encode(encoding='utf-16-le') }}
```

Note

The `string` filter is only required for Python 2 and ensures that text to encode is a unicode string. Without that filter before b64encode the wrong value  will be encoded.

New in version 2.6.

### [Managing UUIDs](https://docs.ansible.com/ansible/latest/user_guide/playbooks_filters.html#id43)

To create a namespaced UUIDv5:

```
{{ string | to_uuid(namespace='11111111-2222-3333-4444-555555555555') }}
```

New in version 2.10.

To create a namespaced UUIDv5 using the default Ansible namespace ‘361E6D51-FAEC-444A-9079-341386DA8E2E’:

```
{{ string | to_uuid }}
```

New in version 1.9.

To make use of one attribute from each item in a list of complex variables, use the [`Jinja2 map filter`](https://jinja.palletsprojects.com/en/2.11.x/templates/#map):

```
## get a comma-separated list of the mount points (for example, "/,/mnt/stuff") on a host
{{ ansible_mounts | map(attribute='mount') | join(',') }}
```

### [Handling dates and times](https://docs.ansible.com/ansible/latest/user_guide/playbooks_filters.html#id44)

To get a date object from a string use the to_datetime filter:

```
## Get total amount of seconds between two dates. Default date format is %Y-%m-%d %H:%M:%S but you can pass your own format
{{ (("2016-08-14 20:00:12" | to_datetime) - ("2015-12-25" | to_datetime('%Y-%m-%d'))).total_seconds()  }}

## Get remaining seconds after delta has been calculated. NOTE: This does NOT convert years, days, hours, and so on to seconds. For that, use total_seconds()
{{ (("2016-08-14 20:00:12" | to_datetime) - ("2016-08-14 18:00:00" | to_datetime)).seconds  }}
## This expression evaluates to "12" and not "132". Delta is 2 hours, 12 seconds

## get amount of days between two dates. This returns only number of days and discards remaining hours, minutes, and seconds
{{ (("2016-08-14 20:00:12" | to_datetime) - ("2015-12-25" | to_datetime('%Y-%m-%d'))).days  }}
```

New in version 2.4.

To format a date using a string (like with the shell date command), use the “strftime” filter:

```
## Display year-month-day
{{ '%Y-%m-%d' | strftime }}

## Display hour:min:sec
{{ '%H:%M:%S' | strftime }}

## Use ansible_date_time.epoch fact
{{ '%Y-%m-%d %H:%M:%S' | strftime(ansible_date_time.epoch) }}

## Use arbitrary epoch value
{{ '%Y-%m-%d' | strftime(0) }}          ## => 1970-01-01
{{ '%Y-%m-%d' | strftime(1441357287) }} ## => 2015-09-04
```

Note

To get all string possibilities, check https://docs.python.org/3/library/time.html#time.strftime

### [Getting Kubernetes resource names](https://docs.ansible.com/ansible/latest/user_guide/playbooks_filters.html#id45)

Note

These filters have migrated to the [community.kubernetes](https://galaxy.ansible.com/community/kubernetes) collection. Follow the installation instructions to install that collection.

Use the “k8s_config_resource_name” filter to obtain the name of a Kubernetes ConfigMap or Secret, including its hash:

```
{{ configmap_resource_definition | community.kubernetes.k8s_config_resource_name }}
```

This can then be used to reference hashes in Pod specifications:

```
my_secret:
  kind: Secret
  name: my_secret_name

deployment_resource:
  kind: Deployment
  spec:
    template:
      spec:
        containers:
        - envFrom:
            - secretRef:
                name: {{ my_secret | community.kubernetes.k8s_config_resource_name }}
```



















































































































