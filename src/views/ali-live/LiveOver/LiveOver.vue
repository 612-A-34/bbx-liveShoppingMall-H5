<template>
  <div class="liveOver">
    <!-- NavBar -->
    <!-- <nav-bar :starName="starName"></nav-bar> -->
    <van-cell-group>
      <van-cell>
        <div class="liveinfo">
          <div class="left">
            <img :src="this.$store.state.overData.coverUrl" alt />
          </div>
          <div class="right">
            <div class="top">
              <img :src="avatar" alt />
              <span>{{ this.$store.state.overData.username }}</span>
            </div>
            <div class="bottom">{{ this.$store.state.overData.title }}</div>
          </div>
        </div>
        <div class="liveCount">
          <p class="count">数据统计</p>
          <van-grid :column-num="3">
            <van-grid-item>
              <p class="title">直播时长</p>
              <p class="timers">{{ overData.liveTime }}</p>
            </van-grid-item>
            <van-grid-item>
              <p class="title">观看人数</p>
              <p class="timers">{{ overData.viewNum }}</p>
            </van-grid-item>
            <van-grid-item>
              <p class="title">直播收益</p>
              <p class="timers">{{ overData.amount }}</p>
            </van-grid-item>
          </van-grid>
        </div>
      </van-cell>
    </van-cell-group>
    <van-button type="primary" round @click="goDownload">查看详情</van-button>
  </div>
</template>

<script type="text/ecmascript-6">
import navBar from '@/components/NavBar/NavBar'
import { Dialog } from 'vant'
export default {
  name: 'liveOver',
  data() {
    return {
      starName: '直播已结束',
      overData: {},
      avatar: this.$store.state.avatar,
      userName: this.$store.state.overData.username,
      title: this.$store.state.overData.title,
      coverUrl: this.$store.state.overData.coverUrl,
    }
  },
  created() {
    this.getLiveOver()
  },
  mounted() {},
  computed: {},
  methods: {
    // 获取直播结束数据
    getLiveOver() {
      console.log(this.$store.state.lid)
      this.$spget(`/live/live/live/getLiveStopInfo/${this.$store.state.lid}`)
        .then((res) => {
          if (res.status == 200) {
            this.overData = res.data
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 去下载App
    goDownload() {
      Dialog.confirm({
        title: '提醒',
        message: `您可以通过手机应用商店
        立即下载安装体验~`,
        confirmButtonText: '马上下载',
        cancelButtonText: '残忍拒绝',
      })
        .then(() => {
          window.location.href =
            'https://sj.qq.com/myapp/detail.htm?apkName=com.tencent.now&info=825713A9F5A5C707929B0E06563A5F98'
        })
        .catch(() => {
          // on cancel
        })
    },
  },
  components: { navBar },
}
</script>

<style scoped lang="less">
　p {
  margin: 0;
}
.van-cell-group {
  // margin-top: 46px;
}
.van-card {
  background-color: #fff;
}
.liveinfo {
  display: flex;
  width: 100%;
  .left {
    flex: 3;
    img {
      width: 100%;
    }
  }
  .right {
    flex: 7;
    margin-left: 20px;
    .top {
      display: flex;
      margin-top: 10px;
      img {
        width: 30px;
        height: 30px;
        border-radius: 30px;
      }
      span {
        font-size: 24px;
        line-height: 30px;
      }
    }
    .bottom {
      margin-top: 10px;
      font-size: 24px;
    }
  }
}
.liveCount {
  text-align: center;
  font-size: 20px;
  .count {
    line-height: 50px;
  }
  .title {
    font-size: 14px;
  }
  .timers {
    font-size: 14px;
  }
}
.van-button {
  position: absolute;
  padding: 0 20px;
  bottom: 50px;
  right: 50%;
  transform: translateX(50%);
}
</style>
