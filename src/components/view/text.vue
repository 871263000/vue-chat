<template>
  <div class="text" v-html="content"></div>
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
<style scoped lang="less">
.text {
  background-color: #b2e281;

  &:before {
    right: inherit;
    left: 100%;
    border-right-color: transparent;
    border-left-color: #b2e281;
  }
}
.text {
  display: inline-block;
  position: relative;
  padding: 3px 5px;
  max-width: ~"calc(100% - 80px)";
  min-height: 30px;
  font-size: 18px;
  text-align: left;
  word-break: break-all;
  background-color: #fafafa;
  border-radius: 4px;
  line-height: 25px;
  font-family: 微软雅黑;
  &:before {
    content: " ";
    position: absolute;
    top: 9px;
    right: 100%;
    border: 6px solid transparent;
    border-right-color: #fafafa;
  }
}
.text {
  background-color: #b2e281;

  &:before {
    right: inherit;
    left: 100%;
    border-right-color: transparent;
    border-left-color: #b2e281;
  }
}
</style>
