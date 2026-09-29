// Local operator lock. Access lasts only while administering this page.
window.SettingsAccess=(()=>{
 let unlocked=false;
 const protectedRoutes=['configuracion','configuracion-preguntas','configuracion-loop','loop'];
 function guard(route){
  if(protectedRoutes.indexOf(route)===-1){unlocked=false;return false;}
  return !unlocked;
 }
 function render(stage,onUnlock){
  stage.innerHTML=`<section class="settings settings-access"><div class="settings-heading"><h1>Configuración</h1>${BiblioderaUI.backToGame()}</div><form class="access-card" id="access-form"><div class="access-lock" aria-hidden="true"><svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="16" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/></svg></div><h2>Acceso al equipo</h2><p>Ingresá la contraseña para continuar.</p><label for="access-password">Contraseña</label><input id="access-password" name="password" type="password" required autocomplete="off" autocapitalize="none" spellcheck="false" aria-describedby="access-error"><p id="access-error" class="access-error" role="alert"></p><button class="button" type="submit">Ingresar</button></form></section>`;
  const form=stage.querySelector('#access-form'),input=form.elements.password,error=stage.querySelector('#access-error');
  form.onsubmit=e=>{
   e.preventDefault();
   if(input.value!=='Absalon248'){
    error.textContent='Contraseña incorrecta. Intentá nuevamente.';
    input.setAttribute('aria-invalid','true');input.value='';input.focus();return;
   }
   unlocked=true;input.value='';form.querySelector('button').disabled=true;onUnlock();
  };
  input.oninput=()=>{error.textContent='';input.removeAttribute('aria-invalid');};
  stage.focus({preventScroll:true});window.scrollTo(0,0);
 }
 return {guard,render};
})();
