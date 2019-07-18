import React, { useState, useEffect } from "react";
import gql from "graphql-tag";
import { useQuery } from "react-apollo-hooks";
import styled from "styled-components";
import { ScrollView, RefreshControl } from "react-native";
import RoomList from "../../components/RoomList";
import Loader from "../../components/Loader";
import constants from "../../constants";
import { SafeAreaView } from "react-navigation";
import withSuspense from "../../withSuspense";
import MainTitle from "../../components/MainTitle";

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
  flex: 1;
`;

const Container = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Content = styled.View`
  flex: 11;
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

// function Chat() {
const Chat = () => {
  const [initialStarted, setInitialStarted] = useState(false);

  const { data, loading, error, refetch } = useQuery(SEE_ROOMS, {
    fetchPolicy: "network-only"
  });

  useEffect(() => {
    const onCompleted = data => {
      setInitialStarted(true);
    };

    const onError = error => {
      console.log("error initial load data");
    };

    if (onCompleted || onError) {
      if (onCompleted && !loading && !error) {
        onCompleted(data);
      } else if (onError && !loading && error) {
        onError(error);
      }
    }
  }, [data, loading, error]);

  return (
    <SafeAreaView
      style={constants.commonStyle.safeArea}
      forceInset={{ top: "always" }}
    >
      <MainTitle title={"Direct Message"} fontSize={42} />
      <Container>
        <Content>
          <ScrollView>
            {/* {ENTRIES_PLAN.map((data, index) => (
          <PlanContentList key={index} {...data} />
        ))} */}

            {loading
              ? !initialStarted && <Loader />
              : data &&
                data.seeRooms &&
                data.seeRooms.map((data, index) => {
                  return (
                    <RoomList
                      key={index}
                      {...data}
                      RootChatScreenRefetch={refetch}
                    />
                  );
                })}

            {/* {data &&
              data.seeRooms &&
              data.seeRooms.map((data, index) => {
                return (
                  <RoomList
                    key={index}
                    {...data}
                    RootChatScreenRefetch={refetch}
                  />
                );
              })} */}

            {/* {loading ? (
          <Loader />
        ) : (
          data &&
          data.seeRooms &&
          data.seeRooms.map((data, index) => {
            return (
              <RoomList key={index} {...data} RootChatScreenRefetch={refetch} />
            );
          })
        )} */}
          </ScrollView>
        </Content>
      </Container>
    </SafeAreaView>
  );
};

export default Chat;
