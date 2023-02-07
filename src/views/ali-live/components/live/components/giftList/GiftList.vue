<template>
  <div class="shade" @click.stop="giftListHide">
    <div class="userGiftList" @click.stop="stopMop">
      <van-swipe class="my-swipe" indicator-color="white" :loop="false">
        <van-swipe-item>
          <van-grid :border="false" :column-num="4" :gutter="10" center>
            <van-grid-item v-for="item in resGiftList" :key="item.id">
              <van-image src="http://prod.xiaonu123.com/tool/liveGift/kiss_2.png" />
              <p class="giftName">1</p>
              <p class="giftMuch">{{money}}金币</p>
            </van-grid-item>
          </van-grid>
        </van-swipe-item>
        <van-swipe-item>
          <van-grid :border="false" :column-num="4">
            <van-grid-item>
              <van-image src="https://img01.yzcdn.cn/vant/apple-1.jpg" />
              <p class="giftName">穿云箭</p>
              <p class="giftMuch">20金币</p>
            </van-grid-item>
          </van-grid>
        </van-swipe-item>
      </van-swipe>
      <div class="utils">
        <div class="utilsBox">
          <button>连击打赏</button>
          <div class="money">
            <img src="@/assets/live_gift.png" />
            <p class="myMoney">20</p>
            <p>></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'userGiftList',
  props: {
    // 礼物
    resGiftList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      // 默认选中第一项
      active: 0,

      money: 29,
    }
  },
  created() {
  },
  mounted() {},
  computed: {},
  methods: {
    giftListHide() {
      this.$emit('giftListHide')
    },
    // 阻止冒泡
    stopMop() {},
  },
  components: {},
}
</script>

<style scoped lang="less">
p {
  margin: 0;
  font-size: 11px;
}
.shade {
  position: relative;
  height: 100vh;
  width: 100vw;
  .userGiftList {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 260px;
    background-color: #222228;
  }
  .my-swipe {
    height: 80%;
    background-color: #222228;

    // 礼物格子的背景色
    /deep/ .van-grid-item__content {
      background-color: #222228;
      .van-image {
        width: 60px;
        height: 58px;
      }
      .giftName {
        color: #fff;
      }
      .giftMuch {
        color: #6b6b6b;
      }
    }
  }
  .utils {
    height: 20%;
    float: right;
    margin-right: 14px;
    .utilsBox {
      margin-top: 10px;
      display: flex;
      button {
        width: 80px;
        height: 30px;
        font-size: 13px;
        border: none;
        color: #fff;
        background: linear-gradient(0deg, #ff4432, #ff2a43);
        border-radius: 15px;
        margin-right: 12px;
      }
      .money {
        color: #fff;
        display: flex;
        line-height: 30px;
        margin-top: 3px;
        img {
          width: 23px;
          height: 23px;
          vertical-align: middle;
          margin-right: 10px;
        }
        p {
          font-size: 18px;
          margin-right: 4px;
        }
      }
    }
  }
}
</style>
