/**
 * This function takes a plane as a parameter and sets its thrust and rotation values
 * via user input
 */
function userController(plane) {
	var up = 38;
	var left = 37;
	var right = 39
	
	var preventPropagationKeys = [up, left, right];
	
	var heldDownKeys = {};
	
	function updatePlane() {
		plane.planeDetails.thrust = heldDownKeys[up];
		plane.planeDetails.rotateClockwise = heldDownKeys[right];
		plane.planeDetails.rotateAntiClockwise = heldDownKeys[left];
	}
	
	addEventListener("keyup", function(e) {
		heldDownKeys[e.keyCode] = false;
		updatePlane();
		if (preventPropagationKeys.contains(e.keyCode)) {
			e.preventDefault();
		}
	});
	
	addEventListener("keydown", function(e) {
		heldDownKeys[e.keyCode] = true;
		updatePlane();
		if (preventPropagationKeys.contains(e.keyCode)) {
			e.preventDefault();
		}
	});	
}