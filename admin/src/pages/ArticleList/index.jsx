import React,{ useState,useEffect } from 'react'
import apis from '../../utils/request'
import { Table, Tag, Space, Modal,message,Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
function ArticleList(props) {
  const [listLoading,setListLoading] = useState(false)
  const [articleList,setArticleList] = useState([])
  const handEdit = (id) => {
    props.history.push('/home/add/'+id)
  }
  const handDelete = (id) =>{
    Modal.confirm({
      title: '确定要删除这篇博客文章吗?',
      icon: <ExclamationCircleOutlined />,
      okText: '确认',
      cancelText: '取消',
      async onOk(){
        const {data:res} = await apis.delArticle(id)
        console.log(res.code);
        if(res.code !== 1) {
         message.error('删除失败')
        }
        message.success('删除成功')
        getlist()
      },
      onCancel() {
        message.success('没有任何改变')
      },
    });
  }
  const getlist = async() => {
    const {data:res} = await apis.getArticleList()
    if(res.data == '登录失败'){
      props.history.push('/login')
      return
    }
    setArticleList(res.list)
  }
  useEffect(() => {
    setListLoading(true)
    getlist()
    setListLoading(false)
  }, []);
  const columns = [
    { title: 'id',dataIndex: 'id',key: 'id',align:'center' },
    { title: '标题',dataIndex: 'title',key: 'title',align:'center' },
    { title: '介绍',dataIndex: 'introduce',key: 'introduce',align:'center' },
    { title: '时间',dataIndex: 'addTime',key: 'addTime',align:'center' },
    { title: '类型',dataIndex: 'typeName',key: 'typeName',align:'center' },
    { title: '内容',dataIndex: 'content',key: 'content',width:500 },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      align:'center',
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={()=>handEdit(record.id)}>edit</Button>
          <Button type="danger" onClick={()=>handDelete(record.id)}>Delete</Button>
        </Space>
      ),
    },
  ];
  return (
    <>
      <Table 
        loading={listLoading} 
        bordered 
        columns={columns} 
        dataSource={articleList} 
        mountNode
        rowKey={(item) => item.id}
        pagination={{ position: ['topLeft'],defaultPageSize:5 }} 
      />
    </>
  )
}

export default ArticleList