const http=require('http'),fs=require('fs'),p=require('path');
const root=__dirname;
const mt={'.html':'text/html;charset=utf-8','.css':'text/css;charset=utf-8','.js':'text/javascript;charset=utf-8','.json':'application/json;charset=utf-8'};
http.createServer((q,s)=>{
  let f=decodeURIComponent(q.url.split('?')[0]);
  if(f.endsWith('/'))f+='index.html';
  const fp=p.join(root,f);
  fs.readFile(fp,(e,d)=>{ if(e){s.writeHead(404);return s.end('404 '+f);} s.writeHead(200,{'Content-Type':mt[p.extname(fp)]||'application/octet-stream'}); s.end(d); });
}).listen(5641,()=>console.log('http://127.0.0.1:5641'));
