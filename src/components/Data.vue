<template>
<div class="data">
  <div v-if="checkParams()">
  <div class="blue">
    <h2>{{count}}</h2>
    <h3>Reported Incidents</h3>
    {{getMsg}}
  </div>

    <Graphs :search="search"></Graphs>
    <router-link to="map" class="btn btn-primary" style="margin: auto;width:30%;border:3px;padding:10px;">Maps</router-link>
    </div>
  <div v-if = "checkParams()==false">
    <h1>Select A Field Below</h1>
    <router-link to="search" class="btn btn-primary" style="margin: auto;width:30%;border:3px;padding:10px;">Search</router-link>
    <h1>Or Go To Maps</h1>
    <router-link to="map" class="btn btn-primary" style="margin: auto;width:30%;border:3px;padding:10px;">Maps</router-link>
  </div>
</div>
</template>

<script>
import Graphs from './data/graphs'
import async from 'async-es'
export default {
  components: {
    Graphs
  },
  data() {
    return {
      search: this.$route.params,
      data: [],
      count: 0,
      msg: 'Days:'+5
    }
  },
  computed: {
    getMsg: function(){
      var string='';
      string+="Year(s): "
      for(var key in this.$route.params.years){
        string+=this.$route.params.years[key]+" ";
      }
      string+="Month(s): "
      for(var key in this.$route.params.months){
        string+=this.$route.params.months[key]+ " ";
      }
      string+="Day(s): "
      for(var key in this.$route.params.days){
        string+=this.$route.params.days[key]+ " ";
      }
      string+="Option(s): "
      for(var key in this.$route.params.options){
        string+=this.$route.params.options[key]+ " ";
      }
      string+="Part(s): "
      for(var key in this.$route.params.parts){
        string+=this.$route.params.parts[key] + " ";
      }
      return string;
    }
  },
  mounted() {
    if (this.checkParams()) {
      this.init();
    }
  },
  methods: {
    init: function() {
      var that = this;
      async.waterfall([
          function func1(callback) {
            var options = [];
            var date = [];
            if (that.search.years.length >= 1)
              date.push({
                term: "YEAR",
                data: that.search.years
              });
            if (that.search.months.length >= 1)
              date.push({
                term: "MONTH",
                data: that.search.months
              });
            if (that.search.days.length >= 1)
              date.push({
                term: "DAY_OF_WEEK",
                data: that.search.days
              });
            if (that.search.options.length >= 1) {
              var string = [];
              for (var key in that.search.options) {
                if (that.search.options[key] == 'motor') {
                  string.push("Auto Theft", "Larceny From Motor Vehicle",
                    "Motor Vehicle Accident Response", "Towed","Auto Theft Recovery");
                }
                if (that.search.options[key] == 'med') {
                  string.push("Medical Assistance");
                }
                if (that.search.options[key] == 'drug') {
                  string.push("Drug Violation");
                }
                if (that.search.options[key] == 'theft') {
                  string.push("Robbery","Counterfeiting");
                }
                if (that.search.options[key] == 'assault') {
                  string.push("Aggravated Assault", "Simple Assault");
                }
                if (that.search.options[key] == 'guns') {
                  string.push("Firearm Discovery","Ballistics","Firearm Violations");
                }
                if (that.search.options[key] == 'investigate') {
                  string.push("Harassment","Investigate Property");
                }
                if (that.search.options[key] == 'other') {
                  string.push("Other");
                }
              }
              options.push({
                term: "OFFENSE_CODE_GROUP",
                data: string
              });
            }
            callback(null, date, options);
          },
          //get the data in ORDER
          function func2(date, options, callback) {
            var promise1 = that.request(that.getQuery(date, options));
            Promise.all([promise1]).then(function(values) {
              callback(null, values, options);
            });
          },
          //sort and set the data in ORDER
          function func3(date, options, callback) {
            that.data.push(date);
            callback(null, 'done');
          }
        ],
        function(err, results) {
          that.startTimer(that.data[0][0].data.hits.total);
        });
    },
    //returns elastic search query
    getQuery: function(date, options) {
      var query = '';

      function getString(string) {
        var temp = '';
        var array = [];
        var must = '';
        for (var i = 0; i < string.length; i++) {
          if (string[i]["data"].length > 1) {
            array = string[i]["data"];
            for (var key in array) {
              temp += '{ "match" : { "' + string[i]["term"] + '" : "' + array[key] + '" } }';
              if (key != array.length - 1)
                temp += ',';
            }
            must += '{ "bool": { "should": [ ' + temp + '] } }';
            temp = '';
          } else {
            must += '{ "match" : { "' + string[i]["term"] + '" : "' + string[i]["data"] + '" } }';
          }
          //add coma if not end
          if (i != string.length - 1)
            must += ',';
        }
        return '"must": [' + must + ']';
      }
      //Selected a date & options
      if (date.length >= 1 && options.length >= 1) {
        return '{"size":0,"query": { "bool": {' + getString(options) + ',"filter": {"bool": {' + getString(date) + '}}}}}';
      }
      //Selected a date but no options
      if (date.length >= 1 && !(options.length >= 1)) {
        return '{"size":0, "query": { "constant_score": { "filter": {"bool": {' + getString(date) + '}}}}}';
      }
      //Selected options but no date
      if (options.length >= 1 && !(date.length >= 1)) {
        return '{"size":0,"query": {"bool": {' + getString(options) + '}}}';
      }
      //If date is a string that means just get the aggs
      else
        return '{ "size": 10, "aggs": { "sum": { "terms": { "field": "' + date + '.keyword", "size":500 } } } }';
    },
    //returns elastic search query
    request: function(req) {
      var r = this.$axios.request({
          method: 'Post',
          url: '/search/crime/_search',
          data: JSON.parse(req),
          responseType: 'json'
        })
        .then((response) => {
          return response;
        }, (error) => {});
      return r;
    },
    startTimer: function(num) {
      var count1 = setInterval(() => {
        if (this.count > num) {
          clearInterval(count1)
          this.count = num;
          return;
        }
        return this.count+=Math.floor(2+ this.count/10);
      }, 1);
    },
    checkParams(){
      for(var key in this.search){
        if(this.search[key].length >=1)
          return true;
      }
      return false;
    }
  }
}
</script>

<style scoped>
div.data {
  font-family: Impact, Charcoal, sans-serif;
}

.row {
  padding: 0.25rem;
}

.blue {
  width: inherit;
  color: #ffffff;
  padding: 0px;
  background: #000428;
  /* fallback for old browsers */
  background: -webkit-linear-gradient(to top, #004e92, #000428);
  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to top, #004e92, #000428);
  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}

.extra {
  padding-bottom: 100px;
}

.msg {
  font-size: 20px;
}

table {
  width: 100%;
}

th {
  height: 50px;
  padding: 0px;
  margin: 0px;
}
</style>
