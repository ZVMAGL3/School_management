import axios from 'axios'
import router from '@/router';
export default {
    namespaced: true,
    //数据存储
    state: () => ({
        storehouse:[
            {
                signature:'',
                emaliAddress:'',
                selfIntroduction:'',
                campusExperience:'',
            }
        ],
        identity:'tourists',
        userName:'',
        homePageInfo:{},
        homePageInfoEdit:{},
        userImagePath:'http://localhost:1023/defaultAvatar.jpg',
    }),
    mutations: {

        //确定身份
        identityRegistration(state,value){
            state.identity = value
        },

        saveUserName(state,value){
            state.userName = value
        },

        saveHomePageInitializationResult(state,value){
            state.homePageInfo = JSON.parse(JSON.stringify(value))
            state.homePageInfoEdit = JSON.parse(JSON.stringify(value))
        },

        signatureAlter(state,value){
            state.homePageInfoEdit.signature = value
        },
        emaliAddressAlter(state,value){
            state.homePageInfoEdit.emaliAddress = value
        },
        selfIntroductionAlter(state,value){
            state.homePageInfoEdit.selfIntroduction = JSON.parse(JSON.stringify(value))
        },
        campusExperienceAlter(state,value){
            state.homePageInfoEdit.campusExperience = JSON.parse(JSON.stringify(value))
        },

        //取消
        cancelHomePageInfo(state){
            state.homePageInfoEdit = JSON.parse(JSON.stringify(state.homePageInfo))
        },

        //存储头像文件
        saveImagePath(state,userImagePath){
            state.userImagePath = userImagePath
        },


    },
    actions:{
        //初始化
        homePageInitialization(context,account){
            let local = context.rootState.processUserInfo.userInfo.account

            //身份认定
            if(local === account){
                context.commit('identityRegistration','self')
            }else{
                context.commit('identityRegistration','tourists')
            }
            axios.post(`http://localhost:1023/homePageInitialization`,{
                data:{
                    account,
                }
            }).then(
                response => {
                    if(response.data.userName){
                        context.commit('saveUserName',response.data.userName)
                    }else{
                        router.push({
                            name:'personalPage',
                        }).catch(err => {err})
                        return
                    }
                    if(response.data.homePageInfo){
                        //存取数据
                        context.commit('saveHomePageInitializationResult',response.data.homePageInfo)
                        // console.log('saveHomePageInitializationResult',response.data)
                    }else{
                        //默认数据
                        context.commit('saveHomePageInitializationResult',context.state.storehouse[0])
                    }
                    //头像地址
                    if(response.data.userImagePath){
                        context.commit('saveImagePath',response.data.userImagePath)
                    }
                },
                error => {
                    console.log('请求失败了',error.message)
                }
            )
        },
        //保存修改
        saveHomePageInfo(context){
            axios.post(`http://localhost:1023/saveHomePageInfo`,{
                data:{
                    homePageInfo:context.state.homePageInfoEdit,
                    account:context.rootState.processUserInfo.userInfo.account,
                }
            }).then(
                response => {
                    if(response.data){
                        context.commit('saveHomePageInitializationResult',context.state.homePageInfoEdit)
                    }
                },
                error => {
                    console.log('请求失败了',error.message)
                }
            )
        },
        //保存头像
        saveAvatar(context,value){
            axios.post(`http://localhost:1023/saveAvatar`,{
                data:{
                    account:context.rootState.processUserInfo.userInfo.account,
                    userAvatar:value
                }
            }).then(
                response => {
                    if(response.data){
                        context.commit('saveImagePath',response.data)
                    }
                },
                error => {
                    console.log('请求失败了',error.message)
                }
            )
        },
	},
}
