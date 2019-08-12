import React, { useState } from "react";
import gql from "graphql-tag";
import { ScrollView, Alert, Platform, StyleSheet } from "react-native";
import { useQuery } from "react-apollo-hooks";
import styled from "styled-components";
import NavIcon from "../../components/NavIcon";
import Modal from "react-native-modal";
import styles from "../../styles";
import constants from "../../constants";
import { SafeAreaView } from "react-navigation";
import AddPlanCarouselList from "./AddPlanCarouselList";

const TouchableOpacity = styled.TouchableOpacity``;
const View = styled.View``;

const TextArea = styled.View`
  padding-top: 20px;
`;
const Text = styled.Text`
  padding-bottom: 16px;
  color: black;
  text-align: center;
  font-size: 18px;
  font-family: NanumBarunGothicLight;
`;

const ContentArea = styled.View`
  flex: 1;
`;

// const DateText = styled.Text`
//   color: black;
//   text-align: center;
//   font-size: 12px;
//   font-family: NanumBarunGothicUltraLight;
// `;

const ModalContent = styled.View`
  background-color: white;
  justify-content: center;
  align-items: center;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
  padding-top: 14px;
  flex: 1;
  width: ${constants.width};
  height: ${constants.height / 1.5};
`;

export default ({
  navigation,
  togglePlanModal,
  visiblePlanModal,
  swipeDate,
  handleAddSchedule,
  handleIncreaseSchedule,
  addRequestType,
  scheduleId,
  existAlreadyItem
}) => {
  // const [visibleModal, setVisibleModal] = useState(false);
  // const toggleModal = () => {
  //   setVisibleModal(!visibleModal);
  // };
  console.log("swipeDate : ", swipeDate);

  return (
    <Modal
      isVisible={visiblePlanModal}
      animationIn={"slideInUp"}
      animationOut={"slideOutDown"}
      deviceWidth={constants.width}
      deviceHeight={constants.height}
      style={Modalstyle.bottomModal}
      backdropColor={"grey"}
      backdropOpacity={0.6}
      animationInTiming={600}
      animationOutTiming={600}
      onBackButtonPress={() => togglePlanModal()}
      onBackdropPress={() => togglePlanModal()}
      onSwipeComplete={() => togglePlanModal()}
      swipeDirection={["down"]}
      swipeThreshold={10}
    >
      <ModalContent>
        <AddPlanCarouselList
          selectDate={swipeDate}
          handleAddSchedule={handleAddSchedule}
          handleIncreaseSchedule={handleIncreaseSchedule}
          togglePlanModal={togglePlanModal}
          addRequestType={addRequestType}
          scheduleId={scheduleId}
          existAlreadyItem={existAlreadyItem}
        />
      </ModalContent>
    </Modal>
  );
};

const Modalstyle = StyleSheet.create({
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0,
    paddingTop: constants.height / 4
  }
});

// export default ({ navigation, props }) => (
//   <View>
//     <Text>Plan Detail {props}</Text>
//   </View>
// );
