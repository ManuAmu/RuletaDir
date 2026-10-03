// Pantallas y temporizadores; banco administrado en settings.js.
(() => {
 const {eyebrow,wheel,burst,escape}=BiblioderaUI,data=BiblioderaContent,stage=document.querySelector('#stage');
 const motion=BiblioderaMotion;
 let revision=0,starting=false,transitioning=false;
 let timer,countdown,deadline=0,answering=false,current=null;
 let results=[],currentAnswered=false;
 const total=()=>data.questionsPerMatch;
 const complete=()=>results.includes(false)||results.length===total();
 const wins=()=>results.filter(Boolean).length;
 const steps=()=>`<ol class="match-steps" aria-label="Recorrido de la partida">${Array.from({length:total()},(_,i)=>{const state=i<results.length?(results[i]?'hit':'miss'):complete()?'blocked':i===results.length?'current':'pending';return `<li class="match-step is-${state}" ${state==='current'?'aria-current="step"':''}><span class="step-symbol" aria-hidden="true">${state==='hit'?'✓':state==='miss'?'×':i+1}</span><span class="step-label">${state==='hit'?'Correcta':state==='miss'?'Incorrecta':state==='current'?'Tu turno':state==='blocked'?'Sin jugar':'Pendiente'}</span><span class="sr-only">Pregunta ${i+1}</span></li>`;}).join('')}</ol>`;
 const progress=(home=false)=>`<div class="match-progress ${home?'match-home':'match-bar'}" role="status" aria-label="Pregunta ${Math.min(results.length+1,total())} de ${total()}, ${wins()} correctas"><div class="match-heading"><div>${home?'':`<span class="match-kicker">TU PARTIDA <span class="match-category">${escape(category().label)}</span></span>`}<strong>${home?(results.length===2?'¡A una de ganar!':results.length?'¡Vamos por la segunda!':'3 aciertos. <em>¡Y ganás!</em>'):`Pregunta ${results.length+1} <span class="match-total">/ ${total()}</span>`}</strong></div><span class="match-score"><b>${wins()}</b><span>de ${total()}<br>aciertos</span></span></div>${steps()}${home?`<div class="match-invitation"><span class="invitation-arrow" aria-hidden="true">↗</span> ${results.length?'Tocá GIRAR para seguir':'Tocá GIRAR para empezar'}<small>Para ganar, acertá las tres sin equivocarte.</small></div>`:''}</div>`;
 const resultVisual=()=>`<div class="match-finish ${complete()?(wins()===total()?'finish-win':'finish-loss'):'finish-next'}"><div class="burst result-medal ${complete()&&wins()!==total()?'miss':'success'}"><span>${complete()&&wins()!==total()?'×':complete()?'★':'✓'}</span></div><strong class="finish-score">${wins()} <span>/ ${total()}</span></strong><div class="finish-caption">${complete()?(wins()===total()?'DESAFÍO COMPLETADO':'PARTIDA TERMINADA'):`${total()-wins()} ${total()-wins()===1?'ACIERTO MÁS':'ACIERTOS MÁS'} PARA GANAR`}</div>${steps()}</div>`;
 const resultTitle=correct=>complete()?(wins()===total()?'¡Ganaste!':'Esta vez<br><em>perdiste.</em>'):(correct?'¡Correcta!':'Respuesta<br><em>incorrecta.</em>');
 const resultInfo=()=>results.includes(false)?`Partida terminada en la pregunta ${results.length} de ${total()}.`:complete()?`${wins()} de ${total()} respuestas correctas.`:`${results.length} de ${total()} respondidas · ${wins()} correctas.`;
 const nextInfo=()=>complete()?'Partida terminada. Volvemos a la ruleta…':'Volvemos a la ruleta para la siguiente pregunta…';
 const category=()=>data.categories[current?.category??0];
 const split=(l,r,cls='')=>`<section class="split ${cls}"><div class="copy">${l}</div><div class="visual">${r}</div></section>`;
 const screens={
 ruleta:()=>split(`<h1 class="title lettering-title"><span class="brand-art"><img src="assets/bibliodera-lettering.png" alt="La Bibliodera" width="1080" height="1080"></span></h1>${progress(true)}${QuestionStore.get().questions.length?'':'<p class="setup-note">Antes de jugar, cargá las preguntas en <a href="#configuracion">Configuración</a>.</p>'}`,`<div class="sticker">¡DALE UNA VUELTA!</div>${wheel(false,true)}<span class="spark spark-one" aria-hidden="true">✳</span>`,'cover'),
 girando:()=>split(`${eyebrow('RULETA EN MOVIMIENTO')}<h1>¿Qué<br> te va a<br> <em>tocar?</em></h1><p role="status">La ruleta está girando…</p>`,wheel(true,true)),
 categoria:()=>`<section class="center category-reveal" style="--category-color:${category().color}">${eyebrow('TE TOCÓ')}<h1>${escape(category().label)}</h1><p>${current.category===5?'¡Tenés otra vuelta!':current.category===4?'¡Hay una sorpresa para vos!':'Preparate para responder.'}</p></section>`,
 pregunta:()=>`<section class="question"><div class="question-meta">${progress()}</div><h1>${escape(current.text)}</h1><div class="response-time"><div class="time-label"><span>Tiempo para responder</span><strong><span id="seconds">${QuestionStore.get().seconds}</span> s</strong></div><div class="time-track" role="progressbar" aria-label="Tiempo restante" aria-valuemin="0" aria-valuemax="${QuestionStore.get().seconds}" aria-valuenow="${QuestionStore.get().seconds}"><div id="time-fill"></div></div></div><div class="answers">${current.options.map((s,i)=>`<button class="answer" data-answer="${i}"><span>${'ABCD'[i]}</span>${escape(s)}</button>`).join('')}</div></section>`,
 premio:()=>split(`${eyebrow('PREMIO SORPRESA')}<h1>¡Ganaste<br>un premio!</h1><p>Acercate al equipo de La Bibliodera<br>para recibir tu sorpresa.</p><p class="demo-note">Volvemos a la ruleta en un momento…</p>`,`${burst('★','success')}<div class="visual-caption">¡DISFRUTALO!</div>`),
 correcta:()=>split(`${eyebrow(complete()?'DESAFÍO COMPLETADO':'¡UN PASO MÁS!')}<h1>${resultTitle(true)}</h1><p>${complete()?'Tres respuestas. Tres aciertos.<br>¡El desafío es tuyo!':wins()===2?'¡Ya tenés dos aciertos!<br>La próxima puede ser la victoria.':'Primer acierto conseguido.<br>Seguí así: quedan dos.'}</p><p class="demo-note">${nextInfo()}</p>`,resultVisual(),'match-result'),
 incorrecta:()=>split(`${eyebrow('FIN DE LA PARTIDA')}<h1>${resultTitle(false)}</h1><p>${resultInfo()}</p><div class="answer-note">La respuesta correcta era:<br><strong>${escape(current.options[current.correct])}</strong></div><p class="demo-note">${nextInfo()}</p>`,resultVisual(),'match-result'),
 tiempo:()=>split(`${eyebrow('SE TERMINÓ EL TIEMPO')}<h1>${resultTitle(false)}</h1><p>${resultInfo()}<br>Probá de nuevo en la próxima partida.</p><p class="demo-note">${nextInfo()}</p>`,resultVisual(),'match-result')

 };
 function stop(){VideoLoop.stop();ShowSound.stop();clearTimeout(timer);clearInterval(countdown);deadline=0;answering=false;}
 function go(id){if(location.hash==='#'+id)render();else location.hash=id;}
 function finishAnswer(kind){if(currentAnswered)return;currentAnswered=true;answering=true;clearInterval(countdown);results.push(kind==='correcta');stage.querySelectorAll('.answer').forEach(b=>b.disabled=true);go(kind);}
 function start(){if(starting||transitioning)return;starting=true;currentAnswered=false;if(complete())results=[];stage.querySelector('.hub-action').disabled=true;ShowSound.unlock();const questions=QuestionStore.get().questions.filter(q=>q.category<4);
 const selected=QuestionDraw.category(questions,data.categories,{allowPrize:results.length===0});
 if(selected>=4){current={category:selected,special:true};}else{current=QuestionDraw.pick(questions,selected);}
 data.wheelRotation=1440-current.category*(360/data.categories.length);go('girando');}
 async function render(){const turn=++revision;stop();let id=location.hash.slice(1)||'ruleta';
 if(id.startsWith('configuracion')||id==='loop'){results=[];current=null;currentAnswered=false;}
 if(id==='ruleta'&&complete()){results=[];current=null;}
 if(id==='pregunta'&&currentAnswered){go('ruleta');return;}
 const locked=SettingsAccess.guard(id);if(locked)id='configuracion-acceso';
 const saved=motion.capture(id);motion.stop();transitioning=true;stage.inert=true;await motion.exit(id);if(turn!==revision)return;motion.stop();stage.inert=false;transitioning=false;starting=false;
 if(locked){stage.dataset.screen=id;document.title='Acceso | La Bibliodera';SettingsAccess.render(stage,render);motion.enter(id,saved);return;}
 if(id==='loop'){stage.dataset.screen=id;document.title='Loop | La Bibliodera';VideoLoop.play(stage);return;}
 if(['configuracion','configuracion-preguntas','configuracion-loop'].includes(id)){stage.dataset.screen=id;SettingsUI.render(stage,id==='configuracion-loop'?'loop':id==='configuracion-preguntas'?'preguntas':'menu');document.title='Configuración | LA BIBLIODERA';motion.enter(id,saved);return;}
 if(!screens[id]||(id!=='ruleta'&&!current)||(current?.special&&['pregunta','correcta','incorrecta','tiempo'].includes(id))){go('ruleta');return;}
 stage.innerHTML=screens[id]();stage.dataset.screen=id;stage.dataset.outcome=(id==='correcta'&&complete()&&wins()===total())||id==='premio'?'victory':'';document.title='LA BIBLIODERA';stage.focus({preventScroll:true});window.scrollTo(0,0);
 if(id==='pregunta')QuestionLayout.fit();
 motion.enter(id==='correcta'&&complete()&&wins()!==total()?'incorrecta':id,saved);
 if(id==='girando'){ShowSound.play('spin');motion.spin(data.wheelRotation,data.spinDuration,()=>{if(turn===revision)go('categoria');});}
 if(id==='categoria')ShowSound.play('category');
 if(id==='correcta')ShowSound.play(complete()?(wins()===total()?'victory':'defeat'):'correct');
 if(id==='premio')ShowSound.play('victory');
 if(id==='incorrecta'||id==='tiempo')ShowSound.play('defeat');
 if(id==='categoria')timer=setTimeout(()=>go(current.category===4?'premio':current.category===5?'ruleta':'pregunta'),data.categoryRevealDuration);
 if(['correcta','incorrecta','tiempo','premio'].includes(id))timer=setTimeout(()=>go('ruleta'),data.resultDuration);
 if(id==='pregunta'){const duration=QuestionStore.get().seconds*1000;deadline=performance.now()+duration;
 let lastSecond=null;
 const tick=()=>{const left=Math.max(0,deadline-performance.now()),seconds=Math.ceil(left/1000);if(seconds>0&&seconds<=5&&seconds!==lastSecond)ShowSound.play('countdown');lastSecond=seconds;document.querySelector('#seconds').textContent=seconds;document.querySelector('#time-fill').style.transform=`scaleX(${left/duration})`;document.querySelector('.time-track').setAttribute('aria-valuenow',seconds);document.querySelector('.response-time').classList.toggle('urgent',seconds<=5);if(!left){finishAnswer('tiempo');}};tick();countdown=setInterval(tick,50);}}
 document.addEventListener('click',e=>{const answer=e.target.closest('[data-answer]');if(answer&&stage.dataset.screen==='pregunta'){if(answering||transitioning)return;finishAnswer(performance.now()>=deadline?'tiempo':Number(answer.dataset.answer)===current.correct?'correcta':'incorrecta');return;}const b=e.target.closest('[data-go]');if(!b||b.disabled)return;if(b.dataset.go==='girando'){if(stage.dataset.screen==='ruleta')start();}else go(b.dataset.go);});
 // Suppress the context menu without interfering with normal taps or form editing.
 document.addEventListener('contextmenu',e=>e.preventDefault());
 window.addEventListener('hashchange',render);render();
})();
