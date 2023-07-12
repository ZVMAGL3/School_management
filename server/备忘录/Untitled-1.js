app.post('/readMessage',function(req,res){
    var startIndex = req.body.data.startIndex;
    const sql1 = `
        SELECT 
            message_board.*,
            user_password.userName,
        FROM message_board
        INNER JOIN user_password
        ON message_board.account = user_password.account
        WHERE message_board.index < ? 
        ORDER BY message_board.index DESC
        LIMIT 10;
    `;
    db.query(sql1,[startIndex], function (error,results,fields) {
        console.log(results);
        if(error) throw error;
        /* }else if(results.length === 10){
            // res.send({messageData:results,startIndex:results[results.length - 1].index});
            startIndex = results[results.length - 1].index;
        }else{
            // res.send({messageData:results,startIndex:false});
            startIndex = false;
        } */
        results.forEach((message) => {
            var number = message.index;
            const sql2 = `
                SELECT 
                    comment.*,
                    user_password.userName,
                    (SELECT COUNT(*) FROM comment WHERE message_board_index = ?) AS sum
                FROM comment
                INNER JOIN user_password
                ON comment.account = user_password.account
                WHERE comment.message_board_index = ?
                ORDER BY comment.index 
                LIMIT 3;
            `;
            db.query(sql2,[number,number], function (error,results,fields) {
                if(error) throw error;
                console.log(results);
            })
        })
    })
})

/*
    START TRANSACTION; 
    UPDATE message_board
    SET comment_count = comment_count + 1
    WHERE `index` = 51;
    INSERT INTO comment(account,content,`index`, message_board_index) 
    VALUES (20220000,'Holle',(SELECT comment_count FROM message_board WHERE `index` = 51), 51);
    COMMIT;
*/
/* 
START TRANSACTION; 
UPDATE message_board
SET commentCount = commentCount + 1
WHERE `index` = 51;
INSERT INTO comment(account,content,`index`, message_board_index) 
VALUES ('1','哈哈哈哈',(SELECT commentCount FROM message_board WHERE `index` = 51), 51);
COMMIT;
 */

/* 
START TRANSACTION;
UPDATE message_board
SET commentCount = commentCount + 1
WHERE id = 61;
INSERT INTO comment(account,content,id, messageBoardId) 
VALUES ('1','123',(SELECT commentCount FROM message_board WHERE id = 61), 61);
COMMIT;
*/