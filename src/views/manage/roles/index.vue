<template>
  <router-view />
</template>

<script>
export default {

}
</script>

<style lang="scss">
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
.roles{
  .permission-tree {
    border: 1px solid #f2f2f2;
    padding: 10px 15px;
    border-radius: 5px;
  }
  .el-tree-node__children{
    .el-tree-node__content {
      float:left;
      width:228px;
    }
  }
}
</style>
