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
       }
        // heart collected?
        // if (this.x < hearts.x + hearts.collisionWidth && this.x + this.collisionWidth > hearts.x && this.y < hearts.y + hearts.collisionHeight && this.y + this.collisionHeight > hearts.y) {     
        //   addHearts();
        //   hearts.disappear();

        for (let item of allItems) {
          if (item != player) {
            if (this.x < item.x + item.collisionWidth && this.x + this.collisionWidth > item.x && this.y < item.y + item.collisionHeight && this.y + this.collisionHeight > item.y) {     
              if (item == Items) {
                item.name.add();
                item.name.disappear();
              }
              else {
              item.add();
              item.disappear();
              }
          }
        }
        }
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
    else if(key == "up" && this.y >= 60 && this.x == rocks.x && (this.y >= rocks.y + (2 * this.verticalStep) || this.y < rocks.y)) {
      this.y -= this.verticalStep;
    }
    // step down
    else if(key == "down" && this.y < (4 * this.verticalStep) && this.x != rocks.x) {
      this.y += this.verticalStep;
    } 
    // block step down if rock is in the way
    else if(key == "down" && this.y < (4 * this.verticalStep) && this.x == rocks.x && (this.y <= rocks.y - (2 * this.verticalStep) || this.y > rocks.y)) {
      this.y += this.verticalStep;
    } 
    // step to the left
    else if(key == "left" && this.x >= this.horizontalStep && this.y != rocks.y) {
      this.x -= this.horizontalStep;
    } 
    // block step to the left if rock is in the way
    else if(key == "left" && this.x >= this.horizontalStep && this.y == rocks.y && (this.x >= rocks.x + 2 * this.horizontalStep || this.x <= rocks.x - this.horizontalStep)) {
      this.x -= this.horizontalStep;
    } 
    // step to the right
    else if(key == "right" && this.x <= (5 * this.horizontalStep) && this.y != rocks.y) {
      this.x += this.horizontalStep;
    } 
      // block step to the left if rock is in the way
    else if(key == "right" && this.x <= (5 * this.horizontalStep) && this.y == rocks.y && (this.x <= rocks.x - 2 * this.horizontalStep || this.x >= rocks.x + this.horizontalStep)) {
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

  if ($("#heart1").css("color") == activeHeart) {
    $("#heart1").css("color", lostHeart);
  }
  else if ( $("#heart2").css("color") == activeHeart) {
    $("#heart2").css("color", lostHeart);
  }
  else if ($("#heart3").css("color") == activeHeart) {
    $("#heart3").css("color", lostHeart);
  }
  else if ($("#heart3").css("color") == lostHeart) {
    window.confirm("Game Over!");
  }
}

// function to move rocks around inside the playing field
function move() {
  //array for locations on playing field x: 0-101-202-303-404-505-606 and y: 57-140-223-306
  const playingField = [[0, 101, 202, 303, 404, 505, 606], [60, 143, 226, 309]];
  
  // create random numbers in the range of the indexes of the two arrays within playingField
  let randomCoordinateX = playingField[0][Math.floor(Math.random() * 6)];  
  let randomCoordinateY = playingField[1][Math.floor(Math.random() * 4)];
  
  let coordinates = [randomCoordinateX, randomCoordinateY];
  
  return coordinates; 
  }  

  let allItems = [];
  
// hearts
const hearts = {
  sprite: 'images/Heart.png',
  y: 0,
  x: -200,
  render: function() {
    let coordinatesTaken = 0;
    allItems.forEach(function(item) {
      if (item != hearts) {
        if (item.x == hearts.x && (item.y == hearts.y || item.y == hearts.y)) {
          coordinatesTaken++;
        }
      }
    });
    
    if (coordinatesTaken > 0) {
      hearts.moveHeart();
    } 
    else {
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
  },
  moveHeart: function() {
    let coordinatesHearts = move();
    
    // create/change coordinates properties in hearts object
    hearts.x = coordinatesHearts[0];
    hearts.y = coordinatesHearts[1]; // to position the heart properly 
  },
  collisionWidth: 101/2,
  collisionHeight: 83/2,
  // move heart off canvas until next call by setTimeout
  disappear: function() {
    hearts.x = -202;
    hearts.y = 0;
    // call moveHeart for new heart after break with no heart on playing field
    setTimeout(hearts.moveHeart, 10000);
    },
  
  // increase number of hearts when collision between player and heart
  add: function() {
    const activeHeart = "rgb(232, 9, 9)";
    const lostHeart = "rgb(232, 232, 232)";
  
    if ($("#heart3").css("color") == lostHeart) {
      $("#heart3").css("color", activeHeart);
    }
    else if ( $("#heart2").css("color") == lostHeart) {
      $("#heart2").css("color", activeHeart);
    }
    else if ($("#heart1").css("color") == lostHeart) {
      $("#heart1").css("color", activeHeart);
    }
  }
};

// rocks
const rocks = {
  sprite: 'images/Rock.png',
  y: 0,
  x: -200,
  render: function() {
    let coordinatesTaken = 0;
    allItems.forEach(function(item) {
      if (item != rocks) {
        // console.log("item: " + item.x + ", " + item.y + " this: " + rocks.x + ", " + rocks.y);
        if (item.x == rocks.x && item.y == rocks.y) {
          coordinatesTaken++;
        }
      }
    });
    
    if (coordinatesTaken > 0) {
      rocks.moveRock();
    } 
    else {
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
  },
  moveRock: function() {
    let coordinatesRocks = move();
  
    // create/ change coordinates properties in rocks object
    rocks.x = coordinatesRocks[0];
    rocks.y = coordinatesRocks[1];  // to position the rock properly 
    
      // repeatedly call method to move rock around
      // setTimeout(rocks.moveRock, 10000);
    }
  };

let points = 0;

// Items
let Items = function(itemType) {
  this.name = itemType;
  this.sprite = `images/${itemType}.png`;
  this.y = 0;
  this.x = -200;
  this.render = function() {
    let coordinatesTaken = 0;
    allItems.forEach(function(item) {
      if ((item.hasOwnProperty("name") && item.name != this.name) || (item.name == undefined)) {
        if (item.x == this.x && (item.y == this.y || item.y == this.y)) {
          coordinatesTaken++;
        }
      }
    });
    
    if (coordinatesTaken > 0) {
      this.moveItem();
    } 
    else {
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
  };
  this.moveItem = function() {
    let coordinatesItem = move();
   
    // create/change coordinates properties in hearts object
    this.x = coordinatesItem[0];
    this.y = coordinatesItem[1]; // to position the heart properly 
  };
  this.collisionWidth = 101/2;
  this.collisionHeight = 83/2;
  // move heart off canvas until next call by setTimeout
  this.disappear = function() {
    this.y = 0;
    this.x = -200;
    // call moveHeart for new heart after break with no heart on playing field
    setTimeout(this.moveItem.bind(this), 10000);
    };
  
  // increase number of hearts when collision between player and heart
  this.add = function() {
    if (this.name == "GemGreen") {
      points += 15;
    }
    else if (this.name == "GemOrange") {
      points += 10;
    }
    else if (this.name == "GemBlue") {
      points += 5;
    }
    $("#points").text(`Points: ${points}`);
  }
}

let GemBlue = new Items("GemBlue");
let GemGreen = new Items("GemGreen");
let GemOrange = new Items("GemOrange");

// call methods
rocks.moveRock();
hearts.moveHeart();
GemBlue.moveItem();
GemOrange.moveItem();
GemGreen.moveItem();

allItems.push(GemBlue);
allItems.push(GemGreen);
allItems.push(GemOrange);
allItems.push(hearts);
allItems.push(rocks);
allItems.push(player);