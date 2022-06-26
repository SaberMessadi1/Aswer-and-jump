
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");
if(window.location.hash)
{
	var hash = window.location.hash.substring(1);
	if(hash == "debug")
		document.getElementById('debug').style.display = "block";
}

var joueur1 = new Object();
joueur1.log = function(msg) {
	if(joueur1.debug)
	{
		console.log(msg);
		
	}
		
}

joueur1.table = function(msg) {
	if(joueur1.debug)
		console.table(msg);
}

var sl = TAFFY(config);
var packageMCQ = {};
var p=0 ;
var time ;
joueur1.debug = true;
joueur1.prompt = [12, 17, 22, 27, 32, 37, 42, 47, 52, 57, 62, 67, 72, 77, 82, 87];
joueur1.struct = [{point: 12, snake: 7, ladder: 28}, {point: 17, snake: 5, ladder: 45}, {point: 22, snake: "Start", ladder: 43}, {point: 27, snake: 15, ladder: 34}, {point: 32, snake: 30, ladder: 51}, {point: 37, snake: 3, ladder: 58}, {point: 42, snake: 38, ladder: 59}, {point: 47, snake: 36, ladder: 55}, {point: 52, snake: 48, ladder: 73}, {point: 57, snake: 35, ladder: 83}, {point: 62, snake: 60, ladder: 81}, {point: 67, snake: 46, ladder: 75}, {point: 72, snake: 35, ladder: 90}, {point: 77, snake: 43, ladder: 95}, {point: 82, snake: 63, ladder: 99}, {point: 87, snake: 68, ladder: 93}];

joueur1.questionAttempt = 0;
joueur1.currentpos;
joueur1.filtered = [];
joueur1.filteredIndex = 0;
joueur1.setpos = function(curpos) {
	
	joueur1.currentpos = curpos;
	console.log(curpos);
	
	var cellProp = $('td').filter(function(i,e){ return this.textContent.trim() == curpos }).get(0);
	
	
	
	var pX = ((54 * parseInt(cellProp.cellIndex)) );
	var pY = ((53.5 * parseInt(cellProp.parentNode.rowIndex)));
	
		$('#player').animate({top: pY + 'px', left: pX + 'px'});
		
	
	
	
	
	//document.getElementsByClassName('dice')[0].className = "dice";
	if(curpos == "Stop")
	{
		joueur1.gameover();
	} else {
		setTimeout(setQuestion, 1000);
		if(joueur1.questionAttempt==0){
			startTimer(time)
		}else{
			clearInterval(counter)
			timeText.textContent="Time Left";
			startTimer(time)
		}
	}
}

joueur1.gameover = function()
{
	//alert('game over');
	$('#replay').show();
	$('#msgComplete').show();
	setTimeout(function()
	{
		//playSound('well done');
		$('#msgComplete').addClass('open');
		setTimeout(function()
		{
			$('#msgComplete span img').each(function(i, e)
			{
				 $(this).show().addClass('textEffect' + (i+1));
			});
		}, 300);
	}, 10);
}

var slLevels = new Array();	
sl().each(function (r) {
	if(slLevels.indexOf(r.level) == -1)
		slLevels.push(r.level);


});

var nextscreen = function(oldscreen, newscreen) {
	document.getElementById(oldscreen).style.display = "none";
	document.getElementById(newscreen).style.display = "block";
}

var selectlevel = function(level) {
	nextscreen('screen3', 'screen4');
	packageMCQ.level = level;
	switch(level){
		case "1":
				time=30;
				break
			case "2":
				time=25
				break
			case "3":
				time=20
				break
			case "4":
				time=15
				break
			case "5":
				time=10
				break
	}
	var slThemes = [];
	sl({level: level}).each(function (r) {
		if(slThemes.indexOf(r.theme) == -1)
			slThemes.push(r.theme);
		
		
	});

	joueur1.log(slThemes);
	var themeHTML = "";
	for(var i=0; i<slThemes.length; i++)
		themeHTML += '<li onclick="selecttheme(\'' + slThemes[i] + '\')">' + slThemes[i] + '</li>';
	document.getElementById('selectTheme').innerHTML = themeHTML;
}

var selecttheme = function(theme) {
	nextscreen("screen4", "screen5");
	packageMCQ.theme = theme;
	
	joueur1.filtered = new Array();
	sl({level: packageMCQ.level, theme: packageMCQ.theme}).each(function(r)
	{
		joueur1.filtered.push(r);
	});
	
	joueur1.table(joueur1.filtered);
	
	shuffle(joueur1.filtered);
	joueur1.setpos("Start");
}

function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}





var levelHTML = "";
for(var i=0; i<slLevels.length; i++)
	levelHTML += '<li onclick="selectlevel(\'' + (i+1) + '\')">Level ' + slLevels[i] + '</li>';
document.getElementById('selectLevel').innerHTML = levelHTML;


var setQuestion = function()
{
	joueur1.questionAttempt++;
	
	//reshuffle filtered questions before the question repeats
	if(joueur1.filteredIndex >= joueur1.filtered.length)
	{
		shuffle(joueur1.filtered);
		joueur1.filteredIndex = 0;
		joueur1.table(joueur1.filtered);
	}
	
	//insert information for q/a
	document.getElementById('questionTitleTxt').textContent = joueur1.filtered[joueur1.filteredIndex].question;
	
	for(var i=0; i<4; i++)
	{
		document.querySelectorAll('#userAnswer ul li')[i].textContent = joueur1.filtered[joueur1.filteredIndex].answers[i];
		if(i  == (parseInt(joueur1.filtered[joueur1.filteredIndex].correct) - 1))
		{
			document.querySelectorAll('#userAnswer ul li')[i].id = "correctans";
			joueur1.log('Ans: ' + joueur1.filtered[joueur1.filteredIndex].answers[i]);
		}
	}
	
	//show question viewer
	
	document.getElementById('questionViewer').style.bottom = "0px";
	
	
	joueur1.filteredIndex++;
}

var submitAnswer = function()
{	
	setTimeout(() => {
		clearInterval(counter);
		
		timeCount.textContent=""
		var newpos;
		var bool=false;
		for(var i=0; i<joueur1.struct.length; i++)
		{
			if(joueur1.currentpos == joueur1.struct[i].point)
			{
				newpos = joueur1.struct[i];
				bool=true
				break;
			}
		}
	
		
		var attempt = (document.getElementsByClassName('active')[0].id == "correctans") ? true : false;
		
		var randomNum;
		
		randomNum = Math.floor(Math.random() * 6) + 1;
		//hide question viewer
		document.getElementById('questionViewer').style.bottom = "";
		
		setTimeout(function()
		{
			/* joueur1.setpos((attempt == true) ? newpos.ladder : newpos.snake); */
			if(joueur1.currentpos == "Start") joueur1.currentpos = 1;
			if(joueur1.currentpos == "Stop") joueur1.currentpos = 100;
			if (attempt){
				if(bool){
					joueur1.setpos(newpos.ladder)
				}else{
				joueur1.currentpos += randomNum;}
			}else{
				if(bool){
					joueur1.setpos(newpos.snake)
				}else{
				 switch(joueur1.currentpos){
					 case 1 :
						 joueur1.currentpos = 0;
						 break
					case 2 :
						joueur1.currentpos =0;
						break
					case 3 :
							joueur1.currentpos-=1;
							break
					case 4 :
						joueur1.currentpos-=1;
						break
					case 5 :
						joueur1.currentpos-=1;
						break
					case 6 :
						joueur1.currentpos-=3;
						break
	
				}
				if (joueur1.currentpos>6){
					joueur1.currentpos-=randomNum	;
				}}
		}
	
			var tempholder;
			
			if(joueur1.currentpos == 0)		tempholder = "Start";
			else if(joueur1.currentpos >= 100)	tempholder = "Stop";
			else 							tempholder = joueur1.currentpos;
		
			
			joueur1.setpos(tempholder);	
	
	
	
	
	
	
	
	
	
			document.getElementById((attempt == true) ? "correctsound" : "incorrectsound").play();
			document.getElementsByClassName('active')[0].className = "";
		}, 1000);
		
		
	}, 1000);

	
}

var setactiveans = function(ele)
{
	if(document.querySelector('.active'))
		document.querySelector('.active').className = "";
	ele.className = "active";
}

function playagain() {
    location.href = document.URL;
}

var preload = ["img/digit1.png",
    "img/digit2.png",
    "img/digit3.png",
    "img/digit4.png",
    "img/digit5.png",
    "img/digit6.png",
    "img/grass.png",
    "img/snake1.png",
    "img/snake2.png",
    "img/snakes/ludoSnake1.png",
    "img/snakes/ludoSnake2.png",
    "img/snakes/ludoSnake3.png",
    "img/snakes/ludoSnake4.png",
    "img/snakes/ludoSnake5.png",
    "img/snakes/ludoSnake6.png",
    "img/snakes/ludoSnake7.png",
    "img/snakes/ludoSnake8.png",
    "img/snakes/ludoSnake8.png",
    "img/snakes/ludoSnake9.png",
    "img/snakes/ludoSnake10.png",
    "img/snakes/ludoSnake11.png",
    "img/snakes/ludoSnake12.png",
    "img/snakes/ludoSnake13.png",
    "img/snakes/ludoSnake14.png",
    "img/snakes/ludoSnake15.png",
    "img/snakes/ludoSnake16.png"];
	
var promises = [];
for (var i = 0; i < preload.length; i++) {
    (function(url, promise) {
        var img = new Image();
        img.onload = function() {
          promise.resolve();
        };
        img.src = url;
    })(preload[i], promises[i] = $.Deferred());
}

$(document).ready(function() {

	$.when.apply($, promises).done(function() {
		$('body').addClass('done');
	});



});

function startTimer(time){
    counter = setInterval(timer, 1000);
        function timer(){
           
            timeCount.textContent = time; //changing the value of timeCount with time value
            time--; //decrement the time value
            if(time < 9){ //if timer is less than 9
                let addZero = timeCount.textContent; 
                timeCount.textContent = "0" + addZero; //add a 0 before time value
            }
            if(time <0){ //if timer is less than 0
                clearInterval(counter); //clear counter
                timeText.textContent = "Time Off"; //change the time text to time off
				document.getElementById('questionViewer').style.bottom = "";
				
					switch (joueur1.currentpos){
							case 1 :
								joueur1.currentpos = 0;
								break
						   case 2 :
							   joueur1.currentpos =0;
							   break
						   case 3 :
								   joueur1.currentpos-=1;
								   break
						   case 4 :
							   joueur1.currentpos-=1;
							   break
						   case 5 :
							   joueur1.currentpos-=1;
							   break
						   case 6 :
							   joueur1.currentpos-=1;
							   break
					}
					   
					   if (joueur1.currentpos>6){
						   joueur1.currentpos-=1	;
					   }
					   var tempholder;
		
					   if(joueur1.currentpos == 0)		tempholder = "Start";
					   else if(joueur1.currentpos >= 100)	tempholder = "Stop";
					   else 							tempholder = joueur1.currentpos;
				   
					   
					   joueur1.setpos(tempholder);
					
			

				
            }
        }
        
    }
	document.getElementById("userAnswer").addEventListener("click", submitAnswer);