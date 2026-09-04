'use strict';
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
const W=canvas.width,H=canvas.height;
const placeEl=document.getElementById('place'),clockEl=document.getElementById('clock');
const hintEl=document.getElementById('hint'),actionEl=document.getElementById('action');
const dialogueEl=document.getElementById('dialogue'),speakerEl=document.getElementById('speaker'),dialogueText=document.getElementById('dialogueText');
const fadeEl=document.getElementById('fade'),startEl=document.getElementById('start'),endingEl=document.getElementById('ending');
const startBtn=document.getElementById('startBtn'),continueBtn=document.getElementById('continueBtn');
const stick=document.getElementById('stick'),knob=document.getElementById('knob');

let scene='residential',canMove=false,nearTarget=null,interacting=false,hasTicket=false;
let gameMinute=3,minuteAccum=0,transitioning=false,typing=false,typeTimer=null,dialogueQueue=[],dialogueIndex=0,currentLine='';
let audio=null,rainGain=null,humGain=null;
const examined=new Set();
const keys={up:false,down:false,left:false,right:false};
const analog={x:0,y:0};
const player={x:180,y:545,w:14,h:22,speed:1.72,dir:'up',walk:0,moving:false};

const RAIN_COUNT=110;
const rain=Array.from({length:RAIN_COUNT},()=>({x:Math.random()*W,y:Math.random()*H,len:4+Math.random()*9,spd:2.4+Math.random()*2.8,a:.08+Math.random()*.24}));
const ripples=Array.from({length:16},()=>({x:65+Math.random()*230,y:180+Math.random()*400,p:Math.random()*80}));

const scenes={
  residential:{label:'RUA RESIDENCIAL',outdoor:true,spawn:{x:180,y:548},exit:{x:180,y:72,r:25,to:'commercial',spawn:{x:180,y:560}},objects:[
    {id:'skate',x:91,y:392,r:25,label:'OLHAR',text:'Um skate. Que radical.',speaker:'VOCÊ'},
    {id:'toy',x:267,y:286,r:25,label:'OLHAR',text:'Um brinquedo. Coitada de quem perdeu.',speaker:'VOCÊ'}
  ]},
  commercial:{label:'AVENIDA',outdoor:true,spawn:{x:180,y:560},back:{x:180,y:602,r:24,to:'residential',spawn:{x:180,y:92}},exit:{x:180,y:68,r:26,to:'stationFront',spawn:{x:180,y:552}},objects:[
    {id:'coins',x:108,y:374,r:23,label:'OLHAR',text:'Algumas moedas. Alguém talvez precisava disso.',speaker:'VOCÊ'},
    {id:'medicine',x:271,y:258,r:23,label:'OLHAR',text:'Um remédio. A caixa está encharcada.',speaker:'VOCÊ'}
  ]},
  stationFront:{label:'ESTAÇÃO',outdoor:true,spawn:{x:180,y:552},back:{x:180,y:603,r:24,to:'commercial',spawn:{x:180,y:92}},exit:{x:180,y:148,r:34,to:'stationHall',spawn:{x:180,y:555},label:'ENTRAR'},objects:[
    {id:'schedule',x:282,y:330,r:26,label:'LER',text:'ÚLTIMOS HORÁRIOS\n00:41   00:56   01:12',speaker:'QUADRO DE HORÁRIOS'}
  ]},
  stationHall:{label:'BILHETERIA',outdoor:false,spawn:{x:180,y:555},back:{x:180,y:603,r:24,to:'stationFront',spawn:{x:180,y:205}},objects:[]}
};

function solidsFor(s){
  if(s==='residential') return [
    {x:0,y:0,w:360,h:50},{x:0,y:50,w:76,h:590},{x:284,y:50,w:76,h:590},
    {x:76,y:84,w:43,h:147},{x:241,y:84,w:43,h:147},{x:76,y:463,w:35,h:112},{x:249,y:463,w:35,h:112}
  ];
  if(s==='commercial') return [
    {x:0,y:0,w:360,h:48},{x:0,y:48,w:66,h:592},{x:294,y:48,w:66,h:592},
    {x:66,y:90,w:55,h:122},{x:239,y:90,w:55,h:122},{x:66,y:424,w:45,h:126},{x:249,y:424,w:45,h:126}
  ];
  if(s==='stationFront') return [
    {x:0,y:0,w:360,h:50},{x:0,y:50,w:44,h:590},{x:316,y:50,w:44,h:590},
    {x:44,y:68,w:110,h:118},{x:154,y:50,w:52,h:77},{x:206,y:68,w:110,h:118},{x:44,y:186,w:66,h:140},{x:250,y:186,w:66,h:140}
  ];
  return [
    {x:0,y:0,w:360,h:44},{x:0,y:44,w:30,h:596},{x:330,y:44,w:30,h:596},{x:0,y:612,w:360,h:28},
    {x:30,y:44,w:112,h:95},{x:142,y:44,w:76,h:28},{x:218,y:44,w:112,h:95},
    {x:48,y:172,w:108,h:96}
  ];
}

function unlockAudio(){
  if(audio){ if(audio.state==='suspended')audio.resume(); return; }
  const AC=window.AudioContext||window.webkitAudioContext; if(!AC)return;
  audio=new AC();
  const master=audio.createGain();master.gain.value=.42;master.connect(audio.destination);
  const rainBuf=audio.createBuffer(1,audio.sampleRate*2,audio.sampleRate);const d=rainBuf.getChannelData(0);
  for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*.33;
  const rainSrc=audio.createBufferSource();rainSrc.buffer=rainBuf;rainSrc.loop=true;
  const rainFilter=audio.createBiquadFilter();rainFilter.type='lowpass';rainFilter.frequency.value=1800;
  rainGain=audio.createGain();rainGain.gain.value=.16;rainSrc.connect(rainFilter).connect(rainGain).connect(master);rainSrc.start();
  const hum=audio.createOscillator();hum.type='sine';hum.frequency.value=58;
  humGain=audio.createGain();humGain.gain.value=0;hum.connect(humGain).connect(master);hum.start();
}
function setAmbience(){if(!audio)return;const inside=!scenes[scene].outdoor;rainGain.gain.setTargetAtTime(inside?.045:.16,audio.currentTime,.2);humGain.gain.setTargetAtTime(inside?.035:0,audio.currentTime,.25)}
function blip(name='VOCÊ'){
  if(!audio)return;const o=audio.createOscillator(),g=audio.createGain();o.type='square';
  const base=name==='VENDEDOR'?122:name==='VOCÊ'?174:148;o.frequency.value=base+(Math.random()*10-5);
  g.gain.setValueAtTime(.0001,audio.currentTime);g.gain.exponentialRampToValueAtTime(.035,audio.currentTime+.003);g.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+.036);
  o.connect(g).connect(audio.destination);o.start();o.stop(audio.currentTime+.04);
}
function sfx(kind){
  if(!audio)return;const o=audio.createOscillator(),g=audio.createGain();o.connect(g).connect(audio.destination);g.gain.setValueAtTime(.0001,audio.currentTime);
  if(kind==='door'){o.type='triangle';o.frequency.setValueAtTime(150,audio.currentTime);o.frequency.exponentialRampToValueAtTime(70,audio.currentTime+.18);g.gain.exponentialRampToValueAtTime(.06,audio.currentTime+.01);g.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+.22);o.start();o.stop(audio.currentTime+.23)}
  else if(kind==='ticket'){o.type='square';o.frequency.value=880;g.gain.exponentialRampToValueAtTime(.045,audio.currentTime+.003);g.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+.05);o.start();o.stop(audio.currentTime+.06);setTimeout(()=>{if(!audio)return;const o2=audio.createOscillator(),g2=audio.createGain();o2.type='square';o2.frequency.value=1050;g2.gain.value=.025;o2.connect(g2).connect(audio.destination);o2.start();g2.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+.06);o2.stop(audio.currentTime+.07)},75)}
}
