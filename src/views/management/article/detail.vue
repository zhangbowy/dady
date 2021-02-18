<template>
  <div class="goods-detail">
    <div class="title-info">
      <card-tag :tag-name="$t('商品详情')" />
    </div>
    <!-- 表单部分 -->
    <div class="form-info">
      <el-form ref="form" :model="form" label-width="80px" label-position="top" size="small">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane :label="$t('基本信息')" name="1">
            <div class="form-content-item">
              <div class="block-title"><card-tag :tag-name="$t('基本信息')" /></div>
              <div class="block-content">
                <el-form-item :label="$t('商品标题')" prop="name">
                  <el-input v-model="form.name" disabled />
                </el-form-item>
                <el-form-item :label="$t('分享描述')" prop="name">
                  <el-input v-model="form.desc" disabled />
                </el-form-item>
                <el-form-item :label="$t('商品图片')">
                  <img-upload
                    :img-data="form.images"
                    :pic-max="5"
                    disabled
                  />
                </el-form-item>
                <el-form-item :label="$t('商品分类')" prop="category_id">
                  <el-cascader
                    v-model="form.category_id"
                    :options="categories"
                    :props="optionProps"
                    :placeholder="$t('选择商品分类')"
                    clearable
                    disabled
                  />
                </el-form-item>
              </div>
            </div>
            <div class="form-content-item">
              <div class="block-title"><card-tag :tag-name="$t('开启定制')" /></div>
              <div class="block-content">
                <el-form-item label="">
                  <el-switch
                    v-model="form.is_custom"
                    disabled
                    :active-text="$t('开启')"
                    :inactive-text="$t('关闭')"
                    :active-value="1"
                    :inactive-value="0"
                  />
                  <el-select v-model="form.custom_category_id" :placeholder="$t('请选择定制分类')" :disabled="form.is_custom==0">
                    <el-option
                      v-for="item in customCategory"
                      :key="item.custom_category_id"
                      disabled
                      :label="item.custom_category_name"
                      :value="item.custom_category_id"
                    />
                  </el-select>
                </el-form-item>
              </div>
            </div>
            <div class="form-content-item">
              <div class="block-title"><card-tag :tag-name="$t('开启预售')" /></div>
              <div class="block-content">
                <el-form-item label="">
                  <el-switch
                    v-model="form.is_presell"
                    disabled
                    :active-text="$t('开启')"
                    :inactive-text="$t('关闭')"
                    :active-value="1"
                    :inactive-value="0"
                  />
                </el-form-item>
              </div>
            </div>
            <div class="form-content-item">
              <div class="block-title"><card-tag :tag-name="$t('物流信息')" /></div>
              <div class="block-content">
                <el-form-item :label="$t('物流设置')">
                  <el-radio-group v-model="form.express_type" disabled>
                    <el-radio :label="0">{{ $t('包邮') }}</el-radio>
                    <el-radio :label="1" style="margin-right: 0">{{ `${$t('统一运费')}${$t('：')}` }} </el-radio>
                    <el-input v-model="form.express_fee" type="number" style="width: 25%; margin-right: 30px" :disabled="form.express_type!=1">
                      <template slot="append">{{ $t('元') }}</template>
                    </el-input>
                    <el-radio :label="2" style="margin-right: 0">{{ `${$t('物流模板')}${$t('：')}` }}  </el-radio>
                    <el-select v-model="form.express_template_id" :placeholder="$t('请选择物流模板')" :disabled="form.express_type!=2">
                      <el-option
                        v-for="item in expressList"
                        :key="item.express_template_id"
                        :label="item.express_template_name"
                        :value="item.express_template_id"
                        disabled
                      />
                    </el-select>
                  </el-radio-group>
                </el-form-item>
              </div>
            </div>
            <div class="form-content-item">
              <div class="block-title"><card-tag :tag-name="$t('商品详情')" /></div>
              <el-form-item style="padding:10px 10px">
                <tinymce-editor
                  ref="editor"
                  v-model="form.detail"
                  :disabled="true"
                />
                <!-- <mavon-editor ref="editor" v-model="form.detail" @save="saveDetail" @change="updateDetail" /> -->
              </el-form-item>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('商品规格')" name="2">
            <div class="sku_container">
              <div v-for="(spec, index) in specification" :key="spec.id" class="sku_group mb10">
                <div class="spec_title">
                  <span class="label">{{ `${$t('规格名')}${$t('：')}` }}</span>
                  <el-input v-model.trim="spec.value" class="input" :placeholder="$t('请输入规格名')" disabled />
                </div>
                <div class="group_container">
                  <span class="label">{{ `${$t('规格值')}${$t('：')}` }}</span>
                  <el-popover
                    v-for="(option, option_index) in spec.leaf"
                    :key="option_index"
                    placement="bottom"
                    width="120"
                    trigger="click"
                  >
                    <el-input v-model.trim="option.value" style="width: 110px;" disabled />
                    <div slot="reference" class="sku_item">
                      <div class="text">{{ option.value }}</div>
                    </div>
                  </el-popover>
                  <el-input
                    v-model="addValues[index]"
                    class="input"
                    uffix-icon="el-icon-plus"
                    :placeholder="$t('多个产品属性以空格隔开')"
                    disabled
                    @keyup.native.enter="addOption(index)"
                    @blur="addOption(index)"
                  />
                </div>
              </div>
            </div>
            <div class="sku_container">
              <sku-table ref="skutable" :skus-data="specificationFilter" />
              <!-- <vue-json-pretty :data="specificationFilter" /> -->
            </div>
            <div class="form-content-item">
              <div class="block-title"><card-tag :tag-name="$t('价格库存')" /></div>
              <div class="block-content">
                <el-form-item :label="$t('商品原价')" prop="old_price">
                  <el-input v-model="form.old_price" disabled>
                    <template slot="append">{{ $t('元') }}</template>
                  </el-input>
                </el-form-item>
                <el-form-item :label="$t('商品现价')" prop="current_price">
                  <el-input v-model="form.current_price" disabled>
                    <template slot="append">{{ $t('元') }}</template>
                  </el-input>
                </el-form-item>
                <el-form-item :label="$t('商品库存')" prop="sum_stock">
                  <el-input v-model="form.sum_stock" disabled>
                    <template slot="append">{{ $t('件') }}</template>
                  </el-input>
                </el-form-item>
                <el-form-item :label="$t('商品重量')" prop="weight">
                  <el-input v-model="form.weight" disabled>
                    <template slot="append">{{ $t('千克') }}</template>
                  </el-input>
                </el-form-item>
              </div>
            </div>
            <div class="form-content-item">
              <div class="block-title"><card-tag :tag-name="$t('小批量定制')" /></div>
              <div class="block-content">
                <el-form-item v-for="(rules, index) in batchRules" :key="index" prop="old_price">
                  <el-col :span="8">
                    <el-col class="line" :span="4">{{ $t('商品数量') }}</el-col>
                    <el-form-item prop="date1">
                      <el-input v-model="rules.number" disabled>
                        <template slot="append">{{ $t('件') }}</template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-col class="line" :span="4">{{ $t('商品价格') }}</el-col>
                    <el-form-item prop="date2">
                      <el-input v-model="rules.price" disabled />
                    </el-form-item>
                  </el-col>
                </el-form-item>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
        <el-form-item>
          <el-button type="primary" @click="()=>this.$router.push({path: `/commodity/goods/edit?id=${form.id}`})">{{ $t('编辑') }}</el-button>
          <el-button @click="()=>this.$router.go(-1)">{{ $t('返回') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import CardTag from '@/components/CardTag'
// import { mavonEditor } from 'mavon-editor' // 富文本编辑器
import TinymceEditor from '@/components/TinymceEditor'
import ImgUpload from '@/components/ImgUpload' // 图片上传
import SkuTable from '@/components/VueSku/sku-table' // skulist
import { goodDetail, Category } from '@/api/goods'
import { expressApi, customCateApi } from '@/api/system'
export default {
  components: {
    CardTag,
    TinymceEditor,
    ImgUpload,
    SkuTable
  },
  data() {
    return {
      id: '',
      picMax: 5, // 图片上传
      activeName: '1',
      form: {
      },
      batchRules: [],
      categories: [],
      expressList: [], // 运费模板
      customCategory: [], // 可定制分类
      // 分组选择配置项
      optionProps: {
        checkStrictly: true,
        expandTrigger: 'hover',
        value: 'id',
        label: 'category_name'
      },
      addValues: [],
      specification: [] // 规格数组
    }
  },
  computed: {
    disabled() {
      return this.specification.length > 3 || this.specification.some(item => !item.value)
    },
    // 过滤掉属性名和属性值为空的数据规格项目
    specificationFilter() {
      return this.specification.filter(item => item.value && item.leaf.length)
    }
  },
  created() {
    this.getCategory()
    this.getExpressList()
    this.getCategoryList()
    this.id = this.$route.query.id ? this.$route.query.id : ''
    if (this.$route.query.id) {
      this.fetchData(this.$route.query.id)
    }
  },
  methods: {
    getCategory() {
      Category.getList().then(res => {
        this.categories = res.data
      })
    },
    // 获取物流模板
    getExpressList() {
      expressApi.getExpressList().then(res => {
        this.expressList = res.data.data
      })
    },
    // 获取定制分类列表
    getCategoryList() {
      customCateApi.getCategoryList({ pageSize: 9999 }).then(res => {
        this.customCategory = res.data.data
      })
    },
    // 初始化商品详情
    fetchData(id) {
      goodDetail({
        id: id
      }).then(res => {
        this.form = res.data
        this.form.images = res.data.images
        this.$refs.skutable.data = res.data.sku_list
        this.specification = res.data.sku_show
        this.form.sku_show = res.data.sku_show
        this.form.sku_list = res.data.sku_list
        // console.log(this.form.sku_list)
      })
    },
    // tab选项卡切换
    handleClick(tab, event) {
    }
  }
}
</script>

<style lang="scss" scoped>
.goods-detail{
  padding: 15px;
  .title-info{
    background: #fff;
    border-radius: 10px 10px;
  }
  .form-info{
    padding: 10px;
    background: #fff;
    .form-content-item{
      margin-bottom: 20px;
      box-shadow: 0px 10px 20px #f3f4f3;
      .block-content{
        padding: 10px 30px 20px;
        background: #fff;
        .el-input{
          width: 50%;
        }
      }
    }
  }
}
</style>
<style lang="sass" scoped>
.sku_container
  margin-bottom: 30px
  font-size: 12px
  color: #666
  padding: 10px
  border: 1px solid #e5e5e5

.remove
  display: none
  position: absolute
  z-index: 2
  width: 18px
  height: 18px
  font-size: 14px
  line-height: 16px
  color: #fff
  text-align: center
  cursor: pointer
  background: rgba(0,0,0,.3)
  border-radius: 50%

.sku_group
  margin-bottom: 10px
  &:hover
    .spec_title .remove
      display: block

.spec_title
  position: relative
  padding: 7px 10px
  background-color: #f8f8f8
  line-height: 16px
  font-weight: 400

  .input
    width: 200px

  .remove
    top: 12px
    right: 10px

.group_container
  padding: 10px 10px 0

  .input
    width: 250px

  .sku_item
    background-color: #f8f8f8
    padding: 10px
    display: inline-block
    margin-right: 10px
    vertical-align: middle
    text-align: center
    position: relative
    border-radius: 2px
    cursor: pointer
    margin-top: 10px
    &:hover
      .remove
        display: block

    .remove
      top: -8px
      right: -8px

    .text
      display: block
      width: 74px
      margin: 0 auto
      overflow: hidden
      text-overflow: ellipsis
      white-space: nowrap
</style>
