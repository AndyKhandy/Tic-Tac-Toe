


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

    return {
        setBox,
        getBox
    };

})();

const players = (function(){
    const createPlayer = (name,token) => ({name, token});

    const playerOne = createPlayer("Player 1", "X");
    const playerTwo = createPlayer("Player 2", "O");

    return {
        playerOne,
        playerTwo
    };

})();

const gameController = (function(){
    let gameOver = false;
    let currentPlayer = players.playerOne;

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

    const getCurrentPlayer = () => currentPlayer;

    const switchPlayer = () => currentPlayer = currentPlayer === players.playerOne ? players.playerTwo : players.playerOne;

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
                console.log("The player won!")
                gameOver = true;
                return true;
            }
        }
        return false;
    }

     return {
            getCurrentPlayer,
            switchPlayer,
            playRound,
            checkWinner
    };
})();

const displayController = (function(){
    const boxes = document.querySelectorAll(".box");

    function showToken(index, token)
    {
        boxes[index].textContent = token;
    }

    boxes.forEach(box => {
        box.addEventListener('click', ()=>{
            let index = +(box.dataset.index);
            gameController.playRound(index);
        });
    });


    return {
        showToken
    };

    
})();