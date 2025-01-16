var speed = 2;  // percent per second
var easing_factor = 0.6;
var easing_max = Math.tan(Math.PI / 2 * easing_factor);


var createLeaf = function() {
	var element = document.createElement("div");
	var r = Math.random();
	if (r < 1/8) {
		element.style.backgroundColor = "red";
	} else if (r < 2/8) {
		element.style.backgroundColor = "yellow";
	} else if (r < 3/8) {
		element.style.backgroundColor = "blue";
	} else {
		element.style.backgroundColor = "white";
	}
	return element;
};

var getSize = function(element) {
	var rect = element.getBoundingClientRect();
	return rect.width * rect.height;
};

var getRelSize = function(element) {
	var root = element.closest(".mondrian");
	return getSize(element) / getSize(root);
};

var easing = function(x) {
	var xx = (x - 0.5) * Math.PI * easing_factor;
	var yy = Math.tan(xx);
	return yy / easing_max / 2 + 0.5;
};

var setPos = function(element, x) {
	element.style.setProperty("--pos-raw", x);
	element.style.setProperty("--pos", easing(x));
};

var animate = function(element, delta) {
	if (element.children.length) {
		for (var i = 0; i < element.children.length; i++) {
			animate(element.children[i], delta);
		}

		var x = parseFloat(element.style.getPropertyValue("--pos-raw"));
		if (element.dataset.grow) {
			x += delta / 1000 / 100 * speed;
			if (x >= 1){
				element.before(element.children[0]);
				element.remove();
			} else {
				setPos(element, x);
			}
		} else {
			x -= delta / 1000 / 100 * speed;
			if (x <= 0){
				element.before(element.children[1]);
				element.remove();
			} else {
				setPos(element, x);
			}
		}
	} else if (Math.random() < delta / 1000 * getRelSize(element)){
		var grow = Math.random() < 0.5;
		var div = document.createElement("div");
		var other = createLeaf();
		element.before(div);
		if (grow) {
			div.dataset.grow = true;
			setPos(div, 0);
			div.append(other);
			div.append(element);
		} else {
			setPos(div, 1);
			div.append(element);
			div.append(other);
		}

		var rect = element.getBoundingClientRect();
		if (Math.random() * rect.height < 0.5 * rect.width) {
			div.dataset.dir = "vertical";
		} else {
			div.dataset.dir = "horizontal";
		}
	}
};

var img = document.querySelector(".mondrian");
var prev_time = 0;
img.append(createLeaf());

var wrapper = function(time) {
	var delta = time - prev_time;
	prev_time = time;
	animate(img.children[0], delta);
	requestAnimationFrame(wrapper);
};

requestAnimationFrame(wrapper);
