import { createStackNavigator, createAppContainer } from "react-navigation";
import TabNavigation from "./TabNavigation";
import PhotoNavigation from "./PhotoNavigation";
import MessageNavigation from "./MessageNavigation";
import PlanNavigation from "./PlanNavigation";
import ProfileNavigation from "./ProfileNavigation";
import CalendarNavigation from "./CalendarNavigation";
import { stackStyles } from "./config";
import BannerNavigation from "./BannerNavigation";

const MainNavigation = createStackNavigator(
  {
    TabNavigation,
    PhotoNavigation,
    MessageNavigation,
    PlanNavigation,
    ProfileNavigation,
    CalendarNavigation,
    BannerNavigation
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        ...stackStyles
      }
    },
    headerMode: "none",
    mode: "modal"
  }
);

export default createAppContainer(MainNavigation);
