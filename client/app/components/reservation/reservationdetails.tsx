import Loader from "@/components/Loader";
import ReservationContext from "@/context/ReservationContext";
import { addMinutesToTime, convertDate,  getStorage } from "@/helpers";
import Details from "@/shared-components/Details";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Storage from "expo-storage";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

const ReservationDetails = () => {
  const { reservation } = useContext(ReservationContext);
  const { reservationItem } = reservation;
  const reservationId = reservationItem?._id;
  const [reservationData, setReservationData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const [tokenData,setTokenData] = useState(null);

  useEffect(() => {
    getStorage()
    .then((res) => {
      if (res) {
        getReservationById(res);
     
      }
    })
    .catch((error) => {
      setIsLoading(false);

      console.log("error", error);
    });
    
  
  }, []);

  const alertMessageHandler = () =>
    Alert.alert(
      "Upozorenje",
      "Da li ste sigurni da želite da otkažete rezervaciju?",
      [
        {
          text: "Odustani",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Ok",
          onPress: () => {
            submitHandler(1);
          },
        },
      ]
    );
  const showToast = (text) => {
    ToastAndroid.show(text, ToastAndroid.SHORT);
  };

  const submitHandler = async (rejected) => {
    setIsLoading(true);
    try {
      await axios
        .put(`${process.env.EXPO_PUBLIC_API_URL}/reservations/${reservationId}`, {
          params: {
            status: rejected,
          },
          headers: {
            Authorization: `${tokenData}`,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            setIsLoading(false);
            navigation.navigate("(tabs)", { screen: "explore" });
            setTimeout(() => {
              showToast(res.data.message);

            }, 2000); 
          }
        })
        .catch((err) => {
          setIsLoading(false);
          console.log(err);
        });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
    setIsLoading(false);
  };
  const getReservationById = async (tokenDa) => {
    setIsLoading(true);
 
    setTokenData(tokenDa);
    try {
      await axios
        .get(`${process.env.EXPO_PUBLIC_API_URL}/reservations/${reservationId}`, {
          headers: {
            Authorization: `${tokenDa}`,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            setReservationData(res.data);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          console.log(err);
        });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

   

  return (
    <ScrollView style={styles.container}>
      <Image
        source={require("@/assets/images/coverImage.jpg")}
        style={styles.coverImage}
      />
      <View style={styles.greyLine} />
      {!isLoading ? (
        <>
          <View style={styles.coverContent}>
            <Text
              style={[
                reservationData?.status === 0
                  ? styles.statusContentConfirm
                  : styles.statusContentRejected,
              ]}
            >
              {reservationData?.status === 0
                ? "Potvrđen"
                : "Odbijen"}
            </Text>

            <Text style={styles.timeData}>
              {reservationData?.time} -{" "}
              {addMinutesToTime(
                reservationData?.time,
                reservationData?.service?.duration
              )}
            </Text>
            <Text style={styles.dateData}>
              {convertDate(reservationData?.date)}
            </Text>
            <Text style={styles.dateData}>Frizerski Studio - Gentleman</Text>
          </View>
          <View style={styles.containerWrapper}>
            <Details data={reservationData} />
          </View>
          <TouchableOpacity
            onPress={alertMessageHandler}
            style={styles.containerBtn}
          >
            <Text style={styles.btnSubmit}>Otkaži</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Loader />
      )}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  containerWrapper: {
    display: "flex",
    flexDirection: "row",
  },
  containerBtn: {
    alignItems: "center",
    position: "relative",
    top: 100,
  },
  dateData: {
    fontSize: 25,
    color: "#fff",
    fontWeight: "700",
  },
  btnSubmit: {
    fontSize: 30,
    color: "white",
    fontWeight: 900,
    borderColor: "white",
    padding: 20,
    borderWidth: 1,
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  coverContent: {
    padding: 8,
    position: "absolute",
    top: 150,
  },
  statusContentPending: {
    color: "white",
    padding: 5,
    fontSize: 20,
    maxWidth: 140,
    minWidth: 140,
    backgroundColor: "gray",
  },
  statusContentConfirm: {
    color: "white",
    padding: 5,
    fontSize: 20,
    maxWidth: 100,
    minWidth: 100,
    backgroundColor: "green",
  },
  statusContentRejected: {
    color: "white",
    padding: 5,
    fontSize: 20,
    maxWidth: 100,
    minWidth: 100,
    backgroundColor: "red",
  },
  coverImage: {
    width: "100%",
    height: 300,
    opacity: 0.2,
  },
  greyLine: {
    width: "100%",
    height: 4, // Adjust the height for the thickness of the line
    backgroundColor: "white", // Set the line color to white
    marginTop: -1, // Optional: You can adjust this to fine-tune the position
  },
  timeData: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
});
export default ReservationDetails;
