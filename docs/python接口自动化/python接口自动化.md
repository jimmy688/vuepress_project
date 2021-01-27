## python接口自动化

### requests模块

#### requests模块支持的请求方式

```python
1   requests.get(‘https://github.com/timeline.json’)                                ## GET请求
2   requests.post(“http://httpbin.org/post”)                                        ## POST请求
3   requests.put(“http://httpbin.org/put”)                                          ## PUT请求
4   requests.delete(“http://httpbin.org/delete”)                                    ## DELETE请求
5   requests.head(“http://httpbin.org/get”)                                         ## HEAD请求
6   requests.options(“http://httpbin.org/get” )                                     ## OPTIONS请求
```

#### 定制get/post请求头

![image-20200922163016598](python接口自动化.assets/image-20200922163016598.png)

注意：

- `get`请求时，`url`中的请求参数（即`queryString`)使用`params`来设定，一般来说，**直接在url中填写就行了**，不用单独用一个字典来写
- 只有`post`请求时，才有`data`，`data`对应的是请求`body`
- 发送请求时，参数里面不能同时存在`params`和`data`，否则报错，所以一般建议在`url`的参数就写在`url`就好了
- `verify`是使用`https`的时候才用到。

#### 请求的返回内容

```lua
r.status_code     #响应状态码
r.content     #字节方式的响应体，会自动为你解码 gzip 和 deflate 压缩
r.headers     #以字典对象存储服务器响应头，但是这个字典比较特殊，字典键不区分大小写，若键不存在则返回None
r.json()     #Requests中内置的JSON解码器 ,json转成python的字典了
r.url       ## 获取url
r.encoding     ## 编码格式
r.cookies        ## 获取cookie
r.raw       #返回原始响应体
r.text       #字符串方式的响应体，会自动根据响应头部的字符编码进行解码
r.raise_for_status() #失败请求(非200响应)抛出异常
```

注意：

1. 响应内容必须是`json`格式的，才能用`r.json()`，否则会报错！
2. 有些响应内容是`gzip`压缩的，`text`只能打印文本内容，用`content`是二进制流，一般获取返回值内容，推荐用`content`
3. `r.content`获取的响应内容是字节形式的，如果要**将字节内容转为字符串，有以下两种方法**：
   1. 使用`str()`方法：`str(login_r.content,encoding='utf-8')`
   2. 使用`bytes.decode()`方法：`bytes.decode(login_r.content)`

#### SSL证书解决方法

官方文档：https://2.python-requests.org/en/master/user/advanced/#verification

第一种方法：设定证书路径

![image-20200923101459897](python接口自动化.assets/image-20200923101459897.png)

第二种方法：忽略证书确认

![image-20200923101629814](python接口自动化.assets/image-20200923101629814.png)

#### json请求参数

当`post`请求的`body`为`json`格式时，有两种方法传`json`参数：

第一种：传`json`参数（自动转`json`了）

![image-20200923103150358](python接口自动化.assets/image-20200923103150358.png)

第二种：传`data`参数（需`json`转换）

![image-20200923103225041](python接口自动化.assets/image-20200923103225041.png)

奇怪实例：实现下面图中的请求，可以看到请求`body`中是`json`格式的，而且有些值为`null`，`python`中只有`None`，没有`null`，所以会报错。解决办法是：字符串转为字典或者`null`改为`None`

![image-20200924171529455](python接口自动化.assets/image-20200924171529455.png)

```python
import requests
import json
s=requests.Session()


login_url = 'http://192.168.239.135:8080/recruit.students/login/in'
login_payload = {
    "account": "admin",
    "pwd": "660B8D2D5359FF6F94F8D3345698F88C"
}
login_r=s.post(url=login_url,data=login_payload)
print(login_r.text)


## 解决办法1：字符串转为字典：
settime_url='http://192.168.239.135:8080/recruit.students/school/manage/setStudentRecruitTime'
settime_payload=json.loads('[{"id":"280","recruitStartTime":null,"recruitEndTime":null,"isStudentRecruitTime":"0"}]')
settime_r=s.post(url=settime_url,json=settime_payload)
print(settime_r.text)

## 解决办法2：null改为None
settime_url='http://192.168.239.135:8080/recruit.students/school/manage/setStudentRecruitTime'
settime_payload=[{"id":"280","recruitStartTime":None,"recruitEndTime":None,"isStudentRecruitTime":"0"}]
settime_r=s.post(url=settime_url,json=settime_payload)
print(settime_r.text)
```



#### url编码与解码

对`url`中的中文进行编码：

![image-20200923105012245](python接口自动化.assets/image-20200923105012245.png)

对`url`中的中文进行解码：

![image-20200923105806680](python接口自动化.assets/image-20200923105806680.png)





#### xiaoqiang实例

访问`xiaoqiang`系统的流水式代码：

```python
import requests
import time

s=requests.Session()

login_url = 'http://192.168.239.128/xiaoqiangshop/user.php'
login_body = {
    'username': 'xiaoqiang1',
    'password': '123123',
    'act': 'act_login',
    'back_act': 'user.php',
    'submit': ''
}
login_r=s.post(url=login_url,data=login_body)
print(login_r.text)

#===========================================
search_url='http://192.168.239.128/xiaoqiangshop/goods.php'
search_params={'id':'134'}
search_r=s.get(url=search_url,params=search_params)
print(login_r.text)


#============================================
addToCar_url='http://192.168.239.128/xiaoqiangshop/flow.php'
addToCar_params={'step':'add_to_cart'}
addToCar_body={'goods':'{"quick":1,"spec":[],"goods_id":134,"number":"1","parent":0}'}
addToCar_r=s.post(url=addToCar_url,params=addToCar_params,data=addToCar_body)
print(addToCar_r.text)


#=================================================
checkOut_url='http://192.168.239.128/xiaoqiangshop/flow.php'
checkOut_params={'step':'checkout'}
checkOut_r=s.get(url=checkOut_url,params=checkOut_params)
print(checkOut_r.text)


#===================================================
done_url='http://192.168.239.128/xiaoqiangshop/flow.php?step=done'
headers={
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36',
    'Content-Type':'application/x-www-form-urlencoded'
}
done_body={
    'shipping':'1',
    'payment':'1',
    'bonus':'0',
    'bonus_sn':'',
    'postscript':'',
    'how_oos':'0',
    'x':'29',
    'y':'14',
    'step':'done'
}
done_r=s.post(url=done_url,data=done_body,headers=headers)
print(done_r.text)
```

访问`xiaoqiang`的封装后的代码：

```python
import requests
import time
class xiaoQiang:
    s=requests.Session()
    def __init__(self):
        pass
    def xq_login(self,username,password):
        login_url = 'http://192.168.239.128/xiaoqiangshop/user.php'
        login_body = {
            'username': username,
            'password': password,
            'act': 'act_login',
            'back_act': 'user.php',
            'submit': ''
        }
        login_r = self.s.post(url=login_url, data=login_body)
        return login_r
    def xq_search(self):
        search_url = 'http://192.168.239.128/xiaoqiangshop/goods.php'
        search_params = {'id': '134'}
        search_r = self.s.get(url=search_url, params=search_params)
        return search_r
    def xq_addToCar(self):
        addToCar_url = 'http://192.168.239.128/xiaoqiangshop/flow.php'
        addToCar_params = {'step': 'add_to_cart'}
        addToCar_body = {'goods': '{"quick":1,"spec":[],"goods_id":134,"number":"1","parent":0}'}
        addToCar_r = self.s.post(url=addToCar_url, params=addToCar_params, data=addToCar_body)
        return addToCar_r
    def xq_checkout(self):
        checkOut_url = 'http://192.168.239.128/xiaoqiangshop/flow.php'
        checkOut_params = {'step': 'checkout'}
        checkOut_r = self.s.get(url=checkOut_url, params=checkOut_params)
        return checkOut_r
    def xq_done(self):
        done_url = 'http://192.168.239.128/xiaoqiangshop/flow.php?step=done'
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        done_body = {
            'shipping': '1',
            'payment': '1',
            'bonus': '0',
            'bonus_sn': '',
            'postscript': '',
            'how_oos': '0',
            'x': '29',
            'y': '14',
            'step': 'done'
        }
        done_r = self.s.post(url=done_url, data=done_body, headers=headers)
        return done_r

if __name__=='__main__':
    xq=xiaoQiang()
    login_r=xq.xq_login('xiaoqiang1',123123)
    search_r=xq.xq_search()
    addToCar_r=xq.xq_addToCar()
    checkout_r=xq.xq_checkout()
    done_r=xq.xq_done()
```

#### 招生系统实例

关键步骤：从新建学校一步，使用正则表达式提取禁用学校一步要用到的信息（**相当于`jmeter`中的参数关联**）：

![image-20200923110012327](python接口自动化.assets/image-20200923110012327.png)

访问招生系统的流水式代码：

```python
import requests
import time
import random
import re
s=requests.Session()

## ===============登录==========================
login_url='http://192.168.239.135:8080/recruit.students/login/in?account=admin&pwd=660B8D2D5359FF6F94F8D3345698F88C'
login_r=s.get(url=login_url)
print(login_r)

#===============新建学校========================
addSchool_url='http://192.168.239.135:8080/recruit.students/school/manage/addSchoolInfo'
addSchool_data={
    'schoolName':'{}'.format("".join(random.sample("我双开的发送垃圾分类卡积分",4))),
    'listSchoolType%5B0%5D.id':'2',
    'canRecruit':'1',
    'remark':''
}
addSchool_r=s.post(url=addSchool_url,data=addSchool_data)
print(addSchool_r.text)
type(addSchool_r.text)

#================禁用学校=======================
disableSchool_url='http://192.168.239.135:8080/recruit.students/school/manage/enableOrDisableSchool'
headers={
    'Content-Type': 'application/json'
}
id=re.search(r'"laccount":(\d+),"sta',addSchool_r.text).group(1)
schoolId=re.search(r'data":{"id":(\d*),"schoo',addSchool_r.text).group(1)
## id=re.findall(r'"laccount":(.*?),"sta',addSchool_r.text)
disableSchool_data=[{"id":"{}".format(id),"disable":0,"schoolId":"{}".format(schoolId)}]
disableSchool_r=s.post(url=disableSchool_url,json=disableSchool_data,headers=headers)
print(disableSchool_r.text)
```

封装后的代码：

```python
import requests
import time
import random
import re


class recruit:
    s=requests.Session()
    def __init__(self):
        pass
    def login(self):
        login_url = 'http://192.168.239.135:8080/recruit.students/login/in?account=admin&pwd=660B8D2D5359FF6F94F8D3345698F88C'
        login_r = self.s.get(url=login_url)
        return login_r
    def addSchool(self):
        addSchool_url = 'http://192.168.239.135:8080/recruit.students/school/manage/addSchoolInfo'
        addSchool_data = {
            'schoolName': '{}'.format("".join(random.sample("我双开的发送垃圾分类卡积分", 4))),
            'listSchoolType%5B0%5D.id': '2',
            'canRecruit': '1',
            'remark': ''
        }
        addSchool_r = self.s.post(url=addSchool_url, data=addSchool_data)
        return addSchool_r
    def disableOrEnable(self,addSchool_r):
        disableSchool_url = 'http://192.168.239.135:8080/recruit.students/school/manage/enableOrDisableSchool'
        headers = {
            'Content-Type': 'application/json'
        }
        id = re.search(r'"laccount":(\d+),"sta', addSchool_r.text).group(1)
        schoolId = re.search(r'data":{"id":(\d*),"schoo', addSchool_r.text).group(1)
        ## id=re.findall(r'"laccount":(.*?),"sta',addSchool_r.text)
        disableSchool_data = [{"id": "{}".format(id), "disable": 0, "schoolId": "{}".format(schoolId)}]
        disableSchool_r = self.s.post(url=disableSchool_url, json=disableSchool_data, headers=headers)
        return disableSchool_r





if __name__=='__main__':
    rs=recruit()
    login_r=rs.login()
    addSchool_r=rs.addSchool()
    de_r=rs.disableOrEnable(addSchool_r=addSchool_r)
```

#### 用python写测试的建议

##### 1、接口与测试的分离

接口写在一个`.py`文件（模块）

![image-20200924154509349](python接口自动化.assets/image-20200924154509349.png)

测试用例写在一个`.py`文件（模块）

![image-20200924154712399](python接口自动化.assets/image-20200924154712399.png)

### unittest模块

`unittest`官方文档：https://docs.python.org/zh-cn/3.7/library/unittest.html#assert-methods

`Unittest`是`python`里面 的单元测试框架，方便**组建测试用例**，一键**执行用例**，并**生成可视化测试报告**

`unittest`最核心的四部分是：`TestCase`，`TestSuite`，`TestRunner`，`TestFixture`

- `TestCase`：用户自定义的测试`case`的基类，调用`run()`方法，会依次调用`setUp`方法、执行用例的方法、`tearDown`方法。
- `TestSuite`：测试用例集合，可以通过`addTest()`方法手动增加`Test Case`，也可以通过`TestLoader`自动添加`Test Case`，`TestLoader`在添加用例时，会没有顺序。
- `TestRunner`：运行测试用例的驱动类，可以执行`TestCase`，也可以执行`TestSuite`，执行后`TestCase`和`TestSuite`会自动管理`TESTResult`。
- `TestFixture`：简单来说就是做一些测试过程中需要准备的东西，比如创建临时的数据库，文件和目录等，其中`setUp()`和`setDown()`是最常用的方法

整个的流程就是首先要写好`TestCase`，然后由`TestLoader`加载`TestCase`到`TestSuite`，然后由`TestTestRunner`来运行`TestSuite`，运行的结果保存在`TextTestReusult`中，整个过程集成在`unittest.main`模块中。

#### 使用TestCase

测试类，继承单元测试`unittest.TestCase`这个类。

```python
import unittest

class Test1(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        print("setUpClass初始化操作：用例开始前只执行一次")
        print("execute setUpClass")

    @classmethod
    def tearDownClass(self):
        print("tearDownClass收尾清理操作：用例结束时候只执行一次")
        print("execute tearDownClass")

    def setUp(self):
        print("setUp每次用例开始前都会执行！！！")
        print("execute setUp")

    def tearDown(self):
        print("tearDown每次用例结构都会执行！！！")
        print("execute tearDown")

    def test_one(self):
        print('execute test_one')
        self.assertTrue('FOO'.isupper())

    def test_two(self):
        print('execute test_two')


if __name__ == '__main__':
    unittest.main()

```

运行结果为：

![image-20200923115941652](python接口自动化.assets/image-20200923115941652.png)

注意：写测试用例（函数）时，**命名必须是以`test`开头**！！！否则用例不会被执行。

#### 使用TestSuite

直接写`TestCase`执行时是按字母排序的顺序执行的，如果要设定测试用例的执行先后顺序则需要将`TestCase`封装到`TestSuite`。

代码如下：

```python
import unittest

import unittest

class Test2(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        print("setUpClass初始化操作：用例开始前只执行一次")
        print("execute setUpClass")

    @classmethod
    def tearDownClass(self):
        print("tearDownClass收尾清理操作：用例结束时候只执行一次")
        print("execute tearDownClass")

    def setUp(self):
        print("setUp每次用例开始前都会执行！！！")
        print("execute setUp")

    def tearDown(self):
        print("tearDown每次用例结构都会执行！！！")
        print("execute tearDown")

    def test_one(self):
        print('execute test_one')
        self.assertTrue('FOO'.isupper())

    def test_two(self):
        print('execute test_two')


if __name__ == '__main__':
    suite=unittest.TestSuite()
    suite.addTest(Test2('test_two'))
    suite.addTest(Test2('test_one'))
    runner=unittest.TextTestRunner()
    runner.run(suite)
```

运行结果为：

![image-20200923120525615](python接口自动化.assets/image-20200923120525615.png)

##### TestSuite注意事项

我们知道，`TestSuite`可以帮助我们自定义要运行的用例以及它们的顺序，但有时候会发现，尽管我们使用了`TestSuite`，但还是**不会按照我们的顺序来运行测试用例**，比如上面的实例。

原因是：**运行方式！！！**

在`pycharm`上点击如下按钮来运行`unittest`相关的脚本时：

![image-20200924144023988](python接口自动化.assets/image-20200924144023988.png)

会默认使用`unittest in xxx`的方式来运行脚本，**不会去运行`if __name__=='__main__'`下面的内容**，而是会按照`ascii`顺序去运行`TestCase`子类内定义的所有用例（函数）。

![image-20200924144303573](python接口自动化.assets/image-20200924144303573.png)

所以，我们需要改变运行方式，将运行环境改为 正常的`python` 环境（`PS`：就是不选择 `unitest` 的环境）再次运行脚本：

![image-20200924150135252](python接口自动化.assets/image-20200924150135252.png)



#### 使用HTMLTestRunner

可使用`HTMLTestRunner`生成测试的`HTML`报告，`HTMLTestRunner`是`Python`标准库的`unittest`模块的扩展，无法通过`pip`安装。需要自己手动网上下载。

下载或创建了`HTMLTestRunner.py`文件后，可以将其放在`python`的`lib`目录下，也可以放在项目的某个`package`里面（只是导入方式改成`from ... import ...`而已）。

![image-20200923130809503](python接口自动化.assets/image-20200923130809503.png)

我使用的方法是直接放在`lib`目录下。

##### HTMLTestRunner.py代码

下载地址：http://tungwaiyip.info/software/HTMLTestRunner.html

适用于`python3`版本的`HTMLTestRunner.py`的代码可以如下，可以直接复制粘贴来创建：

```python
"""
A TestRunner for use with the Python unit testing framework. It
generates a HTML report to show the result at a glance.

The simplest way to use this is to invoke its main method. E.g.

    import unittest
    import HTMLTestRunner

    ... define your tests ...

    if __name__ == '__main__':
        HTMLTestRunner.main()


For more customization options, instantiates a HTMLTestRunner object.
HTMLTestRunner is a counterpart to unittest's TextTestRunner. E.g.

    ## output to a file
    fp = file('my_report.html', 'wb')
    runner = HTMLTestRunner.HTMLTestRunner(
                stream=fp,
                title='My unit test',
                description='This demonstrates the report output by HTMLTestRunner.'
                )

    ## Use an external stylesheet.
    ## See the Template_mixin class for more customizable options
    runner.STYLESHEET_TMPL = '<link rel="stylesheet" href="my_stylesheet.css" type="text/css">'

    ## run the test
    runner.run(my_test_suite)


------------------------------------------------------------------------
Copyright (c) 2004-2007, Wai Yip Tung
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are
met:

* Redistributions of source code must retain the above copyright notice,
  this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright
  notice, this list of conditions and the following disclaimer in the
  documentation and/or other materials provided with the distribution.
* Neither the name Wai Yip Tung nor the names of its contributors may be
  used to endorse or promote products derived from this software without
  specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER
OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
"""

## URL: http://tungwaiyip.info/software/HTMLTestRunner.html

__author__ = "Wai Yip Tung"
__version__ = "0.8.2"


"""
Change History

Version 0.8.2
* Show output inline instead of popup window (Viorel Lupu).

Version in 0.8.1
* Validated XHTML (Wolfgang Borgert).
* Added description of test classes and test cases.

Version in 0.8.0
* Define Template_mixin class for customization.
* Workaround a IE 6 bug that it does not treat <script> block as CDATA.

Version in 0.7.1
* Back port to Python 2.3 (Frank Horowitz).
* Fix missing scroll bars in detail log (Podi).
"""

## TODO: color stderr
## TODO: simplify javascript using ,ore than 1 class in the class attribute?

import datetime
#2.7版本为 import StringIO
import io
import sys
import time
import unittest
from xml.sax import saxutils


## ------------------------------------------------------------------------
## The redirectors below are used to capture output during testing. Output
## sent to sys.stdout and sys.stderr are automatically captured. However
## in some cases sys.stdout is already cached before HTMLTestRunner is
## invoked (e.g. calling logging.basicConfig). In order to capture those
## output, use the redirectors for the cached stream.
#
## e.g.
##   >>> logging.basicConfig(stream=HTMLTestRunner.stdout_redirector)
##   >>>

class OutputRedirector(object):
    """ Wrapper to redirect stdout or stderr """
    def __init__(self, fp):
        self.fp = fp

    def write(self, s):
        self.fp.write(s)

    def writelines(self, lines):
        self.fp.writelines(lines)

    def flush(self):
        self.fp.flush()

stdout_redirector = OutputRedirector(sys.stdout)
stderr_redirector = OutputRedirector(sys.stderr)



## ----------------------------------------------------------------------
## Template

class Template_mixin(object):
    """
    Define a HTML template for report customerization and generation.

    Overall structure of an HTML report

    HTML
    +------------------------+
    |<html>                  |
    |  <head>                |
    |                        |
    |   STYLESHEET           |
    |   +----------------+   |
    |   |                |   |
    |   +----------------+   |
    |                        |
    |  </head>               |
    |                        |
    |  <body>                |
    |                        |
    |   HEADING              |
    |   +----------------+   |
    |   |                |   |
    |   +----------------+   |
    |                        |
    |   REPORT               |
    |   +----------------+   |
    |   |                |   |
    |   +----------------+   |
    |                        |
    |   ENDING               |
    |   +----------------+   |
    |   |                |   |
    |   +----------------+   |
    |                        |
    |  </body>               |
    |</html>                 |
    +------------------------+
    """

    STATUS = {
    0: 'pass',
    1: 'fail',
    2: 'error',
    }

    DEFAULT_TITLE = 'Unit Test Report'
    DEFAULT_DESCRIPTION = ''

    ## ------------------------------------------------------------------------
    ## HTML Template

    HTML_TMPL = r"""<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>%(title)s</title>
    <meta name="generator" content="%(generator)s"/>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    %(stylesheet)s
</head>
<body>
<script language="javascript" type="text/javascript"><!--
output_list = Array();

/* level - 0:Summary; 1:Failed; 2:All */
function showCase(level) {
    trs = document.getElementsByTagName("tr");
    for (var i = 0; i < trs.length; i++) {
        tr = trs[i];
        id = tr.id;
        if (id.substr(0,2) == 'ft') {
            if (level < 1) {
                tr.className = 'hiddenRow';
            }
            else {
                tr.className = '';
            }
        }
        if (id.substr(0,2) == 'pt') {
            if (level > 1) {
                tr.className = '';
            }
            else {
                tr.className = 'hiddenRow';
            }
        }
    }
}


function showClassDetail(cid, count) {
    var id_list = Array(count);
    var toHide = 1;
    for (var i = 0; i < count; i++) {
        tid0 = 't' + cid.substr(1) + '.' + (i+1);
        tid = 'f' + tid0;
        tr = document.getElementById(tid);
        if (!tr) {
            tid = 'p' + tid0;
            tr = document.getElementById(tid);
        }
        id_list[i] = tid;
        if (tr.className) {
            toHide = 0;
        }
    }
    for (var i = 0; i < count; i++) {
        tid = id_list[i];
        if (toHide) {
            document.getElementById('div_'+tid).style.display = 'none'
            document.getElementById(tid).className = 'hiddenRow';
        }
        else {
            document.getElementById(tid).className = '';
        }
    }
}


function showTestDetail(div_id){
    var details_div = document.getElementById(div_id)
    var displayState = details_div.style.display
    // alert(displayState)
    if (displayState != 'block' ) {
        displayState = 'block'
        details_div.style.display = 'block'
    }
    else {
        details_div.style.display = 'none'
    }
}


function html_escape(s) {
    s = s.replace(/&/g,'&');
    s = s.replace(/</g,'<');
    s = s.replace(/>/g,'>');
    return s;
}

/* obsoleted by detail in <div>
function showOutput(id, name) {
    var w = window.open("", //url
                    name,
                    "resizable,scrollbars,status,width=800,height=450");
    d = w.document;
    d.write("<pre>");
    d.write(html_escape(output_list[id]));
    d.write("\n");
    d.write("<a href='javascript:window.close()'>close</a>\n");
    d.write("</pre>\n");
    d.close();
}
*/
--></script>

%(heading)s
%(report)s
%(ending)s

</body>
</html>
"""
    ## variables: (title, generator, stylesheet, heading, report, ending)


    ## ------------------------------------------------------------------------
    ## Stylesheet
    #
    ## alternatively use a <link> for external style sheet, e.g.
    ##   <link rel="stylesheet" href="$url" type="text/css">

    STYLESHEET_TMPL = """
<style type="text/css" media="screen">
body        { font-family: verdana, arial, helvetica, sans-serif; font-size: 80%; }
table       { font-size: 100%; }
pre         { }

/* -- heading ---------------------------------------------------------------------- */
h1 {
    font-size: 16pt;
    color: gray;
}
.heading {
    margin-top: 0ex;
    margin-bottom: 1ex;
}

.heading .attribute {
    margin-top: 1ex;
    margin-bottom: 0;
}

.heading .description {
    margin-top: 4ex;
    margin-bottom: 6ex;
}

/* -- css div popup ------------------------------------------------------------------------ */
a.popup_link {
}

a.popup_link:hover {
    color: red;
}

.popup_window {
    display: none;
    position: relative;
    left: 0px;
    top: 0px;
    /*border: solid #627173 1px; */
    padding: 10px;
    background-color: #E6E6D6;
    font-family: "Lucida Console", "Courier New", Courier, monospace;
    text-align: left;
    font-size: 8pt;
    width: 500px;
}

}
/* -- report ------------------------------------------------------------------------ */
#show_detail_line {
    margin-top: 3ex;
    margin-bottom: 1ex;
}
#result_table {
    width: 80%;
    border-collapse: collapse;
    border: 1px solid #777;
}
#header_row {
    font-weight: bold;
    color: white;
    background-color: #777;
}
#result_table td {
    border: 1px solid #777;
    padding: 2px;
}
#total_row  { font-weight: bold; }
.passClass  { background-color: #6c6; }
.failClass  { background-color: #c60; }
.errorClass { background-color: #c00; }
.passCase   { color: #6c6; }
.failCase   { color: #c60; font-weight: bold; }
.errorCase  { color: #c00; font-weight: bold; }
.hiddenRow  { display: none; }
.testcase   { margin-left: 2em; }


/* -- ending ---------------------------------------------------------------------- */
#ending {
}

</style>
"""



    ## ------------------------------------------------------------------------
    ## Heading
    #

    HEADING_TMPL = """<div class='heading'>
<h1>%(title)s</h1>
%(parameters)s
<p class='description'>%(description)s</p>
</div>

""" ## variables: (title, parameters, description)

    HEADING_ATTRIBUTE_TMPL = """<p class='attribute'><strong>%(name)s:</strong> %(value)s</p>
""" ## variables: (name, value)



    ## ------------------------------------------------------------------------
    ## Report
    #

    REPORT_TMPL = """
<p id='show_detail_line'>Show
<a href='javascript:showCase(0)'>Summary</a>
<a href='javascript:showCase(1)'>Failed</a>
<a href='javascript:showCase(2)'>All</a>
</p>
<table id='result_table'>
<colgroup>
<col align='left' />
<col align='right' />
<col align='right' />
<col align='right' />
<col align='right' />
<col align='right' />
</colgroup>
<tr id='header_row'>
    <td>Test Group/Test case</td>
    <td>Count</td>
    <td>Pass</td>
    <td>Fail</td>
    <td>Error</td>
    <td>View</td>
</tr>
%(test_list)s
<tr id='total_row'>
    <td>Total</td>
    <td>%(count)s</td>
    <td>%(Pass)s</td>
    <td>%(fail)s</td>
    <td>%(error)s</td>
    <td> </td>
</tr>
</table>
""" ## variables: (test_list, count, Pass, fail, error)

    REPORT_CLASS_TMPL = r"""
<tr class='%(style)s'>
    <td>%(desc)s</td>
    <td>%(count)s</td>
    <td>%(Pass)s</td>
    <td>%(fail)s</td>
    <td>%(error)s</td>
    <td><a href="javascript:showClassDetail('%(cid)s',%(count)s)">Detail</a></td>
</tr>
""" ## variables: (style, desc, count, Pass, fail, error, cid)


    REPORT_TEST_WITH_OUTPUT_TMPL = r"""
<tr id='%(tid)s' class='%(Class)s'>
    <td class='%(style)s'><div class='testcase'>%(desc)s</div></td>
    <td colspan='5' align='center'>

    <!--css div popup start-->
    <a class="popup_link" onfocus='this.blur();' href="javascript:showTestDetail('div_%(tid)s')" >
        %(status)s</a>

    <div id='div_%(tid)s' class="popup_window">
        <div style='text-align: right; color:red;cursor:pointer'>
        <a onfocus='this.blur();' onclick="document.getElementById('div_%(tid)s').style.display = 'none' " >
           [x]</a>
        </div>
        <pre>
        %(script)s
        </pre>
    </div>
    <!--css div popup end-->

    </td>
</tr>
""" ## variables: (tid, Class, style, desc, status)


    REPORT_TEST_NO_OUTPUT_TMPL = r"""
<tr id='%(tid)s' class='%(Class)s'>
    <td class='%(style)s'><div class='testcase'>%(desc)s</div></td>
    <td colspan='5' align='center'>%(status)s</td>
</tr>
""" ## variables: (tid, Class, style, desc, status)


    REPORT_TEST_OUTPUT_TMPL = r"""
%(id)s: %(output)s
""" ## variables: (id, output)



    ## ------------------------------------------------------------------------
    ## ENDING
    #

    ENDING_TMPL = """<div id='ending'> </div>"""

## -------------------- The end of the Template class -------------------


TestResult = unittest.TestResult

class _TestResult(TestResult):
    ## note: _TestResult is a pure representation of results.
    ## It lacks the output and reporting ability compares to unittest._TextTestResult.

    def __init__(self, verbosity=1):
        TestResult.__init__(self)
        self.stdout0 = None
        self.stderr0 = None
        self.success_count = 0
        self.failure_count = 0
        self.error_count = 0
        self.verbosity = verbosity

        ## result is a list of result in 4 tuple
        ## (
        ##   result code (0: success; 1: fail; 2: error),
        ##   TestCase object,
        ##   Test output (byte string),
        ##   stack trace,
        ## )
        self.result = []


    def startTest(self, test):
        TestResult.startTest(self, test)
        ## just one buffer for both stdout and stderr
        ## 2.7版本为 self.outputBuffer = StringIO.StringIO()
        self.outputBuffer = io.StringIO()
        stdout_redirector.fp = self.outputBuffer
        stderr_redirector.fp = self.outputBuffer
        self.stdout0 = sys.stdout
        self.stderr0 = sys.stderr
        sys.stdout = stdout_redirector
        sys.stderr = stderr_redirector


    def complete_output(self):
        """
        Disconnect output redirection and return buffer.
        Safe to call multiple times.
        """
        if self.stdout0:
            sys.stdout = self.stdout0
            sys.stderr = self.stderr0
            self.stdout0 = None
            self.stderr0 = None
        return self.outputBuffer.getvalue()


    def stopTest(self, test):
        ## Usually one of addSuccess, addError or addFailure would have been called.
        ## But there are some path in unittest that would bypass this.
        ## We must disconnect stdout in stopTest(), which is guaranteed to be called.
        self.complete_output()


    def addSuccess(self, test):
        self.success_count += 1
        TestResult.addSuccess(self, test)
        output = self.complete_output()
        self.result.append((0, test, output, ''))
        if self.verbosity > 1:
            sys.stderr.write('ok ')
            sys.stderr.write(str(test))
            sys.stderr.write('\n')
        else:
            sys.stderr.write('.')

    def addError(self, test, err):
        self.error_count += 1
        TestResult.addError(self, test, err)
        _, _exc_str = self.errors[-1]
        output = self.complete_output()
        self.result.append((2, test, output, _exc_str))
        if self.verbosity > 1:
            sys.stderr.write('E  ')
            sys.stderr.write(str(test))
            sys.stderr.write('\n')
        else:
            sys.stderr.write('E')

    def addFailure(self, test, err):
        self.failure_count += 1
        TestResult.addFailure(self, test, err)
        _, _exc_str = self.failures[-1]
        output = self.complete_output()
        self.result.append((1, test, output, _exc_str))
        if self.verbosity > 1:
            sys.stderr.write('F  ')
            sys.stderr.write(str(test))
            sys.stderr.write('\n')
        else:
            sys.stderr.write('F')


class HTMLTestRunner(Template_mixin):
    """
    """
    def __init__(self, stream=sys.stdout, verbosity=1, title=None, description=None):
        self.stream = stream
        self.verbosity = verbosity
        if title is None:
            self.title = self.DEFAULT_TITLE
        else:
            self.title = title
        if description is None:
            self.description = self.DEFAULT_DESCRIPTION
        else:
            self.description = description

        self.startTime = datetime.datetime.now()


    def run(self, test):
        "Run the given test case or test suite."
        result = _TestResult(self.verbosity)
        test(result)
        self.stopTime = datetime.datetime.now()
        self.generateReport(test, result)
        print(sys.stderr,'\nTime Elapsed=%s' %(self.stopTime-self.startTime))
        #2.7版本 print >>sys.stderr, '\nTime Elapsed: %s' % (self.stopTime-self.startTime)
        return result



    def sortResult(self, result_list):
        ## unittest does not seems to run in any particular order.
        ## Here at least we want to group them together by class.
        rmap = {}
        classes = []
        for n,t,o,e in result_list:
            cls = t.__class__
            ## 2.7版本 if not rmap.has_key(cls)
            if not cls in rmap:
                rmap[cls] = []
                classes.append(cls)
            rmap[cls].append((n,t,o,e))
        r = [(cls, rmap[cls]) for cls in classes]
        return r


    def getReportAttributes(self, result):
        """
        Return report attributes as a list of (name, value).
        Override this to add custom attributes.
        """
        startTime = str(self.startTime)[:19]
        duration = str(self.stopTime - self.startTime)
        status = []
        if result.success_count: status.append('Pass %s'    % result.success_count)
        if result.failure_count: status.append('Failure %s' % result.failure_count)
        if result.error_count:   status.append('Error %s'   % result.error_count  )
        if status:
            status = ' '.join(status)
        else:
            status = 'none'
        return [
            ('Start Time', startTime),
            ('Duration', duration),
            ('Status', status),
        ]


    def generateReport(self, test, result):
        report_attrs = self.getReportAttributes(result)
        generator = 'HTMLTestRunner %s' % __version__
        stylesheet = self._generate_stylesheet()
        heading = self._generate_heading(report_attrs)
        report = self._generate_report(result)
        ending = self._generate_ending()
        output = self.HTML_TMPL % dict(
            title = saxutils.escape(self.title),
            generator = generator,
            stylesheet = stylesheet,
            heading = heading,
            report = report,
            ending = ending,
        )
        self.stream.write(output.encode('utf8'))


    def _generate_stylesheet(self):
        return self.STYLESHEET_TMPL


    def _generate_heading(self, report_attrs):
        a_lines = []
        for name, value in report_attrs:
            line = self.HEADING_ATTRIBUTE_TMPL % dict(
                    name = saxutils.escape(name),
                    value = saxutils.escape(value),
                )
            a_lines.append(line)
        heading = self.HEADING_TMPL % dict(
            title = saxutils.escape(self.title),
            parameters = ''.join(a_lines),
            description = saxutils.escape(self.description),
        )
        return heading


    def _generate_report(self, result):
        rows = []
        sortedResult = self.sortResult(result.result)
        for cid, (cls, cls_results) in enumerate(sortedResult):
            ## subtotal for a class
            np = nf = ne = 0
            for n,t,o,e in cls_results:
                if n == 0: np += 1
                elif n == 1: nf += 1
                else: ne += 1

            ## format class description
            if cls.__module__ == "__main__":
                name = cls.__name__
            else:
                name = "%s.%s" % (cls.__module__, cls.__name__)
            doc = cls.__doc__ and cls.__doc__.split("\n")[0] or ""
            desc = doc and '%s: %s' % (name, doc) or name

            row = self.REPORT_CLASS_TMPL % dict(
                style = ne > 0 and 'errorClass' or nf > 0 and 'failClass' or 'passClass',
                desc = desc,
                count = np+nf+ne,
                Pass = np,
                fail = nf,
                error = ne,
                cid = 'c%s' % (cid+1),
            )
            rows.append(row)

            for tid, (n,t,o,e) in enumerate(cls_results):
                self._generate_report_test(rows, cid, tid, n, t, o, e)

        report = self.REPORT_TMPL % dict(
            test_list = ''.join(rows),
            count = str(result.success_count+result.failure_count+result.error_count),
            Pass = str(result.success_count),
            fail = str(result.failure_count),
            error = str(result.error_count),
        )
        return report


    def _generate_report_test(self, rows, cid, tid, n, t, o, e):
        ## e.g. 'pt1.1', 'ft1.1', etc
        has_output = bool(o or e)
        tid = (n == 0 and 'p' or 'f') + 't%s.%s' % (cid+1,tid+1)
        name = t.id().split('.')[-1]
        doc = t.shortDescription() or ""
        desc = doc and ('%s: %s' % (name, doc)) or name
        tmpl = has_output and self.REPORT_TEST_WITH_OUTPUT_TMPL or self.REPORT_TEST_NO_OUTPUT_TMPL

        ## o and e should be byte string because they are collected from stdout and stderr?
        if isinstance(o,str):
            uo = e
            ## TODO: some problem with 'string_escape': it escape \n and mess up formating
            ## uo = unicode(o.encode('string_escape'))
            ## 2.7版本uo = o.decode('latin-1')
        else:
            uo = o
        if isinstance(e,str):
            ue = e
            ## TODO: some problem with 'string_escape': it escape \n and mess up formating
            ## ue = unicode(e.encode('string_escape'))
            ## 2.7 版本 ue = e.decode('latin-1')

        else:
            ue = e

        script = self.REPORT_TEST_OUTPUT_TMPL % dict(
            id = tid,
            output = saxutils.escape(uo+ue),
        )

        row = tmpl % dict(
            tid = tid,
            Class = (n == 0 and 'hiddenRow' or 'none'),
            style = n == 2 and 'errorCase' or (n == 1 and 'failCase' or 'none'),
            desc = desc,
            script = script,
            status = self.STATUS[n],
        )
        rows.append(row)
        if not has_output:
            return

    def _generate_ending(self):
        return self.ENDING_TMPL


##############################################################################
## Facilities for running tests from the command line
##############################################################################

## Note: Reuse unittest.TestProgram to launch test. In the future we may
## build our own launcher to support more specific command line
## parameters like test title, CSS, etc.
class TestProgm(unittest.TestProgram):
    """
    A variation of the unittest.TestProgram. Please refer to the base
    class for command line parameters.
    """
    def runTests(self):
        ## Pick HTMLTestRunner as the default test runner.
        ## base class's testRunner parameter is not useful because it means
        ## we have to instantiate HTMLTestRunner before we know self.verbosity.
        if self.testRunner is None:
            self.testRunner = HTMLTestRunner(verbosity=self.verbosity)
        unittest.TestProgram.runTests(self)

main = TestProgram

##############################################################################
## Executing this module from the command line
##############################################################################

if __name__ == "__main__":
    main(module=None)
```

##### 生成报告实例

第一步：首先新建一个`package`，命名为`report`，专门存放生成的测试报告。

第二步：编写代码：

```python
import unittest
import HTMLTestRunner

class HtmlDemo(unittest.TestCase):
    def setUp(self) -> None:
        pass
    def test_one(self):
        self.assertEqual(2+10,12)
    def test_two(self):
        self.assertEqual(10 + 150,160)
    def tearDown(self) -> None:
        pass
if __name__=='__main__':
    hd=HtmlDemo()
    suiteTest=unittest.TestSuite()
    suiteTest.addTest(HtmlDemo("test_one"))
    suiteTest.addTest(HtmlDemo("test_two"))

    filepath='report/htmlDemo.html'
    fp=open(filepath,'wb')

    runner=HTMLTestRunner.HTMLTestRunner(stream=fp,title='测试报告',description='我的第一个html测试报告')
    runner.run(suiteTest)

    fp.close()
```

生成的`HTML`报告如下：

![image-20200923133901170](python接口自动化.assets/image-20200923133901170.png)

解释：

- `stream`:测试报告写入文件的存储区域
- `title`:测试报告的主题
- `description`：测试报告的描述



#### 批量执行测试脚本

##### 第一步：创建一个清晰的项目结构

![image-20200923140510972](python接口自动化.assets/image-20200923140510972.png)

##### 第二步：编写多个测试`.py`脚本

`test01.py`

```python
import unittest
import requests

class Testqq(unittest.TestCase):
    def setUp(self) -> None:
        self.s=requests.Session()
        self.url='http://japi.juhe.cn/qqevaluate/qq'
    def test01(self):
        '''用例1：错误的key'''
        par={
            "key":"xxx",
            "qq":"283340479"
        }
        r=self.s.get(self.url,params=par)
        print("测试返回结果{}".format(r.text))
        #获取返回结果
        result=r.json()["reason"]
        #断言：
        try:
            self.assertTrue(result=="KEY ERROR!")
        except Exception:
            print("这个用例测试不能通过")

    def test02(self):
        '''用例1：正确的key'''
        par={
            "key":"8dbee1fcd8627fb6699bce7b986adc45",
            "qq":"283340479"
        }
        r=self.s.get(self.url,params=par)
        print("测试返回结果{}".format(r.text))
        #获取返回结果
        result=r.json()["reason"]
        #断言：
        try:
            self.assertTrue(result=="success")
        except Exception:
            print("这个用例测试不能通过")

    def test03(self):
        '''用例1：错误的qq请求参数'''
        par={
            "key":"8dbee1fcd8627fb6699bce7b986adc45",
            "qq":"22xx"
        }
        r=self.s.get(self.url,params=par)
        print("测试返回结果{}".format(r.text))
        #获取返回结果
        result=r.json()["reason"]
        print(type(result))
        print(result)
        print(result=="错误的请求参数")
        #断言：
        try:
            self.assertTrue(result=="错误的请求参数")
        except Exception:
            print("这个用例测试不能通过")

    def tearDown(self) -> None:
        self.s.close()

if __name__=='__main__':
    unittest.main()
```

这里提前讲一下断言的东西：使用断言时，**如果断言失败（不是运行失败）就会抛出异常**

![image-20200923151350068](python接口自动化.assets/image-20200923151350068.png)

所以，在建议用`try...except...`把断言包起来。观察其中一种断言的源代码，比如`unittest.assertTrue()`的源代码，我们也可以看到，确实回抛出异常：

![image-20200923151017158](python接口自动化.assets/image-20200923151017158.png)

`test02.py`：

```python
import unittest
import HTMLTestRunner

class HtmlDemo(unittest.TestCase):
    def setUp(self) -> None:
        pass
    def test_one(self):
        try:
            self.assertEqual(2+10,12)
        except Exception:
            print("断言失败")
    def test_two(self):
        try:
            self.assertEqual(10 + 150,160)
        except Exception:
            print("断言失败")
    def tearDown(self) -> None:
        pass
```

##### 第三步：编写主函数

`rum_main.py`：

```python
## coding=utf-8

import HTMLTestRunner
import unittest
import os

def addTests():
    basepath=os.path.realpath(os.path.dirname(__file__))
    case_dir=os.path.join(basepath,"testcases")
    suite=unittest.defaultTestLoader.discover(
        start_dir=case_dir,
        pattern='test*.py',
        top_level_dir=None
    )
    return suite


if __name__=='__main__':
    runner=unittest.TextTestRunner()
    runner.run(addTests())
```

解释：

![image-20200923155243641](python接口自动化.assets/image-20200923155243641.png)

#### unittest的assert断言

`unittest`模块包含的断言方法如下：

| Method                                                       | Checks that            | New in |
| :----------------------------------------------------------- | :--------------------- | :----: |
| [`assertEqual(a, b)`](https://docs.python.org/zh-cn/3.7/library/unittest.html#unittest.TestCase.assertEqual) | `a == b`               |        |
| [`assertNotEqual(a, b)`](https://docs.python.org/zh-cn/3.7/library/unittest.html#unittest.TestCase.assertNotEqual) | `a != b`               |        |
| [`assertTrue(x)`](https://docs.python.org/zh-cn/3.7/library/unittest.html#unittest.TestCase.assertTrue) | `bool(x) is True`      |        |
| [`assertFalse(x)`](https://docs.python.org/zh-cn/3.7/library/unittest.html#unittest.TestCase.assertFalse) | `bool(x) is False`     |        |
| [`assertIs(a, b)`](https://docs.python.org/zh-cn/3.7/library/unittest.html#unittest.TestCase.assertIs) | `a is b`               |  3.1   |
| [`assertIsNot(a, b)`](https://docs.python.org/zh-cn/3.7/library/unittest.html#unittest.TestCase.assertIsNot) | `a is not b`           |  3.1   |
| [`assertIsNone(x)`](https://docs.python.org/zh-cn/3.7/library/unittest.html#unittest.TestCase.assertIsNone) | `x is None`            |  3.1   |
| [`assertIsNotNone(x)`](https://docs.python.org/zh-cn/3.7/library/unittest.html#unittest.TestCase.assertIsNotNone) | `x is not None`        |  3.1   |
| [`assertIn(a, b)`](https://docs.python.org/zh-cn/3.7/library/unittest.html#unittest.TestCase.assertIn) | `a in b`               |  3.1   |
| [`assertNotIn(a, b)`](https://docs.python.org/zh-cn/3.7/library/unittest.html#unittest.TestCase.assertNotIn) | `a not in b`           |  3.1   |
| [`assertIsInstance(a, b)`](https://docs.python.org/zh-cn/3.7/library/unittest.html#unittest.TestCase.assertIsInstance) | `isinstance(a, b)`     |  3.2   |
| [`assertNotIsInstance(a, b)`](https://docs.python.org/zh-cn/3.7/library/unittest.html#unittest.TestCase.assertNotIsInstance) | `not isinstance(a, b)` |  3.2   |

新版本的方法：

| Method                                                       | Checks that                                                  | New in |
| :----------------------------------------------------------- | :----------------------------------------------------------- | :----- |
| [`assertRaises(exc, fun, *args, **kwds)`](https://docs.python.org/zh-cn/3.7/library/unittest.html#unittest.TestCase.assertRaises) | `fun(*args, **kwds)` raises *exc*                            |        |
| [`assertRaisesRegex(exc, r, fun, *args, **kwds)`](https://docs.python.org/zh-cn/3.7/library/unittest.html#unittest.TestCase.assertRaisesRegex) | `fun(*args, **kwds)` raises *exc* and the message matches regex *r* | 3.1    |
| [`assertWarns(warn, fun, *args, **kwds)`](https://docs.python.org/zh-cn/3.7/library/unittest.html#unittest.TestCase.assertWarns) | `fun(*args, **kwds)` raises *warn*                           | 3.2    |
| [`assertWarnsRegex(warn, r, fun, *args, **kwds)`](https://docs.python.org/zh-cn/3.7/library/unittest.html#unittest.TestCase.assertWarnsRegex) | `fun(*args, **kwds)` raises *warn* and the message matches regex *r* | 3.2    |
| [`assertLogs(logger, level)`](https://docs.python.org/zh-cn/3.7/library/unittest.html#unittest.TestCase.assertLogs) | The `with` block logs on *logger* with minimum *level*       | 3.4    |

### 测试框架（老师的）

### 数据驱动

#### ddt

`python` 的`unittest` 没有自带数据驱动功能。所以如果使用`unittest`，同时又想使用数据驱动，那么就可以使用`DDT`来完成。

一般进行接口测试时，每个接口的传参都不止一种情况，一般会考虑正向、逆向等多种组合。所以在测试一个接口时通常会编写多条`case`，而这些`case`除了传参不同外，其实并没什么区别。这个时候就可以利用`ddt`来管理测试数据，**提高代码复用率。**

使用方法：

```lua
ddt.ddt:	装饰类，装饰继承自unittest.TestCase的类
ddt.data:	装饰测试方法，参数是一系列的值
ddt.file_data:	装饰测试方法，参数是文件名，文件可以是json或者yaml类型
ddt.unpack:	传递的是复杂的数据结构时使用。比如使用元组或者列表，添加unpack之后，ddt会自动把元组或者列表对应到多个参数上。字典也可以这样处理。
```

##### 简单使用：直接放入数值

实例1：

```python
import requests
import unittest
import ddt

data=[
    {"user":"admin1","psw":"111111", "expect":False},
    {"user":"admin2","psw":"222222", "expect":True},
    {"user":"admin3","psw":"xxxxxx", "expect":False},
]
str1='hello'

@ddt.ddt
class Test1(unittest.TestCase):

    @ddt.data(*data)
    def test_01(self,testdata):
        print(testdata)

    @ddt.data(*str1)
    def test_02(self,testdata2):
        print(testdata2)

if __name__=='__main__':
    unittest.main()
```

运行结果为：

![image-20200923212924396](python接口自动化.assets/image-20200923212924396.png)





##### 放入复杂结构数据

```python
import unittest
import requests
import ddt

@ddt.ddt()
class Demo(unittest.TestCase):
    @ddt.data((3,2),(9,5),(6,3))
    @ddt.unpack
    def test01(self,first_value,second_value):
        self.assertTrue(first_value>second_value)

    @ddt.data([7,4],[9,2],[8,3])
    @ddt.unpack
    def test02(self,first_value,second_value):
        self.assertTrue(first_value>second_value)


    @ddt.data({"name":34,"age":21},
              {"name":54,"age":23})
    @ddt.unpack
    def test03(self,name,age):
        self.assertTrue(name>age)

if __name__=='__main__':
    suite=unittest.TestSuite
    suite.addTest(Demo('test02'))
    runner=unittest.TextTestRunner()
    runner.run(suite)
```

注意：使用测试套件`TestSuite`时而且脚本内容涉及到`ddt`时，建议不使用`python`正常环境运行，否则可能报错，建议使用`unittest in xxx`方式来运行脚本。

##### 案例：招生系统登录的数据驱动

```python
import ddt
import unittest
import requests
import re

s=requests.Session()

data=[
    {"user":"admin","psw":"660B8D2D5359FF6F94F8D3345698F88C", "expect":['退出登录']},
    {"user":"admin2","psw":"222222", "expect":[]},
    {"user":"admin3","psw":"xxxxxx", "expect":[]},
]
def login(username,password):
    url='http://192.168.239.135:8080/recruit.students/login/in'
    payload={
    "account":username,
    "pwd":password
    }
    return s.post(url,params=payload)


@ddt.ddt
class Test1(unittest.TestCase):
    def setUp(self) -> None:
        self.s=requests.Session()
    
    @ddt.data(*data)
    def test_1(self,testdata):
        print("本次测试数据为：{}".format(testdata))
        user=testdata["user"]
        pwd=testdata["psw"]
        login_r=login(username=user,password=pwd)
        login_r_text=print(re.findall("退出登录",login_r.text))
        expect=testdata["expect"]
        self.assertTrue(expect==expect)

    def tearDown(self) -> None:
        self.s.close()

if __name__=='__main__':
    unittest.main()
```





#### excel数据读写

`python`操作`excel`主要用到`xlrd`和`xlwt`这两个库，即`xlrd`是读`excel`，`xlwt`是写`excel`的库。

安装`xlrd`和`xlwt`模块：

```python
pip3 install xlrd -i http://pypi.douban.com/simple --trusted-host pypi.douban.com
pip3 install xlwt -i http://pypi.douban.com/simple --trusted-host pypi.douban.com
```

如果直接`pip install xlrd/xlwt`可能会报错，原因：可能资源在国外服务器，导致下载不下来，加上豆瓣，表示去豆瓣源上下载，较国外网址快一些

其他源地址：

- 1)http://mirrors.aliyun.com/pypi/simple/ 阿里云
- 2)[https://pypi.mirrors.ustc.edu.cn/simple/ ](https://pypi.mirrors.ustc.edu.cn/simple/ ) 中国科技大学
- 3) http://pypi.douban.com/simple/ 豆瓣
- 4) https://pypi.tuna.tsinghua.edu.cn/simple/ 清华大学
- 5) http://pypi.mirrors.ustc.edu.cn/simple/ 中国科学技术大学

##### 读取excel数据

实例：

手动在项目的`source package`下，建立一个`xlsx`文件，如下：

![image-20200924210110187](python接口自动化.assets/image-20200924210110187.png)

![image-20200924210023618](python接口自动化.assets/image-20200924210023618.png)

编写代码：

```python
import xlrd

if __name__=='__main__':
    #获取book
    book=xlrd.open_workbook(r'../source/test.xlsx')

    #获取book中的一个sheet,有以下3中方式：
    sheet=book.sheets()[0]
    sheet=book.sheet_by_index(0)
    sheet=book.sheet_by_name(u'Sheet1')  #u是unicode，在python3里已经有点多余了

    #获取book中存在的所有sheet的名称
    names=book.sheet_names()
    print(names)

    #获取sheet有数据的行和列数
    nrows=sheet.nrows
    ncols=sheet.ncols

    ## 获取sheet中的某行或者某列,以列表的形式返回
    print(sheet.row_values(0))  #第一行
    print(sheet.col_values(0))  #第一列

    #获取sheet中某个单元格的数据
    print(sheet.cell_value(1,1))
```

运行结果为：

![image-20200924211627700](python接口自动化.assets/image-20200924211627700.png)

注意：在`pycharm`，如果使用`if __name__=='__main__'`来运行，那么相对路径最好有使用`..`或`.`，否则会报错:

![image-20200924212345046](python接口自动化.assets/image-20200924212345046.png)

如果是单独运行，一条条语句的运行，貌似按下面这样就可以了：

![image-20200924212449673](python接口自动化.assets/image-20200924212449673.png)

##### excel读取封装

下面封装`excel`的读取操作，将第一行作为key，将第2,3,4....行作为value，并封装到字典中，再将字典封装到列表中，如：

![image-20200925101929376](python接口自动化.assets/image-20200925101929376.png)

最终的实现效果是：

```python
[{'name': 'Jimmy', 'age': 18.0, 'sex': 'male'}, {'name': 'krystal', 'age': 15.0, 'sex': 'female'}, {'name': 'Jack', 'age': 23.0, 'sex': 'male'}]
```

代码实现：

```python
## coding=utf-8

import xlrd

class ExcelUtil():
    def __init__(self,excelPath,sheetName='Sheet1'):
        self.book=xlrd.open_workbook(excelPath)
        self.sheet_t=self.book.sheet_by_name(sheetName)
        #获取第一行作为key值
        self.keys=self.sheet_t.row_values(0)
        #获取总行数
        self.rowNum=self.sheet_t.nrows
        #获取总列数
        self.colNum=self.sheet_t.ncols

    def dict_data(self):
        if self.rowNum<2:
            print("总行数小于2")
        else:
            r=[]
            j=1
            for i in range(self.rowNum-1):
                s={}
                #从第二行取对应的values值
                values=self.sheet_t.row_values(j)
                for x in range(self.colNum):
                    s[self.keys[x]]=values[x]   #写入字典中
                r.append(s)  #将字典追加到列表中
                j+=1
            return r

if __name__=='__main__':
    excelPath="../source/test.xlsx"
    sheetName="Sheet1"
    myexcel=ExcelUtil(excelPath,sheetName=sheetName)
    print(myexcel.dict_data())
```

运行结果为：

![image-20200925102259115](python接口自动化.assets/image-20200925102259115.png)

##### 往excel写入数据

![image-20200925103459909](python接口自动化.assets/image-20200925103459909.png)

#### excel与ddt结合

准备`excel`表格`excelDDT.xlsx`：

![image-20200925120745255](python接口自动化.assets/image-20200925120745255.png)

需求：将`excel`的数据转为字典，并用列表包起来，然后使用，进行招生系统的登录。

代码实现：

```python
import requests
import xlrd
import ddt
import unittest
from tests import excelDemo2
import re

myexcel=excelDemo2.ExcelUtil('../source/excelDDT.xlsx','Sheet1')
data=myexcel.dict_data()


@ddt.ddt
class excelddt(unittest.TestCase):
    def __int__(self):
        pass
    def setUp(self) -> None:
        self.s=requests.session()
    def login(self,account,pwd):
        login_url='http://192.168.239.135:8080/recruit.students/login/in'
        payload={
        'account':account,
        'pwd' : pwd
        }
        return self.s.get(login_url,params=payload)

    @ddt.data(*data)
    def test_0(self,testdata):
        print("本次测试数据为：{}".format(testdata))
        user=testdata['user']
        pwd=testdata['psw']
        login_r=self.login(user,pwd)
        try:
            expect=str(re.findall('退出登录',login_r.text)[0])
        except Exception:
            expect=''
        self.assertTrue(expect==testdata['expect'])
        

if __name__=='__main__':
    unittest.main()

```

### 操作mysql

安装`pymysql`:`pip install pymysql`

常用对象：

- `Connection`：代表一个与`MySQL Server`的`socket`连接，使用`connect`方法来创建一个连接实例。
- `Cursor`：代表一个与`MySQL`数据库交互对象，使用`Connection.Cursor()`在当前`socket`连接上的交互对象。

`Connection`对象常用的`API`:

```lua
connect()   创建一个数据库连接实例  
begin()     开始一个事务  
close()     发送一个退出消息，并关闭连接  
commit()    提交修改至数据库  
cursor()    创建一个cursor(游标)实例  
ping()      检测服务器是否在运行  
rollback()  	回滚当前事务  
select_db(db)   设置当前db  
show_warnings() 	显示警告信息
```

`Cursor`对象常用`API`：

```lua
close()     关闭当前cursor
execute()   执行一个sql语句
executemany()   执行批量sql语句
fetchall()      取所有数据
fetchone()      取一条数据
```

#### 插入、查询、删除操作

新建`database`：

```python
create database pymysql;
use pymysql;
create table users(
	id int primary key,
	name varchar(10)
)
```

代码：

![image-20200927105032903](python接口自动化.assets/image-20200927105032903.png)

解释：

- `cursor.fetchone()`，获取一行数据，为元组类型
- `cursor.fetchall()`，获取所有行的数据，为元组类型，元组里面包含元组，一个元组代表一样数据

```python
import pymysql
import random

class MysqlDemo:
    def __init__(self):
        pass

    def get_conn(self):
        conn=pymysql.connect(
            host="192.168.239.137",
            port=3306,
            user="root",
            password="krystal",
            db="pymysql",
            charset="utf8"
        )
        return conn


if __name__=='__main__':
    #获取cursor游标
    conn=MysqlDemo().get_conn()
    cursor=conn.cursor()

    #插入数据：
    sql1='insert into `users`(id,name) values(1,"jimmy"),(2,"krystal")'
    cursor.execute(sql1)

    #插入多条数据：
    sql2='insert into `users`(id,name) values(%s,%s)'
    sql2_data=[]

    for i in range(3,10):
        name="".join(random.sample('asdfghjklzxcvbnmqwertuyiop',5))
        id=i
        sql2_data.append((i,name))  ## 封装为元组，并追加到列表中
        print(sql2_data)
    cursor.executemany(sql2,sql2_data)

    #查询数据
    sql3='select * from users limit 3'
    cursor.execute(sql3)
    data1=cursor.fetchone()  #获取一条数据,为元组类型
    data2=cursor.fetchall()  #获取所有数据，为元组类型，元组包含元组
    
    print("name:{},id:{}".format(data1[0],data1[1]))

    for row in data2:
        name=row[0]
        id=row[1]
        print("name:{},id:{}".format(name, id))


    conn.commit()
    cursor.close()
    conn.close()
```

#### 别人的mysql工具类封装

![image-20200927172148189](python接口自动化.assets/image-20200927172148189.png)

```python
import pymysql
from warnings import filterwarnings

## 忽略Mysql告警信息
filterwarnings("ignore", category=pymysql.Warning)


class MysqlDb:

    def __init__(self):
        ## 建立数据库连接
        self.conn = pymysql.connect("192.168.239.137", "root", "krystal", "pymysql")

        ## 使用 cursor 方法获取操作游标，得到一个可以执行sql语句，并且操作结果作为字典返回的游标
        self.cur = self.conn.cursor(cursor=pymysql.cursors.DictCursor)

    def __del__(self):
        ## 关闭游标
        self.cur.close()
        ## 关闭连接
        self.conn.close()

    def query(self, sql, state="all"):
        """
        查询
        :param sql:
        :param state: all是默认查询全部
        :return:
        """
        self.cur.execute(sql)

        if state == "all":
            ## 查询全部
            data = self.cur.fetchall()
        else:
            ## 查询单条
            data = self.cur.fetchone()
        return data

    def execute(self, sql):
        """
        更新、删除、新增
        :param sql:
        :return:
        """
        try:
            ## 使用execute操作sql
            rows = self.cur.execute(sql)
            ## 提交事务
            self.conn.commit()
            return rows
        except Exception as e:
            print("数据库操作异常 {0}".format(e))
            ## 回滚修改
            self.conn.rollback()


if __name__ == '__main__':
    mydb = MysqlDb()
    r = mydb.query("select * from `users`","all")
    print(r)
    mydb.execute("insert into `users` (`id`,`name`) values(0,'bob')")
    print(r)

```



### 发送邮件

![image-20200927132345181](python接口自动化.assets/image-20200927132345181.png)

```python
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart   #如果要添加附件，必须使用MIMEMultipart
from email.header import Header

#smtpserver,port,sender,receivers,sender_password
def sendEmail(smtpserver,port,sender,receivers,sender_password):
    message=MIMEMultipart()

    message.attach(MIMEText('发送邮件测试','plain','utf-8'))
    message['From']=Header("Jimmy",'utf-8')
    message['To']=Header('测试','utf-8')

    subject='python smtp 邮件测试'
    message['Subject']=Header(subject,'utf-8')

    #添加附件1：
    att1=MIMEText(open('../sources/runoob1.txt','rb').read(),'base64','utf-8')
    att1['Content-Type']='application/octet-stream'
    att1['Content-Disposition']='attachment; filename=runoob1.txt'
    message.attach(att1)

    #添加附件2：
    att1=MIMEText(open('../sources/runoob2.txt','rb').read(),'base64','utf-8')
    att1['Content-Type']='application/octet-stream'
    att1['Content-Disposition']='attachment;filename=runoob2.txt'
    message.attach(att1)

    try:
        smtpObj=smtplib.SMTP_SSL(smtpserver,port)
        smtpObj.login(sender,sender_password)
        smtpObj.sendmail(sender,receivers,message.as_string())
        smtpObj.quit()
        print("邮件发送成功")
    except smtplib.SMTPException:
        print("Error:无法发送邮件")


if __name__=='__main__':
    sender='974643517@qq.com'
    receivers=['974643517@qq.com']
    sendEmail("smtp.qq.com",465,sender,receivers,"gofyiuzkjzlzbdic")

```

运行结果如下：

![image-20200927140542300](python接口自动化.assets/image-20200927140542300.png)

![image-20200927115731196](python接口自动化.assets/image-20200927115731196.png)



### 我自己的项目

下面的这个项目框架，以后可在此基础上修改完善使用：

![image-20200927144414901](python接口自动化.assets/image-20200927144414901.png)

### 项目部署到Jenkins

1、开启`tomcat`：双击`startup.bat`文件。

2、登录`Jenkins`

3、创建自由风格任务`item`：

![image-20200927151436114](python接口自动化.assets/image-20200927151436114.png)

4、设置触发器：

![image-20200927151521007](python接口自动化.assets/image-20200927151521007.png)

5、设置构建：`Execute Windows batch command`，运行项目的主函数

![image-20200927151629495](python接口自动化.assets/image-20200927151629495.png)

6、查看控制台输出：

![image-20200927151213939](python接口自动化.assets/image-20200927151213939.png)

####  注意事项

1、部署到`Jenkins`的项目，项目凡是用到路径的地方，最好都用绝对路径，否则会报错（或者**使用函数获取路径并拼接**）

使用绝对路径：

![image-20200927152358945](python接口自动化.assets/image-20200927152358945.png)

函数获取路径，然后拼接：

![image-20200928160338662](python接口自动化.assets/image-20200928160338662.png)

### 上传python项目到Github

####  第一步：windows安装git

`windows`安装`git`，下载地址：[https://](https://git-scm.com/download/win)[git-scm.com/download/win](https://git-scm.com/download/win)

安装好后，打开`git bash`：

![image-20200928112210959](python接口自动化.assets/image-20200928112210959.png)

![image-20200928112134468](python接口自动化.assets/image-20200928112134468.png)

#### 第二步：github上新建一个库



![image-20200928111505259](python接口自动化.assets/image-20200928111505259.png)

![image-20200928111851166](python接口自动化.assets/image-20200928111851166.png)

#### 第三步：新建配置本地仓库

创建本地仓库：

![image-20200928112421407](python接口自动化.assets/image-20200928112421407.png)

![image-20200928112552606](python接口自动化.assets/image-20200928112552606.png)

初始化：（记得在`gitrepo`目录）

![image-20200928112647563](python接口自动化.assets/image-20200928112647563.png)

查看状态：

![image-20200928112734211](python接口自动化.assets/image-20200928112734211.png)

配置本地仓库的用户名和邮箱：

![image-20200928113157020](python接口自动化.assets/image-20200928113157020.png)

给`github`的远程仓库去别名：

![image-20200928113308857](python接口自动化.assets/image-20200928113308857.png)

#### 第四步：同步项目到github

![image-20200928114517112](python接口自动化.assets/image-20200928114517112.png)

提交：

![image-20200928114648758](python接口自动化.assets/image-20200928114648758.png)

推送（会弹出`github`登录界面）：

![image-20200928114949207](python接口自动化.assets/image-20200928114949207.png)

![image-20200928114841675](python接口自动化.assets/image-20200928114841675.png)

![image-20200928114904393](python接口自动化.assets/image-20200928114904393.png)

![image-20200928114929900](python接口自动化.assets/image-20200928114929900.png)

第五步：`github`上查看实际效果

![image-20200928115051428](python接口自动化.assets/image-20200928115051428.png)

#### 补充：从github clone项目到windows

1、生成`ssh`公钥和秘钥：

```python
ssh-keygen -t rsa 一路回车即可
```

![image-20200928143856500](python接口自动化.assets/image-20200928143856500.png)

2、将`id_rsa.pub`公钥的内容复制到`github`上面：

![image-20200928144242919](python接口自动化.assets/image-20200928144242919.png)

![image-20200928144204343](python接口自动化.assets/image-20200928144204343.png)

3、开始`clone`:

```sh
git clone xxx
```

![image-20200928144446601](python接口自动化.assets/image-20200928144446601.png)

![image-20200928144406722](python接口自动化.assets/image-20200928144406722.png)

