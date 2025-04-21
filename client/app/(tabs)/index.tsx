import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableHighlight,
} from "react-native";
import * as Notifications from "expo-notifications";
import {
  getExpoPushTokenAsync,
  requestPermissionsAsync,
} from "expo-notifications";
import { useNavigation } from "@react-navigation/native";
import { createOpenLink } from "react-native-open-maps";
import FlatButton from "@/shared-components/Button";
import AboutUsInfo from "@/app/components/home/AboutUsInfo";
import ListAboutUs from "@/app/components/home/ListAboutUs";
import OnboardingComponent from "@/components/OnboardingComponent";
import { getStorage } from "@/helpers";
import axios from "axios";
import { MAIN_DATA } from "@/constants";

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

const yosemite = { latitude: 43.724943, longitude: 20.6952 };

export default function HomeScreen() {
  const navigation = useNavigation();
  const openYosemite = createOpenLink(yosemite);
  const openYosemiteZoomedOut = createOpenLink({ ...openYosemite, zoom: 300 });

  const nextPage = () => {
    navigation.navigate("(tabs)", { screen: "employers" });
  };
  const [notification, setNotification] = useState(false);

  const getPushToken = async () => {
    // Request permission for notifications
    const { status } = await requestPermissionsAsync();
    if (status === "granted") {
      // Get the Expo Push Token (which is equivalent to FCM Token in this case)
      const token = await getExpoPushTokenAsync();
      // Optionally, send this token to your backend (Node.js)
      sendTokenToServer(token.data);
    }
  };
  useEffect(() => {
    getPushToken();
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
  const sendTokenToServer = async (data) => {
    try {
      await axios
        .post(`${process.env.EXPO_PUBLIC_API_URL}/api/save-token`, {
          tokenExpo: data,
          tokenUser:null,
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
    <ScrollView style={styles.container}>
      <Image
        source={require("@/assets/images/logoImage.png")}
        style={styles.reactLogo}
      />

      <View style={styles.contentBtn}>
        <FlatButton text="Book" onPress={nextPage} />
      </View>
      <AboutUsInfo />
      <View style={styles.content}>
        <ListAboutUs />
      </View>
      <View style={styles.reviewContent}>
        <Text style={styles.reviewCapture}> {MAIN_DATA.review} </Text>
        <OnboardingComponent />
      </View>

      <View style={styles.content}>
        <Text style={styles.reviewCapture}>{MAIN_DATA.contact}</Text>
        <Text style={styles.text}>{MAIN_DATA.workDays}</Text>
        <Text style={styles.text}>{MAIN_DATA.workSaturday}</Text>
        <Text style={styles.text}>{MAIN_DATA.sunday}</Text>
      </View>

      <View style={styles.mapContainer}>
        <Text style={styles.mapCapture}> Location </Text>
        <TouchableHighlight onPress={openYosemiteZoomedOut}>
          <Image
            source={require("../../assets/images/mapimage.jpg")}
            style={styles.mapImage}
          />
        </TouchableHighlight>
      </View>
      
   

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  buttonga:{
    alignItems: 'center',
    backgroundColor: 'blue',
    padding: 10,

  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    backgroundColor: "white",
    color: "black",
  },
  mapImage: {
    width: 400,
    height: 200,
  },
  mapContainer: {
    flex: 3,
  },
  map: {
    width: 500,
    height: 200,
    marginBottom: 20,
    marginTop: 10,
  },
  reactLogo: {
    height: 300,
    width: 320,
    margin: "auto",
    marginTop: 40,
  },
  reviewContent: {
    margin: 0,
  },
  mapCapture: {
    color: "#ffffff",
    fontSize: 40,
    marginBottom: 10,
    marginTop: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  text: {
    fontSize: 20,
    color: "#ffff",
    margin: 5,
  },
  reviewCapture: {
    color: "#ffffff",
    fontSize: 40,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  aboutUs: {
    flexGrow: 1,
  },
  item: {
    backgroundColor: "#f9c2ff",
    color: "#ffff",
  },
  itemText: {
    backgroundColor: "#f9c2ff",
    color: "#ffff",
  },
  content: {
    flexGrow: 2,
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
    backgroundColor: "black",
  },
  contentBtn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#000000",
  },
  container: {
    flex: 1,
  },
});
