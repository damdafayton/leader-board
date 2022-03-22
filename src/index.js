import './style.scss';

// Prevent bad ui during load
window.addEventListener('load', () => {
  const body = document.querySelector('body');
  body.classList.remove('d-none');
});

const leaderBoardApi = document.querySelector('#leaderboard-api');

let gameID = 0;
const createGameId = async () => {
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
};

const createGame = async () => {
  const user = leaderBoardApi.elements.user.value;
  const score = leaderBoardApi.elements.score.value;
  const data = { user, score };

  await fetch(`${leaderBoardApi.action}games/${gameID}/scores/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then(() => {
    leaderBoardApi.elements.user.value = ''
    leaderBoardApi.elements.score.value = ''
  })
};

const populateScores = (games) => {
  if (games) {
    const scoreList = document.querySelector('#score-list');
    scoreList.classList.add('border', 'border-1', 'border-dark');
    scoreList.innerHTML = '';
    games.forEach((game) => {
      const { user } = game;
      const { score } = game;
      const li = document.createElement('li');
      li.classList.add('list-group-item');
      li.innerText = `${user}: ${score}`;
      scoreList.appendChild(li);
    });
  }
};

const leaderBoardSubmit = document.querySelector('#leaderboard-submit');
const submitHandler = async (e) => {
  e.preventDefault();
  const form = e.target.parentElement
  if (form.checkValidity()) {
    if (!gameID) {
      await createGameId();
      createGame();
    } else {
      createGame();
    }
  } else {
    form.reportValidity()
  }
};
leaderBoardSubmit.addEventListener('click', submitHandler);

const btnRefreshHandler = async () => {
  let games = await fetch(`${leaderBoardApi.action}games/${gameID}/scores/`);
  games = await games.json();
  gameID && populateScores(games.result);
};
const btnRefresh = document.querySelector('#btn-refresh');
btnRefresh.addEventListener('click', btnRefreshHandler);
