const PARENT_CONT_ID = 'canvas-container';
const PARENT_ELEM = document.getElementById(PARENT_CONT_ID);
const COLS = 15;
const ROWS = 15;
const BOARD_BORDER = 0.02;

let GAME, CV, CANVAS_W, CANVAS_H, CELL_SIZE;

class PlayersGame {
	constructor() {
		this.playersMoves = new Map();
	}
	
	show() {
		this.playersMoves.forEach((v, k) => {
			const cellId = this.playersMoves.get(k);
			if (cellId) {
				const [i, j] = k.split(',').map(n=>Number(n));

				fill(255 * (cellId-1));
				circle(
					width * BOARD_BORDER
						+ (1 + 2*j) * CELL_SIZE / 2,
					height * BOARD_BORDER
						+ (1 + 2*i) * CELL_SIZE / 2,
					CELL_SIZE * 0.8
				);
			}
		});
	}
}

GAME = new PlayersGame();

function paintBoard () {
	/* board set up. */
	background(0);

	fill(128, 128, 128);
	rect(
		width * BOARD_BORDER,
		height * BOARD_BORDER,
		width * (1-2*BOARD_BORDER),
		height * (1-2*BOARD_BORDER)
	);

	// board lines.
	for (let i = 0; i < ROWS; i++) {
		line(
			width * BOARD_BORDER + (1 + i*2) * CELL_SIZE / 2,
			height * BOARD_BORDER + CELL_SIZE / 2,
			width * BOARD_BORDER + (1 + i*2) * CELL_SIZE / 2,
			height * (1-BOARD_BORDER) - CELL_SIZE / 2
		);
	}
	for (let i = 0; i < COLS; i++) {
		line(
			width * BOARD_BORDER + CELL_SIZE / 2,
			height * BOARD_BORDER + (1 + i*2) * CELL_SIZE / 2,
			width * (1-BOARD_BORDER) - CELL_SIZE / 2,
			height * BOARD_BORDER + (1 + i*2) * CELL_SIZE / 2
		);
	}
}

window.setup = function () {
	/* Canvas set up. */
	CANVAS_W = PARENT_ELEM.getBoundingClientRect().width;
	CANVAS_H = PARENT_ELEM.getBoundingClientRect().height;
	CELL_SIZE = (CANVAS_W * (1-2*BOARD_BORDER)) / ROWS;
	//CELL_H = (CANVAS_H * (1-2*BOARD_BORDER)) / COLS;

	CV = createCanvas(CANVAS_W, CANVAS_H);
	CV.parent(PARENT_CONT_ID);
	frameRate(10);

	paintBoard();
}

function updateVisuals ( state ) {
	const a1 = document.getElementById('player1-lbl');
	const a2 = document.getElementById('player2-lbl');

	a1.innerHTML = `Player${state.playersInfo[0].id}`;
	a2.innerHTML = `Player${state.playersInfo[1].id}`;

	GAME.playersMoves = state.board;
}

window.draw = function () {
	paintBoard();
	GAME.show();
}

/*
function mousePressed() {
	if ( mouseX >= width * BOARD_BORDER
		&& mouseX <= width * (1-BOARD_BORDER)
		&& mouseY >= height * BOARD_BORDER
		&& mouseY <= height * (1-BOARD_BORDER) ) {
		const r = Math.floor(
			(mouseX-width*BOARD_BORDER) / CELL_SIZE
		);
		const c = Math.floor(
			(mouseY-height*BOARD_BORDER) / CELL_SIZE
		);
	}
}
*/

function windowResized () {
	CANVAS_W = PARENT_ELEM.getBoundingClientRect().width;
	CANVAS_H = PARENT_ELEM.getBoundingClientRect().height;
	CELL_SIZE = (CANVAS_W * (1-2*BOARD_BORDER)) / ROWS;
	//CELL_H = (CANVAS_H * (1-2*BOARD_BORDER)) / COLS;

	resizeCanvas(CANVAS_W, CANVAS_W);
}

export default updateVisuals;
