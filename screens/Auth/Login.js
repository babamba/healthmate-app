import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import {
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Platform
} from "react-native";
import AuthButton from "../../components/AuthButton";
import AuthInput from "../../components/AuthInput";
import useInput from "../../hooks/useInput";
import { useMutation } from "react-apollo-hooks";
import { PASSWORD_LOG_IN } from "./AuthQueries";
import { useLogIn } from "../../AuthContext";

import NavIcon from "../../components/NavIcon";
import { SafeAreaView } from "react-navigation";
import constants from "../../constants";
import { AlertHelper } from "../../components/DropDown/AlertHelper";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const KeyboardAvoiding = styled.KeyboardAvoidingView`
  flex: 1;
  justify-content: center;
`;

const BackContainer = styled.TouchableOpacity`
  padding-horizontal: 20px;
  padding-top: 20px;
`;

export default ({ navigation }) => {
  const emailInput = useInput(navigation.getParam("email", ""));
  const passwordInput = useInput("");
  const logIn = useLogIn();
  const [loading, setLoading] = useState(false);
  const loginMutation = useMutation(PASSWORD_LOG_IN, {
    variables: {
      email: emailInput.value,
      password: passwordInput.value
    },
    fetchPolicy: "no-cache"
  });

  // Test auto input
  useEffect(() => {
    Alert.alert("comp did mount 귀찮아 test");
    emailInput.setValue("orochi13@naver.com");
    passwordInput.setValue("test1234");
  }, []);

  const handleLogin = async () => {
    const { value } = emailInput;
    const { value: password } = passwordInput;

    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (value === "") {
      return Alert.alert("Email can't be empty");
    } else if (!value.includes("@") || !value.includes(".")) {
      return Alert.alert("Please write an email");
    } else if (!emailRegex.test(value)) {
      return Alert.alert("That email is invalid");
    } else if (password === "") {
      return Alert.alert("Password can't be empty");
    }
    try {
      setLoading(true);
      const {
        data: { login }
      } = await loginMutation();
      if (login !== "" || login !== false) {
        //Alert.alert("Success Login");
        // console.log(dropdown);

        logIn(login);
        AlertHelper.showDropAlert("success", "로그인", "로그인 하셨습니다");
      } else {
        Alert.alert("Wrong email or password!");
      }
    } catch (e) {
      console.log(e);
      Alert.alert("Can't log in now");
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView
      style={constants.commonStyle.safeArea}
      forceInset={{ top: "always" }}
    >
      <KeyboardAvoiding behavior="padding">
        <BackContainer onPress={() => navigation.goBack(null)}>
          <NavIcon
            name={Platform.OS === "ios" ? "ios-arrow-back" : "md-arrow-back"}
          />
        </BackContainer>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <AuthInput
              {...emailInput}
              placeholder="Email"
              keyboardType="email-address"
              returnKeyType="send"
              onSubmitEditing={handleLogin}
              autoCorrect={false}
            />
            <AuthInput
              {...passwordInput}
              placeholder="Password"
              returnKeyType="send"
              autoCorrect={false}
              secureTextEntry={true}
            />
            <AuthButton loading={loading} onPress={handleLogin} text="Log In" />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoiding>
    </SafeAreaView>
  );
};
