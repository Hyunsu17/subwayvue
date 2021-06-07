<template>
  <div id="app">
   <!-- <div id="nav">
        <p>
        <router-link to="/">Home</router-link>|
        <router-link to="/about">About</router-link>
        </p>
    </div>-->
    <router-view/>
  </div>
</template>

<script>
export default {
  methods:{
    isLogin(){
      return true;
    }
  },
  meta: [{name:'viewport',content:"width=device-width,user-scalable=yes, initial-scale=2.0"}]
  }
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
