<template>
  <div class="shops-list main-content">
    <div class="screen-box">
      <div class="screen-item">
        <el-input
          v-model="keywords"
          size="small"
          placeholder="请输入管理员名称"
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
        :data="adminList"
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
          label="管理员信息"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.name }}/{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="role_name"
          label="管理员角色"
          align="center"
        />
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
    <el-dialog center :title="dialogType=='add'? '新增管理员': dialogType=='edit'? '编辑管理员': '管理员详情'" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="left" size="small">
        <el-form-item label="管理员名称" prop="name">
          <el-input v-model="form.name " :disabled="dialogType=='detail'" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone " :disabled="dialogType=='detail'" />
        </el-form-item>
        <el-form-item v-if="dialogType!=='detail'" label="密码" prop="password">
          <el-input v-model="form.password " :disabled="dialogType=='detail'" />
        </el-form-item>
        <el-form-item label="管理员角色" prop="role">
          <el-select v-model="form.role" placeholder="请选择" style="width: 100%" :disabled="dialogType=='detail'">
            <el-option
              v-for="item in roleList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-if="dialogType!=='detail'" type="primary" @click="onSubmit('form')">保存</el-button>
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
export default {
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
      if (this.dialogType === 'add' && this.form.password === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      load: true,
      keywords: '',
      baseUrl: process.env.VUE_APP_BASE_API,
      adminList: [{
        id: 1,
        name: 'admin',
        phone: '18895364554',
        role_name: '超级管理员',
        created_at: '2020-4-16 10:51:33',
        role: '1'
      }],
      multipleSelection: [],
      dialogFormVisible: false,
      form: {
        shop_name: '',
        name: '',
        phone: '',
        password: '',
        system_end_time: '',
        logo: ''
      },
      pageSize: 5,
      currentPage: 1,
      total: 0,
      imageUrl: '',
      fileList: [],
      roleList: [
        {
          value: '1',
          label: '超级管理员'
        }, {
          value: '2',
          label: '仓库管理员'
        }, {
          value: '3',
          label: '产品管理员'
        }, {
          value: '4',
          label: '订单管理员'
        }
      ],
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
        this.$refs['form'].resetFields()
        this.fileList = []
        this.imageUrl = ''
      }
    }
  },
  mounted() {
    // this.fetchData()
  },
  methods: {
    fetchData() {
      // 获取店铺列表
      getList({
        shop_name: this.keywords,
        pageSize: this.pageSize,
        currentPage: this.currentPage
      }).then(res => {
        this.shopsList = res.data.data
        this.total = res.data.count
      })
    },
    showDialog(type, form) {
      this.dialogType = type
      this.dialogFormVisible = true
      if (form && form.id) {
        // 请求分类详情
        this.form.id = form.id
        this.form.shop_name = form.shop_name
        this.form.name = form.name
        this.form.role = form.role
        this.form.created_at = form.created_at
        this.form.phone = form.phone
      }
    },
    onSubmit(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          if (_this.form.shop_id) {
            if (this.form.password === '') {
              delete this.form.password
            }
            editShop(_this.form).then(res => {
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
            addShop(_this.form).then(res => {
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
      this.form.logo = res.data.url
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
