/***
 * @Description:
 * @Author: Harry
 * @Date: 2021-10-27 19:18:46
 * @Url: https://u.mr90.top
 * @github: https://github.com/rr210
 * @LastEditTime: 2021-10-29 09:20:24
 * @LastEditors: Harry
 */
const seller = {
  title: {
    text: '📊 商家销售统计',
    textStyle: {
      fontSize: 50
    },
    left: 20,
    top: 20
  },
  grid: {
    top: '20%',
    left: '3%',
    right: '6%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'value'
  },
  yAxis: {
    type: 'category'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'line',
      z: 0,
      lineStyle: {
        color: '#2d3443',
        width: 66
      }
    }
  },
  series: [
    {
      type: 'bar',
      barWidth: 66,
      label: {
        show: true,
        position: 'right',
        textStyle: {
          color: 'white'
        }
      },
      itemStyle: {
        barBorderRadius: [0, 33, 33, 0]
      }
    }
  ]
}
export default seller
