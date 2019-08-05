import React, { useState } from "react";
import { View, TouchableOpacity, Alert, Platform } from "react-native";
import { withNavigation } from "react-navigation";
import PropTypes from "prop-types";
import styled from "styled-components";
import globalStyles from "../../styles";
import constants from "../../constants";
import ActivityInput from "../../components/Plan/ActivityInput";
import SubmitButton from "../../components/SubmitButton";
import useInput from "../../hooks/useInput";
import styles from "../../styles";
// import { CREATE_ACTIVITY } from "../../screens/Plan/AddActivity";
import { AlertHelper } from "../../components/DropDown/AlertHelper";
import gql from "graphql-tag";
import { useMutation } from "react-apollo-hooks";

const Conatiner = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: flex-start;

  padding-vertical: 20px;
  padding-left: 30px;
`;

const SubText = styled.Text`
  padding-left: 4px;
  font-size: 20px;
  width: 60px;
  font-family: NanumBarunGothicLight;
  align-self: flex-end;
`;

const ButtonArea = styled.View`
  justify-content: center;
  align-self: center;
  padding: 20px;
`;

const KeyboardAvoiding = styled.KeyboardAvoidingView`
  flex: 1;
  justify-content: center;
`;

const InputActivity = ({ navigation, planId, toggle, handleCreate }) => {
  console.log("planId", planId);
  console.log("toggle", toggle);
  console.log("handleCreate", handleCreate);
  const [loading, setLoading] = useState(false);
  const titleInput = useInput("");
  const secondInput = useInput("");
  const countInput = useInput("");
  const setInput = useInput("");

  const handleSubmit = async () => {
    const { value: title } = titleInput;
    const { value: second } = secondInput;
    const { value: count } = countInput;
    const { value: set } = setInput;

    let items = [];
    items.push({
      planId,
      title,
      second: Number(second),
      count: Number(count),
      set
    });

    if (title === "") {
      return AlertHelper.showDropAlert("warning", "제목을", "입력해주세요");
    }

    try {
      setLoading(true);

      console.log("items : ", items);
      const result = handleCreate(items);

      //  const {
      //    data: { addActivity }
      //  } = await createActivity({
      //    variables: {
      //      items
      //    }
      //  });

      if (result) {
        toggle();
        AlertHelper.showDropAlert("success", "목록생성", "되었습니다");
      }
    } catch (e) {
      console.log(e);
      AlertHelper.showDropAlert("warning", "목록생성", "실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoiding behavior="padding">
      <Conatiner>
        <Row>
          <ActivityInput
            {...titleInput}
            placeholder="운동명"
            keyboardType="default"
            returnKeyType="send"
            autoCorrect={false}
            autoFocus={true}
          />
          <SubText>을</SubText>
        </Row>
        <Row>
          <ActivityInput
            {...secondInput}
            width={constants.width / 6}
            placeholder="몇 분"
            keyboardType="default"
            returnKeyType="send"
            autoCorrect={false}
            keyboardType={"number-pad"}
            maxLength={3}
          />
          <SubText>분</SubText>

          <ActivityInput
            {...countInput}
            width={constants.width / 7}
            placeholder="몇 회"
            keyboardType="default"
            returnKeyType="send"
            autoCorrect={false}
            keyboardType={"number-pad"}
            maxLength={2}
          />
          <SubText>회</SubText>
          <ActivityInput
            {...setInput}
            width={constants.width / 7}
            placeholder="3"
            keyboardType="default"
            returnKeyType="send"
            autoCorrect={false}
            keyboardType={"number-pad"}
            maxLength={2}
          />
          <SubText>세트</SubText>
        </Row>

        <ButtonArea>
          <SubmitButton
            bgColor={styles.neonGreen}
            loading={loading}
            onPress={() => handleSubmit()}
            text="제출"
          />
        </ButtonArea>
      </Conatiner>
    </KeyboardAvoiding>
  );
};

// PlanContentList.propTypes = {
//   files: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.string.isRequired,
//       url: PropTypes.string.isRequired
//     })
//   ).isRequired,
//   id: PropTypes.string.isRequired
// };

export default withNavigation(InputActivity);
