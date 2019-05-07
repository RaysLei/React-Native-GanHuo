import React from "react";
import { View, TextInput, StyleSheet, Picker, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { showToast, isBlank, isHttpUrl } from "./configs/Constants";
import { post } from "./configs/HttpUtils";

export default class AddGanHuo extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: "干货发布",
    headerRight: (
      <TouchableOpacity
        activeOpacity={0.5}
        style={{
          paddingStart: 15,
          paddingEnd: 15
        }}
        onPress={navigation.getParam("onSubmit")}>
        <Icon name={"md-checkmark"} size={28} color={"white"}/>
      </TouchableOpacity>
    )
  });

  constructor(props) {
    super(props);
    this.state = {
      type: "Android",
      url: "",
      desc: "",
      who: ""
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({ onSubmit: this._onSubmit });
  }

  _onSubmit = () => {
    if (isBlank(this.state.url)) {
      showToast("请输入网址");
      return;
    }
    if (!isHttpUrl(this.state.url)) {
      showToast("网址无效");
      return;
    }
    if (isBlank(this.state.desc)) {
      showToast("请输入描述");
      return;
    }
    if (isBlank(this.state.who)) {
      showToast("请输入昵称");
      return;
    }
    let params = new Map();
    params.set("url", this.state.url);
    params.set("desc", this.state.desc);
    params.set("who", this.state.who);
    params.set("type", this.state.type);
    params.set("debug", true);
    post("http://gank.io/api/add2gank", params)
      .then(response => {
        showToast("发布成功");
        this.props.navigation.goBack();
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          placeholder={"请输入网址"}
          onChangeText={(text) => this.setState({ url: text })}
          padding={0}
          clearButtonMode={"while-editing"}
          autoFocus={true}
          selectionColor={"#CE3D3A"}
          // value={this.state.url}
        />
        <TextInput
          style={styles.textInput}
          placeholder={"请输入描述"}
          onChangeText={(text) => this.setState({ desc: text })}
          padding={0}
          clearButtonMode={"while-editing"}
          selectionColor={"#CE3D3A"}
          // value={this.state.desc}
        />
        <TextInput
          style={styles.textInput}
          placeholder={"请输入昵称"}
          onChangeText={(text) => this.setState({ who: text })}
          padding={0}
          clearButtonMode={"while-editing"}
          selectionColor={"#CE3D3A"}
          // value={this.state.who}
        />
        <Picker
          selectedValue={"Android"}
          style={{ marginTop: 15 }}
          onValueChange={(itemValue) => this.setState({ type: itemValue })}>
          <Picker.Item label="APP" value="App"/>
          <Picker.Item label="iOS" value="iOS"/>
          <Picker.Item label="Android" value="Android"/>
          <Picker.Item label="福利" value="福利"/>
          <Picker.Item label="前端" value="前端"/>
          <Picker.Item label="休息视频" value="休息视频"/>
          <Picker.Item label="拓展资源" value="拓展资源"/>
          <Picker.Item label="瞎推荐" value="瞎推荐"/>
        </Picker>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCF8F9",
    paddingHorizontal: 20
  },
  textInput: {
    marginTop: 20,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#CDCDCD"
  }
});
