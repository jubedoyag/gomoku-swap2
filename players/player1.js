/*
 * Dummy player that plays random and
 * always says 'BLACK'.
 */
export default class PlayerA {
	constructor ( size ) {
		this.id				= null;
		this.board			= new Map();
		this.boardSize		= size;
		this.initialMoves	= true;
	}

	// to see the graphical updates
	makeMove ( lastMove ) {
		let i = Math.floor(Math.random() * this.boardSize);
		let j = Math.floor(Math.random() * this.boardSize);
		while ( this.board.get(`${i},${j}`) ) {
			i = Math.floor(Math.random() * this.boardSize);
			j = Math.floor(Math.random() * this.boardSize);
		}
		this.board.set(`${i},${j}`, this.id);
		return [i, j];
	}

	/*
	 * The first case is the common case, we only
	 * have to update our board and return a normal
	 * move.
	 *
	 * The second case is when the game start and we
	 * are the first move (3 stones), so we are the
	 * first player (id=1).
	 * The third case is when we are the second
	 * move and have to return 2 stones, 1 stone or
	 * say 'BLACK', in that case then the ids must
	 * be swapped.
	 * In the fourth case we are responding to 3th
	 * case, so we can return a stone position or
	 * say 'BLACK'. As in the 3th case, the ids are
	 * swapped.
	 *
	 * If none of the previous cases were true, then
	 * we have to see if the opponent's move is
	 * 'BLACK' and then swap ids, if not then just
	 * return a normal move, here the initial moves
	 * are over so any move at this point will be
	 * only a position ([row, col]).
	 *
	 */
	nextMove2( lastMove, time, prevPlayerId ) {
		if ( !this.initialMoves ) {
			this.board.set(lastMove.join(','), prevPlayerId);
			return this.makeMove( lastMove );
		}
		if ( !lastMove ) {
			const m1 = [0, 0];
			const m2 = [0, 1];
			const m3 = [1, 1];
			this.board.set('0,0', this.id);
			this.board.set('0,1', prevPlayerId);
			this.board.set('1,1', this.id);
			this.id = 1;
			return [m1, m2, m3];
		}
		if ( lastMove.length === 3 ) {
			lastMove.forEach(m => this.board.set(
				m.join(','),
				prevPlayerId)
			);
			this.initialMoves = false;
			this.id = prevPlayerId;
			return 'BLACK';
		}
		if ( lastMove[0] === 'object' ) {
			lastMove.forEach(m => this.board.set(
				m.join(','),
				prevPlayerId
			));
			this.initialMoves = false;
			this.id = prevPlayerId;
			return 'BLACK';
		}
		if ( typeof lastMove === 'string' )
			this.id = prevPlayerId;

		this.initialMoves = false;
		return this.makeMove( lastMove );
	}

	async nextMove (m, t, i) {
		const delay = (ms) => {
			return new Promise(resolve => setTimeout(resolve, ms));
		}

		await delay(50);
		return this.nextMove2(m, t, i);
	}
}
