import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import {
  StyleSheet,
  Alert,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity
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

import CarouselItem from "../../components/Map/MapUsercarousel";
import Marker from "../../components/Map/Markers";
import { ENTRIES_CAROUSEL } from "../../EntryData/Entries";
import Markers from "../../components/Map/Markers";

import constants from "../../constants";
import { SafeAreaView } from "react-navigation";
import MainTitle from "../../components/MainTitle";
import MyLocation from "../../components/Map/MyLocation";
import ZoomIn from "../../components/Map/ZoomIn";
import ZoomOut from "../../components/Map/ZoomOut";

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

const NotGrantText = styled.Text`
  color: black;
  text-align: center;
  font-size: 18px;
  font-family: NanumBarunGothic;
  margin-bottom: 8px;
`;

const MapContainer = styled.View({
  ...StyleSheet.absoluteFillObject
});

const NotGrantContainer = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const ContentContainer = styled.View`
  position: absolute;
  flex: 0.3;
  justify-content: flex-end;
  bottom: 14;
  z-index: 3;
  /* background-color: red;
  opacity: 0.4; */
`;

const IconContainer = styled.View`
  position: absolute;
  top: 20;
  right: 20;
  flex-direction: row;
`;

const AskButton = styled.TouchableOpacity`
  width: ${constants.width / 3};
  height: ${constants.width / 8};
  border: 1px solid grey;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

const AskText = styled.Text`
  color: black;
  text-align: center;
  font-size: 18px;
  font-family: NanumBarunGothic;
`;

const IconDivide = styled.View`
  margin-right: 6px;
`;

const Icon = styled.View``;

const MapScreen = ({ navigation }) => {
  // 1KM 내 유저 검색
  // let tempState;
  const actionSheet = navigation.getScreenProps("actionSheet");

  const mapRef = useRef();
  const { data, loading, error } = useQuery(NEAR_USER, {
    fetchPolicy: "network-only"
  });

  const { width, height } = Dimensions.get("window");
  const GEOLOCATION_OPTIONS = {
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 1000
  };

  const ASPECT_RATIO = width / height;
  // const LATITUDE_DELTA = ;
  // const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  const [LATITUDE_DELTA, SET_LATITUDE_DELTA] = useState(0.03);
  const [LONGITUDE_DELTA, SET_LONGITUDE_DELTA] = useState(
    LATITUDE_DELTA * ASPECT_RATIO
  );

  const [errorMessage, setErrorMessage] = useState("");
  const [locationStatus, setLocationStatus] = useState(false);

  const [nearUser, setNearUser] = useState([]);
  const [mapReady, setMapReady] = useState(false);

  const [grantedMap, setGrantedMap] = useState(false);

  const [currentRegion, setCurrentRegion] = useState();

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

  const askAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    console.log(status);
    if (status === "granted") {
      setGrantedMap(true);
    }
  };

  const ask = async () => {
    // const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    // setNotificationStatus(status);
    // let token = await Notifications.getExpoPushTokenAsync();
    // console.log(token);
    // Notifications.setBadgeNumberAsync(0);

    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    console.log("status : ", status);
    if (status !== "granted") {
      setErrorMessage("지도 기능 권한을 승인하지 않으면 사용 할 수 없습니다.");
      Alert.alert(errorMessage);
    } else {
      let location = await Location.getCurrentPositionAsync({});
      setGrantedMap(true);
      await Location.watchPositionAsync(
        GEOLOCATION_OPTIONS,
        locationChanged(location),
        setCurrentRegion(location)
      );
    }
  };

  const locationChanged = location => {
    const {
      coords: { latitude: changeLat, longitude: changeLon }
    } = location;
    animateRegion(changeLat, changeLon);
    console.log("ready : ", initialRegion);
  };

  const animateRegion = (latitude, longitude) => {
    console.log(latitude, longitude);
    initialRegion.coords.stopAnimation();
    initialRegion.coords
      .timing({
        latitude,
        longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
        duration: 300
      })
      .start();
  };

  const animateZoom = async (latitude, longitude, isZoomIn) => {
    console.log(latitude, longitude);
    initialRegion.coords.stopAnimation();
    console.log(LATITUDE_DELTA);
    if (isZoomIn) {
      if (LATITUDE_DELTA > 0.014) {
        initialRegion.coords
          .timing({
            latitude,
            longitude,
            latitudeDelta: LATITUDE_DELTA - 0.005,
            longitudeDelta: LONGITUDE_DELTA - 0.005,
            duration: 300
          })
          .start();

        await SET_LATITUDE_DELTA(LATITUDE_DELTA - 0.005);
        await SET_LONGITUDE_DELTA(LONGITUDE_DELTA - 0.005);
      }
    } else {
      if (LATITUDE_DELTA < 0.059) {
        initialRegion.coords
          .timing({
            latitude,
            longitude,
            latitudeDelta: LATITUDE_DELTA + 0.005,
            longitudeDelta: LONGITUDE_DELTA + 0.005,
            duration: 300
          })
          .start();

        await SET_LATITUDE_DELTA(LATITUDE_DELTA + 0.005);
        await SET_LONGITUDE_DELTA(LONGITUDE_DELTA + 0.005);
      }
    }
  };

  function rewriteProfile(data) {
    let tempData;
    if (data) {
      if (Array.isArray(data) === true) {
        tempData = data.map(profile => ({
          id: profile.id,
          username: profile.username,
          bio: profile.bio,
          avatar: profile.avatar
        }));
      }
    }
    //console.log(tempData);
    return tempData;
  }

  const onRegionChange = region => {
    // console.log(region);
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

  const showActionSheet = data => {
    // ActionSheetIOS.showActionSheetWithOptions(
    //   {
    //     options: ["취소", "프로필 보기", "메시지 보내기"],
    //     destructiveButtonIndex: 1,
    //     cancelButtonIndex: 0
    //   },
    //   buttonIndex => {
    //     if (buttonIndex === 1) {
    //       /* destructive action */
    //       console.log("프로필 네비게이션");
    //       navigation.navigate("UserDetail", { username: user.id });
    //     } else if (buttonIndex === 2) {
    //       console.log("채팅 디테일 네비게이션");
    //     }
    //   }
    // );

    actionSheet(
      {
        options: ["취소", "프로필 보기", "메시지 보내기"],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 0
      },
      buttonIndex => {
        if (buttonIndex === 1) {
          /* destructive action */
          console.log("프로필 네비게이션");
          navigation.navigate("UserDetail", { id: data.id });
        } else if (buttonIndex === 2) {
          console.log("채팅 디테일 네비게이션");
        }
      }
    );
  };

  const onRegionChangeComplete = region => {
    console.log("onRegionChangeComplete !");
    //setRegion(tempState);
    //console.log(" region : ", region);
  };

  const handleMorePress = data => {
    console.log("press more button! ", data);
    showActionSheet(data);
  };

  const HandleMyLocation = async () => {
    console.log("currentRegion , ", currentRegion);
    const {
      coords: { latitude, longitude }
    } = currentRegion;

    animateRegion(latitude, longitude);
  };

  const HandleZoom = async isZoomIn => {
    console.log("isZoomIn ? ", isZoomIn);
    const {
      coords: { latitude, longitude }
    } = initialRegion;

    animateZoom(latitude, longitude, isZoomIn);
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

  const onMapReady = () => {
    console.log("onMapReady !");
    setMapReady(true);
  };

  useEffect(() => {
    ask();
  }, []);

  useEffect(() => {
    onRegionChange(initialRegion.coords);
    console.log("change state region");
  }, [initialRegion]);

  useEffect(() => {
    const onCompleted = data => {
      //console.log("onCompleted data : ", data);
      setNearUser(data.getNearUser);
    };
    const onError = error => {
      console.log("error initial load data : ", error);
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
    <SafeAreaView
      style={constants.commonStyle.safeArea}
      forceInset={{ top: "always" }}
    >
      <MainTitle title={"Map"} />
      <View>
        {loading ? (
          <Loader />
        ) : grantedMap ? (
          data &&
          data.getNearUser && (
            <MapContainer>
              <AnimatedMap
                ref={mapRef}
                provider={"google"}
                style={constants.commonStyle.map}
                showsUserLocation={true}
                showCompass={true}
                rotateEnabled={false}
                region={initialRegion.coords}
                onRegionChange={region => onRegionChange(region)}
                minZoomLevel={10}
                maxZoomLevel={20}
                zoomTapEnabled={false}
                onRegionChangeComplete={region =>
                  onRegionChangeComplete(region)
                }
                initialRegion={initialRegion.coords}
                followsUserLocation={true}
                zoomEnabled={true}
                moveOnMarkerPress={true}
                onMapReady={() => onMapReady()}
                // enableZoomControl={true}
              >
                {mapReady &&
                  nearUser.length > 0 &&
                  nearUser.map(marker => {
                    return <Markers marker={marker} key={marker.id} />;
                  })}
              </AnimatedMap>
              {/* <Icon name="add" style={styles.icon} size={20} /> */}
              <IconContainer>
                <IconDivide>
                  <MyLocation press={HandleMyLocation} size={20} />
                </IconDivide>
                <IconDivide>
                  <ZoomIn press={HandleZoom} size={20} />
                </IconDivide>
                <IconDivide>
                  <ZoomOut press={HandleZoom} size={20} />
                </IconDivide>
              </IconContainer>
              <ContentContainer>
                {mapReady ? (
                  <CarouselItem
                    data={rewriteProfile(nearUser)}
                    onSnapUser={onSnapUser}
                    // press={(event, marker) => handleMarkerPress(event, marker)}
                    press={data => handleMorePress(data)}
                  />
                ) : (
                  <ActivityIndicator />
                )}
              </ContentContainer>
            </MapContainer>
          )
        ) : (
          <NotGrantContainer>
            <NotGrantText>지도 권한을 승인해 주셔야</NotGrantText>
            <NotGrantText>사용 가능합니다 :(</NotGrantText>
            <AskButton onPress={() => askAsync()}>
              <AskText>권한 승인</AskText>
            </AskButton>
          </NotGrantContainer>
        )}
      </View>
    </SafeAreaView>
  );
};

export default MapScreen;
