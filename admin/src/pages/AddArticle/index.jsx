import React, { useState,useEffect } from 'react';
import useFetchState  from '../../utils/useFetchState'
import marked from 'marked'
import './index.css'
import { Row, Col, Input, Select, Button, DatePicker,message } from 'antd'
import apis from '../../utils/request'
const { Option } = Select;
const { TextArea } = Input
function AddArticle(props) {
  const [articleId, setArticleId] = useFetchState(0)  // 文章的ID，如果是0说明是新增加，如果不是0，说明是修改
  const [articleTitle, setArticleTitle] = useFetchState('')   //文章标题
  const [articleContent, setArticleContent] = useFetchState('')  //markdown的编辑内容
  const [markdownContent, setMarkdownContent] = useFetchState('预览内容') //html内容
  const [introducemd, setIntroducemd] = useFetchState()            //简介的markdown内容
  const [introducehtml, setIntroducehtml] = useFetchState('等待编辑') //简介的html内容
  const [showDate, setShowDate] = useFetchState()   //发布日期
  const [updateDate, setUpdateDate] = useFetchState() //修改日志的日期
  const [typeInfo, setTypeInfo] = useFetchState([]) // 文章类别信息
  const [selectedType, setSelectType] = useFetchState('请选择类别') //选择的文章类别

  //文章类别 + 路由守卫
  const getTypeInfo = async() =>{
    const {data:res} = await apis.getTypeInfo()
    if(res.data == '登录失败' || !res){
      localStorage.removeItem('openId')
      props.history.push('/login')  
    }else {
      setTypeInfo(res.data)
    }
  }
  //根据id获取文章详情
  const getArticleById = async(id) =>{
    const {data:res} = await apis.getArticleById(id)
    // console.log(res);
    if(res.code !== 1) return
    // console.log(res.data[0]);
    setArticleTitle(res.data[0].title)
    setArticleContent(res.data[0].content)
    setIntroducemd(res.data[0].introduce)

    let html=marked(res.data[0].content)
    setMarkdownContent(html)
    
    let tmpInt = marked(res.data[0].introduce)
    setIntroducehtml(tmpInt)

    setShowDate(res.data[0].addTime)
    setSelectType(res.data[0].typeId)
  }
  useEffect(()=>{
    // const openId = localStorage.getItem('openId')
    getTypeInfo()
    let tmpId = props.match.params.id
    //如果有文章id  代表修改
    if(tmpId){
      // console.log(tmpId);
      setArticleId(tmpId)
      getArticleById(tmpId)
    } 
  },[])
  marked.setOptions({
    renderer:new marked.Renderer(),
    gfm: true,
    pedantic: false,
    sanitize: false,
    tables: true,
    breaks: false,
    smartLists: true,
    smartypants: false,
  }); 
  const changeContent = (e)=>{
    setArticleContent(e.target.value)  //markdown的编辑内容
    let html = marked(e.target.value) 
    // console.log(html);
    setMarkdownContent(html) //预览html内容
  }

  const changeIntroduce = (e)=>{
    setIntroducemd(e.target.value)
    let html=marked(e.target.value)
    setIntroducehtml(html)
  }

  const saveArticle = async()=>{
    if(selectedType === '请选择类别'){
        message.error('必须选择文章类别')
        return false
    }else if(!articleTitle){
        message.error('文章标题不能为空')
        return false
    }else if(!articleContent){
        message.error('文章内容不能为空')
        return false
    }else if(!introducemd){
        message.error('简介不能为空')
        return false
    }else if(!showDate){
        message.error('发布日期不能为空')
        return false
    }
    // let datetext= showDate.replace('-','/') //把字符串转换成时间戳
    const addArticle = {
      type_id:selectedType,
      title:articleTitle,
      content:articleContent,
      introduce:introducemd,
      addTime:(new Date(showDate).valueOf()),
    }
    if(articleId === 0) {  //新增
      addArticle.view_count = 0
      const {data:res} = await apis.addArticle(addArticle)
      setArticleId(res.insertId)
      res.isScuccess === true ? message.success('发布成功') : message.error('发布失败')
    }else {
      // console.log('articleId:'+articleId)
      addArticle.id = articleId   //更新接口需要主键id  文章id
      const {data:res} = await apis.updateArticle(addArticle)
      res.isScuccess === true ? message.success('更新成功') : message.error('更新失败')
    }
  } 
  return (
    <div>
      <Row gutter={5}>
        <Col span={18}>
          <Row gutter={10} >
            <Col span={20}>
              <Input
                placeholder="博客标题"
                size="large"
                value={articleTitle}
                onChange={e=>{
                  setArticleTitle(e.target.value)
                }} />
            </Col>
            <Col span={4}>
              <Select defaultValue={selectedType} size="large" onSelect={value => setSelectType(value)}>
                {
                  typeInfo.map(item =>{
                    return (
                      <Option key={item.id} value={item.id}>{item.typeName}</Option>
                    )
                  })
                }
              </Select>
            </Col>
          </Row>
          <br />
          <Row gutter={10} >
            <Col span={12}>
            <TextArea
              value={articleContent} 
              className="markdown-content" 
              rows={35}  
              onChange={changeContent} 
              onPressEnter={changeContent}
              placeholder="文章内容"
            />
            </Col>
            <Col span={12}>
              <div
                className="show-html"
                dangerouslySetInnerHTML = {{__html:markdownContent}} >
              </div>
            </Col>
          </Row>
        </Col>
        <Col span={6}>
          <Row>
            <Col span={24}>
              <br />
              <TextArea 
                rows={4} 
                value={introducemd}  
                onChange={changeIntroduce} 
                onPressEnter={changeIntroduce}
                placeholder="文章简介"
              />
              <br /><br />
              <div 
                className="introduce-html"
                dangerouslySetInnerHTML = {{__html:'文章简介：'+introducehtml}} >
              </div>
            </Col>
            <Col span={12}>
              <div className="date-select">
                <DatePicker
                  // value={showDate}
                  onChange={(date,dateString)=>setShowDate(dateString)}
                  placeholder="发布日期"
                  size="large"
                />
              </div>
            </Col>
            <Col span={24}>
              <br/>
              <Button size="large">暂存文章</Button>&nbsp;
              <Button type="primary" size="large" onClick={saveArticle}>发布文章</Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
}
export default AddArticle