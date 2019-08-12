import React, { useState, useEffect, useRef, createRef } from "react";
import { TouchableOpacity, Alert, ActivityIndicator } from "react-native";
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
import OverLayLoader from "../OverlayLoader";
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

export const DELETE_SCHEDULE = gql`
  mutation deleteSchedule($scheduleId: String!, $planId: String!) {
    deleteSchedule(scheduleId: $scheduleId, planId: $planId) {
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

export const UPDATE_SCHEDULE = gql`
  mutation updateSchedule($scheduleId: String!, $planId: String!) {
    updateSchedule(scheduleId: $scheduleId, planId: $planId) {
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
  mutation addSchedule($plans: [String!]!, $exerciseDate: String!) {
    addSchedule(plans: $plans, exerciseDate: $exerciseDate) {
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
  justify-content: center;
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
  let timeout;
  const agenda = useRef();
  const [overlayLoader, setOverlayLoader] = useState(false);
  const [swipeDate, setSwipeDate] = useState(null);
  const [addType, setAddType] = useState();
  const [updateScheduleId, setUpdateScheduleId] = useState();
  const [onInit, setInit] = useState(false);
  const [locked, setLocked] = useState(false);
  const [items, setItems] = useState({});
  const [schedule, setSchedule] = useState({});
  //const [schedule, setSchedule] = useState(null);
  const [filterDataLoaded, setFilterDataLoaded] = useState(false);
  const [visiblePlanModal, setVisiblePlanModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const allowAddScroll = (event, item) => {
    if (event) {
      console.log("did open ", event);
      console.log("add swipe item : ", item);
      setSwipeDate(item);
    }
  };

  const deleteConfirm = item => {
    Alert.alert(
      item.name,
      "삭제 하시겠습니까?",
      [
        {
          text: "삭제",
          onPress: () => handleDeleteSchedule(item.scheduleId, item.planId),
          style: "destructive"
        },
        {
          text: "취소",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        }
      ],
      { cancelable: true }
    );
  };

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

  const createSchedule = useMutation(ADD_SCHEDULE, {
    refetchQueries: () => [{ query: SEE_SCHEDULE }]
  });

  const removeSchedule = useMutation(DELETE_SCHEDULE, {
    refetchQueries: () => [{ query: SEE_SCHEDULE }]
  });

  const increaseSchedule = useMutation(UPDATE_SCHEDULE, {
    refetchQueries: () => [{ query: SEE_SCHEDULE }]
  });

  const togglePlanModal = (addType, item) => {
    setVisiblePlanModal(!visiblePlanModal);
    if (addType !== "") {
      console.log("addType ? ", addType);
      setAddType(addType);
      if (addType === "update") {
        console.log("update item : ", item);
        setUpdateScheduleId(item.scheduleId);
        console.log("updateScheduleId : ", updateScheduleId);
      }
    }

    console.log("toggle!");
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
      onPress: () => {
        togglePlanModal("create");
      }
      //onPress: () => console.log(itemRef.current.props._data)
    }
  ];

  const existAlreadyItem = date => {
    console.log(date);
  };

  const renderEmptyDate = item => {
    //console.log("emprty item : ");

    return (
      <AnimateView
        animation="fadeIn"
        easing="ease-in-out"
        delay={100}
        useNativeDriver={true}
      >
        <Swipeout
          autoClose={true}
          right={emptyOutBtns}
          backgroundColor={"#c7c7c7"}
          //onOpen={sectionID => allowScroll(sectionID)}
          scroll={event => allowAddScroll(event, item)}
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
    console.log("item ", item);
    const swipeoutRightBtns = [
      {
        text: "삭제",
        type: "delete",
        onPress: () => deleteConfirm(item)
      }
    ];
    const swipeoutLeftBtns = [
      {
        text: "운동추가",
        type: "delete",
        onPress: () => togglePlanModal("update", item)
      }
    ];
    //console.log("item ", item);
    return (
      <AnimateView
        animation="fadeIn"
        easing="ease-in-out"
        delay={100}
        useNativeDriver={true}
      >
        <Swipeout
          autoClose={true}
          rowID={item.rowIndex}
          right={swipeoutRightBtns}
          left={swipeoutLeftBtns}
          scroll={event => allowAddScroll(event, item.originDate)}
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
                scheduleId: data[i].id,
                planId: data[i].plan[j].id,
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

        await setSchedule(rewriteData);

        //
      }
    }
  };

  const filterData = async data => {
    if (data) {
      let returnData = {};
      console.log("filterData start");
      returnData[data.date] = [];

      if (data.plan.length > 0) {
        for (let j = 0; j < data.plan.length; j++) {
          returnData[data.date].push({
            //name: "Item for " + data[i].date,
            scheduleId: data.id,
            planId: data.plan[j].id,
            name: data.plan[j].planTitle,
            image: data.plan[j].planImage,
            typeName: data.plan[j].exerciseType.title,
            typeImage: data.plan[j].exerciseType.image,
            time: data.time,
            originDate: data.exerciseDate,
            isChecked: data.isChecked,
            height: constants.height / 6,
            dateString: moment(data.exerciseDate).format("YYYY-MM-DD"),
            rowIndex: j

            //height: Math.max(50, Math.floor(Math.random() * 150))
          });
        }
      }
      return returnData;
    }
  };

  const handleDeleteSchedule = async (scheduleId, planId) => {
    try {
      setOverlayLoader(true);

      const {
        data: { deleteSchedule }
      } = await removeSchedule({
        variables: {
          scheduleId,
          planId
        }
      });

      if (deleteSchedule) {
        console.log("deleteSchedule : ", deleteSchedule);
        filterData(deleteSchedule).then(async result => {
          let tempItem = { ...items, ...result };
          await setItems(tempItem);
          setOverlayLoader(false);
          AlertHelper.showDropAlert("success", "스케줄이 삭제되었습니다 :D");
        });
      }
    } catch (error) {
      setOverlayLoader(false);
      AlertHelper.showDropAlert("warning", "스케쥴 삭제 실패 :(");
      console.log("error : ", error);
    } finally {
      setOverlayLoader(false);
      console.log("finally");
    }
  };

  //increaseSchedule
  const handleIncreaseSchedule = async (scheduleId, planId) => {
    try {
      const {
        data: { updateSchedule }
      } = await increaseSchedule({
        variables: {
          scheduleId,
          planId
        }
      });

      if (updateSchedule) {
        console.log("toggle first");
        togglePlanModal();
        setTimeout(() => {
          console.log("set");
          filterData(updateSchedule).then(async result => {
            let tempItem = { ...items, ...result };
            await setItems(tempItem);
            AlertHelper.showDropAlert(
              "success",
              "운동 스케줄이 등록되었습니다 :D"
            );
          });
        }, 1000);
      }
    } catch (error) {
      AlertHelper.showDropAlert("warning", "스케쥴 등록 실패 :(");
      console.log("error : ", error);
    }
  };

  const handleAddSchedule = async (plans, exerciseDate) => {
    try {
      const {
        data: { addSchedule }
      } = await createSchedule({
        variables: {
          plans,
          exerciseDate: exerciseDate
        }
      });

      if (addSchedule) {
        console.log("toggle first");
        togglePlanModal();
        setTimeout(() => {
          console.log("set");
          filterData(addSchedule).then(async result => {
            let tempItem = { ...items, ...result };
            await setItems(tempItem);
            AlertHelper.showDropAlert(
              "success",
              "운동 스케줄이 등록되었습니다 :D"
            );
          });
        }, 1000);
      }
    } catch (error) {
      AlertHelper.showDropAlert("warning", "스케쥴 등록 실패 :(");
      console.log("error : ", error);
    }
  };

  const loadItems = async day => {
    closeTimeOut();
    //달력 만드는 부분(YYYY-MM-DD)
    timeout = setTimeout(() => {
      for (let i = -15; i < 30; i++) {
        // 오늘날짜 기준 - 15일
        const strTime = moment(day)
          .add(i, "d")
          .subtract(1, "M")
          .format("YYYY-MM-DD");
        if (
          !schedule[strTime] ||
          schedule[strTime] === null ||
          schedule[strTime] === undefined
        ) {
          items[strTime] = [];
        } else {
          items[strTime] = schedule[strTime];
        }
      }

      const newItems = {};
      Object.keys(items).forEach(key => {
        newItems[key] = items[key];
      });
      setItems(newItems);
    }, 1000);
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
    console.log(agenda.current.props);
    //console.log("dayChange : ", year, month, dateString);
    loadItems(day);
  };

  return (
    <SafeAreaView
      style={constants.commonStyle.safeArea}
      forceInset={{ top: "always", bottom: "always" }}
    >
      {overlayLoader && <OverLayLoader />}
      <TouchableOpacity
        onPress={() => {
          navigation.goBack(null);
        }}
      >
        <CloseArea>
          <Feather name={"chevron-down"} size={26} />
        </CloseArea>
      </TouchableOpacity>
      {loading && !filterDataLoaded ? (
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
        handleAddSchedule={handleAddSchedule}
        handleIncreaseSchedule={handleIncreaseSchedule}
        addRequestType={addType}
        scheduleId={addType === "update" ? updateScheduleId : ""}
        existAlreadyItem={existAlreadyItem}
      />
    </SafeAreaView>
  );
});
