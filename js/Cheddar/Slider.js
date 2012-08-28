Slider = (function(DisplayObject) {

	inheritsFrom(Slider, DisplayObject);

	function Slider(src) {
		
		Slider.parentClass.constructor.apply(this, arguments);
		
		this.background = this.addChild(new DisplayImage(src + "/back.png"));
		this.ball       = this.addChild(new DisplayImage(src + "/ball.png"));
		this.ball2      = this.addChild(new DisplayImage(src + "/balldown.png"));
		
		this.snapInterval = 0;
		
		this._value    = 0;
		this.__defineGetter__ ("value", function () {
			return this._value;
		});
		this.__defineSetter__ ("value", function (X) {
			if (X > this.maximum) {
				X = this.maximum
			}
			if (X < this.minimum) {
				X = this.minimum;
			}
			//TODO set snap interval
			this._value = X;
		});
		
		this.setValue = function (x) {
			this.value = x;
		}	
		
		this.minimum  = 0;
		this.maximum  = 100;
		this.dragging = false;
		this.inertial = false;
		this.inertialRate = 0.5
		this.oldMouse = {x:-1, y:-1};
		
		this.on ("mousemove", function (e) {
			if (!this.mouseDown) {
				return;
			}
			if (this.oldMouse.x == -1) {
				this.oldMouse.x = e.pageX;
				return;
			}
			//TODO make this better for values that aren't [0,100]
			//this.setValue (this.value + (e.pageX - this.oldMouse.x)/2.7 / this.scaleX);
			this.setValue (this.value + ((e.pageX - this.oldMouse.x)/2.7 / this.scaleX)*((this.maximum - this.minimum) / 100));
			this.oldMouse.x = e.pageX
		});
		
		this.on ("mouseup", function (e) {
			this.oldMouse.x = -1;
		});
		
		Cheddar.bind(this, "dragging", this.ball2, "visible");
		//Cheddar.bind(this, "value", this.ball,"x");
		Cheddar.bind(this.ball,"x", this.ball2,"x");
		
		this.ball.y  = -1 * this.scaleY
		this.ball2.y = -1 * this.scaleY
		
		this.__defineGetter__("target",function () {
			if (this.value > this.maximum) {
				this.value = this.maximum;
			}
			if (this.value < this.minimum) {
				this.value = this.minimum;
			}
			var t = ((this.value - this.minimum)/(this.maximum - this.minimum)) * this.background.width - this.background.width / 2; 
			return t;
		});
		
		this.on ("enterframe", function (e,delta) {
			this.ball.scaleX = 1/this.scaleX
			this.ball.scaleY = 1/this.scaleY
			this.ball2.scaleX = 1/this.scaleX
			this.ball2.scaleY = 1/this.scaleY
			
			var target = this.target
			if (this.inertial) {
				this.ball.x += (this.target - this.ball.x) * this.inertialRate
			} else {
				this.ball.x = target
			}
		});
		
	}

	return Slider;

})(DisplayObject); 