<template>
<div id="graphs">

  <br>
  <h1>==============</h1>
  <br>
  <div class="row">
    <div class="col-sm">
      <canvas id="districtG" height="300"></canvas>
    </div>
    <div class="col-sm">
      <canvas id="yearG" height="300"></canvas>
    </div>
    <div class="col-sm">
      <canvas id="offenseG" height="300"></canvas>
    </div>
    <div class="col-sm">
      <canvas id="monthG" height="300"></canvas>
    </div>
  </div>
</div>
</template>
<script>
import async from 'async-es'
export default {
  name: 'Graphs',
  data() {
    return {
      msg:'hii',
      months: [],
      district: [],
      years: [],
      offense: []
    }
  },
  computed:{

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
        function f1(callback) {
          for (var i = 0; i < 5; i++) {
            chDisLabel.push(that.district[i]["key"]);
          }
          for (var i = 0; i < 5; i++) {
            chDisData.push(that.district[i]["doc_count"]);
          }
          for (var i = 0; i < 4; i++) {
            chYearLabel.push(that.years[i]["key"]);
          }
          for (var i = 0; i < 4; i++) {
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
              backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
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
              backgroundColor: ["#FF0000", "#FF0000", "#3cba9f", "#e8c3b9", "#c45850"],
              data: chYearData
            }]
          },
          options: {
            title: {
              display: true,
              text: 'Crime Rate By Year'
            }
          }
        });
        new Chart(document.getElementById("offenseG"), {
          type: 'horizontalBar',
          data: {
            labels: chOffLabel,
            datasets: [{
              label: "Number of Reports",
              backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850",
                "#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"
              ],
              data: chOffData
            }]
          },
          options: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: '2015 - 2018'
            }
          }
        });
        new Chart(document.getElementById("monthG"), {
          type: 'polarArea',
          data: {
            labels: chMonthLabel,
            datasets: [{
              label: "Incidents(Thousands)",
              backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850",
                "#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850",
                "#3e95cd", "#8e5ea2"
              ],
              data: chMonthData
            }]
          },
          options: {
            title: {
              display: true,
              text: '2015-2018'
            }
          }
        });
      }
    },
    fakeGraphs: function() {
      new Chart(document.getElementById("chart1"), {
        type: 'pie',
        data: {
          labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
          datasets: [{
            label: "Population (millions)",
            backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
            data: [2478, 5267, 734, 784, 433]
          }]
        },
        options: {
          title: {
            display: true,
            text: 'Predicted world population (millions) in 2050'
          }
        }
      });
      new Chart(document.getElementById("chart2"), {
        type: 'pie',
        data: {
          labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
          datasets: [{
            label: "Population (millions)",
            backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
            data: [2478, 5267, 734, 784, 433]
          }]
        },
        options: {
          title: {
            display: true,
            text: 'Predicted world population (millions) in 2050'
          }
        }
      });
      new Chart(document.getElementById("chart3"), {
        type: 'pie',
        data: {
          labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
          datasets: [{
            label: "Population (millions)",
            backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
            data: [2478, 5267, 734, 784, 433]
          }]
        },
        options: {
          title: {
            display: true,
            text: 'Predicted world population (millions) in 2050'
          }
        }
      });
      new Chart(document.getElementById("chart4"), {
        type: 'pie',
        data: {
          labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
          datasets: [{
            label: "Population (millions)",
            backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
            data: [2478, 5267, 734, 784, 433]
          }]
        },
        options: {
          title: {
            display: true,
            text: 'Predicted world population (millions) in 2050'
          }
        }
      });
    }
  }
}
</script>

<style scoped>
#menu {
  color: #ffffff;
}
</style>
