<template>
    <div class="menu-box">
        <div class="menu">
            <!-- 侧边栏的标题 开始-->
            <div class="menu-title">
                <h1>Menu</h1>
            </div>

            <!-- 一级导航 -->
            <div class="menu-item" v-for="(element,index) in menuBar" :key="index" >
                <input type="checkbox" :id="`menu-item${index}`">
                <label :for="`menu-item${index}`" @click="reviseCache(index)">
                    <i :class="element[0][1]"></i>
                    <span>{{ element[0][0] }}</span>
                    <i class="iconfont icon-down" :style="{transform: `rotate(${MenuItemStatus[index]?180:360}deg)`}"></i>
                </label>
                <!-- 二级导航 -->
                <div class="menu-content" :style="MenuItemStatus[index] ? {'height': element[1].length * 40 + 'px'} : {'height': 0 + 'px'}">
                    <span
                        class="drawerSon"
                        v-for="son in element[1]" 
                        :key="son[0]" 
                        @click="routerContentDisplay(son[1])"
                    >
                        {{ son[0] }}
                    </span>
                </div>
            </div>

            <div class="set-line"></div>

            <div class="menu-item">
                <label>
                    <i class="menu-item-icon iconfont icon-a-08-shezhi"></i>
                    <span @click="routerContentDisplay('modifySettings')">设置</span>
                </label>
            </div>
        </div>
    </div>
</template>

<script>
	import {mapGetters} from 'vuex'
    export default {
        name:'NavigationBar',
        data(){
            return {
                MenuItemStatus:[], //二级导航栏开启状态
                cache:0, //存储上一次点击的导航栏索引号
            }
        },
        methods:{
            //调用内容区函数
            routerContentDisplay(address){
                if(address === "homePage"){
                    const account = this.$store.state.processUserInfo.userInfo.account
                    this.$router.replace({
                        name:address,
                        params:{
                            account
                        }
                    }).catch(err => {err})
                }else{
                    this.$router.replace({
                        name:address,
                    }).catch(err => {err})
                }
            },
            //控制二级导航栏开启状态,保证只有新点击的导航栏是出于开启状态,或者全部关闭
            reviseCache(index){
                this.MenuItemStatus.splice(index,1,!this.MenuItemStatus[index])
                if(this.cache !== index){
                    this.MenuItemStatus.splice(this.cache,1,false)
                }
                this.cache=index
            },
        },
        computed:{
            //获取导航栏的框架
            ...mapGetters('InitializationData',['menuBar']),
        },
        mounted(){
            //初始化导航栏
            for(let i = 0; i < this.menuBar.length; i++) {
                this.MenuItemStatus.push(false)
            }
            this.cache = sessionStorage.getItem('cache')
            //校验缓存里的状态数值
            if(this.cache < 0 || this.cache >= this.menuBar.length){
                this.cache = 0
            }
            this.MenuItemStatus.splice(this.cache,1,true)
        },
        updated(){
            //将导航栏的状态存储
            sessionStorage.setItem('cache',this.cache)
        }
    }
</script>

<style scoped>
    @import '../css/iconfont.css';
    @import '../css/index.css';
</style>