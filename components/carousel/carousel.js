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

const { width: screenWidth } = Dimensions.get("window");

const MyCarousel = props => {
  //console.log(props);
  const carouselRef = useRef(null);
  const { onSnapUser } = props;
  //   const goForward = () => {
  //     carouselRef.current.snapToNext();
  //   };

  const _renderItem = ({ item, index }, parallaxProps) => {
    //console.log("item thumbnail", item.thumbnail);
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          alert(`You've clicked '${item.subtitle}'`);
        }}
      >
        <View style={styles.item}>
          <Text style={styles.title} numberOfLines={2}>
            {item.subtitle}
          </Text>
          {/* <ParallaxImage
            source={{ uri: item.thumbnail }}
            containerStyle={styles.imageContainer}
            style={styles.image}
            parallaxFactor={0.4}
            fadeDuration={300}
            {...parallaxProps}
          /> */}

          <Image
            source={{ uri: item.thumbnail }}
            //   containerStyle={styles.imageContainer}
            style={styles.image}
            //   {...parallaxProps}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity onPress={goForward}>
        <Text>go to next slide</Text>
      </TouchableOpacity> */}
      <Carousel
        ref={carouselRef}
        sliderWidth={screenWidth}
        sliderHeight={screenWidth}
        itemWidth={screenWidth - 180}
        data={props.data}
        renderItem={data => _renderItem(data)}
        hasParallaxImages={true}
        onSnapToItem={index => onSnapUser(index)}
      />
    </View>
  );
};

export default MyCarousel;

const styles = StyleSheet.create({
  container: {},
  item: {
    width: screenWidth - 180,
    height: screenWidth - 180
  },
  imageContainer: {
    flex: 1,
    //     marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    backgroundColor: "white"
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
    borderRadius: 8,
    marginBottom: Platform.select({ ios: 0, android: 1 }) // Prevent a random Android rendering issue
  }
});
