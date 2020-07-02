export const vanilla = `
// Add these functions to prompt the user to subscribe to the pwabuilder push notification server using the pwabuilder.
async function subscribeUser() {
  try {
    const vapidPublicKey = ""; // get public key here
    var registration = await navigator.serviceWorker.register("pwabuilder-sw.js", {
      scope: "./"
    });

    var subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      return;
    }

    const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey
    });

    const response = await fetch(pushServiceUrl + '?action=subscribe', {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        subscription: JSON.stringify(subscription),
        publicKey: vapidPublicKey
      })
    });

    // handle response after registration here

  } catch(e) {
    // handle error here
  }
}

// Utility function for browser interoperability
function urlBase64ToUint8Array(base64String) {
  var padding = '='.repeat((4 - base64String.length % 4) % 4);
  var base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// omit if you want to control when you prompt the user to subscribe
subscribeUser();
`;

export const react = vanilla;

export const angular = `<script>
  angular
</script>`;

export const vue = vanilla;

export const landingScript = `
// Add this below content to your HTML page inside a <script type="module"></script> tag, or add the js file to your page at the very top to register service worker

import 'https://cdn.jsdelivr.net/npm/@pwabuilder/pwaupdate';

const el = document.createElement('pwa-update');
document.body.appendChild(el);
`;
