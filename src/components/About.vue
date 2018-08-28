<template>
  <div class="about">
    <legend>About This Website</legend>
    The Uniform Crime Reports (UCR) compiles official data on crime in the United States, published by the Federal Bureau of Investigation (FBI). UCR is "a nationwide, cooperative statistical effort of nearly 18,000 city , university and college,
    county, state, tribal, and federal law enforcement agencies voluntarily reporting data on crimes brought to their attention". Crime statistics are compiled from UCR data and published annually by the FBI in the Crime in the United States series.
    The FBI does not collect the data itself. Rather, law enforcement agencies across the United States provide the data to the FBI, which then compiles the Reports.
    <br>
    THE CITY OF BOSTON RECOGNIZES THE VALUE AND BENEFIT GAINED BY SHARING GEOSPATIAL DATA. ALTHOUGH THE CITY HAS MADE REASONABLE EFFORTS TO PROVIDE ACCURATE DATA, THE CITY MAKES NO REPRESENTATIONS OR GUARANTEES ABOUT THE ACCURACY, COMPLETENESS, OR CURRENCY OF THE INFORMATION PROVIDED. THE CITY OF BOSTON PROVIDES THIS DATA AS IS AND WITH ALL FAULTS, AND MAKES NO WARRANTY OF ANY KIND. EACH USER IS RESPONSIBLE FOR DETERMINING THE SUITABILITY OF THE DATA FOR THEIR INTENDED USE OR PURPOSE. NEITHER THE CITY NOR ITS AFFILIATES, EMPLOYEES, OR AGENTS SHALL BE LIABLE FOR ANY LOSS OR INJURY CAUSED IN WHOLE OR IN PART BY USE OF ANY DATA OBTAINED FROM THIS WEBSITE. THE GEOSPATIAL DATA IS UPDATED AND MODIFIED ON A REGULAR BASIS AND USERS ARE ENCOURAGED TO REPORT ANY ERRORS TO THE CITY.
    <br>
    <br>
    <router-link to="records" class="btn btn-primary" style="margin: auto;width:30%;border:3px;padding:10px;">Records</router-link>
  </div>
</template>

<script>
export default {
  name: 'About',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div.about{
  padding: 1.25rem;
}
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
</style>
