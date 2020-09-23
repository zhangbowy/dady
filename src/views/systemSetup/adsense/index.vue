<template>
  <div class="ad-list main-content">
    <div class="screen-box">
      <div class="screen-item">
        <!-- <el-input
          v-model="keywords"
          size="small"
          :placeholder="$t('请输入名称')"
          clearable
          style="width:220px"
          @keyup.enter.native="fetchData"
        /> -->
        <!-- <el-button size="small" icon="el-icon-search" type="primary" @click.native="fetchData">{{ $t('搜索') }}</el-button> -->
      </div>
      <div class="operation">
        <el-button v-has="804" size="small" icon="el-icon-plus" type="primary" @click="showDialog('add')">{{ $t('新增') }}</el-button>
      </div>
    </div>
    <div class="content">
      <el-table
        v-loading="loading"
        :data="adList"
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
          :label="$t('广告位图片')"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <img :src="scope.row.image_path" alt="" width="60" height="60">
          </template>
        </el-table-column>
        <el-table-column
          prop="slider_name"
          :label="$t('名称')"
          align="center"
        />
        <!-- <el-table-column
          :label="$t('广告位状态')"
          align="center"
          width="250"
        >
          <template slot-scope="scope">
            <el-tag :type="scope.row.del | statusFilter">{{ scope.row.del==0?'已打烊':'营业中' }}</el-tag>
          </template>
        </el-table-column> -->
        <el-table-column
          prop="created_at"
          :label="$t('创建时间')"
          align="center"
        />
        <el-table-column
          fixed="right"
          :label="$t('操作')"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click.native="showDialog('detail', scope.row)"
            >{{ $t('查看') }}</el-button>
            <el-button
              v-has="806"
              size="mini"
              type="danger"
              style="margin-left: 0"
              @click="handleDelete(scope.row.id)"
            >{{ $t('删除') }}</el-button>
            <el-button
              v-if="scope.$index!==0"
              v-has="806"
              size="mini"
              type="success"
              style="margin-left: 0"
              :loading="btnLoading"
              @click="sortBtn(scope.row.id, 'up')"
            >{{ $t('上移') }}</el-button>
            <el-button
              v-if="scope.$index!==adList.length-1"
              v-has="806"
              size="mini"
              type="success"
              style="margin-left: 0"
              :loading="btnLoading"
              @click="sortBtn(scope.row.id, 'down')"
            >{{ $t('下移') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <!-- <div class="pagination-box">
        <el-pagination
          :total="adList.length"
          :current-page="currentPage"
          :page-sizes="[5, 10, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div> -->
    </div>
    <!-- 广告位新增，详情，编辑弹框 -->
    <el-dialog v-dialogDrag center :title="dialogType=='add'? $t('新增广告位'): dialogType=='edit'? `${$t('编辑广告位')}`: `${$t('广告位详情')}`" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="left" size="small">
        <el-form-item :label="$t('广告位名称')" prop="slider_name">
          <el-input v-model="form.slider_name " :disabled="dialogType=='detail'" />
        </el-form-item>
        <el-form-item :label="$t('广告位图片')" prop="image_path">
          <img-upload
            :img-data="form.image_path"
            :pic-max="1"
            :disabled="dialogType=='detail'"
            @chooseImg="imageChoose"
          />
        </el-form-item>
        <el-form-item :label="$t('排序')">
          <el-input v-model="form.sort " :disabled="dialogType=='detail'" />
        </el-form-item>
        <el-form-item :label="$t('链接')">
          <el-input v-model="form.link " :disabled="dialogType=='detail'" />
        </el-form-item>
        <el-form-item>
          <el-button v-if="dialogType!=='detail'" v-has="804" type="primary" @click="onSubmit('form')">{{ $t('保存') }}</el-button>
          <el-button v-else v-has="805" type="primary" @click="dialogType='edit'">{{ $t('编辑') }}</el-button>
          <el-button @click="dialogFormVisible = false">{{ $t('取消') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { adsense } from '@/api/system'
import ImgUpload from '@/components/ImgUpload'
export default {
  components: {
    ImgUpload
  },
  data() {
    return {
      loading: true,
      baseUrl: process.env.VUE_APP_BASE_API,
      adList: [],
      dialogFormVisible: false,
      form: {
        slider_name: '',
        image_path: '',
        sort: '',
        link: ''
      },
      btnLoading: false,
      rules: {
        slider_name: [
          { required: true, message: `${this.$t('请输入广告位名称')}`, trigger: 'blur' }
        ],
        image_path: [
          { required: true, message: `${this.$t('请上传广告位图片')}`, trigger: 'blur' }
        ]
      },
      dialogType: 'add'
    }
  },
  watch: {
    dialogFormVisible(val) {
      if (val === false) {
        this.$refs['form'].resetFields()
        this.form = {
          slider_name: '',
          image_path: '',
          sort: '',
          link: ''
        }
      }
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      // 获取广告位列表
      adsense.getAdsenseList().then(res => {
        this.loading = false
        this.adList = res.data
      }).catch(() => {
        this.loading = false
      })
    },
    showDialog(type, form) {
      this.dialogType = type
      this.dialogFormVisible = true
      if (form && form.id) {
        // 请求分类详情
        this.form.id = form.id
        this.form.slider_name = form.slider_name
        this.form.image_path = form.image_path
        this.form.link = form.link
        this.form.sort = form.sort
      }
    },
    sortBtn(id, type) {
      this.btnLoading = true
      adsense.sortSlider({
        id: id,
        sort: type
      }).then(res => {
        this.$message({
          type: 'success',
          message: this.$t(...res.msg) || `${this.$t('修改成功')}!`
        })
        setTimeout(() => {
          this.fetchData()
          this.btnLoading = false
        }, 500)
      }).catch(() => {
        this.btnLoading = false
        this.$message({
          type: 'info',
          message: `${this.$t('修改失败')}!`
        })
      })
    },
    onSubmit(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          if (_this.form.id) {
            adsense.editAdsense(_this.form).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: this.$t(...res.msg) || `${this.$t('修改成功')}!`
                })
                // 重置表单
                _this.$refs[formName].resetFields()
                this.dialogFormVisible = false
                this.fetchData()
              } else {
                this.$message({
                  type: 'info',
                  message: this.$t(...res.msg) || `${this.$t('修改失败')}!`
                })
              }
            })
          } else {
            adsense.addAdsense(_this.form).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: this.$t(...res.msg) || `${this.$t('添加成功')}!`
                })
                // 重置表单
                _this.$refs[formName].resetFields()
                this.dialogFormVisible = false
                this.fetchData()
              } else {
                this.$message.success(this.$t(...res.msg) || `${this.$t('添加失败')}!`)
              }
            })
          }
        } else {
          return false
        }
      })
    },
    // 图片上传模块
    imageChoose(imgArray) {
      this.form.image_path = imgArray
      this.$refs.form.validateField('images')
      // this.imageModalConfig.visible = false;
    },
    handleDelete(id) {
      this.$confirm(`${this.$t('是否删除该广告位')}?`, `${this.$t('提示')}`, {
        confirmButtonText: `${this.$t('确定')}`,
        cancelButtonText: `${this.$t('取消')}`,
        type: 'warning',
        confirmButtonClass: 'danger'
      }).then(() => {
        adsense.deleteAdsense({ id: id }).then(res => {
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
    }
  }
}
</script>

<style lang="scss" scoped>
.ad-list{
  .screen-box{
    .screen-item{
      text-align: left;
    }
  }
  .operation{
    position: relative;
    top: 0;
    right: 0;
  }
}
</style>
