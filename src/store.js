import axios from 'axios';

const store = {
  data: {
    msg:'hii',
    counts: [],
    results: []
  },
  methods: {
    init: function() {
      async function f1() {
        var x = await new Promise(resolve => {resolve(store.methods.getCount("DISTRICT"));});
        store.data.counts.push(x);
      }
      f1();
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
  var r =    axios.request({
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
    getSearch: function(search) {
      var query = [];
      //reset data
      store.data.results.pop();

      function array() {
        if (search.years.length >= 1)
          query.push({
            term: "YEAR",
            data: search.years
          });
        if (search.months.length >= 1)
          query.push({
            term: "MONTH",
            data: search.months
          });
        if (search.days.length >= 1)
          query.push({
            term: "DAY_OF_WEEK",
            data: search.days
          });
      }
      var k = new Promise((resolve, reject) => {
        resolve(array());
      }).then(() => {
        return this.fetch(this.getQuery(query));
      });

      Promise.all([k]).then(function(values) {
        store.data.results.push(values);
      });
    },
    fetch: function(query) {
      var r = axios.request({
          method: 'Post',
          url: '/search/crime/_search',
          data: JSON.parse(query),
          responseType: 'json'
        })
        .then((response) => {
          return response.data;
        }, (error) => {});
      return r;
    },
    //returns elastic search query
    getQuery: function(arr) {
      var must = '';
      if (Array.isArray(arr)) {
        var temp = '';
        var array = [];
        //go through top level
        for (var i = 0; i < arr.length; i++) {
          if (arr[i]["data"].length > 1) {
            array = arr[i]["data"];
            for (var key in array) {
              temp += '{ "match" : { "' + arr[i]["term"] + '" : "' + array[key] + '" } }';
              if (key != array.length - 1)
                temp += ',';
            }
            must += '{ "bool": { "should": [ ' + temp + '] } }';
            temp = '';
          } else {
            must += '{ "match" : { "' + arr[i]["term"] + '" : "' + arr[i]["data"] + '" } }';
          }
          //add coma if not end
          if (i != arr.length - 1)
            must += ',';
        }
        var query1 = '{"size":0, "query": { "constant_score": { "filter": { "bool": { "must": [' + must + '] } } } } }';
        return query1;
      }
      //not an array: Column agg
      else
        return '{ "size": 0, "aggs": { "sum": { "terms": { "field": "' + arr + '.keyword", "size":500 } } } }';
    },
    promise: function(x) {
      return new Promise(resolve => {
        resolve(this.getCount(x));
      });
    }
  }
}
export default store;
