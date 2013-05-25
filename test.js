var Parser = require("./app"),
	p = new Parser();

p.addRule(/![<>]?(?:\[.*\])?\(.*\)/gi, function(image) {
	var m = image.match(/!([<>]?)(?:\[(.*)\])?\((.*)\)/i),
		ret = "<img src=\"" + m[3] + "\" ";

	if (m[2]) ret += "alt=\"" + m[2] + "\" ";
	if (m[1]) ret += "style=\"float: " + (m[1] == ">" ? "right" : "left") + ";\" ";

	ret += "/>";
	return ret;
});

p.addPreset("tag", function(str) {
	return "<span style=\"color: red;\">" + str + "</span>";
});

p.addPreset("url", function(link) {
	var display = link.replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/\/$/i, "");
	return "<a href=\"" + link + "\">" + display + "</a>";
});

p.addPreset("email", function(email) {
	return "<a href=\"mailto:" + email + "\">" + email + "</a>";
});

var text = "!<[Dubstep Conductor](http://i.imgur.com/izBvWRq.jpg)\n\nSed posuere consectetur user@example.com est at lobortis. Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Cras justo odio, dapibus ac #facilisis in, egestas eget quam. Integer #posuere erat a ante venenatis dapibus posuere velit aliquet. Maecenas sed diam eget risus varius blandit sit #amet non magna. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. http://apple.com/ Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras justo odio, dapibus ac facilisis in, egestas eget quam.";

console.log(p.parse(text));