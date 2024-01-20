import { Dimensions, KeyboardAvoidingView, Platform } from "react-native";
import React, { useState } from "react";
import { GiftedChat } from 'react-native-gifted-chat';
import { Dialogflow_V2 } from "react-native-dialogflow";
import { InputToolbar } from "react-native-gifted-chat";

const { height } = Dimensions.get("window");

export default function ChatBotScreen() {
  const [messages, setMessages] = useState([]);

  const onSend = (newMessages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));

    const userMessage = newMessages[0].text;

    Dialogflow_V2.requestQuery(
      userMessage,
      result => {
        const chatbotResponse = result.queryResult.fulfillmentText;

        const botMessage = {
          _id: Math.random().toString(36).substring(7),
          text: chatbotResponse,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Chatbot',
          },
        };

        setMessages(previousMessages => GiftedChat.append(previousMessages, [botMessage]));
      },
      error => {
        // Handle errors
        console.error('Dialogflow error:', error);
      }
    );
  };

  // Define a style to lift the chat window up
  const giftedChatStyle = { marginBottom: height * 0.1 };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      style={{ flex: 1 }}
    >
      <GiftedChat
        messages={messages}
        onSend={newMessages => onSend(newMessages)}
        user={{
          _id: 1,
        }}
        // Apply the style to lift the chat window
        renderInputToolbar={(props) => (
          <InputToolbar {...props} containerStyle={giftedChatStyle} />
        )}
      />
    </KeyboardAvoidingView>
  );
}
