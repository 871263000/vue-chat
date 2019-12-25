<template>
<div id="chat-app" v-if="!this.iPhone">
    <div title="按[esc]键最大化" class="chat-min" v-if="!chatMainShow" @click="mainShowF()">
        <i class="mesNum" v-if="mesNum > 0">
            {{mesNum > 99 ? '99+' : mesNum }}
        </i>
        <i><img src="../assets/liaotian.png" alt=""></i>
    </div>
    <searchOrg v-if="searchFriendShow" @close="searchFriendShow = !searchFriendShow"></searchOrg>
    <video-chat v-if="videoChat" :videoChatType="videoChatType" @route="controller"></video-chat>
    <video-res v-if="videoChatShow" :videoChatInfo="videoChatInfo" @route="videoResConttroll" ></video-res>
    <video-chat-ing v-if="videoChatIngShow" :videochatIngInfo="videochatIngInfo" @route="videoChatIng" ></video-chat-ing>
    <transition name="show">
        <div id="chat-main"  class="chat-main" ref="chatDrop" v-if="chatMainShow">
            <div v-if="!complete" class="mask">
                <div class="img">
                    <img src="../assets/loade.gif" alt="">
                </div>
            </div>
             <div class="term">
                <menuList @route="uiShow"></menuList>
            </div>

            <div class="sidebar">
                <card @mainShow="mainShow = false"></card>
                <list @mainShow="mainShow = false" @route="listR" @perInfoShow="persInfo = true"></list>
            </div>
            <div class="">
                
            </div>
            <div class="main" v-if="!mainShow">
                <div class="windowList" v-if="!iPhone">
                    <ul>
                        <li title="按[esc]键最小化 " @click.stop="chatMainShow = !chatMainShow">X</li>
                    </ul>
                </div>

                <message @mainShow="mainShow = true" @enlarge="imgShow"></message>
                <!-- img放大 -->
                <imgFd v-if="dImgShow" @close="dImgShow = false" :imgSrc="imgSrc">
                    <!-- <div slot="imgBody" v-html="imgfdBoxinfo"></div> -->
                </imgFd>
                <!-- 个人信息 -->
                <persInfo v-if="persInfo" @imgShow="dImgShow = true" @close="persInfo = false"></persInfo>

                <TextAre @enlarge="imgShow" @route="controller"></TextAre>
            </div>
              <!--  隐藏聊天 -->
            <div class="dialog-title" v-if="mainShow">
                <i class="backSession" @click.stop="mpMainHid()"></i>
                <span class="text-left dialogue-title-name">聊天</span>
            </div>
        </div>
    </transition>
    
</div>

</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import axios from '../libs/util'
// import vueR from 'vue-resource';
// Vue.use(vueR);
import Card from './card'
import menuList from './menuList'
import List from './list'
import TextAre from './text'
import Message from './message'

Vue.prototype.$http = axios.ajax;

require('../assets/css/aliIcon.css');

Vue.component('imgFd', function (resolve) {
  require(['./imgCat'], resolve)
});

Vue.component('mp', function (resolve) {
    require(['./mp'], resolve);
});
Vue.component('mp', function (resolve) {
    require(['./mp'], resolve);
});


Vue.component('searchOrg', function (resolve) {
    require(['./searchOrg'], resolve);
});

Vue.component('videoChat', function ( resolve ) {
    require(['./videoChat'], resolve);
});
Vue.component('video-res', function ( resolve ) {
    require(['./videoRes'], resolve);
});
Vue.component('video-chat-ing', function ( resolve ) {
    require(['./videoChatIng'], resolve);
});

// const Loadmore = require('vue-loadmore').default;

export default {
    name: 'app',
    components: {Card, menuList, List, Message, TextAre},
    computed: mapState({
        complete: (state) => {
            return state.events.complete
        },
        mesNum: (state) => {
            let mesNum = 0;
            state.sessions.forEach(function (m) {
                mesNum += m.messageNum;
            });
            return mesNum;
        },
        videoChatShow: (state) => {
            return state.events.videoChatShow;

        },
        videoChatInfo: (state) => {
            return state.events.videoChatInfo;
        }

    }),
    data () {
        return {
            chatMainShow: false,
            mainShow: false,
            dImgShow: false,
            imgSrc: '',
            persInfo: false,
            searchFriendShow: false,
            videoChat: false,
            videoChatType:'',
            videochatIngInfo: {},
            videoChatIngShow: false,
            iPhone: true
        }
    },
    mounted () {

        document.addEventListener("deviceready", onDeviceReady, false);    // device APIs are available    //      
      
         function onDeviceReady() {          
            document.addEventListener("resume", onResume, false);      
         }      
      
            // Handle the resume event    //      
        function onResume() {    
            //回到前台后  调用这里  
             this.init();
        }
        this.init();
        
        
    },
    methods: {
        imgShow (img) {
            this.imgSrc = img;
            this.dImgShow = true;
        },
        uiShow (parm, type) {
            if ( type == 'addFriend' ) {
                this.searchFriendShow = true;
            }
        },
        listR (para, type) {
            if ( type == 'friendAdd' ) {
                this.searchFriendShow = true;
            }
        },
        controller (data) {
            if ( data.type == 'videoChat') {
                this.videoChat = true;
                this.videoChatType = 'videoChat';
            }
            if ( data.type == 'close' ) {
                this.videoChat = false;
            }
            if ( data.type == 'videoShow' ) {
                this.videoChatIngShow = true;
                this.videochatIngInfo = data.para;
            }
        },
        videoResConttroll (data) {
            if ( data.type == 'close' ) {
                this.$store.dispatch('videoChatShowChange');
            } else if (data.type == 'videoShow') {
                this.videoChatIngShow = true;
                this.videochatIngInfo = data.para;
            }
        },
        videoChatIng (data) {
            if ( data.type == 'close' ) {
                 this.videoChatIngShow = false;
            }
        },
        init () {
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
                this.iPhone = true;
                this.mainShow = true;
            }
            document.onkeydown =  (e) => {  
                if (e.keyCode == 27 ) {
                    this.chatMainShow = !this.chatMainShow;
                };
            }
            // 请求人员信息
            let json = '/omsIm/demo/json/getList.php';
            let jsonMessage = '/omsIm/demo/json/getList.php?class=mesNum';
            let appPushMessage = '/omsIm/demo/json/getList.php?class=appPush&mesNum=';
            
            axios.ajax.get(json)
            .then((response) => {
                this.$store.dispatch('initData', response.data);
                if (response.data.data.mine.isPhone) {
                    this.iPhone = true;
                    return ;
                } else {
                    this.iPhone = false;
                }
                // 请求消息数量
                axios.ajax.get(jsonMessage)
                    .then((response) => {
                        this.$store.dispatch('acceptMes', response.data.msgNum.reverse());
                        for(var i in response.data.revoke) {
                            this.$store.dispatch('revokeMes', {message_id: response.data.revoke[i].id});
                        }
                        // qpp 推送
                        // if (this.iPhone) {
                        //     axios.ajax.get(appPushMessage + this.mesNum)
                        //     .then((response) => {
                        //     })
                        //     .catch(function(response) {
                        //         console.log(response)
                        //     });
                        // }
                        

                    })
                    .catch(function(response) {
                        console.log(response)
                    });
            })
            .catch(function(response) {
                console.log(response)
            });
        },
        mpMainHid () {
            if (  this.iPhone ) {
                document.body.style.overflow = 'auto';
            }
            this.chatMainShow = false;
        },
        mainShowF () {
            if (  this.iPhone ) {
                document.body.style.overflow = 'hidden';
            }
            this.chatMainShow = !this.chatMainShow;
        }
    },

}

</script>

<style lang="less">
body, html {
    height: 100%;
}
body {
    margin: 0;
    font: 14px/1.4em 'Helvetica Neue', Helvetica, 'Microsoft Yahei', Arial, sans-serif;
    background-size: cover;
    font-smoothing: antialiased;
    width: 100%;
    height: 100%;
}
ul {
    margin: 0;
    padding: 0;
    li {
      list-style-type: none;
    }
}
img{
    vertical-align: middle;
}
*{
    -moz-box-sizing: border-box;  -webkit-box-sizing: border-box; -o-box-sizing: border-box; -ms-box-sizing: border-box; box-sizing: border-box;
}
a {
     text-decoration:none;
}
</style>
<style lang="less" scoped>
@media screen and (max-width: 500px) {
    #chat-app{
        width: 100%;
        
    }
    #chat-main, .main{
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        z-index: 9999999;
        background-color:#fff;
        overflow: hidden;
    }
    .chat-min {
        position: fixed;
        z-index: 999999;
        bottom: 50px;
        left:50px;
    }
    .mesNum{
        position: absolute;
        text-align:center;
        line-height: 26px;
        top: -9px;right: -13px;
        background-color: #ca4646;
        color: #fff;
        border-radius: 13px;
        width:26px;
        height:26px;
    }
    .term{
        width: 100%;
        height: 50px;
        position: fixed;
        z-index: 999;
        cursor: pointer;
        background-color: #f9f9f9;
        bottom: 0;
        left: 0;
        border-top: 1px solid #ccc;
    }
    .sidebar{
        position: absolute;
        top: 46px;
        left: 0;
        width: 100%;
        bottom: 50px;
    }
    .windowList{
        display: none;
    }
    .main{
        position:absolute;
        top: 0;
        left: 0;
        bottom: 0;
        z-index: 999;
        background-color: #efeff4;
    }
    .dialog-title {
        height: 45px;
        border-bottom: 1px solid #ccc;
        cursor: move;
        background-color: rgb(48, 48, 54);
        color: #fff;
        text-align: center;
        .dialogue-title-name {
            height: 100%;
            line-height: 45px;
            font-size: 20px;
            display: inline-block;
        }
        .backSession {
            position: absolute;
            top: 0;
            left: 10px;
            display: inline-block;
            width:32px;
            height:45px;
            line-height: 45px;
            background: url('../assets/xyjt.png') center no-repeat;
        }
    }
    .mask {
        background-color: rgba(255,255,255,0.8);
        position: absolute;
        top:0;
        left:0;
        width:100%;
        height:100%;
        z-index:999999;
        .img {
            position: relative;
            top:50%;
            margin-top:-16px;
            text-align:center;
            vertical-align:middle;
            width:32px;
            line-height:100%;
            height:100%;
            margin:auto;
        }
    }
}
@media screen and (min-width: 500px) {

.chat-min {
    cursor: pointer;
    position: fixed;
    z-index: 999999;
    bottom: 50px;
    left:50px;
}
.mesNum{
    position: absolute;
    text-align:center;
    line-height: 26px;
    top: -9px;right: -13px;
    background-color: #ca4646;
    color: #fff;
    border-radius: 13px;
    width:26px;
    height:26px;
}
.show-enter-active {
    transition: 0.8s;
    transform: scale(1,1);
    opacity: 1;
}
.show-enter, .show-leave-active{
    transition: 0.5s;
    opacity: 0;
    transform: scale(0.01,0.01);
    bottom: 29px; 
    right: 29px;
}

.windowList{
    height: 5px;
    ul {
        float: right;
        li {
            padding: 10px 15px;
            font-size: 20px;
            cursor: pointer;
        }
    }
}
#chat-main {
    width: 860px;
    height: 600px;
    position: fixed;
    z-index: 99999;
    top: 20px;
    left: 50%;
    margin-left: -430px;
    border-radius: 3px;
    box-shadow: 0 0 20px #1d1d1d;
    .mask {
        background-color: rgba(255,255,255,0.8);
        position: absolute;
        top:0;
        left:0;
        width:100%;
        height:100%;
        z-index:999999;
        .img {
            position: relative;
            top:50%;
            margin-top:-16px;
            text-align:center;
            vertical-align:middle;
            width:32px;
            line-height:100%;
            height:100%;
            margin:auto;
        }
    }
    .sidebar, .main, .term {
        height: 100%;
    }
    .term {
        float: left;
        color: #f4f4f4;
        background-color: #2e3238;
    }
    .sidebar {
        float: left;
        width: 252px;
        color: #f4f4f4;
        border-bottom: 1px solid #ccc;
        border-top: 1px solid #ccc;
        /*background-color:#38354a;*/
        background-color:#f9f9f9;
    }
    .main {
        border: 1px solid #ccc;
        position: relative;
        overflow: hidden;
        background-color: #eee;
    }
    .text {
        position: absolute;
        width: 100%;
        bottom: 0;
        left: 0;
    }
    .message {
        height: ~'calc(100% - 160px)';
    }
    ul {
      margin: 0;
      padding: 0;
    }
}
}


</style>

