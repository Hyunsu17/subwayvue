import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import MenuBar from '../views/Menu.vue'

//import { refreshToken } from '../service/login'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    children:[
      {
        path:'',
        component:MenuBar
      }
    ]
  }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
});



export default router
