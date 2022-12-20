import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect } from "react";
import { UserContext } from "../store/State";

const Session = () => {
  const {
    state: { sessions },
  } = useContext(UserContext);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {sessions.length === 0 ? (
        <Text>No Sessions yet</Text>
      ) : (
        <FlatList data={sessions} />
      )}
    </View>
  );
};

export default Session;

const styles = StyleSheet.create({});
