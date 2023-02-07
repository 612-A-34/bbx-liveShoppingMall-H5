<template>
  <div class="ViewNumber">
    <div class="imgs">
      <div v-for ="(item, index) in audienceInfo.users" :key="index">
        <img v-if="item && item.avatar !== '' " :class="('img' + index)" :src="decodeURIComponent(item.avatar)" alt />
        <img v-if="item && item.avatar === '' " :class="('img' + index)" src="../../../assets/avatar.png" alt />
      </div>
    </div>
    <div class="people"></div>
    <div class="cloasge"><img src="@/assets/videoLive/living-close.png" @click.stop="closeLive()"/></div>
  </div>
</template>

<script>
export default {
  props: {
    audienceInfo: {
      type: Object,
      required: true,
      default: {
        likeNum: 0,
        pageView: 0,
        pageViews: 0,
        users: [
        ]
      }
    },
  },
  watch: {
    audienceInfo: {
      handler(newVal, oldVal) {
      },
      deep: true,
      immediate: true
    },
  },
  name: 'ViewNumber',
  data() {
    return {
      audiences: this.audienceInfo.users,
    }
  },
  filters: {
    audiences: function () {
      if(audiences.length >= 3 ){
        return audiences.slice(0,2)
      } else {
        return audiences
      }
    }
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    // 关闭直播-跳转
    closeLive(){
      jWeixin.miniProgram.getEnv(function(res) {  
        jWeixin.miniProgram.reLaunch({  
          url: '/pages/videoLiveList/listView'  
        })  
      })
    },
  },
  components: {},

}
</script>

<style scoped lang="less">
.ViewNumber {
  display: flex;
  align-items: flex-end;
  font-size: 15px;
  color: #fff;
  .imgs {
    position: relative;
    height: 30px;
    img {
      position: absolute;
      right: 0;
      width: 30px;
      height: 100%;
      border-radius: 30px;
    }
    .img0 {
      right: 80px;
      z-index: 3;
    }
    .img1 {
      right: 50px;
      z-index: 2;
    }
    .img2 {
      right: 20px;
      z-index: 1;
    }
  }
  .people {
    width: 10px;
    height: 26px;
    line-height: 26px;
    padding: 0 12px;
    // background: rgba(0, 0, 0, 0.2);
    border-radius: 26px;
    margin-left: 4px;
  }
}
.cloasge {width: 30px;}
.cloasge img {width: 100%;}
</style>
