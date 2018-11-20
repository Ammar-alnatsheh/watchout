// start slingin' some d3 here.
(function() {
  var Player, axes, createEnemies, gameBoard, gameOptions, gameStats, play, players, render, updateBestScore, updateScore,
    __bind = function(fn, me){
      return function(){
        return fn.apply(me, arguments);
      };
  };

  gameOptions = {
    height: 550,
    width: 1400,
    nEnemies: 10,
    padding: 20
  };

  gameStats = {
    score: 0,
    bestScore: 0,
    collisions: 0
  };

  axes = {
    x: d3.scale.linear().domain([0,100]).range([0,gameOptions.width]),
    y: d3.scale.linear().domain([0,100]).range([0,gameOptions.height])
  };

  gameBoard = d3.select('.board').append('svg:svg')
                  .attr('width', gameOptions.width)
                  .attr('height', gameOptions.height);

  updateScore = function() {
    return d3.select('.current').text(gameStats.score.toString());
  };

  updateBestScore = function() {
    gameStats.bestScore = _.max([gameStats.bestScore, gameStats.score]);
    return d3.select('.highscore').text(gameStats.bestScore.toString());
  };

  /////////////////////////////////////////////////////////////////////////
  // Player class

  Player = (function() {

    Player.prototype.path = 'm-7.5,1.62413c0,-5.04095 4.08318,-9.12413 9.12414,-9.12413c5.04096,0 9.70345,5.53145 11.87586,9.12413c-2.02759,2.72372 -6.8349,9.12415 -11.87586,9.12415c-5.04096,0 -9.12414,-4.08318 -9.12414,-9.12415z';

    Player.prototype.fill = '#ff6600';

    Player.prototype.x = 0;

    Player.prototype.y = 0;

    Player.prototype.angle = 0;

    Player.prototype.r = 5;

    function Player(gameOptions) {
      this.setupDragging = __bind(this.setupDragging, this);
      this.moveRelative = __bind(this.moveRelative, this);
      this.moveAbsolute = __bind(this.moveAbsolute, this);
      this.transform = __bind(this.transform, this);
      this.setY = __bind(this.setY, this);
      this.getY = __bind(this.getY, this);
      this.setX = __bind(this.setX, this);
      this.getX = __bind(this.getX, this);
      this.render = __bind(this.render, this);      this.gameOptions = gameOptions;
    }

    Player.prototype.render = function(to) {
      this.el = to.append('svg:path').attr('d', this.path).attr('fill', this.fill);
      this.transform({
        x: this.gameOptions.width * 0.5,
        y: this.gameOptions.height * 0.5
      });
      this.setupDragging();
      return this;
    };

    Player.prototype.getX = function() {
      return this.x;
    };

    Player.prototype.setX = function(x) {
      var maxX, minX;
      minX = this.gameOptions.padding;
      maxX = this.gameOptions.width - this.gameOptions.padding;
      if (x <= minX) x = minX;
      if (x >= maxX) x = maxX;
      return this.x = x;
    };

    Player.prototype.getY = function() {
      return this.y;
    };

    Player.prototype.setY = function(y) {
      var maxY, minY;
      minY = this.gameOptions.padding;
      maxY = this.gameOptions.height - this.gameOptions.padding;
      if (y <= minY) y = minY;
      if (y >= maxY) y = maxY;
      return this.y = y;
    };

    Player.prototype.transform = function(opts) {
      this.angle = opts.angle || this.angle;
      this.setX(opts.x || this.x);
      this.setY(opts.y || this.y);
      return this.el.attr('transform', ("rotate(" + this.angle + "," + (this.getX()) + "," + (this.getY()) + ") ") + ("translate(" + (this.getX()) + "," + (this.getY()) + ")"));
    };

    Player.prototype.moveAbsolute = function(x, y) {
      return this.transform({
        x: x,
        y: y
      });
    };

    Player.prototype.moveRelative = function(dx, dy) {
      return this.transform({
        x: this.getX() + dx,
        y: this.getY() + dy,
        angle: 360 * (Math.atan2(dy, dx) / (Math.PI * 2))
      });
    };

    Player.prototype.setupDragging = function() {
      var drag, dragMove,
        _this = this;
      dragMove = function() {
        return _this.moveRelative(d3.event.dx, d3.event.dy);
      };
      drag = d3.behavior.drag().on('drag', dragMove);
      return this.el.call(drag);
    };

    return Player;

  })();

  // finish player class
  /////////////////////////////////////////////////////////////////////////

  players = [];
  players.push(new Player(gameOptions).render(gameBoard));

  // create enemies
  

  /////////////////////////////////////////////////////////////////////////


  play = function() {

    var gameTurn = function() {
      var newEnemyPositions = createEnemies();
      return render(newEnemyPositions);

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

}).call(this);
