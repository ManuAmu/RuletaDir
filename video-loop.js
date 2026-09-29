// Video stays on this device, separate from the question bank.
window.VideoLoop=(()=>{
 let generation=0,fullscreenOwned=false;const urls=new Set();
 function database(){return new Promise((resolve,reject)=>{const request=indexedDB.open('bibliodera-media',1);request.onupgradeneeded=()=>request.result.createObjectStore('media');request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});}
 async function storage(value){const db=await database();return new Promise((resolve,reject)=>{const tx=db.transaction('media',value!==undefined?'readwrite':'readonly'),store=tx.objectStore('media'),request=value===null?store.delete('loop'):value!==undefined?store.put(value,'loop'):store.get('loop');tx.oncomplete=()=>{db.close();resolve(request.result);};tx.onerror=tx.onabort=()=>{db.close();reject(tx.error||Error('No se pudo guardar el video.'));};});}
 function source(file){const url=URL.createObjectURL(file);urls.add(url);return url;}
 function stop(){generation++;if(fullscreenOwned&&document.querySelector('#stage')?.dataset.screen==='loop'){fullscreenOwned=false;if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});}document.querySelectorAll('video').forEach(v=>{v.pause();v.removeAttribute('src');v.load();});urls.forEach(url=>URL.revokeObjectURL(url));urls.clear();}
 function validate(file){return new Promise((resolve,reject)=>{const video=document.createElement('video'),url=URL.createObjectURL(file);let timeout;const finish=error=>{clearTimeout(timeout);video.removeAttribute('src');video.load();URL.revokeObjectURL(url);error?reject(Error(error)):resolve();};video.preload='metadata';video.onloadedmetadata=()=>finish(video.videoWidth?'':'El archivo no contiene un video válido.');video.onerror=()=>finish('No se puede reproducir este archivo. Probá otro video en formato MP4.');timeout=setTimeout(()=>finish('No se pudo leer el video. Probá otro archivo.'),15000);video.src=url;});}
 async function settings(panel){
  const token=generation;
  panel.innerHTML=`<div class="loop-settings"><h2>Video en loop</h2><p>Elegí un video y reproducilo sin sonido en pantalla completa.</p><div class="loop-actions"><label class="video-upload"><span aria-hidden="true">↑</span> Elegir video<input aria-label="Elegir video" type="file" accept="video/mp4,video/webm,.mp4,.webm" id="loop-file"></label><button type="button" class="video-delete" id="delete-loop" hidden><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/></svg>Eliminar video</button><button class="button" id="start-loop" disabled>Iniciar loop ↗</button></div><p role="status" id="loop-status">Buscando video guardado…</p><video class="loop-preview" controls muted playsinline hidden></video><p class="storage-note">MP4 o WebM · hasta 500 MB. El video queda guardado en este equipo y funciona sin Internet. Conservá una copia del archivo original.</p></div>`;
  const status=panel.querySelector('#loop-status'),input=panel.querySelector('input'),preview=panel.querySelector('video'),start=panel.querySelector('#start-loop'),upload=panel.querySelector('.video-upload'),remove=panel.querySelector('#delete-loop');
  let loaded=false;
  const active=()=>token===generation&&panel.isConnected;
  function show(record){loaded=true;upload.hidden=true;remove.hidden=false;preview.src=source(record.file);preview.hidden=false;start.disabled=false;status.textContent=`Video guardado: ${record.name}`;}
  start.onclick=()=>{if(!document.fullscreenElement&&document.documentElement.requestFullscreen){fullscreenOwned=true;document.documentElement.requestFullscreen().then(()=>{if(location.hash!=='#loop'&&document.fullscreenElement){fullscreenOwned=false;document.exitFullscreen().catch(()=>{});}}).catch(()=>{fullscreenOwned=false;});}location.hash='loop';};
  remove.onclick=async()=>{if(remove.disabled||!loaded)return;remove.disabled=true;start.disabled=true;status.textContent='Eliminando video…';try{await storage(null);if(!active())return;preview.pause();const url=preview.getAttribute('src');preview.removeAttribute('src');preview.load();if(url){URL.revokeObjectURL(url);urls.delete(url);}preview.hidden=true;loaded=false;remove.hidden=true;upload.hidden=false;input.disabled=false;input.value='';status.textContent='Video eliminado. Podés elegir otro.';upload.querySelector('input').focus();}catch{if(active()){status.textContent='No se pudo eliminar el video. Intentá nuevamente.';start.disabled=false;}}finally{if(active())remove.disabled=false;}};
  input.onchange=async()=>{const file=input.files[0];if(!file||loaded)return;input.disabled=true;start.disabled=true;status.textContent='Comprobando y guardando video…';try{if(file.size>500*1024*1024)throw Error('El video supera 500 MB. Elegí una versión más liviana.');await validate(file);if(!active())return;await storage({file,name:file.name});if(!active())return;preview.pause();if(preview.src){URL.revokeObjectURL(preview.src);urls.delete(preview.src);}show({file,name:file.name});}catch(error){if(active()){status.textContent=error.name==='QuotaExceededError'?'No hay espacio para guardar este video. Elegí uno más liviano.':error.message;start.disabled=!preview.getAttribute('src');}}finally{if(active()){input.disabled=false;input.value='';}}};
  input.disabled=true;
  try{const record=await storage();if(active()){if(record)show(record);else status.textContent='Todavía no cargaste un video.';}}catch{if(active())status.textContent='No se pudo recuperar el video guardado. Volvé a cargar el archivo.';}finally{if(active())input.disabled=false;}
 }
 function mount(stage,selected){
  const section=stage.querySelector('.settings'),heading=section.querySelector('.settings-heading');
  heading.querySelector('p')?.remove();section.querySelector(':scope > .storage-note')?.remove();
  const questions=document.createElement('div');questions.id='questions-panel';
  [...section.children].filter(e=>e!==heading).forEach(e=>questions.append(e));
  section.append(questions);questions.hidden=selected==='loop';
  if(selected==='loop'){const panel=document.createElement('div');section.append(panel);settings(panel);}
 }
 async function play(stage){
  const token=generation;
  stage.innerHTML=`<section class="loop-player"><video autoplay muted loop playsinline aria-label="Video del stand"></video><a class="loop-exit" href="#configuracion-loop" aria-label="Salir del loop" title="Salir del loop"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></a><div class="loop-message" role="status">Cargando video…</div><button class="button loop-resume" hidden>Reproducir video</button></section>`;
  const video=stage.querySelector('video'),message=stage.querySelector('.loop-message'),resume=stage.querySelector('.loop-resume');
  const active=()=>token===generation&&video.isConnected;
  const begin=()=>video.play().then(()=>{if(active()){message.textContent='';resume.hidden=true;}}).catch(()=>{if(active()){message.textContent='Tocá para iniciar el video.';resume.hidden=false;}});
  resume.onclick=begin;video.onerror=()=>{if(active())message.textContent='No se puede reproducir este video. Volvé a Configuración y cargá otro.';};
  try{const record=await storage();if(!active())return;if(!record){message.textContent='Cargá un video desde Configuración → Loop.';return;}video.src=source(record.file);begin();}catch{if(active())message.textContent='No se pudo recuperar el video. Volvé a Configuración → Loop.';}
 }
 function menu(stage){
  stage.innerHTML=`<section class="settings settings-menu"><div class="settings-heading"><div><h1>Configuración</h1><p>¿Qué querés preparar?</p></div>${BiblioderaUI.backToGame()}</div><nav class="settings-choices" aria-label="Opciones de configuración"><a href="#configuracion-preguntas"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 4h12v16H4zM8 8h5M8 12h5M20 7v13"/></svg><strong>Preguntas</strong><span>Cargá y editá el contenido del juego</span></a><a href="#configuracion-loop"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="m10 8 6 4-6 4z"/></svg><strong>Loop</strong><span>Prepará el video del stand</span></a></nav></section>`;
 }
 return {mount,play,stop,menu};
})();
