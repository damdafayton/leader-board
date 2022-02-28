import './style.scss';

const leaderBoardApi = document.querySelector('#leaderboard-api');

let gameID = 0;
async function createGameId() {
  const data = {
    name: 'leader board',
  };
  let response = await fetch(`${leaderBoardApi.action}games/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  response = await response.json();

  const { result } = response;
  const indexColumn = result.indexOf(':');
  const indexAdded = result.indexOf('added');
  gameID = result.substring(indexColumn + 2, indexAdded - 1);
}

async function createGame() {
  const user = leaderBoardApi.elements.user.value;
  const score = leaderBoardApi.elements.score.value;
  const data = { user, score };

  await fetch(`${leaderBoardApi.action}games/${gameID}/scores/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(data),
  });
}

const populateScores = (games) => {
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
};

const leaderBoardSubmit = document.querySelector('#leaderboard-submit');
const submitHandler = async (e) => {
  e.preventDefault();

  if (!gameID) {
    await createGameId();
    createGame();
  } else {
    createGame();
  }
};
leaderBoardSubmit.addEventListener('click', submitHandler);

const btnRefreshHandler = async () => {
  let games = await fetch(`${leaderBoardApi.action}games/${gameID}/scores/`);
  games = await games.json();
  populateScores(games.result);
};
const btnRefresh = document.querySelector('#btn-refresh');
btnRefresh.addEventListener('click', btnRefreshHandler);
