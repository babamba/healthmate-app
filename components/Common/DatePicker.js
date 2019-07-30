import React, { useState, useEffect } from "react";
import styled from "styled-components";
// import { Button, View } from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import { Platform } from "react-native";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;
const Button = styled.Button``;

const Text = styled.Text``;

export default () => {
  const today = moment(new Date());
  const [isVisible, setIsVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    moment(today).format("YYYY-MM-DD HH:mm")
  );

  const showDateTimePicker = () => {
    setIsVisible(true);
  };

  const hideDateTimePicker = () => {
    setIsVisible(false);
  };

  const handleDatePicked = date => {
    console.log("A date has been picked: ", date);
    setSelectedDate(moment(date).format("YYYY-MM-DD HH:mm"));
    hideDateTimePicker();
  };

  return (
    <View>
      <Button title="Show DatePicker" onPress={() => showDateTimePicker()} />
      <Text>{selectedDate}</Text>
      <DateTimePicker
        isVisible={isVisible}
        onConfirm={date => handleDatePicked(date)}
        onCancel={() => hideDateTimePicker()}
        cancelTextIOS={"취소"}
        confirmTextIOS={"선택"}
        mode={"datetime"}
        data={today}
        locale={Platform.OS === "ios" ? "ko_KR" : "ko_KR"}
      />
    </View>
  );
};
