import { StyleSheet, Text, View } from "react-native";
import React, { useCallback, useState, useContext } from "react";
import colors from "../utils/colors";
import { heightRes } from "../utils/responsive";
import textStyle from "../utils/textStyle";
import Input from "../components/Input";
import Button from "../components/Button";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { BaseURL } from "../utils/constant";
import { UserContext } from "../store/State";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showMessage } from "react-native-flash-message";

const Login = () => {
  const navigation = useNavigation();
  const {
    state: { saveUser, getCourses, getSessions },
    userDispatch,
  } = useContext(UserContext);

  const emailRegex = RegExp(
    /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
  );
  const [details, setDetails] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState({
    email: "",
    password: "",
  });

  const onChange = useCallback(
    (name, value) => {
      setError((prev) => ({ ...prev, [name]: "" }));
      setDetails((prev) => ({ ...prev, [name]: value }));
    },
    [details]
  );

  const errorHandler = useCallback(
    (name, value) => {
      setError((prev) => ({ ...prev, [name]: value }));
    },
    [error]
  );
  const navigateToRegister = () => {
    navigation.navigate("Register");
  };

  const handleSubmit = async () => {
    if (!emailRegex.test(details.email)) {
      return errorHandler("email", "Enter a valid Email");
    }
    if (details.password.length < 6) {
      return errorHandler("password", "Paassword must be up to 6 characters");
    }
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${BaseURL}/auth/login`,
        {
          email: details.email,
          password: details.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      await AsyncStorage.setItem("token", data.data.token);
      saveUser(data.data.user, userDispatch);
      showMessage({
        message: "Login successful",
        type: "success",
      });
      setLoading(false);
      if (data.data.user.accountType === "STUDENT") {
        getCourses(userDispatch);
        navigation.replace("StudentBoard");
      } else {
        if (data.data.user.tutor === null) {
          navigation.replace("Course");
        } else {
          getSessions(userDispatch)
          navigation.replace("Profile");
        }
      }
    } catch (error) {
      setLoading(false);
      showMessage({
        message: "Login Failed",
        type: "danger",
        duration: 3000,
        position:'bottom'
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={[textStyle.defaultBoldTitle1, { color: colors.white }]}>
          Welcome
        </Text>
        <Text
          style={[
            textStyle.defaultBoldTitle1,
            { color: colors.white, fontSize: 26, marginVertical: heightRes(1) },
          ]}
        >
          Sign in{" "}
        </Text>
        <Text
          style={[
            textStyle.defaultRegularFootnote,
            { color: colors.white, marginVertical: heightRes(1.5) },
          ]}
        >
          Education is the passport to the future, for tomorrow belongs to those
          who prepare for it today.
        </Text>
      </View>
      <View style={styles.bottom}>
        <Input
          placeholder="Email"
          onChange={(text) => onChange("email", text)}
          error={error.email}
        />
        <Input
          placeholder="Password"
          secure
          containerStyle={{
            marginVertical: heightRes(2),
          }}
          onChange={(text) => onChange("password", text)}
          error={error.password}
        />
        <Button
          title="SIGN IN"
          containerStyle={{
            marginTop: heightRes(2),
          }}
          click={handleSubmit}
          load={loading}
        />

        <Text
          style={[
            textStyle.defaultRegularFootnote,
            { marginVertical: heightRes(1.5), textAlign: "right" },
          ]}
        >
          Don't have an account?{" "}
          <Text
            style={[textStyle.defaultBoldFootnote, { color: colors.primary }]}
            onPress={navigateToRegister}
          >
            Sign Up
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  top: {
    padding: heightRes(3),
    paddingTop: heightRes(4),
  },
  bottom: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: heightRes(3),
    paddingTop: heightRes(5),
  },
});
