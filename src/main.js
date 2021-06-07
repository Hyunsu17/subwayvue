import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from './service/axios';
import VueCookies from 'vue-cookies';
import {BootstrapVue,IconsPlugin} from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import VueHead from 'vue-head'






// 등록
Vue.component('myComponent', {
  template: '<div>사용자 정의 컴포넌트 입니다!</div>'
});

Vue.config.productionTip = false;
Vue.use(VueCookies);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueHead);

Vue.prototype.axios = axios;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

