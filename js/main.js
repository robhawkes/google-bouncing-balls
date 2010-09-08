$(function() {
	var canvas = $("#c");
	var canvasHeight;
	var canvasWidth;
	var ctx;
	var dt = 0.1;
	
	var pointCollection;
	
	function init() {
		updateCanvasDimensions();
		
		var g = [new Point(202, 78, 0.0, 9, "#ed9d33"), new Point(348, 83, 0.0, 9, "#d44d61"), new Point(256, 69, 0.0, 9, "#4f7af2"), new Point(214, 59, 0.0, 9, "#ef9a1e"), new Point(265, 36, 0.0, 9, "#4976f3"), new Point(300, 78, 0.0, 9, "#269230"), new Point(294, 59, 0.0, 9, "#1f9e2c"), new Point(45, 88, 0.0, 9, "#1c48dd"), new Point(268, 52, 0.0, 9, "#2a56ea"), new Point(73, 83, 0.0, 9, "#3355d8"), new Point(294, 6, 0.0, 9, "#36b641"), new Point(235, 62, 0.0, 9, "#2e5def"), new Point(353, 42, 0.0, 8, "#d53747"), new Point(336, 52, 0.0, 8, "#eb676f"), new Point(208, 41, 0.0, 8, "#f9b125"), new Point(321, 70, 0.0, 8, "#de3646"), new Point(8, 60, 0.0, 8, "#2a59f0"), new Point(180, 81, 0.0, 8, "#eb9c31"), new Point(146, 65, 0.0, 8, "#c41731"), new Point(145, 49, 0.0, 8, "#d82038"), new Point(246, 34, 0.0, 8, "#5f8af8"), new Point(169, 69, 0.0, 8, "#efa11e"), new Point(273, 99, 0.0, 8, "#2e55e2"), new Point(248, 120, 0.0, 8, "#4167e4"), new Point(294, 41, 0.0, 8, "#0b991a"), new Point(267, 114, 0.0, 8, "#4869e3"), new Point(78, 67, 0.0, 8, "#3059e3"), new Point(294, 23, 0.0, 8, "#10a11d"), new Point(117, 83, 0.0, 8, "#cf4055"), new Point(137, 80, 0.0, 8, "#cd4359"), new Point(14, 71, 0.0, 8, "#2855ea"), new Point(331, 80, 0.0, 8, "#ca273c"), new Point(25, 82, 0.0, 8, "#2650e1"), new Point(233, 46, 0.0, 8, "#4a7bf9"), new Point(73, 13, 0.0, 8, "#3d65e7"), new Point(327, 35, 0.0, 6, "#f47875"), new Point(319, 46, 0.0, 6, "#f36764"), new Point(256, 81, 0.0, 6, "#1d4eeb"), new Point(244, 88, 0.0, 6, "#698bf1"), new Point(194, 32, 0.0, 6, "#fac652"), new Point(97, 56, 0.0, 6, "#ee5257"), new Point(105, 75, 0.0, 6, "#cf2a3f"), new Point(42, 4, 0.0, 6, "#5681f5"), new Point(10, 27, 0.0, 6, "#4577f6"), new Point(166, 55, 0.0, 6, "#f7b326"), new Point(266, 88, 0.0, 6, "#2b58e8"), new Point(178, 34, 0.0, 6, "#facb5e"), new Point(100, 65, 0.0, 6, "#e02e3d"), new Point(343, 32, 0.0, 6, "#f16d6f"), new Point(59, 5, 0.0, 6, "#507bf2"), new Point(27, 9, 0.0, 6, "#5683f7"), new Point(233, 116, 0.0, 6, "#3158e2"), new Point(123, 32, 0.0, 6, "#f0696c"), new Point(6, 38, 0.0, 6, "#3769f6"), new Point(63, 62, 0.0, 6, "#6084ef"), new Point(6, 49, 0.0, 6, "#2a5cf4"), new Point(108, 36, 0.0, 6, "#f4716e"), new Point(169, 43, 0.0, 6, "#f8c247"), new Point(137, 37, 0.0, 6, "#e74653"), new Point(318, 58, 0.0, 6, "#ec4147"), new Point(226, 100, 0.0, 5, "#4876f1"), new Point(101, 46, 0.0, 5, "#ef5c5c"), new Point(226, 108, 0.0, 5, "#2552ea"), new Point(17, 17, 0.0, 5, "#4779f7"), new Point(232, 93, 0.0, 5, "#4b78f1")];
		
		gLength = g.length;
		for (var i = 0; i < gLength; i++) {
			g[i].curPos.x = (canvasWidth/2 - 180) + g[i].curPos.x;
			g[i].curPos.y = (canvasHeight/2 - 65) + g[i].curPos.y;
			
			g[i].originalPos.x = (canvasWidth/2 - 180) + g[i].originalPos.x;
			g[i].originalPos.y = (canvasHeight/2 - 65) + g[i].originalPos.y;
		};
		
		pointCollection = new PointCollection();
		pointCollection.points = g;
		
		initEventListeners();
		timeout();
	};
	
	function initEventListeners() {
		$(window).bind('resize', updateCanvasDimensions).bind('mousemove', onMove);
		
		canvas.get(0).ontouchmove = function(e) {
			e.preventDefault();
			onTouchMove(e);
		};
		
		canvas.get(0).ontouchstart = function(e) {
			e.preventDefault();
		};
	};
	
	function updateCanvasDimensions() {
		canvas.attr({height: $(window).height(), width: $(window).width()});
		canvasWidth = canvas.width();
		canvasHeight = canvas.height();

		draw();
	};
	
	function onMove(e) {
		if (pointCollection)
			pointCollection.mousePos.set(e.pageX, e.pageY);
	};
	
	function onTouchMove(e) {
		if (pointCollection)
			pointCollection.mousePos.set(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
	};
	
	function timeout() {
		draw();
		update();
		
		setTimeout(function() { timeout() }, 30);
	};
	
	function draw() {
		var tmpCanvas = canvas.get(0);

		if (tmpCanvas.getContext == null) {
			return; 
		};
		
		ctx = tmpCanvas.getContext('2d');
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		
		if (pointCollection)
			pointCollection.draw();
	};
	
	function update() {		
		if (pointCollection)
			pointCollection.update();
	};
	
	function Vector(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
 
		this.addX = function(x) {
			this.x += x;
		};
		
		this.addY = function(y) {
			this.y += y;
		};
		
		this.addZ = function(z) {
			this.z += z;
		};
 
		this.set = function(x, y, z) {
			this.x = x; 
			this.y = y;
			this.z = z;
		};
	};
	
	function PointCollection() {
		this.mousePos = new Vector(0, 0);
		this.points = new Array();
		
		this.newPoint = function(x, y, z) {
			var point = new Point(x, y, z);
			this.points.push(point);
			return point;
		};
		
		this.update = function() {		
			var pointsLength = this.points.length;
			
			for (var i = 0; i < pointsLength; i++) {
				var point = this.points[i];
				
				if (point == null)
					continue;
				
				var dx = this.mousePos.x - point.curPos.x;
				var dy = this.mousePos.y - point.curPos.y;
				var dd = (dx * dx) + (dy * dy);
				var d = Math.sqrt(dd);
				
				if (d < 150) {
					point.targetPos.x = (this.mousePos.x < point.curPos.x) ? point.curPos.x - dx : point.curPos.x - dx;
					point.targetPos.y = (this.mousePos.y < point.curPos.y) ? point.curPos.y - dy : point.curPos.y - dy;
				} else {
					point.targetPos.x = point.originalPos.x;
					point.targetPos.y = point.originalPos.y;
				};
				
				point.update();
			};
		};
		
		this.draw = function() {
			var pointsLength = this.points.length;
			for (var i = 0; i < pointsLength; i++) {
				var point = this.points[i];
				
				if (point == null)
					continue;

				point.draw();
			};
		};
	};
	
	function Point(x, y, z, size, colour) {
		this.colour = colour;
		this.curPos = new Vector(x, y, z);
		this.friction = 0.8;
		this.originalPos = new Vector(x, y, z);
		this.radius = size;
		this.size = size;
		this.springStrength = 0.1;
		this.targetPos = new Vector(x, y, z);
		this.velocity = new Vector(0.0, 0.0, 0.0);
		
		this.update = function() {
			var dx = this.targetPos.x - this.curPos.x;
			var ax = dx * this.springStrength;
			this.velocity.x += ax;
			this.velocity.x *= this.friction;
			this.curPos.x += this.velocity.x;
			
			var dy = this.targetPos.y - this.curPos.y;
			var ay = dy * this.springStrength;
			this.velocity.y += ay;
			this.velocity.y *= this.friction;
			this.curPos.y += this.velocity.y;
			
			var dox = this.originalPos.x - this.curPos.x;
			var doy = this.originalPos.y - this.curPos.y;
			var dd = (dox * dox) + (doy * doy);
			var d = Math.sqrt(dd);
			
			this.targetPos.z = d/100 + 1;
			var dz = this.targetPos.z - this.curPos.z;
			var az = dz * this.springStrength;
			this.velocity.z += az;
			this.velocity.z *= this.friction;
			this.curPos.z += this.velocity.z;
			
			this.radius = this.size*this.curPos.z;
			if (this.radius < 1) this.radius = 1;
		};
		
		this.draw = function() {
			ctx.fillStyle = this.colour;
			ctx.beginPath();
			ctx.arc(this.curPos.x, this.curPos.y, this.radius, 0, Math.PI*2, true);
			ctx.fill();
		};
	};
	
	init();
});