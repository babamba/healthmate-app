import React, { createContext, useContext, useState } from "react";
import { AsyncStorage } from "react-native";
import { useApolloClient, useMutation } from "react-apollo-hooks";
import { LOG_OUT } from "./screens/Auth/AuthQueries";
import { SEE_ROOMS } from "./screens/Tabs/Chat";

export const AuthContext = createContext();

export const AuthProvider = ({
  isLaunched: isLaunchedProp,
  isLoggedIn: isLoggedInProp,
  children
  // client
}) => {
  const client = useApolloClient();
  const [isLoggedIn, setIsLoggedIn] = useState(isLoggedInProp);
  const [isLaunch, setIsLaunch] = useState(isLaunchedProp);

  const setLaunched = async () => {
    try {
      await AsyncStorage.setItem("launched", "true");
      setIsLaunch(true);
    } catch (error) {
      console.log("error : ", error);
    }
  };

  const logUserIn = async token => {
    try {
      await AsyncStorage.setItem("isLoggedIn", "true");
      await AsyncStorage.setItem("jwt", token);
      //await client.resetStore();
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
      client.clearStore().then(() => {
        client.resetStore();
      });
      await AsyncStorage.setItem("isLoggedIn", "false");
      await AsyncStorage.setItem("jwt", "");
      await setIsLoggedIn(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, logUserIn, logUserOut, setLaunched, isLaunch }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useIsLoggedIn = () => {
  const { isLoggedIn } = useContext(AuthContext);
  return isLoggedIn;
};

export const useIsLaunchedApp = () => {
  const { isLaunch } = useContext(AuthContext);
  return isLaunch;
};

export const useLogIn = () => {
  const { logUserIn } = useContext(AuthContext);
  return logUserIn;
};

export const useLogOut = () => {
  const { logUserOut } = useContext(AuthContext);
  return logUserOut;
};

export const setLaunchedApp = () => {
  const { setLaunched } = useContext(AuthContext);
  return setLaunched;
};
