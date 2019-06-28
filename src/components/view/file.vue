<template>
  <div
    class="chat-file"
    style="-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;"
  >
    <div class="iconfont-chat chat-share" @click="share">&#xe6cb;</div>
    <a title :href="src + '?attname=' " :download ="alt">
      <i class="iconfont-chat">&#xe662;</i>
      <p title>{{alt}}</p>
    </a>
  </div>
</template>
<script>
import Vue from "vue";
export default {
  name: "hello",
  props: ["items"],
  data() {
    return {
      content: this.items.content,
      src: '',
      alt: ''
    };
  },
  methods: {
    share ()  {
      this.$emit('share');
    }
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
.chat-file {
  text-align: center;
  width: 180px;
  position: relative;
  .chat-share {
    position: absolute;
    font-size: 20px;
    top: 0;
    right: 0;
    padding: 10px;
    cursor: pointer;
  }
  a {
      text-decoration: none
  }
  i {
    width: 56px;
    height: 56px;
    display: inline-block;
    font-size: 58px;
    text-align: center;
    line-height: 56px;
    padding: 5px;
    color: #000;
  }
}
</style>
