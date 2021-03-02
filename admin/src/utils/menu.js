const menuList =[
  {
    title:'博客统计',
    icon:'PieChartOutlined',
    key:'/home/word'
  },
  {
    title:'文章管理',
    icon:'UserOutlined',
    key:'/article',
    children:[
      {
        title:'添加文章',
        key:'/home/add'
      },
      {
        title:'文章列表',
        key:'/home/list'
      }
    ]
  },
  {
    title:'文章类别',
    icon:'DiffOutlined',
    key:'/home/addType/'
  },
  {
    title:'留言管理',
    icon:'FileDoneOutlined',
    key:'/home/message'
  }
]


export default menuList