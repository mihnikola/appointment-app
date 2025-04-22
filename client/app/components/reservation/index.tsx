import { View, Text, StyleSheet, Image, Button, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import ReservationContext from "@/context/ReservationContext";
import ButtonComponent from "@/shared-components/Button";
import Details from "@/shared-components/Details";
import Note from "@/shared-components/Note";
import { addMinutesToTime, convertDate, getStorage } from "@/helpers";
import useSubmitReservation from "./hooks/useSubmitReservation";
import axios from "axios";
import * as Notifications from "expo-notifications";
import {
  getExpoPushTokenAsync,
  requestPermissionsAsync,
} from "expo-notifications";


// Handle background notifications using Expo's background handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

Notifications.addNotificationReceivedListener((notification) => {
  console.log("Background notification received:", notification);
  // Handle the background notification
});


const Reservation = () => {
  const { reservation } = useContext(ReservationContext)!;
  const { employer, service, timeData, dateReservation } = reservation;
  const { submitReservationHandler, isLoading, error } = useSubmitReservation();

  const [notification, setNotification] = useState(false);

  const getPushToken = async (tokenUser) => {
    // Request permission for notifications
    const { status } = await requestPermissionsAsync();
    if (status === "granted") {
      // Get the Expo Push Token (which is equivalent to FCM Token in this case)
      const token = await getExpoPushTokenAsync();
      // Optionally, send this token to your backend (Node.js)
      sendTokenToServer(token.data,tokenUser);
    }
  };
  useEffect(() => {
    getStorage().then((res) => {
      if(res){
        getPushToken(res);
      }
    })
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("addNotificationReceivedListener++++", notification);
        setNotification(notification);
      }
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        // console.log("addNotificationResponseReceivedListener++++",response.notification.request.content.body);
        setNotification(response);
        // navigation.navigate("components/services/menuservices");
      });

    // Clean up the listeners when the component is unmounted

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);




   // Send the push token to your server (Node.js backend) ok
   const sendTokenToServer = async (data,userToken) => {
    try {
      await axios
        .post(`${process.env.EXPO_PUBLIC_API_URL}/api/save-token`, {
          tokenExpo: data,
          tokenUser:userToken,
        })
        .then((res) => {
          console.log(res);
          if (res.status === 404) {
            console.log("Prc vec ima");
          }
        });
    } catch (error) {
      console.error("Error sending token to server:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/coverImage.jpg")}
        style={styles.coverImage}
      />
      <View style={styles.coverContent}>
        <Text style={styles.timeData}>
          {timeData?.value} -{" "}
          {addMinutesToTime(timeData?.value, service?.duration)}
        </Text>
        <Text style={styles.dateData}>
          {convertDate(dateReservation?.dateString)}
        </Text>
        <Text style={styles.dateData}>Frizerski Studio - Gentleman</Text>
      </View>
      <View style={{ display: "flex", padding: 10 }}>
        <View>
          {reservation && <Details data={reservation} />}
          <Note />

          <View style={styles.reservation}>
            {isLoading ? (
             <TouchableOpacity style={styles.button}> 
             <Text style={styles.buttonText}>
                 Booking...
             </Text>
          </TouchableOpacity >
            ) : (
              <ButtonComponent
                text="Book"
                onPress={submitReservationHandler}
              />
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default Reservation;

const styles = StyleSheet.create({
  button: {
    display: "flex",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 30,
    backgroundColor: "#ffffff",
    borderRadius: 20,
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: 16,
    textAlign: "center",
  },
  reservation: {
    display: "flex",
    flexDirection: "column",
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  timeData: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  position: {
    fontSize: 16,
    color: "grey",
    fontStyle: "italic",
    padding: 12,
  },
  coverContent: {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    top: 80,
    left: 50,
    padding: 20,
  },
  dateData: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  data: {
    display: "flex",
    flexDirection: "column",
  },
  container: {
    flex: 1,
  },
  coverImage: {
    width: "100%",
    height: 200,
    opacity: 0.2,
  },
  capture: {
    fontSize: 32,
    color: "grey",
    fontWeight: "900",
    textAlign: "center",
    fontStyle: "italic",
    position: "absolute",
    top: 150,
    left: 50,
  },
});
