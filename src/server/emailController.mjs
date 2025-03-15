import { PrismaClient } from "@prisma/client";
import NotificationSend from "../lib/notificationEmailTemplate.mjs"; 
const prisma = new PrismaClient();

class NotificationController {
  static serializeData(data) {
    if (typeof data === "bigint") {
      return data.toString();
    }
    if (Array.isArray(data)) {
      return data.map(NotificationController.serializeData);
    }
    if (typeof data === "object" && data !== null) {
      return Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          NotificationController.serializeData(value),
        ])
      );
    }
    return data;
  }

  static async processNotifications() {
    try {
      const currentUTCDate = new Date();
      const sevenHoursAgo = new Date(currentUTCDate.getTime() - 1 * 60 * 60 * 1000);

      console.log(
        "Starting notification check at UTC:",
        currentUTCDate.toISOString()
      );

      // First, get all eligible users in a transaction to prevent race conditions
      const incompleteUsers = await prisma.$transaction(async (tx) => {
        // Find eligible users
        const users = await tx.user.findMany({
          where: {
            isProfileComplete: false,
            isEmailSent: false,
            // createdAt: {
          //   lte: sevenHoursAgo, // Only fetch users created 8+ hours ago
          // },
            email: {
              contains: "buildmeapp.io",
            },
          },
          select: {
            id: true,
            email: true,
            createdAt: true,
            role: true,
          },
        });

        // Immediately mark these users as processed to prevent duplicate emails
        if (users.length > 0) {
          await tx.user.updateMany({
            where: {
              id: {
                in: users.map(user => user.id)
              }
            },
            data: {
              isEmailSent: true
            }
          });
        }

        return users;
      });

      if (incompleteUsers.length === 0) {
        console.log("No incomplete profiles found or all have received emails.");
        return {
          success: true,
          timestamp: currentUTCDate.toISOString(),
        };
      }

      // Send emails after marking users as processed
      const notifications = await Promise.all(
        incompleteUsers.map(async (user) => {
          try {
            const signInUrl = `https://app.avahealth.ai`;
            await NotificationSend.sendNotificationEmail(
              user.id,
              user.email,
              signInUrl,
              user.role
            );

            return {
              userId: user.id,
              email: user.email,
              timestamp: new Date().toISOString(),
              status: 'success'
            };
          } catch (error) {
            console.error(`Failed to send email to ${user.email}:`, error);
            
            // If email fails, mark the user as not processed
            await prisma.user.update({
              where: { id: user.id },
              data: { isEmailSent: false },
            });

            return {
              userId: user.id,
              email: user.email,
              timestamp: new Date().toISOString(),
              status: 'failed',
              error: error.message
            };
          }
        })
      );

      const successfulNotifications = notifications.filter(n => n.status === 'success');
      const failedNotifications = notifications.filter(n => n.status === 'failed');

      console.log("Notifications processed:", {
        totalUsers: incompleteUsers.length,
        successful: successfulNotifications.length,
        failed: failedNotifications.length
      });

      return {
        success: true,
        timestamp: currentUTCDate.toISOString(),
        results: {
          total: incompleteUsers.length,
          successful: successfulNotifications.length,
          failed: failedNotifications.length
        }
      };
    } catch (error) {
      console.error("Error processing notifications:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      };
    }
  }
}

export default NotificationController;