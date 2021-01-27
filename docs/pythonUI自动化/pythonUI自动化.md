## python UI自动化

### 环境准备

```python
pip install selenium
```

`selenium`学习官方文档：https://selenium-python.readthedocs.io/

`selenium Driver`下载链接：

> `Chrome`： http://chromedriver.storage.googleapis.com/index.html
>
> 不同的`Chrome`的版本对应的`chromedriver.exe` 版本也不一样，下载时不要搞错了。如果是最新的`Chrome`, 下载最新的`chromedriver.exe` 就可以了。把`chromedriver`的路径也加到环境变量里。
>
> `Firefox`：https://github.com/mozilla/geckodriver/releases/
>
> 根据自己的操作系统下载对应的驱动即可，使用的话，需要把驱动的路径和火狐浏览器的路径加入到环境变量里面才可以
>
> `IE`：http://selenium-release.storage.googleapis.com/index.html
>
> 根据自己`selenium`版本下载对应版本的驱动即可，`python`的话，下载里面的`IEDriverServerxxx.zip`即可

1、下载并安装一个`google`浏览器（https://www.google.cn/chrome/），不要安装下面这种谷歌浏览器：

![image-20200927163332872](pythonUI自动化.assets/image-20200927163332872.png)

2、查看谷歌浏览器的版本：

![image-20200927163446759](pythonUI自动化.assets/image-20200927163446759.png)

3、下载跟`google`浏览器版本对应的`google driver`驱动器：

![image-20200927163551869](pythonUI自动化.assets/image-20200927163551869.png)

![image-20200927163537817](pythonUI自动化.assets/image-20200927163537817.png)

4、将下载好的`driver`驱动器放到`python`的安装目录，并解压：

![image-20200927163655761](pythonUI自动化.assets/image-20200927163655761.png)

5、测试一下能不能用`google`浏览器打开`pycharm`里面的`html`文件：

![image-20200927163903930](pythonUI自动化.assets/image-20200927163903930.png)

6、写一个简单的代码：

```python
from selenium import webdriver
import time

browser = webdriver.Chrome()
res = browser.get('http://www.baidu.com')
browser.quit()
```

7、出现下面效果时，就代表环境搭好了：

![image-20200927164222967](pythonUI自动化.assets/image-20200927164222967.png)



### 定位元素

定位的方法如下：

![image-20200928093632483](pythonUI自动化.assets/image-20200928093632483.png)

![image-20200928100813002](pythonUI自动化.assets/image-20200928100813002.png)

### 元素的操作方法

```python
from selenium import webdriver
import time

显性等待 导入库
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

开始会话
driver = webdriver.Chrome()

隐性等待 全局有效,从打开到关闭
driver.implicitly_wait(30)

访问一个地址
driver.get("http://www.baidu.com")

全屏
driver.maximize_window() 全屏
driver.set_window_size(1000,800) 键入宽高

后退
driver.back()

前进
driver.forward()

刷新
driver.refresh()

获取窗口标题
print(driver.title)

获取当前窗口的URL
print(driver.current_url)

获取当前窗口的句柄
print(driver.current_window_handle)
元素四大操作:click(),send_keys(),get_attribute(),text

获取属性值get_attribute()
value = driver.find_element_by_id("su").get_attribute("value")

获取文本内容
text = driver.find_element_by_xpath('//a[@name="tj_trnews"]').text
print(text)

点击按钮
driver.find_element_by_xpath('//div[@id="u1"]/a[@name="tj_login"]').click()

输入文本内容
driver.find_element_by_id('TANGRAM__PSP_10__userName').send_keys('1893285458')


关闭浏览器当前正在使用的窗口
driver.close()

关闭整个浏览器会话
driver.quit()



键盘事件：
from selenium.webdriver.common.keys import Keys
send_keys(Keys.BACK_SPACE) 删除键（BackSpace）
send_keys(Keys.SPACE) 空格键(Space)
send_keys(Keys.TAB) 制表键(Tab)
send_keys(Keys.ESCAPE) 回退键（Esc）
send_keys(Keys.ENTER) 回车键（Enter）
send_keys(Keys.CONTROL,'a') 全选（Ctrl+A）
send_keys(Keys.CONTROL,'c') 复制（Ctrl+C）
send_keys(Keys.CONTROL,'x') 剪切（Ctrl+X）
send_keys(Keys.CONTROL,'v') 粘贴（Ctrl+V）
send_keys(Keys.F1) 键盘F1
Send_keys(Keys.F5)键盘F5
send_keys(Keys.F12) 键盘F12
```

### 定位练习

百度搜索：

```python
from selenium import webdriver
import time

if __name__=='__main__':
    driver=webdriver.Chrome()
    driver.get('https://www.baidu.com')
    time.sleep(3)
    driver.find_element_by_id("kw").send_keys('nba')
    driver.find_element_by_id("su").click()
    time.sleep(3)
    driver.quit()
```

![image-20200928104005602](pythonUI自动化.assets/image-20200928104005602.png)

![image-20200928104019362](pythonUI自动化.assets/image-20200928104019362.png)
