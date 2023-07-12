import axios from 'axios'
import Vue from 'vue';  
export default {
    namespaced: true,
    //数据存储
    state: () => ({
        messageData:[],
        temporaryComments:[],
        comments:[],
        startId:18446744073709551615,
        remaining:true, //记录还有没有留言未加载
    }),
    mutations: {
        saveUserAvatar(state,value){
            state.messageData = state.messageData.concat(value.messageData)
            state.startId = value.startId
            state.temporaryComments = state.temporaryComments.concat(value.temporaryComments)
            console.log(value.temporaryComments)
        },
        handleSaveEvents(state,value){
            state.startId = value+1
        },
        initializeMessageBoard(state){
            state.messageData = []
            state.temporaryComments = []
            state.comments = []
        },
        //记录是否还可以继续加载
        changeRemainingState(state,value){
            state.remaining = value
        },
        SaveComment(state,value){
            Vue.set(state.comments, value.id, value.comment)
            console.log(state.comments)
        }
    },
    actions:{
        //读取留言信息
        readMessage(context){
            if(context.state.remaining){
                axios.post(`http://localhost:1023/readMessage`,{
                    data:{
                        startId:context.state.startId
                    }
                }).then(
                    response => {
                        if(response.data){
                            context.commit('saveUserAvatar',response.data)
                            if(!response.data.startId){
                                context.commit('changeRemainingState',false)
                            }
                        }
                    },
                    error => {
                        console.log('请求失败了',error.message)
                    }
                )
            }
        },

        //保存发布的留言
        saveMessage(context,value){
            axios.post(`http://localhost:1023/saveMessage`,{
                data:{
                    account:context.rootState.processUserInfo.userInfo.account,
                    userMessage:value,
                }
            }).then(
                response => {
                    if(response.data){
                        context.commit('changeRemainingState',true)
                        context.commit('handleSaveEvents',response.data.startId)
                        context.commit('initializeMessageBoard')
                        context.dispatch('readMessage')
                    }
                },
                error => {
                    console.log('请求失败了',error.message)
                }
            )
        },

        saveComment(context,value){
            axios.post(`http://localhost:1023/saveComment`,{
                data:{
                    account:context.rootState.processUserInfo.userInfo.account,
                    userComment:value.userComment,
                    id:value.id,
                    replyTo:value.replyTo
                }
            }).then(
                response => {
                    if(response.data){
                        context.commit('SaveComment',{comment:response.data,id:value.id})
                    }
                },
                error => {
                    console.log('请求失败了',error.message)
                }
            )
        },

        viewAll(context,id){
            axios.post(`http://localhost:1023/viewAll`,{
                data:{
                    id
                }
            }).then(
                response => {
                    if(response.data){
                        context.commit('SaveComment',{comment:response.data,id})
                    }
                },
                error => {
                    console.log('请求失败了',error.message)
                }
            )
        }
	},
}