import React, { useState, useEffect } from "react";
import { View } from "react-native";
import styled from "styled-components";

import { gql } from "apollo-boost";
import { useQuery, useMutation, useSubscription } from "react-apollo-hooks";
import Loader from "./Loader";
import withSuspense from "../withSuspense";

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

// function ChatDetail(props) {
const ChatDetail = ({ navigation }) => {
  const roomId = navigation.getParam("roomId");
  //const { navigation } = props;

  let postMessage = "";
  let tempMessage;

  // 초기 메시지 리스트
  const { data, loading, error } = useQuery(SEE_ROOM, {
    variables: { roomId: navigation.getParam("roomId") },
    fetchPolicy: "network-only"
  });

  const [messagesList, setMessageList] = useState();

  // react-native gift-chat에 맞춰 object 수정
  function rewriteList(list) {
    if (list) {
      if (Array.isArray(list) === true) {
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
      } else {
        tempMessage = {
          _id: list.id,
          text: list.text,
          user: {
            _id: list.from.id,
            name: list.from.username,
            avatar: list.from.avatar
          },
          ...list
        };
      }
      return tempMessage;
    }
  }

  // 구독 상태 관리
  console.log("roomId : ", roomId);
  const { data: newSubscription } = useSubscription(NEW_MESSAGE, {
    variables: {
      roomId
    },
    onSubscriptionData: ({ client, subscriptionData }) => {
      //console.log("onSubscriptionData", subscriptionData);
    }
  });

  const handleNewMessage = () => {
    if (newSubscription !== undefined) {
      console.log("newSubscription");
      if (newSubscription.newMessage !== null) {
        console.log("subscription updated : ", newSubscription.newMessage);
        tempMessage = rewriteList(newSubscription.newMessage);
        setMessageList(GiftedChat.append(messagesList, tempMessage));
      }
    }
  };

  useEffect(() => {
    handleNewMessage();
  }, [newSubscription]);

  useEffect(() => {
    /* TODO 나중에 캐시와 비교해서 업데이트된 
      채팅메시지가 있으면 
      setMessageList(GiftedChat.append(업데이트))
      하도록 하자 일단은 network only
     */
    // if (messagesList !== undefined && messagesList.length > 0) {
    //   console.log("messagesList : ", messagesList.length);
    //   console.log("data.seeRoom.messages : ", data.seeRoom.messages.length);
    //   if (messagesList.length !== data.seeRoom.messages.length) {
    //     const updatedMessage = data.seeRoom.messages.filter(
    //       (messages, index) => {
    //         console.log("loadedMessage : ", messagesList[index]);
    //         console.log("messagesList : ", data.seeRoom.messages[index]);
    //         return messagesList[index].id !== data.seeRoom.messages[index].id;
    //       }
    //     );
    //     console.log(updatedMessage);
    //   }
    // }
  }, [messagesList]);

  useEffect(() => {
    const onCompleted = data => {
      //console.log(data);
      setMessageList(rewriteList(data.seeRoom.messages));
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

      // postMessage = {
      //   _id: data.sendMessage.id,
      //   text: data.sendMessage.text,
      //   createdAt: data.sendMessage.createdAt,
      //   user: {
      //     _id: data.sendMessage.from.id,
      //     name: data.sendMessage.from.username,
      //     avatar: data.sendMessage.from.avatar
      //   },
      //   from: data.sendMessage.from
      // };

      //setMessageList(GiftedChat.append(messagesList, postMessage));
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <Loader />
      ) : (
        data && (
          <GiftedChat
            messages={messagesList}
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
