import React from "react";
import { gql } from "apollo-boost";
import { useQuery } from "react-apollo-hooks";
import styled from "styled-components";
import { ScrollView, RefreshControl, SafeAreaView } from "react-native";
import RoomList from "../../components/RoomList";
import Loader from "../../components/Loader";
import constants from "../../constants";
import withSuspense from "../../withSuspense";

export const SEE_ROOMS = gql`
  query seeRooms {
    seeRooms {
      id
      participants {
        username
      }
      messages {
        id
        text
        from {
          id
          username
          avatar
        }
        to {
          username
        }
        createdAt
      }
      lastMessage {
        text
      }
      person {
        username
        avatar
      }
      me {
        username
        id
        avatar
      }
    }
  }
`;

// const View = styled.View`
//   justify-content: center;
//   align-items: center;
//   flex: 1;
// `;

const Header = styled.View`
  width: ${constants.width};
  padding-top: 15px;
  padding-bottom: 20px;
  margin-horizontal: 15px;
  flex-direction: row;
  text-align: center;
`;

const Content = styled.View`
  width: ${constants.width};
`;

const ScreenTitle = styled.Text`
  flex: 0.85;
  color: black;
  font-weight: 600;
  font-size: 32px;
  font-family: NotoSansKR_Bold;
`;

const AddButton = styled.View`
  flex: 0.15;
  text-align: left;
`;

function Chat() {
  const { loading, data, refetch } = useQuery(SEE_ROOMS, {
    suspend: true
  });

  return (
    <SafeAreaView>
      <Header>
        <ScreenTitle>Direct Message</ScreenTitle>
      </Header>
      <ScrollView>
        {/* {ENTRIES_PLAN.map((data, index) => (
          <PlanContentList key={index} {...data} />
        ))} */}
        {loading ? (
          <Loader />
        ) : (
          data &&
          data.seeRooms &&
          data.seeRooms.map((data, index) => {
            return <RoomList key={index} {...data} />;
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default withSuspense(Chat);
