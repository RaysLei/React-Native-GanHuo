import { showToast } from "./Constants";

/**
 * 设置reqInit.isShowToast 为false时，将不用toast打印错误信息
 *
 * 统一使用www.wanandroid.com的数据格式
 * 正常返回 {"data": {}, "errorCode": 0, "errorMsg": ""}
 * errorCode描述：
 * 0: 正常返回
 * -10: http状态码非成功
 * -20: 请求超时等一些IO异常
 * -30: gank.io固定错误状态码
 */
export const httpRequest = (url, reqInit = {}) => {
  const promise = fetch(
    url,
    {
      method: "GET",
      credentials: "include",
      ...reqInit
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        console.warn(response);
        // showToast("服务器繁忙，请稍后再试！");
        return Promise.reject({
          errorCode: -10,
          httpCode: response.status,
          errorMsg: "服务器繁忙，请稍后再试！"
        });
      }
    }, reason => {
      console.warn(reason);
      // showToast("当前网络不可用，请检查网络设置！");
      return Promise.reject({
        errorCode: -20,
        errorMsg: "当前网络不可用，请检查网络设置！"
      });
    })
    .then(response => {
      if (typeof response.error === "undefined") {
        if (response.errorCode === 0) {
          return response;
        } else {
          return Promise.reject(response);
        }
      } else if (!response.error) {
        return {
          data: response.results,
          errorCode: 0
        };
      } else {
        console.log(response);
        return Promise.reject({
          errorCode: -30,
          errorMsg: response.msg
        });
      }
    });

  const { isShowToast = true } = reqInit;
  if (isShowToast) {
    return promise
      .catch(reason => {
        console.log(reason);
        showToast(reason.errorMsg);
        return Promise.reject(reason);
      });
  }
  return promise;
};

export const get = httpRequest;

export const post = (url, params = new Map(), reqInit = {}) => {
  let request = { method: "POST", ...reqInit };
  if (params.size > 0) {
    let formData = new FormData();
    params.forEach((value, key) => {
      formData.append(key, value);
    });
    request.body = formData;
  }
  return httpRequest(url, request);
};
