// This is the "Offline page" service worker

const CACHE = "pwabuilder-page";

// Install stage sets up the offline page in the cache and opens a new cache
self.addEventListener("install", function (event) {
  console.log("installing the service worker")

  event.waitUntil(
    caches.open(CACHE).then(function (cache) { })
  );
});

// // If any fetch fails, it will show the offline page.
// self.addEventListener("fetch", function (event) {
//   console.log("fetch");

//   if (event.request.method !== "GET") return;

//   event.respondWith(
//     // fetch(event.request)
//     //   .then(function (res) {
//     //     // if (!res || res.status !== 200 || res.type !== 'basic') {
//     //     //   return res;
//     //     // }

//     //     // var toCache = res.clone();
//     //     // caches.open(CACHE)
//     //     //   .then(function (cache) {
//     //     //     cache.put(evt.request, toCache);
//     //     //   });

//     //     return res;
//     //   })
//     // .catch(function (error) {
//     // The following validates that the request was for a navigation to a new document
//     // if (
//     //   event.request.destination !== "document" ||
//     //   event.request.mode !== "navigate"
//     // ) {
//     //   return;
//     // }

//     // console.error("[PWA Builder] Network request Failed. Serving offline page " + error);
//     // return caches.open(CACHE).then(function (cache) {
//     //   return cache.match(offlineFallbackPage);
//     // });
//     // })
//   );
});

// This is an event that can be fired from your page to tell the SW to update the offline page
// self.addEventListener("refreshOffline", function () {
//   const offlinePageRequest = new Request(offlineFallbackPage);

//   return fetch(offlineFallbackPage).then(function (response) {
//     return caches.open(CACHE).then(function (cache) {
//       console.log("[PWA Builder] Offline page updated from refreshOffline event: " + response.url);
//       return cache.put(offlinePageRequest, response);
//     });
//   });
// });

// This is an event that can be fired by the browser to tell the SW to display a web push notification
// Note: The user must have first agreed to subscribe to notifications
self.addEventListener('push', function (event) {
  const data = event.data.json(); // will throw an error if the event data is a string... which is valid output too.
  event.waitUntil(
    registration.showNotification(data.notification.title, data.notification)
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(function (clientList) {
        if (clientList.length > 0) {
          let client = clientList[0];
          for (let i = 0; i < clientList.length; i++) {
            if (clientList[i].focused) {
              client = clientList[i];
            }
          }
          return client.focus();
        }
        return clients.openWindow('/');
      })
  );
})

self.addEventListener('pushsubscriptionchange', function (event) {
  event.waitUntil(
    Promise.all([
      Promise.resolve(event.oldSubscription ? deleteSubscription(event.oldSubscription) : true),
      Promise.resolve(event.newSubscription ? event.newSubscription : subscribePush(registration))
        .then(function (sub) { return saveSubscription(sub); })
    ])
  );
});
