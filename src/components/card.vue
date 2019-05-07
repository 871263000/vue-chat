<script>
import Vue from 'vue';
import { mapState } from 'vuex';

Vue.component('onlineMan', function (resolve) {
  // 这个特殊的 require 语法告诉 webpack
  // 自动将编译后的代码分割成不同的块，
  // 这些块将通过 Ajax 请求自动下载。
  require(['./onlineMan'], resolve)
});

export default {
    data () {
        return {
            onlineShow: false
        }
    },
    computed: mapState({
        user: ({ user }) => user,
        filterKey: ({ filterKey }) => filterKey,
        online: (state) => {
            return state.events.onlineMan
        }
    }),
    methods: {
        onKeyup (e) {
            this.$store.dispatch('search', e.target.value);
        },
        onlineShowFun () {
            this.onlineShow = !this.onlineShow;
        }
    }
};
</script>

<template>
<div class="card">
<div class="online-man-box" v-if="onlineShow">
    <onlineMan @close="onlineShow = false" @mainShow="$emit('mainShow')"></onlineMan>
</div>
        <div class="online-man" @click="onlineShowFun()"><i class="iconfont-chat">&#xe601;</i><span class="online">{{online}}人</span>
        </div>
        <input class="search" type="text" placeholder="搜索" @input="onKeyup">
</div>
</template>

<style scoped lang="less">

@media screen and (max-width: 500px) {
    .card{
        padding: 0 15px;
        margin: 10px 0px;
        display: box;
        display: -webkit-box;
        .online-man-box {
            width: 100%;
            position: absolute;
            top: -46px;
            left: 0;
            z-index: 999;
            bottom: 0;
            background-color: #fff;
            font-size: 18px;
            color: #000;
        }
        i {
            color: #000;
            font-size: 26px;
            display: inline-block;
            margin-top: 0px;
            padding-top: 0;
            height: 23px;
            padding: 5px;
            float: left;
        }
        .online{
            padding: 5px;
            display: inline-block;
        }

    }
    .avatar, .name {
        vertical-align: middle;
    }
    .avatar {
        border-radius: 2px;
    }
    .name {
        display: inline-block;
        margin: 0 0 0 15px;
        font-size: 16px;
    }

        .search {
            padding:0 10px;
            -webkit-box-flex: 1;
            -moz-box-flex: 1;
            box-flex: 1;
            display: block;
            font-size: 12px;
            color: #000;
            height: 30px;
            width: 100%;
            line-height: 30px;
            border: solid 1px #c3c3c3;
            border-radius: 4px;
            outline: none;
            /*background-color: #26292E;*/
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
        }

}
@media screen and (min-width: 500px) {

.card {
    .online-man {
        cursor: pointer;
    }
    padding: 12px;
    i {
        color: #ffffff;
        font-size: 26px;
        display: inline-block;
        margin-top: 0px;
        padding-top: 0;
        height: 23px;
        padding: 5px;
        float: left;
    }
    .online-man {
        i {
            color: #000;
        }
    }
    .online{
            padding: 5px;
            display: inline-block;
            color: #000;
        }
    footer {
        margin-top: 10px;
    }

    .avatar, .name {
        vertical-align: middle;
    }
    .avatar {
        border-radius: 2px;
    }
    .name {
        display: inline-block;
        margin: 0 0 0 15px;
        font-size: 16px;
    }
    .online-man-box {
            width: 254px;
            position: absolute;
            top: 41px;
            left: 58px;
            z-index: 99999;
            bottom: 0;
            background-color: #fff;
            color: #000;
        }
    .search {

        padding: 0 10px;
        font-size: 12px;
        color: #000;
        height: 30px;
        width: 100%;
        line-height: 30px;
        border: solid 1px #c3c3c3;
        border-radius: 4px;
        outline: none;
        /*background-color: #26292E;*/
    }
}
}

</style>