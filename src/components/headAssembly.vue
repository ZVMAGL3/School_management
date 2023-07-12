<template>
    <div class="topFrame">
        <div class="htmlname">智慧校园服务中心</div>
        <div class="spacer"></div>
        <div class="salutatory">你好,{{userName}}{{identity}}!</div>
        <div class="quit" @click="quit">退出</div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    export default {
        name:'headAssembly',
        computed:{
            ...mapState('processUserInfo',['userInfo']),
            userName(){
                if(!(this.userInfo.identity === 'admin')){
                    return this.userInfo.userName
                }else{
                    return undefined
                }
            },
            identity(){
                if(this.userInfo.identity === 'admin'){
                    return "管理员"
                }else if(this.userInfo.identity === 'teacher'){
                    return "老师"
                }else{
                    return "同学"
                }
            }
        },
        methods:{
            quit(){
                this.$router.replace({
                    name:'main',
                }).catch(err => {err})
            }
        }
    }
</script>

<style scoped>
    
    .topFrame{
        background-color: rgb(34, 38, 46);
        height:7vh ;
        display: flex;
        flex-direction: row;
        align-items:center; 
        color: white;
    }

    .htmlname{
        min-width:200px;
        color:darkcyan;
        margin-left: 20px;
        font-size: 25px;
        text-align: center;
    }

    .spacer{
        flex-grow: 1;
        min-width: 280px;
    }

    .salutatory{
        margin-right: 1vw;
        min-width:200px;
        font-size: 15px;
        text-align: center;
    }

    .quit{
        font-size: 15px;
        width: 7vw;
        min-width: 30px;
        text-align: center;
    }

    .quit:hover{
        color:royalblue;
        cursor:pointer;
        text-decoration: underline;
    }
</style>