<template>
  <div class="roles-list main-content">
    <div class="screen-box">
      <div class="screen-item">
        <el-input
          v-model="keywords"
          size="small"
          placeholder="请输入角色名称"
          clearable
          style="width:220px"
        />
        <el-select v-model="status" size="small" multiple placeholder="请选择">
          <el-option
            v-for="item in statusOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button size="small" icon="el-icon-search" type="primary">搜索</el-button>
      </div>
      <div class="operation">
        <router-link :to="'/manage/roles/edit'">
          <el-button size="small" icon="el-icon-plus" type="primary">新增</el-button>
        </router-link>
      </div>
    </div>
    <div class="content">
      <el-table
        :data="rolesList"
        style="width: 100%"
        fit
        highlight-current-row
        tooltip-effect="dark"
      >
        <el-table-column
          prop="name"
          label="角色名称"
          align="center"
        />
        <el-table-column
          label="状态"
          align="center"
          width="250"
        >
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status==0?'禁用':'正常' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="创建时间"
          align="center"
        />
        <el-table-column
          prop="update_time"
          label="最后更新时间"
          align="center"
        />
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <router-link :to="`/manage/roles/detail?id=${scope.row.id}`">
              <el-button
                size="mini"
              >查看</el-button>
            </router-link>
            <router-link :to="`/manage/roles/edit?id=${scope.row.id}`">
              <el-button
                size="mini"
              >编辑</el-button>
            </router-link>
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
        :total="rolesList.length"
      />
    </div>
  </div>
</template>

<script>
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'danger',
        2: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      keywords: '',
      rolesList: [{
        id: 1,
        name: '超级管理员',
        status: 1,
        create_time: '2020-4-14 15:40:28',
        update_time: '2020-4-14 15:47:28'
      }, {
        id: 2,
        name: '产品管理员',
        status: 0,
        create_time: '2020-4-14 15:40:28',
        update_time: '2020-4-14 15:47:28'
      }],
      statusOption: [{
        value: '0',
        label: '正常'
      }, {
        value: '1',
        label: '禁用'
      }],
      status: '',
      multipleSelection: []
    }
  },
  methods: {
    handleDelete(id) {
      this.$confirm('是否删除该角色?', '提示', {
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
.roles-list{
  .screen-box{
    .screen-item{
      text-align: left;
    }
  }
}
</style>
