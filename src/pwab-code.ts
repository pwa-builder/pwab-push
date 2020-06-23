export const vanilla = `<script>
  var publicKey = "the cryptographic hash emailed from above!";
  var privateKey = "";

  // subscribe (does not use)
  async function subscribe() {
    var registration = await navigator.serviceWorker.register(
      "pwabuilder-sw.js",
      {
        scope: "./",
      }
    );

    var subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      alert("You are already subscribed.");
      return;
    }

    const vapidPublicKey = document.getElementById("publicKeyText").value;
    const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey,
    });

    const response = await fetch(pushServiceUrl + "?action=subscribe", {
      method: "post",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        subscription: JSON.stringify(subscription),
        publicKey: document.getElementById("publicKeyText").value,
      }),
    });

    var data = await response.text();
    showResponse("subscribe", data);
  }

  // unsubscribe
  async function unsubscribe() {
    var registration = await navigator.serviceWorker.register(
      "pwabuilder-sw.js",
      {
        scope: "./",
      }
    );

    var subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      alert("You are not subscribed.");
      return;
    }

    await subscription.unsubscribe();

    const response = await fetch(pushServiceUrl + "?action=unsubscribe", {
      method: "post",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        subscription: JSON.stringify(subscription),
        publicKey: document.getElementById("publicKeyText").value,
      }),
    });

    var data = await response.text();
    showResponse("unsubscribe", data);
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



  // send notification
  var notification = {
    notification: {
      title: "PWA Web Push Notification",
      body: "This will be the body text for the notification.",
      icon:
        "https://www.elkhornservice.com/wp-content/uploads/Windows-10-logo-e1502132803317.png",
    },
  };

  var userEmail = "user@example.com";
  var privateKey = "";
  var publicKey = "";

  async function sendNotification() {
    const response = await fetch(pushServiceUrl + "?action=sendnotification", {
      method: "post",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        privateKey: privateKey,
        publicKey: publicKey,
        subject: userEmail,
        notification: JSON.stringify(notification),
      }),
    });

    var data = await response.text();
    showResponse("sendnotifcation", data);
}

</script>`;

export const react = `<script>
  react
</script>`;

export const angular = `<script>
  angular
</script>`;

export const vue = `<script>
  vue
</script>`;
