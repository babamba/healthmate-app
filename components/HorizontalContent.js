import React from "react";
import { View, TouchableOpacity, Alert, Platform } from "react-native";
import { withNavigation } from "react-navigation";
import PropTypes from "prop-types";
import styled from "styled-components";
import constants from "../constants";

const testAlert = id => {
  Alert.alert("id : ", id);
};

const Conatiner = styled.View`
  margin-left: 10;
  margin-left: 10;
  /* shadow-opacity: 0.75;
  shadow-radius: 5px;
  shadow-color: #000;
  shadow-offset: 0px 0px; */
`;

const Image = styled.Image`
  width: ${constants.width / 2.5};
  height: ${constants.height / 5};
  border-radius: 15;
`;
const TextContainer = styled.View`
  flex: 1;
  margin-top: 10px;
`;

const UserName = styled.Text`
  color: black;
  text-align: left;
  font-weight: 600;
  font-size: 18px;
  font-family: NanumBarunGothic;
`;

const Introduction = styled.Text`
  color: black;
  text-align: left;
  font-weight: 600;
  font-size: 13px;
  font-family: NanumBarunGothic;
`;

const HorizontalUser = ({ navigation, uri, id, username, intro }) => (
  <Conatiner>
    {/* <TouchableOpacity onPress={() => navigation.navigate("Detail", { id })}> */}
    <TouchableOpacity
      //onLongPress={() => testAlert(id)}
      onPress={() =>
        navigation.navigate("UserDetail", { username: "babamba88" })
      }
      activeOpacity={0.3}
    >
      <Image source={{ uri }} />
    </TouchableOpacity>
    <TextContainer>
      <UserName>{username}</UserName>
      <Introduction>{intro}</Introduction>
    </TextContainer>
  </Conatiner>
);

// HorizontalUser.propTypes = {
//   files: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.string.isRequired,
//       url: PropTypes.string.isRequired
//     })
//   ).isRequired,
//   id: PropTypes.string.isRequired
// };

export default withNavigation(HorizontalUser);
