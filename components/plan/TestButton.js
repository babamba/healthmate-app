import React from "react";
import { Platform } from "react-native";
import styled from "styled-components";
import { Ionicons } from "@expo/vector-icons";
import { withNavigation } from "react-navigation";
import styles from "../../styles";
import NavIcon from "../NavIcon";
import TouchableScale from "react-native-touchable-scale";
import { AlertHelper } from "../DropDown/AlertHelper";

// const Container = styled.TouchableScale`
//   padding-right: 20px;
// `;

const TestButton = ({ navigation, size }) => {
  const TestAlert = () => {
    AlertHelper.showDropAlert("error", "Title", "error Message");
  };

  return (
    <TouchableScale
      onPress={() => TestAlert()}
      style={{ color: "#3b3b3b" }}
      activeScale={0.92}
      friction={30}
    >
      <NavIcon
        name={Platform.OS === "ios" ? "ios-alert" : "md-alert"}
        size={size}
      />
    </TouchableScale>
  );
};

export default withNavigation(TestButton);
