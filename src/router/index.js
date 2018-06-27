import Vue from 'vue'
import Router from 'vue-router'
import About from '@/components/About'
import Search from '@/components/Search'
import Data from '@/components/Data'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'About',
      component: About
    },
    {
      path: '/data',
      name: 'Data',
      component: Data
    },
    {
      path: '/search',
      name: 'Search',
      component: Search
    }
  ]
})
