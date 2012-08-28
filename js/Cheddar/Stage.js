Stage = (function(DisplayObject) {

	inheritsFrom(Stage, DisplayObject);

	function Stage(src) {
	
		Stage.parentClass.constructor.apply(this, arguments);
		
		this.stageWidth;
		this.stageHeight;
		
		this.customwidth = function () {
			return this.stageWidth
		}
		this.customheight = function () {
			return this.stageHeight
		}
	}

	return Stage;

})(DisplayObject);