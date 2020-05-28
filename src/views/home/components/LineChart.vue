<template>
  <div :class="className" :style="{height:height,width:width}" />

</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      handler(newValue, oldValue) {
        if (newValue) {
          this.setOptions(newValue)
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      // this.setOptions(this.chartData)
    },
    setOptions({ order_amount, order_count } = {}) {
      this.chart.setOption({
        title: {
          // 1.标题居中
          // left的值为'left', 'center', 'right'
          left: 'left',
          // 默认为10
          // 2.主副标题之间的间距
          itemGap: 40,
          text: '近7日销售额趋势图',
          textStyle: {
            // 文字颜色
            color: '#333',
            // 字体风格,'normal','italic','oblique'
            fontStyle: 'normal',
            // 字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
            fontWeight: 'bold',
            // 字体系列
            fontFamily: 'sans-serif',
            // 字体大小
            fontSize: 18
          },
          // 4.副标题
          subtext: '',
          // 副标题文本样式
          subtextStyle: {}
        },

        // x轴
        xAxis: {
          data: order_amount.date,
          boundaryGap: false, // 是否抵着边
          // 是否显示刻度线
          axisTick: {
            show: false
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#666' // 颜色
            }
          }
        },
        grid: {
          left: 40,
          right: 40,
          bottom: 20,
          top: 60,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#666' // 颜色
            }
          }
        },
        // legend: {
        //   data: ['销售额']
        // },
        series: [{
          name: '销售额', itemStyle: {
            normal: {
              color: '#FF005A',
              lineStyle: {
                color: '#FF005A',
                width: 2
              },
              areaStyle: {
                color: '#ff005a1f'
              }
            }
          },
          smooth: true,
          type: 'line',
          data: order_amount.count,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        }
        // {
        //   name: '订单数',
        //   smooth: true,
        //   type: 'line',
        //   itemStyle: {
        //     normal: {
        //       color: '#3888fa',
        //       lineStyle: {
        //         color: '#3888fa',
        //         width: 2
        //       },
        //       areaStyle: {
        //         color: '#f3f8ff'
        //       }
        //     }
        //   },
        //   data: order_count.count,
        //   animationDuration: 2800,
        //   animationEasing: 'quadraticOut'
        // }
        ]
      })
    }
  }
}
</script>
