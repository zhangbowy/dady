<template>
  <div class="finance-list main-content">
    <div class="finance-statistics">
      <panel-group :panel-data="panelData" />
    </div>
    <div class="screen-box">
      <div class="screen-item">
        <el-select v-model="designer_team_id" clearable size="small" placeholder="设计师团队">
          <el-option
            v-for="item in designerTeam"
            :key="item.designer_team_id"
            :label="item.designer_team_name"
            :value="item.designer_team_id"
          />
        </el-select>
        <el-select v-model="status" clearable size="small" placeholder="提现状态">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button size="small" icon="el-icon-search" type="primary" @click.native="fetchData">查询</el-button>
      </div>
    </div>
    <div class="content">
      <!-- 财务列表 -->
      <Finance-Table
        :data="financeList"
        :loading="loading"
        @showDetail="showDialog"
        @reject="rejectApply"
      />
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
    <!-- 审核弹框 -->
    <finance-dialog
      v-model="itemDialog"
      :item="rowItem"
      :withdrawable="panelData.withdrawable_commission"
      @submit="submitFinance"
      @close="itemDialog = false"
    />
    <!-- 驳回弹框 -->
    <reject-dialog
      v-model="showReject"
      :item="rowItem"
      @submit="submitReject"
      @close="showReject = false"
    />
  </div>
</template>

<script>
import { financeApi } from '@/api/finance'
import { getTeamList } from '@/api/designer'
import PanelGroup from './components/PanelGroup'
import FinanceTable from './components/FinanceTable'
import FinanceDialog from './components/FinanceDialog'
import RejectDialog from './components/RejectDialog'
export default {
  components: {
    PanelGroup,
    FinanceTable,
    FinanceDialog,
    RejectDialog
  },
  data() {
    return {
      keywords: '',
      statusOptions: [
        { label: '提现中', value: 1 },
        { label: '已驳回', value: 2 },
        { label: '已提现', value: 3 }
      ],
      designer_team_id: '',
      designerTeam: [],
      status: '',
      panelData: {
        withdrawable_commission: 200
      },
      financeList: [],
      loading: false,
      total: 0,
      currentPage: 1,
      pageSize: 10,
      rowItem: {},
      itemDialog: false, // 是否显示提现申请详情
      showReject: false // 是否显示驳回提现申请
    }
  },
  created() {
    this.fetchData()
    // 获取团队列表
    this.getDesignerTeam()
  },
  methods: {
    fetchData() {
      // 获取财务列表
      financeApi.getCashList({
        designer_team_id: this.designer_team_id,
        status: this.status,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }).then(res => {
        this.financeList = res.data.data
        this.total = res.data.count
      })

      // 获取统计数据
      financeApi.getData().then(res => {
        this.panelData = res.data
      })
    },
    getDesignerTeam() {
      getTeamList({
        pageSize: 1000
      }).then(res => {
        this.designerTeam = res.data.data
      })
    },
    // 显示发放弹框
    showDialog(row) {
      this.rowItem = row
      this.itemDialog = true
    },
    // 驳回申请
    rejectApply(row) {
      this.rowItem = row
      this.showReject = true
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchData()
    },
    // 提交发放
    submitFinance(form) {
      financeApi.cashVerify({
        cash_id: form.cash_id,
        cert: form.cert,
        remark: form.remark
      }).then(res => {
        this.$message({
          type: 'success',
          message: res.msg || '操作成功'
        })
        this.fetchData()
        this.itemDialog = false
      })
    },
    // 驳回申请
    submitReject(form) {
      financeApi.cashRefused({
        cash_id: form.cash_id,
        remark: form.remark
      }).then(res => {
        this.$message({
          type: 'success',
          message: res.msg || '操作成功'
        })
        this.fetchData()
        this.showReject = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.finance-list{
  .screen-box{
    .screen-item{
      text-align: left;
    }
  }
  .finance-statistics{
    background: #fff;
    position: relative;
    -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
    border-radius: 5px;
    margin-bottom: 10px;
  }
}
</style>
