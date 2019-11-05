<template>
  <div v-html="content"></div>
</template>
<script>
import Vue from "vue";
import emojis from "../../common/emojis";
export default {
  name: "hello",
  props: ["items"],
  data() {
    return {
      content: this.items.content
    };
  },
  created() {
    this.content = this.content.replace(/&lbrg/g, "<br>")
    .replace(/(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)[^\]]/g, function (y, u) {
      if ( y.indexOf('http://omso2o.com') != -1 ) {
        return y;
      }
      if ( content.indexOf('-liveVideo-[') != -1 ) {
        return y;
      }
      // if ( y.indexOf('7xq4o9') != -1 ) {
      //   return y;
      // }
      let a = '<a href="'+y+'" target="_blank">'+y+'</a>';
      return a;
    })
    .replace(/\[(.{1,3})\]/g, function(r, f) {
      let em = emojis.find(em => {
          return em.name == f;
      });
      if ( !em ) {
        return r;
      }
      let img = '<img width="20px"  src="https://www.omso2o.com/chatStatic/emoji/'+em.num+'@2x.png" alt="'+em.name+'" />'
      return img;
    });
    // this.content = this.content.replace(/&lbrg/g, "<br>");
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
