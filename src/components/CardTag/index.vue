<template>
  <div class="card-tag">
    <div class="tag-content" :style="`background:${backColor};color:${color};border-radius:${raidus};display: ${block?'block':'inline-block'}`">
      <svg-icon v-if="iconName" :icon-class="iconName" />
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
      default: '#ebebeb'
    },
    color: {
      type: String,
      default: '#31708f'
    },
    raidus: {
      type: String,
      default: ''
    },
    block: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="scss" scoped>
.tag-content{
  color: #fff;
  padding: 10px;
  display: inline-block;
}
</style>

