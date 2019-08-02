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

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Loader = () => {
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
    <Container>
      <LottieView
        // ref={animationIconRef}
        source={ANIMATION_LOADER_4}
        autoPlay
        loop
        style={{
          width: constants.width / 2,
          height: constants.height / 6
        }}
      />
      {/* {Platform.OS === "ios" ? (
        <LottieView
          // ref={animationIconRef}
          source={ANIMATION_LOADER_2}
          autoPlay={true}
          loop={true}
          speed={1}
          // style={{
          //   width: constants.width,
          //   height: constants.height
          // }}
        />
      ) : (
        // <AnimatedLoader
        //   visible={true}
        //   overlayColor="rgba(255,255,255,0.75)"
        //   source={ANIMATION_LOADER_2}
        //   animationStyle={styles.lottie}
        //   speed={1}
        // />
        <ActivityIndicator color={styles.blackColor} />
      )} */}
    </Container>
  );
};

export default Loader;

const styles = StyleSheet.create({
  lottie: {
    width: 100,
    height: 100
  }
});
