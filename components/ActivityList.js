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
  padding-vertical: 8;
  border-radius: 10;
  margin-left: 10;
  margin-left: 10;
  /* shadow-opacity: 0.75;
  shadow-radius: 5px;
  shadow-color: #000;
  shadow-offset: 0px 0px; */
`;

const TextContainer = styled.View`
  flex: 1;
  margin-top: 10px;
  flex-direction: row;
`;

// const Image = styled.Image`
//   width: ${constants.width / 2.2};
//   height: ${constants.height / 5};
//   border-radius: 15;
// `;

const ContentTItle = styled.Text`
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

const UserName = styled.Text`
  color: black;
  text-align: left;
  font-weight: 600;
  font-size: 18px;
  font-family: NanumBarunGothic;
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

const PlanContentList = ({ navigation, id, title, second, count }) => (
  <Conatiner>
    {/* <TouchableOpacity onPress={() => navigation.navigate("Detail", { id })}> */}
    {/* <Image source={{ uri }} /> */}
    <TextContainer>
      <Column>
        <ContentTItle>{title}</ContentTItle>
      </Column>
      <Row />
    </TextContainer>
  </Conatiner>
);

// PlanContentList.propTypes = {
//   files: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.string.isRequired,
//       url: PropTypes.string.isRequired
//     })
//   ).isRequired,
//   id: PropTypes.string.isRequired
// };

export default withNavigation(PlanContentList);
