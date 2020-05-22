<template>
  <div class="customizable main-content">
    <div class="screen-box">
      <div class="operation">
        <el-button v-has="807" size="small" icon="el-icon-plus" type="primary" @click="showDialog('add')">新增</el-button>
      </div>
    </div>
    <div class="content">
      <el-table
        v-loading="loading"
        :data="categoryList"
        style="width: 100%"
        fit
        highlight-current-row
        tooltip-effect="dark"
      >
        <el-table-column
          label="序号"
          align="center"
          width="100"
          type="index"
        />
        <el-table-column
          label="背景图片"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <img :src="scope.row.design_bg" alt="" width="60" height="60">
          </template>
        </el-table-column>
        <el-table-column
          prop="custom_category_name"
          label="名称"
          align="center"
        />
        <el-table-column
          label="关联机器"
          align="center"
        >
          <template slot-scope="scope">
            <span v-for="(item,index) in scope.row.machine" :key="item.machine_id">{{ item.machine_name }} {{ scope.row.machine.length-1!==index?'、':'' }} </span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          label="广告位状态"
          align="center"
          width="250"
        >
          <template slot-scope="scope">
            <el-tag :type="scope.row.del | statusFilter">{{ scope.row.del==0?'已打烊':'营业中' }}</el-tag>
          </template>
        </el-table-column> -->
        <el-table-column
          prop="created_at"
          label="创建时间"
          align="center"
        />
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click.native="showDialog('detail', scope.row)"
            >查看</el-button>
            <el-button
              v-has="810"
              size="mini"
              type="primary"
              @click.native="showRelation(scope.row)"
            >关联机器</el-button>
            <el-button
              v-has="809"
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.custom_category_id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog center :title="dialogType=='add'? '新增分类': dialogType=='edit'? '编辑分类': '分类详情'" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="left" size="small">
        <el-form-item label="分类名称" prop="custom_category_name">
          <el-input v-model="form.custom_category_name " :disabled="dialogType=='detail'" />
        </el-form-item>
        <el-form-item label="背景图片" prop="design_bg">
          <img-upload
            :img-data="form.design_bg"
            :pic-max="1"
            :disabled="dialogType=='detail'"
            @chooseImg="imageChoose"
          />
        </el-form-item>
        <el-form-item v-if="form.design_bg" label="定制区域">
          <div class="text-event" :style="{backgroundImage: `url(${form.design_bg})`}">
            <vue-draggable-resizable
              :w="form.design_width"
              :h="form.design_height"
              :x="form.design_left"
              :y="form.design_top"
              :min-width="1"
              :min-height="1"
              :max-width="150"
              :max-height="150"
              :parent="true"
              :grid="[1,1]"
              class-name="drag-area"
              @dragging="onDrag"
              @resizing="onResize"
            >
              <p>
                left: {{ form.design_left }} / top: {{ form.design_top }} - Width: {{ form.design_width }} / Height: {{ form.design_height }}
              </p>
            </vue-draggable-resizable>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button v-if="dialogType!=='detail'" v-has="807" type="primary" @click="onSubmit('form')">保存</el-button>
          <el-button v-else v-has="808" type="primary" @click="dialogType='edit'">编辑</el-button>
          <el-button @click="dialogFormVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 关联设备弹框 -->
    <el-dialog center title="关联机器" :visible.sync="relationMachine">
      <el-select v-model="checkedMachine" size="mini" placeholder="选择机器">
        <el-option
          v-for="item in machineList"
          :key="item.machine_id"
          :label="item.machine_name"
          :value="item.machine_id"
          :disabled="item.disabled"
        />
      </el-select>
      <el-button v-has="810" type="primary" size="mini" @click="addMachine()">添加</el-button>
      <el-table :data="itemMachine" empty-text="未绑定机器">
        <el-table-column property="machine_code" label="机器码" width="150" />
        <el-table-column property="machine_name" label="机器名称" width="200" />
        <el-table-column property="desc" label="描述" />
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              v-has="811"
              size="mini"
              type="danger"
              @click="deleteMachine(scope.row.machine_id)"
            >解除关联</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { customCateApi, machineApi } from '@/api/system'
import ImgUpload from '@/components/ImgUpload'
import VueDraggableResizable from 'vue-draggable-resizable'
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
export default {
  components: {
    ImgUpload,
    VueDraggableResizable
  },
  data() {
    return {
      loading: true,
      baseUrl: process.env.VUE_APP_BASE_API,
      categoryList: [],
      machineList: [], // 机器列表
      dialogFormVisible: false, // form表单弹框
      relationMachine: false, // 关联设备弹框
      form: {
        custom_category_name: '', // 分类名称
        design_bg: '', // 背景图片
        design_width: 150, // 设计区域宽度
        design_height: 150, // 设计区域高度
        design_top: 0, // x轴距离
        design_left: 0, // y轴距离
        design_bg_width: 375, // 背景宽度
        design_bg_height: 375 // 背景高度
      },
      rules: {
        custom_category_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ],
        design_bg: [
          { required: true, message: '请上传分类图片', trigger: 'blur' }
        ]
      },
      dialogType: 'add',
      itemMachine: [], // 分类绑定的机器列表
      checkedItem: {}, // 关联设备按钮选中的分类信息
      checkedMachine: '' // select选中的设备
    }
  },
  watch: {
    dialogFormVisible(val) {
      if (val === false) {
        this.$refs['form'].resetFields()
        this.form = {
          custom_category_name: '',
          design_bg: '',
          design_width: 150, // 设计区域宽度
          design_height: 150, // 设计区域高度
          design_top: 0, // x轴距离
          design_left: 0, // y轴距离
          design_bg_width: 375, // 背景宽度
          design_bg_height: 375 // 背景高度
        }
      }
    },
    relationMachine(val) {
      if (val === false) {
        this.itemMachine = [] // 分类绑定的机器列表
        this.checkedItem = {} // 关联设备按钮选中的分类信息
        this.checkedMachine = '' // select选中的设备
      }
    }
  },
  created() {
    this.fetchData()
    this.getMachineList()
  },
  methods: {
    fetchData() {
      // 获取分类列表
      customCateApi.getCategoryList().then(res => {
        this.loading = false
        this.categoryList = res.data
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取所有机器
    getMachineList() {
      machineApi.getMachine().then(res => {
        this.machineList = res.data.data
      })
    },
    showDialog(type, form) {
      this.dialogType = type
      this.dialogFormVisible = true
      if (form && form.custom_category_id) {
        // 请求分类详情
        this.form.custom_category_id = form.custom_category_id
        this.form.custom_category_name = form.custom_category_name
        this.form.design_width = form.design_width // 设计区域宽度
        this.form.design_height = form.design_height// 设计区域高度
        this.form.design_top = form.design_top // x轴距离
        this.form.design_left = form.design_left // y轴距离
        this.form.design_bg = form.design_bg
      }
    },
    // 显示关联设备弹框
    showRelation(row) {
      this.relationMachine = true
      this.checkedItem = row
      this.getMachineById(row.custom_category_id)
    },
    // 根据分类id获取设备
    getMachineById(id) {
      customCateApi.getMachineById({
        custom_category_id: id
      }).then(res => {
        this.itemMachine = res.data
      })
    },
    // 为分类添加设备
    addMachine() {
      customCateApi.relationMachine({
        custom_category_id: this.checkedItem.custom_category_id,
        machine_id: this.checkedMachine
      }).then(res => {
        this.$message({
          type: 'success',
          message: '添加成功!'
        })
        this.fetchData()
        this.getMachineById(this.checkedItem.custom_category_id)
      })
    },
    deleteMachine(id) {
      this.$confirm('是否解除绑定设备?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'danger'
      }).then(() => {
        customCateApi.unRelationMachine({
          custom_category_id: this.checkedItem.custom_category_id,
          machine_id: id
        }).then(res => {
          this.$message({
            type: 'success',
            message: '解除成功!'
          })
          this.fetchData()
          this.getMachineById(this.checkedItem.custom_category_id)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消！'
        })
      })
    },
    onSubmit(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          if (_this.form.custom_category_id) {
            customCateApi.editCustomCate(_this.form).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: res.msg || '修改成功!'
                })
                // 重置表单
                _this.$refs[formName].resetFields()
                this.dialogFormVisible = false
                this.fetchData()
              } else {
                this.$message.success(res.msg || '修改失败!')
              }
            })
          } else {
            customCateApi.addCustomCate(_this.form).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: res.msg || '添加成功!'
                })
                // 重置表单
                _this.$refs[formName].resetFields()
                this.dialogFormVisible = false
                this.fetchData()
              } else {
                this.$message.success(res.msg || '添加失败!')
              }
            })
          }
        } else {
          return false
        }
      })
    },

    // 图片上传模块
    imageChoose(img) {
      this.form.design_bg = img
      this.$refs.form.validateField('design_bg')
    },

    handleDelete(id) {
      this.$confirm('是否删除该分类?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'danger'
      }).then(() => {
        customCateApi.deleteAdsense({ custom_category_id: id }).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.fetchData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 调整大小
    onResize(x, y, width, height) {
      this.form.design_left = x
      this.form.design_top = y
      this.form.design_width = width
      this.form.design_height = height
    },
    // 拖动
    onDrag(x, y) {
      this.form.design_left = x
      this.form.design_top = y
    }
  }
}
</script>

<style lang="scss" scoped>
.customizable{
  .screen-box{
    .screen-item{
      text-align: left;
    }
  }
  .operation{
    position: relative;
    top: 0;
    right: 0;
  }
  .text-event {
    height: 375px;
    width: 375px;
    border: 1px solid #f5f5f5;
    position: relative;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    .drag-area{
      border: 1px solid #f5f5f5;
      color: #fff;
      background: #0084ff3b;
    }

  }
}
</style>

