<template>
  <div class="finance-dialog">
    <el-dialog v-dialogDrag title="发放提现" :visible.sync="value" width="30%" :before-close="beforeClose">
      <el-form ref="form" :model="form" :rules="rules" label-position="top" size="small">
        <el-form-item label="申请提现金额">
          <el-input v-model="item.cash_amount" disabled>
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="打款证明" prop="cert">
          <el-upload
            class="cert-uploader"
            :action="`${baseUrl}/file/uploadImg`"
            name="image"
            :data="{'type': 'paymentCert'}"
            :headers="{'adm_sign': token}"
            :file-list="fileList"
            :with-credentials="true"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="logo">
            <i v-else class="el-icon-plus cert-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit('form')">确定</el-button>
          <el-button @click="beforeClose">取消</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
export default {
  name: 'FinanceDialog',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    withdrawable: {
      type: [String, Number],
      default: ''
    },
    item: {
      type: Object,
      default: () => {

      }
    }
  },
  data() {
    return {
      baseUrl: process.env.VUE_APP_BASE_API,
      token: getToken(),
      imageUrl: '',
      fileList: [{ name: 'cert', url: '' }],
      form: {
        cert: this.item.cert,
        remark: this.item.remark
      },
      rules: {
        cert: [
          { required: true, message: '请上传打款证明', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请填写备注', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {

  },
  watch: {
    value: {
      deep: true,
      handler(newValue, old) {
        if (newValue === false) {
          this.form.cert = ''
          this.form.remark = ''
        } else {
          this.form.cert = this.item.cert
          this.imageUrl = this.item.cert
          this.form.remark = this.item.remark
        }
      }
    },
    item: {
      immediate: true,
      deep: true,
      handler(newValue) {
        this.form.cert = newValue.cert
        this.imageUrl = newValue.cert
        this.form.remark = newValue.remark
      }
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.form.cash_id = this.item.cash_id
          this.$emit('submit', this.form)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    beforeClose() {
      this.$emit('close')
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.form.cert = res.data
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style lang="scss">
  .cert-uploader{
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
    .cert-uploader-icon {
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

.changes-status.el-switch.is-disabled {
  opacity: 1;
  .el-switch__core {
    cursor: pointer;
  }
}
</style>

