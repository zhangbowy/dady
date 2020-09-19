<template>
  <div class="embroid-template main-content">
    <div class="content">
      <el-tabs v-model="type" type="border-card" @tab-click="handleClick">
        <el-tab-pane :label="$t('移动端商城')" name="1">
          {{ $t('移动端商城') }}
        </el-tab-pane>
        <el-tab-pane :label="$t('管理后台')" name="2">
          {{ $t('管理后台') }}
        </el-tab-pane>
        <el-tab-pane :label="$t('设计师管理后台')" name="3">
          {{ $t('设计师管理后台') }}
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  inject: ['reload'],
  data() {
    return {
      type: '1'
    }
  },
  methods: {
    handleClick(type) {
      console.log(type)
    }
  }
}
</script>

<style lang="scss" scoped>
.content{
  margin-top: 0;
  border: none;
}
.screen-box {
  margin-bottom: 10px;
  padding-bottom: 10px;
  // display: flex;
}
</style>
