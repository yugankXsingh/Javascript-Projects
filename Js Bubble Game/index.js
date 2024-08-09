const panelBottom = document.querySelector(".pbtm");
const TimerBox = document.querySelector("#timer-box");
const ScoreBox = document.querySelector("#score-box");
const gameStartButton = document.querySelector(".start-button");
let hitValue;

gameStartButton.addEventListener("click", function () {
  gameInit();
  gameStartButton.classList.add("hide");
});

function makeBubbles() {
  for (let i = 1; i <= 112; i++) {
    let newElement = document.createElement("div");
    newElement.classList.add("bubble");
    let randNum = Math.floor(Math.random() * 10); // 0-9
    newElement.innerHTML = randNum;
    panelBottom.appendChild(newElement);
  }
}

let timer = 60;
function runTimer() {
  var temp = setInterval(() => {
    if (timer > 0) {
      timer--;
      TimerBox.innerHTML = timer;
      if (timer % 5 === 0) {
        // every 5 seconds automatically get a new hit
        getHit();
      }
    } else {
      // GAME OVER
      clearInterval(temp); // stop the timer
      let newDiv = document.createElement("div");
      let newH1 = document.createElement("h1");
      let newPara = document.createElement("p");
      let newButton = document.createElement("button");

      newH1.innerHTML = "Game Over";
      newPara.innerHTML = "Your Score is: " + score;
      newButton.innerHTML = "Restart";
      newDiv.appendChild(newH1);
      newDiv.appendChild(newPara);
      newDiv.appendChild(newButton);
      panelBottom.innerHTML = "";
      panelBottom.appendChild(newDiv);

      newDiv.classList.add("game-over-div");
      newButton.classList.add("restart-button");

      newButton.addEventListener("click", function () {
        gameInit();
      });
    }
  }, 1000);
}

function gameInit() {
  // reset the game
  timer = 60;
  score = 0;
  TimerBox.innerHTML = timer;
  ScoreBox.innerHTML = score;
  panelBottom.innerHTML = "";
  panelBottom.classList.add("active");
  makeBubbles();
  getHit();
  runTimer();
}

function getHit() {
  let hit = document.querySelector("#hit-box");
  hitValue = Math.floor(Math.random() * 10);
  hit.innerHTML = hitValue;
}

let score = 0;
function increaseScore() {
  score += 10;
  ScoreBox.innerHTML = score;
}

panelBottom.addEventListener("click", function (details) {
  let clickedNumber = Number(details.target.innerText);

  if (clickedNumber === hitValue) {
    increaseScore();
    getHit();

    //CLEAR BUBBLES
    let aLLbubbles = document.querySelectorAll(".bubble");
    aLLbubbles.forEach((bubble) => {
      bubble.remove();
    });

    // MAKE NEW BUBBLES
    makeBubbles();
  }
});
