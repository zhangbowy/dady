<template>
  <div class="goods-list main-content">
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
          :label="$t('商品图片')"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <el-image :key="scope.row.thumb_image_path" class="goods_img" :src="scope.row.thumb_image_path" lazy />
            <!-- <img :src="scope.row.thumb_image_path" alt="" width="60" height="60"> -->
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('商品信息')"
        >
          <template slot-scope="scope">
            <p>{{ scope.row.name }}</p>
            <span class="current-price">{{ $t('￥') }}{{ scope.row.current_price }}</span>
            <span class="old-price">{{ $t('￥') }}{{ scope.row.old_price }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="sale_num"
          :label="$t('销量')"
          align="center"
          sortable
        />
        <el-table-column
          prop="pv"
          :label="$t('浏览量')"
          align="center"
          sortable
        />
        <el-table-column
          prop="sum_stock"
          :label="$t('库存')"
          align="center"
          sortable
        />
        <el-table-column
          :label="$t('状态')"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status==1?$t('待审核'):scope.row.status==3? $t('已上架'):$t('待上架') }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="created_at"
          :label="$t('创建时间')"
          align="center"
        />
        <el-table-column
          prop="updated_at"
          :label="$t('最后更新时间')"
          align="center"
        />
        <el-table-column
          fixed="right"
          :label="$t('操作')"
          align="center"
          width="180"
        >
          <template slot-scope="scope">
            <div class="operate-btn">
              <router-link :to="`/commodity/goods/detail?id=${scope.row.id}`">
                <el-button
                  v-has="16"
                  size="mini"
                >{{ $t('查看') }}</el-button>
              </router-link>
              <router-link :to="`/commodity/goods/edit?id=${scope.row.id}`">
                <el-button
                  v-has="404"
                  size="mini"
                  type="primary"
                >{{ $t('编辑') }}</el-button>
              </router-link>
              <el-button
                v-if="scope.row.status==1"
                v-has="400"
                size="mini"
                type="success"
                @click.stop="changeStates(scope.row.id, 2)"
              >{{ $t('审核') }}</el-button>
              <el-button
                v-if="scope.row.status==2 || scope.row.status==4"
                v-has="400"
                size="mini"
                type="success"
                @click.stop="changeStates(scope.row.id, 3)"
              >{{ $t('上架') }}</el-button>
              <!-- <el-button
                v-if="scope.row.status==2"
                v-has="400"
                size="mini"
                type="success"
                @click.stop="changeStates(scope.row.id, 4)"
              >{{ $t('预售') }}</el-button> -->
              <el-button
                v-if="scope.row.status==3"
                v-has="400"
                size="mini"
                type="danger"
                @click.stop="changeStates(scope.row.id, 2,scope.row.status)"
              >{{ $t('下架') }}</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row.id)"
              >{{ $t('删除') }}</el-button>
              <el-button
                v-if="scope.row.status==2"
                v-has="400"
                size="mini"
                type="danger"
                @click.stop="changeStates(scope.row.id, 1)"
              >{{ $t('取消审核') }}</el-button>
              <!-- <el-button
                v-if="scope.row.status==4"
                v-has="400"
                size="mini"
                type="danger"
                @click.stop="changeStates(scope.row.id, 2)"
              >{{ $t('取消预售') }}</el-button> -->
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-box">
        <div class="batch-edit">
          <el-button type="primary" icon="el-icon-finished" @click="toggleSelection(goodsList)">{{ $t('全部选择') }}</el-button>
          <el-button type="danger" icon="el-icon-circle-close" @click="toggleSelection()">{{ $t('取消') }}</el-button>
          <el-button v-has="400" type="success" icon="el-icon-upload2" @click="batchEdit(2)">{{ $t('上架') }}</el-button>
          <el-button v-has="400" type="warning" icon="el-icon-download" @click="batchEdit(3)">{{ $t('下架') }}</el-button>
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
import { getList, deleteGoods, changeStatus, Category } from '@/api/goods'

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
      countsList: [],
      currentStatus: 0,
      category_id_list: '',
      categoryList: [],
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
      optionProps: {
        checkStrictly: true,
        expandTrigger: 'hover',
        value: 'id',
        label: 'category_name'
      },
      status: '',
      multipleSelection: []
    }
  },
  computed: {
    category_id() {
      if (!Array.isArray(this.category_id_list)) {
        return ''
      }
      return this.category_id_list[this.category_id_list.length - 1]
    }
  },
  created() {
    this.fetchData()
    this.getFigureCategory()
  },
  methods: {
    onCardClick(count) {
      this.currentStatus = count.status
      this.status = count.status || ''
      this.currentPage = 1
      this.fetchData()
    },
    reset() {
      this.name = ''
      this.status = ''
      this.category_id_list = ''
      this.fetchData(0)
    },
    fetchData() {
      this.currentStatus = this.status || 0
      getList({
        name: this.keywords,
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        status: this.status,
        category_id: this.category_id
      }).then(res => {
        this.loading = false
        this.goodsList = res.data.data
        this.countsList = res.data.counts || []
        this.total = res.data.count
      }).catch(() => {
        this.loading = false
        this.$message({
          type: 'info',
          message: `${this.$t('获取失败')}!`
        })
      })
    },
    getFigureCategory() {
      Category.getList().then(res => {
        this.categoryList = res.data
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 修改商品状态
    changeStates(id, status, nowStatus) {
      this.$confirm(`${status === 1 ? `${this.$t('是否取消审核')}?` : nowStatus === 3 && status === 2 ? `${this.$t('是否下架该商品')}?` : status === 2 ? this.$t('审核通过后可以上架') : `${this.$t('是否立即上架')}?`}`, `${this.$t('提示')}`, {
        confirmButtonText: `${this.$t('确定')}`,
        cancelButtonText: `${this.$t('取消')}`,
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
            message: `${this.$t('修改成功')}!`
          })
          this.fetchData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: `${this.$t('修改失败')}!`
        })
      })
    },
    handleDelete(id) {
      this.$confirm(`${this.$t('是否删除该商品')}?`, `${this.$t('提示')}`, {
        confirmButtonText: `${this.$t('确定')}`,
        cancelButtonText: `${this.$t('取消')}`,
        type: 'warning',
        confirmButtonClass: 'danger',
        center: true
      }).then(() => {
        deleteGoods({
          id: id
        }).then(res => {
          this.$message({
            type: 'success',
            message: `${this.$t('删除成功')}!`
          })
          this.fetchData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: `${this.$t('已取消删除')}`
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
            message: this.$t(`没有选中任何${status === 2 ? '待上架' : '已上架'}商品`)
          })
          return
        }
        const unSelectList = this.multipleSelection.filter(item => {
          return item.status !== status
        })
        this.toggleSelection(unSelectList)
        this.$confirm(`${this.$t(`是否${status === 2 ? '上架' : '下架'}选中的商品`)}!`, `${this.$t('提示')}`, {
          confirmButtonText: `${this.$t('确定')}`,
          cancelButtonText: `${this.$t('取消')}`,
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
              message: `${this.$t('修改成功')}!`
            })
            this.fetchData()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: `${this.$t('修改失败')}!`
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
  .screen-box:not(:first-child) {
    margin-top: 10px;
  }
  .count {
    font-weight: 500;
    color: #606266;
  }
}

</style>
