<template>
  <div
    class="msgBox"
    @click="audioClick()"
    style="-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;"
  >
    <audio ref="audio"  :src = "'http://omso2o.com/' + src"></audio>
    <div class="right" v-if="self">
      <span>{{num}}"</span>
      <img
        v-if="playStatus == 0"
        :src="user.documentUrlOms + '/chat/images/voice_right.png'"
        width="20px"
        height="20px"
        alt
      >
      <img v-if="playStatus != 0" :src="user.documentUrlOms + '/chat/images/voice_right_1.gif'" alt>
    </div>
    <div class="left" v-else>
      <span v-if="num">{{num}}"</span>
      <img
        v-if="playStatus == 0"
        :src="user.documentUrlOms + '/chat/images/voice_left.png'"
        width="20"
        height="20"
      >
      <img v-if="playStatus != 0" :src="user.documentUrlOms + '/chat/images/voice_left.gif'" alt>
    </div>
  </div>
</template>
<script>
import Vue from "vue";

import { mapState } from "vuex";
export default {
  props: ["items"],
  data() {
    return {
      content: this.items.content,
      playStatus: 0,
      self: this.items.self,
      src: "",
      num: 0
    };
  },
  computed: mapState({
    user: ({ user }) => user
  }),
  methods: {
    audioClick() {
      if (this.playStatus == 0) {
        this.$refs.audio.play();
        this.playStatus = 1;
      } else {
        this.$refs.audio.pause();
        this.playStatus = 0;
      }
    },
    onended() {
      // this.playStatus = 0;
    }
  },
  created() {
    // this.content = "暂不支持语音请到手机上查看";
    let res = this.content.match(/-audio-\[(.*?)\]/);
    if (res[1]) {
      let zArr = res[1].split("|");
      if (zArr[1]) {
        this.src = zArr[1];
        this.num = Math.ceil(zArr[0]);
      }
    }
    
  },
  mounted () {
this.$refs.audio.onended = () => {
      this.playStatus = 0;
    }
  }

};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.msgBox {
  width: 50px;
  max-width: 500px;
  min-height: 1em;
  display: inline-block;
  vertical-align: top;
  position: relative;
  text-align: left;
  font-size: 14px;
  border-radius: 3px;
  -moz-border-radius: 3px;
  -webkit-border-radius: 3px;
}
.left {
  span {
    position: absolute;
    right: -77px;
    width: 55px;
    color: #888;
    cursor: default;
  }
}
.right {
  span {
    position: absolute;
    left: -77px;
    width: 55px;
    color: #888;
    cursor: default;
  }
}
</style>
