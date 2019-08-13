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
  padding-horizontal: 40;
  border-radius: 10;
  margin-left: 10;
  margin-left: 10;
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

const EmptyList = ({ navigation }) => {
  return (
    <Conatiner>
      {/* <TouchableOpacity onPress={() => navigation.navigate("Detail", { id })}> */}
      {/* <Image source={{ uri }} /> */}
      <TextContainer>
        <Column>
          <ContentTItle>활동 목록이 없어요 :(</ContentTItle>
        </Column>
      </TextContainer>
    </Conatiner>
  );
};

// PlanContentList.propTypes = {
//   files: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.string.isRequired,
//       url: PropTypes.string.isRequired
//     })
//   ).isRequired,
//   id: PropTypes.string.isRequired
// };

export default withNavigation(EmptyList);
