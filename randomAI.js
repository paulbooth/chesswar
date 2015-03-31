function RandomAI(player) {
  this.getPlayerMove = function(board, callback) {
    callback(new Move(Math.floor(Math.random() * board.lanes),
      new Piece(Math.floor(Math.random() * 3 /* three types*/), player, Math.random() < .5)));
  }
}