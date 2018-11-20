// start slingin' some d3 here.

var gameOptions = {
  height: 550,
  width: 1400,
  nEnemies: 10,
  padding: 20
};

var gameStats = {
  score: 0,
  bestScore: 0,
  collisions: 0
};

var axes = {
  x: d3.scale.linear().domain([0,100]).range([0,gameOptions.width]),
  y: d3.scale.linear().domain([0,100]).range([0,gameOptions.height])
};

var gameBoard = d3.select('.board').append('svg:svg')
                .attr('width', gameOptions.width)
                .attr('height', gameOptions.height);

var updateScore = function() {
  return d3.select('.current').text('Current score: ' + gameStats.score);
};

var updateBestScore = function() {
  gameStats.bestScore = _.max([gameStats.bestScore, gameStats.score]);
  return d3.select('.highscore').text('High score: ' + gameStats.bestScore);
};

/////////////////////////////////////////////////////////////////////////
// Player class

class Player {

  constructor(gameOptions) {
  this.x = 0;
  this.cx = 25;
  this.y = 0;
  this.cy = 25;
  this.r = 23;

}

  render(board) {
    this.el = board.append('svg:circle')
                   .attr('height', 50)
                   .attr('width', 50)
                   .attr('x',this.x)
                   .attr('y', this.y)
                   .attr('cx',this.cx)
                   .attr('cy', this.cy)
                   .attr('r',this.r)
                   .attr('fill', 'white');

    this.transform({
      x: gameOptions.width * 0.5,
      y: gameOptions.height * 0.5
    });
    this.setupDragging();
    return this;
  }

  getX() {
    return this.x;
  }

  setX(x) {
    var maxX, minX;
    minX = gameOptions.padding;
    maxX = gameOptions.width - gameOptions.padding - 30;
    if (x <= minX) x = minX;
    if (x >= maxX) x = maxX;
    return this.x = x;
  }

  getY() {
    return this.y;
  }

  setY(y) {
    var maxY, minY;
    minY = gameOptions.padding;
    maxY = gameOptions.height - gameOptions.padding - 30;
    if (y <= minY) y = minY;
    if (y >= maxY) y = maxY;
    return this.y = y;
  }

  transform(opts) {
    this.setX(opts.x || this.x);
    this.setY(opts.y || this.y);
    return this.el.attr('transform', ("translate(" + (this.getX()) + "," + (this.getY()) + ")"));
  };

  moveAbsolute(x, y) {
    return this.transform({
      x: x,
      y: y
    });
  };

  moveRelative(dx, dy) {
    return this.transform({
      x: this.getX() + dx,
      y: this.getY() + dy
    });
  }

  setupDragging() {
    var drag, dragMove,
      _this = this;
    dragMove = function() {
      return _this.moveRelative(d3.event.dx, d3.event.dy);
    };
    drag = d3.behavior.drag().on('drag', dragMove);
    return this.el.call(drag);
  }

}

// finish player class
/////////////////////////////////////////////////////////////////////////

var players = [];
players.push(new Player(gameOptions).render(gameBoard));

var play = function() {

  var gameTurn = function() {
    // var newEnemyPositions = createEnemies();
    // return render(newEnemyPositions);

  };

  var increaseScore = function() {
    gameStats.score += 1;
    return updateScore();
  };

  gameTurn();
  setInterval(gameTurn, 2000);
  return setInterval(increaseScore, 50);

};

play();
