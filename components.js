window.BiblioderaUI = (() => {
 const escape = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const button = (text, target, secondary=false) => `<button class="button ${secondary?'secondary':''}" data-go="${target}">${text}<span aria-hidden="true">↗</span></button>`;
 const eyebrow = text => `<div class="eyebrow">${text}</div>`;
 const icons={
 libraryFridge:'<rect x="2" y="2" width="12" height="20" rx="2"/><path d="m14 4 7-2v20l-7-2M4 8h8M4 14h8M4 20h8M16 9l3-.5M16 15l3 .5"/><g stroke-width="1.1"><path d="M4.5 4.5V7m2-2.5V7m2-3 1 3m2-2.5V7M4.5 10v3m2-3v3m2-3v3m2-3 1 3M4.5 16v3m2-3v3m2-2h3m-3 2h3M16.5 5.5V8m2-3v3M16.5 11v3m2-3v3M16.5 17v2m2-2v2"/></g>',
 book:'<path d="M12 5C9 3 5 3 2 4v15c3-1 7-1 10 1 3-2 7-2 10-1V4c-3-1-7-1-10 1Zm0 0v15"/>',
 folkMusic:'<ellipse cx="6" cy="12" rx="4.5" ry="2"/><path d="M1.5 12v8c0 2.7 9 2.7 9 0v-8M3 13.5l1.5 7 3-7 1.5 7M2 6l7 4"/><path d="m18 3 3 1-3.1 9.1c2.5 1.8 2.2 5.2-.2 7-2.4 1.8-5.4 1-6.3-1.2-.6-1.6.2-3.4 1.8-4.3-.6-1.8.4-3.7 2.6-3.9L18 3Zm.2 2-1-3 4 1-1 3"/><circle cx="15.8" cy="16.5" r="1.2" stroke-width="1.1"/>',
 moon:'<path d="M20 15A8 8 0 0 1 9 4 8 8 0 1 0 20 15Z"/><path d="m18 2 1 3 3 1-3 1-1 3-1-3-3-1 3-1Z"/>',
 culturalCenter:'<path d="M1 22h22M2 22V12h6m8 0h6v10M8 22V5l4-3 4 3v17M12 2V1M2 16h20"/><circle cx="12" cy="7" r="2" stroke-width="1.2"/><path d="M12 6v1l1 .5M10 13v-2a2 2 0 0 1 4 0v2M4 22v-3a1 1 0 0 1 2 0v3m4 0v-3a2 2 0 0 1 4 0v3m4 0v-3a1 1 0 0 1 2 0v3" stroke-width="1.2"/>',
 gift:'<path d="M3 8h18v4H3zM5 12v9h14v-9M12 8v13"/><path d="M12 8H8a3 3 0 1 1 3-3l1 3Zm0 0h4a3 3 0 1 0-3-3l-1 3Z"/>',
 rotate:'<path d="M20 7v5h-5M20 12a8 8 0 1 0-2 6"/>'
 };
 const categoryIcon=c=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[c.icon]||icons.book}</svg>`;
 function wheel(spinning=false, interactive=false) {
   const cats=BiblioderaContent.categories, slice=360/cats.length;
   const stops=cats.map((c,i)=>`${c.color} ${i*slice}deg ${(i+1)*slice}deg`).join(',');
   return `<div class="wheel-wrap" aria-label="Ruleta de categorías${spinning?', girando':''}"><div class="pointer" aria-hidden="true"></div><div class="wheel ${spinning?'spinning':''}" style="--segments:conic-gradient(from -${slice/2}deg,${stops});--spin-duration:${BiblioderaContent.spinDuration}ms;--end-rotation:${BiblioderaContent.wheelRotation||1440}deg">${cats.map((c,i)=>`<div class="wedge-label" style="--angle:${i*slice}deg"><strong>${categoryIcon(c)}</strong><span>${escape(c.label)}</span></div>`).join('')}</div>${interactive ? `<button class="hub hub-action" data-go="girando" aria-label="${spinning?'Ruleta girando':'Girar ruleta'}" ${spinning?'disabled':''}><strong>GIRAR</strong></button>` : '<div class="hub" aria-hidden="true">LA<br><b>B</b></div>'}<div class="wheel-foot" aria-hidden="true"></div></div>`;
 }
 const backToGame=()=>`<a class="back-to-game" href="#ruleta"><span class="back-to-game-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m10 5-7 7 7 7M3 12h18"/></svg></span><span>Volver al juego</span></a>`;
 const burst = (text, variant='') => `<div class="burst ${variant}" aria-hidden="true"><span>${text}</span></div>`;
 return {escape,button,eyebrow,wheel,burst,categoryIcon,backToGame};
})();
