<template>
  <div>
    <span @click="callEntry()" style="color: #000AEB;cursor: pointer">
      <i class="iconfont-chat">&#xe644;</i> 视频通话进入
    </span>
  </div>
</template>
<script>
import Vue from "vue";
import { mapState } from "vuex";
export default {
  name: "hello",
  props: ["items"],
  data() {
    return {
      content: this.items.content
    };
  },
  computed: mapState({
    dialogType: state => {
      return state.currentSessionType;
    },
    dialogId: state => {
      return state.currentSession.id;
    }
  }),
  methods: {
    callEntry() {
      let tp = 1,
        fid = "",
        m = "";
      if (this.dialogType == "message") {
        tp = 1;
      } else {
        tp = 2;
      }
      fid = this.dialogId;
      let liveVideoUrl =
        "https://www.omso2o.com/video_chat_gateway.php?tp=" + tp + "&fid=" + fid;
        window.open(liveVideoUrl);
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
