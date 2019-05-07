<script>
import	Vue from 'vue';
import	{ mapState } from 'vuex';
import { reverse } from '../messageHandel';
Vue.component('asyncModal', function (resolve) {
  require(['./modal'], resolve)
});

// 图片放大
Vue.component('imgFd', function (resolve) {
  require(['./imgCat'], resolve)
});

Vue.component('MshowModal', function (resolve) {
  // 这个特殊的 require 语法告诉 webpack
  // 自动将编译后的代码分割成不同的块，
  // 这些块将通过 Ajax 请求自动下载。
  require(['./selectFriends'], resolve)
});


let scrollHeight = 0;

export default {
	data () {
		return {
            shareShow: false,
			p: 1,
			messagesLog: [],
            scrollHeight: 0,
            showImg: false,
            imgfdBoxinfo: '',
            forwardInfo: {
                mouseLeftShow: false,
                forwardContent: '',
                forwardId: 0,
                messageOfSelf: false
            }
		}
	},
	computed: mapState({
		user: (state) => state.user,
		dig: (state) => state.currentSession,
        currentSessionType: (state) => state.currentSessionType,
	}),
	props: ['show'],
	methods: {
        content ( content,self ) {
            if ( content.indexOf('-voice-[') !== -1 ) {
               content =  content.replace(/-(voice)-\[(.*?)\]/g, function (f, i, z) {
                  let m = '';
                  let zArr = z.split('|');

                  if ( z[1] ) {
                    if ( self ) {
                      m = '<voice class="iconfont-chat" data-content="'+zArr[1]+'">&#xe604;<i class="playingRight"></i></voice>';
                    } else {
                      m = '<voice class="iconfont-chat" data-content="'+zArr[1]+'">&#xe605;<i class="playingLeft"></i></voice>';
                    } 
                  };
                  return m;
                });
               return content;
            }
            return reverse(content);
        },
        loadMroe (e) {
            if ( e.target.scrollTop == 0 ) {
                this.getMessage();
            }
        },
        getMessage () {
            let type = '';
            let _this = this;
            if(this.currentSessionType == 'message') {
                type = 'friend';
            } else {
                type = 'group';
            }
            this.$http.get('/omsIm/demo/json/getList.php', {params: {
            // this.$http.get('/static/omsIm/demo/json/chatMessage.js', {params: {
                    p: this.p,
                    id: this.dig.id,
                    type: type,
                    class: 'page'

                }
            })
            .then( (response) => {
                // console.log(response);return;
                let vm = this;
                if ( response.data ) {
                    this.p ++;
                    this.messagesLog.unshift.apply(this.messagesLog, response.data.data.reverse());
                    vm.$nextTick(function () {
                        _this.$refs.scrollBox.scrollTop = _this.$refs.scroll.offsetHeight - scrollHeight;
                        scrollHeight = _this.$refs.scroll.offsetHeight;
                    })
                }
                
            });
        },
        imgFd (e) {
            if ( e.target.nodeName == 'IMG' ) {
                let img = e.target.src;
                // this.imgfdBoxinfo = img;
                this.$emit('imgShow', img);

                // this.showImg = true;
            }
            if ( e.target.nodeName == 'VOICE' ) {
                this.$refs.audio.onended = function() {
                    _this.playComplete = false;
                    e.target.children[0].style.display = 'none';
                };
                this.$refs.audio.src = e.target.getAttribute('data-content');
                e.target.children[0].style.display = 'inline-block';
                this.$refs.audio.play();
                this.playComplete = true;
                

            }
        },
        close () {
            this.$emit('close')
        },
        mouseLeft (e, content, id, self) {
            let posiX = e.pageX;
            let posiY = e.pageY;
            this.forwardInfo.mouseLeftShow = true;
            this.$nextTick(function () {
                this.$refs.mouseLeft.style.top = (posiY + 2) + 'px';
                this.$refs.mouseLeft.style.left = (posiX + 2) + 'px';
            });
            this.forwardInfo.forwardContent = content;
            this.forwardInfo.forwardId = id;
            this.forwardInfo.messageOfSelf = self;

        },
        forward (content) {
            this.shareShow = true;
            this.shareContent = content;
            this.forwardInfo.mouseLeftShow = false;
        },
        share (selectedMan) {
            let data = {};
            for (let i in selectedMan) {
                data.senderId = this.user.id;
                data.name = selectedMan[i].name;
                data.img = selectedMan[i].avatar;
                data.type = selectedMan[i].type;
                data.id =  selectedMan[i].id;
                data.content = this.shareContent;
                if ( data.content ) {
                    this.$store.dispatch('batchSendMessage', data);
                    alert('已分享！');
                    return ;
                }
                alert('分享失败！');
                return false;

            }
            
        },

    },
	created () {
        document.addEventListener('click', (e)=> {
            console.log(343);
            this.forwardInfo.mouseLeftShow = false;
        });
        this.$nextTick(function () {
           this.getMessage();

        });

	}
}

Vue.directive('scroll-bottom', function(el) {
    Vue.nextTick(() => {
            let allImg = el.getElementsByTagName('img');
            let imgLength = 0;
            let imgLengthT = 0;
            for (let i = 0; i <= allImg.length -1; i++ ) {
                if ( allImg[i].getAttribute('class') == 'chat-img' ) {
                    imgLength++;
                    allImg[i].onload = function () {
                        loadCom();
                    }
                }
            }
            let loadCom = function () {
                imgLengthT++;
                if ( imgLengthT == imgLength ) {
                    el.scrollTop = el.scrollHeight - el.clientHeight;
                }

            }
            el.scrollTop = el.scrollHeight - el.clientHeight;
    });
})
</script>
<template>
<div>
    <audio ref="audio"></audio>
    <div class="mouseLeft" ref="mouseLeft" v-if="forwardInfo.mouseLeftShow">
        <ul>
            <li @click="revoke()" v-if="forwardInfo.messageOfSelf">撤回</li>
            <li @click ="forward(forwardInfo.forwardContent)">转发</li>
        </ul>
    </div>
 <!-- img放大 -->
    <imgFd v-if="showImg" @close="showImg = false" :imgSrc="imgfdBoxinfo">
        <!-- <div slot="imgBody" v-html="imgfdBoxinfo"></div> -->
    </imgFd>
	<asyncModal v-if="show" @close="close">
		<div slot="header">
			与 {{ dig.name }} 的聊天记录
		</div>
		<div slot="body" ref="scrollBox" @scroll="loadMroe($event)"  class="message-log">
		    <ul ref="scroll" v-scroll-bottom="messagesLog">
		        <li v-for="item in messagesLog">
		            <p class="time">
		                <span>{{ item.timestamp}}</span>
		            </p>

                    <div class="main" :class="{ self: item.id == user.id }">
                        <img class="avatar" width="40" height="40" :src="item.id == user.id ? user.documentUrlOms  + user.img : (item.avatar.indexOf('http') == -1 ? user.documentUrlOms  + item.avatar : item.avatar )" />

                        <div v-if="currentSessionType == 'groupMessage' && item.id != user.id" class="groupName">{{item.username}}</div>

                        <div @contextmenu = "mouseLeft($event, item.content, item.id, item.self)"  v-oncontextmenu ="item.content" class="text" @click.stop="imgFd($event)" v-html="content(item.content, item.id == user.id)"></div>
                    </div>
		        </li>
		    </ul>
		</div>
	</asyncModal>
        <MshowModal v-if="shareShow" @close="shareShow =false" @selectedMan="share" :group="true">
        
    </MshowModal>
</div>
</template>
<style lang="less">
    .chat-file {
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
        .chat-share {
            position: absolute;
            font-size: 20px;
            top: 0;
            right: 0;
            padding: 10px;
            cursor: pointer;
        }
    }
    voice {
            cursor: pointer;
            font-size: 28px;
            height: 35px;
            line-height: 35px;
        }
        .playingLeft {

            display: none;
            position: absolute;
            right: -25px;
            top: 17px;
            width: 10px;
            height: 10px;
            border-radius: 10px;
            background-color: red;
        }
        .playingRight {
            display: none;
            position: absolute;
            left: -25px;
            top: 17px;
            width: 10px;
            height: 10px;
            border-radius: 10px;
            background-color: red;
        }
</style>
<style lang="less" scoped>
.groupName {
        color: #908f8f;
        padding: 5px;
    }
@media screen and (max-width: 500px) {
    .message-log{
        padding: 5px;
        overflow: auto;
        height: 100%;
    }
}
@media screen and (min-width: 500px) {
    .message-log{
        padding: 5px;
        overflow: auto;
        height: 400px;
    }
    .mouseLeft {
        position: fixed;
        z-index: 999999;
        width: 100px;
        background-color: #fff;
        text-align: center;
        box-shadow: 0px 0px 10px #3c3b3b;
        cursor: pointer;
        ul {
            li {
                padding: 10px;
                border-bottom: 1px solid #ccc;
                margin: 0;
            }
        }
    }
}

.message-log{
    ul {
        &::-webkit-scrollbar{width:100px ;display: block;}
        &::-webkit-scrollbar{width:10px;height:10px}
        &::-webkit-scrollbar-track{background:rgba(0,0,0,0)}
        &::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.5);border-radius:10px}
        &::-webkit-scrollbar-corner{background:#82afff}
        &::-webkit-scrollbar-resizer{background:#ff0bee}
        &::scrollbar{width:100px ;display: block;}
        &::scrollbar{width:10px;height:10px}

        &::scrollbar-track{background:rgba(0,0,0,0)}
        &::scrollbar-thumb{background:rgba(0,0,0,0.5);border-radius:10px}
        &::scrollbar-corner{background:#82afff}
        &::scrollbar-resizer{background:#ff0bee}
    }

    li {
        margin-bottom: 15px;
    }
    .time {
        margin: 7px 0;
        text-align: center;

        > span {
            display: inline-block;
            padding: 0 18px;
            font-size: 12px;
            color: #fff;
            border-radius: 2px;
            background-color: #dcdcdc;
        }
    }
    .avatar {
        float: left;
        margin: 0 10px 0 0;
        border-radius: 3px;
    }
    .text {
        display: inline-block;
        position: relative;
        padding: 0 10px;
        max-width: ~'calc(100% - 80px)';
        min-height: 30px;
        line-height: 2.0;
        font-size: 16px;
        text-align: left;
        word-break: break-all;
        background-color: #fafafa;
        border-radius: 4px;
        &:before {
            content: " ";
            position: absolute;
            top: 9px;
            right: 100%;
            border: 6px solid transparent;
            border-right-color: #fafafa;
        }
    }

    .self {
        text-align: right;

        .avatar {
            float: right;
            margin: 0 0 0 10px;
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
    }
}
</style>