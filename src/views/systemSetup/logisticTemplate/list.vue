<template>
  <div class="logistics-template main-content">
    <div class="screen-box">
      <el-button v-has="812" size="small" icon="el-icon-plus" type="primary" @click="toEdit()">新增</el-button>
    </div>
    <div class="content">
      <div v-loading="loading" class="logistic-list">
        <div v-for="item in expressData" :key="item.express_template_id" class="logistic-list-item">
          <div class="item-header">
            <el-row>
              <el-col :span="12">
                <span>{{ item.express_template_name }}</span>
              </el-col>
              <el-col :span="12">
                <div class="right-align">
                  <span>创建时间：{{ item.created_at }}</span>
                  <span>
                    <el-button v-has="26" type="primary" size="mini" @click="toEdit(item.express_template_id)">编辑</el-button>
                    <el-button v-has="814" type="danger" size="mini" @click="deleteItem(item.express_template_id)">删除</el-button>
                  </span>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="item-content">
            <el-table
              :data="item.region_rules"
              style="width: 100%"
            >
              <el-table-column
                prop="city_show"
                label="运送到"
                width="180"
                align="center"
              />
              <el-table-column
                label="配送方式"
                width="180"
                align="center"
              >
                <template>
                  <span>快递</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="first_number"
                :label="`首${item.express_template_type==2?'件':'重'}（${item.express_template_type==2?'件':'Kg'}）`"
                align="center"
              />
              <el-table-column
                prop="first_amount"
                label="运费（元）"
                align="center"
              />
              <el-table-column
                prop="continue_number"
                :label="`续${item.express_template_type==2?'件':'重'}（${item.express_template_type==2?'件':'Kg'}）`"
                align="center"
              />
              <el-table-column
                prop="continue_amount"
                label="运费（元）"
                align="center"
              />
            </el-table>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <el-pagination
          :total="total"
          :current-page="currentPage"
          :page-sizes="[1, 5, 10, 50, 100]"
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
import { expressApi } from '../../../api/system'
export default {
  data() {
    return {
      loading: true,
      total: 0,
      currentPage: 1,
      pageSize: 10,
      expressData: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      expressApi.getExpressList({
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }).then(res => {
        this.loading = false
        this.expressData = res.data.data
        this.total = res.data.count
      }).catch(() => {
        this.loading = false
      })
    },
    toEdit(id) {
      if (id) {
        this.$router.push({
          path: `/system/logisticTempEdit?id=${id}`
        })
      } else {
        this.$router.push({
          path: `/system/logisticTempEdit`
        })
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchData()
    },
    deleteItem(id) {
      this.$confirm('此操作将永久删除该运费模板, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        expressApi.deleteExpress({
          express_template_id: id
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
    }
  }
}
</script>

<style lang="scss" scoped>
.logistics-template{
  .content{
    background: #ffffff;
    .logistic-list{
      padding: 20px;
      .logistic-list-item{
        border-radius: 10px;
        margin-bottom: 20px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.102);
        .item-header{
          padding: 10px;
          background: rgb(68, 68, 68);
          color: #ffffff;
          overflow: hidden;
          font-size: 16px;
          .right-align{
            font-size: 12px;
            text-align: right;
            span{
              display: inline-block;
              vertical-align: middle;
              margin-left: 15px;
            }
          }
        }
      }
    }
  }
}
</style>
