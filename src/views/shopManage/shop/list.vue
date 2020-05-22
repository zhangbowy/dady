<template>
  <div class="shops-list main-content">
    <div class="screen-box">
      <div class="screen-item">
        <el-input
          v-model="keywords"
          size="small"
          placeholder="请输入店铺名称"
          clearable
          style="width:220px"
          @keyup.enter.native="fetchData"
        />
        <el-button size="small" icon="el-icon-search" type="primary" @click.native="fetchData">搜索</el-button>
      </div>
      <div class="operation">
        <el-button size="small" icon="el-icon-plus" type="primary" @click="showDialog('add')">新增</el-button>
      </div>
    </div>
    <div class="content">
      <el-table
        v-loading="loading"
        :data="shopsList"
        style="width: 100%"
        fit
        highlight-current-row
        tooltip-effect="dark"
      >
        <el-table-column
          label="序号"
          align="center"
          width="100"
          type="index"
        />
        <el-table-column
          label="店铺logo"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <img :src="scope.row.logo" alt="" width="60" height="60">
          </template>
        </el-table-column>
        <el-table-column
          prop="shop_name"
          label="店铺名称"
          align="center"
        />
        <el-table-column
          label="管理员"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.admin.name }}/{{ scope.row.admin.phone }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          label="店铺状态"
          align="center"
          width="250"
        >
          <template slot-scope="scope">
            <el-tag :type="scope.row.del | statusFilter">{{ scope.row.del==0?'已打烊':'营业中' }}</el-tag>
          </template>
        </el-table-column> -->
        <el-table-column
          prop="created_at"
          label="创建时间"
          align="center"
        />
        <el-table-column
          prop="system_end_time"
          label="到期时间"
          align="center"
        />
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click.native="showDialog('detail', scope.row)"
            >查看</el-button>
            <!-- <el-button
              size="mini"
              @click.native="showDialog('edit', scope.row)"
            >编辑</el-button> -->
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.shop_id)"
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
    <!-- 店铺新增，详情，编辑弹框 -->
    <el-dialog center :title="dialogType=='add'? '新增店铺': dialogType=='edit'? '编辑店铺': '店铺详情'" :visible.sync="dialogFormVisible">
      <el-form ref="shopForm" :model="shopForm" :rules="rules" label-width="100px" label-position="left" size="small">
        <el-form-item label="店铺名称" prop="shop_name">
          <el-input v-model="shopForm.shop_name " :disabled="dialogType=='detail'" />
        </el-form-item>
        <el-form-item label="管理员名称" prop="name">
          <el-input v-model="shopForm.name " :disabled="dialogType=='detail'" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="shopForm.phone " :disabled="dialogType=='detail'" />
        </el-form-item>
        <el-form-item v-if="dialogType!=='detail'" label="密码" prop="password">
          <el-input v-model="shopForm.password " :disabled="dialogType=='detail'" />
        </el-form-item>
        <el-form-item label="店铺logo" prop="logo">
          <img-upload
            :disabled="dialogType=='detail'"
            :img-data="shopForm.logo"
            :pic-max="1"
            @chooseImg="imageChoose"
          />
        </el-form-item>
        <el-form-item label="到期时间" prop="system_end_time">
          <el-date-picker
            v-model="shopForm.system_end_time"
            type="date"
            format="yyyy-MM-dd"
            :disabled="dialogType=='detail'"
            placeholder="选择店铺到期时间"
          />
        </el-form-item>
        <el-form-item>
          <el-button v-if="dialogType!=='detail'" type="primary" @click="onSubmit('shopForm')">保存</el-button>
          <el-button v-else type="primary" @click="dialogType='edit'">编辑</el-button>
          <el-button @click="dialogFormVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getList, delShop, addShop, editShop } from '@/api/shop'
import { validPhone } from '@/utils/validate'
import ImgUpload from '@/components/ImgUpload'
export default {
  components: {
    ImgUpload
  },
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
    const validatePhone = (rule, value, callback) => {
      if (!validPhone(value)) {
        callback(new Error('手机号不正确'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (this.dialogType === 'add' && this.shopForm.password === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      loading: true,
      keywords: '',
      baseUrl: process.env.VUE_APP_BASE_API,
      shopsList: [],
      multipleSelection: [],
      dialogFormVisible: false,
      shopForm: {
        shop_name: '',
        name: '',
        phone: '',
        password: '',
        system_end_time: '',
        logo: ''
      },
      pageSize: 10,
      currentPage: 1,
      total: 0,
      imageUrl: '',
      fileList: [],
      rules: {
        shop_name: [
          { required: true, message: '请填写店铺名称', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请填写管理员姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, trigger: 'blur', validator: validatePhone }
        ],
        password: [
          { trigger: 'blur', validator: validatePassword }
        ],
        system_end_time: [
          { required: true, message: '请输入选择店铺到期时间', trigger: 'blur' }
        ],
        logo: [
          { required: true, message: '请上传店铺logo', trigger: 'blur' }
        ]
      },
      dialogType: 'add'
    }
  },
  watch: {
    dialogFormVisible(val) {
      if (val === false) {
        console.log(1)
        this.$refs['shopForm'].resetFields()
        this.fileList = []
        this.imageUrl = ''
      }
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      // 获取店铺列表
      getList({
        shop_name: this.keywords,
        pageSize: this.pageSize,
        currentPage: this.currentPage
      }).then(res => {
        this.loading = false
        this.shopsList = res.data.data
        this.total = res.data.count
      }).catch(() => {
        this.loading = false
      })
    },
    showDialog(type, form) {
      this.dialogType = type
      this.dialogFormVisible = true
      if (form && form.shop_id) {
        // 请求分类详情
        this.shopForm.shop_id = form.shop_id
        this.shopForm.shop_name = form.shop_name
        this.shopForm.name = form.admin.name
        this.shopForm.phone = form.admin.phone
        this.shopForm.system_end_time = form.system_end_time
        this.shopForm.logo = form.logo
        this.imageUrl = this.baseUrl + '/' + form.logo
        this.fileList.push({
          url: this.baseUrl + '/' + form.logo
        })
      }
    },
    // 图片上传模块
    imageChoose(imgArray) {
      this.shopForm.logo = imgArray
      this.$refs.shopForm.validateField('logo')
      // this.imageModalConfig.visible = false;
    },
    onSubmit(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          if (_this.shopForm.shop_id) {
            if (this.shopForm.password === '') {
              delete this.shopForm.password
            }
            editShop(_this.shopForm).then(res => {
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
            addShop(_this.shopForm).then(res => {
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
            })
          }
        } else {
          return false
        }
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
    handleDelete(id) {
      this.$confirm('是否删除该店铺?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'danger'
      }).then(() => {
        delShop({ shop_id: id }).then(res => {
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
    handleAvatarSuccess(res, file) {
      console.log(res)
      this.imageUrl = URL.createObjectURL(file.raw)
      this.shopForm.logo = res.data.url
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('店铺logo只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('店铺logo大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style lang="scss" scoped>
.shops-list{
  .screen-box{
    .screen-item{
      text-align: left;
    }
  }
}
</style>

<style lang="scss">
  .logo-uploader{
    .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .el-upload:hover {
      border-color: #409EFF;
    }
    .logo-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 150px;
      height: 150px;
      line-height: 150px;
      text-align: center;
    }
    .logo {
      width: 150px;
      height: 150px;
      display: block;
    }
  }
</style>
