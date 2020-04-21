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
                <el-form-item label="商品原价" prop="old_price">
                  <el-input v-model="form.old_price">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="商品现价" prop="current_price">
                  <el-input v-model="form.current_price">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="商品图片">
                  <img-upload
                    :img-data="form.images"
                    :pic-max="5"
                    @chooseImg="imageChoose"
                    @changePsit="changeImg"
                  />
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
                <el-form-item label="起购数量" prop="min_buy">
                  <el-input-number v-model="form.min_buy">
                    <template slot="append">件</template>
                  </el-input-number>
                </el-form-item>
                <el-form-item label="限购数量" prop="max_buy">
                  <el-input-number v-model="form.max_buy">
                    <template slot="append">件</template>
                  </el-input-number>
                </el-form-item>
                <el-form-item label="商品分类" prop="category">
                  <el-select v-model="form.category" placeholder="请选择商品分类" style="width: 50%">
                    <el-option label="手机" :value="1" />
                    <el-option label="箱包" :value="2" />
                  </el-select>
                </el-form-item>
              </div>
            </div>
            <!-- <div class="form-content-item">
              <div class="block-title"><card-tag tag-name="物流信息" /></div>
              <div class="block-content">
                <el-form-item label="物流设置">
                  <el-radio-group v-model="form.logisticsType">
                    <el-radio :label="0" style="margin-right: 0">统一运费： </el-radio>
                    <el-input v-model="form.freight" style="width: 25%; margin-right: 30px">
                      <template slot="append">元</template>
                    </el-input>
                    <el-radio :label="1">包邮</el-radio>
                    <el-radio :label="2" style="margin-right: 0">物流模板：  </el-radio>
                    <el-select v-model="form.logistics" placeholder="请选择物流模板" :disabled="form.logisticsType!=2">
                      <el-option label="顺丰速运" value="1" />
                      <el-option label="圆通快递" value="2" />
                    </el-select>
                  </el-radio-group>
                </el-form-item>
              </div>
            </div> -->
            <div class="form-content-item">
              <div class="block-title"><card-tag tag-name="商品详情" /></div>
              <el-form-item style="padding:10px 10px">
                <Tinymce ref="editor" v-model="form.detail" :height="400" />
                <!-- <mavon-editor ref="editor" v-model="form.detail" @save="saveDetail" @change="updateDetail" /> -->
              </el-form-item>
            </div>
          </el-tab-pane>
          <el-tab-pane label="商品规格" name="2">
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
            <div class="sku_container">
              <sku-select :skus-data="specificationFilter" />
            </div>
            <div class="sku_container">
              <sku-table ref="skutable" :skus-data="specificationFilter" />
              <!-- <vue-json-pretty :data="specificationFilter" /> -->
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
import Tinymce from '@/components/Tinymce'
import ImgUpload from '@/components/ImgUpload' // 图片上传
import SkuSelect from '@/components/VueSku/sku-select' // sku规格
import SkuTable from '@/components/VueSku/sku-table' // skulist
import { createUniqueString, uniqueArr } from '@/utils'
import { addGood, editGood, goodDetail } from '@/api/goods'
export default {
  components: {
    CardTag,
    Tinymce,
    ImgUpload,
    SkuSelect,
    SkuTable
  },
  data() {
    return {
      id: '',
      picMax: 5, // 图片上传
      activeName: '1',
      form: {
        name: '', // 标题
        old_price: '', // 原价
        current_price: '', // 当前价格
        sum_stock: '', // 库存
        weight: '', // 重量
        min_buy: '', // 起购数量
        max_buy: '', // 限购数量
        images: [], // 主图
        sku_show: '', // 规则
        sku_list: '', // 规则列表
        category: '', // 分类
        logisticsType: 0, // 物流类型
        freight: '', // 运费
        logisticsTemplate: '', // 物流模板id
        detail: '' // 描述
      },
      rules: {
        name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
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
          { required: true, message: '请输入商品现价', trigger: 'blur' }
        ],
        min_buy: [
          { type: 'number', required: true, message: '请输入起购数量', trigger: 'blur' }
        ],
        max_buy: [
          { type: 'number', required: true, message: '请输入限购数量', trigger: 'blur' }
        ],
        images: [
          { required: true, message: '请上传商品主图', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请选择商品分类', trigger: 'change' }
        ]
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
    this.id = this.$route.query.id ? this.$route.query.id : ''
    if (this.$route.query.id) {
      this.fetchData(this.$route.query.id)
    }
  },
  methods: {
    // 初始化商品详情
    fetchData(id) {
      goodDetail({
        id: id
      }).then(res => {
        this.form = res.data
        this.form.images = []
        this.$refs.skutable.data = JSON.parse(res.data.sku_list)
        this.specification = JSON.parse(res.data.sku_show)
        console.log(JSON.parse(res.data.sku_list))
        this.form.sku_show = JSON.parse(res.data.sku_show)
        this.form.sku_list = JSON.parse(res.data.sku_list)
        // console.log(this.form.sku_list)
      })
    },
    // 提交按钮
    onSubmit(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.form.sku_list = JSON.stringify(_this.$refs.skutable.data)
          _this.form.sku_show = JSON.stringify(_this.specificationFilter)
          _this.form.images = JSON.stringify(_this.form.images)
          if (_this.form.id) {
            editGood(_this.form).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: res.msg || '修改成功!'
                })
                // 重置表单
                _this.$refs[formName].resetFields()
                _this.$router.go(-1)
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
                _this.$refs[formName].resetFields()
                _this.$router.go(-1)
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
        // imgArray.forEach(item => {
        //   // 这里的this指向前面对象的this
        //   that.form.image_path.push(item.image_path);
        // });
      }
      this.$refs.form.validateField('images')
      // this.imageModalConfig.visible = false;
    },
    // 拖拽后触发
    changeImg(val) {
      this.form.image_path = val
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
        padding: 20px 50px;
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
</style>
