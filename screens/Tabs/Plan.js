import React from "react";
import gql from "graphql-tag";
import { useQuery } from "react-apollo-hooks";
import styled from "styled-components";
import { ScrollView, RefreshControl } from "react-native";
import PlanList from "../../components/PlanList";
import Loader from "../../components/Loader";
import AddPlan from "../../components/AddPlan";
import constants from "../../constants";
import CarouselItem from "../../components/PlanCarouselList";
import { SafeAreaView } from "react-navigation";

export const SEE_PLAN = gql`
  query seePlan {
    seePlan {
      id
      planTitle
      planImage
      exerciseDate
      exerciseTime
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
`;

const Header = styled.View`
  width: ${constants.width};
  padding-top: 15px;
  padding-bottom: 20px;
  padding-horizontal: 20px;
  flex-direction: row;
  text-align: center;
`;

const Content = styled.View`
  width: ${constants.width};
  flex: 11;
`;

const ScreenTitle = styled.Text`
  flex: 0.85;
  color: black;
  font-weight: 600;
  font-size: 32px;
  font-family: NotoSansKR_Bold;
`;

const AddButton = styled.View`
  flex: 0.15;
  text-align: left;
`;

export default () => {
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

  return (
    <SafeAreaView
      style={constants.commonStyle.safeArea}
      forceInset={{ top: "always" }}
    >
      <Container>
        <Header>
          <ScreenTitle>Make your own Planner </ScreenTitle>
          <AddButton>
            <AddPlan size={40} />
          </AddButton>
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
      </Container>
    </SafeAreaView>
  );
};
