const C='lh-v3';
const ASSETS=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(ASSETS.map(a=>c.add(a).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET')return;
  if(u.origin!==location.origin&&u.hostname!=='cdnjs.cloudflare.com')return;
  // halaman utama: ambil versi terbaru dari hosting dulu (maks 3,5 detik), baru cadangan offline.
  // Jadi memperbarui aplikasi cukup ganti file di hosting, tanpa menaikkan nomor versi.
  if(e.request.mode==='navigate'||u.pathname.endsWith('/index.html')){
    const net=fetch(e.request).catch(()=>null);
    const wait=new Promise(r=>setTimeout(()=>r(null),3500));
    e.respondWith(Promise.race([net,wait]).then(async r=>{
      if(r&&r.ok){const cp=r.clone();caches.open(C).then(c=>c.put('./index.html',cp));return r}
      const h=await caches.match('./index.html');
      return h||(await net)||Response.error();
    }));
    return;
  }
  e.respondWith(caches.match(e.request).then(h=>{
    const net=fetch(e.request).then(r=>{if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp))}return r}).catch(()=>h);
    return h||net;
  }));
});
