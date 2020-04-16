<template>
  <div class="shop-edit">
    <div class="title-info">
      <card-tag :tag-name="id!=''? '编辑店铺': '新增店铺'" />
    </div>
    <!-- 表单部分 -->
    <div class="form-info">
      <el-form ref="shopForm" :model="shopForm" :rules="rules" label-width="80px" label-position="top" size="small">
        <div class="form-content-item">
          <div class="block-title"><card-tag tag-name="店铺信息" /></div>
          <div class="block-content">
            <el-form-item label="店铺名称" prop="shop_name">
              <el-input v-model="shopForm.shop_name " />
            </el-form-item>
            <el-form-item label="管理员名称" prop="name">
              <el-input v-model="shopForm.name " />
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="shopForm.phone " />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="shopForm.password " />
            </el-form-item>
            <el-form-item label="店铺logo" prop="logo">
              <el-upload
                class="logo-uploader"
                :action="`${baseUrl}/file/uploadImg`"
                :data="{type: 'shop_logo'}"
                name="image"
                :with-credentials="true"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="imageUrl" :src="imageUrl" class="logo">
                <i v-else class="el-icon-plus logo-uploader-icon" />
              </el-upload>
            </el-form-item>
            <el-form-item label="到期时间" prop="system_end_time">
              <el-date-picker
                v-model="shopForm.system_end_time"
                type="date"
                format="yyyy-MM-dd"
                placeholder="选择店铺到期时间"
              />
            </el-form-item>
            <!-- <el-form-item label="店铺描述">
              <el-input
                v-model="shopForm.desc"
                type="textarea"
                :rows="2"
                placeholder="请输入店铺描述"
              />
            </el-form-item> -->
          </div>
        </div>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('shopForm')">立即创建</el-button>
          <el-button @click="()=>{this.$router.go(-1)}">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import CardTag from '@/components/CardTag'
import { addShop } from '@/api/shop'
import { validPhone } from '@/utils/validate'
export default {
  components: {
    CardTag
  },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!validPhone(value)) {
        callback(new Error('手机号不正确'))
      } else {
        callback()
      }
    }
    return {
      id: '',
      baseUrl: process.env.VUE_APP_BASE_API,
      shopForm: {
        shop_name: '',
        name: '',
        phone: '',
        password: '',
        system_end_time: '',
        logo: 'http://img.tecqm.cn/upload_375541a0001c9e4b09d48086a71965ac.jpg'
      },
      imageUrl: '',
      rules: {
        shop_name: [
          { required: true, message: '请填写店铺名称', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请填写管理员姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, trigger: 'blur', validator: validatePhone }
        ],
        password: [
          { required: true, message: '请填写登录密码', trigger: 'blur' }
        ],
        system_end_time: [
          { required: true, message: '请输入选择店铺到期时间', trigger: 'blur' }
        ],
        logo: [
          { required: true, message: '请上传店铺logo', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.id = this.$route.query.id ? this.$route.query.id : ''
  },
  methods: {
    onSubmit(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          addShop(_this.shopForm).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: res.msg || '添加成功!'
              })
              // 重置表单
              _this.$refs[formName].resetFields()
              this.$router.go(-1)
            } else {
              this.$message.success(res.msg || '添加失败!')
            }
          })
        } else {
          return false
        }
      })
    },
    handleAvatarSuccess(res, file) {
      console.log(res)
      this.imageUrl = URL.createObjectURL(file.raw)
      this.shopForm.logo = res.data.url
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('店铺logo只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('店铺logo大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style lang="scss" scoped>
.shop-edit{
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
        padding: 10px;
        background: #fff;
        .el-input{
          width: 50%;
        }
      }
    }
  }
}
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
      width: 150px;
      height: 150px;
      line-height: 150px;
      text-align: center;
    }
    .logo {
      width: 150px;
      height: 150px;
      display: block;
    }
  }
</style>
