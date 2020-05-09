<template>
  <div class="order-list main-content">
    <div class="screen-box">
      <div class="screen-item">
        <el-input
          v-model.trim="keywords"
          size="small"
          placeholder="请输入订单号"
          clearable
          style="width:280px"
        />
        <!-- <el-select v-model="status" size="small" clearable placeholder="请选择">
          <el-option
            v-for="item in statusOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select> -->
        <el-select v-model="order_type" size="small" clearable placeholder="请选择订单类型">
          <el-option
            v-for="item in orderTypeOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button size="small" icon="el-icon-search" type="primary" @click="doSearch()">搜索</el-button>
      </div>
    </div>
    <div class="content">
      <el-tabs v-model="activeName" v-loading="loading" type="card" @tab-click="handleClick">
        <el-tab-pane
          v-for="(value, key) in orderCount"
          :key="key"
          :label="`${key==0?'全部':key==1?'待支付':key==2?'待发货':key==3?'待收货':key==4?'已完成':key==5?'询价中':key==6?'已回复':'已取消'}(${value})`"
          :name="key"
        />
        <!-- <el-tab-pane label="待付款" name="1" />
        <el-tab-pane label="待发货" name="2" />
        <el-tab-pane label="已发货" name="3" />
        <el-tab-pane label="已完成" name="4" />
        <el-tab-pane label="询价中" name="5" />
        <el-tab-pane label="已回复" name="6" />
        <el-tab-pane label="已关闭" name="-2" /> -->
        <div class="tab-content">
          <order-table :data="orderList" @getList="getListData" />
        </div>
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
import { orderApi } from '@/api/order'
export default {
  components: {
    OrderTable
  },

  data() {
    return {
      loading: true,
      keywords: '',
      order_type: '',
      pageSize: 5,
      currentPage: 1,
      total: 2,
      orderList: [],
      orderTypeOption: [{
        value: '1',
        label: '普通订单'
      }, {
        value: '2',
        label: '一般定制'
      }, {
        value: '3',
        label: '特殊定制'
      }, {
        value: '4',
        label: '手绘'
      }],
      statusOption: [{
        value: '',
        label: '全部'
      }, {
        value: '1',
        label: '待付款'
      }, {
        value: '2',
        label: '待发货'
      }, {
        value: '3',
        label: '已发货'
      }, {
        value: '4',
        label: '已完成'
      }, {
        value: '5',
        label: '询价中'
      }, {
        value: '6',
        label: '询价回复'
      }, {
        value: '-2',
        label: '已关闭/取消订单'
      }],
      status: '',
      multipleSelection: [],
      activeName: '0',
      orderCount: {}
    }
  },
  created() {
    this.getOrderCount()
    this.fetchData()
  },
  methods: {
    // 刷新页面
    getListData() {
      this.getOrderCount()
      this.fetchData()
    },
    // 请求列表数据
    fetchData() {
      orderApi.getList({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        status: this.status,
        order_no: this.keywords,
        order_type: this.order_type
      }).then(res => {
        this.loading = false
        this.orderList = res.data.data
        this.total = res.data.count
      })
    },
    // 获取各个状态数量统计
    getOrderCount() {
      orderApi.getOrderCount({
        order_no: this.keywords,
        order_type: this.order_type
      }).then(res => {
        this.orderCount = res.data
      })
    },
    // 选项卡点击
    handleClick(tab, event) {
      this.currentPage = 1
      this.status = tab.name
      this.loading = true
      this.fetchData()
    },
    // 执行搜索
    doSearch() {
      this.currentPage = 1
      this.loading = true
      this.getListData()
    },
    // 分页当前页改变
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
    },
    // 分页大小改变
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchData()
    }
  }
}
</script>

<style lang="scss" scoped>
.order-list{
  padding: 0 20px;
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
