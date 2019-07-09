import React, { useState, useEffect } from "react";
import { View } from "react-native";
import styled from "styled-components";

import { gql } from "apollo-boost";
import { useQuery, useMutation } from "react-apollo-hooks";
import Loader from "./Loader";

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
  let sendText = "";
  let tempMessage = [];

  const roomId = navigation.getParam("roomId");
  const me = navigation.getParam("me");
  const message = navigation.getParam("messages").map(data =>
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

  //   const [messages, setMessages] = useState(tempMessage);

  //   const { loading, data } = useQuery(SEE_ROOM, {
  //     variables: { roomId: navigation.getParam("roomId") },
  //     fetchPolicy: "network-only"
  //   });

  const [messages, setMessages] = useState(message);

  useEffect(() => {
    console.log("렌더링");
    console.log("messages: ", messages);
  }, [messages]);

  const SendMessageMutation = useMutation(SEND_MESSAGE);

  const onSend = async sendMessage => {
    sendText = sendMessage[0].text;

    //     console.log("roomId : ", roomId);
    //     console.log("sendText : ", sendText);

    const { data } = await SendMessageMutation({
      variables: {
        roomId,
        message: sendText
      }
    });

    const newMessage = {
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

    setMessages(GiftedChat.append(messages, newMessage));
  };

  //   if (data) {
  //     console.log("load data");
  //     if (data.seeRoom) {
  //       //console.log(data.seeRoom.messages);
  //       //  console.log("not undefind");
  //       data.seeRoom.messages = data.seeRoom.messages.map((data, index) =>
  //         // console.log("user id", data.from.id),
  //         // console.log("data id *****: ", data.id),
  //         ({
  //           _id: data.id,
  //           user: {
  //             _id: data.from.id,
  //             name: data.from.username,
  //             avatar: data.from.avatar
  //           },
  //           ...data
  //         })
  //       );

  //       //console.log("load", data.seeRoom.messages);
  //       tempMessage = data.seeRoom.messages;
  //     }
  //   }

  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: me.id
        }}
      />
      {/* {loading ? (
        <Loader />
      ) : (
        data && (
          <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
              _id: data.seeRoom.me.id
            }}
          />
        )
      )} */}
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
