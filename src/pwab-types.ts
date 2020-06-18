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
