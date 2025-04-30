class Swap2GameManager {
    constructor ( time, size ) {
		/* Board dimensions */
		this.boardSize	    = size;
		///* A matrix (2-dim array) */
		/* A hash-map that stores moves by a row-col keys */
		this.board			= new Map();
		/* First, Second, Third or default play */
		this.gameState		= null;
		/* Each player has an 'id', 1 or 2 */
		this.players	    = {1: null, 2: null};
		/* How much time is given to each player */
		this.playersTime    = time;
		this.lastPlay	    = null;
		/* 'id' of the winner player */
		this.winner			= null;
    }

	/*
	 * Verify that all elements in 'moves'
	 * are valid, i.e. moves are within
	 * the board and in empty positions.
	 *
	 */
	#validPositions (
		moves,
		types=['number'],
		movesLength=2
	) {
		// 'moves' should be an array
		if ( typeof moves !== 'object'
			|| moves.length !== movesLength )
			return false;
		// all elements from 'moves' should be either a 'number'
		// or an 'object' (an array), so at least one type must
		// be the same for all elements, if no then return
		// false.
		if ( !types.some(tp => moves.every(mv => typeof mv === tp)) )
			return false;

		// 'moves' is a group of positions
		if ( typeof moves[0] === 'object' ) { 
			const movesAreValid = moves.every(([r,c]) => {
				return r >= 0 && r < this.boardSize
					&& c >= 0 && c < this.boardSize
					&& !this.board.get(`${r}${c}`);
			});
			return movesAreValid;
		}

		// 'moves' is only one position
		const [row, col] = moves;
		return row >= 0 && row < this.boardSize
			&& col >= 0 && col < this.boardSize
			&& !this.board.get(`${row}${col}`);
	}

	/*
	 * This method should determine when a
	 * move is invalid by the current game
	 * type (in this case swap2). A move is
	 * invalid if is not placed on a empty
	 * position, if it's out of limits or if
	 * it must be another kind of play
	 * (choosing color or placing many
	 * pieces at the same time).
	 *
	 */
    #validMove ( ) {
		switch ( this.gameState ) {
			// First move: put 3 stones
			case 0:
				if ( !this.#validPositions(
					this.lastPlay, ['object'], 3
				) )
					return false;
				this.gameState = 1;
				break;
			// Second move: put 1 or 2 stones or say 'BLACK'
			case 1:
				if ( this.lastPlay !== 'BLACK'
					|| !this.#validPositions(
						this.lastPlay, ['number', 'object']
					) )
					return false;

				if ( this.lastPlay === 'BLACK'
					|| typeof this.lastPlay[0] === 'number' )
					this.gameState = 3
				else
					this.gameState = 2;

				break;
			// Third move: put 1 stone or say 'BLACK'
			case 2:
				if ( this.lastPlay !== 'BLACK'
					|| !this.#validPositions(this.lastPlay) )
					return false;

				this.gameState = 3;
				break;
			// Normal move, 1 stone
			default:
				if ( !this.#validPositions(this.lastPlay) )
					return false;
				break;
		}
		return true;
    }

    /* 
	 * Check if no one can win.
	 * If there is some empty position
	 * then is not a draw yet.
	 *
	 */
    #itsDraw () { 
		return this.board.size < this.boardSize * this.boardSize;
    }

    /*
     * This method checks if the last move
     * makes a 5-line, if not only updates
     * the board.
     *
     */
    #updateBoard ( playerId ) {
		const DIRECTIONS = [
			[0, 1],
			[1, 0],
			[1, 1],
			[1, -1],
		];

		const [row, col] = this.lastPlay;
		const moveKey = `${row}${col}`;
		this.board.set(moveKey, playerId);

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
		for (const direction of DIRECTIONS) {
			const [dX, dY] = direction;
			let nRow = row, nCol = col;
			let nKey = `${nRow}${nCol}`;

			let lineCount = 0;
			let backwards = false;
			while ( this.board.get(nKey) === playerId
			&& lineCount < 5) {
				lineCount++;

				nRow += dX, nCol += dY;
				nKey = `${nRow}${nCol}`;
				if ( !backwards
					&& (this.board.get(nKey) !== playerId
					|| nRow < 0 || nRow >= this.boardSize
					|| nCol < 0 || nCol >= this.boardSize) ) {
					backwards = true;
					dX *= -1, dY *= -1;
					nRow = row + dX, nCol = col + dY;
				}
			}

			if ( lineCount == 5 ) {
				this.winner = playerId;
				break;
			}
		}
    }

    /*
     * Get the move from the next player
     * and look if someone wins with that move,
     * that can happen if the player ran out of
     * time, makes a 5-line, or makes an invalid
     * move.
     */
    #getPlayFrom ( playerToMove, id ) {
		const opponentId = id % 2 + 1;

		const start = new Date().getTime();
		this.lastPlay = playerToMove
			.player
			.nextMove(
				this.lastPlay,
				playerToMove.time
			);
		const turnLapse = new Date().getTime() - start;
		playerToMove.time -= turnLapse;

		if ( playerToMove.time < 0 ) {
			this.winner = opponentId;
			console.log("Winner: ", this.players[this.winner]);
			return;
		}
		if ( !this.#validMove() ) {
			this.#getPlayFrom( this.players[id], id );
		}

		this.#updateBoard( id );

		if ( typeof this.winner === 'number' ) {
			console.log("Winner: ", this.players[this.winner]);
			return;
		}
		if ( this.#itsDraw() ) {
			console.log("Draw.");
			return;
		}

		this.#getPlayFrom( this.players[opponentId], opponentId );
    }

    startGame ( playerA, playerB ) {
		this.gameState = 0;
		
		const objectPlayerA = { 
			player: playerA,
			time: this.playersTime * 60 * 1000
		};
		const objectPlayerB = { 
			player: playerB,
			time: this.playersTime * 60 * 1000
		};
		
		if ( Math.random() < 0.5 ) {
			this.players[1] = objectPlayerA;
			this.players[2] = objectPlayerB;
		}
		else {
			this.players[1] = objectPlayerB;
			this.players[2] = objectPlayerA;
		}

		this.#getPlayFrom( this.players[1], 1 );
    }
}
