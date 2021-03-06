import React, { useState, useEffect } from 'react'
import apis from '../../utils/request'
import { Table, Space, Modal, message, Button, Select } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { timeFilter } from '../../utils/index'
import useFetchState from '../../utils/useFetchState'

const { Option } = Select

function ArticleList(props) {
  const [listLoading, setListLoading] = useFetchState(false)
  const [articleList, setArticleList] = useFetchState([])
  const [typeInfo, setTypeInfo] = useFetchState([])
  const [selectedType, setSelectType] = useFetchState('请选择类别') //选择的文章类别
  // const [typeId, setTypeId] = useFetchState(0)
  // const [page, setPage] = useFetchState(1)
  // const [limit, setLimit] = useFetchState(5)
  // const [orderType,setOrderType] = useFetchState('Time')
  const [total, setTotal] = useFetchState(0)

  const [form, setForm] = useFetchState({
    typeId: 0,
    page: 1,
    limit: 5,
    orderType: 'Time',
  })
  const handEdit = (id) => {
    props.history.push('/home/add/' + id)
  }

  const handDelete = (id) => {
    Modal.confirm({
      title: '确定要删除这篇博客文章吗?',
      icon: <ExclamationCircleOutlined />,
      okText: '确认',
      cancelText: '取消',
      async onOk() {
        const { data: res } = await apis.delArticle(id)
        if (res.code !== 1) {
          message.error('删除失败')
        }
        message.success('删除成功')
        getlist()
      },
      onCancel() {
        message.success('没有任何改变')
      },
    })
  }

  const getTypeInfo = async () => {
    const { data: res } = await apis.getTypeInfo()
    if (res.data === '登录失败' || res.code != 1) {
      localStorage.removeItem('openId')
      props.history.push('/login')
    } else {
      setTypeInfo(res.typedatas)
    }
  }

  const selectType = (value) => {
    setSelectType(value)
    const data = { ...form, page: 1, limit: 5, typeId: value }
    setForm(data)
  }

  const handleChange = (page, pageSize) => {
    const data = { ...form, page: page, limit: pageSize }
    setForm(data)
  }
  const getlist = async () => {
    setListLoading(true)
    const { data: res } = await apis.getArticleList(form)
    if (res.data === '登录失败') {
      props.history.push('/login')
      return
    }
    setArticleList(res.data)
    setTotal(res.total)
    setListLoading(false)
  }

  useEffect(() => {
    getlist()
  }, [form, setForm])

  useEffect(() => {
    setListLoading(true)
    getTypeInfo() //文章类别
    getlist() //文章列表
    setListLoading(false)
  }, [])
  const columns = [
    { title: 'id', dataIndex: 'id', key: 'id', align: 'center' },
    { title: '标题', dataIndex: 'title', key: 'title', align: 'center' },
    {
      title: '介绍',
      dataIndex: 'introduce',
      key: 'introduce',
      align: 'center',
    },
    {
      title: '浏览量',
      dataIndex: 'view_count',
      key: 'view_count',
      align: 'center',
    },
    {
      title: '时间',
      dataIndex: 'addTime',
      key: 'addTime',
      align: 'center',
      render: (time) => <>{timeFilter(time)}</>,
    },
    { title: '类型', dataIndex: 'typeName', key: 'typeName', align: 'center' },
    {
      title: '图片',
      dataIndex: 'imgUrl',
      key: 'imgUrl',
      align: 'center',
      width: 300,
      render: (imgUrl) => (
        <>
          <img
            style={{ width: '100%', borderRadius: '15px' }}
            src={imgUrl}
            alt=''
          />
        </>
      ),
    },

    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      render: (text, record) => (
        <Space size='middle'>
          <Button type='primary' onClick={() => handEdit(record.id)}>
            edit
          </Button>
          <Button type='danger' onClick={() => handDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ]
  return (
    <>
      <Select
        value={selectedType}
        size='large'
        onSelect={(value) => selectType(value)}
      >
        {typeInfo.map((item) => {
          return (
            <Option disabled={item.id === 4} key={item.id} value={item.id}>
              {item.typeName}
            </Option>
          )
        })}
        <Option value={0}>全部</Option>
      </Select>
      <Table
        loading={listLoading}
        bordered
        columns={columns}
        dataSource={articleList}
        scroll={{ x: 1000 }}
        mountNode
        rowKey={(item) => item.id}
        pagination={{
          showSizeChanger: true,
          onChange: handleChange,
          pageSizeOptions: [5, 10, 20, 50],
          position: ['topRight'],
          current: form.page,
          pageSize: form.limit,
          total: total,
        }}
      />
    </>
  )
}

export default ArticleList
