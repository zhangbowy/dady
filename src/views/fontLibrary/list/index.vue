<template>
  <div class="fonts-list main-content">
    <div class="screen-box">
      <div class="operation">
        <el-button v-has="701" size="small" icon="el-icon-upload" type="primary" @click="showDialog('add')">上传</el-button>
      </div>
    </div>
    <div class="content">
      <el-table
        v-loading="loading"
        :data="fontsList"
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
          prop="font_name"
          label="字体名称"
          align="center"
        />
        <el-table-column
          label="样板展示"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <img :src="scope.row.font_content[0]" alt="" width="40" height="40">
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click.native="showDetail(scope.row)"
            >查看</el-button>
            <el-button
              v-has="702"
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.font_id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <!-- <div class="pagination-box">
        <el-pagination
          :total="total"
          :current-page="currentPage"
          :page-sizes="[5, 10, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div> -->
    </div>
    <!-- 新增字体 -->
    <el-dialog center :title="'新增字体'" :visible.sync="dialogFormVisible">
      <el-form ref="fontForm" :model="fontForm" :rules="rules" label-width="80px" label-position="left" size="small">
        <el-form-item label="字体名称" prop="font_name">
          <el-input v-model="fontForm.font_name " :disabled="dialogType=='detail'" />
        </el-form-item>
        <el-form-item label="最小高度" prop="minSize">
          <el-input v-model.number="fontForm.minSize" style="width: 45%" :disabled="dialogType=='detail'" />
        </el-form-item>
        <el-form-item label="最大高度" prop="maxSize">
          <el-input v-model.number="fontForm.maxSize" style="width: 45%" :disabled="dialogType=='detail'" />
        </el-form-item>
        <el-form-item label="字体文件" prop="file">
          <el-upload
            ref="upload"
            class="upload-demo"
            action
            name="font"
            :http-request="submitUpload"
            :before-upload="beforeUpload"
            :on-remove="handleRemove"
            :on-change="fileChange"
            :file-list="fileList"
            :multiple="false"
            :auto-upload="false"
            :with-credentials="true"
          >
            <el-button v-if="fileList.length==0" slot="trigger" size="small" type="primary">选取文件</el-button>
            <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->
            <div slot="tip" class="el-upload__tip">只能上传压缩文件，且不超过2M</div>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button v-if="dialogType!=='detail'" v-has="701" type="primary" @click="onSubmit('fontForm')">保存</el-button>
          <el-button @click="dialogFormVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog center :title="fontDetail.font_name" :visible.sync="fontDetailDialog" class="font-dialog">
      <div style="text-align: center" class="font-box">
        <div v-for="(item,key) in fontDetail.font_content" :key="key" class="font-item">
          <span>{{ key }}：</span>
          <img :src="item" alt="" width="40">
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import fontApi from '@/api/common/font'
export default {
  data() {
    var validateFiles = (rule, value, callback) => {
      if (this.fileList.length === 0) {
        callback(new Error('请选择字体文件'))
      } else {
        callback()
      }
    }
    return {
      loading: true,
      keywords: '',
      baseUrl: process.env.VUE_APP_BASE_API,
      fontsList: [],
      dialogFormVisible: false,
      fontDetailDialog: false,
      fontForm: {
        font_name: '',
        minSize: '',
        maxSize: ''
      },
      pageSize: 5,
      currentPage: 1,
      total: 0,
      fileList: [],
      fontDetail: {},
      rules: {
        font_name: [
          { required: true, message: '请填写字体名称', trigger: 'blur' }
        ],
        minSize: [
          { required: true, message: '请输入最小高度', trigger: 'blur' }
        ],
        maxSize: [
          { required: true, message: '请输入最大高度', trigger: 'blur' }
        ],
        file: [
          { validator: validateFiles, trigger: 'change' }
        ]
      },
      dialogType: 'add'
    }
  },
  watch: {
    dialogFormVisible(val) {
      if (val === false) {
        this.$refs['fontForm'].resetFields()
        this.fileList = []
      }
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      // 获取字体列表
      fontApi.fontList().then(res => {
        this.loading = false
        this.fontsList = res.data
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
    },
    showDetail(row) {
      this.fontDetail = row
      this.fontDetailDialog = true
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const upload = this.$refs.upload
          upload.submit()
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
      this.$confirm('是否从字体库删除该字体?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'danger'
      }).then(() => {
        fontApi.deleteFont({ font_id: id }).then(res => {
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
    submitUpload(e) {
      const formData = new FormData()
      formData.append('font', e.file)
      formData.append('font_name', this.fontForm.font_name)
      const loading = this.$loading({
        lock: true,
        text: '文件上传中',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.5)'
      })
      fontApi.uploadFont(formData).then(res => {
        if (res.code !== 0) {
          this.$message({
            message: res.data.msg,
            type: 'error'
          })
        } else {
          this.$message({
            message: '上传成功',
            type: 'success'
          })
          loading.close()
          this.fetchData()
          this.dialogFormVisible = false
        }
      }).catch(() => {
        loading.close()
        this.$message({
          type: 'info',
          message: '上传失败'
        })
      })
    },
    fileChange(file, fileList) {
      console.log(file)
      console.log(fileList)
      const isZIP = file.raw.type === 'application/x-zip-compressed'
      if (!isZIP) {
        this.$message.error('上传文件只能是 ZIP 格式!')
        return false
      }
      this.fileList.push(file)
    },
    beforeUpload(file, fileList) {
      console.log(file)
      const isZIP = file.type === 'application/x-zip-compressed'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isZIP) {
        this.$message.error('上传文件只能是 ZIP 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 2MB!')
      }
      return isZIP && isLt2M
    },
    handleRemove(file, fileList) {
      this.fileList.pop()
    }
  }
}
</script>

<style lang="scss" scoped>
.fonts-list{
  .screen-box{
    .screen-item{
      text-align: left;
    }
    .operation{
      position: relative;
      top: 0;
      right: 0;
    }
  }
  .font-box{
    display: flex;
    flex-flow: wrap;
    align-items: center;
    .font-item{
      width: 20%;
      margin-bottom: 20px;
    }
  }
}

</style>
<style lang="scss">
.font-dialog{
  .el-dialog{
    position: absolute;
    top: 50%;
    left: 50%;
    margin: 0 !important;
    transform: translate(-50%, -50%);
    max-height: calc(100% - 30px);
    max-width: calc(100% - 30px);
    display: flex;
    flex-direction: column;
    height: 60vh;
    overflow: hidden;
    .el-dialog__body {
      overflow: auto;
    }
  }
}
</style>
