<template>
  <div class="fonts-list main-content">
    <div class="screen-box">
      <!-- <div class="screen-item">
        <el-input
          v-model="keywords"
          size="small"
          placeholder="请输入店铺名称"
          clearable
          style="width:220px"
          @keyup.enter.native="fetchData"
        />
        <el-button size="small" icon="el-icon-search" type="primary" @click.native="fetchData">搜索</el-button>
      </div> -->
      <div class="operation">
        <el-button size="small" icon="el-icon-upload" type="primary" @click="showDialog('add')">上传</el-button>
      </div>
    </div>
    <div class="content">
      <el-table
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
          fixed="right"
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
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
    <el-dialog center :title="'新增字体'" :visible.sync="dialogFormVisible">
      <el-form ref="fontForm" :model="fontForm" :rules="rules" label-width="100px" label-position="left" size="small">
        <el-form-item label="字体名称" prop="font_name">
          <el-input v-model="fontForm.font_name " :disabled="dialogType=='detail'" />
        </el-form-item>
        <el-form-item label="字体文件" prop="logo">
          <el-upload
            ref="upload"
            class="upload-demo"
            action
            name="font"
            :http-request="submitUpload"
            :before-upload="beforeUpload"
            :on-remove="handleRemove"
            :file-list="fileList"
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
          <el-button v-if="dialogType!=='detail'" type="primary" @click="onSubmit('fontForm')">保存</el-button>
          <el-button @click="dialogFormVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import fontApi from '@/api/common/font'
export default {
  data() {
    return {
      load: true,
      keywords: '',
      baseUrl: process.env.VUE_APP_BASE_API,
      fontsList: [],
      dialogFormVisible: false,
      fontForm: {
        font_name: ''
      },
      pageSize: 5,
      currentPage: 1,
      total: 0,
      fileList: [],
      rules: {
        font_name: [
          { required: true, message: '请填写字体名称', trigger: 'blur' }
        ]
      },
      dialogType: 'add'
    }
  },
  watch: {
    dialogFormVisible(val) {
      if (val === false) {
        console.log(1)
        this.$refs['fontForm'].resetFields()
        this.fileList = []
      }
    }
  },
  mounted() {
    // this.fetchData()
  },
  methods: {
    fetchData() {
      // 获取店铺列表
      // getList({
      //   shop_name: this.keywords,
      //   pageSize: this.pageSize,
      //   currentPage: this.currentPage
      // }).then(res => {
      //   this.fontsList = res.data.data
      //   this.total = res.data.count
      // })
    },
    showDialog(type, form) {
      this.dialogType = type
      this.dialogFormVisible = true
    },
    onSubmit() {
      const upload = this.$refs.upload
      upload.submit()
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
        // delShop({ shop_id: id }).then(res => {
        //   this.$message({
        //     type: 'success',
        //     message: '删除成功!'
        //   })
        //   this.fetchData()
        // })
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
          // this.getImgList()
        }
      })
    },
    beforeUpload(file) {
      console.log(file.type)
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
      console.log(file, fileList)
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
}
</style>
