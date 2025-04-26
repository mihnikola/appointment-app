import { useEffect, useState } from "react";
import NotificationComponent from "../components/notification/NotificationComponent";
import Loader from "@/components/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import SignForm from "../components/SignForm/SignForm";
import InfoComponent from "@/shared-components/InfoComponent";
import { useNotification } from "@/context/NotificationContext";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Platform, SafeAreaView, StatusBar } from "react-native";

export default function TabTwoScreen() {
  const { expoPushToken, notification, error } = useNotification();

  if (error) {
    return <ThemedText>Error: {error.message}</ThemedText>;
  }

  const [isLoading, setIsLoading] = useState(false);

  const [token, setToken] = useState<string | null>(null);

  const isFocused = useIsFocused(); // useIsFocused hook
  // Function to check for token in AsyncStorage
  const checkToken = async () => {
    setIsLoading(true);
    try {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        console.log("Token exists:", storedToken);
      } else {
        setToken(null);
        console.log("No token found");
      }
    } catch (error) {
      console.error("Error reading token:", error);
    }
  };
  // useEffect that runs when the screen is focused
  useEffect(() => {
    if (isFocused) {
      // Check token only when this screen/tab is focused
      checkToken();
      setIsLoading(false);
    }
  }, [isFocused]); // Dependency on isFocused to trigger the effect

  // return (
  //   <>
  //     {!isLoading && token && <NotificationComponent />}
  //     {!isLoading && !token && (
  //       <>
  //         <SignForm />
  //         <InfoComponent title="Sign in to see your notifications" />
  //       </>
  //     )}
  //     {isLoading && <Loader />}
  //   </>
  // );
  return (
    <ThemedView
      style={{
        flex: 1,
        padding: 10,
        paddingTop: Platform.OS == "android" ? StatusBar.currentHeight : 10,
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ThemedText type="subtitle">Your push token:</ThemedText>
        <ThemedText>{expoPushToken}</ThemedText>
        <ThemedText type="subtitle">Latest Notification:</ThemedText>
        <ThemedText>{notification?.request.content.title}</ThemedText>
        <ThemedText>
          {JSON.stringify(notification?.request.content.data, null, 2)}
        </ThemedText>
      </SafeAreaView>
    </ThemedView>
  );
}
