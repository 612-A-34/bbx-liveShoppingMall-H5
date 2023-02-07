import { AIM } from './AIM.web.min.js';
import axios from '@/utils/axios.js';
import { guid } from "./videoLive.js"

const { 
  IMSDK, // 核心 SDK
  DataSDK, // 数据 SDK
  constants, // 常量定义
  convFeature, // 会话相关辅助函数
  msgFeature, // 消息相关辅助函数
  initStore, // 数据 SDK，初始化 Store
  getFileUrl,  // 获取文件访问地址
  mediaId, // 资源 ID 工具
} = AIM

// const deviceId = async ()=>{
//    await IMSDK.getAuthService().getDeviceId();
// }
const deviceId = guid()
let Setting = {
  appKey: "",  // 应用 key
  mediaHost: 'https://pre-down-impaas.dingtalk.com',
  deviceId: "",  // deviceId, // 设备唯一id
  appName: "", // app_name 应用名称
  debug: true,
  wsUrl: "",
  log: {
    error(...args) { console.error(...args) },
    info(...args) { console.info(...args) }
  },
  // 非必选
  // async authTokenCallback(uid) {
  //   return fetch('服务端地址获取URL' )
  //     .then((res) => res.json())
  //     .then((res) => {
  //     if (res) {
  //         return { ...res, uid };
  //     }
  //     throw new Error('token is null');
  //   });
  // },
};

export function getLoginToken(liveId) {
  console.log('deviceId', deviceId)
  let params = {
    deviceId: deviceId,
    liveId: liveId,
    os: "web"
  }
  axios.newPost(
     `/live/live/live/new/getLoginToken`,params
  ).then(res => {
    console.log('尝试获取token', res)
    if(res && res.data){
      let longLinkUrl = ""
      if (res.data.longLinkUrl){
        // longLinkUrl = "ws" + res.data.longLinkUrl.slice(3).substring(res.data.longLinkUrl.length-4)
        longLinkUrl = 'ws://2a7424.im.aliyuncs.com'
      }
      Setting = {
        appKey: res.data.appKey,  // 应用 key
        mediaHost: 'https://pre-down-impaas.dingtalk.com',
        deviceId,  // deviceId, // 设备唯一id
        appName: res.data.appId, // app_name 应用名称
        debug: true,
        wsUrl: longLinkUrl,
        log: {
          error(...args) { console.error(...args) },
          info(...args) { console.info(...args) }
        },
      }
      console.log('Setting', Setting)
      // 初始化
      IMSDK.getSettingService().set(Setting)
      // 登录
      IMSDK.getAuthService().login()
    } else {
      this.$Message.error("获取事件数据信息失败");
    }
  })
}
// get



