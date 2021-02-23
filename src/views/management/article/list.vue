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
        <el-input
          v-model="authorKeywords"
          size="small"
          placeholder="请输入作者名称"
          clearable
          style="width:220px"
        />
        <el-cascader
          v-model="category_id_list"
          size="small"
          :options="[]"
          :props="optionProps"
          placeholder="请选择商品分类"
          clearable
        />
        <el-button size="small" icon="el-icon-search" type="primary" @click="fetchData">搜索</el-button>
        <el-button size="small" icon="el-icon-refresh-right" @click="reset">重置</el-button>
      </div>
      <div class="operation">
        <router-link :to="'/management/article/edit'">
          <div>
            <el-button size="small" icon="el-icon-plus" type="primary">新增</el-button>
          </div>
        </router-link>
      </div>
    </div>
    <div class="screen-box">
      <el-row :gutter="12">
        <el-col v-for="count in countsList" :key="count.status" :span="6">
          <el-card :shadow=" currentStatus === count.status ? 'always' : 'hover'" :body-style="{cursor: 'pointer', textAlign: 'left'}" @click.native="onCardClick(count)">
            <div class="count">
              {{ `${count._status}: ${count.count}` }}
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="content">
      <el-table
        ref="multipleTable"
        v-loading="loading"
        :data="articleList"
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
          prop="author"
          label="作者"
          align="center"
        />
        <el-table-column
          label="文章封面"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <el-image :key="scope.row.cover_image" class="goods_img" :src="scope.row.cover_image" lazy />
            <!-- <img :src="scope.row.thumb_image_path" alt="" width="60" height="60"> -->
          </template>
        </el-table-column>
        <el-table-column
          label="文章标题"
        >
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              :content="scope.row.title"
            >
              <p slot="reference" class="text-wrapper">{{ scope.row.title }}</p>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          label="seo标题"
          align="center"
        >
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              :content="scope.row.seo_title"
            >
              <p slot="reference" class="text-wrapper">{{ scope.row.seo_title }}</p>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          label="seo描述"
          align="center"
        >
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              :content="scope.row.seo_desc"
            >
              <p slot="reference" class="text-wrapper">{{ scope.row.seo_desc }}</p>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          label="seo关键字"
          align="center"
        >
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              :content="scope.row.seo_keywords"
            >
              <p slot="reference" class="text-wrapper">{{ scope.row.seo_keywords }}</p>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="pv"
          label="浏览量"
          align="center"
          sortable
        />
        <el-table-column
          label="状态"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | statusFilter">{{ statusOption[scope.row.status].label || '草稿' }}</el-tag>
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
              <a v-if="scope.row.status === 2" :href="scope.row.full_path">
                <el-button
                  size="mini"
                >查看</el-button>
              </a>
              <router-link v-if="scope.row.status!==3" :to="`/management/article/edit?id=${scope.row.article_id}`">
                <el-button
                  size="mini"
                  type="primary"
                >编辑</el-button>
              </router-link>
              <el-button
                v-if="scope.row.status==1"
                size="mini"
                type="success"
                @click.stop="publishArticle(scope.row.article_id, 2)"
              >发布</el-button>
              <el-button
                v-if="scope.row.status==2"
                size="mini"
                type="success"
                @click.stop="publishArticle(scope.row.article_id, 1)"
              >撤销发布</el-button>
              <el-button
                v-if="scope.row.status==2"
                size="mini"
                type="success"
                @click.stop="setIndexed(scope.row.article_id)"
              >收录</el-button>
              <el-button
                v-if="scope.row.status!==3"
                size="mini"
                type="danger"
                @click="publishArticle(scope.row.article_id, 3)"
              >删除</el-button>
              <el-button
                v-if="scope.row.status===3"
                size="mini"
                type="warning"
                @click="publishArticle(scope.row.article_id, 1)"
              >恢复</el-button>
              <el-button
                v-if="scope.row.status===3"
                size="mini"
                type="info"
                @click="handleDelete(scope.row.article_id)"
              >彻底删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-box">
        <div class="batch-edit">
          <el-button type="primary" icon="el-icon-finished" @click="toggleSelection(articleList)">全部选择</el-button>
          <el-button type="danger" icon="el-icon-circle-close" @click="toggleSelection()">取消</el-button>
          <el-button type="success" icon="el-icon-upload2" @click="batchSetIndexed()">全部收录</el-button>
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
import { articleApi } from '@/api/management'

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
      authorKeywords: '',
      baseUrl: process.env.VUE_APP_BASE_API,
      pageSize: 10,
      currentPage: 1,
      total: 2,
      articleList: [],
      countsList: [],
      currentStatus: 0,
      category_id_list: '',
      categoryList: [],
      statusOption: [{
        value: -1,
        label: '全部'
      }, {
        value: 1,
        label: '草稿'
      }, {
        value: 2,
        label: '发布'
      }, {
        value: 3,
        label: '废纸篓'
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
    batchSetIndexed() {
      if (Array.isArray(this.multipleSelection) && this.multipleSelection.length) {
        const idList = this.multipleSelection.map(item => item.category_id).join(',')
        this.setIndexed(idList)
      } else {
        this.$message({
          type: 'info',
          message: '请选择文章'
        })
      }
    },
    setIndexed(id) {
      this.$confirm('是否收录该文章?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'danger',
        center: true
      }).then(() => {
        articleApi.setIndexed({
          article_id: id
        }).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.fetchData()
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    publishArticle(id, status) {
      this.$confirm(`是否${status === 1 ? '撤销发布' : status === 3 ? '删除' : '发布'}该文章?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'danger',
        center: true
      }).then(() => {
        articleApi.publishArticle({
          article_id: id,
          status: status
        }).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: `${status === 1 ? '撤销发布' : status === 3 ? '删除' : '发布'}成功!`
            })
            this.fetchData()
          } else {
            this.$message({
              type: 'error',
              message: `${status === 1 ? '撤销发布' : status === 3 ? '删除' : '发布'}失败!`
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
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
      articleApi.articleList({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        status: this.currentStatus,
        title: this.keywords,
        authorKeywords: this.authorKeywords
      }).then(res => {
        this.loading = false
        this.articleList = res.data.data
        this.countsList = res.data.counts || []
        this.total = res.data.count
      }).catch(() => {
        this.loading = false
        this.$message({
          type: 'info',
          message: '获取失败!'
        })
      })
    },
    getFigureCategory() {
      articleApi.articleList().then(res => {
        this.categoryList = res.data
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleDelete(id) {
      this.$confirm('是否彻底删除该文章?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'danger',
        center: true
      }).then(() => {
        articleApi.delArticle({
          article_id: id
        }).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.fetchData()
          } else {
            this.$message({
              type: 'error',
              message: '删除失败!'
            })
          }
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
  .text-wrapper {
    overflow: hidden;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    cursor: pointer;
  }
}

</style>
