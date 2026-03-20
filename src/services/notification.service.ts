import { notificationQueue } from "../config/queue";

export const sendNotification = async (payload: any) => {
  await notificationQueue.add("send-notification", payload);
};