import axios from 'axios'
export default {
    namespaced: true,
    //数据存储
    state: () => ({
        result:[],
        resultEdit:[],
        changedDataIndexes:new Set(), //记录修改的数据的索引值
        th:['姓名','学号','语文成绩','数学成绩','英语成绩'],
        rowName:['userName','account','chineseScore','mathScore','englishScore']
    }),
    mutations: {
        //存放从数据库获取到的数据
        saveResult(state,value){
            state.result = JSON.parse(JSON.stringify(value))
            state.resultEdit = JSON.parse(JSON.stringify(value))
        },
        //存储编辑的数据
        setResultEditValue(state,[rowIndex,cellIndex,value]){
            state.resultEdit[rowIndex][state.rowName[cellIndex]]=value
            state.changedDataIndexes.add(rowIndex)
        },
        //保存修改
        reviseResult(state){
            state.result = JSON.parse(JSON.stringify(state.resultEdit))
            state.changedDataIndexes.clear()
        },
        //取消修改
        cancelModification(state){
            //刷新数据模板重新解析
            state.result = JSON.parse(JSON.stringify(state.result))
            //刷新临时数据
            state.resultEdit = JSON.parse(JSON.stringify(state.result))
            state.changedDataIndexes.clear()
        },
        //列表排序
        sortChange(state,column){
            if(column.order === 'ascending'){
                state.resultEdit.sort(sortFun(column.prop, true))
            }else if(column.order === 'descending'){
                state.resultEdit.sort(sortFun(column.prop, false))
            }else{
                state.resultEdit =  JSON.parse(JSON.stringify(state.result))
            }
        }
    },
    actions:{
        //读取分数
        resultInquiry(context,value){
            axios.post(`http://localhost:1023/resultInquiry`,{
                data:{
                    userInfo:context.rootState.processUserInfo.userInfo,
                    value,
                }
            }).then(
                response => {
                    if(response.data){
                        //存取数据
                        context.commit('saveResult',response.data)
                    }
                },
                error => {
                    console.log('请求失败了',error.message)
                }
            )
        },
        //修改分数(临时)
        updateTableData(context,[rowIndex,cellIndex,value]){
            value=Number(value)
            if( value < 0 || value > 100){
                value = context.state.result[rowIndex][context.state.rowName[cellIndex]]
                alert('分数应该在0-100这个区间')
            }
            // context.state.resultEdit[rowIndex].splice(cellIndex,1,value)
            context.commit('setResultEditValue',[rowIndex,cellIndex,value])
        },
        //保存修改
        reviseResult(context){
            var studentsInfo=[]
            context.state.changedDataIndexes.forEach(i => studentsInfo.push(context.state.resultEdit[i]))
            axios.post(`http://localhost:1023/saveData`,{
                data:{
                    studentsInfo
                }   
            }).then(
                response => {
                    if(response.data){
                        console.log('数据保存成功')
                        context.commit('reviseResult')
                    }else{
                        console.log('数据保存失败')
                    }
                },
                error => {
                    console.log('请求失败了',error.message)
                }
            )
        },
	},
	getters:{
        //返回处理完毕的表格
        result(state){
            var td=[]
            state.result.forEach(i => td.push([i.userName,i.account,i.chineseScore,i.mathScore,i.englishScore]));
            return {th:state.th,td}
        }
	},
}
//排序函数
const sortFun = function(attr, rev){
    console.log('sprtFun')
    if (rev == undefined) {
        rev = 1
    } else {
        rev = rev ? 1 : -1
    }
    return function(a, b) {
        a = a[attr];
        b = b[attr];
        if (a < b) {
            return rev * -1;
        }
        if (a > b) {
            return rev * 1;
        }
        return 0;
    };
}