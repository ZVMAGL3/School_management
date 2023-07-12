//该文件专门用于创建整个应用的路由器
import VueRouter from 'vue-router'

import store from '../store';
//引入组件
import main from '../pages/main'
import personalPage from '../pages/personalPage'

import homePage from '../pages/contentDisplay/homePage/homePage'
import accountManage from '../pages/contentDisplay/accountManage'
import resultInquiry from '../pages/contentDisplay/resultInquiry/resultInquiry'
import examRegistration from '../pages/contentDisplay/examRegistration'
import registerInfo from '../pages/contentDisplay/registerInfo'
import messageBoard from '../pages/contentDisplay/messageBoard/messageBoard'
import proposeConsult from '../pages/contentDisplay/proposeConsult'
import modifySettings from '../pages/contentDisplay/modifySettings'

//创建并暴露一个路由器
const router = new VueRouter({
    routes:[
        {
            path:'/',
            redirect:'main', 
        },
        {
            path:'/main',
            name:'main',
            component:main
        },
        {
            path:'/personalPage',
            name:'personalPage',
            component:personalPage,
			//路由守卫
			beforeEnter: (to, from, next) => {
				if(store.state.processUserInfo.loginState === 'jumpOver'){
					try {
						var account = JSON.parse(sessionStorage.getItem('userInfo')).account
						var userInfoHash = sessionStorage.getItem('userInfoHash')
						store.dispatch('processUserInfo/verify',{account,userInfoHash}).then((value) => {
							if(value){
								next()
							}else{
								sessionStorage.clear()
								next('/')
							}
						})
					} catch (e) {
						// console.log(e)
						sessionStorage.clear()
						next('/')
					}
				}else{
					next()
				}
			},
            redirect: () => {
				// 获取参数
				const account = store.state.processUserInfo.userInfo.account 
				// 重定向并传参
				return { name: 'homePage', params: { account } }
			}, 
            children:[
				{
					path:'homePage/:account',
                    name:'homePage',
					component:homePage,
					beforeEnter: (to, from, next) => {
						store.dispatch('homePage/homePageInitialization',to.params.account).then(() => {
							next()
						})
					}
				},
				{
					path:'accountManage',
                    name:'accountManage',
					component:accountManage,
				},
				{
					path:'resultInquiry',
                    name:'resultInquiry',
					component:resultInquiry,
					beforeEnter: (to, from, next) => {
						store.dispatch('resultsProcessing/resultInquiry','').then(() => {
							next()
						})
					}
				},
				{
					path:'examRegistration',
                    name:'examRegistration',
					component:examRegistration,
				},
				{
					path:'registerInfo',
                    name:'registerInfo',
					component:registerInfo,
				},
				{
					path:'messageBoard',
                    name:'messageBoard',
					component:messageBoard,
					beforeEnter: (to, from, next) => {
						store.dispatch('messageBoard/readMessage').then(() => {
							next()
						})
					}
				},
				{
					path:'proposeConsult',
                    name:'proposeConsult',
					component:proposeConsult,
				},
				{
					path:'modifySettings',
                    name:'modifySettings',
					component:modifySettings,
				},
            ]
        },

    ]
})

router.beforeEach((to,from,next)=>{
	console.log(to,from)
	if ((to.path === '/personalPage/homePage') && !to.params.account) {
		const account = store.state.processUserInfo.userInfo.account
		next(`/personalPage/homePage/${account}`)
		return
	} else {
		next()
	}
	// next()
})

export default router