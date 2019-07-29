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

const TestButton = ({ navigation, size, press, isFlip }) => {
  // const dropdown = navigation.getScreenProps("dropdownAlert");

  console.log(isFlip);

  const TestAlert = () => {
    // dropdown.current.alertWithType(
    //   "success",
    //   "Success",
    //   "Fetch data is complete."
    // );
  };

  return (
    <TouchableScale onPress={() => press()} activeScale={0.9} friction={2}>
      <Container>
        <AntDesign name={isFlip ? "bars" : "calendar"} size={size} />
      </Container>
    </TouchableScale>
  );
};

export default withNavigation(TestButton);
