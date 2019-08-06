import React from "react";
import gql from "graphql-tag";
import { useQuery } from "react-apollo-hooks";
import styled from "styled-components";
import { ScrollView, RefreshControl } from "react-native";
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
  const { loading, data, refetch } = useQuery(SEE_PLAN, {
    fetchPolicy: "network-only"
  });
  //console.log(data.seePlan);

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
                {...data}
              />
            )
          )}
          {/* </ScrollView> */}
        </Content>
        <Footer>
          <RowLeft>{/* <Weather /> */}</RowLeft>
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
