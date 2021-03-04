<template>
  <div class="goods-edit">
    <div class="title-info">
      <card-tag :tag-name="id!=''? `${'编辑文章'}`: `${'新增文章'}`" />
    </div>
    <!-- 表单部分 -->
    <div class="form-info">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="top" size="small">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="基本信息" name="1">
            <div class="form-content-item">
              <div class="block-title"><card-tag tag-name="基本信息" /></div>
              <div class="block-content">
                <el-form-item label="文章作者" prop="author">
                  <el-input v-model="form.author" />
                </el-form-item>
                <el-form-item label="文章标题" prop="title">
                  <el-input v-model="form.title" />
                </el-form-item>
                <el-form-item label="文章摘要" prop="summary">
                  <el-input v-model="form.summary" type="textarea" :rows="2" placeholder="请输入文章摘要" />
                </el-form-item>
                <el-form-item label="封面图片">
                  <img-upload
                    :img-data="form.cover_image"
                    :pic-max="1"
                    @chooseImg="imageChoose"
                    @changePsit="changeImg"
                  />
                </el-form-item>
                <el-form-item label="文章分类" prop="category_id">
                  <el-cascader
                    v-model="category_id_list"
                    :options="categories"
                    :props="optionProps"
                    placeholder="选择文章分类"
                    clearable
                    @change="onCascaderChange"
                  />
                </el-form-item>
              </div>
            </div>
            <div class="form-content-item">
              <div class="block-title"><card-tag tag-name="SEO" /></div>
              <div class="block-content">
                <!-- <el-form-item label="标题">
                  <el-input v-model="form.seo_title" type="text" placeholder="请输入SEO标题" style="width: 15%; margin-top: 10px" />
                </el-form-item> -->
                <el-form-item label="描述">
                  <el-input v-model="form.seo_desc" type="textarea" :rows="2" placeholder="请输入SEO描述" style="width: 35%; margin-top: 10px" />
                </el-form-item>
                <el-form-item label="关键字">
                  <div style="margin-top: 10px">
                    <el-tag
                      v-for="(tag, index) in keysList"
                      :key="`${tag}${index}`"
                      closable
                      :disable-transitions="false"
                      @close="handleClose(tag)"
                    >
                      {{ tag }}
                    </el-tag>
                    <el-input
                      v-if="inputVisible"
                      ref="saveTagInput"
                      v-model="inputValue"
                      class="input-new-tag"
                      size="small"
                      style="width: 10%;"
                      @keyup.enter.native="handleInputConfirm"
                      @blur="handleInputConfirm"
                    />
                    <el-button v-else class="button-new-tag" size="small" @click="showInput">新增</el-button>
                  </div>
                </el-form-item>
              </div>
            </div>
            <div class="form-content-item">
              <div class="block-title"><card-tag tag-name="开启热榜" /></div>
              <div class="block-content">
                <el-form-item label="">
                  <el-switch
                    v-model="form.hasWeigth"
                    active-text="开启"
                    inactive-text="关闭"
                    :active-value="1"
                    :inactive-value="0"
                  />
                </el-form-item>
                <el-form-item label="权重">
                  <el-input v-model="form.weight" type="number" placeholder="请输入权重值" style="width: 15%; margin-right: 30px" />
                </el-form-item>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="文章内容" name="2">
            <div class="form-content-item">
              <div class="block-title"><card-tag tag-name="文章内容" /></div>
              <el-form-item style="padding:10px 10px">
                <tinymce-editor
                  ref="editor"
                  v-model="form.content"
                  :value="form.content"
                  @onClick="onClick"
                />
                <!-- <Tinymce ref="editor" v-model="form.detail" :height="400" /> -->
                <!-- <mavon-editor ref="editor" v-model="form.detail" @save="saveDetail" @change="updateDetail" /> -->
              </el-form-item>
            </div>
          </el-tab-pane>
        </el-tabs>
        <el-form-item>
          <el-button
            type="success"
            @click.stop="onSubmit('form', true)"
          >保存并发布</el-button>
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

import { createUniqueString, uniqueArr } from '@/utils'
import { Category } from '@/api/goods'
import { articleApi } from '@/api/management'
export default {
  components: {
    CardTag,
    ImgUpload,
    TinymceEditor
  },
  data() {
    return {
      id: '',
      picMax: 5, // 图片上传
      activeName: '1',
      keysList: [], // 分类列表
      inputVisible: false,
      inputValue: '',
      category_id_list: [],
      form: {
        article_id: '',
        title: '', // 标题
        author: '', // 作者
        summary: '', // 摘要
        cover_image: [], // 文章封面
        seo_title: '', // seo标题
        seo_desc: '', // seo描述
        // seo_keywords: '', // seo关键字
        category_id: '', // 分类
        weight: 0, // 开启热榜时的权重
        hasWeigth: false,
        content: ''
      },
      batchRules: [],
      rules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { max: 100, message: '长度不超过100个字符', trigger: 'blur' }
        ],
        author: [
          { required: true, message: '请输入作者姓名', trigger: 'blur' }
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
  created() {
    this.getCategory()
    this.id = this.$route.query.id ? this.$route.query.id : ''
    if (this.$route.query.id) {
      this.fetchData(this.$route.query.id)
    }
  },
  methods: {
    handleClose(tag) {
      this.keysList.splice(this.keysList.indexOf(tag), 1)
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        this.keysList.push(inputValue)
        this.form.seo_keywords = this.keysList.join(',')
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    onCascaderChange(val) {
      this.form.category_id = val[val.length - 1]
    },
    // onBatchRulesSave(index) {
    //   this.batchRules[index].isSave = true
    //   const batchRulesList = this.batchRules
    //   this.form.item_price_template = JSON.stringify(batchRulesList)
    //   this.$message({
    //     type: 'success',
    //     message: '保存成功'
    //   })
    // },
    // 删除批量规则
    onBatchRulesDelete(index) {
      if (this.batchRules[index].isSave) {
        this.batchRules = this.batchRules.splice(index - 1, 1)
        const batchRulesList = this.batchRules
        this.form.item_price_template = JSON.stringify(batchRulesList)
      }
      this.batchRules.splice(index, 1)
      this.$message({
        type: 'success',
        message: '删除成功'
      })
    },
    // 添加批量规则
    onBatchRulesAdd() {
      this.batchRules.push({
        price: '',
        number: ''
      })
      this.form.item_price_template = JSON.stringify(this.batchRules)
    },
    // 获取分类
    getCategory() {
      Category.getList().then(res => {
        this.categories = res.data
      })
    },
    // 初始化商品详情
    fetchData(id) {
      articleApi.articleDetail({
        article_id: id
      }).then(res => {
        this.form = res.data
        this.form.article_id = id
        this.category_id_list = [res.data.category_id]
        this.keysList = res.data.seo_keywords ? res.data.seo_keywords.split(',') : []
        this.form.cover_image = [res.data.cover_image]
        // console.log(this.form.sku_list)
      })
    },
    // 提交按钮
    onSubmit(formName, isPublish) {
      const _this = this
      _this.form.category_id = _this.category_id_list[_this.category_id_list.length - 1]
      _this.form.cover_image = _this.form.cover_image[0]
      _this.form.is_publish = !!isPublish
      if (_this.form.content) {
        _this.form.content = _this.form.content.replace(/<img[\D\d]*?src=/g, $1 => {
          let value = $1
          if ($1.indexOf('style') !== 0) {
            // value = $1 ? $1.replace(/style="[\D\d]*?"/, 'style="display:block;width:80%;margin:10px auto; border-radius: 4px;"') : ''
          } else {
            value = $1 ? $1.replace('img', 'img style="display:block;width:80%;margin:10px auto; border-radius: 4px;"') : ''
          }
          console.log(value, 'value')
          return value
        })
      }
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          if (_this.form.article_id) {
            articleApi.editArticle(_this.form).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: res.msg || '修改成功'
                })
                // 重置表单
                _this.$router.replace({ path: '/management/article/list' })
              } else {
                this.$message.success(res.msg || '修改失败')
              }
            })
          } else {
            articleApi.addArticle(_this.form).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: res.msg || '添加成功'
                })
                // 重置表单
                _this.$router.replace({ path: '/management/article/list' })
              } else {
                this.$message.success(res.msg || '添加失败')
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
    imageChoose(imgUrl) {
      this.form.cover_image = [imgUrl]
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
      // console.log('Element clicked')
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
  .group_container .input {
    margin-top: 10px !important;
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
  .batch-rules-btn
</style>
