import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
import { getMainDefinition } from "apollo-utilities";

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [client, setClient] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [notificationStatus, setNotificationStatus] = useState(false);
  const [locationStatus, setLocationStatus] = useState(false);

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
  };

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

      const token = await AsyncStorage.getItem("jwt");

      const httpLink = new HttpLink({
        uri: "http://localhost:4000"
      });

      const wsLink = new WebSocketLink({
        uri: `ws://localhost:4000/`,
        options: {
          connectionParams: {
            Bearer: token
          },
          reconnect: true
        }
      });

      const authMiddleware = new ApolloLink((operation, forward) => {
        operation.setContext({
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        return forward(operation);
      });

      const combinedLinks = split(
        ({ query }) => {
          const { kind, operation } = getMainDefinition(query);
          return kind === "OperationDefinition" && operation === "subscription";
        },
        wsLink,
        httpLink
      );

      // const request = async operation => {
      //   const token = await AsyncStorage.getItem("jwt");
      //   console.log("token : ", token);
      //   operation.setContext({
      //     headers: {
      //       Authorization: `Bearer ${token}`
      //     }
      //   });
      // };

      // const requestLink = new ApolloLink(
      //   (operation, forward) =>
      //     new Observable(observer => {
      //       let handle;
      //       Promise.resolve(operation)
      //         .then(oper => request(oper))
      //         .then(() => {
      //           handle = forward(operation).subscribe({
      //             next: observer.next.bind(observer),
      //             error: observer.error.bind(observer),
      //             complete: observer.complete.bind(observer)
      //           });
      //         })
      //         .catch(observer.error.bind(observer));

      //       return () => {
      //         if (handle) handle.unsubscribe();
      //       };
      //     })
      // );

      // const authLink = setContext((_, { headers }) => {
      //   // get the authentication token from local storage if it exists
      //   const token = localStorage.getItem('token');
      //   // return the headers to the context so httpLink can read them
      //   return {
      //     headers: {
      //       ...headers,
      //       authorization: token ? `Bearer ${token}` : "",
      //     }
      //   }
      // });

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
          concat(authMiddleware, combinedLinks)
        ])
      });

      // const client = new ApolloClient({
      //   cache,
      //   request: async operation => {
      //     const token = await AsyncStorage.getItem("jwt");
      //     return operation.setContext({
      //       headers: { Authorization: `Bearer ${token}` }
      //     });
      //   },
      //   ...apolloClientOptions
      // });

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
