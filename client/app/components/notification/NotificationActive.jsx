import { StyleSheet, Text, View } from "react-native";
import { addMinutesToTime, convertToDay, convertToMonthName } from "@/helpers";

const NotificationActive = ({ data }) => {
  // const { dateData, timeData, service } = data;

  return (
    <View style={styles.cardReservation}>
      {/* <View style={styles.dateContainer}>
        <Text style={styles.captureDate}>
          {convertToMonthName(dateData?.selectedDate)}
        </Text>
        <Text style={styles.captureDateBold}>
          {convertToDay(dateData?.selectedDate)}
        </Text>
        <Text style={styles.captureDate}>{timeData.value}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.captureDateBold}>{service.title}</Text>
        <Text style={styles.captureDate}>
          {timeData.value} -{" "}
          {addMinutesToTime(timeData.value, service.duration)}
        </Text>
        <Text style={styles.captureDateBold}>Cara Lazara 85 a</Text>
      </View> */}
    </View>
  );
};

export default NotificationActive;

const styles = StyleSheet.create({
  cardReservation: {
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    width: "100%",
    marginTop: 20,
    borderRadius: 20,
    padding: 10,
    gap: 20,
    height: 100,
  },
  dateContainer: {
    borderWidth: 1,
    borderColor: "#000",
    borderLeftWidth: 5,
    borderLeftColor: "green",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  captureDate: {
    fontSize: 18,
    color: "grey",
    textAlign: "center",
    fontWeight: "500",
  },

  captureDateBold: {
    fontSize: 20,
    color: "black",
    fontWeight: "900",
  },
  infoContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
});
