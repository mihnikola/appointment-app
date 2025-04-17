import { StyleSheet, Image, View, Text, Pressable } from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function aboutapplication() {
  return (
    <View>
      <Image
        source={require("@/assets/images/settingsImage.jpg")}
        style={styles.headerImage}
        resizeMode="cover"
      />
      <View style={styles.containerInfo}>
        <SettingItem title="Kontakt" icon="logo.whatsapp" name="+381611797096"/>
        <SettingItem title="Instagram" icon="logo.instagram" name="@mihailovic.nikola26"/>
        <SettingItem title="Verzija Aplikacije" icon="info" name="0.0.0"/>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerInfo}>
          Za personalizovane aplikacije molimo kontaktirajte nas na whatsapp ili
          instagram
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  footerInfo: {
    fontSize: 18,
    textAlign: 'center',
    color: "grey",
  },
  containerInfo: {
    marginTop: 20,
    flexDirection: "column",
    gap: 10,
  },
  headerImage: {
    width: "100%",
    height: 300,
    opacity: 0.3,
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  item: {
    padding: 10,
    display: "flex",
    flexDirection: "row",
    gap: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  content: {
    fontSize: 16,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "85%",
    alignItems: "center",
  },
  titleGrey:{
    fontSize: 18,
    fontWeight: "bold",
    color: "grey",
  }
});

const SettingItem = ({ title, icon, name }) => {
  return (
    <View style={styles.item}>
      <IconSymbol color="white" name={icon} size={32} />
      <Pressable style={styles.content}>
        <Text style={styles.titleGrey}>{title}</Text>
        <Text style={styles.title}>{name}</Text>
      </Pressable>
    </View>
  );
};
