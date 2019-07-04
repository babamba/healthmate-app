import React, { useState } from "react";
import { ScrollView, RefreshControl, SafeAreaView } from "react-native";
import styled from "styled-components";
//import { gql } from "apollo-boost";
import Loader from "../../components/Loader";
import { useQuery } from "react-apollo-hooks";
import Post from "../../components/Post";
import HorizontalUser from "../../components/HorizontalUser";
import { ENTRIES_USER } from "../../EntryData/Entries";
import constants from "../../constants";
//import { POST_FRAGMENT } from "../../fragments";

// export const FEED_QUERY = gql`
//   {
//     seeFeed {
//       ...PostParts
//     }
//   }
//   ${POST_FRAGMENT}
// `;

export default () => {
  //   const [refreshing, setRefreshing] = useState(false);
  //   //const { loading, data, refetch } = useQuery(FEED_QUERY);
  //   const refresh = async () => {
  //     try {
  //       setRefreshing(true);
  //       //await refetch();
  //     } catch (e) {
  //       console.log(e);
  //     } finally {
  //       setRefreshing(false);
  //     }
  //   };
  const MainTitleArea = styled.View`
    flex: 1;
    width: ${constants.width};
    padding-top: 15px;
    padding-bottom: 30px;
    margin-horizontal: 15px;
  `;

  const MainTitle = styled.Text`
    color: black;
    text-align: left;
    font-weight: 600;
    font-size: 52px;
    font-family: swagger;
  `;

  const SubTitleArea = styled.View`
    flex: 1;
    width: ${constants.width};
    padding: 15px;
  `;

  const SubTitle = styled.Text`
    color: black;
    text-align: left;
    font-weight: 100;
    font-size: 18px;
    font-family: swagger;
  `;

  return (
    <SafeAreaView>
      <ScrollView
      //    refreshControl={
      //      <RefreshControl refreshing={refreshing} onRefresh={refresh} />
      //    }
      >
        <MainTitleArea>
          <MainTitle>메이트</MainTitle>
        </MainTitleArea>

        <SubTitleArea>
          <SubTitle>근처 친구들</SubTitle>
        </SubTitleArea>

        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {ENTRIES_USER.map((data, index) => (
            <HorizontalUser key={index} {...data} />
          ))}
        </ScrollView>

        {/* {loading ? (
        <Loader />
      ) : (
        data &&
        data.seeFeed &&
        data.seeFeed.map(post => <Post key={post.id} {...post} />)
      )} */}
      </ScrollView>
    </SafeAreaView>
  );
};
