if ('serviceWorker' in navigator) {
    // navigator in an object in JS that represents the information about the browser 
    navigator.serviceWorker.register('/sw.js') //async task and returns a promise.
    .then((reg)=> console.log('service worker registered', reg))
    .catch((err)=> console.log('service worker not registered', err))
}