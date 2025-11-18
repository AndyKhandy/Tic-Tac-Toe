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
    const createPlayer = (name,token) => ({name, token, wins: 0});

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
                if(currentPlayer.token == player1.token)
                {
                    player1.wins++;
                }
                else{
                    player2.wins++;
                }
                displayController.updateWins();
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

    const form = document.querySelector("form");
    const start = document.querySelector(".start");
    const game = document.querySelector(".game");

    const displayP1Name = document.querySelector("#p1name");
    const displayP2Name = document.querySelector("#p2name");

    const displayP1Token = document.querySelector("#p1token");
    const displayP2Token = document.querySelector("#p2token");

    const displayP1score = document.querySelector("#p1score");
    const displayP2score = document.querySelector("#p2score");

    function showToken(index, token)
    {
        boxes[index].textContent = token;
    }

    function updateWins()
    {
        displayP1score.textContent = player1.wins;
        displayP2score.textContent = player2.wins;
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

    function displayPlayerInfo()
    {
        displayP1Name.textContent = player1.name;
        displayP2Name.textContent = player2.name;
        displayP1Token.textContent = player1.token;
        displayP2Token.textContent = player2.token;
        updateWins();
    }

    boxes.forEach(box => {
        box.addEventListener('click', ()=>{
            let index = +(box.dataset.index);
            gameController.playRound(index);
        });
    });

    restartBtn.addEventListener("click", ()=>{
        currentPlayer = player1;
        gameController.newRound();
        resetBoxes();
        GameBoard.resetBoard();
    });

    endBtn.addEventListener("click", ()=>{
        resetBoxes();
        GameBoard.resetBoard();
        game.classList.remove("active");
        start.classList.remove("active");
    }); 

    form.addEventListener("submit", (e)=>{
        e.preventDefault();
        const player1Name = document.querySelector("#player1-name").value;
        const player2Name = document.querySelector("#player2-name").value;
        const player1Token = document.querySelector("#player1-token").value;
        const player2Token = document.querySelector("#player2-token").value;

        player1 = players.createPlayer(player1Name,player1Token);
        player2 = players.createPlayer(player2Name,player2Token);

        game.classList.add("active");
        start.classList.add("active");

        displayPlayerInfo();
        currentPlayer = player1;
        form.reset();
    });

    return {
        showToken,
        updateWins,
        highLightWinningBox,
        resetBoxes
    };
    
})();