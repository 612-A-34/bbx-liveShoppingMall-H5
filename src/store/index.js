import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        times: JSON.parse(window.sessionStorage.getItem('times')) || null,
        // 用户加入聊天UID
        uid: JSON.parse(window.sessionStorage.getItem('uid')) || null,

        // 主播头像
        avatar: JSON.parse(window.sessionStorage.getItem('avatar')) || null,

        // 当前选中地址的 id
        chosenAddressId: JSON.parse(window.sessionStorage.getItem('chosenAddressId')) || null,

        // 商品类型
        orderType: JSON.parse(window.sessionStorage.getItem('orderType')) || '1',

        // 直播间ID
        lid: JSON.parse(window.sessionStorage.getItem('lid')) || null,

        // 直播带货表ID
        bringId: JSON.parse(window.sessionStorage.getItem('bringId')) || null,

        // 更改支付下单地址
        address: JSON.parse(window.sessionStorage.getItem('address')) || null,

        // 商品详情调用接口所需数据
        goodsDetail: JSON.parse(window.sessionStorage.getItem('goodsDetail')) || null,

        // 立即购买后所需数据
        goPayData: JSON.parse(window.sessionStorage.getItem('goPayData')) || null,

        // 立即购买成功返回邮费等信息
        paySuccess: JSON.parse(window.sessionStorage.getItem('paySuccess')) || null,

        // 邮费
        postage: JSON.parse(window.sessionStorage.getItem('postage')) || null,

        // loading
        LOADING: false,

        // 聊天组件chatId
        chatId: JSON.parse(window.sessionStorage.getItem('chatId')) || null,

        // 聊天组件chatId
        overData: JSON.parse(window.sessionStorage.getItem('overData')) || null,

        // 用户绑定手机所需要信息登录所需信息
        getToken: JSON.parse(window.sessionStorage.getItem('getToken')) || null,
        // 绑定手机号
        phoneNum: JSON.parse(window.sessionStorage.getItem('phoneNum')) || null,
        // 添加标识，为绑定手机号跳转
        whereAddr: JSON.parse(window.sessionStorage.getItem('whereAddr')) || null,
        // 导航栏是否显示
        isWechatShow: JSON.parse(window.sessionStorage.getItem('isWechatShow')) || false,
        // 下单订单ID
        orderId: JSON.parse(window.sessionStorage.getItem('orderId')) || null,
        // 推广码
        tgCode: JSON.parse(window.sessionStorage.getItem('tgCode')) || null,
        // 商铺ID
        // shopId: JSON.parse(window.sessionStorage.getItem('shopId')) || null,
        // 商铺名称
        // shopName: JSON.parse(window.sessionStorage.getItem('shopName')) || null,

    },
    mutations: {
        changeGetToken(state, getToken) {
            state.getToken = getToken
            window.sessionStorage.setItem('getToken', JSON.stringify(getToken))
        },
        // changeShopName(state, shopName) {
        //   state.shopName = shopName
        //   window.sessionStorage.setItem('shopName', JSON.stringify(shopName))
        // },
        // changeShopId(state, shopId) {
        //   state.shopId = shopId
        //   window.sessionStorage.setItem('shopId', JSON.stringify(shopId))
        // },
        changeTgCode(state, tgCode) {
            state.tgCode = tgCode
            window.sessionStorage.setItem('tgCode', JSON.stringify(tgCode))
        },
        changeTimes(state, times) {
            state.times = times
            window.sessionStorage.setItem('times', JSON.stringify(times))
        },
        changeOrderId(state, orderId) {
            state.orderId = orderId
            window.sessionStorage.setItem('orderId', JSON.stringify(orderId))
        },
        changeIsWechatShow(state, isWechatShow) {
            state.isWechatShow = isWechatShow
            window.sessionStorage.setItem(
                'isWechatShow',
                JSON.stringify(isWechatShow)
            )
        },
        changeWhereAddr(state, whereAddr) {
            state.whereAddr = whereAddr
            window.sessionStorage.setItem('whereAddr', JSON.stringify(whereAddr))
        },
        changeOverData(state, overData) {
            state.overData = overData
            window.sessionStorage.setItem('overData', JSON.stringify(overData))
        },
        changeChatId(state, chatId) {
            state.chatId = chatId
            window.sessionStorage.setItem('chatId', JSON.stringify(chatId))
        },
        showLoading(state) {
            state.LOADING = true
        },
        hideLoading(state) {
            state.LOADING = false
        },
        changeAvatar(state, avatar) {
            state.avatar = avatar
            window.sessionStorage.setItem('avatar', JSON.stringify(avatar))
        },
        changeUid(state, uid) {
            state.uid = uid.toString()
            window.sessionStorage.setItem('uid', JSON.stringify(uid))
        },
        changeChosenAddressId(state, chosenAddressId) {
            state.chosenAddressId = chosenAddressId
            window.sessionStorage.setItem(
                'chosenAddressId',
                JSON.stringify(chosenAddressId)
            )
        },
        changeOrderType(state, orderType) {
            state.orderType = orderType
            window.sessionStorage.setItem('orderType', JSON.stringify(orderType))
        },
        changeLid(state, lid) {
            state.lid = lid
            window.sessionStorage.setItem('lid', JSON.stringify(lid))
        },
        changeBringId(state, bringId) {
            state.bringId = bringId
            window.sessionStorage.setItem('bringId', JSON.stringify(bringId))
        },
        changeAddress(state, address) {
            state.address = address
            window.sessionStorage.setItem('address', JSON.stringify(address))
        },
        changeGoodsDetail(state, goodsDetail) {
            state.goodsDetail = goodsDetail
            window.sessionStorage.setItem('goodsDetail', JSON.stringify(goodsDetail))
        },
        changeGoPayData(state, goPayData) {
            state.goPayData = goPayData
            window.sessionStorage.setItem('goPayData', JSON.stringify(goPayData))
        },
        changePaySuccess(state, paySuccess) {
            state.paySuccess = paySuccess
            window.sessionStorage.setItem('paySuccess', JSON.stringify(paySuccess))
        },
        changePostage(state, postage) {
            state.postage = postage
            window.sessionStorage.setItem('postage', JSON.stringify(postage))
        },
        changePhoneNum(state, phoneNum) {
            state.phoneNum = phoneNum
            window.sessionStorage.setItem('phoneNum', JSON.stringify(phoneNum))
        }
    },
    actions: {},
    modules: {}
})
