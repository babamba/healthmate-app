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
import AddPlan from "../../components/Plan/AddPlanButton";
import DeletePlan from "../Plan/DeletePlanButton";

import Swipeout from "react-native-swipeout";
import { Feather } from "@expo/vector-icons";

import gql from "graphql-tag";
import { useQuery, useMutation } from "react-apollo-hooks";
import Loader from "../Loader";
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

export const SEE_SCHEDULE = gql`
  query getSchedule {
    getSchedule {
      id
      plan {
        id
        planTitle
      }
      user {
        username
      }
      exerciseDate
      isChecked
      date
      time
    }
  }
`;

export const ADD_SCHEDULE = gql`
  mutation addSchedule($plans: Array!, $exerciseDate: String!) {
    addSchedule(plans: $plans, exerciseDate: $exerciseDate) {
      id
      user {
        username
      }
      plan {
        id
        planTitle
      }
      exerciseDate
      isChecked
    }
  }
`;

const today = moment(new Date()).format("YYYY-MM-DD");
// console.log("test : ", today);
// console.log("test : ", moment(today).months());
const maxDate = moment(today)
  .add("1", "year")
  .format("YYYY-MM-DD");
const minDate = moment(today)
  .add("-1", "year")
  .format("YYYY-MM-DD");

// console.log(today);
// console.log("minDate", maxDate);
// console.log("minDate", minDate);

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
  let rewriteData = {};
  const agenda = useRef();
  const [locked, setLocked] = useState(false);
  const [items, setItems] = useState({});
  //const [schedule, setSchedule] = useState(null);
  // const [dataLoaded, setDataLoaded] = useState(false);
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
      // closeTimeOut();
    };
  }, []);

  const closeTimeOut = () => {
    if (timeout) {
      clearTimeout(timeout);
    }
  };

  const timeToString = time => {
    const date = moment(new Date(time));
    console.log("timeToString : ", date);
    return date.toISOString().split("T")[0];
  };

  const { loading, data, error, refetch } = useQuery(SEE_SCHEDULE, {
    fetchPolicy: "network-only"
  });

  useEffect(() => {
    const onCompleted = data => {
      console.log("on load Completed schedule data ");
      //setDataLoaded(true);
    };
    const onError = error => {
      console.log("error initial load data : ", error);
      //setDataLoaded(true);
    };
    if (onCompleted || onError) {
      if (onCompleted && !loading && !error) {
        onCompleted(data);
      } else if (onError && !loading && error) {
        onError(error);
      }
    }
  }, [data, loading, error]);

  const renderEmptyDate = item => {
    //console.log("emprty item : ", item);
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
    //console.log("item ", item);
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

  const filterProduct = async data => {
    if (data) {
      console.log("filterProduct start");
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          // console.log("data[i] :", data[i]);
          // console.log("data[i].date : ", data[i].date);
          rewriteData[data[i].date] = [];

          // console.log("data[i].plan length : ", data[i].plan.length);
          // console.log("data[i].plan : ", data[i].plan);

          if (data[i].plan.length > 0) {
            for (let j = 0; j < data[i].plan.length; j++) {
              rewriteData[data[i].date].push({
                //name: "Item for " + data[i].date,
                name: data[i].plan[j].planTitle,
                time: data[i].time,
                originDate: data[i].exerciseDate,
                isChecked: data[i].isChecked,
                height: constants.height / 6,
                rowIndex: j
                //height: Math.max(50, Math.floor(Math.random() * 150))
              });
            }
          }
        }
        //console.log("rewriteData : ", rewriteData);
        //await setSchedule(rewriteData);
      }
    }

    return rewriteData;
    //query data
    // [
    //   Object {
    //     "__typename": "Schedule",
    //     "date": "2019-08-07",
    //     "exerciseDate": "2019-08-04T06:15:08.421Z",
    //     "id": "cjyph1r5jiekr0b72wust08hw",
    //     "isChecked": false,
    //     "plan": Array [
    //       Object {
    //         "__typename": "Plan",
    //         "id": "cjxpppaifhifl0b423hxqgwon",
    //         "planTitle": "상체뿌수기",
    //       },
    //     ],
    //     "time": "00:00",
    //     "user": Object {
    //       "__typename": "User",
    //       "username": "babamba88",
    //     },
    //   },
    // ],
    //rewrite data;
    // Object {
    //   "2019-07-23": Array [
    //     Object {
    //       "name": "Item for 2019-07-23",
    //       "rowIndex": -15,
    //     },
    //   ],
    //   "2019-07-24": Array [],
    //   "2019-07-24": Array [],
    // }

    // rewriteData :  Object {
    //   "2019-08-07": Array [
    //     Object {
    //       "name": "Item for 2019-08-07",
    //       "rowIndex": 2,
    //     },
    //   ],
    // }
  };

  const loadItems = async day => {
    console.log("loadItems today : ", day); //오늘 날짜.
    const { getSchedule } = data;
    closeTimeOut();
    //const filterData = await filterProduct(getSchedule);
    filterProduct(getSchedule).then(result => {
      //console.log("result : ", result);

      //달력 만드는 부분(YYYY-MM-DD)
      timeout = setTimeout(() => {
        for (let i = 0; i < 15; i++) {
          // 오늘날짜 기준 - 15일
          const strTime = moment(day)
            .add(i, "d")
            .subtract(1, "M")
            .format("YYYY-MM-DD");

          const strTimeToMonth = moment(day).month();

          //const strTime = day.dateString;
          // const strTime = String(
          //   moment(day)
          //     .add(i, "d")
          //     .subtract(1, "months")
          //     .format("YYYY-MM-DD")
          // );
          console.log("strTime", strTime);
          //console.log("tempDate : ", tempDate);
          //console.log("strTimeToMonth : ", strTimeToMonth);

          // console.log("items : ", items);
          // 해당날짜에 아이템 삽입
          //console.log("result[strTime]", result[strTime]);

          if (
            !result[strTime] ||
            result[strTime] === null ||
            result[strTime] === undefined
          ) {
            result[strTime] = [];

            //하루 데이터에 배열로 정보 노출
            // for (let j = 0; j < getSchedule.length; j++) {
            //   items[strTime].push({
            //     name: "Item for " + strTime,
            //     rowIndex: i

            //     //height: Math.max(50, Math.floor(Math.random() * 150))
            //   });
            // }
          }
        }
        console.log("result : ", result);

        const newItems = {};
        Object.keys(result).forEach(key => {
          newItems[key] = result[key];
        });
        console.log("newItems : ", newItems);
        setItems(newItems);
      }, 1000);
    });

    // setItems(filterData);
    //console.log("getSchedule : ", getSchedule);

    //console.log(items);

    // timeout = setTimeout(() => {
    //   //달력 만드는 부분(YYYY-MM-DD)
    //   for (let i = -15; i < 30; i++) {
    //     const time = day.timestamp + i * 24 * 60 * 60 * 1000;
    //     const strTime = timeToString(time);

    //     // 해당날짜에 아이템 삽입
    //     if (!items[strTime]) {
    //       items[strTime] = [];
    //       const numItems = Math.floor(Math.random() * 3);

    //       for (let j = 0; j < numItems; j++) {
    //         items[strTime].push({
    //           name: "Item for " + strTime,
    //           rowIndex: i

    //           //height: Math.max(50, Math.floor(Math.random() * 150))
    //         });
    //       }
    //     }
    //   }
    //   //console.log(this.state.items);
    //   const newItems = {};
    //   Object.keys(items).forEach(key => {
    //     newItems[key] = items[key];
    //   });
    //   setItems(newItems);
    //   console.log(items);
    // }, 1000);
    // console.log(`Load Items for ${day.year}-${day.month}`);
  };

  const rowHasChanged = (r1, r2) => {
    // console.log("r1 : ", r1);
    // console.log("r2 : ", r2);
    //console.log(agenda.current);
    console.log("rowHasChanged", r1, "/", r2);
    return r1.name !== r2.name;
  };

  const onDayChange = day => {
    console.log("onDayChange : ", day);
  };

  const dayChange = day => {
    const { year, month, dateString } = day;
    console.log("dayChange : ", year, month, dateString);
    loadItems(day);
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
      {loading ? (
        <Loader />
      ) : (
        data &&
        data.getSchedule && (
          <Agenda
            ref={agenda}
            items={items}
            hideKnob={false}
            style={{ flex: 1, width: constants.width, marginTop: 20 }}
            onCalendarToggled={flag => setLocked(flag)}
            // loadItemsForMonth={day => {
            //   console.log("locked? / ", locked);
            //   if (locked) {
            //     dayChange(day);
            //   }
            // }}
            loadItemsForMonth={month => {
              console.log("trigger items loading :", month);
            }}
            selected={today}
            onDayChange={day => dayChange(day)}
            onDayPress={day => dayChange(day)}
            // maxDate={maxDate}
            // maxDate={minDate}
            renderItem={renderItem}
            renderEmptyDate={renderEmptyDate}
            rowHasChanged={rowHasChanged}
            pastScrollRange={50}
            futureScrollRange={50}
            pastScrollRange={50}
            futureScrollRange={50}
            // onScroll={() => console.log("scroll start")}
            // scrollingEnabled={swipeScrollEnabled}

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
        )
      )}
    </SafeAreaView>
  );
});
