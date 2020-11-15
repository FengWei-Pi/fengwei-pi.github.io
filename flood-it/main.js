function init() {
	// TODO: create flood it game and view
	let game = new FloodItGame();
	let view = new FloodItView();
	
	game.init(view);
	view.init(game);
}