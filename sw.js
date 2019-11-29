const CACHE = "cf-cache-v0.1.4";
const offlinePage = "offline.html";

// Install stage: set up and open a new cache
self.addEventListener("install", function (event) {
  console.log("Install Event ...");

  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      console.log("Installed cache: ", CACHE);
      return cache.add(offlinePage);
    })
  );
});

self.addEventListener('activate', function(event) {
  // Deletes all caches not included in whitelist - 
  // ie, change in version number etc.
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (CACHE !== cacheName) {
            console.log("Deleted cache: ", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});


// If any fetch fails, 
self.addEventListener("fetch", function (event) {


  if ( event.request.url.indexOf( '/waterservices/' ) !== -1 ) {
      console.log('waterservices intercept...');
      return false;
  }  
    
  if (event.request.method !== "GET") return;
  
  event.respondWith(
    fetch(event.request).catch(function (error) {
      // validate request is for in-scope navigation
      if (
        event.request.destination !== "document" ||
        event.request.mode !== "navigate"
      ) {
        return;
      }
      
      console.error("service worker: offline " + error);
      // load offline page
      return caches.open(CACHE).then(function (cache) {
        return cache.match(offlinePage);
      });
    })
  );
});


// This is an event that can be fired from your page to tell the SW to update the offline page
self.addEventListener("refreshOffline", function () {
  const offlinePageRequest = new Request(offlinePage);

  return fetch(offlinePage).then(function (response) {
    return caches.open(CACHE).then(function (cache) {
      console.log("service worker: refreshOffline event " + response.url);
      return cache.put(offlinePageRequest, response);
    });
  });
});
