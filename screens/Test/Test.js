import React, { useEffect } from "react";
import { ScrollView, StyleSheet, View, TouchableOpacity } from "react-native";
import constants from "../../constants";
import { SafeAreaView } from "react-navigation";
import MainTitle from "../../components/MainTitle";

import Scene1 from "./Scene1";
import * as MagicMove from "react-native-magic-move";
import * as Animatable from "react-native-animatable";

export default ({ navigation }) => {
  return (
    <SafeAreaView
      style={constants.commonStyle.safeArea}
      forceInset={{ top: "always" }}
    >
      <MainTitle title={"Test Tab"} />
      <View style={styles.row}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.navigate("Scene1")}
        >
          <MagicMove.View
            id={"scene1"}
            style={[styles.box]}
            transition={MagicMove.Transition.morph}
          >
            <MagicMove.Text
              id={`scene1.title`}
              style={styles.text}
              transition={MagicMove.Transition.morph}
            >
              Test
            </MagicMove.Text>
          </MagicMove.View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: "column",
    padding: 10
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
    backgroundColor: "red"
  },
  box: {
    width: 140,
    height: 140,
    borderRadius: 70,
    flexDirection: "column",
    justifyContent: "center"
  },
  text: {
    alignSelf: "center",
    textAlign: "center",
    color: "white",
    fontSize: 20
  }
});
