<script>
import Vue from 'vue';
import { mapState } from 'vuex';
export default {
	name: 'friend-list',
    data () {
        return {
            openFun: false,
            data: [],
        }
    },
	props:['item', 'index', 'filterKey'],
    computed: {
        ...mapState({
        	currentId: (state) => {
	            return state.currentSession.id;
	        },
        })
    },
    methods: {
        open: function () {
            this.openFun = !this.openFun;
        },
    },
    watch: {
        data (val, odlVal) {
            this.$emit('addIds', val, this.index);
        },
        filterKey (val) {
            this.openFun = val ? true : false; 
        }
    }
}

</script>

<template>
	<div class="friend-list">
		<div @click="open()">
			<i class="iconfont-chat" >{{ openFun? "&#xe720;":"&#xe62e;" }}</i>
			<p class="list-name">{{ item.groupname }}</p>
		</div>
	    <ul v-if="openFun">
	         <li v-for="list in item.list">
             <input type="checkbox" v-model="data" :value="{'id': list.id, 'type': item.type, index: index}">
	             <img :src="list.avatar" alt="" width="30" height="30">
	            <p class="name" style=" display: inline-block;font-size: 18px;margin: 0;width: 100px;text-overflow: ellipsis;white-space: nowrap;">{{ item.type == 'm'?list.username: list.groupname }}</p>
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

    }
}

</style>