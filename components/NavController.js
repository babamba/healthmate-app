import React, { useEffect } from "react";
import { useIsLoggedIn } from "../AuthContext";
import { useQuery } from "react-apollo-hooks";
import gql from "graphql-tag";
import AuthNavigation from "../navigation/AuthNavigation";
import MainNavigation from "../navigation/MainNavigation";
import Loader from "./Loader";
import { SEE_PLAN } from "../screens/Tabs/Plan";
import { RECOMMEND_USER } from "../screens/Tabs/Main";
import { ME } from "../screens/Tabs/Profile";
import { SEE_ROOMS } from "../screens/Tabs/Chat";

export default props => {
  const isLoggedIn = useIsLoggedIn();
  const actionSheet = props.showActionSheetWithOptions;

  const {
    data: recom_data,
    loading: recom_loading,
    error: recom_error
  } = useQuery(RECOMMEND_USER, {
    fetchPolicy: "network-only"
  });

  const {
    data: plan_data,
    loading: plan_loading,
    error: plan_error
  } = useQuery(SEE_PLAN, {
    fetchPolicy: "network-only"
  });

  const { loading: me_loading, data: me_data, error: me_error } = useQuery(ME, {
    fetchPolicy: "network-only"
  });

  const {
    data: room_data,
    loading: room_loading,
    error: room_error
  } = useQuery(SEE_ROOMS, {
    fetchPolicy: "network-only"
  });

  useEffect(() => {
    if (isLoggedIn) {
      console.log("log in user ");
    } else {
      console.log("log out user ");
    }
  }, [isLoggedIn]);

  return isLoggedIn ? (
    recom_loading || plan_loading || room_loading || me_loading ? (
      <Loader />
    ) : (
      <MainNavigation screenProps={actionSheet} />
    )
  ) : (
    <AuthNavigation />
  );

  //return isLoggedIn ? <MainNavigation /> : <AuthNavigation />;
};
