<template>
  <div class="role-edit roles">
    <div class="title-info">
      <card-tag :tag-name="id!=''? `${$t('编辑角色')}`: `${$t('新增角色')}`" />
    </div>
    <div class="form-info">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="top" size="small">
        <el-form-item :label="$t('角色名称')" prop="admin_role_name">
          <el-input v-model="form.admin_role_name" style="width: 30%" />
        </el-form-item>
        <el-form-item :label="$t('角色权限')">
          <!-- <el-input v-model="form.name" style="width: 30%" /> -->
          <div v-loading="loading" class="permission-tree">
            <el-tree
              ref="tree"
              :data="getRulesList"
              :props="defaultProps"
              default-expand-all
              show-checkbox
              node-key="id"
              @check="checkHandle"
            />
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')">{{ $t('保存') }}</el-button>
          <el-button @click="()=>this.$router.go(-1)">{{ $t('取消') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import CardTag from '@/components/CardTag'
import { rolesApi } from '@/api/manage'
import tree from '@/utils/tree'
export default {
  components: {
    CardTag
  },
  data() {
    return {
      id: '',
      loading: false,
      authorityList: [],
      form: {
        admin_role_name: '',
        authority_list: []
      },
      rules: {
        admin_role_name: [{ required: true, message: `${this.$t('请输入角色名称')}`, trigger: 'blur' }]
      },
      defaultProps: {
        children: 'children',
        label: 'auth_name'
      }
    }
  },
  computed: {
    getRulesList() {
      return tree.listToTreeMulti(this.authorityList)
    }
  },
  created() {
    this.getPermission()
    this.id = this.$route.query.id ? this.$route.query.id : ''
    if (this.$route.query.id) {
      this.getRoleInfo(this.$route.query.id)
    }
  },
  methods: {
    // 获取权限列表
    async getPermission() {
      await rolesApi.authorityList().then(res => {
        this.authorityList = res.data
      })
    },
    loadNode(node, resolve) {
      console.log(node)

      resolve()
    },
    // 获取角色详情
    async getRoleInfo(id) {
      const _this = this
      this.loading = true
      await rolesApi.roleDetail({
        admin_role_id: id
      }).then(res => {
        this.form.admin_role_id = res.data.admin_role_id
        this.form.admin_role_name = res.data.admin_role_name
        this.form.authority_list = res.data.authority_list.join(',')
        setTimeout(() => {
          res.data.authority_list.forEach(value => {
            _this.$refs.tree.setChecked(value, true, false)
          })
          _this.loading = false
        }, 500)
      })
    },
    // 提交check
    checkHandle(data) {
      const halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys().join(',')
      const checkedKeys = this.$refs.tree.getCheckedKeys().join(',')
      if (halfCheckedKeys.length && checkedKeys.length) {
        this.form.authority_list = halfCheckedKeys + ',' + checkedKeys
      } else if (halfCheckedKeys.length && checkedKeys.length === 0) {
        this.form.authority_list = halfCheckedKeys
      } else if (halfCheckedKeys.length === 0 && checkedKeys.length) {
        this.form.authority_list = checkedKeys
      } else {
        this.form.authority_list = ''
      }
    },
    // 提交按钮
    onSubmit(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          if (_this.form.admin_role_id) {
            rolesApi.editRole(this.form).then(res => {
              this.$message({
                type: 'success',
                message: this.$t(res.msg)
              })
              _this.$router.go(-1)
            }).catch(() => {
              this.$message({
                type: 'info',
                message: `${this.$t('创建失败')}`
              })
            })
          } else {
            rolesApi.addRole(this.form).then(res => {
              this.$message({
                type: 'success',
                message: this.$t(res.msg)
              })
              _this.$router.go(-1)
            }).catch(() => {
              this.$message({
                type: 'info',
                message: `${this.$t('创建失败')}`
              })
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>
