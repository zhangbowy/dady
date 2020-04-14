<template>
  <div class="goods-list main-content">
    <div class="screen-box">
      <div class="screen-item">
        <el-input
          v-model="keywords"
          placeholder="请输入关键词"
          clearable
          style="width:220px"
        />
        <el-button icon="el-icon-search" type="primary">搜索</el-button>
      </div>
      <div class="operation">
        <router-link :to="'/commodity/goods/edit'">
          <el-button icon="el-icon-plus" type="primary">新增</el-button>
        </router-link>
      </div>
    </div>
    <div class="content">
      <el-table
        ref="multipleTable"
        :data="goodsList"
        style="width: 100%"
        fit
        highlight-current-row
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          label="商品图片"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <img :src="scope.row.img" alt="" width="60" height="60">
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="商品标题"
          align="center"
        />
        <el-table-column
          prop="salesVolume"
          label="销量"
          align="center"
          sortable
        />
        <el-table-column
          label="状态"
          align="center"
          width="250"
        >
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status==0?'未发布':'已上架' }}</el-tag>
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
            <router-link :to="`/commodity/goods/detail?id=${scope.row.id}`">
              <el-button
                size="mini"
              >查看</el-button>
            </router-link>
            <router-link :to="`/commodity/goods/edit?id=${scope.row.id}`">
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
        :total="goodsList.length"
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
      goodsList: [{
        id: 1,
        img: 'http://img.tecqm.cn/upload_375541a0001c9e4b09d48086a71965ac.jpg',
        title: '苹果xs',
        desc: '苹果xs手机',
        create_time: '2020-4-14 15:40:28',
        price: '10',
        salesVolume: 100,
        status: 0,
        update_time: '2020-4-14 15:47:28'
      }],
      multipleSelection: []
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleDelete(id) {
      this.$confirm('是否删除该商品?', '提示', {
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
.goods-list{
  .screen-box{
    .screen-item{
      text-align: left;
    }
  }
}

</style>
