<template>
  <div class="liveContainer"  ref="liveContainer" >
    <!-- 直播-播放器部分 -->
    <div id="remote-container">
      <div id="mui-player"></div>
    </div>
    <!-- 聊天组件 -->
    <div class="bottom_tg">
      <div class="shopping-bag" @click.stop="shopListIsShow()">
        <img src="@/assets/videoLive/video/shopping_bag.png"/>
      </div>
      <div class="jubao"><img src="@/assets/videoLive/living-more.png" @click.stop="moreOperations()"/></div>
      <!-- <div class="cloasge"><img src="@/assets/videoLive/living-close.png" @click.stop="closeLive()"/></div> -->
    </div>
    <chat  :liveInfo="liveInfo"  ref="chatIm" :unick="unick" @clearScreen="clearScreen" ></chat>
    <!-- 商品框 -->
    <shop-list ref="myChild" :resShopList="resShopList" :lid="liveInfo.lid"></shop-list>
    <!--更多操作-->
    <van-popup v-model="showMore" position="bottom" :style="{ height: '30%' }" closeable round>
      <p class="more-content">更多</p>
      <div class="flex-row-start more-content">
        <div class="flex-clomun-start more-content-item" @click.stop="gotoReport()">
           <img src="@/assets/videoLive/live_report.png"/><p>举报</p>
        </div>
        <div class="flex-clomun-start more-content-item" @click.stop="clearScreen()">
           <img src="@/assets/videoLive/live_report.png" /><p>清屏</p>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script type="text/ecmascript-6">
import axios from '@/utils/axios.js'
// 聊天组件
import chat from './components/Chat/Chat'
// 商品
import shopList from './components/shopList/ShopList'
import 'mui-player/dist/mui-player.min.css'
import MuiPlayer from 'mui-player'
import Hls from 'hls.js'
// import MuiPlayerMobilePlugin from 'mui-player-mobile-plugin'
export default {
  name: 'live',
  props: {
    liveInfo: {
      type: Object,
      default: {}
      // avatar: "https://boboxia.oss-cn-beijing.aliyuncs.com/img/member/1616578173291529.png",
      // videoUrl: "https://vse-as-all84.secdn.net/logos-channel/live/biblescreen-ad-free/chunklist_sess863097577.m3u8",
      // 备用 http://ivi.bupt.edu.cn/hls/cctv1hd.m3u8
    }
  },
  data() {
    return {
      currentTime: '',
      videoPlayerCase: null,
      playerVideo: null,
      videoInfo: {
        videoHeight: 800,
        videoWidth: 375
      },
      errorgo: false,
      showMore: false,
      isVideoBreak: '',
      unick: null,
      // -----------------------------------------------------------
      // 客户端
      client: null,
      // 判断鼠标双击---点赞
      doubleClick: {
        likeCount: 0,
        clickTimer: null,
        lastClickTime: 0,
      },
      // 商品列表
      resShopList: [],
      // 直播带货商品总数量
      goodsListCount: 0,
      // 状态
      nickStatus: false,
      liveInfoStatus: false,
      chatStatus: false,
    }
  },
  watch: {
    liveInfo: {
      handler(newVal, oldVal) {
        if (newVal.pullUrlBean && newVal.pullUrlBean.m3u8Url && newVal.pullUrlBean.m3u8Url !== "" && JSON.stringify(newVal.pullUrlBean) !== JSON.stringify(oldVal.pullUrlBean) ) {
          console.log('1newVal', newVal)
          this.liveInfoStatus = true
          if (this.nickStatus && this.liveInfoStatus && !this.chatStatus && this.$store.state.getToken) {
            this.$refs.chatIm.chatInit(newVal.liveId, newVal.chatId, this.unick)
            this.chatStatus = true
          }
          if(newVal.isFinish === 2) return
          this.$nextTick(() => {
            this.initVideoPlayer()
          })
        } else {
          console.log('2newVal', newVal)
        }
      },
      deep: true,
      immediate: true
    },
    unick: {
      handler(newVal, oldVal) {
        // console.log("newVal:", newVal, "oldVal:",oldVal);
        if (newVal !== "" && newVal !== oldVal) {
          this.nickStatus = true
          if (this.nickStatus && this.liveInfoStatus && !this.chatStatus && this.$store.state.getToken) {
            this.$refs.chatIm.chatInit(this.liveInfo.liveId, this.liveInfo.chatId, this.unick)
            this.chatStatus = true
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.videoInfo.videoHeight = document.documentElement.clientHeight  // 视口高度
    this.videoInfo.videoWidth = document.documentElement.clientWidth
  },
  mounted() {
    if (this.$store.state.getToken) {
      console.log('getNickName')
      this.getNickName()
    }
    // this.initVideoPlayer();
  },
  beforeDestroy() {
    this.leaveRoom()
  },
  computed: {
    // 定义远端视频画面的容器
    remoteContainer() {
      return document.getElementById('remote-container')
    },
  },
  methods: {
    //更换m3u8地址
    m3u8urlchange(data){
      this.liveInfo.pullUrlBean.m3u8Url = data
      console.log ('新流地址2',this.liveInfo.pullUrlBean.m3u8Url)
      this.initVideoPlayer()
    },
    // 播放器初始化
    initVideoPlayer() {
      console.log('调用初始化直播')
      if (!this.liveInfo.pullUrlBean || this.liveInfo.pullUrlBean === '' || this.liveInfo.pullUrlBean === {}) return
      this.playerVideo = new MuiPlayer({
            container:'#mui-player',
            autoplay: true,
            width: this.videoInfo.videoWidth,
            height: this.videoInfo.videoHeight,
            autoFit: false,
            objectFit: 'cover',
            poster: this.liveInfo.coverUrl,
            live: true,
            autoOrientaion: false,
            src: this.liveInfo.pullUrlBean.m3u8Url,
            // src: 'http://ivi.bupt.edu.cn/hls/cctv1hd.m3u8',
            pageHead: false,
            parse:{
                type:'hls',
                loader:Hls,
                config:{ // hls config to：https://github.com/video-dev/hls.js/blob/HEAD/docs/API.md#fine-tuning
                  debug:false,
                },
            },
            // plugins:[
            //     new MuiPlayerMobilePlugin({
            //         showMenuButton: false,
            //         pageGetsture: false,
            //         defaultMenuConfig: {
            //           showFillSwitch: false
            //         }
            //     })
            // ]
      });
      this.playerVideo.toggleControls = true
      console.log('mp.video', this.playerVideo.video)
      let a = this.playerVideo.video
      let that = this
      that.playerVideo.on('ready',function(event) {
        console.log('video ready')
        console.log('event',event);
        var videoDOM = document.querySelector('video')
        videoDOM.setAttribute('webkit-playsinline','')
        videoDOM.setAttribute('playsinline','')
        videoDOM.setAttribute('x5-playsinline','')
        var js = document.getElementsByTagName('video')[0]
        // 自动播放
        that.$dialog.alert({
          message: '欢迎进入播播侠直播间',
        }).then(() => {
          js.play();
        });
        // 暂停
        videoDOM.addEventListener('pause', function(e) {
          // alert('监听到暂停播放')
          js.play();
            console.log('暂停播放',e)
        })
      });
    },
    // 获取nickname
    getNickName() {
      axios.spget(`/user/user/enterprise`).then(res => {
        console.log('获取次获取nickname', res)
        if (res && res.status === 200) {
          var partten = /^1[3,5,8]\d{9}$/
          var fl = false
          if (partten.test(res.data.unick)) {
            this.unick = res.data.unick
            this.unick = this.unick.replace(this.unick.substr(3, 4), '*'.repeat(4))
          } else {
            this.unick = res.data.unick
          }
          this.nickStatus = true
        } else {
          // this.$Message.error("获取事件数据信息失败");
        }
      })
    },
    // 退出直播间
    leaveRoom() {
      axios.putdx(`/live/live/live/exitRoom/${this.liveInfo.lid}`).then((res) => {
      })
      if (this.playerVideo) {
        this.playerVideo.destory()
      }
    },
    // 点击更多操作
    moreOperations() {
      this.showMore = true;
    },
    // 跳转到举报页面
    gotoReport() {
      this.$router.push({
        name: 'shortInform',
        query: {
          params: this.liveInfo,
          type: "live"
        }
      })
    },
    // 打开
    showShopList() {
      this.showShopList = true
    },

    // 获取主播带货列表
    getXnLiveGoods() {
      const params = {
        centreLiveId: "",
	      liveId: this.liveInfo.liveId,
      }
      if (this.liveInfo.isRebroadcast && this.liveInfo.isRebroadcast === 0) {
        params.centreLiveId = this.liveInfo.liveId
      } else {
        params.centreLiveId = this.liveInfo.rebroadcastId
      }
      axios.newPost(
         `/mall/xnLiveGoods/selectLiveGoods`, params
      ).then(res => {
        console.log('主播带货列表', res)
        if (res && res.status === 200) {
          this.resShopList = res.data
          this.goodsListCount = res.data.length
        } else {
          // this.$Message.error("获取事件数据信息失败");
        }
      })
    },

    // -----------------------------------------------------------

    // 处理错误的函数
    handleError(err) {
      console.log('Error: ', err)
    },

    // 商品组件Info
    async shopListIsShow() {
        try {
          // 转播情况
          console.log(this.liveInfo, 988888888888)
          if (this.liveInfo.isRebroadcast == 1) {
            const res = await this.$newPost(
              `/mall/xnLiveGoods/selectLiveGoods`, {
                liveId: this.liveInfo.lid,
                centreLiveId: this.liveInfo.centreLId,
              })
            if (res.status == 200) {
              console.log('111', res)
              this.resShopList = res.data
            }
            // 无转播情况
          } else if (this.liveInfo.isRebroadcast == 0) {
            const res = await this.$newPost(
              `/mall/xnLiveGoods/selectLiveGoods`,
              {
                liveId: this.liveInfo.lid,
                centreLiveId: this.liveInfo.lid,
              })
            if (res.status == 200) {
              console.log('222', res)
              this.resShopList = res.data
            }
          }
          this.$refs.myChild.shopIsShow()
          this.$refs.chatIm.sendMessage2Room(this.liveInfo.chatId, null , 14)
        } catch (err) {
          console.log(err)
        }
    },

    // 清屏
    clearScreen() {
      this.$refs.chatIm.chatList = []
    },
    // 获取直播数据
    getChannelId(
      isRebroadcast,
      centreLiveId,
      roomId,
      chatId,
      isCloud,
      isFinish,
      videoUrl
    ) {
      // 直播是否结束
      this.liveInfo.isFinish = isFinish
      // 是否录播 0直播 1录播
      this.liveInfo.isCloud = isCloud
      // 录播地址
      this.liveInfo.videoUrl = videoUrl
      // 是否转播 0未转播 1转播
      this.liveInfo.isRebroadcast = isRebroadcast
      // 中央直播间ID
      this.liveInfo.centreLiveId = centreLiveId
      // 直播间ID
      this.liveInfo.liveChannel = roomId
      //   创建本地客户端
      this.InitLiveClient()
      //   监听音视频流
      this.checkUserLive(
        this.client,
        this.handleError,
        this.addVideoStream,
        this.removeVideoStream
      )
      // 初始化+设置角色+加入频道
      this.initRoleJoin(this.client, this.handleError)

      this.$refs.childrenMethod.getChatInfo(chatId)
    },
    // 
    checkListGoods(){
      this.shopListIsShow()
    }


  },
  components: {
    // 聊天组件
    chat,
    // 商品
    shopList,
  },
}
</script>

<style lang="less">
.flex-row-start{
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: start;
    align-items: center;
}
.flex-row-end{
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-end;
    align-items: center;
}
.flex-row-start-wrap{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: start;
    align-items: center;
}
.flex-row-between{
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
}
.flex-row-between-wrap{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
}
.flex-column-start{
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
}
.flex-column-start-left{
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: left;
}
// 修改样式--播放器
#mui-player {
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  -moz-user-select: none;
}
._full{
  display: none;
}
.live-mode{
  display: none;
}
._pause{
  display: none;
}
.player-btn{
  display: none;
}
.m-player .mplayer-footer .progress {
  display: none;
}
// ----------
.liveContainer {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
#remote-container {
  width: 100%;
  z-index: 0;
  height: 100%;
}
.chat {
  position: absolute;
  top: 0;
  left: 0;
}
.utilsBox {
  z-index: 1;
  position: relative;
  right: 10px;
  bottom: 18px;
  position: absolute;
  margin-right: 10px;
  img {
    width: 35px;
    height: 35px;
    margin-left: 10px;
  }
  span {
    position: absolute;
    right: -6px;
    top: -6px;
    height: 14px;
    min-width: 14px;
    line-height: 15px;
    background-color: #cd3c29;
    border-radius: 100px;
    font-size: 10px;
    padding: 2px;
    color: #fff;
  }
}
.userGiftList {
  position: absolute;
  bottom: 0;
}
.shopList {
  position: absolute;
  bottom: 0;
}
.video-js .vjs-big-play-button {
  top: 45%;
  left: 148px;
}
.video-js {
  width: 100%!important;
  height: 100%!important;
}
.more-content{
  width: 100%;
  height: 12px;
  font-size: 13px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #B0B0B0;
  line-height: 16px;
  margin-top: 30px;
}
.more-content-item{
  width: 32px;
  height: 50px;
  margin-left: 50px;
  img{
    width: 22px;
    height: 18px;
  }
}
.bottom_tg {
  position: absolute;
  z-index: 99;
  left: 5%;
  bottom: 28px;
  width: 90%;
  height: 36px;
  display: flex;
}
.bottom_tg img {
   width: 36px;
}
.jubao { margin-left: 260px;}
.cloasge {margin-left: 5px; line-height: 0; width: 15px;}
</style>
