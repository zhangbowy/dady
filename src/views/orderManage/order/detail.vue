<template>
  <div v-loading="loading" class="order-detail">
    <div class="title-info">
      <card-tag tag-name="订单状态" />
    </div>
    <div class="order-detail-content">
      <div class="detail-header">
        <!-- 普通订单状态 -->
        <el-steps v-if="orderDetail.order_type==1" align-center :space="200" :active="active">
          <el-step title="待支付" />
          <el-step title="待发货" />
          <el-step title="待收货" />
          <el-step title="已完成" />
          <el-step title="已关闭" />
        </el-steps>
        <!-- 一般定制状态  手绘状态 -->
        <el-steps v-if="orderDetail.order_type==2 || orderDetail.order_type==4" align-center :space="200" :active="active">
          <el-step title="待支付" />
          <el-step title="待派单" />
          <el-step title="派单中" />
          <el-step title="处理中" />
          <el-step title="下发机器" />
          <el-step title="待发货" />
          <el-step title="待收货" />
          <el-step title="已完成" />
          <el-step title="已关闭" />
        </el-steps>
        <!-- 特殊定制状态 -->
        <el-steps v-if="orderDetail.order_type==3" align-center :space="200" :active="active">
          <el-step title="询价中" />
          <el-step title="已回复" />
          <el-step title="待支付" />
          <el-step title="待派单" />
          <el-step title="派单中" />
          <el-step title="处理中" />
          <el-step title="下发机器" />
          <el-step title="待发货" />
          <el-step title="待收货" />
          <el-step title="已完成" />
          <el-step title="已关闭" />
        </el-steps>
      </div>
      <div class="order-info">
        <card-tag tag-name="基本信息" />
        <div class="order-info-content">
          <el-row class="info-tabel">
            <el-col class="info-th" :span="6">订单号：</el-col>
            <el-col class="info-th" :span="6">订单类型：<el-button v-if="orderDetail.order_type==2 || orderDetail.order_type==3 || orderDetail.order_type==4" type="text" style="padding: 0" @click="showDesign(orderDetail)">定制信息</el-button></el-col>
            <el-col class="info-th" :span="6">买家信息：<el-button type="text" style="padding: 0" @click="useInfoDialog = true">信息</el-button></el-col>
            <el-col class="info-th" :span="6">下单时间：</el-col>
          </el-row>
          <el-row class="info-tabel">
            <el-col class="info-td" :span="6"><div>{{ orderDetail.order_no }}</div> </el-col>
            <el-col class="info-td" :span="6"><div style="color: orange">{{ orderDetail._order_type }}</div> </el-col>
            <el-col class="info-td" :span="6"><div>{{ orderDetail.user.nickname?orderDetail.user.nickname:'' }}</div> </el-col>
            <el-col class="info-td" :span="6"><div>{{ orderDetail.created_at }}</div></el-col>
          </el-row>
          <el-row class="info-tabel">
            <el-col class="info-th" :span="6">订单状态：</el-col>
            <el-col class="info-th" :span="6">配送方式：</el-col>
            <el-col class="info-th" :span="6">付款时间：</el-col>
            <el-col class="info-th" :span="6">发货时间：</el-col>
          </el-row>
          <el-row class="info-tabel">
            <el-col class="info-td" :span="6">{{ orderDetail._status }}</el-col>
            <el-col class="info-td" :span="6">{{ orderDetail._logistics_type }}</el-col>
            <el-col class="info-td" :span="6">{{ orderDetail.pay_time?orderDetail.pay_time:'未付款' }}</el-col>
            <el-col class="info-td" :span="6">{{ orderDetail.send_time?orderDetail.send_time:'待发货' }}</el-col>
          </el-row>
        </div>
      </div>
      <div class="order-info">
        <card-tag tag-name="收货人信息" />
        <div class="order-info-content">
          <el-row class="info-tabel">
            <el-col class="info-th" :span="6">收货人：</el-col>
            <el-col class="info-th" :span="6">手机号码：</el-col>
            <el-col class="info-th" :span="6">收货地址：</el-col>
          </el-row>
          <el-row class="info-tabel">
            <el-col class="info-td" :span="6">{{ orderDetail.receiver_name }}</el-col>
            <el-col class="info-td" :span="6">{{ orderDetail.receiver_phone }}</el-col>
            <el-col class="info-td" :span="6">{{ orderDetail.receiver_address }}</el-col>
          </el-row>
        </div>
      </div>
      <div class="order-info">
        <card-tag tag-name="商品信息" />
        <div class="order-info-content">
          <el-row class="info-tabel">
            <el-col class="info-th" :span="6">商品基本信息：</el-col>
            <el-col class="info-th" :span="6">单价/购买数量:</el-col>
            <el-col class="info-th" :span="6">规格信息：</el-col>
            <el-col class="info-th" :span="6">快递单号：</el-col>
          </el-row>
          <el-row v-for="(item,index) in orderDetail.order_item" :key="`${index}-${item.id}`" class="info-tabel goods" type="flex" align="middle">
            <el-col class="info-td" :span="6">
              <img :src="item.image" width="50" height="50" alt="">
              <p>{{ item.name }}</p>
            </el-col>
            <el-col class="info-td" :span="6"> <span style="color: #ee0a24">￥{{ item.current_price }}</span>/{{ item.buy_num }}件</el-col>
            <el-col class="info-td" :span="6">{{ item.sku_name }}</el-col>
            <el-col class="info-td" :span="6">
              {{ orderDetail.status==1?'未付款': item.express_number?item.express_number:'未发货' }}
              <el-button v-if=" orderDetail.status===3" v-has="502" type="text" style="padding: 0" @click.stop="getOrderTrace(item.order_item_id)">查看</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
      <!--
      <div v-if="orderDetail.status!=-2" class="order-info">
        <card-tag tag-name="订单操作" />
        <div class="order-info-content">
          <div class="remark-box">
            <el-input
              v-model="remark"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
            />
          </div>
          <div class="operation-button">
            <el-button type="primary" size="mini">确认付款</el-button>
            <el-button type="primary" size="mini">确认收货</el-button>
            <el-button type="primary" size="mini">派单</el-button>
            <el-button type="warning" size="mini">取消订单</el-button>
             <el-button type="warning" size="mini">售后订单</el-button>
          </div>
        </div>
      </div>
      -->
    </div>
    <!-- 买家信息弹框 -->
    <el-dialog
      v-dialogDrag
      title="买家信息"
      :visible.sync="useInfoDialog"
      width="30%"
    >
      <p>id：{{ orderDetail.user.id }}</p>
      <p>昵称：{{ orderDetail.user.nickname?orderDetail.user.nickname:'' }}</p>
      <p>城市：{{ orderDetail.user.province }}{{ orderDetail.user.city }}</p>
    </el-dialog>

    <!-- <el-dialog
      title="定制详情"
      :visible.sync="designInfo"
      width="40%"
      center
    /> -->
    <design-dialog v-model="designInfo" :info-item="designInfoItem" @close="designInfo = false" />
    <!-- 物流信息弹框 -->
    <el-dialog
      v-dialogDrag
      title="物流详情"
      :visible.sync="expressDialog"
      width="40%"
      class="express-dialog"
    >
      <div class="express-info">
        <p><span>{{ order_trace.express_name }} </span> <span> 快递单号：{{ order_trace.express_number }}</span></p>
        <div v-if="order_trace.traces">
          <el-timeline>
            <el-timeline-item
              v-for="(traces, index) in order_trace.traces"
              :key="index"
              :timestamp="traces.datetime"
            >
              {{ traces.content }}
            </el-timeline-item>
          </el-timeline>
        </div>
        <div v-else>
          暂无物流信息...
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import CardTag from '@/components/CardTag'
import { orderApi } from '@/api/order'
import DesignDialog from './components/DesignDialog'
export default {
  components: {
    CardTag,
    DesignDialog
  },
  data() {
    return {
      loading: true,
      remark: '',
      useInfoDialog: false,
      expressDialog: false,
      designInfo: false,
      designInfoItem: {},
      order_no: this.$route.query.order_no,
      orderDetail: {
        user: {}
      },
      order_trace: {},
      active: 0
    }
  },
  created() {
    this.getDetail(this.order_no)
  },
  methods: {
    getDetail(order_no) {
      this.loading = true
      orderApi.getOrderDetail({
        order_no: order_no
      }).then(res => {
        this.orderDetail = res.data
        this.loading = false
        const status = res.data.status
        // 普通订单
        if (res.data.order_type === 1) this.active = status === 1 ? 0 : status === 2 ? 1 : status === 3 ? 2 : status === 4 ? 3 : status === 5 ? 4 : status === 6 ? 5 : 6
        // 一般定制订单 // 手绘订单
        if (res.data.order_type === 2 || res.data.order_type === 4) this.active = status === 1 ? 0 : status === 7 ? 1 : status === 8 ? 2 : status === 9 ? 3 : status === 10 ? 4 : status === 2 ? 5 : status === 3 ? 6 : status === 4 ? 7 : 8
        // 特殊定制订单
        if (res.data.order_type === 3) this.active = status === 5 ? 0 : status === 6 ? 1 : status === 1 ? 2 : status === 7 ? 3 : status === 8 ? 4 : status === 9 ? 5 : status === 10 ? 6 : status === 2 ? 7 : status === 3 ? 8 : status === 4 ? 9 : 10
      })
    },
    showDesign(orderDetail) {
      this.designInfo = true
      this.designInfoItem = orderDetail.order_item[0]
    },
    getOrderTrace(id) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.7)'
      })
      orderApi.orderTrace({
        order_item_id: id
      }).then(res => {
        this.order_trace = res.data
        loading.close()
        this.expressDialog = true
      }).catch(() => {
        loading.close()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.order-detail{
  padding: 15px;
  .order-detail-content{
    .detail-header{
      padding: 10px;
      background: #ffffff;
      border-bottom: 10px solid #f5f5f5;
    }
    .order-info{
      margin-bottom: 10px;
      .order-info-content{
        background: #ffffff;
        .info-tabel{
          padding: 10px 20px;
          color: #000;
          font-size: 14px;
          border-bottom: 1px solid #f5f5f5;
          .info-th{
            color: #666;
          }
          &.goods{
            border-bottom: 10x solid #f5f5f5;
          }
        }

        .remark-box{
          padding: 20px;
        }
        .operation-button{
          padding: 20px;
        }
      }
    }
  }

}
.express-info{
  p{
    border-bottom: 1px solid #f5f5f5;
    padding: 10px;
    margin: 0;
    span{
      padding-right: 10px;
    }
  }
}

</style>

<style lang="scss">
  .express-dialog{
    .el-dialog{
      position: absolute;
      top: 50%;
      left: 50%;
      margin: 0 !important;
      transform: translate(-50%, -50%);
      max-height: calc(100% - 30px);
      max-width: calc(100% - 30px);
      display: flex;
      flex-direction: column;
      height: 60vh;
      overflow: hidden;
    }
    .el-dialog__body {
      overflow: auto;
    }

  }
</style>
