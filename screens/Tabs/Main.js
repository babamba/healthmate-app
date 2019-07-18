import React, { useState } from "react";
import { ScrollView, RefreshControl } from "react-native";
import styled from "styled-components";
import gql from "graphql-tag";
import Loader from "../../components/Loader";
import { useQuery, useApolloClient } from "react-apollo-hooks";
import Post from "../../components/Post";
import HorizontalContent from "../../components/HorizontalContent";
import SquareContent from "../../components/SquareContent";

import { ENTRIES_NEAR, ENTRIES_CONTENT } from "../../EntryData/Entries"; // 더미 데이터
import constants from "../../constants";
import { SafeAreaView } from "react-navigation";
//import { POST_FRAGMENT } from "../../fragments";

// export const FEED_QUERY = gql`
//   {
//     seeFeed {
//       ...PostParts
//     }
//   }
//   ${POST_FRAGMENT}
// `;

export const RECOMMEND_USER = gql`
  query recommendUser {
    recommendUser {
      id
      username
      avatar
      email
      location {
        address
        latitude
        longitude
      }
      lastPlan {
        planTitle
      }
    }
  }
`;

export default () => {
  const { loading, data, error } = useQuery(RECOMMEND_USER, {
    fetchPolicy: "network-only"
  });

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
  const View = styled.View`
    justify-content: center;
    align-items: center;
    flex: 1;
  `;

  const MainTitleArea = styled.View`
    width: ${constants.width};
    padding-top: 15px;
    padding-bottom: 15px;
    padding-horizontal: 20px;
  `;

  const MainTitle = styled.Text`
    color: black;
    text-align: left;
    font-weight: 300;
    font-size: 52px;
    font-family: NotoSansKR_Bold;
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
    font-family: NotoSansKR_Medium;
  `;

  const Container = styled.View`
    flex: 1;
    padding-vertical: 15px;
    width: ${constants.width};
  `;

  const Row = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
  `;

  // const client = useApolloClient();
  // let cacheData = client.cache.readQuery({
  //   query: RECOMMEND_USER
  // });

  // console.log("cacheData", cacheData);

  return (
    <SafeAreaView
      style={constants.commonStyle.safeArea}
      forceInset={{ top: "always" }}
    >
      <View>
        <MainTitleArea>
          <MainTitle>메인</MainTitle>
        </MainTitleArea>
        <ScrollView
        //    refreshControl={
        //      <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        //    }
        >
          <Container>
            <SubTitleArea>
              <SubTitle>근처 친구들</SubTitle>
            </SubTitleArea>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              {loading ? (
                <Loader />
              ) : (
                data &&
                data.recommendUser &&
                data.recommendUser.map((data, index) => (
                  <HorizontalContent key={index} {...data} />
                ))
              )}
              {/* {ENTRIES_NEAR.map((data, index) => (
                <HorizontalContent key={index} {...data} />
              ))} */}
            </ScrollView>
          </Container>

          <Container>
            <SubTitleArea>
              <SubTitle>7월 추천 컨텐츠</SubTitle>
            </SubTitleArea>

            <ScrollView>
              <Row>
                {ENTRIES_CONTENT.map((data, index) => (
                  <SquareContent key={index} {...data} />
                ))}
              </Row>
            </ScrollView>
          </Container>

          {/* {loading ? (
        <Loader />
      ) : (
        data &&
        data.seeFeed &&
        data.seeFeed.map(post => <Post key={post.id} {...post} />)
      )} */}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
