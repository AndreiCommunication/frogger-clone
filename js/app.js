var Map = function(){
  var tileHeight = 83,
  tileWidth = tileHeight * 1.21687,
  numColumns = 9,
  numRows = 6;
  this.tileWidth = tileWidth;
  this.tileHeight = tileHeight;
  this.totalWidth = tileWidth * numColumns;
  this.totalHeight = tileHeight * (numRows + 1);
  this.numColumns = numColumns;
  this.numRows = numRows;
};

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
  // If 1, the enemies are moving, if 0, they are not,
  // see Enemy.prototype.togglePause()
  this.moving = 1;
};

// Generate a start position for each enemy
Enemy.prototype.startX = function() {
  return Math.random() * map.totalWidth * 0.5;
};

// Appropriate start position are at 56 + n83, where n == 0, 1, or 2.
// Random value from array courtesy of:
// http://stackoverflow.com/questions/4550505/getting-random-value-from-an-array
Enemy.prototype.startY = function() {
  var options = [ 0, 1, 2 ];
  var result = 56 + map.tileHeight * options[ Math.floor( Math.random() * options.length ) ];
  return result;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function( dt ) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  this.x = this.x + this.speed * dt * this.moving;
  if ( this.x > map.totalWidth + 100 ) {
    this.x = -100;
    this.y = Enemy.prototype.startY();
    this.speed = Enemy.prototype.speed();
  }
};

// Generate a random, appropriate speed for each bug
Enemy.prototype.speed = function() {
  return map.tileWidth + ( Math.random() * map.tileWidth * 2 );
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage( Resources.get( this.sprite ), this.x, this.y );
};

// Gets multiplied by the speed of each bug to determine whether an enemy is
// moving or not.
Enemy.prototype.togglePause = function() {
  if ( this.moving === 1 ) {
    this.moving = 0;
  } else {
    this.moving = 1;
  }
};

// Used in certain conditions where a toggle is not appropriate (due to being
// called within a loop)
Enemy.prototype.pause = function() {
  this.moving = 0;
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
  this.sprite = 'images/char-boy.png';
  this.x = Math.floor(map.numColumns/2) * map.tileWidth;
  this.y = 53 + (map.numRows - 2) * map.tileHeight;
  this.victory = false;
  this.numEnemies = 0;
  this.paused = false;
  this.isDead = false;
  this.victorySpot = 0;
  this.movingUp = true;
};

// Detect collisions
Player.prototype.update = function( dt ) {
  var currentSpots = [];
  for ( var i = 0; i < this.numEnemies; i++ ) {
    var x = allEnemies[ i ].x;
    var y = allEnemies[ i ].y;
    currentSpots.push( [ x, y ] );
  }
  for ( var b = 0; b < this.numEnemies; b++ ) {
    // Collision detected:
    if ( ( this.x - map.tileWidth/2 < currentSpots[ b ][ 0 ] &&
      this.x + map.tileWidth/2 > currentSpots[ b ][ 0 ] ) &&
      ( this.y - map.tileHeight/8 < currentSpots[ b ][ 1 ] &&
        this.y + map.tileHeight/8 > currentSpots[ b ][ 1 ] ) ) {
      this.dead();
    }
  } if (this.victory === true){
    this.victoryBounce(this.victorySpot, dt);
  }
};

Player.prototype.render = function() {
  ctx.drawImage( Resources.get( this.sprite ), this.x, this.y );
  if ( this.victory === true ) {
    Player.prototype.victory();
  } else if ( this.victory === false && this.paused === true && this.isDead === false ) {
    Player.prototype.pauseMessage();
  } else if ( this.isDead === true ) {
    Player.prototype.deadMessage();
    this.deadOverlay();
  }
};

Player.prototype.victory = function() {
  Player.prototype.victoryMessage();
  Player.prototype.playAgainMessage();
};

Player.prototype.victoryMessage = function() {
  ctx.font = '56px Impact';
  ctx.fillStyle = 'lime';
  ctx.strokeStyle = 'black';

  ctx.fillText( 'You win!', canvas.width / 2, canvas.height / 2 );
  ctx.strokeText( 'You win!', canvas.width / 2, canvas.height / 2 );
};

Player.prototype.playAgainMessage = function() {
  ctx.font = '40px Impact';
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';

  ctx.fillText( 'Press enter to play again', canvas.width / 2, canvas.height - 60 );
  ctx.strokeText( 'Press enter to play again', canvas.width / 2, canvas.height - 60 );
};

Player.prototype.pauseMessage = function() {
  ctx.font = '40px Impact';
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';
  ctx.fillText( 'Press "p" to unpause', canvas.width / 2, canvas.height / 2 );
  ctx.strokeText( 'Press "p" to unpause', canvas.width / 2, canvas.height / 2 );
};

Player.prototype.deadMessage = function() {
  ctx.font = '56px Impact';
  ctx.fillStyle = 'black';
  ctx.strokeStyle = 'red';
  ctx.fillText( 'You got hit!', canvas.width / 2, canvas.height - 140 );
  ctx.strokeText( 'You got hit!', canvas.width / 2, canvas.height - 140 );
  Player.prototype.playAgainMessage();
};

Player.prototype.togglePause = function() {
  for ( var i = 0; i < this.numEnemies; i++ ) {
    allEnemies[ i ].togglePause();
  }
  // affects what happens in Player.prototype.render
  this.paused = !this.paused;
};

Player.prototype.dead = function() {
  for ( var i = 0; i < this.numEnemies; i++ ) {
    allEnemies[ i ].pause();
  }
  // affects what happens in Player.prototype.render
  this.paused = true;
  // Allows us to reset game using enter button in the handleInput method
  this.isDead = true;
  // Change to dead sprite
  this.sprite = 'images/char-boy-hurt.png';
};

Player.prototype.deadOverlay = function() {
  var grd = ctx.createRadialGradient( this.x + map.tileWidth/2,
    this.y + map.tileWidth, map.tileWidth/2, this.x + map.tileWidth/2,
    this.y + map.tileWidth, map.tileWidth );

  grd.addColorStop( 0, 'rgba(255, 0, 0, 0.4)' );
  grd.addColorStop( 1, "rgba(255, 0, 0, 0)" );

  ctx.arc( this.x, this.y + map.tileWidth/2, map.tileWidth*3, 0, 2 * Math.PI );
  ctx.fillStyle = grd;
  ctx.fill();
};

Player.prototype.victoryBounce = function(startingY, dt) {
  var height = map.tileHeight/4;
  if (this.y > startingY - height && this.movingUp === true){
    // map.tileWidth here is used as a basis for a time measurement to so that
    // the game scales appropriately when bigger maps are used.
    this.y = this.y - map.tileWidth * dt;
  } else if (this.y < startingY){
    this.movingUp = false;
    this.y = this.y + map.tileWidth * dt;
  } else {
    this.movingUp = true;
  }
};

Player.prototype.handleInput = function( input ) {
  // Controls only work when game isn't paused
  if ( this.paused === false ) {
    if ( input === 'left' ) {
      if ( this.x <= map.tileWidth/2 ) {
        this.x = this.x + map.tileWidth *(map.numColumns-1);
        return;
      }
      this.x = this.x - map.tileWidth;
    } else if ( input === 'up' ) {
      // going to the top of the game field results in a victory
      if ( this.y <= map.tileHeight ) {
        this.sprite = 'images/char-boy-happy.png';
        this.victory = true;
        this.togglePause();
        this.victorySpot = this.y;
        return;
      }
      this.y = this.y - map.tileHeight;
    } else if ( input === 'right' ) {
      if ( this.x >= map.tileWidth * (map.numColumns - 1)) {
        this.x = this.x - map.tileWidth*(map.numColumns-1);
        return;
      }
      this.x = this.x + map.tileWidth;
    } else if ( input === 'down' ) {
      if ( this.y >= map.totalHeight - map.tileHeight*3 ) {
        return;
      }
      this.y = this.y + map.tileHeight;
    } else if ( input === 'pause' ) {
      this.togglePause();
    }
  }
  // If the game isn't over but is paused, only the unpause will work
  else if ( this.paused === true && this.victory === false && this.isDead === false ) {
    if ( input === 'pause' ) {
      this.togglePause();
    }
  } // When game is over, 'enter' can be used to reset it
  else if ( this.victory === true || this.isDead === true ) {
    if ( input === 'enter' ) {
      if ( this.victory === true ) {
        // Change back to normal sprite
        this.sprite = 'images/char-boy.png';
        this.victory = false;
        this.x = 2 * map.tileWidth;
        this.y = 53 + 4 * map.tileHeight;
        this.togglePause();
      } else if ( this.isDead === true ) {
        this.isDead = false;
        // Change back to normal sprite
        this.sprite = 'images/char-boy.png';
        this.x = 2 * map.tileWidth;
        this.y = 53 + 4 * map.tileHeight;
        this.togglePause();
      }
    }
  }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var map = new Map();
var player = new Player();

//Pick number of enemies
var enemyCount = function( count ) {
  for ( var i = 0; i < count; i++ ) {
    allEnemies.push( new Enemy() );
  }
  player.numEnemies = count;
};

enemyCount( 15 );


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener( 'keyup', function( e ) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    13: 'enter',
    80: 'pause'
  };

  player.handleInput( allowedKeys[ e.keyCode ] );
} );
