<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img v-if="adminInfo.logo" :src="adminInfo.logo" class="user-avatar">
          <img v-else src="@/assets/images/avator.jpg" class="user-avatar">
          <span>{{ adminInfo.name }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item class="dropdown-item">
            <div v-if="adminInfo.role_type!=1" class="shop-info">
              店铺：<span>{{ adminInfo.shop_name }}</span>
            </div>
          </el-dropdown-item>
          <el-dropdown-item class="dropdown-item">
            <p>账号：{{ adminInfo.phone }}</p>
          </el-dropdown-item>
          <el-dropdown-item v-if="adminInfo.role_type!=1" class="dropdown-item">
            有效期：<span style="color: #f4516c">[{{ adminInfo.system_end_time }}]</span>
          </el-dropdown-item>
          <el-dropdown-item divided style="text-align:center" @click.native="showChange = true">
            修改密码
          </el-dropdown-item>
          <el-dropdown-item class="dropdown-item" divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <change-password
      v-model="showChange"
      @close="showChange = false"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ChangePassword from './ChangePassword'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ChangePassword
  },
  data() {
    return {
      showChange: false
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'adminInfo'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        position: relative;
        cursor: pointer;
        .user-avatar {
          width: 40px;
          height: 40px;
          display: inline-block;
          vertical-align: middle;
          border-radius: 40px;
        }
        span{
          display: inline-block;
          vertical-align: middle;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 20px;
          font-size: 12px;
        }
      }
    }

  }
}
.user-dropdown{
  .dropdown-item{
    text-align: center;
    p{
      height: auto;
      margin: 0
    }
  }
}

</style>
