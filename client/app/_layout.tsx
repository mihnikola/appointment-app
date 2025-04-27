// /app/layout/RootLayout.tsx
import { ReservationProvider } from "@/context/ReservationContext";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK";

TaskManager.defineTask(
  BACKGROUND_NOTIFICATION_TASK,
  ({ data, error, executionInfo }) => {
    console.log("✅ Received a notification in the background!", {
      data,
      error,
      executionInfo,
    });
    // Do something with the notification data
  }
);


Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }



  return (
      <ReservationProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
            <Stack.Screen
              name="components/login/index"
              options={{ title: "", headerShown: false }}
            />
            <Stack.Screen
              name="components/register/index"
              options={{ title: "", headerShown: false }}
            />
            <Stack.Screen
              name="components/services/index"
              options={{ title: "" }}
            />
            <Stack.Screen
              name="components/reservation/index"
              options={{ title: "" }}
            />
            <Stack.Screen
              name="components/reservation/datereservation"
              options={{ title: "", headerShown: false }}
            />
            <Stack.Screen
              name="components/reservation/makereservation"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="components/reservation/reservationdetails"
              options={{ title: "", headerShown: false }}
            />
            <Stack.Screen
              name="components/infoapp/userprofile"
              options={{ title: "" }}
            />
            <Stack.Screen
              name="components/infoapp/aboutapplication"
              options={{ title: "" }}
            />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </ReservationProvider>
  );
}
