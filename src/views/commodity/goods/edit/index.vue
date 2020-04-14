<template>
  <div class="goods-edit">
    <div class="title-info">
      <card-tag :tag-name="id!=''? '编辑商品': '新增商品'" :icon-name="id!=''?'edit':'add'" />
    </div>
    <!-- 表单部分 -->
    <div class="form-info">
      <el-form ref="form" :model="form" label-width="80px" label-position="top" size="small">
        <el-form-item label="商品标题" class="inline-block wid48">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="商品原价" class="inline-block wid48">
          <el-input v-model="form.price">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品现价" class="inline-block wid48">
          <el-input v-model="form.cur_price">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品库存" class="inline-block wid48">
          <el-input v-model="form.stock">
            <template slot="append">件</template>
          </el-input>
        </el-form-item>
        <el-form-item label="基础销量" class="inline-block wid48">
          <el-input v-model="form.basicSales">
            <template slot="append">件</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品分类" class="inline-block wid48">
          <el-select v-model="form.region" placeholder="请选择商品分类">
            <el-option label="分类1" value="1" />
            <el-option label="分类2" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品详情">
          <mavon-editor ref="editor" v-model="form.detail" @save="saveDetail" @change="updateDetail" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import CardTag from '@/components/CardTag'
import { mavonEditor } from 'mavon-editor' // 富文本编辑器
export default {
  components: {
    CardTag,
    mavonEditor
  },
  data() {
    return {
      id: '',
      form: {
        title: '', // 标题
        price: '', // 原价
        cur_price: '', // 当前价格
        stock: '', // 库存
        basicSales: '', // 基础销量
        region: '',
        date1: '',
        date2: '',
        desc: '',
        detail: ''
      }
    }
  },
  created() {
    this.id = this.$route.query.id ? this.$route.query.id : ''
  },
  methods: {
    onSubmit() {
    },
    updateDetail(markdown, html) {
      // 此时会自动将 markdown 和 html 传递到这个方法中
      console.log('markdown内容: ' + markdown)
      console.log('html内容:' + html)
    },
    saveDetail(markdown, html) {
      // 此时会自动将 markdown 和 html 传递到这个方法中
      console.log('markdown内容:' + markdown)
      console.log('html内容:' + html)
    }
  }
}
</script>

<style lang="scss" scoped>
.goods-edit{
  padding: 10px;
  .title-info{
    background: #fff;
  }
  .form-info{
    padding: 20px 30px;
    background: #ffff;
  }
}
</style>
