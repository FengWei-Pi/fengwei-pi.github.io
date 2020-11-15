class FloodItView {
	constructor() {
		this.game = undefined;
		
		this.cellSize = 20; // pixel size of cell
		
		this.selectSize = document.getElementById("select-size");
		this.selectColors = document.getElementById("select-colors");
		this.playButton = document.getElementById("button-play");
		
		this.message = document.getElementById("game-message");
		this.board = document.getElementById("board");
		
		this.numCells;
		this.numColors;
		
		this.playButton.addEventListener("click", () => {
			this.game.set(parseInt(this.selectSize.value), parseInt(this.selectColors.value));
			this.update();
		});
	}
	
	update() {
		// If game has different settings, init a new view
		if (this.numCells != this.game.numCells || this.numColors != this.game.numColors) {
			this.init(this.game);
		}
		// Else, just update the current view
		else {
			for (let i=0; i<this.numCells; ++i) {
				for (let j=0; j<this.numCells; ++j) {
					let cell = document.getElementById("cell" + i.toString() + "," + j.toString());
					cell.style.backgroundColor = this.game.getColor(i, j);
				}
			}
		}
		
		// Set game message
		if (this.game.moves >= 0 && this.game.hasWon()) {
			this.message.innerHTML = "You Won!";
		} else if (this.game.moves <= 0) {
			this.message.innerHTML = "You Lose :(";
		} else {
			this.message.innerHTML = "Moves Left: " + this.game.moves;
		}
	}
	
	init(game) {
		this.game = game;
		this.numCells = game.numCells;
		this.numColors = game.numColors;
		
		this.selectSize.value = this.numCells;
		this.selectColors.value = this.numColors;
		
		this.board.innerHTML = "";
		this.board.style.width = this.numCells * this.cellSize + "px";
		this.board.style.height = this.numCells * this.cellSize + "px";
		
		for (let i=0; i<this.numCells; ++i) {
			for (let j=0; j<this.numCells; ++j) {
				let cell = document.createElement("div");
				cell.style.display = "inline-block";
				cell.style.position = "absolute";
				cell.style.top = this.cellSize * i + "px";
				cell.style.left = this.cellSize * j + "px";
				cell.style.width = this.cellSize + "px";
				cell.style.height = this.cellSize + "px";
				cell.id = "cell" + i.toString() + "," + j.toString();
				
				cell.addEventListener("click", () => {
					this.game.makeMove(i, j);
				});
			
				this.board.append(cell);
			}
		}
		
		this.update();
	}
}