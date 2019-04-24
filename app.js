// server.js
// where your node app starts

// init project
//Node libraries
const express = require('express');
const session = require('express-session');
const app = express();
const request = require('request'); 
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var http = require('http');
var engine = require('consolidate')

app.engine('html', engine.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname );
app.use(session({secret: 'ssshhhhh'}));
var sess;
app.use(bodyParser.urlencoded({ extended: true }));

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

var sqlite3 = require('sqlite3').verbose();
//Middleware
app.use(express.static(__dirname + '/')); //Attach static files(CSS,SCSS,etc)
app.use(bodyParser.json());               //Used for parsing incoming data from requests


 
// open the database
var fs = require('fs');
var dbFile = './db/personal_dashboard.db';
var exists = fs.existsSync(dbFile);
var db = new sqlite3.Database(dbFile);


// http://expressjs.com/en/starter/basic-routing.html
app.get('/monthly_overview', function(request, response) {
  response.sendFile(__dirname + '/Monthly_Overview.html');
});

app.get('/today_overview', function(request, response) {
  sess = request.session;
  response.sendFile(__dirname + '/Today_Overview.html');
});

app.get('/tasks',function(request, response){
  sess = request.session;
  response.sendFile(__dirname + '/Tasks.html');
});

app.post('/add_category', function(request, response) {
    
  let newCatId = Math.floor(Math.random()*1000000000);

  console.log("New ID: "+ newCatId);
  console.log("Received request to sort"); 
  console.log(request.body);
  console.log(parseInt(request.body.userId));
  
  
  db.serialize(function(){
    db.all('SELECT * FROM CATEGORY where USER_ID='+request.body.userId+' and CAT_NAME="'+
                request.body.categoryName+'"', function(err, row){
                
		if(row.length > 0){
            
            response.send('duplicate');
        }else{
            db.run('INSERT INTO CATEGORY VALUES ("'+parseInt(request.body.userId)+'", "'+newCatId+'", "'
                    +request.body.categoryName+'","'+request.body.selectedHouse+'","0")',function(err){
                if(err)
                {
                    console.log("Error. ");
                }else{
                    console.log('success');
                }
                response.send('success');
            });
        }
    });
  });
  
  
  
});

app.post('/fetch_categories',function(request,response){

    db.all('SELECT * FROM CATEGORY C,HOUSE H where USER_ID='+request.body.userId+' and C.CAT_HOUSE=H.HOUSE_ID', function(err, row){
                
		if(row && row.length > 0){
            response.send(row);
        }else{
            response.send('no categories');
        }
    });
});



app.post('/fetch_tasks',function(request,response){
    let todayDate = new Date();
    let timeNowMinutes = (todayDate).getMinutes();
    let timeNowHours = (todayDate).getHours();
    let dateNow = (todayDate.getMonth()+1) + '/'+ (todayDate.getDate()) +'/'+ (todayDate.getYear()-100+2000);
    
    db.all('SELECT CAT_ID FROM CATEGORY WHERE CAT_NAME="'+request.body.categoryName+'" AND USER_ID='+request.body.userId, 
        function(err,row){
    
        db.all('SELECT * FROM TASK where CAT_ID='+row[0]["CAT_ID"]+' AND TASK_DATE="'+dateNow+'"', function(err, row){      
            if(row && row.length > 0){
                response.send(row);
            }else{
                response.send('no tasks');
            }
        });
    
    });
    
});

app.get('/fetch_houses', function(request,response){
    db.all('SELECT * FROM HOUSE', function(err, row){      
		if(row && row.length > 0){
            console.log(row);
            response.send(row);
        }else{
            response.send('no categories');
        }
    });
});

app.post('/fetch_theme', function(request,response){
    db.all('SELECT H.HOUSE_CSS,H.HOUSE_MOTTO FROM HOUSE H, CATEGORY C WHERE C.CAT_NAME="'+request.body.categoryName+'" AND '+
        'C.USER_ID='+request.body.userId+' AND C.CAT_HOUSE=H.HOUSE_ID', function(err, row){      
		if(row && row.length > 0){
            console.log(row);
            response.send(row);
        }else{
            response.send('no categories');
        }
    });
});

app.post('/add_tasks', function(request, response) {
    
  let newTaskId = Math.floor(Math.random()*10000000000);
  let todayDate = new Date();
  let timeNowMinutes = (todayDate).getMinutes();
  let timeNowHours = (todayDate).getHours();
  let dateToday = (todayDate.getMonth()+1) + '/'+ (todayDate.getDate()) +'/'+ (todayDate.getYear()-100+2000);

  db.serialize(function(){
  
        db.all('SELECT * FROM CATEGORY WHERE CAT_NAME="'+request.body.categoryName+'" AND USER_ID='+request.body.userId, 
            function(err,row){
            
            let progress = row[0]["CAT_TASK_DONE"]/(row[0]["CAT_TASK_TOTAL"] + 1);
            
            db.run('INSERT INTO TASK VALUES ("'+row[0]["CAT_ID"]+'", "'+dateToday+'","0", "'
                    +request.body.taskName+'","'+newTaskId+'","'+request.body.taskLink+
                    '","'+request.body.taskDescription+'","'+request.body.taskLength+'")',function(err){
                if(err)
                {
                    console.log("Error. ");
                    response.send('fail');
                }else{
                    console.log('success');
                    response.send('success');
                    db.run('UPDATE CATEGORY SET CAT_TASK_TOTAL=CAT_TASK_TOTAL+1 WHERE CAT_ID='+row[0]["CAT_ID"],function(err){
                        if(err){
                            console.log(err);
                        }else{
                            console.log('Incremented');
                            db.run('UPDATE CATEGORY SET CAT_PROGRESS='+progress+' WHERE CAT_ID='+row[0]["CAT_ID"],function(err){
                                if(err){
                                    console.log(err);
                                }else{
                                    console.log('Progress Updated');
                                }
                            });
                        }
                    });
                }
                
            });
        });
  });
});

app.post('/complete_task', function(request, response){

    db.serialize(function(){
        db.all('SELECT * FROM CATEGORY WHERE CAT_NAME="'+request.body.categoryName+'" AND USER_ID='+request.body.userId, 
            function(err,row){
            if(err){
            
            }else{
            
                let progress = (row[0]["CAT_TASK_DONE"]+1)/row[0]["CAT_TASK_TOTAL"];

                db.run('UPDATE CATEGORY SET CAT_TASK_DONE=CAT_TASK_DONE+1 WHERE CAT_ID='+row[0]["CAT_ID"],function(err){
                    if(err){
                        console.log(err);
                    }else{
                        console.log('Incremented');
                        console.log(progress);
                        db.run('UPDATE CATEGORY SET CAT_PROGRESS='+progress+' WHERE CAT_ID='+row[0]["CAT_ID"],function(err){
                                if(err){
                                    console.log(err);
                                }else{
                                    console.log('Progress Updated');
                                }
                        });
                    }
                });
                db.run('UPDATE TASK SET TASK_DONE=1 WHERE TASK_ID='+request.body.taskId,function(err){
                    if(err){
                        console.log(err);
                    }else{
                        console.log('Task completed');
                    }
                });
                response.send('complete');
            }
            
        });
    });
    
});
  
app.post('/uncomplete_task', function(request, response){
    console.log(request.body);
    
    db.serialize(function(){
        db.all('SELECT * FROM CATEGORY WHERE CAT_NAME="'+request.body.categoryName+'" AND USER_ID='+request.body.userId, 
            function(err,row){
            
            let progress = (row[0]["CAT_TASK_DONE"]-1)/row[0]["CAT_TASK_TOTAL"];
            
            db.run('UPDATE CATEGORY SET CAT_TASK_DONE=CAT_TASK_DONE-1 WHERE CAT_ID='+row[0]["CAT_ID"],function(err){
                if(err){
                    console.log(err);
                }else{
                    console.log('Decremented');
                }
            });
            db.run('UPDATE TASK SET TASK_DONE=0 WHERE TASK_ID='+request.body.taskId,function(err){
                if(err){
                    console.log(err);
                }else{
                    console.log('Task uncompleted');
                    db.run('UPDATE CATEGORY SET CAT_PROGRESS='+progress+' WHERE CAT_ID='+row[0]["CAT_ID"],function(err){
                        if(err){
                            console.log(err);
                        }else{
                            console.log('Progress Updated');
                        }
                    });
                }
            });
        });
        response.send('uncomplete');
    });
});
  
app.listen(8888);



// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});





