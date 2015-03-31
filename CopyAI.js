function CopyAI(player, increment) {
  this.getPlayerMove = function(board, callback) {
    if (board.lastMove == null) {
      callback(new Move(Math.floor(Math.random() * board.lanes),
        new Piece(Math.floor(Math.random() * 3 /* three types*/), player, Math.random() < .5)));
    } else {
      callback(new Move(board.lastMove.lane, new Piece(board.lastMove.piece.type, player, board.lastMove.piece.movingUp)))
    }
  }
}