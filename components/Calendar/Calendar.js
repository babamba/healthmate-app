import React, { useState, useEffect, useRef } from "react";
import { TouchableOpacity } from "react-native";
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
import { SafeAreaView } from "react-navigation";
import AddPlan from "../../components/Plan/AddPlan";
import DeletePlan from "../Plan/DeletePlan";

import Swipeout from "react-native-swipeout";
import { Feather } from "@expo/vector-icons";
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

const today = moment(new Date()).format("YYYY-MM-DD");
const maxDate = moment(today)
  .add("1", "year")
  .format("YYYY-MM-DD");
const minDate = moment(today)
  .add("-1", "year")
  .format("YYYY-MM-DD");

console.log(today);
console.log("minDate", maxDate);
console.log("minDate", minDate);

const View = styled.View``;
const EmptyView = styled.View``;
const Text = styled.Text``;
const Item = styled.View`
  border-radius: 5px;
  padding: 15px;
  height: ${constants.height / 8};
  /* flex-direction: row; */
`;

const CloseArea = styled.View`
  /* background-color: #e8e8e8; */
  align-items: center;
`;

const CloseButton = styled.View``;

const Title = styled.View`
  flex: 3;
  /* background-color: aliceblue; */
`;

const AddButton = styled.View`
  flex: 1;
  /* background-color: red; */
  justify-content: flex-start;
  align-items: flex-end;
  flex-direction: row;
`;

const EmptyDate = styled.View`
  border-radius: 5px;
  padding: 15px;
  height: ${constants.height / 12};
`;

export default withNavigation(({ navigation }) => {
  //console.log("press", press);
  const agenda = useRef();
  const [items, setItems] = useState({});
  const [swipeScrollEnabled, setswipeScrollEnabled] = useState(true);
  const [rowIndex, setRowIndex] = useState();
  let timeout;

  const removePlan = () => {
    console.log("remove Item ");
  };

  const updatePlan = () => {
    console.log("update Item ");
  };

  const addPlan = () => {
    console.log("addPlan Item ");
  };

  // const allowScroll = swipeScrollEnabled => {
  //   setswipeScrollEnabled(swipeScrollEnabled);
  // };

  const allowScroll = event => {
    console.log(event);
  };

  const swipeoutRightBtns = [
    {
      text: "삭제",
      type: "delete",
      onPress: () => removePlan()
    }
  ];

  const swipeoutLeftBtns = [
    {
      text: "수정",
      type: "primary",
      onPress: () => updatePlan()
    }
  ];

  const emptyOutBtns = [
    {
      text: "운동 추가",
      type: "secondary",
      onPress: () => addPlan()
    }
  ];

  useEffect(() => {
    // console.log("didmount calendar");
    // console.log("agenda.current; ", agenda.current);
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

  const renderEmptyDate = item => {
    console.log("emprty item : ", item);
    return (
      <Swipeout
        autoClose={true}
        right={emptyOutBtns}
        backgroundColor={"#c7c7c7"}
        onOpen={sectionID => allowScroll(sectionID)}
        scroll={event => allowScroll(event)}
        style={{
          marginVertical: 10,
          marginHorizontal: 10
        }}
      >
        <EmptyDate>
          <Text>일정이 없으시네요!</Text>
          {/* <AddButton>
            <AddPlan size={34} />
            <DeletePlan size={34} press={removePlan} />
          </AddButton> */}
        </EmptyDate>
      </Swipeout>
    );
  };

  const renderItem = item => {
    console.log("item ", item);
    return (
      <Swipeout
        autoClose={true}
        rowID={item.rowIndex}
        // close={item.rowIndex !== rowIndex}
        // scroll={event => allowScroll(event)}
        // scroll={event => console.log(rowIndex)}
        right={swipeoutRightBtns}
        left={swipeoutLeftBtns}
        backgroundColor={"white"}
        style={{
          marginVertical: 10,
          marginHorizontal: 10
        }}
      >
        <Item>
          <Title>
            <Text>{item.name}</Text>
          </Title>
          {/* <AddButton>
            <AddPlan size={34} />
            <DeletePlan size={34} press={removePlan} />
          </AddButton> */}
        </Item>
      </Swipeout>
    );
  };

  const loadItems = async day => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      //달력 만드는 부분(YYYY-MM-DD)
      for (let i = -15; i < 30; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);

        // 해당날짜에 아이템 삽입
        if (!items[strTime]) {
          items[strTime] = [];
          const numItems = Math.floor(Math.random() * 3);
          console.log(numItems);
          //const numItems = 1;

          for (let j = 0; j < numItems; j++) {
            items[strTime].push({
              name: "Item for " + strTime,
              rowIndex: i

              //height: Math.max(50, Math.floor(Math.random() * 150))
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

  const rowHasChanged = (r1, r2) => {
    // console.log("r1 : ", r1);
    // console.log("r2 : ", r2);
    //console.log(agenda.current);
    return r1.name !== r2.name;
  };

  const onDayChange = day => {
    console.log("onDayChange : ", day);
  };

  return (
    <SafeAreaView
      style={constants.commonStyle.safeArea}
      forceInset={{ top: "always", bottom: "always" }}
    >
      <TouchableOpacity
        onPress={() => {
          navigation.goBack(null);
        }}
      >
        <CloseArea>
          <Feather name={"chevrons-down"} size={32} />
        </CloseArea>
      </TouchableOpacity>
      <Agenda
        ref={agenda}
        items={items}
        style={{ flex: 1, width: constants.width, marginTop: 20 }}
        loadItemsForMonth={loadItems}
        selected={today}
        // maxDate={maxDate}
        // maxDate={minDate}
        renderItem={renderItem}
        renderEmptyDate={renderEmptyDate}
        rowHasChanged={rowHasChanged}
        pastScrollRange={12}
        futureScrollRange={12}
        pastScrollRange={12}
        futureScrollRange={12}
        // onScroll={() => console.log("scroll start")}
        // scrollingEnabled={swipeScrollEnabled}
        onDayChange={day => onDayChange(day)}
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
    </SafeAreaView>
  );
});
