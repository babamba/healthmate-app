import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppLoading } from "expo";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import { AsyncStorage } from "react-native";
import { InMemoryCache } from "apollo-cache-inmemory";
import { persistCache } from "apollo-cache-persist";
import ApolloClient from "apollo-boost";
import { ThemeProvider } from "styled-components";
import { ApolloProvider } from "react-apollo-hooks";
import apolloClientOptions from "./apollo";
import styles from "./styles";
import NavController from "./components/NavController";
import { AuthProvider } from "./AuthContext";

import * as Permissions from "expo-permissions";
import { Notifications } from "expo";

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [client, setClient] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [notificationStatus, setStatus] = useState(false);

  // const ask = async () => {
  //   const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
  //   setStatus(status);
  //   let token = await Notifications.getExpoPushTokenAsync();
  //   console.log(token);
  //   Notifications.setBadgeNumberAsync(0);
  // };

  const preLoad = async () => {
    try {
      console.log("preLoad start @@@");
      await Font.loadAsync({
        ...Ionicons.font,
        NotoSansKR_Thin: require("./assets/Fonts/NotoSansKR_Thin.ttf"),
        NotoSansKR_Black: require("./assets/Fonts/NotoSansKR_Black.ttf"),
        NotoSansKR_Bold: require("./assets/Fonts/NotoSansKR_Bold.ttf"),
        NotoSansKR_Light: require("./assets/Fonts/NotoSansKR_Light.ttf"),
        NotoSansKR_Medium: require("./assets/Fonts/NotoSansKR_Medium.ttf"),
        NotoSansKR_Regular: require("./assets/Fonts/NotoSansKR_Regular.ttf")
      });
      await Asset.loadAsync([require("./assets/logo.png")]);
      const cache = new InMemoryCache();
      await persistCache({
        cache,
        storage: AsyncStorage
      });
      const client = new ApolloClient({
        cache,
        request: async operation => {
          const token = await AsyncStorage.getItem("jwt");
          return operation.setContext({
            headers: { Authorization: `Bearer ${token}` }
          });
        },
        ...apolloClientOptions
      });
      const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
      if (!isLoggedIn || isLoggedIn === "false") {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
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

  return loaded && client && isLoggedIn !== null ? (
    <ApolloProvider client={client}>
      <ThemeProvider theme={styles}>
        <AuthProvider isLoggedIn={isLoggedIn} client={client}>
          <NavController />
        </AuthProvider>
      </ThemeProvider>
    </ApolloProvider>
  ) : (
    <AppLoading />
  );
}
