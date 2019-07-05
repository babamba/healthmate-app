import { createStackNavigator } from "react-navigation";
import Plan from "../screens/Plan/Plan";
import AddPlan from "../screens/Plan/AddPlan";
import { stackStyles } from "./config";

export default createStackNavigator(
  {
    AddPlan,
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
