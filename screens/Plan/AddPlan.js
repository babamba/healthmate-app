import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { StyleSheet, TouchableHighlight } from "react-native";
import { SafeAreaView, withNavigation, ScrollView } from "react-navigation";
import styles from "../../styles";
import constants from "../../constants";
import { Platform } from "react-native";
import DatePicker from "../../components/Common/DatePicker";
import MainTitle from "../../components/MainTitle";
import SubmitButton from "../../components/SubmitButton";
import FormInput from "../../components/FormInput";

import { AlertHelper } from "../../components/DropDown/AlertHelper";

import { Feather } from "@expo/vector-icons";

import gql from "graphql-tag";
import { useMutation } from "react-apollo-hooks";

import useInput from "../../hooks/useInput";

import NavIcon from "../../components/NavIcon";
import Modal from "react-native-modal";

import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import ExerciseList from "../../components/Plan/ExerciseList";

export const CREATE_PLAN = gql`
  mutation addPlan(
    $planTitle: String!
    $exerciseType: String!
    $planImage: String!
  ) {
    addPlan(planTitle: $planTitle, exerciseType: $exerciseType, String: $String)
  }
`;

const ImageAreaSize = constants.width / 1.5;
const ExerciseEmptyImageSize = constants.width / 9;

const View = styled.View`
  flex: 1;
  padding-horizontal: 10px;
`;

const BackButton = styled.TouchableOpacity`
  justify-content: center;
`;

const Text = styled.Text``;

const CloseArea = styled.View``;

const HeaderArea = styled.View`
  flex-direction: row;
`;
const RowLeft = styled.View`
  flex: 2;
  /* background-color: red;
  opacity: 0.4; */
`;
const RowRight = styled.View`
  flex: 1;
  /* background-color: blue;
  opacity: 0.4; */
  flex-direction: row;
  justify-content: flex-end;
`;

const BodyArea = styled.View`
  justify-content: center;
  align-items: center;
  padding-top: 20px;
  padding-left: 10px;
  padding-right: 10px;
`;

const Divider = styled.View`
  margin-vertical: 30px;
  border: 1px solid lightgrey;
  width: ${ImageAreaSize};
`;

const InputTitleArea = styled.View`
  align-self: flex-start;
  padding-bottom: 10px;
`;

const InputTitle = styled.Text`
  color: black;
  text-align: left;
  font-size: 28px;
  font-family: NotoSansKR_Thin;
`;

const ButtonArea = styled.View`
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const ImageArea = styled.View`
  padding-bottom: 10px;
  width: ${ImageAreaSize};
  height: ${ImageAreaSize};
  border-radius: ${Math.round(ImageAreaSize / 2)};
  /* overflow: hidden; */
  box-shadow: ${constants.bigBoxShadow};
`;

const ImageCover = styled.Image`
  width: ${ImageAreaSize};
  height: ${ImageAreaSize};
  border-radius: ${Math.round(ImageAreaSize / 2)};
  flex: 1;
`;
const Overlay = styled.View`
  width: ${ImageAreaSize};
  height: ${ImageAreaSize};
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: ${Math.round(ImageAreaSize / 2)};
`;

const EmptyImageArea = styled.View`
  width: ${ImageAreaSize};
  height: ${ImageAreaSize};
  position: absolute;
  bottom: 0;
  padding: 20px;
  align-items: center;
  justify-content: flex-end;
`;

const AddImageArea = styled.View`
  width: ${ImageAreaSize};
  height: ${ImageAreaSize};
  position: absolute;
  align-items: center;
  justify-content: center;
  bottom: 0px;
  z-index: 3;
`;

const AddImageButton = styled.TouchableOpacity``;
const SelectExersizeButton = styled.TouchableOpacity`
  flex: 9;
`;

const EmptyImageText = styled.Text`
  color: black;
  text-align: center;
  font-size: 14px;
  font-family: NotoSansKR_Thin;
`;

const EmptyArea = styled.View``;
const ModalContent = styled.View`
  flex: 1;
`;
const ModalButton = styled.TouchableOpacity``;

const ExerciseArea = styled.View`
  /* flex: 1;
  width: ${constants.width}; */
  padding: 20px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const ExerciseTitle = styled.Text`
  flex: 1;
  text-align: left;
  align-self: flex-start;
  justify-content: center;
  color: black;
  text-align: left;
  font-size: 18px;
  font-family: NotoSansKR_Thin;
`;
const ExerciseImage = styled.Image`
  flex: 1;
  align-self: flex-end;
  justify-content: center;
  width: ${ExerciseEmptyImageSize};
  height: ${ExerciseEmptyImageSize};
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: ${Math.round(ExerciseEmptyImageSize / 2)};
`;
const ExerciseEmptyImage = styled.View`
  flex: 1;
  align-self: flex-end;
  justify-content: center;
  width: ${ExerciseEmptyImageSize};
  height: ${ExerciseEmptyImageSize};
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: ${Math.round(ExerciseEmptyImageSize / 2)};
`;

export default withNavigation(({ navigation }) => {
  const scrollView = useRef();
  const [loading, setLoading] = useState(false);
  const [pickedPhoto, setPickedPhoto] = useState(null);
  const [pickedExercise, setPickedExercise] = useState();
  const [hasCamaraPermissions, setHasCamaraPermissions] = useState(null);
  const [hasCamaraRollPermissions, setHasCamaraRollPermissions] = useState(
    null
  );
  const [visibleModal, setVisibleModal] = useState(false);

  const refetch = navigation.getParam("refetch"); //메인 목록 조회
  const planTitleInput = useInput("");

  const createPlan = useMutation(CREATE_PLAN, {
    variables: {
      planTitle: planTitleInput.value
      // username: usernameInput.value,
      // email: emailInput.value,
      // // firstName: fNameInput.value,
      // // lastName: lNameInput.value,
      // password: passwordInput.value
    }
  });

  const pickImage = async () => {
    console.log("pickedPhoto", pickedPhoto);
    const camera = await Permissions.askAsync(Permissions.CAMERA);
    const cameraRoll = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    console.log(camera, "/ ", cameraRoll);

    if (camera.status === "granted" && cameraRoll.status === "granted") {
      setHasCamaraPermissions(camera.status === "granted");
      setHasCamaraRollPermissions(cameraRoll.status == "granted");
    }

    console.log("pickImage");
    if (camera.status === "granted" && cameraRoll.status === "granted") {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "Images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0,
        exif: true
      });

      if (!result.cancelled) {
        setPickedPhoto(result.uri);
        console.log(pickedPhoto);
      }
    } else if (camera.status !== "granted") {
      AlertHelper.showDropAlert("warning", "카메라 권한을", "승인해주세요");
      await Permissions.askAsync(Permissions.CAMERA);
    } else if (cameraRoll.status !== "granted") {
      AlertHelper.showDropAlert("warning", "사진첩 권한을", "승인해주세요");
      await Permissions.askAsync(Permissions.CAMERA_ROLL);
    }

    // if (!result.cancelled) {
    //   await this.setState({ pickedPhoto: result.uri });
    //   this._approvePhoto();
    // }
  };

  // const rejectPhoto = () => {
  //   setPickedPhoto(null);
  // };

  // const approvePhoto = async () => {
  //   // const { picture } = this.state;
  //   // const { navigation: {navigate} } = this.props;
  //   const saveResult = await CameraRoll.saveToCameraRoll(pickImage, "photo");
  //   // navigate("UploadPhoto", { uri : picture } );
  //   setPickedPhoto(pickImage);
  // };

  const toggleModal = () => {
    setVisibleModal(!visibleModal);
  };

  const selectExercize = selected => {
    console.log("selected : ", selected);
    setPickedExercise(selected);

    toggleModal();
  };

  const handlePlanSubmit = async () => {
    /*
      planTitle,
      exerciseType Id,
      planImage
    */
    const { value: planTitle } = planTitleInput;
    if (planTitle === "") {
      return AlertHelper.showDropAlert("warning", "제목을", "입력해주세요");
    }

    // try {
    //   setLoading(true);
    //   const {
    //     data: { addPlan }
    //   } = await createPlan();
    //   if (addPlan) {
    //     AlertHelper.showDropAlert("success", "목록생성", "되었습니다");
    //     navigation.goBack(null);
    //   }
    // } catch (e) {
    //   console.log(e);
    //   AlertHelper.showDropAlert("warning", "목록생성", "실패");
    //   // navigation.navigate("Login", { email });
    // } finally {
    //   setLoading(false);
    // }
  };

  const handleScroll = event => {
    if (Math.abs(event.nativeEvent.contentOffset.y) > 170) {
      console.log("close ");
      navigation.goBack(null);
    }
  };

  useEffect(() => {
    console.log("pickedPhoto : ", pickedPhoto);
  }, [pickedPhoto]);

  return (
    <SafeAreaView
      style={constants.commonStyle.safeArea}
      forceInset={{ top: "always", bottom: "always" }}
    >
      <ScrollView
        ref={scrollView}
        onScrollEndDrag={event => handleScroll(event)}
        scrollEventThrottle={160}
      >
        <View>
          <HeaderArea>
            <RowLeft>
              <MainTitle title={"Add Plan"} fontSize={52} />
            </RowLeft>
            <RowRight>
              <BackButton
                onPress={() => {
                  navigation.goBack(null);
                }}
              >
                <CloseArea>
                  <Feather name={"arrow-down"} size={32} />
                </CloseArea>
              </BackButton>
            </RowRight>
          </HeaderArea>

          <BodyArea>
            <InputTitleArea>
              <InputTitle>커버사진</InputTitle>
            </InputTitleArea>

            <ImageArea>
              {pickedPhoto === null && <Overlay />}
              {pickedPhoto === null ? (
                <EmptyArea>
                  <AddImageArea>
                    <AddImageButton onPress={() => pickImage()}>
                      <NavIcon
                        name={Platform.OS === "ios" ? "ios-add" : "md-add"}
                        size={52}
                        color={"grey"}
                      />
                    </AddImageButton>
                  </AddImageArea>
                  <EmptyImageArea>
                    <EmptyImageText numberOfLines={2}>
                      커버사진을 {"\n"} 등록해주세요
                    </EmptyImageText>
                  </EmptyImageArea>
                </EmptyArea>
              ) : (
                <ImageCover source={{ uri: pickedPhoto }} />
              )}
            </ImageArea>

            <Divider />

            <InputTitleArea>
              <InputTitle>계획명을 입력하세요</InputTitle>
            </InputTitleArea>
            <FormInput
              {...planTitleInput}
              placeholder="제목을 입력해주세요."
              keyboardType="default"
              returnKeyType="send"
              autoCorrect={false}
            />

            <Divider />

            <InputTitleArea>
              <InputTitle>운동 종류</InputTitle>
            </InputTitleArea>

            <ExerciseArea>
              <SelectExersizeButton
                onPress={() => {
                  toggleModal();
                }}
              >
                <ExerciseTitle>
                  {pickedExercise
                    ? pickedExercise.title
                    : "종류를 선택해주세요"}
                </ExerciseTitle>
              </SelectExersizeButton>
              {pickedExercise ? (
                <ExerciseImage source={{ uri: pickedExercise.image }} />
              ) : (
                <ExerciseEmptyImage />
              )}
            </ExerciseArea>
          </BodyArea>
          <ButtonArea>
            <SubmitButton
              bgColor={styles.neonGreen}
              loading={false}
              onPress={() => handlePlanSubmit()}
              text="제출"
            />
          </ButtonArea>

          <Modal
            isVisible={visibleModal}
            avoidKeyboard={true}
            animationIn={"slideInUp"}
            animationOut={"slideOutDown"}
            deviceWidth={constants.width}
            deviceHeight={constants.height}
            style={Modalstyle.bottomModal}
            backdropColor={"grey"}
            backdropOpacity={0.6}
            onBackButtonPress={() => toggleModal()}
            onBackdropPress={() => toggleModal()}
            onSwipeComplete={() => toggleModal()}
            swipeDirection={["up", "down"]}
            swipeThreshold={10}
          >
            {/* <ModalContent>
              <Text>Test</Text>
              
            </ModalContent> */}
            <View style={Modalstyle.modalContent}>
              <ExerciseList selectExercize={selectExercize} />
            </View>
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
});

const Modalstyle = StyleSheet.create({
  modalContent: {
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    padding: 22,
    marginTop: constants.height / 3
    // marginVertical: 220,
    // margin: -20
  },
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0
  }
});

/**
   mutation{
    addPlan(planTitle:"addPlan" , exerciseType:"cjxph889fa49z0b127q2v3w3a", planImage:"https://content.surfit.io/image/KYVg3/3a80G/20918408885d37adfe5cf5b.png"){
      id
      planTitle
    }
  }

  # mutation{
#   addSchedule(plans:["cjxpppaifhifl0b423hxqgwon"], exerciseDate:"2019-07-31T06:15:08.421Z"){
#     id
#     user{
#       username
#     }
#     plan{
#       id
#       planTitle
#     }
#     exerciseDate
#     isChecked
#   }
# }

# {
#   getSchedule{
#     id
#     plan{
#       id
#       planTitle
#     }
#     user{
#       username
#     }
#     exerciseDate
#     isChecked
#   }
# }
 */
