Button = (function(DisplayObject) {

	inheritsFrom(Button, DisplayObject);

	function Button(src) {
	
		Button.parentClass.constructor.apply(this, arguments);
		
		this.initLists();
	
		this.defaultImage = createImage(src + "/default.png");
		this.overImage    = createImage(src + "/over.png");
		this.downImage    = createImage(src + "/down.png");
		this.imgToDraw    = this.addChild(new DisplayImage());
		this.imgToDraw.setImage(this.defaultImage);
		
		this.on ("mouseover", function (e) {
			if (!this.mouseDown) {
				this.imgToDraw.setImage(this.overImage)
			} else {
				this.imgToDraw.setImage(this.downImage)
			}
		});
		
		this.on ("mousedown", function (e) {
			if (this.hitTest(Cheddar.mouse)) {
				this.imgToDraw.setImage(this.downImage)
			}
		});
		
		this.on ("mouseup", function (e) {
			if (this.mouseOver) {
				this.imgToDraw.setImage(this.overImage)
			} else {
				this.imgToDraw.setImage(this.defaultImage)
			}
		});
		
		this.on ("mouseout", function (e) {
			this.imgToDraw.setImage(this.defaultImage)
		});
		
	}

	return Button;

})(DisplayObject);