import React from "react";
import { Platform } from "react-native";
import styled from "styled-components";
import { Feather } from "@expo/vector-icons";
import { withNavigation } from "react-navigation";
import styles from "../../styles";
import constants from "../../constants";
import MaterialIcon from "../MaterialIcon";
import TouchableScale from "react-native-touchable-scale";

const iconContainerWidth = constants.width / 10;

const Container = styled.View`
  background-color: white;
  width: ${iconContainerWidth};
  height: ${iconContainerWidth};
  border-radius: ${Math.round(iconContainerWidth / 2)};
  justify-content: center;
  align-items: center;
`;

export default withNavigation(({ navigation, size, press, item }) => {
  //console.log("press", press);
  return (
    <TouchableScale
      onPress={() => press(true)}
      activeScale={0.9}
      tension={80}
      friction={2}
    >
      <Container>
        <Feather name={"zoom-in"} size={size} />
      </Container>
    </TouchableScale>
  );
});
