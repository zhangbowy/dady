<template>
  <div class="role-detail">
    <div class="title-info">
      <card-tag tag-name="角色详情" />
    </div>
  </div>
</template>

<script>
import CardTag from '@/components/CardTag'
export default {
  components: {
    CardTag
  },
  data() {
    return {
      id: '',
      roleInfo: {}
    }
  },
  created() {
    this.id = this.$route.query.id ? this.$route.query.id : ''
    if (this.$route.query.id) {
      this.getRoleInfo(this.$route.query.id)
    }
  },
  methods: {
    getRoleInfo() {

    }
  }
}
</script>

<style lang="scss" scoped>
.role-detail{
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
