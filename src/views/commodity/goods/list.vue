<template>
  <div class="goods-list main-content">
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
        <router-link :to="'/commodity/goodsEdit'">
          <el-button size="small" icon="el-icon-plus" type="primary">新增</el-button>
        </router-link>
      </div>
    </div>
    <div class="content">
      <el-table
        ref="multipleTable"
        :data="goodsList"
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
            <img :src="scope.row.images" alt="" width="60" height="60">
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="商品标题"
          align="center"
        />
        <el-table-column
          prop="volume"
          label="销量"
          align="center"
          sortable
        />
        <el-table-column
          prop="sum_stock"
          label="库存"
          align="center"
          sortable
        />
        <el-table-column
          label="状态"
          align="center"
          width="250"
        >
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status==0?'待审核':'已上架' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="created_at"
          label="创建时间"
          align="center"
        />
        <el-table-column
          prop="updated_at"
          label="最后更新时间"
          align="center"
        />
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <router-link :to="`/commodity/goodsDetail?id=${scope.row.id}`">
              <el-button
                size="mini"
              >查看</el-button>
            </router-link>
            <router-link :to="`/commodity/goodsEdit?id=${scope.row.id}`">
              <el-button
                size="mini"
              >编辑</el-button>
            </router-link>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.id)"
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
import { getList, deleteGoods } from '@/api/goods'
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
  data() {
    return {
      keywords: '',
      baseUrl: process.env.VUE_APP_BASE_API,
      pageSize: 10,
      currentPage: 1,
      total: 2,
      goodsList: [],
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
      multipleSelection: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getList({
        pageSize: this.pageSize,
        currentPage: this.currentPage
      }).then(res => {
        this.goodsList = res.data.data
        this.total = res.data.count
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleDelete(id) {
      this.$confirm('是否删除该商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'danger',
        center: true
      }).then(() => {
        deleteGoods({
          id: id
        }).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.fetchData()
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
.goods-list{
  .screen-box{
    .screen-item{
      text-align: left;
    }
  }
}

</style>
