import React from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableHighlight,
  SafeAreaView,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { createOpenLink } from "react-native-open-maps";
import FlatButton from "@/shared-components/Button";
import AboutUsInfo from "@/app/components/home/AboutUsInfo";
import ListAboutUs from "@/app/components/home/ListAboutUs";
import OnboardingComponent from "@/components/OnboardingComponent";



import { MAIN_DATA } from "@/constants";
import { useNotification } from "@/context/NotificationContext";
import { ThemedText } from "@/components/ThemedText";

const yosemite = { latitude: 43.724943, longitude: 20.6952 };

export default function HomeScreen() {
  const navigation = useNavigation();
  const openYosemite = createOpenLink(yosemite);
  const openYosemiteZoomedOut = createOpenLink({ ...openYosemite, zoom: 300 });
  const { notification, expoPushToken, error } = useNotification();
  if (error) {
    return <ThemedText>Error: {error.message}</ThemedText>;
  }
  const nextPage = () => {
    navigation.navigate("(tabs)", { screen: "employers" });
  };
  console.log(JSON.stringify(notification, null, 2));

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
        <SafeAreaView style={{ flex: 1 }}>
        <ThemedText type="subtitle">Your push token:</ThemedText>
        <ThemedText>{expoPushToken}</ThemedText>
        <ThemedText type="subtitle">Latest notification:</ThemedText>
        <ThemedText>{notification?.request.content.title}</ThemedText>
        <ThemedText>
          {JSON.stringify(notification?.request.content.data, null, 2)}
        </ThemedText>
      </SafeAreaView>
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
  buttonga: {
    alignItems: "center",
    backgroundColor: "blue",
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
