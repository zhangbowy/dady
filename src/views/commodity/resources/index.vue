<template>
  <div class="resource-view">
    <div class="resource-content">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-loading="loading" label="图片" name="1">
          <img-resources />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import ImgResources from './components/ImgResources'
import { GroupApi } from '@/api/common'
import imgApi from '@/api/common/image'
export default {
  components: {
    ImgResources
  }, data() {
    return {
      loading: true,
      activeName: '1',
      groupData: [],
      imgList: []
    }
  },
  created() {
    // this.fetchData()
  },
  methods: {
    fetchData() {
      this.getGroupList()
      this.getImgList()
    },
    getGroupList() {
      GroupApi.getGroupList().then(res => {
        this.groupData = res.data
      })
    },
    getImgList() {
      imgApi.getList().then(res => {
        this.loading = false
        this.imgList = res.data.data
      })
    },
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
