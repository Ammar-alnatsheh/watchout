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
  gameStats.bestScore = Math.max(gameStats.bestScore, gameStats.score);
  return d3.select('.highscore').text('High score: ' + gameStats.bestScore);
};

var collisionHappened = false;

/////////////////////////////////////////////////////////////////////////
// Player class

class Player {

  constructor() {
  this.x = 0;
  this.cx = 25;
  this.y = 0;
  this.cy = 25;
  this.r = 23;

}

  render(board) {
    this.el = board.append('svg:circle')
                   .attr('class','player')
                   .attr('x',this.x)
                   .attr('y', this.y)
                   .attr('cx',this.cx)
                   .attr('cy', this.cy)
                   .attr('r',this.r)
                   // give the player white color by default
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
// enemy class

var createEnemies = function() {
  var result = [];
  for (var i = 0; i < gameOptions.nEnemies; i++) {
    var enemy =  {
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100
    };
    result.push(enemy);
  }

  return result;
};

var renderEnemies = function(enemy_data) {

  var enemies = gameBoard.selectAll('circle.enemy')
                     .data(enemy_data, function(d) {
                       return d.id;
                     });

  enemies.enter().append('svg:circle')
                 .attr('class', 'enemy')
                 .attr('cx', function(enemy) {
                   return axes.x(enemy.x);
                 })
                 .attr('cy', function(enemy) {
                   return axes.y(enemy.y);
                 })
                 .attr('r', 23)
                 // give the enemy red color by default
                 .attr('fill', 'red');

  enemies.exit().remove();

  var checkCollision = function(enemy, collidedCallback) {
    return players.forEach(function(player) {
      var radiusSum, separation, xDiff, yDiff;
      radiusSum = parseFloat(enemy.attr('r')) + player.r;
      xDiff = parseFloat(enemy.attr('cx')) - player.x;
      yDiff = parseFloat(enemy.attr('cy')) - player.y;
      separation = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
      if (separation < radiusSum) return collidedCallback(player, enemy);
    });
  };


  var onCollision = function() {
    collisionHappened = true;
    updateScore();
    gameStats.score = 0;

  };

  var tweenWithCollisionDetection = function(endData) {
    var endPos, enemy, startPos;
    enemy = d3.select(this);
    startPos = {
      x: parseFloat(enemy.attr('cx')),
      y: parseFloat(enemy.attr('cy'))
    };
    endPos = {
      x: axes.x(endData.x),
      y: axes.y(endData.y)
    };
    return function(t) {
      var enemyNextPos;
      checkCollision(enemy, onCollision);
      enemyNextPos = {
        x: startPos.x + (endPos.x - startPos.x) * t,
        y: startPos.y + (endPos.y - startPos.y) * t
      };
      return enemy.attr('cx', enemyNextPos.x).attr('cy', enemyNextPos.y);
    };
  };

  return enemies.transition().duration(500).attr('r', 10).transition().duration(2000).tween('custom', tweenWithCollisionDetection);
};

// finish enemy class
/////////////////////////////////////////////////////////////////////////

var players = [];
players.push(new Player(gameOptions).render(gameBoard));

var play = function() {

  var gameTurn = function() {
    if (collisionHappened === true) {
      // increase Collision by 1 every round not every movment for
      // the enemy object over the player. 10 movement ber round for
      // the enemy over the player should be 1 collision
      gameStats.collisions += 1;
      d3.select('.collisions').text('Collisions number: ' + gameStats.collisions);
      updateBestScore();
    }

    var newEnemyPositions = createEnemies();
    return renderEnemies(newEnemyPositions);

  };

  var increaseScore = function() {
    gameStats.score += 1;
    return updateScore();
  };

  gameTurn();
  setInterval(gameTurn, 2000);
  return setInterval(increaseScore, 100);

};

play();
