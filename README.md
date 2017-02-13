# SampleWebRTC
Basic WebRTC video client sample for iOS (iPhone/iPad) which can communicate with SIP related servers.

----------------------------------------------------

###About:

This is a basic sample of a WebRTC video client for iOS device which can register to WebRTC/SIP capable servers such as FreeSwitch or Asterisk.
Similar solution can be developed using native codes but to make it simple and more javascript related the codes are tweeked and pre-built using cordova so you can start scripting right away.
Tested successfully connecting to FreeSwitch and interworked video calls between SIP endpoints (ex Polycom HDX8004, Tandberg Edge95, Avaya Scopia XT5000).
<br>
<div style="text-align:center">
<img border="0" src="https://raw.githubusercontent.com/glide112/SampleWebRTC/master/image/sample_screenshot.png" height="384">
</div>

----------------------------------------------------
###Requirements:
SampleWebRTC was tested using below:

Tools<br>
 *Mac OSX (version 10.11.6)<br>
 *Xcode (version 8.2.1)<br>
 *iTune (version 12.5.5.5)<br>
 *Cordova (version 6.0.0)<br>

Device<br>
 *iPhone 6 (version 10.2.1)<br>

WebRTC(SIP) server<br>
 *FreeSWITCH Version 1.6.9+ (CentOS Linux release 7.2.1511)<br>
 *Basic guide can be seen <a href="https://freeswitch.org/confluence/display/FREESWITCH/WebRTC">here</a><br>
 *Note that iOS will not accept self-signed certificate so also prepare a signed certicate even for a test calls. 
 
----------------------------------------------------
###To do:
1. <a href="https://drive.google.com/file/d/0B7XznYqJ4iLnZHlBU1NjWjUtOG8/view?usp=sharing">Donwload</a> and extract then move to "com.sample.webrtc" folder.

 $ cd com.sample.webrtc

2. Run and build using cordova.

 $ cordova build

3. Open the project using Xcode and run it on your iPhone or iPad.

 $ open com.sample.webrtc/platforms/ios/SampleWebRTC.xcodeproj

4. Once you succeed then you are now ready to code javascript in two ways. 

 *If you are only using cordova then work under below directory.

 com.sample.webrtc/www     <--- modify as you want<br>
                           (This directory will be copied under "platforms" during "build")<br>
 $ cordova build           <--- run "build" after all your modifications. <br>
 $ cordova run             <--- then "run" to install on your iPhone/iPad <br>

 *If you want to use Xcode also as the editor, then make sure that both directories ("com.sample.webrtc/www" and "com.sample.webrtc/platforms/ios/www/") are in the same state.

 $ open com.sample.webrtc/platforms/ios/SampleWebRTC.xcodeproj       <--- open the project with Xcode<br>
 SampleWebRTC > Staging > www (com.sample.webrtc/platforms/ios/www/) <--- under the left side tree<br>
 Menu: Product > Run                                                 <--- select the device and run it on your device <br>

----------------------------------------------------

###Tips:
Since SampleWebRTC comes only with the basic video call feature, below are some tips to add common features.


<b>Rear camera:</b><br>
 Refer below and define "deviceId" before sending invite request. 

 -------------
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
 -------------

<b>Audio output:</b><br>
 As the default audio come out as phone mode (EARPIECE) so if you want to have it from speaker, you can refer below as a sample. 
 -------------
    document.addEventListener('deviceready', function() {
      window.HeadsetDetection.registerRemoteEvents(function(status) {
        switch (status) {
            case 'headsetAdded':
                console.log('console: Headset was added');
                AudioToggle.setAudioMode(AudioToggle.EARPIECE);
            break;
            case 'headsetRemoved':
                console.log('console: Headset was removed');
               AudioToggle.setAudioMode(AudioToggle.SPEAKER);
            break;
        };
      });
    }, false);
 -------------

<b>Incoming call:</b><br>
 If the client is registered to the server, you can also receive calls but then you will also need to consider a dialog to accept or decline with a ringtone (ex mp3 file) when a invite comes in. Below is an example which you can refer to when creating a dialog for incoming call.
 -------------
     userAgent.on('invite', function(session) {
      console.log('console: receiving invite from (displayName): ' + session.remoteIdentity.displayName);
      console.log('console: receiving invite from (uri): ' + session.remoteIdentity.uri);
      ring.play();
      var winW = window.innerWidth;
      var winH = window.innerHeight;
      var dialogoverlay = document.getElementById('dialogoverlay');
      var dialogbox = document.getElementById('dialogbox');
      dialogoverlay.style.display = "block";
      dialogoverlay.style.height = winH+"px";
      dialogbox.style.left = (winW/2) - (250 * .5)+"px";
      dialogbox.style.top = "100px";
      dialogbox.style.display = "block";
      document.getElementById('dialogboxhead').innerHTML = "Call from:";
      document.getElementById('dialogboxbody').innerHTML = session.remoteIdentity.displayName;
      document.getElementById('dialogboxfoot').innerHTML = '<button id="dialogbuttonA" onclick="accept()">Accept</button> <button id="dialogbuttonR" onclick="reject()">Reject</button>';
      reject = function(){
      ring.pause();
      ring.currentTime = 0;
      document.getElementById('dialogbox').style.display = "none";
      document.getElementById('dialogoverlay').style.display = "none";
      console.log('console: reject invite');
      session.reject();
      inCall = false;
     }
     
     accept = function(){
        LocalVideo.style.visibility="visible";
        RemoteVideo.style.visibility="visible";
        ring.pause();
        ring.currentTime = 0;
        document.getElementById('dialogbox').style.display = "none";
        document.getElementById('dialogoverlay').style.display = "none";
        document.body.style.background = 'black';
        ImgCall.src = 'img/call-red.png';
        ImgMic.src = 'img/mic-green.png';
        ImgRearCamera.src = 'img/camera-green.png';
        BtnMic.disabled = false;
        BtnGeo.disabled = false;
        BtnRearCamera.disabled = false;
        inCall = true;
        console.log('console: accept invite');
        window.plugins.insomnia.keepAwake();
        session.accept({
         media: {
          render: {
           remote: RemoteVideo,
           local: LocalVideo
          }
         }
        });
        var remoteURI = session.remoteIdentity + "";  
        var uriNum = remoteURI.split(/[:@]/);
        console.log('console: remote number ' + uriNum[1]);
        connection.checkPresence(localAauthorizationUser + '@xxx.co.jp', function(isRoomExists, roomid) {
        if(isRoomExists) {
          console.log('console: socket join ' + roomid);
          connection.join(roomid);
        } else {
          console.log('console: socket open ' + roomid);
          connection.open(roomid);
          }
     });
 -------------

<b>Other useful info:</b><br>
 All of the API from sip.js can be used.<br>
 For more details visit <a href="https://sipjs.com/api/0.7.0/">sip.js</a>.

----------------------------------------------------

by Yosuke Sawamura yosuke.sawamura@gmail.com
