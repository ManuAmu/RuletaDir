const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const code=fs.readFileSync('question-draw.js','utf8'),questions=JSON.parse(fs.readFileSync('preguntas-bibliodera.json')).questions;
let saved={};const storage={getItem:k=>saved[k]||null,setItem:(k,v)=>saved[k]=v};
function load(){const context={window:{},localStorage:storage,console};vm.runInNewContext(code,context);return context.window.QuestionDraw;}
let draw=load();
for(let cycle=0;cycle<20;cycle++){
 const rounds=[[],[],[],[]];
 for(let turn=0;turn<10;turn++)for(let category=0;category<4;category++){
  if(turn===5)draw=load(); // simulate app restart halfway through each cycle
  const before=JSON.parse(saved['bibliodera.draw.v1']||'{}')[category];
  const q=draw.pick(questions,category);assert(q&&q.category===category);
  if(turn===0&&before)assert.notEqual(q.id,before.last);
  rounds[category].push(q.id);
 }
 rounds.forEach(ids=>assert.equal(new Set(ids).size,10));
}
saved={};draw=load();const small=questions.filter(q=>q.category===0).slice(0,2);
const first=draw.pick(small,0);const extra={...small[0],id:'new-question'};
const next=[draw.pick([...small,extra],0).id,draw.pick([...small,extra],0).id];assert(!next.includes(first.id));assert(next.includes(extra.id));
const remaining=small.filter(q=>q.id!==first.id);assert.equal(draw.pick(remaining,0).id,remaining[0].id);assert.equal(draw.pick([],0),null);
saved={'bibliodera.draw.v1':'bad json'};assert(load().pick(questions,0));
console.log('PASS: 800 selections, no repeats per category/cycle, restarts, cycle boundaries, added/deleted questions, one/empty question, corrupt history');
const configContext={window:{},localStorage:{getItem:()=>null},console};vm.runInNewContext(fs.readFileSync('content.js','utf8').split('// Category identities')[0],configContext);
const configuredCats=configContext.window.BiblioderaContent.categories;
const cats=configuredCats.map(c=>({...c,cooldownRounds:0}));
const controlledMath=Object.create(Math);const context={window:{},localStorage:storage,console,Math:controlledMath};vm.runInNewContext(code,context);
const counts=[0,0,0,0,0,0];for(let i=0;i<10000;i++){controlledMath.random=()=>(i+.5)/10000;counts[context.window.QuestionDraw.category(questions,cats)]++;}
assert.deepEqual(counts,[2250,2250,2250,2250,500,500]);
for(let i=0;i<100;i++){controlledMath.random=()=>(i+.5)/100;assert.notEqual(context.window.QuestionDraw.category(questions.filter(q=>q.category!==2),cats),2);assert([4,5].includes(context.window.QuestionDraw.category([],cats)));}
console.log('PASS weighted draw:',counts,'; empty categories excluded');

// Questions 2 and 3 exclude the direct prize, retaining all other weights.
for(const answered of [1,2]){
 const continuation=[0,0,0,0,0,0];
 for(let i=0;i<9500;i++){
  controlledMath.random=()=>(i+.5)/9500;
  continuation[context.window.QuestionDraw.category(questions,cats,{allowPrize:answered===0})]++;
 }
 assert.deepEqual(continuation,[2250,2250,2250,2250,0,500]);
}
controlledMath.random=()=>.945;
assert.equal(context.window.QuestionDraw.category(questions,cats,{allowPrize:true}),4);
assert.notEqual(context.window.QuestionDraw.category(questions,cats,{allowPrize:false}),4);
console.log('PASS: prize excluded before questions 2/3, restored for a new match');

// A prize is followed by at least ten regular match starts, across reloads.
saved={};
function reloadControlled(){const c={window:{},localStorage:storage,console,Math:controlledMath};vm.runInNewContext(code,c);return c.window.QuestionDraw;}
let limited=reloadControlled();controlledMath.random=()=>.945;
assert.equal(limited.category(questions,configuredCats),4);
for(let i=0;i<10;i++){
 limited=reloadControlled();controlledMath.random=()=>.999;
 assert.equal(limited.category(questions,configuredCats),5);
 assert.equal(Number(saved['bibliodera.prize-cooldown.v1']),10-i);
 controlledMath.random=()=>0;
 limited.category(questions,configuredCats,{allowPrize:false});
 assert.equal(Number(saved['bibliodera.prize-cooldown.v1']),10-i);
 controlledMath.random=()=>.945;
 assert.notEqual(limited.category(questions,configuredCats),4);
 assert.equal(Number(saved['bibliodera.prize-cooldown.v1']),9-i);
}
assert.equal(reloadControlled().category(questions,configuredCats),4);
console.log('PASS: ten regular match starts between prizes; reloads, rerolls and later questions cannot bypass cooldown');
