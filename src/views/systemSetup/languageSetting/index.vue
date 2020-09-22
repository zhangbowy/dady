<template>
  <div class="embroid-template main-content">
    <div class="screen-box">
      <div class="screen-item">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            {{ $t(command) }}
            <i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="$t('功能名称')">{{ $t('功能名称') }}</el-dropdown-item>
            <el-dropdown-item :command="$t('非功能名称')">{{ $t('非功能名称') }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-input
          v-model="keywords"
          size="small"
          :placeholder="$t('输入关键字')"
          clearable
          style="width:220px"
          @keyup.enter.native="fetchData"
        />
        <el-button size="small" icon="el-icon-search" type="primary" @click.native="fetchData">{{ $t('搜索') }}</el-button>
      </div>
    </div>
    <div class="content">
      <el-tabs v-model="type" type="border-card" @tab-click="handleClick">
        <el-tab-pane :label="$t('管理后台')" name="1">
          <words-list :words-list="wordsList" :lang="langsType[command]" @edit="onWordEdit" @save="onWordSave" />
        </el-tab-pane>
        <el-tab-pane :label="$t('设计师管理后台')" name="2">
          <words-list :words-list="wordsList" :lang="langsType[command]" @edit="onWordEdit" @save="onWordSave" />
        </el-tab-pane>
        <el-tab-pane :label="$t('移动端商城')" name="3">
          <words-list :words-list="wordsList" :lang="langsType[command]" @edit="onWordEdit" @save="onWordSave" />
        </el-tab-pane>
      </el-tabs>
      <div class="pagination-box">
        <el-pagination
          :total="total"
          :current-page="currentPage"
          :page-sizes="[1, 10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getLanguage, editLanguage } from '@/api/common'
import WordsList from './components/WordsList'
export default {
  components: {
    WordsList: WordsList
  },
  inject: ['reload'],
  data() {
    return {
      type: '1',
      currentPage: 1,
      pageSize: 20,
      total: 0,
      keywords: '',
      wordsList: [],
      command: '功能名称',
      langsType: {
        '中文': 'cn',
        'Englist': 'en'
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getLanguage({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        platform: this.type,
        keywords: this.keywords,
        is_func_name: this.command === '功能名称' || this.command === 'Function name'
      }).then(res => {
        if (res.code === 0) {
          this.wordsList = res.data.data
          this.total = res.data.count
        } else {
          this.$message({
            type: 'error',
            message: this.$t(res.msg)
          })
        }
      })
    },
    handleCommand(value) {
      this.command = value
      this.currentPage = 1
      this.fetchData()
    },
    onWordSave(word, index) {
      this.wordsList[index].editing = false
      this.wordsList = [...this.wordsList]
      editLanguage({ lang_id: word.lang_id, cn: word.cn, en: word.en }).then(res => {
        this.$message({
          type: res.code === 0 ? 'success' : 'error',
          message: this.$t(res.msg)
        })
      })
      console.log()
    },
    onWordEdit(index) {
      this.wordsList[index].editing = true
      this.wordsList = [...this.wordsList]
    },
    handleSizeChange(value) {
      this.pageSize = value
      this.fetchData()
    },
    handleCurrentChange(value) {
      this.currentPage = value
      this.fetchData()
    },
    handleClick(type) {
      this.currentPage = 1
      this.fetchData()
    }
  }
}
</script>

<style lang="scss" scoped>
.content{
  margin-top: 0;
  border: none;
}
.screen-box {
  margin-bottom: 10px;
  padding-bottom: 10px;
  // display: flex;
}
.el-dropdown-link {
  cursor: pointer;
}
.screen-item {
  display: flex;
  align-items: center;
  .el-input  {
    margin:0 10px;
  }
}
</style>
