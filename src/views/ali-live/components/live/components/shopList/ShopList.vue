<template>
  <!-- @click.stop="shopListHide" -->
  <div class="shopList">
    <van-action-sheet v-model="show">
      <van-list v-model="loading" :finished="finished">
        <!-- v-for="item in shopList" :key="item.id" -->
        <van-cell title="请选择商品下单" class="shopListTitle" />
        <van-cell class="noGoods" v-if="resShopList.length == 0">暂无带货商品</van-cell>
        <van-cell is-link v-for="item in resShopList" :key="item.bringId">
          <van-card
            :price="item.retailPrice"
            :desc="item.specName"
            :title="item.goodsName"
            :thumb="item.galleryUrl"
            @click="goShoping(item, $event)"
          />
        </van-cell>
      </van-list>
    </van-action-sheet>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'userShopList',
  props: {
    // 商品列表
    resShopList: {
      type: Array,
      required: true,
    },
     //
    lid: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      show: false,
      // 是否在加载状态
      loading: true,
      // 是否加载完毕
      finished: true,
      goShopingBtn: true,
      firstLive: null,
    }
  },
  created() {
    if (this.getQuery('firstLive')) {
      this.firstLive = this.getQuery('firstLive')
    } 
  },
  mounted() {},
  computed: {},
  methods: {
    // 取url中的参数值
    getQuery(name) {
        // 正则：[找寻'&' + 'url参数名字' = '值' + '&']（'&'可以不存在）
        let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        let r = window.location.search.substr(1).match(reg);
        console.log(r);
        if(r != null) { // 对参数值进行解码
            return decodeURIComponent(r[2]);
        }
        return null;
    },
    // 父组件触发
    shopIsShow() {
      this.show = true
    },
    // 去商品详情
    goShoping(item) {
      if(this.goShopingBtn){
        this.goShopingBtn = false;
        setTimeout(function() {
          this.goShopingBtn = true;
        }, 2000);//一秒内不能重复点击
        this.$store.commit('changeOrderType', '2')
        this.$store.commit('changeGoodsDetail', {
          bringId: item.bringId,
          id: item.goodsId,
        })
        let that = this
        jWeixin.miniProgram.getEnv(function(res) {  
          that.goShopingBtn = true;
          jWeixin.miniProgram.navigateTo({  
            url: `/secondLevel/commodityDetails/commodityDetails?sid=${item.goodsId}&specId=${item.specId}&bringId=${item.bringId}&judge_live=2&lid=${that.lid}&title=${item.goodsName}` 
          }) 
        })
      }
      
      // wx.miniProgram.navigateTo({
	    //   url: `../secondLevel/commodityDetails/commodityDetails?sid=${item.goodsId}&specId=${item.specId}&bringId=${item.bringId}&judge_live=2`,
      //   success: res => {},fail: () => {},complete: () => {}
      // });
    },
  },
  components: {},
}
</script>

<style scoped lang="less">
p {
  margin: 0;
  font-size: 11px;
}
.shopList {
  // position: relative;
  // height: 100vh;
  // width: 100vw;
  .shopListTitle {
    color: #222;
  }
  .van-card {
    background-color: #fff;
  }
}
.van-cell__left-icon,
.van-cell__right-icon {
  line-height: 48px;
}
.noGoods .van-cell__value--alone {
  text-align: center;
  line-height: 100px;
}
</style>
