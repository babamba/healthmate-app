import React from "react";
import gql from "graphql-tag";
import { useQuery } from "react-apollo-hooks";
import styled from "styled-components";
import { ScrollView, RefreshControl } from "react-native";
import PlanList from "../../components/PlanList";
import Loader from "../../components/Loader";
import AddPlan from "../../components/AddPlan";
import constants from "../../constants";

export const SEE_PLAN = gql`
  query seePlan {
    seePlan {
      id
      planTitle
      exerciseDate
      exerciseTime
      user {
        username
      }
      exerciseType {
        id
        title
      }
      activity {
        id
        title
      }
    }
  }
`;
const SafeAreaView = styled.SafeAreaView`
  justify-content: center;
  align-items: center;
  flex: 1;
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
  margin-horizontal: 15px;
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
  console.log(data.seePlan);

  return (
    <SafeAreaView>
      <Container>
        <Header>
          <ScreenTitle>플랜을 관리해보세요!</ScreenTitle>
          <AddButton>
            <AddPlan size={40} />
          </AddButton>
        </Header>
        <Content>
          <ScrollView>
            {/* {ENTRIES_PLAN.map((data, index) => (
          <PlanContentList key={index} {...data} />
        ))} */}
            {loading ? (
              <Loader />
            ) : (
              data &&
              data.seePlan &&
              data.seePlan.map((data, index) => {
                console.log("data", data);
                return <PlanList key={index} {...data} />;
              })
            )}
          </ScrollView>
        </Content>
      </Container>
    </SafeAreaView>
  );
};
