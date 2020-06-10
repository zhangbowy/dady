<template>
  <el-dialog title="修改密码" :visible.sync="value" append-to-body modal-append-to-body width="40%" center :before-close="beforeClose">
    <el-form ref="form" :model="form" :rules="rules" size="small">
      <el-form-item label="旧登录密码" prop="old_password">
        <el-input v-model="form.old_password" type="password" placeholder="请输入旧登录密码" />
      </el-form-item>
      <el-form-item label="新登录密码" prop="new_password">
        <el-input v-model="form.new_password" type="password" placeholder="请输入新登录密码" />
      </el-form-item>
      <el-form-item label="确认新密码" prop="ensurePassword">
        <el-input v-model="form.ensurePassword" type="password" placeholder="请确认新登录密码" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit('form')">保存</el-button>
        <el-button @click="beforeClose">取消</el-button>
      </el-form-item>
    </el-form>

  </el-dialog>
</template>

<script>
import { changePsd } from '@/api/user'
export default {
  name: '',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    var validateOld = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入旧密码'))
      } else {
        callback()
      }
    }
    var validateNew = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        callback()
      }
    }
    var ensureNew = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.form.new_password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      form: {
        old_password: '',
        new_password: '',
        ensurePassword: ''
      },
      rules: {
        old_password: [
          { validator: validateOld, trigger: 'blur' }
        ],
        new_password: [
          { validator: validateNew, trigger: 'blur' }
        ],
        ensurePassword: [
          { validator: ensureNew, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    value: {
      deep: true,
      handler(newValue, old) {
        if (newValue === false) {
          this.form = {
            old_password: '',
            new_password: '',
            ensurePassword: ''
          }
        }
      }
    }
  },
  methods: {
    ensure() {
      this.$confirm('确认修改密码后，您将退出当前登录，请使用新密码重新登录。', '确认修改', {
        confirmButtonText: '确定修改',
        cancelButtonText: '取消修改',
        type: 'warning'
      }).then(() => {
        this.submit('form')
      }).catch(() => {

      })
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('确认修改密码后，您将退出当前登录，请使用新密码重新登录。', '确认修改', {
            confirmButtonText: '确定修改',
            cancelButtonText: '取消修改',
            type: 'warning'
          }).then(() => {
            changePsd(this.form).then(res => {
              this.$message({
                type: 'success',
                message: res.msg || '修改成功'
              })
              this.beforeClose()
              // this.$store.dispatch('user/getInfo')
              location.reload()
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '修改失败'
              })
            })
          }).catch(() => {

          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    beforeClose() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="sass">

</style>
