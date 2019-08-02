import React from "react";
import gql from "graphql-tag";
import { ScrollView, Alert, Platform } from "react-native";
import { useQuery } from "react-apollo-hooks";
import styled from "styled-components";
import Loader from "../../components/Loader";
import ActivitList from "../../components/Plan/ActivityList";
import { SafeAreaView } from "react-navigation";
import constants from "../../constants";
import NavIcon from "../../components/NavIcon";
import MainTitle from "../../components/MainTitle";
import EmptyList from "../../components/Plan/EmptyList";
import styles from "../../styles";

// import * as MagicMove from "react-native-magic-move";
// import * as Animatable from "react-native-animatable";

const SEE_ACTIVITY = gql`
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
    $action: String
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

export default ({ navigation }) => {
  const planId = navigation.getParam("planId");
  const { loading, data } = useQuery(SEE_ACTIVITY, {
    variables: { planId },
    fetchPolicy: "network-only"
  });

  // const editActivity = useMutation(DELETE_ACTIVITY, {
  //   refetchQueries: () => [{ query: SEE_ACTIVITY, variables: { planId }}]
  // });

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
              onPress={() => navigation.navigate("AddActivity", { planId })}
            >
              <NavIcon name={Platform.OS === "ios" ? "ios-add" : "md-add"} />
            </TouchableOpacity>
          </AddContainer>
        </HeaderArea>
      </Container>
      <ListArea>
        <ScrollView>
          {loading ? (
            <Loader />
          ) : data && data.seeActivity && data.seeActivity.length > 0 ? (
            data.seeActivity.map((data, index) => {
              console.log("data", data);
              return <ActivitList key={index} {...data} />;
            })
          ) : (
            <EmptyList />
          )}
        </ScrollView>
      </ListArea>
    </SafeAreaView>
  );
};

// export default ({ navigation, props }) => (
//   <View>
//     <Text>Plan Detail {props}</Text>
//   </View>
// );
