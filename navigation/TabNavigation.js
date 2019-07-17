import React from "react";
import { Platform } from "react-native";
import {
  createBottomTabNavigator,
  createStackNavigator
} from "react-navigation";
import Main from "../screens/Tabs/Main";
// import Home from "../screens/Tabs/Home";
import Plan from "../screens/Tabs/Plan";
import Chat from "../screens/Tabs/Chat";

import Search from "../screens/Tabs/Search";
import Notifications from "../screens/Tabs/Notifications";
import Map from "../screens/Tabs/Map";
import Profile from "../screens/Tabs/Profile";
import Detail from "../screens/Detail";
// import MessagesLink from "../components/MessagesLink";
import { View } from "react-native";
import NavIcon from "../components/NavIcon";
import { stackStyles } from "./config";
import styles from "../styles";
import UserDetail from "../screens/UserDetail";
import PlanDetail from "../screens/Plan/PlanDetail";
import ChatDetail from "../components/ChatDetail";

const stackFactory = (initialRoute, customConfig) =>
  createStackNavigator(
    {
      InitialRoute: {
        screen: initialRoute,
        navigationOptions: {
          ...customConfig
        }
      },
      ChatDetail: {
        screen: ChatDetail,
        navigationOptions: ({ navigation }) =>
          //console.log("title : ", navigation.getParam("roomUsers").username),
          ({
            headerTitle: `${navigation.getParam("userlist")}`
          })
      },
      Detail: {
        screen: Detail,
        navigationOptions: {
          title: "Photo"
        }
      },
      UserDetail: {
        screen: UserDetail,
        navigationOptions: ({ navigation }) => ({
          title: navigation.getParam("username")
        })
      },
      PlanDetail: {
        screen: PlanDetail,
        navigationOptions: ({ navigation }) => ({
          // title: navigation.getParam("username")
        })
      }
    },
    {
      defaultNavigationOptions: {
        headerBackTitle: null,
        headerTintColor: styles.blackColor,
        headerStyle: { ...stackStyles }
      }
    }
  );

export default createBottomTabNavigator(
  {
    Chat: {
      screen: stackFactory(Chat, {
        //headerRight: <MessagesLink />
        //headerRight: <AddPlan />
        header: null
        // headerTitle: <NavIcon name="logo-instagram" size={36} />
      }),
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <NavIcon
            focused={focused}
            name={Platform.OS === "ios" ? "ios-paper-plane" : "md-paper-plane"}
          />
        )
      }
    },
    Map: {
      screen: stackFactory(Map, {
        headerTitle: "근처 운동친구들을 찾아보세요",
        headerTitleStyle: {
          fontFamily: "NotoSansKR_Light"
        }
      }),
      navigationOptions: {
        // tabBarOnPress: ({ navigation }) =>
        //   navigation.navigate("PhotoNavigation"),
        tabBarIcon: ({ focused }) => (
          <NavIcon
            focused={focused}
            size={32}
            name={Platform.OS === "ios" ? "ios-map" : "md-map"}
          />
        )
      }
    },
    Main: {
      screen: stackFactory(Main, {
        header: null
      }),
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <NavIcon
            focused={focused}
            name={Platform.OS === "ios" ? "ios-home" : "md-home"}
          />
        )
      }
    },
    Plan: {
      screen: stackFactory(Plan, {
        //headerRight: <MessagesLink />
        //headerRight: <AddPlan />
        header: null
        // headerTitle: <NavIcon name="logo-instagram" size={36} />
      }),
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <NavIcon
            focused={focused}
            name={Platform.OS === "ios" ? "ios-archive" : "md-home"}
          />
        )
      }
    },
    // Home: {
    //   screen: stackFactory(Home, {
    //     headerRight: <MessagesLink />,
    //     headerTitle: <NavIcon name="logo-instagram" size={36} />
    //   }),
    //   navigationOptions: {
    //     tabBarIcon: ({ focused }) => (
    //       <NavIcon
    //         focused={focused}
    //         name={Platform.OS === "ios" ? "ios-archive" : "md-home"}
    //       />
    //     )
    //   }
    // },
    // Search: {
    //   screen: stackFactory(Search, {
    //     headerBackTitle: null
    //   }),
    //   navigationOptions: {
    //     tabBarIcon: ({ focused }) => (
    //       <NavIcon
    //         focused={focused}
    //         name={Platform.OS === "ios" ? "ios-search" : "md-search"}
    //       />
    //     )
    //   }
    // },
    // Add: {
    //   screen: View,
    //   navigationOptions: {
    //     tabBarOnPress: ({ navigation }) =>
    //       navigation.navigate("PhotoNavigation"),
    //     tabBarIcon: ({ focused }) => (
    //       <NavIcon
    //         focused={focused}
    //         size={32}
    //         name={
    //           Platform.OS === "ios"
    //             ? "ios-add-circle-outline"
    //             : "md-add-circle-outline"
    //         }
    //       />
    //     )
    //   }
    // },
    // Notifications: {
    //   screen: stackFactory(Notifications, {
    //     title: "Notifications"
    //   }),
    //   navigationOptions: {
    //     tabBarIcon: ({ focused }) => (
    //       <NavIcon
    //         focused={focused}
    //         name={
    //           Platform.OS === "ios"
    //             ? focused
    //               ? "ios-heart"
    //               : "ios-heart-empty"
    //             : focused
    //             ? "md-heart"
    //             : "md-heart-empty"
    //         }
    //       />
    //     )
    //   }
    // },
    Profile: {
      screen: stackFactory(Profile, {
        title: "Profile"
      }),
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <NavIcon
            focused={focused}
            name={Platform.OS === "ios" ? "ios-person" : "md-person"}
          />
        )
      }
    }
  },
  {
    tabBarOptions: {
      showLabel: false,
      style: {
        backgroundColor: "#FAFAFA"
      }
    }
  }
);
