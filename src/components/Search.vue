<template>
<div class="search">
  <legend>Statistics</legend>
  <p class="card-text">Selecting multiple options of one field will result in the data being added togther. For example selecting Monday and Friday will query the database for all incidents that accord on a Monday or a Friday. Leave fields blank that you do not want yo search</p>

  <br>
    <div class="date row">
      <div class="col-sm-4">
        Year
        <select multiple class="form-control" v-model="years">
<option value="2018">2018</option>
<option value="2017">2017</option>
<option value="2016">2016</option>
<option value="2015">2015</option>
</select>
      </div>
      <div class="col-sm-4">
        Month
        <select multiple class="input-medium form-control" id="months" v-model="months">
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
      <div class="col-sm-4">
        Day
        <select multiple class="input-medium form-control" id="days" v-model="days">
<option value="Monday">Monday</option>
<option value="Tuesday">Tuesday</option>
<option value="Wednesday">Wednesday</option>
<option value="Thursday">Thursday</option>
<option value="Friday">Friday</option>
<option value="Saturday">Saturday</option>
</select>
      </div>
    </div>

      Crime Type<br>
    <div class ="row">
      <div class="col-sm-6">
        <label class="btn btn-warning">
        <input class=".checkbox-primary" type="checkbox" value="motor" v-model="options"> Motor Vehicle</input>
        </label>
        <label class="btn btn-warning">
        <input class=".checkbox-primary" type="checkbox" value="med" v-model="options"> Medical Assistance</input>
        </label>
        <label class="btn btn-warning">
        <input class=".checkbox-primary" type="checkbox" value="drug" v-model="options"> Drug Violation</input>
        </label>
        <label class="btn btn-warning">
        <input class=".checkbox-primary" type="checkbox" value="theft" v-model="options"> Theft/Robbery</input>
        </label>
      </div>
        <div class="col-sm-6">
        <label class="btn btn-warning">
        <input class=".checkbox-primary" type="checkbox" value="assault" v-model="options"> Assault</input>
        </label>
        <label class="btn btn-warning">
        <input class=".checkbox-primary" type="checkbox" value="shooting" v-model="options">Gun Charges</input>
        </label>
        <label class="btn btn-warning">
        <input class=".checkbox-primary" type="checkbox" value="investigate" v-model="options"> Investigate Person</input>
      </label>
      <label class="btn btn-warning">
      <input class=".checkbox-primary" type="checkbox" value="other" v-model="options">Other</input>
    </label>
  </div>
      </div>
    <br>
  <div class="srs row">
    <div class="col-sm-12">
      SRS Part Number
      <select class="input-medium form-control" id="shoot" v-model="parts">
      <option value="0" selected>N/A </option>
      <option value="1">PART One (murder,rape,grand larceny, etc..) </option>
      <option value="2">PART Two: Third Degree Felonies</option>
      <option value="3">PART Three: 3rd Degree Misterminors</option>
    </select>
    </div>
  </div>
  <div class="row">
  <div class="col-sm-12">
    <label for="inputAddress">Address</label>
    <input type="text" class="form-control" id="inputAddress" placeholder="Main St">
  </div>
</div>
  <br>
  <router-link :to="{ name: 'data', params: {days,months,years,options,parts} }" class="btn btn-primary" style="margin: auto;width:30%;border:3px;padding:10px;">Generate</router-link>

</div>
</template>
<script>
export default{
  name: "Search",
  data () {
    return {
      days:[],
      years:[],
      months:[],
      options:[],
      parts:[]
    }
  }
}
</script>
<style scoped>
select option:checked {
  background: linear-gradient(0deg, #EF0063  0%, #EF0063 100%);
  color:#ffffff;
}
.btn{
  width:180px;
}
.srs{
  margin: 0 auto;
}
.date{
  margin: 0 auto;
}
</style>
