<template>
  <div id="app">
    <router-view v-if="isRouteActive" />
  </div>
</template>

<script>
// import io from 'socket.io-client'
// import { getToken, getAdminId } from '@/utils/auth'
import { mapGetters } from 'vuex'
export default {
  name: 'App',
  data() {
    return {
      isRouteActive: true
    }
  },
  provide() {
    return {
      // 注入reload 方法
      reload: this.reload
    }
  },
  computed: {
    ...mapGetters(['lang'])
  },
  mounted() {
    document.documentElement.dataset.lang = this.lang
    // const WS_HOST = 'http://192.168.31.180:8001'
    // const msgSocket = io(`${WS_HOST}`, {
    //   // secure: true,
    //   path: '/socket.io'
    // })
    // msgSocket.on('open', function(socket) {
    //   console.log(msgSocket, socket)
    //   msgSocket.emit('sendInfo', {
    //     socketId: msgSocket.id,
    //     adm_sign: getToken(),
    //     adminId: getAdminId()
    //   })
    //   msgSocket.on('offline', function(socket) {
    //     console.log(socket)
    //   })
    // })
  },
  created() {

  },
  methods: {
    // 页面刷新
    reload() {
      this.isRouteActive = false
      this.$nextTick(() => {
        this.isRouteActive = true
      })
    }
  }
}
</script>

<style>
  ::-webkit-scrollbar {
    width: 5px;
    height: 10px;
  }
  ::-webkit-scrollbar-track-piece {
    background-color: rgba(0, 0, 0, 0.2);
    -webkit-border-radius: 6px;
  }

  ::-webkit-scrollbar-thumb:vertical {
    height: 5px;
    background-color: rgba(125, 125, 125, 0.7);
    -webkit-border-radius: 6px;
  }

  ::-webkit-scrollbar-thumb:horizontal {
    width: 5px;
    background-color: rgba(125, 125, 125, 0.7);
    -webkit-border-radius: 6px;
  }

</style>
