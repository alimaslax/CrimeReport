const store = {
  data: {
    msg:'hii',
    count:[]
  },
  methods:{
    setCount(data){
      store.data.count.pop();
      store.data.count.push(data);
    }
  }
};
export default store;
