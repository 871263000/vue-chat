<template>
  <message-list :level="1" :items="items"></message-list>
</template>

<script>
import Vue from "vue";
import text from "./text";
import image from "./image";
import file from "./file";

Vue.component("message-list", {
  functional: true,
  props: {
    items: {
      type: Object,
      required: true
    }
  },
  render: function(createElement, context) {
    let items = context.props.items;
    let type;
    switch (items.mesages_types) {
      case "text":
        type = text;
        break;
      case "image":
        type = image;
        break;
    }
    return createElement(type, {
      props: {
        items
      }
    });
  }
});
export default {
  name: "hello",
  props: ["items"],
  data() {
    return {
      msg: "Welcome to Your Vue.js App"
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
