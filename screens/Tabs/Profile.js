import React, { useEffect } from "react";
import { ScrollView } from "react-native";
import gql from "graphql-tag";
import styled from "styled-components";
import { USER_FRAGMENT } from "../../fragments";
import Loader from "../../components/Loader";
import { useQuery } from "react-apollo-hooks";
import UserProfile from "../../components/UserProfile";
import constants from "../../constants";
import { SafeAreaView } from "react-navigation";
import MainTitle from "../../components/MainTitle";

export const ME = gql`
  {
    me {
      ...UserParts
    }
  }
  ${USER_FRAGMENT}
`;

export default ({ navigation }) => {
  const { loading, data } = useQuery(ME, {
    fetchPolicy: "network-only"
  });
  //console.log("profile data : ", data);
  return (
    <SafeAreaView
      style={constants.commonStyle.safeArea}
      forceInset={{ top: "always" }}
    >
      <MainTitle title={"Profile"} />
      <ScrollView>
        {loading ? <Loader /> : data && data.me && <UserProfile {...data.me} />}
      </ScrollView>
    </SafeAreaView>
  );
};
