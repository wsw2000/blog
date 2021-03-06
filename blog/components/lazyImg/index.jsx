import { Spin } from 'antd'
import './index.less';
import { connect } from 'react-redux'

function Iazyimg(props){
  return (
    <>
      {/* {console.log(props)} */}
      { 
        (props && props.src) ?
        <div style={{width:'100%',height:'100%'}} className={`${props.themeType == 3 ? "img-dark-responsive" : ''}`}>
          <img src={props.src} alt={props.alt}  />
        </div>
        : <div> 
            <Spin  tip="Loading..."/>
          </div>
      }
     
    </>
  )
}
export default connect(
  state => ({
    themeType: state.themeType,
  })
)(Iazyimg)