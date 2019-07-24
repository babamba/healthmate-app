import React from "react";
import { Platform } from "react-native";
import styled from "styled-components";
import { Ionicons } from "@expo/vector-icons";
import { withNavigation } from "react-navigation";
import styles from "../../styles";
import NavIcon from "../NavIcon";
import TouchableScale from "react-native-touchable-scale";

// const Container = styled.TouchableScale`
//   padding-right: 20px;
// `;

const TestButton = ({ navigation, size }) => {
  // const dropdown = navigation.getScreenProps("dropdownAlert");

  // console.log(dropdown);

  const TestAlert = () => {
    // dropdown.current.alertWithType(
    //   "success",
    //   "Success",
    //   "Fetch data is complete."
    // );
  };

  return (
    <TouchableScale
      onPress={() => TestAlert()}
      style={{ color: "#3b3b3b" }}
      activeScale={0.92}
    >
      <NavIcon
        name={Platform.OS === "ios" ? "ios-alert" : "md-alert"}
        size={size}
      />
    </TouchableScale>
  );
};

export default withNavigation(TestButton);
