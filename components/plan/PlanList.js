import React from "react";
import { View, TouchableOpacity, Alert, Platform } from "react-native";
import { withNavigation } from "react-navigation";
import PropTypes from "prop-types";
import styled from "styled-components";
import constants from "../../constants";
import Swipeout from "react-native-swipeout";

const testAlert = id => {
  Alert.alert("id : ", id);
};

const outAlertBtn = id => {
  Alert.alert("id : ", id);
};

const swipeoutBtns = [
  {
    text: "수정",
    type: "primary",
    onPress: () => outAlertBtn()
  },
  {
    text: "삭제",
    type: "delete",
    onPress: () => outAlertBtn()
  }
];

const Conatiner = styled.View`
  padding-vertical: 8px;
  padding-horizontal: 8px;
  border-radius: 10px;
  margin-left: 10px;
  margin-left: 10px;
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

const PlanList = ({
  navigation,
  planTitle,
  id
  // exerciseTime,
  // exerciseDate
  // id,
  // user,
  // exerciseType,
  // exerciseDate,
  // exerciseTime
}) => (
  // <Swipeout right={swipeoutBtns} backgroundColor={"#ffffff"}>
  <Conatiner>
    {/* <TouchableOpacity onPress={() => navigation.navigate("Detail", { id })}> */}
    <TouchableOpacity
      //onLongPress={() => testAlert(id)}
      onPress={() => navigation.navigate("PlanDetail", { planId: id })}
    >
      {/* <Image source={{ uri }} /> */}
      <TextContainer>
        <Column>
          <ContentTItle>{planTitle}</ContentTItle>
        </Column>
        {/* <Row>
          <UserName>{exerciseTime}</UserName>
        </Row> */}
      </TextContainer>
    </TouchableOpacity>
  </Conatiner>
  // </Swipeout>
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

export default withNavigation(PlanList);
