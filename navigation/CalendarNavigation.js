import { createStackNavigator } from "react-navigation";
import Calendar from "../components/Calendar/Calendar";
import { stackStyles } from "./config";

export default createStackNavigator(
  {
    Calendar
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
