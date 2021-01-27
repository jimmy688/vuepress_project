//导航栏
module.exports = [
    {text: '主页', link: '/'},
    {text: 'Linux', link: '/linux/linux常用命令/01linux常用命令01'},
    {
        text: '大数据',
        items: [
                {
                    text: 'hadoop',
                    link:'/hadoop/01hadoop环境搭建/01搭建hadoop集群'
                },{
                    text: 'hbase',
                    link:'/hbase/hbase'
                },{
                    text: 'flink',
                    link:'/flink/flink'
                },
        ]
    },
    {
        text: '编程语言',
        items:[
            {
                text: 'java',
                link: ''
            }
        ]
    }
]