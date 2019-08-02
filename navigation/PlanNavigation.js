import { createStackNavigator } from "react-navigation";
import Plan from "../screens/Plan/Plan";
import AddPlan from "../screens/Plan/AddPlan";
import AddActivity from "../screens/Plan/AddActivity";
import { stackStyles } from "./config";

export default createStackNavigator(
  {
    AddPlan: {
      screen: AddPlan,
      navigationOptions: {
        header: null
      }
    },
    AddActivity: {
      screen: AddActivity,
      navigationOptions: {
        header: null
      }
    },
    Plan
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        ...stackStyles
      }
    }
  }
);
