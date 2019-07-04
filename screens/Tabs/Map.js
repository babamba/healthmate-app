import React from "react";
import styled from "styled-components";
import { StyleSheet } from "react-native";
import MapView from "react-native-maps";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

// const Map = styled.MapView`
//   height: 400px;
//   margin-top: 100px;
// `;

const Text = styled.Text``;

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject
  }
});

export default () => {
  return (
    <View>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }}
      />
    </View>
  );
};
