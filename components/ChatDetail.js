import React, { useState, useEffect } from "react";
import { View } from "react-native";
import styled from "styled-components";

import { gql } from "apollo-boost";
import { useQuery, useMutation, useSubscription } from "react-apollo-hooks";
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

export const NEW_MESSAGE = gql`
  subscription newMessage($roomId: String!) {
    newMessage(roomId: $roomId) {
      text
      id
      from {
        id
        avatar
        username
      }
      #  room {
      #    messages {
      #      text
      #    }
      #  }
    }
  }
`;

const ChatDetail = ({ navigation }) => {
  const roomId = navigation.getParam("roomId");
  let postMessage = "";
  let tempMessage;

  // 초기 메시지 리스트
  const {
    data: { seeRoom: initialRoomData }
  } = useQuery(SEE_ROOM, {
    variables: { roomId: navigation.getParam("roomId") },
    suspend: true
  });

  const [me] = useState(initialRoomData.me);
  const [messagesList, setMessageList] = useState(
    rewriteList(initialRoomData.messages) || []
  );

  // react-native gift-chat에 맞춰 object 수정
  function rewriteList(list) {
    if (list) {
      tempMessage = list.map(message => ({
        _id: message.id,
        text: message.text,
        user: {
          _id: message.from.id,
          name: message.from.username,
          avatar: message.from.avatar
        },
        ...message
      }));
      return tempMessage;
    }
  }

  // 구독 상태 관리
  console.log("roomId : ", roomId);
  const { data } = useSubscription(NEW_MESSAGE, {
    variables: {
      roomId
    },
    onSubscriptionData: ({ client, subscriptionData }) => {
      console.log("onSubscriptionData", subscriptionData);
    }
  });

  const handleNewMessage = () => {
    if (data !== undefined) {
      console.log("handleNewMessage data :", data);
      if (data.subscription !== undefined) {
        onsole.log("subscription :", data.subscription);
        if (data.subscription.newMessage !== null) {
          console.log("subscription updated : ", data.subscription.newMessage);
          const { messages } = initialRoomData;
          tempMessage = rewriteList(messages);
          setMessageList(GiftedChat.append(messagesList, tempMessage));
        }
      }
    }
  };

  useEffect(() => {
    handleNewMessage();
  }, [data]);

  // 메시지 보내기
  const SendMessageMutation = useMutation(SEND_MESSAGE);
  const onSend = async sendMessage => {
    console.log("sendMessage : ", sendMessage[0].text);
    if (sendMessage[0].text === "") {
      return;
    }

    sendText = sendMessage[0].text;
    try {
      const { data } = await SendMessageMutation({
        variables: {
          roomId,
          message: sendText
        }
      });

      postMessage = {
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

      setMessageList(GiftedChat.append(messagesList, postMessage));
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messagesList}
        onSend={messages => onSend(messages)}
        user={{
          _id: me.id
        }}
      />
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
