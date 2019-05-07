
<script>
import Vue from 'vue';

import { mapState } from 'vuex'

export default {
    data: function () {
        return {
            selfInfo: false,
            setShow: false,
            sets: {
                voice: [
                    '开启声音',
                    '关闭声音'
                ],
                desktop: [
                    '开启桌面通知',
                    '关闭桌面通知'
                ]
            }
        };
    },
    computed: mapState({
        user: ({ user }) => user,
        filterKey: ({ filterKey }) => filterKey,
        indexTab: ({ indexTab }) => indexTab,
        userSet: ({ userSet }) => userSet,
        newFriendNum: (state) => {
            let newFriendNum = 0;
            for (let i in state.friends[0].list) {
                if ( state.friends[0].list[i].state == 1 ) {
                    newFriendNum++;
                }
            }
            return newFriendNum;
        }
    }),
    methods: {
        selectTab: function (num) {
            this.$store.dispatch('selectTab', num);
        },
        showInfo: function (e) {
            // if ( !this.selfInfo ) {
                this.selfInfo = !this.selfInfo;
                
            // };
        },
        setUser (i) {
            let userSet = this.userSet;
            userSet[i] = userSet[i] == 0 ? 1 : 0;
            this.$store.dispatch('userSet', i, userSet[i]);
            localStorage.setItem('chat-set', JSON.stringify(userSet));
        },
        addFriend () {

        }
    },
    created () {
        document.addEventListener('click', (e) => {
            if (  this.selfInfo ) {
                 this.selfInfo = !this.selfInfo;
             }
             if ( this.setShow ) {
                 this.setShow = !this.setShow;
             };
        })
    }
}

</script>
<template>
	<div class="menu">
		<ul>
			<li style="position: relative" class="header-img" @click.stop="showInfo()" ><img :src="user.documentUrlOms + user.img" width="40px" height="40px" alt="">
                <div class="selfInfo" ref="si" v-if="selfInfo">
                    <div>
                        <span>{{ user.name }}</span>
                    </div>
                    <div>
                        <div class="selfInfo-img">
                            <img src="" width="150" height="150" :src="user.img">
                        </div>
                        <!-- <span>职位：</span> -->
                    </div>
                </div>
            </li>
            <li :class="{actionColor:1 ==  indexTab}" @click="selectTab(1)" > <i class="iconfont-chat">&#xe62d;</i> </li>
            <li :class="{actionColor:2 ==  indexTab}" @click="selectTab(2)"><i class="iconfont-chat">&#xe600;</i><span class="newFriend" v-if="newFriendNum">{{newFriendNum}}</span></li>
			<li :class="{actionColor:3 ==  indexTab}" @click="selectTab(3)"><i class="iconfont-chat">&#xe682;</i></li>
		</ul>
        <div class="chat-set" title="设置">
            <i @click.stop="setShow = !setShow"><img src="../assets/liebiao.png" alt=""></i>
            <transition name="fade">
                <ul class="chat-set-list" v-if="setShow">
                    <li><a target="_blank" href="/chat/new_groupChat.php">新建群聊</a></li>
                    <li @click="$emit('route',{}, 'addFriend')"><span>添加好友</span></li>
                    <li v-for="(set, index) in sets" @click.stop="setUser(index)">{{set[userSet[index]]}}</li>
                </ul>
             </transition>
        </div>
	</div>
</template>
<style scoped lang="less">
    .fade-enter-active, .fade-leave-active {
      transition: opacity .5s
    }
    .fade-enter, .fade-leave-active {
      opacity: 0
    }
@media screen and (max-width: 500px) {
    .menu {
        .header-img, .chat-set{
            display: none;
        }
        ul li{
            position:relative;
            width: 33%;
            height: 100%;
            line-height: 50px;
            text-align:center;
            float: left;
            i {
                width: 40px;
                height: 40px;
                font-size: 26px;
            }
            .newFriend {
                position: absolute;
                display: line-block;
                width: 20px;
                height: 20px;
                line-height: 20px;
                border-radius: 20px;
                background-color: #d32f2f;
                color: #fff;
                text-align: center;
                left: 42px;
                /* right: 10px; */
                z-index: 222;
                top: 0;
            }
        }
    }
    .actionColor { 
            i {
                color: #1dbe1a;
            }
        }
}
@media screen and (min-width: 500px) {
	.menu {
        position: relative;
        cursor:pointer; 
		width: 58px;
        height: 100%;
        li {
            position: relative;
            text-align: center;
            padding: 10px;
            i {
                font-size: 26px;
            }
        }
        .actionColor { 
            background-color: rgba(228, 219, 219, 0.3);
            i {
                color: #1dbe1a;
            }

        }
        .selfInfo {
            position: absolute;
            width: 200px;
            height: 200px;
            top: 50px;
            left: 50px;
            z-index: 1000;
            color: #000;
            background-color: #fff;
        }
        .selfInfo > div {
            text-align: center;
        }
        .selfInfo > div > span{
            font-size: 20px;
        }
        .chat-set {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 50px;
            .chat-set-list {
                position: absolute;
                text-align: left;
                left: 10px;
                bottom: 100%;
                width: 160px;
                color: #000;
                background-color: #fff;
                box-shadow: 0 6px 12px rgba(0,0,0,.175);
                border-radius: 5px;
                z-index: 99;
                li {
                    border-top: 1px solid #ccc;
                }
            }
        }
        .chat-set i{
            width: 100%;
            height: 50px;
            display: block;
            text-align: center;

        }
        .newFriend {
                position: absolute;
                display: line-block;
                width: 20px;
                height: 20px;
                line-height: 20px;
                border-radius: 20px;
                background-color: #d32f2f;
                color: #fff;
                text-align: center;
                left: 42px;
                /* right: 10px; */
                z-index: 222;
                top: 0;
        }
	}
}

</style>