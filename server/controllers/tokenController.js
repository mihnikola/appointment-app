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
    const decoded = jwt.verify(tokenUser, process.env.JWT_SECRET_KEY);
    const tokens = await Token.findOne({token: tokenExpo});
    if (tokens) {
       return res.status(200).send("Token already exist");

    } else {
      const newToken = new Token({ token: tokenExpo, user: decoded.id });
      await newToken.save();

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
    // Fetch all stored tokens from MongoDB
    const tokens = await Token.find({token});
    // Prepare push notifications payload for each token

    let messages = [];
    for (let token of tokens) {
      if (Expo.isExpoPushToken(token.token)) {
        messages.push({
          to: token.token, // Expo push token
          sound: "default",
          body: message,
        });
      } else {
        console.log(`Invalid Expo push token: ${token.token}`);
      }
    }
  

    if (messages.length > 0) {
      // Send notifications through Expo's service
      const chunks = expo.chunkPushNotifications(messages);
      const tickets = [];

      for (let chunk of chunks) {
        try {
          const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          tickets.push(...ticketChunk);
        } catch (error) {
          console.error(error);
        }
      }
      res.status(200).send("Notification sent successfully");
    } else {
      res.status(400).send("No valid Expo tokens found");
    }
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).send("Failed to send notification");
  }
};


