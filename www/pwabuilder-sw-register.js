// This is the "Offline page" service worker

// Add this below content to your HTML page inside a <script type="module"></script> tag, or add the js file to your page at the very top to register service worker

// Check compatibility for the browser we're running this in
if ("serviceWorker" in navigator) {
  if (navigator.serviceWorker.controller) {
    console.log("[PWA Builder] active service worker found, no need to register");
  } else {
    // Register the service worker
    navigator.serviceWorker
      .register("pwabuilder-sw.js", {
        scope: "./"
      })
      .then(function (reg) {
        console.log("[PWA Builder] Service worker has been registered for scope: " + reg.scope);
      });
  }
}

// Add this below content to your HTML page, or add the js file to your page at the very top to register and use Push Notifications

const pushServiceUrl = 'http://localhost:7071/api/HttpTrigger';
//const pushServiceUrl = 'https://webpush-azurefunction.azurewebsites.net/api/HttpTrigger';

// async function getVapidKeys() {
//   const response = await fetch(pushServiceUrl + '?action=vapidkeys', {
//     method: 'get',
//     headers: {
//       'Content-type': 'application/json'
//     }
//   });

//   var data = await response.text();
//   var result = JSON.parse(data);
//   document.getElementById("privateKeyText").value = result.res.keys.privateKey;
//   document.getElementById("publicKeyText").value = result.res.keys.publicKey;

//   return result.res.keys;
// }

// async function registerVapidKeys(url, privateKey, publicKey, subject) {
//   const response = await fetch(pushServiceUrl + '?action=register', {
//     method: 'post',
//     headers: {
//       'Content-type': 'application/json'
//     },
//     body: JSON.stringify({
//       privateKey,
//       publicKey,
//       subject,
//     })
//   });

//   var data = await response.text();
//   showResponse('registerVapidKeys', data);
// }

// async function emailVapidKeys(privateKey, publicKey, email) {
//   var message = 'mailto:';
//   message += email;
//   message += '?subject=PWA Builder VAPID Key Info'
//   message += '&body='
//   message += 'Here is the VAPID key you genererated for your PWA app at https://www.pwabuilder.com\n\n'
//   message += 'privateKey: ' + privateKey + '\n';
//   message += 'publicKey: ' + publicKey + '\n';
//   message += 'subject: ' + email + '\n';
//   window.open(encodeURI(message));
// }

// async function unregisterVapidKeys(privateKey, publicKey) {
//   var result = confirm("Warning: this action will delete all push subscriptions subscribed to your app.");
//   if (result === false) {
//     return;
//   }

//   const response = await fetch(pushServiceUrl + '?action=unregister', {
//     method: 'post',
//     headers: {
//       'Content-type': 'application/json'
//     },
//     body: JSON.stringify({
//       privateKey,
//       publicKey,
//     })
//   });

//   var data = await response.text();
//   showResponse('unregisterVapidKeys', data);
// }

// async function subscribe(publicKey) {
//   var registration = await navigator.serviceWorker.register("pwabuilder-sw.js", {
//     scope: "./"
//   });

//   var subscription = await registration.pushManager.getSubscription();

//   if (subscription) {
//     alert("You are already subscribed.");
//     return;
//   }

//   const vapidPublicKey = publicKey;
//   const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
//   subscription = await registration.pushManager.subscribe({
//     userVisibleOnly: true,
//     applicationServerKey: convertedVapidKey
//   });


//   const response = await fetch(pushServiceUrl + '?action=subscribe', {
//     method: 'post',
//     headers: {
//       'Content-type': 'application/json'
//     },
//     body: JSON.stringify({
//       subscription: JSON.stringify(subscription),
//       publicKey,
//     })
//   });

//   var data = await response.text();
//   showResponse('subscribe', data);
// }

// async function unsubscribe(publicKey) {
//   var registration = await navigator.serviceWorker.register("pwabuilder-sw.js", {
//     scope: "./"
//   });

//   var subscription = await registration.pushManager.getSubscription();
//   if (!subscription) {
//     alert("You are not subscribed.");
//     return;
//   }

//   await subscription.unsubscribe();

//   const response = await fetch(pushServiceUrl + '?action=unsubscribe', {
//     method: 'post',
//     headers: {
//       'Content-type': 'application/json'
//     },
//     body: JSON.stringify({
//       subscription: JSON.stringify(subscription),
//       publicKey,
//     })
//   });

//   var data = await response.text();
//   showResponse('unsubscribe', data);
// }

// async function sendNotification(privateKey, publicKey, subject, body) {
//   const notification = {
//     "notification": {
//       "title": "PWA Web Push Notification",
//       "body": "This will be the body text for the notification.",
//       "icon": "https://www.elkhornservice.com/wp-content/uploads/Windows-10-logo-e1502132803317.png"
//     }
//   }

//   const response = await fetch(pushServiceUrl + '?action=sendnotification', {
//     method: 'post',
//     headers: {
//       'Content-type': 'application/json'
//     },
//     body: JSON.stringify({
//       privateKey,
//       publicKey,
//       subject,
//       notification: JSON.stringify({
//         ...notification,
//         body,
//       })
//     })
//   });

//   var data = await response.text();
//   //showResponse('sendnotifcation', data);
// }

// Utility function for browser interoperability
// function urlBase64ToUint8Array(base64String) {
//   var padding = '='.repeat((4 - base64String.length % 4) % 4);
//   var base64 = (base64String + padding)
//     .replace(/\-/g, '+')
//     .replace(/_/g, '/');

//   var rawData = window.atob(base64);
//   var outputArray = new Uint8Array(rawData.length);

//   for (var i = 0; i < rawData.length; ++i) {
//     outputArray[i] = rawData.charCodeAt(i);
//   }
//   return outputArray;
// }

// display result from Push Notification service in an alert
// function showResponse(method, response) {
//   var result = JSON.parse(response);
//   if (result.status !== 200) {
//     alert(method + ':' + JSON.stringify(result.status) + ' ' + JSON.stringify(result.res.errorMessage));
//   }
//   else {
//     alert(method + ':' + JSON.stringify(result.status) + ' ' + JSON.stringify(result.res.status));
//   }
// }
