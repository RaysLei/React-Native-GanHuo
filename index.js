/**
 * @format
 */
import { AppRegistry, YellowBox } from "react-native";
import App from "./js/App";
import { name as appName } from "./app.json";

YellowBox.ignoreWarnings(["Warning: Slider", "Warning: ViewPagerAndroid"]);

AppRegistry.registerComponent(appName, () => App);
