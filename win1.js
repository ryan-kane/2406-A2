module.exports = function (Board) {
	
	//Setting a draw counter to 0
	var draw = 0;
	//making a variable to show who has won
	var winner;
	//set the length required to win
	var win_length = Board.length-1;
	//Looping through the length of a board assuming it is square
	for (var len = 0; len < Board.length; len ++){
		
		
		//check if somone has won
		winner = check_a_line(Board,len,win_length);
		//check if there are any white spaces yet to check if its a draw
		draw += check_draw(Board,len);
		//if somone has won return the winner
		if (winner != "none") return winner
		 
	}
	//if there are no more white spaces then return that its a draw
	if (draw == 0){
		return "draw";
	}
	//if no one has one or its not a draw then return none
	return "none"
}

//check all directions for a win.
function check_a_line(Board,line,win_length){
	//counters for each row, column, and diagnols
	var rTotal = 0;
	var cTotal = 0;
	var ddTotal = 0;
	var udTotal = 0;
	
	//loop through each index of a direction
	for (var index =0; index < Board.length-1; index++){
		
		//for each direction check that two tiles are the same but not white
		//and if they are, then add to the counter.
		rTotal += compare_tiles(Board[index][line],Board[index+1][line]);
		cTotal += compare_tiles(Board[line][index],Board[line][index+1]);
		ddTotal += compare_tiles(Board[index][index],Board[index+1][index+1]);
		udTotal += compare_tiles(Board[index][Board.length-1-index],Board[index+1][Board.length-index-2]);
		
	}
	//if there is a winner in a direction return the winner by returning the last tile checked
	if (rTotal == (win_length)){
		return Board[index][line];
	}
	else if (cTotal == (win_length)){
		return Board[line][index];
	}
	else if (ddTotal == (win_length)){
		return Board[index][index];
	}
	else if (udTotal == (win_length)){
		return Board[index][Board.length-1-index];
	}
	//or if there is no winner return none
	else return "none"
}

//function that checks if two tiles are the same and not white
function compare_tiles (tile1,tile2){
	//if they are the same and not white then return 1
	if (((tile1 != "white")&&(tile2!="white"))&& (tile1 == tile2)){
		return 1;
	}
	//if not then return 0
	else return 0;
}

//function that checks if their is a draw
function check_draw (Board,col){
	
	//to check if it is a draw it checks every spot for if it is white
	for (var row = 0; row < Board[col].length; row++){
		//if it is white then return 1
		if (Board[row][col] == "white"){
			return 1
		}
	}
	//if not then return 0
	return 0;
}
