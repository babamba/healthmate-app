import React from "react";
import styled from "styled-components";
import constants from "../../constants";
import TouchableScale from "react-native-touchable-scale";
import { withNavigation } from "react-navigation";
import * as MagicMove from "react-native-magic-move";

const ImageAreaSize = constants.width - 35;

const Container = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
  border-radius: 24px;
  box-shadow: ${constants.bigBoxShadow};
`;

const View = styled.View`
  width: ${ImageAreaSize};
  height: ${ImageAreaSize};

  justify-content: center;
  align-items: center;
`;

const Image = styled.Image`
  border-radius: 24px;
  width: ${ImageAreaSize};
  height: ${ImageAreaSize};
`;

const ImageArea = styled.View`
  width: ${ImageAreaSize};
  height: ${ImageAreaSize};
`;
const TextArea = styled.View`
  position: absolute;
  bottom: 0;
  padding-vertical: 20px;
  padding-horizontal: 20px;
  justify-content: center;
  overflow: hidden;
`;

const Overlay = styled.View`
  position: absolute;
  width: ${ImageAreaSize};
  height: ${ImageAreaSize};
  background-color: "rgba(0,0,0,0.4)";
  border-radius: 24px;
`;

const TouchableOpacity = styled.TouchableOpacity``;

const Text = styled.Text`
  color: white;
  font-size: 36;
  letter-spacing: 0.5;
  font-family: NanumBarunGothicLight;
`;

const TestView = styled.View`
  flex: 1;
  background-color: yellowgreen;
`;

export default withNavigation(({ navigation }) => {
  const dummy = {
    text: "test banner",
    uri:
      "https://images.unsplash.com/photo-1564947879082-436ab81f8513?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80",
    title: "TEST Big Banner"
  };

  return (
    <Container>
      <TouchableScale
        onPress={() => navigation.navigate("BigBannerDetail", { data: dummy })}
        activeScale={0.99}
        transition={MagicMove.Transition.morph}
      >
        <View>
          <ImageArea>
            <Image
              source={{
                uri: dummy.uri
              }}
            />
            <Overlay>
              <TextArea>
                <Text>{dummy.title}</Text>
              </TextArea>
            </Overlay>
          </ImageArea>
        </View>
      </TouchableScale>
    </Container>
  );
});
