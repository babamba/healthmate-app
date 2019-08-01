import { createStackNavigator, createAppContainer } from "react-navigation";
import TabNavigation from "./TabNavigation";
import PhotoNavigation from "./PhotoNavigation";
import MessageNavigation from "./MessageNavigation";
import PlanNavigation from "./PlanNavigation";
import ProfileNavigation from "./ProfileNavigation";
import CalendarNavigation from "./CalendarNavigation";
import Scene1 from "../screens/Test/Scene1";
import { stackStyles } from "./config";

const MainNavigation = createStackNavigator(
  {
    TabNavigation,
    PhotoNavigation,
    MessageNavigation,
    PlanNavigation,
    ProfileNavigation,
    CalendarNavigation,
    Scene1
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
