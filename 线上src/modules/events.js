import messageHandel from '../messageHandel'

// const selfLogin = 'SELF_LOGIN';

let voice = function() {
    var audio = document.createElement("audio");
    audio.src = '/omsIm/source/layui/css/modules/layim/voice/default.wav';
    audio.play();
};

const state = {
  complete: false,
}

const getters = {
  complete: ( state, getters, rootState ) => state.complete
}

const mutations = {
	SELF_LOGIN (state, data) {
		state.complete = true;
	},
	LOGIN (data) {
		console.log(data);
	},
	SAYUID ( state, data) {
		console.log(data);
	}
}
const actions = {
	selfLogin: ({ state, commit }, data)=> {
		console.log(4433);
		commit('SELF_LOGIN', data);
	},
	login: (data) => {
		return false;
	},
	ping: (data)=> {

	}, 
	say_uid: ({ state, commit, rootState }, data) => {
		// if ( data.sender_id == rootState.currentSession.id ) {
		// 	// rootState.
		// } else {
			
		// }
		let name, sessionId,sessionName,img, sessionImg;

		if ( data.mestype == 'message' ) {
			sessionName = data.accept_name;
			name = data.accept_name;
			img =  data.card_image,
			sessionImg = data.card_image,
			sessionId = data.sender_id;
		} else {
			img = data.card_image,
			sessionImg =  '/chat/images/ren.png',
			sessionName = data.group_name;
			name = data.accept_name;
			sessionId = data.session_no;
		}
		let saveData = {
			id: data.id,
			content: data.message_content,
			senderId: data.sender_id,
			dialogueId: sessionId,
			sessionName: sessionName,
			name: name,
			sessionImg: sessionImg,
			img: img,
			type: data.mestype

		};
		// voice();
		commit('SEND_MESSAGE', saveData);
	},
	mesClose: (data)=> {

	},
	resSayUid: ({ state, commit, rootState }, data) => {
		// console.log(rootState.currentSession.img);return false;
		let sessionImg, sessionName, name, img;
		if ( data.mestype == 'message' ) {
			sessionName = rootState.currentSession.name;
			sessionImg = rootState.currentSession.img;
			name = rootState.currentSession.name;
			img = rootState.currentSession.img;
		} else if ( data.mestype == 'groupMessage' ) {
			sessionName = data.group_name;
			sessionImg = '/chat/images/ren.png';
			name = rootState.currentSession.name;
			img = rootState.currentSession.img;
		}
		let sessionId = '';
		let saveData = {
			id: data.id,
			content: data.message_content,
			senderId: data.sender_id,
			dialogueId: rootState.currentSession.id,
			name: name,
			sessionName: sessionName,
			sessionImg: sessionImg,
			img: img,
			type: data.mestype

		};
		// voice();
		commit('SEND_MESSAGE', saveData);
	}
}
const events = {
	state,
	actions,
	mutations
}
export default events;