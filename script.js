/* Code to disable right click menu to allow functionality found from https://www.codeinwp.com/snippets/disable-right-click-context-menu/*/
window.addEventListener('contextmenu', function (e) {  
    e.preventDefault(); 
}, false);

let test = true;
let dimension = 10;
let newDimension = 10;
let bombsNo = 15;
let newBombs = 15;
let revealCount = 0;
let tileArray = new Array();
let loseCondition = false;
let winCondition = false;
newGame();

function newGame(){
    loseCondition = false;
    winCondition = false;
    dimension = newDimension;
    bombsNo = newBombs;
    revealCount = dimension*dimension - bombsNo;

    test = true;
    let gameArea = document.getElementById("minefield-area");

    while (gameArea.firstChild) {
        gameArea.removeChild(gameArea.firstChild);
    }

    var tileCount = 0;
    for(let x=0; x<dimension; x++){
        let lineElement = document.createElement("div");

        for(let y=0; y<dimension; y++){

            let location = tileCount;

            let tileElement = document.createElement("div");
            tileElement.classList.add("game-tile");
            tileElement.onclick = function() {revealTile(tileElement,location)};
            tileElement.oncontextmenu = function() {flagTile(tileElement,location)};

            let resizer = (gameArea.offsetWidth - 20)/dimension -10;

            tileElement.style.height = resizer+"px";
            tileElement.style.width = resizer+"px";

            let spanElement = document.createElement("p");
            let iElement = document.createElement("i");
            iElement.classList.add("fa")

            spanElement.appendChild(iElement);
            tileElement.appendChild(spanElement);
            lineElement.appendChild(tileElement);

            tileArray[tileCount] = {
                adjacency: 0,
                bomb: false,
                revealed: false,
                flagged: false
            }

            tileCount += 1;
        }

        gameArea.appendChild(lineElement);
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

    if(loseCondition && tileArray[location].flagged && !tileArray[location].bomb){
        flagTile(tileElement,location);
    }

    if(winCondition && !tileArray[location].flagged && tileArray[location].bomb){
        flagTile(tileElement,location);
    }

    if(!tileArray[location].flagged && !tileArray[location].revealed){
        /* class="fa fa-question-circle-o"*/
        tileArray[location].revealed = true;

        if(tileArray[location].bomb){
            
            tileElement.firstChild.firstChild.classList.add("fa-bomb")
            tileElement.style.backgroundColor = "red";

            if(!loseCondition && !winCondition){
                alert("you lose");
                loseCondition = true;
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
            tileElement.firstChild.innerHTML = tileArray[location].adjacency;

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
                        revealAdjacentGrey(location);
                break;
            }
            revealCount -= 1;
        }
    }

    if(revealCount == 0 && !loseCondition && !winCondition){
        alert("you Win!");
        winCondition = true;
        for(let i = 0; i < dimension; i++){
            for(let j = 0; j < dimension; j++){
                let lineChild = document.getElementById("minefield-area").children[i];
                let tileChild = lineChild.children[j];
                revealTile(tileChild,(i*dimension + j));
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
        tileElement.firstChild.firstChild.classList.add("fa-flag")
        tileElement.style.backgroundColor = "purple";
    }
    else{
        tileArray[location].flagged = false;
        tileElement.firstChild.firstChild.classList.remove("fa-flag")
        tileElement.style.backgroundColor = "white";
    }
}

function revealAdjacentGrey(location){
    test = false;
    
    for(let j = -dimension-1; j <= dimension+1; j++){

        if((j == -dimension-1 || j == -dimension || j == -dimension+1 || j == -1 || j == 1 || j == dimension -1 || j == dimension || j == dimension + 1) && checkPossible(location,j)){
            let sum = location + j;
            
            let lineChild = document.getElementById("minefield-area").children[parseInt(sum/dimension)];
            let tileChild = lineChild.children[sum%dimension];
            revealTile(tileChild,sum);
        }
    }    
}

window.addEventListener('resize', resizeTiles);  /*checkPossible(i,j) Event listener to notify if the window changes size taken from https://developer.mozilla.org/en-US/docs/Web/API/Window/resize_event*/

function resizeTiles(){
    let gameArea = document.getElementById("minefield-area");
    let resizer = (gameArea.offsetWidth - 20)/dimension -10;
    for(let i = 0; i < dimension; i++){
        for(let j = 0; j < dimension; j++){
        
            let lineChild = document.getElementById("minefield-area").children[i];
            let tileChild = lineChild.children[j];
            tileChild.style.height = resizer+"px";
            tileChild.style.width = resizer+"px";
        }
    }
}

function increaseDimension(){
    newDimension += 1;
    if(newDimension>15){
        newDimension = 15;
    }
    dimensionElement = document.getElementById("dimension-value");
    dimensionElement.innerHTML = newDimension;
    bombCheck();
}

function decreaseDimension(){
    newDimension -= 1;
    if(newDimension<7){
        newDimension = 7;
    }
    dimensionElement = document.getElementById("dimension-value");
    dimensionElement.innerHTML = newDimension;
    bombCheck();
}

function increaseBombs(){
    newBombs += 1;
    bombCheck();
}

function decreaseBombs(){
    newBombs -= 1;
    bombCheck();
}

function bombCheck(){
    if(newBombs<1){
        newBombs = 1;
    }
    else if(newBombs>newDimension*newDimension - 1){
        newBombs = newDimension*newDimension - 1;
    }

    bombElement = document.getElementById("bomb-value");
    bombElement.innerHTML = newBombs;
}