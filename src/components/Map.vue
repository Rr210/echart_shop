<!--
 * @Description:
 * @Author: Harry
 * @Date: 2021-10-27 22:00:49
 * @Url: https://u.mr90.top
 * @github: https://github.com/rr210
 * @LastEditTime: 2021-10-28 15:39:40
 * @LastEditors: Harry
-->
<template>
  <div class="com-container">
    <div class="com-chart" ref="mapRef" @dblclick="reseverMap"></div>
  </div>
</template>

<script>
import { getProvinceMapInfo } from '../utils/map_utils.js'
import axios from 'axios'
export default {
  name: 'Map',
  data() {
    return {
      chartInstance: null,
      titleFontSize: 0,
      currentPor: {
        name: '',
        data: null
      }
    }
  },
  mounted() {
    this.getData()
    this.initChart()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  // computed() {},
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    // 初始化图表
    async initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.mapRef, 'chalk')
      const { data: res } = await axios.get(
        'http://localhost:8080/map/china.json'
      )
      this.$echarts.registerMap('china', res)
      const initOption = {
        title: {
          text: '📊 商家分布',
          top: 20,
          left: 20
        },
        geo: {
          type: 'name',
          map: 'china',
          itemStyle: {
            areaColor: '#2e72bf',
            borderColor: '#333'
          }
        }
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('click', async(arg) => {
        const name = getProvinceMapInfo(arg.name)
        if (name.key !== this.currentPor.name.key) {
          const { data: res } = await axios.get(
            `http://localhost:8080${name.path}`
          )
          this.currentPor = {
            name,
            data: res
          }
        }
        // 将点击后获取的省份的数据重新再次渲染到页面中/
        this.$echarts.registerMap(name.key, this.currentPor.data)
        const clickOption = {
          geo: {
            map: name.key
          }
        }
        this.chartInstance.setOption(clickOption)
      })
    },
    // 获取数据
    async getData() {
      const { data: res } = await this.$http.get('map')
      console.log(res)
      const legendName = res.map((x) => {
        return x.name
      })
      const seriesOption = res.map((x) => {
        return {
          type: 'effectScatter',
          rippleEffect: {
            scale: 8,
            brushType: 'stroke'
          },
          name: x.name,
          data: x.children,
          coordinateSystem: 'geo'
        }
      })
      const option = {
        legend: {
          data: legendName,
          bottom: '5%',
          left: '5%',
          orient: 'vertical'
        },
        series: seriesOption
      }
      this.chartInstance.setOption(option)
      this.updateChart()
    },
    // 更新图表
    updateChart() {},
    // 适配屏幕
    screenAdapter() {
      this.titleFontSize = (this.$refs.mapRef.offsetWidth / 100) * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize
          },
          legend: {
            textStyle: {
              fontSize: this.titleFontSize / 1.2
            },
            itemGap: this.titleFontSize / 1.2,
            itemWidth: this.titleFontSize / 1.2,
            itemHeight: this.titleFontSize / 1.2
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    // 双击的事件监听
    reseverMap() {
      const reseveOption = {
        geo: {
          map: 'china'
        }
      }
      this.chartInstance.setOption(reseveOption)
    }
  }
}
</script>

<style>
</style>
