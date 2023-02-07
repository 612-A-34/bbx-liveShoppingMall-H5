<template>
  <div id="app">
    <div id="nav">
      <Loading v-show="LOADING"></Loading>
      <router-link to="/"></router-link>
      <!-- <router-link to="/about">About</router-link> -->
    </div>
    <router-view />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Loading from '@/components/loading/loading'
export default {
  data () {
    return {
      goflase: false,
      sharesomthing:{
        title:"",
        imgUrl:"",
        desc:"",
      }
      
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {},
  computed: {
    ...mapState(['LOADING']),
  },
  name: 'App',
  components: { Loading },
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
