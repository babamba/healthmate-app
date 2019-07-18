import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import styled from "styled-components";
import { ANIMATION_LOADER_2 } from "../assets/AnimationLoader";
import AnimatedLoader from "react-native-animated-loader";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export default () => (
  <Container>
    <AnimatedLoader
      visible={true}
      overlayColor="rgba(255,255,255,0.75)"
      source={ANIMATION_LOADER_2}
      animationStyle={styles.lottie}
      speed={1}
    />
  </Container>
);

const styles = StyleSheet.create({
  lottie: {
    width: 100,
    height: 100
  }
});
