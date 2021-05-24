/* Code to disable right click menu to allow functionality found from https://www.codeinwp.com/snippets/disable-right-click-context-menu/*/
window.addEventListener('contextmenu', function (e) {  
    e.preventDefault(); 
}, false);

/*Global variables used throughout functions, initial values are for default game on page load*/
let dimension = 10; /*Size of the grid*/
let newDimension = 10; /*Takes size input from the user*/
let bombsNo = 15;   /*Number of hidden bombs*/
let newBombs = 15;  /*Takes bomb input from the user*/
let revealCount = 0;    /*Checks how many non-bomb tiles are left to be revealled*/
let flagCount = 0;  /*Adds up how many flags the user has on the board*/
let tileArray = new Array(); /*Stores properties for every tile in play*/
let loseCondition = false; /*Checks if the player has lost the game*/
let winCondition = false;   /*Checks if the player has won the game*/
let mobileFlagSetting = true; /*Checks if the player has toggles the optional flag button*/

newGame();  /*Runs an initial game on startup*/

 /*Function responsible for setting up a game of minesweeper*/
function newGame(){ 
    /*Sets global variables to their default*/
    loseCondition = false;
    winCondition = false;
    flagCount = 0;
    /*Takes inputted data from user*/
    dimension = newDimension;
    bombsNo = newBombs;
    /*Calculated how many non-bomb tiles there are*/
    revealCount = dimension*dimension - bombsNo;
    /*Sets players on mobile to reveal a tile on tap*/  
    mobileFlagToTile();

    /*Retrieves the container div from the document*/
    let gameArea = document.getElementById("minefield-area");

    /*If the div has any children (tiles from previous game) it removes them*/
    while (gameArea.firstChild) {
        gameArea.removeChild(gameArea.firstChild);
    }

    /*Local variable checks which tile is being made currently in the grid*/
    var tileCount = 0;

    /*Runs the rows of the grid*/
    for(let x=0; x<dimension; x++){
        /*Makes a container div for every row, helps with dynamic scaling*/
        let lineElement = document.createElement("div");

        /*Runs the columns of the grid*/
        for(let y=0; y<dimension; y++){

            /*Takes note of which tile is being made*/
            let location = tileCount;

            /*Makes a Div that acts as a clickable tile. Adds left click and right click functionality for computer users*/
            let tileElement = document.createElement("div");
            tileElement.classList.add("game-tile");
            tileElement.onclick = function() {revealTile(tileElement,location)}; /*Left click reveals a tile*/
            tileElement.oncontextmenu = function() {flagTile(tileElement,location)}; /*Right click flags a tile*/

            /*Calculates what size the tiles need to be to fit on the board depending on the grid size and user's screenwidth*/
            let resizer = (gameArea.offsetWidth - 20)/dimension -10; 

            /*Sets the height and width of each tile accordingly*/
            tileElement.style.height = resizer+"px";
            tileElement.style.width = resizer+"px";

            /*Creates a span and an I element for use in revealing adjacency of a tile/ icon of a tile when interacted with*/
            let spanElement = document.createElement("p");
            let iElement = document.createElement("i");
            iElement.classList.add("fa") /*Automatically adds the fontawesome static class to the i element*/

            /*Adds the i element in the span, the span element in the tile, and adds the tile to the line container*/
            spanElement.appendChild(iElement); 
            tileElement.appendChild(spanElement);
            lineElement.appendChild(tileElement);

            /*Adds a default object of each tile to an array*/
            tileArray[tileCount] = {
                adjacency: 0,
                bomb: false,
                revealed: false,
                flagged: false
            }
            /*Increments the tile count by 1*/
            tileCount += 1;
        }
        /*Adds the line container to the board*/
        gameArea.appendChild(lineElement);
    }

    /* Set Tiles as bombs */
    let bombsPlaced = 0;
    do{
        let bombPlacement = Math.floor((Math.random() * (dimension*dimension))+0); /*Math.random() function allows for a bomb to be placed on any tile on the board*/ 
        if(!tileArray[bombPlacement].bomb){ /*Checks if the tile chosen isnt already a bomb*/
            tileArray[bombPlacement].bomb = true;  /*Makes the tile a bomb ny changing the corresponding object in the array*/
            bombsPlaced += 1;   /*Counts how many bombs have been made*/
        }
    }while(bombsPlaced<bombsNo); /*Checks that bombs made equals the user's input*/

    /*Checks how many bombs a tile is adjacent to*/
    for(let i = 0; i < dimension*dimension; i++){ /*Runs through all the tiles on the board*/
        let adjacentBombs = 0; /*Sets the amount of adjacent bombs to zero*/

        /*Sets the initial value of j to the tile north-west of tile 'i', keeps running till the south east*/
        for(let j = -dimension-1; j <= dimension+1; j++){ 
            /*Checks if j is a cardinal direction*/
            if((j == -dimension-1 || j == -dimension || j == -dimension+1 || j == -1 || j == 1 || j == dimension -1 || j == dimension || j == dimension + 1) && checkPossible(i,j)){
                 /*Checks if the direction j is a bomb*/
                if(tileArray[i+j].bomb){
                    adjacentBombs += 1; /*Increments the adjacency counter*/
                }
            }
        }
        tileArray[i].adjacency = adjacentBombs; /*Sets the adjacency value of tile 'i' by saving to the object*/
    }
    updateStatus();  /*Initialises the GUI with useful information for the player*/
}

/*Function that reveals a tile when clicked by the user*/
function revealTile(tileElement,location){ /*Passes through the specific tile element clicked and its position in the grid*/

    /*Checks if the player has lost the game, reveals any wrongly flagged non-bomb tiles*/
    if(loseCondition && tileArray[location].flagged && !tileArray[location].bomb){
        flagTile(tileElement,location);
    }
    /*Checks if the player has won the game, flags any remaining non flagged bombs*/
    if(winCondition && !tileArray[location].flagged && tileArray[location].bomb){
        flagTile(tileElement,location);
    }
    /*Checks if the user has the optional flag button pressed instead, flags the tile instead of revealing*/
    if(mobileFlagSetting){
        flagTile(tileElement,location);
    }
    else{
        /*Checks if the tile clicked on has already been revealed, or has been flagged to avoid revealing*/
        if(!tileArray[location].flagged && !tileArray[location].revealed){
            /*Sets the relevant tile object as revealed*/
            tileArray[location].revealed = true;
    
            /*Checks if the tile clicked is a bomb*/
            if(tileArray[location].bomb){
                /*Sets the bomb icon and colours the tile red*/
                tileElement.firstChild.firstChild.classList.add("fa-bomb")
                tileElement.style.backgroundColor = "red";
    
                /*Checks if the game isnt already over (Used to avoid looping if all tiles need to be revealled due to game loss*/
                if(!loseCondition && !winCondition){
                    alert("you lose"); /*Alerts the player that they have lost the game*/
                    loseCondition = true; /*Registers in the code that the player has lost*/
                    /*Runs through all the tiles, revealing them to the player*/
                    for(let i = 0; i < dimension; i++){
                        for(let j = 0; j < dimension; j++){
                            let lineChild = document.getElementById("minefield-area").children[i];
                            let tileChild = lineChild.children[j];
                            revealTile(tileChild,(i*dimension + j));
                        }
                    }
                }
                
            }
            else{
                /*Displays the adjacency number on the tile*/
                tileElement.firstChild.innerHTML = tileArray[location].adjacency;
    
                /*Changes the colour of the tile depending on the adjacency value*/
                switch (tileArray[location].adjacency){
                    case 1:
                        tileElement.style.backgroundColor = "rgb(250,255,80)";;
                    break;
                    case 2:
                        tileElement.style.backgroundColor = "rgb(63,208,73)";
                    break;
                    case 3:
                        tileElement.style.backgroundColor = "rgb(93,93,226)";
                    break;
                    case 4:
                        tileElement.style.backgroundColor = "rgb(95,216,204)";
                    break;
                    case 5:
                        tileElement.style.backgroundColor = "rgb(230,164,77)";
                    break;
                    case 6:
                        tileElement.style.backgroundColor = "rgb(203,69,69)";
                    break;
                    case 7:
                        tileElement.style.backgroundColor = "rgb(117,93,51)";
                    break;
                    case 8:
                        tileElement.style.backgroundColor = "rgb(135,62,178)";
                    break;
                    default:
                        /*The default tile colour*/
                        tileElement.style.backgroundColor = "grey";
                        revealAdjacentGrey(location); /*If a tile that is adjacent to no bombs is clicked, it should reveal the tiles in the cardinal directions, this creates a chain reaction revealling all touching empty tiles*/
                    break;
                }
                /*Notes that a safe tile has been revealed and updates the user on how many are left*/
                revealCount -= 1;
                updateStatus();
            }
        }
    }

    /*Checks if all the non-bomb tiles have been revealed, and that the game isnt already over to avoid looping*/
    if(revealCount == 0 && !loseCondition && !winCondition){
        alert("you Win!"); /*Notifies the user that they have won the game*/
        winCondition = true; /*Registers in the code that the player has won the game*/
        /*Runs through all the tiles, revealing them to the player (Specifically bomb tiles)*/
        for(let i = 0; i < dimension; i++){
            for(let j = 0; j < dimension; j++){
                let lineChild = document.getElementById("minefield-area").children[i];
                let tileChild = lineChild.children[j];
                revealTile(tileChild,(i*dimension + j));
            }
        }
    }
}

/*Checks if the cardinal direction submitted is actually on the board (for example attempting to go further east on the right side of the board*/
function checkPossible(i,j){
    sum = i + j;
    if(sum < 0 || sum >= dimension*dimension){  /*Checks if the value is out of bounds to avoid array index issues*/
        return false;
    }
    else if((i%dimension == 0 && sum%dimension == dimension-1) || (i%dimension == dimension-1 && sum%dimension == 0)){ /*Checks the left and right of the board by using remainders to get the specific x position*/
        return false;
    }
    return true;
}

/*Function that is called when a tile is flagged, allows the user to safely mark bombs so they cant be clicked*/
function flagTile(tileElement,location){ /*Passed through the tile clicked and its location*/
    if(!tileArray[location].flagged){ /*Checks if the tile isnt flagged yet*/
        tileArray[location].flagged = true; /*Change the objects status*/
        tileElement.firstChild.firstChild.classList.add("fa-flag") /*Change the icon on the tile*/
        tileElement.style.backgroundColor = "blanchedalmond"; /*Change the colour of the tile*/
        flagCount += 1;  /*Updates the number of flags the user is using currently*/
    }
    else{ /*A flagged tile that the user wants to unflag*/
        tileArray[location].flagged = false; /*Change the objects status*/
        tileElement.firstChild.firstChild.classList.remove("fa-flag") /*Removes the icon on the tile*/
        tileElement.style.backgroundColor = "white"; /*Change the colour of the tile to unclicked*/
        flagCount -= 1; /*Updates the number of flags the user is using currently*/
    }
    updateStatus(); /*Tells the GUI to update for the user as flag count has changed*/
}

/*Function specifically to reveal tiles in cardinal directions to grey tiles, needed slightly different code than previous to iterate. Sends through the current tile location only*/
function revealAdjacentGrey(location){ 
    /*Runs through the northwest to southeast as before*/
    for(let j = -dimension-1; j <= dimension+1; j++){
        /*Checks if j is a cardinal direction from the tile parameter*/
        if((j == -dimension-1 || j == -dimension || j == -dimension+1 || j == -1 || j == 1 || j == dimension -1 || j == dimension || j == dimension + 1) && checkPossible(location,j)){
            let sum = location + j; /*Adds the parameter tile's location to j to get the new tile location being studied*/
            
            /*Reveals the adjacent tile's location, if grey it will iterate through this again and reveal more akin to a stack*/
            let lineChild = document.getElementById("minefield-area").children[parseInt(sum/dimension)];
            let tileChild = lineChild.children[sum%dimension];
            revealTile(tileChild,sum);
        }
    }    
}

/*Event listener to notify if the window changes size taken from https://developer.mozilla.org/en-US/docs/Web/API/Window/resize_event*/
window.addEventListener('resize', resizeTiles);  

/*Function activated if the user resizes their window, dynamically scales all the tiles on the board to fit in the new window*/
function resizeTiles(){
    let gameArea = document.getElementById("minefield-area"); /*Gets the new window size*/
    let resizer = (gameArea.offsetWidth - 20)/dimension -10; /*Maths out the new width/height needed*/
    /*Iterates through all the tiles on the board changing their size*/
    for(let i = 0; i < dimension; i++){
        for(let j = 0; j < dimension; j++){
        
            let lineChild = document.getElementById("minefield-area").children[i];
            let tileChild = lineChild.children[j];
            tileChild.style.height = resizer+"px";
            tileChild.style.width = resizer+"px";
        }
    }
}

/*If the user clicks the up chevron for the dimension variable, the dimension setting for a new game are increased*/
function increaseDimension(){
    newDimension += 1;
    if(newDimension>15){ /*Limits the max size to 15, the algorithm i made can take higher values however it gets to a point where screen size limits it too much*/
        newDimension = 15;
    }
    dimensionElement = document.getElementById("dimension-value"); /*Gets the container for the dimension value and updates it with the user increment*/
    dimensionElement.innerHTML = newDimension;
    bombCheck(); /*Runs an algorithm to check if there are more bombs than max grid size to avoid problems*/
}

/*If the user clicks the down chevron for the dimension variable, the dimension setting for a new game are decreased*/
function decreaseDimension(){
    newDimension -= 1;
    if(newDimension<7){ /*Limits the min size to 7, the algorithm i made can take smaller values but there really isnt much point in doing a 3x3 grid.*/
        newDimension = 7;
    }
    dimensionElement = document.getElementById("dimension-value"); /*Gets the container for the dimension value and updates it with the user's decrease*/
    dimensionElement.innerHTML = newDimension;
    bombCheck(); /*Runs an algorithm to check if there are more bombs than max grid size to avoid problems*/
}

/*If the user clicks the up chevron for the bombs variable, the number of bombs setting for a new game is increased*/
function increaseBombs(){
    newBombs += 1;
    bombCheck(); /*Runs an algorithm to check if the bomb count is above the max tiles allowed for the user input dimension*/
}

/*If the user clicks the down chevron for the bombs variable, the number of bombs setting for a new game is decreased*/
function decreaseBombs(){
    newBombs -= 1;
    bombCheck(); /*Runs an algorithm to check if there is at least one bomb*/
}

/*Checks if the number of bombs inputted by the user is above or below what is possible based on the factors above*/
function bombCheck(){
    if(newBombs<1){  /*Sets the minimum to 1 bomb*/
        newBombs = 1;
    }
    else if(newBombs>newDimension*newDimension - 1){ /*Sets the maximum to the number of tiles- 1*/
        newBombs = newDimension*newDimension - 1;
    }

    bombElement = document.getElementById("bomb-value");  /*Updates the player's GUI with the number of bombs they selected*/
    bombElement.innerHTML = newBombs;
}

/*Runs the function if the user clicks the pointer icon, which would allow mobile players to select tiles*/
function mobileFlagToTile(){
    /*Resets the flag icon to its usual colouration*/
    flagIcon = document.getElementById("mobile-flag-selector");
    flagIcon.style.backgroundColor = "blanchedalmond";
    flagIcon.style.borderColor = "black";
    flagIcon.style.borderWidth = "3px";

    /*Changes the colour of the clicked pointer icon to make it obvious to the user it has been clicked*/
    tileIcon = document.getElementById("mobile-tile-selector");
    tileIcon.style.backgroundColor = "darkgrey";
    tileIcon.style.borderColor = "white";
    tileIcon.style.borderWidth = "5px";

    /*Notes that the mobile user isnt flagging so tiles can be revealed*/
    mobileFlagSetting = false;
}

/*Runs the function if the user clicks the flag icon, which would allow mobile players to flag tiles*/
function mobileTileToFlag(){
    /*Changes the colour of the clicked flag icon to make it obvious to the user it has been clicked*/
    flagIcon = document.getElementById("mobile-flag-selector");
    flagIcon.style.backgroundColor = "darkgrey";
    flagIcon.style.borderColor = "white";
    flagIcon.style.borderWidth = "5px";

    /*Resets the tile icon to its usual colouration*/
    tileIcon = document.getElementById("mobile-tile-selector");
    tileIcon.style.backgroundColor = "blanchedalmond";
    tileIcon.style.borderColor = "black";
    tileIcon.style.borderWidth = "3px";

    /*Notes that the mobile user is flagging so tiles can be flagged*/
    mobileFlagSetting = true;
}

/*Updates the respective GUI elements so the user can see how close to win/lose condition they are*/
function updateStatus(){
    bombValueElement = document.getElementById("bomb-total-value");
    bombValueElement.innerHTML = bombsNo;

    flagValueElement = document.getElementById("flagged-value");
    flagValueElement.innerHTML = flagCount;

    tileValueElement = document.getElementById("tiles-left-value");
    tileValueElement.innerHTML = revealCount;
}