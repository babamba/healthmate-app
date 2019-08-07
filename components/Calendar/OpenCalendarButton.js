import React from "react";
import { Platform } from "react-native";
import styled from "styled-components";
import { AntDesign } from "@expo/vector-icons";
import { withNavigation } from "react-navigation";
import styles from "../../styles";
import NavIcon from "../NavIcon";
import TouchableScale from "react-native-touchable-scale";

// const Container = styled.TouchableScale`
//   padding-right: 20px;
// `;
const Container = styled.View``;

const OpenCalendarButton = ({ navigation, size }) => {
  return (
    <TouchableScale
      onPress={() => navigation.navigate("Calendar")}
      activeScale={0.9}
      friction={2}
    >
      <Container>
        <AntDesign name={"calendar"} size={size} />
      </Container>
    </TouchableScale>
  );
};

export default withNavigation(OpenCalendarButton);
