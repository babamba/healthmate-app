import React, { useEffect, useRef, createRef, useState } from "react";
import {
  AsyncStorage,
  StyleSheet,
  View,
  Text,
  Image,
  Platform
} from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import { setLaunchedApp } from "../../AuthContext";
import { Ionicons } from "@expo/vector-icons";
import constants from "../../constants";
import {
  ANIMATION_INTRO_1,
  ANIMATION_INTRO_2,
  ANIMATION_INTRO_3
} from "../../assets/Intro/AnimationIntro";

import LottieView from "lottie-react-native";

const Intro = () => {
  const setLaunch = setLaunchedApp();
  const [animationIconRef, setAnimationIconRef] = useState(() => createRef());
  const slideRef = useRef();
  const slides = [
    {
      key: "somethun",
      title: "Title 1",
      text: "웰컴 1 \n웰컴 1 \n웰컴 1 \n웰컴 1 \n웰컴 1",
      backgroundColor: "#59b2ab"
    },
    {
      key: "somethun-dos",
      title: "Title 2",
      text: "웰컴 2 \n웰컴 2 \n웰컴 2 \n웰컴 2 \n웰컴 2",
      backgroundColor: "#febe29"
    },
    {
      key: "somethun1",
      title: "Rocket guy",
      text: "웰컴 3 \n웰컴 3 \n웰컴 3 \n웰컴 3 \n웰컴 3",
      backgroundColor: "#22bcb5"
    }
  ];

  const onDone = async () => {
    setLaunch();
  };

  const onSkip = async () => {
    setLaunch();
  };

  const _onSlideChange = index => {
    console.log(index);
    //     animationIconRef.current.play();
  };

  const _renderItem = item => {
    let lottie;

    if (item.index === 0) {
      lottie = ANIMATION_INTRO_1;
    } else if (item.index === 1) {
      lottie = ANIMATION_INTRO_2;
    } else {
      lottie = ANIMATION_INTRO_3;
    }

    return (
      <View style={styles.slide}>
        <Text style={styles.title}>{item.title}</Text>
        <LottieView
          ref={animationIconRef}
          source={lottie}
          autoPlay={true}
          // loop={false}
          speed={1}
          style={{
            width: constants.width - 100,
            height: constants.width - 100
          }}
        />
        <View>
          <Text style={styles.text}>{item.text}</Text>
        </View>
      </View>
    );
  };

  const renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Ionicons
          name={Platform.select({
            ios: "ios-arrow-round-forward",
            android: "md-arrow-round-forward"
          })}
          color="rgba(0, 0, 0, .9)"
          size={24}
          style={{ backgroundColor: "transparent" }}
        />
      </View>
    );
  };

  const renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Ionicons
          name={Platform.select({
            ios: "ios-checkmark",
            android: "md-checkmark"
          })}
          color="rgba(0, 0, 0, .9)"
          size={24}
          style={{ backgroundColor: "transparent" }}
        />
      </View>
    );
  };

  useEffect(() => {
    console.log("intro didmout");
    //     console.log(slideRef.current.state.activeIndex);
    //     console.log(animationIconRef.current)
    //animationIconRef.current.play();
    //     animationIconRef.current[0].play();
  }, []);

  return (
    //     <SafeAreaView
    //       style={constants.commonStyle.safeArea}
    //       forceInset={{ top: "always" }}
    //     >
    <AppIntroSlider
      ref={slideRef}
      slides={slides}
      renderItem={item => _renderItem(item)}
      onDone={() => onDone()}
      onSkip={() => onSkip()}
      renderNextButton={() => renderNextButton()}
      renderDoneButton={() => renderDoneButton()}
      onSlideChange={index => _onSlideChange(index)}
    />
    //     </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15
  },
  image: {
    flex: 1,
    width: constants.width,
    height: constants.height
  },
  title: {
    color: "grey",
    textAlign: "center",
    fontFamily: "CoreGothicD_Thin"
  },
  text: {
    color: "rgba(255, 255, 255, 0.8)",
    backgroundColor: "white",
    textAlign: "center",
    fontFamily: "CoreGothicD_Thin",
    paddingHorizontal: 16
  },
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(0, 0, 0, .2)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default Intro;
