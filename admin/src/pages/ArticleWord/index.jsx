import { message } from 'antd';
import { useEffect, useState } from 'react'
import apis from '../../utils/request'
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components';
import {
  PieChart
} from 'echarts/charts';
import {
  CanvasRenderer
} from 'echarts/renderers';

echarts.use(
  [TitleComponent, TooltipComponent, LegendComponent, PieChart, CanvasRenderer]
);

function ArticleWord(props) {
  useEffect(() => {
    apis.getArticlePie().then(res => {
      if (res.code == 1) {  
        message.error('未登录');
        props.history.push('/login')
        return
      }
      initPie(res.data.countList,res.data.total)
    })
  }, [props]);
  const initPie = (data,total) => {
    var chart = echarts.init(document.querySelector('.pieMain'));
    let option = {
      title: {
        text: `文章统计${total}篇`,
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: '50%',
          data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    window.addEventListener("resize", function () {
      // 让我们的图表调用 resize这个方法
      chart.resize();
    });
    option && chart.setOption(option)
  }
  return (
    <>
      <div className="pieMain" style={{ width:'50%',height: '400px' }}></div>
    </>
  )
}

export default ArticleWord