/**
 * A object represents a single plane in the game. It may be a localally controlled plane
 * or network plane.
 */
function plane() {
	var that = this;
	var imagePath = "images/plane.png";
	var width = 50;
	var height = 22;
	
	// True if the plane is currently drawn from left to right
	this.imageLeftToRight = true;
	
	// An object containing all of the properties needed to advance the simulation a step forward
	this.planeDetails = {
		rotation : 0,
		x : 0,
		y : 0,
		vx : 0,
		vy : 0,
		thrust : false,
		rotateAntiClockwise : false,
		rotateClockwise : false
	};
	
	// The position details of the plane at the previous times tep
	this.previousDetails = {
		rotation:0,
		x : 0,
		y : 0
	};
	
	// Each plane is responsible for drawing itself on its own canvas
	this.canvas = document.createElement("canvas");
	this.canvas.width = width;
	this.canvas.height = height;
	this.halfWidth = width / 2;
	this.halfHeight = height / 2;
	
	var ctx = this.canvas.getContext('2d');
	var planeImage = new Image();
  	this.drawPlane = function() {
  		if (planeImage.complete) {
  			// If plane is flipped, use transforms to draw it back to front
  			ctx.clearRect(0, 0, width, height);
  			ctx.save();
  			ctx.translate(0, height / 2);
  			ctx.scale(1, that.imageLeftToRight ? 1: -1);
  			ctx.translate(0, -height / 2);
  			ctx.drawImage(planeImage, 0, 0);
  			ctx.restore();
  		}
  	}
  	
  	planeImage.onload = function() {
    	that.drawPlane();
  	};
  	planeImage.src = imagePath;
}

plane.prototype.step = function(dt) {
	// Relative strengths of forces
	var friction = 0.2;
	var thrust = this.planeDetails.thrust ? 300 : 0;
	var gravity = 600;
	var cos = Math.cos(this.planeDetails.rotation);
	var sin = Math.sin(this.planeDetails.rotation);
	
	// This is the component of the plane's velocity in the direction that the plane pointing
	var forwardSpeed = Math.abs(cos * this.planeDetails.vx + sin * this.planeDetails.vy);
	
	// Maneuverability describes the strength of the force generated by the wings
	// The more air rushing over the wings, the greater the force. Cap it at 2000.
	var elevatorForce = Math.min(2000, 1.6*forwardSpeed);
	var elevatorForceX = 0;
	var elevatorForceY = 0;
	var drotation = 0;
	
	// Rotating the plane uses the elevators which also force the plane in the x and y direction
	if (this.planeDetails.rotateAntiClockwise) {
		drotation = 1.5
		elevatorForceY = cos * elevatorForce;
		elevatorForceX = -sin * elevatorForce;
	} else if (this.planeDetails.rotateClockwise) {
		drotation = -1.5
	 	elevatorForceY = -cos * elevatorForce;
		elevatorForceX = sin * elevatorForce;
	}
	
	// Wings will generate a force even if the elevators aren't pitched.
	// Only include this force is the plane isn't pitching upwards otherwise it goes up too fast
	if (elevatorForceY <= 0) {
		elevatorForceY += 0.6*Math.abs(cos * forwardSpeed);
	}
	
	var forceX = cos * thrust + elevatorForceX - this.planeDetails.vx*friction;
	var forceY = sin * thrust + elevatorForceY - this.planeDetails.vy*friction - gravity;
	
	// Store the position at the last time step
	this.previousDetails.x = this.planeDetails.x;
	this.previousDetails.y = this.planeDetails.y;
	this.previousDetails.rotation = this.planeDetails.rotation;
	
	// Update rotation
	this.planeDetails.rotation += drotation * dt;
	// Use implicit Euler integration to step the simulation forward
	
	// Calculate the velocity at the next velocity
	this.planeDetails.vx += forceX * dt;
	this.planeDetails.vy += forceY * dt;

	// Calculate the next position
	this.planeDetails.x += this.planeDetails.vx * dt;
	this.planeDetails.y += this.planeDetails.vy * dt;
	
	// If the plane has rotated 180deg, draw it in the opposite direction
	if (cos > 0 != this.planeDetails.imageLeftToRight) {
		this.imageLeftToRight = cos > 0;
		this.drawPlane();
	}
	

};
