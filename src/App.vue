<template>
  <div id="app">
    <Menu/>
    <template v-if="$route.name === 'map'">
    <router-view/>
    </template>
    <template v-else>
    <div class="container">
      <div class="card boxes">
        <div class="card-top"></div>
          <div class="card-body">
          <transition name="component-fade" mode="out-in">
            <router-view/>
          </transition>
          </div>
        </div>
    </div>
  </template>
  </div>
</template>

<script>
import Menu from './components/Menu'
export default {
  name: 'App',
  components: {
    Menu
  },
  data(){
    return{
      menu:'others'
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: auto;
  padding-bottom: 30px;
}
a{
  color: #ffffff;
}
.container{

  max-width: 960px;
}
.card-top {
    width: inherit;
    height: 40px;
    background: #a73737;  /* fallback for old browsers */
    background-image: url("../static/img/banner.png");
    margin-bottom: 0px;

}
.card-body{
  padding: 1px;
}
.boxes{
  height: 100%;
  color:#000000;
  margin-top: 50px;
  border-color: #2c3e50;
}
.component-fade-enter-active, .component-fade-leave-active {
  transition: opacity .5s ease;
}
.component-fade-enter, .component-fade-leave-to
/* .component-fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
