import React, { useState, useEffect, useRef, createRef } from "react";
import Carousel, {
  ParallaxImage,
  Pagination
} from "react-native-snap-carousel";
import {
  View,
  Dimensions,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Text,
  Image
} from "react-native";
import TouchableScale from "react-native-touchable-scale";
import { withNavigation } from "react-navigation";
import { BlurView } from "expo-blur";

import * as Animatable from "react-native-animatable";
import constants from "../../constants";
// import * as MagicMove from "react-native-magic-move";

// const { width: screenWidth } = Dimensions.get("window");

console.log(constants.width);
const entryBorderRadius = 8;

const MyCarousel = props => {
  //   const {
  //     navigation,
  //     planTitle,
  //     planImage,
  //     id,
  //     exerciseTime,
  //     exerciseDate,
  //     exerciseType
  //   } = props;
  //console.log(props);
  const SLIDER_1_FIRST_ITEM = 0;

  //   let carouselRef = useRef();
  const [carouselRef, setCarouselRef] = useState(() => createRef());
  const [activeSlide, setActiveSlide] = useState(SLIDER_1_FIRST_ITEM);

  const { onSnapUser, data, navigation, mountComplete } = props;

  const _renderItem = ({ item, index }, parallaxProps) => {
    //console.log("item thumbnail", item.thumbnail);
    return (
      // <MagicMove.View id={"scene1"}>
      <Animatable.View
        animation="fadeIn"
        easing="ease-in-out"
        delay={50 * (index * 3)}
        useNativeDriver={true}
      >
        <TouchableScale
          activeScale={0.99}
          // tension={80}
          // friction={2}
          onPress={() => {
            navigation.navigate("PlanDetail", { planId: item.id });
          }}
        >
          <View style={styles.item}>
            {/* <ParallaxImage
            source={{ uri: item.thumbnail }}
            containerStyle={styles.imageContainer}
            style={styles.image}
            parallaxFactor={0.4}
            fadeDuration={300}
            {...parallaxProps}
          /> */}

            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: item.planImage ? item.planImage : item.exerciseType.image
                }}
                //   containerStyle={styles.imageContainer}
                style={styles.image}
                //   {...parallaxProps}
              />
              {/* <View style={styles.overlay} /> */}

              <View style={styles.overlayTextConatiner}>
                <View style={styles.overlayHeaderTextConatiner}>
                  <Text style={styles.headerTitle}>
                    {item.exerciseType.title}
                  </Text>
                </View>

                <Text style={styles.title}>{item.planTitle}</Text>
              </View>
              {/* <BlurView
                tint="default"
                intensity={100}
                style={[
                  styles.textContainer,
                  {
                    borderRadius: 8,
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0
                  }
                ]}
              >
                <Text style={styles.title}>{item.planTitle}</Text>
              </BlurView> */}
            </View>
          </View>
        </TouchableScale>
      </Animatable.View>
      // </MagicMove.View>
    );
  };

  return (
    <View style={styles.container}>
      <Pagination
        dotsLength={props.data.length}
        activeDotIndex={activeSlide}
        containerStyle={styles.paginationContainer}
        dotColor={"rgba(130, 130, 130, 0.92)"}
        dotStyle={styles.paginationDot}
        inactiveDotColor={"rgba(196, 196, 196, 0.92)"}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
        tappableDots={!!carouselRef}
        carouselRef={carouselRef}
      />
      <Carousel
        ref={carouselRef}
        sliderWidth={constants.width}
        sliderHeight={constants.height / 2}
        itemWidth={constants.width * 0.8}
        data={data}
        renderItem={data => _renderItem(data)}
        hasParallaxImages={false}
        //    onSnapToItem={index => onSnapUser(index)}
        onSnapToItem={index => setActiveSlide(index)}
        enableMomentum={false}
        activeAnimationType={"spring"}
        activeSlideAlignment={"center"}
        inactiveSlideScale={0.97}
        activeAnimationOptions={{
          friction: 8,
          tension: 80
        }}
      />
    </View>
  );
};

export default withNavigation(MyCarousel);

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20
  },
  item: {
    marginLeft: 14,
    width: constants.width - 100,
    height: constants.height / 2,

    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 6,

    elevation: 12,

    paddingVertical: 10

    // marginLeft: 10,
    // marginTop: 10,
  },
  imageContainer: {
    flex: 1
    //     marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
  },
  image: {
    flex: 1,
    // width: constants.width - 100,
    // height: constants.height / 1.8,
    resizeMode: "cover",
    borderRadius: entryBorderRadius,
    marginBottom: Platform.select({ ios: 0, android: -1 }) // Prevent a random Android rendering issue
  },
  paginationContainer: {
    width: constants.width,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: constants.width / 1.5
  },
  paginationDot: {
    width: 14,
    height: 8,
    borderRadius: 7
  },
  overlayHeaderTextConatiner: {
    position: "absolute",
    top: 0,
    alignItems: "flex-end",
    justifyContent: "flex-start",
    overflow: "hidden",
    paddingHorizontal: 16,
    paddingVertical: 16,
    width: constants.width - 100
  },
  overlayTextConatiner: {
    ...StyleSheet.absoluteFillObject,
    position: "absolute",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    overflow: "hidden",

    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: entryBorderRadius,
    paddingBottom: 16,
    paddingHorizontal: 20
  },
  textContainer: {
    position: "absolute",
    bottom: 0,
    // justifyContent: "center",
    // paddingTop: 20 - entryBorderRadius,
    // paddingBottom: 20,
    // paddingHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
    width: constants.width - 100,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden"
  },
  // overlay: {
  //   ...StyleSheet.absoluteFillObject,
  //   backgroundColor: "rgba(0,0,0,0.3)",
  //   borderRadius: entryBorderRadius
  // },
  title: {
    color: "white",
    fontSize: 36,
    letterSpacing: 0.5,
    fontFamily: "NanumBarunGothicLight"
  },
  headerTitle: {
    color: "white",
    fontSize: 16,
    letterSpacing: 0.5,
    fontFamily: "NanumBarunGothicUltraLight"
  },
  subtitle: {
    color: "white",
    fontSize: 12,
    fontFamily: "NotoSansKR_Light"
  }
});
