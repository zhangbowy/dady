<template>
  <div class="goods-category main-content">
    <div class="screen-box">
      <el-button v-has="401" size="small" icon="el-icon-plus" type="primary" @click="showDialog('add')">{{ $t('新增') }}</el-button>
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
          prop="category_name"
          :label="$t('分类名称')"
          align="center"
          width="200"
        />
        <el-table-column
          label="logo"
          align="center"
        >
          <template slot-scope="scope">
            <img :src="scope.row.logo" alt="" width="20" height="20">
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('广告图')"
          align="center"
        >
          <template slot-scope="scope">
            <img :src="scope.row.image_path" alt="" width="40" height="20">
          </template>
        </el-table-column>
        <el-table-column
          prop="created_at"
          :label="$t('创建时间')"
          align="center"
          width="200"
        />
        <el-table-column
          prop="updated_at"
          :label="$t('最后更新时间')"
          align="center"
          width="200"
        />
        <el-table-column
          fixed="right"
          :label="$t('操作')"
          align="center"
          width="250"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="showDialog('detail', scope.row)"
            >{{ $t('查看') }}</el-button>
            <el-button
              v-has="403"
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.id)"
            >{{ $t('删除') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增，详情，编辑弹框 -->
    <el-dialog v-dialogDrag center :title="dialogType=='add'? $t('新增分类'): dialogType=='edit'? `${$t('编辑分类')}`: `${$t('分类详情')}`" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item :label="$t('分类名称')" :label-width="formLabelWidth" prop="category_name">
          <el-input v-model="form.category_name" autocomplete="off" :disabled="dialogType=='detail'" />
        </el-form-item>
        <el-form-item v-if="dialogType=='add'" :label="$t('上级分类')" :label-width="formLabelWidth">
          <el-cascader
            v-model="parent_id"
            :options="categories"
            :props="optionProps"
            clearable
            :disabled="dialogType=='detail'"
          />
          <span style="color: #F56C6C">tip：{{ $t('顶级分类无需选择') }}</span>
        </el-form-item>
        <el-form-item label="logo" :label-width="formLabelWidth" prop="logo">
          <img-upload
            :img-data="form.logo"
            :pic-max="1"
            :disabled="dialogType=='detail'"
            @chooseImg="logoChoose"
          />
        </el-form-item>
        <el-form-item :label="$t('分类广告图')" :label-width="formLabelWidth" prop="image_path">
          <img-upload
            :img-data="form.image_path"
            :pic-max="1"
            :disabled="dialogType=='detail'"
            @chooseImg="imageChoose"
          />
        </el-form-item>
        <el-form-item :label="$t('跳转链接')" :label-width="formLabelWidth">
          <el-input v-model="form.link" :disabled="dialogType=='detail'" />
        </el-form-item>
        <!-- <el-form-item :label="$t('设备码')" :label-width="formLabelWidth">
          <el-select v-model="form.code" :placeholder="$t('请选择绑定设备')" style="width: 100%">
            <el-option :label="$t('帽子刺绣机')" value="121312" />
            <el-option :label="$t('衣服刺绣机')" value="221312" />
          </el-select>
        </el-form-item> -->
        <el-form-item :label-width="formLabelWidth">
          <el-button v-if="dialogType!=='detail'" type="primary" @click="onSubmit('form')">{{ $t('保存') }}</el-button>
          <el-button v-else v-has="402" type="primary" @click="dialogType='edit'">{{ $t('编辑') }}</el-button>
          <el-button @click="dialogFormVisible = false">{{ $t('取消') }}</el-button></el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { Category } from '@/api/goods'
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
        label: 'category_name'
      },
      categories: [],
      dialogFormVisible: false,
      parent_id: [],
      form: {
        category_name: '',
        parent_id: '',
        link: '',
        logo: '',
        image_path: ''
      },
      rules: {
        category_name: [
          { required: true, message: `${this.$t('请填写分类名称')}`, trigger: 'blur' },
          { min: 1, max: 5, message: `${this.$t('长度在 {0} 到 {1} 个字符', [1, 5])}`, trigger: 'blur' }
        ],
        logo: [
          { required: true, message: `${this.$t('请上传分类')} logo`, trigger: 'blur' }
        ],
        image_path: [
          { required: true, message: `${this.$t('请上传广告图')}`, trigger: 'blur' }
        ]
      },
      formLabelWidth: '120px',
      dialogType: 'add'
    }
  },
  watch: {
    dialogFormVisible(val) {
      if (val === false) {
        this.$refs['form'].resetFields()
        this.form = {
          category_name: '',
          parent_id: '',
          link: '',
          logo: '',
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
      Category.getList().then(res => {
        this.loading = false
        this.categories = res.data
      }).catch(() => {
        this.loading = false
        this.$message({
          type: 'info',
          message: `${this.$t('网络异常')}!`
        })
      })
    },
    showDialog(type, form) {
      this.dialogType = type
      this.dialogFormVisible = true
      if (form && form.id) {
        // 请求分类详情
        this.form.id = form.id
        this.form.category_name = form.category_name
        this.form.logo = form.logo
        this.form.link = form.link
        this.form.parent_id = form.parent_id
        this.form.image_path = form.image_path
      }
    },
    onSubmit(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          if (_this.form.id) {
            // 编辑的话不传parent_id
            delete _this.form.parent_id
            Category.editCategory(_this.form).then(res => {
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
                this.$message.success(this.$t(...res.msg) || `${this.$t('修改失败')}!`)
              }
            })
          } else {
            _this.form.parent_id = _this.parent_id.length > 0 ? _this.parent_id[_this.parent_id.length - 1] : 0
            Category.addCategory(_this.form).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: this.$t(...res.msg) || `${this.$t('添加成功')}!`
                })
                // 重置表单
                _this.$refs[formName].resetFields()
                _this.parent_id = []
                this.dialogFormVisible = false
                this.fetchData()
              } else {
                this.$message.success(this.$t(...res.msg) || `${this.$t('添加失败')}!`)
              }
            }).catch(() => {
            })
          }
        } else {
          return false
        }
      })
    },
    handleDelete(id) {
      this.$confirm(`${this.$t('是否删除该分类')}?`, `${this.$t('提示')}`, {
        confirmButtonText: `${this.$t('确定')}`,
        cancelButtonText: `${this.$t('取消')}`,
        type: 'warning',
        confirmButtonClass: 'danger',
        center: true
      }).then(() => {
        Category.deleteCategory({ id: id }).then(res => {
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
    // 图片上传模块
    logoChoose(path) {
      this.form.logo = path
      this.$refs.form.validateField('logo')
    },
    imageChoose(path) {
      this.form.image_path = path
      this.$refs.form.validateField('image_path')
      // this.imageModalConfig.visible = false;
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
