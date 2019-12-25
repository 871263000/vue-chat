let message = new Object();

message.id = '';
message.user = {
    name: '',
    avatar: '',
};
message.messageNum = 0;
message.type = '';
message.messages = [];
message.remind = { state: 0 };
message.initMessageList = function (messages){

    this.id = messages.id;
    this.user = messages.user;
    this.messageNum = messages.messageNum;
    this.type = messages.type;
    this.messages = messages.messages;
    this.remind = messages.remind;
}

export default message;

