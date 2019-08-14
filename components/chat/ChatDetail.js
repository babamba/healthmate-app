import React, { useState, useEffect } from "react";
import { View } from "react-native";
import styled from "styled-components";

import gql from "graphql-tag";
import {
  useQuery,
  useMutation,
  useSubscription,
  useApolloClient
} from "react-apollo-hooks";

import { GiftedChat } from "react-native-gifted-chat";
import Loader from "../Loader";
import { SEE_ROOMS } from "../../screens/Tabs/Chat";

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
        user {
          _id
          name
          avatar
        }
        _id
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
      to {
        username
      }
      createdAt
      user {
        _id
        name
        avatar
      }
      _id
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
      to {
        username
      }
      createdAt
      room {
        lastMessage {
          text
        }
      }
      user {
        _id
        name
        avatar
      }
      _id
    }
  }
`;

// function ChatDetail(props) {
const ChatDetail = ({ navigation }) => {
  const client = useApolloClient();
  const roomId = navigation.getParam("roomId");
  const me_param = navigation.getParam("me");
  const messages_param = navigation.getParam("message");
  const setParentLastMessage = navigation.getParam("setLastMessage");

  // 초기 메시지 리스트
  const { data, loading, error } = useQuery(SEE_ROOM, {
    variables: { roomId },
    fetchPolicy: "network-only"
  });

  const [messagesList, setMessageList] = useState(messages_param);
  const [userSelf, setUserSelf] = useState(me_param);

  // react-native gift-chat에 맞춰 object 수정
  // function rewriteList(list) {
  //   if (list) {
  //     if (Array.isArray(list) === true) {
  //       tempMessage = list.map(message => ({
  //         _id: message.id,
  //         text: message.text,
  //         user: {
  //           _id: message.from.id,
  //           name: message.from.username,
  //           avatar: message.from.avatar
  //         },
  //         ...message
  //       }));
  //     } else {
  //       tempMessage = {
  //         _id: list.id,
  //         text: list.text,
  //         user: {
  //           _id: list.from.id,
  //           name: list.from.username,
  //           avatar: list.from.avatar
  //         },
  //         ...list
  //       };
  //     }
  //     return tempMessage;
  //   }
  // }

  // 구독 상태 관리
  //console.log("roomId : ", roomId);
  const { data: newSubscription } = useSubscription(NEW_MESSAGE, {
    variables: {
      roomId
    },
    onSubscriptionData: ({ client, subscriptionData }) => {
      console.log("ChatDetail subscriptionData : ", subscriptionData);
      handleNewMessage();
    }
  });

  const handleNewMessage = async () => {
    console.log("handleNewMessage : ", newSubscription);
    if (newSubscription !== undefined) {
      //console.log("newSubscription");
      if (newSubscription.newMessage !== null) {
        console.log(
          "Chat detail subscription updated : "
          //newSubscription.newMessage
        );
        const { newMessage } = newSubscription;

        if (newMessage.from.id === userSelf.id) {
          console.log("me send message");
          return;
        } else {
          const newMessageText = newMessage.text;
          //let postMessage = "";
          const updateNewMessage = {
            _id: newMessage._id,
            text: newMessageText,
            createdAt: newMessage.createdAt,
            user: newMessage.user
          };
          //console.log("postMessage : ", postMessage);
          // GiftedChat.append(messagesList, postMessage);

          setParentLastMessage(newMessageText);
          //GiftedChat.append(messagesList, postMessage);
          setMessageList([updateNewMessage, ...messagesList]);
        }

        // const { newMessage } = newSubscription;
        //GiftedChat.append(tempMessage);

        // const newMessageList = GiftedChat.append(messagesList, tempMessage);
        // //const newMessageList = [...messagesList, tempMessage];
        // setMessageList(newMessageList);

        // let roomData = client.cache.readQuery({
        //   query: SEE_ROOM,
        //   variables: { roomId }
        // });

        // let {
        //   seeRoom: { messages }
        // } = roomData;

        // console.log("roomData : ", roomData);

        // // 전송 메시지 메시지 데이터 부분만 전개

        // console.log(" @@@ new : ", newMessage);
        // // console.log(" @@@ cache : ", roomData);

        // // 이전 캐시와 전송 메시지데이터 전개 후 합침
        // const newCacheData = [newMessage, ...messages];
        // roomData.seeRoom.messages = newCacheData;

        //ROOMS
        // let roomsData = client.cache.readQuery({
        //   query: SEE_ROOMS
        // });
        // const { seeRooms } = roomsData;

        // for (let i = 0; i < seeRooms.length; i++) {
        //   if (seeRooms[i].id === roomId) {
        //     console.log("same room : ", seeRooms[i]);
        //     const newCacheRoomsData = [newMessage, ...messages];
        //     seeRooms[i].seeRooms.messages = newCacheRoomsData;
        //   }
        // }

        //console.log("roomsData", roomsData);
        // 캐쉬에 업데이트
        // client.cache.writeQuery({
        //   query: SEE_ROOM,
        //   variables: { roomId },
        //   data: {
        //     ...roomData,
        //     messages: newCacheData
        //   }
        // });

        // console.log(
        //   "after",
        //   client.cache.readQuery({
        //     query: SEE_ROOM,
        //     variables: { roomId }
        //   })
        // );
      }
    }
  };

  useEffect(() => {
    handleNewMessage();
  }, [newSubscription]);

  useEffect(() => {
    console.log("new messagesList");
    //

    // console.log(messagesList);
    setMessageList(messagesList);
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
      // console.log(data.seeRoom.me);
      setUserSelf(data.seeRoom.me);
      // setMessageList(data.seeRoom.messages);
    };
    const onError = error => {
      console.log("error initial load data : ", error);
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
  // 메시지 보낸후 아폴로 캐시 업데이트를 위해 전송결과 데이터와 캐시 데이터를 합쳐서 캐시업데이트를 해준다.
  // update: (proxy, mutationResult) => {
  //   try {
  //     // 기존 쿼리의 캐시데이터 읽기.
  //     let roomData = proxy.readQuery({
  //       query: SEE_ROOM,
  //       variables: { roomId }
  //     });
  //     // 메시지 부분만 전개
  //     let {
  //       seeRoom: { messages }
  //     } = roomData;
  //     // 전송 메시지 메시지 데이터 부분만 전개
  //     const {
  //       data: { sendMessage }
  //     } = mutationResult;
  //     // 이전 캐시와 전송 메시지데이터 전개 후 합침
  //     const newCacheData = [sendMessage, ...messages];
  //     roomData.seeRoom.messages = newCacheData;
  //     // 캐쉬에 업데이트
  //     proxy.writeQuery({
  //       query: SEE_ROOM,
  //       variables: { roomId },
  //       newCacheData
  //     });
  //   } catch (error) {
  //     console.log("Cache update error", error);
  //   }
  // }

  const onSend = sendMessage => {
    //console.log("sendMessage : ", sendMessage[0].text);
    console.log("sendMessage : ", sendMessage);
    //console.log("me : ", userSelf);
    if (sendMessage[0].text === "") {
      return;
    }
    sendText = sendMessage[0].text;
    //let postMessage = "";
    const postMessage = {
      _id: sendMessage[0]._id,
      text: sendText,
      createdAt: sendMessage[0].createdAt,
      user: {
        _id: userSelf.id,
        name: userSelf.username,
        avatar: userSelf.avatar
      }
    };
    //console.log("postMessage : ", postMessage);
    // GiftedChat.append(messagesList, postMessage);

    setParentLastMessage(sendText);
    //GiftedChat.append(messagesList, postMessage);
    setMessageList([postMessage, ...messagesList]);
    //try {
    SendMessageMutation({
      variables: {
        roomId,
        message: sendText
      }
    });

    //refetch({ roomId });

    // } catch (e) {
    //   console.log(e);
    // }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* {loading ? (
        <Loader />
      ) : ( */}

      {loading ? (
        <GiftedChat
          messages={messagesList}
          onSend={sendMessage => onSend(sendMessage)}
          user={{
            _id: me_param.id
          }}
        />
      ) : (
        data &&
        data.seeRoom &&
        data.seeRoom.me &&
        data.seeRoom.messages && (
          <GiftedChat
            messages={messagesList}
            onSend={sendMessage => onSend(sendMessage)}
            user={{
              _id: userSelf.id
            }}
            isAnimated={true}
            // quickReplyStyle={{ borderRadius: 4 }}
            keyboardShouldPersistTaps="never"
            showAvatarForEveryMessage={true}
          />
        )
      )}

      {/* {data && data.seeRoom && data.seeRoom.me && data.seeRoom.messages && (
        <GiftedChat
          messages={messagesList}
          onSend={sendMessage => onSend(sendMessage)}
          user={{
            _id: userSelf
          }}
        />
      )} */}

      {/* )} */}

      {/* )} */}
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
