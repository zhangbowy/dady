<template>
  <div class="wechat-setting">
    <el-tabs type="border-card">
      <el-tab-pane v-if="adminInfo.role_type != 1" :label="$t('微信设置')">
        <wecht-setting />
      </el-tab-pane>
      <el-tab-pane v-if="adminInfo.role_type == 1" :label="$t('店铺设置')">
        <store-setting />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import WechtSetting from './components/WechtSetting'
import StoreSetting from './components/StoreSetting'
export default {
  components: {
    WechtSetting,
    StoreSetting
  },
  data() {
    return {

    }
  },
  computed: {
    adminInfo() {
      return this.$store.state.user.adminInfo
    }
  }
}
</script>

<style lang="scss">
.wechat-setting{
  padding: 10px;
  .form-content-item{
      margin-bottom: 20px;
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
