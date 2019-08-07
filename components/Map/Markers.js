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
      id={marker.id}
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
      {/* <Image
        source={{ uri: marker.avatar }}
        resizeMode="contain"
        style={{
          width: markerImageSize,
          height: markerImageSize,
          borderRadius: markerImageSize / 2
        }}
      /> */}
      {/* <ImageContainer>
        
      </ImageContainer> */}
    </Marker>
  );
};

// PlanContentList.propTypes = {
//   files: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.string.isRequired,
//       url: PropTypes.string.isRequired
//     })
//   ).isRequired,
//   id: PropTypes.string.isRequired
// };

export default withNavigation(Markers);
