import React, { useState, useEffect } from "react";
import gql from "graphql-tag";
import { ScrollView, Alert, Platform, StyleSheet } from "react-native";
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

const DELETE_ACTIVITY = gql`
  mutation updateActivity(
    $activityId: String!
    $title: String
    $second: Int
    $count: Int
    $set: Int
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
  justify-content: center;
  align-items: center;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 22px;
  margin-top: ${constants.height / 3};
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
  const [visibleInput, setVisibleInput] = useState(false);

  const planId = navigation.getParam("planId");
  const { loading, data, error, refetch } = useQuery(SEE_ACTIVITY, {
    variables: { planId },
    fetchPolicy: "network-only"
  });

  const [activityList, setActivityList] = useState([]);

  const deleteActivity = useMutation(DELETE_ACTIVITY, {
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

  const toggleModal = () => {
    setVisibleInput(!visibleInput);
  };

  const handleRefetch = async () => {
    await refetch({ planId });
  };

  const handleCreate = async items => {
    console.log("handleCreate ");

    const {
      data: { addActivity }
    } = await createActivity({
      variables: {
        items
      }
    });

    return addActivity;
  };

  const handleDelete = async activityId => {
    console.log("handleDelete !", activityId);

    try {
      const {
        data: { updateActivity }
      } = await deleteActivity({
        variables: {
          activityId,
          action: constants.Actions.DELETE
        }
      });

      if (updateActivity) {
        AlertHelper.showDropAlert("success", "목록이 삭제", "되었습니다");
      }
    } catch (error) {
      console.log(error);
      AlertHelper.showDropAlert("warning", "삭제", "실패");
    }
  };

  useEffect(() => {
    const onCompleted = data => {
      //console.log("onCompleted data : ", data);
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
              onPress={() => toggleModal()}
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
      </Scroll>

      <Modal
        isVisible={visibleInput}
        avoidKeyboard={true}
        animationIn={"slideInUp"}
        animationOut={"slideOutDown"}
        deviceWidth={constants.width}
        deviceHeight={constants.height}
        style={{
          justifyContent: "flex-end",
          margin: 0
        }}
        backdropColor={"grey"}
        backdropOpacity={0.6}
        onBackButtonPress={() => toggleModal()}
        onBackdropPress={() => toggleModal()}
        onSwipeComplete={() => toggleModal()}
        swipeDirection={["down"]}
        swipeThreshold={10}
      >
        {/* <ModalContent>
              <Text>Test</Text>
              
            </ModalContent> */}
        <ModalInnerView>
          <InputActivity
            planId={planId}
            toggle={toggleModal}
            handleCreate={handleCreate}
          />
        </ModalInnerView>
      </Modal>
    </SafeAreaView>
  );
};
