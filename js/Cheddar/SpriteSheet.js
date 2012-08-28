SpriteSheet = (function(DisplayObject) {

	inheritsFrom(SpriteSheet, DisplayObject);

	function SpriteSheet(src, frameWidth, frameHeight) {
		
		SpriteSheet.parentClass.constructor.apply(this, arguments);
		
		this.frameRate     = 24;
		this.animating     = true;
		this.lastFrameTime = 0;
		this.frameWidth    = frameWidth;
		this.frameHeight   = frameHeight;
		
		this.timeForFrame = function () {
			return 1000/this.frameRate;
		}
		
		var currentX = 0;
		var currentY = 0;
		
		this.imgToDraw = this.addChild(new DisplayImage(src));
		this.imgToDraw.visible = false;
		
		this.nextFrame = function () {
			currentX += this.frameWidth;
			if (currentX + this.frameWidth > this.imgToDraw.width) {
				currentX = 0;
				currentY += this.frameHeight;
			}
			if (currentY + this.frameHeight > this.imgToDraw.height) {
				currentY = 0;
			}
		}
		
		this.imgToDraw.customWidth = function () {
			return 0;
		}
		this.imgToDraw.customHeight = function () {
			return 0;
		}
		
		this.customWidth = function () {
			return this.frameWidth;
		}
		this.customHeight = function () {
			return this.frameHeight;
		}
		
		this.__defineGetter__ ("width", function () {
			return this.customWidth();
		})
		this.__defineGetter__ ("height", function () {
			return this.customHeight();
		})
		
		this.on ("enterframe", function (e) {
			if (this.imgToDraw != undefined && this.imgToDraw.image != undefined) {
				if (this.animating) {
					this.lastFrameTime += e.delta;
					if (this.lastFrameTime > this.timeForFrame()) {
						this.lastFrameTime = 0;
						this.nextFrame();
					}
				}
			}
		});
		
		this.on("render", function (context) {
			context.drawImage(this.imgToDraw.image, currentX, currentY, this.frameWidth, this.frameHeight, -this.imgToDraw.width / 2,-this.imgToDraw.height/2,this.imgToDraw.width, this.imgToDraw.height);
		})
		
	}

	return SpriteSheet;

})(DisplayObject);