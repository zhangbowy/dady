<template>
  <div class="">
    <el-form ref="form" :model="form" label-position="top">
      <div class="form-content-item">
        <!-- <div class="block-title"><card-tag tag-name="微信设置" /></div> -->
        <div class="block-content">
          <el-form-item label="首页通知公告">
            <el-input v-model="form.notice" clearable size="small" style="width: 100%" />
          </el-form-item>
          <el-form-item label="店铺简介">
            <tinymce-editor
              ref="editor"
              v-model="form.about_us"
              :value="form.about_us"
              @onClick="onClick"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="submitForm('form')">保存</el-button>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import { settingApi } from '@/api/system'
import TinymceEditor from '@/components/TinymceEditor'

export default {
  name: '',
  components: {
    TinymceEditor
  },
  data() {
    return {
      form: {
        notice: '',
        about_us: ''
      }
    }
  },
  created() {
    this.getConfig()
  },

  methods: {
    getConfig() {
      settingApi.getShopConfig().then(res => {
        this.form = res.data
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!')
          settingApi.saveShopConfig(this.form).then(res => {
            this.$message({
              type: 'success',
              message: res.msg || '保存成功!'
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 鼠标单击的事件
    onClick(e, editor) {
      console.log('Element clicked')
    }
  }
}
</script>

<style scoped lang="sass">

</style>
