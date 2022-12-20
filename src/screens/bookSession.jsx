import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { heightRes } from "../utils/responsive";
import textStyle from "../utils/textStyle";
import Button from "../components/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BaseURL } from "../utils/constant";
import axios from "axios";
import { showMessage } from "react-native-flash-message";

const BookSession = ({ navigation, route }) => {
  const { item } = route.params;
  const [booking, setBooking] = useState({
    day: "",
    time: "",
  });
  const [loading, setLoading] = useState(false);
  const newTime = item?.availableTime.map((t) =>
    Object.values(t)[0].length === 0
      ? null
      : {
          day: Object.keys(t)[0],
          hour: Object.values(t)[0],
        }
  );

  const addBooking = (day, time) => {
    setBooking({
      day,
      time,
    });
  };

  console.log(booking);

  const book = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const { data } = await axios.post(
        `${BaseURL}/sessions`,
        {
          tutorId: item._id,
          dayOfWeek: booking.day,
          hours: [parseInt(booking.time)],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);
      showMessage({
        message: "Session Booked",
        type: "success",
        position: "bottom",
      });
      navigation.goBack();
    } catch (error) {
      console.log(error);

      navigation.goBack();
      showMessage({
        message: "Error in booking",
        type: "danger",
        position: "bottom",
      });

      setLoading(false);
    }
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        padding: heightRes(3),
      }}
    >
      <Text
        style={[
          textStyle.defaultBoldBody,
          { textAlign: "center", marginBottom: heightRes(3) },
        ]}
      >
        Book Session
      </Text>
      <View style={{ marginVertical: heightRes(0.7) }}>
        <Text>
          {item?.user.firstName} {item?.user?.lastName}
        </Text>
      </View>
      <View style={{ marginVertical: heightRes(0.7) }}>
        <Text>{item?.phoneNumber}</Text>
      </View>
      <View style={{ marginVertical: heightRes(0.7) }}>
        <Text>{item?.user?.email}</Text>
      </View>
      <View style={{ marginVertical: heightRes(0.7) }}>
        <Text style={{ fontWeight: "bold" }}>Select Time for just a day</Text>
      </View>
      <View style={{ marginVertical: heightRes(3) }}>
        {newTime.map((t) =>
          t === null ? null : (
            <View
              style={{
                padding: 10,
                flexDirection: "row",
                justifyContent: "space-between",
                marginVertical: heightRes(1),
              }}
            >
              <Text>{t?.day}</Text>
              <View style={{ flexDirection: "row", alignSelf: "flex-start" }}>
                {t.hour.map((time) => (
                  <Text
                    style={{
                      padding: 1,
                      marginHorizontal: 10,
                    }}
                    onPress={() => addBooking(t.day, time)}
                  >
                    {time}
                  </Text>
                ))}
              </View>
            </View>
          )
        )}
      </View>

      <View
        style={{
          marginBottom: heightRes(2),
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <Text style={{ fontWeight: "bold" }}>{booking?.day}</Text>
        <Text style={{ fontWeight: "bold" }}>{booking.time}</Text>
      </View>

      <Button
        title="Book"
        disable={booking.time === ""}
        load={loading}
        click={book}
      />
    </View>
  );
};

export default BookSession;

const styles = StyleSheet.create({});
