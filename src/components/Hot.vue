<!--
 * @Description:
 * @Author: Harry
 * @Date: 2021-10-28 15:52:11
 * @Url: https://u.mr90.top
 * @github: https://github.com/rr210
 * @LastEditTime: 2021-10-28 19:50:57
 * @LastEditors: Harry
-->
<template>
  <div class="com-container">
    <div class="com-chart" ref="hotRef"></div>
    <span class="pre" @click="pre" :style="jtSize">&lt;</span>
    <span class="next" @click="next" :style="jtSize">&gt;</span>
    <span class="name_label" :style="jtSize">{{ catname }}</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      currentIndex: 0,
      titleFontSize: 0
    }
  },
  computed: {
    catname() {
      return !this.allData ? '' : this.allData[this.currentIndex].name
    },
    jtSize() {
      return {
        fontSize: this.titleFontSize + 'px'
      }
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
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.hotRef, 'chalk')
      const initOption = {
        title: {
          top: '5%',
          left: '5%',
          text: '📊 热销产品占比'
        },
        series: {
          type: 'pie'
        },
        legend: {
          top: '15%',
          icon: 'circle'
        },
        tooltip: {
          trigger: 'item',
          formatter: (arg) => {
            const total = arg.data.children.reduce((a, b) => a + b.value, 0)
            let str = ''
            arg.data.children.forEach((v) => {
              str += `${v.name}:${((v.value / total) * 100).toFixed(0)}% </br>`
            })
            return str
          },
          axisPointer: {}
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
    async getData() {
      const { data: res } = await this.$http.get('hot')
      this.allData = res
      console.log(res)
      this.updateChart()
    },
    updateChart() {
      const legendData = this.allData[this.currentIndex].children.map(
        (i) => i.name
      )
      const seriesData = this.allData[this.currentIndex].children.map((i) => {
        return {
          name: i.name,
          value: i.value,
          children: i.children
        }
      })
      const updateOption = {
        legend: {
          data: legendData
        },
        series: {
          data: seriesData
        }
      }
      this.chartInstance.setOption(updateOption)
    },
    screenAdapter() {
      this.titleFontSize = (this.$refs.hotRef.offsetWidth / 100) * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize
          }
        },
        series: {
          // 饼图的大小
          radius: this.titleFontSize * 4.5,
          center: ['50%', '60%']
        },
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize,
          textStyle: {
            fontSize: this.titleFontSize / 2
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    pre() {
      this.currentIndex--
      if (this.currentIndex < 0) {
        this.currentIndex = this.allData.length - 1
      }
      this.updateChart()
    },
    next() {
      this.currentIndex++
      if (this.currentIndex > this.allData.length - 1) {
        this.currentIndex = 0
      }
      this.updateChart()
    }
  }
}
</script>

<style lang="less" scoped>
.pre,
.next {
  position: absolute;
  top: 60%;
  transform: translate(-50%);
  color: #fff;
  font-size: 50px;
  z-index: 1;
  cursor: pointer;
}
.pre {
  left: 10%;
}
.next {
  right: 10%;
}
.name_label {
  position: absolute;
  bottom: 10%;
  right: 5%;
  color: #fff;
  // font-size: 30px;
}
</style>
