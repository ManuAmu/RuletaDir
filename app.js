// Pantallas y temporizadores; banco administrado en settings.js.
(() => {
 const {eyebrow,wheel,burst,escape}=BiblioderaUI,data=BiblioderaContent,stage=document.querySelector('#stage');
 let timer,countdown,deadline=0,answering=false,current=null,lastId=null;
 const category=()=>data.categories[current?.category??0];
 const split=(l,r,cls='')=>`<section class="split ${cls}"><div class="copy">${l}</div><div class="visual">${r}</div></section>`;
 const screens={
 ruleta:()=>split(`<h1 class="title lettering-title"><span class="brand-art"><img src="assets/bibliodera-lettering.png" alt="La Bibliodera" width="1080" height="1080"></span></h1><p>Tocá el centro de la ruleta<br>y empezá a jugar.</p>${QuestionStore.get().questions.length?'':'<p class="setup-note">Antes de jugar, cargá las preguntas en <a href="#configuracion">Configuración</a>.</p>'}`,`<div class="sticker">¡DALE UNA VUELTA!</div>${wheel(false,true)}<span class="spark spark-one" aria-hidden="true">✳</span>`,'cover'),
 girando:()=>split(`${eyebrow('RULETA EN MOVIMIENTO')}<h1>¿Qué<br>te va a<br><em>tocar?</em></h1><p role="status">La ruleta está girando…</p>`,wheel(true,true)),
 categoria:()=>`<section class="center category-reveal" style="--category-color:${category().color}">${eyebrow('TE TOCÓ')}<h1>${escape(category().label)}</h1><p>Preparate para responder.</p></section>`,
 pregunta:()=>`<section class="question"><div class="question-meta">${eyebrow(escape(category().label))}</div><h1>${escape(current.text)}</h1><div class="response-time"><div class="time-label"><span>Tiempo para responder</span><strong><span id="seconds">${QuestionStore.get().seconds}</span> s</strong></div><div class="time-track" role="progressbar" aria-label="Tiempo restante" aria-valuemin="0" aria-valuemax="${QuestionStore.get().seconds}" aria-valuenow="${QuestionStore.get().seconds}"><div id="time-fill"></div></div></div><div class="answers">${current.options.map((s,i)=>`<button class="answer" data-answer="${i}"><span>${'ABCD'[i]}</span>${escape(s)}</button>`).join('')}</div></section>`,
 correcta:()=>split(`${eyebrow('RESPUESTA CORRECTA')}<h1>¡Ganaste!</h1><p>Elegiste la respuesta correcta.<br>¿Vamos por otra vuelta?</p><p class="demo-note">Volvemos a la ruleta en un momento…</p>`,`${burst('✓','success')}<div class="visual-caption">¡BIEN AHÍ!</div>`),
 incorrecta:()=>split(`${eyebrow('RESPUESTA INCORRECTA')}<h1>Esta vez<br><em>perdiste.</em></h1><p>La próxima puede ser la tuya.</p><div class="answer-note">La respuesta correcta era:<br><strong>${escape(current.options[current.correct])}</strong></div><p class="demo-note">Volvemos a la ruleta en un momento…</p>`,`${burst('×','miss')}<div class="visual-caption">¡VOLVÉ A INTENTAR!</div>`),
 tiempo:()=>split(`${eyebrow('TIEMPO AGOTADO')}<h1>Se terminó<br><em>el tiempo.</em></h1><p>Esta vez perdiste.<br>¡Probá con otra vuelta!</p><p class="demo-note">Volvemos a la ruleta en un momento…</p>`,`${burst('0','miss')}<div class="visual-caption">¡VOLVÉ A INTENTAR!</div>`)
 };
 function stop(){ShowSound.stop();clearTimeout(timer);clearInterval(countdown);deadline=0;answering=false;}
 function go(id){if(location.hash==='#'+id)render();else location.hash=id;}
 function start(){ShowSound.unlock();const questions=QuestionStore.get().questions;if(!questions.length){go('configuracion');return;}
 const pool=questions.length>1?questions.filter(q=>q.id!==lastId):questions;
 const categories=[...new Set(pool.map(q=>q.category))],selected=categories[Math.floor(Math.random()*categories.length)];
 const candidates=pool.filter(q=>q.category===selected);current=candidates[Math.floor(Math.random()*candidates.length)];lastId=current.id;
 data.wheelRotation=1440-current.category*(360/data.categories.length);go('girando');}
 function render(){stop();let id=location.hash.slice(1)||'ruleta';
 if(id==='configuracion'){stage.dataset.screen=id;SettingsUI.render(stage);document.title='Configuración | LA BIBLIODERA';return;}
 if(!screens[id]||(id!=='ruleta'&&!current)){go('ruleta');return;}
 stage.innerHTML=screens[id]();stage.dataset.screen=id;document.title='LA BIBLIODERA';stage.focus({preventScroll:true});window.scrollTo(0,0);
 if(id==='girando')ShowSound.play('spin',matchMedia('(prefers-reduced-motion: reduce)').matches?700:data.spinDuration);
 if(id==='categoria')ShowSound.play('category');
 if(id==='correcta')ShowSound.play('correct');
 if(id==='incorrecta')ShowSound.play('wrong');
 if(id==='tiempo')ShowSound.play('timeout');
 if(id==='correcta'&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const confetti=document.createElement('div');confetti.className='confetti';confetti.setAttribute('aria-hidden','true');confetti.innerHTML=Array.from({length:30},(_,i)=>`<i style="--x:${(i*37)%100}%;--delay:${(i%6)*.07}s;--turn:${i%2?'-':'+'}240deg;--drift:${(i%5-2)*60}px;--color:${['#ffd879','#fff3dc','#ffb29b'][i%3]}"></i>`).join('');stage.append(confetti);setTimeout(()=>confetti.remove(),2400);}
 if(id==='girando')timer=setTimeout(()=>go('categoria'),matchMedia('(prefers-reduced-motion: reduce)').matches?700:data.spinDuration+150);
 if(id==='categoria')timer=setTimeout(()=>go('pregunta'),data.categoryRevealDuration);
 if(['correcta','incorrecta','tiempo'].includes(id))timer=setTimeout(()=>go('ruleta'),data.resultDuration);
 if(id==='pregunta'){const duration=QuestionStore.get().seconds*1000;deadline=performance.now()+duration;
 let lastSecond=null;
 const tick=()=>{const left=Math.max(0,deadline-performance.now()),seconds=Math.ceil(left/1000);if(seconds>0&&seconds<=5&&seconds!==lastSecond)ShowSound.play('countdown');lastSecond=seconds;document.querySelector('#seconds').textContent=seconds;document.querySelector('#time-fill').style.transform=`scaleX(${left/duration})`;document.querySelector('.time-track').setAttribute('aria-valuenow',seconds);document.querySelector('.response-time').classList.toggle('urgent',seconds<=5);if(!left){clearInterval(countdown);answering=true;go('tiempo');}};tick();countdown=setInterval(tick,50);}}
 document.addEventListener('click',e=>{const answer=e.target.closest('[data-answer]');if(answer&&stage.dataset.screen==='pregunta'){if(answering)return;answering=true;clearInterval(countdown);stage.querySelectorAll('.answer').forEach(b=>b.disabled=true);go(performance.now()>=deadline?'tiempo':Number(answer.dataset.answer)===current.correct?'correcta':'incorrecta');return;}const b=e.target.closest('[data-go]');if(!b||b.disabled)return;if(b.dataset.go==='girando'){if(stage.dataset.screen==='ruleta')start();}else go(b.dataset.go);});
 window.addEventListener('hashchange',render);render();
})();
