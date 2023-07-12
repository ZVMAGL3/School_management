//该文件用于创建Vuex中最为核心的store

//引入Vue
import Vue from 'vue'
//引入Vuex
import Vuex from 'vuex'

import processUserInfo from './processUserInfo'
import InitializationData from './InitializationData'
import resultsProcessing from './resultsProcessing'
import homePage from './homePage'
import messageBoard from './messageBoard'

//应用vuex插件
Vue.use(Vuex)

//创建并导出store
export default new Vuex.Store({
    modules:{
        processUserInfo,InitializationData,resultsProcessing,homePage,messageBoard,
    }
})