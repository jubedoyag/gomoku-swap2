class gameManager {
    constructor ( time, size ) {
	this.boardSize	    = size;
	this.board	    = new Map();
	this.players	    = null;
	this.playersTime    = time;
	this.lastPlay	    = null;
	this.winner	    = null;
    }

    // TODO
    #validMove ( move ) {
	try {
	    const [ row, col ] = move;
	    const moveKey = `${row}${col}`;

	    /* Free position */
	    return !this.board.get(moveKey);
	}
	catch ( error ) {
	    console.log(error.message);
	    return false;
	}
    }

    #itsDraw () {
	for (let i = 0; i < this.board.length; i++) {
	    for (let j = 0; j < this.board.length; j++) {
		if ( !this.board.get(`${i}${j}`) )
		    return false;
	    }
	}
	return true;
    }

    // TODO?
    #updateBoard ( move, playerId ) {
	const [ row, col ] = move;
	const moveKey = `${row}${col}`;

	const DIRECTIONS = [
	    [0, 1],
	    [1, 1],
	    [1, 0],
	    [1,-1]
	];
	let data = { count: 1 };
	for (let i = 0; i < DIRECTIONS.length * 2; i++) {
	    const [ nRow, nCol ] = DIRECTIONS[i];

	    const neighbourKey = `${nRow}${nCol}`;
	    const neighbour = this.board.get(neighbourKey);
	    neighbour.groupData.count++;
	    data = neighbour.groupData
	}
	count >= 5 && this.winner = playerId;
	this.board.set(
	    moveKey,
	    {
		value: playerId,
		groupData: data
	    }
	);
    }

    #getPlayFrom ( playerToMove, id ) {
	const start = new Date().getTime();
	this.lastPlay = playerToMove
	    .player
	    .nextMove(
		this.lastPlay,
		playerToMove.time
	    );
	const turnLapse = new Date().getTime() - start;
	playerToMove.time -= turnLapse;

	if ( !this.#validMove( this.lastPlay, player ) ) {
	    console.log(`Invalid move made by player #${id}.`)
	    return;
	}

	this.#updateBoard( this.lastPlay, id );

	if ( typeof this.winner === 'number' ) {
	    console.log("Winner: ", this.winner);
	    return;
	}
	if ( this.#itsDraw() ) {
	    console.log("Draw.");
	    return;
	}

	this.#getPlayFrom( this.players[1-id], 1-id );
    }

    startGame ( playerA, playerB ) {
	this.board = this.generateBoard();
	
	if ( Math.random() < 0.5 ) {
	     this.players[0] = { 
		 player: playerA,
		 time: this.playersTime * 60 * 1000
	     };

	     this.players[1] = { 
		 player: playerB,
		 time: this.playersTime * 60 * 1000
	     };
	}
	else {
	     this.players[1] = { 
		 player: playerA,
		 time: this.playersTime * 60 * 1000
	     };

	     this.players[0] = { 
		 player: playerB,
		 time: this.playersTime * 60 * 1000
	     };
	}

	this.#getPlayFrom( this.players[0], 0 );
    }
}
