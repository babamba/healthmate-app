import React, { useEffect } from "react";
import { useIsLoggedIn } from "../AuthContext";
import { useQuery } from "react-apollo-hooks";
import gql from "graphql-tag";
import AuthNavigation from "../navigation/AuthNavigation";
import MainNavigation from "../navigation/MainNavigation";
import Loader from "./Loader";
import { SEE_PLAN } from "../screens/Tabs/Plan";
import { RECOMMEND_USER } from "../screens/Tabs/Main";

export default () => {
  const isLoggedIn = useIsLoggedIn();

  if (isLoggedIn) {
    console.log("isLoggedin");

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

    useEffect(() => {
      const onCompleted = data => {
        console.log("onCompleted recommend ");
      };
      const onError = error => {
        console.log("error initial load data");
      };
      if (onCompleted || onError) {
        if (onCompleted && !recom_loading && !recom_error) {
          onCompleted(data);
        } else if (onError && !recom_loading && recom_error) {
          onError(error);
        }
      }
    }, [recom_loading, recom_error]);

    useEffect(() => {
      const onCompleted = data => {
        console.log("onCompleted plan ");
      };
      const onError = error => {
        console.log("error initial load data");
      };
      if (onCompleted || onError) {
        if (onCompleted && !plan_loading && !plan_error) {
          onCompleted(data);
        } else if (onError && !plan_loading && plan_error) {
          onError(error);
        }
      }
    }, [plan_loading, plan_error]);

    return recom_loading && plan_loading ? <Loader /> : <MainNavigation />;
  } else {
    console.log("Log in please");
    return <AuthNavigation />;
  }

  //return isLoggedIn ? <MainNavigation /> : <AuthNavigation />;
};
