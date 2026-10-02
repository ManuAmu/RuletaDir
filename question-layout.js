// Fit the real question content into the stage before its entry animation.
window.QuestionLayout=(()=>{
 const stage=document.querySelector('#stage');let frame=0;
 function fit(){
  if(stage.dataset.screen!=='pregunta')return;
  const q=stage.querySelector('.question'),title=q?.querySelector('h1'),answers=q?[...q.querySelectorAll('.answer')]:[];
  if(!title||!answers.length)return;
  q.classList.remove('question-compact','question-tight');
  title.style.removeProperty('font-size');answers.forEach(b=>b.style.removeProperty('font-size'));
  const headingSize=parseFloat(getComputedStyle(title).fontSize),answerSize=parseFloat(getComputedStyle(answers[0]).fontSize);
  const room=stage.clientHeight-8;
  const fits=()=>q.scrollHeight<=room&&q.scrollWidth<=stage.clientWidth&&answers.every(b=>b.scrollWidth<=b.clientWidth+1);
  if(fits())return;
  q.classList.add('question-compact');
  if(fits())return;
  let headingFloor=20,answerFloor=14;
  const apply=scale=>{title.style.fontSize=Math.max(headingFloor,headingSize*scale)+'px';answers.forEach(b=>b.style.fontSize=Math.max(answerFloor,answerSize*scale)+'px');};
  apply(.45);
  if(!fits())q.classList.add('question-tight');
  if(!fits()){headingFloor=16;answerFloor=12;apply(.45);}
  // Last resort for maximum-length, unbroken strings on very small screens.
  if(!fits()){headingFloor=12;answerFloor=10;apply(.3);}
  let low=.3,high=1;
  for(let i=0;i<9;i++){const mid=(low+high)/2;apply(mid);if(fits())low=mid;else high=mid;}
  apply(low);
 }
 function schedule(){cancelAnimationFrame(frame);frame=requestAnimationFrame(fit);}
 new ResizeObserver(schedule).observe(stage);
 document.fonts?.ready.then(schedule);
 window.addEventListener('resize',schedule);
 return {fit};
})();
