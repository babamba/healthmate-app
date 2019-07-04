import React from "react";
import { View, TouchableOpacity, Alert, Text, Platform } from "react-native";
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
  border-radius: 10;
  shadow-opacity: 0.75;
  shadow-radius: 5px;
  shadow-color: #000;
  shadow-offset: 0px 0px;
`;

const Image = styled.Image`
  width: ${constants.width / 1.6};
  height: ${constants.height / 5};
`;

const HorizontalUser = ({ navigation, uri, id, username, intro }) => (
  <Conatiner>
    {/* <TouchableOpacity onPress={() => navigation.navigate("Detail", { id })}> */}
    <TouchableOpacity onLongPress={() => testAlert(id)} activeOpacity={0.3}>
      <Image source={{ uri }} />
    </TouchableOpacity>
    <Text>{username}</Text>
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
