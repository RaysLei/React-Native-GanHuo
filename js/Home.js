import React from "react";
import { TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "react-navigation";
import Icon from "react-native-vector-icons/Ionicons";
import GanHuo from "./GanHuo";
import WanAndroid from "./WanAndroid";
import My from "./My";

const TabNavigator = createBottomTabNavigator(
  {
    GanHuo: {
      screen: GanHuo,
      navigationOptions: {
        tabBarLabel: "干货营",
        tabBarIcon: ({ tintColor }) => {
          return <Icon name={"ios-analytics"} size={25} color={tintColor}/>;
        }
      }
    },
    WanAndroid: {
      screen: WanAndroid,
      navigationOptions: {
        tabBarLabel: "玩安卓",
        tabBarIcon: ({ tintColor }) => {
          return <Icon name={"logo-android"} size={25} color={tintColor}/>;
        }
      }
    },
    My: {
      screen: My,
      navigationOptions: {
        tabBarLabel: "我的",
        tabBarIcon: ({ tintColor }) => {
          return <Icon name={"ios-contact"} size={25} color={tintColor}/>;
        }
      }
    }
  },
  {
    tabBarOptions: {
      activeTintColor: "#CE3D3A",
      inactiveTintColor: "#666666"
    }
  }
);

TabNavigator.navigationOptions = ({ navigation }) => {
  // console.log("myLog", navigation);
  // console.log("state", navigation.state);
  let { routeName } = navigation.state.routes[navigation.state.index];
  // console.log("getChildNavigation", navigation.getChildNavigation(routeName));
  // console.log("routeName", routeName);
  let headerTitle, headerRight = null;
  switch (routeName) {
    case "WanAndroid":
      headerTitle = "玩安卓";
      break;
    case "My":
      headerTitle = "我的";
      break;
    default:
      headerTitle = "干货营";
      headerRight = (
        <TouchableOpacity
          style={{
            paddingStart: 15,
            paddingEnd: 15
          }}
          activeOpacity={0.5}
          onPress={() => navigation.navigate("AddGanHuo")}>
          <Icon name={"md-add"} size={28} color={"white"}/>
        </TouchableOpacity>
      );
      break;
  }
  return {
    headerTitle,
    headerRight
  };
};

export default TabNavigator;
