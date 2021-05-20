import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
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
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { unauthorized : true }
  },
  {
    path: '/about',
    name: 'about',
    children:[
      {
        path:'',
        component:MenuBar
      }
    ],
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path:'/signUp/:shpId',
    name: 'signUp',
    component: () => import(/* webpackChunkname: "signup" */ '../views/SignUp.vue'),
    meta: { unauthorized : true }
  },
  {
    path:'/authentication',
    name:'authentication',
    component: ()=>import(/*webpackChunkname: "authentication"*/ '../views/Authentication.vue'),
    meta: { unauthorized : true }
  }
  ,
  {
    path:'/selectStore/:exist',
    name:'selectStore',
    component: ()=>import(/*webpackChunkname: "selcetstore"*/ '../views/SelectStore.vue'),
    meta: { unauthorized : true }
  },
  {
    path:'/main/seat',
    name:'seat',
    component: ()=>import(/*webpackChunkname: "seat"*/ '../service/Seat.vue'),
    meta: { unauthorized : true }
  },
   {
     path:'/main/locker',
     name:'locker',
     component: ()=>import(/*webpackChunkname: "locker"*/ '../service/Locker.vue'),
     meta: { unauthorized : true }
    },
  {
    path:'/main/studyroom',
    name:'studyroom',
    component: ()=>import(/*webpackChunkname: "studyroom"*/ '../service/StudyRoom.vue'),
    meta: { unauthorized : true }
  },
  { path:'/main',
  name:'menu',
  component: ()=>import(/*webpackChunkname: "menu"*/ '../service/Menu.vue'),
  meta: { unauthorized : true }
}
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
});
/*
router.beforeEach( async(to, from, next) => {
  if(VueCookies.get('token')===null && VueCookies.get('refresh_token') !== null){
    await refreshToken();
  }
  if (to.matched.some(record => record.meta.unauthorized) || VueCookies.get('token') !== null){
    return next();
  }
  return next('/home');
 // console.log(to.matched.some(record => record.meta.unauthorized));
  //console.log(to.matched.some(record => record.name));
  //alert('로그인 해주세요');
  //return next('/login');
})
*/

export default router
