<template>
  <div id="menu">
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
    <div class="container">
      Boston Police Department
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarResponsive">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <router-link to="/">About</router-link>
          </li>
          <li class="nav-item">
            <router-link to="search">Search</router-link>
          </li>
          <li class="nav-item">
            <router-link to="data">Data</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</div>
</template>

<script>
  export default{
    name: 'Menu',
    data () {
      return {
        msg: 'menu'
      }
    }
  }
</script>

<style scoped>
#menu{
  color:#ffffff;
}
</style>
