const CACHE_NAME='emulsion-cache-v4';
const ASSETS=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];

self.addEventListener('install',(e)=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate',(e)=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE_NAME?caches.delete(k):null)))
  );
  self.clients.claim();
});

self.addEventListener('fetch',(e)=>{
  e.respondWith(
    caches.match(e.request).then(res=>res||fetch(e.request).then(net=>{
      const copy=net.clone();
      caches.open(CACHE_NAME).then(c=>c.put(e.request,copy));
      return net;
    }).catch(()=>caches.match('./index.html')))
  );
});
