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
        >
          <template slot-scope="scope">
            <img :key="scope.row.preview_image" :src="scope.row.preview_image" alt="" height="40">
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
              type="primary"
              @click.native="showDialog('edit',scope.row)"
            >编辑</el-button>
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
    <el-dialog v-dialogDrag center :title="dialogType=='add'?'新增字体': '修改字体'" :visible.sync="fontDialog">
      <el-form ref="fontForm" :model="fontForm" :rules="rules" label-width="80px" label-position="left" size="small">
        <el-form-item label="字体名称" prop="font_name">
          <el-input v-model="fontForm.font_name " :disabled="dialogType=='detail'" />
        </el-form-item>
        <el-form-item label="最小高度" prop="min_height">
          <el-input-number v-model="fontForm.min_height" :min="8" :max="80" label="字体最小高度" />
        </el-form-item>
        <el-form-item label="最大高度" prop="max_height">
          <el-input-number v-model="fontForm.max_height" :min="fontForm.min_height" :max="80" label="字体最大高度" />
        </el-form-item>
        <!-- <el-form-item label="预览图" prop="preview_img">
          <el-upload
            class="logo-uploader"
            :action="`${baseUrl}/design/uploadImg`"
            name="image"
            :headers="{'adm_sign': token}"
            :file-list="fileList"
            :with-credentials="true"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :disabled="dialogType=='detail'"
          >
            <img v-if="imageUrl" :src="imageUrl" class="logo">
            <i v-else class="el-icon-plus logo-uploader-icon" />
          </el-upload>
        </el-form-item> -->
        <el-form-item label="样板展示" prop="preview_image">
          <img-upload
            :img-data="fontForm.preview_image"
            :pic-max="1"
            :disabled="dialogType=='detail'"
            @chooseImg="imageChoose"
          />
        </el-form-item>
        <el-form-item v-if="dialogType=='add'" label="字体文件" prop="file">
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
            :limit="1"
            :on-exceed="uploadExceed"
            :multiple="false"
            :auto-upload="false"
            :with-credentials="true"
          >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->
            <div slot="tip" class="el-upload__tip">只能上传压缩文件，且不超过2M</div>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button v-if="dialogType!=='detail'" v-has="701" type="primary" @click="onSubmit('fontForm')">保存</el-button>
          <el-button @click="fontDialog = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog v-dialogDrag center :title="fontDetail.font_name" :visible.sync="fontDetailDialog" class="font-dialog">
      <div style="text-align: center" class="font-box">
        <div v-for="(item,key) in fontDetail.font_content" :key="key" class="font-item">
          <span>{{ key }}：</span>
          <el-image :key="item" class="image" :src="item" lazy />
          <!-- <img :src="item" alt="" width="40"> -->
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import fontApi from '@/api/common/font'
import { getToken } from '../../../utils/auth'
import ImgUpload from '@/components/ImgUpload'
export default {
  components: {
    ImgUpload
  },
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
      token: getToken(),
      keywords: '',
      baseUrl: process.env.VUE_APP_BASE_API,
      fontsList: [],
      fontDialog: false,
      fontDetailDialog: false,
      fontForm: {
        font_name: '',
        preview_image: '',
        min_height: 0,
        max_height: 0
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
        preview_image: [
          { required: true, message: '请上传样板图', trigger: 'blur' }
        ],
        min_height: [
          { required: true, message: '请输入最小高度', trigger: 'blur' }
        ],
        max_height: [
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
    fontDialog(val) {
      if (val === false) {
        this.$refs['fontForm'].resetFields()
        this.fileList = []
        this.fontForm = {
          font_name: '',
          preview_image: '',
          min_height: 0,
          max_height: 0
        }
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
      if (form && form.font_id) {
        Object.assign(this.fontForm, form)
      }
      this.fontDialog = true
    },
    showDetail(row) {
      this.fontDetail = row
      this.fontDetailDialog = true
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.fontForm.font_id) {
            fontApi.editFont(this.fontForm).then(res => {
              this.$message({
                type: 'success',
                message: res.msg || '编辑成功!'
              })
              this.$refs.fontForm.resetFields()
              this.fetchData()
              this.fontDialog = false
            })
          } else {
            const upload = this.$refs.upload
            upload.submit()
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
    uploadExceed() {
      this.$message({
        type: 'warning',
        message: '超出文件数量限制，请先删除原文件后重新选择！'
      })
    },
    submitUpload(e) {
      const formData = new FormData()
      formData.append('font', e.file)
      formData.append('font_name', this.fontForm.font_name)
      formData.append('max_height', this.fontForm.max_height)
      formData.append('min_height', this.fontForm.min_height)
      formData.append('preview_image', this.fontForm.preview_image)
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
          this.fontDialog = false
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
      const isZIP = file.raw.type === 'application/x-zip-compressed'
      if (!isZIP) {
        this.$message.error('上传文件只能是 ZIP 格式!')
        return false
      }
      this.fileList.push(file)
    },
    beforeUpload(file, fileList) {
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
    },
    imageChoose(path) {
      this.fontForm.preview_image = path
      this.$refs.fontForm.validateField('preview_image')
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
      .image{
        width: 40px;
      }
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
  // 上传logo
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
      width: 200px;
      height: 150px;
      line-height: 150px;
      text-align: center;
    }
    .logo {
      width: 200px;
      height: 150px;
      display: block;
    }
  }
}
</style>
