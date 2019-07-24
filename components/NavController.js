import React, { useEffect } from "react";
import { useIsLoggedIn, useIsLaunchedApp } from "../AuthContext";
import { useQuery } from "react-apollo-hooks";
import gql from "graphql-tag";
import AuthNavigation from "../navigation/AuthNavigation";
import MainNavigation from "../navigation/MainNavigation";
import Loader from "./Loader";
import { SEE_PLAN } from "../screens/Tabs/Plan";
import { RECOMMEND_USER } from "../screens/Tabs/Main";
import { ME } from "../screens/Tabs/Profile";
import { SEE_ROOMS } from "../screens/Tabs/Chat";
import AppIntro from "../screens/Intro/Intro";

export default props => {
  const isLaunched = useIsLaunchedApp();
  const isLoggedIn = useIsLoggedIn();
  const actionSheet = props.showActionSheetWithOptions;

  console.log("isLaunched : ", isLaunched);

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
    error: room_error
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
        <MainNavigation screenProps={actionSheet} />
      )
    ) : (
      <AuthNavigation />
    )
  ) : (
    <AppIntro />
  );

  // return isLoggedIn ? (
  //   recom_loading || plan_loading || room_loading || me_loading ? (
  //     <Loader />
  //   ) : (
  //     <MainNavigation screenProps={actionSheet} />
  //   )
  // ) : (
  //   <AuthNavigation />
  // );

  //return isLoggedIn ? <MainNavigation /> : <AuthNavigation />;
};
