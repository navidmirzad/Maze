document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("generate").addEventListener("click", startGenerate);
  const mazeDiv = document.getElementById("maze");
  let visited = [];

  function startGenerate() {
    buttonDiv.innerHTML = ""; // Removed redundant declaration
    mazeDiv.innerHTML = "";
    console.log("generate");
    createGrid();
    createMaze();
  }

  function createGrid() {
    GRID_HEIGHT = 20;
    GRID_WIDTH = 20;
    for (let i = 0; i < GRID_HEIGHT; i++) {
      const newRow = [];
      for (let j = 0; j < GRID_WIDTH; j++) {
        newRow[j] = {
          row: i,
          col: j,
          north: true,
          west: true,
          east: true,
          south: true,
          visited: false,
        };
      }
      maze[i] = newRow;
    }
  }

  function createMaze() {
    let startCell = getRandomCell();

    startCell.visited = true;
    visited.push(startCell);

    while (visited.length < GRID_HEIGHT * GRID_WIDTH) {
      const currentCell = getRandomVisitedCell();
      const direction = getRandomDirection();

      const nextCell = getNeighbor(currentCell, direction);

      if (isValidCell(nextCell) && !nextCell.visited) {
        setWall(currentCell, nextCell, direction);
        nextCell.visited = true;
        visited.push(nextCell);
        console.log(currentCell, "current");
        console.log(direction);
        console.log(nextCell, "next");
        console.log(maze);
      }
    }

    drawMaze();
  }

  function drawMaze() {
    mazeDiv.innerHTML = "";
    mazeDiv.style.setProperty("--GRID_WIDTH", GRID_WIDTH);
    console.log(maze);
    for (let i = 0; i < maze.length; i++) {
      const row = maze[i];

      for (let j = 0; j < row.length; j++) {
        const cell = row[j];

        const newCell = document.createElement("div");
        newCell.setAttribute("data-row", cell.row);
        newCell.setAttribute("data-col", cell.col);
        newCell.classList.add("node");

        if (cell.north) {
          newCell.classList.add("north-wall");
        }
        if (cell.south) {
          newCell.classList.add("south-wall");
        }
        if (cell.west) {
          newCell.classList.add("west-wall");
        }
        if (cell.east) {
          newCell.classList.add("east-wall");
        }

        mazeDiv.appendChild(newCell);
      }
    }
  }

  function getRandomDirection() {
    const directions = ["north", "west", "east", "south"];
    const randomIndex = Math.floor(Math.random() * directions.length);
    return directions[randomIndex];
  }

  function getRandomCell() {
    const randomRow = Math.floor(Math.random() * GRID_HEIGHT);
    const randomCol = Math.floor(Math.random() * GRID_WIDTH);
    return maze[randomRow][randomCol];
  }

  function getRandomVisitedCell() {
    const randomIndex = Math.floor(Math.random() * visited.length);
    return visited[randomIndex];
  }

  function setWall(currentCell, nextCell, direction) {
    if (direction === "west") {
      currentCell.west = false;
      nextCell.east = false;
    } else if (direction === "east") {
      currentCell.east = false;
      nextCell.west = false;
    } else if (direction === "north") {
      currentCell.north = false;
      nextCell.south = false;
    } else if (direction === "south") {
      currentCell.south = false;
      nextCell.north = false;
    }
  }

  function getNeighbor(cell, direction) {
    let neighbor = { row: cell.row, col: cell.col };

    switch (direction) {
      case "north":
        neighbor.row--;
        break;
      case "west":
        neighbor.col--;
        break;
      case "east":
        neighbor.col++;
        break;
      case "south":
        neighbor.row++;
        break;
    }

    return { row: neighbor.row, col: neighbor.col };
  }

  function isValidCell(cell) {
    return (
      cell.row >= 0 &&
      cell.row < GRID_HEIGHT &&
      cell.col >= 0 &&
      cell.col < GRID_WIDTH
    );
  }
});
