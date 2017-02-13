/*
 SampleWebRTC for iOS
 written by Yosuke Sawamura
 yosuke.sawamura@gmail.com
 */

var app = {
initialize: function() {
    console.error = window.onerror = function() {
        if (JSON.stringify(arguments).indexOf('iosrtc') !== -1) {
            return;
        }
        
        if (JSON.stringify(arguments).indexOf('No Content-Security-Policy') !== -1) {
            return;
        }
        
        if (JSON.stringify(arguments).indexOf('<') !== -1) {
            return;
        }
        
        alert(JSON.stringify(arguments, null, ' '));
    };
    
    app.bindEvents();
},
bindEvents: function() {
    document.addEventListener('deviceready', app.onDeviceReady, false);
    document.addEventListener('resume', function() {
                              if (window.connection && connection.getAllParticipants().length) {
                              return;
                              }
                              location.reload();
                              }, false);
    
    document.addEventListener('online', function() {
                              location.reload();
                              }, false);
    
    document.addEventListener('offline', function() {
                              alert('Seems disconnected.');
                              }, false);
},
onDeviceReady: function() {
    app.CustomCode();
},
    ///////////////////////////////////////////////////////////////////
CustomCode: function() {
    ///////////////////////////////////////////////////////////////////
    
    var RemoteVideo = document.getElementById('remoteVideo');
    var LocalVideo = document.getElementById('localVideo');
    var BtnCall = document.getElementById('btnCall');
    var BtnHang = document.getElementById('btnHang');
    var BtnMic = document.getElementById('btnMic');
    
    BtnHang.disabled = true;
    BtnMic.disabled = true;
    
    var session;
    
    /////////////////////////////////////////////////////////////////
    
    if (window.cordova && device.platform === 'iOS') {
        cordova.plugins.iosrtc.registerGlobals();
        SIP.WebRTC.isSupported = function isSupported() { return true; }
        SIP.WebRTC.MediaStream = cordova.plugins.iosrtc.MediaStream;
        SIP.WebRTC.getUserMedia = cordova.plugins.iosrtc.getUserMedia;
        SIP.WebRTC.RTCPeerConnection = cordova.plugins.iosrtc.RTCPeerConnection;
        SIP.WebRTC.RTCSessionDescription = cordova.plugins.iosrtc.RTCSessionDescription;
    }
    
    /////////////////////////////////////////////////////////////////
    
    //////// Call
    BtnCall.onclick = function() {
        
        var authUser = document.getElementById('username').value;
        var authPass = document.getElementById('password').value;
        var serverUrl = document.getElementById('serverurl').value;
        var videoSipURI = document.getElementById('destination').value;
        
        console.log('console: btnCall pressed');
        
        var config = {
        wsServers: 'wss://' + serverUrl,
        uri: authUser + '@' + serverUrl,
        authorizationUser: authUser,
        password: authPass,
        userAgentString: "SampleWebRTCiOS",
            //mediaHandlerFactory: PhoneRTCMediaHandler,
        traceSip: false,
            //register: false
        };
        
        var userAgent = new SIP.UA(config);
        
        var options = {
        media: {
        constraints: {
        audio: true,
        video: true
        },
        render: {
        remote: RemoteVideo,
        local: LocalVideo
        }
        }
        };
        
        console.log('console: sending invite with front camera with audio call');
        session = userAgent.invite('sip:' + videoSipURI, options);
        
        BtnCall.disabled = true;
        BtnHang.disabled = false;
        BtnMic.disabled = false;
    };
    
    //////// RearCamera
    /*
     BtnRearCamera.onclick = function() {
     console.log('console: btnRearCamera pressed');
     
     var options = {
     media: {
     constraints: {
     audio: true,
     video: {
     deviceId: 'com.apple.avfoundation.avcapturedevice.built-in_video:0',
     mandatory: {},
     optional: [{
     }, {
     facingMode: 'user'
     }]
     }
     },
     render: {
     remote: RemoteVideo,
     local: LocalVideo
     }
     }
     };
     console.log('console: sending invite with rear camera with audio call');
     session = userAgent.invite('sip:' + videoSipURI, options);
     };
     */
    
    ////// Hangup Calls
    BtnHang.onclick = function() {
        console.log('console: btnHang pressed');
        
        session.bye();
        session = null;
        
        BtnCall.disabled = false;
        BtnHang.disabled = true;
        BtnMic.disabled = true;
        
    };
    
    //////// Mic
    BtnMic.onclick = function() {
        console.log('console: btnMic pressed');
        if (Mic){
            session.mute();
            console.log('console: Mic = false');
        } else {
            session.unmute();
            console.log('console: Mic = true');
        }
    };
    
    ///////////////////////////////////////////////////////////////////
}
    ///////////////////////////////////////////////////////////////////
};
app.initialize();
