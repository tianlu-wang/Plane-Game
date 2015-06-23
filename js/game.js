/**
 * This represents the plane game. The container it should be placed in and the name of the player
 * are passed into the game. Stepping the game forward and rendering are handled internally
 */
function game(container, name) {
	var that = this;
	// The local user's plane
	var userPlane = new plane();
	// Locally assinged id, this needs to be changed for a real game
	userPlane.planeDetails.id = Math.round(Math.random() * Date.now());
	userPlane.planeDetails.name = name;
	userController(userPlane);
	// All planes in the game
	var planes = [userPlane];
	var map = new gameMap();
	
	// Main canvas and context
	var canvas;
	var ctx;
	
	// Allows sending plane details to remote players
	var server = new io(planeDetailsRecieved);

	(function initialise() {
		// Initialise the canvas
		canvas = document.createElement("canvas");
		ctx = canvas.getContext('2d');
		container.appendChild(canvas);
		
		userPlane.planeDetails.x = 200;
		userPlane.planeDetails.y = 0;
		userPlane.previousDetails.x = userPlane.planeDetails.x;
		userPlane.previousDetails.y = userPlane.planeDetails.y;
		
		// The canvas should fill the container
		function resize() {
			canvas.width = container.offsetWidth;
			canvas.height = container.offsetHeight;
		}
		resize();		
		addEventListener('resize', resize);
		
	}())
	
	// Step the game forward
	this.step = function(dt) {
		for(var i=0;i<planes.length;i++) {
			var plane = planes[i];
			plane.step(dt);
			
			// Wrap the plane around in the x direction
			if (plane.planeDetails.x > map.width) {
				plane.planeDetails.x -= map.width;
				plane.previousDetails.x = plane.planeDetails.x;
			} else if (planes[i].planeDetails.x < 0) {
				plane.planeDetails.x += map.width;
				plane.previousDetails.x = plane.planeDetails.x;
			}
			
			// Prevent the plane from 
			if (plane.planeDetails.y < plane.halfHeight) {
				plane.planeDetails.y = plane.halfHeight;
				plane.planeDetails.vy = 0;
			} else if (plane.planeDetails.y > map.height) {
				plane.planeDetails.y = map.height;
				plane.planeDetails.vy = 0;
			}
		}
		
		// Send the plane details to other players
		server.send(userPlane);
	}
	
	// Render the current state of the game
	this.render = function(alpha) {
		var oneMinusAlpha = 1 - alpha;
		
		// Interpolate the positions based on the alpha value
		var userX = alpha * userPlane.planeDetails.x + oneMinusAlpha * userPlane.previousDetails.x;
		var userY = alpha * userPlane.planeDetails.y + oneMinusAlpha * userPlane.previousDetails.y;
		
		// Set the position of the camera - it should follow the user's plane
		var cameraX = userX - canvas.width*0.5;
		var cameraY = map.height - userY  - canvas.height*0.5;
		
		// Ensure the camera area remains inside the game area with a border of 100
		cameraX = Math.max(100, cameraX);
		cameraX = Math.min(cameraX, map.width - canvas.width - 100);
		
		cameraY = Math.max(0, cameraY);
		cameraY = Math.min(cameraY, map.height - canvas.height);

	    // Only draw the visible part of the map onto the main canvas
	    ctx.drawImage(map.canvas, cameraX, cameraY, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
	    
	    // Transform the canvas to coordinates to camera coordinates
	    ctx.save();
		ctx.translate(-cameraX, -cameraY);
		
		ctx.font = '20px Calibri';
	    ctx.textAlign = 'center';
		for(var i=0;i<planes.length;i++) {
			var plane = planes[i];
			// Interpolate the positions based on the alpha value
			var x = plane.planeDetails.x * alpha + plane.previousDetails.x * oneMinusAlpha;
			var y = plane.planeDetails.y * alpha + plane.previousDetails.y * oneMinusAlpha;
			var rotation = plane.planeDetails.rotation * alpha + plane.previousDetails.rotation * oneMinusAlpha;
			
			ctx.save();
			// Transform to the centre of the plane so that it can be rotated about its centre
			ctx.translate(x, map.height - y);
			ctx.fillText(plane.planeDetails.name, 0, -40);
			ctx.rotate(-rotation);
			ctx.drawImage(plane.canvas, - plane.halfWidth, - plane.halfHeight);
			ctx.restore();
		}
		
		ctx.restore();
	}
	
	/*
	 * Called when the server receives another plane's details
	 */
	function planeDetailsRecieved(planeDetails) {
		if (planeDetails.id === userPlane.planeDetails.id) {
			return;
		}
		var existingPlane = null;
		for(var i=0;i<planes.length;i++) {
			if (planes[i].planeDetails.id === planeDetails.id) {
				existingPlane = planes[i];
				break;
			}
		}
		if (existingPlane == null) {
			existingPlane = new plane();
			existingPlane.previousDetails = planeDetails;
			planes.push(existingPlane);
		}

		existingPlane.planeDetails = planeDetails;
	}
	gameLoop(this);
}