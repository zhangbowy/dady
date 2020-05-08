<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import io from 'socket.io-client'

export default {
  name: 'App',
  data() {
    return {
    }
  },
  mounted() {
    const socket = io('http://192.168.31.180:8001', {
      path: '/socket.io'
    })
    socket.on('open', (socket) => {
      debugger
    })

    socket.on('offline', (socket) => {
      debugger
    })
  },
  created() {

  }
}
</script>
