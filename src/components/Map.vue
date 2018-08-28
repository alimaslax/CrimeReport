<template>
<div>
  <div id="map" style="width: 100%; height: 100%; position: absolute;">
  </div>
  <transition name="modal">
         <div class="modal-mask" v-show="show">
             <div class="modal-container">
                 <div class="modal-header">
                     <h3>Incident</h3>
                 </div>
                 <div class="modal-body">
                         {{msg}}
                 </div>
                 <div class="modal-footer text-right">
                 <button class="btn-primary" @click="close()">Close</button>
               </div>
             </div>
         </div>
     </transition>
</div>
</template>
<script>
import async from 'async-es'
export default {
  name: 'Maps',
  data() {
    return {
      show: false,
      dataSet: [],
      msg: ''
    }
  },
  mounted() {
    this.initMap();
  },
  methods: {
    close: function() {
      this.show=false;
    },
    //returns elastic search query
    getInfo: function(size) {
      var query = {
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
    },
    initMap: function() {
      var that = this;
      async.waterfall([
        //get the data in ORDER
        function func1(callback) {
          var promise1 = that.getInfo(200);

          Promise.all([promise1]).then(function(values) {
            callback(null, values);
          });
        },
        //get the data in ORDER
        function func2(vals, callback) {
          function order() {
            //starting array
            //important to start with vals[0]
            //ORDER of push is IMPOrtAnt
            var list = vals[0];
            for (var i in list) {
              var incident = [];
              incident.push(list[i]._source.Lat);
              incident.push(list[i]._source.Long);
              incident.push(list[i]._source.OFFENSE_CODE_GROUP);
              incident.push(list[i]._source.DISTRICT);
              incident.push(list[i]._source.OFFENSE_CODE);
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
        console.log(that.dataSet);
        var map = new google.maps.Map(document.getElementById('map'), {
          center: {
            lat: 42.33380683,
            lng: -71.10377843
          },
          zoom: 13,
          styles: [{
              "featureType": "all",
              "elementType": "labels.text.fill",
              "stylers": [{
                  "saturation": 36
                },
                {
                  "color": "#000000"
                },
                {
                  "lightness": 40
                }
              ]
            },
            {
              "featureType": "all",
              "elementType": "labels.text.stroke",
              "stylers": [{
                  "visibility": "on"
                },
                {
                  "color": "#000000"
                },
                {
                  "lightness": 16
                }
              ]
            },
            {
              "featureType": "all",
              "elementType": "labels.icon",
              "stylers": [{
                "visibility": "off"
              }]
            },
            {
              "featureType": "administrative",
              "elementType": "geometry.fill",
              "stylers": [{
                  "color": "#000000"
                },
                {
                  "lightness": 20
                }
              ]
            },
            {
              "featureType": "administrative",
              "elementType": "geometry.stroke",
              "stylers": [{
                  "color": "#000000"
                },
                {
                  "lightness": 17
                },
                {
                  "weight": 1.2
                }
              ]
            },
            {
              "featureType": "administrative",
              "elementType": "labels",
              "stylers": [{
                "visibility": "off"
              }]
            },
            {
              "featureType": "administrative",
              "elementType": "labels.text",
              "stylers": [{
                "visibility": "off"
              }]
            },
            {
              "featureType": "administrative.province",
              "elementType": "all",
              "stylers": [{
                "visibility": "off"
              }]
            },
            {
              "featureType": "administrative.locality",
              "elementType": "all",
              "stylers": [{
                "visibility": "off"
              }]
            },
            {
              "featureType": "administrative.neighborhood",
              "elementType": "all",
              "stylers": [{
                "visibility": "off"
              }]
            },
            {
              "featureType": "administrative.land_parcel",
              "elementType": "all",
              "stylers": [{
                "visibility": "off"
              }]
            },
            {
              "featureType": "landscape",
              "elementType": "geometry",
              "stylers": [{
                  "color": "#000000"
                },
                {
                  "lightness": 20
                }
              ]
            },
            {
              "featureType": "landscape",
              "elementType": "geometry.fill",
              "stylers": [{
                "lightness": "-55"
              }]
            },
            {
              "featureType": "landscape",
              "elementType": "labels",
              "stylers": [{
                "visibility": "off"
              }]
            },
            {
              "featureType": "poi",
              "elementType": "all",
              "stylers": [{
                "visibility": "off"
              }]
            },
            {
              "featureType": "poi",
              "elementType": "geometry",
              "stylers": [{
                  "color": "#000000"
                },
                {
                  "lightness": 21
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "all",
              "stylers": [{
                "visibility": "simplified"
              }]
            },
            {
              "featureType": "road.highway",
              "elementType": "geometry.fill",
              "stylers": [{
                  "color": "#000000"
                },
                {
                  "lightness": 17
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "geometry.stroke",
              "stylers": [{
                  "color": "#000000"
                },
                {
                  "lightness": 29
                },
                {
                  "weight": 0.2
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "labels",
              "stylers": [{
                "visibility": "off"
              }]
            },
            {
              "featureType": "road.arterial",
              "elementType": "geometry",
              "stylers": [{
                  "color": "#000000"
                },
                {
                  "lightness": 18
                }
              ]
            },
            {
              "featureType": "road.local",
              "elementType": "geometry",
              "stylers": [{
                  "color": "#000000"
                },
                {
                  "lightness": 16
                }
              ]
            },
            {
              "featureType": "transit",
              "elementType": "all",
              "stylers": [{
                "visibility": "off"
              }]
            },
            {
              "featureType": "transit",
              "elementType": "geometry",
              "stylers": [{
                  "color": "#000000"
                },
                {
                  "lightness": 19
                }
              ]
            },
            {
              "featureType": "transit.station.airport",
              "elementType": "all",
              "stylers": [{
                  "visibility": "off"
                },
                {
                  "weight": "0.01"
                }
              ]
            },
            {
              "featureType": "transit.station.airport",
              "elementType": "labels",
              "stylers": [{
                "visibility": "on"
              }]
            },
            {
              "featureType": "water",
              "elementType": "geometry",
              "stylers": [{
                  "color": "#252728"
                },
                {
                  "lightness": 17
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "labels",
              "stylers": [{
                "visibility": "off"
              }]
            }
          ]
        });
        //order of dataset is important, 3rd element = OFFENSE_CODE_GROUP
        for (var i = 0; i < that.dataSet.length; i++) {
          new google.maps.Marker({
            position: new google.maps.LatLng(that.dataSet[i][0], that.dataSet[i][1]),
            icon: getIcon(that.dataSet[i]),
            map: map,
            customInfo: that.dataSet[i]
          }).addListener('click', function() {
            getInfo(this.customInfo);
          });
        }
        //get icon from dataSet
        function getIcon(data) {
          if (data[2].toString().toLowerCase().includes("drug") ||
            data[2].toString().toLowerCase().includes("other") ||
            data[2].toString().toLowerCase().includes("medical"))
            return "../../static/img/pills.png"

          else if (data[2].toString().toLowerCase().includes("robbery") ||
            data[2].toString().toLowerCase().includes("Counterfeiting") ||
            data[2].toString().toLowerCase().includes("burglary"))
            return "../../static/img/thief.png"

          else if (data[2].toString().toLowerCase().includes("firearm") ||
            data[2].toString().toLowerCase().includes("ballistics"))
            return "../../static/img/gun.png"

          else if (data[2].toString().toLowerCase().includes("harassment") ||
            data[2].toString().toLowerCase().includes("Investigate") ||
            data[2].toString().toLowerCase().includes("property"))
            return "../../static/img/loud.png"

          else if (data[2].toString().toLowerCase().includes("assault"))
            return "../../static/img/violent.png"

          else if (data[2].toString().toLowerCase().includes("motor") ||
            data[2].toString().toLowerCase().includes("auto") ||
            data[2] == "Towed")
            return "../../static/img/car.png"

          else {
            return '../../static/img/justice.png'
          }
        }

        //order of data string is important
        function getInfo(data) {
          that.msg =
          "Offense: "+ data[2] + " District: "+data[3]+
          " Address: "+ data[5]+ " Date: "+data[6]
          that.show=true;
        }
      });
    }
  }
}
</script>

<style scoped>
.container {
  padding-top: 0px;
}
* {
    box-sizing: border-box;
}

.modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    transition: opacity .3s ease;
}

.modal-container {
    width: 300px;
    margin: 40px auto 0;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
    margin-top: 0;
    color: #42b983;
}

.modal-body {
    margin: 20px 0;
}

.text-right {
    text-align: right;
}

.form-label {
    display: block;
    margin-bottom: 1em;
}

.form-label > .form-control {
    margin-top: 0.5em;
}

.form-control {
    display: block;
    width: 100%;
    padding: 0.5em 1em;
    line-height: 1.5;
    border: 1px solid #ddd;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
