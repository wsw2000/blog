import React,{useEffect,useState} from 'react'
import { Table, Space, Modal,message,Button,Input } from 'antd';
import apis from '../../utils/request'
function AddArticleType(props) {
  const [typeid,setTypeId] = useState(0)
  const [loading,setLoading] = useState(false)
  const [addModal,setAddModal] = useState(false)
  const [typeName,setTypeName] = useState('')
  const [icon,setIcon] = useState('')
  const [typeList,setTypeList] = useState([])
  const columns = [
    { title: 'id',dataIndex: 'id',key: 'id',align:'center' },
    { title: '类型',dataIndex: 'typeName',key: 'typeName',align:'center' },
    { title: 'iconName',dataIndex: 'icon',key: 'icon',align:'center' },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      align:'center',
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={()=>editType(record)}>修改</Button>
          <Button type="danger" onClick={()=>delType(record.id)}>删除</Button>
        </Space>
      ),
    },
  ];
  const getTypelist = async() => {
    const {data:res} = await apis.getTypeInfo()
    if(res.data == '登录失败'){
      props.history.push('/login')
      return
    }
    setTypeList(res.data)
  }
  const delType = async(id) => {
    Modal.confirm({
      title: '确定要删除吗?',
      okText: '确认',
      cancelText: '取消',
      async onOk(){
        const {data:res} = await apis.delArticleType(id)
        if(res.code !== 1) {
          message.error('删除失败')
          return
        }
        message.success('删除成功')
        getTypelist()
      },
      onCancel() {
        message.success('没有任何改变')
      },
    })
  }
  const editType = (typeinfo) =>{
    setTypeId(typeinfo.id)
    setTypeName(typeinfo.typeName)
    setIcon(typeinfo.icon)
    setAddModal(true)
  }
  const addType = () =>{
    setTypeId(0)
    setAddModal(true)
  }
  const handCancel = () =>{
    setAddModal(false)
    setTypeName('')
    setIcon('')
  }
  const updateTypeList = async() =>{
    if(typeName == ''){
      message.error('请输入类型名称')
      return
    }
    if(typeid == 0) {
      const {data:res} = await apis.addAcricleType({typeName,icon})
      if(!res.isScuccess) return
      message.success('添加成功！')
    }else { 
      //更新
      const {data:res} = await apis.updateArticleType({id:typeid,typeName,icon})
      console.log(res);
      if(!res.isScuccess) return
      message.success('更新成功')
    }
    getTypelist()
    setAddModal(false)
    setTypeName('')
    setIcon('')
  }
  useEffect(() => {
    setLoading(true)
    getTypelist()
    setLoading(false)
  }, []);
  return (
    <>
      <Table 
        loading={loading} 
        bordered 
        columns={columns} 
        dataSource={typeList} 
        mountNode
        rowKey={(item) => item.id}
        pagination={false} 
      />
      <div style={{width:'100%',textAlign:'right'}}>
        <Button type="primary" 
        onClick={addType}
        style={{marginTop:'20px',padding:' 20px 57px',lineHeight:' 0.0715'}}>
        添加</Button>
      </div>
      {
        addModal ? 
        <Modal title="添加文章类型" 
        visible={addModal} 
        onOk={updateTypeList} 
        onCancel={handCancel}
        >
          <Input placeholder="文章名称"
          value={typeName} 
          onChange={(e) => { setTypeName(e.target.value) }}/>
          <Input placeholder="icon"
          style={{marginTop:'20px'}}
          value={icon} 
          onChange={(e) => { setIcon(e.target.value) }}/>
        </Modal> : null
      }
     
    </>
  )
}

export default AddArticleType