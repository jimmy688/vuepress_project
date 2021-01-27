
## 认识cypress

cypress相关文档：

- [cypress官方文档](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Cypress-Can-Be-Simple-Sometimes)

cypress能干什么：

- End to End test 
- Integration tests
- Unit tests

> e2e test的一个理解：站在**用户角度**的测试，把我们的程序当成一个黑盒子，不管内部是怎么实现的，我只负责打开浏览器，把测试内容在页面上输入一遍，看是不是我想要得到的结果。

cypress可以测试任何能在浏览器运行的东西。

cypress提供了两个服务（组件），分别是Test  Runner测试运行器和Dashboard，来帮助我们记录测试。

cypress的特点：

- 为运行的测试记录快照
- 报错时，错误可读性很强，帮助提高调试的速度
- 不需要在测试代码中添加等待或者睡眠。（有自己的[重试和超时机制]()）
- 不需要使用Selenium或者驱动，更加快速和可靠。
- cypress与应用程序运行在同一个循环中，而大多数测试工具（如Selenium）都是通过在浏览器外部运行并在网络上执行远程命令来操作的。
- 能够[记录操作截图和视频](Selenium or WebDriver)
- 完美[运行在持续集成pipeline中](https://docs.cypress.io/guides/guides/cross-browser-testing.html#Continuous-Integration-Strategies)。

> Cypress最终从上到下控制整个自动化过程，这使它处于一个独特的位置，能够理解浏览器内外发生的一切。这意味着Cypress能够提供比任何其他测试工具更一致和准确的结果。[链接](https://docs.cypress.io/guides/overview/key-differences.html#Architecture)

![image-20201218000023216](cypress.assets/image-20201218000023216.png)



### cypress的超时和重试机制

如果使用jQuery来去定位元素时，可能是这样的：

```js
// 定位获取元素
const $myElement = $('.element').first()

// 设置判断条件，如果元素找到了，才做什么。。。。
if ($myElement.length) {
  doSomething($myElement)
}
```

而cypress中处理找不到元素问题的方式是**自动重试**机制。

cypress会自动重试，直到**元素被找到**或者**达到超时时间**（默认为4秒）。比如：

```js
cy.get('#element').then(($myElement) => {
    doSomething($myElement)
});
// cy.get()会重复去找元素#element,直到找到或超时
```

自动重试机制使得cypress更加健壮，可以避免一些查找元素失败的情况，如：

- DOM未加载
- XHR请求没有响应
- 动画未完成
- 等等。。

> 可以通过[参数defaultCommandTimeout]来修改[重试的超时时间](https://docs.cypress.io/guides/references/configuration.html#Timeouts)。

### cypress的持续集成策略

cypress可以运行在多种浏览器中：

- [Canary](https://www.google.com/chrome/browser/canary.html)
- [Chrome](https://www.google.com/chrome/browser/desktop/index.html)
- [Chromium](https://www.chromium.org/Home)
- [Edge](https://www.microsoft.com/edge)
- [Edge Beta](https://www.microsoftedgeinsider.com/download)
- [Edge Canary](https://www.microsoftedgeinsider.com/download)
- [Edge Dev](https://www.microsoftedgeinsider.com/download)
- [Electron](https://electron.atom.io/)  **无头浏览器**
- [Firefox](https://www.mozilla.org/firefox/)
- [Firefox Developer Edition](https://www.mozilla.org/firefox/developer/)
- [Firefox Nightly](https://www.mozilla.org/firefox/nightly/)

可以通过`--browser`选项来指定cypress的运行浏览器：

```sh
cypress run --browser chrome
cypress run --browser firefox
```

> 使用cypress run命令来运行时，默认使用Electron无头浏览器来运行。

可以通过**npm sripts**来设定运行的快捷键：

```js
"scripts": {
  "cy:run:chrome": "cypress run --browser chrome",
  "cy:run:firefox": "cypress run --browser firefox"
}
```

https://docs.cypress.io/guides/guides/cross-browser-testing.html#Continuous-Integration-Strategies

## cypress的安装

[安装cypress点击此处](https://docs.cypress.io/guides/getting-started/installing-cypress.html#System-requirements)

- cypress支持mac os, windows, linux系统。

- 如果使用npm来安装，需要使用Node.js 10或者 12和以上的版本。

- 使用在linux中安装，需要一些依赖：

  ```sh
  apt-get install libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb
  ```

  ```sh
  yum install -y xorg-x11-server-Xvfb gtk2-devel gtk3-devel libnotify-devel GConf2 nss libXScrnSaver alsa-lib
  ```

**1、通过npm安装。**

```
cd /your/project/path
```

```sh
npm init

#修改当前目录的package.json文件，添加执行脚本
{
  "scripts": {
    "cypress:open": "cypress open"
  }
}


npm install cypress --save-dev
npm run cypress:open
```

**2、通过yarn直接安装**

```
cd /your/project/path
```

```
yarn add cypress --dev
```

3、**直接下载安装包安装**

[download Cypress directly from our CDN](https://download.cypress.io/desktop).



## cypress的默认文件结构

使用`npm rum cypress`命令首次打开cypress，cypress会自动地初始化配置并生成一个**默认的[文件夹结构](https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests.html#Folder-Structure)**：

```sh
/cypress
  /fixtures 
    - example.json

  /integration
    /examples
      - actions.spec.js
      - aliasing.spec.js
      
  /plugins
    - index.js

  /support
    - commands.js
    - index.js
```

### fixtures

**简介**

- 测试夹具通常配合 `cy.fixture()` 使用
- 主要用来**存储**测试用例的**外部静态数据**，静态数据通常存储在 .json 文件中
- `fixtures` 默认就在 `cypress/fixtures` 目录下，但也可以配置到另一个目录

### integration

测试文件就是**测试用例**，默认位于 **cypress/integration** ，但也可以配置到另一个目录

**测试文件格式**：所有在 integration 文件下，且文件格式是以下的文件都将被 Cypress 识别为测试文件

-  `.js` ：普通的`JavaScript` 编写的文件**【最常用】**
-  `.jsx` ：带有扩展的 `JavaScript` 文件，其中可以包含处理 `XML` 的 `ECMAScript`
-  `.coffee` ：一套 `JavaScript` 转译的语言。有更严格的语法
-  `.cjsx` ：`CoffeeScript` 中的 `jsx` 文件

创建好后，`Cypress` 的 `Test Runner` 刷新之后就可以看到对应测试文件了

### plugins

- Cypress 独有优点就是**测试代码运行在浏览器之内**，使得 Cypress 跟其他的测试框架相比，有显著的架构优势
- 这优点虽然提供了可靠性测试，但也使得和在浏览器之外进行通信更加困难**【痛点：和外部通信困难】**

**插件文件的诞生**

- `Cypress` 为了解决上述痛点提供了一些现成的插件，使你可以**修改或扩展 Cypress 的内部行为**（如：动态修改配置信息和环境变量等），也可以自定义自己的插件
- 默认情况，插件位于 `cypress/plugins/index.js` 中，但可以配置到另一个目录
- 为了方便，每个**测试文件运行之前**，`Cypress` 都会**自动加载插件文件** `cypress/plugins/index.js` 

**插件的应用场景**　　

- 动态更改来自 cypress.json，cypress.env.json，CLI或系统环境变量的**已解析配置和环境变量**
- 修改特定浏览器的启动参数
- 将消息直接从测试代码传递到后端

### support

- 支持文件目录是放置可重用配置项，如**==底层通用函数或全局默认配置==** 
- 支持文件默认位于 `cypress/support/index.js` 中，但可以配置到另一个目录
- 为了方便，每个**测试文件运行之前**，`Cypress` 都会**自动加载支持文件** `cypress/support/index.js` 



## 测试用例文件的编写

借鉴于mocha。

```js
// -- Start: Our Cypress Tests --
describe('Unit test our math functions', () => {
  context('math', () => {
    it('can add numbers', () => {
      expect(add(1, 2)).to.eq(3)
    })

    it('can subtract numbers', () => {
      expect(subtract(5, 12)).to.eq(-7)
    })

    specify('can divide numbers', () => {
      expect(divide(27, 9)).to.eq(3)
    })

    specify('can multiply numbers', () => {
      expect(multiply(5, 4)).to.eq(20)
    })
  })
})
// -- End: Our Cypress Tests --
```

hooks：控制用例执行的前置和后置的操作。

```js
beforeEach(() => {
  // root-level hook
  // runs before every test
})

describe('Hooks', () => {
  before(() => {
    // runs once before all tests in the block
  })

  beforeEach(() => {
    // runs before each test in the block
  })

  afterEach(() => {
    // runs after each test in the block
  })

  after(() => {
    // runs once after all tests in the block
  })
})
```

`.only`与`.skip`，帮助我们仅运行或者跳过某条用例。

```js
  it.only('returns "fizz" when number is multiple of 3', () => {
    numsExpectedToEq([9, 12, 18], 'fizz')
  })
  
  it('returns "buzz" when number is multiple of 5', () => {
    numsExpectedToEq([10, 20, 25], 'buzz')
  })
```

```js
it.skip('returns "fizz" when number is multiple of 3', () => {
  numsExpectedToEq([9, 12, 18], 'fizz')
})
```

结合`javascript`代码来**动态的生成多个测试**：

```js
describe('if your app uses jQuery', () => {
  ['mouseover', 'mouseout', 'mouseenter', 'mouseleave'].forEach((event) => {
    it('triggers event: ' + event, () => {
      cy
        .get('#with-jquery').invoke('trigger', event)
        .get('#messages').should('contain', 'the event ' + event + 'was fired')
    })
  })
})
```



## 断言

https://docs.cypress.io/guides/references/assertions.html#Chai

cypress集成了 [Chai](https://docs.cypress.io/guides/references/assertions.html#Chai)断言库。

**常用的断言：**

**Length**

```javascript
// retry until we find 3 matching <li.selected>
cy.get('li.selected').should('have.length', 3)
```

**Class**

```javascript
// retry until this input does not have class disabled
cy.get('form').find('input').should('not.have.class', 'disabled')
```

**Value**

```javascript
// retry until this textarea has the correct value
cy.get('textarea').should('have.value', 'foo bar baz')
```

**Text Content**

```javascript
// retry until this span does not contain 'click me'
cy.get('a').parent('span.help').should('not.contain', 'click me')
```

**Visibility**

```javascript
// retry until this button is visible
cy.get('button').should('be.visible')
```

**Existence**

```javascript
// retry until loading spinner no longer exists
cy.get('#loading').should('not.exist')
```

**State**

```javascript
// retry until our radio is checked
cy.get(':radio').should('be.checked')
```

**CSS**

```javascript
// retry until .completed has matching css
cy.get('.completed').should('have.css', 'text-decoration', 'line-through')
// retry while .accordion css has the "display: none" property
cy.get('#accordion').should('not.have.css', 'display', 'none')
```

**多个断言**   https://docs.cypress.io/guides/core-concepts/retry-ability.html#Multiple-assertions

```js
cy.get('.todo-list li')     // command
  .should('have.length', 2) // assertion
  .and(($li) => {
    // 2 more assertions
    expect($li.get(0).textContent, 'first item').to.equal('todo a')
    expect($li.get(1).textContent, 'second item').to.equal('todo B')
  })
```



## 定位元素

cypress跟jQuery的定位元素方法很像，而且cypress集成了jQuery，可以使用jQuery的方法来定位和操控元素。

1、使用cypress定位元素：

```js
cy.get('#main-content')
  .find('.article')
  .children('img[src^="/static"]')
  .first()
```

2、使用cypress[集成的jQuery](https://docs.cypress.io/api/utilities/$.html#Syntax)来定位元素：

```js
语法：
	Cypress.$(selector)
例子：
    Cypress.$('p')
    const $li = Cypress.$('ul li:first')
```

定位元素的优先级：

```
<button id="main" class="btn btn-large" name="submission"
  role="button" data-cy="submit">Submit</button>
```

| Selector                              | Recommended |
| ------------------------------------- | ----------- |
| `cy.get('button').click()`            | 尽量不使用  |
| `cy.get('.btn.btn-large').click()`    | 尽量不使用  |
| `cy.get('#main').click()`             | 少量使用    |
| `cy.get('[name=submission]').click()` | 少量使用    |
| `cy.contains('Submit').click()`       | Depends     |
| `cy.get('[data-cy=submit]').click()`  | Always      |



## 插件

一般来说，所有的测试代码，cypress的命令等都是运行在浏览器上的，但是cypress也是一个插件可以使用的Node进程。

我们可以写自己的自定义代码然后在cypress特定的生命周期中去执行。

### 使用场景

#### [配置](https://docs.cypress.io/api/plugins/configuration-api.html)

通过插件，可以使用编程的方式来修改已解析的配置和环境变量。

已解析的配置和环境变量：来自于配置文件（默认为cypress.json）,cypress.env.json，命令行，或者系统环境变量）。

利用插件，可以：

- 使用具有不同配置的多个环境
- 基于环境来交换环境变量
- 使用内置的fs库来读入配置文件
- 更改用于测试的浏览器列表
- 在yml中写配置

#### [预处理程序](https://docs.cypress.io/api/plugins/preprocessors-api.html)

`file:preprocessor` event 可用于自定义测试代码传输和发送到浏览器的方式。

默认情况下，Cypress支持ES2015+、TypeScript和CoffeeScript，使用webpack为浏览器打包。

可使用`file:preprocessor`来进行：

- 添加最新的ES* 支持。
- 使用ClojureScript来编写测试代码。
- 自定义Babel设置以添加自己的插件。
- 自定义编译TypeScript的选项。
- 把网页包换成Browserify或其他任何东西。

#### [浏览器运行](https://docs.cypress.io/api/plugins/browser-launch-api.html) 

`before:browser:launch` event 可用于为每个特别的浏览器修改运行时的参数，如：

- 加载一个Chrome扩展（插件）
- 启用或禁用实验chrome的一个功能
- 控制chrome加载的组件

#### [截图处理](https://docs.cypress.io/api/plugins/after-screenshot-api.html)

 `after:screenshot` event在截图保存到磁盘后会被调用，利用该event可以：

- 保存截图的相关详细信息
- 重命名截图
- 对截图进行缩放、裁剪等操作



### 插件安装

可以通过 npm install 命令来安装以下链接里的插件：[cypress插件](https://docs.cypress.io/plugins/index.html)

```shell
npm install <plugin name> --save-dev
```

### 插件使用

无论是通过npm install方式安装插件还是自己用代码写一个插件，都需要在`cypress/plugins/index.js`文件中export导出一个函数，cypress会调用这个函数，传送你的项目的配置。

```javascript
// export a function
module.exports = (on, config) => {
  // bind to the event we care about
  on('<event>', (arg1, arg2) => {
    // plugin stuff here
  })
}
```

### 自己定义插件

首先，`cypress/plugins/index.js`必须通过下面格式export导出一个函数：

```javascript
// export a function
module.exports = (on, config) => {
  // configure plugins here
}
```

这个函数在cypress运行的时候会被调用，函数将会接受两个参数： `on` 和`config`。

函数可以返回一个同步函数，也可以返回一个Promise，直到它解决为止。这样，就能够在导出的函数中执行异步操作，例如从文件系统读入文件。

如果返回或解析一个对象，那么Cypress将把这个对象合并到config中，这样就可以覆盖配置或环境变量。

> 一个模块就是一个独立的文件， 文件内部的所有变量，外部无法获取，export关键字用于暴露数据，**暴露给其它模块**。

#### on

`on`是一个函数，用来为不同的导出的事件event注册监听器。对一个event注册监听的格式如下：

```javascript
module.exports = (on, config) => {
  on('<event>', (arg1, arg2) => {
    // plugin stuff here
  })
}
```

#### config

`config`是一个已解析的cypress配置，这个配置包含项目中所有被传入到浏览器中的值。

[有关所有配置值的综合列表，可以参阅此处。](https://github.com/cypress-io/cypress/blob/master/packages/server/lib/config.js)

一些插件可能需要用到这些值，

一些插件可能会使用这些值，从而可以根据配置执行某些操作。

可以通过编程方式修改这些值，然后能够根据运行环境之类的东西交换配置。



### [通过插件修改配置](https://docs.cypress.io/api/plugins/configuration-api.html)

想要修改配置，需要从插件文件导出的函数中返回一个对象，如下：

```javascript
// cypress/plugins/index.js
module.exports = (on, config) => {
  console.log(config) // see what all is in here!

  // modify config values
  config.defaultCommandTimeout = 10000
  config.baseUrl = 'https://staging.acme.com'

  // modify env var value
  config.env.ENVIRONMENT = 'staging'

  // return config
  return config
}
```

**如果没有返回对象，配置不会被修改。**

已解析的值会展示在测试运行器的”设置“选项卡中：

![Resolved configuration in the Desktop app](cypress.assets/plugin-configuration.15548a6c.png)



**cypress中，可以等待返回的promise，使得能够执行异步任务，并使用最终修改后的配置对象来进行解析。**

#### 例子1：定义可用的浏览器

在插件文件中，可以过滤从config对象传过来的浏览器列表，然后返回一个你自己定义的执行`cypress open`命令时**可用的浏览器**。

> 注意：执行cypress open时，需要打开浏览器。

```javascript
// cypress/plugins/index.js
module.exports = (on, config) => {
  // inside config.browsers array each object has information like
  // {
  //   name: 'chrome',
  //   family: 'chromium',
  //   channel: 'canary',
  //   displayName: 'Canary',
  //   version: '80.0.3966.0',
  //   path:
  //    '/Applications/Canary.app/Contents/MacOS/Canary',
  //   majorVersion: 80
  // }
  return {
    browsers: config.browsers.filter((b) => b.family === 'chromium')
  }
}
```

经过上面的插件文件的过滤，当我们打开测试运行器（test runner)的时候，浏览器列表中只能看到系统的chrome浏览器，如下图：

![Filtered list of Chrome browsers](cypress.assets/chrome-browsers-only.fac48f59.png)

> 如果插件文件中返回的浏览器列表为空或者返回`browsers: null`，则将自动恢复默认列表。

#### 例子2：读取不同的配置文件

基于不同的场景，有时候我们可能需要创建不同的配置文件，**然后读取不同的配置文件去执行测试任务**。

> 注意，这里的读取不同的配置文件，并不是说将要读取的默认的配置文件cypress.json改成其它的配置文件了，cypress执行测试时，依然会去读取cypress.json配置文件，但是，这里的配置文件的值可能会覆盖掉cypress.json中的值。
>
> 我们可以看一下cypress的配置优先级：
>
> 1. 默认值
> 2. [配置文件](https://docs.cypress.io/guides/references/configuration.html)中的值（配置文件默认为cypress.json，可以通过`--config-file`来指定为其它的文件）
> 3. [环境变量文件](https://docs.cypress.io/guides/guides/environment-variables.html#Option-2-cypress-env-json)中的值（文件为cypress.env.json，可以自己创建）
> 4. [系统环境变量](https://docs.cypress.io/guides/guides/environment-variables.html#Option-3-CYPRESS)中的值（`CYPRESS_*`）
> 5. [命令行参数](https://docs.cypress.io/guides/guides/command-line.html)
> 6. [插件文件](https://docs.cypress.io/api/plugins/configuration-api.html) 返回的值

例如：

- `cypress.qa.json`
- `cypress.dev.json`
- `cypress.prod.json`

```javascript
// promisified fs module
const fs = require('fs-extra')
const path = require('path')

function getConfigurationByFile (file) {
  const pathToConfigFile = path.resolve('..', 'config', `${file}.json`)

  return fs.readJson(pathToConfigFile)  
}

// plugins file
module.exports = (on, config) => {
  // accept a configFile value or use development by default
  const file = config.env.configFile || 'development'

  return getConfigurationByFile(file)
}
```

> `require()`方法：
>
> 用于引入模块、 `JSON`、或本地文件。 可以从 `node_modules` 引入模块。 可以使用相对路径（例如 `./`、 `./foo`、 `./bar/baz`、 `../foo`）引入本地模块或 JSON 文件，路径会根据 [`__dirname`](http://nodejs.cn/s/etUQhi) 定义的目录名或当前工作目录进行处理。

接下来，可以通过环境变量来读取不同的配置文件：

```shell
cypress run
cypress run --env configFile=qa
cypress run --env configFile=staging
cypress run --env configFile=production
```

上面的不同的环境变量，对应下面不同的配置文件的读取：

```
cypress/config/development.json
cypress/config/qa.json
cypress/config/staging.json
cypress/config/production.json
```

不同的配置文件可以填写不同的内容，比如下面的例子：

```json
// cypress/config/development.json

{
  "baseUrl": "http://localhost:1234",
  "env": {
    "something": "development"
  }
}
// cypress/config/qa.json

{
  "baseUrl": "https://qa.acme.com",
  "env": {
    "something": "qa"
  }
}
// cypress/config/staging.json

{
  "baseUrl": "https://staging.acme.com",
  "env": {
    "something": "staging"
  }
}
// cypress/config/production.json

{
  "baseUrl": "https://production.acme.com",
  "env": {
    "something": "production"
  }
}
```

### 可用的事件event

| Event                                                        | Description                                                  |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`file:preprocessor`](https://docs.cypress.io/api/plugins/preprocessors-api.html) | Occurs when a spec or spec-related file needs to be transpiled for the browser. |
| [`before:browser:launch`](https://docs.cypress.io/api/plugins/browser-launch-api.html) | Occurs immediately before launching a browser.               |
| [`task`](https://docs.cypress.io/api/commands/task.html)     | Occurs in conjunction with the `cy.task` command.            |
| [`after:screenshot`](https://docs.cypress.io/api/plugins/after-screenshot-api.html) | Occurs after a screenshot is taken.                          |

### 运行时上下文

打开一个cypress项目的时候，插件文件会被调用。

cypress会生成一个独立的子进程来加载插件文件（plugin files)。

注意：

> cypress加载的只是插件文件，不是你的本地项目，也不是其它你可以控制的东西。
>
> 因此，全局上下文和Node的版本是控制在cypress下的。
>
> Node的版本：
>
> - 插件中的代码会被cypress本身绑定的Node的版本来执行。
> - 这个Node的版本与你本地安装的Node的版本无关。因此，
>
> 此版本的节点与本地安装的Node版本无关。因此，在插件文件中需要写与绑定的Node版本兼容的代码，或者设置[node的版本](https://docs.cypress.io/guides/references/configuration.html#Node-version)。
>
> 设置方法：
>
> | 参数          | 默认值    | 描述                                                         |
> | ------------- | --------- | ------------------------------------------------------------ |
> | `nodeVersion` | `bundled` | 如果设置为`system`, 当加载插件时候，Cypress将会在你的路径上寻找可执行的Node，否则，cypress将会使用cypress绑定的Node版本。 |
>
> [点击此处](https://github.com/cypress-io/cypress/blob/master/.node-version)查看当前cypress绑定的node版本。

#### npm模块

当cypress执行插件文件时，会使用`process.cwd()`来设置项目的路径，从而可以加载任何已安装的npm模块，也可以加载本地的文件。

例如，如果你的package.json文件如下：

```json
{
  "name": "My Project",
  "dependencies": {
    "debug": "x.x.x"
  },
  "devDependencies": {
    "lodash": "x.x.x"
  }
}
```

那么你可以进行以下的操作：

```js
// cypress/plugins/index.js

const _ = require('lodash') // yup, dev dependencies
const path = require('path') // yup, built in node modules
const debug = require('debug') // yup, dependencies
const User = require('../../lib/models/user') // yup, relative local modules

console.log(__dirname) // /Users/janelane/Dev/my-project/cypress/plugins/index.js

console.log(process.cwd()) // /Users/janelane/Dev/my-project
```

### 插件错误处理

Cypress在子进程中生成插件文件，这样它就与Cypress本身运行的上下文隔离开来。因此，不能以任何方式意外地修改或更改Cypress自身的执行。

如果插件文件有未捕获的异常、未经处理的承诺拒绝或语法错误，将自动捕获这些异常展示在控制台内部或者在测试运行器（Test Runner）中。

插件中的错误不会导致Cypress崩溃。

### 插件文件的更改

一般来说，写Node代码的时候，修改了任何文件之后，需要重启进程。

但是，在cypress中，将会自动监控你的插件文件或者任何的改变，然后立即生效（重新读取文件和执行导出的函数）。

因此，我们可以在cypress已经运行的时候，不断修改插件的代码。

## 报告

### cypress内置报告器

报告器：reporter

因为cypress是基于mocha构建的，所以mocha的所有报告器，cypress都可以使用。

> Mocha是一个功能丰富的运行在Node.js和浏览器中的**JavaScript测试框架**。

- [Mocha内置的报告器](https://mochajs.org/#reporters)：

  - **SPEC** 报告器，这个是默认的报告器。

    ![image-20201210115340888](cypress.assets/image-20201210115340888.png)

  -  Dot Matrix报告器

  - Nyan报告器

  - TAP报告器

  - Landing Strip报告器

  - LIST报告器

  - JSON报告器

  -  Markdown报告器

也可以使用下面两种mocha的第三方报告器，目前已经集成在cypress中，无需安装任何东西：

- [`teamcity`](https://github.com/cypress-io/mocha-teamcity-reporter)
- [`junit`](https://github.com/michaelleeallen/mocha-junit-reporter)

建议使用自定义的报告器或者使用第三方报告器。

### cypress自定义报告器

#### 自定义报告器

##### 本地安装

可以通过绝对路径或相对路径加载自定义的[mocha报告器](https://mochajs.org/api/tutorial-custom-reporter.html)，可在cypress.json配置（默认）或者[命令行](https://docs.cypress.io/guides/guides/command-line.html)来指定

例子，加入项目结构如下：

```txt
> my-project
  > cypress
  > src
  > reporters
    - custom.js
```

可通过下面的方式指定自定义的报告器的路径。

配置文件（默认为cypress.json）中：

```json
{
  "reporter": "reporters/custom.js"
}
```

命令行中：

```shell
cypress run --reporter reporters/custom.js
```

##### 通过npm安装

通过npm安装自定义的报告器时，需要指定package的名称。

配置文件（默认为cypress.json）：

```json
{
  "reporter": "mochawesome"
}
```

命令行：

```shell
cypress run --reporter mochawesome
```

#### 报告器参数设置

可通过cypress.json文件或者命令行来指定报告器的参数。

不同的报告器，可能会有不同的参数设置，可以去参考使用的报告器的官方文档。

举个例子：下面的cypress.json的配置使得，将会输出`JUnit`报告到控制台并保存到一个XML文件中。

配置文件（默认为cypress.json）：

```json
{
  "reporter": "junit",
  "reporterOptions": {
    "mochaFile": "results/my-test-output.xml",
    "toConsole": true
  }
}
```

命令行：

```shell
cypress run --reporter junit \
  --reporter-options "mochaFile=results/my-test-output.xml,toConsole=true"
```

#### 合并多个用例文件的测试报告

每一个用例文件都会独立生成一个报告，每运行一个用例文件的测试报告都会覆盖之前的报告文件。

如果想要为每一个用例文件保存一份报告，可以在`mochaFile`的文件名中使用`[hash]`。

例子：下面的配置使得可以在results目录下创建独立的XML文件。

配置文件（默认为cypress.json）：

```json
{
  "reporter": "junit",
  "reporterOptions": {
    "mochaFile": "results/my-test-output-[hash].xml"
  }
}
```

命令行：

```shell
cypress run --reporter junit \
  --reporter-options "mochaFile=results/my-test-output-[hash].xml"
```

---

还可以使用第三方工具来合并输出的报告，比如对于[Mochawesome](https://github.com/adamgruber/mochawesome) 报告器，可以使用[mochawesome-merge](https://github.com/antontelesh/mochawesome-merge) 工具来合并报告。

#### 使用多种报告器

在持续集成中，可能想生成junit报告和json报告，但是使用这种报告器，测试在运行时不会有额外的反馈。

解决办法就是使用多种报告器。建议使用npm module方式来安装：https://github.com/you54f/cypress-multi-reporters。

##### [例子1](https://github.com/cypress-io/cypress-example-circleci-orb)

**输出SPEC报告到控制台，保存junit XML文件。**

输出SPEC报告到控制台，保存多个Mochawesome JSON报告并合并为一个单独的报告。

安装额外的依赖：

```shell
npm install --save-dev cypress-multi-reporters mocha-junit-reporter
```

指定报告器和报告器的参数：

配置文件（默认为cypress.json)：

```json
{
  "reporter": "cypress-multi-reporters",
  "reporterOptions": {
    "configFile": "reporter-config.json"
  }
}
```

命令行：

```shell
cypress run --reporter cypress-multi-reporters \
  --reporter-options configFile=reporter-config.json
```

添加一个名称为`reporter-config.json` 的文件，文件里面定义了报告器的配置

```json
{
  "reporterEnabled": "spec, mocha-junit-reporter",
  "mochaJunitReporterReporterOptions": {
    "mochaFile": "cypress/results/results-[hash].xml"
  }
}
```

运行前，最好将报告目录cypress/results（可以是其它的）里的文件全部删除，因为每一次运行都会输出一个新的XML文件。

举个例子，可以在package.json中添加npm脚本来删除文件和设置特定的运行方式：

```json
{
  "scripts": {
    "delete:reports": "rm cypress/results/* || true",
    "prereport": "npm run delete:reports",
    "report": "cypress run --reporter cypress-multi-reporters --reporter-options configFile=reporter-config.json"
  }
}
```

---



##### [例子2](https://github.com/cypress-io/cypress-example-circleci-orb)

**输出SPEC报告到控制台，为每个测试文件生成一个Mochawesome JSON文件，然后合并所有JSON报告为一个单独的报告**

安装额外的依赖：

```shell
npm install --save-dev mochawesome mochawesome-merge mochawesome-report-generator
```

配置文件（默认为cypress.json):

```json
{
  "reporter": "mochawesome",
  "reporterOptions": {
    "reportDir": "cypress/results",
    "overwrite": false,
    "html": false,
    "json": true
  }
}
```

命令行：

```shell
cypress run --reporter mochawesome \
  --reporter-options reportDir=reporter-config.json,overwrite=false,html=false,json=true
```

运行后，会生成文件：`cypress/results/mochawesome.json, cypress/results/mochawesome_001.json, ...`。

然后就可以使用[mochawesome-merge](https://github.com/antontelesh/mochawesome-merge)工具来合并它们了：

```shell
npx mochawesome-merge "cypress/results/*.json" > mochawesome.json
```

之后，我们会根据`mochawesome.json` 文件，使用[mochawesome-report-generator](https://github.com/adamgruber/mochawesome-report-generator)工具来生成一个合并的HTML报告。

```shell
npx marge mochawesome.json
```

生成的HTML报告`mochawesome-report/mochawesome.html` 如下，包含了所有测试的结果，耗时，以及测试body等：

![Mochawesome HTML report](cypress.assets/mochawesome-report.accfcbf0.png)



### mochawesome报告器

Mochawesome是一个为javascript测试框架定制的一个报告器，比如mocha。它运行在node.js上，并与mochawesome报告生成器[mochawesome-report-generator（marge）](https://github.com/adamgruber/mochawesome-report-generator) 一起工作，生成独立的HTML/CSS报告（Marge从mochawesome获取JSON输出并生成一个完整的HTML/CSS报告）。

Mochawesome报告器的特点：

- 简单、干净、现代化
- 漂亮的图表
- 支持测试和套件的嵌套
- 可以展示before和after hooks
- 可查看测试代码
- 跟踪失败的测试
- 支持添加测试的上下文信息
- 具有过滤器（只查看想看的测试)
- 反应灵敏
- 离线观看
- 支持并行模式

使用方式：

```
1、安装
npm install --save-dev mochawesome
```

mochawesome报告器可设置的参数：

| Option Name       | Type    | Default     | Description                                                  |
| ----------------- | ------- | ----------- | ------------------------------------------------------------ |
| `quiet`           | boolean | false       | Silence console messages                                     |
| `reportFilename`  | string  | mochawesome | Filename of saved report   *Applies to the generated html and json files.* |
| `html`            | boolean | true        | Save the HTML output for the test run                        |
| `json`            | boolean | true        | Save the JSON output for the test run                        |
| `consoleReporter` | string  | spec        | Name of mocha reporter to use for console output, or `none` to disable console report output entirely |

mochawesome报告器生成的报告：

![Mochawesome Report](cypress.assets/marge-report-1.0.1.png)

## 数据驱动

第一种方式：

```js
/// <reference types="cypress"/>

// 导入数据文件 testdata.json，并保存在 testData 变量中
import testData from '../../data/testdata.json'


describe('create a project with data-driven',()=>{

    context('testing',()=>{

        beforeEach('login',()=>{
            
            cy.visit('/');
            cy.login();
        });

        for (const data of testData) {
            it(`测试数据：${data}`, function () {
                cy.createProject(data.proName,data.desc)
            });
        };


        after('logout',()=>{

            // cy.logout();

        });
    });

});
```

第二种方式：动态生成测试

```js
describe('if your app uses jQuery', () => {
  ['mouseover', 'mouseout', 'mouseenter', 'mouseleave'].forEach((event) => {
    it('triggers event: ' + event, () => {
      cy
        .get('#with-jquery').invoke('trigger', event)
        .get('#messages').should('contain', 'the event ' + event + 'was fired')
    })
  })
})
```

第三种方式：

```js
describe('参数化案例，输入不同的值', function() {
    // 定义测试数据
    var testdatas = ["apulis", "依瞳科技", "123456"]
    // 前置-打开浏览器
    before(() => {
          cy.visit('https://www.baidu.com')
        })

    // 参数化
    testdatas.forEach((event) => {
        it("百度输入框功能", function () {
            cy.get('#kw').type(event)
                .should('have.value', event)
                .clear()
                .should('have.value', '')
        });
    });
    });
```



## 常用命令

### 查找页面元素的基本方法

| 命令                                                         |
| ------------------------------------------------------------ |
| [get()](https://www.cnblogs.com/poloyy/p/13065990.html)      |
| [find()](https://www.cnblogs.com/poloyy/p/13065990.html)     |
| [contains()](https://www.cnblogs.com/poloyy/p/13065990.html) |

### 查找页面元素的辅助方法

| 命令                                                         |
| ------------------------------------------------------------ |
| [children()](https://i.cnblogs.com/posts/edit;postId=14031640) |
| [parents()](https://i.cnblogs.com/posts/edit;postId=14031640) |
| [parent()](https://i.cnblogs.com/posts/edit;postId=14031640) |
| [siblings()](https://i.cnblogs.com/posts/edit;postId=14031640) |
| [first()](https://i.cnblogs.com/posts/edit;postId=14031640)  |
| [last()](https://i.cnblogs.com/posts/edit;postId=14031640)   |
| [next()](https://i.cnblogs.com/posts/edit;postId=14031640)   |
| [nextAll()](https://i.cnblogs.com/posts/edit;postId=14031640) |
| [nextUntil(selector)](https://i.cnblogs.com/posts/edit;postId=14031640) |
| [prev()](https://www.cnblogs.com/poloyy/p/13065998.html#hid-iMfFd5) |
| [prevUntil()](https://www.cnblogs.com/poloyy/p/13065998.html) |
| [each()](https://www.cnblogs.com/poloyy/p/13065998.html)     |
| [eq()](https://www.cnblogs.com/poloyy/p/13065998.html)       |
| [closest()](https://www.cnblogs.com/poloyy/p/13065998.html)  |

### 点击命令

| 命令                                                         | 作用     |
| ------------------------------------------------------------ | -------- |
| [click()](https://www.cnblogs.com/poloyy/p/13066005.html)    | 单击     |
| [dbclick()](https://www.cnblogs.com/poloyy/p/13066005.html)  | 双击     |
| [rightclick()](https://www.cnblogs.com/poloyy/p/13066005.html) | 右键点击 |

### 操作页面元素的命令

| 命令                                                         | 作用                    |
| ------------------------------------------------------------ | ----------------------- |
| [type()](https://www.cnblogs.com/poloyy/p/13066011.html)     | 输入框输入文本元素      |
| [focus()](https://www.cnblogs.com/poloyy/p/13140409.html)    | 聚焦DOM元素             |
| [blur()](https://www.cnblogs.com/poloyy/p/13140409.html)     | DOM元素失去焦点         |
| [clear()](https://www.cnblogs.com/poloyy/p/13066015.html)    | 清空DOM元素             |
| [submit()](https://www.cnblogs.com/poloyy/p/13066039.html)   | 提交表单                |
| [click()](https://www.cnblogs.com/poloyy/p/13066005.html)    | 点击DOM元素             |
| [dbclick()](https://www.cnblogs.com/poloyy/p/13066005.html)  | 双击                    |
| [rightclick()](https://www.cnblogs.com/poloyy/p/13066005.html) | 右键点击                |
| [check()](https://www.cnblogs.com/poloyy/p/13065988.html)    | 选中单选框、复选框      |
| [uncheck()](https://www.cnblogs.com/poloyy/p/13065988.html)  | 取消选中复选框          |
| [select()](https://www.cnblogs.com/poloyy/p/13066025.html)   | select options选项框    |
| [scrollIntoView()](https://www.cnblogs.com/poloyy/p/13140634.html) | 将DOM元素滑动到可视区域 |
| [trigger()](https://www.cnblogs.com/poloyy/p/13066031.html)  | DOM元素上触发事件       |
| [scrollTo()](https://www.cnblogs.com/poloyy/p/13141302.html) | 滑动滚动条              |

### 获取页面全局对象的命令

| 命令                                                         | 作用                                  |
| ------------------------------------------------------------ | ------------------------------------- |
| [window()](https://www.cnblogs.com/poloyy/p/13151135.html)   | 获取当前页面的窗口对象                |
| [title()](https://www.cnblogs.com/poloyy/p/13149627.html)    | 获取当前页面的title                   |
| [url()](https://www.cnblogs.com/poloyy/p/13149710.html)      | 获取当前页面的URL                     |
| [location()](https://www.cnblogs.com/poloyy/p/13152064.html) | 获取当前页面的全局window.location对象 |
| [document()](https://i.cnblogs.com/posts/edit-done;postId=13151943) | 获取当前页面的全局windowd.ocument对象 |
| [hash()](https://www.cnblogs.com/poloyy/p/13150936.html)     | 获取当前页面的URL 哈希值              |
| [root()](https://www.cnblogs.com/poloyy/p/13151649.html)     | 获取根DOM元素                         |

### 操作浏览器的命令

| 命令                                                         | 作用                       |
| ------------------------------------------------------------ | -------------------------- |
| [go()](https://www.cnblogs.com/poloyy/p/13173455.html)       | 浏览器前进、后退           |
| [reload()](https://www.cnblogs.com/poloyy/p/13173533.html)   | 刷新页面                   |
| [viewport()](https://www.cnblogs.com/poloyy/p/13174388.html) | 控制浏览器窗口的大小和方向 |
| [visit()](https://www.cnblogs.com/poloyy/p/13608977.html)    | 访问指定的 url             |
| [wait()](https://www.cnblogs.com/poloyy/p/13625824.html)     | 强制等待                   |

### 操作上一条命令返回结果的命令

| 命令                                                       | 作用                                             |
| ---------------------------------------------------------- | ------------------------------------------------ |
| [then()](https://www.cnblogs.com/poloyy/p/13671895.html)   | 将上一条命令返回的结果注入到下一个命令中         |
| [and()](https://www.cnblogs.com/poloyy/p/13678233.html)    | 创建一个断言。断言将自动重试，直到它们通过或超时 |
| [should()](https://www.cnblogs.com/poloyy/p/13678233.html) | and() 的别名                                     |
| [invoke()](https://www.cnblogs.com/poloyy/p/13680832.html) | 对上一条命令的结果执行调用方法操作               |
| [its()](https://www.cnblogs.com/poloyy/p/13686431.html)    | 获取对象的属性值                                 |
| [as()](https://www.cnblogs.com/poloyy/p/13730822.html)     | 取别名                                           |
| [within()](https://www.cnblogs.com/poloyy/p/14006553.html) | 限定命令作用域                                   |
| [each()](https://www.cnblogs.com/poloyy/p/14006831.html)   | 遍历当前元素                                     |
| [spread()](https://www.cnblogs.com/poloyy/p/14007116.html) | 将数组内容作为单独的参数传回到回调函数           |

### 操作文件相关命令

| 命令                                                        | 作用         |
| ----------------------------------------------------------- | ------------ |
| [fixture()](https://www.cnblogs.com/poloyy/p/13671895.html) | 加载数据文件 |
| readFile()                                                  |              |
| writeFile()                                                 |              |

### 网络相关命令

| 命令                                                        | 作用           |
| ----------------------------------------------------------- | -------------- |
| [request()](https://www.cnblogs.com/poloyy/p/13841964.html) | 发送 HTTP 请求 |
| [route()](https://www.cnblogs.com/poloyy/p/13852941.html)   | 路由           |
| [server()](https://www.cnblogs.com/poloyy/p/13856700.html)  | mock 服务器    |
| intercept()                                                 |                |

### 操作 Cookie 相关命令

| 命令                                                         | 作用                  |
| ------------------------------------------------------------ | --------------------- |
| [getCookies()](https://www.cnblogs.com/poloyy/p/14014705.html) | 获取所有 Cookies      |
| [setCookie()](https://www.cnblogs.com/poloyy/p/14014706.html) | 设置一个 Cookie       |
| [clearCookie()](https://www.cnblogs.com/poloyy/p/14014709.html) | 清除指定名称的 Cookie |
| [clearCookies()](https://www.cnblogs.com/poloyy/p/14014713.html) | 清除所有 Cookie       |

### Cypress API 命令大全

| 命令                                                         |
| ------------------------------------------------------------ |
| [Cypress.Commands](https://www.cnblogs.com/poloyy/p/13808675.html) |
| [Cypress.Cookies](https://www.cnblogs.com/poloyy/p/14023979.html) |
| [Cypress.config](https://www.cnblogs.com/poloyy/p/14030243.html) |
| [Cypress.env](https://www.cnblogs.com/poloyy/p/14031174.html) |
| Cypress.dom                                                  |
| [Cypress.platform](https://www.cnblogs.com/poloyy/p/14024311.html) |
| [Cypress.version](https://www.cnblogs.com/poloyy/p/14024356.html) |
| [Cypress.arch](https://www.cnblogs.com/poloyy/p/14024183.html) |
| [Cypress.spec](https://www.cnblogs.com/poloyy/p/14024741.html) |
| [Cypress.browser](https://www.cnblogs.com/poloyy/p/14024553.html) |
| [Cypress.log](https://www.cnblogs.com/poloyy/p/14025013.html) |



## 练习cypress

下载github的开源：https://github.com/cypress-io/cypress-realworld-app

