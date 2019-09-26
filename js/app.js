$(document).ready(function() {
  // Show the Modal on load
  $("#myModal").modal("show");
});

$("#characters").click(function(event) {
  switch (event.target.id) {
    case "boy":
      player.sprite = 'images/char-boy.png';
      break;
    case "cat-girl":
      player.sprite = 'images/char-cat-girl.png';
      break;
    case "pink-girl":
      player.sprite = 'images/char-pink-girl.png';
      break;
    case "horn-girl":
      player.sprite = 'images/char-horn-girl.png';
      break;  
  }
  
  $("#myModal").modal("hide");

  // This listens for key presses and sends the keys to
  // Player.handleInput() method. This should only be enabled
  // after player has chosen a character
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});

});

// prevent modal from closing before character is chosen
$('#myModal').modal({
  backdrop: 'static',
  keyboard: false
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
    const borderRight = 707;
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
    this.startX = 3 * this.horizontalStep;
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
           reduceHearts();
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
    // to better understand the restrictions around the rocks: height of the pngs is 171, visible height only 83!
    // step up
    if(key == "up" && this.y >= 60 && this.x != rocks.x) {
      this.y -= this.verticalStep;
    } 
    // block step up if rock is in the way 
    else if(key == "up" && this.y >= 60 && this.x == rocks.x && (this.y >= rocks.y + (2 * this.verticalStep + 10) || this.y < rocks.y)) {
      this.y -= this.verticalStep;
    }
    // step down
    else if(key == "down" && this.y < (4 * this.verticalStep) && this.x != rocks.x) {
      this.y += this.verticalStep;
    } 
    // block step down if rock is in the way
    else if(key == "down" && this.y < (4 * this.verticalStep) && this.x == rocks.x && (this.y <= rocks.y - this.verticalStep || this.y > rocks.y)) {
      this.y += this.verticalStep;
    } 
    // step to the left
    else if(key == "left" && this.x >= this.horizontalStep && this.y != rocks.y + 10) {
      this.x -= this.horizontalStep;
    } 
    // block step to the left if rock is in the way
    else if(key == "left" && this.x >= this.horizontalStep && this.y == rocks.y + 10 && (this.x >= rocks.x + 2 * this.horizontalStep || this.x <= rocks.x - this.horizontalStep)) {
      this.x -= this.horizontalStep;
    } 
    // step to the right
    else if(key == "right" && this.x <= (5 * this.horizontalStep) && this.y != rocks.y + 10) {
      this.x += this.horizontalStep;
    } 
      // block step to the left if rock is in the way
    else if(key == "right" && this.x <= (5 * this.horizontalStep) && this.y == rocks.y + 10 && (this.x <= rocks.x - 2 * this.horizontalStep || this.x >= rocks.x + this.horizontalStep)) {
      this.x += this.horizontalStep;
    } 
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

// reduce number of hearts when collision between player and enemy
function reduceHearts() {
  const activeHeart = "rgb(232, 9, 9)";
  const lostHeart = "#e8e8e8";
  console.log("first");
  console.log($("#heart1").css("color"))

  if ($("#heart1").css("color") == activeHeart) {
    $("#heart1").css("color", lostHeart);
    console.log("first");
  }
  else if ( $("#heart2").css("color") == activeHeart) {
    $("#heart2").css("color", lostHeart);
  }
  else if ($("#heart3").css("color") == activeHeart) {
    $("#heart3").css("color", lostHeart);
    window.confirm("Game Over!");
  }
}

// rocks
const rocks = {
  sprite: 'images/Rock.png',
  render: function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  },
  moveRock: function() {
    let coordinatesRocks = move();
  
    // create/ change coordinates properties in rocks object
    rocks.x = coordinatesRocks[0];
    rocks.y = coordinatesRocks[1];
  
    // repeatedly call function to move rock around
    setTimeout(rocks.moveRock, 10000);
  }
}

// hearts
const hearts = {
  sprite: 'images/Heart.png',
  render: function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  },
  moveHeart: function() {
    let coordinatesRocks = move();
  
    // create/ change coordinates properties in rocks object
    hearts.x = coordinatesRocks[0];
    hearts.y = coordinatesRocks[1] + 25;
  
    // repeatedly call function to move rock around
    setTimeout(hearts.moveHeart, 10000);
  }
}

rocks.moveRock();
hearts.moveHeart();

// function to move rocks around inside the playing field
function move() {
//array for locations on playing field x: 0-101-202-303-404-505-606 and y: 57-140-223-306
const playingField = [[0, 101, 202, 303, 404, 505, 606], [50, 133, 216, 299]];

// create random numbers in the range of the indexes of the two arrays within playingField
let randomCoordinateX = playingField[0][Math.floor(Math.random() * 6)];  
let randomCoordinateY = playingField[1][Math.floor(Math.random() * 4)];

let coordinates = [randomCoordinateX, randomCoordinateY];

return coordinates; 
}

// // rocks with constructor
// function Rocks(changeInterval) {
//   this.sprite = "images/Rock.png",
//   this.render = function() {
//   ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
//   },
//   this.moveRock = function() {
//     let coordinatesRocks = move();
  
//     // create/ change coordinates properties in rocks object
//     this.x = coordinatesRocks[0];
//     this.y = coordinatesRocks[1];
  
//     // repeatedly call function to move rock around
//     setTimeout(moveRock, changeInterval);
//   }
// }

// let allRocks = [];
// const firstRock = new Rocks(1000);
// allRocks.push(firstRock);
// allRocks[0].moveRock();


