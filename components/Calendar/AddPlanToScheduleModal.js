import React, { useState } from "react";
import gql from "graphql-tag";
import { ScrollView, Alert, Platform, StyleSheet } from "react-native";
import { useQuery } from "react-apollo-hooks";
import styled from "styled-components";
import NavIcon from "../../components/NavIcon";
import Modal from "react-native-modal";
import styles from "../../styles";
import constants from "../../constants";
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
  border-radius: 20px;
  margin-top: ${constants.height / 3};
  padding: 14px;
  flex: 1;
  width: ${constants.width};
`;

export default ({
  navigation,
  togglePlanModal,
  visiblePlanModal,
  swipeDate
}) => {
  // const [visibleModal, setVisibleModal] = useState(false);
  // const toggleModal = () => {
  //   setVisibleModal(!visibleModal);
  // };
  console.log("swipeDate : ", swipeDate);

  return (
    <Modal
      isVisible={visiblePlanModal}
      avoidKeyboard={true}
      animationIn={"slideInUp"}
      animationOut={"slideOutDown"}
      deviceWidth={constants.width}
      deviceHeight={constants.height}
      style={Modalstyle.bottomModal}
      backdropColor={"grey"}
      backdropOpacity={0.6}
      onBackButtonPress={() => togglePlanModal()}
      onBackdropPress={() => togglePlanModal()}
      onSwipeComplete={() => togglePlanModal()}
      swipeDirection={["down"]}
      swipeThreshold={10}
    >
      <ModalContent>
        <TextArea>
          <Text>운동을 골라주세요 :D</Text>
        </TextArea>
        <ContentArea>
          <AddPlanCarouselList selectDate={swipeDate} />
        </ContentArea>
      </ModalContent>
    </Modal>
  );
};

const Modalstyle = StyleSheet.create({
  // modalContent: {
  //   backgroundColor: "white",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   borderRadius: 20,
  //   padding: 22,
  //   marginTop: constants.height / 3
  //   // marginVertical: 220,
  //   // margin: -20
  // },
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0
  }
});

// export default ({ navigation, props }) => (
//   <View>
//     <Text>Plan Detail {props}</Text>
//   </View>
// );
