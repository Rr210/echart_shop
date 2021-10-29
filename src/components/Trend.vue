<!--
 * @Description:
 * @Author: Harry
 * @Date: 2021-10-27 19:41:04
 * @Url: https://u.mr90.top
 * @github: https://github.com/rr210
 * @LastEditTime: 2021-10-27 21:58:44
 * @LastEditors: Harry
-->
<template>
  <div class="com-container">
    <div class="title" :style="comStyle" @click="isXl = !isXl">
      <span>{{ currentSelect.text }}</span>
      <span class="xl">></span>
      <div class="select-con" v-show="isXl" :style="marginStyle">
        <div
          class="select-item"
          @click="labelSelect(item)"
          v-for="item in allData.type"
          :key="item.text"
        >
          {{ item.key !== currentSelect.key ? item.text : "" }}
        </div>
      </div>
    </div>
    <div class="com-chart" ref="trendRef"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chartInstance: null,
      allData: [],
      currentSelect: {
        key: 'map',
        text: '📊 ' + '地区销量趋势'
      },
      isXl: false,
      titleFontSize: 0
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
  computed: {
    comStyle() {
      return {
        fontSize: this.titleFontSize + 'px'
      }
    },
    marginStyle() {
      return {
        marginLeft: this.titleFontSize + 'px'
      }
    }
  },
  methods: {
    // 初始化图表
    // 数据标签
    labelSelect(e) {
      // this.allData
      this.currentSelect = {
        key: e.key,
        text: '📊 ' + e.text
      }
      this.updateChart()
    },
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.trendRef, 'chalk')
      const initOption = {
        xAxis: {
          type: 'category',
          boundaryGap: false
        },
        yAxis: {
          type: 'value'
        },
        tooltip: {
          trigger: 'axis' // 显示的数据
        },
        legend: {
          left: 20,
          top: '15%',
          icon: 'circle'
        },
        // 配置坐标轴的大小
        grid: {
          left: '3%',
          top: '35%',
          right: '4%',
          bottom: '1%',
          containLabel: true
        }
      }
      this.chartInstance.setOption(initOption)
    },
    async getData() {
      const { data: res } = await this.$http.get('trend')
      console.log(res)
      this.allData = res
      this.updateChart()
    },
    updateChart() {
      const colorArr1 = [
        'rgba(11,168,44,.5)',
        'rgba(44,110,255,.5)',
        'rgba(22,242,217,.5)',
        'rgba(254,33,30,.5)',
        'rgba(250,105,0,.5)'
      ]
      const colorArr2 = [
        'rgba(11,168,44,0)',
        'rgba(44,110,255,0',
        'rgba(22,242,217,0)',
        'rgba(254,33,30,0)',
        'rgba(250,105,0,0)'
      ]
      const key = this.currentSelect.key
      // x轴数据
      const dateM = this.allData.common.month
      // y轴的数据
      const cityName = this.allData[`${key}`].data.map((x) => x.name)
      const commodity = this.allData[`${key}`].data.map((x, i) => {
        return {
          name: x.name,
          type: 'line',
          data: x.data,
          stack: 'map',
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: colorArr1[i] },
              { offset: 1, color: colorArr2[i] }
            ])
          }
        }
      })
      const updateOption = {
        xAxis: {
          data: dateM
        },
        // 多条数据的处理
        legend: {
          data: cityName
        },
        series: commodity
      }
      this.chartInstance.setOption(updateOption)
    },
    screenAdapter() {
      this.titleFontSize = (this.$refs.trendRef.offsetWidth / 100) * 3.6
      const adapterOption = {
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
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  position: absolute;
  z-index: 1;
  color: #fff;
  top: 20px;
  font-size: 22px;
  left: 10px;
}
.xl {
  position: absolute;
  right: -13%;
  top: 0.2vw;
  font-weight: 550;
  transform: rotateZ(90deg);
}
.select-con {
  background-color: #222733;
}
</style>
