<template>
  <div class="wordsList">
    <el-row>
      <el-col v-for="(word, index) in wordsList" :key="word.key" :span="24" class="word-item">
        <el-input v-model="word.key" size="small" disabled style="width: 15%" /> :
        <el-input v-model="word['cn']" size="small" :disabled="!word.editing" style="width: 25%" />
        <el-input v-model="word['en']" size="small" :disabled="!word.editing" style="width: 25%" />
        <el-button
          v-if="word.editing"
          size="small"
          type="primary"
          icon="el-icon-finished"
          style="vertical-align: top;"
          @click="saveEdit(word, index)"
        >{{ $t('保存') }}</el-button>
        <el-button
          v-else
          size="small"
          type="primary"
          icon="el-icon-edit"
          style="vertical-align: top;"
          @click="editClick(index)"
        >{{ $t('编辑') }}</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    wordsList: {
      type: Array,
      default: () => []
    },
    lang: {
      type: String,
      default: 'cn'
    }
  },
  data() {
    return {
      disabled: true,
      dialogType: 'detail'
    }
  },
  methods: {
    saveEdit(word, index) {
      this.$emit('save', word, index)
    },
    editClick(index) {
      this.$emit('edit', index)
    }
  }
}
</script>

<style>
.word-item {
  margin: 2px 0;
}
</style>
