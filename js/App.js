import React, { Component } from "react";
import { Image, StyleSheet, View } from "react-native";
import { createAppContainer, createStackNavigator } from "react-navigation";
import Home from "./Home";
import Details from "./Details";
import ImageView from "./ImageView";
import AddGanHuo from "./AddGanHuo";

class App extends Component {
  componentDidMount() {
    this.timeout = setTimeout(() => {
      this.props.navigation.replace("Home");
    }, 500);
  }

  componentWillUnmount() {
    this.timeout && clearTimeout(this.timeout);
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={require("./img/img_transition_default.jpg")}/>
      </View>
    );
  }
}

const AppNavigator = createStackNavigator(
  {
    App: {
      screen: App,
      navigationOptions: {
        header: null
      }
    },
    Home: Home,
    Details: Details,
    ImageView: ImageView,
    AddGanHuo: AddGanHuo,
  },
  {
    initialRouteName: "App",
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: "#CE3D3A"
      },
      headerTintColor: "#FFF"
    }
  }
);

export default createAppContainer(AppNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
