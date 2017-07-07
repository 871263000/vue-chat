<script>
import { mapState } from 'vuex'
import Vue from 'vue';
import { reverse } from '../messageHandel';
Vue.component('messagesLog', function (resolve) {
  // 这个特殊的 require 语法告诉 webpack
  // 自动将编译后的代码分割成不同的块，
  // 这些块将通过 Ajax 请求自动下载。
  require(['./modalMessage'], resolve)
});
Vue.component('asyncModal', function (resolve) {
  require(['./imgCat'], resolve)
})

export default {
    data () {
        return {
            showMessageLog: false,
            show: false,
            imgfdBoxinfo: '',
        }
    },
    computed:  mapState({
        user: (state) => state.user,
        session: (state) => state.sessions.find(session => session.id === state.currentSession.id),
        dialogName: (state) => {
            return state.currentSession.name;
        },
        dialogType: (state) => {
            return state.currentSessionType;
        }
    }),
    filters: {
        // 将日期过滤为 hour:minutes
        time (date) {
            if (typeof date === 'string') {
                date = new Date(date);
            }
            return date.getHours() + ':' + date.getMinutes();
        }
    },
    methods: {
        content ( content ) {
            return reverse(content);
        },
        imgFd (e) {
            if ( e.target.nodeName == 'IMG' ) {

                let img = '<img src="'+e.target.src+'">';

                this.imgfdBoxinfo = img;
                this.show = true;
            }
        }
    }
}
Vue.directive('scroll-bottom', function(el) {
    Vue.nextTick(() => {
        el.scrollTop = el.scrollHeight - el.clientHeight;
    });
})
</script>

<template>


<div class="message">
    <asyncModal v-if="show" @close="show = false">
        <div slot="body" v-html="imgfdBoxinfo"></div>
    </asyncModal>
    <messagesLog :show="showMessageLog" @close="showMessageLog = false" v-if="showMessageLog"></messagesLog>
    <div class="dialog-title" ref="chatDrop">
        <span class="text-left dialogue-title-name">{{ dialogName }}</span>
    </div>
    <ul v-if="session" v-scroll-bottom="session.messages">
        <li v-if="session.messages.length > 20" @click="showMessageLog = true" class="catMul">查看更多</li>
        <li v-for="item in session.messages">
            <p class="time">
                <span>{{ item.date | time }}</span>
            </p>
            <div class="main" :class="{ self: item.self }">
                <img class="avatar" width="30" height="30" :src="item.self ? user.img : item.img" />
                <div v-if="dialogType == 'groupMessage' && !item.self" class="groupName">{{item.name}}</div>
                <div class="text" @click="imgFd($event)" v-html="content(item.content)">
                </div>
            </div>
        </li>
    </ul>
</div>
</template>

<style lang="less">
    .message {
        a{
            text-decoration: none;
        }
        .chat-file{
            text-align: center;
        }
        .main {
            p{
                max-width:120px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
            }
        }
    }

</style>
<style lang="less" scoped>
.dialog-title {
    height: 40px;
    border-bottom: 1px solid #ccc;
    .dialogue-title-name {
        height: 100%;
        line-height: 40px;
        font-size: 20px;
        display: inline-block;
    }
}
.message {
    .catMul{
        text-align: center;
        padding: 10px 0;
        font-size: 16px;
        cursor: pointer;
        color: #082f84;
    }

    padding: 10px 15px;
    .groupName {
        color: #908f8f;
        padding: 5px;
    }
    ul {
        overflow-y: auto;
        height: ~'calc(100% - 32px)';
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
        line-height: 2.5;
        font-size: 12px;
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