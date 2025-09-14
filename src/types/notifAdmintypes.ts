export interface Notification {
  id: string;
  type: "FEEDBACK" | "TASK" | "PROGRAM" | "SYSTEM";
  message: string;
  read: boolean;
  userId: string;
  referenceId?: string;
  createdAt: string;
}

export interface NotificationPagination {
  notifications: Notification[];
  total: number;
  page: number;
  totalPages: number;
}