<script>
import Vue from 'vue'
import { mapState } from 'vuex'


Vue.component('videoModel', function (resolve) {
    require(['./modal'], resolve);
});

export default {
    props: ['videoChatInfo'],
    data () {
        return {
            data: [],
            ids: [],
            filterKey: ''
        };
    },
    computed: mapState({

    }),
    methods: {
        close () {
            this.$emit('route', {type: 'close'} );
            this.$store.dispatch('statusChange', {status: 1});
        },
        answer () {
            let _this = this;
            this.$store.dispatch('statusChange', {status: 3});

            // this.$http.get('/static/omsIm/demo/json/json.js')
            this.$http.get('/chat/va-chat/ajax_getToken.php?Invitation')
            .then((response) => {
                // response.data
                let uid = _this.videoChatInfo.from_id.uid;
                _this.$emit('route', {type: 'videoShow', para: { token: response.data[0].uuid }});

                _this.$store.dispatch('videoResAnswerIng', {to_uid: uid ,token: response.data[1].uuid });

            })
            .catch(function(response) {
                console.log(response)
            });

            this.$emit('route', {type: 'close'});

            
        }

    },
    created () 
    {
        this.$store.dispatch('statusChange', {status: 2});
    }
}
</script>

<template>
    <videoModel @close="close">
        <div slot="body">
            <div>
                <span><img :src="videoChatInfo.header_img_url.header_img_url" width="50px" height="50px"></span>
                <span>{{ videoChatInfo.client_name.client_name + ' 请求与你视频通话' }}</span>   
            </div>
            <div class="video-close-box">
                <span @click="close" class="video-close">挂断</span>
                <span @click="answer" class="video-close">接听</span>
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
    span {
        margin: 10px;
    }
}


@media screen and (max-width: 500px) {
    
}
@media screen and (min-width: 500px) {
    
}
</style>