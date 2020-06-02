<template>
  <div class="wechat-setting">
    <el-form ref="settingForm" :model="settingForm" :rules="rules" label-position="left" label-width="100px">
      <div class="form-content-item">
        <div class="block-title"><card-tag tag-name="微信设置" /></div>
        <div class="block-content">
          <el-form-item label="AppID" prop="AppID">
            <el-input v-model="settingForm.AppID" size="small" />
          </el-form-item>
          <el-form-item label="AppSecret" prop="AppSecret">
            <el-input v-model="settingForm.AppSecret" size="small" />
          </el-form-item>
          <el-form-item label="公众号域名" prop="url">
            <el-input v-model="settingForm.url" size="small" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="submitForm('settingForm')">保存</el-button>
            <el-button size="small" @click="resetForm('settingForm')">重置</el-button>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import CardTag from '@/components/CardTag'
import { settingApi } from '@/api/system'
export default {
  components: {
    CardTag
  },
  data() {
    return {
      settingForm: {
        AppID: '',
        AppSecret: '',
        url: ''
      },
      rules: {
        AppID: [
          { required: true, message: '请输入AppID', trigger: 'blur' }
        ],
        AppSecret: [
          { required: true, message: '请输入AppSecret', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入公众号域名', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getSetting()
  },
  methods: {
    getSetting() {
      settingApi.getSetting().then(res => {
        this.is_request_wilcom = res.data.is_request_wilcom
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss">
.wechat-setting{
  padding: 10px;
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
</style>
