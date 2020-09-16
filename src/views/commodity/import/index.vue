<template>
  <div class="main-content">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="导入淘宝商品" name="1">
        <el-form :model="form" label-position="top">
          <el-form-item label="商品链接">
            <el-row>
              <el-col v-for="(item,index) in form.urlList" :key="index" :span="24">
                <el-input v-model="item.url" size="small" placeholder="商品链接" style="width: 50%">
                  <template slot="prepend">链接：</template>
                </el-input>
                <el-button
                  v-if="index !== form.urlList.length - 1"
                  size="small"
                  type="danger"
                  icon="el-icon-remove-outline"
                  style="vertical-align: top;margin: 0"
                  @click="deleteTemplate(index)"
                >删除</el-button>
                <el-button
                  v-if="index === form.urlList.length - 1"
                  size="small"
                  type="primary"
                  icon="el-icon-circle-plus-outline"
                  style="vertical-align: top;"
                  @click="addTemplate()"
                >添加</el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="importGoods">导入商品</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { importGood } from '@/api/goods'
export default {
  data() {
    return {
      activeName: '1',
      form: {
        urlList: [{
          url: ''
        }]
      },
      formType: 'edit'
    }
  },
  methods: {
    handleClick(value) {},
    addTemplate() {
      if (!this.form.urlList[this.form.urlList.length - 1].url) {
        this.$message('请输入商品链接')
        return
      }
      this.form.urlList.push({
        url: ''
      })
    },
    importGoods() {
      importGood({
        tb_url: this.form.urlList.map(item => item.url)
      }).then(data => {
        if (data.code === 0) {
          this.$message({
            message: data.msg,
            type: 'success'
          })
          this.form.urlList = [
            {
              url: ''
            }
          ]
        } else {
          this.$message({
            message: data.msg,
            type: 'error'
          })
        }
      })
    },
    deleteTemplate(index) {
      this.form.urlList.splice(index, 1)
    }
  }
}
</script>

<style>

</style>
