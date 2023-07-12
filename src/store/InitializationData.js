export default {
    namespaced: true,
    //数据存储
    state: () => ({
        frameInfo:[
            [['个人信息','el-icon-s-custom'],[['个人主页','homePage'],['账号管理','accountManage']]],
            [['考试相关','el-icon-date'],[['成绩查询','resultInquiry'],['考试报名','examRegistration'],['报名信息','registerInfo']]],
            [['其他','el-icon-connection'],[['留言板','messageBoard'],['建议&咨询','proposeConsult'],]],
            [['考试相关','el-icon-date'],[['成绩录入&查询','resultInquiry'],['报名信息','registerInfo'],]],
            [['其他','el-icon-connection'],[['留言板','messageBoard'],['查看建议&咨询','proposeConsult'],]],
        ],
    }),
	getters:{
        //根据不同的身份返回各自的导航栏框架
		menuBar(state,getters,rootState){
			var identity = rootState.processUserInfo.userInfo.identity
            if(identity === 'admin'){
                return state.frameInfo
            }else if(identity === 'teacher'){
                return [state.frameInfo[0]].concat(state.frameInfo.slice(3,5))
            }else{
                return state.frameInfo.slice(0,3)
            }
		}
	},
}
