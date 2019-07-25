import { createStackNavigator } from "react-navigation";
import Profile from "../screens/Tabs/Profile";
import { stackStyles } from "./config";

export default createStackNavigator(
  {
    Profile: {
      screen: Profile,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        ...stackStyles
      }
    }
  }
);

// Profile: {
//   screen: stackFactory(Profile, {
//     header: null
//   }),
//   navigationOptions: {
//     tabBarIcon: ({ focused }) => (
//       <NavIcon
//         focused={focused}
//         name={Platform.OS === "ios" ? "ios-person" : "md-person"}
//       />
//     )
//   }
// }
