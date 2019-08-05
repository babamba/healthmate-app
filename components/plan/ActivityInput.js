import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import constants from "../../constants";

const Container = styled.View`
  box-shadow: ${constants.boxShadow};
`;

const TextInput = styled.TextInput`
  /* width: ${constants.width / 1.7}; */
  width: ${props => (props.width ? props.width : constants.width / 1.7)};
  /* background-color: ${props => props.theme.greyColor}; */
  background-color: transparent;
  /* border: 0.5px solid ${props => props.theme.darkGreyColor}; */
  border-radius: 4px;
  border-width: 0px;
  border-bottom-color: transparent;

  color: black;
  font-size: 24px;
  font-family: NanumBarunGothicLight;
`;

const ActivityInput = ({
  placeholder,
  value,
  keyboardType = "default",
  autoCapitalize = "none",
  returnKeyType = "done",
  secureTextEntry = false,
  onChange,
  onSubmitEditing = () => null,
  autoCorrect = true,
  width,
  autoFocus = false,
  maxLength = 10
}) => (
  <Container>
    <TextInput
      onChangeText={onChange}
      keyboardType={keyboardType}
      returnKeyType={returnKeyType}
      placeholder={placeholder}
      autoCapitalize={autoCapitalize}
      onSubmitEditing={onSubmitEditing}
      autoCorrect={autoCorrect}
      secureTextEntry={secureTextEntry}
      value={value}
      width={width}
      autoFocus={autoFocus}
      maxLength={maxLength}
    />
  </Container>
);

ActivityInput.propTypes = {
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  keyboardType: PropTypes.oneOf([
    "default",
    "number-pad",
    "decimal-pad",
    "numeric",
    "email-address",
    "phone-pad"
  ]),
  autoCapitalize: PropTypes.oneOf(["none", "sentences", "words", "characters"]),
  onChange: PropTypes.func.isRequired,
  returnKeyType: PropTypes.oneOf(["done", "go", "next", "search", "send"]),
  onSubmitEditing: PropTypes.func,
  autoCorrect: PropTypes.bool,
  width: PropTypes.number
};

export default ActivityInput;
