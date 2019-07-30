import React from "react";
import styled from "styled-components";
import { SafeAreaView } from "react-navigation";
import { withNavigation } from "react-navigation";
import styles from "../../styles";
import constants from "../../constants";
import { TouchableOpacity } from "react-native";
import DatePicker from "../../components/Common/DatePicker";
import MainTitle from "../../components/MainTitle";
import { Feather } from "@expo/vector-icons";

const View = styled.View`
  flex: 1;
  padding: 20px;
`;

const BackButton = styled.TouchableOpacity`
  justify-content: center;
`;

const Text = styled.Text``;

const CloseArea = styled.View``;

const HeaderArea = styled.View`
  flex-direction: row;
`;

const RowLeft = styled.View`
  flex: 2;
  /* background-color: red;
  opacity: 0.4; */
`;
const RowRight = styled.View`
  flex: 1;
  /* background-color: blue;
  opacity: 0.4; */
  flex-direction: row;
  justify-content: flex-end;
`;

export default withNavigation(({ navigation }) => (
  <SafeAreaView
    style={constants.commonStyle.safeArea}
    forceInset={{ top: "always", bottom: "always" }}
  >
    <View>
      <HeaderArea>
        <RowLeft>
          <MainTitle title={"Add Plan"} fontSize={52} />
        </RowLeft>
        <RowRight>
          <BackButton
            onPress={() => {
              navigation.goBack(null);
            }}
          >
            <CloseArea>
              <Feather name={"arrow-down"} size={32} />
            </CloseArea>
          </BackButton>
        </RowRight>
      </HeaderArea>
      <DatePicker />
    </View>
  </SafeAreaView>
));

/**
   mutation{
    addPlan(planTitle:"addPlan" , exerciseType:"cjxph889fa49z0b127q2v3w3a", planImage:"https://content.surfit.io/image/KYVg3/3a80G/20918408885d37adfe5cf5b.png"){
      id
      planTitle
    }
  }

  # mutation{
#   addSchedule(plans:["cjxpppaifhifl0b423hxqgwon"], exerciseDate:"2019-07-31T06:15:08.421Z"){
#     id
#     user{
#       username
#     }
#     plan{
#       id
#       planTitle
#     }
#     exerciseDate
#     isChecked
#   }
# }

# {
#   getSchedule{
#     id
#     plan{
#       id
#       planTitle
#     }
#     user{
#       username
#     }
#     exerciseDate
#     isChecked
#   }
# }
 */
