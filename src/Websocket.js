
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
		callbacks.open && callbacks.open();
		return new Promise((resolve, reject) => {
			resolve();
		})
	},
	TEXT: () => {
		callbacks.text();
	}
}
var sit;

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
			if (sit) {
				clearInterval(sit);
			}
			callbacks.open && callbacks.open();
		};
		// 当有消息时根据消息类型显示不同信息
		ws.onmessage = act.COME_MESSAGE;
		ws.onclose = () => {
			if (!sit) {
				sit = setInterval(function(){ websocket.connect() }, 3000);
			}
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
