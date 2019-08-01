import React from "react";
import gql from "graphql-tag";
import { ScrollView, TouchableOpacity, Alert, Platform } from "react-native";
import { useQuery } from "react-apollo-hooks";
import styled from "styled-components";
import Loader from "../../components/Loader";
import ActivitList from "../../components/Plan/ActivityList";
import { SafeAreaView } from "react-navigation";
import constants from "../../constants";
import NavIcon from "../../components/NavIcon";

// import * as MagicMove from "react-native-magic-move";
// import * as Animatable from "react-native-animatable";

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
const BackContainer = styled.TouchableOpacity`
  padding: 10px;
`;

export default ({ navigation }) => {
  const { loading, data } = useQuery(SEE_ACTIVITY, {
    variables: { planId: navigation.getParam("planId") },
    fetchPolicy: "network-only"
  });

  //console.log(data.seeActivity);

  return (
    <SafeAreaView
      style={constants.commonStyle.safeArea}
      forceInset={{ top: "always" }}
    >
      <BackContainer onPress={() => navigation.goBack(null)}>
        <NavIcon
          name={Platform.OS === "ios" ? "ios-arrow-back" : "md-arrow-back"}
        />
      </BackContainer>
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
    </SafeAreaView>
  );
};

// export default ({ navigation, props }) => (
//   <View>
//     <Text>Plan Detail {props}</Text>
//   </View>
// );
