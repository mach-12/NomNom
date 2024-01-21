import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { Dialogflow_V2 } from "react-native-dialogflow";
import { InputToolbar } from "react-native-gifted-chat";

const { height, width } = Dimensions.get("window");

export default function ChatBotScreen() {
  const [messages, setMessages] = useState([]);

  const onSend = (newMessages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );

    const userMessage = newMessages[0].text;

    Dialogflow_V2.requestQuery(
      userMessage,
      (result) => {
        const chatbotResponse = result.queryResult.fulfillmentText;

        const botMessage = {
          _id: Math.random().toString(36).substring(7),
          text: chatbotResponse,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "Chatbot",
          },
        };

        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [botMessage])
        );
      },
      (error) => {
        // Handle errors
        console.error("Dialogflow error:", error);
      }
    );
  };

  const giftedChatStyle = { marginBottom: height * 0.3, flex: 1 };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : null}
      style={{
        flex: 1,
        marginBottom: height * 0.13,
        marginHorizontal: width * 0.05,
      }}
    >
      <GiftedChat
        messages={messages}
        onSend={(newMessages) => onSend(newMessages)}
        user={{
          _id: 1,
        }}
        // Apply the style to lift the chat window
        renderInputToolbar={(props) => (
          <InputToolbar
            {...props}
            containerStyle={{
              backgroundColor: "white",
              borderRadius: 30
            }}
            primaryStyle={{
              alignItems: "center",
              borderRadius: 30,
              // borderWidth: 1,
              // borderColor: "black",
            }}
          />
        )}
      />
    </KeyboardAvoidingView>
  );
}
