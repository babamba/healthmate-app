import React, { useState } from "react";
import gql from "graphql-tag";
import { ScrollView, Alert, Platform, StyleSheet } from "react-native";
import { useQuery } from "react-apollo-hooks";
import styled from "styled-components";
import NavIcon from "../../components/NavIcon";
import Modal from "react-native-modal";
import styles from "../../styles";
import constants from "../../constants";
import AddActivity from "../../screens/Plan/AddActivity";

// import * as MagicMove from "react-native-magic-move";
// import * as Animatable from "react-native-animatable";

// const SEE_ACTIVITY = gql`
//   query seeActivity($planId: String!) {
//     seeActivity(planId: $planId) {
//       id
//       title
//       second
//       count
//     }
//   }
// `;

const TouchableOpacity = styled.TouchableOpacity``;
const View = styled.View``;
const Text = styled.Text``;

export default ({ navigation, planId }) => {
  console.log("planId : ", planId);
  const [visibleModal, setVisibleModal] = useState(false);
  const toggleModal = () => {
    setVisibleModal(!visibleModal);
  };
  //const planId = navigation.getParam("planId");
  //   const { loading, data } = useQuery(SEE_ACTIVITY, {
  //     variables: { planId },
  //     fetchPolicy: "network-only"
  //   });

  //console.log(data.seeActivity);

  return (
    <View>
      <TouchableOpacity onPress={() => toggleModal()}>
        <NavIcon name={Platform.OS === "ios" ? "ios-add" : "md-add"} />
      </TouchableOpacity>
      <Modal
        isVisible={visibleModal}
        avoidKeyboard={true}
        animationIn={"slideInUp"}
        animationOut={"slideOutDown"}
        deviceWidth={constants.width}
        deviceHeight={constants.height}
        style={Modalstyle.bottomModal}
        backdropColor={"grey"}
        backdropOpacity={0.6}
        onBackButtonPress={() => toggleModal()}
        onBackdropPress={() => toggleModal()}
        onSwipeComplete={() => toggleModal()}
        swipeDirection={["up", "down"]}
        swipeThreshold={10}
      >
        {/* <ModalContent>
              <Text>Test</Text>
              
            </ModalContent> */}
        <View style={Modalstyle.modalContent}>
          <Text>Test</Text>
          <AddActivity />
        </View>
      </Modal>
    </View>
  );
};

const Modalstyle = StyleSheet.create({
  modalContent: {
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    padding: 22,
    marginTop: constants.height / 3
    // marginVertical: 220,
    // margin: -20
  },
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
