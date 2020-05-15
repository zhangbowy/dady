<template>
  <div class="role-edit">
    <div class="title-info">
      <card-tag :tag-name="id!=''? '编辑角色': '新增角色'" />
    </div>
    <div class="form-info">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="top" size="small">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" style="width: 30%" />
        </el-form-item>
        <el-form-item label="角色权限">
          <!-- <el-input v-model="form.name" style="width: 30%" /> -->
          <el-tree
            ref="tree"
            :data="getRulesList"
            :default-checked-keys="defaultChecked"
            :props="defaultProps"
            default-expand-all
            show-checkbox
            node-key="id"
            @check="checkHandle"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')">保存</el-button>
          <el-button @click="()=>this.$router.go(-1)">取消</el-button>
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
      roleInfo: {},
      authorityList: [],
      defaultChecked: [],
      form: {
        name: ''
      },
      rules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
      },
      defaultProps: {
        children: 'authority',
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
    this.id = this.$route.query.id ? this.$route.query.id : ''
    if (this.$route.query.id) {
      this.getRoleInfo(this.$route.query.id)
    }
    this.getPermission()
  },
  methods: {
    getPermission() {
      rolesApi.authorityList().then(res => {
        this.authorityList = res.data
      })
    },
    getRoleInfo() {

    },
    // 提交check
    checkHandle(data) {
      const halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys().join(',')
      const checkedKeys = this.$refs.tree.getCheckedKeys().join(',')
      if (halfCheckedKeys.length && checkedKeys.length) {
        this.temp.config = halfCheckedKeys + ',' + checkedKeys
      } else if (halfCheckedKeys.length && checkedKeys.length === 0) {
        this.temp.config = halfCheckedKeys
      } else if (halfCheckedKeys.length === 0 && checkedKeys.length) {
        this.temp.config = checkedKeys
      } else {
        this.temp.config = ''
      }
    },
    // 提交按钮
    onSubmit(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          if (_this.form.id) {
            console.log(1)
          } else {
            console.log(2)
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.role-edit{
  padding: 15px;
  .title-info{
    background: #fff;
    border-radius: 10px 10px;
  }
  .form-info{
    padding: 10px;
    background: #fff;
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
}
</style>
