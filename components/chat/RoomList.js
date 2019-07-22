import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Alert, Platform } from "react-native";
import gql from "graphql-tag";
import { useSubscription } from "react-apollo-hooks";
import { withNavigation } from "react-navigation";
import PropTypes from "prop-types";
import styled from "styled-components";
import constants from "../../constants";

const Conatiner = styled.View`
  flex: 1;
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

export const UPDATE_ROOM_MESSAGE = gql`
  subscription newMessage($roomId: String!) {
    newMessage(roomId: $roomId) {
      text
      id
      room {
        lastMessage {
          text
        }
      }
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
  me,
  RootChatScreenRefetch
}) => {
  // console.log("roomId : ", id);
  // console.log("navigation ", navigation);
  //console.log("person :", person);
  // console.log("participants :", participants);
  // console.log("lastMessage :", lastMessage);
  //console.log("messages : ", messages);
  const [lastMessages, setLastMessage] = useState(lastMessage[0].text);
  // const [roomUsers, setRoomUsers] = useState();
  let userlist = "";

  person.map((user, index) => {
    const separator = ", ";
    //console.log(person.length);

    if (person.length === 1) {
      //console.log("person.length = 0");
      userlist += user.username;
    } else {
      //console.log("person.length > 0");
      if (index !== person.length - 1) {
        userlist += user.username + separator;
      } else {
        userlist += user.username;
      }
    }
  });

  //console.log("userlist : ", userlist);

  const { data: updateMessage } = useSubscription(UPDATE_ROOM_MESSAGE, {
    variables: {
      roomId: id
    },
    onSubscriptionData: ({ client, subscriptionData }) => {
      //console.log("onSubscriptionData", subscriptionData);
    }
  });

  const handleRoomList = () => {
    if (updateMessage !== undefined) {
      //console.log("handle room list : ", updateMessage);
      if (updateMessage.newMessage !== undefined) {
        //console.log("subscription :", data.newMessage);
        //console.log("updateMessage ! ");
        if (updateMessage.newMessage !== null) {
          console.log("subscription updated : ", updateMessage.newMessage);
          const { text } = updateMessage.newMessage;
          setLastMessage(text);
          RootChatScreenRefetch();
        }
      }
    }
  };

  useEffect(() => {
    handleRoomList();
  }, [updateMessage]);

  useEffect(() => {
    //console.log(lastMessage);
  }, [lastMessage]);

  return (
    <Conatiner>
      {/* <TouchableOpacity onPress={() => navigation.navigate("Detail", { id })}> */}
      <TouchableOpacity
        //onLongPress={() => testAlert(id)}
        onPress={() =>
          navigation.navigate("ChatDetail", {
            roomId: id,
            RootChatScreenRefetch,
            messages,
            me,
            userlist
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
