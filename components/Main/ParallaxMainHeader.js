import React, { useRef } from "react";
import { Platform } from "react-native";
import styled from "styled-components";
import constants from "../../constants";
import TouchableScale from "react-native-touchable-scale";
import * as Animatable from "react-native-animatable";
import ParallaxScrollView from "react-native-parallax-scroll-view";
import ProfileCircleIcon from "../../components/Profile/ProfileCircleIcon";
import styles from "../../styles";

const ImageAreaSize = constants.width;
const STICKY_HEADER_HEIGHT = 70;
const PARALLAX_HEADER_HEIGHT = 350;

const Container = styled.View`
  /* justify-content: center;
  align-items: center; */
  flex: 1;
`;

const View = styled.View``;
const TouchableOpacity = styled.TouchableOpacity``;

const Text = styled.Text`
  color: white;
  font-size: 36;
  letter-spacing: 0.5;
  font-family: NanumBarunGothicLight;
`;

const Image = styled.Image`
  border-radius: 24px;
  width: ${ImageAreaSize};
  height: ${ImageAreaSize};
`;

const StickySection = styled.View`
  height: ${STICKY_HEADER_HEIGHT};
  width: ${constants.width};
  justify-content: flex-end;
  background-color: "rgba(0, 0, 0 ,0.3)";
`;

const StickySectionText = styled.Text`
  color: white;
  font-size: 23;
  letter-spacing: 0.5;
  font-family: NanumBarunGothicLight;
`;

const ParallaxHeader = styled.View`
  align-items: center;
  flex: 1;
  flex-direction: column;
  padding-top: 100px;
`;

export default ({ navigation }) => {
  const data = navigation.getParam("data");
  const scrollView = useRef();

  const onScroll = event => {
    const y = Math.round(event.nativeEvent.contentOffset.y);

    console.log(y <= -140);
    if (y <= -140) {
      navigation.navigate("TabNavigation");
    }
  };

  return (
    <Container>
      <ParallaxScrollView
        ref={scrollView}
        scrollEvent={e => onScroll(e)}
        scrollEventThrottle={400}
        backgroundColor={styles.backgroundGreyColor}
        contentBackgroundColor={styles.backgroundGreyColor}
        parallaxHeaderHeight={300}
        backgroundSpeed={10}
        stickyHeaderHeight={STICKY_HEADER_HEIGHT}
        fadeOutForeground={true}
        renderBackground={() => (
          <View key="background" style={{ flex: 1, width: constants.width }}>
            <Image
              source={{
                uri: data.uri,
                width: constants.width,
                height: PARALLAX_HEADER_HEIGHT
              }}
            />
            <View
              style={{
                position: "absolute",
                top: 0,
                width: constants.width,
                backgroundColor: "rgba(0,0,0,.4)",
                height: PARALLAX_HEADER_HEIGHT
              }}
            />
          </View>
        )}
        renderStickyHeader={() => (
          <StickySection key="fixed-header">
            <StickySectionText>{data.title}</StickySectionText>
          </StickySection>
        )}
        renderForeground={() => (
          <ParallaxHeader key="parallax-header">
            {/* <Image source={{ uri: data.uri }} /> */}
            <Text>{data.title}</Text>
          </ParallaxHeader>
        )}
      >
        <View style={{ height: 500 }}>
          <Animatable.Text animation="fadeInUp" delay={400} duration={500}>
            {data.text}
          </Animatable.Text>
        </View>
      </ParallaxScrollView>
    </Container>
  );
};
