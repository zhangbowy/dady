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
        <el-select v-model="status" size="small" clearable placeholder="请选择商品状态">
          <el-option
            v-for="item in statusOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button size="small" icon="el-icon-search" type="primary" @click="fetchData">搜索</el-button>
        <el-button size="small" icon="el-icon-refresh-right" @click="reset">重置</el-button>
      </div>
      <div class="operation">
        <router-link :to="'/commodity/goods/edit'">
          <div>
            <el-button v-has="15" size="small" icon="el-icon-plus" type="primary">新增</el-button>
          </div>
        </router-link>
      </div>
    </div>
    <div class="content">
      <el-table
        ref="multipleTable"
        v-loading="loading"
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
            <el-image :key="scope.row.thumb_image_path" class="goods_img" :src="scope.row.thumb_image_path" lazy />
            <!-- <img :src="scope.row.thumb_image_path" alt="" width="60" height="60"> -->
          </template>
        </el-table-column>
        <el-table-column
          label="商品信息"
        >
          <template slot-scope="scope">
            <p>{{ scope.row.name }}</p>
            <span class="current-price">￥{{ scope.row.current_price }}</span>
            <span class="old-price">￥{{ scope.row.old_price }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="sale_num"
          label="销量"
          align="center"
          sortable
        />
        <el-table-column
          prop="pv"
          label="浏览量"
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
        >
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status==1?'待审核':scope.row.status==3? '已上架':'待上架' }}</el-tag>
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
          width="180"
        >
          <template slot-scope="scope">
            <div class="operate-btn">
              <router-link :to="`/commodity/goods/detail?id=${scope.row.id}`">
                <el-button
                  v-has="16"
                  size="mini"
                >查看</el-button>
              </router-link>
              <router-link :to="`/commodity/goods/edit?id=${scope.row.id}`">
                <el-button
                  v-has="404"
                  size="mini"
                  type="primary"
                >编辑</el-button>
              </router-link>
              <el-button
                v-if="scope.row.status==1"
                v-has="400"
                size="mini"
                type="success"
                @click.stop="changeStates(scope.row.id, 2)"
              >审核</el-button>
              <el-button
                v-if="scope.row.status==2 || scope.row.status==4"
                v-has="400"
                size="mini"
                type="success"
                @click.stop="changeStates(scope.row.id, 3)"
              >上架</el-button>
              <!-- <el-button
                v-if="scope.row.status==2"
                v-has="400"
                size="mini"
                type="success"
                @click.stop="changeStates(scope.row.id, 4)"
              >预售</el-button> -->
              <el-button
                v-if="scope.row.status==3"
                v-has="400"
                size="mini"
                type="danger"
                @click.stop="changeStates(scope.row.id, 2,scope.row.status)"
              >下架</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row.id)"
              >删除</el-button>
              <el-button
                v-if="scope.row.status==2"
                v-has="400"
                size="mini"
                type="danger"
                @click.stop="changeStates(scope.row.id, 1)"
              >取消审核</el-button>
              <!-- <el-button
                v-if="scope.row.status==4"
                v-has="400"
                size="mini"
                type="danger"
                @click.stop="changeStates(scope.row.id, 2)"
              >取消预售</el-button> -->
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-box">
        <div class="batch-edit">
          <el-button type="primary" icon="el-icon-finished" @click="toggleSelection(goodsList)">全部选择</el-button>
          <el-button type="danger" icon="el-icon-circle-close" @click="toggleSelection()">取消</el-button>
          <el-button type="success" icon="el-icon-upload2" @click="batchEdit(2)">上架</el-button>
          <el-button type="warning" icon="el-icon-download" @click="batchEdit(3)">下架</el-button>
        </div>
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
import { getList, deleteGoods, changeStatus } from '@/api/goods'
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'danger',
        2: 'warning',
        3: 'success',
        4: 'warning'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      loading: true,
      keywords: '',
      baseUrl: process.env.VUE_APP_BASE_API,
      pageSize: 10,
      currentPage: 1,
      total: 2,
      goodsList: [],
      statusOption: [{
        value: -1,
        label: '全部'
      }, {
        value: 1,
        label: '待审核'
      }, {
        value: 2,
        label: '待上架'
      }, {
        value: 3,
        label: '已上架'
      }],
      status: '',
      multipleSelection: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    reset() {
      this.name = ''
      this.status = ''
      this.fetchData(0)
    },
    fetchData() {
      getList({
        name: this.keywords,
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        status: this.status
      }).then(res => {
        this.loading = false
        this.goodsList = res.data.data
        this.total = res.data.count
      }).catch(() => {
        this.loading = false
        this.$message({
          type: 'info',
          message: '获取失败！'
        })
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 修改商品状态
    changeStates(id, status, nowStatus) {
      this.$confirm(`${status === 1 ? '是否取消审核？' : nowStatus === 3 && status === 2 ? '是否下架该商品？' : status === 2 ? '审核通过后可以上架' : '是否立即上架？'}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'danger',
        center: true
      }).then(() => {
        changeStatus({
          id: id,
          status: status
        }).then(res => {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          this.fetchData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '修改失败！'
        })
      })
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
    },
    // 批量选择
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    // 批量修改
    batchEdit(status) {
      if (Array.isArray(this.multipleSelection)) {
        const resultList = this.multipleSelection.filter(item => {
          return item.status === status
        })
        const resultIdList = resultList.map(item => item.id)
        if (!resultIdList.length) {
          this.toggleSelection()
          this.$message({
            type: 'warning',
            message: `没有选中任何${status === 2 ? '待上架' : '已上架'}商品`
          })
          return
        }
        const unSelectList = this.multipleSelection.filter(item => {
          return item.status !== status
        })
        this.toggleSelection(unSelectList)
        this.$confirm(`是否${status === 2 ? '上架' : '下架'}选中的商品!`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: 'danger',
          center: true
        }).then(() => {
          changeStatus({
            id: resultIdList,
            status: status === 2 ? 3 : 2
          }).then(res => {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.fetchData()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '修改失败！'
          })
        })
      } else {
        return
      }
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
  .current-price{
    color: #fa3b3b;
    font-size: 16px;
  }
  .old-price{
    color: #999;
    text-decoration: line-through;
    font-size: 12px;
  }
  .operate-btn{
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    button{
      margin-bottom: 5px;
      margin: 4px;
    }
  }
  .goods_img{
    width: 60px;
    height: 60px;
  }
  .batch-edit {
    float: left;
  }
}

</style>
