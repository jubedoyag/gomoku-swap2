import Swap2GameManager from './game/swap2GomokuManager.js';
import Swap2GameState from './game/swap2GomokuState.js';
import PlayerA from './players/player1.js';

const playerA = new PlayerA(15);
document.getElementById('first-slct').innerHTML
	= '<option>Dummy</option>';
const playerB = new PlayerA(15);
document.getElementById('second-slct').innerHTML
	= '<option>Dummy</option>';

const gameState = new Swap2GameState(15, 30);
gameState.setPlayersOrder(playerA, playerB);
const manager = new Swap2GameManager(gameState);

document.getElementById('start-btn').addEventListener('click', e => {
	manager.startGame();
});
