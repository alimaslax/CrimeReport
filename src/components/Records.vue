<template>
  <div class="records">
    <Tables/>
    <br>
    <router-link to="search" class="btn btn-primary" style="margin: auto;width:30%;border:3px;padding:10px;">Analyze</router-link>
  </div>
</template>

<script>
import Tables from './data/tables'
export default {
  name: 'Records',
  components: {
    Tables
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div.records{
  padding-bottom: 1.25rem;;
}
</style>
