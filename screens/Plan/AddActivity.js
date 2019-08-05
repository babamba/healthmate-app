import React, { useState, useEffect } from "react";
import styled from "styled-components";
import styles from "../../styles";
import constants from "../../constants";
import { SafeAreaView, withNavigation, ScrollView } from "react-navigation";
import { AlertHelper } from "../../components/DropDown/AlertHelper";
import { Feather } from "@expo/vector-icons";
import MainTitle from "../../components/MainTitle";
import useInput from "../../hooks/useInput";
import NavIcon from "../../components/NavIcon";
import SubmitButton from "../../components/SubmitButton";
import gql from "graphql-tag";
import { useMutation } from "react-apollo-hooks";

export const CREATE_ACTIVITY = gql`
  mutation addActivity($items: [LineItem]) {
    addActivity(items: $items) {
      activity {
        id
        title
      }
    }
  }
`;

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

const ButtonArea = styled.View`
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

export default withNavigation(({ navigation }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const planId = navigation.getParam("planId"); //메인 목록 조회
  const titleInput = useInput("");
  const secondInput = useInput("");
  const countInput = useInput("");
  const setInput = useInput("");

  const createActivity = useMutation(CREATE_ACTIVITY, {
    refetchQueries: () => [{ query: SEE_ACTIVITY, variables: { planId } }]
  });

  const handleSubmit = async () => {
    AlertHelper.showDropAlert("success", "목록생성", "되었습니다");
    navigation.navigate("TabNavigation");
  };
  /* 
    items:[
      { 
        planId:"cjypje3v0im860b72ph8hyjgf", 
        title:"addAct1", 
        second:10, 
        count:0, 
        set:""
      }
      ,{},{}
    ]
  */

  console.log("planId : ", planId);

  return (
    <SafeAreaView
      style={constants.commonStyle.safeArea}
      forceInset={{ top: "always", bottom: "always" }}
    >
      <ScrollView>
        <View>
          <HeaderArea>
            <RowLeft>
              <MainTitle title={"Add Activity"} fontSize={42} />
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
        <ButtonArea>
          <SubmitButton
            bgColor={styles.neonGreen}
            loading={loading}
            onPress={() => handleSubmit()}
            text="제출"
          />
        </ButtonArea>
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
