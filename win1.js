module.exports = function (Board) {
	//console.log(Board);
	var draw = 0;
	console.log("hi");
	for (var len = 0; len < Board.length; len ++){
		
		var winner = check_a_line(Board,len);
		draw += check_draw(Board,len);
		if (winner != "none") return winner
		 
	}
	if (draw == 0){
		return "draw";
	}
	return "none"
}

function check_a_line(Board,line){
	var rTotal = 0;
	var cTotal = 0;
	var ddTotal = 0;
	var udTotal = 0;
	for (var index =0; index < Board.length-1; index++){
		
		rTotal += compare_tiles(Board[index][line],Board[index+1][line]);
		cTotal += compare_tiles(Board[line][index],Board[line][index+1]);
		ddTotal += compare_tiles(Board[index][index],Board[index+1][index+1]);
		udTotal += compare_tiles(Board[index][Board.length-1-index],Board[index+1][Board.length-index-2]);
		
	}
	if (rTotal == (Board.length-1)){
		return Board[index][line];
	}
	else if (cTotal == (Board.length-1)){
		return Board[line][index];
	}
	else if (ddTotal == (Board.length-1)){
		return Board[index][index];
	}
	else if (udTotal == (Board.length-1)){
		return Board[index][Board.length-1-index];
	}
	else return "none"
}

function compare_tiles (tile1,tile2){
	if (((tile1 != "white")&&(tile2!="white"))&& (tile1 == tile2)){
		return 1;
	}
	else return 0;
}

function check_draw (Board,col){
	
	for (var row = 0; row < Board[col].length; row++){
		if (Board[row][col] == "white"){
			return 1
		}
	}
	return 0;
}
