/* Local GSAP choreography. No questions, persistence or game decisions live here. */
window.BiblioderaMotion=(()=>{
 const stage=document.querySelector('#stage'),header=document.querySelector('.bibliodera-brand');
 const preference=matchMedia('(prefers-reduced-motion: reduce)');
 let context,exitTween,exitDone,logo,logoTween,spinTimeline,inviteTween;
 const reduced=()=>preference.matches;
 const usesHeaderLogo=id=>id==='girando'||id.startsWith('configuracion');
 document.documentElement.classList.add('motion-ready');
 function snapshot(element){return element?{node:element.cloneNode(true),rect:element.getBoundingClientRect()}:null;}
 function capture(next){
  const previous=stage.dataset.screen;
  return {previous,wheel:next==='girando'?stage.querySelector('.wheel-wrap')?.getBoundingClientRect():null,logo:usesHeaderLogo(next)&&previous==='ruleta'?snapshot(logo||stage.querySelector('.lettering-title .brand-art')):next==='ruleta'&&previous&&previous!=='ruleta'?snapshot(logo||header):null};
 }
 function stop(){
  exitTween?.kill();exitTween=null;exitDone?.();exitDone=null;
  const pointer=stage.querySelector('.pointer');if(pointer)gsap.killTweensOf(pointer);
  context?.revert();context=null;spinTimeline=null;inviteTween=null;logoTween?.kill();logo?.remove();logo=null;
  header.style.visibility='';
 }
 function exit(next){
  if(!stage.firstElementChild||next==='girando'||(usesHeaderLogo(next)&&stage.dataset.screen==='ruleta')||reduced())return Promise.resolve();
  return new Promise(resolve=>{exitDone=resolve;exitTween=gsap.to(stage.firstElementChild,{opacity:0,y:-12,duration:.16,ease:'power2.in',onComplete:()=>{exitDone=null;resolve();}});});
 }
 function morph(saved,next){
  const target=usesHeaderLogo(next)?header:stage.querySelector('.lettering-title .brand-art');
  if(!saved||!target||reduced()){header.style.visibility=next==='ruleta'?'hidden':'';return;}
  const a=saved.rect,b=target.getBoundingClientRect();
  logo=saved.node;logo.removeAttribute('style');logo.removeAttribute('href');logo.removeAttribute('aria-label');logo.setAttribute('aria-hidden','true');logo.className='brand-art motion-logo';
  Object.assign(logo.style,{left:a.left+'px',top:a.top+'px',width:a.width+'px',height:a.height+'px'});
  document.body.append(logo);header.style.visibility='hidden';target.style.visibility='hidden';
  const finish=()=>{logo?.remove();logo=null;target.style.visibility='';header.style.visibility=next==='ruleta'?'hidden':'';};
  logoTween=gsap.to(logo,{x:b.left-a.left,y:b.top-a.top,scaleX:b.width/a.width,scaleY:b.height/a.height,duration:.78,ease:'power3.inOut',onComplete:finish});
 }
 function enter(id,saved){
  context=gsap.context(()=>{
   const targets=stage.querySelectorAll('.copy>*:not(.lettering-title),.question-meta,.question>h1,.response-time,.answer,.category-reveal>*');
   if(!reduced()){
    if(saved.wheel){const wheel=stage.querySelector('.wheel-wrap'),b=wheel.getBoundingClientRect(),a=saved.wheel;gsap.from(wheel,{x:a.left-b.left,y:a.top-b.top,scale:a.width/b.width,transformOrigin:'0 0',duration:.45,ease:'power2.out'});}
    gsap.from(targets,{opacity:0,y:24,duration:.4,stagger:.055,delay:id==='girando'?.45:0,ease:'power3.out'});
    if(id==='ruleta'){
     gsap.from(stage.querySelector('.wheel-wrap'),{scale:.94,opacity:0,duration:.5,ease:'power3.out'});
     // Invite touch while idle; the screen context cancels this when spinning starts.
     inviteTween=gsap.fromTo(stage.querySelector('.hub-action'),{scale:1},{scale:1.09,duration:.65,repeat:-1,repeatDelay:.16,yoyo:true,ease:'sine.inOut',delay:.55});
    }
    const burst=stage.querySelector('.burst');
    if(burst){
     if(id==='correcta'||id==='premio')gsap.from(burst,{scale:.65,rotation:-30,opacity:0,duration:.65,ease:'back.out(1.25)'});
     else gsap.fromTo(burst,{x:-16,opacity:.4},{x:0,opacity:1,duration:.4,ease:'power2.out'});
    }
    if(id==='categoria')gsap.from(stage.querySelector('h1'),{scale:.86,duration:.55,ease:'back.out(1.15)'});
    if(id==='correcta'||id==='premio')celebrate();
   }
  },stage);
  morph(saved.logo,id);
 }
 function celebrate(){
  const confetti=document.createElement('div');confetti.className='confetti';confetti.setAttribute('aria-hidden','true');
  confetti.innerHTML=Array.from({length:24},(_,i)=>`<i style="left:${(i*37)%100}%;background:${['#ffd879','#fff3dc','#ffb29b'][i%3]}"></i>`).join('');stage.append(confetti);
  gsap.fromTo(confetti.children,{y:-40,opacity:1},{y:()=>innerHeight+40,x:i=>(i%5-2)*55,rotation:i=>i%2?240:-240,opacity:0,duration:1.9,stagger:.018,ease:'power1.out',onComplete:()=>confetti.remove()});
 }
 function spin(rotation,duration,done){
  context.add(()=>{
   const wheel=stage.querySelector('.wheel'),pointer=stage.querySelector('.pointer');
   if(reduced()){gsap.set(wheel,{rotation});gsap.delayedCall(.7,done);return;}
   const state={angle:0},slice=360/BiblioderaContent.categories.length;
   let segment=0;
   const update=()=>{
    gsap.set(wheel,{rotation:state.angle});
    const now=Math.floor((state.angle+slice/2)/slice);
    if(now!==segment){segment=now;ShowSound.play('tick');gsap.fromTo(pointer,{rotation:-10},{rotation:0,duration:.09,overwrite:true,ease:'power2.out',transformOrigin:'50% 10%'});}
   };
   // Matching speed at phase boundaries: accelerate, cruise, then coast to rest.
   const total=duration/1000,travel=rotation;
   spinTimeline=gsap.timeline({onComplete:done,onUpdate:update})
    .to(state,{angle:travel*.1875,duration:total*.2,ease:'power1.in'})
    .to(state,{angle:travel*.65625,duration:total*.25,ease:'none'})
    .to(state,{angle:travel,duration:total*.55,ease:'power2.out'});
  });
 }
 preference.addEventListener('change',()=>{if(reduced()){inviteTween?.revert();logoTween?.progress(1);spinTimeline?.progress(1);}});
 window.addEventListener('resize',()=>logoTween?.progress(1));
 return {capture,stop,exit,enter,spin};
})();
