import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import constants from "../constants";
import styles from "../styles";
import ProfileCircleIcon from "../components/Profile/ProfileCircleIcon";

const MainTitleArea = styled.View`
  width: ${constants.width};
  padding-top: 15px;
  padding-bottom: 15px;
  padding-horizontal: 20px;
  flex-direction: row;
  /* background-color: red;
  opacity: 0.2; */
`;

const Title = styled.Text`
  text-align: left;
  color: ${styles.lightGrey};
  font-size: ${props => (props.fontSize ? props.fontSize : "52px")};
  font-family: ${props =>
    props.fontFamily ? props.fontFamily : "NotoSansKR_Bold"};
`;

const TitleArea = styled.View`
  flex: 1;
  align-items: flex-start;
`;

const CircleArea = styled.View`
  flex: 1;
  align-items: flex-end;
  justify-content: center;
`;

// const Divider = styled.Text`
//   color: black;
//   font-family: NotoSansKR_Bold;
// `;

const MainTitle = ({ title, fontSize, fontFamily, isMain }) => {
  console.log("isMain ? ", isMain);
  return (
    <MainTitleArea>
      <TitleArea>
        <Title fontSize={fontSize} fontFamily={fontFamily}>
          {title}
        </Title>
      </TitleArea>
      {isMain && (
        <CircleArea>
          <ProfileCircleIcon />
        </CircleArea>
      )}
    </MainTitleArea>
  );
};

MainTitle.propTypes = {
  title: PropTypes.string.isRequired
};

export default MainTitle;
