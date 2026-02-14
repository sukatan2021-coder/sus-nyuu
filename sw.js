/* PWA Service Worker - 2ヶ月版（予測入力・平日一括ボタン） */
const CACHE_NAME = "nyuuka-2mo-20260214012406";
const CORE = ["./","./index.html","./manifest.json","./icon-192.png","./icon-512.png","./sw.js"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((c)=>c.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys)=>Promise.all(keys.map(k=>k!==CACHE_NAME?caches.delete(k):null))));
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.mode === "navigate" || (req.headers.get("accept")||"").includes("text/html")) {
    event.respondWith(
      fetch(req).then((res)=>{
        const copy = res.clone();
        caches.open(CACHE_NAME).then((c)=>c.put("./index.html", copy));
        return res;
      }).catch(()=>caches.match("./index.html"))
    );
    return;
  }
  event.respondWith(caches.match(req).then((c)=>c||fetch(req)));
});
