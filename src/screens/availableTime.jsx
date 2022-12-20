import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useContext, useState } from "react";
import colors from "../utils/colors";
import textStyle from "../utils/textStyle";
import { heightRes } from "../utils/responsive";
import Button from "../components/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BaseURL } from "../utils/constant";
import { useRoute } from "@react-navigation/native";
import { UserContext } from "../store/State";
import Input from "../components/Input";
import { showMessage } from "react-native-flash-message";

const AvailableTime = ({ navigation }) => {
  const { courses } = useRoute().params;

  const {
    state: { saveUser },
    userDispatch,
  } = useContext(UserContext);
  const list = [
    {
      name: "monday",
      days: 24,
    },
    {
      name: "tuesday",
      days: 24,
    },
    {
      name: "wednesday",
      days: 24,
    },
    {
      name: "thursday",
      days: 24,
    },
    {
      name: "friday",
      days: 24,
    },
    {
      name: "saturday",
      days: 24,
    },
    {
      name: "sunday",
      days: 24,
    },
  ];

  const [times, setTimes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneError, setError] = useState("");

  const handleClick = (name, index) => {
    const data =
      times === null || times[name] === undefined
        ? null
        : times[name].find((t) => t === index);

    if (data === null || data === undefined) {
      setTimes((prev) => ({
        ...prev,
        [name]:
          times === null || times[name] === undefined
            ? [index]
            : [...times[name], index],
      }));
    } else {
      const newData = times[name].filter((t) => t !== index);
      console.log(newData);
      if (newData.length === 0) {
        const dare = Object.entries(times).filter(([key]) => key !== name);
        const newdare = dare.map((t) => ({
          [t[0]]: t[1],
        }));
        const stuff = newdare.reduce(
          (result, current) => Object.assign(result, current),
          {}
        );
        setTimes(stuff);
      } else {
        setTimes((prev) => ({ ...prev, [name]: newData }));
      }
    }
  };

  const changeColor = (name, id) => {
    const data =
      times === null || times[name] === undefined
        ? null
        : times[name].find((t) => t === id);
    return data;
  };

  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem("token");
    if (phone.length < 11) {
      return setError("enter a valid number");
    }
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${BaseURL}/tutors`,
        {
          phoneNumber: phone,
          courses,
          availableTime: times,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      showMessage({
        message: "Profile completed",
        type: "success",
      });
      saveUser(
        {
          ...data.data.user,
          tutor: {
            availableTime: data.data.availableTime,
            phoneNumber: data.data.phoneNumber,
          },
        },
        userDispatch
      );

      setLoading(false);
      navigation.replace("Profile");
    } catch (error) {
      setLoading(false);
      showMessage({
        message: "Error creating profile",
        type: "danger",
      });
    }
  };
  return (
    <View
      style={{ flex: 1, backgroundColor: colors.white, padding: heightRes(2) }}
    >
      <Text
        style={[textStyle.defaultBoldBody, { marginVertical: heightRes(1) }]}
      >
        Enter your phone number
      </Text>
      <Input
        placeholder="Phone"
        onChange={setPhone}
        error={phoneError}
        keyboardType="numeric"
        maxlength={11}
      />

      <Text
        style={[
          textStyle.defaultBoldBody,
          { textAlign: "center", marginTop: heightRes(2) },
        ]}
      >
        Available Time from 1 am to 23 pm
      </Text>
      <FlatList
        data={list}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: heightRes(3),
            }}
          >
            <Text style={{ width: "25%" }}>{item.name}</Text>
            <FlatList
              data={[...Array(23)]}
              renderItem={({ _, index }) => (
                <Text
                  style={{
                    marginHorizontal: 10,
                    backgroundColor: changeColor(item.name, index + 1)
                      ? colors.primary
                      : "transparent",
                    paddingHorizontal: 4,
                    color: changeColor(item.name, index + 1)
                      ? colors.white
                      : "#000",
                  }}
                  onPress={() => handleClick(item.name, index + 1)}
                >
                  {index + 1}
                </Text>
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}
      />
      <Button
        title="Continue"
        disable={times === null}
        click={handleSubmit}
        load={loading}
      />
    </View>
  );
};

export default AvailableTime;

const styles = StyleSheet.create({});
