<template>
  <el-dialog width="1040px" :visible.sync="visibleInside" title="我的图片" append-to-body>
    <div class="modal-header">
      <el-button type="primary" size="small" @click="isAdd = true">上传图片</el-button>
      <el-input
        v-model="SearchFilter.name"
        style="float:right; width:200px;"
        placeholder="搜索"
        size="small"
      >
        <i slot="prefix" class="el-input__icon el-icon-search" />
      </el-input>
    </div>
    <p v-if="tips" class="img-tips">{{ tips }}</p>
    <div class="img-choose-ctn">
      <div class="sider-bar">
        <el-tree
          :data="categoryList"
          :current-node-key="0"
          node-key="image_group_id"
          :highlight-current="true"
          @node-click="chooseCategory"
        >
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span>{{ data.name }}</span>
          </span>
        </el-tree>
      </div>
      <div v-loading="pageAjaxing" class="imgs-ctn">
        <div v-if="imageList.length>0">
          <div v-for="item in imageList" :key="item.id" class="img-item" @click="chooseImg(item)">
            <div v-show="activeList.includes(item.image_id)" class="active">
              <i>{{ activeList.indexOf(item.image_id) + 1 }}</i>
            </div>
            <img :src="item.image_path" :alt="item.image_name">
            <span class="img-meta">{{ item.image_meta }}</span>
            <p class="img-title" :title="item.image_name">{{ item.image_name }}</p>
          </div>
        </div>
        <div v-if="!imageList.length" class="noData">暂无数据，可点击左上角“上传图片”按钮添加</div>
      </div>
    </div>
    <div class="page-ctn">
      <el-pagination
        layout="total,  prev, pager, next, jumper"
        :small="true"
        class="pull-left"
        :current-page="pageInfo.page"
        :page-size="pageInfo.page_size"
        :total="pageInfo.total"
        @current-change="changeList"
      />
    </div>
    <span slot="footer" class="dialog-btn-center">
      <el-button type="primary" size="small" @click="confirm">确 定</el-button>
    </span>
    <el-dialog :visible.sync="isAdd" title="上传图片" append-to-body :before-close="handleClose">
      <el-form :model="dialog.upLoadImg" label-width="96px">
        <el-form-item label="图片分组：">
          <el-cascader
            v-model="dialog.upLoadImg.image_group_id"
            style="width:50%;"
            :options="categoryList"
            size="small"
            :props="selectProp"
            :filterable="true"
            clearable
          />
        </el-form-item>
        <el-form-item label="网络图片：">
          <el-input
            v-model="dialog.upLoadImg.url"
            style="width:300px;margin-right:20px;"
            size="small"
          />
          <el-button type="primary" size="small" @click="extractImg(dialog.upLoadImg)">提取图片</el-button>
        </el-form-item>
        <el-form-item label="本地图片：">
          <span
            v-for="(item,index) in dialog.upLoadImg.urlListShow"
            :key="index"
            class="show-imgBox"
          >
            <i class="el-icon-circle-close delete" @click="deleteShowImg(index)" />
            <img :src="common.getUrl(item.raw)" alt>
          </span>
          <el-upload
            ref="upload"
            class="avatar-uploader"
            action
            :file-list="dialog.upLoadImg.urlListShow"
            :http-request="saveImg"
            :multiple="true"
            :on-change="changeImgList"
            :auto-upload="false"
            :on-success="fileUploadSuccess"
            :show-file-list="false"
          >
            <i class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-btn-center">
        <el-button type="primary" @click="submitUpload">上传</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import ImageService from '@/api/common/image'
import { DropDownService } from '@/api/common'
export default Vue.extend({
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    picMax: {
      type: Number,
      default: null
    },
    tips: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isAdd: false,
      visibleInside: false,
      ajaxing: false,
      pageAjaxing: false,
      key: '',
      cId: [0],
      activeList: [],
      chooseList: [],
      SearchFilter: {
        name: ''
      },
      pageInfo: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      categoryList: [],
      imageList: [],
      dialog: {
        upLoadImg: {
          url: null,
          urlListShow: [],
          show: false,
          image_group_id: 0
        }
      },
      // 上传数量计数器
      uploadCount: 0,
      selectProp: {
        checkStrictly: true,
        value: 'image_group_id',
        label: 'name',
        children: 'children',
        expandTrigger: 'hover'
      }
    }
  },
  watch: {
    visible: function(val) {
      this.visibleInside = val
      if (val) {
        // 清空选中项
        this.activeList = []
        this.chooseList = []
        this.isAdd = false
        this.getList()
      }
    },
    visibleInside: function(val) {
      if (this.visible !== val) {
        this.$emit('update:visible', val)
      }
    }
  },
  mounted() {},
  methods: {
    changeImgList(file, fileList) {
      // 更改上传图片
      const isJPG = file.raw.type === 'image/jpeg'
      const isPNG = file.raw.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片只能是 JPG或png 格式!')
        this.dialog.upLoadImg.urlListShow = fileList.splice(fileList.length, 1)
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        this.dialog.upLoadImg.urlListShow = fileList.splice(fileList.length, 1)
      }
      if ((isPNG || isJPG) && isLt2M) {
        this.dialog.upLoadImg.urlListShow = fileList
      }
    },
    fileUploadSuccess(res, file, fileList) {
      // 每张图片上传成功操作
      // todo对单个文件上传进行操作（加载效果）
      this.uploadCount++
      if (this.uploadCount === fileList.length) {
        // 全部上传成功
        this.uploadCount = 0
        this.isAdd = false
        this.dialog.upLoadImg.show = false
        this.getImgList()
        this.$message({
          message: '上传图片成功',
          type: 'success'
        })
        this.visibleInside = false
      }
    },
    saveImg(e) {
      // 保存图片
      const id = this.dialog.upLoadImg.image_group_id
      const formData = new FormData()
      formData.append('image', e.file)
      formData.append('image_group_id', id[id.length - 1])
      ImageService.uploadImage(formData).then(res => {
        if (res.data.code !== 1) {
          this.$message({
            message: res.data.msg,
            type: 'error'
          })
        } else {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.isAdd = false
          this.getImgList()
        }
      })
    },
    extractImg(obj) {
      // 提取图片
      const id = this.dialog.upLoadImg.image_group_id
      const param = {
        image_group_id: id[id.length - 1],
        image_path: obj.url
      }
      ImageService.drawImage(param).then(res => {
        if (res.data.code === 1) {
          this.$message({
            message: res.data.msg,
            type: 'success'
          })
          this.isAdd = false
        } else {
          this.$message({
            message: res.data.msg,
            type: 'error'
          })
        }
      })
    },
    deleteShowImg(index) {
      // 删除上传图片
      this.dialog.upLoadImg.urlListShow.splice(index, 1)
    },
    submitUpload() {
      const upload = this.$refs.upload
      upload.submit()
      this.dialog.upLoadImg.url = ''
      this.dialog.upLoadImg.urlListShow = []
    },
    handleClose() {
      this.isAdd = false
      this.dialog.upLoadImg.url = ''
      this.dialog.upLoadImg.urlListShow = []
    },
    getList() {
      DropDownService.getCategroiesList({
        act: 'igroup'
      }).then(res => {
        if (res.data.code === 1) {
          this.categoryList = res.data.data
          this.chooseCategory(this.categoryList[0])
        } else {
          this.$message({
            message: res.data.msg,
            type: 'error'
          })
        }
      })
    },
    changeList(page) {
      this.pageInfo.page = page
      this.getImgList()
    },
    getImgList() {
      if (this.pageAjaxing) {
        return
      }
      this.pageAjaxing = true
      ImageService.getList({
        act: 'image',
        image_group_id: this.cId[this.cId.length - 1] || 0,
        ...this.pageInfo,
        ...this.SearchFilter
      }).then(res => {
        this.pageAjaxing = false
        if (res.data.code === 1 && res.data.data) {
          this.imageList = res.data.data.data
          this.pageInfo = res.data.data.page_info
        } else {
          this.$message({
            message: res.data.msg,
            type: 'error'
          })
        }
      })
    },
    chooseCategory(item, node) {
      this.cId = []
      while (node && !Array.isArray(node.data)) {
        this.cId.unshift(node.data.image_group_id)
        node = node.parent
      }
      this.cId = this.cId.length > 0 ? this.cId : [0]
      this.dialog.upLoadImg.image_group_id = this.cId
      this.getImgList()
    },

    chooseImg(obj) {
      // 单选模式
      if (this.picMax === 1) {
        // 删除原有选中项
        // this.imageList.forEach((item) => {
        //     if (item.index === this.activeList.length) {
        //         item.index--;
        //     }
        // });
        // // 设置选中
        // obj.index = 1;
        this.chooseList.splice(0, 1, obj)
        this.activeList.splice(0, 1, obj.image_id)
      } else {
        const index = this.activeList.indexOf(obj.image_id)
        if (index !== -1) {
          this.activeList.splice(index, 1)
          this.chooseList.splice(index, 1)
          // obj.index = '';
          // var _this = this;
          // this.imageList.forEach((item) => {
          //     if (item.index > _this.activeList.length) {
          //         item.index--;
          //     }
          // });
        } else {
          if (this.chooseList.length === this.picMax) {
            this.$message({
              message: `选取图片不能超过${this.picMax}张`,
              type: 'error'
            })
          } else {
            this.chooseList.push(obj)
            this.activeList.push(obj.image_id)
            // obj.index = this.activeList.length;
          }
        }
      }
    },
    confirm() {
      this.$emit('confirm', this.chooseList)
    }
  }
})
</script>

<style lang="scss" scoped>
.img-tips {
  padding: 10px 0;
  text-align: center;
  color: #f44;
  background-color: #f2f2f2;
}
.img-choose-ctn {
  display: flex;
  min-height: 400px;
  height: 400px;
  width: 100%;
  color: #666;
  .sider-bar {
    height: 100%;
    width: 180px;
    overflow: scroll;
    text-align: left;
    background-color: #f2f2f2;
    margin-right: 15px;
    ul {
      list-style: none;
      text-align: left;
      li {
        text-align: left;
        height: 30px;
        font-size: 12px;
        color: #333;
        line-height: 30px;
        padding: 0 10px;
        cursor: pointer;
        .count {
          float: right;
          color: #b2b2b2;
        }
        &.current {
          background-color: #fff;
        }
      }
    }
  }
  .imgs-ctn {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    .img-item {
      position: relative;
      float: left;
      width: 100px;
      height: 100px;
      margin-right: 10px;
      margin-bottom: 30px;
      cursor: pointer;
      .active {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: 2px solid #07d;
        box-sizing: border-box;
        i {
          position: absolute;
          right: 3px;
          top: 0;
          color: #fff;
          z-index: 2;
        }
        &::after {
          position: absolute;
          display: block;
          content: ' ';
          right: 0;
          top: 0;
          border: 14px solid #07d;
          border-left-color: transparent;
          border-bottom-color: transparent;
          z-index: 1;
        }
      }
      img {
        max-width: 100%;
        max-height: 100%;
      }
      span.img-meta {
        position: absolute;
        width: 100%;
        height: 25px;
        font-size: 12px;
        line-height: 25px;
        color: #fff;
        text-align: center;
        background: rgba(0, 0, 0, 0.2);
        bottom: 0;
        left: 0;
      }
      p.img-title {
        position: absolute;
        bottom: -18px;
        left: 0;
        right: 0;
        margin-top: 5px;
        font-size: 12px;
        padding-bottom: 1px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .img-box {
        background: #ccc;
        width: 105px;
        height: 105px;
        background-size: cover;
        background-position: 50% 50%;
      }
    }
  }
}
/deep/ .el-tree {
  background: none;
  margin-bottom: 20px;
}
</style>
