<template>
  <div class="finance-list main-content">
    <div class="finance-statistics">
      <panel-group :panel-data="panelData" />
    </div>
    <div class="screen-box">
      <div class="screen-item">
        <el-input
          v-model="keywords"
          size="small"
          placeholder="请输入团队名称"
          clearable
          style="width:220px"
          @keyup.enter.native="fetchData"
        />
        <el-button size="small" icon="el-icon-search" type="primary" @click.native="fetchData">查询</el-button>
      </div>
    </div>
    <div class="content">
      <el-table
        v-loading="loading"
        :data="financeList"
        style="width: 100%"
        fit
        highlight-current-row
        tooltip-effect="dark"
      >
        <el-table-column
          label="序号"
          align="center"
          width="100"
          type="index"
        />
        <el-table-column
          label="团队"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.admin }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="管理员"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.admin?scope.row.admin.name:'无' }}/{{ scope.row.admin?scope.row.admin.phone: '无' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="shop_name"
          label="总金额"
          align="center"
        />
        <el-table-column
          prop="shop_name"
          label="结算金额"
          align="center"
        />
        <el-table-column
          prop="shop_name"
          label="结算周期"
          align="center"
        />
        <el-table-column
          prop="shop_name"
          label="结算方式"
          align="center"
        />
        <el-table-column
          prop="created_at"
          label="结算日期"
          align="center"
        />
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click.native="showDialog('detail', scope.row)"
            >查看</el-button>
            <!-- <el-button
              size="mini"
              @click.native="showDialog('edit', scope.row)"
            >编辑</el-button> -->
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.shop_id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
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
import { financeApi } from '@/api/finance'
import PanelGroup from './components/PanelGroup'
export default {
  components: {
    PanelGroup
  },
  data() {
    return {
      keywords: '',
      panelData: {},
      financeList: [],
      loading: false,
      total: 0,
      currentPage: 1,
      pageSize: 10

    }
  },
  created() {
    this.fetchData()
  },
  mounted() {

  },
  methods: {
    fetchData() {
      financeApi.getList({
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }).then(res => {
        console.log(res)
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
