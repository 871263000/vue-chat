<template>
  <message-list :level="1" :items="items" @share="share()" @enlarge="enlarge"></message-list>
</template>

<script>
import Vue from "vue";
import text from "./text";
import image from "./image";
import file from "./file";
import none from "./none";
import audio from "./audio";
import revoke from "./revoke";
import video from "./video";
import liveVideo from "./liveVideo";

Vue.component("message-list", {
  functional: true,
  props: {
    items: {
      type: Object,
      required: true
    }
  },
  render(createElement, context) {
    let items = context.props.items;
    let type = '';
    switch (items.mesages_types) {
      case "text":
        type = text;
        break;
      case "image":
        type = image;
        break;
      case "file":
        type = file;
        break;
      case "audio":
        type = audio;
        break;
      case "revoke":
        type = revoke;
        break;
      case "video":
        type = video;
        break;
      case "liveVideo":
        type = liveVideo;
        break;
      default:
        type = none;
        break;
    }
    return createElement(type, {
      props: {
        items
      },
      on: context.listeners
    });
  }
});
export default {
  props: ["items"],
  data() {
    return {
      msg: ""
    };
  },
  methods: {
    share() {
      this.$emit("share", this.items);
    },
    enlarge(src) {
      this.$emit("enlarge", src);
    }
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
