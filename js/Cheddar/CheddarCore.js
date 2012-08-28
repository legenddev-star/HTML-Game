/* IDEAS!
	Could have the framework render each object on a separate canvas and then combine them into one, or even, just manipulate each canvas' css
		Would make mouse events easy, allow individual refreshment of each object, would allow better integration with non-canvas DOM...
*/

/* TODO
	ONLY REDRAW WHAT YOU NEED TO REDRAW
	Partition the space inside display objects for fast collision detection
	Privitise various variables inside objects
		could also swap out event lists with a single event table (mite be better)
	MAKE IT SO YOU CAN HAVE MORE THAN ONE CANVAS
	Stuff to add:
		Ability to define with JSON like mxml
			reflection is like this:
				var str = "MyClass";
				var obj = new window[str](args);
			use eval and bind for {}
		target
		registration point editing
		Make fonts easier
		Sound
		Webgl option
			+ Hardware accelerated 2D and 3D
		blending + compositing and masking
		easily compatable with other libraries like box2d and threejs
		gifs
*/

/* !!!!ERRORS!!!!
	mouse events not falling down buttons correctly (test with buttons and rotation)
	rotated hit testing needs testing
	SVG's cant have alpha it seems
	hit testing with children of different parents probably wont work with the way I have it at the moment
	HIT TEST MUST CALCULATE THE BOUNDING BOX PROPERLY (it assumes the origin is the centre of the object. THIS MIGHT NOT BE THE CASE)
		WIDTH AND HEIGHT IS ALSO CALCULATED ASSUMING THE CENTRE OF THE OBJECT IS 0,0
*/

var $ = jQuery.noConflict();
window.requestAnimFrame = (function(callback){
return window.requestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame ||
window.oRequestAnimationFrame ||
window.msRequestAnimationFrame ||
function(callback){
	window.setTimeout(callback, 1000 / 60);
};
})();

function Cheddar () {}

Cheddar.touchHandler = function(event) {
	//if (event.type == "touchmove") {
	//	event.preventDefault();
	//}
	var touches = event.changedTouches,
	first = touches[0],
	type = "";
	 switch(event.type) {
		case "touchstart": type = "mousedown"; break;
		case "touchmove":  type="mousemove"; break;        
		case "touchend":   type="mouseup"; break;
		default: return;
	}

			 //initMouseEvent(type, canBubble, cancelable, view, clickCount, 
	//           screenX, screenY, clientX, clientY, ctrlKey, 
	//           altKey, shiftKey, metaKey, button, relatedTarget);
	var button = 0;
	
	if (event.touches.length == 2) {
		button = 2
	}
	
	var simulatedEvent = document.createEvent("MouseEvent");
	simulatedEvent.initMouseEvent(type, true, true, Cheddar.canvas, 1, 
							  first.screenX, first.screenY, 
							  first.clientX, first.clientY, false, 
							  false, false, false, button, null);
	//if (simulatedEvent != "mousemove") {
	Cheddar.mouse.x = simulatedEvent.pageX - Cheddar.canvas.offsetLeft;
	Cheddar.mouse.y = simulatedEvent.pageY - Cheddar.canvas.offsetTop;
	//}
	first.target.dispatchEvent(simulatedEvent);
	event.preventDefault();
}

Cheddar.init = function (opts) {
	//TODO implement options
	
	//stores all images loaded to speed up rendering of images
	this.images = [];
	
	this.updateRate = 60;
	this.updateRate = 60;
	this.frameRate  = 60;
	this.mouse = {x:0,y:0};
	this.oldTime = (new Date()).getTime();
	this.clear = true;
	if (opts.clear != undefined) {
		this.clear = opts.clear;
	}
	this.renderCanvas = true;
	if (opts.renderCanvas != undefined) {
		this.renderCanvas = opts.renderCanvas
	}
	
	this.canvas = document.createElement('canvas');
	var canvas = this.canvas;
	canvas.width = opts.width;
	canvas.height = opts.height;
	this.context = canvas.getContext("2d");
	
	if (this.renderCanvas) {
		document.body.appendChild(canvas);
	}
	
	this.canvas.addEventListener("touchstart", Cheddar.touchHandler, true);
	this.canvas.addEventListener("touchmove", Cheddar.touchHandler, true);
	this.canvas.addEventListener("touchend", Cheddar.touchHandler, true);
	this.canvas.addEventListener("touchcancel", Cheddar.touchHandler, true);
	
	this.delta = 0;
	this.stage = new Stage();
	this.stage.stageWidth = canvas.width
	this.stage.stageHeight = canvas.height
	this.drawEnabled = true;
	
	canvas.onmousedown = Cheddar.onMouseDown;
	canvas.onmouseup = Cheddar.onMouseUp;
	canvas.onmousemove = Cheddar.onMouseMove;
	
	canvas.oncontextmenu = Cheddar.onContextMenu;
	
	Cheddar.main ();
	Cheddar.draw(this.context);
}

Cheddar.onContextMenu = function (e) {
	e.preventDefault()
}

Cheddar.onMouseDown = function (e) {
	Cheddar.stage.onmousedown(e);
	e.preventDefault()
}

Cheddar.onMouseUp = function (e) {
	Cheddar.stage.onmouseup(e);
	e.preventDefault()
}

Cheddar.onMouseMove = function (e) {
	Cheddar.mouse.x = e.pageX - Cheddar.canvas.offsetLeft;
	Cheddar.mouse.y = e.pageY - Cheddar.canvas.offsetTop;
	Cheddar.stage.onmousemove(e);
	e.preventDefault()
}

Cheddar.main = function () {
	
	this.delta = (new Date()).getTime() - this.oldTime;
	this.oldTime = (new Date()).getTime();
	
	var simulatedEvent = document.createEvent("Event");
	simulatedEvent.initEvent("enterframe",true,false)
	simulatedEvent.delta = this.delta;
	this.stage.onenterframe (simulatedEvent)
	
	//TODO send mouse events down
	var simulatedEvent = document.createEvent("MouseEvent");
	for (var i=0; i < this.stage.displayList.length; i++) {
		if (!this.stage.displayList[i].mouseOver && this.stage.displayList[i].hitTest(this.mouse)) {
			simulatedEvent.initMouseEvent("mouseover", true, true, window,
0, 0, 0, 0, 0, false, false, false, false, 0, null);
			this.stage.displayList[i].onmouseover(simulatedEvent);
		} else {
			if (this.stage.displayList[i].mouseOver && !this.stage.displayList[i].hitTest(this.mouse)) {
				simulatedEvent.initMouseEvent("mouseout",true, true, window,
0, 0, 0, 0, 0, false, false, false, false, 0, null); 	
				this.stage.displayList[i].onmouseout(simulatedEvent);
			}
		}
	}
	setTimeout(function () {
		requestAnimFrame(function(){
			Cheddar.main();
		})
	}
	, 1000/this.updateRate)
}

Cheddar.draw = function (context) {
	if (Cheddar.canvas.width != Cheddar.stage.stageWidth) {
		Cheddar.canvas.width = Cheddar.stage.stageWidth
	}
	if (Cheddar.canvas.height != Cheddar.stage.stageHeight) {
		Cheddar.canvas.height = Cheddar.stage.stageHeight
	}
	if (Cheddar.clear) {
		context.clearRect ( 0,0,this.canvas.width,this.canvas.height);
	}
	this.stage.draw(context);
	setTimeout(function () {
		requestAnimFrame(function(){
			Cheddar.draw(context);
		})
	}
	, 1000/this.frameRate)
}

//TODO this appears to be iffy
Cheddar.bind = function (src_obj, src_attr, dest_obj, dest_attr) {
	src_obj.watch(src_attr, function () { dest_obj[dest_attr] = src_obj[src_attr] });
	dest_obj[dest_attr] = src_obj[src_attr]
}

Cheddar.parse = function (callContext, jsonOrXml) {
	//TODO
} 

Cheddar.dispatchEvent = function (type, event) {
	Cheddar.stage.dispatchEvent(type, event)
}