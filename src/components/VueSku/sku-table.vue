<style lang="sass" scoped>
.flex
  display: flex

  .guide_coefficient
    margin-right: 20px
</style>
<style lang="scss">
  .logo-uploader{
    .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .el-upload:hover {
      border-color: #409EFF;
    }
    .logo-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 60px;
      height: 60px;
      line-height: 60px;
      text-align: center;
    }
    .logo {
      width: 60px;
      height: 60px;
      display: block;
    }
  }
</style>

<template>
  <div class="container flex">
    <egrid
      border
      max-height="800"
      v-bind="$attrs"
      :data="data"
      :columns="columns"
      :columns-props="columnsProps"
      v-on="$listeners"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import { flatten } from '@/utils/sku'
import { diffArary } from '@/utils'
import ImgUpload from '@/components/ImgUpload'

export default {
  components: {
    ImgUpload
  },
  props: {
    skusData: {
      type: Array,
      default() {
        return []
      }
    }
  },

  data: () => ({
    picMax: 1, // 图片上传
    baseUrl: process.env.VUE_APP_BASE_API,
    data: [],
    coefficient: {
      purchase_coefficient: 0,
      guide_coefficient: 1.2
    },
    columnsProps: {
      align: 'center',
      minWidth: 100
    }
  }),
  computed: {
    skusList() {
      return flatten(this.skusData).map(item => ({
        skus: item.skus,
        sku_id: item.skus.reduce(
          (total, prev, index) =>
            `${total}${prev.k_id}-${prev.v_id}${
              index === item.skus.length - 1 ? '' : '_'
            }`,
          '',
        )
      }))
    },
    columns() {
      const specList = this.skusData.map(item => ({
        label: item.value,
        formater(row) {
          const sku = row.skus.find(sku => sku.k === item.value)
          return sku.v
        }
      }))
      return [
        ...specList,
        {
          label: '图片',
          width: 120,
          component: Vue.extend({
            props: {
              row: {
                type: Object,
                default: () => {
                }
              },
              picMax: {
                type: Number,
                default: 1
              }
            },
            methods: {
              // 图片上传模块
              imageChoose(imgArray) {
                this.row.images = imgArray
                // if (imgArray.length > 0) {
                //   const that = this
                //   imgArray.forEach(item => {
                //     // 这里的this指向前面对象的this
                //     that.row.images.item
                //   })
                //   // imgArray.forEach(item => {
                //   //   // 这里的this指向前面对象的this
                //   //   that.form.image_path.push(item.image_path);
                //   // });
                // }
                // this.$refs.row.validateField('images')
                // this.imageModalConfig.visible = false;
              },
              // 拖拽后触发
              changeImg(val) {
                this.row.images = val
              }
            },
            render() {
              return (
                <ImgUpload
                  img-data={this.row.images}
                  picMax={this.picMax}
                  on-chooseImg={this.imageChoose}
                  on-changePsit={this.changeImg}
                >
                </ImgUpload>
              )
            }
          })
        },
        {
          label: '价格',
          width: 150,
          component: Vue.extend({
            props: ['row'],
            render() {
              return (
                <ElInputNumber
                  placeholder='请输入价格'
                  value={this.row.current_price}
                  step={1}
                  min={0}
                  controls={false}
                  precision={0}
                  style={'width:100%'}
                  oninput={e => (this.row.current_price = e)}
                ></ElInputNumber>
              )
            }
          })
        },
        {
          label: '重量（公斤）',
          width: 150,
          component: Vue.extend({
            props: ['row'],
            render() {
              return (
                <ElInputNumber
                  placeholder='请输入重量'
                  value={this.row.weight}
                  step={1}
                  min={0}
                  controls={false}
                  precision={0}
                  style={'width:100%'}
                  oninput={e => (this.row.weight = e)}
                ></ElInputNumber>
              )
            }
          })
        },
        {
          label: '库存（件）',
          width: 150,
          component: Vue.extend({
            props: ['row'],
            render() {
              return (
                <ElInputNumber
                  placeholder='请输入库存'
                  value={this.row.num}
                  step={1}
                  min={0}
                  controls={false}
                  precision={0}
                  style={'width:100%'}
                  oninput={e => (this.row.num = e)}
                ></ElInputNumber>
              )
            }
          })
        }
      ]
    }
  },

  watch: {
    skusList: {
      deep: true,
      immediate: true,
      handler(newSkus, oldSkus) {
        if (!newSkus.length) return (this.data = [])
        if (!oldSkus || !oldSkus.length) return this.initData(newSkus)
        if (newSkus.length === oldSkus.length) {
          // 当规格名和规格值数量未发生变化，更新 skus 即可
          return (this.data = newSkus.map((item, index) => ({
            ...this.data[index],
            ...item
          })))
        }
        // 当规格名的数量发生了变化
        if (newSkus[0].skus.length !== oldSkus[0].skus.length) { return this.initData(newSkus) }
        const diffIds = this.diffIds(newSkus, oldSkus)
        if (newSkus.length > oldSkus.length) {
          // 当添加了规格值
          const data = []
          newSkus.forEach(item => {
            const sku = this.data.find(_item => _item.sku_id === item.sku_id)
            if (sku) {
              data.push(sku)
            } else {
              data.push({
                ...item,
                images: '', // 图片
                weight: 0, // 重量
                num: 0, // 库存
                current_price: 0 // 价格
              })
            }
          })
          this.data = data
        } else {
          // 当删除了规格值
          this.data = this.data.filter(_item => !diffIds.includes(_item.sku_id))
        }
      }
    },
    data: {
      deep: true,
      immediate: true,
      handler(newData, oldData) {
        this.$store.dispatch('sku/setSkuList', newData)
        const priceInfo = {}
        priceInfo.minPrice = Math.min.apply(null, newData.map((o) => { return o.current_price }))
        priceInfo.minWeight = Math.min.apply(null, newData.map((o) => { return o.weight }))
        priceInfo.totalNum = newData.map((o) => { return o.num }).reduce((first, second) => {
          return first + second
        }, 0)
        this.$store.dispatch('sku/setPriceInfo', priceInfo)
      }
    }
  },

  methods: {
    diffIds(skusList1, skusList2) {
      // 两个数据的 sku_id 进行相差
      skusList1 = skusList1.map(item => item.sku_id)
      skusList2 = skusList2.map(item => item.sku_id)
      return diffArary(skusList1, skusList2)
    },

    initData(skusList) {
      if (this.data.length === 0) {
        this.data = skusList.map(item => ({
          ...item,
          // 初始化属性
          images: '',
          weight: 0, // 为了方便展示数据，这里默认设置为 100
          num: 0,
          current_price: 0
        }))
      }
    }

  }
}
</script>
