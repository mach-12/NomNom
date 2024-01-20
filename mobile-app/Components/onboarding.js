import { View, Text, FlatList, Image, Animated } from "react-native";
import React, { useState, useRef } from "react";
import slides from "../Constants/slides";
import OnboardingItem from "./OnboardingItem";
import Paginator from "./paginator";
import NextButton from "./nextButton";
import { useNavigation } from "@react-navigation/native";

export default function Onboarding() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);
  const navigation = useNavigation();

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      console.log("Last item.");
      navigation.navigate("LoginScreen");
    }
  };

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        backgroundColor: "#fbf0e1",
      }}
    >
      <View style={{ flex: 3 }}>
        <FlatList
          data={slides}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          style={{ marginTop: 100 }}
          bounces={false}
          renderItem={({ item }) => <OnboardingItem item={item} />}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />
      </View>
      <Paginator data={slides} scrollX={scrollX} />
      <NextButton
        scrollTo={scrollTo}
        percentage={(currentIndex + 1) * (100 / slides.length)}
      />
    </View>
  );
}
