import React from "react";
import gql from "graphql-tag";
import { useQuery } from "react-apollo-hooks";
import styled from "styled-components";
import { ScrollView, RefreshControl } from "react-native";
import PlanList from "../../components/plan/PlanList";
import Loader from "../../components/Loader";
import AddPlan from "../../components/plan/AddPlan";
import constants from "../../constants";
import CarouselItem from "../../components/plan/PlanCarouselList";
import { SafeAreaView } from "react-navigation";
import Weather from "../../components/Weather";
import MainTitle from "../../components/MainTitle";

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
  /* flex-direction: row; */
  text-align: center;
  /* background-color: green;
  opacity: 0.2; */
  flex: 1;
`;

const Footer = styled.View`
  width: ${constants.width};
  padding-top: 5px;
  padding-bottom: 30px;
  /* background-color: yellow;
  opacity: 0.2; */
  flex: 1;
  align-items: center;
  flex-direction: row;
  padding-horizontal: 60px;
`;

const Content = styled.View`
  width: ${constants.width};
  flex: 10;
  /* background-color: blue;
  opacity: 0.2; */
  align-items: center;
  justify-content: center;
`;

const ScreenTitle = styled.Text`
  color: black;
  font-weight: 600;
  font-size: 52px;
  font-family: NotoSansKR_Bold;
  text-align: left;
  color: #3b3b3b;
`;

const RowLeft = styled.View`
  flex: 2;
  /* background-color: red;
  opacity: 0.4; */
  height: 100%;
`;
const RowRight = styled.View`
  flex: 1;
  /* background-color: blue;
  opacity: 0.4; */
  height: 100%;
`;

const AddButton = styled.View`
  align-self: flex-end;
  padding-top: 5px;
  /* background-color: green;
  opacity: 0.4; */
`;

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

  return (
    <SafeAreaView
      style={constants.commonStyle.safeArea}
      forceInset={{ top: "always" }}
    >
      <Container>
        <Header>
          <ScreenTitle>Planner </ScreenTitle>
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
          <RowLeft>
            <Weather />
          </RowLeft>
          <RowRight>
            <AddButton>
              <AddPlan size={40} />
            </AddButton>
          </RowRight>
        </Footer>
      </Container>
    </SafeAreaView>
  );
};
