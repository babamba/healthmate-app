import React, { useState, useEffect, useRef } from "react";
import { View } from "react-native";
import {
  Ionicons,
  AntDesign,
  Entypo,
  FontAwesome,
  MaterialIcons,
  MaterialCommunityIcons
} from "@expo/vector-icons";
import { AppLoading } from "expo";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import { AsyncStorage } from "react-native";
import { ThemeProvider } from "styled-components";

import styles from "./styles";
import NavController from "./components/NavController";
import { AuthProvider } from "./AuthContext";

import * as Permissions from "expo-permissions";
import { Notifications } from "expo";

import { InMemoryCache } from "apollo-cache-inmemory";
import { persistCache } from "apollo-cache-persist";
import { setContext } from "apollo-link-context";
//import ApolloClient from "apollo-boost";
import { ApolloClient } from "apollo-client";
import apolloClientOptions from "./apollo";
import { ApolloProvider } from "react-apollo-hooks";
import { onError } from "apollo-link-error";
import { ApolloLink, split, concat } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { HttpLink } from "apollo-link-http";
import { getMainDefinition, toIdValue } from "apollo-utilities";
import * as MagicMove from "react-native-magic-move";
import {
  ActionSheetProvider,
  connectActionSheet
} from "@expo/react-native-action-sheet";

import {
  LOCAL_SERVER,
  LOCAL_SERVER_WS,
  DEPLOY_SERVER,
  DEPLOY_SERVER_WS
} from "react-native-dotenv";

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [client, setClient] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [isLaunched, setIsLaunched] = useState(null);

  const [notificationStatus, setNotificationStatus] = useState(false);
  const [locationStatus, setLocationStatus] = useState(false);

  const getToken = async () => {
    const token = await AsyncStorage.getItem("jwt");
    if (token) {
      return token;
    } else {
      return "";
    }
  };

  const ask = async () => {
    // const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    // setNotificationStatus(status);
    // let token = await Notifications.getExpoPushTokenAsync();
    // console.log(token);
    // Notifications.setBadgeNumberAsync(0);

    const { status: locationstatus } = await Permissions.askAsync(
      Permissions.LOCATION
    );
    setLocationStatus(locationstatus);

    console.log("ask ----");
  };

  const preLoad = async () => {
    let token = await getToken();
    try {
      console.log("preLoad start @@@");
      await Font.loadAsync({
        //AntDesign, Entypo, FontAwesome, MaterialIcons , MaterialCommunityIcons
        ...Ionicons.font,
        ...AntDesign.font,

        ...FontAwesome.font,
        ...MaterialIcons.font,
        ...MaterialCommunityIcons.font,
        ...Entypo.font,
        NanumBarunGothic: require("./assets/Fonts/NanumBarunGothic.ttf"),
        NanumBarunGothicBold: require("./assets/Fonts/NanumBarunGothicBold.ttf"),
        NanumBarunGothicLight: require("./assets/Fonts/NanumBarunGothicLight.ttf"),
        NanumBarunGothicUltraLight: require("./assets/Fonts/NanumBarunGothicUltraLight.ttf"),
        NotoSansKR_Thin: require("./assets/Fonts/NotoSansKR_Thin.ttf"),
        NotoSansKR_Black: require("./assets/Fonts/NotoSansKR_Black.ttf"),
        NotoSansKR_Bold: require("./assets/Fonts/NotoSansKR_Bold.ttf"),
        NotoSansKR_Light: require("./assets/Fonts/NotoSansKR_Light.ttf"),
        NotoSansKR_Medium: require("./assets/Fonts/NotoSansKR_Medium.ttf"),
        NotoSansKR_Regular: require("./assets/Fonts/NotoSansKR_Regular.ttf"),

        CoreGothicD_ExtLt: require("./assets/Fonts/CoreGothicD_ExtLt.ttf"),
        CoreGothicD_ExtraBold: require("./assets/Fonts/CoreGothicD_ExtraBold.ttf"),
        CoreGothicD_Medium: require("./assets/Fonts/CoreGothicD_Medium.ttf"),
        CoreGothicD_Reg: require("./assets/Fonts/CoreGothicD_Reg.ttf"),
        CoreGothicD_Thin: require("./assets/Fonts/CoreGothicD_Thin.ttf")
      });
      await Asset.loadAsync([
        require("./assets/logo.png"),
        require("./assets/WeatherIcon/icons8-more-50.png"),
        require("./assets/WeatherIcon/icons8-fog-50.png"),
        require("./assets/WeatherIcon/icons8-windy-weather-50.png"),
        require("./assets/WeatherIcon/icons8-wet-50.png"),
        require("./assets/WeatherIcon/icons8-snow-50.png"),
        require("./assets/WeatherIcon/icons8-partly-cloudy-day-50.png"),
        require("./assets/WeatherIcon/icons8-storm-50.png"),
        require("./assets/WeatherIcon/icons8-rain-50.png"),
        require("./assets/WeatherIcon/icons8-sun-50.png"),
        require("./assets/WeatherIcon/icons8-more-50.png"),

        require("./assets/Intro/1.jpg"),
        require("./assets/pin.png"),
        require("./assets/Intro/2.jpeg"),
        require("./assets/Intro/3.jpeg"),

        require("./assets/default_user.png")
      ]);

      const cache = new InMemoryCache();

      await persistCache({
        cache,
        storage: AsyncStorage
      });

      const httpLink = new HttpLink({
        uri: LOCAL_SERVER
        //uri: DEPLOY_SERVER
      });

      const connectionParams = async () => {
        const token = await AsyncStorage.getItem("token");
        return token
          ? { headers: { Authorization: "Bearer " + token } }
          : { headers: {} };
      };

      const wsLink = new WebSocketLink({
        uri: LOCAL_SERVER_WS,
        //uri: DEPLOY_SERVER_WS,
        options: {
          // connectionParams: () =>
          //   getToken().then(result => {
          //     console.log("result : ", result);
          //     return {
          //       Authorization: result ? `Bearer ${result}` : ""
          //     };
          //   }),
          reconnect: true
        }
      });

      const authheader = setContext(async (req, { headers }) => {
        const token = await AsyncStorage.getItem("jwt");
        //console.log("token", token);
        return {
          headers: {
            // ...headers,
            Authorization: token ? `Bearer ${token}` : ""
          }
        };
      });

      const combinedLinks = split(
        ({ query }) => {
          const { kind, operation } = getMainDefinition(query);
          if (operation === "subscription") {
            console.log("new subscription combinedLinks");
          }
          return kind === "OperationDefinition" && operation === "subscription";
        },
        wsLink,
        httpLink
      );

      const client = new ApolloClient({
        cache,
        link: ApolloLink.from([
          onError(({ graphQLErrors, networkError }) => {
            if (graphQLErrors)
              graphQLErrors.map(({ message, locations, path }) =>
                console.log(
                  `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
                )
              );
            if (networkError) console.log(`[Network error]: ${networkError}`);
          }),
          concat(authheader, combinedLinks)
        ])
      });

      const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
      const isLaunched = await AsyncStorage.getItem("launched");
      if (!isLoggedIn || isLoggedIn === "false") {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }

      console.log("App loading : ", isLaunched);
      if (!isLaunched || isLaunched === "false") {
        setIsLaunched(false);
      } else {
        setIsLaunched(true);
      }

      setLoaded(true);
      setClient(client);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    preLoad();
    //ask();
  }, []);

  useEffect(() => {
    console.log("Auth effect !");
  }, [isLoggedIn]);

  useEffect(() => {
    console.log("isLaunched App Effect !");
  }, [isLaunched]);

  const ConnectionNavController = connectActionSheet(NavController);

  return loaded && client && isLoggedIn !== null ? (
    <ApolloProvider client={client}>
      <ThemeProvider theme={styles}>
        <AuthProvider
          isLoggedIn={isLoggedIn}
          isLaunched={isLaunched}
          client={client}
        >
          <ActionSheetProvider>
            <MagicMove.Provider>
              <ConnectionNavController />
            </MagicMove.Provider>
          </ActionSheetProvider>
        </AuthProvider>
      </ThemeProvider>
    </ApolloProvider>
  ) : (
    <AppLoading />
  );
}
