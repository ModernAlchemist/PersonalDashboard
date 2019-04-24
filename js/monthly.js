let todayDate = new Date();
let selectedMonth;
let todayMonth = todayDate.getMonth();
let todayYear = todayDate.getYear();
let dayOfWeek = todayDate.getDay();
let todayDay = todayDate.getDate();
let navMenuOpen = false;
 
console.log(todayYear);

selectedMonth = todayMonth;

let daysInMonth = {
    0: 31,
    1: 28,
    2: 31,
    3: 30,
    4: 31,
    5: 30,
    6: 31,
    7: 31,
    8: 30,
    9: 31,
    10: 30,
    11: 31
};

let monthNames = {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December'
}

let calendarSquares = ['d1','d2','d3','d4','d5','d6','d7','d8','d9','d10','d11','d12',
                       'd13','d14','d15','d16','d17','d18','d19','d20','d21','d22','d23',
                       'd24','d25','d26','d27','d28','d29','d30','d31','d32','d33','d34','d35',
                       'd36','d37','d38','d39','d40','d41','d42'];

let titleMonth = document.querySelector('.titleMonth');
let titleYear = document.querySelector('.titleYear');

loadCalendar();



function calendarLeft(){
    if(todayMonth == 0){
        todayMonth = 11;
    }else{
        todayMonth--;
    }

    if(todayMonth == 11){
        todayYear--;
    }
    loadCalendar();
}

function calendarRight(){
    todayMonth = (todayMonth + 1)%12;
    if(todayMonth == 0){
        todayYear++;
    }
    loadCalendar();
}

function loadCalendar(){
    if(todayYear%4 == 0 && todayYear != 2100 && todayYear != 2200 && todayYear != 2300){
        daysInMonth[1] = 29;
    }else{
        daysInMonth[1] = 28;
    }
    titleMonth.textContent = monthNames[todayMonth];
    titleYear.textContent = todayYear-100 + 2000;
    let calendarDay = 0;
    let startDay = (new Date(todayYear-100 + 2000,todayMonth,1)).getDay();
    console.log();
    console.log(startDay);

    for(var i = 0; i < startDay; i++){
        let day = document.querySelector('.'+calendarSquares[calendarDay]);
        day.style['background-color'] = 'rgba(255, 90, 95,0.5)';
        let dayNum = document.querySelector('.'+calendarSquares[calendarDay] + '>' + '.dayNum');
        
        if(todayMonth == 0){
            dayNum.textContent = i+1+(daysInMonth[11]-startDay);
        }else{
            dayNum.textContent = i+1+(daysInMonth[todayMonth-1]-startDay);
        }

        calendarDay++;
    }
    
    for(var i=0; i < daysInMonth[todayMonth]; i++){
        let day = document.querySelector('.'+calendarSquares[calendarDay]);
        day.style['background-color'] = 'rgb(60, 60, 60)';
        let dayNum = document.querySelector('.'+calendarSquares[calendarDay] + '>' + '.dayNum');
        dayNum.textContent = (i + 1) + '';
        calendarDay++;
    }

    for(var i; i < calendarSquares.length-1; i++){
        let day = document.querySelector('.'+calendarSquares[calendarDay]);
        day.style['background-color'] = 'rgba(255, 90, 95,0.5)';
        let dayNum = document.querySelector('.'+calendarSquares[calendarDay] + '>' + '.dayNum');
        dayNum.textContent = (i - daysInMonth[todayMonth] + 1) + '';
        calendarDay++;
    }
}






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