import Vue from 'vue'
import Router from 'vue-router'
// import Home from './views/Home.vue'
import Pos from '@/views/page/Pos.vue'
// import Main from '@/views/page/Main.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Pos',
      component: Pos
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // }
  ]
})
