/**
 * gameMap represents the map of the game. It can be an arbitrary width and height
 * and bares no relation to the canvas on which it is drawn. It has a single 'privileged' canvas
 * property which is a canvas which contains the entire background.
 */
function gameMap() {
	var that = this;
	this.width = 5000;
	this.height = 5000;
	
	this.canvas = document.createElement('canvas');
	this.canvas.width = this.width;
	this.canvas.height = this.height;
	var ctx = this.canvas.getContext('2d');
	
	(function drawMap() {
		ctx.rect(0, 0, that.width, that.height);
	    // Create green -> blue gradient
	    var gradient = ctx.createLinearGradient(0, 0, 0, that.height);
	    gradient.addColorStop(0, '#8ED6FF');//light blue
	    gradient.addColorStop(1, '#004CB3');//dark blue
	    //gradient.addColorStop(0.95, '#00aa00');//light green
	    //gradient.addColorStop(1, '#007700');//dark green
	    ctx.fillStyle = gradient;
	    ctx.fill();

		// Choose 200 random point to draw clouds at
		ctx.fillStyle = "#ffffff";
		ctx.globalAlpha = 0.03;
		for(var i=0;i<200;i++) {
			var cloudYPosition = Math.random() * that.height;
			var cloudXPosition = Math.random() * that.width;
			
			// For each random point, draw some white circles around it to create clouds
			for(var j=0;j<400;j++) {
				ctx.beginPath();
			    ctx.arc(cloudXPosition + 300*Math.random(), cloudYPosition + 100*Math.random(), Math.random() * 70, 0, 2 * Math.PI, false);
			    ctx.fill();
			}
			
		}
	})();
}
