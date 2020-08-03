<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
// import io from 'socket.io-client'
// import { getToken, getAdminId } from '@/utils/auth'

export default {
  name: 'App',
  data() {
    return {
    }
  },
  mounted() {
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

  }
}
</script>
