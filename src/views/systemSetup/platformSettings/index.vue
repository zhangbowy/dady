<template>
  <div class="platform-setting">
    <el-form>
      <div class="form-content-item">
        <div class="block-title"><card-tag tag-name="平台设置" /></div>
        <div class="block-content">
          <el-form-item label="是否调用澳洲api">
            <el-switch
              v-model="is_request_wilcom"
              class="changes-status"
              :active-value="1"
              :inactive-value="0"
              disabled
              @click.native="switchTab()"
            />
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
      is_request_wilcom: 0
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
    switchTab() {
      this.$confirm(`${this.is_request_wilcom === 0 ? '开启后，手绘定制将调用澳洲api生成刺绣图案！' : '是否关闭调用澳洲接口？'}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'danger'
      }).then(() => {
        settingApi.editSetting({ key: 'is_request_wilcom', value: this.is_request_wilcom === 0 ? 1 : 0 }).then(res => {
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.is_request_wilcom === 0 ? this.is_request_wilcom = 1 : this.is_request_wilcom = 0
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消!'
        })
      })
    }
  }
}
</script>

<style lang="scss">
.platform-setting{
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
.changes-status.el-switch.is-disabled {
  opacity: 1;
  .el-switch__core {
    cursor: pointer;
  }
}
</style>
