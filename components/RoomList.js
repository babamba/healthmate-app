import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Alert, Platform } from "react-native";
import { gql } from "apollo-boost";
import { useSubscription } from "react-apollo-hooks";
import { withNavigation } from "react-navigation";
import PropTypes from "prop-types";
import styled from "styled-components";
import constants from "../constants";

const Conatiner = styled.View`
  padding-vertical: 8px;
  padding-horizontal: 8px;
  border-radius: 10px;
  margin-left: 10px;
  margin-left: 10px;
  /* shadow-opacity: 0.75;
  shadow-radius: 5px;
  shadow-color: #000;
  shadow-offset: 0px 0px; */
`;

const TextContainer = styled.View`
  flex: 1;
  margin-top: 10px;
  flex-direction: row;
`;

const Image = styled.Image`
  flex:1;
  width:40px;
  height:40px;
  /* width: ${constants.width / 2.2};
  height: ${constants.height / 5}; */
  border-radius: 15;
`;

const ContentTItle = styled.Text`
  color: black;
  text-align: left;
  font-weight: 600;
  font-size: 18px;
  font-family: NotoSansKR_Regular;
`;

const Introduction = styled.Text`
  color: black;
  text-align: left;
  font-weight: 600;
  font-size: 13px;
  font-family: NotoSansKR_Regular;
`;

const UserName = styled.Text`
  color: black;
  text-align: left;
  font-weight: 600;
  font-size: 18px;
  font-family: NotoSansKR_Regular;
`;

const Column = styled.View`
  flex: 0.2;
  flex-direction: column;
`;

const Row = styled.View`
  flex: 0.8;
  flex-direction: row;
  justify-content: flex-start;
`;

export const NEW_MESSAGE = gql`
  subscription newMessage($roomId: String!) {
    newMessage(roomId: $roomId) {
      text
    }
  }
`;

const RoomList = ({
  navigation,
  id,
  participants,
  lastMessage,
  person,
  messages,
  me
}) => {
  // console.log("roomId : ", id);
  // console.log("navigation ", navigation);
  // console.log("person :", person);
  // console.log("participants :", participants);
  // console.log("lastMessage :", lastMessage);
  //console.log("messages : ", messages);
  const [lastMessages, setLastMessage] = useState(lastMessage[0].text);

  const { data } = useSubscription(NEW_MESSAGE, {
    variables: {
      roomId: id
    },
    onSubscriptionData: ({ client, subscriptionData }) => {
      console.log("onSubscriptionData", subscriptionData);
    }
  });

  const handleRoomList = () => {
    if (data !== undefined) {
      console.log("handleNewMessage data :", data);
      if (data.subscription !== undefined) {
        onsole.log("subscription :", data.subscription);
        if (data.subscription.newMessage !== null) {
          console.log("subscription updated : ", data.subscription.newMessage);
          const { text } = data.subscription.newMessage;
          setLastMessage(lastMessages);
        }
      }
    }
  };

  useEffect(() => {
    handleRoomList();
  }, [data]);

  return (
    <Conatiner>
      {/* <TouchableOpacity onPress={() => navigation.navigate("Detail", { id })}> */}
      <TouchableOpacity
        //onLongPress={() => testAlert(id)}
        onPress={() =>
          navigation.navigate("ChatDetail", {
            roomId: id
          })
        }
      >
        {/* <Image source={{ uri }} /> */}
        <TextContainer>
          <Column>
            {/* <ContentTItle /> */}
            <Image source={{ uri: person[0].avatar }} />
          </Column>
          <Row>
            <Introduction>{lastMessages}</Introduction>
          </Row>
        </TextContainer>
      </TouchableOpacity>
    </Conatiner>
  );
};

// PlanContentList.propTypes = {
//   files: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.string.isRequired,
//       url: PropTypes.string.isRequired
//     })
//   ).isRequired,
//   id: PropTypes.string.isRequired
// };

export default withNavigation(RoomList);