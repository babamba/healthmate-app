import React from "react";
import styled from "styled-components";
import DatePicker from "../../components/Common/DatePicker";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Text = styled.Text``;

export default () => (
  <View>
    <Text>Add Plan</Text>
    <DatePicker />
  </View>
);

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
