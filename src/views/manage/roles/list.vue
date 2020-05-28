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
        <el-button size="small" icon="el-icon-search" type="primary" @click="doSearch">搜索</el-button>
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
          prop="admin_role_id"
          label="ID"
          align="center"
        />
        <el-table-column
          prop="admin_role_name"
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
          prop="created_at"
          label="创建时间"
          align="center"
        />
        <el-table-column
          prop="updated_at"
          label="最后更新时间"
          align="center"
        />
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <!-- <router-link :to="`/manage/roles/detail?id=${scope.row.admin_role_id}`">
              <el-button
                size="mini"
              >查看</el-button>
            </router-link> -->
            <router-link :to="`/manage/roles/edit?id=${scope.row.admin_role_id}`">
              <el-button
                type="primary"
                size="mini"
              >编辑</el-button>
            </router-link>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.admin_role_id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <!-- 分页 -->
      <div class="pagination-box">
        <el-pagination
          :total="total"
          :current-page="currentPage"
          :page-sizes="[5, 10, 50, 100]"
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
import { rolesApi } from '@/api/manage'
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      keywords: '',
      total: 0,
      pageSize: 10,
      currentPage: 1,
      rolesList: []
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    getRoleList() {
      rolesApi.roleList({
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }).then(res => {
        this.rolesList = res.data.data
        this.total = res.data.count
      })
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getRoleList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getRoleList()
    },
    doSearch() {
      this.currentPage = 1
      this.getRoleList()
    },
    handleDelete(id) {
      this.$confirm('是否删除该角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'danger',
        center: true
      }).then(() => {
        rolesApi.delRole({ admin_role_id: id }).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getRoleList()
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
