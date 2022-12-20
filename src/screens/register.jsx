import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useCallback, useContext, useState } from "react";
import colors from "../utils/colors";
import { heightRes } from "../utils/responsive";
import textStyle from "../utils/textStyle";
import Input from "../components/Input";
import Button from "../components/Button";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { BaseURL } from "../utils/constant";
import { UserContext } from "../store/State";

const Register = () => {
  const {
    state: { saveUser },
    userDispatch,
  } = useContext(UserContext);

  const navigation = useNavigation();
  const account = ["TUTOR", "STUDENT"];
  const emailRegex = RegExp(
    /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
  );
  const [details, setDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    account: "TUTOR",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState({
    firstName: "",
    lastName: "",
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

  const navigateToLogin = () => {
    navigation.goBack();
  };

  const handleSubmit = async () => {
    if (details.firstName.length < 2) {
      return errorHandler("firstName", "Enter a valid first name");
    }
    if (details.lastName.length < 2) {
      return errorHandler("lastName", "Enter a valid last name");
    }
    if (!emailRegex.test(details.email)) {
      return errorHandler("email", "Enter a valid Email");
    }
    if (details.password.length < 6) {
      return errorHandler("password", "Paassword must be up to 6 characters");
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        `${BaseURL}/users`,
        {
          firstName: details.firstName,
          lastName: details.lastName,
          email: details.email,
          password: details.password,
          accountType: details.account,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      setLoading(false);
      saveUser(data.data, userDispatch);
      navigation.goBack();
    } catch (error) {
      setLoading(false);
      console.log(error);
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
          Sign UP
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
          placeholder="First name"
          onChange={(text) => onChange("firstName", text)}
          error={error.firstName}
        />
        <Input
          placeholder="Last name"
          containerStyle={styles.input}
          onChange={(text) => onChange("lastName", text)}
          error={error.lastName}
        />
        <Input
          placeholder="Email"
          containerStyle={styles.input}
          onChange={(text) => onChange("email", text)}
          error={error.email}
        />
        <Input
          placeholder="Password"
          secure
          containerStyle={styles.input}
          onChange={(text) => onChange("password", text)}
          error={error.password}
        />
        <Text
          style={[textStyle.defaultBoldFootnote, { marginTop: heightRes(2) }]}
        >
          Select Account type
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: heightRes(1),
          }}
        >
          {account.map((t) => (
            <TouchableOpacity
              activeOpacity={0.7}
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() => onChange("account", t)}
            >
              <View
                style={[
                  styles.radio,
                  {
                    borderWidth: details.account === t ? 0 : 0.5,
                    backgroundColor:
                      details.account === t ? colors.primary : "transparent",
                  },
                ]}
              />
              <Text style={textStyle.defaultRegularCaption1}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Button
          title="SIGN UP"
          containerStyle={{
            marginTop: heightRes(4),
          }}
          click={handleSubmit}
          load={loading}
        />

        <Text
          style={[
            textStyle.defaultRegularFootnote,
            { marginVertical: heightRes(1.5), textAlign: "right" },
          ]}
          onPress={navigateToLogin}
        >
          Already have an account?{" "}
          <Text
            style={[textStyle.defaultBoldFootnote, { color: colors.primary }]}
          >
            Sign In
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default Register;

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
  input: {
    marginTop: heightRes(2),
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginHorizontal: heightRes(1),
  },
});
