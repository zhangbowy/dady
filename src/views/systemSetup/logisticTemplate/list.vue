<template>
  <div class="logistics-template main-content">
    <div class="screen-box">
      <el-button size="small" icon="el-icon-plus" type="primary" @click="showDialog('add')">新增</el-button>
    </div>
    <div class="content">
      <el-table
        ref="multipleTable"
        :data="templates"
        style="width: 100%"
        fit
        highlight-current-row
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          prop="name"
          label="模板名称"
          align="center"
        />
        <el-table-column
          prop="company"
          label="物流公司"
          align="center"
        />
        <el-table-column
          label="配送数量"
          align="center"
        >
          <template slot-scope="scope">
            <p>首：{{ scope.row.firstNum }}{{ scope.row.unit }}</p>
            <p>续：{{ scope.row.lastNum }}{{ scope.row.unit }}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="配送费用"
          align="center"
        >
          <template slot-scope="scope">
            <p>首：{{ scope.row.firstprice }}元</p>
            <p>续：{{ scope.row.lastprice }}元</p>
          </template>
        </el-table-column>
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
        :total="total"
      />
    </div>
    <!-- 新增，详情，编辑弹框 -->
    <el-dialog center :title="dialogType=='add'? '新增物流模板': dialogType=='edit'? '编辑物流模板': '物流模板详情'" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="模板名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="物流公司" :label-width="formLabelWidth">
          <el-select v-model="form.companyId" placeholder="请选择物流公司" style="width: 100%">
            <el-option label="顺丰速运" value="1" />
            <el-option label="圆通快递" value="2" />
            <el-option label="中通快递" value="3" />
            <el-option label="韵达快递" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="计价方式" :label-width="formLabelWidth">
          <el-radio-group v-model="form.pieceType">
            <el-radio :label="1">按件数</el-radio>
            <el-radio :label="2">按重量</el-radio>
            <el-radio :label="3">按体积</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="配送方式" :label-width="formLabelWidth">
          <el-checkbox v-model="form.delivery">快递</el-checkbox>
        </el-form-item>
        <el-form-item label="快递件数设置" :label-width="formLabelWidth">
          <el-input v-model="form.firstNum" style="width: 48%">
            <template slot="prepend">{{ form.pieceType==1?'首件数': form.pieceType==2?'首重量':'首体积' }}</template>
            <template slot="append">{{ form.pieceType==1?'件': form.pieceType==2?'千克':'立方米' }}</template>
          </el-input>
          <el-input v-model="form.lastNum" style="width: 48%">
            <template slot="prepend">{{ form.pieceType==1?'续件数': form.pieceType==2?'续重量':'续体积' }}</template>
            <template slot="append">{{ form.pieceType==1?'件': form.pieceType==2?'千克':'立方米' }}</template>
          </el-input>
        </el-form-item>
        <el-form-item label="快递配送费用" :label-width="formLabelWidth">
          <el-input v-model="form.firstprice" style="width: 48%">
            <template slot="prepend">首体积费用</template>
            <template slot="append">元</template>
          </el-input>
          <el-input v-model="form.lastprice" style="width: 48%">
            <template slot="prepend">续体积费用</template>
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="满额包邮" :label-width="formLabelWidth">
          <el-radio-group v-model="form.freeType">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.freeType==1" label="包邮所需金额" :label-width="formLabelWidth">
          <el-input v-model="form.freePrice" style="width: 48%">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="区域限售" :label-width="formLabelWidth">
          <el-radio-group v-model="form.arealLimit">
            <el-radio :label="1">支持</el-radio>
            <el-radio :label="0">不支持</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogType==='add'" size="small" type="primary" @click="dialogFormVisible = false">确 定</el-button>
        <el-button v-else type="primary" size="small" @click="dialogType = 'edit'">编辑</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { categories } from '@/api/category'
export default {
  data() {
    return {
      total: 10,
      templates: [{
        id: 1,
        name: '物流模板1',
        company: '顺丰速运',
        firstNum: '1',
        lastNum: '10',
        unit: '千克',
        firstprice: '1',
        lastprice: '10'
      }, {
        id: 2,
        name: '物流模板2',
        company: '圆通快递',
        firstNum: '1',
        lastNum: '5',
        unit: '件',
        firstprice: '1',
        lastprice: '10'
      }, {
        id: 3,
        name: '物流模板3',
        company: '中通快递',
        firstNum: '2',
        lastNum: '8',
        unit: '公斤',
        firstprice: '1',
        lastprice: '10'
      }],
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        name: '',
        pid: '',
        desc: '',
        companyId: '',
        pieceType: 1, // 计件方式
        delivery: 0, // 配送方式
        freeType: 1, // 包邮
        freePrice: '', // 包邮金额
        arealLimit: 1 // 区域限售
      },
      formLabelWidth: '120px',
      dialogType: 'add'
    }
  },
  mounted() {
    // this.getCategores()
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 获取所有物流模板
    getCategores() {
      categories().then(res => {

      })
    },
    showDialog(type, id) {
      this.dialogType = type
      this.dialogFormVisible = true
      if (id) {
        // 请求物流模板详情
      }
    },
    handleClick(id) {
      console.log(id)
    },
    handleEdit(id) {
      console.log(id)
    },
    handleDelete(id) {
      this.$confirm('是否删除该物流模板?', '提示', {
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
