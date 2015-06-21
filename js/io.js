/**
 * This function provides an interface with the server. The sever is insecure and trivial,
 * it takes the sent message and passes it to all other clients.
 */
function io(planeCallback) {
	var ready = false;
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    var connection = new WebSocket('ws://localhost:1337');

	connection.onopen = function () {
		ready = true;
    };

    connection.onmessage = function (message) {
         try {
            planeCallback(JSON.parse(message.data));
        } catch (e) {
            console.log('Error processing message', message.data);
            return;
        }
    };
    
    connection.onerror = function (e) {
        console.log(e);
    };
     
    
    this.send = function(plane) {
    	if (!ready) {
    		return;
    	}
    	connection.send(JSON.stringify(plane.planeDetails));
    }
}
