var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

//objects that will be sent back to the server
var sendObj = { 'Player' : null,
                'text' : "",
                'Move' : [0,0]
            };
/*
the board will be a an array of arrays like a grid where the 
arrays act like rows with the index acts like the column

the board is square so there are the same number of cols as rows
*/
var size = 3;

function buildBoard(board, movingString){
    //iterate through the board array and fill the proper squares on the canvas
    for(i = 0; i < size; i++)
    {
        for(j = 0; j < size; j++)
        {
            context.beginPath();
            context.rect(i * 160, j * 160, 160, 160);
            context.fillStyle = board[i][j]; //this position is a colour
            context.fill();
            context.stroke();
        }
    }

    //create the moving string on the canvas
    context.fillStyle = "black";
    context.strokeStyle = "black";
    context.font = "30px Arial";
    movingString.stringWidth = context.measureText(movingString.word).width
    console.log(movingString.stringWidth);
	context.fillText(movingString.word, movingString.x, movingString.y);
	
}

/*
finds which colour is selected and picks registers the user for that colour
by contacting the server

-user has to have selected a colour in order to register
-user cant already be registered
*/
function handleRegister(){
    //send the chosen player token
    //check if they are already registered
    console.log()
    if(sendObj.Player == null){
        //receive answer and player identity
        if(document.getElementById("radio_Blue").checked){
            sendObj.Player = "Blue";
            sendObj.text = "register";
            document.getElementById("radio_Blue").checked = false;
            console.log(sendObj);            
            POSTToServer(JSON.stringify(sendObj));
        }else if(document.getElementById("radio_Orange").checked){
            sendObj.Player = "Orange";
            sendObj.text = "register";
            document.getElementById("radio_Orange").checked = false;
            console.log(sendObj);
            POSTToServer(JSON.stringify(sendObj));
        }else{
            document.getElementById("info").innerHTML = "Please select a Colour";
        }
    }
}
/*
finds the sqaure that the user clicked based on where the mouse is and
updates the server
-should not work if the user has not registered
*/
function handleCanvasClick(event){
    
    rect = canvas.getBoundingClientRect();

    //mouse position    
    
    var x = Math.floor((event.clientX - rect.left)/160);
    var y = Math.floor((event.clientY - rect.top)/160);

    event.stopPropagation();
    event.preventDefault();

    sendObj.Move[0] = x;
    sendObj.Move[1] = y;
    sendObj.text = "Player Move";

    document.getElementById("info").innerHTML = "Playing Move...";
    POSTToServer(JSON.stringify(sendObj));
}

//resets the game in the client and the server
function reset(){
    sendObj.text = "reset";
    sendObj.Player = null;
    sendObj.Move = [0,0];
    POSTToServer(JSON.stringify(sendObj));
    document.getElementById("info").innerHTML = "Reset";
    document.getElementById("who").innerHTML = "";
}

//polls the server for new information about the game
function handleUpdate(){
    console.log("polling update...");
    sendObj.text = "update";
    POSTToServer(JSON.stringify(sendObj));
}

//posts the sendObj to the server
//receives the information from the server to 
//update the html page
function POSTToServer(JSONsendObj){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            responseObj = JSON.parse(this.responseText);
            sendObj.Player = responseObj.Player;
            buildBoard(responseObj.Board, responseObj.movingString);
            document.getElementById("info").innerHTML = responseObj.info;
            if(responseObj.Player){
                document.getElementById("who").innerHTML = "You are " + responseObj.Player;                            
            }else{
                document.getElementById("who").innerHTML = "";                            
            }   
        }
    }
    //console.log("sendObj" + sendObj);
    xhttp.open("POST", '/', true);
    xhttp.send(JSONsendObj);
}

document.addEventListener('DOMContentLoaded', function(){
    //user chooses a colour
    document.getElementById('btn_register').addEventListener('click', handleRegister);

    //resets game
    document.getElementById("btn_reset").addEventListener('click', reset);
    //user clicks the canvas
    canvas.addEventListener('click', handleCanvasClick);

    pollingTimer = setInterval(handleUpdate, 1000); //one second

});