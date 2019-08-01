import React, { useEffect } from "react";
import { ScrollView, StyleSheet } from "react-native";
import constants from "../../constants";
import { SafeAreaView } from "react-navigation";

import * as MagicMove from "react-native-magic-move";
import * as Animatable from "react-native-animatable";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1
  },
  background: {
    flex: 1,
    backgroundColor: "blueviolet",
    justifyContent: "center"
  },
  title: {
    alignSelf: "center",
    textAlign: "center",
    color: "white",
    fontSize: 50
  },
  text: {
    margin: 24,
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 19,
    lineHeight: 24
  }
});

export default ({ navigation }) => {
  return (
    <SafeAreaView
      style={constants.commonStyle.safeArea}
      forceInset={{ top: "always" }}
    >
      <ScrollView>
        <MagicMove.Scene key="scene1" title="Scale">
          <MagicMove.View id="scene1" style={styles.background}>
            <Animatable.Text
              style={styles.text}
              animation="fadeInUp"
              delay={400}
              duration={500}
            >
              Magically animate your component from one scene to another.
            </Animatable.Text>
          </MagicMove.View>
        </MagicMove.Scene>
      </ScrollView>
    </SafeAreaView>
  );
};
