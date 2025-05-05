import updateVisuals from './gomokuBoard.js';

export default class Swap2GameManager {
    constructor ( gameState ) {
		this.gameState	= gameState;

		/* First move: put 3 stones
		 * Second move: put 1 or 2 stones or say 'BLACK'
		 * Third move: put 1 stone or say 'BLACK'
		 * Normal 1 stone move. */
		this.typeMove	= 'FIRST';
    }

	/*
	 * Verify that all elements in 'moves'
	 * are valid, i.e. moves are within
	 * the board and in empty positions.
	 *
	 */
	#areValidPositions (
		moves,
		types=['number'],
		movesLength=2 ) {
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
				return r >= 0 && r < this.gameState.boardSize
					&& c >= 0 && c < this.gameState.boardSize
					&& !this.gameState.board.get(`${r},${c}`);
			});
			return movesAreValid;
		}

		// 'moves' is only one position
		const [row, col] = moves;
		return row >= 0 && row < this.gameState.boardSize
			&& col >= 0 && col < this.gameState.boardSize
			&& !this.gameState.board.get(`${row},${col}`);
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
    #isValidMove ( m ) {
		if ( !this.typeMove && !this.#areValidPositions(m) )
			return false;
		if ( this.typeMove === 'FIRST'
			&& !this.#areValidPositions(m, ['object'], 3) )
			return false;
		if ( this.typeMove === 'SECOND' && m !== 'BLACK'
				&& !this.#areValidPositions(m, ['number', 'object']) )
			return false;
		if ( this.typeMove === 'THIRD' && m !== 'BLACK'
			&& !this.#areValidPositions(m) )
			return false;
		
		return true;
    }

    async startGame ( ) {

		this.gameState.currentMove = 0;
		updateVisuals ( this.gameState );

		const numPlayers = this.gameState.playersInfo.length;
		let playerIndex;
		let prevPlayerIndex = numPlayers-1;
		let currentPlayer;
		let move;
	
		while ( !this.gameState.isGameOver() ) {

			playerIndex = this.gameState.currentMove % numPlayers;
			currentPlayer = this.gameState.playersInfo[ playerIndex ];
			move = await this.gameState.getPlayFrom(
				currentPlayer,
				move,
				prevPlayerIndex + 1
			);
			prevPlayerIndex = playerIndex;

			if ( !this.#isValidMove ( move ) )
				continue;

			if ( typeof move !== 'string'
				&& typeof move[0] === 'number' )
				this.gameState.updateBoard(
					move,
					playerIndex + 1
				);
			else if ( typeof move !== 'string' )
				move.forEach((m,i) => this.gameState.updateBoard(
					m,
					playerIndex+1 + i % numPlayers
				));
			updateVisuals ( this.gameState );


			switch ( this.typeMove ) {
				// First move: put 3 stones
				case 'FIRST':
					this.gameState.currentMove += 3;

					this.typeMove = 'SECOND';
					break;
				// Second move: say 'BLACK', put 1 or put 2 stones 
				case 'SECOND':
					if ( typeof move === 'string' ) {
						this.gameState.swapPlayers(
							playerIndex,
							(playerIndex+1) % numPlayers
						);
						this.typeMove = null;
					}
					else if ( typeof move[0] === 'number' ) {
						this.gameState.currentMove++;
						this.typeMove = null;
					}
					else if ( typeof move[0] === 'object' ) {
						// it should be +2 but since it's now
						// turn of first player then it will be
						// only ++.
						this.gameState.currentMove++;
						this.typeMove = 'THIRD';
					}
					break;
				// Third move: say 'BLACK' or put 1 stone
				case 'THIRD':
					if ( typeof move !== 'string'
						&& typeof move[0] === 'number' ) {
						this.gameState.swapPlayers(
							playerIndex,
							(playerIndex+1) % numPlayers
						);
						this.gameState.currentMove++;
					}

					// with this we fix the move counter
					// from the 3th option in SECOND case.
					this.gameState.currentMove++;
					this.typeMove = null;
					break;
				// Normal 1 stone move
				default:
					if ( this.gameState.isFiveLineMove(
							playerIndex + 1,
							move
						) )
						console.log(
							`Winner: Player${currentPlayer.id}`
						)
					if ( currentPlayer.time < 0 )
						console.log(
							`Loser: Player${currentPlayer.id}`
						)
					this.gameState.currentMove++;
					break;
			}
		}
    }
}
