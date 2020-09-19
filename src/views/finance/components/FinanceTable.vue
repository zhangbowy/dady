<template>
  <div class="">
    <el-table
      v-loading="loading"
      :data="data"
      style="width: 100%"
      fit
      highlight-current-row
      tooltip-effect="dark"
    >
      <el-table-column
        :label="$t('序号')"
        align="center"
        width="100"
        type="index"
      />
      <el-table-column
        :label="`${$t('团队')}/${$t('联系电话')}`"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.designer_team_name }}/{{ scope.row.designer_phone }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('提现金额')"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.cash_amount }}{{ $t('元') }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('结算方式')"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          {{ scope.row.cash_type==1?'手动打款': '线上' }}
        </template>
      </el-table-column>
      <el-table-column
        :label="`${$t('卡号')}/${$t('微信号')}/${$t('支付号')}`"
        align="left"
      >
        <template slot-scope="scope">
          <p style="margin:0 ">{{ $t('卡号') }}：{{ scope.row.bank_card_number }}</p>
          <p style="margin:0 ">{{ $t('微信号') }}：{{ scope.row.wechat }}</p>
          <p style="margin:0 ">{{ $t('支付号') }}：{{ scope.row.alipay }}</p>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('状态')"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">
            {{ $t(scope.row._status) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="created_at"
        :label="$t('申请日期')"
        align="center"
      />
      <el-table-column
        prop="verify_time"
        :label="`${$t('发放')}/${$t('驳回时间')}`"
        align="center"
      />
      <el-table-column
        prop="remark"
        :label="$t('说明')"
        align="center"
      />
      <el-table-column
        fixed="right"
        :label="$t('操作')"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status==3"
            size="mini"
            type="primary"
            style="margin: 0 0 10px"
            @click.native="showDialog( scope.row)"
          >{{ $t('修改') }}</el-button>
          <el-button
            v-if="scope.row.status==1"
            size="mini"
            type="primary"
            style="margin: 0 0 10px"
            @click.native="showDialog( scope.row)"
          >{{ $t('发放') }}</el-button>
          <el-button
            v-if="scope.row.status==1"
            size="mini"
            type="danger"
            style="margin: 0 0 10px"
            @click="rejectApply(scope.row)"
          >{{ $t('驳回') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: '',
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'warning',
        2: '',
        3: 'success',
        4: 'success'
      }
      return statusMap[status]
    }
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {

    }
  },
  created() {

  },

  methods: {
    showDialog(row) {
      this.$emit('showDetail', row)
    },
    rejectApply(row) {
      this.$emit('reject', row)
    }
  }
}
</script>

<style scoped lang="sass">

</style>
