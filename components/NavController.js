import React, { useEffect, useState } from "react";
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
  subscription ReceiveMessage($userId: String!) {
    ReceiveMessage(userId: $userId) {
      text
      id
      from {
        id
        avatar
        username
      }
      to {
        username
      }
      createdAt
      room {
        lastMessage {
          text
        }
      }
      user {
        _id
        name
        avatar
      }
      _id
    }
  }
`;

export default props => {
  const isLaunched = useIsLaunchedApp();
  const isLoggedIn = useIsLoggedIn();
  const [userId, setUserId] = useState();
  const actionSheet = props.showActionSheetWithOptions;

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

  useEffect(() => {
    if (isLoggedIn && me_data.me) {
      console.log("me", me_data.me.id);
      setUserId(me_data.me.id);
      //handleReceiveSub(me_data.me.id);
    }
  }, [me_data]);

  const { data: SubData } = useSubscription(RECEIVE_MESSAGE, {
    variables: {
      userId
    },
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
    skip: !userId
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
