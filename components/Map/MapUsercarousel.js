import React, { useRef } from "react";
import Carousel, { ParallaxImage } from "react-native-snap-carousel";
import {
  View,
  Dimensions,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Text,
  Image
} from "react-native";
import * as Animatable from "react-native-animatable";
import { BlurView } from "expo-blur";
import constants from "../../constants";
import MoreIcon from "../../components/Map/MoreIcon";

// const { width: screenWidth } = Dimensions.get("window");

const carouselWidth = constants.width / 1.36;
const carouselHeight = constants.width / 2.4;
const iconContainerWidth = constants.width / 10;

const MapUserCarousel = props => {
  const carouselRef = useRef(null);
  const { onSnapUser, press } = props;
  //   const goForward = () => {
  //     carouselRef.current.snapToNext();
  //   };

  const _renderItem = ({ item, index }, parallaxProps) => {
    //console.log("item thumbnail", item.thumbnail);
    return (
      <Animatable.View
        animation="fadeInUp"
        easing="ease-in-out"
        delay={50 * (index * 3)}
        useNativeDriver={true}
      >
        {/* <TouchableOpacity
          activeOpacity={0.8}
          // onPress={() => {
          //   alert(`You've clicked '${item.subtitle}'`);
          // }}
        > */}
        <View style={styles.item}>
          <BlurView tint="light" intensity={80} style={styles.textContainer}>
            <View style={styles.rightTextRow}>
              <Text style={styles.username} numberOfLines={2}>
                {item.username}
              </Text>
              <Text style={styles.bio} numberOfLines={2}>
                {item.bio}
              </Text>
            </View>
          </BlurView>
        </View>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.avatar }}
            //   containerStyle={styles.imageContainer}
            style={styles.textContainer}
            //   {...parallaxProps}
          />
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity />
          <MoreIcon size={26} press={press} item={item} />
        </View>

        {/* <View style={styles.item}>
            <Text style={styles.title} numberOfLines={2}>
              {item.subtitle}
            </Text>
            <ParallaxImage
            source={{ uri: item.thumbnail }}
            containerStyle={styles.imageContainer}
            style={styles.image}
            parallaxFactor={0.4}
            fadeDuration={300}
            {...parallaxProps}
          />
          </View> */}
        {/* </TouchableOpacity> */}
      </Animatable.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity onPress={goForward}>
        <Text>go to next slide</Text>
      </TouchableOpacity> */}
      <Carousel
        ref={carouselRef}
        sliderWidth={constants.width}
        sliderHeight={constants.width}
        itemWidth={carouselWidth}
        data={props.data}
        renderItem={data => _renderItem(data)}
        hasParallaxImages={true}
        onSnapToItem={index => onSnapUser(index)}
      />
    </View>
  );
};

export default MapUserCarousel;

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   justifyContent: "center"
  // },
  item: {
    width: carouselWidth,
    height: carouselHeight, //155

    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 6,

    elevation: 4,
    marginBottom: 20,
    paddingTop: 20
    // backgroundColor: "red",
    // opacity: 0.2
  },
  imageContainer: {
    position: "absolute",
    width: constants.width / 4,
    height: constants.width / 4,
    left: 20,

    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 6,

    elevation: 4
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    marginBottom: Platform.select({ ios: 0, android: 1 }) // Prevent a random Android rendering issue
  },

  textContainer: {
    flex: 1,
    borderRadius: 8,
    paddingTop: 10
  },
  iconContainer: {
    position: "absolute",
    width: iconContainerWidth,
    height: iconContainerWidth,
    right: 0,

    borderColor: "#d6d7da",
    borderWidth: 0.5,
    borderRadius: Math.round(iconContainerWidth),

    alignItems: "center",

    backgroundColor: "white",

    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 6,

    elevation: 4
  },
  rightTextRow: {
    width: carouselWidth - constants.width / 4 + 60,
    paddingLeft: constants.width / 4 + 30
  },
  username: {
    fontFamily: "CoreGothicD_ExtLt",
    fontSize: 22
    //paddingLeft: constants.width / 4 + 30
  },
  bio: {
    fontFamily: "CoreGothicD_Thin",
    fontSize: 16,
    //paddingLeft: constants.width / 4 + 30,
    paddingTop: 5
  }
});
