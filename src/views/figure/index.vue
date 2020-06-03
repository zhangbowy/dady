<template>
  <div class="figure-list main-content">
    <div class="screen-box">
      <div class="screen-item">
        <el-input
          v-model.trim="keywords"
          size="small"
          placeholder="请输入花样名称"
          clearable
          style="width:220px"
        />
        <el-select v-model="designer_team_id" size="small" clearable placeholder="请选择设计师团队">
          <el-option
            v-for="item in teamOptions"
            :key="item.designer_team_id"
            :label="item.designer_team_name"
            :value="item.designer_team_id"
          />
        </el-select>
        <el-button size="small" icon="el-icon-search" type="primary" @click="doSearch()">搜索</el-button>
      </div>

    </div>
    <div class="content">
      <el-tabs v-model="activeName" v-loading="loading" type="card" @tab-click="handleClick">
        <el-tab-pane
          v-for="(item, index) in figureCount"
          :key="index"
          :label="`${item._status}(${item.count})`"
          :name="`${item.status}`"
        />
        <div class="tab-content">
          <el-row class="figure-data" type="flex">
            <el-col v-for="item in figureList" :key="item.design_id" class="list-item">
              <el-card :body-style="{ padding: '0px' }" shadow="hover">
                <!-- <img v-lazy="item.prev_png_path" :src="item.prev_png_path" class="image"> -->
                <el-image :key="item.design_id" class="image" :src="item.prev_png_path" lazy />
                <div style="padding: 14px; font-szie: 12px">
                  <span>{{ item.design_name }}</span>
                  <div class="bottom clearfix">
                    <span style="color: #F56C6C">￥{{ item.price.toFixed(2) }}</span>
                  </div>
                  <div class="bottom clearfix">
                    <time class="time">{{ item.created_at }}</time>
                  </div>
                  <div class="bottom clearfix">
                    <!-- <el-button v-if="item.status!=3 && roles===1" type="text" class="button" @click.stop="editItem(item)">修改</el-button>
                    <el-button v-if="item.status!=3 && roles===1" type="text" class="button" @click.stop="bindPrice(item)">标价</el-button> -->
                    <el-button v-if="item.status!=1" :style="{color: item.status===3?'#F56C6C':'#67c23a'}" type="text" class="button" @click.stop="changeStatus(item)">{{ item.status==2?'上架':item.status==3?'下架':'' }}</el-button>
                    <!-- <el-button v-if="item.status!=3" type="text" style="color:#F56C6C" class="button" @click.stop="handleDelete(item.design_id)">删除</el-button> -->
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-tabs>
      <!-- 分页 -->
      <div class="pagination-box">
        <el-pagination
          :total="total"
          :current-page="currentPage"
          :page-sizes="[10, 14,28]"
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
import { figureApi } from '@/api/figure'
import { getTeamList } from '@/api/designer'
export default {
  data() {
    return {
      loading: true,
      keywords: '',
      designer_team_id: '',
      status: 0,
      activeName: '0',
      figureList: [], // 花样列表
      figureCount: [], // tab统计
      teamOptions: [],
      pageSize: 14,
      currentPage: 1,
      total: 0
    }
  },
  watch: {

  },
  created() {
    this.fetchData()
    this.getTeamList()
  },
  methods: {
    fetchData() {
      // 获取花样列表
      figureApi.getList({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        design_name: this.keywords,
        designer_team_id: this.designer_team_id,
        status: this.status
      }).then(res => {
        this.loading = false
        this.total = res.data.count
        this.figureList = res.data.data
      })
      this.getdesignCount()
    },
    // 统计
    getdesignCount() {
      figureApi.designCount({
        design_name: this.keywords,
        designer_team_id: this.designer_team_id
      }).then(res => {
        this.figureCount = res.data
      })
    },
    getTeamList() {
      getTeamList({
        pageSize: 100
      }).then(res => {
        this.teamOptions = res.data.data
      })
    },
    // 点击修改按钮
    editItem(item) {
      this.editForm = item
      this.editDialog = true
    },

    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchData()
    },
    // 选项卡点击
    handleClick(tab, event) {
      this.currentPage = 1
      this.status = tab.name
      this.loading = true
      this.fetchData()
    },
    doSearch() {
      this.currentPage = 1
      this.loading = true
      this.fetchData()
    },
    changeStatus(item) {
      this.$confirm(`是否${item.status === 2 ? '上架' : '下架'}该花样?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'danger'
      }).then(() => {
        figureApi.setStatus({
          design_id: item.design_id,
          status: item.status === 2 ? 3 : 2
        }).then(res => {
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.fetchData()
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.figure-list{
  .screen-box{
    .screen-item{
      text-align: left;
    }
  }
  .content{
    background: #fff;
    padding: 20px;
    .figure-data{
      flex-flow: wrap;
      .list-item{
        width: 12.5%;
        margin-right: 2%;
        margin-bottom: 20px;
        .time {
          font-size: 13px;
          color: #999;
        }

        .bottom {
          margin-top: 13px;
          line-height: 12px;
        }

        .button {
          padding: 0;
        }

        .image {
          width: 100%;
          height: 200px;
          display: block;
        }
      }
      .list-item:nth-child(7n+7) {
        margin-right: 0;
      }
    }
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }

  .clearfix:after {
      clear: both
  }
  .figure-box{
    display: flex;
    flex-flow: wrap;
    align-items: center;
    .figure-item{
      width: 20%;
      margin-bottom: 20px;
    }
  }
}

</style>
