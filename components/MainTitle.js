import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import constants from "../constants";

const MainTitleArea = styled.View`
  width: ${constants.width};
  padding-top: 15px;
  padding-bottom: 15px;
  padding-horizontal: 20px;
`;

const Title = styled.Text`
  color: black;
  text-align: left;
  font-weight: 300;
  font-size: ${props => (props.fontSize ? props.fontSize : "52px")};
  font-family: NotoSansKR_Bold;
  font-family: ${props =>
    props.fontFamily ? props.fontFamily : "NotoSansKR_Bold"};
`;

const MainTitle = ({ title, fontSize, fontFamily }) => (
  <MainTitleArea>
    <Title fontSize={fontSize} fontFamily={fontFamily}>
      {title}
    </Title>
  </MainTitleArea>
);

MainTitle.propTypes = {
  title: PropTypes.string.isRequired
};

export default MainTitle;
