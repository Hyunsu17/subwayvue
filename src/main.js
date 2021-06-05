import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from './service/axios';
import VueCookies from 'vue-cookies';
import {BootstrapVue,IconsPlugin} from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import {
  ValidationObserver,
  ValidationProvider,
  extend,
  localize
} from "vee-validate";
import en from "vee-validate/dist/locale/en.json";
import * as rules from "vee-validate/dist/rules";

import {configure} from 'vee-validate'

configure({
  classes: {
    valid: 'is-valid',
    invalid: 'is-invalid'
  }
})

//��� rules�� ����Ҽ� �ְ� ���ִ� �ڵ�
Object.keys(rules).forEach(rule => {
  extend(rule, rules[rule]);
});

localize("en", en);

Vue.component("Validationobserver", ValidationObserver);
Vue.component("ValidationProvider", ValidationProvider);


// ���
Vue.component('myComponent', {
  template: '<div>����� ���� ������Ʈ �Դϴ�!</div>'
});

Vue.config.productionTip = false;
Vue.use(VueCookies);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
//Vue.use(VeeValidate, {})

Vue.prototype.axios = axios;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

