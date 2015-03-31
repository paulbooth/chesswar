// game parameters
var lanes  = 4;
var length = 8;
var turnTime = 200;
var maxGameScore = 20;
var maxTurns = 100;
var cellSize = 50;
var maxGames = 10;
var drawGame = true;

// game constants
var ROOK = 0;
var KNIGHT = 1;
var BISHOP = 2;

var p1score = 0;
var p2score = 0;
var turnNumber = 0;
var player1turn = true;

var numGames = 0;
var p1gamesWon = 0;
var p2gamesWon = 0;
var p1totalScore = 0;
var p2totalScore = 0;

function Piece(type, player, movingUp) {
  this.type = type;
  this.player = player;
  this.movingUp = movingUp;
}

function BoardSpace(lane, position, piece) {
  this.lane = lane;
  this.position = position;
  this.piece = piece;
}

function Move(lane, piece) {
  this.lane = lane;
  this.piece = piece;
}

function Board(lanes, length) {
  this.lanes = lanes;
  this.length = length;
  this.lastMove = null;
  // init the board
  var board = new Array(lanes);
  for (var i = 0; i < lanes; i++) {
    board[i] = new Array(length);
    for (var j = 0; j < length; j++) {
      board[i][j] = new BoardSpace(i,j, null);
    }
  }
  this.board = board;
}


function advancePlayer(board, player) {
  if (player == 2) {
    // iterate from left (most forward) to right (most behind)
    for (var i = 0; i < length; i++) {
      for (var j = 0; j < lanes; j++) {
        var space = board.board[j][i];
        if (space.piece != null && space.piece.player == player) {
          advancePieceIfPossible(board, space);
        }
      }
    }
  } else {
    // iterate from right (most forward) to left (most behind)
    for (var i = length - 1; i >= 0; i--) {
      for (var j = 0; j < lanes; j++) {
        var space = board.board[j][i];
        if (space.piece != null && space.piece.player == player) {
          advancePieceIfPossible(board, space);
        }
      }
    }
  }
}

function advancePieceIfPossible(board, space) {
  var p = space.piece;
  var dx = 1;
  if (p.type == KNIGHT) {
    dx = 2;
  }
  if (p.player == 2) {
    dx *= -1;
  }
  var dy = p.movingUp ? -1: 1;
  if (p.type == ROOK) {
    dy = 0;
  }
  var newSpotLane = space.lane + dy;
  if (newSpotLane < 0 || newSpotLane >= board.lanes) {
    // get bounced position
    newSpotLane = space.lane - dy;
    newSpotLane = Math.max(Math.min(newSpotLane, board.lanes - 1), 0);
    // flip direction
    p.movingUp = !p.movingUp;
  }
  var newSpotLength = space.position + dx;
  if (newSpotLength < 0) {
    p2score++;
    space.piece = null;
    return;
  }
  if (newSpotLength >= board.length) {
    p1score++;
    space.piece = null;
    return;
  }
  // resolve conflicts
  var newSpace = board.board[newSpotLane][newSpotLength];
  // console.log(board, board.board, newSpotLane, newSpotLength, newSpace);
  var op = newSpace.piece;
  if (op == null) {
    newSpace.piece = p;
    space.piece = null;
    return;
  } else if (op.player == p.player) {
    return;
  } else {
    // just kill piece:
    // newSpace.piece = p;
    // space.piece = null;

    // we hit the other player's piece
    switch(p.type) {
      case ROOK:
        switch(op.type) {
          case ROOK:
            // rooks hitting rooks make walls - do nothing
            break;
          case KNIGHT:
            // rooks kill knights
            newSpace.piece = p;
            space.piece = null;
            break;
          case BISHOP:
            // rook killed by knight
            space.piece = null;
            break;
        }
        break;
      case KNIGHT:
        switch(op.type) {
          case ROOK:
            // knight killed by rook
            space.piece = null;
            break;
          case KNIGHT:
            // knights stand off - kill both
            newSpace.piece = null;
            space.piece = null;
            break;
          case BISHOP:
            // knight kills bishop
            newSpace.piece = p;
            space.piece = null;
            break;
        }
        break;
      case BISHOP:
        switch(op.type) {
          case ROOK:
            // bishop kills rook
            newSpace.piece = p;
            space.piece = null;
            break;
          case KNIGHT:
            // bishop killed by knight
            space.piece = null;
            break;
          case BISHOP:
            // bishop standoff- nothing happens
            break;
        }
        break;
    }
  }
}

function applyMoveIfValid(board, position, move) {
  // TODO handle conflicts
  board.board[move.lane][position].piece = move.piece;
  board.lastMove = move;
}

function getPieceString(piece) {
  if (piece.type == ROOK) {
    return piece.player == 1 ? "\u2656" : "\u265C";
  } else if (piece.type == KNIGHT) {
    return piece.player == 1 ? "\u2658" : "\u265E";
  } else if (piece.type == BISHOP) {
    return piece.player == 1 ? "\u2657" : "\u265D";
  } else {
    console.log("WHOA WHAT THE F piece:");
    console.log(piece);
    return " ";
  }
}

function getBoardString() {
  for (var i = 0; i < lanes; i++) {
    if (i != 0) {
      s += "\n";
    }
    for (var j = 0; j < length; j++) {
      var p = board[i][j].piece;
      if (p == null) {
        s += " ";
      } else {
        s += getPieceString(p);
      }
    }
  }
  return s;
}

// draw it so humans can see!
function drawBoard(board) {
  if (!drawGame) {
    return;
  }
  $('#board_table').empty();
  $('#board_table').width(length*cellSize);
  for (var i = 0; i < lanes; i++) {
    var row = $("<tr />");
    for (var j = 0; j < length; j++) {
      var cell = $("<td height = '" + cellSize + "' width='" + cellSize + "'/>");
      var p = board.board[i][j].piece;
      if (p == null) {
        cell.text(" ");
      } else {
        if (p.player == 1) {
          if (!p.movingUp && p.type != ROOK) {
            cell.addClass("player1flip");
          } else {
            cell.addClass("player1normal");
          }
        } else {
          if (!p.movingUp && p.type != ROOK) {
            cell.addClass("player2flip");
          }
        }
        if (p.player == 1) {
          cell.addClass("player1piece");
        }
        cell.text(getPieceString(p));
      }
      row.append(cell);
    }
    $('#board_table').append(row);
  }
}

function updateScores() {
  $('#p1score').text("P1: " + p1score);
  $('#p2score').text("P2: " + p2score);
  $('#turn').text("Turn: " + turnNumber);
}

function takeTurn() {
  if (player1turn) {
    // ask player 1 to move
    player1.getPlayerMove(board, function(playerMove) {
      advancePlayer(board, 1);
      applyMoveIfValid(board, 0, playerMove);
      endOfTurn();
    });
  } else {
    // ask player 2 to move
    playerMove = player2.getPlayerMove(board, function(playerMove) {
      advancePlayer(board, 2);
      applyMoveIfValid(board, board.length-1, playerMove);
      endOfTurn();
    });
  }
}

function endOfTurn() {
  turnNumber++;
  player1turn = !player1turn;
  drawBoard(board);
  updateScores();
  if (p1score >= maxGameScore || p2score >= maxGameScore || turnNumber > maxTurns) {
    gameOver();
  } else {
    // next turn
    setTimeout(takeTurn, turnTime);
  }
}

function gameOver() {
  $("#turn").text("GAME OVER!");
  console.log("P1: " + p1score + " P2: " + p2score);
  if (p1score > p2score) {
    p1gamesWon++;
  } else if (p2score > p1score) {
    p2gamesWon++
  }
  p1totalScore += p1score;
  p2totalScore += p2score;
  numGames++;
  if (numGames < maxGames) {
    runGame();
  } else {
    console.log("P1 total: " + p1totalScore + " P2 total: " + p2totalScore);
    console.log("P1 wins:" + p1gamesWon + " P2 wins: " + p2gamesWon);
  }
}

function runGame() {
  board = new Board(lanes, length);
  player1 = new Player(1, lanes);
  player2 = new RandomAI(2);
  p1score = 0;
  p2score = 0;
  turnNumber = 0;
  drawBoard(board);
  updateScores();
  // board.board[2][0].piece = new Piece(ROOK, 1, 0);
  // board.board[3][7].piece = new Piece(BISHOP, 2, 1);
  // board.board[1][5].piece = new Piece(KNIGHT, 2, 1);
  takeTurn();
  // gameUpdateHandle = setTimeout(takeTurn, turnTime);
}
$(document).ready(runGame);