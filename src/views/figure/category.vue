<template>
  <div class="goods-category main-content">
    <div class="screen-box">
      <el-button v-has="20002" size="small" icon="el-icon-plus" type="primary" @click="showDialog('add')">新增</el-button>
    </div>
    <div class="content">
      <el-table
        v-loading="loading"
        :data="categories"
        style="width: 100%"
        fit
        row-key="id"
        highlight-current-row
        default-expand-all
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column
          prop="design_category_name"
          label="分类名称"
          align="center"
          width="200"
        />
        <el-table-column
          label="分类广告图"
          align="center"
        >
          <template slot-scope="scope">
            <img :src="scope.row.image_path" alt="" width="20" height="20">
          </template>
        </el-table-column>
        <!-- <el-table-column
          label="广告图"
          align="center"
        >
          <template slot-scope="scope">
            <img :src="scope.row.image_path" alt="" width="40" height="20">
          </template>
        </el-table-column> -->
        <el-table-column
          prop="created_at"
          label="创建时间"
          align="center"
          width="200"
        />
        <el-table-column
          prop="updated_at"
          label="最后更新时间"
          align="center"
          width="200"
        />
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          width="250"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="showDialog('detail', scope.row)"
            >查看</el-button>
            <el-button
              v-has="20004"
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.design_category_id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-ctn">
      <el-pagination
        layout="total,  prev, pager, next, jumper"
        :small="true"
        class="pull-left"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        :show-quick-jumper="true"
        @current-change="changeList"
      />
    </div>
    <!-- 新增，详情，编辑弹框 -->
    <el-dialog v-dialogDrag center :title="dialogType=='add'? '新增分类': dialogType=='edit'? '编辑分类': '分类详情'" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="分类名称" :label-width="formLabelWidth" prop="design_category_name">
          <el-input v-model="form.design_category_name" autocomplete="off" :disabled="dialogType=='detail'" />
        </el-form-item>
        <el-form-item label="分类广告图" :label-width="formLabelWidth" prop="image_path">
          <img-upload
            :img-data="form.image_path"
            :pic-max="1"
            :disabled="dialogType=='detail'"
            @chooseImg="imageChoose"
          />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <el-button v-if="dialogType!=='detail'" type="primary" @click="onSubmit('form')">保存</el-button>
          <el-button v-else v-has="402" type="primary" @click="dialogType='edit'">编辑</el-button>
          <el-button @click="dialogFormVisible = false">取消</el-button></el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { figureApi } from '@/api/figure'
import ImgUpload from '@/components/ImgUpload'
export default {
  components: {
    ImgUpload
  },
  data() {
    return {
      loading: true,
      // 分组选择配置项
      optionProps: {
        checkStrictly: true,
        expandTrigger: 'hover',
        value: 'id',
        label: 'design_category_name'
      },
      categories: [],
      dialogFormVisible: false,
      parent_id: [],
      form: {
        design_category_name: '',
        image_path: ''
      },
      rules: {
        design_category_name: [
          { required: true, message: '请填写分类名称', trigger: 'blur' },
          { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }
        ],
        logo: [
          { required: true, message: '请上传分类logo', trigger: 'blur' }
        ]
      },
      total: 0,
      formLabelWidth: '120px',
      dialogType: 'add',
      currentPage: 1,
      pageSize: 12
    }
  },
  watch: {
    dialogFormVisible(val) {
      if (val === false) {
        this.$refs['form'].resetFields()
        this.form = {
          design_category_name: '',
          image_path: ''
        }
      }
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    // 获取所有分类
    fetchData() {
      figureApi.getCategory({
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }).then(res => {
        this.loading = false
        if (res.code === 0 && res.data) {
          this.categories = res.data.data
          this.currentPage = res.data.currentPage
          this.total = res.data.count
        } else {
          this.loading = false
          this.$message({
            type: 'info',
            message: '网络异常！'
          })
        }
      }).catch(() => {
        this.loading = false
        this.$message({
          type: 'info',
          message: '网络异常！'
        })
      })
    },
    showDialog(type, form) {
      this.dialogType = type
      this.dialogFormVisible = true
      if (form && form.design_category_id) {
        // 请求分类详情
        this.form.design_category_id = form.design_category_id
        this.form.design_category_name = form.design_category_name
        this.form.image_path = form.image_path
      }
    },
    onSubmit(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          if (_this.form.design_category_id) {
            figureApi.editCategory(_this.form).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: res.msg || '修改成功!'
                })
                // 重置表单
                _this.$refs[formName].resetFields()
                this.dialogFormVisible = false
                this.fetchData()
              } else {
                this.$message.success(res.msg || '修改失败!')
              }
            })
          } else {
            figureApi.addCategory(_this.form).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: res.msg || '添加成功!'
                })
                // 重置表单
                _this.$refs[formName].resetFields()
                this.dialogFormVisible = false
                this.fetchData()
              } else {
                this.$message.success(res.msg || '添加失败!')
              }
            }).catch(() => {
            })
          }
        } else {
          return false
        }
      })
    },
    handleDelete(design_category_id) {
      this.$confirm('是否删除该分类?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'danger',
        center: true
      }).then(() => {
        figureApi.deleteCategory({ design_category_id }).then(res => {
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
    // 图片上传模块
    imageChoose(path) {
      this.form.image_path = path
      this.$refs.form.validateField('image_path')
    },
    // 点击分页
    changeList(page) {
      this.currentPage = page
      this.fetchData()
    }
  }
}
</script>

<style lang="scss" scoped>
.pull-left {
    padding: 14px;
    float: right;
}
</style>
