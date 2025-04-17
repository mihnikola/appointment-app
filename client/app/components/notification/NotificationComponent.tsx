import { View, Text, StyleSheet, ScrollView, Image } from 'react-native'
import React, {  useEffect, useState } from 'react'
import NotificationActive from './NotificationActive';
import NotificationNon from './NotificationNon';
import axios from 'axios';
import Storage from 'expo-storage';
import { getStorage } from '@/helpers';


const NotificationComponent = () => {
  const [check, setCheck] = useState(true);
  const [notifications, setNotification] = useState([]);
    const checkUnreadNotifications = () => {
      setCheck(true);
    };
    const checkReadNotifications = () => {
      setCheck(false);
    }
    useEffect(() =>{
      getNotificationData();
    },[])

    const getNotificationData = async() => {
      const tokenData = getStorage();
      try {
        await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/notifications`,{
          params:{
            token: tokenData,
            check

          },
        headers: { Authorization: `${tokenData}` },
        }).then((res) => {
          if(res.status === 200){
            console.log("object",res.data);
          }
        })
        
      } catch (error) {
        console.log("getNotificationData",error)
        
      }
    }
  
  return (
     <ScrollView style={styles.container}>
       <Image
         source={require("@/assets/images/coverImageNotification.jpg")}
         style={styles.coverImage}
       />
       <View style={styles.containerCapture}>
         <Text
           style={[styles.capture, !check && styles.active]}
           onPress={checkUnreadNotifications}
         >
           Nepročitane
         </Text>
         <Text
           style={[styles.capture, check && styles.active]}
           onPress={checkReadNotifications}
         >
           Pročitane
         </Text>
       </View>
       <View style={styles.greyLine} />
 
       <View style={{ display: "flex" }}>
         {!check && notifications ? (
           <NotificationActive data={notifications} />
         ) : (
           <NotificationNon />
         )}
       </View>
     </ScrollView>
  )
}

export default NotificationComponent;
const styles = StyleSheet.create({
  active: {
    color: "#fff",
    fontWeight: "bold",
  },
  container: {
    flex: 1,
  },
  containerCapture: {
    flexDirection: 'row',
    gap:20,
    alignSelf: "center",    
    position: "absolute",
    top: 240,
  },
  coverImage: {
    width: "100%",
    height: 300,
    opacity: 0.2,
  },
  capture: {
    fontSize: 32,
    color: "grey",
    fontWeight: "900",
    textAlign: "center",
    fontStyle: "italic",
  },
  greyLine: {
    width: "100%",
    height: 4, // Adjust the height for the thickness of the line
    backgroundColor: "grey", // Set the line color to white
    marginTop: -1, // Optional: You can adjust this to fine-tune the position
  },
});