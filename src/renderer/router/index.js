import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes: [
    // {path: '/', name: 'landing-page', component: require('@/components/LandingPage').default},
    { path: '/', name: 'hello', component: () => import('view/hello'), meta: { title: 'hello', icon: '' }, },
    { path: '*', redirect: '/' }
  ]
})
