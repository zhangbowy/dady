<template>
  <div class="shops-list main-content">
    <div class="screen-box">
      <div class="screen-item">
        <el-input
          v-model="keywords"
          size="small"
          placeholder="请输入设备名称"
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
        :data="machinesList"
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
          label="设备码"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <img :src="`${baseUrl}/`+scope.row.logo" alt="" width="60" height="60">
          </template>
        </el-table-column>
        <el-table-column
          prop="shop_name"
          label="设备名称"
          align="center"
        />
        <!-- <el-table-column
          label="设备状态"
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
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.shop_id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        :hide-on-single-page="true"
        background
        layout="prev, pager, next"
        :total="toatl"
      />
    </div>
    <!-- 设备新增，详情，编辑弹框 -->
    <el-dialog center :title="dialogType=='add'? '新增设备': dialogType=='edit'? '编辑设备': '设备详情'" :visible.sync="dialogFormVisible">
      <el-form ref="machineForm" :model="machineForm" :rules="rules" label-width="100px" label-position="left" size="small">
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="machineForm.name " :disabled="dialogType=='detail'" />
        </el-form-item>
        <el-form-item label="设备码" prop="code">
          <el-input v-model="machineForm.code " :disabled="dialogType=='detail'" />
        </el-form-item>
        <el-form-item label="设备描述">
          <el-input
            v-model="machineForm.desc"
            type="textarea"
            :rows="2"
            placeholder="请输入设备描述"
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
    return {
      keywords: '',
      toatl: 0,
      machinesList: [],
      dialogFormVisible: false,
      machineForm: {
        name: '',
        code: '',
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: '请填写设备名称', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请填写设备码', trigger: 'blur' }
        ]
      },
      dialogType: 'add'
    }
  },
  watch: {
    dialogFormVisible(val) {
      if (val === false) {
        console.log(1)
        this.$refs['machineForm'].resetFields()
      }
    }
  },
  mounted() {
    // this.fetchData()
  },
  methods: {
    fetchData() {
      // 获取设备列表
      getList({ name: this.keywords }).then(res => {
        this.machinesList = res.data.data
      })
    },
    showDialog(type, form) {
      this.dialogType = type
      this.dialogFormVisible = true
      if (form && form.shop_id) {
        // 请求分类详情
        this.machineForm.shop_id = form.shop_id
        this.machineForm.name = form.admin.name
        this.machineForm.phone = form.admin.phone
        this.machineForm.system_end_time = form.system_end_time
        this.machineForm.logo = form.logo
        this.imageUrl = this.baseUrl + '/' + form.logo
        this.fileList.push({
          url: this.baseUrl + '/' + form.logo
        })
      }
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
    handleDelete(id) {
      this.$confirm('是否删除该设备?', '提示', {
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
