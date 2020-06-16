const staticCacheName = 'site-static-v8';
const dynamicCacheName = 'site-dynamic-v8';
const assets = [
  '/',
  '/index.html',
  '/js/app.js',
  '/js/ui.js',
  '/js/materialize.min.js',
  '/css/styles.css',
  '/css/materialize.min.css',
  '/img/dish.png',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  '/pages/fallback.html'
]

self.addEventListener('install', (event) => {
  console.log('service worker has been installed', event)

  event.waitUntil(
    caches.open(staticCacheName).then(cache => {
      console.log('caching shell assets');
      cache.addAll(assets);
    })   //asyc task and again returns a promise
  )

  //this function can be used to add assets to the cache.
  // common assets that can be used when offline.
})




//activate service worker
self.addEventListener('activate', (event) => {
  console.log('service worker has been activated', event)
  event.waitUntil(
    caches.keys().then((keys) => {
      console.log(keys)  //keys have the names of 2 different caches (staticCacheName)..
      return Promise.all(keys // to delete the old version of caches.  2nd promise resolved
        .filter(keys => keys !== staticCacheName && keys !== dynamicCacheName)
        .map(keys => caches.delete(keys))  //this will return an array of promises.  1st promise resolved..
      )
    })
  )
  console.log("deleted")

})


//cache size limit function
const limitCacheSize = (name, size) => {
  console.log('limit size initiated')
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size))
      }
    })
  })
}



//fetch event
//intercepting requests
self.addEventListener('fetch', evt => {
  //check to avoid this if the request it to google database api
  if (evt.request.url.indexOf('firestore.googleapis.com') === -1) {
    evt.respondWith(
      caches.match(evt.request).then(cacheRes => {
        return cacheRes || fetch(evt.request).then(fetchRes => {
          return caches.open(dynamicCacheName).then(cache => {
            cache.put(evt.request.url, fetchRes.clone());
            limitCacheSize(dynamicCacheName, 15)
            return fetchRes;
          })
        });
      }).catch(() => {
        if (evt.request.url.indexOf('.html') > -1) { //can also be done for different resource type.
          return caches.match('/pages/fallback.html');
        }

      })
    );
  }


  console.log('fetch event', evt);


});