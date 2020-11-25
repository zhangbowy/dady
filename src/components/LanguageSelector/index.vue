<template>
  <el-dropdown @command="handleCommand">
    <span class="el-dropdown-link">
      <svg-icon icon-class="language" />
      {{ langsType[command] || '中文' }}
      <i class="el-icon-arrow-down el-icon--right" />
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="zh">中文</el-dropdown-item>
      <el-dropdown-item command="en">English</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      command: 'zh',
      langsType: {
        'zh': '选择语言',
        'en': 'Languages'
      }
    }
  },
  computed: {
    ...mapGetters([
      'lang'
    ])
  },
  created() {
    this.command = this.lang
  },
  methods: {
    handleCommand(value) {
      this.command = value
      this.$i18n.locale = value || 'zh'
      document.documentElement.dataset.lang = value
      this.$store.dispatch('settings/changeSetting', { key: 'lang', value: value })
    }
  }
}
</script>

<style>
.el-dropdown-link {
  cursor: pointer;
}
</style>
