import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { StyleSheet, Alert, Dimensions, TouchableOpacity } from "react-native";
import MapView, {
  AnimatedRegion,
  Marker,
  Animated as AnimatedMap
} from "react-native-maps";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import { withNavigation } from "react-navigation";

import CarouselItem from "../../components/carousel/carousel";
import { ENTRIES_CAROUSEL } from "../../EntryData/Entries";
const { width, height } = Dimensions.get("window");
const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const MapContainer = styled.View({
  ...StyleSheet.absoluteFillObject
});

const ContentContainer = styled.View`
  position: absolute;
  flex: 0.32;
  justify-content: flex-end;
  bottom: 14;
  /* background-color: red;
  opacity: 0.4; */
`;

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject
  }
});

const Icon = styled.View``;

const MapScreen = ({ navigation }) => {
  const GEOLOCATION_OPTIONS = {
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 1000
  };

  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  const [errorMessage, setErrorMessage] = useState("");
  const [locationStatus, setLocationStatus] = useState(false);

  const [initialRegion, setRegion] = useState({
    coords: {
      accuracy: 5,
      altitude: 0,
      altitudeAccuracy: -1,
      heading: -1,
      latitude: 17.785834,
      longitude: 32.406417,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
      speed: -1
    },
    timestamp: 1562826219681.7188
  });

  const [markers, setMarker] = useState([
    {
      id: 0,
      amount: 99,
      title: "hello 1",
      description: "Description 1",
      coordinate: {
        latitude: 37.799839,
        longitude: -122.406411
      }
    },
    {
      id: 1,
      amount: 199,
      title: "hello 2",
      description: "Description 2",
      coordinate: {
        latitude: 37.795844,
        longitude: -122.406417
      }
    },
    {
      id: 2,
      amount: 285,
      title: "hello 3",
      description: "Description 3",
      coordinate: {
        latitude: 37.745824,
        longitude: -122.406417
      }
    }
  ]);

  //   const animations = markers.map((m, i) =>
  //   console.log(markers[i])
  //   // getMarkerState(panX, panY, scrollY, i)
  // );

  const ask = async () => {
    // const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    // setNotificationStatus(status);
    // let token = await Notifications.getExpoPushTokenAsync();
    // console.log(token);
    // Notifications.setBadgeNumberAsync(0);

    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      setErrorMessage("지도 기능 권한을 승인하지 않으면 사용 할 수 없다.");
      Alert.alert(errorMessage);
    }

    let location = await Location.getCurrentPositionAsync({});
    await Location.watchPositionAsync(
      GEOLOCATION_OPTIONS,
      locationChanged(location)
    );
  };

  const locationChanged = location => {
    const {
      coords: { latitude, longitude }
    } = location;
    //console.log("param location", location);

    location.coords.longitudeDelta = 0.1;
    location.coords.latitudeDelta = 0.5;

    let newLocationObj = {
      ...location
    };
    console.log(newLocationObj);
    setRegion(newLocationObj);

    // setRegion(prevState => {
    //   return { ...prevState, coords: { latitude, longitude } };
    // });
  };

  const onRegionChange = region => {
    //console.log("onRegionChange : ", region);
  };

  useEffect(() => {
    ask();
  }, []);

  useEffect(() => {
    onRegionChange(initialRegion.coords);
  }, [initialRegion]);

  return (
    <View>
      <MapContainer>
        <MapView
          provider={"google"}
          style={styles.map}
          showsUserLocation={true}
          showCompass={true}
          rotateEnabled={false}
          region={initialRegion.coords}
          onRegionChange={region => onRegionChange(region)}
          //initialRegion={this.state.region}
          initialRegion={initialRegion.coords}
          followsUserLocation={true}
          zoomEnabled={true}
        >
          {/* {markers.map((marker, i) => {
            //const { selected, markerOpacity, markerScale } = animations[i];
            console.log(marker);
            console.log(marker.coordinate);
            return (
              <MapView.Marker
                key={i}
                coordinate={marker.coordinate}
                pinColor={"red"}
                onPress={e => console.log(e.nativeEvent)}
                detitle={marker.title}
              />
            );
          })} */}
          {markers.map((marker, i) => (
            //const { selected, markerOpacity, markerScale } = animations[i];
            <MapView.Marker
              key={marker.id}
              coordinate={marker.coordinate}
              pinColor={"red"}
              onPress={e => {
                console.log(e.nativeEvent), Alert.alert(e.nativeEvent);
              }}
              title={marker.title}
              description={marker.description}
            />
          ))}
        </MapView>
        <TouchableOpacity
          style={styles.zoomIn}
          onPress={() => {
            this.onPressZoomIn();
          }}
        >
          <Icon name="add" style={styles.icon} size={20} />
        </TouchableOpacity>
      </MapContainer>
      <ContentContainer>
        <CarouselItem data={ENTRIES_CAROUSEL} />
      </ContentContainer>
    </View>
  );
};

export default withNavigation(MapScreen);
