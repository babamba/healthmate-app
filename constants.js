import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("screen");

let AUTH_TOKEN = "";

const setToken = token => {
  AUTH_TOKEN = token;
};

const getToken = () => {
  return AUTH_TOKEN;
};

export default { width, height, setToken, getToken };
