Sprite = (function(DisplayObject) {

	inheritsFrom(Sprite, DisplayObject);

	function Sprite(src_dir, src_prefix, src_suffix, numImages) {
		
		Sprite.parentClass.constructor.apply(this, arguments);
		
		this.frames = [];
		this.currentFrame = 0;
		this.frameRate = 24;
		this.animating = true;
		this.lastFrameTime = 0;
		
		this.imgToDraw = this.addChild(new DisplayImage());
		
		//load frames
		this.loadFrames = function (src_dir, src_prefix, src_suffix, numImages) {
			for (var i = 1; i <= numImages; i++) {
				var c = createImage(src_dir + "/" + src_prefix + i + src_suffix)
				c.callBacks = new Array();
				this.frames.push(c);
			}
		}
		if (arguments.length == 4) {
			this.loadFrames (src_dir, src_prefix, src_suffix, numImages);
			
			if (numImages > 0) {
				this.imgToDraw.setImage(this.frames[0])
			}
		}
		
		this.__defineGetter__ ("image", function () {
			return frames[this.currentFrame];
		});
		
		this.timeForFrame = function () {
			return 1000/this.frameRate;
		}
		this.stop = function () {
			this.animating = false;
		}
		this.play = function () {
			this.animating = true;
		}
		this.gotoFrame = function (f) {
			if (this.currentFrame == f) {
				return;
			}
			this.currentFrame = f;
			this.constrainFrames();
			if (this.frames[this.currentFrame].callBacks) {
				for (var i= 0;i < this.frames[this.currentFrame].callBacks.length; i++) {
					this.frames[this.currentFrame].callBacks[i]();
				}
			} else {
				this.frames[this.currentFrame].callBacks = new Array();
			}
		}
		this.gotoAndStop = function (f) {
			this.gotoFrame(f);
			this.stop();
		}
		this.gotoAndPlay = function (f) {
			this.gotoFrame(f);
			this.play();
		}
		this.nextFrame = function () {
			this.gotoFrame(this.currentFrame + 1)
			this.constrainFrames();
		}
		this.prevFrame = function (f) {
			this.gotoFrame(this.currentFrame - 1)
			this.constrainFrames();
		}
		this.constrainFrames = function () {
			while (this.currentFrame > this.frames.length - 1) {
				this.currentFrame -= this.frames.length;
			}
			while (this.currentFrame < 0) {
				this.currentFrame += this.frames.length ;
			}
		}
		this.clearFrames = function () {
			this.frames = new Array();
		}
		this.addFrame = function (img, index) {
			img.callBacks = new Array();
			if (index) {
				var newFrames  = new Array();
				var addedFrame = false;
				for (var i = 0; i < this.frames.length + 1; i++) {
					if (i != index) {
						if (!addedFrame) {
							newFrames.push(this.frames[i]);
						} else {
							newFrames.push(this.frames[i - 1]);
						}
					} else {
						newFrames.push(img);
						addedFrame = true;
					}
				}
				this.frames = newFrames;
			} else {
				this.frames.push(img);
			}
			if (this.frames.length == 1) {
				this.imgToDraw.setImage(this.frames[0])
			}
		}
		
		//TODO check this with what flash outputs
		function getZeros (n) {
			return "0000";
			var c = "";
			if (n < 10) {
				return "0";
			}
			while (n > 1) {
				n /= 10;
				n = n | 0;
				c = c + "0"
			}
			return c + "00";
		}
		
		function getPrefix (n, z) {
			var s1 = String(n).split("");
			var s2 = String(z).split("");
			for (var i=0; i < s1.length; i ++) {
				s2[s2.length - i - 1] = s1[s1.length - i - 1];
			}
			return s2.join("");
		}
		
		if (arguments.length == 2) {
			for (var i = 1; i <= src_prefix; i ++) {
				var num = getPrefix(i, getZeros(src_prefix));
				this.addFrame(createImage(src_dir + num + ".png"))
			}
		}
		
		this.removeFrame = function (index) {
			var newFrames = new Array();
			for (var i = 0; i < this.frames.length; i++) {
				if (i != index) {
					newFrames.append(this.frames[i]);
				}
			}
			this.frames = newFrames;
		}
		this.addFrameCallback = function (frame, callback) {
			this.frames[frame - 1].callBacks.push(callback);
		}
		this.removeFrameCallback = function (frame, callback) {
			var newCallbacks = new Array();
			for (var i = 0; i < this.frames[frame - 1].callBacks.length; i ++) {
				var cb = this.frames[frame - 1].callBacks[i];
				if (cb != callback) {
					newCallbacks.push(cb);
				}
			}
			this.frames[frame - 1].callBacks = newCallbacks;
		}
		
		this.on ("enterframe", function (e) {
			if (this.imgToDraw != undefined && this.imgToDraw.image != undefined) {
				if (this.animating) {
					this.lastFrameTime += e.delta;
					if (this.lastFrameTime > this.timeForFrame()) {
						this.lastFrameTime = 0;
						this.nextFrame();
					}
				}
				
				this.imgToDraw.setImage(this.frames[this.currentFrame].src)
			}
		});
		
	}

	return Sprite;

})(DisplayObject);