let dimension = 10;

function newGame(){
    let gameArea = document.getElementById("minefield-area");
    
    for(let x=0; x<dimension; x++){
        for(let y=0; y<dimension; y++){
            let mineElement = document.createElement("button");
            mineElement.innerHTML = "11";
            mineElement.classList.add("my-class");
            gameArea.appendChild(mineElement);
        }
    }
}