import React, { useEffect } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Platform,
  YellowBox
} from "react-native";
import styled from "styled-components";
import { ANIMATION_LOADER_4 } from "../assets/AnimationLoader";
import constants from "../constants";
import LottieView from "lottie-react-native";
import AnimatedLoader from "react-native-animated-loader";

const OverLayLoader = () => {
  YellowBox.ignoreWarnings([
    "ReactNative.NativeModules.LottieAnimationView.getConstants"
  ]);
  useEffect(() => {
    console.log("loader mount play..");
    return () => {
      console.log("loader unmount..");
    };
  }, []);

  return (
    <AnimatedLoader
      visible={true}
      overlayColor="rgba(255,255,255,0.75)"
      source={ANIMATION_LOADER_4}
      animationStyle={styles.lottie}
      speed={1}
    />
  );
};

export default OverLayLoader;

const styles = StyleSheet.create({
  lottie: {
    width: 100,
    height: 100
  }
});
