$(document).ready(function() {
  // Show the Modal on load
  $("#modalStart").modal("show");
});

$(".modal-title").text("Hi, choose a player!");

// choose character to start game
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
  // close modal
  $("#modalStart").modal("hide");
  // start timer to accelerate enemies
  accelerateEnemies()
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
    this.movingAllowed = true;
  }

  // updates player position, checks for collisions
  update() {
        // did player collide with enemy?
       for (let enemy of allEnemies) {
         // collision? from http://blog.sklambert.com/html5-canvas-game-2d-collision-detection/#d-collision-detection
         if (this.x < enemy.x + enemy.collisionWidth && this.x + this.collisionWidth > enemy.x && this.y < enemy.y + enemy.collisionHeight && this.y + this.collisionHeight > enemy.y) {
           // if yes change score and reset to start
           this.restart();
           hearts.reduceHearts();
           this.blink();
         }
       }
        // item collected?
        for (let item of allItems) {
          if (item != player) {
            if (this.x < item.x + item.collisionWidth && this.x + this.collisionWidth > item.x && this.y < item.y + item.collisionHeight && this.y + this.collisionHeight > item.y) {     
              item.xPointShow = item.x;
              item.yPointShow = item.y;
              item.collision = true;
              item.add();
              item.disappear();
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
    location.reload();
  };

  // render player at x,y coordinates
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };

  // handle the input from the eventlistener and change this.x
  // and this.y accordingly so the player moves
  handleInput(key) {
    // moving is not allowed while modals are open
    if (this.movingAllowed == true) {
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
  // make player blink after losing a life 
  blink() {
    this.movingAllowed = false;
    const xDisappear = -303;
    const yDisappear = -303;
    this.x = xDisappear;
    this.y = yDisappear;
    setTimeout(function() {
        this.x = this.startX;
        this.y = this.startY;
        setTimeout(function() {
          this.x = xDisappear;
          this.y = yDisappear;
        }.bind(this), 500)
        setTimeout(function() {
          setTimeout(function() {
          this.x = this.startX;
          this.y = this.startY;
          this.movingAllowed = true;
          }.bind(this), 500)
        }.bind(this), 500)
    }.bind(this), 1000);
  };
};

// instantiate new thePlayer and place object in a variable called player
const player = new ThePlayer();

// create array allEnemies, instantiate enemies and push into allEnemies
let allEnemies = [];

// make enemies using randoms for speed and track and add them to allEnemies
function createEnemies() {
  let numberEnemies = 8;
  for (let i = 0; i < numberEnemies; i++) {
    let randomTrack;
    if (i == 0 || i == 1) {
      randomTrack = 0;
    }
    if (i == 2 || i == 3) {
      randomTrack = 1;
    }
    if (i == 4 || i == 5) {
      randomTrack = 2;
    }
    if (i == 6 || i == 7) {
      randomTrack = 3;
    }
    // from https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
    function getRandomSpeed(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }  
    let randomSpeed = getRandomSpeed(75, 275);
    // from https://stackoverflow.com/questions/6645067/javascript-dynamically-creating-variables-for-loops
    window["enemy" + i] = new Enemy(randomTrack, randomSpeed);
    allEnemies.push(window["enemy" + i]);
  }
}
createEnemies();

// accelerate enemies
let time = 0;
function accelerateEnemies() {
  setInterval(function() {
    console.log(enemy1.speed);
    time++;
    console.log(time);
    // accelerate enemies after 30 seconds
    if (time % 30 == 0) {
      allEnemies.forEach(function(enemy) {
        enemy.speed += 50;
      });
      console.log(enemy1.speed);
  }}, 1000)
  };

// creates coordinates for the items
function move() {
  //array for possible locations on playing field x, y
  const playingField = [[0, 101, 202, 303, 404, 505, 606], [60, 143, 226, 309]];
  // create random numbers in the range of the indexes of the two arrays within playingField
  let randomCoordinateX = playingField[0][Math.floor(Math.random() * 6)];  
  let randomCoordinateY = playingField[1][Math.floor(Math.random() * 4)];
  let coordinates = [randomCoordinateX, randomCoordinateY];
  return coordinates; 
}; 

// allItems array to store the following objects in
let allItems = [];

// rocks
const rocks = {
  sprite: 'images/Rock.png',
  render: function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  },
  moveIt: function() {
    let coordinatesRocks = move();
    rocks.x = coordinatesRocks[0];
    rocks.y = coordinatesRocks[1];  
    }
  };

// hearts
const hearts = {
  sprite: 'images/Heart.png',
  xPointShow: 0,
  yPointShow: 0,
  collision: false,
  collisionWidth: 101/2,
  collisionHeight: 83/2,
  // render animation during collision and render heart in general
  render: function() {
    if (hearts.collision) {
      hearts.heartsAnimation();
    }
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  },
  // create coordinates and check whether they are already taken 
  moveIt: function() {
    let coordinatesHearts = move();
    let xMove = coordinatesHearts[0];
    let yMove = coordinatesHearts[1];
    let coordinatesTaken = 0;
    allItems.forEach(function(item) {
      if (item != hearts) {
        if (hearts.x != -200 && hearts.y != 0 && item.x != -200 && item.y != 0 && item.x == xMove && item.y == yMove) {
          coordinatesTaken++;
        }
      }
    })
    if (coordinatesTaken > 0) {
      hearts.moveIt();
    } 
    else {
    hearts.x = coordinatesHearts[0];
    hearts.y = coordinatesHearts[1]; 
    }
  },
  // move heart off canvas until next call by setTimeout
  disappear: function() {
    hearts.x = -202;
    hearts.y = 0;
    setTimeout(hearts.moveIt, 10000);
    },
    // reduce number of hearts at the top (when called after collision between player and enemy)
  reduceHearts() {
    const activeHeart = "rgb(232, 9, 9)";
    const lostHeart = "rgb(232, 232, 232)";
    if ($("#heart1").css("color") == activeHeart) {
      $("#heart1").css("color", lostHeart);
    }
    else if ( $("#heart2").css("color") == activeHeart) {
      $("#heart2").css("color", lostHeart);
    }
    else if ($("#heart3").css("color") == activeHeart) {
      $("#heart3").css("color", lostHeart);
      gameOver();
      }
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
  },
  // show animated heart flying away when heart is collected
  heartsAnimation: function() {
    ctx2.drawImage(Resources.get("images/Heart-small.png"), hearts.xPointShow + 50, hearts.yPointShow);
    hearts.xPointShow++;
    hearts.yPointShow--;
      setTimeout(function() {
        hearts.collision = false;
      }, 1000);
  }
};

// open game over modal, show message, give opportunity to input player name for leaderboard
function gameOver() {
      $("#modalEnd").modal("show");
      
      // end rendering ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ find better solution
      delete player.sprite
 
      $(".modal-title").text("Game Over");

      let gameOverText = document.createElement("div");
      gameOverText.setAttribute("id", "gameOverText");
      gameOverText.textContent = `Congratulations! You scored ${points} points!`;
      $("#endMessage").append(gameOverText);

      let playerNameText = document.createElement("label");
      playerNameText.setAttribute("id", "playerNameText");
      playerNameText.textContent = "To see whether you made the top 5, enter your name here: ";
      $("#endMessage").append(playerNameText);

      let playerName = document.createElement("input");
      playerName.setAttribute("type", "text");
      playerName.setAttribute("placeholder", " Your player name");
      playerName.setAttribute("id", "playerName");
      playerName.setAttribute("maxlength", "12");
      $("#endMessage").append(playerName);

      let playerNameButton = document.createElement("button");
      playerNameButton.setAttribute("id", "playerNameButton");
      playerNameButton.setAttribute("type", "submit");
      playerNameButton.setAttribute("class", "btn btn-secondary");
      playerNameButton.textContent = "OK";
      $("#endMessage").append(playerNameButton);

      let newGameButton = document.createElement("button");
      newGameButton.setAttribute("id", "newGameButton");
      newGameButton.setAttribute("type", "button");
      newGameButton.setAttribute("class", "btn btn-danger");
      newGameButton.textContent = "New Game";
      $("#modalEnd .modal-footer").append(newGameButton);

      $("#newGameButton").one("click", function() {
        console.log("persil");
        player.newGame();
      });

      // when clicked, save modal input and player data in local storage 
      $("#playerNameButton").one("click", function() {    
        const newEntry = {
          name: playerName.value,
          score: points
        }

        //get leaderboard from local storage
        leaderboard = JSON.parse(localStorage.getItem("leaderboard"));
        // add result to leaderboard
          if (leaderboard === null) {
            leaderboard = [];
            leaderboard.push(newEntry);
          }       
          else {
            leaderboard.push(newEntry)
          }
        // sort leaderboard entries
          leaderboard.sort(function (a, b) {
            if (a.score < b.score) {
              return 1;
            }
            else {
              return -1
            }
          });
          // cut off excess leaderboard entries 
          if (leaderboard.length > 5) {
            leaderboard.pop();
          }
        
          // save updated top 5 to localstorage 
          localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
          
          // build leaderboard structure
          $("#playerName").val("");
          $(".modal-title").text("Leaderboard");
          $("#endMessage").html("<table><tr><td><b>Name</b></td><td><b>Score</b></td></tr></table>");

          // fill leaderboard with entries
          for (i = 0; i < leaderboard.length; i++) {
            if (leaderboard[i].name == "") {
              const newRow = $("<tr><td>-</td><td>" + leaderboard[i].score + "</td></tr>");
              $("#endMessage table").append(newRow);
            }
            else {
            const newRow = $("<tr><td>" + leaderboard[i].name + "</td><td>" + leaderboard[i].score + "</td></tr>");
            $("#endMessage table").append(newRow);
            }
          }
  })
};


// keeps the score shown at the top of the game
let points = 0;

// Items
let Items = function(itemType) {
  this.name = itemType;
  this.sprite = `images/${itemType}.png`;
  this.collision = false;
  this.xPointShow = 0;
  this.yPointShow = 0;
  this.collisionWidth = 101/2;
  this.collisionHeight = 83/2;
};

Items.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  if (this.collision) {
    this.pointsAnimation();
  }
};

Items.prototype.moveIt = function() {
  // get new coordinates
  let coordinatesItem = move();
  let tryX = coordinatesItem[0],
  tryY = coordinatesItem[1]; 
  let coordinatesTaken = 0;
  // check if other item in allItems already has these coordinates
  allItems.forEach(function(item) {
    if ((item.hasOwnProperty("name") && item.name != this.name) || item.name == undefined) {
      if (tryX != -200 && tryY != 0 && item.x != -200 && item.y != 0 && tryX == item.x && tryY == item.y) {
        coordinatesTaken++;
      }
    }
  }.bind(this));
  if (coordinatesTaken > 0) {
    this.moveIt();
  }
  else {
    // create/change coordinates properties
    this.x = coordinatesItem[0];
    this.y = coordinatesItem[1]; 
  } 
};

// move item off canvas until next call by setTimeout
Items.prototype.disappear = function() {
  this.y = 0;
  this.x = -200;
  // call after a while without the item on the playingfield
  if (this.name == "GemGreen") {
    setTimeout(this.moveIt.bind(this), 6000);
  }
  else if (this.name == "GemOrange") {
    setTimeout(this.moveIt.bind(this), 3000);
  }
  else if (this.name == "GemBlue") {
    setTimeout(this.moveIt.bind(this), 1500);
  }
};

// different numbers of points depending on collected item
Items.prototype.add = function() {
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

// show points on playing field when gem is collected
Items.prototype.pointsAnimation = function() {
  let pointsShown;
  if (this.name == "GemGreen") {
    pointsShown = 15;
  }
  else if (this.name == "GemOrange") {
    pointsShown = 10;
  }
  else if (this.name == "GemBlue") {
    pointsShown = 5;
  }
  const sprite = `images/${pointsShown}.png`;
  ctx2.drawImage(Resources.get(sprite), this.xPointShow + 50, this.yPointShow);
  this.xPointShow++;
  this.yPointShow--;
    setTimeout(function() {
      this.collision = false;
    }.bind(this), 1000);
};

// instantiate objects
let GemBlue = new Items("GemBlue");
let GemGreen = new Items("GemGreen");
let GemOrange = new Items("GemOrange");

// push objects into array
allItems.push(rocks);
allItems.push(hearts);
allItems.push(GemBlue);
allItems.push(GemGreen);
allItems.push(GemOrange);
allItems.push(player);

// initial call of all moveIt methods
allItems.forEach(function(item) {
  if (item != "thePlayer") {
    item.moveIt();
  }
})