import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import {
  StyleSheet,
  Alert,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  ActionSheetIOS
} from "react-native";
import MapView, {
  AnimatedRegion,
  Animated as AnimatedMap
} from "react-native-maps";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import Loader from "../../components/Loader";

import { withNavigation } from "react-navigation";

import gql from "graphql-tag";
import { useQuery } from "react-apollo-hooks";

import CarouselItem from "../../components/carousel/carousel";
import Marker from "../../components/Map/Markers";
import { ENTRIES_CAROUSEL } from "../../EntryData/Entries";
import Markers from "../../components/Map/Markers";

export const NEAR_USER = gql`
  query getNearUser {
    getNearUser {
      id
      username
      avatar
      bio
      location {
        latitude
        longitude
      }
    }
  }
`;

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
  // 1KM 내 유저 검색

  const mapRef = useRef();
  const { data, loading, error } = useQuery(NEAR_USER, {
    fetchPolicy: "cache-and-network"
  });

  const { width, height } = Dimensions.get("window");
  const GEOLOCATION_OPTIONS = {
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 1000
  };

  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.02;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  const [errorMessage, setErrorMessage] = useState("");
  const [locationStatus, setLocationStatus] = useState(false);

  const [nearUser, setNearUser] = useState([]);

  const [initialRegion, setRegion] = useState({
    coords: new AnimatedRegion({
      accuracy: 5,
      altitude: 0,
      altitudeAccuracy: -1,
      heading: -1,
      latitude: 17.785834,
      longitude: 32.406417,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
      speed: -1
    }),
    timestamp: 1562826219681.7188
  });

  // const [markers, setMarker] = useState([
  //   {
  //     id: 0,
  //     amount: 99,
  //     title: "hello 1",
  //     description: "Description 1",
  //     coordinate: {
  //       latitude: 37.799839,
  //       longitude: -122.406411
  //     }
  //   },
  //   {
  //     id: 1,
  //     amount: 199,
  //     title: "hello 2",
  //     description: "Description 2",
  //     coordinate: {
  //       latitude: 37.795844,
  //       longitude: -122.406417
  //     }
  //   },
  //   {
  //     id: 2,
  //     amount: 285,
  //     title: "hello 3",
  //     description: "Description 3",
  //     coordinate: {
  //       latitude: 37.745824,
  //       longitude: -122.406417
  //     }
  //   }
  // ]);

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

    location.coords.longitudeDelta = LATITUDE_DELTA;
    location.coords.latitudeDelta = LONGITUDE_DELTA;

    let newLocationObj = {
      ...location
    };

    // map.animateToRegion(newLocationObj, 1000 * 2);
    // initialRegion.coords
    //   .timing({ latitude, longitude, duration: 1000 })
    //   .start();
    setRegion(newLocationObj);

    console.log(newLocationObj);

    // setRegion(prevState => {
    //   return { ...prevState, coords: { latitude, longitude } };
    // });
  };

  function rewriteProfile(data) {
    let tempData;
    if (data) {
      if (Array.isArray(data) === true) {
        tempData = data.map(profile => ({
          title: profile.username,
          subtitle: profile.bio,
          thumbnail: profile.avatar
        }));
      }
    }
    //console.log(tempData);
    return tempData;
  }

  const onRegionChange = region => {
    // setRegion({ coords: { latitude: region.latitude } });
    // coords: {
    //   accuracy: 5,
    //   laltitude: 0,
    //   laltitudeAccuracy: -1,
    //   heading: -1,
    //   latitude: 17.785834,
    //   longitude: 32.406417,
    //   latitudeDelta: LATITUDE_DELTA,
    //   longitudeDelta: LONGITUDE_DELTA,
    //   speed: -1
    // },
  };

  const showActionSheet = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["취소", "프로필 보기", "메시지 보내기"],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 0
      },
      buttonIndex => {
        if (buttonIndex === 1) {
          /* destructive action */
          console.log("프로필 네비게이션");
          // navigation.navigate("UserDetail", { username: user.username })
        } else if (buttonIndex === 2) {
          console.log("채팅 디테일 네비게이션");
        }
      }
    );
  };

  const onRegionChangeComplete = region => {
    console.log(" region : ", region);
  };

  const handleMarkerPress = event => {
    console.log("press marker!");
    const markerID = event.nativeEvent;
    console.log(markerID);

    let moveRegion = {
      coords: {
        latitude: markerID.coordinate.latitude,
        longitude: markerID.coordinate.longitude
      }
    };

    locationChanged(moveRegion);
    showActionSheet();
  };

  const onSnapUser = async index => {
    console.log("onSnapUser");

    let moveRegion = {
      coords: {
        latitude: nearUser[index].location.latitude,
        longitude: nearUser[index].location.longitude
      }
    };

    locationChanged(moveRegion);
  };

  useEffect(() => {
    ask();
  }, []);

  useEffect(() => {
    onRegionChange(initialRegion.coords);
  }, [initialRegion]);

  useEffect(() => {
    const onCompleted = data => {
      console.log("onCompleted data : ", data);
      setNearUser(data.getNearUser);
    };
    const onError = error => {
      console.log("error initial load data");
    };
    if (onCompleted || onError) {
      if (onCompleted && !loading && !error) {
        onCompleted(data);
      } else if (onError && !loading && error) {
        onError(error);
      }
    }
  }, [data, loading, error]);

  return (
    <View>
      {loading ? (
        <Loader />
      ) : (
        data &&
        data.getNearUser && (
          <MapContainer>
            <AnimatedMap
              ref={mapRef}
              provider={"google"}
              style={styles.map}
              showsUserLocation={true}
              showCompass={true}
              rotateEnabled={false}
              region={initialRegion.coords}
              onRegionChange={region => onRegionChange(region)}
              onRegionChangeComplete={region => onRegionChangeComplete(region)}
              initialRegion={initialRegion.coords}
              followsUserLocation={true}
              zoomEnabled={true}
              moveOnMarkerPress={true}
            >
              {nearUser.length > 0 &&
                nearUser.map(marker => (
                  <Markers
                    marker={marker}
                    key={marker.id}
                    press={handleMarkerPress}
                  />
                ))}
            </AnimatedMap>
            <Icon name="add" style={styles.icon} size={20} />
            <ContentContainer>
              <CarouselItem
                data={rewriteProfile(nearUser)}
                onSnapUser={onSnapUser}
              />
            </ContentContainer>
          </MapContainer>
        )
      )}
    </View>
  );
};

export default withNavigation(MapScreen);
