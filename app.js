var http = require('http');
var url = require('url');
var fs = require('fs');

ROOT_DIR = 'html';

var People = [];

var Board = [
    ["white", "white", "white"],
    ["white", "white", "white"], 
    ["white", "white", "white"]];
    
var info = "";    

var turn = 0;

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

function win(){
    //logic for if the game is over
    //return who won the game of if its a draw
    return false;
}

var server = http.createServer((request, response)=>{
	
	var urlObj = url.parse(request.url, true, false);	
	console.log('\n============================');
	console.log("PATHNAME: " + urlObj.pathname);
    console.log("REQUEST: " + urlObj.pathname);
    console.log("METHOD: " + request.method);
	
    var receivedData = "";
	
	//attached event handlers to collect the message data
	request.on("data", function(chunk) {
		receivedData += chunk;
	});
	
	request.on("end", function(){
		console.log('received data: ', receivedData);
        console.log('type: ', typeof receivedData);
		
		//if it is a POST request then echo back the data.
		if(request.method == "POST"){
		   var dataObj = JSON.parse(receivedData);
           console.log('received data object: ', dataObj);
           console.log('type: ', typeof dataObj);
           console.log("USER REQUEST: " + dataObj.text);	
           
           //what are they trying to do
           var whosTurn = People[turn % People.length];
           if(win()){
               info = "somebody won"
           }else{

            if(dataObj.text == "Player Move"){
                //if they have a token
                if(dataObj.Person.token != null && dataObj.Person.token == whosTurn){
                    posX = dataObj.Move[0];
                    posY = dataObj.Move[1];
                    //check space on the Board
                    if(Board[posX][posY] == "white"){
                        Board[posX][posY] = dataObj.Person.token;
                        info = "good move";
                        turn++;
                    }else{
                        info = "that space is already taken";
                    }
                }else{
                    if(dataObj.Person.token != whosTurn){
                        info = "not your turn";
                    }else if (dataObj.Person.token == null) {
                        info = "please select a Colour first";
                    }
                }
            }else if(dataObj.text == "register"){
                //for registering
                //the person already registered can switch if there is only one player
                if(People.length < 2){
                    if(People.includes(dataObj.Person.token)){
                        info = "that colour is taken";
                        Person = {token : null};
                    }else{
                        People.push(dataObj.Person.token);
                        info = null;                
                    }
                }else{
                    info = "the game has 2 players";
                    dataObj.Person = {token : null};
                }

            }else if(dataObj.text == "update"){
                if(People.length != 2){
                    info = "waiting for players to join";
                }else{
                    info = "Player " + People[((turn % People.length)+1)] + "'s turn";    
                }
            }else if(dataObj.text == "reset"){
                for(i = 0; i < 3; i++){
                    for(j = 0; j < 3; j++){
                        Board[i][j] = "white";
                    }
                }
                People = [];
                info = "reset";
            }
        }
           var returnObj = {text : info,
                            Person : dataObj.Person,
                            Board : Board};
            console.log(returnObj);
		   		   
		   //object to return to client
           response.writeHead(200, {'Content-Type': MIME_TYPES['json']});  
           response.end(JSON.stringify(returnObj)); //send just the JSON object
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