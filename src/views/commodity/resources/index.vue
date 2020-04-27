<template>
  <div class="resource-view">
    <div class="resource-content">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="图片" name="1">
          <img-resources />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import ImgResources from './components/ImgResources'
export default {
  components: {
    ImgResources
  },
  data() {
    return {
      activeName: '1'
    }
  },
  created() {
  },
  methods: {
    handleClick(val) {
      console.log('tag', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.resource-view{
  padding: 10px;
  .resource-content{
    background: #ffffff;
    border-radius: 5px;
    box-shadow: 0px 10px 20px #ccc;
    padding: 20px;
  }
}
</style>
