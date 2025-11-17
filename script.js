let player1 = {};
let player2 = {};
let currentPlayer;


const GameBoard = (function() {
    let gameBoard = ["","","","","","","","",""];

    function setBox(index, token)
    {
        gameBoard[index] = token;
    }

    function getBox(index)
    {
        return gameBoard[index];
    }

    function resetBoard()
    {
       gameBoard = ["","","","","","","","",""];
    }

    return {
        setBox,
        getBox,
        resetBoard
    };

})();

const players = (function(){
    const createPlayer = (name,token) => ({name, token});

    return {
        createPlayer
    };

})();

const gameController = (function(){
    let gameOver = false;

      const winningPatterns = [
        [0,1,2], 
        [0,3,6], 
        [0,4,8], 
        [1,4,7], 
        [2,4,6], 
        [2,5,8], 
        [3,4,5], 
        [6,7,8]
    ];

    const switchPlayer = () => currentPlayer = currentPlayer === player1 ? player2 : player1;

    const newRound = () => gameOver = false;

    function playRound(index)
    {
        if (gameOver) return;
        if(GameBoard.getBox(index) != "") return;

        GameBoard.setBox(index, currentPlayer.token);
        checkWinner();
        
        displayController.showToken(index, currentPlayer.token);
        switchPlayer();
    }

    function checkWinner()
    {
        for (let pattern of winningPatterns) {
            let [a, b, c] = pattern;

            if (
                GameBoard.getBox(a) === currentPlayer.token &&
                GameBoard.getBox(b) === currentPlayer.token &&
                GameBoard.getBox(c) === currentPlayer.token
            ) {
                displayController.highLightWinningBox(a,b,c);
                gameOver = true;
                return true;
            }
        }
        return false;
    }

     return {
            switchPlayer,
            newRound,
            playRound,
            checkWinner
    };
})();

const displayController = (function(){
    const boxes = document.querySelectorAll(".box");
    const restartBtn = document.querySelector("#restart");
    const endBtn = document.querySelector("#end");
    const container = document.querySelector(".container");

    const startBtn = document.querySelector("#start-btn");
    const start = document.querySelector(".start");
    const game = document.querySelector(".game");

    function showToken(index, token)
    {
        boxes[index].textContent = token;
    }

    function highLightWinningBox(a,b,c)
    {
        boxes[a].classList.add("active");
        boxes[b].classList.add("active");
        boxes[c].classList.add("active");
    }

    function resetBoxes()
    {
        boxes.forEach(box => {
            box.textContent = "";
            box.classList.remove("active");
        });
    }

    boxes.forEach(box => {
        box.addEventListener('click', ()=>{
            let index = +(box.dataset.index);
            gameController.playRound(index);
        });
    });

    restartBtn.addEventListener("click", ()=>{
        gameController.newRound();
        resetBoxes();
        GameBoard.resetBoard();
    });

    endBtn.addEventListener("click", ()=>{
        resetBoxes();
        GameBoard.resetBoard();
        container.style.display = "none";
    }); 

    startBtn.addEventListener("click", (e)=>{
        e.preventDefault();
        const player1Name = document.querySelector("#player1-name").value;
        const player2Name = document.querySelector("#player2-name").value;
        const player1Token = document.querySelector("#player1-token").value;
        const player2Token = document.querySelector("#player2-token").value;

        player1 = players.createPlayer(player1Name,player1Token);
        player2 = players.createPlayer(player2Name,player2Token);
        game.classList.add("active");
        start.classList.add("active");
        currentPlayer = player1;
    });

    return {
        showToken,
        highLightWinningBox,
        resetBoxes
    };
    
})();