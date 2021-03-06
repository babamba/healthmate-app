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
import { SEE_PLAN } from "../Tabs/Plan";
import Axios from "axios";

export const CREATE_PLAN = gql`
  mutation addPlan(
    $planTitle: String!
    $exerciseType: String!
    $planImage: String!
  ) {
    addPlan(
      planTitle: $planTitle
      exerciseType: $exerciseType
      planImage: $planImage
    ) {
      id
      planTitle
    }
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

const SelectImageArea = styled.View`
  width: ${ImageAreaSize};
  height: ${ImageAreaSize};
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: ${Math.round(ImageAreaSize / 2)};
`;

const ReselectImageArea = styled.View`
  width: ${ImageAreaSize};
  height: ${ImageAreaSize};
  border-radius: ${Math.round(ImageAreaSize / 2)};
  position: absolute;
  align-items: center;
  justify-content: center;
  bottom: 0px;
  z-index: 3;
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
  const planTitleInput = useInput("");

  const createPlan = useMutation(CREATE_PLAN, {
    refetchQueries: () => [{ query: SEE_PLAN }]
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

    if (camera.status === "granted" && cameraRoll.status === "granted") {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "Images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0,
        exif: true
      });

      if (!result.cancelled) {
        setPickedPhoto(result);
        console.log("pickImage", result);
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

    const formData = new FormData();
    //console.log("picked photo : ", pickedPhoto);
    // const name = pickedPhoto.filename;
    let filename = pickedPhoto.uri.split("/").pop();
    const [, type] = filename.split(".");

    console.log("picked photo : ", filename, " / ", type);

    formData.append("file", {
      name: filename,
      type: type.toLowerCase(),
      uri: pickedPhoto.uri
    });

    try {
      setLoading(true);
      const {
        data: { location }
      } = await Axios.post("http://hellojw.net:9333/api/upload", formData, {
        // } = await Axios.post("http://localhost:4000/api/upload", formData, {
        headers: {
          "content-type": "multipart/form-data"
        }
      });

      console.log("planImage : ", typeof location);
      console.log("planTitle : ", typeof planTitleInput.value);
      console.log("exerciseType : ", typeof pickedExercise.id);

      const {
        data: { addPlan }
      } = await createPlan({
        variables: {
          planImage: location,
          planTitle: planTitleInput.value,
          exerciseType: pickedExercise.id
        }
      });

      if (addPlan) {
        AlertHelper.showDropAlert("success", "목록생성", "되었습니다");
        navigation.navigate("AddActivity", { planId: addPlan.id });
      }
    } catch (e) {
      console.log(e);
      AlertHelper.showDropAlert("warning", "목록생성", "실패");
      // navigation.navigate("Login", { email });
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = event => {
    const y = Math.round(event.nativeEvent.contentOffset.y);
    if (y <= -170) {
      console.log("close ! ");
      navigation.navigate("TabNavigation");
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
        onScroll={event => handleScroll(event)}
        scrollEventThrottle={160}
      >
        <View>
          <HeaderArea>
            <RowLeft>
              <MainTitle title={"Add Plan"} fontSize={42} />
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
                <SelectImageArea>
                  <ReselectImageArea>
                    <AddImageButton onPress={() => pickImage()}>
                      <ImageCover source={{ uri: pickedPhoto.uri }} />
                    </AddImageButton>
                  </ReselectImageArea>
                </SelectImageArea>
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
              loading={loading}
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
