<template>
  <el-dialog v-dialogDrag :visible.sync="value" width="30%" title="定制信息" :before-close="beforeClose">
    <el-form label-position="left" size="small">
      <el-form-item label="预览图">
        <img :src="infoItem.preview_image" width="100" alt="">
        <el-button
          size="mini"
          type="text"
          @click="downloadCodeImg(infoItem.preview_image,`${infoItem.order_id}-预览图`)"
        >下载</el-button>
      </el-form-item>
      <el-form-item v-if="infoItem.design" label="花样图片">
        <img :src="infoItem.design.prev_png_path" width="100" alt="">
        <el-button
          size="mini"
          type="text"
          @click="downloadCodeImg(infoItem.design.prev_png_path, `${infoItem.order_id}-花样图片`)"
        >下载</el-button>
      </el-form-item>
      <el-form-item v-if="infoItem.design_area_image" label="设计图片">
        <div class="design-img">
          <img :src="infoItem.design_area_image" width="100" alt="">
        </div>
        <el-button
          size="mini"
          type="text"
          @click="downloadCodeImg(infoItem.design_area_image, `${infoItem.order_id}-设计图片`)"
        >下载</el-button>
      </el-form-item>
      <el-form-item v-if="infoItem.custom_image" label="自定义图片">
        <img :src="infoItem.custom_image" width="100" alt="">
        <el-button
          size="mini"
          type="text"
          @click="downloadCodeImg(infoItem.custom_image, `${infoItem.order_id}-自定义图片`)"
        >下载</el-button>
      </el-form-item>

      <el-form-item v-if="infoItem.design" label="花样价格" style="display: inline-block;width: 48%">
        <el-input v-model="infoItem.design.price" disabled>
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item v-if="infoItem.font_family" label="字体" style="display: inline-block;width: 48%">
        <el-input v-model="infoItem.font_family" disabled />
      </el-form-item>
      <el-form-item v-if="infoItem.top_font_content" label="顶部文字" style="display: inline-block;width: 48%">
        <el-input v-model="infoItem.top_font_content" disabled />
      </el-form-item>
      <el-form-item v-if="infoItem.bottom_font_content" label="底部文字" style="display: inline-block;width: 48%">
        <el-input v-model="infoItem.bottom_font_content" disabled />
      </el-form-item>
      <el-form-item v-if="infoItem.top_font_content && infoItem.top_font_color" label="顶部文字颜色" style="display: inline-block;width: 48%">
        <el-input v-model="infoItem.top_font_color" disabled />
      </el-form-item>
      <el-form-item v-if="infoItem.top_font_content && infoItem.bottom_font_color" label="底部文字颜色" style="display: inline-block;width: 48%">
        <el-input v-model="infoItem.bottom_font_color" disabled />
      </el-form-item>
      <el-form-item v-if="infoItem.top_font_size" label="顶部文字高度" style="display: inline-block;width: 48%">
        <el-input v-model="infoItem.top_font_size" disabled>
          <template slot="append">mm</template>
        </el-input>
      </el-form-item>
      <el-form-item v-if="infoItem.bottom_font_size" label="底部文字高度" style="display: inline-block;width: 48%">
        <el-input v-model="infoItem.bottom_font_size" disabled>
          <template slot="append">mm</template>
        </el-input>
      </el-form-item>
      <el-form-item v-if="infoItem.design_width" label="设计宽度" style="display: inline-block;width: 48%">
        <el-input v-model="infoItem.design_width" disabled>
          <template slot="append">mm</template>
        </el-input>
      </el-form-item>
      <el-form-item v-if="infoItem.design_height" label="设计高度" style="display: inline-block;width: 48%">
        <el-input v-model="infoItem.design_height" disabled>
          <template slot="append">mm</template>
        </el-input>
      </el-form-item>

      <!-- 特殊定制信息 -->
      <el-form-item v-if="infoItem.special_template_name" label="定制模板">
        <el-input v-model="infoItem.special_template_name" type="textarea" disabled />
      </el-form-item>
      <el-form-item v-if="infoItem.order_type==3" label="包含商品">
        <div>
          <el-switch
            active-text="包含"
            inactive-text="不包含"
            :value="infoItem.is_only_design==0? true: false"
            disabled
          />
        </div>
      </el-form-item>

      <el-form-item v-if="infoItem.special_color_num" label="颜色数" style="display: inline-block;width: 48%">
        <el-input v-model="infoItem.special_color_num" disabled />
      </el-form-item>
      <el-form-item v-if="infoItem.special_custom_width" label="设计宽度" style="display: inline-block;width: 48%">
        <el-input v-model="infoItem.special_custom_width" disabled>
          <template slot="append">mm</template>
        </el-input>
      </el-form-item>
      <el-form-item v-if="infoItem.special_custom_height" label="设计高度" style="display: inline-block;width: 48%">
        <el-input v-model="infoItem.special_custom_height" disabled>
          <template slot="append">mm</template>
        </el-input>
      </el-form-item>
      <el-form-item v-if="infoItem.special_custom_desc" label="备注信息">
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
  methods: {
    beforeClose() {
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
