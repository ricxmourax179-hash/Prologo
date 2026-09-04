function px(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))}
function line(x1,y1,x2,y2,c,w=1){ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke()}
function glow(x,y,r,c0,c1='rgba(0,0,0,0)'){const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,c0);g.addColorStop(1,c1);ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill()}
function text(t,x,y,size=8,c='rgba(238,242,243,.65)',align='center'){ctx.fillStyle=c;ctx.font=`${size}px monospace`;ctx.textAlign=align;ctx.fillText(t,x,y)}
function windowGlow(x,y,w,h,on=true){px(x,y,w,h,on?'#6e704f':'#10151a');if(on){px(x+2,y+2,w-4,h-4,'#9b8d60');px(x+3,y+3,w-6,h-6,'#6b6650')}}
function lamp(x,y){px(x-2,y,4,56,'#1b2126');px(x-5,y-4,10,6,'#35383a');px(x-3,y-3,6,3,'#d6c17c');glow(x,y,45,'rgba(213,190,108,.16)')}
function puddle(x,y,w){px(x,y,w,3,'rgba(99,126,142,.14)');px(x+6,y+4,w*.6,2,'rgba(99,126,142,.09)')}
function curb(y){px(76,y,208,5,'#272c30');px(76,y+5,208,2,'#111518')}
function hash2(x,y){const n=Math.sin(x*127.1+y*311.7)*43758.5453;return n-Math.floor(n)}
function speckle(x,y,w,h,count=30,alpha=.08,light=false){ctx.save();for(let i=0;i<count;i++){const rx=x+hash2(i+3,x+y)*w,ry=y+hash2(i+51,y+x)*h;const a=(.25+hash2(i+91,w+h)*.75)*alpha;ctx.fillStyle=light?`rgba(210,220,220,${a})`:`rgba(0,0,0,${a})`;ctx.fillRect(Math.round(rx),Math.round(ry),1+(i%5===0?1:0),1)}ctx.restore()}
function wetRoad(x,y,w,h){px(x,y,w,h,'#0a0f13');for(let yy=y+6;yy<y+h;yy+=22)line(x+2,yy,x+w-2,yy,'rgba(176,198,207,.022)');speckle(x,y,w,h,95,.10,false);for(let i=0;i<14;i++){const rx=x+hash2(i+12,41)*w,ry=y+hash2(i+33,74)*h;const rw=10+hash2(i+77,9)*42;px(rx,ry,rw,1,'rgba(114,145,159,.035)');if(i%3===0)px(rx+4,ry+2,rw*.55,1,'rgba(163,185,194,.025)')}}
function sidewalk(x,y,w,h){px(x,y,w,h,'#11171c');for(let yy=y+18;yy<y+h;yy+=24)line(x,yy,x+w,yy,'rgba(215,225,225,.035)');for(let xx=x+22;xx<x+w;xx+=28)line(xx,y,xx,y+h,'rgba(0,0,0,.12)');speckle(x,y,w,h,38,.12,false)}
function wallTexture(x,y,w,h,base='#11171c'){px(x,y,w,h,base);for(let yy=y+8;yy<y+h;yy+=10){line(x,yy,x+w,yy,'rgba(255,255,255,.018)');for(let xx=x+((Math.floor((yy-y)/10)%2)*7);xx<x+w;xx+=14)px(xx,yy,1,1,'rgba(255,255,255,.025)')}speckle(x,y,w,h,26,.09,false)}
function downpipe(x,y,h){px(x,y,3,h,'#1f282e');px(x+1,y,1,h,'rgba(155,173,179,.10)');px(x-1,y+h-4,5,4,'#13191d')}
function drain(x,y,w=18){px(x,y,w,7,'#0a0d0f');for(let xx=x+2;xx<x+w-1;xx+=4)px(xx,y+1,1,5,'#293136')}
function door(x,y,w=23,h=39,lit=false){px(x,y,w,h,'#0a0e11');px(x+2,y+2,w-4,h-2,lit?'#30302b':'#161c20');px(x+w-5,y+h/2,2,2,lit?'#c6aa61':'#53595b');if(lit)glow(x+w/2,y+h/2,34,'rgba(214,182,96,.08)')}
function signBox(x,y,w,h,label,c='rgba(230,235,230,.5)'){px(x,y,w,h,'#171d21');px(x+1,y+1,w-2,h-2,'#20272b');text(label,x+w/2,y+h/2+2,5,c)}
function poster(x,y,w,h,tint='#5b625c'){px(x,y,w,h,'#0b0f12');px(x+1,y+1,w-2,h-2,tint);px(x+3,y+4,w-6,2,'rgba(230,230,220,.26)');px(x+3,y+9,w-8,1,'rgba(230,230,220,.16)');px(x+3,y+12,w-10,1,'rgba(0,0,0,.22)')}
function cable(x1,y1,x2,y2){ctx.save();ctx.strokeStyle='rgba(19,24,28,.86)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x1,y1);ctx.quadraticCurveTo((x1+x2)/2,(y1+y2)/2+11,x2,y2);ctx.stroke();ctx.restore()}
function tree(x,y,s=1){px(x-2*s,y,4*s,25*s,'#20251f');const c1='#172019',c2='#1d281e',c3='#243025';px(x-9*s,y-10*s,18*s,11*s,c1);px(x-13*s,y-5*s,26*s,10*s,c2);px(x-10*s,y+1*s,20*s,9*s,c3);px(x-6*s,y-14*s,12*s,7*s,c2);speckle(x-12*s,y-13*s,24*s,22*s,15,.10,true)}
function bench(x,y,w=53){px(x,y,w,5,'#302c27');px(x+3,y+6,w-6,3,'#25221f');px(x+6,y+9,3,10,'#171a1b');px(x+w-9,y+9,3,10,'#171a1b')}
function reflectedLamp(x,y,len=56){const g=ctx.createLinearGradient(x,y,x,y+len);g.addColorStop(0,'rgba(222,195,105,.12)');g.addColorStop(.45,'rgba(191,166,93,.045)');g.addColorStop(1,'rgba(191,166,93,0)');ctx.fillStyle=g;ctx.fillRect(x-5,y,10,len);for(let i=0;i<6;i++)px(x-5+((i*7)%9),y+6+i*7,4+(i%3)*2,1,'rgba(229,207,126,.08)')}
function glassReflection(x,y,w,h){ctx.save();ctx.globalAlpha=.8;line(x+3,y+2,x+w*.55,y+h-3,'rgba(201,220,226,.08)');line(x+w*.42,y+1,x+w-3,y+h*.55,'rgba(201,220,226,.05)');ctx.restore()}
function puddleHi(x,y,w,seed=0){const h=5+Math.round(hash2(seed+9,22)*4);px(x,y,w,h,'rgba(62,85,96,.14)');px(x+3,y+1,w-8,1,'rgba(157,181,190,.10)');px(x+8,y+h-1,w*.45,1,'rgba(0,0,0,.22)');const t=(performance.now()/130+seed*17)%85;if(t<24){ctx.strokeStyle='rgba(177,200,207,.13)';ctx.beginPath();ctx.ellipse(x+w*.58,y+h*.45,t*.22,t*.07,0,0,Math.PI*2);ctx.stroke()}}
function lampHi(x,y,h=58){px(x-2,y,4,h,'#1d252a');px(x-1,y,1,h,'rgba(150,170,176,.08)');px(x-5,y-4,10,6,'#343b3e');px(x-4,y-3,8,3,'#d1ba72');px(x-2,y-2,4,2,'#efe0a7');glow(x,y,62,'rgba(221,197,111,.16)');glow(x,y,28,'rgba(243,220,145,.10)');reflectedLamp(x,y+8,72)}
function crosswalk(y){for(let x=122;x<=228;x+=18)px(x,y,10,20,'rgba(197,202,194,.075)')}
function bollard(x,y){px(x-2,y,4,13,'#242b2e');px(x-3,y,6,3,'#343b3d');px(x-1,y+3,2,2,'#8d8254')}
function drawInteractableHighlight(x,y,r=16){const now=performance.now();const pulse=.42+Math.sin(now/280)*.10;ctx.save();const g=ctx.createRadialGradient(x,y,2,x,y,r);g.addColorStop(0,`rgba(224,236,227,${pulse*.18})`);g.addColorStop(.45,`rgba(198,216,205,${pulse*.10})`);g.addColorStop(1,'rgba(198,216,205,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();const phase=((now/420)+(x+y))%1;if(phase<.18){ctx.globalAlpha=.48;line(x-4,y-r*.45,x+4,y-r*.45,'rgba(237,244,238,.72)');line(x,y-r*.45-4,x,y-r*.45+4,'rgba(237,244,238,.72)')}ctx.restore()}
