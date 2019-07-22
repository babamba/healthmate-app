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

export default withNavigation(({ navigation, size }) => (
  <TouchableScale
    onPress={() => navigation.navigate("PlanNavigation")}
    style={{ paddingRight: 20, color: "#3b3b3b" }}
    activeScale={0.85}
  >
    <NavIcon
      name={
        Platform.OS === "ios"
          ? "ios-add-circle-outline"
          : "md-add-circle-outline"
      }
      size={size}
    />
  </TouchableScale>
));