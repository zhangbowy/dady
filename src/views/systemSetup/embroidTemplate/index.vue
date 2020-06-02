<template>
  <div class="embroid-template main-content">
    <!-- <div class="screen-box">
      <el-button size="small" icon="el-icon-plus" type="primary" @click="showDialog('add')">新增模板</el-button>
    </div> -->
    <div class="content">
      <el-tabs v-model="type" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="一般定制" name="1">
          <el-table
            v-loading="loading"
            :data="templates"
            style="width: 100%"
            fit
            highlight-current-row
            tooltip-effect="dark"
          >
            <el-table-column
              prop="template_name"
              label="模板名称"
              align="center"
            />
            <el-table-column
              label="模板图片"
              align="left"
            >
              <template slot-scope="scope">
                <div style="padding: 5px">
                  <img-upload
                    :img-data="scope.row.cover_image"
                    :pic-max="1"
                    @chooseImg="imageChoose($event, scope.row.emb_template_id)"
                  />
                </div>
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
                  @click="showDialog('detail', scope.row, scope.$index)"
                >详情</el-button>
                <!-- <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row.id)"
                >删除</el-button> -->
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="特殊定制" name="2">
          <el-table
            v-loading="loading"
            :data="templates"
            style="width: 100%"
            fit
            highlight-current-row
            tooltip-effect="dark"
          >
            <el-table-column
              prop="template_name"
              label="模板名称"
              align="center"
            />
            <el-table-column
              label="模板图片"
              align="left"
            >
              <template slot-scope="scope">
                <div style="padding: 5px">
                  <img-upload
                    :img-data="scope.row.cover_image"
                    :pic-max="1"
                    @chooseImg="imageChoose($event, scope.row.emb_template_id)"
                  />
                </div>
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
                  @click="showDialog('detail', scope.row, scope.$index)"
                >详情</el-button>
                <!-- <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row.id)"
                >删除</el-button> -->
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- 新增，详情，编辑弹框 -->
      <el-dialog center :title="dialogType=='add'? '新增模板': dialogType=='edit'? '编辑模板': '模板详情'" :visible.sync="dialogFormVisible">
        <el-form :model="form" label-position="top">
          <el-form-item label="模板名称" :label-width="formLabelWidth">
            <el-input v-model="form.template_name" disabled autocomplete="off" />
          </el-form-item>
          <el-form-item label="参数定价" :label-width="formLabelWidth">
            <el-row>
              <el-col v-for="(item,index) in form.emb_template_price" :key="index" :span="24">
                <el-input v-model="item.width" size="small" :disabled="!item.disabled" placeholder="宽" style="width: 25%">
                  <template slot="append">mm</template>
                </el-input>
                <el-input v-model="item.height" size="small" :disabled="!item.disabled" placeholder="高" style="width: 25%">
                  <template slot="append">mm</template>
                </el-input>
                <el-input v-model="item.price" size="small" :disabled="!item.disabled" placeholder="定价" style="width: 22%">
                  <template slot="append">元</template>
                </el-input>
                <el-button
                  v-if="item.disabled == true"
                  v-has="817"
                  size="small"
                  type="primary"
                  :disabled="dialogType=='detail'"
                  icon="el-icon-finished"
                  style="vertical-align: top;"
                  @click="saveEdit(form.emb_template_id,item)"
                >保存</el-button>
                <el-button
                  v-else
                  v-has="817"
                  size="small"
                  type="primary"
                  :disabled="dialogType=='detail'"
                  icon="el-icon-edit"
                  style="vertical-align: top;"
                  @click="editClick(item)"
                >编辑</el-button>
                <el-button
                  v-has="818"
                  size="small"
                  type="danger"
                  icon="el-icon-remove-outline"
                  style="vertical-align: top;margin: 0"
                  :loading="delLoading"
                  @click="deleteTemplate(item.id, item.emb_template_id)"
                >删除</el-button>
              </el-col>
              <el-col :span="24">
                <el-input v-model="addPriceForm.width" size="small" :disabled="dialogType=='detail'" placeholder="输入宽" style="width: 28%">
                  <template slot="append">mm</template>
                </el-input>
                <el-input v-model="addPriceForm.height" size="small" :disabled="dialogType=='detail'" placeholder="输入高" style="width: 28%">
                  <template slot="append">mm</template>
                </el-input>
                <el-input v-model="addPriceForm.price" size="small" :disabled="dialogType=='detail'" placeholder="输入定价" style="width: 28%">
                  <template slot="append">元</template>
                </el-input>
                <!-- <el-button size="small" style="vertical-align: top;" @click="addRules">添加</el-button> -->
                <el-button
                  v-has="817"
                  size="small"
                  type="primary"
                  :disabled="dialogType=='detail'"
                  icon="el-icon-circle-plus-outline"
                  style="vertical-align: top;"
                  :loading="addBtnLoading"
                  @click="addTemplate(form.emb_template_id)"
                >添加</el-button>
              </el-col>
            </el-row>

          </el-form-item>
          <el-form-item :label-width="formLabelWidth">
            <el-button v-if="dialogType==='detail'" v-has="816" type="primary" size="small" @click="dialogType = 'edit'">编辑价格</el-button>
            <el-button v-if="dialogType==='edit'" type="primary" size="small" @click="dialogType = 'detail'">模板详情</el-button>
            <el-button size="small" @click="dialogFormVisible = false">关闭</el-button>
            <!-- <el-button v-if="dialogType==='add' || dialogType==='edit'" size="small" type="primary" @click="dialogFormVisible = false">保存</el-button> -->
          </el-form-item>
        </el-form>

      </el-dialog>
    </div>
  </div>
</template>

<script>
import { embTemplate } from '@/api/system'
import ImgUpload from '@/components/ImgUpload' // 图片上传
export default {
  components: {
    ImgUpload
  },
  data() {
    return {
      loading: true,
      addBtnLoading: false,
      delLoading: false,
      btnLoading: '',
      templates: [],
      listIndex: '',
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        emb_template_price: [
          {
            width: '',
            height: '',
            price: ''
          }
        ]
      },
      addPriceForm: {
        id: '',
        name: '',
        width: '',
        height: '',
        price: ''
      },
      status: 0, // 是否调用澳洲接口
      formLabelWidth: '120px',
      dialogType: 'add',
      type: '1'
    }
  },
  created() {
    this.getEmbTemplate()
    // this.getSetting()
  },
  methods: {
    // 获取所有模板
    getEmbTemplate() {
      embTemplate.getEmbTemplate({
        template_type: this.type
      }).then(res => {
        this.loading = false
        this.templates = res.data
      }).catch(() => {
        this.loading = false
      })
    },
    getSetting() {
      embTemplate.getSetting().then((res) => {
        console.log(res)
      })
    },
    showDialog(type, row, index) {
      this.listIndex = index
      this.form = row
      this.dialogType = type
      this.dialogFormVisible = true
    },
    // tabs切换
    handleClick(tab, event) {
      this.type = tab.name
      this.getEmbTemplate()
    },
    handleDelete(id) {
      this.$confirm('是否删除该模板？', '提示', {
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
    },
    addTemplate(id) {
      this.addBtnLoading = true
      embTemplate.addTemplate({
        emb_template_id: id,
        name: '1',
        price: this.addPriceForm.price,
        width: this.addPriceForm.width,
        height: this.addPriceForm.height
      }).then(res => {
        this.getEmbTemplate()
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
          setTimeout(() => {
            // 初始化表单
            this.addPriceForm = {
              id: '',
              name: '',
              width: '',
              height: '',
              price: ''
            }
            this.addBtnLoading = false
            // 更新弹框数据
            this.form = this.templates[this.listIndex]
          }, 1000)
        }
      }).catch(() => {
        this.addBtnLoading = false
        this.$message({
          type: 'info',
          message: '保存失败!'
        })
      })
    },
    deleteTemplate(id, emb_template_id) {
      console.log(id, emb_template_id)
      this.delLoading = true
      embTemplate.deleteTemplate({
        id: id,
        template_id: emb_template_id
      }).then(res => {
        this.getEmbTemplate()
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          setTimeout(() => {
            // 更新弹框数据
            this.form = this.templates[this.listIndex]
            this.delLoading = false
          }, 1000)
        }
      })
    },
    // 图片选择上传
    imageChoose(imgArray, id) {
      if (imgArray.length !== 0) {
        embTemplate.changeCoverImg({
          id: id,
          template_type: this.type,
          cover_image: imgArray
        }).then(res => {
          console.log(res)
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: res.msg
            })
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '修改失败'
          })
        })
      }
    },
    // 编辑价格区间
    editClick(item) {
      this.$set(item, 'disabled', true)
    },
    // 保存编辑
    saveEdit(id, item) {
      embTemplate.editTemplate({
        emb_template_id: id,
        id: item.id,
        name: '1',
        price: item.price,
        width: item.width,
        height: item.height
      }).then(res => {
        this.getEmbTemplate()
        delete item.disabled
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '编辑成功!'
          })
        }
      }).catch(() => {
        this.addBtnLoading = false
        this.$message({
          type: 'info',
          message: '保存失败!'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.content{
  margin-top: 0;
  border: none;
}
</style>
