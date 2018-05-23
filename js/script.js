var whole_array = ['A','A','B','B','C','C','D','D','E','E','F','F','G','G','H','H','I','I','J','J','K','K','L','L'];
var memory_array = ['A','A','B','B','C','C','D','D','E','E','F','F','G','G','H','H']; 
var rubashka_array = ["pics/Rubashka.jpg", "pics/Rubashka2.jpg", "pics/Rubashka3.jpg", "pics/Rubashka4.jpg"]
var memory_values = [];
var memory_tile_ids = [];
var tiles_flipped = 0;
var chosenOne = 0;
var difficulty = "easy";
var isStarted = false;

function shuffle(arr){
    var i = arr.length, j, temp;
    while(--i > 0){
        j = Math.floor(Math.random() * (i+1));
        temp = arr[j];
        arr[j] = arr[i];
        arr[i] = temp;
    }
}

document.getElementById("rubashka1").addEventListener("click", function(){
	chooseRubashka(0);
});
document.getElementById("rubashka2").addEventListener("click", function(){
	chooseRubashka(1);
});
document.getElementById("rubashka3").addEventListener("click", function(){
	chooseRubashka(2);
});
document.getElementById("rubashka4").addEventListener("click", function(){
	chooseRubashka(3);
});
document.getElementById("diff1").addEventListener("click", function(){
	chooseDifficulty(16,660,490,'easy');
});
document.getElementById("diff2").addEventListener("click", function(){
	chooseDifficulty(20,660,620,'medium');
});
document.getElementById("diff3").addEventListener("click", function(){
	chooseDifficulty(24,660,735,'hard');
});
document.getElementById("startButton").addEventListener("click", function(){
	newBoard();
});


function newBoard() {
		isStarted = false;
		ClearClock();
		tiles_flipped = 0;
		var output = '';
	    shuffle(memory_array);
		for(var i = 0; i < memory_array.length; i++){
			output += '<div class="container" id="tile_'+i+'" style="background: url('+rubashka_array[chosenOne]+') no-repeat; background-size: 100%;" onclick="memoryFlipTile(this,\''+memory_array[i]+'\')">';
			output += '</div>';
		}
		document.getElementById('board').innerHTML = output;
		try {
			leaderTable();
			document.getElementById('board').style.display = "inline-block";
			document.getElementById('board').style.margin = "auto";
			document.getElementById('board').style.marginLeft = "100px";
		}
		catch {
			document.getElementById('board').style.display = "block";
		}
		
	}

function leaderTable(){
	if (typeof(Storage) !== "undefined") {
		let output = "";
		for (var i = 0; i < 5; i++) {
			if (localStorage["name"+difficulty+i] == undefined)
				localStorage["name"+difficulty+i] = "Tyoma";
			if (localStorage["score"+difficulty+i] == undefined)
				localStorage["score"+difficulty+i] = "03:00";
			output += localStorage["name"+difficulty+i] + " " + localStorage["score"+difficulty+i] + "<br>"; 
		}
		document.getElementById("leadertable").innerHTML = output;
		document.getElementById("leadertable").style.display = "block";
		document.getElementById("nick").style.display = "inline-block";
    
	} else {

	}
}

//функция для очистки поля
function ClearClock() { 
	clearTimeout(clocktimer); 
	h=1;m=1;tm=1;s=0;ts=0;ms=0; 
	init=0;
	readout='00:00'; 
	document.getElementById("secondo").innerHTML = "<span id='timer' class='time'>"+readout+"</span>"; 
} 	
	
function memoryFlipTile(tile,val) {
	if(tile.style.transform != "rotateY(180deg)")
		if (memory_values.length < 2){
			tile.style.transform = "rotateY(180deg)";
			setTimeout(rotate, 310, tile, val);
			if(memory_values.length == 0){
				memory_values.push(val);
				memory_tile_ids.push(tile.id);
			} else if(memory_values.length == 1){
				memory_values.push(val);
				memory_tile_ids.push(tile.id);
				if(memory_values[0] == memory_values[1]){
					tiles_flipped += 2;
					memory_values = [];
	            	memory_tile_ids = [];
					if(tiles_flipped == memory_array.length){
						StartStop();
						setTimeout(restart, 1000);			
					}
				} 
				else 
					setTimeout(flip2Back, 1000);
			}
		}
	}

function rotate(tile, val) {
	tile.classList.add('rotatedCard'+val);
	if (!isStarted)
	{
		StartStop();
		isStarted = true;
	}
}

function timeToInt(time){
	let arr = time.split(":");
	return arr[0]*60+arr[1];
}

function move(name, val, index) {
	let newname = localStorage["name"+difficulty+index];
	let newscore = localStorage["score"+difficulty+index];
	if (name == "")
		name = "Anonymous";
	localStorage.setItem("name"+difficulty+index, name);
	localStorage.setItem("score"+difficulty+index, val);
	index++;
	if (index !== 5)
		move(newname, newscore, index);
}

function checkHighscore() {
		for (var i = 0; i < 5; i++) {
			if (localStorage["score"+difficulty+i] == "undefined" || timeToInt(readout) < timeToInt(localStorage["score"+difficulty+i]))
			{
				move(document.getElementById("nick").value, readout, i);
				break;
			}
		}
	//localStorage.setItem("nameeasy1", "Vlados");
	//localStorage.setItem("scoreeasy1", "00:29");
}

function restart() {
	for (var i = 0; i < memory_array.length; i++)
	{
		var tile = document.getElementById("tile_"+i);
		tile.style.transform = "rotateY(0deg)";
	} 
	checkHighscore();
	// setTimeout(wtf, 300);
	// function wtf(){
	// 	for (var i = 0; i < memory_array.length; i++) {	
	// 		var tile = document.getElementById("tile_"+i);
	// 		for (var i = 0; i < memory_array.length/2; i++)
	// 		{
	// 			tile.classList.remove("rotatedCard"+i);
	// 		}
	// 		tile.style.background = 'url('+rubashka_array[chosenOne]+') no-repeat';
	// 		tile.style.backgroundSize = '100%';
	// 	}
	// }
	//setTimeout(alert, 1000, "Board cleared... generating new board\nYour time is "+document.getElementById("timer").innerHTML);
	alert("Board cleared... generating new board\nYour time is "+document.getElementById("timer").innerHTML);
	document.getElementById('board').innerHTML = "";
	newBoard();
}

function changeToBack(tile, val) {
	tile.classList.remove("rotatedCard"+val);
	tile.style.background = 'url('+rubashka_array[chosenOne]+') no-repeat';
	tile.style.backgroundSize = '100%';
}

function flip2Back() {
	var tile_1 = document.getElementById(memory_tile_ids[0]);
	var tile_2 = document.getElementById(memory_tile_ids[1]);
	tile_1.style.transform = "rotateY(0deg)";
	setTimeout(changeToBack, 310, tile_1, memory_values[0]);    
	tile_2.style.transform = "rotateY(0deg)";
	setTimeout(changeToBack, 310, tile_2, memory_values[1]);
	memory_values = [];
    memory_tile_ids = [];
}

function SleevesHideOrShow() {
	if (document.getElementById("rubashka_box").style.display == "block")
		document.getElementById("rubashka_box").style.display = "none";
	else
		document.getElementById("rubashka_box").style.display = "block"; 
} 

function chooseRubashka(value) {
	chosenOne = value;
	StartStop();
	newBoard();
}

function chooseDifficulty(val, height, width, diff) {
	difficulty = diff;
	memory_array = whole_array.slice(0,val);
	document.getElementById('board').style.height = height+"px";
	document.getElementById('board').style.width = width+"px";
	document.getElementById('board').style.display = "none";
	StartStop();
	newBoard();
}

//объявляем переменные
var base = 60; 
var clocktimer,dateObj,dh,dm,ds,ms; 
var readout=''; 
var h=1,m=1,tm=1,s=0,ts=0,ms=0,init=0;

//функция для старта секундомера
function StartTIME() { 
	var cdateObj = new Date(); 
	var t = (cdateObj.getTime() - dateObj.getTime())-(s*1000); 
	if (t>999) { s++; } 
	if (s>=(m*base)) { 
		ts=0; 
		m++; 
	} else { 
		ts=parseInt((ms/100)+s); 
		if(ts>=base) { ts=ts-((m-1)*base); } 
	} 
	if (m>(h*base)) { 
		tm=1; 
		h++; 
	} else { 
		tm=parseInt((ms/100)+m); 
		if(tm>=base) { tm=tm-((h-1)*base); } 
	} 
	if (ts>0) { ds = ts; if (ts<10) { ds = '0'+ts; }} else { ds = '00'; } 
	dm=tm-1; 
	if (dm>0) { if (dm<10) { dm = '0'+dm; }} else { dm = '00'; } 
	readout = dm + ':' + ds; 
	document.getElementById("secondo").innerHTML = "<span id='timer' class='time'>"+readout+"</span>";
	clocktimer = setTimeout("StartTIME()",1); 
} 

//Функция запуска и остановки
function StartStop() { 
	if (init==0){ 
		ClearClock();
		dateObj = new Date(); 
		StartTIME(); 
		init=1; 
	} else { 
		clearTimeout(clocktimer);
		init=0;
	} 
}