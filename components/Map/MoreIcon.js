import React from "react";
import { Platform } from "react-native";
import styled from "styled-components";
import { Ionicons } from "@expo/vector-icons";
import { withNavigation } from "react-navigation";
import styles from "../../styles";
import NavIcon from "../NavIcon";

const Container = styled.TouchableOpacity`
  padding-top: 6px;
`;

export default withNavigation(({ navigation, size, press, item }) => {
  // console.log("press : ", press);
  // console.log("item : ", item);
  return (
    // <Container onPress={() => navigation.navigate("MessageNavigation")}>
    <Container onPress={() => press(item)}>
      <NavIcon
        name={Platform.OS === "ios" ? "ios-more" : "md-more"}
        size={size}
      />
    </Container>
  );
});
