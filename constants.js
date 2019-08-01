import { Dimensions } from "react-native";
import { StyleSheet } from "react-native";
import styles from "./styles";

const { width, height } = Dimensions.get("screen");
const boxShadow = "0px 3px 6px rgba(0, 0, 0, 0.1)";
const bigBoxShadow = "0px 6px 6px rgba(0, 0, 0, 0.3)";

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

export default {
  width,
  height,
  setToken,
  getToken,
  commonStyle,
  boxShadow,
  bigBoxShadow
};
