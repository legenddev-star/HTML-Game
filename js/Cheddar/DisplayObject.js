DisplayObject = (function() {

	function DisplayObject() {
		this.mousedownEventList  = new Array();
		this.mouseupEventList    = new Array();
		this.mouseoverEventList  = new Array();
		this.mousemoveEventList  = new Array();
		this.mouseoutEventList   = new Array();
		this.mousedragEventList  = new Array();
		this.clickEventList      = new Array();
		this.keyupEventList      = new Array();
		this.keydownEventList    = new Array();
		this.enterframeEventList = new Array();
		this.renderEventList     = new Array();
		this.displayList         = new Array();
		this.customEventTable    = {};
		
		this.initLists = function () {
			this.mousedownEventList  = new Array();
			this.mouseupEventList    = new Array();
			this.mouseoverEventList  = new Array();
			this.mousemoveEventList  = new Array();
			this.mouseoutEventList   = new Array();
			this.mousedragEventList  = new Array();
			this.clickEventList      = new Array();
			this.keyupEventList      = new Array();
			this.keydownEventList    = new Array();
			this.enterframeEventList = new Array();
			this.renderEventList     = new Array();
			this.displayList         = new Array();
			this.customEventTable    = {};
		}
		
		//this.initLists();

		this.parent = null;
		this.__defineGetter__ ("numChildren", function () {
			return this.displayList.length;
		});
		
		this.x = 0
		this.__defineGetter__ ("globalx", function () {
			if (this.parent) {
				return this.x + this.parent.globalx;
			}
			return this.x;
		});
		
		this.y = 0;
		this.__defineGetter__ ("globaly", function () {
			if (this.parent) {
				return this.y + this.parent.globaly;
			}
			return this.y;
		});
		
		this._rotation = 0;
		this.__defineGetter__ ("rotation", function () {
			return this._rotation;
		});
		this.__defineSetter__ ("rotation", function (R) {
			
			while (R > 180) {
				R -= 360;
			}
			while (R < -180) {
				R += 360
			}
			
			this._rotation = R;
		});
		
		this.__defineGetter__ ("width", function () {
			var maxX = this.globalx + this.customwidth() / 2;
			var minX = this.globalx - this.customwidth() / 2;
			for (var i=0; i < this.numChildren; i++) {
				var child = this.getChildAt(i);
				if (child.globalx + child.width / 2 > maxX) {
					maxX = child.globalx + child.width / 2
				}
				if (child.globalx - child.width / 2 < minX) {
					minX = child.globalx - child.width / 2
				}
			}
			return maxX - minX;
		});
		this.customwidth = function () {
			//overridden
			return 0;
		}
		
		this.__defineGetter__ ("height", function () {
			var maxY = this.globaly + this.customheight() / 2;
			var minY = this.globaly - this.customheight() / 2;
			for (var i=0; i < this.numChildren; i++) {
				var child = this.getChildAt(i);
				if (child.globaly + child.height / 2 > maxY) {
					maxY = child.globaly + child.height / 2
				}
				if (child.globaly - child.height / 2 < minY) {
					minY = child.globaly - child.height / 2
				}
			}
			return maxY - minY;
		});
		this.customheight = function () {
			//overridden
			return 0;
		}
		
		this.scaleX = 1;
		
		this.scaleY = 1;
		
		this.__defineSetter__ ("scale", function (S) {
			this.scaleX = S;
			this.scaleY = S;
		});
		
		this.visible = true;
		this.alpha = 1;
		this.enabled = true
		
		this.mouseDown = false
		this.mouseOver = false;
		this.dragging  = false;
		
		this.dispatchEvents = function (events, e) {
			if (!this.visible) {
				return;
			}
			for (var i = 0; i < this[events+"EventList"].length; i++) {
				this[events+"EventList"][i].call(this,e);
			}
		}
		
		this.onmousedown = function (e) {
			if (!this.enabled) {
				return;
			}
			for (var i=0; i < this.numChildren; i++) {
				this.getChildAt(i).onmousedown(e);
			}
			if (this.hitTest(Cheddar.mouse)) {
				this.mouseDown = true;
			}
			this.dispatchEvents("mousedown",e);
		}

		this.onmouseup = function (e) {
			if (!this.enabled) {
				return;
			}
			this.dragging = false;
			if (this.mouseDown == true && this.hitTest(Cheddar.mouse)) {
				this.onclick(e);
			}
			
			this.mouseDown = false;
			for (var i=0; i < this.numChildren; i++) {
				this.getChildAt(i).onmouseup(e);
			}
			
			this.dispatchEvents("mouseup",e);
		}

		this.onmousemove = function (e) {
			if (!this.enabled) {
				return;
			}
			for (var i=0; i < this.numChildren; i++) {
				this.getChildAt(i).onmousemove(e);
			}
			
			//HIT TEST IS TOO SLOW SO YOU MUST CHECK MANUALLY
			//if (this.hitTest(Cheddar.mouse)) {
				this.dispatchEvents("mousemove",e);
			//}
				
			if (this.mouseDown) {
				this.onmousedrag(e);
			}
		}
		
		this.onmousedrag = function (e) {
			if (!this.enabled) {
				return;
			}
			if (this.mouseOver) {
				this.dragging = true;
			}
			//if (this.hitTest(Cheddar.mouse)) {
			if (this.mouseDown) {
				for (var i=0; i < this.numChildren; i++) {
					this.getChildAt(i).onmousedrag(e);
				}
				this.dispatchEvents("mousedrag",e);
			}
			//}
		}

		this.onmouseover = function (e) {
			if (!this.enabled) {
				return;
			}
			if (!this.mouseOver) {
				if (this.hitTest(Cheddar.mouse)) {
					for (var i=0; i < this.numChildren; i++) {
						//if (this.getChildAt(i).hitTest(Cheddar.mouse)) {
							this.getChildAt(i).onmouseover(e);
						//}
					}
					this.mouseOver = true;
					this.dispatchEvents("mouseover",e);
				}
			}
		}

		this.onmouseout = function (e) {
			if (!this.enabled) {
				return;
			}
			for (var i=0; i < this.numChildren; i++) {
				this.getChildAt(i).onmouseout(e);
			}
			this.mouseOver = false;
			this.dispatchEvents("mouseout",e);
		}

		this.onclick = function (e) {
			if (!this.enabled) {
				return;
			}
			if (this.mouseDown) {
			/*
				for (var i=0; i < this.numChildren; i++) {
					if (this.getChildAt(i).mouseDown) {
						this.getChildAt(i).onclick(e);
					}
				}
			*/
				this.dispatchEvents("click",e);
			}
		}
		
		//TODO will this work with rotation?
		this.partitions = 10;
		this.buckets = [];
		var registerChildren = function () {
			this.buckets = [];
			for (var i=0 ; i < this.numChildren; i++) {
				var c  = this.getChildAt(i);
				var p1 = {x:c.x - c.width / 2, y: c.y - c.height / 2};
				var p2 = {x:c.x + c.width / 2, y: c.y + c.height / 2};
				
			}
		}
		
		this.onenterframe = function (e) {
			//registerChildren ()
			this.dispatchEvents("enterframe",e);
			for (var i=0; i < this.numChildren; i++) {
				this.getChildAt(i).onenterframe(e);
			}
		}
		
		this.hitTest = function (point) {
			//if (!this.visible) {
			//	return false;
			//}
			//Also needs to bubble in such a way that you can test children of display objects
			
			var maxX = this.x + this.width / 2;
			var minX = this.x - this.width / 2;
			for (var i=0; i < this.numChildren; i++) {
				var child = this.getChildAt(i);
				if (child.x + this.x + child.width / 2 > maxX) {
					maxX = child.x + this.x + child.width / 2
				}
				if (child.x + this.x - child.width / 2 < minX) {
					minX = child.x + this.x - child.width / 2
				}
			}
			
			var maxY = this.y + this.height / 2;
			var minY = this.y - this.height / 2;
			for (var i=0; i < this.numChildren; i++) {
				var child = this.getChildAt(i);
				if (child.y + this.y + child.height / 2 > maxY) {
					maxY = child.y + this.y + child.height / 2
				}
				if (child.y + this.y - child.height / 2 < minY) {
					minY = child.y + this.y - child.height / 2
				}
			}
			
			var rightmostPoint  = maxX;
			var leftmostPoint   = minX;
			var topmostPoint    = maxY;
			var bottommostPoint = minY;
			
			var centre = {x:(rightmostPoint + leftmostPoint)/2,y:(topmostPoint + bottommostPoint)/2}
			//trace(centre.x, centre.y)
			
			if (this.rotation != 0) {
				var theta = (-this.rotation) * Math.PI / 180;
				var d = {
					x:(point.x - centre.x) * Math.cos(theta) - Math.sin(theta) * (point.y - centre.y),
					y:(point.x - centre.x) * Math.sin(theta) + Math.cos(theta) * (point.y - centre.y)
				}
			} else {
				d = {
					x:(point.x - centre.x),
					y:(point.y - centre.y)
				}
			}
			
			return (d.x + this.globalx > this.globalx - (this.width * this.scaleX) / 2 && d.x + this.globalx < this.globalx + (this.width * this.scaleX) / 2 && d.y + this.globaly > this.globaly - (this.height * this.scaleY) / 2 && d.y + this.globaly < this.globaly + (this.height * this.scaleY) / 2);
		}
	}
	
	DisplayObject.prototype.draw = function (context) {
		//basic
		if (this.visible) {
			context.save();
			context.translate(this.x, this.y)
			context.rotate(this.rotation * Math.PI / 180);
			context.scale(this.scaleX,this.scaleY);
			context.globalAlpha *= this.alpha;
			for (var i=0; i < this.numChildren; i++) {
				this.displayList[i].draw(context);
			}
			this.dispatchEvents("render",context);
			context.restore();
		}
	}

	DisplayObject.prototype.addChild = function (child) {
		this.displayList.push(child);
		child.parent = this;
		return child;
	}

	DisplayObject.prototype.removeChild = function (child) {
		for (var i=0; i< this.numChildren; i++) {
			if (child == this.getChildAt(i)) {
				var newDisplayList = new Array();
				for (var j = 0; j < this.numChildren; j++) {
					if (j != i) {
						newDisplayList.push(this.getChildAt(j));
					}
				}
				this.displayList = newDisplayList;
				return;
			}
		}
	}

	DisplayObject.prototype.getChildAt = function (index) {
		return this.displayList[index];
	}

	DisplayObject.prototype.getChildIndex = function (child) {
		for (var i = 0; i < this.numChildren; i++) {
			if (child == this.getChildAt(i)) {
				return i;
			}
		}
	}

	DisplayObject.prototype.swapChildren = function (index1, index2) {
		//TODO broken
		var temp;
		if (typeof index1 != typeof 1) {
			index1 = this.getChildIndex(index1);
			index2 = this.getChildIndex(index2);
		}
		temp = this.getChildAt (index1);
		this.displayList[index1] = this.getChildAt(index2);
		this.displayList[index2] = temp;
	}

	DisplayObject.prototype.on = function (type, callback) {
		if (this[type+"EventList"]) {
			this[type+"EventList"].push(callback);
		} else {
			if (this.customEventTable[type] == undefined) {
				this.customEventTable[type] = [];
			}
			this.customEventTable[type].push(callback);
		}
	}

	DisplayObject.prototype.off = function (name, callback) {
		if (this[name+"EventList"]) {
			//This could be more efficient... I think...
			var a = Array(this[name+"EventList"]);
			for (var i = 0; i < a.length; i++) {
				if (a[i] == callback) {
					newCallbackList = new Array();
					for (var j = 0; j < a.length; j++) {
						if (a[i] != a[j]) {
							newCallbackList.push(callback);
						}
					}
					a = newCallbackList;
					return;
				}
			}
		} else {
			var eventList = this.customEventTable[name]
			if (eventList != undefined) {
				var newList = new Array();
				for (i=0;i<eventList.length;i++) {
					if (eventList[i] != callback) {
						newList.push(eventList[i]);
					}
				}
				this.customEventTable[name] = newList;
			}
		}
	}
	
	DisplayObject.prototype.dispatchEvent = function (type, event) {
		var eventList = this.customEventTable[type];
		if (eventList != undefined) {
			for (var i = 0; i < eventList.length; i++) {
				eventList[i].call(this, event);
			}
		}
		for (i=0; i < this.numChildren; i++) {
			this.getChildAt(i).dispatchEvent(type, event)
		}
	}

	return DisplayObject;

})();