type StatusCode = number;

export interface PwabVapidResponse {
  status: StatusCode;
  keys: {
    publicKey: string;
    privateKey: string;
  };
}

export interface PwabNotificationResponse {}
