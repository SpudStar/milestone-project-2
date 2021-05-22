/* Code to disable right click menu to allow functionality found from https://www.codeinwp.com/snippets/disable-right-click-context-menu/*/
window.addEventListener('contextmenu', function (e) {  
    e.preventDefault(); 
  }, false);





let dimension = 10;
let bombsNo = 20;
let tileArray = new Array();
let loseCondition = false;

function newGame(){
    loseCondition = false;

    let gameArea = document.getElementById("minefield-area");

    while (gameArea.firstChild) {
        gameArea.removeChild(gameArea.firstChild);
    }

    var tileCount = 0;
    for(let x=0; x<dimension; x++){
        for(let y=0; y<dimension; y++){

            let location = tileCount;

            let tileElement = document.createElement("div");
            tileElement.classList.add("game-tile");
            tileElement.onclick = function() {revealTile(tileElement,location)};
            tileElement.oncontextmenu = function() {flagTile(tileElement,location)};
            gameArea.appendChild(tileElement);

            tileArray[tileCount] = {
                adjacency: 0,
                bomb: false,
                revealed: false,
                flagged: false
            }

            tileCount += 1;
        }
    }

    /* Set Tiles as bombs */
    let bombsPlaced = 0;
    do{
        let bombPlacement = Math.floor((Math.random() * (dimension*dimension))+0);
        if(!tileArray[bombPlacement].bomb){
            tileArray[bombPlacement].bomb = true;
            bombsPlaced += 1;
        }
    }while(bombsPlaced<bombsNo);

    /*Checks how many bombs a tile is adjacent to*/
    for(let i = 0; i < dimension*dimension; i++){
        let adjacentBombs = 0;

        for(let j = -dimension-1; j <= dimension+1; j++){
            if((j == -dimension-1 || j == -dimension || j == -dimension+1 || j == -1 || j == 1 || j == dimension -1 || j == dimension || j == dimension + 1) && checkPossible(i,j)){
                if(tileArray[i+j].bomb){
                    adjacentBombs += 1;
                }
            }
        }
        tileArray[i].adjacency = adjacentBombs;
    }
}

function revealTile(tileElement,location){
    if(!tileArray[location].flagged && !tileArray[location].revealed){

        tileArray[location].revealed = true;

        if(tileArray[location].bomb){
            tileElement.style.backgroundColor = "red";
    
            if(!loseCondition){
                alert("you lose");
                loseCondition = true;
                for(let i = 0; i < dimension*dimension; i++){
                    let tileChild = document.getElementById("minefield-area").children[i];
                    revealTile(tileChild,i);
                }
            }
            
        }
        else{
            switch (tileArray[location].adjacency){
                case 1:
                    tileElement.style.backgroundColor = "yellow";
                break;
                case 2:
                    tileElement.style.backgroundColor = "green";
                break;
                case 3:
                    tileElement.style.backgroundColor = "blue";
                break;
                case 4:
                    tileElement.style.backgroundColor = "cyan";
                break;
                case 5:
                    tileElement.style.backgroundColor = "orange";
                break;
                case 6:
                    tileElement.style.backgroundColor = "black";
                break;
                case 7:
                    tileElement.style.backgroundColor = "brown";
                break;
                case 8:
                    tileElement.style.backgroundColor = "pink";
                break;
                default:
                    tileElement.style.backgroundColor = "grey";
                break;
            }
        }
    }
}

function checkPossible(i,j){
    sum = i + j;
    if(sum < 0 || sum >= dimension*dimension){
        return false;
    }
    else if((i%dimension == 0 && sum%dimension == dimension-1) || (i%dimension == dimension-1 && sum%dimension == 0)){
        return false;
    }
    return true;
}

function flagTile(tileElement,location){
    if(!tileArray[location].flagged){
        tileArray[location].flagged = true;
        tileElement.style.backgroundColor = "purple";
    }
    else{
        tileArray[location].flagged = false;
        tileElement.style.backgroundColor = "white";
    }
}
