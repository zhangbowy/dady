<template>
  <el-dialog v-dialogDrag :visible.sync="value" width="30%" :title="$t('定制信息')" :before-close="beforeClose" @open="onDialogClick">
    <el-form label-position="left" size="small">
      <el-form-item :label="$t('预览图')">
        <!-- <img :src="infoItem.preview_image" width="100" alt=""> -->
        <el-image
          style="width: 100px; height: 100px"
          :src="infoItem.preview_image"
          :preview-src-list="srcList"
          fit="contain"
        />
        <el-button
          size="mini"
          type="text"
          @click="downloadCodeImg(infoItem.preview_image,`${infoItem.order_id}-预览图`)"
        >{{ $t('下载') }}</el-button>
      </el-form-item>
      <el-form-item v-if="infoItem.design" :label="$t('花样图片')">
        <!-- <img :src="infoItem.design.prev_png_path" width="100" alt=""> -->
        <el-image
          style="width: 100px; height: 100px"
          :src="infoItem.design.prev_png_path"
          :preview-src-list="srcList"
          fit="contain"
        />
        <el-button
          size="mini"
          type="text"
          @click="downloadCodeImg(infoItem.design.prev_png_path, `${infoItem.order_id}-花样图片`)"
        >{{ $t('下载') }}</el-button>
      </el-form-item>
      <el-form-item v-if="infoItem.order_txt_png_path" :label="$t('生产作业图')">
        <!-- <img :src="infoItem.design.prev_png_path" width="100" alt=""> -->
        <el-image
          style="width: 100px; height: 100px"
          :src="infoItem.order_txt_png_path"
          :preview-src-list="srcList"
          fit="contain"
        />
        <el-button
          size="mini"
          type="text"
          @click="downloadCodeImg(infoItem.order_txt_png_path, `${infoItem.order_id}-生产作业图`)"
        >{{ $t('下载') }}</el-button>
      </el-form-item>
      <el-form-item v-if="infoItem.design_area_image" :label="$t('设计图片')">
        <div class="design-img">
          <!-- <img :src="infoItem.design_area_image" width="100" alt=""> -->
          <el-image
            style="width: 100px; height: 100px"
            :src="infoItem.design_area_image"
            :preview-src-list="srcList"
            fit="contain"
          />
        </div>
        <el-button
          size="mini"
          type="text"
          @click="downloadCodeImg(infoItem.design_area_image, `${infoItem.order_id}-设计图片`)"
        >{{ $t('下载') }}</el-button>
      </el-form-item>
      <el-form-item v-if="infoItem.custom_image" :label="$t('自定义图片')">
        <!-- <img :src="infoItem.custom_image" width="100" alt=""> -->
        <el-image
          style="width: 100px; height: 100px"
          :src="infoItem.custom_image"
          :preview-src-list="srcList"
          fit="contain"
        />
        <el-button
          size="mini"
          type="text"
          @click="downloadCodeImg(infoItem.custom_image, `${infoItem.order_id}-自定义图片`)"
        >{{ $t('下载') }}</el-button>
      </el-form-item>

      <el-form-item v-if="infoItem.design" :label="$t('花样价格')" style="display: inline-block;width: 48%">
        <el-input v-model="infoItem.design.price" disabled>
          <template slot="append">{{ $t('元') }}</template>
        </el-input>
      </el-form-item>
      <el-form-item v-if="infoItem.font_family" :label="$t('字体')" style="display: inline-block;width: 48%">
        <el-input v-model="infoItem.font_family" disabled />
      </el-form-item>
      <el-form-item v-if="infoItem.top_font_content" :label="$t('顶部文字')" style="display: inline-block;width: 48%">
        <el-input v-model="infoItem.top_font_content" disabled />
      </el-form-item>
      <el-form-item v-if="infoItem.bottom_font_content" :label="$t('底部文字')" style="display: inline-block;width: 48%">
        <el-input v-model="infoItem.bottom_font_content" disabled />
      </el-form-item>
      <el-form-item v-if="infoItem.top_font_content && infoItem.top_font_color" :label="$t('顶部文字颜色')" style="display: inline-block;width: 48%">
        <el-input v-model="infoItem.top_font_color" disabled />
      </el-form-item>
      <el-form-item v-if="infoItem.top_font_content && infoItem.bottom_font_color" :label="$t('底部文字颜色')" style="display: inline-block;width: 48%">
        <el-input v-model="infoItem.bottom_font_color" disabled />
      </el-form-item>
      <el-form-item v-if="infoItem.top_font_size" :label="$t('顶部文字高度')" style="display: inline-block;width: 48%">
        <el-input v-model="infoItem.top_font_size" disabled>
          <template slot="append">mm</template>
        </el-input>
      </el-form-item>
      <el-form-item v-if="infoItem.bottom_font_size" :label="$t('底部文字高度')" style="display: inline-block;width: 48%">
        <el-input v-model="infoItem.bottom_font_size" disabled>
          <template slot="append">mm</template>
        </el-input>
      </el-form-item>
      <el-form-item v-if="infoItem.design_width" :label="$t('设计宽度')" style="display: inline-block;width: 48%">
        <el-input v-model="infoItem.design_width" disabled>
          <template slot="append">mm</template>
        </el-input>
      </el-form-item>
      <el-form-item v-if="infoItem.design_height" :label="$t('设计高度')" style="display: inline-block;width: 48%">
        <el-input v-model="infoItem.design_height" disabled>
          <template slot="append">mm</template>
        </el-input>
      </el-form-item>

      <!-- 特殊定制信息 -->
      <el-form-item v-if="infoItem.special_template_name" :label="$t('定制模板')">
        <el-input v-model="infoItem.special_template_name" type="textarea" disabled />
      </el-form-item>
      <el-form-item v-if="infoItem.order_type==3" :label="$t('包含商品')">
        <div>
          <el-switch
            :active-text="$t('包含')"
            :inactive-text="$t('不包含')"
            :value="infoItem.is_only_design==0? true: false"
            disabled
          />
        </div>
      </el-form-item>

      <el-form-item v-if="infoItem.special_color_num" :label="$t('颜色数')" style="display: inline-block;width: 48%">
        <el-input v-model="infoItem.special_color_num" disabled />
      </el-form-item>
      <el-form-item v-if="infoItem.special_custom_width" :label="$t('设计宽度')" style="display: inline-block;width: 48%">
        <el-input v-model="infoItem.special_custom_width" disabled>
          <template slot="append">mm</template>
        </el-input>
      </el-form-item>
      <el-form-item v-if="infoItem.special_custom_height" :label="$t('设计高度')" style="display: inline-block;width: 48%">
        <el-input v-model="infoItem.special_custom_height" disabled>
          <template slot="append">mm</template>
        </el-input>
      </el-form-item>
      <el-form-item v-if="infoItem.special_custom_desc" :label="$t('备注信息')">
        <el-input v-model="infoItem.special_custom_desc" type="textarea" disabled />
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    infoItem: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      baseUrl: process.env.VUE_APP_BASE_API
    }
  },
  computed: {
    srcList() {
      const imgList = []
      this.infoItem.preview_image && imgList.push(this.infoItem.preview_image)
      this.infoItem.order_txt_png_path && imgList.push(this.infoItem.order_txt_png_path)
      this.infoItem.design && this.infoItem.design.prev_png_path && imgList.push(this.infoItem.design.prev_png_path)
      this.infoItem.design_area_image && imgList.push(this.infoItem.design_area_image)
      this.infoItem.custom_image && imgList.push(this.infoItem.custom_image)
      return imgList
    }
  },
  methods: {
    onDialogClick() {
      document.body.style.overflow = 'hidden'
    },
    beforeClose() {
      document.body.style.overflow = 'visible'
      this.$emit('close')
    }, downloadCodeImg(imgsrc, name) {
      window.location.href = `${this.baseUrl}/index/downLoad?url=${imgsrc}&fileName=${name}`
    }
  }
}
</script>

<style lang="scss">
.design-img{
  display: inline-block;
  &:hover{
    background: #f5f5f5;
  }
}
</style>
