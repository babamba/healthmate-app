import React, { useState } from "react";
import styled from "styled-components";
import Timeline, {
  Row,
  Time,
  VerticalSeparator,
  Circle,
  Dot,
  Line,
  Event
} from "react-native-timeline-feed";
import { Preset } from "react-native-timeline-feed/lib/Types";
import { SafeAreaView } from "react-navigation";
import constants from "../../constants";

const Container = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const DescriptionArea = styled.View`
  flex-direction: row;
  padding-right: 50px;
`;

const DescriptionText = styled.Text`
  margin-left: 10px;
  color: gray;
`;

const Title = styled.Text`
  font-size: 16px;
  font-weight: bold;
`;
const Image = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
`;
const Text = styled.Text``;

export default () => {
  const [selected, SetSelected] = useState(null);
  const data = [
    {
      time: "09:00",
      title: "Event 1",
      description: "Event 1 Description",
      lineColor: "#009688",
      imageUrl:
        "https://cloud.githubusercontent.com/assets/21040043/24240340/c0f96b3a-0fe3-11e7-8964-fe66e4d9be7a.jpg"
    },
    {
      time: "10:45",
      title: "Event 2",
      description: "Event 2 Description",
      lineColor: "#009688",
      imageUrl:
        "https://cloud.githubusercontent.com/assets/21040043/24240405/0ba41234-0fe4-11e7-919b-c3f88ced349c.jpg"
    },
    {
      time: "12:00",
      title: "Event 3",
      description: "Event 3 Description",
      lineColor: "#009688",
      imageUrl:
        "https://cloud.githubusercontent.com/assets/21040043/24240422/20d84f6c-0fe4-11e7-8f1d-9dbc594d0cfa.jpg"
    },
    {
      time: "14:00",
      title: "Event 4",
      description: "Event 4 Description",
      lineColor: "#009688",
      imageUrl:
        "https://cloud.githubusercontent.com/assets/21040043/24240422/20d84f6c-0fe4-11e7-8f1d-9dbc594d0cfa.jpg"
    },
    {
      time: "16:30",
      title: "Event 5",
      description: "Event 5 Description",
      lineColor: "#009688",
      imageUrl:
        "https://cloud.githubusercontent.com/assets/21040043/24240422/20d84f6c-0fe4-11e7-8f1d-9dbc594d0cfa.jpg"
    }
  ];

  const onEventPress = data => {
    SetSelected(data);
  };

  const renderSelected = () => {
    if (selected)
      return (
        <Text style={{ marginTop: 10 }}>
          Selected event: {selected.title} at {selected.time}
        </Text>
      );
  };

  const renderDetail = (rowData, sectionID, rowID) => {
    console.log("rowData", rowData);

    let title = <Title>{rowData.title}</Title>;
    let desc = null;
    if (rowData.description && rowData.imageUrl) {
      desc = (
        <DescriptionArea>
          <Image source={{ uri: rowData.imageUrl }} />
          <DescriptionText>{rowData.description}</DescriptionText>
        </DescriptionArea>
      );
    }

    return (
      <View style={{ flex: 1 }} key={data.title}>
        {title}
        {desc}
      </View>
    );
  };

  return (
    <SafeAreaView
      style={constants.commonStyle.safeArea}
      forceInset={{ top: "always" }}
    >
      <Container>
        {renderSelected()}
        <Timeline
          style={{
            flex: 1,
            marginTop: 20
          }}
          data={data}
          circleSize={20}
          circleColor="rgba(0,0,0,0)"
          lineColor="rgb(45,156,219)"
          //timeContainerStyle={{ minWidth: 52, marginTop: -5 }}
          timeStyle={{
            flex: 1,
            textAlign: "center",
            backgroundColor: "blue",
            color: "white",
            padding: 5,
            borderRadius: 13
          }}
          descriptionStyle={{ color: "gray" }}
          options={{
            style: { paddingTop: 5 }
          }}
          innerCircle={"icon"}
          onEventPress={() => onEventPress()}
          renderDetail={data => renderDetail(data)}
        />
      </Container>
    </SafeAreaView>
  );
};
