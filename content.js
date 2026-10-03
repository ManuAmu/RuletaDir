// Categorías visuales. Las preguntas y el tiempo se administran desde Configuración.
window.BiblioderaContent = {
  questionsPerMatch: 3,
  spinDuration: 3200,
  categoryRevealDuration: 2000,
  resultDuration: 4000,
  categories: [
    {label:'Universo Bibliodera', color:'#ffd879', icon:'libraryFridge', weight:22.5},
    {label:'Cultura Santiagueña', color:'#ffb29b', icon:'folkMusic', weight:22.5},
    {label:'Mitos y Leyendas', color:'#fff0ce', icon:'moon', weight:22.5},
    {label:'Iconos de Santiago', color:'#f69e88', icon:'culturalCenter', weight:22.5},
    {label:'Premio Sorpresa', color:'#eac9b1', icon:'gift', weight:5, cooldownRounds:10, fixed:true},
    {label:'Gira de nuevo', color:'#ffe4a7', icon:'rotate', weight:5, fixed:true}
  ],
};

// Category identities are stable indexes: renaming never moves stored questions.
window.CategoryStore=(()=>{
 const key='bibliodera.categories.v1',categories=BiblioderaContent.categories;
 function validate(names){if(!Array.isArray(names)||names.length!==4||names.some(n=>typeof n!=='string'||!n.trim()||n.trim().length>28))throw Error('Completá los cuatro nombres, con hasta 28 caracteres.');const clean=names.map(n=>n.trim());if(new Set([...clean,...categories.slice(4).map(c=>c.label)].map(n=>n.toLocaleLowerCase())).size!==6)throw Error('Cada categoría debe tener un nombre diferente.');return clean;}
 function apply(names){names.forEach((name,i)=>categories[i].label=name);}
 try{const saved=localStorage.getItem(key);if(saved)apply(validate(JSON.parse(saved)));}catch{}
 return {save(names){const clean=validate(names);try{localStorage.setItem(key,JSON.stringify(clean));}catch{throw Error('No se pudieron guardar las categorías. Revisá el espacio disponible en el equipo.');}apply(clean);}};
})();
