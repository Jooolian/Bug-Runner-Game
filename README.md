# Classic Arcade Game Clone Project

## Table of Contents

- [The Files](#The Files)
- [Instructions on Running the Game](#Instructions on Running the Game)
- [How to Play](#How to Play)

## The Files

The game consists of a **js folder** with the js-files **app.js**, **engine.js**, **resources.js**.

 - **app.js** contains the _game functionality_
 - **engine.js** contains the _game engine_
 - **resources.js** is an _image loading utility_ with a _"caching" layer_

Apart from these we have a **CSS folder** with a **css file**, a folder called images
containing all the **sprites** used in the game as well as the **index.html file**
and this **readme**.

## Instructions on Running the Game

The game is _run_ by opening it in a **browser**. _It starts right away after loading._

## How to Play

You play the game by using the **arrow keys** on your keyboard _to navigate_ the **player**
up to the last row of stones right before the water. If the water is reached the
game is _won_ and a _modal opens_ asking you whether you want to play _another game_.
When you _collide_ with one of the **beetles** that are moving over the screen, you
start again at the starting point - which means you need to _stay away from them_
if you want to reach the water and win the game.
