import React,{useState} from 'react';
import { Layout, Menu, Breadcrumb,Button,Row,Col,Modal,message } from 'antd';
import './index.css'
import { PieChartOutlined, UserOutlined,FileDoneOutlined,DiffOutlined } from '@ant-design/icons'
import { Route,Link } from 'react-router-dom';
import AddArticle from '../AddArticle'
import ArticleList from '../ArticleList'
import AddArticleType from '../AddArticleType'
import articleWord from '../ArticleWord'
import menuList from '../../utils/menu'
import apis from '../../utils/request'

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

function AdminIndex(props){
  const [collapsed,setCollapsed] = useState(false)

  const onCollapse = collapsed => {
    setCollapsed(collapsed)
  };
  const menuIcon = {
    PieChartOutlined : <PieChartOutlined/>,
    UserOutlined : <UserOutlined/>,
    DiffOutlined : <DiffOutlined/>,
    FileDoneOutlined : <FileDoneOutlined/>,
  }
  //无子级菜单
  const getMenu = ({title,key,icon}) => {
    return (
      <Menu.Item key={key} icon={menuIcon[icon]}>
        <Link to={key}>
          <span>{title}</span>
        </Link>
      </Menu.Item>
    )
  }
  //有子级菜单
  const getSubMenu = ({title,key,icon,children}) => {
    return (
      <SubMenu key={key} title={title} icon={menuIcon[icon]}>
        {
          children && children.map(item =>{
            return item.children && item.children.length > 0 ? getSubMenu(item) : getMenu(item)
          })
        }
      </SubMenu>
    )
  }
  const logout = () =>{
    Modal.confirm({
      title: '确定要退出登录吗?',
      okText: '确认',
      cancelText: '取消',
      async onOk(){
        localStorage.removeItem('openId')
        const {data:res} = await apis.LoginOut()
        if(res.code !== -1) return
        message.success('退出成功')

        setTimeout(() =>{
          props.history.push('/')
        },1000)
      },
      onCancel() {
        message.success('你还在哦')
      },
    })
  }
  return (
    <Layout style={{ minHeight: '100vh',minWidth: '100%' }}>
      <Sider  breakpoint="md"  collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className="logo"></div>
        <Menu theme="dark" mode="inline" >          
          {
            menuList && menuList.map(item => {
              return item.children && item.children.length > 0 ? getSubMenu(item) : getMenu(item)
            })
          }
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', paddingLeft:'12px'}}>
          <Row>
            <Col span={21}>hi,wsw</Col>
            <Col span={3}><Button type="danger" onClick={logout}>退出登录</Button></Col>
          </Row>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>后台管理</Breadcrumb.Item>
            <Breadcrumb.Item>工作台</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ padding: 24, background: '#fff'}}>
            {/* <Route path="/word/" exact  component={AddArticle} />   */}
            <Route path="/home/addType/" exact  component={AddArticleType} />  
            <Route path="/home/add/" exact  component={AddArticle} />  
            <Route path="/home/add/:id" exact component={AddArticle} />  
            <Route path="/home/list"  component={ArticleList} />
            <Route path="/home/word"  component={articleWord} />  
            {/* <Redirect to="/home/word"/> */}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>wsw2000.top</Footer>
      </Layout>
    </Layout>
  )

}

export default AdminIndex