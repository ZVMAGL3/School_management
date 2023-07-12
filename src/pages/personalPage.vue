<template>
    <div class="content">
        <div class="top">
            <headAssembly/>
        </div>
        <div class="bottom">
            <div class="NavigationBar">
                <NavigationBar/>
            </div>
            <div class="exhibit">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
	// import {mapState,mapGetters} from 'vuex'
    import NavigationBar from '../components/NavigationBar'
    import headAssembly from '../components/headAssembly'
    export default {
        name: 'personalPage',
        components:{NavigationBar,headAssembly},
    }
</script>

<style scoped>

    .content {
        background-color: #e7e7e7;
        height: 100vh;
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .top{
        width:100%;
        height: 7vh;
    }

    .bottom{
        height: 93vh;
        display: flex;
        flex-direction: row;
        background-color: rgb(255, 255, 255);
    }
    
    .NavigationBar{
        height: 100%;
    }

    .exhibit{
        flex:1;
        height: 93vh;
        display: flex;
        padding:0;
        overflow:auto;
    }
    
    .internal{
        flex-basis: 60%;
        margin: auto;
        margin-top: 8vh;
    }

</style>