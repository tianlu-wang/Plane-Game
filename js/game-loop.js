/**
 * gameLoop is responsible for making update and render calls to the game 
 */
function gameLoop(game) {
	var desiredDt = 50;
	var previousGameTime = new Date();
	
	// Update the model with set interval
	setInterval(gameLoop, desiredDt);
	// Update the canvas with requestAnimationFrame
	requestAnimationFrame(renderLoop);
	
	function renderLoop() {
		// alpha is the fraction of how far through the current time step is being rendered
		alpha = (new Date() - previousGameTime) / desiredDt;
		game.render(alpha);
		requestAnimationFrame(renderLoop);
	}
	
	function gameLoop() {
		// Update positions etc
		var now = new Date();
		game.step((now - previousGameTime) * 0.001);
		previousGameTime = now;
	}
}