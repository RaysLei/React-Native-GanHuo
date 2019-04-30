import Toast from "react-native-root-toast";

let toast;

export const showToast = (msg) => {
  if (toast) {
    Toast.hide(toast);
  }
  toast = Toast.show(msg, {
    duration: Toast.durations.SHORT,
    position: Toast.positions.BOTTOM
  });
};

export const isBlank = (content) => {
  return typeof content !== 'string' || new RegExp("^\\s*$").test(content);
};

export const isHttpUrl = (url) => {
  return typeof url === 'string' && new RegExp("^http(s?)://.+", "i").test(url);
};
