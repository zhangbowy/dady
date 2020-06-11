<template>
  <div class="img-resources">
    <el-row>
      <el-col :span="12">
        <el-button v-has="405" type="primary" size="small" @click.native="showUpload">上传图片</el-button>
      </el-col>
      <el-col :span="12" style="text-align: right">
        <el-input v-model="keyword" size="small" placeholder="请输入内容" class="input-with-select" style="width: 40%">
          <el-button slot="append" icon="el-icon-search" @click.stop="getImgList" />
        </el-input>
      </el-col>
    </el-row>
    <el-row v-loading="loading" class="content">
      <el-col :span="4" style="background: #f5f5f5;padding: 20px 10px">
        <el-button
          v-has="407"
          size="small"
          icon="el-icon-folder-add"
          style="width:100%"
          @click="addGroup"
        >添加分组
        </el-button>
        <div class="group-box">
          <div class="default-node">
            <span @click="getAll">全部</span>
            <span @click="getNotGrouped">未分组</span>
          </div>
          <el-tree
            :data="groupData"
            node-key="group_id"
            :current-node-key="0"
            default-expand-all
            :default-expanded-keys="defaultExpandedKeys"
            @node-click="chooseCategory"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <el-input
                v-if="!data.group_id && data.group_id !== 0"
                v-model="data.group_name"
                v-focus
                size="mini"
                placeholder="请输入内容"
                class="writeInput"
                @blur="addCategory(data)"
                @keyup.native.enter="$event.target.blur"
              />
              <span v-else class="group_name">
                <span v-if="!data.showInput">{{ data.group_name }}</span>
                <el-input
                  v-if="data.showInput"
                  v-model="data.group_name"
                  v-focus
                  size="mini"
                  placeholder="请输入"
                  class="writeInput"
                  @blur="editCategoryName(data)"
                  @keyup.native.enter="$event.target.blur"
                />
              </span>
              <!-- <span class="group_name">{{ data.group_name }}</span> -->
              <span>
                <el-tooltip v-if="data.group_id !== 0" class="item" content="添加子分类" placement="top">
                  <el-button type="text" size="mini" icon="el-icon-plus" @click.stop="() => addCategoryShow(data)" />
                </el-tooltip>
                <el-tooltip v-if="data.group_id !== 0" class="item" content="重命名" placement="top">
                  <el-button v-has="408" type="text" size="mini" icon="el-icon-edit" @click.stop="() => goInput(node, data)" />
                </el-tooltip>
                <el-tooltip v-if="data.group_id !== 0" class="item" content="删除分类" placement="top">
                  <el-button v-has="409" type="text" size="mini" icon="el-icon-delete" @click.stop="() => remove(node, data)" />
                </el-tooltip>
              </span>
            </span>
          </el-tree>
        </div>
      </el-col>
      <el-col :span="20" style="padding: 0 20px">
        <div class="img-list">
          <div v-for="(item,index) in imgList" :key="index" class="img-item">
            <!-- <img :src="item.oss_path" alt=""> -->
            <el-image :src="item.oss_path" lazy />
            <el-checkbox v-model="item.checked" :label="limetedStr(item.img_name,16)" :title="item.img_name" />
            <el-col>
              <el-button v-has="412" type="text" @click.stop="showdialog('modifyName',item)">改名</el-button>
              <!-- <el-button type="text" @click.stop="showdialog('modifyUrl',item)">链接</el-button> -->
              <el-button v-has="410" type="text" @click.stop="showdialog('modifyGroup',item)">分组</el-button>
              <el-button v-has="413" type="text" @click.stop="deleteImg(item.id)">删除</el-button>
            </el-col>
          </div>
          <div v-if="imgList.length==0">
            该分组下暂无图片...
          </div>
        </div>
        <div class="paging">
          <div v-if="imgList.length>0" style="padding-top:10px;">
            <el-button size="mini" @click="checkAll">全选</el-button>
            <el-button size="mini" @click="unCheckAll">取消全选</el-button>
            <!-- <el-button size="mini" @click="showdialog('modifyGroup')">修改分组</el-button> -->
            <el-button v-has="413" size="mini" @click="deleteImg()">删除</el-button>
          </div>
          <div v-if="pageInfo.count" class="page-ctn">
            <el-pagination
              layout="total, sizes, prev, pager, next, jumper"
              :small="true"
              class="pull-left"
              :page-sizes="[10, 15, 20, 30]"
              :current-page="pageInfo.currentPage"
              :page-size="pageInfo.pageSize"
              :total="pageInfo.count"
              @current-change="changeList"
              @size-change="handleSizeChange"
            />
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 上传图片的dialog -->
    <el-dialog v-dialogDrag title="上传图片" :visible.sync="uploadDialog">
      <el-form ref="fileUploadForm" :model="uploadForm" :rules="uploadRules">
        <el-form-item label="图片分组">
          <el-cascader
            v-model="checkedGroup"
            :options="groupData"
            :props="optionProps"
            style="width:100%"
            @change="imgGroupChose"
          />
        </el-form-item>
        <el-form-item label="本地图片" prop="images">
          <span v-for="(item,index) in uploadImageList" :key="index" class="show-imgBox">
            <i class="el-icon-circle-close delete" @click="deleteShowImg(index)" />
            <img :src="getUrl(item.raw)" alt="" width="100" height="100" @click="preview(getUrl(item.raw))">
          </span>
          <el-upload
            ref="upload"
            class="avatar-uploader"
            action
            :file-list="uploadImageList"
            :http-request="saveImg"
            :show-file-list="false"
            :multiple="true"
            :auto-upload="false"
            :on-change="changeImgList"
            :on-success="fileUploadSuccess"
          >
            <i
              class="el-icon-plus avatar-uploader-icon"
            />
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button size="small" @click="uploadDialog = false">取 消</el-button>
          <el-button v-has="405" size="small" type="primary" @click="fileUpload">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog v-dialogDrag title="添加分组" :visible.sync="addGroupDialog">
      <el-form ref="groupForm" :model="groupForm" :rules="groupRules">
        <el-form-item label="所属分组">
          <el-cascader
            v-model="checkedGroup"
            :options="groupData"
            :props="optionProps"
            style="width: 100%"
            @change="handleChange"
          />
        </el-form-item>
        <el-form-item label="分组名称" prop="group_name">
          <el-input v-model="groupForm.group_name" placeholder="请输入分组名称" />
        </el-form-item>
        <el-form-item>
          <el-button @click="addGroupDialog = false">取 消</el-button>
          <el-button v-has="407" type="primary" @click="addGrops">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog v-dialogDrag :title="changeFormName=='modifyName'?'修改名称':'修改分组'" :visible.sync="changeGroupDialog" width="30%">
      <el-form ref="changeFrom" :model="changeFrom" :rules="groupRules">
        <el-form-item v-if="changeFormName=='modifyGroup'" label="选择分组">
          <el-cascader
            v-model="checkedGroup"
            :options="groupData"
            :props="optionProps"
            style="width: 100%"
            @change="setImgGroup"
          />
        </el-form-item>
        <el-form-item v-if="changeFormName=='modifyName'" label="图片名称" prop="img_name">
          <el-input v-model="changeFrom.img_name" placeholder="请输入图片名称" />
        </el-form-item>
        <el-form-item>
          <el-button @click="changeGroupDialog = false">取 消</el-button>
          <el-button v-has="408" type="primary" @click="ensureChange">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 图片预览 -->
    <el-dialog v-dialogDrag title="图片展示" :visible.sync="previewDialog.show">
      <img width="100%" :src="previewDialog.url" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { GroupApi } from '@/api/common'
import imgApi from '@/api/common/image'
export default {
  // 自定义指令
  directives: {
    focus: {
      inserted: function(el) {
        el.querySelector('input').focus()
      }
    }
  },
  data() {
    return {
      groupData: [], // 分组列表
      imgList: [], // 图库图片列表
      defaultExpandedKeys: [],
      nodeType: '', // 输入框节点类型
      baseUrl: process.env.VUE_APP_BASE_UPLOAD_URL,
      keyword: '', // 搜索关键词
      uploadDialog: false, // 上传图片弹框
      addGroupDialog: false, // 添加分组弹框
      changeGroupDialog: false, // 修改分组弹框
      changeFormName: '', // modifyName改名 modifyGroup 改分组
      // 分组选择配置项
      optionProps: {
        checkStrictly: true,
        expandTrigger: 'hover',
        value: 'group_id',
        label: 'group_name'
      },
      // 预览图片对象
      previewDialog: {
        show: false,
        url: ''
      },
      checkedGroup: [], // 选中的分组
      uploadImageList: [], // 预上传图片列表
      // 图片上传表单
      uploadForm: {
        group_id: '',
        images: []
      },
      // 修改分组的表单
      changeFrom: {
        img_id: '',
        group_id: '',
        img_name: ''
      },
      // 分组表单
      groupForm: {
        parent_id: '',
        group_name: ''
      },
      uploadRules: {
        // images: [
        //   { required: true, message: '请上传图片', trigger: 'blur' }
        // ]
      },
      // 分组表单规则
      groupRules: {
        group_name: [
          { required: true, message: '请输入分组名称', trigger: 'blur' }
        ]
      },
      uploadCount: 0, // 上传图片数
      selectGroupId: -1, // 选择的分组节点id  0表示为分组 -1表示全部
      // 分页信息
      pageInfo: {
        currentPage: 1,
        pageSize: 10,
        count: 0
      },
      loading: true,
      deleteArr: [] // 待删除图片的数组
    }
  },
  watch: {
    imgList: {
      handler(newValue, oldValue) {
        const arr = []
        newValue.map(item => {
          if (item.checked === true) {
            arr.push(item.id)
          }
        })
        this.deleteArr = arr
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 初始化data
    fetchData() {
      this.getGroupList()
      this.getImgList()
    },
    // 获取分组
    getGroupList() {
      GroupApi.getGroupList().then(res => {
        this.groupData = res.data
      })
    },
    // 获取图片列表
    getImgList() {
      imgApi.getList({
        pageSize: this.pageInfo.pageSize,
        currentPage: this.pageInfo.currentPage,
        gallery_group_id: this.selectGroupId,
        img_name: this.keyword
      }).then(res => {
        this.loading = false
        this.imgList = res.data.data
        this.pageInfo.count = res.data.count
      }).catch(() => {
        this.loading = false
        this.$message({
          type: 'info',
          message: '图库获取失败！'
        })
      })
    },
    // 上传图片弹窗
    showUpload() {
      this.uploadDialog = true
    },
    // 添加分组弹窗
    addGroup() {
      this.addGroupDialog = true
    },
    // 修改分组弹框
    showdialog(name, item) {
      this.changeFormName = name
      this.changeGroupDialog = true
      this.changeFrom.img_id = item.id
    },
    ensureChange() {
      if (this.changeFormName === 'modifyName') {
        this.changeImgName()
      } else {
        this.changeImgGrops()
      }
    },
    // 修改图片分组
    changeImgGrops() {
      imgApi.setImgGroup({
        id: this.changeFrom.img_id,
        gallery_group_id: this.changeFrom.group_id[0]
      }).then(res => {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        this.getImgList()
        this.changeGroupDialog = false
        this.checkedGroup = []
        this.changeFrom.group_id = ''
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '修改失败'
        })
      })
    },
    // 修改图片名称
    changeImgName() {
      imgApi.editImageName({
        id: this.changeFrom.img_id,
        img_name: this.changeFrom.img_name
      }).then(res => {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        this.getImgList()
        this.changeGroupDialog = false
        this.changeFrom.img_name = ''
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '修改失败'
        })
      })
    },
    setImgGroup(data) {
      this.changeFrom.group_id = data.slice(-1)
    },
    // 预览图片
    preview(url) { // 点击显示上传图片
      this.previewDialog.show = true
      this.previewDialog.url = url
    },
    // 删除选择的图片
    deleteShowImg(index) { // 删除上传图片
      this.uploadImageList.splice(index, 1)
    },
    // 图片选择 -未上传
    changeImgList(file, fileList) { // 更改上传图片
      const isJPG = file.raw.type === 'image/jpeg' || file.raw.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
        fileList.pop()
        return isJPG
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        fileList.pop()
        return isLt2M
      }
      if (isJPG && isLt2M) {
        this.uploadImageList = fileList
      }
    },
    // 图片上传成功 upLoad组件回调，
    fileUploadSuccess(res, file, fileList) { // 每张图片上传成功操作
      // todo对单个文件上传进行操作（加载效果）
      this.uploadCount++
      if (this.uploadCount === fileList.length) {
        // 全部上传成功
        this.uploadCount = 0
        this.uploadDialog = false
        // this.getImgList()
        this.$message({
          message: '上传图片成功',
          type: 'success'
        })
      }
    },
    // 添加分组 分组选择
    handleChange(data) {
      this.groupForm.parent_id = data.slice(-1)
    },
    // 上传图片分组选择
    imgGroupChose(data) {
      this.uploadForm.group_id = data.slice(-1)
    },
    // 删除分组
    remove(node, data) {
      this.$confirm('此操作将永久删除该分组, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        GroupApi.deleteGroup({ gallery_group_id: data.group_id }).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        setTimeout(() => {
          this.fetchData()
        }, 1000)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 添加分组
    addGrops() {
      GroupApi.addGroup({
        group_name: this.groupForm.group_name,
        parent_id: this.groupForm.parent_id[0] ? this.groupForm.parent_id[0] : 0,
        level: this.groupForm.level
      }).then(res => {
        this.$message({
          type: 'success',
          message: '添加成功'
        })
        this.getGroupList()
        this.checkedGroup = []
        this.addGroupDialog = false
        this.$refs.groupForm.resetFields()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '添加失败'
        })
      })
    },
    // 上传图片
    saveImg(e) {
      const formData = new FormData()
      formData.append('image', e.file)
      formData.append('gallery_group_id', this.uploadForm.group_id)
      const loading = this.$loading({
        lock: true,
        text: '图片上传中',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.5)'
      })
      imgApi.addImage(formData).then(res => {
        if (res.code === 0) {
          this.$message({
            message: res.msg || '上传成功',
            type: 'success'
          })
          this.getImgList()
          this.uploadDialog = false
          this.checkedGroup = []
          this.uploadImageList = []
          this.$refs.fileUploadForm.resetFields()
          loading.close()
        } else {
          loading.close()
          this.$message({
            message: res.msg || '上传失败',
            type: 'error'
          })
        }
      })
    },
    // 图片上传表单提交
    fileUpload() {
      this.$refs.fileUploadForm.validate(valid => {
        if (valid) {
          this.$refs.upload.submit()
        }
      })
    },
    // 点击分组节点
    chooseCategory(item, node) {
      this.pageInfo.currentPage = 1
      if (item.group_id !== '') {
        this.selectGroupId = item.group_id
        this.getImgList()
      }
    },
    // 全选
    checkAll() {
      this.imgList.forEach((item, index) => {
        this.$set(item, 'checked', true)
        this.deleteArr.push(item.id)
      })
    },
    unCheckAll() {
      this.imgList.forEach((item, index) => {
        this.$set(item, 'checked', false)
        this.deleteArr = []
      })
    },
    // 分页改变
    changeList(page) {
      this.pageInfo.currentPage = page
      this.getImgList()
    },
    handleSizeChange(val) {
      this.pageInfo.pageSize = val
      this.getImgList()
    },
    getAll() {
      this.selectGroupId = -1
      this.pageInfo.currentPage = 1
      this.getImgList()
    },
    getNotGrouped() {
      this.selectGroupId = 0
      this.pageInfo.currentPage = 1
      this.getImgList()
    },
    // 删除图片
    deleteImg(id) {
      this.$confirm('此操作将永久删除图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        imgApi.deleteImage({
          id: id || JSON.stringify(this.deleteArr)
        }).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        this.getImgList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '删除失败！'
        })
      })
    },
    // 编辑分组
    goInput(node, data) {
      this.$set(data, 'showInput', true)
    },
    addCategoryShow(data) {
      if (data.group_id !== undefined) {
        this.defaultExpandedKeys.push(data.group_id)
      }
      this.$nextTick(() => {
        if (!data.level) {
          this.groupData.push({ group_id: '', parent_id: 0, group_name: '新增1级分类', level: 1, children: [], showInput: false })
          return
        }
        const newChild = { group_id: '', parent_id: data.group_id, group_name: '新增分类', level: (data.level + 1), showInput: false }
        if (!data.children) {
          this.$set(data, 'children', [])
        }
        data.children.push(newChild)
      })
    },
    // 添加分类
    addCategory(data) {
      GroupApi.addGroup({
        group_name: data.group_name,
        parent_id: data.parent_id,
        level: data.level
      }).then(res => {
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.fetchData()
        this.nodeType = ''
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '添加失败！'
        })
      })
    },
    // 编辑分类
    editCategoryName(data) {
      // console.log('editdata', data)
      data.showInput = false
      GroupApi.editGroup({
        group_name: data.group_name,
        gallery_group_id: data.group_id,
        level: data.level
      }).then(res => {
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.fetchData()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '编辑失败！'
        })
      })
    }
  }
}
</script>
<style lang="scss" scope>
.img-resources{
  .content{
    padding: 20px 0;
    .group-box{
      background: #f5f5f5;
      margin-top: 20px;
      .group_name{
        overflow: hidden;
        display: inline-block;
        vertical-align: middle;
        margin-right: 20px;
      }
      .default-node{
        font-size: 14px;
        span{
          cursor: pointer;
          display: inline-block;
          width: 48%;
          margin-bottom: 20px;
          text-align: center;
        }
        span:hover{
          color: #409EFF;
        }
      }
      .writeInput{
        width:100%;
      }
    }
    .img-list{
      display: flex;
      flex-flow: wrap;
      align-items: center;
      .img-item{
        width: 18.4%;
        margin-right: 2%;
        border: 1px solid #f5f5f5;
        border-radius: 5px;
        margin-bottom: 10px;
        padding: 10px;
        &:nth-child(5n){
          margin-right: 0;
        }
        img{
          width: 100%;
          height: 180px;
        }
      }
    }
    .paging{
      display: flex;
      justify-content: space-between;
      align-items: center;
      .page-ctn{
          padding-top: 3px;
          height: 30px;
          line-height: 30px;
      }
    }
  }
  .show-imgBox{
    position: relative;
    display: inline-block;
    margin-right: 5px;
    border: 1px solid #f5f5f5;
    border-radius: 5px;
    .delete{
      position: absolute;
      top: -5px;
      right: -5px;
    }
  }
}
</style>
<style lang="scss">
.avatar-uploader {
  display: inline-block;
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
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
}
.img-resources{
  .el-tree{
    background: none;
    font-size: 14px;
    .custom-tree-node{
      display: flex;
      align-items: center;
      width: 100%;
      > span{
        flex: 1;
        text-align: right;
        padding-right: 10px;
        overflow: hidden;
      }
      > span.group_name{
        text-align: left;
        padding: 0;
      }
    }

  }
}

</style>
