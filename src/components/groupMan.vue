<script>
import Vue from 'vue';
import QS from 'qs';
import { mapState } from 'vuex';

Vue.component('messagesLog', function (resolve) {
  // 这个特殊的 require 语法告诉 webpack
  // 自动将编译后的代码分割成不同的块，
  // 这些块将通过 Ajax 请求自动下载。
  require(['./modalMessage'], resolve)
});
Vue.component('addNewGrouper', function (resolve) {
  // 这个特殊的 require 语法告诉 webpack
  // 自动将编译后的代码分割成不同的块，
  // 这些块将通过 Ajax 请求自动下载。
  require(['./selectFriends'], resolve)
});
// window.QRCode = QRCode;
// var QRCode = require('../assets/js/qrcode.js');
export default {
	data () {
		return {
			groupInfo: {list: []},
			showMessageLog: false,
			msg: '',
			addNewGrouperShow: false
		} 
	},
    computed: mapState({
        user: ({ user }) => user,
        currentSession: ({currentSession}) => currentSession,
    }),
    methods: {
    	selectSession (id, type, name, img) {
            this.$emit('mainShow');
            let data = {id: id, type: type, name: name, img: img};
            this.$store.dispatch('selectSession', data);
        },
        addNewGrouper () {
        	// console.log(33);return ;

        	this.addNewGrouperShow = true;
        },
        quitNewGrouper () {
        	if ( this.user.id == this.groupInfo.group_founder ) {
            	if (!confirm('你确定要解散该群吗？')) {
            		return false;
            	};
            } else {
            	if (!confirm('你确定要退出该群吗？')) {
            		return false;
            	};
            }
        	let data = {'class': 'delGrouper', 'id': this.currentSession.id};
        	 this.$http.post('/omsIm/demo/json/getList.php', QS.stringify(data), {emulateJSON:true})
            .then(res=> {
                // this.userInfo = res.data;

                alert('ok！');
            })
            .catch(res => {

            });
            
        },
        delGrouper (id) {
        	if ( this.user.id != this.groupInfo.group_founder ) {
        		alert('只有群创建者能删除！');
        		return false;
        	}
        	if ( confirm('你确定要把他移除群吗？') ) {
        		let data = {'class': 'delGroupers', 'session': this.currentSession.id, 'id': id};
	        	 this.$http.post('/omsIm/demo/json/getList.php', QS.stringify(data), {emulateJSON:true})
	            .then(res=> {
	                
	            })
	            .catch(res => {

	            });
        	};
        },
        selectedMan (selectedMan) {
        	let data = { class: 'addGrouper', data: selectedMan, session: this.currentSession.id };
            this.$http.post('/omsIm/demo/json/getList.php', QS.stringify(data), {emulateJSON:true})
            .then(res=> {
                this.userInfo = res.data;
            })
            .catch(res => {

            });
            alert('添加成功！');
        },
        imgFd (img) {
        	this.$emit('imgShow', img);
        }
    },
    created () {
    	// this.$http.get('/static/omsIm/demo/json/json1.js?class=groupMembers&id=' + this.currentSession.id)
    	this.$http.get('/omsIm/demo/json/getList.php?class=groupMembers&id=' + this.currentSession.id)
    	.then(res=> {
    		this.groupInfo = res.data.data;
    	})
    	.catch(res => {

    	})
    }
};
</script>

<template>

<!-- 手机 title -->
<div class="person-info">
<!-- 群增加人 -->
	<addNewGrouper v-if="addNewGrouperShow" :id="this.currentSession.id" :group="false" @close="addNewGrouperShow = false" @selectedMan="selectedMan">
		<div slot="header">选择你要增加的群员</div>
	</addNewGrouper>
	<messagesLog :show="showMessageLog" @imgShow="imgFd" @close="showMessageLog = false" v-if="showMessageLog"></messagesLog>
	<div class="dialog-title" ref="chatDrop" v-chat-drop>
	    <i class="backSession" @click="$emit('close')"></i>
	    <!-- <i class="backSession" @click="clearSession()"></i> -->
	    <span class="text-left dialogue-title-name">{{ currentSession.name + '详情'}}</span>
	    <i class="iconfont-chat addMan" v-if="currentSession.id != 'all' + user.omsId" @click.stop="addNewGrouper()">&#xe73e;</i>
	</div>
	<div class="pc-add-grouper">
		<ul>
			<li><i class="iconfont-chat">&#xe686;</i><span>({{ groupInfo.list.length }})</span></li>
			<li @click.stop="addNewGrouper()" v-if="currentSession.id != 'all' + user.omsId"><i class="iconfont-chat">&#xe73e;</i><span>添加新成员</span></li>
		</ul>
	</div>
	<div class="group-list">
		<ul>
			<li v-for="lists in groupInfo.list" @click="selectSession(lists.id, 'message', lists.username, lists.avatar)">
				<div class="group-list-img"><img :src=" user.documentUrlOms  + lists.avatar"></div>
				<div class="group-list-name"><span>{{lists.username}}</span></div>
				<span @click.stop="delGrouper(lists.id)" class="delGrouper">X</span>
			</li>
		</ul>
		<div class="delGroup" @click="quitNewGrouper()">
			<span><span v-if="user.id != groupInfo.group_founder && currentSession.id != 'all' + user.omsId" >退出群聊</span> <span v-else><span v-if="currentSession.id != 'all' + user.omsId">解散该群</span></span></span>
		</div>
	</div>

	<div class="person-info-body">
		<div style='clear: both'></div>
		<div class="chat-record">
			<ul>
				<li @click.stop="showMessageLog = true"><span>聊天记录: </span><i class="iconfont-chat" >&#xe6ce;</i></li>
				<!-- <li><span>我的二维码: </span><i class="iconfont-chat" @click="qrcodeShow = true">&#xe62b;</i></li> -->
				<li @click.stop="" class="iPhone-delGroup"><span v-if="user.id != groupInfo.group_founder">退出群聊</span><span v-else><span v-if="currentSession.id != 'all' + user.omsId">解散该群</span></span></li>
			</ul>
		</div>
<!-- 		<div class="send-message-box">
			<span class="send-message" @click="$emit('close')">发消息</span>
		</div> -->
		<div>
			
		</div>
	</div>
</div>

</template>

<style scoped lang="less">



@media screen and (max-width: 500px) {

.person-info{
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	width: 100%;
	z-index: 99999;
	background-color: #fff;
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
		padding: 20px 10px;
		.chat-record {
			padding: 20px;
			li {
				padding: 10px;
			}
			span {
				font-size: 18px;
			}
			i {
				font-size: 26px;
				padding: 0  0  0 10px;
			}
		}
		.send-message-box {
			display: none;
		}
	}
	.addMan {
		float: right;
	    padding: 13px;
	    font-size: 20px;
	}
	.pc-add-grouper {
		display: none;
	}
	.group-list {
		max-height: 200px;
		overflow: auto;
		.delGrouper {
	    	display: none;
	    }
		ul {
			li {
				padding: 12px;
				margin:0 10px;
				display: inline-block;
				.group-list-img {
					width: 40px;
					height: 40px;
					img{
						width: 40px;
						height: 40px;
					}
				}
				.group-list-name {
					text-align: center;
					span {

					}
				}
			}
		}
	}
	.delGroup {
		display:none;
	}
	.iPhone-delGroup {
		cursor: pointer;
	    text-align: center;
	    margin: 10px;
	    position: absolute;
	    bottom: 20px;
	    left: 0;
	    margin: 0;
	    text-align: center;
	    width: 100%;

		span {
			color: #ca3f3f;
			padding: 10px;
    		border: 1px solid #ccc;
		}
	}
}
}
@media screen and (min-width: 500px) {

.person-info{
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
	z-index: 99999;
	background-color: #fff;
	.dialog-title {
		display: none;
	}
	.pc-add-grouper {
		cursor: pointer;
		padding: 10px;
		position: relative;
    	z-index: 2;
    	li {
    		padding: 12px;
    	}
		i {
			padding: 12px;
			font-size: 20px;
		}
		span {
			padding: 12px;
		}
	}
	.person-info-body {
		padding: 20px 50px;
		.chat-record {
			border-top: 1px solid #ccc;
			padding: 20px;
			li {
				padding: 10px;
			}
			span {
				font-size: 18px;
			}
			i {
				font-size: 26px;
				padding: 0  0  0 10px;
			}
		}
		.send-message-box {
			text-align: center;
			.send-message {
				cursor: pointer;
			    background-color: #79b575;
			    color: #fff;
			    padding: 3px 40px;
			    display: inline-block;
			    line-height: 30px;
			    text-align: center;
			    margin: 3px 32px;
			}
		}
	}
	.person-info-body {
		display: none;
	}
	.group-list {
		    overflow: auto;
		    position: relative;
		    height: 100%;
		    top: -112px;
	    .delGrouper {
	    	display: none;
	    }
		ul {
			position: absolute;
		    top: 100px;
		    bottom: 44px;
		    width: 100%;
		    overflow: auto;
			li {
				position: relative;
				padding: 12px;
				margin:0 10px;
				div {
					display:inline-block;
				}
				.group-list-img {
					width: 40px;
					height: 40px;
					img{
						width: 40px;
						height: 40px;
					}
				}
				.group-list-name {
					text-align: center;
					span {

					}
				}
				&:hover {
					.delGrouper {
						cursor: pointer;
				    	position: absolute;
				    	top: 21px;
				    	right: 10px;
				    	display: inline-block;
				    }
				}
			}
		}
		.delGroup {
			text-align: center;
		    position: absolute;
		    bottom: 0;
		    width: 100%;
		    height: 38px;
		    line-height: 38px;
			span {
				padding: 12px;
    			color: #ca1010;
			}
		}
	}
}
}

</style>