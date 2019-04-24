
let modal = document.querySelector(".modal-content");
let addCat = document.querySelector(".addCat");
let modalOpen = false;
let clickOutsideModal;
let userId = 123123123123;
let catId = 280487322;
let taskLength;
let navMenuOpen = false;
 
let categoryName = getParameterByName('category');
let themeBtnBackground;
let themeBtnBorder;
let themeBtnColor;






function openModal() {
  modal.style.display = "inline-block";
  modalOpen = true;
}

// When the user clicks on <span> (x), close the modal
function closeModal() {
  modal.style.display = "none";
  modalOpen = false;
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    checkClickOutside();
}
console.log(window);


function checkClickOutside(){

    clickOutsideModal = true;
    
    if(modalOpen){
        for(var i = 0; i < event.path.length; i++){
            if(event.path[i] == modal || event.path[i] == addCat){
                clickOutsideModal = false;
            }
        }
        if(clickOutsideModal){
             console.log('outside modal');
            if(modalOpen){
                modal.style.display = "none";
                modalOpen = false;
            }
        }
    }
}







function addTask(){
    let taskName = document.getElementById('taskName').value;
    let taskDescription = document.getElementById('taskDescription').value;
    let taskLink = document.getElementById('taskLink').value;
    
    console.log(document.getElementById('taskLength').value);
    console.log(taskName);
    
    if(taskName == null && taskLength == undefined){
        alert("Enter task name and select a length.");
    }else if(taskName == ''){
        alert("Enter task name.");
    }else if(taskLength == undefined){
        alert("Select a length.");
    }else{
        $.ajax({
            url: "/add_tasks",
            type: "POST",
            data:   {
                userId: userId,
                categoryName: categoryName,
                taskName: taskName,
                taskLink: taskLink,
                taskLength: taskLength,
                taskDescription: taskDescription
            },
            success: function(data) { 
                console.log("success");
                console.log(data);
                location.reload();
            },
            error: function(err){
                alert('There was an issue with adding.');
                console.log('error');
            }
        });
        modal.style.display = "none";
        modalOpen = false;
    }
}


function loadTasks(){
    $.ajax({
            url: "/fetch_tasks",
            type: "POST",
            data:   {
                categoryName: categoryName,
                userId: userId
            },
            success: function(data) { 
                console.log("success");
                console.log(data);
                if(data != "no tasks"){
                    for(var i = 0; i < data.length; i++){

                        if(data[i]["TASK_CONT"] == 1){

                            $('.continuousTasks').append('<div class="row taskRow"><div class="col-md-6 taskNameCol"><h5>'+
                                    data[i]["TASK_NAME"]+'</h5></div>'+
                                    '<div class="col-md-2 text-right taskCol"><h5 onclick="seeDescription("'+data[i]["TASK_DESCR"]
                                    +'")">Details</h5></div><div class="col-md-4 text-right">'+
                                    '<button id="'+data[i]["TASK_ID"]+'" type="button" class="btn btn-block taskBtn">Mark Complete</button></div></div>');
                        }else{
                            console.log("adding tasks");
                            $('.todayOnlyTasks').append('<div class="row taskRow"><div class="col-md-6 taskNameCol"><h5>'+
                                    data[i]["TASK_NAME"]+'</h5></div>'+
                                    '<div class="col-md-2 text-right taskCol"><h5 onclick="seeDescription("'+data[i]["TASK_DESCR"]
                                    +'")">Details</h5></div><div class="col-md-4 text-right">'+
                                    '<button id="'+data[i]["TASK_ID"]+'" type="button" class="btn btn-block taskBtn">Mark Complete</button></div></div>');
                        }
                        if(data[i]["TASK_DONE"] == 1){
                            $('#'+ data[i]["TASK_ID"]).css('background-color','green');
                            $('#'+ data[i]["TASK_ID"]).css('border-color','green');
                            $('#'+ data[i]["TASK_ID"]).css('color','white');
                            $('#'+ data[i]["TASK_ID"]).html('Complete');
                        }
                        
                        
                    }
                    $('.taskBtn').on('click',function(){
                            
                            if($(this).html() == 'Complete'){
                                console.log('Uncomplete');
                                
                                $(this).css('background-color','transparent');
                                $(this).css('border-color',$('.categoryNameTitle').css('color'));
                                $(this).css('color',$('.categoryNameTitle').css('color'));
                                $(this).html('Mark Complete');
                                console.log($(this).attr('id'));
                                uncompleteTask($(this).attr('id'));

                            }else{
                                console.log('Complete');
                                
                                $(this).css('background-color','green');
                                $(this).css('border-color','green');
                                $(this).css('color','white');
                                $(this).html('Complete');
                                console.log($(this).attr('id'));
                                completeTask($(this).attr('id'));
                            }
    
                    });
                }
                
            },
            error: function(err){
                alert('There was an issue loading your tasks.');
                console.log('error');
            }
    });
}

function loadTheme(){
    $.ajax({
            url: "/fetch_theme",
            type: "POST",
            data:   {
                categoryName: categoryName,
                userId: userId
            },
            success: function(data) { 
                console.log("theme");
                console.log(data);
                $("head").append(data[0]["HOUSE_CSS"]);
                $('.houseMotto').html(data[0]["HOUSE_MOTTO"]);

            },
            error: function(err){
                alert('There was a problem loading theme');
                console.log('error');
            }
    });
}

function completeTask(task){
    $.ajax({
            url: "/complete_task",
            type: "POST",
            data:   {
                categoryName: categoryName,
                userId: userId,
                taskId: task
            },
            success: function(data) { 
                console.log("theme");
                console.log(data);
            },
            error: function(err){
                alert('There was an issue marking complete.');
                console.log('error');
            }
    });
}

function uncompleteTask(task){
    $.ajax({
            url: "/uncomplete_task",
            type: "POST",
            data:   {
                categoryName: categoryName,
                userId: userId,
                taskId: task
            },
            success: function(data) { 
                console.log("theme");
                console.log(data);
            },
            error: function(err){
                alert('There was an issue uncompleting task.');
                console.log('error');
            }
    });
}

$('#todayOnly').on('click',function(){
    taskLength = 0;
});

$('#continuous').on('click',function(){
    taskLength = 1;
});



loadTheme();
loadTasks();













/* Set the width of the side navigation to 250px */
function openNav() {
    console.log('open');
    document.getElementById("mySidenav").style.width = "250px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    console.log('close');
    document.getElementById("mySidenav").style.width = "0";
}


$('.categoryNameTitle').html(categoryName);

$('.collapseMenu').on('click',function(){
    if(navMenuOpen){
        closeNav();
        navMenuOpen = false;
    }else{
        openNav();
        navMenuOpen = true;
    }
});


function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}