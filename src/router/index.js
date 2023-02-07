import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: { name: 'aliLive' }
    },
    {
        path: '',
        redirect: { name: 'aliLive' }
    },
    {
        path: `/aliLive`,
        name: 'aliLive',
        // component: resolve => require(['@/views/ali-live/ali-live.vue'], resolve),
        component: () => import('@/views/ali-live/ali-live.vue'), // 降低打包大小
        meta: { title: 'live' }
    }
]

const router = new VueRouter({
    base: '/bbx-h5',
    mode: 'history',
    routes
})


export default router
