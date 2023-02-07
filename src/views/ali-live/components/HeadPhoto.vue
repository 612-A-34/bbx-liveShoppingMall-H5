<template>
  <div class="headPhoto" @click="gotoAnchorHomepage()">
    <div class="head">
      <img :src="anInfo.avatar" alt />
    </div>
    <div class="headName">{{ anInfo.username}}</div>
    <!-- <div class="follow" @click="followAn()">关注</div> -->
    <!-- 点赞数 -->
    <!-- <div class="like">
      <img src="@/assets/live_icon_like .png" alt />
      <div class="likeCount">{{headPhoto.likeCount}}</div>
    </div> -->
  </div>
</template>

<script>
export default {
  props: {
    //   主播名
    // headPhoto: {
    //   type: Object,
    //   required: true,
    // },
    anInfo: {
      type: Object,
      required: true,
      default: {
        avatar: "",
        username: "",
        memberId: ""
      }
    },
  },
  name: 'headPhoto',
  data() {
    return {
      // 头像
      avatar: '',
      userInfo: {
      }
    }
  },
  created() {
  },
  mounted() {
  },
  computed: {},
  methods: {
    gotoAnchorHomepage(){
      return 
      let anInfoStr = JSON.stringify({
        avatar: this.anInfo.avatar,
        username: this.anInfo.username,
        memberId: this.anInfo.memberId,
        shopId: this.anInfo.shopId,
      })
      jWeixin.miniProgram.getEnv(function(res) {  
        jWeixin.miniProgram.reLaunch({  
          url: `../anchorHomePage/anchorHomepage?anInfo=${anInfoStr}` 
        })  
      })
      wx.miniProgram.navigateTo({
	      url: `../anchorHomePage/anchorHomepage?anInfo=${anInfoStr}`,
        success: res => {},fail: () => {},complete: () => {}
      });
    },
    followAn(){
      alert('关注')
    }
  },
  components: {},
}
</script>

<style scoped lang="less">
.headPhoto {
  z-index: 1;
  width: 160px;
  display: flex;
  align-items: center;
  height: 40px;
  .head {
    z-index: 2;
    width: 40px;
    height: 40px;
    background-color: #000;
    border-radius: 50%;
    overflow: hidden;
    img {
      z-index: 2;
      width: 100%;
      height: 100%;
    }
  }
  .headName {
    position: absolute;
    z-index: 1;
    left: 24px;
    font-size: 15px;
    padding: 0 0px 0 20px;
    white-space: nowrap; /*一行显示*/
    overflow: hidden; /*超出部分隐藏*/
    text-overflow: ellipsis; /*用...代替超出部分*/
    height: 26px;
    line-height: 26px;
    background: rgba(0, 0, 0, 0.2);
    color: #fff;
    border-radius: 0 13px 13px 0;
    overflow: hidden;
    width: 115px;
  }
  .follow{
    position: absolute;
    z-index: 2;
    left: 135px;
    width: 40px;
    height: 28px;
    font-size: 14px;
    font-family: PingFang SC, PingFang SC-Regular;
    font-weight: 400;
    text-align: center;
    line-height: 28px;
    color: #ffffff;
    background-image:url('./../../../assets/videoLive/live/follow.png');
    background-size: 40px 28px;
  }
  .like {
    position: absolute;
    left: 44px;
    top: 40px;
    display: flex;
    img {
      width: 13px;
      height: 12px;
    }
    .likeCount {
      font-size: 11px;
      margin-left: 4px;
      color: #fff;
      background: rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      padding: 0 6px;
    }
  }
}
</style>
