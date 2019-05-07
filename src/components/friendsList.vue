<script>
import Vue from 'vue';
import { mapState } from 'vuex';
export default {
	name: 'friend-list',
    data () {
        return {
            openFun: false,
        }
    },
	props:['item'],
    computed: {
        newFriendNum: function () {
            let num = 0;
            for (let i in this.item.list ) {
                if ( this.item.list[i].state == 1 ) {
                    num++;
                }
            }
            return num;
        },
        ...mapState({
        	currentId: (state) => {
	            return state.currentSession.id;
	        },
            user: (state) => state.user
        })
    },
    methods: {
        open: function () {
            this.openFun = !this.openFun;
        },
         selectSession (id, type, name, img, itemId, list) {
            if ( itemId == 1 ) {
                this.$emit('friendsApple', list.id, list.state);
                return false;
            }
            this.$emit('fmainShow');
            let data = {id: id, type: type, name: name, img: img};
            this.$store.dispatch('selectSession', data);
        },
    }
}

</script>

<template>
	<div class="friend-list">
		<div @click="open()">
			<i class="iconfont-chat" >{{ openFun? "&#xe720;":"&#xe62e;" }}</i>
			<p class="list-name">{{ item.groupname }}</p>
			<span :class="{newFriendNum: item.id == 1, friendsNum: item.id != 1}" :d="item.id" v-if="item.id == 1 ? newFriendNum : item.list.length">{{ item.id==1 ? newFriendNum : item.list.length }}</span>
		</div>
	    <ul v-if="openFun">
	         <li v-for="list in item.list" @click="selectSession(list.id, 'message', list.username, list.avatar, item.id, list )" :class="{ active: list.id === currentId }">
	             <img :src="user.documentUrlOms + list.avatar" alt="" width="40" height="40">
	            <p class="name" style=" display: inline-block;font-size: 18px;margin: 0;width: 125px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;color: #000;">{{ list.username }}</p>
	            <i v-if="list.state == 1" class="friendNew"></i>
	            <span v-if="item.id == 1" class="friendApply">{{ list.state == 1 ? "等待验证":"好友申请" }}</span>
	        </li>
	        <li v-if="item.list.length == 0">没有数据！</li>
	    </ul>
	</div>
</template>

<style scoped lang="less">


@media screen and (max-width: 500px) {
    .friend-list {
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
            background-color: rgba(255, 255, 255, 0.1);
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
            color: #fff;
            text-align: center;
            right: 20px;
            /* right: 10px; */
            z-index: 222;
            top: 10px;
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
}
@media screen and (min-width: 500px) {
    .friend-list {
        p.list-name {
                padding: 0px 0 0px 25px;
                margin: 14px 0;
        }
        i {
            padding: 10px 5px;
            position: absolute;
            top: 4px;
        }
        li {
            position:relative;
            padding: 12px;
            &.active {
            background-color: rgba(255, 255, 255, 0.1);
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

    }
}

</style>