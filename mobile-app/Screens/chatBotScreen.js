import { Dimensions, KeyboardAvoidingView, Platform } from "react-native";
import React, { useState } from "react";
import { GiftedChat } from "react-native-gifted-chat";

const { height, width } = Dimensions.get("window");

export default function ChatBotScreen() {
  const [messages, setMessages] = useState([]);

  const onSend = async (newMessages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );

    const userMessage = newMessages[0].text;

    try {
      const response = await fetch("https://347a-2401-4900-5d9b-5a49-74a7-9b3e-16b8-bfb.ngrok-free.app/chat", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: userMessage }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      const result = await response.json();

      const botMessage = {
        _id: Math.random().toString(36).substring(7),
        text: result.response,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Chatbot",
        },
      };

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [botMessage])
      );
    } catch (error) {
      console.error("API error:", error);
    }
  };

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
      />
    </KeyboardAvoidingView>
  );
}
