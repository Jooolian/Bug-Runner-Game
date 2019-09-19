$(document).ready(function(){
  // Show the Modal on load
  $("#myModal").modal("show");
});

$("#boy").click(function() {
  player.sprite = 'images/char-boy.png';
  $("#myModal").modal("hide");
})
$("#cat-girl").click(function() {
  player.sprite = 'images/char-cat-girl.png';
  $("#myModal").modal("hide");
})
$("#pink-girl").click(function() {
  player.sprite = 'images/char-pink-girl.png';
  $("#myModal").modal("hide");
})
$("#princess-girl").click(function() {
  player.sprite = 'images/char-princess-girl.png';
  $("#myModal").modal("hide");
})
$("#horn-girl").click(function() {
  player.sprite = 'images/char-horn-girl.png';
  $("#myModal").modal("hide");
})

// to keep score of points
let score = 0;

// Enemies our player must avoid
// you enter the position of the enemy - either 0, 1, 2 - referencing the rows
// of stone blocks and the speed the enemies are shall move at
var Enemy = function(startY, speed) {
    // sprites are 101 wide and 83 high
    this.startX = -101;
    this.startY = (startY * 83) + 60; // 60 centers them vertically
    this.x = this.startX;
    this.y = this.startY;
    this.speed = speed;
    this.sprite = 'images/enemy-bug.png';
    this.collisionWidth = 101/2;
    this.collisionHeight = 83/2;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  
    // the enemies should disappear when they leave the screen to the right
    const borderRight = 505;
    // if enemies leave the screen to the right, reset them to the left
    if (this.x > borderRight) {
        this.x = this.startX;
    }
    // if not keep moving
    //multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers
    else {
      this.x += this.speed * dt;
    };
};

// draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// player class with update(), render() and a handleInput() method
class ThePlayer {
  constructor() {

    this.sprite = 'images/char-pink-girl.png';
    // sprites are 101 wide and 83 high
    this.horizontalStep = 101;
    this.verticalStep = 83;
    // the player is horizontally centered at the bottom
    this.startX = 2 * this.horizontalStep;
    this.startY = (4 * this.verticalStep) + 60; // add 60 here to vertically align with enemies
    // set x and y to starting values
    this.x = this.startX;
    this.y = this.startY;
    // size that reacts to collisions
    this.collisionWidth = 101/2;
    this.collisionHeight= 83/2;
  }

  // updates player position, checks for collisions
  update() {
        // did player collide with enemy?
       for (let enemy of allEnemies) {
         // collision? from http://blog.sklambert.com/html5-canvas-game-2d-collision-detection/#d-collision-detection
         if (this.x < enemy.x + enemy.collisionWidth && this.x + this.collisionWidth > enemy.x && this.y < enemy.y + enemy.collisionHeight && this.y + this.collisionHeight > enemy.y) {
           // if yes change score and reset to start
           this.restart();
         }
       };

       // did player reach water and win? Again, 60 added to vertically align with enemies
      //  if (this.y < 60) {
         // if yes change score and reset player to start
        //  score += 1;
        //  this.restart();
         // has the player won (scored 10 points)? Open modal (also stops game)
    //      if (score > 0) {
    //        if(window.confirm("You won! Do you want to play another round?")) {
    //          this.newGame();
    //      }
    //    }
    //  }
    };

  // resets coordinates to start coordinates
  restart() {
    this.y = this.startY;
    this.x = this.startX;
  }

  // starts a new game
  newGame() {
    this.restart();
    score = 0;
  };

  // render player at x,y coordinates
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };

  // handle the input from the eventlistener and change this.x
  // and this.y accordingly so the player moves
  handleInput(key) {
    if (key == "up" && this.y >= 60) {
      this.y -= this.verticalStep;
    } console.log(this.x, this.y)
    if (key == "down" && this.y < (4 * this.verticalStep)) {
      this.y += this.verticalStep;
    } console.log(this.x, this.y)
    if (key == "left" && this.x >= this.horizontalStep) {
      this.x -= this.horizontalStep;
    } console.log(this.x, this.y)
    if (key == "right" && this.x <= (3 * this.horizontalStep)) {
      this.x += this.horizontalStep;
    } console.log(this.x, this.y)
  }
};

// instantiate new thePlayer and place object in a variable called player
const player = new ThePlayer();

// create array allEnemies, instantiate enemies and push into allEnemies
let allEnemies = [];

let enemyOne = new Enemy(0, 100);
allEnemies.push(enemyOne);

let enemyTwo = new Enemy(1, 200);
allEnemies.push(enemyTwo);

let enemyThree = new Enemy(2, 150);
allEnemies.push(enemyThree);

let enemyFour = new Enemy(2, 200);
allEnemies.push(enemyFour);

let enemyFive = new Enemy(1, 225);
allEnemies.push(enemyFive);

let enemySix = new Enemy(0, 250);
allEnemies.push(enemySix);

let enemySeven = new Enemy(3, 175);

let enemyEight = new Enemy(3, 75);
allEnemies.push(enemyEight);


// This listens for key presses and sends the keys to
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
