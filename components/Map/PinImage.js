import React from "react";
import constants from "../../constants";
import styled from "styled-components";

const markerImageSize = constants.width / 12;
const ImageContainer = styled.View`
  width: ${markerImageSize};
  height: ${markerImageSize};
  border-radius: ${markerImageSize / 2};
`;
const Image = styled.Image`
  width: ${markerImageSize};
  height: ${markerImageSize};
  border-radius: ${markerImageSize / 2};
  z-index: 0;
`;

export default ({ uri }) => {
  console.log(uri);
  return (
    <ImageContainer>
      <Image source={{ uri }} />
    </ImageContainer>
  );
};
