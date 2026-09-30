// Loaded only by the APK build; keep the existing browser version unchanged.
(()=>{
 if(!window.structuredClone)window.structuredClone=value=>JSON.parse(JSON.stringify(value));
 if(!crypto.randomUUID)crypto.randomUUID=()=>{const a=crypto.getRandomValues(new Uint8Array(16));a[6]=(a[6]&15)|64;a[8]=(a[8]&63)|128;return Array.from(a,(v,i)=>([4,6,8,10].includes(i)?'-':'')+('0'+v.toString(16)).slice(-2)).join('');};
 if(!Blob.prototype.text)Blob.prototype.text=function(){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(r.error);r.readAsText(this);});};
 const legacy=!CSS.supports('width','1cqh');document.documentElement.classList.toggle('legacy-webview',legacy);
 window.AndroidLayout=id=>{
  [document.documentElement,document.body,document.querySelector('.shell')].forEach(e=>{e.dataset.stage=id;e.dataset.admin=String(id.indexOf('configuracion')===0);});
 };
 function layout(){
  const stage=document.querySelector('#stage');if(!stage)return;
  AndroidLayout(stage.dataset.screen||'ruleta');
  if((stage.dataset.screen||'').indexOf('configuracion')!==0){stage.scrollLeft=0;stage.scrollTop=0;const shell=document.querySelector('.shell');shell.scrollLeft=0;shell.scrollTop=0;}
  if(!legacy)return;
  const w=innerWidth,h=innerHeight,portrait=w<850||h>w,sh=h-(portrait?124:68+Math.max(66,Math.min(h*.09,100)));
  const size=portrait?Math.min(w-72,sh*.64-48,840):Math.min(w*.48,sh-66,980);
  document.documentElement.style.setProperty('--legacy-wheel',Math.max(180,size)+'px');
  document.documentElement.style.setProperty('--legacy-stage',sh+'px');
  document.querySelectorAll('.brand-art').forEach(e=>{if(!e.classList.contains('motion-logo'))e.style.height=e.clientWidth*241/860+'px';});
  document.querySelectorAll('.municipality-brand').forEach(e=>e.style.height=e.clientWidth*1675/4847+'px');
  const wheel=document.querySelector('.wheel');
  if(wheel&&!CSS.supports('background-image',wheel.style.getPropertyValue('--segments'))){
   const cats=BiblioderaContent.categories,angle=360/cats.length;let paths='';
   cats.forEach((c,i)=>{const a=(i*angle-angle/2-90)*Math.PI/180,b=a+angle*Math.PI/180;paths+=`<path fill="${c.color}" d="M 100 100 L ${100+100*Math.cos(a)} ${100+100*Math.sin(a)} A 100 100 0 0 1 ${100+100*Math.cos(b)} ${100+100*Math.sin(b)} Z"/>`;});
   wheel.style.backgroundImage='url("data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">${paths}</svg>`)+'")';
  }
 }
 document.addEventListener('DOMContentLoaded',()=>{const stage=document.querySelector('#stage');new MutationObserver(layout).observe(stage,{childList:true,attributes:true,attributeFilter:['data-screen']});layout();});
 window.addEventListener('resize',layout);
})();
