// src/types/notification.ts
export interface NotificationPayload {
  putInDrawer: boolean;
  patientId?: string | number;
  emails?: string[];
  taskId?: string;
  topic?: string | null;
  msg?: string;
  heading?: string;
}

export interface NotificationResult {
  success: boolean;
  messageId?: string;
  error?: any;
}// src/types/notification.ts
export interface NotificationPayload {
  putInDrawer: boolean;
  patientId?: string | number;
  emails?: string[];
  taskId?: string;
  topic?: string | null;
  msg?: string;
  heading?: string;
}

export interface NotificationResult {
  success: boolean;
  messageId?: string;
  error?: any;
}