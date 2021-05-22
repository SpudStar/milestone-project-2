let dimension = 10;

function newGame(){
    let gameArea = document.getElementById("minefield-area");

    while (gameArea.firstChild) {
        gameArea.removeChild(gameArea.firstChild);
    }

    for(let x=0; x<dimension; x++){
        for(let y=0; y<dimension; y++){
            let tileElement = document.createElement("div");
            tileElement.classList.add("game-tile");
            gameArea.appendChild(tileElement);
        }
    }
}

function revealTile(){
    
}
