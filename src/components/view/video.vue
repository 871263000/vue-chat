<template>
  <div>
    <video controls="controls" style="width: 200px; height: 200px" :src="src"></video>
  </div>
</template>
<script>
import Vue from "vue";
export default {
  props: ["items"],
  data() {
    return {
      content: this.items.content,
      src: '',
      alt: ''
    };
  },
  created() {
    let m = "";
    this.content.replace(/\[(.*?)\]$/g, (c, n) => {
      let zArr = n.split("|");
      if (zArr[1]) {
        zArr[1].replace(
          /http\:\/\/7xq4o9\.com1\.z0\.glb\.clouddn\.com/,
          "http://omso2o.com"
        );
      }
      this.src = zArr[1];
      this.alt = zArr[0];
    });
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
