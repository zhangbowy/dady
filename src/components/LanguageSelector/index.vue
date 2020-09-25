<template>
  <el-dropdown @command="handleCommand">
    <span class="el-dropdown-link">
      <svg-icon icon-class="language" />
      {{ command || '中文' }}
      <i class="el-icon-arrow-down el-icon--right" />
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="中文">中文</el-dropdown-item>
      <el-dropdown-item command="Englist">English</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      command: '中文',
      langsType: {
        '中文': 'zh',
        'Englist': 'en',
        'zh': '中文',
        'en': 'English'
      }
    }
  },
  computed: {
    ...mapGetters([
      'lang'
    ])
  },
  created() {
    this.command = this.langsType[this.lang]
  },
  methods: {
    handleCommand(value) {
      this.command = value
      this.$i18n.locale = this.langsType[value] || 'zh'
      document.documentElement.dataset.lang = this.langsType[value]
      this.$store.dispatch('settings/changeSetting', { key: 'lang', value: this.langsType[value] })
    }
  }
}
</script>

<style>
.el-dropdown-link {
  cursor: pointer;
}
</style>
