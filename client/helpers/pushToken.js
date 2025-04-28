import { registerForPushNotificationsAsync } from "@/utils/registerForPushNotificationsAsync";
import { post } from "../api/apiService";
import { getStorage } from "./../helpers/index";
export const pushTokenFunc = (tokenData) => {
  if (tokenData) {
    registerForPushNotificationsAsync().then((token) => saveFcmToken(token));
  }
};

const saveFcmToken = async (tokenExpo) => {


  const tokenUser = await getStorage();
  if (tokenUser) {
    try {
      const response = await post("/api/save-token", { tokenExpo, tokenUser });
      console.log("saveFcmToken+++",response)
      console.log("tokenExpo+++",tokenExpo)
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  }
};
