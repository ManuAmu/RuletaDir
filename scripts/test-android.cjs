// Run against a DEBUG APK on the API 24 emulator, after forwarding its DevTools socket to 9223.
const fs=require('node:fs'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const adb=process.env.ADB||'adb';
(async()=>{
 const pages=await(await fetch('http://127.0.0.1:9223/json')).json();const ws=new WebSocket(pages.find(p=>p.url.startsWith('https://localhost')).webSocketDebuggerUrl);
 await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j;});let seq=0;const pending=new Map(),errors=[];
 ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&pending.has(m.id)){const [r,j]=pending.get(m.id);pending.delete(m.id);m.error?j(Error(JSON.stringify(m.error))):r(m.result);}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails);};
 const send=(method,params={})=>new Promise((r,j)=>{const id=++seq;pending.set(id,[r,j]);ws.send(JSON.stringify({id,method,params}));});
 const run=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
 const delay=ms=>new Promise(r=>setTimeout(r,ms));
 const wait=async expression=>{for(let i=0;i<100;i++){if(await run(expression))return;await delay(100);}throw Error('Timeout: '+expression);};
 const tap=async selector=>{const pos=await run(`(function(){var e=document.querySelector(${JSON.stringify(selector)});if(document.querySelector('#stage').dataset.screen.indexOf('configuracion')===0)e.scrollIntoView({block:'center'});var r=e.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2,w:r.width,h:r.height};})()`);assert(pos.w>=44&&pos.h>=44);execFileSync(adb,['shell','input','tap',String(Math.round(pos.x)),String(Math.round(pos.y))]);};
 const snap=async name=>{fs.mkdirSync('test-results',{recursive:true});execFileSync(adb,['shell','screencap','-p','/sdcard/bibliodera-test.png']);execFileSync(adb,['pull','/sdcard/bibliodera-test.png','test-results/'+name+'.png']);};
 try{
  await send('Runtime.enable');await run("location.hash='ruleta'");await wait("!!document.querySelector('.hub-action')");
  console.log('DEVICE',await run('navigator.userAgent'));assert.equal(await run('QuestionStore.get().questions.length'),40);
  await snap('android7-ruleta');
  await tap('a[aria-label="Configuración"]');await wait("!!document.querySelector('#access-password')");
  await run("document.querySelector('#access-password').value='Absalon248'");await tap('#access-form button');await wait("!!document.querySelector('.settings-choices')");await tap('a[href="#configuracion-preguntas"]');await wait("!!document.querySelector('#question-form')");assert.equal(await run("document.querySelector('#question-count').textContent"),'(40)');await snap('android7-preguntas');
  await tap('#export-bank');await delay(1500);execFileSync(adb,['shell','uiautomator','dump','/sdcard/bibliodera-ui.xml']);const picker=execFileSync(adb,['shell','cat','/sdcard/bibliodera-ui.xml'],{encoding:'utf8'});assert(picker.includes('com.android.documentsui'));execFileSync(adb,['shell','input','keyevent','4']);await delay(500);console.log('PASS native JSON export file picker');
  await tap('.back-to-game');await wait("!!document.querySelector('.hub-action')");
  // Test-only deterministic parameters; reload restores the production configuration.
  await run('BiblioderaContent.spinDuration=1200;BiblioderaContent.categoryRevealDuration=100;BiblioderaContent.resultDuration=1200;Math.random=function(){return 0;}');
  await tap('.hub-action');await wait("document.querySelector('#stage').dataset.screen==='pregunta'");await delay(1000);await snap('android7-pregunta');
  await tap('.answer:nth-child(2)');await wait("document.querySelector('#stage').dataset.screen==='correcta'");await wait("document.querySelector('#stage').dataset.screen==='ruleta'");
  await tap('.hub-action');await wait("document.querySelector('#stage').dataset.screen==='pregunta'");await tap('.answer:nth-child(1)');await wait("document.querySelector('#stage').dataset.screen==='incorrecta'");await wait("document.querySelector('#stage').dataset.screen==='ruleta'");
  await run('Math.random=function(){return .72;}');await tap('.hub-action');await wait("document.querySelector('#stage').dataset.screen==='premio'");await wait("document.querySelector('#stage').dataset.screen==='ruleta'");
  await run('Math.random=function(){return .99;}');await tap('.hub-action');await wait("document.querySelector('#stage').dataset.screen==='categoria'");await wait("document.querySelector('#stage').dataset.screen==='ruleta'");
  await run("location.reload()");await delay(1500);await wait("!!document.querySelector('.hub-action')");assert.equal(await run('QuestionStore.get().questions.length'),40);assert.deepEqual(errors,[]);
  console.log('PASS API24 WebView69: 40 questions, native adb touch, password, correct/incorrect/prize/re-spin, reload persistence, no JS exceptions');
 }finally{ws.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
