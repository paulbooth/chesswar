function Player(player, lanes) {
  var self = this;
  var type = 0;
  var directionUp = true;
  this.getPlayerMove = function(board, callback) {
    this.enablePlayerControls();
    this.setCallback(board, callback);
  }

  this.setCallback = function(board, callback) {
    $('#player-input-' + player + ' #takeTurn').click(function() {
      var lane = parseInt($('#player-input-' + player + ' #lane').val());
      if (lane >= 0 && lane < board.lanes) {
        self.disablePlayerControls();
        $('#player-input-' + player + ' #takeTurn').unbind("click");
        callback(new Move(lane,
          new Piece(type, player, directionUp)));
      }
    });
  }

  this.showPlayerControls = function() {
    $('#player-input-' + player).show();
    $('#player-input-' + player + ' #rook').addClass('btn')
  }

  this.disablePlayerControls = function() {
    $('#player-input-' + player + ' #takeTurn').attr("disabled","disabled");
  }

  this.enablePlayerControls = function() {
    $('#player-input-' + player + ' #takeTurn').removeAttr("disabled");
  }

  $('#player-input-' + player + ' #rook').click(function() {
    type = ROOK;
    $('#player-input-' + player + ' .type').removeClass("btn-primary");
    $('#player-input-' + player + ' #rook').addClass("btn-primary");
  });
  $('#player-input-' + player + ' #knight').click(function() {
    type = KNIGHT;
    $('#player-input-' + player + ' .type').removeClass("btn-primary");
    $('#player-input-' + player + ' #knight').addClass("btn-primary");
  });
  $('#player-input-' + player + ' #bishop').click(function() {
    type = BISHOP;
    $('#player-input-' + player + ' .type').removeClass("btn-primary");
    $('#player-input-' + player + ' #bishop').addClass("btn-primary");
  });
  $('#player-input-' + player + ' #direction').click(function() {
    directionUp = !directionUp;
    $('#player-input-' + player + ' #direction').text(directionUp ? "UP" : "DOWN");
  });

  for (var i = 0; i < lanes; i++) {
    $('#player-input-' + player + ' #lane').append($('<option>' + i + '</option>'));
  }
  this.showPlayerControls();
}


