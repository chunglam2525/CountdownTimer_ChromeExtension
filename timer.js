var hr, min, sec, ms;
var c_hr, c_min, c_sec, c_ms;
var mode = false;

var bgPage = chrome.extension.getBackgroundPage();

chrome.storage.local.get(null, function (result) {
	hr = result.hr
	min = result.min
	sec = result.sec
	ms = result.ms

	c_hr = result.c_hr
	c_min = result.c_min
	c_sec = result.c_sec
	c_ms = result.c_ms
	if (typeof mode !== "undefined"){
		mode = result.mode
	}
	if (!mode){
		$("#timer-setting").show();
		$("#timer-setting :input").prop("disabled", false);
		$("#count-setting").hide();
		$("#count-setting :input").prop("disabled", true);
	} else{
		$("#timer-setting").hide();
		$("#timer-setting :input").prop("disabled", true);
		$("#count-setting").show();
		$("#count-setting :input").prop("disabled", false);
	}
	displayTime("timer",c_hr,c_min,c_sec,c_ms)
})

chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (key in changes) {
		window[key] = changes[key].newValue;
    }
	displayTime("timer",c_hr,c_min,c_sec,c_ms)
});

function displayTime(id,h,m,s,ms) {
	if (h < 0) {
		document.getElementById("timer").innerHTML = "End";
	} else {
		document.getElementById(id).innerHTML = 
			h + ":" + 
			('0' + m).slice(-2) + ":" + 
			('0' + s).slice(-2) + ":" + 
			('00' + ms).slice(-3);
	}
}

function toggleButton() {
	console.log("pressed")
	bgPage.setCount();
	if (mode){
		$("#timer-setting").show();
		$("#timer-setting :input").prop("disabled", false);
		$("#count-setting").hide();
		$("#count-setting :input").prop("disabled", true);
	} else{
		$("#timer-setting").hide();
		$("#timer-setting :input").prop("disabled", true);
		$("#count-setting").show();
		$("#count-setting :input").prop("disabled", false);
	}
	chrome.storage.local.set({
		"mode": !mode
	}, function () {
		console.log("Storage Succesful");
	});
}

$(function() {
	$( "#24hr" ).click(function() {bgPage.addTime(24,0,0,0);});
	$( "#1hr" ).click(function() {bgPage.addTime(1,0,0,0);});
	$( "#10min" ).click(function() {bgPage.addTime(0,10,0,0);});
	$( "#1min" ).click(function() {bgPage.addTime(0,1,0,0);});
	$( "#10s" ).click(function() {bgPage.addTime(0,0,10,0);});
	$( "#1s" ).click(function() {bgPage.addTime(0,0,1,0);});
	$( "#10ms" ).click(function() {bgPage.addTime(0,0,0,10);});
	$( "#reset-time" ).click(function() {bgPage.resetTime();});
	$( "#confirm" ).click(function() {toggleButton();});
	$( "#start" ).click(function() {bgPage.startCount();});
	$( "#stop" ).click(function() {bgPage.stopCount();});
	$( "#reset-count" ).click(function() {bgPage.setCount();});
	$( "#back" ).click(function() {toggleButton();});
});