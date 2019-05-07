<template>
<div id="chat-app">
    <div title="按[esc]键最大化" class="chat-min">
        <i class="mesNum" v-if="mesNum > 0">
            {{mesNum > 99 ? '99+' : mesNum }}
        </i>
        <i class="iconfont-chat" >&#xe62d;</i>
    </div>
</div>

</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import axios from '../libs/util'
Vue.prototype.$http = axios.ajax;
export default {
    name: 'app',
    data () {
        return {
        }
    },
    computed: mapState({
        mesNum: (state) => {
            let mesNum = 0;
            state.sessions.forEach(function (m) {
                mesNum += m.messageNum;
            });
            return mesNum;
        },
    }),
    mounted () {
        // document.addEventListener("deviceready", onDeviceReady, false);    // device APIs are available    //      
      
        //  function onDeviceReady() {          
        //     document.addEventListener("resume", onResume, false);      
        //  }      
      
        //     // Handle the resume event    //      
        // function onResume() {    
        //     //回到前台后  调用这里  
        //      this.init();
        // }
        
    },
    methods: {
        init () {
            
            // 请求人员信息
            let json = '/omsIm/demo/json/getList.php?class=selfInfo';
            let jsonMessage = '/omsIm/demo/json/getList.php?class=mesNum';
console.log(77)
            axios.ajax.get(json)
            .then((response) => {
                console.log(55)
                this.$store.dispatch('initData', response.data);
                // 请求消息数量
                axios.ajax.get(jsonMessage)
                    .then((response) => {

                        this.$store.dispatch('acceptMesPh', response.data.reverse());
                        

                    })
                    .catch(function(response) {
                        console.log(response)
                    });
            })
            .catch(function(response) {
                console.log(response)
            });
        }
    },
    created: function () {
        console.log(4511);
        this.init();
    }

}

</script>

<style lang="less">

img{
    vertical-align: middle;
}

a {
     text-decoration:none;
}
</style>
<style lang="less" scoped>
.chat-min {
    cursor: pointer;
    position: fixed;
    z-index: 999999;
    bottom: 50px;
    left:50px;
    i {
        font-size: 30px;
    }
    .mesNum{
        position: absolute;
        text-align:center;
        line-height: 26px;
        top: -9px;right: -13px;
        background-color: #ca4646;
        color: #fff;
        border-radius: 13px;
        width:26px;
        height:26px;
    }
}

</style>

