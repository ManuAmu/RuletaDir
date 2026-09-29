window.BiblioderaUI = (() => {
 const escape = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const button = (text, target, secondary=false) => `<button class="button ${secondary?'secondary':''}" data-go="${target}">${text}<span aria-hidden="true">↗</span></button>`;
 const eyebrow = text => `<div class="eyebrow">${text}</div>`;
 function wheel(spinning=false, interactive=false) {
   const cats=BiblioderaContent.categories, slice=360/cats.length;
   const stops=cats.map((c,i)=>`${c.color} ${i*slice}deg ${(i+1)*slice}deg`).join(',');
   return `<div class="wheel-wrap" aria-label="Ruleta de categorías${spinning?', girando':''}"><div class="pointer" aria-hidden="true"></div><div class="wheel ${spinning?'spinning':''}" style="--segments:conic-gradient(from -${slice/2}deg,${stops});--spin-duration:${BiblioderaContent.spinDuration}ms;--end-rotation:${BiblioderaContent.wheelRotation||1440}deg">${cats.map((c,i)=>`<div class="wedge-label" style="--angle:${i*slice}deg"><strong>${escape(c.mark)}</strong><span>${escape(c.label)}</span></div>`).join('')}</div>${interactive ? `<button class="hub hub-action" data-go="girando" aria-label="${spinning?'Ruleta girando':'Girar ruleta'}" ${spinning?'disabled':''}><span aria-hidden="true">↻</span><strong>${spinning?'GIRANDO':'GIRAR'}</strong></button>` : '<div class="hub" aria-hidden="true">LA<br><b>B</b></div>'}<div class="wheel-foot" aria-hidden="true"></div></div>`;
 }
 const burst = (text, variant='') => `<div class="burst ${variant}" aria-hidden="true"><span>${text}</span></div>`;
 return {escape,button,eyebrow,wheel,burst};
})();
