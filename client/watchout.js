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

  this.path = 'm-7.5,1.62413c0,-5.04095 4.08318,-9.12413 9.12414,-9.12413c5.04096,0 9.70345,5.53145 11.87586,9.12413c-2.02759,2.72372 -6.8349,9.12415 -11.87586,9.12415c-5.04096,0 -9.12414,-4.08318 -9.12414,-9.12415z';
  this.x = 0;
  this.y = 0;
  this.angle = 0;
  this.r = 30;
  this.gameOptions = gameOptions;
}

  render(to) {
    this.el = to.append('svg:path').attr('d', this.path);
    this.transform({
      x: this.gameOptions.width * 0.5,
      y: this.gameOptions.height * 0.5
    });
    this.setupDragging();
    return this;
  }

  getX() {
    return this.x;
  }

  setX(x) {
    var maxX, minX;
    minX = this.gameOptions.padding;
    maxX = this.gameOptions.width - this.gameOptions.padding;
    if (x <= minX) x = minX;
    if (x >= maxX) x = maxX;
    return this.x = x;
  }

  getY() {
    return this.y;
  }

  setY(y) {
    var maxY, minY;
    minY = this.gameOptions.padding;
    maxY = this.gameOptions.height - this.gameOptions.padding;
    if (y <= minY) y = minY;
    if (y >= maxY) y = maxY;
    return this.y = y;
  }

  transform(opts) {
    this.angle = opts.angle || this.angle;
    this.setX(opts.x || this.x);
    this.setY(opts.y || this.y);
    return this.el.attr('transform', ("rotate(" + this.angle + "," + (this.getX()) + "," + (this.getY()) + ") ") + ("translate(" + (this.getX()) + "," + (this.getY()) + ")"));
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
      y: this.getY() + dy,
      angle: 360 * (Math.atan2(dy, dx) / (Math.PI * 2))
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
