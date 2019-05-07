<script>
import Vue from 'vue';
import { mapState } from 'vuex';
import friendsList from './friendsList';
import directives from '../common/directives';

import AlloyFinger from 'alloyfinger/alloy_finger' // 手势库
import AlloyFingerVue from 'alloyfinger/vue/alloy_finger'
Vue.use(AlloyFingerVue, {
  AlloyFinger
})

directives(Vue);

Vue.component('friendApply', function (resolve) {
    require(['./friendsApply'], resolve);
});

export default {
    data  () {
        return {
            mousedownShow: false,
            mousedowInfo: {id: 1, index: 1},
            friendApplyShow: false,
            friendApplyId: 0,
            friendsApplyState: 0,
            sysType: "sysNoti"
        }
    },
    components: {
        friendsList
    },
    methods: {
        selectSession (id, type, name, img) {
            this.$emit('mainShow');
            let data = {id: id, type: type, name: name, img: img};
            this.$store.dispatch('selectSession', data);
        },
        searchSelectSession (id, type, name, img, typeNmae) {
            if ( typeNmae == '新好友' ) {
                this.friendApplyShow = true;
                this.friendApplyId = uid;
                this.friendsApplyState = state;
                return;
            }
            this.$emit('mainShow');
            let data = {id: id, type: type, name: name, img: img};
            this.$store.dispatch('selectSession', data);
        },
        mousedown (i, index, e)  {
            if ( e.which == 3 ) {
                this.mousedownShow = true;
                this.$nextTick( () => {
                    this.$refs.recentContactsDel.style.top = e.pageY + 2 + 'px';
                    this.$refs.recentContactsDel.style.left = e.pageX + 2 + 'px';
                })
                this.mousedowInfo.id = i.id;
                this.mousedowInfo.index = index;
            };
            // console.log(i);
            // console.log(index);
            // console.log(event);
        },
        removeZjlxr ()  {
            // console.log(this.mousedowInfo.id);
            this.$store.dispatch('delSession', this.mousedowInfo.index);
        },
        open (index) {
            let style = this.$refs.group[index].style;
            let display =  this.$refs.group[index].style.display;
            if ( display == 'none' ) {
                style.display = 'block';
            } else {
                style.display = 'none';
            }
        },
        friendApply: function (uid, state) {
            this.friendApplyShow = true;
            this.friendApplyId = uid;
            this.friendsApplyState = state;
        },
        perInfo (type) {
            if ( type == 'message' ) {
                this.$emit('perInfoShow');
            }
        },
        swipe (evt) {
            let el = evt.target;
            let parentEl = el.parentNode;
            let elLI = el;
            const WIDTH = 180;
            for (let i = 0; i < 6; i++) {
                if ( parentEl.nodeName == 'LI' ) {
                    elLI = parentEl;
                    break;
                } else {
                    parentEl = parentEl.parentNode;
                }

            }
            let direction = evt.direction;
            if ( direction == 'Left' ) {
                elLI.style.left = '-' +WIDTH + 'px';
            } else if( direction == 'Right' ) {
                elLI.style.left =  '0px';
            } else {
                elLI.style.left =  '0px';
            }
            // let elLeft = el.style.left;
            // let deltaX = evt.deltaX;
            // console.log(parseInt(elLeft));
            // if ( deltaX > 0 &&  Math.abs(parseInt(elLeft)) < WIDTH/2 ) {
            //     el.style.left = 0;
            //     return ;
            // } else if ( deltaX < 0 && Math.abs(parseInt(elLeft))> WIDTH/2) {
            //     el.style.left = WIDTH;
            //     return ;
            // }
            // if ( elLeft ) {
            //     el.style.left = ( parseInt(elLeft) + deltaX )+ 'px';
            // } else {
            //     el.style.left = deltaX + 'px';
            // }
            
            // console.log(el);
        },
        delzjlxr (index, e) {
            this.$store.dispatch('delSession', index);
            this.swipe(e);
        },
        signReaded (index, num, e) {
             this.$store.dispatch('signReaded', {index: index, num: num});
             this.swipe(e);
        } 
    },
    filters: {
        // 将日期过滤为 hour:minutes
        time (date) {
            if (typeof date === 'string') {
                date = new Date(date);
            }
            return  date.getHours() + ':' + date.getMinutes();
        },
        content (content) {
            if (!content) {
                return '';
            }
            content = content.replace(/<img.*?(?:>|\/>)/gi, function (v) {
                if ( v.includes('20px') ) {
                    return '【表情】';
                }
                return '【图片】';
            })
            .replace(/&lbrg/, '')
            .replace(/<div.*\>/gi, function (v) {
                return '【文件】';
            });
            return content;
        }
    },
    computed: mapState({
        currentId: (state) => {
            return state.currentSession.id
        },
        currentType: (state) => {
            return state.currentSessionType;
        },
        // sessions: (state) => {
        //     let result = state.sessions.filter(session => session.user.name.includes(state.filterKey));
        //     return result;
        // },
        sessions: (state) => {
            return state.sessions

        },
        searchFriend: (state) => {
            if ( state.filterKey == "" ) {return [];};
            let result = [];
            let g = '';
            let o = {};
            for (var i in state.friends) {
                o = {};
                if (state.friends[i].list) {
                    o.list = state.friends[i].list.filter(friend => friend.username.includes(state.filterKey));
                    o.name = state.friends[i].groupname;
                    result.push(o);
                };
            }
             return result;
        },
        searchGroup: (state) => {
            if ( state.filterKey == "" ) {return [];};
            let group = state.group.filter(group => group.groupname.includes(state.filterKey));
            return group;
        },
        indexTab: (state) => state.indexTab,
        friends: (state)=> {
            
            return state.friends;
        },
        group: (state)=> state.group,
        filterKey: (state) => state.filterKey,
        user: (state) => state.user,
        
    }),
    created () {
        document.addEventListener('click', (e)=> {
            if (this.mousedownShow) {
                this.mousedownShow = !this.mousedownShow;
            };
        })
    }
};
Vue.directive('oncontextmenu', {
    bind: function (el) {
        el.oncontextmenu = function () {
            return false;
        }
    }
})
</script>

<template>
<div class="list">
    <div class="friendApply-box" v-if="friendApplyShow">
        <friendApply  @friendApplyClose="friendApplyShow = false" :applyerId="friendApplyId" :friendsApplyState="friendsApplyState"></friendApply>
    </div>
    <div class="rcDel" v-if="mousedownShow" ref ="recentContactsDel">
        <ul>
            <li @click="removeZjlxr()">移除该会话</li>
        </ul>
    </div>
    <!-- 搜索 -->
    <div class="search"  v-if="filterKey">
        <div class="" v-for="items in searchFriend">
            <div v-if="items.list.length">
                <p class="search-list-name">{{ items.name }}</p>
                <ul  class="search-list" v-if="items.list.length">
                    <li v-if="items.list" v-for="item in items.list" :class="{ active: item.id === currentId }" @click="searchSelectSession(item.id, 'message', item.username, item.avatar, items.name)">
                        <div class="icon-avatar" @click="perInfo(item.type)">
                            <img class="avatar"  width="48" height="48" :alt="item.username" :src="user.documentUrlOms  + item.avatar">
                        </div>
                        <div>
                            <p class="name">{{item.username}}</p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
         <ul  class="list-item" v-if="searchGroup.length">
            <li v-for="g in searchGroup" @click="selectSession(g.id, 'groupMessage', g.groupname, g.avatar)">
                 <img class="avatar"  width="40" height="40" :alt="g.groupname" :src="g.avatar">
                <p class="name">{{g.groupname}}</p>
            </li>
        </ul>
    </div>
<!-- 最近联系人 -->
    <div v-if = "1 == indexTab" id="zjlxr-box">

        <ul id="zjlxr" v-oncontextmenu ="sessions"  class="list-item">
        
            <!-- <li @click="selectSession(item.id, item.type, item.user.name, item.user.img)"><i class="iconfont-chat">&#xe603;</i></li> -->

            <li v-if="sessions.length <=0 " style="text-align: center;">还没有最近联系人！</li>
            <li v-for="(item, index) in sessions"
            :class="{ active: item.id === currentId && item.type === currentType }" @click="selectSession(item.id, item.type, item.user.name, item.user.img)"  @mousedown.3 ="mousedown(item, index, $event)"  v-finger:swipe="swipe" :key="index">
                <div class="list-info">
                    <div class="icon-avatar" @click="perInfo(item.type)">
                        <img class="avatar"  width="48" height="48" :alt="item.user.name" :src="(item.user.img.indexOf('http') == -1 ? user.documentUrlOms + '/' + item.user.img : item.user.img )">
                    </div>
                    <div class="list-text">
                        <div class="list-time">
                            <span class="list-message-name" v-if="item.messages.length > 0" >{{ item.messages[item.messages.length-1].date | time}}</span>
                        </div>
                        <div class="list-name">
                            <p class="name">{{item.user.name}}</p>
                        </div>
                        <div class="list-message" v-if="item.messages.length > 0">
                            <span class="list-message-name"  >{{item.messages[item.messages.length-1].self || item.type =='message'   ? '' : item.messages[item.messages.length-1].name + ':' }}</span>

                            <span v-if="!item.revokeState">{{ item.messages[item.messages.length-1].content | content }}</span>
                            <span v-else>"已撤销"</span>
                        </div>
                    </div>
                    
                </div>
                <span class="message-num" v-if="item.messageNum" >{{ item.messageNum }}</span>
                <div class="list-act-box">
                    <div class="list-act-sign" @click.stop="signReaded(index, item.messageNum, $event)">
                        <span v-if="item.messageNum">标记为已读</span>
                        <span v-if="!item.messageNum">标记为未读</span>
                    </div>
                    <div class="list-act-del" @click.stop="delzjlxr(index, $event)">
                        <span>删除</span>
                    </div>
                </div>
            </li>
        </ul>
    </div>
    <!-- 好友列表 -->
    <div v-if = "2 == indexTab" class="friend-list-box">
        <ul class="friend-list list-item">
            <li class="friend-add" @click="$emit('route', {}, 'friendAdd')"><span class="friend-add-icon">+</span>添加好友</li>
            <li v-for="(item,index) in friends" class="chat-friend-list" >
                <friends-list :item="item" @fmainShow="$emit('mainShow')" @friendsApple="friendApply"></friends-list>
                <!-- <img class="avatar"  width="30" height="30" >
                <p class="name">{{'测试'}}</p> -->
            </li>
        </ul>
    </div>
    <!-- 群 -->
    <div v-if = "3 == indexTab"  class="group-list-box">
         <ul class="group-list list-item">
            <li v-for="item in group" class="" @click="selectSession(item.id, 'groupMessage', item.groupname, '' + item.avatar)">
                <img class="avatar" :src="'' + item.avatar"   width="40" height="40" >
                <p class="name">{{ item.groupname }}</p>
            </li>
        </ul>
    </div>
</div>
</template>

<style type="text/css" lang="less">
*{
    -moz-box-sizing: border-box;  -webkit-box-sizing: border-box; -o-box-sizing: border-box; -ms-box-sizing: border-box; box-sizing: border-box;
}

@media screen and (max-width: 500px) {
    .chat-friend-list {
        position: relative;
        p.list-name {
            padding: 14px 0 14px 25px;
            margin: 0;
        }
        i {
            padding: 10px 5px;
            position: absolute;
            top: 5px;
        }
        li {
            position:relative;
            padding: 12px;
            &.active {
            background-color: rgba(255, 255, 255, 0.9);
        }
            ul {
                li {
                    position: relative;
                    left: 0;
                }
                li:before{
                content: "";
                position: absolute;
                width: 200%;
                left: 0;
                top: 0;
                transform: scale(.5);
                transform-origin: 0 0;
                -webkit-transform: scale(.5);
                -webkit-transform-origin: 0 0;
                background-color: #b7b7b7;
                height: 1px;
                z-index: 2;
            }
            }
        }
        .friendApply {
            float:right;
        }
        .newFriendNum{
            position: absolute;
            display: line-block;
            width: 20px;
            height: 20px;
            line-height: 20px;
            border-radius: 20px;
            background-color: #d32f2f;
            color: #000;
            text-align: center;
            right: 20px;
            /* right: 10px; */
            z-index: 222;
            top: 10px;
        }
        .friendsNum {
            position: absolute;
            display: line-block;
            line-height: 20px;
            color: #000;
            text-align: center;
            right: 20px;
            /* right: 10px; */
            z-index: 222;
            top: 12px;
        }
        .friendNew {
            width: 10px;
            height: 10px;
            border-radius: 10px;
            background-color: #d32f2f;
            padding: 0;
            position: absolute;
            top: 16px;
            right: 74px;
        }

    }
    .list-act-box {
        position: absolute;
        top: 0;
        right: -190px;
        height: 100%;
        line-height: 60px;
        text-align: center;
        color: #fff;
        width: 185px;
        .list-act-sign {
            width: 100px;
            display: inline-block;
            background-color: #b9b1b1;
        }
        .list-act-del {
            width: 80px;
            display: inline-block;
            background-color: #d26d6d;
        }
    }
}
@media screen and (min-width: 500px) {
     .list-act-box {
            display: none;
        }
    .chat-friend-list {
        position: relative;
        p.list-name {
                color: #000;
                padding: 0px 0 0px 25px;
                margin: 14px 0;
        }
        i {
            color: #000;
            padding: 10px 5px;
            position: absolute;
            top: 4px;
        }

        li {
            position:relative;
            padding: 12px;
            &.active {
            background-color: rgba(255, 255, 255, 0.9);
        }
            ul {
                li {
                    position: relative;
                }
                li:before{
                content: "";
                position: absolute;
                width: 200%;
                left: 0;
                top: 0;
                transform: scale(.5);
                transform-origin: 0 0;
                -webkit-transform: scale(.5);
                -webkit-transform-origin: 0 0;
                background-color: #b7b7b7;
                height: 1px;
                z-index: 2;
            }
            }
        }
        .friendApply {
            position:absolute;
            top:23px;
            right: 10px;
            color: #b2b2b2;
        }
        .friendNew {
            width: 10px;
            height: 10px;
            border-radius: 10px;
            background-color: #d32f2f;
            padding: 0;
            position: absolute;
            top: 26px;
            right: 74px;
        }
        .newFriendNum{
            position: absolute;
            display: line-block;
            width: 20px;
            height: 20px;
            line-height: 20px;
            border-radius: 20px;
            background-color: #d32f2f;
            color: #000;
            text-align: center;
            right: 20px;
            /* right: 10px; */
            z-index: 222;
            top: 10px;
        }
        .friendsNum {
            position: absolute;
            display: line-block;
            line-height: 20px;
            color: #000;
            text-align: center;
            right: 20px;
            /* right: 10px; */
            z-index: 222;
            top: 12px;
        }

    }
}

</style>
<style scoped lang="less" >

@media screen and (max-width: 500px) {
    .list {
        top: 50px;
        left: 0;
        position: absolute;
        width: 100%;
        bottom: 0;
        .list-item {

            position: absolute;
            bottom: 0;
            top: 0;
            width: 100%;
            overflow-x: hidden;
            -webkit-overflow-scrolling: touch;
            
        }


    }
    .search,.group-list-box, friend-list-box, #zjlxr-box{
        height: 100%;

    }
    .friend-add {
        .friend-add-icon {
            font-size: 28px;
            padding: 5px;
        }
        padding: 10px;
    }
    #zjlxr li:not(:first-child):before{
        content: "";
        position: absolute;
        width: 200%;
        left: 0;
        top: 0;
        transform: scale(.5);
        transform-origin: 0 0;
        -webkit-transform: scale(.5);
        -webkit-transform-origin: 0 0;
        background-color: #b7b7b7;
        height: 1px;
        z-index: 2;
    }
    #zjlxr {
        li {
                cursor: pointer;
                transition: background-color .1s;
                position: relative;
                height: 64px;
            }
    }
    .group-list, .search {
        li {
            border-top: 1px solid #ccc;
            padding:12px;
        }
    }
    .group-list, .search {
        li {
            padding: 12px;
            height: 65px;
        }
        .name {
            width: 135px;
            line-height: 40px;
        }
    }
    .group-list,.friend-list {
        li {
            
            ul {
                li {
                    position: relative;
                }
                li:before{
                content: "";
                position: absolute;
                width: 200%;
                left: 0;
                top: 0;
                transform: scale(.5);
                transform-origin: 0 0;
                -webkit-transform: scale(.5);
                -webkit-transform-origin: 0 0;
                background-color: #b7b7b7;
                height: 1px;
                z-index: 2;
            }
            }
        }

    }
    #zjlxr li:last-child:after{
        content: "";
        position: absolute;
        width: 200%;
        left: 0;
        bottom: 0;
        transform: scale(.5);
        transform-origin: 0 0;
        -webkit-transform: scale(.5);
        -webkit-transform-origin: 0 0;
        background-color: #b7b7b7;
        height: 1px;
        z-index: 2;
    }
    .list {
    .rcDel {
        position: fixed;
        width: 150px;
        box-shadow: 0 0 4px #ccc;
        background-color: #fff;
        z-index: 999;
        color: #000;
        li {
            padding-left: 15px;
        }
    }
    .search {
        .search-list {
            .icon-avatar {
                position: relative;
                float: left;
                width: 57px;
                height: 57px;
                margin-right: 10px;
                border: 4px solid #fff;
            }
        } 
        .search-list-name {
            padding-left: 10px;
            background-color: #868686;
            color: #ffffff;
        }
        position: absolute;background-color: #fff;width: 100%;
        z-index: 999;
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
    
    .friend-list, .group-list, #zjlxr {
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
       
       
        .message-num {
            position: absolute;
            display: line-block;
            width: 20px;
            height: 20px;
            line-height: 20px;
            border-radius: 20px;
            background-color: #d32f2f;
            color: #fff;
            text-align: center;
            left: 48px;
            /* right: 10px; */
            z-index: 222;
            top: 0;
        }
    }
    .avatar, .name {
        vertical-align: middle;
    }
    .list-info{
        position: relative;
        left: 0;
        padding: 8px;
        background-color: #ffffff;
        transition: .2s transform linear;
        .icon-avatar {
            position: relative;
            float: left;
            width: 57px;
            height: 57px;
            margin-right: 10px;
            border: 4px solid #fff;
        }
        .list-text {
            .list-time {
                float: right;
                color: #b2b2b2;
            }
            .list-name {
                height: 25px;
                line-height: 25px;
                font-size: 18px;
                color: #000;
            }
            .list-message {
                line-height: 23px;
                font-size: 14px;
                color: #888888;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                span {
                    display: inline-block;

                }
            }
        }
    }
    .avatar {
        border-radius: 2px;
    }
    .name {
        position: absolute;
        display: inline-block;
        font-size: 18px;
        margin: 0;
        width: 135px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
        left: 0;
        padding-left: 73px;
    }
    .friendApply-box {
        position: absolute;
        left: 0;
        top: -95px;
        width: 100%;
        z-index: 9999;
        background-color: #f2f2f2;
        bottom: -50px;
    }
}
}
@media screen and (min-width: 500px) {
.list {
    position: relative;
    .rcDel {
        position: fixed;
        width: 150px;
        box-shadow: 0 0 4px #ccc;
        background-color: #fff;
        z-index: 999;
        color: #000;
        li {
            padding: 10px;
            border: none;
        }
    }
    .list-item {
            height: 517px;
            overflow: auto;
        }
    .friend-add {
        display: none;
    }
    .search { 
        position: absolute;background-color: #e8e8e8;width: 252px;
        z-index: 999;height: 517px;overflow: auto;
        .search-list {
            .icon-avatar {
                position: relative;
                float: left;
                width: 57px;
                height: 57px;
                margin-right: 10px;
                border: 4px solid #fff;
            }
        } 

        .search-list-name {
            padding-left: 10px;
            background-color: #fff;
            color: #000;
        }
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
    .friend-list, .group-list, #zjlxr {
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
    .chat-friend-list {
            li {
                 &:hover {
                    background-color: rgba(255, 255, 255, 0.03);
                }
            }
    }
    li {
        
        cursor: pointer;
        transition: background-color .1s;
        position: relative;
        border-top: 1px solid #dcdcdc;
        &.active {
            background-color: rgba(0, 0, 0, 0.1);
        }
        &:last-child{
            border-bottom: 1px solid #ccc;
        }
        .message-num {
            position: absolute;
            display: line-block;
            width: 20px;
            height: 20px;
            line-height: 20px;
            border-radius: 20px;
            background-color: #d32f2f;
            color: #fff;
            text-align: center;
            left: 50px;
            z-index: 222;
            top: 0;
        }
    }
    .avatar, .name {
        vertical-align: middle;
    }
    
    .avatar {
        border-radius: 2px;
    }
    .list-info{
        position: relative;
        left: 0;
        padding: 8px;
        transition: .2s transform linear;
        .icon-avatar {
            position: relative;
            float: left;
            width: 57px;
            height: 57px;
            margin-right: 10px;
            border: 4px solid #fff;
        }
        .list-text {
            .list-time {
                float: right;
                color: #b2b2b2;
            }
            .list-name {
                height: 25px;
                line-height: 25px;
                font-size: 18px;
                color: #000;
            }
            .list-message {
                line-height: 23px;
                font-size: 14px;
                color: #888888;
                width: 150px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                span {
                    display: inline-block;
                    
                }
            }
        }
    }
    .group-list, .search {
        li {
            padding: 12px;
            height: 76px;
        }
        .name {
            width: 135px;
            line-height: 40px;
        }
    }
    .name {
        display: inline-block;
        font-size: 16px;
        margin: 0;
        color: #000;
        width: 90px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .friendApply-box {
        position: absolute;
        left: 100%;
        top: -88px;
        width: 580px;
        z-index: 99999;
        background-color: #f2f2f2;
        height: 600px;
    }
}
}

</style>