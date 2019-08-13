import React from "react";
import { TouchableOpacity, Alert, Image } from "react-native";
import { withNavigation } from "react-navigation";
import { Marker } from "react-native-maps";
import constants from "../../constants";
import styled from "styled-components";

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
