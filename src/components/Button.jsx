import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import colors from "../utils/colors";
import { heightRes } from "../utils/responsive";

const Button = ({ title, click, disable, containerStyle, textStyle, load }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.button, { opacity: disable ? 0.5 : 1 }, containerStyle]}
      disabled={disable || load}
      onPress={click}
    >
      {load ? (
        <ActivityIndicator animating={true}  size={20}/>
      ) : (
        <Text style={[styles.text, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    width: "100%",
    backgroundColor: colors.primary,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: heightRes(2),
  },
  text: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 14,
  },
});
