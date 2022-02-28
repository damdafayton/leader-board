import './style.scss';

// You can specify which plugins you need
// import { Tooltip, Toast, Popover } from 'bootstrap';`

const leaderBoardApi = document.querySelector('#leaderboard-api');

let gameID = 0;
async function createGameId() {
  const data = {
    name: 'leader board',
  };
  let response = await fetch(`${leaderBoardApi.action}games/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(data),
  });
  response = await response.json(); // .then(reply => reply.json())
  // .then(json =>

  const { result } = response;
  const indexColumn = result.indexOf(':');
  const indexAdded = result.indexOf('added');
  console.log(result);
  gameID = result.substring(indexColumn + 2, indexAdded - 1);
  console.log(gameID);
}

async function createGame() {
  const user = leaderBoardApi.elements.user.value;
  const score = leaderBoardApi.elements.score.value;
  const data = { user, score };

  let saveGame = await fetch(`${leaderBoardApi.action}games/${gameID}/scores/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(data),
  });
  saveGame = await saveGame.json();
  console.log(saveGame);
}

function populateScores(games) {
  if (games) {
    const scoreList = document.querySelector('#score-list');
    scoreList.innerHTML = '';
    games.forEach((game) => {
      const { user } = game;
      const { score } = game;
      const li = document.createElement('li');
      li.innerText = `${user}: ${score}`;
      scoreList.appendChild(li);
    });
  }
}

const leaderBoardSubmit = document.querySelector('#leaderboard-submit');
async function submitHandler(e) {
  e.preventDefault();

  if (!gameID) {
    await createGameId();
    createGame();
  } else {
    console.log('there is game id');
    createGame();
  }
}
leaderBoardSubmit.addEventListener('click', submitHandler);

async function btnRefreshHandler() {
  let games = await fetch(`${leaderBoardApi.action}games/${gameID}/scores/`);
  games = await games.json();
  console.log(games);
  populateScores(games.result);
}
const btnRefresh = document.querySelector('#btn-refresh');
btnRefresh.addEventListener('click', btnRefreshHandler);
