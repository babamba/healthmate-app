import React from "react";
import { TouchableOpacity, Alert, Image } from "react-native";
import { withNavigation } from "react-navigation";
import { Marker } from "react-native-maps";
import constants from "../../constants";
import styled from "styled-components";
import PinImage from "./PinImage";

const INACTIVE_PIN = require("../../assets/pin.png");
const markerImageSize = constants.width / 12;
const ImageContainer = styled.View`
  width: ${markerImageSize};
  height: ${markerImageSize};
  border-radius: ${markerImageSize / 2};
`;
// const Image = styled.Image`
//   width: ${markerImageSize};
//   height: ${markerImageSize};
//   border-radius: ${markerImageSize / 2};
//   z-index: 0;
// `;

const Markers = ({ marker }) => {
  // const Markers = ({ marker, press }) => {
  //console.log("marker =>", marker);

  return (
    <Marker
      key={marker.id}
      coordinate={{
        latitude: marker.location.latitude,
        longitude: marker.location.longitude
      }}
      icon={{ uri: INACTIVE_PIN }}

      // pinColor={"red"}
      // description={marker.bio}
      // style={{
      //   backgroundColor: "red"
      // }}
      // onPress={e => press(e, marker)}
    >
      {/* <PinImage uri={marker.avatar} /> */}
    </Marker>
  );
};

export default withNavigation(Markers);
