import React, { useState } from "react";
import { ScrollView, RefreshControl, StyleSheet } from "react-native";
import styled from "styled-components";
import gql from "graphql-tag";
import Loader from "../../components/Loader";
import { useQuery } from "react-apollo-hooks";
import Post from "../../components/Post";
import HorizontalContent from "../../components/HorizontalContent";
import SquareContent from "../../components/SquareContent";

import { ENTRIES_NEAR, ENTRIES_CONTENT } from "../../EntryData/Entries"; // 더미 데이터
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
  const SafeAreaView = styled.SafeAreaView`
    justify-content: center;
    align-items: center;
    flex: 1;
  `;

  const View = styled.View`
    justify-content: center;
    align-items: center;
    flex: 1;
  `;

  const MainTitleArea = styled.View`
    width: ${constants.width};
    padding-top: 15px;
    padding-bottom: 20px;
    margin-horizontal: 15px;
  `;

  const MainTitle = styled.Text`
    color: black;
    text-align: left;
    font-weight: 600;
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
    margin-vertical: 20px;
    width: ${constants.width};
  `;

  const Row = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
  `;

  return (
    <SafeAreaView>
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
              {ENTRIES_NEAR.map((data, index) => (
                <HorizontalContent key={index} {...data} />
              ))}
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
