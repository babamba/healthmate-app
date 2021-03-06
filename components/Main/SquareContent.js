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
  padding-vertical: 8;
  border-radius: 14;
  margin-left: 18;
`;

const TextContainer = styled.View`
  flex: 1;
  margin-top: 10px;
  flex-direction: row;
`;

const Image = styled.Image`
  width: ${constants.width / 2.35};
  height: ${constants.height / 5};
  border-radius: 15;
`;

const ContentTItle = styled.Text`
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
  font-size: 13px;
  font-family: NotoSansKR_Regular;
`;

const UserName = styled.Text`
  color: black;
  text-align: left;
  font-weight: 600;
  font-size: 18px;
  font-family: NotoSansKR_Regular;
`;

const Column = styled.View`
  flex: 1;
  flex-direction: column;
`;

const Row = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: flex-end;
`;

const SquareContent = ({ navigation, uri, id, username, intro, title }) => (
  <Conatiner>
    {/* <TouchableOpacity onPress={() => navigation.navigate("Detail", { id })}> */}
    <TouchableOpacity
      //onLongPress={() => testAlert(id)}
      onPress={() => navigation.navigate("UserDetail", { id, username })}
    >
      <Image source={{ uri }} />
    </TouchableOpacity>
    <TextContainer>
      <Column>
        <ContentTItle>{title}</ContentTItle>
        <Introduction>{intro}</Introduction>
      </Column>
      {/* <Row>
        <UserName>{username}</UserName>
      </Row> */}
    </TextContainer>
  </Conatiner>
);

// SquareContent.propTypes = {
//   files: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.string.isRequired,
//       url: PropTypes.string.isRequired
//     })
//   ).isRequired,
//   id: PropTypes.string.isRequired
// };

export default withNavigation(SquareContent);
