import React, { useState, useEffect } from "react";
import { View } from "react-native";
import styled from "styled-components";

import { gql } from "apollo-boost";
import { useQuery, useMutation } from "react-apollo-hooks";
import Loader from "../components/Loader";

import { GiftedChat } from "react-native-gifted-chat";

export const SEE_ROOM = gql`
  query seeRoom($roomId: String!) {
    seeRoom(id: $roomId) {
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

      me {
        username
        id
        avatar
      }
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation sendMessage($roomId: String, $message: String!) {
    sendMessage(roomId: $roomId, message: $message) {
      id
      text
      from {
        id
        avatar
        username
      }
      createdAt
    }
  }
`;

const ChatDetail = ({ navigation }) => {
  let me;
  let sendText = "";
  let tempMessage = [];
  const roomId = navigation.getParam("roomId");

  //   useEffect(() => {
  //     console.log("렌더링이 완료되었습니다!");
  //     setMessages(tempMessage);
  //   }, []);

  const [messages, setMessages] = useState([]);
  const { loading, data } = useQuery(SEE_ROOM, {
    variables: { roomId: navigation.getParam("roomId") },
    fetchPolicy: "network-only"
  });

  const SendMessageMutation = useMutation(SEND_MESSAGE);

  const onSend = async sendMessage => {
    sendText = sendMessage[0].text;

    try {
      console.log("roomId : ", roomId);
      console.log("sendText : ", sendText);

      const { data } = await SendMessageMutation({
        variables: {
          roomId,
          message: sendText
        }
      });
      console.log("response data", data);

      let newMessage = await {
        _id: data.sendMessage.id,
        text: data.sendMessage.text,
        createdAt: data.sendMessage.createdAt,
        user: {
          _id: data.sendMessage.from.id,
          name: data.sendMessage.from.username,
          avatar: data.sendMessage.from.avatar
        },
        from: data.sendMessage.from
      };

      console.log("onSend", newMessage);
      tempMessage = tempMessage.unshift(newMessage);

      console.log("add new Mes : ", tempMessage);
      setMessages(tempMessage);

      console.log("messages : ", messages);

      console.log("temp message !@# : ", messages);
    } catch (e) {
      console.log("error :", e);
    }
  };

  if (data) {
    console.log("load data");
    if (data.seeRoom) {
      //console.log(data.seeRoom.messages);
      //  console.log("not undefind");
      data.seeRoom.messages = data.seeRoom.messages.map((data, index) =>
        // console.log("user id", data.from.id),
        // console.log("data id *****: ", data.id),
        ({
          _id: data.id,
          user: {
            _id: data.from.id,
            name: data.from.username,
            avatar: data.from.avatar
          },
          ...data
        })
      );

      tempMessage = data.seeRoom.messages;
      me = {
        __typename: "User",
        avatar: data.seeRoom.me.avatar,
        id: data.seeRoom.me.id,
        username: data.seeRoom.me.username
      };
      //console.log("render message", tempMessages);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <Loader />
      ) : (
        data && (
          <GiftedChat
            messages={data.seeRoom.messages}
            onSend={sendMessage => onSend(sendMessage)}
            user={{
              _id: data.seeRoom.me.id
            }}
          />
        )
      )}
    </View>
    // <GiftedChat
    //     messages={this.state.messages}
    //     onSend={messages => this.onSend(messages)}
    //     user={{
    //       _id: 1
    //     }}
    // />
  );
};

export default ChatDetail;
