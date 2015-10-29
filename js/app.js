// Enemies our player must avoid
var Enemy = function() {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started

  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';
  this.x = Enemy.prototype.startX();
  this.y = Enemy.prototype.startY();
  this.speed = Enemy.prototype.speed();
};

// Generate a start position for each enemy, slightly less than width of canvas
// which is 505.
Enemy.prototype.startX = function() {
  return Math.random() * 450;
};

// Appropriate start position are at 56 + n83, where n == 0, 1, or 2.
// Random value from array courtesy of:
// http://stackoverflow.com/questions/4550505/getting-random-value-from-an-array
Enemy.prototype.startY = function() {
  var options = [0, 1, 2];
  var result = 56 + 83 * options[Math.floor(Math.random() * options.length)];
  return result;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function( dt ) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  this.x = this.x + this.speed;
  if (this.x > 600) {
    this.x = -150;
    this.y = Enemy.prototype.startY();
  }
};

// Generate a random, appropriate speed for each bug
Enemy.prototype.speed = function (){
  return 1.25 + (Math.random() * 5);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage( Resources.get( this.sprite ), this.x, this.y );
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
  this.sprite = 'char-princess-girl.png';
};

Player.prototype.update = function( dt ) {

};

Player.prototype.render = function() {

};

Player.prototype.handleInput = function() {

};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var player = new Player();

//Pick number of enemies
var enemyCount = function( count ) {
  for ( var i = 0; i < count; i++ ) {
    allEnemies.push( new Enemy() );
  }
};

enemyCount( 3 );


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener( 'keyup', function( e ) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput( allowedKeys[ e.keyCode ] );
} );
