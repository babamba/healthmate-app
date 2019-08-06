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

const Container = styled.View``;

export default withNavigation(({ navigation, size, refetch }) => (
  <Container>
    <TouchableScale
      onPress={() => navigation.navigate("PlanNavigation", { refetch })}
      style={{ color: "#3b3b3b" }}
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
  </Container>
));
