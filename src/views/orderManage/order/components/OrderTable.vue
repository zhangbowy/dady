<template>
  <div>
    <div class="order-list">
      <div class="order-item">
        <el-row class="order-header">
          <el-col :span="6" class="header-item">
            <el-row>
              <el-col :span="16">商品</el-col>
              <el-col :span="8" class="alignR">单价/数量</el-col>
            </el-row>
          </el-col>
          <el-col :span="3" class="header-item">
            订单状态
          </el-col>
          <el-col :span="3" class="header-item">
            收货人
          </el-col>
          <el-col :span="3" class="header-item">
            买家信息
          </el-col>
          <el-col :span="3" class="header-item">
            买家留言
          </el-col>
          <el-col :span="3" class="header-item">
            实付金额
          </el-col>
          <el-col :span="3" class="header-item">
            订单操作
          </el-col>
        </el-row>

        <div class="order-item-content">
          <el-checkbox-group v-model="checkList">
            <div v-for="(item, index) in data" :key="`${item.id}-${index}`" class="item-box">
              <div class="item-header">
                <el-checkbox :label="item.id" />
                <span>订单号：{{ item.order_no }}</span>
                <span>{{ item.payType==1?'线下支付': '在线支付' }}</span>
                <span>{{ item.ordrType==1?'普通订单': '手动订单' }}</span>
                <span>{{ item.payTime }}</span>
              </div>
              <el-row class="item-content" type="flex" align="middle">
                <el-col :span="6" class="td-item">
                  <el-row v-for="good in item.order_item" :key="good.sku_id">
                    <el-col :span="16" style="text-align:left">
                      <img :src="good.image" alt="" width="80" height="80">
                      <div>
                        <span>{{ good.name }}</span>
                        <span>{{ good.sku_name }}</span>
                      </div>
                    </el-col>
                    <el-col :span="8" class="alignR">{{ good.current_price }}元/{{ good.buy_num }}件</el-col>
                  </el-row>
                </el-col>
                <el-col :span="3" class="td-item">
                  {{ item._status }}
                </el-col>
                <el-col :span="3" class="td-item">{{ item.receiver_name }}/{{ item.receiver_phone }}</el-col>
                <el-col :span="3" class="td-item">{{ item.receiver_name }}</el-col>
                <el-col :span="3" class="td-item">{{ item.buyer_message }}</el-col>
                <el-col :span="3" class="td-item">{{ item.pay_amount }}元</el-col>
                <el-col :span="3" class="td-item">
                  <el-button
                    size="mini"
                    type="primary"
                  >订单详情</el-button>
                  <!-- <el-button
                    size="mini"
                    @click.native="showDialog('edit', scope.row)"
                  >编辑</el-button> -->
                  <el-button
                    size="mini"
                    type="primary"
                    style="margin: 10px 0 0"
                  >确认发货</el-button>
                  <el-button
                    size="mini"
                    type="primary"
                    style="margin: 10px 0 0"
                  >取消订单</el-button>
                </el-col>
              </el-row>
            </div>
          </el-checkbox-group>
        </div>
      </div>
    </div>

    <!-- <el-table
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
    </el-table> -->
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
      checkList: []
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.order-header{
  align-items: center;
  font-size: 16px;
  padding: 0 10px;
  box-shadow: 0px 10px 20px #fcfcfc;
  margin-bottom: 20px;
  background: #fafafa;
  border: 1px solid #eee;
  border-radius: 5px;
  .header-item{
    text-align: center;
    border-right: 1px solid #eee;
    padding: 10px 5px;
    &:last-child{
      border-right: none;
    }
  }
}
.order-item-content{
  .item-box{
    margin-bottom: 20px;
    border-radius: 5px;
    border: 1px solid #fafafa;
    box-shadow: 0px 10px 20px #cccccc;
    vertical-align: middle;
    .item-header{
      padding: 10px;
      background: #f5f5f5;
      span{
        margin-left: 10px;
      }
    }
    .item-content{
      padding: 0 10px;
      &:hover{
        background: #fafafa;
      }
      .td-item{
        padding: 10px 5px;
        text-align: center;
        border-right: 1px solid #eee;
        &:last-child{
          border: none
        }
      }
    }
  }
}
.el-checkbox-group{
  font-size: 14px;
  .el-checkbox{
    span{
      font-size: 0;
    }
  }
}
</style>

<style lang="scss">
.order-list{
  .el-checkbox__label{
    display: none
    ;
  }
}
</style>
