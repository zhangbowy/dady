<template>
  <div class="role-edit roles">
    <div class="title-info">
      <card-tag :tag-name="id!=''? '编辑角色': '新增角色'" />
    </div>
    <div class="form-info">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="top" size="small">
        <el-form-item label="角色名称" prop="admin_role_name">
          <el-input v-model="form.admin_role_name" style="width: 30%" disabled="" />
        </el-form-item>
        <el-form-item label="角色权限">
          <!-- <el-input v-model="form.name" style="width: 30%" /> -->
          <div class="permission-tree">
            <el-tree
              ref="tree"
              disabled
              :data="getRulesList"
              :default-checked-keys="defaultChecked"
              :props="defaultProps"
              default-expand-all
              show-checkbox
              node-key="id"
              @check="checkHandle"
            />
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="()=>this.$router.push({path:`/manage/roles/edit?id=${id}`})">编辑</el-button>
          <el-button @click="()=>this.$router.go(-1)">返回</el-button>
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
      authorityList: [],
      defaultChecked: [],
      form: {
        admin_role_name: '',
        authority_list: []
      },
      rules: {
        admin_role_name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
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
    // 获取角色详情
    async getRoleInfo(id) {
      await rolesApi.roleDetail({
        admin_role_id: id
      }).then(res => {
        this.form.admin_role_name = res.data.admin_role_name
        this.$refs.tree.setCheckedKeys(res.data.authority_list)
      })
    },
    // 提交check
    checkHandle(data) {
      const halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys().join(',')
      const checkedKeys = this.$refs.tree.getCheckedKeys().join(',')
      this.form.authority_list = checkedKeys
      if (halfCheckedKeys.length && checkedKeys.length === 0) {
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
          if (_this.form.id) {
            console.log(1)
            console.log(_this.form)
          } else {
            rolesApi.addRole(this.form).then(res => {
              this.$message({
                type: 'success',
                message: res.msg
              })
              _this.$router.go(-1)
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '创建失败'
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

