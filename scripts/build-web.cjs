const fs=require('node:fs'),path=require('node:path'),esbuild=require('esbuild'),postcss=require('postcss'),preset=require('postcss-preset-env');
const root=path.resolve(__dirname,'..'),out=path.join(root,'www');
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 fs.cpSync(path.join(root,'assets'),path.join(out,'assets'),{recursive:true});
 let html=fs.readFileSync(path.join(root,'index.html'),'utf8');
 html=html.replace('</head>','<link rel="stylesheet" href="android-compat.css"></head>').replace('<script src="content.js','<script src="android-compat.js"></script><script src="native-backup.js"></script><script src="content.js');
 for(const match of html.matchAll(/(?:src|href)="([^"?]+\.(?:js|css))(?:\?[^" ]*)?"/g)){
  const file=match[1];if(file.startsWith('assets/'))continue;
  let code=fs.readFileSync(path.join(root,file),'utf8');
  if(file==='native-backup.js')code=(await esbuild.build({entryPoints:[path.join(root,file)],bundle:true,write:false,target:'chrome60',format:'iife',charset:'utf8'})).outputFiles[0].text;
  else if(file.endsWith('.js'))code=(await esbuild.transform(code,{target:'chrome60',charset:'utf8'})).code;
  else{
   code=code.replace(/:has\(#stage\[data-screen\^=configuracion\]\)/g,'[data-admin="true"]').replace(/:has\(#stage\[data-screen=([^\]]+)\]\)/g,'[data-stage="$1"]').replace(/:has\(#stage(?:\[data-screen\])?\)/g,'[data-stage]');
   code=(await postcss([preset({browsers:'Chrome >= 60',stage:2,features:{'has-pseudo-class':false,'focus-visible-pseudo-class':false}})]).process(code,{from:undefined})).css;
  }
  fs.writeFileSync(path.join(out,file),code);
 }
 html=html.replace(/\?v=[a-f0-9]+/g,'');fs.writeFileSync(path.join(out,'index.html'),html);
 fs.copyFileSync(path.join(root,'preguntas-bibliodera.json'),path.join(out,'preguntas-bibliodera.json'));
 fs.copyFileSync(path.join(root,'webview-required.html'),path.join(out,'webview-required.html'));
 console.log('Web offline compilada para Chrome/WebView 60+. 40 preguntas; sin video.');
})().catch(e=>{console.error(e);process.exitCode=1});
