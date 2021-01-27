const  nav =require('./config/nav.js') ;
const  sidebar =require('./config/sidebar.js');


module.exports = {
    dest: './docs/.vuepress/dist',
    title: '个人博客 | JiiiiG',
    description: '自是年少，韶华倾负',
    base:"/",
    // plugins: [['vuepress-plugin-code-copy', true]],
    markdown: {
        // ......
        extendMarkdown: md => {
          md.use(require("markdown-it-disable-url-encode"));
        }
    },
    themeConfig: {
        nav,
        sidebar,
        //左侧菜单栏
        // 通过 themeConfig.sidebarDepth 来修改它的行为。默认的深度是 1，它将提取到 h2 的标题，设置成 0 将会禁用标题（headers）链接，同时，最大的深度为 2，它将同时提取 h2 和 h3 标题。
        sidebarDepth: 2,   
        lastUpdated: '上次更新时间', // string | boolean    最后更新时间 前缀
        // 项目开始时间
        startYear: '2020',
        // 假定是 GitHub. 同时也可以是一个完整的 GitLab URL
        repo: 'MaLunan/press',
        // 自定义仓库链接文字。默认从 `themeConfig.repo` 中自动推断为
        // "GitHub"/"GitLab"/"Bitbucket" 其中之一，或是 "Source"。
        repoLabel: 'GitHub',
        // 以下为可选的编辑链接选项
        // 假如你的文档仓库和项目本身不在一个仓库：
        docsRepo: 'MaLunan/press',
        // 假如文档不是放在仓库的根目录下：
        docsDir: 'docs',
        // 假如文档放在一个特定的分支下：
        docsBranch: 'dev-mln',
        // 默认是 false, 设置为 true 来启用
        editLinks: true,
        // 默认为 "Edit this page"
        editLinkText: '在GitHub 上编辑此页！',
    },
    module:{
        rules:[
            {test:/\.css$/,loader:"style-loader!css-loader"},
            {test:/\.vue$/,loader:"vue-loader"},
            {test:/\.(jpg|png|jpeg|gif)$/,loader:"url-loader"}
        ]
    },
    plugins: [
        'vuepress-plugin-janitor',
        [
            '@vuepress/container',
            {
                type: 'slot'
            }
        ],
        // 代码复制弹窗插件
        ["vuepress-plugin-nuggets-style-copy", {
          copyText: "复制代码",
          tip: {
              content: "复制成功!"
          }
        }]
    ]
}