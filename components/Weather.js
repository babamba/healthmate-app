import React, { useState, useEffect, useRef } from "react";
import { ActivityIndicator, StyleSheet, Platform } from "react-native";
import styled from "styled-components";

import * as Permissions from "expo-permissions";
import * as Location from "expo-location";

import { WEATHER } from "../assets/Weather/AnimationWeather";
import { weather_text, weather_icon } from "../weatherType";
import { WEATHER_KEY } from "react-native-dotenv";

import LottieView from "lottie-react-native";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: flex-start;
  flex-direction: row;
`;

const Row = styled.View``;

const Text = styled.Text`
  font-size: 16px;
  font-family: NotoSansKR_Light;
  text-align: left;
  line-height: 25px;
  color: #3b3b3b;
`;

const Content = styled.View`
  flex-direction: row;
`;

const IconContainer = styled.View`
  padding-left: 10px;
  padding-right: 20px;
  /* background-color: green;
  opacity: 0.5; */
`;

const Icon = styled.Image`
  flex: 1;
  width: 40px;
  height: 40px;
`;

const TextContainer = styled.View`
  /* background-color: red;
  opacity: 0.5; */
`;

const LoadingContainer = styled.View`
  align-items: center;
`;

const Weather = () => {
  const [weatherLoadComplete, setWeatherLoadComplete] = useState(false);
  const [locationName, setLocationName] = useState("---");
  const [weather, setWeather] = useState("--");
  const [icon, setIcon] = useState(weather_icon.loading);
  const animationIcon = useRef();

  const GEOLOCATION_OPTIONS = {
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 1000
  };

  const ask = async () => {
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
    _getWeather(location);
  };

  const _getWeather = location => {
    const {
      coords: { latitude, longitude }
    } = location;
    //const API_KEY = "8a8a5340f48722a24abf1b77b4059837";
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_KEY}`
    )
      .then(response => response.json()) // 응답값을 json으로 변환
      .then(async json => {
        console.log(json);
        await setWeather(json.weather[0].main);
        await setLocationName(json.name);
        await setIcon(getIcon(json.weather[0].main));
        //await setIcon(WEATHER.Thunderstorm);
        await setWeather(getLocaleName(json.weather[0].main));
        setWeatherLoadComplete(true);
      });
  };

  const getIcon = type => {
    for (let key in weather_icon) {
      if (type === key) {
        return weather_icon[key];
      }
    }
  };

  const getLocaleName = type => {
    for (let key in weather_text) {
      if (type === key) {
        return weather_text[key];
      }
    }
  };

  useEffect(() => {
    ask();
  }, []);

  return (
    <Container>
      {weatherLoadComplete ? (
        <Content>
          <IconContainer>
            <Icon source={icon} />
            {/* <LottieView
              ref={animationIcon}
              source={icon}
              autoPlay={true}
              loop={true}
              speed={1}
              style={{
                width: 50,
                height: 50
              }}
            /> */}
          </IconContainer>
          <TextContainer>
            <Text>지금 {locationName} 은</Text>
            <Text>{weather} 입니다</Text>
          </TextContainer>
        </Content>
      ) : (
        <Content>
          <LoadingContainer>
            <Text>위치를 읽어들이는 중 ... </Text>
            {/* <Icon source={icon} /> */}
            {/* <LottieView
            ref={animationIcon}
            source={WEATHER.Loading}
            autoPlay={true}
            loop={true}
            speed={4}
            style={{
              width: 300,
              height: 50
            }}
          /> */}
          </LoadingContainer>
        </Content>
      )}
    </Container>
  );
};

// const styles = StyleSheet.create({
//   lottie: {
//     width: 100,
//     height: 100
//   }
// });

export default Weather;
