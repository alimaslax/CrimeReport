import Vue from 'vue'
import Router from 'vue-router'
import About from '@/components/About'
import Search from '@/components/Search'
import Data from '@/components/Data'
import Map from '@/components/Map'
import Records from '@/components/Records'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'about',
      component: About
    },
    {
      path: '/data',
      name: 'data',
      component: Data
    },
    {
      path: '/search',
      name: 'search',
      component: Search
    },
    {
      path: '/map',
      name: 'map',
      component: Map
    },
    {
      path: '/records',
      name: 'record',
      component: Records
    }
  ]
})
