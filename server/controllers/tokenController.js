const { default: Expo } = require("expo-server-sdk");
const Token = require("../models/Token");
const expo = new Expo();
const jwt = require("jsonwebtoken");
require("dotenv").config();

// API route to save FCM Token
exports.saveToken = async (req, res) => {
  const { tokenExpo, tokenUser } = req.body;
  try {
    // Save the token to MongoDB

    const tokens = await Token.findOne({ token: tokenExpo });
    if (tokens) {
      return res.status(200).send("Token already exist");
    } else {
      if (tokenUser) {
        const decoded = jwt.verify(tokenUser, process.env.JWT_SECRET_KEY);
        const newToken = new Token({ token: tokenExpo, user: decoded.id });
        await newToken.save();
      } else {
        const newToken = new Token({ token: tokenExpo, user: null });
        await newToken.save();
      }

      res.status(200).send("Token saved successfully");
      console.log("Token saved successfully");
    }
  } catch (error) {
    console.error("Error saving token:", error);
    res.status(500).send("Failed to save token");
  }
};

// API route to send push notification
exports.sendNotification = async (req, res) => {
  const { message, token } = req.body.params;
  try {
    // console.log("token-----", token);

    // // Fetch all stored tokens from MongoDB
    // const tokens = await Token.find({ token });
    // // Prepare push notifications payload for each token
    // let messages = [];
    // console.log("tokens+++", tokens);

    // for (let token of tokens) {
    //   if (Expo.isExpoPushToken(token.token)) {
    //     messages.push({
    //       to: token.token, // Expo push token
    //       sound: "default",
    //       body: message,
    //     });
    //   } else {
    //     console.log(`Invalid Expo push token: ${token.token}`);
    //   }
    // }

    // console.log("object", messages);

    // if (messages.length > 0) {
    //   // Send notifications through Expo's service
    //   const chunks = expo.chunkPushNotifications(messages);
    //   const tickets = [];

    //   for (let chunk of chunks) {
    //     try {
    //       const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
    //       tickets.push(...ticketChunk);
    //     } catch (error) {
    //       console.error(error);
    //     }
    //   }
    //   res.status(200).send("Notification sent successfully");
    // } else {
    //   res.status(400).send("No valid Expo tokens found");
    // }

    const tokens = await Token.find({ token });

    // Create the messages that you want to send to clients
    let messages = [];
    for (let pushToken of tokens) {
      // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

      // Check that all your push tokens appear to be valid Expo push tokens
      if (!Expo.isExpoPushToken(pushToken.token)) {
        console.error(`Push token ${pushToken.token} is not a valid Expo push token`);
        continue;
      }

      // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
      messages.push({
        to: pushToken.token,
        sound: "default",
        title: "Obavestenje",
        body: message,
        data: { withSome: "data" },
      });
    }

    // The Expo push notification service accepts batches of notifications so
    // that you don't need to send 1000 requests to send 1000 notifications. We
    // recommend you batch your notifications to reduce the number of requests
    // and to compress them (notifications with similar content will get
    // compressed).
    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    (async () => {
      // Send the chunks to the Expo push notification service. There are
      // different strategies you could use. A simple one is to send one chunk at a
      // time, which nicely spreads the load out over time:
      for (let chunk of chunks) {
        try {
          let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          console.log(ticketChunk);
          tickets.push(...ticketChunk);
          // NOTE: If a ticket contains an error code in ticket.details.error, you
          // must handle it appropriately. The error codes are listed in the Expo
          // documentation:
          // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
        } catch (error) {
          console.error(error);
        }
      }
    })();

    // Later, after the Expo push notification service has delivered the
    // notifications to Apple or Google (usually quickly, but allow the service
    // up to 30 minutes when under load), a "receipt" for each notification is
    // created. The receipts will be available for at least a day; stale receipts
    // are deleted.
    //
    // The ID of each receipt is sent back in the response "ticket" for each
    // notification. In summary, sending a notification produces a ticket, which
    // contains a receipt ID you later use to get the receipt.
    //
    // The receipts may contain error codes to which you must respond. In
    // particular, Apple or Google may block apps that continue to send
    // notifications to devices that have blocked notifications or have uninstalled
    // your app. Expo does not control this policy and sends back the feedback from
    // Apple and Google so you can handle it appropriately.
    let receiptIds = [];
    for (let ticket of tickets) {
      // NOTE: Not all tickets have IDs; for example, tickets for notifications
      // that could not be enqueued will have error information and no receipt ID.
      if (ticket.status === "ok") {
        receiptIds.push(ticket.id);
      }
    }

    let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
    async () => {
      // Like sending notifications, there are different strategies you could use
      // to retrieve batches of receipts from the Expo service.
      for (let chunk of receiptIdChunks) {
        try {
          let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
          console.log(receipts);

          // The receipts specify whether Apple or Google successfully received the
          // notification and information about an error, if one occurred.
          for (let receiptId in receipts) {
            let { status, message, details } = receipts[receiptId];
            if (status === "ok") {
              continue;
            } else if (status === "error") {
              console.error(
                `There was an error sending a notification: ${message}`
              );
              if (details && details.error) {
                // The error codes are listed in the Expo documentation:
                // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
                // You must handle the errors appropriately.
                console.error(`The error code is ${details.error}`);
              }
            }
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    res.status(200).send("Notification sent successfully");
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).send("Failed to send notification");
  }
};
