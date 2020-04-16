<template>
  <div class="order-list main-content">
    <div class="screen-box">
      <div class="screen-item">
        <el-input
          v-model="keywords"
          size="small"
          placeholder="请输入关键词"
          clearable
          style="width:220px"
        />
        <el-select v-model="status" size="small" multiple placeholder="请选择">
          <el-option
            v-for="item in statusOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button size="small" icon="el-icon-search" type="primary">搜索</el-button>
      </div>
      <div class="operation">
        <router-link :to="'/commodity/orderEdit'">
          <el-button size="small" icon="el-icon-plus" type="primary">新增</el-button>
        </router-link>
      </div>
    </div>
    <div class="content">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="全部" name="1">
          <order-table :data="orderList" />
        </el-tab-pane>
        <el-tab-pane label="待付款" name="2">
          <order-table :data="orderList" />
        </el-tab-pane>
        <el-tab-pane label="待发货" name="3">
          <order-table :data="orderList" />
        </el-tab-pane>
        <el-tab-pane label="已发货" name="4">
          <order-table :data="orderList" />
        </el-tab-pane>
        <el-tab-pane label="已完成" name="5">
          <order-table :data="orderList" />
        </el-tab-pane>
        <el-tab-pane label="已关闭" name="6">
          <order-table :data="orderList" />
        </el-tab-pane>
      </el-tabs>
      <!-- 分页 -->
      <div class="pagination-box">
        <el-pagination
          :total="total"
          :current-page="currentPage"
          :page-sizes="[5, 10, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import OrderTable from './components/OrderTable'
export default {
  components: {
    OrderTable
  },

  data() {
    return {
      keywords: '',
      baseUrl: process.env.VUE_APP_BASE_API,
      pageSize: 5,
      currentPage: 1,
      total: 2,
      orderList: [{
        id: 1,
        orderNo: '202004160001',
        goodsImg: 'http://img.tecqm.cn/upload_375541a0001c9e4b09d48086a71965ac.jpg',
        goodName: '苹果xs',
        desc: '苹果xs手机',
        create_time: '2020-4-14 15:40:28',
        price: '10',
        salesVolume: 100,
        status: 0,
        update_time: '2020-4-14 15:47:28'
      }, {
        id: 1,
        orderNo: '202004160002',
        goodsImg: 'http://img.tecqm.cn/upload_375541a0001c9e4b09d48086a71965ac.jpg',
        goodName: '苹果x',
        desc: '苹果x手机',
        create_time: '2020-4-15 15:40:28',
        price: '100',
        salesVolume: 1,
        status: 1,
        update_time: '2020-4-15 15:47:28'
      }],
      statusOption: [{
        value: '0',
        label: '待审核'
      }, {
        value: '1',
        label: '出售中'
      }, {
        value: '2',
        label: '待上架'
      }, {
        value: '3',
        label: '仓库中'
      }, {
        value: '4',
        label: '已售罄'
      }],
      status: '',
      multipleSelection: [],
      activeName: '1'
    }
  },
  methods: {

    handleClick(tab, event) {
      console.log(tab, event)
    },
    handleDelete(id) {
      this.$confirm('是否删除该商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'danger',
        center: true
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchData()
    }
  }
}
</script>

<style lang="scss" scoped>
.order-list{
  .screen-box{
    .screen-item{
      text-align: left;
    }
  }
  .content{
    background: #fff;
    padding: 10px;
  }
}

</style>
