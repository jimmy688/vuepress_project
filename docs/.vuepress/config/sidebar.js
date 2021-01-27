//侧边栏
// const autosidebar = require('vuepress-auto-sidebar-doumjun')
const {getChildren} = require("vuepress-sidebar-atuo")

module.exports = {
    '/hadoop/': [
        {
            title: 'hadoop环境搭建',
            collapsable: true,
            children: getChildren('./docs/hadoop/01hadoop环境搭建/')
        }, 
        {
            title: 'hadoop初步认识',
            collapsable: true,
            children: getChildren('./docs/hadoop/02hadoop初步认识/')
        },
        {
            title: 'HDFS',
            collapsable: true,
            children: getChildren('./docs/hadoop/03HDFS/')
        },
        {
            title: 'MAPREDUCE',
            collapsable: true,
            children: getChildren('./docs/hadoop/04MAPREDUCE/')
        }
    ],
    '/linux/':[
        {
            title:'linux常用命令',
            collapsable: true,
            children:getChildren('./docs/linux/linux常用命令/')
        },
        {
            title:'linux相关操作',
            collapsable: true,
            children:getChildren('./docs/linux/linux相关操作/')
        },
        {
            title: 'shell编程',
            collapsable: true,
            children:getChildren('./docs/linux/shell编程/')
        }
    ]
    // '/coms/':[
    //     {
    //         title: '基础组件',
    //         collapsable: true,
    //         children: getChildren('./docs/coms/basicsCom/')
    //     },{
    //         title: '业务组件',
    //         collapsable: true,
    //         children: getChildren('./docs/coms/professionCom/')
    //     },
    // ],
    // '/jottings/':[
    //     {
    //         title: '随笔',
    //         collapsable: true,
    //         children: getChildren('./docs/jottings/')
    //     },
    // ],

}