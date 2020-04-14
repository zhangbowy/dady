<template>
  <div class="card-tag">
    <div class="tag-content" :style="`background:${backColor}`">
      <svg-icon :icon-class="iconName" />
      <span>{{ tagName }}</span>
    </div>
  </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'
export default {
  name: 'CardTag',
  components: {
    SvgIcon
  },
  props: {
    iconName: {
      type: String,
      default: ''
    },
    tagName: {
      type: String,
      default: ''
    },
    backColor: {
      type: String,
      default: '#666666'
    }
  }
}
</script>

<style lang="scss" scoped>
.tag-content{
  color: #fff;
  padding: 10px;
}
</style>

