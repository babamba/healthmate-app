import { createStackNavigator } from "react-navigation";
import Calendar from "../components/Calendar/Calendar";
// import Schedule from "../components/Calendar/TimeLine";
import { stackStyles } from "./config";

export default createStackNavigator(
  {
    Calendar
    //Schedule
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
