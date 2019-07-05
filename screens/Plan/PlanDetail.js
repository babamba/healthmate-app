import React from "react";
import { gql } from "apollo-boost";
import { ScrollView, TouchableOpacity, Alert, Platform } from "react-native";
import { useQuery } from "react-apollo-hooks";
import styled from "styled-components";
import Loader from "../../components/Loader";
import ActivitList from "../../components/ActivityList";

const SEE_ACTIVITY = gql`
  query seeActivity($planId: String!) {
    seeActivity(planId: $planId) {
      id
      title
      second
      count
    }
  }
`;

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Text = styled.Text``;

const PlanDetail = ({ navigation }) => {
  const { loading, data } = useQuery(SEE_ACTIVITY, {
    variables: { planId: navigation.getParam("planId") },
    fetchPolicy: "network-only"
  });

  console.log(data.seeActivity);

  return (
    <ScrollView>
      {loading ? (
        <Loader />
      ) : (
        data &&
        data.seeActivity &&
        data.seeActivity.map((data, index) => {
          console.log("data", data);
          return <ActivitList key={index} {...data} />;
        })
      )}
    </ScrollView>
  );
};

// export default ({ navigation, props }) => (
//   <View>
//     <Text>Plan Detail {props}</Text>
//   </View>
// );

export default PlanDetail;
