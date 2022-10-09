'use strict';

// join主动加入房问
// leave主动离开房问
// new-peer有人加入房间，通知已经在房间的人
// peer-leave 有人离I房间，通知已经在房间的人
// offer 送offer对端peer
// answer送offer对端peer
// candidate 送candidate端peer
const SIGNAL_TYPE_JOIN = "join";
const SIGNAL_TYPE_RESP_JOIN = "resp-join"; // 告知加入者对方是谁
const SIGNAL_IYPE_LEAVE = "leave";
const SIGNAL_TYPE_NEW_PEER ="new-peer";
const SIGNAL_TYPE_PEER_LEAVE = "peer-leave";
const SIGNAL_TYPE_OFFER = "offer";
const SIGNAL_TYPE_ANSWER = "answer";
const SIGNAL_TYPE_CANDIDATE = "candidate";

var localUserID = Math.random().toString(36).substring(2); //本地ID
var remoteUserID = -1; //对端

var localVideo = document.querySelector('#localVideo');
var remoteVideo = document.querySelector('#remoteVideo');
var loaclStream = null;
var ZeroRTCEngine;


var ZeroRTCEngine = function(wsURL){
    ZeroRTCEngine = this;
    return this;
}

ZeroRTCEngine.prototype.init = function(wsURL){
    //设置websocket URL
    this.wsURL = wsURL;
    //websocket对象
    this.signaling = null;
}

ZeroRTCEngine.prototype.createWebsocket = function(){
    ZeroRTCEngine = this;
    ZeroRTCEngine.signaling = new WebSocket(this.wsURL);
    ZeroRTCEngine.signaling.onOpen = function(){
        ZeroRTCEngine.onOpen();
    }
    ZeroRTCEngine.signaling.onMessage = function(event){
        ZeroRTCEngine.onMessage(event);
    }
    ZeroRTCEngine.signaling.onError = function(event){
        ZeroRTCEngine.onError(event);
    }
    ZeroRTCEngine.signaling.onClose = function(event){
        ZeroRTCEngine.onClose(event);
    }

}

ZeroRTCEngine.prototype.onOpen = function(){
    console.log("websocket open");
}

ZeroRTCEngine.prototype.onMessage = function(event){
    console.log("onMessage: " + event.data);
}

ZeroRTCEngine.prototype.onError = function(event){
    console.log("onError: " + event.data);
}

ZeroRTCEngine.prototype.onClose = function(event){
    console.log("onClose: " + event.code + ", reason: " + EventTarget.reason);
}
ZeroRTCEngine.prototype.sendMsg = function(msg){
    this.signaling.send(msg);
}


function doJoin(roomID){
    var jsonMsg = {
            'cmd': 'join',
            'roomId': roomID,
            'uid': localUserID,
    };
    var message = JSON.stringify(jsonMsg);
    ZeroRTCEngine.sendMsg(msg);
    console.info("doJoin massage: " + msg);
}

function openLocalStream(stream){
    console.log('Open local stream');
    localVideo.srcObject = stream;
    loaclStream = null;
}

function initLocalStream(){
    navigator.mediaDevices.getUserMedia({
        audio:true,
        video:true
    })
    .then(openLocalStream)
    .catch(function(e){
        alert("getUserMedia() error:" + e.name)
    });

}

ZeroRTCEngine = new ZeroRTCEngine("ws://192.168.221.134:8099");
ZeroRTCEngine.createWebsocket();

document.getElementById('joinBottom').onclick = function(){
    roomID = document.getElementById('roomID').value;
    console.log("加入按钮已点击，roomID: " + roomID);
    //初始化本地码流
    initLocalStream();
}



