import React, { useState, useRef, createRef } from "react";
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

const { width: screenWidth } = Dimensions.get("window");
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

  const { onSnapUser, data, navigation } = props;

  const _renderItem = ({ item, index }, parallaxProps) => {
    //console.log("item thumbnail", item.thumbnail);
    return (
      <TouchableScale
        activeScale={0.98}
        tension={80}
        friction={4}
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
            <View style={styles.overlay} />
            <BlurView
              tint="dark"
              intensity={30}
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
              <Text style={styles.title}>{item.exerciseTime}</Text>
            </BlurView>
          </View>
        </View>
      </TouchableScale>
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
        sliderWidth={screenWidth}
        sliderHeight={screenWidth}
        itemWidth={screenWidth - 80}
        data={data}
        renderItem={data => _renderItem(data)}
        hasParallaxImages={false}
        //    onSnapToItem={index => onSnapUser(index)}
        onSnapToItem={index => setActiveSlide(index)}
        enableMomentum={true}
        activeAnimationType={"spring"}
        activeSlideAlignment={"center"}
        inactiveSlideScale={0.97}
        activeAnimationOptions={{
          friction: 4,
          tension: 40
        }}
      />
    </View>
  );
};

export default withNavigation(MyCarousel);

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center"
  },
  item: {
    width: screenWidth - 100,
    height: screenWidth + 60,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
    borderRadius: 8
  },
  imageContainer: {
    flex: 1,
    //     marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    backgroundColor: "white",
    borderRadius: 8
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    borderRadius: 8,
    marginBottom: Platform.select({ ios: 0, android: 1 }) // Prevent a random Android rendering issue
  },
  paginationContainer: {
    paddingVertical: 20
  },
  paginationDot: {
    width: 15,
    height: 8,
    borderRadius: 4
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
    width: screenWidth - 100,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden"
  },
  // overlay: {
  //   ...StyleSheet.absoluteFillObject,
  //   backgroundColor: "rgba(0,0,0,0.2)",
  //   borderBottomLeftRadius: entryBorderRadius,
  //   borderBottomRightRadius: entryBorderRadius
  // },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderBottomLeftRadius: entryBorderRadius,
    borderBottomRightRadius: entryBorderRadius
  },
  title: {
    color: "white",
    fontSize: 16,
    letterSpacing: 0.5,
    fontFamily: "NotoSansKR_Medium"
  },
  subtitle: {
    color: "white",
    fontSize: 12,
    fontFamily: "NotoSansKR_Light"
  }
});
