let name = "neko";

 function getName() {
  let person = prompt("Please enter your name", "user");

  if (person == null || person == "") {
      name = "User cancelled the prompt.";
  } else {
      name = person;
  }

  return name;
};

const iksOks = new IksOks();
iksOks.start();

function IksOks() {
  const board = new Board();
  const humanPlayer = new HumanPlayer(board);
  const computerPlayer = new ComputerPlayer(board);
  let turn = 0;

  this.start =  async() => {

    getName();
    console.log(name);

    const config = { childList: true };
    const observer = new MutationObserver(() =>  takeTurn());
    board.positions.forEach((el) => observer.observe(el, config));
     await takeTurn();
  }

   const takeTurn = async()=> {
    
    if (board.checkForWinner()) {
      await sendResult(name);
      return;
    }

    if (turn % 2 === 0) {
      humanPlayer.takeTurn();
    } else {
      computerPlayer.takeTurn();
    }

    turn++;
  };
}

function Board() {
  this.positions = Array.from(document.querySelectorAll('.col'));

  this.checkForWinner = function() {
    let winner = false;
    let x = false;

    const winningCombinations = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,4,8],
        [2,4,6],
        [0,3,6],
        [1,4,7],
        [2,5,8]
    ];

    const positions = this.positions;
    winningCombinations.forEach((winningCombo) => {
      const pos0InnerText = positions[winningCombo[0]].innerText;
      const pos1InnerText = positions[winningCombo[1]].innerText;
      const pos2InnerText = positions[winningCombo[2]].innerText;
      const isWinningCombo = pos0InnerText !== '' &&
        pos0InnerText === pos1InnerText && pos1InnerText === pos2InnerText;
      if (isWinningCombo) {
          winner = true;
          winningCombo.forEach((index) => {
            positions[index].className += ' winner';
          })
          if(pos0InnerText==='X')
            x = true;
      }
    });


    return winner;
  }
}

function ComputerPlayer(board) {
  this.takeTurn = function() {
    let availablePositions = board.positions.filter((p) => p.innerText === '');
    const move = Math.floor(Math.random() * (availablePositions.length - 0));
    availablePositions[move].innerText = 'O';
  }
}

function HumanPlayer(board) {
  this.takeTurn = function() {
    board.positions.forEach(el =>
      el.addEventListener('click', handleTurnTaken));
  }

  function handleTurnTaken(event) {
    event.target.innerText = 'X';
    board.positions
      .forEach(el => el.removeEventListener('click', handleTurnTaken));
  }
}


const sendResult = async(ime) => {
  try {


      const URL = 'http://localhost:3005/';
      const response = await fetch(URL, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          mode: 'cors',
          body: JSON.stringify({
              name: ime
          })
      });

     

      const jsonResponse = await response.json();
      console.log(jsonResponse);

  } catch (err) {
      console.error(err);
  }
}
