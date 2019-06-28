
var ws = '';
let callbacks = {};

const act = {
	COME_MESSAGE: (e) => {
		let data = JSON.parse(e.data);
		callbacks.comeMessage && callbacks.comeMessage(data);
	},
	SEND_MESSAGE: (data) => {
		let str = JSON.stringify(data);
		ws.send(str);
	},
	OPEN: () => {
		let call;
		// setTimeout(function () {
		callbacks.open && callbacks.open();
		return call = new Promise((resolve, reject) => {
			resolve();
		})
		// }, 500);
	},
	TEXT: () => {
		callbacks.text();
	}
}


const websocket = {
	on: (name, callback) => {
		callbacks[name] = callback;
	},
	sendMessage: (data) => {
		act.SEND_MESSAGE(data)
	},
	connect() {
		// ws = new WebSocket("ws://chat.omso2o.com:7272");
		// ws = new WebSocket("ws://localhost:7272");
		ws = new WebSocket("wss://chat.omso2o.com/wss");
		ws.onopen = function () {
			let call;
			// setTimeout(function () {
			callbacks.open && callbacks.open();
			// return call = new Promise((resolve, reject) => {
			//                  resolve();
			//              })
		};
		// ws.onopen().then(()=>{
		// 	console.log(6677);
		// })
		// 当有消息时根据消息类型显示不同信息
		ws.onmessage = act.COME_MESSAGE;
		let self = this;
		ws.onclose = () => {
			callbacks.close();
			console.log("连接关闭，定时重连");
		};
		ws.onerror = function () {
			callbacks.error();
			console.log("出现错误");
		};
	}

}

export default websocket;
