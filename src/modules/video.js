
const state = {
  status: 1,
  videoChatInfo: {
  	token: ''
  }
}

const mutations = {
	STATUS_CHANGE: (state, data) => 
	{
		state.status = data.status;
	},
	GET_TOKEN: (state, data) => 
	{
		state.videoChatInfo = data;
	}
}
const actions = {
	statusChange: ({ state, commit, rootState }, data) => {
		commit('STATUS_CHANGE', data);
	},
	getToken: () => {
		
	}
}
const video = {
	state,
	actions,
	mutations
}
export default video;