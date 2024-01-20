import { View, TouchableOpacity, Animated } from "react-native";
import React, { useEffect, useRef } from "react";
import { Svg, G, Circle } from "react-native-svg";
import { AntDesign } from "@expo/vector-icons";

export default function NextButton({ percentage, scrollTo }) {
  const size = 128;
  const strokeWidth = 2;
  const center = size / 2;
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  const progressAnimation = useRef(new Animated.Value(0)).current;
  const progressRef = useRef(null);

  const animation = (toValue) => {
    return Animated.timing(progressAnimation, {
      toValue,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    animation(percentage);
  }, [percentage]);

  useEffect(() => {
    progressAnimation.addListener(
      (value) => {
        const strokeDashoffset =
          circumference - (circumference * value.value) / 100;
        if (progressRef?.current) {
          progressRef.current.setNativeProps({
            strokeDashoffset,
          });
        }
      },
      [percentage]
    );

    return () => {
      progressAnimation.removeAllListeners();
    };
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={center}>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
            stroke="#E6E7E8"
            fill="transparent"
            
          />
          <Circle
            ref={progressRef}
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
            stroke="#ecb469"
            fill="transparent"
            strokeDasharray={circumference}
            //   strokeDashoffset={circumference - (circumference * 60) / 100}
          />
        </G>
      </Svg>
      <TouchableOpacity
        onPress={scrollTo}
        activeOpacity={0.6}
        style={{
          position: "absolute",
          backgroundColor: "#ecb469",
          borderRadius: 100,
          padding: 20,
        }}
      >
        <AntDesign name="arrowright" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
