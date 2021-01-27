### vscode中集成gitBash

![image-20210125163239848](note.assets/image-20210125163239848.png)
修改
```
"terminal.integrated.shell.windows": "D:\\install_First\\GitBash\\bin\\bash.exe",
```

重启vscode


### vuepress_project 
(gitee)
```
Git 全局设置:

git config --global user.name "jimmy688"
git config --global user.email "15219743651@163.com"
创建 git 仓库:

mkdir vuepress_project
cd vuepress_project
git init
touch README.md
git add README.md
git commit -m "first commit"
git remote add origin git@gitee.com:jimmy688/vuepress_project.git
git push -u origin master
已有仓库?

cd existing_git_repo
git remote add origin git@gitee.com:jimmy688/vuepress_project.git
git push -u origin master
```



Jenkins共享库（shared libraries)
参考链接：https://blog.csdn.net/wjp494754224/article/details/83502394
参考链接：https://www.cnblogs.com/anliven/p/13693871.html

共享库可以将整个pipeline脚本的实现和复杂度封装到Shared Library中，在各种项目之间共享pipeline核心实现，减少冗余代码。
也就是说，Shared Libraries的方式抽象了各种项目之间共享的代码（甚至整条完整的pipeline），有效降低了使用pipeline的复杂度。

共享库中存储的每个文件都是一个groovy的类，每个文件（类）中包含一个或多个方法，每个方法包含groovy语句块。
**Shared Library遵循固定的代码目录结构：**

```sh
+- src                     # Groovy source files
|   +- org
|       +- foo
|           +- Bar.groovy  # for org.foo.Bar class
+- vars
|   +- foo.groovy          # for global 'foo' variable
|   +- foo.txt             # help for 'foo' variable
+- resources               # resource files (external libraries only)
|   +- org
|       +- foo
|           +- bar.json    # static helper data for org.foo.Bar
```

src目录：

- 标准的Java源目录结构，存放编写的groovy类，执行流水线时，此目录将添加到类路径
- 存放一些**特定的功能实现**，文件格式为`.groovy`

vars目录：

- 存放可从Pipeline访问的全局脚本(标准化脚本)，这些脚本文件在流水线中作为变量公开
- 使用驼峰（camelCased）命名方式，文件格式为`.groovy`
- **在`.groovy`文件中，可以通过import的方式，引入src目录的类库**

resources目录：

- 从外部库中使用步骤来加载相关联的非Groovy文件

doc目录：

- 存放pipeline的相关文档说明
- 一般包含ReadMe.md文件







# 使用共享库



## 3.1 全局共享库

- `Manage Jenkins >> Configure System >> Global Pipeline Libraries`
- 可以添加一个或多个全局可用的共享库，也就是说任何Pipeline都可以利用这些库中实现的功能。
- 通过配置SCM，可以保证在每次构建时都能获取到指定Shared Library的最新代码
- 需要为共享库设置一个名称，便于在Jenkinsfile中引用，并且设置一个默认版本

![image-20210126165335128](note.assets/image-20210126165335128.png)

- 标记为`Load implicitly`的共享库允许流水线立即使用任何此库定义的类或全局变量。





### 优化github速度
1.国内如何快速访问gibhub
-FQ的方法无非就是用软件，这种就不介绍了
-本次介绍的是修改本地系统主机hosts文件，绕过国内dns解析，达到快速访问github

打开IPAddress.com网站,查询下列三个地址的ip
    1.github.com
    2.assets-cnd.github.com
    3.gibhut.global.ssl.fastly.net

2.修改本地hosts文件，本次只介绍window系统
C:\Windows\System32\drivers\etc 找到hosts文件，然后添加下列数据，注意把下面的ip改成你自己查询到ip地址。
   140.82.114.3 github.com
   185.199.108.153 assets-cdn.github.com
   199.232.69.194 github.global.ssl.fastly.net

3.刷新本地dns缓存
打开cmd，输入命令 ipconfig/flushdns
此时就配置成功了，然后就可以去访问啦
