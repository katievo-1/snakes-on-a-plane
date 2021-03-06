// Weather icon
weatherIcon = new Image();
temperature = 0;

// Get reference to canvas using ID
canv = document.getElementById("gc");

// Get canvas context for drawing
ctx = canv.getContext("2d");

// Initial position of the snake
px = py = 10;

// Set grid size and total cells in x/y directions
gridSize = totalCells = 20;

// Initial position of the target (apple)
ax = ay = 15;

// Initial velocity
xv = yv = 0;

// Array of snake tile positions
trail = [];

// Length of the snake minus the head
tail = 5;

isGameStarted = false;

// Listen for keyboard inputs
document.addEventListener("keydown", function (evt) {
  // Depending on the keystroke, set corresponding velocities
  // in the x and y directions. For x, -1 is left and 1 is right.
  // For y, -1 is up and 1 is down.

  switch (evt.keyCode) {
    case 37: // Left arrow key
      evt.preventDefault(); // Prevent window scrolling
      xv = -1; yv = 0;
      isGameStarted = true;
      break;
    case 38: // Up arrow key
      evt.preventDefault(); // Prevent window scrolling
      xv = 0; yv = -1;
      isGameStarted = true;
      break;
    case 39: // Right arrow key
      evt.preventDefault(); // Prevent window scrolling  
      xv = 1; yv = 0;
      isGameStarted = true;
      break;
    case 40: // Down arrow key
      evt.preventDefault(); // Prevent window scrolling
      xv = 0; yv = 1;
      isGameStarted = true;
      break;
  }
});

// Game loop
setInterval(function () {

  // Moving the snake head based on velocity.
  px += xv;
  py += yv;

  // Warp around effect. If snake moves off screen on the left, it will reappear on the right, etc...
  if (px < 0) {
    px = totalCells - 1;
  }
  if (px > totalCells - 1) {
    px = 0;
  }
  if (py < 0) {
    py = totalCells - 1;
  }
  if (py > totalCells - 1) {
    py = 0;
  }

  // Draw the background on canvas
  ctx.fillStyle = temperature === 0 ? "black" : temperature >= 60 ? "#ff852e" : "#2e8cff";
  ctx.fillRect(0, 0, canv.width, canv.height);

  ctx.drawImage(weatherIcon, 10, 10);

  // Draw the snake on canvas
  ctx.fillStyle = "lime";
  for (var i = 0; i < trail.length; i++) {
    // Draw each segment of the snake in the array
    ctx.fillRect(trail[i].x * gridSize + 1, trail[i].y * gridSize + 1, gridSize - 2, gridSize - 2);

    if (trail[i].x == px && trail[i].y == py) {
      // px & py is where the head is. If the head hits one segment of the snake, game over

      if (isGameStarted) {
        // update leaderboard data
        tryAddToLeaderboard(tail);
      }

      // reset the game
      tail = 5;
      xv = yv = 0;
      px = py = 10;

      isGameStarted = false;
    }
  }

  // Update the position of the snake
  trail.push({ x: px, y: py });

  // If there are more segments in the array than the length of the snake, trim off the extra segments.
  while (trail.length > tail) {
    trail.shift();
  }

  // Snake hits target
  if (ax == px && ay == py) {
    tail++;

    // Generate new random location for the target
    ax = Math.floor(Math.random() * totalCells);
    ay = Math.floor(Math.random() * totalCells);
  }

  // Draw the target
  ctx.fillStyle = "red";
  ctx.fillRect(ax * gridSize + 1, ay * gridSize + 1, gridSize - 2, gridSize - 2);
},

  // Game loop time. The interval between each time the game refreshes. I.e. 1000/10 = 100 ms
  // Snake speed is also affected by game loop time. Smaller time = faster speed.
  1000 / 10);