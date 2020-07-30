<template>
  <div>
    <!--
    给editor加key是因为给tinymce keep-alive以后组件切换时tinymce编辑器会显示异常，
    在activated钩子里改变key的值可以让编辑器重新创建
  -->
    <editor id="tinymceEditor" :key="tinymceFlag" v-model="myValue" :disabled="disabled" :init="tinymceInit" />
    <!-- <Upload
      ref="imageUpload"
      multiple
      action="//jsonplaceholder.typicode.com/posts/"
      :on-success="insertImage"
      style="display:none"
    /> -->
    <img-upload
      ref="imgUpload"
      style="display:none"
      :img-data="images"
      :pic-max="20"
      @chooseImg="imageChoose"
    />
  </div>
</template>
<script>
import ImgUpload from '@/components/ImgUpload'
import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/silver/theme.min.js'
import 'tinymce/skins/ui/oxide/skin.min.css'
import Editor from '@tinymce/tinymce-vue'

import 'tinymce/plugins/textcolor'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/paste'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/fullscreen'

export default {
  name: 'TinymceEditor',
  components: {
    editor: Editor,
    ImgUpload
  },
  props: {
    // 传入一个value，使组件支持v-model绑定
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      images: [],
      publicPath: process.env.VUE_APP_BASE_API,
      tinymceFlag: 1,
      tinymceInit: {},
      myValue: this.value
    }
  },
  watch: {
    value(newValue) {
      this.myValue = newValue
    },
    myValue(newValue) {
      this.$emit('input', newValue)
    }
  },
  created() {
    const that = this
    this.tinymceInit = {
      height: document.body.offsetHeight - 500,
      browser_spellcheck: true, // 拼写检查
      branding: true, // 去水印
      // elementpath: false,  //禁用编辑器底部的状态栏
      statusbar: false, // 隐藏编辑器底部的状态栏
      paste_data_images: true, // 允许粘贴图像
      menubar: false, // 隐藏最上方menu
      plugins: 'advlist table lists paste preview fullscreen',
      toolbar: 'code fontselect fontsizeselect forecolor backcolor bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | imageUpload quicklink h2 h3 blockquote table numlist bullist preview fullscreen',
      fontsize_formats: '8px 10px 12px 14px 16px 18px 24px 36px', // 第二步
      /**
       * 下面方法是为tinymce添加自定义插入图片按钮
       * 借助iview的Upload组件,将图片先上传到存储云上，再将图片的存储地址放入编辑器内容
       */
      setup: (editor) => {
        editor.ui.registry.addButton('imageUpload', {
          // text: '插入图片',
          tooltip: '插入图片',
          icon: 'image',
          onAction: () => {
            const upload = that.$refs.imgUpload
            upload.showGoodsModal()
          }
        })
      }
    }
  },
  activated() {
    this.tinymceFlag++
  },
  mounted() {

  },
  methods: {
    // 插入图片至编辑器
    insertImage(res, file) {
      const src = '' // 图片存储地址
      tinymce.execCommand('mceInsertContent', false, `<img src=${src}>`)
    },
    imageChoose(imgArray) {
      this.images = []
      if (imgArray.length > 0) {
        const that = this
        imgArray.forEach(item => {
          // 这里的this指向前面对象的this
          that.images.push(item)
          tinymce.execCommand('mceInsertContent', false, `<img src=${item}>`)
        })
      }
      // this.imageModalConfig.visible = false;
    }
  }
}
</script>
