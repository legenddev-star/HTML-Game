DisplayImage = (function(DisplayObject) {

	inheritsFrom(DisplayImage, DisplayObject);

	function DisplayImage(src) {
		
		DisplayImage.parentClass.constructor.apply(this, arguments);
		
		this.globalImageIndex = -1;
		
		this.setImage = function (src) {
			if (!src) {
				return
			}
			if (typeof src == typeof "") {
				var alreadyHaveImage = false;
				for (var i = 0; i < Cheddar.images.length; i++) {
					if (Cheddar.images[i].src == src) {
						alreadyHaveImage = true;
						this.globalImageIndex = i
						break;
					}
				}
				if (!alreadyHaveImage) {
					var newI = new Image();
					newI.src = src;
					this.globalImageIndex = Cheddar.images.length
					Cheddar.images.push(newI);
				}
			} else {
				var alreadyHaveImage = false;
				for (var i = 0; i < Cheddar.images.length; i++) {
					if (Cheddar.images[i].src == src.src) {
						alreadyHaveImage = true;
						this.globalImageIndex = i
						break;
					}
				}
				if (!alreadyHaveImage) {
					var newI = new Image();
					newI.src = src.src;
					this.globalImageIndex = Cheddar.images.length
					Cheddar.images.push(newI);
				}
			}
		}
		
		/*if (src) {
			if (typeof src == typeof "") {
				this.image = new createImage(src);
			} else if (typeof src == typeof new Image()) {
				this.image = (src);
			}
		}*/
		this.setImage(src)
		
		//TODO
		this.blendEnabled = false;
		//This function takes in the pixel currently on the canvas and the pixel from the display object
		//it returns a new pixel based on these which is drawn to the canvas
		this.blendFunction = function (currentpx, yourpx) { return yourpx; }
		
		/*
		this.__defineGetter__ ("width", function () {
			return this.image.width;
		});
		
		
		this.__defineGetter__ ("height", function () {
			return this.image.height;
		});
		*/
		
		this.customwidth = function () {
			if (this.globalImageIndex != -1) {
				return Cheddar.images[this.globalImageIndex].width;
			}
			return 0;
		}
		this.customheight = function () {
			if (this.globalImageIndex != -1) {
				return Cheddar.images[this.globalImageIndex].height;
			}
			return 0;
		}
		
		this.__defineGetter__ ("image", function () {
			return Cheddar.images[this.globalImageIndex]
		})
		
		this.__defineSetter__ ("image", function (src) {
			this.setImage(src)
		})
		
		this.on ("render", function (context) {
			if (this.globalImageIndex != -1) {
				img = Cheddar.images[this.globalImageIndex];
				context.drawImage(img, -img.width / 2,-img.height / 2, img.width,img.height);
			}
		});
		
	}

	return DisplayImage;

})(DisplayObject);