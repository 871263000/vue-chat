<script>
import Vue from 'vue'
import { mapState } from 'vuex'

Vue.component('videoModel', function (resolve) {
    require(['./modal'], resolve);
});

export default {
    props: ['videoChatType'],
    data () {
        return {
        };
    },
    computed: mapState({
        videoStatus: (state) => {
             return state.video.status;
        },
        videoChatInfo: (state) => {
            return state.video.videoChatInfo;
        }

    }),
    methods: {
        close () {
            this.$emit('route', {type: 'close'});
            this.$store.dispatch('statusChange', {status: 1});
        }

    },
    created () 
    {
        let VCT = this.videoChatType;
        if ( VCT == 'videoChat' ) {
            this.$store.dispatch('videoRes');
            this.$store.dispatch('statusChange', {status: 2});
        } else if ( VCT == 'videoIng' ) {

        } 
        
    },
    watch: {
        videoStatus (val)  {
            if ( val == 3 ) { 
                console.log(444445555);
                this.$emit('route', {type: 'videoShow', para: { token: this.videoChatInfo.token }});
                this.$emit('route', {type: 'close'});
            }

        }
    }
}
</script>

<template>
    <videoModel @close="close">
        <div slot="body" >
            <div v-if="videoStatus == 2">
                <div>
                    <span>正在连接.....</span>   
                </div>
                <div class="video-close-box">
                    <span @click="close" class="video-close">取消</span>
                </div>
            </div>
        </div>
    </videoModel>

</template>
<style lang="less" scoped >
.video-close-box {
    text-align: center;
    padding: 10px;
    .video-close {
        margin: 10px auto;
        padding: 5px 10px;
        background-color: #da7c7c;
    }
}


@media screen and (max-width: 500px) {
    
}
@media screen and (min-width: 500px) {
    
}
</style>