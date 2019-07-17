import React, { createContext, useContext, useState } from "react";
import { AsyncStorage } from "react-native";
import { useApolloClient } from "react-apollo-hooks";
import { CachePersistor } from "apollo-cache-persist";

export const AuthContext = createContext();

export const AuthProvider = ({
  isLoggedIn: isLoggedInProp,
  children
  // client
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(isLoggedInProp);

  // const setTokenHeader = (operation, token) => {
  //   if (token)
  //     operation.setContext({ headers: { authorization: `Bearer ${token}` } });
  // };

  // console.log(ApolloLink);

  const logUserIn = async token => {
    try {
      await AsyncStorage.setItem("isLoggedIn", "true");
      await AsyncStorage.setItem("jwt", token);

      //await client.resetStore();
      console.log("jwt : ", token);

      console.log("isLoggedIn : true ");
      setIsLoggedIn(true);
      console.log("login ");
    } catch (e) {
      console.log(e);
    }
  };

  const logUserOut = async () => {
    try {
      // await client.clearStore().then(() => {
      //   client.resetStore();
      //   client.cache.reset();
      // });

      await AsyncStorage.setItem("isLoggedIn", "false");
      await AsyncStorage.setItem("jwt", "");
      // await CachePersistor.purge();

      await setIsLoggedIn(false);
      console.log("logout ");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, logUserIn, logUserOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useIsLoggedIn = () => {
  const { isLoggedIn } = useContext(AuthContext);
  return isLoggedIn;
};

export const useLogIn = () => {
  const { logUserIn } = useContext(AuthContext);
  return logUserIn;
};

export const useLogOut = () => {
  const { logUserOut } = useContext(AuthContext);
  return logUserOut;
};
