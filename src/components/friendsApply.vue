<script>
import Vue from 'vue';
import { mapState } from 'vuex';
import Vuex from 'vuex';
import QS from 'qs';
// import alert from './plugin/alert';
// Vue.use(alert);
export default {
	data () {
		return {
			userInfo: {},
			show: true
		} 
	},
	props: ['applyerId', 'friendsApplyState'],
	computed: {
		currentSessionChage () { return this.currentSession.id },
	  // 使用对象展开运算符将此对象混入到外部对象中
	  ...mapState({
	    	user: ({ user }) => user,
    		currentSession: ({currentSession}) => currentSession,
	  }),
	},
    methods: {
    	getAjax: function  (options) {
    		return this.$http.get('/omsIm/demo/json/getList.php', {params: options})
	    	
    	},
    	postAjax: function  (options) {
    		return this.$http.post('/omsIm/demo/json/getList.php', QS.stringify(options), {emulateJSON:true})
	    	
    	},
    	adopt (p) {
    		let o = {
    			class: 'friendApply',
	    		uid: this.applyerId,
	    		para: 'agree',
    		}
    		if ( p == 'a' ) {
    			// alert('已发送！');
    			alert('已发送！');
    			this.show= false;
    			this.$store.dispatch('friendDel', this.applyerId);
    		} else if ( p == 'd' ) {
    			let pp = confirm('你确定要删除吗？');
    			if (pp) {
    				alert('已删除！');
    				// this.show= false;
    				this.$store.dispatch('friendDel', this.applyerId);
    			}
    			o.para = 'del';
    		} else if ( p == 'n' ) {
    			alert('已发送！');
    			o.para = 'refuse';
    		}
    		this.postAjax(o).then(res=> {
	    		// this.userInfo = res.data;
	    	});
	    	this.$emit('friendApplyClose');
    	}
    },
    created () {
    	let options = {
    		class: 'friendApplyInfo',
    		uid: this.applyerId,
    	};
    	this.show= true;
    	// if ( this.friendsApplyState ) {
    		options.class = 'friendsStateChange';
    		this.$store.dispatch('friendsStateChange', this.applyerId);
    		this.postAjax(options);
    	// }
    	options.class = 'friendApplyInfo';
    	this.getAjax(options).then(res=> {
    		this.userInfo = res.data;
    	})
    	.catch(res => {

    	});
    },
    watch: {
    	currentSessionChage () {
    		this.$emit('friendApplyClose');
    	},
    	applyerId () {
    		let options = {
	    		class: 'friendApplyInfo',
	    		uid: this.applyerId,
	    		read: true,
	    	};
	    	if ( this.friendsApplyState ) {
	    		options.class = 'friendsStateChange';
	    		this.postAjax(options);
	    	}
	    	this.show= true;
	    	this.getAjax(options).then(res=> {
	    		this.userInfo = res.data;
	    	})
	    	.catch(res => {

	    	});
    	}
    }
};
</script>

<template>

<!-- 手机 title -->
<div class="person-info" v-if="show">
	<div class="dialog-title" ref="chatDrop" v-chat-drop>
	    <i class="backSession" @click="$emit('friendApplyClose')"></i>
	    <!-- <i class="backSession" @click="clearSession()"></i> -->
	    <span class="text-left dialogue-title-name">详细资料</span>
	</div>
	<div class="person-info-body">
		<div class="person-info-img">
			<img :src="user.documentUrlOms + this.userInfo.card_image_smail" alt="">
		</div>
		<div class="person-info-text">

			<p><span>姓名：</span>{{this.userInfo.name}}</p>
			<p><span>组织名字：</span>{{this.userInfo.org_name}}</p>
		</div>
		<div style='clear: both'></div>
		<div class="send-message-box">
			<span class="send-message" @click="adopt('a')">通过验证</span>
			<span class="send-message friendD" @click="adopt('n')">不同意</span>
			<span class="send-message friendD" @click="adopt('d')">删除</span>
		</div>
	</div>
</div>

</template>

<style scoped lang="less">



@media screen and (max-width: 500px) {
	.dialog-title {
	    height: 45px;
	    border-bottom: 1px solid #ccc;
	    cursor: move;
	    background-color: rgb(48, 48, 54);
	    color: #fff;
	    text-align: center;
	    .dialogue-title-name {
	        height: 100%;
	        line-height: 45px;
	        font-size: 20px;
	        display: inline-block;
	    }
	    .backSession {
	        position: absolute;
	        top: 0;
	        left: 10px;
	        display: inline-block;
	        width:32px;
	        height:45px;
	        line-height: 45px;
	        background: url('../assets/xyjt.png') center no-repeat;
	    }
	    .man-info {
	        position: absolute;
	        top: 0;
	        right: 10px;
	        display: inline-block;
	        width:32px;
	        height:45px;
	        line-height: 45px;
	        font-size: 26px;
	    }
	}
		.person-info-body {
		    position: absolute;
    		top: 45px;
    		bottom: 0;
    		margin-top: 30px;
    		width: 100%;	
	    p {
	    	color:#000
	    }
	    .person-info-img {
	    	display: inline-block;
	    	width: 100px;
	    	float: left;
	    	margin-left: 15px;
	    	img {
	    		max-width: 80px;
	    	}
	    }
	    .person-info-text {
	    	display: inline-block;
	    	float: left;

	    }
	    .send-message-box{
	    	text-align: center;
	    	cursor: pointer;
	    	margin: 10px;
	    	.friendD {
	    		background-color:#cc484e;
	    	}
	    	span {
	    		padding: 10px 10px;
			    color: #fff;
			    background-color: #7fb183;
			    margin: 10px;
			    display: block;
			    text-align: center;
	    	}
	    	
	    }
	}
}
@media screen and (min-width: 500px) {
.dialog-title {
	    height: 45px;
	    border-bottom: 1px solid #ccc;
	    cursor: move;
	    background-color: rgb(48, 48, 54);
	    color: #fff;
	    text-align: center;
	    .dialogue-title-name {
	        height: 100%;
	        line-height: 45px;
	        font-size: 20px;
	        display: inline-block;
	    }
	    .backSession {
	        position: absolute;
	        top: 0;
	        left: 10px;
	        display: inline-block;
	        width:32px;
	        height:45px;
	        line-height: 45px;
	        background: url('../assets/xyjt.png') center no-repeat;
	    }
	    .man-info {
	        position: absolute;
	        top: 0;
	        right: 10px;
	        display: inline-block;
	        width:32px;
	        height:45px;
	        line-height: 45px;
	        font-size: 26px;
	    }
	}
	.person-info-body {
		padding: 20px 40px;
		position: absolute;
	    top: 45px;
	    bottom: 0;
	    margin-top: 30px;
	    p {
	    	color:#000
	    }
	    .person-info-img {
	    	display: inline-block;
	    	width: 80px;
	    	float: left;
	    	margin-left: 15px;
	    	img {
	    		width: 80px;
	    	}
	    }
	    .person-info-text {
	    	display: inline-block;
	    	float: left;
	    	margin-left: 50px;

	    }
	    .send-message-box{
	    	width: 400px;
		    text-align: center;
		    cursor: pointer;
		    margin: 50px 20px;
	    	.friendD {
	    		background-color:#cc484e;
	    	}
	    	span {
	    		height: 50px;
		    	padding: 10px 10px;
		    	color: #fff;
    			background-color: #7fb183;
    			margin: 10px;
	    	}
	    	
	    }
	}
}

</style>