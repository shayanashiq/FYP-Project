// services/cronService.js
import cron from "node-cron";
import NotificationController from "./emailController.mjs";

let cronJobStarted = false;

export function startNotificationCron() {
  if (cronJobStarted) {
    console.log("Cron job is already running.");
    return;
  }

  cron.schedule(
    // "* * * * *",
    "0 */8 * * *",
    async () => {
      console.log("Running notification check:", new Date().toISOString());
      await NotificationController.processNotifications();
    },
    {
      scheduled: true,
      timezone: "UTC",
    },
  );

  cronJobStarted = true;
  console.log("Notification cron job started");
}

