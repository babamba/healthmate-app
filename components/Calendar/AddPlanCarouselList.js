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
  Image,
  Alert
} from "react-native";
import styled from "styled-components";
import TouchableScale from "react-native-touchable-scale";
import { withNavigation, Header } from "react-navigation";
import { BlurView } from "expo-blur";

import * as Animatable from "react-native-animatable";
import constants from "../../constants";
import { Feather } from "@expo/vector-icons";
import { useQuery } from "react-apollo-hooks";
import { SEE_PLAN } from "../../screens/Tabs/Plan";
import moment from "moment";

import Loader from "../Loader";
// import * as MagicMove from "react-native-magic-move";

// const { width: screenWidth } = Dimensions.get("window");

console.log(constants.width);
const entryBorderRadius = 8;
const moreButtonWidth = constants.width / 11.5;

const TempView = styled.View`
  justify-content: center;
  align-items: center;
`;
const Container = styled.View`
  justify-content: center;
  align-items: center;
  padding-vertical: 10px;
  width: ${constants.width};
  flex: 1;
  z-index: 10;
`;

const Item = styled.View`
  margin-left: 14px;
  width: ${constants.width - 100};
  height: ${constants.height / 2};
  box-shadow: ${constants.boxShadow};
  padding-vertical: 10px;
`;

const ImageContainer = styled.View`
  flex: 1;
`;

const ImageItem = styled.Image`
  flex: 1;
  border-radius: ${entryBorderRadius};
  margin-bottom: ${Platform.select({ ios: 0, android: -1 })};
  /* Prevent a random Android rendering issue */
`;

const Title = styled.Text`
  color: white;
  font-size: 36px;
  letter-spacing: 0.5;
  font-family: NanumBarunGothicLight;
`;

const HeaderTitle = styled.Text`
  color: white;
  font-size: 16px;
  letter-spacing: 0.5;
  font-family: NanumBarunGothicUltraLight;
`;

const OverlayHeaderTextConatiner = styled.View`
  position: absolute;
  top: 0;
  align-items: flex-start;
  justify-content: flex-start;
  overflow: hidden;
  padding-horizontal: 16px;
  padding-vertical: 16px;
  width: ${constants.width - 100};
`;

const MoreContainer = styled.View`
  position: absolute;
  top: 0;
  right: 0;
  background-color: white;
  width: ${moreButtonWidth};
  height: ${moreButtonWidth};
  border-radius: ${moreButtonWidth / 2};
  z-index: 3;
  align-items: center;
  justify-content: center;
`;

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

  const { loading, data, error } = useQuery(SEE_PLAN, {
    fetchPolicy: "network-only"
  });

  const [carouselRef, setCarouselRef] = useState(() => createRef());
  const [activeSlide, setActiveSlide] = useState(SLIDER_1_FIRST_ITEM);

  const { navigation, selectDate } = props;

  const confirm = item => {
    console.log("SelectDate : ");
    const convertDate = moment(selectDate).format("YYYY년 MM월 DD일");
    const confirmText = `${convertDate} / ${item.planTitle}`;
    Alert.alert(
      confirmText,
      "추가 하시겠습니까?",
      [
        {
          text: "스케쥴 추가",
          style: "destructive",
          onPress: () => console.log("OK Pressed")
        },
        {
          text: "취소",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        }
      ],
      { cancelable: true }
    );
  };

  const _renderItem = ({ item, index }, parallaxProps) => {
    //console.log("item thumbnail", item);
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
            confirm(item);
            // navigation.navigate("PlanDetail", { planId: item.id });
          }}
        >
          <Item>
            <ImageContainer>
              <ImageItem
                source={{
                  uri: item.planImage ? item.planImage : item.exerciseType.image
                }}
              />
              <View style={styles.overlayTextConatiner}>
                <OverlayHeaderTextConatiner>
                  <HeaderTitle>{item.exerciseType.title}</HeaderTitle>
                </OverlayHeaderTextConatiner>
                <Title>{item.planTitle}</Title>
              </View>
            </ImageContainer>
          </Item>
        </TouchableScale>
      </Animatable.View>
      // </MagicMove.View>
    );
  };

  return (
    <Container>
      {loading ? (
        <Loader />
      ) : (
        data &&
        data.seePlan && (
          <TempView>
            <Pagination
              dotsLength={data.seePlan.length}
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
              data={data.seePlan}
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
          </TempView>
        )
      )}
    </Container>
  );
};

export default withNavigation(MyCarousel);

const styles = StyleSheet.create({
  paginationContainer: {
    width: constants.width,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: constants.width / 1.5
  },
  paginationDot: {
    width: 14,
    height: 8,
    borderRadius: 7
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
