<script>
import { mapState } from 'vuex';
import Vue from 'vue';
import insertAtCursor from '../common/insertAtCursor';
import qn from '../common/QiniuUpload';
import emojisList from '../common/emojis';
import pasteEvnet from '../common/pasteEvnet';
import { imgReader } from '../common/pasteEvnet';
import Recorder from 'recorderjs';
import RTCat from 'realtimecatjs';

import AlloyFinger from 'alloyfinger/alloy_finger' // 手势库
import AlloyFingerVue from 'alloyfinger/vue/alloy_finger'
Vue.use(AlloyFingerVue, {
  AlloyFinger
});

Vue.component('messagesLog', function (resolve) {
  // 这个特殊的 require 语法告诉 webpack
  // 自动将编译后的代码分割成不同的块，
  // 这些块将通过 Ajax 请求自动下载。
  require(['./modalMessage'], resolve)
});

Vue.component('sendImg', function (resolve) {
  // 这个特殊的 require 语法告诉 webpack
  // 自动将编译后的代码分割成不同的块，
  // 这些块将通过 Ajax 请求自动下载。
  require(['./sendImgModel'], resolve)
});


export default {
    data() {
        return {
            content: '',
            selShow: false,
            currentSel: 1,
            emShow: false,
            emojis: emojisList,
            showMessageLog: false,
            iphoneText: false,
            sendImgShow: false,
            sendImgSrcU:'',
            luyin: false,
            recording: {
                mediaRec: '',
                src: '',
            },
            sondShow: false,
            progressShow: false,
        };
    },
    computed: mapState({
        start: (state) => {
            return state.currentSession.id;
        },
        user: (state) => state.user,
        sendType: (state) => state.sendStatus.sendType,
        currentSessionType: (state) => state.currentSessionType,
        currentSession: (state) => state.currentSession,
    }),
    methods: {
        onKeydown (e) {
            let val = this.$refs.textarea.value;
            if ( this.currentSel == 0 ) {
                if ( e.ctrlKey && e.keyCode === 13 && val ) {
                    this.send();
                }
            } else {
                if ( e.shiftKey || e.ctrlKey ) {
                    return ;
                };
                e.preventDefault();
                if ( e.keyCode === 13  && val.length ) {
                        this.send();
                }
            }
        },
        send (count) {
            let val = this.$refs.textarea;
            if (!val.value) {
                return false;
            }
            let messageType = 'text';
            let data = {
                content: val.value,
                count: count,
                messageType: messageType,
                sessionType: 'chat'
            };
            this.$store.dispatch('sendMessage', data).then((t) => {
              if ( t.status == 1 ) {
                    val.value = '';
                    this.content = '';
                }  else {
                    // this.send(data.count++);
                    // this.$store.dispatch('sendMessage', data)
                }
            });

        },
        // 发送方式
        changeSend (cur) {
            this.currentSel = cur;
            localStorage.setItem('currentSel', cur);
        },
        emojiInsert ( i ) {
            insertAtCursor(this.$refs.textarea, i);
            // insertAtCursor(this.$refs.textarea, '['+i.name+']');
            this.content = this.$refs.textarea.value;
        },
        // 上传文件
        fileUpload (e) {
            let file = '';
            let vm = this;
            let type = '';
            let files = [];
            if ( typeof e.target === 'undefined' ) {
                files = e;
            } else {
                files = e.target.files;
            }
            if (typeof files == 'undefined' ) {
                return false;
            };
            let messageType;
            // this.$refs.file.value = '';
            for (var i = 0; i < files.length; i++) {
                file = files[i];
                if(file.type.indexOf('image') != -1){
                    type = 'img';
                    messageType = 'image';
                } else if (file.type.indexOf('mp4') != -1) {
                    type = 'video';
                    messageType = 'video';
                } else {
                    type = 'file';
                    messageType = 'file';
                }
                let size = Math.floor(file.size / 1024);
                let name = file.name;
                let nowTime = new Date().getTime();
                let userId = this.user.id;
                let start = this.start;
                if ( file.type.indexOf('quicktime') !== -1 ) {
                    name = file.name.replace('MOV', 'mp4');
                }
                this.progressShow = true;
                let _this = this;
                qn.on('progress', function (evt) {
                    var percentComplete = Math.round(evt.loaded * 100 / evt.total);
                    if (percentComplete != 100) {
                        _this.$refs.runer.style.width = ( 100 - percentComplete).toString() + '%';
                    } else {
                        _this.progressShow = false;
                    }
                })
                var qiniuUploadUrl;
                if (window.location.protocol === 'https:') {
                    qiniuUploadUrl = 'https://up.qbox.me';
                } else {
                    qiniuUploadUrl = 'http://up.qiniu.com';
                }
                qn.Qiniu_upload({
                    key: '/file/'+userId+ '/' + start + '/'+ nowTime +'/'+ name ,
                    tokenurl: this.user.documentUrlOms + '/chat/uptoken.php',
                    f: file,
                    QiniuUrl: qiniuUploadUrl,
                }, function (data) {
                    if ( !data.error ) {
                         let cd = '';
                        if ( type == 'file' ) {
                            cd = {
                                content: '-file-['+data.fname+'|'+'http://omso2o.com/'+data.key+']',
                            };
                        } else if (type == 'video') {
                             cd = {
                                content: '-video-['+data.fname+'|'+'http://omso2o.com/'+data.key+']',
                            };
                        } else if (type == 'img') {
                             cd = {
                                content: '-img-['+data.fname+'|'+'http://omso2o.com/'+data.key+']',
                            };
                        }
                        vm.$store.dispatch('sendMessage', {content: cd.content, messageType: messageType});
                    } else {
                        alert(data.err);
                    }
                });
            }
            // 双向绑定
            // this.$emit('input', this.file);
        },
        // 文件的粘贴
        pasteOver (e)  {
            let data= pasteEvnet(e);
            let inValue = '';
            if ( data ) {
                inValue = data.value;
                imgReader(inValue, (val) => {
                    let src = val.src, urlParam,bal;
                    var ba = src.substring(22);
                    bal = src.substring(22);
                    var equalIndex= ba.indexOf('=');
                    let nowTime = new Date().getTime();
                    let userId = this.user.id;
                    let start = this.start;
                    let token = '';
                    if( bal.indexOf('=') > 0 )
                    {
                        bal = ba.substring(0, equalIndex);

                    }
                    var baLength=bal.length;
                    var baLength=parseInt(baLength-(baLength/8)*2);
                    var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
                    function generateMixed(n) {
                         var res = "";
                         for(var i = 0; i < n ; i ++) {
                             var id = Math.ceil(Math.random()*35);
                             res += chars[id];
                         }
                         return res;
                    }
                    var fileName = generateMixed(10);
                    urlParam = 'putb64/-1/' +fileName + '.png';
                    token = qn.getQiniuToken(  this.user.documentUrlOms + '/chat/uptoken.php', (token) =>{
                        this.uploadBase64(ba, token, urlParam,  (bar) =>{
                            // let img = '<img src="http://7xq4o9.com1.z0.glb.clouddn.com/'+bar.key+'">';
                            this.sendImgSrcU = bar.key;
                            this.sendImgShow = true;
                        });
                    });

                });
            }
        },
        // 七牛上传 base64 图片
        uploadBase64: (picUrl, token, urlParam, callback) => {
             var qiniuUploadUrl;
                if (window.location.protocol === 'https:') {
                    qiniuUploadUrl = 'https://up.qbox.me/';
                } else {
                    qiniuUploadUrl = 'http://upload.qiniu.com/';
                }
              var url = qiniuUploadUrl + urlParam;
              var xhr = new XMLHttpRequest();
              xhr.onreadystatechange=function(){
                  if (xhr.readyState==4){
                      callback( JSON.parse(xhr.responseText));
                  }
              }
              xhr.open("POST", url, true);
              xhr.setRequestHeader("Content-Type", "application/octet-stream");
              xhr.setRequestHeader("Authorization", "UpToken "+token);
              xhr.send(picUrl);
        },
        // 拖动上传
        dropFile (e) {
            e.preventDefault(); //取消默认浏览器拖拽效果
            var fileList = e.dataTransfer.files; //获取文件对象
            //检测是否是拖拽文件到页面的操作
            if(fileList.length == 0){
                return false;
            }
            this.fileUpload(fileList);
        },
        recorded () {
            let _this = this;
            this.luyin = !this.luyin;
            var app = {
                initialize: function() {
                    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
                },
                onDeviceReady: function() {
                    let src = (new Date().getTime())+".m4a";
                    _this.recording.src = src;
                    _this.recording.mediaRec = new Media(src,
                         // success callback
                         function() {
                            console.log("recordAudio():Audio Success");
                         },

                         // error callback
                         function(err) {
                            console.log("recordAudio():Audio Error: "+ err);
                         }
                    );
                    // this.receivedEvent('deviceready');
                },
            };
            app.initialize();
        },
        startRecording (evt) {
            this.sondShow = true;
            this.recording.mediaRec.startRecord();

        },
        stopRecording (evt) {
            this.sondShow = false;
            let _this = this;

            this.recording.mediaRec.stopRecord();
            this.recording.mediaRec.release();

            if ( navigator.userAgent.indexOf('oks_ltd_android')>0 ) {
                resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function(dirEntry) {
                    // dirEntry 为“name.wav”文件所在的根目录
                    dirEntry.getFile(_this.recording.src, {}, function(fileEntry) {
                        // 获得文件入口
                        fileEntry.file(function(file) {
                            // 读取文件
                            var reader = new FileReader();
                            reader.onloadend = function () {
                               qiniuUpload(this.result);
                            }

                            reader.readAsDataURL(file);

                        }, function (e) {
                            console.log(e);
                        });
                    }, function (e) {
                            console.log(e);
                        });
                }, function (e) {
                            console.log(e);
                        });
            } else {
                 window.requestFileSystem(window.TEMPORARY,0,function(dirEntry){
                    dirEntry.root.getFile(_this.recording.src,{},function(fileEntry){
                        fileEntry.file(function(file){
                            var reader=new FileReader();
                            reader.onloadend=function(){
                                qiniuUpload(this.result);
                            }
                            reader.readAsDataURL(file);
                        });
                    });

                });
            }

            //**dataURL to blob**
            function dataURLtoBlob(dataurl) {
                var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                return new Blob([u8arr], { type: mime });
            }
            // 生成随机字符串
            function guid() {
                function S4() {
                    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
                }
                return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
            }
            let qiniuUpload = function (file) {
                qn.Qiniu_upload({
                    key: '/voice/voicefile'+guid()+'.m4a',
                    tokenurl: this.user.documentUrlOms + '/chat/uptoken.php',
                    f: dataURLtoBlob(file),
                    QiniuUrl: 'http://up.qiniu.com',
                }, function (data) {
                    // let audio = document.createElement('audio');
                    //  audio.src = 'http://7xq4o9.com1.z0.glb.clouddn.com' + data.key;
                    // audio.play();
                    if ( !data.error ) {
                         let cd = '';
                        cd = {
                            content: '-voice-['+data.fname+'|'+'http://omso2o.com/'+data.key+']',

                        };
                        _this.$store.dispatch('sendMessage', {content: cd.content});
                    } else {
                        alert('发送失败！请重新发送');
                    }
                    if ( navigator.userAgent.indexOf('oks_ltd_android')>0 ) {
                        resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function(dirEntry) {
                            // dirEntry 为“name.wav”文件所在的根目录
                            dirEntry.getFile(_this.recording.src, {}, function(fileEntry) {
                                // 获得文件入口
                                fileEntry.remove(function() {
                                    console.log('删除成功！');
                                    // 读取文件
                                }, errorHandler);
                            }, errorHandler);
                        }, errorHandler);
                    } else {
                        window.requestFileSystem(window.TEMPORARY,0,function(dirEntry){
                            dirEntry.root.getFile(_this.recording.src,{},function(fileEntry){
                                fileEntry.remove(function(){
                                    console.log('删除成功！');
                                });
                            });

                        });
                    }
                });
            }
        },
        inFocus () {
            // setTimeout("window.scrollTo(0, 3000);",500);
            // console.log(888);
            // if (this.emShow) {
            //     this.emShow = !this.emShow;
            // };
            if ( this.selShow ) {
                this.selShow = !this.selShow;
            };
            // document.getElementsByTagName('body')[0].scrollIntoView();
            // document.activeElement.scrollIntoViewIfNeeded();
        },
        messageImgFd (img) {
            this.$emit('enlarge', img);
        },
        video () {
            if (confirm('你确定要和他视频吗？')) {
                this.$emit('route', {type: 'videoChat'});
            }
        },
        HeightAuto(e) {
            let el = e.target;
            let textHeight = el.scrollHeight;
            const TBH = 50;
            const TH = 70;
            let tbe = this.$refs.textareaBox;

            if ( textHeight < 190 && textHeight >= TH ) {
                el.setAttribute('style', 'height:' + textHeight + 'px;overflow:auto;');
                tbe.style.height = (TBH + textHeight - TH - 30) + 'px';
            } else if (textHeight < TH ) {
                el.setAttribute('style', 'height:70px;overflow:auto;');
            }

        },
        emojiShow () {
            this.emShow = !this.emShow;
            if ( !this.emShow ) {
                this.$refs.textarea.focus();
            }

        },
        videoChat () {
            if ( !confirm('你确定要开启视频吗？') ) {
                return ;
            }
            let tp = 1, fid, messageText;
            if ( this.currentSessionType == 'message' ) {
                tp = 1;
                messageText = '邀请你加入视频！';
                fid = this.user.id;
            } else {
                tp = 2;
                messageText = '邀请你们加入视频！';
                fid = this.currentSession.id;
            }

            let messageType = 'liveVideo';
            let videoURl = this.user.documentUrlOms +  'video_chat_gateway.php?tp=' + tp + '&fid=' + fid;
            let content = '-liveVideo-['+videoURl+']';

            let data = {
                content: content,
                messageType: messageType
            };

            this.$store.dispatch('sendMessage', data).then((t) => {
              if ( t.status == 1 ) {
                    window.open(this.user.documentUrlOms +  'video_chat_gateway.php?tp=' + tp + '&fid=' + this.currentSession.id);
                }
            });
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
        let data = localStorage.getItem('currentSel');
        let _this = this;
        this.$nextTick( () => {
            if ( this.iphoneText ) {
                // document.getElementsByName('body')[0].addEventListener('touchend',function(e){
                //     // 改变了事件名称，tap是在body上才被触发，而touchend是原生的事件，在dom本身上就会被捕获触发
                //     e.preventDefault();
                //     if (_this.emShow) {
                //         _this.emShow = !_this.emShow;
                //     };
                //     if ( _this.selShow ) {
                //         _this.selShow = !_this.selShow;
                //     };
                //     // 阻止“默认行为”
                // })
            }
            document.addEventListener('click', (e)=> {
                if (this.emShow) {
                    this.emShow = !this.emShow;
                };
                if ( this.selShow ) {
                    this.selShow = !this.selShow;
                };
            });
        })

        if ( data != null ) {
            this.currentSel = parseInt(data);
        };
        let draft = localStorage.getItem('draft');
        if (draft) {
            this.content = draft;
        }
        

    },
    watch: {
        content (val) {
            if ( val == '' && this.iphoneText ) {
                let tbe = this.$refs.textareaBox;
                let t = this.$refs.textarea;
                tbe.style.height = '50px';
                t.setAttribute('style', 'height:70px;overflow:auto;');
            }
            localStorage.setItem('draft', val);
        },
        sendType (val) {
            if ( val == 0 ) {
                let val = this.$refs.textarea;
                val.value = "";
                this.content = '';
            }
        }
    }
};
</script>

<template>
<div class="text-box">
    <div id="media-list"></div>
    <div class="progress" v-if="progressShow">
        <span class="runer" ref="runer">

        </span>
    </div>
    <div class="text"  v-if="start">
    <messagesLog :show="showMessageLog" @imgShow="messageImgFd" @close="showMessageLog = false" v-if="showMessageLog"></messagesLog>
    <sendImg v-if="sendImgShow" @close="sendImgShow = false" :src="sendImgSrcU">
    </sendImg>
    <!-- 语音正在说话 -->
    <div class="recording" v-if="sondShow">
        <div class="recording-voice">
            <div class="voice-inner">
                <div class="voice-icon">
                    <i class="iconfont-chat">&#xe61c;</i>
                </div>
                <div class="voice-volume">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            <p>向上滑动取消发送</p>
        </div>
    </div>
    <!--  表情包 -->
        <div class="chat-tool">
            <div class="emoticon" v-if="emShow">
                <ul class="emoticon-list">
                    <li @click.stop = "emojiInsert('[' + emojiObj.name + ']')" v-for="(emojiObj, index) in emojis">
                        <img :src="'https://www.omso2o.com/chatStatic/emoji/'+ emojiObj.num +'@2x.png'" :title="emojiObj.name" alt="">
                    </li>
                </ul>
            </div>
            <ul v-if="!iphoneText">
           <!--  // 工具  表情 -->
                <li @click.stop="emShow = !emShow"><i class="iconfont-chat">&#xe62c;</i></li>
            <!-- 文件上传  -->
                <li><label for="chat-file"><img src="../assets/wenjian.png" alt=""></label><input ref="file" type="file" id="chat-file" style="display: none" @change="fileUpload($event)" multiple></li>
                <!-- 视频 -->
                <li @click.stop="videoChat()"><i class="iconfont-chat">&#xe786;</i></li>

                <!-- <li @click="video()"><i class="iconfont-chat">&#xe611;</i></li> -->
                <li title="聊天记录" @click="showMessageLog = true" style="float:right;margin-right: 20px;"><img src="../assets/ltjl.png" alt="聊天记录"></li>

            </ul>
        </div>


       <!-- 语音 -->
        <div v-if="iphoneText" class="tool-yuyin" @click="recorded()">
            <i class="iconfont-chat" v-if="!luyin">&#xe65a;</i><i class="iconfont-chat" v-if="luyin">&#xe60d;</i>
        </div>
        <div class="press-to-speak-box" v-show="luyin" v-finger:touch-start="startRecording" v-finger:touch-end="stopRecording">
            <div class="press-to-speak">
                <span v-if="true">按下说话</span>
                <span v-if="false">松开结束</span>
            </div>
        </div>
        <div class="textarea-box" v-show="!luyin" ref="textareaBox">
            <textarea placeholder="" v-if="!iphoneText" v-model="content" ref="textarea" @keydown.enter="onKeydown" @paste="pasteOver($event)" @drop="dropFile($event)"></textarea>

            <textarea v-if="iphoneText"  v-model="content"  @focus="inFocus()" id="chat-input"  ref="textarea"  @keydown.enter="onKeydown" @paste="pasteOver()" @input="HeightAuto($event)">
            </textarea>
            <!-- <input placeholder="" v-if="iphoneText" @focus="inFocus()" v-model="content" id="chat-input"  ref="textarea"  @keydown.enter="onKeydown" @paste="pasteOver()"> -->

        </div>
         <!-- 手机表情 -->
        <div v-if="iphoneText" @click.stop="emojiShow()" class="tool-emoji">
            <i class="iconfont-chat" v-if="!emShow">&#xe62c;</i>
            <i class="iconfont-chat" v-else>&#xe608;</i>
        </div>
        <div class="send-act">
            <div class="chat-send">
                <!-- 手机发送图片 -->
                <label class="mul-function" for="chat-file" v-if="!content && iphoneText"><i class="iconfont-chat">&#xe60b;</i></label>

                <input type="file" id="chat-file" style="display: none"  v-if="iphoneText" @change="fileUpload($event)" multiple>

                <span class="send-btn" v-if="content || !iphoneText" @click="send()">发送</span>
                <div class="send-select-box" v-if="!iphoneText" @click.stop="selShow = !selShow">
                    <span class="send-select"></span>
                </div>
                <ul class="send-select-list"  ref="ssl" v-if="selShow">
                    <li :class="[ currentSel == 1 ? 'active': ''  ]" @click="changeSend(1)">按Enter 键发送</li>
                    <li :class="[ currentSel == 1 ? '': 'active'  ]" @click="changeSend(0)">按Ctrl + Enter 键发送</li>
                </ul>
            </div>
        </div>
    </div>
</div>
</template>

<style lang="less" scoped>


.progress {
    height: 6px;
    width: 300px;
    position: fixed;
    top: 30%;
    left: 50%;
    z-index:99999;
    margin-left: -150px;
    background-color: #000;
    box-shadow: inset 0 -2px 2px rgba(0, 0, 0, 0.4);
    border-radius: 3px 3px;
    .runer {
        content: "";
        position: absolute;
        right: 0;
        height: 100%;
        width: 81%;
        background-color: #fff;
    }
}

@media screen and (max-width: 500px) {
* {
        box-sizing: border-box;
}
.recording {
    position: fixed;
    left: 50%;
    top: 45%;
    transform: translate(-50%, -50%);
    width: 140px;
    height: 140px;
    padding: 5px;
    background-color: rgba(0, 0, 0, .5);
    color: #ffffff;
    border-radius: 5px;
    font-size: 14px;
    text-align: center;
    p {
        margin: 0;
    }
    .voice-inner {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 110px;
        .voice-icon {
            i {
                font-size: 80px;
            }
        }
        .voice-volume {
            span {
                &:nth-child(1) {
                    width: 24px;
                }
                &:nth-child(2) {
                    width: 22px;
                }
                &:nth-child(3) {
                    width: 20px;
                }
                &:nth-child(4) {
                    width: 18px;
                }
                &:nth-child(5) {
                    width: 16px;
                }
                &:nth-child(6) {
                    width: 14px;
                }
                &:nth-child(7) {
                    width: 12px;
                }
                &:nth-child(8) {
                    width: 10px;
                }
                padding: 0;
                margin: 0;
                display: block;
                height: 2px;
                margin-top: 4px;
                min-width: 8px;
                float: left;
                clear: both;
                animation-iteration-count: infinite;
                animation-timing-function: linear;
                animation-duration: 2000ms;
                background-color: #e4e4e5;
            }
        }
    }
    .voice-volume {
        width: 30px;
        height: 55px;
    }
}
.chat-tool {
    height: 0;background-color: #fff;
    // 表情包
    .emoticon {
        position: absolute;
        bottom: 100%;
        background-color: #fff;
        box-shadow: 0 0 10px #ccc;
        z-index: 999;
        height: 200px;
        overflow: auto;
        font-size: 18px;
    }
    ul{
         height: 100%;
         padding-left: 10px;
    }
    ul li{
        float:left;
        text-align: center;
        line-height: 32px;
        padding: 7px;
        cursor: pointer;
    }
    li img{
        width: 30px;
        height: 30px;
        cursor: pointer
    }
    li label {
        width: 100%;height: 100%;
    }
}
.text-box {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
}
.text {

    padding: 5px 0;
    height: 100%;
    flex-grow: 1;
    flex-basis: 200px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    position: relative;
    background-color: #f6f6f7;
    font-family: "微软雅黑";
    .tool-yuyin {
        color: #7d7e83;
        flex-basis: 40px;
        width: 40px;
        padding: 0 3px;
        font-size: 30px;
        flex-grow: 0;
        vertical-align: middle;
        line-height: 50px;
        padding: 0 4px;
        i {
            font-size: 30px;
        }
    }
    .tool-emoji{
        color: #7d7e83;
        flex-basis: 40px;
        padding: 0 3px;
        font-size: 30px;
        flex-grow: 0;
        vertical-align: middle;
        padding: 0 4px;
        width: 40px;
        height: 100%;
        line-height: 50px;
        text-align: center;
        i {
            font-size: 30px;
        }

    }
    .press-to-speak-box {
       vertical-align: middle;
        padding: 4px 0px;
        height:0;
        flex-grow: 1;
        flex-basis: 200px;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
    }
    .press-to-speak {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 6px;
        overflow: hidden;
        padding: 0 10px;
        width: 200%;
        height: 65px;
        color: #565656;
        border: 1px solid #7d7e83;
        transform: scale(.5);
        transform-origin: 0 0;
        font-size: 30px;
    }
    .textarea-box {
        vertical-align: middle;
        padding: 7px 0 0 0;
        height: 100%;
        flex-grow: 1;
        flex-basis: 200px;
        height: 50px;
    }
    #chat-input {
        outline: none;
        padding: 10px 0 0 0;
        border-radius: 6px;
        width: 200%;
        height: 70px;
        border: none;
        -webkit-transform: scale(.5);
        transform: scale(.5);
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        font-size: 30px;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        resize: none;
        line-height: 47px;
    }
    .send-act {
        color: #7d7e83;
        flex-basis: 40px;
        width: 40px;
        padding: 0 3px;
        font-size: 30px;
        flex-grow: 0;
        vertical-align: middle;
        line-height: 50px;
        padding: 0 4px;
    }
    .mul-function{
        height: 40px;
        cursor: pointer;
        color: #222;
        display: inline-block;
        /* border: 1px solid #ccc; */
        line-height: 40px;
        text-align: center;
        i {
            font-size: 30px;
            color: #7d7e83;
        }
    }
    .chat-send {
        height: 100%;
    }
    .send-btn {
        height: 30px;
        cursor: pointer;
        background-color: #fff;
        color: #222;
        display: inline-block;
        border: 1px solid #ccc;
        margin-right: 10px;
        margin-left: -3px;
        line-height: 30px;
        text-align: center;
        width: 35px;
        font-size: 12px;
    }
    .active {
        border-left: 8px solid #88154c;
    }


}
}
@media screen and (min-width: 500px) {


.chat-tool {
    height: 32px;background-color: #eee;
    position:relative;
    // 表情包
    .emoticon {
        position: absolute;
        bottom: 100%;
        background-color: #fff;
        box-shadow: 0 0 10px #ccc;
        bottom: 100%;
        font-size: 19px;
    }
    .emoticon-list {
        height: 200px;
        overflow: auto;
        li {
            float: left;
            width: 34px;
            height: 34px;
        }
    }
    ul{
         height: 100%;
         padding-left: 10px;
         li{
            float:left;
            width: 34px;
            height: 100%;
            text-align: center;
            line-height: 32px;
            cursor: pointer;
        }
    }
    li img{
        width: 20px;
        height: 20px;
        cursor: pointer
    }
    li label {
        width: 100%;height: 100%;
    }
    li {
        i {
            font-size: 20px;
            line-height: 37px;
        }
    }
}
.text {
    height: 134px;
    border-top: solid 1px #ddd;
    background-color: #fff;

    .textarea-box {
        background-color: #eee;
        padding-left: 10px;
    }
    textarea {
        background-color: #eee;
        height:  93px;
        width: 100%;
        border: none;
        outline: none;
        font-family: "Micrsofot Yahei";
        resize: none;
        margin:0;
        border-bottom: 1px solid #ccc;
    }
    .send-act {
        position: relative;
        top:-7px;
        background-color: #eee;
    }
    .text-right {
        text-align: right;
    }
    .chat-send {
        text-align: right;
    }
    .send-btn {
        height: 30px;
        cursor: pointer;
        background-color: #fff;
        color: #222;
        padding-left: 30px;
        padding-right: 30px;
        display: inline-block;
        border: 1px solid #ccc;
        line-height: 30px;
        text-align: center;
        margin: 0 30px;
    }
    .active {
        border-left: 8px solid #88154c;
    }
    .send-select-box {

        display: inline-block;
        position: absolute;
        height: 30px;
        width: 20px;
        right: 10px;
        border: 1px solid #ccc;
        cursor: pointer;
        .send-select{
            border-top: 8px solid #955F34;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            position: absolute;
            top: 12px;
            right: 4px;
        }
    }
    .send-select-list {
        position: absolute;
        border: 1px solid #E2E2E2;
        border-radius: 2px;
        background-color: #fff;
        box-shadow: 1px 1px 20px rgba(0,0,0,.1);
        left: auto;
        right: 0;
        bottom: 100%;
        width: 180px;
        padding: 10px 0;

        li {
            cursor: pointer;
            padding-right: 15px;
            line-height: 28px;
            &:hover {
                background-color: #ccc
            }
        }

    }


}
}
</style>
