// import { AIM } from './AIM.web.min.js';
import axios from '@/utils/axios.js';
import { guid } from "./videoLive.js"
import { DLiveInteraction } from './DLiveInteraction.web.min.js'
const {
  constants,
  ISettingOptions,
  IPaasToken,
  EventNameEnum,
  ConnectionStatus,
  interactionSdk,
  BasicMap,
  LocalLogType
} = DLiveInteraction
const deviceId = guid();
let DliveStatus = 0;
export {DliveStatus}

let Setting = {
  // environment: 0, // 环境
  // wsUrl: string, // websocket url
  // appKey: string, // 应用key IM_PAAS分配给应用的key
  // mediaHost: string, // 多媒体上传服务器地址
  // deviceId: string, // 设备唯一id
  // appName: string, // app_name 应用名称
  // appVersion: string, // 应用版本号
  // appLocale: string, // App 语言区域（默认zh_CN）
  // osName: string, // 操作系统名称，如Win、macOS、iOS、Android等
  // osVersion: string, // 操作系统版本
  // deviceName: string, // 设备名称
  // deviceType: string, // 设备型号
  // deviceLocale: string, // 设备语言（默认zh_CN）
  // timeZone: string, // time_zone 时区（默认Asia/Shanghai）
  // subscribeServerPush: string, // subscribe-server-push header
  // log: ILogConfig, // log回调
  // authTokenCallback(): Promise<Token>; // on_callback 获取登录token的回调函数（注意需要做成异步操作，不能有阻塞）
};
// interface ILogConfig {
//   info(...args: any[]): void;
//   error(...args: any[]): void;
// }

export function getLoginToken(liveId, chatId, username) {
  console.log('deviceId', deviceId,)
  console.log('参数chatId', chatId, "username", username)
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
        // longLinkUrl = 'ws://2a7424.im.aliyuncs.com'
        longLinkUrl = "wss://wss.im.dingtalk.cn"
      }
      Setting = {
        environment: 0, // 环境
        wsUrl: longLinkUrl, // websocket url
        appKey: res.data.appKey, // 应用key IM_PAAS分配给应用的key
        mediaHost: 'https://pre-down-impaas.dingtalk.com', // 多媒体上传服务器地址
        deviceId: deviceId, // 设备唯一id
        appName: res.data.appId, // app_name 应用名称
        authTokenCallback: () => new Promise((resolve, reject) => {
          resolve({
              accessToken: res.data.accessToken,
              refreshToken: res.data.refreshToken,
          });
        }),
        log: {
          error(...args) { console.error(...args) },
          info(...args) { console.info(...args) }
        },
      }
      console.log('Setting', Setting)
      // 初始化
      interactionSdk.getSettingService().set(Setting);
      interactionSdk.getEventService().register((eventName, data) => {
        console.log('eventName,data',eventName, data)
        if(data === 4){
          enterRoom(chatId,username);
        }
      });
     
      // 登录
      const authService = interactionSdk.getAuthService(); 
      authService.login();
    } else {
      this.$Message.error("获取事件数据信息失败");
    }
  })
}
// get
function enterRoom (chatId, username) {
 return interactionSdk.getInteractionService().enterRoom({
    roomId: chatId,
    nick: username
  })
  .then(res => {
    if (res.success)  {
      console.log('进入房间成功')
    } else {throw new Error('res error')}
  }).catch(err => {
    console.error(err, '进入房间失败')
  })
}

export function sendMessage2Room (param) {
  console.log('param', param)
  return interactionSdk.getInteractionService().sendCommentMsg(param)
  // 异步结果
  // .then((res) => {
  //   console.log('发送消息结果',res)
  //   if (res.commentId) console.log('消息发送成功')
  //   else throw new Error('res error')
  // }).catch(err => {
  //   console.error(err, '消息发送失败')
  // })
}

export function leaveRoom (param) {
  return interactionSdk.getInteractionService().leaveRoom({
     roomId: param
   })
   .then((res) => {
     if (res.success) console.log('离开房间成功')
     else throw new Error('res error')
   }).catch(err => {
     console.error(err, '离开房间失败')
   })
}


// 查询消息
// export 
function acceptMessage (param) {
  // interactionSdk.getInteractionService().getRoomDetail({
  //   roomId: param
  // }).then((res) => {
  //   console.log(res)
  //   console.log('查询房间信息成功'+res)
  //   if (res.roomDetailVO) 
  //   console.log('查询房间信息成功')
  //   if (res.messages) {
  //      console.log('查询消息成功')
  //   }
  // }).catch(err => {
  //   console.error(err, '查询房间信息失败')
  // })

}







