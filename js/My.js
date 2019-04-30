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
import { showToast } from "./configs/Constants";

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

  onAbout = () => {
    showToast("关于");
  };

  onWebView = (url) => {
    showToast(`${url}`);
  };

  onMyCollect = () => {
    showToast("我的收藏");
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={[styles.itemView, { marginBottom: 20 }]}>
          <Text style={styles.itemText}>玩安卓登录</Text>
        </View>
        <MyItemView title={"我的收藏"} onClick={this.onMyCollect}/>
        <MyItemView title={"点个Star"} onClick={this.onWebView}
                    url={"https://github.com/fujianlian/GankRN"}/>
        <MyItemView title={"提Issue/PR"} onClick={this.onWebView}
                    url={"https://github.com/fujianlian/GankRN/issues"}/>
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
