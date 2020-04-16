<template>
  <div>
    <!-- <div class="order-list">
      <div class="order-item">
        <div class="order-header">
          <div class="header-item">
            <div>商品</div>
            <div>单价/数量</div>
          </div>
          <div class="header-item">
            <div>订单状态</div>
          </div>
          <div class="header-item">
            <div>收货人</div>
          </div>
          <div class="header-item">
            <div>买家信息</div>
          </div>
          <div class="header-item">
            <div>买家留言</div>
          </div>
          <div class="header-item">
            <div>实付金额</div>
          </div>
          <div class="header-item">
            <div>订单操作</div>
          </div>
        </div>
        <div class="order-item-content">
          <el-checkbox-group v-model="checkList">
            <div v-for="(item, index) in data" :key="item.id+index" class="item-box">
              <div class="item-header">
                <el-checkbox />
                <span>订单号：{{ item.orderNo }}</span>
                <span>{{ item.payType==1?'线下支付': '在线支付' }}</span>
                <span>{{ item.ordrType==1?'普通订单': '手动订单' }}</span>
                <span>{{ item.payTime }}</span>
              </div>
              <div class="item-content">
                <div class="content-cell">
                  <img :src="item.goodsImg" alt="" width="80" height="80">
                  <span>{{ item.goodName }}</span>
                </div>
              </div>
            </div>
          </el-checkbox-group>
        </div>
      </div>
    </div> -->

    <el-table
      ref="multipleTable"
      :data="data"
      style="width: 100%"
      fit
      highlight-current-row
      tooltip-effect="dark"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        label="商品图片"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <img :src="scope.row.goodsImg" alt="" width="60" height="60">
        </template>
      </el-table-column>
      <el-table-column
        prop="goodName"
        label="商品标题"
        align="center"
      />
      <el-table-column
        prop="salesVolume"
        label="销量"
        align="center"
        sortable
      />
      <el-table-column
        label="状态"
        align="center"
        width="250"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status==0?'待付款':scope.row.status==1?'待发货':scope.row.status==2? '待收货':'已完成' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="创建时间"
        align="center"
      />
      <el-table-column
        prop="update_time"
        label="最后更新时间"
        align="center"
      />
      <el-table-column
        fixed="right"
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <router-link :to="`/commodity/orderDetail?id=${scope.row.id}`">
            <el-button
              size="mini"
              style="margin-bottom: 10px"
            >查看</el-button>
          </router-link>
          <el-button
            v-if="scope.row.status==0"
            size="mini"
            style="margin-bottom: 10px"
          >取消订单</el-button>
          <el-button
            v-if="scope.row.status==0"
            size="mini"
            style="margin-bottom: 10px"
          >确认付款</el-button>
          <el-button
            v-if="scope.row.status==1"
            size="mini"
            style="margin-bottom: 10px"
          >修改发货地址</el-button>
          <el-button
            v-if="scope.row.status==1"
            size="mini"
            style="margin-bottom: 10px"
          >发货</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'danger',
        2: 'danger'
      }
      return statusMap[status]
    }
  },
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      checkList: [],
      multipleSelection: []
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style>

</style>
