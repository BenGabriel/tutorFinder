import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import { UserContext } from "../store/State";
import colors from "../utils/colors";
import { heightRes, widthRes } from "../utils/responsive";
import textStyle from "../utils/textStyle";
import Button from "../components/Button";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BaseURL } from "../utils/constant";

const StudentBoard = ({ navigation }) => {
  const {
    state: { user, courses },
  } = useContext(UserContext);
  const [visible, setVisible] = useState(false);
  const [display, setDisplay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tutors, setTutors] = useState([]);

  const search = async (id) => {
    setVisible(false);
    setLoading(true);
    setDisplay(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const { data } = await axios.get(`${BaseURL}/tutors?course=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(data);

      const newData = data.data.map((t) => {
        const availableTime = Object.entries(t.availableTime).map((entry) => {
          return { [entry[0]]: entry[1] };
        });
        return {
          ...t,
          availableTime,
        };
      });
      setTutors(newData);
      setLoading(false);
    } catch (error) {
      console.log(error);

      setLoading(false);
    }
  };

  console.log(tutors);
  return (
    <View style={styles.contaiiner}>
      <Text style={textStyle.defaultBoldBody}>Welcome {user.firstName}</Text>
      <Text style={[textStyle.defaultRegularCaption1, { marginVertical: 10 }]}>
        An investment in knowledge pays the best interest.
      </Text>
      {display ? (
        <AntDesign
          name="search1"
          size={20}
          style={{
            marginVertical: 10,
          }}
          onPress={() => setVisible(true)}
        />
      ) : (
        <View style={{ alignItems: "center", marginTop: heightRes(4) }}>
          <Text
            style={{
              marginBottom: heightRes(1),
            }}
          >
            Click to search for a tutor
          </Text>
          <View
            style={{
              width: "40%",
            }}
          >
            <Button
              title="Search"
              click={() => setVisible(true)}
              load={loading}
            />
          </View>
        </View>
      )}
      <View style={{ flex: 1 }}>
        <FlatList
          data={tutors}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                backgroundColor: colors.white,
                elevation: 3,
                borderRadius: 10,
                marginVertical: heightRes(1),
                marginHorizontal: heightRes(0.3),
                padding: heightRes(1.5),
              }}
              onPress={() =>
                navigation.navigate("BookSession", {
                  item,
                })
              }
            >
              <View>
                <Text style={textStyle.defaultBoldFootnote}>
                  {item?.user?.firstName} {item?.user?.lastName}
                </Text>
                <Text
                  style={[
                    textStyle.defaultBoldFootnote,
                    { marginVertical: heightRes(1) },
                  ]}
                >
                  {item?.phoneNumber}
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    textTransform: "capitalize",
                    ...textStyle.defaultBoldFootnote,
                    textAlign: "center",
                    marginBottom: 6,
                  }}
                >
                  Available time
                </Text>
                {item?.availableTime.map((t, i) =>
                  Object.values(t)[0].length === 0 ? null : (
                    <View key={i} style={styles.availableTime}>
                      <Text
                        style={{
                          textTransform: "capitalize",
                          ...textStyle.defaultRegularCaption1,
                          marginRight: 8,
                        }}
                      >
                        {Object.keys(t)[0]}
                      </Text>
                      <View style={styles.itemContainer}>
                        {Object.values(t)[0].map((t, i) => (
                          <Text
                            key={i}
                            style={[
                              textStyle.defaultBoldCaption1,
                              { marginRight: 5 },
                            ]}
                          >
                            {t}am
                          </Text>
                        ))}
                      </View>
                    </View>
                  )
                )}
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
      <Modal
        visible={visible}
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: colors.white,
            marginTop: heightRes(5),
          }}
        >
          <AntDesign
            name="closecircleo"
            size={widthRes(6)}
            style={{
              alignSelf: "flex-end",
              marginRight: heightRes(4),
            }}
            onPress={() => setVisible(false)}
          />
          <FlatList
            data={courses}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{ padding: heightRes(2) }}
                onPress={() => search(item._id)}
              >
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item._id}
          />
        </View>
      </Modal>
    </View>
  );
};

export default StudentBoard;

const styles = StyleSheet.create({
  contaiiner: {
    flex: 1,
    backgroundColor: colors.white,
    padding: heightRes(3),
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    // marginVertical: heightRes(1),
  },
  availableTime: {
    padding: heightRes(1),
    flexDirection: "row",
    alignItems: "center",
  },
});
