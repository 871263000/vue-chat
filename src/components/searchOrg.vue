<script>
import Vue from 'vue';
import QS from 'qs';



Vue.component('model', function (resolve) {
	require(['./modal'], resolve);
});

export default {
	data () {
		return {
			orgList: {}
			,orgName: ''
			,orgOmsid: 0
			,friendName: ''
			,isOrg: true
			,friendList: {}
			,searchSel: 1
		};
	},
	methods: {
		search () {

		},
		close () {
			this.$emit('close');
		},
		sub (type) {
			if ( type == 'org' ) {
				if ( this.orgName == '' ) {
					return false;
				}
				this.$http.get('/omsIm/demo/json/getList.php?class=searchOrganization&orgName=' + this.orgName)
				// this.$http.get('/static/omsIm/demo/json/jsonOrg.js?class=searchOrganization&orgName=' + this.orgName)
				.then(res => {
					this.orgList = res.data;
				})
			} else if (type == 'friend')  {
				if ( this.friendName == '' ) {
					return false;
				}
				this.$http.get('/omsIm/demo/json/getList.php?class=searchFriend&para=' + this.friendName + '&oms_id=' + this.orgOmsid + '&searchSel=' + this.searchSel)
				// this.$http.get('/static/omsIm/demo/json/jsonFriend.js?class=searchFriend&para=' + this.friendName + '&oms_id=' + this.orgOmsid)
				.then(res => {
					this.friendList = res.data;
				})
			}
		},
		catFriend (orgName,oms_id) {
			this.isOrg = !this.isOrg;
			this.orgName = orgName;
			this.orgOmsid = oms_id;
		},
		catOrg () {
			this.isOrg = !this.isOrg;
		},
		addFriend (staffid, oms_id) {
			if (confirm('你确定要加他为好友吗？')) {
				this.$http.post('/omsIm/demo/json/getList.php', QS.stringify({class: 'addFriend', 'staffid': staffid, 'orgName': this.orgName, 'oms_id': oms_id}), {emulateJSON:true})
				// this.$http.post('/static/omsIm/demo/json/jsonFriend.js', {class: 'addFriend', 'staffid': staffid, 'orgName': this.orgName}, {emulateJSON:true})
				.then(res => {
					if ( res.data.code ) {
						alert(res.data.msg);
					}
				})
			};

		}
	},
	watch: {
		searchSel (v) {
			if ( v == 1 ) {
				this.isOrg = true;
			} else {
				this.orgName = '';
				this.isOrg = false;
			}
		}
	}

}

</script>

<template>
	<model @close="$emit('close')">
		<div slot="header">
			
		</div>
		<div slot="body" class="search-org" v-if="isOrg">
			<div class="search-sel">
				<span>
					<input type="radio" value="1" v-model="searchSel">搜索组织
				</span>
				<span><input type="radio" value="2" v-model="searchSel">搜索名字</span>
			</div>
			<div class="search-org-in">
				<input type="" name="" v-model="orgName" placeholder="请先输入他所在组织的名字"><span @click="sub('org')" class='search-sub'>确定</span>	
			</div>
			<div>
				<ul>
					<li v-for="list in orgList" @click="catFriend(list.org_name, list.oms_id)" class="search_org_name">{{list.org_name}}</li>
				</ul>
			</div>
		</div>
		<div slot="body" class="search-org" v-if="!isOrg">
			<div class="search-sel">
				<span>
					<input type="radio" value="1" v-model="searchSel">搜索组织
				</span>
				<span><input type="radio" value="2" v-model="searchSel">搜索名字</span>
			</div>
			<div class="search-org-name">
				<p @click="catOrg()" v-if="orgName">{{orgName}}</p>
			</div>
			<div class="search-org-in">
				<input type="" name="" v-model="friendName" placeholder="请输入名字"><span @click="sub('friend')" class="search-sub">确定</span>	
			</div>
			<div>
				<ul class="friend-list">
					<li v-for="list in friendList">
						<div>
							<p class="friend-img-box">
								<span class="friend-img">
									<img :src="list.card_image_smail" width="70px" height="70px">
								</span>
							</p>
							<p class="friend-text-box">
								<span class="friend-text-name">
									{{list.name}}
								</span>
								<span class="friend-text-add" @click="addFriend(list.staffid, list.oms_id)">
									+加好友
								</span>
							</p>
							<div style="clear: both"></div>
							<div class="org-name">
								<span>组织名称：</span><span :title="list.org_name" class="search_org_name">{{list.org_name}}</span>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</model>

</template>
<style scoped lang="less">
	@media screen and (max-width: 500px) {
		.search-org {
			.search-sel {
				text-align: center;
				span {
					background-color: inherit;
					color: #000;
				}
				input {
					width: auto;
				}
			}
			.search-sub {
				cursor: pointer;
			}
			.search-org-name {
				text-align: center;
				cursor: pointer;
				font-size: 20px;
			}
			width: 100%;
			.search_org_name
			{
				overflow: hidden;
			    text-overflow: ellipsis;
			    white-space: nowrap;
			    &::hover {
			    	background-color: #989989
			    }
			}
			.org-name {
				span {
					overflow: hidden;
				}
				.search_org_name
				{
					width: 100px;
					overflow: hidden;
				    text-overflow: ellipsis;
				    white-space: nowrap;
				    display: inline-block;
				}
			}
			.search-org-in 
			{
				width: 270px;
				margin: auto;
				position: relative;

			}
    		input {
    			 width: 100%;
    			padding: 7px 58px 7px 7px;
			}
			.friend-img-box {
				background-color: #ccc;
				display: inline-block;
    			float: left;
    			span {
    				background-color: #ccc;
    			}
			}
			.friend-text-box {
				display: inline-block;
    			float: left;
    			span {
    				margin-bottom: 10px;
    				width: 100%;
    				display:inline-block;
    			}
    			.friend-text-name {
    				background-color: inherit;
    				color: #000;
    				text-align: left;

    			}
    			.friend-text-add {
    				cursor: pointer;
    				width: 72px;
    				float: left;
    				background-color: #507cb3
    			}
			}
			span {
			    padding: 6px 10px;
			    color: #fff;
			    margin-left: 4px;
			}
			.search-sub {

				position: absolute;
			    right: 0;
			    top: 1px;
			    background-color: #63b5b5;
			}
			.friend-list {
				li {
					width: 100%;
					height: 120px;
					border-bottom: 1px solid #ccc;
					.org-name {
						text-align: left;
						color: #000;
						span {
							width: 200px;
							padding: 0;
							color: #000;
						}
					}
					p {
						padding: 0;
						margin: 0;
					}
					span.friend-img {
						padding: 0;
						margin: 0;
						width: 74px;
						height: 74px;
						display: inline-block
					}
				}
			}
			ul {
				max-height: 400px;
				overflow: auto;
				padding: 0 10px;
				&::after{
					content: '';
					clear: both;
				}
				li {

					cursor: pointer;
					width: 50%;
					float: left;
					padding: 10px;
					text-align: center;

				}
			}

    	}

	}
	@media screen and (min-width: 500px) {
		.search-org {
			.search-sel {
				text-align: center;
				span {
					background-color: inherit;
					color: #000;
				}
				input {
					width: auto;
				}
			}
			.search-sub {
				cursor: pointer;
			}
			.search-org-name {
				text-align: center;
				cursor: pointer;
				font-size: 20px;
			}
			width: 100%;
			.search_org_name
			{
				overflow: hidden;
			    text-overflow: ellipsis;
			    white-space: nowrap;
			    &::hover {
			    	background-color: #989989
			    }
			}
			.org-name {
				span {
					overflow: hidden;
				}
				.search_org_name
				{
					width: 100px;
					overflow: hidden;
				    text-overflow: ellipsis;
				    white-space: nowrap;
				    display: inline-block;
				}
			}
			.search-org-in 
			{
				width: 270px;
				margin: auto;

			}
    		input {
    			width: 200px;
				padding: 7px;
			}
			.friend-img-box {
				background-color: #ccc;
				display: inline-block;
    			float: left;
    			span {
    				background-color: #ccc;
    			}
			}
			.friend-text-box {
				width: 100px;
				display: inline-block;
    			float: left;
    			span {
    				margin-bottom: 10px;
    				width: 100%;
    				display:inline-block;
    			}
    			.friend-text-name {
    				background-color: inherit;
    				color: #000;
    				text-align: left;

    			}
    			.friend-text-add {
    				cursor: pointer;
    				width: 72px;
    				float: left;
    				background-color: #507cb3
    			}
			}
			span {
			    padding: 6px 10px;
			    color: #fff;
			    margin-left: 4px;
			}
			.search-sub {
				background-color: #63b5b5;
			}
			.friend-list {
				li {

					height: 120px;
					border-bottom: 1px solid #ccc;
					.org-name {
						text-align: left;
						color: #000;
						span {
							padding: 0;
							color: #000;
						}
					}
					p {
						padding: 0;
						margin: 0;
					}
					span.friend-img {
						padding: 0;
						margin: 0;
						width: 74px;
						height: 74px;
						display: inline-block
					}
				}
			}
			ul {
				max-height: 400px;
				overflow: auto;
				&::after{
					content: '';
					clear: both;
				}
				li {

					cursor: pointer;
					width: 50%;
					float: left;
					padding: 10px;
					text-align: center;

				}
			}

    	}
	}
</style>