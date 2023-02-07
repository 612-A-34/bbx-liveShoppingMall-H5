import axios from 'axios'
import { Toast } from 'vant'
import store from '@/store/index'
import router from '@/router/index'
import ascii from '@/utils/ascii.js'
import md5 from 'js-md5';

// 请求超时时间，10s
const requestTimeOut = 10 * 1000
const success = 200
    // 更换令牌的时间区间
const checkRegion = 5 * 60 * 1000
    // 提示信息显示时长
const messageDuration = 5 * 1000

// 系统全局请求对象
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: requestTimeOut,
    responseType: 'json',
    validateStatus(status) {
        return status === success
    }
})

// 请求拦截器
service.interceptors.request.use(
        // 请求md5加密
        function(config) {
            let data = {
                appkey: 'NZ7HPX90DDAJ9PPX',
                appid: 'bbx_bs_20210401111830',
                milliseconds: Date.now()
            }
            let mdData = ''
            if (config.url.indexOf('?') !== -1) {
                let arr = config.url.split('?')
                let getData = arr[arr.length - 1]
                if (getData.indexOf('&') !== -1) {
                    // 多个参数
                    getData = getData.split('&')
                    for (let i = 0; i < getData.length; i++) {
                        let newArr = getData[i].split('=')
                        if (newArr[1]) {
                            data[newArr[0]] = newArr[1]
                        }
                    }
                } else {
                    // 一个参数
                    getData = getData.split('=')
                        // 判断值不能为空
                    if (getData[1]) {
                        data[getData[0]] = getData[1]
                    }
                }
            }
            if (config.method == 'post' && config.headers['Content-Type'] == 'application/x-www-form-urlencoded') {
                for (let key in config.data) {
                    data[key] = config.data[key]
                }
                mdData = `${ascii(data)}`
                console.log(mdData, 888);
            } else {
                if (config.data) {
                    console.log(JSON.stringify(config.data));
                    mdData = `${ascii(data)}${JSON.stringify(config.data)}`
                    console.log(mdData, 111);
                } else {
                    mdData = `${ascii(data)}`
                }
            }
            config.headers.appid = 'bbx_bs_20210401111830'
            config.headers.milliseconds = data.milliseconds
            config.headers.signValue = md5(mdData)
                // console.log(mdData);
                // console.log(config);
                // loading
            // store.commit('showLoading')

            // 无需token可浏览
            if (
                // 商品详情
                config.url.indexOf('/mall/goodsDetail/shareGoodsDetail') !== -1 ||
                // 直播
                config.url.indexOf('live/getAppLivePageResById') !== -1 ||
                // 直播结束
                config.url.indexOf('/live/live/live/getLiveStopInfo') !== -1 ||
                // 发送验证码
                config.url.indexOf('/auth/sms/captcha') !== -1 ||
                // 验证码比对
                config.url.indexOf('/auth/share/app/weixin/login') !== -1 ||
                // 获取企业id
                config.url.indexOf('/auth/share/wx/getSecret') !== -1 ||
                // 获取直播间观看人数
                config.url.match(/\/live\/live\/live\/\d+/g) != null
            ) {
                // console.log(config, 'wutoken请求');
                return config
            } else {
                const token = window.sessionStorage.getItem('token')
                if (token) {
                    // 在请求头中添加token
                    config.headers.Authorization = `bearer ${token}`
                } else {
                    router.push('/bindPhone')
                }
                // console.log(config, '请求');
                return config
            }
        },
        function(error) {
            // store.commit('hideLoading')
            // 请求发送失败
            return Promise.reject(error)
        }
    )
    // 响应拦截器
service.interceptors.response.use(
    function(response) {
        // store.commit('hideLoading')
        // 请求成功，处理响应数据
        return response
    },
    function(error) {
        store.commit('hideLoading')
        if (error.response) {
            const errorMessage =
                error.response.data === null ?
                '系统内部异常，请联系网站管理员' :
                error.response.data.message
            switch (error.response.status) {
                case 400:
                    Toast({
                        message: error.response.data.message,
                        type: 'error',
                        duration: messageDuration
                    })
                    break
                case 404:
                    Toast({
                        message: '很抱歉，资源未找到',
                        type: 'error',
                        duration: messageDuration
                    })
                    break
                case 403:
                    Toast({
                        message: '很抱歉，您暂无该操作权限',
                        type: 'error',
                        duration: messageDuration
                    })
                    break
                case 401:
                    Toast({
                        message: '暂未绑定手机号，仅可浏览',
                        type: 'error',
                        duration: messageDuration
                    })
                    break
                case 500:
                    Toast({
                        message: '服务器内部错误',
                        type: 'error',
                        duration: messageDuration
                    })
                    break
                case 700:
                    Toast({
                        message: error.response.data.message,
                        type: 'error',
                        duration: messageDuration
                    })
                    break
                default:
                    if (errorMessage === 'refresh token无效') {
                        this.$dialog
                            .confirm({
                                title: '温馨提示',
                                message: '登录已过期，请重新登录'
                            })
                            .then(() => {
                                // on confirm
                            })
                            .catch(() => {
                                // on cancel
                            })
                    }
                    break
            }
        }
    }
)

function tansParams(params) {
    let result = ''
    Object.keys(params).forEach(key => {
        if (!Object.is(params[key], undefined) && !Object.is(params[key], null)) {
            result +=
                encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&'
        }
    })
    return result
}

const request = {
    spget(url) {
        return service.get(`${url}`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
    },
    get(url, params) {
        return service.get(`${url}${params}`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
    },
    newGet(url, params) {
        return service.get(`${url}?${params}`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
    },
    post(url, params) {
        return service.post(url, params, {
            transformRequest: [
                params => {
                    return tansParams(params)
                }
            ],
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
    },
    newPost(url, params) {
        return service.post(url, params, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        })
    },
    delete(url, id) {
        return service.delete(`${url}${id}`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
    },
    put(url, params) {
        return service.put(url, params, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },
    putdx(url) {
        return service.put(url, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
    }
}

export default request
