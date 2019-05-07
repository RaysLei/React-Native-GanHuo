import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { isBlank, showToast } from "./configs/Constants";
import { post } from "./configs/HttpUtils";
import Button from "apsl-react-native-button";

export default class Register extends React.Component {

  static navigationOptions = {
    title: "注册"
  };

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      secondPassword: "",
    };
  }

  _onRegister = () => {
    if (isBlank(this.state.username)) {
      showToast("请输入用户名");
      return;
    }
    if (isBlank(this.state.password)) {
      showToast("请输入密码");
      return;
    }
    if (isBlank(this.state.secondPassword)) {
      showToast("请再次输入密码");
      return;
    }
    if (this.state.secondPassword !== this.state.password) {
      showToast("两次输入密码不一致");
      return;
    }
    let map = new Map();
    map.set("username", this.state.username);
    map.set("password", this.state.password);
    map.set("repassword", this.state.password);
    post("https://www.wanandroid.com/user/register", map)
      .then(response => {
        console.log("response", response);
        showToast("注册成功");
        this.props.navigation.goBack();
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          placeholder={"请输入用户名"}
          onChangeText={(text) => this.setState({ username: text })}
          padding={0}
          clearButtonMode={"while-editing"}
          selectionColor={"#CE3D3A"}
          autoFocus={true}
        />
        <TextInput
          style={styles.textInput}
          placeholder={"请输入密码"}
          onChangeText={(text) => this.setState({ password: text })}
          padding={0}
          clearButtonMode={"while-editing"}
          selectionColor={"#CE3D3A"}
          secureTextEntry={true}
        />
        <TextInput
          style={styles.textInput}
          placeholder={"请再次输入密码"}
          onChangeText={(text) => this.setState({ secondPassword: text })}
          padding={0}
          clearButtonMode={"while-editing"}
          selectionColor={"#CE3D3A"}
          returnKeyType={"done"}
          returnKeyLabel={"注册"}
          secureTextEntry={true}
          onSubmitEditing={this._onRegister}
        />
        <Button onPress={this._onRegister} style={styles.registerButton}
                textStyle={styles.loginButtonText}>注册</Button>
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
  },
  registerButton: {
    marginTop: 20,
    backgroundColor: "#CE3D3A",
    borderColor: "#CE3D3A"
  },
  loginButtonText: {
    color: "#FFF"
  }
});
