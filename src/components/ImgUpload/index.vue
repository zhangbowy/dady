<template>
  <div class="clearBoth">
    <!-- 多图上传 -->
    <div v-if="imgList && imgList.length>0 && picMax>1" class="img-list">
      <draggable v-model="imgList" class="wrapper">
        <transition-group>
          <div v-for="(item, index) in imgList" :key="index+item" class="img-item">
            <i v-if="!disabled" class="el-icon-circle-close close-btn" @click="deleteImg(index)" />
            <img v-if="widths" :src="item" style="width:315px;height:88px;">
            <img v-else :src="item">
          </div>
        </transition-group>
      </draggable>
    </div>
    <!-- 单图上传 -->
    <div v-if="picMax==1 && imgList !=''" class="img-list">
      <div class="img-item">
        <i v-if="!disabled" class="el-icon-circle-close close-btn" @click="deleteImg()" />
        <img v-if="widths" :src="imgList" :style="`width:{widths}}px;height:88px;`">
        <img v-else :src="imgList" width="100" height="100">
      </div>
    </div>
    <!-- 上传按钮 -->
    <div v-if="!disabled">
      <div v-if="imgList && imgList.length<picMax" class="img-box" @click="showGoodsModal">
        <i v-if="!disabled" class="el-icon-plus" />
      </div>
      <div v-if="picMax==1 && imgList==''" class="img-box" @click="showGoodsModal">
        <i v-if="!disabled" class="el-icon-plus" />
      </div>
    </div>
    <!-- 图片选择弹框 -->
    <image-modal :visible.sync="imageModalConfig.visible" :pic-max="picMax" @confirm="imageChoose" />
  </div>
</template>

<script>
import ImageModal from '@/components/ImgModal'
import draggable from 'vuedraggable'
export default {
  components: {
    ImageModal,
    draggable
  },
  props: {
    imgData: {
      type: [Array, String],
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    picMax: {
      type: Number,
      default: null
    },
    widths: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      imageModalConfig: {
        visible: false
      },
      imgList: []
    }
  },
  watch: {
    imgData: function(val) {
      this.imgList = val
    },
    imgList: function(val) {
      this.change()
    }
  },
  created() {
    this.imgList = this.imgData
  },
  methods: {
    showGoodsModal() {
      this.imageModalConfig.visible = true
    },
    imageChoose(ArrList) {
      ArrList.forEach((item, index) => {
        if (this.imgList.length < this.picMax) {
          if (this.picMax === 1) {
            this.imgList = item.oss_path
          } else {
            this.imgList.push(item.oss_path)
          }
        }
      })

      this.$emit('chooseImg', this.imgList)
      this.imageModalConfig.visible = false
    },
    // 图片拖拽完成时触发这个方法
    change() {
      this.$emit('changePsit', this.imgList)
    },
    deleteImg(index) {
      if (this.picMax === 1) {
        this.imgList = ''
      } else {
        this.imgList.splice(index, 1)
      }
      this.$emit('chooseImg', this.imgList)
    }
  }
}
</script>

<style lang="scss" scoped>
.clearBoth{
    .img-box{
        width: 80px;
        height: 80px;
        border:1px dashed #ccc;
        text-align: center;
        position: relative;
        cursor: pointer;
        float:left;
        i{
            width: 25px;
            height: 25px;
            position: absolute;
            font-size: 25px;
            top:0;
            left:0;
            right:0;
            bottom:0;
            margin:auto;
            color: #409EFF;
        }
        &::after{
            clear:both;
            display:block;
            content:''
        }
    }
    .img-list{
        // width: 100%;
        float:left;
        .img-item{
            float:left;
            position: relative;
            margin-right:15px;
            border: 1px solid #f5f5f5;
            border-radius: 5px;
            line-height: 1;
            img{
                width: 80px;
                height: 80px;
            }
            i{
                position:absolute;
                right:-5px;
                top:-5px;
            }
        }
        // &::after{
        //     clear:both;
        //     display:block;
        //     content:''
        // }
    }
    &::after{
        clear:both;
        display:block;
        content:''
    }
}

</style>
