- 1、创建一个目录，并进入目录

  ```
  mkdir vuepress-jg && cd vuepress-jg
  ```

  git bash here

- 2、安装yarn，并初始化

  ```
  npm init
  npm install --save-dev yarn
  ./node_modules/yarn/bin/yarn init
  ```

- 3、安装vuepress

  ```
  ./node_modules/yarn/bin/yarn add -D vuepress ## npm install -D vuepress
  ```

  在git bash里面执行上面一句会报错：

  ![image-20210117034851560](vuepress.assets/image-20210117034851560.png)

  ![image-20210117035246748](vuepress.assets/image-20210117035246748.png)

  cmd执行：

  ```
  E:
  cd vuepress_jg/node_modules/yarn/bin/
  yarn add -D vuepress
  ```

- 4、创建第一篇文档：

  ```
  mkdir docs && echo '## Hello VuePress' > docs/README.md
  ```

- 5、在 `package.json` 中添加一些scripts

  ```json
  {
    "scripts": {
      "docs:dev": "vuepress dev docs",
      "docs:build": "vuepress build docs"
    }
  }
  ```

- 6、在本地启动服务器

  ```bash
  yarn docs:dev ## npm run docs:dev
  ```

  VuePress 会在 [http://localhost:8080 (opens new window)](http://localhost:8080/)启动一个热重载的开发服务器。

  ![image-20210117042852836](vuepress.assets/image-20210117042852836.png)



```
/e/vuepress_jg/docs
$ mkdir .vuepress
cd .vuepress
touch config.js
```

README.md

```
---
home: true
heroImage: /hero.png
heroText: Hero 标题
tagline: Hero 副标题
actionText: 快速上手 →
actionLink: /zh/guide/
features:
- title: 简洁至上
  details: 以 Markdown 为中心的项目结构，以最少的配置帮助你专注于写作。
- title: Vue驱动
  details: 享受 Vue + webpack 的开发体验，在 Markdown 中使用 Vue 组件，同时可以使用 Vue 来开发自定义主题。
- title: 高性能
  details: VuePress 为每个页面预渲染生成静态的 HTML，同时在页面被加载的时候，将作为 SPA 运行。
footer: MIT Licensed | Copyright © 2018-present Evan You
---
```

```
../../node_modules/yarn/bin/yarn add -D boboidream/vuepress-bar
```

```
// 配置中添加插件
// .vuepress/config.js
// or
// .vuepress/theme/index.js

module.exports = {
  plugins: ['autobar']
}



使用管理员权限打开C:/Windows/System32/hosts文件，添加一行

在C:\Windows\System32\drivers\etc路径下找到hosts文件

添加 以下内容并保存即可恢复

199.232.68.133 raw.githubusercontent.com
```

```
.\node_modules\yarn\bin\yarn add -D markdown-it-disable-url-encode

将其注入vuepress 配置文件中

.vuepress/config.js

module.exports = {
  // .....
  markdown: {
    // ......
    extendMarkdown: md => {
      md.use(require("markdown-it-disable-url-encode"));
    }
  }
};
```

```
E:\vuepress_project\docs\java多线程\java多线程.assets>ren *.webp *.jpg
```



备注：vscode使用bash

![image-20210117043819499](vuepress.assets/image-20210117043819499.png)

![image-20210117043928329](vuepress.assets/image-20210117043928329.png)

```
…or create a new repository on the command line
echo "## jimmy688.github.io" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin git@github.com:jimmy688/jimmy688.github.io.git
git push -u origin main
                
…or push an existing repository from the command line
git remote add origin git@github.com:jimmy688/jimmy688.github.io.git
git branch -M main
git push -u origin main


git clone https://github.com/jimmy688/jimmy688.github.io


```

自动侧边栏链接：
```
https://blog.csdn.net/Ma_lunan/article/details/111357682?utm_medium=distribute.pc_relevant_t0.none-task-blog-OPENSEARCH-1.control&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-OPENSEARCH-1.control
```
```
./node_modules/yarn/bin/yarn add -D  vuepress-sidebar-atuo
```

```
    "docs:tmp": "vuepress dev docs --temp .temp"
```

```
https://www.zmln1021.cn/about/

vuepress-sidebar-atuo
```


```
yarn add -D vuepress-plugin-code-copy

module.exports = {
    plugins: [['vuepress-plugin-code-copy', true]]
}
```


```
https://blog.csdn.net/howareyou2104/article/details/107412555
```