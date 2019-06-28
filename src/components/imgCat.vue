<script>
import Vue from 'vue';
import AlloyFinger from 'alloyfinger/alloy_finger' // 手势库
import AlloyFingerVue from 'alloyfinger/vue/alloy_finger'

import vueTransform from 'css3transform'

Vue.use(AlloyFingerVue, {
  AlloyFinger
});
let initScale = 1;
export default {
  data () {
    return {
      zoom: 0,
      iphoneText: false,
      imgName: ''
    }
  },
  props: ['imgSrc'],
  methods: {
    pinch: function(evt) { 
      let img = this.$refs.img;
      img.scaleX = img.scaleY = initScale * evt.zoom;
    },
    rotate:function(evt){
       // let img = this.$refs.img;
        // img.rotateZ += evt.angle;
    },
    pressMove: function(evt) {

      let img = this.$refs.img;

      img.translateX += evt.deltaX;
      img.translateY += evt.deltaY;
      evt.preventDefault(); 
    },
    tap () {
        this.$emit('close');
    },
    multipointStart: function () {
       let img = this.$refs.img;
        initScale = img.scaleX;
    },
    pcRotate (direction) {
        let img = this.$refs.img;
        if (direction === 'left') {
           img.rotateZ += 90;
        } else {
            img.rotateZ -= 90;
        }
    },
    voidFun () {
      return  false;
    },
    pcClose () {
      if ( !this.iphoneText ) {
        this.$emit('close')
      }
    }
  },
  created () {

    let isMobile = function(){
        let userAgentInfo = navigator.userAgent;
        let Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod")
        let flag = false;
        for (let v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = true; break; }
        };
        return flag;
    }();
    if(isMobile){
        this.iphoneText = true;
    }
    var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    function generateMixed(n) {
         var res = "";
         for(var i = 0; i < n ; i ++) {
             var id = Math.ceil(Math.random()*35);
             res += chars[id];
         }
         return res;
    }
    this.imgName = 'omso2o' + generateMixed(10) + '.jpeg';

    this.$nextTick( () => {
      let img = this.$refs.img;
      let mm = this.$refs.mm;
      let _this = this;

      vueTransform(img);

      let scrollFunc = function(e) {
        initScale = img.scaleX;
        // e是FF的事件。window.event是chrome/ie/opera的事件
        let ee = e || window.event;
        let fx = 0;
         e.preventDefault();
        // console.log(ee); //可以看看ee.wheelDelta和e.detail在浏览器中的值；
        if(ee.wheelDelta) { //IE/Opera/Chrome   
           fx = ee.wheelDelta;
        } else if(ee.detail) { //Firefox    
            fx = ee.detail;
        }
        // let transform = _this.$refs.img.style.transform;
        if ( fx > 0) {
          img.scaleX = img.scaleY = (initScale + 0.02);
        } else {
          img.scaleX = img.scaleY = (initScale - 0.02);
        }
      }

      // /*注册事件*/
      if(mm.addEventListener) {
          //W3C FF
          mm.addEventListener('DOMMouseScroll', scrollFunc, false);
      } 
      //IE/Opera/Chrome/Safari
      mm.onmousewheel = img.onmousewheel = scrollFunc; 
      mm.onmousedown = function (e) { 
          var e = e || window.event;
          // let marginLeft = dropEl.offsetWidth/2;
          // console.log(dropEl.offsetWidth);
          // console.log(dropEl.offsetLeft);
          let disX = e.clientX - img.offsetLeft;
          let disY = e.clientY - img.offsetTop;
          document.onmousemove = function (e){
              var e = e || window.event;
               e.preventDefault();
              img.style.left = (e.clientX - disX) + 'px';
              img.style.top = (e.clientY - disY) + 'px';
          };
          document.onmouseup = function (){
              document.onmousemove = null;
              document.onmouseup = null;
          };
      }
      let clientWidth = document.body.clientWidth;
      let clientHeight = document.body.clientHeight;

      let imgWidth = this.$refs.img.width;
      let imgHeight = this.$refs.img.height;

      let clientScale = clientWidth/clientHeight;
      let imgScale = imgWidth/imgHeight;

      if ( imgWidth >  clientWidth || imgHeight > clientHeight  ) {

          if ( imgScale > clientScale ) {
              this.$refs.img.width = clientWidth;
              imgWidth = clientWidth;
              imgHeight = clientWidth/imgScale;
          } else {
              this.$refs.img.height = clientHeight;
              imgHeight = clientHeight;
              imgWidth = clientHeight * imgScale;
          }
          
      }
      this.$refs.imgCatBox.style.marginLeft = -imgWidth/2 + 'px'; 
      this.$refs.imgCatBox.style.marginTop = -imgHeight/2 + 'px'; 
    })
  }
}

</script>
<template>
<transition name="modal">
	<div class="modal-mask" ref="mm" @click.stop ="pcClose()">
    <div class="pc-close" @click.stop ="$emit('close')">
      <span class="iconfont-chat">
        &#xe660;
      </span>
    </div>
    <div class="img-cat-box" ref="imgCatBox" @click.stop="voidFun()">
      <img :src="imgSrc" ref="img" v-finger:pinch="pinch"
    v-finger:press-move="pressMove"  v-finger:rotate="rotate" v-finger:multipoint-start="multipointStart">  
<!--       	<slot name="body">
        		没有数据！
      	</slot> -->
    </div>
    <div class="img-handle">
      <ul class="">
        <li @click.stop="pcRotate('left')"><span class="left-rotate"><i class="iconfont-chat">&#xe626;</i></span></li>
        <li @click.stop="pcRotate('right')"><span class="right-rotate"><i class="iconfont-chat">&#xe63c;</i></span></li>
        <li><a :href="imgSrc + '?attname=' + imgName" download="" ><i class="iconfont-chat">&#xe606;</i></a></li>
      </ul>
    </div>
  </div>
</transition>
</template>
<style lang="less" scoped>
@media screen and (max-width: 500px) {

.modal-mask {
  position: fixed;
  z-index: 9999999999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  display: table;
  transition: opacity .3s ease;
  .img-handle {
    width: 100%;
    height: 50px;
    background-color: rgba(0, 0, 0, 0.5);
    margin: auto;
    position: absolute;
    bottom: 0;
    z-index: 999;
    box-shadow: 0 0 20px #2d2d2d;
    border-radius: 7px;
    text-align:center;
    ul {
      display: inline-block;
      width: 100%;
      li {
        width: 30%;
        height: 50px;
        line-height: 50px;
        display: inline-block;
        text-align: center;
        cursor: pointer;
        i {
          font-size: 33px;
          color: #fff;
        }
      }
    }
  }
}
.img-cat-box {
  position: fixed;
  z-index: 1;
  top: 50%;
  left: 50%;
  img {
        left: 0px;
    top: 0px;
    position: absolute;
  }
}
.pc-close {
      width: 50px;
      height: 50px;
      position: fixed;
      right: 0px;
      top: 0px;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 999;
      box-shadow: rgb(45, 45, 45) 0px 0px 20px;
      text-align: center;
      cursor: pointer;
     span {
          font-size: 36px;
          color: #fff;
          display: inline-block;
          height: 100%;
          text-align: center;
          line-height: 50px;
     }
  }
.modal-wrapper {
  margin-top: 20px;
  //display: table-cell;
  vertical-align: middle;
}

.modal-container {
  max-width: 400px;
  width: 100%;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}
.modal-header{
  text-align: center;
  font-size: 18px;
}
.modal-footer {
  text-align: right;
}
.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
    color: #fff;
    background-color: #5bc0de;
    border-color: #46b8da;
  display: inline-block;
  padding: 6px 12px;
  margin-bottom: 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.42857143;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-image: none;
  border: 1px solid transparent;
  border-radius: 4px;
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

}
@media screen and (min-width: 500px) {
.modal-mask {
  position: fixed;
  z-index: 9999999999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  display: table;
  transition: opacity .3s ease;
  .img-handle {
    width: 600px;
    height: 50px;
    background-color: rgba(0, 0, 0, 0.5);
    margin: auto;
    position: absolute;
    bottom: 0;
    left: 50%;
    z-index: 999;
    margin-left: -300px;
    box-shadow: 0 0 20px #2d2d2d;
    border-radius: 7px;
    text-align:center;
    ul {
      display: inline-block;
      li {
        width: 160px;
        height: 50px;
        line-height: 50px;
        display: inline-block;
        text-align: center;
        cursor: pointer;
        i {
          font-size: 33px;
          color: #fff;
        }
      }
    }
  }
}
.img-cat-box {
  position: fixed;
  z-index: 1;
  top: 50%;
  left: 50%;
  img {
        left: 0px;
    top: 0px;
    position: absolute;
  }
}
.pc-close {
      width: 50px;
      height: 50px;
      position: fixed;
      right: 0px;
      top: 0px;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 999;
      box-shadow: rgb(45, 45, 45) 0px 0px 20px;
      text-align: center;
      cursor: pointer;
     span {
          font-size: 36px;
          color: #fff;
          display: inline-block;
          height: 100%;
          text-align: center;
          line-height: 50px;
     }
  }
.modal-wrapper {
  margin-top: 20px;
  //display: table-cell;
  vertical-align: middle;
}

.modal-container {
  max-width: 400px;
  width: 100%;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}
.modal-header{
  text-align: center;
  font-size: 18px;
}
.modal-footer {
  text-align: right;
}
.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
    color: #fff;
    background-color: #5bc0de;
    border-color: #46b8da;
  display: inline-block;
  padding: 6px 12px;
  margin-bottom: 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.42857143;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-image: none;
  border: 1px solid transparent;
  border-radius: 4px;
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
}

</style>