import React from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { isBlank, showToast } from "./configs/Constants";
import { post } from "./configs/HttpUtils";
import Button from "apsl-react-native-button";

export default class Login extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: "登录",
    headerRight: (
      <TouchableOpacity
        activeOpacity={0.5}
        style={{
          paddingStart: 15,
          paddingEnd: 15
        }}
        onPress={navigation.getParam("onRegister")}>
        <Text style={{ color: "#FFF" }}>注册</Text>
      </TouchableOpacity>
    )
  });

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }

  componentDidMount() {
    console.log("login componentDidMount");
    this.props.navigation.setParams({ onRegister: this._onRegister });
  }

  _onRegister = () => {
    this.props.navigation.navigate("Register");
  };

  _onLogin = () => {
    if (isBlank(this.state.username)) {
      showToast("请输入用户名");
      return;
    }
    if (isBlank(this.state.password)) {
      showToast("请输入密码");
      return;
    }
    let map = new Map();
    map.set("username", this.state.username);
    map.set("password", this.state.password);
    post("https://www.wanandroid.com/user/login", map)
      .then(response => {
        console.log("response", response);
        this._loginSuccess(response.data);
      });
  };

  _loginSuccess = (data) => {
    const userInfo = {
      isLogin: true,
      userName: this.state.username,
      userPassword: this.state.password,
      id: data.id
    };
    AsyncStorage.setItem("userInfo", JSON.stringify(userInfo))
      .then(value => {
        console.log(value);
        this.props.navigation.goBack();
        showToast("登录成功");
      })
      .catch(reason => {
        console.log(reason);
        showToast("保存数据失败");
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
          returnKeyType={"done"}
          returnKeyLabel={"登录"}
          secureTextEntry={true}
          onSubmitEditing={this._onLogin}
        />
        <Button onPress={this._onLogin} style={styles.registerButton}
                textStyle={styles.loginButtonText}>登录</Button>
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
