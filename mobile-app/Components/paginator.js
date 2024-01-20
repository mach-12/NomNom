import { View, Text, Dimensions, Animated } from "react-native";
import React from "react";

const { width, height } = Dimensions.get("screen");

export default function Paginator({ data, scrollX }) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        height: 64,
      }}
    >
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 20, 10],
          extrapolate: "clamp",
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: "clamp",
        });
        return (
          <Animated.View
            key={i.toString()}
            style={{
              height: 10,
              width: dotWidth,
              opacity,
              borderRadius: 5,
              backgroundColor: "#ecb469",
              marginHorizontal: 10,
            }}
          ></Animated.View>
        );
      })}
    </View>
  );
}
