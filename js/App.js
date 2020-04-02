import React, { Component } from "react";
import { StyleSheet, View, Animated } from "react-native";
import { createAppContainer, createStackNavigator } from "react-navigation";
import Home from "./Home";
import Details from "./Details";
import ImageView from "./ImageView";
import AddGanHuo from "./AddGanHuo";
import Login from "./Login";
import Register from "./Register";
import MyCollect from "./MyCollect";
import CustomText from "./CustomText";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
    }
  }

  render() {
    const {scrollY} = this.state;
    const backgroundColor = scrollY.interpolate({
      inputRange: [0, 100],
      outputRange: ['#00000000', '#ffffffff'],
      extrapolate: 'clamp',
    });
    const titleColor = scrollY.interpolate({
      inputRange: [0, 100],
      outputRange: ['#ffffff', '#000000'],
      extrapolate: 'clamp',
    });
    const AnimatedCustomText = Animated.createAnimatedComponent(CustomText);
    // const AnimatedCustomText = CustomText;
    console.log('render');
    return (
      <View style={{flex: 1}}>
        <Animated.ScrollView
          style={{flex: 1}}
          scrollEventThrottle={1}
          onScroll={Animated.event(
            // scrollX = e.nativeEvent.contentOffset.x
            [
              {
                nativeEvent: {
                  contentOffset: {
                    y: scrollY,
                  },
                },
              }],
            // {useNativeDriver: true},
          )}>
          <View style={{height: 1000, backgroundColor: '#51ff40'}}/>
        </Animated.ScrollView>
        <Animated.View style={{
          height: 50,
          // opacity,
          backgroundColor: backgroundColor,
          alignItems: 'center',
          justifyContent: 'center',
          ...StyleSheet.absoluteFill,
          // top: 0,
        }}>
          <AnimatedCustomText style={{color: titleColor}}>标题</AnimatedCustomText>
        </Animated.View>
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
    Login: Login,
    Register: Register,
    MyCollect: MyCollect,
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
