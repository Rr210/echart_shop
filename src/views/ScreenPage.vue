<template>
  <div>
    <div class="k_w">
      <section>
        <trend class="item_w"></trend>
        <seller class="item_w"></seller>
      </section>
      <section>
        <Map class="item_w"></Map>
        <rank class="item_w"></rank>
      </section>
      <section>
        <hot class="item_w"></hot>
        <stock class="item_w"></stock>
      </section>
    </div>
  </div>
</template>

<script>
import Hot from '../components/Hot.vue'
import Map from '../components/Map.vue'
import Rank from '../components/Rank.vue'
import Seller from '../components/Seller.vue'
import Stock from '../components/Stock.vue'
import Trend from '../components/Trend.vue'
import { mapState } from 'vuex'
import { getThemeValue } from '../utils/theme_utils'
export default {
  created() {
    // 注册接收到数据的回调函数
    // this.$socket.registerCallBack('fullScreen', this.recvData)
    // this.$socket.registerCallBack('themeChange', this.recvThemeChange)
  },
  // destroyed() {
  //   this.$socket.unRegisterCallBack('fullScreen')
  //   this.$socket.unRegisterCallBack('themeChange')
  // },
  data() {
    return {
      // 定义每一个图表的全屏状态
      fullScreenStatus: {
        trend: false,
        seller: false,
        map: false,
        rank: false,
        hot: false,
        stock: false
      }
    }
  },
  methods: {
    changeSize(chartName) {
      // 1.改变fullScreenStatus的数据
      this.fullScreenStatus[chartName] = !this.fullScreenStatus[chartName]
      // 2.需要调用每一个图表组件的screenAdapter的方法
      this.$refs[chartName].screenAdapter()
      this.$nextTick(() => {
        this.$refs[chartName].screenAdapter()
      })
      // // 将数据发送给服务端
      // const targetValue = !this.fullScreenStatus[chartName]
      // this.$socket.send({
      //   action: 'fullScreen',
      //   socketType: 'fullScreen',
      //   chartName: chartName,
      //   value: targetValue
      // })
    },
    // 接收到全屏数据之后的处理
    recvData(data) {
      // 取出是哪一个图表需要进行切换
      const chartName = data.chartName
      // 取出, 切换成什么状态
      const targetValue = data.value
      this.fullScreenStatus[chartName] = targetValue
      this.$nextTick(() => {
        this.$refs[chartName].screenAdapter()
      })
    },
    handleChangeTheme() {
      // 修改VueX中数据
      // this.$store.commit('changeTheme')
      this.$socket.send({
        action: 'themeChange',
        socketType: 'themeChange',
        chartName: '',
        value: ''
      })
    },
    recvThemeChange() {
      this.$store.commit('changeTheme')
    }
  },
  components: {
    Hot,
    Map,
    Rank,
    Seller,
    Stock,
    Trend
  },
  computed: {
    logoSrc() {
      return '/static/img/' + getThemeValue(this.theme).logoSrc
    },
    headerSrc() {
      return '/static/img/' + getThemeValue(this.theme).headerBorderSrc
    },
    themeSrc() {
      return '/static/img/' + getThemeValue(this.theme).themeSrc
    },
    containerStyle() {
      return {
        backgroundColor: getThemeValue(this.theme).backgroundColor,
        color: getThemeValue(this.theme).titleColor
      }
    },
    ...mapState(['theme'])
  }
}
</script>

<style lang="less" scoped>
.k_w {
  width: 100%;
  height: 100vh;
  display: flex;
  // justify-content: center;
  // align-items: center;
  flex-wrap: wrap;
  section {
    margin: 10px;
    flex: 25%;
    display: flex;
    flex-direction: column;
    .item_w{
      position: relative;
    }
  }
}
</style>
