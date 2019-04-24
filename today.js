/******************************************************************************
    Pop Out Modal for Add Categories
*******************************************************************************/

let modal = document.querySelector(".modal-content");
let addCat = document.querySelector(".addCat");
let modalOpen = false;
let clickOutsideModal;
let selectedHouse= null;
let categoryName = null;
let userId = 123123123123;
let catDivs = ['.cat1','.cat2','.cat3','.cat4','.cat5','.cat6','.cat7','.cat8'];
let houseDivs = ['.house1','.house2','.house3','.house4','.house5',  
                 '.house6','.house7','.house8','.house9','.house10'];
let houseDivColors = ['.houseColor1','.houseColor2','.houseColor3','.houseColor4','.houseColor5',  
                 '.houseColor6','.houseColor7','.houseColor8','.houseColor9','.houseColor10'];
let navMenuOpen = false;
 
// When the user clicks on the button, open the modal 
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

function addCategory(){
    categoryName = document.getElementById('catName').value;
    console.log(categoryName);
    
    if(selectedHouse == null && categoryName == ''){
        alert("Enter category name and select a color.");
    }else if(categoryName == ''){
        alert("Enter category name.");
    }else if(selectedHouse == null){
        alert("Select a color.");
    }else{
        $.ajax({
            url: "/add_category",
            type: "POST",
            data:   {
                userId: userId,
                selectedHouse: selectedHouse,
                categoryName: categoryName.toLowerCase()
            },
            success: function(data) { 
                console.log("success");
                console.log(data);
                if(data == 'duplicate'){
                    alert('This category already exists.');
                }else{
                    location.reload();
                }
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

function loadCategories(){
    $.ajax({
            url: "/fetch_categories",
            type: "POST",
            data:   {
                userId: userId
            },
            success: function(data) { 
                console.log("success");
                console.log(data);
                
                for(var i = 0; i < data.length; i++){
                    $(catDivs[i]).append('<a href="/tasks?category='+(data[i]["CAT_NAME"]).toLowerCase()+'"><div class="category">'+(data[i]["CAT_NAME"]).charAt(0).toUpperCase() + (data[i]["CAT_NAME"]).substring(1) +
                    '</div><div class="ldBar" style="width:80%;height:35%;margin:auto;color:transparent; " data-value="'+
                    data[i]["CAT_PROGRESS"]*100+'" '+
                    'data-stroke-width="10"'+' data-stroke-trail-width="1" data-preset="circle"></div></a>');
                    $(catDivs[i]+'>a>.ldBar').attr('data-stroke',data[i]["HOUSE_COLOR_1"]);
                    $(catDivs[i]+'>a>.ldBar').attr('data-stroke-trail',data[i]["HOUSE_COLOR_2"]);
                    $(catDivs[i]+' >a>.category').css('background-color',data[i]["HOUSE_COLOR_1"]);
                    $(catDivs[i]+' >a>.category').css('border-bottom','solid 5px '+data[i]["HOUSE_COLOR_2"]);
                    $(catDivs[i]+' >a>.category').css('border-top','solid 5px '+data[i]["HOUSE_COLOR_2"]);
                    $(catDivs[i]+'>a>.category').css('color',data[i]["HOUSE_COLOR_2"]);
                    $(catDivs[i]+'>a>.ldBar').css('background','url("../img/'+data[i]["HOUSE_SIGIL"]+'")');
                    $(catDivs[i]+'>a>.ldBar').css('background-size','50% 50%');
                    $(catDivs[i]+'>a>.ldBar').css('background-position','center center');
                    $(catDivs[i]+'>a>.ldBar').css('background-repeat','no-repeat');
                }
                
                
            },
            error: function(err){
                alert('There was an issue with fetching your categories.');
                console.log('error');
            }
    });
}

function loadHouses(){
    $.ajax({
            url: "/fetch_houses",
            type: "GET",
            data:   {
                userId: userId
            },
            success: function(data) { 
                console.log("loading Houses");
                console.log(data);
                
                for(var i = 0; i < data.length; i++){
                    $(houseDivColors[i]).css('background-color', data[i]["HOUSE_COLOR_1"]);
                    $(houseDivColors[i]).css('border-top', 'solid 0.8em '+ data[i]["HOUSE_COLOR_2"]);
                    $(houseDivs[i]).css('background','url("../img/'+data[i]["HOUSE_SIGIL"]+'")');
                    $(houseDivs[i]).css('background-size','100% 100%');
                    $(houseDivs[i]).css('background-position','center center');
                    $(houseDivs[i]).css('background-repeat','no-repeat');
                    $(houseDivs[i]).attr('id',data[i]["HOUSE_NAME"]);
                    console.log(data[i]["HOUSE_NAME"]);
                }
                
                
            },
            error: function(err){
                alert('There was an issue with fetching your categories.');
                console.log('error');
            }
    });
}


$('.houseDiv>div>div>div').on('click',function(e){

    $('.houseDiv>div>div').css('outline','none');
    selectedHouse = ($(this).attr('id'));
    console.log(selectedHouse);
    $(this).parent().css('outline','solid black 2px');

});


/******************************************************************************
    Init
*******************************************************************************/


loadCategories();
loadHouses();


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




$('.collapseMenu').on('click',function(){
    if(navMenuOpen){
        closeNav();
        navMenuOpen = false;
    }else{
        openNav();
        navMenuOpen = true;
    }
});

