<template>
  <div class="AgoraContainer">
    <!-- <p style="z-index: 100;position: absolute;top: 100px;left: 0px;color: #333">{{res}}</p> -->
    <!-- 直播画面 -->
    <live ref="live" class="live" :liveInfo="liveInfo"></live>
    <!-- 头像部分 -->
    <head-photo :anInfo="liveInfo"></head-photo>
    <!-- 观看人数 -->
    <view-number class="ViewNumber" :audienceInfo="audienceInfo"></view-number>
  </div>
</template>

<script>
// 直播画面
import live from './components/live/live1'
// 头像部分
import headPhoto from './components/HeadPhoto'
// 观看人数
import viewNumber from './components/ViewNumber'
import axios from '@/utils/axios.js'

export default {
  name: 'ali-live',
  data() {
    return {
      // 直播信息
      lid: null,
      liveInfo: {
        avatar: "",
        username: "",
        lid: ""
      },
      // 观众信息
      audienceInfo: {
        likeNum: 0,
        pageView: 0,
        users: [],
      },
      timer: null,
      // ----------------
      starName: `正在直播`,
      // uniapp - 参数
      uniappData: 'not',
      uniTOken: '',
      res: {}
    }
  },
  created() {
    // 获取参数
    let data = this.getQuery('lid')
    this.uniappData = data;

    if (this.getQuery('lid') && this.getQuery('token')) {
      let token = this.getQuery('token').trim().split(" ")[1]
      window.sessionStorage.setItem('token', token)
      this.$store.commit('changeGetToken', token)
      this.lid = this.getQuery('lid')
      this.getAliLiveInfo()
    } else {
      //-------------------------------写死
      this.lid = '93612882176249856'
      let tt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiIxODgzMDg2MzA0NiIsIm9wZW5JZCI6Im9CNGNJNnd4ck9nYWRSLTBjRUtWYndTT1NvdFEiLCJzY29wZSI6WyJhbGwiXSwibmFtZSI6IjE4ODMwODYzMDQ2IiwiaWQiOjc5NDE2MTc5NjAyNTc2MjY4LCJlbnRlcnByaXNlSWQiOjI2LCJ0eXBlIjoiMSIsIm1hT3BlbklkIjoibzFGZU41UDNoWlM3dGlNM0RYUlFpSFowT21CWSIsImV4cCI6MTYyNzA5MDQ1NSwiYXV0aG9yaXRpZXMiOlsiUk9MRV9VU0VSIl0sImp0aSI6IjY0Y2RmNjVmLTU4NGItNGQzNC1hNTczLTk2ZDZkZmU1YmM2NCIsImNsaWVudF9pZCI6ImFwcCJ9.AV8XGVTBuU_YGGWJK-WjMjQJHv0HumPIdLksUr3farU'
      window.sessionStorage.setItem('token', tt)
      this.$store.commit('changeGetToken', tt)
      this.getAliLiveInfo()
    }
  },
  mounted() {
    setTimeout(() => {
      this.audioAutoPlay()
    },800)
    this.timer = setInterval( ()=> {
        this.getAliLiveInfo()
    },  1000 * 30)
    // 请求进入房间接口
    if (this.$store.state.getToken) {
      if( this.lid ) this.goRoom();
    } 
  },
  destroyed() {
    clearInterval(this.timer)
  },
  computed: {},
  beforeDestroy() {
    // console.log('触发beforeDestroy')
    if (this.$store.state.getToken) {
      if (this.lid) {
        this.leaveRoom()
      }
    }
  },
  methods: {
    // 取url中的参数值
    getQuery(name) {
        // 正则：[找寻'&' + 'url参数名字' = '值' + '&']（'&'可以不存在）
        let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        let r = window.location.search.substr(1).match(reg);
        if(r != null) { // 对参数值进行解码
            return decodeURIComponent(r[2]);
        }
        return null;
    },
    // 
    audioAutoPlay() {
      console.log('audioAutoPlay')
      function AutoPlay(){
        var audio = document.getElementsByTagName('video')[0]
        if(audio) {
          audio.play();
          let videoPlay = audio.play();
          let that = this
          videoPlay.then(()=>{
              // alert('可以自动播放')
              console.log('可以自动播放');
          }).catch((err)=>{
              console.log(err);
              // alert('不允许自动播放')
              console.log("不允许自动播放");
              //视频元素可以选择静音后再播放,提示用户打开声音
              audio.play();
              that.$dialog.alert({
                message: '欢迎回到播播侠直播间',
              }).then(() => {
                audio.autoplay();
              });
          })
        }

        // 自动播放
        // that.$dialog.alert({
        //   message: '欢迎进入播播侠直播间',
        // }).then(() => {
        //   audio.play();
        // });
      }
      AutoPlay()
    },

    // 阿里云直播拉流--直播间信息
    getAliLiveInfo() {
      if (!this.lid) return
      axios.spget(`/live/live/live/getAppLivePageResById/${this.lid}`)
        .then((res) => {
          if (res) {
            this.res = res;
            this.liveInfo = res.data;
            // this.liveInfo.isFinish = 2;
            // this.liveInfo.pullUrlBean = {}
            // this.liveInfo.pullUrlBean.m3u8Url = 'https://vse-as-all84.secdn.net/logos-channel/live/biblescreen-ad-free/chunklist_sess863097577.m3u8'
            document.title = this.liveInfo.title;
            if (res.data.isFinish === 2) {
              this.$dialog.alert({
                message: `主播已关播！`,
              }).then(() => {
                jWeixin.miniProgram.getEnv(function(res) {  
                  jWeixin.miniProgram.reLaunch({  
                    url: '/pages/videoLiveList/listView'  
                  })  
                })
              })
              .catch(() => {});
            }
            this.getAudienceNum(this.liveInfo)
          } else {
            this.$Message.error("获取直播间信息");
          }
        })
    },
    // 获取观看人数-观看用户信息
    getAudienceNum(liveInfo) {
      if (!liveInfo.memberId) return
      axios.spget(`/live/live/live/${this.lid}`).then((res) => {
        console.log('直播观众数', res)
        if (res && res.status === 200) {
          this.audienceInfo = res.data
          if (res.data.rateValue > 1) {
            window.sessionStorage.setItem('beishu', res.data.rateValue)
          } else {
            window.sessionStorage.setItem('beishu', '1')
          }
          
        } else {
         // this.$Message.error('获取获取观看人数失败')
        }
      })
    },

    // APP用户进入直播间
    goRoom(){
      if (window.sessionStorage.getItem('token')) {
        axios.put(`/live/live/live/goRoom`,{lid: this.lid,roomPwd: ""}).then(res => {
          console.log('用户进入直播间', res)
          if(res && res.data.code !== 0){
              this.$dialog.alert({
                message: `进入房间失败！`,
              }).then(() => {
                // jWeixin.miniProgram.getEnv(function(res) {  
                //   jWeixin.miniProgram.reLaunch({  
                //     url: '/pages/videoLiveList/listView'  
                //   })  
                // })
              })
              .catch(() => {});
          } else {
            console.log('加入房间成功！')
          }
        })
      }
    },

    //退出直播间
    leaveRoom() {
      axios.putdx(`/live/live/live/exitRoom/${this.lid}`).then((res) => {
        console.log('用户离开直播间', res)
      })
    },

  },
  components: {
    live,
    headPhoto,
    viewNumber,
  },
}
</script>

<style lang="less">
.AgoraContainer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #333;
}
video {
  height: auto;
  position: relative !important;
}
.headPhoto {
  position: absolute;
  top: 18px;
  left: 14px;
  z-index: 1;
}
.ViewNumber {
  position: absolute;
  top: 20px;
  right: 12px;
}
.live {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
