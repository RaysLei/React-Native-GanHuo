/**
 * @format
 */
import { AppRegistry, YellowBox } from 'react-native';
import App from "./js/App";
import { name as appName } from "./app.json";

YellowBox.ignoreWarnings(["Warning: Slider", "Warning: ViewPagerAndroid", "Possible Unhandled Promise Rejection"]);

AppRegistry.registerComponent(appName, () => App);
