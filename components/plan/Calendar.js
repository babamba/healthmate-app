import React, { useState, useEffect } from "react";
// import { Platform } from "react-native";
import styled from "styled-components";
// import { Feather } from "@expo/vector-icons";
import { withNavigation } from "react-navigation";
import styles from "../../styles";
import constants from "../../constants";
import {
  Calendar,
  CalendarList,
  Agenda,
  LocaleConfig
} from "react-native-calendars";
import moment from "moment";
import * as Animatable from "react-native-animatable";
// import MaterialIcon from "../MaterialIcon";
// import TouchableScale from "react-native-touchable-scale";

// const iconContainerWidth = constants.width / 10;

// const Container = styled.View`
//   padding-top: 6px;
//   background-color: white;
//   width: ${iconContainerWidth};
//   height: ${iconContainerWidth};
//   border-radius: ${Math.round(iconContainerWidth / 2)};
//   padding: 10px;
//   justify-content: center;
//   align-items: center;
// `;

LocaleConfig.locales["ko_KR"] = {
  monthNames: [
    "1월",
    "2월",
    "3월",
    "4월",
    "7월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월"
  ],
  monthNamesShort: [
    "1월",
    "2월",
    "3월",
    "4월",
    "7월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월"
  ],
  dayNames: [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일"
  ],
  dayNamesShort: ["일.", "월.", "화.", "수.", "목.", "금.", "토."]
};

LocaleConfig.defaultLocale = "ko_KR";

const View = styled.View``;
const EmptyView = styled.View``;
const Text = styled.Text``;
const Item = styled.View`
  background-color: white;
  flex: 1;
  border-radius: 5px;
  padding: 10px;
  margin-right: 10px;
  margin-top: 1px;
  height: ${props => props.height};
`;

const EmptyDate = styled.View`
  height: 15px;
  flex: 1;
  padding-top: 30px;
`;

export default withNavigation(({ navigation }) => {
  //console.log("press", press);

  const [items, setItems] = useState({});
  let timeout;

  useEffect(() => {
    console.log("didmount calendar");
    return () => {
      console.log("unmount calendar");
      closeTimeOut();
    };
  }, []);

  const closeTimeOut = () => {
    if (timeout) {
      clearTimeout(timeout);
    }
  };

  const timeToString = time => {
    const date = new Date(time);
    return date.toISOString().split("T")[0];
  };
  const loadItems = async day => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);
        if (!items[strTime]) {
          items[strTime] = [];
          const numItems = Math.floor(Math.random() * 5);
          for (let j = 0; j < numItems; j++) {
            items[strTime].push({
              name: "Item for " + strTime,
              height: Math.max(50, Math.floor(Math.random() * 150))
            });
          }
        }
      }
      //console.log(this.state.items);
      const newItems = {};
      Object.keys(items).forEach(key => {
        newItems[key] = items[key];
      });
      setItems(newItems);
    }, 1000);
    // console.log(`Load Items for ${day.year}-${day.month}`);
  };

  const renderItem = item => {
    return (
      <Item height={item.height}>
        <Text>{item.name}</Text>
      </Item>
    );
  };

  const renderEmptyDate = () => {
    return (
      <EmptyDate>
        <Text>This is empty date!</Text>
      </EmptyDate>
    );
  };

  const rowHasChanged = (r1, r2) => {
    return r1.name !== r2.name;
  };

  return (
    <Animatable.View
      animation="fadeIn"
      easing="ease-in-out"
      useNativeDriver={true}
    >
      <Agenda
        items={items}
        style={{ flex: 1, width: constants.width }}
        loadItemsForMonth={loadItems}
        selected={moment(new Date()).format("YYYY-MM-DD")}
        renderItem={renderItem}
        renderEmptyDate={renderEmptyDate}
        rowHasChanged={rowHasChanged}
        // markingType={'period'}
        // markedDates={{
        //    '2017-05-08': {textColor: '#666'},
        //    '2017-05-09': {textColor: '#666'},
        //    '2017-05-14': {startingDay: true, endingDay: true, color: 'blue'},
        //    '2017-05-21': {startingDay: true, color: 'blue'},
        //    '2017-05-22': {endingDay: true, color: 'gray'},
        //    '2017-05-24': {startingDay: true, color: 'gray'},
        //    '2017-05-25': {color: 'gray'},
        //    '2017-05-26': {endingDay: true, color: 'gray'}}}
        // monthFormat={'yyyy'}
        // theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
        //renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
      />
    </Animatable.View>
  );
});
