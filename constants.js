import { Dimensions } from "react-native";
import { StyleSheet } from "react-native";
import styles from "./styles";

const { width, height } = Dimensions.get("screen");

let AUTH_TOKEN = "";

const setToken = token => {
  AUTH_TOKEN = token;
};

const getToken = () => {
  return AUTH_TOKEN;
};

const commonStyle = StyleSheet.create({
  safeArea: {
    flex: 1,
    //backgroundColor: "#ffffff"
    backgroundColor: styles.backgroundGreyColor
  },
  map: {
    ...StyleSheet.absoluteFillObject
  }
});

export default { width, height, setToken, getToken, commonStyle };
