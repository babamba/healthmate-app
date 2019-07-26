import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import PropTypes from "prop-types";
import styles from "../styles";

const MaterialIcon = ({
  focused = true,
  name,
  color = styles.blackColor,
  size = size ? size : 30
}) => (
  <MaterialIcons
    name={name}
    color={focused ? color : styles.darkGreyColor}
    size={size}
  />
);

MaterialIcon.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string,
  size: PropTypes.number,
  focused: PropTypes.bool
};

export default MaterialIcon;
