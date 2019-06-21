<template>
  <div v-html="content"></div>
</template>
<script>
import Vue from "vue";
export default {
  name: "hello",
  props: ["items"],
  data() {
    return {
      content: this.items.content
    };
  },
  created() {
      console.log(this.content);
    this.content = this.content.replace(/&lbrg/g, "<br>");
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
