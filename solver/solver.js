let GRID_WIDTH;
let GRID_HEIGHT;
let start;
let goal;
let maze = [];
let route = [];
let backtrack = [];

// Controller
const buttonDiv = document.getElementById("button-div");
document.getElementById("solve").addEventListener("click", startMaze);

function startMaze() {
  buttonDiv.innerHTML = "";

  fetchMaze(drawMaze)
    .then(() => {
      depthFirstSearch();
    })
    .then(() => {
      routeButton();
    });
}

function drawMaze() {
  const mazeGrid = document.getElementById("mazeGrid");
  mazeGrid.innerHTML = "";
  // iterate over the length, and transform it to Grid(check out main.css)
  mazeGrid.style.setProperty("--GRID_WIDTH", GRID_WIDTH);

  for (let i = 0; i < maze.length; i++) {
    const row = maze[i];

    for (let j = 0; j < row.length; j++) {
      const cell = row[j];

      // Creating node from row+col
      const newCell = document.createElement("div");
      newCell.setAttribute("data-row", cell.row);
      newCell.setAttribute("data-col", cell.col);
      newCell.classList.add("node");

      // Drawing the walls + start & goal
      if (cell.row === start.row && cell.col === start.col) {
        newCell.classList.add("start");
        newCell.textContent = "Start";
      }
      if (cell.row === goal.row && cell.col === goal.col) {
        newCell.classList.add("goal");
        newCell.textContent = "Goal";
      }
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

      mazeGrid.appendChild(newCell);
    }
  }
}

function routeButton() {
  buttonDiv.innerHTML = "";
  const button = document.createElement("button");
  button.textContent = "See route/backtrack";
  buttonDiv.appendChild(button);

  button.addEventListener("click", () => {
    updateView();
    updateButton();
  });
}

function updateButton() {
  buttonDiv.innerHTML = "";
  const button = document.createElement("button");
  button.textContent = "<- Go back";
  buttonDiv.appendChild(button);

  button.addEventListener("click", () => {
    drawMaze();
    routeButton();
  });
}

function updateView() {
  // Combine route and backtrack arrays
  const combinedPath = [...route, ...backtrack];

  // Animate the entire path
  for (let i = 0; i < combinedPath.length; i++) {
    const cell = combinedPath[i];
    const cellDiv = document.querySelector(
      `.node[data-row="${cell.row}"][data-col="${cell.col}"]`
    );

    setTimeout(() => {
      if (route.includes(cell)) {
        cellDiv.classList.add("route");
      } else {
        cellDiv.classList.add("backtrack");
      }
    }, i * 300); // Adjust the delay between each cell
  }
}

function depthFirstSearch(cell = start) {
  cell.visited = true;
  route.push(cell);

  if (cell.row === goal.row && cell.col === goal.col) {
    console.log("we made it");
    return true;
  }

  const unvisitedNeighbors = getUnvisitedNeighbors(cell);

  for (const nextCell of unvisitedNeighbors) {
    console.log("VISITING", nextCell);
    if (depthFirstSearch(nextCell)) {
      return true;
    }
  }

  backtrack.push(cell);
  console.log(cell, "BACKTRACKING");
  route.pop();
}

function getUnvisitedNeighbors(cell) {
  const neighbors = [];

  // if south of the cell is unvisited - repeat of the other directions
  if (!cell.south && !visitCell(cell.row + 1, cell.col).visited) {
    neighbors.push(visitCell(cell.row + 1, cell.col));
  }

  if (!cell.west && !visitCell(cell.row, cell.col - 1).visited) {
    neighbors.push(visitCell(cell.row, cell.col - 1));
  }

  if (!cell.north && !visitCell(cell.row - 1, cell.col).visited) {
    neighbors.push(visitCell(cell.row - 1, cell.col));
  }

  if (!cell.east && !visitCell(cell.row, cell.col + 1).visited) {
    neighbors.push(visitCell(cell.row, cell.col + 1));
  }

  return neighbors;
}

function visitCell(row, col) {
  return maze[row][col];
}

const mazeFile = "maze.json";

// async fetch maze from maze.json => and then we draw it from the data we extract
async function fetchMaze(drawMaze) {
  const response = await fetch(`/solver/mazes/${mazeFile}`);
  data = await response.json();
  console.log(data);
  GRID_WIDTH = data.rows;
  GRID_HEIGHT = data.cols;
  maze = data.maze;
  start = maze[data.start.row][data.start.col];
  goal = maze[data.goal.row][data.goal.col];
  console.log("start :", start);
  console.log("goal :", goal);
  drawMaze();
}
