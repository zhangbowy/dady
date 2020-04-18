<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
  background: #f5f5f5;
}
.fixed-header+.app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    // padding-right: 15px;
  }
}
.main-content{
  padding: 10px;
  .screen-box{
    text-align: right;
    background: #fff;
    padding: 10px;
    position: relative;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    border-radius: 5px;
    .operation{
      position: absolute;
      right: 10px;
      top: 10px;
    }
  }
  .content{
    border: 1px solid #f5f5f5;
    margin-top: 10px;
    border-bottom: none;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    border-radius: 5px;
  }

  // 分页样式
  .pagination-box{
    text-align: right;
    background: #fff;
    padding: 10px;
  }
}

</style>
