Array.prototype.indexOf = function(item)
{
	for(var i=0;i<this.length;i++) {
		if (this[i] == item) {
			return i;
		}
	}
	return -1;
}

Array.prototype.contains = function(item)
{
	return this.indexOf(item) >= 0;
}