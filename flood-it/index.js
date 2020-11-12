let cells = [[""]]; // array of arrays containing div objects of every cell
let numCells = 12; // number of cells per row and column
let cellSize = 20; // pixel size of cell
let numColors = 6;
let moves = 25;

let colors = ["chocolate", "lightgreen", "deepskyblue", "silver", "slateblue", "orange", "mediumorchid", "olive"];

// If cell at (x, y) had oldColor, change it to newColor. Then, repeat for adjacent cells.
function flood(x, y, oldColor, newColor) {
	if (cells[x][y].style.backgroundColor != oldColor) return;
	
	cells[x][y].style.backgroundColor = newColor;
	
	if (x-1 >= 0) flood(x-1, y, oldColor, newColor);
	if (x+1 < numCells) flood(x+1, y, oldColor, newColor);
	if (y-1 >= 0) flood(x, y-1, oldColor, newColor);
	if (y+1 < numCells) flood(x, y+1, oldColor, newColor);
}

// Changes the top left cell to color of cell. Then, changes all adjacent
// cells that had origin's old color to have origin's new color.
function floodOrigin(cell) {
	if (moves <= 0) return;
	
	oldColor = cells[0][0].style.backgroundColor;
	newColor = cell.style.backgroundColor;
	if (oldColor == newColor) return;
	
	cells[0][0].style.backgroundColor = newColor;

	flood(0, 1, oldColor, newColor);
	flood(1, 0, oldColor, newColor);
	
	updateMoves();
}

function updateMoves() {
	--moves;

	if (hasWon()) {
		document.getElementById("game-message").innerHTML = "You Won!";
	} else if (moves <= 0) {
		document.getElementById("game-message").innerHTML = "You Lose :(";
	} else {
		document.getElementById("game-message").innerHTML = "Moves Left: " + moves;
	}
}

function hasWon() {
	color = cells[0][0].style.backgroundColor;
	for (let i=0; i<numCells; ++i) {
		for (let j=0; j<numCells; ++j) {
			if (cells[i][j].style.backgroundColor != color) {
				return false;
			}
		}
	}
	return true;
}

function setRandomColor(cell) {
	cell.style.backgroundColor = colors[Math.floor(Math.random() * numColors)];
	cell.onclick = function() {floodOrigin(cell)};
}

function init() {
	document.getElementById("select-size").value = numCells;
	document.getElementById("select-colors").value = numColors;
	
	initGame();
}

function initGame() {
	numCells = parseInt(document.getElementById("select-size").value);
	numColors = parseInt(document.getElementById("select-colors").value);
	
	cells = [];
	moves = Math.floor(numCells*(numColors/6) + numColors*(numCells/6));
	document.getElementById("game-message").innerHTML = "Moves Left: " + moves;
	
	let board = document.getElementById("board");
	board.innerHTML = "";
	board.style.width = numCells * cellSize + "px";
	board.style.height = numCells * cellSize + "px";
	
	for (let i=0; i<numCells; ++i) {
		let row = [];
		
		for (let j=0; j<numCells; ++j) {
			let cell = document.createElement("div");
			cell.style.display = "inline-block";
			cell.style.position = "absolute";
			cell.style.top = cellSize * i + "px";
			cell.style.left = cellSize * j + "px";
			cell.style.width = cellSize + "px";
			cell.style.height = cellSize + "px";
			setRandomColor(cell);
			
			board.append(cell);
			row.push(cell);
		}
		
		cells.push(row);
	}
}
