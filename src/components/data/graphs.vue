<template>
<div id="graphs">
  <div class="row">
    <div class="col-sm">
      <canvas id="chart1" height="300"></canvas>
    </div>
    <div class="col-sm">
      <canvas id="chart2" height="300"></canvas>
    </div>
    <div class="col-sm">
      <canvas id="chart3" height="300"></canvas>
    </div>
    <div class="col-sm">
      <canvas id="polar" height="300"></canvas>
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
      months: [],
      district: [],
      years: [],
      offense: []
    }
  },
  mounted() {
    //this.init();
    this.fakeGraphs();
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
      var ch1Label = [];
      var ch1Data = [];
      var ch2Label = [];
      var ch2Data = [];
      var ch3Label = [];
      var ch3Data = [];
      var polarLabel = [];
      var polarData = [];
      var that = this;
      async.series([
        //get limited data
        function f1(callback) {
          for (var i = 0; i < 5; i++) {
            ch1Label.push(that.district[i]["key"]);
          }
          for (var i = 0; i < 5; i++) {
            ch1Data.push(that.district[i]["doc_count"]);
          }
          for (var i = 0; i < 3; i++) {
            ch2Label.push(that.years[i]["key"]);
          }
          for (var i = 0; i < 3; i++) {
            ch2Data.push(that.years[i]["doc_count"]);
          }
          for (var i = 0; i < 10; i++) {
            ch3Label.push(that.offense[i]["key"]);
          }
          for (var i = 0; i < 10; i++) {
            ch3Data.push(that.offense[i]["doc_count"]);
          }
          for (var i = 0; i < 11; i++) {
            polarLabel.push(that.months[i]["key"]);
          }
          for (var i = 0; i < 11; i++) {
            polarData.push(that.months[i]["doc_count"]);
          }
          callback(null);
        }
      ], function(err) {
        draw();
      });

      function draw() {
        new Chart(document.getElementById('chart1'), {
          type: 'bar',
          data: {
            labels: ch1Label,
            datasets: [{
              label: "Incidents",
              backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
              data: ch1Data
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
        new Chart(document.getElementById("chart2"), {
          type: 'doughnut',
          data: {
            labels: ch2Label,
            datasets: [{
              label: "Incidents",
              backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
              data: ch2Data
            }]
          },
          options: {
            title: {
              display: true,
              text: 'Crime Rate By Year'
            }
          }
        });
        new Chart(document.getElementById("chart3"), {
  type: 'horizontalBar',
  data: {
    labels: ch3Label,
    datasets: [
      {
        label: "Number of Reports",
        backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850",
                          "#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
        data: ch3Data
      }
    ]
  },
  options: {
    legend: { display: false },
    title: {
      display: true,
      text: '2015 - 2018'
    }
  }
});
new Chart(document.getElementById("polar"), {
    type: 'polarArea',
    data: {
      labels: polarLabel,
      datasets: [
        {
          label: "Incidents(Thousands)",
          backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850",
                            "#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850",
                            "#3e95cd", "#8e5ea2"],
          data: polarData
        }
      ]
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
    fakeGraphs: function(){
      new Chart(document.getElementById("chart1"), {
    type: 'pie',
    data: {
      labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
      datasets: [{
        label: "Population (millions)",
        backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
        data: [2478,5267,734,784,433]
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
  backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
  data: [2478,5267,734,784,433]
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
  backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
  data: [2478,5267,734,784,433]
}]
},
options: {
title: {
  display: true,
  text: 'Predicted world population (millions) in 2050'
}
}
});
new Chart(document.getElementById("polar"), {
type: 'pie',
data: {
labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
datasets: [{
  label: "Population (millions)",
  backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
  data: [2478,5267,734,784,433]
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
