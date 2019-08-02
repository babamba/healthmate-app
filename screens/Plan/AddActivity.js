import React from "react";
import styled from "styled-components";
import styles from "../../styles";
import constants from "../../constants";
import { SafeAreaView, withNavigation, ScrollView } from "react-navigation";
import { AlertHelper } from "../../components/DropDown/AlertHelper";
import { Feather } from "@expo/vector-icons";
import MainTitle from "../../components/MainTitle";
import useInput from "../../hooks/useInput";
import NavIcon from "../../components/NavIcon";
import gql from "graphql-tag";
import { useMutation } from "react-apollo-hooks";

const View = styled.View`
  flex: 1;
  padding-horizontal: 10px;
`;
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
const CloseArea = styled.View``;
const BackButton = styled.TouchableOpacity`
  justify-content: center;
`;

const Text = styled.Text``;
const BodyArea = styled.View`
  justify-content: center;
  align-items: center;
  padding-top: 20px;
  padding-left: 10px;
  padding-right: 10px;
`;

export default withNavigation(({ navigation }) => {
  const id = navigation.getParam("id"); //메인 목록 조회

  console.log("id : ", id);

  return (
    <SafeAreaView
      style={constants.commonStyle.safeArea}
      forceInset={{ top: "always", bottom: "always" }}
    >
      <ScrollView>
        <View>
          <HeaderArea>
            <RowLeft>
              <MainTitle title={"Add Activity"} fontSize={52} />
            </RowLeft>
            <RowRight>
              <BackButton
                onPress={() => {
                  navigation.navigate("TabNavigation");
                }}
              >
                <CloseArea>
                  <Feather name={"arrow-down"} size={32} />
                </CloseArea>
              </BackButton>
            </RowRight>
          </HeaderArea>
          <BodyArea>
            <Text>Add Activity</Text>
          </BodyArea>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
});

/* mutation {
  addActivity(items:[{planId:"cjypje3v0im860b72ph8hyjgf", title:"addAct1", second:10, count:0, set:""}, {planId:"cjypje3v0im860b72ph8hyjgf", title:"addAct2", second:0, count:30, set:""}]){
     activity{
       title
     }
   }
 }
 */
