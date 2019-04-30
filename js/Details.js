import React from "react";
import { WebView } from "react-native-webview";

export default class Details extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam("title", "")
  });

  constructor(props) {
    super(props);
  }

  render() {
    const uri = this.props.navigation.getParam("uri", "");
    return (
      <WebView
        source={{ uri }}
        useWebKit={true}
      />
    );
  }
}
