import React, { useEffect } from 'react';
import useFetchState  from '../../utils/useFetchState'
import marked from 'marked'
import hljs from "highlight.js";
import moment from 'moment'
import "highlight.js/styles/monokai-sublime.css";  // highlight颜色
import './index.css'
import { Row, Col, Input, Select, Button, DatePicker,message ,Upload,Switch } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import apis from '../../utils/request'
import { timeFilter,getBase64,beforeUpload } from '../../utils/index.js'

import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
const { Option } = Select;
const { TextArea } = Input
function AddArticle(props) {
  const [articleId, setArticleId] = useFetchState(0)  // 文章的ID，如果是0说明是新增加，如果不是0，说明是修改
  const [articleTitle, setArticleTitle] = useFetchState('')   //文章标题
  // const [articleContent, setArticleContent] = useFetchState('')  //markdown的编辑内容
  // const [markdownContent, setMarkdownContent] = useFetchState('预览内容') //html内容
  const [introducemd, setIntroducemd] = useFetchState()            //简介的markdown内容
  const [introducehtml, setIntroducehtml] = useFetchState('等待编辑') //简介的html内容
  const [showDate, setShowDate] = useFetchState('2000-01-25')   //发布日期
  // const [updateDate, setUpdateDate] = useFetchState() //修改日志的日期
  const [typeInfo, setTypeInfo] = useFetchState([]) // 文章类别信息
  const [selectedType, setSelectType] = useFetchState('请选择类别') //选择的文章类别
  const [loading, setLoading] = useFetchState(false);
  const [imgUrl, setImgUrl] = useFetchState('');
  const [isShow,setIsShow] = useFetchState(false);   //页面是否展示主图
  
  const [editorState,setEditorState] = useFetchState(BraftEditor.createEditorState(null))

  
  //根据id获取文章详情
  const getArticleById = async(id) =>{
    const {data:res} = await apis.getArticleById(id)
    if(res.code !== 1) return
    setArticleTitle(res.data[0].title)
    // setArticleContent(res.data[0].content)
    setEditorState(BraftEditor.createEditorState(res.data[0].content) )
    setIntroducemd(res.data[0].introduce)
    let html=marked(res.data[0].content)
    // setMarkdownContent(html)
    
    let tmpInt = marked(res.data[0].introduce)
    setIntroducehtml(tmpInt)
    setShowDate( timeFilter(res.data[0].addTime) )
    console.log(res.data[0]);
    setSelectType(res.data[0].typeid)
    setImgUrl(res.data[0].imgUrl)
    setIsShow(res.data[0].isShow)
  }
  useEffect(()=>{
    // const openId = localStorage.getItem('openId')
      //文章类别 + 路由守卫
    const getTypeInfo = async() =>{
      const {data:res} = await apis.getTypeInfo()
      console.log(res);
      if(res.data === '登录失败' || res.code != 1){
        localStorage.removeItem('openId')
        props.history.push('/login')  
      }else {
        setTypeInfo(res.typedatas)
      }
    }
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
    highlight: function (code) {
      // 高亮显示规则
      return hljs.highlightAuto(code).value;
    }
  })

  // const changeContent = (e)=>{
  //   setArticleContent(e.target.value)  //markdown的编辑内容
  //   let html = marked(e.target.value) 
  //   setMarkdownContent(html) //预览html内容
  // }
  const handleEditorChange = (editorState) => {
    setEditorState(editorState)
    // setOutputHTML(editorState.toHTML())
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
    }else if(!editorState.toHTML()){
        message.error('文章内容不能为空')
        return false
    }else if(!introducemd){
        message.error('简介不能为空')
        return false
    }else if(!showDate){
        message.error('发布日期不能为空')
        return false
    }
    const addArticle = {
      type_id:selectedType,
      title:articleTitle,
      content:editorState.toHTML(),
      introduce:introducemd,
      imgUrl:imgUrl,
      addTime:(new Date(showDate).valueOf()),
      isShow:isShow
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
  const  handleChange = info => {
    console.log(info);
    if (info.file.status === 'uploading' ) {
      setLoading(true)
      return;
    }
    if (info.file.status === 'done' && info.file.response.code !== -1 ) {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>{
        setLoading(false)
        // console.log(imageUrl)
      });
    }
    if(info.file.response.code === 200) {
      setImgUrl(info.file.response.data.avatar)
      message.success('上传成功')
    }else if(info.file.response.code === 500){
      message.success('上传失败')
    }
  };
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
              <Select value={selectedType} size="large" onSelect={value => setSelectType(value)}>
                {
                  typeInfo.map(item =>{
                    return (
                      <Option disabled={ item.id === 4 } key={item.id} value={item.id}>{item.typeName}</Option>
                    )
                  })
                }
              </Select>
            </Col>
          </Row>
          <br />
          <Row gutter={10} >
            <Col span={24}>
              <BraftEditor
                className="markdown-content" 
                value={editorState}
                onChange={handleEditorChange}
                onSave={handleEditorChange}
              />
            </Col>
            {/* <Col span={12}>
              <div
                className="show-html"
                dangerouslySetInnerHTML = {{__html:markdownContent}} >
              </div>
              //  <div className="show-html">
              //   {outputHTML}
              // </div>
            </Col> */}
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
            <Col span={24}>
              <div className="date-select">
                <DatePicker
                  value={moment(showDate, 'YYYY-MM-DD')}
                  onChange={(date,dateString)=>{
                    setShowDate(dateString)   //2021-03-03
                  }}
                  placeholder="发布日期"
                  size="large"
                />
              </div>
            </Col>
            <Col span={24}>
              <br/>
              <Button style={{width:'100%'}} type="primary" size="large" onClick={saveArticle}>发布文章</Button>
            </Col>
            <Col span={24}>
              <br/>
              <Input
                placeholder="文章主图"
                size="large"
                value={imgUrl}
                allowClear
                onChange={e=>{
                  setImgUrl(e.target.value)}} />
                  
            </Col>
            <Col span={24} style={{display:'flex',alignItems:'center',margin:'20px 0'}}>
              <Upload
                name='avatar'
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action={`${apis.baseURL}/saveAvatar`}
                beforeUpload={beforeUpload}
                onChange={handleChange}
                style={{width:'50%'}}
              >
              {                
                <div>
                  {loading ? <LoadingOutlined /> : <PlusOutlined />}
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              }
              </Upload>
              <div>
                是否展示：<Switch checked={isShow} onChange={checked=>{setIsShow(checked)}} />
              </div>
            </Col>
            <Col span={24}>
              { 
                imgUrl ? <img src={imgUrl} alt="avatar" style={{ width: '100%' }} /> 
                : null
              }
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
}
export default AddArticle