import React, { Component } from "react";
import styled from "styled-components";
import { GiftedChat } from "react-native-gifted-chat";
import { ENTRIES_MESSAGE } from "../../EntryData/Entries";

class Chat extends Component {
  state = {
    messages: []
  };

  componentWillMount() {
    this.setState({
      //messages: ENTRIES_MESSAGE
      messages: [
        {
          _id: 1,
          text: "Hello developer",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://placeimg.com/140/140/any"
          }
        }
      ]
    });
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1
        }}
      />
    );
  }
}

export default Chat;
