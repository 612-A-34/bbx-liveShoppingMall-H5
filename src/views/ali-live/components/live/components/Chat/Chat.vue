<template>
  <div class="chatBox">
    <div class="pageViews">{{pageViews}}</div>
    <div class="chatMsgBox">
      <div class="msgBox">
        <ul id="msgList">
          <li v-if="messageshow">
            <span class="systemMessage">欢迎来到直播间！播播侠严禁未成年人进行直播和打赏行为大家共同遵守、监督。直播内容严禁出现违规、低俗色情、吸烟酗酒等内容，若有违规请及时举报。另谨防直播诱导的网络诈骗、财产安全问题。</span>
          </li>
          <li v-for="item in chatList" :key="item.uid">
            <span class="userName"
              v-if="item.type !== 4 && item.type !== 0 && item.type !== 1"
              >{{ item.name }}</span>
            <!-- <span class="joinRoom" v-if="item.type == 0"
              >{{ item.name }} 加入房间</span> -->
            <!-- <span class="leverRoom" v-if="item.type == 1"
              >{{ item.name }} 离开房间</span> -->
              <span class="leverRoom" v-if="item.type == 11"> 进入直播间</span>
              <span class="leverRoom" v-if="item.type == 13"> 正在分享直播间</span>
              <span class="leverRoom" v-if="item.type == 14"> 正在购买商品</span>
            <span class="userMessage" v-if="item.type == 2"
              >：{{ item.message }}</span>
            <span class="giftName" v-if="item.type == 3">送出 <img :src="item.giftIcon" alt />  {{ item.giftId }}{{ item.giftName }} {{ item.giftNun }} 个 </span>
            <span class="systemMessage" v-if="item.type == 4">{{
              item.message
            }}</span>
            <span class="giveLikeNum" v-if="item.type == 7"
              >为主播点了{{ item.giveLikeNum }} 个赞</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="bottomItem">
      <div class="sendBag">
        <form class="search-block" action="javascript:void 0">
          <input class="msgIpt" type="text" placeholder="说点什么呢…" v-model="val" @keyup="sendMsg"  @focus="sendMsg"/>
        </form>
        <div class="fasong"><img src="@/assets/videoLive/video/send.png" @click="sendMsg"/></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import axios from '@/utils/axios.js';
import { guid } from "@/utils/videoLive.js"
import { DLiveInteraction } from '@/utils/DLiveInteraction.web.min.js'
// 观看人数
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
export default {
  props: {
    liveInfo: {
      type: Object,
      default: {}
    },
    unick:{
      type: String
    },
    audienceInfo: {
        type: String
      },
  },
  name: 'Chat',
  data() {
    return {
      // 观众信息
      messageshow:true,
      pageViews:'0',
      // 聊天客户端Info
      chatInfo: {
        appId: 'c3f200f46a2f4f79a44e85ad9d4824f7',
        ChatChannelId: null,
        ChatToken: null,
      },
      // fake聊天信息
      chatList: [
        // { message: '你好', name: '你好', type: 2 },
        // { giveLikeNum: 200, name: '在吗', type: 7 },
        // { message: '系统消息', type: 4 },
        // { message: 111, name: '能切换吗', type: 2 },
        // { name: '肯德基', type: 1 },
        // { message: '早上好啊', name: 'Pdd', type: 2 },
      ],
      // 本地聊天客户端
      client: null,
      // 本地聊天频道
      channel: null,
      // 输入框双向绑定数据
      val: '',
      a: 0,
    }
  },
  created() {
    // 获取聊天客户端+频道信息
    setTimeout(() => {
      this.messageshow = false
    }, 10000);
    this.getChatInfo();
  },
  mounted() {
  },
  computed: {},
  watch:{
  },
  beforeDestroy(){
    this.leave()
  },
  methods: {
    // init
    // 获取直播间信息，登录、加入聊天室
    chatInit(liveId, chatId, username){
      console.log('liveId22222222222222222222',Date.now(), 'chatId',chatId,'username', username)
      console.log('liveId3333333333', window.sessionStorage.getItem('beishu'))
      const deviceId = guid();
      let Setting = {};
      let params = {
        deviceId: deviceId,
        liveId: Date.now() + Math.ceil(Math.random()*10),
        os: "web"
      }
      axios.newPost(`/live/live/live/new/getLoginToken`,params).then(res => {
        console.log('尝试获取token', res)
        if(res && res.data){
          Setting = {
            environment: 0, // 环境
            wsUrl: "wss://wss.im.dingtalk.cn", // websocket url
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
          // 监听事件
          interactionSdk.getEventService().register((eventName, data) => {
            console.log (eventName,data)
            if(eventName === 'paas.connection.changed' && data === 4){
              this.enterRoom(chatId,username);
              this.chaxun(chatId);
            }
            if(eventName === 'paas.live.room.onlinecount'){
              this.pageViews = parseInt(data.uv * window.sessionStorage.getItem('beishu'))
            }
            if(eventName === 'paas.live.room.customMessage'){
              if (JSON.parse(data.body).type == 15 && chatId == JSON.parse(data.body).roomId) {
                console.log ('新流地址',JSON.parse(data.body).m3u8Url)
                this.$parent.m3u8urlchange(JSON.parse(data.body).m3u8Url);
              }
              if (JSON.parse(data.body).type == 10 && chatId == JSON.parse(data.body).roomId) {
                 this.$dialog.alert({
                    message: '直播已结束',
                  }).then(() => {
                    jWeixin.miniProgram.getEnv(function(res) {  
                      jWeixin.miniProgram.reLaunch({  
                        url: '/pages/videoLiveList/listView'  
                      })  
                    })
                  });
              }
              if (chatId == JSON.parse(data.body).roomId) {
                let msg = JSON.parse(data.body)
                this.chatList.push(msg)
                // 消息自动滚动
                this.$nextTick(() => {
                  this.autoScroll()
                })
              }
            }
          });
          // 登录-长连接
          let authService = interactionSdk.getAuthService()
          authService.login();
          } else {
            this.$Message.error("获取事件数据信息失败");
          }
        })
    },

    // 长连接-加入聊天室
    enterRoom (chatId, username) {
      interactionSdk.getInteractionService().enterRoom({
        roomId: chatId,
        nick: this.unick
      })
      .then(res => {
        if (res.success)  {
          this.sendMessage2Room(chatId, '', 11)
          console.log('进入房间成功')
        } else {throw new Error('res error')}
      }).catch(err => {
        console.error(err, '进入房间失败')
      })
    },

    //查询房间信息
    chaxun(chatId){
      interactionSdk
        .getInteractionService()
        .getRoomDetail({
          roomId: chatId
        }).then((res) => {
          if (res.roomDetailVO) {
            this.pageViews = parseInt(res.roomDetailVO.uv * window.sessionStorage.getItem('beishu'))
            //console.log('查询房间信息成功4444444444',res)
          }
          else throw new Error('res error')
        }).catch(err => {
          console.error(err, '查询房间信息失败')
        })
    },

    // 发送消息
    sendMessage2Room (chatId, val,type ) {
      let msgContent = JSON.stringify({
        roomId: chatId,
        message: val, 
        name: this.unick, 
        type: type 
      })
      interactionSdk.getInteractionService().sendCustomMsg({
        roomId: chatId,
        subType: 100001,
        body: msgContent, // 消息子类型,业务方决定
      }).then((res) => {
        if (res.messageId) {
          console.log (chatId, val,'发送成功后值')
          this.val = ''; 
        }
        else throw new Error('res error')
      }).catch(err => {
        console.error(err, '消息发送失败')
      })
    },

    // 消息自动滚动
    autoScroll() {
      var scrollDiv = document.getElementById('msgList')
      try {
        if (scrollDiv !== null) {
          scrollDiv.scrollTop = scrollDiv.scrollHeight
        } else {
        }
      } catch (err) {
        console.log(err)
      }
    },


    // -------------------------------------------
    // 创建新的消息容器
    createNewMsg(message) {
      console.log (this.chatList)
      // 自己发送的文本消息
      if (message === undefined) {
        // 文字消息
        this.chatList.push({
          message: this.val,
          name: this.$store.state.uid,
          type: 2,
        })
      } else if (message.type == 8) {
        // 播放进度
        if (message.type == 8) {
          this.$store.commit('changeTimes', message.playPosition)
          if (this.a == 0) {
            this.$emit('changePlayPosition')
          }
          this.a = this.a + 1
        } else {
          // 远端消息
          this.chatList.push(message)
        }
      }
      // 消息自动滚动
      this.$nextTick(() => {
        this.autoScroll()
      })
    },

    // 发送
    sendMsg(e) {
      if (e.keyCode === 13 || e.type == 'click') {
        if (window.sessionStorage.getItem('token')) {
          if (this.val.trim() !== '') {
            console.log (this.liveInfo.chatId, this.val.trim(),'发送消息前传值')
            this.sensitiveTextfilter(this.val.trim()).then( res => {
              console.log('敏感词过滤')
              if (res.data.flag || res.data.flag === 'true') {
                this.sendMessage2Room(this.liveInfo.chatId, res.data.data ,2)
              }
            })
          }
        }
      }
    },

    // 创建并加入频道
    createChannelJoin(client) {
      this.channel = client.createChannel(this.chatInfo.ChatChannelId)
      // 监听用户加入
      this.channel.on('MemberJoined', (memberId) => {
        // 用户已加入频道。
        const joinMsg = {}
        joinMsg.name = memberId
        joinMsg.type = 0
        this.createNewMsg(joinMsg)
      })
      this.channel.on('MemberLeft', (memberId) => {
        // 用户已离开频道。
        const joinMsg = {}
        joinMsg.name = memberId
        joinMsg.type = 1
        this.createNewMsg(joinMsg)
      })
      console.log('3.创建频道成功')
      this.channel
        .join()
        .then(() => {
          /* 加入频道成功的处理逻辑 */
          console.log('4.加入频道成功')
          // 监听频道消息
          this.channel.on('ChannelMessage', (message, memberId) => {
            // 收到频道消息。
            message = JSON.parse(message.text)
            // 聊天框展示消息
            this.createNewMsg(message)
          })
        })
        .catch((error) => {
          /* 加入频道失败的处理逻辑 */
          console.log('加入失败', error)
        })
      // 获取发送消息的用户与消息
    },
    // 退出
    leave(chatId) {
       interactionSdk.getInteractionService().leaveRoom({
          roomId: chatId
        }).then((res) => {
          if (res.success) {
            //this.sendMessage2Room(chatId, '', 1,)
            interactionSdk.getEventService().unRegister()
          } 
          else throw new Error('res error')
        }).catch(err => {
          console.error(err, '离开房间失败')
        })
    },
    // 清屏
    clearScreen() {
      if (window.sessionStorage.getItem('token')) {
        this.$emit('clearScreen')
      } else {
        console.log('清屏')
        // 为绑定手机号之后返回添加标识
        this.$store.commit('changeWhereAddr', location.href)
        this.$dialog.confirm({
            title: '绑定手机号',
            message: `您未绑定手机号请绑定手机号后进行操作~`,
            confirmButtonText: '去绑定',
            cancelButtonText: '残忍拒绝',
          })
          .then(() => {
            this.$router.push('/bindPhone')
          })
          .catch(() => {
            // on cancel
          })
      }
    },
    // 获取聊天客户端所需信息
    getChatInfo(chatId) {
      this.chatInfo.ChatChannelId = chatId
      // 聊天框滑到最新消息
      this.$nextTick(() => {
        this.autoScroll()
      })
    },
    // 敏感词过滤
    sensitiveTextfilter(content){
      let param = {
        content: content
      }
      return axios.newPost(`/live/sensitive/words/check`, param)
    },

  },
  components: {
  },
}
</script>

<style scoped lang="less">
.chatBox {
  // position: absolute;
  z-index: 3;
  top: 0;
  width: 375px;
  height: 667px;
  box-sizing: border-box;
  overflow: hidden;
  .chatMsgBox {
    width: 270px;
    overflow: hidden;
    position: absolute;
    bottom: 70px;
    left: 14px;
    .msgBox {
      width: 260px;
      overflow: hidden;
      #msgList {
        flex-direction: column;
        width: 270px;
        height: 200px;
        overflow-y: auto;
        overflow-x: hidden;
        margin-bottom: 20px;
        font-size: 13px;
        color: #fff;
        text-align: left;
        li {
          width: fit-content;
          margin: 6px 0;
          padding: 6px 10px;
          margin-right: 20px;
          border-radius: 10px;
          background: rgba(0, 0, 0, 0.4);
          word-break: break-all;
          word-wrap: break-word;
          .userName {
            color: #F8D94B;
          }
          .joinRoom,
          .leverRoom,
          .systemMessage {
            color: #fff;
          }
          .giftName {
            img {
              height: 20px;
            }
          }
        }
      }
    }
  }
  .bottomItem {
    position: absolute;
    z-index: 999;
    bottom: 28px;
    display: flex;
    justify-content: space-between;
    width: 170px;
    margin-left: 66px;
    .sendBag {
      display: flex;
      height: 36px;
      box-sizing: border-box;
      margin-bottom: 0px;
      .msgIpt {
        width: 170px;
        height: 36px;
        border: none;
        padding: 0 10px;
        color: #fff;
        background: rgba(0, 0, 0, 0.4);
        border-radius: 17px;
      }
      button {
        height: 33px;
        border: none;
        background-color: #84caf8;
        color: #fff;
        border-radius: 30px;
        padding: 0 14px;
        font-size: 12px;
        position: absolute;
        right: 24px;
        bottom: 0;
      }
      .send {
        right: 100px;
        background-color: #0099ff;
      }
    }
  }
}
.fasong {width: 36px; height: 36px; margin-left: 8px;}
.fasong img {width: 36px; height: 36px;}
.pageViews {
  position: fixed;
  color: #fff;
  font-size: 14px;
  top: 24px;
  right: 13%;
    height: 0.69333rem;
    line-height: 0.69333rem;
    padding: 0 0.32rem;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 0.69333rem;
}
.search-block {font-size: 13px;}
::-webkit-input-placeholder { /* WebKit browsers */
  color: #fff;
  font-size: 13px;
}

::-moz-placeholder { /* Mozilla Firefox 19+ */
  color: #fff;
  font-size: 13px;
}

:-ms-input-placeholder { /* Internet Explorer 10+ */
  color: #fff;
  font-size: 13px;
}
</style>
