var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

//objects that will be sent back to the server
var Person = {token : null};
var Board = [
    ["white", "white", "white"],
    ["white", "white", "white"], 
    ["white", "white", "white"]];

var pollingTimer;

/*
the board will be a an array of arrays like a grid where the 
arrays act like rows with the index acts like the column

the board is square so there are the same number of cols as rows
*/
var size = 3;

function buildBoard(){

    var board = new Array;

    for(i = 0; i < size; i++)
    {
        board[i] = new Array;
        for(j = 0; j < size; j++)
        {
            board[i][j] = Board[i][j];
        }
    }



    //iterate through the board and fill the proper squares
    for(i = 0; i < size; i++)
    {
        for(j = 0; j < size; j++)
        {
            context.beginPath();
            context.rect(i * 160, j * 160, 160, 160);
            context.fillStyle = board[i][j];
            context.fill();
            context.stroke();
        }
    }
}

/*
finds which colour is selected and picks registers the user for that colour
by contacting the server

-user has to have selected a colour
*/
function handleRegister(){
    //send the chosen player token
    //check if they are already registered
    if(Person.token != null){
        
    }else{
        //receive answer and player identity
        if(document.getElementById("radio_Blue").checked){
            Person.token = "Blue";
            sendObj = {text : "register", Person : Person};
            POSTToServer(JSON.stringify(sendObj));
        }else if(document.getElementById("radio_Orange").checked){
            Person.token = "Orange";
            sendObj = {text : "register", Person : Person};
            POSTToServer(JSON.stringify(sendObj));
        }else{
            document.getElementById("warning").innerHTML = "Please select a Colour"
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
    
    console.log("square position : (" + x  + ", " + y + ")");

    //object to send to server

    var sendObj = {Person : Person,
                    Move : [x, y],
                    text : "Player Move"};

    document.getElementById("warning").innerHTML = "Playing Move...";
    POSTToServer(JSON.stringify(sendObj));
}

function POSTToServer(sendObj){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            response = JSON.parse(this.responseText);
            console.log("response: " + this.responseText);
            if(response.text) document.getElementById("warning").innerHTML = response.text;
            if(response.text == "reset"){
                document.getElementById("warning").innerHTML = "";
                document.getElementById("who").innerHTML = "";
            }
            Person = response.Person;
            if(Person.token != null){
                document.getElementById("who").innerHTML = "You are " + Person.token;                            
            }else{
                document.getElementById("who").innerHTML = "";
            }
            Board = response.Board;
            buildBoard();
        }
    }
    console.log("sendObj" + sendObj);
    xhttp.open("POST", '/', true);
    xhttp.send(sendObj);
}

function reset(){
    document.getElementById("warning").innerHTML = "resetting...";
    sendObj = {text : "reset",
                Person : Person};
    POSTToServer(JSON.stringify(sendObj));
    document.getElementById("warning").innerHTML = "";
    document.getElementById("who").innerHTML = "";
}

function handleUpdate(){
    console.log("polling update...");
    sendObj = {text : "update",
                Person : Person};
    POSTToServer(JSON.stringify(sendObj));
    
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