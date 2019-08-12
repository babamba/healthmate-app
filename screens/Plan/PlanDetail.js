import React, { useState, useEffect } from "react";
import gql from "graphql-tag";
import {
  ScrollView,
  Alert,
  Platform,
  StyleSheet,
  Keyboard
} from "react-native";
import { useQuery, useMutation } from "react-apollo-hooks";
import styled from "styled-components";
import Loader from "../../components/Loader";
import ActivityList from "../../components/Plan/ActivityList";
import { SafeAreaView } from "react-navigation";
import constants from "../../constants";
import NavIcon from "../../components/NavIcon";
import MainTitle from "../../components/MainTitle";
import EmptyList from "../../components/Plan/EmptyList";
import styles from "../../styles";
import InputActivity from "../../components/Plan/InputActivity";

import Modal from "react-native-modal";
import { AlertHelper } from "../../components/DropDown/AlertHelper";
import UpdateActivity from "../../components/Plan/UpdateActivity";
import OverLayLoader from "../../components/OverlayLoader";

// import * as MagicMove from "react-native-magic-move";
// import * as Animatable from "react-native-animatable";

const CREATE_ACTIVITY = gql`
  mutation addActivity($items: [LineItem]!) {
    addActivity(items: $items) {
      activity {
        id
        title
      }
    }
  }
`;

export const SEE_ACTIVITY = gql`
  query seeActivity($planId: String!) {
    seeActivity(planId: $planId) {
      id
      title
      second
      count
      set
    }
  }
`;

const UPDATE_DELETE_ACTIVITY = gql`
  mutation updateActivity(
    $activityId: String!
    $title: String
    $second: Int
    $count: Int
    $set: String
    $action: ACTIONS!
  ) {
    updateActivity(
      activityId: $activityId
      title: $title
      second: $second
      count: $count
      set: $set
      action: $action
    ) {
      activity {
        title
      }
    }
  }
`;

const Container = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
  width: ${constants.width};
  padding-horizontal: 15px;
`;

const Text = styled.Text``;
const HeaderArea = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: center;
`;
const TouchableOpacity = styled.TouchableOpacity``;

const BackContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: flex-start;
  padding-left: 6px;
`;

const TitleContainer = styled.View`
  flex: 8;
  justify-content: center;
`;

const Title = styled.Text`
  color: ${styles.lightGrey};
  font-family: NotoSansKR_Bold;
  font-size: 42px;
  text-align: left;
`;

const AddContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ListArea = styled.View`
  flex: 9;
`;

const Scroll = styled.ScrollView`
  flex: 9;
`;

const ModalInnerView = styled.View`
  flex: 1;
  background-color: white;
  /* background-color: red; */
  justify-content: center;
  align-items: center;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  padding: 22px;
  padding-top: ${constants.height / 9};
  margin-bottom: ${constants.height / 5};
`;

const Overlay = styled.View`
  flex: 9;
  background-color: "rgba(0,0,0,0.3)";
`;
// const Overlay = styled.View({
//   ...StyleSheet.absoluteFillObject,
//   backgroundColor: "rgba(0,0,0,0.3)"
// });

export default ({ navigation }) => {
  const [overlayLoader, setOverlayLoader] = useState(false);
  const [visibleInput, setVisibleInput] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [updateData, setUpdateData] = useState(null);

  const planId = navigation.getParam("planId");
  const { loading, data, error, refetch } = useQuery(SEE_ACTIVITY, {
    variables: { planId },
    fetchPolicy: "network-only"
  });

  const [activityList, setActivityList] = useState([]);

  const updateDeleteActivity = useMutation(UPDATE_DELETE_ACTIVITY, {
    refetchQueries: () => [{ query: SEE_ACTIVITY, variables: { planId } }]
  });

  const createActivity = useMutation(CREATE_ACTIVITY, {
    refetchQueries: () => [{ query: SEE_ACTIVITY, variables: { planId } }]
  });

  // const {
  //   data: { updateActivity }
  // } = await editActivity({
  //   variables: {
  //     planImage: location,
  //     planTitle: planTitleInput.value,
  //     exerciseType: pickedExercise.id
  //   }
  // });

  // if (updateActivity) {
  //   AlertHelper.showDropAlert("success", "목록생성", "되었습니다");
  //   navigation.navigate("AddActivity", { planId: addPlan.id });
  // }

  //console.log(data.seeActivity);

  const toggleInsertModal = () => {
    setVisibleInput(!visibleInput);
    if (!visibleInput) {
      Keyboard.dismiss();
    }
  };

  const toggleUpdateModal = async data => {
    console.log("Edit data : ", data);

    if (visibleEdit) {
      //await setUpdateData(null);
      await setVisibleEdit(false);
    } else {
      await setUpdateData(data);
      await setVisibleEdit(true);
    }
    console.log("setState", updateData);
  };

  const handleRefetch = async () => {
    await refetch({ planId });
  };

  const handleUpdate = async (item, activityId) => {
    console.log("item !", item);
    console.log("handleUpdate !", activityId);

    let success = false;

    await updateDeleteActivity({
      variables: {
        ...item,
        activityId,
        action: constants.Actions.UPDATE
      }
    }).then(async result => {
      console.log("then result", result);
      if (result.data) {
        //handleRefetch();
        success = true;
      }
    });

    return success;
  };

  const handleCreate = async items => {
    console.log("handle Create ");
    let success = false;

    await createActivity({
      variables: {
        items
      }
    }).then(async result => {
      console.log("then result", result);
      if (result.data) {
        //handleRefetch();
        success = true;
      }
    });

    return success;
  };

  const handleDelete = async activityId => {
    console.log("handleDelete !", activityId);

    try {
      setOverlayLoader(true);
      const {
        data: { updateActivity }
      } = await updateDeleteActivity({
        variables: {
          activityId,
          action: constants.Actions.DELETE
        }
      });

      if (updateActivity) {
        setOverlayLoader(false);
        AlertHelper.showDropAlert("success", "목록이 삭제", "되었습니다");
      }
    } catch (error) {
      console.log(error);
      setOverlayLoader(false);
      AlertHelper.showDropAlert("warning", "삭제", "실패");
    }
  };

  useEffect(() => {
    const onCompleted = data => {
      //console.log("onCompleted activity data : ", data);
      setActivityList(data.seeActivity);
    };
    const onError = error => {
      console.log("error initial load data : ", error);
    };
    if (onCompleted || onError) {
      if (onCompleted && !loading && !error) {
        onCompleted(data);
      } else if (onError && !loading && error) {
        onError(error);
      }
    }
  }, [data, loading, error]);

  return (
    <SafeAreaView
      style={constants.commonStyle.safeArea}
      forceInset={{ top: "always" }}
    >
      {overlayLoader && <OverLayLoader />}
      <Container>
        <HeaderArea>
          <BackContainer>
            <TouchableOpacity onPress={() => navigation.goBack(null)}>
              <NavIcon
                name={
                  Platform.OS === "ios" ? "ios-arrow-back" : "md-arrow-back"
                }
              />
            </TouchableOpacity>
          </BackContainer>

          <TitleContainer>
            <Title>Activity</Title>
          </TitleContainer>

          <AddContainer>
            <TouchableOpacity
              // onPress={() => navigation.navigate("AddActivity", { planId })}
              onPress={() => toggleInsertModal()}
            >
              <NavIcon name={Platform.OS === "ios" ? "ios-add" : "md-add"} />
            </TouchableOpacity>
          </AddContainer>
        </HeaderArea>
      </Container>

      <Scroll>
        {loading ? (
          <Loader />
        ) : (
          data &&
          data.seeActivity &&
          (data.seeActivity.length > 0 ? (
            <ActivityList
              data={data.seeActivity}
              handleDelete={handleDelete}
              handleUpdate={handleUpdate}
              toggleUpdateModal={toggleUpdateModal}
            />
          ) : (
            <EmptyList />
          ))
        )}
      </Scroll>

      {/* <Scroll>
        {loading ? (
          <Loader />
        ) : (
          data &&
          data.seeActivity &&
          (data.seeActivity.length > 0 ? (
            data.seeActivity.map((data, index) => {
              return (
                <ActivityList
                  key={index}
                  {...data}
                  handleDelete={handleDelete}
                />
              );
            })
          ) : (
            <EmptyList />
          ))
        )}
      </Scroll> */}

      <Modal
        isVisible={visibleInput}
        avoidKeyboard={true}
        animationIn={"slideInDown"}
        animationOut={"slideOutUp"}
        deviceWidth={constants.width}
        deviceHeight={constants.height}
        style={{
          justifyContent: "flex-end",
          margin: 0
        }}
        backdropColor={"grey"}
        backdropOpacity={0.6}
        onBackButtonPress={() => toggleInsertModal()}
        onBackdropPress={() => toggleInsertModal()}
        onSwipeComplete={() => toggleInsertModal()}
        swipeDirection={["up"]}
        swipeThreshold={10}
      >
        {/* <ModalContent>
              <Text>Test</Text>
              
            </ModalContent> */}
        <ModalInnerView>
          <InputActivity
            planId={planId}
            toggle={toggleInsertModal}
            handleCreate={handleCreate}
          />
        </ModalInnerView>
      </Modal>

      <Modal
        isVisible={visibleEdit}
        avoidKeyboard={true}
        animationIn={"slideInDown"}
        animationOut={"slideOutUp"}
        deviceWidth={constants.width}
        deviceHeight={constants.height}
        style={{
          justifyContent: "flex-end",
          margin: 0
        }}
        backdropColor={"grey"}
        backdropOpacity={0.6}
        onBackButtonPress={() => toggleUpdateModal()}
        onBackdropPress={() => toggleUpdateModal()}
        onSwipeComplete={() => toggleUpdateModal()}
        swipeDirection={["up"]}
        swipeThreshold={10}
      >
        {/* <ModalContent>
              <Text>Test</Text>
              
            </ModalContent> */}
        <ModalInnerView>
          <UpdateActivity
            planId={planId}
            data={updateData}
            toggle={toggleUpdateModal}
            handleUpdate={handleUpdate}
          />
        </ModalInnerView>
      </Modal>
    </SafeAreaView>
  );
};
