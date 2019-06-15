import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { setUserInfo, showToast } from "./configs/Constants";
import AsyncStorage from "@react-native-community/async-storage";

class MyItemView extends React.Component {

  _onPress = () => {
    this.props.onClick(this.props.url);
  };

  _itemView = () => (
    <View style={[styles.itemView, styles.myItemView]}>
      <Text style={styles.itemText}>{this.props.title}</Text>
      <Icon name={"ios-arrow-forward"} size={26} color={"#b7b7b7"}/>
    </View>
  );

  render() {
    if (Platform.OS === "android") {
      return (
        <TouchableNativeFeedback
          onPress={this._onPress}
          background={TouchableNativeFeedback.SelectableBackground()}>
          {this._itemView()}
        </TouchableNativeFeedback>
      );
    }
    return (
      <TouchableHighlight
        onPress={this._onPress}
        underlayColor={"rgba(223,223,223,0.5)"}>
        {this._itemView()}
      </TouchableHighlight>
    );
  }
}

export default class My extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLogin: false,
      userName: ""
    };
    AsyncStorage.removeItem("userInfo");
  }

  componentWillMount() {
    this.willFocusSubscription = this.props.navigation.addListener("willFocus", () => {
      AsyncStorage.getItem("userInfo")
        .then(value => {
          console.log(value);
          if (value) {
            const userInfo = JSON.parse(value);
            setUserInfo(userInfo);
            this.setState({
              isLogin: userInfo["isLogin"],
              userName: userInfo["isLogin"] ? userInfo["userName"] : ""
            });
          } else {
            this.setState({
              isLogin: false,
              userName: ""
            });
          }
        });
    });
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }

  onAbout = () => {
    showToast("关于");
  };

  onWebView = (url) => {
    this.props.navigation.navigate(
      "Details",
      {
        uri: url,
        title: ""
      });
  };

  onMyCollect = () => {
    if (this.state.isLogin) {
      this.props.navigation.navigate("MyCollect");
    } else {
      this.props.navigation.navigate("Login");
    }
  };

  onLogin = () => {
    if (!this.state.isLogin) {
      this.props.navigation.navigate("Login");
    }
  };

  renderTopView = () => {
    if (Platform.OS === "android") {
      return (
        <TouchableNativeFeedback
          onPress={this.onLogin}
          background={TouchableNativeFeedback.SelectableBackground()}>
          {this.renderTopItem()}
        </TouchableNativeFeedback>
      );
    }
    return (
      <TouchableHighlight
        onPress={this.onLogin}
        underlayColor={"rgba(223,223,223,0.5)"}>
        {this.renderTopItem()}
      </TouchableHighlight>
    );
  };

  renderTopItem = () => {
    return (
      <View style={[styles.itemView, styles.topItemView]}>
        <Text style={styles.itemText}>
          {this.state.isLogin ? "玩安卓" : "玩安卓登录"}
        </Text>
        <Text style={[styles.itemText, styles.userNameText]}>
          {this.state.userName}
        </Text>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        {this.renderTopView()}
        <MyItemView title={"我的收藏"} onClick={this.onMyCollect}/>
        <MyItemView title={"点个Star"} onClick={this.onWebView}
                    url={"https://github.com/RaysLei/RN-Demo"}/>
        <MyItemView title={"提Issue/PR"} onClick={this.onWebView}
                    url={"https://github.com/RaysLei/RN-Demo/issues"}/>
        <MyItemView title={"关于"} onClick={this.onAbout}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCF8F9"
  },
  itemView: {
    backgroundColor: "#FFF",
    height: 60,
    paddingHorizontal: 15,
    justifyContent: "center"
  },
  topItemView: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 20
  },
  userNameText: {
    fontWeight: "500"
  },
  myItemView: {
    height: 50,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5
  },
  itemText: {
    fontSize: 16,
    color: "#333"
  }
});
