import React from "react";
import { Image } from "react-native";

export default class ImageView extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam("title", "")
  });

  constructor(props) {
    super(props);
    this.state = {
      height: 400
    };
  }

  render() {
    const uri = this.props.navigation.getParam("uri", "");
    return (
      <Image
        style={{
          flex: 1
        }}
        resizeMode={"contain"}
        source={{ uri }}
        defaultSource={require("./img/default_img.png")}
      />
    );
  }
}
