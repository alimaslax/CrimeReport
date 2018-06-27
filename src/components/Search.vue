<template>
<div class="search">
  <legend>Search The Records</legend>
<p class="card-text">Selecting multiple options of one field will result in the data being added togther. For example selecting Monday and Friday will query the database for all incidents that accord on a Monday or a Friday. Leave fields blank that you do not
  want yo search</p>
  <Tables/>
  <br>
<form class="text-center">
  <div id="inner" class="form-group col-md-4">
    Year
    <select multiple class="form-control"  v-model="years">
<option value="2018">2018</option>
<option value="2017">2017</option>
<option value="2016">2016</option>
<option value="2015">2015</option>
</select> Month
    <select multiple class="input-medium form-control" id="months"  v-model="months">
<option value="1">January</option>
<option value="2">Febuary</option>
<option value="3">March</option>
<option value="4">April</option>
<option value="5">May</option>
<option value="6">June</option>
<option value="7">July</option>
<option value="8">August</option>
<option value="9">September</option>
<option value="10">October</option>
<option value="11">November</option>
<option value="12">December</option>
</select>
  </div>
  DAY OF WEEK<br>
  <label class="btn btn-info">
    <input class=".checkbox-primary" type="checkbox" value="Monday" v-model="days"> Monday</input>
    </label>
  <label class="btn btn-info">
    <input class=".checkbox-primary" type="checkbox" value="Tuesday" v-model="days"> Tuesday</input>
    </label>
  <label class="btn btn-info">
    <input class=".checkbox-primary" type="checkbox" value="Wednesday" v-model="days"> Wednesday</input>
    </label>
  <label class="btn btn-info">
    <input class=".checkbox-primary" type="checkbox" value="Thursday" v-model="days"> Thursday</input>
    </label>
  <label class="btn btn-info">
    <input class=".checkbox-primary" type="checkbox" value="Friday" v-model="days"> Friday</input>
    </label>
  <label class="btn btn-info">
    <input class=".checkbox-primary" type="checkbox" value="Saturday" v-model="days"> Saturday</input>
    </label>
  <label class="btn btn-info">
    <input class=".checkbox-primary" type="checkbox" value="Sunday" v-model="days"> Sunday</input>
  </label><br>
  <div class="form-group">
    <label for="inputAddress">Street</label>
    <input type="text" class="form-control" id="inputAddress" placeholder="Main St">
  </div>
  <div class="form-group">
    Shooting Related
    <select class="input-medium form-control" id="shoot" v-model="months">
      <option value="1">YES</option>
      <option value="2">NO</option>
    </select>
  </div>
</form>
<br>
<router-link :to="{ name: 'Data', params: {days,months,years} }"class="btn btn-primary" style="margin: auto;width:30%;border:3px;padding:10px;">Stuff</router-link>
</div>
</template>

<script>
import Tables from './data/tables'
export default{
  name: "Search",
  components: {
    Tables
  },
  data () {
    return {
      days:[],
      years:[],
      months:[]
    }
  }
}
</script>
<style scoped>
#inner {
  display: table;
  margin: 0 auto;
}
</style>
