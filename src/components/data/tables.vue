<template>
<div class="tables">
  <input class="form-control" type="search" v-model="search" placeholder="Search..." id="input">
  <div class="table">
    <table class="table-dark table-striped table-sm">
      <thead class="thead-dark">
        <tr>
          <th v-for="key in columns">{{key.title}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="key in filter">
          <td v-for="element in key">{{element}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</template>
<script>
import async from 'async-es'
export default {
  name: 'Tables',
  data() {
    return {
      dataSet: [],
      search: '',
      //Hardcoded for simplicity
      //dataSet must follow exact pattern
      columns: [{
          title: "DISTRICT"
        },
        {
          title: "OFFENSE_CODE"
        },
        {
          title: "DESCRIPTION"
        },
        {
          title: "LOCATION"
        },
        {
          title: "DATE"
        },
        {
          title: "INCIDENT NUMBER"
        }
      ],
      loaded: false
    }
  },
  mounted() {
    this.init(0);
  },
  computed: {
    filter: function() {
      return this.dataSet.filter(data => {
        if(this.loaded==true){
          for(var key in data){
            return data.toString().toLowerCase().includes(this.search);
          }
        }
      })
    }
  },
  methods: {
    init: function(from) {
      var that = this;
      async.waterfall([
        //get the data in ORDER
        function func1(callback) {
          var promise1 = that.getInfo(from, 1000);

          Promise.all([promise1]).then(function(values) {
            callback(null, values);
          });
        },
        //get the data in ORDER
        function func2(vals, callback) {
          function order() {
            //starting array
            //important to start with vals[0]
            var list = vals[0];
            for (var i in list) {
              var incident = [];
              incident.push(list[i]._source.DISTRICT);
              incident.push(list[i]._source.OFFENSE_CODE);
              incident.push(list[i]._source.OFFENSE_DESCRIPTION);
              incident.push(list[i]._source.STREET);
              incident.push(list[i]._source.OCCURRED_ON_DATE);
              incident.push(list[i]._source.INCIDENT_NUMBER);
              that.dataSet.push(incident);
            }
          }
          //set values based on promise#
          new Promise((resolve, reject) => {
            resolve(order());
          }).then(() => {
            callback(null, vals);
          });

        },
        //clean the dataSet
        function func3(vals, callback) {
          function clean(arr) {
            for (var i = 0; i < arr.length; i++) {
              if (arr[i] == null || arr[i] == undefined) {
                arr[i] = "-"
                i--;
              }
            }
            return arr;
          }
          for (var key in that.dataSet) {
            that.dataSet[key] = clean(that.dataSet[key])
          }
          callback(null)
        }
      ], function(err) {
        that.loaded = true;
      });
    },
    //returns elastic search query
    getInfo: function(from, size) {
      var query = {
        "from": from,
        "size": size
      };
      var r = this.$axios.request({
          method: 'Post',
          url: '/search/crime/_search',
          data: query,
          responseType: 'json'
        })
        .then((response) => {
          return response.data.hits.hits;
        }, (error) => {});
      return r;
    }
  }
}
</script>

<style scoped>
div.tables {}

.table {
  height: 500px;
  width: inherit;
  overflow-y: scroll;
  overflow-x: scroll;
}

.table-hover tbody tr:hover td,
.table-hover tbody tr:hover th {
  color: #ffffff;
  background-color: #00437C;
}
</style>
