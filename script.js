const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
let cards;
let interval;
let firstCard = false;
let secondCard = false;

//Item array
const items = [
  { name: "banane", image: "ressource/banane.jpg" },
  { name: "beef", image: "ressource/beef_loc_lac.jpg" },
  { name: "burger", image: "ressource/burger.jpg" },
  { name: "burger2", image: "ressource/burger2.jpg" },
  { name: "croquetas", image: "ressource/croquetas.jpg" },
  { name: "houmous", image: "ressource/houmous.jpg" },
  { name: "patate_douce", image: "ressource/patate_douce.jpg" },
  { name: "patate_farcie", image: "ressource/patate_farcie.jpg" },
  { name: "pork_burger", image: "ressource/pork_burger.jpg" },
  { name: "thai_salad", image: "ressource/thai_salad.jpg" },
  { name: "tiramisu", image: "ressource/tiramisu.jpg" },
];

//INITIAL TIME
let seconds = 0,
  minutes = 0;

//INITIAL MOVES AND WIN COUNT
let movesCount = 0,
  winCount = 0;

//TIMER
const timeGenerator = () => {
  seconds += 1;
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }

  // Fonction pour formater le temps de fin de jeu
  const formatTime = (minutes, seconds) => {
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  //format time before displaying
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
};

// Moves Calaculator
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Moves: </span>${movesCount}`;
};

//Pick random objects from the items array
const generateRandom = (size = 4) => {
  //temporary array
  let tempArrray = [...items];
  //initializes cardValues array
  let cardValues = [];
  size = (size * size) / 2;
  //random object selection
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArrray.length);
    cardValues.push(tempArrray[randomIndex]);
    //once selected remove the object from the temps array
    tempArrray.splice(randomIndex, 1);
  }
  return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];
  cardValues.sort(() => Math.random() - 0.5);
  for (let i = 0; i < size * size; i++) {
    gameContainer.innerHTML += `
    <div class="card-container" data-card-value="${cardValues[i].name}">
    <div class="card-before">?</div>
    <div class="card-after">
    <img src="${cardValues[i].image}" class="game-img"</div>
    </div>
    `;
  }
  //Grid
  gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

  //CARDS
  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      if (!card.classList.contains("matched")) {
        card.classList.add("flipped");
        if (!firstCard) {
          firstCard = card;
          firstCardValue = card.getAttribute("data-card-value");
        } else {
          movesCounter();
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue == secondCardValue) {
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            firstCard = false;
            //wincount increment
            winCount += 1;
            if (winCount == Math.floor(cardValues.length / 2)) {
              result.innerHTML = `<h2>You won </h2> <h4>Moves: ${movesCount} <br>Time: ${formatTime(
                minutes,
                seconds
              )}</h4>`;

              stopGame();
            }
          } else {
            //if card dont match
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 900);
          }
        }
      }
    });
  });
};

//Start Game
startButton.addEventListener("click", () => {
  movesCount = 0;
  time = 0;
  minutes = 0;
  seconds = 0;
  //controls and button visibility
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");

  //Start Timer
  interval = setInterval(timeGenerator, 1000);
  //initial moves
  moves.innerHTML = `<span>Moves: </span> ${movesCount}`;
  initializer();
});

//STOP game
stopButton.addEventListener(
  "click",
  (stopGame = () => {
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(interval);
  })
);

//initialise value and function calls
const initializer = () => {
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom();
  console.log(cardValues);
  matrixGenerator(cardValues);
};

//test
let elapsedTime = 0;
