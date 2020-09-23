<template>
  <div class="figure-list main-content">
    <div class="screen-box">
      <div class="screen-item">
        <el-input
          v-model.trim="keywords"
          size="small"
          :placeholder="$t('请输入花样名称')"
          clearable
          style="width:220px"
        />
        <el-select v-model="designer_team_id" size="small" clearable :placeholder="$t('请选择设计师团队')">
          <el-option
            v-for="item in teamOptions"
            :key="item.designer_team_id"
            :label="item.designer_team_name"
            :value="item.designer_team_id"
          />
        </el-select>
        <el-select v-model="design_category_id" size="small" clearable :placeholder="$t('请选择设花样类别')">
          <el-option
            v-for="item in figureCategoryList"
            :key="item.id"
            :label="item.category_name"
            :value="item.id"
          />
        </el-select>
        <el-button size="small" icon="el-icon-search" type="primary" @click="doSearch()">{{ $t('搜索') }}</el-button>
      </div>

    </div>
    <div class="content">
      <el-tabs v-model="activeName" v-loading="loading" type="card" @tab-click="handleClick">
        <el-tab-pane
          v-for="(item, index) in figureCount"
          :key="index"
          :label="`${$t(item._status)}(${item.count})`"
          :name="`${item.status}`"
        />
        <div class="tab-content">
          <el-row class="figure-data" type="flex">
            <el-col v-for="item in figureList" :key="item.design_id" class="list-item">
              <el-card :body-style="{ padding: '0px' }" shadow="hover">
                <!-- <img v-lazy="item.prev_png_path" :src="item.prev_png_path" class="image"> -->
                <el-image :key="item.design_id" class="image" :src="item.prev_png_path" lazy fit="contain" />
                <div style="padding: 14px; font-szie: 12px">
                  <span>{{ item.design_name }}</span>
                  <div class="bottom clearfix">
                    <span style="color: #F56C6C">{{ $t('￥') }}{{ item.price.toFixed(2) }}</span>
                  </div>
                  <div class="bottom clearfix">
                    <time class="time">{{ item.created_at }}</time>
                  </div>
                  <div class="bottom clearfix btn-group">
                    <!-- <el-button v-if="item.status!=3 && roles===1" type="text" class="button" @click.stop="editItem(item)">{{ $t('修改') }}</el-button>
                    <el-button v-if="item.status!=3 && roles===1" type="text" class="button" @click.stop="bindPrice(item)">{{ $t('标价') }}</el-button> -->
                    <el-button v-if="item.status!=1" :style="{color: item.status===3?'#F56C6C':'#67c23a'}" type="text" class="button" @click.stop="changeStatus(item)">{{ item.status==2?$t('上架'):item.status==3?$t('下架'):'' }}</el-button>
                    <!-- <el-button v-if="item.status!=3" type="text" style="color:#F56C6C" class="button" @click.stop="handleDelete(item.design_id)">{{ $t('删除') }}</el-button> -->
                    <el-button v-has="20005" type="text" class="button" @click.stop="setCatetory(item)">{{ $t('设置分类') }}</el-button>
                    <el-button v-has="20006" type="text" class="button" @click.stop="setPresell(item)">{{ item.is_presell ? $t('取消预售') : $t('预售') }}</el-button>
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
          :page-sizes="[10, 14, 28]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <!-- 修改分类 -->
    <el-dialog v-dialogDrag auto width="300px" :title="$t('修改花样分类')" :visible.sync="showCategorySelector">
      <el-form ref="form" :model="form">
        <el-form-item>
          <el-select v-model="form.design_category_id" size="small" clearable :placeholder="$t('请选择花样类别')">
            <el-option
              v-for="item in figureCategoryList"
              :key="item.id"
              :label="item.category_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')">{{ $t('确定') }}</el-button>
          <el-button @click="showCategorySelector = false">{{ $t('取消') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { figureApi } from '@/api/figure'
import { getTeamList } from '@/api/designer'
import { Category } from '@/api/goods'
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
      figureCategoryList: [],
      pageSize: 14,
      currentPage: 1,
      total: 0,
      design_category_id: '',
      showCategorySelector: false,
      form: {
        design_category_id: '',
        design_id: ''
      },
      rules: {
        design_category_id: [
          { required: true, message: `${this.$t('请选择花样分类')}`, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {

  },
  created() {
    this.fetchData()
    this.getTeamList()
    this.getFigureCategory()
  },
  methods: {
    fetchData() {
      // 获取花样列表
      figureApi.getList({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        design_name: this.keywords,
        designer_team_id: this.designer_team_id,
        design_category_id: this.design_category_id,
        status: this.status
      }).then(res => {
        this.loading = false
        this.total = res.data.count
        this.figureList = res.data.data
      })
      this.getdesignCount()
    },
    // 获取花样类型
    getFigureCategory() {
      Category.getList().then(res => {
        this.figureCategoryList = res.data
      })
    },
    // 统计
    getdesignCount() {
      figureApi.designCount({
        design_name: this.keywords,
        design_category_id: this.design_category_id,
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
    onSubmit(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          figureApi.setCategory(_this.form).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: this.$t(...res.msg) || `${this.$t('设置成功')}!`
              })
              // 重置表单
              _this.$refs[formName].resetFields()
              this.showCategorySelector = false
              this.fetchData()
            } else {
              this.$message.success(this.$t(...res.msg) || `${this.$t('设置失败')}!`)
            }
          })
        } else {
          return false
        }
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
    setCatetory(item) {
      const { design_id, design_category_id } = item
      this.form.design_category_id = design_category_id
      this.showCategorySelector = true
      this.form.design_id = design_id
    },
    // 预售
    setPresell(item) {
      this.$confirm(`${this.$t(`是否${!item.is_presell ? '' : `取消`}预售该花样`)}?`, `${this.$t('提示')}`, {
        confirmButtonText: `${this.$t('确定')}`,
        cancelButtonText: `${this.$t('取消')}`,
        type: 'warning',
        confirmButtonClass: 'danger'
      }).then(() => {
        figureApi.setPresell({
          design_id: item.design_id,
          is_presell: !item.is_presell
        }).then(res => {
          this.$message({
            type: 'success',
            message: this.$t(...res.msg)
          })
          this.fetchData()
        })
      }, () => {})
    },
    changeStatus(item) {
      this.$confirm(`${this.$t(`是否${item.status === 2 ? '上架' : '下架'}该花样`)}?`, `${this.$t('提示')}`, {
        confirmButtonText: `${this.$t('确定')}`,
        cancelButtonText: `${this.$t('取消')}`,
        type: 'warning',
        confirmButtonClass: 'danger'
      }).then(() => {
        figureApi.setStatus({
          design_id: item.design_id,
          status: item.status === 2 ? 3 : 2
        }).then(res => {
          this.$message({
            type: 'success',
            message: this.$t(...res.msg)
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
.el-form-item__content {
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .el-button+.el-button {
    margin-left: 0;
  }
}

</style>
