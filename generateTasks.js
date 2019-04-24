let todayDate = new Date();
let timeNowMinutes = (todayDate).getMinutes();
let timeNowHours = (todayDate).getHours();
let dateNow = (todayDate.getMonth()+1) + '/'+ (todayDate.getDate()) +'/'+ (todayDate.getYear()-100+2000);
var tomDate = new Date();
tomDate.setDate(todayDate.getDate()+1)
tomDate = (tomDate.getMonth()+1) + '/'+ (tomDate.getDate()) +'/'+ (tomDate.getYear()-100+2000);
console.log(dateNow);
console.log(tomDate)

if(timeNowHours == 23 && timeNowMinutes == 59){
    
    var sqlite3 = require('sqlite3').verbose();
    var fs = require('fs');
    var dbFile = './db/personal_dashboard.db';
    var exists = fs.existsSync(dbFile);
    var db = new sqlite3.Database(dbFile);

    
    db.serialize(function(){
    db.all('SELECT * FROM TASK where TASK_DATE='+dateNow, function(err, row){
                
		if(row.length > 0){
            
            response.send('duplicate');
        }else{
            /*db.run('INSERT INTO CATEGORY VALUES ("'+parseInt(request.body.userId)+'", "'+newCatId+'", "'
                    +request.body.categoryName+'","'+request.body.selectedHouse+'","0")',function(err){
                if(err)
                {
                    console.log("Error. ");
                }else{
                    console.log('success');
                }
                response.send('success');
            });*/
        }
    });
  });
}else{
    console.log(timeNowHours + ' : ' + timeNowMinutes);
}
    var sqlite3 = require('sqlite3').verbose();
    var fs = require('fs');
    var dbFile = './db/personal_dashboard.db';
    var exists = fs.existsSync(dbFile);
    var db = new sqlite3.Database(dbFile);

    
    db.serialize(function(){
    db.all('SELECT * FROM TASK where TASK_DATE="'+dateNow+'"', function(err, row){
        
        console.log('Fetching tasks...');
        
		if(row.length > 0){
            console.log('Success in fetching tasks');
            console.log(row);
            for(var i = 0; i < row.length; i++){
                if(row[i]["TASK_CONT"] == 1){
                    
                    let newTaskId = Math.floor(Math.random()*1000000000);
                    
                    db.run('INSERT INTO TASK VALUES ("'+row[i]["CAT_ID"]+'", "'+tomDate+'", "'
                            +'0'+'","'+row[i]["TASK_NAME"]+'","'+newTaskId+'","'+row[i]["TASK_LINK"]+'","'+
                            row[i]["TASK_DESCR"]+'","'+row[i]["TASK_CONT"]+'")',function(err){
                        if(err)
                        {
                            console.log("Error. ");
                        }else{
                            console.log('success');
                        }
                    });
                }
                if(row[i]["TASK_CONT"] == 2){
                    let newTaskId = Math.floor(Math.random()*1000000000);
                    
                    db.run('INSERT INTO TASK VALUES ("'+row[i]["CAT_ID"]+'", "'+tomDate+'", '
                            +'"0"'+',"'+row[i]["TASK_NAME"]+'","'+newTaskId+'","'+row[i]["TASK_LINK"]+'","'+
                            row[i]["TASK_DESCR"]+'","'+'0'+'")',function(err){
                        if(err)
                        {
                            console.log("Error. ");
                        }else{
                            console.log('success');
                        }
                    });
                }
            }
        }else{
            console.log('Error in fetching tasks');
        }
    });
  });
