DisplayVector = (function(DisplayObject) {

	inheritsFrom(DisplayVector, DisplayObject);

	function DisplayVector(src) {
		
		DisplayVector.parentClass.constructor.apply(this, arguments);
		
		this.image = createImage(src);
	
		this.customwidth = function () {
			return this.image.width;
		}
		this.customheight = function () {
			return this.image.height;
		}
		
		this.on ("render", function (context) {
			context.drawImage(this.image,-this.image.width / 2,-this.image.height/2,this.image.width,this.image.height);
		});
	}

	return DisplayVector;

})(DisplayObject);