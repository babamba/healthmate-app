import React from "react";
import { View, TouchableOpacity, Alert, Platform } from "react-native";
import { withNavigation } from "react-navigation";
import PropTypes from "prop-types";
import styled from "styled-components";
import constants from "../../constants";

const testAlert = id => {
  Alert.alert("id : ", id);
};

const Conatiner = styled.View`
  margin-left: 10;
  margin-left: 10;
`;

const round_value = constants.width / 5;

const Image = styled.Image`
  width: ${round_value};
  height: ${round_value};
  border-radius: ${Math.round(round_value / 2)};
`;
const TextContainer = styled.View`
  flex: 1;
  margin-top: 10px;
  align-items: center;
`;

const UserName = styled.Text`
  color: black;
  text-align: left;
  font-weight: 600;
  font-size: 18px;
  font-family: NotoSansKR_Regular;
`;

const Introduction = styled.Text`
  color: black;
  text-align: left;
  font-weight: 600;
  /* font-size: 13px; */
  font-family: NotoSansKR_Regular;
`;

const HorizontalUser = ({ navigation, username, avatar, id }) => {
  // console.log("round_value : ", round_value);
  return (
    <Conatiner>
      {/* <TouchableOpacity onPress={() => navigation.navigate("Detail", { id })}> */}
      <TouchableOpacity
        //onLongPress={() => testAlert(id)}
        onPress={() => navigation.navigate("UserDetail", { id, username })}
        activeOpacity={0.3}
      >
        <Image source={{ uri: avatar }} />
      </TouchableOpacity>
      {/* <TextContainer>
        <UserName>{username}</UserName>
        <Introduction>{lastPlan[0].planTitle}</Introduction>
      </TextContainer> */}
    </Conatiner>
  );
};

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
