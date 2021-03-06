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

import gql from "graphql-tag";
import { useQuery } from "react-apollo-hooks";
import Loader from "../Loader";
// import * as MagicMove from "react-native-magic-move";

// const { width: screenWidth } = Dimensions.get("window");

export const SEE_EXERCISE = gql`
  query seeExercise {
    seeExercise {
      id
      image
      title
    }
  }
`;
const entryBorderRadius = 8;

const ExersizeCarousel = props => {
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

  //const { onSnapUser, navigation, mountComplete } = props;
  const { selectExercize } = props;

  const { data, loading, error } = useQuery(SEE_EXERCISE, {
    fetchPolicy: "cache-and-network"
  });

  const _renderItem = ({ item, index }, parallaxProps) => {
    return (
      // <MagicMove.View id={"scene1"}>
      <Animatable.View
        animation="fadeInUp"
        easing="ease-in-out"
        delay={50 * (index * 3)}
        useNativeDriver={true}
      >
        <TouchableScale
          activeScale={1}
          tension={80}
          friction={2}
          onPress={() => {
            selectExercize(item);
            // navigation.navigate("PlanDetail", { planId: item.id });
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
                  uri: item.image
                }}
                //   containerStyle={styles.imageContainer}
                style={styles.image}
                //   {...parallaxProps}
              />
              <View style={styles.overlay} />
              <BlurView
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
                <Text style={styles.title}>{item.title}</Text>
                {/* <Text style={styles.title}>{item.exerciseTime}</Text> */}
              </BlurView>
            </View>
          </View>
        </TouchableScale>
      </Animatable.View>
      // </MagicMove.View>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Loader />
      ) : (
        data &&
        data.seeExercise && (
          <View>
            <Pagination
              dotsLength={data.seeExercise.length}
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
              data={data.seeExercise}
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
        )
      )}
    </View>
  );
};

export default withNavigation(ExersizeCarousel);

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10
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
    paddingBottom: 10
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
    width: constants.width - 100,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden"
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: entryBorderRadius
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
