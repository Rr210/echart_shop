<!--
 * @Description:
 * @Author: Harry
 * @Date: 2021-10-28 10:20:10
 * @Url: https://u.mr90.top
 * @github: https://github.com/rr210
 * @LastEditTime: 2021-10-28 15:50:28
 * @LastEditors: Harry
-->
<template>
  <div class="com-container">
    <div class="com-chart" ref="rankRef"></div>
  </div>
</template>

<script>
export default {
  name: 'Rank',
  data() {
    return {
      chartInstance: null,
      titleFontSize: 0,
      startValue: 0,
      endValue: 10,
      timerId: null
    }
  },
  mounted() {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.adapterChart)
    this.adapterChart()
  },
  destroyed() {
    window.removeEventListener('resize', this.adapterChart)
    clearInterval(this.timerId)
  },
  methods: {
    // 初始化图例
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.rankRef, 'chalk')
      const initOption = {
        title: {
          text: '📊 地区销售排行',
          top: '5%',
          left: '5%'
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value'
        },
        // 鼠标触碰时的详情介绍
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
        // 通过grid控制图表的大小以及位置信息
        grid: {
          top: '40%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },
        series: {
          type: 'bar',
          label: {
            show: true,
            position: 'top',
            textStyle: {
              color: 'white'
            }
          }
        }
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    // 数据的获取
    async getData() {
      const { data: res } = await this.$http.get('rank')
      console.log(res)
      res.sort((a, b) => b.value - a.value)
      this.allData = res
      this.updateChart()
      this.startInterval()
    },
    // 进行图表的更新
    updateChart() {
      // x轴数据
      // 颜色值
      const colorList = [
        ['#3e5151', '#decba4'],
        ['#f05053', '#e1eec3'],
        ['#5052EE', '#Ab6ee5']
      ]
      const x = this.allData.map((v) => v.name)
      const y = this.allData.map((v) => v.value)
      const updateOption = {
        xAxis: {
          data: x
        },
        dataZoom: {
          show: true,
          startValue: this.startValue,
          endValue: this.endValue
        },
        series: {
          data: y,
          itemStyle: {
            // 1，0，0，1分别代表了右、下、左、上四个位置的颜色坐标
            color: (arg) => {
              let targetColor = null
              if (arg.value > 300) {
                targetColor = colorList[0]
              } else if (arg.value > 200) {
                targetColor = colorList[1]
              } else {
                targetColor = colorList[2]
              }
              return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: targetColor[0]
                },
                {
                  offset: 1,
                  color: targetColor[1]
                }
              ])
            }
          }
        }
      }
      this.chartInstance.setOption(updateOption)
    },
    // 分页加载
    pagingChart() {},
    // 屏幕的适配
    adapterChart() {
      this.titleFontSize = (this.$refs.rankRef.offsetWidth / 100) * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize
          }
        },
        series: {
          barWidth: this.titleFontSize,
          itemStyle: {
            barBorderRadius: [
              this.titleFontSize / 2,
              this.titleFontSize / 2,
              0,
              0
            ]
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    startInterval() {
      if (this.timerId) clearInterval(this.timerId)
      this.timerId = setInterval(() => {
        this.startValue++
        this.endValue++
        if (this.startValue > this.allData.length - 1) {
          this.startValue = 0
          this.endValue = 9
        }
        this.updateChart()
      }, 2000)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
