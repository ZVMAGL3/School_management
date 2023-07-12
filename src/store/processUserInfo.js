import axios from 'axios'
import router from '@/router';

export default {
    namespaced: true,
    //数据存储
    state: () => ({
        userInfo:{
            userName:'',
            identity:'',
            account:'',
        },
        loginState:'jumpOver', //记录用户登录状态
        imagePath:'http://localhost:1023/defaultAvatar.jpg',
    }),
    mutations: {
        saveInfo(state,value){
            state.userInfo = value
            state.loginState = 'login' //检测用户登录状态
        },
        saveUserAvatar(state,value){
            state.imagePath = value
        }
    },
    actions:{
        //登录
		login(context,value){
            axios.post(`http://localhost:1023/login`,{
                data:{
                    loginInfo:value
                }
            }).then(
                response => {
                    if(response.data){
                        //存取数据
                        context.commit('saveInfo',response.data.userInfo)
                        context.dispatch('getUserAvatar')
                        //将数据保存到本地缓存中
                        sessionStorage.setItem('userInfo',JSON.stringify(response.data.userInfo))
                        sessionStorage.setItem('userInfoHash',response.data.userInfoHash)
                        router.push({
                            name:'personalPage',
                        }).catch(err => {err})
                    }else{
                        alert('账号或密码输入错误')
                    }
                },
                error => {
                    console.log('请求失败了',error.message)
                }
            )
		},
        //验证
        verify(context,value){
            return axios.post(`http://localhost:1023/verify`,{
                data:{
                    value
                }
            }).then(
                response => {
                    if(response.data){
                        //存取数据
                        context.commit('saveInfo',response.data.userInfo)
                        context.dispatch('getUserAvatar')
                        return true
                    }else{
                        return false
                    }
                },
                error => {
                    console.log('请求失败了',error.message)
                }
            )
        },
        //获取头像地址
        getUserAvatar(context){
            axios.post(`http://localhost:1023/getUserAvatar`,{
                data:{
                    account:context.state.userInfo.account
                }
            }).then(
                response => {
                    if(response.data){
                        //存取数据
                        context.commit('saveUserAvatar',response.data)
                    }
                },
                error => {
                    console.log('请求失败了',error.message)
                }
            )
        },
        //保存修改的头像
        saveAvatar(context,value){
            axios.post(`http://localhost:1023/saveAvatar`,{
                data:{
                    account:context.state.userInfo.account,
                    userAvatar:value
                }
            }).then(
                response => {
                    if(response.data){
                        context.commit('saveUserAvatar',response.data)
                    }
                },
                error => {
                    console.log('请求失败了',error.message)
                }
            )
        },
        changePassword(context,value){
            if(value.p_new !== value.p_copy){
                alert('两次输入密码不一致')
                return
            }else if(!/^[A-Za-z0-9!@#$%^&*]+$/.test(value.p_new)){
                alert('密码只能包含字母数字和特殊字符!')
                return
            }else if(value.p_new.length < 6 || value.p_new.length > 18){
                alert('密码长度要大于六位,小于八位')
                return
            }
            axios.post(`http://localhost:1023/changePassword`,{
                data:{
                    password:value,
                    account:context.state.userInfo.account
                }
            }).then(
                response => {
                    if(response.data){
                        alert('修改成功!')
                        router.push({
                            name:'personalPage',
                        }).catch(err => {err})
                    }else{
                        alert('密码修改失败,请重试')
                    }
                },
                error => {
                    console.log('请求失败了',error.message)
                }
            )
        }
	},
}