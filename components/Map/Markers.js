import React from "react";
import { TouchableOpacity, Alert } from "react-native";
import { withNavigation } from "react-navigation";
import { Marker } from "react-native-maps";

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
      pinColor={"red"}
      description={marker.bio}
      // onPress={e => press(e, marker)}
    />
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
