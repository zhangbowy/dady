<template>
  <div class="platform-setting">
    <!-- <el-form>
      <div class="form-content-item">
        <div class="block-title"><card-tag :tag-name="$t('平台设置')" /></div>
        <div class="block-content">
          <el-form-item label="是否调用澳洲api">
                <el-switch
                  v-model="is_request_wilcom"
                  class="changes-status"
                  :active-value="1"
                  :inactive-value="0"
                  disabled
                  @click.native="switchTab()"
                />
              </el-form-item>
        </div>
      </div>
    </el-form> -->
    <el-tabs v-model="type" type="border-card" @tab-click="handleClick">
      <el-tab-pane :label="$t('澳洲api')" name="1">
        <el-form>
          <el-form-item label="是否调用澳洲api">
            <el-switch
              v-model="is_request_wilcom"
              class="changes-status"
              :active-value="1"
              :inactive-value="0"
              disabled
              @click.native="switchTab()"
            />
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane :label="$t('绣线颜色对照表')" name="2">
        <div class="screen-box">
          <el-button size="small" icon="el-icon-upload2" type="primary" @click="exportTemplate">{{ $t('导出') }}</el-button>
          <el-button size="small" icon="el-icon-download" type="primary" @click="showImportDialog">{{ $t('导入') }}</el-button>
        </div>
        <el-table
          v-loading="loading"
          :data="colorList"
          style="width: 100%"
          fit
          row-key="id"
          highlight-current-row
          default-expand-all
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >
          <el-table-column
            prop="color_name"
            :label="$t('颜色名称')"
            align="center"
            width="200"
          />
          <el-table-column
            :label="$t('RGB色值')"
            align="center"
          >
            <template slot-scope="scope">
              <div :style="{background: `rgb(${scope.row.rgb})`, color: '#fff'}">{{ scope.row.rgb }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="code"
            :label="$t('颜色代码')"
            align="center"
          />
          <el-table-column
            prop="brand"
            :label="$t('品牌')"
            align="center"
            width="200"
          />
        </el-table>
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
      </el-tab-pane>
    </el-tabs>
    <el-dialog v-dialogDrag :visible.sync="importDialogVisible" class="upload-xlsx-dialog">
      <el-upload
        ref="upload"
        class="upload-xlsx"
        :action="`${ baseUrl }/system/addEmbColor`"
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
</template>

<script>
// import CardTag from '@/components/CardTag'
import { settingApi, embColorTable } from '@/api/system'
import { getToken } from '@/utils/auth'
export default {
  components: {
    // CardTag
  },
  inject: ['reload'],
  data() {
    return {
      is_request_wilcom: 0,
      type: '1',
      pageSize: 10,
      currentPage: 1,
      total: 0,
      colorList: [],
      loading: false,
      importDialogVisible: false,
      baseUrl: process.env.VUE_APP_BASE_API,
      token: getToken(),
      fileList: []
    }
  },
  created() {
    this.getSetting()
  },
  methods: {
    showImportDialog() {
      this.importDialogVisible = true
    },
    uploadSuccess(res) {
      if (res.code === 0) {
        this.$message({
          showClose: true,
          message: this.$t(...res.msg),
          type: 'success'
        })
        this.reload()
      } else {
        this.$message({
          showClose: true,
          message: this.$t(...res.msg),
          type: 'error'
        })
      }
    },
    submitUpload() {
      this.$refs['upload'].submit()
    },
    // 导出模板
    exportTemplate() {
      window.open(this.baseUrl + '/system/exportEmbColor')
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.getColorList()
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.getColorList()
    },
    handleClick() {},
    getSetting() {
      settingApi.getSetting().then(res => {
        this.is_request_wilcom = res.data.is_request_wilcom
      })
      this.getColorList()
    },
    getColorList() {
      this.loading = true
      embColorTable.getColorTable({
        pageSize: this.pageSize,
        currentPage: this.currentPage
      }).then((res) => {
        console.log(res)
        if (res.code === 0) {
          this.colorList = res.data.data
          this.total = res.data.count
          this.loading = false
        }
      }).catch(this.loading = false)
    },
    switchTab() {
      this.$confirm(`${this.is_request_wilcom === 0 ? `${this.$t('开启后')}, ${this.$t('手绘定制将调用澳洲api生成刺绣图案！')}` : `${this.$t('是否关闭调用澳洲接口')}`}`, `${this.$t('提示')}`, {
        confirmButtonText: `${this.$t('确定')}`,
        cancelButtonText: `${this.$t('取消')}`,
        type: 'warning',
        confirmButtonClass: 'danger'
      }).then(() => {
        settingApi.editSetting({ key: 'is_request_wilcom', value: this.is_request_wilcom === 0 ? 1 : 0 }).then(res => {
          this.$message({
            type: 'success',
            message: this.$t(...res.msg)
          })
          this.is_request_wilcom === 0 ? this.is_request_wilcom = 1 : this.is_request_wilcom = 0
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: `${this.$t('已取消')}!`
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.platform-setting{
  padding: 10px;
  .form-content-item{
      margin-bottom: 20px;
      box-shadow: 0px 10px 20px #f3f4f3;
      .block-content{
        padding: 10px 30px 20px;
        background: #fff;
        .el-input{
          width: 50%;
        }
      }
    }
}
.changes-status.el-switch.is-disabled {
  opacity: 1;
  .el-switch__core {
    cursor: pointer;
  }
}
// 分页样式
  .pagination-box{
    text-align: right;
    background: #fff;
    padding: 10px;
  }
  .screen-box {
    margin-bottom: 10px;
    padding-bottom: 10px;
    display: flex;
    justify-content: flex-end;
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
