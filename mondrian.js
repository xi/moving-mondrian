var speed = 2;  // percent per second

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
}

var getRelSize = function(element) {
	var root = element.closest(".mondrian");
	return getSize(element) / getSize(root);
}

var animate = function(element, delta) {
	if (element.children.length) {
		for (var i = 0; i < element.children.length; i++) {
			animate(element.children[i], delta);
		}

		var pos = parseFloat(element.style.getPropertyValue("--pos"));
		if (element.dataset.grow) {
			pos += delta / 1000 / 100 * speed;
			if (pos >= 1){
				element.before(element.children[0]);
				element.remove();
			} else {
				element.style.setProperty("--pos", pos);
			}
		} else {
			pos -= delta / 1000 / 100 * speed;
			if (pos <= 0){
				element.before(element.children[1]);
				element.remove();
			} else {
				element.style.setProperty("--pos", pos);
			}
		}
	} else if (Math.random() < delta / 1000 * getRelSize(element)){
		var grow = Math.random() < 0.5;
		var div = document.createElement("div");
		var other = createLeaf();
		element.before(div);
		if (grow) {
			div.dataset.grow = true;
			div.style.setProperty("--pos", 0);
			div.append(other);
			div.append(element);
		} else {
			div.style.setProperty("--pos", 1);
			div.append(element);
			div.append(other);
		}
		div.dataset.dir = (Math.random() < 0.5) ? "vertical" : "horizontal";
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
