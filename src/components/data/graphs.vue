<template>
<div id="graphs">
  <div class="row">
    <div class="col-sm">
      <canvas id="offenseG" height="300"></canvas>
    </div>
    <div class="col-sm">
      <canvas id="yearG" height="300"></canvas>
    </div>
    <div class="col-sm">
      <canvas id="monthG" height="300"></canvas>
    </div>
    <div class="col-sm">
      <canvas id="districtG" height="300"></canvas>
    </div>
  </div>
</div>
</template>
<script>
import async from 'async-es'
export default {
  name: 'Graphs',
  props: [
    'search'
  ],
  data() {
    return {
      msg: 'hii',
      months: [],
      district: [],
      years: [],
      offense: []
    }
  },
  computed: {

  },
  mounted() {
    this.init();
    //this.fakeGraphs();
  },
  methods: {
    init: function() {
      var that = this;
      async.waterfall([
          //get the data in ORDER
          function func1(callback) {
            var promise1 = that.getCount("DISTRICT")
            var promise2 = that.getCount("MONTH")
            var promise3 = that.getCount("YEAR")
            var promise4 = that.getCount("OFFENSE_CODE_GROUP")
            Promise.all([promise1, promise2, promise3, promise4]).then(function(values) {
              callback(null, values);
            });
          },
          //sort and set the data in ORDER
          function func2(vals, callback) {
            function order() {
              for (var i in vals) {
                vals[i].sort(function(a, b) {
                  return b["doc_count"] - a["doc_count"]
                });
              }
            }
            //set values based on promise#
            new Promise((resolve, reject) => {
              resolve(order());
            }).then(() => {
              that.district = vals[0];
              that.months = vals[1];
              that.years = vals[2];
              that.offense = vals[3];
              callback(null, 'done');
            });
          }
        ],
        function(err, results) {
          //removes "NAME" "0" elastic search result
          that.district.pop();
          that.months.pop();
          that.years.pop();
          that.offense.pop();
          that.drawGraphs();
        });
    },
    //returns elastic search query
    getCount: function(req) {
      var query = {
        "size": 0,
        "aggs": {
          "sum": {
            "terms": {
              "field": req + ".keyword",
              "size": 500
            }
          }
        }
      };
      var r = this.$axios.request({
          method: 'Post',
          url: '/search/crime/_search',
          data: query,
          responseType: 'json'
        })
        .then((response) => {
          return response.data.aggregations.sum.buckets;
        }, (error) => {});
      return r;
    },
    drawGraphs: function() {
      var chDisLabel = [];
      var chDisData = [];
      var chYearLabel = [];
      var chYearData = [];
      var chOffLabel = [];
      var chOffData = [];
      var chMonthLabel = [];
      var chMonthData = [];
      var that = this;
      async.series([
        //get limited data
        function f0(callback){
          that.filterData(that.search);
          callback(null);
        },
        function f1(callback) {
          for (var i = 0; i < 5; i++) {
            chDisLabel.push(that.district[i]["key"]);
          }
          for (var i = 0; i < 5; i++) {
            chDisData.push(that.district[i]["doc_count"]);
          }
          for (var i in that.years) {
            chYearLabel.push(that.years[i]["key"]);
          }
          for (var i in that.years) {
            chYearData.push(that.years[i]["doc_count"]);
          }
          for (var i = 0; i < 10; i++) {
            chOffLabel.push(that.offense[i]["key"]);
          }
          for (var i = 0; i < 10; i++) {
            chOffData.push(that.offense[i]["doc_count"]);
          }
          //must use switch to get order of doc_count right
          for (var i = 0; i < 11; i++) {
            switch (that.months[i]["key"]) {
              case "1":
                chMonthLabel.push("Jan");
                break;
              case "2":
                chMonthLabel.push("Feb");
                break;
              case "3":
                chMonthLabel.push("Mar");
                break;
              case "4":
                chMonthLabel.push("Apr");
                break;
              case "5":
                chMonthLabel.push("May");
                break;
              case "6":
                chMonthLabel.push("Jun");
                break;
              case "7":
                chMonthLabel.push("Jul");
                break;
              case "8":
                chMonthLabel.push("Aug");
                break;
              case "9":
                chMonthLabel.push("Sep");
                break;
              case "10":
                chMonthLabel.push("Oct");
                break;
              case "11":
                chMonthLabel.push("Nov");
                break;
              case "12":
                chMonthLabel.push("Dec");
                break;
              default:
              chMonthLabel.push(that.months[i]["key"]);
                break;
            }
          }
          for (var i = 0; i < 11; i++) {
            chMonthData.push(that.months[i]["doc_count"]);
          }
          callback(null);
        }
      ], function(err) {
        draw();
      });

      function draw() {
        new Chart(document.getElementById('districtG'), {
          type: 'bar',
          data: {
            labels: chDisLabel,
            datasets: [{
              label: "Incidents",
              backgroundColor: ["#FF0000", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
              data: chDisData
            }]
          },
          options: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: 'Incidents By District'
            }
          }
        });
        new Chart(document.getElementById("yearG"), {
          type: 'doughnut',
          data: {
            labels: chYearLabel,
            datasets: [{
              label: "Incidents",
              backgroundColor: ["#FF0000","#9aa88c","#8ca8a8","#9a8ca8","	#aaaaaa","	#6B857C"],
              data: chYearData
            }]
          },
          options: {
            title: {
              display: true,
              text: 'Incidents By Year'
            }
          }
        });
        new Chart(document.getElementById("offenseG"), {
          type: 'horizontalBar',
          data: {
            labels: chOffLabel,
            datasets: [{
              label: "Number of Reports",
              backgroundColor: ["#FF0000", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850",
                "#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"
              ],
              data: chOffData
            }]
          },
          options: {
            legend: {
              display: false
            }
          }
        });
        new Chart(document.getElementById("monthG"), {
          type: 'polarArea',
          data: {
            labels: chMonthLabel,
            datasets: [{
              label: "Incidents(Thousands)",
              backgroundColor: ["#FF0000", "#9aa88c","#8ca8a8","#9a8ca8","	#aaaaaa","	#6B857C",
              "#7B7C65","#D2D4B7","#C1C1B8","#A8C1C8","#6B6F74","#D2D4B7"
              ],
              data: chMonthData
            }]
          },
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  display: false
                }
              }]
            }
          }
        });
      }
    },
    filterData: function(data) {
      var doc_count = 0;
      var name = "";
      var index;
      //modify years
      if (data.years.length >= 1) {
        for (var i in data.years) {
          index = getIndex(data.years[i], this.years);
          name += data.years[i] + " ";
          doc_count += this.years[index]["doc_count"];
          this.years.splice(index, 1);
        }
        this.years.splice(0, 0, {
          "key": name,
          "doc_count": doc_count
        });
      }
      //modify months
      console.log(this.months);
      if (data.months.length) {
        doc_count = 0;
        name = "";
        for (var i in data.months) {
          index = getIndex(data.months[i], this.months);
          name += data.months[i] + " ";
          doc_count += this.months[index]["doc_count"];
          this.months.splice(index, 1);
        }
        this.months.splice(0, 0, {
          "key": name,
          "doc_count": doc_count
        });
      }
      if(data.options.length>=1){
        doc_count=0;
        name="";
        console.log(this.offense);
          for(var i in data.options){
            if(data.options[i]=="motor")
              {
                index = getIndex("Motor Vehicle Accident Response", this.offense);
                name += data.options[i] + " ";
                doc_count += this.offense[index]["doc_count"];
                this.offense.splice(index, 1);
              }
              if(data.options[i]=="assault")
                {
                  index = getIndex("Simple Assault", this.offense);
                  name += data.options[i] + " ";
                  doc_count += this.offense[index]["doc_count"];
                  this.offense.splice(index, 1);
                }
          }
          this.offense.splice(0, 0, {
            "key": name,
            "doc_count": doc_count
          });
        }

      function getIndex(key, arr) {
        for (var i = 0; i < arr.length; i++) {
          if (arr[i]["key"] == key)
            return i;
        }
      }
    }
  }
}
</script>

<style scoped>
#menu {
  color: #ffffff;
}
</style>
