<script>
import { mapState } from 'vuex'
	export default {
		data () {
			return {
				onlineFilterKey: '',
			}
		},
		computed: mapState({
	        online (state) {
	        	let onlineList = state.friends[1].list.filter(list => {
	        		return state.events.onlineList.indexOf(list.id.toString()) !== -1  && (!this.onlineFilterKey ? true: list.username.includes(this.onlineFilterKey));
	        	});
	            return onlineList;
	        },
	        user: ({ user }) => user,
	    }),
	    methods: {
	    	selectSession (id, type, name, img) {
	            this.$emit('mainShow');
	            let data = {id: id, type: type, name: name, img: img};
	            this.$store.dispatch('selectSession', data);
	        }
	    }
	}
</script>
<template>
	<div class="online-list">
		<div class="online-list-text">
			<i@click="$emit('close')"></i>
			<span>在线人员</span>
		</div>
		<div class="online-search">
			<input type="" name="" placeholder="搜索" v-model="onlineFilterKey">
		</div>
		<div class="online-man-list">
			<ul>
				<li v-for="list in online" @click="selectSession(list.id, 'message', list.username, list.avatar)">
				<div class="list-img">
					<img :src="user.documentUrlOms + '/' + list.avatar">
				</div>
				<div class="list-name">
					<span>
						{{ list.username }}
					</span>
				</div>
				</li>
			</ul>
		</div>
		
	</div>
</template>
<style lang="less" scoped>
@media screen and (max-width: 500px) {
	.online-list {
		    position: absolute;
		    height: 100%;
		    width: 100%;
		    overflow: auto;
		    border-bottom: 1px solid #ccc;
		    .online-search {
		    	padding: 0 15px;
			    display: box;
			    display: -webkit-box;
			    input {
			    	padding: 0 10px;
				    -webkit-box-flex: 1;
				    box-flex: 1;
				    display: block;
				    font-size: 12px;
				    color: #000;
				    height: 30px;
				    width: 100%;
				    line-height: 30px;
				    border: 1px solid #3a3a3a;
				    border-radius: 4px;
				    outline: none;
			    }
		    }
		    .online-list-text {
		    	height: 45px;
			    border-bottom: 1px solid #ccc;
			    cursor: move;
			    background-color: #303036;
			    color: #fff;
			    text-align: center;
			    margin-bottom: 10px;
			    i {
			    	position: absolute;
				    top: 0;
				    left: 10px;
				    display: inline-block;
				    width: 32px;
				    height: 45px;
				    line-height: 45px;
				    background: url('../assets/xyjt.png') center no-repeat;
			    }
			    span {
			    	height: 100%;
				    line-height: 45px;
				    font-size: 20px;
				    display: inline-block;
			    }
		    }
		.online-man-list {
			position: absolute;
		    top: 83px;
		    bottom: 38px;
		    overflow: auto;
		    width: 100%;
		}
		ul {
			li {
				    padding: 10px;
	    			cursor: pointer;
			}
		}
		.list-img {
			display: inline-block;
			padding: 0 5px;
			img {
				width: 40px;
				height: 40px;
			}
		}
		.list-name {
			display: inline-block
		}
	}
}
@media screen and (min-width: 500px) {
.online-list {
	    position: absolute;
	    height: 100%;
	    width: 100%;
	    overflow: auto;
	    border-bottom: 1px solid #ccc;
	.online-list-text {
		text-align: center;
		color: #000;
	}
	input {
		padding: 0 0 0 5px;
	    font-size: 12px;
	    color: #000;
	    height: 30px;
	    width: 190px;
	    line-height: 30px;
	    border: 1px solid #ccc;
	    border-radius: 4px;
	    outline: none;
	    margin: 0 0 0 10px;
	}
	ul {
		li {
			    padding: 10px;
    			cursor: pointer;
		}
	}
	.list-img {
		display: inline-block;
		padding: 0 5px;
		img {
			width: 40px;
			height: 40px;
		}
	}
	.list-name {
		display: inline-block
	}
}
}

</style>