function updateClock(){clockEl.textContent=`01:${String(gameMinute).padStart(2,'0')}`}
function overlap(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y}
function dist(ax,ay,bx,by){return Math.hypot(ax-bx,ay-by)}
function setHint(t){hintEl.textContent=t;hintEl.classList.add('show');actionEl.textContent=t}
function clearHint(){hintEl.classList.remove('show');actionEl.textContent='OLHAR'}

function move(dx,dy){
  if(!canMove||interacting||transitioning)return;
  const sp=player.speed,solids=solidsFor(scene);
  let nx=player.x+dx*sp,ny=player.y+dy*sp;
  const tx={x:nx-player.w/2,y:player.y-player.h/2,w:player.w,h:player.h};if(!solids.some(s=>overlap(tx,s)))player.x=nx;
  const ty={x:player.x-player.w/2,y:ny-player.h/2,w:player.w,h:player.h};if(!solids.some(s=>overlap(ty,s)))player.y=ny;
  player.x=Math.max(10,Math.min(W-10,player.x));player.y=Math.max(10,Math.min(H-10,player.y));
  player.walk+=Math.hypot(dx,dy)*1.5;
}

function detectTarget(){
  nearTarget=null;if(interacting||transitioning){clearHint();return}
  const def=scenes[scene];
  for(const o of def.objects||[]){if(dist(player.x,player.y,o.x,o.y)<o.r){nearTarget={type:'object',data:o};setHint(o.label||'OLHAR');return}}
  if(scene==='stationHall'){
    if(!hasTicket&&dist(player.x,player.y,132,230)<58){nearTarget={type:'seller'};setHint('FALAR');return}
    if(hasTicket&&dist(player.x,player.y,180,94)<46){nearTarget={type:'finish'};setHint('PLATAFORMA');return}
  }
  if(def.exit&&dist(player.x,player.y,def.exit.x,def.exit.y)<def.exit.r){nearTarget={type:'exit',data:def.exit};setHint(def.exit.label||'SEGUIR');return}
  if(def.back&&dist(player.x,player.y,def.back.x,def.back.y)<def.back.r){nearTarget={type:'exit',data:def.back};setHint('VOLTAR');return}
  clearHint();
}

function interact(){
  unlockAudio();
  if(interacting){advanceDialogue();return}
  if(!nearTarget)return;
  if(nearTarget.type==='object'){
    const o=nearTarget.data;examined.add(o.id);showLines([[o.speaker||'VOCÊ',o.text]]);
  } else if(nearTarget.type==='seller') startSeller();
  else if(nearTarget.type==='finish') finishGame();
  else if(nearTarget.type==='exit') changeScene(nearTarget.data.to,nearTarget.data.spawn);
}

function showLines(lines,onEnd=null){dialogueQueue=lines;dialogueIndex=0;interacting=true;canMove=false;dialogueEl.style.display='block';dialogueEl.dataset.onend=onEnd||'';showLine()}
function showLine(){
  const [name,text]=dialogueQueue[dialogueIndex];speakerEl.textContent=name;currentLine=text;dialogueText.textContent='';typing=true;clearInterval(typeTimer);let i=0;
  typeTimer=setInterval(()=>{if(i>=text.length){clearInterval(typeTimer);typing=false;return}dialogueText.textContent+=text[i];if(text[i]!==' '&&text[i]!=='\n'&&i%2===0)blip(name);i++},24);
}
function advanceDialogue(){
  if(typing){clearInterval(typeTimer);dialogueText.textContent=currentLine;typing=false;return}
  dialogueIndex++;
  if(dialogueIndex>=dialogueQueue.length){const onEnd=dialogueEl.dataset.onend;dialogueEl.style.display='none';interacting=false;canMove=true;dialogueEl.dataset.onend='';if(onEnd==='ticket'){hasTicket=true;gameMinute=6;updateClock();sfx('ticket')}return}
  showLine();
}
function startSeller(){
  showLines([
    ['VENDEDOR','Boa noite.'],['VOCÊ','Boa noite.'],['VENDEDOR','Vai pra onde?'],['VOCÊ','[DESTINO]'],['VENDEDOR','Certo.'],
    ['VENDEDOR','Último trem passa daqui a pouco.'],['VOCÊ','Tá bom.'],['VENDEDOR','Aqui.'],['VOCÊ','Obrigado.'],['VENDEDOR','Boa viagem.']
  ],'ticket');
}
function changeScene(to,spawn){
  if(transitioning)return;transitioning=true;canMove=false;clearHint();fadeEl.style.opacity='1';sfx('door');
  setTimeout(()=>{scene=to;placeEl.textContent=scenes[scene].label;player.x=spawn.x;player.y=spawn.y;player.dir=spawn.y<150?'down':'up';setAmbience();setTimeout(()=>{fadeEl.style.opacity='0';transitioning=false;canMove=true},100)},430);
}
function finishGame(){
  if(transitioning)return;gameMinute=7;updateClock();transitioning=true;canMove=false;fadeEl.style.opacity='1';
  setTimeout(()=>{endingEl.style.display='grid'},650);
}

function update(dt){
  let vx=(keys.right?1:0)-(keys.left?1:0)+analog.x,vy=(keys.down?1:0)-(keys.up?1:0)+analog.y;
  const mag=Math.hypot(vx,vy);player.moving=mag>.12;
  if(mag>.12){vx/=Math.max(1,mag);vy/=Math.max(1,mag);move(vx*dt,vy*dt);if(Math.abs(vx)>Math.abs(vy))player.dir=vx>0?'right':'left';else player.dir=vy>0?'down':'up'}
  for(const r of rain){r.x-=.42*r.spd*dt;r.y+=r.spd*dt;if(r.y>H+12||r.x<-22){r.x=Math.random()*(W+100)+20;r.y=-20-Math.random()*100}}
  for(const r of ripples){r.p+=dt;if(r.p>90){r.p=0;r.x=60+Math.random()*240;r.y=190+Math.random()*380}}
  minuteAccum+=dt;if(minuteAccum>2100&&gameMinute<5){gameMinute++;minuteAccum=0;updateClock()}
  detectTarget();
}
