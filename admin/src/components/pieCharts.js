
import {useEffect} from 'react';
let echarts = require("echarts/lib/echarts");
//饼状图
require("echarts/lib/chart/pie");

// 引入提示框和标题组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
require("echarts/lib/component/legend");
require("echarts/lib/component/graphic");
function PieCharts(props) {
  useEffect(() =>{
    initPie()
  })
  const initPie = () => {
    var chart = echarts.init(document.querySelector('.pieMain'));
    let option = {
      color: ["#f8e367", "#99dfff", "#58c0f0", "#5ea6ff", "#ff9e48", "#bcbcbc"],
      series: [{
        name: "驾驶分析",
        type: "pie",
        radius: ['60%', '80%'],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: false,
            position: 'center'
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: '30',
              fontWeight: 'bold'
            }
          }
        },
        labelLine: {
          normal: {
            show: true
          }
        },
        data: props.data
      }]
    };
    window.addEventListener("resize", function () {
      // 让我们的图表调用 resize这个方法
      chart.resize();
    });
    chart.setOption(option)
  }
  return (
    <div className="pieMain"></div>
  )
}
export default PieCharts