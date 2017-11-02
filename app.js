var http = require('http');
var url = require('url');
var fs = require('fs');
var win1 = require('./win1');

ROOT_DIR = 'html';

var sendObj = { 'Player' : null,
                'Board' : [
                        ["white", "white", "white"],
                        ["white", "white", "white"], 
                        ["white", "white", "white"]],
                'info' : "",
                'movingString' : {'visible': false,
                                'word' : "",
                                'x' : 100,
                                'y' : 100,
                                'xDirection' : 1, //+1 for leftwards, -1 for rightwards
                                'yDirection' : 1, //+1 for downwards, -1 for upwards
                                'stringWidth' : 145, //will be updated when drawn
                                'stringHeight' : 35
                            }
            };
Players = [];
turn = 0;

//variable to keep track of canvas size (set to 480x480)
var canvas = { 'width' : 480, 'height': 480};

var MIME_TYPES = {
    'css': 'text/css',
    'gif': 'image/gif',
    'htm': 'text/html',
    'html': 'text/html',
    'ico': 'image/x-icon',
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpeg',
    'js': 'text/javascript', 
    'json': 'application/json',
    'png': 'image/png',
    'txt': 'text/text'
};

var get_mime = function(filename) {
    var ext, type;
    for (ext in MIME_TYPES) {
        type = MIME_TYPES[ext];
        if (filename.indexOf(ext, filename.length - ext.length) !== -1) {
            return type;
        }
    }
    return MIME_TYPES['txt'];
};

//utilize the module we created to check if the game is over based on the board
function win(){
    //logic for if the game is over
    //return who won the game of if its a draw
    var winner2 = win1(sendObj.Board);
    if (winner2 != "none"){
        if(winner2 == "draw"){
            sendObj.info = "It's a draw!";
            return true;
        }else{
            sendObj.info = winner2 + " wins!";
            return true;
        }
    }
}

//checks the players move and then updates the board
function playerMove(playerObj){
    sendObj.Player = playerObj.Player;    
    //check if they have a colour
    if(playerObj.Player != null && playerObj.Player == Players[turn]){
        
        posX = playerObj.Move[0]
        posY = playerObj.Move[1];

        //check the space on the Board
        if(sendObj.Board[posX][posY] == "white"){
            sendObj.Board[posX][posY] = playerObj.Player;
            sendObj.info = "good move";
            if(turn == 0){
                turn = 1;
            }else{
                turn = 0;
            }
        }else{
            sendObj.info = "that space is already taken";
        }
    }else{
        if(playerObj.Player != Players[turn]){
            sendObj.info = "not your turn";
        }
        if (playerObj.Player == null) {
            sendObj.info = "please select a Colour first";
        }
    }
}

//registers a player to a colour
//once a player is registered they cannot re-register
function register(playerObj){
    //for registering
    //the person already registered can switch if there is only one player
    if(Players.length < 2){
        if(Players.includes(playerObj.Player)){
            sendObj.info = "that colour is taken";
            sendObj.Player = null;
        }else{
            Players.push(playerObj.Player);
            sendObj.info = null; 
            sendObj.Player = playerObj.Player;               
        }
    }else{
        sendObj.info = "the game has 2 players";
        sendObj.Player = null;
    }
}

//handles the constant polling from different clients and
//keeps track of the registered players
function update(playerObj){
    sendObj.Player = playerObj.Player;
    if(Players.length == 0){
        sendObj.Player = null;
    }
    if(Players.length < 2){
        sendObj.info = "waiting for players to join";
    }else{
        sendObj.info = Players[turn] + "'s turn";   
    }     
}

//resets the game so that it can be played again
//unregisters all the players
function reset(){
    sendObj.Player = null;
    sendObj.Board = [["white", "white","white"], ["white", "white","white"], ["white", "white","white"]];
    sendObj.info = "";
    Players = [];
    turn = 0;
    sendObj.movingString.visible = false;
    sendObj.movingString.word = "";
}

//this is the static server, the code for this and the get_mime() function
//were taken from the 2406 class notes http://people.scs.carleton.ca/~comp2406/notes/
var server = http.createServer((request, response)=>{
	
	var urlObj = url.parse(request.url, true, false);	
	// console.log('\n============================');
	// console.log("PATHNAME: " + urlObj.pathname);
    // console.log("REQUEST: " + urlObj.pathname);
    // console.log("METHOD: " + request.method);
	
    var receivedData = "";
	
	//attached event handlers to collect the message data
	request.on("data", function(chunk) {
		receivedData += chunk;
	});
	
	request.on("end", function(){
		// console.log('received data: ', receivedData);
        // console.log('type: ', typeof receivedData);
		
		//if it is a POST request then echo back the data.
		if(request.method == "POST"){
           var dataObj = JSON.parse(receivedData);
        //  console.log('received data object: ', dataObj);
        //  console.log('type: ', typeof dataObj);
        //  console.log("USER REQUEST: " + dataObj.text);	
        //  check if there was a winner
            if(!win()){
                 //  what are they trying to do
                if(dataObj.text == "Player Move"){               
                    playerMove(dataObj);
                }else if(dataObj.text == "register"){                   
                    register(dataObj);
                }else if(dataObj.text == "update"){
                    update(dataObj);
                }
            }else{
                if ((sendObj.info == "It's a draw!") ||(sendObj.info == "Blue wins!")||(sendObj.info == "Orange wins!")){
                    sendObj.movingString.visible = true;
                    sendObj.movingString.word = sendObj.info;
                }
                
                sendObj.movingString.x = sendObj.movingString.x + 5 * sendObj.movingString.xDirection;
                sendObj.movingString.y = sendObj.movingString.y + 5 * sendObj.movingString.yDirection;
    
                //keep moving word within bounds of canvas
                if (sendObj.movingString.x + sendObj.movingString.stringWidth > canvas.width) sendObj.movingString.xDirection = -1;
                if (sendObj.movingString.x < 0) sendObj.movingString.xDirection = 1;
                if (sendObj.movingString.y > canvas.height) sendObj.movingString.yDirection = -1;
                if (sendObj.movingString.y - sendObj.movingString.stringHeight < 0) sendObj.movingString.yDirection = 1;
            }
            if(dataObj.text == "reset"){
                reset();
            }
            console.log("\n \n \n \n \n");
            console.log("Player : " + sendObj.Player);
            console.log("Board : " + sendObj.Board);
            console.log("Players : " + Players);
            console.log(JSON.stringify(sendObj));
            		   		   
		   //object to return to client
           response.writeHead(200, {'Content-Type': MIME_TYPES['json']});  
           response.end(JSON.stringify(sendObj)); //send just the JSON object
        }
    
        if(request.method == "GET"){
	        //handle GET requests as static file requests
	        var filePath = ROOT_DIR + urlObj.pathname;
	        if(urlObj.pathname === '/') filePath = ROOT_DIR + '/index.html';

            fs.readFile(filePath, function(err,data){
               if(err){
		         //report error to console
                 console.log('ERROR: ' + JSON.stringify(err));
		         //respond with not found 404 to client
                 response.writeHead(404);
                 response.end(JSON.stringify(err));
                 return;
               }
               response.writeHead(200, {'Content-Type': get_mime(filePath)});
               response.end(data);
            });
	    }
	});
})
server.listen(3000,()=>{
	console.log('Server is listening on port 3000');
});