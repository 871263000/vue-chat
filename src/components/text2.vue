<script>
import { mapState } from 'vuex';
import Vue from 'vue';
import insertAtCursor from '../common/insertAtCursor';
import qn from '../common/QiniuUpload';
import emojis from '../common/emojis';
import pasteEvnet from '../common/pasteEvnet';
import { imgReader } from '../common/pasteEvnet';

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
            emojis: emojis,
            showMessageLog: false,
            iphoneText: false,
            sendImgShow: false,
            sendImgSrcU:'',
        };
    },
    computed: mapState({
        start: (state) => {
            return state.currentSession.id;
        },
        user: (state) => state.user
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
        send () {
            let val = this.$refs.textarea.value;
            if (!val) {
                return false;
            }
            let data = {
                content: val
            };
            val = '';
            this.content = '';
            this.$store.dispatch('sendMessage', data);
        },
        // 发送方式
        changeSend (cur) {
            this.currentSel = cur;
            localStorage.setItem('currentSel', cur);
        },
        emojiInsert ( i ) {
            insertAtCursor(this.$refs.textarea, '【'+i.name+'】');
            this.content = this.$refs.textarea.value;
        },
        // 上传文件
        fileUpload (e) {
            let file = '';
            let vm = this;
            let type = '';
            if (typeof e.target === 'undefined') file = e[0];
            else file = e.target.files[0];
            if (typeof file == 'undefined' ) {
                return false;
            };

            if(/image\/\w+/.test(file.type)){
                type = 'img';
            } else {
                type = 'file';
            }
            if ( /video\/\w+/.test(file.type) ) {
                type = 'video';
            };
            let size = Math.floor(file.size / 1024);
            let name = file.name;
            let nowTime = new Date().getTime();
            let userId = this.user.id;
            let start = this.start;
            if ( file.type.indexOf('quicktime') !== -1 ) {
                name = file.name.replace('MOV', 'mp4');
            }
            // let blkRet = {fname:"61a58PICtPr_1024.jpg",key:"file/4/0/1497527624635/61a58PICtPr_1024.jpg"};
            // let cd = '';
            // if ( type == 'file' ) {
            //     cd = {
            //         content: '-file-['+blkRet.fname+'|'+'http://7xq4o9.com1.z0.glb.clouddn.com/'+blkRet.key+']',
            //     };
            // } else {
            //      cd = {
            //         content: '-img-['+blkRet.fname+'|'+'http://7xq4o9.com1.z0.glb.clouddn.com/'+blkRet.key+']',
            //     };
            // }
            // vm.$store.dispatch('sendMessage', {content: cd.content});
            qn.Qiniu_upload({
                    key: '/file/'+userId+ '/' + start + '/'+ nowTime +'/'+ name ,
                    tokenurl: '/chat/uptoken.php',
                    f: file,
                    QiniuUrl: 'http://up.qiniu.com',
                }, function (data) {
                    if ( !data.error ) {
                         let cd = '';
                        if ( type == 'file' ) {
                            cd = {
                                content: '-file-['+data.fname+'|'+'http://7xq4o9.com1.z0.glb.clouddn.com/'+data.key+']',
                            };
                        } else if ( type == 'img' ) {
                             cd = {
                                content: '-img-['+data.fname+'|'+'http://7xq4o9.com1.z0.glb.clouddn.com/'+data.key+']',
                            };
                        } else if ( type == 'video' ) {
                             cd = {
                                content: '-video-['+data.fname+'|'+'http://7xq4o9.com1.z0.glb.clouddn.com/'+data.key+']',
                            };
                        }
                        vm.$store.dispatch('sendMessage', {content: cd.content});
                    } else {
                    }
                });
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
                    urlParam = 'putb64/' + baLength+'/' +fileName + '.png';
                    token = qn.getQiniuToken('/chat/uptoken.php', (token) =>{
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
              var url = "http://upload.qiniu.com/"+ urlParam; 
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
        inFocus () {
            document.getElementsByTagName('body')[0].scrollIntoView();
            document.activeElement.scrollIntoViewIfNeeded();
            setTimeout("window.scrollTo(0, 1000)",200);
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
        this.$nextTick( () => {
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
    }
};
</script>

<template>
<div class="text-box">
    <div class="text"  v-if="start">
    <messagesLog :show="showMessageLog" @close="showMessageLog = false" v-if="showMessageLog"></messagesLog>
    <sendImg v-if="sendImgShow" @close="sendImgShow = false" :src="sendImgSrcU">
    </sendImg>
    <!--  表情包 -->
        <div class="chat-tool">
            <div class="emoticon" v-if="emShow">
                <ul class="emoticon-list">
                    <li @click.stop = "emojiInsert(emojiObj)" v-for="(emojiObj, index) in emojis">
                        <img :src="'/chatStatic/emoji/'+ emojiObj.num +'@2x.png'" :title="emojiObj.name" alt="">
                    </li>
                </ul>
            </div>
            <ul v-if="!iphoneText">
           <!--  // 工具  表情 -->
                <li @click.stop="emShow = !emShow"><i class="iconfont-chat">&#xe62c;</i></li>
            <!-- 文件上传  -->
                <li><label for="chat-file"><img src="../assets/wenjian.png" alt=""></label><input type="file" id="chat-file" style="display: none" @change="fileUpload($event)"></li>
                <li title="聊天记录" @click="showMessageLog = true" style="float:right;margin-right: 20px;"><img src="../assets/ltjl.png" alt="聊天记录"></li>
            </ul>
        </div>
        <!-- 手机表情 -->
        <div v-if="iphoneText" @click.stop="emShow = !emShow" class="tool-emoji">
            <i class="iconfont-chat">&#xe62c;</i>
        </div>
        <div class="textarea-box">
            <textarea placeholder="" v-if="!iphoneText" v-model="content" ref="textarea" @keydown.enter="onKeydown" @paste="pasteOver($event)" @drop="dropFile($event)"></textarea>
            <input placeholder="" v-if="iphoneText"  @focus="inFocus()"  v-model="content" id="chat-input"  ref="textarea" @keydown.enter="onKeydown" @paste="pasteOver()">
            
        </div>
        <div class="send-act">
            <div class="chat-send">
                <!-- 手机发送图片 -->
                <label class="mul-function" for="chat-file" v-if="!content && iphoneText"><i class="iconfont-chat">&#xe60b;</i></label>

                <input type="file" id="chat-file" style="display: none"  v-if="iphoneText" @change="fileUpload($event)">

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




@media screen and (max-width: 500px) {
* {
        box-sizing: border-box;
}
.chat-tool {
    height: 0;background-color: #fff;
    // 表情包
    .emoticon {
        position: fixed;
        bottom: 100%;
        background-color: #fff;
        box-shadow: 0 0 10px #ccc;
        z-index: 999;
        bottom: 50px;
        height: 200px;
        overflow: auto;
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
    height: 50px;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
}
.text {

    overflow: hidden;
    padding: 5px 0;
    height: 100%;
    flex-grow: 1;
    flex-basis: 200px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    position: relative;
    background-color: #ffffff;
    font-family: "微软雅黑";
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
        line-height: 40px;
        text-align: center;
        i {
            font-size: 32px;
        }

    }
    .textarea-box {
        vertical-align: middle;
        padding: 4px 0px;
        height: 100%;
        flex-grow: 1;
        flex-basis: 200px;
    }
    input {
            outline: none;
        border-radius: 6px;
        overflow: hidden;
        width: 200%;
        height: 200%;
        border: 1px solid #7d7e83;
        transform: scale(.5);
        transform-origin: 0 0;
        font-size: 30px;
        -webkit-appearance: none;
        appearance: none;
    }
    .send-act {
        text-align: center;
        color: #7d7e83;
        flex-basis: 50px;
        flex-grow: 0;
        vertical-align: middle;
        padding: 0 4px;
        height: 100%;
        padding: 0px 3px;
        line-height: 41px;
        background-color: #fff;
    }
    .mul-function{
        height: 36px;
        cursor: pointer;
        background-color: #fff;
        color: #222;
        padding-top: 3px;
        /* padding: 2px 3px; */
        display: inline-block;
        /* border: 1px solid #ccc; */
        line-height: 36px;
        text-align: center;
        width: 40px;
        i {
            font-size: 32px;
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
        padding: 2px 3px;
        display: inline-block;
        border: 1px solid #ccc;
        margin-right: 10px;
        line-height: 30px;
        text-align: center;
        width: 50px;
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
    }
    ul{
         height: 100%;
         padding-left: 10px;
    }
    ul li{
        float:left;
        width: 34px;
        height: 100%;
        text-align: center;
        line-height: 32px;
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