import React, { useEffect } from "react";
import { useIsLoggedIn, useIsLaunchedApp } from "../AuthContext";
import { useQuery, useSubscription } from "react-apollo-hooks";
import { View, Platform, Alert } from "react-native";
import gql from "graphql-tag";
import AuthNavigation from "../navigation/AuthNavigation";
import MainNavigation from "../navigation/MainNavigation";
import Loader from "./Loader";
import { SEE_PLAN } from "../screens/Tabs/Plan";
import { RECOMMEND_USER } from "../screens/Tabs/Main";
import { ME } from "../screens/Tabs/Profile";
import { SEE_ROOMS } from "../screens/Tabs/Chat";
import AppIntro from "../screens/Intro/Intro";

import DropdownAlert from "react-native-dropdownalert";
import { AlertHelper } from "./DropDown/AlertHelper";

const RECEIVE_MESSAGE = gql`
  subscription ReceiveMessage {
    ReceiveMessage {
      id
      text
      from {
        username
      }
      room {
        id
        lastMessage {
          text
        }
      }
    }
  }
`;

export default props => {
  const isLaunched = useIsLaunchedApp();
  const isLoggedIn = useIsLoggedIn();
  const actionSheet = props.showActionSheetWithOptions;

  //console.log("isLaunched : ", isLaunched);

  const { data: ReceiveMessage } = useSubscription(RECEIVE_MESSAGE, {
    onSubscriptionData: ({ client, subscriptionData }) => {
      console.log("onSubscriptionData", subscriptionData);
      room_refetch();
      AlertHelper.showDropAlert(
        "success",
        `${subscriptionData.data.ReceiveMessage.from.username} : ${
          subscriptionData.data.ReceiveMessage.text
        }`
      );
    },
    skip: !isLoggedIn
  });

  // const handleRoomQuery = roomId => {
  //   const { data } = useQuery(SEE_ROOM, {
  //     skip: !isLoggedIn,
  //     variables: { roomId },
  //     fetchPolicy: "network-only"
  //   });
  // };

  const {
    data: recom_data,
    loading: recom_loading,
    error: recom_error
  } = useQuery(RECOMMEND_USER, {
    skip: !isLoggedIn,
    fetchPolicy: "network-only"
  });

  const {
    data: plan_data,
    loading: plan_loading,
    error: plan_error
  } = useQuery(SEE_PLAN, {
    skip: !isLoggedIn,
    fetchPolicy: "network-only"
  });

  const { loading: me_loading, data: me_data, error: me_error } = useQuery(ME, {
    skip: !isLoggedIn,
    fetchPolicy: "network-only"
  });

  const {
    data: room_data,
    loading: room_loading,
    error: room_error,
    refetch: room_refetch
  } = useQuery(SEE_ROOMS, {
    skip: !isLoggedIn,
    fetchPolicy: "network-only"
  });

  // const alert = () => {
  //   return (
  //     <DropdownAlert
  //       containerStyle={{
  //         backgroundColor: "#cc3232",
  //         paddingTop: 50
  //       }}
  //       ref={ref => AlertHelper.setDropDown(ref)}
  //     />
  //   );
  // };

  useEffect(() => {
    if (isLoggedIn) {
      console.log("log in user ");
    } else {
      console.log("log out user ");
    }
  }, [isLoggedIn]);

  return isLaunched ? (
    isLoggedIn ? (
      recom_loading || plan_loading || room_loading || me_loading ? (
        <Loader />
      ) : (
        <View style={{ flex: 1 }}>
          <MainNavigation screenProps={actionSheet} />
          <DropdownAlert
            containerStyle={{
              paddingTop: Platform.OS === "android" ? 40 : 0
            }}
            ref={ref => AlertHelper.setDropDown(ref)}
            closeInterval={1000}
          />
        </View>
      )
    ) : (
      <View style={{ flex: 1 }}>
        <AuthNavigation />
        <DropdownAlert
          containerStyle={{
            paddingTop: Platform.OS === "android" ? 40 : 0
          }}
          ref={ref => AlertHelper.setDropDown(ref)}
          closeInterval={1000}
        />
      </View>
    )
  ) : (
    <AppIntro />
  );
};
