<template>
  <div class="goods-category main-content">
    <div class="screen-box">
      <el-button icon="el-icon-plus" type="primary" @click="showDialog('add')">新增</el-button>
    </div>
    <div class="content">
      <el-table
        :data="categories"
        style="width: 100%"
        fit
        highlight-current-row
      >
        <el-table-column
          fixed
          type="index"
          label="序号"
          width="100"
          align="center"
        />
        <el-table-column
          prop="name"
          label="分类名称"
          align="center"
        />
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          width="250"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="showDialog()"
            >查看</el-button>
            <el-button
              size="mini"
              @click="showDialog('edit', scope.row.id)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        :hide-on-single-page="true"
        background
        layout="prev, pager, next"
        :total="categories.length"
      />
    </div>
    <!-- 新增，详情，编辑弹框 -->
    <el-dialog center :title="dialogType=='add'? '新增分类': dialogType=='edit'? '编辑分类': '分类详情'" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="上级分类" :label-width="formLabelWidth">
          <el-select v-model="form.pid" placeholder="请选择上级分类">
            <el-option label="大分类1" value="1" />
            <el-option label="大分类2" value="2" />
          </el-select>
        </el-form-item>
      </el-form>
      <div v-if="dialogType==='add' || dialogType==='edit'" slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { categories } from '@/api/category'
export default {
  data() {
    return {
      categories: [{
        id: 1,
        date: '2016-05-02',
        name: '手机'
      }, {
        id: 2,
        date: '2016-05-02',
        name: '帽子'
      }, {
        id: 3,
        date: '2016-05-02',
        name: '裙子'
      }],
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        name: '',
        pid: '',
        desc: ''
      },
      formLabelWidth: '120px',
      dialogType: 'add'
    }
  },
  mounted() {
    // this.getCategores()
  },
  methods: {
    // 获取所有分类
    getCategores() {
      categories().then(res => {

      })
    },
    showDialog(type, id) {
      this.dialogType = type
      this.dialogFormVisible = true
      if (id) {
        // 请求分类详情
      }
    },
    handleClick(id) {
      console.log(id)
    },
    handleEdit(id) {
      console.log(id)
    },
    handleDelete(id) {
      this.$confirm('是否删除该分类?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'danger',
        center: true
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
