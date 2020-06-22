type StatusCode = number;

export interface PwabVapidResponse {
  status: StatusCode;
  keys: VapidKeys;
}

export interface VapidKeys {
  publicKey: string;
  privateKey: string;
}

export interface PwabNotificationResponse {}

export const NotificationOptions = {
  title: "PWABuilder Test Notification",
  body: "This is the mock body text",
  icon: "https://pwabuilder.com/Images/assets/newIcons/icon_60.png",
};
