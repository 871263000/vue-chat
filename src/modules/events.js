import showMsgNotification from '../common/showMsgNotification';

// const selfLogin = 'SELF_LOGIN';

let voice = function() {
    var audio = document.createElement("audio");
    audio.src = '/omsIm/source/layui/css/modules/layim/voice/default.wav';
    audio.play();
};

const state = {
  complete: false,
  onlineMan: 0,
  onlineList: [],
  videoChatShow: false,
  videoChatInfo: {}
}

const getters = {
  complete: ( state, getters, rootState ) => state.complete
}

const mutations = {
	SELF_LOGIN (state, data) {
		state.onlineMan = 0;
		state.onlineList = [];
		for (let i in data) {
			if ( state.onlineList.indexOf(i) === -1 ) {
				state.onlineMan ++;
				state.onlineList.push(i);
			}

		}
		state.complete = true;
	},
	LOGIN (state, data) {
		state.onlineMan ++;
	},
	SAYUID ( state, data) {
		console.log(data);
	},
	LOGOUT (state) {
		state.onlineMan --;
	},
	VCSC (state) {
		state.videoChatShow = !state.videoChatShow;
	}
}
const actions = {
	selfLogin: ({ state,dispatch ,commit, rootState }, data)=> {
		if ( rootState.sendStatus.sendType == 1 ) {
			// let draft = localStorage.getItem('draft');
	        if (draft) {
	            dispatch('sendMessage', {content: rootState.sendStatus.sendContent.content, messageType: rootState.sendStatus.sendContent.messageType}).then((res) => {
	            	if ( res.status == 1 ) {
	            		commit('RESEND');
	            	}
	            });

	        }
        }
		commit('SELF_LOGIN', data.data.client_list);
	},
	login: ({ state, commit }, data) => {
		commit('LOGIN', data);
		return false;
	},
	logout: ({ state, commit }, data) => {
		state.onlineList.forEach((id, index)=>{
			if ( id == data.from_uid_id ) {
				state.onlineList.splice(index, 1);
			}
		})
		commit('LOGOUT');
	},
	ping: (data)=> {

	},
	say_uid: ({ state, commit, rootState }, data) => {
		// if ( data.sender_id == rootState.currentSession.id ) {
		// 	// rootState.
		// } else {

		// }
		let name, sessionId,sessionName,img, sessionImg, dialogueId;

		if ( data.mestype == 'message' ) {
			sessionId = data.session_no;
			dialogueId = data.sender_id;
		} else {
			sessionId = data.session_no;
			dialogueId = data.session_no;
		}
		let saveData = {
			id: data.id,
			content: data.message_content,
			senderId: data.sender_id,
			dialogueId: dialogueId,
			sessionId: sessionId,
			type: data.mestype,
			accept_id: data.to_uid,
			sendCliend_id: data.accClient_id,
			accClient_id: data.sendClient_id,
			acceptMode: 's',
			mesages_types: data.mesages_types

		};
		saveData.code = data.code;
		saveData.msg = data.msg;
		showMsgNotification('聊天消息', data.message_content, sessionImg);
		commit('SEND_MESSAGE', saveData);
	},
	resSayUid: ({ state, commit, rootState }, data) => {
		// let sessionImg, sessionName, name, img;
		// if ( data.mestype == 'message' ) {
		// 	sessionName = rootState.currentSession.name;
		// 	sessionImg = rootState.currentSession.img;
		// 	name = rootState.currentSession.name;
		// 	img = rootState.currentSession.img;
		// } else if ( data.mestype == 'groupMessage' ) {
		// 	sessionName =  rootState.currentSession.name;
		// 	sessionImg = '/chat/images/ren.png';
		// 	name = rootState.currentSession.name;
		// 	img = rootState.currentSession.img;
		// }
		if ( data.mestype == 'groupMessage' ) {
			data.to_uid = data.session_no;
		}
		let sessionId = '';
		let saveData = {
			id: data.id,
			content: data.message_content,
			senderId: data.sender_id,
			dialogueId: data.to_uid,
			type: data.mestype,
			sendCliend_id: data.accClient_id,
			accClient_id: data.sendClient_id,
			acceptMode: 'r',
			mesages_types: data.mesages_types

		};
		saveData.code = data.code;
		saveData.msg = data.msg;
		// voice();
		commit('SEND_MESSAGE', saveData);
	},
	mes_close ({ state, commit, rootState }, data) {
		commit('MES_CLOSE', data);
	},
	videoChat ({ state, commit, rootState }, data) {
		state.videoChatShow = true;
		state.videoChatInfo = data;

	},
	videoResAnswerRes ({ state, commit, rootState }, data) {
		commit('STATUS_CHANGE', {status: 3});
		commit('GET_TOKEN', data);
	},
	videoChatShowChange ({commit}) {
		commit('VCSC');
	},
	revoke ({commit}, data) {
		commit('REVOKE', data);
	}
}
const events = {
	state,
	actions,
	mutations
}
export default events;
