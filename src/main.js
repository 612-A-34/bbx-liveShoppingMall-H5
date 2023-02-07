/* eslint-disable import/first */
/* eslint-disable import/no-duplicates */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import { isIOS, wxRegister } from '@/utils/wxshare.js'

// 时间戳转化时间格式
// 全局定义格式化时间过滤器,叫做dateFormat
Vue.filter('dateFormat', function(originVal) {
    const dt = new Date(originVal)

    // y 年 m 月 d 日 hh小时 mm分钟 ss 秒
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')

    return `${mm}:${ss}`
})

// Vant框架
// import Vant from 'vant'
import 'vant/lib/index.css'
// 轮播图图片懒加载
import { Lazyload } from 'vant'
// 轻提示
import { Toast } from 'vant'
import { Notify } from 'vant'
import { NavBar } from 'vant'
import { Swipe, SwipeItem } from 'vant'
import { Step, Steps } from 'vant'
import { Cell, CellGroup } from 'vant'
import { Sku } from 'vant'
import { ActionSheet } from 'vant'
import { Tab, Tabs } from 'vant'
import { SubmitBar } from 'vant'
import { Button } from 'vant'
import { List } from 'vant'
import { Card } from 'vant'
import { AddressEdit } from 'vant'
import { AddressList } from 'vant'
import { CountDown } from 'vant'
import { Grid, GridItem } from 'vant'
import { Field } from 'vant'
import { PasswordInput, NumberKeyboard } from 'vant'
import { Tag } from 'vant'
import { Icon } from 'vant'
import { SwipeCell } from 'vant'
import { PullRefresh } from 'vant'
import { Dialog } from 'vant'
import { RadioGroup, Radio } from 'vant'
import { Stepper } from 'vant'
import { Popup } from 'vant'
import { Uploader } from 'vant'
import { Checkbox, CheckboxGroup } from 'vant'
import { GoodsAction, GoodsActionIcon, GoodsActionButton } from 'vant'

Vue.use(GoodsAction)
Vue.use(GoodsActionButton)
Vue.use(GoodsActionIcon)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
import { Image as VanImage } from 'vant';

Vue.use(PullRefresh)
Vue.use(SwipeCell)
Vue.use(Icon)
Vue.use(Tag)
Vue.use(PasswordInput)
Vue.use(NumberKeyboard)
Vue.use(Field)
Vue.use(Grid)
Vue.use(GridItem)
Vue.use(CountDown)
Vue.use(AddressList)
Vue.use(AddressEdit)
Vue.use(Card)
Vue.use(List)
Vue.use(Button)
Vue.use(SubmitBar)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(ActionSheet)
Vue.use(Sku)
Vue.use(Cell)
Vue.use(CellGroup)
Vue.use(Swipe)
Vue.use(SwipeItem)
Vue.use(NavBar)
Vue.use(Step)
Vue.use(Steps)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Stepper)
Vue.use(Popup)
Vue.use(Uploader)

Vue.use(Dialog)
    // Vue.use(Vant)
Vue.use(Notify)
Vue.use(Lazyload)
Vue.use(Toast)
    // 适配
Vue.use(VanImage)
    // 适配
    // 适配
import 'amfe-flexible'
import './utils/rem'


// axios
import $http from './utils/axios'
import 'mui-player/dist/mui-player.min.css'
import MuiPlayer from 'mui-player'
// import MuiPlayerMobilePlugin from 'mui-player-mobile-plugin'

// 全局css样式
import '@/assets/css/glob.css'

import request from './utils/axios'
Vue.prototype.$get = request.get
Vue.prototype.$newGet = request.newGet
Vue.prototype.$post = request.post
Vue.prototype.$newPost = request.newPost
Vue.prototype.$delete = request.delete
Vue.prototype.$put = request.put
Vue.prototype.$spget = request.spget

Vue.prototype.$MuiPlayer = MuiPlayer
// Vue.prototype.$MuiPlayerMobilePlugin = MuiPlayerMobilePlugin

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
    // 动态title
    const title = to.meta.title
    if (title) {
        document.title = title
    }
    next()
})

new Vue({
    $http,
    router,
    store,
    render: h => h(App)
}).$mount('#app')
