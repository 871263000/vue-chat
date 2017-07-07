<script>
import { mapState } from 'vuex';
import Vue from 'vue';
import insertAtCursor from '../common/insertAtCursor';
import qn from '../common/QiniuUpload';
import emojis from '../common/emojis';
Vue.component('messagesLog', function (resolve) {
  // 这个特殊的 require 语法告诉 webpack
  // 自动将编译后的代码分割成不同的块，
  // 这些块将通过 Ajax 请求自动下载。
  require(['./modalMessage'], resolve)
})


export default {
    data() {
        return {
            content: '',
            selShow: false,
            currentSel: 1, 
            emShow: false,
            emojis: emojis,
            showMessageLog: false
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
            if ( this.currentSel == 0 ) {
                if ( e.ctrlKey && e.keyCode === 13 && this.content.length ) {
                    this.send();
                }
            } else {
                if ( e.shiftKey || e.ctrlKey ) {
                    return ;
                };
                if ( e.keyCode === 13  && this.content.length ) {
                        e.preventDefault();
                        this.send();
                } 
            }
        },
        send () {
            let data = {
                content: this.content
            };
            this.content = '';
            this.$store.dispatch('sendMessage', data);
        },
        changeSend (cur) {
            this.currentSel = cur;
            localStorage.setItem('currentSel', cur);
        },
        emojiInsert ( i ) {
            insertAtCursor(this.$refs.textarea, '【'+i.name+'】');
            this.content = this.$refs.textarea.value;
        },
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

            let size = Math.floor(file.size / 1024);
            let name = file.name;
            let nowTime = new Date().getTime();
            let userId = this.user.id;
            let start = this.start;
            let blkRet = {fname:"61a58PICtPr_1024.jpg",key:"file/4/0/1497527624635/61a58PICtPr_1024.jpg"};
            let cd = '';
            if ( type == 'file' ) {
                cd = {
                    content: '-file-['+blkRet.fname+'|'+'http://7xq4o9.com1.z0.glb.clouddn.com/'+blkRet.key+']',
                };
            } else {
                 cd = {
                    content: '-img-['+blkRet.fname+'|'+'http://7xq4o9.com1.z0.glb.clouddn.com/'+blkRet.key+']',
                };
            }
            vm.$store.dispatch('sendMessage', {content: cd.content});
            // qn.Qiniu_upload({
            //         key: '/file/'+userId+ '/' + start + '/'+ nowTime +'/'+ name ,
            //         tokenurl: '/chat/uptoken.php',
            //         f: file,
            //         QiniuUrl: 'http://up.qiniu.com',
            //     }, function (data) {
            //         if ( !data.error ) {
            //              let cd = '';
            //             if ( type == 'file' ) {
            //                 cd = {
            //                     content: '-file-['+data.fname+'|'+'http://7xq4o9.com1.z0.glb.clouddn.com/'+data.key+']',
            //                 };
            //             } else {
            //                  cd = {
            //                     content: '-img-['+data.fname+'|'+'http://7xq4o9.com1.z0.glb.clouddn.com/'+data.key+']',
            //                 };
            //             }
            //             vm.$store.dispatch('sendMessage', {content: cd.content});
            //         } else {
            //         }
            //     });
            // 双向绑定
            // this.$emit('input', this.file);
        }
    },
    created () {
        let data = localStorage.getItem('currentSel');
        document.addEventListener('click', (e)=> {
            if (this.emShow) {
                this.emShow = !this.emShow;
            };
            if ( this.selShow ) {
                this.selShow = !this.selShow;
            };
        })
        if ( data != null ) {
            this.currentSel = parseInt(data);
        };
    }
};
</script>

<template>
<div class="text"  v-if="start">
<messagesLog :show="showMessageLog" @close="showMessageLog = false" v-if="showMessageLog"></messagesLog>
<!--  表情包 -->
    <div class="chat-tool">
        <div class="emoticon" v-if="emShow">
            <ul class="emoticon-list">
                <li @click.stop = "emojiInsert(emojiObj)" v-for="(emojiObj, index) in emojis">
                    <img :src="'/chatStatic/emoji/'+ emojiObj.num +'@2x.png'" :title="emojiObj.name" alt="">
                </li>
            </ul>
        </div>
        <ul>
       <!--  // 工具  表情 -->
            <li @click.stop="emShow = true"><img src="../assets/biaoqing.png" alt=""></li>
        <!-- 文件上传  -->
            <li><label for="chat-file"><img src="../assets/wenjian.png" alt=""></label><input type="file" id="chat-file" style="display: none" @change="fileUpload($event)"></li>
            <li title="聊天记录" @click="showMessageLog = true" style="float:right;margin-right: 20px;"><img src="../assets/ltjl.png" alt="聊天记录"></li>
        </ul>
    </div>
    <div class="textarea-box">
        <textarea placeholder="" v-model="content" ref="textarea" @keydown.enter="onKeydown"></textarea>
        
    </div>
    <div class="send-act">
        <div class="text-right">
            <span class="send-btn btn btn-default" @click="send()">发送</span>
            <div class="send-select-box" @click.stop="selShow = !selShow">
                <span class="send-select"></span>
            </div>
            <ul class="send-select-list" ref="ssl" v-if="selShow">
                <li :class="[ currentSel == 1 ? 'active': ''  ]" @click="changeSend(1)">按Enter 键发送</li>
                <li :class="[ currentSel == 1 ? '': 'active'  ]" @click="changeSend(0)">按Ctrl + Enter 键发送</li>
            </ul>
        </div>
    </div>
</div>
</template>

<style lang="less" scoped>
.chat-tool {
    height: 32px;background-color: #fff;
    // 表情包
    .emoticon {
        position: absolute;
        bottom: 100%;
        background-color: #fff;
        box-shadow: 0 0 10px #ccc;
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
}
.text {
    height: 134px;
    border-top: solid 1px #ddd;
    background-color: #fff;
    .textarea-box {
        margin-left: 10px;
    }
    textarea {
        height:  65px;
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
        background-color: #fff;
    }
    .text-right {
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
</style>