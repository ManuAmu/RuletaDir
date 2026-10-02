// Event-screen zoom controls. Browser toolbar zoom remains outside page control.
(()=>{
 document.addEventListener('wheel',e=>{if(e.ctrlKey||e.metaKey)e.preventDefault();},{passive:false});
 document.addEventListener('keydown',e=>{
  // Keep Ctrl/Cmd+0 available to restore the browser to 100%.
  if((e.ctrlKey||e.metaKey)&&(['+','=','-','_'].includes(e.key)||['NumpadAdd','NumpadSubtract'].includes(e.code)))e.preventDefault();
 });
 document.addEventListener('touchmove',e=>{if(e.touches.length>1)e.preventDefault();},{passive:false});
 ['gesturestart','gesturechange'].forEach(type=>document.addEventListener(type,e=>e.preventDefault(),{passive:false}));
})();
