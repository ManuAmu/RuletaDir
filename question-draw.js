// Persistent per-category shuffle bag. Question edits keep their stable identity.
window.QuestionDraw=(()=>{
 const key='bibliodera.draw.v1';let state={};
 try{const saved=JSON.parse(localStorage.getItem(key));if(saved&&typeof saved==='object'&&!Array.isArray(saved))state=saved;}catch{}
 function pick(questions,category){
  const all=questions.filter(q=>q.category===category);if(!all.length)return null;
  const old=state[category]||{},ids=new Set(all.map(q=>q.id));
  let seen=Array.isArray(old.seen)?old.seen.filter(id=>ids.has(id)):[];
  let available=all.filter(q=>!seen.includes(q.id));
  if(!available.length){seen=[];available=all.length>1?all.filter(q=>q.id!==old.last):all;}
  const selected=available[Math.floor(Math.random()*available.length)];
  state[category]={seen:seen.concat(selected.id),last:selected.id};
  try{localStorage.setItem(key,JSON.stringify(state));}catch{console.warn('No se pudo guardar el avance de las preguntas.');}
  return selected;
 }
 function category(questions,categories){
  const eligible=categories.map((c,index)=>({index,weight:c.weight??1})).filter(c=>c.weight>0&&(c.index>=4||questions.some(q=>q.category===c.index)));
  if(!eligible.length)return null;
  let value=Math.random()*eligible.reduce((sum,c)=>sum+c.weight,0);
  for(const c of eligible){value-=c.weight;if(value<0)return c.index;}
  return eligible[eligible.length-1].index;
 }
 return {pick,category};
})();
