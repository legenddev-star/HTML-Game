Text = (function(DisplayObject) {

	inheritsFrom(Text, DisplayObject);

	function Text(text) {
		
		Text.parentClass.constructor.apply(this, arguments);
		if (text) {
			this.text = text;
		} else {
			this.text = "";
		}
		this.strokeStyle = "#FFFFFF";
		this.fillStyle = "#000";
		this.font = '14px sans-serif';
		this.textBaseline = 'bottom'
		this.strokeText = false;
		this.W = 0;
		this.H = 0;
		this.customwidth = function () {
			return this.W;
		}
		this.customheight = function () {
			return this.H;
		}
		this.reference = "left"
		this.LEFT   = 'left'
		this.RIGHT  = 'right'
		this.CENTRE = 'centre'
		this.on ("render", function (context) {
			context.save();
			this.W = context.measureText(this.text).width;
			this.H = 20;
			if (this.reference == "left") {
				context.translate(0, 0);
			} else if (this.reference == "right") {
				context.translate(-this.width, this.height);
			} else {
				context.translate(-this.width/2, this.height/2);
			}
			context.fillStyle = this.fillStyle;
			context.font = this.font;
			context.textBaseline = this.textBaseline;
			if (this.strokeText == false) {
				context.fillText(this.text,0,0);
			} else {
				context.strokeStyle = this.strokeStyle;
				context.strokeText(this.text,0,0);
			}
			context.restore();
		});
		
	}

	return Text;

})(DisplayObject);