var hr = 0
var min = 0
var sec = 0
var ms = 0

var c_hr = 0
var c_min = 0
var c_sec = 0
var c_ms = 0

function storeVar() {
	chrome.storage.local.set({
		"hr": hr,
		"min": min,
		"sec": sec,
		"ms": ms,
		"c_hr": c_hr,
		"c_min": c_min,
		"c_sec": c_sec,
		"c_ms": c_ms
	}, function () {
		console.log("Storage Succesful");
	});
}

storeVar();

function syncSetCount() {
	c_hr = hr
	c_min = min
	c_sec = sec
	c_ms = ms
	storeVar();
}

function resetTime() {
	stopCount();
	hr = 0;
	min = 0;
	sec = 0;
	ms = 0;
	syncSetCount();
}

function addTime(_h,_m,_s,_ms) {
	ms += _ms
	if (ms >= 1000) {
		sec += ~~(ms/1000)
		ms = ms%1000
	}
	sec += _s
	if (sec >= 60) {
		min += ~~(sec/60)
		sec = sec%60
	}
	min += _m
	if (min >= 60) {
		hr += ~~(min/60)
		min = min%60
	}
	hr += _h
	syncSetCount();
}

function setCount() {
	stopCount();
	syncSetCount();
}

function Interval(fn, time) {
    var timer = false;
    this.start = function () {
        if (!this.isRunning())
            timer = setInterval(fn, time);
    };
    this.stop = function () {
        clearInterval(timer);
        timer = false;
    };
    this.isRunning = function () {
        return timer !== false;
    };
}
var opts = {
	type: 'basic',
    title: 'Countdown Timer',
    message: 'Times Up',
	iconUrl:'clock16.png',
    priority: 1,
};
var lastUpdate;
var count = new Interval(function() {
	var thisUpdate = new Date().getTime();
	var diff = thisUpdate - lastUpdate;
	c_ms -= diff
	if (c_ms < 0) {
		c_sec -= ~~((-c_ms+1000)/1000)
		c_ms = 1000+c_ms%1000
	}
	if (c_sec < 0) {
		c_min -= ~~((-c_sec+60)/60)
		c_sec = 60+c_sec%60
	}
	if (c_min < 0) {
		c_hr -= ~~((-c_min+60)/60)
		c_min = 60+c_min%60
	}
	lastUpdate = thisUpdate;
	storeVar();
	// If the count down is over
	if (c_hr < 0) {
		count.stop();
		chrome.notifications.create(opts, function () {
			console.log("Popup Notification");
		});
	}
}, 3);

function startCount() {
	if (!count.isRunning()){
		lastUpdate = new Date().getTime();
		count.start();
	}
}

function stopCount() {
	count.stop();
}