import React from "react";
import styled from "styled-components";
import styles from "../../styles";
import constants from "../../constants";
import { useQuery } from "react-apollo-hooks";
import gql from "graphql-tag";
import { withNavigation } from "react-navigation";
import TouchableScale from "react-native-touchable-scale";

export const ME = gql`
  {
    me {
      username
      avatar
    }
  }
`;

const Container = styled.View`
  flex-direction: row;
  justify-content: center;
`;

const Text = styled.Text`
  color: white;
  text-align: center;
  font-weight: 600;
  font-family: CoreGothicD_ExtraBold;
`;

const round_value = constants.width / 10;

const Image = styled.Image`
  width: ${round_value};
  height: ${round_value};
  border-radius: ${Math.round(round_value / 2)};
`;

const UserNameText = styled.Text`
  color: black;
`;

const ProfileCircleButton = ({ navigation }) => {
  const { loading, data, error } = useQuery(ME, {
    fetchPolicy: "cache-first"
  });

  return (
    <TouchableScale
      onPress={() => navigation.navigate("Profile")}
      activeScale={0.9}
    >
      <Container>
        {loading ? (
          <Image source={{ uri: require("../../assets/default_user.png") }} />
        ) : (
          data &&
          data.me && (
            <Container>
              {/* <UserNameText>안녕하세요 {data.me.username}님</UserNameText> */}
              <Image source={{ uri: data.me.avatar }} />
            </Container>
          )
        )}
      </Container>
    </TouchableScale>
  );
};

export default withNavigation(ProfileCircleButton);
