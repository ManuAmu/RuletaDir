const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),http=require('node:http'),path=require('node:path');
const root=path.resolve(__dirname,'../www');
const server=http.createServer((req,res)=>{let file=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(file===root+path.sep)file=path.join(root,'index.html');if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}fs.readFile(file,(e,b)=>{if(e){res.writeHead(404).end();return;}res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.html')?'text/html':'application/octet-stream');res.end(b);});});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const url=`http://127.0.0.1:${server.address().port}/`;const b=await chromium.launch(process.env.TEST_CHANNEL?{channel:process.env.TEST_CHANNEL}:{channel:'msedge'});try{
 for(const legacy of [false,true]){
  const c=await b.newContext({hasTouch:true,viewport:{width:1366,height:768},reducedMotion:'reduce'}),p=await c.newPage(),errors=[];
  p.setDefaultTimeout(15000);p.setDefaultNavigationTimeout(15000);console.log('Starting mode',legacy);
  p.on('pageerror',e=>errors.push(e.message));
  await c.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
  if(legacy)await p.addInitScript(()=>{const supports=CSS.supports.bind(CSS);CSS.supports=(a,b)=>(b==='1cqh'||a==='background')?false:supports(a,b);window.structuredClone=undefined;crypto.randomUUID=undefined;Blob.prototype.text=undefined;});
  console.log('Navigating');await p.goto(url);console.log('Loaded');assert.equal(await p.evaluate(()=>QuestionStore.get().questions.length),40);
  assert.deepEqual(await p.evaluate(()=>[0,1,2,3].map(c=>QuestionStore.get().questions.filter(q=>q.category===c).length)),[10,10,10,10]);
  async function touch(selector){await p.locator(selector).scrollIntoViewIfNeeded();const box=await p.locator(selector).boundingBox();assert(box);assert(box.width>=44&&box.height>=44);await p.touchscreen.tap(box.x+box.width/2,box.y+box.height/2);}
  console.log('Opening settings');await touch('a[aria-label="Configuración"]');await p.waitForSelector('#access-form');await p.locator('#access-password').fill('wrong');await touch('#access-form button');assert(await p.locator('#access-error').innerText());await p.locator('#access-password').fill('Absalon248');await touch('#access-form button');await p.waitForSelector('.settings-choices');await touch('a[href="#configuracion-preguntas"]');await p.waitForSelector('#question-form');assert.equal(await p.locator('#question-count').innerText(),'(40)');
  await p.locator('[name=question]').fill('Pregunta táctil de prueba');for(let i=0;i<4;i++)await p.locator(`[name=option${i}]`).fill('Opción '+i);await touch('#question-form button[type=submit]');assert.equal(await p.locator('#question-count').innerText(),'(41)');await p.reload();assert.equal(await p.evaluate(()=>QuestionStore.get().questions.length),41);await p.goto(url+'#ruleta');
  console.log('Testing rounds');for(const [category,screen] of [[0,'pregunta'],[4,'premio'],[5,'ruleta']]){
   await p.evaluate(category=>{BiblioderaContent.categoryRevealDuration=20;BiblioderaContent.resultDuration=1000;QuestionStore.save({...QuestionStore.get(),questions:BiblioderaQuestions.questions.filter(q=>q.category===0)});Math.random=()=>category===0?0:category===4?.5:.99;},category);
   await p.waitForSelector('.hub-action:not([disabled])');await touch('.hub-action');await p.waitForSelector(`[data-screen=${screen}]`);
   if(screen==='pregunta'){await touch('.answer:nth-child(3)');await p.waitForSelector('[data-screen=correcta]');}
   await p.waitForSelector('[data-screen=ruleta]');
  }
  await p.reload();await p.evaluate(()=>{QuestionStore.save({...QuestionStore.get(),seconds:5,questions:[BiblioderaQuestions.questions[19]]});BiblioderaContent.categoryRevealDuration=10;BiblioderaContent.resultDuration=1000;Math.random=()=>0;});await touch('.hub-action');await p.waitForSelector('.question');fs.mkdirSync('test-results',{recursive:true});await p.screenshot({path:`test-results/${legacy?'legacy':'modern'}-question.png`});await p.waitForSelector('[data-screen=tiempo]');await p.waitForSelector('[data-screen=ruleta]');assert.deepEqual(errors,[]);console.log('PASS',legacy?'legacy fallbacks':'modern','touch, password, 40 questions, persistence, normal/prize/re-spin/timeout, offline requests');await c.close();
 }
}finally{await b.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);server.close();process.exitCode=1});

