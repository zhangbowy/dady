<template>
  <div class="embroid-template main-content">
    <div class="screen-box">
      <!-- <el-button size="small" icon="el-icon-plus" type="primary" @click="showDialog('add')">{{ $t('新增模板') }}</el-button> -->
      <el-button size="small" icon="el-icon-upload2" type="primary" @click="exportTemplate">{{ $t('导出') }}</el-button>
      <el-button size="small" icon="el-icon-download" type="primary" @click="showImportDialog">{{ $t('导入') }}</el-button>
    </div>
    <div class="content">
      <el-tabs v-model="type" type="border-card" @tab-click="handleClick">
        <el-tab-pane :label="$t('一般定制')" name="1">
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
              :label="$t('模板名称')"
              align="center"
            />
            <el-table-column
              :label="$t('模板图片')"
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
              :label="$t('操作')"
              align="center"
              width="250"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="showDialog('detail', scope.row, scope.$index)"
                >{{ $t('详情') }}</el-button>
                <!-- <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row.id)"
                >{{ $t('删除') }}</el-button> -->
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane :label="$t('特殊定制')" name="2">
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
              :label="$t('模板名称')"
              align="center"
            />
            <el-table-column
              :label="$t('模板图片')"
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
              :label="$t('操作')"
              align="center"
              width="250"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="showDialog('detail', scope.row, scope.$index)"
                >{{ $t('详情') }}</el-button>
                <!-- <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row.id)"
                >{{ $t('删除') }}</el-button> -->
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- 新增，详情，编辑弹框 -->
      <el-dialog v-dialogDrag center :title="dialogType=='add'? $t('新增模板'): dialogType=='edit'? `${$t('编辑模板')}`: `${$t('模板详情')}`" :visible.sync="dialogFormVisible">
        <el-form :model="form" label-position="top">
          <el-form-item :label="$t('模板名称')" :label-width="formLabelWidth">
            <el-input v-model="form.template_name" disabled autocomplete="off" style="width: 50%" />
          </el-form-item>
          <el-form-item :label="$t('参数定价')" :label-width="formLabelWidth">
            <div slot="label" class="from-label">
              <span>{{ $t('参数定价') }}</span>
              <div class="from-label_sort">
                <el-select v-model="sortType" :placeholder="$t('请选择活动区域')" size="mini">
                  <el-option v-for="sortItem in sortTypeList" :key="sortItem.value" :label="`${$t(sortItem.name)}`" :value="sortItem.value" />
                </el-select>
                <el-radio-group v-model="sortMode" size="mini">
                  <el-radio-button :label="true">
                    <i class="el-icon-top" />
                  </el-radio-button>
                  <el-radio-button :label="false">
                    <i class="el-icon-bottom" />
                  </el-radio-button>
                </el-radio-group>
              </div>
            </div>
            <el-row>
              <el-col v-for="(item,index) in form.emb_template_price" :key="index" :span="24">
                <el-input v-model="item.width" size="small" :disabled="!item.disabled" :placeholder="$t('宽')" style="width: 25%">
                  <template slot="append">mm</template>
                </el-input>
                <el-input v-model="item.height" size="small" :disabled="!item.disabled" :placeholder="$t('高')" style="width: 25%">
                  <template slot="append">mm</template>
                </el-input>
                <el-input v-model="item.price" size="small" :disabled="!item.disabled" :placeholder="$t('定价')" style="width: 25%">
                  <template slot="append">{{ $t('元') }}</template>
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
                >{{ $t('保存') }}</el-button>
                <el-button
                  v-else
                  v-has="817"
                  size="small"
                  type="primary"
                  :disabled="dialogType=='detail'"
                  icon="el-icon-edit"
                  style="vertical-align: top;"
                  @click="editClick(item)"
                >{{ $t('编辑') }}</el-button>
                <el-button
                  v-has="818"
                  size="small"
                  type="danger"
                  :disabled="dialogType=='detail'"
                  icon="el-icon-remove-outline"
                  style="vertical-align: top;margin: 0"
                  :loading="delLoading"
                  @click="deleteTemplate(item.id, item.emb_template_id)"
                >{{ $t('删除') }}</el-button>
              </el-col>
              <el-col :span="24">
                <el-input v-model="addPriceForm.width" size="small" :disabled="dialogType=='detail'" :placeholder="$t('输入宽')" style="width: 25%">
                  <template slot="append">mm</template>
                </el-input>
                <el-input v-model="addPriceForm.height" size="small" :disabled="dialogType=='detail'" :placeholder="$t('输入高')" style="width: 25%">
                  <template slot="append">mm</template>
                </el-input>
                <el-input v-model="addPriceForm.price" size="small" :disabled="dialogType=='detail'" :placeholder="$t('输入定价')" style="width: 25%">
                  <template slot="append">{{ $t('元') }}</template>
                </el-input>
                <!-- <el-button size="small" style="vertical-align: top;" @click="addRules">{{ $t('添加') }}</el-button> -->
                <el-button
                  v-has="817"
                  size="small"
                  type="primary"
                  :disabled="dialogType=='detail'"
                  icon="el-icon-circle-plus-outline"
                  style="vertical-align: top;"
                  :loading="addBtnLoading"
                  @click="addTemplate(form.emb_template_id)"
                >{{ $t('添加') }}</el-button>
              </el-col>
            </el-row>

          </el-form-item>
          <el-form-item :label-width="formLabelWidth">
            <el-button v-if="dialogType==='detail'" v-has="816" type="primary" size="small" @click="dialogType = 'edit'">{{ $t('编辑定价') }}</el-button>
            <el-button v-if="dialogType==='edit'" type="primary" size="small" @click="dialogType = 'detail'">{{ $t('编辑完成') }}</el-button>
            <el-button size="small" @click="dialogFormVisible = false">{{ $t('关闭') }}</el-button>
            <!-- <el-button v-if="dialogType==='add' || dialogType==='edit'" size="small" type="primary" @click="dialogFormVisible = false">{{ $t('保存') }}</el-button> -->
          </el-form-item>
        </el-form>
      </el-dialog>

      <el-dialog v-dialogDrag :visible.sync="importDialogVisible" class="upload-xlsx-dialog">
        <el-upload
          ref="upload"
          class="upload-xlsx"
          :action="`${ baseUrl }/system/uploadEmbPrice`"
          :limit="1"
          :headers="{'adm_sign': token}"
          :file-list="fileList"
          :auto-upload="false"
          :on-success="uploadSuccess"
          name="excel"
          accept=".xlsx,.xls"
          multiple
        >
          <el-button size="small" type="primary">{{ $t('导入文件') }}</el-button>
          <div slot="tip" class="el-upload__tip">{{ $t('只能上传xlsx, xls文件') }}</div>
        </el-upload>
        <div class="btns-group">
          <el-button @click="importDialogVisible = false">
            {{ $t('取消') }}
          </el-button>
          <el-button type="primary" @click="submitUpload">
            {{ $t('确定') }}
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { embTemplate } from '@/api/system'
import ImgUpload from '@/components/ImgUpload' // 图片上传
import { getToken } from '@/utils/auth'
export default {
  components: {
    ImgUpload
  },
  inject: ['reload'],
  data() {
    return {
      loading: true,
      addBtnLoading: false,
      delLoading: false,
      btnLoading: '',
      templates: [],
      token: getToken(),
      listIndex: '',
      dialogTableVisible: false,
      dialogFormVisible: false,
      baseUrl: process.env.VUE_APP_BASE_API,
      importDialogVisible: false,
      fileList: [],
      sortType: 'width', // 排序类型
      sortMode: false, // 排序模式 false 为从小到大
      sortTypeList: [
        {
          value: 'width',
          name: '宽'
        },
        {
          value: 'height',
          name: '高'
        },
        {
          value: 'price',
          name: '价格'
        }
      ],
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
  watch: {
    sortType: {
      handler(newVlaue, oldValue) {
        this.sort()
      }
    },
    sortMode: {
      handler(newVlaue, oldValue) {
        this.sort()
      }
    }
  },
  created() {
    this.getEmbTemplate()
    // this.getSetting()
  },
  methods: {
    sort() {
      let list = this.form.emb_template_price || []
      list = list.sort((a, b) => {
        return this.sortMode ? (b[this.sortType] - a[this.sortType]) : (a[this.sortType] - b[this.sortType])
      })
      this.form = Object.assign({}, this.form, { emb_template_price: list })
    },
    uploadSuccess(res) {
      if (res.code === 0) {
        this.$message({
          showClose: true,
          message: this.$t(res.msg),
          type: 'success'
        })
        this.reload()
      } else {
        this.$message({
          showClose: true,
          message: this.$t(res.msg),
          type: 'error'
        })
      }
    },
    submitUpload() {
      this.$refs['upload'].submit()
    },
    showImportDialog() {
      this.importDialogVisible = true
    },
    // 导出模板
    exportTemplate() {
      window.open(this.baseUrl + '/system/exportEmbPrice')
    },
    importTemplate(e) {
      const formData = new FormData()
      formData.append('excel', e.file)
      formData.append('template_id', 2)
      const loading = this.$loading({
        lock: true,
        text: `${this.$t('文件上传中')}`,
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.5)'
      })
      embTemplate.importTemplate(formData).then(data => {
        loading.close()
        this.reload()
      }).catch(() => {
        loading.close()
      })
    },
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
      this.sort()
      this.dialogFormVisible = true
    },
    // tabs切换
    handleClick(tab, event) {
      this.type = tab.name
      this.getEmbTemplate()
    },
    handleDelete(id) {
      this.$confirm(`${this.$t('是否删除该模板')}?`, `${this.$t('提示')}`, {
        confirmButtonText: `${this.$t('确定')}`,
        cancelButtonText: `${this.$t('取消')}`,
        type: 'warning',
        confirmButtonClass: 'danger',
        center: true
      }).then(() => {
        this.$message({
          type: 'success',
          message: `${this.$t('删除成功')}!`
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: `${this.$t('已取消删除')}`
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
            message: `${this.$t('保存成功')}!`
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
          message: `${this.$t('保存失败')}!`
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
            message: `${this.$t('删除成功')}!`
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
              message: this.$t(res.msg)
            })
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: `${this.$t('修改失败')}`
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
            message: `${this.$t('编辑成功')}!`
          })
        }
      }).catch(() => {
        this.addBtnLoading = false
        this.$message({
          type: 'info',
          message: `${this.$t('保存失败')}!`
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
.screen-box {
  margin-bottom: 10px;
  padding-bottom: 10px;
  // display: flex;
}
.upload-xlsx-dialog {
  .el-dialog__body {
    display: flex !important;
    flex-direction: column !important;
  }
  .btns-group {
    margin-top: 10px;
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
}
::v-deep .el-form--label-top .el-form-item__label {
  width: 100%;
  padding-right: 40px;
}
.from-label {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
