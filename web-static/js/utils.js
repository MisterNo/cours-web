window.requestAnimFrame = (function() {
	  return window.requestAnimationFrame ||
	         window.webkitRequestAnimationFrame ||
	         window.mozRequestAnimationFrame ||
	         window.oRequestAnimationFrame ||
	         window.msRequestAnimationFrame ||
	         function(callback, element) {
	           window.setTimeout(callback, 1000/60);
	         };
})();

function encrypt(){
	var form = document.getElementById("connect-form");
	form.password.value = Aes.Ctr.encrypt(form.password.value, '09ed931e1782289f8f9a42f837a46fa0', 256);
	return true;
}
$.coursWeb = {
	api: function(action, data, callback){
		var dataToSend = {
			action: action,
			data: data
		};
		$.ajax({
			url: 'api.php',
			type: 'POST',
			data: {d: Aes.Ctr.encrypt(JSON.stringify(dataToSend), '09ed931e1782289f8f9a42f837a46fa0', 256)},
			error: function(xhr, msg, msg2){
				alert(msg2);
			},
			success: function(data){
				var clearData = Aes.Ctr.decrypt(data, '09ed931e1782289f8f9a42f837a46fa0', 256);
				var result = JSON.parse(clearData);
				if(result.error){
					alert(result.error);
				}else if(typeof(callback) == "function"){
					callback(result);
				}
			}
		});
	}
};


$.getTimeMillis = function(){
	return new Date().getTime();
};
$.getTimeFloat = function(){
	return $.getTimeMillis() / 1000;
};
var localTime = Math.floor(new Date().getTime() / 1000);
$.getTime = function(){
	var timeElapsed = Math.floor($.getTimeFloat()) - localTime;
	return serverTime + timeElapsed;
};
$.getElmRegion = function(elm){
	var pos = elm.offset();
	var rootPos = gameManager.root.offset();
	var posX = pos.left - rootPos.left;
	var posY = pos.top - rootPos.top;
	var w = elm.width();
	var h = elm.height();
	return {
		posX: posX,
		posY: posY,
		width: w,
		height: h
	};
};

$.ease = function(from, to, func, options){
	var isObject = true;
	if(typeof from != "object"){
		from = {v: from};
		to = {v: to};
		isObject = false;
	}
	var o = {};
	if(options){
		for(i in options){
			o[i] = options[i];
		}
	}
	o.step = function(f){
		if(isObject){
			var res = {};
			for(i in from){
				res[i] = f * (to[i] - from[i]) + from[i];
			}
			func(res);
		}else{
			func(f * (to.v - from.v) + from.v);
		}
	};
	var listener = $({f:0});
	if(options && options.delay){
		listener.delay(options.delay).animate({f:1}, o);
	}else{
		listener.animate({f:1}, o);
	}
	return listener;
};

$.shuffle = function(list){
	var i, j, t;
	for (i = 1; i < list.length; i++) {
		j = Math.floor(Math.random() * (1 + i));
		if (j != i) {
			t = list[i];
			list[i] = list[j];
			list[j] = t;
		}
	}
};