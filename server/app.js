const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser'); // 导入 body-parser
const db = require('./conf/db'); //引入数据库文件

const crypto = require('crypto'); //引入crypto模块,hash校验
const fs = require('fs'); //引入fs模块,文件操作

let app = express(); 
//处理跨域问题 
app.use(cors());
// 使用 body-parser 解析 JSON 格式的数据,请求体的大小为10mb
app.use(bodyParser.json({ limit: '10mb' })); 

//头像文件夹,让前端可以访问
app.use(express.static("./public/avatar"));

//登录管理
app.post('/login',function(req,res){ 
    var loginInfo = req.body.data.loginInfo;
    var params = [loginInfo.account,loginInfo.password];
    db.query("SELECT account,userName,identity FROM user_password WHERE account = ? AND password = ? ",params, function (error,results,fields) {
        if(results.length == 0){
            res.send(false);
            return;
        }
        // 处理结果
        const userInfoHash = crypto.createHash('sha256');
        userInfoHash.update(JSON.stringify(results[0]));
        const result = userInfoHash.digest('hex');
        res.send({userInfo:results[0],userInfoHash:result});
    });
})

//验证身份
app.post('/verify',function(req,res){ 
    var params = [req.body.data.value.account];
    var userInfoHash = req.body.data.value.userInfoHash;
    db.query("SELECT account,userName,identity FROM user_password WHERE account = ?",params, function (error,results,fields) {
        if(results.length === 0){
            res.send(false);
            return;
        }
        // 处理结果
        const check = crypto.createHash('sha256');
        check.update(JSON.stringify(results[0]));
        const result = check.digest('hex');
        console.log(result)
        if(userInfoHash === result){
            res.send({userInfo:results[0]});
        }else{
            res.send(false)
        }
    });
})

//修改密码
app.post('/changePassword',function(req,res){ 
    var password = req.body.data.password;
    var account = req.body.data.account;
    var params = [password.p_new,account];
    db.query("UPDATE user_password SET password = ? WHERE account = ?",params, function (error,results,fields) {
        if(error) throw error;
        res.send("更新成功了");
        return
    });
})

//查询分数
app.post('/resultInquiry',function(req,res){ 
    var userInfo = req.body.data.userInfo;
    var identity = userInfo.identity;
    var value ='%' + req.body.data.value + '%';
    if(identity === 'student'){
        value = userInfo.account
    }
    db.query("SELECT * FROM result WHERE account LIKE ? OR userName LIKE ? ",[value,value], function (error,results,fields) {
        res.send(results)
    });
})

//更改成绩数据
app.post('/saveData',function(req,res){ 
    var studentsInfo = req.body.data.studentsInfo;
    studentsInfo.forEach(studentInfo => {
        var params=[studentInfo.chineseScore,studentInfo.mathScore,studentInfo.englishScore,studentInfo.account];
        db.query('UPDATE result SET chineseScore = ?, mathScore = ?, englishScore = ? WHERE account = ?',params, function (error,results,fields) {
            if(error) throw error;
            res.send("更新成功了");
            return
        });
    })
})

//主页初始化
//使用回调规避异步
/* app.post('/homePageInitialization',function(req,res){ 
    var account = req.body.data.account;
    var data = {homePageInfo:false,userImagePath:false};
    const fileName = './public/avatar/' + account + '.jpg';
    if (fs.existsSync(fileName)) {
        data.userImagePath = 'http://localhost:1023/' + account + '.jpg';
    } else {
        data.userImagePath = 'http://localhost:1023/defaultAvatar.jpg';
    }
    db.query("SELECT * FROM homePage WHERE account = ?",[account], function (error,results,fields) {
        if(results.length === 1){
            data.homePageInfo = results[0];    
        }
        res.send(data)
    })
}) */

//使用asyuc/await解决异步问题
app.post('/homePageInitialization',async function(req,res){ 
    var account = req.body.data.account;
    var data = {homePageInfo:false,userImagePath:false,userName:false};
    const fileName = './public/avatar/' + account + '.jpg';
    if (fs.existsSync(fileName)) {
        data.userImagePath = 'http://localhost:1023/' + account + '.jpg';
    } else {
        data.userImagePath = 'http://localhost:1023/defaultAvatar.jpg';
    }
    let results = await new Promise((resolve, reject) => {
        db.query("SELECT * FROM homePage WHERE account = ?",[account], function (error,results,fields) {
            if(error){
                reject(error);    
            }else{
                resolve(results);
            }
        })
    })
    if(results.length === 1){
        data.homePageInfo = results[0];
    }
    let userName = await new Promise((resolve,reject) => {
        db.query("SELECT userName FROM user_password WHERE account = ?",[account], function (error,results,fields) {
            if(error){
                reject(error);    
            }else if(results.length === 1){
                resolve(results[0].userName)
            }else{
                resolve(false)
            }
        })
    })
    data.userName = userName
    res.send(data);
})

//调用用户头像地址
app.post('/getUserAvatar',function(req,res){ 
    var account = req.body.data.account;
    const fileName = './public/avatar/' + account + '.jpg';
    if (fs.existsSync(fileName)) {
        res.send('http://localhost:1023/' + account + '.jpg');
    } else {
        res.send('http://localhost:1023/defaultAvatar.jpg');
    }
})

//更改主页数据
app.post('/saveHomePageInfo',function(req,res){ 
    var homePageInfo = req.body.data.homePageInfo;
    var account = req.body.data.account;
    var params=[homePageInfo.signature,homePageInfo.emaliAddress,homePageInfo.selfIntroduction,homePageInfo.campusExperience,account];
    db.query('SELECT * FROM homepage WHERE account = ?',[account], function (error,results,fields) {
        if(results.length === 0){
            db.query('INSERT INTO homePage (signature,emaliAddress,selfIntroduction,campusExperience,account) VALUES (?,?,?,?,?)',params, function (error, results, fields) {
                if (error) throw error;
                console.log('@')
                res.send("添加成功了");
            });
        }else{
            db.query('UPDATE homePage SET signature = ?, emaliAddress = ?, selfIntroduction = ?, campusExperience = ? WHERE account = ?',params, function (error,results,fields) {
                if(error) throw error;
                res.send("更新成功了");
            });
        }
    });

})

//保存更改的用户头像
app.post('/saveAvatar',function(req,res){
    var account = req.body.data.account;
    var userAvatar = req.body.data.userAvatar.replace(/^data:image\/\w+;base64,/, '');
    var avatarName = './public/avatar/' + account + '.jpg';
    fs.writeFile(avatarName,userAvatar,{encoding: 'base64'},(err) => {
        if (err){
            res.send(err);
        }else{
            var userImagePath = 'http://localhost:1023/' + account + '.jpg?' +  new Date().getTime();
            res.send(userImagePath);
        }
    });
})

app.post('/readMessage',function(req,res){
    var startId = req.body.data.startId;
    const sql1 = `
        SELECT message_board.*,user_password.userName
        FROM message_board
        INNER JOIN user_password
        ON message_board.account = user_password.account
        WHERE message_board.id < ? 
        ORDER BY message_board.id DESC
        LIMIT 10;
    `;
    db.query(sql1,[startId], function (error,messageData,fields) {
        if(messageData.length){
            const sql2 = `
                SELECT comment.*,
                    (SELECT userName FROM user_password WHERE account = comment.account) AS userName,
                    (SELECT COALESCE(userName, '') FROM user_password WHERE account = COALESCE(comment.replyTo, '')) AS replierName
                FROM comment
                WHERE comment.messageBoardId IN (${new Array(messageData.length).fill('?').join(',')})
                AND (
                    SELECT COUNT(*)
                    FROM comment c
                    WHERE c.messageBoardId = comment.messageBoardId
                    AND c.time <= comment.time
                ) <= 3
                ORDER BY comment.messageBoardId, comment.time;
            `;
            let idArray = messageData.map(item => item.id);
            db.query(sql2,idArray, function (error,temporaryComments,) {
                console.log(temporaryComments)
                if(error) throw error;
                res.send({
                    messageData,
                    startId:messageData.length === 10?messageData[messageData.length - 1].id:false,
                    temporaryComments,
                });
            })
        }else{
            res.send({
                messageData,
                startId:messageData.length === 10?messageData[messageData.length - 1].id:false,
                temporaryComments:false
            });
        }
    })
})

//保存用户留言
app.post('/saveMessage',function(req,res){ 
    var account = req.body.data.account;
    var userMessage = req.body.data.userMessage;
    var params=[account,userMessage];
    db.query('INSERT INTO message_board(account,userMessage) VALUES (?,?);',params, function (error,results,fields) {
        if(error) throw error;
        var startId = results.insertId
        res.send({startId})
    });
})

function getComments(id, callback) {
    const sql = `
    SELECT comment.*,
        (SELECT userName FROM user_password WHERE account = comment.account) AS userName,
        (SELECT COALESCE(userName, '') FROM user_password WHERE account = COALESCE(comment.replyTo, '')) AS replierName
    FROM comment
    WHERE comment.messageBoardId = ?
    ORDER BY comment.messageBoardId, comment.time;
    `;
    db.query(sql, [id], function (err, results, fields) {
        if (err) throw err;
        callback(results);
    });
}

app.post('/saveComment',function(req,res){ 
    let account = req.body.data.account;
    let replyTo = req.body.data.replyTo;
    let userComment = req.body.data.userComment;
    let id = req.body.data.id;
    let params=[id,account,userComment,id,id,replyTo];
    const sql = `
        START TRANSACTION;
        UPDATE message_board
        SET commentCount = commentCount + 1
        WHERE id = ?;
        INSERT INTO comment(account,content,id, messageBoardId,replyTo)
        VALUES (?,?,(SELECT commentCount FROM message_board WHERE id = ?),?, ?);
        COMMIT;
    `;
    db.query(sql,params, function (error) {
        if(error) throw error;
        getComments(id, function (comments) {
            res.send(comments);
        });
    });
})

app.post('/viewAll',function(req,res){ 
    let id = req.body.data.id;
    getComments(id, function (comments) {
        res.send(comments);
    });
})


//监听1023端口 
app.listen(1023);