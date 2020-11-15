class FloodItGame {
	constructor() {
		this.view = undefined;
		
		// Array of arrays containing color indices for every cell. If cell has
		// color colors[i], then cells[0][0] = i. cells[0][0] is the top left cell,
		// is the origin. cells[0][numCells] is the top right.
		// ex. If origin has color lightgreen, then cells[0][0] = 1.
		this.cells = [];
		
		// Info for current game.
		this.numCells = 12; // number of cells per row and column
		this.numColors = 6;
		this.moves = 25; // moves left
		
		// Array storing all the colors
		this.colors = ["chocolate"
					   , "lightgreen"
					   , "deepskyblue"
					   , "silver"
					   , "slateblue"
					   , "orange"
					   , "mediumorchid"
					   , "olive"];
	}
	
	set(numCells, numColors) {
		this.numCells = numCells;
		this.numColors = numColors;
		
		this.cells = [];
		let colorWeight = Math.pow(this.numColors, 1.2);
		this.moves = Math.round(this.numCells*colorWeight/6
						   + Math.log(this.numCells*colorWeight)/Math.log(1.5)
						   - 5);
		
		for (let i=0; i<this.numCells; ++i) {
			let row = [];
			for (let j=0; j<this.numCells; ++j) {
				row.push(Math.floor(Math.random() * numColors));
			}
			this.cells.push(row);
		}
	}
	
	// TODO:
	init(view) {
		this.view = view;
		this.set(this.numCells, this.numColors);
	}
	
	getColor(i, j) {
		return this.colors[this.cells[i][j]];
	}
	
	// If cell at (x, y) had oldColor, then change it to newColor and repeat for adjacent cells.
	flood(x, y, oldColor, newColor) {
		if (this.cells[x][y] != oldColor) return;
		
		this.cells[x][y] = newColor;
		
		if (x-1 >= 0) this.flood(x-1, y, oldColor, newColor);
		if (x+1 < this.numCells) this.flood(x+1, y, oldColor, newColor);
		if (y-1 >= 0) this.flood(x, y-1, oldColor, newColor);
		if (y+1 < this.numCells) this.flood(x, y+1, oldColor, newColor);
	}
	
	// Changes the top left cell to color of cells[i][j]. Then, changes all
	// adjacent cells that had origin's old color to have origin's new color.
	makeMove(i, j) {
		if (this.moves <= 0) return;
		
		let oldColor = this.cells[0][0];
		let newColor = this.cells[i][j];
		if (oldColor == newColor) return;
		
		this.cells[0][0] = newColor;

		this.flood(0, 1, oldColor, newColor);
		this.flood(1, 0, oldColor, newColor);
		
		--this.moves;
		this.view.update();
	}
	
	hasWon() {
		let color = this.cells[0][0];
		for (let i=0; i<this.numCells; ++i) {
			for (let j=0; j<this.numCells; ++j) {
				if (this.cells[i][j] != color) {
					return false;
				}
			}
		}
		return true;
	}
}