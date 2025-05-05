const DIRECTIONS = [
	[0, 1],
	[1, 0],
	[1, 1],
	[1, -1],
];

export default class Swap2GameState {
	constructor ( size, time ) {
		/* Board dimensions */
		this.boardSize	    = size;

		/* A hash-map that stores moves by a row-col keys */
		this.board			= new Map();

		this.playersInfo	= [];

		/* How much time is given to each player */
		this.playersTime    = time;

		/* First, Second, Third or default move */
		this.currentMove	= null;

		this.winner			= null;
	}

	// AQUIII: mover a '../utils/'
	#shuffleArray ( a ) {
		let i = a.length, j, temp;
		while ( --i > 0 ) {
			j = Math.floor(Math.random() * (i+1));
			temp = a[j];
			a[j] = a[i];
			a[i] = temp;
		}
	}

	setPlayersOrder ( A, B ) {
		const objectPlayerA = { 
			player: A,
			time: this.playersTime * 60 * 1000
		};
		this.playersInfo.push(objectPlayerA);
		const objectPlayerB = { 
			player: B,
			time: this.playersTime * 60 * 1000
		};
		this.playersInfo.push(objectPlayerB);

		this.#shuffleArray ( this.playersInfo );
		
		this.playersInfo
			.forEach((p, i) => p.id = i+1);
	}

	swapPlayers ( oldIndex, newIndex ) {
		const aux = this.playersInfo[oldIndex];
		this.playersInfo[oldIndex] = this.playersInfo[newIndex];
		this.playersInfo[newIndex] = aux;
	}

	/*
	 * See if the line has 5 points counting
	 * towards 'direction' until some limit is
	 * reached and then going back to count in
	 * the opposite direction.
	 *
	 * [X, X, X, X, X]
	 *        1> 2> 3>
	 * <5 <4
	 */
	isFiveLineMove ( playerId, move ) {
		const [row, col] = move;

		for (const direction of DIRECTIONS) {
			let [dX, dY] = direction;
			let nRow = row, nCol = col;
			let nKey = `${nRow},${nCol}`;

			let lineCount = 0;
			let backwards = false;
			while ( this.board.get(nKey) === playerId
				&& lineCount < 5) {
				lineCount++;

				nRow += dX, nCol += dY;
				nKey = `${nRow},${nCol}`;
				if ( !backwards
					&& (this.board.get(nKey) !== playerId
					|| nRow < 0 || nRow >= this.boardSize
					|| nCol < 0 || nCol >= this.boardSize) ) {
					backwards = true;
					dX *= -1, dY *= -1;
					nRow = row + dX, nCol = col + dY;
					nKey = `${nRow},${nCol}`;
				}
			}

			if ( lineCount == 5 ) {
				this.winner = playerId;
				return true;
			}
		}
		return false;
	}

    /* 
	 * Check if no one can win.
	 * If there is some empty position
	 * then is not a tie yet.
	 *
	 */
    isGameOver () { 
		return this.winner
			|| this.board.size === this.boardSize * this.boardSize;
    }

    updateBoard ( playerMove, playerId ) {
		const [row, col] = playerMove;
		const moveKey = `${row},${col}`;
		this.board.set(moveKey, playerId);
    }

    getPlayFrom ( playerToMove, lastMove, prevId ) {
		const start = new Date().getTime();
		const move = playerToMove
			.player
			.nextMove(
				lastMove,
				playerToMove.time,
				prevId
			);
		playerToMove.time -= new Date().getTime() - start;

		return move;
    }
}
