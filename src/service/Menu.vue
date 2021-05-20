<template>
  <!-- Menu.vue -->
  <div id="example">
    <!-- <menu-bar></menu-bar> -->

    <b-card title="배치도" no-body>
      <b-card-header header-tag="nav">
        <b-nav card-header pills>
          <b-nav-item @click="routerLinkTo('seat')" :active="$router.currentRoute.name === 'seat'"><h4>개인석</h4></b-nav-item>
          <b-nav-item @click="routerLinkTo('studyroom')" :active="$router.currentRoute.name === 'studyroom'"><h4>스터디룸</h4></b-nav-item>
          <b-nav-item @click="routerLinkTo('locker')" :active="$router.currentRoute.name === 'locker'"><h4>사물함</h4></b-nav-item>
        </b-nav>
      </b-card-header>

      <b-card-body class="text-center">
        <router-view></router-view>
      </b-card-body>
    </b-card>    
  </div>
</template>

<script>
// import menuBar from './menu/menuBar.vue'

export default {
  name: 'Menu',
	// components: { menuBar },
	created() {
		// this.$store.state.process.eventBus.$on("menu", path => {

    //   if (path !== this.$router.currentRoute.name &&
    //     ":seat:studyroom:locker:".indexOf(":" + path + ":") >= 0) {
    //     // 페이지 이동
    //     this.$router.push(path);
    //   }
    // });
  },
  methods: {
    routerLinkTo (path) {
      if (path !== this.$router.currentRoute.name) {
        this.$router.push(path);
      }
    }
  }
}
</script>

<style scoped>
#example {
  margin: 0px;
  width: 1080px;
  padding: 0px;
  position: relative;
  font: 13px "verdana";
}
</style>