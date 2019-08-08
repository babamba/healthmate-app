import React, { useState, useEffect, useRef, createRef } from "react";
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
import { AlertHelper } from "../../components/DropDown/AlertHelper";
import TouchableScale from "react-native-touchable-scale";
import AddPlanToScheduleModal from "./AddPlanToScheduleModal";
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
    "1 월",
    "2 월",
    "3 월",
    "4 월",
    "7 월",
    "6 월",
    "7 월",
    "8 월",
    "9 월",
    "10 월",
    "11 월",
    "12 월"
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
        planImage
        exerciseType {
          id
          title
          image
        }
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
const ButtonSize = constants.width / 10;
const View = styled.View``;

const Text = styled.Text``;
const Image = styled.Image``;
const Item = styled.View`
  padding: 15px;
  height: ${constants.height / 8};
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0.5);
`;

const EmptyItem = styled.View`
  padding: 15px;
  height: ${constants.height / 10};
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0.05);
`;

const ItemBodyArea = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const ItemHeaderArea = styled.View`
  flex: 1;
  align-items: flex-start;
  padding-bottom: 8px;
  flex-direction: row;
`;

// const Overlay = styled.View`
//   width: 100%;
//   height: auto;
//   position: absolute;
// `;
const Left = styled.View`
  flex: 1;
  justify-content: center;
  align-self: flex-start;
`;
const Right = styled.View`
  flex: 1;
  justify-content: center;
  align-items: flex-end;
`;

const EmptyText = styled.Text`
  color: white;
  text-align: center;
  font-size: 18px;
  font-family: NanumBarunGothicLight;
`;
const PlanText = styled.Text`
  color: white;
  text-align: center;
  font-size: 24px;
  font-family: NanumBarunGothic;
`;
const TypeText = styled.Text`
  justify-content: center;
  color: white;
  font-size: 18px;
  font-family: NanumBarunGothicLight;
`;
const PlanDateText = styled.Text`
  color: white;
  font-size: 18px;
  font-family: NanumBarunGothicLight;
`;
const PlanImage = styled.Image`
  position: absolute;
  width: 100%;
  height: 100%;
  /* opacity: 0.3; */
`;

const CloseArea = styled.View`
  /* background-color: #e8e8e8; */
  align-items: center;
`;

const CloseButton = styled.View``;

const ButtonArea = styled.View`
  position: absolute;
  width: ${ButtonSize};
  height: ${ButtonSize};
  border-radius: ${ButtonSize / 2};
  z-index: 3;
  bottom: 40;
  right: 40;
  box-shadow: ${constants.bigBoxShadow};
  background-color: white;
  opacity: 0.8;
`;

const EmptyDate = styled.View`
  border-radius: 5px;
  padding: 15px;
  height: ${constants.height / 12};
`;

const AnimateView = Animatable.createAnimatableComponent(styled.View``);

export default withNavigation(({ navigation }) => {
  //console.log("press", press);
  let rewriteData = {};
  const agenda = useRef();
  const [swipeDate, setSwipeDate] = useState(null);
  const [onInit, setInit] = useState(false);
  const [locked, setLocked] = useState(false);
  const [items, setItems] = useState({});
  const [schedule, setSchedule] = useState({});
  //const [schedule, setSchedule] = useState(null);
  const [filterDataLoaded, setFilterDataLoaded] = useState(false);
  const [visiblePlanModal, setVisiblePlanModal] = useState(false);

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

  const allowScroll = (event, item) => {
    if (event) {
      console.log("did open ", event);

      setSwipeDate(item);
    }
  };

  const swipeoutRightBtns = [
    {
      text: "삭제",
      type: "delete",
      onPress: () => removePlan()
    }
  ];

  // const swipeoutLeftBtns = [
  //   {
  //     text: "수정",
  //     type: "primary",
  //     onPress: () => updatePlan()
  //   }
  // ];

  useEffect(() => {
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
    const date = moment(new Date(time));
    //console.log("timeToString : ", date);
    return date.toISOString().split("T")[0];
  };

  const { loading, data, error, refetch } = useQuery(SEE_SCHEDULE, {
    fetchPolicy: "network-only"
  });

  const togglePlanModal = () => {
    setVisiblePlanModal(!visiblePlanModal);
  };

  useEffect(() => {
    const onCompleted = data => {
      console.log("on load Completed schedule data ");

      filterProduct(data.getSchedule).then(() => {
        setFilterDataLoaded(true);
      });
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

  const emptyOutBtns = [
    {
      text: "운동 추가",
      type: "secondary",
      onPress: () => togglePlanModal()
      //onPress: () => console.log(itemRef.current.props._data)
    }
  ];

  const renderEmptyDate = item => {
    //console.log("emprty item : ");

    return (
      <AnimateView
        animation="fadeInRight"
        easing="ease-in-out"
        delay={100}
        useNativeDriver={true}
      >
        <Swipeout
          autoClose={true}
          right={emptyOutBtns}
          backgroundColor={"#c7c7c7"}
          //onOpen={sectionID => allowScroll(sectionID)}
          scroll={event => allowScroll(event, item)}
          style={{
            marginVertical: 10,
            marginHorizontal: 10
          }}
        >
          <EmptyItem>
            <ItemBodyArea>
              <EmptyText>일정 없음 :(</EmptyText>
            </ItemBodyArea>
          </EmptyItem>
        </Swipeout>
      </AnimateView>
    );
  };

  const renderItem = item => {
    //console.log("item ", item);
    return (
      <AnimateView
        animation="fadeInRight"
        easing="ease-in-out"
        delay={100}
        useNativeDriver={true}
      >
        <Swipeout
          autoClose={true}
          rowID={item.rowIndex}
          // close={item.rowIndex !== rowIndex}
          // scroll={event => allowScroll(event)}
          // scroll={event => console.log(rowIndex)}
          right={swipeoutRightBtns}
          // left={swipeoutLeftBtns}
          backgroundColor={"white"}
          style={{
            marginVertical: 10,
            marginHorizontal: 10
          }}
        >
          <PlanImage
            source={{ uri: item.image ? item.image : item.typeImage }}
          />

          <Item>
            <ItemHeaderArea>
              <Left>
                <PlanDateText>{item.dateString}</PlanDateText>
              </Left>
              <Right>
                <TypeText>{item.typeName}</TypeText>
              </Right>
            </ItemHeaderArea>
            <ItemBodyArea>
              <PlanText>{item.name}</PlanText>
            </ItemBodyArea>
          </Item>
        </Swipeout>
      </AnimateView>
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
                image: data[i].plan[j].planImage,
                typeName: data[i].plan[j].exerciseType.title,
                typeImage: data[i].plan[j].exerciseType.image,
                time: data[i].time,
                originDate: data[i].exerciseDate,
                isChecked: data[i].isChecked,
                height: constants.height / 6,
                dateString: moment(data[i].exerciseDate).format("YYYY-MM-DD"),
                rowIndex: j

                //height: Math.max(50, Math.floor(Math.random() * 150))
              });
            }
          }
        }
        console.log("setSchedule : ", schedule);
        await setSchedule(rewriteData);
        console.log(schedule);
        //
      }
    }

    //return rewriteData;
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
    console.log("loadItems today : ", day.dateString); //오늘 날짜.
    // const { getSchedule } = data;
    closeTimeOut();
    //const filterData = await filterProduct(getSchedule);
    //filterProduct(getSchedule).then(scheduleData => {
    //console.log("result : ", result);
    //console.log("result : ", scheduleData);
    //달력 만드는 부분(YYYY-MM-DD)
    timeout = setTimeout(() => {
      for (let i = -15; i < 30; i++) {
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

        // for (let key in scheduleData) {
        //   if (strTime === key) {
        //     console.log("same", strTime, " / ", key);
        //     tempData[strTime] = scheduleData[key];
        //   }
        // }
        console.log("state schedule", schedule);
        if (
          !schedule[strTime] ||
          schedule[strTime] === null ||
          schedule[strTime] === undefined
        ) {
          items[strTime] = [];
          //tempData[strTime] = [];

          //하루 데이터에 배열로 정보 노출
          // for (let j = 0; j < getSchedule.length; j++) {
          //   items[strTime].push({
          //     name: "Item for " + strTime,
          //     rowIndex: i

          //     //height: Math.max(50, Math.floor(Math.random() * 150))
          //   });
          // }
        } else {
          items[strTime] = schedule[strTime];
        }
      }

      const newItems = {};
      // Object.keys(items).forEach(key => {
      //   newItems[key] = items[key];
      // });
      Object.keys(items).forEach(key => {
        newItems[key] = items[key];
      });
      console.log("newItems : ", newItems);
      // console.log("temp : ", tempData);
      setItems(newItems);
      //setItems({ ...tempData });
    }, 1000);

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
    //console.log("rowHasChanged", r1, "/", r2);
    return r1.name !== r2.name;
  };

  const onDayChange = day => {
    console.log("onDayChange : ", day.dateString);
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
          <Feather name={"chevron-down"} size={26} />
        </CloseArea>
      </TouchableOpacity>
      {loading ? (
        <Loader />
      ) : (
        data &&
        data.getSchedule &&
        filterDataLoaded && (
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
            loadItemsForMonth={async day => {
              if (!onInit) {
                //자동으로 60일전으로 다시 트리거되는 버그가 있어서 첫시작때만 실행되도록
                console.log("trigger items loading on Init screen :", day);
                // filterProduct(data.getSchedule).then(() => {
                //   loadItems(day);
                // });
                loadItems(day);

                // dayChange(data);
                setInit(true);
              }
            }}
            selected={today}
            onDayChange={day => dayChange(day)}
            onDayPress={day => dayChange(day)}
            // maxDate={maxDate}
            // maxDate={minDate}
            renderItem={renderItem}
            renderEmptyDate={renderEmptyDate}
            rowHasChanged={rowHasChanged}
            markingType={"simple"}
            monthFormat={"yyyy"}
            //theme={{ calendarBackground: "white", agendaKnobColor: "green" }}
            // pastScrollRange={15}
            // futureScrollRange={15}
            // pastScrollRange={15}
            // futureScrollRange={15}
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

      {/* <ButtonArea>
        <TouchableScale
          onPress={() => console.log("test")}
          activeScale={0.96}
          friction={2}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Feather name={"plus"} size={32} />
        </TouchableScale>
      </ButtonArea> */}
      <AddPlanToScheduleModal
        togglePlanModal={() => togglePlanModal()}
        visiblePlanModal={visiblePlanModal}
        swipeDate={swipeDate}
      />
    </SafeAreaView>
  );
});
