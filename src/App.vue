<template>
  <div id="chat-app">
    <!-- <mp v-if="ph == 'mp'"></mp> -->
    <pc></pc>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState } from "vuex";
require("./assets/css/aliIcon.css");

// Vue.component('mp', function (resolve) {
//     require(['./components/mp'], resolve);
// });
Vue.component("pc", function(resolve) {
  require(["./components/pc"], resolve);
});
// const Loadmore = require('vue-loadmore').default;
export default {
  data() {
    return {
      ph: ""
    };
  },
  computed: mapState({
    isPhone: state => {
      return state.isPhone;
    }
  }),
  mounted() {
  },
  methods: {}
};
</script>

<style lang="less">
.chat-live-video {
  line-height: 20px;
  height: 29px;
  display: inline-block;
  padding: 5px;
  background-color: #dc2b2b;
  color: #ffffff;
  width: 100px;
  text-align: center;
  margin: 10px;
  text-decoration: none !important;
}
</style>

