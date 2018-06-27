<template>
  <div id="app">
    <Menu/>
    <div class="container">
      <div class="card boxes border border-primary">
        <div class="row">
    <div class="col-sm">
      <img class="card-img-top" src="static/img/logo.png" alt="Card image cap"></img>
    </div>
    <div class="col-sm" style="padding-right:0px;">
      <img class="card-img-top" src="static/img/logo.png" alt="Card image cap"></img>
    </div>
  </div>
          <div class="card-body">
            <router-view/>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import Menu from './components/Menu'
export default {
  name: 'App',
  components: {
    Menu
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
  background-color: #00477A;
  margin-top: 60px;
  padding-top: 30px;
  padding-bottom: 30px;
}
a{
  color: #ffffff;
}
@media (min-width: 992px) {
  body {
    padding-top: 56px;
  }
}
.card-img-top {
    width: 40px;
    height: 40px;
    object-fit: cover;
}
.boxes{
  height: 100%;
  color:#000000;
}
</style>
