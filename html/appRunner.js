var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

//where the mouse is
var deltaX, deltaY;

/*
the board will be a an array of arrays like a grid where the 
arrays act like rows with the index acts like the column

the board is square so there are the same number of cols as rows
*/
var size = 10;

function buildBoard(){

    var board = new Array;

    for(i = 0; i < size; i++)
    {
        board[i] = new Array;
        for(j = 0; j < size; j++)
        {
            board[i][j] = "white";
        }
    }



    //iterate through the board and fill the proper squares
    for(i = 0; i < size; i++)
    {
        for(j = 0; j < size; j++)
        {
            context.beginPath();
            context.rect(i * 48, j * 48, 48, 48);
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
    //add code here
    console.log("Hello");
}

/*
finds the sqaure that the user clicked based on where the mouse is and
updates the server

-should not work if the user has not registered
*/
function handleCanvasClick(event){
    
    rect = canvas.getBoundingClientRect();

    //mouse position
    deltaX = event.clientX - rect.left;
    deltaY = event.clientY - rect.top;
    
    event.stopPropagation();
    event.preventDefault();
    
    var x = Math.floor(deltaX/48);
    var y = Math.floor(deltaY/48);

    console.log("square position : (" + x  + ", " + y + ")");

    //JSON object containing the
    var position = {x : deltaX, y : deltaY};


    /*
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function()
    {
        if(this.readyState == 4 && this.status == 200)
        {
            console.log(this.responseText);
        }
    }
    console.log(position);
    JSONPosition = JSON.stringify(position);
    console.log(JSONPosition);
    xhttp.open("POST", '/', true);
    xhttp.send(JSONPosition);
    */
}

document.addEventListener('DOMContentLoaded', function(){
    //user chooses a colour
    document.getElementById('register').addEventListener('onclick', handleRegister);

    //user clicks the canvas
    canvas.addEventListener('click', handleCanvasClick);
    buildBoard();

});