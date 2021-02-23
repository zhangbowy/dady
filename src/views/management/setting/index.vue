<template>
  <div class="main-content">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="SEO设置" name="1">
        <el-form ref="form" :model="form" label-position="top" :rules="rules">
          <el-form-item label="网站域名">
            <el-input v-model="form.site_url" type="text" placeholder="请输入网站域名" style="width: 15%; margin-top: 10px" />
          </el-form-item>
          <el-form-item label="	网站标题">
            <el-input v-model="form.title" type="text" placeholder="请输入网站标题" style="width: 15%; margin-top: 10px" />
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
          <el-form-item label="百度seo token">
            <el-input v-model="form.baidu_seo_token" type="text" :rows="2" placeholder="请输入百度seo token" style="width: 35%; margin-top: 10px" />
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="form.description" type="textarea" :rows="2" placeholder="请输入SEO描述" style="width: 35%; margin-top: 10px" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit('form')">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { articleApi } from '@/api/management'

export default {
  data() {
    return {
      activeName: '1',
      form: {
        site_url: '',
        title: '',
        keywords: '',
        description: '',
        baidu_seo_token: ''
      },
      inputVisible: false,
      inputValue: '',
      keysList: [],
      rules: {
        title: [
          { required: true, message: '请输入网站标题', trigger: 'blur' },
          { max: 100, message: '长度不超过100个字符', trigger: 'blur' }
        ],
        site_url: [
          { required: true, message: '请输入网站域名', trigger: 'blur' }
        ],
        baidu_seo_token: [
          { required: true, message: '请输入百度seo token', trigger: 'change' }
          // validator: validateCPrice
        ]
      }
    }
  },
  inject: ['reload'],
  created() {
    this.getData()
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
        this.form.keywords = this.keysList.join(',')
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    handleClick(value) {
      // console.log(value)
    },
    getData() {
      articleApi.getSEOSetting().then(res => {
        console.log(res, 'res')
        if (res.code === 0) {
          this.form = res.data
          this.keysList = res.data.keywords ? res.data.keywords.split(',') : []
        } else {
          this.$message({
            type: 'info',
            message: res.msg
          })
        }
      })
    },
    // 提交按钮
    onSubmit(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(_this.form)
          articleApi.setSEOSetting(_this.form).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: res.msg || '保存成功'
              })
              // 重置表单
              _this.$router.replace({ path: '/management/setting' })
            } else {
              this.$message.success(res.msg || '保存失败')
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.recharge-type {
  margin-top: 12px;
  &-card {
    cursor: pointer;
    .el-card__body {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      span {
        margin-bottom: 10px;
      }
    }
  }
}
.el-tabs__content {
  background: #fff;
  padding: 16px;
  border-radius: 5px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #f5f5f5;
}
.dialog-content {
  display: flex;
  align-items: center;
  justify-content: center;
  &_recode {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 4px;
    border: 1px solid #d7dae2;
    border-radius: 4px;
    z-index: 100;
    background: #fff;
    animation: qrcodeShow 0.3s linear forwards;
    img {
      width: 200px;
      height: 200px;
    }
  }
  &_hint {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    padding: 10px;
    animation: hintShow 0.3s linear forwards;
    .logo {
      width: 100px;
    }
    .hint {
      width: 200px;
      margin-top: 40px;
    }
  }
  @keyframes hintShow {
    0% {
      transform: translateX(-80px);
    }
    100% {
      transform: translateX(0px);
    }
  }
  @keyframes qrcodeShow {
    0% {
      transform: translateX(80px);
    }
    100% {
      transform: translateX(0px);
    }
  }
}
</style>
