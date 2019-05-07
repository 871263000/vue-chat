<script>
import Vue from 'vue';


export default {
  props: ['videochatIngInfo'],
  data () {
    return {
      zoom: 0,
      localStream: ''
    }
  },
  methods: {
    close () {
      this.localStream.release()
      this.$emit('route', {type: 'close'});
    }
  },
  mounted () {
    let localStream;
    let token = this.videochatIngInfo.token;
    let _this = this;
    let videoBox = this.$refs.video;
     /**************************************
     *               建立会话
     ***************************************/
     // 使用token新建会话，
     // 请将此处的Token替换为 从http://dashboard.shishimao.com/生成的Token
     RTCat
     .createSession(token)
     .then((session) => {

         bindSessionEvents(session);

         RTCat.createStream()
          .then((stream) => {
             _this.localStream = stream;
             displayStream('self', stream);
             session.send({stream: stream});
          })
          .catch((err) => {
             console.log(err)
          })

     })
     .catch((err) => {
         console.log(err);
     });

     function bindSessionEvents(session) {

         session.on('in', (token)=> {
             console.log('someone in', token);
             if(localStream){
                 session.sendTo({to: token, stream: localStream});
             }
         });

         session.on('out', (token)=> {
             console.log('someone out', token);
         });

         session.on('remote', (receiver)=> {
             var id = receiver.getId();
             receiver.on('stream', (stream)=> {
                 displayStream(id, stream);
             });
             receiver.once('close', ()=> {
                 // $('#v-' + id).parent().remove();
             });
         });

         session.on('disconnected', () => {
             console.log('session disconnect');
         });

     }

     /********************************
      *           工具函数
      ********************************/
     // 显示流
    function displayStream(id, stream) {

         // Video container
         // let videoContainer = document.createElement("div");
         // videoContainer.setAttribute('style', "width: 300px; height:300px;");

         // // Video player
         let videoPlayer = document.createElement('div');
         videoPlayer.setAttribute("id", "v-" + id);
         videoPlayer.setAttribute("class", "video-player");

        videoBox.appendChild(videoPlayer);

         stream.play("v-" + id, {size: {width: 500, height: 500}});

    }
    this.$nextTick( () => {

      // /*注册事件*/
      // if(mm.addEventListener) {
      //     //W3C FF
      //     mm.addEventListener('DOMMouseScroll', scrollFunc, false);
      // } 
      // //IE/Opera/Chrome/Safari
      // mm.onmousewheel = img.onmousewheel = scrollFunc; 



      // mm.onmousedown = function (e) { 
      //     var e = e || window.event;
      //     // let marginLeft = dropEl.offsetWidth/2;
      //     // console.log(dropEl.offsetWidth);
      //     // console.log(dropEl.offsetLeft);
      //     let disX = e.clientX - img.offsetLeft;
      //     let disY = e.clientY - img.offsetTop;
      //     document.onmousemove = function (e){
      //         var e = e || window.event;
      //          e.preventDefault();
      //         img.style.left = (e.clientX - disX) + 'px';
      //         img.style.top = (e.clientY - disY) + 'px';
      //     };
      //     document.onmouseup = function (){
      //         document.onmousemove = null;
      //         document.onmouseup = null;
      //     };
      // }
    })
  }
}

</script>
<template>
<transition name="modal">
	<div class="" ref="mm" >
    <div  class="video-box">
        <div id="videoBox" ref="video" >  

        </div>
        <div class="">
      <ul class="video-act">
        <li @click.stop="close"><span class="left-rotate">挂断</span></li>
        <!-- <li @click.stop=""><span class="right-rotate"><i class="iconfont-chat"></i></span></li> -->
      </ul>
    </div>
    </div>
    
  </div>
</transition>
</template>
<style type="text/css">
  .video-player {
      width: 500px;
      display: inline-block;
    }
</style>
<style lang="less" scoped>
@media screen and (max-width: 500px) {

}
@media screen and (min-width: 500px) {
  .video-box {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 9999999;
    ul {
      width: 400px;
      margin: auto;
      li {
        text-align: center;
        span {
          padding: 12px 20px;
          display: inline-block;
          background-color: #da8f8f;
          font-size: 20px;
        }
      }
    }
    
  }
  #videoBox {
    width: 1000px;
    margin: auto;
  }

}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>