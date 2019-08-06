import React, { useState, createRef, useRef } from "react";
import { Alert } from "react-native";
import { withNavigation } from "react-navigation";
import styled from "styled-components";
import globalStyles from "../../styles";
import constants from "../../constants";
import * as Animatable from "react-native-animatable";
import Swipeout from "react-native-swipeout";

const TextContainer = styled.View`
  flex: 1;
  margin-top: 10px;
  justify-content: center;
  flex-direction: row;
`;

// const Image = styled.Image`
//   width: ${constants.width / 2.2};
//   height: ${constants.height / 5};
//   border-radius: 15;
// `;

const ContentTItle = styled.Text`
  color: black;
  text-align: left;
  font-weight: 600;
  font-size: 24px;
  font-family: NanumBarunGothicLight;
`;

const ContentInfo = styled.Text`
  color: black;
  text-align: left;
  font-weight: 600;
  font-size: 18px;
  font-family: NanumBarunGothicUltraLight;
  padding-horizontal: 5px;
`;

const Introduction = styled.Text`
  color: black;
  text-align: left;
  font-weight: 600;
  font-size: 13px;
  font-family: NotoSansKR_Regular;
`;

const UserName = styled.Text`
  color: black;
  text-align: left;
  font-weight: 600;
  font-size: 18px;
  font-family: NotoSansKR_Regular;
`;

const Column = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: center;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const Conatiner = styled.View`
  padding-vertical: 8;
  padding-horizontal: 20;
  border-radius: 10;
  margin-left: 10;
  margin-left: 10;
  /* shadow-opacity: 0.75;
  shadow-radius: 5px;
  shadow-color: #000;
  shadow-offset: 0px 0px; */
`;
const Divider = styled.View`
  border: 1px solid lightgrey;
  width: 1px;
`;

const View = styled.View``;

const ActivityList = ({
  data,
  handleDelete,
  handleUpdate,
  toggleUpdateModal
}) => {
  //console.log("title data: ", data);
  //const [swipeRef, setSwipeRef] = useState(() => createRef());
  // const itemsRef = useRef([]);
  //const swipeRef = useRef();
  //const itemsRef = useRef(data.map(() => createRef()));
  let currentRowId = null;
  let prevRowId = null;

  const ListItem = props => {
    const itemRef = useRef();
    const item = props.item;
    const index = props.index;

    const testAlert = () => {
      console.log("data ? : ", itemRef.current.props._data);
    };

    const confirm = () => {
      Alert.alert(
        itemRef.current.props._data.title,
        "삭제 하시겠습니까?",
        [
          {
            text: "삭제",
            style: "destructive",
            onPress: () => handleDelete(itemRef.current.props._data.id)
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

    const swipeoutBtns = [
      {
        text: "수정",
        type: "primary",
        onPress: () => toggleUpdateModal(itemRef.current.props._data)
      },
      {
        text: "삭제",
        type: "delete",
        onPress: () => confirm()
      }
    ];

    return (
      <Swipeout
        ref={itemRef}
        right={swipeoutBtns}
        rowID={index}
        // backgroundColor={"#ffffff"}
        backgroundColor={globalStyles.backgroundGreyColor}
        autoClose={true}
        _data={item}
        close={prevRowId !== currentRowId}
        onOpen={(sectionID, rowID) => {
          console.log("currentRowId : ", currentRowId);
          console.log("prevRowId : ", prevRowId);
          prevRowId = currentRowId;
          currentRowId = rowID;
          console.log("currentRowId : ", currentRowId);
        }}
      >
        <Conatiner>
          <TextContainer>
            <Column>
              <ContentTItle>{item.title}</ContentTItle>
            </Column>
            <Row>
              {item.second > 0 && <ContentInfo>{item.second} 분</ContentInfo>}
              {item.count > 0 && <ContentInfo>{item.count} 초</ContentInfo>}
              {item.set > 0 && item.set !== "" && (
                <ContentInfo>{item.set} 세트</ContentInfo>
              )}
            </Row>
          </TextContainer>
        </Conatiner>
      </Swipeout>
    );
  };

  const RenderList = props => {
    const data = props.data;
    const listItems = data.map((item, index) => (
      <ListItem key={index} item={item} index={index} />
    ));

    return <View>{listItems}</View>;
  };

  return <RenderList data={data} />;

  // data.map((item, index) => {
  //   return (
  //     <Swipeout
  //       right={swipeoutBtns}
  //       // backgroundColor={"#ffffff"}
  //       backgroundColor={globalStyles.backgroundGreyColor}
  //       autoClose={true}
  //     >
  //       <Conatiner>
  //         <TextContainer>
  //           <Column>
  //             <ContentTItle>{item.title}</ContentTItle>
  //           </Column>
  //           <Row>
  //             {item.second > 0 && <ContentInfo>{item.second} 분</ContentInfo>}
  //             {item.count > 0 && <ContentInfo>{item.count} 초</ContentInfo>}
  //             {item.set > 0 && item.set !== "" && (
  //               <ContentInfo>{item.set} 세트</ContentInfo>
  //             )}
  //           </Row>
  //         </TextContainer>
  //       </Conatiner>
  //     </Swipeout>
  //   );
  // });
};

// PlanContentList.propTypes = {
//   files: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.string.isRequired,
//       url: PropTypes.string.isRequired
//     })
//   ).isRequired,
//   id: PropTypes.string.isRequired
// };

export default ActivityList;
