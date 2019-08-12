import React from "react";
import { Platform } from "react-native";
import styled from "styled-components";
import { Ionicons } from "@expo/vector-icons";
import { withNavigation } from "react-navigation";
import styles from "../../styles";
import NavIcon from "../NavIcon";
import { Feather } from "@expo/vector-icons";

const Container = styled.TouchableOpacity``;

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

export default withNavigation(({ navigation, size, press, item }) => {
  // console.log("press : ", press);
  // console.log("item : ", item);
  return (
    // <Container onPress={() => navigation.navigate("MessageNavigation")}>
    <Container onPress={() => press(item)}>
      <View>
        <Feather name={"more-horizontal"} size={size} />
      </View>
    </Container>
  );
});
