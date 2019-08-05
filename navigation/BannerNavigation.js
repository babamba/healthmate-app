import { createStackNavigator } from "react-navigation";
import BigBannerDetail from "../components/Main/BigBannerDetail";
import { stackStyles } from "./config";

export default createStackNavigator(
  {
    BigBannerDetail
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        ...stackStyles
      }
    },
    headerMode: "none"
  }
);
