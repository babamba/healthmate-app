import React from "react";
import styled from "styled-components";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Text = styled.Text``;

export default () => (
  <View>
    <Text>Add Activity</Text>
  </View>
);

/* mutation {
  addActivity(items:[{planId:"cjypje3v0im860b72ph8hyjgf", title:"addAct1", second:10, count:0, set:""}, {planId:"cjypje3v0im860b72ph8hyjgf", title:"addAct2", second:0, count:30, set:""}]){
     activity{
       title
     }
   }
 }
 */
