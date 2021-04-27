import Head from 'next/head'
import React, { useEffect } from 'react'
import Link from 'next/link'
import Router from 'next/router'
import Header from '../components/Header'
import Author from '../components/Author'
import Footer from '../components/Footer'
import Sentence from '../components/sentence'
import { timefilter } from '../utils'
import apis from '../utils/request'
import Iazyimg from '../components/lazyImg'
import {
  Row,
  Col,
  List,
  Icon,
  Breadcrumb,
  Tag,
  Radio,
  Divider,
  Button,
  Spin,
} from 'antd'
import { connect } from 'react-redux'
import LazyLoad from 'react-lazyload'
import useFetchState from '../utils/useFetchState'
const myList = ({ articleList, typeId, defaultState }) => {
  const [list, setList] = useFetchState(articleList.data)
  const [btnLoading, setBtnLoading] = useFetchState(false)
  const [isEnd, setIsEnd] = useFetchState(articleList.end)
  const [listLoading, setListLoading] = useFetchState(false)
  const [page, setPage] = useFetchState(1)
  const [limit, setLimit] = useFetchState(5)
  const [orderType, setOrderType] = useFetchState('Time')
  const [order, setOrder] = useFetchState('DESC')
  const [typeName, setTypeName] = useFetchState('')

  const [headTitle, setHeadTitle] = useFetchState(
    '博客列表 | 吴绍温个人博客 | 前端学习笔记'
  )
  const checkTitle = () => {
    document.addEventListener('visibilitychange', function () {
      var isHidden = document.hidden
      isHidden && setHeadTitle('呜呜呜~~你离开了我')
      !isHidden && setHeadTitle('博客列表 | 吴绍温个人博客 | 前端学习笔记')
    })
  }
  useEffect(() => {
    setList(articleList.data)
    setPage(1) //默认第一页
    setOrderType('Time') //默认时间排序
    setIsEnd(articleList.end) //是否最后一页
  }, [typeId]) //监听typeId时
  useEffect(() => {
    checkTitle()
    setList(articleList.data)
    return () => {
      checkTitle()
      setList([])
    }
  }, [])
  //最热还是最新
  const changeListOrder = (value) => {
    setPage(1)
    setOrderType(value)
    setListLoading(true)
    const params = {
      page: 1,
      limit,
      orderType: value,
      order,
    }
    setTimeout(async () => {
      const { articleList } = await myList.getInitialProps({
        query: { id: typeId, ...params },
      })
      if (articleList.code != 1) return
      articleList.data.forEach((item) => {
        item.addTime = timefilter(item.addTime, 'ymd')
      })
      setList(articleList.data)
      setIsEnd(articleList.end)
      setListLoading(false)
    }, 500)
  }
  //加載下一頁
  const pushArticleList = () => {
    const params = {
      typeId,
      page: page + 1,
      limit,
      orderType,
      order,
    }
    setBtnLoading(true)
    setTimeout(async () => {
      const { articleList } = await myList.getInitialProps({
        query: { id: typeId, ...params },
      })
      if (articleList.code != 1) return
      articleList.data.forEach((item) => {
        item.addTime = timefilter(item.addTime, 'ymd')
      })
      const newList = [...list, ...articleList.data]
      setList(newList)
      setPage((page) => page + 1)
      setBtnLoading(false)
      setIsEnd(articleList.end)
    }, 500)
  }
  return (
    <div
      className={['next-box', defaultState.visible ? 'next-right' : ''].join(
        ' '
      )}
    >
      <Head>
        <title>{headTitle}</title>
      </Head>
      <Header />
      <Row className='comm-main' type='flex' justify='center'>
        <Col className='comm-left' xs={24} sm={24} md={16} lg={18} xl={14}>
          <div className='bread-div'>
            <Breadcrumb>
              <Breadcrumb.Item>
                <a href='/'>首页</a>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                {list.length != 0 ? list[0].typeName : '生活'}
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <Spin spinning={listLoading}>
            <List
              header={
                <div className='listTitle'>
                  <div>博客日志</div>
                  <div className='order-type'>
                    <Radio.Group
                      value={orderType}
                      buttonStyle='solid'
                      onChange={(e) => {
                        changeListOrder(e.target.value)
                      }}
                    >
                      <Radio.Button value='Time'>最新 </Radio.Button>
                      <Radio.Button value='Count'>热门</Radio.Button>
                    </Radio.Group>
                  </div>
                </div>
              }
              footer={<div></div>}
              itemLayout='vertical'
              dataSource={list} // 数据源
              renderItem={(item) => (
                <LazyLoad height={200} offset={150}>
                  <List.Item className='listItem'>
                    <div
                      className='listItem-img'
                      onClick={() => Router.push(`/detailed?id=${item.id}`)}
                    >
                      <Iazyimg
                        src={
                          item.imgUrl ||
                          'https://tva2.sinaimg.cn/large/9bd9b167ly1fwsflokx5rj21hc0u07w2.jpg'
                        }
                      ></Iazyimg>
                    </div>
                    <div className='listItem-content'>
                      <div className='listItem-content-title'>
                        <Tag color='geekblue'>{item.typeName}</Tag>
                        <Link
                          href={{
                            pathname: '/detailed',
                            query: { id: item.id },
                          }}
                        >
                          <a>{item.title}</a>
                        </Link>
                      </div>
                      <div className='listItem-content-introduce'>
                        <span>{item.introduce}</span>
                      </div>
                      <div className='listItem-content-footer'>
                        <div>
                          <Icon type='fire' />
                          <span>{item.view_count || 0}</span>
                        </div>
                        <div>
                          <Icon type='calendar' />
                          <span>{item.addTime}</span>
                        </div>
                      </div>
                    </div>
                  </List.Item>
                </LazyLoad>
              )}
            />
            <LazyLoad height={200} offset={150}>
              {isEnd ? (
                <Divider style={{ color: '#1890ff' }}>没有更多了....</Divider>
              ) : (
                <Button
                  type='primary'
                  onClick={pushArticleList}
                  loading={btnLoading}
                  style={{ margin: '0 auto', display: 'block' }}
                >
                  加载更多日志
                </Button>
              )}
            </LazyLoad>
          </Spin>
        </Col>
        <Col className='comm-right' xs={0} sm={0} md={7} lg={5} xl={4}>
          <Author />
          <Sentence />
        </Col>
      </Row>
      <Footer></Footer>
    </div>
  )
}

myList.getInitialProps = async (context) => {
  const params = {
    typeId: context.query.id,
    page: context.query.page || 1,
    limit: context.query.limit || 5,
    orderType: context.query.orderType || 'Time',
    order: context.query.order || 'DESC',
  }
  const { data: res } = await apis.getArticleList(params)
  res.data.forEach((item) => {
    item.addTime = timefilter(item.addTime, 'ymd')
  })
  return { articleList: res, typeId: context.query.id }
}
export default connect(
  (state) => ({
    defaultState: state,
  }),
  {}
)(myList)
