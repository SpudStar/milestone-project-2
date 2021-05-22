let dimension = 10;
let bombsNo = 0;
let tileArray = new Array();

function newGame(){
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
            gameArea.appendChild(tileElement);

            tileArray[tileCount] = {
                adjacency: 0,
                bomb: false
            }

            tileCount += 1;
        }
    }

    /* Set Tiles as bombs */
    tileArray[0].bomb = true;
    tileArray[15].bomb = true;
    
}

function revealTile(tileElement,location){
    if(tileArray[location].bomb == true){
        tileElement.style.backgroundColor = "red";
    }
    else{
        tileElement.style.backgroundColor = "yellow";
    }
}
