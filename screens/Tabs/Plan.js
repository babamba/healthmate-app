import React from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "react-apollo-hooks";
import styled from "styled-components";
import { ScrollView, RefreshControl, Alert, StatusBar } from "react-native";
import PlanList from "../../components/Plan/PlanList";
import Loader from "../../components/Loader";
import AddPlan from "../../components/Plan/AddPlanButton";
import constants from "../../constants";
import CarouselItem from "../../components/Plan/PlanCarouselList";
import { SafeAreaView } from "react-navigation";
import Weather from "../../components/Weather";
import MainTitle from "../../components/MainTitle";
import styles from "../../styles";
import TestButton from "../../components/Plan/TestButton";
import * as Animatable from "react-native-animatable";
import { AlertHelper } from "../../components/DropDown/AlertHelper";

import OpenCalendarButton from "../../components/Calendar/OpenCalendarButton";

export const SEE_PLAN = gql`
  query seePlan {
    seePlan {
      id
      planTitle
      planImage
      user {
        username
      }
      exerciseType {
        id
        title
        image
      }
      activity {
        id
        title
      }
    }
  }
`;

const UPDATE_DELETE_PLAN = gql`
  mutation updatePlan(
    $planId: String!
    $planTitle: String
    $exerciseType: String
    $planImage: String
    $action: ACTIONS!
  ) {
    updatePlan(
      planId: $planId
      planTitle: $planTitle
      exerciseType: $exerciseType
      planImage: $planImage
      action: $action
    ) {
      id
    }
  }
`;

const Container = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
  background-color: ${styles.backgroundGreyColor};
`;

const Header = styled.View`
  width: ${constants.width};
  padding-top: 15px;
  padding-bottom: 20px;
  padding-horizontal: 20px;
  flex-direction: row;
  text-align: center;
  /* background-color: green;
  opacity: 0.2; */
  flex: 1;
`;

const Footer = styled.View`
  width: ${constants.width};
  /* background-color: yellow;
  opacity: 0.2; */
  flex: 1;
  /* align-items: center; */
  flex-direction: row;
  padding-horizontal: 24px;
  margin-bottom: 14px;
`;

const Content = styled.View`
  width: ${constants.width};
  flex: 10;
  /* background-color: blue;
  opacity: 0.2; */
  align-items: center;
  justify-content: center;
`;

const FilpButtonArea = styled.View`
  flex: 1;
  justify-content: flex-end;
  align-items: flex-end;
`;

const ScreenTitle = styled.Text`
  color: black;
  font-weight: 600;
  font-size: 52px;
  font-family: CoreGothicD_ExtraBold;
  text-align: left;
  color: ${styles.lightGrey};
`;

const RowLeft = styled.View`
  flex: 2;
  /* background-color: red;
  opacity: 0.4; */
`;
const RowRight = styled.View`
  flex: 1;
  /* background-color: blue;
  opacity: 0.4; */
  flex-direction: row;
  justify-content: flex-end;
`;

const AddButton = Animatable.createAnimatableComponent(styled.View`
  justify-content: center;
  /* padding-top: 5px; */
  padding-right: 10px;
  /* background-color: green;
  opacity: 0.4; */
`);

export default ({ navigation }) => {
  const actionSheet = navigation.getScreenProps("actionSheet");
  const { loading, data, refetch } = useQuery(SEE_PLAN, {
    fetchPolicy: "network-only"
  });

  const updateDeletePlan = useMutation(UPDATE_DELETE_PLAN, {
    refetchQueries: () => [{ query: SEE_PLAN }]
  });
  //console.log(data.seePlan);

  const handleDelete = async planId => {
    try {
      console.log("handleDelete !", planId);
      await updateDeletePlan({
        variables: {
          planId,
          action: constants.Actions.DELETE
        }
      }).then(async result => {
        if (result.data) {
          AlertHelper.showDropAlert("success", "목록이 삭제 되었습니다 :)");
        } else {
          AlertHelper.showDropAlert("warning", "목록 삭제가 실패하였습니다 :(");
        }
      });
    } catch (error) {
      console.log(error);
      AlertHelper.showDropAlert("warning", "에러", "실패");
    }
  };

  const showActionSheet = data => {
    actionSheet(
      {
        options: ["취소", "플랜 수정", "플랜 삭제"],
        destructiveButtonIndex: 2,
        cancelButtonIndex: 0
      },
      buttonIndex => {
        if (buttonIndex === 1) {
          /* destructive action */
          console.log("플랜 수정");
        } else if (buttonIndex === 2) {
          console.log("플랜 삭제");
          confirm(data);
        }
      }
    );
  };

  const confirm = data => {
    Alert.alert(
      data.planTitle,
      "삭제 하시겠습니까?",
      [
        {
          text: "삭제",
          style: "destructive",
          onPress: () => handleDelete(data.id)
        },
        {
          text: "취소",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        }
      ],
      { cancelable: true }
    );
  };

  const onSnapUser = async index => {
    console.log("onSnapUser");

    // let moveRegion = {
    //   coords: {
    //     latitude: nearUser[index].location.latitude,
    //     longitude: nearUser[index].location.longitude
    //   }
    // };

    // locationChanged(moveRegion);
  };

  // const openCalendarView = () => {

  // };

  return (
    <SafeAreaView
      style={constants.commonStyle.safeArea}
      forceInset={{ top: "always" }}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={"transparent"}
        translucent={true}
      />
      <Container>
        <Header>
          <ScreenTitle>Planner </ScreenTitle>
          <FilpButtonArea>
            <OpenCalendarButton size={32} />
          </FilpButtonArea>
          {/* <MainTitle title={"Planner"} fontSize={32} /> */}
        </Header>
        <Content>
          {/* <ScrollView> */}
          {/* {ENTRIES_PLAN.map((data, index) => (
          <PlanContentList key={index} {...data} />
        ))} */}
          {loading ? (
            <Loader />
          ) : (
            data &&
            data.seePlan && (
              // data.seePlan.map((data, index) => {
              //   console.log("data", data);
              //   return <PlanList key={index} {...data} />;
              // })
              <CarouselItem
                data={data.seePlan}
                onSnapUser={onSnapUser}
                showActionSheet={showActionSheet}
                {...data}
              />
            )
          )}
          {/* </ScrollView> */}
        </Content>
        <Footer>
          <RowLeft>
            <Weather />
          </RowLeft>
          <RowRight>
            <AddButton
              animation="fadeInUp"
              easing="ease-in-out"
              delay={100}
              useNativeDriver={true}
            >
              <AddPlan size={40} />
            </AddButton>
            <AddButton
              animation="fadeInUp"
              easing="ease-in-out"
              delay={200}
              useNativeDriver={true}
            >
              <TestButton size={40} />
            </AddButton>
          </RowRight>
        </Footer>
      </Container>
    </SafeAreaView>
  );
};
