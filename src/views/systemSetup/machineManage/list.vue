<template>
  <div class="machine-list main-content">
    <div class="screen-box">
      <div class="screen-item">
        <el-input
          v-model="keywords"
          size="small"
          :placeholder="$t('请输入机器名称')"
          clearable
          style="width:220px"
          @keyup.enter.native="fetchData"
        />
        <el-button size="small" icon="el-icon-search" type="primary" @click.native="fetchData">{{ $t('搜索') }}</el-button>
      </div>
      <div class="operation">
        <el-button v-has="801" size="small" icon="el-icon-plus" type="primary" @click="showDialog('add')">{{ $t('新增') }}</el-button>
      </div>
    </div>
    <div class="content">
      <el-table
        v-loading="loading"
        :data="machinesList"
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
          prop="machine_code"
          :label="$t('机器码')"
          align="center"
        />
        <el-table-column
          prop="machine_name"
          :label="$t('机器名称')"
          align="center"
        />
        <el-table-column
          prop="desc"
          :label="$t('机器描述')"
          align="center"
        />
        <el-table-column
          prop="custom_category_name"
          :label="$t('所属定制分类')"
          align="center"
        />
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
              v-has="803"
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.machine_id)"
            >{{ $t('删除') }}</el-button>
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
    <!-- 机器新增，详情，编辑弹框 -->
    <el-dialog v-dialogDrag center :title="dialogType=='add'? $t('新增机器'): dialogType=='edit'? `${$t('编辑机器')}`: `${$t('机器详情')}`" :visible.sync="dialogFormVisible">
      <el-form ref="machineForm" :model="machineForm" :rules="rules" label-width="100px" label-position="left" size="small">
        <el-form-item :label="$t('机器名称')" prop="machine_name">
          <el-input v-model="machineForm.machine_name " :disabled="dialogType=='detail'" />
        </el-form-item>
        <el-form-item :label="$t('机器码')" prop="machine_code">
          <el-input v-model="machineForm.machine_code " :disabled="dialogType=='detail'" />
        </el-form-item>
        <el-form-item :label="$t('机器描述')" prop="desc">
          <el-input
            v-model="machineForm.desc"
            :disabled="dialogType=='detail'"
            type="textarea"
            :rows="2"
            :placeholder="$t('请输入机器描述')"
          />
        </el-form-item>
        <el-form-item>
          <el-button v-if="dialogType!=='detail'" v-has="801" type="primary" @click="onSubmit('machineForm')">{{ $t('保存') }}</el-button>
          <el-button v-else v-has="802" type="primary" @click="dialogType='edit'">{{ $t('编辑') }}</el-button>
          <el-button @click="dialogFormVisible = false">{{ $t('取消') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { machineApi } from '@/api/system'
export default {
  data() {
    return {
      loading: true,
      keywords: '',
      toatl: 0,
      machinesList: [],
      dialogFormVisible: false,
      machineForm: {
        machine_name: '',
        machine_code: '',
        desc: ''
      },
      rules: {
        machine_name: [
          { required: true, message: `${this.$t('请填写机器名称')}`, trigger: 'blur' }
        ],
        machine_code: [
          { required: true, message: `${this.$t('请填写机器码')}`, trigger: 'blur' }
        ],
        desc: [
          { required: true, message: `${this.$t('请输入机器描述')}`, trigger: 'blur' }
        ]
      },
      dialogType: 'add'
    }
  },
  watch: {
    dialogFormVisible(val) {
      if (val === false) {
        this.$refs['machineForm'].resetFields()
        this.machineForm = {
          machine_name: '',
          machine_code: '',
          desc: ''
        }
      }
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      // 获取机器列表
      machineApi.getMachine({ name: this.keywords }).then(res => {
        this.loading = false
        this.machinesList = res.data.data
      }).catch(() => {
        this.loading = false
      })
    },
    showDialog(type, form) {
      this.dialogType = type
      this.dialogFormVisible = true
      if (form && form.machine_id) {
        // 请求分类详情
        this.machineForm.machine_id = form.machine_id
        this.machineForm.machine_name = form.machine_name
        this.machineForm.machine_code = form.machine_code
        this.machineForm.desc = form.desc
      }
    },
    onSubmit(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          if (_this.machineForm.machine_id) {
            machineApi.editMachine(_this.machineForm).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: this.$t(res.msg) || `${this.$t('修改成功')}!`
                })
                // 重置表单
                _this.$refs[formName].resetFields()
                this.dialogFormVisible = false
                this.fetchData()
              } else {
                this.$message.success(this.$t(res.msg) || `${this.$t('修改失败')}!`)
              }
            })
          } else {
            machineApi.addMachine(_this.machineForm).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: this.$t(res.msg) || `${this.$t('添加成功')}!`
                })
                // 重置表单
                _this.$refs[formName].resetFields()
                this.dialogFormVisible = false
                this.fetchData()
              } else {
                this.$message.success(this.$t(res.msg) || `${this.$t('添加失败')}!`)
              }
            })
          }
        } else {
          return false
        }
      })
    },
    handleDelete(id) {
      this.$confirm(`${this.$t('是否删除该机器')}?`, `${this.$t('提示')}`, {
        confirmButtonText: `${this.$t('确定')}`,
        cancelButtonText: `${this.$t('取消')}`,
        type: 'warning',
        confirmButtonClass: 'danger'
      }).then(() => {
        machineApi.delMachine({ machine_id: id }).then(res => {
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
.machine-list{
  .screen-box{
    .screen-item{
      text-align: left;
    }
  }
}
</style>
