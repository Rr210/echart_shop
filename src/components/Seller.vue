<!--
 * @Description:
 * @Author: Harry
 * @Date: 2021-10-27 16:29:26
 * @Url: https://u.mr90.top
 * @github: https://github.com/rr210
 * @LastEditTime: 2021-10-27 19:33:31
 * @LastEditors: Harry
-->
<template>
  <div class="com-container">
    <div class="com-chart" ref="seller_ref"></div>
  </div>
</template>

<script>
import sellerO from '../assets/options/seller.js'
export default {
  data() {
    return {
      chartInstance: null,
      allData: [],
      currentPage: 1,
      totalPage: 0,
      page_num: 5,
      timer: null
    }
  },
  mounted() {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.resetOption)
    this.resetOption()
  },
  destroyed() {
    clearInterval(this.timer)
    window.removeEventListener('resize', this.resetOption)
  },
  methods: {
    // 初始化echartinstance
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref, 'chalk')
      this.chartInstance.setOption(sellerO)
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timer)
      })
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    // 获取图标数据
    async getData() {
      const pageNum = this.page_num
      const { data: res } = await this.$http.get('seller')
      this.allData = res
      this.totalPage =
        res.length % pageNum === 0
          ? res.length / pageNum
          : Math.floor(res.length / pageNum)
      this.allData.sort((a, b) => {
        return a.value - b.value
      })
      this.updateChart()
      this.startInterval()
    },
    // 更新图表数据
    updateChart() {
      const pageNum = this.page_num
      const start = (this.currentPage - 1) * pageNum
      const end = this.currentPage * pageNum
      const showData = this.allData.slice(start, end)
      const sValue = showData.map((v) => v.value)
      const sName = showData.map((x) => x.name)
      const option = {
        yAxis: {
          type: 'category',
          data: sName
        },
        series: [
          {
            data: sValue,
            itemStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: '#5052EE'
                },
                {
                  offset: 1,
                  color: '#Ab6ee5'
                }
              ])
            }
          }
        ]
      }
      this.chartInstance.setOption(option)
    },
    // 重复播放
    startInterval() {
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.timer = setInterval(() => {
        this.currentPage++
        // console.log(1)
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1
        }
        this.updateChart()
      }, 3000)
    },
    resetOption() {
      const titleFontSize = (this.$refs.seller_ref.offsetWidth / 100) * 3.6
      const adapteroption = {
        title: {
          text: '📊 商家销售统计',
          textStyle: {
            fontSize: titleFontSize
          }
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize
            }
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0]
            }
          }
        ]
      }
      this.chartInstance.setOption(adapteroption)
      this.chartInstance.resize()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
