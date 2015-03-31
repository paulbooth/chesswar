function CycleAI(player, increment) {
  var type = 0;
  this.getPlayerMove = function(board, callback) {
    if (increment) {
      type++
    } else {
      type--;
    }
    if (type > 2) {
      type = 0;
    } else if (type < 0) {
      type = 2;
    }
    callback(new Move(Math.floor(Math.random() * board.lanes),
      new Piece(type, player, Math.random() < .5)));
  }
}