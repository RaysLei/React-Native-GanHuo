import React from "react";
import { BackHandler } from "react-native";
import { WebView } from "react-native-webview";

export default class Details extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam("title", "")
  });

  constructor(props) {
    super(props);
    this.canGoBack = false;
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
  }

  handleBackPress = () => {
    if (this.canGoBack) {
      this.webView.goBack();
      return true;
    }
    return false;
  };

  _onNavigationStateChange = (navState) => {
    // console.log("onNavigationStateChange", navState);
    if (!navState.loading) {
      this.props.navigation.setParams({ title: navState.title });
      this.canGoBack = navState.canGoBack;
    }
  };

  render() {
    const uri = this.props.navigation.getParam("uri", "");
    return (
      <WebView
        ref={(r) => {
          this.webView = r;
        }}
        source={{ uri }}
        useWebKit={true}
        onNavigationStateChange={this._onNavigationStateChange}
      />
    );
  }
}
