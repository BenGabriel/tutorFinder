import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import colors from "../utils/colors";
import textStyle from "../utils/textStyle";
import { heightRes } from "../utils/responsive";
import { UserContext } from "../store/State";
import Button from "../components/Button";

const Profile = ({ navigation }) => {
  const {
    state: { user },
  } = useContext(UserContext);
  const availableTime = Object.entries(user.tutor.availableTime).map(
    (entry) => {
      return { [entry[0]]: entry[1] };
    }
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.primary }}>
      <View style={styles.top}>
        <Text style={[textStyle.defaultBoldTitle1, { color: colors.white }]}>
          Welcome {user.firstName}
        </Text>
        <Text
          style={[
            textStyle.defaultRegularFootnote,
            { color: colors.white, marginVertical: heightRes(1.5) },
          ]}
        >
          Change is the end result of all true learning
        </Text>
      </View>

      <View style={styles.bottom}>
        <View style={styles.itemContainer}>
          <Text
            style={[
              textStyle.defaultBoldFootnote,
              { marginRight: heightRes(1) },
            ]}
          >
            Full name :{" "}
          </Text>
          <Text style={textStyle.defaultRegularBody}>
            {user.firstName} {user.lastName}
          </Text>
        </View>
        <View style={styles.itemContainer}>
          <Text
            style={[
              textStyle.defaultBoldFootnote,
              { marginRight: heightRes(1) },
            ]}
          >
            Email :{" "}
          </Text>
          <Text style={textStyle.defaultRegularBody}>{user.email}</Text>
        </View>
        <View style={styles.itemContainer}>
          <Text
            style={[
              textStyle.defaultBoldFootnote,
              { marginRight: heightRes(1) },
            ]}
          >
            Phone Number :{" "}
          </Text>
          <Text style={textStyle.defaultRegularBody}>
            {user.tutor.phoneNumber}
          </Text>
        </View>
        <Text
          style={[
            textStyle.defaultBoldFootnote,
            { marginVertical: heightRes(1) },
          ]}
        >
          Your Available time :
        </Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {availableTime.map((t, i) =>
            Object.values(t)[0].length === 0 ? null : (
              <View key={i} style={styles.availableTime}>
                <Text style={{ textTransform: "capitalize" }}>
                  {Object.keys(t)[0]}
                </Text>
                <View style={styles.itemContainer}>
                  {Object.values(t)[0].map((t, i) => (
                    <Text
                      key={i}
                      style={[
                        textStyle.defaultBoldFootnote,
                        { marginRight: 5 },
                      ]}
                    >
                      {t} am{" "}
                    </Text>
                  ))}
                </View>
              </View>
            )
          )}
        </ScrollView>
        <Button
          title="View Session"
          click={() => navigation.navigate("Session")}
        />
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
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
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: heightRes(1),
  },
  availableTime: {
    elevation: 2,
    backgroundColor: "white",
    borderRadius: 10,
    marginVertical: heightRes(0.5),
    padding: heightRes(1),
    paddingHorizontal: heightRes(2),
    marginHorizontal: 3
  },
});
