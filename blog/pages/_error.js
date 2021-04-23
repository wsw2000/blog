import { Result, Button } from 'antd';
import React, { Component } from 'react';
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'

class Other extends Component {
    state = {}
    render() {
        return (
           <div className='error-view'>
              <Header/>
              <Result
                style={{flex:1}}
                status="404"
                title="404"
                subTitle="对不起，您访问的页面不存在"
                extra={
                  <Button type="primary">
                    <Link href="/">
                      <a>返回主页</a>
                    </Link>
                  </Button>
                }
              />
              <Footer/>
           </div>
        );
    }
}

export default Other;