import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { heightRes, widthRes } from "../utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import textStyle from "../utils/textStyle";
import Input from "../components/Input";
import axios from "axios";
import { BaseURL } from "../utils/constant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import colors from "../utils/colors";
import Button from "../components/Button";
import { useNavigation } from "@react-navigation/native";

const Course = () => {
  const navigation = useNavigation()
  const [input, setInput] = useState(false);
  const [value, setValue] = useState("");
  const [list, setList] = useState([]);
  const [courses, setCourses] = useState([]);

  const getCourses = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const { data } = await axios.get(`${BaseURL}/courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setList(data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCourses();
  }, []);

  const changeColor = (value) => {
    return courses.find((t) => t === value);
  };

  const selectCourse = (value) => {
    const data = courses.find((t) => t === value);
    if (data === undefined) {
      setCourses((prev) => [...prev, value]);
    } else {
      const newData = courses.filter((t) => t !== value);
      setCourses(newData);
    }
  };

  const addCourse = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const { data } = await axios.post(
        `${BaseURL}/courses`,
        {
          name: value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      console.log(data);
      setList((prev) => [
        ...prev,
        {
          name: data.data.name,
          _id: data.data._id,
        },
      ]);
      setValue("")
      setInput(false)
    } catch (error) {
      console.log(error);
    }
  };


  const navigateOut = () => {
    navigation.navigate("AvailableTime", {
      courses
    })
  }
  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: heightRes(2) }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={textStyle.defaultBoldBody}>List of courses</Text>
        <Ionicons
          name={input ? "remove" : "add"}
          size={widthRes(7)}
          onPress={() => setInput(!input)}
        />
      </View>
      {input ? (
        <View style={styles.inputContainer}>
          <Input
            placeholder="Add Course"
            containerStyle={{ width: "90%" }}
            onChange={setValue}
            value={value}
          />
          <Ionicons name="send" size={widthRes(5)} onPress={addCourse} />
        </View>
      ) : null}
      {list.length > 1 ? (
        <View style={{ flex: 1, marginTop: heightRes(2) }}>
          <FlatList
            data={list}
            renderItem={({ item }) => (
              <Pressable
                style={{
                  padding: heightRes(2.5),
                  backgroundColor: changeColor(item._id)
                    ? colors.primary
                    : colors.white,
                  borderRadius: 10,
                  marginTop: 10,
                }}
                onPress={() => selectCourse(item._id)}
              >
                <Text
                  style={{
                    color: changeColor(item._id) ? colors.white : colors.black,
                  }}
                >
                  {item.name}
                </Text>
              </Pressable>
            )}
            keyExtractor={(_, i) => i.toString()}
          />
        <Button title="Continue" disable={courses.length < 1} click={navigateOut} />
        </View>
      ) : null}
    </View>
  );
};

export default Course;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: heightRes(1.5),
  },
});
