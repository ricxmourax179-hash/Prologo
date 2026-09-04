function drawSeller(x,y){
  px(x-9,y+8,18,4,'rgba(0,0,0,.24)');
  px(x-8,y-1,16,12,'#334049');px(x-7,y,14,10,'#41525b');px(x-6,y+7,12,4,'#2b363d');
  px(x-10,y+2,3,6,'#b89d80');px(x+7,y+2,3,6,'#b89d80');
  px(x-7,y-12,14,12,'#c9b08d');px(x-8,y-13,16,4,'#171c1f');px(x-7,y-12,14,2,'#252b2f');
  px(x-6,y-9,2,2,'#2a2723');px(x+4,y-9,2,2,'#2a2723');px(x-2,y-5,4,1,'#715d47');px(x-3,y-13,6,1,'#2c3336');px(x+3,y+2,3,3,'#b2b8b4');
}
function drawPlayer(){
  const frame=player.moving?Math.floor(player.walk/4.6)%4:0;
  const bounce=player.moving&&(frame===1||frame===3)?1:0;
  const x=Math.round(player.x),y=Math.round(player.y+bounce);
  const skin='#c9b08f',skinDark='#a38769',hair='#1a1e22',hairHi='#2a2f34';
  const red='#ab2a33',redHi='#cf434d',redDark='#7b1c23',shorts='#2a323b',shortHi='#3a4652',shoe='#0c1012',sole='#7d8588',sock='#c5c2b9';
  px(x-8,y+10,16,3,'rgba(0,0,0,.28)');
  let step=0;if(player.moving){if(frame===1)step=-1;else if(frame===3)step=1}
  if(player.dir==='down'){
    px(x-6,y-13,12,10,skin);px(x-7,y-15,14,4,hair);px(x-7,y-12,3,4,hair);px(x+4,y-12,3,4,hair);px(x-2,y-15,4,1,hairHi);
    px(x-3,y-9,1,1,'#2b2723');px(x+2,y-9,1,1,'#2b2723');px(x-1,y-6,3,1,'#7d6751');
    px(x-6,y-2,12,9,red);px(x-5,y-3,10,2,redHi);px(x-7,y,2,5,redDark);px(x+5,y,2,5,redDark);px(x-4,y+5,8,2,redDark);
    const la=frame===1?1:frame===3?-1:0,ra=frame===3?1:frame===1?-1:0;px(x-8,y-1+la,2,6,skinDark);px(x+6,y-1+ra,2,6,skin);
    px(x-5,y+7,4,4,shorts);px(x+1,y+7,4,4,shortHi);px(x-5+step,y+10,3,4,skinDark);px(x+2-step,y+10,3,4,skin);
    px(x-5+step,y+14,3,2,sock);px(x+2-step,y+14,3,2,sock);px(x-6+step,y+16,5,2,shoe);px(x+1-step,y+16,5,2,shoe);
    px(x-5+step,y+18,4,1,sole);px(x+2-step,y+18,4,1,sole);px(x-2,y-2,4,1,'rgba(255,210,205,.18)');
  } else if(player.dir==='up') {
    px(x-6,y-13,12,10,skin);px(x-7,y-15,14,5,hair);px(x-6,y-12,12,4,hair);px(x-2,y-15,4,1,hairHi);
    px(x-6,y-2,12,9,red);px(x-5,y-3,10,2,redHi);px(x-4,y+5,8,2,redDark);
    const la=frame===1?1:frame===3?-1:0,ra=frame===3?1:frame===1?-1:0;px(x-8,y-1+la,2,6,skinDark);px(x+6,y-1+ra,2,6,skin);
    px(x-5,y+7,4,4,shorts);px(x+1,y+7,4,4,shortHi);px(x-5+step,y+10,3,4,skinDark);px(x+2-step,y+10,3,4,skin);
    px(x-5+step,y+14,3,2,sock);px(x+2-step,y+14,3,2,sock);px(x-6+step,y+16,5,2,shoe);px(x+1-step,y+16,5,2,shoe);
    px(x-5+step,y+18,4,1,sole);px(x+2-step,y+18,4,1,sole);px(x-1,y,2,5,'rgba(90,12,18,.25)');
  } else {
    const faceLeft=player.dir==='left';
    px(x-6,y-13,12,10,skin);px(x-7,y-15,14,4,hair);px(faceLeft?x-7:x+4,y-12,3,5,hair);px(x-2,y-15,4,1,hairHi);
    px(faceLeft?x-4:x+3,y-8,1,1,'#2b2723');px(faceLeft?x-5:x+4,y-6,2,1,'#7d6751');
    px(x-6,y-2,12,9,red);px(x-5,y-3,10,2,redHi);px(x-4,y+5,8,2,redDark);
    const armA=frame===1?0:frame===3?2:1,armB=frame===1?2:frame===3?0:1;
    if(faceLeft){px(x-8,y+armA,2,6,skinDark);px(x+6,y+armB,2,6,skin);} else {px(x-8,y+armB,2,6,skinDark);px(x+6,y+armA,2,6,skin);}
    px(x-4,y+7,4,4,shorts);px(x+1,y+7,4,4,shortHi);px(x-4+step,y+10,3,4,skinDark);px(x+2-step,y+10,3,4,skin);
    px(x-4+step,y+14,3,2,sock);px(x+2-step,y+14,3,2,sock);px(x-5+step,y+16,5,2,shoe);px(x+1-step,y+16,5,2,shoe);
    px(x-4+step,y+18,4,1,sole);px(x+2-step,y+18,4,1,sole);
  }
}
function drawRain(){
  if(!scenes[scene].outdoor)return;
  const now=performance.now();ctx.save();
  for(let i=0;i<rain.length;i++){const r=rain[i];const near=i%5===0;ctx.strokeStyle=`rgba(176,200,210,${near?Math.min(.34,r.a*1.45):r.a*.72})`;ctx.lineWidth=near?1:.55;ctx.beginPath();ctx.moveTo(r.x,r.y);ctx.lineTo(r.x-(near?3.8:2.1),r.y+r.len*(near?1.18:.8));ctx.stroke();if(i%14===0&&r.y>190&&((Math.floor(r.y+r.x+i)%83)<2)){ctx.strokeStyle='rgba(177,202,211,.13)';ctx.beginPath();ctx.moveTo(r.x-3,r.y+3);ctx.lineTo(r.x,r.y+1);ctx.lineTo(r.x+3,r.y+3);ctx.stroke()}}
  ctx.globalAlpha=.18;for(let i=0;i<8;i++){const yy=((now*.13+i*97)%760)-80,xx=((i*79+now*.018)%430)-35;line(xx,yy,xx-6,yy+30,'rgba(205,221,228,.42)',1.2)}ctx.restore();
}
function drawAtmosphere(){
  const now=performance.now();ctx.fillStyle='rgba(4,10,14,.055)';ctx.fillRect(0,0,W,H);
  const g=ctx.createRadialGradient(W/2,H*.47,92,W/2,H*.50,395);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(.60,'rgba(0,0,0,.08)');g.addColorStop(.83,'rgba(0,0,0,.30)');g.addColorStop(1,'rgba(0,0,0,.78)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  if(scenes[scene].outdoor){ctx.save();ctx.globalAlpha=.042;for(let i=0;i<3;i++){const x=((now*.008+i*154)%520)-120,y=455+i*57;const fog=ctx.createRadialGradient(x,y,0,x,y,90);fog.addColorStop(0,'rgba(153,175,184,.5)');fog.addColorStop(1,'rgba(153,175,184,0)');ctx.fillStyle=fog;ctx.fillRect(x-90,y-25,180,50)}ctx.restore()}
  ctx.fillStyle=`rgba(2,6,9,${.028+Math.sin(now/870)*.006+Math.sin(now/1730)*.004})`;ctx.fillRect(0,0,W,H);
  ctx.save();ctx.globalAlpha=.06;for(let y=0;y<H;y+=4)px(0,y,W,1,'rgba(0,0,0,.28)');ctx.restore();
}
function draw(){ctx.clearRect(0,0,W,H);if(scene==='residential')drawResidential();else if(scene==='commercial')drawCommercial();else if(scene==='stationFront')drawStationFront();else drawStationHall();drawPlayer();drawRain();drawAtmosphere()}
let last=performance.now();function loop(now){const dt=Math.min(2.2,(now-last)/16.6667);last=now;update(dt);draw();requestAnimationFrame(loop)}
function setKey(k,v){if(k==='ArrowUp'||k==='w'||k==='W')keys.up=v;if(k==='ArrowDown'||k==='s'||k==='S')keys.down=v;if(k==='ArrowLeft'||k==='a'||k==='A')keys.left=v;if(k==='ArrowRight'||k==='d'||k==='D')keys.right=v}
addEventListener('keydown',e=>{setKey(e.key,true);if(['e','E','Enter',' '].includes(e.key)){e.preventDefault();interact()}});addEventListener('keyup',e=>setKey(e.key,false));
let stickId=null,stickRect=null;
function resetStick(){analog.x=analog.y=0;knob.style.transform='translate(0px,0px)';stickId=null}
stick.addEventListener('pointerdown',e=>{e.preventDefault();unlockAudio();stick.setPointerCapture(e.pointerId);stickId=e.pointerId;stickRect=stick.getBoundingClientRect();updateStick(e)});
stick.addEventListener('pointermove',e=>{if(e.pointerId===stickId)updateStick(e)});stick.addEventListener('pointerup',e=>{if(e.pointerId===stickId)resetStick()});stick.addEventListener('pointercancel',resetStick);
function updateStick(e){const cx=stickRect.left+stickRect.width/2,cy=stickRect.top+stickRect.height/2;let dx=e.clientX-cx,dy=e.clientY-cy;const max=35,m=Math.hypot(dx,dy);if(m>max){dx=dx/m*max;dy=dy/m*max}analog.x=dx/max;analog.y=dy/max;knob.style.transform=`translate(${dx}px,${dy}px)`}
actionEl.addEventListener('pointerdown',e=>{e.preventDefault();actionEl.classList.add('active');interact()});actionEl.addEventListener('pointerup',()=>actionEl.classList.remove('active'));actionEl.addEventListener('pointercancel',()=>actionEl.classList.remove('active'));dialogueEl.addEventListener('pointerdown',e=>{e.preventDefault();advanceDialogue()});
startBtn.addEventListener('click',()=>{unlockAudio();startEl.style.display='none';fadeEl.style.opacity='1';placeEl.textContent=scenes[scene].label;setAmbience();setTimeout(()=>{fadeEl.style.opacity='0';canMove=true},140)});
continueBtn.addEventListener('click',()=>{window.dispatchEvent(new CustomEvent('prologoFinalizado'));if(window.parent&&window.parent!==window)window.parent.postMessage({type:'PROLOGO_FINALIZADO'},'*');continueBtn.textContent='PRÓLOGO FINALIZADO'});
updateClock();requestAnimationFrame(loop);