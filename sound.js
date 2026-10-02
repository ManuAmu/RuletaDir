// Sonidos originales sintetizados localmente; no hay archivos ni servicios externos.
window.ShowSound=(()=>{
 const masterVolume=6;
 let ctx,master,enabled=true;const voices=new Set();
 try{enabled=localStorage.getItem('bibliodera.sound')!=='off';}catch{}
 function unlock(){try{if(!ctx){ctx=new (window.AudioContext||window.webkitAudioContext)();master=ctx.createGain();master.gain.value=masterVolume;// Soft peak limiter with output headroom for overlapping effects.
 const limiter=ctx.createWaveShaper(),curve=new Float32Array(4097);
 for(let i=0;i<curve.length;i++){const x=i*2/(curve.length-1)-1,a=Math.abs(x);curve[i]=Math.sign(x)*(a<=.8?a:.8+.15*Math.tanh((a-.8)/.15));}
 limiter.curve=curve;limiter.oversample='4x';
 const output=ctx.createGain();output.gain.value=.95;
 master.connect(limiter);limiter.connect(output);output.connect(ctx.destination);}if(ctx.state==='suspended')ctx.resume().catch(()=>{});}catch{}}
 function stop(){for(const voice of voices){try{voice.stop();}catch{}}voices.clear();}
 function tone(freq,offset=0,duration=.12,type='sine',volume=.07,endFreq=freq){
  if(!enabled||!ctx||ctx.state!=='running'||document.hidden)return;
  const osc=ctx.createOscillator(),gain=ctx.createGain(),at=ctx.currentTime+offset;
  osc.type=type;osc.frequency.setValueAtTime(freq,at);osc.frequency.exponentialRampToValueAtTime(endFreq,at+duration);
  gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(volume,at+.008);gain.gain.exponentialRampToValueAtTime(.0001,at+duration);
  osc.connect(gain);gain.connect(master);voices.add(osc);osc.onended=()=>{voices.delete(osc);osc.disconnect();gain.disconnect();};osc.start(at);osc.stop(at+duration+.02);
 }
 function play(name,duration=3200){
  if(name==='spin')tone(180,0,.3,'sine',.08,420);
  if(name==='tick')tone(900,0,.045,'triangle',.09,400);
  if(name==='category'){tone(660,0,.2,'sine',.09);tone(990,.1,.35,'sine',.07);}
  if(name==='correct'){[523.25,659.25,783.99,1046.5].forEach((n,i)=>tone(n,i*.13,.35,'triangle',.085));[523.25,659.25,783.99].forEach(n=>tone(n,.55,.65,'sine',.035));}
  if(name==='victory'){
   [523.25,659.25,783.99,1046.5,1318.51].forEach((n,i)=>tone(n,i*.14,.38,'triangle',.085));
   [523.25,659.25,783.99,1046.5].forEach(n=>tone(n,.85,1.1,'sine',.03));
   tone(2093,.9,.4,'sine',.025);
  }
  if(name==='defeat'){
   [392,329.63,261.63,196].forEach((n,i)=>tone(n,i*.23,.4,'triangle',.1275,n*.94));
   tone(98,.72,.75,'sine',.105,73.42);
  }
  if(name==='wrong'){tone(294,0,.22,'triangle',.09,220);tone(220,.22,.4,'triangle',.08,147);}
  if(name==='timeout'){[0,.2].forEach(t=>tone(350,t,.12,'triangle',.08));tone(175,.42,.4,'sine',.09,110);}
  if(name==='countdown')tone(740,0,.075,'sine',.045);
 }
 function update(){const b=document.querySelector('#sound-toggle');if(!b)return;b.setAttribute('aria-pressed',String(enabled));b.setAttribute('aria-label',enabled?'Silenciar sonido':'Activar sonido');b.title=enabled?'Silenciar sonido':'Activar sonido';b.dataset.muted=String(!enabled);}
 document.addEventListener('pointerdown',unlock,{capture:true});document.addEventListener('keydown',unlock,{capture:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
 document.querySelector('#sound-toggle').addEventListener('click',()=>{unlock();enabled=!enabled;stop();try{localStorage.setItem('bibliodera.sound',enabled?'on':'off');}catch{}update();});update();
 return {play,stop,unlock,get enabled(){return enabled;}};
})();
