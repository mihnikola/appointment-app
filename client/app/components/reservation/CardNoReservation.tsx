import { View, Text, StyleSheet } from "react-native";
import React from "react";

const CardNoReservation = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.capture}> Trenutno nemate rezervacija </Text>
      <Text style={styles.description}>
        Samo nekoliko klikova Vas deli od Vašeg termina.
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    backgroundColor: "black",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    marginTop: 20,
    borderRadius: 20,
    padding: 10,
    gap: 20,
    height: 100,
  },
  capture: {
    fontSize: 24,
    textAlign: "center",
    padding: 10,
    fontWeight: "900",
    color: "white",
  },
  description: {
    fontSize: 18,
    color: "grey",
    textAlign: "center",
  },
});

export default CardNoReservation;
