<template>
<div class="data">
  <section id="data" v-if="display == 'true'">
  <legend>Search Results Data</legend>
  <br>
</section>
  <legend>Graphs</legend>
  <br> <Graphs/>
</div>
</template>

<script>
import Graphs from './data/graphs'
export default {
  components: {
    Graphs
  },
  data() {
    return {
      data: [],
      display:'false'
    }
  },
  mounted() {
  },
  methods: {
    drawGraphs: function(result) {
      var district = [];
      var shooting = [];
      var code = [];
      var year = [];
      var week = [];

      function order() {
        for (var i = 0; i < result.length; i++) {
          if (result[i].length - 1 == "DISTRICT") {
            for (var j = 0; j < result[i].length - 1; j++) {
              alert(result[i][j]);
            }
          }
        }
      }
      new Promise((resolve, reject) => {
        resolve(order());
      }).then(() => {
        /*
        new Chart(document.getElementById('chart1'), {
          type: 'bar',
          data: {
            labels: [district[0]["key"], district[1]["key"], district[2]["key"], district[3]["key"], district[4]["key"]],
            datasets: [{
              label: "Incidents",
              backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
              data: [district[0]["doc_count"], district[1]["doc_count"], district[2]["doc_count"], district[3]["doc_count"], district[4]["doc_count"]]
            }]
          },
          options: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: 'Incidents By District(2015-NOW)'
            }
          }
        });
        */
        new Chart(document.getElementById("chart2"), {
          type: 'doughnut',
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
          type: 'radar',
          data: {
            labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
            datasets: [{
              label: "1950",
              fill: true,
              backgroundColor: "rgba(179,181,198,0.2)",
              borderColor: "rgba(179,181,198,1)",
              pointBorderColor: "#fff",
              pointBackgroundColor: "rgba(179,181,198,1)",
              data: [8.77, 55.61, 21.69, 6.62, 6.82]
            }, {
              label: "2050",
              fill: true,
              backgroundColor: "rgba(255,99,132,0.2)",
              borderColor: "rgba(255,99,132,1)",
              pointBorderColor: "#fff",
              pointBackgroundColor: "rgba(255,99,132,1)",
              pointBorderColor: "#fff",
              data: [25.48, 54.16, 7.61, 8.06, 4.45]
            }]
          },
          options: {
            title: {
              display: true,
              text: 'Distribution in % of world population'
            }
          }
        });
        new Chart(document.getElementById("chart4"), {
          type: 'bar',
          data: {
            labels: ["1900", "1950", "1999", "2050"],
            datasets: [{
              label: "Europe",
              type: "line",
              borderColor: "#8e5ea2",
              data: [408, 547, 675, 734],
              fill: false
            }, {
              label: "Africa",
              type: "line",
              borderColor: "#3e95cd",
              data: [133, 221, 783, 2478],
              fill: false
            }, {
              label: "Europe",
              type: "bar",
              backgroundColor: "rgba(0,0,0,0.2)",
              data: [408, 547, 675, 734],
            }, {
              label: "Africa",
              type: "bar",
              backgroundColor: "rgba(0,0,0,0.2)",
              backgroundColorHover: "#3e95cd",
              data: [133, 221, 783, 2478]
            }]
          },
          options: {
            title: {
              display: true,
              text: 'Population growth (millions): Europe & Africa'
            },
            legend: {
              display: false
            }
          }
        });
      });
    }
  }
}
</script>

<style scoped>
#tablediv {
  width: inherit;
  overflow: auto;
}
</style>
