<template>

  <el-row :gutter="40" class="panel-group">
    <el-row>
      <el-col>
        <span class="data-title">财务统计</span>
      </el-col>
    </el-row>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="income" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            提现中
          </div>
          <count-to :start-val="0" :end-val="panelData.audit_commission" :decimals="2" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-pattern">
          <svg-icon icon-class="expend" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            已提现
          </div>
          <count-to :start-val="0" :end-val="panelData.withdrawals_commission" :decimals="2" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="total-expend" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            累计提现
          </div>
          <count-to :start-val="0" :end-val="panelData.total_commission" :decimals="2" :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="total-income" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            累计收入
          </div>
          <count-to :start-val="0" :end-val="panelData.total_pay_amount" :decimals="2" :duration="3200" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  props: {
    panelData: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  background: #fff;
  margin: 0 !important;
  border-radius: 20px !important;
  margin-bottom: 20px !important;
  .data-title{
    padding: 16px;
    font-size: 18px;
    font-weight: bold;
    display: inline-block;
  }
  .card-panel-col {
    margin-bottom: 20px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    border-radius: 20px;

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
        box-shadow: 0px 5px 20px rgba(64, 201, 199, 0.6)
      }

      .icon-pattern {
        background: #36a3f7;
        box-shadow: 0px 5px 20px rgba(54, 163, 247, 0.6)
      }

      .icon-money {
        background: #f4516c;
        box-shadow: 0px 5px 20px rgba(244, 81, 108, 0.6);
      }

      .icon-shopping {
        background: #34bfa3;
        box-shadow: 0px 5px 20px rgba(52, 191, 163, 0.6)
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-pattern {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 12px;
      transition: all 0.38s ease-out;
      border-radius: 20px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
