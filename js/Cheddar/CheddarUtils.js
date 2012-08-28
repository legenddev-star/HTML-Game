__hasProp = {}.hasOwnProperty,
inheritsFrom = function(child, parent) { 
	for (var key in parent) { 
		if (__hasProp.call(parent, key)) 
			child[key] = parent[key]; 
	} 
	function ctor() { 
		this.constructor = child; 
	} 
	ctor.prototype = parent.prototype; 
	child.prototype = new ctor(); 
	child.parentClass = parent.prototype; 
	return child; 
};

function createImage (src) {
	var i = new Image ();
	i.src = src;
	return i;
}

function trace () {
	for (var i=0; i< arguments.length;i++) {
		window.console.log(arguments[i]);
	}
}

CanvasRenderingContext2D.prototype.fillCircle = function (X,Y,radius, fill) {
	this.fillStyle = fill;
	this.beginPath();
	this.arc(X - radius / 2, Y - radius / 2, radius, 0, Math.PI*2, true); 
	this.closePath();
	this.fill();
}

try {
   if (!Object.prototype.__defineGetter__ &&
        Object.defineProperty({},"x",{get: function(){return true}}).x) {
      Object.defineProperty(Object.prototype, "__defineGetter__",
         {enumerable: false, configurable: true,
          value: function(name,func)
             {Object.defineProperty(this,name,
                 {get:func,enumerable: true,configurable: true});
      }});
      Object.defineProperty(Object.prototype, "__defineSetter__",
         {enumerable: false, configurable: true,
          value: function(name,func)
             {Object.defineProperty(this,name,
                 {set:func,enumerable: true,configurable: true});
      }});
   }
} catch(defPropException) {/*Do nothing if an exception occurs*/};