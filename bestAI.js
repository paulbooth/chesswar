function BestAI(player) {
  var type = ROOK;
  this.getPlayerMove = function(board, callback) {
    callback(new Move(Math.floor(Math.random() * board.lanes),
      new Piece(type, player, Math.random() < .5)));
  }
}