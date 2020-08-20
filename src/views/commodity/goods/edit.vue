<template>
  <div class="goods-edit">
    <div class="title-info">
      <card-tag :tag-name="id!=''? '编辑商品': '新增商品'" />
    </div>
    <!-- 表单部分 -->
    <div class="form-info">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="top" size="small">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="基本信息" name="1">
            <div class="form-content-item">
              <div class="block-title"><card-tag tag-name="基本信息" /></div>
              <div class="block-content">
                <el-form-item label="商品标题" prop="name">
                  <el-input v-model="form.name" />
                </el-form-item>
                <el-form-item label="分享描述" prop="desc">
                  <el-input v-model="form.desc" />
                </el-form-item>
                <el-form-item label="商品图片">
                  <img-upload
                    :img-data="form.images"
                    :pic-max="5"
                    @chooseImg="imageChoose"
                    @changePsit="changeImg"
                  />
                </el-form-item>
                <el-form-item label="商品分类" prop="category_id">
                  <el-cascader
                    v-model="form.category_id"
                    :options="categories"
                    :props="optionProps"
                    placeholder="选择商品分类"
                    clearable
                  />
                </el-form-item>
              </div>
            </div>
            <div class="form-content-item">
              <div class="block-title"><card-tag tag-name="开启定制" /></div>
              <div class="block-content">
                <el-form-item label="">
                  <el-switch
                    v-model="form.is_custom"
                    active-text="开启"
                    inactive-text="关闭"
                    :active-value="1"
                    :inactive-value="0"
                  />
                  <el-select v-model="form.custom_category_id" placeholder="请选择定制分类" :disabled="form.is_custom==0">
                    <el-option
                      v-for="item in customCategory"
                      :key="item.custom_category_id"
                      :label="item.custom_category_name"
                      :value="item.custom_category_id"
                    />
                  </el-select>
                </el-form-item>
              </div>
            </div>
            <div class="form-content-item">
              <div class="block-title"><card-tag tag-name="开启预售" /></div>
              <div class="block-content">
                <el-form-item label="">
                  <el-switch
                    v-model="form.is_presell"
                    active-text="开启"
                    inactive-text="关闭"
                    :active-value="1"
                    :inactive-value="0"
                  />
                </el-form-item>
              </div>
            </div>
            <div class="form-content-item">
              <div class="block-title"><card-tag tag-name="物流信息" /></div>
              <div class="block-content">
                <el-form-item label="物流设置">
                  <el-radio-group v-model="form.express_type">
                    <el-radio :label="0">包邮</el-radio>
                    <el-radio :label="1" style="margin-right: 0">统一运费： </el-radio>
                    <el-input v-model="form.express_fee" type="number" style="width: 25%; margin-right: 30px" :disabled="form.express_type!=1">
                      <template slot="append">元</template>
                    </el-input>
                    <el-radio :label="2" style="margin-right: 0">物流模板：  </el-radio>
                    <el-select v-model="form.express_template_id" placeholder="请选择物流模板" :disabled="form.express_type!=2">
                      <el-option
                        v-for="item in expressList"
                        :key="item.express_template_id"
                        :label="item.express_template_name"
                        :value="item.express_template_id"
                      />
                    </el-select>
                  </el-radio-group>
                </el-form-item>
              </div>
            </div>
            <div class="form-content-item">
              <div class="block-title"><card-tag tag-name="商品详情" /></div>
              <el-form-item style="padding:10px 10px">
                <tinymce-editor
                  ref="editor"
                  v-model="form.detail"
                  :value="form.detail"
                  @onClick="onClick"
                />
                <!-- <Tinymce ref="editor" v-model="form.detail" :height="400" /> -->
                <!-- <mavon-editor ref="editor" v-model="form.detail" @save="saveDetail" @change="updateDetail" /> -->
              </el-form-item>
            </div>
          </el-tab-pane>
          <el-tab-pane label="商品规格" name="2">
            <!-- sku规格部分 -->
            <div class="sku_container">
              <div v-for="(spec, index) in specification" :key="spec.id" class="sku_group mb10">
                <div class="spec_title">
                  <span class="label">规格名：</span>
                  <el-input v-model.trim="spec.value" class="input" placeholder="请输入规格名" />
                  <span class="remove" @click="delSepc(index)">x</span>
                </div>
                <div class="group_container">
                  <span class="label">规格值：</span>
                  <el-popover
                    v-for="(option, option_index) in spec.leaf"
                    :key="option_index"
                    placement="bottom"
                    width="120"
                    trigger="click"
                  >
                    <el-input v-model.trim="option.value" style="width: 110px;" />
                    <div slot="reference" class="sku_item">
                      <span class="remove" @click.stop="delOption(index, option_index)">x</span>
                      <div class="text">{{ option.value }}</div>
                    </div>
                  </el-popover>
                  <el-input
                    v-model="addValues[index]"
                    class="input"
                    uffix-icon="el-icon-plus"
                    placeholder="多个产品属性以空格隔开"
                    @keyup.native.enter="addOption(index)"
                    @blur="addOption(index)"
                  />
                </div>
              </div>
              <div class="spec_title">
                <el-button type="info" :disabled="disabled" @click="addSpec">添加规格项目</el-button>
              </div>
            </div>

            <!-- <div class="sku_container">
              <sku-select :skus-data="specificationFilter" />
            </div> -->
            <div class="sku_container">
              <sku-table ref="skutable" :skus-data="specificationFilter" />
              <!-- <vue-json-pretty :data="specificationFilter" /> -->
            </div>
            <!-- 价格部分 -->
            <div class="form-content-item">
              <div class="block-title"><card-tag tag-name="价格库存" /></div>
              <div v-if="skuList.length>0" class="block-content">
                <el-form-item label="商品原价" prop="old_price">
                  <el-input v-model="form.old_price">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="商品现价" prop="current_price">
                  <el-input v-model="priceInfo.minPrice" :disabled="skuList.length>0" :max="form.old_price">
                    <template slot="append">元</template>
                  </el-input>
                  <p style="margin:0;color:#F56C6C"> 注：含sku的商品，商品现价取sku价格最小值。</p>
                </el-form-item>
                <el-form-item label="商品库存">
                  <el-input v-model="priceInfo.totalNum" :disabled="skuList.length>0">
                    <template slot="append">件</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="商品重量">
                  <el-input v-model="priceInfo.minWeight" :disabled="skuList.length>0">
                    <template slot="append">千克</template>
                  </el-input>
                </el-form-item>
              </div>
              <div v-else class="block-content">
                <el-form-item label="商品原价" prop="old_price">
                  <el-input v-model="form.old_price">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="商品现价" prop="current_price">
                  <el-input v-model="form.current_price" :max="form.old_price">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="商品库存" prop="sum_stock">
                  <el-input v-model="form.sum_stock">
                    <template slot="append">件</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="商品重量" prop="weight">
                  <el-input v-model="form.weight">
                    <template slot="append">千克</template>
                  </el-input>
                </el-form-item>
              </div>
            </div>
            <div class="form-content-item">
              <div class="block-title"><card-tag tag-name="小批量定制" /></div>
              <div class="block-content">
                <el-form-item v-for="(rules, index) in batchRules" :key="index" prop="old_price">
                  <el-col :span="8">
                    <el-col class="line" :span="4">商品数量</el-col>
                    <el-form-item prop="date1">
                      <el-input v-model="rules.number">
                        <template slot="append">件</template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-col class="line" :span="4">商品价格</el-col>
                    <el-form-item prop="date2">
                      <el-input v-model="rules.price" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-button class="batch-rules-btn" icon="el-icon-close" size="mini" circle @click="onBatchRulesDelete(index)" />
                  </el-col>
                </el-form-item>
              </div>
              <div class="spec_title">
                <el-button type="info" @click="onBatchRulesAdd">添加批量定制规则</el-button>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')">保存</el-button>
          <el-button @click="()=>this.$router.go(-1)">取消</el-button>
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
import { createUniqueString, uniqueArr } from '@/utils'
import { addGood, editGood, goodDetail, Category } from '@/api/goods'
import { mapGetters } from 'vuex'
import { expressApi, customCateApi } from '@/api/system'
export default {
  components: {
    CardTag,
    ImgUpload,
    SkuTable,
    TinymceEditor
  },
  data() {
    var validateCPrice = (rule, value, callback) => {
      console.log(value)
      if (value === '') {
        callback(new Error('请输入商品现价'))
      } else if (parseFloat(value) > parseFloat(this.form.old_price)) {
        callback(new Error('商品现价不得高于原价'))
      } else {
        callback()
      }
    }
    return {
      id: '',
      picMax: 5, // 图片上传
      activeName: '1',
      form: {
        name: '', // 标题
        old_price: '', // 原价
        desc: '', // 分享描述
        current_price: '', // 当前价格
        sum_stock: '', // 库存
        weight: '', // 重量
        images: [], // 主图
        sku_show: '', // 规则
        sku_list: '', // 规则列表
        category_id: '', // 分类
        express_type: 0, // 物流类型
        freight: '', // 运费
        logisticsTemplate: '', // 物流模板id
        detail: '', // 描述
        is_presell: 0
      },
      batchRules: [
        {
          price: 10,
          number: 100
        }
      ],
      rules: {
        name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { max: 30, message: '长度不超过30个字符', trigger: 'blur' }
        ],
        old_price: [
          { required: true, message: '请输入商品原价', trigger: 'blur' }
        ],
        sum_stock: [
          { required: true, message: '请输入商品库存', trigger: 'blur' }
        ],
        weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        current_price: [
          { validator: validateCPrice, trigger: 'blur' }
        ],
        images: [
          { required: true, message: '请上传商品主图', trigger: 'blur' }
        ],
        category_id: [
          { required: true, message: '请选择分类', trigger: 'change' }
        ]
      },
      categories: [], // 商品分类
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
    ...mapGetters([
      'skuList',
      'priceInfo'
    ]),
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
    // 删除批量规则
    onBatchRulesDelete(index) {
      this.batchRules.splice(index, 1)
    },
    // 添加批量规则
    onBatchRulesAdd() {
      this.batchRules.push({
        price: '',
        number: ''
      })
    },
    // 获取分类
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
      customCateApi.getCategoryList().then(res => {
        this.customCategory = res.data
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
    // 提交按钮
    onSubmit(formName) {
      const _this = this
      if (this.skuList.length > 0) {
        _this.form.current_price = this.priceInfo.minPrice
        _this.form.weight = this.priceInfo.minWeight
        _this.form.sum_stock = this.priceInfo.totalNum
      }
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.form.sku_list = this.skuList // 取store里面的skuList
          _this.form.sku_show = _this.specificationFilter
          _this.form.category_id = _this.form.category_id[_this.form.category_id.length - 1]
          if (_this.form.id) {
            editGood(_this.form).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: res.msg || '修改成功!'
                })
                // 重置表单
                _this.$router.replace({ path: '/commodity/goods/list' })
              } else {
                this.$message.success(res.msg || '修改失败!')
              }
            })
          } else {
            addGood(_this.form).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: res.msg || '添加成功!'
                })
                // 重置表单
                _this.$router.replace({ path: '/commodity/goods/list' })
              } else {
                this.$message.success(res.msg || '添加失败!')
              }
            })
          }
        } else {
          return false
        }
      })
    },
    // tab选项卡切换
    handleClick(tab, event) {
    },
    // 图片上传模块
    imageChoose(imgArray) {
      this.form.images = []
      if (imgArray.length > 0) {
        const that = this
        imgArray.forEach(item => {
          // 这里的this指向前面对象的this
          that.form.images.push(item)
        })
      }
      this.$refs.form.validateField('images')
      // this.imageModalConfig.visible = false;
    },
    // 拖拽后触发
    changeImg(val) {
      this.form.images = val
    },
    // 添加规格
    addSpec() {
      this.specification.push({
        id: createUniqueString() + '_id',
        value: '',
        leaf: []
      })
    },
    // 删除规格
    delSepc(index) {
      this.specification.splice(index, 1)
    },
    // 添加规格值
    addOption(index) {
      let str = this.addValues[index] || ''
      str = str.trim()
      if (!str) return
      const oldArr = this.specification[index].leaf
      const arr = str
        .split(/\s+/) // 使用空格分割成数组
        .filter(value => !oldArr.some(option => option.value === value)) // 过滤掉 oldArr 已存在的 value
        .map(value => ({ id: createUniqueString() + '_id', value })) // 把 value 转成对象，id 设置为 null
      this.specification[index].leaf = uniqueArr([...oldArr, ...arr])
      this.$set(this.addValues, index, '')
    },
    // 删除规格值
    delOption(spec_index, option_index) {
      this.specification[spec_index].leaf.splice(option_index, 1)
    },
    // 鼠标单击的事件
    onClick(e, editor) {
      console.log('Element clicked')
    },
    // 清空内容
    clear() {
      this.$refs.editor.clear()
    }
  }
}
</script>

<style lang="scss" scoped>
.goods-edit{
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
  .batch-rules-btn
</style>
