<template>
  <div class="member-list main-content">
    <div class="screen-box">
      <div class="screen-item">
        <el-input
          v-model="keywords"
          size="small"
          placeholder="输入会员名称"
          clearable
          style="width:220px"
          @keyup.enter.native="fetchData"
        />
        <el-button size="small" icon="el-icon-search" type="primary" @click.native="fetchData">搜索</el-button>
      </div>
      <!-- <div class="operation">
        <el-button size="small" icon="el-icon-plus" type="primary" @click="showDialog('add')">新增</el-button>
      </div> -->
    </div>
    <div class="content">
      <el-table
        v-loading="loading"
        :data="memberList"
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
          label="会员头像"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <img :src="scope.row.headimgurl" alt="" width="60" height="60" :style="{objectFit: 'cover'}">
          </template>
        </el-table-column>
        <el-table-column
          prop="nickname"
          label="会员昵称"
          align="center"
        />
        <el-table-column
          prop="phone"
          label="手机号"
          align="center"
        />
        <el-table-column
          prop="created_at"
          label="注册时间"
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
              type="danger"
              @click="handleDelete(scope.row.shop_id)"
            >删除</el-button> -->
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
      <el-dialog v-dialogDrag center :title="dialogType=='add'? '新增会员': dialogType=='edit'? '编辑信息': '会员详情'" :visible.sync="dialogFormVisible">
        <el-form ref="memberForm" :model="memberForm" label-width="100px" label-position="left" size="small">
          <el-form-item label="会员昵称">
            <el-input v-model="memberForm.nickname " :disabled="dialogType=='detail'" />
          </el-form-item>
          <el-form-item label="真实姓名">
            <el-input v-model="memberForm.name " :disabled="dialogType=='detail'" />
          </el-form-item>
          <el-form-item label="收货地址">
            <el-input :value="memberForm | address" :disabled="dialogType=='detail'" />
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="memberForm.phone " :disabled="dialogType=='detail'" />
          </el-form-item>
          <el-form-item label="会员头像">
            <img-upload
              :disabled="dialogType=='detail'"
              :img-data="memberForm.headimgurl"
              :pic-max="1"
              @chooseImg="imageChoose"
            />
          </el-form-item>
          <!-- <el-form-item label="生日">
            <el-date-picker
              v-model="memberForm.birthday"
              type="date"
              format="yyyy-MM-dd"
              :disabled="dialogType=='detail'"
              placeholder="选择日期"
            />
          </el-form-item> -->
          <el-form-item>
            <el-button v-if="dialogType!=='detail'" type="primary" @click="onSubmit('memberForm')">保存</el-button>
            <!-- <el-button v-else type="primary" @click="dialogType='edit'">编辑</el-button> -->
            <!-- <el-button @click="dialogFormVisible = false">取消</el-button> -->
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { member } from '@/api/member'
import ImgUpload from '@/components/ImgUpload'
export default {
  components: {
    ImgUpload
  },
  filters: {
    address(item) {
      return `${item.country || ''} ${item.province || ''} ${item.city || ''} ${item.address_detail || ''}`
    }
  },
  data() {
    return {
      loading: true,
      keywords: '',
      memberList: [],
      multipleSelection: [],
      dialogFormVisible: false,
      memberForm: {
        name: '',
        nickname: '',
        phone: '',
        // birthday: '',
        headimgurl: ''
      },
      rules: {
        nickname: [
          { required: true, message: '请填写会员昵称', trigger: 'blur' }
        ]
      },
      pageSize: 5,
      currentPage: 1,
      total: 0,
      dialogType: 'add'
    }
  },
  watch: {
    dialogFormVisible(val) {
      if (val === false) {
        this.$refs['memberForm'].resetFields()
      }
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      // 获取用户列表
      member.userList({
        pageSize: this.pageSize,
        currentPage: this.currentPage
      }).then(res => {
        this.loading = false
        this.memberList = res.data.data
        this.total = res.data.count
      }).catch(() => {
        this.loading = false
      })
    },
    showDialog(type, form) {
      this.dialogType = type
      this.dialogFormVisible = true
      if (form && form.id) {
        this.memberForm = form
      }
    },
    // 图片上传模块
    imageChoose(img) {
      this.memberForm.headimgurl = img
      this.$refs.shopForm.validateField('headimgurl')
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchData()
    }
  }
}
</script>

<style lang="scss" scoped>
.member-list{
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
