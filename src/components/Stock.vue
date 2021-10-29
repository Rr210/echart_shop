<!--
 * @Description:
 * @Author: Harry
 * @Date: 2021-10-28 18:57:36
 * @Url: https://u.mr90.top
 * @github: https://github.com/rr210
 * @LastEditTime: 2021-10-28 20:01:33
 * @LastEditors: Harry
-->
<template>
  <div class="com-container">
    <div class="com-chart" ref="stockRef"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      titleFontSize: 0,
      timerId: null,
      currentIndex: 0
    }
  },
  mounted() {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    clearInterval(this.timerId)
  },
  // computed() {},
  methods: {
    // 初始化图表
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.stockRef, 'chalk')
      const initOption = {
        title: {
          text: '📊 库存和销量分析',
          left: '5%',
          top: '5%'
        },
        tooltip: {
          show: true
        }
      }
      this.chartInstance.setOption(initOption)
    },
    async getData() {
      const { data: res } = await this.$http.get('stock')
      console.log(res)
      this.allData = res
      this.updateChart()
    },
    updateChart() {
      // 截取五个数据
      const centerList = [
        ['18%', '40%'],
        ['50%', '40%'],
        ['82%', '40%'],
        ['34%', '75%'],
        ['66%', '75%']
      ]
      const start = this.currentIndex * 5
      const end = (this.currentIndex + 1) * 5
      const showData = this.allData.slice(start, end)
      const seriesArr = showData.map((v, i) => {
        const colorList = [
          ['#DECBA4', '#3E5151'],
          ['#FC5C7D', '#6A82FB'],
          ['#fffbd5', '#b20a2c'],
          ['#fdbb2d', '#22c1c3'],
          ['#48b1bf', '#06beb6']
        ]
        return {
          type: 'pie',
          radius: [this.titleFontSize * 2, this.titleFontSize * 1.45],
          labelLine: {
            show: false
          },
          label: {
            position: 'center',
            color: colorList[i][0],
            fontSize: this.titleFontSize / 2
          },
          data: [
            {
              value: v.stock,
              itemStyle: {
                color: '#333843'
              }
            },
            {
              name: v.name + '\n' + v.sales,
              value: v.sales,
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  { offset: 0, color: colorList[i][0] },
                  { offset: 1, color: colorList[i][1] }
                ])
              }
            }
          ],
          center: centerList[i]
        }
      })
      const updateOption = {
        series: seriesArr
      }
      this.chartInstance.setOption(updateOption)
      this.startInterval()
    },
    screenAdapter() {
      this.titleFontSize = (this.$refs.stockRef.offsetWidth / 100) * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize
          }
        }
      }
      // this.updateChart()
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    startInterval() {
      if (this.timerId) clearInterval(this.timerId)
      this.timerId = setInterval(() => {
        this.currentIndex++
        if (this.currentIndex > this.allData.length / 5) {
          this.currentIndex = 0
        }
        this.updateChart()
      }, 3000)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
